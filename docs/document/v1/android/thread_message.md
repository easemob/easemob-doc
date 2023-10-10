# 管理子区消息

<Toc />

子区消息消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `isChatThreadMessage` 标记。本文介绍环信即时通讯 IM Android SDK 如何发送、接收以及撤回子区消息。

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMChatManager`、`EMMessage` 和 `EMChatThread` 类，用于管理子区消息，支持你通过调用 API 在项目中实现如下功能：

- 发送子区消息
- 接收子区消息
- 撤回子区消息
- 获取子区消息

消息收发流程如下：

1. 客户端从应用服务器获取 token。
2. 客户端 A 和 B 登录即时通讯。
3. 客户端 A 向客户端 B 发送消息。消息发送至即时通讯 IM 服务器，服务器将消息传递给客户端 B。对于子区消息，服务器投递给子区内其他每一个成员。客户端 B 收到消息后，SDK 触发事件。客户端 B 监听事件并获取消息。

![img](@static/images/android/sendandreceivemsg.png)

子区创建和查看如下图：

![img](@static/images/android/threads.png)

## 前提条件

开始前，请确保满足以下条件：

- 已集成环信 IM 3.9.3 或以上版本的基本功能，账户登录成功。
- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/document/v1/privatization/uc_limitation.html)。
- 私有部署已开通子区功能。

## 实现方法

本节介绍如何使用环信即时通讯 IM Android SDK 提供的 API 实现上述功能。

### 发送子区消息

发送子区消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send_receive.html#发送文本消息)。唯一不同的是，发送子区消息需要指定标记 `isChatThreadMessage` 为 `true`。

示例代码如下：

```java
// 创建一条文本消息，`content` 为消息文字内容，`chatThreadId` 为子区 ID。
EMMessage message = EMMessage.createTxtSendMessage(content, chatThreadId); 
// 设置消息类型，子区消息需要将 `ChatType` 设置为 `GroupChat`。
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

### 接收子区消息

接收消息的具体逻辑，请参考 [接收消息](message_send_receive.html#接收消息)，此处只介绍子区消息和其他消息的区别。

子区有新增消息时，子区所属群组的所有成员收到 `EMChatThreadChangeListener#onChatThreadUpdated` 回调，子区成员收到 `EMMessageListener#onMessageReceived` 回调。

示例代码如下：

```java
EMMessageListener msgListener = new EMMessageListener() {
   // 收到消息，遍历消息队列，解析和显示。
   @Override
   public void onMessageReceived(List<EMMessage> messages) {
       for (EMMessage message : messages) {
           if(message.isChatThreadMessage()) {
               // 接收到子区消息，添加处理逻辑。
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

### 撤回子区消息

撤回消息的具体逻辑，请参考 [撤回消息](message_send_receive.html#撤回消息)，此处只介绍子区消息和其他消息的区别。

子区有消息撤回时，子区所属群组的所有成员收到 `EMChatThreadChangeListener#onChatThreadUpdated` 回调，子区成员收到 `EMMessageListener#onMessageRecalled` 回调。

示例代码如下：

```java
EMMessageListener msgListener = new EMMessageListener() {
   // 收到撤回消息回调，遍历消息队列，解析和显示。
   @Override
   public void onMessageRecalled(List<EMMessage> messages) {
       for (EMMessage message : messages) {
           if(message.isChatThreadMessage()) {
               // 接收到子区消息被撤回，添加处理逻辑。
           }
       }
   }
   ...// 其他回调，此处省略。
};
```

### 获取子区消息

从服务器还是本地数据库获取子区消息取决于你的生产环境。

你可以通过 `EMConversation#isChatThread()` 判断当前会话是否为子区会话。

#### 从服务器获取单个子区的消息（消息漫游）

调用 `asyncFetchHistoryMessage` 从服务器获取子区消息。从服务器获取子区消息与获取群组消息的唯一区别为前者需传入子区 ID，后者需传入群组 ID。

```java
String chatThreadId = "{your chatThreadId}";
EMConversation.EMConversationType type = EMConversation.EMConversationType.GroupChat;
int pageSize = 10;
String startMsgId = "";// 开始查询的消息 ID。若传 ""，SDK 忽略该参数，按搜索方向查询消息。

EMConversation.EMSearchDirection direction = EMConversation.EMSearchDirection.DOWN;

EMClient.getInstance().chatManager().asyncFetchHistoryMessage(chatThreadId, type,
        pageSize, startMsgId, direction, new EMValueCallBack<EMCursorResult<EMMessage>>() {
    @Override
    public void onSuccess(EMCursorResult<EMMessage> value) {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

#### 从本地获取单个子区的消息

调用 `EMChatManager#getAllConversations` 方法只能获取单聊或群聊会话。你可以调用以下方法从本地获取单个子区的消息：

```java
// 需要指定会话类型为 `EMConversationType.GroupChat` 且 `isChatThread` 设置为 `true`
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(chatThreadId, EMConversationType.GroupChat, createIfNotExists, isChatThread);
// 获取此会话的所有内存中的消息
List<EMMessage> messages = conversation.getAllMessages();
// 如需处理本地数据库中消息，用以下方法到数据库中获取，SDK 会将这些消息自动存入此会话
List<EMMessage> messages = conversation.loadMoreMsgFromDB(startMsgId, pagesize, searchDirection);
```