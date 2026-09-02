# Manage Chat Room Members

## Feature overview

A chat room is an instant messaging system that supports multi-user communication and is suitable for live streaming interactions, open discussions, message broadcasting, and other real-time multi-user scenarios. This document describes how to use the SDK to manage chat room members, including querying the member list and managing admins, the allowlist, blocklist, and mute list.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Complete SDK initialization. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM [limitations](/product/limitation.html).
- Understand the EasyIM chat room limitations. For details, see [EasyIM pricing](http://easyim.ai/pricing).

## Retrieve the chat room member list

All chat room members can call the `asyncFetchChatRoomMembers` method to retrieve the current chat room member list. The server does not sort members, so the returned member list is not guaranteed to be ordered.

Example code:

```java
// Asynchronous method.
// cursor: Position from which to start retrieving data. Pass an empty value on the first call to retrieve the latest data.
// pageSize: Expected number of members returned per page. The maximum value is 1,000.
EMClient.getInstance().chatroomManager().asyncFetchChatRoomMembers(
        chatRoomId, cursor, pageSize, new EMValueCallBack<EMCursorResult<String>>() {
            @Override
            public void onSuccess(EMCursorResult<String> value) {
                // The member list is retrieved successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to retrieve the member list.
            }
        });
```

## Manage the chat room blocklist

### Add members to the chat room blocklist

Only the chat room owner and admins can call the `EMChatRoomManager#asyncBlockChatroomMembers` method to add specified members to the blocklist.

After being added to the blocklist, a member receives the `EMChatRoomChangeListener#onRemovedFromChatRoom` callback. By default, the other members do not receive an event notification. To enable this event, contact the EasyIM business manager.

After being added to the blocklist, a member can no longer send or receive chat room messages and is removed from the chat room. Before the member can rejoin, the chat room owner or an admin must remove the member from the blocklist.

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncBlockChatroomMembers(
        chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // The members are added to the blocklist successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to add the members to the blocklist.
            }
        });
```

### Remove members from the chat room blocklist

Only the chat room owner and admins can call the `EMChatRoomManager#asyncUnBlockChatRoomMembers` method to remove members from the chat room blocklist.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncUnBlockChatRoomMembers(
        chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // The members are removed from the blocklist successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to remove the members from the blocklist.
            }
        });
```

### Retrieve the chat room blocklist

Only the chat room owner and admins can call the `EMChatRoomManager#asyncFetchChatRoomBlackList` method to retrieve the current chat room blocklist.

Example code:

```java
// Asynchronous method.
// pageNum	Current page number, starting from 1.
// pageSize	Expected number of blocked members returned per page. The value range is [1,50].
EMClient.getInstance().chatroomManager().asyncFetchChatRoomBlackList(
        chatRoomId, pageNum, pageSize, new EMValueCallBack<List<String>>() {
            @Override
            public void onSuccess(List<String> value) {
                // The blocklist is retrieved successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to retrieve the blocklist.
            }
        });
```

## Manage the chat room allowlist

The chat room owner and admins are added to the chat room allowlist by default.

Messages sent in a chat room by members on the allowlist have a high priority and are delivered first, but delivery is not guaranteed. Under high load, the server discards low-priority messages first. If the load remains high, the server also discards high-priority messages.

### Retrieve the chat room allowlist

