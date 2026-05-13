
# 创建应用

要接入即时通讯 IM 服务，你必须首先在 [环信控制台](https://console.easemob.com/user/login) 创建应用。

- 你可以创建多个应用，请注意不同应用之间的数据不互通。
- 应用创建时默认为 **测试版**，可作为你的开发环境或测试环境使用。测试版应用可试用付费版本功能和增值服务，但存在 100 个注册用户数等限制。
- 测试版应用上线后将生成**正式版**应用，可作为您正式环境使用。请注意测试版应用和正式版应用之间**数据不互通**。

## 前提条件

创建应用前，你需要在 [环信控制台](https://console.easemob.com/user/login) [注册账号](account_register.html)。

## 操作步骤

1. 登录 [环信控制台](https://console.easemob.com/user/login)，在首页的 **应用概览** 区域点击 **创建应用**，创建即时通讯 IM 应用。

![img](/images/console/app_overview.png)

2. 在 **创建应用** 对话框中，输入新应用的相关信息，点击 **创建** 创建应用。新建应用的服务版本默认为免费版。

![img](/images/console/app_create.png)

| 参数            | 类型   | 是否必需 | 描述              |
| :-------------- | :----- | :------- | :---------------------------------------------- |
| AppName  | String | 是       | 应用名称，用于生成 App Key。该参数的值只能包含小写字母、数字和连字符，不能超过 32 个字符。 |
| Appkey  | String | 是       | 即时通讯 IM 分配给每个应用的唯一标识，由 **orgname** 和 **appname** 参数的值组成，生成后无法修改。**orgname**：你注册账号后，环信控制台会自动生成。 |
| 产品名称  | String | 是       | 产品名称，不能超过 32 个字符。 | 
| 描述  | String | 是       |  产品描述，不能超过 512 个字符。|
| 注册模式  | String | 是       | 用户注册模式：<br/> - **授权注册**：只有企业管理员或者应用管理员才能注册用户。相关的 REST API 介绍，详见 [授权注册单个用户](/document/server-side/account_register_authorized_single.html)和[批量授权注册用户](/document/server-side/account_register_authorized_batch.html)。<br/> - **开放注册**：使用客户端或 [REST API](/document/server-side/account_register_open.html)开放注册用户。一般在体验 Demo 和测试环境时使用，正式环境中不推荐这种方式。 |

3. 点击 **创建** 即可完成测试版应用的创建。







