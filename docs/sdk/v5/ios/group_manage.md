# Create and Manage Chat Groups

## Feature overview

Chat groups support real-time communication among multiple users. This document describes how to use the EasyIM iOS SDK to create, join, leave, destroy, and manage chat groups and monitor chat group events.

### Chat group categories

Chat groups can be public or private depending on whether they are open to users.

The iOS SDK uses multiple fields in `EMGroupConfigs` to define the chat group type:

| Chat group type | Swift configuration | Description |
| :--- | :--- | :--- |
| Private group, only the owner can invite | `isPublic = false`, `allowInvites = false` | Regular members cannot invite other users. |
| Private group, members can invite | `isPublic = false`, `allowInvites = true` | Regular members can invite other users. |
| Public group, approval required | `isPublic = true`, `joinApprovalRequired = true` | After submitting a join request, the user waits for the owner to approve it. |
| Public group, direct joining allowed | `isPublic = true`, `joinApprovalRequired = false` | Users can join the chat group directly. |

### Chat group member roles

A chat group has the following roles:

| Role | Description |
| :--- | :--- |
| Chat group owner | The user who created the chat group. The owner can destroy the chat group, transfer ownership, modify chat group settings, and remove members. |
| Chat group admin | A role assigned by the owner with some chat group management permissions, such as approving join requests, inviting or removing members, and managing muting, the allowlist, and the blocklist. |
| Regular member | Can send and receive chat group messages and leave the chat group within the permitted scope. A regular member can also invite other users when invitations are allowed in a private group. |

For chat group messaging capabilities, see [Message Management](message_overview.html).

## Prerequisite

Before you start, make sure that the following requirements are met:

- The SDK is initialized and the user is logged in successfully. For details, see [Quickstart](quickstart.html).
- You understand API call frequency limits and the limits on the number of chat groups and chat group members. For details, see [Usage limits](/product/limitation.html).

## Create a chat group

Call `createGroupWithSubject` to create a chat group. After the chat group is created, the creator automatically becomes the owner.

| Parameter or field | Swift type | Required | Description |
| :--- | :--- | :--- | :--- |
| `subject` | `String?` | No | The chat group name. It cannot exceed 255 characters. |
| `avatar` | `String?` | No | The chat group avatar URL. |
| `description` | `String?` | No | The chat group description. It cannot exceed 2048 characters. |
| `invitees` | `[String]?` | No | An array of initial members' user IDs, excluding the creator. Pass an empty array or `nil` when there are no initial members. |
| `message` | `String?` | No | The message sent with the invitation to the initial members. |
| `setting` | `EMGroupConfigs?` | No | The chat group configuration object. Pass `nil` to use the SDK default settings. |
| `setting.maxUsers` | `Int` | No | The maximum number of chat group members. The range is 3–2000 and the default is 200. |
| `setting.isPublic` | `Bool` | No | Whether the chat group is public. The default is `false`. |
| `setting.joinApprovalRequired` | `Bool` | No | Whether a join request for a public group requires approval. This applies only to public groups; the default is `false`. |
| `setting.allowInvites` | `Bool` | No | Whether regular members of a private group can invite other users. This applies only to private groups; the default is `false`. |
| `setting.isInviteNeedConfirm` | `Bool` | No | Whether the invitee must confirm an invitation to join the chat group. If `false`, the invitee joins automatically. The default is `true`. |
| `setting.ext` | `String` | No | Chat group extension information. The default is an empty string, and the field can store a JSON string. |

```swift
let configs = EMGroupConfigs()
configs.isPublic = false
configs.allowInvites = true
configs.maxUsers = 200

EMClient.shared().groupManager?.createGroup(
    withSubject: "项目讨论组",
    avatar: nil,
    description: "用于项目沟通",
    invitees: ["user1", "user2"],
    message: "邀请你加入项目讨论组",
    setting: configs
) { group, error in
    if let error {
        print("创建群组失败：\(error.errorDescription)")
        return
    }

    print("群组创建成功：\(group?.groupId ?? "")")
}
```

`invitees` should not include the creator. If the chat group has no avatar, pass `nil` for `avatar`.

## Destroy a chat group

Only the chat group owner can call `destroyGroup` to destroy the chat group. After a successful destruction, chat group members receive the `didLeaveGroup` callback with `.destroyed` as the reason for leaving.

