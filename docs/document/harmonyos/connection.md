# 连接

## 功能说明

应用客户端成功连接到环信服务器后，才能使用即时通讯 SDK 的消息收发及其他需要访问服务器的功能。

调用 `ChatClient#loginWithToken` 登录后，SDK 会建立并维护长连接。连接运行期间，SDK 通过 `ConnectionListener` 通知应用连接状态、异常登出、Token 生命周期、本地数据库打开、离线消息同步和登录后自动数据同步等状态变化。

关于登录、登出和登录状态，详见[登录](login.html)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见[快速开始](quickstart.html)。
- 已获取有效的用户 ID 和用户 Token。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 连接生命周期

HarmonyOS SDK 的连接生命周期通常包括以下阶段：

1. 调用 `ChatClient#init` 初始化 SDK。
2. 调用 `addConnectionListener` 注册连接监听器，建议在登录前完成注册。
3. 调用 `loginWithToken` 登录并建立长连接。
4. 指定用户的本地数据库打开后触发 `onDatabaseOpened`。该回调只表示本地数据库可以使用，不表示在线连接成功。
5. 成功连接服务器后触发 `onConnected`。SDK 根据服务端数据和初始化配置同步离线消息及业务数据。
6. 连接中断后，SDK 根据断开原因自动重连，或者通过 `onLogout` 通知应用处理不可恢复的异常登出。
7. 调用 `logout` 主动登出并关闭当前连接。

```typescript
let connectionListener: ConnectionListener = {
    onConnected: (): void => {
        // SDK 已成功连接到服务器。
    },
    onDisconnected: (errorCode: number): void => {
        // SDK 与服务器断开连接，可根据 errorCode 判断原因。
    }
};

ChatClient.getInstance().addConnectionListener(connectionListener);

ChatClient.getInstance()
    .loginWithToken(userId, token)
    .then((): void => {
        // 登录成功。
    })
    .catch((error: ChatError): void => {
        // 登录失败，根据 error.errorCode 和 error.description 处理。
    });
```

## 获取连接状态

调用 `ChatClient#isConnected` 查询 SDK 当前是否已连接到服务器：

```typescript
let connected: boolean = ChatClient.getInstance().isConnected();
```

调用 `ChatClient#isLoggedIn` 查询当前用户是否处于登录状态：

```typescript
let loggedIn: boolean = ChatClient.getInstance().isLoggedIn();
```

调用 `ChatClient#isDatabaseOpened` 查询当前用户的本地数据库是否已经打开：

```typescript
let databaseOpened: boolean = ChatClient.getInstance().isDatabaseOpened();
```

| API | 说明 |
| :--- | :--- |
| `isConnected()` | 返回 SDK 当前是否已连接到服务器。 |
| `isLoggedIn()` | 返回当前用户是否已登录 Chat 服务。 |
| `isDatabaseOpened()` | 返回当前用户的本地数据库是否已经打开。该状态不表示用户已登录或已连接服务器。 |

:::tip
连接状态、登录状态和数据库打开状态含义不同。弱网或切换网络时，用户可能仍处于登录状态，但长连接暂时断开并由 SDK 自动重连。业务 UI 应结合监听器回调处理状态变化，不要只依赖一次状态查询。
:::

## 监听连接变化

通过 `ChatClient#addConnectionListener` 注册 `ConnectionListener`。建议在调用 `loginWithToken` 前注册，以免遗漏登录建连和后续同步状态。

### 回调说明

| 回调 | 触发时机 | 说明 |
| :--- | :--- | :--- |
| `onConnected()` | SDK 成功连接到服务器时触发。 | 首次登录连接成功或自动重连成功后均可能触发。 |
| `onDisconnected(errorCode)` | SDK 与服务器断开连接时触发。 | `errorCode` 表示断开原因。连接断开不一定表示 SDK 已退出登录；可恢复场景由 SDK 自动重连。 |
| `onDatabaseOpened(username)` | 指定用户的本地数据库打开成功时触发。 | 表示本地数据库接口可以使用，不表示在线登录成功，也不能代替 `onConnected`。 |
| `onLogout(errorCode, info)` | SDK 因账号、设备或服务限制等不可恢复原因退出登录时触发。 | 可根据错误码和 `LoginExtInfo` 处理异常登出。 |
| `onTokenWillExpire()` | Token 即将过期时触发。 | 建议从应用服务器获取新 Token，并调用 `renewToken` 续期。 |
| `onTokenExpired()` | Token 已过期时触发。 | SDK 会退出登录，需要获取新 Token 后重新登录。 |
| `onOfflineMessageSyncStart()` | SDK 开始从服务器同步离线消息时触发。 | 没有离线消息时可能不触发。 |
| `onOfflineMessageSyncFinish()` | SDK 完成离线消息同步时触发。 | 同步过程中连接中断时可能不触发。 |
| `onDataSyncStart(type)` | 登录后指定类型的数据开始自动同步时触发。 | `type` 表示会话、好友或已加入群组等数据类型。 |
| `onDataSyncFinish(type, errorCode)` | 指定类型的数据自动同步结束时触发。 | `errorCode === ChatError.EM_NO_ERROR` 表示同步成功。 |

