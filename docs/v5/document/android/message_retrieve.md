# 获取历史消息

## 功能说明

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

SDK 内部使用 SQLite 保存本地消息，你可以获取本地消息。

本文介绍环信即时通讯 IM SDK 如何从服务器获取历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取指定会话的消息

你可以调用 `asyncFetchHistoryMessages` 方法基于 `EMFetchMessageOption` 类从服务端分页拉取单聊和群组聊天的历史消息。为确保数据可靠，我们建议你每次获取 20 条消息，最大不超过 50。分页查询时，若满足查询条件的消息总数大于 `pageSize` 的数量，则返回 `pageSize` 数量的消息，若小于 `pageSize` 的数量，返回实际条数。消息查询完毕时，返回的消息条数小于 `pageSize` 的数量。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 会话 ID。单聊传对端用户 ID，群聊传群组 ID。 |
| `type` | `EMConversation.EMConversationType` | 会话类型。单聊传 `Chat`，群聊传 `GroupChat`。 |
| `pageSize` | `int` | 每页拉取的消息数。建议为 20，最大不超过 50。 |
| `cursor` | `String` | 分页游标。首次拉取传空字符串，后续传入上一次回调中 `EMCursorResult#getCursor()` 返回的游标。 |
| `option` | `EMFetchMessageOption` | 拉取选项，可设置以下条件：<br/> - 消息发送方；<br/> - 消息类型；<br/> - 消息时间段；<br/> - 消息搜索方向；<br/> - 是否将拉取的消息保存到数据库；<br/> - 对于群组聊天，你可以设置 `from` 参数拉取群组中单个成员发送的历史消息。 |
| `callBack` | `EMValueCallBack<EMCursorResult<EMMessage>>` | 拉取结果回调。成功时通过 `EMCursorResult` 获取消息列表和下一页游标。 |

若你在初始化时打开了 `EMOptions#setRegardImportedMsgAsRead` 开关，调用该接口获取的 [通过服务端接口](/document/server-side/message_import_single.html)导入的消息为已读状态，会话中未读取的消息数量，即 `EMConversation#getUnreadMsgCount` 的返回值不发生变化。若该开关为关闭状态，`EMConversation#getUnreadMsgCount` 的返回值会增加。

:::tip
1. **默认可获取单聊和群组聊天的历史消息。若要获取聊天室的历史消息，需联系环信商务。**
2. 获取单聊历史消息时会读取服务端保存的消息送达状态和已读状态。该功能默认关闭，如果需要，请联系环信商务开通。 
3. 历史消息在服务器上的存储时间与产品的套餐包相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。
:::

```java
String conversationId = " ";
EMConversation.EMConversationType type = EMConversation.EMConversationType.Chat;
EMFetchMessageOption option = new EMFetchMessageOption();
//例如，设置获取的消息保存到数据库。
//option.setIsSave(true);
//例如，设置按时间正序获取消息。
//option.setDirection(EMConversation.EMSearchDirection.DOWN);
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
                // 拉取到最后一页时，返回的 newCursor 为空字符串。
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


### 从服务器获取指定群成员发送的消息

对于单个群组会话，你可以从服务器获取指定成员（而非全部成员）发送的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 群组 ID。 |
| `type` | `EMConversation.EMConversationType` | 会话类型。获取群聊消息时传 `GroupChat`。 |
| `pageSize` | `int` | 每页拉取的消息数。建议为 20，最大不超过 50。 |
| `cursor` | `String` | 分页游标。首次拉取传空字符串，后续传入上一次回调返回的游标。 |
| `option` | `EMFetchMessageOption` | 拉取选项。通过 `setFromIds(List<String>)` 设置要查询的群成员 ID，最多可设置 10 个。 |
| `callBack` | `EMValueCallBack<EMCursorResult<EMMessage>>` | 拉取结果回调。 |

```java
String conversationId = " ";
EMConversation.EMConversationType type = EMConversation.EMConversationType.Chat;
EMFetchMessageOption option = new EMFetchMessageOption();
//例如，设置获取的消息保存到数据库。
//option.setIsSave(true);
//例如，设置按时间正序获取消息。
//option.setDirection(EMConversation.EMSearchDirection.DOWN);
//例如，你可以获取群组中某2个用户ID的消息
//List<String> fromIds = new ArrayList<String>();
//fromIds.add("user1");
//fromIds.add("user2");
//option.setFromIds(fromIds);
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

### 根据关键字获取本地会话中的消息

