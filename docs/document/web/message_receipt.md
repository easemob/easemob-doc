# 实现消息回执

## 功能说明

**消息送达回执** 表示消息已成功送达接收方设备。接收方开启该能力后，收到单聊消息时 SDK 会自动向发送方回发送达回执。发送方可通过送达回执确认消息是否已经到达对方客户端。

**消息已读回执** 表示接收方已阅读指定消息。接收方阅读消息后，需要发送消息已读回执，消息发送方收到回执后可更新对应消息的已读状态。

消息送达回执和已读回执的效果示例，如下图所示：

![img](/images/web/message_receipt.png)

## 使用限制

- 单聊会话支持消息送达回执和消息已读回执。
- 群聊会话支持消息已读回执，不支持消息送达回执。
- 聊天室暂不支持消息送达回执和消息已读回执。
- **群聊消息已读回执需要在 [环信控制台开通该功能](/product/console/basic_message.html#群聊消息已读回执)。**

## 前提条件

- 已完成 [SDK 初始化](initialization.html)，并实现注册账号和登录功能。
- 已注册并使用 `ChatManager`，通过 `client.chatManager` 调用本文中的消息、回执和事件监听接口。
- 若需使用群聊消息已读回执，已在 [环信控制台开通该功能](/product/console/basic_message.html#群聊消息已读回执)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

#### 单聊消息送达回执

实现单聊消息送达回执的流程如下：

![img](/images/web/message_delivery_receipt.png)

实现该功能的基本步骤如下：

1. 消息发送方注册消息监听器，监听送达回执事件 `onMessageDelivered`。
2. 消息接收方初始化 SDK 时设置 `enableDeliveryReceipt: true`。
3. 消息接收方收到单聊消息后，SDK 自动向消息发送方回发送达回执，无需手动调用接口。
4. 消息发送方收到 `onMessageDelivered` 事件后，表示接收方 SDK 已回发送达回执，业务侧可据此更新本地展示状态，例如，标记该消息已送达。

#### 消息已读回执

SDK 使用 `sendMessageReadReceipts` 发送单聊和群聊消息已读回执，消息发送方通过 `onMessageReadReceipts` 事件接收回执。

实现消息已读回执的基本流程如下：

![img](/images/web/message_read_receipt.png)

实现该功能的基本步骤如下：

1. 消息发送方注册消息监听器，监听已读回执事件 `onMessageReadReceipts`。
2. 消息接收方收到单聊或群聊消息后，在用户阅读消息时调用 `sendMessageReadReceipts` 发送已读回执。
3. 消息原始发送方收到 `onMessageReadReceipts` 事件后，可根据事件中的 `messageIds` 更新对应消息的已读状态。

对于群聊消息，若发送方需要统计群成员已读情况，发送消息时需设置 `needReadReceipt: true`。群成员阅读消息并发送已读回执后，消息发送方可通过 `onMessageReadReceipts` 感知消息已读状态；如需查询某条群消息的已读成员列表，可调用 `getGroupMessageReadUsers`。

## 单聊消息送达回执

#### 步骤 1：接收方开启送达回执

消息接收方在初始化 SDK 时，设置 `enableDeliveryReceipt: true`，默认是 `false`。

```typescript
const client = ChatClient.init({
  appKey: 'org#app',
  // 开启单聊消息送达回执。
  enableDeliveryReceipt: true,
  managers: [ChatManager],
});
```

#### 步骤 2：发送方监听送达回执

消息发送方监听 `onMessageDelivered` 事件。

```typescript
client.chatManager.addEventHandler('message-delivery-listener', {
  onMessageDelivered: event => {
    // 已送达的原始消息 ID。
    console.log('消息已送达:', event.messageId);
    // 会话 ID。
    console.log('会话 ID:', event.conversationId);
    // 会话类型，单聊场景固定为 singleChat。
    console.log('会话类型:', event.conversationType);
  },
});
```

#### 步骤 3：发送单聊消息

发送一条单聊消息：

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  content: 'Hello',
});

await client.chatManager.sendMessage(message);
```

消息接收方收到单聊消息后，SDK 会自动向消息发送方回发送达回执。消息发送方收到 `onMessageDelivered` 后，可更新本地消息状态。

## 单聊消息已读回执

单聊消息已读回执用于通知消息发送方：指定单聊消息已被接收方阅读。

:::tip
消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。 
:::

#### 步骤 1：发送方注册已读回执监听

```typescript
client.chatManager.addEventHandler('single-read-receipt-listener', {
  onMessageReadReceipts: receipts => {
    for (const receipt of receipts) {
      console.log('会话 ID:', receipt.conversationId);
      console.log('会话类型:', receipt.conversationType); // singleChat
      console.log('已读消息 ID 列表:', receipt.messageIds);
      console.log('回执时间:', receipt.timestamp);
    }
  },
});
```

#### 步骤 2：发送单聊消息

发送一条单聊消息。对于单聊消息，无需设置 `needReadReceipt: true`。接收方阅读后可以直接发送单聊消息已读回执。

```typescript
const message = client.chatManager.createTextMessage({
  // 接收方用户 ID。
  conversationId: 'user2',
  // 会话类型：单聊。
  conversationType: 'singleChat',
  // 文本消息内容。
  content: 'Hello',
});

