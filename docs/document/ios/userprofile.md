# 管理用户属性

<Toc />

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。查看用户信息时，可以直接查询服务器存储的用户属性信息。

本文介绍如何通过管理用户属性设置、更新、存储并获取实时消息用户的相关信息。

:::notice
为保证用户信息安全，SDK 仅支持用户设置或更新自己的用户属性。
:::

## 技术原理

环信即时通讯 IM iOS SDK 提供一个 `userInfoManager` 类，支持获取、设置及修改用户属性信息，其中包含如下方法：

- `updateOwnUserInfo` 设置和修改当前用户自己的属性信息；
- `fetchUserInfoById` 获取指定用户的所有用户属性信息。

## 前提条件

设置用户属性前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

本节介绍如何在项目中设置及获取用户属性。

实现过程中注意单个用户的所有属性最大不超过 2 KB，单个 app 所有用户属性数据最大不超过 10 GB。

### 设置当前用户的属性

参考如下示例代码，在你的项目中当前用户设置自己的所有属性或者仅设置某一项属性。

```objectivec
// 设置用户所有属性。
EMUserInfo *userInfo = [[EMUserInfo alloc] init];
userInfo.userId = EMClient.sharedClient.currentUsername;
userInfo.nickName = @"EM";
userInfo.avatarUrl = @"http://www.EM.io";
userInfo.birth = @"2000.10.10";
userInfo.sign = @"hello world";
userInfo.phone = @"12333333333";
userInfo.mail = @"123456@qq.com";
userInfo.gender = 1;
// 异步方法
[EMClient.sharedClient.userInfoManager updateOwnUserInfo:userInfo completion:^(EMUserInfo *aUserInfo, EMError *aError)

}];
```

```objectivec
// 以修改用户头像为例，演示如何修改指定用户属性。
NSString *url = @"https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png";

[[EMClient sharedClient].userInfoManager updateOwnUserInfo:url withType:EMUserInfoTypeAvatarURL completion:^(EMUserInfo *aUserInfo, EMError *aError) {
    if (aUserInfo && completion) {
        completion(aUserInfo);
    }
}];
```

若[调用 RESTful 的接口设置](/document/server-side/userprofile.html#设置用户属性)或[删除用户属性](/document/server-side/userprofile.html#删除用户属性)，请求中必须传以下字段各客户端才能获取到。

| 字段        | 类型   | 描述                                                       |
| ----------- | ------ | ---------------------------------------------------------- |
| `nickname`  | String | 用户昵称。长度在 64 字符内。                               |
| `avatarurl` | String | 用户头像 URL 地址。长度在 256 字符内。                     |
| `phone`     | String | 用户联系方式。长度在 32 字符内。                           |
| `mail`      | String | 用户邮箱。长度在 64 字符内。                               |
| `gender`    | Int | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 设置为其他值无效。 |
| `sign`      | String | 用户签名。长度在 256 字符内。                              |
| `birth`     | String | 用户生日。长度在 64 字符内。                               |
| `ext`       | String | 扩展字段。                                                 |

### 获取用户属性

用户可以获取指定一个或多个用户的全部用户属性。

示例代码如下：

```objectivec
// 获取用户所有属性，一次调用用户 ID 数量不能超过 100。
// 异步方法
[[EMClient sharedClient].userInfoManager fetchUserInfoById:@[EMClient.sharedClient.currentUsername] 		completion:^(NSDictionary *aUserDatas, EMError *aError) {
}];
```

```objectivec
// 获取指定用户的指定用户属性。
NSString *userIds = @[@"user1",@"user2"];
NSArray<NSNumber *> *userInfoTypes = @[@(EMUserInfoTypeAvatarURL),@(EMUserInfoTypePhone),@(EMUserInfoTypeMail)];
// 异步方法
[[EMClient sharedClient].userInfoManager fetchUserInfoById:userIds type:userInfoTypes completion:^(NSDictionary *aUserDatas, EMError *aError) {

}];
```

## 更多功能

### 用户头像管理

如果你的应用场景中涉及用户头像管理，还可以参考如下步骤进行操作：

1. 开通第三方文件存储服务。详情可以参考文件储存服务商的文档。
2. 将头像文件上传至上述第三方文件存储，并获取存储 URL 地址。
3. 将该 URL 地址传入用户属性的头像字段（avatarUrl）。
4. 显示头像时，通过调用 `fetchUserInfoById` 获取头像 URL，并在本地 UI 中渲染头像。

### 名片消息

如果你的场景中涉及名片消息，你也可以使用自定义属性功能，并参考如下示例代码实现：

```objectivec
// 设置自定义消息的 `event` 为 `userCard` ，并在 `ext` 中添加展示名片所需要的用户 ID、昵称和头像等字段。
EMCustomMessageBody *body = [[EMCustomMessageBody alloc] init];
body.event = @"userCard";
NSDictionary *messageExt = @{@"userId":EMClient.sharedClient.currentUsername,
                           @"nickname":@"nickname",
                           @"avatar":@"https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png"
                        };
body.ext = messageExt;
// 异步方法
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:@"conversationID"
                                                from:@"sender"
                                                to:@"receiver"
                                                body:body
                                                ext:nil];
// 发送消息
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {}];
```

如果需要在名片中展示更丰富的信息，可以在 `ext` 中增加更多字段。

可参考 [示例项目](https://www.easemob.com/download/im)  中的以下类：

- `EMCustomMessageBody`
- `EMChatMessage`