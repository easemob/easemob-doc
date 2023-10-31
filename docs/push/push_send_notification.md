# 发送推送通知

利用 REST 接口可通过以下三种方式使用即时推送服务：
- 使用单接口批量发送推送通知。
- 通过接口组合发送推送通知，即先创建推送通知，然后创建全量推送任务或者创建列表推送任务。
- 通过推送标签发送推送通知。

**注意：推送任务最多 3 个同时进行，否则接口调用时会报错！**

**全量推送和列表推送均会创建任务，而推送任务的创建是有时间限制的，推送任务数限制如下：**
- 五分钟内限制创建任务数为 3，可配置；5 分钟内最多可创建 3 个任务。如果超过该任务数，请联系商务。
- 全量推送创建任务后，限制数增加1，未开始执行的也记录；
- 标签/列表推送创建任务后，限制数加1，执行完成后，限制数减1；
- 所有限制均为 5 分钟，后续可以继续创建。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述                                                |
| :--------- | :----- | :------- | :-------------------------------------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。  |
| `username` | String | 是       | 用户 ID。                                           |

### 响应参数

| 参数        | 类型 | 描述|
| :---------- | :--- |:--- |
| `timestamp` | Long | Unix 时间戳，单位为毫秒。 |
| `duration`  | Int  | 从发送请求到响应的时长，单位为毫秒。|

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 Authorization 字段：

Authorization：`Bearer ${YourAppToken}`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 app token 鉴权](/document/server-side/easemob_app_token.html)。

## 以同步方式发送推送通知

调用该接口以同步方式推送消息时，环信或第三方推送厂商在推送消息后，会将推送结果发送给环信服务器。服务器根据收到的推送结果判断推送状态。

该接口调用频率默认为 1 次/秒。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/push/sync/{target}
```

#### 路径参数

| 参数     | 类型   | 描述                    | 是否必需 |
| :------- | :----- | :---------------------- | :------- |
| `target` | String | 接收推送通知的用户 ID。 | 是       |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型：`application/json`                                 | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

#### 请求 body

| 字段          | 类型 | 描述                                                         | 是否必需 |
| :------------ | :--- | :----------------------------------------------------------- | :------- |
| `strategy`    | Int  | 推送策略：<br/> -`0`：第三方厂商通道优先，失败时走环信通道。<br/> - `1`：只走环信通道：若用户在线，则直接推送；若用户离线，消息会保留一段时间（视购买的套餐包而定），等用户上线后向其推送消息。若用户在超过消息存储期限时仍为上线，则丢弃消息。<br/> -（默认）`2`：只走第三方厂商通道：若用户离线，消息保留时间视不同厂商而定。若推送失败，直接丢弃推送消息。<br/> - `3`：在线走环信通道，离线走第三方厂商通道。如果厂商推送失败，则等待用户上线后通过环信通道下发。<br/> - `4`：只走环信通道且只推在线用户。离线用户收不到推送通知。 | 否       |
| `pushMessage` | JSON | 推送通知。关于通知内容，请查看 [配置推送通知](push_notification_config.html)。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                         |
| :---------------- | :----- | :----------------------------------------------------------- |
| `data`            | Object | 推送结果。服务器根据推送结果判断推送状态。                   |
| `data.pushStatus` | String | 推送状态：<br/> - `SUCCESS`：推送成功；<br/> - `FAIL`：推送失败，即非服务端导致的错误，例如 `bad device token`，表示移动端传给服务端的 device token 错误，对应推送厂商不接受。<br/> - `ERROR`：推送异常，即服务端导致错误，例如连接超时或读写超时。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](/document/server-side/error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'http://XXXX/XXXX/XXXX/push/sync/test1' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "strategy": 3,
    "pushMessage": {
        "title": "环信推送",
        "content": "你好，欢迎使用环信推送服务",
        "sub_title": "环信",
      }
}'
```

#### 响应示例

1. 推送成功的示例如下：

```json
{
    "timestamp": 1689154498019,
    "data": [
       {
            "pushStatus": "SUCCESS",
            "data": {
                "code": 200,
                "data": {
                    "expireTokens": [],
                    "sendResult": true,
                    "requestId": "104410638-fd96648b6bb4344bc4f5e29b158fdb07",
                    "failTokens": [],
                    "msgCode": 200
               },
                "message": "Success"
           }
       }
   ],
    "duration": 2
}
```

2. 因未绑定推送信息导致推送失败的响应示例：

```json
{
    "timestamp": 1689154624797,
    "data": [
       {
            "pushStatus": "FAIL",
            "desc": "no push binding"
       }
   ],
    "duration": 0
}
```

3. 因接收推送通知的用户 ID 不存在导致推送失败的响应示例：

```json
{
    "timestamp": 1689154534352,
    "data": [
       {
            "pushStatus": "FAIL",
            "desc": "appUser not exists"
       }
   ],
    "duration": 0
}
```

