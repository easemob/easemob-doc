# 用户信息自动管理

## 功能说明

在 Web SDK 中，环信即时通讯 IM 提供用户信息自动管理功能。开启该功能后，SDK 可自动维护用户信息的同步、缓存更新和相关事件通知，帮助开发者减少手动拉取、存储和更新用户信息的工作量。

该功能适用于会话列表、消息列表、群聊页面等需要展示用户昵称、头像、群成员名片的场景。

**本文提及的用户信息指用于业务展示的用户相关信息，包括 [用户属性](userprofile.html) 和 [群成员名片](group_namecard.html)。**

## 技术原理

在 SDK 中，用户信息自动管理功能由初始化参数 `enableUserInfoSync: true` 控制。开启该功能后，SDK 会在登录成功后自动同步当前登录用户的用户属性；在发送消息时自动附带发送方用户属性的更新时间；对于群聊消息，还会额外附带发送方在当前群中的群成员名片更新时间。

接收消息后，SDK 会自动将消息中携带的更新时间与本地缓存中的对应时间戳进行比较；当检测到数据已更新或本地缺少相关缓存时，会自动从服务端拉取最新的用户属性或群成员名片，并更新本地缓存，同时通过相关事件通知业务层刷新界面。

在通过消息获取发送方信息的过程中，SDK 会自动完成用户信息的同步、缓存更新以及相关展示数据刷新。处理流程如下：

1. 发送消息时，SDK 会在消息中附带当前发送方的用户属性更新时间 `userInfoUpdateTime`。若为群聊消息，还会附带当前发送方在该群中的群名片更新时间 `namecardUpdateTime`。
2. 接收方收到消息后，SDK 会优先结合本地缓存，补全消息中的发送方的信息，例如 `userId`、`nickname` 和 `avatarUrl`。
3. SDK 会解析消息中携带的用户属性更新时间；对于群聊消息，还会进一步解析群名片更新时间。
4. SDK 会将消息中的更新时间与本地缓存中的对应时间戳进行比较。
5. 若消息中的更新时间晚于本地缓存，SDK 会自动从服务端获取最新的用户属性；对于群聊消息，若群名片更新时间发生变化，SDK 还会自动拉取最新的群成员名片。
6. 若本地尚无对应缓存，即使消息中未携带对应的更新时间，SDK 也可能触发一次用户属性拉取，以补全发送方的用户属性；在群聊场景下，若本地尚无该发送方在当前群中的群名片缓存，SDK 也可能触发一次群名片拉取。
7. 用户信息拉取成功后，SDK 会自动更新内部缓存，并同步刷新相关会话中的展示字段。
8. 缓存更新完成后，SDK 会通过相关事件通知上层应用，业务层可据此刷新 UI。
   用户属性更新通常通过 `onUserInfoUpdated` 或 `onOwnInfoUpdated` 事件通知；群名片更新通过 `onUserGroupNamecardUpdated` 事件通知。

缓存更新流程如下：

![img](/images/web/memory_update_userinfo_mgmt.png)

## 前提条件

开始接入前，请确保满足以下条件：

- 已完成 SDK 初始化。详见 [快速开始](quickstart.html)。
- SDK 初始化注册 `ChatClient`、`UserInfoManager`、`GroupManager`、`ChatManager` 和 `ContactManager`。
- 已了解即时通讯 IM 的相关使用限制。详见 [使用限制](/product/limitation.html)。

## 开启用户信息自动管理

在初始化 SDK 时，将 `enableUserInfoSync` 设为 `true`：

```typescript
const client = ChatClient.init({
  appKey: 'your-org#your-app',
  enableUserInfoSync: true,
  managers: [UserInfoManager, GroupManager],
});
```

:::tip
必须在调用 `ChatClient.init` 初始化 SDK 时传入 `enableUserInfoSync: true`，并注册 `UserInfoManager` 和 `GroupManager`，否则该功能无法正常启用。
:::

## 监听用户属性更新

SDK 提供用户属性更新相关事件，用于监听当前用户、其他用户以及好友的用户属性的变化，主要包括：

