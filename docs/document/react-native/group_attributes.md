# 管理群组属性

## 功能说明

群组是支持多人沟通的即时通讯场景。本文介绍如何使用环信即时通讯 IM React Native SDK 获取和管理群组详情、名称、描述、头像、公告、共享文件及扩展字段。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已登录并连接到 IM 服务器。
- 已了解接口调用频率、群组及群成员数量限制，详见 [使用限制](/product/limitation.html)。

## 获取群组详情

调用 `ChatGroupManager#getGroupWithId` 可以根据群组 ID 从本地内存获取群组详情，该接口不会发起网络请求，返回 `Promise<ChatGroup | undefined>`。iOS 端在本地没有对应缓存时，也可能返回仅包含群组 ID 等默认信息的群组对象，不能仅根据是否返回对象判断当前用户是否已加入该群组。

调用 `ChatGroupManager#fetchGroupInfoWithoutMembersFromServer` 可以从服务器获取最新群组详情，并更新本地缓存；返回的群组对象也可能为 `undefined`。该接口不会主动拉取群成员列表。返回对象中的 `memberList` 可能包含本地已有数据，不应将其作为完整、最新的群成员列表。如果需要群成员列表，需调用 `ChatGroupManager#fetchMemberInfoListFromServer` 或 `ChatGroupManager#fetchMemberListFromServer`，详见 [获取群成员列表](group_members.html#获取群成员列表)。

若要在登录后从本地读取最新的已加入群组数据，需在 SDK 初始化时启用已加入群组数据同步，并等待同步完成，详见 [获取当前用户加入的群组列表](group_manage.html#获取当前用户加入的群组列表)。

:::tip
对于公开群，用户即使不加入群也能获取群组详情，而对于私有群，用户只有加入了群组才能获取群详情。
:::

```typescript
try {
  // 从本地内存获取群组详情，不会向服务器发起请求
  const localGroup = await ChatClient.getInstance().groupManager.getGroupWithId(groupId);

  // 从服务器获取最新群组详情，并更新本地缓存
  const group = await ChatClient.getInstance().groupManager
    .fetchGroupInfoWithoutMembersFromServer(groupId);
  if (group) {
    // 获取群组 ID
    const id = group.groupId;
    // 获取群组名称
    const name = group.groupName;
    // 获取群组描述
    const description = group.description;
    // 获取群头像 URL
    const avatar = group.groupAvatar;
    // 获取群主的用户 ID
    const owner = group.owner;
    // 获取群管理员的用户 ID 列表
    const admins = group.adminList;
    // 判断当前用户是否已屏蔽该群组的消息
    const messageBlocked = group.messageBlocked;
    // 判断群组是否已被禁用
    const disabled = group.isDisabled;
  }
} catch (error: unknown) {
  // 获取失败，根据错误码和错误信息处理
  console.error('获取群组详情失败：', error);
}
```
## 修改群组配置

群主或群管理员可调用 `ChatGroupManager#updateGroupConfigs` 按指定属性位修改群组配置，未指定的字段不会被覆盖。

通过 `ChatGroupConfigsType` 位掩码指定要更新的字段，如下表所示：

| 配置类型                 | `ChatGroupConfigs` 字段  | 说明                                 |
| ------------------------ | ---------------------- | ------------------------------------ |
| `ChatGroupConfigsType.IsPublic`              | `isPublic`             | 是否为公开群。                       |
| `ChatGroupConfigsType.JoinApprovalRequired` | `joinApprovalRequired` | 公开群加入是否需要群主或管理员审批。 |
| `ChatGroupConfigsType.AllowInvites`          | `allowInvites`         | 私有群普通成员是否可以邀请其他用户。 |
| `ChatGroupConfigsType.MaxUsers`              | `maxCount`             | 群组最大成员数。默认值为 `200`。                    |
| `ChatGroupConfigsType.InviteNeedConfirm`    | `inviteNeedConfirm`    | 被邀请用户加入群组前是否需要确认。   |
| `ChatGroupConfigsType.Ext`                    | `ext`             | 群组扩展字段。                       |

构造 `ChatGroupConfigs` 时，`maxCount` 默认为 `200`，布尔字段默认为 `false`，`ext` 省略时为 `undefined`；仅位掩码指定的字段会参与更新，多个类型可使用按位或（`|`）组合。

例如，仅修改群最大成员数，示例代码如下：

```typescript
const configs = new ChatGroupConfigs({ maxCount: 300 });

try {
  // 未包含在 types 位掩码中的配置项不会被更新
  const group = await ChatClient.getInstance().groupManager.updateGroupConfigs(
    groupId,
    ChatGroupConfigsType.MaxUsers,
    configs
  );
} catch (error: unknown) {
  console.error('修改群组配置失败：', error);
}
```

群成员会通过 `ChatGroupEventListener#onDetailChanged` 收到群组详情更新回调。回调中的 `ChatGroup` 表示更新后的群组信息。为确保获取完整且最新的配置，建议在回调中调用 `ChatGroupManager#fetchGroupInfoWithoutMembersFromServer` 从服务器获取群组详情。

// TODO：研发确认

:::notice
React Native SDK 5.0.0 的 Android 端返回的群对象未包含 `configs.inviteNeedConfirm`，该字段会被填充为 `false`，不能将其作为服务端实际配置。详情变更回调中的对象也不能据此判断该配置。
:::

## 修改群组名称

仅群主和群管理员可以调用 `ChatGroupManager#changeGroupName` 修改群组名称。修改成功后，其他群成员会收到 `ChatGroupEventListener#onDetailChanged` 回调。群名称的长度限制为 255 个字符。

```typescript
try {
  // 修改群组名称
  await ChatClient.getInstance().groupManager
    .changeGroupName(groupId, changedGroupName);
} catch (error: unknown) {
  console.error('修改群组名称失败：', error);
}
```


## 修改群组描述

仅群主和群管理员可以调用 `ChatGroupManager#changeGroupDescription` 修改群组描述。修改成功后，其他群成员会收到 `ChatGroupEventListener#onDetailChanged` 回调。群描述的长度限制为 2048 个字符。

```typescript
try {
  // 修改群组描述
  await ChatClient.getInstance().groupManager
    .changeGroupDescription(groupId, description);
} catch (error: unknown) {
  console.error('修改群组描述失败：', error);
}
```


## 管理群组头像

React Native SDK 支持在创建群组时设置群头像，也支持在群组创建后修改或获取群头像。

### 设置群组头像

创建群组时，将头像 URL 作为 `ChatGroupManager#createGroupEx` 的 `groupAvatar` 参数传入。React Native SDK 使用 `ChatGroupConfigs` 配置群组属性。

```typescript
const configs = new ChatGroupConfigs({
  maxCount: 200,
  isPublic: false,
  allowInvites: true,
  inviteNeedConfirm: true,
});

try {
  // 创建群组时设置群头像 URL
  const group = await ChatClient.getInstance().groupManager.createGroupEx({
    groupName,
    groupAvatar: avatar,
    desc: description,
    inviteMembers: [],
    configs,
  });
} catch (error: unknown) {
  console.error('创建群组失败：', error);
}
```

创建群组后，可以通过 [修改群组头像](#修改群组头像) 接口设置或更新头像。

### 修改群组头像

创建群组完成后，群主或群管理员可以调用 `ChatGroupManager#updateGroupAvatar` 设置或修改群头像。修改成功后，其他群成员会收到 `ChatGroupEventListener#onDetailChanged` 回调。

```typescript
try {
  // 设置或修改群头像
  await ChatClient.getInstance().groupManager
    .updateGroupAvatar(groupId, changedAvatar);
} catch (error: unknown) {
  console.error('修改群头像失败：', error);
}
```

### 获取群组头像

调用 `ChatGroupManager#fetchGroupInfoWithoutMembersFromServer` 获取最新群组详情，然后通过 `ChatGroup#groupAvatar` 读取群头像。

```typescript
try {
  // 获取最新群组详情
  const group = await ChatClient.getInstance().groupManager
    .fetchGroupInfoWithoutMembersFromServer(groupId);
  if (group) {
    const avatar = group.groupAvatar;
  }
} catch (error: unknown) {
  console.error('获取群头像失败：', error);
}
```

## 更新群公告

仅群主和群管理员可以调用 `ChatGroupManager#updateGroupAnnouncement` 设置或更新群公告。更新成功后，群成员会收到 `ChatGroupEventListener#onAnnouncementChanged` 回调。

群公告的长度限制为 512 个字符。

```typescript
try {
  // 设置或更新群公告
  await ChatClient.getInstance().groupManager
    .updateGroupAnnouncement(groupId, announcement);
} catch (error: unknown) {
  console.error('更新群公告失败：', error);
}
```


## 获取群公告

所有群成员均可以调用 `ChatGroupManager#fetchAnnouncementFromServer` 从服务器获取群公告。

```typescript
try {
  // 从服务器获取群公告
  const announcement = await ChatClient.getInstance().groupManager
    .fetchAnnouncementFromServer(groupId);
} catch (error: unknown) {
  console.error('获取群公告失败：', error);
}
```


## 管理共享文件

群成员可以上传、下载、获取和删除群共享文件。普通成员只能删除自己上传的文件，群主和群管理员可以删除群组中的任意共享文件。

### 上传共享文件

你可以调用 `ChatGroupManager#uploadGroupSharedFile` 上传群共享文件。文件上传后，群组所有成员都会收到 `onSharedFileAdded` 回调。

单个群共享文件大小限制为 10 MB。

```typescript
const groupId = '<group_id>';
// 指向存在且原生层可读的本地文件
const filePath = '<native_accessible_file_path>';

const callback: ChatGroupFileStatusCallback = {
  onProgress(groupId, filePath, progress): void {
    // 更新上传进度
    console.log('上传进度：', progress);
  },
  onSuccess(groupId, filePath): void {
    // 上传成功
    console.log('上传成功：', filePath);
  },
  onError(groupId, filePath, error): void {
    // 上传失败
    console.error('上传失败：', error);
  },
};

try {
  // 上传群共享文件
  await ChatClient.getInstance().groupManager
    .uploadGroupSharedFile(groupId, filePath, callback);
} catch (error: unknown) {
  console.error('发起上传失败：', error);
}
```

上传进度和最终结果通过 `ChatGroupFileStatusCallback` 返回；方法返回的 `Promise<void>` 仅用于报告调用错误。`onSuccess` 不返回共享文件对象，可通过 [共享文件列表接口](#从服务器获取共享文件) 获取 `ChatGroupSharedFile`，读取：

```typescript
// sharedFile 为共享文件列表中获取的 ChatGroupSharedFile 对象
const fileId = sharedFile.fileId;         // 共享文件 ID
const fileName = sharedFile.name;         // 文件名
const fileOwner = sharedFile.owner;       // 上传者
const fileSize = sharedFile.fileSize;     // 文件大小，单位：字节
const createTime = sharedFile.createTime; // 上传时间，Unix 毫秒时间戳
```

:::tip
同一群组中，请避免同时对相同的本地路径发起多次上传，或对相同的保存路径发起多次下载，以免对应回调混淆。
:::

### 下载共享文件

先调用 `ChatGroupManager#fetchGroupFileListFromServer` 获取共享文件信息，再调用 `ChatGroupManager#downloadGroupSharedFile` 下载指定文件。下载进度和最终结果通过 `ChatGroupFileStatusCallback` 返回；方法返回的 `Promise<void>` 仅用于报告调用错误。

```typescript
try {
  // pageSize：每页返回的共享文件数
  // pageNum：当前页码，从 1 开始
  const sharedFiles = await ChatClient.getInstance().groupManager
    .fetchGroupFileListFromServer(groupId, 20, 1);
  const sharedFile = sharedFiles[0];
  if (sharedFile) {
    const callback: ChatGroupFileStatusCallback = {
      onSuccess(groupId, filePath): void {
        // 下载成功，filePath 为保存路径
      },
      onProgress(groupId, filePath, progress): void {
        // 更新下载进度
      },
      onError(groupId, filePath, error): void {
        // 下载失败
        console.error('下载失败：', error);
      },
    };
    // savePath 为应用指定的、原生层可写的本地保存路径
    // 下载指定群共享文件
    await ChatClient.getInstance().groupManager
      .downloadGroupSharedFile(groupId, sharedFile.fileId, savePath, callback);
  }
} catch (error: unknown) {
  console.error('查询共享文件或发起下载失败：', error);
}
```

### 删除共享文件

所有群成员均可以调用 `ChatGroupManager#removeGroupSharedFile` 删除指定群共享文件。删除成功后，其他群成员会收到 `onSharedFileDeleted` 回调。

普通成员只能删除自己上传的文件，群主和群管理员可以删除任意共享文件。

```typescript
try {
  // 删除指定群共享文件
  await ChatClient.getInstance().groupManager
    .removeGroupSharedFile(groupId, fileId);
} catch (error: unknown) {
  console.error('删除共享文件失败：', error);
}
```


### 从服务器获取共享文件

所有群成员均可以调用 `ChatGroupManager#fetchGroupFileListFromServer` 从服务器分页获取群共享文件列表。

```typescript
// pageSize：每页返回的共享文件数，默认 200
const pageSize = 20;
// pageNum：当前页码，从 1 开始，默认 1
const pageNum = 1;

try {
  // 从服务器分页获取群共享文件列表
  const sharedFiles = await ChatClient.getInstance().groupManager
    .fetchGroupFileListFromServer(groupId, pageSize, pageNum);
} catch (error: unknown) {
  console.error('获取共享文件列表失败：', error);
}
```


## 更新群扩展字段

仅群主和群管理员可以更新群组扩展字段。群扩展字段可用于存储 JSON 格式的自定义群组信息，长度不能超过 8 KB。

建议调用 `ChatGroupManager#updateGroupExtension` 单独更新群扩展字段。该方法返回 `Promise<void>`，更新成功后，其他群成员会收到 `ChatGroupEventListener#onDetailChanged` 回调。

```typescript
try {
  // 单独更新群扩展字段
  await ChatClient.getInstance().groupManager.updateGroupExtension(groupId, extension);
  // 获取更新后的群组信息，读取群扩展字段
  const group = await ChatClient.getInstance().groupManager
    .fetchGroupInfoWithoutMembersFromServer(groupId);
  const updatedExtension = group?.configs?.ext;
} catch (error: unknown) {
  console.error('更新或读取群扩展字段失败：', error);
}
```

:::tip
`ChatGroupManager#updateGroupExtension` 不返回群组对象。如需读取更新后的扩展字段，可获取最新群组详情，再读取 `ChatGroup.configs?.ext`。
:::

## 监听群组事件

群名称、描述、头像、公告、共享文件和扩展字段发生变化时，SDK 会触发对应的 `ChatGroupEventListener` 回调。监听器的注册、移除及完整事件说明详见[监听群组事件](group_manage.html#监听群组事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`ChatGroupManager#getGroupWithId`](#获取群组详情) | `ChatGroupManager` | 从本地内存获取群组详情。 |
| [`ChatGroupManager#fetchGroupInfoWithoutMembersFromServer`](#获取群组详情) | `ChatGroupManager` | 从服务器获取最新群组详情。 |
| [`groupId`](#获取群组详情) / [`groupName`](#获取群组详情) / [`description`](#获取群组详情) | `ChatGroup` | 群组 ID、名称和描述。 |
| [`owner`](#获取群组详情) / [`adminList`](#获取群组详情) | `ChatGroup` | 群主用户 ID 和群管理员用户 ID 列表。 |
| [`messageBlocked`](#获取群组详情) / [`isDisabled`](#获取群组详情) | `ChatGroup` | 群消息屏蔽状态和群禁用状态。 |
| [`ChatGroupManager#updateGroupConfigs`](#修改群组配置) | `ChatGroupManager` | 按指定属性位修改群组配置。 |
| [`ChatGroupManager#changeGroupName`](#修改群组名称) | `ChatGroupManager` | 修改群名称。 |
| [`ChatGroupManager#changeGroupDescription`](#修改群组描述) | `ChatGroupManager` | 修改群描述。 |
| [`ChatGroupManager#createGroupEx`](#设置群组头像) | `ChatGroupManager` | 创建群组并设置群头像。 |
| [`ChatGroupManager#updateGroupAvatar`](#修改群组头像) | `ChatGroupManager` | 修改群头像。 |
| [`groupAvatar`](#获取群组头像) | `ChatGroup` | 群头像 URL。 |
| [`ChatGroupManager#updateGroupAnnouncement`](#更新群公告) | `ChatGroupManager` | 更新群公告。 |
| [`ChatGroupManager#fetchAnnouncementFromServer`](#获取群公告) | `ChatGroupManager` | 获取群公告。 |
| [`ChatGroupManager#uploadGroupSharedFile`](#上传共享文件) | `ChatGroupManager` | 上传群共享文件。 |
| [`ChatGroupManager#downloadGroupSharedFile`](#下载共享文件) | `ChatGroupManager` | 下载群共享文件。 |
| [`ChatGroupManager#removeGroupSharedFile`](#删除共享文件) | `ChatGroupManager` | 删除群共享文件。 |
| [`ChatGroupManager#fetchGroupFileListFromServer`](#从服务器获取共享文件) | `ChatGroupManager` | 分页获取群共享文件列表。 |
| [`fileId`](#下载共享文件) | `ChatGroupSharedFile` | 群共享文件 ID。 |
| [`ChatGroupManager#updateGroupExtension`](#更新群扩展字段) | `ChatGroupManager` | 更新群扩展字段。 |
| [`configs.ext`](#更新群扩展字段) | `ChatGroup` | 群扩展字段。 |
