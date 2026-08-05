# 删除消息

## 功能说明

SDK 支持单向删除服务端的消息：

- 单向清空服务端的聊天记录：单向清空服务端的当前用户的聊天记录，包括单聊、群组聊天和聊天室的消息和会话。清空成功后，SDK 会同步清除本地已缓存的会话和消息数据，并更新本地会话列表缓存
- 单向删除服务端的历史消息：按消息 ID 或时间戳单向删除当前用户在服务端保存的历史消息。不会自动删除当前设备上的本地消息缓存。若业务侧已在本地保存或展示这些消息，需要在接口调用成功后自行更新本地消息列表。

若你单向清空了服务端的聊天记录或删除了历史消息，你无法从服务端拉取到会话和消息，而其他用户不受该操作影响。


## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 单向清空聊天记录

你可以调用 `EMChatManager#asyncDeleteAllMsgsAndConversations` 清空当前用户的全部本地会话及其消息，包括单聊、群聊和聊天室会话。通过 `clearServerData` 参数可以决定是否同时单向清除当前用户在服务端的会话及消息：

- `true`：清除本地以及当前用户服务端的全部会话和消息。清除后，当前用户无法再从服务端获取这些数据，其他用户不受影响。
- `false`：仅清除本地全部会话和消息，服务端数据仍保留。

清空成功后，SDK 会清除内存中的会话缓存。若本地会话列表发生变化，SDK 会触发 `EMConversationListener#onConversationUpdate()`，应用可在该回调中重新读取本地会话列表并刷新界面。

```java
// 异步方法。
 EMClient.getInstance().chatManager().asyncDeleteAllMsgsAndConversations(true, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String error) {
        
    }
    });
```

## 单向删除服务端的历史消息

你可以调用 `removeMessagesFromServer`，按消息 ID 或时间戳单向删除当前用户在服务端保存的历史消息。该操作仅对当前用户生效：删除后，当前用户无法再从服务端漫游获取这些消息；同一单聊、群聊或聊天室中的其他用户不受影响，仍可按照漫游策略获取这些消息。

支持以下删除方式：

- 按消息 ID 删除：调用 `removeMessagesFromServer(List<String> msgIdList, EMCallBack callBack)`，每次最多删除 50 条消息。
- 按时间删除：调用 `removeMessagesFromServer(long beforeTimeStamp, EMCallBack callBack)`，删除服务器接收时间早于指定时间戳的历史消息，时间戳单位为毫秒。

多端多设备登录时，删除成功后，当前用户的其他在线设备会收到 `EMMultiDeviceListener#onMessageRemoved` 回调。

:::tip 
1. 调用 `removeMessagesFromServer` 成功后，SDK 会从当前设备的会话内存缓存中移除对应消息。该接口的核心作用是单向删除当前用户在服务端保存的历史消息；应用应在成功回调中刷新消息列表，避免继续展示旧数据。 
2. 聊天室漫游消息默认关闭，若要使用该功能需联系环信商务开通。
:::

示例代码如下：

```java 
// 按时间删除消息
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);
if (conversation == null) {
    return;
}

conversation.removeMessagesFromServer(beforeTimeStamp, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String desc) {
    }
});

// 按消息 ID 删除消息
conversation.removeMessagesFromServer(msgIdList, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String desc) {
    }
});
```

## 删除本地指定会话的所有消息

你可以删除本地指定会话的所有消息，示例代码如下：

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
if(conversation != null) {
    conversation.clearAllMessages();
}
```

## 删除本地会话指定时间段的消息

你可以删除本地指定会话在一段时间内的本地消息，示例代码如下：

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
if(conversation != null) {
    conversation.removeMessages(startTime, endTime);
}
```

## 删除本地会话的指定消息

调用 `EMConversation#removeMessage` 从本地数据库和该会话的内存缓存中删除指定消息。该操作不会删除服务端消息。

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null && deleteMsg != null) {
    conversation.removeMessage(deleteMsg.getMsgId());
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncDeleteAllMsgsAndConversations`](#单向清空聊天记录) | `EMChatManager` | 清空本地所有会话及消息，并按参数决定是否同时单向清除服务端数据。 |
| [`getConversation`](#单向删除服务端的历史消息) | `EMChatManager` | 根据会话 ID 获取本地会话对象。 |
| [`removeMessagesFromServer`](#单向删除服务端的历史消息) | `EMConversation` | 按时间戳或消息 ID 单向删除服务端历史消息。 |
| [`clearAllMessages`](#删除本地指定会话的所有消息) | `EMConversation` | 删除指定会话在本地数据库和内存缓存中的所有消息。 |
| [`removeMessages`](#删除本地会话指定时间段的消息) | `EMConversation` | 删除指定时间段内的本地消息。 |
| [`removeMessage`](#删除本地会话的指定消息) | `EMConversation` | 从本地数据库和会话内存缓存中删除指定消息。 |