:::warning
Destroying a chat group cannot be undone. After the operation succeeds, the chat group no longer exists, all members are removed, and the SDK removes the corresponding conversation from memory. We recommend asking for confirmation in the app before performing this operation.
:::

```swift
EMClient.shared().groupManager?.destroyGroup(
    "groupId"
) { error in
    if let error {
        print("解散群组失败：\(error.errorDescription)")
        return
    }

    print("群组已解散")
}
```

## Join a chat group

A user can join a chat group through an invitation or apply to join a public group. The process is determined by the group's `setting.isPublic`, `setting.joinApprovalRequired`, `setting.allowInvites`, and `setting.isInviteNeedConfirm` settings.

### Invite users to join a chat group

The chat group owner and admins can invite users to join the chat group. For a private group, whether regular members can invite other users is controlled by `allowInvites`:

- `allowInvites = false`: Only the owner and admins can invite users.
- `allowInvites = true`: Regular members can also invite users.

The invitation process is as follows:

![](/images/ios/group_member_invite.png)

Call `addMembers` to send an invitation:

```swift
EMClient.shared().groupManager?.addMembers(
    ["user1", "user2"],
    toGroup: "groupId",
    message: "欢迎加入群组"
) { group, error in
    if let error {
        print("邀请成员失败：\(error.errorDescription)")
        return
    }

    print("已发出群邀请：\(group?.groupId ?? "")")
}
```

The invitee's process is determined by `isInviteNeedConfirm` when the chat group is created:

- `false`: The invitee joins without confirmation and receives the `didJoinGroup` callback.
- `true`: The invitee receives the `groupInvitationDidReceive` callback and chooses whether to join:
  - Accept the invitation: Call `acceptInvitationFromGroup`.
  - Decline the invitation: Call `declineGroupInvitation`.

After an invitation is accepted, the inviter receives `groupInvitationDidAccept`. After an invitation is declined, the inviter receives `groupInvitationDidDecline`.

:::tip
To let users handle invitations manually, set `EMOptions#autoAcceptGroupInvitation` to `false` before SDK initialization. The default value is `true`, which means the SDK automatically accepts received invitations. After you disable it, the app can call the accept or decline API in the `groupInvitationDidReceive` callback.
:::

```swift
final class GroupInvitationDelegate: NSObject, EMGroupManagerDelegate {
    func groupInvitationDidReceive(
        _ groupId: String,
        groupName: String,
        inviter: String,
        message: String?
    ) {
        // Call the method to accept or decline the invitation based on the user's action.
        acceptInvitation(groupId: groupId, inviter: inviter)
    }

    private func acceptInvitation(groupId: String, inviter: String) {
        EMClient.shared().groupManager?.acceptInvitation(
            fromGroup: groupId,
            inviter: inviter
        ) { group, error in
            if let error {
                print("接受群邀请失败：\(error.errorDescription)")
                return
            }

            print("已加入群组：\(group?.groupId ?? "")")
        }
    }

    private func declineInvitation(groupId: String, inviter: String) {
        EMClient.shared().groupManager?.declineGroupInvitation(
            groupId,
            inviter: inviter,
            reason: "暂不加入"
        ) { error in
            if let error {
                print("拒绝群邀请失败：\(error.errorDescription)")
            }
        }
    }
}
```

After successfully joining the chat group, the user can send and receive messages in it.

### Apply to join a chat group

Users can actively apply to join a public group. Private groups do not support user-initiated join requests.

The process for applying to join a public group is as follows:

![](/images/ios/group_member_apply.png)

The exact API to call is determined by `joinApprovalRequired`:

- `false`: Call `joinPublicGroup` to join the public group directly.
- `true`: Call `requestToJoinPublicGroup` to submit a join request and wait for the owner or an admin to approve it.

```swift
// Join a public group without approval.
EMClient.shared().groupManager?.joinPublicGroup(
    "groupId"
) { group, error in
    if let error {
        print("加入公开群失败：\(error.errorDescription)")
        return
    }

    print("已加入群组：\(group?.groupId ?? "")")
}

// Apply to join a public group that requires approval.
EMClient.shared().groupManager?.request(
    toJoinPublicGroup: "groupId",
    message: "申请加入"
) { _, error in
    if let error {
        print("提交入群申请失败：\(error.errorDescription)")
    }
}
```

When approval is required, the owner and admins receive `joinGroupRequestDidReceive` and choose whether to approve or decline the request:

- After the request is approved, the applicant receives `joinGroupRequestDidApprove`.
- After the request is declined, the applicant receives `joinGroupRequestDidDecline`.

