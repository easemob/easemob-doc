# 管理用户属性

环信即时通讯 IM Web SDK 支持管理用户属性。

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。例如，在招聘场景下，利用用户属性功能可以存储性别、邮箱、用户类型（面试者）、职位类型（Web 研发）等。

本文介绍如何设置、更新、获取、监听和订阅用户属性。

:::tip
为保证用户信息安全，SDK 仅支持用户设置或更新自己的用户属性。
:::

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- SDK 初始化时，已注册 `UserInfoManager`、`ContactManager` 和 `ChatManager`。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 使用限制

- 单个用户的全部属性最大不超过 2 KB。
- 单个 app 的全部用户属性数据最大不超过 10 GB。
- 调用设置或获取用户属性的相关接口超过频率限制时，会返回错误码 `4` `rate_limit`。

## 设置当前用户的属性

### 设置当前用户的所有属性

你可以调用 `updateOwnInfo` 设置或更新当前用户的多个属性。

```typescript
const profile = await client.userInfoManager.updateOwnInfo({
  nickname: 'easemob',
  avatarUrl: 'https://www.easemob.com/avatar.png',
  birth: '2000-10-10',
  sign: 'hello world',
  phone: '13333333333',
  mail: '123456@qq.com',
  gender: 1,
  ext: '{"role":"candidate"}',
});

console.log(profile.userId, profile.nickname);
```

客户端默认使用以下键名存储用户属性。[调用 RESTful 接口设置](/document/server-side/user_attribute_set.html) 或 [删除用户属性](/document/server-side/user_attribute_delete.html) 时，若希望客户端可正常读取，请保持键名一致。

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `nickname` | String | 用户昵称。长度不超过 64 字符。 |
| `avatarurl` | String | 用户头像 URL。长度不超过 256 字符。若 [通过 RESTful 接口设置](/document/server-side/user_attribute_set.html) 或 [删除](/document/server-side/user_attribute_delete.html) 该字段，服务端键名为 `avatarurl`。 |
| `phone` | String | 用户联系方式。长度不超过 32 字符。 |
| `mail` | String | 用户邮箱。长度不超过 64 字符。 |
| `gender` | Number | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 其他值无效。  |
| `sign` | String | 用户签名。长度不超过 256 字符。 |
| `birth` | String | 用户生日。长度不超过 64 字符。 |
| `ext` | String | 扩展字段。 |

### 设置当前用户的单个属性

你可以调用 `updateOwnInfoByAttribute` 设置当前用户的单个属性。例如，修改当前用户的头像：

```typescript
const profile = await client.userInfoManager.updateOwnInfoByAttribute(
  'avatarUrl',
  'https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png'
);

console.log(profile.avatarUrl);
```

## 获取用户属性

### 从服务端获取用户的所有属性

你可以调用 `getUserInfoByUserId` 从服务端获取一个或多个用户的全部属性。每次调用最多可获取 100 个用户的用户属性。调用成功后，SDK 会将返回的用户属性写入本地缓存，并将结果直接返回给调用方。如需在调用后立即刷新界面，建议直接使用该接口的返回值更新 UI。

```typescript
// 每次传入的用户 ID 数量不超过 100 个。
const users = await client.userInfoManager.getUserInfoByUserId({
  userIds: ['user1', 'user2'],
});

console.log(users);
```

### 从服务端获取用户的指定属性

你可以调用 `getUserInfoByAttribute` 获取指定用户的一个或多个属性。调用成功后，SDK 会将返回的用户属性写入本地缓存，并将结果直接返回给调用方。如需在调用后立即刷新界面，建议直接使用接口返回值更新 UI。

```typescript
const users = await client.userInfoManager.getUserInfoByAttribute({
  userIds: ['user1'],
  attributes: ['nickname', 'avatarUrl'],
});

console.log(users[0]?.nickname, users[0]?.avatarUrl);
```

## 从本地内存读取用户属性

