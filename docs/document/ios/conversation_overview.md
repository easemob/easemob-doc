# 会话介绍

## 功能说明

会话是单聊、群聊或聊天室中的消息集合。iOS SDK 通过 `EMConversation` 表示本地会话，应用可以读取会话 ID、会话类型、最新一条消息、未读数、置顶状态、会话标记、本地扩展属性、会话名称和头像等数据。

iOS SDK 支持在 [登录成功后自动同步服务端会话数据并写入本地](initialization.html#设置登录后自动同步数据)。应用在同步完成后，通过本地接口读取和展示会话列表。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- 如需使用服务端会话列表、会话置顶或会话标记等增值功能，已在环信控制台开通相应功能。

## 会话模型

### 会话类型和会话 ID

iOS SDK 通过 `EMConversationType` 和会话 ID 标识会话：

| 会话类型 | Objective-C 枚举值 | Swift 枚举值 | 会话 ID |
| :--- | :--- | :--- | :--- |
| 单聊 | `EMConversationTypeChat` | `.chat` | 对端用户 ID。 |
| 群聊 | `EMConversationTypeGroupChat` | `.groupChat` | 群组 ID。 |
| 聊天室 | `EMConversationTypeChatRoom` | `.chatRoom` | 聊天室 ID。 |

### 会话对象

会话列表中的每一项为 `EMConversation`，常用属性和方法如下：

| API | 类型或返回类型 | 说明 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 会话 ID。 |
| `type` | `EMConversationType` | 会话类型。 |
| `unreadMessagesCount` | `Int32` | 本地未读消息数。 |
| `messagesCount` | `Int32` | 本地消息数量。 |
| `latestMessage` | `EMChatMessage?` | 会话中的最新一条消息。 |
| `lastReceivedMessage()` | `EMChatMessage?` | 当前用户收到的最新一条消息。 |
| `ext` | `[AnyHashable: Any]` | 会话本地扩展属性。消息话题会话暂不可设置。 |
| `isChatThread` | `Bool` | 是否为消息话题会话。 |
| `isPinned` | `Bool` | 会话是否置顶。 |
| `pinnedTime` | `Int64` | 置顶时间戳，单位为毫秒；未置顶时为 `0`。 |
| `marks` | `[NSNumber]` | 会话标记数组。 |
| `disturbType` | `EMPushRemindType` | 会话免打扰类型。 |
| `conversationName()` | `String?` | 单聊返回对端昵称，群聊返回群组名称。 |
| `conversationAvatar()` | `String?` | 单聊返回对端头像，群聊返回群组头像。 |
| `pinnedMessages()` | `[EMChatMessage]?` | 当前会话本地保存的置顶消息。 |

```swift
func renderConversation(_ conversation: EMConversation) {
    let conversationId = conversation.conversationId
    let type = conversation.type
    let unreadCount = conversation.unreadMessagesCount
    let latestMessage = conversation.latestMessage
    let name = conversation.conversationName()
    let avatar = conversation.conversationAvatar()
}
```

:::tip
`EMConversation#conversationName` 和 `EMConversation#conversationAvatar` 用于获取会话列表展示所需的名称和头像。上述接口仅提供基础展示信息，不代表完整的用户属性、群组信息或聊天室信息。如需获取完整业务数据，应根据会话类型调用用户属性、群组或聊天室模块的相应接口。
:::

## 会话创建与更新

### 通过消息创建或更新会话

收发消息时，SDK 根据消息所属的会话创建或更新本地会话：

- 单聊消息：根据对端用户 ID 创建或更新单聊会话。
- 群聊消息：根据群组 ID 创建或更新群聊会话。
- 聊天室消息：根据聊天室 ID 创建或更新聊天室会话。

收到在线消息后，SDK 会更新会话的最近一条消息（`EMConversation#latestMessage`）、列表排序和未读数（`EMConversation#unreadMessagesCount`）等本地状态。

### 通过接口创建本地会话

调用 `getConversation` 时，将 `createIfNotExist` 设为 `true`，SDK 会在本地不存在指定会话时创建会话对象；设为 `false` 时只查找已有会话，未找到则返回 `nil`。

```swift
let conversation = EMClient.shared().chatManager?.getConversation(
    conversationId,
    type: .chat,
    createIfNotExist: true
)
```

创建或查询时应传入正确的会话类型。该接口只创建本地会话对象，不会创建服务端用户、群组或聊天室。

### 通过服务端同步更新会话列表

若要服务端同步更新会话列表，需要初始化前配置自动同步，登录后等待同步完成，再读取本地数据。

在调用 `initializeSDKWithOptions` 前，将 `EMOptions#dataSyncType` 配置为包含 `.conversations`。用户登录成功后，SDK 自动同步服务端会话数据并写入本地。

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}
```

应用通过 `syncDataStartWithType` 和 `syncDataFinished` 监听同步状态。`error == nil` 且 `type` 包含 `.conversations` 时，可以读取最新的本地会话列表。

```swift
final class ConversationSyncListener: NSObject, EMClientDelegate {
    func syncDataStart(with type: EMDataSyncType) {
        if type.contains(.conversations) {
            // 会话数据开始同步。
        }
    }

    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard error == nil, type.contains(.conversations) else {
            return
        }

        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []
        // 使用 conversations 刷新会话列表。
    }
}
```

## 会话列表与空会话

iOS SDK 提供以下本地会话列表读取方式：

| 方式 | API | 说明 |
| :--- | :--- | :--- |
| 排序列表 | `getAllConversations` | `isSort` 传 `true` 时，置顶会话优先；置顶和非置顶会话内部均按最新消息时间倒序排列。 |
| 未指定排序的列表 | `getAllConversations` | 等同于 `getAllConversations(false)`，返回本地会话数组。 |
| 数据库筛选 | `filterConversationsFromDB` | 从本地数据库加载全部会话或按闭包条件筛选会话，可选择先清理会话内存缓存。 |

```swift
let sortedConversations =
    EMClient.shared().chatManager?.getAllConversations(true) ?? []

let filteredConversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: false,
        filter: { conversation in
            conversation.unreadMessagesCount > 0
        }
    ) ?? []
```

空会话是没有消息的会话。例如，会话中的全部消息过期、被清除或被撤回后，该会话可能成为空会话。

从本地数据库加载会话时，是否包含空会话由 `EMOptions#loadEmptyConversations` 控制。该属性默认值为 `false`；如需包含空会话，应在调用 `initializeSDKWithOptions` 前设置为 `true`。

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.loadEmptyConversations = true

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}
```

空会话也可以进行置顶、添加标记和删除等操作。

## 当前会话与未读数

应用进入会话页面并处理完消息后，可以按业务需要清零会话未读数：

| API | 说明 |
| :--- | :--- |
| `clearConversationUnreadMessageCount` | 清零指定会话的本地未读数，并同步当前账号的其他设备。 |
| `clearAllConversationUnreadMessageCount` | 清零全部会话的本地未读数，并同步当前账号的其他设备。 |

```swift
EMClient.shared().chatManager?.clearConversationUnreadMessageCount(
    conversationId
) { error in
    if let error {
        print("清零未读数失败：\(error.errorDescription)")
    } else {
        print("会话未读数已清零")
    }
}
```

:::tip
清零会话未读数不会向消息发送方发送已读回执。若需通知原消息发送方，应调用 `sendMessageReadReceipts`，详见[消息已读回执](message_receipt.html)。
:::

## 会话功能列表

| 功能 | 主要 API | 说明 |
| :--- | :--- | :--- |
| 会话列表 | `getAllConversations`、`getAllConversations`、`filterConversationsFromDB` | 从本地内存或数据库读取会话列表，详见[会话列表](conversation_list.html)。 |
| 会话未读数 | `unreadMessagesCount`、`clearConversationUnreadMessageCount`、`clearAllConversationUnreadMessageCount` | 获取或清零会话未读数，详见[会话未读数](conversation_unread.html)。 |
| 会话删除 | `deleteConversation`、`deleteServerConversation`、`deleteAllMessagesAndConversations` | 删除本地会话及消息，或删除当前用户服务端的会话及消息，详见[删除会话](conversation_delete.html)。 |
| 会话置顶 | `pinConversation` | 设置或取消会话置顶，详见[置顶会话](conversation_pin.html)。 |
| 会话标记 | `addConversationMark`、`removeConversationMark` | 为一个或多个会话添加或移除标记，详见[会话标记](conversation_mark.html)。 |
| 会话免打扰 | `IEMPushManager` 的会话免打扰接口 | 设置或查询会话免打扰规则。 |
| 会话内本地消息 | `loadMessageWithId`、`loadMessagesStartFromId`、`deleteMessageWithId`、`deleteAllMessages` | 获取或删除本地会话消息。 |
| 服务端消息删除 | `removeMessagesFromServerMessageIds`、`removeMessagesFromServerWithTimeStamp` | 从当前会话的本地和服务端删除指定消息。 |
| 会话内置顶消息 | `pinMessage:completion`、`unpinMessage`、`getPinnedMessagesFromServer` | 置顶、取消置顶或获取会话中的置顶消息。 |

## 会话事件

#### 会话列表事件

本地会话列表发生变化时，SDK 通过 `conversationListDidUpdate` 返回更新后的会话数组。应用可使用回调数据刷新界面，或重新读取排序列表。

```swift
final class ConversationListListener: NSObject, EMConversationDelegate {
    func conversationListDidUpdate(
        _ conversationList: [EMConversation]
    ) {
        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []
        // 使用最新的 conversations 刷新界面。
    }
}

