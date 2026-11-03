# 创建和管理群组

## 功能说明

群组是支持多人实时沟通的即时通讯场景。本文介绍如何使用环信即时通讯 IM React Native SDK 创建、加入、退出、解散和管理群组，并监听群组事件。

### 群组分类

群组按照是否对用户公开，可以分为公开群和私有群。

React Native SDK 使用 `ChatGroupConfigs` 的多个字段定义群组类型：

| 群组类型                   | React Native 配置                                      | 说明                                       |
| :--- | :--- | :--- |
| 私有群，仅群主和管理员邀请 | `isPublic = false`、`allowInvites = false`        | 普通成员不能邀请其他用户。                 |
| 私有群，成员可邀请         | `isPublic = false`、`allowInvites = true`         | 普通成员可以邀请其他用户。                 |
| 公开群，申请需审批         | `isPublic = true`、`joinApprovalRequired = true`  | 用户提交入群申请后，等待群主或管理员审批。 |
| 公开群，可直接加入         | `isPublic = true`、`joinApprovalRequired = false` | 用户可直接加入群组。                       |

:::tip
`joinApprovalRequired` 仅对公开群有效，`allowInvites` 仅对私有群有效。
:::

### 群组成员角色

群组包含以下角色：

| 角色 | 说明 |
| :--- | :--- |
| 群主 | 创建群组的用户，拥有解散群组、转让群主、修改群配置和移出成员等权限。 |
| 群管理员 | 由群主设置，具备部分群管理权限。例如，审批入群申请、邀请或移出成员，以及管理禁言、白名单和黑名单等。 |
| 普通成员 | 可以在权限允许的范围内收发群消息、退出群组，以及在私有群允许邀请时邀请其他用户。 |

如需了解群组消息相关能力，参见[消息管理](message_overview.html)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解接口调用频率、群组数量及群成员数量限制，详见[使用限制](/product/limitation.html)。

## 创建群组

调用 `ChatGroupManager#createGroupEx` 创建群组。创建成功后，当前用户成为群主，返回 `Promise<ChatGroup>`，成功时返回新建的 `ChatGroup` 对象。

SDK 使用 `ChatGroupConfigs` 配置群组类型和入群规则：

| 参数或字段 | 类型 | 是否必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `groupName` | `string` | 是 | 群组名称。长度不能超过 255 个字符。 |
| `groupAvatar` | `string` | 否 | 群头像 URL；省略时不设置头像。 |
| `desc` | `string` | 否 | 群组描述；省略时不设置描述。长度不能超过 2048 个字符。 |
| `inviteMembers` | `string[]` | 否 | 初始群成员的用户 ID 数组，不包含群主；省略或传空数组时不添加初始成员。 |
| `inviteReason` | `string` | 否 | 邀请初始成员入群的说明；省略时不设置邀请说明。 |
| `configs` | `ChatGroupConfigs` | 是 | 群组配置对象，不能为 `null`。 |
| `configs.maxCount` | `number` | 否 | 群组最大成员数，默认值为 `200`。 |
| `configs.isPublic` | `boolean` | 否 | 是否为公开群；`true` 表示公开群，`false` 表示私有群，默认值为 `false`。 |
| `configs.joinApprovalRequired` | `boolean` | 否 | 申请加入公开群时是否需要群主或管理员审批。仅对公开群有意义，默认值为 `false`。 |
| `configs.allowInvites` | `boolean` | 否 | 私有群是否允许普通成员邀请其他用户。仅对私有群有意义，默认值为 `false`。 |
| `configs.inviteNeedConfirm` | `boolean` | 否 | 被邀请用户加入群组前是否需要确认邀请，默认值为 `false`。 |
| `configs.ext` | `string` | 否 | 群组扩展信息，可使用 JSON 字符串；省略时不设置扩展信息。 |