await client.chatManager.sendMessage(message);
```

#### 步骤 3：接收方发送已读回执

接收方收到消息并阅读后，调用 `sendMessageReadReceipts` 发送消息已读回执。

```typescript
client.chatManager.addEventHandler('single-message-listener', {
  onMessage: async message => {
    if (message.conversationType !== 'singleChat') {
      return;
    }

    await client.chatManager.sendMessageReadReceipts({
      conversationId: message.conversationId,
      // 仅支持 `singleChat` 和 `groupChat`。
      conversationType: 'singleChat',
      // `messageIds` 必须为非空数组，消息 ID 数量不超过 50。一次调用只能发送同一会话内的消息已读回执。
      messageIds: [message.msgServerId],
    });
  },
});
```

:::tip
`sendMessageReadReceipts` 仅用于发送消息级已读回执，不会更新会话级已读位置，也不会直接清零本地会话未读数。如需清零会话未读数，请使用 [会话未读数清零](conversation_unread.html)。
:::

#### 步骤 4：发送方收到已读回执后更新消息状态

消息发送方收到 `onMessageReadReceipts` 事件后，可根据事件中的 `messageIds` 更新对应消息的已读状态。

## 群聊消息已读回执

对于群聊，群成员发送消息时，可以设置该消息是否需要已读回执。若需要，群成员阅读消息后，业务侧应在合适时机调用 `sendMessageReadReceipts` 发送已读回执；阅读该消息并成功发送回执的群成员数量即为已读回执数量。

群消息已读回执特性的使用限制如下表所示：

| 使用限制       | 默认       | 说明                                                         |
| :------- | :------- | :-------------- |
| 功能开通       | 关闭       | 若要使用该功能，你需要在 [环信控制台](https://console.easemob.com/user/login) 的 **即时通讯** > **基础功能** > **消息** 页签下开通 **群聊消息已读回执**。若未开通，SDK 返回错误码 `505`，Key 为 `SERVICE_NOT_ENABLED`。 |
| 使用权限       | 所有群成员 | 默认情况下，所有群成员发送消息时均可请求群消息已读回执。如果调整为仅群主和群管理员可使用，可联系商务修改，此时普通成员发送需要群消息已读回执的消息时，SDK 返回错误码 `603`，Key 为 `GROUP_PERMISSION_DENIED`。    |
| 已读回执有效期 | 3 天       | 群聊消息已读回执的有效期默认为 3 天。超过有效期后，服务端不再记录该消息的新增已读状态，SDK 返回错误码 `506`，Key 为 `MESSAGE_EXPIRED`。 |
| 群规模   | 200 人 | 该能力当前最多支持 200 人群组。当群人数超过上限时，群消息可能无法继续产生有效的已读回执统计；服务端返回 `limit send group ack msg` 时，SDK 可能返回错误码 `4`，Key 为 `SERVICE_LIMIT_EXCEEDED`。 |
| 查看已读人数   | 消息发送方 | 默认情况下，仅消息发送方可查看某条群消息的已读人数（已读回执数量）或已读成员列表。如需所有群成员均可查看，需联系商务开通。 |

:::tip
消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。 
:::

#### 步骤 1：发送需要已读回执的群聊消息

发送群消息时，若需要群成员阅读后回送已读回执，创建消息时设置 `needReadReceipt: true`。

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'group_1',
  conversationType: 'groupChat',
  content: 'hello group',
  // 请求群消息已读回执。
  needReadReceipt: true,
});

await client.chatManager.sendMessage(message);
```

#### 步骤 2：发送方注册已读回执监听

群消息发送方通过 `onMessageReadReceipts` 接收群消息已读回执。

```typescript
client.chatManager.addEventHandler('group-read-receipt-listener', {
  onMessageReadReceipts: receipts => {
    for (const receipt of receipts) {
      console.log('群组 ID:', receipt.conversationId);
      console.log('会话类型:', receipt.conversationType); // groupChat
      console.log('已读消息 ID 列表:', receipt.messageIds);
      console.log('回执时间:', receipt.timestamp);
    }
  },
});
```

#### 步骤 3：群成员发送已读回执

群成员阅读消息后，调用 `sendMessageReadReceipts` 发送群消息已读回执。

```typescript
await client.chatManager.sendMessageReadReceipts({
  conversationId: groupMessage.conversationId,
  // 仅支持 `singleChat` 和 `groupChat`。
  conversationType: 'groupChat',
  // `messageIds` 必须为非空数组，消息 ID 数量不超过 50。一次调用只能发送同一会话内的消息已读回执。
  messageIds: [groupMessage.msgServerId],
});
```

## 获取群消息已读回执详情

### 查询单条群消息的已读成员列表

