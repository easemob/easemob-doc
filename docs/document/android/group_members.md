# 管理群组成员

<Toc />

群组是支持多人沟通的即时通讯系统，本文指导你如何使用环信即时通讯 IM SDK 在实时互动 app 中实现群组成员管理相关功能。

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMGroupManager` 类和 `EMGroup` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

- 群组加人、踢人
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

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 群组加人

根据创建群组时的群组类型 (`EMGroupStyle`) 和进群邀请是否需要对方同意 (`EMGroupOptions#inviteNeedConfirm`) 设置，群组加人的处理逻辑有差别。具体规则可以参考 [创建群组](group_manage.html#创建群组)。

示例代码如下：

- 群主加人：

```java
// 群主或群组管理员添加群组成员
// 同步方法，会阻塞当前线程。异步方法见 {@link #asyncAddUsersToGroup(String, String[], EMCallBack)}。
EMClient.getInstance().groupManager().addUsersToGroup(groupId, newmembers);
```

- 私有群成员邀请用户入群：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncInviteUser(String, String[], String, EMCallBack)}。
EMClient.getInstance().groupManager().inviteUser(groupId, newmembers, null);
```

### 群组踢人

仅群主和群管理员可以调用 `removeUserFromGroup` 方法将指定成员移出群组。被踢出群组后，被踢群成员将会收到群组事件回调 `EMGroupChangeListener#onUserRemoved`，其他成员将会收到回调 `EMGroupChangeListener#onMemberExited`。被移出群组后，该用户还可以再次加入群组。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncRemoveUserFromGroup(String, String, EMCallBack)}。
EMClient.getInstance().groupManager().removeUserFromGroup(groupId, username);
```

### 管理群主和群管理员

#### 变更群主

仅群主可以调用 `changeOwner` 方法将权限移交给群组中指定成员。成功移交后，原群主变为普通成员，其他群组成员收到 `EMGroupChangeListener#onOwnerChanged` 回调。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncChangeOwner(String, String, EMValueCallBack)}。
EMClient.getInstance().groupManager().changeOwner(groupId, newOwner);
```

#### 添加群组管理员

仅群主可以调用 `addGroupAdmin` 方法添加群管理员。成功添加后，新管理员及其他管理员收到 `EMGroupChangeListener#onAdminAdded` 回调。

管理员除了不能散群组等少数权限外，拥有对群组的绝大部分权限。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncAddGroupAdmin(String, String, EMValueCallBack)}。
EMClient.getInstance().groupManager().addGroupAdmin(groupId, admin);
```

#### 移除群组管理员权限

仅群主可以调用 `RemoveGroupAdmin` 方法移除群管理员。成功移除后，被移除的管理员及其他管理员收到 `EMGroupChangeListener#onAdminRemoved` 回调。

群主移除指定群管理员的权限后，将只拥有群成员的权限。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncRemoveGroupAdmin(String, String, EMValueCallBack)}。
EMClient.getInstance().groupManager().removeGroupAdmin(groupId, admin);
```

### 获取群管理员列表

获取群管理员列表示例如下：

```java
// 获取内存中管理员列表。
List<String> adminList = group.getAdminList();
```

或者也可以用 [获取群组详情](group_manage.html#获取群组详情) 获取群组管理员列表。

### 管理群组黑名单

#### 将成员加入群组黑名单

仅群主和群管理员可以调用 `BlockGroupMembers` 方法将指定成员添加至黑名单。被加入黑名单后，该成员收到 `EMGroupChangeListener#OnUserRemovedFromGroup` 回调。其他群成员会收到该成员退出群组的回调，如需该回调，请联系商务开通。被加入黑名单后，该成员无法再收发群组消息并被移出群组，黑名单中的成员如想再次加入群组，群主或群管理员必须先将其移除黑名单。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncBlockUser(String, String, EMCallBack)}。
EMClient.getInstance().groupManager().blockUser(groupId, username);
```

#### 将成员移出群组黑名单

仅群主和群管理员可以调用 `unblockUser` 方法将成员移出群组黑名单。指定用户被群主或者群管理员移出群黑名单后，可以再次申请加入群组。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncUnblockUser(String, String, EMCallBack)}。
EMClient.getInstance().groupManager().unblockUser(groupId, username);
```

#### 获取群组的黑名单用户列表

