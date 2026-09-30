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

实现单聊消息送达回执的流程如下：

![单聊消息送达回执流程](/images/harmonyos/message_delivery_receipt.png)

实现该功能的基本步骤如下：

1. 消息接收方在调用 `ChatClient#init` 前，通过 `ChatOptions#setRequireDeliveryAck(true)` 开启送达回执功能。该配置默认为 `false`，如需送达回执必须设置为 `true`。
2. 消息发送方通过 `ChatManager#addMessageListener` 注册消息监听器，并通过 `ChatMessageListener#onMessageDelivered` 监听送达回执。
3. 消息接收方收到单聊消息后，SDK 自动向消息发送方发送送达回执，无需应用手动调用接口。
4. 消息发送方收到 `onMessageDelivered` 回调后，表示消息已送达接收方客户端。应用可据此更新消息的展示状态，也可调用 `ChatMessage#isDelivered` 查询消息是否已送达。

:::tip
消息送达回执仅支持单聊，不支持群聊和聊天室。
:::

#### 消息已读回执

HarmonyOS SDK 使用 `ChatManager#sendMessageReadReceipts` 统一发送单聊和群聊消息的已读回执，消息发送方通过 `ChatMessageListener#onMessageReadReceipts` 接收回执。

实现消息已读回执的基本流程如下：

![消息已读回执流程](/images/harmonyos/message_read_receipt.png)

实现该功能的基本步骤如下：

1. 消息发送方在发送单聊或群聊消息前，调用 `ChatMessage#setIsNeedReadReceipt(true)`，设置该消息需要已读回执。
2. 消息发送方通过 `ChatManager#addMessageListener` 注册消息监听器，并通过 `ChatMessageListener#onMessageReadReceipts` 监听已读回执。
3. 消息接收方在用户实际阅读消息后，调用 `sendMessageReadReceipts` 发送一条或多条消息的已读回执。
4. 消息发送方收到 `onMessageReadReceipts` 回调后，可根据 `ChatMessageReadReceipt#getMessageId` 定位消息，并更新对应消息的已读状态。

`sendMessageReadReceipts` 单次最多可传入 50 条消息。所有消息必须属于同一会话，并且其 `isNeedReadReceipt()` 为 `true`。该接口仅支持单聊和群聊，不支持聊天室。

对于群聊消息，应用可以通过以下接口获取已读情况：

- `ChatMessageReadReceipt#getReadCount` 或 `ChatMessage#readReceiptCount`：获取群消息的已读人数。
- `ChatManager#getGroupMessageReadReceipts`：批量获取多条群消息的已读回执汇总，单次最多传入 20 条属于同一会话的消息。
- `ChatManager#fetchGroupMessageReadReceipts`：分页获取单条群消息的已读回执成员详情。

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

在调用 `ChatClient#init` 前，通过 `ChatOptions#setRequireDeliveryAck` 设置是否需要单聊消息送达回执。该配置默认为 `false`，如需送达回执必须设置为 `true`。

```typescript
let options = new ChatOptions({ appKey: "your-org#your-app" });
options.setRequireDeliveryAck(true);

ChatClient.getInstance().init(context, options);
```

开启后，接收方收到单聊消息时由 SDK 自动发送送达回执，无需应用主动调用发送接口。

#### 步骤 2：监听送达回执

发送方通过 `ChatMessageListener#onMessageDelivered` 接收送达回执，并可通过 `ChatMessage#isDelivered` 查询消息是否已送达。

```typescript
let messageListener: ChatMessageListener = {
    onMessageReceived: (messages: Array<ChatMessage>): void => {
        // 收到消息。
    },
    onMessageDelivered: (messages: Array<ChatMessage>): void => {
        messages.forEach((message: ChatMessage) => {
            let delivered: boolean = message.isDelivered();
            // 根据 delivered 更新消息的送达状态。
        });
    }
};

ChatClient.getInstance().chatManager()?.addMessageListener(messageListener);

// 不再需要监听时移除监听器。
ChatClient.getInstance().chatManager()?.removeMessageListener(messageListener);
```

## 单聊和群聊消息已读回执

单聊和群聊消息均支持已读回执。单聊消息已读回执功能默认开启，但发送方仍需在发送消息前调用 `ChatMessage#setIsNeedReadReceipt(true)`。单聊消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

群消息已读回执功能存在以下使用限制：

| 使用限制 | 默认设置 | 说明 |
| :--- | :--- | :--- |
| 功能开通 | 关闭 | 使用前需在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯** > **基础功能** > **消息** 页面开通 **群聊消息已读回执**。 |
| 使用权限 | 所有群成员 | 默认情况下，所有群成员发送消息时均可要求已读回执。若只允许群主和群管理员要求已读回执，请联系商务调整配置。 |
| 已读回执有效期 | 3 天 | 群消息已读回执的有效期为 3 天。消息发送时间超过 3 天后，服务器不再记录阅读该消息的群成员，也不会再发送该消息的已读回执。 |
| 群规模 | 200 人 | 该功能最多支持 200 人的群组。群成员数量超过 200 后，群消息不会返回已读回执，该上限目前无法提升。 |
| 查看已读人数 | 消息发送方 | 默认仅消息发送方可以查看群消息的已读人数。如需允许所有群成员查看，请联系商务开通。 |

