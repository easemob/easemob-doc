# 登录

初始化 HarmonyOS SDK 后，应用需要使用用户 ID 和用户 Token 登录。登录成功并连接到 IM 服务器后，才能调用需要访问服务器的即时通讯功能。

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

SDK 通过用户 ID 和 IM Token 登录。调用 `ChatClient#loginWithToken` 时，需传入 `userId` 和 `token`。登录成功后，SDK 会建立到消息服务的长连接。**HarmonyOS SDK 5.x 初始化后不会自动登录。**

测试环境下，你在 [环信控制台](https://console.easemob.com/user/login) 创建用户后，环信服务器会自动为这些用户分配用户 Token，详见 [创建用户](/product/console/operation_user.html#创建用户)。

生产环境中，建议在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html)，由客户端从你的应用服务器获取用户 Token 后再登录 SDK。

```typescript
ChatClient.getInstance().loginWithToken(userId, token)
  .then((): void => {
    // 登录成功。
  })
  .catch((error: ChatError): void => {
    // 登录失败，根据错误码和错误信息处理。
  });
```

:::tip
应用可以通过 `ChatClient#isLoggedIn()` 和 `ChatClient#isConnected()` 分别判断登录状态和服务器连接状态，但不能依赖 SDK 自动发起登录。
:::

## 登录完成前使用本地数据库

HarmonyOS SDK 支持在线登录完成前使用本地数据库。应用初始化 SDK 并注册 `ConnectionListener` 后，调用 `ChatClient#loginWithToken`。SDK 会在登录流程中自动打开当前用户的本地数据库，并在打开成功后触发 `onDatabaseOpened(username)`。收到该回调后，即使在线登录尚未完成，应用也可以读取该用户的本地缓存数据，提前展示会话列表等页面内容；调用需要访问服务器的接口时，仍需等待登录成功，并通过 `onConnected` 确认连接已建立。

在调用 `loginWithToken` 前注册 `ConnectionListener`，通过 `onDatabaseOpened(username)` 监听数据库打开成功事件。回调中的 `username` 表示当前打开的数据库所属用户。

也可以调用 `ChatClient#isDatabaseOpened()` 查询当前是否存在可用的本地数据库上下文。

```typescript
let connectionListener: ConnectionListener = {
  onConnected: (): void => {
    // 已成功连接到 IM 服务器，可以调用需要联网的接口。
  },
  onDisconnected: (errorCode: number): void => {
    // SDK 与 IM 服务器断开连接，可根据 errorCode 处理。
  },
  onDatabaseOpened: (username: string): void => {
    // username 对应的本地数据库已打开。
    if (ChatClient.getInstance().isDatabaseOpened()) {
      let conversations = ChatClient.getInstance()
        .chatManager()
        ?.getAllConversationsBySort() ?? [];

      // 使用本地会话数据刷新页面。
    }
  }
};

// 在发起登录前注册监听器。
ChatClient.getInstance().addConnectionListener(connectionListener);

ChatClient.getInstance().loginWithToken(userId, token)
  .then((): void => {
    // 在线登录成功。
  })
  .catch((error: ChatError): void => {
    // 在线登录失败，根据错误码和错误信息处理。
  });
```

不再需要监听时，应移除同一个监听器实例：

```typescript
ChatClient.getInstance().removeConnectionListener(connectionListener);
```

:::tip
`onDatabaseOpened` 只表示指定用户的本地数据库已经打开，不表示在线登录成功，也不能替代 `onConnected`。`isDatabaseOpened` 同样不表示用户已登录或已连接。数据库打开后可以使用本地数据接口；调用需要访问服务器的接口前，仍需等待登录和连接成功。
:::

## Token 续期

使用 Token 登录后，SDK 会通过 `ConnectionListener#onTokenWillExpire` 和 `ConnectionListener#onTokenExpired` 通知 Token 状态：

- `onTokenWillExpire`：Token 即将过期时触发。应用应从业务服务器获取新 Token，并调用 `ChatClient#renewToken` 更新。
- `onTokenExpired`：Token 已过期时触发。SDK 会退出当前登录态，应用应从业务服务器获取新 Token，并重新调用 `loginWithToken` 登录。

