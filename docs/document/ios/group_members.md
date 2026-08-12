# 群组成员管理

## 功能说明

本文介绍如何使用 iOS SDK 管理群组成员，包括获取成员列表、设置成员自定义属性、管理群主和管理员、白名单、黑名单及禁言。加入、退出和移出群组请参见 [创建和管理群组](group_manage.html)。

## 前提条件

- 已完成 [SDK 初始化](initialization.html) 并成功登录。
- 已了解群成员角色及其权限，参见[群组概述](group_overview.html)。
- 已了解群成员数量、接口调用频率和成员属性大小等限制，参见[使用限制](/product/limitation.html)。

## 获取群成员列表

可通过两种方式获取群成员列表：

- 分页获取群成员信息：通过 `fetchGroupMemberInfoListFromServerWithGroupId` 从服务器分页获取成员详情。
- 分页获取群成员 ID：通过 `getGroupMemberListFromServerWithId` 从服务器分页获取成员 ID。

### 分页获取群成员信息

调用 `fetchGroupMemberInfoListFromServerWithGroupId` 分页获取群成员信息。返回的成员信息为 `EMGroupMemberInfo`，包含用户 ID、入群时间、角色、群名片、昵称和头像 URL。

```swift
EMClient.shared().groupManager?.fetchGroupMemberInfoListFromServer(
    withGroupId: "groupId",
    // 首次请求时 `cursor` 传空字符串；后续请求传入上一次结果的 `cursor`。
    cursor: "",
    limit: 50
) { result, error in
    if let error {
        print("获取群成员失败：\(error.errorDescription)")
        return
    }

    let members = result?.list ?? []
    let nextCursor = result?.cursor
    for member in members {
        print("用户：\(member.userId)，入群时间：\(member.joinedTimestamp)")
    }
    // nextCursor 为 nil 或空字符串时，表示没有更多数据。
}
```

`EMGroupMemberInfo` 的主要属性如下：

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `userId` | `String` | 群成员的用户 ID。 |
| `joinedTimestamp` | `UInt` | 入群时间戳，单位为毫秒。 |
| `role` | `EMGroupPermissionType` | 成员角色，如群主、管理员或普通成员。 |
| `namecard` | `String?` | 群名片。 |
| `nickname` | `String?` | 用户昵称。 |
| `avatarUrl` | `String?` | 用户头像 URL。 |

### 分页获取群成员 ID

如仅需成员用户 ID，可调用 `getGroupMemberListFromServerWithId`。

```swift
EMClient.shared().groupManager?.getGroupMemberListFromServer(
    withId: "groupId",
    cursor: nil,
    pageSize: 50
) { result, error in
    if let error {
        print("获取群成员列表失败：\(error.errorDescription)")
        return
    }

    let userIds = result?.list ?? []
    let nextCursor = result?.cursor

    print("当前页成员：\(userIds)")

    // nextCursor 为 nil 或空字符串时，表示没有更多数据。
}
```

此外，调用 `getGroupSpecificationFromServerWithId` 并将 `fetchMembers` 设为 `true` 可在 `memberList` 中取得成员列表；该接口默认最多返回 200 名成员，不适合替代完整成员列表的分页获取。

## 管理群成员自定义属性

群成员自定义属性是群组维度的成员信息，适用于业务标签等场景，采用字符串 key-value 结构。

- 单个群成员的自定义属性总长度不能超过 4 KB。
- 单个属性的 key 不超过 16 字节，value 不超过 512 字节。
- 群主可修改所有群成员的属性；其他成员仅可修改自己的属性。

### 设置群成员的自定义属性

调用 `setMemberAttribute` 设置指定成员的属性。将某个 key 对应的 value 设置为空字符串可删除该属性。设置成功后，群内其他成员会收到 `onAttributesChangedOfGroupMember` 回调。

```swift
let attributes = [
    "department": "product",
    "roleTag": "speaker"
]

EMClient.shared().groupManager?.setMemberAttribute(
    "groupId",
    userId: "userId",
    attributes: attributes
) { error in
    if let error {
        print("设置成员属性失败：\(error.errorDescription)")
    }
}
```

### 获取单个群成员的自定义属性

