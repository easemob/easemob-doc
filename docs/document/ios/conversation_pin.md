# 会话置顶

## 功能说明

会话置顶用于将重要的单聊、群聊或聊天室会话固定在会话列表靠前位置，方便用户快速找到高频或重点会话。置顶状态会保存到服务端，并同步到当前用户的其他设备和本地会话数据。

## 功能开通

会话置顶属于服务端会话列表功能的一部分。使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已开通[服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 设置或取消置顶会话

调用 `pinConversation` 设置或取消会话置顶。置顶状态会存储在服务器上，状态变更会同时更新服务端和本地。`isPinned` 为 `true` 时置顶，为 `false` 时取消置顶。操作结果通过 completion 中的 `EMError?` 返回，`error == nil` 表示成功。

多设备登录时，当前用户在一台设备上设置或取消置顶后，其他在线设备会通过 `multiDevicesConversationEvent` 收到相应事件。

你最多可以置顶 50 个会话。

```swift
let conversationId = "conversationId"
let isPinned = true

EMClient.shared().chatManager?.pinConversation(
    conversationId,
    isPinned: isPinned
) { error in
    if let error {
        print("设置会话置顶状态失败：\(error.errorDescription)")
    } else {
        print(isPinned ? "会话置顶成功" : "取消会话置顶成功")
    }
}
```

参数说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `conversationId` | String | 会话 ID。<br/> - 单聊：对端用户 ID。<br/> - 群聊：群组 ID。<br/> - 聊天室：聊天室 ID。 |
| `isPinned` | Boolean | 是否置顶。<br/> - `true`：置顶。<br/> - `false`：取消置顶。 |
| `completionBlock` | `(EMError?) -> Void` | 异步操作结果。`error == nil` 表示成功，否则可通过 `EMError#code` 和 `EMError#errorDescription` 处理失败。 |

`pinConversation` 不直接返回更新后的会话对象。调用成功后，可以重新读取本地会话并检查置顶状态：

```swift
let conversation = EMClient.shared().chatManager?.getConversation(
    conversationId,
    type: .chat,
    createIfNotExist: false
)

if let conversation {
    let pinned = conversation.isPinned
    // 会话的置顶时间，单位为毫秒；未置顶时值为 `0`。
    let pinnedTime = conversation.pinnedTime
}
```

## 获取置顶会话列表

置顶状态会随会话数据在登录后自动同步并写入本地，应用应在同步完成后读取本地会话列表。

初始化 SDK 前，将 `EMOptions#dataSyncType` 配置为包含 `.conversations`：

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}
```

通过 `syncDataFinished` 监听会话数据同步结束。`error == nil` 且 `type` 包含 `.conversations` 时，可以读取本地排序后的会话列表并筛选置顶会话：

```swift
final class PinnedConversationSyncListener: NSObject, EMClientDelegate {
    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard error == nil, type.contains(.conversations) else {
            return
        }

        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []

        let pinnedConversations = conversations.filter { conversation in
            conversation.isPinned
        }

        // 使用 pinnedConversations 刷新置顶会话列表。
    }
}

let syncListener = PinnedConversationSyncListener()
EMClient.shared().add(syncListener, delegateQueue: nil)

// 不再需要监听时移除。
EMClient.shared().removeDelegate(syncListener)
```

`EMConversation` 中与会话置顶相关的属性如下：

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `conversationId` | String | 会话 ID。 |
| `type` | `EMConversationType` | 会话类型，取值为 `.chat`、`.groupChat` 或 `.chatRoom`。 |
| `isPinned` | Boolean | 会话是否置顶。 |
| `pinnedTime` | Int64 | 会话置顶的 UNIX 时间戳，单位为毫秒；未置顶时为 `0`。 |

:::tip
如果需要从本地数据库加载空会话，应在初始化 SDK 前将 `EMOptions#loadEmptyConversations` 设置为 `true`。该属性默认值为 `false`，不加载空会话。
:::

## 监听本地会话列表更新

本地会话列表发生变化时，SDK 通过 `conversationListDidUpdate` 返回更新后的会话数组。应用可以使用回调数组刷新界面，或重新读取置顶优先的排序列表。

```swift
final class PinnedConversationListListener:
    NSObject,
    EMConversationDelegate {

    func conversationListDidUpdate(
        _ conversationList: [EMConversation]
    ) {
        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []

        // 使用最新的 conversations 刷新界面。
    }
}

let listListener = PinnedConversationListListener()
// `delegateQueue` 传 `nil` 时，当前实现将回调分发到主队列；传入自定义队列时，应切换到主线程后再更新 UI。
EMClient.shared().chatManager?.addConversation(delegate: listListener, queue: nil)

// 不再需要监听时移除。
EMClient.shared().chatManager?.removeConversation(delegate: listListener)
```

