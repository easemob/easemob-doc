# Create and Manage Chat Groups

## Feature overview

Chat groups support real-time communication among multiple users. This document describes how to use the EasyIM Android SDK to create, join, leave, destroy, and manage chat groups and monitor chat group events.

### Chat group categories

Chat groups are classified as public or private based on whether they are visible to users.

The Android SDK uses multiple fields in `EMGroupConfigs` to define the chat group type:

| Chat group type                   | Android configuration                                      | Description                                       |
| :--- | :--- | :--- |
| Private group in which only the group owner and admins can invite users | `isPublic = false`, `allowInvites = false`        | Regular members cannot invite other users.                 |
| Private group in which members can invite users         | `isPublic = false`, `allowInvites = true`         | Regular members can invite other users.                 |
| Public group that requires approval         | `isPublic = true`, `joinApprovalRequired = true`  | After submitting a join request, a user waits for approval from the group owner or a group admin. |
| Public group that users can join directly         | `isPublic = true`, `joinApprovalRequired = false` | Users can join the chat group directly.                       |

### Chat group member roles

A chat group contains the following roles:

| Role | Description |
| :--- | :--- |
| Group owner | The user who creates the chat group. The group owner has permissions to destroy the group, transfer ownership, update group configurations, and remove members. |
| Group admin | A role assigned by the group owner with some group management permissions, such as approving join requests, inviting or removing members, and managing the mute list, allowlist, and blocklist. |
| Regular member | A member who can send and receive group messages, leave the group, and invite other users when invitations are allowed in a private group, subject to the applicable permissions. |

For chat group messaging capabilities, see [Message Management](message_overview.html).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. See [Quickstart](quickstart.html).
- Understand API call frequency limits and chat group and group member limits. See [Limitations](/product/limitation.html).

## Create a chat group

Call `EMGroupManager#asyncCreateGroup` to create a chat group. After the group is created, the current user becomes the group owner, and the callback returns the new `EMGroup` object.

The SDK uses `EMGroupConfigs` to configure the chat group type and joining rules:

| Parameter or field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `groupName` | String | No | The chat group name. Pass `null` if it is not set. |
| `avatar` | String | No | The chat group avatar URL. Pass `null` if it is not set. |
| `desc` | String | No | The chat group description. Pass `null` if it is not set. |
| `allMembers` | String[] | Yes | An array of the initial members' user IDs, excluding the group owner. Pass an empty array if there are no initial members. Do not pass `null`. |
| `reason` | String | No | The reason for inviting the initial members. Pass `null` if it is not set. |
| `configs` | EMGroupConfigs | Yes | The chat group configuration object. It cannot be `null`. |
| `configs.maxUsers` | Int | No | The maximum number of group members. The default value is `200`. |
| `configs.isPublic` | Boolean | Yes | Whether the chat group is public. `true` indicates a public group, and `false` indicates a private group. |
| `configs.joinApprovalRequired` | Boolean | Yes | Whether an application to join a public group requires approval from the group owner or a group admin. This field applies only to public groups. |
| `configs.allowInvites` | Boolean | Yes | Whether regular members of a private group can invite other users. This field applies only to private groups. |
| `configs.inviteNeedConfirm` | Boolean | Yes | Whether an invited user must confirm the invitation before joining the group. |
| `configs.extField` | String | No | The chat group extension, which can be a JSON string. |

```java
EMGroupConfigs configs = new EMGroupConfigs();
configs.maxUsers = 200;
configs.isPublic = false;
configs.joinApprovalRequired = false;
configs.allowInvites = true;
configs.inviteNeedConfirm = true;
configs.extField = "{\"source\":\"android\"}";

String[] initialMembers = new String[0];

EMClient.getInstance()
        .groupManager()
        .asyncCreateGroup(
                "group name",
                "https://example.com/group-avatar.png",
                "group description",
                initialMembers,
                null,
                configs,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        String groupId = group.getGroupId();
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```


## Destroy a chat group

Only the group owner can call `asyncDestroyGroup` to destroy a chat group. After the group is destroyed, other members receive `EMGroupChangeListener#onGroupDestroyed` and are removed from the group.

