# 创建和管理聊天室

## 功能说明

聊天室是支持大量用户实时互动的即时通讯场景，常用于直播互动、消息广播和开放讨论等业务。聊天室成员没有固定关系，用户离线后通常不会继续接收聊天室消息；除聊天室白名单成员外，普通成员离线超过约 2 分钟会自动退出聊天室。如需调整自动退出时间，请联系环信商务经理。

聊天室成员角色如下表所示：

| 成员角色 | 描述 | 管理权限 |
| :--- | :--- | :--- |
| 普通成员 | 加入聊天室后参与互动的用户。 | 可以发送和接收聊天室消息、获取聊天室详情和成员列表等。 |
| 聊天室管理员 | 由聊天室所有者设置，协助管理聊天室。 | 可以移除成员、管理禁言列表、白名单、黑名单和聊天室公告等。 |
| 聊天室所有者 | 聊天室创建者或被转让所有权的用户。 | 拥有聊天室最高管理权限，可解散聊天室、添加或移除管理员、修改聊天室信息等。 |

本文介绍如何创建、解散、加入、退出和管理聊天室，并监听聊天室相关事件。聊天室消息的发送、接收和管理，参见 [消息管理](message_overview.html)。

:::tip
聊天室所有者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。
:::

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 不同版本的聊天室相关数量限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。
- 只有超级管理员才有创建聊天室的权限，因此你还需要确保已调用 RESTful API 添加了超级管理员，详见 [添加聊天室超级管理员](/document/server-side/chatroom_superadmin_add.html)。

## 创建聊天室

创建聊天室需调用服务端 REST API [从服务端创建聊天室](/document/server-side/chatroom_create.html)。创建成功后，客户端可以 [加入该聊天室](#加入聊天室)，也可以 [获取聊天室详情](room_attributes.html#获取聊天室详情)。

## 解散聊天室

解散聊天室需调用服务端 REST API [解散聊天室](/document/server-side/chatroom_delete.html)。聊天室解散后，聊天室内其他在线成员会收到 `onChatRoomDestroyed` 事件，并被移出该聊天室。

## 加入聊天室

用户申请加入聊天室的步骤如下：

1. 调用 `asyncFetchPublicChatRoomsFromServer` 方法从服务器获取聊天室列表，查询到想要加入的聊天室 ID。
2. 调用 `joinChatRoom` 方法传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室时，其他成员收到 `onMemberJoined` 回调。

示例代码如下：

```java
// 获取应用的聊天室列表。
// pageNum：当前页码，从 1 开始。
// pageSize：每页期望返回的记录数。取值范围为 [1,1000]。
EMClient.getInstance().chatroomManager().asyncFetchPublicChatRoomsFromServer(
        pageNumber, pageSize, new EMValueCallBack<EMPageResult<EMChatRoom>>() {
            @Override
            public void onSuccess(EMPageResult<EMChatRoom> value) {
                // 获取聊天室列表成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 获取聊天室列表失败。
            }
        });

// 加入聊天室
EMClient.getInstance().chatroomManager().joinChatRoom(chatRoomId, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

同时，你可以调用 `EMChatRoomManager#joinChatRoom(java.lang.String, boolean, java.lang.String, EMValueCallBack<EMChatRoom>)` 方法，设置加入聊天室时携带的扩展信息，并指定是否退出所有其他聊天室。调用该方法后，聊天室内其他成员会收到 `EMChatRoomChangeListener#onMemberJoined(java.lang.String, java.lang.String, java.lang.String)` 回调，当用户加入聊天室携带了扩展信息时，聊天室内其他人可以在用户加入聊天室的回调中，获取到扩展信息。

```java
String ext= "your ext info";
boolean leaveOtherRooms=true;
EMClient.getInstance().chatroomManager().joinChatRoom(chatRoomID,leaveOtherRooms,ext, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
        EMLog.i(TAG, "joinChatRoom onSuccess value:" + value);
    }

    @Override
    public void onError(int error, String errorMsg) {
        EMLog.i(TAG, "joinChatRoom onError error:" + error + " errorMsg:" + errorMsg);
    }
});

EMChatRoomChangeListener chatRoomChangeListener = new EMChatRoomChangeListener() {
    ……

    @Override
    public void onMemberJoined(String roomId, String participant, String ext) {
        EMLog.e(TAG, "onMemberJoined roomId:" + roomId + " participant:" + participant + " ext:" + ext);
    }
}
EMClient.getInstance().chatroomManager().addChatRoomChangeListener(chatRoomChangeListener);

```

## 退出聊天室

### 主动退出

聊天室所有成员均可以调用 `leaveChatRoom` 方法退出当前聊天室。成员退出聊天室时，其他成员收到 `onMemberExited` 回调。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().leaveChatRoom(chatRoomId);
```

退出聊天室时，SDK 默认删除该聊天室所有本地消息，若要保留这些消息，可在 SDK 初始化时将 `EMOptions#setDeleteMessagesAsExitChatRoom` 设置为 `false`。

示例代码如下：

```java
EMOptions options = new EMOptions();
options.setDeleteMessagesAsExitChatRoom(false);
```

与群主无法退出群组不同，聊天室所有者可以离开聊天室，重新进入聊天室仍是该聊天室的所有者。若 `EMOptions#allowChatroomOwnerLeave` 参数在初始化时设置为 `true` 时，聊天室所有者可以离开聊天室；若该参数设置为 `false`，聊天室所有者调用 `leaveChatRoom` 方法离开聊天室时会提示错误 706 `CHATROOM_OWNER_NOT_ALLOW_LEAVE`。

### 被移出

仅聊天室所有者和管理员可调用 `EMChatRoomManager#asyncRemoveChatRoomMembers` 方法将单个或多个成员移出聊天室。

被移出后，该成员收到 `onRemovedFromChatRoom` 回调，其他成员收到 `EMChatRoomChangeListener#onMemberExited` 回调。

被移出的成员可以重新进入聊天室。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomMembers(
        chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // 成员移出成功。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 成员移出失败。
            }
        });
