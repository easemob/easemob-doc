# Set and Retrieve Notification Display Attributes

## Set notification display attributes

You can call `updatePushDisplayName` to set the nickname displayed in push notifications, as shown in the following example:

```objectivec
// Asynchronous method
[[EMClient sharedClient].pushManager updatePushDisplayName:@"displayName" completion:^(NSString * aDisplayName, EMError * aError) {
    if (aError) {
        NSLog(@"update push display name error: %@", aError.errorDescription);
    }
}];
```

You can also call `updatePushDisplayStyle` to set the display style of push notifications, as shown in the following example:

```objectivec
// Asynchronous method
[[EMClient sharedClient].pushManager updatePushDisplayStyle:EMPushDisplayStyleSimpleBanner completion:^(EMError * aError)
{
    if (aError) {
        NSLog(@"update display style error --- %@", aError.errorDescription);
    }
}];
```

To display message content in the notification bar, you need to set the notification display style `EMPushDisplayStyle`. `EMPushDisplayStyle` is an enum with the following two values:

| Parameter value | Description |
| :--------------- | :---------------------- |
| (default) `EMPushDisplayStyleSimpleBanner` | Whether or not `displayName` is set, when any type of message is pushed, the notification bar uses the default display settings. That is, the push title is **You have a new message** and the push content is **Please tap to view**. |
| `EMPushDisplayStyleMessageSummary` | `EMPushDisplayStyleMessageSummary`: Displays the message content. The configured nickname takes effect only when `EMPushDisplayStyle` is `EMPushDisplayStyleMessageSummary`, and does not take effect when `EMPushDisplayStyleSimpleBanner` is used. |

The following table uses a **one-to-one text message** as an example to describe the display attribute settings.

For a **group chat**, the **push nickname of the message sender** and the **IM user ID of the message sender** in the following table are displayed as the **group ID**.

| Parameter setting | Push display | Image |
| :--------- | :----- |:------------- |
| <br/> - `EMPushDisplayStyle`: (default) `EMPushDisplayStyleSimpleBanner`<br/> - `displayName`: set or not set | <br/> - Push title: **You have a new message**<br/> - Push content: **Please tap to view** | ![img](/images/android/push/push_displayattribute_1.png) |
| <br/> - `EMPushDisplayStyle`: `EMPushDisplayStyleMessageSummary`<br/> - `displayName`: set to a specific value | <br/> - Push title: **You have a new message**<br/> - Push content: **Push nickname of the message sender: message content** | ![img](/images/android/push/push_displayattribute_2.png) |
| <br/> - `EMPushDisplayStyle`: `EMPushDisplayStyleMessageSummary`<br/> - `displayName`: not set | <br/> - Push title: **You have a new message**<br/> - Push content: **IM user ID of the message sender: message content** | ![img](/images/android/push/push_displayattribute_3.png) |

## Retrieve notification display attributes

You can call `getPushNotificationOptionsFromServerWithCompletion` to retrieve the display attributes in push notifications, as shown in the following example:

```objectivec
// Asynchronous method
[[EMClient sharedClient].pushManager getPushNotificationOptionsFromServerWithCompletion:^(EMPushOptions * aOptions, EMError * aError)
{
    if (aError) {
        NSLog(@"get push options error --- %@", aError.errorDescription);
    }
}];
```

`EMPushOptions` push configuration object.

| Property name | Description |
| :------------------- | :----------------------------------------------------------- |
| `displayName` | The name shown for the sender when the other party receives the push notification. |
| `displayStyle` | Push display type. |

## API List

| API name | Module/type | Description |
| :--- | :--- | :--- |
| [`updatePushDisplayName`](#set-push-notification-display-attributes) | `IEMPushManager` | Sets the nickname displayed in offline push notifications. |
| [`updatePushDisplayStyle`](#set-push-notification-display-attributes) | `IEMPushManager` | Sets the display style of offline push notifications. |
| [`getPushNotificationOptionsFromServerWithCompletion`](#retrieve-push-notification-display-attributes) | `IEMPushManager` | Gets the push notification display attributes from the server. |
