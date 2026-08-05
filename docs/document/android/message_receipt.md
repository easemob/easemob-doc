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

![img](/images/android/message_delivery_receipt.png)

实现该功能的基本步骤如下：

1. 消息接收方在调用 `EMClient#init` 前，通过 `EMOptions#setRequireDeliveryAck(true)` 开启送达回执功能。该配置默认为 `false`，如需送达回执必须设置为 `true`。
2. 消息发送方通过 `EMChatManager#addMessageListener` 注册消息监听器，并通过 `EMMessageListener#onMessageDelivered` 监听送达回执。
3. 消息接收方收到单聊消息后，SDK 自动向消息发送方发送送达回执，无需应用手动调用接口。
4. 消息发送方收到 `onMessageDelivered` 回调后，表示消息已送达接收方客户端。应用可据此更新消息的展示状态，也可调用 `EMMessage#isDelivered` 查询消息是否已送达。

:::tip 
消息送达回执仅支持单聊，不支持群聊和聊天室。
:::

#### 消息已读回执

Android SDK 使用 `EMChatManager#asyncSendMessageReadReceipts` 统一发送单聊和群聊消息的已读回执，消息发送方通过 `EMMessageListener#onMessageReadReceipts` 接收回执。

实现消息已读回执的基本流程如下：

![img](/images/android/message_read_receipt.png)

实现该功能的基本步骤如下：

1. 消息发送方在发送单聊或群聊消息前，调用 `EMMessage#setIsNeedReadReceipt(true)`，设置该消息需要已读回执。
2. 消息发送方通过 `EMChatManager#addMessageListener` 注册消息监听器，并通过 `EMMessageListener#onMessageReadReceipts` 监听已读回执。
3. 消息接收方在用户实际阅读消息后，调用 `asyncSendMessageReadReceipts` 发送一条或多条消息的已读回执。
4. 消息发送方收到 `onMessageReadReceipts` 回调后，可根据 `EMMessageReadReceipt#getMessageId` 定位消息，并更新对应消息的已读状态。

`asyncSendMessageReadReceipts` 单次最多可传入 50 条消息。所有消息必须属于同一会话，并且其 `EMMessage#isNeedReadReceipt()` 必须为 `true`。该接口仅支持单聊和群聊，不支持聊天室。

对于群聊消息，应用可以通过以下接口获取已读情况：

- `EMMessageReadReceipt#getReadCount` 或 `EMMessage#readReceiptCount`：获取群消息的已读人数。
- `EMChatManager#asyncGetGroupMessageReadReceipts`：批量获取多条群消息的已读回执详情，单次最多传入 20 条属于同一会话的消息。
- `EMChatManager#asyncFetchGroupMessageReadReceipts`：分页获取单条群消息的已读回执成员详情。

:::tip 
发送消息已读回执不会改变会话未读数。如需清零会话未读数，应另行调用 `asyncClearConversationUnreadMessageCount`；该操作不会向消息发送方发送已读回执。 
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 使用群消息已读回执前，已在 [环信控制台](/product/console/basic_message.html#群聊消息已读回执)开通该功能。

## 单聊消息送达回执

#### 步骤 1：开启送达回执

在调用 `EMClient#init` 前，通过 `EMOptions#setRequireDeliveryAck` 设置是否需要单聊消息送达回执。该配置默认为 `false`，如需送达回执必须设置为 `true`。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setRequireDeliveryAck(true);

EMClient.getInstance().init(getApplicationContext(), options);
```

开启后，接收方收到单聊消息时由 SDK 自动发送送达回执，无需应用主动调用发送接口。

#### 步骤 2：监听送达回执

发送方通过 `EMMessageListener#onMessageDelivered` 接收送达回执，并可通过 `EMMessage#isDelivered` 查询消息是否已送达。

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageDelivered(List<EMMessage> messages) {
        for (EMMessage message : messages) {
            boolean delivered = message.isDelivered();
            // 根据 delivered 更新消息的送达状态。
        }
    }
};

EMClient.getInstance()
        .chatManager()
        .addMessageListener(messageListener);

// 不再需要监听时移除监听器。
EMClient.getInstance()
        .chatManager()
        .removeMessageListener(messageListener);
```

## 单聊和群聊消息已读回执

单聊消息和群聊消息均支持已读回执功能。单聊消息已读回执功能默认开启，群消息已读回执功能使用前存在以下使用限制：

| 使用限制       | 默认设置   | 说明                                                         |
| :--------- | :----- | :------- | 
| 功能开通       | 关闭       | 使用前需在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯** > **基础功能** > **消息** 页面开通 **群聊消息已读回执**。|
| 使用权限       | 所有群成员 | 默认情况下，所有群成员发送消息时均可要求已读回执。若只允许群主和群管理员要求已读回执，请联系商务调整配置。 |
| 已读回执有效期 | 3 天       | 群消息已读回执的有效期为 3 天。消息发送时间超过 3 天后，服务器不再记录阅读该消息的群成员，也不会再发送该消息的已读回执。 |
| 群规模         | 200 人     | 该功能最多支持 200 人的群组。群成员数量超过 200 后，群消息不会返回已读回执，该上限目前无法提升。 |
| 查看已读人数   | 消息发送方 | 默认仅消息发送方可以查看群消息的已读人数。如需允许所有群成员查看，请联系商务开通。 |

:::tip
消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。 
:::

#### 步骤 1：设置消息需要已读回执

发送单聊或群聊消息前，调用 `EMMessage#setIsNeedReadReceipt(true)` 设置需要消息已读回执。该属性对单聊和群聊均有效。

