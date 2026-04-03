# 服务端 API 概览

<Toc />

环信即时通讯通过 REST 平台提供服务端 API，你可以通过你的业务服务器向环信 REST 服务器发送 HTTP 请求，在服务端实现实时通信。

另外，环信 Server SDK 提供了用户、消息、群组、聊天室等资源的操作管理能力，详见 [Java Server SDK](java_server_sdk.html) 和 [PHP Server SDK](php_server_sdk.html)。

## REST 平台架构

环信即时通讯 REST 平台提供多租户架构，以集合（Collection）的形式管理资源，一个 Collection 包含如下子集：

- 数据库（database）
- 组织（orgs）
- 应用（apps）
- 用户（users）
- 群组（chatgroups）
- 消息（chatmessages）
- 文件（chatfiles）

不同 org 之间的用户数据相互隔离；同一个 org 下，不同 app 之间的用户数据也相互隔离。一个 org 的数据架构如下图：

![img](/images/server-side/prepare_to_use_api.png)

## 请求结构

### 请求 URL

例如，注册用户的请求 URL 如下所示：

```http
POST https://{host}/{org_name}/{app_name}/users
```

每个请求 URL 均包括 `host`、`org_name` 和 `app_name` 参数。

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :------------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。<br/> - 为满足不同客户的业务需求，环信在多地部署了数据中心。不同数据中心的 REST API 请求域名不同。请根据您所在数据中心选择请求域名。<br/> - 国内 VIP 区、客服专区客户请联系商务经理获得 REST API 请求地址。<br/> -  支持 HTTP 和 HTTPS。|
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。 |
| `app_name` | String | 是       | 你在环信控制台创建应用时填入的应用名称。|

你可以在环信控制台的 **应用概览** 页面查看应用的域名 `host`、组织名称 `org_name` 和 应用名称 `app_name`。

![img](/images/server-side/app_info.png)

### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :----------------- | :-------------------- |
| `Content-Type`  | String | 是                                       | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是                                       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是                                       | App 管理权限的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。<br/>环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入该字段。关于如何获取动态密钥 app token，详见 [使用环信 App Token 鉴权](easemob_app_token.html)。 |

### 请求 body

请求的 body 取决于具体的请求。

### 通信协议

环信即时通讯 REST API 支持 HTTP 和 HTTPS 协议。

### 数据格式

- 请求：请求的格式详见具体 API 中的示例。
- 响应：响应内容的格式为 JSON。

所有的请求 URL 和请求包体内容都是区分大小写的。

## 服务端 API 列表

关于各 REST API 的方法、接口 URL、简要介绍以及调用频率上限，详见 [Restful API 调用频率限制](/document/server-side/limitationapi.html)。

## API 调用前提

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在 [环信控制台](https://console.easemob.com/user/login) [注册账号](/product/console/account_register.html)，[创建应用](/product/console/app_create.html)。
- 已从服务端获取 app token，详见 [使用 App Token 鉴权](easemob_app_token.html)。