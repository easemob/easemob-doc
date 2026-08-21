# Login

After initializing the Android SDK, the app must log in with a user ID and user token. The app can call EasyIM features that require server access only after login succeeds and it connects to the EasyIM server.

## User registration

Before logging in to the SDK, create an EasyIM user. Before creating a user, set the user registration mode on the **Instant Messaging > Basic Features > Users** page in [EasyIM Console](https://console.easemob.com/user/login).

Two user registration modes are available:

- **Authorized registration**: Registers users through the REST APIs provided by Easemob. This mode applies to production environments. After registration succeeds, save the user account to your app server or return it to the client.
- **Open registration**: Allows clients or REST APIs to register users directly. This mode is generally used for Demo evaluation and testing and is not recommended for production.

After setting the registration mode, create users in either of the following ways:

1. **Call a REST API to create a user**

   - Authorized registration: Call [Register a Single User (Authorized)](/document/server-side/account_register_authorized_single.html) or [Batch Register Users (Authorized)](/document/server-side/account_register_authorized_batch.html).
   - Open registration: After enabling open registration, create users through the client or the [REST API for open registration](/document/server-side/account_register_open.html).

2. **Create a user in EasyIM Console**

   Create users for a production or test environment in [EasyIM Console](https://console.easemob.com/user/login). For details, see [Create Users](/product/console/operation_user.html#创建用户).

## Login

The SDK logs in with a user ID and EasyIM token. Pass `userId` and `token` when calling `loginWithToken`. After login succeeds, the SDK establishes a persistent connection to the messaging service.

In a test environment, after you create users in [EasyIM Console](https://console.easemob.com/user/login), the EasyIM server automatically assigns user tokens to them. For details, see [Create Users](/product/console/operation_user.html#创建用户).

In a production environment, we recommend integrating the [Get App Token API](/document/server-side/easemob_app_token.html) and [Get User Token API](/document/server-side/easemob_user_token.html) into your app server. The client then obtains a user token from your app server before logging in to the SDK.

```java
EMClient.getInstance().loginWithToken(userId, token, new EMCallBack() {
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

:::tip
The app can use `EMClient#isLoggedIn()` and `EMClient#isConnected()` to determine the login and server connection states, respectively, but it cannot rely on the SDK to initiate login automatically.
:::

## Use the local database before login is complete

The Android SDK supports using the local database before online login is complete. After the app initializes the SDK and registers `EMConnectionListener`, call `EMClient#loginWithToken`. During login, the SDK automatically opens the current user's local database and triggers `onDatabaseOpened(String username)` after it opens successfully. After receiving this callback, the app can read the user's locally cached data and display content such as the conversation list before online login is complete. To call APIs that require server access, wait until login succeeds and confirm through `onConnected` that the connection has been established.

Register `EMConnectionListener` before calling `loginWithToken`, and monitor successful database opening through `onDatabaseOpened(String username)`. `username` in the callback identifies the user whose database is open.

You can also call `EMClient#isDatabaseOpened()` to query whether a usable local database context currently exists.

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
        // The SDK has connected to the EasyIM server. APIs that require network access can now be called.
    }

    @Override
    public void onDisconnected(int errorCode) {
        // The SDK is disconnected from the EasyIM server. Handle the disconnection based on errorCode.
    }

    @Override
    public void onDatabaseOpened(String username) {
        // The local database for username has been opened.
        if (EMClient.getInstance().isDatabaseOpened()) {
            List<EMConversation> conversations = EMClient.getInstance()
                    .chatManager()
                    .getAllConversationsBySort();

            // Refresh the page with local conversation data.
        }
    }
};

// Register the listener before initiating login.
EMClient.getInstance().addConnectionListener(connectionListener);

EMClient.getInstance().loginWithToken(
        userId,
        token,
        new EMCallBack() {
            @Override
            public void onSuccess() {
                // Online login succeeded.
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
                // Online login failed. Handle the failure based on the error information.
            }
        });
```

Remove the listener when it is no longer needed:

```java
EMClient.getInstance().removeConnectionListener(connectionListener);
```

:::tip 
`onDatabaseOpened` indicates only that the specified user's local database has been opened. It does not indicate successful online login and cannot replace `onConnected`. Similarly, `isDatabaseOpened` does not indicate that the user is logged in or connected. Local data APIs are available after the database opens, but you must still wait for successful login and connection before calling APIs that require server access.
:::

## Token renewal

After token-based login, the SDK reports token state through `EMConnectionListener#onTokenWillExpire` and `EMConnectionListener#onTokenExpired`:

- `onTokenWillExpire`: Triggered when the token is about to expire. The app should obtain a new token from its business server and call `EMClient#renewToken` to update it.
- `onTokenExpired`: Triggered when the token has expired. The app should obtain a new token. If the current login state is invalid, call `loginWithToken` again.

After receiving `onTokenWillExpire`, the app should obtain a new EasyIM token from its business server and call `EMClient#renewToken(String, EMCallBack)` to update it. The result is returned through `EMCallBack`: `onSuccess()` indicates success, and `onError(int, String)` indicates failure, which can be handled based on the error code and message.

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
    }

    @Override
    public void onDisconnected(int errorCode) {
    }

    @Override
    public void onTokenWillExpire() {
        // getNewTokenFromAppServer represents the logic that asynchronously obtains a new token from the app server and then updates it. It is not an SDK API.
        String newToken = getNewTokenFromAppServer();
        EMClient.getInstance().renewToken(newToken, new EMCallBack() {
            @Override
            public void onSuccess() {
                // The token is updated successfully.
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
                // Token update failed.
            }
        });
    }

    @Override
    public void onTokenExpired() {
        // The token has expired. Obtain a new token and log in again.
    }
};

