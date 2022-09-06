# 管理用户关系

[[toc]]

用户登录后，可进行添加联系人、获取好友列表等操作。
本文介绍如何通过环信即时通讯 IM SDK 管理好友关系，包括添加、同意、拒绝、删除、查询好友，以及管理黑名单，包括添加、移出、查询黑名单。
SDK 提供用户关系管理功能，包括好友列表管理和黑名单管理：

- 好友列表管理：查询好友列表、申请添加好友、同意好友申请、拒绝好友申请和删除好友等操作。
- 黑名单管理：查询黑名单列表、将添加用户至黑名单以及从黑名单中移出用户等操作。

## 技术原理

环信即时通讯 IM iOS SDK 可以实现好友的添加移除，黑名单的添加移除等功能，主要调用方法如下：

- `addContact` 申请添加好友。
- `deleteContact` 删除好友。
- `getContactsFromServerWithCompletion` 从服务器获取好友列表。
- `addUserToBlackList` 添加黑名单。
- `removeUserFromBlackList` 删除黑名单。
- `getBlackListFromServerWithCompletion` 从服务器获取黑名单列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 调用好友请求相关方法之前先导入头文件 `IEMContactManager.h`；
- 调用监听接收好友请求等回调方法 API 之前导入头文件：`EMContactManagerDelegate.h`。

## 实现方法

本节展示如何在项目中管理好友的添加移除和黑名单的添加移除。

### 管理好友申请

好友申请部分主要功能是发送好友请求、接收好友请求、处理好友请求和好友请求处理结果回调等。

#### 申请添加好友

示例代码如下：

```objectivec
[[EMClient sharedClient].contactManager addContact:@"aUsername" message:@"Message" completion:^(NSString *aUsername, EMError *aError) {
if (!aError) {
    NSLog(@"添加好友成功 %@",aUsername);
} else {
    NSLog(@"添加好友失败的原因 %@", aError.errorDescription);
}
}];
```

#### 监听与好友请求相关的回调

请监听好友请求相关事件的回调，这样当用户收到好友请求，可以调用接受请求的 RESTful API 添加好友。服务器不会重复下发与好友请求相关的事件，建议退出应用时保存相关的请求数据。

设置好友监听示例代码如下：

```objectivec
// 注册好友回调。
[[EMClient sharedClient].contactManager addDelegate:self delegateQueue:nil];
// 移除好友回调。
[[EMClient sharedClient].contactManager removeDelegate:self];

// 好友申请已收到。
- (void)friendRequestDidReceiveFromUser:(NSString *)aUsername
      message:(NSString *)aMessage
  { }
```

收到好友请求后，可以选择同意加好友申请或者拒绝加好友申请，示例代码如下：

```objectivec
// 同意好友申请。
[[EMClient sharedClient].contactManager approveFriendRequestFromUser:@"aUsername" completion:^(NSString *aUsername, EMError *aError) {
if (!aError) {
    NSLog(@"同意加好友申请成功");
} else {
    NSLog(@"同意加好友申请失败的原因 --- %@", aError.errorDescription);
}
}];

// 拒绝好友申请。
[[EMClient sharedClient].contactManager declineFriendRequestFromUser:@"aUsername" completion:^(NSString *aUsername, EMError *aError) {
if (!aError) {
    NSLog(@"拒绝加好友申请成功");
} else {
    NSLog(@"拒绝加好友申请失败的原因 %@", aError.errorDescription);
}
}];
```

当你同意或者拒绝后，对方会通过好友事件回调，收到 `friendRequestDidApprove` 或者 `friendRequestDidDecline`。

示例代码如下：

```objectivec
// 对方同意了好友申请。
- (void)friendRequestDidApproveByUser:(NSString *)aUsername
  { }

// 对方拒绝了好友申请。
- (void)friendRequestDidDeclineByUser:(NSString *)aUsername
  { }
```

### 删除好友

删除联系人时会同时删除对方联系人列表中的该用户，建议执行双重确认，以免发生误删操作。删除操作不需要对方同意或者拒绝。

示例代码如下：

```objectivec
// 删除好友。
[[EMClient sharedClient].contactManager deleteContact:@"aUsername" isDeleteConversation:aIsDeleteConversation completion:^(NSString *aUsername, EMError *aError) {
if (!aError) {
    NSLog(@"删除好友成功");
} else {
    NSLog(@"删除好友失败的原因 %@", aError.errorDescription);
}
}];
```

#### 删除好友回调

删除好友部分主要是删除某个好友，删除好友的回调等。用户 B 删除与用户 A 的好友关系后，用户 A，B 都会收到回调，示例代码如下：

```objectivec
// 联系人已被删除。
- (void)friendshipDidRemoveByUser:(NSString *)aUsername
  { }
```

### 获取好友列表

你可以从服务器获取好友列表，也可以从本地数据库获取已保存的好友列表。

:::notice
需要从服务器获取好友列表之后，才能从本地数据库获取到好友列表。
:::

示例代码如下：

```objectivec
// 从服务器获取好友列表。
[[EMClient sharedClient].contactManager getContactsFromServerWithCompletion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取所有好友成功 %@",aList);
    } else {
        NSLog(@"获取所有好友失败的原因 %@", aError.errorDescription);
    }
}];
// 从本地数据库获取好友列表。
NSArray *userlist = [[EMClient sharedClient].contactManager getContacts];
```

### 管理黑名单

将指定的用户加入黑名单后，对方将无法给你发送消息。黑名单部分主要功能是获取黑名单列表，加入黑名单，从黑名单移出等。获取黑名单可从服务器获取黑名单列表，也可从本地数据库获取已保存的黑名单列表。

黑名单是与好友无任何关系的独立体系。可以将任何用户加入黑名单，不论该用户是否与你是好友关系。同时，如果你将好友加入黑名单，该用户仍然还是你的好友，也在黑名单中。

黑名单部分主要是获取黑名单列表，加入黑名单，从黑名单移出等。

#### 获取黑名单列表

获取黑名单可从服务器获取黑名单列表，示例代码如下：

```objectivec
// 从服务器获取黑名单列表。
[[EMClient sharedClient].contactManager getBlackListFromServerWithCompletion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取黑名单列表成功 %@",aList);
    } else {
        NSLog(@"获取黑名单列表失败的原因 %@", aError.errorDescription);
    }
}];
```

也可从本地数据库获取已保存的黑名单列表。从服务器获取黑名单列表之后，才能从本地数据库获取到黑名单列表。

从本地数据库获取示例代码如下：

```objectivec
NSArray *blockList = [[EMClient sharedClient].contactManager getBlackList];
```

#### 将用户加入黑名单

示例代码如下：

```objectivec
[[EMClient sharedClient].contactManager addUserToBlackList:@"aUsername" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"将用户加入黑名单成功");
    } else {
        NSLog(@"将用户加入黑名单失败的原因 %@", aError.errorDescription);
    }
}];
```

#### 将用户移出黑名单

示例代码如下：

```objectivec
[[EMClient sharedClient].contactManager removeUserFromBlackList:@"aUsername" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"将用户移出黑名单成功");
    } else {
        NSLog(@"将用户移出黑名单失败的原因 %@", aError.errorDescription);
    }
}];
```