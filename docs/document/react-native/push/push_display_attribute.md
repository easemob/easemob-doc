# 设置和获取推送通知的显示属性

离线推送通知的显示属性包括通知栏中展示的推送昵称、推送通知标题和推送内容。

## 设置推送通知的显示属性

调用 `updatePushNickname` 方法设置推送通知栏中显示的昵称（`nickname`）。

```typescript
ChatClient.getInstance()
  .pushManager.updatePushNickname(nickname)
  .then(() => {
    console.log("Succeeded in updating the nickname.");
  })
  .catch((reason) => {
    console.log("Failed to update the nickname.", reason);
  });
```

调用 `updatePushDisplayStyle` 方法设置推送通知中推送标题和推送内容的显示样式（`displayStyle`），确定通知栏中的推送标题和推送内容。

若要在通知栏中显示消息内容，需要设置通知显示样式 `displayStyle`。该参数有如下两种设置：

- （默认）`Simple`：不论 `nickname` 是否设置，对于推送任何类型的消息，通知栏采用默认显示设置，即推送标题为“您有一条新消息”，推送内容为“请点击查看”。
- `Summary`：显示消息内容。设置的昵称只在 `displayStyle` 为 `Summary` 时生效，在 `Simple` 时不生效。

```typescript
ChatClient.getInstance()
  .pushManager.updatePushDisplayStyle(displayStyle)
  .then(() => {
    console.log("Succeeded in updating the display style.");
  })
  .catch((reason) => {
    console.log("Failed to update the display style.", reason);
  });
```

下表以单聊文本消息为例介绍这显示属性的设置。

:::tip
对于群聊，下表中的“消息发送方的推送昵称”和“消息发送方的 IM 用户 ID”显示为“群组 ID”。
:::

| 参数设置      | 推送显示 | 图片    |
| :--------- | :----- |:------------- |
| <ul><li>`displayStyle`：（默认）`Simple`</li><li>`nickname`：设置或不设置</li></ul>  | <ul><li>推送标题：“您有一条新消息”</li><li>推送内容：“请点击查看”</li></ul>   | ![img](/images/android/push/push_displayattribute_1.png) |
| <ul><li>`displayStyle`：`Summary`</li><li>`nickname`：设置具体值</li></ul>| <ul><li>推送标题：“您有一条新消息”</li><li>推送内容：“消息发送方的推送昵称：消息内容”</li></ul>      | ![img](/images/android/push/push_displayattribute_2.png) |
| <ul><li>`displayStyle`：`Summary`</li><li>`nickname`：不设置</li></ul>    | <ul><li>推送标题：“您有一条新消息”</li><li>推送内容：“消息发送方的 IM 用户 ID: 消息内容”</li></ul>       | ![img](/images/android/push/push_displayattribute_3.png)  |

## 获取推送通知的显示属性

你可以调用 `fetchPushOptionFromServer` 方法获取推送通知中的显示属性，如以下代码示例所示：

```typescript
ChatClient.getInstance()
  .pushManager.fetchPushOptionFromServer()
  .then(() => {
    console.log("Succeeded in getting the push configurations.");
  })
  .catch((reason) => {
    console.log("Failed to get the push configuration.", reason);
  });
```