```swift
EMClient.shared().groupManager?.approveJoinGroupRequest(
    "groupId",
    sender: "applicantId"
) { group, error in
    if let error {
        print("同意入群申请失败：\(error.errorDescription)")
        return
    }

    print("已同意申请：\(group?.groupId ?? "")")
}

EMClient.shared().groupManager?.declineJoinGroupRequest(
    "groupId",
    sender: "applicantId",
    reason: "群成员已满"
) { _, error in
    if let error {
        print("拒绝入群申请失败：\(error.errorDescription)")
    }
}
```

## Leave a chat group

### Leave voluntarily

A chat group member can call `leaveGroup` to leave voluntarily. After leaving, the user no longer receives chat group messages, and other members receive the `userDidLeaveGroup` callback.

The owner cannot leave the chat group directly. To leave, transfer ownership first and then call the leave API, or destroy the chat group directly.

```swift
EMClient.shared().groupManager?.leaveGroup(
    "groupId"
) { error in
    if let error {
        print("退出群组失败：\(error.errorDescription)")
        return
    }

    print("已退出群组")
}
```

After a user leaves, the local chat group conversation is not deleted automatically. `EMOptions#deleteMessagesOnLeaveGroup` controls whether local messages in the chat group are deleted; the default is `true`.

### Remove members

Only the owner can call `removeMembers` to remove one or more members. A removed user receives `didLeaveGroup` with `.beRemoved` as the reason, and other members receive `userDidLeaveGroup`.

```swift
EMClient.shared().groupManager?.removeMembers(
    ["user1", "user2"],
    fromGroup: "groupId"
) { group, error in
    if let error {
        print("移出成员失败：\(error.errorDescription)")
        return
    }

    print("成员已移出群组：\(group?.groupId ?? "")")
}
```

## Retrieve the chat groups joined by the current user

After the local database is opened, call `getJoinedGroups` to retrieve the chat groups joined by the current user from local storage and display local data first. The iOS SDK does not provide a corresponding `loadAllGroups()` API. `getJoinedGroups` returns chat group data from the SDK's local cache or database.

To retrieve the latest joined chat groups after login, include `.joinedGroups` in `EMOptions#dataSyncType` before SDK initialization:

```swift
let options = EMOptions.options(withAppkey: "your-org#your-app")
options.dataSyncType = [.joinedGroups]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}
```

After login succeeds, the SDK automatically synchronizes the chat groups joined by the current user. Monitor the result through `syncDataFinished`: when `type` contains `.joinedGroups` and `error` is `nil`, synchronization has succeeded. Then call `getJoinedGroups` again to retrieve the synchronized local list and refresh the page.

```swift
final class ClientDelegate: NSObject, EMClientDelegate {
    func onDatabaseOpened(_ error: EMError?, username: String) {
        guard error == nil else { return }

        let cachedGroups =
            EMClient.shared().groupManager?.getJoinedGroups() ?? []

        // Display the local chat group list on the initial screen.
        print("本地群组数量：\(cachedGroups.count)")
    }

    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard error == nil, type.contains(.joinedGroups) else {
            return
        }

        let groups =
            EMClient.shared().groupManager?.getJoinedGroups() ?? []

        // Refresh the page with the synchronized list of joined chat groups.
        print("同步后的群组数量：\(groups.count)")
    }
}
```

## Query the number of chat groups joined by the current user

Call `getJoinedGroupsCountFromServerWithCompletion` to retrieve the number of chat groups joined by the current user from the server.

The maximum number of chat groups a user can join depends on the subscribed EasyIM plan. For details, see [IM plan feature details](/product/product_package_feature.html).

```swift
EMClient.shared().groupManager?.getJoinedGroupsCountFromServer { count, error in
    if let error {
        print("查询已加入群组数量失败：\(error.errorDescription)")
        return
    }

    print("已加入群组数量：\(count)")
}
```

## Block and unblock chat group messages

A chat group member can block or unblock messages from a specified chat group. Blocking affects only whether the current user continues to receive subsequent messages from the specified chat group. It does not remove the user from the chat group or affect other members.

### Block chat group messages

Call `blockGroup` to block messages from the specified chat group. The owner and admins cannot block chat group messages.

```swift
EMClient.shared().groupManager?.blockGroup(
    "groupId"
) { _, error in
    if let error {
        print("屏蔽群消息失败：\(error.errorDescription)")
        return
    }

    print("已屏蔽群消息")
}
```

