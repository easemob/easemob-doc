# Create and Manage Chat Rooms

## Feature overview

A chat room is an instant messaging system that supports multi-user communication. It is suitable for real-time interaction among large numbers of users in scenarios such as live-streaming interaction, message broadcasting, and open discussions. Chat room members have no fixed relationship with one another and do not receive any chat room messages while offline. Regular members automatically leave a chat room after being offline for approximately 2 minutes, except for allowlisted members and users who were added when the chat room was created through the REST API and have never logged in.

Chat room member roles are described in the following table:

| Member role | Description | Administrative permissions |
| :--- | :--- | :--- |
| Regular member | A user who participates in interactions after joining the chat room. | Can send and receive chat room messages and retrieve chat room details and the member list. |
| Chat room admin | A user appointed by the chat room owner to help manage the chat room. | Can remove members and manage the mute list, allowlist, blocklist, and chat room announcement. |
| Chat room owner | The chat room creator or the user to whom ownership has been transferred. | Has the highest administrative permissions and can destroy the chat room, add or remove admins, and change chat room information. |

This document describes how to create, destroy, join, leave, and manage chat rooms and how to monitor chat room events. To send, receive, and manage chat room messages, see [Message management](message_overview.html).

:::tip
The total number of chat room owners and admins cannot exceed 100. Therefore, you can add up to 99 admins.
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

 - Initialize the SDK and log in.
 - Understand the [usage restrictions](/product/limitation.html) and the limit on the number of chat rooms.

## Create a chat room

