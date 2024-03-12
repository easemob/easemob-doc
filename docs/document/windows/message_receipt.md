# 实现消息回执

<Toc />

单聊会话支持消息送达回执、会话已读回执和消息已读回执，发送方发送消息后可及时了解接收方是否及时收到并阅读了信息，也可以了解整个会话是否已读。

群聊会话只支持消息已读回执。群成员在发送消息时，可以设置该消息是否需要已读回执。仅专业版及以上版本支持群消息已读回执功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通。

本文介绍如何使用环信即时通讯 IM Windows SDK 实现单聊和群聊的消息回执功能。

## 技术原理

环信即时通讯 IM Windows SDK 通过 `IChatManager` 类提供消息的送达回执和已读回执功能，包含的核心方法如下：

- `Options.RequireDeliveryAck` 开启送达回执；
- `IChatManager.SendConversationReadAck` 发出指定会话的已读回执；
- `IChatManager.SendMessageReadAck` 发出指定单聊消息的已读回执；
- `SendReadAckForGroupMessage` 发送群组消息的已读回执。

实现消息送达和已读回执的逻辑分别如下：

单聊消息送达回执：

1. 消息发送方在发送消息前通过 `ChatOptions.RequireDeliveryAck` 开启送达回执功能；
2. 消息接收方收到消息后，SDK 自动向发送方触发送达回执；
3. 消息发送方通过监听 `OnMessageDelivered` 回调接收消息送达回执。

已读回执：

- 单聊会话及消息已读回执
  1. 设置 `RequireAck` 为 `true`；
  2. 消息接收方收到消息后，调用 API `SendConversationReadAck` 或 `SendMessageReadAck` 发送会话或消息已读回执；
  3. 消息发送方通过监听 `OnConversationRead` 或 `OnMessageRead` 回调接收会话或消息已读回执。
- 群聊只支持消息已读回执：
  1. 你可以通过设置 `isNeedGroupAck` 开启群聊消息已读回执功能；
  2. 消息接收方收到消息后通过 `SendReadAckForGroupMessage` 发送群组消息的已读回执。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 群消息已读回执功能仅在环信 IM 专业版及以上版本支持该功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通。

## 实现方法

### 消息送达回执

1. 发送方若要接收消息送达回执，你需要将 `Options` 中的 `RequireDeliveryAck` 设为 `true`。当接收方收到消息后，SDK 底层会自动进行消息送达回执。

```csharp
// 设置是否需要消息送达回执，设为 `true`。
Options.RequireDeliveryAck = true;
```

2. 发送方监听事件 `OnMessagesDelivered` 回调，收到接收方的送达回执。

```csharp
// 继承并实现 `IChatManagerDelegate`。
public class ChatManagerDelegate : IChatManagerDelegate {

    // 收到已送达回执。
    public void OnMessagesDelivered(List<Message> messages)
      {
      }
  }

// 注册监听器。
ChatManagerDelegate adelegate = new ChatManagerDelegate();
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

// 移除监听器。
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(adelegate);
```

### 消息和会话的已读回执

消息已读回执用于告知单聊或群聊中的用户接收方已阅读其发送的消息。为降低消息已读回执方法的调用次数，SDK 还支持在单聊中使用会话已读回执功能，用于获知接收方是否阅读了会话中的未读消息。

#### 单聊

单聊既支持消息已读回执，也支持会话已读回执。我们建议你按照如下逻辑结合使用两种回执，减少发送消息已读回执数量。

- 聊天页面未打开时，若有未读消息，进入聊天页面，发送会话已读回执；
- 聊天页面打开时，若收到消息，发送消息已读回执。

第一步是在设置中打开已读回执开关：

```csharp
// 设置是否需要消息已读回执，设为 `true`。
Options.RequireReadAck = true;
```

##### 会话已读回执

参考以下步骤在单聊中实现会话已读回执。

1. 接收方发送会话已读回执。

消息接收方进入会话页面，查看会话中是否有未读消息。若有，发送会话已读回执，没有则不再发送。

```csharp
SDKClient.Instance.ChatManager.SendConversationReadAck(conversationId, new CallBack(
  onSuccess: () => {

  },
  onError:(code, desc) => {

  }
));
```

2. 消息发送方监听会话已读回执的回调。

```csharp
// 继承并实现 `IChatManagerDelegate`。
public class ChatManagerDelegate : IChatManagerDelegate {
    // 收到已读回执。`from` 表示发送该会话已读回执的消息接收方，`to` 表示收到该会话已读回执的消息发送方。
    public void OnConversationRead(string from, string to)
    {
    }
}

// 注册监听器。
ChatManagerDelegate adelegate = new ChatManagerDelegate()
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

// 移除监听器。
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(adelegate);
```

