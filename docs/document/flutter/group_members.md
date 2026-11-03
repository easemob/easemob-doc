# 群组成员管理

## 功能说明

群组是支持多人实时沟通的即时通讯场景。本文介绍如何使用 Flutter SDK 管理群组成员，包括查询成员列表、管理成员自定义属性、群主和管理员、白名单、黑名单及禁言等功能。用户入群、退出和移出群组的操作详见 [创建和管理群组](group_manage.html#加入群组)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 [SDK 初始化](initialization.html) 并 [登录成功](login.html)。
- 已了解群成员角色及其权限，详见 [群组概述](group_overview.html)。
- 已了解群成员数量、接口调用频率和群成员属性大小等限制，详见[使用限制](/product/limitation.html)。

## 获取群成员列表

可通过三种方式获取群成员列表：

- 分页获取群成员信息：通过 `ChatGroupManager#fetchGroupMembersInfo` 从服务器分页获取成员详情。
- 分页获取群成员 ID：通过 `fetchMemberListFromServer` 从服务器分页获取成员 ID。
- 从本地群组对象获取成员 ID：通过 `ChatGroup.memberList` 读取已获取的 `ChatGroup` 对象中的成员 ID。

### 分页获取群成员信息

调用 `ChatGroupManager#fetchGroupMembersInfo` 分页获取群成员信息，返回的成员信息包括群成员的用户 ID、角色、入群时间、群名片、昵称和头像。

```dart
try {
  // cursor：首次请求传 null；后续请求传入上一次结果中的游标。
  final ChatCursorResult<GroupMemberInfo> result =
      await ChatClient.getInstance.groupManager.fetchGroupMembersInfo(
    groupId: groupId,
    cursor: cursor,
    // 每页期望返回的群成员数量，上限取决于服务端。
    limit: 50,
  );

  final List<GroupMemberInfo> members = result.data;
  final String? nextCursor = result.cursor;

  for (final GroupMemberInfo member in members) {
    final String userId = member.userId;
    final int joinedAt = member.joinedTs;
    final ChatGroupPermissionType role = member.role;
    final String? namecard = member.namecard;
    final String? nickname = member.nickname;
    final String? avatarUrl = member.avatarUrl;
  }
} on ChatError catch (e) {
  // 获取失败，根据错误码和错误信息处理。
}
```

`GroupMemberInfo` 的主要属性如下：

| API | 返回值 | 描述 |
| :--- | :--- | :--- |
| `userId` | `String` | 获取群成员的用户 ID。 |
| `joinedTs` | `int` | 获取入群时间，Unix 时间戳，单位为毫秒。 |
| `role` | `ChatGroupPermissionType` | 获取成员角色：`Owner`、`Admin`、`Member` 或 `None`。 |
| `namecard` | `String?` | 获取群成员名片。 |
| `nickname` | `String?` | 获取群成员昵称。 |
| `avatarUrl` | `String?` | 获取群成员头像 URL。 |

### 分页获取群成员 ID

如果只需要群成员用户 ID，也可以调用 `fetchMemberListFromServer` 分页获取：

```dart
try {
  final ChatCursorResult<String> result =
      await ChatClient.getInstance.groupManager.fetchMemberListFromServer(
    groupId,
    cursor: cursor,
    pageSize: 50,
  );
  final List<String> userIds = result.data;
  final String? nextCursor = result.cursor;
} on ChatError catch (e) {
  // 获取失败。
}
```

### 从本地群组对象获取成员 ID

如已获取 `ChatGroup` 对象，可读取 `ChatGroup.memberList` 获取该对象当前包含的成员用户 ID。若需要完整且最新的成员列表，应使用上述服务端分页接口。

```dart
final List<String> userIds = group.memberList ?? <String>[];
```

## 管理群成员自定义属性

群成员自定义属性是群组维度的成员信息，适用于业务标签等场景，采用字符串 key-value 结构。

- 单个群成员的自定义属性总长度不能超过 4 KB。
- 单个属性的 key 不能超过 16 字节，value 不能超过 512 字节。
- 群主可以修改所有群成员的属性，其他群成员只能修改自己的属性。

### 设置群成员的自定义属性

调用 `ChatGroupManager#setMemberAttributes` 设置指定成员的属性。将某个 key 对应的 value 设置为空字符串表示删除该属性。设置成功后，群内其他成员会收到 `ChatGroupEventHandler#onAttributesChangedOfGroupMember` 回调。

```dart
try {
  await ChatClient.getInstance.groupManager.setMemberAttributes(
    groupId: groupId,
    userId: userId,
    attributes: const <String, String>{
      'department': 'product',
      'roleTag': 'speaker',
    },
  );
} on ChatError catch (e) {
  // 设置失败。
}
```

### 按 key 删除群成员自定义属性

你可以调用 `removeMemberAttributes` 按 key 删除群成员自定义属性：

```dart
await ChatClient.getInstance.groupManager.removeMemberAttributes(
  groupId: groupId,
  userId: userId,
  keys: const <String>['roleTag'],
);
```

### 获取单个群成员的自定义属性

调用 `ChatGroupManager#fetchMemberAttributes` 获取指定群成员的全部自定义属性，成功时返回该成员的属性键值对。若 `userId` 不传，则获取当前登录用户自己的属性。

```dart
try {
  final Map<String, String> attributes =
      await ChatClient.getInstance.groupManager.fetchMemberAttributes(
    groupId: groupId,
    userId: userId,
  );
} on ChatError catch (e) {
  // 获取失败。
}
```

### 根据属性 key 获取群成员自定义属性

调用 `ChatGroupManager#fetchMembersAttributes` 可以按属性 key 批量获取多个群成员的属性。`keys` 不传或传空列表时，返回这些成员的全部属性。

:::tip
每次最多可获取 10 个群成员的自定义属性。
:::

```dart
try {
  final Map<String, Map<String, String>> result =
      await ChatClient.getInstance.groupManager.fetchMembersAttributes(
    groupId: groupId,
    userIds: const <String>['user1', 'user2'],
    keys: const <String>['department', 'roleTag'],
  );
} on ChatError catch (e) {
  // 获取失败。
}
```

## 管理群主和群管理员

### 变更群主

仅群主可以调用 `ChatGroupManager#changeOwner` 将群所有权转让给指定群成员。转让成功后，原群主变为普通成员，新群主拥有群主权限，群成员会收到 `onOwnerChangedFromGroup` 回调。

```dart
try {
  await ChatClient.getInstance.groupManager.changeOwner(groupId, newOwner);
} on ChatError catch (e) {
  // 转让失败。
}
```

### 添加群管理员

仅群主可以调用 `ChatGroupManager#addAdmin` 添加群管理员。添加成功后，新管理员、群主及其他管理员会收到 `onAdminAddedFromGroup` 回调。

管理员除了不能解散群组等少数权限外，拥有对群组的绝大部分管理权限。

```dart
try {
  await ChatClient.getInstance.groupManager.addAdmin(groupId, userId);
} on ChatError catch (e) {
  // 添加失败。
}
```

### 移除群管理员

仅群主可以调用 `ChatGroupManager#removeAdmin` 移除群管理员。移除成功后，被移除的管理员、群主及其他管理员会收到 `onAdminRemovedFromGroup` 回调。

群管理员被移除群管理权限后将只拥有普通群成员的权限。

```dart
try {
  await ChatClient.getInstance.groupManager.removeAdmin(groupId, userId);
} on ChatError catch (e) {
  // 移除失败。
}
```

### 获取群管理员列表

通过 `ChatGroup.adminList` 获取群组管理员列表。若需要最新数据，应先调用 [获取群组详情的方法 `fetchGroupInfoFromServer`](group_attributes.html#获取群组详情) 刷新群详情。

```dart
final ChatGroup group = await ChatClient.getInstance.groupManager
    .fetchGroupInfoFromServer(groupId);
final List<String> adminList = group.adminList ?? <String>[];
```

## 管理群组白名单

群组白名单用于控制全员禁言场景下仍可发言的成员。群主和群管理员默认属于白名单。

:::tip
全员禁言和单独禁言相互独立。全员禁言时，白名单成员仍可发送群消息；如果该成员同时被单独禁言，则单独禁言优先，该成员仍不能发送群消息。
:::

### 添加成员到白名单

仅群主或群管理员可以调用 `ChatGroupManager#addAllowList` 将指定成员加入群白名单。添加成功后，该成员以及群主和群管理员（除操作者外）会收到 `onAllowListAddedFromGroup` 回调。

即使开启了全员禁言，白名单中的成员仍可发送群消息；但如果某个成员同时在禁言列表中，则无法发送群消息。

```dart
try {
  await ChatClient.getInstance.groupManager.addAllowList(
    groupId,
    const <String>['user1', 'user2'],
  );
} on ChatError catch (e) {
  // 添加失败。
}
```

### 从白名单移除成员

仅群主或群管理员可以调用 `ChatGroupManager#removeAllowList` 将指定成员移出群白名单。移除后，该成员以及群主和群管理员（除操作者外）会收到 `onAllowListRemovedFromGroup` 回调。

```dart
try {
  await ChatClient.getInstance.groupManager.removeAllowList(
    groupId,
    members,
  );
} on ChatError catch (e) {
  // 移除失败。
}
```

### 查询当前用户是否在白名单中

所有群成员均可调用 `ChatGroupManager#isMemberInAllowListFromServer` 查询当前登录用户是否在群白名单中。

```dart
try {
  final bool inAllowList = await ChatClient.getInstance.groupManager
      .isMemberInAllowListFromServer(groupId);
} on ChatError catch (e) {
  // 查询失败。
}
```

### 获取白名单列表

仅群主或群管理员可以调用 `ChatGroupManager#fetchAllowListFromServer` 从服务器获取当前群组的白名单。

```dart
try {
  final List<String> members = await ChatClient.getInstance.groupManager
      .fetchAllowListFromServer(groupId);
} on ChatError catch (e) {
  // 获取失败。
}
```

## 管理群组黑名单

群组黑名单用于禁止指定用户加入或继续留在群组。成员被加入黑名单后会被移出群组，无法继续收发该群消息；只有先从黑名单中移除，才可再次申请或被邀请加入。

### 添加成员到黑名单

仅群主或群管理员可以调用 `ChatGroupManager#blockMembers` 将一个或多个成员加入群黑名单。被加入黑名单的成员会收到 `onUserRemovedFromGroup` 回调。默认情况下，其他群成员不会收到事件通知。如需该事件，请联系商务开通。

黑名单中的成员会被移出群组，无法再收发群消息，只有先被移出黑名单才能重新加入群组。

```dart
try {
  await ChatClient.getInstance.groupManager.blockMembers(
    groupId,
    const <String>['user1', 'user2'],
  );
} on ChatError catch (e) {
  // 添加失败。
}
```

### 从黑名单移除成员

仅群主或群管理员可以调用 `ChatGroupManager#unblockMembers` 将一个或多个用户移出群黑名单。移除后，用户可以再次申请或被邀请加入群组。

```dart
try {
  await ChatClient.getInstance.groupManager.unblockMembers(groupId, members);
} on ChatError catch (e) {
  // 移除失败。
}
```

### 获取黑名单列表

仅群主或群管理员可以调用 `ChatGroupManager#fetchBlockListFromServer` 分页获取黑名单成员列表。

```dart
try {
  final List<String> members = await ChatClient.getInstance.groupManager
      .fetchBlockListFromServer(
    groupId,
    pageNum: 1,
    pageSize: 20,
  );
} on ChatError catch (e) {
  // 获取失败。
}
```

## 管理群组禁言

群主和管理员可以对群成员单独禁言，也可以对全员禁言。这两种禁言方式相互独立，互不影响：

- 单独禁言：将指定用户加入禁言列表。被禁言成员不能发送群消息。禁言时长的单位为毫秒。
- 全员禁言：一键禁言群组所有成员。白名单成员可发言；若成员同时被单独禁言，则单独禁言优先，禁止发言。
- 开启或关闭全员禁言不会影响单个成员的禁言列表。

### 禁言指定成员

仅群主或群管理员可以调用 `ChatGroupManager#muteMembers` 禁言指定成员。加入禁言列表后，被禁言成员、群管理员和群主（除操作者外）会收到 `onMuteListAddedFromGroup` 回调。

```dart
try {
  await ChatClient.getInstance.groupManager.muteMembers(
    groupId,
    const <String>['user1', 'user2'],
    // 单位为毫秒，-1 表示永久禁言。
    duration: 60 * 60 * 1000,
  );
} on ChatError catch (e) {
  // 禁言失败。
}
```

### 解除指定成员禁言

仅群主或群管理员可以调用 `ChatGroupManager#unMuteMembers` 解除指定成员禁言。解除后，被解除禁言的成员、群管理员和群主（除操作者外）会收到 `onMuteListRemovedFromGroup` 回调。

```dart
try {
  await ChatClient.getInstance.groupManager.unMuteMembers(groupId, members);
} on ChatError catch (e) {
  // 解除失败。
}
```

### 查询当前用户是否被禁言

群成员可以调用 `ChatGroupManager#isMemberInGroupMuteList` 查询当前登录用户是否在群禁言列表中。

```dart
try {
  final bool muted = await ChatClient.getInstance.groupManager
      .isMemberInGroupMuteList(groupId);
} on ChatError catch (e) {
  // 查询失败。
}
```

### 获取禁言列表

仅群主或群管理员可以调用 `ChatGroupManager#fetchMuteListFromServer` 分页获取禁言列表。返回 `Map` 的 key 为成员 ID，value 为禁言时长，单位为毫秒。

```dart
try {
  final Map<String, int> muteList = await ChatClient.getInstance.groupManager
      .fetchMuteListFromServer(
    groupId,
    pageNum: 1,
    pageSize: 20,
  );
} on ChatError catch (e) {
  // 获取失败。
}
```

### 开启全员禁言

仅群主或群管理员可以调用 `ChatGroupManager#muteAllMembers` 开启全员禁言。开启后，群成员会收到 `onAllGroupMemberMuteStateChanged` 回调。除白名单成员外，其他成员将无法发送群消息。

全员禁言不会自动到期，如要关闭需主动调用关闭接口。

```dart
try {
  await ChatClient.getInstance.groupManager.muteAllMembers(groupId);
} on ChatError catch (e) {
  // 开启失败。
}
```

### 关闭全员禁言

仅群主或群管理员可以调用 `ChatGroupManager#unMuteAllMembers` 关闭全员禁言。关闭后，群成员会收到 `onAllGroupMemberMuteStateChanged` 回调。

```dart
try {
  await ChatClient.getInstance.groupManager.unMuteAllMembers(groupId);
} on ChatError catch (e) {
  // 关闭失败。
}
```

## 监听群组成员事件

群组成员相关操作成功后，SDK 会触发对应的 `ChatGroupEventHandler` 回调。监听器的注册、移除及完整事件说明详见 [监听群组事件](group_manage.html#监听群组事件)。

## 注意事项

- `groupId`、`userId` 和成员列表不能为空；参数无效时，SDK 会抛出 `ChatError`。
- `fetchGroupMembersInfo` 和 `fetchMemberListFromServer` 使用游标分页；禁言列表和黑名单使用页码分页，页码从 `1` 开始。
- `muteMembers` 的禁言时长单位为毫秒，`-1` 表示永久禁言。
- `isMemberInAllowListFromServer` 和 `isMemberInGroupMuteList` 仅查询当前登录用户自身的状态，不能指定其他用户。
- 管理员、白名单、黑名单和禁言操作要求当前用户具备相应权限；其中 Flutter 5.0.0 对 `blockMembers`、`unblockMembers` 和 `removeMembers` 的公开说明限定由群主调用。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchGroupMembersInfo`](#分页获取群成员信息) | `ChatGroupManager` | 分页获取包含角色、入群时间和资料的群成员信息。 |
| [`fetchMemberListFromServer`](#分页获取群成员-id) | `ChatGroupManager` | 分页获取群成员用户 ID。 |
| [`memberList`](#从本地群组对象获取成员-id) | `ChatGroup` | 获取群组对象中已包含的成员用户 ID 列表。 |
| [`setMemberAttributes`](#设置群成员的自定义属性) | `ChatGroupManager` | 设置群成员自定义属性。 |
| [`removeMemberAttributes`](#按-key-删除群成员自定义属性) | `ChatGroupManager` | 删除群成员自定义属性。 |
| [`fetchMemberAttributes`](#获取单个群成员的自定义属性) | `ChatGroupManager` | 获取单个群成员的全部自定义属性。 |
| [`fetchMembersAttributes`](#根据属性-key-获取群成员自定义属性) | `ChatGroupManager` | 获取多个群成员的指定或全部自定义属性。 |
| [`changeOwner`](#变更群主) | `ChatGroupManager` | 转让群主权限。 |
| [`addAdmin`](#添加群管理员) / [`removeAdmin`](#移除群管理员) | `ChatGroupManager` | 添加或移除群管理员。 |
| [`fetchGroupInfoFromServer`](#获取群管理员列表) | `ChatGroupManager` | 从服务器获取最新群详情。 |
| [`adminList`](#获取群管理员列表) | `ChatGroup` | 获取群管理员列表。 |
| [`addAllowList`](#添加成员到白名单) / [`removeAllowList`](#从白名单移除成员) | `ChatGroupManager` | 添加或移除群白名单成员。 |
| [`isMemberInAllowListFromServer`](#查询当前用户是否在白名单中) / [`fetchAllowListFromServer`](#获取白名单列表) | `ChatGroupManager` | 查询当前用户是否在白名单中或获取白名单。 |
| [`blockMembers`](#添加成员到黑名单) / [`unblockMembers`](#从黑名单移除成员) | `ChatGroupManager` | 添加或移除群黑名单成员。 |
| [`fetchBlockListFromServer`](#获取黑名单列表) | `ChatGroupManager` | 分页获取群黑名单。 |
| [`muteMembers`](#禁言指定成员) / [`unMuteMembers`](#解除指定成员禁言) | `ChatGroupManager` | 禁言或解除禁言指定成员。 |
| [`isMemberInGroupMuteList`](#查询当前用户是否被禁言) / [`fetchMuteListFromServer`](#获取禁言列表) | `ChatGroupManager` | 查询当前用户是否被禁言或分页获取禁言列表。 |
| [`muteAllMembers`](#开启全员禁言) / [`unMuteAllMembers`](#关闭全员禁言) | `ChatGroupManager` | 开启或关闭全员禁言。 |
