# 获取消息的已读回执和送达回执

<Toc />

单聊会话支持消息送达回执、会话已读回执和消息已读回执，发送方发送消息后可及时了解接收方是否及时收到并阅读了信息，也可以了解整个会话是否已读。

群聊会话只支持消息已读回执。群主和群管理员在发送消息时，可以设置该消息是否需要已读回执。仅专业版及以上版本支持群消息已读回执功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通。

本文介绍如何使用环信即时通讯 IM Android SDK 实现单聊和群聊的消息回执功能。

## 技术原理

使用环信即时通讯 IM SDK 可以实现消息的送达回执与已读回执，核心方法如下：

- `setRequireDeliveryAck` 开启送达回执；
- `ackConversationRead` 发出指定会话的已读回执；
- `ackMessageRead` 发出指定消息的已读回执；
- `ackGroupMessageRead` 发出群组消息的已读回执。

送达和已读回执逻辑分别如下：

单聊消息送达回执：

1. 消息发送方在发送消息前通过 `Options.setRequireDeliveryAck` 开启送达回执功能；
2. 消息接收方收到消息后，SDK 自动向发送方触发送达回执；
3. 消息发送方通过监听 `OnMessageDelivered` 回调接收消息送达回执。

已读回执：

- 单聊会话及消息已读回执
  1. 调用 `setRequireAck(boolean)` 设置需要发送已读回执，传 `true`；
  2. 消息接收方收到消息后，调用 API `ackConversationRead` 或 `ackMessageRead` 发送会话或消息已读回执；
  3. 消息发送方通过监听 `OnConversationRead` 或 `OnMessageRead` 回调接收会话或消息已读回执。
- 群聊只支持消息已读回执：
  1. 你可以通过设置 `isNeedGroupAck` 为 `true` 开启群聊消息已读回执功能；
  2. 消息接收方收到消息后通过 `ackGroupMessageRead` 发送群组消息的已读回执。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 群消息已读回执功能仅在环信 IM 专业版及以上版本支持该功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通。

## 实现方法

### 消息送达回执

若在消息送达时收到通知，你可以打开消息送达开关，这样在消息到达对方设备时你可以收到通知。

```java
// 设置是否需要接收方送达确认，默认 `false` 即不需要。
options.setRequireDeliveryAck(false);
```

`onMessageDelivered` 回调是对方收到消息时的通知，你可以在收到该通知时，显示消息的送达状态。

```java
EMMessageListener msgListener = new EMMessageListener() {
    // 收到消息。
    @Override
      public void onMessageReceived(List<EMMessage> messages) {
    }
    // 收到已送达回执。
    @Override
      public void onMessageDelivered(List<EMMessage> message) {
    }
};

// 记得在不需要的时候移除 listener，如在 activity 的 onDestroy() 时。
EMClient.getInstance().chatManager().removeMessageListener(msgListener);
```

### 消息已读回执

消息已读回执用于告知单聊或群聊中的用户接收方已阅读其发送的消息。为降低消息已读回执方法的调用次数，SDK 还支持在单聊中使用会话已读回执功能，用于获知接收方是否阅读了会话中的未读消息。

#### 单聊

单聊既支持消息已读回执，也支持会话已读回执。我们建议你按照如下逻辑结合使用两种回执，减少发送消息已读回执数量。

- 聊天页面未打开时，若有未读消息，进入聊天页面，发送会话已读回执；
- 聊天页面打开时，若收到消息，发送消息已读回执。

第一步是在设置中打开已读回执开关：

```java
// 设置是否需要消息已读回执，设为 `true`。
Options.setRequireAck = true;
```

##### 会话已读回执

 参考以下步骤在单聊中实现会话已读回执。

 1. 接收方发送会话已读回执。

   消息接收方进入会话页面，查看会话中是否有未读消息。若有，发送会话已读回执，没有则不再发送。

```java
try {
    EMClient.getInstance().chatManager().ackConversationRead(conversationId);
} catch (HyphenateException e) {
    e.printStackTrace();
}
```

该方法为异步方法，需要捕捉异常。

2. 消息发送方监听会话已读回执的回调。

```java
EMClient.getInstance().chatManager().addConversationListener(new EMConversationListener() {
        ……
        @Override
        public void onConversationRead(String from, String to) {
        // 添加刷新页面通知等逻辑。
        }
});
```

> 同一用户 ID 登录多设备的情况下，用户在一台设备上发送会话已读回执，服务器会将会话的未读消息数置为 `0`，同时其他设备会收到 `OnConversationRead` 回调。

##### 消息已读回执

单聊消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。 

参考如下步骤在单聊中实现消息已读回执。

 1. 接收方发送已读回执消息。

   消息接收方进入会话时，发送会话已读回执。

