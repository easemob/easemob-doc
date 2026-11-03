# 登录

初始化 Flutter SDK 后，应用需要使用用户 ID 和用户 Token 登录。登录成功并连接到 IM 服务器后，才能调用需要访问服务器的即时通讯功能。

## 用户注册

登录 SDK 前，你需要先创建环信 IM 用户。创建用户前，需先在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯 > 基础功能** > **用户** 页面设置用户注册模式。

用户注册模式分为以下两种：

- **授权注册**：通过环信提供的 REST API 注册用户。该方式适用于正式生产环境，注册成功后，你可以将用户账号保存到你的应用服务器或返回给客户端。
- **开放注册**：允许通过 REST API 注册用户。该方式一般用于体验 Demo 和测试环境，正式环境不推荐使用。

设置注册模式后，你可以通过以下方式创建用户：

1. **调用 REST API 创建用户**

   - 授权注册：调用 [授权注册单个用户](/document/server-side/account_register_authorized_single.html) 或 [批量授权注册用户](/document/server-side/account_register_authorized_batch.html) 接口创建用户。
   - 开放注册：开启开放注册后，可通过 [REST API 开放注册用户](/document/server-side/account_register_open.html) 创建用户。

2. **通过环信控制台创建用户**

   你可以在 [环信控制台](https://console.easemob.com/user/login) 创建正式环境或测试环境下的用户，详见 [创建用户](/product/console/operation_user.html#创建用户)。

## 登录

SDK 通过用户 ID 和 IM Token 登录。调用 `loginWithToken` 时，需传入 `userId` 和 `token`。登录成功后，SDK 会建立到消息服务的长连接。

测试环境下，你在 [环信控制台](https://console.easemob.com/user/login) 创建用户后，环信服务器会自动为这些用户分配用户 Token，详见 [创建用户](/product/console/operation_user.html#创建用户)。

生产环境中，建议在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html)，由客户端从你的应用服务器获取用户 Token 后再登录 SDK。

```dart
try {
  await ChatClient.getInstance.loginWithToken(userId, token);
  // 登录成功。
} on ChatError catch (e) {
  // 登录失败，根据 e.code 和 e.description 处理。
}
```

:::tip
应用可以通过 `ChatClient.isConnected()` 判断服务器连接状态，但不能依赖 SDK 自动发起登录。
:::

## 登录完成前使用本地数据库

Flutter SDK 支持在在线登录完成前使用本地数据库。应用初始化 SDK 并注册 `ConnectionEventHandler` 后，调用 `ChatClient.loginWithToken`。SDK 会在登录流程中自动打开当前用户的本地数据库，并在打开完成后触发 `onDatabaseOpened(String username, ChatError? error)`。`error` 为 `null` 时表示数据库打开成功。此时，即使在线登录尚未完成，应用也可以读取该用户的本地缓存数据，提前展示会话列表等页面内容；调用需要访问服务器的接口时，仍需等待登录成功，并通过 `onConnected` 确认连接已建立。

在调用 `loginWithToken` 前注册 `ConnectionEventHandler`，通过 `onDatabaseOpened` 监听数据库打开事件。回调中的 `username` 表示当前打开的数据库所属用户，`error` 表示打开数据库时发生的错误。Android 平台当前固定返回 `null`，iOS 平台会透传数据库打开错误。

应用应根据 `onDatabaseOpened` 的 `error` 参数判断数据库是否打开成功。

```dart
const String handlerId = 'LOGIN_CONNECTION_HANDLER';

final ConnectionEventHandler connectionEventHandler =
    ConnectionEventHandler(
  onConnected: () {
    // 已成功连接到 IM 服务器，可以调用需要联网的接口。
  },
  onDisconnected: (errorCode, info) {
    // SDK 与 IM 服务器断开连接，可根据 errorCode 处理。
  },
  onDatabaseOpened: (username, error) async {
    if (error == null) {
      // username 对应的本地数据库已打开。
      final List<ChatConversation> conversations = await ChatClient
          .getInstance.chatManager
          .loadAllConversations();

      // 使用本地会话数据刷新页面。
    } else {
      // 本地数据库打开失败。
    }
  },
);

// 在发起登录前注册监听器。
ChatClient.getInstance.addConnectionEventHandler(
  handlerId,
  connectionEventHandler,
);

try {
  await ChatClient.getInstance.loginWithToken(userId, token);
  // 在线登录成功。
} on ChatError catch (e) {
  // 在线登录失败，根据错误信息处理。
}
```

不再需要监听时，应移除监听器：

```dart
ChatClient.getInstance.removeConnectionEventHandler(handlerId);
```

:::tip
`onDatabaseOpened` 只表示指定用户的本地数据库已经打开，不表示在线登录成功，也不表示服务端数据同步完成。数据库打开后可以使用本地数据接口；调用需要访问服务器的接口前，仍需等待登录和连接成功。若初始化时通过 `ChatOptions.dataSyncType` 配置了登录后数据同步，需要等待相应的 `onDataSyncFinish` 回调成功后，再将本地查询结果视为本次登录后的最新数据。
:::

## Token 续期

使用 Token 登录后，SDK 会通过 `ConnectionEventHandler.onTokenWillExpire` 和 `ConnectionEventHandler.onTokenDidExpire` 通知 Token 状态：

- `onTokenWillExpire`：Token 即将过期时触发。应用应从业务服务器获取新 Token，并调用 `ChatClient.renewToken` 更新。
- `onTokenDidExpire`：Token 已过期时触发。此时用户已经退出登录，应用应获取新 Token，并重新调用 `loginWithToken` 登录。

收到 `onTokenWillExpire` 回调后，应用应从自己的业务服务器获取新的 IM Token，并调用 `ChatClient.renewToken(String token)` 更新 Token。该异步方法正常返回表示更新成功；若抛出 `ChatError`，表示更新失败，可根据错误码和错误信息进行处理。

```dart
final ConnectionEventHandler connectionEventHandler =
    ConnectionEventHandler(
  onTokenWillExpire: () async {
    // getNewTokenFromAppServer 仅表示从应用服务器异步获取新 Token 的业务逻辑，并非 SDK 接口。
    final String newToken = await getNewTokenFromAppServer();
    try {
      await ChatClient.getInstance.renewToken(newToken);
      // Token 更新成功。
    } on ChatError catch (e) {
      // Token 更新失败。
    }
  },
  onTokenDidExpire: () {
    // Token 已过期，获取新 Token 后重新登录。
  },
);

ChatClient.getInstance.addConnectionEventHandler(
  'TOKEN_CONNECTION_HANDLER',
  connectionEventHandler,
);
```

## 获取当前登录的用户

调用 `ChatClient.getCurrentUserId` 获取 SDK 当前记录的用户 ID：

```dart
final String? currentUser =
    await ChatClient.getInstance.getCurrentUserId();
```

也可以读取同步缓存属性 `ChatClient.currentUserId`。SDK 初始化、`loginWithToken` 成功以及主动调用 `getCurrentUserId` 获取结果时，都会刷新该缓存；`logout` 成功后清空。**`currentUserId` 为 Dart 侧缓存，不应仅凭其是否为空判断登录状态。请结合登录、退出结果及连接事件维护业务侧登录状态。**

## 退出登录

调用 `ChatClient.logout` 退出当前账号。`unbindDeviceToken` 表示退出时是否解绑设备推送 Token：

- （默认）`true`：解绑设备推送 Token。
- `false`：不解绑设备推送 Token。

通过异步方法的返回结果获取退出结果：

```dart
try {
  await ChatClient.getInstance.logout(true);
  // 退出成功。
} on ChatError catch (e) {
  // 退出失败。
}
```

:::tip
1. 如果应用集成了 FCM 等第三方推送，退出登录时建议将 `logout` 方法的 `unbindDeviceToken` 参数设置为 `true`，使 SDK 同时解绑当前设备的推送 Token。否则，退出登录后仍可能收到当前账号的离线推送通知。

如果因网络异常导致推送 Token 解绑失败，`logout` 会抛出 `ChatError`。应用可以提示用户解绑失败及继续退出后可能仍收到推送的风险。若用户确认继续退出，可以将 `unbindDeviceToken` 设置为 `false`，再次调用 `logout`，仅退出 IM 账号而不解绑推送 Token。网络恢复后，应在适当时机处理遗留的推送 Token 解绑问题，不建议通过后台任务无限重试。

2. 调用异步退出方法 `logout` 时，应等待该方法正常返回后，再调用 `loginWithToken` 登录其他账号或执行依赖退出完成的操作。若抛出 `ChatError`，表示退出或推送 Token 解绑失败，应用应根据错误码和业务场景进行处理。
:::

## 账号切换

从当前账号切换到其他账号时，应先调用 `logout`，待退出成功后，再使用新账号的用户 ID 和 Token 调用 `loginWithToken`。不要在当前账号尚未退出时直接发起其他账号的登录。

## 多设备登录

Flutter SDK 支持同一账号在多个设备上登录。多设备登录的设备数量、互踢策略和数据同步规则由服务端配置决定。若登录设备数量超过限制，新登录设备可能会将已登录设备踢下线。详见 [多设备登录](multi_device.html)。

**配置登录设备信息**

Flutter SDK 可以通过以下 `ChatOptions.withAppKey` 参数配置当前登录设备的信息：

| 参数 | 参数类型 | 说明 |
| :--- | :--- | :--- |
| `osType` | `int` | 设置登录设备的自定义平台编号，取值范围为 1–100。必须在初始化 SDK 前设置。 |
| `deviceName` | `String` | 设置当前设备的自定义名称，用于在多设备登录场景中区分设备。必须在初始化 SDK 前设置；未设置时默认使用设备型号。 |
| `loginExtension` | `String` | 设置当前设备的登录扩展信息，最大长度为 1024 个字符。SDK 初始化前设置时对后续登录生效；SDK 已初始化时，应在下一次调用 `loginWithToken` 前通过 `updateLoginExtensionInfoSetting` 更新。 |

示例代码如下：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  // 以下两项需要在初始化 SDK 前设置。
  osType: 10,
  deviceName: 'flutter-custom-device',
  // 登录扩展信息也可以在初始化 SDK 前设置。
  loginExtension: 'login from Flutter',
);

