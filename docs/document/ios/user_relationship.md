# 管理用户关系

## 功能说明

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

 - 好友管理：添加好友、处理好友申请、删除好友、设置好友备注，以及在登录后自动同步好友列表和好友信息。
 - 黑名单管理：从服务器获取黑名单列表、添加黑名单用户和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 前提条件

开始前，请确保满足以下条件：

 - 完成 iOS SDK 初始化并登录，详见 [快速开始](quickstart.html)。
 - 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
 - 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 监听好友关系和好友信息变更

通过 `EMContactManagerDelegate` 监听好友申请、接受、拒绝、添加、删除及好友信息变更事件。

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

// 对方接受了好友请求。用户 A 向用户 B 发送好友请求，用户 B 同意后，用户 A 收到该事件。
- (void)friendRequestDidApproveByUser:(NSString *)username {
}

// 对方拒绝了好友请求。用户 A 向用户 B 发送好友请求，用户 B 拒绝后，用户 A 收到该事件。
- (void)friendRequestDidDeclineByUser:(NSString *)username {
}

// 接收到好友请求。用户 B 向用户 A 发送好友请求，用户 A 收到该事件。
- (void)friendRequestDidReceiveFromUser:(NSString *)username message:(NSString *)message {
}

// 好友被删除。用户 B 将用户 A 从好友列表中删除后，双方收到该事件。
- (void)friendshipDidRemoveByUser:(NSString *)username {
}

// 好友已添加。用户 B 同意用户 A 的好友申请后，双方收到该事件。
- (void)friendshipDidAddByUser:(NSString *)username {
}

// 好友信息发生变更，可通过 contact 获取更新后的好友信息。
- (void)onFriendInfoChanged:(EMContact *)contact {
}

@end
```

### 添加好友

添加好友用于建立稳定的单聊关系。对方接受申请后，双方成为彼此的好友。当前 SDK 仅支持双向好友关系，不支持单向好友或关注关系。

典型流程如下：

1. 调用 `addContact` 发起好友申请。
2. 对方通过 `friendRequestDidReceiveFromUser` 收到申请，并选择接受或拒绝。
3. 若对方接受，双方建立好友关系；若对方拒绝，本次申请结束。

你可以调用 `addContact` 发起好友申请：

```objectivec
[[EMClient sharedClient].contactManager addContact:@"userB"
                                            message:@"你好，我想添加你为好友"
                                         completion:^(NSString *username, EMError *error) {
    if (!error) {
        // 好友申请发送成功。
    } else {
        // 发送失败。
    }
}];
```

接收方会通过 `friendRequestDidReceiveFromUser` 收到申请，可按需接受或拒绝：

 - 调用 `approveFriendRequestFromUser` 接受好友申请。请求方会收到 `friendRequestDidApproveByUser`，双方都会收到 `friendshipDidAddByUser`。
 - 调用 `declineFriendRequestFromUser` 拒绝好友申请。请求方会收到 `friendRequestDidDeclineByUser`。

```objectivec
// 接受好友申请。
[[EMClient sharedClient].contactManager approveFriendRequestFromUser:@"userB"
                                                           completion:^(NSString *username, EMError *error) {
    // 根据 error 处理结果。
}];

// 拒绝好友申请。
[[EMClient sharedClient].contactManager declineFriendRequestFromUser:@"userB"
                                                           completion:^(NSString *username, EMError *error) {
    // 根据 error 处理结果。
}];
```

:::tip
 - 服务器不会重复下发好友申请事件。若业务需要展示待处理申请列表，建议在收到 `friendRequestDidReceiveFromUser` 时本地保存申请记录。
 - 当前 SDK 不提供好友申请列表拉取接口。
:::

### 删除好友

调用 `deleteContact` 删除好友后。删除好友后，对方好友列表中的该用户也会被移除，双方的好友关系都会解除，对方会收到 `friendshipDidRemoveByUser` 事件。该删除操作无需对方确认，建议在应用侧增加二次确认。

该接口提供 `isDeleteConversation` 参数，可直接控制是否删除与该好友对应的本地单聊会话及消息：

- `true`：删除好友，同时删除本地单聊会话及本地消息。
- `false`：仅删除好友，保留本地单聊会话及本地消息。

```swift
let username = "userId"

// 删除好友，同时删除对应的本地单聊会话及消息。
EMClient.shared().contactManager?.deleteContact(
    username,
    isDeleteConversation: true
) { _, error in
    if let error = error {
        // 好友删除失败，根据错误码和错误描述处理。
        print("删除好友失败，错误码：\(error.code)")
        print("错误描述：\(error.errorDescription ?? "未知错误")")
        return
    }

    // 好友删除成功，本地单聊会话及消息已删除。
    print("删除好友成功")
}
```

### 设置好友备注

调用 `setContactRemark` 设置单个好友的备注。

备注长度不能超过 100 个字符；传入 `nil` 清空好友备注。

```objectivec
[[EMClient sharedClient].contactManager setContactRemark:@"userB"
                                                   remark:@"小李"
                                               completion:^(EMContact *contact, EMError *error) {
    if (!error) {
        // contact 为更新后的好友对象。
    } else {
        // 设置失败。
    }
}];
```

### 获取好友列表和好友信息

#### 登录后自动同步好友列表

iOS SDK 通过登录后的数据同步获取最新好友数据。初始化 SDK 前，需要将 `EMOptions#dataSyncType` 设置为包含 `EMDataSyncTypeContacts`。用户登录后，SDK 会自动同步好友列表及好友信息并写入本地。

**开启好友数据自动同步**

在初始化 SDK 前配置 `EMDataSyncTypeContacts`。若还需要同步其他类型的数据，可按位组合对应枚举值。

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.dataSyncType = EMDataSyncTypeContacts;

