# 创建和管理群组

## 功能说明

群组是支持多人实时沟通的即时通讯场景。本文介绍如何使用环信即时通讯 IM Flutter SDK 创建、加入、退出、解散和管理群组，并监听群组事件。

### 群组分类

群组按照是否对用户公开，可以分为公开群和私有群。

Flutter SDK 使用 `ChatGroupConfigs` 的多个字段定义群组类型：

| 群组类型 | Flutter 配置 | 说明 |
| :--- | :--- | :--- |
| 私有群，仅群主和管理员邀请 | `isPublic = false`、`allowInvites = false` | 普通成员不能邀请其他用户。 |
| 私有群，成员可邀请 | `isPublic = false`、`allowInvites = true` | 普通成员可以邀请其他用户。 |
| 公开群，申请需审批 | `isPublic = true`、`joinApprovalRequired = true` | 用户提交入群申请后，等待群主或管理员审批。 |
| 公开群，可直接加入 | `isPublic = true`、`joinApprovalRequired = false` | 用户可直接加入群组。 |

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

调用 `ChatGroupManager#createGroup` 创建群组。创建成功后，当前用户成为群主，方法返回新建的 `ChatGroup` 对象。

SDK 使用 `ChatGroupConfigs` 配置群组类型和入群规则：

| 参数或字段 | 类型 | 是否必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `groupName` | `String?` | 否 | 群组名称。长度不能超过 255 个字符。 |
| `avatarUrl` | `String?` | 否 | 群头像 URL。 |
| `desc` | `String?` | 否 | 群组描述。长度不能超过 2048 个字符。 |
| `inviteMembers` | `List<String>?` | 否 | 初始群成员的用户 ID 列表，不包含群主。 |
| `inviteReason` | `String?` | 否 | 邀请初始成员入群的说明。 |
| `configs` | `ChatGroupConfigs` | 是 | 群组配置对象。 |
| `configs.maxCount` | `int` | 否 | 群组最大成员数，默认值为 `200`。 |
| `configs.isPublic` | `bool` | 否 | 是否为公开群，默认值为 `false`。 |
| `configs.joinApprovalRequired` | `bool` | 否 | 申请加入公开群时是否需要审批，默认值为 `false`。 |
| `configs.allowInvites` | `bool` | 否 | 私有群是否允许普通成员邀请用户，默认值为 `false`。 |
| `configs.inviteNeedConfirm` | `bool` | 否 | 被邀请用户加入群组前是否需要确认，默认值为 `false`。 |
| `configs.ext` | `String?` | 否 | 群组扩展信息，可使用 JSON 字符串。 |

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
      joinApprovalRequired: false,
      allowInvites: true,
      inviteNeedConfirm: true,
      ext: '{"source":"flutter"}',
    ),
  );
  final String groupId = group.groupId;
} on ChatError catch (e) {
  // 创建失败，根据错误码和错误信息处理。
}
```

## 解散群组

仅群主可以调用 `ChatGroupManager#destroyGroup` 解散群组。群组解散后，其他成员会收到 `ChatGroupEventHandler#onGroupDestroyed` 回调并被移出群组。

:::warning
解散群组是不可恢复的操作。解散成功后，群组将不再存在，所有群成员均会被移出群组，SDK 也会移除内存中该群组对应的会话。执行该操作前，建议在应用侧进行二次确认。
:::

```dart
try {
  await ChatClient.getInstance.groupManager.destroyGroup(groupId);
  // 群组已解散。
} on ChatError catch (e) {
  // 解散失败。
}
```

## 加入群组

用户可以通过邀请加入群组，也可以主动申请加入公开群。具体流程由群组的 `isPublic`、`joinApprovalRequired`、`allowInvites` 和 `inviteNeedConfirm` 配置决定。

### 邀请用户入群

Flutter SDK 中，群主和管理员可调用 `ChatGroupManager#addMembers` 将用户添加至群组。对于私有群，普通成员是否可以邀请其他用户由 `ChatGroupConfigs.allowInvites` 控制：

