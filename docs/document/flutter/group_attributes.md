# 管理群组属性

## 功能说明

群组是支持多人沟通的即时通讯场景。本文介绍如何使用环信即时通讯 IM Flutter SDK 获取和管理群组详情、名称、描述、头像、公告、共享文件及扩展字段。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已登录并连接到 IM 服务器。
- 已了解接口调用频率、群组及群成员数量限制，详见 [使用限制](/product/limitation.html)。

## 获取群组详情

调用 `ChatGroupManager#getGroupWithId` 可以根据群组 ID 从本地内存获取群组详情，该接口不会发起网络请求。调用 `fetchGroupInfoFromServer` 可以从服务器获取最新群组详情，并更新本地缓存。

若要在登录后从本地读取最新的已加入群组数据，需在 SDK 初始化时启用已加入群组数据同步，并等待同步完成，详见 [获取当前用户加入的群组列表](group_manage.html#获取当前用户加入的群组列表)。

`fetchGroupInfoFromServer` 不返回群成员列表。如果需要群成员列表，需调用 `fetchGroupMembersInfo` 或 `fetchMemberListFromServer`，详见 [获取群成员列表](group_members.html#获取群成员列表)。

:::tip
对于公开群，用户即使不加入群也能获取群组详情，而对于私有群，用户只有加入了群组才能获取群详情。
:::

```dart
// 从本地内存获取群组详情，不会向服务器发起请求。
final ChatGroup? localGroup =
    await ChatClient.getInstance.groupManager.getGroupWithId(groupId);

try {
  // 从服务器获取最新群组详情，并更新本地缓存。
  final ChatGroup group = await ChatClient.getInstance.groupManager
      .fetchGroupInfoFromServer(groupId);

  final String id = group.groupId;
  final String? name = group.groupName;
  final String? description = group.desc;
  final String? avatar = group.avatarUrl;
  final String? owner = group.owner;
  final List<String>? admins = group.adminList;
  final bool? messageBlocked = group.messageBlocked;
  final bool disabled = group.isDisabled;
} on ChatError catch (e) {
  // 获取失败，根据错误码和错误信息处理。
}
```

## 修改群组配置

群主或群管理员可调用 `ChatGroupManager#updateGroupConfigs` 按指定属性位修改群组配置，未指定的字段不会被覆盖。

通过 `ChatGroupConfigsType` 指定要更新的字段，如下表所示：

| 配置类型 | `ChatGroupConfigs` 字段 | 说明 |
| :--- | :--- | :--- |
| `isPublic` | `isPublic` | 是否为公开群。 |
| `joinApprovalRequired` | `joinApprovalRequired` | 公开群加入是否需要群主或管理员审批。 |
| `allowInvites` | `allowInvites` | 私有群普通成员是否可以邀请其他用户。 |
| `maxUsers` | `maxCount` | 群组最大成员数，默认值为 `200`。 |
| `inviteNeedConfirm` | `inviteNeedConfirm` | 被邀请用户加入群组前是否需要确认。 |
| `ext` | `ext` | 群组扩展字段。 |

例如，仅修改群最大成员数，示例代码如下：

```dart
try {
  // 未包含在 types 位掩码中的配置项不会被更新。
  final ChatGroup group =
      await ChatClient.getInstance.groupManager.updateGroupConfigs(
    groupId: groupId,
    types: ChatGroupConfigsType.maxUsers,
    configs: const ChatGroupConfigs(maxCount: 300),
  );
} on ChatError catch (e) {
  // 修改失败，根据错误码和错误信息处理。
}
```

群成员会通过 `ChatGroupEventHandler#onSpecificationDidUpdate` 收到群组详情更新回调。回调中的 `ChatGroup` 表示更新后的群组信息。为确保获取完整且最新的配置，建议在回调中调用 `fetchGroupInfoFromServer` 从服务器获取群组详情。

// TODO：需要添加吗？
:::warning
从 `ChatGroup` 读取配置时存在平台差异：iOS 上 `configs` 可能为 `null`，`maxUserCount` 和 `extension` 不下发，应改读 `configs?.maxCount` 和 `configs?.ext`；Android 上 `configs.inviteNeedConfirm` 固定返回 `false`，该字段只应作为创建或更新群组时的入参使用。
:::

## 修改群组名称

仅群主和群管理员可以调用 `ChatGroupManager#updateGroupName` 修改群组名称。修改成功后，其他群成员会收到 `ChatGroupEventHandler#onSpecificationDidUpdate` 回调。群名称的长度限制为 255 个字符。

```dart
try {
  await ChatClient.getInstance.groupManager.updateGroupName(
    groupId,
    changedGroupName,
  );
} on ChatError catch (e) {
  // 修改失败。
}
```

## 修改群组描述

仅群主和群管理员可以调用 `ChatGroupManager#updateGroupDesc` 修改群组描述。修改成功后，其他群成员会收到 `ChatGroupEventHandler#onSpecificationDidUpdate` 回调。群描述的长度限制为 2048 个字符。

```dart
try {
  await ChatClient.getInstance.groupManager.updateGroupDesc(
    groupId,
    description,
  );
} on ChatError catch (e) {
  // 修改失败。
}
```

## 管理群组头像

Flutter SDK 支持在创建群组时设置群头像，也支持在群组创建后修改或获取群头像。

### 设置群组头像

创建群组时，将头像 URL 作为 `createGroup` 的 `avatarUrl` 参数传入。Flutter SDK 5.0.0 使用 `ChatGroupConfigs` 配置群组属性。

```dart
try {
  final ChatGroup group =
      await ChatClient.getInstance.groupManager.createGroup(
    groupName: 'group name',
    avatarUrl: 'https://example.com/group-avatar.png',
    desc: 'group description',
    inviteMembers: const <String>[],
    configs: const ChatGroupConfigs(
      maxCount: 200,
      isPublic: false,
      allowInvites: true,
      inviteNeedConfirm: true,
    ),
  );
} on ChatError catch (e) {
  // 创建失败。
}
```

创建群组后，可以通过 [修改群组头像](#修改群组头像) 接口设置或更新头像。

### 修改群组头像

创建群组完成后，群主或群管理员可以调用 `ChatGroupManager#updateGroupAvatar` 设置或修改群头像。修改成功后，其他群成员会收到 `onSpecificationDidUpdate` 回调。

```dart
try {
  final ChatGroup group =
      await ChatClient.getInstance.groupManager.updateGroupAvatar(
    groupId: groupId,
    avatarUrl: changedAvatar,
  );
} on ChatError catch (e) {
  // 修改失败。
}
```

### 获取群组头像

调用 `fetchGroupInfoFromServer` 获取最新群组详情，然后通过 `ChatGroup.avatarUrl` 读取群头像。

```dart
try {
  final ChatGroup group = await ChatClient.getInstance.groupManager
      .fetchGroupInfoFromServer(groupId);
  final String? avatar = group.avatarUrl;
} on ChatError catch (e) {
  // 获取失败。
}
```

## 更新群公告

仅群主和群管理员可以调用 `ChatGroupManager#updateGroupAnnouncement` 设置或更新群公告。更新成功后，群成员会收到 `ChatGroupEventHandler#onAnnouncementChangedFromGroup` 回调。

群公告的长度限制为 512 个字符。

```dart
try {
  await ChatClient.getInstance.groupManager.updateGroupAnnouncement(
    groupId,
    announcement,
  );
} on ChatError catch (e) {
  // 更新失败。
}
```

## 获取群公告

所有群成员均可以调用 `ChatGroupManager#fetchAnnouncementFromServer` 从服务器获取群公告。

```dart
try {
  final String? announcement = await ChatClient.getInstance.groupManager
      .fetchAnnouncementFromServer(groupId);
} on ChatError catch (e) {
  // 获取失败。
}
```

## 管理共享文件

群成员可以上传、下载、获取和删除群共享文件。普通成员只能删除自己上传的文件，群主和群管理员可以删除群组中的任意共享文件。

### 上传共享文件

你可以调用 `ChatGroupManager#uploadGroupSharedFile` 上传群共享文件。文件上传后，群组所有成员都会收到 `onSharedFileAddedFromGroup` 回调。

单个群共享文件大小限制为 10 MB。

```dart
try {
  await ChatClient.getInstance.groupManager.uploadGroupSharedFile(
    groupId,
    filePath,
  );
  // 上传成功后可重新获取共享文件列表。
} on ChatError catch (e) {
  // 上传失败。
}
```

上传完成后，可调用 `fetchGroupFileListFromServer` 获取 `ChatGroupSharedFile`，并读取以下属性：

| 属性 | 说明 |
| :--- | :--- |
| `fileId` | 共享文件 ID。 |
| `fileName` | 文件名。 |
| `fileOwner` | 上传者用户 ID。 |
| `fileSize` | 文件大小，单位为字节。 |
| `createTime` | 上传时间，Unix 毫秒时间戳。 |

### 下载共享文件

先调用 `fetchGroupFileListFromServer` 获取共享文件信息，再调用 `downloadGroupSharedFile` 下载指定文件。

```dart
try {
  final List<ChatGroupSharedFile> sharedFiles =
      await ChatClient.getInstance.groupManager.fetchGroupFileListFromServer(
    groupId,
    pageNum: 1,
    pageSize: 20,
  );

  if (sharedFiles.isNotEmpty && sharedFiles.first.fileId != null) {
    await ChatClient.getInstance.groupManager.downloadGroupSharedFile(
      groupId: groupId,
      fileId: sharedFiles.first.fileId!,
      savePath: savePath,
    );
  }
} on ChatError catch (e) {
  // 获取或下载失败。
}
```

### 删除共享文件

所有群成员均可以调用 `ChatGroupManager#removeGroupSharedFile` 删除指定群共享文件。删除成功后，其他群成员会收到 `onSharedFileDeletedFromGroup` 回调。

普通成员只能删除自己上传的文件，群主和群管理员可以删除任意共享文件。

```dart
try {
  await ChatClient.getInstance.groupManager.removeGroupSharedFile(
    groupId,
    fileId,
  );
} on ChatError catch (e) {
  // 删除失败。
}
```

### 从服务器获取共享文件

所有群成员均可以调用 `fetchGroupFileListFromServer` 从服务器分页获取群共享文件列表。

```dart
try {
  final List<ChatGroupSharedFile> sharedFiles =
      await ChatClient.getInstance.groupManager.fetchGroupFileListFromServer(
    groupId,
    pageNum: pageNum,
    pageSize: pageSize,
  );
} on ChatError catch (e) {
  // 获取失败。
}
```

## 更新群扩展字段

仅群主和群管理员可以更新群组扩展字段。群扩展字段可用于存储 JSON 格式的自定义群组信息，长度不能超过 8 KB。

建议调用 `ChatGroupManager#updateGroupExtension` 单独更新群扩展字段。更新成功后，其他群成员会收到 `onSpecificationDidUpdate` 回调。该接口返回 `Future<void>`；如需读取更新后的值，应重新调用 `fetchGroupInfoFromServer`。

```dart
try {
  await ChatClient.getInstance.groupManager.updateGroupExtension(
    groupId,
    extension,
  );
  final ChatGroup group = await ChatClient.getInstance.groupManager
      .fetchGroupInfoFromServer(groupId);
  final String? updatedExtension =
      group.extension ?? group.configs?.ext;
} on ChatError catch (e) {
  // 更新失败。
}
```

## 监听群组事件

群名称、描述、头像、公告、共享文件和扩展字段发生变化时，SDK 会触发对应的 `ChatGroupEventHandler` 回调。监听器的注册、移除及完整事件说明详见[监听群组事件](group_manage.html#监听群组事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getGroupWithId`](#获取群组详情) | `ChatGroupManager` | 从本地内存获取群组详情。 |
| [`fetchGroupInfoFromServer`](#获取群组详情) | `ChatGroupManager` | 从服务器获取最新群组详情。 |
| [`groupId`](#获取群组详情) / [`groupName`](#获取群组详情) / [`desc`](#获取群组详情) | `ChatGroup` | 获取群组 ID、名称和描述。 |
| [`owner`](#获取群组详情) / [`adminList`](#获取群组详情) | `ChatGroup` | 获取群主和群管理员列表。 |
| [`messageBlocked`](#获取群组详情) / [`isDisabled`](#获取群组详情) | `ChatGroup` | 获取群消息屏蔽状态和群禁用状态。 |
| [`updateGroupConfigs`](#修改群组配置) | `ChatGroupManager` | 按指定属性位修改群组配置。 |
| [`updateGroupName`](#修改群组名称) | `ChatGroupManager` | 修改群名称。 |
| [`updateGroupDesc`](#修改群组描述) | `ChatGroupManager` | 修改群描述。 |
| [`createGroup`](#设置群组头像) | `ChatGroupManager` | 创建群组并设置群头像。 |
| [`updateGroupAvatar`](#修改群组头像) | `ChatGroupManager` | 修改群头像。 |
| [`avatarUrl`](#获取群组头像) | `ChatGroup` | 获取群头像。 |
| [`updateGroupAnnouncement`](#更新群公告) | `ChatGroupManager` | 更新群公告。 |
| [`fetchAnnouncementFromServer`](#获取群公告) | `ChatGroupManager` | 获取群公告。 |
| [`uploadGroupSharedFile`](#上传共享文件) | `ChatGroupManager` | 上传群共享文件。 |
| [`downloadGroupSharedFile`](#下载共享文件) | `ChatGroupManager` | 下载群共享文件。 |
| [`removeGroupSharedFile`](#删除共享文件) | `ChatGroupManager` | 删除群共享文件。 |
| [`fetchGroupFileListFromServer`](#从服务器获取共享文件) | `ChatGroupManager` | 分页获取群共享文件列表。 |
| [`fileId`](#下载共享文件) | `ChatGroupSharedFile` | 获取群共享文件 ID。 |
| [`updateGroupExtension`](#更新群扩展字段) | `ChatGroupManager` | 更新群扩展字段。 |
| [`extension`](#更新群扩展字段) / [`configs`](#更新群扩展字段) | `ChatGroup` | 获取群扩展字段或群组配置。 |
