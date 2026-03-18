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

1. 接收方需在 SDK 初始化时调用 `EMChatManager#addMessageListener` 注册消息监听器。
2. 在 `onStreamMessageReceived` 回调中监听流式消息。新分片到达时，SDK 会将其排序后触发此回调。

可通过 `status` 字段判断当前消息分片的传输状态，并实时更新界面以展示最新内容。

```java
EMClient.getInstance().chatManager().addMessageListener(new EMMessageListener() {
    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        // 普通消息回调 
    }

    @Override
    public void onStreamMessageReceived(List<EMMessage> messages) {
        // 流式消息分片回调
        for (EMMessage message : messages) {
            handleStreamChunk(message);
        }
    }
});
```

### 获取消息分片信息

#### 当前分片信息

通过 `EMMessage` 的 `getStreamChunk()` 获取 [`EMStreamChunk`](https://doc.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_chunk.html) 对象。该对象提供以下方法获取当前分片的信息：

| 方法 | 返回值类型 | 描述 |
| :--- | :--- | :--- |
| `getText()` | String | 当前消息分片的文本内容。<br/>`EMTextMessageBody#getMessage()` 获取从第一个分片到当前分片的累计合并内容。 |
| `getStatus()` | EMStreamStatus | 获取流式消息的传输状态。详见下表中的 `EMStreamStatus` 类介绍。 |
| `isCompleted()` | Boolean | 判断流式消息是否已传输完成。<br/> 当 `getStatus()` 返回 `COMPLETE`、`START_AND_COMPLETE` 或 `ERROR` 中的任意一种状态时，`isCompleted()` 方法返回 `true`。 |
| `getCustomType()` | String | 获取自定义透传类型。例如，用于标识文本格式的 "markdown"。 |
| `getErrorCode()` | Int | 获取错误码。默认值 `0` 表示正常。其他值详见 [错误码文档](error.html)。|
| `getFinishReason()` | Int | 获取完成原因代码（由业务服务器设置）。默认值 `0` 表示无异常。|

```java
private void handleStreamChunk(EMMessage message) {
    // 1. 获取当前分片的内容
    EMStreamChunk chunk = message.getStreamChunk();
    if (chunk != null) {
        String incrementText = chunk.getText(); 
        EMMessage.EMStreamStatus status = chunk.getStatus();
    }
}
```

`EMStreamStatus` 枚举类定义如下：

| 状态 | 描述 |
| :--- | :--- |
| `START` | 流式消息开始传输，当前分片为首片。 |
| `START_AND_COMPLETE` | 流式消息在一个分片内完成传输。此时消息仅包含一个分片，称为单片流式消息。|
| `PROGRESS` | 流式消息传输中。 |
| `COMPLETE` | 流式消息传输完成，当前分片为最后一片。 |
| `ERROR` | 流式消息传输过程中发生错误。 |

#### 合并后分片信息

SDK 会自动按分片顺序在本地合并内容并更新消息体。

`EMTextMessageBody#getMessage()` 获取从第一个分片到当前分片的累计合并内容。

```java
private void handleStreamChunk(EMMessage message) {
    // 1. 获取当前分片的内容
    EMStreamChunk chunk = message.getStreamChunk();
    // 2. 获取第一个分片到当前分片的累计合并内容
    if (message.getBody() instanceof EMTextMessageBody) {
        String currentFullText = ((EMTextMessageBody)message.getBody()).getMessage();
    }
}
```

#### 消息扩展信息

关于流式消息的扩展信息，仅 **首个分片** 的扩展字段 `ext` 会被持久化至数据库，后续分片中的属性将被忽略。

## 其他消息功能

流式消息支持的消息功能如下表所示：
 
| 功能             | 是否支持                          |
| :--------------- | :-------------------------------- |
| [发送消息](/document/server-side/message_stream_send_single.html)         | 是（仅支持通过 RESTful API 发送） |
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
| [离线推送](/document/android/push/push_overview.html)     | 是                                |
| [内容审核](/value-added/moderation/moderation_overview.html)     | 否                                |
| [消息翻译](/value-added/translation/message_translation_android.html)         | 是                                |
| [发送前回调](/document/server-side/callback_presending.html)         | 否                               |
| [发送后回调](/document/server-side/callback_postsending.html)         | 否      |
| 消息发送成功后在发送方多客户端同步        |   否  |
| [发送方和接收方的本地数据库存储](limitation.html#消息存储)         | 是                              |