### 示例代码

```typescript
let connectionListener: ConnectionListener = {
    onConnected: (): void => {
        // 连接成功。
    },
    onDisconnected: (errorCode: number): void => {
        // 连接断开。可恢复的网络问题由 SDK 自动重连。
    },
    onDatabaseOpened: (username: string): void => {
        // username 对应的本地数据库已打开。
    },
    onLogout: (errorCode: number, info: LoginExtInfo): void => {
        // SDK 已退出登录，根据 errorCode、info.deviceInfo 和 info.deviceExt 处理。
    },
    onTokenWillExpire: (): void => {
        // 从应用服务器获取新 Token 后调用 renewToken。
    },
    onTokenExpired: (): void => {
        // Token 已过期，获取新 Token 后重新登录。
    },
    onOfflineMessageSyncStart: (): void => {
        // 开始同步离线消息。
    },
    onOfflineMessageSyncFinish: (): void => {
        // 离线消息同步完成。
    },
    onDataSyncStart: (type: DataSyncType): void => {
        // type 对应的数据开始自动同步。
    },
    onDataSyncFinish: (type: DataSyncType, errorCode: number): void => {
        if (errorCode === ChatError.EM_NO_ERROR) {
            // type 对应的数据同步成功。
        }
    }
};

ChatClient.getInstance().addConnectionListener(connectionListener);

// 不再需要监听时移除监听器。
ChatClient.getInstance().removeConnectionListener(connectionListener);
```

## 连接恢复与异常处理

### 自动重连

登录成功后，如果因网络信号弱、网络切换或其他可恢复原因导致连接中断，SDK 会自动尝试重连，无需应用再次调用登录接口。

连接断开时触发 `onDisconnected`；重连成功后触发 `onConnected`。HarmonyOS SDK 5.0.0 不提供独立的 `onConnecting` 或 `onReconnectFailed` 回调，应用应结合这两个回调、`isConnected()` 以及系统网络状态展示连接状态。

以下情况不能仅依靠自动重连恢复，应用需要根据登录结果或监听器错误码处理账号、Token、设备或服务限制：

- 用户主动调用 `logout`。
- Token 无效或已过期。
- 用户鉴权失败。
- 账号被删除、在其他设备登录或被强制退出。
- 登录设备数、应用活跃用户数或服务配额达到限制。

### 连接断开和异常登出处理

`onDisconnected` 表示连接已经断开，但不一定表示用户已退出登录。对于不可恢复的账号、设备或服务限制，SDK 会在 `onDisconnected` 后触发 `onLogout`。常见错误如下：

| 场景 | 错误码 | 建议处理 |
| :--- | :--- | :--- |
| 用户在其他设备登录 | `ChatError.USER_LOGIN_ANOTHER_DEVICE`（206） | 提示用户，并根据业务策略决定是否重新登录。 |
| 用户账号被服务器删除 | `ChatError.USER_REMOVED`（207） | 先处理账号状态，不应直接重复登录。 |
| 用户已绑定其他设备 | `ChatError.USER_BIND_ANOTHER_DEVICE`（213） | 根据设备绑定策略处理后重新登录。 |
| 登录设备数超过限制 | `ChatError.USER_LOGIN_TOO_MANY_DEVICES`（214） | 先处理设备数限制。 |
| 用户修改密码后被踢下线 | `ChatError.USER_KICKED_BY_CHANGE_PASSWORD`（216） | 重新获取 Token 后登录。 |
| 用户被其他设备、API 或控制台强制退出 | `ChatError.USER_KICKED_BY_OTHER_DEVICE`（217） | 提示用户，并按业务策略重新登录。 |
| 登录设备发生变化 | `ChatError.USER_DEVICE_CHANGED`（220） | 根据设备策略处理后重新登录。 |
| DAU 或 MAU 达到上限 | `ChatError.APP_ACTIVE_NUMBER_REACH_LIMITATION`（8） | 检查应用配额或联系环信商务。 |
| 服务被限制 | `ChatError.SERVER_SERVICE_RESTRICTED`（305） | 检查服务开通和配额状态。 |

