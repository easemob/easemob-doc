# 管理用户属性

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日和自定义扩展信息。例如，在招聘场景下，可以使用用户属性存储性别、邮箱、用户类型（面试者）、职位类型（Web 研发）等资料。

React Native SDK 通过 `ChatUserInfoManager` 管理用户属性，并使用 `ChatUserInfo` 表示用户属性对象。可通过 `ChatClient.getInstance().userManager` 获取 `ChatUserInfoManager` 实例。

:::tip
为保证用户信息安全，SDK 仅支持当前登录用户设置或更新自己的用户属性，不能通过客户端修改其他用户的属性。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解即时通讯 IM 的相关使用限制，详见 [使用限制](/product/limitation.html)。

## 使用限制

- 单个用户的全部属性最大不超过 2 KB。
- 单个 app 的全部用户属性数据最大不超过 10 GB。
- 调用设置或获取用户属性的相关接口超过频率限制时，会抛出 `ChatError`，其中 `code` 为 `4`。React Native SDK 的 `ChatError` 公开类型只定义数值属性 `code: number` 和描述属性 `description: string`，未公开 `EXCEED_SERVICE_LIMIT` 形式的错误码枚举。// TODO：需要删除最后一句话？

## 设置当前用户的属性

调用 `ChatUserInfoManager#updateOwnUserInfo(params)` 设置或更新当前登录用户的一个或多个属性。

```typescript
try {
  await ChatClient.getInstance().userManager.updateOwnUserInfo({
    nickName: 'easemob',
    avatarUrl: '<avatar_url>',
    birth: '2000.10.10',
    sign: 'hello world',
    phone: '13333333333',
    mail: '123456@qq.com',
    gender: 1,
    ext: JSON.stringify({ userType: 'candidate', job: 'Web developer' }),
  });
  console.log('用户属性更新成功');
} catch (error) {
  console.error('用户属性更新失败：', error);
}
```

客户端默认使用以下键名存储用户属性。[调用 RESTful 接口设置](/document/server-side/user_attribute_set.html) 或 [删除用户属性](/document/server-side/user_attribute_delete.html) 时，若希望客户端可正常读取，请保持键名一致。

| 字段        | 类型   | 描述                                                                                              |
| :---------- | :----- | :------------------------------------------------------------------------------------------------ |
| `nickname`  | `string` | 用户昵称。长度不超过 64 字符。                                                                    |
| `avatarurl` | `string` | 用户头像 URL。长度不超过 256 字符。                                                               |
| `phone`     | `string` | 用户联系方式。长度不超过 32 字符。                                                                |
| `mail`      | `string` | 用户邮箱。长度不超过 64 字符。                                                                    |
| `gender`    | `number` | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 其他值无效。       |
| `sign`      | `string` | 用户签名。长度不超过 256 字符。                                                                   |
| `birth`     | `string` | 用户生日。长度不超过 64 字符。                                                                    |
| `ext`       | `string` | 扩展字段。                                                                                        |

## 获取用户属性

### 从服务端获取当前用户的属性

调用 `ChatUserInfoManager#fetchOwnInfo()` 从服务端获取当前登录用户的属性，返回类型为 `Promise<ChatUserInfo | undefined>`。当前用户 ID 为空或服务端结果中没有当前用户时，返回 `undefined`。

```typescript
try {
  const userInfo = await ChatClient.getInstance().userManager.fetchOwnInfo();

  if (userInfo !== undefined) {
    console.log('当前用户属性：', {
      userId: userInfo.userId,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
    });
  }
} catch (error) {
  console.error('获取当前用户属性失败：', error);
}
```

### 从服务端获取用户的所有属性

调用 `ChatUserInfoManager#fetchUserInfoById(userIds)` 从服务端获取一个或多个用户的全部属性。该方法返回 `Promise<Map<string, ChatUserInfo>>`，Map 的键为用户 ID，值为对应的用户属性。本次结果中没有的用户不会出现在 Map 中。

开启 [用户信息自动管理功能](userinfo_provider.html) 后，如果服务端返回的用户属性更新时间晚于本地数据，原生 SDK 会更新本地数据，并通过 `ChatUserInfoEventListener#onUserInfoUpdate` 通知 React Native 业务层。

