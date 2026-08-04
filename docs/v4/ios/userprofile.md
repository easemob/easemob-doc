# 管理用户属性

<Toc />

环信即时通讯 IM 自 v3.8.1 开始支持用户属性管理功能。

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。例如，在招聘场景下，利用用户属性功能可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。

本文介绍如何设置、更新、获取、监听和订阅用户属性。

:::tip
为保证用户信息安全，SDK 仅支持用户设置或更新自己的用户属性。
:::

## 技术原理

环信即时通讯 IM iOS SDK 通过 `userInfoManager` 类，提供用户属性相关功能。

- `updateOwnUserInfo` 设置和修改当前用户自己的属性信息；
- `fetchUserInfoById` 获取指定用户的所有用户属性信息。
- `subscribeUsersInfo:completion:`：订阅非好友用户的属性变更事件。
- `unsubscribeUsersInfo:completion:`：取消订阅非好友用户的属性变更事件。
- `fetchSubscribedUsers:` 获取已被订阅用户属性变更事件的用户列表。

## 前提条件

设置用户属性前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 使用限制

- 单个用户的全部属性最大不超过 2 KB。
- 单个 app 的全部用户属性数据最大不超过 10 GB。
- 调用设置或获取用户属性的相关接口超过频率限制时，会返回错误码 `4` `EXCEED_SERVICE_LIMIT`。

## 设置当前用户的属性

### 设置当前用户的所有属性

你可以调用 `updateOwnUserInfo` 设置当前用户的全部属性：

```objectivec
EMUserInfo *userInfo = [[EMUserInfo alloc] init];
userInfo.userId = EMClient.sharedClient.currentUsername;
userInfo.nickname = @"EM";
userInfo.avatarUrl = @"https://www.EM.io";
userInfo.birth = @"2000.10.10";
userInfo.sign = @"hello world";
userInfo.phone = @"12333333333";
userInfo.mail = @"123456@qq.com";
userInfo.gender = 1;
// 异步方法
[EMClient.sharedClient.userInfoManager updateOwnUserInfo:userInfo completion:^(EMUserInfo *aUserInfo, EMError *aError) {

}];
```

客户端默认使用以下键名存储用户属性。[调用 RESTful 接口设置](/document/server-side/user_attribute_set.html) 或 [删除用户属性](/document/server-side/user_attribute_delete.html) 时，若希望客户端可正常读取，请保持键名一致。

| 字段        | 类型   | 描述                                                                                              |
| ----------- | ------ | ------------------------------------------------------------------------------------------------- |
| `nickname`  | String | 用户昵称。长度在 64 字符内。                                                                      |
| `avatarurl` | String | 用户头像 URL 地址。长度在 256 字符内。                                                            |
| `phone`     | String | 用户联系方式。长度在 32 字符内。                                                                  |
| `mail`      | String | 用户邮箱。长度在 64 字符内。                                                                      |
| `gender`    | Int    | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 设置为其他值无效。 |
| `sign`      | String | 用户签名。长度在 256 字符内。                                                                     |
| `birth`     | String | 用户生日。长度在 64 字符内。                                                                      |
| `ext`       | String | 扩展字段。                                                                                        |

### 设置当前用户的单个属性

你可以调用 `updateOwnUserInfo` 设置当前用户的单个属性。例如，修改头像：

```objectivec
NSString *url = @"https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png";

[[EMClient sharedClient].userInfoManager updateOwnUserInfo:url withType:EMUserInfoTypeAvatarURL completion:^(EMUserInfo *aUserInfo, EMError *aError) {
    if (aUserInfo && completion) {
        completion(aUserInfo);
    }
}];
```

## 获取用户属性

### 从服务端获取用户的所有属性

你可以调用 `fetchUserInfoById` 从服务端获取一个或多个用户的全部属性。自 v4.20.0 开始，若返回的用户属性更新时间戳大于本地存储的用户属性更新时间戳，SDK 会触发 `EMUserInfoManagerDelegate#onUserInfoUpdate` 事件。

```objectivec
// 每次传入的用户 ID 数量不能超过 100。
// 异步方法
[[EMClient sharedClient].userInfoManager fetchUserInfoById:@[EMClient.sharedClient.currentUsername] 		completion:^(NSDictionary *aUserDatas, EMError *aError) {
}];
```

### 从服务端获取用户的指定属性