:::warning
Destroying a chat group cannot be undone. After the group is successfully destroyed, it no longer exists, all members are removed, and the SDK also removes the corresponding conversation from memory. We recommend requesting confirmation in your app before performing this operation.
:::

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncDestroyGroup(groupId, new EMCallBack() {
            @Override
            public void onSuccess() {
                // The chat group has been destroyed.
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

## Join a chat group

A user can join a chat group through an invitation or apply to join a public group. The process is determined by the group's `isPublic`, `joinApprovalRequired`, `allowInvites`, and `inviteNeedConfirm` configurations.

### Invite users to join a chat group

In the Android SDK, the group owner and group admins can call `asyncAddUsersToGroup` to add users to a chat group. For a private group, whether regular members can invite other users is controlled by `EMGroupConfigs#allowInvites`:

- `allowInvites = false`: Regular members cannot invite other users. Only the group owner and group admins can add members.
- `allowInvites = true`: Regular members can call `asyncInviteUser` to invite other users to the chat group.

The invitation process is as follows:

![](/images/android/group_member_invite.png)

The group owner and group admins can call `asyncAddUsersToGroup` to add one or more users. Regular members of a private group that allows invitations can call `asyncInviteUser` to send an invitation.

```java
String[] userIds = {"user1", "user2"};

// The group owner or a group admin adds users.
EMClient.getInstance()
        .groupManager()
        .asyncAddUsersToGroup(
                groupId,
                userIds,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The operation succeeded.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Handle the failure based on the error code and error message.
                    }
                });

// A regular member of a private group that allows invitations sends an invitation.
EMClient.getInstance()
        .groupManager()
        .asyncInviteUser(
                groupId,
                userIds,
                "Join our group",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The invitation has been sent.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Failed to send the invitation.
                    }
                });
```

How an invited user handles the invitation is determined by `EMGroupConfigs#inviteNeedConfirm`, which is set when the chat group is created:

- `false`: The invited user joins the chat group without confirmation and receives `EMGroupChangeListener#onAutoAcceptInvitationFromGroup`.
- `true`: The invited user receives `EMGroupChangeListener#onInvitationReceived` and chooses whether to join the group:
  - To accept the invitation, call `asyncAcceptInvitation`.
  - To decline the invitation, call `asyncDeclineInvitation`.

After the invitation is accepted, the inviter receives `EMGroupChangeListener#onInvitationAccepted`. After it is declined, the inviter receives `EMGroupChangeListener#onInvitationDeclined`.

:::tip
To let users manually handle chat group invitations, call `EMOptions#setAutoAcceptGroupInvitation(false)` before SDK initialization to disable automatic acceptance. The default value of this configuration is `true`. When enabled, the SDK automatically accepts incoming group invitations. When disabled, the app can call the API for accepting or declining an invitation in `EMGroupChangeListener#onInvitationReceived`.
:::

```java
// Accept a chat group invitation.
EMClient.getInstance()
        .groupManager()
        .asyncAcceptInvitation(
                groupId,
                inviter,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        // The invitation has been accepted and the user has joined the chat group.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Failed to accept the invitation.
                    }
                });

// Decline a chat group invitation.
EMClient.getInstance()
        .groupManager()
        .asyncDeclineInvitation(
                groupId,
                inviter,
                "No, thanks",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The invitation has been declined.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Failed to decline the invitation.
                    }
                });
```

After a user successfully joins a chat group, the user can send and receive messages in that group.

### Apply to join a chat group

Users can apply to join a public group. They cannot apply to join a private group.

![](/images/android/group_member_apply.png)

The API to call is determined by `EMGroupConfigs#joinApprovalRequired`:

- `false`: Call `asyncJoinGroup` to join the public group directly.
- `true`: Call `asyncApplyJoinToGroup` to submit a join request and wait for approval from the group owner or a group admin.

```java
// Join a public group that does not require approval.
EMClient.getInstance()
        .groupManager()
        .asyncJoinGroup(groupId, new EMCallBack() {
            @Override
            public void onSuccess() {
                // The user has joined the chat group.
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
                // Failed to join the chat group.
            }
        });

// Apply to join a public group that requires approval.
EMClient.getInstance()
        .groupManager()
        .asyncApplyJoinToGroup(
                groupId,
                "Please approve my request",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The join request has been submitted.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Failed to submit the request.
                    }
                });
```

When approval is required, the group owner and group admins receive `EMGroupChangeListener#onRequestToJoinReceived` and choose whether to approve or decline the request:
- After the request is approved, the applicant receives `onRequestToJoinAccepted`.
- After the request is declined, the applicant receives `onRequestToJoinDeclined`.

```java
// The group owner or a group admin approves the join request.
EMClient.getInstance()
        .groupManager()
        .asyncAcceptApplication(
                applicant,
                groupId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The join request has been approved.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // The operation failed.
                    }
                });

// The group owner or a group admin declines the join request.
EMClient.getInstance()
        .groupManager()
        .asyncDeclineApplication(
                applicant,
                groupId,
                "Group is full",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The join request has been declined.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // The operation failed.
                    }
                });
```

## Leave a chat group

### Leave voluntarily

A group member can call `asyncLeaveGroup` to leave a chat group voluntarily. After leaving, the user no longer receives group messages, and other members receive `onMembersExited`.

The group owner cannot leave the group directly. To leave, first transfer group ownership and then call the API for leaving the group, or destroy the group directly.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncLeaveGroup(groupId, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

After a user leaves a chat group, the SDK does not automatically delete the group conversation or its local messages from the local database, but removes the in-memory cache for the conversation.

### Remove members

The group owner and group admins can call `asyncRemoveUsersFromGroup` to remove one or more members from the group. A removed member receives `onUserRemoved`, and other members receive `onMembersExited`. After being removed, the user can join the group again.

```java
List<String> members = Arrays.asList("user1", "user2");

// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncRemoveUsersFromGroup(
                groupId,
                members,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

## Retrieve the groups joined by the current user

After the local database is opened, call `EMGroupManager#getAllGroups()` to read from local storage the groups joined by the current user and display local data first. This method first reads from the in-memory cache. If chat group data has not been loaded into memory, the first call loads it from the local database.

To retrieve the latest joined group data after login, call `EMOptions#setDataSyncType` before SDK initialization and include `EMDataSyncType.JOINED_GROUPS` in the data types for automatic synchronization:

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.JOINED_GROUPS));

EMClient.getInstance().init(getApplicationContext(), options);
```

After the user logs in successfully, the SDK automatically synchronizes data for the groups joined by the current user. Monitor the synchronization result through `EMConnectionListener#onDataSyncFinish`. When `type` is `EMDataSyncType.JOINED_GROUPS` and `errorCode` is `EMError.EM_NO_ERROR`, synchronization succeeded. You can then call `getAllGroups()` again to obtain the synchronized local chat group list and refresh the page.

```java
@Override
public void onDataSyncFinish(
        EMOptions.EMDataSyncType type,
        int errorCode) {
    if (type == EMOptions.EMDataSyncType.JOINED_GROUPS
            && errorCode == EMError.EM_NO_ERROR) {
        List<EMGroup> groups = EMClient.getInstance()
                .groupManager()
                .getAllGroups();

        // Refresh the page with the synchronized joined group list.
    }
}
```

## Query the number of groups joined by the current user

Call `asyncGetJoinedGroupsCountFromServer` to retrieve from the server the number of groups joined by the current user.

The maximum number of groups that a single user can join depends on the subscribed EasyIM plan. See [EasyIM Plan Features](/product/product_package_feature.html).

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncGetJoinedGroupsCountFromServer(
                new EMValueCallBack<Integer>() {
                    @Override
                    public void onSuccess(Integer count) {
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

## Block and unblock group messages

Group members can block or unblock messages from a specified chat group. Blocking group messages affects only whether the current user continues to receive subsequent messages from the specified group. It does not cause the user to leave the group or affect other group members.

### Block group messages

Call `EMGroupManager#asyncBlockGroupMessage` to block messages from a specified chat group. The group owner and group admins cannot block group messages.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncBlockGroupMessage(
                groupId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // Messages from this chat group have been blocked.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Handle the failure based on the error code and error message.
                    }
                });
```

### Unblock group messages

Call `EMGroupManager#asyncUnblockGroupMessage` to unblock group messages. After the operation succeeds, the current user can continue receiving subsequent messages from the group.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncUnblockGroupMessage(
                groupId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // Messages from this chat group have been unblocked.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Handle the failure based on the error code and error message.
                    }
                });
