# 导入好友列表

## 功能描述

- 支持批量导入好友，一次最多可导入 10 个。
- 请确保导入好友列表后，用户的好友数未超过数量上限。若导入好友的过程中已达上限，响应中会返回导入失败的好友的用户 ID。单个用户的好友数上限与你购买的套餐包相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/contacts/import
```

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `username`  | String | 是  | 为哪个用户导入好友列表。  |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

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

## 请求 header 参数

| 参数      | 类型 | 是否必需 | 描述    |
|:--------|:--------|:-----|:----------------------|
| `isSendNotice` | Boolean | 否    | 好友导入后是否向 SDK 发送通知：<br/> - `true`：是；<br/> -（默认）`false`：否。 |

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数      | 类型    | 是否必需 | 描述                       |
|:--------|:------|:-----|:-------------------------|
| `usernames` | Array | 是    | 好友的用户 ID，一次最多可导入 10 个。 |

## 响应示例

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

## 响应 body 字段

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

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 导入好友列表的用户 ID 不存在。 | 检查导入好友列表的用户 ID 是否存在。 | 
| 400     | illegal_argument   | request user over flow limit:10.          | 请求 body 中传入的用户 ID 数量超过了 10。           | 请求 body 中的 `usernames` 参数一次最多可导入 10 个用户 ID。         |
| 403     | exceed_limit   | Inviter's contact max count.          | 调用该接口的用户的好友数量已达上限。单个用户的好友数上限与你购买的套餐包相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。    |            |
