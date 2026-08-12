# 管理用户属性

环信即时通讯 IM 自 v3.8.1 开始支持用户属性管理。

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。例如，在招聘场景下，利用用户属性功能可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。

本文介绍如何设置、更新、获取、监听和订阅用户属性。

:::tip
为保证用户信息安全，SDK 仅支持用户设置或更新自己的用户属性。
:::

## 技术原理

环信即时通讯 IM Android SDK 通过 [EMUserInfoManager](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_user_info_manager.html) 提供用户属性相关功能。

- `updateOwnInfo`：设置或更新当前用户的全部属性。
- `updateOwnInfoByAttribute`：设置或更新当前用户的单个属性。
- `fetchUserInfoByUserId`：获取一个或多个用户的全部属性。
- `fetchUserInfoByAttribute`：获取指定用户的指定属性。
- `subscribeUsersInfo`：订阅非好友用户属性变更事件。
- `unsubscribeUsersInfo`：取消订阅非好友用户的属性变更事件。
- `fetchSubscribedUsers` 获取已被订阅用户属性变更事件的用户列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 使用限制

- 单个用户的全部属性最大不超过 2 KB。
- 单个 app 的全部用户属性数据最大不超过 10 GB。
- 调用设置或获取用户属性的相关接口超过频率限制时，会返回错误码 `4` `EXCEED_SERVICE_LIMIT`。

## 设置当前用户的属性

### 设置当前用户的所有属性

你可以调用 `updateOwnInfo` 设置当前用户的全部属性。

```java
EMUserInfo userInfo = new EMUserInfo();
userInfo.setUserId(EMClient.getInstance().getCurrentUser());
userInfo.setNickname("easemob");
userInfo.setAvatarUrl("https://www.easemob.com");
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

客户端默认使用以下键名存储用户属性。[调用 RESTful 接口设置](/document/server-side/user_attribute_set.html) 或 [删除用户属性](/document/server-side/user_attribute_delete.html) 时，若希望客户端可正常读取，请保持键名一致。

| 字段        | 类型   | 描述                                                                                              |
| :---------- | :----- | :------------------------------------------------------------------------------------------------ |
| `nickname`  | String | 用户昵称。长度不超过 64 字符。                                                                    |
| `avatarurl` | String | 用户头像 URL。长度不超过 256 字符。                                                               |
| `phone`     | String | 用户联系方式。长度不超过 32 字符。                                                                |
| `mail`      | String | 用户邮箱。长度不超过 64 字符。                                                                    |
| `gender`    | Int    | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 其他值无效。       |
| `sign`      | String | 用户签名。长度不超过 256 字符。                                                                   |
| `birth`     | String | 用户生日。长度不超过 64 字符。                                                                    |
| `ext`       | String | 扩展字段。                                                                                        |

### 设置当前用户的单个属性

你可以调用 `updateOwnInfoByAttribute` 设置当前用户的单个属性。例如，修改头像：

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

## 获取用户属性

### 从服务端获取用户的所有属性

你可以调用 `fetchUserInfoByUserId` 从服务端获取一个或多个用户的全部属性。自 v4.20.0 开始，若返回的用户属性更新时间戳大于本地存储的用户属性更新时间戳，SDK 会触发 `EMUserInfoManagerListener#onUserInfoUpdate` 事件。

```java
// 每次传入的用户 ID 数量不超过 100 个。
String[] userId = new String[1];
// username 指用户 ID。
userId[0] = username;
EMClient.getInstance().userInfoManager().fetchUserInfoByUserId(userId, new EMValueCallBack<Map<String, EMUserInfo>>() {});
```

### 从服务端获取用户的指定属性

你可以调用 `fetchUserInfoByAttribute` 获取指定用户的一个或多个属性。自 v4.20.0 开始，若返回的用户属性更新时间戳大于本地存储的用户属性更新时间戳，SDK 会触发 `EMUserInfoManagerListener#onUserInfoUpdate` 事件。

