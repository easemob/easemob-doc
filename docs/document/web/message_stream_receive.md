# 接收流式消息

## 功能说明

即时通讯 IM 支持在单聊和群组聊天中接收流式消息。流式消息是一种边生成、边发送、边接收的实时消息传输机制，适用于长文本逐段输出的场景，例如 AI 对话、实时协作写作和分段生成内容展示等。

流式消息由业务服务端生成并通过 [RESTful API](/document/server-side/message_stream_send_single.html) 发送，Web SDK 负责接收、排序、合并和回调，不提供客户端主动发送流式消息的能力。

## 核心概念

在阅读下文前，你可以先了解以下核心概念：

- **流式消息**：将一条完整消息拆分为多个分片，并按顺序逐步发送和接收的消息传输方式。
- **消息分片**：流式消息中的单个数据片段。多个分片按顺序组合后构成一条完整消息。
- **当前分片内容**：当前回调中收到的单个分片内容，可通过 `message.stream.deltaText` 获取。
- **累计合并内容**：从首个分片到当前分片为止已合并的完整内容，可通过 `message.stream.fullText` 获取；在当前 SDK 的回调消息体中，也可通过 `message.body.content` 获取相同内容。
- **流式消息传输状态**：流式消息在传输过程中的阶段标识，例如开始、传输中、完成或异常结束，可通过 `message.stream.status` 获取。
- **完成原因码**：流式消息结束时的业务原因标识，可通过 `message.stream.finishReason` 获取。
- **消息 ID**：流式消息的唯一标识。在 Web SDK 中，建议优先使用 `message.msgServerId` 标识整条流式消息；如业务侧需要本地兜底，也可结合 `message.msgLocalId` 使用。

## 支持范围与限制

