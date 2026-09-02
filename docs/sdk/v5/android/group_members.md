# Manage Chat Group Members

## Feature overview

Chat groups support real-time communication among multiple users. This document describes how to use the Android SDK to manage group members, including querying the member list and managing custom member attributes, the group owner and admins, the allowlist, the blocklist, and muting. For operations related to joining, leaving, and removing users from a group, see [Create and Manage Chat Groups](group_manage.html#join-a-chat-group).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Complete [SDK initialization](initialization.html) and [log in successfully](login.html).
- Understand group member roles and permissions. See [Chat Group Overview](group_overview.html).
- Understand limits on the number of group members, API call frequency, and group member attribute size. See [Limitations](/product/limitation.html).

## Retrieve the group member list

You can retrieve the group member list in the following three ways:

- Retrieve group member information with pagination: Call `asyncFetchGroupMembersInfo` to retrieve member details from the server by page.
- Retrieve group member IDs with pagination: Call `asyncFetchGroupMembers` to retrieve member IDs from the server with pagination.
- Retrieve member IDs from a local chat group object: Call `EMGroup#getUsers` to read member IDs from a retrieved `EMGroup` object.

### Retrieve group member information with pagination

Call `EMGroupManager#asyncFetchGroupMembersInfo` to retrieve group member information with pagination. The returned information includes each member's user ID, role, join time, name card, nickname, and avatar.

```java
// Asynchronous method.
// cursor: Pass `null` or an empty string for `cursor` in the first request. In subsequent requests, pass the cursor from the previous result. An empty returned cursor indicates the last page.
EMClient.getInstance()
        .groupManager()
        // pageSize: The expected number of group members returned per page. The upper limit depends on the server. See https://doc.easyim.ai/rest/group_member_list_obtain.html#request-url.
        .asyncFetchGroupMembersInfo(
                groupId,
                null,
                50,
                new EMValueCallBack<
                        EMCursorResult<EMGroupMemberInfo>>() {
                    @Override
                    public void onSuccess(
                            EMCursorResult<EMGroupMemberInfo> result) {
                        List<EMGroupMemberInfo> members = result.getData();
                        String nextCursor = result.getCursor();

                        for (EMGroupMemberInfo member : members) {
                            String userId = member.getUserId();
                            long joinedAt = member.getJoinTime();
                            EMGroup.EMGroupPermissionType role =
                                    member.getRole();
                            String namecard = member.getNamecard();
                            String nickname = member.getNickname();
                            String avatarUrl = member.getAvatarUrl();
                        }
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

The main APIs of `EMGroupMemberInfo` are as follows:

| API | Return value | Description |
| :--- | :--- | :--- |
| `getUserId()` | `String` | Retrieve the group member's user ID. |
| `getJoinTime()` | `long` | Retrieve the join time as a Unix timestamp in milliseconds. |
| `getRole()` | `EMGroupPermissionType` | Retrieve the member role: `owner`, `admin`, `member`, or `none`. |
| `getNamecard()` | `String` | Retrieve the group member name card. |
| `getNickname()` | `String` | Retrieve the group member nickname. |
| `getAvatarUrl()` | `String` | Retrieve the group member avatar URL. |

### Retrieve group member IDs by page

If you need only the group members' user IDs, call `asyncFetchGroupMembers` to retrieve them by page:

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupMembers(
                groupId,
                null,
                50,
                new EMValueCallBack<EMCursorResult<String>>() {
                    @Override
                    public void onSuccess(
                            EMCursorResult<String> result) {
                        List<String> userIds = result.getData();
                        String nextCursor = result.getCursor();
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Retrieve member IDs from a local chat group object

If you have retrieved an `EMGroup` object, call `EMGroup#getUsers()` to obtain the user IDs of all members contained in the object, including the group owner, admins, and regular members:

```java
List<String> userIds = group.getUsers();
```

## Manage custom group member attributes

Custom group member attributes store member information scoped to a chat group and are suitable for business tags and similar use cases. They use a string key-value structure.

- The total length of a single group member's custom attributes cannot exceed 4 KB.
- The key of an attribute cannot exceed 16 bytes, and its value cannot exceed 512 bytes.
- The group owner can update the attributes of all group members. Other group members can update only their own attributes.

### Set custom group member attributes

Call `asyncSetGroupMemberAttributes` to set the attributes of a specified member. Set the value for a key to an empty string to delete that attribute. After the operation succeeds, other group members receive `EMGroupChangeListener#onGroupMemberAttributeChanged`.

```java
Map<String, String> attributes = new HashMap<>();
attributes.put("department", "product");
attributes.put("roleTag", "speaker");

// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncSetGroupMemberAttributes(
                groupId,
                userId,
                attributes,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Retrieve a group member's custom attributes

Call `asyncFetchGroupMemberAllAttributes` to retrieve all custom attributes of a specified group member. On success, the callback returns `Map<String, Map<String, String>>`. The key of the outer `Map` is the member's user ID, and the inner `Map` contains that member's attribute key-value pairs.

If the member has not set custom attributes, the attribute `Map` for that user ID in the result may be empty. Check for an empty value as required by your business logic.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupMemberAllAttributes(
                groupId,
                userId,
                new EMValueCallBack<
                        Map<String, Map<String, String>>>() {
                    @Override
                    public void onSuccess(
                            Map<String, Map<String, String>> result) {
                        Map<String, String> attributes = result.get(userId);
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Retrieve custom group member attributes by attribute key

Call `asyncFetchGroupMembersAttributes` to batch-retrieve attributes of multiple group members by attribute key. If `keyList` is an empty list, all attributes of those members are returned.

:::tip
You can retrieve the custom attributes of up to 10 group members in each call.
:::

```java
List<String> userIds = Arrays.asList("user1", "user2");
List<String> keyList = Arrays.asList("department", "roleTag");

// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupMembersAttributes(
                groupId,
                userIds,
                // keyList: An array of the custom attribute keys to retrieve. If keyList is an empty array or is not passed, all custom attributes of these members are retrieved.
                keyList,
                new EMValueCallBack<
                        Map<String, Map<String, String>>>() {
                    @Override
                    public void onSuccess(
                            Map<String, Map<String, String>> result) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## Manage the group owner and admins

### Transfer chat group ownership

Only the group owner can call `asyncChangeOwner` to transfer group ownership to a specified group member. After the transfer succeeds, the former owner becomes a regular member, the new owner obtains group owner permissions, and group members receive `onOwnerChanged`.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncChangeOwner(
                groupId,
                newOwner,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Add a group admin

Only the group owner can call `asyncAddGroupAdmin` to add a group admin. After the operation succeeds, the new admin and other admins receive `onAdminAdded`.

An admin has most chat group permissions except for a few permissions such as destroying the chat group.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncAddGroupAdmin(
                groupId,
                userId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Remove a group admin

Only the group owner can call `asyncRemoveGroupAdmin` to remove a group admin. After the operation succeeds, the removed admin and other admins receive `onAdminRemoved`.

After an admin's group management permissions are removed, the user has only regular member permissions.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncRemoveGroupAdmin(
                groupId,
                userId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Retrieve the group admin list

Call `EMGroup#getAdminList` to retrieve the group admin list. To obtain the latest data, first call [`asyncGetGroupFromServer` to retrieve chat group details](group_attributes.html#retrieve-chat-group-details) and refresh the group details.

```java
// Retrieve the admin list from memory.
List<String> adminList = group.getAdminList();
```

## Manage the group allowlist

The group allowlist controls which members can still send messages when all group members are muted. The group owner and group admins are on the allowlist by default.

:::tip
Muting all members and muting individual members are independent. When all members are muted, allowlisted members can still send group messages. If an allowlisted member is also muted individually, the individual mute takes precedence and the member still cannot send group messages.
:::

### Add members to the allowlist

Only the group owner or a group admin can call `addToGroupWhiteList` to add specified members to the group allowlist. After the operation succeeds, the added members, group owner, and group admins other than the operator receive `onWhiteListAdded`.
Allowlisted members can still send group messages when all members are muted. However, a member who is also on the mute list cannot send group messages.

```java
List<String> members = Arrays.asList("user1", "user2");

// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .addToGroupWhiteList(groupId, members, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### Remove members from the allowlist

Only the group owner or a group admin can call `removeFromGroupWhiteList` to remove specified members from the group allowlist. After a member is removed, that member and the group owner and admins other than the operator receive `onWhiteListRemoved`.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .removeFromGroupWhiteList(groupId, members, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### Check whether the current user is on the allowlist

All group members can call `checkIfInGroupWhiteList` to check whether the current user is on the group allowlist.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .checkIfInGroupWhiteList(
                groupId,
                new EMValueCallBack<Boolean>() {
                    @Override
                    public void onSuccess(Boolean inWhiteList) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Retrieve the allowlist

Only the group owner or a group admin can call `fetchGroupWhiteList` to retrieve the current group's allowlist from the server.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .fetchGroupWhiteList(
                groupId,
                new EMValueCallBack<List<String>>() {
                    @Override
                    public void onSuccess(List<String> members) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## Manage the group blocklist

The group blocklist prevents specified users from joining or remaining in a chat group. After members are added to the blocklist, they are removed from the group and can no longer send or receive group messages. They can apply or be invited to join again only after they are removed from the blocklist.

### Add members to the blocklist

Only the group owner or a group admin can call `asyncBlockUsers` to add one or more members to the group blocklist. Blocklisted members receive `onUserRemoved`. By default, other group members do not receive an event notification. To enable this event, contact the EasyIM business manager.

Blocklisted members are removed from the group and can no longer send or receive group messages. They must be removed from the blocklist before they can rejoin the group.

```java
List<String> members = Arrays.asList("user1", "user2");

// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncBlockUsers(groupId, members, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### Remove members from the blocklist

Only the group owner or a group admin can call `asyncUnblockUsers` to remove one or more users from the group blocklist. After removal, the users can apply or be invited to join the group again.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncUnblockUsers(groupId, members, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### Retrieve the blocklist

Only the group owner or a group admin can call `asyncFetchGroupBlackList` to retrieve blocklisted members by page.

```java
// Asynchronous method.
// `pageNum` starts from `1`.
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupBlackList(
                groupId,
                1,
                20,
                new EMValueCallBack<List<String>>() {
                    @Override
                    public void onSuccess(List<String> members) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## Manage chat group muting

The group owner and group admins can mute individual group members or all members. These two mute methods are independent and do not affect each other:
- Mute individual members: Add specified users to the mute list. Muted members cannot send group messages. The mute duration is in milliseconds.
- Mute all members: Mute all group members with one operation. Allowlisted members can send messages. If a member is also muted individually, the individual mute takes precedence and the member cannot send messages.
- Enabling or disabling mute all does not affect the mute list for individual members.

### Mute specified members

Only the group owner or a group admin can call `asyncMuteGroupMembers` to mute specified members. After they are added to the mute list, the muted members, group owner, and group admins other than the operator receive `onMuteListAdded`.

```java
List<String> members = Arrays.asList("user1", "user2");
// `duration` is in milliseconds. Pass `-1` to mute permanently.
long duration = 60 * 60 * 1000L;

EMClient.getInstance()
        .groupManager()
        .asyncMuteGroupMembers(
                groupId,
                members,
                duration,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Unmute specified members

Only the group owner or a group admin can call `asyncUnMuteGroupMembers` to unmute specified members. After members are unmuted, those members, the group owner, and group admins other than the operator receive `onMuteListRemoved`.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncUnMuteGroupMembers(
                groupId,
                members,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Check whether the current user is muted

A group member can call `asyncCheckIfInMuteList` to check whether the current user is on the group mute list.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncCheckIfInMuteList(
                groupId,
                new EMValueCallBack<Boolean>() {
                    @Override
                    public void onSuccess(Boolean muted) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Retrieve the mute list

Only the group owner or a group admin can call `asyncFetchGroupMuteList` to retrieve the mute list by page. In the returned `Map`, the `key` is the member ID and the `value` is the mute duration in milliseconds.

```java
// Asynchronous method.
// `pageNum` starts from `1`.
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupMuteList(
                groupId,
                1,
                20,
                new EMValueCallBack<Map<String, Long>>() {
                    @Override
                    public void onSuccess(
                            Map<String, Long> muteList) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Mute all members

Only the group owner or a group admin can call `muteAllMembers` to mute all members. After mute all is enabled, group members receive `onAllMemberMuteStateChanged`. All members except those on the allowlist cannot send group messages.

Mute all does not expire automatically. To disable it, explicitly call the API for disabling mute all.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .muteAllMembers(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Unmute all members

Only the group owner or a group admin can call `unmuteAllMembers` to unmute all members. After mute all is disabled, group members receive `onAllMemberMuteStateChanged`.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .unmuteAllMembers(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## Monitor chat group member events

After a group member operation succeeds, the SDK triggers the corresponding `EMGroupChangeListener` callback. For listener registration and removal and complete event descriptions, see [Monitor chat group events](group_manage.html#monitor-chat-group-events).

## Considerations

- `groupId`, `userId`, and the member list cannot be empty. If parameters are invalid, the SDK returns an error through the callback.
- `asyncFetchGroupMembersInfo` and `asyncFetchGroupMembers` use cursor-based pagination. The mute list and blocklist use page-number pagination, starting from `1`.
- The mute duration for `asyncMuteGroupMembers` is in milliseconds. `-1` indicates a permanent mute.
- `checkIfInGroupWhiteList` and `asyncCheckIfInMuteList` query only the current user's own status. You cannot specify another user.
- Admin, allowlist, blocklist, and mute operations require the current user to have the corresponding permissions.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncFetchGroupMembersInfo`](#retrieve-group-member-information-by-page) | `EMGroupManager` | Retrieve group member information, including roles, join times, and profiles, by page. |
| [`asyncFetchGroupMembers`](#retrieve-group-member-ids-by-page) | `EMGroupManager` | Retrieve group member user IDs by page. |
| [`getUsers`](#retrieve-member-ids-from-a-local-chat-group-object) | `EMGroup` | Retrieve the user IDs of the group owner, admins, and regular members contained in the chat group object. |
| [`asyncSetGroupMemberAttributes`](#set-custom-group-member-attributes) | `EMGroupManager` | Set custom group member attributes. |
| [`asyncFetchGroupMemberAllAttributes`](#retrieve-a-group-members-custom-attributes) | `EMGroupManager` | Retrieve all custom attributes of a single group member. |
| [`asyncFetchGroupMembersAttributes`](#retrieve-a-single-group-members-custom-attributes) | `EMGroupManager` | Retrieve specified or all custom attributes of multiple group members. |
| [`asyncChangeOwner`](#transfer-chat-group-ownership) | `EMGroupManager` | Transfer chat group ownership. |
| [`asyncAddGroupAdmin`](#add-a-group-admin) / [`asyncRemoveGroupAdmin`](#remove-a-group-admin) | `EMGroupManager` | Add or remove a group admin. |
| [`asyncGetGroupFromServer`](#retrieve-the-group-admin-list) | `EMGroupManager` | Retrieve the latest chat group details from the server. |
| [`getAdminList`](#retrieve-the-group-admin-list) | `EMGroup` | Retrieve the group admin list. |
| [`addToGroupWhiteList`](#add-members-to-the-allowlist) / [`removeFromGroupWhiteList`](#remove-members-from-the-allowlist) | `EMGroupManager` | Add or remove members from the group allowlist. |
| [`checkIfInGroupWhiteList`](#check-whether-the-current-user-is-on-the-allowlist) / [`fetchGroupWhiteList`](#retrieve-the-allowlist) | `EMGroupManager` | Check whether the current user is on the allowlist or retrieve the allowlist. |
| [`asyncBlockUsers`](#add-members-to-the-blocklist) / [`asyncUnblockUsers`](#remove-members-from-the-blocklist) | `EMGroupManager` | Add or remove members from the group blocklist. |
| [`asyncFetchGroupBlackList`](#retrieve-the-blocklist) | `EMGroupManager` | Retrieve the group blocklist by page. |
| [`asyncMuteGroupMembers`](#mute-specified-members) / [`asyncUnMuteGroupMembers`](#unmute-specified-members) | `EMGroupManager` | Mute or unmute specified members. |
| [`asyncCheckIfInMuteList`](#check-whether-the-current-user-is-muted) / [`asyncFetchGroupMuteList`](#retrieve-the-mute-list) | `EMGroupManager` | Check whether the current user is muted or retrieve the mute list by page. |
| [`muteAllMembers`](#mute-all-members) / [`unmuteAllMembers`](#unmute-all-members) | `EMGroupManager` | Mute or unmute all members. |
