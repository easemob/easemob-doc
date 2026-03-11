# 消息扩展

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```csharp
Message msg = Message.CreateTextSendMessage(toChatUsername, content);

// 增加自定义属性。
AttributeValue attr1 = AttributeValue.Of("value", AttributeValueType.STRING);
AttributeValue attr2 = AttributeValue.Of(true, AttributeValueType.BOOL);
msg.Attributes.Add("attribute1", attr1);
msg.Attributes.Add("attribute2", attr2);

// 发送消息。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
  onSuccess: () => {
    Debug.Log($"{msg.MsgId}发送成功");
  },
  onError:(code, desc) => {
    Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
  }
));
// 接收消息的时候获取扩展属性。
bool found = false;
string str = Message.GetAttributeValue<string>(msg.Attributes, "attribute1", out found);
if (found) {
  // 使用 str 变量。
}
found = false；
bool b = Message.GetAttributeValue<bool>(msg.Attributes, "attribute2", out found);
if (found) {
  // 使用 b 变量。
}
```