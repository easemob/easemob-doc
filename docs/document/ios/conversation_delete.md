# 删除会话

<Toc />

删除好友或退出群组后，SDK 不会自动删除对应的单聊或群聊会话。你可以调用相应的接口从服务器和本地删除单个会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器和本地删除单个会话及其历史消息，主要方法如下：

- `deleteConversationFromServer`：单向删除服务端的单个会话及其历史消息。
- `IEMChatManager.deleteConversations`：删除本地单个会话及其历史消息。

### 单向删除服务端会话及其历史消息

你可以调用 `deleteServerConversation` 方法删除服务器端会话，并选择是否删除服务端的历史消息。会话和消息删除后，当前用户无法从服务器获取该会话和消息。调用该接口会删除会话的本地消息，但不会删除本地会话。该接口不影响其他用户的会话和消息。

```objectivec
// 删除指定会话，如果需要保留服务端的历史消息，`isDeleteServerMessages` 参数传 `NO`，异步方法。
[[EMClient sharedClient].chatManager deleteServerConversation:@"conversationId1" conversationType:EMConversationTypeChat isDeleteServerMessages:YES completion:^(NSString *aConversationId, EMError *aError) {
    // 删除回调
}];
```

### 删除本地会话及历史消息

你可以删除本地会话和历史消息，示例代码如下：

```objectivec
// 删除指定会话，如果需要保留历史消息，`isDeleteMessages` 参数传 `NO`，异步方法。
[[EMClient sharedClient].chatManager deleteConversation:conversationId isDeleteMessages:YES completion:nil];
// 删除一组会话。
NSArray *conversations = @{@"conversationID1",@"conversationID2"};
[[EMClient sharedClient].chatManager deleteConversations:conversations isDeleteMessages:YES completion:nil];
```

```objectivec
// 删除当前会话中指定的一条历史消息。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
[conversation deleteMessageWithId:.messageId error:nil];
```


