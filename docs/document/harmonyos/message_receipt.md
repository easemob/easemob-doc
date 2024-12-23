# 实现消息回执

<Toc />

**单聊会话支持消息送达回执和消息已读回执**，发送方发送消息后可及时了解接收方是否及时收到并阅读了消息。

**群聊会话只支持消息已读回执，不支持送达回执**。群成员在发送消息时，可以设置该消息是否需要已读回执。要使用该功能，你需要[在环信即时通讯云控制台上开通该功能](/product/enable_and_configure_IM.html#设置群消息已读回执)，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。

消息送达回执和已读回执的效果示例，如下图所示：

![img](/images/android/message_receipt.png)

## 技术原理

使用环信即时通讯 IM HarmonyOS SDK 可以实现消息的送达回执与已读回执。

- 单聊消息送达回执的逻辑如下：

  1. 你可以通过设置 `ChatOptions.setRequireDeliveryAck` 为 `true` 开启送达回执功能。
  2. 消息接收方收到消息后，SDK 自动向发送方触发送达回执。
  3. 消息发送方通过监听 `ChatMessageListener#onMessageDelivered` 回调接收消息送达回执。

- 单聊消息已读回执的逻辑如下：

  1. 你可以通过设置 `ChatOptions.setRequireReadAck` 为 `true` 开启已读回执功能。
  2. 消息接收方收到消息后，调用 `ChatManager#ackMessageRead` 方法发送消息已读回执。
  3. 消息发送方通过监听 `ChatMessageListener#onMessageRead` 回调接收消息已读回执。

- 群聊消息已读回执的逻辑如下：

  1. 你可以通过设置 `ChatMessage.isNeedGroupAck` 为 `true` 开启消息已读回执功能。
  2. 发送方在群组中发送消息时设置 `EMMessage#setIsNeedGroupAck` 为 `true` 要求接收方返回消息已读回执。
  3. 接收方收到或阅读消息后通过 `ChatManager#ackGroupMessageRead` 方法发送群组消息的已读回执。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 要使用群消息已读回执功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。
  
## 实现方法

### 单聊消息送达回执

1. 开启消息送达功能，即 SDK 初始化时将 `ChatOptions.setRequireDeliveryAck` 设置为 `true`。

```typescript
// 设置是否需要接收方送达确认，默认 `false` 即不需要。
options.setRequireDeliveryAck(true);
```

2. 接收方收到消息后，SDK 自动向发送方触发送达回执。

3. 发送方监听 `ChatMessageListener#onMessageDelivered` 事件，收到接收方的送达回执。你可以在收到该通知时，显示消息的送达状态。

```typescript
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

### 单聊消息已读回执

单聊既支持单条消息已读回执，也支持[会话已读回执](conversation_receipt.html)。我们建议你结合使用这两种回执，见实现步骤的描述。

单聊消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。 

参考如下步骤在单聊中实现消息已读回执。

1. App 开启已读回执功能，即 SDK 初始化时将 `ChatOptions.setRequireReadAck` 设置为 `true`。
```typescript
// 设置是否需要接收方已读确认,默认为true
options.setRequireReadAck(true);
```

1. 接收方发送消息已读回执。

- 聊天页面打开时，若收到消息，发送单条消息已读回执。
  
```typescript
ChatClient.getInstance().chatManager()?.ackConversationRead(conversationId);
```

- 接收方在会话页面，接收到消息时，再根据消息类型发送单个消息已读回执。
    
  聊天页面未打开时，若有未读消息，进入聊天页面，发送会话已读回执。这种方式可避免发送多个消息已读回执。

```typescript
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
  // 这里是接收的消息，未发送过已读回执且是单聊。
  if (message.getDirection() === MessageDirection.RECEIVE 
    && !message.isReceiverRead() 
    && message.getChatType() === ChatType.Chat) {
    
    ChatClient.getInstance().chatManager()?.ackMessageRead(message.getFrom(), message.getMsgId());

  }
}
```

3. 消息发送方监听消息已读回调。

消息发送方可以通过 `ChatMessageListener.onMessageRead` 事件监听指定消息是否已读，示例代码如下：

```typescript
let msgListener: ChatMessageListener = {
    ......
    onMessageRead: (messages: ChatMessage[]): void => {
        // 收到消息已读
    }
    ......
}
ChatClient.getInstance().chatManager()?.addMessageListener(msgListener);
```

### 群聊消息已读回执

对于群聊，群成员发送消息时，可以设置该消息是否需要已读回执。若需要，每个群成员阅读消息后，应该调用`ChatManager.ackGroupMessageRead` 方法发送已读回执，阅读该消息的群成员数量即为已读回执的数量。

群消息已读回执特性的使用限制如下表所示：

| 使用限制| 默认 | 描述 | 
| :--------- | :----- | :------- | 
| 功能开通   | 关闭   | 若要使用该功能，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**即时通讯** > **功能配置** > **功能配置总览**> **基础功能**页签下，搜索找到 **消息已读回执（群聊）** 开通功能。具体费用详见[产品价格](/product/pricing.html#增值服务费用)。   | 
| 使用权限  | 所有群成员    | 默认情况下，所有群成员发送消息时可要求已读回执。如果仅需群主和群管理员发消息时要求已读回执，可联系商务修改。   | 
| 已读回执有效期    | 3 天    | 群聊已读回执的有效期为 3 天，即群组中的消息发送时间超过 3 天，服务器不记录阅读该条消息的群组成员，也不会发送已读回执。   | 
| 群规模    |  200 人   | 该特性最大支持 200 人的群组。如果超过 200 人/群，群成员发送的消息不会返回已读回执。你可以联系商务提升群成员人数上限。 | 
| 查看返回已读回执数量    | 消息发送方 | 对消息返回的已读回执数量（或返回已读回执的人数），默认仅消息发送方可查看。如需所有群成员均可查看，可联系商务开通。 | 

你可以按以下步骤实现群消息已读回执特性：

1. 开启已读回执功能，即 SDK 初始化时将 `ChatOptions.setRequireReadAck` 设置为 `true`。

该功能开启后，接收方阅读消息后，SDK 底层会自动进行消息已读回执。

```typescript
// 设置是否需要接收方已读确认,默认为 `true`。
options.setRequireReadAck(true);
```

2. 发送方发送消息时设置 `ChatMessage.setIsNeedGroupAck` 属性为 `true`。

与单聊消息的 app 层级设置已读回执功能不同，群聊消息是在发送消息时设置指定消息是否需要已读回执。

```typescript
let message = ChatMessage.createTextSendMessage(to, content);
if (!message) {
    return;
}
message.setChatType(ChatType.GroupChat);
message.setIsNeedGroupAck(true);
```

3. 消息接收方发送群组消息的已读回执。

```typescript
if (message.isNeedGroupAck() && !message.isUnread()) {
  ChatClient.getInstance().chatManager()?.ackGroupMessageRead(message, ext);
  message.setUnread(false);
}
```

4. 消息发送方监听群组消息已读回调。

群消息已读回调在 `ChatMessageListener#onGroupMessageRead` 中实现。

