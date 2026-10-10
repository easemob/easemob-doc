# 设置推送通知的显示属性

你可以调用 API 设置通知栏中显示的推送昵称、推送标题和推送内容。

这种方式的优先级低于 [使用推送模板](push_template.html)。

## 设置推送昵称

调用 `PushManager#updatePushNickname` 设置当前用户在推送通知中显示的昵称。推送昵称与用户属性中的昵称不同；若业务侧更新了用户昵称，也应同步更新推送昵称，避免展示不一致。

```typescript
const pushManager = ChatClient.getInstance().pushManager();

if (pushManager) {
  pushManager.updatePushNickname('pushNickname')
    .then((): void => {
      // 设置成功。
    })
    .catch((error: ChatError): void => {
      // 设置失败，根据错误码和错误信息处理。
    });
}
```

## 设置推送标题和推送内容

调用 `PushManager#updatePushDisplayStyle` 设置推送通知的显示样式，如下代码示例所示：

```typescript
const displayStyle: PushDisplayStyle = PushDisplayStyle.SimpleBanner;
const pushManager = ChatClient.getInstance().pushManager();

if (pushManager) {
  pushManager.updatePushDisplayStyle(displayStyle)
    .then((): void => {
      // 设置成功。
    })
    .catch((error: ChatError): void => {
      // 设置失败，根据错误码和错误信息处理。
    });
}
```

若要在通知栏中显示消息内容，需要将通知显示样式 `PushDisplayStyle` 设置为 `MessageSummary`。`PushDisplayStyle` 是枚举类型，包含以下两种取值：

| 参数值 | 描述 |
| :--- | :--- |
| （默认）`SimpleBanner` | 无论是否设置推送昵称，对于任何类型的推送消息，通知栏均采用默认显示方式，即推送标题为 **您有一条新消息**，推送内容为 **请点击查看**。 |
| `MessageSummary` | 显示消息内容。设置的推送昵称仅在 `PushDisplayStyle` 为 `MessageSummary` 时生效，在 `SimpleBanner` 时不生效。 |

下表以**单聊文本消息**为例介绍显示属性的设置。

对于**群聊**，下表中的**消息发送方的推送昵称**和**消息发送方的 IM 用户 ID**显示为**群组 ID**。

| 参数设置 | 推送显示 | 图片 |
| :--- | :--- | :--- |
| <br/>- `PushDisplayStyle`：（默认）`SimpleBanner`<br/>- 推送昵称：设置或不设置 | <br/>- 推送标题：**您有一条新消息**<br/>- 推送内容：**请点击查看** | ![推送通知采用默认显示方式](/images/android/push/push_displayattribute_1.png) |
| <br/>- `PushDisplayStyle`：`MessageSummary`<br/>- 推送昵称：设置具体值 | <br/>- 推送标题：**您有一条新消息**<br/>- 推送内容：**消息发送方的推送昵称：消息内容** | ![推送通知显示发送方的推送昵称和消息内容](/images/android/push/push_displayattribute_2.png) |
| <br/>- `PushDisplayStyle`：`MessageSummary`<br/>- 推送昵称：不设置 | <br/>- 推送标题：**您有一条新消息**<br/>- 推送内容：**消息发送方的 IM 用户 ID：消息内容** | ![推送通知显示发送方的用户 ID 和消息内容](/images/android/push/push_displayattribute_3.png) |

若业务需要在客户端展示当前配置，请在调用 `PushManager#updatePushNickname` 或 `PushManager#updatePushDisplayStyle` 成功后自行保存相应配置。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`updatePushNickname`](#设置推送昵称) | `PushManager` | 设置当前用户的推送显示昵称。 |
| [`updatePushDisplayStyle`](#设置推送标题和推送内容) | `PushManager` | 设置推送通知的显示样式。 |
