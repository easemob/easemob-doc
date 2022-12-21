# 群组管理 REST API

<Toc />

环信即时通讯 IM 提供了 REST API 管理 App 中的群组。

单个 App 创建群组数量有限制，而且单个用户可加入群组的数量依据版本而定，详见 [使用限制](limitation.html#群组限制)。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯 IM 管理后台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

### 请求参数

| 参数    | 类型   | 是否必需 | 描述         |
| :------------ | :----- | :------ | :---------------- |
| `host` | String | 是    | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。|
| `org_name` | String | 是     | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是    | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。|
| `group_id` | String | 是     | 群组 ID。                |
| `username` |String | 是     | 用户 ID。         |

### 响应参数

| 参数             | 描述                                                         |
| :----------| :----------------------------------------------------------- |
| `action`     | 请求方式，即接口方法名。                                     |
| `organization`      | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`   | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。   |
| `applicationName` | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | 请求 URL。                                                   |
| `path`          | 请求路径，属于请求 URL 的一部分，开发者无需关注。            |
| `entities`         | 详细信息。                                                   |
| `data`        | 实际获取的数据详情。                                         |
| `uuid`         | 用户在系统内的唯一标识。该标识由系统生成，开发者无需关心。   |
| `created`         | 群组创建时间，Unix 时间戳，单位为毫秒。                      |
| `username`   | 用户 ID。                                                     |
| `groupname`      | 群组名。                                                     |
| `nickname`        | 用户昵称。                                                   |
| `timestamp`    | Unix 时间戳，单位为毫秒。                                    |
| `duration`    | 请求响应时间，单位为毫秒。                                   |

## 群组角色

群组除了群主和普通群成员之外，新增群管理员角色。

群组角色权限范围：群主 > 群管理员 > 普通群成员。

- 群主拥有群的所有权限；
- 群管理员拥有管理黑名单、禁言等权限；
- 群主加管理员数量共 100 个，即管理员最多可添加 99 个。

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 Authorization 字段：

Authorization：`Bearer ${YourToken}`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 token 鉴权](easemob_app_token.html)。

## 创建和管理群组

### 创建群组

创建一个群组，并设置群组名称、群组描述、公开群/私有群属性、群成员最大人数（包括群主）、加入公开群是否需要批准、群主、群成员、群组扩展信息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups
```

##### 路径参数

参数及描述详见  [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    | 内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数           | 类型    | 是否必需 | 描述                                                         |
|:----------------------| :------ |:-----|:--------------------------------------------------------------------------------------------------------------------------|
| `groupname`    | String  | 是     | 群组名称，最大长度为 128 字符。如果有空格，则使用 “+” 代替。         |
| `desc`         | String  | 是     | 群组描述，最大长度为 512 字符。如果有空格，则使用 “+” 代替。     |
| `public`       | Bool  | 是     | 是否是公开群。<br/> - `true`：公开群；<br/> - `false`：私有群。                  |
| `maxusers`     | Int | 否   | 群组最大成员数（包括群主），值为数值类型，默认值 200，具体上限请参考 [环信即时通讯云控制台](https://console.easemob.com/user/login)。 |
| `allowinvites` | Bool  | 是     | 是否允许群成员邀请别人加入此群：<br/> - `true`：允许群成员邀请人加入此群;<br/> - （默认）`false`：只有群主或者管理员才可以往群里加人。<br/> 注：该参数仅对私有群有效，因为公开群不允许群成员邀请其他用户入群。 |
| `membersonly` | Bool  | 否   | 用户申请入群是否需要群主或者群管理员审批。 <br/> - `true`：是； <br/> - （默认）`false`：否。 |
| `invite_need_confirm` | Bool | 否 | 邀请用户入群时是否需要被邀用户同意。<br/> - （默认）`true`：是；<br/> - `false`：否。         |
| `owner`        | String  | 是     | 群组的管理员。                                               |
| `members`      | Array  | 否   | 群组成员的用户 ID 数组。该数组可包含 1-100 个元素，不包含群主的用户 ID。 |
| `custom`       | String  | 否   | 群组扩展信息，例如可以给群组添加业务相关的标记，不要超过 1,024 字符。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型   | 描述      |
| :-------- | :----- | :-------- |
| `data.groupid` | String | 群组 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' -d '{
   "groupname": "testgroup",
   "desc": "test",
   "public": true,
   "maxusers": 300,
   "owner": "testuser",
   "members": [
     "user2"
   ]
 }' 'http://XXXX/XXXX/XXXX/chatgroups'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups",
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

### 修改群组信息

修改指定的群组信息，可修改 `groupname`、`description`、`maxusers`、`membersonly`、`allowinvites`、`invite_need_confirm`、`public` 和 `custom` 属性。如果传入其他字段，或传入的字段不存在，则不能修改的字段会抛出异常。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数           | 类型   | 是否必需 | 描述                                                         |
| :------------- | :------ | :----- | :----------------------------- |
| `groupname`    | String | 否  | 群组名称，修改时值不能包含斜杠（“/”），最大长度为 128 字符。如果有空格，则使用 “+” 代替。 |
| `description`  | String  | 否  | 群组描述，修改时值不能包含斜杠（“/”），最大长度为 512 字符。如果有空格，则使用 “+” 代替。|
| `maxusers`     | Int | 否  | 群组成员最大数（包括群主），值为数值类型。     |
| `membersonly`  | Bool  | 否  | 加入群组是否需要群主或者群管理员审批：<br/> - `true`：是；<br/> - `false`：否。 |
| `allowinvites` | Bool  | 否  | 是否允许群成员邀请别人加入此群：<br/> - `true`：允许群成员邀请人加入此群；<br/> - `false`：只有群主或群管理员才可以邀请用户入群。 |
| `invite_need_confirm` | Bool  | 否  | 受邀人加入群组前是否需接受入群邀请：<br/> - `true`：需受邀人确认入群邀请；<br/> - `false`：受邀人直接加入群组，无需确认入群邀请。 |
| `custom`  | String | 否  | 群组扩展信息，例如可以给群组添加业务相关的标记，不要超过 1,024 字符。 |
| `public`       | Bool  | 是     | 是否是公开群。<br/> - `true`：公开群；<br/> - `false`：私有群。     |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段            | 类型    | 描述                                                         |
| :------------- | :------ | :----------------------------------------------------------- |
| `data.description`  | Bool | 群组描述是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。         |
| `data.maxusers`     | Bool | 群组最大成员数是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。   |
| `data.groupname`    | Bool  | 群组名称是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。         |
| `data.membersonly`  | Bool | “加入群组是否需要群主或者群管理员审批”是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。 |
| `data.public`       | Bool  | “是否是公开群”是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。                  |
| `data.allowinvites` | Bool | “是否允许群成员邀请其他用户入群”是否修改成功：<br/> -`true`：修改成功；</br>- `false`：修改失败。 |
| `data.invite_need_confirm` | Bool | “受邀人加入群组前是否需接受入群邀请”是否修改成功：<br/> - `true`：修改成功；<br/> - `false`：修改失败。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X PUT -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken>' 'http://XXXX/XXXX/XXXX/chatgroups/6XXXX7' -d {
    "groupname": "test groupname",
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
        "groupname": true
    },
    "duration": 0,
    "entities": [],
    "organization": "XXXX",
    "properties": {},
    "timestamp": 1666062065529,
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/6XXXX7"
}
```

### 获取 App 中所有的群组（可分页）

获取应用下全部的群组信息的接口。

#### HTTP 请求

直接获取：

```http
GET https://{host}/{org_name}/{app_name}/chatgroups
```

分页获取：

```http
GET https://{host}/{org_name}/{app_name}/chatgroups?limit={N}&cursor={cursor}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数     | 类型   | 是否必需 | 描述                   |
| :------- | :----- | :------------------------ | :------- |
| `limit`  | Int |  否  |每次期望返回的群组数量。该参数仅在分页获取时为必需。   |
| `cursor` | String | 否   | 数据查询的起始位置。该参数仅在分页获取时为必需。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段             | 类型   | 描述                                                         |
| :-------------- | :----- | :----------------------------------------------------------- |
| `data.owner`         | String | 群主的 ID。例如：{“owner”: “user1}。                         |
| `data.groupid`       | String | 群组 ID。                                                    |
| `data.affiliations`  | int    | 群组现有成员数。                                             |
| `data.type`          | String | “group” 群组类型。                                           |
| `data.last_modified` | String | 最近一次修改的时间戳，单位为毫秒。                           |
| `data.groupname`     | String | 群组名称。                                                   |
| `count`         | Int    | 实际取得的群组数量。                                         |
| `limit`         | Int    | 每页获取的数量。取值范围为[1,100]，默认值为 10。 |
| `cursor` | String | 游标，下次回从该位置开始进行查询。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

##### 请求示例

第一页

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups?limit=2'
```

第二页

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups?limit=2&cursor=ZGNXXXX6Mg'
```

##### 响应示例

```json
{
    "action": "get",
    "params": {
        "limit": [
            "2"
        ]
    },
    "uri": "https://XXXX/XXXX/XXXX/chatgroups",
    "entities": [],
    "data": [
        {
            "owner": "XXXX#testapp_user1",
            "groupid": "10XXXX60",
            "affiliations": 2,
            "type": "group",
            "last_modified": "1441021038124",
            "groupname": "testgroup1"
        },
        {
            "owner": "XXXX#testapp_user2",
            "groupid": "10XXXX76",
            "affiliations": 1,
            "type": "group",
            "last_modified": "1441074471486",
            "groupname": "testgroup2"
        }
    ],
    "timestamp": 1441094193812,
    "duration": 14,
    "cursor": "Y2hhdGdyb3VwczplYXNlbW9iLWRlbW8vY2hhdGRlbW91aV8z",
    "count": 2
}
```

### 获取单个用户加入的所有群组（可分页）

根据用户 ID 称获取该用户加入的全部群组。

#### HTTP 请求

直接请求：

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/joined_chatgroups
```

分页请求：

```http
GET https://{host}/{app_name}/users/{username}/joined_chatgroups?pagesize={}&pagenum={}
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `pagesize` | String | 是     | 每页获取的群组数量。该参数仅适用于分页获取方法。             |
| `pagenum`  | String | 是     | 当前页码。该参数仅适用于分页获取方法。                       |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    |内容类型。请填 `application/json` |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段         | 类型   | 描述       |
| :---------- | :----- | :--------- |
| `data.groupid`   | String | 群组 ID。  |
| `data.groupname` | String | 群组名称。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> '' 'http://XXXX/XXXX/XXXX/users/user1/joined_chatgroups'
```

分页获取示例：

```shell
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/users/user1/joined_chatgroups?pagesize=1&pagenum=100'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/users/user1/joined_chatgroups",
  "entities": [],
  "data": [
    {
      "groupid": "66XXXX85",
      "groupname": "testgroup1"
    },
    {
      "groupid": "66016467025921",
      "groupname": "testgroup2"
    },
  ],
  "timestamp": 1542359565885,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "testapp",
  "count": 2
}
```

分页获取响应示例：

```json
{
    "action":"get",
    "application":"8bXXXX02",
    "applicationName":"testapp",
    "count":0,
    "data":[

    ],
    "duration":0,
    "entities":[

    ],
    "organization":"XXXX",
    "params":{
        "pagesize":[
            "1"
        ],
        "pagenum":[
            "100"
        ]
    },
    "properties":{

    },
    "timestamp":1645177932072,
    "uri":"http://XXXX/XXXX/XXXX/users/user1/joined_chatgroups"
}
```

### 获取群组详情

可以获取一个或多个群组的详情。当获取多个群组的详情时，返回所有存在的群组的详情；对于不存在的群组，返回 “group id doesn’t exist”。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                  | 类型    | 描述                                                         |
| :------------------- | :------ | :----------------------------------------------------------- |
| `data.id`                 | String  | 群组 ID，群组唯一标识符。                                    |
| `data.name`               | String  | 群组名称。   |
| `data.description`        | String  | 群组描述。    |
| `data.membersonly`        | Bool | 加入群组是否需要群主或者群管理员审批。<br/> - `true`：是；<br/> - （默认）`false`：否。 |
| `data.allowinvites`       | Bool | 是否允许群成员邀请其他用户加入此群。<br/> - `true`：允许群成员邀请其他用户加入此群；<br/> - （默认）`false`：只有群主可以邀请其他用户入群。<br/> 注：该参数仅对私有群有效，因为公开群不允许群成员邀请其他用户入群。 |
| `data.maxusers`           | Int | 群成员上限，创建群组的时候设置，可修改。                     |
| `data.permission`         | String  | 群组成员角色：<br/> - `owner`：群主；<br/> - `member`：普通成员。          |
| `data.owner`              | String  | 群主的用户 ID。例如：{“owner”: “user1”}。                    |
| `data.created`            | Long    | 创建该群组的 Unix 时间戳。    |
| `data.affiliations_count` | int     | 现有成员总数。                                               |
| `data.mute`        | Bool | 是否处于全员禁言状态。<br/> - `true`：是； <br/> - （默认）`false`：否。       |
| `data.public`             | Bool | 是否是公开群：<br/> - `true`：公开群；<br/> - `false`：私有群。             |
| `data.custom`             | String  | 群组扩展信息，例如可以给群组添加业务相关的标记，不要超过 1,024 字符。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85'
```

