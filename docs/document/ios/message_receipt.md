# 实现消息回执

## 功能说明

**消息送达回执** 表示消息已成功送达接收方设备。接收方开启该能力后，收到单聊消息时 SDK 会自动向发送方回发送达回执。发送方可通过送达回执确认消息是否已经到达对方客户端。

**消息已读回执** 表示接收方已阅读指定消息。接收方阅读消息后，需要发送消息已读回执，消息发送方收到回执后可更新对应消息的已读状态。

消息送达回执和已读回执的效果示例，如下图所示：

![消息送达和已读状态](/images/android/message_receipt.png)

## 使用限制

 - 单聊会话支持消息送达回执和消息已读回执。
 - 群聊会话支持消息已读回执，不支持消息送达回执。
 - 聊天室暂不支持消息送达回执和消息已读回执。
 - **群聊消息已读回执需要在 [环信控制台开通该功能](/product/console/basic_message.html#群聊消息已读回执)。**

## 技术原理

#### 单聊消息送达回执

单聊消息送达回执的实现流程如下：

![img](/images/ios/message_delivery_receipt.png)

实现该功能的基本步骤如下：

1. 消息接收方在调用 `initializeSDKWithOptions` 前，通过 `EMOptions#enableDeliveryAck` 开启送达回执功能。该配置默认为 `NO`。
2. 消息发送方通过 `addDelegate` 注册消息代理，并通过 `messagesDidDeliver` 监听送达回执。
3. 消息接收方收到单聊消息后，SDK 自动向消息发送方发送送达回执，无需应用手动调用接口。
4. 消息发送方收到 `messagesDidDeliver` 回调后，表示消息已送达接收方客户端。应用可据此更新消息的展示状态，也可通过 `isDeliverAcked` 查询消息是否已送达。

:::tip
消息送达回执仅支持单聊，不支持群聊和聊天室。
:::

#### 消息已读回执

iOS SDK 使用 `sendMessageReadReceipts` 统一发送单聊和群聊消息的已读回执，消息发送方通过 `onMessageReadReceipts` 接收回执。

消息已读回执的实现流程如下：

![img](/images/ios/message_read_receipt.png)

实现该功能的基本步骤如下：

1. 消息发送方在发送单聊或群聊消息前，设置消息的 `isNeedReadReceipt` 为 `YES`，表示该消息需要已读回执。
2. 消息发送方通过 `addDelegate` 注册消息代理，并通过 `onMessageReadReceipts` 监听已读回执。
3. 消息接收方在用户实际阅读消息后，调用 `sendMessageReadReceipts` 发送一条或多条消息的已读回执。
4. 消息发送方收到 `onMessageReadReceipts` 回调后，可通过 `messageId` 定位消息，并更新对应消息的已读状态。

`sendMessageReadReceipts` 单次最多可传入 50 条消息。所有消息必须属于同一会话，并且其 `isNeedReadReceipt` 必须为 `YES`。该接口仅支持单聊和群聊，不支持聊天室。

对于群聊消息，应用可以通过以下接口或属性获取已读情况：

 - `readCount` 或 `groupReadReceiptCount`：获取群消息的已读人数。
 - `getGroupMessageReadReceipts`：批量获取多条群消息的已读回执详情，单次最多传入 20 条属于同一会话的消息。
 - `asyncFetchGroupMessageReadUsersFromServer`：分页获取单条群消息的已读回执成员详情。

:::tip
发送消息已读回执不会改变会话未读数。如需清零会话未读数，应另行调用 `clearConversationUnreadMessageCount`；该操作不会向消息发送方发送已读回执。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 使用群消息已读回执前，已在 [环信控制台](/product/console/basic_message.html#群聊消息已读回执)开通该功能。

## 单聊消息送达回执

#### 步骤 1：开启送达回执

在调用 `initializeSDKWithOptions` 前，通过 `EMOptions#enableDeliveryAck` 设置是否需要单聊消息送达回执。该配置默认为 `NO`。

```objectivec
// 创建 SDK 配置对象。
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
// 接收方开启后，收到单聊消息时 SDK 自动发送送达回执。
options.enableDeliveryAck = YES;

// 使用配置初始化 SDK。
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

开启后，接收方收到单聊消息时由 SDK 自动发送送达回执，无需应用主动调用发送接口。

#### 步骤 2：监听送达回执

发送方通过 `messagesDidDeliver` 接收送达回执，并可通过 `isDeliverAcked` 查询消息是否已送达。

```objectivec
// 实现 EMChatManagerDelegate 中的送达回执回调。
- (void)messagesDidDeliver:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        // YES 表示发送方已收到对端的送达回执。
        BOOL delivered = message.isDeliverAcked;
        // 根据 delivered 更新消息的送达状态。
    }
}