如果你的业务场景是读取当前内存中的好友属性，可调用 `contactManager.getContacts` 获取当前好友列表及其用户属性视图。

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
1. 如需获取非好友用户的属性，请调用 [userInfoManager.getUserInfoByUserId](#从服务端获取用户的所有属性) 接口。
2. 若需要 SDK 在登录成功后自动同步好友列表及好友信息，需在初始化 SDK 时在 `enableSyncData` 中包含 `contact`，并注册 `ContactManager` 和 `UserInfoManager`。同步完成后，可调用 `contactManager.getContacts` 读取本地已同步的好友属性视图。关于登录成功后自动同步数据，详见 [初始化文档](initialization.html)。
:::

## 订阅非好友用户的属性变更

SDK 支持订阅非好友用户的属性变更。订阅后，指定非好友用户的属性发生变化时，应用可以及时收到通知。

该功能适用于以下场景：

- 非好友会话中，需要及时更新对方昵称、头像等属性。
- 临时会话、客服沟通等场景中，需要感知非好友用户的属性变更。
- 群成员展示等场景中，需要维护指定非好友用户的最新用户属性。

:::tip
本功能只适用于非好友用户。关于当前用户、非好友用户和好友相关的用户属性变更通知详情，请参见 [监听用户属性变更](#监听用户属性变更)。
:::

### 订阅非好友用户属性变更事件

你可以调用 `subscribeUsersInfo` 订阅非好友用户属性变更事件。订阅成功后，当这些用户的属性发生变更时，SDK 会触发 `onUserInfoUpdated` 事件。

```typescript
await client.userInfoManager.subscribeUsersInfo({
  userIds: ['user1', 'user2'],
});
```

### 取消订阅非好友用户属性变更事件

你可以调用 `unsubscribeUsersInfo` 取消订阅非好友用户的属性变更事件。

```typescript
await client.userInfoManager.unsubscribeUsersInfo({
  userIds: ['user1', 'user2'],
});
```

### 获取已被订阅用户属性变更事件的用户列表

你可以调用 `getSubscribedUsers` 获取已被订阅用户属性变更事件的用户列表。该用户列表中包含被订阅的非好友用户的用户 ID 及其用户属性。

```typescript
const users = await client.userInfoManager.getSubscribedUsers();

console.log(users.map(user => user.userId));
```

### 内存说明

如果未订阅非好友用户的属性变更，应用通常在业务需要时主动调用 [获取接口](#从服务端获取用户的所有属性) 拉取。

当前 SDK 内部会维护用户属性缓存。因此，若你希望减少重复请求，可根据业务场景采用以下任一方式：

- 在业务层缓存已经获取到的用户属性结果；
- 在初始化时开启 `enableUserInfoSync`，通过接收消息后按需更新用户属性的机制，自动刷新相关展示信息。

## 监听用户属性变更

好友用户及非好友用户的属性更新，可通过 `client.userInfoManager.addEventHandler` 注册的 `onUserInfoUpdated` 事件接收，主要包括以下场景：

1. **消息携带更新时间**：若初始化 SDK 时开启了 `enableUserInfoSync`，当收到消息且消息中携带的发送方用户属性的更新时间新于本地缓存时，SDK 会自动拉取最新用户属性并更新本地数据，随后触发 `onUserInfoUpdated` 回调。该机制对好友与非好友发送方均可能生效。
2. **订阅用户变更（仅限非好友）**：若已订阅非好友用户的属性变更事件，则当这些被订阅用户的属性发生变化时，SDK 会触发 `onUserInfoUpdated` 回调。

**特殊说明**

- **当前用户**：当前用户的属性变更，通过 `onOwnInfoUpdated` 回调单独通知，不适用 `onUserInfoUpdated` 逻辑。
- **好友用户**：好友属性变更时，会触发 `client.contactManager.addEventHandler` 中注册的 `onContactInfoUpdated` 回调。该事件属于好友事件，不属于 `userInfoManager` 事件。
- **主动拉取用户属性**：调用 [从服务端获取用户属性](userprofile.html#从服务端获取用户的所有属性) 接口后，若返回结果中包含更新后的用户属性，建议直接使用接口返回值刷新 UI，而不要依赖 `onUserInfoUpdated` 回调。

```typescript
client.userInfoManager.addEventHandler('profile-listener', {
  // 当前用户自己的属性更新后触发。
  // 例如，当前用户调用 updateOwnInfo 或 updateOwnInfoByAttribute 成功后，会收到该事件。
  onOwnInfoUpdated: profile => {
    console.log('当前用户属性更新:', profile);
  },
  // 其他用户的属性更新后触发。
  // 例如：
  // 1. 已订阅的非好友用户的属性发生变化；
  // 2. 开启 `enableUserInfoSync` 后，SDK 在消息处理过程中检测到用户属性有更新，并拉取到了最新的用户属性。
  onUserInfoUpdated: users => {
    console.log('订阅用户或消息同步触发的属性更新:', users);
  },
});

client.contactManager.addEventHandler('contact-profile-listener', {
  // 好友的用户属性更新后触发。
  // 该事件仅针对好友用户，需通过 contactManager 监听，不属于 userInfoManager 的事件。
  onContactInfoUpdated: event => {
    console.log('好友的用户属性更新:', event.userInfo);
  },
});
```

## 常见问题

#### 设置了用户昵称，为什么获取不到？

如果你已通过客户端或 RESTful API 设置用户昵称，但后续未能正确获取，通常需要检查以下两点：

- 调用 RESTful 接口设置用户昵称时，请求中必须使用 `nickname` 键名，否则客户端无法正确读取该属性。
- RESTful API [获取用户详情](/document/server-side/account_detail_obtain_single.html) 和 [删除用户账户](/document/server-side/account_delete_single.html) 返回的 `nickname` 表示推送昵称，即离线推送通知中显示的昵称，与用户属性中的昵称不同。不过，建议两者保持一致；修改其中一个昵称时，也同步更新另一个昵称。

Web SDK **不提供设置推送昵称的专门 API**。如果需要设置推送昵称，可参考 RESTful API [离线推送通知的显示属性配置](/document/server-side/push_nickname_set_single.html)。

#### 为什么会返回错误码 4？

设置、获取以及订阅用户属性的相关接口在超过调用频率限制时，会返回错误码 `4`。

## 相关功能

#### 用户头像管理

Web SDK 仅支持在用户属性中存储头像地址，即 `avatarUrl`，不存储头像文件本身。如需管理用户头像，建议先将头像文件上传至业务侧文件服务或其他可访问的存储服务，再将生成的头像 URL 写入用户属性。

典型流程如下：

1. 开通第三方文件存储服务。
2. 将头像文件上传到第三方存储，并获取文件 URL。
3. 调用 [updateOwnInfo](#设置当前用户的所有属性) 或 [updateOwnInfoByAttribute](#设置当前用户的单个属性)，将头像地址写入当前用户的 `avatarUrl` 属性。若通过 RESTful API 写入，请使用服务端字段名 `avatarurl`。
4. 调用 `getUserInfoByUserId` 或 `getUserInfoByAttribute` 获取头像 URL，并在本地 UI 中渲染。

#### 名片消息

在 Web SDK 中，名片消息通常使用自定义消息实现，用于携带指定用户的属性，例如用户 ID、昵称、头像、邮箱和手机号等。

实现时，建议按以下方式处理：

1. 使用 `createCustomMessage` 创建自定义消息。
2. 将消息事件名 `event` 设置为 `userCard`，用于标识该消息为名片消息。
3. 先通过用户属性接口查询目标用户的属性字段，再将这些字段通过自定义消息的 `params` 传入消息体。

如需展示更丰富的名片信息，可以在 `params` 中补充更多字段；如需附加消息级扩展信息，可通过消息扩展字段 `ext` 传递。

参考以下示例代码创建并发送名片消息：

```typescript
const users = await client.userInfoManager.getUserInfoByAttribute({
  userIds: ['user_card_target'],
  attributes: ['nickname', 'avatarUrl', 'mail', 'phone', 'gender', 'birth', 'sign'],
});

const profile = users[0];

const message = client.chatManager.createCustomMessage({
  conversationId: 'username',
  conversationType: 'singleChat',
  event: 'userCard',
  params: {
    userId: profile.userId,
    nickname: profile.nickname ?? '',
    avatarUrl: profile.avatarUrl ?? '',
    mail: profile.mail ?? '',
    phone: profile.phone ?? '',
    gender: String(profile.gender ?? ''),
    birth: profile.birth ?? '',
    sign: profile.sign ?? '',
  },
});

await client.chatManager.sendMessage(message);
```

如果无需先查询用户属性，也可以直接构造名片消息：

```typescript
const message = client.chatManager.createCustomMessage({
  conversationId: 'username',
  conversationType: 'singleChat',
  event: 'userCard',
  params: {
    userId: 'user_card_target',
    nickname: '昵称',
    avatarUrl: 'https://example.com/avatar.png',
    mail: '123@qq.com',
    phone: '16888888888',
    gender: 'female',
    birth: '2000-01-01',
    sign: 'a sign',
  },
});

await client.chatManager.sendMessage(message);
```

#### 用户属性与用户信息

用户信息指用于业务展示的用户相关信息，包括用户属性和 [群成员名片](group_namecard.html)。

## 接口列表

| API 名称                                                     | 所属模块/类       | 说明                                       |
| ------------------------------------------------------------ | ----------------- | ------------------------------------------ |
| [`updateOwnInfo`](#设置当前用户的所有属性)                   | `UserInfoManager` | 设置或更新当前用户的多个属性。             |
| [`updateOwnInfoByAttribute`](#设置当前用户的单个属性)        | `UserInfoManager` | 设置或更新当前用户的单个属性。             |
| [`getUserInfoByUserId`](#从服务端获取用户的所有属性)         | `UserInfoManager` | 获取一个或多个用户的全部默认属性。         |
| [`getUserInfoByAttribute`](#从服务端获取用户的指定属性)      | `UserInfoManager` | 获取指定用户的指定属性。                   |
| [`getContacts`](#从本地内存读取用户属性)                     | `ContactManager`  | 读取当前内存中的好友列表及其用户属性视图。 |
| [`subscribeUsersInfo`](#订阅非好友用户属性变更事件)          | `UserInfoManager` | 订阅非好友用户属性变更事件。               |
| [`unsubscribeUsersInfo`](#取消订阅非好友用户属性变更事件)    | `UserInfoManager` | 取消订阅非好友用户属性变更事件。           |
| [`getSubscribedUsers`](#获取已被订阅用户属性变更事件的用户列表) | `UserInfoManager` | 获取已订阅用户属性变更事件的用户列表。     |
| [`createCustomMessage`](#名片消息)                           | `ChatManager`     | 创建自定义消息，用于封装名片消息内容。     |
| [`sendMessage`](#名片消息)                                   | `ChatManager`     | 发送名片消息。                             |