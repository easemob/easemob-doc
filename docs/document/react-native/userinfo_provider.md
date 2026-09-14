# 用户信息自动管理

## 功能说明

环信即时通讯 IM 提供用户信息自动管理功能。开启该功能后，SDK 可自动维护用户信息的同步与本地缓存更新，帮助开发者减少手动拉取、存储和更新用户信息的工作量。

该功能适用于会话列表、消息列表、群聊页面等需要展示用户昵称、头像、好友备注和群成员名片的场景。

自 React Native SDK 1.18.0 版本开始支持该功能。**本文提及的用户信息指用于业务展示的用户相关信息，包括 [用户属性](userprofile.html)、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。**

## 技术原理

用户信息自动管理功能由 `ChatOptions#enableUserInfo` 控制。开启该功能后，SDK 会在登录成功后自动同步当前登录用户的用户属性；发送消息时自动附带发送方用户属性的更新时间；对于群聊消息，还会附带发送方在当前群组中的群成员名片更新时间。

接收消息后，原生 SDK 会自动将消息中携带的更新时间与本地缓存中的对应时间戳进行比较。当检测到数据已更新或本地缺少相关缓存时，SDK 会从服务端拉取最新的用户属性或群成员名片并更新本地缓存，然后通过相应事件通知 React Native 业务层刷新界面。业务层无需解析或比较这些内部时间戳。

