# 推送常见错误码

调用离线推送相关的 REST API 时，若返回的 HTTP 状态码非 200，则请求失败，提示错误。本节列出这些接口的常见错误码。 

## 推送设置和查询相关的常见错误码

离线推送的设置以及查询相关的 REST API（包括 **设置接收方配置模板名称** 和 **获取接收方配置模板名称** 两个接口）如下表所示：

| RESTful API 接口        | 方法 | 接口 URL           |
| :----------- | :--- | :------------- |
| 绑定和解绑推送信息           | PUT  | /{org_name}/{app_name}/users/{userId}/push/binding |
| 查询推送绑定信息    | GET  | /{org_name}/{app_name}/users/{userId}/push/binding |
| 设置离线推送时显示的昵称 | PUT  | /{org_name}/{app_name}/users/{userId} |
| 设置离线推送通知的展示方式 | PUT  | /{org_name}/{app_name}/users/{userId} |
| 设置离线推送         | PUT  | /{org_name}/{app_name}/users/{userId}/notification/{chattype}/{key} |
| 查询离线推送设置     | GET  | /{org_name}/{app_name}/users/{userId}/notification/{chattype}/{key} |
| 设置推送通知的首选语言     | PUT  | /{org_name}/{app_name}/users/{userId}/notification/language |
| 获取推送通知的首选语言 | GET  | /{org_name}/{app_name}/users/{userId}/notification/language |
| 设置接收方配置模板名称 | PUT  | /{org_name}/{app_name}/users/{userId}/notification/template |
| 获取接收方配置模板名称 | GET | /{org_name}/{app_name}/users/{userId}/notification/template |

以上 API 的常见错误码如下所示：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400 | RequiredPropertyNotFoundException | Entity user requires a property named username | 用户不存在 | 检查并修改请求参数，请使用正确的且存在的用户 ID。 |
| 400  | IllegalArgumentException | parameters is invalid : XXX | XXX 属性值不合法 | 检查并修改请求参数，在限定范围内使用请求参数。|
| 404 | 请求路径不存在 | url is invalid | 请求路径错误 | 检查并修改，请使用正确的请求路径。 |
| 5xx | 服务器内部错误   | 任意      | 服务器在尝试处理请求时发生内部错误| 联系环信技术支持。 |

## 推送模板相关接口的常见错误码

离线推送模板相关的接口如下：

| RESTful API 接口        | 方法 | 接口 URL           |
| :----------- | :--- | :------------- |
| 创建离线推送模板          | POST  | /{org_name}/{app_name}/notification/template |
| 修改离线推送模板      | PUT  | /{org_name}/{app_name}/notification/template/{name} |
| 查询离线推送模板 | GET | /{org_name}/{app_name}/notification/template/{name} |
| 删除离线推送模板          | DELETE  | /{org_name}/{app_name}/notification/template/{name} |

这些 REST API 的常见错误码如下所示：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400  | EntityNotFoundException | XXX template is not exist | XXX 模板不存在 | 检查并修改请求参数，使用正确存在的模板名称。 |
| 404 | 请求路径不存在 | url is invalid | 请求路径错误 | 检查并修改，使用正确的请求路径。 |
| 5xx | 服务器内部错误   | 任意      | 服务器在尝试处理请求时发生内部错误 | 联系环信技术支持。 |

其他错误，你可以参考 [错误码](error.html) 了解可能的原因。







