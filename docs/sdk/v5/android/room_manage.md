# Create and Manage Chat Rooms

## Feature overview

A chat room is an instant messaging use case that supports real-time interaction among a large number of users. It is commonly used for live streaming interactions, message broadcasting, open discussions, and other scenarios. Chat room members do not have fixed relationships and generally do not continue receiving chat room messages after going offline. Except for members on the chat room allowlist, regular members automatically leave the chat room after being offline for approximately 2 minutes. To adjust the automatic exit period, contact your EasyIM business manager.

The following table describes chat room member roles:

| Member role | Description | Management permissions |
| :--- | :--- | :--- |
| Regular member | A user who participates in interactions after joining the chat room. | Can send and receive chat room messages, retrieve chat room details and the member list, and perform other operations. |
| Chat room admin | Appointed by the chat room owner to help manage the chat room. | Can remove members, manage the mute list, allowlist, blocklist, and chat room announcement, and perform other management operations. |
| Chat room owner | The chat room creator or a user to whom ownership is transferred. | Has the highest management permissions in the chat room and can destroy the chat room, add or remove admins, modify chat room information, and perform other management operations. |

This document describes how to create, destroy, join, leave, and manage chat rooms and monitor chat room events. For information about sending, receiving, and managing chat room messages, see [Message management](message_overview.html).

:::tip
The combined number of the chat room owner and admins cannot exceed 100, meaning that up to 99 admins can be added.
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Complete SDK initialization. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM [limitations](/product/limitation.html).
- Understand the limits on the number of chat rooms for different EasyIM plans. For details, see [EasyIM pricing](https://www.easemob.com/pricing/im).
- Only a superadmin can create chat rooms. Therefore, ensure that you have called a RESTful API to add a superadmin. For details, see [Add a chat room superadmin](/rest/chatroom_superadmin_add.html).

## Create a chat room

To create a chat room, call the server-side REST API for [creating a chat room](/rest/chatroom_create.html). After the chat room is created, the client can [join it](#join-a-chat-room) or [retrieve its details](room_attributes.html#retrieve-chat-room-details).

## Destroy a chat room

To destroy a chat room, call the server-side REST API for [destroying a chat room](/rest/chatroom_delete.html). After the chat room is destroyed, the other online members receive the `onChatRoomDestroyed` event and are removed from the chat room.

## Join a chat room

To join a chat room, follow these steps:

1. Call the `asyncFetchPublicChatRoomsFromServer` method to retrieve the chat room list from the server and find the ID of the chat room you want to join.
2. Call the `joinChatRoom` method and pass the chat room ID to apply to join the chat room. When a new member joins, the other members receive the `onMemberJoined` callback.

Example code:

```java
// Retrieve the app's chat room list.
// pageNum: Current page number, starting from 1.
// pageSize: Expected number of records returned per page. The value range is [1,1000].
EMClient.getInstance().chatroomManager().asyncFetchPublicChatRoomsFromServer(
        pageNumber, pageSize, new EMValueCallBack<EMPageResult<EMChatRoom>>() {
            @Override
            public void onSuccess(EMPageResult<EMChatRoom> value) {
                // The chat room list is retrieved successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to retrieve the chat room list.
            }
        });

// Join the chat room
EMClient.getInstance().chatroomManager().joinChatRoom(chatRoomId, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

You can also call the `EMChatRoomManager#joinChatRoom(java.lang.String, boolean, java.lang.String, EMValueCallBack<EMChatRoom>)` method to include extension information when joining a chat room and specify whether to leave all other chat rooms. After this method is called, other members in the chat room receive the `EMChatRoomChangeListener#onMemberJoined(java.lang.String, java.lang.String, java.lang.String)` callback. If the user includes extension information when joining the chat room, the other members can obtain it from the callback.

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

## Leave a chat room

### Leave voluntarily

All chat room members can call the `leaveChatRoom` method to leave the current chat room. When a member leaves, the other members receive the `onMemberExited` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().leaveChatRoom(chatRoomId);
```

When a user leaves a chat room, the SDK deletes all local messages in the chat room by default. To retain these messages, set `EMOptions#setDeleteMessagesAsExitChatRoom` to `false` during SDK initialization.

Example code:

```java
EMOptions options = new EMOptions();
options.setDeleteMessagesAsExitChatRoom(false);
```

Unlike a chat group owner, who cannot leave a chat group, a chat room owner can leave the chat room and remains its owner after rejoining. If the `EMOptions#allowChatroomOwnerLeave` parameter is set to `true` during initialization, the chat room owner can leave the chat room. If this parameter is set to `false`, calling the `leaveChatRoom` method as the chat room owner reports error 706 `CHATROOM_OWNER_NOT_ALLOW_LEAVE`.

### Be removed

Only the chat room owner and admins can call the `EMChatRoomManager#asyncRemoveChatRoomMembers` method to remove one or more members from a chat room.

After being removed, the member receives the `onRemovedFromChatRoom` callback, while the other members receive the `EMChatRoomChangeListener#onMemberExited` callback.

A removed member can rejoin the chat room.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomMembers(
        chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // The member is removed successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to remove the member.
            }
        });
