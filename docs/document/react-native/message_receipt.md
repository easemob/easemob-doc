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

![单聊消息送达回执流程](/images/android/message_delivery_receipt.png)

实现该功能的基本步骤如下：

1. 消息接收方在初始化时设置 `ChatOptions#requireDeliveryAck: true`。该配置默认为 `false`。
2. 消息发送方注册 `ChatMessageEventListener`，监听 `onMessagesDelivered`。
3. 消息接收方收到单聊消息时，由 SDK 自动回发送达回执，无需业务侧调用发送接口。
4. 消息发送方收到回调后，可读取消息的 `hasDeliverAck` 并更新送达状态。

:::tip 
消息送达回执仅支持单聊，不支持群聊和聊天室。
:::

#### 消息已读回执

实现消息已读回执的基本流程如下：

![消息已读回执流程](/images/android/message_read_receipt.png)

React Native SDK 通过 `ChatManager#sendMessageReadReceipts` 统一发送单聊和群聊消息的已读回执，通过 `onMessageReadReceipts` 统一监听回执：

1. 消息发送方发送消息前，将 `ChatMessage#isNeedReadReceipt` 设置为 `true`，该属性默认为 `false`。
2. 消息发送方注册消息监听器，监听 `onMessageReadReceipts`。
3. 消息接收方在用户实际阅读后，按消息 ID 批量发送已读回执。
4. 消息发送方根据回执的 `msgId` 定位消息，更新单聊已读状态或群消息已读人数。

