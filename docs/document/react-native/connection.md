# 连接

## 功能说明

应用客户端成功连接到环信服务器后，才能使用即时通讯 SDK 的消息收发及需要访问服务器的相关功能。

调用 `ChatClient#loginWithToken` 登录后，SDK 会建立并维护长连接。连接运行期间，SDK 通过 `ChatConnectEventListener` 通知应用连接状态、异常登出、Token 生命周期、本地数据库打开、离线消息同步和登录后自动数据同步等状态变化。

关于登录、登出和登录状态，详见[登录](login.html)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 已获取有效的用户 ID 和用户 Token。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 连接生命周期

React Native SDK 的连接生命周期通常包括以下阶段：

1. 调用 `ChatClient#init` 初始化 SDK。SDK 5.x 初始化后不会自动登录。
2. 调用 `ChatClient#addConnectionListener` 注册连接监听器，建议在登录前完成注册。
3. 调用 `ChatClient#loginWithToken` 登录 SDK 并建立长连接。
4. 用户本地数据库打开后触发 `ChatConnectEventListener#onDatabaseOpened`；`errorCode === 0` 表示本地数据库可用，不表示在线连接成功。
5. 成功连接服务器后触发 `ChatConnectEventListener#onConnected`，SDK 随后按初始化配置同步离线消息和业务数据。
6. 连接中断后，SDK 根据断开原因自动重连，或通过 `ChatConnectEventListener#onDisconnected` 通知应用处理异常登出；Token 过期通过 `onTokenDidExpire` 通知。
7. 调用 `ChatClient#logout` 主动登出并关闭当前连接。

上述阶段用于说明各状态的含义，不表示登录 Promise 与各回调之间存在固定的先后顺序。

```typescript
const connectionListener: ChatConnectEventListener = {
  onConnected(): void {
    // SDK 已成功连接到服务器
  },
  onDisconnected(errorCode?: number): void {
    // SDK 与服务器断开连接，根据错误码区分自动重连与异常登出
  },
};

ChatClient.getInstance().addConnectionListener(connectionListener);

try {
  await ChatClient.getInstance().loginWithToken(userId, token);
  // 登录成功
} catch (error: unknown) {
  // 登录失败，根据错误信息处理
  console.error('登录失败：', error);
}
```

不再需要监听时，应使用 `ChatClient#removeConnectionListener` 移除同一个监听器对象。

## 获取连接状态

调用 `ChatClient#isConnected` 查询 SDK 当前是否已连接到服务器：

```typescript
try {
  // 查询当前是否已连接到服务器
  const connected = await ChatClient.getInstance().isConnected();
} catch (error: unknown) {
  console.error('获取连接状态失败：', error);
}
```

应用可结合登录、登出的调用结果与连接监听器回调管理登录状态。

| API | 说明 |
| :--- | :--- |
| `ChatClient#isConnected` | 返回 `Promise<boolean>`，表示是否已连接到服务器。 |

:::tip
连接状态与登录状态含义不同。弱网或切换网络时，用户可能仍处于登录状态，但长连接暂时断开并由 SDK 自动重连。业务 UI 应结合监听器回调处理状态变化，不要只依赖一次状态查询。
:::

## 监听连接变化

通过 `ChatClient#addConnectionListener` 注册 `ChatConnectEventListener`。建议在调用 `ChatClient#loginWithToken` 前注册，以免遗漏登录建连和后续同步状态。

### 回调说明

以下回调均属于 `ChatConnectEventListener`：

