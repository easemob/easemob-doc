# 使用消息扩展字段设置推送通知显示内容

创建推送消息时，你可以设置消息扩展字段自定义要显示的推送标题 `em_push_title` 和推送内容 `em_push_content`。

```java
// 这里以文本消息为例，附件等类型的消息设置方法相同。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.TXT);
EMTextMessageBody txtBody = new EMTextMessageBody("message content");
// 设置要发送用户的用户 ID。
message.setTo("toChatUsername");
// 设置自定义推送提示。
JSONObject extObject = new JSONObject();
try {
    extObject.put("em_push_title", "custom push title");
    extObject.put("em_push_content", "custom push content");
} catch (JSONException e) {
    e.printStackTrace();
}
// 将推送扩展设置到消息中。
message.setAttribute("em_apns_ext", extObject);
// 设置消息体。
message.addBody(txtBody);
// 设置消息回调。
message.setMessageStatusCallback(new CallBack() {...});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

| 参数              | 描述          |
| :---------------- | :----------- |
| `toChatUsername`  | 消息接收方 ID。                                                          |
| `em_apns_ext`     | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `em_push_title`   | 自定义字段 key，用于设置自定义的标题，该值为固定值，不可修改。           |
| `em_push_content` | 自定义字段 key，用于设置自定义的内容，该值为固定值，不可修改。           |