// 注册消息代理。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 不再需要监听时移除消息代理。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## 单聊和群聊消息已读回执

单聊消息和群聊消息均支持已读回执功能。群消息已读回执功能使用前还存在以下使用限制：

| 使用限制 | 默认设置 | 说明 |
| :--- | :--- | :--- |
| 功能开通 | 关闭 | 使用前需在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯** > **基础功能** > **消息** 页面开通 **群聊消息已读回执**。|
| 使用权限 | 所有群成员 | 默认情况下，所有群成员发送消息时均可要求已读回执。若只允许群主和群管理员要求已读回执，请联系商务调整配置。 |
| 已读回执有效期 | 3 天 | 群消息已读回执的有效期为 3 天。消息发送时间超过 3 天后，服务器不再记录阅读该消息的群成员，也不会再发送该消息的已读回执。 |
| 群规模 | 200 人 | 该功能最多支持 200 人的群组。群成员数量超过 200 后，群消息不会返回已读回执，该上限目前无法提升。 |
| 查看已读人数 | 消息发送方 | 默认仅消息发送方可以查看群消息的已读人数。如需允许所有群成员查看，请联系商务开通。 |

:::tip
消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。
:::

#### 步骤 1：设置消息需要已读回执

消息接收方在初始化 SDK 时需将 `isNeedReadReceipt` 设置为 `YES`；该属性默认值为 `NO`。该属性对单聊和群聊均有效。

单聊消息已读回执无需额外开通。群聊消息已读回执需先在环信控制台开通功能，再设置该属性。

```objectivec
// 创建文本消息；单聊时 conversationId 为对端用户 ID。
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:content];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId body:body ext:nil];
// 群聊时设为 YES，conversationId 传群组 ID。
BOOL isGroupChat = NO;
// 根据会话类型设置聊天类型。
message.chatType = isGroupChat ? EMChatTypeGroupChat : EMChatTypeChat;
// 标记该消息需要接收方发送已读回执。
message.isNeedReadReceipt = YES;

// 异步发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
    // 根据 error 处理发送结果。
}];
```

#### 步骤 2：发送消息已读回执

接收方阅读消息后，调用 `sendMessageReadReceipts` 批量发送已读回执。单次最多传入 50 条消息，所有消息必须属于同一会话，且 `isNeedReadReceipt` 必须为 `YES`。

```objectivec
// 仅传入已阅读、需要已读回执且属于同一会话的接收消息。
NSArray<EMChatMessage *> *messages = @[message];

// 异步发送当前批次的消息已读回执。
[[EMClient sharedClient].chatManager sendMessageReadReceipts:messages
                                                   completion:^(EMError *error) {
    if (!error) {
        // 当前批次的消息已读回执发送成功。
    } else {
        // 根据错误码和错误信息处理。
    }
}];
```

:::tip
建议只为接收方向、属于单聊或群聊且 `isNeedReadReceipt` 为 `YES` 的消息发送已读回执。视频、语音和文件等消息可在用户实际查看内容后再发送。
:::

#### 步骤 3：监听消息已读回执

发送方通过 `onMessageReadReceipts` 统一监听单聊和群聊消息的已读回执。回调返回 `EMMessageReadReceipt` 列表。每个回执对象提供以下信息：

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `messageId` | `NSString *` | 获取回执对应的消息 ID。 |
| `conversationId` | `NSString *` | 获取回执对应的会话 ID。 |
| `isPeerReceipt` | `BOOL` | 判断是否为单聊对端发送的已读回执。 |
| `readCount` | `NSInteger` | 获取群消息的已读人数。 |