```

### Automatically leave after going offline

A chat room member who remains offline for more than 2 minutes because of network or other issues automatically leaves the chat room. To adjust this period, contact the EasyIM business manager.

The following types of members do not leave the chat room even when offline:

- Members on the chat room allowlist, to which the chat room owner and admins are added by default.
- Users who were added when the chat room was [created by calling a RESTful API](/rest/chatroom_create.html) and have never logged in.

If multi-device login for chat rooms is enabled, a member on the chat room allowlist cannot receive chat room messages on a device after that device reconnects from an offline state. To receive chat room messages on the device, the user must manually call the API to join the chat room after login.

## Retrieve the chat room list

You can call the `asyncFetchPublicChatRoomsFromServer` method to retrieve the chat room list by page.

This API retrieves the list of chat rooms in the current app, not only those joined by the current user. To retrieve details of a locally joined chat room, use `EMChatRoomManager#getChatRoom`. To retrieve the list of chat rooms joined by the current user, the app must maintain the list locally in its business logic.

```java
// Asynchronous method.
// pageSize: Expected number of chat rooms returned per page. The value range is [1, 1000].
EMClient.getInstance().chatroomManager().asyncFetchPublicChatRoomsFromServer(
        pageNum, pageSize, new EMValueCallBack<EMPageResult<EMChatRoom>>() {
            @Override
            public void onSuccess(EMPageResult<EMChatRoom> result) {
                // Obtain the chat room list on the current page through result.getData().
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to retrieve the chat room list.
            }
        });
```

The main fields in the returned `EMPageResult<EMChatRoom>` are as follows:

| Field             | Type               | Description                                                         |
| ---------------- | ------------------ | ------------------------------------------------------------ |
| `getData()`      | `List<EMChatRoom>` | Chat room list on the current page.                                         |
| `getPageCount()` | `int`              | Number of chat rooms available on the next page. If this value is less than the `pageSize` passed in the request, the server has no more chat room data. |

The `getData()` method returns `EMChatRoom` objects, from which you can read the following main fields:

| Field                   | Type     | Description                           |
| ---------------------- | -------- | ------------------------------ |
| `getId()`              | `String` | Chat room ID.                    |
| `getName()`            | `String` | Chat room name.                   |
| `getDescription()`     | `String` | Chat room description.                   |
| `getOwner()`           | `String` | User ID of the chat room owner.        |
| `getMemberCount()`     | `int`    | Current number of online chat room members.         |
| `getCreateTimestamp()` | `long`   | Chat room creation timestamp, in milliseconds. |

## Monitor chat room events

The `EMChatRoomChangeListener` class provides APIs for monitoring chat room events. You can register a chat room listener to receive and process these events. Remove the listener when you no longer use it to prevent memory leaks.

Example code:


```java
// Register a chat room callback
EMClient.getInstance().chatroomManager().addChatRoomChangeListener(chatRoomChangeListener);
// Remove a chat room callback
EMClient.getInstance().chatroomManager().removeChatRoomChangeListener(chatRoomChangeListener);
```

The following events are available:

```java
public interface EMChatRoomChangeListener {
    // The chat room is destroyed. All chat room members receive this event.
    void onChatRoomDestroyed(final String roomId, final String roomName);

    // A user joins the chat room. All chat room members except the new member receive this event.
    void onMemberJoined(final String roomId, final String participant, final String ext);

    // A member leaves voluntarily or is removed. All chat room members except the member who leaves receive this event.
    void onMemberExited(final String roomId, final String roomName, final String participant);

    /**
     * A member is removed from the chat room. The removed member receives this event.
     *
     * @param reason        Reason why the user is removed from the chat room:
     *                        - xxx BE_KICKED: The user is removed by a chat room admin;
     *                        - xxx BE_KICKED_FOR_OFFLINE: The user is removed from the chat room by the server because the current device is disconnected from the network.
     */
    void onRemovedFromChatRoom(final int reason, final String roomId, final String roomName, final String participant);

    // A member is added to the mute list. The added member receives this event.
    void onMuteListAdded(final String chatRoomId, Map<String,Long> muteInfo);

    // A member is removed from the mute list. The unmuted member receives this event.
    void onMuteListRemoved(final String chatRoomId, final List<String> mutes);

    // A member is added to the allowlist. The added member receives this event.
    void onWhiteListAdded(final String chatRoomId, final List<String> whitelist);

    // A member is removed from the allowlist. The removed member receives this event.
    void onWhiteListRemoved(final String chatRoomId, final List<String> whitelist);

    // The state for muting all members changes. All chat room members receive this event.
    void onAllMemberMuteStateChanged(final String chatRoomId, final boolean isMuted);

    // A member is appointed as an admin. The new admin receives this event.
    void onAdminAdded(final String chatRoomId, final String admin);

    // A member's admin permissions are revoked. The removed admin receives this event.
    void onAdminRemoved(final String chatRoomId, final String admin);

    // The chat room owner changes. All chat room members receive this event.
    void onOwnerChanged(final String chatRoomId, final String newOwner, final String oldOwner);

    // The chat room details change. All chat room members receive this event.
    default void onSpecificationChanged(EMChatRoom chatRoom) {}
    // The chat room announcement changes. All chat room members receive this event.
    void onAnnouncementChanged(String chatRoomId, String announcement);

    // Chat room custom attributes are updated. All chat room members receive this event.
    default void onAttributesUpdate(String chatRoomId, Map<String, String> attributeMap, String from) {}

    // Chat room custom attributes are removed. All chat room members receive this event.
    default void onAttributesRemoved(String chatRoomId, List<String> keyList , String from){}

}
```

## Update the chat room member count in real time

If members frequently join or leave a chat room within a short period, update the chat room member count in real time as follows:

1. When a member joins the chat room, the other members receive the `onMemberJoined` event. When a member leaves voluntarily or is removed, the other members receive the `onMemberExited` and `onRemovedFromChatRoom` events.

2. After receiving an event notification, call the `EMChatRoomManager#getChatRoom` method to retrieve the local chat room details, and then call `EMChatRoom#getMemberCount` to retrieve the current member count.

```java
EMClient.getInstance().chatroomManager().addChatRoomChangeListener(new EMChatRoomChangeListener() {

            @Override
            public void onMemberJoined(String roomId, String participant, String ext) {
                //Obtain the number of online chat room members
                int memberCount = EMClient.getInstance().chatroomManager().getChatRoom(roomId).getMemberCount();

            }

            @Override
            public void onMemberExited(String roomId, String roomName, String participant) {
                //int memberCount = EMClient.getInstance().chatroomManager().getChatRoom(roomId).getMemberCount();
            }

            ……
        });

```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncFetchPublicChatRoomsFromServer`](#retrieve-the-chat-room-list) | `EMChatRoomManager` | Retrieve the list of chat rooms in the app. |
| [`joinChatRoom`](#join-a-chat-room) | `EMChatRoomManager` | Join a chat room. |
| [`leaveChatRoom`](#leave-voluntarily) | `EMChatRoomManager` | Leave a chat room voluntarily. |
| [`asyncRemoveChatRoomMembers`](#be-removed) | `EMChatRoomManager` | Remove members from a chat room. |
| [`getChatRoom`](#update-the-chat-room-member-count-in-real-time) | `EMChatRoomManager` | Retrieve local chat room details. |