```typescript
const userIds = ['userId1', 'userId2'];

try {
  const userInfoMap: Map<string, ChatUserInfo> =
    await ChatClient.getInstance().userManager.fetchUserInfoById(userIds);

  for (const [userId, userInfo] of userInfoMap) {
    console.log('服务端用户属性：', {
      userId,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      mail: userInfo.mail,
      phone: userInfo.phone,
      gender: userInfo.gender,
      sign: userInfo.sign,
      birth: userInfo.birth,
      ext: userInfo.ext,
    });
  }
} catch (error) {
  console.error('获取用户属性失败：', error);
}
```

### 从服务端获取用户的指定属性

若业务只使用昵称、头像等部分字段，应调用 `fetchUserInfoById` 获取完整的 `ChatUserInfo`，再在应用侧读取所需字段：

```typescript
const userInfoMap = await ChatClient.getInstance()
  .userManager.fetchUserInfoById(['userId']);

const userInfo = userInfoMap.get('userId');
const displayInfo = userInfo
  ? {
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
    }
  : undefined;

console.log('用户展示信息：', displayInfo);
```

### 从本地读取用户属性

如需从原生 SDK 的本地数据中读取一个或多个用户的属性，可调用 `ChatUserInfoManager#getLocalUserInfoByIds(userIds)`。该方法不会发起网络请求，返回类型为 `Promise<Map<string, ChatUserInfo>>`。本地不存在的用户不会包含在返回结果中。

读取单个用户时，传入只包含一个用户 ID 的数组，再通过 `Map#get` 读取结果即可。

```typescript
try {
  const userInfoMap = await ChatClient.getInstance()
    .userManager.getLocalUserInfoByIds(['userId1', 'userId2']);

  const userInfo = userInfoMap.get('userId1');
  if (userInfo !== undefined) {
    console.log('本地用户属性：', userInfo);
  }
} catch (error) {
  console.error('读取本地用户属性失败：', error);
}
```

:::tip
若需要 SDK 在登录成功后自动同步好友列表及好友信息，应在初始化时将 `ChatOptions#enableAutoSyncContacts` 设为 `true`。若还需在 `ChatContact#userInfo` 中自动管理好友用户属性，应同时将 `ChatOptions#enableUserInfo` 设为 `true`。同步完成后，可调用 `ChatContactManager#getAllContacts()` 或 `getContact(userId)` 读取本地好友对象。详见 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)。
:::

## 订阅非好友用户的属性变更

自 React Native SDK 1.18.0 版本开始，支持订阅非好友用户的属性变更。订阅后，指定非好友用户的属性发生变化时，应用可以及时收到通知。

该功能适用于以下场景：

- 非好友会话中，需要及时更新对方的昵称、头像等属性。
- 临时会话、客服沟通等场景中，需要感知非好友用户的属性变更。
- 群成员展示等场景中，需要维护指定非好友用户的最新用户属性。

