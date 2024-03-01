# 更新消息

<Toc />

本文介绍环信即时通讯 IM SDK 如何更新本地消息。

## 技术原理

环信即时通讯 IM SDK 使用 `IChatManager` 和 `Conversation` 支持更新本地数据库中的消息，其中包含如下主要方法：

- `UpdateMessage`：更新 SDK 本地数据库中的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 更新消息到本地数据库

你可以通过以下方式更新本地数据库中的消息：

- 直接调用 `UpdateMessage` 方法更新 SDK 本地数据库中的消息。

```csharp
SDKClient.Instance.ChatManager.UpdateMessage(message):
```

- 若正在使用 `Conversation` 类，可以先获取会话，再调用 `UpdateMessage` 方法更新 SDK 本地数据库会话中的消息。

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation(conversationId, type);
conv.UpdateMessage(message);
```