## 以异步方式批量发送推送通知

调用该接口以异步方式为指定的单个或多个用户进行消息推送。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/push/single
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数     | 类型   | 描述       | 是否必需 |
| :-------------- | :----- | :------------------ | :------- |
| `Content-Type`  | String | 内容类型：`application/json`     | 是    |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

#### 请求 body

| 字段      | 类型 | 描述           | 是否必需 |
| :------------ | :--- | :------------------------ | :------- |
| `targets`     | List | 推送的目标用户 ID。最多可传 100 个。      | 是       |
| `strategy`    | Int  | 推送策略：<br/> -`0`：第三方厂商通道优先，失败时走环信通道。<br/> - `1`：只走环信通道：若用户在线，则直接推送；若用户离线，消息会保留一段时间（视购买的套餐包而定），等用户上线后向其推送消息。若用户在超过消息存储期限时仍为上线，则丢弃消息。<br/> -（默认）`2`：只走第三方厂商通道：若用户离线，消息保留时间视不同厂商而定。若推送失败，直接丢弃推送消息。<br/> - `3`：在线走环信通道，离线走第三方厂商通道。如果厂商推送失败，则等待用户上线后通过环信通道下发。<br/> - `4`：只走环信通道且只推在线用户。离线用户收不到推送通知。 | 否       |
| `pushMessage` | JSON | 推送通知。关于通知内容，请查看 [配置推送通知](push_notification_config.html)。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段         | 类型   | 描述                                     |
| :----------- | :----- | :--------------------------------------- |
| `data`       | Object | 异步推送的结果，即成功或失败。           |
| `id`         | String | 推送的目标用户 ID。                      |
| `pushStatus` | String | 推送状态：`ASYNC_SUCCESS` 表示推送成功。 |
| `desc`       | String | 推送结果的相关描述。                     |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](/document/server-side/error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'http://localhost:8099/easemob-demo/testy/push/single' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json'  \
-d '{
    "targets": [
        "test2"
    ],
    "pushMessage": {
        "title": "Hello",
        "subTitle": "Hello",
        "content": "Hello",
        "vivo": {
 
        }
    }
}'
```

#### 响应示例

```json
{
    "timestamp": 1619506344007,
    "data": [
        {
            "id": "test2",
            "pushStatus": "ASYNC_SUCCESS",
            "desc": "async success."
        }
    ],
    "duration": 14
}
```

## 使用标签推送接口发送推送通知

向单个标签内的所有用户推送通知。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/push/list/label
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型：`application/json`                                 | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

#### 请求 body

| 字段          | 类型 | 描述                                                         | 是否必需 |
| :------------ | :--- | :----------------------------------------------------------- | :------- |
| `targets`     | List | 标签名称。只支持传入单个标签名称。                           | 是       |
| `strategy`    | Int  | 推送策略：<br/> -`0`：第三方厂商通道优先，失败时走环信通道。<br/> - `1`：只走环信通道：若用户在线，则直接推送；若用户离线，消息会保留一段时间（视购买的套餐包而定），等用户上线后向其推送消息。若用户在超过消息存储期限时仍为上线，则丢弃消息。<br/> -（默认）`2`：只走第三方厂商通道：若用户离线，消息保留时间视不同厂商而定。若推送失败，直接丢弃推送消息。<br/> - `3`：在线走环信通道，离线走第三方厂商通道。如果厂商推送失败，则等待用户上线后通过环信通道下发。<br/> - `4`：只走环信通道且只推在线用户。离线用户收不到推送通知。 | 否       |
| `pushMessage` | JSON | 推送通知。关于通知的内容，请参考[配置推送通知](push_notification_config.html)。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述           |
| :------- | :----- | :------------- |
| `data`   | Object | 推送任务数据。 |
| `taskId` | Long   | 推送任务 ID。  |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](/document/server-side/error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X POST 'http://a1.easemob.com/easemob/easeim/push/list/label' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "targets": [
        "post-90s"
    ],
    "strategy": 2,
    "pushMessage": {
        "title": "Easemob PUSH",
        "content": "Welcome to Easemob Push Service",
        "sub_title": "Easemob"
    }
}'
```

#### 响应示例

```json
{
    "timestamp": 1650859482843,
    "data": {
        "taskId": 968120369184112182
    },
    "duration": 0
}
```

## 创建全量推送任务

每次调用该接口，服务端会创建一个推送任务，生成推送任务 ID，用于推送任务的数据统计。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/push/task
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数    | 类型   | 描述                 | 是否必需 |
| :-------------- | :----- | :----------------------- | :------- |
| `Content-Type`  | String | 内容类型：`application/json`。         | 是  |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

#### 请求 body

| 字段          | 是否必需 | 类型    | 备注           |
| :------------ | :------- | :------ | :----------- |
| `strategy`    | 否  | integer | 推送策略：<br/> -`0`：第三方厂商通道优先，失败时走环信通道。<br/> - `1`：只走环信通道：若用户在线，则直接推送；若用户离线，消息会保留一段时间（视购买的套餐包而定），等用户上线后向其推送消息。若用户在超过消息存储期限时仍为上线，则丢弃消息。<br/> -（默认）`2`：只走第三方厂商通道：若用户离线，消息保留时间视不同厂商而定。若推送失败，直接丢弃推送消息。<br/> - `3`：在线走环信通道，离线走第三方厂商通道。如果厂商推送失败，则等待用户上线后通过环信通道下发。<br/> - `4`：只走环信通道且只推在线用户。离线用户收不到推送通知。|
| `pushMessage` | 是     | JSON    | 推送通知。                                                   |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型 | 说明       |
| :----- | :--- | :--------------- |
| `data` | Long | 推送任务 ID（后续相关推送结果都是基于任务的，需要保存）。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](/document/server-side/error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'http://localhost:8099/easemob-demo/testy/push/task' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
    "pushMessage": {
        "title": "Hello1234",
        "subTitle": "Hello",
        "content": "Hello",
        "vivo": {}
    }
}'
```

#### 响应示例

```json
{
    "timestamp": 1618817591755,
    "data": 833726937301309957,
    "duration": 1
}
```

## 通过接口组合发送全量推送通知

通过接口组合发送全量推送，应按照如下流程：

1. 创建推送通知；
2. 创建全量推送任务或者创建列表推送任务。

### 创建推送通知

创建推送通知并记录返回结果中的推送通知 ID，创建推送任务需要携带推送通知 ID。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/push/message
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型：`application/json`                                 | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

##### 请求 body

关于消息内容，请查看 [配置推送通知](push_notification_config.html)。

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型 | 说明                                                         |
| :----- | :--- | :----------------------------------------------------------- |
| `data` | Long | 创建推送通知时后台生成的消息 ID，需要保存，创建推送任务是基于此 ID。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](/document/server-side/error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'http://localhost:8099/easemob-demo/testy/push/message'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-H 'Content-Type: application/json' \
-d '{
    "title": "Hello",
    "subTitle": "Hello",
    "content": "Hello",
    "vivo": {}
}'
```

