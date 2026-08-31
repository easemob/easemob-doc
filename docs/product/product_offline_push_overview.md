# Offline Push

EasyIM supports integration with third-party offline message push services. When a user goes offline because the client disconnects or the app process closes, EasyIM sends a message notification to the offline user's device through a third-party message push service. When the user gets online again, the server sends the messages received while the user was offline. For example, if another user sends you a message while you are offline, a message notification appears in your phone's notification center. When you open the app again and log in successfully, the EasyIM SDK automatically retrieves the messages received while you were offline.

:::tip
EasyIM does not send offline push notifications in the following two situations:
1. If the app is running in the background, the user remains online, and EasyIM does not send a message notification to the user.
2. If the client remains connected to the server while the app is running in the background or the phone is locked, EasyIM does not send an offline push notification.
:::

## Push services or plugins supported on each platform

| Platform                | Supported push service            | Reference   |
| -------------- | ---------------- | ------ |
|  Android            | Google FCM   | For push service integration and push settings, see the [Android push documentation](/sdk/v5/android/push/push_overview.html).                                    |
|  iOS            | APNs         | For APNs push service integration and push settings, see the [APNs push documentation](/sdk/v5/ios/push/push_overview.html).                                  |

:::tip
The EasyIM Web SDK does not support offline push itself. It supports only configuring offline push for mobile clients. For details, see the [Web offline push documentation](/sdk/v5/web/push/push_overview.html).
:::

## Push token

A push token (device token) is provided by a third-party push service. For example, for FCM push, the FCM SDK generates a registration token for the client app instance when your app starts for the first time. This token identifies each app on each device. FCM uses it to determine the destination device, forwards the message to the device, and the device then notifies the app. You can call the `FirebaseMessaging.getInstance().getToken()` method to obtain the token.

Open the app. After the EasyIM SDK is initialized and the user logs in successfully, obtain the push token and upload it to the EasyIM server to bind it to the EasyIM login account.

If you do not unbind the device token when logging out of EasyIM, the user continues to receive offline push notifications while the push certificate and token remain valid. For example, on Android, when calling the `logout` method, set the `unbindToken` parameter to `false` to keep the `device token` bound or to `true` to unbind it.

## Upload a push certificate

After creating an app in the third-party push service console, download the push certificate and obtain the related information. Upload the push certificate to the [EasyIM Console](https://console.easyim.ai/user/login) and configure its information.

For example, for FCM push certificate configuration, see the [FCM push integration documentation](/sdk/v5/android/push/push_fcm.html#step-3-upload-the-push-certificate). 

## Multi-device offline push policy

For multi-device login, you can configure a push policy on the Certificate Management page of the EasyIM Console. This policy applies to all push channels:

- Send push messages only when all devices are offline;
- Send push messages whenever any device is offline.

**During multi-device login, a device that is forced offline does not receive offline push messages even if EasyIM offline push has been integrated.**

## Push notification mode

The following push notification modes are available:
- Receive push notifications for all offline messages.
- Receive push notifications only for messages that mention specified users. This mode is recommended for group chats. To mention one or more users, pass "em_at_list":["user1", "user2" ...] for the ext field when creating a message. To mention all users, pass "em_at_list":"all" for the field.
- Do not receive push notifications for offline messages.

The push notification mode takes effect at the app or one-to-one/group chat conversation level. Conversation-level settings take precedence over app-level settings. A conversation without a configured push notification mode uses the app setting by default.

For information about configuring the push notification mode, see the documentation for the relevant platform. For example, for Android, see [Push notification mode](/sdk/v5/android/push/push_notification_mode_dnd.html#push-notification-mode).

## Do Not Disturb mode

Do Not Disturb settings include a Do Not Disturb period and duration. EasyIM does not send offline push notifications during either period, so you can disable push by configuring Do Not Disturb mode. To push a message to a specified user while a Do Not Disturb period or duration is in effect, configure [forced push](/sdk/v5/android/push/push_extension.html#force-push).

The Do Not Disturb period applies only at the app level, while the Do Not Disturb duration applies to the app and one-to-one and group chat conversations. If you configure both a Do Not Disturb period and a Do Not Disturb duration, the total time during which Do Not Disturb mode is in effect is the sum of the two periods.

For information about configuring the Do Not Disturb period and duration, see the documentation for the relevant platform. For example, for Android, see [Do Not Disturb mode](/sdk/v5/android/push/push_notification_mode_dnd.html#do-not-disturb-mode).

Relationship between Do Not Disturb mode and push notification mode

For the app and all conversations in it, Do Not Disturb settings take precedence over push notification mode settings. For details about their relationship, see the documentation for the relevant platform. For example, for Android, see [Relationship between push notification mode and Do Not Disturb mode](/sdk/v5/android/push/push_notification_mode_dnd.html#do-not-disturb-mode).

## Use push templates

Configuring push templates is an advanced push feature. Before using it, [activate advanced push features](/sdk/v5/android/push/push_overview.html#advanced-push-features) in the [EasyIM Console](https://console.easyim.ai/user/login).

Push templates are primarily used when the server's default configuration does not meet your requirements. They allow you to set global push notification titles and content. For example, the server provides default push titles and content in Chinese and English. If you need Korean or Japanese push titles and content, you can configure templates for those languages. Push templates include the `default` and `detail` push templates and custom push templates. For chat group messages, you can use targeted templates to send some users offline notifications that differ from those sent to other users.

You can configure push templates in the following ways:

- [Call a REST API](/rest/push_template_overview.html).
- Configure push templates in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure push templates](/sdk/v5/android/push/push_template.html).

Push templates provide the following benefits:

1. Customize the default push content on the EasyIM server.   
2. Allow the recipient to decide which template to use. 
3. Select templates by priority: 
   - A custom push template has a higher priority than the default push template.
   - If the sender specifies a push template when sending a message, the notification is displayed using the sender's template even if the recipient has also configured a push template.

For details about push templates, see [How to use push templates](/sdk/v5/android/push/push_template.html) in the documentation for each platform.

## Enable a third-party offline push service

Enable the corresponding offline push service when initializing the EasyIM SDK. For example, for FCM push, see the [FCM push integration documentation](/sdk/v5/android/push/push_fcm.html#step-4-integrate-fcm-push).

## Set push notification display content

You can set push notification titles and content in multiple ways, including calling an API, using a push template, and using message extension fields when sending a message.

For information about these settings and their priorities, see the relevant documentation. For example, for Android, see [Set push notification display attributes](/sdk/v5/android/push/push_display_attribute.html#set-push-notification-display-attributes).

<!--
## Push translation

Push notifications work with the [translation feature](/value-added/translation/message_translation_android.html). If a user enables automatic translation and sends a message, the SDK sends both the original and translated messages.

As a recipient, you can set a preferred language for push notifications received while you are offline. If the language of the translated message matches your setting, the translated message is displayed in the push notification. Otherwise, the original message is displayed. The translation feature is provided by the Microsoft Azure Translation API. Click [here](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) to view the supported languages.

For information about setting and retrieving the preferred language for push notifications, see the documentation for the relevant platform. For example, for Android, see [Configure push translation](/sdk/v5/android/push/push_translation.html).

-->

## Push extensions

You can use extension fields to customize push settings, including sending push notifications only to specified chat group members, collapsing notifications in the notification bar, forcing push, and sending silent messages.

For information about configuring push extension fields, see the documentation for the relevant platform. For example, for Android, see [Configure push extensions](/sdk/v5/android/push/push_extension.html).




