# 会话标记

## 功能说明

会话标记用于为会话添加业务分类，例如标星、待处理或重要客户等。iOS SDK 支持为单聊、群聊和聊天室会话添加或移除标记。

SDK 提供 `EMMarkType0` 至 `EMMarkType19` 共 20 个标记，单个会话最多可同时包含 20 个标记。各标记与业务含义之间的映射由应用自行定义和维护。在 Swift 中，对应枚举值为 `.markType0` 至 `.markType19`。

```swift
let markMapping: [EMMarkType: String] = [
    .markType0: "important",
    .markType1: "pending",
    .markType2: "customer"
]
```

:::tip
会话标记只用于业务分类和筛选，不会影响会话未读数、消息收发、消息已读状态或会话置顶状态。
:::

## 功能开通

会话标记属于服务端会话列表功能的一部分。使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已开通[服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 添加会话标记

调用 `addConversationMark` 为一个或多个会话添加指定标记。该操作会同时更新服务端和本地的会话标记，单次最多传入 20 个会话 ID。

添加会话标记后，SDK 会同时更新服务端和本地的标记数据。初始化 SDK 前，将 `EMOptions#dataSyncType` 配置为包含 `EMDataSyncTypeConversations`。登录后，当 `syncDataFinished` 通知会话数据同步成功时，可通过本地会话列表接口获取 `EMConversation` 对象，并通过 `EMConversation#marks` 获取该会话的全部标记。

若服务端会话列表达到数量限制（默认最多 100 个会话），服务端可能根据会话活跃度移除不活跃会话，对应标记也可能不再随服务端会话列表同步到本地。

```swift
let conversationIds = [
    "user2",
    "group1"
]

EMClient.shared().chatManager?.addConversationMark(
    conversationIds,
    mark: .markType0
) { error in
    if let error {
        print("添加会话标记失败：\(error.errorDescription)")
    } else {
        print("会话标记添加成功")
    }
}
```

参数说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `conversationIds` | `[String]` | 会话 ID 数组，不能为空，单次最多传入 20 个。<br/> - 单聊：对端用户 ID。<br/> - 群聊：群组 ID。<br/> - 聊天室：聊天室 ID。 |
| `mark` | `EMMarkType` | 要添加的标记，取值为 `.markType0` 至 `.markType19`。 |
| `completion` | `(EMError?) -> Void` | 异步操作结果。`error == nil` 表示成功，否则可通过 `EMError#code` 和 `EMError#errorDescription` 处理失败。 |

:::tip
会话标记不会将会话标为“消息已读”或“消息未读”。如需清除会话未读数，应使用会话未读数接口。
:::

## 移除会话标记

调用 `removeConversationMark` 从一个或多个会话中移除指定标记。该操作会同时更新服务端和本地的会话标记，单次最多传入 20 个会话 ID。

```swift
let conversationIds = [
    "user2",
    "group1"
]

EMClient.shared().chatManager?.removeConversationMark(
    conversationIds,
    mark: .markType0
) { error in
    if let error {
        print("移除会话标记失败：\(error.errorDescription)")
    } else {
        print("会话标记移除成功")
    }
}
```

`removeConversationMark` 的参数规则与 [添加标记](#添加会话标记) 接口相同。移除某个标记不会影响该会话已有的其他标记。

## 按标记筛选会话列表

应用应在初始化 SDK 前将 `EMOptions#dataSyncType` 配置为包含 `.conversations`，登录后等待会话数据同步完成，再通过本地 `EMConversation#marks` 筛选会话。

初始化 SDK 前配置会话同步：

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}
```

通过 `syncDataFinished` 监听会话数据同步结束。`error == nil` 且 `type` 包含 `.conversations` 时，可以读取本地会话列表并筛选：

```swift
final class ConversationMarkSyncListener: NSObject, EMClientDelegate {
    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard error == nil, type.contains(.conversations) else {
            return
        }

        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []

        let targetMark = NSNumber(value: EMMarkType.markType0.rawValue)
        let markedConversations = conversations.filter { conversation in
            conversation.marks.contains(targetMark)
        }

        // 使用 markedConversations 刷新业务列表。
    }
}

let syncListener = ConversationMarkSyncListener()
EMClient.shared().add(syncListener, delegateQueue: nil)
```

如需从本地数据库加载会话并按标记筛选，也可以直接使用 `filterConversationsFromDB`：

```swift
let targetMark = NSNumber(value: EMMarkType.markType0.rawValue)

let markedConversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: false,
        filter: { conversation in
            conversation.marks.contains(targetMark)
        }
    ) ?? []
