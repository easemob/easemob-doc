# 搜索消息

本文介绍环信即时通讯 IM Android SDK 如何按照关键词、搜索范围、消息类型、发送方和时间戳等条件搜索本地消息。本文中的接口仅查询当前用户设备上的本地数据库，不会向服务端发起搜索请求。由于透传消息不会保存到本地数据库，因此无法通过这些接口搜索透传消息。

:::tip
若要搜索服务端的消息，请联系商务开通。详见 [服务端消息搜索文档](/value-added/search/message_search_android.html)。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，并已 [打开当前用户的本地数据库](login.html#登录完成前使用本地数据库)，详见 [快速开始](quickstart.html)。本地消息搜索不要求客户端保持服务器连接。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据关键字搜索会话中的用户发送的消息

你可以调用 `EMConversation#searchMsgFromDB(String, long, int, String, EMSearchDirection)`，按照关键词搜索指定会话中某个用户发送的消息。

`timeStamp` 为搜索起始时间戳，设为负数时从当前时间开始搜索；返回结果不包含时间戳与 `timeStamp` 相同的消息。

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null) {
    // maxCount 取值范围为 1–400；UP 表示按时间戳倒序搜索。
    List<EMMessage> messages = conversation.searchMsgFromDB(
            keywords,
            timeStamp,
            maxCount,
            senderId,
            EMConversation.EMSearchDirection.UP);
}
```

### 根据搜索范围搜索所有会话中的消息 

你可以调用 `EMChatManager#searchMsgFromDB(String, long, int, String, EMSearchDirection, EMMessageSearchScope)`，按照关键词、起始时间戳、最大返回数量、发送方和搜索方向，在全部本地会话中搜索消息。

通过 `searchScope` 还可以指定仅搜索消息内容、仅搜索消息扩展字段，或同时搜索二者。

```java
String keyword = "123";
List<EMMessage> messages = EMClient.getInstance()
        .chatManager()
        .searchMsgFromDB(
                keyword,
                -1,
                200,
                null,
                EMConversation.EMSearchDirection.UP,
                EMConversation.EMMessageSearchScope.ALL);

```

### 根据搜索范围搜索当前会话中的消息 

你可以调用 `EMConversation#asyncSearchMsgFromDB`，按照关键词、起始时间戳、最大返回数量、一个或多个发送方、搜索方向及搜索范围，异步搜索当前会话中的消息。

```java
String keyword = "123";
String conversationId = "jack";
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null) {
    List<String> senders = Arrays.asList("user1", "user2");
    // `senders` 最多可包含 10 个用户 ID；传入 `null` 或空列表时，不限制消息发送方。 
    conversation.asyncSearchMsgFromDB(
            keyword,
            -1,
            200,
            senders,
            EMConversation.EMSearchDirection.UP,
            EMConversation.EMMessageSearchScope.ALL,
            new EMValueCallBack<List<EMMessage>>() {
                @Override
                public void onSuccess(List<EMMessage> messages) {
                    // messages 为当前会话中符合条件的本地消息。
                }

                @Override
                public void onError(
                        int errorCode,
                        String errorMessage) {
                }
            });
}

```

### 根据消息类型搜索所有会话中的消息

你可以调用 `EMChatManager#searchMsgFromDB(Set<EMMessage.Type>, long, int, String, EMSearchDirection)`，按照一种或多种消息类型、起始时间戳、最大返回数量、发送方和搜索方向，在全部本地会话中搜索消息。

```java
// count：要查询的消息条数。取值范围为 [1,400]。
// fromuser：会话中发送方的用户 ID。若传空字符串，搜索对发送方不限制。
Set<EMMessage.Type> types = new HashSet<>();
types.add(EMMessage.Type.TXT);
types.add(EMMessage.Type.VOICE);
List<EMMessage> messages = EMClient.getInstance()
        .chatManager()
        .searchMsgFromDB(
                types,
                -1,
                400,
                "xu",
                EMConversation.EMSearchDirection.UP);
for (EMMessage message : messages) {
    if (message.getBody() instanceof EMTextMessageBody) {
        EMTextMessageBody body = (EMTextMessageBody) message.getBody();
        EMLog.e(TAG, "message: " + body.getMessage() + ",time: " + message.getMsgTime());
    } else {
        EMLog.e(TAG, "message: " + message.getBody() + ",time: " + message.getMsgTime());
    }
}
``` 

