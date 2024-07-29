# 删除漫游消息

本文介绍如何根据消息 ID 单向删除单聊和群聊的漫游消息以及如何单向清空环信服务端的漫游消息，包含以下五个 REST API：

- [根据消息 ID 单向删除单聊漫游消息](#根据消息-id-单向删除单聊漫游消息)
- [根据消息 ID 单向删除群聊漫游消息](#根据消息-id-单向删除群聊漫游消息)
- [单向清空指定用户的漫游消息](#单向清空指定用户的漫游消息)
- [单向清空单聊会话某个时间点及之前的漫游消息](#单向清空单聊会话某个时间点及之前的漫游消息)
- [单向清空群组或聊天室会话某个时间点及之前的漫游消息](#单向清空群组或聊天室会话某个时间点及之前的漫游消息)

## 前提条件

要调用环信即时通讯 REST API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 根据消息 ID 单向删除单聊漫游消息

根据消息 ID 单向删除指定用户的单聊会话的一条或多条漫游消息。

调用该接口后，该用户的指定漫游消息会从服务器和本地删除，该用户无法从环信服务端拉取到这些消息。若该会话的全部漫游消息均被删除了，该用户的这个会话在服务端也会被清除，拉取会话列表时拉不到该会话。不过，其他用户不受影响，仍然可以拉取与该用户的漫游消息和会话。

**调用频率上限**：100 次/秒/App Key

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/chat/user/{userId}?userId={userId}&msgIdList={msgIdList}
```

#### 路径参数

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `userId`  | String | 是       | 要删除的单聊漫游消息的所属用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数      | 类型     | 是否必需 | 描述       |
|:--------|:-------|:-----|:-------------------|
| `userId` | String | 是    | 单聊会话中的对端用户 ID。     |
| `msgIdList` | String | 是    | 要删除的消息的消息 ID。每次最多可传入 50 个消息 ID，消息 ID 之间以英文逗号分隔，例如 message ID 1,message ID 2。 |

#### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述     |
| :-------------- | :----- | :----------------- | :-------------------- |
| `Content-Type`  | String | 是                                       | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是                                       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是                                       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述         |
|:-------------------------|:-------|:-----------|
| `requestStatusCode`      | String | 返回 `ok` 表示消息成功删除。 |
| `timestamp`          | Number | HTTP 响应的 Unix 时间戳，单位为毫秒。    |

关于其他字段及描述，详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X DELETE 'https://XXXX/XXXX/XXXX/rest/message/roaming/chat/user/XXXX?userId=XXXX&msgIdList=XXXX' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
```

#### 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1710309184114
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型      | 错误提示                                          | 可能原因            | 处理建议           |
|:---------|:-------------------|:----------------------------------------------|:----------------|:---------------|
| 400      | service open exception  | this appKey not open message roaming   | 消息漫游服务未开通。  | 联系商务开通。  |
| 400      | param exception  | delete msg list limit can not greater than 50 | 一次删除的消息 ID 数量超过限制（50）。 | 减少一次删除的消息 ID 数量。 |
| 400      | Bad Request  | Bad Request    | 缺少必填参数，例如查询参数 `userId` 或 `msgIdList`。 | 校验参数是否传入正确。  |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 根据消息 ID 单向删除群聊漫游消息

根据消息 ID 单向删除指定用户的某个群聊会话的一条或多条漫游消息。

调用该接口后，该用户的指定漫游消息会从服务器和本地删除，该用户无法从环信服务端拉取到这些消息。若删除了该群聊会话的全部漫游消息，该用户的这个会话在服务端也会被清除，拉取会话列表时拉不到该会话。不过，其他用户不受影响，仍然可以拉取这些漫游消息和会话。

**调用频率上限**：100 次/秒/App Key

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/group/user/{userId}?groupId={groupId}&msgIdList={msgIdList}
```

#### 路径参数

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `userId`  | String | 是       | 要删除的群聊漫游消息的所属用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求参数

| 参数      | 类型     | 是否必需 | 描述                                    |
|:--------|:-------|:-----|:----------------------|
| `groupId` | String | 是    | 群组 ID。                                 |
| `msgIdList` | String | 是    | 要删除的消息的消息 ID。每次最多可传入 50 个消息 ID，消息 ID 之间以英文逗号分隔，例如 message ID 1,message ID 2。 |

#### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述            |
| :-------------- | :----- | :--------------------------------------- | :-------------------- |
| `Content-Type`  | String | 是                                       | 内容类型。请填 `application/json`。   |
| `Accept`        | String | 是                                       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是                                       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述         |
|:-------------------------|:-------|:-----------|
| `requestStatusCode`      | String | 返回 `ok` 表示消息成功删除。 |
| `timestamp`          | Number | HTTP 响应的 Unix 时间戳，单位为毫秒。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X DELETE 'https://XXXX/XXXX/XXXX/rest/message/roaming/group/user/XXXX?groupId=XXXX&msgIdList=XXXX' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
```

#### 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1710309184114
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型     | 错误提示     | 可能原因    | 处理建议   |
|:---------|:----------|:-----------------------|:--------|:--------------|
| 400   | service open exception    | this appKey not open message roaming | 消息漫游服务未开通。 | 联系商务开通。 |
| 400      | param exception         | delete msg list limit can not greater than 50 | 一次删除的消息 ID 数量超过限制（50）。 | 减少一次删除的消息 ID 数量。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 单向清空指定用户的漫游消息

清空指定用户当前时间及之前的所有漫游消息。

调用该接口后，该用户的漫游消息会从服务器和本地清空，该用户无法从服务端拉取到漫游消息，而且该用户的所有会话也会被清除，也拉不到会话列表。不过，其他用户不受影响，仍然可以拉取与该用户的漫游消息和会话。

**调用频率上限**：100 次/秒/App Key

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/rest/message/roaming/user/{userId}/delete/all
```

#### 路径参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------- |
| `userId`  | String | 是       | 要清空的漫游消息的所属用户 ID。 |

#### 请求 header

| 参数       | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述         |
|:-------------------------|:-------|:-----------|
| `requestStatusCode`      | String | 操作结果，返回 `ok` 表示该用户的漫游消息清除成功。 |
| `timestamp`          | Long | HTTP 响应的 Unix 时间戳，单位为毫秒。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X POST 'https://XXXX/XXXX/XXXX/rest/message/roaming/user/XXXX/delete/all' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: Content-Type: application/json' \
-H 'Accept: Accept: application/json'
```

#### 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1710309184114
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示       | 可能原因    | 处理建议       |
|:---------|:-----------|:--------------|:--------------|:----------------------|
| 400      | service open exception    | this appKey not open message roaming    | 消息漫游服务未开通。 | 联系商务开通。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 单向清空单聊会话某个时间点及之前的漫游消息

你可以调用该 RESTful API 清空指定用户的某个单聊会话在某个时间点及之前的漫游消息。

调用该接口后，该用户的漫游消息会从服务器和本地清空，该用户无法从环信服务端拉取到这些漫游消息。若清除了该会话的全部漫游消息，该用户的这个会话在服务端也会被清除，拉取会话列表时拉不到该会话。不过，其他用户不受影响，仍然可以拉取与该用户的漫游消息和会话。

**调用频率上限**：100 次/秒/App Key

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/chat/user/{userId}/time?userId={userId}&delTime={delTime}
```

#### 路径参数

| 参数        | 类型   | 是否必需 | 描述           |
| :--------- | :----- | :------- |:-------------|
| `userId`  | String | 是       | 要清空的单聊漫游消息的所属用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数      | 类型     | 是否必需 | 描述                                    |
|:--------|:-------|:-----|:----------------------|
| `userId` | String | 是       | 单聊会话中的对端用户，即要清空和哪个用户之间的漫游消息。需传入该用户 ID。  |
| `delTime`  | Long | 是       | 要清空哪个时间点及之前的单聊漫游消息。该时间为 Unix 时间戳，单位为毫秒。 |

#### 请求 header

| 参数       | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述         |
|:-------------------------|:-------|:-----------|
| `requestStatusCode`      | String | 操作结果，返回 `ok` 表示漫游消息清除成功。 |
| `timestamp`          | Number | HTTP 响应的 Unix 时间戳，单位为毫秒。  |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X DELETE 'http://XXXX/XXXX/XXXX/rest/message/roaming/chat/user/XXXX/time?userId=XXXX&delTime=1659014868000' \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1710309184114
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示       | 可能原因    | 处理建议       |
|:---------|:-------------------|:--------------|:--------------|:----------------------|
| 400      | service open exception    | this appKey not open message roaming    | 消息漫游服务未开通。 | 联系商务开通。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 单向清空群组或聊天室会话某个时间点及之前的漫游消息

你可以调用该 RESTful API 清空指定用户的某个群组或聊天室会话在某个时间点及之前的的漫游消息。

调用该接口后，该用户的漫游消息会从服务器和本地清空，该用户无法从环信服务端拉取到这些漫游消息。若清除了该会话的全部漫游消息，该用户的这个会话在服务端也会被清除，拉取会话列表时拉不到该会话。不过，其他用户不受影响，仍然可以拉取这些漫游消息和会话。

**调用频率上限**：100 次/秒/App Key

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/group/user/{userId}/time?groupId={groupId}&delTime={delTime}
```

#### 路径参数

| 参数        | 类型   | 是否必需 | 描述           |
| :--------- | :----- | :------- |:-------------|
| `userId`  | String | 是   | 要清空的漫游消息的所属用户 ID。  |

其他参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数      | 类型     | 是否必需 | 描述                                    |
|:--------|:-------|:-----|:----------------------|
| `groupId` | String  | 是    | 要清空哪个群组或聊天室的漫游消息。你可以传入群组 ID 或聊天室 ID。|
| `delTime` | Long  | 是    | 要清空哪个时间点及之前的群组或聊天室的漫游消息。该时间为 Unix 时间戳，单位为毫秒。 |

#### 请求 header

| 参数       | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述         |
|:-------------------------|:-------|:-----------|
| `requestStatusCode`      | String | 操作结果，返回 `ok` 表示漫游消息清除成功。 |
| `timestamp`          | Number | HTTP 响应的 Unix 时间戳，单位为毫秒。    |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X DELETE 'http://XXXX/XXXX/XXXX/rest/message/roaming/group/user/XXXX/time?groupId=XXXX&delTime=1659014868000' \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1710309184114
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示       | 可能原因    | 处理建议       |
|:---------|:-------------------|:--------------|:--------------|:----------------------|
| 400      | service open exception    | this appKey not open message roaming    | 消息漫游服务未开通。 | 联系商务开通。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。