你可以调用 `fetchUserInfoById` 从服务端获取获取指定用户的一个或多个属性。自 v4.20.0 开始，若返回的用户属性更新时间戳大于本地存储的用户属性更新时间戳，SDK 会触发 `EMUserInfoManagerDelegate#onUserInfoUpdate` 事件。

```objectivec
// 获取指定用户的指定用户属性。
NSArray<NSString *> *userIds = @[@"user1", @"user2"];
NSArray<NSNumber *> *userInfoTypes = @[@(EMUserInfoTypeAvatarURL),@(EMUserInfoTypePhone),@(EMUserInfoTypeMail)];
// 异步方法
[[EMClient sharedClient].userInfoManager fetchUserInfoById:userIds type:userInfoTypes completion:^(NSDictionary *aUserDatas, EMError *aError) {

}];
```

### 从本地内存读取用户属性

自 V4.20.0 起，你可以调用 `EMUserInfoManager#getUserInfoByIds` 直接从本地内存读取用户属性。该接口不会发起网络请求，适用于本地展示场景。

```swift
let result = EMClient.shared().userInfoManager?.getUserInfo(byIds: ["userId1", "userId2"])
if let userInfoMap = result {
    for (userId, userInfo) in userInfoMap {
        print("用户信息 - userId:\(userId), nickname:\(userInfo.nickname ?? ""), avatarUrl:\(userInfo.avatarUrl ?? "")")
    }
}
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

你可以调用 `subscribeUsersInfo` 订阅非好友用户的用户属性变更事件。订阅成功后，当这些用户的属性发生变更时，SDK 会触发 [EMUserInfoManagerDelegate#onUserInfoUpdate](userinfo_provider.html#监听用户属性更新) 事件。

```objectivec
NSArray<NSString *> *userIds = @[@"user1", @"user2"];

[[EMClient sharedClient].userInfoManager subscribeUsersInfo:userIds completion:^(EMError *error) {
    if (!error) {
        NSLog(@"订阅非好友用户属性变更成功");
    } else {
        NSLog(@"订阅非好友用户属性变更失败：%@", error.errorDescription);
    }
}];
```

### 取消订阅非好友用户属性变更事件

你可以调用 `unsubscribeUsersInfo` 取消订阅非好友用户的属性变更事件。

```objectivec
NSArray<NSString *> *userIds = @[@"user1", @"user2"];

[[EMClient sharedClient].userInfoManager unsubscribeUsersInfo:userIds completion:^(EMError *error) {
    if (!error) {
        NSLog(@"取消订阅非好友用户属性变更成功");
    } else {
        NSLog(@"取消订阅非好友用户属性变更失败：%@", error.errorDescription);
    }
}];
```

### 获取已被订阅用户属性变更事件的用户列表

你可以调用 `fetchSubscribedUsers` 获取已被订阅用户属性变更事件的用户列表。该用户列表中包含被订阅的非好友用户的用户 ID 及其用户属性。

```objectivec
[[EMClient sharedClient].userInfoManager fetchSubscribedUsers:^(NSArray<EMUserInfo *> *users, EMError *error) {
    if (!error) {
        NSLog(@"已订阅用户属性变更的用户列表：%@", users);
    } else {
        NSLog(@"获取已订阅用户列表失败：%@", error.errorDescription);
    }
}];
```

### 内存说明

如果未订阅非好友用户的属性变更，应用通常需要在业务需要时主动调用获取接口拉取资料。为减少不必要的网络请求，建议优先复用本地内存中的用户信息，并按业务需要决定是否重新 [拉取服务端数据](userprofile.html#从服务端获取用户的所有属性)。

## 监听用户属性变更

好友用户及非好友用户的属性更新，均可能通过以下方式触发 SDK 的 `EMUserInfoManagerDelegate#onUserInfoUpdate` 事件：