以上 `configs` 字段的“是否必填”指构造 `ChatGroupConfigs` 时是否需要传入该字段。`createGroupEx` 使用一个参数对象传入表中的创建参数。

```typescript
const configs = new ChatGroupConfigs({
  maxCount: 200,
  isPublic: false,
  joinApprovalRequired: false,
  allowInvites: true,
  inviteNeedConfirm: true,
  ext: JSON.stringify({ source: 'react-native' }),
});
const initialMembers: string[] = [];

try {
  // 创建群组并设置群类型和入群规则
  const group = await ChatClient.getInstance().groupManager.createGroupEx({
    groupName: 'group name',
    groupAvatar: 'https://example.com/group-avatar.png',
    desc: 'group description',
    inviteMembers: initialMembers,
    configs,
  });
  const groupId = group.groupId;
} catch (error: unknown) {
  console.error('创建群组失败：', error);
}
```


## 解散群组

仅群主可以调用 `ChatGroupManager#destroyGroup` 解散群组。群组解散后，其他成员会收到 `ChatGroupEventListener#onDestroyed` 回调并被移出群组。

:::warning
解散群组是不可恢复的操作。解散成功后，群组将不再存在，所有群成员均会被移出群组。本地会话和消息的处理取决于初始化选项 `ChatOptions.deleteMessagesAsExitGroup`：默认值为 `true`，删除本地会话及消息；设置为 `false` 时保留。执行该操作前，建议在应用侧进行二次确认。
:::

```typescript
try {
  // 解散群组
  await ChatClient.getInstance().groupManager
    .destroyGroup(groupId);
  // 群组已解散
} catch (error: unknown) {
  console.error('解散群组失败：', error);
}
```

## 加入群组

用户可以通过邀请加入群组，也可以主动申请加入公开群。具体流程由群组的 `isPublic`、`joinApprovalRequired`、`allowInvites` 和 `inviteNeedConfirm` 配置决定。

### 邀请用户入群

React Native SDK 中，群主和管理员可调用 `ChatGroupManager#addMembers` 将用户添加至群组。对于私有群，普通成员是否可以邀请其他用户由 `ChatGroupConfigs#allowInvites` 控制：

- `allowInvites = false`：普通成员不能邀请其他用户；仅群主和管理员可以添加成员。
- `allowInvites = true`：普通成员可调用 `ChatGroupManager#inviteUser` 邀请其他用户加入群组。

邀请流程如下：

![](/images/android/goup_member_invite.png)

群主和群管理员可以调用 `ChatGroupManager#addMembers` 添加一个或多个用户；允许邀请的私有群普通成员可以调用 `ChatGroupManager#inviteUser` 发出邀请。

```typescript
const userIds = ['user1', 'user2'];

// 群主或群管理员添加用户
async function addGroupUsers(): Promise<void> {
  try {
    await ChatClient.getInstance().groupManager.addMembers(groupId, userIds);
    // 操作成功
  } catch (error: unknown) {
    // 操作失败，根据错误码和错误信息处理
    console.error('添加用户失败：', error);
  }
}

// 允许邀请的私有群普通成员发出邀请
async function inviteGroupUsers(): Promise<void> {
  try {
    await ChatClient.getInstance().groupManager
      .inviteUser(groupId, userIds, 'Join our group');
    // 邀请已发送
  } catch (error: unknown) {
    // 邀请发送失败
    console.error('邀请发送失败：', error);
  }
}
```

邀请处理流程由创建群组时的 `ChatGroupConfigs.inviteNeedConfirm` 和受邀用户客户端的 `ChatOptions.autoAcceptGroupInvitation` 共同决定：

