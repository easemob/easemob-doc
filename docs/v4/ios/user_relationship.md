# 管理用户关系  

SDK 提供用户关系管理功能，包括好友管理和黑名单管理。

- 好友管理：添加好友、处理好友申请、删除好友、设置好友备注、获取好友列表，以及在登录成功后自动同步好友列表和好友信息。
- 黑名单管理：获取黑名单列表、以及添加和移除黑名单用户。使用该功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通该服务。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 技术原理

环信即时通讯 IM iOS SDK 可以实现好友的添加移除，黑名单的添加移除等功能：

- 添加、删除好友。
- 设置好友备注。
- 获取好友列表和好友信息
- 登录后自动同步好友列表
- 添加黑名单。
- 删除黑名单。
- 从服务器获取黑名单列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 调用好友请求相关方法之前先导入头文件 `IEMContactManager.h`；
- 调用监听接收好友请求等回调方法 API 之前导入头文件：`EMContactManagerDelegate.h`。
- 已在 [环信控制台](https://console.easemob.com/user/login) 开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 好友管理

### 添加好友事件监听

为了接收好友添加、删除和好友申请状态的变更事件，你需要添加好友事件监听。

```objectivec
// 注册好友回调。
[[EMClient sharedClient].contactManager addDelegate:self delegateQueue:nil];
// 移除好友回调。
[[EMClient sharedClient].contactManager removeDelegate:self];

// 对方接受了好友请求。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，同意加好友，则用户 A 收到该事件。
- (void)friendRequestDidApproveByUser:(NSString *)aUsername
{
   
}

// 对方拒绝了好友请求。用户 A 向用户 B 发送好友请求，用户 B 收到好友请求后，拒绝加好友，则用户 A 收到该事件。
- (void)friendRequestDidDeclineByUser:(NSString *)aUsername
{
    
}

// 接收到好友请求。用户 B 向用户 A 发送好友请求，用户 A 收到该事件。
- (void)friendRequestDidReceiveFromUser:(NSString *)aUsername message:(NSString *)aMessage
{
    
}

// 好友被删除。用户 B 将用户 A 从好友列表上删除，用户 A 收到该事件。
- (void)friendshipDidRemoveByUser:(NSString *)aUsername
{
    
}

// 好友已添加。用户 B 向用户 A 发送好友请求，用户 A 接受该请求，用户 B 收到 `onFriendRequestAccepted` 事件，双方用户收到 `onContactAdded` 事件。
- (void)friendshipDidAddByUser:(NSString *)aUsername
{
    
}
```

### 添加好友

添加好友用于建立稳定的单聊关系。对方接受申请后，双方成为彼此的好友。当前 SDK 仅支持双向好友关系，不支持单向好友或关注关系。

典型流程如下：

1. 调用 `addContact` 发起好友申请。
2. 对方通过 `friendRequestDidReceiveFromUser` 收到申请，并选择接受或拒绝。
3. 若对方接受，双方建立好友关系；若对方拒绝，本次申请结束。

你可以调用 `addContact` 发起好友申请：

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].contactManager addContact:@"aUsername" message:@"Message" completion:^(NSString *aUsername, EMError *aError) {
if (!aError) {
    NSLog(@"添加好友成功 %@",aUsername);
} else {
    NSLog(@"添加好友失败的原因 %@", aError.errorDescription);
}
}];
```

对端用户通过 `friendRequestDidReceiveFromUser` 事件监听收到好友请求，确认是否成为好友。 

- 调用 `approveFriendRequestFromUser` 接受好友申请。请求方收到 `friendRequestDidApproveByUser` 事件，双方都收到 `friendshipDidAddByUser` 事件。

```objectivec
// 接受好友请求。
// 异步方法
[[EMClient sharedClient].contactManager approveFriendRequestFromUser:@"aUsername" completion:^(NSString *aUsername, EMError *aError) {
if (!aError) {
    NSLog(@"同意加好友申请成功");
} else {
    NSLog(@"同意加好友申请失败的原因 --- %@", aError.errorDescription);
}
}];
```

```objectivec
// 请求方收到的事件
- (void)friendRequestDidApproveByUser:(NSString *)aUsername
  { }
```

- 调用 `declineFriendRequestFromUser` 拒绝好友申请。请求方收到 `friendRequestDidDeclineByUser` 事件。

```objectivec

