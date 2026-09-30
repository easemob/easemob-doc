# 会话列表

## 功能说明

- **本地会话列表：** 对于单聊、群组聊天和聊天室会话，用户收发消息时，SDK 会在本地创建或更新对应会话，并将其维护在本地会话列表中。应用可从本地内存或数据库读取会话列表，用于展示会话名称、头像、最后一条消息、未读数、置顶状态和会话标记等信息。默认情况下，本地会话列表不包含聊天室会话。

- **服务端与本地数据：** 环信服务器和 SDK 本地均可维护会话列表数据。服务端保存当前用户的会话状态，本地数据用于客户端快速读取和展示会话列表。登录后，SDK 根据数据同步配置将服务端会话数据同步至本地。收发消息、删除会话、清空未读数、设置或取消置顶、添加或移除会话标记等操作也可能更新本地会话列表。

- **同步与变更通知：** 默认同步配置包含会话数据。应用应等待会话数据同步完成后，再读取本地会话列表。本地会话列表发生变化时，SDK 会通知应用；同一账号在其他设备上变更会话状态时，当前设备也可通过多设备事件感知该变更。

## 功能开通

如需将服务端会话列表同步到本地，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 获取会话列表

应用应按照“登录后自动同步、监听同步完成、读取本地会话列表”的流程获取最新会话数据。

### 登录后自动同步会话列表

`ChatOptions#setDataSyncType` 默认包含 `DataSyncType.CONVERSATIONS`。用户登录成功后，SDK 会自动从服务端同步会话列表并写入本地。

```typescript
let options = new ChatOptions({ appKey: "your-org#your-app" });
options.setDataSyncType(DataSyncType.CONVERSATIONS);

ChatClient.getInstance().init(context, options);
```

若还需要同步好友列表或已加入的群组列表，应在调用 `init` 前将 `setDataSyncType` 调用替换为数组形式：

```typescript
options.setDataSyncType([
    DataSyncType.CONVERSATIONS,
    DataSyncType.CONTACTS,
    DataSyncType.JOINED_GROUPS
]);
```

关于登录后自动同步数据，详见 [SDK 初始化文档](initialization.html)。

### 监听会话列表同步状态

通过 `ConnectionListener` 监听会话列表同步状态。建议在调用 `loginWithToken` 前注册监听器，以免遗漏同步事件。当 `type` 为 `DataSyncType.CONVERSATIONS` 时，表示当前同步的是会话列表。

`onDatabaseOpened` 只表示本地数据库已经可以读取，不表示登录成功或服务端会话同步完成。如需展示本次登录后从服务端同步的最新会话数据，应等待 `onDataSyncFinish(DataSyncType.CONVERSATIONS, errorCode)` 成功后再读取本地列表。

```typescript
let connectionListener: ConnectionListener = {
    onConnected: (): void => {
        // SDK 已成功连接到 IM 服务器。
    },
    onDisconnected: (errorCode: number): void => {
        // SDK 与 IM 服务器断开连接，可根据 errorCode 判断原因。
    },
    onDatabaseOpened: (username: string): void => {
        // username 对应的本地数据库已打开，可以读取本地数据。
    },
    onDataSyncStart: (type: DataSyncType): void => {
        if (type === DataSyncType.CONVERSATIONS) {
            // 会话列表开始同步。
        }
    },
    onDataSyncFinish: (type: DataSyncType, errorCode: number): void => {
        if (type !== DataSyncType.CONVERSATIONS) {
            return;
        }

        if (errorCode === ChatError.EM_NO_ERROR) {
            // 会话列表同步成功，可以读取本地会话列表。
        } else {
            // 会话列表同步失败，根据 errorCode 处理错误。
        }
    }
};

ChatClient.getInstance().addConnectionListener(connectionListener);

// 不再需要监听时移除。
ChatClient.getInstance().removeConnectionListener(connectionListener);
```

也可以通过 `ChatClient#isDatabaseOpened()` 主动查询本地数据库是否已经打开。该方法同样不能代替登录状态或数据同步完成状态。

### 会话相关选项

初始化 SDK 时，可以在 `ChatOptions` 中设置以下会话相关选项：

