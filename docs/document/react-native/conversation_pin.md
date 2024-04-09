# 会话置顶

<Toc />

会话置顶指将单聊或群聊会话固定在会话列表的顶部，方便用户查找。例如，将重点会话置顶，可快速定位会话。

**若使用会话置顶功能，需将 SDK 升级至 1.2.0，并[开通服务端会话列表功能](conversation_list#从服务器分页获取会话列表)。**

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- **[开通服务端会话列表功能](conversation_list#从服务器分页获取会话列表)**。

## 技术原理

环信即时通讯 IM 支持会话置顶，主要方法如下：

- `ChatManager.pinConversation`：置顶/取消置顶会话。
- `ChatManager.asyncFetchPinnedConversationsFromServer`：获取服务端置顶会话列表。

## 实现方法

### 置顶/取消置顶会话

你可以调用 `pinConversation` 方法设置是否置顶会话。置顶状态会存储在服务器上，多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `CONVERSATION_PINNED` 和 `CONVERSATION_UNPINNED` 事件。

你最多可以置顶 50 个会话。

示例代码如下： 

```typescript
// isPinned: 设置是否置顶会话。
ChatClient.getInstance()
  .chatManager.pinConversation(convId, isPinned)
  .then(() => {
    console.log("pin conversions success");
  })
  .catch((reason) => {
    console.log("pin conversions fail.", reason);
  });
```

你可以通过 `ChatConversation` 对象的 `isPinned` 字段检查会话是否为置顶状态，或查看 `pinnedTime` 字段获取会话置顶时间。

### 获取服务端的置顶会话列表

你可以调用 `fetchPinnedConversationsFromServerWithCursor` 方法从服务端分页获取置顶会话列表。SDK 按照会话置顶时间的倒序返回。 

你最多可以拉取 50 个置顶会话。

示例代码如下： 

```typescript
// pageSize: 每页返回的会话数。取值范围为 [1,50]。
// cursor: 开始获取数据的游标位置。若获取数据时传 `undefined` 或者空字符串（""），SDK 从最新置顶的会话开始查询。
ChatClient.getInstance()
  .chatManager.fetchPinnedConversationsFromServerWithCursor(cursor, pageSize)
  .then(() => {
    console.log("get conversions success");
  })
  .catch((reason) => {
    console.log("get conversions fail.", reason);
  });
```