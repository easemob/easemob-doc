# 会话标记

<Toc />

某些情况下，你可能需要对会话添加标记，例如会话标星或将会话标为已读或未读。即时通讯云 IM 支持对单聊和群聊会话添加标记，最大支持 20 个标记，所以一个会话最多可添加 20 个标记。

如果要使用会话标记功能，你需要确保开通了[会话列表服务](conversation_list.html#从服务器分页获取会话列表)并将 SDK 版本升级至 4.4.0 或以上版本。  

你需要自行维护会话标记与具体业务含义（比如 `MarkType.mark_0`[这里面扔一个连接，跳转到API REFERENCE MarkType] 为待处理会话）之间的映射。

```javascript
const MarkMap = new Map();
MarkMap.set(0, 'IMPORTANT');
MarkMap.set(1, 'NORMAL');
MarkMap.set(2, 'STAR');
```

## 技术原理

环信即时通讯 IM 支持会话标记功能，主要方法如下：

- `addConversationMark`：标记会话。
- `removeConversationMark`：取消标记会话。
- `getServerConversationsByFilter`：根据会话标记从服务器分页查询会话列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- **[开通服务端会话列表功能](conversation_list#从服务器分页获取会话列表)**。

## 实现方法

### 标记会话

你可以调用 `addConversationMark` 方法标记会话。调用该方法会为服务器端的会话添加标记。

添加会话标记后，若调用 `getServerConversations` 方法从服务器分页获取会话列表，返回的会话对象中包含会话标记，即 `ConversationItem#marks` 字段。若你已经达到了服务端会话列表长度限制（默认 100 个会话），服务端会根据会话的活跃度删除不活跃会话，这些会话的会话标记也随之删除。

:::tip
对会话添加标记，例如会话标星，并不影响会话的其他逻辑，例如会话的未读消息数。
:::


```javascript
const options = {
  conversations: [
    {conversationId: 'test', conversationType: 'singleChat'},
    {conversationId: 'groupId', conversationType: 'groupChat'}
  ],
  mark: 0,
}

conn.addConversationMark(options).then(() => {
  console.log('addConversationMark success')
})
```

### 取消标记会话

你可以调用 `removeConversationMark` 方法删除会话标记。

调用该方法会同时移除本地和服务器端会话的标记。

```javascript
const options = {
  conversations: [
    {conversationId: 'test', conversationType: 'singleChat'},
    {conversationId: 'groupId', conversationType: 'groupChat'}
  ],
  mark: 0,
}

conn.removeConversationMark(options).then(() => {
  console.log('removeConversationMark success')
})
```

### 根据会话标记从服务器分页查询会话列表

你可以调用 `getServerConversationsByFilter` 方法根据会话标记从服务器分页获取会话列表。SDK 会按会话标记的时间的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 `0`）、未读消息数、会话标记以及最新一条消息。

```javascript
const options = {
  pageSize: 10,
  cursor: '',
  filter: {
    mark: 0
  }
}
conn.getServerConversationsByFilter().then((res) => {
  console.log('getServerConversationsByFilter success', res)
})
```







