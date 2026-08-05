# 管理用户属性

## 功能说明
用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。例如，在招聘场景下，利用用户属性功能可以存储性别、邮箱、用户类型（面试者）、职位类型（Web 研发）等。

本文介绍如何设置、更新、获取、监听和订阅用户属性。

:::tip
为保证用户信息安全，SDK 仅支持用户设置或更新自己的用户属性。
:::

## 前提条件

开始前，请确保满足以下条件：

 - 完成 iOS SDK V5 初始化并登录，详见 [快速开始](quickstart.html)。
 - 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 使用限制

 - 单个用户的全部属性最大不超过 2 KB。
 - 单个 app 的全部用户属性数据最大不超过 10 GB。
 - 调用设置或获取用户属性的相关接口超过频率限制时，会返回错误码 `4`，即 `EMErrorExceedServiceLimit`。

## 设置当前用户的属性

### 设置当前用户的所有属性

可以调用 `updateOwnUserInfo` 一次设置或更新当前用户的多个或全部属性。

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
        // updatedUserInfo 为更新后的当前用户属性。
    } else {
        // 设置失败。
    }
}];
```

客户端默认使用以下键名存储用户属性。调用 [RESTful 接口设置](/document/server-side/user_attribute_set.html) 或 [删除用户属性](/document/server-side/user_attribute_delete.html) 时，若希望客户端可正常读取，请保持键名一致。

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `nickname` | `NSString *` | 用户昵称，长度不超过 64 字符。 |
| `avatarurl` | `NSString *` | 用户头像 URL，长度不超过 256 字符。 |
| `phone` | `NSString *` | 用户联系方式，长度不超过 32 字符。 |
| `mail` | `NSString *` | 用户邮箱，长度不超过 64 字符。 |
| `gender` | `NSInteger` | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 设置为其他值无效。 |
| `sign` | `NSString *` | 用户签名，长度不超过 256 字符。 |
| `birth` | `NSString *` | 用户生日，长度不超过 64 字符。 |
| `ext` | `NSString *` | 扩展字段。 |

### 设置当前用户的单个属性

调用 `updateOwnUserInfo` 设置当前用户的单个属性。例如，修改头像：

```objectivec
NSString *avatarUrl = @"https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png";

[[EMClient sharedClient].userInfoManager updateOwnUserInfo:avatarUrl
                                                   withType:EMUserInfoTypeAvatarURL
                                                 completion:^(EMUserInfo *updatedUserInfo, EMError *error) {
    if (!error) {
        // 单个属性更新成功。
    } else {
        // 更新失败。
    }
}];
```

## 获取用户属性

### 从服务端获取用户的所有属性

调用 `fetchUserInfoById` 从服务端异步获取一个或多个用户的全部属性。每次传入的用户 ID 数量不能超过 100。

当服务端返回的用户属性更新时间戳大于本地存储的时间戳时，SDK 会更新本地数据并触发 `onUserInfoUpdate` 回调。

```objectivec
// 每次传入的用户 ID 数量不能超过 100。
NSArray<NSString *> *userIds = @[@"user1", @"user2"];

[[EMClient sharedClient].userInfoManager fetchUserInfoById:userIds
                                                completion:^(NSDictionary<NSString *, EMUserInfo *> *userInfos, EMError *error) {
    if (!error) {
        EMUserInfo *userInfo = userInfos[@"user1"];
        // 使用 userInfo.nickname、userInfo.avatarUrl 等属性。
    } else {
        // 获取失败。
    }
}];
```

### 从服务端获取用户的指定属性

调用 `fetchUserInfoById` 从服务端异步获取指定用户的一个或多个属性。若返回的用户属性更新时间戳大于本地存储的时间戳，SDK 会更新本地数据并触发 `onUserInfoUpdate` 回调。

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
        // userInfos 的 key 为用户 ID，value 为用户属性。
    } else {
        // 获取失败。
    }
}];
```

### 从本地内存读取用户属性

`getUserInfoByIds` 可从本地内存读取用户属性，但该 API 为同步方法。为保持异步调用流程，业务需要最新属性时应使用 `fetchUserInfoById` 或 `fetchUserInfoById`，并在 completion 中消费结果。

:::tip
若需要 SDK 在登录成功后自动同步好友列表及好友信息，需在初始化 SDK 前通过 `EMOptions#dataSyncType` 配置 `EMDataSyncTypeContacts`。同步完成后，可使用本地好友数据；关于登录成功后自动同步数据，详见 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)。
:::

