# 管理用户属性

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。例如，在招聘场景下，可以利用用户属性功能存储性别、邮箱、用户类型（面试者）、职位类型（研发）等信息。

:::tip
为保证用户信息安全，HarmonyOS IM SDK 仅支持当前登录用户设置或更新自己的用户属性。`UserInfo#userId` 只用于标识查询或回调返回的用户，不能用于指定要修改的用户。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化和登录，详见 [初始化](initialization.html) 和 [登录](login.html) 文档。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 使用限制

- 单个用户的全部属性最大不超过 2 KB。
- 单个 app 的全部用户属性数据最大不超过 10 GB。
- 调用设置或获取用户属性的相关接口超过频率限制时，会返回错误码 `4` `EXCEED_SERVICE_LIMIT`。

## 开启用户信息自动管理功能

如果需要使用用户属性本地缓存、消息发送方信息以及登录后自动同步当前用户信息，需在调用 `ChatClient#init` 前开启 [用户信息自动管理功能](userinfo_provider.html)：

```typescript
const options = new ChatOptions({ appKey: 'your_app_key' });
options.setEnableUserInfo(true);

// 使用 options 初始化 SDK。
ChatClient.getInstance().init(context, options);
```

`ChatOptions#setEnableUserInfo` 默认为 `false`。未开启时，仍可调用服务端用户属性接口，但存在以下限制：

- SDK 不会自动同步消息发送方最新的群成员名片和用户属性；
- 从服务端获取的用户属性不会写入本地缓存；
- `UserInfoManager#getUserInfoById` 和 `getUserInfoWithUserId` 无法从本地读取相应数据；
- `ChatMessage#getSenderInfo()` 返回 `undefined`；
- 登录成功后，SDK 不会自动同步当前用户信息。

## 设置当前用户的属性

### 设置当前用户的所有属性

你可以调用 `UserInfoManager#updateUserInfo(userInfo)` 一次设置或更新当前用户的多个属性。

```typescript
const userInfo = new UserInfo();
userInfo.nickname = 'easemob';
userInfo.avatarUrl = 'https://www.easemob.com/avatar.png';
userInfo.birth = '2000.10.10';
userInfo.signature = 'hello world';
userInfo.phone = '13333333333';
userInfo.email = '123456@qq.com';
userInfo.gender = Gender.MALE;
userInfo.ext = '{"userType":"candidate","jobType":"web"}';

ChatClient.getInstance().userInfoManager()?.updateUserInfo(userInfo)
  .then((updatedInfo: UserInfo) => {
    // 用户属性更新成功。
  })
  .catch((error: ChatError) => {
    // error.errorCode 为错误码，error.description 为错误描述。
  });
```

客户端默认使用以下键名存储用户属性。[调用 RESTful 接口设置](/document/server-side/user_attribute_set.html) 或 [删除用户属性](/document/server-side/user_attribute_delete.html) 时，若希望客户端可正常读取，请保持键名一致。

| 字段        | 类型   | 描述                                                                                              |
| :---------- | :----- | :------------------------------------------------------------------------------------------------ |
| `nickname`  | String | 用户昵称。长度不超过 64 字符。                                                                    |
| `avatarurl` | String | 用户头像 URL。长度不超过 256 字符。                                                               |
| `phone`     | String | 用户联系方式。长度不超过 32 字符。                                                                |
| `mail`      | String | 用户邮箱。长度不超过 64 字符。                                                                    |
| `gender`    | Int    | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 其他值无效。       |
| `sign`      | String | 用户签名。长度不超过 256 字符。                                                                   |
| `birth`     | String | 用户生日。长度不超过 64 字符。                                                                    |
| `ext`       | String | 扩展字段。                                                                                        |

### 设置当前用户的单个属性

你可以调用 `UserInfoManager#updateUserInfo(userInfoType, value)` 设置当前用户的单个属性。例如，修改头像：

```typescript
const url = 'https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/avatar/Image1.png';

ChatClient.getInstance().userInfoManager()
  ?.updateUserInfo(UserInfoType.AVATAR_URL, url)
  .then((updatedInfo: UserInfo) => {
    // 头像更新成功。
  })
  .catch((error: ChatError) => {
    // 头像更新失败。
  });
```

将字符串属性的值设置为空字符串，会删除对应属性。例如：

```typescript
ChatClient.getInstance().userInfoManager()
  ?.updateUserInfo(UserInfoType.SIGN, '');
```

## 获取用户属性

### 从服务端获取用户的所有属性

你可以调用 `UserInfoManager#fetchUserInfoById(userId)`，从服务端获取一个或多个用户的全部属性。`userId` 可以是单个用户 ID，也可以是用户 ID 数组。成功时返回 `Promise<Map<string, UserInfo>>`，其中键为用户 ID，值为对应的用户属性。