调用 `fetchMemberAttribute` 获取指定群成员的全部自定义属性。成功时，completion 返回 `[String: String]?`，其中 key 为属性名称，value 为属性值。

若该成员未设置自定义属性，返回的属性字典可能为空或为 `nil`；业务侧应按需处理。

```swift
EMClient.shared().groupManager?.fetchMemberAttribute(
    "groupId",
    userId: "userId"
) { attributes, error in
    if let error {
        print("获取成员属性失败：\(error.errorDescription)")
        return
    }
    print(attributes ?? [:])
}
```

### 根据属性 key 获取群成员自定义属性

调用 `fetchMembersAttributes` 按属性 key 批量获取成员属性。`keys` 传空数组时获取这些成员的全部属性。

:::tip
每次最多可获取 10 个群成员的自定义属性。
:::

```swift
EMClient.shared().groupManager?.fetchMembersAttributes(
    "groupId",
    userIds: ["user1", "user2"],
    keys: ["department", "roleTag"]
) { attributes, error in
    if let error {
        print("批量获取成员属性失败：\(error.errorDescription)")
        return
    }
    print(attributes ?? [:])
}
```

## 管理群主和群管理员

### 变更群主

仅群主可调用 `updateGroupOwner` 转让群主身份。成功后，原群主成为普通成员，新群主拥有群主权限。群成员会收到 `groupOwnerDidUpdate` 回调。

```swift
EMClient.shared().groupManager?.updateGroupOwner(
    "groupId",
    newOwner: "newOwnerId"
) { _, error in
    if let error {
        print("变更群主失败：\(error.errorDescription)")
    }
}
```

### 添加群管理员

仅群主可调用 `addAdmin` 添加管理员。成功后，新管理员和其他管理员会接收到群组事件回调会收到 `groupAdminListDidUpdate` 回调。

管理员除了不能解散群组等少数权限外，拥有对群组的绝大部分权限。

```swift
EMClient.shared().groupManager?.addAdmin(
    "userId",
    toGroup: "groupId"
) { _, error in
    if let error {
        print("添加群管理员失败：\(error.errorDescription)")
    }
}
```

### 移除群管理员

仅群主可调用 `removeAdmin` 移除管理员。成功后，被移除的管理员及其他管理员会收到 `groupAdminListDidUpdate` 回调。

群管理员被移除群管理权限后将只拥有普通群成员的权限。

```swift
EMClient.shared().groupManager?.removeAdmin(
    "userId",
    fromGroup: "groupId"
) { _, error in
    if let error {
        print("移除群管理员失败：\(error.errorDescription)")
    }
}
```

### 获取群管理员列表

