# 导入和插入消息

<Toc />

本文介绍环信即时通讯 IM SDK 如何在本地导入和插入消息。

## 技术原理

环信即时通讯 IM SDK 支持提供 `IChatManager` 和 `Conversation` 类支持在本地导入和插入消息，其中包含如下主要方法：

- `IChatManager.ImportMessages` 批量导入消息到数据库。
- `Conversation.InsertMessage` 在指定会话中插入消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 批量导入消息到数据库

如果你需要使用批量导入方式在本地会话中插入消息，可以调用 `ImportMessages` 方法，构造 `EMMessage` 对象，将消息导入本地数据库。

当前用户只能导入自己发送或接收的消息。导入后，消息按照其包含的时间戳添加到对应的会话中。

推荐一次导入 1,000 条以内的数据。

示例代码如下：

```csharp
SDKClient.Instance.ChatManager.ImportMessages(messages, new CallBack(
   onSuccess: () => {
   },
   onError: (code, desc) =>
   {
   }
));
```

### 插入消息

如果你想在当前对话中插入消息而不实际发送消息，请构造消息正文并调用 `InsertMessage` 方法用于发送通知消息，例如“XXX 撤回一条消息”、“XXX 入群” 和 “对方正在输入...”。

消息会根据消息中的 Unix 时间戳插入本地数据库，SDK 会更新会话的 `latestMessage` 等属性。

```csharp
// 将消息插入到指定会话中。
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, convType);
conv.InsertMessage(message);
```
