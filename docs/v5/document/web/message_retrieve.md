# 获取历史消息

## 功能说明

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

本文介绍环信即时通讯 IM SDK 如何从服务器获取历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 初始化 SDK 时已注册 `ChatManager`，能够通过 `client.chatManager` 调用历史消息相关接口。

## 从服务器获取指定会话的消息

你可以调用 `getHistoryMessages` 方法从服务器分页拉取指定会话的历史消息，并通过 `searchDirection`、`senderIds`、`messageTypes`、`startTime` 和 `endTime` 等参数控制拉取方向和过滤条件。为确保数据可靠，我们建议你每次获取 20 条消息，最大不超过 50。

对于群组聊天，你可以通过设置 `senderIds` 参数拉取群组中一个或多个成员发送的历史消息。

:::tip
1. **默认可获取单聊和群组聊天的历史消息。若要获取聊天室的历史消息，需联系环信商务。**
2. 获取单聊历史消息时会读取服务端保存的消息送达状态和已读状态。该功能默认关闭，如果需要，请联系环信商务开通。
3. 历史消息在服务器上的存储时间与产品的套餐包相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。
:::

```typescript
const result = await client.chatManager.getHistoryMessages({
  conversationId: 'user2',
  conversationType: 'singleChat',
   pageSize: 20, // 每页获取的消息数量。取值范围为 1-50，默认值为 20。若满足查询条件的消息总数大于 `pageSize` 的数量，则返回 `pageSize` 数量的消息，若小于 `pageSize` 的数量，返回实际条数。消息查询完毕时，返回的消息条数小于 `pageSize` 的数量。
  cursor: '', // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  searchDirection: 'down', // 'up' 向前翻页 | 'down' 向后翻页
});

console.log('消息列表:', result.items);
console.log('下一页 cursor:', result.cursor);
console.log('是否还有更多:', result.hasMore);
```

此外，你可以调用 `getHistoryMessages` 方法从服务器获取指定会话的历史消息。你可以指定消息查询方向，即明确按时间顺序或逆序获取。

为确保数据可靠，我们建议你每次获取 20 条消息，最大不超过 50；如果还有更多数据，可根据返回的 `cursor` 继续分页获取。

```typescript
const result = await client.chatManager.getHistoryMessages({
  conversationId: 'group1',
  conversationType: 'groupChat',
  pageSize: 20,
  cursor: '',
  senderIds: ['user1'],        // 按发送者过滤，仅在群聊场景下生效
  messageTypes: ['text'],      // 按消息类型过滤
  startTime: 1700000000000,    // 起始时间戳，单位为毫秒
  endTime: 1700100000000,      // 结束时间戳，单位为毫秒
  },
});
```

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getHistoryMessages`](#从服务器获取指定会话的消息) | `ChatManager` | 分页从服务器拉取指定会话的历史消息。 |
