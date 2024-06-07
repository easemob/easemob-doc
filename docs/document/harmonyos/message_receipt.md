# 消息回执

<Toc />

单聊会话支持消息送达回执、会话已读回执和消息已读回执，发送方发送消息后可及时了解接收方是否及时收到并阅读了信息，也可以了解整个会话是否已读。

群聊会话只支持消息已读回执。群成员在发送消息时，可以设置该消息是否需要已读回执。仅专业版及以上版本支持群消息已读回执功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。

:::tip
仅单聊消息支持送达回执，群聊消息不支持。
:::

本文介绍如何使用环信即时通讯 IM HarmonyOS SDK 实现单聊和群聊的消息回执功能。

## 技术原理

使用环信即时通讯 IM SDK 可以实现消息的送达回执与已读回执，核心方法如下：

- `ChatOptions#setRequireDeliveryAck` 开启送达回执；
- `ChatManager#ackConversationRead` 发出指定会话的已读回执；
- `ChatManager#ackMessageRead` 发出指定消息的已读回执；
- `ChatManager#ackGroupMessageRead` 发出群组消息的已读回执。

送达和已读回执逻辑分别如下：

单聊消息送达回执：

1. 消息发送方在发送消息前通过 `ChatOptions.setRequireDeliveryAck` 开启送达回执功能；
2. 消息接收方收到消息后，SDK 自动向发送方触发送达回执；
3. 消息发送方通过监听 `OnMessageDelivered` 回调接收消息送达回执。

已读回执：

- 单聊会话及消息已读回执
  1. 调用 `ChatOptions.setRequireReadAck` 设置需要发送已读回执，传 `true`；
  2. 消息接收方收到或阅读消息后，调用 API `ackConversationRead` 或 `ackMessageRead` 发送会话或消息已读回执；
  3. 消息发送方通过监听 `ConversationListener#OnConversationRead` 或 `ChatMessageListener#OnMessageRead` 回调接收会话或消息已读回执。
- 群聊只支持消息已读回执：
  1. 你可以通过设置 `ChatMessage.isNeedGroupAck` 为 `true` 开启群聊消息已读回执功能；
  2. 消息接收方收到或阅读消息后通过 `ackGroupMessageRead` 发送群组消息的已读回执。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 群消息已读回执功能仅在环信 IM 专业版及以上版本支持该功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。

## 实现方法

### 消息送达回执

若在消息送达时收到通知，你可以打开消息送达开关，这样在消息到达对方设备时你可以收到通知。

```TypeScript
// 设置是否需要接收方送达确认，默认 `false` 即不需要。
options.setRequireDeliveryAck(false);
```

`onMessageDelivered` 回调是对方收到消息时的通知，你可以在收到该通知时，显示消息的送达状态。

```TypeScript
let msgListener: ChatMessageListener = {
    onMessageReceived: (messages: ChatMessage[]): void => {
        // 收到消息
    },
    onMessageDelivered: (messages: ChatMessage[]): void => {
        // 收到已送达回执
    }
}
ChatClient.getInstance().chatManager()?.addMessageListener(msgListener);

// 记得在不需要的时候移除 listener。
ChatClient.getInstance().chatManager()?.removeMessageListener(msgListener);
```

### 消息已读回执

消息已读回执用于告知单聊或群聊中的用户接收方已阅读其发送的消息。为降低消息已读回执方法的调用次数，SDK 还支持在单聊中使用会话已读回执功能，用于获知接收方是否阅读了会话中的未读消息。

#### 单聊

单聊既支持消息已读回执，也支持会话已读回执。我们建议你按照如下逻辑结合使用两种回执，减少发送消息已读回执数量。

- 聊天页面未打开时，若有未读消息，进入聊天页面，发送会话已读回执；
- 聊天页面打开时，若收到消息，发送消息已读回执。

第一步是在设置中打开已读回执开关：

```TypeScript
// 设置是否需要消息已读回执，设为 `true`。
options.setRequireReadAck(true);
```

##### 会话已读回执

 参考以下步骤在单聊中实现会话已读回执。

 1. 接收方发送会话已读回执。

   消息接收方进入会话页面，查看会话中是否有未读消息。若有，发送会话已读回执，没有则不再发送。

```TypeScript
ChatClient.getInstance().chatManager()?.ackConversationRead(conversationId);
```

2. 消息发送方监听会话已读回执的回调。