EMClient.getInstance().addConnectionListener(connectionListener);
```

## Retrieve the currently logged-in user

Call `EMClient#getCurrentUser` to retrieve the currently logged-in user's ID:

```java
String currentUser = EMClient.getInstance().getCurrentUser();
```

## Retrieve the login state

Call `EMClient#isLoggedIn` to determine whether the current user is logged in and `EMClient#isConnected` to determine whether the SDK is connected to the EasyIM server. Login and connection states have different meanings. For example, when the network is disconnected, the user might remain logged in but not currently connected to the server.

```java
boolean loggedIn = EMClient.getInstance().isLoggedIn();
boolean connected = EMClient.getInstance().isConnected();
```

## Logout

Call `EMClient#logout` to log out of the current account. `unbindToken` indicates whether to unbind the device push token during logout:

- `true`: Unbinds the device push token.
- `false`: Does not unbind the device push token.

Obtain the asynchronous logout result through `EMCallBack`:

```java
// Asynchronous method.
EMClient.getInstance().logout(true, new EMCallBack() {
    @Override
    public void onSuccess() {
        // Logout succeeded.
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
        // Logout failed.
    }
});
```

:::tip
1. If the app integrates third-party push such as FCM, we recommend setting `unbindToken` in `logout` to `true` so that the SDK also unbinds the current device's push token. Otherwise, the device might continue receiving offline push notifications for the current account after logout.

If push token unbinding fails because of a network exception, `logout` returns a failure. The app can inform the user that unbinding failed and that push notifications might still be received after continuing to log out. If the user confirms, set `unbindToken` to `false` and call `logout` again to log out only of the EasyIM account without unbinding the push token. After the network recovers, handle the remaining push token unbinding at an appropriate time. Do not retry indefinitely on a background thread.

2. When calling the asynchronous `logout(boolean, EMCallBack)`, wait for `onSuccess()` before calling `loginWithToken` for another account or performing an operation that depends on logout completion. `onError(int, String)` indicates that logout or push token unbinding failed. Handle it according to the error code and business scenario.
:::

## Switch accounts

To switch from the current account to another account, first call `logout`. After logout succeeds, call `loginWithToken` with the new account's user ID and token. Do not initiate login for another account before the current account has logged out.

## Multi-device login

