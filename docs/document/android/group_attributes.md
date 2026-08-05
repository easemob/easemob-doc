# 管理群组属性

## 功能说明

群组是支持多人沟通的即时通讯场景。本文介绍如何使用环信即时通讯 IM Android SDK 获取和管理群组详情、名称、描述、头像、公告、共享文件及扩展字段。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已登录并连接到 IM 服务器。
- 已了解接口调用频率、群组及群成员数量限制，详见 [使用限制](/product/limitation.html)。

## 获取群组详情

调用 `EMGroupManager#getGroup` 可以根据群组 ID 从本地内存获取群组详情，该接口不会发起网络请求。调用 `asyncGetGroupFromServer` 可以从服务器获取最新群组详情，并更新本地缓存。

`asyncGetGroupFromServer` 不返回群成员列表。如果需要群成员列表，需调用 `asyncFetchGroupMembersInfo` 或 `asyncFetchGroupMembers`，详见 [获取群成员列表](group_members.html#获取群成员列表)。

:::tip
对于公有群，用户即使不加入群也能获取群组详情，而对于私有群，用户只有加入了群组才能获取群详情。
:::

```java
// 从本地内存获取群组详情，不会向服务器发起请求。
EMGroup localGroup = EMClient.getInstance()
        .groupManager()
        .getGroup(groupId);

// 从服务器获取最新群组详情，并更新本地缓存。
EMClient.getInstance()
        .groupManager()
        .asyncGetGroupFromServer(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        // 获取群组 ID。
                        String id = group.getGroupId();

                        // 获取群组名称。
                        String name = group.getGroupName();

                        // 获取群组描述。
                        String description = group.getDescription();

                        // 获取群头像 URL。
                        String avatar = group.getGroupAvatar();

                        // 获取群主的用户 ID。
                        String owner = group.getOwner();

                        // 获取群管理员的用户 ID 列表。
                        List<String> admins = group.getAdminList();

                        // 判断当前用户是否已屏蔽该群组的消息。
                        boolean messageBlocked = group.isMsgBlocked();

                        // 判断群组是否已被禁用。
                        boolean disabled = group.isDisabled();
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 获取失败，根据错误码和错误信息处理。
                    }
                });
```
## 修改群组配置

群主或群管理员可调用 `asyncUpdateGroupConfigs` 按指定属性位修改群组配置，未指定的字段不会被覆盖。

通过 `EMGroupConfigsType` 指定要更新的字段，如下表所示：

| 配置类型                 | `EMGroupConfigs` 字段  | 说明                                 |
| ------------------------ | ---------------------- | ------------------------------------ |
| `IS_PUBLIC`              | `isPublic`             | 是否为公开群。                       |
| `JOIN_APPROVAL_REQUIRED` | `joinApprovalRequired` | 公开群加入是否需要群主或管理员审批。 |
| `ALLOW_INVITES`          | `allowInvites`         | 私有群普通成员是否可以邀请其他用户。 |
| `MAX_USERS`              | `maxUsers`             | 群组最大成员数。默认值为 `200`。                    |
| `INVITE_NEED_CONFIRM`    | `inviteNeedConfirm`    | 被邀请用户加入群组前是否需要确认。   |
| `EXT`                    | `extField`             | 群组扩展字段。                       |

例如，仅修改群最大成员数，示例代码如下：

```java
// 异步方法。
//未包含在 `EnumSet` 中的配置项不会被更新。
EMGroupConfigs configs = new EMGroupConfigs();
configs.maxUsers = 300;
EMClient.getInstance().groupManager().asyncUpdateGroupConfigs(
        groupId,
        EnumSet.of(EMGroupManager.EMGroupConfigsType.MAX_USERS),
        configs,
        new EMValueCallBack<EMGroup>() {
            @Override
            public void onSuccess(EMGroup group) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

群成员会通过 `onSpecificationChanged(EMGroup group)` 收到群组详情更新回调。回调中的 `EMGroup` 表示更新后的群组信息。为确保获取完整且最新的配置，建议在回调中调用 `asyncGetGroupFromServer` 从服务器获取群组详情。

## 修改群组名称

仅群主和群管理员可以调用 `asyncChangeGroupName` 修改群组名称。修改成功后，其他群成员会收到 `EMGroupChangeListener#onSpecificationChanged` 回调。群名称的长度限制为 128 个字符。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncChangeGroupName(
                groupId,
                changedGroupName,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## 修改群组描述

仅群主和群管理员可以调用 `asyncChangeGroupDescription` 修改群组描述。修改成功后，其他群成员会收到 `EMGroupChangeListener#onSpecificationChanged` 回调。群描述的长度限制为 512 个字符。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncChangeGroupDescription(
                groupId,
                description,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## 管理群组头像

Android SDK 支持在创建群组时设置群头像，也支持在群组创建后修改或获取群头像。

### 设置群组头像

创建群组时，将头像 URL 作为 `asyncCreateGroup` 的 `avatar` 参数传入。Android SDK 使用 `EMGroupConfigs` 配置群组属性。

```java
EMGroupConfigs configs = new EMGroupConfigs();
configs.maxUsers = 200;
configs.isPublic = false;
configs.allowInvites = true;
configs.inviteNeedConfirm = true;

EMClient.getInstance()
        .groupManager()
        .asyncCreateGroup(
                groupName,
                avatar,
                description,
                new String[0],
                null,
                configs,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

创建群组后，可以通过 [修改群组头像](#修改群组头像) 接口设置或更新头像。

### 修改群组头像

创建群组完成后，群主或群管理员可以调用 `asyncChangeGroupAvatar` 设置或修改群头像。修改成功后，其他群成员会收到 `onSpecificationChanged` 回调。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncChangeGroupAvatar(
                groupId,
                changedAvatar,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 获取群组头像

调用 `asyncGetGroupFromServer` 获取最新群组详情，然后通过 `EMGroup#getGroupAvatar` 读取群头像。

```java
EMClient.getInstance()
        .groupManager()
        .asyncGetGroupFromServer(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        String avatar = group.getGroupAvatar();
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## 更新群公告

仅群主和群管理员可以调用 `asyncUpdateGroupAnnouncement` 设置或更新群公告。更新成功后，群成员会收到 `EMGroupChangeListener#onAnnouncementChanged` 回调。

群公告的长度限制为 512 个字符。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncUpdateGroupAnnouncement(
                groupId,
                announcement,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## 获取群公告

所有群成员均可以调用 `asyncFetchGroupAnnouncement` 从服务器获取群公告。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupAnnouncement(
                groupId,
                new EMValueCallBack<String>() {
                    @Override
                    public void onSuccess(String announcement) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## 管理共享文件

群成员可以下载、获取和删除群共享文件。普通成员只能删除自己上传的文件，群主和群管理员可以删除群组中的任意共享文件。

### 上传共享文件

你可以调用 `asyncUploadGroupSharedFile` 上传群共享文件。文件上传后，群组所有成员都会收到 `onSharedFileAdded` 回调。

单个群共享文件大小限制为 10 MB。

```java
String groupId = "group_id";
// 指向存在且可读的本地文件。
String filePath = getExternalFilesDir(null) + "/docs/test.pdf";

EMClient.getInstance()
        .groupManager()
        .asyncUploadGroupSharedFile(
                groupId,
                filePath,
                new EMValueCallBack<EMMucSharedFile>() {
                    @Override
                    public void onProgress(int progress, String status) {
                        // 回调线程不一定是主线程
                        runOnUiThread(() -> {
                            uploadProgressBar.setProgress(progress);
                        });
                    }

                    @Override
                    public void onSuccess(EMMucSharedFile sharedFile) {
                        runOnUiThread(() -> {
                            String fileId = sharedFile.getFileId();
                            String fileName = sharedFile.getFileName();
    
                            Toast.makeText(
                                    MyActivity.this,
                                    "上传成功：" + fileName,
                                    Toast.LENGTH_SHORT
                            ).show();
                        });
                    }
    
                    @Override
                    public void onError(int error, String errorMsg) {
                        runOnUiThread(() -> {
                            Toast.makeText(
                                    MyActivity.this,
                                    "上传失败：" + errorMsg,
                                    Toast.LENGTH_SHORT
                            ).show();
                        });
                    }
                }
        );
```

上传成功后，可通过 `EMMucSharedFile` 获取：

```java
sharedFile.getFileId();         // 共享文件 ID
sharedFile.getFileName();       // 文件名
sharedFile.getFileOwner();      // 上传者
sharedFile.getFileSize();       // 文件大小，单位：字节
sharedFile.getFileUpdateTime(); // 更新时间，Unix 毫秒时间戳
```

### 下载共享文件

先调用 `asyncFetchGroupSharedFileList` 获取共享文件信息，再调用 `asyncDownloadGroupSharedFile` 下载指定文件。

```java
EMClient.getInstance()
        .groupManager()
         // pageNum：当前页码，从 1 开始。
         // pageSize：每页返回的共享文件数。
        .asyncFetchGroupSharedFileList(
                groupId,
                1,
                20,
                new EMValueCallBack<List<EMMucSharedFile>>() {
                    @Override
                    public void onSuccess(
                            List<EMMucSharedFile> sharedFiles) {
                        if (sharedFiles.isEmpty()) {
                            return;
                        }

                        String fileId = sharedFiles.get(0).getFileId();
                        EMClient.getInstance()
                                .groupManager()
                                .asyncDownloadGroupSharedFile(
                                        groupId,
                                        fileId,
                                        savePath,
                                        new EMCallBack() {
                                            @Override
                                            public void onSuccess() {
                                            }

                                            @Override
                                            public void onProgress(
                                                    int progress,
                                                    String status) {
                                            }

                                            @Override
                                            public void onError(
                                                    int errorCode,
                                                    String errorMessage) {
                                            }
                                        });
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 删除共享文件

所有群成员均可以调用 `asyncDeleteGroupSharedFile` 删除指定群共享文件。删除成功后，其他群成员会收到 `onSharedFileDeleted` 回调。

普通成员只能删除自己上传的文件，群主和群管理员可以删除任意共享文件。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncDeleteGroupSharedFile(
                groupId,
                fileId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


### 从服务器获取共享文件

所有群成员均可以调用 `asyncFetchGroupSharedFileList` 使用从服务器分页获取群共享文件列表。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        // pageNum：当前页码，从 1 开始。
        // pageSize：每页返回的共享文件数。
        .asyncFetchGroupSharedFileList(
                groupId,
                pageNum,
                pageSize,
                new EMValueCallBack<List<EMMucSharedFile>>() {
                    @Override
                    public void onSuccess(
                            List<EMMucSharedFile> sharedFiles) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## 更新群扩展字段

仅群主和群管理员可以更新群组扩展字段。群扩展字段可用于存储 JSON 格式的自定义群组信息，长度不能超过 8 KB。

建议调用 `asyncUpdateGroupExtension` 单独更新群扩展字段。更新成功后，回调返回更新后的 `EMGroup` 对象，其他群成员会收到 `onSpecificationChanged` 回调。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncUpdateGroupExtension(
                groupId,
                extension,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        String updatedExtension = group.getExtension();
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## 监听群组事件

群名称、描述、头像、公告、共享文件和扩展字段发生变化时，SDK 会触发对应的 `EMGroupChangeListener` 回调。监听器的注册、移除及完整事件说明详见[监听群组事件](group_manage.html#监听群组事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getGroup`](#获取群组详情) | `EMGroupManager` | 从本地内存获取群组详情。 |
| [`asyncGetGroupFromServer`](#获取群组详情) | `EMGroupManager` | 从服务器获取最新群组详情。 |
| [`getGroupId`](#获取群组详情) / [`getGroupName`](#获取群组详情) / [`getDescription`](#获取群组详情) | `EMGroup` | 获取群组 ID、名称和描述。 |
| [`getOwner`](#获取群组详情) / [`getAdminList`](#获取群组详情) | `EMGroup` | 获取群主和群管理员列表。 |
| [`isMsgBlocked`](#获取群组详情) / [`isDisabled`](#获取群组详情) | `EMGroup` | 获取群消息屏蔽状态和群禁用状态。 |
| [`asyncUpdateGroupConfigs`](#修改群组配置) | `EMGroupManager` | 按指定属性位修改群组配置。 |
| [`asyncChangeGroupName`](#修改群组名称) | `EMGroupManager` | 修改群名称。 |
| [`asyncChangeGroupDescription`](#修改群组描述) | `EMGroupManager` | 修改群描述。 |
| [`asyncCreateGroup`](#设置群组头像) | `EMGroupManager` | 创建群组并设置群头像。 |
| [`asyncChangeGroupAvatar`](#修改群组头像) | `EMGroupManager` | 修改群头像。 |
| [`getGroupAvatar`](#获取群组头像) | `EMGroup` | 获取群头像。 |
| [`asyncUpdateGroupAnnouncement`](#更新群公告) | `EMGroupManager` | 更新群公告。 |
| [`asyncFetchGroupAnnouncement`](#获取群公告) | `EMGroupManager` | 获取群公告。 |
| [`asyncUploadGroupSharedFile`](#上传共享文件) | `EMGroupManager` | 上传群共享文件。 |
| [`asyncDownloadGroupSharedFile`](#下载共享文件) | `EMGroupManager` | 下载群共享文件。 |
| [`asyncDeleteGroupSharedFile`](#删除共享文件) | `EMGroupManager` | 删除群共享文件。 |
| [`asyncFetchGroupSharedFileList`](#从服务器获取共享文件) | `EMGroupManager` | 分页获取群共享文件列表。 |
| [`getFileId`](#下载共享文件) | `EMMucSharedFile` | 获取群共享文件 ID。 |
| [`asyncUpdateGroupExtension`](#更新群扩展字段) | `EMGroupManager` | 更新群扩展字段。 |
| [`getExtension`](#更新群扩展字段) | `EMGroup` | 获取群扩展字段。 |

