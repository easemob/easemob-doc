# 实现消息回执

<Toc />

**单聊会话支持消息送达回执和消息已读回执**，发送方发送消息后可及时了解接收方是否及时收到并阅读了消息。

**群聊会话只支持消息已读回执，不支持送达回执**。群成员在发送消息时，可以设置该消息是否需要已读回执。要使用该功能，你需要[在环信即时通讯云控制台上开通该功能](/product/enable_and_configure_IM.html#设置群消息已读回执)，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。

消息送达回执和已读回执的效果示例，如下图所示：

![img](@static/images/android/message_receipt.png)

## 技术原理

使用环信即时通讯 IM iOS SDK 可以实现消息的送达回执与已读回执。

- 单聊消息送达回执的逻辑如下：

  1. 你可以通过设置 `EMOptions#enableDeliveryAck` 为 `YES` 开启送达回执功能。
  2. 消息接收方收到消息后，SDK 自动向发送方触发送达回执。
  3. 消息发送方通过监听 `EMChatManagerDelegate#messagesDidDeliver` 回调接收消息送达回执。

- 单聊消息已读回执的逻辑如下：

  1. 你可以通过设置 `EMOptions#enableRequireReadAck` 为 `YES` 开启已读回执功能。
  2. 消息接收方收到消息后，调用 `IEMChatManager#sendMessageReadAck` 方法发送消息已读回执。
  3. 消息发送方通过监听 `EMChatManagerDelegate#messagesDidRead` 回调接收消息已读回执。

- 群聊消息已读回执的逻辑如下：

  1. 你可以通过设置 `EMOptions#enableRequireReadAck` 为 `YES` 开启已读回执功能。
  2. 发送方发送消息时设置 `EMChatMessage#isNeedGroupAck` 为 `YES` 要求接收方返回消息已读回执。
  3. 接收方收到或阅读消息后通过 `IEMChatManager#sendGroupMessageReadAck` 方法发送群组消息的已读回执。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 在环信即时通讯云控制台开启群消息已读回执功能。

## 实现方法

### 单聊消息送达回执

1. 开启消息送达功能，即 SDK 初始化时将 `EMOptions#enableDeliveryAck` 设置为 `YES`。

当接收方收到消息后，SDK 底层会自动进行消息送达回执。

```objectivec
// 设置是否需要接收方送达确认，默认为 `NO` 即不需要。
options.enableDeliveryAck = YES;
```

2. 接收方收到消息后，SDK 自动向发送方送达回执。
3. 发送方监听 `EMChatManagerDelegate#messagesDidDeliver` 事件，收到接收方的送达回执。你可以在收到该通知时，显示消息的送达状态。

```objectivec
// 继承并实现监听器。
EMChatManagerDelegate

// 收到消息送达回执。
- (void)messagesDidDeliver:(NSArray *)aMessages
{

}
// 注册监听器。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 若不再需要监听器，可将其移除，如在 viewController 的 dealloc 时。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

### 单聊消息已读回执

单聊既支持消息已读回执，也支持[会话已读回执](conversation_receipt.html)。我们建议你结合使用这两种回执：

- 聊天页面打开时，若收到消息，发送消息已读回执。
- 聊天页面未打开时，若有未读消息，进入聊天页面，发送会话已读回执。这种方式可避免发送多个消息已读回执。

单聊消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。 

参考如下步骤在单聊中实现消息已读回执。

1. 开启已读回执功能，即 SDK 初始化时将 `EMOptions#enableRequireReadAck` 设置为 `YES`。

该功能开启后，接收方阅读消息后，SDK 底层会自动进行消息已读回执。

```objectivec
options.enableRequireReadAck = YES;
```

2. 接收方发送消息已读回执。

- 消息接收方进入会话时，发送会话已读回执。

```objectivec
[[EMClient sharedClient].chatManager ackConversationRead:conversationId completion:nil];
```

- 在会话页面，接收到消息时，根据消息类型发送消息已读回执。

```objectivec
// 接收消息回调。
- (void)messagesDidReceive:(NSArray *)aMessages
  {
    for (EMChatMessage *message in aMessages) {
        //发送消息已读回执。
        [self sendReadAckForMessage:message];
    }
  }

// 发送消息已读回执
- (void)sendReadAckForMessage:(EMChatMessage *)aMessage
  {
    //这里是接收的消息，未发送过 read ack 消息且是单聊。
    if (aMessage.direction == EMMessageDirectionSend || aMessage.isReadAcked || aMessage.chatType != EMChatTypeChat)
        return;

    EMMessageBody *body = aMessage.body;
    // 视频、语音及文件需要点击后再发送,可以根据需求进行调整。
    if (body.type == EMMessageBodyTypeFile || body.type == EMMessageBodyTypeVoice || body.type == EMMessageBodyTypeImage)
        return;

    [[EMClient sharedClient].chatManager sendMessageReadAck:aMessage.messageId toUser:aMessage.conversationId completion:nil];
  }
```

3. 消息发送方监听消息已读回调。

消息发送方可以通过 `EMChatManagerDelegate#messagesDidRead` 事件监听指定消息是否已读，示例代码如下：

```objectivec
// 继承并实现监听器。
EMChatManagerDelegate

// 接收到已读回执。
- (void)messagesDidRead:(NSArray *)aMessages
  {
    for (EMChatMessage *message in aMessages) {
        // 添加刷新页面通知等逻辑。
    }
  }
// 注册监听器。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 移除监听器。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

### 群聊消息已读回执

对于群聊，群成员发送消息时，可以设置该消息是否需要已读回执。若需要，每个群成员阅读消息后，SDK 均会发送已读回执，即阅读该消息的群成员数量即为已读回执的数量。

群消息已读回执特性的使用限制如下表所示：

| 使用限制| 默认 | 描述 | 
| :--------- | :----- | :------- | 
| 功能开通   | 关闭   | 若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。    | 
| 使用权限  | 群组管理员和群主    | 默认情况下，群主和群组管理员有权限。<br/>可以联系商务为普通群成员开放权限。   | 
| 已读回执有效期    | 3 天    | 群聊已读回执的有效期为 3 天，即群组中的消息发送时间超过 3 天，服务器不记录阅读该条消息的群组成员，也不会发送已读回执。   | 
| 群规模    |  500 人   | 该特性最大支持 500 人的群组。也就是说，群组中每条消息最多可返回 500 条已读回执，若超过该上限，最新的已读回执记录会覆盖最早的记录。  | 
| 群消息条数上限    | 500 条 | 单个群组每天最多支持 500 条消息要求已读回执。| 

你可以按以下步骤实现群消息已读回执特性：

1. 开启已读回执功能，即 SDK 初始化时将 `enableRequireReadAck` 设置为 `YES`。

该功能开启后，接收方阅读消息后，SDK 底层会自动进行消息已读回执。

```objectivec
options.enableRequireReadAck = YES;
```

2. 发送方发送消息时设置 `EMChatMessage#isNeedGroupAck` 属性为 `YES`。

```objectivec
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:to from:from to:to body:aBody ext:aExt];
message.isNeedGroupAck = YES;
```

3. 消息接收方发送群组消息的已读回执。

```objectivec
- (void)sendGroupMessageReadAck:(EMChatMessage *)msg
  {
    if (msg.isNeedGroupAck && !msg.isReadAcked) {
        [[EMClient sharedClient].chatManager sendGroupMessageReadAck:msg.messageId toGroup:msg.conversationId content:@"123" completion:^(EMError *error) {
            if (error) {

            }
        }];
    }
  }
```

4. 消息发送方监听群组消息已读回调。

群消息已读回调在回调代理 `EMChatManagerDelegate` 中实现。

发送方接收到群组消息已读回执后，其发出消息的属性 `groupAckCount` 会有相应变化。

```objectivec
// 继承并实现监听器。
EMChatManagerDelegate

// 接收到群组消息的已读回执, 消息的接收方已经阅读此消息。
- (void)groupMessageDidRead:(EMChatMessage *)aMessage groupAcks:(NSArray *)aGroupAcks
  {
    for (GroupMessageAck *messageAck in aGroupAcks) {
        //收到群消息已读回执
    }
  }

// 注册监听器。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 移除监听器。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

5. 消息发送方获取群组消息的已读回执详情。

你可以调用 `IEMChatManager#asyncFetchGroupMessageAcksFromServer` 方法从服务器获取单条消息的已读回执的详情。

```objectivec
 // 异步方法。
 // aMessageId           要获取的消息 ID。
 // aGroupId             要获取回执对应的群 ID。
 // aGroupAckId          查询起始的已读回执 ID。首次调用为空，SDK 从最新的已读回执开始按服务器接收回执时间的逆序获取。后续调用从 EMCursorResult 中的 cursor 获取。
 // aPageSize            要获取的回执条数。
 //  aCompletionBlock     获取结束的回调。
[[EMClient sharedClient].chatManager asyncFetchGroupMessageAcksFromServer:messageId groupId:groupId startGroupAckId:nil pageSize:pageSize completion:^(EMCursorResult *aResult, EMError *error, int totalCount) {
    // 页面刷新等操作。
}];
```

### 查看消息送达和已读状态

对于单聊消息，本地通过 `EMChatMessage#isDeliverAcked` 字段存储消息送达状态。

对于单聊消息，本地通过以下字段存储消息已读状态：

| 字段       | 描述   | 
| :--------- | :----- | 
| `EMChatMessage#isRead` | 用户是否已读了该消息。如果是自己发送的消息，该字段的值固定为 `false`。 | 
| `EMChatMessage#isReadAcked`      | 是否（消息接收方）已发送或（消息发送方）已收到消息已读回执。如果是自己发送的消息，记录的是对方是否已读。如果是对方的消息，则记录的是自己是否发送过已读回执。| 

对于群聊消息，本地数据库通过以下字段存储消息已读状态：

| 字段       | 描述   | 
| :--------- | :----- | 
| `EMChatMessage#isRead` | 接收方是否已读了消息。   | 
| `EMChatMessage#isReadAcked`      | 是否（消息接收方）已发送或（消息发送方）已收到消息已读回执。只要收到了一个接收方的已读回执，该参数即为 `YES`。   | 
| `EMChatMessage#groupAckCount`  | 已阅读消息的群成员数量。    | 

### 已读回执与未读消息数

- 会话已读回执发送后，SDK 会自动调用 `EMConversation#markAllMessagesAsRead` 方法，将该会话的未读消息数清零。

- 消息已读回执发送后，开发者可以调用 `EMConversation#markMessageAsReadWithId` 方法，将本地数据库中的该条消息置为已读，则消息未读数会有变化。