```java
String[] userId = new String[1];
userId[0] = EMClient.getInstance().getCurrentUser();
EMUserInfo.EMUserInfoType[] userInfoTypes = new EMUserInfo.EMUserInfoType[2];
userInfoTypes[0] = EMUserInfo.EMUserInfoType.NICKNAME;
userInfoTypes[1] = EMUserInfo.EMUserInfoType.AVATAR_URL;
EMClient.getInstance().userInfoManager().fetchUserInfoByAttribute(userId, userInfoTypes,
    new EMValueCallBack<Map<String, EMUserInfo>>() {});
```

### 从本地内存读取用户属性

自 V4.20.0 起，你可以调用 `EMUserInfoManager#getUserInfoWithUserId` 直接从本地内存读取用户属性。该接口返回的是单个用户的 `EMUserInfo`。它适用于直接从本地内存读取指定用户的资料，不会发起网络请求，因此可以作为好友列表读取能力之外的补充资料读取方式。

```java
EMClient.getInstance().userInfoManager().getUserInfoWithUserIds(
        new String[] {"userId1", "userId2"},
        new EMValueCallBack<Map<String, EMUserInfo>>() {
            @Override
            public void onSuccess(Map<String, EMUserInfo> userInfoMap) {
                for (Map.Entry<String, EMUserInfo> entry : userInfoMap.entrySet()) {
                    EMUserInfo userInfo = entry.getValue();
                    EMLog.d("UserInfo", "用户属性 - userId:" + entry.getKey()
                            + ", nickname:" + userInfo.getNickname()
                            + ", avatarUrl:" + userInfo.getAvatarUrl());
                }
            }

            @Override
            public void onError(int code, String error) {
                EMLog.e("UserInfo", "读取本地用户属性失败：" + code + ", " + error);
            }
        });
```

## 订阅非好友用户的属性变更

自 v4.22.0 起，SDK 支持订阅非好友用户的属性变更。订阅后，指定非好友用户的属性发生变化时，应用可以及时收到通知。

该功能适用于以下场景：

- 非好友会话中，需要及时更新对方昵称、头像等属性。
- 临时会话、客服沟通等场景中，需要感知非好友用户的属性变更。
- 群成员展示等场景中，需要维护指定非好友用户的最新用户属性。