| 回调 | 触发时机 | 说明 |
| :--- | :--- | :--- |
| `onConnected()` | SDK 成功连接到服务器时触发。 | 首次登录连接成功或自动重连成功后均可能触发。 |
| `onDisconnected(errorCode?, info?)` | SDK 与服务器断开连接，或因账号、设备及服务限制等原因退出登录时触发。 | `errorCode` 表示断开原因；断开不一定表示 SDK 已登出。可恢复场景由 SDK 自动重连。`info` 可携带新登录设备的信息。 |
| `onDatabaseOpened(username, errorCode)` | 指定用户的本地数据库打开完成时触发。 | `errorCode === 0` 表示本地数据库接口可以使用，不表示在线登录成功，也不能替代 `onConnected`。Android 端在打开成功后通知，错误码为 `0`；iOS 端还可返回打开失败的错误码。 |
| `onTokenWillExpire()` | Token 即将过期时触发。 | 建议获取新 Token，并调用 `ChatClient#renewToken` 续期。 |
| `onTokenDidExpire()` | Token 已过期时触发。 | SDK 会退出登录；需要获取新 Token 后重新登录。不能仅通过 `onDisconnected` 处理 Token 过期。 |
| `onOfflineMessageSyncStart()` | SDK 开始从服务器同步离线消息时触发。 | 没有离线消息时可能不触发。 |
| `onOfflineMessageSyncFinish()` | SDK 完成离线消息同步时触发。 | 同步过程中若连接中断，可能不触发。 |
| `onDataSyncStart(type)` | 登录后某类业务数据开始自动同步时触发。 | `type` 为 `ChatDataSyncType` 位掩码，表示会话、好友或已加入群组等数据类型。 |
| `onDataSyncFinish(type, errorCode)` | 某类业务数据同步结束时触发。 | `errorCode === 0` 表示同步成功。 |

### 示例代码

```typescript
const connectionListener: ChatConnectEventListener = {
  onConnected(): void {
    // 连接成功
  },
  onDisconnected(errorCode?: number, info?: { deviceName?: string; ext?: string }): void {
    // 连接断开，根据 errorCode 和 info 处理；可恢复的网络问题由 SDK 自动重连
  },
  onDatabaseOpened(username: string, errorCode: number): void {
    if (errorCode === 0) {
      // username 对应的本地数据库已打开
    } else {
      console.error('打开本地数据库失败：', username, errorCode);
    }
  },
  onTokenWillExpire(): void {
    // 从应用服务器获取新 Token 后调用 renewToken
  },
  onTokenDidExpire(): void {
    // Token 已过期，获取新 Token 后重新登录
  },
  onOfflineMessageSyncStart(): void {
    // 开始同步离线消息
  },
  onOfflineMessageSyncFinish(): void {
    // 离线消息同步完成
  },
  onDataSyncStart(type: ChatDataSyncType): void {
    // type 对应的数据开始自动同步
  },
  onDataSyncFinish(type: ChatDataSyncType, errorCode: number): void {
    if (errorCode === 0) {
      // type 对应的数据同步成功
    } else {
      console.error('数据同步失败：', type, errorCode);
    }
  },
};

ChatClient.getInstance().addConnectionListener(connectionListener);
```

不再需要监听时移除监听器：

```typescript
// 移除此前注册的同一个监听器对象
ChatClient.getInstance().removeConnectionListener(connectionListener);
```

:::tip
SDK 通过 JavaScript 回调通知连接状态，无需添加 Android 原生线程切换代码。不要在回调中执行大量耗时操作，以免阻塞 JavaScript 线程。
:::

## 连接恢复与异常处理

### 自动重连

登录成功后，如果因网络信号弱、网络切换或其他可恢复原因导致连接中断，SDK 会自动尝试重连，无需应用手动调用登录接口。

连接断开时触发 `ChatConnectEventListener#onDisconnected`；重连成功后触发 `onConnected`。React Native SDK 5.x 不提供独立的 `onConnecting` 或 `onReconnectFailed` 回调，应用应结合这两个回调、`ChatClient#isConnected` 以及网络状态展示连接状态。

以下情况不会仅靠自动重连恢复，应用需要根据回调错误码处理账号、Token、设备或服务限制：

- 用户主动调用 `ChatClient#logout`。
- Token 无效或已过期。
- 账号被删除、在其他设备登录或被强制退出。
- 登录设备数、应用活跃用户数达到限制，或服务被禁用。

### 连接断开和异常登出处理

`ChatConnectEventListener#onDisconnected` 表示连接已断开，但不一定表示用户已退出登录。React Native SDK 5.x 不提供独立的 `onLogout` 回调，账号、设备或服务限制等异常登出也通过 `onDisconnected(errorCode?, info?)` 通知。

