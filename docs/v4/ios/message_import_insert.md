# 导入和插入消息

<Toc />

本文介绍环信即时通讯 IM iOS SDK 如何在本地导入和插入消息。
 
## 技术原理

环信即时通讯 IM iOS SDK 支持提供 `IEMChatManager` 和 `EMConversation` 类支持在本地导入和插入消息，其中包含如下主要方法：

- `IEMChatManager.importMessages`：批量导入消息到数据库；
- `EMConversation.insertMessage`：在本地指定会话中插入一条消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 批量导入消息到数据库

如果你需要使用批量导入方式在本地会话中插入消息，可以调用 `importMessages` 方法，构造 `Message` 对象，将消息导入本地数据库。

当前用户只能导入自己发送或接收的消息。导入后，消息按照其包含的时间戳添加到对应的会话中。

推荐一次导入 1,000 条以内的数据。

```objectivec
// 异步方法
[[EMClient sharedClient].chatManager importMessages:messages completion:nil];
```

### 插入消息

如果你需要在本地会话中加入一条消息，比如收到某些通知消息时，可以构造一条消息写入会话。

例如插入一条无需发送但有需要显示给用户看的内容，类似 “XXX 撤回一条消息”、“XXX 入群”、“对方正在输入” 等。

消息会根据消息中的 Unix 时间戳插入本地数据库，SDK 会更新会话的 `latestMessage` 等属性。

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
[conversation insertMessage:message error:nil];
```