消息发送方可调用 `getGroupMessageReadUsers` 分页查询已读某条群消息的成员列表。

```typescript
const result = await client.chatManager.getGroupMessageReadUsers({
  groupId: 'group_1',
  messageId: 'msg-id-123',
  pageSize: 20,
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  cursor: '',
});

console.log('群组 ID:', result.groupId);
console.log('消息 ID:', result.messageId);
console.log('已读成员列表:', result.users);
console.log('已读成员总数:', result.count);
console.log('下一页游标:', result.cursor);
console.log('是否还有更多:', result.hasMore);
```

`result.users` 中的每一项包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | String | 已读成员的用户 ID。 |
| `user` | UserInfo | 已读成员的用户资料摘要。 |
| `ackId` | String | 服务端回执 ID。 |
| `timestamp` | Number | 已读时间戳，单位为毫秒。 |
| `ackContent` | String | 服务端返回的自定义回执内容。当前 `sendMessageReadReceipts` 不支持传入该字段。 |

### 批量查询群消息已读数量

你也可以调用 `getGroupMessageReadReceipts` 批量查询一组群消息的已读数量。该接口仅支持群聊。

```typescript
const details = await client.chatManager.getGroupMessageReadReceipts({
  conversationId: 'group_1',
  conversationType: 'groupChat',
  // 最多可传入 20 个消息 ID。
  messageIds: ['msg-id-1', 'msg-id-2'],
});

details.forEach(item => {
  console.log('消息 ID:', item.messageId);
  console.log('已读数量:', item.count);
});
```

返回结果中的每一项为 `MessageReadReceiptDetail`，包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `messageId` | String | 群消息 ID。 |
| `count` | Number | 该消息的已读数量。 |

## 事件说明

| 事件 | 触发时机 | 接收方 |
| :--- | :--- | :--- |
| `onMessageDelivered` | 接收方 SDK 自动发送单聊消息送达回执后触发。 | 单聊消息的发送方。 |
| `onMessageReadReceipts` | 对方用户或群成员调用 `sendMessageReadReceipts` 发送一条或多条消息已读回执后触发。 | 消息的发送方。 |
| `onMessage` | 收到普通消息后触发。 | 消息接收方；发送方的其他在线设备也可能收到该事件。 |

`onMessageReadReceipts` 的事件负载为数组。每个回执对象包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | String | 会话 ID。单聊时为对端用户 ID，群聊时为群组 ID。 |
| `conversationType` | String | 会话类型，取值为 `singleChat` 或 `groupChat`。 |
| `messageIds` | List | 本次回执包含的消息 ID 列表。 |
| `timestamp` | Number | 回执时间戳。 |

## 注意事项

- 消息送达回执仅支持单聊，群聊和聊天室均不支持。
- 消息已读回执仅支持单聊和群聊，聊天室不支持。
- `sendMessageReadReceipts` 的本地调用方不会收到 `onMessageReadReceipts`；该事件发送给消息发送方。
- `sendMessageReadReceipts` 不会更新会话级已读位置，也不会直接清零本地会话未读数。
- 若需要清零会话未读数，请调用 `clearConversationUnreadMessageCount` 或 `clearAllConversationUnreadMessageCount`，详见 [会话未读数清零](conversation_unread.html)。
- `needReadReceipt` 主要用于群聊消息已读回执统计；单聊消息已读回执无需设置该参数，聊天室消息不支持已读回执。

## 消息已读回执与会话未读数关系

`sendMessageReadReceipts` 与会话未读数没有直接关系。调用该方法后，当前调用方本地的会话未读数不会变化，也不会自动清零。该方法主要用于向消息原始发送方发送“消息已读回执”，表示某一条或多条单聊或群聊消息已经被阅读。

如果用户进入会话后需要清零该会话的未读数，应调用 `clearConversationUnreadMessageCount`；如果需要清零全部会话未读数，应调用 `clearAllConversationUnreadMessageCount`。

## 接口列表

| API | 所属模块或类 | 说明 |
| --- | --- | --- |
| [`ChatClient.init`](#步骤-1-接收方开启送达回执) | `ChatClient` | 初始化 SDK；接收方可通过 `enableDeliveryReceipt` 开启单聊送达回执自动回送能力。 |
| [`createTextMessage`](#步骤-1-发送需要已读回执的群聊消息) | `ChatManager` | 创建文本消息；可在群聊已读统计场景设置 `needReadReceipt: true`。 |
| [`sendMessage`](#步骤-1-发送需要已读回执的群聊消息) | `ChatManager` | 发送消息。 |
| [`sendMessageReadReceipts`](#步骤-3-群成员发送已读回执) | `ChatManager` | 批量发送单聊或群聊消息已读回执。 |
| [`getGroupMessageReadUsers`](#查询单条群消息的已读成员列表) | `ChatManager` | 分页查询某条群消息的已读成员列表。 |
| [`getGroupMessageReadReceipts`](#批量查询群消息已读数量) | `ChatManager` | 批量查询群消息已读数量。 |
