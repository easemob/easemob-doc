# Manage Chat Group Member Name Cards

## Feature overview

A chat group member name card is a user's personalized display information in a specific chat group. It distinguishes how the user is presented in different chat groups, for example, by showing their department, position, or project role.

For example, in an enterprise chat group, a member can set their name card to a format such as “Department-Name” or “Position-Name” so that other members can quickly identify and communicate with them.

The EasyIM iOS SDK provides chat group member name card management, including setting, local retrieval, server-side retrieval, and change monitoring. After automatic user information management is enabled, the SDK can also automatically synchronize chat group member name card updates through messages.

## Understand the tech

Chat group member name card management is mainly provided by `EMGroupManager` and `EMGroupManagerDelegate`. The SDK manages name cards through explicit setting or retrieval, local memory storage, event notifications, and automatic synchronization triggered by messages:

1. The current logged-in user can call `updateGroupNamecard` to set or update their name card in a specified chat group.
2. When a name card changes and is synchronized to local memory, the SDK notifies the app through the `onUserGroupNamecardChanged` event.
3. The SDK supports calling `fetchGroupMemberInfoListFromServer` to retrieve chat group member details in batches from the server and write the returned name cards to local memory.
4. The SDK supports calling `getGroupNamecard` to read a specified member's name card in a specified chat group from local memory.
5. If `EMOptions#enableUserInfo` is enabled, the SDK automatically attaches the sender's name card update time when sending a message. When the recipient detects that the update time in the message is later than the value in local memory, the SDK automatically retrieves the latest name card from the server, updates local memory, and notifies the app of the event.

The memory update process is shown below:

![img](/images/ios/memory_update_groupcard.png)

## Prerequisite

Before integration, make sure that the following requirements are met:

- The SDK has been upgraded to v4.20.0 or later.
- The SDK has been initialized. For details, see [Quickstart](quickstart.html).
- You understand the usage limits of EasyIM. For details, see [Usage limits](/product/limitation.html).

## Monitor chat group member name card updates

The SDK provides `EMGroupManagerDelegate` for monitoring chat group member name card updates. We recommend registering the delegate during app initialization so that the UI can be refreshed promptly after a name card changes.

When a name card changes and is synchronized to local memory, the SDK triggers the `onUserGroupNamecardChanged` event. This event applies in the following scenarios:

- After the current logged-in user updates a name card, other **online members** in the chat group receive the update notification.
- After the latest chat group member details are retrieved from the server and written to local memory.
- After automatic synchronization is triggered by a received message and the data is written to local memory when `EMOptions#enableUserInfo` is enabled.

1. Add the delegate:

```swift
EMClient.shared().groupManager?.add(self, delegateQueue: nil)
```

2. Implement the name card update event:

```swift
extension YourViewController: EMGroupManagerDelegate {
    func onUserGroupNamecardChanged(_ groupId: String, userId: String, namecard: String?) {
        print("群成员名片更新 - groupId:\(groupId), userId:\(userId), namecard:\(namecard ?? \"\")")
    }
}
```

## Set a chat group member name card

Call `updateGroupNamecard` to set or update the current logged-in user's name card in a specified chat group. Pass `nil` to delete the name card. After other online members receive the corresponding update notification, they receive the `onUserGroupNamecardChanged` event.

```swift
EMClient.shared().groupManager?.updateGroupNamecard("groupId", namecard: "new_namecard") { error in
    if let error = error {
        print("设置群成员名片失败：\(error.errorDescription)")
    } else {
        print("设置群成员名片成功")
    }
}
```

## Retrieve chat group member name cards from the server

Call `fetchGroupMemberInfoListFromServer` to retrieve chat group member details in batches from the server. The returned `EMGroupMemberInfo` contains fields such as `namecard`, `nickname`, and `avatarUrl`. After a successful retrieval, the data is automatically updated in local memory.

```swift
EMClient.shared().groupManager?.fetchGroupMemberInfoListFromServer(withGroupId: "groupId", cursor: "", limit: 20) { result, error in
    if let error = error {
        print("获取群成员信息失败：\(error.errorDescription)")
        return
    }
    if let list = result?.list {
        for member in list {
            let userId = member.userId
            let nickname = member.nickname
            let avatarUrl = member.avatarUrl
            let namecard = member.namecard
            print("userId:\(userId ?? \"\"), nickname:\(nickname ?? \"\"), avatarUrl:\(avatarUrl ?? \"\"), namecard:\(namecard ?? \"\")")
        }
    }
}
```