发送回执时，每批最多 50 条同一会话的消息，且消息必须设置为需要已读回执。群聊还可批量查询最多 20 条消息的回执汇总，或分页获取单条群消息的已读成员详情。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 使用群消息已读回执前，已在 [环信控制台](/product/console/basic_message.html#群聊消息已读回执) 开通该功能。

## 单聊消息送达回执

#### 步骤 1：开启送达回执

接收方应在 `ChatClient#init` 时设置 `requireDeliveryAck: true`。初始化后修改 JavaScript 配置对象不会重新初始化 SDK。

```typescript
async function initializeSdk(): Promise<void> {
  try {
    const options = ChatOptions.withAppKey({
      appKey: '<org_name>#<app_name>',
      requireDeliveryAck: true,
    });
    await ChatClient.getInstance().init(options);
  } catch (error: unknown) {
    console.error('初始化 SDK 失败：', error);
  }
}
```

开启后，接收方收到单聊消息时 SDK 自动发送送达回执。

#### 步骤 2：监听送达回执

发送方通过 `ChatMessageEventListener#onMessagesDelivered` 监听送达状态，读取回调中消息对象的 `hasDeliverAck` 查询消息是否已送达。

```typescript
const manager = ChatClient.getInstance().chatManager;
const listener: ChatMessageEventListener = {
  onMessagesDelivered: (messages) => {
    for (const message of messages) {
      console.log('消息送达状态：', message.msgId, message.hasDeliverAck);
    }
  },
};
manager.addMessageListener(listener);

// 页面或组件销毁、不再需要监听时执行
// manager.removeMessageListener(listener);
```

## 单聊和群聊消息已读回执

单聊消息和群聊消息均支持已读回执功能。单聊消息已读回执功能默认开启，但发送方仍需在发送消息前将 `isNeedReadReceipt` 设为 `true`。单聊消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。


群消息已读回执还受以下服务端限制：

| 使用限制 | 默认设置 | 说明 |
| :--- | :--- | :--- |
| 功能开通 | 关闭 | 在控制台 **即时通讯 > 基础功能 > 单聊与群聊** 页面开通 **群聊消息已读回执**。 |
| 使用权限 | 所有群成员 | 如需仅群主和管理员可要求回执，请联系环信商务调整。 |
| 已读回执有效期 | 3 天 | 超过有效期后，服务端不再记录阅读成员，也不再发送该消息的已读回执。 |
| 群规模 | 200 人 | 超过 200 人的群组不返回群消息已读回执，该上限目前无法提升。 |
| 查看已读人数 | 消息发送方 | 如需所有成员均可查看，请联系环信商务开通。 |

#### 步骤 1：设置消息需要已读回执

发送单聊或群聊消息前，设置 `isNeedReadReceipt = true` 为需要消息已读回执。该属性对单聊和群聊均有效。

单聊消息已读回执无需额外开通。群聊消息已读回执需先在环信控制台开通功能，再设置该属性。

```typescript
const message = ChatMessage.createTextMessage(
  '<target_user_id>',
  '需要已读回执的消息',
  ChatMessageChatType.PeerChat
);
// 群聊时目标 ID 改为群组 ID，chatType 改为 GroupChat
message.isNeedReadReceipt = true;

ChatClient.getInstance().chatManager.sendMessage(message, {
  onSuccess: (sentMessage) => {
    console.log('发送成功：', sentMessage.msgId);
  },
  onError: (localMsgId, error) => {
    console.error('发送失败：', localMsgId, error.code, error.description);
  },
}).catch((error: unknown) => {
  console.error('发起发送失败：', error);
});
```

#### 步骤 2：发送消息已读回执

接收方阅读消息后，调用 `sendMessageReadReceipts(msgIds)`，返回 `Promise<void>`。不要仅因收到 `onMessagesReceived` 就认定用户已阅读。

- 每批最多 50 条消息，且必须属于同一会话。
- 目标为接收方向的单聊或群聊消息，且 `isNeedReadReceipt` 为 `true`。
- 应由业务侧记录已提交的回执，避免重复发送；视频、语音和文件可在用户实际查看内容后提交。
- 原生桥接先按 ID 获取本地消息，不存在的 ID 会被忽略；不要传入本地不存在的消息 ID。

```typescript
async function sendReadReceipt(message: ChatMessage): Promise<void> {
  try {
    await ChatClient.getInstance().chatManager
      .sendMessageReadReceipts([message.msgId]);
    console.log('消息已读回执发送成功');
  } catch (error: unknown) {
    console.error('发送已读回执失败：', error);
  }
}
```

不要将接收方向消息的 `isPeerRead` 作为“本机是否已经发送回执”的通用标记；该属性用于单聊发送方判断对端是否已读。发送回执不会清零会话未读数。

#### 步骤 3：监听消息已读回执

发送方通过 `onMessageReadReceipts` 获取 `ChatMessageReadReceipt[]`：

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `msgId` | `string` | 回执对应的消息 ID。 |
| `convId` | `string` | 回执对应的会话 ID。 |
| `isPeerReceipt` | `boolean` | `true` 表示来自单聊对端或群成员；`false` 表示来自当前账号的其他设备。 |
| `readCount` | `number` | 群消息已读人数；单聊中为 0。 |

```typescript
const manager = ChatClient.getInstance().chatManager;
const listener: ChatMessageEventListener = {
  onMessageReadReceipts: (receipts) => {
    for (const receipt of receipts) {
      console.log('消息回执：', {
        msgId: receipt.msgId,
        convId: receipt.convId,
        isPeerReceipt: receipt.isPeerReceipt,
        readCount: receipt.readCount,
      });
      // 按消息 ID 更新已读展示，或重新读取对应本地消息
    }
  },
};
manager.addMessageListener(listener);

// 页面或组件销毁、不再需要监听时执行
// manager.removeMessageListener(listener);
```

## 获取群消息已读回执详情

### 批量获取多条群消息的回执汇总

调用 `ChatManager#getGroupMessageReadReceipts(msgIds)` 从服务器批量获取指定群消息的已读回执汇总信息，返回 `Promise<ChatMessageReadReceipt[]>`。每个 `ChatMessageReadReceipt` 对应一条消息，包含以下属性：

- `msgId`：消息 ID。
- `convId`：消息所属的群聊会话 ID。
- `readCount`：该群消息的已读回执数量，可用于展示已读人数。
- `isPeerReceipt`：回执是否来自对方。`true` 表示来自其他群成员；`false` 表示来自当前用户的其他登录设备。 // TODO：研发确认：AI 是这样说的，对吗：本接口的查询结果不提供可靠的回执来源标识，不应通过该字段判断回执来自其他群成员还是当前用户的其他设备。

每次最多查询 20 条消息，且这些消息必须属于同一群聊会话。查询前，请确保目标消息已保存在本地；本地不存在的消息 ID 会被忽略。

该接口不返回已读成员列表。如需查询指定消息的已读成员及回执时间等明细，可调用 `ChatManager#fetchGroupMessageReadReceipts` 分页获取。

```typescript
ChatClient.getInstance().chatManager.getGroupMessageReadReceipts([
  '<group_message_id_1>',
  '<group_message_id_2>',
]).then((receipts) => {
  for (const receipt of receipts) {
    console.log('群消息已读人数：', receipt.msgId, receipt.readCount);
  }
}).catch((error: unknown) => {
  console.error('获取群消息回执汇总失败：', error);
});
```

### 获取单条群消息的回执成员详情

调用 `ChatManager#fetchGroupMessageReadReceipts` 可从服务端分页获取指定群消息的已读回执详情，包括发送回执的成员信息、回执时间等。目标消息必须是需要已读回执的群聊消息。**使用 React Native SDK 5.0.0 的 Android 端时，请在调用前通过 `ChatManager#getMessage` 确认目标消息在本地存在，并在查询完成前保留该本地消息。**

接口返回 `Promise<ChatCursorResult<ChatGroupReadReceipt>>`，其中 `list` 为当前页的已读回执列表，`totalCount` 表示已读回执总数，仅 iOS 提供，Android 为 undefined，不作为通用分页依据。`list` 中的每个 `ChatGroupReadReceipt` 对象包含以下属性：

- `ackId`：已读回执 ID。
- `msgId`：回执对应的消息 ID。
- `from`：发送回执的成员信息，可通过 `from.memberId` 读取用户 ID。
- `count`：该回执记录携带的已读回执数量，不应作为分页结果的总数或翻页依据。
- `timestamp`：回执发送时间戳，单位为毫秒。

## 事件说明

| 事件 | 触发时机 | 接收方 |
| :--- | :--- | :--- |
| `onMessagesReceived` | 收到普通消息时。 | 消息接收方；多设备场景下，发送方的其他在线设备也可能收到消息。 |
| `onMessagesDelivered` | SDK 自动返回单聊送达回执后。 | 单聊消息发送方。 |
| `onMessageReadReceipts` | 接收方发送已读回执，或本账号其他设备同步阅读状态时。 | 原消息发送方，或接收当前账号其他设备回执的客户端。 |

## 查看消息送达和已读状态

请以最新回调或重新查询返回的消息对象为准，之前获取的 JavaScript 消息对象不会自动更新。

| 属性 | 适用场景 | 说明 |
| :--- | :--- | :--- |
| `hasDeliverAck` | 单聊 | 查询消息是否已送达对端。 |
| `isPeerRead` | 单聊 | 查询对端是否已读该消息。 |
| `groupReadReceiptCount` | 群聊 | 查询群消息的已读人数。 |
| `isRead` | 单聊、群聊 | 查询该消息在当前设备上的本地已读状态。 |
| `isNeedReadReceipt` | 单聊、群聊 | 查询该消息是否需要已读回执，发送前设置。 |

## 消息已读回执与会话未读数清零


发送消息已读回执和清零会话未读数是两个独立操作：

| 操作 | 作用 | 是否通知原消息发送方 | 是否改变会话未读数 |
| :--- | :--- | :--- | :--- |
| `sendMessageReadReceipts` | 为指定消息发送已读回执。 | 是 | 否 |
| `clearConversationUnreadMessageCount(convId)` | 清零指定本地会话的未读数，并尝试同步至当前账号的其他设备。 | 否 | 是 |
| `clearAllConversationUnreadMessageCount()` | 清零所有本地会话未读数，并尝试同步至当前账号的其他设备。 | 否 | 是 |

上述清零接口的 Promise 正常完成，并不表示当前账号的其他设备已同步完成。清零会话未读数的详细说明见 [会话未读数](conversation_unread.html)。读取消息本身不会发送回执或清零未读数。

## 注意事项

- 消息送达回执仅支持单聊，不支持群聊和聊天室。
- 消息已读回执仅支持单聊和群聊，不支持聊天室。
- 单聊和群聊均需在发送前设置 `isNeedReadReceipt = true`，默认不要求回执。
- 发送回执每批最多 50 条同会话消息；批量查询群回执每批最多 20 条同群消息。
- 本地不存在的消息 ID 不能直接用于回执查询或发送；群成员详情查询尤其应避免触发 Android 已知问题。
- 调用方不会以“收到自己的回执”作为发送成功依据，应使用 Promise 结果；原消息发送方通过事件获取已读变化。
- 群回执受开通状态、有效期、群规模和查看权限限制。失败时先检查这些条件及连接状态，不要无限重试。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`requireDeliveryAck`](#步骤-1-开启送达回执) | `ChatOptions` | 初始化时开启单聊送达回执。 |
| [`init`](#步骤-1-开启送达回执) | `ChatClient` | 初始化 SDK。 |
| [`isNeedReadReceipt`](#步骤-1-设置消息需要已读回执) | `ChatMessage` | 按消息设置是否要求已读回执。 |
| [`sendMessageReadReceipts`](#步骤-2-发送消息已读回执) | `ChatManager` | 批量发送单聊和群聊已读回执。 |
| [`onMessageReadReceipts`](#步骤-3-监听消息已读回执) | `ChatMessageEventListener` | 监听统一的已读回执事件。 |
| [`getGroupMessageReadReceipts`](#批量获取多条群消息的回执汇总) | `ChatManager` | 批量获取群消息回执汇总。 |
| [`fetchGroupMessageReadReceipts`](#获取单条群消息的回执成员详情) | `ChatManager` | 分页获取已读群成员详情。 |
| [`ChatMessageReadReceipt`](#步骤-3-监听消息已读回执) | 模型类 | 消息 ID、会话 ID、回执来源和已读人数。 |
| [`ChatGroupReadReceipt`](#获取单条群消息的回执成员详情) | 模型类 | 已读回执成员详情。 |
| [`clearConversationUnreadMessageCount`](#消息已读回执与会话未读数清零) | `ChatManager` | 清零指定会话未读数。 |
| [`clearAllConversationUnreadMessageCount`](#消息已读回执与会话未读数清零) | `ChatManager` | 清零所有会话未读数。 |