#### 响应示例

```json
{
    "timestamp": 1618817127903,
    "data": 833724991672734897,
    "duration": 0
}
```

### 查询推送通知

查询推送通知信息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/push/message/{messageId}
```

##### 路径参数

| 参数        | 类型   | 描述                              | 是否必需 |
| :---------- | :----- | :-------------------------------- | :------- |
| `messageId` | String | 推送通知 ID，创建推送通知时返回。 | 是       |

其他参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型：`application/json`                                 | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型   | 描述             |
| :----- | :----- | :--------------- |
| `data` | String | 推送通知的内容。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](/document/server-side/error.html) 了解可能的原因。

#### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET 'http://localhost:8099/easemob-demo/testy/push/message/832655326988867864'  \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
    "timestamp": 1618922805143,
    "data": {
        "appkey": "easemob-demo#testy",
        "timestamp": 1618922805091,
        "title": "Hello1234",
        "subTitle": "Hello",
        "content": "Hello",
        "vivo": {}
    },
    "duration": 17
}
```

### 创建全量推送任务

创建推送通知，得到推送通知 ID，然后创建全量推送任务进行全量消息推送。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/push/task/broadcast
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型：`application/json`                                 | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

##### 请求 body

| 字段        | 类型 | 描述                                                         | 是否必需 |
| :---------- | :--- | :----------------------------------------------------------- | :------- |
| `strategy`    | Int  | 推送策略：<br/> -`0`：第三方厂商通道优先，失败时走环信通道。<br/> - `1`：只走环信通道：若用户在线，则直接推送；若用户离线，消息会保留一段时间（视购买的套餐包而定），等用户上线后向其推送消息。若用户在超过消息存储期限时仍为上线，则丢弃消息。<br/> -（默认）`2`：只走第三方厂商通道：若用户离线，消息保留时间视不同厂商而定。若推送失败，直接丢弃推送消息。<br/> - `3`：在线走环信通道，离线走第三方厂商通道。如果厂商推送失败，则等待用户上线后通过环信通道下发。<br/> - `4`：只走环信通道且只推在线用户。离线用户收不到推送通知。 | 否       |
| `pushMsgId` | Long | 推送通知 ID。                                                | 是       |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型   | 描述                                             |
| :----- | :----- | :----------------------------------------------- |
| `data` | String | 推送任务 ID（查询推送结果需要使用推送任务 ID）。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](/document/server-side/error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'http://localhost:8099/easemob-demo/testy/push/task/broadcast'  \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "pushMsgId": 832253695868580464
}'
```

##### 响应示例

```json
{
    "timestamp": 1618817591755,
    "data": 833726937301309957,
    "duration": 1
}
```