```java
try {
    EMClient.getInstance().chatManager().ackMessageRead(conversationId);
}
catch (HyphenateException e) {
    e.printStackTrace();
}
```

在会话页面，接收到消息时，根据消息类型发送消息已读回执，如下所示：

```java
EMClient.getInstance().chatManager().addMessageListener(new EMMessageListener() {
    ......


    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        ......
        sendReadAck(message);
        ......
    }

    ......

});
/**
* 发送已读回执。
* @param message
*/
public void sendReadAck(EMMessage message) {
    // 这里是接收的消息，未发送过已读回执且是单聊。
    if(message.direct() == EMMessage.Direct.RECEIVE
            && !message.isAcked()
            && message.getChatType() == EMMessage.ChatType.Chat) {
        EMMessage.Type type = message.getType();
        // 视频，语音及文件需要点击后再发送，可以根据需求进行调整。
        if(type == EMMessage.Type.VIDEO || type == EMMessage.Type.VOICE || type == EMMessage.Type.FILE) {
            return;
        }
        try {
            EMClient.getInstance().chatManager().ackMessageRead(message.getFrom(), message.getMsgId());
        } catch (HyphenateException e) {
            e.printStackTrace();
        }
    }
}

```

2. 消息发送方监听消息已读回调。

你可以调用接口监听指定消息是否已读，示例代码如下：

```java
EMClient.getInstance().chatManager().addMessageListener(new EMMessageListener() {
    ......
    @Override
    public void onMessageRead(List<EMMessage> messages) {
        // 添加刷新消息等逻辑。
    }
    ......
});
```

#### 群聊

对于群聊，群主和群管理员发送消息时，可以设置该消息是否需要已读回执。若需要，每个群成员在阅读消息后，SDK 均会发送已读回执，即阅读该消息的群成员数量即为已读回执的数量。

群聊已读回执的有效期为 3 天，即群组中的消息发送时间超过 3 天，服务器不记录阅读该条消息的群组成员，也不会发送已读回执。

仅专业版及以上版本支持群消息已读回执功能。若要使用该功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通。

1. 群主或群管理员发送消息时若需已读回执，需设置 `EMMessage` 的方法 `setIsNeedGroupAck()` 为 `YES`。

```java
EMMessage message = EMMessage.createTxtSendMessage(content, to);
message.setIsNeedGroupAck(true);
```

2. 消息接收方发送群组消息的已读回执。

```java
public void sendAckMessage(EMMessage message) {
    if (!validateMessage(message)) {
        return;
    }

    if (message.isAcked()) {
        return;
    }

    // May a user login from multiple devices, so do not need to send the ack msg.
    if (EMClient.getInstance().getCurrentUser().equalsIgnoreCase(message.getFrom())) {
        return;
    }

    try {
        if (message.isNeedGroupAck() && !message.isUnread()) {
            String to = message.conversationId(); // do not use getFrom() here
            String msgId = message.getMsgId();
            EMClient.getInstance().chatManager().ackGroupMessageRead(to, msgId, ((EMTextMessageBody)message.getBody()).getMessage());
            message.setUnread(false);
            EMLog.i(TAG, "Send the group ack cmd-type message.");
        }
    } catch (Exception e) {
        EMLog.d(TAG, e.getMessage());
    }
}
```

3. 消息发送方监听群组消息已读回调。

群消息已读回调在消息监听类 `EMMessageListener` 中。

```java
// 接收到群组消息体的已读回执, 消息的接收方已经阅读此消息。
void onGroupMessageRead(List<EMGroupReadAck> groupReadAcks);
```

接收到群组消息已读回执后，发出消息的属性 `groupAckCount` 会有相应变化；

4. 消息发送方获取群组消息的已读回执详情。

如果想实现群消息已读回执的列表显示，可以通过下列接口获取到已读回执的详情。

```java
/**
 * 从服务器获取群组消息回执详情。
 * 分页获取。
 * 发送群组消息回执，详见{@link #ackGroupMessageRead(String, String, String)}。
 *
 * 异步方法。
 *
 * @param msgId         消息 ID。
 * @param pageSize      每次获取群消息已读回执的条数。
 * @param startAckId    已读回执 ID，如果为空，从最新的回执向前开始获取。
 * @param callBack      结果回调，成功执行 {@link EMValueCallBack#onSuccess(Object)}，失败执行 {@link EMValueCallBack#onError(int, String)}。
 *
 */
public void asyncFetchGroupReadAcks(
    final String msgId,
    final int pageSize,
    final String startAckId,
    final EMValueCallBack<EMCursorResult<EMGroupReadAck>> callBack);
```