```

### Check whether the current user has blocked group messages

First call `asyncGetGroupFromServer` to retrieve the latest chat group details, and then use `EMGroup#isMsgBlocked` to determine whether the current user has blocked messages from the specified group.

```java
EMClient.getInstance()
        .groupManager()
        .asyncGetGroupFromServer(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        boolean messageBlocked = group.isMsgBlocked();
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

## Monitor chat group events

`EMGroupManager` provides a listener for chat group events. Your app can call `addGroupChangeListener` to register a listener, receive various events in a chat group, and update the related UI. When the listener is no longer used, call `removeGroupChangeListener` to remove it and avoid memory leaks.

```java
// Create a chat group event listener.
// In the descriptions below, the current user is the currently logged-in user.
EMGroupChangeListener groupListener = new EMGroupChangeListener() {
    // The current user receives an invitation to join a chat group. The invited user receives this callback.
    // For example, if user B invites the current user to a group, the current user receives this callback.
    @Override
    public void onInvitationReceived(String groupId, String groupName,
            String inviter, String reason) {
    }

    // The group owner or a group admin receives a join request. The group owner and all admins receive this callback.
    @Override
    public void onRequestToJoinReceived(String groupId, String groupName,
            String applicant, String reason) {
    }

    // The group owner or a group admin approves a user's join request.
    // The applicant, group owner, and admins other than the operator receive this callback.
    @Override
    public void onRequestToJoinAccepted(String groupId, String groupName,
            String accepter) {
    }

    // The group owner or a group admin declines a user's join request.
    // The applicant, group owner, and admins other than the operator receive this callback.
    @Override
    public void onRequestToJoinDeclined(String groupId, String groupName,
            String decliner, String reason, String applicant) {
    }

    // A user accepts an invitation to join a chat group. The inviter receives this callback.
    @Override
    public void onInvitationAccepted(String groupId, String invitee,
            String reason) {
    }

    // A user declines an invitation to join a chat group. The inviter receives this callback.
    @Override
    public void onInvitationDeclined(String groupId, String invitee,
            String reason) {
    }

    // A member is removed from the chat group. The removed member receives this callback.
    @Override
    public void onUserRemoved(String groupId, String groupName) {
    }

    // A chat group is destroyed. When the group owner destroys the group, all group members receive this callback.
    @Override
    public void onGroupDestroyed(String groupId, String groupName) {
    }

    // A user automatically accepts an invitation to join the chat group. The inviter receives this callback.
    @Override
    public void onAutoAcceptInvitationFromGroup(String groupId,
            String inviter, String inviteMessage) {
    }

    // Members are added to the group mute list.
    // The muted members, group owner, and group admins other than the operator receive this callback.
    @Override
    public void onMuteListAdded(String groupId, List<String> mutes,
            long muteExpire) {
    }

    // Members are removed from the group mute list.
    // The unmuted members, group owner, and group admins other than the operator receive this callback.
    @Override
    public void onMuteListRemoved(String groupId, List<String> mutes) {
    }

    // Members are added to the group allowlist.
    // The added members, group owner, and group admins other than the operator receive this callback.
    @Override
    public void onWhiteListAdded(String groupId, List<String> whitelist) {
    }

    // Members are removed from the group allowlist.
    // The removed members, group owner, and group admins other than the operator receive this callback.
    @Override
    public void onWhiteListRemoved(String groupId, List<String> whitelist) {
    }

    // The mute-all state changes. All group members other than the operator receive this callback.
    @Override
    public void onAllMemberMuteStateChanged(String groupId,
            boolean isMuted) {
    }

    // A group admin is assigned. The group owner, new admin, and other admins receive this callback.
    @Override
    public void onAdminAdded(String groupId, String administrator) {
    }

    // A group admin is removed.
    // The removed admin, group owner, and group admins other than the operator receive this callback.
    @Override
    public void onAdminRemoved(String groupId, String administrator) {
    }

    // Chat group ownership is transferred. Group members receive this callback.
    @Override
    public void onOwnerChanged(String groupId, String newOwner,
            String oldOwner) {
    }

    // New members join the chat group. All group members other than the new members receive this callback.
    @Override
    public void onMembersJoined(String groupId, List<String> members) {
    }

    // Members leave or are removed from the chat group.
    // All group members other than those who left or were removed receive this callback.
    @Override
    public void onMembersExited(String groupId, List<String> members) {
    }

    // The chat group announcement is updated. All group members receive this callback.
    @Override
    public void onAnnouncementChanged(String groupId,
            String announcement) {
    }

    // A member uploads a shared chat group file by calling the RESTful API. All group members receive this callback.
    @Override
    public void onSharedFileAdded(String groupId,
            EMMucSharedFile sharedFile) {
    }

    // A shared chat group file is deleted. All group members receive this callback.
    @Override
    public void onSharedFileDeleted(String groupId, String fileId) {
    }

    // Chat group details change. All group members receive this callback.
    @Override
    public void onSpecificationChanged(EMGroup group) {
    }

    // The chat group disabled state changes. All group members receive this callback.
    @Override
    public void onStateChanged(EMGroup group, boolean isDisabled) {
    }

    // Custom group member attributes change. Other group members receive this callback.
    @Override
    public void onGroupMemberAttributeChanged(String groupId,
            String userId, Map<String, String> attribute, String from) {
    }

    // A group member name card changes. Other online group members receive this callback.
    @Override
    public void onUserGroupNamecardUpdated(String groupId,
            String userId, String groupNamecard) {
    }
};

