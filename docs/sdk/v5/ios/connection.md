# Connection

## Feature overview

The app client can use message sending and receiving and other EasyIM SDK features that require server access only after it successfully connects to the EasyIM server.

After `login` is called, the SDK establishes and maintains a persistent connection. While the connection is active, the SDK uses `EMClientDelegate` to notify the app of changes in connection state, abnormal logout, the Token lifecycle, local database opening, offline message synchronization, and post-login business data synchronization.

For details about login, logout, and login state, see [Login](login.html).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. For details, see [Initialization](initialization.html).
- Obtain a valid EasyIM user ID and user Token from your app server.
- Understand the EasyIM API limitations. For details, see [Limitations](/product/limitation.html).

## Connection lifecycle

The iOS SDK connection lifecycle generally includes the following stages:

1. Call `initializeSDK(with:)` to initialize the SDK.
2. Register `EMClientDelegate` through `add(_:delegateQueue:)`. We recommend completing registration before login.
3. Call `login(withUsername:token:completion:)` to explicitly log in and establish a persistent connection.
4. `onDatabaseOpened(_:username:)` is triggered after the user's local database opening process ends. This callback indicates only that the database opening process has ended, not that a connection to the server has been established. Check its `error` parameter.
5. After the SDK successfully connects to the server, `connectionStateDidChange(_:)` is triggered with `.connected`. The SDK then synchronizes offline messages and synchronizes business data according to the initialization configuration.
6. After the connection is interrupted, the SDK automatically reconnects based on the reason for disconnection, or notifies the app through the corresponding abnormal account callback to handle an unrecoverable logout.
7. Call `logout(_:completion:)` to actively log out and close the current connection.

```swift
final class ConnectionListener: NSObject, EMClientDelegate {
    func connectionStateDidChange(_ connectionState: EMConnectionState) {
        switch connectionState {
        case .connected:
            // The SDK is connected to the server.
            break
        case .disconnected:
            // The SDK is disconnected from the server. The SDK automatically reconnects after recoverable network issues.
            break
        @unknown default:
            break
        }
    }
}

let connectionListener = ConnectionListener()
EMClient.shared().add(connectionListener, delegateQueue: nil)

EMClient.shared().login(
    withUsername: "userId",
    token: "token"
) { username, error in
    if let error {
        print("Login failed: \(error.errorDescription)")
    } else {
        print("Login succeeded: \(username)")
    }
}
```

## Retrieve the connection state

Use `EMClient.isConnected` to query whether the SDK is currently connected to the server:

```swift
let connected = EMClient.shared().isConnected
```

Use `EMClient.isLoggedIn` to query whether the current user is logged in:

```swift
let loggedIn = EMClient.shared().isLoggedIn
```

| API | Description |
| :--- | :--- |
| `isConnected` | Whether the SDK is currently connected to the chat server. |
| `isLoggedIn` | Whether the current user is logged in to the chat server. |

:::tip
Connection state and login state have different meanings. On a weak network or when switching networks, the user might remain logged in while the persistent connection is temporarily disconnected and the SDK automatically reconnects. The business UI should process state changes based on delegate callbacks instead of relying only on a single property query.
:::

## Monitor connection changes

Register `EMClientDelegate` through `EMClient.add(_:delegateQueue:)`. We recommend registering it before calling the login API to avoid missing login connection establishment and subsequent synchronization states.

When `nil` is passed to `delegateQueue`, the current iOS SDK implementation dispatches delegate callbacks to the main queue. If you pass a custom queue, callbacks run on the specified queue.

### Callback descriptions

| Swift callback | Trigger condition | Description |
| :--- | :--- | :--- |
| `connectionStateDidChange(_:)` | Triggered when the connection state between the SDK and server changes. | The parameter is `.connected` or `.disconnected`. It can be triggered when the first login connection succeeds, the connection is disconnected, and automatic reconnection succeeds. |
| `onDatabaseOpened(_:username:)` | Triggered when the local database opening process after login ends. | `error == nil` indicates that the database was opened successfully. It is also triggered when opening fails, times out, or ends because of a disconnection. This callback cannot replace the successful connection callback. |
| `userAccountDidLoginFromOtherDevice(with:)` | Triggered when the current account logs in on another device or a device change occurs. | `EMLoginExtensionInfo?` can contain the newly logged-in device's name and extension information. The current implementation subsequently clears the local login information. |
| `userAccountDidRemoveFromServer()` | Triggered when the current account is deleted from the server. | The current implementation logs out and clears the local login information. |
| `userDidForbidByServer()` | Triggered when the current account or app service is disabled by the server. | The current implementation logs out and clears the local login information. |
| `userAccountDidForced(toLogout:)` | Triggered because of a password change, too many devices, forced logout by another device, authentication failure, or reaching the DAU/MAU limit. | The parameter is a nullable `EMError`. Handle the cause based on its `code`. The current implementation clears the local login information. |
| `tokenWillExpire(_:)` | Triggered when approximately 20% of the Token validity period remains. | Obtain a new Token from the app server and call the asynchronous `renewToken(_:completion:)`. |
| `tokenDidExpire(_:)` | Triggered when the Token has expired. | The current implementation logs out. Log in again after obtaining a new Token. |
| `onOfflineMessageSyncStart()` | Triggered when the SDK starts synchronizing offline messages from the server. | It might not be triggered if there are no offline messages. |
| `onOfflineMessageSyncFinish()` | Triggered when the SDK finishes synchronizing offline messages. | It might not be triggered if the connection is interrupted during synchronization. |
| `syncDataStart(with:)` | Triggered when automatic synchronization of a business data type starts after login. | `type` is `EMDataSyncType` and indicates conversations, friends, joined chat groups, or other data. |
| `syncDataFinished(_:type:)` | Triggered when synchronization of a business data type ends. | It is triggered when synchronization succeeds, fails, times out, or ends because of a disconnection. `error == nil` indicates that synchronization succeeded. |