#### 步骤 1：设置消息需要已读回执

发送单聊或群聊消息前，调用 `ChatMessage#setIsNeedReadReceipt(true)` 设置该消息需要已读回执。该属性对单聊和群聊均有效。

单聊消息已读回执无需额外开通。群聊消息已读回执需先在环信控制台开通功能，再设置该属性。

```typescript
let message = ChatMessage.createTextSendMessage(conversationId, content);
if (message === undefined) {
    return;
}

message.setChatType(ChatType.Chat); // 群聊时设置为 ChatType.GroupChat。
message.setIsNeedReadReceipt(true);

ChatClient.getInstance().chatManager()?.sendMessage(message);
```

#### 步骤 2：发送消息已读回执

接收方阅读消息后，调用 `sendMessageReadReceipts` 批量发送已读回执。单次最多传入 50 条消息，所有消息必须属于同一会话。

```typescript
let messages: Array<ChatMessage> = [message];
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager === undefined) {
    return;
}

chatManager.sendMessageReadReceipts(messages).then(() => {
    // 当前批次的消息已读回执发送成功。
}).catch((error: ChatError) => {
    // 根据错误码和错误信息处理。
});
```

:::tip
建议只为接收方向、聊天类型为单聊或群聊、`isNeedReadReceipt()` 为 `true`，且 `isPeerRead()` 为 `false` 的消息发送已读回执。对于视频、语音和文件等消息，可在用户实际查看、播放或打开内容后再发送已读回执。
:::

#### 步骤 3：监听消息已读回执

发送方通过 `ChatMessageListener#onMessageReadReceipts` 统一监听单聊和群聊消息的已读回执。回调返回 `Array<ChatMessageReadReceipt>`。每个回执对象提供以下信息：

| API | 返回类型 | 说明 |
| :--- | :--- | :--- |
| `getMessageId()` | `string` | 获取回执对应的消息 ID。 |
| `getConversationId()` | `string` | 获取回执对应的会话 ID。 |
| `isPeerReceipt()` | `boolean` | 判断是否为单聊对端发送的已读回执。 |
| `getReadCount()` | `number` | 获取群消息的已读人数。 |

```typescript
let messageListener: ChatMessageListener = {
    onMessageReceived: (messages: Array<ChatMessage>): void => {
        // 收到消息。
    },
    onMessageReadReceipts: (receipts: Array<ChatMessageReadReceipt>): void => {
        receipts.forEach((receipt: ChatMessageReadReceipt) => {
            let messageId: string = receipt.getMessageId();
            let conversationId: string = receipt.getConversationId();
            let peerRead: boolean = receipt.isPeerReceipt();
            let readCount: number = receipt.getReadCount();
            // 根据回执刷新单聊消息已读状态或群消息已读人数。
        });
    }
};

ChatClient.getInstance().chatManager()?.addMessageListener(messageListener);

// 不再需要监听时移除监听器。
ChatClient.getInstance().chatManager()?.removeMessageListener(messageListener);
```

## 获取群消息已读回执详情

### 批量获取多条群消息的回执汇总

调用 `getGroupMessageReadReceipts` 从服务器批量获取群消息的已读回执汇总详情。单次最多传入 20 条消息，且所有消息必须属于同一群聊会话。

```typescript
let messages: Array<ChatMessage> = [message1, message2];
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager === undefined) {
    return;
}

chatManager.getGroupMessageReadReceipts(messages)
    .then((receipts: Array<ChatMessageReadReceipt>) => {
        receipts.forEach((receipt: ChatMessageReadReceipt) => {
            let messageId: string = receipt.getMessageId();
            let readCount: number = receipt.getReadCount();
            // 根据 messageId 和 readCount 更新群消息的已读人数。
        });
    })
    .catch((error: ChatError) => {
        // 根据错误码和错误信息处理。
    });
```

### 获取单条群消息的回执成员详情

调用 `fetchGroupMessageReadReceipts` 分页获取单条群消息的已读回执成员详情。目标消息必须存在于本地、属于群聊且 `isNeedReadReceipt()` 为 `true`；`pageSize` 的取值范围为 `[1, 50]`。

首次调用时将 `startReceiptId` 传入空字符串。后续调用时，将上一次结果中的 `getNextCursor()` 返回值作为新的 `startReceiptId`。

```typescript
let startReceiptId: string = "";
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager === undefined) {
    return;
}

chatManager.fetchGroupMessageReadReceipts(messageId, 20, startReceiptId)
    .then((result: CursorResult<GroupReadReceipt>) => {
        let receipts: Array<GroupReadReceipt> = result.getResult();
        let nextReceiptId: string = result.getNextCursor();
        // 保存 nextReceiptId，用于获取下一页。
    })
    .catch((error: ChatError) => {
        // 根据错误码和错误信息处理。
    });
```

`GroupReadReceipt` 提供以下信息：

