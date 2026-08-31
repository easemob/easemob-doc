# Automatic User Information Management

## Feature overview

EasyIM provides automatic user information management. After this feature is enabled, the SDK automatically maintains user information synchronization and in-memory updates, reducing the work required to manually retrieve, store, and update user information.

This feature applies to scenarios such as conversation lists, message lists, and group chat pages that display user nicknames, avatars, remarks, or group member name cards.

**User information on this page refers to user-related information displayed by your app, including [user attributes](userprofile.html), [friend remarks](user_relationship.html#set-friend-remarks), and [group member name cards](group_namecard.html).**

## Understand the tech

Automatic user information management is controlled by `EMOptions#enableUserInfo`. After it is enabled, the SDK synchronizes user information and updates local memory as follows:

1. After login succeeds, the SDK automatically retrieves the currently logged-in user's information from the server and writes it to local memory.
2. After the user updates their information, subsequent messages carry the corresponding information update time.
3. After the recipient receives a message, the SDK parses the sender information and update time in it.
4. The SDK compares the update time in the message with the timestamp in local memory.
5. If the update time in the message is later than the timestamp in local memory, the SDK automatically [retrieves the latest user attributes from the server](userprofile.html#retrieve-all-user-attributes-from-the-server) or the [group member name card](group_namecard.html#retrieve-a-chat-group-member-name-card-from-local-memory).
6. After retrieval succeeds, the SDK automatically updates local memory.
7. After local memory is updated, the SDK notifies the upper-layer app through an event, which the business layer can use to refresh the UI.

**The core of this feature is that the SDK automatically retrieves user information, detects updates, updates local memory, and sends change notifications.**

The memory update process is as follows:

![img](/images/ios/memory_update_userinfo_mgmt.png)

## Prerequisite

Before integration, ensure that the following requirements are met:

- Upgrade the SDK to v4.20.0 or later.
- Initialize the SDK. See [Quickstart](quickstart.html).
- Understand the relevant EasyIM limitations. See [Limitations](/product/limitation.html).

## Enable automatic user information management

Before initializing the SDK, set `EMOptions#enableUserInfo` to `true`:

```swift
let options = EMOptions.options(withAppkey: "your_appkey")
options.enableUserInfo = true
EMClient.shared().initializeSDK(with: options)
```

:::tip
You must set `EMOptions#enableUserInfo` before calling `initializeSDK` to initialize the SDK. Otherwise, the feature does not take effect.
:::

## Monitor user attribute updates

The SDK provides `EMUserInfoManagerDelegate` to monitor user attribute update events, primarily including:
- `onSelfUserInfoUpdate`: Triggered after the currently logged-in user's attributes are synchronized or updated and written to local memory.
- `onUserInfoUpdate`: Triggered after another user's attributes are updated and written to local memory, including the following scenarios:
  - A message is received from another user, and the sender's nickname or avatar in the message has changed. To receive user attribute update events in this scenario, enable automatic user information management.
  - Your app explicitly [retrieves user attributes from the server](userprofile.html#retrieve-all-user-attributes-from-the-server).
  - Your app explicitly [retrieves group member information from the server](group_members.html#retrieve-the-chat-group-member-list).

**We recommend registering the delegate during business initialization so that the app promptly receives events and refreshes the UI during initial synchronization after login, message-triggered updates, or explicit retrieval.** For user attribute change notifications in other scenarios, see [Monitor user attribute changes](userprofile.html#monitor-user-attribute-changes).

- Add a delegate:

```swift
EMClient.shared().userInfoManager?.add(self, delegateQueue: nil)
```

- Implement the user attribute update events:

```swift
extension YourViewController: EMUserInfoManagerDelegate {
    /// Event triggered when the currently logged-in user's attributes are updated.
    func onSelfUserInfoUpdate(_ aUserInfo: EMUserInfo) {
        print("Current user attributes updated - nickname:\(aUserInfo.nickname ?? ""), avatarUrl:\(aUserInfo.avatarUrl ?? "")")
    }

    /// Event triggered when another user's attributes are updated.
    func onUserInfoUpdate(_ aUserInfos: [String : EMUserInfo]) {
        for (userId, userInfo) in aUserInfos {
            print("User attributes updated - userId:\(userId), nickname:\(userInfo.nickname ?? ""), avatarUrl:\(userInfo.avatarUrl ?? "")")
        }
    }
}
```

## Obtain sender information through a message

After automatic user information management is enabled, if a sender includes their user information when sending a message, the SDK retrieves those user attributes again and triggers `onUserInfoUpdate` when the recipient receives the message and the sender's user attribute update time carried in the message is later than the local cache. This applies regardless of whether the sender and recipient are friends.

You can retrieve the currently available sender information through `senderInfo`, including the nickname, avatar, remarks, and group member name card.

```swift
func messagesDidReceive(_ aMessages: [EMChatMessage]) {
    for message in aMessages {
        if let senderInfo = message.senderInfo {
            let nickname = senderInfo.nickname ?? ""
            let avatarUrl = senderInfo.avatarUrl ?? ""
            let remark = senderInfo.remark ?? ""
            let namecard = senderInfo.groupNameCard ?? ""
            print("Sender information - nickname:\(nickname), avatarUrl:\(avatarUrl), remark:\(remark), namecard:\(namecard)")
        }
    }
}
```

:::tip
`senderInfo` returns the currently available local sender information. If the message triggers a user information update, the SDK notifies the business layer through the relevant event after it finishes updating local memory with the latest data.
:::

## Read user attributes from local memory

To read user attributes directly from local memory, call `getUserInfoByIds`. This API does not initiate a network request and is suitable for local display.

```swift
let result = EMClient.shared().userInfoManager?.getUserInfo(byIds: ["userId1", "userId2"])
if let userInfoMap = result {
    for (userId, userInfo) in userInfoMap {
        print("User information - userId:\(userId), nickname:\(userInfo.nickname ?? ""), avatarUrl:\(userInfo.avatarUrl ?? "")")
    }
}
```

:::tip
This API returns only data in local memory. To explicitly retrieve the latest user attributes from the server, call `fetchUserInfoById`. For details, see [Manage User Attributes](userprofile.html#retrieve-all-user-attributes-from-the-server).
:::

## Considerations

- `EMOptions#enableUserInfo` must be set before SDK initialization.
- Prefer registering `EMUserInfoManagerDelegate` early so that your business UI can be refreshed promptly after local memory is updated.
- `senderInfo` represents the currently available local sender information and is not guaranteed to be the final latest value immediately after a message is received.
- When the update time in a message is later than that in local memory, the SDK automatically retrieves the latest data from the server and updates local memory.
- `getUserInfoByIds` queries only local memory and does not explicitly retrieve the latest data from the server.

## FAQ

#### When should automatic user information management be enabled?

Set it before calling `initializeSDK` to initialize the SDK. If it is set after SDK initialization is complete, automatic user information management does not take effect.

#### What does the SDK do automatically after the feature is enabled?

After automatic user information management is enabled with `EMOptions#enableUserInfo`, the SDK automatically synchronizes the currently logged-in user's information after login succeeds; includes sender information and its update time when sending messages; compares the update time in a received message with local memory; retrieves the latest information from the server and updates local memory when it detects updated data; and notifies the business layer through an event.

#### Is EMChatMessage#senderInfo always up to date?

No. `senderInfo` returns the currently available local sender information. If the message triggers a user information update, the SDK first retrieves the latest data from the server and updates local memory, and then notifies the business layer through the relevant event to refresh the UI.

#### Why should the delegate be registered early?

After [automatic user information management is enabled](#enable-automatic-user-information-management), the SDK might notify the business layer during initial synchronization after login or message-triggered user information updates. We recommend registering `EMUserInfoManagerDelegate` during business initialization so that the app can promptly receive events and refresh the UI.

#### What is the difference between reading locally and retrieving from the server?

`getUserInfoByIds` queries only local memory and does not initiate a network request, making it suitable for local display. To obtain the latest user attributes, explicitly call the corresponding [API](userprofile.html#retrieve-all-user-attributes-from-the-server).

#### Must the app maintain memory after the feature is enabled?

Generally, no. After `EMOptions#enableUserInfo` is enabled, the SDK automatically synchronizes user information, compares update times, updates local memory, and sends event notifications. The business layer generally only needs to read data from local memory and refresh the UI in the relevant events.

## Related features

### Manage group member name cards

After automatic user information management is enabled, the SDK also automatically synchronizes and updates group member name cards. You can further implement setting, querying, and change monitoring for group member name cards. For details, see [Manage Group Member Name Cards](group_namecard.html).

### User attributes and user information

- User information refers to user-related information displayed by your app, including the user's [nickname and avatar](userprofile.html), [remarks](user_relationship.html#set-friend-remarks), and [group member name card](group_namecard.html).
- User attributes are profile fields that users can set and manage, such as nickname, avatar, email address, and phone number. Set, update, and query these fields through the relevant APIs. For details, see [Manage User Attributes](userprofile.html). For example, call `updateOwnUserInfo` to set the currently logged-in user's nickname, avatar, and other information. If automatic user information management is enabled by setting `EMOptions#enableUserInfo` to `true`, the updated information is automatically synchronized in subsequent messages.
  
### Sender information synchronized through messages

After automatic user information management is enabled, received messages contain sender-related information, including the nickname, avatar, remarks, and group member name card.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`enableUserInfo`](#understand-the-tech) | `EMOptions` | Enable the user information service. |
| [`updateOwnUserInfo:completion:`](#user-attributes-and-user-information) | `IEMUserInfoManager` | Update the current user's information. |
| [`fetchUserInfoById:completion:`](#read-user-attributes-from-local-memory) | `IEMUserInfoManager` | Retrieve user information from the server. |
| [`getUserInfoByIds:`](#read-user-attributes-from-local-memory) | `IEMUserInfoManager` | Retrieve local user information. |
| [`senderInfo`](#obtain-sender-information-through-a-message) | `EMChatMessage` | Retrieve the message sender's information. |