自 v1.13.0 开始，开启 `ChatOptions#setEnableUserInfo(true)` 后，如果服务端返回的用户属性比本地缓存更新，SDK 会更新本地数据，并可能触发 `UserInfoListener#onUserInfoUpdate` 回调。

```typescript
const userIds: string[] = ['user1', 'user2'];

ChatClient.getInstance().userInfoManager()?.fetchUserInfoById(userIds)
  .then((userInfoMap: Map<string, UserInfo>) => {
    const user1 = userInfoMap.get('user1');
  })
  .catch((error: ChatError) => {
    // 获取失败。
  });
```

### 从服务端获取用户的指定属性

你可以给 `fetchUserInfoById` 传入第二个参数，只获取一个或多个指定属性。第二个参数可以是单个 `UserInfoType`，也可以是 `UserInfoType` 数组。省略第二个参数，或传入空的属性数组，均表示获取全部用户属性。

自 v1.13.0 开始，开启 `ChatOptions#setEnableUserInfo(true)` 后，如果服务端返回的用户属性比本地缓存更新，SDK 会更新本地数据，并可能触发 `UserInfoListener#onUserInfoUpdate` 回调。

```typescript
const userIds: string[] = [
  ChatClient.getInstance().getCurrentUser(),
  'user2'
];
const attributes: UserInfoType[] = [
  UserInfoType.NICKNAME,
  UserInfoType.AVATAR_URL
];

ChatClient.getInstance().userInfoManager()
  ?.fetchUserInfoById(userIds, attributes)
  .then((userInfoMap: Map<string, UserInfo>) => {
    // userInfoMap 中包含服务端返回的指定属性。
  })
  .catch((error: ChatError) => {
    // 获取失败。
  });
```

### 从本地缓存读取用户属性

如需从 SDK 本地缓存批量读取用户属性，可以调用 `UserInfoManager#getUserInfoById(userId)`。该方法不会发起网络请求，并通过 `Promise` 返回用户 ID 与 `UserInfo` 的映射；本地不存在的用户不会包含在结果中。

若只需同步读取单个用户的属性，可以调用 `UserInfoManager#getUserInfoWithUserId(userId)`。本地缓存中不存在该用户、用户 ID 为空或读取失败时，该方法返回 `undefined`。

```typescript
const manager = ChatClient.getInstance().userInfoManager();
const userIds: string[] = ['user1', 'user2'];

manager?.getUserInfoById(userIds)
  .then((userInfoMap: Map<string, UserInfo>) => {
    userInfoMap.forEach((info: UserInfo, userId: string) => {
      console.info(`userId=${userId}, nickname=${info.nickname}, avatarUrl=${info.avatarUrl}`);
    });
  })
  .catch((error: ChatError) => {
    console.error(`读取本地用户属性失败：${error.errorCode}, ${error.description}`);
  });

const localInfo: UserInfo | undefined = manager?.getUserInfoWithUserId('user1');
if (localInfo) {
  console.info(`nickname=${localInfo.nickname}`);
}
```

