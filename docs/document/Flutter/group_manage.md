# 管理群组

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理群组，并实现群组相关功能。

如需查看消息相关内容，参见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM Flutter SDK 提供 `EMGroup`、`EMGroupManager` 和 `EMGroupEventHandler` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

- 创建、解散群组
- 加入、退出群组
- 获取群组详情
- 获取群成员列表
- 获取群组列表
- 屏蔽、解除屏蔽群消息
- 监听群组事件

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 了解群组和群成员的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM Flutter SDK 提供的 API 实现上述功能。

### 创建群组

在创建群组前，你需要设置群组类型 (`EMGroupStyle`) 和进群邀请是否需要对方同意 (`inviteNeedConfirm`)。

1. 私有群不可被搜索到，公开群可以通过 ID 搜索到。目前支持四种群组类型 (`GroupStyle`) ，具体设置如下：
    - `PrivateOnlyOwnerInvite` —— 私有群，只有群主和管理员可以邀请人进群；
    - `PrivateMemberCanInvite` —— 私有群，所有群成员均可以邀请人进群；
    - `PublicJoinNeedApproval` —— 公开群，加入此群除了群主和管理员邀请，只能通过申请加入此群；
    - `PublicOpenJoin` —— 公开群，任何人都可以进群，无需群主和群管理同意。
2. 进群邀请是否需要对方同意 (`inviteNeedConfirm`) 的具体设置如下：
    - 进群邀请需要用户确认 (`EMGroupOptions#inviteNeedConfirm` 设置为 `true`)。创建群组并发出邀请后，根据受邀用户的 `EMOptions#autoAcceptGroupInvitation` 设置，处理逻辑如下：
        - 用户设置手动确认群组邀请 (`EMOptions#autoAcceptGroupInvitation` 设置为 `false`)。受邀用户收到 `EMGroupEventHandler#onInvitationReceivedFromGroup` 回调，并选择同意或拒绝入群邀请：
            - 用户同意入群邀请后，群主收到 `EMGroupEventHandler#onInvitationAcceptedFromGroup` 回调和 `EMGroupEventHandler#onMemberJoinedFromGroup` 回调，其他群成员收到 `EMGroupEventHandler#onMemberJoinedFromGroup` 回调；
            - 用户拒绝入群邀请后，群主收到 `EMGroupEventHandler#onInvitationDeclinedFromGroup` 回调。
    - 进群邀请无需用户确认 (`EMGroupOptions.inviteNeedConfirm` 设置为 `false`)。创建群组并发出邀请后，无视用户的 `EMOptions#autoAcceptGroupInvitation` 设置，受邀用户直接进群。用户收到`EMGroupEventHandler#onAutoAcceptInvitationFromGroup` 回调，群主收到每个加入成员的 `EMGroupEventHandler#onInvitationAcceptedFromGroup` 回调和 `EMGroupEventHandler#onMemberJoinedFromGroup` 回调。
  
用户可以调用 `EMGroupManager#createGroup` 方法创建群组，并通过 `EMGroupOptions` 参数设置群组名称、群组描述、群组成员和建群原因。

示例代码如下：

```dart
EMGroupOptions groupOptions = EMGroupOptions(
  style: EMGroupStyle.PrivateMemberCanInvite,
  inviteNeedConfirm: true,
);

String groupName = "newGroup";
String groupDesc = "group desc";
try {
  await EMClient.getInstance.groupManager.createGroup(
    groupName: groupName,
    desc: groupDesc,
    options: groupOptions,
  );
} on EMError catch (e) {
}
```

### 用户申请入群

