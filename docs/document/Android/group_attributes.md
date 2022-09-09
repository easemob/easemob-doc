# 管理群组属性

<Toc />

群组是支持多人沟通的即时通讯系统，本文指导你如何使用环信即时通讯 IM Android SDK 在实时互动 app 中实现群组属性相关功能。

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMGroupManager` 类和 `EMGroup` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

- 修改群组名称及描述
- 获取、更新群组公告
- 管理群组共享文件
- 更新群扩展字段

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解群组和群成员的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM Android SDK 提供的 API 实现上述功能。

### 修改群组名称

仅群主和群管理员可以调用 `changeGroupName` 方法设置和修改群组名称，群名称的长度限制为 128 个字符。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncChangeGroupName(String, String, EMCallBack)}。
EMClient.getInstance().groupManager().changeGroupName(groupId,changedGroupName);
```

### 修改群组描述

仅群主和群管理员可以调用 `changeGroupDescription` 方法设置和修改群组描述，群描述的长度限制为 512 个字符。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncChangeGroupDescription(String, String, EMCallBack)}。
EMClient.getInstance().groupManager().changeGroupDescription(groupId,description);
```

### 更新群公告

仅群主和群管理员可以调用 `updateGroupAnnouncement` 方法设置和更新群公告，群公告的长度限制为 512 个字符。群公告更新后，其他群成员收到 `EMGroupChangeListener#onAnnouncementChanged` 回调。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncUpdateGroupAnnouncement(String, String, EMCallBack)}。
EMClient.getInstance().groupManager().updateGroupAnnouncement(groupId, announcement);
```

### 获取群公告

所有群成员均可以调用 `fetchGroupAnnouncement` 方法从服务器获取群公告。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncFetchGroupAnnouncement(String, EMValueCallBack)}。
EMClient.getInstance().groupManager().fetchGroupAnnouncement(groupId);
```

### 管理共享文件

#### 上传共享文件

所有群组成员均可以调用 `uploadGroupSharedFile` 方法上传共享文件至群组，群共享文件大小限制为 10 MB。上传共享文件后，其他群成员收到 `EMGroupChangeListener#OnSharedFileAddedFromGroup` 回调。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncUploadGroupSharedFile(String, String, EMCallBack)}。
EMClient.getInstance().groupManager().uploadGroupSharedFile(groupId, filePath, callBack);
```

#### 删除共享文件

所有群成员均可以调用 `DeleteGroupSharedFile` 方法删除群共享文件。删除共享文件后，其他群成员收到 `EMGroupChangeListener#OnSharedFileDeletedFromGroup` 回调。

群主和群管理员可删除全部的群共享文件，群成员只能删除自己上传的群文件。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncDeleteGroupSharedFile(String, String, EMCallBack)}。
EMClient.getInstance().groupManager().deleteGroupSharedFile(groupId, fileId);
```

#### 从服务器获取共享文件

所有群成员均可以调用 `fetchGroupSharedFileList` 方法从服务器获取群组的共享文件列表。

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncFetchGroupSharedFileList(String, int, int, EMValueCallBack)}。
EMClient.getInstance().groupManager().fetchGroupSharedFileList(groupId, pageNum, pageSize);
```

### 更新群扩展字段

仅群主和群管理员可以调用 `updateGroupExtension` 方法更新群组的扩展字段，群组扩展字段设置 JSON 格式的数据，用于自定义更多群组信息。群扩展字段的长度限制为 8 KB。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
EMClient.getInstance().groupManager().updateGroupExtension(groupId, extension);
```

### 更多操作

你可以参考如下文档，在项目中实现更多的群组相关功能：

- [群组概述](group_overview.html)
- [创建和管理群组](group_manage.html)
- [群成员管理](group_members.html)