##### 响应示例

```json
{
  "action":"get",
  "application":"09eXXXX34",
  "applicationName":"chatdemoui",
  "count":1,
  "data":[{
    "id":"18XXXX3",
    "name":"XXXX",
    "description":"test",
    "membersonly":false,
    "allowinvites":false,
    "maxusers":300,
    "owner":"yifan2",
    "created":1656062986845,
    "custom":"",
    "mute":false,
    "affiliations_count":1,
    "public":true,
    "permission":"owner",
    }],
  "duration":2,
  "organization":"XXXX",
  "timestamp":1656063062633,
  "uri":"http://XXXX.com/XXXX/chatdemoui/chatgroups/18XXXX3"
}
```

### 删除群组

删除一个群组的接口。删除群组时会同时删除群组下所有的子区（Thread）。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型    | 描述                                                    |
| :-------- | :------ | :------------------------------------------------------ |
| `data.success` | Bool | 群组删除结果: </br> - `true`：删除成功； <br/> - `false`：删除失败。 |
| `data.groupid` | String  | 所删除群组 ID。                                         |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://a1.Ago ra.com/XXXX/testapp/chatgroups/6XXXX7'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/6XXXX7",
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

## 管理群组公告和共享文件

### 获取群组公告

获取指定群组 ID 的群组公告。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/announcement
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段            | 类型   | 描述         |
| :------------- | :----- | :----------- |
| `data.announcement` | String | 群公告内容。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/announcement'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/announcement",
  "entities": [],
  "data": {
    "announcement" : "群组公告..."
  },
  "timestamp": 1542363546590,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 修改群组公告

