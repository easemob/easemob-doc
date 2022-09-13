# 创建和管理聊天室以及监听器介绍

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室中的成员没有固定关系，用户离线后，超过 5 分钟会自动退出聊天室。聊天室成员在离线后，不会收到推送消息。聊天室可以应用于直播、消息广播等。

本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理聊天室，并实现聊天室的相关功能。

消息相关内容见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM SDK 提供 `EMChatRoomManager` 类 和 `EMChatRoom` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 创建聊天室
- 从服务器获取聊天室列表
- 加入聊天室
- 获取聊天室详情
- 退出聊天室
- 解散聊天室
- 监听聊天室事件

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 不同版本的聊天室相关数量限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。
- 只有超级管理员才有创建聊天室的权限，因此你还需要确保已调用 RESTful API 添加了超级管理员，详见 [添加聊天室超级管理员](/document/server-side/chatroom.html#添加超级管理员)。
- 聊天室创建者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 创建聊天室

仅 [超级管理员](/document/server-side/chatroom.html#管理超级管理员) 可以调用 `createChatRoom` 方法创建聊天室，并设置聊天室的名称、描述、最大成员数等信息。成功创建聊天室后，该超级管理员为该聊天室的所有者。

你也可以直接调用 REST API [从服务端创建聊天室](/document/server-side/chatroom.html#创建聊天室)。

示例代码如下：

```java
// 异步方法
EMChatRoom  chatRoom = EMClient.getInstance().chatroomManager().createChatRoom(subject, description, welcomMessage, maxUserCount, members);
```

### 加入聊天室

用户申请加入聊天室的步骤如下：

1. 调用 `fetchPublicChatRoomsFromServer` 方法从服务器获取聊天室列表，查询到想要加入的聊天室 ID。
2. 调用 `joinChatRoom` 方法传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室时，其他成员收到 `onMemberJoined` 回调。

示例代码如下：

```java
// 获取公开聊天室列表，每次最多可获取 1,000 个。
EMPageResult<EMChatRoom> chatRooms = EMClient.getInstance().chatroomManager().fetchPublicChatRoomsFromServer(pageNumber, pageSize);

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

### 获取聊天室详情

聊天室所有成员均可调用 `fetchChatRoomFromServer` 获取聊天室的详情，包括聊天室 ID、聊天室名称，聊天室描述、聊天室公告、管理员列表、最大成员数、聊天室所有者、是否全员禁言以及聊天室角色类型。成员列表、黑名单列表、禁言列表需单独调用接口获取。

示例代码如下：

```java
// 异步方法
EMChatRoom chatRoom = EMClient.getInstance().chatroomManager().fetchChatRoomFromServer(chatRoomId);
```

### 退出聊天室

聊天室所有成员均可以调用 `leaveChatRoom` 方法退出当前聊天室。成员退出聊天室时，其他成员收到 `onMemberExited` 回调。

示例代码如下：

```java
EMClient.getInstance().chatroomManager().leaveChatRoom(chatRoomId);
```

退出聊天室时，SDK 默认删除该聊天室所有本地消息，若要保留这些消息，可在 SDK 初始化时将 `EMOptions#setDeleteMessagesAsExitChatRoom` 设置为 `false`。

示例代码如下：

```java
EMOptions options = new EMOptions();
options.setDeleteMessagesAsExitChatRoom(false);
```

与群主无法退出群组不同，聊天室所有者可以离开聊天室，例如所有者从服务器下线则 5 分钟后自动离开聊天室。如果所有者重新进入聊天室仍是该聊天室的所有者。

### 解散聊天室

仅聊天室所有者可以调用 `destroyChatRoom` 方法解散聊天室。聊天室解散时，其他成员收到 `onChatRoomDestroyed` 回调并被踢出聊天室。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().chatroomManager().destroyChatRoom(chatRoomId);
```

### 监听聊天室事件

`EMChatRoomChangeListener` 类中提供了聊天室事件的监听接口。你可以通过注册聊天室监听器，获取聊天室事件，并作出相应处理。如不再使用该监听器，需要移除，防止出现内存泄露。

示例代码如下：


```java
// 注册聊天室回调
EMClient.getInstance().chatroomManager().addChatRoomChangeListener(chatRoomChangeListener);
// 移除聊天室回调
EMClient.getInstance().chatroomManager().removeChatRoomListener(chatRoomChangeListener);
```

具体事件如下：


```java
public interface EMChatRoomChangeListener {
    // 聊天室被解散。聊天室的所有成员会收到该事件。
    void onChatRoomDestroyed(final String roomId, final String roomName);

    // 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件。
    void onMemberJoined(final String roomId, final String participant);

    // 有成员主动退出聊天室。聊天室的所有成员（除退出的成员）会收到该事件。
    void onMemberExited(final String roomId, final String roomName, final String participant);

    /**
     * 有成员被移出聊天室。被移出的成员收到该事件。
     *
     * @param reason        用户被移出聊天室的原因：
     *                        - xxx BE_KICKED：该用户被聊天室管理员移出；
     *                        - xxxBE_LICKED)FOR_OFFLINE：该用户由于当前设备断网被服务器移出聊天室。
     */
    void onRemovedFromChatRoom(final int reason, final String roomId, final String roomName, final String participant);

    // 有成员被加入禁言列表。被添加的成员收到该事件。
    void onMuteListAdded(final String chatRoomId, final List<String> mutes, final long expireTime);

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
    default void onSpecificationChanged(EMChatRoom chatRoom) {
    }
    // 聊天室公告变更。聊天室的所有成员会收到该事件。
    void onAnnouncementChanged(String chatRoomId, String announcement);

    // 聊天室自定义属性有更新。聊天室所有成员会收到该事件。
    default void onChatroomAttributesDidChanged(String chatRoomId, Map<String,String> attributeMap , String from){}

    // 有聊天室自定义属性被移除。聊天室所有成员会收到该事件。
    default void onChatroomAttributesDidRemoved(String chatRoomId, Map<String,String> attributeMap , String from){}

}
```

### 更多操作

你可以参考如下文档，在项目中实现更多的聊天室相关功能：

- [聊天室概述](room_overview.html)
- [管理聊天室成员](room_members.html)
- [管理聊天室属性](room_attributes.html)