单聊消息已读回执无需额外开通。群聊消息已读回执需先在环信控制台开通功能，再设置该属性。

```java
EMMessage message = EMMessage.createTextSendMessage(content, conversationId);
message.setChatType(EMMessage.ChatType.Chat); // 群聊时设置为 GroupChat。
message.setIsNeedReadReceipt(true);

EMClient.getInstance().chatManager().sendMessage(message);
```

#### 步骤 2：发送消息已读回执

接收方阅读消息后，调用 `asyncSendMessageReadReceipts` 批量发送已读回执。单次最多传入 50 条消息，所有消息必须属于同一会话，且 `isNeedReadReceipt()` 必须为 `true`。

```java
List<EMMessage> messages = Collections.singletonList(message);

// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncSendMessageReadReceipts(
                messages,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 当前批次的消息已读回执发送成功。
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                        // 根据错误码和错误信息处理。
                    }
                });
```

:::tip
建议只为接收方向、属于单聊或群聊且 `isNeedReadReceipt()` 为 `true` 的消息发送已读回执。视频、语音和文件等消息可在用户实际查看内容后再发送。
:::

#### 步骤 3：监听消息已读回执

发送方通过 `EMMessageListener#onMessageReadReceipts` 统一监听单聊和群聊消息的已读回执。回调返回  `List<EMMessageReadReceipt>`。每个回执对象提供以下信息：

| API                   | 返回类型  | 说明                               |
| --------------------- | --------- | ---------------------------------- |
| `getMessageId()`      | `String`  | 获取回执对应的消息 ID。            |
| `getConversationId()` | `String`  | 获取回执对应的会话 ID。            |
| `isPeerReceipt()`     | `boolean` | 判断是否为单聊对端发送的已读回执。 |
| `getReadCount()`      | `int`     | 获取群消息的已读人数。             |

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageReadReceipts(
            List<EMMessageReadReceipt> receipts) {
        for (EMMessageReadReceipt receipt : receipts) {
            String messageId = receipt.getMessageId();
            String conversationId = receipt.getConversationId();
            boolean peerRead = receipt.isPeerReceipt();
            int readCount = receipt.getReadCount();
            // 根据回执刷新单聊消息已读状态或群消息已读人数。
        }
    }

    @Override
    public void onReadReceiptForGroupMessageUpdated() {
        // 群消息读取状态已更新，可按需刷新界面。
    }
};

EMClient.getInstance()
        .chatManager()
        .addMessageListener(messageListener);

// 不再需要监听时移除监听器。
EMClient.getInstance()
        .chatManager()
        .removeMessageListener(messageListener);