处理该回调时，应区分以下情况：

- 网络错误等可恢复的连接原因，由 SDK 自动尝试重连，不应立即引导用户重新登录。例如，`ChatDisconnectErrorCode.NETWORK_ERROR`（2）、`SERVER_NOT_REACHABLE`（300）、`SERVER_UNKNOWN_ERROR`（303）和 `SERVER_DECRYPTION_FAILED`（306）。错误码 `EXCEED_SERVICE_LIMIT`（4）也属于连接原因，应检查配额，不要直接将其视为退出登录。
- 账号被删除、设备互踢等异常登出原因，需要先处理对应问题，再按业务策略重新登录。
- `errorCode` 可能为 `undefined`，例如 iOS 端网络断开时未提供具体原因；Android 端网络断开时通常返回 `NETWORK_ERROR`（2）。未提供错误码或收到枚举未列出的错误码时，不应仅据此判断用户已退出登录。

常见错误如下。登录调用失败可通过 Promise 拒绝获取错误；不要假设所有登录错误都会再次触发连接回调。

| 场景 | 错误码 | 建议处理 |
| :--- | :--- | :--- |
| Token 无效 | `ChatDisconnectErrorCode.INVALID_TOKEN`（104） | 获取正确 Token 后重新登录。 |
| Token 已过期 | `108`；过期通知为 `ChatConnectEventListener#onTokenDidExpire` | 获取新 Token 后重新登录。该枚举未定义 `TOKEN_EXPIRED` 成员，不要等待 `onDisconnected` 覆盖过期事件。 |
| 用户鉴权失败 | `ChatDisconnectErrorCode.USER_AUTHENTICATION_FAILED`（202） | 检查用户 ID 和 Token 后重新登录；同时处理 `onTokenDidExpire`。 |
| 用户在其他设备登录 | `ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE`（206） | 提示用户，并根据业务策略决定是否重新登录。 |
| 用户账号被服务器删除 | `ChatDisconnectErrorCode.USER_REMOVED_FROM_SERVER`（207） | 先处理账号状态，不应直接重复登录。 |
| 用户已绑定其他设备 | `ChatDisconnectErrorCode.USER_BIND_ANOTHER_DEVICE`（213） | 根据设备绑定策略处理后重新登录。 |
| 登录设备数超过限制 | `ChatDisconnectErrorCode.USER_LOGIN_TOO_MANY_DEVICES`（214） | 先处理设备数限制。 |
| 用户修改密码后被踢下线 | `ChatDisconnectErrorCode.USER_KICKED_BY_CHANGE_PASSWORD`（216） | 重新获取 Token 后登录。 |
| 用户被其他设备、API 或控制台强制退出 | `ChatDisconnectErrorCode.USER_KICKED_BY_OTHER_DEVICE`（217） | 提示用户，并按业务策略重新登录。 |
| 登录设备发生变化 | `ChatDisconnectErrorCode.USER_DEVICE_CHANGED`（220） | 根据设备策略处理后重新登录。 |
| DAU 或 MAU 达到上限 | `ChatDisconnectErrorCode.APP_ACTIVE_NUMBER_REACH_LIMIT`（8） | 检查应用配额或联系商务。 |
| 服务被限制 | `ChatDisconnectErrorCode.SERVER_SERVICE_RESTRICTED`（305） | 检查服务开通和配额状态。 |

当 `onDisconnected` 的错误码为 `ChatDisconnectErrorCode.USER_LOGIN_FROM_OTHER_DEVICE` 时，`info` 可提供将当前设备踢下线的新设备名称 `deviceName` 和扩展信息 `ext`，应用可用于展示更明确的提示。`info` 及其中的字段均为可选值。

### Token 生命周期

SDK 会根据登录 Token 的有效期触发以下回调：

- `ChatConnectEventListener#onTokenWillExpire`：Token 即将过期。SDK 通常在 Token 有效期达到约 80% 时触发该回调。
- `ChatConnectEventListener#onTokenDidExpire`：Token 已过期，SDK 会退出登录。

