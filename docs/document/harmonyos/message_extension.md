# 使用消息扩展字段

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```typescript
let message = ChatMessage.createTxtSendMessage(toChatUsername, content);
if (!message) {
    return;
}
// 增加自定义属性。
let attributes = new Map<string, MessageExtType>();
attributes.set("attribute1", "value");
attributes.set("attribute2", true);
attributes.set("attribute3", 123);
attributes.set("attribute4", {
  nickname: 'Nickname',
  avatarUrl: 'https://www.easemob.com/example.png',
  gender: Gender.MALE
} as UserInfo);
message.setExt(attributes);
ChatClient.getInstance().chatManager()?.sendMessage(message);
// 获取自定义属性
let exts = message.ext();
let attr1 = exts.get("attribute1") as string;
let attr2 = exts.get("attribute2") as boolean;
let attr3 = exts.get("attribute3") as boolean;
let attr4 = exts.get("attribute4") as UserInfo;
```

:::tip
1.6.0 版本 `ChatMessage.setExt` 方法支持 object 数据类型，用于设置 JSON 结构的扩展信息。
:::