调用 `loginWithToken` 时，Token 无效、Token 已过期或用户鉴权失败可能分别返回 `ChatError.INVALID_TOKEN`（104）、`ChatError.TOKEN_EXPIRED`（108）或 `ChatError.USER_AUTHENTICATION_FAILED`（202）。这些登录错误应在 Promise 的失败结果中处理，不应等待 `onLogout`。

当 `onLogout` 的错误码为 `ChatError.USER_LOGIN_ANOTHER_DEVICE` 时，`LoginExtInfo#deviceInfo` 表示将当前设备踢下线的新登录设备名称，`LoginExtInfo#deviceExt` 表示该设备的自定义扩展信息（若已配置）。其他错误场景下，`deviceInfo` 为空字符串。

更多错误码说明，详见[错误码](error.html)。

### Token 生命周期

SDK 根据登录 Token 的有效期触发以下回调：

- `onTokenWillExpire`：Token 即将过期。SDK 通常在 Token 有效期达到约 80% 时触发该回调。
- `onTokenExpired`：Token 已过期，SDK 会退出登录。

收到 `onTokenWillExpire` 后，应从应用服务器获取新 Token，并调用 `renewToken(newToken)`：

```typescript
ChatClient.getInstance()
    .renewToken(newToken)
    .then((): void => {
        // Token 续期成功。
    })
    .catch((error: ChatError): void => {
        // Token 续期失败，根据 error.errorCode 和 error.description 处理。
    });
```

`renewToken` 要求 SDK 已初始化、当前用户已登录且新 Token 不为空。若已经触发 `onTokenExpired`，应获取新 Token 后重新调用 `loginWithToken`，而不是继续依赖自动重连。

### 离线消息和业务数据同步

登录成功或连接恢复后，如果服务端存在离线消息，SDK 会自动同步。可以通过 `onOfflineMessageSyncStart` 和 `onOfflineMessageSyncFinish` 监听同步过程。

会话、好友和已加入群组等业务数据的登录后自动同步状态，则通过 `onDataSyncStart` 和 `onDataSyncFinish` 监听。两类同步回调含义不同，不应混用。

`ChatOptions` 默认同步会话数据。如需同步好友或已加入的群组，应在调用 `ChatClient#init` 前通过 `ChatOptions#setDataSyncType` 配置 `DataSyncType.CONTACTS` 或 `DataSyncType.JOINED_GROUPS`。关于登录后自动同步数据，详见 [初始化](initialization.html)。

## 最佳实践

- 在调用 `loginWithToken` 前注册 `ConnectionListener`，避免遗漏连接、Token、数据库打开和数据同步状态回调。
- 弱网断开后不要立即重复调用登录接口；可恢复场景由 SDK 自动重连。
- 使用 `isConnected()` 查询当前连接状态，使用 `isLoggedIn()` 查询登录状态，使用 `isDatabaseOpened()` 查询本地数据库状态，并优先通过监听器回调驱动 UI 更新。
- 收到 `onTokenWillExpire` 后尽快续期 Token；收到 `onTokenExpired` 后获取新 Token 并重新登录。
- 使用 `onLogout` 处理账号、设备和服务限制等不可恢复的异常登出，并根据错误码给出明确提示。
- 区分离线消息同步回调和业务数据同步回调；需要最新业务数据时，应等待对应类型的数据同步成功。
- 不再需要监听时调用 `removeConnectionListener`，避免重复回调和资源泄漏。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`init`](#连接生命周期) | `ChatClient` | 初始化 HarmonyOS SDK。 |
| [`loginWithToken`](#连接生命周期) | `ChatClient` | 使用用户 ID 和 Token 登录并建立连接。 |
| [`logout`](#连接生命周期) | `ChatClient` | 主动登出并关闭当前连接。 |
| [`addConnectionListener`](#监听连接变化) / [`removeConnectionListener`](#监听连接变化) | `ChatClient` | 添加或移除连接监听器。 |
| [`isConnected`](#获取连接状态) | `ChatClient` | 查询 SDK 当前是否已连接到服务器。 |
| [`isLoggedIn`](#获取连接状态) | `ChatClient` | 查询当前用户是否已登录 Chat 服务。 |
| [`isDatabaseOpened`](#获取连接状态) | `ChatClient` | 查询当前用户的本地数据库是否已经打开。 |
| [`renewToken`](#token-生命周期) | `ChatClient` | 更新当前登录用户的 Token。 |
| [`setDataSyncType`](#离线消息和业务数据同步) | `ChatOptions` | 设置登录后自动同步的数据类型。 |
