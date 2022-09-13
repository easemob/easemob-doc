# 群组-创建和管理群组及监听群组事件

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理群组，并实现群组相关功能。

如需查看消息相关内容，参见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM Android SDK 提供 `EMGroupManager` 类和 `EMGroup` 类用于管理群组，支持你通过调用 API 在项目中实现如下功能：

- 创建、解散群组
- 加入、退出群组
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

在创建群组前，你需要设置群组类型（`EMGroupStyle`）和进群邀请是否需要对方同意 (`inviteNeedConfirm`)。

1. 私有群不可被搜索到，公开群可以通过 ID 搜索到。目前支持四种群组类型（`EMGroupStyle`），具体设置如下：
    - EMGroupStylePrivateOnlyOwnerInvite——私有群，只有群主和管理员可以邀请人进群；
    - EMGroupStylePrivateMemberCanInvite——私有群，所有群成员均可以邀请人进群；
    - EMGroupStylePublicJoinNeedApproval——公开群，加入此群除了群主和管理员邀请，只能通过申请加入此群；
    - EMGroupStylePublicOpenJoin ——公开群，任何人都可以进群，无需群主和群管理同意。
2. 进群邀请是否需要对方同意 (`inviteNeedConfirm`) 的具体设置如下：
    - 进群邀请需要用户确认(`inviteNeedConfirm` 设置为 `true`)。创建群组并发出邀请后，根据受邀用户的 `autoAcceptGroupInvitation` 设置，处理逻辑如下：
        - 用户设置自动接受群组邀请 (`autoAcceptGroupInvitation` 设置为 `true`)。受邀用户自动进群并收到 `EMGroupChangeListener#onAutoAcceptInvitationFromGroup` 回调，群主收到 `EMGroupChangeListener#onInvitationAccepted` 回调和 `EMGroupChangeListener#onMemberJoined` 回调，其他群成员收到 `EMGroupChangeListener#onMemberJoined` 回调。
        - 用户设置手动确认群组邀请 (`autoAcceptGroupInvitation` 设置为 `false`)，受邀用户收到 `EMGroupChangeListener#onInvitationReceived` 回调，并选择同意或拒绝入群邀请：
            - 用户同意入群邀请后，群主收到 `EMGroupChangeListener#onInvitationAccepted` 回调和 `EMGroupChangeListener#onMemberJoined` 回调；其他群成员收到 `EMGroupChangeListener#onMemberJoined` 回调；
            - 用户拒绝入群邀请后，群主收到 `EMGroupChangeListener#groupInvitationDidDecline` 回调。

流程如下：

![img](@static/images/android/group-flow.png)

- 进群邀请无需用户确认 (`inviteNeedConfirm` 设置为 `false`)。创建群组并发出邀请后，无视用户的 `autoAcceptGroupInvitation` 设置，受邀用户直接进群。用户收到 `EMGroupChangeListener#onAutoAcceptInvitationFromGroup` 回调；群主收到每个已加入成员对应的群组事件回调 `EMGroupChangeListener#onInvitationAccepted` 和 `EMGroupChangeListener#onMemberJoined`；先加入的群成员会收到群组事件回调 `EMGroupChangeListener#onMemberJoined`。

用户可以调用 `createGroup` 方法创建群组，并通过 `EMGroupOptions` 参数设置群组名称、群组描述、群组成员和建群原因。

用户加入群组后，将可以收到群消息。

示例代码如下：

```java
EMGroupOptions option = new EMGroupOptions();
option.maxUsers = 100;
option.style = EMGroupStyle.EMGroupStylePrivateMemberCanInvite;

EMClient.getInstance().groupManager().createGroup(groupName, desc, allMembers, reason, option);
```

### 用户申请入群