修改指定群组 ID 的群组公告，注意群组公告的内容不能超过 512 个字符。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/announcement
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型    | 描述                                                 |
| :------- | :------ | :--------------------------------------------------- |
| `data.id`     | String  | 群组 ID。                                            |
| `data.result` | Bool | 修改结果：<br/> - `true`：修改成功；</br>- `false`：修改失败。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' -d '{"announcement" : "群组公告…"}' 'http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/announcement'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/announcement",
  "entities": [],
  "data": {
    "id" : "6XXXX7",
    "result" : true
  },
  "timestamp": 1542363546590,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 获取群组共享文件

分页获取指定群组 ID 的群组共享文件，之后可以根据 response 中返回的 `file_id`，`file_id` 是群组共享文件的唯一标识，调用 [下载群组共享文件](#下载群组共享文件) 接口下载文件，或调用 [删除群组共享文件](#删除群组共享文件) 接口删除文件。

#### HTTP 请求

直接请求：

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files
```

分页请求：

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files?pagenum={N}&pagesize={N}
```

##### 路径参数

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `pagesize` | String   | 否 | 每页期望返回的共享文件数。取值范围为 [1,1000]。|
| `pagenum` |  Int | 否 | 当前页码。默认从第 1 页开始获取。  |

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型   | 描述                                                        |
| :--------| :------ | :---------------------------------------------------------- |
| `data.file_id`  | String   | 群组共享文件的 ID，如果要下载该文件需要使用到这个 `file_id`。 |
| `data.file_name` | String  | 群组共享文件名称。                                          |
| `data.file_owner` | String | 上传群组共享文件的用户 ID。                                 |
| `data.file_size`  | Long | 群组共享文件大小(字节)。                                    |
| `data.created`   | Long  | 上传群组共享文件的时间。                                    |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files?pagenum=1&pagesize=10'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "8bXXXX02",
  "params": {
        "pagesize": [
            "10"
        ],
        "pagenum": [
            "1"
        ]
    },
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files",
  "entities": [],
  "data": [
        {
            "file_id": "dbd88d20-e1d4-11ea-95fc-638fc2d59a8d",
            "file_name": "159781149272586.jpg",
            "file_owner": "u1",
            "file_size": 326127,
            "created": 1597811492594
        },
        {
            "file_id": "b30XXXX4f",
            "file_name": "159781141836993.jpg",
            "file_owner": "u1",
            "file_size": 326127,
            "created": 1597811424158
        }
    ],
  "timestamp": 1542363546590,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 上传群组共享文件

上传指定群组 ID 的群组共享文件。注意上传的文件大小不能超过 10 MB。

分页获取指定群组 ID 的群组共享文件，然后可以根据响应中返回的 file_id（群组共享文件的唯一标识）调用 [下载群组共享文件](#下载群组共享文件) 接口下载群组的共享文件，或调用 [删除群组共享文件](#删除群组共享文件) 接口删除群组的共享文件。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|
| `Content-Type`   | String | 是    |内容类型。请填 `multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`。 |
|`restrict-access`| Bool  |  否   |是否仅群成员可见。<br/> - `true`：是。<br/> - `false`：否。  |
|`file`| String | 是 |待上传文件的本地路径。  |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型      | 描述                                                       |
| :---------| :--------- | :---------------------------------- |
| `data.file_url`  | String  | 群组共享文件的 URL，在环信即时通讯 IM 服务器上保存的地址。 |
| `data.group_id`   | String | 群组 ID。                                                  |
| `data.file_name`  | String | 群组共享文件名称。                                         |
| `data.created`    | Long | 上传群组共享文件的时间。                                   |
| `data.file_id`   | String  | 群组共享文件 ID，可以用于下载共享文件和删除共享文件。      |
| `data.file_size`  | Long | 群组共享文件大小(字节)。                                   |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST 'http://XXXX/XXXX/XXXX/chatgroups/66021836783617/share_files' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken>' -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' -H 'restrict-access: true' -F file=@/Users/test/image/IMG_3.JPG
```

##### 响应示例

```json
{

  "action" : "post",
  "application" : "7fXXXXef",
  "uri" : "http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files",
  "entities" : [ ],
  "data" : {
    "file_url" : "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/c6XXXXc0",
    "group_id" : "6XXXX7",
    "file_name" : "img_3.jpg",
    "created" : 1599050554954,
    "file_id" : "c6XXXXc0",
    "file_size" : 13512
  },
  "timestamp" : 1599050554978,
  "duration" : 0,
  "organization" : "XXXX",
  "applicationName" : "testapp"

}
```

### 下载群组共享文件

根据指定的群组 ID 与 `file_id` 下载群组共享文件，`file_id` 是通过 [获取群组共享文件](#获取群组共享文件) 接口获取。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型       | 描述                          |
| :---------- | :------------| :------------------------------------ |
| `data.file_url`  | String  | 群组共享文件的 URL，在环信即时通讯 IM 服务器上保存的地址。 |
| `data.group_id`   | String | 群组 ID。                                                  |
| `data.file_name`  | String | 群组共享文件名称。                                         |
| `data.created`    | Long | 上传群组共享文件的时间。                                   |
| `data.file_id`    | String | 群组共享文件 ID，可以用于下载共享文件和删除共享文件。      |
| `data.file_size`  | Long| 群组共享文件大小(字节)。                       |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f'
```

##### 响应示例

```json
{
  "action" : "post",
  "application" : "7fXXXXef",
  "uri" : "http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files",
  "entities" : [ ],
  "data" : {
    "file_url" : "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/c6XXXXc0",
    "group_id" : "6XXXX7",
    "file_name" : "img_3.jpg",
    "created" : 1599050554954,
    "file_id" : "c6XXXXc0",
    "file_size" : 13512
  },
  "timestamp" : 1599050554978,
  "duration" : 0,
  "organization" : "XXXX",
  "applicationName" : "testapp"
}
```

### 删除群组共享文件

根据指定的群组 ID 与 文件 ID（file_id）删除群组共享文件，文件 ID 通过 [获取群组共享文件](#获取群组共享文件) 接口获取。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `file_id`  | String | 是     | 文件 ID。                                                    |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型    | 描述                                                         |
| :---------| :------ | :----------------------------------------------------------- |
| `data.group_id`  | String | 群组 ID。                                                    |
| `data.file_id`  | String  | 群组共享文件 ID，可以用于下载共享文件和删除共享文件          |
| `data.result`   | Bool  | 删除群组共享文件的结果：<br/> - `true`：删除成功；<br/> - `false`：删除失败。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f",
  "entities": [],
  "data": {
      "group_id": "6XXXX7",
      "file_id": "b30XXXX4f",
      "result": true
  },
  "timestamp": 1599049350114,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 管理群组成员

环信即时通讯 IM 提供多个接口实现对群组成员的管理，包括添加、移除群组成员关系列表，转让群主等。

### 分页获取群组成员

可以分页获取群组成员列表的接口。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users?pagenum={N}&pagesize={N}
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `params.pagenum`  | Int    | 否   | 当前页码。默认从第 1 页开始获取。         |
| `params.pagesize` | Int    | 否   | 每页期望返回的群组成员数量。取值范围为 [1,100]。默认为 10。    |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型     | 描述                                        |
| :------| :------ | :------------------------------------------ |
| `data.owner` | String  | 群主的用户 ID。例如：{“owner”: “user1”}。   |
| `data.member` | String | 群成员的用户 ID。例如：{“member”:“user2”}。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET HTTP://XXXX/XXXX/XXXX/chatgroups/10XXXX85/users?pagenum=2&pagesize=2 -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "get",
    "application": "52XXXXf0",
    "params": {
        "pagesize": [
          "2"
        ],
        "pagenum": [
          "2"
        ]
    },
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/10XXXX85/users",
    "entities": [],
    "data": [
    {
            "member": "user1"
    },
    {
            "member": "user2"
    }
    ],
    "timestamp": 1489074511416,
    "duration": 0,
    "organization": "XXXX",
    "applicationName": "testapp",
    "count": 2
}
```

### 添加单个群组成员

一次给群添加一个成员，不能重复添加同一个成员。如果用户已经是群成员，将添加失败，并返回错误。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型  | 描述                                          |
| :-------- | :--------------| :--------------------------- |
| `data.result`  | Bool | 添加结果：<br/> - `true`：成功。<br/> - `false`：失败。 |
| `data.groupid` | String | 群组 ID。                                     |
| `data.action`  | String | 执行的操作。                                  |
| `data.user`    | String  | 被添加的用户 ID。                       |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user4'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user4",
  "entities": [],
  "data": {
    "result": true,
    "groupid": "66XXXX85",
    "action": "add_member",
    "user": "user4"
  },
  "timestamp": 1542364958405,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 批量添加群组成员

为群组添加多个成员，一次最多可以添加 60 位成员。如果所有用户均已是群成员，将添加失败，并返回错误。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数        | 类型   | 是否必需 | 描述                                           |
| :---------- | :----- | :------- | :--------------------------------------------- |
| `usernames` | Array | 是     | `username1/username2` 要添加到群中的成员用户 ID。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     |  类型       | 描述                |
| :---------- | :-------- | :------------------ |
| `data.newmembers`  | Array | 添加的群组成员 ID。 |
| `data.groupid`   | String  | 群组 ID。           |
| `data.action`    | String   | 执行的操作。`add_member` 为添加群成员。      |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' -d '{
   "usernames": [
     "user4","user5"
   ]
 }' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users",
  "entities": [],
  "data": {
    "newmembers": [
      "user5",
      "user4"
    ],
    "groupid": "66XXXX85",
    "action": "add_member"
  },
  "timestamp": 1542365557942,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 移除单个群组成员

从群中移除指定成员。如果被移除用户不是群成员，将移除失败，并返回错误。群成员移除时还会移除他在群下所有加入的子区。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型    | 描述                                                  |
| :-------- | :------ | :---------------------------------------------------- |
| `data.result`  | Bool | 移除结果：<br/> - `true`：移除成功；<br/> - `false`：移除失败。 |
| `data.groupid` | String  | 群组 ID。                                             |
| `data.action`  | String  | 执行的操作，`remove_member` 为移除群组成员。                     |
| `data.user`    | String  | 被移除的用户 ID。                                     |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user3'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user3",
  "entities": [],
  "data": {
    "result": true,
    "action": "remove_member",
    "user": "user3",
    "groupid": "66XXXX85"
  },
  "timestamp": 1542365943067,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 批量移除群组成员

移除多名群成员。如果所有被移除用户均不是群成员，将移除失败，并返回错误。移除后也会将用户从该群里加入的子区中移除。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users/{members}
```

##### 路径参数

| 参数          | 类型   | 是否必需 | 描述                                                         |
| :------------ | :----- | :------- | :----------------------------------------------------------- |
| `members`    | String | 是     | 要移除的群成员用户 ID，用户 ID 之间用英文逗号分隔。建议一次最多移除 60 个群成员，并且 URL 的长度应在 4k 字节以内。         |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型    | 描述                                                  |
| :-------- | :------ | :---------------------------------------------------- |
| `data.result`  | Bool | 操作结果：<br/> - `true`：移除成功；<br/> - `false`：移除失败。 |
| `data.action`  | String  | 执行的操作，`remove_member`：移除群组成员。       |
| `data.reason`  | String  | 操作失败的原因。                                      |
| `data.user`    | String  | 被移除成员的用户 ID。                                  |
| `data.groupid` | String  | 操作的群组 ID。                                       |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/ttXXXX81,user2,user3'
```

##### 响应示例

```json
{
    "action": "delete",
    "application": "9bXXXXf7",
    "uri": "https://XXXX/XXXX/XXXX",
    "entities": [],
    "data": [{
        "result": false,
        "action": "remove_member",
        "reason": "user ttXXXX81 doesn't exist.",
        "user": "user1",
        "groupid": "14XXXX79"
    },
    {
        "result": true,
        "action": "remove_member",
        "user": "user2",
        "groupid": "14XXXX79"
    },
    {
        "result": true,
        "action": "remove_member",
        "user": "user3",
        "groupid": "14XXXX79"
    }],
    "timestamp": 1433492935318,
    "duration": 84,
    "organization": "XXXX",
    "applicationName": "testapp"
}
```

### 获取群管理员列表

获取群组管理员列表的接口。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/admin
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型  | 描述             |
| :----- | :---- | :--------------- |
| `data` | Array | 群组管理员的用户 ID 列表。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET HTTP://XXXX/XXXX/XXXX/chatgroups/10XXXX85/admin -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "get",
    "application": "52XXXXf0",
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/10XXXX85/admin",
    "entities": [],
    "data": ["user1"],
    "timestamp": 1489073361210,
    "duration": 0,
    "organization": "XXXX",
    "applicationName": "testapp",
    "count": 1
}
```

### 添加群管理员

将一个群成员角色权限提升为群管理员。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/admin
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数       | 类型   | 是否必需 | 描述                    |
| :--------- | :----- | :------- | :---------------------- |
| `newadmin` | String | 是     | 添加的新管理员用户 ID。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型   | 描述                    |
| :----- | :----- | :---------------------- |
| `data` | String | 添加的新管理员用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST HTTP://XXXX/XXXX/XXXX/chatgroups/10XXXX85/admin -d '{"newadmin":"user1"}' -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "get",
    "application": "52XXXXf0",
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/10XXXX85/admin",
    "entities": [],
    "data": ["user1"],
    "timestamp": 1489073361210,
    "duration": 0,
    "organization": "XXXX",
    "applicationName": "testapp",
    "count": 1
}
```

### 移除群管理员

将用户的角色从群管理员降为群普通成员。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/admin
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型    | 描述                                                         |
| :--------- | :------ | :----------------------------------------------------------- |
| `data.result`   | Bool | 操作结果：<br/> - `success`：表示移除成功; <br/> - `failure`：表示移除失败。 |
| `data.oldadmin` | String  | 被移除的管理员用户 ID。                                          |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE HTTP://XXXX/XXXX/XXXX/chatgroups/10XXXX85/admin/user1 -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "delete",
    "application": "52XXXXf0",
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/10XXXX85/admin/user1",
    "entities": [],
    "data": {
        "result": "success",
        "oldadmin": "user1"
    },
    "timestamp": 1489073432732,
    "duration": 1,
    "organization": "XXXX",
    "applicationName": "testapp"
}
```

### 转让群组

修改群主为同一群组中的其他成员。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    | 内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数       | 类型   | 描述                |
| :--------- | :----- | :------------------ |
| `newowner` | String | 群组的新管理员用户 ID。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型    | 描述                                                  |
| :--------- | :------ | :---------------------------------------------------- |
| `data.newowner` | Bool | 操作结果：<br/> - `true`：转让成功。<br/> - `false`：转让失败。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' -d '{     "newowner": "user2"   }' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85'
```

##### 响应示例

```json
{
  "action": "put",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/66XXXX85",
  "entities": [],
  "data": {
    "newowner": true
  },
  "timestamp": 1542537813420,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 管理黑名单

环信即时通讯 IM 提供多个接口完成群组黑名单管理，包括查看、将用户添加、移除黑名单等。

### 查询群组黑名单

查询一个群组黑名单中的用户列表。位于黑名单中的用户查看不到该群组的信息，也无法收到该群组的消息。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/blocks/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    | 内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型  | 描述                |
| :----- | :---- | :------------------ |
| `data` | Array | 群组黑名单用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/67178793598977/blocks/users",
  "entities": [],
  "data": [
    "user2",
    "user3"
  ],
  "timestamp": 1543466293681,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp",
  "count": 2
}
```

### 添加单个用户至群组黑名单

添加一个用户进入一个群组的黑名单。群主无法被加入群组的黑名单。

用户进入群组黑名单后会收到加入黑名单的回调。之后，该用户查看不到该群组的信息，也收不到该群组的消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述                                                  |
| :-------- | :---------------- | :------------------------- |
| `data.result`  | Bool | 添加结果：<br/> - `true`：添加成功；<br/> - `false`：添加失败。 |
| `data.groupid` | String | 群组 ID。                                             |
| `data.action`  | String | 执行操作。`add_blocks 为将成员加入黑名单。                                             |
| `data.user`    | String | 被添加的用户 ID。                                     |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users/user1'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "add_blocks",
    "user": "user1",
    "groupid": "66XXXX85"
  },
  "timestamp": 1542539577124,
  "duration": 27,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 批量添加用户至群组黑名单

