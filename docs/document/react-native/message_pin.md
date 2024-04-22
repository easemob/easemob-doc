# 消息置顶

消息置顶指将会话中的消息固定在会话顶部，方便会话中的所有用户快速查看重要消息。

目前，**群组和聊天室**聊天支持对消息置顶和取消置顶，单聊消息不支持该功能。

**若使用该功能，你需要将 IM SDK 升级至 1.4.0 版本并联系环信商务开通。**

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持消息置顶，主要方法和类如下：

- `ChatManager#pinMessage`：置顶消息。
- `ChatManager#unpinMessage`：取消置顶消息。
- `ChatManager#fetchPinnedMessages`：从服务端获取单个会话的置顶消息列表。
- `ChatMessagePinInfo`：消息的置顶或取消置顶详情。

## 置顶消息

你可以调用 `ChatManager#pinMessage` 方法在群组或聊天室聊天中置顶消息。消息置顶状态变化后，群组或聊天室会话中的其他成员会收到 `EMMessageListener#onMessagePinChanged` 事件。多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `EMMessageListener#onMessagePinChanged` 事件。

在群组和聊天室会话中，支持多个用户置顶同一条消息，最新的消息置顶信息会覆盖较早的信息，即 `ChatMessagePinInfo` 的置顶消息的操作者的用户 ID 和置顶时间为最新置顶操作的相关信息。

若消息在本地存储，而在服务端因过期而删除，则消息置顶失败。

对于单个会话来说，默认可置顶 20 条消息。你可以联系环信商务提升该上限，最大可调整至 100。

```typescript
ChatClient.getInstance()
  .chatManager.pinMessage(
    messageId // 消息ID
  )
  .then(() => {
    // todo: 操作完成
  })
  .catch((error) => {
    // todo: 操作失败。
  });
```

## 取消置顶消息

你可以调用 `ChatManager#unpinMessage` 方法在群组或聊天室聊天中取消置顶消息。与置顶消息相同，取消置顶消息后，群组或聊天室会话中的其他成员会收到 `EMMessageListener#onMessagePinChanged` 事件。多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `EMMessageListener#onMessagePinChanged` 事件。

群组或聊天室中的所有成员均可取消置顶消息，不论该消息由哪个成员置顶。取消置顶消息后，`EMMessage#pinnedInfo` 获取到的信息为空，该会话的置顶消息列表中也不再包含该消息。

```typescript
ChatClient.getInstance()
  .chatManager.unpinMessage(
    messageId // 消息ID
  )
  .then(() => {
    // todo: 操作完成
  })
  .catch((error) => {
    // todo: 操作失败。
  });
```

## 获取单个会话中的置顶消息

你可以调用 `ChatManager#fetchPinnedMessages` 方法从服务端获取单个会话中的置顶消息。SDK 按照消息置顶时间的倒序返回。

:::tip

1. 若消息置顶后，消息在服务端过期或用户从服务端单向删除了该消息，当前用户拉漫游消息时拉不到该消息，但当前用户和其他用户均可以在置顶消息列表中拉取到该消息。
2. 若消息置顶后，用户撤回了该消息，则该消息从服务端移除，所有用户在从服务器拉取置顶消息列表时无法拉取到该消息。
   :::

```typescript
ChatClient.getInstance()
  .chatManager.fetchPinnedMessages(
    convId, // 会话 ID
    convType // 会话类型
  )
  .then((res) => {
    // todo: 操作完成,获取指定消息列表
  })
  .catch((error) => {
    // todo: 操作失败。
  });
```

## 获取单条消息的置顶详情

你可以通过 `ChatMessagePinInfo` 类获取单条消息的置顶详情。

- 若消息为置顶状态，该类返回消息置顶的时间以及操作者的用户 ID。
- 若消息为非置顶状态，该类返回空。

```typescript
// ...
const msg: ChatMessage;
const info = await msg.getPinInfo;
// todo: 获取消息的pin信息
```

## 监听消息置顶事件

```typescript
ChatClient.getInstance().chatManager.addMessageListener({
  onMessagePinChanged: (params) => {
    // todo: 接收消息置顶状态变更
  },
} as ChatMessageEventListener);
```
