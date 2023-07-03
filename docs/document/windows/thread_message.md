# 管理子区消息

<Toc />

子区消息消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `IsThread` 标记。本文介绍环信即时通讯 IM windows SDK 如何发送、接收以及撤回子区消息。

## 技术原理

环信即时通讯 IM windows SDK 提供 `IChatManager`、`Message` 和 `IChatThreadManager` 类，用于管理子区消息，支持你通过调用 API 在项目中实现如下功能：

- 发送子区消息
- 接收子区消息
- 撤回子区消息
- 获取子区消息

消息收发流程如下：

1. 客户端从应用服务器获取 token。
2. 客户端 A 和 B 登录即时通讯。
3. 客户端 A 向客户端 B 发送消息。消息发送至即时通讯 IM 服务器，服务器将消息传递给客户端 B。对于子区消息，服务器投递给子区内其他每一个成员。客户端 B 收到消息后，SDK 触发事件。客户端 B 监听事件并获取消息。

![](@static/images/android/sendandreceivemsg.png)

子区创建和查看如下图：

![](@static/images/android/threads.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 1.0.6 以上版本 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 联系商务开通子区功能。

## 实现方法

本节介绍如何使用环信即时通讯 IM windows SDK 提供的 API 实现上述功能。

### 发送子区消息

发送子区消息和发送群组消息的方法基本一致，详情请参考[发送消息](message_send_receive.html#发送文本消息)。唯一不同的是，发送子区消息需要指定标记 `IsThread` 为 `true`。

示例代码如下：

```csharp
// 创建一条文本消息，`content` 为消息文字内容，`chatThreadId` 为子区 ID。
Message msg = Message.CreateTextSendMessage(chatThreadId, content);
// 设置消息类型，子区消息需要将 `ChatType` 设置为 `GroupChat`。
msg.MessageType = MessageType.Group
// 设置消息标记 `IsThread` 为 `true`。
mmsg.IsThread = true;
// 发送消息时可以设置 `CallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
    onSuccess: () => {
        Debug.Log($"SendTxtMessage success. msgid:{msg.MsgId}");
    },
    onProgress: (progress) => {
        Debug.Log($"SendTxtMessage progress :{progress.ToString()}");
    },
    onError: (code, desc) => {
        Debug.Log($"SendTxtMessage failed, code:{code}, desc:{desc}");
    }
));
```

### 接收子区消息

接收消息的具体逻辑，请参考 [接收消息](message_send_receive.html#接收消息)，此处只介绍子区消息和其他消息的区别。

子区有新增消息时，子区所属群组的所有成员收到 `IChatThreadManagerDelegate#OnUpdateMyThread` 回调，子区成员收到 `IChatManagerDelegate#OnMessagesReceived` 回调。

示例代码如下：

```csharp
//继承并实现 IChatManagerDelegate。
public class ChatManagerDelegate : IChatManagerDelegate {

    //实现 OnMessagesReceived 回调。
    public void OnMessagesReceived(List<Message> messages)
    {
      //收到消息，遍历消息列表，解析和显示。
    }
}

// 申请并注册监听。
ChatManagerDelegate adelegate = new ChatManagerDelegate();
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

// 移除监听。
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(adelegate);
```

### 撤回子区消息

接收消息的具体逻辑，请参考 [撤回消息](message_send_receive.html#撤回消息)，此处只介绍子区消息和其他消息的区别。

子区有消息撤回时，子区所属群组的所有成员收到 `IChatThreadManagerDelegate#OnUpdateMyThread` 回调，子区成员收到 `IChatManagerDelegate#OnMessagesRecalled` 回调。

示例代码如下：

```csharp
//继承并实现 IChatManagerDelegate。
public class ChatManagerDelegate : IChatManagerDelegate {

    //实现 OnMessagesRecalled 回调。
    public void OnMessagesRecalled(List<Message> messages)
    {
      //收到消息，遍历消息列表，解析和显示。
    }
}

//申请并注册监听。
ChatManagerDelegate adelegate = new ChatManagerDelegate();
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

//移除监听。
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(adelegate);
```

### 获取子区消息

从服务器还是本地数据库获取子区消息取决于你的生产环境。

你可以通过 `Conversation#IsThread()` 判断当前会话是否是子区会话。

#### 从服务器获取单个子区的消息（消息漫游）

调用 `FetchHistoryMessagesFromServer` 方法从服务器获取子区消息。从服务器获取子区消息与获取群组消息的唯一区别为前者需传入子区 ID，后者需传入群组 ID。

```csharp
SDKClient.Instance.ChatManager.FetchHistoryMessagesFromServer(threadId, ConversationType.Group, startMsgId, pageSize, MessageSearchDirection.DOWN, new ValueCallBack<CursorResult<Message>>(
          onSuccess: (result) =>
          {
              foreach (var msg in result.Data)
              {
                  //process every msg
              }
          },
          onError: (code, desc) =>
          {
          }
      ));
```

#### 获取本地单个子区的消息

调用 `EMChatManager#getAllConversations()` 会返回单聊和群聊的会话，不会返回子区会话，你可以通过调用以下方法从本地数据库中读取指定子区会话的消息：

```csharp
// 需要指定会话类型为 `ConversationType.Group`，且 `isChatThread` 设置为 `true`
Conversation conversation = SDKClient.Instance.ChatManager.GetConversation(chatThreadId, EMConversationType.GroupChat, createIfNotExists, isChatThread);
// 如需处理本地数据库中消息，用以下方法到数据库中获取，SDK 会将这些消息自动存入此会话
conversation.LoadMessages(startMsgId, count, direct, new ValueCallBack<List<Message>>(
    onSuccess: (list) => {
        Console.WriteLine($"LoadMessages found {list.Count} messages");
        foreach (var it in list)
        {
            Debug.Log($"message id: {it.MsgId}");
        }
    },
    onError: (code, desc) => {
        Debug.Log($"LoadMessages failed, code:{code}, desc:{desc}");
    }
));
```