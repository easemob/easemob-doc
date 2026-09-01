# Manage Chat Group Members

## Feature overview

This document describes how to use the EasyIM iOS SDK to manage chat group members, including retrieving the member list, setting custom member attributes, managing the owner and admins, and managing the allowlist, blocklist, and mute list. For joining, leaving, and removing members from a chat group, see [Create and Manage Chat Groups](group_manage.html).

## Prerequisite

- The SDK has been initialized and the user has logged in successfully. See [SDK initialization](initialization.html).
- You understand chat group member roles and permissions. See [Chat Group Overview](group_overview.html).
- You understand the limits on the number of chat group members, API call frequency, and member attribute size. See [IM feature limits](/product/limitation.html).

## Retrieve the chat group member list

You can retrieve the chat group member list in the following two ways:

- Retrieve chat group member details by page: Call `fetchGroupMemberInfoListFromServerWithGroupId` to retrieve member details from the server by page.
- Retrieve chat group member IDs by page: Call `getGroupMemberListFromServerWithId` to retrieve member IDs from the server by page.

### Retrieve chat group member details by page

Call `fetchGroupMemberInfoListFromServerWithGroupId` to retrieve chat group member details by page. The returned `EMGroupMemberInfo` contains the user ID, join time, role, name card, nickname, and avatar URL.

```swift
EMClient.shared().groupManager?.fetchGroupMemberInfoListFromServer(
    withGroupId: "groupId",
    // For the first request, pass an empty string for `cursor`. For subsequent requests, pass the `cursor` from the previous result.
    cursor: "",
    limit: 50
) { result, error in
    if let error {
        print("Failed to retrieve group members: \(error.errorDescription)")
        return
    }

    let members = result?.list ?? []
    let nextCursor = result?.cursor
    for member in members {
        print("User: \(member.userId), join time: \(member.joinedTimestamp)")
    }
    // A nil or empty nextCursor indicates that there is no more data.
}
```

The main properties of `EMGroupMemberInfo` are as follows:

| Property | Type | Description |
| :--- | :--- | :--- |
| `userId` | `String` | The chat group member's user ID. |
| `joinedTimestamp` | `UInt` | The join timestamp in milliseconds. |
| `role` | `EMGroupPermissionType` | The member role, such as owner, admin, or regular member. |
| `namecard` | `String?` | The chat group member name card. |
| `nickname` | `String?` | The user nickname. |
| `avatarUrl` | `String?` | The user avatar URL. |

### Retrieve chat group member IDs by page

If you need only member user IDs, call `getGroupMemberListFromServerWithId`.

```swift
EMClient.shared().groupManager?.getGroupMemberListFromServer(
    withId: "groupId",
    cursor: nil,
    pageSize: 50
) { result, error in
    if let error {
        print("Failed to retrieve the group member list: \(error.errorDescription)")
        return
    }

    let userIds = result?.list ?? []
    let nextCursor = result?.cursor

    print("Members on the current page: \(userIds)")

    // A nil or empty nextCursor indicates that there is no more data.
}
```

In addition, you can call `getGroupSpecificationFromServerWithId` with `fetchMembers` set to `true` to obtain the member list in `memberList`. This API returns at most 200 members by default and should not replace paginated retrieval of the complete member list.

## Manage custom chat group member attributes

Custom chat group member attributes are member information scoped to a chat group. They are suitable for scenarios such as business tags and use a string key-value structure.

- The total length of a single member's custom attributes cannot exceed 4 KB.
- An attribute key cannot exceed 16 bytes, and its value cannot exceed 512 bytes.
- The chat group owner can modify the attributes of all members. Other members can modify only their own attributes.

### Set custom attributes for a chat group member

Call `setMemberAttribute` to set attributes for a specified member. Set a value to an empty string to delete the attribute for the corresponding key. After a successful update, other members in the chat group receive the `onAttributesChangedOfGroupMember` callback.

```swift
let attributes = [
    "department": "product",
    "roleTag": "speaker"
]

EMClient.shared().groupManager?.setMemberAttribute(
    "groupId",
    userId: "userId",
    attributes: attributes
) { error in
    if let error {
        print("Failed to set member attributes: \(error.errorDescription)")
    }
}
```

### Retrieve a single chat group member's custom attributes

