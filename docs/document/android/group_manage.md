# 创建和管理群组及监听群组事件

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理群组，并实现群组相关功能。

如需查看消息相关内容，参见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMGroupManager` 类和 `EMGroup` 类用于管理群组，支持你通过调用 API 在项目中实现如下功能：

- 创建、解散群组
- 获取群组详情
- 获取群成员列表
- 获取群组列表
- 屏蔽、解除屏蔽群消息
- 监听群组事件

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解群组和群成员的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 创建群组

群组可分为私有群和公有群。私有群不可被搜索到，公开群可以通过群组 ID 搜索到。

用户可以创建群组，设置群组的名称、描述、群组成员、创建群组的原因等属性，还可以设置 `EMGroupStyle` 参数指定群组的大小和类型。创建群组后，群组创建者自动成为群主。

创建群组前，需设置群组类型（`EMGroupStyle`）和进群邀请是否需要对方同意 (`EMGroupOptions#inviteNeedConfirm`)。

- 设置群组类型（`EMGroupStyle`）以及入群是否需要群主和群管理员同意：

   - EMGroupStylePrivateOnlyOwnerInvite——私有群，只有群主和管理员可以邀请人进群；
   - EMGroupStylePrivateMemberCanInvite——私有群，所有群成员均可以邀请人进群；
   - EMGroupStylePublicJoinNeedApproval——公开群，用户入群需要获得群主和群管理员同意；
   - EMGroupStylePublicOpenJoin ——公开群，任何人都可以进群，无需群主和群管理员同意。

- 邀请进群是否需要受邀用户确认（`EMGroupOptions#inviteNeedConfirm`）

公开群只支持群主和管理员邀请用户入群。对于私有群，除了群主和群管理员，群成员是否也能邀请其他用户进群取决于群组类型 `EMGroupStyle` 的设置。

邀请入群是否需受邀用户确认取决于群组选项 `EMGroupOptions#inviteNeedConfirm` 和受邀用户的参数 `autoAcceptGroupInvitation` 的设置，前者的优先级高于后者，即若 `EMGroupOptions#inviteNeedConfirm` 设置为 `false`，不论 `autoAcceptGroupInvitation` 设置为何值，受邀用户无需确认直接进群。

1. 受邀用户无需确认，直接进群。

以下两种设置的情况下，用户直接进群：

- 若 `EMGroupOptions#inviteNeedConfirm` 设置为 `false`，不论 `autoAcceptGroupInvitation` 设置为 `false` 或 `true`，受邀用户均无需确认，直接进群。
- 若 `EMGroupOptions#inviteNeedConfirm` 和 `autoAcceptGroupInvitation` 均设置为 `true`，用户自动接受群组邀请，直接进群。

受邀用户直接进群，会收到如下回调：

- 新成员会收到 `EMGroupChangeListener#onAutoAcceptInvitationFromGroup` 回调；
- 邀请人收到 `EMGroupChangeListener#onInvitationAccepted` 回调和 `EMGroupChangeListener#onMemberJoined` 回调；
- 其他群成员收到 `EMGroupChangeListener#onMemberJoined` 回调。

2. 受邀用户需要确认才能进群。

只有 `EMGroupOptions#inviteNeedConfirm` 设置为 `true` 和 `autoAcceptGroupInvitation` 设置为 `false` 时，受邀用户需要确认才能进群。这种情况下，受邀用户收到 `EMGroupChangeListener#onInvitationReceived` 回调，并选择同意或拒绝进群邀请：

- 用户同意入群邀请后，邀请人收到 `EMGroupChangeListener#onInvitationAccepted` 回调和 `EMGroupChangeListener#onMemberJoined` 回调，其他群成员收到 `EMGroupChangeListener#onMemberJoined` 回调；
- 用户拒绝入群邀请后，邀请人收到 `EMGroupChangeListener#onInvitationDeclined` 回调。

邀请用户入群的流程如下图所示：

![img](@static/images/android/group-flow.png)

用户可以调用 `createGroup` 方法创建群组，并通过 `EMGroupOptions` 中的参数设置群组名称、群组描述、群组成员和建群原因。

用户加入群组后，将可以收到群消息。示例代码如下：