根据 [创建群组](#创建群组) 时的群组类型 (`EMGroupStyle`) 设置，加入群组的处理逻辑差别如下：

- 当群组类型为 `EMGroupStylePublicOpenJoin` 时，用户直接加入群组，无需群主和群管理员同意；加入群组后，其他群成员收到 `EMGroupChangeListener#onMemberJoined` 回调。
- 当群组类型为 `EMGroupStylePublicJoinNeedApproval` 时，群主和群管理员收到 `EMGroupChangeListener#onRequestToJoinReceived` 回调，并选择同意或拒绝入群申请：
    - 群主和群管理员同意入群申请，申请人收到 `EMGroupChangeListener#onRequestToJoinAccepted` 回调；其他群成员收到 `EMGroupChangeListener#onMemberJoined` 回调。
    - 群主和群管理员拒绝入群申请，申请人收到 `EMGroupChangeListener#onRequestToJoinDeclined` 回调。

:::notice
用户只能申请加入公开群组，私有群组不支持用户申请入群。
:::

用户申请加入群组的步骤如下：

1. 调用 `getPublicGroupsFromServer` 方法从服务器获取公开群列表，查询到想要加入的群组 ID。
2. 调用 `joinGroup` 方法传入群组 ID，申请加入对应群组。

示例代码如下：

```java
// 从服务器获取公开群组列表
EMCursorResult<EMGroupInfo> result = EMClient.getInstance().groupManager().getPublicGroupsFromServer(pageSize, cursor);
List<EMGroupInfo> groupsList = result.getData();
String cursor = result.getCursor();

// 申请加入群组
EMClient.getInstance().groupManager().joinGroup(groupId);
```

### 解散群组

仅群主可以调用 `destroyGroup` 方法解散群组。群组解散时，其他群组成员收到 `EMGroupChangeListener#onGroupDestroyed` 回调并被踢出群组。

:::notice
该操作是危险操作，解散群组后，将删除本地数据库及内存中的群相关信息及群会话。
:::

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().groupManager().destroyGroup(groupId);
```

### 退出群组

群成员可以调用 `leaveGroup` 方法退出群组。其他成员收到 `EMGroupChangeListener#onMemberExited` 回调。

退出群组后，该用户将不再收到群消息。群主不能调用该接口退出群组，只能调用 `DestroyGroup` 解散群组。

示例代码如下：

```java
// 异步方法。
EMClient.getInstance().groupManager().leaveGroup(groupId);
```

### 获取群组详情

群成员可以调用 `getGroup(groupId)` 方法从内存获取群组详情。返回结果包括：群组 ID、群组名称、群组描述、群组基本属性、群主、群组管理员列表，默认不包含群成员。

群成员也可以调用 `getGroupFromServer(String groupId, boolean fetchMembers)` 方法从服务器获取群组详情。返回结果包括：群组 ID、群组名称、群组描述、群组基本属性、群主、群组管理员列表。另外，若设置 `fetchMembers` 为 `true`，获取群组详情时同时获取群成员，默认获取最大数量为 200。

示例代码如下：

```java
// 根据群组 ID 从本地获取群组详情。
EMGroup group = EMClient.getInstance().groupManager().getGroup(groupId);

// 根据群组 ID 从服务器获取群组详情。
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

群成员可以调用 `fetchGroupMembers` 方法从服务器分页获取群成员列表。

- 可通过分页获取群成员：

```java
List<String> memberList = new ArrayList<>;
EMCursorResult<String> result = null;
final int pageSize = 20;
do {
     result = EMClient.getInstance().groupManager().fetchGroupMembers(groupId,
             result != null? result.getCursor(): "", pageSize);
     memberList.addAll(result.getData());
} while (!TextUtils.isEmpty(result.getCursor()) && result.getData().size() == pageSize);
```

- 当群成员少于 200 人时，可通过以下方式获取群成员：

```java
// 异步方法。
// 第二个参数传入 `true`，默认取 200 人的群成员列表。
EMGroup group = EMClient.getInstance().groupManager().getGroupFromServer(groupId, true);
List<String> memberList = group.getMembers();
```

### 获取群组列表

用户可以调用 `getJoinedGroupsFromServer` 方法从服务器获取自己加入和创建的群组列表。示例代码如下：

```java
// 异步方法。
List<EMGroup> grouplist = EMClient.getInstance().groupManager().getJoinedGroupsFromServer();
```

- 用户可以调用 `getAllGroups` 方法加载本地群组列表。为了保证数据的正确性，需要先从服务器获取自己加入和创建的群组列表。示例代码如下：

```java
List<EMGroup> grouplist = EMClient.getInstance().groupManager().getAllGroups();
```

- 用户还可以分页获取公开群列表：

```java
// 异步方法。
EMCursorResult<EMGroupInfo> result = EMClient.getInstance().groupManager().getPublicGroupsFromServer(pageSize, cursor);
List<EMGroupInfo> groupsList = result.getData();
String cursor = result.getCursor();
```

### 屏蔽和解除屏蔽群消息

群成员可以屏蔽群消息和解除屏蔽群消息。

#### 屏蔽群消息

群成员可以调用 `blockGroupMessage` 方法屏蔽群消息。屏蔽群消息后，该成员不再从指定群组接收群消息，群主和群管理员不能进行此操作。示例代码如下：

```java
EMClient.getInstance().groupManager().blockGroupMessage(groupId);
```

#### 解除屏蔽群消息

群成员可以调用 `unblockGroupMessage` 方法解除屏蔽群消息。示例代码如下：

```java
EMClient.getInstance().groupManager().unblockGroupMessage(groupId);
```

#### 检查自己是否已经屏蔽群消息

群成员可以调用 `EMGroup#isMsgBlocked` 方法检查用户是否屏蔽了该群的群消息。使用此方法检查时，为了保证结果的准确性，需要先从服务器获取群详情，即调用 `EMGroupManager#getGroupFromServer`。

示例代码如下：

```java
// 1、获取群组详情
EMClient.getInstance().groupManager().asyncGetGroupFromServer(groupId, new EMValueCallBack<EMGroup>() {
    @Override
    public void onSuccess(EMGroup group) {
        // 2、检查用户是否屏蔽了该群的群消息
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
    public void onRequestToJoinDeclined(String groupId, String groupName, String decliner, String reason) {
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
};

// 注册群组监听
EMClient.getInstance().groupManager().addGroupChangeListener(groupListener);

// 移除群组监听
EMClient.getInstance().groupManager().removeGroupChangeListener(groupListener);
```