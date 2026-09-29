# 会话列表

## 功能说明

- **本地会话列表：** 对于单聊、群组聊天和聊天室会话，用户收发消息时，SDK 会在本地创建或更新对应会话，并将其维护在本地会话列表缓存中。应用可从本地内存或数据库读取会话列表，用于展示会话名称、头像、最后一条消息、未读数、置顶状态和会话标记等信息。**自 SDK v5.1.0 起，默认情况下，本地会话列表不包含聊天室会话。**
- **服务端与本地数据：** 环信服务器和 SDK 本地均可维护会话列表数据：服务端保存当前用户的会话状态，SDK 本地缓存用于客户端快速读取和展示会话列表。完成 SDK 初始化并成功登录后，SDK 会自动维护本地会话列表；会话同步、主动刷新、收发消息、删除会话、清空未读数、设置或取消置顶、添加或移除会话标记等操作均可能更新本地列表。
- **同步与变更通知：** 登录后默认自动同步服务端会话数据。因此，登录后应等待会话同步完成，再读取本地会话列表。当本地会话列表发生变化时，SDK 会通过会话列表更新事件通知应用；同一账号在其他设备上设置或取消会话置顶时，当前设备也可通过多设备事件感知该变更。

## 功能开通

使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 获取会话列表

应用应按照登录后自动同步、监听同步完成和读取本地会话列表的流程获取最新会话数据。

### 会话相关选项

初始化时，你可以在 `EMOptions` 中设置以下会话相关选项：

| 选项 | 描述 |
| :--- | :--- |
| `enableChatroomConversation` | 设置获取本地会话列表时是否包含聊天室会话。该配置不控制聊天室会话的创建或存储，也不影响聊天室消息的正常收发。该功能自 SDK v5.1.0 起支持。<br/> - `true`：本地会话列表中包含聊天室会话。<br/> -（默认）`false`：本地会话列表中不包含聊天室会话。必须在初始化 SDK 前设置。<br/> 读取 `EMOptions#enableChatroomConversation` 属性可以查询当前配置。 |
| `deleteMessagesOnLeaveChatroom` | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。<br/> -（默认）`true`：删除本地消息。<br/> - `false`：保留本地消息。 |
| `loadEmptyConversations` | 设置从本地数据库加载会话时是否包含空会话。必须在初始化 SDK 前设置。<br/> - `true`：包含空会话。<br/> -（默认）`false`：不包含空会话。 |
| `autoLoadConversations` | 设置登录成功后是否自动将本地数据库中的全部会话加载到内存。必须在初始化 SDK 前设置。<br/> -（默认）`true`：自动加载全部会话。<br/> - `false`：不自动加载全部会话，可通过分页或筛选接口按需加载。 |

### 登录后自动同步会话列表

`EMOptions#dataSyncType` 的默认值为 `.conversations`。用户登录成功后，SDK 会自动同步服务端会话数据并写入本地。

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}
```

如果还需要同步好友列表或已加入的群组列表，可以组合配置 `.contacts` 或 `.joinedGroups`：

```swift
options.dataSyncType = [.conversations, .contacts, .joinedGroups]
```

`EMDataSyncType` 是位选项。如需关闭登录后的自动数据同步，将 `dataSyncType` 设置为 `.none`。关于登录后自动同步数据，详见 [SDK 初始化文档](initialization.html#设置登录后自动同步数据)。

### 监听会话列表同步状态

通过 `EMClientDelegate` 监听登录后的数据同步状态。当 `type` 包含 `.conversations` 时，表示当前通知涉及会话列表同步。

```swift
final class ConversationSyncListener: NSObject, EMClientDelegate {
    func syncDataStart(with type: EMDataSyncType) {
        if type.contains(.conversations) {
            // 会话列表开始同步。
        }
    }

    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard type.contains(.conversations) else {
            return
        }

        if let error {
            print("会话列表同步失败：\(error.errorDescription)")
        } else {
            // 会话列表同步成功，可以读取本地会话列表。
            let conversations =
                EMClient.shared().chatManager?.getAllConversations(true) ?? []
        }
    }
}

let syncListener = ConversationSyncListener()
EMClient.shared().add(syncListener, delegateQueue: nil)

