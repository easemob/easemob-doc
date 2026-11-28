# 会话列表

## 功能说明

- **本地会话列表：** 对于单聊、群组聊天和聊天室会话，用户收发消息时，SDK 会在本地创建或更新对应会话，并在内部维护对应会话。自 SDK v5.1.0 起，本地会话列表默认不包含聊天室会话，可通过初始化配置按需展示。应用可从本地内存或数据库读取会话列表，用于展示会话名称、头像、最后一条消息、未读数、置顶状态和会话标记等信息。

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
| `setEnableChatroomConversation(enable: boolean)` | 自 SDK v5.1.0 起支持，设置加载、上报及分页返回会话列表时是否包含聊天室会话。<br/> - （默认）`false`：不包含。<br/> - `true`：包含。该配置不影响聊天室消息收发，SDK 仍会在内部创建和维护聊天室会话。应在初始化 SDK 前设置，可通过 `isEnableChatroomConversation()` 查询当前配置。 |
| `setAutoLoadAllConversations(autoLoad: boolean)` | 自 SDK v5.1.0 起支持，设置登录成功后是否自动将全部本地会话加载到内存。<br/> - （默认）`true`：自动加载。<br/> - `false`：不自动全量加载，可通过分页接口按需读取。应在初始化 SDK 前设置，可通过 `isAutoLoadAllConversations()` 查询当前配置；该选项与服务端数据同步配置相互独立。 |
| `setDeleteMessagesOnLeaveChatroom(boolean delete)` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/>- （默认）`true`：删除本地消息。<br/>- `false`：保留本地消息。可通过 `isDeleteMessagesOnLeaveChatroom()` 查询当前设置。 |

### 分页获取本地会话

自 SDK v5.1.0 起，可以调用 `ChatManager#getConversationsFromDB` 从本地数据库分页获取会话，适合本地会话较多、需要按需加载的场景。返回结果为 `Promise<CursorResult<Conversation>>`，通过 `getResult()` 获取本页会话，通过 `getNextCursor()` 获取下一页游标。

会话按以下优先级依次排序：

1. 置顶会话排在非置顶会话之前。
2. 置顶状态相同时，按最新一条消息的服务器时间戳倒序排列。
3. 置顶状态和时间戳均相同时，按会话 ID 倒序排列，比较时不区分大小写。

建议在 SDK 初始化前调用 `ChatOptions#setAutoLoadAllConversations(false)`，关闭自动全量加载，以减少初始加载量和内存占用。保持默认值 `true` 时仍可调用分页接口，但其他会话列表读取路径可能触发全量加载。该配置只控制本地会话加载，不改变 `setDataSyncType` 指定的服务端数据同步范围。

```typescript
// 初始化前关闭自动加载全部本地会话。
const options: ChatOptions = new ChatOptions({
    appKey: 'your-org#your-app'
});
options.setAutoLoadAllConversations(false);
ChatClient.getInstance().init(context, options);
```