## 订阅非好友用户的属性变更

SDK 支持订阅非好友用户的属性变更。订阅后，指定非好友用户的属性发生变化时，应用可以及时收到通知。

该功能适用于以下场景：

 - 非好友会话中，需要及时更新对方昵称、头像等属性。
 - 临时会话、客服沟通等场景中，需要感知非好友用户的属性变更。
 - 群成员展示等场景中，需要维护指定非好友用户的最新用户属性。

:::tip
本功能只适用于非好友用户。关于当前用户、非好友用户和好友相关的用户属性变更通知详情，请参见 [用户属性变更事件](#监听用户属性变更)。
:::

### 订阅非好友用户属性变更事件

调用 `subscribeUsersInfo` 订阅非好友用户的用户属性变更事件。订阅成功后，当这些用户的属性发生变更时，SDK 会触发 `onUserInfoUpdate` 事件。

```objectivec
NSArray<NSString *> *userIds = @[@"user1", @"user2"];

[[EMClient sharedClient].userInfoManager subscribeUsersInfo:userIds completion:^(EMError *error) {
    if (!error) {
        // 订阅成功。
    } else {
        // 订阅失败。
    }
}];
```

### 取消订阅非好友用户属性变更事件

调用 `unsubscribeUsersInfo` 取消订阅非好友用户的属性变更事件。

```objectivec
[[EMClient sharedClient].userInfoManager unsubscribeUsersInfo:userIds completion:^(EMError *error) {
    if (!error) {
        // 取消订阅成功。
    } else {
        // 取消订阅失败。
    }
}];
```

### 获取已被订阅用户属性变更事件的用户列表

调用 `fetchSubscribedUsers` 异步获取已被订阅用户属性变更事件的用户列表。列表中包含被订阅非好友用户的用户 ID 及其用户属性。

```objectivec
[[EMClient sharedClient].userInfoManager fetchSubscribedUsers:^(NSArray<EMUserInfo *> *users, EMError *error) {
    if (!error) {
        // users 为已订阅用户的属性列表。
    } else {
        // 获取失败。
    }
}];
```

### 内存说明

如果未订阅非好友用户的属性变更，应用通常需要在业务需要时主动调用异步获取接口拉取用户属性。为减少不必要的网络请求，建议按业务需要决定是否重新 [拉取服务端数据](#从服务端获取用户的所有属性)。

## 监听用户属性变更

好友用户及非好友用户的属性更新，均可能通过以下方式触发 SDK 的 `onUserInfoUpdate` 事件：

1. **主动拉取更新**：调用 [从服务端获取用户属性](#从服务端获取用户的所有属性) 或 [从服务端获取群成员信息](group_members.html#获取群成员列表) 接口时，若服务端返回的用户属性更新时间戳大于本地存储的时间戳，SDK 会自动更新本地数据并触发该事件。
2. **消息携带更新**：若启用了 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理)，当收到消息且消息中携带的发送方用户属性更新时间晚于本地缓存时，SDK 会重新拉取该用户属性并触发该事件。此机制对好友与非好友发送方均生效。
3. **订阅用户变更（仅限非好友）**：若已 [订阅非好友用户的属性变更事件](#订阅非好友用户属性变更事件)，则当这些被订阅的非好友用户属性发生变更时，SDK 也会触发该事件。

**特殊说明**

 - **当前用户**：当前用户的属性变更通过 `onSelfUserInfoUpdate` 单独回调，不适用上述 `onUserInfoUpdate` 逻辑。
 - **仅限好友用户**：若启用了 [登录后自动同步好友列表功能](user_relationship.html#登录后自动同步好友列表)，SDK 会在登录后自动拉取并更新本地好友数据。好友属性变更时，会触发 `onFriendInfoChanged` 事件；该事件为好友关系特有，与 `onUserInfoUpdate` 区分。

通过 `addDelegate` 注册监听器，不再需要时通过 `removeDelegate` 移除：

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
    // 当前用户的属性已更新。
}

- (void)onUserInfoUpdate:(NSDictionary<NSString *, EMUserInfo *> *)userInfos {
    // 其他用户的属性已更新；key 为用户 ID，value 为用户属性。
}

@end
```

## 常见问题

### 设置了用户昵称，为什么获取不到？

如果已通过 [客户端](#设置当前用户的所有属性) 或[RESTful API](/document/server-side/user_attribute_set.html)  设置用户昵称，但后续未能正确获取，通常需要检查以下两点：

 - 调用 RESTful 接口设置用户昵称时，请求中必须使用 `nickname` 键名，否则客户端无法正确读取该属性。
 - RESTful API [获取用户详情](/document/server-side/account_detail_obtain_single.html) 和 [删除用户账户](/document/server-side/account_delete_single.html) 返回的 `nickname` 表示推送昵称，即离线推送通知中显示的昵称，与用户属性中的昵称不同。建议两者保持一致；修改其中一个昵称时，也同步更新另一个昵称。

对于 iOS，可调用 [updatePushDisplayName](/document/ios/push/push_display_attribute.html#设置和获取推送通知的显示属性) 更新推送昵称；RESTful API 可参考 [离线推送通知的显示属性配置](/document/server-side/push_nickname_set_single.html)。

### 为什么会返回错误码 4？

设置和获取用户属性的相关接口超过调用频率限制时，会返回错误码 `4`，即 `EMErrorExceedServiceLimit`。

## 相关功能

### 用户头像管理

如果业务涉及用户头像管理，可参考以下流程：

1. 开通第三方文件存储服务。
2. 将头像文件上传到第三方存储，并获取文件 URL。
3. 将该 URL 写入用户属性中的头像字段 `avatarUrl`。
4. 调用 `fetchUserInfoById` 获取头像 URL，并在本地 UI 中渲染。

### 名片消息

如果业务中需要发送名片消息，也可以结合自定义属性实现：

```objectivec
// 设置自定义消息的 event 为 userCard，并在 customExt 中添加展示名片所需的用户 ID、昵称和头像等字段。
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
    // 根据 error 处理发送结果。
}];
```

如果需要展示更多名片信息，可以继续在 `customExt` 中扩展字段。`customExt` 的键和值均应为字符串。

名片消息通过 `EMCustomMessageBody` 承载自定义事件和扩展字段，再使用 `EMChatMessage` 创建并发送。可参考 [GitHub](https://github.com/easemob/easemob-uikit-ios) 或 [Gitee](https://gitee.com/easemob-code/easemob-uikit-ios) UIKit 示例项目了解消息展示实现。

### 用户属性与用户信息

用户信息指用于业务展示的用户相关信息，包括用户属性、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。关于用户信息详情，请参见 [用户信息自动管理说明](userinfo_provider.html)。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`updateOwnUserInfo`](#设置当前用户的所有属性) | `IEMUserInfoManager` | 异步设置或更新当前用户的多个属性。 |
| [`updateOwnUserInfo`](#设置当前用户的单个属性) | `IEMUserInfoManager` | 异步设置或更新当前用户的单个属性。 |
| [`fetchUserInfoById`](#从服务端获取用户的所有属性) | `IEMUserInfoManager` | 异步获取一个或多个用户的全部属性。 |
| [`fetchUserInfoById`](#从服务端获取用户的指定属性) | `IEMUserInfoManager` | 异步获取指定用户的指定属性。 |
| [`subscribeUsersInfo`](#订阅非好友用户属性变更事件) | `IEMUserInfoManager` | 异步订阅非好友用户的属性变更事件。 |
| [`unsubscribeUsersInfo`](#取消订阅非好友用户属性变更事件) | `IEMUserInfoManager` | 异步取消订阅非好友用户的属性变更事件。 |
| [`fetchSubscribedUsers`](#获取已被订阅用户属性变更事件的用户列表) | `IEMUserInfoManager` | 异步获取已订阅用户属性变更事件的用户列表。 |
| [`userId`](#设置当前用户的所有属性) / [`nickname`](#设置当前用户的所有属性) / [`avatarUrl`](#设置当前用户的所有属性) | `EMUserInfo` | 获取用户 ID、昵称和头像 URL。 |
| [`mail`](#设置当前用户的所有属性) / [`phone`](#设置当前用户的所有属性) / [`gender`](#设置当前用户的所有属性) | `EMUserInfo` | 获取用户邮箱、联系方式和性别。 |
| [`sign`](#设置当前用户的所有属性) / [`birth`](#设置当前用户的所有属性) / [`ext`](#设置当前用户的所有属性) | `EMUserInfo` | 获取用户签名、生日和扩展字段。 |