// 不再需要监听时移除。
EMClient.shared().removeDelegate(syncListener)
```

`syncDataFinished(_:type:)` 在同步成功、失败、超时或断连结束时均会触发。只有 `error == nil` 时，才表示本次同步成功。

### 分页获取本地会话

自 SDK v5.1.0 起，你可以调用 `IEMChatManager#getConversationsFromDBWithCursor:pageSize:completion:` 方法，从本地数据库分页获取会话列表。SDK 优先返回置顶会话；对于置顶状态相同的会话，SDK 按照最新一条消息的服务器时间戳降序排列；若时间戳也相同，则按照会话 ID 降序排列，比较会话 ID 时不区分大小写。

调用该方法前，需在 SDK 初始化时将 `EMOptions#autoLoadConversations` 设置为 `NO`，关闭本地会话的自动全量加载。该属性默认值为 `YES`。否则，SDK 会在登录成功后将数据库中的全部会话加载到内存，无法发挥分页加载在减少初始加载量和内存占用方面的作用。

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
// SDK 初始化前关闭自动加载全部本地会话。
options.autoLoadConversations = NO;
[[EMClient sharedClient] initializeSDKWithOptions:options];

// 首次查询时，cursor 传 nil 或 @""，表示从第一页开始获取。
NSString *cursor = @"";
// pageSize 表示每页期望返回的会话数量，取值范围为 [1,100]。
NSInteger pageSize = 20;

[EMClient.sharedClient.chatManager getConversationsFromDBWithCursor:cursor
                                                            pageSize:pageSize
                                                          completion:^(EMCursorResult<EMConversation *> * _Nullable result,
                                                                       EMError * _Nullable error) {
    if (error) {
        // cursor 无效时，error.code 为 EMErrorInvalidParam。
        return;
    }

    NSArray<EMConversation *> *conversations = result.list;
    NSString *nextCursor = result.cursor;

    if (nextCursor.length > 0) {
        // 保存 nextCursor，并在获取下一页时将其作为 cursor 参数传入。
    } else {
        // nextCursor 为空字符串，表示当前页为最后一页，无需继续请求。
    }
}];
```

### 获取本地所有或筛选的会话

调用 `filterConversationsFromDB`，可以从本地数据库获取全部会话或按条件筛选会话。该接口必须在登录成功后调用，并同步返回 `[EMConversation]?`。

- `filter` 传 `nil`：获取本地数据库中的全部会话。
- `filter` 返回 `true`：保留该会话并将其包含在返回结果中。
- `filter` 返回 `false`：过滤该会话。
- `cleanMemoryCache` 为 `true`：加载前清理已有的会话内存缓存。
- `cleanMemoryCache` 为 `false`：保留已有的会话内存缓存。

获取数据库中的全部会话：

```swift
let conversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: false,
        filter: nil
    ) ?? []
```

以下示例只加载存在未读消息的会话：

```swift
let unreadConversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: true,
        filter: { conversation in
            conversation.unreadMessagesCount > 0
        }
    ) ?? []
```

筛选闭包还可以根据 `conversationId`、`type`、`ext`、`isPinned`、`latestMessage` 或 `marks` 等会话属性决定是否保留会话。

关于设置本地会话列表默认是否包含聊天室会话或是否加载空会话，详见 [会话相关选项](#会话相关选项)。

### 一次性获取本地所有会话

调用 `getAllConversations(_:)` 获取本地会话数组。传 `true` 时，SDK 返回排序后的会话列表：

- 置顶会话排在非置顶会话之前。
- 置顶和非置顶会话内部均按最后一条消息的时间戳倒序排列。
- 当前实现会过滤消息话题（thread）会话。

```swift
let conversations =
    EMClient.shared().chatManager?.getAllConversations(true) ?? []
```

如果不需要 SDK 排序，可以调用无参数的 `getAllConversations()`。该方法在 iOS 实现中等同于 `getAllConversations(false)`：

```swift
let conversations =
    EMClient.shared().chatManager?.getAllConversations() ?? []
```

**本地会话读取接口与自动加载会话的关系**

初始化 SDK 前，可以通过 `EMOptions#autoLoadConversations` 设置登录成功后是否自动将本地数据库中的会话加载到内存：

- （默认）`true`：登录后自动加载本地会话，应用可以直接读取内存中的会话及单个会话未读数。
-  `false`：登录后不自动加载全部会话，可减少内存占用。需要完整或筛选后的数据库会话时，应显式调用 `filterConversationsFromDB`。

:::tip
`dataSyncType` 和 `autoLoadConversations` 控制不同的数据处理阶段：

- `dataSyncType` 包含 `.conversations`：登录后将服务端会话数据同步到本地。
- `autoLoadConversations = true`：登录后将本地数据库会话自动加载到内存。

