# 管理群成员名片

## 功能说明

群成员名片是用户在特定群组内的个性化显示信息，用于区分该用户在不同群组中的身份展示，例如，展示部门、岗位、项目角色等群内身份信息。

例如，在企业群组中，成员可将在群组中的名片设置为“部门-姓名”或“岗位-姓名”的格式，便于群内成员快速识别和沟通。

**自 HarmonyOS SDK 1.13.0 版本** 开始提供群成员名片管理功能，支持群成员名片的设置、本地查询、服务端获取和变更监听。开启 [用户信息自动管理功能](userinfo_provider.html) 后，SDK 还支持通过消息自动同步群成员名片更新。

## 技术原理

群成员名片管理功能主要由 `GroupManager`、`GroupListener` 和 `GroupMember` 提供。SDK 通过“主动设置或拉取、本地内存存储、事件通知、消息触发自动同步”的机制管理群成员名片，具体如下：

1. 当前登录用户可通过 `GroupManager#updateGroupNamecard` 设置或更新自己在指定群组中的群成员名片。
2. 群成员名片发生变化并同步到本地内存后，SDK 会通过 `GroupListener#onUserGroupNamecardUpdated` 通知业务层。
3. SDK 支持通过 `GroupManager#fetchGroupMemberDetails` 从服务端批量获取群成员信息，并将返回的群成员名片写入本地内存。返回的 `GroupMember` 包含成员 ID、群名片、昵称、头像、角色和入群时间等信息。
4. SDK 支持通过 `GroupManager#getGroupNamecard` 从本地内存读取指定成员在指定群组中的群成员名片。
5. 开启 [用户信息自动管理功能](userinfo_provider.html) 后，发送消息时会自动携带发送方信息信息更新时间。接收方可通过 `ChatMessage#getSenderInfo` 获取发送方的用户 ID、昵称、头像、群名片和联系人备注。接收方在检测到消息中的更新时间晚于本地内存时，会自动从服务端拉取最新群成员名片、更新本地内存，并触发事件通知业务层。
 
内存更新流程如下图所示：

![img](/images/harmonyos/memory_update_groupcard.png)

## 前提条件

开始接入前，请确保满足以下条件：

- 已将 HarmonyOS SDK 升级至 v1.13.0 或以上版本。
- 已完成 SDK 的初始化并成功登录，详见 [初始化文档](initialization.html)。
- 已了解即时通讯 IM 的相关使用限制，详见[使用限制](/product/limitation.html)。

## 监听群成员名片更新

SDK 提供 `GroupListener` 用于监听群成员名片更新事件。建议在业务初始化阶段完成监听注册，并在不需要时移除监听器。

当群成员名片发生变更并同步到本地内存后，SDK 会触发 `GroupListener#onUserGroupNamecardUpdated`。该事件适用于以下场景：

