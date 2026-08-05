# 创建和管理群组

## 功能说明

群组适用于多人即时沟通场景。本文介绍如何使用环信即时通讯 IM iOS SDK 创建、加入、退出、解散和管理群组，并监听群组事件。

### 群组分类

群组按照是否对用户公开，可以分为公开群和私有群。

iOS SDK 使用 `EMGroupConfigs` 的多个字段定义群组类型：

| 群组类型 | Swift 配置 | 说明 |
| :--- | :--- | :--- |
| 私有群，仅群主邀请 | `isPublic = false`、`allowInvites = false` | 普通成员不能邀请其他用户。 |
| 私有群，成员可邀请 | `isPublic = false`、`allowInvites = true` | 普通成员可以邀请其他用户。 |
| 公开群，申请需审批 | `isPublic = true`、`joinApprovalRequired = true` | 用户提交入群申请后，等待群主审批。 |
| 公开群，可直接加入 | `isPublic = true`、`joinApprovalRequired = false` | 用户可直接加入群组。 |

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
- 已了解接口调用频率、群组及群成员数量限制，详见 [使用限制](/product/limitation.html)。

## 创建群组

调用 `createGroupWithSubject` 创建群组。创建成功后，创建者自动成为群主。

| 参数或字段                     | Swift 类型        | 是否必填 | 描述                                                         |
| :--- | :--- | :--- | :--- |
| `subject`                      | `String?`         | 否       | 群组名称。                                                   |
| `avatar`                       | `String?`         | 否       | 群头像 URL。                                                 |
| `description`                  | `String?`         | 否       | 群组描述。                                                   |
| `invitees`                     | `[String]?`       | 否       | 初始群成员的用户 ID 数组，不包含创建者。无初始成员时可传空数组或 `nil`。 |
| `message`                      | `String?`         | 否       | 邀请初始成员入群时附带的消息。                               |
| `setting`                      | `EMGroupConfigs?` | 否       | 群组配置对象。传入 `nil` 时使用 SDK 默认配置。               |
| `setting.maxUsers`             | `Int`             | 否       | 群组最大成员数，取值范围为 3-2000，默认值为 200。           |
| `setting.isPublic`             | `Bool`            | 否       | 是否为公开群；默认值为 `false`。                             |
| `setting.joinApprovalRequired` | `Bool`            | 否       | 公开群的入群申请是否需要审批；仅对公开群生效，默认值为 `false`。 |
| `setting.allowInvites`         | `Bool`            | 否       | 私有群的普通成员是否可邀请其他用户；仅对私有群生效，默认值为 `false`。 |
| `setting.isInviteNeedConfirm`  | `Bool`            | 否       | 邀请用户入群时是否需要对方确认；`false` 时被邀请用户自动入群，默认值为 `true`。 |
| `setting.ext`                  | `String`          | 否       | 群组扩展信息；默认值为空字符串，可存储 JSON 字符串。         |

```swift
let configs = EMGroupConfigs()
configs.isPublic = false
configs.allowInvites = true
configs.maxUsers = 200

EMClient.shared().groupManager?.createGroup(
    withSubject: "项目讨论组",
    avatar: nil,
    description: "用于项目沟通",
    invitees: ["user1", "user2"],
    message: "邀请你加入项目讨论组",
    setting: configs
) { group, error in
    if let error {
        print("创建群组失败：\(error.errorDescription)")
        return
    }

    print("群组创建成功：\(group?.groupId ?? "")")
}
```

`invitees` 不应包含创建者本人。没有群头像时，将 `avatar` 传 `nil`。

## 解散群组

仅群主可以调用 `destroyGroup` 解散群组。解散成功后，群成员会收到 `didLeaveGroup` 回调，离开原因为 `.destroyed`。

:::warning
解散群组是不可恢复的操作。解散成功后，群组将不再存在，所有群成员均会被移出群组，SDK 也会移除内存中该群组对应的会话。执行该操作前，建议在应用侧进行二次确认。
:::

```swift
EMClient.shared().groupManager?.destroyGroup(
    "groupId"
) { error in
    if let error {
        print("解散群组失败：\(error.errorDescription)")
        return
    }

    print("群组已解散")
}
```

## 加入群组

用户可以通过邀请加入群组，也可以主动申请加入公开群。具体流程由群组的 `setting.isPublic`、`setting.joinApprovalRequired`、`setting.allowInvites` 和 `setting.isInviteNeedConfirm` 配置决定。

