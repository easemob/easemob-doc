# Login

After initializing iOS SDK V5, the app must log in with a user ID and user token. EasyIM features that require server access can be called only after login succeeds and the client connects to the EasyIM server.

## User registration

Before logging in to the SDK, you must first create an IM user. Before creating a user, set the user registration mode on the **Chat > Features > User & Login** page in [EasyIM Console](https://console.easyim.ai/user/login).

The following user registration modes are available:

- **Authorized Registration**: Register users through the REST APIs provided by EasyIM. An app token is required. This mode is suitable for production environments. After a user is successfully registered, you can save the user account to your App Server or return it to the client.
- **Open Registration**: Register users directly through the REST API without passing a token. This mode is generally used for demos and test environments and is not recommended for production environments.

After setting the registration mode, you can create users in either of the following ways:

1. **Create users by calling the REST API**

   - Authorized registration: Call the [Register a Single User Through Authorized Registration](/rest/account_register_authorized_single.html) or [Register Users in a Batch Through Authorized Registration](/rest/account_register_authorized_batch.html) API.
   - Open registration: After enabling open registration, call the [Register a User Through the REST API Using Open Registration](/rest/account_register_open.html) API.

2. **Create users in EasyIM Console**

   You can create users in a production or test environment in [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Create a user](/product/console/operation_user.html#create-a-user).

## Login

The SDK logs in with a user ID and EasyIM token. When calling `loginWithUsername`, pass the user ID and token. After login succeeds, the SDK establishes a persistent connection to the messaging service.

In a test environment, after you create users in the [EasyIM Console](https://console.easyim.ai/user/login), the EasyIM server automatically assigns user tokens to them. See [Create Users](/product/console/operation_user.html#create-a-user).

In a production environment, we recommend integrating the [Get App Token API](/rest/easemob_app_token.html) and [Get User Token API](/rest/easemob_user_token.html) into your app server. The client retrieves a user token from your app server and then logs in to the SDK.

```objectivec
[[EMClient sharedClient] loginWithUsername:userId
                                     token:token
                                completion:^(NSString *username, EMError *error) {
    if (!error) {
        // Logged in successfully.
    } else {
        // Failed to log in. Handle the failure based on error.code and error.errorDescription.
    }
}];
```

:::tip
The app can use `isLoggedIn` and `isConnected` to determine the login state and server connection state, respectively, but it cannot rely on the SDK to initiate login automatically. Each time the app starts or requires an EasyIM session, the business layer must save the credentials and explicitly call `loginWithUsername`.
:::

## Use the local database before login is complete

iOS SDK V5 supports opening the current user's local database before online login is complete. After the app initializes the SDK and registers `EMClientDelegate`, call `loginWithUsername`. The SDK opens the local database during login and triggers `onDatabaseOpened` after the database is opened.

After receiving this callback, the app can use cached data in the open local database to render the page before online login is complete. To call an API that requires server access, wait until the login completion callback succeeds and use `connectionStateDidChange` to confirm that the client is connected. Opening the database does not mean that conversation, friend, or group data has been synchronized. If `EMOptions#dataSyncType` is configured, refresh the corresponding local data after `syncDataFinished` succeeds.

Register `EMClientDelegate` before initiating login, and process the database and connection states in the callbacks:

```objectivec
@interface LoginViewController () <EMClientDelegate>
@end

@implementation LoginViewController

- (void)startLoginWithUserId:(NSString *)userId token:(NSString *)token {
    [[EMClient sharedClient] addDelegate:self delegateQueue:nil];

    [[EMClient sharedClient] loginWithUsername:userId
                                         token:token
                                    completion:^(NSString *username, EMError *error) {
        if (!error) {
            // Online login succeeded. Use the connectionStateDidChange: callback as the source of truth for the connection state.
        } else {
            // Failed to log in.
        }
    }];
}

- (void)onDatabaseOpened:(EMError *)error username:(NSString *)username {
    if (!error) {
        // The local database for username is open.
        // You can use locally cached data here to refresh the fallback UI.
    }
}

- (void)connectionStateDidChange:(EMConnectionState)aConnectionState {
    if (aConnectionState == EMConnectionConnected) {
        // The client is connected to the EasyIM server and can call APIs that require network access.
    } else {
        // The client is disconnected from the EasyIM server.
    }
}

- (void)syncDataFinished:(EMError *)error type:(EMDataSyncType)type {
    if (!error && (type & EMDataSyncTypeConversations) == EMDataSyncTypeConversations) {
        // Refresh the local conversation list after conversation data synchronization is complete.
    }
}

@end
```

Remove the delegate when it is no longer needed:

```objectivec
[[EMClient sharedClient] removeDelegate:self];
```

:::tip
`onDatabaseOpened` indicates only that the specified user's local database is open. It does not indicate that online login succeeded and cannot replace `connectionStateDidChange`. You can use local data after the database is open. Before calling an API that requires server access, wait until login succeeds and the connection is established. After data synchronization is complete, refresh local data by synchronization type in `syncDataFinished`.
:::

## Token renewal

After token-based login, the SDK notifies the app of the token state through `tokenWillExpire` and `tokenDidExpire`:

 - `tokenWillExpire`: Triggered when the token is about to expire. The app must retrieve a new token from the business server and call `renewToken` to update it.
 - `tokenDidExpire`: Triggered when the token has expired. The app must retrieve a new token. If the current login state is no longer valid, call `loginWithUsername` again to log in.

After receiving `tokenWillExpire`, the app must asynchronously retrieve a new EasyIM token from its business server and call `renewToken` to update it. A `nil` `error` in the completion callback indicates that the update succeeded. A non-`nil` value indicates that the update failed, which you can handle based on the error code and error information.

```objectivec
- (void)tokenWillExpire:(EMErrorCode)aErrorCode {
    // requestNewTokenFromAppServerWithCompletion: only represents asynchronously retrieving a token from the app server and is not an SDK API.
    [self requestNewTokenFromAppServerWithCompletion:^(NSString *newToken) {
        [[EMClient sharedClient] renewToken:newToken completion:^(EMError *error) {
            if (!error) {
                // The token was updated successfully.
            } else {
                // Failed to update the token.
            }
        }];
    }];
}

- (void)tokenDidExpire:(EMErrorCode)aErrorCode {
    // The token has expired. After retrieving a new token, call the asynchronous login API again if required.
}
```

## Retrieve the currently logged-in user

Call `currentUsername` to retrieve the user ID of the currently logged-in user:

```objectivec
NSString *currentUser = [EMClient sharedClient].currentUsername;
```

## Retrieve the login state

Call `isLoggedIn` to determine whether the current user is logged in, and call `isConnected` to determine whether the SDK is connected to the EasyIM server. The login state and connection state have different meanings. For example, when the network is disconnected, the user might remain logged in but not currently be connected to the server.

```objectivec
BOOL loggedIn = [EMClient sharedClient].isLoggedIn;
BOOL connected = [EMClient sharedClient].isConnected;
```

## Logout

Call `logout` to log out of the current account. `aIsUnbindDeviceToken` indicates whether to unbind the device push token during logout:

 - `YES`: Unbind the device push token.
 - `NO`: Do not unbind the device push token.

Retrieve the asynchronous logout result through the completion callback:

```objectivec
[[EMClient sharedClient] logout:YES completion:^(EMError *error) {
    if (!error) {
        // Logged out successfully.
    } else {
        // Failed to log out.
    }
}];
```

:::tip
1. If the app integrates push services such as APNs or PushKit, we recommend setting the `aIsUnbindDeviceToken` parameter of `logout` to `YES` during logout so that the SDK also unbinds the current device's push token. Otherwise, the device might continue receiving offline push notifications for the current account after logout.

If the push token cannot be unbound because of a network exception, the completion callback returns an error. The app can inform the user that unbinding failed and that push notifications might still be received after continuing to log out. If the user confirms that they want to continue, set the parameter to `NO` and call `logout` again to log out of only the EasyIM account without unbinding the push token. After the network recovers, handle the remaining push token unbinding at an appropriate time. Infinite retries on a background thread are not recommended.

2. When calling the asynchronous `logout` method, wait until the completion callback returns a `nil` error before logging in to another account or performing an operation that depends on logout being complete. If an error is returned, logout or push token unbinding failed. The app must handle the error based on the error code and business scenario.
:::

## Switch accounts

To switch from the current account to another account, call `logout` first. After logout succeeds, call `loginWithUsername` with the new account's user ID and token. Do not initiate login for another account before the current account has logged out.

```objectivec
[[EMClient sharedClient] logout:NO completion:^(EMError *error) {
    if (!error) {
        [[EMClient sharedClient] loginWithUsername:nextUserId
                                             token:nextToken
                                        completion:^(NSString *username, EMError *loginError) {
            // Process the account switching result based on loginError.
        }];
    }
}];
```

## Multi-device login

The iOS SDK supports logging in to the same account on multiple devices. The number of devices, device kicking policy, and data synchronization rules for multi-device login are determined by server-side configurations. If the number of logged-in devices exceeds the limit, a newly logged-in device might kick an already logged-in device offline. See [Multi-device Login](multi_device.html).

**Configure login device information**

The iOS SDK can configure information about the current login device through the following `EMOptions` properties. Set these properties before initializing the SDK:

| API | Parameter type | Description |
| :--- | :--- | :--- |
| `customOSType` | `NSInteger` | Set the custom system type of the login device. |
| `customDeviceName` | `NSString *` | Set a custom name for the current device to distinguish it in multi-device login scenarios. |
| `loginExtensionInfo` | `NSString *` | Set extension information carried during login. JSON strings are supported, and the current maximum length is 1024 characters. |

Example code:

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];

// Set the following properties before initializing the SDK.
options.customOSType = 10;
options.customDeviceName = @"ios-custom-device";
options.loginExtensionInfo = @"login from iOS";

// Initialize the SDK with options, and then log in through the asynchronous token login API.
[[EMClient sharedClient] loginWithUsername:userId
                                     token:token
                                completion:^(NSString *username, EMError *error) {
    // Process the login result based on error.
}];
```

**Device kicking**

When another device logs in to the same account, the SDK triggers `userAccountDidLoginFromOtherDeviceWithInfo`. The app can use `deviceName` and `extensionInfo` to retrieve the name and extension information of the newly logged-in device.

When the current account is forcibly logged out by the server, the SDK triggers `userAccountDidForcedToLogout`. The app must use `code` to determine the reason for logout and inform the user or guide the user to log in again as required by the business.

```objectivec
- (void)userAccountDidLoginFromOtherDeviceWithInfo:(EMLoginExtensionInfo *)info {
    NSString *deviceName = info.deviceName;
    NSString *extensionInfo = info.extensionInfo;
    // The current account logged in on another device. Process the current device state according to your business policy.
}

- (void)userAccountDidForcedToLogout:(EMError *)error {
    // The current account was forcibly logged out. Handle excessive device count, account disabling, forced logout, and similar scenarios based on error.code.
}
```

Common multi-device-related error codes are as follows:

| Scenario | iOS SDK error code | Description |
| :--- | :--- | :--- |
| The user logs in on another device and kicks the current device offline. | `206` / `EMErrorUserLoginOnAnotherDevice` | Use `userAccountDidLoginFromOtherDeviceWithInfo` to inform the user that the account logged in on another device and read the new device name and extension information. |
| The current account is bound to another device. | `213` / `EMErrorUserBindAnotherDevice` | Guide the user according to the device binding policy. |
| The number of logged-in devices exceeds the limit. | `214` / `EMErrorUserLoginTooManyDevices` | Handle the device count limit first. Repeated login attempts are not recommended. |
| The user is kicked offline because the password was changed. | `216` / `EMErrorUserKickedByChangePassword` | Retrieve a valid token and log in again. |
| The user is forcibly logged out on another device, in the EasyIM Console, or through a server-side API. | `217` / `EMErrorUserKickedByOtherDevice` | Inform the user that the current account was forcibly logged out. |
| The login device changes. | `220` / `EMErrorUserDeviceChanged` | Inform the user based on the business scenario and log in again. |

**Retrieve login information for other devices**

Call `getLoggedInDevicesFromServerWithUserId` to retrieve information about the devices on which a specified user is currently logged in from the server. This is an asynchronous API. Before calling it, ensure that you have a valid user ID and token.

```objectivec
[[EMClient sharedClient] getLoggedInDevicesFromServerWithUserId:userId
                                                          token:token
                                                     completion:^(NSArray<EMDeviceConfig *> *devices, EMError *error) {
    if (!error) {
        for (EMDeviceConfig *device in devices) {
            NSString *resource = device.resource;
            NSString *deviceUUID = device.deviceUUID;
            NSString *deviceName = device.deviceName;
            // Use resource, deviceUUID, and deviceName to display or manage the login device.
        }
    } else {
        // Failed to retrieve the device information.
    }
}];
```

The completion callback of this API returns `NSArray<EMDeviceConfig *> *`. Each `EMDeviceConfig` in the array corresponds to a logged-in device and contains the following information:

| Field | Type | Description |
| :--- | :--- | :--- |
| `resource` | `NSString *` | The resource identifier of the login device. |
| `deviceUUID` | `NSString *` | The UUID of the login device. |
| `deviceName` | `NSString *` | The name of the login device. |

For example, if the `resource` returned by the API is `ios_xxx`, the value represents the resource identifier of the corresponding iOS login device. The app must display or manage this field together with `deviceUUID` and `deviceName` and must not rely on a fixed string format for the resource identifier.

## More information

### Prompt when logging in to a banned account

If the EasyIM app service is disabled, the completion callback returns error code `EMErrorServerServingForbidden` (305) when `loginWithUsername` is called. The app must use this error code to indicate that the app service is disabled or perform the corresponding processing. Do not rely on error text such as `"service is disabled"` for this determination.

If the currently logged-in user account is disabled by the server, the SDK triggers `userDidForbidByServer`. In this callback, the app must inform the user and stop using EasyIM features that require the logged-in state.

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`loginWithUsername`](#login) | `EMClient` | Asynchronously log in with a user ID and token. |
| [`renewToken`](#token-renewal) | `EMClient` | Asynchronously update the token used for the current login. |
| [`currentUsername`](#retrieve-the-currently-logged-in-user) | `EMClient` | Retrieve the user ID of the currently logged-in user. |
| [`isLoggedIn`](#retrieve-the-login-state) | `EMClient` | Determine whether the current user is logged in. |
| [`isConnected`](#retrieve-the-login-state) | `EMClient` | Determine whether the SDK is connected to the EasyIM server. |
| [`logout`](#logout) | `EMClient` | Asynchronously log out of the current account and determine whether to unbind the device push token based on the parameter. |
| [`customOSType`](#multi-device-login) | `EMOptions` | Set the custom system type of the login device. |
| [`customDeviceName`](#multi-device-login) | `EMOptions` | Set a custom name for the current device. |
| [`loginExtensionInfo`](#multi-device-login) | `EMOptions` | Set extension information carried during login. |
| [`getLoggedInDevicesFromServerWithUserId`](#multi-device-login) | `EMClient` | Asynchronously retrieve information about the devices on which a specified user is logged in. |
| [`resource`](#multi-device-login) / [`deviceName`](#multi-device-login) | `EMDeviceConfig` | Retrieve the resource identifier and name of a login device. |
