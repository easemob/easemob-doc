# 登录

初始化 React Native SDK 后，应用需要使用用户 ID 和用户 Token 登录。登录成功并连接到 IM 服务器后，才能调用需要访问服务器的即时通讯功能。

## 用户注册

登录 SDK 前，你需要先创建环信 IM 用户。创建用户前，需先在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯 > 基础功能** > **用户** 页面设置用户注册模式。

用户注册模式分为以下两种：

- **授权注册**：通过环信提供的 REST API 注册用户。该方式适用于正式生产环境，注册成功后，你可以将用户账号保存到你的应用服务器或返回给客户端。
- **开放注册**：允许通过 REST API 注册用户。该方式一般用于体验 Demo 和测试环境，正式环境不推荐使用。React Native SDK 5.x 不提供客户端注册接口。

设置注册模式后，你可以通过以下方式创建用户：

1. **调用 REST API 创建用户**

   - 授权注册：调用 [授权注册单个用户](/document/server-side/account_register_authorized_single.html) 或 [批量授权注册用户](/document/server-side/account_register_authorized_batch.html) 接口创建用户。
   - 开放注册：开启开放注册后，可通过 [REST API 开放注册用户](/document/server-side/account_register_open.html) 创建用户。

2. **通过环信控制台创建用户**

   你可以在 [环信控制台](https://console.easemob.com/user/login) 创建正式环境或测试环境下的用户，详见 [创建用户](/product/console/operation_user.html#创建用户)。

## 登录

SDK 通过用户 ID 和 IM Token 登录。调用 `ChatClient#loginWithToken` 时，需传入 `userId` 和 `token`。登录成功后，SDK 会建立到消息服务的长连接。

测试环境下，你在 [环信控制台](https://console.easemob.com/user/login) 创建用户后，环信服务器会自动为这些用户分配用户 Token，详见 [创建用户](/product/console/operation_user.html#创建用户)。

生产环境中，建议在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html)，由客户端从你的应用服务器获取用户 Token 后再登录 SDK。

```typescript
try {
  // 使用用户 ID 和 Token 登录
  await ChatClient.getInstance().loginWithToken(userId, token);
  // 登录成功
} catch (error: unknown) {
  // 登录失败，根据错误信息处理
  console.error('登录失败：', error);
}
```

:::tip
1. 应用可以通过 `ChatClient#isConnected` 判断服务器连接状态，但不能依赖 SDK 自动发起登录。
2. 应用应结合登录、登出的调用结果与连接回调管理登录状态。
:::

## 登录完成前使用本地数据库

SDK 支持在在线登录完成前使用本地数据库。应用初始化 SDK 并注册 `ChatConnectEventListener` 后，调用 `ChatClient#loginWithToken`。SDK 会在登录流程中自动打开当前用户的本地数据库，并通过 `onDatabaseOpened(username, errorCode)` 返回打开结果。`errorCode === 0` 表示打开成功；此时即使在线登录尚未完成，应用也可以读取该用户的本地缓存数据，提前展示会话列表等页面内容；调用需要访问服务器的接口时，仍需等待登录成功，并通过 `onConnected` 确认连接已建立。

在调用 `loginWithToken` 前注册 `ChatConnectEventListener`，通过 `onDatabaseOpened(username, errorCode)` 监听数据库打开结果。回调中的 `username` 表示当前打开的数据库所属用户。React Native SDK 应通过该回调确认本地数据库是否可用。Android 端在数据库打开成功后通知，`errorCode` 为 `0`；iOS 端可通过非 `0` 错误码返回打开失败的结果。

```typescript
const connectionListener: ChatConnectEventListener = {
  onConnected(): void {
    // 已成功连接到 IM 服务器，可以调用需要联网的接口
  },
  onDisconnected(errorCode?: number): void {
    // SDK 与 IM 服务器断开连接，可根据 errorCode 处理
  },
  onDatabaseOpened(username: string, errorCode: number): void {
    if (errorCode !== 0) {
      console.error('打开本地数据库失败：', username, errorCode);
      return;
    }
    // username 对应的本地数据库已打开，读取本地会话
    void ChatClient.getInstance().chatManager.getAllConversations()
      .then((conversations) => {
        // 使用本地会话数据刷新页面
        console.log('本地会话列表：', conversations);
      })
      .catch((error: unknown) => console.error('读取本地会话失败：', error));
  },
};

// 在发起登录前注册监听器
ChatClient.getInstance().addConnectionListener(connectionListener);

try {
  await ChatClient.getInstance().loginWithToken(userId, token);
  // 在线登录成功
} catch (error: unknown) {
  // 在线登录失败，根据错误信息处理
  console.error('登录失败：', error);
}
```

不再需要监听时，应移除监听器：

```typescript
// 移除此前注册的同一个监听器对象
ChatClient.getInstance().removeConnectionListener(connectionListener);
```

:::tip
`onDatabaseOpened` 返回成功只表示指定用户的本地数据库已经打开，不表示在线登录成功，也不能替代 `onConnected`。数据库打开后可以使用本地数据接口；调用需要访问服务器的接口前，仍需等待登录和连接成功。如果已配置登录后自动同步数据，应在相应的 `onDataSyncFinish` 回调返回成功后读取本次同步结果，详见 [离线消息和业务数据同步](connection.html#离线消息和业务数据同步)。
:::

## Token 续期

使用 Token 登录后，SDK 会通过 `ChatConnectEventListener#onTokenWillExpire` 和 `ChatConnectEventListener#onTokenDidExpire` 通知 Token 状态：

- `onTokenWillExpire`：Token 即将过期时触发。应用应从业务服务器获取新 Token，并调用 `ChatClient#renewToken` 更新。
- `onTokenDidExpire`：Token 已过期时触发。SDK 会退出登录，应用应获取新 Token，并重新调用 `ChatClient#loginWithToken` 登录。

收到 `onTokenWillExpire` 回调后，应用应从自己的业务服务器获取新的 IM Token，并调用 `ChatClient#renewToken` 更新 Token。该方法返回 `Promise<void>`：Promise 成功完成表示更新成功；Promise 拒绝表示更新失败，可根据错误信息进行处理。

以下示例中的 `getNewTokenFromAppServer` 为业务侧提供的异步函数，返回 `Promise<string>`，用于从应用服务器获取新 Token，并非 SDK 接口：

```typescript
const connectionListener: ChatConnectEventListener = {
  onTokenWillExpire(): void {
    // 从应用服务器异步获取新的 Token 后进行更新
    void getNewTokenFromAppServer()
      .then((newToken) => ChatClient.getInstance().renewToken(newToken))
      .then(() => {
        // Token 更新成功
      })
      .catch((error: unknown) => {
        // 获取或更新 Token 失败
        console.error('Token 续期失败：', error);
      });
  },
  onTokenDidExpire(): void {
    // Token 已过期，获取新 Token 后重新登录
  },
};

ChatClient.getInstance().addConnectionListener(connectionListener);
```

不再需要监听时，应使用 `ChatClient#removeConnectionListener` 移除同一个监听器对象。

## 获取当前登录的用户

调用 `ChatClient#getCurrentUsername` 获取当前登录用户的用户 ID：

```typescript
try {
  // 获取当前登录用户的用户 ID
  const currentUser = await ChatClient.getInstance().getCurrentUsername();
} catch (error: unknown) {
  console.error('获取当前用户失败：', error);
}
```

该方法读取原生 SDK 的当前用户信息，并在返回非空用户 ID 时更新 JavaScript 层缓存；用户 ID 不能作为当前登录状态有效的判断依据。

## 获取登录状态

调用 `ChatClient#isConnected` 判断 SDK 是否已连接到 IM 服务器。登录状态与连接状态含义不同，例如，网络断开时，用户可能仍处于登录状态，但当前未连接到服务器。

要查询登录状态，应用应结合 `ChatClient#loginWithToken`、`ChatClient#logout` 的调用结果，以及 `ChatConnectEventListener#onDisconnected` 的断开原因和 `onTokenDidExpire` 回调管理登录状态，不要仅根据连接状态或缓存的用户 ID 判断用户是否已登录。

```typescript
try {
  // 查询当前是否已连接到 IM 服务器
  const connected = await ChatClient.getInstance().isConnected();
} catch (error: unknown) {
  console.error('获取连接状态失败：', error);
}
```

## 退出登录

调用 `ChatClient#logout` 退出当前账号。`unbindDeviceToken` 表示退出时是否解绑设备推送 Token：

- （默认）`true`：解绑设备推送 Token。
- `false`：不解绑设备推送 Token。

通过返回的 `Promise<void>` 获取异步退出结果：

```typescript
try {
  // 退出登录，并解绑设备推送 Token
  await ChatClient.getInstance().logout(true);
  // 退出成功
} catch (error: unknown) {
  // 退出失败
  console.error('退出登录失败：', error);
}
```

:::tip
1. 如果应用集成了 FCM 等第三方推送，退出登录时建议将 `logout` 方法的 `unbindDeviceToken` 参数设置为 `true`，使 SDK 同时解绑当前设备的推送 Token。否则，退出登录后仍可能收到当前账号的离线推送通知。

如果因网络异常导致推送 Token 解绑失败，`logout` 会返回失败。应用可以提示用户解绑失败及继续退出后可能仍收到推送的风险。若用户确认继续退出，可以将 `unbindDeviceToken` 设置为 `false`，再次调用 `logout`，仅退出 IM 账号而不解绑推送 Token。网络恢复后，应在适当时机处理遗留的推送 Token 解绑问题，不建议通过后台线程无限重试。

2. 调用 `ChatClient#logout` 时，应等待 Promise 成功完成后，再调用 `ChatClient#loginWithToken` 登录其他账号或执行依赖退出完成的操作。若 Promise 拒绝，表示退出或推送 Token 解绑失败，应用应根据错误信息和业务场景进行处理。
:::

:::notice
React Native SDK 5.0.0 的 iOS 端在未配置 `ChatOptions#apnsCertName` 时，会按不解绑推送 Token 的方式退出，即使 `unbindDeviceToken` 为 `true`。若仅集成 PushKit 推送且需要解绑 Token，应在退出前调用 `ChatClient#unbindPushKitToken`，并处理解绑结果。
:::

## 账号切换

从当前账号切换到其他账号时，应先调用 `ChatClient#logout`，待退出成功后，再使用新账号的用户 ID 和 Token 调用 `ChatClient#loginWithToken`。不要在当前账号尚未退出时直接发起其他账号的登录。

## 多设备登录

SDK 支持同一账号在多个设备上登录。多设备登录的设备数量、互踢策略和数据同步规则由服务端配置决定。若登录设备数量超过限制，新登录设备可能会将已登录设备踢下线。详见 [多设备登录](multi_device.html)。

**配置登录设备信息**

SDK 可以通过以下 `ChatOptions` 属性配置当前登录设备的信息：

| 属性 | 说明 |
| :--- | :--- |
| `customOSType` | 登录设备的自定义平台编号，取值范围为 1–100。必须在初始化 SDK 前设置；未设置时沿用原生 SDK 的默认平台信息。 |
| `customDeviceName` | 当前设备的自定义名称，用于在多设备登录场景中区分设备。必须在初始化 SDK 前设置；未设置时使用原生设备信息，Android 为设备型号，iOS 为设备名称。 |
| `loginExtraInfo` | 当前设备的登录扩展信息，最大长度为 1024 个字符。必须在初始化 SDK 前设置；未设置时不传入自定义扩展信息。 |

示例代码如下：

```typescript
const options = ChatOptions.withAppKey({
  appKey: 'your-org#your-app',
  // 以下设备信息需要在初始化 SDK 前设置
  customOSType: 10,
  customDeviceName: 'react-native-custom-device',
  // 登录扩展信息也在初始化 SDK 前设置
  loginExtraInfo: 'login from React Native',
});

try {
  await ChatClient.getInstance().init(options);
  await ChatClient.getInstance().loginWithToken(userId, token);
  // 登录成功
} catch (error: unknown) {
  // 初始化或登录失败
  console.error('初始化或登录失败：', error);
}
```

React Native SDK 5.0.0 仅在 `ChatClient#init` 时向原生 SDK 传入这些配置。初始化完成后修改原 `options` 对象或 `ChatClient.options` 中的属性，不会更新原生配置。

**设备互踢**

当多设备登录策略导致当前设备被强制退出时，SDK 会触发 `ChatConnectEventListener#onDisconnected(errorCode, info)`。应用可以根据 `errorCode` 判断退出原因，并按业务需要提示用户或引导用户重新登录。

当 `errorCode` 为 `ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE` 时，可以通过 `info` 获取将当前设备踢下线的新设备信息：

- `deviceName`：新登录设备的自定义设备名称；未设置时使用原生设备信息。
- `ext`：新登录设备通过 `ChatOptions.loginExtraInfo` 设置的扩展信息。

`info` 及其中的字段均为可选值，读取时需兼容缺失的情况。

```typescript
const connectionListener: ChatConnectEventListener = {
  onDisconnected(errorCode?: number, info?: { deviceName?: string; ext?: string }): void {
    switch (errorCode) {
      case ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE: {
        const deviceName = info?.deviceName;
        const deviceExt = info?.ext;
        // 当前账号在其他设备登录，当前设备被踢下线
        break;
      }
      case ChatDisconnectErrorCode.USER_KICKED_BY_CHANGE_PASSWORD:
        // 因密码变更被踢下线
        break;
      case ChatDisconnectErrorCode.USER_KICKED_BY_OTHER_DEVICE:
        // 在其他设备、控制台或通过服务端接口被强制退出
        break;
      case ChatDisconnectErrorCode.USER_LOGIN_TOO_MANY_DEVICES:
        // 登录设备数量超过限制
        break;
      case ChatDisconnectErrorCode.USER_BIND_ANOTHER_DEVICE:
        // 当前账号绑定了其他设备
        break;
      case ChatDisconnectErrorCode.USER_DEVICE_CHANGED:
        // 登录设备发生变化
        break;
      default:
        // 其他断开原因按连接文档处理，不对所有断开都重新登录
        break;
    }
  },
};

ChatClient.getInstance().addConnectionListener(connectionListener);
```

不再需要监听时，应使用 `ChatClient#removeConnectionListener` 移除同一个监听器对象。其他断开原因的处理，详见 [连接断开和异常登出处理](connection.html#连接断开和异常登出处理)。

常见多设备相关错误码如下：

| 场景 | React Native SDK 错误码 | 说明 |
| :--- | :--- | :--- |
| 用户在其他设备登录并将当前设备踢下线 | `206` / `ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE` | 可以提示用户账号已在其他设备登录，并读取新设备的名称和扩展信息。 |
| 当前账号绑定了其他设备 | `213` / `ChatDisconnectErrorCode.USER_BIND_ANOTHER_DEVICE` | 应根据设备绑定策略引导用户处理。 |
| 登录设备数量超过限制 | `214` / `ChatDisconnectErrorCode.USER_LOGIN_TOO_MANY_DEVICES` | 应先处理设备数量限制，不建议直接反复登录。 |
| 用户因修改密码被踢下线 | `216` / `ChatDisconnectErrorCode.USER_KICKED_BY_CHANGE_PASSWORD` | 应重新获取有效 Token 后登录。 |
| 用户在其他设备、控制台或通过服务端接口被强制退出 | `217` / `ChatDisconnectErrorCode.USER_KICKED_BY_OTHER_DEVICE` | 可以提示用户当前账号已被强制退出。 |
| 登录设备发生变化 | `220` / `ChatDisconnectErrorCode.USER_DEVICE_CHANGED` | 应根据业务场景提示用户并重新登录。 |

**获取其他设备的登录 ID**

调用 `ChatContactManager#getSelfIdsOnOtherPlatform` 可以从服务器获取当前账号在其他设备上的登录 ID。调用该接口前，用户应已登录并连接到 IM 服务器。

```typescript
try {
  // 获取当前账号在其他设备上的登录 ID
  const loginIds = await ChatClient.getInstance().contactManager
    .getSelfIdsOnOtherPlatform();
  // loginIds 为当前账号在其他设备上的登录 ID
  console.log('其他设备的登录 ID：', loginIds);
} catch (error: unknown) {
  // 获取失败
  console.error('获取其他设备的登录 ID 失败：', error);
}
```

登录 ID 的格式为 `userId/resource`：

- `userId`：当前登录用户的用户 ID。
- `resource`：登录设备的资源标识。

例如，登录 ID 为 `alice/android_xxx` 时，`alice` 是用户 ID，`android_xxx` 是对应登录设备的资源标识。

## 更多

### 登录被封禁账号的提示

若用户账号已通过环信控制台或 REST API 被禁用，调用 `ChatClient#loginWithToken` 登录时，返回的 Promise 会拒绝，并通过 `ChatError.code` 返回错误码 `305`。该错误码表示 IM 服务或当前应用功能被限制。应用应结合服务配置和服务端返回的错误信息进行处理，不建议依赖 `"service is disabled"` 等错误文本进行判断。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`loginWithToken`](#登录) | `ChatClient` | 使用用户 ID 和 Token 登录。 |
| [`onDatabaseOpened`](#登录完成前使用本地数据库) | `ChatConnectEventListener` | 通知本地数据库打开结果。 |
| [`getAllConversations`](#登录完成前使用本地数据库) | `ChatManager` | 获取本地会话列表。 |
| [`renewToken`](#token-续期) | `ChatClient` | 更新当前登录使用的 Token。 |
| [`getCurrentUsername`](#获取当前登录的用户) | `ChatClient` | 获取当前登录用户的用户 ID。 |
| [`isConnected`](#获取登录状态) | `ChatClient` | 判断 SDK 是否已连接到 IM 服务器。 |
| [`logout`](#退出登录) | `ChatClient` | 退出当前账号，并按参数决定是否解绑设备推送 Token。 |
| [`withAppKey`](#多设备登录) | `ChatOptions` | 使用 App Key 和指定配置创建初始化选项。 |
| [`customOSType`](#多设备登录) | `ChatOptions` | 登录设备的自定义平台编号。 |
| [`customDeviceName`](#多设备登录) | `ChatOptions` | 当前设备的自定义名称。 |
| [`loginExtraInfo`](#多设备登录) | `ChatOptions` | 当前设备的登录扩展信息。 |
| [`init`](#多设备登录) | `ChatClient` | 使用指定配置初始化 React Native SDK。 |
| [`addConnectionListener`](#登录完成前使用本地数据库) | `ChatClient` | 注册连接监听器。 |
| [`removeConnectionListener`](#登录完成前使用本地数据库) | `ChatClient` | 移除指定的连接监听器。 |
| [`getSelfIdsOnOtherPlatform`](#多设备登录) | `ChatContactManager` | 异步获取当前账号在其他设备上的登录 ID。 |
