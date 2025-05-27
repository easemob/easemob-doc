# 管理群组属性

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中实现群组属性相关功能。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `IEMGroupManager` 类和 `EMGroup` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

- 修改群组名称及描述
- 创建、修改、获取群头像
- 获取、更新群组公告
- 管理群组共享文件
- 更新群扩展字段

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解群组和群成员的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 修改群组名称

仅群主和群管理员可以调用 `changeGroupSubject` 方法设置和修改群组名称，其他群成员都会收到 `EMGroupManagerDelegate#groupSpecificationDidUpdate` 回调，群名称的长度限制为 128 个字符。

```objectivec
[[EMClient sharedClient].groupManager changeGroupSubject:@"subject"];
```

### 修改群组描述

仅群主和群管理员可以调用 `changeDescription` 方法设置和修改群组描述，其他群成员都会收到 `EMGroupManagerDelegate#groupSpecificationDidUpdate` 回调，群描述的长度限制为 512 个字符。

```objectivec
[[EMClient sharedClient].groupManager changeDescription:@"desc"
                         forGroup:@"groupID"
                         error:nil];
```

### 管理群组头像

自 iOS SDK 4.14.0 开始，支持群组头像功能。

#### 设置群组头像

- 创建群组时，可设置群组头像：

```objectivec
EMGroupOptions *options = [[EMGroupOptions alloc] init];
    NSString *groupAvatar = @"group avatar";
    [EMClient.sharedClient.groupManager createGroupWithSubject:@"group name" avatar:groupAvatar description:@"group description" invitees:@[@"user1", @"user2"] message:@"group message" setting:options completion:^(EMGroup * _Nullable group, EMError * _Nullable error) {
    }];
```

- 创建群组后，若设置群组头像，可调用 [修改群组头像](#修改群组头像) API 设置头像。

#### 修改群组头像

创建群组完成后，群主或管理员可调用 `EMGroupManager#updateGroupAvatar` 设置或修改群组头像：

```objectivec
[EMClient.sharedClient.groupManager updateGroupAvatar:@"new group avatar" groupId:@"groupId" completion:^(EMGroup * _Nullable group, EMError * _Nullable error) {
    if(error == nil) {
        // 更新成功
    } else {
        // 更新失败
    }
}];
```

群头像被修改后，其他群成员会收到 `EMGroupManagerDelegate#groupSpecificationDidUpdate` 回调：

```objectivec
- (void)groupSpecificationDidUpdate:(EMGroup *)aGroup
{
    // 群组信息更新
    NSString *groupId = aGroup.groupId;
    // 群组头像
    NSString *groupAvatar = aGroup.groupAvatar;
}
```

#### 获取群组头像

群成员可以通过获取群详情的方法，获取群组头像：

```objectivec
[EMClient.sharedClient.groupManager getGroupSpecificationFromServerWithId:@"groupId" completion:^(EMGroup * _Nullable aGroup, EMError * _Nullable aError) {
    if (aError == nil) {
        // 获取成功,群头像为
        NSString *groupAvatar = aGroup.groupAvatar;
    } else {
        // 获取失败
    }
}];
```

### 更新群公告

仅群主和群管理员可以调用 `updateGroupAnnouncementWithId` 方法设置和更新群公告，群公告的长度限制为 512 个字符。群公告更新后，其他群成员收到 `EMGroupManagerDelegate#groupAnnouncementDidUpdate` 回调。

示例代码如下：

```objectivec
// 同步方法，异步方法见 [EMGroupManager updateGroupAnnouncementWithId:announcement:completion:]
[[EMClient sharedClient].groupManager updateGroupAnnouncementWithId:@"groupID"
                         announcement:@"announcement"
                         error:nil];
```

### 获取群公告

所有群成员均可以调用 `getGroupAnnouncementWithId` 方法从服务器获取群公告。

示例代码如下：

```objectivec
// 同步方法，异步方法见 [EMGroupManager getGroupAnnouncementWithId:completion:]
[[EMClient sharedClient].groupManager getGroupAnnouncementWithId:@"groupID" error:nil];
```

### 管理共享文件

#### 上传共享文件

所有群组成员均可以调用 `uploadGroupSharedFileWithId` 方法上传共享文件至群组，单个群共享文件大小限制为 10 MB。上传共享文件后，其他群成员收到 `EMGroupManagerDelegate#addedSharedFile` 回调。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager uploadGroupSharedFileWithId:@"groupID"
                         filePath:@"filePath"
                         progress:nil
                         completion:nil];
```

#### 下载共享文件

所有群成员均可调用 `downloadGroupSharedFileWithId` 方法下载群组共享文件。

```objectivec
[EMClient.sharedClient.groupManager downloadGroupSharedFileWithId:@"groupId" filePath:@"filePath" sharedFileId:@"fileId" progress:nil completion:^(EMGroup * _Nullable aGroup, EMError * _Nullable aError) {

    }];
```

#### 删除共享文件

所有群成员均可以调用 `removeGroupSharedFileWithId` 方法删除群共享文件。删除共享文件后，其他群成员收到 `EMGroupManagerDelegate#groupFileListDidUpdate` 回调。

群主和群管理员可删除全部的群共享文件，群成员只能删除自己上传的群文件。

```objectivec
// 同步方法，异步方法见 [EMGroupManager removeGroupSharedFileWithId:sharedFileId:completion:]
[[EMClient sharedClient].groupManager removeGroupSharedFileWithId:@"groupID"
                         sharedFileId:@"fileID"
                         error:nil];
```

### 从服务器获取群组的共享文件

所有群成员均可以调用 `getGroupFileListWithId` 方法获取群共享文件。

```objectivec
// 同步方法，异步方法见 [EMGroupManager getGroupFileListWithId:pageNumber:pageSize:completion:]
[[EMClient sharedClient].groupManager getGroupFileListWithId:@"groupID"
                         pageNumber:pageNumber
                         pageSize:pageSize
                         error:nil];
```

### 更新群扩展字段

仅群主和群管理员可以调用 `updateGroupExtWithId` 方法更新群组的扩展字段，群组扩展字段设置 JSON 格式的数据，用于自定义更多群组信息。群扩展字段的长度限制为 8 KB。

示例代码如下：

```objectivec
// 同步方法，异步方法见 [EMGroupManager updateGroupExtWithId:ext:completion:]
[[EMClient sharedClient].groupManager updateGroupExtWithId:@"groupID"
                         ext:@"ext"
                         error:nil];
```

## 更多操作

详见[监听群组事件](group_manage.html#监听群组事件)。
