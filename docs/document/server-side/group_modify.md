# 修改群组信息

## 功能说明

- 修改单个群组的信息。
- 支持修改 `groupname`、`avatar`、`description`、`maxusers`、`membersonly`、`allowinvites`、`invite_need_confirm`、`public` 和 `custom` 属性。如果传入其他字段，或传入的字段不存在，会对不能修改的字段抛出异常。
- 修改群组信息会触发发送后回调，详见 [修改群组信息的回调事件](callback_group_room_info.html)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

| 参数     | 类型   | 是否必需 | 描述                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `group_id`  | Int    |  是       | 要修改的群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7'   \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "groupname": "test groupname",
    "avatar": "https://www.XXXX.com/XXX/image",
    "description": "updategroupinfo12311",
    "maxusers": 1500,
    "membersonly": true,
    "allowinvites": false,
    "invite_need_confirm": true,
    "custom":"abc",
    "public": true
}'
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数                  | 类型   | 是否必需 | 描述           |
| :-------------------- | :----- | :------- | :---------------------------- |
| `groupname`           | String | 否       | 群组名称，最大长度为 128 字符。 |
| `avatar`              | String | 否       | 群组头像的 URL，最大长度为 1024 字符。|
| `description`         | String | 否       | 群组描述，最大长度为 512 字符。 |
| `maxusers`            | Int    | 否       | 群组最大成员数（包括群主）。若设置的值超过 `3000`，默认不再支持离线推送，若希望使用该功能，请联系商务开通。 |
| `membersonly`         | Bool   | 否       | 加入群组是否需要群主或者群管理员审批：<br/> - `true`：是；<br/> - `false`：否。    |
| `allowinvites`        | Bool   | 否       | 是否允许群成员邀请别人加入此群：<br/> - `true`：允许群成员邀请人加入此群；<br/> - `false`：只有群主或群管理员才可以邀请用户入群。 |
| `invite_need_confirm` | Bool   | 否       | 受邀人加入群组前是否需接受入群邀请：<br/> - `true`：需受邀人确认入群邀请；<br/> - `false`：受邀人直接加入群组，无需确认入群邀请。 |
| `custom`              | String | 否       | 群组扩展信息，例如可以给群组添加业务相关的标记，不要超过 8 KB。  |
| `public`              | Bool   | 否       | 是否是公开群。<br/> - `true`：公开群；<br/> - `false`：私有群。                                                                   |

## 响应示例

```json
{
  "action": "put",
  "application": "XXXXXX",
  "applicationName": "XXXX",
  "data": {
    "allowinvites": true,
    "invite_need_confirm": true,
    "membersonly": true,
    "public": true,
    "custom": true,
    "description": true,
    "maxusers": true,
    "groupname": true,
    "avatar": true
  },
  "duration": 0,
  "entities": [],
  "organization": "XXXX",
  "properties": {},
  "timestamp": 1666062065529,
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段 说明如下：

| 字段                       | 类型   | 描述        |
| :------------------------- | :----- | :------------------------ |
| `data`         | JSON   | 响应数据。   |
| - `description`         | Bool   | 群组描述是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。   |
| - `maxusers`            | Bool   | 群组最大成员数是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。                         |
| - `groupname`           | Bool   | 群组名称是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。    |
| - `avatar`              | Bool   | 群组头像否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。|
| - `membersonly`         | Bool   | "加入群组是否需要群主或者群管理员审批"是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。 |
| - `public`              | Bool   | "是否是公开群"是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。                         |
| - `allowinvites`        | Bool   | "是否允许群成员邀请其他用户入群"是否修改成功：<br/> -`true`：修改成功；<br/>- `false`：修改失败。         |
| - `invite_need_confirm` | Bool   | "受邀人加入群组前是否需接受入群邀请"是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。   |
| - `custom`              | Bool | 群组扩展信息是否修改成功：<br/> -`true`：修改成功；<br/>- `false`：修改失败。        |

其他字段的说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `properties`      | String | 响应属性。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `uri`             | String | 请求 URL。                                                                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_name_violation | XX is violation, please change it. | 群组名称不合法。 | 使用合法的群组名称。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | invalid_parameter                  | "some of [groupid] are not valid fields"  | 修改的群组信息时，传入的参数不支持，例如修改 `groupid`。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。