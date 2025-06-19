# 定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::tip
1. 仅 SDK 4.1.7 及以上版本支持。
2. 定向消息不写入服务端会话列表，不计入服务端会话的未读消息数。
3. 群组定向消息的漫游功能默认关闭，使用前需联系商务开通。
4. 聊天室定向消息的漫游功能默认关闭，使用前需联系商务开通聊天室消息漫游和定向消息漫游功能。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置定向消息的接收方。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```javascript
// 发送定向文本消息。
function sendTextMessage() {
  let option = {
    // 消息类型。
    type: "txt",
    // 消息内容。
    msg: "message content",
    // 消息接收方所在群组或聊天室的 ID。
    to: "groupId",
    // 会话类型：群聊和聊天室分别为 `groupChat` 和 `chatRoom`。
    chatType: "groupChat",
    // 消息的接收方列表。最多可传 20 个接收方的用户 ID。若不设置该字段或传入数组类型之外的值，如字符串，则消息发送给群组或聊天室的所有成员。
    receiverList: ['uId1','uId2'],
  };
  // 创建文本消息。
  let msg = WebIM.message.create(option);
  // 调用 `send` 方法发送该文本消息。
    conn.send(msg).then((res)=>{
      console.log("Send message success",res);
    }).catch((e)=>{
      console.log("Send message fail",e);
    });
}
```

接收定向消息与接收普通消息的操作相同，详见 [各类消息的接收描述](message_receive.html)。