### 邀请用户入群

群主和群管理员可以邀请用户加入群组。对于私有群，普通成员是否可以邀请其他用户由 `allowInvites` 控制：

- `allowInvites = false`：仅群主和群管理员可以邀请用户。
- `allowInvites = true`：普通成员也可以邀请用户。

邀请流程如下：

![](/images/ios/goup_member_invite.png)

调用 `addMembers` 发起邀请：

```swift
EMClient.shared().groupManager?.addMembers(
    ["user1", "user2"],
    toGroup: "groupId",
    message: "欢迎加入群组"
) { group, error in
    if let error {
        print("邀请成员失败：\(error.errorDescription)")
        return
    }

    print("已发出群邀请：\(group?.groupId ?? "")")
}
```

受邀用户的处理流程由创建群组时的 `isInviteNeedConfirm` 决定：

- `false`：受邀用户无需确认即可加入群组，并收到 `didJoinGroup` 回调。
- `true`：受邀用户收到 `groupInvitationDidReceive` 回调，并选择是否加入群组：
  - 接受邀请：调用 `acceptInvitationFromGroup`。
  - 拒绝邀请：调用 `declineGroupInvitation`。

邀请被接受后，邀请人会收到 `groupInvitationDidAccept` 回调；邀请被拒绝后，邀请人会收到 `groupInvitationDidDecline` 回调。

:::tip
如需由用户手动处理群组邀请，应在 SDK 初始化前将 `EMOptions#autoAcceptGroupInvitation` 设为 `false`。该配置默认值为 `true`，即 SDK 自动接受收到的群组邀请；关闭后，应用可在 `groupInvitationDidReceive` 回调中调用接受或拒绝邀请的接口进行处理。
:::

```swift
final class GroupInvitationDelegate: NSObject, EMGroupManagerDelegate {
    func groupInvitationDidReceive(
        _ groupId: String,
        groupName: String,
        inviter: String,
        message: String?
    ) {
        // 根据用户操作调用接受或拒绝邀请的方法。
        acceptInvitation(groupId: groupId, inviter: inviter)
    }

    private func acceptInvitation(groupId: String, inviter: String) {
        EMClient.shared().groupManager?.acceptInvitation(
            fromGroup: groupId,
            inviter: inviter
        ) { group, error in
            if let error {
                print("接受群邀请失败：\(error.errorDescription)")
                return
            }

            print("已加入群组：\(group?.groupId ?? "")")
        }
    }

    private func declineInvitation(groupId: String, inviter: String) {
        EMClient.shared().groupManager?.declineGroupInvitation(
            groupId,
            inviter: inviter,
            reason: "暂不加入"
        ) { error in
            if let error {
                print("拒绝群邀请失败：\(error.errorDescription)")
            }
        }
    }
}
```

用户成功加入群组后，即可在该群组中收发消息。

### 用户申请入群

公开群支持用户主动申请加入，私有群不支持用户主动申请加入。

用户申请加入公开群的流程如下：

![](/images/ios/group_member_apply.png)

具体调用方式由 `joinApprovalRequired` 决定：

- `false`：调用 `joinPublicGroup` 直接加入公开群。
- `true`：调用 `requestToJoinPublicGroup` 提交入群申请，等待群主或群管理员审批。

```swift
// 加入无需审批的公开群。
EMClient.shared().groupManager?.joinPublicGroup(
    "groupId"
) { group, error in
    if let error {
        print("加入公开群失败：\(error.errorDescription)")
        return
    }

    print("已加入群组：\(group?.groupId ?? "")")
}

// 申请加入需要审批的公开群。
EMClient.shared().groupManager?.request(
    toJoinPublicGroup: "groupId",
    message: "申请加入"
) { _, error in
    if let error {
        print("提交入群申请失败：\(error.errorDescription)")
    }
}
```

需要审批时，群主和群管理员会收到 `joinGroupRequestDidReceive` 回调后，并选择同意或拒绝申请：
- 申请被同意后，申请人会收到 `joinGroupRequestDidApprove` 回调。
- 申请被拒绝后，申请人会收到 `joinGroupRequestDidDecline` 回调。