:::tip
该订阅功能只适用于非好友用户。当前用户、非好友用户和好友的属性变更通知方式不同，详见 [监听用户属性变更](#监听用户属性变更)。
:::

### 订阅非好友用户属性变更事件

调用 `ChatUserInfoManager#subscribeUsersInfo(userIds)` 订阅非好友用户的属性变更，参数类型为 `string[]`，返回类型为 `Promise<void>`。订阅成功后，当这些用户的属性发生变化时，SDK 会触发 `ChatUserInfoEventListener#onUserInfoUpdate`。

```typescript
try {
  await ChatClient.getInstance().userManager.subscribeUsersInfo([
    'user1',
    'user2',
  ]);
  console.log('订阅用户属性成功');
} catch (error) {
  console.error('订阅用户属性失败：', error);
}
```

### 取消订阅非好友用户属性变更事件

调用 `ChatUserInfoManager#unsubscribeUsersInfo(userIds)` 取消订阅指定非好友用户的属性变更，参数类型为 `string[]`，返回类型为 `Promise<void>`。

```typescript
try {
  await ChatClient.getInstance().userManager.unsubscribeUsersInfo([
    'user1',
    'user2',
  ]);
  console.log('取消订阅用户属性成功');
} catch (error) {
  console.error('取消订阅用户属性失败：', error);
}
```

### 获取已被订阅用户属性变更事件的用户列表

调用 `ChatUserInfoManager#fetchSubscribedUsers()` 获取当前用户已订阅的非好友用户列表，返回类型为 `Promise<ChatUserInfo[]>`。数组元素包含被订阅用户的用户 ID 和当前可用的用户属性。

```typescript
try {
  const users = await ChatClient.getInstance()
    .userManager.fetchSubscribedUsers();

  for (const userInfo of users) {
    console.log('已订阅用户：', {
      userId: userInfo.userId,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
    });
  }
} catch (error) {
  console.error('获取已订阅用户失败：', error);
}
```

### 本地数据说明

如果未订阅非好友用户的属性变更，应用通常需要在业务需要时主动调用 `fetchUserInfoById` 拉取用户属性。为减少不必要的网络请求，建议优先通过 `getLocalUserInfoByIds` 复用原生 SDK 的本地用户信息，并按业务需要决定是否重新 [拉取服务端数据](#从服务端获取用户的所有属性)。

## 监听用户属性变更

React Native SDK 通过 `ChatUserInfoEventListener` 提供以下用户属性事件：

- `onSelfUserInfoUpdate(userInfo: ChatUserInfo)`：当前登录用户的属性同步或更新后触发。
- `onUserInfoUpdate(userInfos: ChatUserInfo[])`：其他用户的属性更新并写入本地数据后触发。

其他用户的属性更新可能由以下场景触发：

1. **主动拉取更新**：如果已开启 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理)，调用 [从服务端获取用户属性](#从服务端获取用户的所有属性) 或 [从服务端获取群成员信息](group_members.html#获取群成员列表) 的接口时，若服务端返回的用户属性更新时间晚于本地数据，原生 SDK 会更新本地数据并触发 `onUserInfoUpdate`。
2. **消息携带更新**：如果已开启 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理)，收到消息且消息中携带的发送方用户属性更新时间晚于本地缓存时，SDK 会重新拉取该用户的属性并触发 `onUserInfoUpdate`。该机制对好友和非好友发送方均生效。
3. **订阅用户变更（仅限非好友）**：已订阅的非好友用户属性发生变化时，SDK 会触发 `onUserInfoUpdate`。

**特殊说明**

- **当前用户**：当前登录用户的属性变更通过 `onSelfUserInfoUpdate` 单独回调。
- **好友用户**：若已开启 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)，好友信息发生变更时还会触发 `ChatContactEventListener#onContactInfoUpdate(contact: ChatContact)`。该事件属于好友关系模块，与 `ChatUserInfoEventListener#onUserInfoUpdate` 区分。

建议在 SDK 初始化成功后、登录前注册监听器；不再需要监听时，应移除同一个监听器对象。

```typescript
import type {
  ChatUserInfo,
  ChatUserInfoEventListener,
} from 'react-native-chat-sdk';

const userInfoListener: ChatUserInfoEventListener = {
  onSelfUserInfoUpdate(userInfo: ChatUserInfo) {
    console.log('当前用户属性更新：', userInfo);
  },

  onUserInfoUpdate(userInfos: ChatUserInfo[]) {
    console.log('其他用户属性更新：', userInfos);
  },
};

const userManager = ChatClient.getInstance().userManager;
userManager.addUserInfoListener(userInfoListener);

// 在页面或组件卸载时调用，移除同一个监听器对象。
function removeUserInfoListener(): void {
  userManager.removeUserInfoListener(userInfoListener);
}
```

如需移除所有用户属性监听器，可调用 `ChatUserInfoManager#removeAllUserInfoListener()`。

## 常见问题

### 设置了用户昵称，为什么获取不到？

如果已通过客户端或 RESTful API 设置用户昵称，但后续未能正确获取，通常需要检查以下两点：

- 调用 RESTful 接口设置用户昵称时，请求中必须使用 `nickname` 键名，否则客户端无法正确读取该属性。
- RESTful API [获取用户详情](/document/server-side/account_detail_obtain_single.html) 和 [删除用户账户](/document/server-side/account_delete_single.html) 返回的 `nickname` 表示推送昵称，即离线推送通知中显示的昵称，与用户属性中的昵称不同。建议两者保持一致；修改其中一个昵称时，也同步更新另一个昵称。React Native SDK 可调用 `ChatPushManager#updatePushNickname(nickname)` 更新推送昵称，详见 [离线推送通知的显示属性配置](/document/server-side/push_nickname_set_single.html)。

### 为什么会返回错误码 4？

设置和获取用户属性的相关接口超过调用频率限制时，会抛出 `ChatError`。可通过 `error.code` 读取数值错误码；当值为 `4` 时表示超过服务限制。

### 为什么只更新一个字段也会请求服务端？

// TODO：这个常见问题需要吗？

`updateOwnUserInfo` 的公开参数允许只传一个字段，但 React Native SDK 1.18.0 的实现会先调用 `fetchUserInfoById` 获取当前用户已有的完整属性，再合并本次传入的字段并提交更新。这可以保留未传入字段的原值，也意味着单字段更新同样包含一次服务端查询。

