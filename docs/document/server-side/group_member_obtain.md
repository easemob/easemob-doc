# 获取群组成员列表

<Toc />

环信即时通讯 IM 提供 RESTful API 接口用于分页获取群组成员列表。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯 IM 管理后台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。
- 群成员的相关限制，详见 [使用限制](limitation.html#群组)。

## 群组角色 

群组角色包含群主、群管理员和普通群成员，三个角色权限范围依次递减。

- 群主拥有群的所有权限；
- 群管理员拥有管理黑名单、白名单和禁言等权限；
- 群主加管理员数量共 100 个，即管理员最多可添加 99 个。

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 分页获取群成员列表

### 功能说明

可以分页获取群组成员列表。

**调用频率上限**：100 次/秒/App Key   

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users?pagenum={N}&pagesize={N}&joined_time={true/false}
```

#### 路径参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `group_id` | String | 是       | 群组 ID。    |

#### 查询参数

| 参数       | 类型 | 是否必需 | 描述            |
| :--------- | :--- | :------- | :------------------- |
| `pagenum`  | Int  | 否       | 当前页码。默认从第 1 页开始获取。                           |
| `pagesize` | Int  | 否       | 每页期望返回的群组成员数量。取值范围为 [1,1000]。默认为 `1000`。若传入的值大于 `1000`，则获取 1000 个群组成员。 |
| `joined_time` | Bool  | 否       | 是否需返回用户加入群组的时间：<br/> - `true`：返回 <br/> - （默认）`false`：不返回 |

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                        |
| :------------ | :----- | :------------------------------------------ |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `params`        | JSON | 查询参数。  |
|  - `joined_time` | Bool  | 是否返回用户加入群组的时间：<br/> - `true`：返回 <br/> - `false`：不返回 |
|  - `pagesize`        | Array | 每页期望显示的群组成员数量。  |
|  - `pagenum`        | Array | 当前页码。  |
| `uri`                | String | 请求 URL。   |
| `entities`           | JSON   | 响应实体。  |
| `data` | JSON Array | 群组成员信息。  |
| `data.owner`  | String | 群主的用户 ID。例如：{“owner”: “user1”}。   |
| `data.member`  | String | 群组管理员和普通成员的用户 ID。例如：{“member”: “user3”}。   |
| `data.joined_time` | String | 加入群组的时间。 |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。   |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长，单位为毫秒。     |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。      |
| `applicationName`    | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。   |
| `count` | Int | 本次调用实际获取的群成员数量。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET HTTP://XXXX/XXXX/XXXX/chatgroups/10XXXX85/users?pagesize=1000&pagenum=1&joined_time=true'   \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
  "action": "get",
  "application": "cc7380d5-XXXX-XXXX-a93e-51d6d590b475",
  "params": {
    "joined_time": [
        "true"
    ],
    "pagesize": ["2"],
    "pagenum": ["2"]
  },
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/10XXXX85/users",
  "entities": [],
  "data": [
    {
          "owner": "user1",
          "joined_time": 1732524850107
    },
    {
          "member": "user2",
          "joined_time": 173252433456
    }
  ],
  "timestamp": 1489074511416,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp",
  "count": 2
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | do not find this group:XX | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。