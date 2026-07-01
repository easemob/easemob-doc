# 管理消息话题中的消息

<Toc />

消息话题中的消息消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `isChatThread` 标记。使用消息话题功能前，你需要联系商务开通。

本文介绍环信即时通讯 IM SDK 如何发送、接收以及撤回消息话题中的消息。

## 技术原理

环信即时通讯 IM SDK 支持你通过调用 API 在项目中用于管理消息话题中的消息，包括发送、接收、撤回和获取消息话题中的消息。

消息收发流程如下：

客户端 A 向客户端 B 发送消息。消息发送至即时通讯 IM 服务器，服务器将消息传递给客户端 B。对于消息话题中的消息，服务器投递给消息话题内其他每一个成员。客户端 B 收到消息后，SDK 触发事件。客户端 B 监听事件并获取消息。

消息话题创建和查看如下图：

![img](/images/web/web_group_chat_chreat_new_thread_step_01.png)

![img](/images/web/web_group_chat_new_thread_created.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 4.0.7 及以上版本 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解消息话题和消息话题成员数量限制，详见 [使用限制](/product/limitation.html)。
- 已联系商务开通消息话题功能。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 发送消息话题中的消息

发送消息话题中的消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send.html)。唯一不同的是，发送消息话题中的消息需要指定标记 `isChatThread` 为 `true`。

单设备登录时，消息话题所属群组的所有成员会收到 `onChatThreadChange` 回调。

示例代码如下：

```javascript
// 在消息话题内发送文本消息
function sendTextMessage() {
    let option = {
        // 会话类型，设置为群聊。
        chatType: 'groupChat',  
        // 消息类型。
        type: 'txt',   
        // 消息接收方（消息话题 ID)。
        to: 'chatThreadId',     
        // 消息内容。
        msg: 'message content'  
        // 是否为消息话题中的消息。
        isChatThread: 'true',   
    }
    let msg = WebIM.message.create(option); 
    conn.send(msg).then(() => {
        console.log('send text message success');  
    }).catch((e) => {
        console.log("send text message error");  
    })
};
```

### 接收消息话题中的消息

可以通过 `addEventHandler` 注册监听器接收各类消息的回调，详情参考 [接收消息](message_receive.html)。

示例代码如下：

```javascript
// 监听收到的文本消息
conn.addEventHandler('THREADMESSAGE',{
  onTextMessage:(message) => {
    if(message.chatThread && JSON.stringify(message.chatThread)!=='{}'){
      console.log(message)
        // 接收到消息话题中的消息，添加处理逻辑。
      }
    },
});
```

### 撤回消息话题中的消息

撤回消息话题中的消息和撤回群组消息的方法基本一致，详情请参考 [撤回消息](message_recall.html)。唯一不同的是，撤回消息话题中的消息需要指定标记 `isChatThread` 为 `true`。

消息话题成员可以设置消息监听回调 `onRecallMessage` 对消息话题中的消息的撤回进行监听。

示例代码如下：

```javascript
let option = {
  // 设置要撤回消息的 ID。
  mid: 'msgId',
  // 设置消息接收方（消息话题 ID)。
  to: 'chatThreadId',
  // 设置会话类型，单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  chatType: 'groupChat'
  // 设置是否为消息话题中的消息。
  isChatThread: 'true'
};
conn.recallMessage(option).then((res) => {
  console.log('success', res)
}).catch((error) => {
  // 消息撤回失败 (超过 2 分钟)。
  console.log('fail', error)
})

// 监听要撤回的消息：
conn.addEventHandler('MESSAGES',{
   onRecallMessage: => (msg) {
       // 接收到消息话题中的消息被撤回，添加处理逻辑。
       console.log('撤回成功'，msg) 
   }, 
})
```

### 从服务器获取单个消息话题的消息 (消息漫游)

调用 `getHistoryMessages` 方法从服务器获取消息话题中的消息。从服务器获取消息话题中的消息与获取群组消息的唯一区别为前者需传入消息话题 ID，后者需传入群组 ID。

```javascript
let options = {
  // 消息话题 ID。
  targetId: "threadId",
  // 每页期望获取的消息条数。取值范围为 [1,50]，默认值为 20。
  pageSize: 20,
  // 查询的起始消息 ID。若该参数设置为 `-1`、`null` 或空字符串，从最新消息开始。后续调用传入上一次查询结果的游标 res.data.cursor，若 cursor 的值为空字符串（''），表示当前为最后一页数据。
  cursor: -1,
  // 会话类型：消息话题为 "groupChat"。
  chatType: "groupChat",
  // 消息搜索方向：（默认）`up`：按服务器收到消息的时间的逆序获取；`down`：按服务器收到消息的时间的正序获取。
  searchDirection: "up",
};
conn
  .getHistoryMessages(options)
  .then((res) => {
    // 成功获取历史消息。
    console.log(res);
  })
  .catch((e) => {
    // 获取失败。
  });
```