EMClient.getInstance()
        .groupManager()
        .addGroupChangeListener(groupListener);

// Call this method when the page or component is destroyed and the listener is no longer needed.
EMClient.getInstance()
        .groupManager()
        .removeGroupChangeListener(groupListener);
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncCreateGroup`](#create-a-chat-group) | `EMGroupManager` | Create a chat group asynchronously. |
| [`asyncDestroyGroup`](#destroy-a-chat-group) | `EMGroupManager` | Destroy a chat group. |
| [`asyncAddUsersToGroup`](#invite-users-to-join-a-chat-group) / [`asyncInviteUser`](#invite-users-to-join-a-chat-group) | `EMGroupManager` | Add or invite users to a chat group. |
| [`asyncAcceptInvitation`](#invite-users-to-join-a-chat-group) / [`asyncDeclineInvitation`](#invite-users-to-join-a-chat-group) | `EMGroupManager` | Accept or decline a chat group invitation. |
| [`asyncJoinGroup`](#apply-to-join-a-chat-group) / [`asyncApplyJoinToGroup`](#apply-to-join-a-chat-group) | `EMGroupManager` | Join a public group directly or apply to join one. |
| [`asyncAcceptApplication`](#apply-to-join-a-chat-group) / [`asyncDeclineApplication`](#apply-to-join-a-chat-group) | `EMGroupManager` | Approve or decline a request to join a chat group. |
| [`asyncLeaveGroup`](#leave-voluntarily) | `EMGroupManager` | Leave a chat group voluntarily. |
| [`asyncRemoveUsersFromGroup`](#remove-members) | `EMGroupManager` | Remove one or more members from a chat group. |
| [`setDataSyncType`](#retrieve-the-groups-joined-by-the-current-user) | `EMOptions` | Configure automatic synchronization of joined group data after login. |
| [`getAllGroups`](#retrieve-the-groups-joined-by-the-current-user) | `EMGroupManager` | Retrieve from local storage the groups joined by the current user. |
| [`asyncGetJoinedGroupsCountFromServer`](#query-the-number-of-groups-joined-by-the-current-user) | `EMGroupManager` | Retrieve from the server the number of groups joined by the current user. |
| [`asyncGetGroupFromServer`](#check-whether-the-current-user-has-blocked-group-messages) | `EMGroupManager` | Retrieve chat group details from the server. |
| [`isMsgBlocked`](#check-whether-the-current-user-has-blocked-group-messages) | `EMGroup` | Determine whether the current user has blocked messages from a specified group. |
| [`asyncBlockGroupMessage`](#block-group-messages) / [`asyncUnblockGroupMessage`](#unblock-group-messages) | `EMGroupManager` | Block or unblock group messages. |
