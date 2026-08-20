# Manage Group Member Name Cards

## Feature overview

A group member name card is a user's personalized display information in a specific chat group. It distinguishes the user's identity across groups, such as department, position, or project role.

For example, in an enterprise group, a member can set the name card to “Department-Name” or “Position-Name” so other members can quickly identify and communicate with the user.

The EasyIM Android SDK provides group member name card management, including setting name cards, querying them locally, retrieving them from the server, and monitoring changes. When [automatic user information management](userinfo_provider.html) is enabled, the SDK can also automatically synchronize name card updates through messages.

## Understand the tech

Group member name card management is primarily provided by `EMGroupManager` and `EMGroupChangeListener`. The SDK manages name cards through explicit setting or retrieval, local memory storage, event notifications, and message-triggered automatic synchronization:

1. The current user can call `EMGroupManager#asyncUpdateGroupNamecard` to set or update their name card in a specified group.
2. After a name card change is synchronized to local memory, the SDK notifies the business layer through `EMGroupChangeListener#onUserGroupNamecardUpdated`.
3. The SDK supports calling `EMGroupManager#asyncFetchGroupMembersInfo` to batch-retrieve group member information from the server and writes the returned name cards to local memory.
4. The SDK supports calling `EMGroupManager#getGroupNamecard` to read a specified member's name card in a specified group from local memory.
5. If `EMOptions#setEnableUserInfo(true)` is also enabled, messages automatically include the sender's name-card update time. If the recipient detects a newer update time than the value in local memory, the SDK automatically retrieves the latest name card from the server, updates local memory, and triggers an event to notify the business layer. Name card data in local memory comes from explicit server retrieval and message-triggered automatic synchronization.

The memory update process is shown below:

![img](/images/android/memory_update_groupcard.png)

## Prerequisite

Before integration, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. See [Quickstart](quickstart.html).
- Understand the relevant EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Monitor group member name card updates

The SDK provides `EMGroupChangeListener` for monitoring group member name card updates. Register the listener during application initialization so the UI can be refreshed promptly after a name card is updated.

After a name card change is synchronized to local memory, the SDK triggers `EMGroupChangeListener#onUserGroupNamecardUpdated` in the following scenarios:

- Other **online members** receive a notification after the current user updates a name card.
- The latest group member information is retrieved through a server-side API and local memory is updated.
- With `EMOptions#setEnableUserInfo(true)`, a recipient triggers automatic synchronization by receiving a message and local memory is updated.

- Add a listener:

```java
EMClient.getInstance().groupManager().addGroupChangeListener(new EMGroupChangeListener() {
    @Override
    public void onUserGroupNamecardUpdated(String groupId, String userId, String groupNamecard) {
        EMLog.d("GroupNamecard", "群成员名片更新 - groupId:" + groupId
                + ", userId:" + userId
                + ", namecard:" + groupNamecard);
    }
});
```

## Set a group member name card

Call `EMGroupManager#asyncUpdateGroupNamecard` to set or update the current user's name card in a specified group. Pass `null` to delete your name card. After other online group members receive the corresponding name card change notification, `EMGroupChangeListener#onUserGroupNamecardUpdated` is triggered.

```java
// Asynchronous method.
// If `namecard` is `null`, clear the current user's name card in this group.
EMClient.getInstance().groupManager().asyncUpdateGroupNamecard("groupId", "new_namecard", new EMCallBack() {
    @Override
    public void onSuccess() {
        EMLog.d("GroupNamecard", "设置群成员名片成功");
    }

    @Override
    public void onError(int code, String error) {
        EMLog.e("GroupNamecard", "设置群成员名片失败：" + code + ", " + error);
    }
});
```

## Retrieve group member name cards from the server

Call `EMGroupManager#asyncFetchGroupMembersInfo` to retrieve group member information from the server by page. To retrieve group member name cards, nicknames, and avatars, call `EMOptions#setEnableUserInfo(true)` before SDK initialization to enable [automatic user information management](userinfo_provider.html). Otherwise, the returned `EMGroupMemberInfo` does not contain `namecard`, `nickname`, or `avatarUrl`. After a successful retrieval, the data is automatically updated in local memory.

```java
// Asynchronous method.
// The value range of `pageSize` is 1-50.
// Pass `null` for `cursor` on the first call and the cursor returned by the previous call on subsequent calls.
EMClient.getInstance().groupManager().asyncFetchGroupMembersInfo("groupId", "", 20,
        new EMValueCallBack<EMCursorResult<EMGroupMemberInfo>>() {
            @Override
            public void onSuccess(EMCursorResult<EMGroupMemberInfo> result) {
                for (EMGroupMemberInfo member : result.getData()) {
                    String userId = member.getUserId();
                    String nickname = member.getNickname();
                    String avatarUrl = member.getAvatarUrl();
                    String namecard = member.getNamecard();
                    EMLog.d("GroupNamecard", "userId:" + userId
                            + ", nickname:" + nickname
                            + ", avatarUrl:" + avatarUrl
                            + ", namecard:" + namecard);
                }
            }

            @Override
            public void onError(int code, String error) {
                EMLog.e("GroupNamecard", "获取群成员信息失败：" + code + ", " + error);
            }
        });
```