收到 `onTokenWillExpire` 后，应从应用服务器获取新 Token，并调用 `ChatClient#renewToken`：

```typescript
try {
  // 使用从应用服务器获取的新 Token 续期
  await ChatClient.getInstance().renewToken(newToken);
  // Token 续期成功
} catch (error: unknown) {
  // Token 续期失败
  console.error('Token 续期失败：', error);
}
```

`ChatClient#renewToken` 要求 SDK 已初始化、当前用户已登录且新 Token 不为空。若已经触发 `ChatConnectEventListener#onTokenDidExpire`，应获取新 Token 后重新调用 `ChatClient#loginWithToken`，而不是继续依赖自动重连。

### 离线消息和业务数据同步

登录成功或连接恢复后，如果服务端存在离线消息，SDK 会自动同步。可通过 `ChatConnectEventListener#onOfflineMessageSyncStart` 和 `ChatConnectEventListener#onOfflineMessageSyncFinish` 监听同步过程。

会话、好友和已加入群组等数据的登录后自动同步状态，则通过 `ChatConnectEventListener#onDataSyncStart` 和 `ChatConnectEventListener#onDataSyncFinish` 监听。两类同步回调含义不同，不应混用。

应用应在 `ChatClient#init` 前通过 `ChatOptions.dataSyncType` 显式配置需要自动同步的数据类型。`ChatDataSyncType` 为位掩码：`None`（0）表示不同步，`Conversations`（1）、`Contacts`（2）和 `JoinedGroups`（4）分别表示自动同步会话、好友和已加入群组，可通过按位或运算组合。

未设置 `dataSyncType` 时，SDK 不向原生层传入该字段，不能据此假定双端具有相同的默认同步范围。依赖自动同步的业务应显式配置；收到相应类型的 `onDataSyncFinish` 且 `errorCode === 0` 后，再从本地接口读取同步结果。本地数据库打开或登录 Promise 成功完成均不表示业务数据已经同步完成。

## 最佳实践

- 在调用 `ChatClient#loginWithToken` 前注册 `ChatConnectEventListener`，避免遗漏连接、Token 和同步状态回调。
- 弱网断开后不要立即重复调用登录接口；可恢复场景由 SDK 自动重连。
- 使用 `ChatClient#isConnected` 查询当前连接状态，结合登录、登出结果和连接回调管理登录状态，并优先以监听器回调驱动 UI 更新。
  **注意**：`ChatClient#isConnected` 通常用于 UI 连接状态提示。调用发送消息或加入群组或聊天室等 API 时，应按对应接口处理调用结果，不要将一次状态查询作为操作一定成功的保证，也不要假设所有失败的操作都会在重连后自动重试。
- 收到 `ChatConnectEventListener#onTokenWillExpire` 后尽快续期 Token；收到 `onTokenDidExpire` 后重新登录。
- 使用 `ChatConnectEventListener#onDisconnected` 的错误码处理账号、设备和服务限制等不可恢复的异常登出，并根据错误码给出明确提示。
- 不再需要监听时调用 `ChatClient#removeConnectionListener`，避免重复回调和内存泄漏。
- 不要在 JavaScript 回调中执行大量耗时操作。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`init`](#连接生命周期) | `ChatClient` | 初始化 React Native SDK。 |
| [`loginWithToken`](#连接生命周期) | `ChatClient` | 使用用户 ID 和 Token 登录并建立连接。 |
| [`logout`](#连接生命周期) | `ChatClient` | 主动登出并关闭当前连接。 |
| [`isConnected`](#获取连接状态) | `ChatClient` | 查询 SDK 当前是否已连接到服务器。 |
| [`renewToken`](#token-生命周期) | `ChatClient` | 更新当前登录使用的 Token。 |
| [`addConnectionListener`](#监听连接变化) | `ChatClient` | 注册连接监听器。 |
| [`removeConnectionListener`](#监听连接变化) | `ChatClient` | 移除指定的连接监听器。 |
| [`dataSyncType`](#离线消息和业务数据同步) | `ChatOptions` | 登录后自动同步的数据类型。 |
