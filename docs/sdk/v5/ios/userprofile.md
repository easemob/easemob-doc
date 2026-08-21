# Manage User Attributes

## Feature overview
User attributes are information about users who interact through real-time messages, such as nickname, avatar, email address, phone number, gender, signature, and birthday. For example, in a recruitment scenario, user attributes can store gender, email address, user type (candidate), and position type (Web development).

This document describes how to set, update, retrieve, monitor, and subscribe to user attributes.

:::tip
To ensure user information security, the SDK allows users to set or update only their own user attributes.
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

 - Initialize and log in to iOS SDK V5. See [Quickstart](quickstart.html).
 - Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Limitations

 - All attributes of a single user cannot exceed 2 KB.
 - All user attribute data in a single app cannot exceed 10 GB.
 - If calls to APIs for setting or retrieving user attributes exceed the frequency limit, error code `4`, or `EMErrorExceedServiceLimit`, is returned.

## Set the current user's attributes

### Set all attributes of the current user

Call `updateOwnUserInfo` to set or update multiple or all attributes of the current user at once.

```objectivec
EMUserInfo *userInfo = [[EMUserInfo alloc] init];
userInfo.userId = [EMClient sharedClient].currentUsername;
userInfo.nickname = @"easemob";
userInfo.avatarUrl = @"https://www.easemob.com/avatar.png";
userInfo.birth = @"2000.10.10";
userInfo.sign = @"hello world";
userInfo.phone = @"13333333333";
userInfo.mail = @"123456@example.com";
userInfo.gender = 1;

[[EMClient sharedClient].userInfoManager updateOwnUserInfo:userInfo
                                                 completion:^(EMUserInfo *updatedUserInfo, EMError *error) {
    if (!error) {
        // updatedUserInfo contains the updated attributes of the current user.
    } else {
        // Failed to set the attributes.
    }
}];
```

The client uses the following keys to store user attributes by default. When [setting](/document/server-side/user_attribute_set.html) or [deleting user attributes](/document/server-side/user_attribute_delete.html) through a RESTful API, use the same keys so that the client can read them correctly.

| Field | Type | Description |
| :--- | :--- | :--- |
| `nickname` | `NSString *` | The user nickname, which cannot exceed 64 characters. |
| `avatarurl` | `NSString *` | The user avatar URL, which cannot exceed 256 characters. |
| `phone` | `NSString *` | The user contact information, which cannot exceed 32 characters. |
| `mail` | `NSString *` | The user email address, which cannot exceed 64 characters. |
| `gender` | `NSInteger` | The user gender:<br/> - `1`: Male.<br/> - `2`: Female.<br/> - `0` (default): Unknown.<br/> - Any other value is invalid. |
| `sign` | `NSString *` | The user signature, which cannot exceed 256 characters. |
| `birth` | `NSString *` | The user birthday, which cannot exceed 64 characters. |
| `ext` | `NSString *` | The extension field. |

### Set an attribute of the current user

Call `updateOwnUserInfo` to set an attribute of the current user. For example, change the avatar:

```objectivec
NSString *avatarUrl = @"https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png";

[[EMClient sharedClient].userInfoManager updateOwnUserInfo:avatarUrl
                                                   withType:EMUserInfoTypeAvatarURL
                                                 completion:^(EMUserInfo *updatedUserInfo, EMError *error) {
    if (!error) {
        // The attribute was updated successfully.
    } else {
        // Failed to update the attribute.
    }
}];
```

## Retrieve user attributes

### Retrieve all user attributes from the server

Call `fetchUserInfoById` to asynchronously retrieve all attributes of one or more users from the server. You can pass no more than 100 user IDs each time.

When the user attribute update timestamp returned by the server is later than the locally stored timestamp, the SDK updates the local data and triggers the `onUserInfoUpdate` callback.

