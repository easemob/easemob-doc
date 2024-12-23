# 登录

初始化 IM SDK 后，你需要首先调用接口登录。登录成功后，才能使用 IM 的功能。

## 用户注册

用户注册模式分为以下两种：

- 开放注册：一般在体验 Demo 和测试环境时使用，正式环境中不推荐使用该方式注册环信账号。要使用开放注册，需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**即时通讯** > **服务概览**的**设置**区域，将**用户注册模式**设置为**开放注册**。只有打开该开关，才能使用客户端或 [REST API](/document/server-side/account_system.html#开放注册单个用户)开放注册用户。
  
示例代码如下所示：

```typescript
ChatClient.getInstance()
  .createAccount(username, password)
  .then((value: any) => {
    console.log("createAccount: success", value);
  })
  .catch((reason: any) => {
    console.log("createAccount: fail", reason);
  });
```

- 授权注册：通过环信提供的 REST API 注册环信用户账号，注册后保存到你的服务器或返给客户端。要使用授权注册，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**即时通讯** > **服务概览**的**设置**区域，将**用户注册模式**设置为**授权注册**。相关的 REST API 介绍，详见[授权注册单个用户](/document/server-side/account_system.html#授权注册单个用户)和[批量授权注册用户](/document/server-side/account_system.html#批量授权注册用户)的接口介绍。

除此以外，可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)创建正式环境下和测试环境下的用户，详见[创建用户相关介绍](/product/enable_and_configure_IM.html#创建-im-用户)。

## 主动登录

测试环境下，你在[环信即时通讯云控制台](https://console.easemob.com/user/login)创建用户后，环信服务器会自动为这些用户分配用户 Token，详见[测试环境下创建用户的介绍](/product/enable_and_configure_IM.html#测试环境)。

使用 token 登录时需要处理 token 过期的问题，比如在每次登录时更新 token 等机制。

```typescript
// userId: 用户ID
// userPassword: 用户密码或者token
// isPassword: 是否使用密码
ChatClient.getInstance()
  .login(userId, userPassword, isPassword)
  .then(() => {
    console.log("login success.");
  })
  .catch((error) => {
    console.log("login fail: ", error);
  });
```

## 自动登录

初始化时，你可以设置 `ChatOptions#autoLogin` 选项确定是否自动登录。如果设置为自动登录，则登录成功之后，后续初始化 SDK 时会自动登录。

## 获取当前登录的用户

你可以调用 `ChatClient#getCurrentUsername` 方法获取当前登录用户的用户 ID。

## 获取登录状态

你可以调用 `ChatClient#isLoginBefore` 方法获取当前用户的登录状态。

## 退出登录

你可以调用 `logout` 方法退出登录。退出登录后，你不会再收到其他用户发送的消息。

```typescript
// unbindDeviceToken: 是否基础推送token绑定
ChatClient.getInstance()
  .logout(unbindDeviceToken)
  .then(() => {
    console.log("logout: success.");
  })
  .catch((e) => {
    console.log(e);
  });
```

:::tip

1. 如果集成了第三方推送，`logout` 方法中 `unbindDeviceToken` 参数需设为 `true`，退出时会解绑设备 token，否则可能会出现退出了，还能收到消息推送通知的现象。
2. 有时可能会遇到网络问题而解绑失败，app 处理时可以弹出提示框让用户选择，是否继续退出(弹出框提示继续退出能收到消息的风险)，如果用户选择继续退出，传 `false` 再调用 `logout` 方法退出成功。当然也可以失败后还是返回退出成功，然后在后台起个线程不断调用 `logout` 方法直到成功。这样存在风险，即用户杀掉了 app，网络恢复后用户还会继续收到消息。

## 账号切换

若在 app 中从当前账号切换到其他账号，你需要首先调用 `logout` 方法登出，然后再调用 `login` 方法登录。

## 多设备登录

除了单端单设备登录，环信即时通讯 IM 支持同一账号在多端的多个设备上登录。多设备登录时，若同端设备数量超过限制，新登录的设备会将之前登录的设备踢下线。

关于多设备登录场景中的设备数量限制、互踢策略以及信息同步，详见[多设备登录文档](multi_device.html)。

## 更多

### 登录被封禁账号的提示

在环信即时通讯控制台或调用 REST API 封禁用户账号后，若仍使用该账号登录，SDK 会返回 "service is disabled"（305 错误）, 可以根据用户这个返回值来进行相应的提示或者处理。