## 监听多设备会话置顶事件

同一用户在其他设备设置或取消会话置顶时，当前设备通过 `multiDevicesConversationEvent` 接收多设备会话事件：

| Swift 事件  | 说明 |
| :--- | :--- | 
| `.conversationPinned` | 当前用户在其他设备置顶会话。 |
| `.conversationUnpinned` | 当前用户在其他设备取消会话置顶。 |

```swift
final class PinnedConversationMultiDeviceListener:
    NSObject,
    EMMultiDevicesDelegate {

    func multiDevicesConversationEvent(
        _ event: EMMultiDevicesEvent,
        conversationId: String,
        conversationType: EMConversationType
    ) {
        guard event == .conversationPinned ||
                event == .conversationUnpinned else {
            return
        }

        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []

        // 使用最新的 conversations 刷新界面。
    }
}

let multiDeviceListener = PinnedConversationMultiDeviceListener()
EMClient.shared().addMultiDevices(
    delegate: multiDeviceListener,
    queue: nil
)

// 不再需要监听时移除。
EMClient.shared().removeMultiDevicesDelegate(multiDeviceListener)
```

:::tip
多设备事件通知当前用户的其他在线设备。当前设备发起置顶操作后，应以 `pinConversation` 的 completion 作为操作结果，并按需重新读取本地会话列表。
:::

## 排序与展示建议

调用 `getAllConversations` 并将 `isSort` 传 `true` 时，SDK 返回的会话顺序如下：

- 置顶会话位于非置顶会话之前。
- 置顶和非置顶会话内部均按最后一条消息的时间戳倒序排列。

展示会话列表时，建议直接使用 SDK 返回的顺序。如果业务需要按最近置顶时间排列多个置顶会话，可以通过 `EMConversation#pinnedTime` 进行倒序排序，使最近置顶的会话更靠前。

```swift
// 获取本地会话列表。
// 传入 true：按最后一条消息时间戳倒序排列，且置顶会话位于前方。
let conversations = EMClient.shared().chatManager?
    .getAllConversations(true) ?? []

// 将置顶和非置顶会话分开。
// `isPinned` 用于判断会话是否置顶。
let pinnedConversations = conversations.filter { $0.isPinned }
let unpinnedConversations = conversations.filter { !$0.isPinned }

// 置顶会话按置顶时间倒序排列，使最近置顶的会话更靠前。
// pinnedTime 表示会话被置顶时的 Unix 时间戳，单位为毫秒，未置顶会话的值为 0。
let sortedPinnedConversations = pinnedConversations.sorted {
    $0.pinnedTime > $1.pinnedTime
}

// 合并列表，置顶会话保持在非置顶会话之前。
// 非置顶会话保留 SDK 返回的顺序。
let sortedConversations =
    sortedPinnedConversations + unpinnedConversations
```

## 注意事项

- 会话置顶支持单聊、群聊和聊天室会话。
- `conversationId` 不能为空；调用失败时，应根据 completion 中的 `EMError#code` 和 `EMError#errorDescription` 处理。
- 最多可以置顶 50 个会话。
- 会话置顶状态保存在服务端，并同步到当前用户的其他设备和本地会话数据。
- 应在会话数据同步完成后，通过本地接口读取并筛选置顶会话。
- 会话置顶不影响消息收发、会话未读数、消息已读状态或会话标记。
- 本地数据库默认不加载空会话；如需包含，应在初始化前设置 `EMOptions#loadEmptyConversations = true`。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`pinConversation`](#设置或取消置顶会话) | `IEMChatManager` | 设置或取消指定会话的置顶状态。 |
| [`getConversation`](#设置或取消置顶会话) | `IEMChatManager` | 获取指定类型的本地会话对象。 |
| [`pinnedTime`](#设置或取消置顶会话) | `EMConversation` | 获取会话置顶时间戳。 |
| [`dataSyncType`](#获取置顶会话列表) | `EMOptions` | 设置登录后自动同步的数据类型。 |
| [`initializeSDKWithOptions`](#获取置顶会话列表) | `EMClient` | 使用指定配置初始化 iOS SDK。 |
| [`getAllConversations`](#获取置顶会话列表) | `IEMChatManager` | 获取本地会话数组，并按参数决定是否排序。 |
| [`loadEmptyConversations`](#获取置顶会话列表) | `EMOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
