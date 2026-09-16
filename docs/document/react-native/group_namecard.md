# 管理群成员名片

## 功能说明

群成员名片是用户在特定群组内的个性化显示信息，用于区分该用户在不同群组中的身份展示，例如，展示部门、岗位、项目角色等群内身份信息。

例如，在企业群组中，成员可将在群组中的名片设置为“部门-姓名”或“岗位-姓名”的格式，便于群内成员快速识别和沟通。

自 **React Native SDK 1.18.0 版本开始** 提供群成员名片管理功能，支持群成员名片的设置、本地查询、服务端获取和变更监听。开启 [用户信息自动管理功能](userinfo_provider.html) 后，SDK 还支持通过消息自动同步群成员名片更新。

## 技术原理

React Native SDK 基于 Android 和 iOS 原生 SDK，对群成员名片相关能力进行了统一封装，主要由 `ChatGroupManager` 和 `ChatGroupEventListener` 提供。

具体的内存更新流程请参见对应的原生平台文档：

- [Android 处理流程](/document/android/group_namecard.html#技术原理)
- [iOS 处理流程](/document/ios/group_namecard.html#技术原理)

## 前提条件

开始接入前，请确保满足以下条件：

- 已将 React Native SDK 升级至 v1.18.0 或以上版本。
- 已完成 SDK 初始化并成功登录，详见 [初始化](initialization.html) 和 [快速开始](quickstart.html)。
- 已了解即时通讯 IM 的相关使用限制，详见 [使用限制](/product/limitation.html)。

## 监听群成员名片更新

SDK 提供 `ChatGroupEventListener`，用于监听群成员名片更新事件。建议在业务初始化阶段完成监听注册，并在组件卸载或不再需要监听时移除监听器。

当群成员名片发生变更并同步到本地内存后，SDK 会触发 `ChatGroupEventListener#onUserGroupNamecardChanged` 事件。该事件适用于以下场景：

- 当前登录用户更新群成员名片后，群内其他 **在线成员** 收到变更通知。
- 调用服务端接口获取到最新群成员信息并更新本地内存后。
- 开启 [用户信息自动管理功能](userinfo_provider.html) 后，接收方因接收消息触发自动同步并更新本地内存后。

```typescript
const groupNamecardListener: ChatGroupEventListener = {
  onUserGroupNamecardChanged({ groupId, userId, namecard }) {
    console.log('群成员名片更新：', { groupId, userId, namecard });
    // namecard 为 undefined 表示该成员的群名片已被清除。
  },
};

ChatClient.getInstance().groupManager.addGroupListener(
  groupNamecardListener
);

// 在页面或组件卸载时调用，移除同一个监听器对象。
function removeGroupNamecardListener(): void {
  ChatClient.getInstance().groupManager.removeGroupListener(
    groupNamecardListener
  );
}
```

## 设置群成员名片

调用 `ChatGroupManager#updateGroupNamecard` 设置或更新当前登录用户在指定群组中的群成员名片。群内其他在线成员收到对应的群成员名片变更通知后，会触发 `ChatGroupEventListener#onUserGroupNamecardChanged` 事件。

```typescript
try {
  await ChatClient.getInstance().groupManager.updateGroupNamecard(
    'groupId',
    'new_namecard'
  );
  console.log('设置群成员名片成功');
} catch (error) {
  console.error('设置群成员名片失败：', error);
}
```

若要清除当前用户在该群组中的群名片，请省略第二个参数或传入 `undefined`：

```typescript
await ChatClient.getInstance().groupManager.updateGroupNamecard('groupId');
```

## 从服务端获取群成员名片

调用 `ChatGroupManager#fetchMemberInfoListFromServer` 从服务器分页获取群成员信息。若需获取群成员的群名片、昵称和头像地址，应在初始化 SDK 时将 `ChatOptions#enableUserInfo` 设为 `true`；否则，返回的 `ChatGroupMember` 不包含 `namecard`、`nickname` 和 `avatarUrl`。

获取成功后，相关群成员信息会自动更新至本地内存。有关该接口的更多说明，详见 [管理群成员](group_members.html#获取群成员列表)。

```typescript
// `limit` 的默认值为 200，实际上限取决于服务端配置。
// 首次调用时将 `cursor` 传入空字符串 `''`，后续调用时传入上一次返回的 `result.cursor`。
try {
  const result = await ChatClient.getInstance()
    .groupManager.fetchMemberInfoListFromServer('groupId', '', 200);

  for (const member of result.list ?? []) {
    console.log('群成员信息：', {
      userId: member.memberId,
      nickname: member.nickname,
      avatarUrl: member.avatarUrl,
      namecard: member.namecard,
    });
  }

  // 获取下一页时，将 result.cursor 作为 cursor 传入。
  // const nextResult = await ChatClient.getInstance()
  //   .groupManager.fetchMemberInfoListFromServer(
  //     'groupId',
  //     result.cursor,
  //     200
  //   );
} catch (error) {
  console.error('获取群成员信息失败：', error);
}
```

## 从本地内存获取群成员名片

调用 `ChatGroupManager#getGroupNamecard` 可从本地内存读取指定成员在指定群组中的群成员名片。该接口不会发起网络请求，适用于本地展示场景；本地不存在对应数据或群名片已清除时，返回 `undefined`。

```typescript
try {
  const namecard = await ChatClient.getInstance()
    .groupManager.getGroupNamecard('groupId', 'userId');
  console.log('群成员名片：', namecard);
} catch (error) {
  console.error('读取群成员名片失败：', error);
}
```

## 通过消息自动同步群成员名片

如果希望在发送消息时自动携带群成员名片的更新时间，并在接收消息时自动更新本地内存，需要在初始化 SDK 时开启 [用户信息自动管理功能](userinfo_provider.html)，即将 `ChatOptions#enableUserInfo` 设为 `true`。

```typescript
const options = ChatOptions.withAppKey({
  appKey: 'your-org#your-app',
  enableUserInfo: true,
});

await ChatClient.getInstance().init(options);
```

:::tip
`enableUserInfo` 必须在调用 `ChatClient#getInstance().init(options)` 时通过 `ChatOptions` 传入。SDK 初始化完成后再修改原选项对象，不会重新配置已初始化的原生 SDK。
:::

用户信息功能开启后，SDK 会执行以下操作：

1. 当前登录用户更新群成员名片后，后续发送的消息会自动附带群成员名片更新时间。
2. 接收方收到消息后，SDK 会将消息中的群成员名片更新时间与本地内存进行比较。
3. 如果消息中的更新时间晚于本地内存，SDK 会自动从服务端拉取最新群成员名片。
4. 获取成功后，SDK 会更新本地内存，并触发 `ChatGroupEventListener#onUserGroupNamecardChanged` 事件。

此外，开启用户信息功能后，还可以通过收到的 `ChatMessage#senderInfo` 获取消息发送方当前可用的群成员名片信息。群名片字段为 `groupNameCard`。详见 [用户信息自动管理](userinfo_provider.html#通过消息获取发送方信息)。

```typescript
ChatClient.getInstance().chatManager.addMessageListener({
  onMessagesReceived(messages) {
    for (const message of messages) {
      console.log('发送方群成员名片：', message.senderInfo?.groupNameCard);
    }
  },
});
```

## 注意事项

- 群成员名片是用户在特定群组中的显示信息，不同群组之间互不影响。
- `ChatGroupManager#getGroupNamecard` 仅查询本地内存，不会主动从服务端获取最新数据。
- `ChatGroupManager#fetchMemberInfoListFromServer` 返回的群成员信息会自动更新本地内存。只有 [开启用户信息自动管理功能](userinfo_provider.html) 后，该接口返回的信息才包含群名片、昵称和头像地址。
- `ChatGroupEventListener#onUserGroupNamecardChanged` 的群成员名片变更通知仅投递给在线用户。
- 若需通过消息自动同步群成员名片，必须在 SDK 初始化时将 `ChatOptions#enableUserInfo` 设为 `true`。
- 开启 [用户信息自动管理](userinfo_provider.html#通过消息获取发送方信息) 后，群成员名片的自动更新依赖消息触发；若业务需要主动获取最新数据，仍应调用服务端接口。
- `ChatGroupMember` 中的群名片字段为 `namecard`，`ChatMessageSenderInfo` 中的群名片字段为 `groupNameCard`，两者的大小写不同。

## 常见问题

#### 设置群成员名片后，为何其他成员未立即收到事件？

调用 `ChatGroupManager#updateGroupNamecard` 后，当前登录用户在指定群组中的群成员名片会更新。其他 **在线成员** 在收到对应的群成员名片变更通知后，才会触发 `ChatGroupEventListener#onUserGroupNamecardChanged` 事件。

#### 为何调用 getGroupNamecard 获取不到群成员名片？

`ChatGroupManager#getGroupNamecard` 仅从本地内存读取数据，不会主动从服务端获取最新信息。如果本地尚未缓存对应成员的群成员名片，返回结果为 `undefined`。此时可先调用 `ChatGroupManager#fetchMemberInfoListFromServer` 从服务端获取群成员信息，并确保初始化时已开启用户信息功能。

#### 从服务端获取的群成员信息是否写入本地内存？

会。调用 `ChatGroupManager#fetchMemberInfoListFromServer` 从服务端获取群成员信息成功后，返回结果中的群成员名片等数据会写入本地内存，后续可通过 `ChatGroupManager#getGroupNamecard` 直接读取。

#### 开启用户信息自动管理后，群成员名片为何会自动更新？

初始化时将 `ChatOptions#enableUserInfo` 设为 `true` 后，发送消息时会自动附带发送方群成员名片更新时间。接收方收到消息后，SDK 会将消息中的更新时间与本地内存进行比较。如果消息中的更新时间晚于本地内存，SDK 会自动从服务端拉取最新群成员名片并更新本地内存。

#### 通过消息自动同步群成员名片后，还需主动从服务端获取吗？

视业务场景而定。通过消息自动同步依赖消息触发；如果业务需要立即获取最新群成员名片，或当前没有消息触发同步，仍建议调用 `ChatGroupManager#fetchMemberInfoListFromServer` 主动从服务端获取最新数据。

## 相关文档

- [用户信息自动管理](userinfo_provider.html)
- [初始化](initialization.html)
- [管理群成员](group_members.html)
- [管理用户属性](userprofile.html)
- [使用限制](/product/limitation.html)

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`updateGroupNamecard`](#设置群成员名片) | `ChatGroupManager` | 设置、更新或清除当前用户在指定群组中的群名片。 |
| [`fetchMemberInfoListFromServer`](#从服务端获取群成员名片) | `ChatGroupManager` | 从服务器分页获取群成员信息。 |
| [`getGroupNamecard`](#从本地内存获取群成员名片) | `ChatGroupManager` | 从本地内存读取指定成员的群名片。 |
| [`onUserGroupNamecardChanged`](#监听群成员名片更新) | `ChatGroupEventListener` | 群成员名片发生变化并同步到本地时触发。 |
| [`withAppKey`](#通过消息自动同步群成员名片) | `ChatOptions` | 使用 App Key 创建 SDK 初始化配置。也可根据业务配置使用 `withAppId`。 |
| [`init`](#通过消息自动同步群成员名片) | `ChatClient` | 使用指定配置初始化 SDK。 |