- `onOwnInfoUpdated`：当前登录用户的属性同步或更新并写入缓存后触发该事件。
- `onUserInfoUpdated`：其他用户属性更新并写入缓存后触发，包括以下场景：
  - 收到其他用户的消息，消息中发送方的用户昵称、头像有变更会触发该事件。若实现这种场景下的用户属性更新事件，需要在初始化时开启 `enableUserInfoSync`。
  - [已订阅的非好友用户属性发生变化](userprofile.html#订阅非好友用户的属性变更)。
- `onContactInfoUpdated`：好友的用户属性更新后触发。该事件属于好友事件，通过 `contactManager` 监听。

**建议在业务初始化阶段完成监听注册，以便在登录后的初始同步、消息触发或订阅更新等场景中及时接收事件并刷新界面。** 关于其他场景下用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

添加监听的示例代码如下：

```typescript
client.userInfoManager.addEventHandler('profile-listener', {
  onOwnInfoUpdated: profile => {
    console.log('当前登录用户属性更新:', profile.nickname, profile.avatarUrl);
  },

  onUserInfoUpdated: users => {
    users.forEach(user => {
      console.log('用户属性更新:', user.userId, user.nickname, user.avatarUrl);
    });
  },
});

client.contactManager.addEventHandler('contact-profile-listener', {
  onContactInfoUpdated: event => {
    console.log('好友的用户属性更新:', event.userInfo.userId, event.userInfo.nickname);
  },
});
```

## 通过消息获取发送方信息

如果发送方在发送消息时携带了自己的用户属性更新时间，则无论发送方与接收方是否为好友关系，当接收方收到该消息，且消息中携带的发送方用户属性更新时间晚于本地缓存时，SDK 会重新拉取该用户属性。对于群聊消息，若消息中携带的群成员名片更新时间晚于本地缓存，SDK 还会拉取对应的群成员名片。你可以通过 `message.sender` 获取当前本地可用的发送方信息。

`message.sender` 用于提供发送方的基础用户属性，当前字段包括 `userId`、`nickname` 和 `avatarUrl`。

好友备注不包含在 `message.sender` 中；如需使用好友备注，可结合 [好友关系管理](user_relationship.html) 相关接口和数据处理。群成员名片也不作为 `message.sender` 的对外字段提供；在群聊场景下，如需获取或维护群成员名片，请结合 [管理群成员名片](group_namecard.html) 相关接口、缓存及 `onUserGroupNamecardUpdated` 事件处理。

```typescript
client.chatManager.addEventHandler('message-listener', {
  onMessage: message => {
    const sender = message.sender;
    console.log(
      '发送方信息:',
      sender.userId,
      sender.nickname,
      sender.avatarUrl
    );
  },
});
```

:::tip
`message.sender` 返回的是当前本地可用的发送方信息，不保证一定是当时的最新信息。若初始化 SDK 时开启了 `enableUserInfoSync`，且该消息触发了用户信息同步更新，最新数据会在 SDK 完成缓存更新后，通过 `onUserInfoUpdated` 等相关事件通知业务层。
:::

## 从本地内存读取用户属性

如果你的业务场景是读取当前内存中的好友属性，可调用 `contactManager.getContacts` 获取当前好友列表视图：

```typescript
const contacts = client.contactManager.getContacts();

contacts.forEach(contact => {
  console.log(
    '好友属性:',
    contact.userId,
    contact.userInfo.nickname,
    contact.userInfo.avatarUrl,
    contact.remark
  );
});
```

:::tip
`contactManager.getContacts` 仅返回当前内存中的好友列表及其用户属性视图。对于非好友用户，如需获取最新用户属性，请调用 [userInfoManager.getUserInfoByUserId](userprofile.html#从服务端获取用户的所有属性) 等服务端接口。
:::

## 注意事项

- `enableUserInfoSync: true` 必须在 `ChatClient.init` 初始化时传入。
- 建议优先注册 `onOwnInfoUpdated`、`onUserInfoUpdated` 和 `onContactInfoUpdated`，以便在缓存更新后及时刷新业务界面。
- `message.sender` 表示当前本地可用的发送方信息摘要，不保证一定是刚收到消息时的最终最新值。
- 当消息中的更新时间晚于本地缓存时，SDK 会自动从服务端拉取最新数据并更新缓存。
- 读取当前内存中的好友属性时，可使用 `contactManager.getContacts`。

## 常见问题

#### 何时开启用户信息自动管理？

必须在调用 `ChatClient.init` 初始化 SDK 时传入 `enableUserInfoSync: true`。若在 SDK 初始化完成后再修改该参数，用户信息自动管理功能不会生效。

#### 功能开启后，SDK 会自动执行哪些操作？

开启 `enableUserInfoSync` 后，SDK 会在登录成功后自动同步当前登录用户的用户属性；在发送消息时自动携带发送方用户属性的更新时间，对于群聊消息还会额外携带发送方在当前群中的群成员名片更新时间；在接收消息后自动将消息中的更新时间与本地缓存中的对应时间戳进行比较；在检测到数据更新或本地缺少缓存时，自动从服务端拉取最新的用户属性或群成员名片并更新缓存，同时通过相关事件通知业务层。

#### `message.sender` 一定最新吗？

不一定。`message.sender` 返回的是当前本地可用的发送方的用户属性摘要，目前主要包含 `userId`、`nickname` 和 `avatarUrl`。如果消息触发了用户属性同步更新，SDK 会在后续异步拉取最新数据并更新缓存，然后通过相关事件通知业务层刷新界面。

#### 为何建议尽早注册监听？

[开启用户信息自动管理功能](#开启用户信息自动管理) 后，SDK 可能在登录后的初始同步、消息触发的用户信息同步更新以及订阅更新场景中通知业务层。建议在业务初始化阶段完成监听注册，以便及时接收事件并刷新界面。

#### 本地读取和服务端获取有何区别？

`contactManager.getContacts` 仅查询当前内存中的好友的用户属性视图，不会发起网络请求，适用于本地展示场景。如果业务需要获取最新的用户属性，应调用对应的 [接口](userprofile.html#从服务端获取用户的所有属性) 主动获取。

#### 功能开启后需自己维护缓存吗？

通常不需要。开启 `enableUserInfoSync` 后，SDK 会负责用户属性更新时间的比较、缓存更新和相关事件通知。业务层通常只需在相关事件中刷新界面；若你自己维护了额外的本地 UI 数据，也应在事件回调中同步更新。

## 相关功能

#### 管理群成员名片

启用用户信息自动管理后，SDK 也支持群成员名片的自动同步与更新。你可以进一步实现群成员名片的设置、查询和变更监听。详见 [管理群成员名片](group_namecard.html)。

#### 用户属性与用户信息

- 用户信息：指用于业务展示的用户相关信息，包括 [用户属性](userprofile.html) 和 [群成员名片](group_namecard.html)。
- 用户属性：指用户可设置和管理的资料字段，例如用户昵称、头像、邮箱、电话号码等。你可通过相关接口对这些字段进行设置、更新和查询。详见 [管理用户属性](userprofile.html)。例如，你可以通过 `client.userInfoManager.updateOwnInfo` 设置当前登录用户的昵称、头像等资料。若开启 `enableUserInfoSync`，更新后的信息会在后续发送消息时自动参与版本同步。

#### 通过消息同步的发送方信息

开启用户信息自动管理后，接收到的消息中会包含发送方相关信息摘要，你可以通过消息对象的 `sender` 字段读取当前本地可用的发送方用户 ID、昵称和头像地址。

## 接口列表

| API 名称                                         | 所属模块/类       | 说明                                                         |
| ------------------------------------------------ | ----------------- | ------------------------------------------------------------ |
| [`init`](#开启用户信息自动管理)                  | `ChatClient`      | 初始化 SDK，并通过 `enableUserInfoSync` 开启用户信息自动管理。 |
| [`getContacts`](#从本地内存读取用户属性)         | `ContactManager`  | 读取当前内存中的好友列表及其用户属性视图。                   |
| [`getUserInfoByUserId`](#从本地内存读取用户属性) | `UserInfoManager` | 从服务端获取指定用户的最新用户属性。                         |
| [`updateOwnInfo`](#用户属性与用户信息)           | `UserInfoManager` | 更新当前登录用户的用户属性。                                 |