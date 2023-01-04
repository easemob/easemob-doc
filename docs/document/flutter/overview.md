# SDK 集成概述

<Toc />

介绍 flutter 集成相关内容。

## 前提条件

开始前，请注册有效的环信即时通讯 IM 开发者账号和取得 App key，见 [环信即时通讯云管理后台](https://console.easemob.com/user/login)。

## 集成环境

具体见 [开发环境要求](quickstart.html#前提条件)。

## SDK 初始化

初始化是使用 SDK 必要的、执行在所有接口方法调用之前的步骤。
如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

初始化示例代码：

```dart
await EMClient.getInstance.init(EMOptions(
    appKey: "<#your app key#>",
));
```

## 注册用户

可以使用如下代码创建账号：

```dart
try {
    await EMClient.getInstance.createAccount(userId, password);
} on EMError catch (e) {}
```

:::notice
- 以上注册模式为在客户端注册，主要用于测试，简单方便，但不推荐在正式环境中使用；
- 正式环境应使用服务器端调用 REST API 接口注册，[注册用户](https://docs-im.easemob.com/ccim/rest/accountsystem#注册用户)。
:::

## 用户登录

目前登录服务器支持手动和自动登录。手动登录有两种方式：

- 通过 **用户 ID + 密码** 登录；
- 通过 **用户 ID + token** 登录。

:::notice
使用 token 登录时需要处理 token 过期的问题，比如在每次登录时更新 token 等机制。
:::

### 手动登录

**用户 ID + 密码** 登录是传统的登录方式。用户名和密码都是你的终端用户自行决定，密码需要符合密码规则要求。

```dart
try {
    await EMClient.getInstance.login(userId, password);
} on EMError catch (e) {}
```

**用户 ID + token** 是更加安全的登录方式。token 可以通过调用 REST API 获取。 详见 [环信用户 token 的获取](/document/server-side/easemob_user_token.html)。

```dart
try {
  await EMClient.getInstance.login(userId, token, false);
} on EMError catch (e) {}
```

### 自动登录

在初始化的时候，可以设置是否自动登录。如果设置为自动登录，则登录成功之后，后续启动初始化的时候会自动登录。

## 退出登录

```dart
try {
  await EMClient.getInstance.logout(true);
} on EMError catch (e) {}
```

## 连接状态相关

你可以通过注册连接监听来确认连接状态。

```dart
// 注册连接状态监听
EMClient.getInstance.addConnectionEventHandler(
  "UNIQUE_HANDLER_ID",
  EMConnectionEventHandler(
    // sdk 连接成功;
    onConnected: () => {},
    // 由于网络问题导致的断开，sdk会尝试自动重连，连接成功后会回调 "onConnected";
    onDisconnected: () => {},
    // 用户 token 鉴权失败;
    onUserAuthenticationFailed: () => {},
    // 由于密码变更被踢下线;
    onUserDidChangePassword: () => {},
    // 用户被连接被服务器禁止;
    onUserDidForbidByServer: () => {},
    // 用户已经在其他设备登录;
    onUserDidLoginFromOtherDevice: () => {},
    // 用户登录设备超出数量限制;
    onUserDidLoginTooManyDevice: () => {},
    // 用户从服务器删除;
    onUserDidRemoveFromServer: () => {},
    // 由于其他设备登录被踢下线；
    onUserKickedByOtherDevice: () => {},
    // Token 过期;
    onTokenDidExpire: () => {},
    // Token 即将过期，需要调用 renewToken;
    onTokenWillExpire: () => {},
  ),
);
// 解注册连接状态监听
EMClient.getInstance.removeConnectionEventHandler(
  "UNIQUE_HANDLER_ID",
);
```

