# 管理服务端的消息

<Toc />

本文介绍用户如何获取和删除服务端的消息。从消息服务器获取会话和消息也称为消息漫游，指即时通讯服务将用户的历史消息保存在消息服务器上，用户即使切换终端设备，也能从服务器获取到单聊、群聊的历史消息，保持一致的会话场景。

## 技术原理

使用环信即时通讯 IM iOS SDK 可以管理服务端的会话和历史消息。

- `getConversationsFromServer` 获取在服务器保存的会话列表；
- `asyncFetchHistoryMessagesFromServer` 获取服务器保存的指定会话中的消息；
- `removeMessagesFromServer` 单向删除服务端的历史消息；
- `deleteServerConversation` 删除服务器端会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取会话

该功能需联系商务开通，开通后，用户默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量或时间限制请联系商务。

调用 `getConversationsFromServer` 从服务端获取会话。我们建议在 app 安装时，或本地没有会话时调用该 API。否则调用 `LoadAllConversations` 即可。示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].chatManager getConversationsFromServer:^(NSArray *aConversations, EMError *aError) {
   if (!aError) {
      for (EMConversation *conversation in aConversations) {
        // conversation 会话解析。
      }
   }
}];
```

### 分页获取指定会话的历史消息

从服务器分页获取指定会话的历史消息（消息漫游）。你可以指定消息查询方向，即明确按时间顺序或逆序获取。建议每次获取少于 50 条消息，可多次获取。拉取后默认 SDK 会自动将消息更新到本地数据库。

```objectivec
// 异步方法
 [[EMClient.sharedClient].chatManager asyncFetchHistoryMessagesFromServer:conversation.conversationId conversationType:conversation.type startMessageId:self.moreMsgId pageSize:10 completion:^(EMCursorResult *aResult, EMError *aError) {
             [self.conversation loadMessagesStartFromId:self.moreMsgId count:10 searchDirection:EMMessageSearchDirectionUp completion:block];
          }];
```

### 单向删除服务端的历史消息

你可以调用 `removeMessagesFromServer` 方法单向删除服务端的历史消息。每次最多可删除 50 条消息。消息删除后，该用户无法从服务端拉取到该消息。其他用户不受该操作影响。

登录该账号的其他设备会收到 `EMMultiDevicesDelegate` 中 `multiDevicesMessageBeRemoved` 回调，已删除的消息自动从设备本地移除。

示例代码如下：

```Objectivec
// 按时间删除消息
[self.conversation removeMessagesFromServerWithTimeStamp:message.timestamp completion:^(EMError * _Nullable aError) {

}];

// 按消息 ID 删除消息
[self.conversation removeMessagesFromServerMessageIds:@[@"123314142214"] completion:^(EMError * _Nullable aError) {

}];
```

### 删除服务端会话及其历史消息

你可以调用 `deleteServerConversation` 方法删除服务器端会话和历史消息。会话删除后，当前用户和其他用户均无法从服务器获取该会话。若该会话的历史消息也删除，所有用户均无法从服务器获取该会话的消息。

```objectivec
// 删除指定会话，如果需要保留历史消息，`isDeleteServerMessages` 参数传 `NO`，异步方法。
[[EMClient sharedClient].chatManager deleteServerConversation:@"conversationId1" conversationType:EMConversationTypeChat isDeleteServerMessages:YES completion:^(NSString *aConversationId, EMError *aError) {
    // 删除回调
}];
```
