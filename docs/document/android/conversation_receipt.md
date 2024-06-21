# 会话已读回执

会话已读回执指接收方进入会话页面，阅读会话中的所有消息后，调用接口向服务器发送会话已读回执，服务器将该回执回调给消息发送方，消息发送方将会收到会话已读回调。在多端多设备登录下，接收方的其他设备也会收到该回调。

目前，只有单聊会话支持已读回执。本文介绍如何使用环信即时通讯 IM Android SDK 实现会话已读回执功能。

会话已读回执的效果示例，如下图所示：

![img](@static/images/uikit/chatuikit/feature/conversation/conversation_read.png) 

## 技术原理

 单聊会话已读回执实现的流程如下：

  1. 设置 `EMOptions#setRequireAck` 为 `true` 开启已读回执功能。

  2. 消息接收方进入会话页面，阅读消息后，调用 `ackConversationRead` 方法发送会话已读回执。
  3. 消息发送方通过监听 `OnConversationRead` 回调接收会话已读回执。

 ## 实现方法

 参考以下步骤在单聊中实现会话已读回执：

 1. 开启已读回执功能，即 SDK 初始化时设置 `EMOptions#setRequireAck` 为 `true`。

 ```java
// 设置是否需要接受方已读确认,默认为 true
options.setRequireAck(true);
 ```

 2. 接收方发送会话已读回执。

消息接收方进入会话页面，查看会话中是否有未读消息。若有，调用 `ackConversationRead` 方法发送会话已读回执，没有则不发送。该方法为异步方法，需要捕捉异常。

若会话中存在多条未读消息，建议调用该方法，因为若调用发送消息已读回执方法 `ackMessageRead`，则需要调用多次。

```java
try {
    EMClient.getInstance().chatManager().ackConversationRead(conversationId);
} catch (HyphenateException e) {
    e.printStackTrace();
}
```

3. 消息发送方监听会话已读回执的回调。

同一用户 ID 登录多设备的情况下，用户在一台设备上发送会话已读回执，其他设备会收到 `OnConversationRead` 回调。

```java
EMClient.getInstance().chatManager().addConversationListener(new EMConversationListener() {
        ……
        @Override
        public void onConversationRead(String from, String to) {
        // 添加刷新页面通知等逻辑。
        }
});
```

## 会话已读回执和消息未读数

消息接收方调用 `ackConversationRead` 方法发送会话已读回执，开发者可调用 `EMConversation#markAllMessagesAsRead` 方法将所有未读消息设置为已读，即将该会话的未读消息数清零。
