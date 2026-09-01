# Offline Push Overview

EasyIM supports integration with third-party message-push services to send message notifications to mobile devices when users are offline. **The EasyIM Web SDK itself does not support offline push. It supports only configuring offline push for mobile clients**, such as uploading a push token, configuring global or conversation-level Do Not Disturb (DND) settings, querying push configuration, and setting the push language.

## Offline push process

When the client disconnects, the app process closes, or the user goes offline for another reason, EasyIM sends a notification to the offline user's device through an integrated third-party push channel. After the user gets online again, the SDK synchronizes messages generated while the user was offline from the server. The notification badge generally indicates the accumulated number of notifications during the offline period and is not the same as the actual unread message count in the app. For details, see the offline push documentation for [Android](/sdk/v5/android/push/push_overview.html#push-principles) and [iOS](/sdk/v5/ios/push/push_overview.html#offline-push-process).

**EasyIM does not send offline push notifications in the following two scenarios:**

1. The app is in the foreground, or the app is in the background but the client remains connected. The user is still considered online, so offline push is not triggered.
2. The app runs in the background, the screen is locked, or the app is suspended, but the client has not disconnected from the server. Offline push is also not triggered.

## Upload a push certificate

In addition to ensuring that the user is offline, to use third-party offline push, configure the push certificate or channel parameters in the [EasyIM Console](https://console.easyim.ai/user/login). For vendor-specific certificate configuration, see [Android Push](/sdk/v5/android/push/push_fcm.html) and [APNs Push](/sdk/v5/ios/push/push_apns.html).

In the SDK, call `client.pushManager.uploadPushToken` to upload a push token. Before calling it, initialize and log in to the SDK and obtain the `deviceToken` assigned by the vendor push channel. `deviceId` identifies the current device, and `notifierName` corresponds to the push-certificate name or channel identifier configured in the EasyIM Console.

```typescript
await client.pushManager.uploadPushToken({
  deviceId: 'device-id', // Device ID used to identify the device.
  deviceToken: 'push-token-from-fcm-or-apns', // Push token used to identify each app on each device.
  notifierName: 'your-push-certificate-name', // Certificate name of the push service.
});
```

## Advanced push features

### Feature activation

[Push notification modes](push_notification_mode_dnd.html#push-notification-modes), [DND](push_notification_mode_dnd.html#dnd), and [push templates](push_template.html) are advanced push features. Before using them, enable them for free in the [EasyIM Console](https://console.easyim.ai/user/login). **After activation, to disable advanced push features, you must contact the EasyIM business manager because this operation deletes all configurations related to the advanced features.**

1. Log in to the [EasyIM Console](https://console.easyim.ai/user/login).
2. Select **App Management** at the top of the page. On the app list page that appears, click **Manage** in the **Actions** column for your app.
3. Select **Value-added Services > Message Push > Offline Push**.
4. Click **Enable for Free**.

![image](/images/android/push/push_advanced_feature_enable.png)

### Push notification modes

The following push notification modes are available:

- `ALL`: Receive push notifications for all offline messages.
- `AT`: Receive push notifications only for messages that mention the current user.
- `NONE`: Do not receive push notifications for offline messages.

Configure the push notification mode globally or for an individual one-to-one or group conversation. A conversation-level setting takes precedence over the global setting. If the conversation-level setting is cleared, the conversation inherits the global setting again.

For details, see [Push notification modes](push_notification_mode_dnd.html#push-notification-modes).

### Do Not Disturb

After initializing and successfully logging in to the SDK, configure DND globally or for an individual one-to-one or group conversation.

- Set a one-time DND duration, such as 30 minutes.
- Set a daily recurring DND period, such as 8:0-10:0.
- Configure DND globally or for an individual one-to-one or group conversation.
- To push a message to a specified user during DND, use forced push.

For details, see [DND](push_notification_mode_dnd.html#dnd).

### Push templates

Push templates are primarily used to configure global push titles and content when the default offline-push content provided by the server does not meet your requirements. Push templates include the default templates `default` and `detail` and custom templates. Configure them in the [EasyIM Console](https://console.easyim.ai/user/login).

For push-template configuration and usage, see [Push Templates](push_template.html).

## Multi-device offline push policy

For multi-device login, configure the push policy on the **Certificate Management** page in the [EasyIM Console](https://console.easyim.ai/user/login). The policy applies to all push channels:

- Send push messages only when all devices are offline.
- Send push messages when any device is offline.

**When multi-device login is enabled, a device that is kicked offline does not receive offline push messages even if EasyIM offline push is integrated.**

![image](/images/android/push/push_multidevice_policy.png)

## Features configurable on the Web client

The EasyIM Web SDK primarily supports the following configuration options for mobile offline push:

- Upload a push token:
- Configure push notifications, including the push notification mode and DND:
  - Configure global push notifications.
  - Retrieve global push-notification settings.
  - Configure push notifications for a conversation.
  - Retrieve push-notification settings for one or more conversations.
  - Clear the push notification mode for a conversation so that it inherits the global setting again.
- Query the list of conversations with a configured push notification mode.
- Set the push language.
- Set a push template.
- Configure extended push features, including forced push and silent messages.
