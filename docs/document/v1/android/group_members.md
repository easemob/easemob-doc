# 管理群组成员

<Toc />

群组是支持多人沟通的即时通讯系统，本文指导你如何使用环信即时通讯 IM SDK 在实时互动 app 中实现群组成员管理相关功能。

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMGroupManager` 类和 `EMGroup` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

<!--- 管理群成员的自定义属性-->
- 加入、退出群组
- 管理群主及群管理员
- 管理群组白名单
- 管理群组黑名单
- 管理群组禁言

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/document/v1/privatization/uc_limitation.html)。
- 了解群成员角色，详见 [群组概述](group_overview.html)；

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 加入群组

用户进群分为两种方式：主动申请入群和群成员邀请入群。

公开群和私有群在两种入群方式方面存在差别：

| 入群方式                   | 公开群       | 私有群          |
| :------------------------- | :------------------ | :------------------------------------ |
| 是否支持用户申请入群       | 支持 <br/>任何用户均可申请入群，是否需要群主和群管理员审批，取决于群组类型 `EMGroupStyle` 的设置。 | 不支持                                                                                             |
| 是否支持群成员邀请用户入群 | 支持 <br/>只能由群主和管理员邀请。    | 支持 <br/>除了群主和群管理员，群成员是否也能邀请其他用户进群取决于群组类型 `EMGroupStyle` 的设置。 |

#### 用户申请入群

只有公开群支持用户申请入群，私有群不支持。用户可获取公开群列表，选择相应的群组 ID，然后调用相应方法加入该群组。

任何用户均可申请入群，是否需要群主和群管理员审批，取决于群组类型（`EMGroupStyle`）的设置：

- `EMGroupStyle` 为 `EMGroupStylePublicJoinNeedApproval` 时，群主和群管理员审批后，用户才能加入群组；
- `EMGroupStyle` 为 `EMGroupStylePublicOpenJoin` 时，用户可直接加入群组，无需群主和群管理员审批。

若申请加入公开群，申请人需执行以下步骤：

1. 调用 `getPublicGroupsFromServer` 方法从服务器获取公开群列表，查询到想要加入的群组 ID。示例代码如下：

```java
EMCursorResult<EMGroupInfo> result = EMClient.getInstance().groupManager().getPublicGroupsFromServer(pageSize, cursor);
List<EMGroupInfo> groupsList = result.getData();
String cursor = result.getCursor();
```

2. 调用 `joinGroup` 或 `applyJoinToGroup` 方法传入群组 ID，申请加入对应群组。

   - 调用 `joinGroup` 方法加入无需群主或管理员审批的公开群，即 `EMGroupStyle` 设置为 `EMGroupStylePublicOpenJoin`。申请人不会收到任何回调，其他群成员会收到 `EMGroupChangeListener#onMemberJoined` 回调。

   示例代码如下：

   ```java
   EMClient.getInstance().groupManager().joinGroup(groupId);
   ```

   - 调用 `applyJoinToGroup` 方法加入需要群主或管理员审批的公开群，即 `EMGroupStyle` 设置为 `EMGroupStylePublicJoinNeedApproval`。示例代码如下：

   ```java
   EMClient.getInstance().groupManager().applyJoinToGroup(groupId, "your reason");
   ```

   群主或群管理员收到 `EMGroupChangeListener#OnRequestToJoinReceivedFromGroup` 回调：

   - 若同意加入群组，需要调用 `acceptApplication` 方法。

   申请人会收到 `EMGroupChangeListener#onRequestToJoinAccepted` 回调，其他群成员会收到 `EMGroupChangeListener#onMemberJoined` 回调。

   示例代码如下：

   ```java
   EMClient.getInstance().groupManager().acceptApplication(username, groupId);
   ```

   - 若群主或群管理员拒绝申请人入群，需要调用 `declineApplication` 方法。申请人会收到 `EMGroupChangeListener#onRequestToJoinDeclined` 回调。

   示例代码如下：

   ```java
   EMClient.getInstance().groupManager().declineApplication(username, groupId, "your reason");
   ```

#### 邀请用户入群