The Android SDK allows the same account to log in on multiple devices. The number of devices, mutual-kick policy, and data synchronization rules for multi-device login are determined by server configuration. If the number of logged-in devices exceeds the limit, a newly logged-in device might log out an existing device. For details, see [Multi-Device Login](multi_device.html).

**Configure login device information**

Use the following `EMOptions` APIs to configure information about the current login device:

| API | Parameter type | Description |
| --------------------- | -------- | ------------------------------------------------------------ |
| `setCustomOSPlatform` | `int` | Sets the custom platform number of the login device. The range is 1–100. Call it before SDK initialization. |
| `setCustomDeviceName` | `String` | Sets the current device's custom name for distinguishing devices in multi-device login. Call it before SDK initialization. If it is not set, the device model is used by default. |
| `setLoginCustomExt` | `String` | Sets the current device's login extension information. The maximum length is 1024 characters, and it cannot be `null`. If set before SDK initialization, it takes effect for subsequent logins. If the SDK is already initialized, set it before the next call to `loginWithToken`. |

The following is sample code:

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");

// Set the following two options before SDK initialization.
options.setCustomOSPlatform(10);
options.setCustomDeviceName("android-custom-device");

// Login extension information can also be set before SDK initialization.
options.setLoginCustomExt("login from Android");

EMClient.getInstance().init(getApplicationContext(), options);

EMClient.getInstance().loginWithToken(
        userId,
        token,
        new EMCallBack() {
            @Override
            public void onSuccess() {
                // Login succeeded.
            }

            @Override
            public void onError(
                    int errorCode,
                    String errorMessage) {
                // Login failed.
            }
        });
```

If the SDK is already initialized, update the login extension information before the next login as follows:

```
EMClient.getInstance()
        .getOptions()
        .setLoginCustomExt("login from Android");

EMClient.getInstance().loginWithToken(userId, token, callback);
```

**Device mutual kicking**

When the multi-device login policy forcibly logs out the current device, the SDK triggers `EMConnectionListener#onLogout(int, EMLoginExtensionInfo)`. Determine the cause from `errorCode`, and notify the user or guide them to log in again as required by your business.

When `errorCode` is `EMError.USER_LOGIN_ANOTHER_DEVICE`, obtain information about the new device that logged out the current device through `EMLoginExtensionInfo`:

- `getDeviceInfo()`: Retrieves the custom name of the newly logged-in device. If it is not set, this is generally the device model.
- `getDeviceExt()`: Retrieves the extension information set on the newly logged-in device through `setLoginCustomExt`.

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
    }

    @Override
    public void onDisconnected(int errorCode) {
        // The SDK is disconnected from the EasyIM server.
    }

    @Override
    public void onLogout(
            int errorCode,
            EMLoginExtensionInfo info) {
        switch (errorCode) {
            case EMError.USER_LOGIN_ANOTHER_DEVICE:
                String deviceName =
                        info == null ? null : info.getDeviceInfo();
                String deviceExt =
                        info == null ? null : info.getDeviceExt();
                // The current account logged in on another device, and this device was logged out.
                break;

            case EMError.USER_KICKED_BY_CHANGE_PASSWORD:
                // Logged out because the password changed.
                break;

            case EMError.USER_KICKED_BY_OTHER_DEVICE:
                // Forcibly logged out from another device, EasyIM Console, or a server-side API.
                break;

            case EMError.USER_LOGIN_TOO_MANY_DEVICES:
                // The logged-in device limit was exceeded.
                break;

            case EMError.USER_BIND_ANOTHER_DEVICE:
                // The current account is bound to another device.
                break;

            case EMError.USER_DEVICE_CHANGED:
                // The login device changed.
                break;

            default:
                // Handle other error codes.
                break;
        }
    }
};

EMClient.getInstance()
        .addConnectionListener(connectionListener);