将多个用户添加一个群组的黑名单。一次最多可以添加 60 个用户至群组黑名单。群主无法被加入群组的黑名单。

用户进入群组黑名单后会收到加入黑名单的回调。黑名单上的用户查看不到该群组的信息，也收不到该群组的消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/blocks/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    | 内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数        | 类型  | 是否必需 | 描述              |
| :---------- | :----  | :----| :---------------- |
| `usernames` | Array | 是 | 要添加的用户 ID 数组。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型    | 描述                                                  |
| :-------- | :------ | :---------------------------------------------------- |
| `data.result`  | Bool | 添加结果：<br/> - `true`：添加成功；<br/> - `false`：添加失败。 |
| `data.reason`  | String  | 添加失败的原因。                                      |
| `data.groupid` | String  | 群组 ID。                                             |
| `data.action`  | String  | 执行的操作。                                          |
| `data.user`    | String  | 被添加的用户 ID。                                     |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' -d '{
   "usernames": [
     "user3","user4"
   ]
 }' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users",
  "entities": [],
  "data": [
    {
      "result": false,
      "action": "add_blocks",
      "reason": "user: user3 doesn't exist in group: 66XXXX85",
      "user": "user3",
      "groupid": "66XXXX85"
    },
    {
      "result": true,
      "action": "add_blocks",
      "user": "user4",
      "groupid": "66XXXX85"
    }
  ],
  "timestamp": 1542540095540,
  "duration": 16,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 从群组黑名单移除单个用户

