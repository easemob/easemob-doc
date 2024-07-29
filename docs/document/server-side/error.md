# 常见错误码

<Toc />

本文介绍 REST 接口调用后的返回结果响应码。可根据返回数据中的 error 字段判断具体错误。

- 响应码：200（成功）。
- 响应码：4xx（请求错误），表示请求可能出错，影响服务器的处理。
- 响应码：5xx（服务器错误），表示服务器在尝试处理请求时发生内部错误。

返回示例如下图所示：

![REST API返回错误示例](@static/images/server-side/response_icon.jpeg)

建议对 App 自己的服务器端调用的 REST API 结果进行容错处理，例如：

- catch 接口调用返回的异常 timeout 可以尝试重新调用。
- 对于系统级别错误或重试后仍旧出错，应该记录到系统日志，并及时报警提示运维人员做补救措施，如人工补发。

## 错误状态码概述

| HTTP 返回码（Status Code）<div style="width: 220px;"></div> | 说明（Description）                                          |
| :------------------------- | :----------------------------------------------------------- |
| 400                        | （错误请求）服务器不理解请求的语法。                         |
| 401                        | （未授权）请求要求身份验证。对于需要 token 的接口，服务器可能返回此响应。 |
| 403                        | （禁止）服务器拒绝请求。例如，对于群组/聊天室服务，以下两种常见情况会报该错误：<br/>- 本次调用不符合群组/聊天室操作的正确逻辑，例如调用添加成员接口，添加已经在群组里的用户，或者移除聊天室中不存在的成员等操作。<br/>- 每秒发送的消息条数超过了[发送群组消息 API](message_group.html) 和[发送聊天室消息 API](message_chatroom.html) 的限制，即群组消息的每秒发送上限为 20，聊天室为 100。 |
| 404                        | （未找到）服务器找不到请求的接口。                           |
| 405                        | （请求方式错误）请按照环信官网接口说明，正确的使用接口 GET，POST 等请求方式。 |
| 408                        | （请求超时）服务器等候请求时发生超时。                       |
| 409                        | 并发调用[通过用户 ID 获取用户 token 的 API](easemob_user_token.html#通过用户-id-获取用户-token) 时若设置了自动创建用户则报错。也就是说，调用了该 API 时将 `grant_type` 设置为 `inherit`，`autoCreateUser` 设置为 `true`，则会上报该错误。如果获取 token 的用户已注册，并发调用该 API 则不会报错。|
| 413                        | （消息附件过大）调用[上传文件](message_download.html#上传文件)接口上传的消息附件超过了最大限制。  |
| 415                        | 请求体的类型不支持。                                         |
| 429                        | （服务不可用）请求接口超过调用频率限制，即接口被限流。或超过社区版限制，如有需要可联系商务。 |
| 500                        | （服务器内部错误）服务器遇到错误，无法完成请求。例如：<br/> -  no_full_text_index: "Entity ‘user’ with property named ‘username’ is not full text indexed. You cannot use the ‘contains’ operand on this field" 该错误表示 username 不支持全文索引，不可以对该字段进行 `contains` 操作。<br/> - unsupported_service_operation："Service operation not supported" 该错误表示请求 URL 不支持该请求方式。<br/> -  web_application："javax.ws.rs.WebApplicationException" 表示请求 URL 错误。  |
| 501                        | （尚未实施）服务器不具备完成请求的功能。例如，服务器无法识别请求方法时可能会返回此代码。 |
| 502                        | （错误网关）服务器作为网关或代理，从上游服务器收到无效响应。 |
| 503                        | （服务器超时）服务不可用。                        |
| 504                        | （网关超时）服务器作为网关或代理，但是没有及时从上游服务器收到请求。 |

## 各功能的错误码

环信即时通讯 IM 的各功能的每个 REST API 均提供错误码列表，请按功能模块查看接口的错误码。

| 功能模块 | 描述    | 错误码    | 
| :---------- | :---------- | :---------- |
| 用户体系管理        | 注册/删除用户、获取用户详情、修改用户密码、封禁/解禁用户、全局用户禁言、获取用户在线状态、获取用户离线消息数据、获取指定账号的在线登录设备。 | 关于错误码，详见[用户体系管理](account_system.html)中各接口对应的错误码列表。 | 
| 用户属性            | 设置/删除/获取用户属性、获取 app 下用户属性总大小。 | 关于错误码，详见[用户属性模块](userprofile.html)中各接口对应的错误码列表。 |
| 用户关系            | 添加/移除好友、设置好友备注、获取好友列表和导入好友列表。 | 关于错误码，详见[用户关系管理模块](user_relationship.html)中各接口对应的错误码列表。|
| 消息                | 消息相关功能，包括发送消息、上传/下载文件、撤回消息、删除漫游消息、修改/导入消息。  | 详见以下 API 对应的错误码列表：<br/> - [发送单聊消息](message_single.html) <br/> - [发送群聊消息](message_group.html) <br/> - [发送聊天室消息](message_chatroom.html)<br/> - [上传和下载文件](message_download.html) <br/> - [撤回消息和单向删除会话](message_recall.html)<br/> - [单向删除漫游消息](message_delete.html)<br/> - [修改文本或自定义消息](message_modify_text_custom.html) <br/> - [导入消息](message_import.html)  |
| 群组                | 群组管理、群成员管理、子区管理。        | 关于错误码，详见[群组模块](group.html)中各接口对应的错误码列表。 |
| 聊天室              | 聊天室管理、聊天室属性管理、聊天室成员管理。  | 关于错误码，详见[聊天室模块](chatroom.html)中各接口对应的错误码列表。 |
| 在线状态订阅    | 设置用户在线状态、订阅/取消订阅/查询用户在线状态、查询单个群组的在线成员数量。  | 关于错误码，详见[在线状态订阅](presence.html)中各接口对应的错误码列表。           |
| 消息表情回复（Reaction）   | 创建/追加/删除 Reaction、根据消息 ID 获取 Reaction、根据消息 ID 和表情 ID 获取 Reaction 信息。 | 关于错误码，详见[消息表情回复](reaction.html)中各接口对应的错误码列表。  |
| 离线推送    | 绑定/解除绑定推送信息、查询推送绑定信息、设置离线推送时显示的昵称、展示方式、免打扰、通知首选语言、使用推送模板。| 关于错误码，详见[离线推送](push.html)中各接口对应的错误码列表。  |

## Token 相关错误码

1. 关于调用获取 Token 相关的 REST API 的错误码，详见[获取 App Token](easemob_app_token.html)和[获取用户 Token](easemob_user_token.html)接口的错误码列表。   

2. 调用 REST API 过程中，Token 相关的错误码如下表所示：

| HTTP 状态码  | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| ---- | ---------- | ----------------- | ----------------- | ----------------- |
| 401  | unauthorized          | "registration is not open, please contact the app admin" | 授权注册模式下，调用[授权注册单个用户](account_system.html#授权注册单个用户)和[批量授权注册用户](account_system.html#批量授权注册用户)的 RESTful 接口时，未传入 App Token 或传入了错误的 App Token 时提示该错误，例如 Token 已过期或格式不正确。 | 请传入有效 token。|
| 401  | unauthorized          | "Unable to authenticate due to expired access token"     | 调用 RESTful 接口发送请求时使用的 App Token 过期或未传入 App Token。 该错误码针对除[授权注册单个用户](account_system.html#account_system.html#授权注册单个用户)之外的 RESTful 接口有效。 | 请传入有效 token。|
| 401  | auth_bad_access_token | "Unable to authenticate due to corrupt access token"     | 调用 RESTful 接口发送请求时使用的 App Token 格式错误。 该错误码针对除[授权注册单个用户](account_system.html#授权注册单个用户)之外的 RESTful 接口有效。 | 请传入有效 token。|
| 401  | auth_bad_access_token | "Unable to authenticate"                                 | 调用 RESTful 接口发送请求时使用的 App Token 无效。App Token 的格式正确，但不是由接收请求的服务器生成的，导致服务器无法识别该 Token。 该错误码针对除[授权注册单个用户](https://doc.easemob.com/document/server-side/account_system.html#授权注册单个用户)和[批量授权注册用户](account_system.html#授权注册单个用户)两个 RESTful 接口之外的接口有效。 | 请传入有效 token。|

## 用户 ID 不存在错误码

调用 REST API 接口时，若传入的 HTTP 路径中的用户 ID 参数不存入时，会提示 `Service resource not found` 错误。例如，调用[获取单个用户的详情](account_system.html#获取单个用户的详情)、[添加好友](user_relationship.html#添加好友)和[移除好友](user_relationship.html#移除好友)等 REST API。

| HTTP 状态码 | 错误类型    | 错误提示      | 可能原因      | 
| :---------- | :---------- | :--------- | :----------- |
| 404         | service_resource_not_found  | Service resource not found  | 用户不存在。  | 

## 服务未开通相关错误码

调用 REST API 时，若相关服务未开通，提示 400 或 403 错误码，如下表所示：

| HTTP 状态码 | 错误类型    | 错误提示      | 可能原因      | 
| :---------- | :---------- | :--------- | :----------- |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |
| 403      | forbidden_op | message broadcast service is unopened  | 未开通发送聊天室广播消息的功能配置。| 联系商务开通。 |
| 400      | service open exception  | this appKey not open message roaming   | 消息漫游服务未开通。  | 联系商务开通。  |
| 400         | service open exception | the app not open presence   | 没有开通 presence 服务。  | 联系商务开通 presence 服务。 |
| 403      | message_rewrite_error   | The rewrite message feature is not open.   | 消息修改功能未开通。  |  联系商务开通消息修改功能。  |
| 400      | Bad Request         | this appKey is not open reaction service!   | Reaction 功能未开通。 | 请在环信即时通讯控制台开通 Reaction 服务。 |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | 用户属性功能未开通。  | 联系商务开通用户属性功能。    |

    



