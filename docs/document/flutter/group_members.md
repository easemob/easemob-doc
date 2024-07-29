# 管理群组成员

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM Flutter SDK 在实时互动 app 中实现群组成员管理相关功能。

## 技术原理

环信即时通讯 IM Flutter SDK 提供 `EMGroup`、`EMGroupManager` 和 `EMGroupEventHandler` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

- 群组加人、踢人
- 管理群成员的自定义属性
- 管理群主及群管理员
- 管理群组黑名单
- 管理群组禁言列表
- 开启、关闭群组全员禁言
- 管理群组白名单

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 了解群成员角色，详见 [群组概述](group_overview.html)；
- 了解群组和群成员的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM Flutter SDK 提供的 API 实现上述功能。

### 群组加人

根据创建群组时的群组类型 (`EMGroupStyle`) 和进群邀请是否需要对方同意 (`EMGroupOptions#inviteNeedConfirm`) 设置，群组加人的处理逻辑有差别。具体规则可以参考 [创建群组](group_manage.html#创建群组)。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.addMembers(groupId, members);
} on EMError catch (e) {
}
```

### 群组踢人

1. 仅群主和群管理员可以调用 `EMGroupManager#removeMembers` 方法将单个或多个成员移出群组。
2. 被移出群组后，该成员收到 `EMGroupEventHandler#onUserRemovedFromGroup` 事件，其他群成员收到 `EMGroupEventHandler#onMemberExitedFromGroup` 事件。
3. 被移出群组后，该用户还可以再次加入群组。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.removeMembers(groupId, members);
} on EMError catch (e) {
}
```

### 管理群成员的自定义属性

群成员可设置自定义属性（key-value），例如在群组中的昵称和头像等。

- 单个群成员的自定义属性总长度不能超过 4 KB。对于单个自定义属性，属性 key 不能超过 16 字节，value 不能超过 512 个字节，否则会报错。

- 群主可修改所有群成员的自定义属性，其他群成员只能修改自己的自定义属性。

#### 设置群成员自定义属性

你可以调用 `EMGroupManager#setMemberAttributes` 方法设置指定群成员的自定义属性。自定义属性为 key-value 格式，key 表示属性名称，value 表示属性值，若 value 设置为空字符串即删除该自定义属性。

设置后，群内其他成员会收到 `EMGroupEventHandler#onAttributesChangedOfGroupMember` 事件。

示例代码如下：

```dart
Map<String, String> attributes = {"key": "value"};
try {
  await EMClient.getInstance.groupManager.setMemberAttributes(
    groupId: groupId,
    attributes: attributes,
    userId: userId,
  );
  debugPrint("set member attributes succeed");
} on EMError catch (e) {
  debugPrint("set member attributes failed, code: ${e.code}");
}
```

#### 获取单个群成员的所有自定义属性

你可以调用 `EMGroupManager#fetchMemberAttributes` 方法获取单个群成员的所有自定义属性。

示例代码如下：

```dart
try {
  Map<String, String> attributes =
      await EMClient.getInstance.groupManager.fetchMemberAttributes(
    groupId: groupId,
    userId: userId,
  );
} on EMError catch (e) {
  debugPrint("fetch member attributes failed, e: ${e.code} , ${e.description}");
}
```

#### 根据属性 key 获取多个群成员的自定义属性

你可调用 `EMGroupManager#fetchMembersAttributes` 方法根据指定的属性 key 获取多个群成员的自定义属性。

:::notice
每次最多可获取 10 个群成员的自定义属性。
:::

示例代码如下：

```dart
// keys：要获取自定义属性的 key 的数组。若 keys 为空数组或不传则获取这些成员的所有自定义属性。
try {
  Map<String, Map<String, String>> usersAttributeMaps =
      await EMClient.getInstance.groupManager.fetchMembersAttributes(
    groupId: groupId,
    userIds: userIds,
    keys: keys,
  );
} on EMError catch (e) {
  debugPrint(
      "fetch members attributes failed, e: ${e.code} , ${e.description}");
}
```

### 管理群主和群管理员

#### 变更群主

仅群主可以调用 `EMGroupManager#changeOwner` 方法将权限移交给群组中指定成员。成功移交后，原群主变为普通成员，新群主收到 `EMGroupEventHandler#onOwnerChangedFromGroup` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.changeOwner(groupId, newOwner);
} on EMError catch (e) {
}
```

#### 添加群组管理员

仅群主可以调用 `EMGroupManager#addAdmin` 方法添加群管理员。成功添加后，新管理员及其他管理员收到 `EMGroupEventHandler#onAdminAddedFromGroup` 事件。

示例代码如下：

```dart
try {
  EMClient.getInstance.groupManager.addAdmin(groupId, memberId);
} on EMError catch (e) {
}
```

#### 移除群组管理员权限