```swift
EMClient.shared().groupManager?.approveJoinGroupRequest(
    "groupId",
    sender: "applicantId"
) { group, error in
    if let error {
        print("同意入群申请失败：\(error.errorDescription)")
        return
    }

    print("已同意申请：\(group?.groupId ?? "")")
}

EMClient.shared().groupManager?.declineJoinGroupRequest(
    "groupId",
    sender: "applicantId",
    reason: "群成员已满"
) { _, error in
    if let error {
        print("拒绝入群申请失败：\(error.errorDescription)")
    }
}
```

## 退出群组

### 主动退出

群成员可以调用 `leaveGroup` 主动退出群组。退出后，该用户不再接收群消息，其他成员会收到 `userDidLeaveGroup` 回调。

群主不能直接退出群组；如需退出，应先转让群主身份，再调用退出接口，或直接解散群组。

```swift
EMClient.shared().groupManager?.leaveGroup(
    "groupId"
) { error in
    if let error {
        print("退出群组失败：\(error.errorDescription)")
        return
    }

    print("已退出群组")
}
```

退出群组后，本地群聊会话不会自动删除；`EMOptions#deleteMessagesOnLeaveGroup` 控制是否删除该群组的本地消息，默认值为 `true`。

### 移出成员

仅群主可以调用 `removeMembers` 将一个或多个成员移出群组。被移出的用户会收到 `didLeaveGroup` 回调，离开原因为 `.beRemoved`；其他成员会收到`userDidLeaveGroup` 回调。

```swift
EMClient.shared().groupManager?.removeMembers(
    ["user1", "user2"],
    fromGroup: "groupId"
) { group, error in
    if let error {
        print("移出成员失败：\(error.errorDescription)")
        return
    }

    print("成员已移出群组：\(group?.groupId ?? "")")
}
```

## 获取当前用户加入的群组列表

本地数据库打开后，可调用 `getJoinedGroups` 读取当前用户本地已加入的群组列表，用于优先展示本地数据。iOS SDK 未提供对应的 `loadAllGroups()` 接口；`getJoinedGroups` 返回 SDK 本地缓存或数据库中的群组数据。

为在登录后获取最新的已加入群组数据，应在初始化 SDK 前将 `EMOptions#dataSyncType` 配置为包含 `.joinedGroups`：

```swift
let options = EMOptions.options(withAppkey: "your-org#your-app")
options.dataSyncType = [.joinedGroups]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("SDK 初始化失败：\(error.errorDescription)")
}
```

用户登录成功后，SDK 会自动同步当前用户已加入的群组数据。可通过 `syncDataFinished` 监听同步结果：当 `type` 包含 `.joinedGroups` 且 `error` 为 `nil` 时，表示同步成功。此时再次调用 `getJoinedGroups` 获取同步后的本地群组列表并刷新页面。

```swift
final class ClientDelegate: NSObject, EMClientDelegate {
    func onDatabaseOpened(_ error: EMError?, username: String) {
        guard error == nil else { return }

        let cachedGroups =
            EMClient.shared().groupManager?.getJoinedGroups() ?? []

        // 使用本地群组列表进行首屏展示。
        print("本地群组数量：\(cachedGroups.count)")
    }

    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard error == nil, type.contains(.joinedGroups) else {
            return
        }

        let groups =
            EMClient.shared().groupManager?.getJoinedGroups() ?? []

        // 使用同步后的已加入群组列表刷新页面。
        print("同步后的群组数量：\(groups.count)")
    }
}
```

## 查询当前用户已加入的群组数量

调用 `getJoinedGroupsCountFromServerWithCompletion` 从服务器获取当前用户已加入的群组数量。

单个用户可加入的群组数量上限取决于订阅的即时通讯套餐包，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

```swift
EMClient.shared().groupManager?.getJoinedGroupsCountFromServer { count, error in
    if let error {
        print("查询已加入群组数量失败：\(error.errorDescription)")
        return
    }

    print("已加入群组数量：\(count)")
}
```

## 屏蔽和解除屏蔽群消息

群成员可以屏蔽或解除屏蔽指定群组的消息。屏蔽群消息只影响当前用户是否继续接收指定群组的后续消息，不会退出群组，也不会影响其他群成员。

### 屏蔽群消息

调用 `blockGroup` 屏蔽指定群组的消息。群主和群管理员不能屏蔽群消息。

```swift
EMClient.shared().groupManager?.blockGroup(
    "groupId"
) { _, error in
    if let error {
        print("屏蔽群消息失败：\(error.errorDescription)")
        return
    }

    print("已屏蔽群消息")
}
```