Only the chat room owner and admins can call `fetchChatRoomWhiteList` to retrieve the current chat room allowlist.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().fetchChatRoomWhiteList(chatRoomId, new EMValueCallBack<List<String>>() {
    @Override
    public void onSuccess(List<String> value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### Check whether the current user is on the chat room allowlist

All chat room members can call the `checkIfInChatRoomWhiteList` method to check whether they are on the chat room allowlist, as shown in the following example:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().checkIfInChatRoomWhiteList(chatRoomId, new EMValueCallBack<Boolean>() {
    @Override
    public void onSuccess(Boolean value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### Add members to the chat room allowlist

Only the chat room owner and admins can call `addToChatRoomWhiteList` to add members to the chat room allowlist. An added member receives the `onWhiteListAdded` event.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().addToChatRoomWhiteList(chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### Remove members from the chat room allowlist

Only the chat room owner and admins can call `removeFromChatRoomWhiteList` to remove members from the chat room allowlist. A removed member receives the `onWhiteListRemoved` event.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().removeFromChatRoomWhiteList(chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

## Manage the chat room mute list

### Add members to the chat room mute list

Only the chat room owner and admins can call the `EMChatRoomManager#asyncMuteChatRoomMembers` method to add specified members to the chat room mute list. The muted members receive the `EMChatRoomChangeListener#onMuteListAdded` callback. All chat room admins and the owner also receive it, except for the operator.

:::tip
The chat room owner can mute any chat room member, while chat room admins can mute regular members.
:::

Example code:

```java
// Asynchronous method.
// `duration`: Mute duration. Pass -1 to mute permanently.
EMClient.getInstance().chatroomManager().asyncMuteChatRoomMembers(
        chatRoomId, members, duration, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // The members are muted successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to mute the members.
            }
        });
```

### Remove members from the chat room mute list

Only the chat room owner and admins can call the `EMChatRoomManager#asyncUnMuteChatRoomMembers` method to remove members from the chat room mute list. The unmuted members receive the `EMChatRoomChangeListener#onMuteListRemoved` callback. All chat room admins and the owner also receive it, except for the operator.

:::tip
The chat room owner can unmute any chat room member, while chat room admins can unmute regular members.
:::

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncUnMuteChatRoomMembers(
        chatRoomId, members, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // The members are unmuted successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to unmute the members.
            }
        });
```

### Retrieve the chat room mute list

Only the chat room owner and admins can call `asyncFetchChatRoomMuteList` to retrieve the chat room mute list.

Example code:

```java
// Asynchronous method.
// pageNum	Current page number, starting from 1.
// pageSize	Expected number of muted members returned per page. The value range is [1,50].
EMClient.getInstance().chatroomManager().asyncFetchChatRoomMuteList(
        chatRoomId, pageNum, pageSize, new EMValueCallBack<Map<String, Long>>() {
            @Override
            public void onSuccess(Map<String, Long> value) {
                // The mute list is retrieved successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to retrieve the mute list.
            }
        });
```

### Check whether the current user is on the chat room mute list

Chat room members can call the `asyncCheckIfInMuteList` method to check whether they are on the chat room mute list.

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncCheckIfInMuteList(chatRoomId, new EMValueCallBack<Boolean>() {
            @Override
            public void onSuccess(Boolean inMuteList) {
                if(inMuteList) {
                    EMLog.d( TAG,"you are in the mutelist of chatroom");
                }else{
                    EMLog.d( TAG,"you are not in the mutelist of chatroom");
                }

            }

            @Override
            public void onError(int error, String errorMsg) {
                EMLog.d( TAG,"asyncCheckIfInMuteList error:"+error+" errorMsg:"+errorMsg);
            }
        });
```

## Mute and unmute all chat room members

To efficiently manage chat room messaging, the chat room owner and admins can mute or unmute all members. Muting all members does not conflict with muting individual members. Muting or unmuting all members does not change the existing mute list.

### Mute all members

Only the chat room owner and admins can call the `EMChatRoomManager#muteAllMembers` method to mute all members. This setting is not disabled automatically after any period. You must call the `EMChatRoomManager#unmuteAllMembers` method to unmute all members.

After all members are muted, only members on the allowlist can send messages. When the call succeeds, chat room members receive the `EMChatRoomChangeListener#onAllMemberMuteStateChanged` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().muteAllMembers(chatRoomId, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### Unmute all members

Only the chat room owner and admins can call the `EMChatRoomManager#unmuteAllMembers` method to unmute all members. When the call succeeds, chat room members receive the `EMChatRoomChangeListener#onAllMemberMuteStateChanged` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().unmuteAllMembers(chatRoomId, new EMValueCallBack<EMChatRoom>() {
    @Override
    public void onSuccess(EMChatRoom value) {
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## Manage the chat room owner and admins

The combined number of the chat room owner and admins cannot exceed 100, meaning that up to 99 admins can be added.

### Transfer chat room ownership

Only the chat room owner can call the `EMChatRoomManager#asyncChangeOwner` method to transfer ownership to a specified chat room member. After ownership is transferred successfully, the original owner becomes a chat room member, and the new owner and chat room admins receive the `EMChatRoomChangeListener#onOwnerChanged` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncChangeOwner(
        chatRoomId, newOwner, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // Chat room ownership is transferred successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to transfer chat room ownership.
            }
        });
```

### Add a chat room admin

Only the chat room owner can call the `EMChatRoomManager#asyncAddChatRoomAdmin` method to add a chat room admin. After the admin is added successfully, the new admin and the other admins receive the `EMChatRoomChangeListener#onAdminAdded` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncAddChatRoomAdmin(
        chatRoomId, admin, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // The admin is added successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to add the admin.
            }
        });
```

### Remove a chat room admin

Only the chat room owner can call the `EMChatRoomManager#asyncRemoveChatRoomAdmin` method to remove a chat room admin. After the admin is removed successfully, the removed admin and the other admins receive the `EMChatRoomChangeListener#onAdminRemoved` callback.

Example code:

```java
// Asynchronous method.
EMClient.getInstance().chatroomManager().asyncRemoveChatRoomAdmin(
        chatRoomId, admin, new EMValueCallBack<EMChatRoom>() {
            @Override
            public void onSuccess(EMChatRoom value) {
                // The admin is removed successfully.
            }

            @Override
            public void onError(int error, String errorMsg) {
                // Failed to remove the admin.
            }
        });
```

## Monitor chat room events

For details, see [Monitor chat room events](room_manage.html#monitor-chat-room-events).

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncFetchChatRoomMembers`](#retrieve-the-chat-room-member-list) | `EMChatRoomManager` | Asynchronously retrieve the chat room member list by page. |
| [`asyncBlockChatroomMembers`](#add-members-to-the-chat-room-blocklist) | `EMChatRoomManager` | Asynchronously add members to the chat room blocklist. |
| [`asyncUnBlockChatRoomMembers`](#remove-members-from-the-chat-room-blocklist) | `EMChatRoomManager` | Asynchronously remove members from the chat room blocklist. |
| [`asyncFetchChatRoomBlackList`](#retrieve-the-chat-room-blocklist) | `EMChatRoomManager` | Asynchronously retrieve the chat room blocklist. |
| [`fetchChatRoomWhiteList`](#retrieve-the-chat-room-allowlist) | `EMChatRoomManager` | Retrieve the chat room allowlist. |
| [`checkIfInChatRoomWhiteList`](#check-whether-the-current-user-is-on-the-chat-room-allowlist) | `EMChatRoomManager` | Check whether the current user is on the allowlist. |
| [`addToChatRoomWhiteList`](#add-members-to-the-chat-room-allowlist) | `EMChatRoomManager` | Add members to the allowlist. |
| [`removeFromChatRoomWhiteList`](#remove-members-from-the-chat-room-allowlist) | `EMChatRoomManager` | Remove members from the allowlist. |
| [`asyncMuteChatRoomMembers`](#add-members-to-the-chat-room-mute-list) | `EMChatRoomManager` | Asynchronously add members to the mute list. |
| [`asyncUnMuteChatRoomMembers`](#remove-members-from-the-chat-room-mute-list) | `EMChatRoomManager` | Asynchronously remove members from the mute list. |
| [`asyncFetchChatRoomMuteList`](#retrieve-the-chat-room-mute-list) | `EMChatRoomManager` | Asynchronously retrieve the mute list. |
| [`asyncCheckIfInMuteList`](#check-whether-the-current-user-is-on-the-chat-room-mute-list) | `EMChatRoomManager` | Check whether the current user is on the mute list. |
| [`muteAllMembers`](#mute-all-members) | `EMChatRoomManager` | Mute all chat room members. |
| [`unmuteAllMembers`](#unmute-all-members) | `EMChatRoomManager` | Unmute all chat room members. |
| [`asyncChangeOwner`](#transfer-chat-room-ownership) | `EMChatRoomManager` | Asynchronously transfer chat room ownership. |
| [`asyncAddChatRoomAdmin`](#add-a-chat-room-admin) | `EMChatRoomManager` | Asynchronously add a chat room admin. |
| [`asyncRemoveChatRoomAdmin`](#remove-a-chat-room-admin) | `EMChatRoomManager` | Asynchronously remove a chat room admin. |