:::tip
本地用户属性缓存依赖用户信息功能。请在初始化 SDK 前调用 `ChatOptions#setEnableUserInfo(true)` [开启用户信息自动管理功能](#开启用户信息自动管理功能)。

若还需要 SDK 在登录成功后自动同步好友列表和好友信息，请在初始化前调用 `ChatOptions#setEnableAutoSyncContacts(true)`。同步完成后，可调用 `ContactManager#getContactsFromLocal()` 获取本地好友列表，并通过每个 `Contact` 对象的 `getUserInfo()` 读取其本地用户属性。关于初始化配置，详见 [初始化文档](initialization.html)。
:::

## 订阅非好友用户的属性变更

自 V1.14.0 起，SDK 支持订阅非好友用户的属性变更。订阅后，指定非好友用户的属性发生变化时，应用可以及时收到通知。

该功能适用于以下场景：

- 非好友会话中，需要及时更新对方昵称、头像等属性。
- 临时会话、客服沟通等场景中，需要感知非好友用户的属性变更。
- 群成员展示等场景中，需要维护指定非好友用户的最新用户属性。

:::tip
本功能只适用于非好友用户。当前用户、非好友用户和好友的用户属性变更通知方式不同，详见 [监听用户属性变更](#监听用户属性变更)。
:::

### 订阅非好友用户属性变更事件

你可以调用 `UserInfoManager#subscribeUsersInfo(userIds)` 订阅非好友用户属性变更事件。订阅成功后，当这些用户的属性发生变更时，SDK 会触发 `UserInfoListener#onUserInfoUpdate` 回调。

```typescript
const userIds: string[] = ['user1', 'user2'];

ChatClient.getInstance().userInfoManager()?.subscribeUsersInfo(userIds)
  .then(() => {
    // 订阅成功。
  })
  .catch((error: ChatError) => {
    // 订阅失败。
  });
```

### 取消订阅非好友用户属性变更事件

你可以调用 `UserInfoManager#unsubscribeUsersInfo(userIds)` 取消订阅非好友用户的属性变更事件。

```typescript
ChatClient.getInstance().userInfoManager()?.unsubscribeUsersInfo(userIds)
  .then(() => {
    // 取消订阅成功。
  })
  .catch((error: ChatError) => {
    // 取消订阅失败。
  });
```

### 获取已被订阅用户属性变更事件的用户列表

你可以调用 `UserInfoManager#fetchSubscribedUsers()` 获取已被订阅用户属性变更事件的用户列表。该用户列表中包含被订阅的非好友用户的用户 ID 及其用户属性。

```typescript
import { ChatClient, ChatError, UserInfo } from '@easemob/chatsdk';

ChatClient.getInstance().userInfoManager()?.fetchSubscribedUsers()
  .then((users: UserInfo[]) => {
    users.forEach((info: UserInfo) => {
      console.info(`userId=${info.userId}, nickname=${info.nickname}`);
    });
  })
  .catch((error: ChatError) => {
    // 获取失败。
  });
```

### 本地缓存说明

如果未订阅非好友用户的属性变更，应用通常需要在业务需要时主动调用接口从服务端拉取用户属性。为减少不必要的网络请求，建议先通过 `getUserInfoWithUserId` 或 `getUserInfoById` 复用本地缓存，再按业务需要决定是否 [拉取服务端数据](#从服务端获取用户的所有属性)。

## 监听用户属性变更

自 V1.13.0 起，HarmonyOS SDK 通过 `UserInfoListener` 提供以下用户属性事件：
- `onSelfUserInfoUpdate`：当前登录用户的属性同步或更新后触发。
- `onUserInfoUpdate`：其他用户的属性更新并写入本地数据后触发。

其他用户的属性更新可能由以下场景触发：

1. **主动拉取更新**：如果已开启 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理)，调用 [从服务端获取用户属性](#从服务端获取用户的所有属性) 或 [从服务端获取群成员信息](group_manage.html#获取群成员列表) 的接口时，如果服务端返回的用户属性更新时间晚于本地数据，原生 SDK 会更新本地数据并触发 `onUserInfoUpdate`。
2. **消息携带更新**：如果已开启 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理)，收到消息且消息中携带的发送方用户属性更新时间晚于本地缓存时，SDK 会重新拉取该用户的属性并触发 `onUserInfoUpdate`。该机制对好友和非好友发送方均生效。
3. **订阅用户变更（仅限非好友）**：已订阅的非好友用户属性发生变化时，SDK 会触发 `onUserInfoUpdate`。

**特殊说明**

- **当前用户**：当前登录用户的属性变更通过 `onSelfUserInfoUpdate` 单独回调。
- **好友用户**：若已开启 [登录后自动同步好友列表](user_relationship.html#登录后自动同步好友列表)，好友信息发生变更时还会触发 `ContactListener#onContactInfoUpdate(contact)`。可以调用 `Contact#getUserInfo()` 读取该好友的本地用户属性；该回调与 `UserInfoListener#onUserInfoUpdate` 的职责不同。

建议在 SDK 初始化成功后、登录前注册监听器；不再需要监听时，应移除同一个监听器对象。

```typescript
const userInfoListener: UserInfoListener = {
  onSelfUserInfoUpdate: (userInfo: UserInfo): void => {
    // 当前用户的属性已更新。
  },
  onUserInfoUpdate: (userInfoList: UserInfo[]): void => {
    // 其他用户的属性已更新。
  }
};

const manager = ChatClient.getInstance().userInfoManager();
manager?.addListener(userInfoListener);

// 页面或组件销毁时移除同一个监听器实例。
manager?.removeListener(userInfoListener);
```

## 常见问题

### 设置了用户昵称，为什么获取不到？

如果你已通过客户端或 RESTful API 设置用户昵称，但后续未能正确获取，通常需要检查以下几点：

- 调用 RESTful 接口设置用户昵称时，请求中必须使用 `nickname` 键名，否则 HarmonyOS 客户端无法将其解析为 `UserInfo.nickname`。
- 如果期望从本地缓存读取，请确认已在 SDK 初始化前调用 `ChatOptions#setEnableUserInfo(true)`，并已通过服务端拉取、登录同步、消息或订阅等方式将该用户的信息写入缓存。
- RESTful API [获取用户详情](/document/server-side/account_detail_obtain_single.html) 和 [删除用户账户](/document/server-side/account_delete_single.html) 返回的 `nickname` 表示推送昵称，即离线推送通知中显示的昵称，与用户属性中的昵称不同。建议两者保持一致；修改用户属性昵称时，也同步更新推送昵称。

例如，HarmonyOS 侧可调用 [updatePushNickname](/document/harmonyos/push/push_display_attribute.html#设置推送昵称) 更新推送昵称。RESTful API 可参考 [离线推送通知的显示属性配置](/document/server-side/push_nickname_set_single.html)。

### 为什么会返回错误码 4？

设置和获取用户属性的相关接口超过调用频率限制时，会返回错误码 `4` `EXCEED_SERVICE_LIMIT`。建议避免高频重复请求，并优先复用 SDK 本地缓存。

## 相关功能

### 用户头像管理

如果你的业务涉及用户头像管理，可参考以下流程：

1. 开通第三方文件存储服务。
2. 将头像文件上传到第三方存储，并获取文件 URL。
3. 调用 `updateUserInfo(UserInfoType.AVATAR_URL, url)`，将 URL 写入当前用户的头像属性。
4. 调用 `fetchUserInfoById` 获取头像 URL，并在本地 UI 中渲染。

HarmonyOS IM SDK 只保存和同步头像 URL，不负责上传或托管头像文件。

### 名片消息

如果业务中需要发送名片消息，可以结合自定义消息实现：

```typescript
function sendUserCard(to: string, user: UserInfo): void {
  const body = new CustomMessageBody('userCard');
  const params = new Map<string, string>();
  params.set('userId', user.userId ?? '');
  params.set('nickname', user.nickname ?? '');
  params.set('avatarUrl', user.avatarUrl ?? '');
  body.setParams(params);

  const message = ChatMessage.createSendMessage(to, body, ChatType.Chat);
  ChatClient.getInstance().chatManager()?.sendMessage(message);
}
```

名片中的用户 ID、昵称和头像是自定义消息参数。接收方应按约定解析 `CustomMessageBody.getParams()`，并根据业务需要通过 `fetchUserInfoById` 获取最新用户属性。

如果需要展示更多名片信息，可以继续在自定义消息体的参数中扩展字段。

### 用户属性与用户信息

用户信息指用于业务展示的用户相关信息，包括用户属性、[好友备注](user_relationship.html#设置好友备注) 和 [群成员名片](group_namecard.html)。

用户信息可以由以下数据共同组成：

- `UserInfo` 中的昵称、头像等用户属性。
- `Contact.remark()` 返回的 [好友备注](user_relationship.html#设置好友备注)。
- `GroupManager.getGroupNamecard(groupId, userId)` 返回的 [群成员名片](group_namecard.html)。
- `ChatMessage.getSenderInfo()` 返回的消息发送方信息，其中可包含用户 ID、昵称、头像、群名片和好友备注。

这些数据来源和更新时机不同。业务展示时，应根据单聊、群聊或联系人场景选择相应数据，并在需要最新用户属性时调用 `fetchUserInfoById`。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setEnableUserInfo`](#开启用户信息自动管理功能) | `ChatOptions` | 在 SDK 初始化前开启用户信息、本地缓存和消息发送方信息能力。 |
| [`updateUserInfo(userInfo)`](#设置当前用户的所有属性) | `UserInfoManager` | 设置或更新当前用户的多个属性。 |
| [`updateUserInfo(userInfoType, value)`](#设置当前用户的单个属性) | `UserInfoManager` | 设置、更新或删除当前用户的单个属性。 |
| [`fetchUserInfoById(userId)`](#从服务端获取用户的所有属性) | `UserInfoManager` | 从服务端获取一个或多个用户的全部属性。 |
| [`fetchUserInfoById(userId, attribute)`](#从服务端获取用户的指定属性) | `UserInfoManager` | 从服务端获取一个或多个用户的指定属性。 |
| [`getUserInfoById`](#从本地缓存读取用户属性) | `UserInfoManager` | 通过 `Promise` 从本地缓存批量读取用户属性。 |
| [`getUserInfoWithUserId`](#从本地缓存读取用户属性) | `UserInfoManager` | 从本地缓存同步读取单个用户的属性。 |
| [`subscribeUsersInfo`](#订阅非好友用户属性变更事件) | `UserInfoManager` | 订阅非好友用户的属性变更事件。 |
| [`unsubscribeUsersInfo`](#取消订阅非好友用户属性变更事件) | `UserInfoManager` | 取消订阅非好友用户的属性变更事件。 |
| [`fetchSubscribedUsers`](#获取已被订阅用户属性变更事件的用户列表) | `UserInfoManager` | 获取已订阅属性变更事件的非好友用户列表。 |
| [`addListener`](#监听用户属性变更) | `UserInfoManager` | 添加 `UserInfoListener`。 |
| [`removeListener`](#监听用户属性变更) | `UserInfoManager` | 移除 `UserInfoListener`。 |