### 解除屏蔽群消息

调用 `unblockGroup` 解除屏蔽。操作成功后，当前用户可以继续接收该群组的后续消息。

```swift
EMClient.shared().groupManager?.unblockGroup(
    "groupId"
) { _, error in
    if let error {
        print("解除屏蔽失败：\(error.errorDescription)")
        return
    }

    print("已解除屏蔽")
}
```

### 检查当前用户是否已屏蔽群消息

先调用 `getGroupSpecificationFromServerWithId` 获取最新群详情，再通过 `isBlocked` 判断当前用户是否已屏蔽指定群组的消息。

```swift
EMClient.shared().groupManager?.getGroupSpecificationFromServer(
    withId: "groupId"
) { group, error in
    guard error == nil, let group else {
        return
    }

    print("是否已屏蔽群消息：\(group.isBlocked)")
}
```

## 监听群组事件

通过 `addDelegate` 注册 `EMGroupManagerDelegate`；不再需要监听时调用 `removeDelegate` 移除同一个代理实例。

```swift
// 创建群组事件监听器。
// 以下说明中的当前用户，表示当前登录用户。
final class GroupEventListener: NSObject, EMGroupManagerDelegate {
    // 当前用户收到群邀请。
    // 例如，用户 B 邀请当前用户加入群组，则当前用户收到该回调。
    func groupInvitationDidReceive(
        _ groupId: String,
        groupName: String,
        inviter: String,
        message: String?
    ) {
    }

    // 群主或群管理员收到用户的公开群入群申请。
    func joinGroupRequestDidReceive(
        _ group: EMGroup,
        user: String,
        reason: String?
    ) {
    }
    
    // 当前用户的公开群入群申请已获批准。
    func joinGroupRequestDidApprove(_ group: EMGroup) {
    }
    
    // 当前用户的公开群入群申请被拒绝。
    // decliner 为拒绝申请的用户 ID，applicant 为申请人用户 ID。
    func joinGroupRequestDidDecline(
        _ groupId: String,
        reason: String?,
        decliner: String?,
        applicant: String
    ) {
    }
    
    // 当前用户发出的群邀请被受邀用户接受。
    func groupInvitationDidAccept(
        _ group: EMGroup,
        invitee: String
    ) {
    }
    
    // 当前用户发出的群邀请被受邀用户拒绝。
    func groupInvitationDidDecline(
        _ group: EMGroup,
        invitee: String,
        reason: String?
    ) {
    }
    
    // SDK 自动接受群邀请，当前用户已加入群组。
    func didJoinGroup(
        _ group: EMGroup,
        inviter: String,
        message: String?
    ) {
    }
    
    // 当前用户被移出群组，或群组被解散。
    // reason 用于区分被移出和群组解散。
    func didLeaveGroup(
        _ group: EMGroup,
        reason: EMGroupLeaveReason
    ) {
    }
    
    // 当前用户的本地群组列表发生变化。
    func groupListDidUpdate(_ groupList: [EMGroup]) {
    }
    
    // 有成员加入群组。
    // users 为本次加入群组的成员用户 ID 数组。
    func userDidJoinGroup(
        _ group: EMGroup,
        users userIds: [String]
    ) {
    }
    
    // 有成员离开或被移出群组。
    // users 为本次离开群组的成员用户 ID 数组。
    func userDidLeaveGroup(
        _ group: EMGroup,
        users userIds: [String]
    ) {
    }
    
    // 群主发生变更。
    func groupOwnerDidUpdate(
        _ group: EMGroup,
        newOwner: String,
        oldOwner: String
    ) {
    }
    
    // 有成员被设为群管理员。
    func groupAdminListDidUpdate(
        _ group: EMGroup,
        addedAdmin: String
    ) {
    }
    
    // 有成员被移除群管理员身份。
    func groupAdminListDidUpdate(
        _ group: EMGroup,
        removedAdmin: String
    ) {
    }
    
    // 有成员被加入群禁言列表。
    // muteExpire 为禁言到期时间；当前 SDK 的该字段不可用。
    func groupMuteListDidUpdate(
        _ group: EMGroup,
        addedMutedMembers: [String],
        muteExpire: Int
    ) {
    }
    
    // 有成员被移出群禁言列表。
    func groupMuteListDidUpdate(
        _ group: EMGroup,
        removedMutedMembers: [String]
    ) {
    }
    
    // 全员禁言状态发生变化。
    func groupAllMemberMuteChanged(
        _ group: EMGroup,
        isAllMemberMuted: Bool
    ) {
    }
    
    // 有成员被加入群白名单。
    func groupWhiteListDidUpdate(
        _ group: EMGroup,
        addedWhiteListMembers: [String]
    ) {
    }
    
    // 有成员被移出群白名单。
    func groupWhiteListDidUpdate(
        _ group: EMGroup,
        removedWhiteListMembers: [String]
    ) {
    }
    
    // 群公告已更新。
    func groupAnnouncementDidUpdate(
        _ group: EMGroup,
        announcement: String?
    ) {
    }
    
    // 有群共享文件上传完成。
    func groupFileListDidUpdate(
        _ group: EMGroup,
        addedSharedFile: EMGroupSharedFile
    ) {
    }
    
    // 有群共享文件被删除。
    // removedSharedFile 为被删除共享文件的文件 ID。
    func groupFileListDidUpdate(
        _ group: EMGroup,
        removedSharedFile: String
    ) {
    }
    
    // 群名称、描述、头像、配置或扩展字段等详情发生变化。
    // 如需完整最新群详情，应调用群详情接口重新获取。
    func groupSpecificationDidUpdate(_ group: EMGroup) {
    }
    
    // 群组禁用状态发生变化。
    func groupStateChanged(
        _ group: EMGroup,
        isDisabled: Bool
    ) {
    }
    
    // 群成员自定义属性发生变化。
    // operatorId 为执行该操作的用户 ID。
    func onAttributesChangedOfGroupMember(
        _ groupId: String,
        userId: String,
        attributes: [String: String]?,
        operatorId: String
    ) {
    }
    
    // 群成员的群名片发生变化。
    func onUserGroupNamecardChanged(
        _ groupId: String,
        userId: String,
        namecard: String?
    ) {
    }
}

let groupEventListener = GroupEventListener()

EMClient.shared().groupManager?.add(
    groupEventListener,
    delegateQueue: nil
)

// 页面或组件销毁且不再需要监听时调用。
EMClient.shared().groupManager?.removeDelegate(groupEventListener)

```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createGroupWithSubject`](#创建群组) | `IEMGroupManager` | 异步创建群组。 |
| [`destroyGroup`](#解散群组) | `IEMGroupManager` | 解散群组。 |
| [`addMembers`](#邀请用户入群) | `IEMGroupManager` | 邀请用户加入群组。 |
| [`acceptInvitationFromGroup`](#邀请用户入群) / [`declineGroupInvitation`](#邀请用户入群) | `IEMGroupManager` | 接受或拒绝群组邀请。 |
| [`joinPublicGroup`](#用户申请入群) / [`requestToJoinPublicGroup`](#用户申请入群) | `IEMGroupManager` | 直接加入或申请加入公开群。 |
| [`approveJoinGroupRequest`](#用户申请入群) / [`declineJoinGroupRequest`](#用户申请入群) | `IEMGroupManager` | 同意或拒绝入群申请。 |
| [`leaveGroup`](#主动退出) | `IEMGroupManager` | 主动退出群组。 |
| [`removeMembers`](#移出成员) | `IEMGroupManager` | 将一个或多个成员移出群组。 |
| [`dataSyncType`](#获取当前用户加入的群组列表) | `EMOptions` | 配置登录后自动同步已加入群组数据。 |
| [`getJoinedGroups`](#获取当前用户加入的群组列表) | `IEMGroupManager` | 从本地读取当前用户已加入的群组列表。 |
| [`getJoinedGroupsCountFromServerWithCompletion`](#查询当前用户已加入的群组数量) | `IEMGroupManager` | 从服务器获取当前用户已加入的群组数量。 |
| [`blockGroup`](#屏蔽群消息) / [`unblockGroup`](#解除屏蔽群消息) | `IEMGroupManager` | 屏蔽或解除屏蔽群消息。 |
| [`getGroupSpecificationFromServerWithId`](#检查当前用户是否已屏蔽群消息) | `IEMGroupManager` | 从服务器获取群详情。 |
| [`isBlocked`](#检查当前用户是否已屏蔽群消息) | `EMGroup` | 判断当前用户是否已屏蔽指定群组消息。 |
