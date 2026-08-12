# 获取单个用户加入的群组

## 功能说明

- 根据用户 ID 分页获取单个用户加入的所有群组。
- 关于单个用户可加入的群组数量，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

## 调用频率上限

50 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/user/{username}?pagesize={}&pagenum={}
```

| 参数            | 类型   | 是否必需    | 描述                 |
|:--------------| :----- |:--------|:-------------------|
| `username`     | String | 是       | 用户 ID。获取该用户加入的群组。|
| `pagesize`     | String | 否       | 每页获取的群组数量。取值范围为 [1,20]，默认值为 `5`。若传入的值大于 `20`，每页仍返回 `20` 个群组。|
| `pagenum`       | String | 否       | 当前页码。默认从第 `0` 页开始获取。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups/user/XXXX' \
-H 'Authorization: Bearer  <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "applicationName": "XXXX",
  "duration": 0,
  "entities": [
    {
      "name": "群组名称",
      "avatar": "https://www.XXXX.com/XXX/image",
      "owner": "群组管理员",
      "id": "2XXXX1",
      "groupId": "2XXXX1",
      "description": "群组描述",
      "disabled": false,
      "public": false,
      "allowinvites": false,
      "membersonly": true,
      "maxusers": 2000,
      "created": 1692687427254
    }
  ],
  "organization": "XXXX",
  "timestamp": 1692687427254,
  "total": 10,
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/user/XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `entities` 字段说明如下：

| 参数      | 类型     | 描述     |
|:-------------------------|:-------|:----------------------------|
| `entities`                 | JSON Array  | 用户加入的群组列表。             |
|  - `groupId `     | String | 群组 ID。             |
|  - `name`         | String | 群组名称。       |
|  - `avatar`       | String | 群组头像的 URL。|
|  - `owner`        | String | 群主的用户 ID。      |
|  - `description`  | String | 群组描述。        |
|  - `disabled`     | Bool | 群组是否被禁用：<br/> - `true`：禁用。禁用后不能对群组进行任何修改。<br/> - `false`：未禁用。 |
|  - `public`       | Bool | 是否是公开群：<br/> - `true`：公开群。公开群可以被搜索到，用户可以申请加入公开群。<br/> - `false`：私有群。私有群无法被搜索到，需要群主或群管理员邀请，用户才可以加入。|
|  - `allowinvites` | Bool | 是否允许普通群成员邀请用户加入群组：<br/> - `true`：普通群成员可拉人入群; <br/> - `false`：只有群主或者管理员才可以拉人入群。         |
|  - `membersonly`  | Bool | 用户申请入群是否需要群主或者群管理员审批。<br/> - `true`：需要；<br/> - `false`：不需要，用户直接进群。                               |
|  - `maxusers`     | Int | 群组最大成员数（包括群主）。      |
|  - `created `     | Long | 群组创建时间戳。      |

其他参数及说明如下。

| 参数      | 类型     | 描述     |
|:-------------------------|:-------|:----------------------------|
| `action`          | String | 请求方法。                                                                     |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `total`                    | Int  | 用户加入的群组总数。          |
| `uri`             | String | 请求 URL。                                                                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
