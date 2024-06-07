# 管理群组属性

<Toc />

群组是支持多人沟通的即时通讯系统，本文指导你如何使用环信即时通讯 IM HarmonyOS SDK 在实时互动 app 中实现群组属性相关功能。

## 技术原理

环信即时通讯 IM HarmonyOS SDK 提供 `GroupManager` 类和 `Group` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

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

本节介绍如何使用环信即时通讯 IM HarmonyOS SDK 提供的 API 实现上述功能。

### 修改群组名称

仅群主和群管理员可以调用 `changeGroupName` 方法设置和修改群组名称，其他群成员会收到`GroupChangeListener#onSpecificationChanged` 回调。群名称的长度限制为 128 个字符。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.changeGroupName(groupId, changedGroupName).then(res => console.log(res.groupName()));
```

### 修改群组描述

仅群主和群管理员可以调用 `changeGroupDescription` 方法设置和修改群组描述，其他群成员会收到`GroupChangeListener#onSpecificationChanged` 回调。群描述的长度限制为 512 个字符。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.changeGroupDescription(groupId, description).then(res => console.log(res.description()));
```

### 更新群公告

仅群主和群管理员可以调用 `updateGroupAnnouncement` 方法设置和更新群公告，群公告的长度限制为 512 个字符。群公告更新后，其他群成员收到 `GroupChangeListener#onAnnouncementChanged` 回调。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.updateGroupAnnouncement(groupId, announcement).then(res => console.log(res.announcement()));
```

### 获取群公告

所有群成员均可以调用 `fetchGroupAnnouncement` 方法从服务器获取群公告。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.fetchGroupAnnouncement(groupId).then(res => console.log(res.announcement()));
```

### 管理共享文件

#### 上传共享文件

所有群组成员均可以调用 `uploadGroupSharedFile` 方法上传共享文件至群组，单个群共享文件大小限制为 10 MB。上传共享文件后，其他群成员收到 `GroupChangeListener#onSharedFileAdded` 回调。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.uploadGroupSharedFile(groupId, filePath, callBack).then((res: SharedFile)=> {
    // success logic
});
```

#### 下载共享文件

所有群成员均可调用 `downloadGroupSharedFile` 方法下载群组共享文件。

```TypeScript
let sharedFiles: Array<SharedFile> = await ChatClient.getInstance().groupManager()?.fetchGroupSharedFileList(groupId, pageNum, pageSize);
// 获取需要的共享文件信息
let sharedFile = sharedFiles[index];
let callback: ChatCallback = {
    onProgress: (progress: number): void => {
        // download progress logic
    }
}
ChatClient.getInstance().groupManager()?.downloadGroupSharedFile(groupId, sharedFile.getFileId(), savePath, callback).then(()=> console.log("download success"));
```

#### 删除共享文件

所有群成员均可以调用 `deleteGroupSharedFile` 方法删除群共享文件。删除共享文件后，其他群成员收到 `GroupChangeListener#OnSharedFileDeleted` 回调。

群主和群管理员可删除全部的群共享文件，群成员只能删除自己上传的群文件。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.deleteGroupSharedFile(groupId, fileId).then(()=> console.log("delete success"));
```

#### 从服务器获取共享文件

所有群成员均可以调用 `fetchGroupSharedFileList` 方法从服务器获取群组的共享文件列表。

```TypeScript
ChatClient.getInstance().groupManager()?.fetchGroupSharedFileList(groupId, pageNum, pageSize).then((res)=> {
    // success logic
});
```

### 更新群扩展字段

仅群主和群管理员可以调用 `updateGroupExtension` 方法更新群组的扩展字段，群组扩展字段设置 JSON 格式的数据，用于自定义更多群组信息。群扩展字段的长度限制为 8 KB。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.updateGroupExtension(groupId, extension).then(res => console.log(res.extension()));
```

### 监听群组事件

详见 [监听群组事件](group_manage.html#监听群组事件)。
