# 会话标记

## 功能说明

会话标记用于为会话添加业务分类，例如标星、待处理或重要客户等。SDK 支持为单聊、群聊和聊天室会话添加或移除标记。

SDK 提供 `MARK_0` 至 `MARK_19` 共 20 个标记，单个会话最多可同时包含 20 个标记。各标记的业务含义由应用自行定义和维护。

```typescript
let markMapping = new Map<MarkType, string>();
markMapping.set(MarkType.MARK_0, "important");
markMapping.set(MarkType.MARK_1, "pending");
markMapping.set(MarkType.MARK_2, "customer");
```

:::tip
会话标记只用于会话分类和筛选，不会影响会话未读数、消息收发、置顶状态或消息已读状态。
:::

## 功能开通

会话标记属于服务端会话列表功能的一部分。使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已开通 [服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 添加会话标记

调用 `ChatManager#addConversationMark` 为一个或多个会话添加指定标记。该操作会同时更新服务端和本地的会话标记。单次最多可传入 20 个会话 ID。

SDK 默认在登录后自动同步会话列表及其标记并写入本地。同步完成后，可通过本地会话列表接口获取 `Conversation` 对象，再调用 `Conversation#marks` 获取该会话的全部标记。

若服务端会话列表达到数量限制（默认最多 100 个会话），服务端可能根据会话活跃度移除不活跃会话。对应会话的标记也可能不再随服务端会话列表同步到本地。

```typescript
let conversationIds: Array<string> = ["user2", "group1"];
let chatManager = ChatClient.getInstance().chatManager();

if (chatManager) {
    chatManager.addConversationMark(conversationIds, MarkType.MARK_0)
        .then(() => {
            // 会话标记添加成功。
        })
        .catch((error: ChatError) => {
            // 根据 error.errorCode 和 error.description 处理错误。
        });
}
```

参数说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `conversationIds` | `string \| Array<string>` | 会话 ID 或会话 ID 数组，不能为空；单次最多传入 20 个会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `mark` | `MarkType` | 要添加的标记，取值为 `MARK_0` 至 `MARK_19`。 |

## 移除会话标记

调用 `ChatManager#removeConversationMark` 从一个或多个会话中移除指定标记。该操作会同时更新服务端和本地的会话标记。单次最多可传入 20 个会话 ID。

```typescript
let conversationIds: Array<string> = ["user2", "group1"];
let chatManager = ChatClient.getInstance().chatManager();

if (chatManager) {
    chatManager.removeConversationMark(conversationIds, MarkType.MARK_0)
        .then(() => {
            // 会话标记移除成功。
        })
        .catch((error: ChatError) => {
            // 根据 error.errorCode 和 error.description 处理错误。
        });
}
```

`removeConversationMark` 的参数规则与 `addConversationMark` 相同。

## 按标记筛选会话列表

会话标记随会话数据在登录后自动同步并写入本地，应用应在同步完成后读取本地会话列表，再通过 `Conversation#marks` 筛选带有指定标记的会话。

`ChatOptions#setDataSyncType` 默认包含 `DataSyncType.CONVERSATIONS`。也可以在调用 `ChatClient#init` 前显式配置：

```typescript
let options = new ChatOptions({ appKey: "your-org#your-app" });
options.setDataSyncType(DataSyncType.CONVERSATIONS);

ChatClient.getInstance().init(context, options);
```

当 `ConnectionListener#onDataSyncFinish` 回调中的 `type` 为 `DataSyncType.CONVERSATIONS` 且 `errorCode` 为 `ChatError.EM_NO_ERROR` 时，可以读取本地会话列表并按标记筛选。关于同步状态监听，详见[会话列表](conversation_list.html#监听会话列表同步状态)。

```typescript
let conversations: Array<Conversation> = ChatClient.getInstance()
    .chatManager()
    ?.getAllConversationsBySort() ?? [];

let markedConversations: Array<Conversation> = [];
conversations.forEach((conversation: Conversation): void => {
    let marks: Set<MarkType> = conversation.marks();
    if (marks.has(MarkType.MARK_0)) {
        markedConversations.push(conversation);
    }
});
```

如需获取单个本地会话的全部标记，可以先调用 `getConversation` 获取会话对象，再调用 `marks`：

```typescript
let conversation: Conversation | undefined = ChatClient.getInstance()
    .chatManager()
    ?.getConversation(conversationId, conversationType, false);

let marks: Set<MarkType> = conversation?.marks() ?? new Set<MarkType>();
```

:::tip
`getAllConversationsBySort` 和 `getConversation` 只读取本地会话，不会主动向服务器请求数据。若需要最新的服务端标记状态，应先等待会话数据同步完成。
:::

## 监听会话列表更新

本地会话发生变化时，SDK 会触发 `ConversationListener#onConversationUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。

```typescript
let conversationListener: ConversationListener = {
    onConversationUpdate: (): void => {
        let conversations: Array<Conversation> = ChatClient.getInstance()
            .chatManager()
            ?.getAllConversationsBySort() ?? [];
        // 重新筛选带有目标标记的会话并刷新界面。
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

同一用户在其他设备上更新会话标记时，当前设备可通过 `MultiDevicesListener#onConversationEvent` 接收 `MultiDevicesEvent#CONVERSATION_MARK_UPDATE` 事件。收到事件后，应重新读取本地会话列表并刷新界面。

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
        if (event === MultiDevicesEvent.CONVERSATION_MARK_UPDATE) {
            let conversations: Array<Conversation> = ChatClient.getInstance()
                .chatManager()
                ?.getAllConversationsBySort() ?? [];
            // 其他设备更新了会话标记，重新筛选并刷新界面。
        }
    }
};

ChatClient.getInstance().addMultiDevicesListener(multiDevicesListener);

// 不再需要监听时移除监听器。
ChatClient.getInstance().removeMultiDevicesListener(multiDevicesListener);
```

## 注意事项

- 会话标记支持单聊、群聊和聊天室会话。
- 会话标记取值为 `MARK_0` 至 `MARK_19`，各标记的业务含义由应用维护。
- 单个会话最多可以同时包含 20 个标记。
- `addConversationMark` 和 `removeConversationMark` 可同时操作多个会话，单次最多传入 20 个会话 ID。
- 会话 ID 或会话 ID 数组不能为空；调用失败时，应根据回调中的错误码和错误信息处理。
- 会话标记会同时更新服务端和本地会话数据，并同步到当前用户的其他设备。
- 会话标记不影响会话未读数、消息已读状态、消息收发或会话置顶状态。
- 应在会话数据同步完成后，通过本地接口读取并筛选会话。
- 若服务端会话列表达到数量限制，不活跃会话可能被移出服务端会话列表，对应标记也可能不再随会话列表返回。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addConversationMark`](#添加会话标记) | `ChatManager` | 为一个或多个会话添加指定标记。 |
| [`removeConversationMark`](#移除会话标记) | `ChatManager` | 从一个或多个会话中移除指定标记。 |
| [`setDataSyncType`](#按标记筛选会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#按标记筛选会话列表) | `ChatClient` | 使用指定配置初始化 SDK。 |
| [`onDataSyncFinish`](#按标记筛选会话列表) | `ConnectionListener` | 监听登录后的数据自动同步完成事件。 |
| [`getAllConversationsBySort`](#按标记筛选会话列表) | `ChatManager` | 获取置顶优先排序的本地会话列表。 |
| [`getConversation`](#按标记筛选会话列表) | `ChatManager` | 获取指定的本地会话对象。 |
| [`marks`](#按标记筛选会话列表) | `Conversation` | 获取会话的全部标记。 |
| [`addConversationListener`](#监听会话列表更新) / [`removeConversationListener`](#监听会话列表更新) | `ChatManager` | 添加或移除会话更新监听器。 |
| [`addMultiDevicesListener`](#监听会话列表更新) / [`removeMultiDevicesListener`](#监听会话列表更新) | `ChatClient` | 添加或移除多设备监听器。 |
