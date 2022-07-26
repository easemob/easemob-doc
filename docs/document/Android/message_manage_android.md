---
permalink: /document/Android/message_manage.html
---

# 消息管理–管理本地消息数据

[[toc]]

本文介绍环信即时通讯 IM SDK 如何管理本地消息数据。SDK 内部使用 SQLite 保存本地消息，方便消息处理。

除了发送和接收消息外，环信即时通讯 IM SDK 还支持以会话为单位对本地的消息数据进行管理，如获取与管理未读消息、删除聊天记录、搜索历史消息等。其中，会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息或查看历史消息，还可进行会话置顶、清空聊天记录等操作。

## 技术原理

环信即时通讯 IM Android SDK 支持管理用户设备上存储的消息会话数据，其中包含如下主要方法：

- `loadAllConversations` 加载本地存储的会话列表;
- `deleteConversation` 删除本地存储的会话；
- `conversation.getUnreadMsgCount` 获取指定会话的未读消息数；
- `chatManager().getUnreadMessageCount` 获取所有未读消息数；
- `deleteConversationFromServer` 删除服务端的会话和聊天记录；
- `searchMsgFromDB` 在本地存储的消息中搜索；
- `insertMessage` 在指定会话中写入消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](https://docs-im.easemob.com/ccim/android/quickstart)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](https://docs-im.easemob.com/ccim/limitation)。

## 实现方法

### 获取本地所有会话

你可以调用 API 获取本地所有会话：

```java
Map<String, EMConversation> conversations = EMClient.getInstance().chatManager().getAllConversations();
```

如果出现偶尔返回的 `conversations` 的 `size` 为 `0`，很有可能是未调用 `EMClient.getInstance().chatManager().loadAllConversations()`。

### 从数据库中读取指定会话的消息

你可以从本地数据库中读取指定会话的消息，示例代码如下：

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
// 获取此会话的所有消息。
List<EMMessage> messages = conversation.getAllMessages();
// SDK 初始化时，为每个会话加载 1 条聊天记录。如需更多消息，请到数据库中获取。该方法获取 `startMsgId` 之前的 `pagesize` 条消息，SDK 会将这些消息自动存入此会话，app 无需添加到会话中。
List<EMMessage> messages = conversation.loadMoreMsgFromDB(startMsgId, pagesize);
```

### 获取指定会话的未读消息数

你可以调用接口获取特定会话的未读消息数，示例代码如下：

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
conversation.getUnreadMsgCount();
```

### 获取所有会话的未读消息数

你可以通过接口获取所有会话的未读消息数量，示例代码如下：

```java
EMClient.getInstance().chatManager().getUnreadMessageCount();
```

### 指定会话的未读消息数清零

你可以调用接口对特定会话的未读消息数清零，示例代码如下：

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
// 指定会话的未读消息数清零。
conversation.markAllMessagesAsRead();
// 将一条消息置为已读。
conversation.markMessageAsRead(messageId);
// 将所有未读消息数清零。
EMClient.getInstance().chatManager().markAllConversationsAsRead();
```

### 删除会话及聊天记录

SDK 提供两个接口，分别可以删除本地会话和聊天记录或者删除当前用户在服务器端的会话和聊天记录。

- 删除本地会话和聊天记录示例代码如下：

```java
// 删除和特定用户的会话，如果需要保留聊天记录，传 `false`。
EMClient.getInstance().chatManager().deleteConversation(username, true);
// 删除当前会话中指定的一条聊天记录。
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
conversation.removeMessage(deleteMsg.msgId);
```

- 删除服务器端会话和聊天记录，示例代码如下：

```java
// 删除指定会话，如果需要保留聊天记录，`isDeleteServerMessages` 传 `false`。
EMClient.getInstance().chatManager().deleteConversationFromServer(conversationId, conversationType, isDeleteServerMessages, new EMCallBack() {
            @Override
            public void onSuccess() {
                
            }

            @Override
            public void onError(int code, String error) {

            }
        });
```

### 根据关键字搜索会话消息

你可以根据关键字搜索会话消息，示例代码如下：

```java
List<EMMessage> messages = conversation.searchMsgFromDB(keywords, timeStamp, maxCount, from, EMConversation.EMSearchDirection.UP);
```

### 批量导入消息到数据库

如果你需要使用批量导入方式在本地会话中插入消息，可以使用下面的接口，构造 `EMMessage` 对象，将消息导入本地数据库。

示例代码如下：

```java
EMClient.getInstance().chatManager().importMessages(msgs);
```

### 插入消息

如果你需要在本地会话中加入一条消息，比如收到某些通知消息时，可以构造一条消息写入会话。

例如插入一条无需发送但有需要显示给用户看的内容，类似 “XXX 撤回一条消息”、“XXX 入群”、“对方正在输入” 等。
示例代码如下：

```java
// 将消息插入到指定会话中。
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
conversation.insertMessage(message);
// 直接插入消息。
EMClient.getInstance().chatManager().saveMessage(message);
```

### 更新消息到 SDK 本地数据库

如果需要更新消息用以下方法：

```java
/**
  *  更新消息到 SDK 本地数据库。
  *  消息更新后，会话的 latestMessage 等属性进行相应更新，不能更新消息 ID。
  *
  *  @param msg 要更新的消息。
  */
public boolean updateMessage(EMMessage msg)
```

### 更多操作

你可以参考如下文档，在项目中实现更多的消息相关功能：

- [消息概述](https://docs-im.easemob.com/ccim/android/message1);
- [发送和接收消息](https://docs-im.easemob.com/ccim/android/message2)；
- [从服务器获取会话和消息（消息漫游）](https://docs-im.easemob.com/ccim/android/message4)；
- [获取消息的已读回执和送达回执](https://docs-im.easemob.com/ccim/android/message5)；
- [实现翻译功能](https://docs-im.easemob.com/ccim/android/translation)。