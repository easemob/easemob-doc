# Multi-Device Login

## Feature overview

EasyIM supports logging in to the same account on multiple devices. Before using this feature, activate the multi-device login service in the [EasyIM Console](https://console.easyim.ai/user/login). See the [EasyIM Console documentation](/product/console/basic_user.html#multi-device-login).

During login, the iOS SDK synchronizes device-related information to the server. The server maintains the online device state of the current account according to the multi-device login policy. When the same account performs operations involving friends, groups, message threads, conversations, or one-way deletion of server-side historical messages on another device, the current device can receive the corresponding events through `EMMultiDevicesDelegate`, which is registered with `addMultiDevicesDelegate`.

In multi-device login scenarios, the iOS SDK supports the following features:

 - Receive multi-device events triggered by other devices of the current account.
 - Synchronize operations involving friends, groups, message threads, conversations, and one-way deletion of server-side historical messages.
 - Retrieve the login ID list of the current user's other logged-in devices.
 - Retrieve the list of online login devices for a specified account.
 - Set the name, platform, and extension information of a login device.
 - Kick a specified account offline from one or all devices.

For multi-device login, EasyIM supports up to 4 simultaneously online devices on each platform by default. To increase the number of supported devices, contact the EasyIM business manager. You can set the number of devices for each platform on the **EasyIM > Basic Features** > **Users** page in the EasyIM Console:

![img](/images/common/multidevice_device_count.png)

## Device kicking policy

The device kicking policies for single-device and multi-device login are described in the following table:

| Single-device/Multi-device login | Device kicking policy |
| :---: | :--- |
| **Single-device login** | The newly logged-in device kicks the currently online device offline. |
| **Multi-device login** | If the number of logged-in devices on a platform reaches the limit, the most recently logged-in device kicks the earliest logged-in device on that platform offline.<br><br>EasyIM supports device kicking only within the same platform, not between platforms. |

## Prerequisite

Before you begin, ensure that the following requirements are met:

 - Initialize and log in to the iOS SDK. See [Quickstart](quickstart.html).
 - Activate multi-device login in the [EasyIM Console](https://console.easyim.ai/user/login). See the [EasyIM Console documentation](/product/console/basic_user.html#multi-device-login).

## Retrieve the login ID list of the current user's other login devices

Call `getSelfIdsOnOtherPlatformWithCompletion` to asynchronously retrieve the login ID list of the current account on other platforms (Windows or Web), and then select a target login ID as the recipient to send a message to a specified device. The login ID can be used as the recipient of a one-to-one message in the same way as a friend's user ID.

This API applies to multi-device login scenarios and queries the login state of the current account on other devices. The current device is automatically excluded from the returned result. The result can generally be used to display a list of logged-in devices, identify abnormal logins, issue multi-device login reminders, or work with a server-side API to log out a specified device.

```objectivec
[[EMClient sharedClient].contactManager getSelfIdsOnOtherPlatformWithCompletion:^(NSArray<NSString *> *loginIds, EMError *error) {
    if (!error) {
        NSString *loginId = loginIds.firstObject;
        // loginId can be used as the recipient of a one-to-one message.
    } else {
        // Failed to retrieve the login IDs.
    }
}];
```

Each login ID uses the `userId/resource` format:

- `userId`: The current user's user ID.
- `resource`: The resource identifier corresponding to the logged-in device, used to distinguish a specific login device of the user.

The `resource`, the `resourceId` parameter of the server-side [log out a device API](/rest/account_offline_device_single.html), and the `res` field returned by the server-side [retrieve the online device list of a specified account API](/rest/account_online_device_obtain.html) are semantically equivalent and identify one of the user's login devices.

The iOS client API returns a complete `userId/resource` login ID, while the related server-side APIs generally require only the `resource` after `/`. Therefore, to call the server-side API for logging out a device, first extract `resource` from the login ID and then pass it as `resourceId`.

## Retrieve the online login device list of a specified account

Call `getLoggedInDevicesFromServerWithUserId` with a user ID and valid token to asynchronously retrieve the online login device list of a specified account from the server.

```objectivec
[[EMClient sharedClient] getLoggedInDevicesFromServerWithUserId:userId
                                                          token:token
                                                     completion:^(NSArray<EMDeviceConfig *> *devices, EMError *error) {
    if (!error) {
        for (EMDeviceConfig *device in devices) {
            NSString *resource = device.resource;
            NSString *deviceUUID = device.deviceUUID;
            NSString *deviceName = device.deviceName;
            // Use resource, deviceUUID, and deviceName to display or manage the device.
        }
    } else {
        // Failed to retrieve the device list.
    }
}];
```

The `EMDeviceConfig` returned by the API contains the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `resource` | `NSString *` | The resource identifier of the login device, used to specify the target device. |
| `deviceUUID` | `NSString *` | The UUID of the login device. |
| `deviceName` | `NSString *` | The login device name. If a custom name is not set, this value is generally the device model. |

## Set the login device name

EasyIM supports custom device names. In a multi-device scenario, if a device is kicked offline, the kicked device can identify which device caused it to be kicked offline.

When initializing the SDK, you can call `EMOptions#customDeviceName` to set a custom name for the current device. After the device name is set, if an already logged-in device is forcibly logged out because a new login reaches the login device count limit, the `userAccountDidLoginFromOtherDeviceWithInfo` callback received by the kicked device contains the custom name of the device that caused it to be kicked offline.

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.customDeviceName = @"Alice's iPad";

// Initialize the SDK with options, and then log in through the asynchronous token login API.
```

## Set the login device platform

Use `EMOptions#customOSType` to set a custom platform for the current device. For example, set phones and tablets as separate platforms so that users can precisely control the number of login devices on the same platform and device kicking behavior between platforms.

1. On the **Chat** > **Features** >**User & Login** page in the EasyIM Console, click **Settings** in the **Multi-device Login** area. In the dialog box that appears, click **Add Custom Platform**, and then set **Device Platform** and **Device Count** in the **Add Custom Platform** dialog box.

The value range of **Device Platform** is [1,100], and the value range of **Device Count** is [0,4].

![img](/images/common/multidevice_device_platform.png)

2. When initializing the SDK, call `initializeSDKWithOptions` and set the `EMOptions#customOSType` property to add a custom platform. Ensure that this property has the same value as **Device Platform** in the **Add Custom Platform** dialog box in the EasyIM Console.

:::tip
This setting is sent to the server only after login succeeds.
:::

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.customOSType = 60;

// Initialize the SDK with options, and then log in through the asynchronous token login API.
```

## Set login device extension information

EasyIM supports setting custom extension information for login devices. In multi-device login scenarios, this feature can carry additional identification information about the current login device to help the business identify and manage devices. For example, if a device is kicked offline, the kicked device can obtain the custom extension information of the newly logged-in device.

When initializing the SDK, set the device extension information through `EMOptions#loginExtensionInfo`. After it is set, if the current login device is kicked offline because the login device count limit is reached (`206`, `EMErrorUserLoginOnAnotherDevice`) in a multi-device scenario, the `EMLoginExtensionInfo` parameter of the `userAccountDidLoginFromOtherDeviceWithInfo` callback received by the kicked device contains the newly logged-in device's name in `deviceName` and extension information in `extensionInfo`.

:::tip
This setting is sent to the server only after login succeeds.
:::

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.loginExtensionInfo = @"{\"source\":\"iPad\"}";

// Initialize the SDK with options, and then log in through the asynchronous token login API.

- (void)userAccountDidLoginFromOtherDeviceWithInfo:(EMLoginExtensionInfo *)info {
    NSString *deviceName = info.deviceName;
    NSString *extensionInfo = info.extensionInfo;
    // Inform the current user based on the newly logged-in device information.
}
```

## Force a specified account offline from one device

Call `kickDeviceWithUserId` to kick a specified account offline from one device. First call `getLoggedInDevicesFromServerWithUserId` to retrieve the target device's `resource`, and then pass the resource identifier.

:::tip
You can use this API without logging in.
:::

```objectivec
[[EMClient sharedClient] getLoggedInDevicesFromServerWithUserId:userId
                                                          token:token
                                                     completion:^(NSArray<EMDeviceConfig *> *devices, EMError *error) {
    if (error || devices.count == 0) {
        return;
    }

    NSString *resource = devices.firstObject.resource;
    [[EMClient sharedClient] kickDeviceWithUserId:userId
                                             token:token
                                          resource:resource
                                        completion:^(EMError *kickError) {
        if (!kickError) {
            // The specified device was kicked offline successfully.
        } else {
            // Failed to kick the device offline.
        }
    }];
}];
```

## Force a specified account offline from all devices

Call `kickAllDevicesWithUserId` to kick a specified account offline from all devices.

:::tip
You can use this API without logging in.
:::

```objectivec
[[EMClient sharedClient] kickAllDevicesWithUserId:userId
                                             token:token
                                        completion:^(EMError *error) {
    if (!error) {
        // All devices were kicked offline successfully.
    } else {
        // Failed to kick the devices offline.
    }
}];
```

## Monitor multi-device events

For example, Account A is logged in on both Device A and Device B. When Account A performs an operation on Device A, Device B receives a notification corresponding to the operation.

Implement `EMMultiDevicesDelegate` and call `addMultiDevicesDelegate` to register the delegate. Call `removeMultiDevicesDelegate` to remove it when it is no longer needed.

:::tip
Multi-device events for chat room operations are not provided in multi-device scenarios. Chat rooms support only message sending and receiving synchronization.
:::

```objectivec
@interface MultiDeviceObserver () <EMMultiDevicesDelegate>
@end

@implementation MultiDeviceObserver

- (void)startObserveMultiDeviceEvents {
    [[EMClient sharedClient] addMultiDevicesDelegate:self delegateQueue:nil];
}

- (void)stopObserveMultiDeviceEvents {
    [[EMClient sharedClient] removeMultiDevicesDelegate:self];
}

- (void)multiDevicesContactEventDidReceive:(EMMultiDevicesEvent)event
                                  username:(NSString *)username
                                       ext:(NSString *)ext {
    // Handle EMMultiDevicesEventContactRemove, ContactAccept, ContactDecline, ContactBan, or ContactAllow.
}

- (void)multiDevicesGroupEventDidReceive:(EMMultiDevicesEvent)event
                                 groupId:(NSString *)groupId
                                     ext:(id)ext {
    // Handle events such as group creation, destruction, joining, leaving, invitation, and muting.
}

- (void)multiDevicesChatThreadEventDidReceive:(EMMultiDevicesEvent)event
                                      threadId:(NSString *)threadId
                                           ext:(id)ext {
    // Handle EMMultiDevicesEventChatThreadCreate, Destroy, Join, Leave, Update, or Kick.
}

- (void)multiDevicesConversationEvent:(EMMultiDevicesEvent)event
                        conversationId:(NSString *)conversationId
                      conversationType:(EMConversationType)conversationType {
    // Handle events such as pinning, unpinning, deleting, marking, muting, and clearing the unread count of conversations.
    // After receiving a conversation event, refresh local conversation data as required by your business.
}

- (void)multiDevicesMessageBeRemoved:(NSString *)conversationId deviceId:(NSString *)deviceId {
    // The current user deleted the server-side historical messages of a conversation one way on another device.
}

@end
```



Multi-device unread count clearing events use the following enum values:

 - `EMMultiDevicesEventConversationUnreadMessageCountCleared` (65): Another device cleared the unread count of the specified conversation.
 - `EMMultiDevicesEventAllConversationUnreadMessageCountCleared` (66): Another device cleared the unread counts of all conversations.

## Typical example

When the same account is logged in on a PC and mobile device, the mobile device can asynchronously retrieve the PC login ID and send a one-to-one message to that login ID:

```objectivec
[[EMClient sharedClient].contactManager getSelfIdsOnOtherPlatformWithCompletion:^(NSArray<NSString *> *loginIds, EMError *error) {
    if (error || loginIds.count == 0) {
        return;
    }

    NSString *to = loginIds.firstObject;
    EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"Hello World"];
    EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:to body:body ext:nil];
    message.chatType = EMChatTypeChat;

    [[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *sendError) {
        // Process the sending result based on sendError.
    }];
}];
```

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`getSelfIdsOnOtherPlatformWithCompletion`](#retrieve-the-login-id-list-of-the-current-users-other-login-devices) | `IEMContactManager` | Asynchronously retrieve the current user's login ID list on other platforms. |
| [`getLoggedInDevicesFromServerWithUserId`](#retrieve-the-online-login-device-list-of-a-specified-account) | `EMClient` | Asynchronously retrieve the online device list of a specified account with a user ID and token. |
| [`customDeviceName`](#set-the-login-device-name) | `EMOptions` | Set the name of the current login device. |
| [`customOSType`](#set-the-login-device-platform) | `EMOptions` | Set the platform number of the current login device. |
| [`loginExtensionInfo`](#set-login-device-extension-information) | `EMOptions` | Set extension information for the current login device. |
| [`kickDeviceWithUserId`](#force-a-specified-account-offline-from-one-device) | `EMClient` | Asynchronously kick a specified account offline from a specified device. |
| [`kickAllDevicesWithUserId`](#force-a-specified-account-offline-from-all-devices) | `EMClient` | Asynchronously kick a specified account offline from all devices. |
| [`resource`](#retrieve-the-online-login-device-list-of-a-specified-account) / [`deviceUUID`](#retrieve-the-online-login-device-list-of-a-specified-account) / [`deviceName`](#retrieve-the-online-login-device-list-of-a-specified-account) | `EMDeviceConfig` | Retrieve the resource identifier, UUID, and name of a login device. |
| [`deviceName`](#set-login-device-extension-information) / [`extensionInfo`](#set-login-device-extension-information) | `EMLoginExtensionInfo` | Retrieve the name and extension information of the new device that caused the current device to be kicked offline. |
