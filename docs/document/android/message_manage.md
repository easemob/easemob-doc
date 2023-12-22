# 管理本地消息

<Toc />

本文介绍环信即时通讯 IM SDK 如何管理本地消息，例如获取消息、搜索消息、导入消息、插入消息、更新消息以及统计消息流量等。

SDK 内部使用 SQLite 保存本地消息，方便消息处理。

## 技术原理

环信即时通讯 IM Android SDK 支持管理用户设备上存储的消息数据，其中包含如下主要方法：

- `EMConversation.getAllMessages/loadMoreMsgFromDB` 从本地读取指定会话的消息；
- `EMChatManager.getMessage` 根据消息 ID 获取消息；
- `EMChatManager.searchMsgFromDB(Type type, long timeStamp, int maxCount, String from, EMConversation.EMSearchDirection direction)` 获取指定会话中特定类型的消息；
- `EMChatManager.searchMsgFromDB(long startTimeStamp, long endTimeStamp, int maxCount)` 获取指定时间段内发送或接收的消息；
- `searchMsgFromDB(string keywords, long timeStamp, int maxCount, string from, EMSearchDirection direction)` 根据关键字搜索本地会话消息；
- `EMChatManager.importMessages` 批量导入消息到数据库；
- `EMChatManager.insertMessage` 在指定会话中插入消息；
- `EMConversation.updateMessage` 更新消息到本地数据库；
- `EMStatisticsManager.getMessageStatistics` 根据消息 ID 获取消息流量统计信息；
- `EMStatisticsManager.getMessageCount` 获取一定时间段内发送和/或接收的指定或全部类型的消息条数；
- `EMStatisticsManager.getMessageSize` 获取一定时间段内发送和/或接收的指定或全部类型的消息的总流量。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从本地读取指定会话的消息

你可以调用 `getAllMessages` 方法获取指定会话在内存中的所有消息。如果内存中为空，SDK 再从本地数据库中加载最近一条消息。

你也可以调用 `loadMoreMsgFromDB` 方法从本地数据库中分页加载消息，加载的消息会基于消息中的时间戳放入当前会话的内存中。

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
List<EMMessage> messages = conversation.getAllMessages();
// startMsgId：查询的起始消息 ID。SDK 从该消息 ID 开始按消息时间戳的逆序加载。如果传入消息的 ID 为空，SDK 从最新消息开始按消息时间戳的逆序获取。
// pageSize：每页期望加载的消息数。取值范围为 [1,400]。
List<EMMessage> messages = conversation.loadMoreMsgFromDB(startMsgId, pagesize);
```

### 根据消息 ID 获取消息

你可以调用 `getMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```java
// msgId：要获取消息的消息 ID。
EMMessage msg = EMClient.getInstance().chatManager().getMessage(msgId);
```

### 获取指定会话中特定类型的消息

你可以调用 `searchMsgFromDB(Type type, long timeStamp, int maxCount, String from, EMConversation.EMSearchDirection direction)` 方法从本地存储中获取指定会话中特定类型的消息。每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

```java
//conversationId：会话 ID
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
// Type：消息类型；timeStamp：消息搜索的起始时间戳，单位为毫秒。该参数设置后，SDK 从指定的时间戳的消息开始，按照搜索方向对消息进行搜索。若设置为负数，SDK 从当前时间开始，按消息时间戳的逆序搜索。
// maxCount：每次获取的消息数量，取值范围为 [1,400]；direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
List<EMMessage> emMessages = conversation.searchMsgFromDB(EMMessage.Type.TXT, System.currentTimeMillis(), maxCount, from, EMConversation.EMSearchDirection.UP);
```

### 获取指定时间段内会话的消息

你可以调用 `searchMsgFromDB(long startTimeStamp, long endTimeStamp, int maxCount)` 方法从本地存储中搜索一定时间段内指定会话中发送和接收的消息。每次最多可获取 400 条消息。

```java
//conversationId：会话 ID
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
// startTimeStamp：搜索的起始时间戳；endTimeStamp：搜索的结束时间戳；maxCount：每次获取的消息数量，取值范围为 [1,400]。
List<EMMessage> messageList = conversation.searchMsgFromDB(startTimeStamp,endTimeStamp, maxCount);
```

### 根据关键字搜索会话消息

你可以调用 `searchMsgFromDB(string keywords, long timeStamp, int maxCount, string from, EMSearchDirection direction)` 方法从本地数据库获取会话中的指定用户发送的包含特定关键字的消息，示例代码如下：

```java
//conversationId：会话 ID
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
// keywords：搜索关键字；timeStamp：搜索的起始时间戳；maxCount：每次获取的消息数量，取值范围为 [1,400]。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
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

如果需要更新消息可以选用以下方法的任意一种：

```java
// 简洁方式：直接通过 `EMChatManager` 更新 SDK 本地数据库消息
EMClient.getInstance().chatManager().updateMessage(message);

// 正在使用 `EMConversation` 类时：先获取会话，再更新 SDK 本地数据库会话中的消息
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
conversation.updateMessage(message);
```

### 获取本地消息的流量统计信息

本地消息的流量统计功能默认关闭。若要使用该功能，需在 SDK 初始化前设置 `EMOptions#setEnableStatistics(boolean)` 开启。

SDK 只支持统计该功能开启后最近 30 天内发送和接收的消息。各类消息的流量计算方法如下：

- 对于文本、透传、位置消息，消息流量为消息体的流量；
- 对于图片和视频消息，消息流量为消息体、图片或视频文件以及缩略图的流量之和；
- 对于文件和语音消息，消息流量为消息体和附件的流量。

:::notice
 1. 统计时间段的开始时间和结束时间均为服务器接收消息的 Unix 时间戳。
 2. 对于携带附件的消息，下载成功后 SDK 才统计附件的流量。若附件下载多次，则会对下载的流量进行累加。
 3. 对于从服务器拉取的漫游消息，如果本地数据库中已经存在，则不进行统计。
:::

SDK 仅统计本地消息的流量，而非消息的实际流量。一般而言，该统计数据小于实际流量，原因如下：
- 未考虑发送消息时通用协议数据的流量；
- 对于接收到的消息，服务端会进行消息聚合，添加通用字段，而消息流量统计为各消息的流量，未考虑通用字段的流量消耗。

#### 根据消息 ID 获取消息流量统计信息

你可以根据消息 ID 获取指定消息的统计信息。该方法返回的消息流量统计信息包括消息 ID、消息的发送方和接收方、消息体类型、会话类型、消息方向、消息流量大小（单位为字节）以及服务器收到该消息的 Unix 时间戳。

示例代码如下：

```java
EMMessageStatistics statistics = EMClient.getInstance().statisticsManager().getMessageStatistics(messageId);
```

#### 获取一定时间段内发送和/或接收的消息条数

你可以统计一定时间段内发送和/或接收的指定或全部类型的消息，示例代码如下：

```java
int number = EMClient.getInstance().statisticsManager().getMessageCount(startTime, endTime, direct, style);
```

#### 获取一定时间段内发送和/或接收的消息的总流量

你可以统计一定时间段内发送和/或接收的指定或全部类型的消息的总流量，流量单位为字节。

示例代码如下：

```java
long size = EMClient.getInstance().statisticsManager().getMessageSize(startTime, endTime, direct, style);
```