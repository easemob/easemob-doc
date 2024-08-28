# 群组管理

<Toc />

环信即时通讯 IM 提供了 RESTful API 管理 App 中的群组，包括创建、修改、获取、解散群组等操作。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯 IM 管理后台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。
- 了解单个 App 创建群组数量的限制，以及单个用户可加入群组的数量限制（视版本而定），详见 [使用限制](limitation.html#群组)。

## 公共参数

#### 请求参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `group_id` | String | 是       | 群组 ID。    |
| `username` | String | 是       | 用户 ID。             |

#### 响应参数

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | String | 请求 URL。                                                                     |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                              |
| `entities`        | JSON   | 响应实体。                                                                     |
| `data`            | JSON   | 实际获取的数据详情。                                                           |
| `uuid`            | String | 用户在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `created`         | Long   | 群组创建时间，Unix 时间戳，单位为毫秒。                                        |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `properties`      | String | 响应属性。                                                                     |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 创建群组

创建一个群组，并设置群组名称、群组描述、公开群/私有群属性、群成员最大人数（包括群主）、加入公开群是否需要批准、群主、群成员和群组扩展信息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数     | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数                  | 类型   | 是否必需 | 描述          |
| :------------ | :----- | :------- | :------------------------------------------- |
| `groupname`           | String | 否       | 群组名称，最大长度为 128 字符。|
| `avatar`           | String | 否       | 群组头像的 URL，最大长度为 1024 字符。|
| `description`         | String | 否       | 群组描述，最大长度为 512 字符。|
| `public`              | Bool   | 是       | 是否是公开群。公开群可以被搜索到，用户可以申请加入公开群；私有群无法被搜索到，因此需要群主或群管理员添加，用户才可以加入。<br/> - `true`：公开群；<br/> - `false`：私有群。   |
| `maxusers`            | Int    | 否       | 群组最大成员数（包括群主）。该参数的默认值为 `200`，若设置的值超过 `3000`，将不再支持离线推送。对于超过 3000 人的群组，若希望提供离线推送功能，你必须在创建群组之前联系商务开通，否则群组创建后无法再开通该功能。<br/>不同套餐的群组支持的最大人数的上限不同，详见 [产品价格](/product/pricing.html#套餐包功能详情)。|
| `allowinvites`        | Bool   | 否       | 是否允许普通群成员邀请用户加入群组：<br/> - `true`：普通群成员可拉人入群;<br/> - （默认）`false`：只有群主和群管理员才能拉人入群。<br/><Container type="notice" title="提示"><br/>创建群组时，该参数仅对私有群有效，对公开群无效。也就是说，创建公有群（`public` 设置为 `true`）时，即使将 `allowinvites` 设置为 `true`，该设置也会自动修改为 `false`。如果要允许公开群的普通成员拉人入群，你在创建群后可调用[修改群组信息](#修改群组信息)接口将 `allowinvites` 的设置修改为 `true`。</Container> |
| `membersonly`         | Bool   | 否       | 用户申请入群是否需要群主或者群管理员审批。 <br/> - `true`：需要； <br/> - （默认）`false`：不需要，用户直接进群。<br/>该参数仅对公开群生效，因为对于私有群，用户无法申请加入群组，只能通过群成员邀请加入群。     |
| `invite_need_confirm` | Bool   | 否       | 邀请用户入群时是否需要被邀用户同意。<br/> - （默认）`true`：是；<br/> - `false`：否。   |
| `owner`               | String | 是       | 群主的用户 ID。  |
| `members`             | Array  | 否       | 群成员的用户 ID 数组，不包含群主的用户 ID。该数组可包含的元素数量不超过 `maxusers` 的值。        |
| `custom`              | String | 否       | 群组扩展信息，例如可以给群组添加业务相关的标记，不要超过 8 KB。     |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段           | 类型   | 描述      |
| :------------- | :----- | :-------- |
| `data.groupid` | String | 群组 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
   "groupname": "testgroup",
   "avatar": "https://www.XXXX.com/XXX/image",
   "description": "test",
   "public": true,
   "maxusers": 300,
   "owner": "testuser",
   "members": [
     "user2"
   ]
 }' 'https://XXXX/XXXX/XXXX/chatgroups'
```

##### 响应示例

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | invalid_parameter | XX must be provided | XX 字段没有设置。 | 请传入必传字段。  |
| 400     | invalid_parameter | avatar length is too big | 头像字段长度达到上限 | 修改头像字段在长度限制下。 |
| 400     | invalid_parameter | group must contain public field! | 创建群组必须设置 `public` 字段 | 设置 `public` 字段。 |
| 400     | illegal_argument | group ID XX already exists! | groupId 重复。 | 使用新的群组 ID。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | exceed_limit | appKey:XX#XX has create too many groups! | appKey 的群组数量达到上限。 | 删除不用的群组或联系商务调整上限。关于该上限，详见[相关文档](/product/pricing.html#套餐包功能详情)。 |
| 403     | exceed_limit | user XX has joined too many groups! | 用户加入的群组数量达到上限。 | 退出不用的群组或联系商务调整上限。关于该上限，详见[相关文档](/product/pricing.html#套餐包功能详情)。 |
| 403     | exceed_limit | members size is greater than max user size ! | 创建群时加入的人数超过最大限制。 | 调整创建群的加群人数。关于该上限，详见[相关文档](/product/pricing.html#套餐包功能详情)。|
| 403     | group_name_violation | XX is violation, please change it. | 群组名称不合法。 | 使用合法的群组名称。 |
| 404     |  resource_not_found  | username XXXX doesn't exist!       | 创建群组时添加的用户不存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 封禁群组

封禁指定的群组。例如，群成员经常在群中发送违规消息，可以调用该 API 对该群进行封禁。群组被封禁后，群中任何成员均无法在群组以及该群组下的子区中发送和接收消息，也无法进行群组和子区管理操作。

群组封禁后，可调用[解禁群组](#解禁群组) API 对该群组解禁。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/disable
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :----------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。          |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型 | 描述                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| data.disabled | Bool | 群组是否为禁用状态：<br/> - `true`：群组被禁用；<br/> - `false`：群组为启用状态。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/XXXX/disable'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "XXXX",
  "applicationName": "XXXX",
  "data": {
    "disabled": true
  },
  "duration": 740,
  "entities": [],
  "organization": "XXXX",
  "properties": {},
  "timestamp": 1672974260359,
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/XXXX/disable"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 解禁群组

解除对指定群组的封禁。群组解禁后，群成员可以在该群组以及该群组下的子区中发送和接收消息并进行群组和子区管理相关操作。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/enable
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述           |
| :-------------- | :----- | :------- | :----------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型 | 描述            |
| :------------ | :--- | :------------------------- |
| data.disabled | Bool | 群组是否为禁用状态：<br/> - `true`：群组被禁用；<br/> - `false`：群组为启用状态。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/XXXX/enable'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "XXXX",
  "applicationName": "XXXX",
  "data": {
    "disabled": false
  },
  "duration": 22,
  "entities": [],
  "organization": "XXXX",
  "properties": {},
  "timestamp": 1672974668171,
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/XXXX/enable"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 修改群组信息

修改指定的群组信息，可修改 `groupname`、`avatar`、`description`、`maxusers`、`membersonly`、`allowinvites`、`invite_need_confirm`、`public` 和 `custom` 属性。如果传入其他字段，或传入的字段不存在，则不能修改的字段会抛出异常。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :--------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数                  | 类型   | 是否必需 | 描述           |
| :-------------------- | :----- | :------- | :---------------------------- |
| `groupname`           | String | 否       | 群组名称，最大长度为 128 字符。 |
| `avatar`              | String | 否       | 群组头像的 URL，最大长度为 1024 字符。|
| `description`         | String | 否       | 群组描述，最大长度为 512 字符。 |
| `maxusers`            | Int    | 否       | 群组最大成员数（包括群主）。对于普通群，该参数的默认值为 `200`，大型群为 `1000`。不同套餐支持的人数上限不同，详见 [产品价格](/product/pricing.html#套餐包功能详情)。 |
| `membersonly`         | Bool   | 否       | 加入群组是否需要群主或者群管理员审批：<br/> - `true`：是；<br/> - `false`：否。    |
| `allowinvites`        | Bool   | 否       | 是否允许群成员邀请别人加入此群：<br/> - `true`：允许群成员邀请人加入此群；<br/> - `false`：只有群主或群管理员才可以邀请用户入群。 |
| `invite_need_confirm` | Bool   | 否       | 受邀人加入群组前是否需接受入群邀请：<br/> - `true`：需受邀人确认入群邀请；<br/> - `false`：受邀人直接加入群组，无需确认入群邀请。 |
| `custom`              | String | 否       | 群组扩展信息，例如可以给群组添加业务相关的标记，不要超过 1,024 字符。  |
| `public`              | Bool   | 否       | 是否是公开群。<br/> - `true`：公开群；<br/> - `false`：私有群。                                                                   |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型   | 描述        |
| :------------------------- | :----- | :------------------------ |
| `data.description`         | Bool   | 群组描述是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。   |
| `data.maxusers`            | Bool   | 群组最大成员数是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。                         |
| `data.groupname`           | Bool   | 群组名称是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。    |
| `data.avatar`              | Bool   | 群组头像否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。|
| `data.membersonly`         | Bool   | “加入群组是否需要群主或者群管理员审批”是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。 |
| `data.public`              | Bool   | “是否是公开群”是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。                         |
| `data.allowinvites`        | Bool   | “是否允许群成员邀请其他用户入群”是否修改成功：<br/> -`true`：修改成功；<br/>- `false`：修改失败。         |
| `data.invite_need_confirm` | Bool   | “受邀人加入群组前是否需接受入群邀请”是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。   |
| `data.custom`              | Bool | 群组扩展信息是否修改成功：<br/> -`true`：修改成功；<br/>- `false`：修改失败。        |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7' -d '{
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

##### 响应示例

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_name_violation | XX is violation, please change it. | 群组名称不合法。 | 使用合法的群组名称。 |
| 403     | group_announce_violation | group announcement is violation, please change it. | 群公告不合法。 | 使用合法的群公告。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | invalid_parameter                  | "some of [groupid] are not valid fields"  | 修改的群组信息时，传入的参数不支持，例如修改 `groupid`。| 

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 获取 App 中的群组

分页获取应用下的群组的信息。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups?limit={N}&cursor={cursor}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数     | 类型   | 是否必需 | 描述                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `limit`  | Int    | 否       | 每次期望返回的群组数量。取值范围为 [1,1000]，默认值为 `10`。若传入的值超过 `1000`，每页仍返回 1000 个群组。 |
| `cursor` | String | 否       | 数据查询的起始位置。首次调用该接口，不传 `cursor`，服务器按群组创建时间倒序返回 `limit` 指定的群组数量。后续接口调用时，需要从上次调用的响应中获取 `cursor` 参数的值传入请求中的该参数。   |

:::tip
若请求中均未设置 `limit` 和 `cursor` 参数，环信服务器按群组创建时间倒序返回前 10 个群组。
:::

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :-------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                 | 类型   | 描述                                     |
| :------------------- | :----- | :--------------------------------------- |
| `data` | JSON Array | 响应数据。 |
|  - `owner`         | String | 群主的用户 ID。例如：{“owner”: “user1}。 |
|  - `groupid`       | String | 群组 ID。                                |
|  - `affiliations`  | int    | 群组现有成员数。                         |
|  - `type`          | String | “group” 群组类型。                       |
|  - `lastModified` | String | 最近一次修改的时间戳，单位为毫秒。       |
|  - `groupname`     | String | 群组名称。                               |
| `count`              | Int    | 实际获取的群组数量。                     |
| `cursor`             | String | 查询游标，指定下次查询的起始位置。       |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

##### 请求示例

第一页

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups?limit=2'
```

第二页

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups?limit=2&cursor=ZGNXXXX6Mg'
```

##### 响应示例

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 获取单个用户加入的所有群组

根据用户 ID 分页获取指定用户加入的所有群组。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/user/{username}?pagesize={}&pagenum={}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数            | 类型   | 是否必需    | 描述                 |
|:--------------| :----- |:--------|:-------------------|
| `pagesize`     | String | 否       | 每页获取的群组数量。取值范围为 [1,20]，默认值为 `5`。若传入的值大于 `20`，每页仍返回 `20` 个群组。|
| `pagenum`       | String | 否       | 当前页码。默认从第 `0` 页开始获取。 |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------------ |
| `Accept`        | String | 是       | 内容类型，请填 `application/json`。       |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数      | 类型     | 描述     |
|:-------------------------|:-------|:----------------------------|
| `total`                    | Int  | 用户加入的群组总数。          |
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

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X GET 'http://XXXX/XXXX/XXXX/chatgroups/user/XXXX' \
-H 'Authorization: Bearer  <YourAppToken>'
```

##### 响应示例

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 查看指定用户是否已加入群组

查看单个用户是否已加入了指定的群组。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/user/{username}/is_joined
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数     | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。         |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段           | 类型   | 描述      |
| :------------- | :----- | :-------- |
| `data` | Boolean | 该用户是否已加入群组：<br/> - `true`：用户已加入该群组；<br/> - `false`：用户未加入该群组。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/XXXX/user/XXXX/is_joined'
```

##### 响应示例

```json
{
    "action": "get",
    "application": "8bXXXX02",
    "data": false,
    "duration": 0,
    "organization": "XXXX",
    "timestamp": 1691547476492
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 获取群组详情

可以获取一个或多个群组的详情，最多可获取 100 个群组的详情。当获取多个群组的详情时，返回所有存在的群组的详情；对于不存在的群组，返回 “group id doesn’t exist”。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述           |
| :--------- | :----- | :------- | :------------- |
| `group_id` | String | 是       | 要获取详情的群组 ID。最多可传 100 个群组 ID，群组 ID 之间用英文逗号（","）分隔。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :------------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。         |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                      | 类型   | 描述      |
| :---------- | :----- | :----------------- |
| `count`                 | Int | 获取详情的群组数量。 |
| `data` | JSON Array | 响应数据。|
|  - `id`                 | String | 群组 ID，群组唯一标识符。     |
|  - `name`               | String | 群组名称。      |
|  - `avatar`             | String | 群组头像的 URL。|
|  - `description`        | String | 群组描述。       |
|  - `membersonly`        | Bool   | 加入群组是否需要群主或者群管理员审批。<br/> - `true`：是；<br/> - `false`：否。      |
|  - `allowinvites`       | Bool   | 是否允许群成员邀请其他用户加入此群。<br/> - `true`：允许群成员邀请其他用户加入此群；<br/> - `false`：只有群主可以邀请其他用户入群。<br/> 注：该参数仅对私有群有效，因为公开群不允许群成员邀请其他用户入群。 |
|  - `maxusers`           | Int    | 群组最大成员数，创建群组的时候设置，可修改。    |
|  - `affiliations`       | Array | 群组成员列表及其对应角色：<br/> - `owner`：群主；<br/> - `member`：群组管理员和普通成员。 |
|  - `owner`              | String | 群主的用户 ID。例如：{“owner”: “user1”}。    |
|  - `created`            | Long   | 创建该群组的 Unix 时间戳。  |
|  - `affiliations_count` | int    | 群组现有成员总数。     |
|  - `disabled`           | Bool   | 群组是否为禁用状态：<br/> - `true`：群组被禁用；<br/> - `false`：群组为启用状态。          |
|  - `mute`               | Bool   | 是否处于全员禁言状态。<br/> - `true`：是； <br/> - （默认）`false`：否。       |
|  - `public`             | Bool   | 是否是公开群：<br/> - `true`：公开群；<br/> - `false`：私有群。    |
|  - `custom`             | String | 群组扩展信息，例如，可以给群组添加业务相关的标记，不要超过 1,024 字符。     |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85'
```

##### 响应示例

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 解散群组

解散指定的群组。解散群组时会同时删除群组下所有的子区（Thread）。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述              |
| :-------------- | :----- | :------- | :--------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段           | 类型   | 描述                                                                 |
| :------------- | :----- | :---------------------- |
| `data.success` | Bool   | 群组删除结果: <br/> - `true`：删除成功； <br/> - `false`：删除失败。 |
| `data.groupid` | String | 删除的群组的 ID。                                                    |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://a1.Ago ra.com/XXXX/testapp/chatgroups/6XXXX7'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7",
  "entities": [],
  "data": {
    "success": true,
    "groupid": "6XXXX7"
  },
  "timestamp": 1542363546590,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在 | 使用合法的群 ID。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。