await ChatClient.getInstance.init(options);

try {
  await ChatClient.getInstance.loginWithToken(userId, token);
  // 登录成功。
} on ChatError catch (e) {
  // 登录失败。
}
```

如果 SDK 已经初始化，需要在下一次登录前更新登录扩展信息，可以调用：

```dart
await ChatClient.getInstance.updateLoginExtensionInfoSetting(
  'login from Flutter',
);

await ChatClient.getInstance.loginWithToken(userId, token);
```

**设备互踢**

当多设备登录策略导致当前设备被强制退出时，SDK 会触发 `ConnectionEventHandler.onDisconnected(int? errorCode, LoginExtensionInfo? info)`。应用可以根据 `errorCode` 判断退出原因，并按业务需要提示用户或引导用户重新登录。

当 `errorCode` 为 `ChatDisconnectErrorCode.USER_LOGIN_ANOTHER_DEVICE` 时，可以通过 `LoginExtensionInfo` 获取将当前设备踢下线的新设备信息：

- `deviceName`：获取新登录设备的自定义设备名称；未设置时通常为设备型号。
- `ext`：获取新登录设备通过 `loginExtension` 或 `updateLoginExtensionInfoSetting` 设置的扩展信息。

```dart
final ConnectionEventHandler connectionEventHandler =
    ConnectionEventHandler(
  onConnected: () {
  },
  onDisconnected: (errorCode, info) {
    switch (errorCode) {
      case ChatDisconnectErrorCode.USER_LOGIN_ANOTHER_DEVICE:
        final String? deviceName = info?.deviceName;
        final String? deviceExt = info?.ext;
        // 当前账号在其他设备登录，当前设备被踢下线。
        break;

      case ChatDisconnectErrorCode.USER_KICKED_BY_CHANGE_PASSWORD:
        // 因密码变更被踢下线。
        break;

      case ChatDisconnectErrorCode.USER_KICKED_BY_OTHER_DEVICE:
        // 在其他设备、控制台或通过服务端接口被强制退出。
        break;

      case ChatDisconnectErrorCode.USER_LOGIN_TOO_MANY_DEVICES:
        // 登录设备数量超过限制。
        break;

      case ChatDisconnectErrorCode.USER_BIND_ANOTHER_DEVICE:
        // 当前账号绑定了其他设备。
        break;

      case ChatDisconnectErrorCode.USER_DEVICE_CHANGED:
        // 登录设备发生变化。
        break;

      default:
        // 其他原因可能只是连接中断。根据 ChatDisconnectErrorCode 分类处理；
        // 对连接原因无需重新登录，SDK 会自动重连。
        break;
    }
  },
);