将指定用户移出群组黑名单。对于群组黑名单中的用户，如果需要将其再次加入群组，需要先将其从群组黑名单中移除。

#### HTTP 请求

```http
DELETE /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型    | 描述                                                  |
| :-------- | :------ | :---------------------------------------------------- |
| `result`  | Bool | 移除结果：<br/> - `true`：移除成功；<br/> - `false`：移除失败。 |
| `groupid` | String  | 群组 ID。                                             |
| `action`  | String  | 执行的操作。                                          |
| `user`    | String  | 被添加的用户 ID。                                     |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users/user1'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "remove_blocks",
    "user": "user1",
    "groupid": "66XXXX85"
  },
  "timestamp": 1542540470679,
  "duration": 45,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 从群组黑名单批量移除用户

将多名指定用户从群组黑名单中移除。对于群组黑名单中的用户，如果需要将其再次加入群组，需要先将其从群组黑名单中移除。

#### HTTP 请求

```http
DELETE /{org_name}/{app_name}/chatgroups/{group_id}/blocks/users/{usernames}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型    | 描述                                                  |
| :-------- | :------ | :---------------------------------------------------- |
| `data.result`  | Bool | 移除结果：<br/> - `true`：移除成功；<br/> - `false`：移除失败。 |
| `data.groupid` | String  | 群组 ID。                                             |
| `data.action`  | String  | 执行的操作。                                          |
| `data.user`    | String  | 添加的用户 ID。                                       |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users/user1%2Cuser2'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users/user1%2Cuser2",
  "entities": [],
  "data": [
    {
      "result": true,
      "action": "remove_blocks",
      "user": "user1",
      "groupid": "66XXXX85"
    },
    {
      "result": true,
      "action": "remove_blocks",
      "user": "user2",
      "groupid": "66XXXX85"
    }
  ],
  "timestamp": 1542541014655,
  "duration": 29,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 管理白名单