// 拒绝好友申请。
// 异步方法
[[EMClient sharedClient].contactManager declineFriendRequestFromUser:@"aUsername" completion:^(NSString *aUsername, EMError *aError) {
if (!aError) {
    NSLog(@"拒绝加好友申请成功");
} else {
    NSLog(@"拒绝加好友申请失败的原因 %@", aError.errorDescription);
}
}];
```

```objectivec
// 请求方收到的事件。
- (void)friendRequestDidDeclineByUser:(NSString *)aUsername
  { }
```

:::tip

- 服务器不会重复下发好友申请事件。若业务需要展示待处理申请列表，建议在收到 `friendRequestDidReceiveFromUser` 时本地保存申请记录。
- 当前 SDK 不提供好友申请列表拉取接口。
:::

### 删除好友

调用 `deleteContact` 删除好友后，对方好友列表中的该用户也会被移除。该操作无需对方确认，建议在应用侧增加二次确认。

```objectivec
// 删除好友。
// 异步方法
[[EMClient sharedClient].contactManager deleteContact:@"aUsername" isDeleteConversation:aIsDeleteConversation completion:^(NSString *aUsername, EMError *aError) {
if (!aError) {
    NSLog(@"删除好友成功");
} else {
    NSLog(@"删除好友失败的原因 %@", aError.errorDescription);
}
}];
```

删除后，双方均会收到 `friendshipDidRemoveByUser` 回调，示例代码如下：

```objectivec
// 好友已被删除。
- (void)friendshipDidRemoveByUser:(NSString *)aUsername
  { }
```

### 设置好友备注

自 4.2.0 版本开始，你可以调用 `setContactRemark` 方法设置好友备注。

```objectivec
// 好友备注长度不能超过 100 个字符。传入 nil 清空好友备注。
[EMClient.sharedClient.contactManager setContactRemark:@"userId" remark:@"remark" completion:^(EMContact * _Nullable contact, EMError * _Nullable aError) {
            
    }];
```

### 获取好友列表和好友信息

你可以从服务器获取好友列表，也可以从本地获取已保存的好友列表。

#### 从服务端获取好友列表

自 4.2.0 版本开始，你可以调用 `getAllContactsFromServerWithCompletion` 或 `getContactsFromServerWithCursor` 方法从服务器一次性或分页获取好友列表，其中每个好友对象 `EMContact` 包含好友的用户 ID 和好友备注；自 4.22.0 起，还可以进一步获取好友用户属性和好友添加时间。

`EMContact` 对象包含如下信息：

- `userId`：好友的用户 ID。
- `remark`：好友备注。
- `userInfo`：好友用户属性对象，包含好友的用户属性，如昵称、头像等。
- `addTimestamp`：好友添加时间，单位为毫秒。

示例代码如下：

- 一次性获取服务端的好友列表。

```objectivec
[EMClient.sharedClient.contactManager getAllContactsFromServerWithCompletion:^(NSArray<EMContact *> * _Nullable aList, EMError * _Nullable aError) {
            
    }];
```

- 分页获取服务端的好友列表。

```objectivec
//pageSize 的取值范围为 [1,50]
[EMClient.sharedClient.contactManager getContactsFromServerWithCursor:@"" pageSize:50 completion:^(EMCursorResult<EMContact *> * _Nullable aResult, EMError * _Nullable aError) {
        
    }];
```

此外，你也可以调用 `getContactsFromServerWithCompletion` 方法从服务器获取所有好友的列表。该列表只包含好友的用户 ID。

```objectivec
// 异步方法
[[EMClient sharedClient].contactManager getContactsFromServerWithCompletion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取所有好友成功 %@",aList);
    } else {
        NSLog(@"获取所有好友失败的原因 %@", aError.errorDescription);
    }
}];
```

#### 从本地获取好友列表

自 v4.2.0 开始，你可以调用 `getContact` 方法从本地获取单个好友的用户 ID 和好友备注；你也可以调用 `getAllContacts` 方法一次性获取整个好友列表，其中每个好友对象 `EMContact` 包含好友的用户 ID 和好友备注；自 v4.22.0 起，还可以进一步获取好友用户属性和好友添加时间。

`EMContact` 对象包含如下信息：

- `userId`：好友的用户 ID。
- `remark`：好友备注。
- `userInfo`：好友用户属性对象，包含好友的用户属性，如昵称、头像等。
- `addTimestamp`：好友添加时间，单位为毫秒。

:::tip
需要先从服务器获取好友列表，才能从本地读取到好友列表。
:::

- 获取本地单个好友：  

```objectivec
EMContact* contact = [EMClient.sharedClient.contactManager getContact:@"userId"];
```

- 一次性获取本地好友列表：

```objectivec
NSArray<EMContact*>* contacts = [EMClient.sharedClient.contactManager getAllContacts];
```

此外，你也可以调用 `getContacts` 方法从本地一次性获取所有好友的列表，该列表只包含好友的用户 ID。

示例代码如下：

```objectivec
NSArray *userlist = [[EMClient sharedClient].contactManager getContacts];
```

#### 从本地内存获取单个用户属性

如果需要直接从本地内存读取指定用户的属性，可以调用 `EMUserInfoManager#getUserInfoByIds`。关于该接口的说明，详见 [从本地内存读取用户属性](userinfo_provider.html#从本地内存读取用户属性)。

