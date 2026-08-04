# 管理消息话题中的消息

## 功能说明

消息话题中的消息消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `isChatThreadMessage` 标记。使用消息话题中的消息功能前，你需要联系商务开通。

本文介绍环信即时通讯 IM Android SDK 如何发送、接收以及撤回消息话题中的消息。

## 消息收发流程

消息收发流程如下：

客户端 A 向客户端 B 发送消息。消息发送至即时通讯 IM 服务器，服务器将消息传递给客户端 B。对于消息话题中的消息，服务器投递给消息话题内其他每一个成员。客户端 B 收到消息后，SDK 触发事件。客户端 B 监听事件并获取消息。

消息话题创建和查看如下图所示：

![img](/images/android/threads.png)

## 功能开通

使用消息话题功能前，你需要联系商务开通该功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并登录成功，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已联系商务开通消息话题功能。

## 发送消息话题中的消息

发送消息话题中的消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send.html)。唯一不同的是，发送消息话题中的消息需要指定标记 `isChatThreadMessage` 为 `true`。

示例代码如下：

```java
// 创建一条文本消息，`content` 为消息文字内容，`chatThreadId` 为消息话题 ID。
EMMessage message = EMMessage.createTextSendMessage(content, chatThreadId); 
// 设置消息类型，消息话题中的消息需要将 `ChatType` 设置为 `GroupChat`。
message.setChatType(ChatType.GroupChat); 
// 设置消息标记 `isChatThreadMessage` 为 `true`。
message.setIsChatThreadMessage(true);
// 发送消息时可以设置 `EMCallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
message.setMessageStatusCallback(new EMCallBack() {
     @Override
     public void onSuccess() {
     }

     @Override
     public void onError(int code, String error) {
     }

     @Override
     public void onProgress(int progress, String status) {
     }
});
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

## 接收消息话题中的消息

接收消息的具体逻辑，请参考 [接收消息](message_receive.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题有新增消息时，消息话题所属群组的所有成员收到 `EMChatThreadChangeListener#onChatThreadUpdated` 回调，消息话题成员收到 `EMMessageListener#onMessageReceived` 回调。

示例代码如下：

```java
EMMessageListener msgListener = new EMMessageListener() {
   // 收到消息，遍历消息队列，解析和显示。
   @Override
   public void onMessageReceived(List<EMMessage> messages) {
       for (EMMessage message : messages) {
           if(message.isChatThreadMessage()) {
               // 接收到消息话题中的消息，添加处理逻辑。
           }
       }
   }
   ...// 其他回调，此处省略。
};
// 添加消息监听器。
EMClient.getInstance().chatManager().addMessageListener(msgListener);
// 移除消息监听器。
EMClient.getInstance().chatManager().removeMessageListener(msgListener);
```

## 撤回消息话题中的消息

撤回消息的具体逻辑，请参考 [撤回消息](message_recall.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题有消息撤回时，消息话题所属群组的所有成员收到 `EMChatThreadChangeListener#onChatThreadUpdated` 回调，消息话题成员收到 `EMMessageListener#onMessageRecalledWithExt` 回调。

示例代码如下：

```java
EMMessageListener msgListener = new EMMessageListener() {
   // 收到撤回消息回调，遍历消息队列，解析和显示。
   @Override
   public void onMessageRecalledWithExt(List<EMRecallMessageInfo> recallInfoList) {
       for (EMRecallMessageInfo recallInfo : recallInfoList) {
           EMMessage message = recallInfo.getRecallMessage();
           if(message != null && message.isChatThreadMessage()) {
               // 接收到消息话题中的消息被撤回，添加处理逻辑。
           }
       }
   }
   ...// 其他回调，此处省略。
};
```

## 获取消息话题中的消息

从服务器还是本地数据库获取消息话题中的消息取决于你的生产环境。

你可以通过 `EMConversation#isChatThread()` 判断当前会话是否为消息话题会话。

### 从服务器获取单个消息话题的消息（消息漫游）

调用 `asyncFetchHistoryMessages` 从服务器获取消息话题中的消息。从服务器获取消息话题中的消息与获取群组消息的唯一区别为前者需传入消息话题 ID，后者需传入群组 ID。

```java
String chatThreadId = "{your chatThreadId}";
EMConversation.EMConversationType type = EMConversation.EMConversationType.GroupChat;
int pageSize = 10;
String startMsgId = "";// 开始查询的消息 ID。若传 ""，SDK 忽略该参数，按搜索方向查询消息。

EMFetchMessageOption option = new EMFetchMessageOption();
option.setDirection(EMConversation.EMSearchDirection.DOWN);

EMClient.getInstance().chatManager().asyncFetchHistoryMessages(chatThreadId, type,
        pageSize, startMsgId, option, new EMValueCallBack<EMCursorResult<EMMessage>>() {
    @Override
    public void onSuccess(EMCursorResult<EMMessage> value) {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

### 从本地获取单个消息话题的消息

调用 `EMChatManager#getAllConversations` 方法只能获取单聊或群聊会话。你可以调用以下方法从本地获取单个消息话题的消息：

```java
// 需要指定会话类型为 `EMConversationType.GroupChat` 且 `isChatThread` 设置为 `true`
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(chatThreadId, EMConversationType.GroupChat, createIfNotExists, isChatThread);
// 获取此会话的所有内存中的消息
List<EMMessage> messages = conversation.getAllMessages();
// 如需处理本地数据库中消息，用以下方法到数据库中获取，SDK 会将这些消息自动存入此会话
List<EMMessage> messages = conversation.loadMoreMsgFromDB(startMsgId, pagesize, searchDirection);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#发送消息话题中的消息) | `EMMessage` | 创建文本消息。 |
| [`setChatType`](#发送消息话题中的消息) | `EMMessage` | 设置消息会话类型。 |
| [`setIsChatThreadMessage`](#发送消息话题中的消息) | `EMMessage` | 将消息标记为消息话题中的消息。 |
| [`setMessageStatusCallback`](#发送消息话题中的消息) | `EMMessage` | 设置消息发送状态回调。 |
| [`sendMessage`](#发送消息话题中的消息) | `EMChatManager` | 发送消息话题中的消息。 |
| [`isChatThreadMessage`](#接收消息话题中的消息) | `EMMessage` | 判断消息是否为消息话题中的消息。 |
| [`addMessageListener`](#接收消息话题中的消息) | `EMChatManager` | 注册消息监听器。 |
| [`removeMessageListener`](#接收消息话题中的消息) | `EMChatManager` | 移除消息监听器。 |
| [`onMessageReceived`](#接收消息话题中的消息) | `EMMessageListener` | 接收消息话题中的消息。 |
| [`onMessageRecalledWithExt`](#撤回消息话题中的消息) | `EMMessageListener` | 接收消息话题中的消息撤回事件。 |
| [`isChatThread`](#获取消息话题中的消息) | `EMConversation` | 判断会话是否为消息话题会话。 |
| [`asyncFetchHistoryMessages`](#从服务器获取单个消息话题的消息-消息漫游) | `EMChatManager` | 从服务器分页获取消息话题中的历史消息。 |
| [`getConversation`](#从本地获取单个消息话题的消息) | `EMChatManager` | 获取本地消息话题会话。 |
| [`getAllMessages`](#从本地获取单个消息话题的消息) | `EMConversation` | 获取会话中已加载到内存的消息。 |
| [`loadMoreMsgFromDB`](#从本地获取单个消息话题的消息) | `EMConversation` | 从本地数据库加载更多消息。 |
