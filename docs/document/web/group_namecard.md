# 管理群成员名片

## 功能说明

群成员名片是用户在特定群组内的个性化显示信息，用于区分该用户在不同群组中的身份展示，例如，展示部门、岗位、项目角色等群内身份信息。

例如，在企业群组中，成员可将在群组中的名片设置为“部门-姓名”或“岗位-姓名”的格式，便于群内成员快速识别和沟通。

环信即时通讯 IM SDK 提供群成员名片管理功能，支持群成员名片的设置、服务端获取和变更监听。开启用户信息自动管理功能后，SDK 还支持通过消息自动同步群成员名片更新。

## 技术原理

群成员名片在 SDK 中通过群成员自定义属性实现，主要由 `GroupManager` 和群组事件提供。SDK 通过“主动设置或拉取、内部缓存、事件通知、消息触发自动同步”的机制管理群成员名片，具体如下：

1. 当前登录用户可通过 `client.groupManager.getGroup(groupId).setMemberAttributes` 设置或更新自己在指定群组中的群成员名片。若当前用户具备相应权限，也可设置指定成员的群成员名片。
2. 当群成员名片发生变更并同步到 SDK 内部缓存后，SDK 会通过 `onUserGroupNamecardUpdated` 事件通知业务层。
3. SDK 支持通过 `client.groupManager.getGroup(groupId).getMembersAttributes` 从服务端批量获取群成员属性。群成员名片对应的属性 key 建议使用 `groupNamecard`。
4. 若初始化 SDK 时开启 `enableUserInfoSync: true`，发送群聊消息时会自动附带发送方群成员名片更新时间；接收方在检测到消息中的更新时间晚于本地缓存，或本地尚无对应缓存时，会自动从服务端拉取最新群成员名片、更新 SDK 内部缓存，并触发事件通知业务层。

缓存更新流程如下图所示：

![img](/images/web/memory_update_groupcard.png)

## 前提条件

开始接入前，请确保满足以下条件：

- 已完成 SDK 初始化。详见[快速开始](quickstart.html)。
- 初始化 SDK 时已注册 `GroupManager` 和 `UserInfoManager`。
- 若需要通过消息自动同步群成员名片，还需注册 `UserInfoManager` 并开启 `enableUserInfoSync: true`。
- 已了解群成员属性数量、key 长度、value 长度和总大小等服务限制。详见[使用限制](/product/limitation.html)。

## 监听群成员名片更新

SDK 提供 `onUserGroupNamecardUpdated` 事件，用于监听群成员名片更新。建议在业务初始化阶段完成监听注册，以便在群成员名片更新后及时刷新界面。

当群成员名片发生变更并同步到 SDK 内部缓存后，SDK 会触发 `onUserGroupNamecardUpdated` 事件。该事件适用于以下场景：

- 当前登录用户更新群成员名片后，群内其他 **在线成员** 收到变更通知。
- 开启 `enableUserInfoSync: true` 后，接收方因接收群聊消息触发自动同步并更新内部缓存后。
- SDK 收到群成员属性变更通知，并识别到变更内容中包含群成员名片字段后。

- 添加监听：

```typescript
client.groupManager.addEventHandler('group-namecard-listener', {
  onGroupMemberAttributeChanged: event => {
    console.log('群成员属性变更 groupId:', event.groupId);
    console.log('变更成员:', event.user?.userId);
    console.log('变更后的属性:', event.attribute);
  },

  onUserGroupNamecardUpdated: event => {
    console.log('群成员名片更新 groupId:', event.groupId);
    console.log('用户 ID:', event.userId);
    console.log('群成员名片:', event.namecard);
  },
});
```

事件说明：

| 事件名称 | 触发时机 | 说明 |
| :--- | :--- | :--- |
| `onGroupMemberAttributeChanged` | 群成员属性发生变更后 | 事件载荷包含 `groupId`、变更成员、变更后的属性、操作者和变更来源。 |
| `onUserGroupNamecardUpdated` | SDK 识别到群名片变更并更新群名片缓存后 | 事件载荷包含 `groupId`、`userId` 和更新后的 `namecard`。 |

## 设置群成员名片

你可以先调用 `getGroup` 获取单群对象，再调用 `setMemberAttributes` 设置自己在该群中的名片，传空字符传可以删除群名片。群成员名片属于群成员属性，需通过 `memberAttributes` 传入，属性 key 建议统一使用 `groupNamecard`。

```typescript
await client.groupManager.getGroup('groupId').setMemberAttributes({
  userId: 'currentUserId',
  memberAttributes: {
    groupNamecard: 'new_namecard',
  },
});

console.log('设置群成员名片成功');
```

设置成功后，其他在线群成员会收到 `onGroupMemberAttributeChanged` 和 `onUserGroupNamecardUpdated` 事件。
如果当前用户还有其他在线设备，这些设备会收到多设备群组事件 `onMultiDeviceGroup`，`operation` 为 `GROUP_MEMBER_METADATA_CHANGED`。

:::tip 
SDK 兼容 `group_namecard`、`group_name_card`、`namecard` 和 `nameCard` 作为群成员名片字段，但为了避免业务侧多字段混用，建议统一使用 `groupNamecard`。
:::

## 从服务端获取群成员名片

调用 `getMembersAttributes` 可从服务端批量获取群成员属性。查询群成员名片时，可将 `keys` 设置为 `['groupNamecard']`。

若需要同时获取成员的其他自定义属性，可在 `keys` 中传入多个属性 key；若不传 `keys`，则返回服务端可返回的成员属性集合。