```java
EMGroupOptions option = new EMGroupOptions();
option.maxUsers = 100;
option.style = EMGroupStyle.EMGroupStylePrivateMemberCanInvite;
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncCreateGroup(String, String, String[], String, EMGroupOptions, EMValueCallBack)。
EMClient.getInstance().groupManager().createGroup(groupName, desc, allMembers, reason, option);
```

### 解散群组

仅群主可以调用 `destroyGroup` 方法解散群组。群组解散时，其他群组成员收到 `EMGroupChangeListener#onGroupDestroyed` 回调并被踢出群组。

:::notice
该操作是危险操作，解散群组后，将删除本地数据库及内存中的群相关信息及群会话。
:::

示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncDestroyGroup(String, EMCallBack)。
EMClient.getInstance().groupManager().destroyGroup(groupId);
```

### 获取群组详情

群成员可以调用 `getGroup(groupId)` 方法从内存获取群组详情。返回的结果包括群组 ID、群组名称、群组描述、群组基本属性、群主、群组管理员列表，默认不包含群成员。

群成员也可以调用 `getGroupFromServer(String groupId, boolean fetchMembers)` 方法从服务器获取群组详情。返回的结果包括群组 ID、群组名称、群组描述、群组基本属性、群主、群组管理员列表、是否已屏蔽群组消息以及群组是否禁用等信息。另外，若将该方法的 `fetchMembers` 参数设置为 `true`，可获取群成员列表，默认最多包括 200 个成员。

:::tip
对于公有群，用户即使不加入群也能获取群组详情，而对于私有群，用户只有加入了群组才能获取群详情。
:::

示例代码如下：

```java
// 根据群组 ID 从本地获取群组详情。
EMGroup group = EMClient.getInstance().groupManager().getGroup(groupId);

// 根据群组 ID 从服务器获取群组详情。
// 同步方法，会阻塞当前线程。异步方法为 asyncGetGroupFromServer(String, EMValueCallBack)。
EMGroup group = EMClient.getInstance().groupManager().getGroupFromServer(groupId);

// 获取群主用户 ID。
group.getOwner();

// 获取内存中的群成员。
List<String> members = group.getMembers();

// 获取内存中管理员列表。
List<String> adminList = group.getAdminList();

/**
 * 获取是否已屏蔽群组消息。
 * - `true`：是；
 * - `false`：否。
 */
boolean isMsgBlocked = group.isMsgBlocked();
...
```

### 获取群成员列表

- 当群成员少于 200 人时，你可以调用从服务器获取群组详情的方法 `getGroupFromServer` 获取获取群成员列表，包括群主、群管理员和普通群成员：

```java
// 第二个参数传入 `true`，默认取 200 人的群成员列表。
// 同步方法，会阻塞当前线程。
EMGroup group = EMClient.getInstance().groupManager().getGroupFromServer(groupId, true);
List<String> memberList = group.getMembers();//普通成员
memberList.addAll(group.getAdminList());//加上管理员
memberList.add(group.getOwner());//加上群主
```

- 当群成员数量大于等于 200 时，你可以首先调用 `getGroupFromServer` 方法获取群主和群管理员，然后调用 `fetchGroupMembers` 方法获取普通群成员列表：

```java
// 第二个参数传入 `true`，默认取 200 人的群成员列表。
// 同步方法，会阻塞当前线程。
EMGroup group = EMClient.getInstance().groupManager().getGroupFromServer(groupId, true);

List<String> memberList = new ArrayList<>();
EMCursorResult<String> result = null;
final int pageSize = 20;
do {
    // 同步方法，会阻塞当前线程。异步方法为 asyncFetchGroupMembers(String, String, int, EMValueCallBack)。
     result = EMClient.getInstance().groupManager().fetchGroupMembers(groupId,
             result != null? result.getCursor(): "", pageSize);
     memberList.addAll(result.getData());
} while (!TextUtils.isEmpty(result.getCursor()) && result.getData().size() == pageSize);

 memberList.addAll(group.getAdminList());//加上管理员
 memberList.add(group.getOwner());//加上群主