- 会话类型：仅支持单聊和群聊，不支持聊天室。
- 消息类型：仅支持文本类型的流式消息。
- 发送方式：仅支持通过 [服务端 RESTful API](/document/server-side/message_stream_send_single.html) 发送。
- 客户端能力：Web SDK 仅支持接收，不支持发送。
- 消息标识：`message.msgServerId` 标识整条流式消息。
- 消息限制：消息总长度、分片发送间隔、总传输时长等限制以 [服务端 API 文档](/document/server-side/message_stream_send_single.html#支持范围与限制) 为准。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 初始化 SDK 时已注册 `ChatManager`，能够通过 `client.chatManager.addEventHandler` 监听流式消息事件。
- 已了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。

## 技术原理

流式消息由业务服务端生成，并通过环信 IM 服务端按分片方式下发至客户端 SDK。Web SDK 在分片到达时触发 `onStreamMessage` 回调，并根据分片顺序自动合并消息内容。你可结合当前分片信息、累计合并内容和传输状态实时更新界面，直到整条消息完成或异常结束。

![img](/images/server-side/message_stream_flowchart.png)

## 接入流程与示例

### 接入流程

接收流式消息的基本流程如下：

1. 在 SDK 初始化完成后，调用 `client.chatManager.addEventHandler` 注册消息监听器。
2. 监听流式消息回调 `onStreamMessage`。当新分片到达时，SDK 会按分片序号顺序处理后触发该回调。乱序分片会暂存等待，重复分片以及已完成消息的后续分片会被忽略。
3. 在回调中通过 `message.msgServerId` 定位同一条流式消息。
4. 通过 `message.stream` 获取当前分片信息。
5. 在 `onStreamMessage` 回调中，通过 `message.stream.fullText` 或 `message.body.content` 获取从首个已派发分片到当前分片的累计合并内容。
6. 根据 `message.stream.status` 更新界面展示，并在消息完成或异常结束时结束该条流式消息的渲染。

### 示例代码

以下示例展示了如何注册消息监听器并接收流式消息分片。

```typescript
client.chatManager.addEventHandler('stream-message', {
  onStreamMessage: message => {
    // 建议优先使用服务端消息 ID 作为同一条流式消息的更新键。
    const messageId = message.msgServerId || message.msgLocalId;

    setMessageList(prevMessageList => {
      const msgIndex = prevMessageList.findIndex(
        item => (item.msgServerId || item.msgLocalId) === messageId
      );

      if (msgIndex !== -1) {
        const newMsgList = [...prevMessageList];
        newMsgList[msgIndex] = {
          ...newMsgList[msgIndex],
          // 使用 SDK 已合并的累计全文更新展示内容。
          body: message.body,
          // 保留最新的流式元信息。
          stream: message.stream,
        };
        return newMsgList;
      }

      return [...prevMessageList, message];
    });
  },
});
```

在接收到流式消息分片后，你可以进一步获取当前分片内容、传输状态、累计合并内容、自定义类型、错误码和可选的完成原因等信息，并根据消息 ID 更新同一条消息的展示内容。

```typescript
function handleStreamChunk(message: {
  // 服务端消息 ID。建议优先用作同一条流式消息的唯一标识。
  msgServerId: string;
  // 本地消息 ID。可在服务端消息 ID 不可用时作为兜底标识。
  msgLocalId: string;
  body: {
    // 当前消息体中的文本内容。在流式消息场景下，通常为当前累计合并内容。
    content: string;
  };
  stream: {
    // 当前分片的增量文本内容。
    deltaText: string;
    // 从首个分片到当前分片的累计完整文本。
    fullText: string;
    // 当前流式消息的传输状态。
    status: string;
    // 自定义流类型，例如 `text`、`markdown`。
    customType?: string;
    // 错误码。`0` 表示无错误，其他值表示异常结束。
    errorType: number;
    // 完成原因码，由服务端按业务语义定义。
    finishReason?: number;
  };
}) {
  const messageId = message.msgServerId || message.msgLocalId;
  const stream = message.stream;

  // 当前分片内容
  const incrementText = stream.deltaText;

  // 当前传输状态
  const status = stream.status;

  // 累计合并内容
  const fullText = stream.fullText || message.body.content || '';

  // 自定义类型，例如 text / markdown
  const customType = stream.customType;

  // 错误码与完成原因
  const errorType = stream.errorType;
  const finishReason = stream.finishReason;

  // 建议业务侧按 messageId 更新同一条消息的展示内容
}
```

## 消息内容与处理

接收到流式消息后，你可以从当前分片信息、累计合并内容、扩展字段以及传输状态四个方面处理消息。

### 当前分片信息

通过 `message.stream` 获取当前收到的分片信息。

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `deltaText` | String | 当前分片的增量文本内容。 |
| `status` | StreamMessageStatus | 当前分片对应的流式消息传输状态。 |
| `customType` | String | 业务自定义流类型，例如用于标识文本格式的 `"markdown"`。 |
| `errorType` | Number | 错误码。默认值 `0` 表示无错误；非 `0` 表示该流式消息以错误态结束。 |
| `finishReason` | Number | 可选。完成原因码，由服务端按业务语义定义。 |
| `seq` | Number | 当前分片序号。 |
| `fullText` | String | 当前分片对应的累计完整文本。 |

```typescript
function handleStreamChunk(message: {
  stream: {
    deltaText: string;
    status: string;
  };
}) {
  const stream = message.stream;
  const incrementText = stream.deltaText;
  const status = stream.status;
}
```

:::tip
- `message.stream.deltaText` 获取的是当前分片的增量文本。
- `message.stream.fullText` 获取的是从首个分片到当前分片的累计完整文本。
- `message.body.content` 也会同步更新为当前累计完整文本。
- 建议界面展示优先使用累计合并内容；如需实现打字机效果，可结合当前分片内容进行展示。
:::

### 累计合并内容

SDK 会自动按分片顺序在本地合并流式消息内容，并更新回调消息体。

`message.stream.fullText` 用于获取从首个分片到当前分片的累计合并内容；`message.body.content` 在当前 SDK 中也会同步反映该累计结果。

```typescript
function handleStreamChunk(message: {
  body: { content: string };
  stream: { fullText: string };
}) {
  const currentFullText = message.stream.fullText || message.body.content || '';
}
```

:::tip
UI 使用建议如下：
- UI 最终展示建议使用累计合并内容。
- 若需要逐字或逐段动画，可同时结合当前分片内容和累计合并内容进行展示。
:::

### 扩展字段

流式消息支持 `ext` 扩展字段。SDK 会在每次 `onStreamMessage` 回调中透出当前分片对应的 `ext`；如需在业务侧保存整条流式消息的扩展信息，建议将与整条消息强相关的扩展信息放在首个分片中，并由业务侧按消息 ID 自行维护。

:::tip
- 与整条消息强相关的扩展信息，建议放在首个分片中传递。
- 不要依赖后续分片动态修改 `ext` 来驱动整条消息的最终业务状态；
:::

### 传输状态与错误处理

你可以通过 `message.stream.status` 获取当前分片对应的流式消息传输状态。

`StreamMessageStatus` 枚举说明如下：

| 状态 | 说明 | 建议处理 |
| :--- | :--- | :--- |
| `STREAM_START` | 首个分片到达，流式消息开始传输。 | 创建或定位对应消息项，初始化消息展示，并将该消息标记为“生成中”状态。 |
| `STREAM_IN_PROGRESS` | 流式消息传输中。 | 使用累计合并内容持续刷新消息展示，并保持消息处于“生成中”状态。 |
| `STREAM_COMPLETED` | 最后一个分片到达，流式消息正常完成。 | 展示最终合并内容，结束“生成中”状态，并按普通完成态处理。 |
| `STREAM_FULL` | 流式消息在单个分片内完成，或在缺片场景下由携带完整文本的兜底末片完成。 | 直接按完整消息展示内容，并结束流式渲染流程。 |
| `STREAM_ERROR` | 流式消息以错误态结束。 | 保留当前已接收内容，结束流式渲染，并结合 `errorType` 和 `finishReason` 展示异常结束状态或错误提示。 |

建议界面渲染优先使用累计合并内容，以确保用户始终看到当前最新的完整文本。对于异常结束的流式消息，建议保留已生成的内容，并结合业务需求展示“已中断”、“生成失败”或“已停止”等状态提示。

其中：

- `errorType === 0` 表示本次回调未携带错误状态。
- `errorType > 0` 表示该流式消息以异常状态结束，建议记录日志并提示用户“内容生成中断”。
- `finishReason` 建议由服务端定义业务语义，例如正常完成、主动停止、超时中止或模型异常等，并在客户端统一映射为对应的展示文案。

## 消息功能支持

流式消息支持的消息功能如下表所示：

| 功能 | 是否支持 | 基本说明 |
| :--- | :--- | :--- |
| [发送消息](/document/server-side/message_stream_send_single.html) | 支持 | 通过服务端接口发送流式消息。 |
| [接收消息](message_stream_receive.html) | 支持 | 客户端接收通过服务端接口发送的流式消息。 |
| [消息漫游](message_retrieve.html#从服务器获取指定会话的消息) | 支持 | 从服务端获取历史消息。 |
| [消息扩展](message_extension.html) | 支持 | 为消息携带自定义扩展字段。 | 
| [定向发送](message_target.html) | 不支持 | 仅向群组中的指定成员投递消息。 |
| [消息已读回执](message_receipt.html) | 不支持 | 接收方回传已读状态。 |
| [消息输入状态](typing_indication.html) | 不支持 | 通知对方“正在输入”状态。 |
| [消息回复（Reaction）](reaction.html) | 支持 | 对消息添加回复表情。 |
| [消息置顶](message_pin.html) | 支持 | 将消息置顶到会话中。 |
| [消息撤回](message_recall.html) | 支持 | 撤回已发送消息。 |
| [消息单向删除](message_delete.html#单向删除服务端的历史消息) | 支持 | 仅删除当前用户侧的消息记录。 |
| [消息编辑](message_modify.html) | 支持 | 编辑已发送消息内容。 |
| [消息搜索](message_search.html) | 不支持 | 在本地或会话中搜索消息。 |
| [会话未读数](conversation_unread.html) | 支持 | 将消息计入会话未读数。 |
| 会话最后一条消息 | 支持 | 作为会话最后一条消息展示。 | 
| [离线推送](/document/web/push/push_overview.html) | 不支持 | 用户离线时进行消息推送提醒。Web 端本身不支持离线推送，只支持对移动端离线推送进行配置。 |
| [内容审核](/value-added/moderation/moderation_overview.html) | 不支持 | 对消息内容进行审核拦截。 |
| [消息翻译](/value-added/translation/message_translation_web.html) | 支持 | 对消息内容进行翻译。 | 
| [发送前回调](/document/server-side/callback_presending.html) | 不支持 | 消息发送前触发服务端回调，可用于在消息发送前由应用服务器执行预处理逻辑。 |
| [发送后回调](/document/server-side/callback_postsending.html) | 不支持 | 消息发送后触发服务端回调，可用于 app 后台实现必要的数据同步。 |
| 消息发送成功后在发送方多客户端同步 | 不支持 | 消息发送成功后同步到发送方其他设备。 |

## 常见问题

#### 1. SDK 能否主动发送流式消息？

不支持。流式消息 [仅支持通过服务端 RESTful API 发送](/document/server-side/message_stream_send_single.html)，Web SDK 只负责接收。

#### 2. `message.stream.deltaText` 和 `message.stream.fullText` 有何区别？

- `message.stream.deltaText`：当前分片内容。
- `message.stream.fullText`：从首个分片到当前分片的累计完整文本。

通常 UI 展示应以 `message.stream.fullText` 或 `message.body.content` 为准。

#### 3. 如何判断消息结束？

可通过 `message.stream.status` 判断，结束态包括：

- `STREAM_COMPLETED`
- `STREAM_FULL`
- `STREAM_ERROR`

#### 4. 为什么后续分片 `ext` 不生效？

因为最终持久化仅以首个分片中的 `ext` 为准。后续分片不应用于更新最终消息扩展字段。

#### 5. 是否需自行合并分片？

不需要。SDK 会自动合并内容，但业务侧仍建议按 `message.msgServerId` 更新同一条消息的 UI，避免将同一条流式消息误显示为多条消息。