let listListener = ConversationListListener()
EMClient.shared().chatManager?.addConversation(delegate: listListener, queue: nil)

// 不再需要监听时移除。
EMClient.shared().chatManager?.removeConversation(delegate: listListener)
```

会话自动同步的开始和结束状态由 `syncDataStartWithType` 和 `syncDataFinished` 通知。

#### 多设备会话事件

通过 `addMultiDevicesDelegate` 注册 `EMMultiDevicesDelegate`，可在 `multiDevicesConversationEvent` 中接收当前账号其他设备执行的会话操作：

| Swift 事件 | Objective-C 枚举值 | 数值 | 说明 |
| :--- | :--- | :--- | :--- |
| `.conversationPinned` | `EMMultiDevicesEventConversationPinned` | 60 | 其他设备置顶会话。 |
| `.conversationUnpinned` | `EMMultiDevicesEventConversationUnpinned` | 61 | 其他设备取消置顶会话。 |
| `.conversationDelete` | `EMMultiDevicesEventConversationDelete` | 62 | 其他设备删除会话。 |
| `.conversationUpdateMark` | `EMMultiDevicesEventConversationUpdateMark` | 63 | 其他设备更新会话标记。 |
| `.conversationMuteInfoChanged` | `EMMultiDevicesEventConversationMuteInfoChanged` | 64 | 其他设备更新会话免打扰设置。 |
| `.conversationUnreadMessageCountCleared` | `EMMultiDevicesEventConversationUnreadMessageCountCleared` | 65 | 其他设备清零指定会话的未读数。 |
| `.allConversationUnreadMessageCountCleared` | `EMMultiDevicesEventAllConversationUnreadMessageCountCleared` | 66 | 其他设备清零全部会话的未读数。 |

```swift
final class ConversationMultiDeviceListener:
    NSObject,
    EMMultiDevicesDelegate {

    func multiDevicesConversationEvent(
        _ event: EMMultiDevicesEvent,
        conversationId: String,
        conversationType: EMConversationType
    ) {
        // 根据 event 更新对应会话，并按需刷新会话列表。
    }
}

let multiDeviceListener = ConversationMultiDeviceListener()
EMClient.shared().addMultiDevices(
    delegate: multiDeviceListener,
    queue: nil
)