- 当前登录用户更新群成员名片后，群内其他 **在线成员** 收到变更通知。
- [调用接口从服务端获取到最新群成员信息](group_manage.html#获取群成员列表) 并更新本地内存后。
- 开启 [用户信息自动管理功能](userinfo_provider.html) 后，接收消息触发发送方信息更新后。

添加监听的示例代码如下所示：

```typescript
let groupListener: GroupListener = {
  onUserGroupNamecardUpdated: (groupId: string, userId: string, namecard: string): void => {
    // 群成员名片更新，刷新群成员展示信息。
  }
};

// 注册群组事件监听。
ChatClient.getInstance().groupManager()?.addListener(groupListener);

// 不需要时移除监听（在页面销毁或业务结束时调用）。
// ChatClient.getInstance().groupManager()?.removeListener(groupListener);
```

## 设置群成员名片

调用 `GroupManager#updateGroupNamecard` 设置或更新当前登录用户在指定群组中的群成员名片。群内其他在线成员在接收到对应的群成员名片变更通知后，会触发 `GroupListener#onUserGroupNamecardUpdated` 事件。

```typescript
let groupManager = ChatClient.getInstance().groupManager();
if (!groupManager) {
  return;
}

groupManager.updateGroupNamecard('groupId', 'new_namecard')
  .then(() => {
    // 设置群成员名片成功。
  })
  .catch((error: ChatError) => {
    // 设置群成员名片失败。
  });
```

## 从服务端获取群成员名片

调用 `GroupManager#fetchGroupMemberDetails` 从服务端分页获取群成员信息。获取成功后，返回的群成员信息（包括群成员名片）会同步到本地内存。

`GroupMember` 提供以下常用属性：

- `memberId`：群成员用户 ID。
- `namecard`：成员在当前群组中的群成员名片。
- `nickname`：成员的用户昵称。
- `avatarUrl`：成员头像 URL。
- `joinTime`：成员入群时间。
- `role`：成员在群组中的角色。

```typescript
// `pageSize` 的取值范围为 1-50。
// 首次调用时省略 `cursor` 或传入空字符串，后续传入上次返回的游标。
let groupManager = ChatClient.getInstance().groupManager();
if (!groupManager) {
  return;
}

groupManager.fetchGroupMemberDetails('groupId', 20)
  .then((result: CursorResult<GroupMember>) => {
    result.getResult().forEach((member: GroupMember): void => {
      const userId = member.memberId;
      const nickname = member.nickname;
      const avatarUrl = member.avatarUrl;
      const namecard = member.namecard;
      const joinTime = member.joinTime;
      // 使用群成员信息更新界面。
    });

    // 还有下一页时，使用 result.getNextCursor() 继续获取。
    const nextCursor = result.getNextCursor();
  })
  .catch((error: ChatError) => {
    // 获取群成员信息失败。
  });
```

## 从本地内存获取群成员名片

调用 `GroupManager#getGroupNamecard` 可从本地内存读取指定成员在指定群组中的群成员名片。该方法为同步方法，不会发起网络请求；如果 SDK 未初始化群组管理器或本地内存中没有对应数据，返回空字符串。

```typescript
let groupManager = ChatClient.getInstance().groupManager();
if (groupManager) {
  const namecard = groupManager.getGroupNamecard('groupId', 'userId');
  // 使用 namecard 更新界面。
}
```

## 通过消息自动同步群成员名片

如果希望在发送消息时自动携带群成员名片更新时间，并在接收消息时自动更新本地内存，需要在初始化 SDK 前调用 `ChatOptions#setEnableUserInfo(true)` 开启 [用户信息自动管理功能](userinfo_provider.html)。

```typescript
const options = new ChatOptions({ appKey: 'your-org#your-app' });
options.setEnableUserInfo(true);

// 使用 options 调用 ChatClient#init 初始化 SDK。
ChatClient.getInstance().init(context, options);
```

:::tip
必须在调用 `ChatClient#init` 之前调用 `ChatOptions#setEnableUserInfo(true)`，否则消息发送方信息和用户信息本地内存功能不会生效。
:::

用户信息自动管理功能开启后，SDK 会执行以下操作：

1. 当前登录用户更新群成员名片后，后续发送的消息会自动附带群成员名片更新时间。
2. 接收方收到消息后，SDK 会将消息中的群成员名片更新时间与本地内存进行比较。
3. 如果消息中的更新时间晚于本地内存，SDK 会自动从服务端拉取最新群成员名片。
4. 获取成功后，SDK 会更新本地内存，并触发 `GroupListener#onUserGroupNamecardUpdated` 事件。

开启用户信息功能后，接收消息时可以通过 `ChatMessage#getSenderInfo` 获取发送方信息：

```typescript
let senderInfo = message.getSenderInfo();
if (senderInfo) {
  const userId = senderInfo.userId;
  const nickname = senderInfo.nickname;
  const avatarUrl = senderInfo.avatarUrl;
  const namecard = senderInfo.namecard;
  const remark = senderInfo.remark;
}
```

## 注意事项

- 群成员名片是用户在特定群组中的显示信息，不同群组之间互不影响。
- `GroupManager#getGroupNamecard` 仅查询本地内存，不会主动从服务端获取最新数据。

## 常见问题

#### 设置群成员名片后，为何其他成员未立即收到事件？

调用 `GroupManager#updateGroupNamecard` 后，群内其他在线成员在收到对应的群成员名片变更通知后，才会触发 `GroupListener#onUserGroupNamecardUpdated`。离线成员重新上线后，业务侧可通过 `fetchGroupMemberDetails` 主动获取最新群成员信息。

#### 为何调用 `getGroupNamecard` 获取不到群成员名片？

`getGroupNamecard` 只读取本地内存，不会发起网络请求。如果本地内存中尚无对应成员的群成员名片，返回值可能为空。此时可先调用 `fetchGroupMemberDetails` 从服务端获取群成员信息。

#### 从服务端获取的群成员信息是否写内存？

会。调用 `fetchGroupMemberDetails` 成功后，返回的群成员信息会同步到本地内存，后续可通过 `getGroupNamecard` 读取对应群成员名片。

#### 为什么 `ChatMessage#getSenderInfo` 返回 `undefined`？

请确认是否已在 SDK 初始化前调用 `ChatOptions#setEnableUserInfo(true)`。该配置默认为 `false`，关闭时消息不会携带发送方信息。

#### 开启用户信息自动管理后，群成员名片为何会自动更新？

开启用户信息自动管理 `ChatOptions#setEnableUserInfo(true)` 后，发送消息时会自动附带发送方群成员名片更新时间。接收方收到消息后，SDK 会将消息中的更新时间与本地内存进行比较。如果消息中的更新时间晚于本地内存，SDK 会自动从服务端拉取最新群成员名片并更新本地内存。

#### 通过消息自动同步群成员名片后，还需主动从服务端获取吗？

视业务场景而定。通过消息自动同步依赖消息触发；如果业务需要立即获取最新群成员名片，或当前没有消息触发同步，仍建议调用 `fetchGroupMemberDetails` 主动从服务端获取最新数据。

## 相关文档

- [用户信息自动管理](userinfo_provider.html)
- [管理用户属性](userprofile.html)
- [用户关系管理](user_relationship.html)
- [使用限制](/product/limitation.html)

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`updateGroupNamecard`](#设置群成员名片) | `GroupManager` | 设置或更新当前用户在指定群组中的群成员名片。 |
| [`fetchGroupMemberDetails`](#从服务端获取群成员名片) | `GroupManager` | 分页获取群成员详细信息。 |
| [`getGroupNamecard`](#从本地内存获取群成员名片) | `GroupManager` | 从本地内存读取指定成员的群成员名片。 |
| [`onUserGroupNamecardUpdated`](#监听群成员名片更新) | `GroupListener` | 监听群成员名片更新事件。 |
| [`setEnableUserInfo`](#通过消息自动同步群成员名片) | `ChatOptions` | 开启用户信息和消息发送方信息能力。 |
| [`getSenderInfo`](#通过消息自动同步群成员名片) | `ChatMessage` | 获取消息发送方信息，包括群成员名片。 |