仅群主可以调用 `EMGroupManager#removeAdmin` 方法移除群管理员的管理权限。成功移除后，被移除的管理员及其他管理员收到 `EMGroupEventHandler#onAdminRemovedFromGroup` 事件。群组管理员的管理权限被移除后，将只拥有群成员的权限。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.removeAdmin(groupId, adminId);
} on EMError catch (e) {
}
```

### 管理群组黑名单

#### 将成员加入群组黑名单

仅群主和群管理员可以调用 `EMGroupManager#blockMembers` 方法将指定成员添加至黑名单。被加入黑名单后，该成员收到 `EMGroupEventHandler#onUserRemovedFromGroup` 事件。其他群成员会收到该成员退出群组的回调，如需该回调，请联系商务开通。被加入黑名单后，该成员无法再收发群组消息并被移出群组，黑名单中的成员如想再次加入群组，群主或群管理员必须先将其移除黑名单。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.blockMembers(groupId, members);
} on EMError catch (e) {
}
```

#### 将成员移出群组黑名单

仅群主和群管理员可以调用 `EMGroupManager#unblockMembers` 方法将成员移出群组黑名单。指定用户被群主或者群管理员移出群黑名单后，可以再次申请加入群组。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.unblockMembers(groupId, blockIds);
} on EMError catch (e) {
}
```

#### 获取群组的黑名单用户列表

仅群主和群管理员可以调用 `EMGroupManager#fetchBlockListFromServer` 方法获取当前群组的黑名单。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.fetchBlockListFromServer(
    groupId,
    pageNum: pageNum,
    pageSize: pageSize,
  );
} on EMError catch (e) {
}
```

### 管理群组禁言列表

#### 将成员加入群组禁言列表

仅群主和群管理员可以调用 `EMGroupManager#muteMembers` 方法将指定成员添加至群组禁言列表。被禁言后，该成员和其他未操作的管理员或者群主收到 `EMGroupEventHandler#onMuteListAddedFromGroup` 事件。群成员被加入群禁言列表后，不能在该群组中发言，即使被加入群白名单也不能发言。

示例代码如下：

```dart
// duration：禁言时间。若传 -1，表示永久禁言。
try {
  await EMClient.getInstance.groupManager.muteMembers(
    groupId,
    members,
  );
} on EMError catch (e) {
}
```

#### 将成员移出群组禁言列表

仅群主和群管理员可以调用 `EMGroupManager#unMuteMembers` 方法将指定成员移出群组禁言列表。被解除禁言后，该成员和其他未做操作的群管理员或者群主收到 `EMGroupEventHandler#onMuteListRemovedFromGroup` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.unMuteMembers(
    groupId,
    members,
  );
} on EMError catch (e) {
}
```

#### 获取群组禁言列表

仅群主和群管理员可以调用 `EMGroupManager#fetchMuteListFromServer` 方法从服务器获取当前群组的禁言列表。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.fetchMuteListFromServer(
    groupId,
    pageNum: pageNum,
    pageSize: pageSize,
  );
} on EMError catch (e) {
}
```

### 开启和关闭全员禁言

#### 开启全员禁言

仅群主和群管理员可以调用 `EMGroupManager#muteAllMembers` 方法开启全员禁言。群组中的所有成员都会收到 `EMGroupEventHandler#onAllGroupMemberMuteStateChanged` 事件。

全员禁言开启后不会在一段时间内自动解除禁言，需要调用 `EMGroupManager#unMuteAllMembers` 方法解除禁言。

群组全员禁言开启后，除了在白名单中的群成员，其他成员不能发言。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.muteAllMembers(
    groupId,
  );
} on EMError catch (e) {
}
```

#### 关闭全员禁言

仅群主和群管理员可以调用 `EMGroupManager#unMuteAllMembers` 方法取消全员禁言，示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.unMuteAllMembers(
    groupId,
  );
} on EMError catch (e) {
}
```

### 管理群组白名单

群主和群组中的管理员默认会被加入群组白名单。

#### 将成员加入群组白名单

仅群主和群管理员可以调用 `EMGroupManager#addAllowList` 方法将指定群成员加入群白名单。白名单用户不受全员禁言的限制，但是如果白名单用户在群禁言列表中，则该用户不能发言。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.addAllowList(
    groupId,
    members,
  );
} on EMError catch (e) {
}
```

#### 将成员移出群组白名单

仅群主和群管理员可以调用 `EMGroupManager#removeAllowList` 方法将指定群成员移出群白名单。

示例代码如下：

```dart
try {
  await EMClient.getInstance.groupManager.removeAllowList(
    groupId,
    members,
  );
} on EMError catch (e) {
}
```

#### 检查自己是否在白名单中

所有群成员可以调用 `EMGroupManager#isMemberInAllowListFromServer` 方法检查自己是否在群白名单中，示例代码如下：

```dart
try {
  bool check = await EMClient.getInstance.groupManager.isMemberInAllowListFromServer(
    groupId,
  );
} on EMError catch (e) {
}
```

#### 获取群组白名单

仅群主和群管理员可以调用 `EMGroupManager#fetchAllowListFromServer` 方法从服务器获取当前群组的白名单。

示例代码如下：

```dart
try {
  List<String>? list =
      await EMClient.getInstance.groupManager.fetchAllowListFromServer(
    groupId,
  );
} on EMError catch (e) {
}
```

### 监听群组事件

详见 [监听群组事件](group_manage.html#监听群组事件)。