### 根据消息类型搜索当前会话中的消息

你可以调用 `EMConversation#searchMsgFromDB(Set<EMMessage.Type>, long, int, String, EMSearchDirection)`，按照一种或多种消息类型、起始时间戳、最大返回数量、发送方和搜索方向，在指定会话中搜索消息。

```java
// count：要查询的消息条数。取值范围为 [1,400]。
// fromuser：当前会话中发送方的用户 ID。若传空字符串，搜索对发送方不限制。
Set<EMMessage.Type> types = new HashSet<>();
types.add(EMMessage.Type.TXT);
types.add(EMMessage.Type.VOICE);
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation("xu");

if (conversation != null) {
    List<EMMessage> messages = conversation.searchMsgFromDB(
            types,
            -1,
            400,
            "xu",
            EMConversation.EMSearchDirection.UP);

    for (EMMessage message : messages) {
        if (message.getBody() instanceof EMTextMessageBody) {
            EMTextMessageBody body =
                    (EMTextMessageBody) message.getBody();
            EMLog.e(TAG, "message: " + body.getMessage()
                    + ",time: " + message.getMsgTime());
        } else {
            EMLog.e(TAG, "message: " + message.getBody()
                    + ",time: " + message.getMsgTime());
        }
    }
}
```   

## 关键字搜索规则

调用以下消息搜索 API 搜索不同类型的消息时，其中的 `keywords` 参数对应不同的内容。

- [根据关键字搜索本地数据库中单个会话中指定用户发送的消息](#根据关键字搜索会话中的用户发送的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在所有会话中进行消息搜索](#根据搜索范围搜索所有会话中的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在当前会话中进行消息搜索](#根据搜索范围搜索当前会话中的消息)。

### 只搜索消息内容

|消息类型 | 关键字匹配的消息内容 | 关键字搜索内容示例 |
| :-------------- | :----- |:----- |
|文本消息  |  `EMTextMessageBody#getMessage`   | 文本消息的实际内容“你好世界”。|
|图片消息  | `EMImageMessageBody#getFileName`       | 图片文件名“photo.jpg”。|
|语音消息  | `EMVoiceMessageBody#getFileName`       | 语音文件名“audio.amr”。|
|视频消息  | `EMVideoMessageBody#getFileName`       | 视频文件名“video.mp4”。|
|文件消息  |  `EMFileMessageBody#getFileName`  | 文件名“report.pdf”。|
|位置消息  | `EMLocationMessageBody#getAddress` 和 `EMLocationMessageBody#getBuildingName` | 地址或建筑物名称，例如“北京市朝阳区”或“国贸大厦”。|
|自定义消息|   `EMCustomMessageBody#event`     | 自定义事件名“gift”|
|合并消息  | `EMCombineMessageBody#getTitle` 和 `EMCombineMessageBody#getSummary` | 标题或摘要，例如“聊天记录”或“包含 5 条消息”。|

### 只搜索扩展信息

若只搜索消息的扩展属性（`ext`）JSON 字符串，`keywords` 字段匹配用户自定义添加的扩展属性，例如：

```json
{"key1":"value1", "key2":"value2"}
```

### 全搜索

同时搜索消息内容和扩展信息，任一匹配即返回。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getConversation`](#根据关键字搜索会话中的用户发送的消息) | `EMChatManager` | 获取指定 ID 的本地会话；未找到时返回 `null`。 |
| [`searchMsgFromDB`](#根据关键字搜索会话中的用户发送的消息) | `EMConversation` | 按照关键词搜索指定会话中某个用户发送的本地消息。 |
| [`searchMsgFromDB`](#根据搜索范围搜索所有会话中的消息) | `EMChatManager` | 按照关键词和搜索范围，在全部本地会话中搜索消息。 |
| [`asyncSearchMsgFromDB`](#根据搜索范围搜索当前会话中的消息) | `EMConversation` | 按照关键词、发送方列表及搜索范围，异步搜索指定会话中的消息。 |
| [`searchMsgFromDB`](#根据消息类型搜索所有会话中的消息) | `EMChatManager` | 按照一种或多种消息类型，在全部本地会话中搜索消息。 |
| [`searchMsgFromDB`](#根据消息类型搜索当前会话中的消息) | `EMConversation` | 按照一种或多种消息类型，在指定会话中搜索消息。 |