:::tip
本功能只适用于非好友用户。关于当前用户、非好友用户和好友相关的用户属性变更通知详情，请参见 [用户属性变更事件](#监听用户属性变更)。
:::

### 订阅非好友用户属性变更事件

你可以调用 `subscribeUsersInfo` 订阅非好友用户属性变更事件。订阅成功后，当这些用户的属性发生变更时，SDK 会触发 [EMUserInfoManagerListener#onUserInfoUpdate](userinfo_provider.html#监听用户属性更新) 事件。

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

### 取消订阅非好友用户属性变更事件

你可以调用 `unsubscribeUsersInfo` 取消订阅非好友用户的属性变更事件。

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

### 获取已被订阅用户属性变更事件的用户列表

你可以调用 `fetchSubscribedUsers` 获取已被订阅用户属性变更事件的用户列表。该用户列表中包含被订阅的非好友用户的用户 ID 及其用户属性。

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

### 内存说明

如果未订阅非好友用户的属性变更，应用通常需要在业务需要时主动调用获取接口拉取资料。为减少不必要的网络请求，建议优先复用本地内存中的用户信息，并按业务需要决定是否重新 [拉取服务端数据](userprofile.html#从服务端获取用户的所有属性)。

## 监听用户属性变更

好友用户及非好友用户的属性更新，均可能通过以下方式触发 SDK 的 `EMUserInfoManagerListener#onUserInfoUpdate` 事件：

1. **主动拉取更新**：调用 [从服务端获取用户属性](userprofile.html#从服务端获取用户的所有属性) 或 [从服务端获取群成员信息](group_manage.html#获取群成员列表) 接口时，若服务端返回的用户属性更新时间戳大于本地存储的时间戳，SDK 会自动更新本地数据并触发该事件。
2. **消息携带更新**：若启用了 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理)，当收到消息且消息中携带的发送方用户属性更新时间晚于本地缓存时，SDK 会重新拉取该用户属性并触发该事件。此机制对好友与非好友发送方均生效。
3. **订阅用户变更（仅限非好友）**：若已订阅非好友用户的属性变更事件，则当这些被订阅的非好友用户属性发生变更时，SDK 也会触发该事件。

**特殊说明**

- **当前用户**：当前用户的属性变更，通过 `EMUserInfoManagerListener#onSelfUserInfoUpdate` 事件单独回调，不适用上述 `onUserInfoUpdate` 逻辑。
- **仅限好友用户**：若启用了 [登录后自动同步好友列表功能](user_relationship.html#登录后自动同步好友列表)，SDK 会在登录完成后自动拉取并更新本地好友数据。好友属性变更时，会触发 `EMContactListener#onContactInfoUpdate(EMContact contact)` 事件（此事件为好友关系特有，与 `onUserInfoUpdate` 区分）。

## 常见问题

### 设置了用户昵称，为什么获取不到？

如果你已通过客户端或 RESTful API 设置用户昵称，但后续未能正确获取，通常需要检查以下两点：

- 调用 RESTful 接口设置用户昵称时，请求中必须使用 `nickname` 键名，否则客户端无法正确读取该属性。
- RESTful API [获取用户详情](/document/server-side/account_detail_obtain_single.html) 和 [删除用户账户](/document/server-side/account_delete_single.html) 返回的 `nickname` 表示推送昵称，即离线推送通知中显示的昵称，与用户属性中的昵称不同。不过，建议两者保持一致；修改其中一个昵称时，也同步更新另一个昵称。

例如，Android 侧可调用 [updatePushNickname](/v4/android/push/push_display_attribute.html#设置推送通知的显示属性) 更新推送昵称；RESTful API 可参考 [离线推送通知的显示属性配置](/document/server-side/push_nickname_set_single.html)。

### 为什么会返回错误码 4？

设置和获取用户属性的相关接口在超过调用频率限制时，会返回错误码 `4` `EXCEED_SERVICE_LIMIT`。

## 相关功能

### 用户头像管理

如果你的业务涉及用户头像管理，可参考以下流程：

1. 开通第三方文件存储服务。
2. 将头像文件上传到第三方存储，并获取文件 URL。
3. 将该 URL 写入用户属性中的头像字段 `avatarUrl`。
4. 调用 `fetchUserInfoByUserId` 或 `fetchUserInfoByAttribute` 获取头像 URL，并在本地 UI 中渲染。

### 名片消息

如果业务中需要发送名片消息，也可以结合自定义属性实现：

```java
//设置自定义消息的 `event` 为 `"userCard"`，并在 `ext` 中添加展示名片所需要的用户 ID 、昵称和头像等字段。
EMMessage message = EMMessage.createSendMessage(EMMessage.Type.CUSTOM);
EMCustomMessageBody body = new EMCustomMessageBody(DemoConstant.USER_CARD_EVENT);
Map<String,String> params = new HashMap<>();
params.put(DemoConstant.USER_CARD_ID,userId);
params.put(DemoConstant.USER_CARD_NICK,user.getNickname());
params.put(DemoConstant.USER_CARD_AVATAR,user.getAvatarUrl());
body.setParams(params);
message.setBody(body);
message.setTo(toUser);
EMClient.getInstance().chatManager().sendMessage(message);
```

如果需要展示更多名片信息，可以继续在 `ext` 中扩展字段。

可参考 [GitHub](https://github.com/easemob/easemob-uikit-android) 或 [Gitee](https://gitee.com/easemob-code/easemob-uikit-android) 示例项目中的以下类：

- `EaseChatAttachmentController#selectContact`
- `EaseChatRowUserCard`

### 用户属性与用户信息

用户信息指用于业务展示的用户相关信息，包括用户属性、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。
