# 管理用户属性

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。查看用户信息时，可以直接查询服务器存储的用户属性信息。

本文介绍如何通过管理用户属性设置、更新、存储并获取实时消息用户的相关信息。

:::tip
为保证用户信息安全，SDK 仅支持用户设置或更新自己的用户属性。
:::

## 技术原理

环信即时通讯 IM HarmonyOS SDK 提供一个 `UserInfoManager` 类，支持获取、设置及修改用户属性信息，其中包含如下方法：

- `updateUserInfo` 设置当前用户的所有属性或单个属性
- `fetchUserInfoById` 获取指定一个或多个用户的全部用户属性；获取单个用户的单个或多个用户属性。

## 前提条件

设置用户属性前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 使用限制

- 单个用户的全部属性最大不超过 2 KB。
- 单个 app 的全部用户属性数据最大不超过 10 GB。
- 调用设置或获取用户属性的相关接口超过频率限制时，会返回错误码 `4` `EXCEED_SERVICE_LIMIT`。

## 设置当前用户的属性

### 设置当前用户的所有属性

当前用户设置自己的所有属性，传入完整 `UserInfo` 对象：

```typescript
let userInfo: UserInfo = {
  nickname: "easemob",
  avatarUrl: "https://www.easemob.com",
  birth: "2000/10/10",
  signature: "Hello world",
  phone: "16666666666",
  email: "666@qq.com",
  gender: Gender.MALE
}

ChatClient.getInstance().userInfoManager()?.updateUserInfo(userInfo).then(result => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
});
```

客户端默认使用以下键名存储用户属性。[调用 RESTful 接口设置](/document/server-side/user_attribute_set.html) 或 [删除用户属性](/document/server-side/user_attribute_delete.html) 时，若希望客户端可正常读取，请保持键名一致。

| 字段        | 类型   | 描述    |
| :---------- | :----- | :------- |
| `nickname`  | String | 用户昵称。长度在 64 字符内。    |
| `avatarurl` | String | 用户头像 URL 地址。长度在 256 字符内。   |
| `phone`     | String | 用户联系方式。长度在 32 字符内。   |
| `mail`      | String | 用户邮箱。长度在 64 字符内。   |
| `gender`    | Int    | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 设置为其他值无效。 |
| `sign`      | String | 用户签名。长度在 256 字符内。   |
| `birth`     | String | 用户生日。长度在 64 字符内。     |
| `ext`       | String | 扩展字段。   |

### 设置当前用户的单个属性

你可以调用 `updateUserInfo` 设置当前用户的单个属性，按单个 `UserInfoType` 字段更新。例如，修改头像：

```typescript
let userInfo: UserInfo = {
  avatarUrl: "https://xxx/downloads/IMDemo/avatar/Image1.png"
}
ChatClient.getInstance().userInfoManager()?.updateUserInfo(userInfo).then(result => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
});
```

## 获取用户属性

### 从服务端获取用户的所有属性

你可以调用 `fetchUserInfoById` 从服务端获取指定一个或多个用户的全部用户属性。该接口返回 `Promise<Map<string, UserInfo>>`。

自 v1.13.0 开始，若返回的用户属性更新时间戳大于本地存储的用户属性更新时间戳，SDK 会触发 `UserInfoListener#onUserInfoUpdate` 事件。

```typescript
// 每次传入的用户 ID 数量不超过 100 个。
let userIds = new Array<string>();
userIds.push(this.userId);
ChatClient.getInstance().userInfoManager()?.fetchUserInfoById(userIds).then(result => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
});
```

### 从服务端获取用户的指定属性

你可以调用 `fetchUserInfoById` 获取指定用户的一个或多个属性。自 v1.13.0 开始，若返回的用户属性更新时间戳大于本地存储的用户属性更新时间戳，SDK 会触发 `UserInfoListener#onUserInfoUpdate` 事件。

```typescript
let userIds = new Array<string>();
userIds.push(this.userId);
let userTypes = new Array<UserInfoType>();
userTypes.push(UserInfoType.NICKNAME);
userTypes.push(UserInfoType.AVATAR_URL);
ChatClient.getInstance().userInfoManager()?.fetchUserInfoById(userIds, userTypes).then(result => {
  // success logic
}).catch((e: ChatError) => {
  // failure logic
});
```

### 从本地内存读取用户属性

自 V4.20.0 起，可以调用 `EMUserInfoManager#getUserInfoWithUserId` 直接从本地内存读取用户属性。该接口返回的是单个用户的 `EMUserInfo`。它适用于直接从本地内存读取指定用户的资料，不会发起网络请求，因此可以作为好友列表读取能力之外的补充资料读取方式。

