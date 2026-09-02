# Manage User Attributes

User attributes are information about users who interact through real-time messaging, such as nickname, avatar, email address, phone number, gender, signature, and birthday. For example, in a recruitment scenario, user attributes can store gender, email address, user type (interviewee), and job type (Web development).

:::tip
To protect user information, the SDK allows users to set or update only their own user attributes.
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM [limitations](/product/limitation.html).

## Limitations

- All attributes of a single user must not exceed 2 KB.
- All user attribute data in a single app must not exceed 10 GB.
- If an API for setting or retrieving user attributes exceeds the call frequency limit, it returns error code `4` `EXCEED_SERVICE_LIMIT`.

## Set the current user's attributes

### Set all attributes of the current user

Call `updateOwnInfo` to set or update multiple or all attributes of the current user at once.

```java
EMUserInfo userInfo = new EMUserInfo();
userInfo.setUserId(EMClient.getInstance().getCurrentUser());
userInfo.setNickname("im");
userInfo.setAvatarUrl("https://www.aaa.com");
userInfo.setBirth("2000.10.10");
userInfo.setSignature("hello world");
userInfo.setPhoneNumber("13333333333");
userInfo.setEmail("123456@qq.com");
userInfo.setGender(1);
EMClient.getInstance().userInfoManager().updateOwnInfo(userInfo, new EMValueCallBack<String>() {
    @Override
    public void onSuccess(String value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

The client uses the following keys to store user attributes by default. When [setting](/rest/user_attribute_set.html) or [deleting user attributes](/rest/user_attribute_delete.html) through a RESTful API, keep the keys consistent so that the client can read the attributes correctly.

| Field | Type | Description |
| :---------- | :----- | :------------------------------------------------------------------------------------------------ |
| `nickname` | String | User nickname. The maximum length is 64 characters. |
| `avatarurl` | String | User avatar URL. The maximum length is 256 characters. |
| `phone` | String | User contact information. The maximum length is 32 characters. |
| `mail` | String | User email address. The maximum length is 64 characters. |
| `gender` | Int | User gender:<br/> - `1`: Male.<br/> - `2`: Female.<br/> - (Default) `0`: Unknown.<br/> - Other values are invalid. |
| `sign` | String | User signature. The maximum length is 256 characters. |
| `birth` | String | User birthday. The maximum length is 64 characters. |
| `ext` | String | Extension field. |

### Set a single attribute of the current user

Call `updateOwnInfoByAttribute` to set a single attribute of the current user. For example, change the avatar as follows:

```java
String url = "https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png";
EMClient.getInstance().userInfoManager().updateOwnInfoByAttribute(EMUserInfoType.AVATAR_URL, url, new EMValueCallBack<String>() {
    @Override
    public void onSuccess(String value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## Retrieve user attributes

### Retrieve all user attributes from the server

Call `fetchUserInfoByUserId` to retrieve all attributes of one or more users from the server. After [automatic user information management](userinfo_provider.html) is enabled, if the update timestamp of the returned user attributes is later than that of local data, the SDK updates local data and triggers `EMUserInfoManagerListener#onUserInfoUpdate`.

```java
// Pass no more than 100 user IDs per call.
String[] userId = new String[1];
// username is the user ID.
userId[0] = username;
EMClient.getInstance().userInfoManager().fetchUserInfoByUserId(userId, new EMValueCallBack<Map<String, EMUserInfo>>() {
            @Override
            public void onSuccess(Map<String, EMUserInfo> userInfoMap) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### Retrieve specified user attributes from the server

Call `fetchUserInfoByAttribute` to retrieve specified attributes of one or more users from the server. After [automatic user information management](userinfo_provider.html) is enabled, if the update timestamp of the returned user attributes is later than that of local data, the SDK updates local data and triggers `EMUserInfoManagerListener#onUserInfoUpdate`.

```java
String[] userId = new String[1];
userId[0] = EMClient.getInstance().getCurrentUser();
EMUserInfo.EMUserInfoType[] userInfoTypes = new EMUserInfo.EMUserInfoType[2];
userInfoTypes[0] = EMUserInfo.EMUserInfoType.NICKNAME;
userInfoTypes[1] = EMUserInfo.EMUserInfoType.AVATAR_URL;
EMClient.getInstance().userInfoManager().fetchUserInfoByAttribute(userId, userInfoTypes,
    new EMValueCallBack<Map<String, EMUserInfo>>() {
            @Override
            public void onSuccess(Map<String, EMUserInfo> userInfoMap) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### Read user attributes from local memory

To read multiple users' attributes from local memory, call `EMUserInfoManager#getUserInfoWithUserIds`. This method does not initiate a network request and returns a mapping from user IDs to `EMUserInfo` objects through a callback. Users not found in local memory are not included in the result.

To synchronously read a single user's attributes, call `EMUserInfoManager#getUserInfoWithUserId`. It returns `null` if the user is not in local memory and throws `HyphenateException` if the call fails.

```java
String[] userIds = {"userId1", "userId2"};

EMClient.getInstance()
        .userInfoManager()
        .getUserInfoWithUserIds(
                userIds,
                new EMValueCallBack<Map<String, EMUserInfo>>() {
                    @Override
                    public void onSuccess(
                            Map<String, EMUserInfo> userInfoMap) {
                        for (Map.Entry<String, EMUserInfo> entry
                                : userInfoMap.entrySet()) {
                            EMUserInfo userInfo = entry.getValue();
                            EMLog.d(
                                    "UserInfo",
                                    "User attributes - userId:"
                                            + entry.getKey()
                                            + ", nickname:"
                                            + userInfo.getNickname()
                                            + ", avatarUrl:"
                                            + userInfo.getAvatarUrl());
                        }
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        EMLog.e(
                                "UserInfo",
                                "Failed to read local user attributes: "
                                        + errorCode
                                        + ", "
                                        + errorMessage);
                    }
                });
```                

:::tip
To automatically synchronize the friend list and friend information after login succeeds, configure `EMOptions#EMDataSyncType.CONTACTS` through `EMOptions#setDataSyncType` before SDK initialization. After synchronization is complete, call `EMClient.getInstance().contactManager().getContactsFromLocal()` to read the local friend list and `fetchContactFromLocal` to retrieve local friend information. For details about automatic data synchronization after login, see [Initialization](initialization.html).
:::

## Subscribe to stranger attribute changes

The SDK supports subscribing to stranger attribute changes. After subscription, the app promptly receives notifications when specified strangers' attributes change.

This feature applies to the following scenarios:

- Updating a peer's nickname, avatar, or other attributes promptly in a stranger conversation.
- Detecting stranger attribute changes in temporary conversations, customer service communication, and similar scenarios.
- Maintaining the latest attributes of specified strangers when displaying chat group members.

:::tip
This feature applies only to strangers. For details about user attribute change notifications for the current user, strangers, and friends, see [User attribute change events](#monitor-user-attribute-changes).
:::

### Subscribe to stranger attribute change events

Call `subscribeUsersInfo` to subscribe to stranger attribute change events. After subscription succeeds, the SDK triggers [EMUserInfoManagerListener#onUserInfoUpdate](#monitor-user-attribute-changes) when these users' attributes change.

```java
String[] userIds = new String[2];
userIds[0] = "user1";
userIds[1] = "user2";

EMClient.getInstance().userInfoManager().subscribeUsersInfo(userIds, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String error) {
    }
});
```

### Unsubscribe from stranger attribute change events

Call `unsubscribeUsersInfo` to unsubscribe from stranger attribute change events.

```java
EMClient.getInstance().userInfoManager().unsubscribeUsersInfo(userIds, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String error) {
    }
});
```

### Retrieve the list of users whose attribute change events are subscribed to

Call `fetchSubscribedUsers` to retrieve the list of users whose attribute change events are subscribed to. The list contains the user IDs and attributes of subscribed strangers.

```java
EMClient.getInstance().userInfoManager().fetchSubscribedUsers(new EMValueCallBack<List<EMUserInfo>>() {
    @Override
    public void onSuccess(List<EMUserInfo> value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### Memory usage

If stranger attribute changes are not subscribed to, the app generally needs to explicitly call retrieval APIs when the attributes are needed. To reduce unnecessary network requests, preferentially reuse user information in local memory and decide whether to [retrieve server-side data](userprofile.html#retrieve-all-user-attributes-from-the-server) again according to business requirements.

## Monitor user attribute changes

Updates to friend and stranger attributes can trigger `EMUserInfoManagerListener#onUserInfoUpdate` in the following ways:

1. **Explicit retrieval update**: When [retrieving user attributes from the server](userprofile.html#retrieve-all-user-attributes-from-the-server) or [retrieving chat group member information from the server](group_members.html#retrieve-the-group-member-list), if the user attribute update timestamp returned by the server is later than the locally stored timestamp, the SDK automatically updates local data and triggers the event.
2. **Message-carried update**: If [automatic user information management](userinfo_provider.html#enable-automatic-user-information-management) is enabled, when a received message carries a sender user attribute update time later than the local cache, the SDK retrieves those user attributes again and triggers the event. This applies to both friend and stranger senders.
3. **Subscribed user change (strangers only)**: If stranger attribute change events are subscribed to, the SDK also triggers the event when those subscribed strangers' attributes change.

**Special notes**

- **Current user**: Changes to the current user's attributes are separately reported through `EMUserInfoManagerListener#onSelfUserInfoUpdate` and do not use the `onUserInfoUpdate` logic above.
- **Friends only**: If [automatic friend-list synchronization after login](user_relationship.html#automatically-synchronize-the-friend-list-after-login) is enabled, the SDK automatically retrieves and updates local friend data after login is complete. When a friend's attributes change, `EMContactListener#onContactInfoUpdate(EMContact contact)` is triggered. This event is specific to friend relationships and differs from `onUserInfoUpdate`.

Register the listener through `addUserInfoManagerListener` and remove it through `removeUserInfoManagerListener` when it is no longer needed:

```java
EMUserInfoManagerListener userInfoListener = new EMUserInfoManagerListener() {
    @Override
    public void onSelfUserInfoUpdate(EMUserInfo userInfo) {
        // The current user's attributes have been updated.
    }

    @Override
    public void onUserInfoUpdate(List<EMUserInfo> userInfoList) {
        // Other users' attributes have been updated.
    }
};

EMClient.getInstance().userInfoManager()
        .addUserInfoManagerListener(userInfoListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance().userInfoManager()
        .removeUserInfoManagerListener(userInfoListener);
```

## FAQ

### Why can't I retrieve a user nickname after setting it?

If you set a user nickname through the client or a RESTful API but cannot subsequently retrieve it correctly, check the following:

- When setting a user nickname through a RESTful API, use the `nickname` key in the request. Otherwise, the client cannot read the attribute correctly.
- The `nickname` returned by the RESTful APIs [Get User Details](/rest/account_detail_obtain_single.html) and [Delete a User Account](/rest/account_delete_single.html) is the push nickname displayed in offline push notifications, which differs from the nickname in user attributes. However, we recommend keeping them consistent and updating one when the other changes.

On Android, call [updatePushNickname](/sdk/v5/android/push/push_display_attribute.html#set-push-notification-display-attributes) to update the push nickname. For RESTful APIs, see [Configure Display Attributes for Offline Push Notifications](/rest/push_nickname_set_single.html).

### Why is error code 4 returned?

APIs for setting and retrieving user attributes return error code `4` `EXCEED_SERVICE_LIMIT` after exceeding the call frequency limit.

## Related features

### User avatar management

If your business manages user avatars, use the following process:

1. Activate a third-party file storage service.
2. Upload the avatar file to third-party storage and obtain its URL.
3. Write the URL to the `avatarUrl` user attribute.
4. Call `fetchUserInfoByUserId` or `fetchUserInfoByAttribute` to retrieve the avatar URL and render it in the local UI.

### Contact card messages

To send contact card messages, use custom attributes:

```java
// Set the custom message event to "userCard", and add the user ID, nickname, avatar, and other fields required to display the card to `params`.
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.CUSTOM);
EMCustomMessageBody body = new EMCustomMessageBody("userCard");
Map<String, String> params = new HashMap<>();
params.put("userId", userId);
params.put("nickname", user.getNickname());
params.put("avatarUrl", user.getAvatarUrl());
body.setParams(params);
message.setBody(body);
message.setTo(toUser);
EMClient.getInstance().chatManager().sendMessage(message);
```

To display more contact card information, add more fields to `params` in the custom message body.

See the following classes in the [GitHub](https://github.com/easemob/easemob-uikit-android) or [Gitee](https://gitee.com/easemob-code/easemob-uikit-android) sample project:

- `EaseChatAttachmentController#selectContact`
- `EaseChatRowUserCard`

### User attributes and user information

User information refers to user-related information displayed by your app, including user attributes, [friend remarks](user_relationship.html#set-friend-remarks), and [group member name cards](group_namecard.html).

## API list

| API | Module/Class | Description |
| ------------------------------------------------------------ | ------------------- | -------------------------------------- |
| [`updateOwnInfo`](#set-all-attributes-of-the-current-user) | `EMUserInfoManager` | Sets or updates multiple attributes of the current user. |
| [`updateOwnInfoByAttribute`](#set-a-single-attribute-of-the-current-user) | `EMUserInfoManager` | Sets or updates a single attribute of the current user. |
| [`fetchUserInfoByUserId`](#retrieve-all-user-attributes-from-the-server) | `EMUserInfoManager` | Retrieves all attributes of one or more users. |
| [`fetchUserInfoByAttribute`](#retrieve-specified-user-attributes-from-the-server) | `EMUserInfoManager` | Retrieves specified attributes of specified users. |
| [`getUserInfoWithUserId`](#read-user-attributes-from-local-memory) | `EMUserInfoManager` | Reads a single user's attributes from local memory. |
| [`subscribeUsersInfo`](#subscribe-to-stranger-attribute-change-events) | `EMUserInfoManager` | Subscribes to stranger attribute change events. |
| [`unsubscribeUsersInfo`](#unsubscribe-from-stranger-attribute-change-events) | `EMUserInfoManager` | Unsubscribes from stranger attribute change events. |
| [`fetchSubscribedUsers`](#retrieve-the-list-of-users-whose-attribute-change-events-are-subscribed-to) | `EMUserInfoManager` | Retrieves the list of users whose attribute change events are subscribed to. |
