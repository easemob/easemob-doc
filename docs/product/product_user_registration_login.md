# 用户注册与登录

本文介绍用户注册模式与登录方式。

## 用户注册模式

用户注册模式分为以下两种：

- 授权注册：通过环信提供的 REST API 注册环信用户账号，注册后保存到你的服务器或返给客户端。要使用授权注册，你需要在[环信控制台](https://console.easemob.com/user/login)的**功能配置 > 基础功能** > **用户** 页面，将**用户注册模式**设置为**授权注册**。相关的 REST API 介绍，详见[授权注册单个用户](/document/server-side/account_system.html#授权注册单个用户)和[批量授权注册用户](/document/server-side/account_system.html#批量授权注册用户)的接口介绍。

- 开放注册：一般在体验 Demo 和测试环境时使用，正式环境中不推荐使用该方式注册环信账号。要使用开放注册，需要在[环信控制台](https://console.easemob.com/user/login)的 **功能配置 > 基础功能** > **用户** 页面，将 **用户注册模式** 设置为 **开放注册**。只有打开该开关，才能使用客户端或 [REST API](/document/server-side/account_system.html#开放注册单个用户)开放注册用户。

除此以外，可以在 [环信控制台](https://console.easemob.com/user/login) 创建用户，详见 [创建用户相关介绍](/product/console/operation_user.html#创建用户)。

## 用户登录

初始化环信即时通讯 IM SDK 后，你需要调用登录接口进行登录。只有登录成功后，你才能正常使用 IM 的各种功能，例如消息和会话。

目前登录服务器支持主动和自动登录。主动登录有两种方式：

- 用户 ID + 密码
- 用户 ID + token

| 参数       | 类型   | 是否必需 | 描述          |
| :--------- | :----- | :------- | :-------------------------------------------- |
| `username` | String | 是  | 用户 ID，长度不可超过 64 个字节。不可设置为空。支持以下字符集：<br/>- 26 个小写英文字母 a-z；<br/>- 10 个数字 0-9；<br/>- “_”, “-”, “.”。 <br/><Container type="notice" title="注意"><br/>- 请勿使用大写英文字母 A-Z。若你同时使用了大写字母和小写字母，响应中返回的用户 ID 只包含小写字母。<br/>- 用户 ID 为公开信息，请勿使用 UUID、邮箱地址、手机号等敏感信息。</Container> |
| `token` | String | 是 | token 可以通过调用 REST API 获取，即传入用户 ID （或用户 ID + 密码）和 token 有效期参数获取，详见 [环信用户 token 的获取](/document/server-side/easemob_user_token.html)。<br/><Container type="notice" title="注意"><br/>- 你可以在调用 REST API 获取 token 时，传入 `ttl` 参数，设置 token 的有效期。此外，你也可以通过 [环信控制台](https://console.easemob.com/user/login/)的 **用户管理** 页面设置 token 的有效期。该参数值以最新设置为准。<br/>- 环信服务器完全信赖用户 token，为避免业务受影响，你需要确保 token 的安全。</Container> |
| `password` | String | 是 | 用户的登录密码，长度不可超过 64 个字符。|

## 登录流程

- 用户 ID + 密码

![img](/images/product/login_userid_pwd.png)

- 用户 ID + Token

![img](/images/product/login_userid_token.png)

:::tip
1. 关于获取 token，详见 [获取 App Token](/document/server-side/easemob_app_token.html)和 [获取 User Token](/document/server-side/easemob_user_token.html)。
2. 获取 token 时，token 有效期 `ttl` 以传入的值为准。若不传该参数，以[环信控制台](https://console.easemob.com/user/login)的 **用户管理** 页面的 token 有效期的设置为准，默认为 60 天。若设置为 `0`，则 token 永久有效。
:::