- `allowInvites = false`：普通成员不能邀请其他用户；仅群主和管理员可以添加成员。
- `allowInvites = true`：普通成员可调用 `inviterUser` 邀请其他用户加入群组。

邀请流程如下：

![](/images/flutter/goup_member_invite.png)

群主和群管理员可以调用 `addMembers` 添加一个或多个用户；允许邀请的私有群普通成员可以调用 `inviterUser` 发出邀请。

```dart
const List<String> userIds = <String>['user1', 'user2'];

try {
  // 群主或群管理员添加用户。
  await ChatClient.getInstance.groupManager.addMembers(
    groupId,
    userIds,
    welcome: 'Welcome',
  );

  // 允许邀请的私有群普通成员发出邀请。
  await ChatClient.getInstance.groupManager.inviterUser(
    groupId,
    userIds,
    reason: 'Join our group',
  );
} on ChatError catch (e) {
  // 操作失败。
}
```

邀请处理流程由创建群组时的 `ChatGroupConfigs.inviteNeedConfirm` 和受邀用户客户端的 `ChatOptions.autoAcceptGroupInvitation` 共同决定：

- `inviteNeedConfirm = false`：受邀用户无需确认，直接加入群组，并收到 `onAutoAcceptInvitationFromGroup` 回调。
- `inviteNeedConfirm = true` 且受邀用户开启自动接受群组邀请：SDK 自动接受邀请，受邀用户收到 `onAutoAcceptInvitationFromGroup` 回调。
- `inviteNeedConfirm = true` 且受邀用户关闭自动接受群组邀请：受邀用户收到 `onInvitationReceivedFromGroup` 回调，可调用 `acceptInvitation` 或 `declineInvitation` 接受或拒绝邀请。

`autoAcceptGroupInvitation` 默认为 `false`。如需自动接受群组邀请，应在 SDK 初始化前设置为 `true`：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  autoAcceptGroupInvitation: true,
);
await ChatClient.getInstance.init(options);
```

手动接受或拒绝邀请时，需传入 `onInvitationReceivedFromGroup` 回调返回的群组 ID 和邀请者 ID：

```dart
try {
  final ChatGroup group = await ChatClient.getInstance.groupManager
      .acceptInvitation(groupId, inviter);

  await ChatClient.getInstance.groupManager.declineInvitation(
    groupId: groupId,
    inviter: inviter,
    reason: 'No, thanks',
  );
} on ChatError catch (e) {
  // 接受或拒绝邀请失败。
}
```

邀请被接受后，邀请人会收到 `onInvitationAcceptedFromGroup` 回调；邀请被拒绝后，邀请人会收到 `onInvitationDeclinedFromGroup` 回调。用户成功加入群组后，即可在该群组中收发消息。

### 用户申请入群

公开群支持用户主动申请加入，私有群不支持用户主动申请加入。

![](/images/flutter/group_member_apply.png)

具体调用方式由 `ChatGroupConfigs.joinApprovalRequired` 决定：

- `false`：调用 `joinPublicGroup`，直接加入公开群。
- `true`：调用 `requestToJoinPublicGroup` 提交入群申请，等待群主或群管理员审批。

```dart
try {
  // 加入无需审批的公开群。
  await ChatClient.getInstance.groupManager.joinPublicGroup(groupId);

  // 申请加入需要审批的公开群。
  await ChatClient.getInstance.groupManager.requestToJoinPublicGroup(
    groupId,
    reason: 'Please approve my request',
  );
} on ChatError catch (e) {
  // 加入或申请失败。
}
```

需要审批时，群主和群管理员会收到 `onRequestToJoinReceivedFromGroup` 回调，并选择同意或拒绝申请：

- 申请被同意后，申请人会收到 `onRequestToJoinAcceptedFromGroup` 回调。
- 申请被拒绝后，申请人会收到 `onRequestToJoinDeclinedFromGroup` 回调。

```dart
try {
  // 群主和群管理员同意入群申请。
  await ChatClient.getInstance.groupManager.acceptJoinApplication(
    groupId,
    applicant,
  );

  // 群主和群管理员拒绝入群申请。
  await ChatClient.getInstance.groupManager.declineJoinApplication(
    groupId,
    applicant,
    reason: 'Group is full',
  );
} on ChatError catch (e) {
  // 审批失败。
}
```

## 退出群组

### 主动退出

群成员可以调用 `ChatGroupManager#leaveGroup` 主动退出群组。退出后，该用户不再接收群消息，其他成员会收到 `onMembersExitedFromGroup` 回调。

