# 获取 App 中的群组

## 功能说明

- 分页获取应用下的群组的信息。
- 关于单个 app 支持的群组数量，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups?limit={N}&cursor={cursor}
```

请求 URL 中的查询参数说明如下：

| 参数     | 类型   | 是否必需 | 描述                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `limit`  | Int    | 否       | 每次期望返回的群组数量。取值范围为 [1,1000]，默认值为 `10`。若传入的值超过 `1000`，每页仍返回 1000 个群组。 |
| `cursor` | String | 否       | 数据查询的起始位置。首次调用该接口，不传 `cursor`，服务器按群组创建时间倒序返回 `limit` 指定的群组数量。后续接口调用时，需要从上次调用的响应中获取 `cursor` 参数的值传入请求中的该参数。   |

:::tip
若请求中均未设置 `limit` 和 `cursor` 参数，环信服务器按群组创建时间倒序返回前 10 个群组。
:::

关于请求 URL 中的参数说明，详见 [请求结构介绍](overview.html#请求结构)。

## 请求示例

第一页

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups?limit=2'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

第二页

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups?limit=2&cursor=ZGNXXXX6Mg'  \
-H 'Accept: application/json'  \ 
-H 'Authorization: Bearer <YourAppToken>' 
```

## 响应示例

```json
{
  "action": "get",
  "params": {
    "limit": ["2"]
  },
  "uri": "https://XXXX/XXXX/XXXX/chatgroups",
  "entities": [],
  "data": [
    {
      "owner": "XXXX#testapp_user1",
      "groupid": "10XXXX60",
      "affiliations": 2,
      "type": "group",
      "lastModified": "1441021038124",
      "groupname": "testgroup1"
    },
    {
      "owner": "XXXX#testapp_user2",
      "groupid": "10XXXX76",
      "affiliations": 1,
      "type": "group",
      "lastModified": "1441074471486",
      "groupname": "testgroup2"
    }
  ],
  "timestamp": 1441094193812,
  "duration": 14,
  "cursor": "Y2hhdGdyb3VwczplYXNlbW9iLWRlbW8vY2hhdGRlbW91aV8z",
  "count": 2
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段                 | 类型   | 描述                                     |
| :------------------- | :----- | :--------------------------------------- |
| `data` | JSON Array | 响应数据。 |
|  - `owner`         | String | 群主的用户 ID。例如：{"owner": "user1}。 |
|  - `groupid`       | String | 群组 ID。                                |
|  - `affiliations`  | int    | 群组现有成员数。                         |
|  - `type`          | String | "group" 群组类型。                       |
|  - `lastModified` | String | 最近一次修改的时间戳，单位为毫秒。       |
|  - `groupname`     | String | 群组名称。                               |

其他字段的说明如下：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `params.limit`          | JSON | 每次期望返回的群组数量。                                                                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `cursor`             | String | 查询游标，指定下次查询的起始位置。       |
| `count`              | Int    | 实际获取的群组数量。                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。