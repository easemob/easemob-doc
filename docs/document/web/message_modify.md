# 修改消息

对于单聊或群聊会话中已经发送成功的文本消息，消息接收方可以对消息内容进行修改，修改成功后会同步给会话中的接收方。

对于单聊会话，只有消息发送方才能对消息进行修改。对于群聊会话，群主和群管理员除了可以修改自己发送的消息，还可以修改普通群成员发送的消息，而普通群成员只能修改自己发送的消息。

:::notice
若使用该功能，需将 SDK 升级至 4.2.0 或以上版本。
:::

你可以调用 `modifyMessage` 方法修改已经发送成功的消息。一条消息默认最多可修改 10 次，若要提升修改次数，需联系商务。

消息修改后，消息的接收方会收到 `onModifiedMessage` 事件，该事件中会携带修改后的消息对象、最新一次修改消息的用户以及消息的最新修改时间。对于群聊会话，除了修改消息的用户，群组内的其他成员均会收到该事件。

示例代码如下：

```javascript

// 注册修改消息事件
conn.addEventHandler("modifiedMessage", {
    onModifiedMessage: message => {
        console.log('onModifiedMessage', message)
    },
});

const textMessage = WebIM.message.create({
    type: 'txt',
    msg: 'message content',
    to: 'username',
    chatType: 'singleChat',
});


conn.modifyMessage({ messageId: 'messageId', message: textMessage })
    .then((res) => {
      console.log(res.message, 'modifiedMessage')
    })
    .catch((e) => {
      console.log(e)
    });

```

你可以从`res.message` 中获取消息的最新修改时间（`operationTime`）、最新修改的操作者（`operatorId`）以及消息修改次数（`operationCount`）。



