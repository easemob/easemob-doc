# 连接

## 功能说明

应用客户端成功连接到环信服务器后，才能使用环信即时通讯 IM SDK 的收发消息、会话同步、好友列表同步、群组同步和用户属性同步等能力。

Web SDK 登录成功后会建立到消息服务的长连接。连接运行期间，SDK 会通过连接事件通知业务层连接状态变化、自动重连过程、Token 生命周期变化、离线消息同步状态以及异常断开原因。本文主要介绍连接状态、连接事件、自动重连、Token 生命周期、离线消息同步和连接断开处理。

:::tip
登录 SDK、退出登录、获取当前登录用户信息以及多设备登录相关说明，详见 [登录](login.html)。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 已登录 SDK。登录方式及参数说明，详见 [登录](login.html#登录)。
- 已根据业务需要注册对应的 Manager。例如，使用消息和会话功能时需在初始化时注册 `ChatManager`。

## 连接生命周期

SDK 的连接生命周期通常包括以下阶段：

1. 调用 `ChatClient.init` 初始化 SDK。
2. 调用 `client.addEventHandler` 注册连接事件监听。
3. 调用 `client.login` 登录 SDK，并建立长连接。
4. 连接成功后，SDK 恢复本地缓存，并按配置执行会话列表、好友列表、群组和用户属性等同步。
5. 连接中断后，SDK 根据中断原因自动重连，或通知业务层重新登录。
6. 调用 `client.logout` 登出 SDK，并关闭当前连接。

```typescript
const client = ChatClient.init({
  appKey: 'easemob-demo#chatdemoui',
  managers: [ChatManager],
});

client.addEventHandler('connection-listener', {
  onConnected: event => {
    console.log('连接成功:', event);
  },
  onDisconnected: event => {
    console.log('连接断开:', event.reason, event.errorCode, event.errorMessage);
  },
});

await client.login({
  userId: 'userId',
  token: 'token',
});
```

:::tip
`client.login` 成功后 Promise resolve，不携带返回值。若当前 SDK 已处于连接中或已连接状态，再次调用 `login` 会失败；如需切换登录用户，请先调用 `logout`。
:::

## 获取连接状态

你可以调用 `getConnectionState` 获取当前连接状态：

```typescript
const state = client.getConnectionState();
console.log('当前连接状态:', state);
```

连接状态取值如下：

| 连接状态 | 说明 |
| :--- | :--- |
| `disconnected` | 已断开连接。 |
| `connecting` | 正在连接服务器。 |
| `connected` | 已连接服务器。 |
| `reconnecting` | 正在自动重连。 |
| `reconnectFailed` | 自动重连失败。 |

:::tip
`getConnectionState` 返回的是连接状态，不是单独的登录状态。如需获取当前登录用户、设备资源标识或 REST 访问上下文，详见 [获取当前登录状态和信息](login.html#获取当前登录状态和信息)。
:::

## 监听连接变化

SDK 通过 `client.addEventHandler` 注册连接相关事件。建议在调用 `login` 前注册监听，以便完整感知连接建立、连接断开、自动重连、Token 生命周期变化和离线消息同步状态。

### 连接事件说明

| 连接事件名称 | 触发时机 | 说明 |
| :--- | :--- | :--- |
| `onConnecting` | SDK 正在连接服务器时触发，包括首次登录连接和自动重连。 | 事件载荷中包含当前连接状态、触发原因、重连次数等信息。 |
| `onConnected` | SDK 成功连接服务器时触发。 | 首次登录成功或自动重连成功后均可能触发。 |
| `onDisconnected` | SDK 与服务器断开连接时触发。 | 可通过事件载荷中的 `reason`、`errorCode` 和 `errorMessage` 判断断开原因。 |
| `onReconnectFailed` | 自动重连达到最大重试次数后触发。 | 触发后 SDK 不再继续自动重连，业务层可提示用户检查网络或按业务策略重新登录。 |
| `onTokenWillExpire` | 当前登录 Token 即将过期时触发。 | 该事件无载荷。建议获取新 Token 后调用 `renewToken` 续期。 |
| `onTokenExpired` | 当前登录 Token 已过期时触发。 | 该事件无载荷。Token 过期后需要重新获取 Token 并登录 SDK。 |
| `onOfflineMessageSyncStart` | SDK 开始同步离线消息时触发。 | 若存在需要同步的离线消息队列，SDK 会在同步开始时触发该事件。 |
| `onOfflineMessageSyncFinish` | SDK 完成离线消息同步时触发。 | 所有离线消息队列同步完成后触发。 |

`onConnecting`、`onConnected`、`onDisconnected` 和 `onReconnectFailed` 事件回调参数中的主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `state` | String | 当前连接状态。 |
| `reason` | String | 连接状态变化原因。 |
| `attempt` | Number | 当前重连尝试次数。 |
| `maxAttempts` | Number | 最大重连次数。 |
| `isLoginPhase` | Boolean | 是否处于登录建连阶段。 |
| `isOnline` | Boolean | 当前运行环境是否在线。 |
| `errorCode` | Number | 错误码。仅部分错误场景存在。 |
| `errorMessage` | String | 错误信息。仅部分错误场景存在。 |
| `timestamp` | Number | 事件时间戳，单位为毫秒。 |

连接状态变化原因 `reason` 的常见取值如下：

| 取值 | 说明 |
| :--- | :--- |
| `login` | 登录建连。 |
| `reconnect` | 自动重连。 |
| `online` | 运行环境恢复在线。 |
| `offline-recover` | 离线后恢复连接。 |
| `heartbeat-failed` | 心跳失败。 |
| `send-timeout` | 发送超时。 |
| `close` | 连接关闭。 |
| `error` | 连接错误。 |
| `timeout` | 连接超时。 |
| `limit` | 达到重试或连接限制。 |
| `offline` | 当前运行环境离线。 |
| `token-expired` | Token 过期导致断开。 |

### 示例代码

```typescript
client.addEventHandler('connection-listener', {
  onConnecting: event => {
    console.log('正在连接:', event.reason, event.attempt, event.maxAttempts);
  },
  onConnected: event => {
    console.log('连接成功:', event.reason);
  },
  onDisconnected: event => {
    console.log('连接断开:', event.reason, event.errorCode, event.errorMessage);
  },
  onReconnectFailed: event => {
    console.log('自动重连失败:', event.reason, event.attempt, event.maxAttempts);
  },
  onTokenWillExpire: async () => {
    const newToken = await fetchNewTokenFromServer();
    await client.renewToken(newToken);
  },
  onTokenExpired: () => {
    console.log('Token 已过期，需要重新获取 Token 后登录');
  },
  onOfflineMessageSyncStart: () => {
    console.log('开始同步离线消息');
  },
  onOfflineMessageSyncFinish: () => {
    console.log('离线消息同步完成');
  },
});
```

## 连接恢复与异常处理

### 自动重连

登录成功后，SDK 会维护长连接，并在网络恢复、心跳失败、连接异常关闭等可恢复场景下尝试自动重连。

自动重连过程中，SDK 会触发 `onConnecting`、`onDisconnected` 和 `onConnected` 等事件。若自动重连达到最大重试次数，SDK 会触发 `onReconnectFailed`。触发 `onReconnectFailed` 后，SDK 不再继续自动重连，业务层可提示用户检查网络状态，或按业务策略重新登录。

并非所有连接断开场景都适合依赖自动重连。对于 Token 过期、鉴权失败、账号状态变化、设备限制或服务配额限制等场景，业务层需要根据连接事件中的错误信息进行处理。

### 连接断开原因和处理方式

当 SDK 因鉴权失败、Token 过期、账号状态变化、设备限制、服务配额限制或自动重连失败等原因断开连接时，连接事件中可能包含对应的错误信息。业务层可通过 `onDisconnected` 或 `onReconnectFailed` 事件回调中的 `errorCode` 和 `errorMessage` 判断断开原因，并按需执行重新登录、Token 更新或异常提示等处理。常见错误码说明如下：

| 场景 | 错误码 / Key | 是否需要重新登录 | 说明 |
| :--- | :--- | :--- | :--- |
| Token 已过期 | `108` / `AUTH_TOKEN_EXPIRED` | 是 | 需获取新 Token 后重新调用 `login`。 |
| Token 不匹配或鉴权失败 | `202` / `AUTH_UNAUTHORIZED` | 是 | 需修正 Token 或登录信息后重新登录。 |
| 用户账号不存在或登录阶段发现账号已被删除 | `202` / `AUTH_UNAUTHORIZED` | 否，需先处理账号状态 | 登录鉴权阶段可能按未授权处理。 |
| 用户在线期间账号被服务端删除 | `207` / `USER_REMOVED` | 否，需先处理账号状态 | 当前连接会被断开。 |
| 用户在另一设备登录并踢出当前设备 | `206` / `USER_LOGIN_ANOTHER_DEVICE` | 视业务策略处理 | 通常需要提示用户当前账号已在其他设备登录。 |
| 用户因修改密码被踢下线 | `216` / `USER_KICKED_BY_CHANGE_PASSWORD` | 是 | 通常需重新获取 Token 后登录。 |
| 用户在其他设备、通过 API 或控制台被强制退出 | `217` / `USER_KICKED_BY_OTHER_DEVICE` | 视业务策略处理 | 可提示用户被强制退出，如需继续使用再重新登录。 |
| 登录设备数超过限制 | `214` / `AUTH_LOGIN_TOO_MANY_DEVICES` | 需先处理设备数限制 | 不能仅靠重复登录解决。 |
| 绑定到其他设备或登录资源变化 | `213` / `AUTH_BIND_ANOTHER_DEVICE`，或 `220` / `USER_DEVICE_CHANGED` | 视业务策略处理 | 通常需要重新登录或引导用户处理设备状态。 |
| DAU、MAU 或在线人数达到上限 | `4` / `SERVICE_LIMIT_EXCEEDED` | 否，需先处理配额限制 | 不能通过重新登录解决，需检查应用配额或联系商务。 |
| 自动重连达到最大重试次数 | 无固定业务错误码；状态为 `reconnectFailed`，原因可能为 `limit` | 可按业务策略重新登录 | 建议先检查网络和鉴权状态。 |
| 当前运行环境离线 | 无固定错误码；原因通常为 `offline` | 不需要立即重新登录 | SDK 会暂停重连，网络恢复后再尝试恢复连接。 |
| 用户主动调用 `logout` | 无错误码 | 如需继续使用需重新登录 | 主动登出后 SDK 不会自动恢复当前连接。 |

### Token 生命周期

SDK 会根据当前登录 Token 的过期时间管理 Token 生命周期：

- 当 Token 即将过期时，SDK 触发 `onTokenWillExpire`。该事件通常在 Token 生命周期达到约 80% 时触发。
- 当 Token 已过期时，SDK 触发 `onTokenExpired`，并断开当前连接。

收到 `onTokenWillExpire` 后，建议业务层从应用服务器获取新的 IM Token，并调用 `renewToken` 续期。`renewToken` 仅在 SDK 已连接时可调用。若 Token 已过期并触发 `onTokenExpired`，需要重新获取 Token 后调用 `login` 登录 SDK。详见 [Token 续期](login.html#token-续期)。

### 离线消息同步

登录成功或连接恢复后，若服务端存在需要同步的离线消息，SDK 会自动拉取离线消息。你可以通过 `onOfflineMessageSyncStart` 和 `onOfflineMessageSyncFinish` 监听离线消息同步状态。

```typescript
client.addEventHandler('offline-message-sync-listener', {
  onOfflineMessageSyncStart: () => {
    console.log('开始同步离线消息');
  },
  onOfflineMessageSyncFinish: () => {
    console.log('离线消息同步完成');
  },
});
```

:::tip
离线消息同步事件属于连接事件，通过 `client.addEventHandler` 注册监听。
:::

## 最佳实践

- 建议在调用 `login` 前注册连接事件监听，避免遗漏连接建立、自动重连、离线消息同步或 Token 生命周期事件。
- 业务层可以结合 `getConnectionState` 判断当前连接状态，但 UI 刷新更推荐通过连接事件驱动。
- 网络断开后，SDK 会暂停重连；网络恢复后，SDK 会根据当前登录状态尝试恢复连接。
- 不要在已连接或连接中的状态下重复调用 `login`。如需切换用户，请先调用 `logout`。
- 收到 `onTokenWillExpire` 后应尽快续期 Token；收到 `onTokenExpired` 后应重新登录。

- 若收到 `onTokenWillExpire`，建议尽快续期 Token；若收到 `onTokenExpired`，需重新获取 Token 并登录 SDK。
- 若收到 `onReconnectFailed`，建议提示用户检查网络、确认 Token 和账号状态，或按业务策略重新登录。
- 多设备登录或账号状态异常导致断开时，建议结合 `onDisconnected` 事件中的错误码和错误信息区分账号被删除、其他设备登录、修改密码、强制退出、设备数超限等情况，并给出明确提示。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`login`](#连接生命周期) | `ChatClient` | 登录 SDK，并建立到消息服务的连接。 |
| [`getConnectionState`](#获取连接状态) | `ChatClient` | 获取当前连接状态。 |
| [`renewToken`](#连接恢复与异常处理) | `ChatClient` | 在 Token 即将过期或已过期时续期当前登录会话。 |
| [`logout`](#连接生命周期) | `ChatClient` | 登出 SDK，并关闭当前连接。 |
