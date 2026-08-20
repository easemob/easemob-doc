# Connection

## Feature overview

The app client must successfully connect to the EasyIM server before it can use message sending and receiving in the EasyIM SDK or other features that require server access.

After you call `EMClient#loginWithToken` to log in, the SDK establishes and maintains a persistent connection. While the connection is running, the SDK uses `EMConnectionListener` to notify the app of state changes involving the connection, abnormal logout, token lifecycle, local database opening, offline message synchronization, and automatic data synchronization after login.

For details about login, logout, and login state, see [Login](login.html).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. For details, see [Quickstart](quickstart.html).
- Obtain a valid user ID and user token.
- Understand the EasyIM API [limitations](/product/limitation.html).

## Connection lifecycle

The Android SDK connection lifecycle generally includes these stages:

1. Call `EMClient#init` to initialize the SDK.
2. Call `addConnectionListener` to register a connection listener. We recommend registering it before login.
3. Call `loginWithToken` to log in to the SDK and establish a persistent connection.
4. `onDatabaseOpened` is triggered after the user's local database is opened. This callback indicates only that the local database is available, not that the online connection succeeded.
5. `onConnected` is triggered after the SDK successfully connects to the server. The SDK then synchronizes offline messages and business data according to the initialization configuration.
6. After the connection is interrupted, the SDK automatically reconnects according to the cause, or notifies the app through `onLogout` to handle an unrecoverable abnormal logout.
7. Call `logout` to explicitly log out and close the current connection.

```java
EMConnectionListener connectionListener =
        new EMConnectionListener() {
            @Override
            public void onConnected() {
                // The SDK has successfully connected to the server.
            }

            @Override
            public void onDisconnected(int errorCode) {
                // The SDK is disconnected from the server.
            }
        };

EMClient.getInstance().addConnectionListener(connectionListener);

EMClient.getInstance().loginWithToken(
        userId,
        token,
        new EMCallBack() {
            @Override
            public void onSuccess() {
                // Login succeeded.
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
                // Login failed. Handle the error based on the error code and error message.
            }
        });
```

## Retrieve the connection state

Call `EMClient#isConnected` to query whether the SDK is currently connected to the server:

```java
boolean connected = EMClient.getInstance().isConnected();
```

Call `EMClient#isLoggedIn` to query whether the current user is logged in:

```java
boolean loggedIn = EMClient.getInstance().isLoggedIn();
```

| API | Description |
| :--- | :--- |
| `isConnected()` | Returns whether the SDK is connected to the server. |
| `isLoggedIn()` | Returns whether the current user is logged in to the Chat service. |

:::tip
Connection state and login state have different meanings. On a weak network or during a network switch, the user might remain logged in while the persistent connection is temporarily interrupted and automatically reconnected by the SDK. Handle state changes in the business UI using listener callbacks instead of relying only on a one-time state query.
:::

## Monitor connection changes

Register `EMConnectionListener` through `EMClient#addConnectionListener`. We recommend registering it before calling `loginWithToken` to avoid missing the login connection process and subsequent synchronization states.

### Callback descriptions

| Callback | Trigger conditions | Description |
| :--- | :--- | :--- |
| `onConnected()` | Triggered when the SDK successfully connects to the server. | It can be triggered after either the initial login connection or automatic reconnection succeeds. |
| `onDisconnected(int)` | Triggered when the SDK disconnects from the server. | `errorCode` indicates the cause. Disconnection does not necessarily mean that the SDK has logged out. The SDK automatically reconnects in recoverable scenarios. |
| `onDatabaseOpened(String)` | Triggered when the specified user's local database is opened successfully. | Indicates that local database APIs are available. It does not indicate successful online login and cannot replace `onConnected`. |
| `onLogout(int, EMLoginExtensionInfo)` | Triggered when the SDK logs out because of an account, device, or service restriction. | Handle abnormal logout using the error code and login extension information. |
| `onTokenWillExpire()` | Triggered when the token is about to expire. | We recommend obtaining a new token and calling `renewToken` to renew it. |
| `onTokenExpired()` | Triggered when the token has expired. | The SDK logs out. Obtain a new token and log in again. |
| `onOfflineMessageSyncStart()` | Triggered when the SDK starts synchronizing offline messages from the server. | It might not be triggered if there are no offline messages. |
| `onOfflineMessageSyncFinish()` | Triggered when the SDK finishes synchronizing offline messages. | It might not be triggered if the connection is interrupted during synchronization. |
| `onDataSyncStart(EMDataSyncType)` | Triggered when automatic synchronization of a type of business data starts after login. | `type` indicates data such as conversations, friends, or joined chat groups. |
| `onDataSyncFinish(EMDataSyncType, int)` | Triggered when synchronization of a type of business data finishes. | `errorCode == EMError.EM_NO_ERROR` indicates successful synchronization. |