| 选项 | 描述 |
| :--- | :--- |
| `setDeleteMessagesOnLeaveChatroom(boolean delete)` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/>- （默认）`true`：删除本地消息。<br/>- `false`：保留本地消息。可通过 `isDeleteMessagesOnLeaveChatroom()` 查询当前设置。 |

### 一次性获取本地所有会话

调用 `getAllConversationsBySort` 可以从本地数据库获取排序后的全部会话，返回 `Array<Conversation>`。排序规则如下：

- 置顶会话排在非置顶会话之前。
- 置顶和非置顶会话内部均按照最后一条消息的时间戳倒序排列。

```typescript
let conversations: Array<Conversation> = ChatClient.getInstance()
    .chatManager()
    ?.getAllConversationsBySort() ?? [];
```

如果不需要 SDK 返回排序后的数据库会话列表，可以调用 `getConversations` 获取当前加载到本地的会话数组。该方法不提供排序、分页或筛选参数。

```typescript
let conversations: Array<Conversation> = ChatClient.getInstance()
    .chatManager()
    ?.getConversations() ?? [];
```

### 获取指定会话

调用 `getConversation(conversationId, type, createIfNotExist)` 可以根据会话 ID 和会话类型获取指定的本地会话：

- 单聊会话的会话 ID 为对端用户 ID；
- 群聊会话的会话 ID 为群组 ID；
- 聊天室会话的会话 ID 为聊天室 ID。

`createIfNotExist` 默认为 `false`，表示本地不存在指定会话时返回 `undefined`；设为 `true` 时，SDK 会创建该会话。

```typescript
let conversation: Conversation | undefined = ChatClient.getInstance()
    .chatManager()
    ?.getConversation(conversationId, ConversationType.GroupChat, false);
```

## 获取会话名称和头像

调用 `Conversation#getConversationName()` 和 `Conversation#getConversationAvatar()` 可获取会话的显示名称和头像：

- 单聊会话：分别为对端用户的昵称和头像。
- 群聊会话：分别为群名称和群头像。
- 相关用户或群组数据尚未同步时，这两个方法可能返回空字符串。

```typescript
let conversationName: string = conversation.getConversationName();
let conversationAvatar: string = conversation.getConversationAvatar();
```

还可以获取会话的最后一条消息、未读消息数、置顶状态和会话标记：

```typescript
let latestMessage: ChatMessage | undefined = conversation.getLatestMessage();
let unreadCount: number = conversation.getUnreadMsgCount();
let isPinned: boolean = conversation.isPinned();
let marks: Set<MarkType> = conversation.marks();
```

## 会话列表数据更新场景

| 场景 | 是否影响服务端数据 | 是否影响本地会话列表 |
| :--- | :--- | :--- |
| 登录后从服务端同步会话数据并写入本地，不修改服务端会话状态 | 否 | 是 |
| 收发消息时，SDK 创建或更新会话的最后一条消息、排序和未读数 | 视服务端配置而定 | 是 |
| 设置或取消会话置顶<br/>方法：`pinConversation` | 是 | 是 |
| 添加或移除会话标记<br/>方法：`addConversationMark` / `removeConversationMark` | 是 | 是 |
| 删除一个或多个本地会话，由 `deleteMessages` 决定是否同时删除本地历史消息<br/>方法：`deleteConversations` | 否 | 是 |
| 删除服务端和本地的指定会话，由 `isDeleteServerMessages` 决定是否同时删除服务端历史消息<br/>方法：`deleteConversationFromServer` | 是 | 是 |
| 清空指定会话的本地未读消息数并同步当前账号的其他设备<br/>方法：`clearConversationUnreadMessageCount` | 是 | 是 |
| 清空全部会话的本地未读消息数并同步当前账号的其他设备<br/>方法：`clearAllConversationUnreadMessageCount` | 是 | 是 |

## 监听会话列表更新

当本地会话发生变化时，SDK 会触发 `ConversationListener#onConversationUpdate`。该回调不直接返回完整会话列表，应用应重新调用 `getAllConversationsBySort` 获取最新排序结果并刷新 UI。

```typescript
let conversationListener: ConversationListener = {
    onConversationUpdate: (): void => {
        let conversations: Array<Conversation> = ChatClient.getInstance()
            .chatManager()
            ?.getAllConversationsBySort() ?? [];
        // 使用最新会话列表刷新 UI。
    }
};

ChatClient.getInstance()
    .chatManager()
    ?.addConversationListener(conversationListener);

// 不再需要监听时移除。
ChatClient.getInstance()
    .chatManager()
    ?.removeConversationListener(conversationListener);
```