```TypeScript
let conversationListener: ConversationListener = {
  onConversationRead: (from: string, to: string): void => {
    // 会话已读回调
  }
}
ChatClient.getInstance().chatManager()?.addConversationListener(conversationListener);
```

> 同一用户 ID 登录多设备的情况下，用户在一台设备上发送会话已读回执，服务器会将会话的未读消息数置为 `0`，同时其他设备会收到 `OnConversationRead` 回调。

##### 消息已读回执

单聊消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。 

参考如下步骤在单聊中实现消息已读回执。

 1. 接收方发送已读回执消息。

   消息接收方进入会话时，发送会话已读回执。

```TypeScript
ChatClient.getInstance().chatManager()?.ackMessageRead(messageId);
```

在会话页面，接收到消息时，根据消息类型发送消息已读回执，如下所示：

```TypeScript
let msgListener: ChatMessageListener = {
    onMessageReceived: (messages: ChatMessage[]): void => {
        // 收到消息
        messages.forEach(message => {
            this.sendReadAck(message);   
        })
    }
}
ChatClient.getInstance().chatManager()?.addMessageListener(msgListener);

private sendReadAck(message: ChatMessage) {
  if (message.getDirection() === MessageDirection.RECEIVE 
    && !message.isReceiverRead() 
    && message.getChatType() === ChatType.Chat) {
    
    ChatClient.getInstance().chatManager()?.ackMessageRead(message.getFrom(), message.getMsgId());

  }
}
```

2. 消息发送方监听消息已读回调。

你可以调用接口监听指定消息是否已读，示例代码如下：

```TypeScript
let msgListener: ChatMessageListener = {
    ......
    onMessageRead: (messages: ChatMessage[]): void => {
        // 收到消息已读
    }
    ......
}
ChatClient.getInstance().chatManager()?.addMessageListener(msgListener);
```

#### 群聊

对于群聊，群成员发送消息时，可以设置该消息是否需要已读回执。若需要，每个群成员在阅读消息后，SDK 均会发送已读回执，即阅读该消息的群成员数量即为已读回执的数量。

群消息已读回执特性的使用限制如下表所示：

| 使用限制| 默认 | 描述 | 
| :--------- | :----- | :------- | 
| 功能开通   | 关闭   | 仅专业版及以上版本支持群消息已读回执功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。    | 
| 使用权限  | 群组管理员和群主    | 默认情况下，群主和群组管理员有权限。<br/>可以联系商务为普通群成员开放权限。   | 
| 已读回执有效期    | 3 天    | 群聊已读回执的有效期为 3 天，即群组中的消息发送时间超过 3 天，服务器不记录阅读该条消息的群组成员，也不会发送已读回执。   | 
| 群规模    |  500 人   | 该特性最大支持 500 人的群组。也就是说，群组中每条消息最多可返回 500 条已读回执，若超过该上限，最新的已读回执记录会覆盖最早的记录。  | 
| 群消息条数上限    | 500 条 | 单个群组每天最多支持 500 条消息要求已读回执。| 

你可以按以下步骤实现群消息已读回执特性：

1. 群成员发送消息时若需已读回执，需设置 `ChatMessage` 的方法 `setIsNeedGroupAck()` 为 `true`。

```TypeScript
let message = ChatMessage.createTextSendMessage(to, content);
if (!message) {
    return;
}
message.setChatType(ChatType.GroupChat);
message.setIsNeedGroupAck(true);
```

2. 消息接收方发送群组消息的已读回执。

```TypeScript
if (message.isNeedGroupAck() && !message.isUnread()) {
  ChatClient.getInstance().chatManager()?.ackGroupMessageRead(message, ext);
  message.setUnread(false);
}
```

3. 消息发送方监听群组消息已读回调。

群消息已读回调在消息监听类 `ChatMessageListener` 中。

```TypeScript
// 接收到群组消息体的已读回执, 消息的接收方已经阅读此消息。
onGroupMessageRead?: (groupReadAcks: Array<GroupReadAck>) => void;
```

接收到群组消息已读回执后，发出消息的属性 `ChatMessage#groupAckCount` 会有相应变化；

4. 消息发送方获取群组消息的已读回执详情。

如果想实现群消息已读回执的列表显示，可以通过下列接口获取到已读回执的详情。

```TypeScript
ChatClient.getInstance().chatManager()?.fetchGroupReadAcks(messageId, pageSize, startAckId).then((result) => {
  // success logic
})
```