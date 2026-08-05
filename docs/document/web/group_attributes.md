# 群组属性管理

## 功能说明

群组属性用于描述和配置群组，包括群名称、群描述、群头像、群扩展信息、入群审批、邀请策略、群成员人数上限、群公告和群共享文件等。本文介绍如何使用 SDK 管理这些群组属性。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录成功。
- 初始化 SDK 时已注册 `GroupManager`，能够通过 `client.groupManager` 调用群组相关接口。
- 已了解群组数量、群成员数量、群公告长度、群共享文件大小和接口调用频率等服务限制。详见 [使用限制](/product/limitation.html)。

## 获取群组操作对象

在管理单个群组属性前，推荐先调用 `getGroup` 获取 `Group` 单群对象。该方法只创建或复用本地单群操作对象，不会发起网络请求。

```typescript
const group = client.groupManager.getGroup('groupId');
```

后续示例优先使用 `Group` 单群对象写法；如需直接按 `groupId` 调用，也可以使用对应的 `GroupManager` 接口。

## 获取群组详情

你可以通过 `Group` 对象获取群组详情：

- `getDetail`：获取当前群组详情。SDK 会优先复用当前会话中可用的群组快照，必要时再从服务端拉取。
- `refresh`：强制从服务端刷新当前群组详情。

:::tip
对于公开群，用户即使未加入群组，也可以获取群组详情；对于私有群，通常需要加入群组后才能获取群组详情。
:::

示例代码如下：

```typescript
const group = client.groupManager.getGroup('groupId');

const detail = await group.getDetail();
console.log(detail);
// 如果业务需要强制从服务端刷新当前群组详情，可调用 `refresh`：
const latestDetail = await group.refresh();
console.log(latestDetail);
```

如需直接按群组 ID 获取详情，也可以调用 `client.groupManager.getGroupInfo` 或 `client.groupManager.getGroupInfoList`：

```typescript
// 获取单个群组的详情
const groupInfo = await client.groupManager.getGroupInfo({ groupId: 'groupId' });
// 获取多个群组的详情
const groupInfoList = await client.groupManager.getGroupInfoList({
  groupIds: ['groupId1', 'groupId2'],
});
```

群组详情结果为 `GroupDetail`，主要字段如下：

| 分组 | 字段 | 类型 | 描述 |
| :--- | :--- | :--- | :--- |
| 基础资料 | `groupId` | String | 群组 ID。 |
| 基础资料 | `name` | String | 群组名称。 |
| 基础资料 | `description` | String | 群组描述。 |
| 基础资料 | `owner` | UserInfo | 群主的用户资料。 |
| 基础资料 | `avatarUrl` | String | 群头像 URL。 |
| 基础资料 | `ext` | String | 群扩展信息。 |
| 基础资料 | `createdAt` | Number | 群创建时间戳。 |
| 配置 | `public` | Boolean | 是否为公开群。 |
| 配置 | `joinApprovalRequired` | Boolean | 用户加入群组时是否需要管理员审批。 |
| 配置 | `allowInvites` | Boolean | 是否允许普通成员邀请其他用户加入群组。 |
| 配置 | `inviteNeedConfirm` | Boolean | 被邀请用户入群前是否需要确认邀请。 |
| 配置 | `maxMembers` | Number | 群组允许的最大成员数。 |
| 配置 | `muteAllMembers` | Boolean | 是否开启全员禁言。 |
| 配置 | `disabled` | Boolean | 群组是否被禁用。 |
| 基础统计 | `memberCount` | Number | 当前群成员数。 |
| 当前用户相关信息 | `role` | String | 当前用户在群组中的角色，可能为 `owner`、`admin` 或 `member`。 |
| 当前用户相关信息 | `joinedAt` | Number | 当前用户加入该群组的时间戳。 |
| 当前用户相关信息 | `messageBlocked` | Boolean | 当前用户是否已屏蔽该群组消息。 |

## 修改群组信息

你可以通过 `Group` 对象修改群组资料或群组配置。

- `updateInfo`：修改群组名称、描述、头像和扩展信息等基础资料。群名称的长度限制为 128 个字符。群描述的长度限制为 512 个字符。
- `updateConfigs`：修改是否公开、入群审批、成员邀请权限、邀请确认和群成员人数上限等配置。

