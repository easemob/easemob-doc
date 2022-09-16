# 使用环信 App Token 鉴权

<Toc />

环信提供的 REST API 需要权限才能访问，权限通过发送 HTTP 请求时携带 app token（即管理员权限 token）来体现。

另外环信 Server SDK 提供了用户、消息、群组、聊天室等资源的操作管理能力，具体参见：[Java Server SDK](/document/server-side/java_server_sdk.html) 和 [PHP Server SDK](/document/server-side/php_server_sdk.html)。

下面描述获取管理员 token 的方式。

## 获取管理员权限 token

说明：API 描述的时候使用到的 {APP 的 client_id} 之类的这种参数需要替换成具体的值。

:::notice
获取 token 时服务器会返回 token 有效期，具体值参考接口返回的 `expires_in` 字段值，可通过环信即时通讯管理后台设置，参见 [用户认证详情页面](https://console.easemob.com/app/applicationOverview/userManagement)。该参数值以最新设置为准。由于网络延迟等原因，系统不保证 token 在此值表示的有效期内绝对有效，如果发现 token 使用异常请重新获取新的 token，比如 “http response code” 返回 401。另外，请不要频繁向服务器发送获取 token 的请求，同一账号发送此请求超过一定频率会被服务器封号。
:::

`client_id` 和 `client_secret` 可以在环信管理后台的 [APP 详情页面](https://console.easemob.com/user/login/) 看到。

### HTTP 请求

```http
POST {https://host}/{org_name}/{app_name}/token
```

#### 路径参数

|   参数    | 类型   | 是否必需 | 描述         |
| :-------: | :----- | :------- | ------------ |
|  `host`| String | 是    |你在环信即时通讯云控制台注册应用时的集群服务器地址。|
| `org_name` | String | 是     | 你在环信即时通讯云控制台注册项目时填入的公司（组织）名称。  |
| `app_name` | String | 是    | 你在环信即时通讯云控制台注册项目时填入的应用名称。|

#### 请求 header

|      参数      | 类型   | 是否必需 |        描述        |
| :------------: | :----- | :------: | :----------------: |
| `Content-Type` | String |   是   | 内容类型：`application/json` |

#### 请求 body

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------: | :----------------------------------------------------------- |
| `grant_type`    | String |    是    | `client_credentials`，固定字符串。                          |
| `client_id`     | String |    是    | App 的 `client_id`，参见 [app 详情页面](https://console.easemob.com/app-detail/detail)。 |
| `client_secret` | String |    是    | App 的 `client_secret`，参见 [app 详情页面](https://console.easemob.com/app-detail/detail)。 |
| `ttl`           | Long   |    否    | token 有效期，单位为秒(s)。设置为 `0` 则 token 有效期为永久。若不传该参数，默认值为 60 天。也可通过环信即时通讯云控制台设置，参见 [用户认证详情页面](https://console.easemob.com/app/applicationOverview/userManagement)。该参数值以最新设置为准。 |

### HTTP 响应

#### 响应 body

| 参数     | 类型      | 说明                                 |
| :-----------| :--------- | :----------------------------------- |
| `access_token` | String | 有效的 token 字符串。               |
| `expires_in`   | long | token 有效时间，单位为秒，在有效期内不需要重复获取。 |
| `application`  |String | 当前 App 的 UUID 值。                 |

### 示例

#### 请求示例

```shell
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{
   "grant_type": "client_credentials",
   "client_id": "YXA6i-Ak8Ol4Eei2l11ZjV-EAg",
   "client_secret": "YXA6VunqiNxoB7IwXHInk1cGiXOOJfc",
   "ttl": "1024000"
 }' 'http://a1.easemob.com/easemob-demo/testapp/token'
```

#### 响应示例

**返回值 200，表示成功返回 token。**

```json
{
  "access_token": "YWMte3bGuOukEeiTkNP4grL7iwAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgMAAAFnKdc-ZgBPGgBFTrLhhyK8woMEI005emtrLJFJV6aoxsZSioSIZkr5kw",
  "expires_in": 1024000,
  "application": "8be024f0-e978-11e8-b697-5d598d5f8402"
}
```

#### 响应码

| 响应码 | 意义 |
| - | - |
| 200 | 成功。 |
| 429，503 或者其他 5xx | 单位时间内请求过多。请稍后重试。 |
| 500 | 服务器内部错误，一般是 mysql 错误。如果问题持续存在，请联系我们的技术支持团队。 |