```

### 离线后自动退出

由于网络等原因，聊天室中的成员离线超过 2 分钟会自动退出聊天室。若需调整该时间，需联系环信商务。

以下两类成员即使离线也不会退出聊天室：

- 聊天室白名单中的成员（聊天室所有者和管理员默认加入白名单）。
- [调用 RESTful API 创建聊天室](/document/server-side/chatroom_create.html) 时拉入的用户从未登录过。

若开启了聊天室多端多设备功能，聊天室白名单中的成员在一台设备上离线重连后，无法收到聊天室的消息。若使该设备收到收到聊天室的消息，需要登录后手动调用 API 加入聊天室。

## 获取聊天室列表

你可以调用 `asyncFetchPublicChatRoomsFromServer` 方法分页获取聊天室列表。

该接口获取当前应用下的聊天室列表，不仅限于当前用户已加入的聊天室。若要获取本地已加入的聊天室详情，可使用 `EMChatRoomManager#getChatRoom`；若要获取当前用户加入的聊天室列表，需要结合业务侧本地维护。

```java
// 异步方法。
// pageSize：每页期望返回的聊天室数量，取值范围为 [1, 1000]。
EMClient.getInstance().chatroomManager().asyncFetchPublicChatRoomsFromServer(
        pageNum, pageSize, new EMValueCallBack<EMPageResult<EMChatRoom>>() {
            @Override
            public void onSuccess(EMPageResult<EMChatRoom> result) {
                // 通过 result.getData() 获取当前页聊天室列表。
            }

            @Override
            public void onError(int error, String errorMsg) {
                // 获取聊天室列表失败。
            }
        });
```

返回结果 `EMPageResult<EMChatRoom>` 的主要字段如下：

| 字段             | 类型               | 描述                                                         |
| ---------------- | ------------------ | ------------------------------------------------------------ |
| `getData()`      | `List<EMChatRoom>` | 当前页的聊天室列表。                                         |
| `getPageCount()` | `int`              | 下一页可获取的聊天室数量。若该值小于请求时传入的 `pageSize`，表示服务端没有更多聊天室数据。 |

`getData()` 返回的每个 `EMChatRoom` 对象可读取以下主要字段：

| 字段                   | 类型     | 描述                           |
| ---------------------- | -------- | ------------------------------ |
| `getId()`              | `String` | 聊天室 ID。                    |
| `getName()`            | `String` | 聊天室名称。                   |
| `getDescription()`     | `String` | 聊天室描述。                   |
| `getOwner()`           | `String` | 聊天室所有者的用户 ID。        |
| `getMemberCount()`     | `int`    | 聊天室当前在线成员数。         |
| `getCreateTimestamp()` | `long`   | 聊天室创建时间戳，单位为毫秒。 |

## 监听聊天室事件

`EMChatRoomChangeListener` 类中提供了聊天室事件的监听接口。你可以通过注册聊天室监听器，获取聊天室事件，并作出相应处理。如不再使用该监听器，需要移除，防止出现内存泄露。

示例代码如下：


```java
// 注册聊天室回调
EMClient.getInstance().chatroomManager().addChatRoomChangeListener(chatRoomChangeListener);
// 移除聊天室回调
EMClient.getInstance().chatroomManager().removeChatRoomChangeListener(chatRoomChangeListener);
```