群主不能直接退出群组；如需退出，应先转让群主身份，再调用退出接口，或直接解散群组。

```dart
try {
  await ChatClient.getInstance.groupManager.leaveGroup(groupId);
} on ChatError catch (e) {
  // 退出失败。
}
```

退出群组后，SDK 会移除该群会话的内存缓存。是否删除本地数据库中的群消息由初始化选项 `ChatOptions.deleteMessagesAsExitGroup` 控制；该选项默认为 `true`，表示退出群组时删除本地群消息。

### 移出成员

群主和群管理员可以调用 `ChatGroupManager#removeMembers` 将一个或多个成员移出群组。被移出的成员会收到 `onUserRemovedFromGroup` 事件，其他成员会收到 `onMembersExitedFromGroup` 事件。被移出群组后，用户还可以再次加入群组。

```dart
try {
  await ChatClient.getInstance.groupManager.removeMembers(
    groupId,
    const <String>['user1', 'user2'],
  );
} on ChatError catch (e) {
  // 移出失败。
}
```

## 获取当前用户加入的群组列表

本地数据库打开后，可调用 `ChatGroupManager#getJoinedGroups` 读取当前用户本地已加入的群组列表，用于优先展示本地数据。该方法从 SDK 的本地缓存获取群组信息。

为在登录后获取最新的已加入群组数据，应在初始化 SDK 前通过 `ChatOptions.dataSyncType` 包含 `ChatDataSyncType.joinedGroups`：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  dataSyncType: ChatDataSyncType.joinedGroups,
);
await ChatClient.getInstance.init(options);
```

用户登录成功后，SDK 会自动同步当前用户已加入的群组数据。通过 `ConnectionEventHandler#onDataSyncFinish` 监听同步结果；当 `type` 包含 `ChatDataSyncType.joinedGroups` 且 `error` 为 `null` 时，表示同步成功。此时可再次调用 `getJoinedGroups` 获取同步后的本地群组列表，并刷新页面。

```dart
ChatClient.getInstance.addConnectionEventHandler(
  'joined_groups_sync_handler',
  ConnectionEventHandler(
    onDataSyncFinish: (type, error) async {
      if ((type & ChatDataSyncType.joinedGroups) != 0 && error == null) {
        final List<ChatGroup> groups =
            await ChatClient.getInstance.groupManager.getJoinedGroups();
        // 使用同步后的已加入群组列表刷新页面。
      }
    },
  ),
);
```

## 查询当前用户已加入的群组数量

调用 `ChatGroupManager#fetchJoinedGroupCount` 从服务器获取当前用户已加入的群组数量。

单个用户可加入的群组数量上限取决于订阅的即时通讯套餐包，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

```dart
try {
  final int count =
      await ChatClient.getInstance.groupManager.fetchJoinedGroupCount();
} on ChatError catch (e) {
  // 获取失败。
}
```

## 屏蔽和解除屏蔽群消息

群成员可以屏蔽或解除屏蔽指定群组的消息。屏蔽群消息只影响当前用户是否继续接收指定群组的后续消息，不会退出群组，也不会影响其他群成员。

### 屏蔽群消息

调用 `ChatGroupManager#blockGroup` 屏蔽指定群组的消息。群主和群管理员不能屏蔽群消息。