收到 `onTokenWillExpire` 回调后，应用应从自己的业务服务器获取新的 IM Token，并调用 `ChatClient#renewToken` 更新 Token。`renewToken` 返回 Promise：`Promise resolve` 表示更新成功；`Promise reject` 表示更新失败，可根据 `ChatError` 进行处理。

```typescript
let connectionListener: ConnectionListener = {
  onConnected: (): void => {
  },
  onDisconnected: (errorCode: number): void => {
  },
  onTokenWillExpire: (): void => {
    // getNewTokenFromAppServer 仅表示从应用服务器异步获取新 Token 的业务逻辑，并非 SDK 接口。
    getNewTokenFromAppServer()
      .then((newToken: string): Promise<void> => {
        return ChatClient.getInstance().renewToken(newToken);
      })
      .then((): void => {
        // Token 更新成功。
      })
      .catch((error: ChatError): void => {
        // 获取或更新 Token 失败。
      });
  },
  onTokenExpired: (): void => {
    // Token 已过期，获取新 Token 后重新登录。
    getNewTokenFromAppServer()
      .then((newToken: string): Promise<void> => {
        return ChatClient.getInstance().loginWithToken(userId, newToken);
      })
      .catch((error: ChatError): void => {
        // 获取 Token 或重新登录失败。
      });
  }
};

ChatClient.getInstance().addConnectionListener(connectionListener);
```

## 获取当前登录的用户

调用 `ChatClient#getCurrentUser` 获取当前登录用户的用户 ID：

```typescript
let currentUser: string = ChatClient.getInstance().getCurrentUser();
```

## 获取登录状态

调用 `ChatClient#isLoggedIn` 判断当前用户是否已登录，调用 `ChatClient#isConnected` 判断 SDK 是否已连接到 IM 服务器。登录状态与连接状态含义不同，例如，网络断开时，用户可能仍处于登录状态，但当前未连接到服务器。

```typescript
let loggedIn: boolean = ChatClient.getInstance().isLoggedIn();
let connected: boolean = ChatClient.getInstance().isConnected();
```

## 退出登录

调用 `ChatClient#logout` 退出当前账号。`unbindToken` 表示退出时是否解绑设备推送 Token：

- （默认）`true`：解绑设备推送 Token。
- `false`：不解绑设备推送 Token。

该方法返回 Promise：

```typescript
ChatClient.getInstance().logout(true)
  .then((): void => {
    // 退出成功。
  })
  .catch((error: ChatError): void => {
    // 退出失败。
  });
```

:::tip
1. 如果应用集成了 HarmonyOS 推送，退出登录时建议将 `logout` 方法的 `unbindToken` 参数设置为 `true`，使 SDK 同时解绑当前设备的推送 Token。否则，退出登录后仍可能收到当前账号的离线推送通知。

如果因网络异常导致推送 Token 解绑失败，`logout` 返回的 Promise 会被拒绝，且 SDK 不会继续退出登录。应用可以提示用户解绑失败及继续退出后可能仍收到推送的风险。若用户确认继续退出，可以将 `unbindToken` 设置为 `false`，再次调用 `logout`，仅退出 IM 账号而不解绑推送 Token。网络恢复后，应在适当时机处理遗留的推送 Token 解绑问题，不建议无限重试。

2. 应等待 `logout` 返回的 Promise resolve 后，再调用 `loginWithToken` 登录其他账号或执行依赖退出完成的操作。Promise reject 表示退出或推送 Token 解绑失败，应用应根据错误码和业务场景进行处理。
:::

## 账号切换

从当前账号切换到其他账号时，应先调用 `logout`，待退出成功后，再使用新账号的用户 ID 和 Token 调用 `loginWithToken`。不要在当前账号尚未退出时直接发起其他账号的登录。

## 多设备登录

HarmonyOS SDK 支持同一账号在多个设备上登录。多设备登录的设备数量、互踢策略和数据同步规则由服务端配置决定。若登录设备数量超过限制，新登录设备可能会将已登录设备踢下线。详见 [多设备登录](multi_device.html)。

