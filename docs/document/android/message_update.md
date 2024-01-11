# 更新消息

<Toc />

本文介绍环信即时通讯 IM Android SDK 如何更新本地消息。

## 技术原理

环信即时通讯 IM Android SDK 支持更新本地数据库中的消息，其中包含如下主要方法：

- `EMConversation#updateMessage`：更新消息到本地数据库。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 更新消息到本地数据库

你可以通过以下方式更新本地数据库中的消息：

- 直接调用 `EMChatManager#updateMessage` 方法更新 SDK 本地数据库中的消息。

```java 
EMClient.getInstance().chatManager().updateMessage(message);
```

- 若正在使用 `EMConversation` 类，可以先获取会话，再调用 `EMConversation#updateMessage` 方法更新 SDK 本地数据库会话中的消息。

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
conversation.updateMessage(message);
```

