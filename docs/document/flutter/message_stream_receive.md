# 接收流式消息

即时通讯 IM 支持在单聊和群组聊天时发送流式消息。流式消息是一种边生成、边发送、边接收的实时消息传输机制。它将长文本或复杂内容拆分为连续的数据片段，以低延迟、分批次的方式实时推送给接收方，无需等待整个内容完全生成即可开始传输。

流式消息的典型应用场景如下：

- **AI 对话**：大语言模型（LLM）生成较长回复时，可逐段输出与展示，避免用户长时间等待，确保提供更流畅的交互体验。
- **协同编辑与实时分享**：在内容尚未完全构思完成时，即可逐步分享思路或文稿。

自 **v4.19.0** 起，即时通讯 IM 支持在 **单聊和群组聊天** 中接收 **文本类型的流式消息**，不支持在 **聊天室** 中接收流式消息。

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

## 其他消息功能

流式消息支持的消息功能如下表所示：
 
| 功能             | 是否支持                          |
| :--------------- | :-------------------------------- |
| [发送消息](/document/server-side/message_single.html)         | 是（仅支持通过 RESTful API 发送） |
| [消息漫游](/document/android/message_retrieve.html#从服务器获取指定会话的消息)         | 是                                |
| [消息扩展](/document/android/message_extension.html)         | 是                                |
| [定向发送](/document/android/message_target.html)         | 否                                |
| [消息已读回执](/document/android/message_receipt.html)     | 否                                |
| 消息输入状态 | 否                                |
| [消息回复（Reaction）](/document/android/reaction.html)         | 是                                |
| [消息置顶](/document/android/message_pin.html)         | 是                                |
| [消息撤回](/document/android/message_recall.html)         | 是                                |
| [消息单向删除](/document/android/message_delete.html#单向删除服务端的历史消息)     | 是                                |
| [消息修改](/document/android/message_modify.html)         | 是                                |
| [消息搜索](/document/android/message_search.html)         | 是                                |
| [会话未读数](/document/android/conversation_unread.html)       | 是                                |
| 会话最后一条消息 | 是                                |
| [离线推送](/document/server-side/push_settings_set.html)     | 是                                |
| [内容审核](/value-added/moderation/moderation_overview.html)     | 否                                |
| [消息翻译](/value-added/translation/message_translation_android.html)         | 是                                |
| [发送前回调](/document/server-side/callback_presending.html)         | 否                               |
| [发送后回调](/document/server-side/callback_postsending.html)         | 否      |
| 消息发送成功后在发送方多客户端同步        |   否  |
| [发送方和接收方的本地数据库存储](limitation.html#消息存储)         | 是                              |