确认当前用户的本地数据库已打开后，即可分页读取已有本地会话；如需读取本次登录后从服务端同步的最新数据，应等待会话数据同步成功。默认不返回聊天室会话，如需包含，详见 [会话相关选项](#会话相关选项)。

```typescript
// cursor：查询起点，默认空字符串，表示从第一页开始；获取后续页时，原样传入上一页 `getNextCursor()` 返回的游标。
let cursor: string = '';
let hasMore: boolean = true;

// 先调用一次获取第一页；上一页请求完成后，可再次调用以获取下一页。
function loadNextPage(): void {
    if (!hasMore) {
        return;
    }
    // pageSize：每页期望返回的会话数量，默认 `50`，取值范围为 `[1,100]`。小于 `1` 时按 `1` 处理，大于 `100` 时按 `100` 处理。
    ChatClient.getInstance().chatManager()?.getConversationsFromDB(cursor, 50)
        .then((result: CursorResult<Conversation>): void => {
            const conversations: Array<Conversation> = result.getResult();
            cursor = result.getNextCursor();
            hasMore = cursor.length > 0;
            // 将 conversations 追加到已展示的会话列表。
            // hasMore 为 false 时，当前页为最后一页，不再继续请求。
        })
        .catch((error: ChatError): void => {
            // 获取失败，根据 error.errorCode 和 error.description 处理。
            // INVALID_PARAM 表示游标无效；本地数据库不可用等查询失败返回 DATABASE_ERROR。
        });
}

loadNextPage();
```

分页读取会将本页会话加入内存缓存，但读取本身不触发 `onConversationUpdate`。应用应直接使用 Promise 返回的本页结果更新界面。

### 一次性获取本地所有会话

保持默认的自动全量加载配置时，调用 `getAllConversationsBySort` 可以加载本地会话并获取排序后的会话数组，返回 `Array<Conversation>`。自 SDK v5.1.0 起，会话按以下优先级依次排序：

1. 置顶会话排在非置顶会话之前。
2. 置顶状态相同时，按最新一条消息的服务器时间戳倒序排列。
3. 置顶状态和时间戳均相同时，按会话 ID 倒序排列，比较时不区分大小写。

上述规则不按置顶时间排序。`ChatOptions#setSortMessageByServerTime(false)` 不改变本地会话列表排序；该配置仍用于本地消息的排序和搜索，详见 [搜索消息](message_search_local.html)。

```typescript
let conversations: Array<Conversation> = ChatClient.getInstance()
    .chatManager()
    ?.getAllConversationsBySort() ?? [];
```

如果不需要排序，可以调用 `getConversations` 获取 SDK 当前维护的本地会话数组。该方法不提供排序、分页或筛选参数，也不保证返回顺序。

```typescript
let conversations: Array<Conversation> = ChatClient.getInstance()
    .chatManager()
    ?.getConversations() ?? [];
```

关闭自动全量加载后，`getAllConversationsBySort` 和 `getConversations` 返回当前已加载到内存的会话，可能不包含数据库中的全部会话。需要遍历本地数据库时，应调用 [分页获取本地会话](#分页获取本地会话) 接口，持续使用返回的游标获取后续页。

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

当本地会话发生变化时，SDK 会触发 `ConversationListener#onConversationUpdate`。该回调不直接返回完整会话列表。使用自动全量加载时，可按以下示例调用 `getAllConversationsBySort` 刷新 UI；采用分页展示时，应重置游标，从第一页重新读取并按需恢复已展示范围。

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
| 展示会话列表 | 自动全量加载时调用 `getAllConversationsBySort`；会话较多时，关闭自动全量加载并调用 `getConversationsFromDB` 分页读取。使用 SDK 返回的统一排序结果。 |
| 应用层筛选 | 全量加载后按 `Conversation` 属性筛选；分页模式下可逐页筛选，需要完整筛选结果时应遍历到末页。 |
| 响应会话变化 | 注册 `ConversationListener`；收到 `onConversationUpdate` 后重新读取本地会话列表并刷新 UI。多设备会话事件也应触发重新读取。 |
| 管理监听器 | 页面或组件销毁时移除 `ConnectionListener` 和 `ConversationListener`，避免重复回调和资源泄漏。 |

## 接口列表

<div class="harmonyos-api-list-table">

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setDataSyncType`](#登录后自动同步会话列表) | `ChatOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#登录后自动同步会话列表) | `ChatClient` | 使用指定配置初始化 HarmonyOS SDK。 |
| [`addConnectionListener`](#监听会话列表同步状态) / [`removeConnectionListener`](#监听会话列表同步状态) | `ChatClient` | 添加或移除连接及数据同步监听器。 |
| [`isDatabaseOpened`](#监听会话列表同步状态) | `ChatClient` | 查询当前用户的本地数据库是否已经打开。 |
| [`setDeleteMessagesOnLeaveChatroom`](#会话相关选项) / [`isDeleteMessagesOnLeaveChatroom`](#会话相关选项) | `ChatOptions` | 设置或查询退出聊天室时是否删除该聊天室的本地消息。 |
| [`setEnableChatroomConversation`](#会话相关选项) / [`isEnableChatroomConversation`](#会话相关选项) | `ChatOptions` | 设置或查询会话列表是否包含聊天室会话，默认不包含。 |
| [`setAutoLoadAllConversations`](#会话相关选项) / [`isAutoLoadAllConversations`](#会话相关选项) | `ChatOptions` | 设置或查询是否自动将全部本地会话加载到内存，默认开启。 |
| [`getConversationsFromDB`](#分页获取本地会话) | `ChatManager` | 从本地数据库分页获取会话，并返回下一页游标。 |
| [`getResult`](#分页获取本地会话) / [`getNextCursor`](#分页获取本地会话) | `CursorResult<Conversation>` | 获取本页会话或下一页游标。 |
| [`setSortMessageByServerTime`](#一次性获取本地所有会话) | `ChatOptions` | 设置本地消息排序和搜索的时间依据；不改变本地会话列表排序。 |
| [`getConversations`](#一次性获取本地所有会话) | `ChatManager` | 获取当前已加载的本地会话数组，不保证返回顺序。 |
| [`getConversation`](#获取指定会话) | `ChatManager` | 根据会话 ID 和类型获取或创建指定会话。 |
| [`getAllConversationsBySort`](#一次性获取本地所有会话) | `ChatManager` | 获取排序后的本地会话数组。自动全量加载关闭时，只返回当前已加载的会话。 |
| [`getConversationName`](#获取会话名称和头像) / [`getConversationAvatar`](#获取会话名称和头像) | `Conversation` | 获取单聊或群聊会话的显示名称和头像。 |
| [`getLatestMessage`](#获取会话名称和头像) / [`getUnreadMsgCount`](#获取会话名称和头像) | `Conversation` | 获取会话的最后一条消息或未读消息数。 |
| [`isPinned`](#获取会话名称和头像) / [`marks`](#获取会话名称和头像) | `Conversation` | 获取会话的置顶状态或会话标记。 |
| [`pinConversation`](#会话列表数据更新场景) | `ChatManager` | 设置或取消会话置顶。 |
| [`addConversationMark`](#会话列表数据更新场景) / [`removeConversationMark`](#会话列表数据更新场景) | `ChatManager` | 添加或移除会话标记。 |
| [`deleteConversations`](#会话列表数据更新场景) | `ChatManager` | 删除一个或多个本地会话，并按参数决定是否删除本地历史消息。 |
| [`deleteConversationFromServer`](#会话列表数据更新场景) | `ChatManager` | 删除服务端和本地的指定会话，并按参数决定是否删除服务端历史消息。 |
| [`clearConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空指定会话的本地未读消息数并同步当前账号的其他设备。 |
| [`clearAllConversationUnreadMessageCount`](#会话列表数据更新场景) | `ChatManager` | 清空全部会话的本地未读消息数并同步当前账号的其他设备。 |
| [`addConversationListener`](#监听会话列表更新) / [`removeConversationListener`](#监听会话列表更新) | `ChatManager` | 添加或移除会话更新监听器。 |

</div>