调用 `getGroupSpecificationFromServerWithId` [获取群详情](group_attributes.html#获取群组详情) 后，从 `adminList` 读取管理员的用户 ID 列表。

```swift
EMClient.shared().groupManager?.getGroupSpecificationFromServer(
    withId: "groupId"
) { group, error in
    if let error {
        print("获取群详情失败：\(error.errorDescription)")
        return
    }

    let adminIds = group?.adminList ?? []
    print("群管理员列表：\(adminIds)")
}
```

## 管理群组白名单

群组白名单用于控制全员禁言场景下仍可发言的成员。群主和群管理员默认属于白名单。

:::tip
全员禁言和单独禁言相互独立。全员禁言时，白名单成员仍可发送群消息；如果该成员同时被单独禁言，则单独禁言优先，该成员仍不能发送群消息。
:::

### 添加成员到白名单

仅群主或群管理员可调用 `addWhiteListMembers` 添加白名单成员。成功后，该成员以及群主和群管理员（除操作者外）会收到 `groupWhiteListDidUpdate` 回调。

即使开启了全员禁言，白名单中的成员仍可发送群消息；但如果某个成员同时在禁言列表中，则无法发送群消息。

```swift
EMClient.shared().groupManager?.addWhiteListMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("添加白名单失败：\(error.errorDescription)") }
}
```

### 从白名单移除成员

仅群主或群管理员可调用 `removeWhiteListMembers` 移除白名单成员。成功后，该群成员及其他未操作的群管理员和群主将会收到 `groupWhiteListDidUpdate` 回调。

```swift
EMClient.shared().groupManager?.removeWhiteListMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("移除白名单失败：\(error.errorDescription)") }
}
```

### 查询当前用户是否在白名单中

所有群成员均可调用 `isMemberInWhiteListFromServerWithGroupId` 查询当前登录用户是否在群白名单中。

```swift
EMClient.shared().groupManager?.isMember(inWhiteListFromServerWithGroupId: "groupId") { inWhiteList, error in
    if let error {
        print("查询白名单失败：\(error.errorDescription)")
        return
    }
    print("是否在白名单中：\(inWhiteList)")
}
```

### 获取白名单列表

仅群主或群管理员可调用 `getGroupWhiteListFromServerWithId` 从服务器获取当前群组的白名单。

```swift
EMClient.shared().groupManager?.getGroupWhiteListFromServer(withId: "groupId") { members, error in
    if let error { print("获取白名单失败：\(error.errorDescription)") }
    else { print(members ?? []) }
}
```

## 管理群组黑名单

群组黑名单用于禁止指定用户加入或继续留在群组。成员被加入黑名单后会被移出群组，无法继续收发该群消息；只有先从黑名单中移除，才可再次申请或被邀请加入。

### 添加成员到黑名单

仅群主或群管理员可调用 `blockMembers` 添加黑名单成员。被加入黑名单的成员会收到  `didLeaveGroup` 回调。默认情况下，其他群成员不会收到事件通知。如需该事件，请联系商务开通。

黑名单中的成员会被移出群组，无法再收发群消息，只有先被移出黑名单才能重新加入群组。

```swift
EMClient.shared().groupManager?.blockMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("添加黑名单失败：\(error.errorDescription)") }
}
```

### 从黑名单移除成员

仅群主或群管理员可调用 `unblockMembers` 将一个或多个用户移出群黑名单。移除后，用户可以再次申请或被邀请加入群组。

```swift
EMClient.shared().groupManager?.unblockMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("移除黑名单失败：\(error.errorDescription)") }
}
```

### 获取黑名单列表

仅群主或群管理员可调用 `getGroupBlacklistFromServerWithId` 分页获取黑名单成员列表。

```swift
EMClient.shared().groupManager?.getGroupBlacklistFromServer(
    withId: "groupId",
    pageNumber: 1,
    pageSize: 50
) { members, error in
    if let error { print("获取黑名单失败：\(error.errorDescription)") }
    else { print(members ?? []) }
}
```

## 管理群组禁言

群主和管理员可以对群成员单独禁言，也可以对全员禁言。这两种禁言方式相互独立，互不影响：
- 单独禁言：将指定用户加入禁言列表。被禁言成员不能发送群消息。禁言时长的单位为毫秒。
- 全员禁言：一键禁言群组所有成员。白名单成员可发言；若成员同时被单独禁言，则单独禁言优先，禁止发言。
- 开启或关闭全员禁言不会影响单个成员的禁言列表。

### 禁言指定成员

仅群主或群管理员可以调用 `muteMembers` 禁言指定成员。加入禁言列表后，被禁言成员、群管理员和群主（除操作者外）会收到 `groupMuteListDidUpdate` 回调。

```swift
EMClient.shared().groupManager?.muteMembers(
    ["userId"],
    //单位为毫秒，传入 `-1` 表示永久禁言。
    muteMilliseconds: 3_600_000,
    fromGroup: "groupId"
) { _, error in
    if let error { print("禁言成员失败：\(error.errorDescription)") }
}
```

### 解除指定成员禁言

仅群主或群管理员可以调用 `unmuteMembers` 解除指定成员禁言。解除禁言后，被解除禁言的成员、群管理员和群主（除操作者外）会收到 `groupMuteListDidUpdate` 回调。

```swift
EMClient.shared().groupManager?.unmuteMembers(
    ["userId"],
    fromGroup: "groupId"
) { _, error in
    if let error { print("解除禁言失败：\(error.errorDescription)") }
}
```

### 查询当前用户是否被禁言

群成员可以调用 `isMemberInMuteListFromServerWithGroupId` 查询当前用户是否在群禁言列表中。

```swift
EMClient.shared().groupManager?.isMember(inMuteListFromServerWithGroupId: "groupId") { inMuteList, error in
    if let error { print("查询禁言状态失败：\(error.errorDescription)") }
    else { print("是否被禁言：\(inMuteList)") }
}
```

### 获取禁言列表

仅群主或群管理员可以调用 `fetchGroupMuteListFromServerWithId` 获取禁言成员及其禁言到期时间。返回字典的 `key` 为用户 ID，`value` 为 `NSNumber` 类型的到期时间。

```swift
EMClient.shared().groupManager?.fetchGroupMuteListFromServer(
    withId: "groupId",
    // `pageNum` 从 `1` 开始。
    pageNumber: 1,
    pageSize: 50
) { muteList, error in
    if let error { print("获取禁言列表失败：\(error.errorDescription)") }
    else { print(muteList ?? [:]) }
}
```

### 开启全员禁言

仅群主或群管理员可以调用 `muteAllMembersFromGroup` 开启全员禁言。成功后，群成员会收到 `groupAllMemberMuteChanged` 回调。

全员禁言不会自动到期，如要关闭需主动调用关闭接口。

```swift
EMClient.shared().groupManager?.muteAllMembers(fromGroup: "groupId") { _, error in
    if let error { print("开启全员禁言失败：\(error.errorDescription)") }
}
```

### 关闭全员禁言

仅群主或群管理员可以调用 `unmuteAllMembersFromGroup` 关闭全员禁言。关闭后，群成员会收到 `groupAllMemberMuteChanged` 回调。

```swift
EMClient.shared().groupManager?.unmuteAllMembers(fromGroup: "groupId") { _, error in
    if let error { print("关闭全员禁言失败：\(error.errorDescription)") }
}
```

## 监听群组成员事件

实现 `EMGroupManagerDelegate` 并通过 `addDelegate` 注册。关于群组成员相关操作成功后触发的回调事件，详见 [监听群组事件](group_manage.html#监听群组事件)。

## 注意事项

- 群详情、管理员列表和成员列表并非始终完整缓存。需要服务端最新数据时，应调用对应的异步获取接口。
- 所有示例均使用异步接口；在 completion 中根据 `EMError?` 是否为 `nil` 判断操作是否成功。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchGroupMemberInfoListFromServerWithGroupId`](#分页获取群成员信息) | `IEMGroupManager` | 获取成员详细信息 |
| [`getGroupMemberListFromServerWithId`](#分页获取群成员-id) | `IEMGroupManager` | 获取成员 ID 列表 |
| [`setMemberAttribute`](#设置群成员的自定义属性) | `IEMGroupManager` | 设置成员属性 |
| [`fetchMemberAttribute`](#获取单个群成员的自定义属性) | `IEMGroupManager` | 获取单个成员属性 |
| [`fetchMembersAttributes`](#根据属性-key-获取群成员自定义属性) | `IEMGroupManager` | 批量获取成员属性 |
| [`updateGroupOwner`](#变更群主) | `IEMGroupManager` | 变更群主 |
| [`addAdmin`](#添加群管理员) | `IEMGroupManager` | 添加管理员 |
| [`removeAdmin`](#移除群管理员) | `IEMGroupManager` | 移除管理员 |
| [`addWhiteListMembers`](#添加成员到白名单) | `IEMGroupManager` | 添加或移除白名单成员 |
| [`isMemberInWhiteListFromServerWithGroupId`](#查询当前用户是否在白名单中) | `IEMGroupManager` | 查询或获取白名单 |
| [`blockMembers`](#添加成员到黑名单) | `IEMGroupManager` | 添加或移除黑名单成员 |
| [`getGroupBlacklistFromServerWithId`](#获取黑名单列表) | `IEMGroupManager` | 获取黑名单 |
| [`muteMembers`](#禁言指定成员) | `IEMGroupManager` | 禁言或解除成员禁言 |
| [`isMemberInMuteListFromServerWithGroupId`](#查询当前用户是否被禁言) | `IEMGroupManager` | 查询或获取禁言列表 |
| [`muteAllMembersFromGroup`](#开启全员禁言) | `IEMGroupManager` | 开启或关闭全员禁言 |
