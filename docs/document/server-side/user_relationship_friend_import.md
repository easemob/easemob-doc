# 导入好友列表

## 功能描述

- 支持批量导入好友，一次最多可导入 10 个。
- 请确保导入好友列表后，用户的好友数未超过数量上限。若导入好友的过程中已达上限，响应中会返回导入失败的好友的用户 ID。单个用户的好友数上限与你购买的套餐包相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

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
POST https://{host}/{org_name}/{app_name}/users/{username}/contacts/import
```

### 路径参数

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `username`  | String | 是  | 为哪个用户导入好友列表。  |

### 请求参数

| 参数      | 类型 | 是否必需 | 描述    |
|:--------|:--------|:-----|:----------------------|
| `isSendNotice` | Boolean | 否    | 好友导入后是否向 SDK 发送通知：<br/> - `true`：是；<br/> -（默认）`false`：否。 |

### 请求 body

| 参数      | 类型    | 是否必需 | 描述                       |
|:--------|:------|:-----|:-------------------------|
| `usernames` | Array | 是    | 好友的用户 ID，一次最多可导入 10 个。 |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述   |
| :-------------- | :----- | :------------ | :------------- |
| `Content-Type`  | String | 是     | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是     | 内容类型。请填 `application/json`。   |
| `Authorization` | String | 是     | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`。 |

## HTTP 响应

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述                |
|:-------------------------|:-------|:------------------|
| `status`                 | String | 返回 `ok` 表示好友导入成功。       |
| `timestamp`              | Long | 当前时间戳，单位为毫秒。             |
| `action`                 | String | 请求方法。  |
| `data`               | JSON   | 实际获取的数据详情。            |
| `data.UnKnowFailed`      | Array | 因系统异常添加失败的好友的用户 ID。 |
| `data.success`           | Array | 成功添加好友的用户 ID。     |
| `data.NotExistFailed`    | Array | 不存在的好友的用户 ID。 |
| `data.maxLimitFailed`    | Array | 因导入的好友已达上限而导入失败的好友的用户 ID。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
curl --location 'https://{host}/{org_name}/{app_name}/users/{username}/contacts/import' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "usernames":[
        "1",
        "2",
        "3"
    ]
}'
```

### 响应示例

```json
{
  "status": "ok",
  "timestamp": 1712728623854,
  "action": "post",
  "data": {
    "UnKnowFailed": [],
    "success": [
      "username1",
      "username2",
      "username3"
    ],
    "NotExistFailed": [],
    "maxLimitFailed": []
  },
  "duration": 176
}
```

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 导入好友列表的用户 ID 不存在。 | 检查导入好友列表的用户 ID 是否存在。 | 
| 400     | illegal_argument   | request user over flow limit:10.          | 请求 body 中传入的用户 ID 数量超过了 10。           | 请求 body 中的 `usernames` 参数一次最多可导入 10 个用户 ID。         |
| 403     | exceed_limit   | Inviter's contact max count.          | 调用该接口的用户的好友数量已达上限。单个用户的好友数上限与你购买的套餐包相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。    |            |
