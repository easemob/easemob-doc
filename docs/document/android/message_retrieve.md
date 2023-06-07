# 管理服务端的会话和消息

<Toc />

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。本文介绍用户如何获取和删除服务端的会话和消息。

:::tip
本文介绍的功能均为增值服务，需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。
:::

## 技术原理

使用环信即时通讯 IM SDK 可以从服务器获取历史消息。

- `asyncFetchConversationsFromServer` 分页获取服务器保存的会话列表；
- `asyncFetchPinnedConversationsFromServe` 分页获取服务器保存的置顶会话列表；
- `asyncPinConversation` 置顶会话。
- `asyncFetchHistoryMessage` 从服务端分页获取指定会话的历史消息；
- `removeMessagesFromServer` 单向删除服务端的历史消息；
- `deleteConversationFromServer` 删除服务端的会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器分页获取会话列表

对于单聊或群聊，用户发消息时会自动将对方添加到用户的会话列表。

你可以调用 `asyncFetchConversationsFromServer` 方法从服务端分页获取会话列表，每个会话包含最新一条历史消息。

SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表。若会话中没有消息，则 SDK 按照会话创建时间的倒序返回会话列表。

服务器默认存储 100 条会话。若提升该上限，需联系环信商务，最多能增加至 500 条。

:::notice
1. 若使用该功能，需将 SDK 升级至 4.0.3。 
2. 建议你在首次下载、卸载后重装应用等本地数据库无数据情况下拉取服务端会话列表。其他情况下，调用 `getAllConversationsBySort` 或 `getAllConversations` 方法获取本地所有会话即可。
3. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

示例代码如下：

```java
int limit = 10;
String cursor = "";
EMClient.getInstance().chatManager().asyncFetchConversationsFromServer(limit, cursor, new EMValueCallBack<EMCursorResult<EMConversation>>() {
    @Override
    public void onSuccess(EMCursorResult<EMConversation> result) {
        // 获取到的会话列表
        List<EMConversation> conversations = result.getData();
        // 下一次请求的 cursor
        String nextCursor = result.getCursor();
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

## 获取服务端的置顶会话列表

你可以调用 `asyncFetchPinnedConversationsFromServe` 方法从服务端分页获取置顶会话列表。SDK 按照会话置顶时间的倒序返回。 

你最多可以拉取 50 个置顶会话。

:::notice
若使用该功能，需将 SDK 升级至 4.0.3。
:::

示例代码如下： 

```java
int limit = 10;
String cursor = "";
EMClient.getInstance().chatManager().asyncFetchPinnedConversationsFromServer(limit, cursor, new EMValueCallBack<EMCursorResult<EMConversation>>() {
    @Override
    public void onSuccess(EMCursorResult<EMConversation> result) {
        // 获取到的会话列表
        List<EMConversation> conversations = result.getData();
        // 下一次请求的 cursor
        String nextCursor = result.getCursor();
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});

```

### 置顶会话

会话置顶指将单聊或群聊会话固定在会话列表的顶部，方便用户查找。例如，将重点会话置顶，可快速定位会话。

置顶状态会存储在服务器上，多设备登录情况下，更新置顶状态会同步到其他登录设备。你最多可以置顶 50 个会话。

你可以调用 `asyncPinConversation` 方法设置是否置顶会话。多设备登录情况下，会话置顶或取消置顶后，其他登录设备分别会收到 `CONVERSATION_PINNED` 和 `CONVERSATION_UNPINNED` 事件。

:::notice
若使用该功能，需将 SDK 升级至 4.0.3。
:::

示例代码如下： 

```java
EMClient.getInstance().chatManager().asyncPinConversation(conversationId, isPinned, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String error) {

    }
});
```

你可以通过 `EMConversation` 对象的 `isPinned` 字段检查会话是否为置顶状态，或者调用 `getPinnedTime` 方法获取会话置顶时间。

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
若使用该功能，需将 SDK 升级至 V3.9.8 或以上版本并联系商务开通。
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

删除服务端会话及其历史消息，对本地的会话和消息无影响。

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