发送方接收到群组消息已读回执后，其发出消息的属性 `ChatMessage.groupAckCount` 会有相应变化。

```typescript
let msgListener: ChatMessageListener = {
    ......
    onGroupMessageRead?: (groupReadAcks: Array<GroupReadAck>) => {
       // 接收到群组消息体的已读回执, 消息的接收方已经阅读此消息。
    }
    ......
}
ChatClient.getInstance().chatManager()?.addMessageListener(msgListener);
```

5. 消息发送方获取群组消息的已读回执详情。

你可以调用 `ChatManager#fetchGroupReadAcks` 方法从服务器获取单条消息的已读回执的详情。

```typescript
ChatClient.getInstance().chatManager()?.fetchGroupReadAcks(messageId, pageSize, startAckId).then((result) => {
  // success logic
})
```

### 查看消息送达和已读状态

对于单聊消息，本地通过 `ChatMessage.isDelivered` 字段存储消息送达状态。

对于单聊消息，本地通过以下字段存储消息已读状态：

| 字段       | 描述   | 
| :--------- | :----- | 
| `ChatMessage.isUnread` | 用户是否已读了该消息。如果是自己发送的消息，该字段的值固定为 `true`。| 
| `ChatMessage.isReceiverRead`      | 是否（消息接收方）已发送或（消息发送方）已收到消息已读回执。如果是自己发送的消息，记录的是对方是否已读。如果是对方的消息，则记录的是自己是否发送过已读回执。 | 

对于群聊消息，本地数据库通过以下字段存储消息已读状态：

| 字段       | 描述   | 
| :--------- | :----- | 
| `ChatMessage.isUnread` | 用户是否已读了该消息。如果是自己发送的消息，该字段的值固定为 `true`。| 
| `ChatMessage.groupAckCount`  | 已阅读消息的群成员数量。  | 

### 已读回执与未读消息数

- 会话已读回执发送后，开发者需要调用 `Conversation.markAllMessagesAsRead` 方法将该会话的所有消息置为已读，即会话的未读消息数清零。

- 消息已读回执发送后，开发者需要调用 `Conversation.markMessageAsRead` 方法将该条消息置为已读，则消息未读数会有变化。




