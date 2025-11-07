# 获取订阅列表

在线状态（Presence）表示用户的当前状态信息。除了环信 IM 内置的在线和离线状态，你还可以添加自定义在线状态，例如忙碌、马上回来、离开、接听电话、外出就餐等。本文展示如何调用环信即时通讯 RESTful API 实现用户在线状态（Presence）订阅，包括设置用户在线状态信息、批量订阅和获取在线状态、取消订阅以及查询订阅列表。

关于用户的在线、离线和自定义状态的定义，详见[用户在线状态管理](/product/product_user_presence.html)。

## 功能说明

分页查询当前用户已订阅在线状态的用户列表。

## 功能开通

使用 Presence 功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/presence/sublist?pageNum={pagenumber}&pageSize={pagesize}
```

| 参数       | 类型 |  是否必需 | 描述                       |
| :--------- | :--- | :--------------- | :------- |
| `username` | String | 是       | 查询该用户 ID 的订阅列表。若传入的用户 ID 不存在或未订阅其他用户的在线状态，返回空列表。 |
| `pageNum`  | Int  | 是       | 要查询的页码。该参数的值须大于等于 1。若不传，默认值为 `1`。          |
| `pageSize` | Int  | 是       | 每页显示的订阅用户数量。取值范围为 [1,100]，若不传默认值为 `1`。|

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/users/wzy/presence/sublist?pageNum=1&pageSize=100' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "result":{
    "totalnum":"2",
    "sublist":[
     {
        "uid":"lxml2",
        "expiry":"1645822322"},
      {
        "uid":"lxml1",
        "expiry":"1645822322"
      }
    ]
  }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数       | 类型   | 描述                                                         |
| :--------- | :----- | :----------------------------------------------------------- |
| `result`   | JSON | 是否成功获取了订阅列表。若操作成功，返回被订阅用户的在线状态信息。若操作失败，返回相应的错误原因。 |
| `result.totalnum` | Int | 当前订阅的用户总数。                                         |
| `result.sublist`  | JSON Array | 订阅列表。列表中的每个对象均包含被订阅的用户的 ID 字段 `uid` 以及订阅过期字段 `expiry`。    |
| `result.sublist.uid`      | String | 被订阅用户在即时通讯服务器的唯一 ID。                              |
| `result.sublist.expiry`   | Int | 订阅的过期时间戳，单位为秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型   | 错误提示 | 可能原因  | 处理建议      |
| :---------- | :--- | :----------- | :------------ | :----- |
| 400         | service open exception | the app not open presence   | 没有开通 presence 服务。  | 联系商务开通 presence 服务。 |
| 401         | unauthorized           | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。