```objectivec
// You can pass no more than 100 user IDs each time.
NSArray<NSString *> *userIds = @[@"user1", @"user2"];

[[EMClient sharedClient].userInfoManager fetchUserInfoById:userIds
                                                completion:^(NSDictionary<NSString *, EMUserInfo *> *userInfos, EMError *error) {
    if (!error) {
        EMUserInfo *userInfo = userInfos[@"user1"];
        // Use properties such as userInfo.nickname and userInfo.avatarUrl.
    } else {
        // Failed to retrieve the attributes.
    }
}];
```

### Retrieve specified user attributes from the server

Call `fetchUserInfoById` to asynchronously retrieve one or more specified attributes of specified users from the server. If the returned user attribute update timestamp is later than the locally stored timestamp, the SDK updates the local data and triggers the `onUserInfoUpdate` callback.

```objectivec
NSArray<NSString *> *userIds = @[@"user1", @"user2"];
NSArray<NSNumber *> *types = @[
    @(EMUserInfoTypeAvatarURL),
    @(EMUserInfoTypePhone),
    @(EMUserInfoTypeMail)
];

[[EMClient sharedClient].userInfoManager fetchUserInfoById:userIds
                                                       type:types
                                                 completion:^(NSDictionary<NSString *, EMUserInfo *> *userInfos, EMError *error) {
    if (!error) {
        // Each key in userInfos is a user ID, and its value contains the user attributes.
    } else {
        // Failed to retrieve the attributes.
    }
}];
```

### Read user attributes from local memory

`getUserInfoByIds` reads user attributes from local memory, but this API is synchronous. To maintain an asynchronous call flow when your business requires the latest attributes, use `fetchUserInfoById` or `fetchUserInfoById` and consume the result in the completion callback.