```java
EMClient.getInstance().userInfoManager().getUserInfoWithUserIds(
        new String[] {"userId1", "userId2"},
        new EMValueCallBack<Map<String, EMUserInfo>>() {
            @Override
            public void onSuccess(Map<String, EMUserInfo> userInfoMap) {
                for (Map.Entry<String, EMUserInfo> entry : userInfoMap.entrySet()) {
                    EMUserInfo userInfo = entry.getValue();
                    EMLog.d("UserInfo", "用户属性 - userId:" + entry.getKey()
                            + ", nickname:" + userInfo.getNickname()
                            + ", avatarUrl:" + userInfo.getAvatarUrl());
                }
            }

            @Override
            public void onError(int code, String error) {
                EMLog.e("UserInfo", "读取本地用户属性失败：" + code + ", " + error);
            }
        });
```

:::tip
该接口仅返回本地内存的数据。如需主动从服务端获取最新用户属性，请调用 `EMUserInfoManager#fetchUserInfoByUserId` 方法。详见 [管理用户属性](userprofile.html#从服务端获取用户的所有属性)。
:::

## 监听用户属性变更

自 v1.13.0，你可以监听用户属性变更。

好友用户及非好友用户的属性更新，均可能通过以下方式触发 SDK 的 `UserInfoListener#onUserInfoUpdate` 事件：

1. **主动拉取更新**：调用 [从服务端获取用户属性](userprofile.html#从服务端获取用户的所有属性) 或 [从服务端获取群成员信息](group_manage.html#获取群成员列表) 接口时，若服务端返回的用户属性更新时间戳大于本地存储的时间戳，SDK 会自动更新本地数据并触发该事件。
2. **消息携带更新**：若启用了 [用户信息自动管理功能](userinfo_provider.html#开启用户信息自动管理)，当收到消息且消息中携带的发送方用户属性更新时间晚于本地缓存时，SDK 会重新拉取该用户属性并触发该事件。此机制对好友与非好友发送方均生效。
3. **订阅用户变更（仅限非好友）**：若已订阅非好友用户的属性变更事件，则当这些被订阅的非好友用户属性发生变更时，SDK 也会触发该事件。

**特殊说明**

- **当前用户**：当前用户的属性变更，通过 `UserInfoListener#onSelfUserInfoUpdate` 事件单独回调，不适用上述 `onUserInfoUpdate` 逻辑。
- **仅限好友用户**：若启用了 [登录后自动同步好友列表功能](user_relationship.html#获取好友列表和好友信息)，SDK 会在登录完成后自动拉取并更新本地好友数据。好友属性变更时，会触发 `ContactListener#onContactInfoUpdate(contact: Contact)` 事件。此事件为好友关系特有，与 `UserInfoListener#onUserInfoUpdate` 区分。

## 相关功能

### 用户头像管理

如果你的应用场景中涉及用户头像管理，还可以参考如下步骤进行操作：

1. 开通第三方文件存储服务。详情可以参考文件储存服务商的文档。
2. 将头像文件上传至上述第三方文件存储，并获取存储 URL 地址。
3. 将该 URL 地址传入用户属性的头像字段（`avatarUrl`）。
4. 调用 `fetchUserInfoById` 获取头像 URL，并在本地 UI 中渲染头像。

### 常见问题

Q：我设置了用户昵称（`nickname`），但调用客户端或 RESTful API 获取用户属性时，未返回用户昵称，原因是什么？

A：你可以调用 [客户端](#设置当前用户的所有属性) 或 [RESTful API](/document/server-side/user_attribute_set.html) 设置用户昵称，例如，调用 `updateUserInfo`，然后通过 [客户端](#从服务端获取用户的所有属性) 或 [RESTful API](/document/server-side/user_attribute_obtain_single.html) 获取用户属性，例如 SDK 为 `fetchUserInfoById`。

设置用户昵称时，请注意以下：

1. 调用 RESTful 接口设置用户昵称时，若要确保在客户端能够获取设置，请求中必须传 `nickname` 键名。

Q: 调用设置或获取用户属性的接口时，上报错误码 4 的原因是什么？

A：设置和获取用户属性的接口，包括设置当前用户的属性、获取单个或多个用户的用户属性和获取指定用户的指定用户属性，超过调用频率限制时，会上报错误码 4 `EXCEED_SERVICE_LIMIT`。