```objectivec
// 实现 EMChatManagerDelegate 中的已读回执回调。
- (void)onMessageReadReceipts:(NSArray<EMMessageReadReceipt *> *)receipts {
    for (EMMessageReadReceipt *receipt in receipts) {
        // 回执对应的消息和会话 ID。
        NSString *messageId = receipt.messageId;
        NSString *conversationId = receipt.conversationId;
        // 单聊对端已读状态和群消息已读人数。
        BOOL peerRead = receipt.isPeerReceipt;
        NSInteger readCount = receipt.readCount;
        // 根据回执刷新单聊消息已读状态或群消息已读人数。
    }
}

// 群消息读取状态更新时可按需刷新界面。
- (void)groupMessageReadReceiptsHasChanged {
}

// 注册消息代理。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 不再需要监听时移除消息代理。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## 获取群消息已读回执详情

### 批量获取多条群消息的回执汇总

调用 `getGroupMessageReadReceipts` 从服务器批量获取消息的已读回执详情。单次最多传入 20 条消息，且所有消息必须属于同一会话。

```objectivec
// messages 中最多包含 20 条、且属于同一群会话的消息。
[[EMClient sharedClient].chatManager getGroupMessageReadReceipts:messages
                                                       completion:^(NSArray<EMMessageReadReceipt *> *receipts, EMError *error) {
    if (!error) {
        // receipts 为各消息的已读回执汇总信息。
    } else {
        // 获取失败。
    }
}];
```

### 获取单条群消息的回执成员详情

调用 `asyncFetchGroupMessageReadUsersFromServer` 分页获取单条群消息的已读回执成员详情。目标消息必须是需要已读回执的群聊消息。

首次调用时将 `readReceiptId` 传入空字符串。后续调用时，将上一次结果中的 `cursor` 作为新的 `readReceiptId`。

```objectivec
// 首次调用时 readReceiptId 传空字符串；后续传入上一次结果的 cursor。
[[EMClient sharedClient].chatManager asyncFetchGroupMessageReadUsersFromServer:messageId
                                                                        groupId:groupId
                                                                  readReceiptId:readReceiptId
                                                                       pageSize:20
                                                                     completion:^(EMCursorResult<EMGroupReadReceipt *> *result, EMError *error, int totalCount) {
    if (!error) {
        NSArray<EMGroupReadReceipt *> *receipts = result.list;
        NSString *nextCursor = result.cursor;
        // 保存 nextCursor，用于获取下一页；totalCount 为已读回执总数。
    } else {
        // 获取失败。
    }
}];
```

`EMGroupReadReceipt` 提供以下信息：

 - `readReceiptId`：已读回执 ID。
 - `messageId`：消息 ID。
 - `from`：发送回执的群成员信息，类型为 `EMGroupMemberInfo`。
 - `readCount`：已读人数。
 - `timestamp`：已读回执时间戳。

## 事件说明

| 事件 | 触发时机 | 接收方 |
| :--- | :--- | :--- |
| `messagesDidReceive` | 收到普通消息时触发。 | 消息接收方；多设备场景下，发送方的其他在线设备也可能收到消息。 |
| `messagesDidDeliver` | 接收方 SDK 自动发送单聊消息送达回执后触发。 | 单聊消息发送方。 |
| `onMessageReadReceipts` | 接收方调用 `sendMessageReadReceipts` 发送一条或多条消息的已读回执后触发。 | 单聊或群聊消息发送方。 |
| `groupMessageReadReceiptsHasChanged` | 群消息的读取状态更新时触发。 | 需要刷新群消息已读状态的客户端。 |

## 查看消息送达和已读状态

你可以通过 `EMChatMessage` 中的属性查看消息送达和已读状态。

| API | 适用场景 | 说明 |
| :--- | :--- | :--- |
| `isDeliverAcked` | 单聊 | 查询消息是否已送达对端。 |
| `isPeerRead` | 单聊 | 查询对端是否已读该消息。 |
| `groupReadReceiptCount` | 群聊 | 查询群消息的已读人数。 |
| `isRead` | 单聊、群聊 | 查询该消息在当前设备上的本地已读状态。 |
| `isNeedReadReceipt` | 单聊、群聊 | 查询该消息是否需要已读回执。 |

## 消息已读回执与会话未读数清零

发送消息已读回执和清零会话未读数是两个独立操作：

| 操作 | 作用 | 是否通知消息发送方 | 是否改变会话未读数 |
| :--- | :--- | :--- | :--- |
| `sendMessageReadReceipts` | 为指定消息发送已读回执。 | 是 | 否 |
| `clearConversationUnreadMessageCount` | 清除指定会话的本地未读数，并同步当前账号的其他设备。 | 否 | 是 |
| `clearAllConversationUnreadMessageCount` | 清除所有本地会话的未读数，并同步当前账号的其他设备。详见 [会话未读数](conversation_unread.html)。 | 否 | 是 |

## 注意事项

 - 消息送达回执仅支持单聊，不支持群聊和聊天室。
 - 消息已读回执仅支持单聊和群聊，不支持聊天室。
 - 单聊和群聊消息在发送前都需要将 `isNeedReadReceipt` 设置为 `YES`。
 - `sendMessageReadReceipts` 单次最多传入 50 条消息。所有消息必须属于同一会话，且其 `isNeedReadReceipt` 必须为 `YES`。
 - 调用 `sendMessageReadReceipts` 的客户端不会通过 `onMessageReadReceipts` 收到自己发送的回执；该回调由原消息发送方收到。
 - 群消息已读回执功能需要在环信控制台开通，并受有效期、群规模和查看权限等服务端配置限制。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`EMOptions#enableDeliveryAck`](#步骤-1-开启送达回执) | `EMOptions` | 设置是否需要单聊消息送达回执。 |