你可通过设置关键词获取本地数据库中会话的某些消息。SDK 返回会话 ID 及消息 ID 列表的映射关系，消息 ID 根据你设置的 `direction` 参数按照消息时间戳的正序或倒序列明。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keyword` | `String` | 要搜索的关键词。 |
| `timestamp` | `long` | 搜索起始时间戳，单位为毫秒。传负数表示从当前时间开始搜索。 |
| `sender` | `String` | 发送方用户 ID。传 `null` 表示不按发送方筛选。 |
| `direction` | `EMConversation.EMSearchDirection` | 搜索方向：`UP` 为按消息时间戳逆序搜索，`DOWN` 为正序搜索。 |
| `scope` | `EMConversation.EMMessageSearchScope` | 搜索范围，例如 `CONTENT` 表示搜索消息内容。 |
| `callBack` | `EMValueCallBack<Map<String, List<String>>>` | 搜索结果回调。成功时返回会话 ID 与消息 ID 列表的映射。 |

```java
String keyword="时间";
EMClient.getInstance().chatManager().asyncLoadConversationMessagesWithKeyword(keyword, -1, null, EMConversation.EMSearchDirection.UP, EMConversation.EMMessageSearchScope.CONTENT, new EMValueCallBack<Map<String, List<String>>>() {
    @Override
    public void onSuccess(Map<String, List<String>> value) {
        EMLog.e(TAG, "asyncLoadConversationMessagesWithKeyword onSuccess value:" + value);
    }

    @Override
    public void onError(int error, String errorMsg) {
        EMLog.e(TAG,"asyncLoadConversationMessagesWithKeyword onError error:" + error + " errorMsg:" + errorMsg);
    }
});

```

### 根据消息 ID 获取本地消息

你可以传入单个或多个消息 ID 获取单个本地会话中的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `messageIds` | `List<String>` | 要查询的消息 ID 列表。每次最多传入 20 个消息 ID。 |
| `conversationId` | `String` | 消息所属的会话 ID。 |
| `callback` | `EMValueCallBack<List<EMMessage>>` | 查询结果回调。成功时返回找到的本地消息列表。 |

```java
// messageIds：消息 ID 列表。每次最多可传入 20 个消息 ID。
EMClient.getInstance().chatManager().asyncLoadMessages(messageIds, conversationId, new EMValueCallBack<List<EMMessage>>() {
        @Override
        public void onSuccess(List<EMMessage> value) {
            EMLog.e(TAG, "asyncLoadMessages onSuccess value:" + value);
        }

        @Override
        public void onError(int error, String errorMsg) {
            EMLog.e(TAG, "asyncLoadMessages onError error:" + error + " errorMsg:" + errorMsg);
        }
    });
```

### 从本地获取指定群成员发送的消息

对于单个群组会话，你可以从本地获取指定成员（而非全部成员）发送的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keywords` | `String` | 要搜索的关键词。 |
| `timeStamp` | `long` | 搜索起始时间戳，单位为毫秒。传负数表示从当前时间开始搜索。 |
| `maxCount` | `int` | 每次最多返回的消息数，取值范围为 `[1,400]`。 |
| `senders` | `List<String>` | 要筛选的发送方用户 ID 列表，最多 10 个；传 `null` 或空列表表示不限制发送方。 |
| `direction` | `EMConversation.EMSearchDirection` | 搜索方向：`UP` 为按消息时间戳逆序搜索，`DOWN` 为正序搜索。 |
| `searchScope` | `EMConversation.EMMessageSearchScope` | 搜索范围，例如 `CONTENT` 表示搜索消息内容。 |
| `callback` | `EMValueCallBack<List<EMMessage>>` | 搜索结果回调。 |

```java
String conversationId = "user_or_group_id";
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);
if (conversation != null) {
    String keywords = "hello";
    long timeStamp = -1; // 小于 0 表示从当前时间开始搜索
    int maxCount = 20;
    // 限制发送人，最多 10 个；如果不限制发送人，传 null 或空列表
    List<String> senders = Arrays.asList("user1", "user2");
    conversation.asyncSearchMsgFromDB(
            keywords,
            timeStamp,
            maxCount,
            senders,
            EMConversation.EMSearchDirection.UP,
            EMConversation.EMMessageSearchScope.CONTENT,
            new EMValueCallBack<List<EMMessage>>() {
                @Override
                public void onSuccess(List<EMMessage> messages) {
                    for (EMMessage message : messages) {
                        String msgId = message.getMsgId();
                        String from = message.getFrom();
                        long msgTime = message.getMsgTime();
                        // TODO: 处理搜索结果
                    }
                }
                @Override
                public void onError(int code, String error) {
                    // TODO: 处理错误
                }
            }
    );
}
```

### 从本地读取指定会话的消息

你可以调用 `getAllMessages` 方法获取指定会话在内存中的所有消息。如果内存中为空，SDK 再从本地数据库中加载最近一条消息。

