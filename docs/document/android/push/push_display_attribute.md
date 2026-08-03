# 设置和获取推送通知的显示属性

## 设置推送通知的显示属性

调用 `asyncUpdatePushNickname` 方法设置当前用户在推送通知中显示的昵称。推送昵称与用户属性中的昵称不同；若业务侧更新了用户昵称，也应同步更新推送昵称，避免展示不一致。

```java
// 异步方法。
// 同步方法为 updatePushNickname。该方法会阻塞当前线程，请勿在主线程中调用。
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

调用 `asyncUpdatePushDisplayStyle` 设置推送通知的显示样式，如下代码示例所示：

```java
// 异步方法。
// 同步方法为 updatePushDisplayStyle。该方法会阻塞当前线程，请勿在主线程中调用。
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

若要在通知栏中显示消息内容，需要设置通知显示样式 `DisplayStyle`。`DisplayStyle` 是枚举类型，有如下两种设置：

| 参数值             | 描述                    |
| :--------------- | :---------------------- |
| （默认）`SimpleBanner`   | 不论 `nickname` 是否设置，对于推送任何类型的消息，通知栏采用默认显示设置，即推送标题为**您有一条新消息**，推送内容为**请点击查看**。 |
| `MessageSummary` | `MessageSummary`：显示消息内容。设置的昵称只在 `DisplayStyle` 为 `MessageSummary` 时生效，在 `SimpleBanner` 时不生效。 |

下表以**单聊文本消息**为例介绍显示属性的设置。

对于**群聊**，下表中的**消息发送方的推送昵称**和**消息发送方的 IM 用户 ID**显示为**群组 ID**。

| 参数设置      | 推送显示 | 图片    |
| :--------- | :----- |:------------- |
| <br/> - `DisplayStyle`：（默认）`SimpleBanner`<br/> - `nickname`：设置或不设置 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**请点击查看**  | ![img](/images/android/push/push_displayattribute_1.png)|
| <br/> - `DisplayStyle`：`MessageSummary`<br/> - `nickname`：设置具体值 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的推送昵称：消息内容**  |![img](/images/android/push/push_displayattribute_2.png)  |
| <br/> - `DisplayStyle`：`MessageSummary`<br/> - `nickname`：不设置    | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的 IM 用户 ID: 消息内容**  | ![img](/images/android/push/push_displayattribute_3.png)|

## 获取推送通知的显示属性

你可以调用 `asyncGetPushConfigsFromServer` 从服务器获取推送通知的显示属性。该方法不会阻塞当前线程。获取成功时，SDK 通过 `onSuccess` 回调返回推送配置；获取失败时，通过 `onError` 回调返回错误码和错误信息。

```java
// 异步方法。建议在主线程中使用。
// 同步方法为 getPushConfigsFromServer。该方法会阻塞当前线程，请勿在主线程中调用。
EMClient.getInstance().pushManager().asyncGetPushConfigsFromServer(
    new EMValueCallBack<EMPushConfigs>() {
        @Override
        public void onSuccess(EMPushConfigs pushConfigs) {
            // 获取推送显示昵称。
            String nickname = pushConfigs.getDisplayNickname();

            // 获取推送通知的显示样式。
            EMPushManager.DisplayStyle style = pushConfigs.getDisplayStyle();
        }

        @Override
        public void onError(int errorCode, String errorMessage) {
            // 获取推送配置失败。
        }
    }
);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncUpdatePushNickname`](#设置推送通知的显示属性) | `EMPushManager` | 异步设置当前用户的推送显示昵称。 |
| [`asyncUpdatePushDisplayStyle`](#设置推送通知的显示属性) | `EMPushManager` | 异步设置推送通知显示样式。 |
| [`updatePushNickname`](#设置推送通知的显示属性) | `EMPushManager` | 同步设置当前用户的推送显示昵称。 |
| [`updatePushDisplayStyle`](#设置推送通知的显示属性) | `EMPushManager` | 同步设置推送通知显示样式。 |
| [`getPushConfigsFromServer`](#获取推送通知的显示属性) | `EMPushManager` | 同步从服务器获取推送配置。 |
| [`asyncGetPushConfigsFromServer`](#获取推送通知的显示属性) | `EMPushManager` | 异步从服务器获取推送配置。 |
| [`getDisplayNickname`](#获取推送通知的显示属性) | `EMPushConfigs` | 获取推送显示昵称。 |
| [`getDisplayStyle`](#获取推送通知的显示属性) | `EMPushConfigs` | 获取推送通知显示样式。 |
