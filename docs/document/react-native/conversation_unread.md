## 会话未读数

<Toc />

你可以查看本地所有会话或指定会话的未读消息数，并针对会话的未读消息数清零。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM React Native SDK 通过 `ChatManager` 类实现对本地会话的未读消息数的管理，其中核心方法如下：

- `ChatManager#getUnreadCount`：获取本地所有会话的未读消息数。
- `ChatManager#getConversationUnreadCount`：获取本地指定会话的未读消息数。
- `ChatManager#markAllConversationsAsRead`：将本地所有会话的未读消息数清零。
- `ChatManager#markAllMessagesAsRead`：对于本地指定会话的未读消息数清零。
- `ChatManager#markMessageAsRead`：将指定会话的单条未读消息置为已读。

## 实现方法

### 获取所有会话的未读消息数

你可以调用 `getUnreadCount` 方法获取所有本地会话的未读消息数，示例代码如下：

```typescript
// convId: 会话 ID
// convType：会话类型
ChatClient.getInstance()
  .chatManager.getUnreadCount()
  .then((count) => {
    console.log("get count success");
  })
  .catch((reason) => {
    console.log("get count fail.", reason);
  });
```

### 获取指定会话的未读消息数

你可以调用 `getConversationUnreadCount` 方法获取本地指定会话的未读消息数，示例代码如下：

```typescript
// convId: 会话 ID
// convType：会话类型
ChatClient.getInstance()
  .chatManager.getConversationUnreadCount(convId, convType)
  .then((count) => {
    console.log("get count success");
  })
  .catch((reason) => {
    console.log("get count fail.", reason);
  });
```

### 将所有会话的未读消息数清零

你可以调用 `markAllConversationsAsRead` 方法将本地所有会话设为已读，即将所有会话的未读消息数清零，示例代码如下：

```typescript
ChatClient.getInstance()
  .chatManager.markAllConversationsAsRead()
  .then(() => {
    console.log("conversions had read success");
  })
  .catch((reason) => {
    console.log("conversions had read fail.", reason);
  });
```

### 指定会话的未读消息数清零

你可以调用 `markAllMessagesAsRead` 方法对本地指定会话的未读消息数清零，示例代码如下：

```typescript
// convId：会话 ID
// convType: 会话类型
ChatClient.getInstance()
  .chatManager.markAllMessagesAsRead(convId, convType)
  .then(() => {
    console.log("conversions had read success");
  })
  .catch((reason) => {
    console.log("conversions had read fail.", reason);
  });
```

### 将指定会话的单条未读消息置为已读

你可以调用 `markMessageAsRead` 方法将本地指定会话的单条未读消息置为已读。

```typescript
// convId：会话 ID
// convType: 会话类型
// msgId：消息 ID
ChatClient.getInstance()
  .chatManager.markMessageAsRead(convId, convType, msgId)
  .then(() => {
    console.log("conversions had read success");
  })
  .catch((reason) => {
    console.log("conversions had read fail.", reason);
  });
```