// 使用 options 初始化 SDK 后，再调用异步 Token 登录接口。
```

**监听好友数据同步状态**

开启自动同步后，通过 `EMClientDelegate` 监听好友数据同步的开始和完成：

 - `syncDataStartWithType`：某类数据开始同步时触发；`type` 命中 `EMDataSyncTypeContacts` 时表示好友数据开始同步。
 - `syncDataFinished`：某类数据同步完成时触发；`type` 命中 `EMDataSyncTypeContacts` 且 error 为 `nil` 时表示好友数据同步成功。
 - 好友关系及好友信息变更由 `EMContactManagerDelegate` 监听，详见 [监听好友关系和好友信息变更](#监听好友关系和好友信息变更)。
 - 关于不同场景下好友的用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

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
        // 好友数据开始同步。
    }
}

- (void)syncDataFinished:(EMError *)error type:(EMDataSyncType)type {
    if ((type & EMDataSyncTypeContacts) != EMDataSyncTypeContacts) {
        return;
    }
    if (!error) {
        // 好友数据同步成功，可以读取本地好友列表和好友信息。
    } else {
        // 好友数据同步失败。
    }
}

@end
```

#### 从本地读取好友列表

好友数据同步成功后，可调用 `getContacts` 获取本地好友用户 ID 列表，或调用 `getAllContacts` 获取本地好友对象列表。`EMContact` 提供以下好友信息：

 - `userId`：好友用户 ID。
 - `remark`：好友备注。
 - `userInfo`：好友用户属性，如昵称、头像等；本地不存在相关属性时可能为 `nil`。
 - `addTimestamp`：好友添加时间的毫秒级时间戳。

:::tip
`getContacts`、`getAllContacts` 和 `getContact` 为本地读取接口。应在 `syncDataFinished` 确认好友同步成功后使用这些本地数据作为 UI 数据源，避免在主线程执行耗时的数据处理。
:::

#### 获取单个用户属性

如果需要获取指定用户的用户属性，可调用异步接口 `fetchUserInfoById`。关于该接口的说明，详见 [获取用户属性](userinfo_provider.html)。

该接口返回用户属性，而不是 `EMContact`，可作为好友列表读取之外的补充资料获取方式。

```objectivec
[[EMClient sharedClient].userInfoManager fetchUserInfoById:@[@"userB"]
                                                completion:^(NSDictionary<NSString *, EMUserInfo *> *userInfos, EMError *error) {
    if (!error) {
        EMUserInfo *userInfo = userInfos[@"userB"];
        // 使用 userInfo 中的昵称、头像等属性。
    } else {
        // 获取失败。
    }
}];
```

### 设置仅给好友发消息

环信即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，SDK 会在用户发起单聊时检查好友关系；若用户向非好友用户发送单聊消息，SDK 会返回错误码 `221`，即 `EMErrorUserNotOnRoster`。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 添加用户到黑名单

若需屏蔽某个用户的消息，可将其加入黑名单。该操作适用于任何用户，无论是否为好友。被加入黑名单后，该用户将无法向你发送消息或好友申请。

若被加入黑名单的是好友，其好友关系仍会保留在你的好友列表中。

你可以调用 `addUserToBlackList` 将用户加入黑名单：

```objectivec
[[EMClient sharedClient].contactManager addUserToBlackList:@"userB"
                                                completion:^(NSString *username, EMError *error) {
    if (!error) {
        // 已加入黑名单。
    } else {
        // 添加失败。
    }
}];
```

### 将用户从黑名单移除

调用 `removeUserFromBlackList` 将用户从黑名单中移除。移除后，用户发送消息和好友申请等行为将恢复。

```objectivec
[[EMClient sharedClient].contactManager removeUserFromBlackList:@"userB"
                                                     completion:^(NSString *username, EMError *error) {
    if (!error) {
        // 已移出黑名单。
    } else {
        // 移除失败。
    }
}];
```

### 从服务器获取黑名单列表

调用 `getBlackListFromServerWithCompletion` 异步从服务器获取当前用户的黑名单列表。

```objectivec
[[EMClient sharedClient].contactManager getBlackListFromServerWithCompletion:^(NSArray<NSString *> *userIds, EMError *error) {
    if (!error) {
        // userIds 为服务器返回的黑名单用户 ID 列表。
    } else {
        // 获取失败。
    }
}];
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`addContact`](#添加好友) | `IEMContactManager` | 异步发起好友申请。 |
| [`approveFriendRequestFromUser`](#添加好友) / [`declineFriendRequestFromUser`](#添加好友) | `IEMContactManager` | 异步接受或拒绝好友申请。 |
| [`deleteContact`](#删除好友) | `IEMContactManager` | 异步删除好友，并按参数决定是否删除本地会话和消息。 |
| [`setContactRemark`](#设置好友备注) | `IEMContactManager` | 异步设置好友备注。 |
| [`dataSyncType`](#登录后自动同步好友列表) | `EMOptions` | 设置登录后自动同步的数据类型。 |
| [`getContacts`](#从本地读取好友列表) / [`getAllContacts`](#从本地读取好友列表) | `IEMContactManager` | 在好友同步成功后读取本地好友用户 ID 或好友对象列表。 |
| [`fetchUserInfoById`](#获取单个用户属性) | `EMUserInfoManager` | 异步获取指定用户的用户属性。 |
| [`addUserToBlackList`](#添加用户到黑名单) | `IEMContactManager` | 异步将用户加入黑名单。 |
| [`removeUserFromBlackList`](#将用户从黑名单移除) | `IEMContactManager` | 异步将用户移出黑名单。 |
| [`getBlackListFromServerWithCompletion`](#从服务器获取黑名单列表) | `IEMContactManager` | 异步从服务器获取黑名单列表。 |