// 不再需要监听时移除。
EMClient.shared().removeMultiDevicesDelegate(multiDeviceListener)
```

## 最佳实践

- 初始化 SDK 前将 `EMOptions#dataSyncType` 配置为包含 `.conversations`，并在会话数据同步成功后读取本地列表。
- 展示会话列表时优先调用 `getAllConversations` 并将 `isSort` 传 `true`，直接使用 SDK 返回的置顶优先排序结果。
- 仅查询本地会话时，将 `getConversation` 的 `createIfNotExist` 传 `false`，避免意外创建空会话。
- 注册 `EMConversationDelegate`；收到 `conversationListDidUpdate` 后刷新会话列表。
- 页面或组件销毁时移除 `EMClientDelegate`、`EMConversationDelegate` 和 `EMMultiDevicesDelegate`，避免重复回调。
- 会话未读数清零与消息已读回执是两个独立功能，前者更新当前账号的会话状态，后者通知原消息发送方。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`conversationId`](#会话对象) / [`type`](#会话对象) | `EMConversation` | 获取会话 ID 和会话类型。 |
| [`unreadMessagesCount`](#会话对象) / [`latestMessage`](#会话对象) | `EMConversation` | 获取会话未读数和最新一条消息。 |
| [`marks`](#会话对象) / [`ext`](#会话对象) | `EMConversation` | 获取会话标记和本地扩展属性。 |
| [`conversationName`](#会话对象) / [`conversationAvatar`](#会话对象) | `EMConversation` | 获取会话显示名称和头像。 |
| [`getConversation`](#通过接口创建本地会话) | `IEMChatManager` | 查找本地会话，并可按参数在会话不存在时创建。 |
| [`dataSyncType`](#通过服务端同步更新会话列表) | `EMOptions` | 设置登录后自动同步的数据类型。 |
| [`initializeSDKWithOptions`](#通过服务端同步更新会话列表) | `EMClient` | 使用指定配置初始化 iOS SDK。 |
| [`getAllConversations`](#会话列表与空会话) / [`getAllConversations`](#会话列表与空会话) | `IEMChatManager` | 获取本地会话数组。 |
| [`filterConversationsFromDB`](#会话列表与空会话) | `IEMChatManager` | 从本地数据库加载全部会话或筛选会话。 |
| [`loadEmptyConversations`](#会话列表与空会话) | `EMOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
| [`clearConversationUnreadMessageCount`](#当前会话与未读数) | `IEMChatManager` | 清零指定会话的本地未读数。 |
| [`clearAllConversationUnreadMessageCount`](#当前会话与未读数) | `IEMChatManager` | 清零全部会话的本地未读数。 |
| [`sendMessageReadReceipts`](#当前会话与未读数) | `IEMChatManager` | 为单聊或群聊消息发送已读回执。 |
| [`deleteConversation`](#会话功能列表) / [`deleteServerConversation`](#会话功能列表) | `IEMChatManager` | 删除本地会话，或删除当前用户服务端的指定会话。 |
| [`deleteAllMessagesAndConversations`](#会话功能列表) | `IEMChatManager` | 删除全部会话和消息，并按参数决定是否清除服务端数据。 |
| [`pinConversation`](#会话功能列表) | `IEMChatManager` | 设置或取消会话置顶。 |
| [`addConversationMark`](#会话功能列表) / [`removeConversationMark`](#会话功能列表) | `IEMChatManager` | 为会话添加或移除标记。 |
| [`deleteMessageWithId`](#会话功能列表) / [`deleteAllMessages`](#会话功能列表) | `EMConversation` | 删除指定本地消息或清空会话的全部本地消息。 |
| [`pinMessage`](#会话功能列表) / [`unpinMessage`](#会话功能列表) | `IEMChatManager` | 置顶或取消置顶会话中的消息。 |
| [`getPinnedMessagesFromServer`](#会话功能列表) | `IEMChatManager` | 从服务器获取会话中的置顶消息。 |