- `inviteNeedConfirm = false`：受邀用户无需确认，直接加入群组，并收到 `ChatGroupEventListener#onAutoAcceptInvitation` 回调。此时，受邀用户是否开启自动接受群组邀请不影响结果。
- `inviteNeedConfirm = true` 且受邀用户开启自动接受群组邀请：SDK 自动接受邀请，受邀用户收到 `ChatGroupEventListener#onAutoAcceptInvitation` 回调。
- `inviteNeedConfirm = true` 且受邀用户关闭自动接受群组邀请：受邀用户收到 `onInvitationReceived` 回调，可调用 `ChatGroupManager#acceptInvitation` 或 `ChatGroupManager#declineInvitation` 接受或拒绝邀请。

`ChatOptions.autoAcceptGroupInvitation` 默认为 `false`。如需由用户手动处理群组邀请，应在 SDK 初始化前将其设置为 `false`：

```typescript
try {
  // 在 SDK 初始化时配置邀请处理方式
  const options = ChatOptions.withAppKey({
    appKey: 'your-org#your-app',
    // 由用户手动处理群组邀请
    autoAcceptGroupInvitation: false,
  });
  await ChatClient.getInstance().init(options);
} catch (error: unknown) {
  console.error('初始化 SDK 失败：', error);
}
```

React Native SDK 5.0.0 可通过 `ChatGroup.configs` 读取群配置，但 Android 端返回的群对象不包含 `inviteNeedConfirm`，该字段会被填充为 `false`，不能据此判断服务端实际配置。

:::notice
React Native SDK 5.0.0 的 Android 端调用 `ChatGroupManager#declineInvitation` 时，邀请者 ID 未传递至原生接口。使用手动拒绝邀请流程前，请验证目标版本能否正确拒绝邀请并通知邀请人。
:::

手动接受或拒绝邀请时，需传入 `onInvitationReceived` 回调返回的群组 ID 和邀请者 ID。示例如下：

```typescript
// 接受或拒绝邀请为两种处理方式，按业务选择调用其中一个函数
async function acceptGroupInvitation(groupId: string, inviter: string): Promise<void> {
  try {
    // 接受群组邀请
    await ChatClient.getInstance().groupManager.acceptInvitation(groupId, inviter);
    // 已接受邀请并加入群组
  } catch (error: unknown) {
    // 接受邀请失败
    console.error('接受邀请失败：', error);
  }
}

async function declineGroupInvitation(groupId: string, inviter: string): Promise<void> {
  try {
    // 拒绝群组邀请
    await ChatClient.getInstance().groupManager
      .declineInvitation(groupId, inviter, 'No, thanks');
    // 拒绝邀请调用完成
  } catch (error: unknown) {
    // 拒绝邀请失败
    console.error('拒绝邀请失败：', error);
  }
}
```

邀请被接受后，邀请人会收到 `onInvitationAccepted` 回调；邀请被拒绝后，邀请人会收到 `onInvitationDeclined` 回调。用户成功加入群组后，即可在该群组中收发消息。

### 用户申请入群

公开群支持用户主动申请加入，私有群不支持用户主动申请加入。

![](/images/android/group_member_apply.png)

具体调用方式由 `ChatGroupConfigs.joinApprovalRequired` 决定：

- `false`：调用 `ChatGroupManager#joinPublicGroup`，直接加入公开群。
- `true`：调用 `ChatGroupManager#requestToJoinPublicGroup` 提交入群申请，等待群主或群管理员审批。

```typescript
// 根据公开群是否需要审批，选择其中一种方式
async function joinOpenGroup(groupId: string): Promise<void> {
  try {
    // 加入无需审批的公开群
    await ChatClient.getInstance().groupManager.joinPublicGroup(groupId);
    // 已加入群组
  } catch (error: unknown) {
    // 加入失败
    console.error('加入群组失败：', error);
  }
}

async function applyToJoinGroup(groupId: string): Promise<void> {
  try {
    // 申请加入需要审批的公开群
    await ChatClient.getInstance().groupManager
      .requestToJoinPublicGroup(groupId, 'Please approve my request');
    // 入群申请已提交
  } catch (error: unknown) {
    // 申请提交失败
    console.error('申请提交失败：', error);
  }
}
```

