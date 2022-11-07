# 管理服务端的会话和消息

<Toc />

本文介绍用户如何获取和删除服务端的消息。从消息服务器获取会话和消息也称为消息漫游，指即时通讯服务将用户的历史消息保存在消息服务器上，用户即使切换终端设备，也能从服务器获取到单聊、群聊的历史消息，保持一致的会话场景。

## 技术原理

使用环信即时通讯 IM SDK 可以从服务器获取历史消息。

- `asyncFetchConversationsFromServer` 获取服务器保存的会话列表；
- `fetchHistoryMessages` 获取服务器保存的指定会话中的消息；
- `removeMessagesFromServer` 单向删除服务端的历史消息；
- `deleteConversationFromServer` 删除服务端的会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取会话

该功能需联系商务开通，开通后，用户默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量或时间限制请联系商务。

调用 `asyncFetchConversationsFromServer` 从服务端获取会话。我们建议在 app 安装时，或本地没有会话时调用该 API。否则调用 `LoadAllConversations` 即可。示例代码如下：

```java
// 异步方法。同步方法见 {@link #fetchConversationsFromServer()}。
EMClient.getInstance().chatManager().asyncFetchConversationsFromServer(new EMValueCallBack<Map<String, EMConversation>>() {
    //获取会话成功后的处理逻辑。
    @Override
    public void onSuccess(Map<String, EMConversation> value) {
    }
    //获取会话失败处理逻辑。
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### 分页获取指定会话的历史消息

从服务器分页获取指定会话的历史消息（消息漫游）。你可以指定消息查询方向，即明确按时间顺序或逆序获取。建议每次获取少于 50 条消息，可多次获取。拉取后默认 SDK 会自动将消息更新到本地数据库。

```java
// 异步方法。同步方法见 {@link #fetchHistoryMessages(String, EMConversationType, int, String, EMConversation.EMSearchDirection)}。
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

你可以调用 `removeMessagesFromServer` 方法单向删除服务端的历史消息。每次最多可删除 50 条消息。消息删除后，该用户无法从服务端拉取到该消息。其他用户不受该操作影响。

登录该账号的其他设备会收到 `EMMultiDeviceListener` 中的 `onMessageRemoved` 回调，已删除的消息自动从设备本地移除。

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