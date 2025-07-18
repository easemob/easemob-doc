# 设置好友备注

## 功能说明

- 设置你在当前 app 下的单个好友的备注。
- 先添加为好友关系，然后再设置好友备注。
- 调用该接口会触发设置好友备注的发送后回调事件，详见 [回调事件文档](callback_contact.html#设置好友备注)。

**调用频率上限**：100 次/秒/App Key

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 IM RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。
  
## HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}
```

### 路径参数

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `owner_username`  | String | 是       | 要设置哪个用户的好友备注。  |
| `friend_username` | String | 是       | 要设置备注的用户 ID。 |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :------------------------ |
| `Content-Type`  | String | 是 | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是 | 内容类型。请填 `application/json`。  |
| `Authorization` | String | 是 | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`。 |

### 请求 body

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `remark`  | String | 是   | 好友备注。好友备注的长度不能超过 100 个字符。  |

## HTTP 响应

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                 | 类型     | 描述                                    |
| :------------------- |:-------|:--------------------------------------|
| `action`           | String | 请求方法。                                 |
| `status`      | String | 好友备注是否设置成功，`ok` 表示设置成功。                         |
| `timestamp`   | Long   | HTTP 响应的 UNIX 时间戳，单位为毫秒。                         |
| `uri`  | Long   | 请求 URL。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
curl -X PUT 'https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "remark": <remark>
}'
```

### 响应示例

```json
{
  "action": "put",
  "duration": 22,
  "status": "ok",
  "timestamp": 1700633088329,
  "uri": "https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}"
}
```

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | illegal_argument | updateRemark they are not friends, please add as a friend first. | 要添加备注的两个用户不是好友关系。 | 先成为好友再设置好友备注。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要设置或被设置好友备注的用户 ID 不存在。 | 检查要设置和被设置好友备注的用户 ID 是否存在。| 