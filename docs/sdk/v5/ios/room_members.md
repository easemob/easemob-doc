# Manage Chat Room Members

## Feature overview

A chat room is an instant messaging system that supports multi-user communication. It is suitable for real-time multi-user interaction in scenarios such as live-streaming interaction, open discussions, and message broadcasting. This document describes how to use the iOS SDK to manage chat room members, including retrieving the member list and managing admins, the allowlist, the blocklist, and mutes.

## Prerequisite

Before you begin, ensure that the following requirements are met:

 - Initialize the SDK. See [Quickstart](quickstart.html).
 - Understand the EasyIM [usage restrictions](/product/limitation.html).
 - Understand the EasyIM chat room restrictions. See [EasyIM pricing](https://www.easemob.com/pricing/im).

## Retrieve the chat room member list

All chat room members can call `getChatroomMemberListFromServerWithId` to retrieve the current chat room member list. The server does not sort members, so the returned member list is not guaranteed to be ordered.

```objectivec
// Asynchronous method.
// cursor: Pass nil for the first call and result.cursor returned by the previous call for subsequent calls.
// pageSize: The expected number of members per page. The maximum value is 1,000.
[[EMClient sharedClient].roomManager getChatroomMemberListFromServerWithId:chatroomId
                                                                      cursor:nil
                                                                    pageSize:20
                                                                  completion:^(EMCursorResult<NSString *> *result, EMError *error) {
    if (!error) {
        NSArray<NSString *> *members = result.list;
        NSString *cursor = result.cursor;
    }
}];
```

## Manage the chat room blocklist

### Add members to the chat room blocklist

Only the chat room owner and admins can call `blockMembers` to add specified members to the blocklist.

After being added to the blocklist, the member receives the `didDismissFromChatroom` callback. By default, other members do not receive an event notification. To enable this event, contact the Easemob business team.

After being added to the blocklist, the member can no longer send or receive chat room messages and is removed from the chat room. Before a blocklisted member can rejoin, the chat room owner or an admin must remove the member from the blocklist.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager blockMembers:@[@"userName"]
                                      fromChatroom:chatroomId
                                        completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

### Remove members from the chat room blocklist

Only the chat room owner and admins can call `unblockMembers` to remove members from the chat room blocklist.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager unblockMembers:@[@"userName"]
                                        fromChatroom:chatroomId
                                          completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

### Retrieve the chat room blocklist

Only the chat room owner and admins can call `getChatroomBlacklistFromServerWithId` to retrieve the current chat room blocklist.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager getChatroomBlacklistFromServerWithId:chatroomId
                                                                pageNumber:1
                                                                  pageSize:20
                                                                completion:^(NSArray<NSString *> *members, EMError *error) {
    // members contains the blocklisted members.
}];
```

## Manage the chat room allowlist

The chat room owner and admins are added to the chat room allowlist by default.

Messages sent by allowlisted members in a chat room have high priority and are delivered first, but delivery is not guaranteed. When the load is high, the server drops low-priority messages first. If the load remains high, it also drops high-priority messages.

### Retrieve the chat room allowlist

Only the chat room owner and admins can call `getChatroomWhiteListFromServerWithId` to retrieve the current chat room allowlist.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager getChatroomWhiteListFromServerWithId:chatroomId
                                                               completion:^(NSArray<NSString *> *members, EMError *error) {
    // members contains the allowlisted members.
}];
```

### Check whether you are on the chat room allowlist

