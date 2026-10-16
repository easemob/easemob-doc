# 设置推送显示属性

你可以调用 API 设置通知栏中显示的推送昵称、推送标题和推送内容。

这种方式的优先级低于 [使用推送模板](push_template.html)。

## 设置推送昵称

你可以调用 `updatePushNickname` 设置推送通知中显示的昵称，如以下代码示例所示：

```typescript
ChatClient.getInstance().pushManager()?.updatePushNickname(pushNickname).then(() => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
});
```

## 设置推送标题和推送内容

你也可以调用 `updatePushDisplayStyle` 设置推送通知栏的内容显示样式，如下代码示例所示：

```typescript
// 设置为简单样式。
const displayStyle = PushDisplayStyle.SimpleBanner;
ChatClient.getInstance().pushManager()?.updatePushDisplayStyle(displayStyle).then(() => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
})
```

| 参数设置      | 推送显示 | 图片    |
| :--------- | :----- |:------------- |
| <br/> - `PushDisplayStyle`：（默认）`SimpleBanner`<br/> - `nickname`：设置或不设置 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**请点击查看**  | ![img](/images/android/push/push_displayattribute_1.png)|
| <br/> - `PushDisplayStyle`：`MessageSummary`<br/> - `nickname`：设置具体值 | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的推送昵称：消息内容**  |![img](/images/android/push/push_displayattribute_2.png)  |
| <br/> - `PushDisplayStyle`：`MessageSummary`<br/> - `nickname`：不设置    | <br/> - 推送标题：**您有一条新消息**<br/> - 推送内容：**消息发送方的 IM 用户 ID: 消息内容**  | ![img](/images/android/push/push_displayattribute_3.png)|