| [`initializeSDKWithOptions`](#步骤-1-开启送达回执) | `EMClient` | 使用指定配置初始化 SDK。 |
| [`initWithConversationID`](#步骤-1-设置消息需要已读回执) | `EMChatMessage` | 创建消息。 |
| [`chatType`](#步骤-1-设置消息需要已读回执) | `EMChatMessage` | 设置消息的会话类型。 |
| [`sendMessage`](#步骤-1-设置消息需要已读回执) | `IEMChatManager` | 异步发送消息。 |
| [`sendMessageReadReceipts`](#步骤-2-发送消息已读回执) | `IEMChatManager` | 批量异步发送单聊或群聊消息的已读回执。 |
| [`messageId`](#步骤-3-监听消息已读回执) / [`conversationId`](#步骤-3-监听消息已读回执) | `EMMessageReadReceipt` | 获取回执对应的消息 ID 和会话 ID。 |
| [`isPeerReceipt`](#步骤-3-监听消息已读回执) / [`readCount`](#步骤-3-监听消息已读回执) | `EMMessageReadReceipt` | 获取单聊对端回执状态或群消息已读人数。 |
| [`getGroupMessageReadReceipts`](#批量获取多条群消息的回执汇总) | `IEMChatManager` | 批量获取多条群消息的已读回执详情。 |
| [`asyncFetchGroupMessageReadUsersFromServer`](#获取单条群消息的回执成员详情) | `IEMChatManager` | 分页获取单条群消息的已读回执成员详情。 |
| [`readReceiptId`](#获取单条群消息的回执成员详情) / [`messageId`](#获取单条群消息的回执成员详情) / [`from`](#获取单条群消息的回执成员详情) / [`readCount`](#获取单条群消息的回执成员详情) / [`timestamp`](#获取单条群消息的回执成员详情) | `EMGroupReadReceipt` | 获取群消息已读回执详情。 |
| [`groupReadReceiptCount`](#查看消息送达和已读状态) | `EMChatMessage` | 查询群消息的已读人数。 |
| [`clearConversationUnreadMessageCount`](#消息已读回执与会话未读数清零) | `IEMChatManager` | 异步清除指定会话的本地未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#消息已读回执与会话未读数清零) | `IEMChatManager` | 异步清除所有本地会话的未读消息数。 |