To create a chat room, call the server-side REST API described in [Create a chat room on the server](/document/server-side/chatroom_create.html). After the chat room is created, the client can [join the chat room](#join-a-chat-room) or [retrieve its details](room_attributes.html#retrieve-chat-room-details).

## Destroy a chat room

To destroy a chat room, call the server-side REST API described in [Destroy a chat room](/document/server-side/chatroom_delete.html). After the chat room is destroyed, the other online members receive the `didDismissFromChatroom` callback with `reason` set to `EMChatroomBeKickedReasonDestroyed` and are then removed from the chat room.

## Join a chat room

To join a chat room, perform the following steps:

1. Call `getChatroomsFromServerWithPage` to retrieve the chat room list from the server and find the ID of the chat room you want to join.
2. Call `joinChatroom` and pass the chat room ID to join the chat room. When a new member joins, the other members receive the `userDidJoinChatroom` callback.

Example code:

```objectivec
[[EMClient sharedClient].roomManager getChatroomsFromServerWithPage:1
                                                           pageSize:20
                                                         completion:^(EMPageResult<EMChatroom *> *result, EMError *error) {
    if (!error) {
        EMChatroom *chatroom = result.list.firstObject;
        [[EMClient sharedClient].roomManager joinChatroom:chatroom.chatroomId
                                               completion:^(EMChatroom *joinedChatroom, EMError *joinError) {
            // Process the join result.
        }];
    }
}];
```

You can also call `joinChatroom` to include extension information when joining the chat room and specify whether to leave all other chat rooms. After this method is called, other chat room members receive the `userDidJoinChatroom` callback. If the user includes extension information when joining, the other members can retrieve it from this callback.

```objectivec
[[EMClient sharedClient].roomManager joinChatroom:chatroomId
                                               ext:@"source=live"
                                   leaveOtherRooms:NO
                                        completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the join result.
}];
```

## Leave a chat room

### Leave voluntarily

All chat room members can call `leaveChatroom` to leave the current chat room. When a member leaves, the other members receive the `userDidLeaveChatroom` callback.


```objectivec
[[EMClient sharedClient].roomManager leaveChatroom:chatroomId completion:^(EMError *error) {
    // Process the leave result.
}];
```

By default, the SDK deletes the local messages of a chat room when you leave it. To retain the messages, set `EMOptions#deleteMessagesOnLeaveChatroom` to `NO` before initialization.


```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"appkey"];
options.deleteMessagesOnLeaveChatroom = NO;
```

Unlike a group owner, who cannot leave the group, a chat room owner can leave the chat room and remains its owner after rejoining. If `EMOptions#canChatroomOwnerLeave` is set to `NO` during initialization, the owner receives error code 706 (`EMErrorChatroomOwnerNotAllowLeave`) when attempting to leave. If it is set to `YES`, the owner can leave the chat room.

### Be removed

Only the chat room owner and admins can call `removeMembers` to asynchronously remove one or more members from the chat room.

Removed members receive the `didDismissFromChatroom` callback, while the other chat room members receive the `userDidLeaveChatroom` callback.

Removed members can rejoin the chat room.

Example code:

```objectivec
// Asynchronous method.
NSArray<NSString *> *members = @[@"user_1", @"user_2"];

[[EMClient sharedClient].roomManager removeMembers:members
                                      fromChatroom:chatroomId
                                        completion:^(EMChatroom *chatroom, EMError *error) {
    if (!error) {
        // The members were removed successfully.
    } else {
        // Failed to remove the members.
    }
}];
```

### Leave automatically after going offline

If a regular chat room member remains offline for more than 2 minutes because of network issues or other reasons, the member automatically leaves the chat room. To change this period, contact the EasyIM business manager.

The following two types of members do not automatically leave the chat room when offline:

- Members on the chat room allowlist. The chat room owner and admins are on the allowlist by default.
- Users who were added when the chat room was [created through the REST API](/document/server-side/chatroom_create.html) and have never logged in.

If multi-client and multi-device support is enabled for chat rooms, an allowlisted member's device does not automatically rejoin the chat room after reconnecting from an offline state and therefore cannot receive chat room messages. After logging in on that device, call `joinChatroom` to join the chat room manually.

## Retrieve the chat room list

Call `getChatroomsFromServerWithPage` to retrieve the chat room list by page.

This API retrieves all chat rooms in the current app, not only those joined by the current user. To retrieve chat room details, call `getChatroomSpecificationFromServerWithId`. If your business needs to maintain a list of chat rooms joined by the current user, maintain it using your local business data.

```objectivec
// Asynchronous method.
// page: The current page number, starting from 1.
// pageSize: The expected number of chat rooms per page. The value range is [1, 1000].
[[EMClient sharedClient].roomManager getChatroomsFromServerWithPage:page
                                                           pageSize:pageSize
                                                         completion:^(EMPageResult<EMChatroom *> *result, EMError *error) {
    if (!error) {
        // result.list is the chat room list on the current page.
        NSArray<EMChatroom *> *chatrooms = result.list;
    } else {
        // Failed to retrieve the chat room list.
    }
}];
```

The main fields in the returned `EMPageResult<EMChatroom *>` object are as follows:

| Field                 | Type                      | Description                                                         |
| -------------------- | ------------------------- | ------------------------------------------------------------ |
| `EMPageResult#list`  | `NSArray<EMChatroom *> *` | The chat room list on the current page.                                         |
| `EMPageResult#count` | `NSInteger`               | The number of chat rooms returned on the current page. If this value is less than the requested `pageSize`, the server typically has no more chat room data. |

The following main attributes can be read from each `EMChatroom` object in `EMPageResult#list`:

| Field                         | Type         | Description                           |
| ---------------------------- | ------------ | ------------------------------ |
| `EMChatroom#chatroomId`      | `NSString *` | The chat room ID.                    |
| `EMChatroom#subject`         | `NSString *` | The chat room name.                   |
| `EMChatroom#description`     | `NSString *` | The chat room description.                   |
| `EMChatroom#owner`           | `NSString *` | The user ID of the chat room owner.        |
| `EMChatroom#occupantsCount`  | `NSInteger`  | The current number of chat room members.           |
| `EMChatroom#createTimestamp` | `NSInteger`  | The chat room creation timestamp in milliseconds. |

## Monitor chat room events

The SDK provides chat room event listeners through `IEMChatroomManager`. Register a chat room listener to receive and handle chat room events. Remove the listener when it is no longer needed to prevent memory leaks.

Example code:

```objectivec
// Implement EMChatroomManagerDelegate.

// A user joins the chat room. All chat room members except the new member receive this event.
// ext contains the extension information provided by the joining user.
- (void)userDidJoinChatroom:(EMChatroom *)chatroom
                       user:(NSString *)userId
                        ext:(NSString *)ext {
}

// A member voluntarily leaves the chat room. All members except the leaving member receive this event.
- (void)userDidLeaveChatroom:(EMChatroom *)chatroom
                        user:(NSString *)userId {
}

// This event is received when the current user is removed, the chat room is destroyed, or the current account goes offline.
- (void)didDismissFromChatroom:(EMChatroom *)chatroom
                        reason:(EMChatroomBeKickedReason)reason {
    switch (reason) {
        case EMChatroomBeKickedReasonBeRemoved:
            // The current user was removed by the chat room owner or an admin.
            break;
        case EMChatroomBeKickedReasonDestroyed:
            // The chat room was destroyed.
            break;
        case EMChatroomBeKickedReasonOffline:
            // The current account was removed from the chat room after going offline.
            break;
    }
}

// The chat room details changed. All chat room members receive this event.
// After receiving this event, call IEMChatroomManager#getChatroomSpecificationFromServerWithId:completion: to retrieve the latest details.
- (void)chatroomSpecificationDidUpdate:(EMChatroom *)chatroom {
}

// A member is added to the mute list. The added member receives this event.
// In mutedMembers, the key is the user ID and the value is the mute expiration timestamp in milliseconds. -1 indicates a permanent mute.
- (void)chatroomMuteListDidUpdate:(EMChatroom *)chatroom
                addedMutedMembers:(NSDictionary<NSString *, NSNumber *> *)mutedMembers {
}

// A member is removed from the mute list. The unmuted member receives this event.
- (void)chatroomMuteListDidUpdate:(EMChatroom *)chatroom
              removedMutedMembers:(NSArray<NSString *> *)members {
}

// A member is added to the allowlist. The added member receives this event.
- (void)chatroomWhiteListDidUpdate:(EMChatroom *)chatroom
             addedWhiteListMembers:(NSArray<NSString *> *)members {
}

// A member is removed from the allowlist. The removed member receives this event.
- (void)chatroomWhiteListDidUpdate:(EMChatroom *)chatroom
           removedWhiteListMembers:(NSArray<NSString *> *)members {
}

// The mute-all state changes. All chat room members receive this event.
- (void)chatroomAllMemberMuteChanged:(EMChatroom *)chatroom
                    isAllMemberMuted:(BOOL)isMuted {
}

// A member is appointed as an admin. The added admin receives this event.
- (void)chatroomAdminListDidUpdate:(EMChatroom *)chatroom
                        addedAdmin:(NSString *)admin {
}

// A member's admin privileges are revoked. The removed admin receives this event.
- (void)chatroomAdminListDidUpdate:(EMChatroom *)chatroom
                      removedAdmin:(NSString *)admin {
}

// The chat room owner changes. All chat room members receive this event.
- (void)chatroomOwnerDidUpdate:(EMChatroom *)chatroom
                      newOwner:(NSString *)newOwner
                      oldOwner:(NSString *)oldOwner {
}

// The chat room announcement is updated. All chat room members receive this event.
- (void)chatroomAnnouncementDidUpdate:(EMChatroom *)chatroom
                          announcement:(NSString *)announcement {
}

// Custom chat room attributes are updated. All chat room members receive this event.
- (void)chatroomAttributesDidUpdated:(NSString *)roomId
                        attributeMap:(NSDictionary<NSString *, NSString *> *)attributeMap
                                from:(NSString *)fromId {
}

// Custom chat room attributes are deleted. All chat room members receive this event.
- (void)chatroomAttributesDidRemoved:(NSString *)roomId
                           attributes:(NSArray<__kindof NSString *> *)attributes
                                 from:(NSString *)fromId {
}
```


## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`getChatroomsFromServerWithPage`](#retrieve-the-chat-room-list) | `IEMChatroomManager` | Asynchronously retrieve the chat room list in the app. |
| [`joinChatroom`](#join-a-chat-room) | `IEMChatroomManager` | Asynchronously join a chat room with optional extension information and specify whether to leave other chat rooms. |
| [`leaveChatroom`](#leave-voluntarily) | `IEMChatroomManager` | Asynchronously leave a chat room. |