需要审批时，群主和群管理员会收到 `ChatGroupEventListener#onRequestToJoinReceived` 回调，并选择同意或拒绝申请：
- 申请被同意后，申请人会收到 `onRequestToJoinAccepted` 回调。
- 申请被拒绝后，申请人会收到 `onRequestToJoinDeclined` 回调。

```typescript
// 根据审批结果，选择同意或拒绝
async function acceptJoinRequest(groupId: string, applicant: string): Promise<void> {
  try {
    // 群主或群管理员同意入群申请
    await ChatClient.getInstance().groupManager
      .acceptJoinApplication(groupId, applicant);
    // 已同意入群申请
  } catch (error: unknown) {
    // 操作失败
    console.error('同意入群申请失败：', error);
  }
}

async function declineJoinRequest(groupId: string, applicant: string): Promise<void> {
  try {
    // 群主或群管理员拒绝入群申请
    await ChatClient.getInstance().groupManager
      .declineJoinApplication(groupId, applicant, 'Group is full');
    // 已拒绝入群申请
  } catch (error: unknown) {
    // 操作失败
    console.error('拒绝入群申请失败：', error);
  }
}
```

## 退出群组

用户退出群组可分为两种情况：主动退出，以及被群主或管理员移出。

退出群组时，用户的本地会话和消息的处理取决于初始化方法 `ChatOptions#deleteMessagesAsExitGroup`：
- （默认值） `true`：删除本地会话及消息。
- `false`：保留本地会话及消息。

### 主动退出

群成员可以调用 `ChatGroupManager#leaveGroup` 主动退出群组。退出后，该用户不再接收群消息，其他成员会收到 `onMembersExited` 回调。

群主不能直接退出群组；如需退出，应先转让群主身份，再调用退出接口，或直接解散群组。

```typescript
try {
  // 主动退出群组
  await ChatClient.getInstance().groupManager
    .leaveGroup(groupId);
} catch (error: unknown) {
  console.error('退出群组失败：', error);
}
```

### 移出成员

群主和群管理员可以调用 `ChatGroupManager#removeMembers` 将一个或多个成员移出群组。被移出的成员会收到 `ChatGroupEventListener#onMemberRemoved` 事件，其他成员会收到 `onMembersExited` 事件。被移出群组后，用户还可以再次加入群组。

```typescript
const members = ['user1', 'user2'];

try {
  // 将指定成员移出群组
  await ChatClient.getInstance().groupManager
    .removeMembers(groupId, members);
} catch (error: unknown) {
  console.error('移出成员失败：', error);
}
```

## 获取当前用户加入的群组列表

本地数据库打开后，可调用 `ChatGroupManager#getJoinedGroups` 读取当前用户本地已加入的群组列表，用于优先展示本地数据。该方法优先从内存缓存读取；如群组数据尚未加载到内存，首次调用会从本地数据库加载。

为在登录后获取最新的已加入群组数据，可在初始化 SDK 前设置 `ChatOptions.dataSyncType`，并将 `ChatDataSyncType.JoinedGroups` 包含在自动同步的数据类型中，如需明确启用群组数据同步，请显式包含 `ChatDataSyncType.JoinedGroups`。需要同时同步其他数据时，可使用按位或（`|`）组合类型。

```typescript
try {
  // 配置登录后自动同步的数据类型
  const options = ChatOptions.withAppKey({
    appKey: 'your-org#your-app',
    // 登录后自动同步已加入群组数据
    dataSyncType: ChatDataSyncType.JoinedGroups,
  });
  await ChatClient.getInstance().init(options);
} catch (error: unknown) {
  console.error('初始化 SDK 失败：', error);
}
```