环信即时通讯 IM 提供多个接口完成群组白名单管理，包括查看、将用户添加、移除白名单等。

### 查询群组白名单

查询一个群组白名单中的用户列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/white/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    | 内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型  | 描述                    |
| :----- | :---- | :---------------------- |
| `data` | Array | 群组白名单中的用户 ID 列表。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/{groupid}/white/users'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "XXXX",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/12XXXX53/white/users",
  "entities": [],
  "data": [
    "wzy_test",
    "wzy_vivo",
    "wzy_huawei",
    "wzy_xiaomi",
    "wzXXXXzu"
  ],
  "timestamp": 1594724947117,
  "duration": 3,
  "organization": "XXXX",
  "applicationName": "XXXX",
  "count": 5
}
```

### 添加单个用户至群组白名单

将指定的单个用户添加至群组白名单。用户在添加至群组白名单后，当群组全员被禁言时，仍可以在群组中发送消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/white/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    | 内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 描述                                                  |
| :-------- | :---------------------------------------------------- |
| `data.result`  | 添加结果：<br/> - `true`：添加成功；<br/> - `false`：添加失败。 |
| `data.groupid` | 群组 ID。                                             |
| `data.action`  | 执行操作。`add_user_whitelist` 为将成员加入群白名单。                        |
| `data.user`    | 被添加的用户 ID。                                     |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/{groupid}/white/users/{username}'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "XXXX",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/12XXXX53/white/users/wzy_xiaomi",
  "entities": [],
  "data": {
    "result": true,
    "action": "add_user_whitelist",
    "user": "wzy_xiaomi",
    "groupid": "12XXXX53"
  },
  "timestamp": 1594724293063,
  "duration": 4,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

### 批量添加用户至群组白名单

添加多个用户至群组白名单。你一次最多可添加 60 个用户。用户添加至白名单后在群组全员禁言时仍可以在群组中发送消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/white/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    | 内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数        | 类型  | 描述                            |
| :---------- | :---- | :------------------------------ |
| `usernames` | Array | 待添加至群组白名单中的用户 ID。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型    | 描述                                                  |
| :-------- | :------ | :---------------------------------------------------- |
| `data.result`  | Bool | 添加结果：<br/> - `true`：添加成功；<br/> - `false`：添加失败。 |
| `data.reason`  | String  | 添加失败的原因。                                      |
| `data.groupid` | String  | 群组 ID。                                             |
| `data.action`  | String  | 执行的操作。`add_user_whitelist` 为将成员加入群白名单。                 |
| `data.user`    | String  | 被添加的用户 ID。                                     |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' -d '{"usernames" : ["user1"]}' 'http://XXXX/XXXX/XXXX/chatgroups/{groupid}/white/users'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "XXXX",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/12XXXX53/white/users",
  "entities": [],
  "data": [
    {
      "result": true,
      "action": "add_user_whitelist",
      "user": "wzy_test",
      "groupid": "12XXXX53"
    },
    {
      "result": true,
      "action": "add_user_whitelist",
      "user": "wzXXXXzu",
      "groupid": "12XXXX53"
    }
  ],
  "timestamp": 1594724634191,
  "duration": 2,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

### 将用户移除群组白名单

将指定用户从群组白名单中移除。你每次最多可移除 60 个用户。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/white/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Accept`   | String | 是    | 内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型    | 描述                                                  |
| :-------- | :------ | :---------------------------------------------------- |
| `data.result`  | Bool | 移除结果：<br/> - `true`：移除成功；<br/> - `false`：移除失败。 |
| `data.groupid` | String  | 群组 ID。                                             |
| `data.action`  | String  | 执行的操作。`remove_user_whitelist` 为将成员加入群白名单。               |
| `data.user`    | String  | 添加的用户 ID，多个用户 ID 以逗号分隔。               |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken>' 'http://XXXX/XXXX/XXXX/chatgroups/{groupid}/white/users/{username}'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "XXXX",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/12XXXX53/white/users/wzy_huawei,wzXXXXzu",
  "entities": [],
  "data": [
    {
      "result": true,
      "action": "remove_user_whitelist",
      "user": "wzy_huawei",
      "groupid": "12XXXX53"
    },
    {
      "result": true,
      "action": "remove_user_whitelist",
      "user": "wzXXXXzu",
      "groupid": "12XXXX53"
    }
  ],
  "timestamp": 1594725137704,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## 管理禁言

环信即时通讯 IM 提供多个接口进行群组禁言列表管理，包括查看、将用户添加、移除禁言列表等。

### 获取禁言列表

获取当前群组的禁言用户列表。

将用户从禁言列表中移除。移除后，用户可以正常在群中发送消息。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/mute
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型    | 描述                         |
| :-------| :---------------| :--------------- |
| `data.expire`| Long | 禁言到期的时间，单位为毫秒。 |
| `data.user`| String  | 被禁言用户的 ID。            |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET HTTP://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "get",
    "application": "52XXXXf0",
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute",
    "entities": [],
    "data": [{
        "expire": 1489158589481,
        "user": "user1"
    }],
    "timestamp": 1489072802179,
    "duration": 0,
    "organization": "XXXX",
    "applicationName": "testapp"
}
```

### 禁言指定群成员

对指定群成员禁言。群成员被禁言后，将无法在群中发送消息，也无法在子区里面发送消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/mute
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数            | 类型   | 是否必需 | 描述                    |
| :-------------- | :---- | :-------| :------------------------ |
| `mute_duration` | Long  |  是  | 禁言时长，单位为毫秒。  |
| `usernames`     | Array |  是  | 要被添加到禁言列表的用户 ID 列表。每次调用最多禁言 10 个成员。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型    | 描述                                                  |
| :------- | :------ | :---------------------------------------------------- |
| `data.result` | Bool | 操作结果：<br/> - `true`：添加成功；<br/> - `false`：添加失败。 |
| `data.expire` | Long    | 禁言到期的时间。该时间为 Unix 时间戳，单位为毫秒。    |
| `data.user`   | String  | 被禁言用户的 ID。                                     |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST HTTP://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute -d '{"usernames":["user1"], "mute_duration":86400000}' -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "post",
    "application": "52XXXXf0",
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute",
    "entities": [],
    "data": [{
        "result": true,
        "expire": 1489158589481,
        "user": "user1"
    }],
    "timestamp": 1489072189508,
    "duration": 0,
    "organization": "XXXX",
    "applicationName": "testapp"
}
```

### 禁言全体成员

