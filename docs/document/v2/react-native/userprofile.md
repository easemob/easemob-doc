# 管理用户属性

<Toc />

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。查看用户信息时，可以直接查询服务器存储的用户属性信息。

本文介绍如何通过管理用户属性设置、更新、存储并获取实时消息用户的相关信息。

:::notice
为保证用户信息安全，SDK 仅支持 Chat 用户设置或更新自己的用户属性。
:::

## 技术原理

环信即时通讯 IM React Native SDK 提供一个 `ChatUserInfoManager` 类，支持获取、设置及修改用户属性信息，其中包含如下方法：

- 设置当前用户的属性
- 获取用户属性
- 获取当前用户的属性

## 前提条件

设置用户属性前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/document/v2/privatization/uc_limitation.html)。

## 实现方法

本节介绍如何在项目中设置及获取用户属性。

实现过程中注意单个用户的所有属性最大不超过 2 KB，单个 app 所有用户属性数据最大不超过 10 GB。

### 设置当前用户的属性

参考如下示例代码，在你的项目中当前用户设置自己的所有属性或者仅设置某一项属性。

```typescript
// 更新当前用户信息
// 除了用户 ID，其他属性都可以更新
// 可以同时更新任何一个或者多个属性
ChatClient.getInstance()
  .userManager.updateOwnUserInfo({
    nickName,
    avatarUrl,
    mail,
    phone,
    gender,
    sign,
    birth,
    ext,
  })
  .then(() => {
    console.log("update userInfo success.");
  })
  .catch((reason) => {
    console.log("update userInfo fail.", reason);
  });
```

若[调用 RESTful 的接口设置](/document/v2/server-side/userprofile.html#设置用户属性)或[删除用户属性](/document/v2/server-side/userprofile.html#删除用户属性)，请求中必须传以下字段各客户端才能获取到。

| 字段        | 类型   | 描述                                                         |
| :---------- | :----- | :----------------------------------------------------------- |
| `nickname`  | String | 用户昵称。长度在 64 字符内。                                 |
| `avatarurl` | String | 用户头像 URL 地址。长度在 256 字符内。                       |
| `phone`     | String | 用户联系方式。长度在 32 字符内。                             |
| `mail`      | String | 用户邮箱。长度在 64 字符内。                                 |
| `gender`    | Int | 用户性别：<br/> -  `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 设置为其他值无效。 |
| `sign`      | String | 用户签名。长度在 256 字符内。                                |
| `birth`     | String | 用户生日。长度在 64 字符内。                                 |
| `ext`       | String | 扩展字段。                                                   |

### 获取用户属性

用户可以获取指定一个或多个用户的全部用户属性。

示例代码如下：

```typescript
// 指定获取的一个或者多个用户 ID，一次调用用户 ID 数量不超过 100。
const userIds = ["tom", "json"];
// 执行获取操作
ChatClient.getInstance()
  .userManager.fetchUserInfoById(userIds)
  .then((users) => {
    console.log("get userInfo success.", users);
  })
  .catch((reason) => {
    console.log("get userInfo fail.", reason);
  });
```

### 获取当前用户的属性

```typescript
// 执行获取操作
ChatClient.getInstance()
  .userManager.fetchOwnInfo()
  .then((users) => {
    console.log("get userInfo success.", users);
  })
  .catch((reason) => {
    console.log("get userInfo fail.", reason);
  });
```

## 更多功能

### 用户头像管理

如果你的应用场景中涉及用户头像管理，还可以参考如下步骤进行操作：

1. 开通第三方文件存储服务。详见 [阿里云文件存储 NAS](https://help.aliyun.com/product/27516.html) 或其他第三方文件存储帮助文档。
2. 将头像文件上传至上述第三方文件存储，并获取存储 URL 地址。
3. 将该 URL 地址传入用户属性的头像字段（avatarUrl）。
4. 调用 `fetchUserInfoById` 获取头像字段，并在本地 UI 中渲染用户头像。

### 名片消息

如果使用场景中涉及名片消息，你也可以使用自定义属性功能，并参考如下示例代码实现：

```typescript
// 自定义消息。消息内容由两部分组成：消息事件和扩展字段。
// 扩展字段用户可以自行实现和使用。
const event = "userCard";
const ext = { userId: "userId", nickname: "nickname", avatarUrl: "avatarUrl" };
const msg = ChatMessage.createCustomMessage(targetId, event, chatType, {
  params: JSON.parse(ext),
});
// 消息发送结果会通过回调对象返回，这里返回的结果只是说明发送消息的动作成功或者失败。不代表消息发送的成功或者失败。
ChatClient.getInstance()
  .chatManager.sendMessage(msg!, new ChatMessageCallback())
  .then(() => {
    // 消息发送动作完成，会在这里打印日志。
    console.log("send message success.");
  })
  .catch((reason) => {
    // 消息发送动作失败，会在这里打印日志。
    console.log("send message fail.", reason);
  });
```

如果需要在名片中展示更丰富的信息，可以在 `ext` 中增加更多字段。