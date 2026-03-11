# 消息扩展

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```typescript
const msg = ChatMessage.createTextMessage(targetId, '文本消息', chatType);
msg.attributes = {
  key: "value",
  {
    key2: 100
  }
};
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```