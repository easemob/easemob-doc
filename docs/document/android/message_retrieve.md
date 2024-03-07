# 获取历史消息

<Toc />

本文介绍环信即时通讯 IM Android SDK 如何从服务器和本地获取历史消息。

- 环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

- SDK 内部使用 SQLite 保存本地消息，你可以获取本地消息。

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMChatManager` 和 `EMConversation` 类支持获取服务器和本地的消息，包含如下主要方法：

- `EMChatManager.asyncFetchHistoryMessages`：根据 `EMFetchMessageOption` 类从服务端分页获取指定会话的历史消息；
- `EMConversation.getAllMessages/loadMoreMsgFromDB`：读取本地指定会话的消息；
- `EMChatManager.getMessage`：根据消息 ID 获取本地消息；
- `EMChatManager.searchMsgFromDB(Type type, long timeStamp, int maxCount, String from, EMConversation.EMSearchDirection direction)`：获取本地存储的指定会话中特定类型的消息；
- `EMChatManager.searchMsgFromDB(long startTimeStamp, long endTimeStamp, int maxCount)`：获取一定时间段内本地指定会话中发送和接收的消息；

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取指定会话的历史消息

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。

你可以调用 `asyncFetchHistoryMessages` 方法基于 `EMFetchMessageOption` 类从服务端分页拉取单聊和群组聊天的历史消息。为确保数据可靠，我们建议你每次最多获取 50 条消息，可多次获取。

通过设置 `EMFetchMessageOption` 类，你可以根据以下条件拉取历史消息：

- 消息发送方；
- 消息类型；
- 消息时间段；
- 消息搜索方向；
- 是否将拉取的消息保存到数据库；
- 对于群组聊天，你可以设置 `from` 参数拉取群组中单个成员发送的历史消息。

若你在初始化时打开了 `EMOptions#setRegardImportedMsgAsRead` 开关，调用该接口获取的[通过服务端接口](/server-side/message_import.html)导入的消息为已读状态，会话中未读取的消息数量，即 `EMConversation#getUnreadMsgCount` 的返回值不发生变化。若该开关为关闭状态，`EMConversation#getUnreadMsgCount` 的返回值会增加。

:::tip
1. 若使用该 API，需将 SDK 版本升级至 V4.0.2 版本或以上。
2. 历史消息和离线消息在服务器上的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。
3. 各类事件通知发送时，若接收的用户离线，事件通知的存储时间与离线消息的存储时间一致，即也取决于你订阅的套餐包。
:::

```java
String conversationId = " ";
EMConversation.EMConversationType type = EMConversation.EMConversationType.Chat;
EMFetchMessageOption option = new EMFetchMessageOption();
//例如，设置获取的消息保存到数据库。
//option.setIsSave(true);
int pageSize = 40;
String cursor = "";
List<EMMessage> messages = new ArrayList<>();
doAsyncFetchHistoryMessages(conversationId, type, pageSize, cursor, option, messages);

private void doAsyncFetchHistoryMessages(String conversationId,
        EMConversation.EMConversationType type,
int pageSize,String cursor,
        EMFetchMessageOption option,
        List<EMMessage> messages){
    EMClient.getInstance().chatManager().asyncFetchHistoryMessages(conversationId, type, pageSize, 
                                cursor, option, new EMValueCallBack<EMCursorResult<EMMessage>>() {
        @Override
        public void onSuccess(EMCursorResult<EMMessage> value) {
            if (value != null ) {
                List<EMMessage> list = value.getData();
                if (list != null && list.size() > 0) {
                    messages.addAll(list);
                }
                String newCursor = value.getCursor();
                if( !TextUtils.isEmpty(newCursor)) {
                    doAsyncFetchHistoryMessages(conversationId, type, pageSize, newCursor, option, messages);
                }
            }
        }

        @Override
        public void onError(int error, String errorMsg) {

        }
    });
}
```

此外，你可以调用 `asyncFetchHistoryMessage` 方法从服务器分页获取指定会话的消息。你可以指定消息查询方向，即明确按时间顺序或逆序获取。

为确保数据可靠，我们建议你每次最多获取 50 条消息，可多次获取。拉取后，SDK 会自动将消息更新到本地数据库。

```java
// 异步方法。同步方法为 fetchHistoryMessages(String, EMConversationType, int, String, EMConversation.EMSearchDirection)。
EMClient.getInstance().chatManager().asyncFetchHistoryMessage(
    conversationId,
    conversationType,
    pageSize,
    startMsgId,
    searchDirection,
    new EMValueCallBack<EMCursorResult<EMMessage>>() {
        @Override
        public void onSuccess(EMCursorResult<EMMessage> value) {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
    }
);
```

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

### 根据消息 ID 获取本地消息

你可以调用 `getMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```java
// msgId：要获取消息的消息 ID。
EMMessage msg = EMClient.getInstance().chatManager().getMessage(msgId);
```

### 获取本地会话中特定类型的消息

你可以调用 `searchMsgFromDB(Type type, long timeStamp, int maxCount, String from, EMConversation.EMSearchDirection direction)` 方法从本地存储中获取指定会话中特定类型的消息。

每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

```java
//conversationId：会话 ID
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
// Type：消息类型；timeStamp：消息搜索的起始时间戳，单位为毫秒。该参数设置后，SDK 从指定的时间戳的消息开始，按照搜索方向对消息进行搜索。若设置为负数，SDK 从当前时间开始，按消息时间戳的逆序搜索。
// maxCount：每次获取的消息数量，取值范围为 [1,400]；direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
List<EMMessage> emMessages = conversation.searchMsgFromDB(EMMessage.Type.TXT, System.currentTimeMillis(), maxCount, from, EMConversation.EMSearchDirection.UP);
```

### 获取一定时间内本地会话的消息

你可以调用 `searchMsgFromDB(long startTimeStamp, long endTimeStamp, int maxCount)` 方法从本地存储中搜索一定时间段内指定会话中发送和接收的消息。

每次最多可获取 400 条消息。

```java
//conversationId：会话 ID
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
// startTimeStamp：搜索的起始时间戳；endTimeStamp：搜索的结束时间戳；maxCount：每次获取的消息数量，取值范围为 [1,400]。
List<EMMessage> messageList = conversation.searchMsgFromDB(startTimeStamp,endTimeStamp, maxCount);
```
