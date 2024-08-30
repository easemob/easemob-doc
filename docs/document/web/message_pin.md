# 消息置顶

消息置顶指将会话中的消息固定在会话顶部，方便会话中的所有用户快速查看重要消息。

- 若使用**群组和聊天室**的消息置顶功能，你需要将 IM SDK 升级至 4.6.0 版本并联系环信商务开通。
- 若要使用**单聊、群组和聊天室**的消息置顶功能，你需要将 IM SDK 升级至 4.9.0 版本并联系环信商务开通。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持消息置顶，主要方法如下：

- `pinMessage`：置顶消息。
- `unpinMessage`：取消置顶消息。
- `getServerPinnedMessages`：从服务端获取单个会话的置顶消息列表。

## 实现方法

### 置顶消息

你可以调用 `pinMessage` 方法在会话中置顶消息。消息置顶状态变化后，会话中的其他成员会收到 `onMessagePinEvent` 事件。多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `onMessagePinEvent` 事件。

在会话中，支持多个用户置顶同一条消息，最新的消息置顶信息会覆盖较早的信息，即 `PinnedMessageInfo` 的置顶消息的操作者的用户 ID 和置顶时间为最新置顶操作的相关信息。

对于单个会话来说，默认可置顶 20 条消息。你可以联系环信商务提升该上限，最大可调整至 100。

```javascript

const options = {
   // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
   conversationType: 'groupChat',
   // 会话 ID
   conversationId: 'conversationId',
   // 消息 ID
   messageId: 'messageId'
}

conn.pinMessage(options).then(()=>{
   // 置顶消息成功
   console.log('置顶消息成功')
})

```

### 取消置顶消息

你可以调用 `unpinMessage` 方法在会话中取消置顶消息。与置顶消息相同，取消置顶消息后，会话中的其他成员会收到 `onMessagePinEvent` 事件。多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `onMessagePinEvent` 事件。

会话中的所有成员均可取消置顶消息，不论该消息是由哪个成员置顶。取消置顶消息后，该会话的置顶消息列表中也不再包含该消息。

```javascript

const options = {
   // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
   conversationType: 'groupChat',
   // 会话 ID
   conversationId: 'conversationId',
   // 消息 ID
   messageId: 'messageId'
}

conn.unpinMessage(options).then(()=>{
   // 取消置顶消息成功
   console.log('取消置顶消息成功')
})

```

### 获取单个会话中的置顶消息

你可以调用 `getServerPinnedMessages` 方法从服务端获取单个会话中的置顶消息。SDK 按照消息置顶时间的倒序返回。

:::tip
1. 若消息置顶后，消息在服务端过期或用户从服务端单向删除了该消息，当前用户拉漫游消息时拉不到该消息，但当前用户和其他用户均可以在置顶消息列表中拉取到该消息。
2. 若消息置顶后，用户撤回了该消息，则该消息从服务端移除，所有用户在从服务器拉取置顶消息列表时无法拉取到该消息。
:::

示例代码如下：

```javascript
const options = {
   // 会话 ID
   conversationId: 'conversationId',
   // 会话类型：单聊、群聊和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
   conversationType: 'groupChat',
   // 每页期望获取的置顶消息数量。取值范围为 [1,50]，默认为 `10`。
   pageSize: 20,
   // 开始获取数据的游标位置。首次获取传 ''。
   cursor: ''
}

conn.getServerPinnedMessages(options).then((res)=>{
   // 获取会话置顶消息列表成功
   console.log(res)
})
```

### 监听消息置顶事件

你可以设置消息置顶监听，通过 `onMessagePinEvent` 事件监听消息的置顶。

```javascript
conn.addEventHandler("eventName", {
  onMessagePinEvent: (event) => {
    console.log(event, '收到消息置顶操作事件')
    switch (event.operation) {
      // 用户收到一条置顶消息的通知。
      case "pin":
        break;
      // 用户收到一条取消置顶消息的通知。
      case "unpin":
        break;
      default:
        break;
    }
  }
});      
```

