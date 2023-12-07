# 管理用户关系

<Toc />

用户登录后，可进行添加联系人、获取好友列表等操作。
本文介绍如何通过环信即时通讯 IM SDK 管理好友关系，包括添加、同意、拒绝、删除、查询好友，以及管理黑名单，包括添加、移出、查询黑名单。
SDK 提供用户关系管理功能，包括好友列表管理和黑名单管理：

- 好友列表管理：查询好友列表、申请添加好友、同意好友申请、拒绝好友申请和删除好友等操作。
- 黑名单管理：查询黑名单列表、将添加用户至黑名单以及从黑名单中移出用户等操作。

## 技术原理

环信即时通讯 IM iOS SDK 可以实现好友的添加移除，黑名单的添加移除等功能：

- 添加、删除好友。
- 设置好友备注。
- 获取好友列表。
- 添加黑名单。
- 删除黑名单。
- 从服务器获取黑名单列表。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 调用好友请求相关方法之前先导入头文件 `IEMContactManager.h`；
- 调用监听接收好友请求等回调方法 API 之前导入头文件：`EMContactManagerDelegate.h`。

## 实现方法

本节展示如何在项目中管理好友的添加移除和黑名单的添加移除。

### 管理好友列表

#### 添加好友

添加好友部分主要功能是发送好友请求、接收好友请求、处理好友请求和好友请求处理结果回调等。

1. 申请指定用户添加好友

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

2. 监听与好友请求相关的回调

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
// 异步方法
[[EMClient sharedClient].contactManager approveFriendRequestFromUser:@"aUsername" completion:^(NSString *aUsername, EMError *aError) {
if (!aError) {
    NSLog(@"同意加好友申请成功");
} else {
    NSLog(@"同意加好友申请失败的原因 --- %@", aError.errorDescription);
}
}];

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

#### 删除好友

删除联系人时会同时删除对方联系人列表中的该用户，建议执行双重确认，以免发生误删操作。删除操作不需要对方同意或者拒绝。

示例代码如下：

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

调用 `deleteContact` 删除好友后，用户 A，B 都会收到 `onContactDeleted` 回调，示例代码如下：

```objectivec
// 好友已被删除。
- (void)friendshipDidRemoveByUser:(NSString *)aUsername
  { }
```

#### 设置好友备注

你可以调用 `setContactRemark` 方法设置好友备注。

好友备注的长度不能超过 100 个字符。

```objective-c
[EMClient.sharedClient.contactManager setContactRemark:@"userId" remark:@"remark" completion:^(EMContact * _Nullable contact, EMError * _Nullable aError) {
            
    }];
```

#### 获取好友列表

你可以从服务器获取好友列表，也可以从本地获取已保存的好友列表。

##### **从服务端获取好友列表**

自 4.2.0 版本开始，你可以调用 `getAllContactsFromServerWithCompletion` 或 `getContactsFromServerWithCursor` 方法从服务器一次性或分页获取好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

- 一次性从服务端获取整个好友列表。

```objectivec
//一次性从服务端获取整个好友列表
[EMClient.sharedClient.contactManager getAllContactsFromServerWithCompletion:^(NSArray<EMContact *> * _Nullable aList, EMError * _Nullable aError) {
            
    }];
```

- 从服务端分页获取好友列表。

```objectivec
//pageSize 的取值范围为 [1,50]
[EMClient.sharedClient.contactManager getContactsFromServerWithCursor:@"" pageSize:50 completion:^(EMCursorResult<EMContact *> * _Nullable aResult, EMError * _Nullable aError) {
        
    }];
```

此外，你也可以调用 `getContactsFromServerWithCompletion` 方法从服务器获取所有好友的列表。该列表只包含好友的用户 ID。

```objectivec
// 从服务器获取好友列表。
// 异步方法
[[EMClient sharedClient].contactManager getContactsFromServerWithCompletion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取所有好友成功 %@",aList);
    } else {
        NSLog(@"获取所有好友失败的原因 %@", aError.errorDescription);
    }
}];
```

##### **从本地获取好友列表**

:::notice
需要从服务器获取好友列表之后，才能从本地获取到好友列表。
:::

自 4.2.0 版本开始，你可以调用 `getContact` 方法从本地获取单个好友的用户 ID 和好友备注；你也可以调用 `getAllContacts` 方法一次性获取整个好友列表，其中每个好友对象包含好友的用户 ID 和好友备注。

- 从本地获取单个好友。  

```objectivec
EMContact* contact = [EMClient.sharedClient.contactManager getContact:@"userId"];
```

- 一次性从本地获取整个好友列表。

```objectivec
NSArray<EMContact*>* contacts = [EMClient.sharedClient.contactManager getAllContacts];
```

此外，你也可以调用 `getContacts` 方法从本地一次性获取所有好友的列表，该列表只包含好友的用户 ID。

示例代码如下：

```objectivec
NSArray *userlist = [[EMClient sharedClient].contactManager getContacts];
```

### 管理黑名单

黑名单是与好友无任何关系的独立体系。可以将任何用户加入黑名单，不论该用户与你是否是好友关系。

黑名单功能包括加入黑名单，从黑名单移出用户和获取黑名单列表。对于获取黑名单，你可从服务器获取黑名单列表，也可从本地数据库获取已保存的黑名单列表。

#### 查看当前用户黑名单列表

1. 通过服务器获取黑名单列表

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

2. 从本地数据库获取黑名单列表

```objectivec
// 同步方法
NSArray *blockList = [[EMClient sharedClient].contactManager getBlackList];
```

#### 将用户加入黑名单

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

#### 将用户移出黑名单

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