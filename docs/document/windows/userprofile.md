# 管理用户属性

<Toc />

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能可以存储性别、邮箱、用户类型（面试者）、职位类型（Web 研发）等。查看用户信息时，可以直接查询服务器存储的用户属性信息。

本文介绍如何通过管理用户属性设置、更新、存储并获取实时消息用户的相关信息。

:::notice
为保证用户信息安全，SDK 仅支持用户设置或更新自己的用户属性。
:::

## 技术原理

环信即时通讯 IM Windows SDK 提供一个 `IUserInfoManager` 类，支持获取、设置及修改用户属性信息，其中包含如下方法：

- `UpdateOwnInfo` 设置和修改当前用户自己的属性信息；
- `FetchUserInfoByUserId` 获取指定用户的所有用户属性信息；

## 前提条件

设置用户属性前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

本节介绍如何在项目中设置及获取用户属性。

实现过程中注意单个用户的所有属性最大不超过 2 KB，单个 app 所有用户属性数据最大不超过 10 GB。

### 设置当前用户的属性

参考如下示例代码，在你的项目中当前用户设置自己的所有属性或者仅设置某一项属性。

```csharp
// 设置所有用户属性。
UserInfo userInfo;
userInfo.UserId = currentId;
userInfo.NickName = "easemob";
userInfo.AvatarUrl = "http://www.easemob.com";
userInfo.Birth = "2000.10.10";
userInfo.Signature = "hello world";
userInfo.PhoneNumber = "13333333333";
userInfo.Email = "123456@qq.com";
userInfo.Gender = 1;

SDKClient.Instance.UserInfoManager.UpdateOwnInfo(userInfo, new CallBack(
    onSuccess: () => {
    },
    onError:(code, desc) => {
    }
));
```

若[调用 RESTful 的接口设置](/document/server-side/userprofile.html#设置用户属性)或[删除用户属性](/document/server-side/userprofile.html#删除用户属性)，请求中必须传以下字段各客户端才能获取到。

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

```csharp
//获取一个或多个用户的所有属性，一次调用用户 ID 数量不超过 100。
List<string> idList = new List<string>();
idList.Add("username");
SDKClient.Instance.UserInfoManager.FetchUserInfoByUserId

SDKClient.Instance.UserInfoManager.FetchUserInfoByUserId(idList, type, startId, loadCount, new ValueCallBack<Dictionary<string, UserInfo>>(
    //result 是 Dictionary<string, UserInfo> 类型。
    onSuccess: (result) => {
    //遍历 dictionary 里所有的用户信息。
    },
    onError:(code, desc) => {
    }
));
```

## 更多功能

### 用户头像管理

如果你的应用场景中涉及用户头像管理，还可以参考如下步骤进行操作：

1. 开通第三方文件存储服务。详情可以参考文件储存服务商的文档。
2. 将头像文件上传至上述第三方文件存储，并获取存储 URL 地址。
3. 将该 URL 地址传入用户属性的头像字段（`AvatarUrl`）。
4. 调用 `fetchUserInfoById` 获取头像字段，并在本地 UI 中渲染用户头像。

### 名片消息

如果使用场景中涉及名片消息，你也可以使用自定义属性功能，并参考如下示例代码实现：

```csharp
// 设置自定义消息的 `event` 为 `userCard`，并在 `ext` 中添加展示名片所需要的用户 ID、昵称和头像等字段。
string event = "userCard";
Dictionary<string, string> adict = new Dictionary<string, string>();
adict.Add("UserId", userInfo.UserId);
adict.Add("Nickname", userInfo.Nickname);
adict.Add("AvatarUrl", userInfo.AvatarUrl);

// 创建自定义消息。
Message msg = Message.CreateCustomSendMessage(toChatUsername, event, adict);

SDKClient.Instance.ChatManager.SendMessage(ref msg, new CallBack(
    onSuccess: () => {
        Debug.Log($"{msg.MsgId}发送成功");
    },
    onError: (code, desc) => {
        Debug.Log($"{msg.MsgId}发送失败，errCode={code}, errDesc={desc}");
    }
));
```