用户登录成功后，SDK 会自动同步当前用户已加入的群组数据。通过 `ChatConnectEventListener#onDataSyncFinish` 监听同步结果；当 `type` 包含 `ChatDataSyncType.JoinedGroups` 且 `errorCode` 为 `0` 时，表示同步成功。此时可再次调用 `ChatGroupManager#getJoinedGroups` 获取同步后的本地群组列表，并刷新页面。

```typescript
const groupSyncListener: ChatConnectEventListener = {
  onDataSyncFinish(type, errorCode): void {
    // type 为位掩码；群组数据同步成功后，重新读取本地群组列表
    if ((type & ChatDataSyncType.JoinedGroups) !== 0 && errorCode === 0) {
      void ChatClient.getInstance().groupManager.getJoinedGroups()
        .then((groups) => {
          // 使用同步后的已加入群组列表刷新页面
          console.log('已加入群组：', groups);
        })
        .catch((error: unknown) => console.error('读取本地群组列表失败：', error));
    }
  },
};

// SDK 初始化完成后、登录前注册监听器
ChatClient.getInstance().addConnectionListener(groupSyncListener);

// 页面或组件销毁且不再需要监听时调用
function removeGroupSyncListener(): void {
  ChatClient.getInstance().removeConnectionListener(groupSyncListener);
}
```

## 查询当前用户已加入的群组数量

调用 `ChatGroupManager#fetchJoinedGroupCount` 从服务器获取当前用户已加入的群组数量。

单个用户可加入的群组数量上限取决于订阅的即时通讯套餐包，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

```typescript
try {
  // 从服务器获取当前用户已加入的群组数量
  const count = await ChatClient.getInstance().groupManager
    .fetchJoinedGroupCount();
} catch (error: unknown) {
  console.error('查询群组数量失败：', error);
}
```

## 屏蔽和解除屏蔽群消息

群成员可以屏蔽或解除屏蔽指定群组的消息。屏蔽群消息只影响当前用户是否继续接收指定群组的后续消息，不会退出群组，也不会影响其他群成员。

### 屏蔽群消息

调用 `ChatGroupManager#blockGroup` 屏蔽指定群组的消息。群主和群管理员不能屏蔽群消息。

```typescript
try {
  // 屏蔽指定群组的消息
  await ChatClient.getInstance().groupManager
    .blockGroup(groupId);
  // 已屏蔽该群组的消息
} catch (error: unknown) {
  console.error('屏蔽群消息失败：', error);
}
```

### 解除屏蔽群消息

调用 `ChatGroupManager#unblockGroup` 解除屏蔽。操作成功后，当前用户可以继续接收该群组的后续消息。

```typescript
try {
  // 解除屏蔽指定群组的消息
  await ChatClient.getInstance().groupManager
    .unblockGroup(groupId);
  // 已解除屏蔽该群组的消息
} catch (error: unknown) {
  console.error('解除屏蔽群消息失败：', error);
}
```

### 检查当前用户是否已屏蔽群消息

先调用 `ChatGroupManager#fetchGroupInfoWithoutMembersFromServer` 获取最新群详情，再通过 `ChatGroup.messageBlocked` 判断当前用户是否已屏蔽指定群组的消息。

```typescript
try {
  // 获取最新群组详情
  const group = await ChatClient.getInstance().groupManager
    .fetchGroupInfoWithoutMembersFromServer(groupId);
  if (group) {
    const messageBlocked = group.messageBlocked;
  }
} catch (error: unknown) {
  console.error('获取群组详情失败：', error);
}
```

## 监听群组事件

`ChatGroupManager` 提供群组事件监听接口。应用可以通过 `ChatGroupManager#addGroupListener` 注册监听器，获取群组中的各类事件并更新相关 UI。不再使用监听器时，需要调用 `ChatGroupManager#removeGroupListener` 移除，避免内存泄漏。

