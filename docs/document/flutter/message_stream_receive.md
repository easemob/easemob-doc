# 接收流式消息

自 v4.19.0 起，即时通讯 IM Flutter SDK 支持接收来自服务端的文本流式消息。

流式消息仅支持通过 [服务端 RESTful API](/document/server-side/message_stream.html) 下发，SDK 负责接收，但不提供发送能力。

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
2. 发送方调用服务端 RESTful API [发送流式消息](/document/server-side/message_stream_single.html)。
3. 接收方接收和获取流式消息。
  
### 接收流式消息分片

接收方需在 SDK 初始化时注册 `ChatEventHandler` 并添加 `onStreamMessagesReceived` 回调。

```dart
void _addChatListener() {
  ChatClient.getInstance.chatManager.addEventHandler(
    'UNIQUE_HANDLER_ID',
    ChatEventHandler(
      // 普通消息接收
      onMessagesReceived: (messages) {
        // 处理普通消息
      },
      
      // 流式消息接收
      onStreamMessagesReceived: (messages) {
        for (var msg in messages) {
          print("Received stream message from: ${msg.from}");
          
          // 检查是否包含 StreamChunk
          if (msg.streamChunk != null) {
            StreamChunk chunk = msg.streamChunk!;
            
            // 访问 StreamChunk 属性
            print("Status: ${chunk.status}");
            // chunk 是消息增量; 
            print("Chunk text: ${chunk.chunk}");
            print("Error code: ${chunk.errorCode}");
          }

          // 访问消息的 attributes（扩展属性）
          if (msg.attributes != null && msg.attributes!.isNotEmpty) {
            print("Message attributes:");
            // 遍历所有属性
            msg.attributes!.forEach((key, value) {
              print("  $key: $value");
            });
            
            // 访问特定的属性
            if (msg.attributes!.containsKey('customKey')) {
              var customValue = msg.attributes!['customKey'];
              print("Custom attribute value: $customValue");
            }
          }

          if (msg.body.type == MessageType.TXT) {
           // ChatTextMessageBody中的 content 则是从第一个分片到当前分片的合并内容
            ChatTextMessageBody body = msg.body as ChatTextMessageBody;
            print("Message body content: ${body.content}");
          }
        }
      },
      
      // 其他回调...
    ),
  );
}
```

### 获取消息分片信息

#### 分片信息

`EMChatMessage` 的 `streamChunk` 属性（`StreamChunk` 类型）封装了流式消息分片的全部信息，包括文本内容、传输状态、错误码及自定义字段等。

| 属性名 | 类型 | 说明 |
| :----- | :----------| :------| 
| `chunk` | String | 当前消息分片的文本内容。<br/>`ChatTextMessageBody` 中的 `content` 则是从首片到当前分片的累计合并内容。 |
| `status` | StreamStatus | 流式消息的传输状态，详见下表中的 `StreamStatus` 类介绍。 |
| `errorCode` | Int | 错误码。默认值 `0` 表示正常。其他值详见 [错误码文档](error.html)。 |
| `finishReason` | Int | 完成原因代码（由业务服务器设置）。默认值 `0` 表示无异常。 |
| `customType` | String? | （可选）自定义透传类型。例如，用于标识文本格式的 "markdown"。 |

`StreamStatus` 枚举定义如下：

| 状态 | 描述 |
|--------|------|
| `START`  | 流式消息开始传输，当前分片为首片。  |
| `START_AND_COMPLETE`  | 流式传输可在一个分片内完成传输。此时消息仅包含一个分片，称为单片流式消息。 |
| `PROGRESS` | 流式消息传输中。 |
| `COMPLETE`  | 流式消息传输完成，当前分片为最后一片。  |
| `ERROR` | 流式消息传输过程中发生错误。 |

#### 分片合并后的内容

SDK 会自动按分片顺序在本地合并内容并更新消息体。

`ChatTextMessageBody` 中的 `content` 为是从首片到当前分片的累计合并内容。

#### 消息扩展信息

关于流式消息的扩展信息，仅 **首个分片** 的扩展字段 `attributes` 会被持久化至数据库，后续分片中的属性将被忽略。


