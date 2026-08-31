# Set and Get Push Notification Display Attributes

## Set push notification display attributes

Call `asyncUpdatePushNickname` to set the nickname displayed for the current user in push notifications. The push nickname is different from the nickname in user attributes. If the business side updates the user nickname, it should also update the push nickname to avoid inconsistent display.

```java
// Asynchronous method.
// The synchronous method is updatePushNickname. This method blocks the current thread. Do not call it on the main thread.
EMClient.getInstance().pushManager().asyncUpdatePushNickname(
        "pushNickname",
        new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }

            @Override
            public void onProgress(int progress, String status) {
            }
        });
```

Call `asyncUpdatePushDisplayStyle` to set the display style of push notifications, as shown in the following example:

```java
// Asynchronous method.
// The synchronous method is updatePushDisplayStyle. This method blocks the current thread. Do not call it on the main thread.
EMPushManager.DisplayStyle displayStyle = EMPushManager.DisplayStyle.SimpleBanner;
EMClient.getInstance().pushManager().asyncUpdatePushDisplayStyle(
        displayStyle,
        new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }

            @Override
            public void onProgress(int progress, String status) {
            }
        });
```

To display message content in the notification bar, you need to set the notification display style `DisplayStyle`. `DisplayStyle` is an enum with the following two values:

| Parameter value | Description |
| :--------------- | :---------------------- |
| (default) `SimpleBanner` | Whether or not `nickname` is set, when any type of message is pushed, the notification bar uses the default display settings. That is, the push title is **You've got a new message** and the push content is **Please click to view**. |
| `MessageSummary` | `MessageSummary`: Displays the message content. The configured nickname takes effect only when `DisplayStyle` is `MessageSummary`, and does not take effect when `SimpleBanner` is used. |

The following table uses a **one-to-one text message** as an example to describe the display attribute settings.

For a **group chat**, the **push nickname of the message sender** and the **IM user ID of the message sender** in the following table are displayed as the **group ID**.

| Parameter setting | Push display | Image |
| :--------- | :----- |:------------- |
| <br/> - `DisplayStyle`: (default) `SimpleBanner`<br/> - `nickname`: set or not set | <br/> - Push title: **You've got a new message**<br/> - Push content: **Please click to view** | ![img](/images/android/push/push_displayattribute_1.png)|
| <br/> - `DisplayStyle`: `MessageSummary`<br/> - `nickname`: set to a specific value | <br/> - Push title: **You've got a new message**<br/> - Push content: **Push nickname of the message sender: message content** |![img](/images/android/push/push_displayattribute_2.png) |
| <br/> - `DisplayStyle`: `MessageSummary`<br/> - `nickname`: not set | <br/> - Push title: **You've got a new message**<br/> - Push content: **IM user ID of the message sender: message content** | ![img](/images/android/push/push_displayattribute_3.png)|

## Get push notification display attributes

You can call `asyncGetPushConfigsFromServer` to get push notification display attributes from the server. This method does not block the current thread. If the call succeeds, the SDK returns the push configurations through the `onSuccess` callback. If the call fails, the SDK returns the error code and error information through the `onError` callback.

```java
// Asynchronous method. Recommended for use on the main thread.
// The synchronous method is getPushConfigsFromServer. This method blocks the current thread. Do not call it on the main thread.
EMClient.getInstance().pushManager().asyncGetPushConfigsFromServer(
    new EMValueCallBack<EMPushConfigs>() {
        @Override
        public void onSuccess(EMPushConfigs pushConfigs) {
            // Get the push display nickname.
            String nickname = pushConfigs.getDisplayNickname();

            // Get the push notification display style.
            EMPushManager.DisplayStyle style = pushConfigs.getDisplayStyle();
        }

        @Override
        public void onError(int errorCode, String errorMessage) {
            // Failed to get push configurations.
        }
    }
);
```

## API list

| API name | Module/class | Description |
| :--- | :--- | :--- |
| [`asyncUpdatePushNickname`](#set-push-notification-display-attributes) | `EMPushManager` | Asynchronously sets the push display nickname of the current user. |
| [`asyncUpdatePushDisplayStyle`](#set-push-notification-display-attributes) | `EMPushManager` | Asynchronously sets the push notification display style. |
| [`updatePushNickname`](#set-push-notification-display-attributes) | `EMPushManager` | Synchronously sets the push display nickname of the current user. |
| [`updatePushDisplayStyle`](#set-push-notification-display-attributes) | `EMPushManager` | Synchronously sets the push notification display style. |
| [`getPushConfigsFromServer`](#get-push-notification-display-attributes) | `EMPushManager` | Synchronously gets push configurations from the server. |
| [`asyncGetPushConfigsFromServer`](#get-push-notification-display-attributes) | `EMPushManager` | Asynchronously gets push configurations from the server. |
| [`getDisplayNickname`](#get-push-notification-display-attributes) | `EMPushConfigs` | Gets the push display nickname. |
| [`getDisplayStyle`](#get-push-notification-display-attributes) | `EMPushConfigs` | Gets the push notification display style. |