```typescript
// 创建群组事件监听器
// 以下说明中的当前用户，表示当前登录用户
const groupListener: ChatGroupEventListener = {
  // 当前用户收到入群邀请。受邀用户会收到该回调
  // 例如，用户 B 邀请当前用户入群，则当前用户收到该回调
  onInvitationReceived({ groupId, groupName, inviter, reason }): void {},

  // 群主或群管理员收到入群申请。群主和所有管理员收到该回调
  onRequestToJoinReceived({ groupId, groupName, applicant, reason }): void {},

  // 群主或群管理员同意用户的入群申请
  // 申请人、群主和管理员（除操作者外）收到该回调
  onRequestToJoinAccepted({ groupId, groupName, accepter }): void {},

  // 群主或群管理员拒绝用户的入群申请
  // 申请人、群主和管理员（除操作者外）收到该回调
  onRequestToJoinDeclined({ groupId, groupName, decliner, reason, applicant }): void {},

  // 用户同意入群邀请。邀请人收到该回调
  onInvitationAccepted({ groupId, invitee, reason }): void {},

  // 用户拒绝入群邀请。邀请人收到该回调
  onInvitationDeclined({ groupId, invitee, reason }): void {},

  // 有成员被移出群组。被移出的成员收到该回调
  onMemberRemoved({ groupId, groupName }): void {},

  // 群组被解散。其他群成员收到该回调
  onDestroyed({ groupId, groupName }): void {},

  // 当前用户自动接受入群邀请。受邀用户收到该回调
  onAutoAcceptInvitation({ groupId, inviter, inviteMessage }): void {},

  // 有成员被加入群禁言列表
  // 被禁言成员及群主和群管理员（除操作者外）收到该回调
  onMuteListAdded({ groupId, mutes, muteExpire }): void {},

  // 有成员被移出群禁言列表
  // 被解除禁言成员及群主和群管理员（除操作者外）收到该回调
  onMuteListRemoved({ groupId, mutes }): void {},

  // 有成员被加入群白名单
  // 被添加成员及群主和群管理员（除操作者外）收到该回调
  onAllowListAdded({ groupId }): void {
    // Android 端的成员列表可能缺失，按需重新查询白名单
  },

  // 有成员被移出群白名单
  // 被移出成员及群主和群管理员（除操作者外）收到该回调
  onAllowListRemoved({ groupId }): void {
    // Android 端的成员列表可能缺失，按需重新查询白名单
  },

  // 全员禁言状态变化。群组所有成员（除操作者外）收到该回调
  onAllGroupMemberMuteStateChanged({ groupId, isAllMuted }): void {},

  // 设置群管理员。群主、新管理员和其他管理员收到该回调
  onAdminAdded({ groupId, admin }): void {},

  // 群管理员被移除
  // 被移除的管理员及群主和群管理员（除操作者外）收到该回调
  onAdminRemoved({ groupId, admin }): void {},

  // 群主转让权限。群成员收到该回调
  onOwnerChanged({ groupId, newOwner, oldOwner }): void {},

  // 有新成员加入群组。除新成员外，其他群成员收到该回调
  onMembersJoined({ groupId, members }): void {},

  // 有成员主动或被动退出群组
  // 除退出成员外，其他群成员收到该回调
  onMembersExited({ groupId, members }): void {},

  // 群公告更新。群组所有成员收到该回调
  onAnnouncementChanged({ groupId, announcement }): void {},

  // 有成员上传了群共享文件。群组所有成员收到该回调
  onSharedFileAdded({ groupId }): void {
    // 通过共享文件列表接口获取文件信息，不将 sharedFile 直接作为文件 ID
  },

  // 群共享文件被删除。群组所有成员收到该回调
  onSharedFileDeleted({ groupId, fileId }): void {},

  // 群组详情变更。群组所有成员收到该回调
  onDetailChanged(group): void {},

  // 群组禁用状态变化。群组所有成员收到该回调
  onStateChanged(group): void {
    const isDisabled = group.isDisabled;
  },

  // 群成员自定义属性变更。群内其他成员收到该回调
  onMemberAttributesChanged({ groupId, member, attributes, operator }): void {},

  // 群成员名片变更。群组其他在线成员收到该回调
  onUserGroupNamecardChanged({ groupId, userId, namecard }): void {
    // 清除名片时兼容空值
    const currentNamecard = namecard ?? '';
  },
};

ChatClient.getInstance().groupManager.addGroupListener(groupListener);

// 页面或组件销毁且不再需要监听时调用
function removeGroupListener(): void {
  ChatClient.getInstance().groupManager.removeGroupListener(groupListener);
}
```
// TODO：研发确认：
:::notice
- React Native SDK 5.0.0 的 Android 端白名单变更事件未提供 `members` 字段。请将回调作为变更通知，按需重新查询白名单。
- `ChatGroupEventListener#onSharedFileAdded` 的 `sharedFile` 声明为 `string`，但双端实际返回文件信息对象。请通过 [共享文件列表接口](group_attributes.html#从服务器获取共享文件) 获取文件信息，不将该字段直接作为文件 ID。
- iOS 端邀请事件的 `reason`、自动入群事件的 `inviteMessage` 可能缺失；`onRequestToJoinAccepted` 的 `accepter` 为群主 ID，不应据此判断实际审批人。
- 群成员名片被清除时，iOS 端的 `namecard` 可能为 `null`，处理时请兼容空值。
:::

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`ChatGroupManager#createGroupEx`](#创建群组) | `ChatGroupManager` | 异步创建群组。 |
| [`ChatGroupManager#destroyGroup`](#解散群组) | `ChatGroupManager` | 解散群组。 |
| [`ChatGroupManager#addMembers`](#邀请用户入群) / [`ChatGroupManager#inviteUser`](#邀请用户入群) | `ChatGroupManager` | 添加或邀请用户加入群组。 |
| [`ChatGroupManager#acceptInvitation`](#邀请用户入群) / [`ChatGroupManager#declineInvitation`](#邀请用户入群) | `ChatGroupManager` | 接受或拒绝群组邀请。 |
| [`ChatGroupManager#joinPublicGroup`](#用户申请入群) / [`ChatGroupManager#requestToJoinPublicGroup`](#用户申请入群) | `ChatGroupManager` | 直接加入或申请加入公开群。 |
| [`ChatGroupManager#acceptJoinApplication`](#用户申请入群) / [`ChatGroupManager#declineJoinApplication`](#用户申请入群) | `ChatGroupManager` | 同意或拒绝入群申请。 |
| [`ChatGroupManager#leaveGroup`](#主动退出) | `ChatGroupManager` | 主动退出群组。 |
| [`ChatGroupManager#removeMembers`](#移出成员) | `ChatGroupManager` | 将一个或多个成员移出群组。 |
| [`dataSyncType`](#获取当前用户加入的群组列表) | `ChatOptions` | 登录后自动同步的数据类型，可包含已加入群组数据。 |
| [`ChatGroupManager#getJoinedGroups`](#获取当前用户加入的群组列表) | `ChatGroupManager` | 从本地获取当前用户已加入的群组列表。 |
| [`ChatGroupManager#fetchJoinedGroupCount`](#查询当前用户已加入的群组数量) | `ChatGroupManager` | 从服务器获取当前用户已加入的群组数量。 |
| [`ChatGroupManager#fetchGroupInfoWithoutMembersFromServer`](#检查当前用户是否已屏蔽群消息) | `ChatGroupManager` | 从服务器获取群组详情。 |
| [`messageBlocked`](#检查当前用户是否已屏蔽群消息) | `ChatGroup` | 当前用户是否已屏蔽指定群组消息。 |
| [`ChatGroupManager#blockGroup`](#屏蔽群消息) / [`ChatGroupManager#unblockGroup`](#解除屏蔽群消息) | `ChatGroupManager` | 屏蔽或解除屏蔽群消息。 |