Call `fetchMemberAttribute` to retrieve all custom attributes of a specified member. On success, the completion handler returns `[String: String]?`, where the key is the attribute name and the value is the attribute value.

If the member has not set any custom attributes, the returned attribute dictionary may be empty or `nil`. Handle this case as required by your app.

```swift
EMClient.shared().groupManager?.fetchMemberAttribute(
    "groupId",
    userId: "userId"
) { attributes, error in
    if let error {
        print("Failed to retrieve member attributes: \(error.errorDescription)")
        return
    }
    print(attributes ?? [:])
}
```

### Retrieve chat group member custom attributes by attribute key

Call `fetchMembersAttributes` to retrieve member attributes in bulk by attribute key. Pass an empty array for `keys` to retrieve all attributes of these members.

:::tip
You can retrieve custom attributes for at most 10 chat group members in each request.
:::

```swift
EMClient.shared().groupManager?.fetchMembersAttributes(
    "groupId",
    userIds: ["user1", "user2"],
    keys: ["department", "roleTag"]
) { attributes, error in
    if let error {
        print("Failed to retrieve member attributes in bulk: \(error.errorDescription)")
        return
    }
    print(attributes ?? [:])
}
```

## Manage the chat group owner and admins

### Transfer the chat group ownership

Only the chat group owner can call `updateGroupOwner` to transfer ownership. After a successful transfer, the former owner becomes a regular member and the new owner has owner permissions. Chat group members receive the `groupOwnerDidUpdate` callback.

```swift
EMClient.shared().groupManager?.updateGroupOwner(
    "groupId",
    newOwner: "newOwnerId"
) { _, error in
    if let error {
        print("Failed to change the group owner: \(error.errorDescription)")
    }
}
```

### Add a chat group admin

Only the chat group owner can call `addAdmin` to add an admin. After a successful operation, the new admin and the other admins receive the `groupAdminListDidUpdate` callback.

Except for a few permissions, such as destroying the chat group, an admin has most chat group management permissions.

```swift
EMClient.shared().groupManager?.addAdmin(
    "userId",
    toGroup: "groupId"
) { _, error in
    if let error {
        print("Failed to add a group admin: \(error.errorDescription)")
    }
}
```

### Remove a chat group admin

Only the chat group owner can call `removeAdmin` to remove an admin. After a successful operation, the removed admin and the other admins receive the `groupAdminListDidUpdate` callback.

After an admin loses chat group management permissions, they have only regular member permissions.

```swift
EMClient.shared().groupManager?.removeAdmin(
    "userId",
    fromGroup: "groupId"
) { _, error in
    if let error {
        print("Failed to remove a group admin: \(error.errorDescription)")
    }
}
```

### Retrieve the chat group admin list

