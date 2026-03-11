# 获取群组详情

## 功能说明

- 获取一个或多个群组的详情。
- 每个群组最多可返回 10,000 个群成员（包括群主）。
- 单次最多可获取 100 个群组的详情。
- 当获取多个群组的详情时，返回所有存在的群组的详情；对于不存在的群组，返回 "group id doesn't exist"。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

| 参数     | 类型   | 是否必需 | 描述                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `group_id`  | Int    |  是       | 群组 ID。获取该群组的详情。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
    "action": "get",
    "application": "09ebbf8b-XXXX-XXXX-bd4b-d47c3b38e434",
    "applicationName": "XXXX",
    "count": 1,
    "data": [
        {
            "id": "XXXX",
            "name": "XXXX",
            "avatar": "https://www.XXXX.com",
            "description": "XXXX",
            "membersonly": true,
            "allowinvites": false,
            "maxusers": 2000,
            "owner": "XXXX",
            "created": 1682588716646,
            "custom": "",
            "mute": false,
            "affiliations_count": 2,
            "disabled": false,
            "affiliations": [
                {
                    "member": "XXXX"
                },
                {
                    "owner": "XXXX"
                }
            ],
            "public": false
        }
    ],
    "duration": 35,
    "entities": [],
    "organization": "XXXX",
    "properties": {},
    "timestamp": 1682588814419,
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体的 `data` 字段说明如下：

| 字段                      | 类型   | 描述      |
| :---------- | :----- | :----------------- |
| `data` | JSON Array | 响应数据。|
|  - `id`                 | String | 群组 ID，群组唯一标识符。     |
|  - `name`               | String | 群组名称。      |
|  - `avatar`             | String | 群组头像的 URL。|
|  - `description`        | String | 群组描述。       |
|  - `membersonly`        | Bool   | 加入群组是否需要群主或者群管理员审批。<br/> - `true`：是；<br/> - `false`：否。      |
|  - `allowinvites`       | Bool   | 是否允许群成员邀请其他用户加入此群。<br/> - `true`：允许群成员邀请其他用户加入此群；<br/> - `false`：只有群主可以邀请其他用户入群。<br/> 注：该参数仅对私有群有效，因为公开群不允许群成员邀请其他用户入群。 |
|  - `maxusers`           | Int    | 群组最大成员数，创建群组的时候设置，可修改。    |
|  - `affiliations`       | Array | 群组成员列表及其对应角色：<br/> - `owner`：群主；<br/> - `member`：群组管理员和普通成员。 |
|  - `owner`              | String | 群主的用户 ID。例如：{"owner": "user1"}。    |
|  - `created`            | Long   | 创建该群组的 Unix 时间戳。  |
|  - `affiliations_count` | int    | 群组现有成员总数。     |
|  - `disabled`           | Bool   | 群组是否为禁用状态：<br/> - `true`：群组被禁用；<br/> - `false`：群组为启用状态。          |
|  - `mute`               | Bool   | 是否处于全员禁言状态。<br/> - `true`：是； <br/> - （默认）`false`：否。       |
|  - `public`             | Bool   | 是否是公开群：<br/> - `true`：公开群；<br/> - `false`：私有群。    |
|  - `custom`             | String | 群组扩展信息，例如，可以给群组添加业务相关的标记，不要超过 8 KB。     |

其他参数的说明如下表所示：

| 字段                      | 类型   | 描述      |
| :---------- | :----- | :----------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `count`                 | Int | 获取详情的群组数量。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `properties` | JSON | 开发者无需关注该字段。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `uri`             | String | 请求 URL。                                                                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。