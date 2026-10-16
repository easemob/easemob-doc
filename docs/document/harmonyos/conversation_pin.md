# 会话置顶

## 功能说明

会话置顶用于将重要的单聊、群聊或聊天室会话固定在会话列表靠前位置，方便用户快速找到高频或重点会话。置顶状态会保存到服务端，并同步到当前用户的其他设备和本地会话数据。

## 功能开通

会话置顶属于服务端会话列表功能的一部分。使用前，需要在[环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已开通[服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 设置或取消置顶会话

调用 `ChatManager#pinConversation` 设置或取消会话置顶。置顶状态会存储在服务器上，状态变更会同时更新服务端和本地。`isPinned` 为 `true` 时置顶，为 `false` 时取消置顶。

多设备登录时，当前用户在一台设备上设置或取消会话置顶后，其他在线设备会通过 `MultiDevicesListener#onConversationEvent` 收到多设备会话事件。设置置顶对应 `MultiDevicesEvent.CONVERSATION_PINNED`，取消置顶对应 `MultiDevicesEvent.CONVERSATION_UNPINNED`。

你最多可以置顶 50 个会话。

```typescript
let isPinned: boolean = true;
let chatManager = ChatClient.getInstance().chatManager();

if (chatManager) {
    chatManager.pinConversation(
        // 单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID。
        conversationId,
        // true 表示置顶，false 表示取消置顶。
        isPinned
    ).then(() => {
        // 会话置顶状态设置成功。
    }).catch((error: ChatError) => {
        // 根据 error.errorCode 和 error.description 处理错误。
    });
}
```

参数说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `conversationId` | `string` | 会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `isPinned` | `boolean` | 是否置顶：`true` 表示置顶，`false` 表示取消置顶。 |

`pinConversation` 不直接返回更新后的会话对象。调用成功后，可重新读取本地会话，并通过以下接口获取置顶状态：

```typescript
let conversation: Conversation | undefined = ChatClient.getInstance()
    .chatManager()
    ?.getConversation(conversationId, conversationType, false);

if (conversation) {
    let pinned: boolean = conversation.isPinned();
    // 返回会话置顶时的 UNIX 时间戳，单位为毫秒；未置顶时返回 0。
    let pinnedTime: number = conversation.getPinnedTime();
}
```

## 获取置顶会话列表

HarmonyOS SDK 5.0.0 不再提供从服务端分页获取置顶会话的公开接口。置顶状态随会话数据在登录后自动同步并写入本地，应用应在同步完成后读取本地会话列表并筛选置顶会话。

`ChatOptions#setDataSyncType` 默认包含 `DataSyncType.CONVERSATIONS`。也可以在调用 `ChatClient#init` 前显式配置：

```typescript
let options = new ChatOptions({ appKey: "your-org#your-app" });
options.setDataSyncType(DataSyncType.CONVERSATIONS);

ChatClient.getInstance().init(context, options);
```

当 `ConnectionListener#onDataSyncFinish` 回调中的 `type` 为 `DataSyncType.CONVERSATIONS` 且 `errorCode` 为 `ChatError.EM_NO_ERROR` 时，可调用 `getAllConversationsBySort` 获取本地会话列表，再筛选置顶会话。关于同步状态监听，详见[会话列表](conversation_list.html#监听会话列表同步状态)。

```typescript
let conversations: Array<Conversation> = ChatClient.getInstance()
    .chatManager()
    ?.getAllConversationsBySort() ?? [];

let pinnedConversations: Array<Conversation> = [];
conversations.forEach((conversation: Conversation): void => {
    if (conversation.isPinned()) {
        pinnedConversations.push(conversation);
    }
});
```

`Conversation` 中与会话置顶相关的接口如下：

| API | 返回类型 | 说明 |
| :--- | :--- | :--- |
| `conversationId()` | `string` | 获取会话 ID。 |
| `getType()` | `ConversationType` | 获取会话类型。 |
| `isPinned()` | `boolean` | 获取会话是否置顶。 |
| `getPinnedTime()` | `number` | 获取置顶时间戳，单位为毫秒；未置顶时返回 `0`。 |

:::tip
HarmonyOS SDK 5.0.0 不提供控制从本地数据库读取会话时是否包含空会话的公开配置。应用不应依赖本地会话列表返回所有空会话。
:::

## 监听本地会话列表更新

本地会话发生变化时，SDK 会触发 `ConversationListener#onConversationUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。

```typescript
let conversationListener: ConversationListener = {
    onConversationUpdate: (): void => {
        let conversations: Array<Conversation> = ChatClient.getInstance()
            .chatManager()
            ?.getAllConversationsBySort() ?? [];
        // 使用最新会话列表刷新界面。
    }
};

ChatClient.getInstance()
    .chatManager()
    ?.addConversationListener(conversationListener);

// 不再需要监听时移除监听器。
ChatClient.getInstance()
    .chatManager()
    ?.removeConversationListener(conversationListener);
```

## 监听多设备会话置顶事件

同一用户在其他设备上设置或取消会话置顶时，当前设备可通过 `MultiDevicesListener#onConversationEvent` 接收多设备会话事件：

| 事件 | 说明 |
| :--- | :--- |
| `CONVERSATION_PINNED` | 当前用户在其他设备上置顶会话。 |
| `CONVERSATION_UNPINNED` | 当前用户在其他设备上取消会话置顶。 |

```typescript
let multiDevicesListener: MultiDevicesListener = {
    // 以下三个回调为 MultiDevicesListener 的必填回调。
    onContactEvent: (
        event: MultiDevicesEvent,
        target: string,
        ext: string
    ): void => {
    },
    onGroupEvent: (
        event: MultiDevicesEvent,
        target: string,
        userIds: Array<string>
    ): void => {
    },
    onMessageRemoved: (conversationId: string, deviceId: string): void => {
    },
    onConversationEvent: (
        event: MultiDevicesEvent,
        conversationId: string,
        type: ConversationType
    ): void => {
        if (event === MultiDevicesEvent.CONVERSATION_PINNED
            || event === MultiDevicesEvent.CONVERSATION_UNPINNED) {
            let conversations: Array<Conversation> = ChatClient.getInstance()
                .chatManager()
                ?.getAllConversationsBySort() ?? [];
            // 使用最新会话列表刷新界面。
        }
    }
};

ChatClient.getInstance().addMultiDevicesListener(multiDevicesListener);

// 不再需要监听时移除监听器。
ChatClient.getInstance().removeMultiDevicesListener(multiDevicesListener);
```

:::tip
多设备事件通知当前用户的其他在线设备。当前设备发起置顶操作后，应以 `pinConversation` 返回的 Promise 结果作为操作结果，并按需重新读取本地会话列表。
:::

## 排序与展示建议

`getAllConversationsBySort` 返回的会话列表遵循以下排序规则：

- 置顶会话位于非置顶会话之前。
- 置顶和非置顶会话内部均按最新一条消息的时间戳倒序排列。

展示会话列表时，建议直接使用 SDK 返回的顺序。如果业务需要按“最近置顶时间”排列多个置顶会话，可以使用 `Conversation#getPinnedTime()` 返回的时间戳对置顶会话进行倒序排列，使最近置顶的会话更靠前。

```typescript
let conversations: Array<Conversation> = ChatClient.getInstance()
    .chatManager()
    ?.getAllConversationsBySort() ?? [];

let pinnedConversations: Array<Conversation> = [];
let unpinnedConversations: Array<Conversation> = [];

conversations.forEach((conversation: Conversation): void => {
    if (conversation.isPinned()) {
        pinnedConversations.push(conversation);
    } else {
        unpinnedConversations.push(conversation);
    }
});

// 置顶会话按置顶时间倒序排列，使最近置顶的会话更靠前。
pinnedConversations.sort(
    (first: Conversation, second: Conversation): number =>
        second.getPinnedTime() - first.getPinnedTime()
);

// 合并列表，置顶会话保持在非置顶会话之前。
let sortedConversations: Array<Conversation> = pinnedConversations.concat(
    unpinnedConversations
);
```

## 注意事项

- 会话置顶支持单聊、群聊和聊天室会话。
- `conversationId` 不能为空；调用失败时，应根据 `ChatError#errorCode` 和 `description` 处理。
- 最多可以置顶 50 个会话。
- 会话置顶状态保存在服务端，并同步到当前用户的其他设备。
- 应在会话数据同步完成后，通过本地接口读取并筛选置顶会话。
- 会话置顶不影响消息收发、会话未读数、消息已读状态或会话标记。
- HarmonyOS SDK 5.0.0 不提供控制本地会话列表是否包含空会话的公开配置。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`pinConversation`](#设置或取消置顶会话) | `ChatManager` | 设置或取消指定会话的置顶状态。 |
| [`getConversation`](#设置或取消置顶会话) | `ChatManager` | 获取指定的本地会话对象。 |
| [`setDataSyncType`](#获取置顶会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#获取置顶会话列表) | `ChatClient` | 使用指定配置初始化 SDK。 |
| [`onDataSyncFinish`](#获取置顶会话列表) | `ConnectionListener` | 监听登录后的数据自动同步完成事件。 |
| [`getAllConversationsBySort`](#获取置顶会话列表) | `ChatManager` | 获取置顶优先排序的本地会话列表。 |
| [`conversationId`](#获取置顶会话列表) / [`getType`](#获取置顶会话列表) | `Conversation` | 获取会话 ID 和会话类型。 |
| [`isPinned`](#获取置顶会话列表) / [`getPinnedTime`](#获取置顶会话列表) | `Conversation` | 获取会话置顶状态和置顶时间。 |
| [`addConversationListener`](#监听本地会话列表更新) / [`removeConversationListener`](#监听本地会话列表更新) | `ChatManager` | 添加或移除会话更新监听器。 |
| [`addMultiDevicesListener`](#监听多设备会话置顶事件) / [`removeMultiDevicesListener`](#监听多设备会话置顶事件) | `ChatClient` | 添加或移除多设备监听器。 |
