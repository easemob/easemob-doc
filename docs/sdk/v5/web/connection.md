# Connection

## Feature overview

The app client can use EasyIM SDK capabilities such as message sending and receiving, conversation synchronization, friend-list synchronization, chat group synchronization, and user-attribute synchronization only after it successfully connects to the EasyIM server.

After a successful Web SDK login, the SDK establishes a persistent connection to the message service. While the connection is active, connection events notify your app of connection-state changes, automatic reconnection, token-lifecycle changes, offline-message synchronization states, and reasons for abnormal disconnection. This document describes connection states, connection events, automatic reconnection, the token lifecycle, offline-message synchronization, and disconnection handling.

:::tip
For information about logging in to and out of the SDK, retrieving the currently logged-in user, and multi-device login, see [Login](login.html).
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK. For details, see [Quickstart](quickstart.html).
- You have logged in to the SDK. For login methods and parameters, see [Login](login.html#login).
- You have registered the required Managers. For example, register `ChatManager` during initialization to use message and conversation features.

## Connection lifecycle

The SDK connection lifecycle generally includes the following stages:

1. Call `ChatClient.init` to initialize the SDK.
2. Call `client.addEventHandler` to register a connection event listener.
3. Call `client.login` to log in to the SDK and establish a persistent connection.
4. After connecting successfully, the SDK restores the local cache and synchronizes the conversation list, friend list, chat groups, user attributes, and other configured data.
5. After the connection is interrupted, the SDK automatically reconnects according to the reason for the interruption or notifies your app to log in again.
6. Call `client.logout` to log out of the SDK and close the current connection.

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
After `client.login` succeeds, its Promise resolves without a value. If the SDK is connecting or already connected, another call to `login` fails. To switch users, call `logout` first.
:::

## Retrieve the connection state

Call `getConnectionState` to retrieve the current connection state:

```typescript
const state = client.getConnectionState();
console.log('当前连接状态:', state);
```

The connection state can be any of the following values:

| Connection state | Description |
| :--- | :--- |
| `disconnected` | Disconnected. |
| `connecting` | Connecting to the server. |
| `connected` | Connected to the server. |
| `reconnecting` | Automatically reconnecting. |
| `reconnectFailed` | Automatic reconnection failed. |

:::tip
`getConnectionState` returns the connection state, not a separate login state. To retrieve the currently logged-in user, device resource identifier, or REST access context, see [Retrieve the current login state and information](login.html#retrieve-the-current-login-state-and-information).
:::

## Monitor connection changes

Use `client.addEventHandler` to register connection-related events. We recommend registering the listener before calling `login` so that you receive all events related to connection establishment, disconnection, automatic reconnection, token-lifecycle changes, and offline-message synchronization.

### Connection events

| Connection event | Trigger | Description |
| :--- | :--- | :--- |
| `onConnecting` | Triggered when the SDK is connecting to the server, including during the initial login connection and automatic reconnection. | The event payload contains the current connection state, trigger reason, reconnection attempt count, and other information. |
| `onConnected` | Triggered when the SDK successfully connects to the server. | May be triggered after the initial login succeeds or after automatic reconnection succeeds. |
| `onDisconnected` | Triggered when the SDK disconnects from the server. | Use `reason`, `errorCode`, and `errorMessage` in the event payload to determine the reason for disconnection. |
| `onReconnectFailed` | Triggered after automatic reconnection reaches the maximum number of attempts. | After this event is triggered, the SDK stops automatically reconnecting. Your app can prompt the user to check the network or log in again according to its business strategy. |
| `onTokenWillExpire` | Triggered when the current login token is about to expire. | This event has no payload. We recommend retrieving a new token and calling `renewToken` to renew it. |
| `onTokenExpired` | Triggered when the current login token has expired. | This event has no payload. After the token expires, retrieve a new token and log in to the SDK again. |
| `onOfflineMessageSyncStart` | Triggered when the SDK starts synchronizing offline messages. | If an offline-message queue needs to be synchronized, the SDK triggers this event when synchronization starts. |
| `onOfflineMessageSyncFinish` | Triggered when the SDK finishes synchronizing offline messages. | Triggered after all offline-message queues have been synchronized. |

The main fields in the callback parameters of `onConnecting`, `onConnected`, `onDisconnected`, and `onReconnectFailed` are as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `state` | String | Current connection state. |
| `reason` | String | Reason for the connection-state change. |
| `attempt` | Number | Current reconnection attempt count. |
| `maxAttempts` | Number | Maximum number of reconnection attempts. |
| `isLoginPhase` | Boolean | Whether the SDK is establishing the login connection. |
| `isOnline` | Boolean | Whether the current runtime environment is online. |
| `errorCode` | Number | Error code. Present only in some error scenarios. |
| `errorMessage` | String | Error message. Present only in some error scenarios. |
| `timestamp` | Number | Event timestamp in milliseconds. |

Common values of the connection-state change reason `reason` are as follows:

| Value | Description |
| :--- | :--- |
| `login` | Establishing a connection during login. |
| `reconnect` | Automatic reconnection. |
| `online` | The runtime environment is back online. |
| `offline-recover` | Restoring the connection after the environment was offline. |
| `heartbeat-failed` | Heartbeat failure. |
| `send-timeout` | Sending timeout. |
| `close` | Connection closed. |
| `error` | Connection error. |
| `timeout` | Connection timeout. |
| `limit` | Retry or connection limit reached. |
| `offline` | The current runtime environment is offline. |
| `token-expired` | Disconnected because the token expired. |

### Example code

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

## Connection recovery and error handling

### Automatic reconnection

After a successful login, the SDK maintains the persistent connection and attempts to reconnect automatically in recoverable scenarios, such as when the network recovers, a heartbeat fails, or the connection closes abnormally.

During automatic reconnection, the SDK triggers events such as `onConnecting`, `onDisconnected`, and `onConnected`. If automatic reconnection reaches the maximum number of attempts, the SDK triggers `onReconnectFailed`. After `onReconnectFailed` is triggered, the SDK stops automatically reconnecting. Your app can prompt the user to check the network or log in again according to its business strategy.

Not all disconnection scenarios should rely on automatic reconnection. For scenarios such as token expiration, authentication failure, account-state changes, device limits, or service quota limits, your app must handle the error information in the connection event.

### Disconnection reasons and handling

When the SDK disconnects because of authentication failure, token expiration, an account-state change, a device limit, a service quota limit, automatic-reconnection failure, or another reason, the connection event may contain the corresponding error information. Use `errorCode` and `errorMessage` in the `onDisconnected` or `onReconnectFailed` callback to determine the disconnection reason and, as needed, log in again, update the token, or display an error notification. Common error codes are described below:

| Scenario | Error code/Key | Login required | Description |
| :--- | :--- | :--- | :--- |
| Token expired | `108` / `AUTH_TOKEN_EXPIRED` | Yes | Retrieve a new token and call `login` again. |
| Token mismatch or authentication failure | `202` / `AUTH_UNAUTHORIZED` | Yes | Correct the token or login information and log in again. |
| The user account does not exist or was deleted before the login phase | `202` / `AUTH_UNAUTHORIZED` | No. Resolve the account state first. | The login authentication phase may treat this as unauthorized. |
| The user account is deleted on the server while the user is online | `207` / `USER_REMOVED` | No. Resolve the account state first. | The current connection is disconnected. |
| The user logs in on another device, which kicks the current device offline | `206` / `USER_LOGIN_ANOTHER_DEVICE` | Handle according to your business strategy. | Generally, notify the user that the current account has logged in on another device. |
| The user is kicked offline after changing the password | `216` / `USER_KICKED_BY_CHANGE_PASSWORD` | Yes | Generally, retrieve a new token and log in again. |
| The user is forcibly logged out from another device, through an API, or in the EasyIM Console | `217` / `USER_KICKED_BY_OTHER_DEVICE` | Handle according to your business strategy. | Notify the user that they were forcibly logged out and direct them to log in again if they want to continue. |
| The number of logged-in devices exceeds the limit | `214` / `AUTH_LOGIN_TOO_MANY_DEVICES` | Resolve the device-count limit first. | Repeated login attempts alone cannot resolve this issue. |
| The account is bound to another device, or the login resource changes | `213` / `AUTH_BIND_ANOTHER_DEVICE`, or `220` / `USER_DEVICE_CHANGED` | Handle according to your business strategy. | Generally, log in again or direct the user to resolve the device state. |
| The DAU, MAU, or number of online users reaches the limit | `4` / `SERVICE_LIMIT_EXCEEDED` | No. Resolve the quota limit first. | Logging in again cannot resolve this issue. Check the app quota or contact the EasyIM business manager. |
| Automatic reconnection reaches the maximum number of attempts | No fixed business error code. The state is `reconnectFailed`, and the reason may be `limit`. | You may log in again according to your business strategy. | We recommend checking the network and authentication state first. |
| The current runtime environment is offline | No fixed error code. The reason is generally `offline`. | You do not need to log in again immediately. | The SDK pauses reconnection and attempts to restore the connection after the network recovers. |
| The user calls `logout` | No error code | Log in again to continue using the SDK. | After an active logout, the SDK does not automatically restore the current connection. |

### Token lifecycle

The SDK manages the token lifecycle according to the expiration time of the current login token:

- When the token is about to expire, the SDK triggers `onTokenWillExpire`. This event is generally triggered at approximately 80% of the token lifecycle.
- When the token has expired, the SDK triggers `onTokenExpired` and disconnects the current connection.

After receiving `onTokenWillExpire`, we recommend that your app retrieve a new user token from the app server and call `renewToken` to renew it. You can call `renewToken` only when the SDK is connected. If the token expires and triggers `onTokenExpired`, retrieve a new token and call `login` to log in to the SDK again. For details, see [Renew the token](login.html#renew-the-token).

### Offline-message synchronization

After a successful login or connection recovery, if the server has offline messages to synchronize, the SDK retrieves them automatically. Use `onOfflineMessageSyncStart` and `onOfflineMessageSyncFinish` to monitor the offline-message synchronization state.

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
Offline-message synchronization events are connection events. Register their listener through `client.addEventHandler`.
:::

## Best practices

- We recommend registering a connection event listener before calling `login` to avoid missing connection-establishment, automatic-reconnection, offline-message synchronization, or token-lifecycle events.
- Your app can use `getConnectionState` to determine the current connection state, but connection events are recommended for driving UI updates.
- After the network disconnects, the SDK pauses reconnection. When the network recovers, the SDK attempts to restore the connection according to the current login state.
- Do not call `login` again while the SDK is connected or connecting. To switch users, call `logout` first.
- Renew the token as soon as possible after receiving `onTokenWillExpire`. Log in again after receiving `onTokenExpired`.

- If you receive `onTokenWillExpire`, we recommend renewing the token as soon as possible. If you receive `onTokenExpired`, retrieve a new token and log in to the SDK again.
- If you receive `onReconnectFailed`, prompt the user to check the network and verify the token and account state, or log in again according to your business strategy.
- If multi-device login or an abnormal account state causes a disconnection, use the error code and error message in `onDisconnected` to distinguish scenarios such as account deletion, login on another device, password change, forced logout, or exceeding the device-count limit, and provide a clear notification.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`login`](#connection-lifecycle) | `ChatClient` | Logs in to the SDK and establishes a connection to the message service. |
| [`getConnectionState`](#retrieve-the-connection-state) | `ChatClient` | Retrieves the current connection state. |
| [`renewToken`](#connection-recovery-and-error-handling) | `ChatClient` | Renews the token for the current login session when the token is about to expire or has expired. |
| [`logout`](#connection-lifecycle) | `ChatClient` | Logs out of the SDK and closes the current connection. |
