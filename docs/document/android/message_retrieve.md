# 管理服务端的会话和消息

<Toc />

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。本文介绍用户如何获取和删除服务端的会话和消息。

:::tip
本文介绍的功能均为增值服务，需联系商务开通。
:::

## 技术原理

使用环信即时通讯 IM SDK 可以从服务器获取历史消息。

- `asyncFetchConversationsFromServer` 分页获取服务器保存的会话列表；
- `fetchHistoryMessages` 获取服务器保存的指定会话中的消息；
- `removeMessagesFromServer` 单向删除服务端的历史消息；
- `deleteConversationFromServer` 删除服务端的会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器分页获取会话列表

对于单聊或群聊，用户发消息时会自动将对方添加到用户的会话列表。

你可以调用 `asyncFetchConversationsFromServer` 方法从服务端分页获取会话列表，每个会话包含最新一条历史消息。该功能需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。

:::tip
1. 建议在 app 安装时或本地没有会话时调用该方法，否则调用 `getAllConversations` 方法即可。
2. 获取的会话列表中不包含最新一条消息通过 RESTful 接口发送的会话。若需获取该类会话，需要联系商务开通将通过 RESTful 接口发送的消息写入会话列表的功能。
:::

示例代码如下：

```java
// 异步方法。同步方法为 fetchConversationsFromServer()。
// pageNum：当前页面，从 1 开始。
// pageSize：每页获取的会话数量。取值范围为 [1,20]。
EMClient.getInstance().chatManager().asyncFetchConversationsFromServer(pageNum, pageSize, new EMValueCallBack<Map<String, EMConversation>>() {
    @Override
    public void onSuccess(Map<String, EMConversation> value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

对于使用 `asyncFetchConversationsFromServer` 方法未实现分页获取会话列表的用户，SDK 默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量或时间限制请联系商务。

### 分页获取指定会话的历史消息

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。

你可以调用 `asyncFetchHistoryMessage` 方法从服务器获取指定会话的消息（消息漫游）。你可以指定消息查询方向，即明确按时间顺序或逆序获取。为确保数据可靠，我们建议你每次最多获取 50 条消息，可多次获取。拉取后，SDK 会自动将消息更新到本地数据库。

```java
// 异步方法。同步方法为 fetchHistoryMessages(String, EMConversationType, int, String, EMConversation.EMSearchDirection)。
EMClient.getInstance().chatManager().asyncFetchHistoryMessage(
    conversationId,
    conversationType,
    pageSize,
    startMsgId,
    searchDirection,
    new EMValueCallBack<EMCursorResult<EMMessage>>() {
        @Override
        public void onSuccess(EMCursorResult<EMMessage> value) {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
    }
);
```

### 单向删除服务端的历史消息

你可以调用 `removeMessagesFromServer` 方法单向删除服务端的历史消息，每次最多可删除 50 条消息。消息删除后，该用户无法从服务端拉取到该消息。其他用户不受该操作影响。登录该账号的其他设备会收到 `EMMultiDeviceListener` 中的 `onMessageRemoved` 回调，已删除的消息自动从设备本地移除。

:::tip
若使用该功能，需将 SDK 升级至 V3.9.8 或以上版本。
:::

示例代码如下：

```java 
// 按时间删除消息
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
conversation.removeMessagesFromServer(time, new EMCallBack() {
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
### 删除服务端会话及其历史消息

你可以调用 `deleteConversationFromServer` 方法删除服务器端会话和历史消息。会话删除后，当前用户和其他用户均无法从服务器获取该会话。若该会话的历史消息也删除，所有用户均无法从服务器获取该会话的消息。

调用该方法之前，需调用 `getConversation` 方法获取会话 ID。

示例代码如下：

```java
//获取指定的会话 ID。
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);

// 删除指定会话。如果需要保留历史消息，`isDeleteServerMessages` 传 `false`。
EMClient.getInstance().chatManager().deleteConversationFromServer(conversationId, conversationType, isDeleteServerMessages, new EMCallBack() {
    @Override
    public void onSuccess() {

    }

    @Override
    public void onError(int code, String error) {

    }
});
```