你也可以调用 `loadMoreMsgFromDB` 方法从本地数据库中分页加载消息，加载的消息会基于消息中的时间戳放入当前会话的内存中。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `username` | `String` | 会话 ID。单聊传对端用户 ID，群聊传群组 ID，聊天室传聊天室 ID。 |
| `startMsgId` | `String` | 分页查询的起始消息 ID。传 `null` 或空字符串时，从最新消息开始加载。 |
| `pageSize` | `int` | 每页加载的消息数，取值范围为 `[1,400]`。 |

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
List<EMMessage> messages = conversation.getAllMessages();
// startMsgId：查询的起始消息 ID。SDK 从该消息 ID 开始按消息时间戳的逆序加载。如果传入消息的 ID 为空，SDK 从最新消息开始按消息时间戳的逆序获取。
// pageSize：每页期望加载的消息数。取值范围为 [1,400]。
List<EMMessage> pagedMessages = conversation.loadMoreMsgFromDB(startMsgId, pagesize);
```

### 根据消息 ID 获取单个本地消息

你可以调用 `getMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `msgId` | `String` | 要获取的消息 ID。 |

```java
// msgId：要获取消息的消息 ID。
EMMessage msg = EMClient.getInstance().chatManager().getMessage(msgId);
```

### 获取本地会话中特定类型的消息

你可以调用 `searchMsgFromDB(Type type, long timeStamp, int maxCount, String from, EMConversation.EMSearchDirection direction)` 方法从本地存储中获取指定会话中特定类型的消息。

每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 要搜索的会话 ID。 |
| `type` | `EMMessage.Type` | 要搜索的消息类型，例如 `TXT`。 |
| `timeStamp` | `long` | 搜索起始时间戳，单位为毫秒。传负数时从当前时间开始搜索。 |
| `maxCount` | `int` | 每次获取的消息数，取值范围为 `[1,400]`。 |
| `from` | `String` | 发送方用户 ID。传 `null` 表示不按发送方筛选。 |
| `direction` | `EMConversation.EMSearchDirection` | 搜索方向：`UP` 为按消息时间戳逆序搜索，`DOWN` 为正序搜索。 |

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

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 要搜索的会话 ID。 |
| `startTimeStamp` | `long` | 搜索起始时间戳，单位为毫秒。 |
| `endTimeStamp` | `long` | 搜索结束时间戳，单位为毫秒。 |
| `maxCount` | `int` | 每次获取的消息数，取值范围为 `[1,400]`。 |

```java
//conversationId：会话 ID
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
// startTimeStamp：搜索的起始时间戳；endTimeStamp：搜索的结束时间戳；maxCount：每次获取的消息数量，取值范围为 [1,400]。
List<EMMessage> messageList = conversation.searchMsgFromDB(startTimeStamp,endTimeStamp, maxCount);
```

### 获取会话在一定时间内的消息数

你可以调用 `getAllMsgCount` 方法从 SDK 本地数据库中获取会话在某个时间段内的全部消息数。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 要统计的会话 ID。 |
| `startTimestamp` | `long` | 统计起始时间戳，单位为毫秒。 |
| `endTimestamp` | `long` | 统计结束时间戳，单位为毫秒。 |

```java
String conversationId = "pu";
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
if(conversation!=null) {
    long startTimestamp = System.currentTimeMillis() - 24 * 60 * 60 * 1000;
    int count = conversation.getAllMsgCount(startTimestamp, System.currentTimeMillis());
    EMLog.i(TAG, "queryMsgCountWithDuration count:" + count);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncFetchHistoryMessages`](#从服务器获取指定会话的消息) | `EMChatManager` | 从服务端分页获取指定会话的历史消息。 |
| [`setDirection`](#从服务器获取指定会话的消息) | `EMFetchMessageOption` | 设置服务端历史消息的查询方向。 |
| [`setIsSave`](#从服务器获取指定会话的消息) | `EMFetchMessageOption` | 设置拉取的历史消息是否保存到本地数据库。 |
| [`setFromIds`](#从服务器获取指定群成员发送的消息) | `EMFetchMessageOption` | 设置群聊历史消息的指定发送成员。 |
| [`asyncLoadConversationMessagesWithKeyword`](#根据关键字获取本地会话中的消息) | `EMChatManager` | 根据关键词从本地数据库搜索消息。 |
| [`asyncLoadMessages`](#根据消息-id-获取本地消息) | `EMChatManager` | 根据消息 ID 获取本地消息。 |
| [`asyncSearchMsgFromDB`](#从本地获取指定群成员发送的消息) | `EMConversation` | 根据关键词和发送方从本地会话搜索消息。 |
| [`getAllMessages`](#从本地读取指定会话的消息) | `EMConversation` | 获取会话内存中的全部消息。 |
| [`loadMoreMsgFromDB`](#从本地读取指定会话的消息) | `EMConversation` | 从本地数据库分页加载会话消息。 |
| [`getMessage`](#根据消息-id-获取单个本地消息) | `EMChatManager` | 根据消息 ID 获取单条本地消息。 |
| [`searchMsgFromDB`](#获取本地会话中特定类型的消息) | `EMConversation` | 按消息类型、时间和发送方搜索本地消息。 |
| [`searchMsgFromDB`](#获取一定时间内本地会话的消息) | `EMConversation` | 按时间范围搜索本地会话消息。 |
| [`getAllMsgCount`](#获取会话在一定时间内的消息数) | `EMConversation` | 统计指定时间范围内的本地消息数。 |