仅群主和群管理员可以调用 `getBlockedUsers` 方法获取当前群组的黑名单。默认最多取 200 个。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncGetBlockedUsers(String, EMValueCallBack)}。
EMClient.getInstance().groupManager().getBlockedUsers(groupId);
```

### 管理群组禁言列表

为了方便管理群组，环信即时通讯 IM SDK 提供了针对成员和群组的禁言操作。

#### 将成员加入群组禁言列表

仅群主和群管理员可以调用 `muteGroupMembers` 方法将指定成员添加至群组禁言列表。群成员被群主或者群管理员加入禁言列表中后，被禁言成员和其他未操作的管理员或者群主将会收到群组事件回调 `EMGroupChangeListener#onMuteListAdded`。群成员被加入群禁言列表后，将不能够发言，即使其被加入群白名单也不能发言。

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #aysncMuteGroupMembers(String, List, long, EMValueCallBack)}。
EMClient.getInstance().groupManager().muteGroupMembers(groupId, muteMembers, duration);
```

#### 将成员移出群组禁言列表

仅群主和群管理员可以调用 `UnMuteGroupMembers` 方法将指定成员移出群组禁言列表。

群成员被群主或者群管理员移出禁言列表后，被移出的群成员及其他未操作的管理员或者群主将会收到群组事件回调 `EMGroupChangeListener#onMuteListRemoved`。

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncUnMuteGroupMembers(String, List, EMValueCallBack)}。
EMClient.getInstance().groupManager().unMuteGroupMembers(String groupId, List<String> members);
```

#### 获取群组禁言列表

仅群主和群管理员可以调用 `fetchGroupMuteList` 方法从服务器获取当前群组的禁言列表。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法见 {@link #asyncFetchGroupMuteList(String, int, int, EMValueCallBack)}。
EMClient.getInstance().groupManager().fetchGroupMuteList(String groupId, int pageNum, int pageSize);
```

### 开启和关闭全员禁言

为了快捷管理群成员发言，群主和群成员可以开启和关闭群组全员禁言。

#### 开启全员禁言

仅群主和群管理员可以调用 `muteAllMembers` 方法开启全员禁言。

群主和群管理员开启群组全员禁言后，除了在白名单中的群成员，其他成员将不能发言。开启群组全员禁言后，群成员将会收到群组事件回调 `EMGroupChangeListener#onAllMemberMuteStateChanged`。

示例代码如下：

```java
// 异步方法。
public void muteAllMembers(final String groupId, final EMValueCallBack<EMGroup> callBack);
```

#### 关闭全员禁言

仅群主和群管理员可以调用 `unmuteAllMembers` 方法取消全员禁言。关闭群组全员禁言后，群成员将会收到群组事件回调 `EMGroupChangeListener#onAllMemberMuteStateChanged`。

示例代码如下：

```java
// 异步方法。
public void unmuteAllMembers(final String groupId, final EMValueCallBack<EMGroup> callBack);
```

### 管理群组白名单

#### 将成员加入群组白名单

仅群主和群管理员可以调用 `addToGroupWhiteList` 方法将指定群成员加入群白名单。白名单用户不受全员禁言的限制，但是如果白名单用户在群禁言列表中，则该用户不能发言。

群成员被群主或者群管理员添加到群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调 `EMGroupChangeListener#onWhiteListAdded`。

```java
// 异步方法。
public void addToGroupWhiteList(final String groupId, final List<String> members, final EMCallBack callBack);
```

#### 将成员移出群组白名单

仅群主和群管理员可以调用 `removeFromGroupWhiteList` 方法将指定群成员移出群白名单。

群成员被群主或者群管理员移除群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调 `EMGroupChangeListener#onWhiteListRemoved`。

```java
// 异步方法。
public void removeFromGroupWhiteList(final String groupId, final List<String> members, final EMCallBack callBack);
```

#### 检查自己是否在白名单中

所有群成员可以调用 `checkIfInGroupWhiteList` 方法检查自己是否在群白名单中，示例代码如下：

```java
// 异步方法。
public void checkIfInGroupWhiteList(final String groupId, EMValueCallBack<Boolean> callBack)
```

#### 获取群组白名单

仅群主和群管理员可以调用 `fetchGroupWhiteList` 方法从服务器获取当前群组的白名单。

```java
// 异步方法。
public void fetchGroupWhiteList(final String groupId, final EMValueCallBack<List<String>> callBack);
```

### 监听群组事件

详见 [监听群组事件](group_manage.html#监听群组事件)。