同一用户 ID 登录多设备的情况下，用户在一台设备上发送会话已读回执，服务器会将会话的未读消息数置为 `0`，同时其他设备会收到 `OnConversationRead` 回调。

##### 消息已读回执

单聊消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。 

参考如下步骤在单聊中实现消息已读回执。

1. 接收方发送已读回执消息。

消息接收方进入会话时，发送会话已读回执。

```csharp
SDKClient.Instance.ChatManager.SendConversationReadAck(conversationId, new CallBack(
  onSuccess: () => {

  },
  onError:(code, desc) => {

  }
));
```

2.在会话页面，接收到消息时，根据消息类型发送消息已读回执，如下所示：

```csharp
// 继承并实现 `IChatManagerDelegate`。
public class ChatManagerDelegate : IChatManagerDelegate {

    // 收到已送达回执。
    public void OnMessageReceived(List<Message> messages)
    {
      ......
      sendReadAck(message);
      ......
    }
}

// 注册监听器。
ChatManagerDelegate adelegate = new ChatManagerDelegate()
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);


// 发送已读回执。
public void sendReadAck(Message message) {

    // 这里是接收的消息，未发送过已读回执且是单聊。
    if(message.Direction == MessageDirection.RECEIVE
    && !message.HasReadAck
    && message.MessageType == MessageType.Chat) {

        MessageBodyType type = message.Body.Type;

        // 视频、语音及文件需要点击后再发送，可根据需求进行调整。
        if(type == MessageBodyType.VIDEO || type == MessageBodyType.VOICE || type == MessageBodyType.FILE) {
            return;
        }

        SDKClient.Instance.ChatManager.SendMessageReadAck(message.MsgId, new CallBack(
          onSuccess: () => {

          },
          onError: (code, desc) => {

          }
        );
    }
}
```

3. 消息发送方监听消息已读回调。

你可以调用接口监听指定消息是否已读，示例代码如下：

```csharp
// 继承并实现 `IChatManagerDelegate`。
public class ChatManagerDelegate : IChatManagerDelegate {

    // 收到消息已读回执。
    public void OnMessagesRead(string from, string to)
    {
    }
}
// 注册监听器。
ChatManagerDelegate adelegate = new ChatManagerDelegate()
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);

// 移除监听器。
SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(adelegate);
```

#### 群聊

对于群聊，群成员发送消息时，可以设置该消息是否需要已读回执。若需要，每个群成员在阅读消息后，SDK 均会发送已读回执，即阅读该消息的群成员数量即为已读回执的数量。

群聊已读回执的有效期为 3 天，即群组中的消息发送时间超过 3 天，服务器不记录阅读该条消息的群组成员，也不会发送已读回执。

仅专业版及以上版本支持群消息已读回执功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通。

1. 群成员发送消息时若需已读回执，需设置 `Message` 的 `IsNeedGroupAck` 为 `true`。

```csharp
Message msg = Message.CreateTextSendMessage("to", "hello world");
msg.IsNeedGroupAck = true;
```

2. 消息接收方发送群组消息的已读回执。

```csharp
void SendReadAckForGroupMessage(string messageId, string ackContent)
{
    SDKClient.Instance.ChatManager.SendReadAckForGroupMessage(messageId, ackContent，callback: new CallBack(
        onSuccess: () =>
        {

            },
            onError: (code, desc) =>
            {

            }
        ));
    }
```

3. 消息发送方监听群组消息已读回调。

群组消息已读回调在消息监听类 `IChatManagerDelegate` 中实现。

```csharp
// 继承并实现 `IChatManagerDelegate`。
public class ChatManagerDelegate : IChatManagerDelegate {

    // 收到群组消息的已读回执, 表明消息的接收方已阅读此消息。
    public void OnGroupMessageRead(List<GroupReadAck> list)
    {

    }
}

// 注册监听器。
ChatManagerDelegate adelegate = new ChatManagerDelegate()
SDKClient.Instance.ChatManager.AddChatManagerDelegate(adelegate);
```

4. 消息发送方获取群组消息的已读回执详情。

你可以调用 `FetchGroupReadAcks` 获取群组消息的已读回执的详情，示例代码如下：

```csharp
// startAckId：查询起始的已读回执 ID。首次调用为空，SDK 从最新的已读回执开始按服务器接收回执时间的逆序获取。后续调用从 CursorResult 中的 cursor 获取。
// pageSize：每页获取群消息已读回执的条数。
SDKClient.Instance.ChatManager.FetchGroupReadAcks(messageId, groupId, startAckId, pageSize, new ValueCallBack<List<GroupReadAck>>(
    onSuccess: (list) =>
    {
        // 页面刷新等操作。
    },
    onError: (code, desc) =>
    {
    }
));
```