ChatClient.getInstance.addConnectionEventHandler(
  'MULTI_DEVICE_CONNECTION_HANDLER',
  connectionEventHandler,
);
```

常见多设备相关断开原因码如下。

| 场景 | 断开原因码 | 说明 |
| :--- | :--- | :--- |
| 用户在其他设备登录并将当前设备踢下线 | `206` / `USER_LOGIN_ANOTHER_DEVICE` | 可以提示用户账号已在其他设备登录，并读取新设备的名称和扩展信息。 |
| 当前账号绑定了其他设备 | `213` / `USER_BIND_ANOTHER_DEVICE` | 应根据设备绑定策略引导用户处理。 |
| 登录设备数量超过限制 | `214` / `USER_LOGIN_TOO_MANY_DEVICES` | 应先处理设备数量限制，不建议直接反复登录。 |
| 用户因修改密码被踢下线 | `216` / `USER_KICKED_BY_CHANGE_PASSWORD` | 应重新获取有效 Token 后登录。 |
| 用户在其他设备、控制台或通过服务端接口被强制退出 | `217` / `USER_KICKED_BY_OTHER_DEVICE` | 可以提示用户当前账号已被强制退出。 |
| 登录设备发生变化 | `220` / `USER_DEVICE_CHANGED` | 应根据业务场景提示用户并重新登录。 |

:::tip
在 Flutter SDK 5.x 的 iOS 端，其他设备登录和登录设备发生变化这两类场景共用原生回调，Flutter 侧统一收到 `ChatDisconnectErrorCode.USER_LOGIN_ANOTHER_DEVICE（206）`，无法通过该原因码进一步区分。收到此通知后，应按登录状态已失效处理。
:::

**获取其他设备的登录 ID**

调用 `ChatContactManager.getSelfIdsOnOtherPlatform` 可以从服务器获取当前账号在其他设备上的登录 ID。调用该接口前，用户应已登录并连接到 IM 服务器。

```dart
try {
  final List<String> loginIds = await ChatClient
      .getInstance.contactManager
      .getSelfIdsOnOtherPlatform();
  // loginIds 为当前账号在其他设备上的登录 ID。
} on ChatError catch (e) {
  // 获取失败。
}
```

登录 ID 的格式为 `userId/resource`：

- `userId`：当前登录用户的用户 ID。
- `resource`：登录设备的资源标识。

例如，登录 ID 为 `alice/flutter_xxx` 时，`alice` 是用户 ID，`flutter_xxx` 是对应登录设备的资源标识。

## 更多

### 登录被封禁账号的提示

若用户账号已通过环信控制台或 REST API 被禁用，调用 `ChatClient.loginWithToken` 登录时会抛出 `ChatError`，并返回错误码 `SERVER_SERVICE_RESTRICTED`（305）。该错误码表示 IM 服务或当前应用功能被限制。应用应结合服务配置和服务端返回的错误信息进行处理，不建议依赖 `"service is disabled"` 等错误文本进行判断。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`loginWithToken`](#登录) | `ChatClient` | 使用用户 ID 和 Token 登录。 |
| [`onDatabaseOpened`](#登录完成前使用本地数据库) | `ConnectionEventHandler` | 通知指定用户的本地数据库已经打开。 |
| [`loadAllConversations`](#登录完成前使用本地数据库) | `ChatManager` | 获取置顶优先并按最后一条消息时间倒序排列的本地会话列表。 |
| [`renewToken`](#token-续期) | `ChatClient` | 更新当前登录使用的 Token。 |
| [`getCurrentUserId`](#获取当前登录的用户) | `ChatClient` | 获取 SDK 当前记录的用户 ID。 |
| [`currentUserId`](#获取当前登录的用户) | `ChatClient` | 获取 Dart 侧缓存的当前用户 ID。 |
| [`logout`](#退出登录) | `ChatClient` | 退出当前账号，并按参数决定是否解绑设备推送 Token。 |
| [`ChatOptions.withAppKey`](#多设备登录) | `ChatOptions` | 创建 Flutter SDK 初始化配置。 |
| [`osType`](#多设备登录) | `ChatOptions` | 设置登录设备的自定义平台编号。 |
| [`deviceName`](#多设备登录) | `ChatOptions` | 设置当前设备的自定义名称。 |
| [`loginExtension`](#多设备登录) | `ChatOptions` | 设置当前设备的登录扩展信息。 |
| [`init`](#多设备登录) | `ChatClient` | 使用指定配置初始化 Flutter SDK。 |
| [`updateLoginExtensionInfoSetting`](#多设备登录) | `ChatClient` | 更新下一次登录携带的扩展信息。 |
| [`onDisconnected`](#多设备登录) | `ConnectionEventHandler` | 监听断开连接和强制退出事件。 |
| [`getSelfIdsOnOtherPlatform`](#多设备登录) | `ChatContactManager` | 获取当前账号在其他设备上的登录 ID。 |
