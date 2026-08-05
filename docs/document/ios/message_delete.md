# 删除消息

## 功能说明

SDK 支持单向删除服务端的消息：

 - 单向清空服务端的聊天记录：单向清空服务端的当前用户的聊天记录，包括单聊、群组聊天和聊天室的消息和会话。清空成功后，SDK 会同步清除本地已缓存的会话和消息数据，并更新本地会话列表缓存。
 - 单向删除服务端的历史消息：按消息 ID 或时间戳单向删除当前用户在服务端保存的历史消息，同时删除当前设备对应会话中的本地消息。若业务侧已在本地保存或展示这些消息，需要在接口调用成功后自行更新本地消息列表。

若你单向清空了服务端的聊天记录或删除了历史消息，你无法从服务端拉取到会话和消息，而其他用户不受该操作影响。

## 前提条件

开始前，请确保满足以下条件：

 - 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
 - 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 单向清空聊天记录

你可以调用 `deleteAllMessagesAndConversations` 清空当前用户的全部本地会话及其消息，包括单聊、群聊和聊天室会话。通过 `clearServerData` 参数可以决定是否同时单向清除当前用户在服务端的会话及消息：

 - `YES`：清除本地以及当前用户服务端的全部会话和消息。清除后，当前用户无法再从服务端获取这些数据，其他用户不受影响。
 - `NO`：仅清除本地全部会话和消息，服务端数据仍保留。

清空成功后，SDK 会清除内存中的会话缓存。若本地会话列表发生变化，SDK 会触发 `conversationListDidUpdate`，应用可在该回调中重新读取本地会话列表并刷新界面。

```objectivec
// YES 表示同时单向清除当前用户服务端的全部会话和消息。
[[EMClient sharedClient].chatManager deleteAllMessagesAndConversations:YES
                                                            completion:^(EMError *error) {
    if (!error) {
        // 本地会话和消息已清空；服务端数据也已为当前用户清除。
    } else {
        // 清空失败。
    }
}];
```

## 单向删除服务端的历史消息

你可以调用 `removeMessagesFromServerWithTimeStamp` 或 `removeMessagesFromServerMessageIds`，按消息 ID 或时间戳单向删除当前用户在服务端保存的历史消息。该操作仅对当前用户生效：删除后，当前用户无法再从服务端漫游获取这些消息；同一单聊、群聊或聊天室中的其他用户不受影响，仍可按照漫游策略获取这些消息。

支持以下删除方式：

 - 按消息 ID 删除：调用 `removeMessagesFromServerMessageIds`，每次最多删除 50 条消息。
 - 按时间删除：调用 `removeMessagesFromServerWithTimeStamp`，删除消息时间戳小于等于指定时间戳的历史消息，时间戳单位为毫秒。

多端多设备登录时，删除成功后，当前用户的其他在线设备会收到 `multiDevicesMessageBeRemoved` 回调。

:::tip
1. 调用上述单向删除服务端历史消息的方法成功后，SDK 会从当前设备对应会话的本地存储和内存缓存中移除对应消息。该接口的核心作用是单向删除当前用户在服务端保存的历史消息；应用应在成功回调中刷新消息列表，避免继续展示旧数据。
2. 聊天室漫游消息默认关闭，若要使用该功能需联系环信商务开通。 
:::

示例代码如下：

```objectivec
// 根据会话 ID 获取本地会话对象。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (!conversation) {
    return;
}

// 按时间删除：beforeTimeStamp 为毫秒级时间戳；该时间及之前的消息将被删除。
[conversation removeMessagesFromServerWithTimeStamp:beforeTimeStamp
                                          completion:^(EMError *error) {
    if (!error) {
        // 服务端和当前设备该会话中的对应历史消息已删除。
    } else {
        // 删除失败。
    }
}];

// 按消息 ID 删除：messageIds 中最多包含 50 个消息 ID。
[conversation removeMessagesFromServerMessageIds:messageIds
                                        completion:^(EMError *error) {
    if (!error) {
        // 服务端和当前设备该会话中的指定消息已删除。
    } else {
        // 删除失败。
    }
}];
```

## 删除本地指定会话的所有消息

你可以删除本地指定会话的所有消息，示例代码如下：

```objectivec
// 根据会话 ID 获取本地会话对象。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (conversation) {
    EMError *error = nil;
    // 删除该会话在本地数据库和内存缓存中的所有消息。
    [conversation deleteAllMessages:&error];
    if (!error) {
        // 删除成功。
    } else {
        // 删除失败。
    }
}
```

## 删除本地会话指定时间段的消息

你可以删除本地指定会话在一段时间内的本地消息，示例代码如下：

```objectivec
// 根据会话 ID 获取本地会话对象。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (conversation) {
    // startTime 和 endTime 为毫秒级时间戳，且均包含在删除范围内。
    EMError *error = [conversation removeMessagesStart:startTime to:endTime];
    if (!error) {
        // 删除成功。
    } else {
        // 删除失败。
    }
}
```

## 删除本地会话的指定消息

调用 `deleteMessageWithId` 从本地数据库和该会话的内存缓存中删除指定消息。该操作不会删除服务端消息。

```objectivec
// 根据会话 ID 获取本地会话对象。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (conversation && deleteMsg) {
    EMError *error = nil;
    // 仅从本地数据库和该会话的内存缓存中删除指定消息。
    [conversation deleteMessageWithId:deleteMsg.messageId error:&error];
    if (!error) {
        // 删除成功。
    } else {
        // 删除失败。
    }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`deleteAllMessagesAndConversations`](#单向清空聊天记录) | `IEMChatManager` | 异步清空本地所有会话及消息，并按参数决定是否同时单向清除服务端数据。 |
| [`getConversationWithConvId`](#单向删除服务端的历史消息) | `IEMChatManager` | 根据会话 ID 获取本地会话对象。 |
| [`removeMessagesFromServerWithTimeStamp`](#单向删除服务端的历史消息) | `EMConversation` | 按时间戳单向删除服务端历史消息，同时删除当前设备该会话中的对应本地消息。 |
| [`removeMessagesFromServerMessageIds`](#单向删除服务端的历史消息) | `EMConversation` | 按消息 ID 单向删除服务端历史消息，同时删除当前设备该会话中的对应本地消息。 |
| [`deleteAllMessages`](#删除本地指定会话的所有消息) | `EMConversation` | 删除指定会话在本地数据库和内存缓存中的所有消息。 |
| [`removeMessagesStart`](#删除本地会话指定时间段的消息) | `EMConversation` | 删除指定时间段内的本地消息。 |
| [`deleteMessageWithId`](#删除本地会话的指定消息) | `EMConversation` | 从本地数据库和会话内存缓存中删除指定消息。 |
| [`messageId`](#删除本地会话的指定消息) | `EMChatMessage` | 获取消息 ID。 |