同一账号在其他设备上置顶、取消置顶、删除服务端会话、变更会话标记、修改免打扰状态或清除未读数时，本端可通过 `MultiDevicesListener#onConversationEvent` 收到相应事件。收到事件后，应重新读取本地会话列表并刷新界面。

## 接口最佳实践

| 场景 | 推荐做法 |
| :--- | :--- |
| 获取最新会话列表 | 使用默认的 `DataSyncType.CONVERSATIONS` 配置，在会话同步成功后读取本地数据。 |
| 首屏快速展示 | 收到 `onDatabaseOpened` 或确认 `isDatabaseOpened()` 为 `true` 后读取已有本地数据；收到会话同步成功事件后再次读取并刷新。 |
| 展示会话列表 | 优先调用 `getAllConversationsBySort`，直接使用 SDK 返回的置顶优先、按最后消息时间倒序的列表。 |
| 应用层筛选 | 调用 `getConversations` 或 `getAllConversationsBySort` 后，根据 `Conversation` 属性在应用层筛选。 |
| 响应会话变化 | 注册 `ConversationListener`；收到 `onConversationUpdate` 后重新读取本地会话列表并刷新 UI。多设备会话事件也应触发重新读取。 |
| 管理监听器 | 页面或组件销毁时移除 `ConnectionListener` 和 `ConversationListener`，避免重复回调和资源泄漏。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setDataSyncType`](#登录后自动同步会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#登录后自动同步会话列表) | `ChatClient` | 使用指定配置初始化 HarmonyOS SDK。 |
| [`addConnectionListener`](#监听会话列表同步状态) / [`removeConnectionListener`](#监听会话列表同步状态) | `ChatClient` | 添加或移除连接及数据同步监听器。 |
| [`isDatabaseOpened`](#监听会话列表同步状态) | `ChatClient` | 查询当前用户的本地数据库是否已经打开。 |
| [`setDeleteMessagesOnLeaveChatroom`](#会话相关选项) / [`isDeleteMessagesOnLeaveChatroom`](#会话相关选项) | `ChatOptions` | 设置或查询退出聊天室时是否删除该聊天室的本地消息。 |
| [`getConversations`](#一次性获取本地所有会话) | `ChatManager` | 获取当前加载到本地的会话数组。 |
| [`getConversation`](#获取指定会话) | `ChatManager` | 根据会话 ID 和类型获取或创建指定会话。 |
| [`getAllConversationsBySort`](#一次性获取本地所有会话) | `ChatManager` | 从本地数据库获取置顶优先并按最后消息时间倒序排列的全部会话。 |
| [`getConversationName`](#获取会话展示信息) / [`getConversationAvatar`](#获取会话展示信息) | `Conversation` | 获取单聊或群聊会话的显示名称和头像。 |
| [`getLatestMessage`](#获取会话展示信息) / [`getUnreadMsgCount`](#获取会话展示信息) | `Conversation` | 获取会话的最后一条消息或未读消息数。 |
| [`isPinned`](#获取会话展示信息) / [`marks`](#获取会话展示信息) | `Conversation` | 获取会话的置顶状态或会话标记。 |
| [`pinConversation`](#会话列表数据更新场景) | `ChatManager` | 设置或取消会话置顶。 |
| [`addConversationMark`](#会话列表数据更新场景) / [`removeConversationMark`](#会话列表数据更新场景) | `ChatManager` | 添加或移除会话标记。 |
| [`deleteConversations`](#会话列表数据更新场景) | `ChatManager` | 删除一个或多个本地会话，并按参数决定是否删除本地历史消息。 |
| [`deleteConversationFromServer`](#会话列表数据更新场景) | `ChatManager` | 删除服务端和本地的指定会话，并按参数决定是否删除服务端历史消息。 |
| [`clearConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空指定会话的本地未读消息数并同步当前账号的其他设备。 |
| [`clearAllConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空全部会话的本地未读消息数并同步当前账号的其他设备。 |
| [`addConversationListener`](#监听会话列表更新) / [`removeConversationListener`](#监听会话列表更新) | `ChatManager` | 添加或移除会话更新监听器。 |
