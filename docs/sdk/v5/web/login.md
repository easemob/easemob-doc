# Login

After initializing the EasyIM SDK, call `client.login` to log in to the SDK. After login succeeds, the SDK establishes a persistent connection to the message service, restores the local cache, and synchronizes data such as the conversation list, friend list, chat groups, and user attributes according to the initialization configuration. You can use EasyIM features such as message sending and receiving, conversation management, user relationships, and chat group management only after a successful login.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK. For details, see [Initialization](initialization.html).
- Login, token renewal, logout, and retrieval of the current login state are called through the `ChatClient` instance and do not require an additional Manager.
- You have obtained a valid user ID and token.

## Register a user

Before logging in to the SDK, you must first create an IM user. Before creating a user, set the user registration mode on the **Chat > Features > User & Login** page in [EasyIM Console](https://console.easyim.ai/user/login).

The following user registration modes are available:

- **Authorized Registration**: Register users through the REST APIs provided by EasyIM. An app token is required. This mode is suitable for production environments. After a user is successfully registered, you can save the user account to your App Server or return it to the client.
- **Open Registration**: Register users directly through the REST API without passing a token. This mode is generally used for demos and test environments and is not recommended for production environments.

After setting the registration mode, you can create users in either of the following ways:

1. **Create users by calling the REST API**

   - Authorized registration: [Create a single user](/rest/account_register_authorized_single.html) or [multiple users](/rest/account_register_authorized_batch.html) through the RESTful APIs.
   - Open registration: [Create users](/rest/account_register_open.html) through the open registration API.

2. **Create users in EasyIM Console**

   You can create users in a production or test environment in [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Create a user](/product/console/operation_user.html#create-a-user).

## Login

The SDK logs in using a user ID and user token. When calling `client.login`, pass `userId` and `token`. After login succeeds, the SDK establishes a persistent connection to the message service. The Promise returned by `login` resolves without a value.

In a test environment, after you create users in the [EasyIM Console](https://console.easyim.ai/user/login), the EasyIM server automatically assigns user tokens to them. For details, see [Create users](/product/console/operation_user.html#create-a-user).

For a production environment, you are advised to integrate the [app token retrieval API](/rest/easemob_app_token.html) and [user token retrieval API](/rest/easemob_user_token.html) on your app server. The client then retrieves the user token from your app server before logging in to the SDK.

```typescript
const client = ChatClient.init({
  appKey: 'easemob-demo#chatdemoui',
});

await client.login({
  userId: 'username',
  token: 'token',
});
```

Note the following when logging in:

- `userId` and `token` are required.
- You are advised to register a connection event listener before calling `login` so that you can receive connection-success, disconnection, and token-lifecycle events.
- If the SDK is connecting or already connected, another call to `login` fails.
- To switch users, call `logout` to log out the current user before logging in with the new user ID and token.

Example code:

```typescript
client.addEventHandler('login-listener', {
  onConnected: event => {
    console.log('Logged in and connected successfully:', event);
  },
  onDisconnected: event => {
    console.log('Disconnected:', event.reason, event.errorCode, event.errorMessage);
  },
  onTokenWillExpire: async () => {
    const newToken = await fetchNewTokenFromServer();
    await client.renewToken(newToken);
  },
  onTokenExpired: () => {
    console.log('The token has expired. Retrieve a new token and log in again');
  },
});

await client.login({
  userId: 'username',
  token: 'token',
});
```

:::tip
To subsequently use message, conversation, friend, chat group, and other features, register the corresponding Manager when initializing the SDK. For example, register `ChatManager` to use message and conversation features.
:::

## Retrieve the current login state and information

After a successful login, call the following methods to retrieve the current connection state, logged-in user, and device resource identifier.

| Method | Return value | Description |
| :--- | :--- | :--- |
| `getConnectionState` | String | Retrieves the current connection state. Possible values are `disconnected`, `connecting`, `connected`, `reconnecting`, and `reconnectFailed`. |
| `getCurrentUserId` | String \| null | Retrieves the currently logged-in user ID. Returns `null` when no user is logged in. |
| `getClientResource` | String \| null | Retrieves the device resource identifier of the current connection. Returns `null` when the SDK is disconnected or the login handshake is not complete. |
| `getRestContext` | RestContext | Retrieves the REST access context of the current login session, including the REST address, App Key, user ID, token, and device resource identifier. Throws an error if the user is not logged in or the context is incomplete. |

```typescript
const state = client.getConnectionState();
const userId = client.getCurrentUserId();
const clientResource = client.getClientResource();

console.log('Connection state:', state);
console.log('Current logged-in user:', userId);
console.log('Device resource identifier:', clientResource);

if (state === 'connected') {
  const restContext = client.getRestContext();
  console.log('REST access context:', restContext);
}
```

:::tip
`getConnectionState` returns the connection state, not a separate login state. You can generally use it together with `getCurrentUserId` to determine whether a user is logged in to the SDK.
:::

## Renew the token

The SDK manages the token lifecycle according to the expiration time of the current login token:

- When the token is about to expire, the SDK triggers `onTokenWillExpire`. This event is generally triggered at approximately 80% of the token lifecycle.
- When the token has expired, the SDK triggers `onTokenExpired` and disconnects the current connection.

After receiving `onTokenWillExpire`, we recommend retrieving a new user token from your app server and calling `renewToken` to update it. After the update succeeds, `renewToken` returns the new `token` and `expireAt`, which specify the token currently in effect and its expiration timestamp in milliseconds.

```typescript
client.addEventHandler('token-listener', {
  onTokenWillExpire: async () => {
    const newToken = await fetchNewTokenFromServer();
    const result = await client.renewToken(newToken);
    console.log('Token renewed successfully. Expiration time:', result.expireAt);
  },
  onTokenExpired: () => {
    console.log('The token has expired. Retrieve a new token and log in again');
  },
});
```

You can call `renewToken` only when the SDK is connected. If the token expires and triggers `onTokenExpired`, retrieve a new token and call `login` to log in to the SDK again.

## Logout

Call `logout` to log out:

```typescript
await client.logout();
```

After you call `logout`, the SDK closes the current connection, cancels ongoing synchronization tasks, clears the currently logged-in user, token, device resource identifier, runtime cache references, and log-reporting state, and changes the connection state to `disconnected`. To continue using EasyIM features, call `login` again.

## Multi-device login

In addition to single-device login on one platform, EasyIM allows the same account to log in on multiple devices across multiple platforms. If the number of devices logged in on the same platform exceeds the limit, a newly logged-in device may kick an earlier device offline. For device limits, device-kicking policies, and information synchronization rules, see [Multi-device Login](multi_device.html).

**Control the device identifier through initialization parameters**

Use the following initialization parameters to control the device identifier:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `useFixedDeviceId` | Boolean | Whether to reuse a fixed device identifier in the same browser. The default value is `true`, and multiple tabs in the same browser are generally treated as the same device. If set to `false`, each SDK instance uses a random device ID. |
| `deviceId` | String | Custom device identifier. If omitted, the SDK default is used. |
| `customOSPlatform` | Number | Custom platform number in the range 1-100, used to distinguish different platforms. |
| `customDeviceName` | String | Custom device name, generally used together with `customOSPlatform`. |
| `loginExtensionInfo` | String | Custom login extension. When a multi-device login policy causes the current device to be kicked offline, this field can carry extension information related to the kick-off event. The maximum length is 1024 characters. |

Example code:

```typescript
const client = ChatClient.init({
  appKey: 'easemob-demo#chatdemoui',
  useFixedDeviceId: true,
  customOSPlatform: 10,
  customDeviceName: 'web-custom-device',
  loginExtensionInfo: 'login from web',
});
```

**Device kicking**

When a multi-device login policy causes the current device to be kicked offline, the SDK triggers the `onDisconnected` event. Use `errorCode` and `errorMessage` in the event callback to determine the reason for disconnection and, as appropriate for your app, notify the user or direct them to log in again.

The following table lists common multi-device error codes:

| Scenario | Error code/Key | Description |
| :--- | :--- | :--- |
| The user logs in on another device, which kicks the current device offline | `206` / `USER_LOGIN_ANOTHER_DEVICE` | Generally, notify the user that the current account has logged in on another device. |
| The user is kicked offline after changing the password | `216` / `USER_KICKED_BY_CHANGE_PASSWORD` | Generally, retrieve a new token and log in again. |
| The user is forcibly logged out from another device, through an API, or in the EasyIM Console | `217` / `USER_KICKED_BY_OTHER_DEVICE` | You can notify the user that they were forcibly logged out and direct them to log in again if they want to continue. |
| The number of logged-in devices exceeds the limit | `214` / `AUTH_LOGIN_TOO_MANY_DEVICES` | Resolve the device-count limit first. Repeated login attempts alone cannot resolve this issue. |
| The account is bound to another device, or the login resource changes | `213` / `AUTH_BIND_ANOTHER_DEVICE`, or `220` / `USER_DEVICE_CHANGED` | Generally, log in again or direct the user to resolve the device state. |

**Retrieve login information for other devices**

Call `getSelfIdsOnOtherPlatform` to retrieve the login IDs for the current account on other logged-in devices:

```typescript
const otherDeviceIds = await client.getSelfIdsOnOtherPlatform();
console.log(otherDeviceIds);
```

A login ID consists of the user ID and device resource identifier in the format `userId/resource`.

- `userId`: User ID of the currently logged-in user.
- `resource`: Device resource identifier, which identifies the current logged-in device.

For example, for the login ID `alice/web_7f3a9c`, `alice` is the user ID and `web_7f3a9c` is the device resource identifier for that login.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`login`](#login) | `ChatClient` | Logs in to the SDK using a user ID and token. |
| [`getConnectionState`](#retrieve-the-current-login-state-and-information) | `ChatClient` | Retrieves the current connection state. |
| [`getCurrentUserId`](#retrieve-the-current-login-state-and-information) | `ChatClient` | Retrieves the currently logged-in user ID. |
| [`getClientResource`](#retrieve-the-current-login-state-and-information) | `ChatClient` | Retrieves the device resource identifier of the current connection. |
| [`getRestContext`](#retrieve-the-current-login-state-and-information) | `ChatClient` | Retrieves the REST context of the current login session. |
| [`renewToken`](#renew-the-token) | `ChatClient` | Renews the token for the current login session. |
| [`logout`](#logout) | `ChatClient` | Logs out of the current login session. |
| [`getSelfIdsOnOtherPlatform`](#multi-device-login) | `ChatClient` | Retrieves the login IDs for the current account on other logged-in devices. |
