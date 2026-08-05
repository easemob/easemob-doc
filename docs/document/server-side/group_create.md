# 创建群组

## 功能说明

- 创建一个群组。
- 支持设置群组名称、群组描述、公开群/私有群属性、群成员最大人数（包括群主）、加入公开群是否需要批准、群主、群成员和群组扩展信息。
- 创建群组会触发发送后回调，详见 [创建群组的回调事件](callback_group_room_create.html)。
- 关于 app 支持的群组数量、单个群的成员数和规模划分，详见 [群组限制文档](/product/limitation.html#群组-群成员数量)。

## 调用频率上限

100 次/秒/App Key   

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatgroups
```

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/chatgroups'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
   "groupname": "testgroup",
   "avatar": "https://www.XXXX.com/XXX/image",
   "description": "test",
   "public": true,
   "maxusers": 300,
   "owner": "testuser",
   "members": [
     "user2"
   ]
 }' 
```

## 请求 header

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数                  | 类型   | 是否必需 | 描述          |
| :------------ | :----- | :------- | :------------------------------------------- |
| `groupname`           | String | 否       | 群组名称，最大长度为 128 字符。|
| `avatar`           | String | 否       | 群组头像的 URL，最大长度为 1024 字符。|
| `description`         | String | 否       | 群组描述，最大长度为 512 字符。|
| `public`              | Bool   | 是       | 是否是公开群。公开群可以被搜索到，用户可以申请加入公开群；私有群无法被搜索到，因此需要群主或群管理员添加，用户才可以加入。<br/> - `true`：公开群；<br/> - `false`：私有群。   |
| `maxusers`            | Int    | 否       | 群组最大成员数（包括群主）。该参数的默认值为 `200`，若设置的值超过 `3000`，默认不再支持离线推送，若希望使用该功能，请联系商务开通。|
| `allowinvites`        | Bool   | 否       | 是否允许普通群成员邀请用户加入群组：<br/> - `true`：普通群成员可拉人入群;<br/> - （默认）`false`：只有群主和群管理员才能拉人入群。<br/><Container type="notice" title="提示"><br/>创建群组时，该参数仅对私有群有效，对公开群无效。也就是说，创建公有群（`public` 设置为 `true`）时，即使将 `allowinvites` 设置为 `true`，该设置也会自动修改为 `false`。如果要允许公开群的普通成员拉人入群，你在创建群后可调用[修改群组信息](group_modify.html)接口将 `allowinvites` 的设置修改为 `true`。</Container> |
| `membersonly`         | Bool   | 否       | 用户申请入群是否需要群主或者群管理员审批。 <br/> - `true`：需要； <br/> - （默认）`false`：不需要，用户直接进群。<br/>该参数仅对公开群生效，因为对于私有群，用户无法申请加入群组，只能通过群成员邀请加入群。     |
| `invite_need_confirm` | Bool   | 否       | 邀请用户入群时是否需要被邀用户同意。<br/> - （默认）`true`：是；<br/> - `false`：否。   |
| `owner`               | String | 是       | 群主的用户 ID。  |
| `members`             | Array  | 否       | 群成员的用户 ID 数组，不包含群主的用户 ID。该数组可包含的元素数量不超过 `maxusers` 的值。        |
| `custom`              | String | 否       | 群组扩展信息，例如可以给群组添加业务相关的标记，不要超过 8 KB。     |

:::tip
该 API 支持基于自定义群组 ID 创建群组，即调用该 API 时传入 `groupid` 参数。
1. 使用该功能前，你需**联系环信商务**。功能开通后，你也可以 [基于自定义聊天室 ID 创建聊天室](chatroom_create.html#请求-body-参数)。
2. `groupid` 参数最多可传入 64 个字符，只支持小写英文字母 a-z 和数字 0-9。**注意不要使用大写英文字母 A-Z 。**
:::

## 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups",
  "entities": [],
  "data": {
    "groupid": "6XXXX7"
  },
  "timestamp": 1542361730243,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应体中的 `data` 参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `data`            | JSON   | 实际获取的数据详情。                                                           |
| - `groupid` | String | 群组 ID。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | invalid_parameter | XX must be provided | XX 字段没有设置。 | 请传入必传字段。  |
| 400     | invalid_parameter | avatar length is too big | 头像字段长度达到上限 | 修改头像字段在长度限制下。 |
| 400     | invalid_parameter | group must contain public field! | 创建群组必须设置 `public` 字段 | 设置 `public` 字段。 |
| 400     | illegal_argument | group ID XX already exists! | groupId 重复。 | 使用新的群组 ID。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | exceed_limit | appKey:XX#XX has create too many groups! | appKey 的群组数量达到上限。 | 删除不用的群组或联系商务调整上限。关于该上限，详见 详见 [IM 套餐包功能详情](/product/product_package_feature.html)。 |
| 403     | exceed_limit | user XX has joined too many groups! | 用户加入的群组数量达到上限。 | 退出不用的群组或在 [环信控制台上调用户可加入群组数上限](/product/console/basic_conversation_group_chatroom.html#单个用户可加入群组数上限)。 |
| 403     | exceed_limit | members size is greater than max user size ! | 创建群时加入的人数超过最大限制。 | 调整创建群的加群人数。关于该上限，详见 详见 [IM 套餐包功能详情](/product/product_package_feature.html)。|
| 403     | group_name_violation | XX is violation, please change it. | 群组名称不合法。 | 使用合法的群组名称。 |
| 404     |  resource_not_found  | username XXXX doesn't exist!       | 创建群组时添加的用户不存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。