```

## 获取群消息已读回执详情

### 批量获取多条群消息的回执汇总

调用 `asyncGetGroupMessageReadReceipts` 从服务器批量获取消息的已读回执详情。单次最多传入 20 条消息，且所有消息必须属于同一会话。

```java
// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncGetGroupMessageReadReceipts(
                messages,
                new EMValueCallBack<List<EMMessageReadReceipt>>() {
                    @Override
                    public void onSuccess(
                            List<EMMessageReadReceipt> receipts) {
                        // receipts 为各消息的已读回执详情。
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

### 获取单条群消息的回执成员详情

调用 `asyncFetchGroupMessageReadReceipts` 分页获取单条群消息的已读回执详情。目标消息必须是需要已读回执的群聊消息；`pageSize` 的取值范围为 `[1, 50]`。

首次调用时将 `startAckId` 传入 `null` 或空字符串。后续调用时，将上一次结果中的 `cursor` 作为新的 `startAckId`。

```java
// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncFetchGroupMessageReadReceipts(
                messageId,
                20,
                startAckId,
                new EMValueCallBack<EMCursorResult<EMGroupReadReceipt>>() {
                    @Override
                    public void onSuccess(
                            EMCursorResult<EMGroupReadReceipt> result) {
                        List<EMGroupReadReceipt> receipts = result.getData();
                        String nextCursor = result.getCursor();
                        // 保存 nextCursor，用于获取下一页。
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

`EMGroupReadReceipt` 提供以下信息：

- `getAckId`：已读回执 ID。
- `getMsgId`：消息 ID。
- `getFrom`：发送回执的群成员信息，类型为 `EMGroupMemberInfo`。
- `getCount`：已读人数。
- `getTimestamp`：已读回执时间戳。

## 事件说明

| 事件     | 触发时机     | 接收方                 |
| :--------- | :----- | :----- |  
| `EMMessageListener#onMessageReceived`                   | 收到普通消息时触发。                                         | 消息接收方；多设备场景下，发送方的其他在线设备也可能收到消息。 |
| `EMMessageListener#onMessageDelivered`                  | 接收方 SDK 自动发送单聊消息送达回执后触发。                  | 单聊消息发送方。                                             |
| `EMMessageListener#onMessageReadReceipts`               | 接收方调用 `asyncSendMessageReadReceipts` 发送一条或多条消息的已读回执后触发。 | 单聊或群聊消息发送方。                                       |
| `EMMessageListener#onReadReceiptForGroupMessageUpdated` | 群消息的读取状态更新时触发。                                 | 需要刷新群消息已读状态的客户端。                             |

## 查看消息送达和已读状态

| API | 适用场景 | 说明 |
| :--- | :--- | :--- |
| `EMMessage#isDelivered` | 单聊 | 查询消息是否已送达对端。 |
| `EMMessage#isPeerRead` | 单聊 | 查询对端是否已读该消息。 |
| `EMMessage#readReceiptCount` | 群聊 | 查询群消息的已读人数。 |
| `EMMessage#isRead` | 单聊、群聊 | 查询该消息在当前设备上的本地已读状态。 |
| `EMMessage#isNeedReadReceipt` | 单聊、群聊 | 查询该消息是否需要已读回执。 |

## 消息已读回执与会话未读数清零

发送消息已读回执和清零会话未读数是两个独立操作：

| 操作 | 作用 | 是否通知消息发送方 | 是否改变会话未读数 |
| :--- | :--- | :--- | :--- |
| `asyncSendMessageReadReceipts` | 为指定消息发送已读回执。 | 是 | 否 |
| `asyncClearConversationUnreadMessageCount` | 清除指定会话的本地未读数，并同步当前账号的其他设备。 | 否 | 是 |
| `asyncClearAllConversationUnreadMessageCount` | 清除所有本地会话的未读数，并同步当前账号的其他设备。详见 [会话未读数](conversation_unread.html) | 否 | 是 |

## 注意事项

- 消息送达回执仅支持单聊，不支持群聊和聊天室。
- 消息已读回执仅支持单聊和群聊，不支持聊天室。
- 单聊和群聊消息在发送前都需要调用 `EMMessage#setIsNeedReadReceipt(true)`。
- `asyncSendMessageReadReceipts` 单次最多传入 50 条消息。所有消息必须属于同一会话，且其 `isNeedReadReceipt()` 必须为 `true`。
- 调用 `asyncSendMessageReadReceipts` 的客户端不会通过 `onMessageReadReceipts` 收到自己发送的回执；该回调由原消息发送方收到。
- 群消息已读回执功能需要在环信控制台开通，并受有效期、群规模和查看权限等服务端配置限制。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setRequireDeliveryAck`](#步骤-1-开启送达回执) | `EMOptions` | 设置是否需要单聊消息送达回执。 |
| [`init`](#步骤-1-开启送达回执) | `EMClient` | 使用指定配置初始化 SDK。 |
| [`createTextSendMessage`](#步骤-1-设置消息需要已读回执) | `EMMessage` | 创建文本消息。 |
| [`sendMessage`](#步骤-1-设置消息需要已读回执) | `EMChatManager` | 发送消息。 |
| [`asyncSendMessageReadReceipts`](#步骤-2-发送消息已读回执) | `EMChatManager` | 批量发送单聊或群聊消息的已读回执。 |
| [`getMessageId`](#步骤-3-监听消息已读回执) / [`getConversationId`](#步骤-3-监听消息已读回执) | `EMMessageReadReceipt` | 获取回执对应的消息 ID 和会话 ID。 |
| [`isPeerReceipt`](#步骤-3-监听消息已读回执) / [`getReadCount`](#步骤-3-监听消息已读回执) | `EMMessageReadReceipt` | 获取单聊对端回执状态或群消息已读人数。 |
| [`asyncGetGroupMessageReadReceipts`](#批量获取多条群消息的回执汇总) | `EMChatManager` | 批量获取多条群消息的已读回执详情。 |
| [`asyncFetchGroupMessageReadReceipts`](#获取单条群消息的回执成员详情) | `EMChatManager` | 分页获取单条群消息的已读回执成员详情。 |
| [`getAckId`](#获取单条群消息的回执成员详情) / [`getMsgId`](#获取单条群消息的回执成员详情) / [`getFrom`](#获取单条群消息的回执成员详情) / [`getCount`](#获取单条群消息的回执成员详情) / [`getTimestamp`](#获取单条群消息的回执成员详情) | `EMGroupReadReceipt` | 获取群消息已读回执详情。 |
| [`readReceiptCount`](#查看消息送达和已读状态) | `EMMessage` | 查询群消息的已读人数。 |
| [`asyncClearConversationUnreadMessageCount`](#消息已读回执与会话未读数清零) | `EMChatManager` | 清除指定会话的本地未读消息数。 |
| [`asyncClearAllConversationUnreadMessageCount`](#消息已读回执与会话未读数清零) | `EMChatManager` | 清除所有本地会话的未读消息数。 |
