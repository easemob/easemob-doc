# 校验黑名单

## 功能说明

批量校验是否在用户的黑名单中。

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
POST https://{host}/{org_name}/{app_name}/blocks/check
```

### 路径参数

| 参数             | 类型   | 是否必需 | 描述                |
| :--------------- | :----- | :------- | :------------------ |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述                   |
| :-------------- | :----- | :----------- | :------------------------------------------------------ |
| `Content-Type`  | String | 是         | 内容类型。请填 `application/json`。               |
| `Accept`        | String | 是                                       | 内容类型。请填 `application/json`。           |
| `Authorization` | String | 是                                       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### 请求 body

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述                   |
| :-------------- | :----- | :----------- | :------------------------------------------------------ |
| `username`  | String | 是         | 要校验该用户 ID 的黑名单。         |
| `check_list`  | JSON Array | 是         | 要校验的黑名单中用户 ID 列表，每次请求最多可传 100 个用户 ID。 |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                 | 类型       | 描述              |
| :------------------- | :--------- | :------------------ |
| `action`             | String | 请求方法。                                   |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。          |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`                | String | 请求 URL。                |
| `entities`           | JSON Array | 校验结果的详情。     |
|  - `username`      | String     | 校验的用户 ID。                      |
|  - `relation`      | String     | 用户是否在黑名单中：<br/> - `blacklist`：是<br/> - `not_blacklist`：否 | 
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。       |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。     |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。          |
| `applicationName`    | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。    |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/blocks/check' -d '{
    "username": "user1", 
    "check_list": [ 
    "user2",
    "user3"
    ]
  }'
```

### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX402",
  "path": "/contacts/check",
  "uri": "https://XXXX/XXXX/XXXX/blocks/check",
  "entities": [
    {
        "username":"user2",
        "relation":"blacklist"
    },
    {
        "username":"user3",
        "relation":"not_blacklist"
    }
  ],
  "timestamp": 1542598913819,
  "duration": 63,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401 | unauthorized | Unable to authenticate (OAuth) | Token 不合法，可能过期或 Token 错误。 | 使用新的 Token 访问。 |
| 429   | reach_limit | This request has reached api limit. | 接口调用超过频率限制。 | 联系商务调整限流或者控制调用速率。 |
| 403   | forbidden_service_operation | Service operation not allowed | app 或用户被封禁。 | 先解禁 app 或用户后再调用该接口。 |
| 400   | illegal_argument | username cannot be blank | 校验的用户 `username` 不能传空。 | 确认参数 `username` 是否正确填写。 |
| 400   | illegal_argument | check_list size must be between 1 and 100 | 被校验的用户列表只能包含 1 到 100 个用户。 | 确认 `check_list` 参数是否正确填写。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