```typescript
const result = await client.groupManager.getGroup('groupId').getMembersAttributes({
  userIds: ['user1', 'user2'],
  keys: ['groupNamecard'],
});

Object.entries(result.items).forEach(([userId, attributes]) => {
  console.log('userId:', userId);
  console.log('namecard:', attributes.groupNamecard);
});
```

返回结果为按用户 ID 索引的群成员属性集合：

```typescript
{
  items: {
    user1: {
      groupNamecard: '研发部-Alice',
    },
    user2: {
      groupNamecard: '产品部-Bob',
    },
  },
}
```

## 通过消息自动同步群成员名片

如果希望在发送群聊消息时自动携带群成员名片更新时间，并在接收群聊消息时自动更新 SDK 内部缓存，需要开启用户信息自动管理功能，即在 `ChatClient.init` 初始化 SDK 时传入 `enableUserInfoSync: true`。

```typescript
const client = ChatClient.init({
  appKey: 'your_appkey',
  enableUserInfoSync: true,
  managers: [GroupManager, UserInfoManager],
});
```

用户信息自动管理功能开启后，SDK 会执行以下操作：

1. 当前登录用户设置自己的群成员名片后，SDK 会将群名片和更新时间写入内部缓存。
2. 当前登录用户发送群聊消息时，SDK 会自动附带群成员名片更新时间。
3. 接收方收到群聊消息后，SDK 会比较消息中的群成员名片更新时间和本地缓存。
4. 如果消息中的更新时间晚于本地缓存，或本地没有对应群名片缓存，SDK 会自动从服务端拉取发送方在该群中的群成员名片。
5. 拉取成功并更新本地群名片缓存后，SDK 会触发 `onUserGroupNamecardUpdated` 事件通知业务层。

SDK 中 消息对象的 `message.sender` 当前主要提供发送方基础用户属性，例如 `userId`、`nickname` 和 `avatarUrl`，不直接作为群成员名片的公开读取入口。如需展示群成员名片，建议结合 `getMembersAttributes`、`onUserGroupNamecardUpdated` 以及业务侧本地展示数据处理。详见 [用户信息自动管理](userinfo_provider.html#通过消息获取发送方信息)。

## 注意事项

- 群成员名片是用户在特定群组中的显示信息，不同群组之间互不影响。
- `onUserGroupNamecardUpdated` 对群内在线成员投递。
- 若需通过消息自动同步群成员名片，必须在 SDK 初始化时传入 `enableUserInfoSync: true`，并注册 `GroupManager` 和 `UserInfoManager`。
- 开启 `enableUserInfoSync: true` 后，群成员名片的自动更新依赖群聊消息触发；若业务需要主动获取最新数据，仍应调用服务端接口。

## 常见问题

#### 设置群成员名片后，为什么其他成员没有立即收到更新？

调用 `setMemberAttributes` 设置成功后，其他在线成员通常会收到 `onGroupMemberAttributeChanged`。如果 SDK 能识别该变更包含群成员名片并更新群名片缓存，还会触发 `onUserGroupNamecardUpdated`。离线成员可能需要后续通过主动查询或消息自动同步获取最新名片。

#### 为什么不能直接从 SDK 本地缓存读取群成员名片？

当前 SDK 未提供公开本地群成员名片读取 API。若需要主动获取指定成员的群成员名片，可调用 `client.groupManager.getGroup(groupId).getMembersAttributes` 从服务端查询；若需要响应名片变化，可监听 `onUserGroupNamecardUpdated` 事件。

#### 从服务端获取的群成员信息是否写入 SDK 内部缓存？

通过消息自动同步群成员名片时，SDK 会将拉取到的群成员名片写入内部缓存。主动调用 `getMembersAttributes` 可获取服务端的群成员属性；业务展示建议直接使用接口返回值更新 UI，或在业务侧维护本地展示数据。

#### 开启用户信息自动管理后，群成员名片为何会自动更新？

开启用户信息自动管理 `enableUserInfoSync: true` 后，发送群聊消息时会自动附带发送方群成员名片更新时间。接收方收到群聊消息后，SDK 会将消息中的更新时间与本地缓存进行比较。如果消息中的更新时间晚于本地缓存，或本地尚无对应缓存，SDK 会自动从服务端拉取最新群成员名片并更新内部缓存。

#### 通过消息自动同步群成员名片后，还需主动从服务端获取吗？

视业务场景而定。通过消息自动同步依赖群聊消息触发；如果业务需要立即获取最新群成员名片，或当前没有群聊消息触发同步，仍建议调用 `client.groupManager.getGroup(groupId).getMembersAttributes` 主动从服务端获取最新数据。

## 相关文档

- [用户信息自动管理](userinfo_provider.html)
- [管理用户属性](userprofile.html)
- [群组管理](group_manage.html)
- [使用限制](/product/limitation.html)

## 接口列表

| API 名称 | 所属类/模块    | 说明    |
| :--- | :--- | :--- |
| [`getGroup`](#设置群成员名片)  | `GroupManager` | 获取绑定指定群组 ID 的 `Group` 单群对象。 |
| [`setMemberAttributes`](#设置群成员名片)  | `Group` | 通过 `Group` 单群对象设置群成员名片。 |
| [`getMembersAttributes`](#从服务端获取群成员名片)  | `Group`        | 通过 `Group` 单群对象批量获取群成员名片。 |
| [`getGroupMembersAttributes`](#从服务端获取群成员名片) | `GroupManager` | 通过 `GroupManager` 批量获取群成员名片。 |
| [`ChatClient.init`](#通过消息自动同步群成员名片) | `ChatClient`   | 初始化 SDK，并可开启 `enableUserInfoSync` 以支持消息资料自动同步。 |
