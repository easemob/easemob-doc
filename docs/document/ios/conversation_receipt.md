# 会话已读回执

会话已读回执指接收方进入会话页面，阅读会话中的所有消息后，调用接口向服务器发送会话已读回执，服务器将该回执回调给消息发送方，将会话的未读消息数置为 0。

目前，只有单聊会话支持已读回执。本文介绍如何使用环信即时通讯 IM iOS SDK 实现会话已读回执功能。

例如，你可以实现下图所示的效果。

[image]

## 技术原理

 单聊会话已读回执实现的流程如下：

  1. 你可以通过设置 `EMOptions#enableRequireReadAck` 为 `YES` 开启已读回执功能；
  2. 消息接收方进入会话页面，阅读消息后，调用 `ackConversationRead` 方法发送会话已读回执；
  3. 消息发送方通过监听 `onConversationRead` 回调接收会话已读回执。

 ## 实现方法

 参考以下步骤在单聊中实现会话已读回执：

 1. 开启已读回执功能，即 SDK 初始化时设置 `EMOptions#enableRequireReadAck` 为 `YES`。

 2. 接收方发送会话已读回执。

消息接收方进入会话页面，查看会话中是否有未读消息。若有，调用 `ackConversationRead` 方法发送会话已读回执，没有则不发送。

若会话中存在多条未读消息，建议调用该方法，因为若调用发送消息已读回执方法 `sendMessageReadAck`，则需要调用多次。

```objectivec
[[EMClient sharedClient].chatManager ackConversationRead:conversationId completion:nil];
```

3. 消息发送方监听会话已读回执的回调。

同一用户 ID 登录多设备的情况下，用户在一台设备上发送会话已读回执，其他设备会收到 `OnConversationRead` 回调。

```objectivec
// 继承并实现监听器。
EMChatManagerDelegate

// 收到会话已读回执。
- (void)onConversationRead:(NSString *)from to:(NSString *)to
  {
    // 添加刷新页面通知等逻辑。
  }
// 注册监听器。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// 移除监听器。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## 会话已读回执和消息未读数

消息接收方调用 `IEMChatManager#ackConversationRead` 方法发送会话已读回执后，开发者可调用 `EMConversation#markAllMessagesAsRead` 方法将所有未读消息设置为已读，即将该会话的未读消息数清零。