### 为什么 Map 中没有请求的某个用户？

`fetchUserInfoById` 和 `getLocalUserInfoByIds` 都使用 `Map<string, ChatUserInfo>` 返回实际获取到的结果。如果服务端或本地数据中不存在某个用户，该用户 ID 可能不会出现在 Map 中。读取结果时应使用 `Map#get` 并处理 `undefined`。

## 相关功能

### 用户头像管理

如果业务涉及用户头像管理，可参考以下流程：

1. 开通第三方文件存储服务。
2. 将头像文件上传到第三方存储，并获取文件 URL。
3. 将该 URL 作为 `avatarUrl` 传入 `updateOwnUserInfo`。
4. 调用 `fetchUserInfoById` 获取头像 URL，并在本地 UI 中渲染。

### 名片消息

如果业务中需要发送名片消息，可以使用自定义消息，在 `params` 中添加用户 ID、昵称和头像等展示字段。`ChatMessage.createCustomMessage` 的 `params` 类型为 `Record<string, string>`。

```typescript
import {
  ChatClient,
  ChatMessage,
  ChatMessageChatType,
} from 'react-native-chat-sdk';

const message = ChatMessage.createCustomMessage(
  'targetUserId',
  'userCard',
  ChatMessageChatType.PeerChat,
  {
    params: {
      userId: 'userId',
      nickname: 'nickname',
      avatarUrl: '<avatar_url>',
    },
  }
);

try {
  await ChatClient.getInstance().chatManager.sendMessage(message);
  console.log('名片消息发送调用成功');
} catch (error) {
  console.error('名片消息发送调用失败：', error);
}
```

如需在名片中展示更多信息，可以继续在自定义消息的 `params` 中增加字符串键值对。有关消息发送状态回调，详见 [发送消息](message_send.html)。

### 用户属性与用户信息

用户信息指用于业务展示的用户相关信息，包括用户属性、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。若需由 SDK 自动维护相关数据，详见 [用户信息自动管理](userinfo_provider.html)。

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`updateOwnUserInfo`](#设置当前用户的属性) | `ChatUserInfoManager` | `Promise<void>` | 设置或更新当前登录用户的一个或多个属性。 |
| [`fetchOwnInfo`](#从服务端获取当前用户的属性) | `ChatUserInfoManager` | `Promise<ChatUserInfo \| undefined>` | 从服务端获取当前登录用户的属性。 |
| [`fetchUserInfoById`](#从服务端获取用户的所有属性) | `ChatUserInfoManager` | `Promise<Map<string, ChatUserInfo>>` | 从服务端获取一个或多个用户的全部属性。 |
| [`getLocalUserInfoByIds`](#从本地读取用户属性) | `ChatUserInfoManager` | `Promise<Map<string, ChatUserInfo>>` | 从本地读取一个或多个用户的属性，不发起网络请求。 |
| [`subscribeUsersInfo`](#订阅非好友用户属性变更事件) | `ChatUserInfoManager` | `Promise<void>` | 订阅非好友用户的属性变更。 |
| [`unsubscribeUsersInfo`](#取消订阅非好友用户属性变更事件) | `ChatUserInfoManager` | `Promise<void>` | 取消订阅非好友用户的属性变更。 |
| [`fetchSubscribedUsers`](#获取已被订阅用户属性变更事件的用户列表) | `ChatUserInfoManager` | `Promise<ChatUserInfo[]>` | 获取当前用户已订阅的非好友用户列表及其用户属性。 |
| [`addUserInfoListener`](#监听用户属性变更) | `ChatUserInfoManager` | `void` | 添加用户属性事件监听器。 |
| [`removeUserInfoListener`](#监听用户属性变更) | `ChatUserInfoManager` | `void` | 移除指定的用户属性事件监听器。 |
| [`removeAllUserInfoListener`](#监听用户属性变更) | `ChatUserInfoManager` | `void` | 移除所有用户属性事件监听器。 |
| [`onSelfUserInfoUpdate`](#监听用户属性变更) | `ChatUserInfoEventListener` | `(userInfo: ChatUserInfo) => void` | 当前登录用户的属性更新回调。 |
| [`onUserInfoUpdate`](#监听用户属性变更) | `ChatUserInfoEventListener` | `(userInfos: ChatUserInfo[]) => void` | 其他用户的属性更新回调。 |
