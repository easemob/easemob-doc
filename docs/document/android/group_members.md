# 群组成员管理

## 功能说明

群组是支持多人实时沟通的即时通讯场景。本文介绍如何使用 Android SDK 管理群组成员，包括查询成员列表、管理成员自定义属性、群主和管理员、白名单、黑名单及禁言等功能。用户入群、退出和移出群组的操作详见 [创建和管理群组](group_manage.html#加入群组)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 [SDK 初始化](initialization.html) 并 [登录成功](login.html)。
- 已了解群成员角色及其权限，详见 [群组概述](group_overview.html)。
- 已了解群成员数量、接口调用频率和群成员属性大小等限制，详见[使用限制](/product/limitation.html)。

## 获取群成员列表

可通过三种方式获取群成员列表：

- 分页获取群成员信息：通过 `asyncFetchGroupMembersInfo` 从服务器分页获取成员详情。
- 分页获取群成员 ID：通过 `asyncFetchGroupMembers` 从服务器分页获取成员 ID。
- 从本地群组对象获取成员 ID：通过 `EMGroup#getUsers` 读取已获取的 `EMGroup` 对象中的成员 ID。

### 分页获取群成员信息

调用 `EMGroupManager#asyncFetchGroupMembersInfo` 分页获取群成员信息，返回的成员信息包括群成员的用户 ID、角色、入群时间、群名片、昵称和头像。

```java
// 异步方法。
// cursor：首次请求时将 `cursor` 传入 `null` 或空字符串；后续请求传入上一次结果中的游标。当返回的游标为空时，表示已到最后一页。
EMClient.getInstance()
        .groupManager()
        // pageSize：每页期望返回的群成员数量，上限取决于服务端，详见 https://doc.easemob.com/document/server-side/group_member_list_obtain.html#请求-url。
        .asyncFetchGroupMembersInfo(
                groupId,
                null,
                50,
                new EMValueCallBack<
                        EMCursorResult<EMGroupMemberInfo>>() {
                    @Override
                    public void onSuccess(
                            EMCursorResult<EMGroupMemberInfo> result) {
                        List<EMGroupMemberInfo> members = result.getData();
                        String nextCursor = result.getCursor();

                        for (EMGroupMemberInfo member : members) {
                            String userId = member.getUserId();
                            long joinedAt = member.getJoinTime();
                            EMGroup.EMGroupPermissionType role =
                                    member.getRole();
                            String namecard = member.getNamecard();
                            String nickname = member.getNickname();
                            String avatarUrl = member.getAvatarUrl();
                        }
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

`EMGroupMemberInfo` 的主要接口如下：

| API | 返回值 | 描述 |
| :--- | :--- | :--- |
| `getUserId()` | `String` | 获取群成员的用户 ID。 |
| `getJoinTime()` | `long` | 获取入群时间，Unix 时间戳，单位为毫秒。 |
| `getRole()` | `EMGroupPermissionType` | 获取成员角色：`owner`、`admin`、`member` 或 `none`。 |
| `getNamecard()` | `String` | 获取群成员名片。 |
| `getNickname()` | `String` | 获取群成员昵称。 |
| `getAvatarUrl()` | `String` | 获取群成员头像 URL。 |

### 分页获取群成员 ID

如果只需要群成员用户 ID，也可以调用 `asyncFetchGroupMembers` 分页获取：

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupMembers(
                groupId,
                null,
                50,
                new EMValueCallBack<EMCursorResult<String>>() {
                    @Override
                    public void onSuccess(
                            EMCursorResult<String> result) {
                        List<String> userIds = result.getData();
                        String nextCursor = result.getCursor();
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 从本地群组对象获取成员 ID

如已获取 `EMGroup` 对象，可调用 `EMGroup#getUsers()` 获取该对象中包含的全部成员用户 ID，包括群主、管理员和普通成员：

```java
List<String> userIds = group.getUsers();
```

## 管理群成员自定义属性

群成员自定义属性是群组维度的成员信息，适用于业务标签等场景，采用字符串 key-value 结构。

- 单个群成员的自定义属性总长度不能超过 4 KB。
- 单个属性的 key 不能超过 16 字节，value 不能超过 512 字节。
- 群主可以修改所有群成员的属性，其他群成员只能修改自己的属性。

### 设置群成员的自定义属性

调用 `asyncSetGroupMemberAttributes` 设置指定成员的属性。将某个 key 对应的 value 设置为空字符串表示删除该属性。设置成功后，群内其他成员会收到 `EMGroupChangeListener#onGroupMemberAttributeChanged` 回调。

```java
Map<String, String> attributes = new HashMap<>();
attributes.put("department", "product");
attributes.put("roleTag", "speaker");

// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncSetGroupMemberAttributes(
                groupId,
                userId,
                attributes,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 获取单个群成员的自定义属性

调用 `asyncFetchGroupMemberAllAttributes` 获取指定群成员的全部自定义属性。成功时，回调返回 `Map<String, Map<String, String>>`：外层 `Map` 的键为成员用户 ID，内层 `Map` 为该成员的属性键值对。

若该成员未设置自定义属性，返回结果中该用户 ID 对应的属性 `Map` 可能为空；业务侧应按需判空处理。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupMemberAllAttributes(
                groupId,
                userId,
                new EMValueCallBack<
                        Map<String, Map<String, String>>>() {
                    @Override
                    public void onSuccess(
                            Map<String, Map<String, String>> result) {
                        Map<String, String> attributes = result.get(userId);
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 根据属性 key 获取群成员自定义属性

调用 `asyncFetchGroupMembersAttributes` 可以按属性 key 批量获取多个群成员的属性。`keyList` 为空列表时，返回这些成员的全部属性。

:::tip
每次最多可获取 10 个群成员的自定义属性。
:::

```java
List<String> userIds = Arrays.asList("user1", "user2");
List<String> keyList = Arrays.asList("department", "roleTag");

// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupMembersAttributes(
                groupId,
                userIds,
                // keyList：要获取自定义属性的 key 的数组。若 keyList 为空数组或不传则获取这些成员的所有自定义属性。
                keyList,
                new EMValueCallBack<
                        Map<String, Map<String, String>>>() {
                    @Override
                    public void onSuccess(
                            Map<String, Map<String, String>> result) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## 管理群主和群管理员

### 变更群主

仅群主可以调用 `asyncChangeOwner` 将群所有权转让给指定群成员。转让成功后，原群主变为普通成员，新群主拥有群主权限，群成员会收到 `onOwnerChanged` 回调。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncChangeOwner(
                groupId,
                newOwner,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 添加群管理员

仅群主可以调用 `asyncAddGroupAdmin` 添加群管理员。添加成功后，新管理员及其他管理员会收到 `onAdminAdded` 回调。

管理员除了不能解散群组等少数权限外，拥有对群组的绝大部分权限。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncAddGroupAdmin(
                groupId,
                userId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 移除群管理员

仅群主可以调用 `asyncRemoveGroupAdmin` 移除群管理员。移除成功后，被移除的管理员及其他管理员会收到 `onAdminRemoved` 回调。

群管理员被移除群管理权限后将只拥有普通群成员的权限。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncRemoveGroupAdmin(
                groupId,
                userId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 获取群管理员列表

通过 `EMGroup#getAdminList` 获取群组管理员列表。若需要最新数据，应先调用 [获取群组详情的方法 `asyncGetGroupFromServer`](group_attributes.html#获取群组详情) 刷新群详情。

```java
// 获取内存中管理员列表。
List<String> adminList = group.getAdminList();
```

## 管理群组白名单

群组白名单用于控制全员禁言场景下仍可发言的成员。群主和群管理员默认属于白名单。

:::tip
全员禁言和单独禁言相互独立。全员禁言时，白名单成员仍可发送群消息；如果该成员同时被单独禁言，则单独禁言优先，该成员仍不能发送群消息。
:::

### 添加成员到白名单

仅群主或群管理员可以调用 `addToGroupWhiteList` 将指定成员加入群白名单。添加成功后，该成员以及群主和群管理员（除操作者外）会收到 `onWhiteListAdded` 回调。
即使开启了全员禁言，白名单中的成员仍可发送群消息；但如果某个成员同时在禁言列表中，则无法发送群消息。

```java
List<String> members = Arrays.asList("user1", "user2");

// 异步方法。
EMClient.getInstance()
        .groupManager()
        .addToGroupWhiteList(groupId, members, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### 从白名单移除成员

仅群主或群管理员可以调用 `removeFromGroupWhiteList` 将指定成员移出群白名单。群成员被移除群白名单后，该群成员及其他未操作的群管理员和群主将会收到 `onWhiteListRemoved` 回调。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .removeFromGroupWhiteList(groupId, members, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### 查询当前用户是否在白名单中

所有群成员均可调用 `checkIfInGroupWhiteList` 查询当前登录用户是否在群白名单中。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .checkIfInGroupWhiteList(
                groupId,
                new EMValueCallBack<Boolean>() {
                    @Override
                    public void onSuccess(Boolean inWhiteList) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 获取白名单列表

仅群主或群管理员可以调用 `fetchGroupWhiteList` 方法从服务器获取当前群组的白名单。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .fetchGroupWhiteList(
                groupId,
                new EMValueCallBack<List<String>>() {
                    @Override
                    public void onSuccess(List<String> members) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## 管理群组黑名单

群组黑名单用于禁止指定用户加入或继续留在群组。成员被加入黑名单后会被移出群组，无法继续收发该群消息；只有先从黑名单中移除，才可再次申请或被邀请加入。

### 添加成员到黑名单

仅群主或群管理员可以调用 `asyncBlockUsers` 将一个或多个成员加入群黑名单。被加入黑名单的成员会收到 `onUserRemoved` 回调。默认情况下，其他群成员不会收到事件通知。如需该事件，请联系商务开通。

黑名单中的成员会被移出群组，无法再收发群消息，只有先被移出黑名单才能重新加入群组。

```java
List<String> members = Arrays.asList("user1", "user2");

// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncBlockUsers(groupId, members, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### 从黑名单移除成员

仅群主或群管理员可以调用 `asyncUnblockUsers` 将一个或多个用户移出群黑名单。移除后，用户可以再次申请或被邀请加入群组。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncUnblockUsers(groupId, members, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

### 获取黑名单列表

仅群主或群管理员可以调用 `asyncFetchGroupBlackList` 分页获取黑名单成员列表。

```java
// 异步方法。
// `pageNum` 从 `1` 开始。
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupBlackList(
                groupId,
                1,
                20,
                new EMValueCallBack<List<String>>() {
                    @Override
                    public void onSuccess(List<String> members) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## 管理群组禁言

群主和管理员可以对群成员单独禁言，也可以对全员禁言。这两种禁言方式相互独立，互不影响：
- 单独禁言：将指定用户加入禁言列表。被禁言成员不能发送群消息。禁言时长的单位为毫秒。
- 全员禁言：一键禁言群组所有成员。白名单成员可发言；若成员同时被单独禁言，则单独禁言优先，禁止发言。
- 开启或关闭全员禁言不会影响单个成员的禁言列表。

### 禁言指定成员

仅群主或群管理员可以调用 `asyncMuteGroupMembers` 禁言指定成员。加入禁言列表后，被禁言成员、群管理员和群主（除操作者外）会收到 `onMuteListAdded` 回调。

```java
List<String> members = Arrays.asList("user1", "user2");
// `duration` 的单位为毫秒，传入 `-1` 表示永久禁言。
long duration = 60 * 60 * 1000L;

EMClient.getInstance()
        .groupManager()
        .asyncMuteGroupMembers(
                groupId,
                members,
                duration,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 解除指定成员禁言

仅群主或群管理员可以调用 `asyncUnMuteGroupMembers` 解除指定成员禁言。解除禁言后，被解除禁言的成员、群管理员和群主（除操作者外）会收到 `onMuteListRemoved` 回调。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncUnMuteGroupMembers(
                groupId,
                members,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 查询当前用户是否被禁言

群成员可以调用 `asyncCheckIfInMuteList` 查询当前登录用户是否在群禁言列表中。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncCheckIfInMuteList(
                groupId,
                new EMValueCallBack<Boolean>() {
                    @Override
                    public void onSuccess(Boolean muted) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 获取禁言列表

仅群主或群管理员可以调用 `asyncFetchGroupMuteList` 分页获取禁言列表。返回 `Map` 的 `key` 为成员 ID，`value` 为禁言时长，单位为毫秒。

```java
// 异步方法。
// `pageNum` 从 `1` 开始。
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupMuteList(
                groupId,
                1,
                20,
                new EMValueCallBack<Map<String, Long>>() {
                    @Override
                    public void onSuccess(
                            Map<String, Long> muteList) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 开启全员禁言

仅群主或群管理员可以调用 `muteAllMembers` 开启全员禁言。开启后，群成员会收到 `onAllMemberMuteStateChanged` 回调。除白名单成员外，其他成员将无法发送群消息。

全员禁言不会自动到期，如要关闭需主动调用关闭接口。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .muteAllMembers(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### 关闭全员禁言

仅群主或群管理员可以调用 `unmuteAllMembers` 关闭全员禁言。关闭后，群成员会收到 `onAllMemberMuteStateChanged` 回调。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .unmuteAllMembers(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## 监听群组成员事件

群组成员相关操作成功后，SDK 会触发对应的 `EMGroupChangeListener` 回调。监听器的注册、移除及完整事件说明详见 [监听群组事件](group_manage.html#监听群组事件)。

## 注意事项

- `groupId`、`userId` 和成员列表不能为空；参数无效时，SDK 会通过回调返回错误。
- `asyncFetchGroupMembersInfo` 和 `asyncFetchGroupMembers` 使用游标分页；禁言列表和黑名单使用页码分页，页码从 `1` 开始。
- `asyncMuteGroupMembers` 的禁言时长单位为毫秒，`-1` 表示永久禁言。
- `checkIfInGroupWhiteList` 和 `asyncCheckIfInMuteList` 仅查询当前登录用户自身的状态，不能指定其他用户。
- 管理员、白名单、黑名单和禁言操作要求当前用户具备相应权限。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncFetchGroupMembersInfo`](#分页获取群成员信息) | `EMGroupManager` | 分页获取包含角色、入群时间和资料的群成员信息。 |
| [`asyncFetchGroupMembers`](#分页获取群成员-id) | `EMGroupManager` | 分页获取群成员用户 ID。 |
| [`getUsers`](#从本地群组对象获取成员-id) | `EMGroup` | 获取群组对象中包含的群主、管理员和普通成员的用户 ID 列表。 |
| [`asyncSetGroupMemberAttributes`](#设置群成员的自定义属性) | `EMGroupManager` | 设置群成员自定义属性。 |
| [`asyncFetchGroupMemberAllAttributes`](#获取单个群成员的自定义属性) | `EMGroupManager` | 获取单个群成员的全部自定义属性。 |
| [`asyncFetchGroupMembersAttributes`](#获取单个群成员的自定义属性) | `EMGroupManager` | 获取多个群成员的指定或全部自定义属性。 |
| [`asyncChangeOwner`](#变更群主) | `EMGroupManager` | 转让群主权限。 |
| [`asyncAddGroupAdmin`](#添加群管理员) / [`asyncRemoveGroupAdmin`](#移除群管理员) | `EMGroupManager` | 添加或移除群管理员。 |
| [`asyncGetGroupFromServer`](#获取群管理员列表) | `EMGroupManager` | 从服务器获取最新群详情。 |
| [`getAdminList`](#获取群管理员列表) | `EMGroup` | 获取群管理员列表。 |
| [`addToGroupWhiteList`](#添加成员到白名单) / [`removeFromGroupWhiteList`](#从白名单移除成员) | `EMGroupManager` | 添加或移除群白名单成员。 |
| [`checkIfInGroupWhiteList`](#查询当前用户是否在白名单中) / [`fetchGroupWhiteList`](#获取白名单列表) | `EMGroupManager` | 查询当前用户是否在白名单中或获取白名单。 |
| [`asyncBlockUsers`](#添加成员到黑名单) / [`asyncUnblockUsers`](#从黑名单移除成员) | `EMGroupManager` | 添加或移除群黑名单成员。 |
| [`asyncFetchGroupBlackList`](#获取黑名单列表) | `EMGroupManager` | 分页获取群黑名单。 |
| [`asyncMuteGroupMembers`](#禁言指定成员) / [`asyncUnMuteGroupMembers`](#解除指定成员禁言) | `EMGroupManager` | 禁言或解除禁言指定成员。 |
| [`asyncCheckIfInMuteList`](#查询当前用户是否被禁言) / [`asyncFetchGroupMuteList`](#获取禁言列表) | `EMGroupManager` | 查询当前用户是否被禁言或分页获取禁言列表。 |
| [`muteAllMembers`](#开启全员禁言) / [`unmuteAllMembers`](#关闭全员禁言) | `EMGroupManager` | 开启或关闭全员禁言。 |