### Sample code

```swift
final class ConnectionListener: NSObject, EMClientDelegate {
    func connectionStateDidChange(_ connectionState: EMConnectionState) {
        if connectionState == .connected {
            // The connection or automatic reconnection succeeded.
        } else {
            // The connection is disconnected. The SDK automatically reconnects after recoverable network issues.
        }
    }

    func onDatabaseOpened(_ error: EMError?, username: String) {
        if error == nil {
            // The local database corresponding to username has been opened.
        }
    }

    func userAccountDidLoginFromOtherDevice(
        with info: EMLoginExtensionInfo?
    ) {
        // The current account logged in on another device.
        print("Device name: \(info?.deviceName ?? "")")
        print("Extension information: \(info?.extensionInfo ?? "")")
    }

    func userAccountDidRemoveFromServer() {
        // The current account has been deleted from the server.
    }

    func userDidForbidByServer() {
        // The current account or app service has been disabled.
    }

    func userAccountDidForced(toLogout error: EMError?) {
        // The SDK forcibly logged out because of an unrecoverable cause.
        if let error {
            print("Forced logout: \(error.code), \(error.errorDescription)")
        }
    }

    func tokenWillExpire(_ errorCode: EMErrorCode) {
        // Obtain a new Token from the app server, and then call renewToken(_:completion:).
    }

    func tokenDidExpire(_ errorCode: EMErrorCode) {
        // The Token has expired. Log in again after obtaining a new Token.
    }

    func onOfflineMessageSyncStart() {
        // Started synchronizing offline messages.
    }

    func onOfflineMessageSyncFinish() {
        // Offline message synchronization is complete.
    }

    func syncDataStart(with type: EMDataSyncType) {
        // Automatic synchronization of the data corresponding to type has started.
    }

    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        if error == nil {
            // Synchronization of the data corresponding to type succeeded.
        }
    }
}

let connectionListener = ConnectionListener()
EMClient.shared().add(connectionListener, delegateQueue: nil)

// Remove the delegate when monitoring is no longer required.
EMClient.shared().removeDelegate(connectionListener)
```

:::tip
Retain the listener object until you call `removeDelegate(_:)`. If you pass a custom queue to `delegateQueue`, switch to the main thread before updating the UI, and do not perform large amounts of time-consuming work in callbacks.
:::

## Connection recovery and exception handling

### Automatic reconnection

After login succeeds, if the connection is interrupted because of a weak network signal, network switching, or another recoverable cause, the SDK automatically attempts to reconnect. The app does not need to repeatedly call the login API.

When the connection is disconnected, `connectionStateDidChange(_:)` returns `.disconnected`. After reconnection succeeds, it returns `.connected`. The iOS SDK exposes only two `EMConnectionState` values, connected and disconnected, and does not provide separate connecting or reconnection-failed states. The app should display the connection state based on this callback, `isConnected`, and the system network state.

The following conditions cannot be recovered through automatic reconnection alone. The app must handle account, Token, device, or service restrictions based on dedicated callbacks:

- The user actively calls `logout(_:completion:)`.
- The Token is invalid, authentication fails, or the Token has expired.
- The account is deleted or disabled, logs in on another device, or is forcibly logged out.
- The number of login devices, number of active app users, or service quota reaches the limit.

### Handle connection disconnection and abnormal logout

`.disconnected` indicates only that the persistent connection is currently disconnected and does not necessarily mean that the user has logged out. An abnormal account callback indicates that the underlying SDK encountered an unrecoverable cause and clears the login information according to the implementation. Common scenarios are as follows:

| Scenario | iOS error code | iOS callback or handling method |
| :--- | :--- | :--- |
| Invalid Token | `EMErrorInvalidToken` (104) | The login completion returns an error. Log in again after obtaining the correct Token. |
| Expired Token | `EMErrorTokenExpire` (108) | `tokenDidExpire(_:)`. Log in again after obtaining a new Token. |
| User authentication failure | `EMErrorUserAuthenticationFailed` (202) | `userAccountDidForced(toLogout:)`. Check the user ID and Token. |
| User logged in on another device | `EMErrorUserLoginOnAnotherDevice` (206) | `userAccountDidLoginFromOtherDevice(with:)`. |
| User account deleted from the server | `EMErrorUserRemoved` (207) | `userAccountDidRemoveFromServer()`. Handle the account state first. |
| User bound to another device | `EMErrorUserBindAnotherDevice` (213) | The login completion returns an error. Handle it according to the device binding policy. |
| Number of login devices exceeds the limit | `EMErrorUserLoginTooManyDevices` (214) | `userAccountDidForced(toLogout:)`. Handle the device count limit first. |
| User kicked offline after changing the password | `EMErrorUserKickedByChangePassword` (216) | `userAccountDidForced(toLogout:)`. Obtain a new Token and log in again. |
| User forcibly logged out by another device, an API, or the console | `EMErrorUserKickedByOtherDevice` (217) | `userAccountDidForced(toLogout:)`. Display a prompt and log in again according to your business policy. |
| Login device changed | `EMErrorUserDeviceChanged` (220) | `userAccountDidLoginFromOtherDevice(with:)`. Handle it according to the device policy. |
| DAU or MAU limit reached | `EMErrorAppActiveNumbersReachLimitation` (8) | `userAccountDidForced(toLogout:)`. Check the app quota or contact the Easemob business team. |
| Service disabled | `EMErrorServerServingForbidden` (305) | `userDidForbidByServer()`. Check feature activation and app status. |

When another device logs in or a device changes, `EMLoginExtensionInfo` can provide the `deviceName` and `extensionInfo` of the newly logged-in device. The app can use this information to display a clearer prompt.

### Token lifecycle

The SDK triggers the following callbacks based on the validity period of the login Token:

- `tokenWillExpire(_:)`: Triggered when approximately 20% of the Token validity period remains.
- `tokenDidExpire(_:)`: Triggered when the Token has expired. The current implementation logs out.

After receiving `tokenWillExpire(_:)`, obtain a new Token from the app server and call the asynchronous `renewToken(_:completion:)`:

```swift
EMClient.shared().renewToken("newToken") { error in
    if let error {
        print("Failed to renew the Token: \(error.errorDescription)")
    } else {
        print("Token renewed successfully")
    }
}
```

If `tokenDidExpire(_:)` has already been triggered, obtain a new Token and call `login(withUsername:token:completion:)` again. Do not continue relying on automatic reconnection.

### Offline message and business data synchronization

After login succeeds or the connection recovers, the SDK automatically synchronizes any offline messages on the server. Use `onOfflineMessageSyncStart()` and `onOfflineMessageSyncFinish()` to monitor offline message synchronization.

Use `syncDataStart(with:)` and `syncDataFinished(_:type:)` to monitor the post-login automatic synchronization state of conversations, friends, joined chat groups, and other data. The business data synchronization types are determined by `EMOptions.dataSyncType`, which is set before initialization. The two types of synchronization callbacks have different meanings and must not be used interchangeably.

## Best practices

- Register `EMClientDelegate` before calling the Token-based login API to avoid missing connection, Token, and synchronization state callbacks.
- The iOS SDK no longer relies on automatic login. The app should explicitly log in when it starts or needs to establish an EasyIM session.
- Do not immediately call the login API repeatedly after a weak-network disconnection. The SDK automatically reconnects in recoverable scenarios.
- Use `isConnected` to query the current connection state and `isLoggedIn` to query the login state, and preferentially drive UI updates through delegate callbacks.
- Renew the Token as soon as possible after receiving `tokenWillExpire(_:)`. After receiving `tokenDidExpire(_:)`, obtain a new Token and log in again.
- Use abnormal account callbacks to handle device, account, and service restrictions, and provide a clear prompt based on `EMError.code`.
- Call `removeDelegate(_:)` when monitoring is no longer required to avoid duplicate callbacks.
- When using a custom callback queue, do not update the UI directly or perform time-consuming operations.

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`initializeSDKWithOptions`](#connection-lifecycle) | `EMClient` | Initializes the iOS SDK. The Swift call is `initializeSDK(with:)`. |
| [`loginWithUsername`](#connection-lifecycle) | `EMClient` | Explicitly logs in using a user ID and Token and establishes a connection. |
| [`logout`](#connection-lifecycle) | `EMClient` | Actively logs out and closes the current connection. |
| [`isConnected`](#retrieve-the-connection-state) | `EMClient` | Queries whether the SDK is currently connected to the server. |
| [`isLoggedIn`](#retrieve-the-connection-state) | `EMClient` | Queries whether the current user is logged in to the chat server. |
| [`renewToken`](#token-lifecycle) | `EMClient` | Asynchronously updates the Token of the currently logged-in user. |