```dart
try {
  await ChatClient.getInstance.groupManager.blockGroup(groupId);
} on ChatError catch (e) {
  // 屏蔽失败。
}
```

### 解除屏蔽群消息

调用 `ChatGroupManager#unblockGroup` 解除屏蔽。操作成功后，当前用户可以继续接收该群组的后续消息。

```dart
try {
  await ChatClient.getInstance.groupManager.unblockGroup(groupId);
} on ChatError catch (e) {
  // 解除屏蔽失败。
}
```

### 检查当前用户是否已屏蔽群消息

先调用 `fetchGroupInfoFromServer` 获取最新群详情，再通过 `ChatGroup.messageBlocked` 判断当前用户是否已屏蔽指定群组的消息。

```dart
try {
  final ChatGroup group = await ChatClient.getInstance.groupManager
      .fetchGroupInfoFromServer(groupId);
  final bool messageBlocked = group.messageBlocked ?? false;
} on ChatError catch (e) {
  // 获取失败。
}
```

## 监听群组事件

`ChatGroupManager` 提供群组事件监听接口。应用可以通过 `addEventHandler` 注册监听器，获取群组中的各类事件并更新相关 UI。不再使用监听器时，需要调用 `removeEventHandler` 移除，避免重复回调和内存泄漏。