```

Common multi-device error codes are as follows:

| Scenario | Android SDK error code | Description |
| ------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------ |
| The user logs in on another device and logs out the current device | `206` / `USER_LOGIN_ANOTHER_DEVICE` | Notify the user that the account has logged in on another device and read the new device's name and extension information. |
| The current account is bound to another device | `213` / `USER_BIND_ANOTHER_DEVICE` | Guide the user according to the device binding policy. |
| The logged-in device limit is exceeded | `214` / `USER_LOGIN_TOO_MANY_DEVICES` | Resolve the device limit first. Repeated login attempts are not recommended. |
| The user is logged out because the password changed | `216` / `USER_KICKED_BY_CHANGE_PASSWORD` | Obtain a valid token and log in again. |
| The user is forcibly logged out from another device, EasyIM Console, or a server-side API | `217` / `USER_KICKED_BY_OTHER_DEVICE` | Notify the user that the current account was forcibly logged out. |
| The login device changes | `220` / `USER_DEVICE_CHANGED` | Notify the user and log in again according to the business scenario. |

**Retrieve login IDs on other devices**

Call `EMContactManager#asyncGetSelfIdsOnOtherPlatform` to retrieve the current account's login IDs on other devices from the server. The user must be logged in and connected to the EasyIM server before calling this API.

```java
EMClient.getInstance()
        .contactManager()
        .asyncGetSelfIdsOnOtherPlatform(
                new EMValueCallBack<List<String>>() {
                    @Override
                    public void onSuccess(List<String> loginIds) {
                        // loginIds contains the current account's login IDs on other devices.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Retrieval failed.
                    }
                });
```

A login ID has the format `userId/resource`:

- `userId`: User ID of the currently logged-in user.
- `resource`: Resource identifier of the login device.

For example, in the login ID `alice/android_xxx`, `alice` is the user ID and `android_xxx` is the resource identifier of the corresponding login device.

## More

### Notification when logging in to a banned account

If a user account has been disabled through EasyIM Console or a REST API, calling `EMClient#loginWithToken` triggers `EMCallBack#onError` and returns `EMError#SERVER_SERVICE_RESTRICTED` (305). This error code indicates that the EasyIM service or a feature of the current app is restricted. Handle it according to the service configuration and error information returned by the server. Do not rely on error text such as `"service is disabled"`.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`loginWithToken`](#login) | `EMClient` | Logs in with a user ID and token. |
| [`isDatabaseOpened`](#use-the-local-database-before-login-is-complete) | `EMClient` | Determines whether a usable local database context currently exists. |
| [`getAllConversationsBySort`](#use-the-local-database-before-login-is-complete) | `EMChatManager` | Retrieves the pinned-first local conversation list sorted by latest message time in descending order. |
| [`renewToken`](#token-renewal) | `EMClient` | Updates the token used for the current login. |
| [`getCurrentUser`](#retrieve-the-currently-logged-in-user) | `EMClient` | Retrieves the currently logged-in user's ID. |
| [`isLoggedIn`](#retrieve-the-login-state) | `EMClient` | Determines whether the current user is logged in. |
| [`isConnected`](#retrieve-the-login-state) | `EMClient` | Determines whether the SDK is connected to the EasyIM server. |
| [`logout`](#logout) | `EMClient` | Logs out of the current account and optionally unbinds the device push token. |
| [`setAppKey`](#multi-device-login) | `EMOptions` | Sets the App Key of the app. |
| [`setCustomOSPlatform`](#multi-device-login) | `EMOptions` | Sets the custom platform number of the login device. |
| [`setCustomDeviceName`](#multi-device-login) | `EMOptions` | Sets the current device's custom name. |
| [`setLoginCustomExt`](#multi-device-login) | `EMOptions` | Sets the current device's login extension information. |
| [`init`](#multi-device-login) | `EMClient` | Initializes the Android SDK with the specified configuration. |
| [`getOptions`](#multi-device-login) | `EMClient` | Retrieves the current SDK initialization configuration. |
| [`asyncGetSelfIdsOnOtherPlatform`](#multi-device-login) | `EMContactManager` | Asynchronously retrieves the current account's login IDs on other devices. |
| [`getSelfIdsOnOtherPlatform`](#multi-device-login) | `EMContactManager` | Synchronously retrieves the current account's login IDs on other devices. |