根据 [创建群组](#创建群组) 时的群组类型 (`GroupStyle`) 设置，加入群组的处理逻辑差别如下：

- 当群组类型为 `PublicOpenJoin` 时，用户可以直接加入群组，无需群主或群管理员同意，加入群组后，其他群成员收到 `EMGroupEventHandler#onMemberJoinedFromGroup` 回调；
- 当群组类型为 `PublicJoinNeedApproval` 时，用户可以申请进群，群主或群管理员收到 `EMGroupEventHandler#onRequestToJoinReceivedFromGroup` 回调，并选择同意或拒绝入群申请：
    - 群主或群管理员同意入群申请，申请人收到 `EMGroupEventHandler#onRequestToJoinAcceptedFromGroup` 回调，其他群成员收到`EMGroupEventHandler#onMemberJoinedFromGroup` 回调；
    - 群主或群管理员拒绝入群申请，申请人收到 `EMGroupEventHandler#onRequestToJoinDeclinedFromGroup` 回调。

:::notice
用户只能申请加入公开群组，私有群组不支持用户申请入群。
:::

用户申请加入群组的步骤如下：

1. 调用 `EMGroupManager#fetchPublicGroupsFromServer` 方法从服务器获取公开群列表，查询到想要加入的群组 ID。
2. 调用 `EMGroupManager#joinPublicGroup` 方法传入群组 ID，申请加入对应群组。

示例代码如下：

```dart
// 获取公开群组列表
try {
  EMCursorResult<EMGroupInfo> result =
      await EMClient.getInstance.groupManager.fetchPublicGroupsFromServer();
} on EMError catch (e) {
}

// 申请加入群组
try {
  await EMClient.getInstance.groupManager.joinPublicGroup(groupId);
} on EMError catch (e) {
}
```

### 解散群组

仅群主可以调用 `DestroyGroup` 方法解散群组。群组解散时，其他群组成员收到 `OnDestroyedFromGroup` 回调并被踢出群组。

:::notice
解散群组后，将删除本地数据库及内存中的群相关信息及群会话，谨慎操作。
:::

示例代码如下：

```dart
SDKClient.Instance.GroupManager.DestroyGroup(groupId, new CallBack(
  onSuccess: () =>
  {
  },
  onError: (code, desc) =>
  {
  }
));
```

### 退出群组

群成员可以调用 `LeaveGroup` 方法退出群组，其他成员收到 `EMGroupEventHandler#onMemberExitedFromGroup` 回调。退出群组后，该用户将不再收到群消息。群主不能调用该接口退出群组，只能调用 [`DestroyGroup`](#解散群组) 解散群组。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.leaveGroup(groupId);
} on EMError catch (e) {
}
```

### 获取群组详情

群成员可以调用 `EMGroupManager#getGroupWithId` 方法从内存获取群组详情。返回结果包括：群组 ID、群组名称、群组描述、群组基本属性、群主、群组管理员列表，默认不包含群成员。

群成员也可以调用 `EMGroupManager#fetchGroupInfoFromServer` 方法从服务器获取群组详情。返回结果包括：群组 ID、群组名称、群组描述、群主、群组管理员列表以及群成员列表。

示例代码如下：

```dart
// 从本地获取群组
try {
  EMGroup? group = await EMClient.getInstance.groupManager.getGroupWithId(groupId);
} on EMError catch (e) {
}

// 从服务器获取群组详情
try {
  EMGroup group = await EMClient.getInstance.groupManager.fetchGroupInfoFromServer(groupId);
} on EMError catch (e) {
}
```

### 获取群成员列表

群成员可以调用 `EMGroupManager#fetchMemberListFromServer` 方法从服务器分页获取群成员列表。

示例代码如下：

```dart
try {
  EMCursorResult<String> result =
      await EMClient.getInstance.groupManager.fetchMemberListFromServer(
    groupId,
  );
} on EMError catch (e) {
}
```

### 获取群组列表

用户可以调用 `EMGroupManager#fetchJoinedGroupsFromServer` 方法从服务器获取自己加入和创建的群组列表。示例代码如下：

```dart
try {
  List<EMGroup> list =
      await EMClient.getInstance.groupManager.fetchJoinedGroupsFromServer();
} on EMError catch (e) {
}
```

用户可以调用 `EMGroupManager#getJoinedGroups` 方法加载本地群组列表。为了保证数据的正确性，需要先从服务器获取自己加入和创建的群组列表。示例代码如下：

```dart
try {
  List<EMGroup> list =
      await EMClient.getInstance.groupManager.getJoinedGroups();
} on EMError catch (e) {
}
```

用户还可以调用 `EMGroupManager#fetchPublicGroupsFromServer` 方法从服务器分页获取公开群组列表。示例代码如下：

```dart
try {
  EMCursorResult<EMGroupInfo> result =
      await EMClient.getInstance.groupManager.fetchPublicGroupsFromServer(
    pageSize: pageSize,
    cursor: cursor,
  );
} on EMError catch (e) {
}
```

### 屏蔽和解除屏蔽群消息

#### 屏蔽群消息

群成员可以调用 `EMGroupManager#blockGroup` 方法屏蔽群消息。屏蔽群消息后，该成员不再从指定群组接收群消息，群主和群管理员不能进行此操作。示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.blockGroup(groupId);
} on EMError catch (e) {
}
```

#### 解除屏蔽群消息

群成员可以调用 `EMGroupManager#unblockGroup` 方法解除屏蔽群消息。示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.unblockGroup(groupId);
} on EMError catch (e) {
}
```

#### 检查自己是否已经屏蔽群消息

群成员可以调用 `EMGroupManager#fetchGroupInfoFromServer` 方法并通过 `EMGroup#messageBlocked` 字段检查自己是否屏蔽了群消息。

示例代码如下：

```dart
// 获取群组详情
try {
  EMGroup group = await EMClient.getInstance.groupManager
      .fetchGroupInfoFromServer(groupId);
  // 检查用户是否屏蔽了该群的群消息
  if (group.messageBlocked == true) {

  }
} on EMError catch (e) {
}
```

### 监听群组事件

`EMGroupEventHandler` 类中提供群组事件的监听接口。开发者可以通过设置此监听，获取群组中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```dart
class _GroupPageState extends State<GroupPage> {
  @override
  void initState() {
    // 注册群组监听
    EMClient.getInstance.groupManager.addEventHandler("UNIQUE_HANDLER_ID", EMGroupEventHandler());
    super.initState();
  }

  @override
  void dispose() {
    // 移除群组监听
    EMClient.getInstance.groupManager.removeEventHandler("UNIQUE_HANDLER_ID");
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```