## Retrieve a chat group member name card from local memory

Call `getGroupNamecard` to read a specified member's name card in a specified chat group from local memory. This API does not make a network request and is suitable for local display scenarios.

```swift
let namecard = EMClient.shared().groupManager?.getGroupNamecard(withGroupId: "groupId", userId: "userId")
print("群成员名片：\(namecard ?? \"\")")
```

## Automatically synchronize chat group member name cards through messages

To automatically attach name card information when sending messages and update local memory when receiving messages, enable automatic user information management by setting `EMOptions#enableUserInfo` to `true`.

```swift
let options = EMOptions(appkey: "your_appkey")
options.enableUserInfo = true
EMClient.shared().initializeSDK(with: options)
```

:::tip
You must set `EMOptions#enableUserInfo` before calling `EMClient.shared().initializeSDK(with: options)`. Otherwise, automatic synchronization does not take effect.
:::

After automatic user information management is enabled, the SDK performs the following operations:

1. After the current logged-in user updates their name card, subsequent messages automatically include the name card update time.
2. After the recipient receives a message, the SDK compares the name card update time in the message with the value in local memory.
3. If the update time in the message is later than the value in local memory, the SDK automatically retrieves the latest name card from the server.
4. After a successful retrieval, the SDK updates local memory and triggers the `onUserGroupNamecardChanged` event.

You can also use `senderInfo` to obtain the currently available name card information of the message sender. For details, see [Automatic user information management](userinfo_provider.html#retrieve-sender-information-through-messages).

## Notes

- A chat group member name card is a user's display information in a specific chat group; name cards in different chat groups do not affect each other.
- `getGroupNamecard` reads only local memory and does not proactively retrieve the latest data from the server.
- The chat group member details returned by `fetchGroupMemberInfoListFromServer` are automatically written to local memory.
- `onUserGroupNamecardChanged` is delivered only to online users.
- To automatically synchronize name cards through messages, you must enable `EMOptions#enableUserInfo` before SDK initialization.
- After `EMOptions#enableUserInfo` is enabled, automatic name card updates depend on messages. If the app needs to proactively retrieve the latest data, it should still call the server-side API.

## FAQ

#### Why do other members not receive an event immediately after a chat group member name card is set?

After `updateGroupNamecard` is called, the current logged-in user's name card in the specified chat group is updated. Other **online members** receive the `onUserGroupNamecardChanged` event only after they receive the corresponding update notification.

#### Why does getGroupNamecard not return a chat group member name card?

`getGroupNamecard` reads data only from local memory and does not proactively retrieve the latest information from the server. If the member's name card has not been cached locally, the result may be empty. In this case, call `fetchGroupMemberInfoListFromServer` first to retrieve the chat group member details from the server.

#### Are chat group member details retrieved from the server written to memory?

Yes. After `fetchGroupMemberInfoListFromServer` successfully retrieves chat group member details from the server, the returned name cards and other data are written to local memory. You can then read them directly through `getGroupNamecard`.

#### Why are chat group member name cards updated automatically when automatic user information management is enabled?

After `EMOptions#enableUserInfo` is enabled, messages automatically include the sender's name card update time. After the recipient receives a message, the SDK compares the update time in the message with the value in local memory. If the update time in the message is later, the SDK automatically retrieves the latest name card from the server and updates local memory.

#### Do I still need to retrieve chat group member name cards from the server after automatic synchronization through messages?

It depends on the app scenario. Automatic synchronization through messages depends on a message being received. If the app needs the latest name card immediately, or no message triggers synchronization, we still recommend calling `fetchGroupMemberInfoListFromServer` to proactively retrieve the latest data.

## Related documents

- [Automatic user information management](userinfo_provider.html)
- [Manage user attributes](userprofile.html)
- [Usage limits](/product/limitation.html)

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| `updateGroupNamecard:namecard:completion:` | `EMGroupManager` | Updates or deletes the current user's chat group member name card. |
| `getGroupNamecardWithGroupId:userId:` | `EMGroupManager` | Retrieves a local chat group member name card. |
| `fetchGroupMemberInfoListFromServerWithGroupId:cursor:limit:completion:` | `EMGroupManager` | Retrieves chat group member details from the server. |
| [`senderInfo`](#automatically-synchronize-chat-group-member-name-cards-through-messages) | `EMChatMessage` | Obtains the sender's information from a message. |
