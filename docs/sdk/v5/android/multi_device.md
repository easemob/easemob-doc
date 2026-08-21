# Multi-Device Login

## Feature overview

EasyIM allows the same account to log in on multiple devices. Before using this feature, activate the multi-device login service in [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#多端多设备).

During login, the Android SDK generates a login resource identifier for the current device and synchronizes device-related information to the server. The server maintains the current account's online device state according to the multi-device policy. When the same account performs operations involving friends, chat groups, message threads, conversations, or one-way deletion of server-side historical messages on another device, the current device receives the corresponding multi-device events through an `EMMultiDeviceListener` registered with `EMClient#addMultiDeviceListener`.

The Android SDK supports the following features in multi-device login scenarios:

- Receive multi-device events triggered by the current account's other devices.
- Synchronize operations involving friends, chat groups, message threads, conversations, and one-way deletion of server-side historical messages.
- Retrieve login IDs for the current user's other logged-in devices.
- Retrieve the online login device list for a specified account.  
- Set a login device name.
- Set a login device platform.
- Forcibly log out a specified account from one device.
- Forcibly log out a specified account from all devices.
- Retrieve friend or chat group operations performed on other devices.

By default, EasyIM allows up to 4 devices on each platform to be online simultaneously during multi-device login. To increase this limit, contact the EasyIM business manager. On the **Feature Configuration > Basic Features > Users** page in EasyIM Console, set the device count for each platform in the dialog box:

![img](/images/common/multidevice_device_count.png)

## Mutual-kick policy

The mutual-kick policies for single-device and multi-device login are as follows:

| Login mode | Mutual-kick policy |
| :---: | :--- |
| **Single-device login** | A newly logged-in device logs out the currently online device. |
| **Multi-device login** | If the logged-in device count on a platform reaches the limit, the latest device logs out the earliest device on that platform.<br><br>EasyIM supports mutual kicking only within the same platform, not between platforms. |

## Prerequisite

- Initialize the SDK and connect to the server. For details, see [Quickstart](quickstart.html).
- Activate multi-device login in [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#多端多设备).
- Set the custom login device name and platform during SDK initialization.

## Retrieve login IDs for the current user's other logged-in devices  

Call `asyncGetSelfIdsOnOtherPlatform` to retrieve login IDs for other logged-in devices, and then select a target login ID as the message recipient to send a message to a specified device.

This API is used in multi-device login scenarios to query the current account's login state on other devices. The result automatically excludes the current device and can generally be used to display logged-in devices, identify abnormal logins, provide multi-device login notifications, or manage a specified device together with server-side logout APIs.

```java
// Asynchronous method.
EMClient.getInstance().contactManager().asyncGetSelfIdsOnOtherPlatform(new EMValueCallBack<List<String>>() {
    @Override
    public void onSuccess(List<String> ids) {
        // Select a login ID as the message recipient.
        String toChatUsername = ids.get(0);
        EMMessage message = EMMessage.createTextSendMessage(content, toChatUsername);
        EMClient.getInstance().chatManager().sendMessage(message);
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
    }
});
```

Each login ID returned by `EMContactManager#asyncGetSelfIdsOnOtherPlatform` uses the `userId/resource` format:

- `userId`: Current user's user ID.
- `resource`: Resource identifier of the logged-in device, used to distinguish a specific device for the user.

`resource` has the same meaning as the `resourceId` parameter of the server-side [Log Out a User from a Device API](/document/server-side/account_offline_device_single.html) and the `res` field returned by the server-side [Get Online Devices for an Account API](/document/server-side/account_online_device_obtain.html). Each identifies one of the user's login devices.

The Android client API returns a complete `userId/resource` login ID, while the server-side APIs generally require only the `resource` after `/`. Therefore, to call the server-side single-device logout API, first extract `resource` from the login ID and pass it as `resourceId`.

## Retrieve the online login device list for a specified account

Call `EMClient#fetchLoggedInDevicesFromServerWithToken` to asynchronously retrieve the online login device list for a specified account from the server with a user ID and user token.

On success, the callback returns `List<EMDeviceInfo>`. Call `EMDeviceInfo#getDeviceName` to retrieve a device name. If no custom name is set, it generally returns the device model. Call `EMDeviceInfo#getResource` to retrieve the device resource identifier.

```java
// Asynchronous method.
EMClient.getInstance()
        .fetchLoggedInDevicesFromServerWithToken(
                username,
                token,
                new EMValueCallBack<List<EMDeviceInfo>>() {
                    @Override
                    public void onSuccess(List<EMDeviceInfo> deviceInfos) {
                        // Use the online login device list.
                    }

                    @Override
                    public void onError(int error, String errorMsg) {
                        // Handle the retrieval failure.
                    }
                });
```

## Set a login device name

EasyIM supports custom device names. In a multi-device scenario, when a device is logged out, it can identify the device that caused the logout.

During SDK initialization, call `EMOptions#setCustomDeviceName` to set the login device name. If an already logged-in device is forcibly logged out because the login device limit was reached, its `EMConnectionListener#onLogout` callback contains the custom name of the device that caused the logout.

:::tip
This setting is sent to the server only after login succeeds.
:::

```java
    EMOptions options =  new EMOptions();
    options.setCustomDeviceName("你的自定义设备名称");
    EMClient.getInstance().init(context,options);

    EMClient.getInstance().addConnectionListener(new EMConnectionListener() {
            @Override
            public void onConnected() {

            }

            @Override
            public void onDisconnected(int errorCode) {

            }

            @Override
            public void onLogout(int errorCode, EMLoginExtensionInfo info) {
                // Custom device information is wrapped in EMLoginExtensionInfo.
               // When errorCode is EMError.USER_LOGIN_ANOTHER_DEVICE,
               // info.getDeviceInfo() is the name of the device that logged out the current device.
            }
        });
```

## Set a login device platform

EasyIM supports custom login device platforms. For example, define Android phones and Android tablets as separate platforms so users can precisely control the logged-in device count on each platform and mutual kicking between platforms.

Set the platform to which a login device belongs as follows:

1. On the **Instant Messaging > Basic Features > Users** page in EasyIM Console, click **Settings** in the **Multi-Device Login** section. In the dialog box, click **Add Custom Platform**, and set **Device Platform** and **Device Count**.

The range for **Device Platform** is [1,100], and the range for **Device Count** is [0,4].

![img](/images/common/multidevice_device_platform.png)

2. During SDK initialization, call `EMOptions#setCustomOSPlatform` to set a custom login device platform. Ensure that `platform` has the same value as **Device Platform** in the **Add Custom Platform** dialog box in EasyIM Console.

:::tip
This setting is sent to the server only after login succeeds.
:::

```java
    EMOptions options=new EMOptions();
    options.setCustomOSPlatform(1);
    EMClient.getInstance().init(context,options);
```

## Set login device extension information

EasyIM supports custom extension information for a login device. In a multi-device login scenario, this capability carries additional identifiers for the current login device to support device identification and management. For example, a logged-out device can obtain the custom extension information of the new device.

During SDK initialization, call `EMOptions#setLoginCustomExt` to set custom login device extension information with a maximum length of 1024 characters. If an already logged-in device is forcibly logged out because the login device limit was reached (`206`, `USER_LOGIN_ANOTHER_DEVICE`), its `EMConnectionListener#onLogout` callback contains the custom extension information of the new device that caused the logout.

:::tip
This setting is sent to the server only after login succeeds.
:::

```java
    EMOptions options =  new EMOptions();
    options.setLoginCustomExt("你的自定义扩展信息json字符串");
    EMClient.getInstance().init(context,options);

    EMClient.getInstance().addConnectionListener(new EMConnectionListener() {
        @Override
        public void onConnected() {

        }

        @Override
        public void onDisconnected(int errorCode) {

        }

        @Override
        public void onLogout(int errorCode, EMLoginExtensionInfo info) {
            // This callback is triggered when the current login device is logged out because the account logs in on another device.
            // errorCode is {@link EMError#USER_LOGIN_ANOTHER_DEVICE}.
            // info.getDeviceExt() is the custom extension information of the new device that logged out the current device.
            // info.getDeviceExt() is empty for other error codes.
        }
    });
```

## Forcibly log out a specified account from one device

Call `kickDeviceWithToken` and pass the user ID, user token, and device resource identifier to log out a specified account from one login device. Before calling it, use `EMClient#fetchLoggedInDevicesFromServerWithToken` to retrieve the device list, and then use `EMDeviceInfo#getResource` to retrieve the device resource identifier.

:::tip
This API can be used without login.
:::

```java
// Asynchronously retrieve the online device list, and then use a device resource identifier to log out the specified device.
EMClient.getInstance().fetchLoggedInDevicesFromServerWithToken(
        username,
        token,
        new EMValueCallBack<List<EMDeviceInfo>>() {
            @Override
            public void onSuccess(List<EMDeviceInfo> deviceInfos) {
                try {
                    EMClient.getInstance().kickDeviceWithToken(
                            username,
                            token,
                            deviceInfos.get(selectedIndex).getResource());
                } catch (HyphenateException e) {
                    EMLog.e(TAG, "踢出指定设备失败", e);
                }
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Handle the device-list retrieval failure.
            }
        });
```

## Forcibly log out a specified account from all devices

Call `kickAllDevicesWithToken` and pass a user ID and user token to log out a specified account from all login devices.

:::tip
This API can be used without login.
:::

```java
    try {
        EMClient.getInstance().kickAllDevicesWithToken("username","token");
    } catch (HyphenateException e) {
        e.printStackTrace();
    }
```

## Monitor multi-device events

For example, account A is logged in on devices A and B. When account A performs an operation on device A, device B receives a notification corresponding to the operation.

First implement `EMMultiDeviceListener` to monitor operations on other devices, and then call `addMultiDeviceListener` to add the listener.

If the current device is logged out because the device count on the same platform reaches the limit, the SDK reports it through `EMConnectionListener#onLogout`. Friend, chat group, message thread, and conversation operations performed by the current account on other devices are reported through the corresponding `EMMultiDeviceListener` callbacks. Chat rooms do not generate conversation-management multi-device events, but chat room messages are still synchronized.

:::tip
Multi-device login has no chat room operation events. It supports only synchronization of messages sent and received in chat rooms.
:::

```java
// Implement `EMMultiDeviceListener` to monitor operations on other devices.
private class ChatEMMultiDeviceListener implements EMMultiDeviceListener {
// @param event Event.
    @Override
    // @param target Friend user ID; @param ext Event extension information.
    public void onContactEvent(int event, String target, String ext) {
        EMLog.i(TAG, "onContactEvent event"+event);
        DemoDbHelper dbHelper = DemoDbHelper.getInstance(DemoApplication.getInstance());
        String message = null;
        switch (event) {
            // The current user deletes a friend on another device.
            case CONTACT_REMOVE: 
                break;
            // The current user accepts a friend request on another device.
            case CONTACT_ACCEPT:
                break;
            // The current user declines a friend request on another device.
            case CONTACT_DECLINE: 
                break;
            // The current user adds a friend to the blocklist on another device.
            case CONTACT_BAN: 
                break;
            // The current user removes a friend from the blocklist on another device.
            case CONTACT_ALLOW:
                break; 
        }
    }

    @Override
    public void onGroupEvent(int event, String groupId, List<String> usernames) {
        EMLog.i(TAG, "onEMGroupEvent event"+event);
        String message = null;
        switch (event) {
            // The current user creates a chat group on another device.
            case GROUP_CREATE:
                break;
            // The current user destroys a chat group on another device.
            case GROUP_DESTROY:
                break;
            // The current user mutes all chat group members on another device.
            case GROUP_ALL_BAN:
                break;
            // The current user joins a chat group on another device.
            case GROUP_JOIN:
                break;
            // The current user leaves a chat group on another device.
            case GROUP_LEAVE:
                break;
            // The current user submits a join request on another device.
            case GROUP_APPLY:
                break;
            // The current user approves a join request on another device.
            case GROUP_APPLY_ACCEPT:
                break;
            // The current user declines a join request on another device.
            case GROUP_APPLY_DECLINE:
                break;
            // The current user invites a chat group member on another device.
            case GROUP_INVITE:
                break;
            // The current user accepts a chat group invitation on another device.
            case GROUP_INVITE_ACCEPT:
                break;
            // The current user declines a chat group invitation on another device.
            case GROUP_INVITE_DECLINE:
                break;
            // The current user removes a member from a chat group on another device.
            case GROUP_KICK:
                break;
            // The current user adds a member to the group blocklist on another device.
            case GROUP_BAN:
                break;
            // The current user removes a member from the group blocklist on another device.
            case GROUP_ALLOW:
                break;
            // The current user blocks a chat group on another device.
            case GROUP_BLOCK:
                break;
            // The current user unblocks a chat group on another device.
            case GROUP_UNBLOCK:
                break;
            // The current user transfers chat group ownership on another device.
            case GROUP_ASSIGN_OWNER:
                break;
            // The current user adds an admin on another device.
            case GROUP_ADD_ADMIN:
                break;
            // The current user removes an admin on another device.
            case GROUP_REMOVE_ADMIN:
                break;
            // The current user mutes a user on another device.
            case GROUP_ADD_MUTE:
                break;
            // The current user unmutes a user on another device.
            case GROUP_REMOVE_MUTE:
                break;
            // The current user sets custom chat group member attributes on another device.
            case GROUP_METADATA_CHANGED:
                break;    
            default:
                break;
        }
    }

    @Override
        public void onChatThreadEvent(int event, String target, List<String> usernames) {
            EMLog.i(TAG, "onChatThreadEvent event"+event);
            switch (event) {
                case  THREAD_CREATE:
                    // The current user creates a message thread on another device.
                    break;
                case  THREAD_DESTROY:
                    // The current user destroys a message thread on another device.
                    break;
                case  THREAD_JOIN:
                    // The current user joins a message thread on another device.
                    break;
                case  THREAD_LEAVE:
                    // The current user leaves a message thread on another device.
                    break;
                case  THREAD_UPDATE:
                    // The current user updates a message thread on another device.
                    break;
                case  THREAD_KICK:
                    // The current user removes a member from a message thread on another device.
                    break;

            }
        }

        @Override
        public void onConversationEvent(int event, String conversationId, EMConversation.EMConversationType type) {
            EMLog.i(TAG, "onConversationEvent event"+event);
            switch (event) {
                case CONVERSATION_MUTE_INFO_CHANGED:
                    // The current user changes conversation DND settings on another device.
                    break;
                case ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED:
                    // The current user clears the unread counts of all conversations on another device.
                    break;
                case CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED:
                    // The current user clears the unread count of a specified conversation on another device.
                    break;
                case CONVERSATION_PINNED:
                    // The current user pins a conversation on another device.
                    break;
                case CONVERSATION_UNPINNED:
                    // The current user unpins a conversation on another device.
                    break;
                case CONVERSATION_DELETED:
                    // The current user deletes a server-side conversation on another device.
                    break;
                case CONVERSATION_MARK_UPDATE:
                    // The current user updates conversation tags, including adding and removing tags, on another device.
                    break;   
            }

        }

        @Override
        public void onMessageRemoved(String conversationId, String deviceId) {
            EMLog.i(TAG, "onMessageRemoved conversationId "+conversationId);
            // The current user deletes server-side historical messages from a conversation for the current user on another device.
        }
}

ChatMultiDeviceListener chatMultiDeviceListener = new ChatMultiDeviceListener();

// Set the multi-device listener.
EMClient.getInstance().addMultiDeviceListener(chatMultiDeviceListener);

// Remove the multi-device listener.
EMClient.getInstance().removeMultiDeviceListener(chatMultiDeviceListener);
```

## Typical example

When the same account is logged in on a PC and a mobile device, call the method on the mobile device to retrieve the PC login ID. This login ID is equivalent to a special friend user ID and can be used directly for chat in the same way as a friend's user ID.

```java
try {
    List<String> selfIds = EMClient.getInstance().contactManager().getSelfIdsOnOtherPlatform();
} catch (HyphenateException e) {
    EMLog.e(TAG, "获取其他平台登录 ID 失败", e);
}
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`getSelfIdsOnOtherPlatform`](#retrieve-login-ids-for-the-current-users-other-logged-in-devices) | `EMContactManager` | Retrieves login IDs for the current user's other devices. |
| [`asyncGetSelfIdsOnOtherPlatform`](#retrieve-login-ids-for-the-current-users-other-logged-in-devices) | `EMContactManager` | Asynchronously retrieves login IDs for the current user's other devices. |
| [`fetchLoggedInDevicesFromServerWithToken`](#retrieve-the-online-login-device-list-for-a-specified-account) | `EMClient` | Asynchronously retrieves a specified account's online device list using a user ID and token. |
| [`setCustomDeviceName`](#set-a-login-device-name) | `EMOptions` | Sets the current login device name. |
| [`setCustomOSPlatform`](#set-a-login-device-platform) | `EMOptions` | Sets the current login device platform number. |
| [`setLoginCustomExt`](#set-login-device-extension-information) | `EMOptions` | Sets the current login device extension information. |
| [`kickDeviceWithToken`](#forcibly-log-out-a-specified-account-from-one-device) | `EMClient` | Logs out a specified account from a specified device. |
| [`kickAllDevicesWithToken`](#forcibly-log-out-a-specified-account-from-all-devices) | `EMClient` | Logs out a specified account from all devices. |