**配置登录设备信息**

HarmonyOS SDK 可以通过以下 `ChatOptions` 接口配置当前登录设备的信息：

| API | 参数类型 | 说明 |
| :--- | :--- | :--- |
| `setCustomOSPlatform` | `number` | 设置登录设备的自定义平台编号，取值范围为 1–100。需在初始化 SDK 前设置。 |
| `setCustomDeviceName` | `String` | 设置当前设备的自定义名称，用于在多设备登录场景中区分设备。该参数不支持空字符串，需在初始化 SDK 前设置；未设置时默认使用设备型号。 |
| `setLoginCustomExt` | `String` | 设置当前设备的登录扩展信息，最大长度为 1024 个字符。SDK 初始化前设置时对后续登录生效；SDK 已初始化时，应在下一次调用 `loginWithToken` 前设置。 |

示例代码如下：

```typescript
let options: ChatOptions = new ChatOptions({
  appKey: 'your-org#your-app'
});

// 以下两项需要在初始化 SDK 前设置。
options.setCustomOSPlatform(10);
options.setCustomDeviceName('harmonyos-custom-device');

// 登录扩展信息也可以在初始化 SDK 前设置。
options.setLoginCustomExt('login from HarmonyOS');

ChatClient.getInstance().init(context, options);

ChatClient.getInstance().loginWithToken(userId, token)
  .then((): void => {
    // 登录成功。
  })
  .catch((error: ChatError): void => {
    // 登录失败。
  });
```

如果 SDK 已经初始化，需要在下一次登录前更新登录扩展信息，可以调用：

```typescript
ChatClient.getInstance()
  .getOptions()
  ?.setLoginCustomExt('login from HarmonyOS');

ChatClient.getInstance().loginWithToken(userId, token)
  .then((): void => {
    // 登录成功。
  })
  .catch((error: ChatError): void => {
    // 登录失败。
  });
```

**设备互踢**

当多设备登录策略导致当前设备被强制退出时，SDK 会触发 `ConnectionListener#onLogout(errorCode, info)`。应用可以根据 `errorCode` 判断退出原因，并按业务需要提示用户或引导用户重新登录。

当 `errorCode` 为 `ChatError.USER_LOGIN_ANOTHER_DEVICE` 时，可以通过 `LoginExtInfo` 获取将当前设备踢下线的新设备信息：

- `deviceInfo`：新登录设备的自定义设备名称；未设置时通常为设备型号。
- `deviceExt`：新登录设备通过 `setLoginCustomExt` 设置的扩展信息。

```typescript
let connectionListener: ConnectionListener = {
  onConnected: (): void => {
  },
  onDisconnected: (errorCode: number): void => {
    // SDK 与 IM 服务器断开连接。
  },
  onLogout: (errorCode: number, info: LoginExtInfo): void => {
    switch (errorCode) {
      case ChatError.USER_LOGIN_ANOTHER_DEVICE:
        let deviceName: string = info.deviceInfo;
        let deviceExt: string = info.deviceExt;
        // 当前账号在其他设备登录，当前设备被踢下线。
        break;
      case ChatError.USER_KICKED_BY_CHANGE_PASSWORD:
        // 因密码变更被踢下线。
        break;
      case ChatError.USER_KICKED_BY_OTHER_DEVICE:
        // 在其他设备、控制台或通过服务端接口被强制退出。
        break;
      case ChatError.USER_LOGIN_TOO_MANY_DEVICES:
        // 登录设备数量超过限制。
        break;
      case ChatError.USER_BIND_ANOTHER_DEVICE:
        // 当前账号绑定了其他设备。
        break;
      case ChatError.USER_DEVICE_CHANGED:
        // 登录设备发生变化。
        break;
      default:
        // 根据其他错误码处理。
        break;
    }
  }
};

ChatClient.getInstance().addConnectionListener(connectionListener);
```

常见多设备相关错误码如下：

