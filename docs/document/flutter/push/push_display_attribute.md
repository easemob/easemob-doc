# 设置和获取推送通知的显示属性

## 设置推送通知的显示属性

你可以分别调用 `updatePushNickname` 和 `updatePushDisplayStyle` 方法设置推送通知中显示的昵称（`nickname`）和通知显示样式（`DisplayStyle`），确定通知栏中的推送标题和推送内容。

```dart
try {
  EMClient.getInstance.pushManager.updatePushNickname('nickname');
} on EMError catch (e) {}
```

```dart
try {
  EMClient.getInstance.pushManager.updatePushDisplayStyle(DisplayStyle.Simple);
} on EMError catch (e) {}
```

若要在通知栏中显示消息内容，需要设置通知显示样式 `DisplayStyle`。该参数有如下两种设置：

| 参数值             | 描述                    |
| :--------------- | :---------------------- |
| （默认）`Simple`   | 不论 `nickname` 是否设置，对于推送任何类型的消息，通知栏采用默认显示设置，即推送标题为**您有一条新消息**，推送内容为**请点击查看**。 |
| `Summary` | `Summary`：显示消息内容。设置的昵称只在 `DisplayStyle` 为 `Summary` 时生效，在 `Simple` 时不生效。 |

下表以单聊文本消息为例介绍这显示属性的设置。

对于**群聊**，下表中的**消息发送方的推送昵称**和**消息发送方的 IM 用户 ID**显示为**群组 ID**。

| 参数设置      | 推送显示 | 图片    |
| :--------- | :----- |:------------- |
| <br/> - `DisplayStyle`：（默认）`Simple`<br/> - `nickname`：设置或不设置 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**请点击查看**  | ![img](/images/android/push/push_displayattribute_1.png)|
| <br/> - `DisplayStyle`：`Summary`<br/> - `nickname`：设置具体值 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的推送昵称：消息内容**  |![img](/images/android/push/push_displayattribute_2.png)  |
| <br/> - `DisplayStyle`：`Summary`<br/> - `nickname`：不设置    | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的 IM 用户 ID: 消息内容**  | ![img](/images/android/push/push_displayattribute_3.png)|

## 获取推送通知的显示属性

你可以调用 `fetchPushConfigsFromServer` 方法获取推送通知中的显示属性，如以下代码示例所示：

```dart
try {
  EMPushConfigs configs = await EMClient.getInstance.pushManager.fetchPushConfigsFromServer();
  // 获取推送显示昵称。
  String? pushNickname = configs.displayName;
  // 获取推送通知的显示样式。
  DisplayStyle pushDisplayStyle = configs.displayStyle;
} on EMError catch (e) {}
```