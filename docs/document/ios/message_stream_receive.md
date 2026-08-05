# 接收流式消息

## 功能说明

即时通讯 IM 支持在单聊和群组聊天中接收流式消息。流式消息是一种边生成、边发送、边接收的实时消息传输机制，适用于长文本逐段输出的场景，例如 AI 对话、实时协作写作和分段生成内容展示等。

流式消息由业务服务端生成并通过 [RESTful API](/document/server-side/message_stream_send_single.html) 发送，iOS SDK 负责接收、排序、合并和回调，不提供客户端主动发送流式消息的能力。

## 核心概念

在阅读下文前，你可以先了解以下核心概念：

- **流式消息**：将一条完整消息拆分为多个分片，并按顺序逐步发送和接收的消息传输方式。
- **消息分片**：流式消息中的单个数据片段。多个分片按顺序组合后构成一条完整消息。
- **当前分片内容**：当前回调中接收到的单个分片内容，可通过 `message.streamChunk.text` 属性获取。
- **累计合并内容**：从首个分片到当前分片为止已合并的完整内容，可通过 `EMTextMessageBody` 的 `text` 属性获取。
- **流式消息传输状态**：流式消息在传输过程中的阶段标识，例如开始、传输中、完成或异常结束，可通过 `EMStreamChunk` 的 `status` 属性获取。
- **完成原因码**：流式消息结束时的业务原因标识，可通过 `EMStreamChunk` 的 `finishReason` 属性获取。
- **消息 ID**：流式消息的唯一标识，用于标识整条流式消息。在 iOS SDK 中，可通过 `message.messageId` 获取。

## 支持范围与限制