### Unblock chat group messages

Call `unblockGroup` to unblock messages. After a successful operation, the current user can continue receiving subsequent messages from the chat group.

```swift
EMClient.shared().groupManager?.unblockGroup(
    "groupId"
) { _, error in
    if let error {
        print("解除屏蔽失败：\(error.errorDescription)")
        return
    }

    print("已解除屏蔽")
}
```

### Check whether the current user has blocked chat group messages

First call `getGroupSpecificationFromServerWithId` to retrieve the latest chat group details, and then use `isBlocked` to check whether the current user has blocked messages from the specified chat group.

```swift
EMClient.shared().groupManager?.getGroupSpecificationFromServer(
    withId: "groupId"
) { group, error in
    guard error == nil, let group else {
        return
    }

    print("是否已屏蔽群消息：\(group.isBlocked)")
}
```

## Monitor chat group events

Register `EMGroupManagerDelegate` through `addDelegate`. When monitoring is no longer needed, call `removeDelegate` to remove the same delegate instance.

```swift
// Create a chat group event listener.
// In the descriptions below, the current user means the currently logged-in user.
final class GroupEventListener: NSObject, EMGroupManagerDelegate {
    // The current user receives a chat group invitation.
    // For example, when user B invites the current user to join a chat group, the current user receives this callback.
    func groupInvitationDidReceive(
        _ groupId: String,
        groupName: String,
        inviter: String,
        message: String?
    ) {
    }

    // The owner or an admin receives a user's request to join a public group.
    func joinGroupRequestDidReceive(
        _ group: EMGroup,
        user: String,
        reason: String?
    ) {
    }
    
    // The current user's request to join a public group is approved.
    func joinGroupRequestDidApprove(_ group: EMGroup) {
    }
    
    // The current user's request to join a public group is declined.
    // decliner is the user ID of the user who declined the request, and applicant is the applicant's user ID.
    func joinGroupRequestDidDecline(
        _ groupId: String,
        reason: String?,
        decliner: String?,
        applicant: String
    ) {
    }
    
    // An invite sent by the current user is accepted by the invitee.
    func groupInvitationDidAccept(
        _ group: EMGroup,
        invitee: String
    ) {
    }
    
    // An invite sent by the current user is declined by the invitee.
    func groupInvitationDidDecline(
        _ group: EMGroup,
        invitee: String,
        reason: String?
    ) {
    }
    
    // The SDK automatically accepts an invitation and the current user joins the chat group.
    func didJoinGroup(
        _ group: EMGroup,
        inviter: String,
        message: String?
    ) {
    }
    
    // The current user is removed from the chat group or the chat group is destroyed.
    // reason distinguishes removal from destruction.
    func didLeaveGroup(
        _ group: EMGroup,
        reason: EMGroupLeaveReason
    ) {
    }
    
    // The current user's local chat group list changes.
    func groupListDidUpdate(_ groupList: [EMGroup]) {
    }
    
    // One or more members join the chat group.
    // users is the array of user IDs of the members who joined in this operation.
    func userDidJoinGroup(
        _ group: EMGroup,
        users userIds: [String]
    ) {
    }
    
    // One or more members leave or are removed from the chat group.
    // users is the array of user IDs of the members who left in this operation.
    func userDidLeaveGroup(
        _ group: EMGroup,
        users userIds: [String]
    ) {
    }
    
    // The chat group owner changes.
    func groupOwnerDidUpdate(
        _ group: EMGroup,
        newOwner: String,
        oldOwner: String
    ) {
    }
    
    // A member is made a chat group admin.
    func groupAdminListDidUpdate(
        _ group: EMGroup,
        addedAdmin: String
    ) {
    }
    
    // A member is removed as a chat group admin.
    func groupAdminListDidUpdate(
        _ group: EMGroup,
        removedAdmin: String
    ) {
    }
    
    // A member is added to the chat group mute list.
    // muteExpire is the mute expiration time; this field is unavailable in the current SDK.
    func groupMuteListDidUpdate(
        _ group: EMGroup,
        addedMutedMembers: [String],
        muteExpire: Int
    ) {
    }
    
    // A member is removed from the chat group mute list.
    func groupMuteListDidUpdate(
        _ group: EMGroup,
        removedMutedMembers: [String]
    ) {
    }
    
    // The mute-all status changes.
    func groupAllMemberMuteChanged(
        _ group: EMGroup,
        isAllMemberMuted: Bool
    ) {
    }
    
    // A member is added to the chat group allowlist.
    func groupWhiteListDidUpdate(
        _ group: EMGroup,
        addedWhiteListMembers: [String]
    ) {
    }
    
    // A member is removed from the chat group allowlist.
    func groupWhiteListDidUpdate(
        _ group: EMGroup,
        removedWhiteListMembers: [String]
    ) {
    }
    
    // The chat group announcement is updated.
    func groupAnnouncementDidUpdate(
        _ group: EMGroup,
        announcement: String?
    ) {
    }
    
    // A shared file is uploaded to the chat group.
    func groupFileListDidUpdate(
        _ group: EMGroup,
        addedSharedFile: EMGroupSharedFile
    ) {
    }
    
    // A shared file is deleted from the chat group.
    // removedSharedFile is the ID of the deleted shared file.
    func groupFileListDidUpdate(
        _ group: EMGroup,
        removedSharedFile: String
    ) {
    }
    
    // The chat group name, description, avatar, settings, or extension fields change.
    // To retrieve the complete latest chat group details, call the chat group details API again.
    func groupSpecificationDidUpdate(_ group: EMGroup) {
    }
    
    // The chat group disabled status changes.
    func groupStateChanged(
        _ group: EMGroup,
        isDisabled: Bool
    ) {
    }
    
    // A chat group member's custom attributes change.
    // operatorId is the user ID of the user who performed the operation.
    func onAttributesChangedOfGroupMember(
        _ groupId: String,
        userId: String,
        attributes: [String: String]?,
        operatorId: String
    ) {
    }
    
    // A chat group member's name card changes.
    func onUserGroupNamecardChanged(
        _ groupId: String,
        userId: String,
        namecard: String?
    ) {
    }
}

let groupEventListener = GroupEventListener()

EMClient.shared().groupManager?.add(
    groupEventListener,
    delegateQueue: nil
)

// Call this when the page or component is destroyed and monitoring is no longer needed.
EMClient.shared().groupManager?.removeDelegate(groupEventListener)

```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createGroupWithSubject`](#create-a-chat-group) | `IEMGroupManager` | Creates a chat group asynchronously. |
| [`destroyGroup`](#destroy-a-chat-group) | `IEMGroupManager` | Destroys a chat group. |
| [`addMembers`](#invite-users-to-join-a-chat-group) | `IEMGroupManager` | Invites users to join a chat group. |
| [`acceptInvitationFromGroup`](#invite-users-to-join-a-chat-group) / [`declineGroupInvitation`](#invite-users-to-join-a-chat-group) | `IEMGroupManager` | Accepts or declines a chat group invitation. |
| [`joinPublicGroup`](#apply-to-join-a-chat-group) / [`requestToJoinPublicGroup`](#apply-to-join-a-chat-group) | `IEMGroupManager` | Joins or applies to join a public group. |
| [`approveJoinGroupRequest`](#apply-to-join-a-chat-group) / [`declineJoinGroupRequest`](#apply-to-join-a-chat-group) | `IEMGroupManager` | Approves or declines a join request. |
| [`leaveGroup`](#leave-voluntarily) | `IEMGroupManager` | Leaves a chat group voluntarily. |
| [`removeMembers`](#remove-members) | `IEMGroupManager` | Removes one or more members from a chat group. |
| [`dataSyncType`](#retrieve-the-chat-groups-joined-by-the-current-user) | `EMOptions` | Configures automatic synchronization of joined chat groups after login. |
| [`getJoinedGroups`](#retrieve-the-chat-groups-joined-by-the-current-user) | `IEMGroupManager` | Retrieves the chat groups joined by the current user from local storage. |
| [`getJoinedGroupsCountFromServerWithCompletion`](#query-the-number-of-chat-groups-joined-by-the-current-user) | `IEMGroupManager` | Retrieves the number of joined chat groups from the server. |
| [`blockGroup`](#block-chat-group-messages) / [`unblockGroup`](#unblock-chat-group-messages) | `IEMGroupManager` | Blocks or unblocks chat group messages. |
| [`getGroupSpecificationFromServerWithId`](#check-whether-the-current-user-has-blocked-chat-group-messages) | `IEMGroupManager` | Retrieves chat group details from the server. |
| [`isBlocked`](#check-whether-the-current-user-has-blocked-chat-group-messages) | `EMGroup` | Checks whether the current user has blocked messages from the specified chat group. |