对所有群组成员一键禁言，即将群组的所有成员均加入禁言列表。设置群组全员禁言后，仅群组白名单中的用户可在群组内发消息。同样在子区中发消息也需要在群组的白名单里面。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/ban
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数            | 类型  | 是否必需 | 描述                   |
| :-------------- | :--- | :-------| :------------- |
| `mute_duration` | Long | 是 | 禁言时长，单位为毫秒。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型    | 描述                                                  |
| :------- | :------ | :---------------------------------------------------- |
| `data.result` | Bool | 操作结果：<br/> - `true`：禁言成功；<br/> - `false`：禁言失败。 |
| `data.expire` | Long    | 禁言到期的时间。该时间为 Unix 时间戳，单位为毫秒。    |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/{groupid}/ban'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "XXXX",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/12XXXX53/ban",
  "entities": [],
  "data": {
    "mute": true
  },
  "timestamp": 1594628861058,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

### 解除成员禁言

将一个或多个群成员移除禁言列表。移除后，群成员可以在群组中正常发送消息。同时也可以在子区里面发送消息。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/mute/{member1}(,{member2},…)
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `member`   | String | 是     | member1:成员 1 id；member2：成员 2 id；......                 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型    | 描述                                                      |
| :------- | :------ | :-------------------------------------------------------- |
| `data.result` | Bool | 操作结果：<br/> - `true`：解除成功；<br/> - `false`：解除失败。 |
| `data.user`   | Array | 被移除禁言的用户 ID。                                     |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE http://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute/user1  -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "delete",
    "application": "52XXXXf0",
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute/user1",
    "entities": [],
    "data": [{
        "result": true,
        "user": "user1"
    }],
    "timestamp": 1489072695859,
    "duration": 0,
    "organization": "XXXX",
    "applicationName": "testapp"
}
```

### 解除全员禁言

一键取消对群组全体成员的禁言。移除后，群成员可以在群组和子区中正常发送消息。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/ban
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Accept`   | String | 是    |内容类型。请填 `application/json`。 |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型    | 描述                                                  |
| :------- | :------ | :---------------------------------------------------- |
| `data.mute` | Bool | 是否处于全员禁言状态。<br/> - `true`：是； <br/> - `false`：否。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourToken> ' 'http://XXXX/XXXX/XXXX/chatgroups/{groupid}/ban'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "XXXX",
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/12XXXX53/ban",
  "entities": [],
  "data": {
    "mute": false
  },
  "timestamp": 1594628899502,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## 管理子区

环信即时通讯 IM 提供多个接口完成子区相关的管理，包括子区的创建、获取、修改、删除等。

### 获取 app 中所有的子区(分页获取)

获取应用下全部的子区列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/thread?limit={limit}&cursor={cursor}&sort={sort}
```

##### 路径参数

| 参数       | 类型     | 是否必需 | 描述                        |
|:---------|:-------|:-----|:--------------------------|
| `sort`   | String | 否  | 搜索结果的排序方式：<br/> - `asc`：按创建时间正序；<br/> - （默认）`desc`：按创建时间倒序。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数     | 类型   | 是否必需 | 描述                   |
| :------- | :----- | :------------------------ | :------- |
| `limit`  | Int |  否  |每次期望返回的子区数量。该参数仅在分页获取时为必需。   |
| `cursor` | String | 否   | 分页获取时，数据查询的起始位置。该参数仅在分页获取时为必需。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述         |
|:------|:----------|:-----------|
| `entities.id`  | String | 子区 ID。 |
| `properties.cursor`  | String  | 分页页码。下一次服务器会从游标起始的地方进行查询。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET http://XXXX/XXXX/XXXX/thread -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "get",
    "applicationName": "testapp",
    "duration": 7,
    "entities": [
        {
            "id": "1XXXX8"
        }
    ],
    "organization": "XXXX",
    "properties": {
        "cursor": "ZGXXXXTE"
    },
    "timestamp": 1650869750247,
    "uri": "http://XXXX/XXXX/XXXX/thread"
}
```

### 获取一个用户加入的所有子区(分页获取)

根据用户 ID 获取该用户加入的子区列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/threads/user/{username}?limit={limit}&cursor={cursor}&sort={sort}
```

##### 路径参数

| 参数       | 类型     | 是否必需 | 描述                        |
|:---------|:-------|:-----|:--------------------------|
| `sort`   | String | 否  | 搜索结果的排序方式：<br/> - `asc`：按创建时间正序；<br/> - （默认）`desc`：按创建时间倒序。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数     | 类型   | 是否必需 | 描述                                                         |
| :------- | :----- | :------- | :----------------------------------------------------------- |
| `cursor` | String | 否   | 游标，数据查询的起始位置。该参数仅在分页获取时为必需。 |
| `limit`  | Int |  否  |每次期望返回的子区数量。 该参数仅在分页获取时为必需。  |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型  | 描述             |
|:---------|:----------|:---------------|
| `entities.name`  | String  |子区名称。      |
| `entities.owner`  | String |子区创建者的用户 ID。    |
| `entities.id`    | String  |子区 ID。     |
| `entities.msgId`  | String |子区的父消息 ID。 |
| `entities.groupId` | String |子区所属群组 ID。  |
| `entities.created` | Long |子区创建时间，Unix 时间戳。    |
| `properties.cursor`  | String  | 游标。下一次服务器会从游标起始的地方进行查询。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET http://XXXX/XXXX/XXXX/threads/user/test4 -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "get",
    "applicationName": "testapp",
    "duration": 4,
    "entities": [
        {
            "name": "1",
            "owner": "test4",
            "id": "17XXXX69",
            "msgId": "1920",
            "groupId": "17XXXX61",
            "created": 1650856033420
        }
    ],
    "organization": "XXXX",
    "properties": {
        "cursor": "ZGXXXXzg"
    },
    "timestamp": 1650869972109,
    "uri": "http://XXXX/XXXX/XXXX/threads/user/test4"
}
```

### 获取一个用户某个群组下加入的所有子区 (分页获取)

根据用户 ID 获取该用户在某个群组下加入的子区列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/threads/chatgroups/{group_id}/user/{username}?limit={limit}&cursor={cursor}&sort={sort}
```

##### 路径参数

| 参数       | 类型     | 是否必需 | 描述                        |
|:---------|:-------|:-----|:--------------------------|
| `sort`   | String | 否  | 搜索结果的排序方式：<br/> - `asc`：按创建时间正序；<br/> - （默认）`desc`：按创建时间倒序。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数     | 类型   | 是否必需 | 描述                                                         |
| :------- | :----- | :------- | :----------------------------------------------------------- |
| `cursor` | String | 否   |游标，数据查询的起始位置。该参数仅在分页获取时为必需。 |
| `limit`  | Int |  否  |每次期望返回的子区数量。 该参数仅在分页获取时为必需。  |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                | 描述   | 描述                                           |
| :------------------ | :----- | :--------------------------------------------- |
| `entities.name`   | String |子区名字。      |
| `entities.owner`  | String |子区创建者。    |
| `entities.id`     | String |子区 ID。     |
| `entities.msgId`   | String |子区的父消息 ID。 |
| `entities.groupId` | String |子区所属群组 ID。  |
| `entities.created` | Long  |子区创建时间。    |
| `properties.cursor`  | String  | 游标。下一次服务器会从游标起始的地方进行查询。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET http://XXXX/XXXX/XXXX/threads/chatgroups/XXXX/user/XXXX -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "get",
    "applicationName": "testapp",
    "duration": 4,
    "entities": [
        {
            "name": "1",
            "owner": "test4",
            "id": "17XXXX69",
            "msgId": "1920",
            "groupId": "17XXXX61",
            "created": 1650856033420
        }
    ],
    "organization": "XXXX",
    "properties": {
        "cursor": "ZGXXXXNzg"
    },
    "timestamp": 1650869972109,
    "uri": "http://XXXX/XXXX/XXXX/threads/user/test4"
}
```