:::tip
To have the SDK automatically synchronize the friend list and friend information after login succeeds, configure `EMDataSyncTypeContacts` through `EMOptions#dataSyncType` before initializing the SDK. After synchronization is complete, you can use the local friend data. For details about automatic data synchronization after login succeeds, see [Automatically synchronize the friend list after login](user_relationship.html#automatically-synchronize-the-friend-list-after-login).
:::

## Subscribe to attribute changes of non-friend users

The SDK supports subscribing to attribute changes of non-friend users. After subscription, the app promptly receives notifications when the attributes of specified non-friend users change.

This feature applies to the following scenarios:

 - Update the peer user's nickname, avatar, and other attributes promptly in a non-friend conversation.
 - Detect attribute changes of non-friend users in scenarios such as temporary conversations and customer service communications.
 - Maintain the latest attributes of specified non-friend users when displaying group members and in similar scenarios.

:::tip
This feature applies only to non-friend users. For details about user attribute change notifications for the current user, non-friend users, and friends, see [User attribute change events](#monitor-user-attribute-changes).
:::

### Subscribe to attribute change events of non-friend users

Call `subscribeUsersInfo` to subscribe to user attribute change events of non-friend users. After subscription succeeds, the SDK triggers `onUserInfoUpdate` when the attributes of these users change.

```objectivec
NSArray<NSString *> *userIds = @[@"user1", @"user2"];

[[EMClient sharedClient].userInfoManager subscribeUsersInfo:userIds completion:^(EMError *error) {
    if (!error) {
        // Subscribed successfully.
    } else {
        // Failed to subscribe.
    }
}];
```

### Unsubscribe from attribute change events of non-friend users

Call `unsubscribeUsersInfo` to unsubscribe from attribute change events of non-friend users.

```objectivec
[[EMClient sharedClient].userInfoManager unsubscribeUsersInfo:userIds completion:^(EMError *error) {
    if (!error) {
        // Unsubscribed successfully.
    } else {
        // Failed to unsubscribe.
    }
}];
```

### Retrieve the list of users whose attribute change events are subscribed to

Call `fetchSubscribedUsers` to asynchronously retrieve the list of users whose attribute change events are subscribed to. The list contains the user IDs and user attributes of subscribed non-friend users.

```objectivec
[[EMClient sharedClient].userInfoManager fetchSubscribedUsers:^(NSArray<EMUserInfo *> *users, EMError *error) {
    if (!error) {
        // users contains the attributes of subscribed users.
    } else {
        // Failed to retrieve the list.
    }
}];
```

### Memory

If you do not subscribe to attribute changes of non-friend users, the app generally needs to explicitly call an asynchronous retrieval API to retrieve user attributes when required by the business. To reduce unnecessary network requests, determine whether to [retrieve data from the server](#retrieve-all-user-attributes-from-the-server) based on your business requirements.

## Monitor user attribute changes

Attribute updates of both friends and non-friend users can trigger the SDK's `onUserInfoUpdate` event in the following ways:

1. **Explicit update retrieval**: When the app calls an API to [retrieve user attributes from the server](#retrieve-all-user-attributes-from-the-server) or [retrieve group member information from the server](group_members.html#获取群成员列表), if the user attribute update timestamp returned by the server is later than the locally stored timestamp, the SDK automatically updates the local data and triggers this event.
2. **Updates carried in messages**: If [automatic user information management](userinfo_provider.html#enable-automatic-user-information-management) is enabled, when a message is received and the sender's user attribute update time carried in the message is later than the local cache, the SDK retrieves the user attributes again and triggers this event. This mechanism applies to both friend and non-friend senders.
3. **Subscribed user changes (non-friend users only)**: If the app has [subscribed to attribute change events of non-friend users](#subscribe-to-attribute-change-events-of-non-friend-users), the SDK also triggers this event when the attributes of these subscribed non-friend users change.

**Special notes**

 - **Current user**: Attribute changes of the current user are returned separately through `onSelfUserInfoUpdate` and do not use the `onUserInfoUpdate` logic described above.
 - **Friend users only**: If [automatic friend list synchronization after login](user_relationship.html#automatically-synchronize-the-friend-list-after-login) is enabled, the SDK automatically retrieves and updates local friend data after login. When a friend's attributes change, the `onFriendInfoChanged` event is triggered. This event is specific to friend relationships and is distinct from `onUserInfoUpdate`.

Register the delegate through `addDelegate` and remove it through `removeDelegate` when it is no longer needed:

```objectivec
@interface UserInfoObserver () <EMUserInfoManagerDelegate>
@end

@implementation UserInfoObserver

- (void)startObserveUserInfo {
    [[EMClient sharedClient].userInfoManager addDelegate:self delegateQueue:nil];
}

- (void)stopObserveUserInfo {
    [[EMClient sharedClient].userInfoManager removeDelegate:self];
}

- (void)onSelfUserInfoUpdate:(EMUserInfo *)userInfo {
    // The current user's attributes were updated.
}

- (void)onUserInfoUpdate:(NSDictionary<NSString *, EMUserInfo *> *)userInfos {
    // Other users' attributes were updated. Each key is a user ID, and its value contains the user attributes.
}

@end
```

## FAQ

### Why can't I retrieve a user nickname after setting it?

If you have set a user nickname through the [client](#set-all-attributes-of-the-current-user) or [RESTful API](/document/server-side/user_attribute_set.html) but cannot retrieve it correctly, check the following:

 - When setting the user nickname through a RESTful API, use the `nickname` key in the request. Otherwise, the client cannot read the attribute correctly.
 - The `nickname` returned by the RESTful APIs for [retrieving user details](/document/server-side/account_detail_obtain_single.html) and [deleting a user account](/document/server-side/account_delete_single.html) is the push nickname displayed in offline push notifications, which differs from the nickname in user attributes. We recommend keeping them consistent. When changing one nickname, update the other at the same time.

For iOS, call [updatePushDisplayName](/document/ios/push/push_display_attribute.html#设置和获取推送通知的显示属性) to update the push nickname. For the RESTful API, see [Configure Display Attributes for Offline Push Notifications](/document/server-side/push_nickname_set_single.html).

### Why is error code 4 returned?

If calls to APIs for setting or retrieving user attributes exceed the frequency limit, error code `4`, or `EMErrorExceedServiceLimit`, is returned.

## Related features

### User avatar management

If your business involves user avatar management, use the following process:

1. Activate a third-party file storage service.
2. Upload the avatar file to the third-party storage and retrieve the file URL.
3. Write the URL to the `avatarUrl` field in the user attributes.
4. Call `fetchUserInfoById` to retrieve the avatar URL and render it in the local UI.

### Business card messages

To send a business card message, you can also implement it with custom attributes:

```objectivec
// Set the custom message event to userCard, and add fields such as the user ID, nickname, and avatar required to display the business card to customExt.
NSDictionary *messageExt = @{
    @"userId" : [EMClient sharedClient].currentUsername,
    @"nickname" : @"nickname",
    @"avatar" : @"https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png"
};
EMCustomMessageBody *body = [[EMCustomMessageBody alloc] initWithEvent:@"userCard" customExt:messageExt];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:@"conversationId"
                                                                   from:[EMClient sharedClient].currentUsername
                                                                     to:@"receiver"
                                                                   body:body
                                                                    ext:nil];
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
    // Handle the sending result based on error.
}];
```

To display more business card information, add more fields to `customExt`. Both the keys and values in `customExt` must be strings.

A business card message carries custom events and extension fields through `EMCustomMessageBody` and is then created and sent with `EMChatMessage`. See the [GitHub](https://github.com/easemob/easemob-uikit-ios) or [Gitee](https://gitee.com/easemob-code/easemob-uikit-ios) UIKit sample project for information about implementing message display.

### User attributes and user information

User information refers to user-related information displayed by your app, including user attributes, [friend remarks](user_relationship.html#set-friend-remarks), and [group member name cards](group_namecard.html). For details about user information, see [Automatic User Information Management](userinfo_provider.html).

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`updateOwnUserInfo`](#set-all-attributes-of-the-current-user) | `IEMUserInfoManager` | Asynchronously set or update multiple attributes of the current user. |
| [`updateOwnUserInfo`](#set-an-attribute-of-the-current-user) | `IEMUserInfoManager` | Asynchronously set or update an attribute of the current user. |
| [`fetchUserInfoById`](#retrieve-all-user-attributes-from-the-server) | `IEMUserInfoManager` | Asynchronously retrieve all attributes of one or more users. |
| [`fetchUserInfoById`](#retrieve-specified-user-attributes-from-the-server) | `IEMUserInfoManager` | Asynchronously retrieve specified attributes of specified users. |
| [`subscribeUsersInfo`](#subscribe-to-attribute-change-events-of-non-friend-users) | `IEMUserInfoManager` | Asynchronously subscribe to attribute change events of non-friend users. |
| [`unsubscribeUsersInfo`](#unsubscribe-from-attribute-change-events-of-non-friend-users) | `IEMUserInfoManager` | Asynchronously unsubscribe from attribute change events of non-friend users. |
| [`fetchSubscribedUsers`](#retrieve-the-list-of-users-whose-attribute-change-events-are-subscribed-to) | `IEMUserInfoManager` | Asynchronously retrieve the list of users whose attribute change events are subscribed to. |
| [`userId`](#set-all-attributes-of-the-current-user) / [`nickname`](#set-all-attributes-of-the-current-user) / [`avatarUrl`](#set-all-attributes-of-the-current-user) | `EMUserInfo` | Retrieve the user ID, nickname, and avatar URL. |
| [`mail`](#set-all-attributes-of-the-current-user) / [`phone`](#set-all-attributes-of-the-current-user) / [`gender`](#set-all-attributes-of-the-current-user) | `EMUserInfo` | Retrieve the user email address, contact information, and gender. |
| [`sign`](#set-all-attributes-of-the-current-user) / [`birth`](#set-all-attributes-of-the-current-user) / [`ext`](#set-all-attributes-of-the-current-user) | `EMUserInfo` | Retrieve the user signature, birthday, and extension field. |