```

如需获取单个本地会话的全部标记，调用 `getConversation` 获取会话，再读取 `EMConversation#marks`：

```swift
let conversation = EMClient.shared().chatManager?.getConversation(
    "conversationId",
    type: .chat,
    createIfNotExist: false
)

let marks = conversation?.marks ?? []
```

:::tip
`getAllConversations`、`filterConversationsFromDB` 和 `getConversation` 均读取本地数据，不会主动向服务器请求最新标记。需要最新服务端状态时，应先等待会话数据同步成功。
:::

## 监听会话列表更新

本地会话列表发生变化时，SDK 通过 `conversationListDidUpdate` 返回更新后的会话数组。应用可以重新筛选带有目标标记的会话并刷新 UI。

```swift
final class ConversationMarkListListener: NSObject, EMConversationDelegate {
    func conversationListDidUpdate(
        _ conversationList: [EMConversation]
    ) {
        let targetMark = NSNumber(value: EMMarkType.markType0.rawValue)
        let markedConversations = conversationList.filter { conversation in
            conversation.marks.contains(targetMark)
        }

        // 使用 markedConversations 刷新 UI。
    }
}

let listListener = ConversationMarkListListener()
EMClient.shared().chatManager?.addConversation(delegate: listListener, queue: nil)

// 不再需要监听时移除。
EMClient.shared().chatManager?.removeConversation(delegate: listListener)
```

同一用户在其他设备添加或移除会话标记时，当前设备可通过 `multiDevicesConversationEvent` 收到 `.conversationUpdateMark` 事件，对应 Objective-C 枚举值为 `EMMultiDevicesEventConversationUpdateMark`，数值为 63。

```swift
final class ConversationMarkMultiDeviceListener:
    NSObject,
    EMMultiDevicesDelegate {

    func multiDevicesConversationEvent(
        _ event: EMMultiDevicesEvent,
        conversationId: String,
        conversationType: EMConversationType
    ) {
        guard event == .conversationUpdateMark else {
            return
        }

        // 其他设备更新了会话标记，重新读取本地会话并刷新 UI。
        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []
    }
}

let multiDeviceListener = ConversationMarkMultiDeviceListener()
EMClient.shared().addMultiDevices(
    delegate: multiDeviceListener,
    queue: nil
)

// 不再需要监听时移除。
EMClient.shared().removeMultiDevicesDelegate(multiDeviceListener)
```

## 注意事项

- 会话标记支持单聊、群聊和聊天室会话。
- Objective-C 标记值为 `EMMarkType0` 至 `EMMarkType19`，Swift 对应 `.markType0` 至 `.markType19`；具体业务含义由应用维护。
- 单个会话最多可以同时包含 20 个标记。
- `addConversationMark` 和 `removeConversationMark` 可同时操作多个会话，单次最多传入 20 个会话 ID。
- 会话 ID 数组不能为空。调用失败时，应根据 completion 中的 `EMError#code` 和 `EMError#errorDescription` 处理。
- 会话标记会同时更新服务端和本地会话数据，并同步到当前用户的其他设备。
- 会话标记不影响会话未读数、消息已读状态、消息收发或会话置顶状态。
- 应在会话数据同步完成后，通过本地接口读取并筛选会话。
- 若服务端会话列表达到数量限制，不活跃会话可能被移出服务端会话列表，对应标记也可能不再随会话列表返回。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`addConversationMark`](#添加会话标记) | `IEMChatManager` | 为一个或多个会话添加指定标记，同时更新服务端和本地。 |
| [`removeConversationMark`](#移除会话标记) | `IEMChatManager` | 从一个或多个会话中移除指定标记，同时更新服务端和本地。 |
| [`dataSyncType`](#按标记筛选会话列表) | `EMOptions` | 设置登录后自动同步的数据类型。 |
| [`initializeSDKWithOptions`](#按标记筛选会话列表) | `EMClient` | 使用指定配置初始化 iOS SDK。 |
| [`getAllConversations`](#按标记筛选会话列表) | `IEMChatManager` | 获取排序后的本地会话数组。 |
| [`filterConversationsFromDB`](#按标记筛选会话列表) | `IEMChatManager` | 从本地数据库读取并筛选会话。 |
| [`getConversation`](#按标记筛选会话列表) | `IEMChatManager` | 获取指定类型的本地会话对象。 |
| [`marks`](#按标记筛选会话列表) | `EMConversation` | 获取会话的全部标记，返回 `NSArray<NSNumber *>`，Swift 中为 `[NSNumber]`。 |