具体事件如下：

```java
public interface EMChatRoomChangeListener {
    // 聊天室被解散。聊天室的所有成员会收到该事件。
    void onChatRoomDestroyed(final String roomId, final String roomName);

    // 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件。
    void onMemberJoined(final String roomId, final String participant, final String ext);

    // 有成员主动退出或被移出聊天室。聊天室的所有成员（除退出的成员）会收到该事件。
    void onMemberExited(final String roomId, final String roomName, final String participant);

    /**
     * 有成员被移出聊天室。被移出的成员收到该事件。
     *
     * @param reason        用户被移出聊天室的原因：
     *                        - xxx BE_KICKED：该用户被聊天室管理员移出；
     *                        - xxx BE_KICKED_FOR_OFFLINE：该用户由于当前设备断网被服务器移出聊天室。
     */
    void onRemovedFromChatRoom(final int reason, final String roomId, final String roomName, final String participant);

    // 有成员被加入禁言列表。被添加的成员收到该事件。
    void onMuteListAdded(final String chatRoomId, Map<String,Long> muteInfo);

    // 有成员被移出禁言列表。被解除禁言的成员会收到该事件。
    void onMuteListRemoved(final String chatRoomId, final List<String> mutes);

    // 有成员被加入白名单列表。被添加的成员收到该事件。
    void onWhiteListAdded(final String chatRoomId, final List<String> whitelist);

    // 有成员被移出白名单列表。被移出白名单的成员会收到该事件。
    void onWhiteListRemoved(final String chatRoomId, final List<String> whitelist);

    // 全员禁言状态变更。聊天室所有成员会收到该事件。
    void onAllMemberMuteStateChanged(final String chatRoomId, final boolean isMuted);

    // 有成员被设为管理员。被添加的管理员会收到该事件。
    void onAdminAdded(final String chatRoomId, final String admin);

    // 有成员被移除管理员权限。被移除的管理员会收到该事件。
    void onAdminRemoved(final String chatRoomId, final String admin);

    // 聊天室所有者变更。聊天室所有成员会收到该事件。
    void onOwnerChanged(final String chatRoomId, final String newOwner, final String oldOwner);

    // 聊天室详情有变更。聊天室的所有成员会收到该事件。
    default void onSpecificationChanged(EMChatRoom chatRoom) {}
    // 聊天室公告变更。聊天室的所有成员会收到该事件。
    void onAnnouncementChanged(String chatRoomId, String announcement);

    // 聊天室自定义属性有更新。聊天室所有成员会收到该事件。
    default void onAttributesUpdate(String chatRoomId, Map<String, String> attributeMap, String from) {}

    // 有聊天室自定义属性被移除。聊天室所有成员会收到该事件。
    default void onAttributesRemoved(String chatRoomId, List<String> keyList , String from){}

}
```

## 实时更新聊天室成员人数

如果聊天室短时间内有成员频繁加入或退出时，实时更新聊天室成员人数的逻辑如下：

1. 聊天室内有成员加入时，其他成员会收到 `onMemberJoined` 事件。有成员主动或被动退出时，其他成员会收到 `onMemberExited` 和 `onRemovedFromChatRoom` 事件。

2. 收到通知事件后，调用 `EMChatRoomManager#getChatRoom` 方法获取本地聊天室详情，再通过`EMChatRoom#getMemberCount`获取聊天室当前人数。

```java
EMClient.getInstance().chatroomManager().addChatRoomChangeListener(new EMChatRoomChangeListener() {

            @Override
            public void onMemberJoined(String roomId, String participant, String ext) {
                //获取聊天室在线人数
                int memberCount = EMClient.getInstance().chatroomManager().getChatRoom(roomId).getMemberCount();

            }

            @Override
            public void onMemberExited(String roomId, String roomName, String participant) {
                //int memberCount = EMClient.getInstance().chatroomManager().getChatRoom(roomId).getMemberCount();
            }

            ……
        });

```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncFetchPublicChatRoomsFromServer`](#获取聊天室列表) | `EMChatRoomManager` | 获取应用下的聊天室列表。 |
| [`joinChatRoom`](#加入聊天室) | `EMChatRoomManager` | 加入聊天室。 |
| [`leaveChatRoom`](#主动退出) | `EMChatRoomManager` | 主动退出聊天室。 |
| [`asyncRemoveChatRoomMembers`](#被移出) | `EMChatRoomManager` | 将成员移出聊天室。 |
| [`getChatRoom`](#实时更新聊天室成员人数) | `EMChatRoomManager` | 获取本地聊天室详情。 |