- `getAckId()`：获取已读回执 ID。
- `getMsgId()`：获取消息 ID。
- `getFrom()`：获取发送回执的群成员信息，类型为 `GroupMember | undefined`；服务器未下发成员信息时返回 `undefined`。
- `getCount()`：获取该成员发送回执时的已读人数快照。
- `getTimestamp()`：获取发送已读回执的时间戳。

## 事件说明

| 事件 | 触发时机 | 接收方 |
| :--- | :--- | :--- |
| `ChatMessageListener#onMessageReceived` | 收到普通消息时触发。 | 消息接收方。 |
| `ChatMessageListener#onMessageDelivered` | 接收方 SDK 自动发送单聊消息送达回执后触发。 | 单聊消息发送方。 |
| `ChatMessageListener#onMessageReadReceipts` | 接收方调用 `sendMessageReadReceipts` 发送一条或多条消息的已读回执后触发。 | 单聊或群聊消息发送方。 |

## 查看消息送达和已读状态

| API | 适用场景 | 说明 |
| :--- | :--- | :--- |
| `ChatMessage#isDelivered()` | 单聊 | 查询消息是否已送达对端。 |
| `ChatMessage#isPeerRead()` | 单聊 | 查询对端是否已读该消息。 |
| `ChatMessage#readReceiptCount()` | 群聊 | 查询群消息的已读人数。 |
| `ChatMessage#isRead()` | 单聊、群聊 | 查询该消息在当前设备上的本地已读状态。 |
| `ChatMessage#isNeedReadReceipt()` | 单聊、群聊 | 查询该消息是否需要已读回执。 |

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
- 单聊和群聊消息在发送前都需要调用 `ChatMessage#setIsNeedReadReceipt(true)`。
- `sendMessageReadReceipts` 单次最多传入 50 条消息。所有消息必须属于同一会话，且 `isPeerRead()` 必须为 `false`。
- 调用 `sendMessageReadReceipts` 的客户端不会通过 `onMessageReadReceipts` 收到自己发送的回执；该回调由原消息发送方收到。
- `clearConversationUnreadMessageCount` 和 `clearAllConversationUnreadMessageCount` 只管理会话未读数，不会发送消息已读回执。
- 群消息已读回执功能需要在环信控制台开通，并受有效期、群规模和查看权限等服务端配置限制。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setRequireDeliveryAck`](#步骤-1-开启送达回执) | `ChatOptions` | 设置是否需要单聊消息送达回执。 |
| [`init`](#步骤-1-开启送达回执) | `ChatClient` | 使用指定配置初始化 SDK。 |
| [`createTextSendMessage`](#步骤-1-设置消息需要已读回执) | `ChatMessage` | 创建文本消息。 |
| [`setIsNeedReadReceipt`](#步骤-1-设置消息需要已读回执) / [`sendMessage`](#步骤-1-设置消息需要已读回执) | `ChatMessage` / `ChatManager` | 设置消息需要已读回执并发送消息。 |
| [`sendMessageReadReceipts`](#步骤-2-发送消息已读回执) | `ChatManager` | 批量发送单聊或群聊消息的已读回执。 |
| [`getMessageId`](#步骤-3-监听消息已读回执) / [`getConversationId`](#步骤-3-监听消息已读回执) | `ChatMessageReadReceipt` | 获取回执对应的消息 ID 和会话 ID。 |
| [`isPeerReceipt`](#步骤-3-监听消息已读回执) / [`getReadCount`](#步骤-3-监听消息已读回执) | `ChatMessageReadReceipt` | 获取单聊对端回执状态或群消息已读人数。 |
| [`getGroupMessageReadReceipts`](#批量获取多条群消息的回执汇总) | `ChatManager` | 批量获取多条群消息的已读回执汇总。 |
| [`fetchGroupMessageReadReceipts`](#获取单条群消息的回执成员详情) | `ChatManager` | 分页获取单条群消息的已读回执成员详情。 |
| [`getAckId`](#获取单条群消息的回执成员详情) / [`getMsgId`](#获取单条群消息的回执成员详情) / [`getFrom`](#获取单条群消息的回执成员详情) / [`getCount`](#获取单条群消息的回执成员详情) / [`getTimestamp`](#获取单条群消息的回执成员详情) | `GroupReadReceipt` | 获取群消息已读回执成员详情。 |
| [`isDelivered`](#查看消息送达和已读状态) / [`isPeerRead`](#查看消息送达和已读状态) | `ChatMessage` | 查询单聊消息的送达和对端已读状态。 |
| [`readReceiptCount`](#查看消息送达和已读状态) / [`isRead`](#查看消息送达和已读状态) / [`isNeedReadReceipt`](#查看消息送达和已读状态) | `ChatMessage` | 查询消息的已读人数、本地已读状态和是否需要已读回执。 |
| [`clearConversationUnreadMessageCount`](#消息已读回执与会话未读数清零) | `ChatManager` | 清除指定会话的本地未读消息数。 |
| [`clearAllConversationUnreadMessageCount`](#消息已读回执与会话未读数清零) | `ChatManager` | 清除所有本地会话的未读消息数。 |
