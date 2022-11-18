# 管理用户属性

<Toc />

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。查看用户信息时，可以直接查询服务器存储的用户属性信息。

本文介绍如何通过管理用户属性设置、更新、存储并获取实时消息用户的相关信息。

:::notice
为保证用户信息安全，SDK 仅支持用户设置或更新自己的用户属性。
:::

## 技术原理

环信即时通讯 IM Flutter SDK 提供一个 `EMUserInfoManager` 类，支持获取、设置及修改用户属性信息，其中包含如下方法：

- `updateUserInfo` 设置和修改当前用户自己的属性信息；
- `fetchUserInfoById` 获取指定用户的属性信息；
- `fetchOwnInfo` 获取当前用户自己的属性信息。

## 前提条件

设置用户属性前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

本节介绍如何在项目中设置及获取用户属性。

实现过程中注意单个用户的所有属性最大不超过 2 KB，单个 app 所有用户属性数据最大不超过 10 GB。

### 设置当前用户的属性

参考如下示例代码，在你的项目中当前用户设置自己的所有属性或者仅设置某一项属性。

```dart
try {
  EMClient.getInstance.userInfoManager.updateUserInfo(userInfo);
} on EMError catch (e) {
  // 更新用户属性失败，返回错误信息。
}
```

用户属性包括如下字段：

<UserAttribute />

### 获取用户属性

用户可以获取指定一个或多个用户的全部用户属性。

示例代码如下：

```dart
// 获取一个或多个用户的所有属性，一次调用用户 ID 数量不超过 100。
List<String> list = ["tom", "json"];
try {
  Map<String, EMUserInfo> userInfos =
      await EMClient.getInstance.userInfoManager.fetchUserInfoById(list);
} on EMError catch (e) {
  // 获取用户属性失败，返回错误信息。
}
```

### 获取当前用户的属性

调用 `fetchOwnInfo` 获取当前用户的用户属性：

```dart
try {
  EMUserInfo? userInfo =
      await EMClient.getInstance.userInfoManager.fetchOwnInfo();
} on EMError catch (e) {
  // 获取当前用户属性失败，返回错误信息。
}
```

## 更多功能

### 用户头像管理

如果你的应用场景中涉及用户头像管理，还可以参考如下步骤进行操作：

1. 开通第三方文件存储服务。详情可以参考文件储存服务商的文档。
2. 将头像文件上传至上述第三方文件存储，并获取存储 URL 地址。
3. 将该 URL 地址传入用户属性的头像字段（avatarUrl）。
4. 调用 `fetchUserInfoById` 获取头像字段，并在本地 UI 中渲染用户头像。