```

### 获取群组列表

用户可以调用 `getJoinedGroupsFromServer` 方法从服务器获取自己加入和创建的群组列表。

示例代码如下：

```java
// 异步方法。同步方法为 getJoinedGroupsFromServer(int, int, boolean, boolean)。
// pageIndex：当前页码，从 0 开始。
// pageSize：每页期望返回的群组数。取值范围为[1,20]。
List<EMGroup> grouplist = EMClient.getInstance().groupManager().asyncGetJoinedGroupsFromServer(pageIndex, pageSize, needMemberCount, needRole, new EMValueCallBack<List<EMGroup>>() {
                        @Override
                        public void onSuccess(List<EMGroup> value) {

                        }

                        @Override
                        public void onError(int error, String errorMsg) {

                        }
                });
```

- 用户可以调用 `getAllGroups` 方法加载本地群组列表。为了保证数据的正确性，需要先从服务器获取自己加入和创建的群组列表。示例代码如下：

```java
List<EMGroup> grouplist = EMClient.getInstance().groupManager().getAllGroups();
```

- 用户还可以分页获取公开群列表：

```java
// 同步方法，会阻塞当前线程。异步方法为 asyncGetPublicGroupsFromServer(int, String, EMValueCallBack)。
EMCursorResult<EMGroupInfo> result = EMClient.getInstance().groupManager().getPublicGroupsFromServer(pageSize, cursor);
List<EMGroupInfo> groupsList = result.getData();
String cursor = result.getCursor();
```

### 查询当前用户已加入的群组数量

自 4.2.1 版本开始，你可以调用 `EMGroupManager#asyncGetJoinedGroupsCountFromServer` 方法从服务器获取当前用户已加入的群组数量。单个用户可加入群组数量的上限取决于订阅的即时通讯的套餐包，详见[产品价格](/product/pricing.html#套餐包功能详情)。

```java
EMClient.getInstance().groupManager().asyncGetJoinedGroupsCountFromServer(new EMValueCallBack<Integer>() {
    @Override
    public void onSuccess(Integer value) {
        
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

### 屏蔽和解除屏蔽群消息

群成员可以屏蔽群消息和解除屏蔽群消息。

#### 屏蔽群消息

群成员可以调用 `blockGroupMessage` 方法屏蔽群消息。屏蔽群消息后，该成员不再从指定群组接收群消息，群主和群管理员不能进行此操作。示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncBlockGroupMessage(String, EMCallBack)。
EMClient.getInstance().groupManager().blockGroupMessage(groupId);
```

#### 解除屏蔽群消息

群成员可以调用 `unblockGroupMessage` 方法解除屏蔽群消息。示例代码如下：

```java
// 同步方法，会阻塞当前线程。
// 异步方法为 asyncUnblockGroupMessage(String, EMCallBack)。
EMClient.getInstance().groupManager().unblockGroupMessage(groupId);
```

#### 检查自己是否已经屏蔽群消息

群成员可以调用 `EMGroup#isMsgBlocked` 方法检查是否屏蔽了该群的消息。为了保证检查结果的准确性，调用该方法前需先从服务器获取群详情，即调用 `EMGroupManager#getGroupFromServer`。

示例代码如下：