```dart
const String handlerId = 'group_event_handler';

ChatClient.getInstance.groupManager.addEventHandler(
  handlerId,
  ChatGroupEventHandler(
    // 当前用户收到入群邀请。受邀用户会收到该回调。
    // 例如，用户 B 邀请当前用户入群，则当前用户收到该回调。
    onInvitationReceivedFromGroup:
        (groupId, groupName, inviter, reason) {},

    // 群主或群管理员收到入群申请。群主和所有管理员收到该回调。
    onRequestToJoinReceivedFromGroup:
        (groupId, groupName, applicant, reason) {},

    // 群主或管理员同意用户的入群申请。
    // 申请人、群主和管理员（除操作者外）收到该回调。
    onRequestToJoinAcceptedFromGroup:
        (groupId, groupName, accepter) {},

    // 群主或管理员拒绝用户的入群申请。
    // 申请人、群主和管理员（除操作者外）收到该回调。
    onRequestToJoinDeclinedFromGroup:
        (groupId, groupName, decliner, reason, applicant) {},

    // 用户同意入群邀请。邀请人收到该回调。
    onInvitationAcceptedFromGroup: (groupId, invitee, reason) {},

    // 用户拒绝入群邀请。邀请人收到该回调。
    onInvitationDeclinedFromGroup: (groupId, invitee, reason) {},

    // 有成员被移出群组。被移出的成员收到该回调。
    onUserRemovedFromGroup: (groupId, groupName) {},

    // 群组被解散。群主解散群组时，所有群成员收到该回调。
    onGroupDestroyed: (groupId, groupName) {},

    // 当前用户自动同意入群邀请后收到该回调。
    onAutoAcceptInvitationFromGroup:
        (groupId, inviter, inviteMessage) {},

    // 有成员被加入群禁言列表。
    // 被禁言成员及群主和群管理员（除操作者外）收到该回调。
    onMuteListAddedFromGroup: (groupId, mutes, muteExpire) {},

    // 有成员被移出群禁言列表。
    // 被解除禁言成员及群主和群管理员（除操作者外）收到该回调。
    onMuteListRemovedFromGroup: (groupId, mutes) {},

    // 有成员被加入群白名单。
    // 被添加成员及群主和群管理员（除操作者外）收到该回调。
    onAllowListAddedFromGroup: (groupId, members) {},

    // 有成员被移出群白名单。
    // 被移出成员及群主和群管理员（除操作者外）收到该回调。
    onAllowListRemovedFromGroup: (groupId, members) {},

    // 全员禁言状态变化。群组所有成员（除操作者外）收到该回调。
    onAllGroupMemberMuteStateChanged: (groupId, isAllMuted) {},

    // 设置群管理员。群主、新管理员和其他管理员收到该回调。
    onAdminAddedFromGroup: (groupId, admin) {},

    // 群管理员被移除。
    // 被移除的管理员及群主和群管理员（除操作者外）收到该回调。
    onAdminRemovedFromGroup: (groupId, admin) {},

    // 群主转让权限。群成员收到该回调。
    onOwnerChangedFromGroup: (groupId, newOwner, oldOwner) {},

    // 有新成员加入群组。除新成员外，其他群成员收到该回调。
    onMembersJoinedFromGroup: (groupId, userIds) {},

    // 有成员主动或被动退出群组。
    // 除退出成员外，其他群成员收到该回调。
    onMembersExitedFromGroup: (groupId, userIds) {},

    // 群公告更新。群组所有成员收到该回调。
    onAnnouncementChangedFromGroup: (groupId, announcement) {},

    // 有成员上传了群共享文件。群组所有成员收到该回调。
    onSharedFileAddedFromGroup: (groupId, sharedFile) {},

    // 群共享文件被删除。群组所有成员收到该回调。
    onSharedFileDeletedFromGroup: (groupId, fileId) {},

    // 群组详情变更。群组所有成员收到该回调。
    onSpecificationDidUpdate: (group) {},

    // 群组禁用状态变化。群组所有成员收到该回调。
    onDisableChanged: (groupId, isDisabled) {},

    // 群成员自定义属性变更。群内其他成员收到该回调。
    onAttributesChangedOfGroupMember:
        (groupId, userId, attributes, operatorId) {},

    // 群成员名片变更。群组其他在线成员收到该回调。
    onUserGroupNamecardChanged: (groupId, userId, namecard) {},
  ),
);

// 页面或组件销毁且不再需要监听时调用。
ChatClient.getInstance.groupManager.removeEventHandler(handlerId);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createGroup`](#创建群组) | `ChatGroupManager` | 创建群组。 |
| [`destroyGroup`](#解散群组) | `ChatGroupManager` | 解散群组。 |
| [`addMembers`](#邀请用户入群) / [`inviterUser`](#邀请用户入群) | `ChatGroupManager` | 添加或邀请用户加入群组。 |
| [`acceptInvitation`](#邀请用户入群) / [`declineInvitation`](#邀请用户入群) | `ChatGroupManager` | 接受或拒绝群组邀请。 |
| [`joinPublicGroup`](#用户申请入群) / [`requestToJoinPublicGroup`](#用户申请入群) | `ChatGroupManager` | 直接加入或申请加入公开群。 |
| [`acceptJoinApplication`](#用户申请入群) / [`declineJoinApplication`](#用户申请入群) | `ChatGroupManager` | 同意或拒绝入群申请。 |
| [`leaveGroup`](#主动退出) | `ChatGroupManager` | 主动退出群组。 |
| [`removeMembers`](#移出成员) | `ChatGroupManager` | 将一个或多个成员移出群组。 |
| [`dataSyncType`](#获取当前用户加入的群组列表) | `ChatOptions` | 配置登录后自动同步已加入群组数据。 |
| [`getJoinedGroups`](#获取当前用户加入的群组列表) | `ChatGroupManager` | 从本地获取当前用户已加入的群组列表。 |
| [`fetchJoinedGroupCount`](#查询当前用户已加入的群组数量) | `ChatGroupManager` | 从服务器获取当前用户已加入的群组数量。 |
| [`fetchGroupInfoFromServer`](#检查当前用户是否已屏蔽群消息) | `ChatGroupManager` | 从服务器获取群组详情。 |
| [`messageBlocked`](#检查当前用户是否已屏蔽群消息) | `ChatGroup` | 判断当前用户是否已屏蔽指定群组消息。 |
| [`blockGroup`](#屏蔽群消息) / [`unblockGroup`](#解除屏蔽群消息) | `ChatGroupManager` | 屏蔽或解除屏蔽群消息。 |