### Sample code

```java
EMConnectionListener connectionListener =
        new EMConnectionListener() {
            @Override
            public void onConnected() {
                // Connection succeeded.
            }

            @Override
            public void onDisconnected(int errorCode) {
                // The connection is interrupted. The SDK automatically reconnects after recoverable network issues.
            }

            @Override
            public void onDatabaseOpened(String username) {
                // The local database for username has been opened.
            }

            @Override
            public void onLogout(
                    int errorCode,
                    EMLoginExtensionInfo info) {
                // The SDK has logged out. Handle the logout based on errorCode and info.
            }

            @Override
            public void onTokenWillExpire() {
                // Obtain a new token from the app server, and then call renewToken.
            }

            @Override
            public void onTokenExpired() {
                // The token has expired. Obtain a new token and log in again.
            }

            @Override
            public void onOfflineMessageSyncStart() {
                // Offline message synchronization starts.
            }

            @Override
            public void onOfflineMessageSyncFinish() {
                // Offline message synchronization is complete.
            }

            @Override
            public void onDataSyncStart(
                    EMOptions.EMDataSyncType type) {
                // Automatic synchronization of the data corresponding to type starts.
            }

            @Override
            public void onDataSyncFinish(
                    EMOptions.EMDataSyncType type,
                    int errorCode) {
                if (errorCode == EMError.EM_NO_ERROR) {
                    // The data corresponding to type is synchronized successfully.
                }
            }
        };

EMClient.getInstance().addConnectionListener(connectionListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance().removeConnectionListener(connectionListener);
```

:::tip
The connection callbacks of `EMConnectionListener` run on a worker thread. Do not directly update the UI or perform time-consuming operations in a callback. Switch to the main thread to update the UI.
:::

## Connection recovery and exception handling

### Automatic reconnection

After login succeeds, if the connection is interrupted by a weak network signal, network switching, or another recoverable cause, the SDK automatically attempts to reconnect. The app does not need to call the login API manually.

`onDisconnected` is triggered when the connection is interrupted, and `onConnected` is triggered after reconnection succeeds. Android SDK V5 does not provide separate `onConnecting` or `onReconnectFailed` callbacks. Display the connection state using these two callbacks together with `isConnected()` and the network state.

The following situations cannot be recovered through automatic reconnection alone. Handle account, token, device, or service restrictions based on the callback error code:

- The user explicitly calls `logout`.
- The token is invalid or expired.
- The account is deleted, logged in on another device, or forcibly logged out.
- The limit on logged-in devices, app active users, or service quotas is reached.

### Handle disconnection and abnormal logout

`onDisconnected` indicates that the connection has been interrupted, but it does not necessarily mean that the user has logged out. `onLogout` indicates that the underlying SDK has logged out for an unrecoverable reason. Common errors are as follows:

| Scenario | Error code | Recommendation |
| :--- | :--- | :--- |
| Invalid token | `EMError.INVALID_TOKEN` (104) | Obtain the correct token and log in again. |
| Expired token | `EMError.TOKEN_EXPIRED` (108) | Obtain a new token and log in again. |
| User authentication failure | `EMError.USER_AUTHENTICATION_FAILED` (202) | Check the user ID and token, and then log in again. |
| User logged in on another device | `EMError.USER_LOGIN_ANOTHER_DEVICE` (206) | Notify the user and determine whether to log in again according to your business policy. |
| User account deleted from the server | `EMError.USER_REMOVED` (207) | Handle the account state first. Do not immediately retry login. |
| User bound to another device | `EMError.USER_BIND_ANOTHER_DEVICE` (213) | Handle the device binding policy, and then log in again. |
| Logged-in device limit exceeded | `EMError.USER_LOGIN_TOO_MANY_DEVICES` (214) | Resolve the device limit first. |
| User logged out after changing the password | `EMError.USER_KICKED_BY_CHANGE_PASSWORD` (216) | Obtain a new token and log in. |
| User forcibly logged out by another device, API, or the console | `EMError.USER_KICKED_BY_OTHER_DEVICE` (217) | Notify the user and log in again according to your business policy. |
| Login device changed | `EMError.USER_DEVICE_CHANGED` (220) | Handle the device policy, and then log in again. |
| DAU or MAU limit reached | `EMError.APP_ACTIVE_NUMBER_REACH_LIMITATION` (8) | Check the app quota or contact the Easemob business team. |
| Service restricted | `EMError.SERVER_SERVICE_RESTRICTED` (305) | Check service activation and quota status. |

When the `onLogout` error code is `USER_LOGIN_ANOTHER_DEVICE`, `EMLoginExtensionInfo` provides extension information and the name of the new device that logged out the current device. Your app can use this information to display a more specific notification.

### Token lifecycle

The SDK triggers the following callbacks according to the validity period of the login token:

- `onTokenWillExpire`: The token is about to expire. The SDK generally triggers this callback after approximately 80% of the token's validity period has elapsed.
- `onTokenExpired`: The token has expired, and the SDK logs out.

After receiving `onTokenWillExpire`, obtain a new token from the app server and call `renewToken(String, EMCallBack)`:

```java
EMClient.getInstance().renewToken(
        newToken,
        new EMCallBack() {
            @Override
            public void onSuccess() {
                // The token is renewed successfully.
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
                // Token renewal failed.
            }
        });
```

`renewToken` requires the SDK to be initialized, the current user to be logged in, and the new token not to be empty. If `onTokenExpired` has already been triggered, obtain a new token and call `loginWithToken` again instead of continuing to rely on automatic reconnection.

### Offline message and business data synchronization

After login succeeds or the connection is restored, the SDK automatically synchronizes any offline messages stored on the server. Monitor synchronization through `onOfflineMessageSyncStart` and `onOfflineMessageSyncFinish`.

Monitor the automatic synchronization state after login for conversations, friends, joined chat groups, and other data through `onDataSyncStart` and `onDataSyncFinish`. The two types of synchronization callback have different meanings and must not be used interchangeably.

## Best practices

- Register `EMConnectionListener` before calling `loginWithToken` to avoid missing connection, token, and synchronization state callbacks.
- Do not immediately call the login API again after a weak-network disconnection. The SDK automatically reconnects in recoverable scenarios.
- Use `isConnected()` to query the current connection state and `isLoggedIn()` to query the login state. Prefer listener callbacks to drive UI updates.
- Renew the token promptly after receiving `onTokenWillExpire`. Log in again after receiving `onTokenExpired`.
- Use `onLogout` to handle unrecoverable abnormal logouts caused by account, device, or service restrictions, and display a specific notification based on the error code.
- Call `removeConnectionListener` when monitoring is no longer needed to avoid duplicate callbacks and memory leaks.
- Do not update the UI or perform time-consuming operations directly on the worker thread used by connection callbacks.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`init`](#connection-lifecycle) | `EMClient` | Initializes the Android SDK. |
| [`loginWithToken`](#connection-lifecycle) | `EMClient` | Logs in with a user ID and token and establishes a connection. |
| [`logout`](#connection-lifecycle) | `EMClient` | Explicitly logs out and closes the current connection. |
| [`isConnected`](#retrieve-the-connection-state) | `EMClient` | Queries whether the SDK is currently connected to the server. |
| [`isLoggedIn`](#retrieve-the-connection-state) | `EMClient` | Queries whether the current user is logged in to the Chat service. |
| [`renewToken`](#token-lifecycle) | `EMClient` | Updates the token for the currently logged-in user. |
