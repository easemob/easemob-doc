# 登录

初始化 IM SDK 后，你需要首先调用接口登录。登录成功后，才能使用 IM 的功能。

## 用户注册

用户注册支持以下方式:

- 开放注册：一般在体验 Demo 和测试环境时使用，正式环境中不推荐使用该方式注册环信账号。要使用开放注册，需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**即时通讯** > **服务概览**的**设置**区域，将**用户注册模式**设置为**开放注册**。只有打开该开关，才能使用客户端或 [REST API](/document/server-side/account_system.html#开放注册单个用户)开放注册用户。

示例代码如下：
  
```javascript
conn.registerUser({
  username: "user1",
  password: "xxx",
});
```

- 授权注册：通过环信提供的 REST API 注册环信用户账号，注册后保存到你的服务器或返给客户端。要使用授权注册，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**即时通讯** > **服务概览**的**设置**区域，将**用户注册模式**设置为**授权注册**。相关的 REST API 介绍，详见[授权注册单个用户](/document/server-side/account_system.html#授权注册单个用户)和[批量授权注册用户](/document/server-side/account_system.html#批量授权注册用户)的接口介绍。

除此以外，可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)创建正式环境下和测试环境下的用户，详见[创建用户相关介绍](/product/enable_and_configure_IM.html#创建-im-用户)。

## 登录方式

1. **用户 ID + token** 是更加安全的登录方式。

测试环境下，你在[环信即时通讯云控制台](https://console.easemob.com/user/login)创建用户后，环信服务器会自动为这些用户分配用户 Token，详见[测试环境下创建用户的介绍](/product/enable_and_configure_IM.html#测试环境)。

使用 token 登录时需要处理 token 过期的问题，比如在每次登录时更新 token 等机制。

```javascript
conn
  .open({
    user: "username",
    accessToken: "token",
  })
  .then(() => {
    console.log("login success");
  })
  .catch((reason) => {
    console.log("login fail", reason);
  });
```
2. **用户 ID + 密码** 登录是传统的登录方式。用户名和密码均由你的终端用户自行决定，密码需要符合[密码规则要求](/document/server-side/account_system.html#开放注册单个用户)。

```javascript
conn
  .open({
    user: "username",
    pwd: "password",
  })
  .then(() => {
    console.log("login success");
  })
  .catch((reason) => {
    console.log("login fail", reason);
  });
```

## 退出登录

```javascript
conn.close();
```

## 多设备登录

除了单端单设备登录，环信即时通讯 IM 支持同一账号在多端的多个设备上登录。多设备登录时，若同端设备数量超过限制，新登录的设备会将之前登录的设备踢下线。

关于多设备登录场景中的设备数量限制、互踢策略以及信息同步，详见[多设备登录文档](multi_device.html)。

