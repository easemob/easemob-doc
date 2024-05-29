# 修改文本或自定义消息

本文展示如何调用环信 IM RESTful API 在服务端修改发送成功的文本消息或自定义消息。

**调用频率**：100 次/秒/App Key

:::tip
若使用该功能，需联系环信商务开通。
:::

## 前提条件

要调用环信即时通讯 REST API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文涉及的所有消息管理 REST API 都需要使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/messages/rewrite/{msg_id}
```

### 路径参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `msg_id` | String| 是 | 要修改的消息的 ID。|

### 请求 header

| 参数       | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### 请求 body

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :--------------- |
| `user`| String | 否 | 修改消息的用户。|
| `new_msg` | JSON | 是 | 修改后的消息。|
| `new_msg.type` | String | 是 | 修改的消息类型：<br/> - `txt`：文本消息；<br/> - `custom`：自定义消息。|
| `new_msg.msg` | String | 是 | 修改后的消息内容。**该字段只对文本消息生效。**|
| `new_msg.customEvent` | String | 否      | 用户自定义的事件类型。该参数的值必须满足正则表达式 `[a-zA-Z0-9-_/\.]{1,32}`，长度为 1-32 个字符。**该字段只对自定义消息生效。**  |
| `new_msg.customExts`  | JSON   | 否       | 用户自定义的事件属性，类型必须是 `Map<String,String>`，最多可以包含 16 个元素。**该字段只对自定义消息生效。** |
| `new_ext` | JSON | 否 | 修改后的消息扩展信息。**该字段只对自定义消息生效。**|
| `is_combine_ext` | Boolean | 否 | 修改后的消息扩展信息与原有扩展信息是合并还是替换。<br/> - （默认）`true`：合并；<br/> - `false`：替换。|

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 包含如下字段：

| 参数              | 类型   | 描述          |
| :---------------- | :----- | :------------------------------- |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。      |
| `uri`             | String | 请求 URL。     |
| `timestamp`       | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。  |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `action`          | String | 请求方法。     |
| `data` | String | 值为 `success`，表示消息成功修改。| 
| `duration`        | Int    | 从发送 HTTP 请求到响应的时长，单位为毫秒。 |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败，常见的异常类型如下表所示。

| 异常类型 |  HTTP 状态码  | 错误信息     | 错误描述    |
| :-------- | :----- | :------ |:----- |
| `UnsupportedMessageTypeException` | 400  | The message is of a type that is currently not supported for modification.  | 不支持修改的消息类型。目前只支持修改文本消息和自定义消息。   |
| `InvalidMessageIdException`  | 400   | The provided message ID is not a valid number.  | 消息 ID 必须是数字。  |
| `RewriteMessageNotAuthorizedException` | 401  | You are not authorized to edit this message.  | 修改的消息 ID 不属于当前app。   |
| `EditLimitExceededException` | 403  | The message has reached its edit limit and cannot be modified further.  | 当前消息修改次数达到上限。目前，每条消息最多可修改 10 次。    | 
| `EditFeatureNotEnabledException`  | 403   | The edit message feature is not enabled for this user or system.   | 消息修改功能未开通。使用该功能前，你需要联系环信商务开通。   | 
| `MessageUnavailableException`  | 404  | The message is unavailable or has expired.   | 修改的消息不存在或者已经过期。   |
| `RewriteMessageInternalErrorException` | 500  | An unknown error occurred while processing the request.   | 内部服务异常，修改消息失败。   |

关于其他异常，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 示例

### 请求示例

- 修改发送成功的文本消息：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -i 'https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "user": "user1",
  "new_msg": { 
    "type": "txt",
    "msg": "update message content"
  },
}'
```

- 修改发送成功的自定义消息：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -i 'https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "user": "user1",
  "new_msg": { 
    "type": "custom",
    "customEvent": "custom_event",
    "customExts":{
      "ext_key1":"ext_value1"
    }
  },
  "new_ext": { 
    "key": "value",
    "old_key": "new_value"
  },
  "is_combine_ext": true
}'
```

### 响应示例

```json
{
  "path": "/messages/rewrite/1235807318835202004",
  "uri": "https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004",
  "timestamp": 1705372388118,
  "organization": "XXXX",
  "application": "ff678832-XXXX-XXXX-8130-58ac38cb6c15",
  "action": "put",
  "data": "success",
  "duration": 49,
  "applicationName": "XXXX"
}
```