如果开启会话列表同步但关闭自动加载，服务端数据仍可同步到本地；应用应按需从数据库筛选并加载会话。
:::

## 获取会话名称和头像

调用 `EMConversation#conversationName` 和 `EMConversation#conversationAvatar` 可获取会话列表展示所需的名称和头像：

- 单聊会话：通常为对端用户的昵称和头像。
- 群聊会话：通常为群名称和群头像。
- 相关用户或群组信息尚未同步、未加载或不可用时，属性可能为空字符串。

```swift
let conversationName = conversation.conversationName()
let conversationAvatar = conversation.conversationAvatar()
```

## 清除内存中的会话

调用 `cleanConversationsMemoryCache` 清除内存中的全部会话，以释放内存。该操作清理的是内存缓存，不删除本地数据库中的会话和消息。

```swift
EMClient.shared().chatManager?.cleanConversationsMemoryCache()
```

清理后，如果需要重新读取数据库中的完整会话列表，应调用 `filterConversationsFromDB`，并将 `filter` 传 `nil`。

## 降低会话占用内存的示例

对于会话数量较多的场景，可以采用以下方式降低会话数据的内存占用：

1. 初始化 SDK 前，将 `autoLoadConversations` 设置为 `false`，关闭登录后的会话自动加载。
2. 按需调用 `filterConversationsFromDB` 加载部分会话；需要替换当前缓存时，将 `cleanMemoryCache` 设置为 `true`。
3. 当业务侧检测到内存占用较高，且暂时不需要内存中的会话数据时，调用 `cleanConversationsMemoryCache()`。

```swift
// 步骤 1：初始化 SDK 前关闭自动加载会话。
let options = EMOptions(appkey: "your-org#your-app")
options.autoLoadConversations = false
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}

// 步骤 2：登录成功后，按业务条件从数据库加载部分会话。
let unreadConversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: true,
        filter: { conversation in
            conversation.unreadMessagesCount > 0
        }
    ) ?? []
```

当业务侧检测到内存占用较高，且当前不再需要内存中的会话数据时，再单独清理：

```swift
EMClient.shared().chatManager?.cleanConversationsMemoryCache()
```

:::tip
关闭自动加载或清除内存缓存后，直接从内存读取的会话及未读数可能不完整。需要完整数据时，应先从本地数据库加载相应会话。
:::

## 会话列表数据更新场景

| 场景 | 是否影响服务端数据 | 是否影响本地会话列表 |
| :--- | :--- | :--- |
| 登录后自动同步服务端会话数据并写入本地 | 否，不修改服务端会话状态 | 是 |
| 收发消息时，SDK 创建或更新会话的最新消息、排序和未读数 | 视消息及服务端配置而定 | 是 |
| 设置或取消会话置顶<br/>方法：`pinConversation:isPinned:completionBlock:` | 是 | 是 |
| 添加或移除会话标记<br/>方法：`addConversationMark:mark:completion:` / `removeConversationMark:mark:completion:` | 是 | 是 |
| 删除本地会话，并由参数决定是否删除本地消息<br>方法：`deleteConversation:isDeleteMessages:completion:` | 否 | 是 |
| 删除服务端和本地指定会话，并由参数决定是否删除服务端消息<br>方法：`deleteServerConversation:conversationType:isDeleteServerMessages:completion:` | 是 | 是 |
| 清空指定会话未读数并同步至当前用户其他设备<br>方法：`clearConversationUnreadMessageCount:completion:` | 是，多设备同步 | 是 |
| 清空全部会话未读数并同步至当前用户其他设备<br/>方法：`clearAllConversationUnreadMessageCount:` | 是，多设备同步 | 是 |
| 清除会话内存缓存<br/>方法：`cleanConversationsMemoryCache` | 否 | 仅影响内存，不删除数据库数据 |

:::tip
`clearConversationUnreadMessageCount:completion:` 仅清除未读数并同步多设备状态，不会向消息对端发送已读回执。发送消息级已读回执需使用相应的回执接口。
:::

## 监听会话列表更新

本地会话列表发生变化时，SDK 通过 `conversationListDidUpdate` 返回更新后的会话数组。通过 `addConversation` 注册代理，不再需要时调用 `removeConversation`。