- 会话类型：仅支持单聊和群聊，不支持聊天室。
- 消息类型：仅支持文本类型的流式消息。
- 发送方式：仅支持通过 [服务端 RESTful API](/document/server-side/message_stream_send_single.html) 发送。
- 客户端能力：iOS SDK 仅支持接收，不支持发送。
- 消息标识：`msgId` 标识整条流式消息。
- 消息限制：消息总长度、分片发送间隔、总传输时长等限制以 [服务端 API 文档](/document/server-side/message_stream_send_single.html#支持范围与限制) 为准。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 已了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。

## 技术原理

流式消息由业务服务端生成，并通过环信 IM 服务端按分片方式下发至客户端 SDK。iOS SDK 在分片到达时触发消息回调，并根据分片顺序自动合并消息内容。你可结合当前分片信息、累计合并内容和传输状态实时更新界面，直到整条消息完成或异常结束。

![img](/images/server-side/message_stream_flowchart.png)

## 接入流程与示例

### 接入流程

接收流式消息的基本流程如下：

1. 在 SDK 初始化完成后，注册消息监听器 `EMChatManagerDelegate`。
2. 监听流式消息回调 `onStreamMessagesReceived`。当新分片到达时，SDK 会在排序后触发该回调。
3. 在回调中遍历收到的 `EMChatMessage`，通过 `msgId` 定位同一条流式消息；在 iOS SDK 中，对应字段为 `message.messageId`。
4. 通过 `message.streamChunk` 获取当前分片信息。
5. 通过 `EMTextMessageBody` 的 `text` 属性获取从首个分片到当前分片的累计合并内容。
6. 根据 `status` 更新界面展示，并在消息完成或异常结束时结束该条流式消息的渲染。

### 示例代码

以下示例展示了如何注册消息监听器并接收流式消息分片。

```swift
final class ChatViewController: UIViewController, EMChatManagerDelegate {

    override func viewDidLoad() {
        super.viewDidLoad()
        EMClient.shared().chatManager?.add(self, delegateQueue: nil)
    }

    func onStreamMessagesReceived(_ messages: [EMChatMessage]) {
        for message in messages {
            handleStreamChunk(message)
        }
    }
}
```

在接收到流式消息分片后，你可以进一步获取当前分片内容、传输状态、累计合并内容、自定义类型、错误码和完成原因等信息，并根据 `message.messageId` 更新同一条消息的展示内容。

```swift
private func handleStreamChunk(_ message: EMChatMessage) {
    let msgId = message.messageId

    guard let chunk = message.streamChunk else {
        return
    }

    // 当前分片内容
    let incrementText = chunk.text

    // 当前传输状态
    let status = chunk.status

    // 累计合并内容
    var fullText = ""
    if let body = message.body as? EMTextMessageBody {
        fullText = body.text
    }

    // 自定义类型，例如 text / markdown
    let customType = chunk.customType

    // 错误码与完成原因
    let errorCode = chunk.errorCode
    let finishReason = chunk.finishReason
    // 建议业务侧按 msgId 更新同一条消息的展示内容
}
```

## 消息内容与处理

接收到流式消息后，你可以从当前分片信息、累计合并内容、扩展字段以及传输状态四个方面处理消息。

### 当前分片信息

通过 `EMChatMessage` 的 `streamChunk` 属性获取 `EMStreamChunk` 对象。该对象表示当前收到的分片信息。

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `text` | String | 获取当前分片的文本内容。 |
| `status` | EMStreamChunkStatus | 获取当前分片对应的流式消息传输状态。 |
| `customType` | String | 获取自定义透传类型，例如，用于标识文本格式的 `"markdown"`。 |
| `errorCode` | Int | 获取错误码。默认值 `0` 表示正常。其他值详见 [错误码文档](error.html)。 |
| `finishReason` | Int | 获取完成原因码。默认值 `0` 表示无异常。 |

:::tip
- `text` 获取的是当前分片的内容。
- `EMTextMessageBody.text` 获取的是从首个分片到当前分片的累计合并内容。
- 建议界面展示优先使用累计合并内容。如需实现动画效果，可结合当前分片内容进行展示。
:::

```swift
private func handleStreamChunk(_ message: EMChatMessage) {
    if let chunk = message.streamChunk {
        let incrementText = chunk.text
        let status = chunk.status
    }
}
```

### 累计合并内容

SDK 会自动按分片顺序在本地合并流式消息内容，并写入消息体。

`EMTextMessageBody.text` 用于获取从首个分片到当前分片的累计合并内容。

```swift
private func handleStreamChunk(_ message: EMChatMessage) {
    let chunk = message.streamChunk

    if let body = message.body as? EMTextMessageBody {
        let currentFullText = body.text
    }
}
```

:::tip
UI 使用建议如下：
- UI 最终展示建议使用累计合并内容。
- 若需要逐字或逐段动画，可同时结合当前分片内容和累计合并内容进行展示。
:::

### 扩展字段

流式消息支持 `ext` 扩展字段，但仅首个分片中的 `ext` 会作为最终持久化结果保存到本地数据库。后续分片中的扩展字段不应作为最终消息扩展信息依赖。

:::tip
`ext` 使用建议如下：
- 与整条消息强相关的扩展信息放在首个分片中传递。
- 不要依赖后续分片动态修改 `ext` 来驱动最终业务逻辑。
:::

### 传输状态与错误处理

你可以通过 `EMStreamChunk` 的 `status` 属性获取当前分片对应的流式消息传输状态。

`EMStreamChunkStatus` 枚举说明如下：

| 状态 | 说明 | 建议处理 |
| :--- | :--- | :--- |
| `start` | 首个分片到达，流式消息开始传输。 | 创建或定位对应消息项，初始化消息展示，并将该消息标记为“生成中”状态。 |
| `startAndComplete` | 流式消息在单个分片内完成传输，此时消息仅包含一个分片。 | 直接按完整消息展示内容，并结束流式渲染流程。 |
| `progress` | 流式消息传输中。 | 使用累计合并内容持续刷新消息展示，并保持消息处于“生成中”状态。 |
| `complete` | 最后一个分片到达，流式消息传输完成。 | 展示最终合并内容，结束“生成中”状态，并按普通消息完成态处理。 |
| `error` | 流式消息传输异常结束。 | 保留当前已接收的内容，结束流式渲染，并结合 `errorCode` 和 `finishReason` 展示异常结束状态或错误提示。<br>- `errorCode == 0`：表示 SDK 侧无异常。<br>- `errorCode != 0`：表示本次流式消息以异常状态结束，建议记录日志并提示用户“内容生成中断”。<br>- `finishReason`：建议由服务端定义业务语义，例如正常完成、主动停止、超时中止或模型异常等，并在客户端统一映射为对应的展示文案。 |

建议界面渲染优先使用累计合并内容，以确保用户始终看到当前最新的完整文本。对于异常结束的流式消息，建议保留已生成的内容，并结合业务需求展示“已中断”、“生成失败”或“已停止”等状态提示。

## 消息功能支持

| 功能 | 是否支持 | 基本说明 |
| :--- | :--- | :--- |
| [发送消息](/document/server-side/message_stream_send_single.html) | 支持 | 通过服务端接口发送流式消息。 |
| [接收消息](message_stream_receive.html) | 支持 | 客户端接收通过服务端接口发送的流式消息。 |
| [消息漫游](/document/ios/message_retrieve.html#从服务器获取指定会话的消息) | 支持 | 从服务端获取历史消息。 |
| [消息扩展](/document/ios/message_extension.html) | 支持 | 为消息携带自定义扩展字段。 |
| [定向发送](/document/ios/message_target.html) | 不支持 | 仅向群组中的指定成员投递消息。 |
| [消息已读回执](/document/ios/message_receipt.html) | 不支持 | 接收方回传已读状态。 |
| [消息输入状态](typing_indication.html) | 不支持 | 通知对方“正在输入”状态。 |
| [消息表情回复（Reaction）](/document/ios/reaction.html) | 支持 | 对消息添加回复表情。 |
| [消息置顶](/document/ios/message_pin.html) | 支持 | 将消息置顶到会话中。 |
| [消息撤回](/document/ios/message_recall.html) | 支持 | 撤回已发送消息。 |
| [消息单向删除](/document/ios/message_delete.html#单向删除服务端的历史消息) | 支持 | 仅删除当前用户侧的消息记录。 |
| [消息编辑](/document/ios/message_modify.html) | 支持 | 编辑已发送消息内容。 |
| [消息搜索](/document/ios/message_search_local.html) | 支持 | 在本地或会话中搜索消息。 |
| [会话未读数](/document/ios/conversation_unread.html) | 支持 | 将消息计入会话未读数。 |
| 会话最后一条消息 | 支持 | 作为会话最后一条消息展示。 |
| [离线推送](/document/ios/push/push_overview.html) | 支持 | 用户离线时进行消息推送提醒。 |
| [内容审核](/value-added/moderation/moderation_overview.html) | 不支持 | 对消息内容进行审核拦截。 |
| [消息翻译](/value-added/translation/message_translation_ios.html) | 支持 | 对消息内容进行翻译。 |
| [发送前回调](/document/server-side/callback_presending.html) | 不支持 | 消息发送前触发服务端回调，可用于在消息发送前由应用服务器执行预处理逻辑。 |
| [发送后回调](/document/server-side/callback_postsending.html) | 不支持 | 消息发送后触发服务端回调，可用于 app 后台实现必要的数据同步。 |
| 消息发送成功后在发送方多客户端同步 | 不支持 | 消息发送成功后同步到发送方其他设备。 |
| [发送方和接收方的本地数据库存储](/product/limitation.html#消息存储) | 支持 | 在发送方和接收方本地数据库中存储消息。 |

## 常见问题

#### 1. SDK 能否主动发送流式消息？

不支持。流式消息 [仅支持通过服务端 RESTful API 发送](/document/server-side/message_stream_send_single.html)，iOS SDK 只负责接收。

#### 2. `text` 和消息体文本有何区别？

- `EMStreamChunk.text`：当前分片内容。
- `EMTextMessageBody.text`：从首个分片到当前分片的累计合并内容。

通常 UI 展示应以 `text` 为准。

#### 3. 如何判断消息结束？

可通过以下任一方式判断：

- `status` 为 `complete`
- `status` 为 `startAndComplete`
- `status` 为 `error`

#### 4. 为什么后续分片 `ext` 不生效？

因为最终持久化仅以首个分片中的 `ext` 为准。后续分片不应用于更新最终消息扩展字段。

#### 5. 是否需自行合并分片？

SDK 会自动合并内容，但业务侧仍建议按 `msgId` 更新同一条消息的 UI。在 iOS SDK 中，可使用 `message.messageId` 作为对应标识，避免将同一条流式消息误显示为多条消息。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`streamChunk`](#核心概念) | `EMChatMessage` | 获取当前消息分片 |
| [`status`](#核心概念) | `EMStreamChunk` | 获取流式消息状态与内容 |
