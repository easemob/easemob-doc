# Offline Push Overview

<Toc />

## Feature overview

EasyIM uses Apple Push Notification service (APNs) to send message notifications to offline iOS users. After users get online again and restore the IM connection, the SDK retrieves messages from the offline period. Your app can use them to update conversation and message displays.

Push notifications and IM message synchronization are separate processes. Receiving a notification does not mean the SDK has received the corresponding complete message. The notification badge's offline message count also differs from the actual conversation unread count.

## Prerequisites

Before integration, confirm the following:

### SDK and runtime

- [Enable and configure EasyIM](/product/console/app_create.html), obtain a valid App Key, and complete [iOS SDK integration](/docs/sdk/v5/ios/integration.html).
- Meet the [iOS development environment requirements](/docs/sdk/v5/android/integration.html#development-environment-requirements) and understand the EasyIM API [limitations](/product/limitation.html).
- Prepare a physical iOS device to verify actual push delivery. See [Test APNs push notifications](push_apns.html#test-apns-push-notifications).

### APNs and Console configuration

Prepare an Apple developer account with push configuration permissions, configure APNs for the app, and upload and configure the corresponding certificate in [EasyIM Console](https://console.easyim.io/user/login). Confirm that the Bundle ID, signing, and provisioning profile push settings match the app and that the Console push environment matches the installed package. See [Create a push certificate](push_apns.html#create-a-push-certificate) and [Upload the push certificate](push_apns.html#upload-the-push-certificate).

Console certificate configuration is an integration prerequisite. During SDK initialization, set the configured certificate name through `EMOptions.apnsCertName` and pass the obtained device token to the SDK. If the user is not logged in when the token is passed, the SDK attempts to upload the saved token after successful login. Confirm the server-side binding result after login, and pass new tokens to the SDK promptly. See [Pass the certificate name to the SDK](push_apns.html#step-2-pass-the-certificate-name-to-the-sdk) and [Get the device token and pass it to the SDK](push_apns.html#step-3-get-the-device-token-and-pass-it-to-the-sdk).

For complete client steps, see [Integrate APNs on the client](push_apns.html#integrate-apns-on-the-client). After integration, follow [Test APNs push notifications](push_apns.html#test-apns-push-notifications). If notifications are missing, see [Troubleshooting](push_apns.html#troubleshooting).

### System notification permissions

Enable **Push Notifications** for the app in Xcode. To display banners, sounds, or badges, also request the corresponding user authorization and confirm that system settings allow those notifications for the app. See [Enable push permissions in the app](push_apns.html#step-1-enable-push-permissions-in-the-app).

Obtaining an APNs device token, binding it to the IM server, and obtaining notification display permissions are separate steps. Obtaining or binding a token does not mean the system allows the app to display notifications.

Push notification modes, Do Not Disturb mode, and push templates are optional advanced features. For activation requirements, see [Feature activation](#feature-activation).

## Understand the tech

### Push certificates and device tokens

APNs push depends on a push certificate and device token:

| Item | Purpose |
| :--- | :--- |
| Push certificate | Used by the IM server to send push requests to APNs. Upload and configure it in EasyIM Console. The certificate name set by the client must match the Console. |
| Device token | A push identifier provided by APNs for the app on the device, identifying the target device and app. After obtaining it, the client binds it to the IM server through the SDK. |

For certificate creation, uploading, and token binding, see [APNs integration](push_apns.html).

### Message push flow

![APNs offline push flow](/images/ios/push/push_ios_1_understand_en.png)

For example, when user A sends a message to user B:

1. User B registers with APNs to obtain a push token.
2. APNs returns the push token.
3. User B uploads the push certificate name and push token to the IM server.
4. User A sends a message to user B.
5. The IM server checks whether user B is online. If online, it delivers the message directly to user B.
6. If user B is offline, the IM server checks whether user B uses APNs.
7. The IM server sends the message to the APNs server.
8. APNs sends the message to user B.

## Push trigger conditions

### User offline state and connection state

The IM server determines whether to send offline push according to the recipient's online state, certificate and token binding, multi-device push policy, push notification mode, Do Not Disturb settings, and other configurations, rather than whether the client has received a disconnection callback. When the app enters the background, the device locks, or the app process is not running, consider actual connection and server-side states. Do not infer that the user is offline solely from the app's UI state.

If the device retains its IM persistent connection and the server still considers the user online, it does not send offline push notifications to that device. For multi-device login, also consider the [multi-device offline push policy](#multi-device-offline-push-policy).

Chat rooms do not support offline message push. Messages with `EMChatMessage.deliverOnlineOnly = YES` are delivered only to online users and do not trigger offline push.

:::tip
`EMOptions.disconnectNotifyThreshold`, available in SDK 5.2.0, affects only notification timing for the relevant disconnection callbacks. It does not delay actual connection state changes or control APNs sending time. See [Configure the disconnection notification grace period](/docs/sdk/v5/android/connection.html#configure-the-disconnection-notification-grace-period) and [Retrieve the connection state](/docs/sdk/v5/android/connection.html#retrieve-the-connection-state).
:::

### App foreground/background transitions

After SDK initialization, forward the app's foreground/background lifecycle events to the SDK so background disconnection, foreground reconnection, and APNs push work together.

| App state change | SDK API | SDK behavior and push relationship |
| :--- | :--- | :--- |
| Entering the background | `-[EMClient applicationDidEnterBackground:]` | If logged in, the SDK actively disconnects the IM persistent connection after receiving the background lifecycle call and reports a disconnected state. After the server considers the user offline and push conditions are met, notifications are sent through APNs. |
| Returning to the foreground | `-[EMClient applicationWillEnterForeground:]` | If logged in, the SDK checks the connection or attempts reconnection after receiving the foreground lifecycle call, then receives offline messages once the connection recovers. If logged out or forcibly logged out, log in again according to your business flow. |

For a logged-in user, the SDK disconnects directly after receiving the background lifecycle call, regardless of whether token binding succeeded. Complete certificate configuration and token binding before testing background notifications.

Forward these two SDK calls according to the app's overall foreground/background state, passing the `UIApplication` instance. When using `SceneDelegate`, a multi-window app should avoid disconnecting an IM connection needed by other active scenes merely because one scene enters the background. Also avoid forwarding the same state change repeatedly.

### Multi-device offline push policy

For the same account logged in on multiple devices, configure these policies on the **Certificates** page in [EasyIM Console](https://console.easyim.io/user/login). The setting applies to all push channels:

- Send push messages only when all devices are offline.
- Send push messages when any device is offline.

**During multi-device login, a device kicked offline does not receive that account's offline push notifications even if offline push is integrated.**

![Multi-device offline push policy](/images/android/push/push_multidevice_policy.png)

### Push after logout

When actively logging out of IM, unbinding the account and device token affects whether the device subsequently receives the account's offline push. Control this through `aIsUnbindDeviceToken` in `logout:completion:`:

| Value | Behavior |
| :--- | :--- |
| `YES` | Unbinds the token. After successful unbinding, the device no longer receives offline push for this account. If unbinding fails, handle the error returned by the completion callback. |
| `NO` | Retains the binding. The device can still receive offline push for this account if the certificate and token remain valid and push conditions are met. |

## Advanced push features

### Feature activation

[Push notification modes](push_notification_mode_dnd.html#push-notification-modes), [DND](push_notification_mode_dnd.html#dnd), and [push templates](push_template.html) are advanced push features. Before using them, enable them for free in the [EasyIM Console](https://console.easyim.ai/user/login). **After activation, to disable advanced push features, you must contact the EasyIM business manager because this operation deletes all configurations related to the advanced features.**

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login). 
2. On the **Applications** page, click the App Key of the app of the development or production environment.
3. Select **Push** in the left navigation pane and click the **Offline Push** tab.
4. Click **Enable Free**.

![image](/images/android/push/push_advanced_feature_enable.png)

### Push notification modes

The following push notification modes are available:

- Receive notifications for all offline messages.
- Receive notifications only for messages mentioning specific users.
- Receive no offline push notifications.

Configure this at the app level or for one-to-one and group conversations. Conversation-level settings take precedence over app-level settings.

See [Push notification mode](push_notification_mode_dnd.html#push-notification-mode).

### Do Not Disturb

After initializing the SDK and logging in, configure Do Not Disturb at the app level or for one-to-one and group conversations to disable offline notifications within the corresponding scope. The following settings are supported:

- A DND period, such as 08:00 to 10:00.
- A DND duration, such as 30 minutes.
- All-day DND, or disabling DND.

To notify specified users during DND, configure [forced push](push_extension.html#force-push).

See [DND](push_notification_mode_dnd.html#dnd) for specific rules and configuration.

### Push templates

Use push templates to configure global push titles and content when the server's default offline push configuration does not meet your requirements. Default templates `default` and `detail` and custom templates are supported. Configure them in [EasyIM Console](https://console.easyim.io/user/login).

You can [specify a push template when sending](push_template.html#use-a-push-template-when-sending-a-message) or [configure the template used by the recipient](push_template.html#use-a-push-template-for-the-message-recipient). See [Push Templates](push_template.html).