```swift
final class ConversationListListener: NSObject, EMConversationDelegate {
    func conversationListDidUpdate(
        _ conversationList: [EMConversation]
    ) {
        // 使用回调返回的会话列表刷新 UI。
        // 如果业务要求置顶优先并按最新消息排序，也可重新读取排序列表：
        let sortedConversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []
    }
}

let listListener = ConversationListListener()
EMClient.shared().chatManager?.addConversation(delegate: listListener, queue: nil)

// 页面或组件销毁、不再需要监听时移除。
EMClient.shared().chatManager?.removeConversation(delegate: listListener)
```

`delegateQueue` 传 `nil` 时，当前实现将回调分发到主队列；传入自定义队列时，应切换到主线程后再更新 UI。

## 接口最佳实践

| 场景 | 推荐做法 |
| :--- | :--- |
| 获取服务端维护的最新会话数据 | 使用 `EMOptions#dataSyncType` 默认的 `.conversations` 配置，或在初始化前显式配置该类型；登录后等待同步成功，再读取本地数据。 |
| 分页加载本地会话 | 初始化前将 `autoLoadConversations` 设置为 `false`，再调用 `getConversationsFromDBWithCursor` 按游标加载。 |
| 展示已排序的会话列表 | 调用 `getAllConversations(true)`，使用置顶优先、按最后消息时间倒序的会话数组。 |
| 按条件加载数据库会话 | 调用 `filterConversationsFromDB`；需要全部会话时将 `filter` 传 `nil`。 |
| 响应会话变化 | 注册 `EMConversationDelegate`；收到 `conversationListDidUpdate` 后使用回调列表或重新读取排序列表刷新 UI。 |
| 管理监听 | 页面或组件销毁时移除 `EMClientDelegate` 和 `EMConversationDelegate`，避免重复回调。 |
| 释放并恢复会话内存 | 调用 `cleanConversationsMemoryCache()` 后，如需恢复完整列表，使用 `filterConversationsFromDB` 从数据库重新加载。 |
| 读取会话展示信息 | 使用 `conversationName()`、`conversationAvatar()`、`latestMessage`、`unreadMessagesCount`、`isPinned` 和 `marks`。 |

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`dataSyncType`](#登录后自动同步会话列表) | `EMOptions` | 设置登录成功后自动同步的数据类型。 |
| [`enableChatroomConversation`](#会话相关选项) | `EMOptions` | 设置收发聊天室消息时是否创建本地聊天室会话，也可读取该属性查询当前配置。 |
| [`loadEmptyConversations`](#会话相关选项) | `EMOptions` | 设置从本地加载会话时是否包含空会话。 |
| [`deleteMessagesOnLeaveChatroom`](#会话相关选项) | `EMOptions` | 设置退出聊天室时是否删除该聊天室的本地消息。 |
| [`autoLoadConversations`](#分页获取本地会话) | `EMOptions` | 设置登录后是否自动将本地会话加载到内存。 |
| [`getConversationsFromDBWithCursor`](#分页获取本地会话) | `IEMChatManager` | 从本地数据库分页获取会话列表。 |
| [`filterConversationsFromDB`](#获取本地所有或筛选的会话) | `IEMChatManager` | 从本地数据库获取全部会话或按条件筛选会话。 |
| [`getAllConversations`](#一次性获取本地所有会话) | `IEMChatManager` | 获取本地会话数组，并按参数决定是否排序。 |
| [`getAllConversations`](#一次性获取本地所有会话) | `IEMChatManager` | 获取未要求排序的本地会话数组。 |
| [`cleanConversationsMemoryCache`](#清除内存中的会话) | `IEMChatManager` | 清理内存中的全部会话缓存。 |
| [`pinConversation`](#会话列表数据更新场景) | `IEMChatManager` | 设置或取消会话置顶。 |
| [`addConversationMark`](#会话列表数据更新场景) / [`removeConversationMark`](#会话列表数据更新场景) | `IEMChatManager` | 添加或移除服务端及本地会话标记。 |
| [`deleteConversation`](#会话列表数据更新场景) | `IEMChatManager` | 删除本地会话，并按参数决定是否删除本地消息。 |
| [`deleteServerConversation`](#会话列表数据更新场景) | `IEMChatManager` | 删除服务端和本地指定会话。 |
| [`clearConversationUnreadMessageCount`](#会话列表数据更新场景) | `IEMChatManager` | 清空指定会话未读数并同步多设备状态。 |
| [`clearAllConversationUnreadMessageCount`](#会话列表数据更新场景) | `IEMChatManager` | 清空全部会话未读数并同步多设备状态。 |
