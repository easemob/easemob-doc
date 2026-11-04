# 消息置顶

## 功能说明

消息置顶是指将会话中的重要消息标记为置顶，方便会话成员集中查看和快速定位。

**单聊、群聊和聊天室均支持该功能。** 置顶状态保存在服务端，并在同一会话的相关用户之间同步。

同一会话可以置顶多条消息。应用可以从服务端获取指定会话的置顶消息列表，并通过消息置顶事件及时更新页面。对于单条消息，还可以读取单条消息最近一次置顶的操作者和置顶时间。

## 功能开通

使用消息置顶功能前，需要联系环信商务开通。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录、连接服务器，详见 [快速开始](quickstart.html)。
- 已联系环信商务开通消息置顶功能。
- 已了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。

## 置顶消息

调用 `ChatManager#pinMessage(messageId)`，传入非空消息 ID，返回 `Promise<void>`。置顶成功后，会话中的其他用户会收到 `ChatMessageEventListener#onMessagePinChanged` 回调。多设备登录场景下，当前账号的其他在线设备同步到该状态变化后，也会收到该回调。

同一条消息可被有置顶权限的多个用户重复置顶，但仅保留最近一次成功置顶的信息。因此，通过 `ChatManager#getMessagePinInfo` 获取的 `ChatMessagePinInfo` 中，`operatorId` 和 `pinTime` 分别对应最近一次置顶的操作者用户 ID 和置顶时间。

需要注意的是，只有仍保存在服务端的消息才能置顶。如果消息仅存在于本地，但已因超过保存期限从服务端删除，置顶会失败。

**单个会话默认最多置顶 20 条消息；如需提高上限，可联系环信商务调整，最高支持 100 条。**

```typescript
ChatClient.getInstance().chatManager.pinMessage('<message_id>')
  .then(() => console.log('消息置顶成功'))
  .catch((error: unknown) => console.error('消息置顶失败：', error));
```

## 取消置顶消息

调用 `ChatManager#unpinMessage(messageId)`，传入非空的消息 ID，取消置顶消息。取消置顶成功后，会话中的其他用户会收到 `onMessagePinChanged` 回调。多设备登录场景下，当前账号的其他在线设备同步到该状态变化后，也会收到该回调。

单聊、群聊或聊天室中的用户均可取消置顶消息，不论该消息最初由哪个用户置顶。取消成功后，该消息不再出现在服务端返回的会话置顶列表中，查询单条消息置顶详情时返回 `undefined`。

```typescript
ChatClient.getInstance().chatManager.unpinMessage('<message_id>')
  .then(() => console.log('取消置顶成功'))
  .catch((error: unknown) => console.error('取消置顶失败：', error));
```

## 获取单个会话中的置顶消息

调用 `ChatManager#fetchPinnedMessages(convId, convType, isChatThread?)` 从服务端获取指定会话中的全部置顶消息，返回 `Promise<ChatMessage[]>`，按置顶时间倒序排列。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `convId` | `string` | 是 | 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `convType` | `ChatConversationType` | 是 | `PeerChat`、`GroupChat` 或 `RoomChat`。 |
| `isChatThread` | `boolean` | 否 | 是否为消息话题，默认为 `false`。 |

:::tip
1. 消息置顶后，如果该消息在服务端过期，或当前用户从服务端单向删除了该消息，则当前用户无法再通过消息漫游获取该消息，但当前用户和其他用户均可以在置顶消息列表中拉取到该消息。
2. 消息置顶后，如果用户撤回该消息，该消息会从服务端移除，所有用户均无法再从置顶消息列表中获取该消息。
:::

```typescript
ChatClient.getInstance().chatManager.fetchPinnedMessages(
  '<group_id>',
  ChatConversationType.GroupChat
).then((messages) => {
  console.log('会话置顶消息：', messages);
}).catch((error: unknown) => {
  console.error('获取置顶消息失败：', error);
});
```

如果只需读取本地置顶缓存，可调用 `ChatManager#getPinnedMessages`；不要将本地结果视为一次服务端刷新。

## 获取单条消息的置顶详情

调用 `ChatManager#getMessagePinInfo(messageId)`，返回 `Promise<ChatMessagePinInfo | undefined>`。

- 若消息已置顶，`ChatMessagePinInfo` 包含最近一次置顶操作的操作者用户 ID 和置顶时间，即 `operatorId: string` 和 `pinTime: number`，时间戳单位为毫秒。
- 消息不存在或未置顶时，返回 `undefined`。

```typescript
ChatClient.getInstance().chatManager.getMessagePinInfo('<message_id>')
  .then((info) => {
    if (info) {
      console.log('置顶者：', info.operatorId, '置顶时间：', info.pinTime);
    } else {
      console.log('本地消息不存在或尚未置顶');
    }
  })
  .catch((error: unknown) => console.error('查询置顶详情失败：', error));
```

## 监听消息置顶事件

注册 `ChatMessageEventListener`，通过 `onMessagePinChanged` 监听消息置顶状态变化。回调参数对象包含以下字段：

- `messageId`：置顶状态发生变化的消息 ID。
- `convId`：消息所属的会话 ID。
- `pinOperation`：操作类型。`ChatMessagePinOperation.Pin` 表示置顶，`ChatMessagePinOperation.Unpin` 表示取消置顶。
- `pinInfo`：本次操作的信息，包括操作者用户 ID（`operatorId`）和操作时间（`pinTime`，毫秒时间戳）。

```typescript
const manager = ChatClient.getInstance().chatManager;
const listener: ChatMessageEventListener = {
  onMessagePinChanged: ({ messageId, convId, pinOperation, pinInfo }) => {
    if (pinOperation === ChatMessagePinOperation.Pin) {
      console.log('消息已置顶：', convId, messageId, pinInfo.operatorId);
    } else if (pinOperation === ChatMessagePinOperation.Unpin) {
      console.log('消息已取消置顶：', convId, messageId);
    }
    // 按需重新获取该会话置顶列表并更新界面
  },
};
manager.addMessageListener(listener);

// 页面或组件销毁、不再需要监听时执行
// manager.removeMessageListener(listener);
```

置顶失败时应检查功能是否开通、消息是否仍在服务端、会话置顶数量及参数是否正确。事件通知不会自动更新应用自行维护的消息数组。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`pinMessage`](#置顶消息) | `ChatManager` | 置顶指定消息。 |
| [`unpinMessage`](#取消置顶消息) | `ChatManager` | 取消置顶。 |
| [`fetchPinnedMessages`](#获取单个会话中的置顶消息) | `ChatManager` | 从服务端获取置顶消息列表。 |
| [`getPinnedMessages`](#获取单个会话中的置顶消息) | `ChatManager` | 获取本地置顶消息。 |
| [`getMessagePinInfo`](#获取单条消息的置顶详情) | `ChatManager` | 获取单条消息置顶详情。 |
| [`getPinInfo`](#获取单条消息的置顶详情) | `ChatMessage` | 异步 getter，获取消息置顶详情。 |
| [`onMessagePinChanged`](#监听消息置顶事件) | `ChatMessageEventListener` | 监听置顶状态变化。 |
