# 修改消息

对于单聊或群组聊天会话中已经发送成功的文本消息，SDK 支持对这些消息的内容进行修改。消息内容修改流程如下：

1. 用户调用 SDK 的 API 修改一条消息。
2. 服务端存储的该条消息，修改成功后回调给 SDK。
3. SDK 修改客户端上的该条消息。成功后，SDK 将修改后的消息回调给用户。

修改消息没有时间限制，即只要这条消息仍在服务端存储就可以修改。消息修改后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）修改了消息，修改成功后该消息还可以在服务器上保存 180 天。

对于修改后的消息，消息体中除了内容变化，还新增了修改者的用户 ID、修改时间和修改次数属性。除消息体外，该消息的其他信息（例如，消息发送方、接收方和扩展属性）均不会发生变化。

- 对于单聊会话，只有消息发送方才能对消息进行修改。
- 对于群聊会话，普通群成员只能修改自己发送的消息。群主和群管理员除了可以修改自己发送的消息，还可以修改普通群成员发送的消息。这种情况下，消息的发送方不变，消息体中的修改者的用户 ID 属性为群主或群管理员的用户 ID。

:::notice
1. 若使用该功能，需将 SDK 升级至 1.2.0 或以上版本。
2. 聊天室会话不支持消息修改功能。
:::

你可以调用 `ChatManager#ModifyMessage` 方法修改已经发送成功的消息。一条消息默认最多可修改 10 次，若要提升修改次数，需联系商务。

示例代码如下：

```csharp
    TextBody tb = new TextBody("new content");
    SDKClient.Instance.ChatManager.ModifyMessage(msgId, tb, new ValueCallBack<Message>(
         onSuccess: (dmsg) =>
         {
         
         },
         onError: (code, desc) =>
         {
         
         }
    ));
```
消息修改后，消息的接收方会收到 `IChatManagerDelegate#OnMessageContentChanged` 事件，该事件中会携带修改后的消息对象、最新一次修改消息的用户以及消息的最新修改时间。对于群聊会话，除了修改消息的用户，群组内的其他成员均会收到该事件。

```csharp
// 继承并实现 `IChatManagerDelegate`。
public class ChatManagerDelegate : IChatManagerDelegate {

    public void OnMessageContentChanged(Message msg, string operatorId, long operationTime)
    {
        // operatorId、operationTime也可通过以下方式来获取,数据与上述行参保持一致
        // string id = msg.Body.OperatorId;
        // long time = msg.Body.OperationTime;
    }
  }

// 注册监听器。
ChatManagerDelegate adelegate = new ChatManagerDelegate();
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

// 不使用监听器时需要移除监听器。
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(adelegate);
```