| 场景 | HarmonyOS SDK 错误码 | 说明 |
| :--- | :--- | :--- |
| 用户在其他设备登录并将当前设备踢下线 | `206` / `USER_LOGIN_ANOTHER_DEVICE` | 可以提示用户账号已在其他设备登录，并读取新设备的名称和扩展信息。 |
| 当前账号绑定了其他设备 | `213` / `USER_BIND_ANOTHER_DEVICE` | 应根据设备绑定策略引导用户处理。 |
| 登录设备数量超过限制 | `214` / `USER_LOGIN_TOO_MANY_DEVICES` | 应先处理设备数量限制，不建议直接反复登录。 |
| 用户因修改密码被踢下线 | `216` / `USER_KICKED_BY_CHANGE_PASSWORD` | 应重新获取有效 Token 后登录。 |
| 用户在其他设备、控制台或通过服务端接口被强制退出 | `217` / `USER_KICKED_BY_OTHER_DEVICE` | 可以提示用户当前账号已被强制退出。 |
| 登录设备发生变化 | `220` / `USER_DEVICE_CHANGED` | 应根据业务场景提示用户并重新登录。 |

**获取其他设备的登录 ID**

调用 `ContactManager#getSelfIdsOnOtherPlatform` 可以从服务器获取当前账号在其他设备上的登录 ID。调用该接口前，用户应已登录并连接到 IM 服务器。

```typescript
ChatClient.getInstance()
  .contactManager()
  ?.getSelfIdsOnOtherPlatform()
  .then((loginIds: string[]): void => {
    // loginIds 为当前账号在其他设备上的登录 ID。
  })
  .catch((error: ChatError): void => {
    // 获取失败。
  });
```

登录 ID 的格式为 `userId/resource`：

- `userId`：当前登录用户的用户 ID。
- `resource`：登录设备的资源标识。

例如，登录 ID 为 `alice/harmonyos_xxx` 时，`alice` 是用户 ID，`harmonyos_xxx` 是对应登录设备的资源标识。

## 更多

### 登录被封禁账号的提示

若用户账号已通过环信控制台或 REST API 被禁用，调用 `ChatClient#loginWithToken` 登录时返回的 Promise 会被拒绝，并返回错误码 `ChatError.SERVER_SERVICE_RESTRICTED`（305）。该错误码表示 IM 服务或当前应用功能被限制。应用应根据错误码进行处理，不建议依赖 `"service is disabled"` 等错误文本进行判断。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`loginWithToken`](#登录) | `ChatClient` | 使用用户 ID 和 Token 登录。 |
| [`isDatabaseOpened`](#登录完成前使用本地数据库) | `ChatClient` | 判断当前是否存在可用的本地数据库上下文。 |
| [`getAllConversationsBySort`](#登录完成前使用本地数据库) | `ChatManager` | 获取置顶优先并按最后一条消息时间倒序排列的本地会话列表。 |
| [`renewToken`](#token-续期) | `ChatClient` | 更新当前登录使用的 Token。 |
| [`getCurrentUser`](#获取当前登录的用户) | `ChatClient` | 获取当前登录用户的用户 ID。 |
| [`isLoggedIn`](#获取登录状态) | `ChatClient` | 判断当前用户是否已登录。 |
| [`isConnected`](#获取登录状态) | `ChatClient` | 判断 SDK 是否已连接到 IM 服务器。 |
| [`logout`](#退出登录) | `ChatClient` | 退出当前账号，并按参数决定是否解绑设备推送 Token。 |
| [`setCustomOSPlatform`](#多设备登录) | `ChatOptions` | 设置登录设备的自定义平台编号。 |
| [`setCustomDeviceName`](#多设备登录) | `ChatOptions` | 设置当前设备的自定义名称。 |
| [`setLoginCustomExt`](#多设备登录) | `ChatOptions` | 设置当前设备的登录扩展信息。 |
| [`init`](#多设备登录) | `ChatClient` | 使用指定配置初始化 HarmonyOS SDK。 |
| [`getOptions`](#多设备登录) | `ChatClient` | 获取当前 SDK 的初始化配置。 |
| [`getSelfIdsOnOtherPlatform`](#多设备登录) | `ContactManager` | 获取当前账号在其他设备上的登录 ID。 |