修改成功后，群成员会收到 `onGroupInfoChanged` 事件。

```typescript
const group = client.groupManager.getGroup('groupId');

await group.updateInfo({
  name: 'new group name',
  description: 'new description',
  avatar: 'https://example.com/new-group-avatar.png',
  ext: JSON.stringify({ info: 'new group info' }),
});

await client.groupManager.updateGroupInfo({
  groupId: 'groupId',
  public: true,
  joinApprovalRequired: true,
  allowInvites: false,
  inviteNeedConfirm: true,
  maxMembers: 500,
});
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `name` | String | 否 | 新的群组名称。 |
| `description` | String | 否 | 新的群组描述。 |
| `avatar` | String | 否 | 新的群头像地址或标识。 |
| `ext` | String | 否 | 新的群组扩展信息，通常为业务自定义字符串。 |
| `public` | Boolean | 否 | 是否为公开群。 |
| `joinApprovalRequired` | Boolean | 否 | 用户申请加入群组时是否需要群主或管理员审批。 |
| `allowInvites` | Boolean | 否 | 是否允许普通成员邀请其他用户加入群组。 |
| `inviteNeedConfirm` | Boolean | 否 | 受邀用户加入群组前是否需要确认邀请。 |
| `maxMembers` | Number | 否 | 群组允许的最大成员数。 |

:::tip
`updateInfo` 和 `updateGroupInfo` 只更新传入的字段；未传入的字段不会被修改。
:::

## 管理群组头像

群头像可在创建群组时设置，也可在创建后通过修改群组信息更新。

### 设置群组头像

创建群组时通过 `avatar` 参数设置头像：

```typescript
const result = await client.groupManager.createGroup({
  name: 'SDK 讨论群',
  description: '用于讨论 SDK',
  public: true,
  joinApprovalRequired: false,
  allowInvites: true,
  inviteNeedConfirm: true,
  memberIds: ['user1', 'user2'],
  avatar: 'https://example.com/group-avatar.png',
});

console.log(result.groupId);
```

- 创建群组后，若设置群组头像，可调用 [修改群组头像](#修改群组头像) API 设置头像。

### 修改群组头像

创建群组完成后，群主或管理员可调用 `updateInfo` 设置或修改群组头像。

群头像被修改后，其他群成员会收到 `onGroupInfoChanged` 回调。

```typescript
await client.groupManager.getGroup('groupId').updateInfo({
  avatar: 'https://example.com/new-group-avatar.png',
});
```

### 获取群组头像

群成员可以通过获取群详情的方法，获取群组头像：

```typescript
const detail = await client.groupManager.getGroup('groupId').getDetail();
console.log(detail.avatarUrl);
```

## 管理群公告

### 获取群公告

调用 `getAnnouncement` 获取当前群组公告：

```typescript
const announcement = await client.groupManager.getGroup('groupId').getAnnouncement();
console.log(announcement.announcement);
```

### 设置群公告

群主或管理员可调用 `updateAnnouncement` 设置或更新群公告。群公告的长度限制为 512 个字符。

群公告发生变化时，群成员会收到 `onAnnouncementChanged` 监听事件。

```typescript
await client.groupManager.getGroup('groupId').updateAnnouncement({
  announcement: '欢迎加入本群！',
});
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `announcement` | String | 是 | 新的群公告内容。 |

## 管理群共享文件

群共享文件用于在群组内共享文件资源。

### 获取群共享文件列表

调用 `getSharedFileList` 分页获取当前群组共享文件列表。

```typescript
const result = await client.groupManager.getGroup('groupId').getSharedFileList({
  // 当前页码。默认从第 1 页开始获取。
  pageNum: 1,
  // 取值范围为 [1,1000]，默认为 20。
  pageSize: 20,
});

console.log(result.items);
console.log(result.hasMore);
```

共享文件条目主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `fileId` | String | 共享文件 ID。 |
| `fileName` | String | 文件名称。 |
| `fileOwner` | Object | 上传该文件的用户资料。 |
| `fileSize` | Number | 文件大小，单位为字节。 |
| `createdAt` | Number | 文件创建时间戳。 |