在通过消息获取发送方信息的过程中，SDK 会自动完成用户信息同步、本地缓存更新及事件通知，处理流程详见原生平台文档：
- [Android 处理流程](/document/android/userinfo_provider.html#技术原理)
- [iOS 处理流程](/document/android/userinfo_provider.html#技术原理)

## 前提条件

开始接入前，请确保满足以下条件：

- 使用 React Native SDK 1.18.0 或以上版本。
- 已完成 SDK 初始化。详见 [初始化](initialization.html)。
- 已了解即时通讯 IM 的相关使用限制。详见 [使用限制](/product/limitation.html)。

## 开启用户信息自动管理

在初始化 SDK 时，将 `ChatOptions#enableUserInfo` 设为 `true`：

```typescript
const options = ChatOptions.withAppKey({
  appKey: 'your_appkey',
  enableUserInfo: true,
});

await ChatClient.getInstance().init(options);
```

:::tip
`enableUserInfo` 的默认值为 `false`，必须在初始化时通过 `ChatOptions` 传入，否则该功能不会生效。
:::

## 监听用户属性更新

SDK 提供 `ChatUserInfoEventListener`，用于监听用户属性更新事件，主要包括：

- `onSelfUserInfoUpdate(userInfo: ChatUserInfo)`：当前登录用户的属性同步或更新并写入本地缓存后触发。
- `onUserInfoUpdate(userInfos: ChatUserInfo[])`：其他用户的属性更新并写入本地缓存后触发。
  - 已订阅用户的属性发生变化时会触发该事件；
  - 开启用户信息自动管理后，收到消息触发用户属性同步时也会通过该事件通知业务层。
  - 主动 [从服务端获取用户属性](userprofile.html#从服务端获取用户的所有属性)。
  - 主动 [从服务端获取群成员信息](group_members.html#获取群成员列表)。

**建议在 SDK 初始化成功后、登录前完成监听注册，以便及时接收登录后的初始同步、消息触发或主动拉取产生的事件。** 不再需要监听时，应移除同一个监听器对象。关于其他场景下用户属性变更通知机制，详见 [监听用户属性变更](userprofile.html#监听用户属性变更)。

```typescript
import { ChatClient } from 'react-native-chat-sdk';
import type {
  ChatUserInfo,
  ChatUserInfoEventListener,
} from 'react-native-chat-sdk';

const userInfoListener: ChatUserInfoEventListener = {
  onSelfUserInfoUpdate(userInfo: ChatUserInfo) {
    console.log('当前登录用户属性更新：', {
      userId: userInfo.userId,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
    });
  },

  onUserInfoUpdate(userInfos: ChatUserInfo[]) {
    for (const userInfo of userInfos) {
      console.log('用户属性更新：', {
        userId: userInfo.userId,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
      });
    }
  },
};

const userManager = ChatClient.getInstance().userManager;
userManager.addUserInfoListener(userInfoListener);

// 不再需要监听时，移除同一个监听器对象。
userManager.removeUserInfoListener(userInfoListener);
```

如需一次移除所有用户信息监听器，可调用 `ChatUserInfoManager#removeAllUserInfoListener()`。

:::tip
`onUserInfoUpdate` 也用于通知通过 `ChatUserInfoManager#subscribeUsersInfo` 订阅的非好友用户属性变更。订阅和取消订阅方法分别为 `subscribeUsersInfo(userIds)` 和 `unsubscribeUsersInfo(userIds)`，详见 [管理用户属性](userprofile.html)。
:::

## 通过消息获取发送方信息

开启用户信息自动管理后，如果发送方在消息中携带了自己的用户信息，则无论双方是否为好友，接收方均可通过 `ChatMessage#senderInfo` 读取当前本地可用的发送方展示信息。如果消息中的用户属性更新时间晚于本地缓存，SDK 会自动拉取该用户的最新属性，并触发 `ChatUserInfoEventListener#onUserInfoUpdate`。

`senderInfo` 的类型为 `ChatMessageSenderInfo | undefined`，其中的字段均为可选字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | `string \| undefined` | 消息发送方的用户 ID。 |
| `nickname` | `string \| undefined` | 消息发送方的昵称。 |
| `avatarUrl` | `string \| undefined` | 消息发送方的头像 URL。 |
| `remark` | `string \| undefined` | 当前用户为该消息发送方设置的好友备注。 |
| `groupNameCard` | `string \| undefined` | 消息发送方在当前群组中的群成员名片。 |

```typescript
import { ChatClient } from 'react-native-chat-sdk';
import type {
  ChatMessage,
  ChatMessageEventListener,
} from 'react-native-chat-sdk';

const messageListener: ChatMessageEventListener = {
  onMessagesReceived(messages: ChatMessage[]) {
    for (const message of messages) {
      const senderInfo = message.senderInfo;
      if (senderInfo !== undefined) {
        console.log('发送方信息：', {
          userId: senderInfo.userId,
          nickname: senderInfo.nickname,
          avatarUrl: senderInfo.avatarUrl,
          remark: senderInfo.remark,
          groupNameCard: senderInfo.groupNameCard,
        });
      }
    }
  },
};

ChatClient.getInstance().chatManager.addMessageListener(messageListener);

// 不再需要监听时，移除同一个监听器对象。
ChatClient.getInstance().chatManager.removeMessageListener(messageListener);
```

:::tip
`ChatMessage#senderInfo` 及其字段均为可选值，表示当前本地可用的信息，不保证为最终最新值，使用前应判空。若消息触发用户信息更新，SDK 更新本地缓存后会通过 `onUserInfoUpdate` 或群成员名片事件通知业务层。
:::

## 从本地读取用户属性

如需直接从原生 SDK 的本地数据中读取一个或多个用户的属性，可调用 `ChatUserInfoManager#getLocalUserInfoByIds(userIds)`。该方法不会发起网络请求，返回类型为 `Promise<Map<string, ChatUserInfo>>`，Map 的键为用户 ID，值为对应的 `ChatUserInfo`。若本地不存在某个用户的属性，返回的 Map 中不会包含该用户。

// TODO：需要添加吗？
React Native SDK 不提供 Android 平台的单用户本地读取方法。读取单个用户时，向 `getLocalUserInfoByIds` 传入只包含一个用户 ID 的数组，再通过 `Map#get` 读取结果即可。

```typescript
try {
  const userInfoMap: Map<string, ChatUserInfo> =
    await ChatClient.getInstance().userManager.getLocalUserInfoByIds([
      'userId1',
      'userId2',
    ]);

  for (const [userId, userInfo] of userInfoMap) {
    console.log('本地用户属性：', {
      userId,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
    });
  }

  // 读取单个用户；本地没有对应数据时返回 undefined。
  const userInfo = userInfoMap.get('userId1');
  console.log('指定用户属性：', userInfo);
} catch (error) {
  console.error('读取本地用户属性失败：', error);
}
```

:::tip
`getLocalUserInfoByIds` 仅查询本地数据。如需主动从服务端获取一个或多个用户的最新属性，请调用 `ChatUserInfoManager#fetchUserInfoById(userIds)`，其返回类型同样为 `Promise<Map<string, ChatUserInfo>>`。详见 [管理用户属性](userprofile.html#获取用户属性)。
:::

## 注意事项

- `ChatOptions#enableUserInfo` 的默认值为 `false`，必须在 SDK 初始化时设置为 `true`。
- 建议在 SDK 初始化成功后、登录前注册 `ChatUserInfoEventListener`，并在不再需要时移除同一个监听器对象。
- 当消息中的更新时间晚于本地缓存或本地缺少相应数据时，SDK 会自动从服务端拉取最新数据并更新本地缓存。
- `ChatUserInfoManager#getLocalUserInfoByIds` 仅查询本地数据，不会主动从服务端拉取最新数据。
- `ChatUserInfo` 的昵称字段为 `nickName`，而 `ChatMessageSenderInfo` 的昵称字段为 `nickname`，大小写不同。
- `ChatMessageSenderInfo` 的群成员名片字段为 `groupNameCard`，而 `ChatGroupMember` 的对应字段为 `namecard`，大小写不同。

## 常见问题

#### 何时开启用户信息自动管理？

必须在调用 `ChatClient#getInstance().init(options)` 时通过 `ChatOptions` 传入 `enableUserInfo: true`。SDK 初始化完成后再修改原配置对象不会生效。

#### 功能开启后，SDK 会自动执行哪些操作？

开启 `ChatOptions#enableUserInfo` 后，SDK 会在登录成功后自动同步当前登录用户的信息；发送消息时自动附带发送方信息及更新时间；接收消息后自动比较消息中的更新时间与本地缓存；检测到数据更新或本地缺少数据时，自动从服务端拉取最新信息、更新本地缓存并通过事件通知业务层。

#### ChatMessage#senderInfo 一定是最新的吗？

不一定。`ChatMessage#senderInfo` 返回当前本地可用的发送方信息。如果消息触发了用户信息更新，SDK 会从服务端拉取最新数据并更新本地缓存，随后通过 `ChatUserInfoEventListener#onUserInfoUpdate` 或群成员名片事件通知业务层刷新界面。

#### 为何建议尽早注册监听？

开启用户信息自动管理后，SDK 可能在登录后的初始同步以及消息触发的用户信息更新场景中通知业务层。建议在 SDK 初始化成功后、登录前注册 `ChatUserInfoEventListener`，以便及时接收事件并刷新界面。

#### 本地读取和服务端获取有何区别？

`ChatUserInfoManager#getLocalUserInfoByIds` 仅查询原生 SDK 的本地数据，不会发起网络请求。如果业务需要获取最新用户属性，应调用 `ChatUserInfoManager#fetchUserInfoById` 主动从服务端获取。

#### 功能开启后还需要自己维护本地缓存吗？

通常不需要。开启 `ChatOptions#enableUserInfo` 后，SDK 会负责用户信息的自动同步、更新时间比较、本地缓存更新和事件通知。业务层通常只需读取 SDK 提供的数据，并在相关事件中刷新界面。应用如果需要持久化额外业务字段或建立自己的数据模型，仍可按业务需要维护应用侧数据。

## 相关功能

### 管理群成员名片

启用用户信息自动管理后，SDK 支持群成员名片的消息触发自动同步与更新。你还可以设置、查询和监听群成员名片变更，详见 [管理群成员名片](group_namecard.html)。

### 用户属性与用户信息

- 用户信息：指用于业务展示的用户相关信息，包括 [用户属性](userprofile.html)、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。
- 用户属性：指用户可设置和管理的资料字段，例如昵称、头像、邮箱、电话号码、性别、签名、生日和扩展字段。React Native SDK 使用 `ChatUserInfo` 表示用户属性，其中 `userId` 为 `String`，其余属性均为可选字段。你可以调用 `ChatUserInfoManager#updateOwnUserInfo` 更新当前登录用户的属性。开启用户信息自动管理后，更新后的信息会在后续发送消息时自动参与同步。详见 [管理用户属性](userprofile.html)。

### 通过消息同步的发送方信息

开启用户信息自动管理后，接收到的消息可通过 `ChatMessage#senderInfo` 提供发送方当前可用的用户 ID、昵称、头像、好友备注和群成员名片。

## 接口列表

| API 名称 | 所属模块/类 | 类型或返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`enableUserInfo`](#开启用户信息自动管理) | `ChatOptions` | `boolean` | 开启或关闭用户信息自动管理功能，默认值为 `false`。 |
| [`withAppKey`](#开启用户信息自动管理) / [`withAppId`](#开启用户信息自动管理) | `ChatOptions` | `ChatOptions` | 使用 App Key 或 App ID 创建 SDK 初始化配置。 |
| [`init`](#开启用户信息自动管理) | `ChatClient` | `Promise<void>` | 使用指定配置初始化 SDK。 |
| [`addUserInfoListener`](#监听用户属性更新) | `ChatUserInfoManager` | `void` | 添加用户属性事件监听器。 |
| [`removeUserInfoListener`](#监听用户属性更新) | `ChatUserInfoManager` | `void` | 移除指定的用户属性事件监听器。 |
| [`removeAllUserInfoListener`](#监听用户属性更新) | `ChatUserInfoManager` | `void` | 移除所有用户属性事件监听器。 |
| [`onSelfUserInfoUpdate`](#监听用户属性更新) | `ChatUserInfoEventListener` | `(userInfo: ChatUserInfo) => void` | 当前登录用户的属性更新回调。 |
| [`onUserInfoUpdate`](#监听用户属性更新) | `ChatUserInfoEventListener` | `(userInfos: ChatUserInfo[]) => void` | 其他用户的属性更新回调。 |
| [`senderInfo`](#通过消息获取发送方信息) | `ChatMessage` | `ChatMessageSenderInfo \| undefined` | 当前本地可用的消息发送方展示信息。 |
| [`getLocalUserInfoByIds`](#从本地读取用户属性) | `ChatUserInfoManager` | `Promise<Map<string, ChatUserInfo>>` | 从本地读取一个或多个用户的属性，不发起网络请求。 |
| [`fetchUserInfoById`](#从本地读取用户属性) | `ChatUserInfoManager` | `Promise<Map<string, ChatUserInfo>>` | 从服务端获取一个或多个用户的属性。 |
