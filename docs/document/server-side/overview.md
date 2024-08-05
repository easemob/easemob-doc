# 环信即时通讯 REST API 概览

<Toc />

环信即时通讯通过 REST 平台提供 REST API，你可以通过你的业务服务器向环信 REST 服务器发送 HTTP 请求，在服务端实现实时通信。

另外环信 Server SDK 提供了用户、消息、群组、聊天室等资源的操作管理能力，具体参见：[Java Server SDK](java_server_sdk.html) 和 [PHP Server SDK](php_server_sdk.html)。

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

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 请求结构

### 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信即时通讯使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用环信 App Token 鉴权](easemob_app_token.html)。

## 请求域名

环信不同数据中心的 REST API 请求域名 {host}：

应用所在数据中心可以在环信用户管理后台 > 应用列表找到对应的 App Key 点击 **管理** > **即时通讯** > **服务概览** 中查看：

![img](/images/applet/service_overview.png)

:::notice
1. 为满足不同客户的业务需求，环信在多地部署了数据中心。不同数据中心的 REST API 请求域名不同。请根据您所在数据中心选择请求域名。
2. 国内 VIP 区、客服专区客户请联系商务经理索要 REST API 请求地址。
3. 支持 HTTP 和 HTTPS。
:::

### 通信协议

环信即时通讯 REST API 支持 HTTP 和 HTTPS 协议。

### 数据格式

- 请求：请求的格式详见具体 API 中的示例。
- 响应：响应内容的格式为 JSON。

所有的请求 URL 和请求包体内容都是区分大小写的。

## REST API 概览

关于各 REST API 的方法、接口 URL、简要介绍以及调用频率上限，详见 [Restful API 调用频率限制](/product/limitationapi.html)。