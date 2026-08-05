# 消息扩展

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型，例如，消息中需要携带被回复的消息内容或者是图文消息等场景。

```java
EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername);
// 增加自定义属性。
message.setAttribute("attribute1", "value");
message.setAttribute("attribute2", true);
// 接收消息的时候获取扩展属性。
EMClient.getInstance().chatManager().sendMessage(message);
// 获取自定义属性，第 2 个参数为没有此定义的属性时返回的默认值。
message.getStringAttribute("attribute1",null);
message.getBooleanAttribute("attribute2", false)
```