## Retrieve a group member name card from local memory

Call `EMGroupManager#getGroupNamecard` to read a specified member's name card in a specified group from local memory. This API does not initiate a network request and is suitable for local display scenarios.

```java
String namecard = EMClient.getInstance().groupManager().getGroupNamecard("groupId", "userId");
EMLog.d("GroupNamecard", "群成员名片：" + namecard);
```

## Automatically synchronize group member name cards through messages

To automatically include group member name card information when sending messages and update local memory when receiving messages, enable [automatic user information management](userinfo_provider.html) by calling `EMOptions#setEnableUserInfo(true)`.

```java
EMOptions options = new EMOptions();
options.setAppKey("your_appkey");
options.setEnableUserInfo(true);
EMClient.getInstance().init(context, options);
```

:::tip
You must call `EMOptions#setEnableUserInfo(true)` before `EMClient.getInstance().init(context, options)`. Otherwise, automatic synchronization does not take effect.
:::

After automatic user information management is enabled, the SDK performs the following operations:

1. After the current user updates their name card, subsequent messages automatically include the name-card update time.
2. After receiving a message, the recipient compares the name-card update time in the message with the value in local memory.
3. If the message contains a later update time, the SDK automatically retrieves the latest name card from the server.
4. After a successful retrieval, the SDK updates local memory and triggers `EMGroupChangeListener#onUserGroupNamecardUpdated`.

You can also call `EMMessage#getSenderInfo()` to obtain the currently available group member name card information for the message sender. See [Automatic user information management](userinfo_provider.html#通过消息获取发送方信息).

## Considerations

- A name card is specific to a chat group and does not affect other groups.
- `EMGroupManager#getGroupNamecard` queries only local memory and does not retrieve the latest data from the server.
- Group member information returned by `EMGroupManager#asyncFetchGroupMembersInfo` is automatically updated in local memory. The information returned by this API contains name cards, nicknames, and avatars only after [automatic user information management](userinfo_provider.html) is enabled.
- `EMGroupChangeListener#onUserGroupNamecardUpdated` is delivered only to online users.
- To automatically synchronize name cards through messages, call `EMOptions#setEnableUserInfo(true)` before SDK initialization.
- With `EMOptions#setEnableUserInfo(true)`, automatic name card updates depend on messages. To retrieve the latest data explicitly, call the server-side API.

## FAQ

#### Why do other members not receive an event immediately after a name card is set?

After `EMGroupManager#asyncUpdateGroupNamecard` is called, the current user's name card in the specified group is updated. Other **online members** trigger `EMGroupChangeListener#onUserGroupNamecardUpdated` only after receiving the corresponding name card change notification.

#### Why does getGroupNamecard not return a group member name card?

`EMGroupManager#getGroupNamecard` reads only local memory and does not retrieve the latest information from the server. If the corresponding member's name card has not been cached in local memory, the result may be empty. In this case, call `EMGroupManager#asyncFetchGroupMembersInfo` first to retrieve group member information from the server.

#### Is group member information retrieved from the server written to memory?

Yes. After `EMGroupManager#asyncFetchGroupMembersInfo` successfully retrieves group member information from the server, name cards and other data in the result are written to local memory. You can then call `EMGroupManager#getGroupNamecard` to read the data directly.

#### Why are name cards updated automatically after automatic user information management is enabled?

With automatic user information management enabled through `EMOptions#setEnableUserInfo(true)`, messages automatically include the sender's name-card update time. After receiving a message, the recipient compares the update time in the message with the value in local memory. If the message contains a later update time, the SDK automatically retrieves the latest name card from the server and updates local memory.

#### After automatically synchronizing a name card through messages, is explicit retrieval still required?

It depends on the use case. Automatic synchronization requires a message. If the latest name card is needed immediately or no message triggers synchronization, call `EMGroupManager#asyncFetchGroupMembersInfo` to explicitly retrieve the latest data from the server.

## Related documents

- [Automatic user information management](userinfo_provider.html)
- [Manage User Attributes](userprofile.html)
- [Limitations](/product/limitation.html)

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncUpdateGroupNamecard`](#set-a-group-member-name-card) | `EMGroupManager` | Set, update, or clear the current user's name card in a specified group. |
| [`asyncFetchGroupMembersInfo`](#retrieve-group-member-name-cards-from-the-server) | `EMGroupManager` | Retrieve group member information from the server by page. |
| [`getGroupNamecard`](#retrieve-a-group-member-name-card-from-local-memory) | `EMGroupManager` | Read a specified member's name card from local memory. |
| [`setAppKey`](#automatically-synchronize-group-member-name-cards-through-messages) | `EMOptions` | Set the app's App Key. |
| [`setEnableUserInfo`](#automatically-synchronize-group-member-name-cards-through-messages) | `EMOptions` | Enable or disable automatic user information management. |
| [`init`](#automatically-synchronize-group-member-name-cards-through-messages) | `EMClient` | Initialize the SDK with the specified configuration. |