Call `getGroupSpecificationFromServerWithId` to [retrieve chat group details](group_attributes.html#retrieve-chat-group-details), and then read the admin user ID list from `adminList`.

```swift
EMClient.shared().groupManager?.getGroupSpecificationFromServer(
    withId: "groupId"
) { group, error in
    if let error {
        print("Failed to retrieve group details: \(error.errorDescription)")
        return
    }

    let adminIds = group?.adminList ?? []
    print("Group admin list: \(adminIds)")
}
```

## Manage the chat group allowlist

The chat group allowlist controls which members can still speak when all members are muted. The chat group owner and admins are on the allowlist by default.

:::tip
Muting all members and muting individual members are independent. When all members are muted, allowlist members can still send chat group messages. If a member is also individually muted, the individual mute takes precedence and the member cannot send chat group messages.
:::

### Add members to the allowlist

Only the chat group owner or an admin can call `addWhiteListMembers` to add allowlist members. After a successful operation, the added member and the chat group owner and admins other than the operator receive the `groupWhiteListDidUpdate` callback.

Even when all members are muted, allowlist members can still send chat group messages. However, a member who is also on the mute list cannot send chat group messages.

```swift
EMClient.shared().groupManager?.addWhiteListMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("Failed to add users to the allowlist: \(error.errorDescription)") }
}
```

### Remove members from the allowlist

Only the chat group owner or an admin can call `removeWhiteListMembers` to remove allowlist members. After a successful operation, the removed member and the other admins and owner receive the `groupWhiteListDidUpdate` callback.

```swift
EMClient.shared().groupManager?.removeWhiteListMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("Failed to remove users from the allowlist: \(error.errorDescription)") }
}
```

### Check whether the current user is on the allowlist

All chat group members can call `isMemberInWhiteListFromServerWithGroupId` to check whether the current logged-in user is on the chat group allowlist.

```swift
EMClient.shared().groupManager?.isMember(inWhiteListFromServerWithGroupId: "groupId") { inWhiteList, error in
    if let error {
        print("Failed to query the allowlist: \(error.errorDescription)")
        return
    }
    print("Is in the allowlist: \(inWhiteList)")
}
```

### Retrieve the allowlist

Only the chat group owner or an admin can call `getGroupWhiteListFromServerWithId` to retrieve the current chat group's allowlist from the server.

```swift
EMClient.shared().groupManager?.getGroupWhiteListFromServer(withId: "groupId") { members, error in
    if let error { print("Failed to retrieve the allowlist: \(error.errorDescription)") }
    else { print(members ?? []) }
}
```

## Manage the chat group blocklist

The chat group blocklist prevents specified users from joining or remaining in the chat group. After a member is added to the blocklist, the member is removed from the chat group and can no longer send or receive messages in it. The member can apply to join or be invited again only after being removed from the blocklist.

### Add members to the blocklist

Only the chat group owner or an admin can call `blockMembers` to add members to the blocklist. A blocked member receives the `didLeaveGroup` callback. By default, other chat group members do not receive an event notification. Contact the business team to enable this event.

Blocked members are removed from the chat group and cannot send or receive messages in it. They can rejoin only after being removed from the blocklist.

```swift
EMClient.shared().groupManager?.blockMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("Failed to add users to the blocklist: \(error.errorDescription)") }
}
```

### Remove members from the blocklist

Only the chat group owner or an admin can call `unblockMembers` to remove one or more users from the chat group blocklist. After removal, the users can apply to join or be invited to the chat group again.

```swift
EMClient.shared().groupManager?.unblockMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("Failed to remove users from the blocklist: \(error.errorDescription)") }
}
```

### Retrieve the blocklist

Only the chat group owner or an admin can call `getGroupBlacklistFromServerWithId` to retrieve the blocklisted member list by page.

```swift
EMClient.shared().groupManager?.getGroupBlacklistFromServer(
    withId: "groupId",
    pageNumber: 1,
    pageSize: 50
) { members, error in
    if let error { print("Failed to retrieve the blocklist: \(error.errorDescription)") }
    else { print(members ?? []) }
}
```

## Manage chat group muting

The chat group owner and admins can mute individual members or mute all members. These two mute modes are independent and do not affect each other:

- Individual mute: Add a specified user to the mute list. A muted member cannot send chat group messages. The mute duration is measured in milliseconds.
- Mute all members: Mute all members in the chat group at once. Allowlist members can speak. If a member is also individually muted, the individual mute takes precedence.
- Enabling or disabling mute-all does not affect the mute list of individual members.

### Mute specified members

Only the chat group owner or an admin can call `muteMembers` to mute specified members. After they are added to the mute list, the muted members and the chat group admins and owner other than the operator receive the `groupMuteListDidUpdate` callback.

```swift
EMClient.shared().groupManager?.muteMembers(
    ["userId"],
    // The unit is milliseconds. Pass `-1` for a permanent mute.
    muteMilliseconds: 3_600_000,
    fromGroup: "groupId"
) { _, error in
    if let error { print("Failed to mute members: \(error.errorDescription)") }
}
```

### Unmute specified members

Only the chat group owner or an admin can call `unmuteMembers` to unmute specified members. After they are unmuted, the unmuted members and the chat group admins and owner other than the operator receive the `groupMuteListDidUpdate` callback.

```swift
EMClient.shared().groupManager?.unmuteMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("Failed to unmute members: \(error.errorDescription)") }
}
```

### Check whether the current user is muted

Chat group members can call `isMemberInMuteListFromServerWithGroupId` to check whether the current user is on the chat group mute list.

```swift
EMClient.shared().groupManager?.isMember(inMuteListFromServerWithGroupId: "groupId") { inMuteList, error in
    if let error { print("Failed to query the mute status: \(error.errorDescription)") }
    else { print("Is muted: \(inMuteList)") }
}
```

### Retrieve the mute list

Only the chat group owner or an admin can call `fetchGroupMuteListFromServerWithId` to retrieve muted members and their mute expiration times. In the returned dictionary, `key` is the user ID and `value` is the expiration time as an `NSNumber`.

```swift
EMClient.shared().groupManager?.fetchGroupMuteListFromServer(
    withId: "groupId",
    // `pageNum` starts at `1`.
    pageNumber: 1,
    pageSize: 50
) { muteList, error in
    if let error { print("Failed to retrieve the mute list: \(error.errorDescription)") }
    else { print(muteList ?? [:]) }
}
```

### Mute all members

Only the chat group owner or an admin can call `muteAllMembersFromGroup` to mute all members. After a successful operation, chat group members receive the `groupAllMemberMuteChanged` callback.

Mute-all does not expire automatically. To disable it, proactively call the unmute API.

```swift
EMClient.shared().groupManager?.muteAllMembers(fromGroup: "groupId") { _, error in
    if let error { print("Failed to mute all members: \(error.errorDescription)") }
}
```

### Unmute all members

Only the chat group owner or an admin can call `unmuteAllMembersFromGroup` to disable mute-all. After it is disabled, chat group members receive the `groupAllMemberMuteChanged` callback.

```swift
EMClient.shared().groupManager?.unmuteAllMembers(fromGroup: "groupId") { _, error in
    if let error { print("Failed to unmute all members: \(error.errorDescription)") }
}
```

## Monitor chat group member events

Implement `EMGroupManagerDelegate` and register it through `addDelegate`. For callback events triggered after chat group member operations succeed, see [Monitor chat group events](group_manage.html#monitor-chat-group-events).

## Notes

- Chat group details, the admin list, and the member list are not always fully cached. When the latest server-side data is needed, call the corresponding asynchronous retrieval API.
- All examples use asynchronous APIs. In the completion handler, determine whether the operation succeeded by checking whether `EMError?` is `nil`.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`fetchGroupMemberInfoListFromServerWithGroupId`](#retrieve-chat-group-member-details-by-page) | `IEMGroupManager` | Retrieves member details. |
| [`getGroupMemberListFromServerWithId`](#retrieve-chat-group-member-ids-by-page) | `IEMGroupManager` | Retrieves the member ID list. |
| [`setMemberAttribute`](#set-custom-attributes-for-a-chat-group-member) | `IEMGroupManager` | Sets member attributes. |
| [`fetchMemberAttribute`](#retrieve-a-single-chat-group-members-custom-attributes) | `IEMGroupManager` | Retrieves a single member's attributes. |
| [`fetchMembersAttributes`](#retrieve-chat-group-member-custom-attributes-by-attribute-key) | `IEMGroupManager` | Retrieves member attributes in bulk. |
| [`updateGroupOwner`](#transfer-the-chat-group-ownership) | `IEMGroupManager` | Transfers chat group ownership. |
| [`addAdmin`](#add-a-chat-group-admin) | `IEMGroupManager` | Adds an admin. |
| [`removeAdmin`](#remove-a-chat-group-admin) | `IEMGroupManager` | Removes an admin. |
| [`addWhiteListMembers`](#add-members-to-the-allowlist) | `IEMGroupManager` | Adds members to the allowlist. |
| [`isMemberInWhiteListFromServerWithGroupId`](#check-whether-the-current-user-is-on-the-allowlist) | `IEMGroupManager` | Checks whether the current user is on the allowlist. |
| [`blockMembers`](#add-members-to-the-blocklist) | `IEMGroupManager` | Adds members to the blocklist. |
| [`getGroupBlacklistFromServerWithId`](#retrieve-the-blocklist) | `IEMGroupManager` | Retrieves the blocklist. |
| [`muteMembers`](#mute-specified-members) | `IEMGroupManager` | Mutes specified members. |
| [`isMemberInMuteListFromServerWithGroupId`](#check-whether-the-current-user-is-muted) | `IEMGroupManager` | Checks whether the current user is muted. |
| [`muteAllMembersFromGroup`](#mute-all-members) | `IEMGroupManager` | Mutes all members. |
