# Manage User Relationships

## Feature overview

The SDK provides user relationship management, including friend management and blocklist management.

 - Friend management: Add friends, process friend requests, delete friends, set friend remarks, and automatically synchronize the friend list and friend information after login.
 - Blocklist management: Retrieve the blocklist from the server, add users to the blocklist, and remove users from the blocklist. Before using this feature, activate the service in the [EasyIM Console](https://console.easyim.ai/user/login). See the [EasyIM Console documentation](/product/console/basic_user.html#用户黑名单).

## Prerequisite

Before you begin, ensure that the following requirements are met:

 - Initialize and log in to the iOS SDK. See [Quickstart](quickstart.html).
 - Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).
 - Activate the blocklist feature in the [EasyIM Console](https://console.easyim.ai/user/login). See the [EasyIM Console documentation](/product/console/basic_user.html#用户黑名单).

## Friend management

### Monitor friend relationship and friend information changes

Use `EMContactManagerDelegate` to monitor friend request, acceptance, rejection, addition, deletion, and friend information change events.

```objectivec
@interface ContactViewController () <EMContactManagerDelegate>
@end

@implementation ContactViewController

- (void)startObserveContacts {
    [[EMClient sharedClient].contactManager addDelegate:self delegateQueue:nil];
}

- (void)stopObserveContacts {
    [[EMClient sharedClient].contactManager removeDelegate:self];
}

// The peer accepted a friend request. User A receives this event after User A sends a friend request to User B and User B accepts it.
- (void)friendRequestDidApproveByUser:(NSString *)username {
}

// The peer rejected a friend request. User A receives this event after User A sends a friend request to User B and User B rejects it.
- (void)friendRequestDidDeclineByUser:(NSString *)username {
}

// A friend request is received. User A receives this event after User B sends a friend request to User A.
- (void)friendRequestDidReceiveFromUser:(NSString *)username message:(NSString *)message {
}

// A friend was deleted. Both users receive this event after User B removes User A from the friend list.
- (void)friendshipDidRemoveByUser:(NSString *)username {
}

// A friend was added. Both users receive this event after User B accepts User A's friend request.
- (void)friendshipDidAddByUser:(NSString *)username {
}

// Friend information changed. Retrieve the updated friend information through contact.
- (void)onFriendInfoChanged:(EMContact *)contact {
}

@end
```

### Add friends

Adding a friend establishes a stable one-to-one chat relationship. After the peer accepts the request, the users become each other's friends. The current SDK supports only mutual friend relationships, not one-way friend or follow relationships.

The typical process is as follows:

1. Call `addContact` to send a friend request.
2. The peer receives the request through `friendRequestDidReceiveFromUser` and chooses to accept or reject it.
3. If the peer accepts, the users establish a friend relationship. If the peer rejects, the request ends.

You can call `addContact` to send a friend request:

```objectivec
[[EMClient sharedClient].contactManager addContact:@"userB"
                                            message:@"你好，我想添加你为好友"
                                         completion:^(NSString *username, EMError *error) {
    if (!error) {
        // The friend request was sent successfully.
    } else {
        // Failed to send the friend request.
    }
}];
```

The recipient receives the request through `friendRequestDidReceiveFromUser` and can accept or reject it as required:

 - Call `approveFriendRequestFromUser` to accept the friend request. The requester receives `friendRequestDidApproveByUser`, and both users receive `friendshipDidAddByUser`.
 - Call `declineFriendRequestFromUser` to reject the friend request. The requester receives `friendRequestDidDeclineByUser`.

```objectivec
// Accept the friend request.
[[EMClient sharedClient].contactManager approveFriendRequestFromUser:@"userB"
                                                           completion:^(NSString *username, EMError *error) {
    // Process the result based on error.
}];

// Reject the friend request.
[[EMClient sharedClient].contactManager declineFriendRequestFromUser:@"userB"
                                                           completion:^(NSString *username, EMError *error) {
    // Process the result based on error.
}];
```

:::tip
 - The server does not deliver duplicate friend request events. To display a list of pending requests, save each request locally when `friendRequestDidReceiveFromUser` is received.
 - The current SDK does not provide an API for retrieving the friend request list.
:::

### Delete friends

After you call `deleteContact` to delete a friend, the user is also removed from the peer's friend list, the friend relationship is removed for both users, and the peer receives the `friendshipDidRemoveByUser` event. This deletion does not require confirmation from the peer. We recommend adding a second confirmation in the app.

The API provides the `isDeleteConversation` parameter to control whether the local one-to-one conversation and messages associated with the friend are deleted:

- `true`: Delete the friend, local one-to-one conversation, and local messages.
- `false`: Delete only the friend and retain the local one-to-one conversation and local messages.

```swift
let username = "userId"

// Delete the friend and the corresponding local one-to-one conversation and messages.
EMClient.shared().contactManager?.deleteContact(
    username,
    isDeleteConversation: true
) { _, error in
    if let error = error {
        // Failed to delete the friend. Handle the failure based on the error code and error description.
        print("Failed to delete the friend. Error code: \(error.code)")
        print("Error description: \(error.errorDescription ?? "Unknown error")")
        return
    }

    // The friend, local one-to-one conversation, and messages were deleted successfully.
    print("Friend deleted successfully")
}
```

### Set friend remarks

Call `setContactRemark` to set remarks for a friend.

The remarks cannot exceed 100 characters. Pass `nil` to clear the friend remarks.

```objectivec
[[EMClient sharedClient].contactManager setContactRemark:@"userB"
                                                   remark:@"小李"
                                               completion:^(EMContact *contact, EMError *error) {
    if (!error) {
        // contact is the updated friend object.
    } else {
        // Failed to set the remarks.
    }
}];
```

### Retrieve the friend list and friend information

#### Automatically synchronize the friend list after login

The iOS SDK retrieves the latest friend data through data synchronization after login. Before initializing the SDK, set `EMOptions#dataSyncType` to include `EMDataSyncTypeContacts`. After the user logs in, the SDK automatically synchronizes the friend list and friend information and writes them locally.

**Enable automatic friend data synchronization**

Configure `EMDataSyncTypeContacts` before initializing the SDK. To synchronize other types of data, combine the corresponding enum values with bitwise operations.

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.dataSyncType = EMDataSyncTypeContacts;

// Initialize the SDK with options, and then call the asynchronous token login API.
```

**Monitor friend data synchronization states**

After automatic synchronization is enabled, use `EMClientDelegate` to monitor the start and completion of friend data synchronization:

 - `syncDataStartWithType`: Triggered when synchronization of a data type starts. A `type` value that includes `EMDataSyncTypeContacts` indicates that friend data synchronization has started.
 - `syncDataFinished`: Triggered when synchronization of a data type is complete. A `type` value that includes `EMDataSyncTypeContacts` and a `nil` error indicate that friend data was synchronized successfully.
 - Monitor friend relationship and friend information changes through `EMContactManagerDelegate`. See [Monitor friend relationship and friend information changes](#monitor-friend-relationship-and-friend-information-changes).
 - For friend user attribute change notifications in different scenarios, see [Monitor user attribute changes](userprofile.html#monitor-user-attribute-changes).

```objectivec
@interface ContactSyncObserver () <EMClientDelegate>
@end

@implementation ContactSyncObserver

- (void)startObserveSync {
    [[EMClient sharedClient] addDelegate:self delegateQueue:nil];
}

- (void)stopObserveSync {
    [[EMClient sharedClient] removeDelegate:self];
}

- (void)syncDataStartWithType:(EMDataSyncType)type {
    if ((type & EMDataSyncTypeContacts) == EMDataSyncTypeContacts) {
        // Friend data synchronization started.
    }
}

- (void)syncDataFinished:(EMError *)error type:(EMDataSyncType)type {
    if ((type & EMDataSyncTypeContacts) != EMDataSyncTypeContacts) {
        return;
    }
    if (!error) {
        // Friend data was synchronized successfully. You can read the local friend list and friend information.
    } else {
        // Failed to synchronize friend data.
    }
}

@end
```

#### Read the friend list locally

After friend data is synchronized successfully, call `getContacts` to retrieve the local list of friend user IDs, or call `getAllContacts` to retrieve the local list of friend objects. `EMContact` provides the following friend information:

 - `userId`: The friend's user ID.
 - `remark`: The friend remarks.
 - `userInfo`: The friend's user attributes, such as nickname and avatar. The value might be `nil` if the corresponding attributes do not exist locally.
 - `addTimestamp`: The millisecond timestamp when the friend was added.

:::tip
`getContacts`, `getAllContacts`, and `getContact` are local read APIs. After `syncDataFinished` confirms that friend synchronization succeeded, use this local data as the UI data source. Avoid performing time-consuming data processing on the main thread.
:::

#### Retrieve a user's attributes

To retrieve the attributes of a specified user, call the asynchronous `fetchUserInfoById` API. For details, see [Retrieve User Attributes](userinfo_provider.html).

This API returns user attributes rather than `EMContact` and can supplement the friend-list read APIs.

```objectivec
[[EMClient sharedClient].userInfoManager fetchUserInfoById:@[@"userB"]
                                                completion:^(NSDictionary<NSString *, EMUserInfo *> *userInfos, EMError *error) {
    if (!error) {
        EMUserInfo *userInfo = userInfos[@"userB"];
        // Use the nickname, avatar, and other attributes in userInfo.
    } else {
        // Failed to retrieve the attributes.
    }
}];
```

### Allow messages only between friends

EasyIM supports one-to-one messaging between non-friend users by default, which means users can chat without adding each other as friends. To allow one-to-one messages only between friends, [enable friend relationship check](/product/console/basic_user.html#好友关系检查) in the [EasyIM Console](https://console.easyim.ai/user/login). After it is enabled, the SDK checks the friend relationship when a user initiates a one-to-one chat. If a user sends a one-to-one message to a non-friend user, the SDK returns error code `221`, or `EMErrorUserNotOnRoster`.

## Blocklist management

The blocklist is independent of the friend system and is used primarily to manage users you need to block.

### Add a user to the blocklist

To block messages from a user, add the user to the blocklist. This operation applies to any user, whether or not the user is a friend. After being added to the blocklist, the user cannot send you messages or friend requests.

If the user added to the blocklist is a friend, the friend relationship remains in your friend list.

You can call `addUserToBlackList` to add a user to the blocklist:

```objectivec
[[EMClient sharedClient].contactManager addUserToBlackList:@"userB"
                                                completion:^(NSString *username, EMError *error) {
    if (!error) {
        // The user was added to the blocklist.
    } else {
        // Failed to add the user.
    }
}];
```

### Remove a user from the blocklist

Call `removeUserFromBlackList` to remove a user from the blocklist. After removal, the user can send messages and friend requests again.

```objectivec
[[EMClient sharedClient].contactManager removeUserFromBlackList:@"userB"
                                                     completion:^(NSString *username, EMError *error) {
    if (!error) {
        // The user was removed from the blocklist.
    } else {
        // Failed to remove the user.
    }
}];
```

### Retrieve the blocklist from the server

Call `getBlackListFromServerWithCompletion` to asynchronously retrieve the current user's blocklist from the server.

```objectivec
[[EMClient sharedClient].contactManager getBlackListFromServerWithCompletion:^(NSArray<NSString *> *userIds, EMError *error) {
    if (!error) {
        // userIds contains the list of blocklisted user IDs returned by the server.
    } else {
        // Failed to retrieve the blocklist.
    }
}];
```

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`addContact`](#add-friends) | `IEMContactManager` | Asynchronously send a friend request. |
| [`approveFriendRequestFromUser`](#add-friends) / [`declineFriendRequestFromUser`](#add-friends) | `IEMContactManager` | Asynchronously accept or reject a friend request. |
| [`deleteContact`](#delete-friends) | `IEMContactManager` | Asynchronously delete a friend and determine whether to delete the local conversation and messages based on the parameter. |
| [`setContactRemark`](#set-friend-remarks) | `IEMContactManager` | Asynchronously set friend remarks. |
| [`dataSyncType`](#automatically-synchronize-the-friend-list-after-login) | `EMOptions` | Set the data types to automatically synchronize after login. |
| [`getContacts`](#read-the-friend-list-locally) / [`getAllContacts`](#read-the-friend-list-locally) | `IEMContactManager` | Read the local list of friend user IDs or friend objects after friend synchronization succeeds. |
| [`fetchUserInfoById`](#retrieve-a-users-attributes) | `EMUserInfoManager` | Asynchronously retrieve a specified user's attributes. |
| [`addUserToBlackList`](#add-a-user-to-the-blocklist) | `IEMContactManager` | Asynchronously add a user to the blocklist. |
| [`removeUserFromBlackList`](#remove-a-user-from-the-blocklist) | `IEMContactManager` | Asynchronously remove a user from the blocklist. |
| [`getBlackListFromServerWithCompletion`](#retrieve-the-blocklist-from-the-server) | `IEMContactManager` | Asynchronously retrieve the blocklist from the server. |
