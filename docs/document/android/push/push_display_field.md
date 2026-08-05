# 使用消息扩展字段设置推送通知显示内容

发送消息时，可以通过固定消息扩展字段 `em_push_ext` 设置自定义推送展示内容。该字段的值为 `JSONObject`，其中使用 `title` 和 `content` 分别设置推送标题和推送内容。

```java
// 这里以文本消息为例，附件等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
// 单聊时设置对端用户 ID。
message.setTo("toChatUsername");
// 设置自定义推送提示。
JSONObject extObject = new JSONObject();
try {
    extObject.put("title", "custom push title");
    extObject.put("content", "custom push content");
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中。
message.setAttribute("em_push_ext", extObject);
// 设置消息体。
message.addBody(txtBody);
// 设置消息发送结果回调。
message.setMessageStatusCallback(new EMCallBack() {
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
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

| 参数 | 描述 |
| :--- | :--- |
| `toChatUsername` | 单聊消息接收方的用户 ID。群聊或聊天室场景应设置对应的群组或聊天室 ID，并设置消息会话类型。 |
| `em_push_ext` | 用于自定义推送展示内容的固定消息扩展字段，值为 `JSONObject`。 |
| `title` | `em_push_ext` 中用于设置自定义推送标题的固定 JSON Key。 |
| `content` | `em_push_ext` 中用于设置自定义推送内容的固定 JSON Key。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createSendMessage`](#使用消息扩展字段设置推送通知显示内容) | `EMMessage` | 创建指定类型的消息。 |
| [`addBody`](#使用消息扩展字段设置推送通知显示内容) | `EMMessage` | 设置消息体。 |
| [`sendMessage`](#使用消息扩展字段设置推送通知显示内容) | `EMChatManager` | 发送消息。 |
