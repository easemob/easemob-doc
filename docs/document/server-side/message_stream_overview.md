# 流式消息介绍

## 概述

即时通讯 IM 支持在单聊和群组聊天时发送流式消息。流式消息是一种边生成、边发送、边接收的实时消息传输机制。它将长文本或复杂内容拆分为连续的数据片段，以低延迟、分批次的方式实时推送给接收方，无需等待整个内容完全生成即可开始传输。

目前，即时通讯 IM 仅在 **单聊和群组聊天** 中支持 **文本类型的流式消息**，不支持 **聊天室**。流式消息的典型应用场景如下：

- **AI 对话**：大语言模型（LLM）生成较长回复时，可逐段输出与展示，避免用户长时间等待，确保提供更流畅的交互体验。
- **协同编辑与实时分享**：在内容尚未完全构思完成时，即可逐步分享思路或文稿。

流式消息仅支持通过 [服务端 RESTful API](/document/server-side/message_stream_send_single.html) 下发，SDK 负责接收，但不提供发送能力。

## 消息发送与接收流程

![img](/images/server-side/message_stream_flowchart.png)

## 消息功能

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



