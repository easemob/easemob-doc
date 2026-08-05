# 创建和管理群组

## 功能说明

群组是支持多人实时沟通的即时通讯场景。本文介绍如何使用环信即时通讯 IM Android SDK 创建、加入、退出、解散和管理群组，并监听群组事件。

### 群组分类

群组按照是否对用户公开，可以分为公开群和私有群。

Android SDK 使用 `EMGroupConfigs` 的多个字段定义群组类型：

| 群组类型                   | Android 配置                                      | 说明                                       |
| :--- | :--- | :--- |
| 私有群，仅群主和管理员邀请 | `isPublic = false`、`allowInvites = false`        | 普通成员不能邀请其他用户。                 |
| 私有群，成员可邀请         | `isPublic = false`、`allowInvites = true`         | 普通成员可以邀请其他用户。                 |
| 公开群，申请需审批         | `isPublic = true`、`joinApprovalRequired = true`  | 用户提交入群申请后，等待群主或管理员审批。 |
| 公开群，可直接加入         | `isPublic = true`、`joinApprovalRequired = false` | 用户可直接加入群组。                       |

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

调用 `EMGroupManager#asyncCreateGroup` 创建群组。创建成功后，当前用户成为群主，回调返回新建的 `EMGroup` 对象。

SDK 使用 `EMGroupConfigs` 配置群组类型和入群规则：

| 参数或字段 | 类型 | 是否必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `groupName` | String | 否 | 群组名称；不设置时传 `null`。 |
| `avatar` | String | 否 | 群头像 URL；不设置时传 `null`。 |
| `desc` | String | 否 | 群组描述；不设置时传 `null`。 |
| `allMembers` | String[] | 是 | 初始群成员的用户 ID 数组，不包含群主；没有初始成员时传空数组，不能传 `null`。 |
| `reason` | String | 否 | 邀请初始成员入群的说明；不设置时传 `null`。 |
| `configs` | EMGroupConfigs | 是 | 群组配置对象，不能为 `null`。 |
| `configs.maxUsers` | Int | 否 | 群组最大成员数，默认值为 `200`。 |
| `configs.isPublic` | Boolean | 是 | 是否为公开群；`true` 表示公开群，`false` 表示私有群。 |
| `configs.joinApprovalRequired` | Boolean | 是 | 申请加入公开群时是否需要群主或管理员审批。仅对公开群有意义。 |
| `configs.allowInvites` | Boolean | 是 | 私有群是否允许普通成员邀请其他用户。仅对私有群有意义。 |
| `configs.inviteNeedConfirm` | Boolean | 是 | 被邀请用户加入群组前是否需要确认邀请。 |
| `configs.extField` | String | 否 | 群组扩展信息，可使用 JSON 字符串。 |

```java
EMGroupConfigs configs = new EMGroupConfigs();
configs.maxUsers = 200;
configs.isPublic = false;
configs.joinApprovalRequired = false;
configs.allowInvites = true;
configs.inviteNeedConfirm = true;
configs.extField = "{\"source\":\"android\"}";

String[] initialMembers = new String[0];

EMClient.getInstance()
        .groupManager()
        .asyncCreateGroup(
                "group name",
                "https://example.com/group-avatar.png",
                "group description",
                initialMembers,
                null,
                configs,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        String groupId = group.getGroupId();
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```


## 解散群组

仅群主可以调用 `asyncDestroyGroup` 解散群组。群组解散后，其他成员会收到 `EMGroupChangeListener#onGroupDestroyed` 回调并被移出群组。

