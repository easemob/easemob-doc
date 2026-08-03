# 消息置顶

##  功能说明

消息置顶是指将会话中的重要消息标记为置顶，方便会话成员集中查看和快速定位。

**单聊、群聊和聊天室均支持该功能。**  置顶状态保存在服务端，并在同一会话的相关用户之间同步。

同一会话可以同时置顶多条消息。应用可以从服务端获取指定会话的置顶消息列表，并通过消息置顶事件及时更新页面。对于单条消息，还可以读取置顶操作者和置顶时间等详细信息。

## 功能开通

使用消息置顶功能前，需要联系环信商务开通。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功连接到服务器，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 置顶消息

你可以调用 `pinMessage` 方法在指定会话中置顶一条消息。置顶成功后，会同步触发 `onPinnedMessageChanged` 事件，事件载荷中的 `operation` 为 `pin`。

在同一会话中，多个成员可以先后对同一条消息执行置顶操作。若同一条消息被重复置顶，置顶信息会以最新一次操作为准，即该消息对应的置顶操作者和置顶时间会更新为最近一次置顶操作的信息。

对于单个会话来说，默认可置顶 20 条消息。你可以联系环信商务提升该上限，最大可调整至 100。

若置顶数量达到服务端限制，调用 `pinMessage` 可能返回错误码 `4`，错误原因为 `pin_message_limit`。

```typescript
await client.chatManager.pinMessage({
  conversationId: 'group1',
  conversationType: 'groupChat',
  messageId: 'msg-id-123',
});
```

## 取消置顶消息

你可以调用 `unpinMessage` 方法取消指定会话中的一条置顶消息。取消置顶成功后，同样会触发 `onPinnedMessageChanged` 事件，事件载荷中的 `operation` 为 `unpin`。

取消置顶后，该消息将不再出现在对应会话的置顶消息列表中。

```typescript
await client.chatManager.unpinMessage({
  conversationId: 'group1',
  conversationType: 'groupChat',
  messageId: 'msg-id-123',
});
```

## 获取单个会话中的置顶消息

你可以调用 `getPinnedMessageList` 方法获取指定会话中的置顶消息列表。SDK 按照消息置顶时间的倒序返回，返回结果中的每一项为 `PinnedMessageSummary`，其中包含置顶消息的完整消息对象、置顶操作者以及置顶时间等信息。

该接口不分页，当前 **最多返回 20 条置顶消息**。

:::tip 
1. 若消息置顶后，消息在服务端过期，或当前用户从服务端单向删除了该消息，则当前用户后续拉取漫游消息时无法再获取该消息；但当前用户和其他用户仍可通过置顶消息列表获取该消息。  
2. 若消息置顶后，用户撤回了该消息，则该消息会从服务端移除；此后，所有用户均无法再从服务端的置顶消息列表中获取该消息。
:::

示例代码如下：

```typescript
const result = await client.chatManager.getPinnedMessageList({
  conversationId: 'group1',
  conversationType: 'groupChat',
});

for (const item of result.items) {
  console.log('置顶消息 ID:', item.messageId);
  console.log('置顶时间:', item.pinnedAt);
  console.log('置顶消息:', item.message);
}
```

## 监听消息置顶事件

你可以通过 `onPinnedMessageChanged` 事件监听消息置顶状态变化。事件载荷中会包含消息 ID、会话 ID、会话类型和操作类型，并可能携带操作者和置顶时间等信息。其中：

- `operation` 为 `pin` 表示置顶消息，此时事件中可能包含 `pinTime`。
- `operation` 为 `unpin` 表示取消置顶消息。

多设备登录情况下，置顶或取消置顶消息后，当前用户的其他已登录设备也会同步收到 `onPinnedMessageChanged` 事件。

```typescript
client.addEventHandler('pin', {
  onPinnedMessageChanged: (event) => {
    console.log('操作:', event.operation); // 'pin' | 'unpin'
    console.log('消息 ID:', event.messageId);
    console.log('操作者:', event.operatorId);
  },
});
```