### 上传群共享文件

调用 `uploadSharedFile` 可上传文件到当前群组共享文件列表。单个群共享文件大小限制为 10 MB。上传共享文件后，其他群成员收到 `onSharedFileAdded` 事件。

```typescript
await client.groupManager.getGroup('groupId').uploadSharedFile({
  file: selectedFile,
  onFileUploadProgress: event => {
    console.log(event.loaded);
  },
});
```

### 下载群共享文件

调用 `downloadSharedFile` 可下载当前群组中的指定共享文件。下载完成后，SDK 通过 `onFileDownloadComplete` 回调返回文件数据。

若调用 [服务端上传群组共享文件接口](/document/server-side/group_shared_file_download.html) 时，设置了访问限制，则客户端下载共享文件时，需传入 `secret` 参数。

```typescript
await client.groupManager.getGroup('groupId').downloadSharedFile({
  fileId: 'fileId',
  secret: 'fileSecret',
  onFileDownloadComplete: data => {
    console.log(data);
  },
});
```

### 删除群共享文件

调用 `deleteSharedFile` 可删除当前群组中的指定共享文件。删除共享文件后，其他群成员收到 `onSharedFileDeleted` 事件。

群主和群管理员可删除全部群共享文件，群成员只能删除自己上传的群文件。

```typescript
await client.groupManager.getGroup('groupId').deleteSharedFile({
  fileId: 'fileId',
});
```

## 监听群组属性事件

修改群基础信息、配置、公告或共享文件后，SDK 会触发对应群组事件，详见 [监听群组事件](group_manage.html#监听群组事件)。

## 注意事项

- `getGroup` 只返回绑定指定群组 ID 的单群对象，不会发起网络请求；如需获取服务端最新详情，调用 `refresh`。
- `getDetail` 会优先复用当前会话中可用的群组快照，必要时再从服务端拉取；`refresh` 会强制从服务端刷新。
- `updateInfo` 用于更新群名称、描述、头像和扩展信息；`updateGroupInfo` 用于按群组 ID 直接修改群基础资料或群配置。
- `updateInfo` 和 `updateGroupInfo` 只更新传入的字段，不建议传入空对象。
- `ext` 是字符串字段，如需保存结构化业务信息，建议业务侧自行序列化为 JSON 字符串。
- 文中共享文件下载示例中的 `secret` 为可选参数；是否需要传入取决于服务端返回的共享文件信息和下载校验要求。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getGroup`](#获取群组操作对象) | `GroupManager` | 获取绑定指定群组 ID 的 `Group` 单群对象。 |
| [`getDetail`](#获取群组详情) | `Group` | 获取当前群组详情，优先复用可用快照，必要时从服务端拉取。 |
| [`refresh`](#获取群组详情) | `Group` | 强制从服务端刷新当前群组详情。 |
| [`getGroupInfo`](#获取群组详情) | `GroupManager` | 按群组 ID 从服务端获取单个群组详情。 |
| [`getGroupInfoList`](#获取群组详情) | `GroupManager` | 批量获取多个群组详情。 |
| [`createGroup`](group_manage.html#创建群组) | `GroupManager` | 创建群组。 |
| [`updateInfo`](#修改群组信息) | `Group` | 修改群组名称、描述、头像和扩展信息等基础资料。 |
| [`updateGroupInfo`](#修改群组信息) | `GroupManager` | 按群组 ID 直接修改群组基础资料或群组配置。 |
| [`getAnnouncement`](#获取群公告) | `Group` | 获取当前群组公告。 |
| [`updateAnnouncement`](#设置群公告) | `Group` | 更新当前群组公告。 |
| [`getSharedFileList`](#获取群共享文件列表) | `Group` | 分页获取当前群组共享文件列表。 |
| [`uploadSharedFile`](#上传群共享文件) | `Group` | 上传文件到当前群组共享文件列表。 |
| [`downloadSharedFile`](#下载群共享文件) | `Group` | 下载当前群组中的指定共享文件。 |
| [`deleteSharedFile`](#删除群共享文件) | `Group` | 删除当前群组中的指定共享文件。 |
