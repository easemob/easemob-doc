# 会话标记

<Toc />

某些情况下，你可能需要对会话添加标记，例如会话标星或将会话标为已读或未读。即时通讯云 IM 支持对单聊和群聊会话添加标记，最大支持 20 个标记，所以一个会话最多可添加 20 个标记。

**如果要使用会话标记功能，你需要确保开通了[会话列表服务](conversation_list.html#从服务器分页获取会话列表)并将 SDK 版本升级至 1.4.0 或以上版本。**

你需要自行维护会话标记与具体业务含义（比如 `MARK_0` 为重要会话）之间的映射关系。例如：

```typescript
const mapping = new Map<ChatConversationMarkType, string>();
mapping.set(ChatConversationMarkType.Type0, "important");
mapping.set(ChatConversationMarkType.Type1, "normal");
mapping.set(ChatConversationMarkType.Type2, "unimportant");
```

## 技术原理

环信即时通讯 IM 支持会话标记功能，主要方法如下：

- `ChatManager#addRemoteAndLocalConversationsMark`：标记会话。
- `ChatManager#deleteRemoteAndLocalConversationsMark`：取消标记会话。
- `ChatManager#fetchConversationsByOptions`：根据会话标记从服务器分页查询会话列表。
- 根据会话标记从本地查询会话列表：调用 `getAllConversations` 方法获取本地所有会话后自己进行会话过滤。
- `ChatConversation#marks`：获取本地单个会话的所有标记。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- **[开通服务端会话列表功能](conversation_list#从服务器分页获取会话列表)**。

## 实现方法

### 标记会话

你可以调用 `addRemoteAndLocalConversationsMark` 方法标记会话。每次最多可为 20 个会话添加标记。调用该方法会同时为本地和服务器端的会话添加标记。

添加会话标记后，若调用 `fetchConversationsByOptions` 接口从服务器分页获取会话列表，返回的会话对象中包含会话标记，你需要通过 `ChatConversation#marks` 方法获取。若你已经达到了服务端会话列表长度限制（默认 100 个会话），服务端会根据会话的活跃度（最新一条消息的时间戳）删除不活跃会话，这些会话的会话标记也随之删除。

:::tip
对会话添加标记，例如会话标星，并不影响会话的其他逻辑，例如会话的未读消息数。
:::

```typescript
ChatClient.getInstance()
  .chatManager.addRemoteAndLocalConversationsMark(
    convIds, // 会话 ID 集合
    ChatConversationMarkType.Type0 // 标记类型 0
  )
  .then(() => {
    // todo: 操作完成
  })
  .catch((error) => {
    // todo: 操作失败。
  });
```

### 取消标记会话

你可以调用 `deleteRemoteAndLocalConversationsMark` 方法删除会话标记。每次最多可移除 20 个会话的标记。

调用该方法会同时移除本地和服务器端会话的标记。

```typescript
ChatClient.getInstance()
  .chatManager.deleteRemoteAndLocalConversationsMark(
    convIds, // 会话 ID 集合
    ChatConversationMarkType.Type0 // 标记类型 0
  )
  .then(() => {
    // todo: 操作完成
  })
  .catch((error) => {
    // todo: 操作失败。
  });
```

### 根据会话标记从服务器分页查询会话列表

你可以调用 `fetchConversationsByOptions` 方法根据会话标记从服务器分页获取会话列表。SDK 会按会话标记的时间的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 0）、会话标记以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

```typescript
// 创建搜索条件对象
const option = ChatConversationFetchOptions.withMark(
  ChatConversationMarkType.Type0
);
// 搜索符合条件的标记的会话列表。
ChatClient.getInstance()
  .chatManager.fetchConversationsByOptions(option)
  .then((res) => {
    // todo: 操作完成,获取符合条件的会话列表。
  })
  .catch((error) => {
    // todo: 操作失败。
  });
```

### 根据会话标记从本地查询会话列表

对于本地会话，你可以调用 `getAllConversations` 方法获取本地所有会话后自己进行会话过滤。下面以查询标记了 `ChatConversationMarkType#Type0` 的所有本地会话为例。

```typescript
ChatClient.getInstance()
  .chatManager.getAllConversations()
  .then((res) => {
      for (const conv of res) {
        if (conv.marks && conv.marks.length > 0) {
          // todo: 带有标记的会话
        }
      }
    });
  .catch((error) => {
    // todo: 操作失败。
  });
```

### 获取本地单个会话的所有标记

你可以调用 `ChatConversation#marks` 方法获取本地单个会话的所有标记，示例代码如下：

```typescript
ChatClient.getInstance()
  .chatManager.getConversation(convId, convType)
  .then((res) => {
    // todo: 获取标记：res?.marks
  })
  .catch((error) => {
    // todo: 操作失败。
  });
```
