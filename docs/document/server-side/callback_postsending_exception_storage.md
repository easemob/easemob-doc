# 回调异常缓存

## 功能说明

回调异常缓存是发送后回调的增值服务，**需单独购买并开通**。该服务用于在发送后回调因回调地址连接超时、业务服务器响应超时、回调规则临时封禁或其他异常原因投递失败时，暂存未成功投递的回调消息，避免消息丢失，适用于对消息可靠性要求较高、需要在异常场景下保留回调数据并进行后续补偿处理的业务场景。**该服务仅保存满足异常缓存条件的回调失败消息，正常投递成功的消息不会进入异常缓存。**

## 功能限制

- 异常缓存数据默认保留 3 天，请在有效期内完成查询和补发。
- 建议单个异常数据集合的补发重试次数控制在 10 次以内。
- 回调异常缓存仅作为异常场景下的补偿能力，不能替代业务侧对回调消息处理准确性、消费确认和整体可靠性的保障机制。

## 开通服务

如需使用回调异常缓存，请先在控制台开通服务，详见 [环信控制台开通入口](/product/console/basic_webhook.html#回调异常缓存)。

开通该服务后，当发送后回调失败且满足异常缓存条件时，系统会按时间片对失败的回调消息进行归档存储，**并按每 10 分钟生成一个 date key，用于标识一个异常回调集合**。你可以先调用 [查询接口](#查询异常缓存数据) 获取可补发的异常回调数据，再根据返回结果调用 [补发接口](#补发异常回调数据) 进行补发，以完成异常场景下的数据补偿处理。

## 查询异常缓存数据

该接口用于查询当前 App Key 下因回调异常进入存储队列的回调数据集合。系统按每 10 分钟生成一个 date key，用于标识对应时间片内的异常回调集合，你可以基于该 date key 进行查询和补发。

### 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/callbacks/storage/info
```

关于请求 URL 中各参数的含义，详见 [请求 URL 参数介绍](overview.html#请求-url)。

### 请求示例

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/callbacks/storage/info' \
-H 'Authorization: Bearer <YourAppToken>'
```

### 请求 Header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 Header 参数说明](overview.html#请求-header)。

### 响应示例

```json
{
  "path": "/callbacks",
  "uri": "https://XXXX/XXXX/XXXX/callbacks",
  "timestamp": 1631193031254,
  "organization": "XXXX",
  "application": "8dfb1641-XXXX-XXXX-bbe9-d8d45a3be39f",
  "action": "post",
  "data": [
    {
      "date": "202109091440",
      "size": 15,
      "retry": 0
    },
    {
      "date": "202109091450",
      "size": 103,
      "retry": 1
    }
  ],
  "duration": 153,
  "applicationName": "XXXX"
}
```

### 响应 body 字段

当 HTTP 状态码为 `200` 时，表示查询成功。

`data` 字段说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `data` | JSON Array | 异常数据集合列表。每个元素对应一个可补发的时间片。 |
| - `date` | String | 当前集合的 date key，表示一个 10 分钟时间片，取值为该时间片的起始时间。 |
| - `size` | Int | 当前 date key 下存储的回调消息数量。 |
| - `retry` | Int | 当前集合已执行的补发次数。未补发时为 `0`。 |

其他响应字段说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `path` | String | 请求路径。 |
| `uri` | String | 请求完整 URI。 |
| `timestamp` | Long | 环信 IM 服务器接收到该请求时的 Unix 时间戳，单位为毫秒。 |
| `organization` | String | 你在环信控制台注册的组织唯一标识，对应控制台中的 `org_name`。 |
| `application` | String | 你在环信控制台注册的 App 唯一标识。 |
| `action` | String | 请求方法。 |
| `duration` | Long | 请求耗时，单位为毫秒。 |
| `applicationName` | String | 你在环信控制台注册的 App 名称。 |

当 HTTP 状态码非 `200` 时，表示请求失败。你可以参考本文档中的 [错误码](#错误码) 排查原因。

## 补发异常回调数据

该接口用于按照指定的 date key 对异常缓存中的回调消息进行补发。

### 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/callbacks/storage/retry
```

关于请求 URL 中各参数的含义，详见 [请求 URL 参数介绍](overview.html#请求-url)。

### 请求示例

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/callbacks/storage/retry' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "date": "202108272230",
    "retry": 0,
    "targetUrl": "https://localhost:8000/test"
}'
```

### 请求 Header 参数

关于 `Content-Type` 和 `Authorization` 字段的说明，详见 [请求 Header 参数说明](overview.html#请求-header)。

### 请求 body 参数

| 参数 | 类型 | 是否必需 | 说明 |
| :--- | :--- | :--- | :--- |
| `date` | String | 是 | 待补发数据集合对应的 date key，key 为一个 10 分钟时间片的起始时间。 |
| `retry` | Int | 否 | 当前补发请求对应的重试次数。考虑到补发仍可能失败，建议由业务侧结合实际情况维护并控制该值。初始值为 `0`。 |
| `targetUrl` | String | 否 | 本次补发的目标回调地址。若不传或为空，则使用原回调规则中配置的回调地址。 |

### 响应示例

```json
{
  "path": "/callbacks",
  "uri": "https://XXXX/XXXX/XXXX/callbacks",
  "timestamp": 1631194031721,
  "organization": "XXXX",
  "application": "8dfb1641-XXXX-XXXX-bbe9-d8d45a3be39f",
  "action": "post",
  "data": "success",
  "duration": 225,
  "applicationName": "XXXX"
}
```

### 响应 body 字段

当 HTTP 状态码为 `200` 时，表示补发请求已被成功接收，响应 body 包含如下字段：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `path` | String | 请求路径。 |
| `uri` | String | 请求完整 URI。 |
| `timestamp` | Long | 环信 IM 服务器接收到该请求时的 Unix 时间戳，单位为毫秒。 |
| `organization` | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 一致。 |
| `application` | String | 你在环信控制台注册的 App 唯一标识。 |
| `action` | String | 请求方法。 |
| `data` | String | 补发结果：`success` 表示请求成功，`failure` 表示请求失败。 |
| `duration` | Long | 请求耗时，单位为毫秒。 |
| `applicationName` | String | App 名称。 |

当 HTTP 状态码非 `200` 时，表示补发请求失败。你可以参考 [错误码](#错误码) 了解可能原因。

## 错误码

| 状态码 | 说明 |
| :--- | :--- |
| `200` | 请求成功。 |
| `400` | 请求参数错误，请根据返回信息检查参数。 |
| `401` | 鉴权失败或用户权限错误。 |
| `403` | 服务未开通或当前账号权限不足。 |
| `429` | 请求过于频繁，请稍后重试。 |
| `500` | 服务器内部错误。 |
