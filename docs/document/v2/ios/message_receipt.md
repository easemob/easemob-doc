# 管理消息回执

<Toc />

单聊会话支持消息送达回执、会话已读回执和消息已读回执，发送方发送消息后可及时了解接收方是否及时收到并阅读了信息，也可以了解整个会话是否已读。

群聊会话只支持消息已读回执。群主和群管理员在发送消息时，可以设置该消息是否需要已读回执，私有部署即时通讯服务默认支持并开通该功能。

本文介绍如何使用环信即时通讯 IM Android SDK 实现单聊和群聊的消息回执功能。

## 技术原理

使用环信即时通讯 IM iOS SDK 可以实现消息的送达回执与已读回执。核心方法如下：

- `enableRequireReadAck` 开启消息送达回执；
- `ackConversationRead` 发出指定会话的已读回执；
- `sendMessageReadAck` 发出指定消息的已读回执；
- `sendGroupMessageReadAck` 发出群组消息的已读回执。

实现送达回执和已读回执逻辑分别如下：

单聊消息送达回执：

1. 你可以通过设置 `options.enableDeliveryAck` 开启送达回执功能；
2. 消息接收方收到消息后，SDK 自动向发送方触发送达回执；
3. 消息发送方通过监听 `OnMessageDelivered` 回调接收消息送达回执。

已读回执：

- 单聊会话及消息已读回执
  1. 你可以通过设置 `EMOptions.enableRequireReadAck` 为 `YES` 开启已读回执功能；
  2. 消息接收方收到消息后，调用 API `ackConversationRead` 或 `sendMessageReadAck` 发送会话或消息已读回执；
  3. 消息发送方通过监听 `onConversationRead` 或 `messagesDidRead` 回调接收会话或消息已读回执。
- 群聊只支持消息已读回执：
  1. 你可以通过设置 `isNeedGroupAck` 开启群聊消息已读回执功能；
  2. 消息接收方收到消息后通过 `sendGroupMessageReadAck` 发送群组消息的已读回执。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/document/v2/privatization/uc_limitation.html)。


## 实现方法

### 消息送达回执

1. 打开消息送达开关，即将 `enableDeliveryAck` 设置为 `YES`，当接收方收到消息后，SDK 底层会自动进行消息送达回执。

```objectivec
options.enableDeliveryAck = YES;
```

2. 发送方监听事件 `onMessageDelivered` 回调，收到接收方的送达回执。

```objectivec
// 继承并实现监听器。
EMChatManagerDelegate

// 收到消息送达回执。
- (void)messagesDidDeliver:(NSArray *)aMessages
{

}
// 注册监听器。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 记得在不需要的时候移除监听器，如在 viewController 的 dealloc 时。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

### 消息和会话的已读回执

消息已读回执用于告知单聊或群聊中的用户接收方已阅读其发送的消息。为降低消息已读回执方法的调用次数，SDK 还支持在单聊中使用会话已读回执功能，用于获知接收方是否阅读了会话中的未读消息。

#### 单聊

单聊既支持消息已读回执，也支持会话已读回执。我们建议你按照如下逻辑结合使用两种回执，减少发送消息已读回执数量。

- 聊天页面未打开时，若有未读消息，进入聊天页面，发送会话已读回执；
- 聊天页面打开时，若收到消息，发送消息已读回执。

发送方若要接收消息已读回执，你首先需要设置打开已读回执，即将 `enableRequireReadAck` 设置为 `YES`，当接收方阅读消息后，SDK 底层会自动进行消息已读回执。

```objectivec
options.enableRequireReadAck = YES;
```

##### 会话已读回执

参考以下步骤在单聊中实现会话已读回执。

1. 接收方发送会话已读回执。

消息接收方进入会话页面，查看会话中是否有未读消息。若有，发送会话已读回执，没有则不再发送。

```objectivec
[[EMClient sharedClient].chatManager ackConversationRead:conversationId completion:nil];
```

2. 消息发送方监听会话已读回执的回调。

```objectivec
// 继承并实现监听器。
EMChatManagerDelegate

// 收到会话已读回执。
- (void)onConversationRead:(NSString *)from to:(NSString *)to
  {
    // 添加刷新页面通知等逻辑。
  }
// 注册监听器。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 移除监听器。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

同一用户 ID 登录多设备的情况下，用户在一台设备上发送会话已读回执，服务器会将会话的未读消息数置为 `0`，同时其他设备会收到 `OnConversationRead` 回调。

##### 消息已读回执

参考如下步骤在单聊中实现消息已读回执。

1. 接收方发送已读回执消息。

消息接收方进入会话时，发送会话已读回执。

```objectivec
[[EMClient sharedClient].chatManager sendMessageReadAck:messageId toUser:conversationId completion:nil];
```

在会话页面，接收到消息时，根据消息类型发送消息已读回执，如下所示：

```objectivec
// 接收消息回调。
- (void)messagesDidReceive:(NSArray *)aMessages
  {
    for (EMChatMessage *message in aMessages) {
        //发送消息已读回执。
        [self sendReadAckForMessage:message];
    }
  }

/**
  * 发送已读回执。
  * @param message
  */
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

2. 消息发送方监听消息已读回调。

可以调用接口监听指定消息是否已读，示例代码如下：

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

#### 群聊

对于群聊，群主和群管理员发送消息时，可以设置该消息是否需要已读回执。若需要，每个群成员在阅读消息后，SDK 均会发送已读回执，即阅读该消息的群成员数量即为已读回执的数量。

私有部署即时通讯服务默认支持并开通群消息已读回执功能。

1. 群主或群管理员设置 `EMChatMessage` 的属性 `isNeedGroupAck` 为 `YES`。

```objectivec
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:to from:from to:to body:aBody ext:aExt];
message.isNeedGroupAck = YES;
```

2. 发送群组消息的已读回执。

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

3. 消息发送方监听群组消息已读回调。

群消息已读回调在回调代理 `EMChatManagerDelegate` 中实现。

```objectivec
// 继承并实现监听器。
EMChatManagerDelegate

// 接收到群组消息的已读回执, 消息的接收方已经阅读此消息。
- (void)groupMessageDidRead:(EMChatMessage *)aMessage groupAcks:(NSArray *)aGroupAcks
  {
    for (GroupMessageAck *messageAck in aGroupAcks) {
        //receive group message read ack
    }
  }

// 注册监听器。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 移除监听器。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

接收到群组消息已读回执后，发出消息的属性 `groupAckCount` 会有相应变化；

4. 消息发送方获取群组消息的已读回执详情。

你可以调用 `asyncFetchGroupMessageAcksFromServer` 获取到已读回执的详情。

```objectivec
/**
 * 从服务器获取指定群已读回执。
 *
 * 异步方法
 *
 * @param  aMessageId           要获取的消息 ID。
 * @param  aGroupId             要获取回执对应的群 ID。
 * @param  aGroupAckId          要获取的群回执 ID。
 * @param  aPageSize            获取消息条数。
 * @param  aCompletionBlock     获取消息结束的回调。
 */
[[EMClient sharedClient].chatManager asyncFetchGroupMessageAcksFromServer:messageId groupId:groupId startGroupAckId:nil pageSize:pageSize completion:^(EMCursorResult *aResult, EMError *error, int totalCount) {
    // 页面刷新等操作。
}];
```