该接口返回的是单个用户的 `userInfo`，不是 `EMContact`。它不会发起网络请求，可作为好友列表读取之外的补充资料读取方式。

### 登录后自动同步好友列表

#### 开启自动同步

自 4.22.0 版本开始，你可以设置在登录成功后自动同步好友列表及好友信息。开启后，SDK 会在登录完成后自动拉取并更新本地好友数据，便于应用直接读取最新的好友列表和好友信息。

你可以通过 `EMOptions#enableAutoSyncContacts` 配置该功能。该配置需要在初始化 SDK 时设置，示例代码如下：

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"YourAppKey"];
// 开启登录后自动同步好友列表及好友信息。
options.enableAutoSyncContacts = YES;
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

#### 监听同步状态和好友信息变更

开启自动同步后，建议通过 `EMContactManagerDelegate` 监听好友同步开始、同步完成以及好友信息变更等事件，以便及时更新 UI 或处理异常情况。

- `onFriendStartSync`：好友列表及好友信息开始同步时触发。
- `onFriendSyncFinished`：好友列表及好友信息同步完成时触发。若同步失败，可通过 `error` 获取失败原因。
- `onFriendInfoChanged`：好友信息发生变更时触发。你可以通过 `contact` 获取更新后的好友信息。

关于不同场景下好友的用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

```objectivec
// 添加好友事件监听。
[[EMClient sharedClient].contactManager addDelegate:self delegateQueue:nil];

// 好友列表及好友信息开始同步。
- (void)onFriendStartSync
{
}

// 好友列表及好友信息同步完成。
- (void)onFriendSyncFinished:(EMError *)error
{
    if (error) {
        NSLog(@"好友列表及好友信息同步失败：%@", error.errorDescription);
    }
}

// 好友信息发生变更。
- (void)onFriendInfoChanged:(EMContact *)contact
{
    EMUserInfo *userInfo = contact.userInfo;
    NSUInteger addTimestamp = contact.addTimestamp;
}
```

### 设置仅给好友发消息

环信即时通讯 IM 默认支持非好友用户之间发送单聊消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要在 [环信控制台](https://console.easemob.com/user/login) [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。开启后，SDK 会在用户发起单聊时检查好友关系；若用户向非好友用户发送单聊消息，SDK 会返回错误码 `221`。

## 黑名单管理

黑名单与好友体系相互独立，主要用于管理需要屏蔽的用户。

### 查看当前用户黑名单列表

- 通过服务器获取黑名单列表

从服务器获取黑名单列表之后，才能从本地数据库获取到黑名单列表。

```objectivec
// 从服务器获取黑名单列表。
// 异步方法
[[EMClient sharedClient].contactManager getBlackListFromServerWithCompletion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取黑名单列表成功 %@",aList);
    } else {
        NSLog(@"获取黑名单列表失败的原因 %@", aError.errorDescription);
    }
}];
```

- 从本地数据库获取黑名单列表

```objectivec
// 同步方法
NSArray *blockList = [[EMClient sharedClient].contactManager getBlackList];
```

### 将用户加入黑名单

你可以调用 `addUserToBlackList` 将指定用户加入黑名单。用户被加入黑名单后将无法向你发送消息，也无法发送好友申请。

用户可以将任何其他聊天用户添加到他们的黑名单列表中，无论该用户是否是好友。好友被加入黑名单后仍在好友列表上显示。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].contactManager addUserToBlackList:@"aUsername" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"将用户加入黑名单成功");
    } else {
        NSLog(@"将用户加入黑名单失败的原因 %@", aError.errorDescription);
    }
}];
```

### 将用户移出黑名单

你可以调用 `removeUserFromBlackList` 将用户从黑名单移除，用户发送消息等行为将恢复。

```objectivec
// 异步方法
[[EMClient sharedClient].contactManager removeUserFromBlackList:@"aUsername" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"将用户移出黑名单成功");
    } else {
        NSLog(@"将用户移出黑名单失败的原因 %@", aError.errorDescription);
    }
}];
```