```java
// 1、获取群组详情
EMClient.getInstance().groupManager().asyncGetGroupFromServer(groupId, new EMValueCallBack<EMGroup>() {
    @Override
    public void onSuccess(EMGroup group) {
        // 2、检查用户是否屏蔽了该群的消息
        if(group.isMsgBlocked()) {
        }
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

### 监听群组事件

`EMGroupManager` 中提供群组事件的监听接口。开发者可以通过设置此监听，获取群组中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```java
// 创建一个群组事件监听
// 在该方法的举例中，用户 A 表示当前用户。
EMGroupChangeListener groupListener = new EMGroupChangeListener() {
    // 当前用户收到了入群邀请。受邀用户会收到该回调。例如，用户 B 邀请用户 A 入群，则用户 A 会收到该回调。
    @Override
    public void onInvitationReceived(String groupId, String groupName, String inviter, String reason) {
    }

    // 群主或群管理员收到进群申请。群主和所有管理员收到该回调。
    public void OnRequestToJoinReceivedFromGroup(string groupId, string groupName, string applicant, string reason){
    }

    // 群主或群管理员同意用户的进群申请。申请人、群主和管理员（除操作者）收到该回调。
    @Override
    public void onRequestToJoinAccepted(String groupId, String groupName, String accepter) {
    }

    // 群主或群管理员拒绝用户的进群申请。申请人、群主和管理员（除操作者）收到该回调。
    @Override
    public void onRequestToJoinDeclined(String groupId, String groupName, String decliner, String reason, String applicant) {
    }

    // 用户同意进群邀请。邀请人收到该回调。
    @Override
    public void onInvitationAccepted(String groupId, String invitee, String reason) {
    }

    // 用户拒绝进群邀请。邀请人收到该回调。
    @Override
    public void onInvitationDeclined(String groupId, String invitee, String reason) {
    }

    // 有成员被移出群组。被踢出群组的成员会收到该回调。
    @Override
    public void onUserRemoved(String groupId, String groupName) {
    }

    // 群组解散。群主解散群组时，所有群成员均会收到该回调。
    @Override
    public void onGroupDestroyed(String groupId, String groupName) {
    }

    // 有用户自动同意加入群组。邀请人收到该回调。
    @Override
    public void onAutoAcceptInvitationFromGroup(String groupId, String inviter, String inviteMessage) {
    }

    // 有成员被加入群组禁言列表。被禁言的成员及群主和群管理员（除操作者外）会收到该回调。
    @Override
    public void onMuteListAdded(String groupId, List<String> mutes, long muteExpire) {
    }

    // 有成员被移出禁言列表。被解除禁言的成员及群主和群管理员（除操作者外）会收到该回调。
    @Override
    public void onMuteListRemoved(String groupId, List<String> mutes) {
    }

    // 有成员被加入群组白名单。被添加的成员及群主和群管理员（除操作者外）会收到该回调。
    @Override
    public void onWhiteListAdded(String groupId, List<String> whitelist) {
    }

    // 有成员被移出群组白名单。被移出的成员及群主和群管理员（除操作者外）会收到该回调。
    @Override
    public void onWhiteListRemoved(String groupId, List<String> whitelist) {
    }

    // 全员禁言状态变化。群组所有成员（除操作者外）会收到该回调。
    @Override
    public void onAllMemberMuteStateChanged(String groupId, boolean isMuted) {
    }

    // 设置管理员。群主、新管理员和其他管理员会收到该回调。
    @Override
    public void onAdminAdded(String groupId, String administrator) {
    }

    // 群组管理员被移除。被移出的成员及群主和群管理员（除操作者外）会收到该回调。
    @Override
    public void onAdminRemoved(String groupId, String administrator) {
    }

    // 群主转移权限。原群主和新群主会收到该回调。
    @Override
    public void onOwnerChanged(String groupId, String newOwner, String oldOwner) {
    }

    // 有新成员加入群组。除了新成员，其他群成员会收到该回调。
    @Override
    public void onMemberJoined(String groupId, String member) {
    }

    // 有成员主动退出群。除了退群的成员，其他群成员会收到该回调。
    @Override
    public void onMemberExited(String groupId, String member) {
    }

    // 群组公告更新。群组所有成员会收到该回调。
    @Override
    public void onAnnouncementChanged(String groupId, String announcement) {
    }

    // 有成员新上传群组共享文件。群组所有成员会收到该回调。
    @Override
    public void onSharedFileAdded(String groupId, EMMucSharedFile sharedFile) {
    }

    // 群组共享文件被删除。群组所有成员会收到该回调。
    @Override
    public void onSharedFileDeleted(String groupId, String fileId) {
    }

    // 群组详情变更。群组所有成员会收到该回调。
    @Override
    public void onSpecificationChanged(EMGroup group){
    }

    // 设置群成员自定义属性。群内其他成员会收到该回调。
   @Override
   public void onGroupMemberAttributeChanged(String groupId, String userId, Map<String, String> attribute, String from) {
            
    }
};

// 注册群组监听
EMClient.getInstance().groupManager().addGroupChangeListener(groupListener);

// 移除群组监听
EMClient.getInstance().groupManager().removeGroupChangeListener(groupListener);
```
