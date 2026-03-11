# 接收流式消息

自 v4.19.0 起，即时通讯 IM iOS SDK 支持接收来自服务端的文本流式消息。

流式消息仅支持通过 [服务端 RESTful API](/document/server-side/message_stream_send_single.html) 下发，SDK 负责接收，但不提供发送能力。

## 前提条件

开始前，请确保满足以下条件：
- 已升级 SDK 至 v4.19.0 或以上版本。
- 已完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。

## 技术原理

流式消息由业务服务端触发并生成，通过环信 IM 服务器下发至客户端 SDK，客户端 SDK 不提供主动发送流式消息的能力。客户端需注册监听器，以实时接收并处理下发的流式消息的分片。

![img](/images/server-side/message_stream_flowchart.png)

## 实现方法

发送和接收流式消息的流程如下：

1. 接收方注册消息监听器，监听流式消息接收事件 `onStreamMessagesReceived`。
2. 发送方调用服务端 RESTful API [发送流式消息](/document/server-side/message_stream_send_single.html)。
3. 接收方接收和获取流式消息。

### 接收流式消息分片

接收方需在 SDK 初始化时注册 `EMChatManageDelegate` 并实现 `onStreamMessagesReceived` 回调，以监听流式消息。

```Swift
        // 注册消息监听器
        EMChatClient.shared().chatManager?.add(self, delegateQueue: nil)
        // 实现流式消息接收回调
        func onStreamMessagesReceived(_ messages: [EMChatMessage]) {
            for message in messages {
                if
                    let streamChunk = message.streamChunk {
                    switch streamChunk.status {
                    case .start:
                            print("Stream started: \(streamChunk.chunk)")
                    case .progress:
                            print("Stream in progress: \(streamChunk.chunk)")
                    case .complete:
                            print("Stream completed: \(streamChunk.chunk)")
                    case .error:
                            print("Stream error: \(streamChunk.errorCode)")
                    case .startAndComplete:
                            print("Stream started and completed: \(streamChunk.chunk)")
                    @unknown default:
                            print("Unknown stream status")
                    }
                }
            }
        }   
```

### 获取消息分片信息

接收流式消息分片后，可获取分片内容及相关信息。

#### 分片信息

`EMChatMessage` 的 `streamChunk` 属性（`EMStreamChunk` 类型）封装了流式消息分片的全部信息，包括文本内容、传输状态、错误码及自定义字段等。

| 属性名 | 类型 | 说明 |
| :----- | :----------| :------| 
| `chunk` | String | 当前消息分片的文本内容。<br/>`EMTextMessageBody` 中的 `text` 为从首片至当前分片的累计合并内容。 |
| `status` | EMStreamChunkStatus  | 流式消息的传输状态。详见下表中的 `EMStreamChunkStatus` 类介绍。 |
| `errorCode` | Int | 错误码。默认值 `0` 表示正常。其他值详见 [错误码文档](error.html)。 |
| `finishReason` | Int | 完成原因代码（由业务服务器设置）。默认值 `0` 表示无异常。 |
| `customType` | String | （可选）自定义透传类型。例如，可用于区分不同展示样式的流式消息。 |

`EMStreamChunkStatus` 枚举定义如下：
- `EMStreamChunkStatusStart`：流式消息开始传输，当前分片为首片。
- `EMStreamChunkStatusStartAndComplete`：单片流式消息，传输在一个分片内完成。
- `EMStreamChunkStatusProgress`：流式消息传输中。
- `EMStreamChunkStatusComplete`：流式消息传输完成，当前分片为末片。
- `EMStreamChunkStatusError`：流式消息传输过程中发生错误。

#### 分片合并后的内容

SDK 会自动按分片顺序在本地合并内容并更新消息体。

`EMChatMessage` 的 `EMTextMessageBody` 中 `text` 字段为当前分片的累计合并内容。

#### 消息扩展信息

关于流式消息的扩展信息，仅 **首个分片** 的扩展字段 `ext` 会被持久化至数据库，后续分片中的属性将被忽略。