:::warning
解散群组是不可恢复的操作。解散成功后，群组将不再存在，所有群成员均会被移出群组，SDK 也会移除内存中该群组对应的会话。执行该操作前，建议在应用侧进行二次确认。
:::

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncDestroyGroup(groupId, new EMCallBack() {
            @Override
            public void onSuccess() {
                // 群组已解散。
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

## 加入群组

用户可以通过邀请加入群组，也可以主动申请加入公开群。具体流程由群组的 `isPublic`、`joinApprovalRequired`、`allowInvites` 和 `inviteNeedConfirm` 配置决定。

### 邀请用户入群

Android SDK 中，群主和管理员可调用 `asyncAddUsersToGroup` 将用户添加至群组。对于私有群，普通成员是否可以邀请其他用户由 `EMGroupConfigs#allowInvites` 控制：

- `allowInvites = false`：普通成员不能邀请其他用户；仅群主和管理员可以添加成员。
- `allowInvites = true`：普通成员可调用 `asyncInviteUser` 邀请其他用户加入群组。

邀请流程如下：

![](/images/android/goup_member_invite.png)

群主和群管理员可以调用 `asyncAddUsersToGroup` 添加一个或多个用户；允许邀请的私有群普通成员可以调用 `asyncInviteUser` 发出邀请。

```java
String[] userIds = {"user1", "user2"};

// 群主或群管理员添加用户。
EMClient.getInstance()
        .groupManager()
        .asyncAddUsersToGroup(
                groupId,
                userIds,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 操作成功。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 操作失败，根据错误码和错误信息处理。
                    }
                });

// 允许邀请的私有群普通成员发出邀请。
EMClient.getInstance()
        .groupManager()
        .asyncInviteUser(
                groupId,
                userIds,
                "Join our group",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 邀请已发送。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 邀请发送失败。
                    }
                });
```

受邀用户的处理流程由创建群组时的 `EMGroupConfigs#inviteNeedConfirm` 决定：

- `false`：受邀用户无需确认即可加入群组，并收到 `EMGroupChangeListener#onAutoAcceptInvitationFromGroup` 回调。
- `true`：受邀用户收到 `EMGroupChangeListener#onInvitationReceived` 回调，并选择是否加入群组：
  - 接受邀请：调用 `asyncAcceptInvitation`。
  - 拒绝邀请：调用 `asyncDeclineInvitation`。

邀请被接受后，邀请人会收到 `EMGroupChangeListener#onInvitationAccepted` 回调；邀请被拒绝后，邀请人会收到 `EMGroupChangeListener#onInvitationDeclined` 回调。

:::tip
如需由用户手动处理群组邀请，应在 SDK 初始化前调用 `EMOptions#setAutoAcceptGroupInvitation(false)` 关闭自动接受群组邀请。该配置默认值为 `true`。开启时，SDK 会自动接受收到的群组邀请；关闭后，应用可在 `EMGroupChangeListener#onInvitationReceived` 回调中调用接受或拒绝邀请的接口进行处理。
:::

```java
// 接受群组邀请。
EMClient.getInstance()
        .groupManager()
        .asyncAcceptInvitation(
                groupId,
                inviter,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        // 已接受邀请并加入群组。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 接受邀请失败。
                    }
                });

// 拒绝群组邀请。
EMClient.getInstance()
        .groupManager()
        .asyncDeclineInvitation(
                groupId,
                inviter,
                "No, thanks",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 已拒绝邀请。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 拒绝邀请失败。
                    }
                });
```

用户成功加入群组后，即可在该群组中收发消息。

### 用户申请入群

公开群支持用户主动申请加入，私有群不支持用户主动申请加入。

![](/images/android/group_member_apply.png)

具体调用方式由 `EMGroupConfigs#joinApprovalRequired` 决定：

- `false`：调用 `asyncJoinGroup`，直接加入公开群。
- `true`：调用 `asyncApplyJoinToGroup` 提交入群申请，等待群主或群管理员审批。

```java
// 加入无需审批的公开群。
EMClient.getInstance()
        .groupManager()
        .asyncJoinGroup(groupId, new EMCallBack() {
            @Override
            public void onSuccess() {
                // 已加入群组。
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
                // 加入失败。
            }
        });

// 申请加入需要审批的公开群。
EMClient.getInstance()
        .groupManager()
        .asyncApplyJoinToGroup(
                groupId,
                "Please approve my request",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 入群申请已提交。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 申请提交失败。
                    }
                });
```

需要审批时，群主和群管理员会收到 `EMGroupChangeListener#onRequestToJoinReceived` 回调，并选择同意或拒绝申请：
- 申请被同意后，申请人会收到 `onRequestToJoinAccepted` 回调。
- 申请被拒绝后，申请人会收到 `onRequestToJoinDeclined` 回调。

```java
// 群主或群管理员同意入群申请。
EMClient.getInstance()
        .groupManager()
        .asyncAcceptApplication(
                applicant,
                groupId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 已同意入群申请。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 操作失败。
                    }
                });

// 群主或群管理员拒绝入群申请。
EMClient.getInstance()
        .groupManager()
        .asyncDeclineApplication(
                applicant,
                groupId,
                "Group is full",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 已拒绝入群申请。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 操作失败。
                    }
                });
```

## 退出群组

### 主动退出

群成员可以调用 `asyncLeaveGroup` 主动退出群组。退出后，该用户不再接收群消息，其他成员会收到 `onMembersExited` 回调。

群主不能直接退出群组；如需退出，应先转让群主身份，再调用退出接口，或直接解散群组。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncLeaveGroup(groupId, new EMCallBack() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

退出群组后，SDK 不会自动删除本地数据库中的群聊会话及其中的本地消息，但会移除该群会话的内存缓存。

### 移出成员

群主和群管理员可以调用 `asyncRemoveUsersFromGroup` 将一个或多个成员移出群组。被移出的成员会收到 `onUserRemoved` 事件，其他成员会收到 `onMembersExited` 事件。被移出群组后，用户还可以再次加入群组。

```java
List<String> members = Arrays.asList("user1", "user2");

// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncRemoveUsersFromGroup(
                groupId,
                members,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

## 获取当前用户加入的群组列表

本地数据库打开后，可调用 `EMGroupManager#getAllGroups()` 读取当前用户本地已加入的群组列表，用于优先展示本地数据。该方法优先从内存缓存读取；如群组数据尚未加载到内存，首次调用会从本地数据库加载。

为在登录后获取最新的已加入群组数据，可在初始化 SDK 前调用 `EMOptions#setDataSyncType`，并将 `EMDataSyncType.JOINED_GROUPS` 包含在自动同步的数据类型中：

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.JOINED_GROUPS));

EMClient.getInstance().init(getApplicationContext(), options);
```

用户登录成功后，SDK 会自动同步当前用户已加入的群组数据。通过 `EMConnectionListener#onDataSyncFinish` 监听同步结果；当 `type` 为 `EMDataSyncType.JOINED_GROUPS` 且 `errorCode` 为 `EMError.EM_NO_ERROR` 时，表示同步成功。此时可再次调用 `getAllGroups()` 获取同步后的本地群组列表，并刷新页面。

```java
@Override
public void onDataSyncFinish(
        EMOptions.EMDataSyncType type,
        int errorCode) {
    if (type == EMOptions.EMDataSyncType.JOINED_GROUPS
            && errorCode == EMError.EM_NO_ERROR) {
        List<EMGroup> groups = EMClient.getInstance()
                .groupManager()
                .getAllGroups();

        // 使用同步后的已加入群组列表刷新页面。
    }
}
```

## 查询当前用户已加入的群组数量

调用 `asyncGetJoinedGroupsCountFromServer` 从服务器获取当前用户已加入的群组数量。

单个用户可加入的群组数量上限取决于订阅的即时通讯套餐包，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncGetJoinedGroupsCountFromServer(
                new EMValueCallBack<Integer>() {
                    @Override
                    public void onSuccess(Integer count) {
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

## 屏蔽和解除屏蔽群消息

群成员可以屏蔽或解除屏蔽指定群组的消息。屏蔽群消息只影响当前用户是否继续接收指定群组的后续消息，不会退出群组，也不会影响其他群成员。

### 屏蔽群消息

调用 `EMGroupManager#asyncBlockGroupMessage` 屏蔽指定群组的消息。群主和群管理员不能屏蔽群消息。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncBlockGroupMessage(
                groupId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 已屏蔽该群组的消息。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 屏蔽失败，根据错误码和错误信息处理。
                    }
                });
```

### 解除屏蔽群消息

调用 `EMGroupManager#asyncUnblockGroupMessage` 解除屏蔽。操作成功后，当前用户可以继续接收该群组的后续消息。

```java
// 异步方法。
EMClient.getInstance()
        .groupManager()
        .asyncUnblockGroupMessage(
                groupId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 已解除屏蔽该群组的消息。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 解除屏蔽失败，根据错误码和错误信息处理。
                    }
                });
```

### 检查当前用户是否已屏蔽群消息

先调用 `asyncGetGroupFromServer` 获取最新群详情，再通过 `EMGroup#isMsgBlocked` 判断当前用户是否已屏蔽指定群组的消息。

```java
EMClient.getInstance()
        .groupManager()
        .asyncGetGroupFromServer(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        boolean messageBlocked = group.isMsgBlocked();
                    }

                    @Override
                    public void onError(int errorCode, String errorMessage) {
                    }
                });
```

## 监听群组事件

`EMGroupManager` 提供群组事件监听接口。应用可以通过 `addGroupChangeListener` 注册监听器，获取群组中的各类事件并更新相关 UI。不再使用监听器时，需要调用 `removeGroupChangeListener` 移除，避免内存泄漏。

```java
// 创建群组事件监听器。
// 以下说明中的当前用户，表示当前登录用户。
EMGroupChangeListener groupListener = new EMGroupChangeListener() {
    // 当前用户收到入群邀请。受邀用户会收到该回调。
    // 例如，用户 B 邀请当前用户入群，则当前用户收到该回调。
    @Override
    public void onInvitationReceived(String groupId, String groupName,
            String inviter, String reason) {
    }

    // 群主或群管理员收到入群申请。群主和所有管理员收到该回调。
    @Override
    public void onRequestToJoinReceived(String groupId, String groupName,
            String applicant, String reason) {
    }

    // 群主或群管理员同意用户的入群申请。
    // 申请人、群主和管理员（除操作者外）收到该回调。
    @Override
    public void onRequestToJoinAccepted(String groupId, String groupName,
            String accepter) {
    }

    // 群主或群管理员拒绝用户的入群申请。
    // 申请人、群主和管理员（除操作者外）收到该回调。
    @Override
    public void onRequestToJoinDeclined(String groupId, String groupName,
            String decliner, String reason, String applicant) {
    }

    // 用户同意入群邀请。邀请人收到该回调。
    @Override
    public void onInvitationAccepted(String groupId, String invitee,
            String reason) {
    }

    // 用户拒绝入群邀请。邀请人收到该回调。
    @Override
    public void onInvitationDeclined(String groupId, String invitee,
            String reason) {
    }

    // 有成员被移出群组。被移出的成员收到该回调。
    @Override
    public void onUserRemoved(String groupId, String groupName) {
    }

    // 群组被解散。群主解散群组时，所有群成员收到该回调。
    @Override
    public void onGroupDestroyed(String groupId, String groupName) {
    }

    // 有用户自动同意加入群组。邀请人收到该回调。
    @Override
    public void onAutoAcceptInvitationFromGroup(String groupId,
            String inviter, String inviteMessage) {
    }

    // 有成员被加入群禁言列表。
    // 被禁言成员及群主和群管理员（除操作者外）收到该回调。
    @Override
    public void onMuteListAdded(String groupId, List<String> mutes,
            long muteExpire) {
    }

    // 有成员被移出群禁言列表。
    // 被解除禁言成员及群主和群管理员（除操作者外）收到该回调。
    @Override
    public void onMuteListRemoved(String groupId, List<String> mutes) {
    }

    // 有成员被加入群白名单。
    // 被添加成员及群主和群管理员（除操作者外）收到该回调。
    @Override
    public void onWhiteListAdded(String groupId, List<String> whitelist) {
    }

    // 有成员被移出群白名单。
    // 被移出成员及群主和群管理员（除操作者外）收到该回调。
    @Override
    public void onWhiteListRemoved(String groupId, List<String> whitelist) {
    }

    // 全员禁言状态变化。群组所有成员（除操作者外）收到该回调。
    @Override
    public void onAllMemberMuteStateChanged(String groupId,
            boolean isMuted) {
    }

    // 设置群管理员。群主、新管理员和其他管理员收到该回调。
    @Override
    public void onAdminAdded(String groupId, String administrator) {
    }

    // 群管理员被移除。
    // 被移除的管理员及群主和群管理员（除操作者外）收到该回调。
    @Override
    public void onAdminRemoved(String groupId, String administrator) {
    }

    // 群主转让权限。群成员收到该回调。
    @Override
    public void onOwnerChanged(String groupId, String newOwner,
            String oldOwner) {
    }

    // 有新成员加入群组。除新成员外，其他群成员收到该回调。
    @Override
    public void onMembersJoined(String groupId, List<String> members) {
    }

    // 有成员主动或被动退出群组。
    // 除退出成员外，其他群成员收到该回调。
    @Override
    public void onMembersExited(String groupId, List<String> members) {
    }

    // 群公告更新。群组所有成员收到该回调。
    @Override
    public void onAnnouncementChanged(String groupId,
            String announcement) {
    }

    // 有成员通过调用 RESTful API 上传了群共享文件。群组所有成员收到该回调。
    @Override
    public void onSharedFileAdded(String groupId,
            EMMucSharedFile sharedFile) {
    }

    // 群共享文件被删除。群组所有成员收到该回调。
    @Override
    public void onSharedFileDeleted(String groupId, String fileId) {
    }

    // 群组详情变更。群组所有成员收到该回调。
    @Override
    public void onSpecificationChanged(EMGroup group) {
    }

    // 群组禁用状态变化。群组所有成员收到该回调。
    @Override
    public void onStateChanged(EMGroup group, boolean isDisabled) {
    }

    // 群成员自定义属性变更。群内其他成员收到该回调。
    @Override
    public void onGroupMemberAttributeChanged(String groupId,
            String userId, Map<String, String> attribute, String from) {
    }

    // 群成员名片变更。群组其他在线成员收到该回调。
    @Override
    public void onUserGroupNamecardUpdated(String groupId,
            String userId, String groupNamecard) {
    }
};

EMClient.getInstance()
        .groupManager()
        .addGroupChangeListener(groupListener);

// 页面或组件销毁且不再需要监听时调用。
EMClient.getInstance()
        .groupManager()
        .removeGroupChangeListener(groupListener);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncCreateGroup`](#创建群组) | `EMGroupManager` | 异步创建群组。 |
| [`asyncDestroyGroup`](#解散群组) | `EMGroupManager` | 解散群组。 |
| [`asyncAddUsersToGroup`](#邀请用户入群) / [`asyncInviteUser`](#邀请用户入群) | `EMGroupManager` | 添加或邀请用户加入群组。 |
| [`asyncAcceptInvitation`](#邀请用户入群) / [`asyncDeclineInvitation`](#邀请用户入群) | `EMGroupManager` | 接受或拒绝群组邀请。 |
| [`asyncJoinGroup`](#用户申请入群) / [`asyncApplyJoinToGroup`](#用户申请入群) | `EMGroupManager` | 直接加入或申请加入公开群。 |
| [`asyncAcceptApplication`](#用户申请入群) / [`asyncDeclineApplication`](#用户申请入群) | `EMGroupManager` | 同意或拒绝入群申请。 |
| [`asyncLeaveGroup`](#主动退出) | `EMGroupManager` | 主动退出群组。 |
| [`asyncRemoveUsersFromGroup`](#移出成员) | `EMGroupManager` | 将一个或多个成员移出群组。 |
| [`setDataSyncType`](#获取当前用户加入的群组列表) | `EMOptions` | 配置登录后自动同步已加入群组数据。 |
| [`getAllGroups`](#获取当前用户加入的群组列表) | `EMGroupManager` | 从本地获取当前用户已加入的群组列表。 |
| [`asyncGetJoinedGroupsCountFromServer`](#查询当前用户已加入的群组数量) | `EMGroupManager` | 从服务器获取当前用户已加入的群组数量。 |
| [`asyncGetGroupFromServer`](#检查当前用户是否已屏蔽群消息) | `EMGroupManager` | 从服务器获取群组详情。 |
| [`isMsgBlocked`](#检查当前用户是否已屏蔽群消息) | `EMGroup` | 判断当前用户是否已屏蔽指定群组消息。 |
| [`asyncBlockGroupMessage`](#屏蔽群消息) / [`asyncUnblockGroupMessage`](#解除屏蔽群消息) | `EMGroupManager` | 屏蔽或解除屏蔽群消息。 |