### 创建子区

创建子区。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/thread
```

##### 路径参数

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数             | 类型    | 是否必需 | 备注                |
|:---------------| :------ | :------- |:------------------|
| `group_id`     | String  | 是     |子区所在的群组 ID。             |
| `name`         | String  | 是     |子区的名称，最大长度为 64 字符。 |
| `msg_id`       | String  | 是     |子区所在的消息 ID。         |
| `owner`        | String  | 是     |子区的所有者，即创建子区的成员。     |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型      | 描述           |
| :------- |:----|:---------------|
| `data.thread_id` | String | 创建的子区 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST http://XXXX/XXXX/XXXX/thread -H 'Authorization: Bearer <YourToken> ' -d '{
    "group_id": 179800091197441,
    "name": "1",
    "owner": "test4",
    "msg_id": 1234
}'
```

##### 响应示例

```json
{
    "action": "post",
    "applicationName": "testapp",
    "duration": 4,
    "data": {
        "thread_id": "1XXXX7"
    }
    "organization": "XXXX",
    "timestamp": 1650869972109,
    "uri": "http://XXXX/XXXX/XXXX/thread"
}
```

### 修改子区

修改指定子区。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/thread/{thread_id}
```

##### 路径参数

| 参数          | 类型     | 是否必需 | 描述         |
|:------------|:-------|:-----|:-----------|
| `thread_id` | String | 是   |子区 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数             | 类型    | 是否必需 | 描述                  |
|:---------------| :------ | :------- |:---------------------|
| `name`         | String  | 是     | 要修改的子区的名称，最大长度为 64 字符。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型         | 描述      |
|:-----|:-------|:--------|
| `data.name` | String | 修改后的名称。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X PUT http://XXXX/XXXX/XXXX/thread/1XXXX7 -H 'Authorization: Bearer <YourToken> ' -d '{"name": "test4"}'
```

##### 响应示例

```json
{
    "action": "put",
    "applicationName": "testapp",
    "duration": 4,
    "data": {
        "name": "test4"
    }
    "organization": "XXXX",
    "timestamp": 1650869972109,
    "uri": "http://XXXX/XXXX/XXXX/thread"
}
```

### 删除子区

删除指定子区。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/thread/{thread_id}
```

##### 路径参数

| 参数          | 类型     | 是否必需 | 描述         |
|:------------|:-------|:-----|:-----------|
| `thread_id` | String | 是   |子区 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   |  类型     | 描述      |
|:------|:--------|:--------|
| `entities.status` | Bool | 删除结果，`ok` 表示已删除。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE http://XXXX/XXXX/XXXX/thread/1XXXX7 -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "delete",
    "applicationName": "testapp",
    "duration": 4,
    "data": {
        "status": "ok"
    },
    "organization": "XXXX",
    "timestamp": 1650869972109,
    "uri": "http://XXXX/XXXX/XXXX/thread"
}
```

## 管理子区成员

环信即时通讯 IM 提供多个接口完成子区成员的管理，包括对子区的加入和踢出等管理功能。

### 查询子区成员(分页)

查询子区成员。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/thread/{thread_id}/users?limit={N}&cursor={cursor}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `cursor` | String | 否   | 数据查询的起始位置。该参数仅在分页获取时为必需。 |
| `limit`  | Int |  否  |每次期望返回的子区成员数量。 该参数仅在分页获取时为必需。  |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型 | 描述             |
|:-------|:--------|:--------------|
| `affiliations` | Array | Thread 成员用户 ID 列表。 |
| `properties.cursor`  | String  | 游标，下一次服务器会从游标起始的地方进行查询。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET http://XXXX/XXXX/XXXX/thread/1XXXX7/users -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "get",
    "data": {
        "affiliations": [
            "test4"
        ]
    },
    "duration": 4,
    "properties": {
        "cursor": "ZGNXXXXyMA"
    },
    "timestamp": 1650872048366,
    "uri": "http://XXXX/XXXX/XXXX/thread/1XXXX8/users"
}
```

### 批量加入子区

批量加入子区成员。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/thread/{thread_id}/users
```

##### 路径参数

| 参数          | 类型     | 是否必需 | 描述         |
|:------------|:-------|:-----|:-----------|
| `thread_id` | String | 是   |子区 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数          | 类型   | 是否必需 | 备注             |
|:------------|:-----|:-----|:---------------|
| `usernames` | List | 是   | 批量加入子区的用户 ID 列表。每次调用最多可加入 10 个成员。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，字段及描述详见 [公共参数](#公共参数)。

| 字段   |  类型     | 描述      |
|:------|:--------|:--------|
| `entities.status` | Bool | 删除结果，`ok` 表示已删除。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST http://XXXX/XXXX/XXXX/thread/1XXXX7/users -d '{
"usernames": [
"test2",
"test3"
]
}' -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "post",
    "applicationName": "testapp",
    "data": {
        "status": "ok"
    },
    "duration": 1069,
    "organization": "XXXX",
    "timestamp": 1650872649160,
    "uri": "http://XXXX/XXXX/XXXX/thread/1XXXX8/joined_thread"
}
```

### 批量踢出子区成员

批量踢出子区成员。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/threads/{thread_id}/users
```

##### 路径参数

| 参数          | 类型     | 是否必需 | 描述         |
|:------------|:-------|:-----|:-----------|
| `thread_id` | String | 是   |子区 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

##### 请求 body

| 参数          | 类型   | 是否必需 | 备注             |
|:------------|:-----|:-----|:---------------|
| `usernames` | List | 是   | 批量踢出子区的用户 ID 列表。每次调用最多可踢出 10 个成员。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型   | 描述      |
|:-------|:-------|:-------|
| `result`| Bool | 操作结果。<br/> - `true`：成功；<br/> - `false`：失败。 |
| `user` | String | 被踢出用户的 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE http://XXXX/XXXX/XXXX/thread/1XXXX7/users -H 'Authorization: Bearer <YourToken> '
```

##### 响应示例

```json
{
    "action": "delete",
    "applicationName": "testy",
    "duration": 12412,
    "entities": [
        {
            "result": false,
            "user": "test2"
        },
        {
            "result": false,
            "user": "test6"
        }
    ],
    "organization": "XXXX",
    "timestamp": 1650874050419,
    "uri": "http://XXXX/XXXX/XXXX/thread/1XXXX8/users"
}
```