1. **主动拉取更新**：调用 [从服务端获取用户属性](userprofile.html#从服务端获取用户的所有属性) 或 [从服务端获取群成员信息](group_manage.html#获取群成员列表) 接口时，若服务端返回的用户属性更新时间戳大于本地存储的时间戳，SDK 会自动更新本地数据并触发该事件。
2. **消息携带更新**：若启用了 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理)，当收到消息且消息中携带的发送方用户属性更新时间晚于本地缓存时，SDK 会重新拉取该用户属性并触发该事件。此机制对好友与非好友发送方均生效。
3. **订阅用户变更（仅限非好友）**：若已 [订阅非好友用户的属性变更事件](#订阅非好友用户的属性变更)，则当这些被订阅的非好友用户属性发生变更时，SDK 也会触发该事件。

**特殊说明**

- **当前用户**：当前用户的属性变更，通过 `EMUserInfoManagerDelegate#onSelfUserInfoUpdate` 事件单独回调，不适用上述 `onUserInfoUpdate` 逻辑。
- **仅限好友用户**：若启用了 [登录后自动同步好友列表功能](user_relationship.html#登录后自动同步好友列表)，SDK 会在登录完成后自动拉取并更新本地好友数据。好友属性变更时，会触发 `EMContactManagerDelegate#onFriendInfoChanged` 事件。此事件为好友关系特有，与 `EMUserInfoManagerDelegate#onUserInfoUpdate` 区分。

## 常见问题

1. 我设置了用户昵称（`nickname`），但调用客户端或 RESTful API 获取用户属性时，未返回用户昵称，原因是什么？

你可以调用[客户端](#设置当前用户的所有属性) 或[RESTful API](/document/server-side/user_attribute_set.html) 设置用户昵称，例如 iOS 为 `updateOwnUserInfo`，然后通过[客户端](#从服务端获取用户的所有属性)或[RESTful API](/document/server-side/user_attribute_obtain_single.html) 获取用户属性，例如 iOS 为 `fetchUserInfoById`。

设置用户昵称时，请注意以下两点：

- 调用 RESTful 接口设置用户昵称时，若要确保在客户端能够获取设置，请求中必须传 `nickname` 键名。
- 调用 RESTful API [获取用户详情](/document/server-side/account_detail_obtain_single.html)和[删除用户账户](/document/server-side/account_delete_single.html)中返回的响应中的 `nickname` 参数表示为推送昵称，即离线推送时在接收方的客户端推送通知栏中显示的发送方的昵称，与用户属性中的用户昵称不同。不过，我们建议这两种昵称的设置保持一致。因此，修改其中一个昵称时，也需调用相应方法对另一个进行更新，确保设置一致。例如，对于 iOS，更推送昵称的方法为 [updatePushDisplayName](/v4/ios/push/push_display_attribute.html)，对于 RESTful API，详见 [离线推送通知的显示属性配置](/document/server-side/push_nickname_set_single.html)。

1. 调用设置或获取用户属性的接口时，上报错误码 4 的原因是什么？

设置和获取用户属性的接口，包括设置当前用户的属性、获取单个或多个用户的用户属性和获取指定用户的指定用户属性，超过调用频率限制时，会上报错误码 4 `EMErrorExceedServiceLimit`。

## 相关功能

### 用户头像管理

如果你的应用场景中涉及用户头像管理，还可以参考如下步骤进行操作：

1. 开通第三方文件存储服务。详情可以参考文件储存服务商的文档。
2. 将头像文件上传至上述第三方文件存储，并获取存储 URL 地址。
3. 将该 URL 地址传入用户属性的头像字段（avatarUrl）。
4. 显示头像时，通过调用 `fetchUserInfoById` 获取头像 URL，并在本地 UI 中渲染头像。

### 名片消息

如果你的场景中涉及名片消息，你也可以使用自定义属性功能，并参考如下示例代码实现：

```objectivec
// 设置自定义消息的 `event` 为 `userCard`，并在 `customExt` 中添加展示名片所需要的用户 ID、昵称和头像等字段。
NSDictionary *messageExt = @{@"userId":EMClient.sharedClient.currentUsername,
                           @"nickname":@"nickname",
                           @"avatar":@"https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png"
                        };
EMCustomMessageBody *body = [[EMCustomMessageBody alloc] initWithEvent:@"userCard" customExt:messageExt];
// 异步方法
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:@"conversationID"
                                                from:@"sender"
                                                to:@"receiver"
                                                body:body
                                                ext:nil];
// 发送消息
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {}];
```

如果需要在名片中展示更丰富的信息，可以在 `customExt` 中增加更多字段。

可参考 [GitHub](https://github.com/easemob/easemob-uikit-ios) 或 [Gitee](https://gitee.com/easemob-code/easemob-uikit-ios) 中示例项目中的以下类：

- `EMCustomMessageBody`
- `EMChatMessage`

### 用户属性与用户信息

用户信息指用于业务展示的用户相关信息，包括用户属性、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。关于用户信息详情，请参见 [用户信息自动管理说明](userinfo_provider.html)。
