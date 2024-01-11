# 搜索消息

<Toc />

本文介绍环信即时通讯 IM Android SDK 如何搜索本地消息。

## 技术原理

环信即时通讯 IM Android SDK 通过 `EMConversation` 类支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `EMConversation#searchMsgFromDB(string keywords, long timeStamp, int maxCount, string from, EMSearchDirection direction)`：根据关键字搜索本地数据库中单个会话中指定用户发送的消息。

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