All chat room members can call `isMemberInWhiteListFromServerWithChatroomId` to check whether they are on the allowlist.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager isMemberInWhiteListFromServerWithChatroomId:chatroomId
                                                                        completion:^(BOOL inWhiteList, EMError *error) {
    // inWhiteList indicates whether the current user is on the allowlist.
}];
```

### Add members to the chat room allowlist

Only the chat room owner and admins can call `addWhiteListMembers` to add members to the chat room allowlist. After a member is added, the member and the other chat room admins or owner who did not perform the operation receive the `chatroomWhiteListDidUpdate` callback.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager addWhiteListMembers:@[@"userId1", @"userId2"]
                                              fromChatroom:chatroomId
                                                completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

### Remove members from the chat room allowlist

Only the chat room owner and admins can call `removeWhiteListMembers` to remove members from the chat room allowlist. After a member is removed, the member and the other chat room admins or owner who did not perform the operation receive the `chatroomWhiteListDidUpdate` callback.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager removeWhiteListMembers:@[@"userId1", @"userId2"]
                                                 fromChatroom:chatroomId
                                                   completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

## Manage the chat room mute list

### Add members to the chat room mute list

Only the chat room owner and admins can call `muteMembers` to add specified members to the chat room mute list. The muted members and the other chat room admins or owner who did not perform the operation receive the `chatroomMuteListDidUpdate` callback.

:::tip
The chat room owner can mute any chat room member, while chat room admins can mute regular members.
:::

```objectivec
// Asynchronous method.
// Pass -1 for muteMilliseconds to mute the members permanently.
[[EMClient sharedClient].roomManager muteMembers:@[@"userName"]
                                 muteMilliseconds:-1
                                     fromChatroom:chatroomId
                                       completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

### Remove members from the chat room mute list

Only the chat room owner and admins can call `unmuteMembers` to remove members from the chat room mute list. The unmuted members and the other chat room admins or owner who did not perform the operation receive the `chatroomMuteListDidUpdate` callback.

:::tip
The chat room owner can unmute any chat room member, while chat room admins can unmute regular members.
:::

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager unmuteMembers:@[@"userName"]
                                   fromChatroom:chatroomId
                                     completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

### Retrieve the chat room mute list

Only the chat room owner and admins can call `getChatroomMuteListFromServerWithId` to retrieve the chat room mute list.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager getChatroomMuteListFromServerWithId:chatroomId
                                                               pageNumber:1
                                                                 pageSize:20
                                                               completion:^(NSArray<NSString *> *members, EMError *error) {
    // members contains the muted members.
}];
```

### Check whether you are on the chat room mute list

Chat room members can call `isMemberInMuteListFromServerWithChatroomId` to check whether they are on the chat room mute list.

```objectivec
[[EMClient sharedClient].roomManager isMemberInMuteListFromServerWithChatroomId:chatroomId
                                                                       completion:^(BOOL inMuteList, EMError *error) {
    if (!error && inMuteList) {
        NSLog(@"You are in the mute list of room");
    }
}];
```

## Enable and disable mute all

To quickly manage speaking permissions in a chat room, the chat room owner and admins can enable or disable mute all. Mute all does not conflict with individual member mutes. Enabling or disabling mute all does not change the existing mute list.

### Enable mute all

Only the chat room owner and admins can call `muteAllMembersFromChatroom` to enable mute all. Mute all is not disabled automatically. Call `unmuteAllMembersFromChatroom` to disable it.
After mute all is enabled, only allowlisted members can speak. After the call succeeds, chat room members receive the `chatroomAllMemberMuteChanged` callback.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager muteAllMembersFromChatroom:chatroomId
                                                      completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

### Disable mute all

Only the chat room owner and admins can call `unmuteAllMembersFromChatroom` to disable mute all. After the call succeeds, chat room members receive the `chatroomAllMemberMuteChanged` callback.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager unmuteAllMembersFromChatroom:chatroomId
                                                        completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

## Manage the chat room owner and admins

The total number of the chat room creator and admins cannot exceed 100. Therefore, you can add up to 99 admins.

### Change the chat room owner

Only the chat room owner can call `updateChatroomOwner` to transfer ownership to a specified chat room member. After a successful transfer, the former owner becomes a chat room member, and the new owner and chat room admins receive the `chatroomOwnerDidUpdate` callback.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager updateChatroomOwner:chatroomId
                                                 newOwner:@"userName"
                                               completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

### Add a chat room admin

Only the chat room owner can call `addAdmin` to add a chat room admin. After the admin is added successfully, the new admin and other admins receive the `chatroomAdminListDidUpdate` callback.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager addAdmin:@"userName"
                                    toChatroom:chatroomId
                                    completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

### Remove a chat room admin

Only the chat room owner can call `removeAdmin` to remove a chat room admin. After the admin is removed successfully, the removed admin and other admins receive the `chatroomAdminListDidUpdate` callback.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].roomManager removeAdmin:@"userName"
                                       fromChatroom:chatroomId
                                         completion:^(EMChatroom *chatroom, EMError *error) {
    // Process the result.
}];
```

## Monitor chat room events

See [Monitor chat room events](room_manage.html#monitor-chat-room-events).

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`getChatroomMemberListFromServerWithId`](#retrieve-the-chat-room-member-list) | `IEMChatroomManager` | Asynchronously retrieve the member list by page. |
| [`blockMembers`](#add-members-to-the-chat-room-blocklist) | `IEMChatroomManager` | Asynchronously add members to the blocklist. |
| [`unblockMembers`](#remove-members-from-the-chat-room-blocklist) | `IEMChatroomManager` | Asynchronously remove members from the blocklist. |
| [`getChatroomBlacklistFromServerWithId`](#retrieve-the-chat-room-blocklist) | `IEMChatroomManager` | Asynchronously retrieve the blocklist. |
| [`getChatroomWhiteListFromServerWithId`](#retrieve-the-chat-room-allowlist) | `IEMChatroomManager` | Asynchronously retrieve the allowlist. |
| [`isMemberInWhiteListFromServerWithChatroomId`](#check-whether-you-are-on-the-chat-room-allowlist) | `IEMChatroomManager` | Check whether the current user is on the allowlist. |
| [`muteMembers`](#add-members-to-the-chat-room-mute-list) | `IEMChatroomManager` | Asynchronously mute members. |
| [`unmuteMembers`](#remove-members-from-the-chat-room-mute-list) | `IEMChatroomManager` | Asynchronously unmute members. |
| [`muteAllMembersFromChatroom`](#enable-mute-all) | `IEMChatroomManager` | Asynchronously enable mute all. |
| [`unmuteAllMembersFromChatroom`](#disable-mute-all) | `IEMChatroomManager` | Asynchronously disable mute all. |
| [`updateChatroomOwner`](#change-the-chat-room-owner) | `IEMChatroomManager` | Asynchronously change the owner. |
| [`addAdmin`](#add-a-chat-room-admin) | `IEMChatroomManager` | Asynchronously add an admin. |
| [`removeAdmin`](#remove-a-chat-room-admin) | `IEMChatroomManager` | Asynchronously remove an admin. |