邀请用户入群的方式详见 [邀请用户入群的配置](./group_manage.html#创建群组)。

邀请用户入群流程如下：

1. 群成员邀请用户入群。

   - 群主或群管理员加人，需要调用 `addUsersToGroup` 方法：

   ```java
   EMClient.getInstance().groupManager().addUsersToGroup(groupId, newmembers);
   ```

   - 普通成员邀请人入群，需要调用 `inviteUser` 方法：

   对于私有群，`EMGroupStyle` 设置为 `EMGroupStylePrivateMemberCanInvite` 时，所有群成员均可以邀请人进群。

   ```java
   EMClient.getInstance().groupManager().inviteUser(groupId, newmembers, "your reason");
   ```

2. 受邀用户自动进群或确认是否加入群组：

   - 受邀用户同意加入群组，需要调用 `acceptInvitation` 方法。

   ```java
   EMClient.getInstance().groupManager().acceptInvitation(groupId, inviter);
   ```

   - 受邀人拒绝入群组，需要调用 `declineInvitation` 方法。

   ```java
   EMClient.getInstance().groupManager().declineInvitation(groupId, inviter, "your reason");
   ```

### 退出群组

#### 群成员主动退出群组

群成员可以调用 `leaveGroup` 方法退出群组。其他成员收到 `EMGroupChangeListener#onMemberExited` 回调。

退出群组后，该用户将不再收到群消息。群主不能调用该接口退出群组，只能调用 `DestroyGroup` 解散群组。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncLeaveGroup(String, EMCallBack)。
EMClient.getInstance().groupManager().leaveGroup(groupId);
```

#### 群成员被移出群组

仅群主和群管理员可以调用 `removeUserFromGroup` 方法将指定成员移出群组。被踢出群组后，被踢成员将会收到群组事件回调 `EMGroupChangeListener#onUserRemoved`，其他成员将会收到回调 `EMGroupChangeListener#onMemberExited`。被移出群组后，该用户还可以再次加入群组。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncRemoveUserFromGroup(String, String, EMCallBack)。
EMClient.getInstance().groupManager().removeUserFromGroup(groupId, username);
```
<!--
### 管理群成员的自定义属性

群成员可设置自定义属性（key-value），例如在群组中的昵称和头像等。

- 单个群成员的自定义属性总长度不能超过 4 KB。对于单个自定义属性，属性 key 不能超过 16 字节，value 不能超过 512 个字节，否则会报错。

- 群主可修改所有群成员的自定义属性，其他群成员只能修改自己的自定义属性。

#### 设置群成员自定义属性

你可以调用 `EMGroupManager#asyncSetGroupMemberAttributes` 方法设置指定群成员的自定义属性。自定义属性为 key-value 格式，key 表示属性名称，value 表示属性值，若 value 设置为空字符串即删除该自定义属性。

设置后，群内其他成员会收到 `com.hyphenate.EMGroupChangeListener#onGroupMemberAttributeChanged` 事件。

示例代码如下：

```java
    Map<String,String> attrMap=new HashMap();
    attrMap.put("key","value");

    EMClient.getInstance().groupManager().asyncSetGroupMemberAttributes(groupId, userId, attrMap, new EMCallBack() {
        @Override
        public void onSuccess() {

        }

        @Override
        public void onError(int code, String error) {

        }
    });
```

#### 获取单个群成员的所有自定义属性

你可以调用 `EMGroupManager#asyncFetchGroupMemberAllAttributes` 方法获取单个群成员的所有自定义属性。

示例代码如下：

```java
    EMClient.getInstance().groupManager().asyncFetchGroupMemberAllAttributes(groupId, userId, new EMValueCallBack<Map<String, Map<String, String>>>() {
        @Override
        public void onSuccess(Map<String, Map<String, String>> value) {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
    });
```

#### 根据属性 key 获取多个群成员的自定义属性

你可调用 `EMGroupManager#asyncFetchGroupMembersAttributes` 方法根据指定的属性 key 获取多个群成员的自定义属性。

:::notice
每次最多可获取 10 个群成员的自定义属性。
:::

示例代码如下：

```java
   // keyList：要获取自定义属性的 key 的数组。若 keyList 为空数组或不传则获取这些成员的所有自定义属性。
    EMClient.getInstance().groupManager().asyncFetchGroupMembersAttributes(groupId, userIds, keyList, new EMValueCallBack<Map<String, Map<String, String>>>() {
        @Override
        public void onSuccess(Map<String, Map<String, String>> value) {

        }

        @Override
        public void onError(int error, String errorMsg) {

        }
    });
```
-->
### 管理群主和群管理员

#### 变更群主

仅群主可以调用 `changeOwner` 方法将群所有权移交给指定群成员。成功移交后，原群主变为普通成员，其他群组成员收到 `EMGroupChangeListener#onOwnerChanged` 回调。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncChangeOwner(String, String, EMValueCallBack)。
EMClient.getInstance().groupManager().changeOwner(groupId, newOwner);
```

#### 添加群组管理员

仅群主可以调用 `addGroupAdmin` 方法添加群管理员。成功添加后，新管理员及其他管理员收到 `EMGroupChangeListener#onAdminAdded` 回调。

管理员除了不能解散群组等少数权限外，拥有对群组的绝大部分权限。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncAddGroupAdmin(String, String, EMValueCallBack)。
EMClient.getInstance().groupManager().addGroupAdmin(groupId, admin);
```

#### 移除群组管理员权限

仅群主可以调用 `RemoveGroupAdmin` 方法移除群管理员。成功移除后，被移除的管理员及其他管理员收到 `EMGroupChangeListener#onAdminRemoved` 回调。

群管理员被移除群管理权限后将只拥有群成员的权限。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncRemoveGroupAdmin(String, String, EMValueCallBack)。
EMClient.getInstance().groupManager().removeGroupAdmin(groupId, admin);
```

### 获取群管理员列表

获取群管理员列表示例如下：

```java
// 获取内存中管理员列表。
List<String> adminList = group.getAdminList();
```

或者也可以用 [获取群组详情](group_manage.html#获取群组详情) 获取群组管理员列表。

### 管理群组白名单

#### 将成员加入群组白名单

仅群主和群管理员可以调用 `addToGroupWhiteList` 方法将指定群成员加入群白名单。群成员被添加至群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调 `EMGroupChangeListener#onWhiteListAdded`。

即使开启了群组全员禁言，群组白名单中的成员仍可以发送群组消息。不过，禁言列表上的用户即使加入了群白名单仍无法在群组中发送消息。

```java
// 异步方法。
public void addToGroupWhiteList(final String groupId, final List<String> members, final EMCallBack callBack);
```

#### 将成员移出群组白名单

仅群主和群管理员可以调用 `removeFromGroupWhiteList` 方法将指定群成员移出群白名单。

群成员被移除群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调 `EMGroupChangeListener#onWhiteListRemoved`。

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

### 管理群组黑名单

#### 将成员加入群组黑名单

仅群主和群管理员可以调用 `BlockGroupMembers` 方法将指定成员添加至黑名单。被加入黑名单后，该成员收到 `EMGroupChangeListener#OnUserRemovedFromGroup` 回调。其他群成员会收到该成员退出群组的回调，如需该回调，请联系商务开通。黑名单中的成员会被移出群组，无法再收发群消息，只有先被移出黑名单才能重新加入群组。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncBlockUser(String, String, EMCallBack)。
EMClient.getInstance().groupManager().blockUser(groupId, username);
```

#### 将成员移出群组黑名单

仅群主和群管理员可以调用 `unblockUser` 方法将成员移出群组黑名单。指定用户被群主或者群管理员移出群黑名单后，可以再次申请加入群组。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncUnblockUser(String, String, EMCallBack)。
EMClient.getInstance().groupManager().unblockUser(groupId, username);
```

#### 获取群组的黑名单用户列表

仅群主和群管理员可以调用 `getBlockedUsers` 方法获取当前群组的黑名单。默认最多取 200 个。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncGetBlockedUsers(String, EMValueCallBack)。
EMClient.getInstance().groupManager().getBlockedUsers(groupId);
```

### 管理群组禁言

群主和群管理员若对单个或多个群成员禁言或解除禁言，可将其添加至或移出群组禁言列表。此外，群主和群管理员也可开启或关闭全员禁言。

全员禁言和单独的成员禁言不冲突，开启和关闭全员禁言，并不影响群组禁言列表。

#### 将成员加入群组禁言列表

仅群主和群管理员可以调用 `muteGroupMembers` 方法将指定成员添加至群组禁言列表。群成员被群主或者群管理员加入禁言列表中后，被禁言成员和其他未操作的管理员或者群主将会收到群组事件回调 `EMGroupChangeListener#onMuteListAdded`。群成员被加入群禁言列表后，将不能够发言，即使其被加入群白名单也不能发言。

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncMuteGroupMembers(String, List, long, EMValueCallBack)。
// 若对 `duration` 传 -1，表示永久禁言。
EMClient.getInstance().groupManager().muteGroupMembers(groupId, muteMembers, duration);
```

#### 将成员移出群组禁言列表

仅群主和群管理员可以调用 `UnMuteGroupMembers` 方法将指定成员移出群组禁言列表。

群成员被移出禁言列表后可以在群组中正常发送消息，被移出的群成员及其他未操作的管理员或者群主将会收到群组事件回调 `EMGroupChangeListener#onMuteListRemoved`。

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncUnMuteGroupMembers(String, List, EMValueCallBack)。
EMClient.getInstance().groupManager().unMuteGroupMembers(String groupId, List<String> members);
```

#### 获取群组禁言列表

仅群主和群管理员可以调用 `fetchGroupMuteList` 方法从服务器获取当前群组的禁言列表。

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncFetchGroupMuteList(String, int, int, EMValueCallBack)。
EMClient.getInstance().groupManager().fetchGroupMuteList(String groupId, int pageNum, int pageSize);
```

#### 开启群组全员禁言

仅群主和群管理员可以调用 `muteAllMembers` 方法开启全员禁言。

群主和群管理员开启群组全员禁言后，除了在白名单中的群成员，其他成员将不能发言。开启群组全员禁言后，群成员将会收到群组事件回调 `EMGroupChangeListener#onAllMemberMuteStateChanged`。

示例代码如下：

```java
// 异步方法。
public void muteAllMembers(final String groupId, final EMValueCallBack<EMGroup> callBack);
```

#### 关闭群组全员禁言

仅群主和群管理员可以调用 `unmuteAllMembers` 方法取消全员禁言。关闭群组全员禁言后，群成员将会收到群组事件回调 `EMGroupChangeListener#onAllMemberMuteStateChanged`。

示例代码如下：

```java
// 异步方法。
public void unmuteAllMembers(final String groupId, final EMValueCallBack<EMGroup> callBack);
```

### 监听群组事件

详见 [监听群组事件](group_manage.html#监听群组事件)。
