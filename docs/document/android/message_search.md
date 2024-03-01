# 搜索消息

<Toc />

本文介绍环信即时通讯 IM Android SDK 如何搜索本地消息。

## 技术原理

环信即时通讯 IM Android SDK 通过 `EMConversation` 类支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `EMConversation#searchMsgFromDB(string keywords, long timeStamp, int maxCount, string from, EMSearchDirection direction)`：根据关键字搜索本地数据库中单个会话中指定用户发送的消息。
- `EMChatManager#searchMsgFromDB(java.lang.String, long, int, java.lang.String, com.hyphenate.chat.EMConversation.EMSearchDirection, com.hyphenate.chat.EMConversation.EMMessageSearchScope)`: 根据关键字搜索消息时，可以选择搜索范围在所有会话中进行消息搜索。
- `EMConversation#searchMsgFromDB(java.lang.String, long, int, java.lang.String, com.hyphenate.chat.EMConversation.EMSearchDirection, com.hyphenate.chat.EMConversation.EMMessageSearchScope)`：根据关键字搜索消息时，可以选择搜索范围在当前会话中进行消息搜索。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据关键字搜索会话消息

你可以调用 `searchMsgFromDB(string keywords, long timeStamp, int maxCount, string from, EMSearchDirection direction)` 方法根据关键字搜索本地数据库中单个会话中指定用户发送的消息，示例代码如下：

```java
//conversationId：会话 ID
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
// keywords：搜索关键字；timeStamp：搜索的起始时间戳；maxCount：每次获取的消息数量，取值范围为 [1,400]。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
List<EMMessage> messages = conversation.searchMsgFromDB(keywords, timeStamp, maxCount, from, EMConversation.EMSearchDirection.UP);
```

### 根据搜索范围搜索所有会话中的消息 

你可以调用 `EMChatManager#searchMsgFromDB(java.lang.String, long, int, java.lang.String, com.hyphenate.chat.EMConversation.EMSearchDirection, com.hyphenate.chat.EMConversation.EMMessageSearchScope)` 方法，除了设置关键字、消息时间戳、消息数量、发送方、搜索方向等条件搜索所有会话中的消息时，你还可以选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。 

:::tip
若使用该功能，需将 SDK 升级至 V4.4.0 或以上版本。
:::

```java
String keyWord = "123";
List<EMMessage> messages = EMClient.getInstance().chatManager().searchMsgFromDB(keyWord, -1, 200, null, EMConversation.EMSearchDirection.UP, EMConversation.EMMessageSearchScope.ALL);

```

### 根据搜索范围搜索当前会话中的消息 

你可以调用 `com.hyphenate.chat.EMConversation#searchMsgFromDB(java.lang.String, long, int, java.lang.String, com.hyphenate.chat.EMConversation.EMSearchDirection, com.hyphenate.chat.EMConversation.EMMessageSearchScope)` 方法除了设置关键字、消息时间戳、消息数量、发送方、搜索方向等条件搜索当前会话中的消息，你还可以选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。

:::tip
若使用该功能，需将 SDK 升级至 V4.4.0 或以上版本。
:::

```java
String keyWord = "123";
String conversationId = "jack";
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
List<EMMessage> messages = conversation.searchMsgFromDB(keyWord, -1, 200, null, EMConversation.EMSearchDirection.UP, EMConversation.EMMessageSearchScope.ALL);

```

