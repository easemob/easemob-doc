# 使用环信 App Token 鉴权

## 功能说明

App Token 是具有 App 管理权限的访问令牌，供业务服务器调用环信 REST API，例如管理用户、发送消息和获取 User Token。

业务服务器通过 App 的 Client ID 和 Client Secret 获取 App Token，无需携带已有的 App Token。获取成功后，在需要 App 管理权限的请求中使用 `Authorization: Bearer <YourAppToken>`。各接口支持的身份以对应接口文档为准。

Client Secret 和 App Token 仅在业务服务器保存和使用，不得放入客户端安装包、前端代码或公开日志。

客户端 SDK 登录使用 User Token，详见 [使用环信 User Token 鉴权](easemob_user_token.html)。各类 Token 的区别和选择方法详见 [Token 类型与使用指南](token_overview.html)。

## 调用频率上限

获取 App Token 和获取 User Token 使用同一接口，现有调用频率限制表列出的上限为 **300 次/秒/App Key**。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/token
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

使用 App 所属集群的 REST 域名，并确保请求路径中的 `org_name`、`app_name` 与 Client ID、Client Secret 所属的 App 一致。

## 请求示例

```shell
curl -X POST 'https://<YourRESTHost>/<YourOrgName>/<YourAppName>/token' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "grant_type": "client_credentials",
    "client_id": "<YourClientID>",
    "client_secret": "<YourClientSecret>",
    "ttl": 3600
  }'
```

## 请求 header 参数

关于 `Content-Type` 和 `Accept` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

**本接口在 `grant_type` 为 `client_credentials` 时，通过请求 Body 中的 Client ID 和 Client Secret 鉴权，无需传入 `Authorization`。**

## 请求 body 参数

请求 Body 为 JSON 对象，参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `grant_type` | String | 是 | 授权方式，固定为 `client_credentials`，通过 `client_id` 和 `client_secret` 鉴权。 |
| `client_id` | String | 是 | App 的 Client ID。在 [环信控制台](https://console.easemob.com/user/login/) 的 **应用概览** 页面查看。 |
| `client_secret` | String | 是 | 同一 App 的 Client Secret。在控制台的 **应用概览** 页面查看，仅在业务服务器保存和使用。 |
| `ttl`           | Long   | 否       | token 有效期，普通集群单位为秒，VIP 5 集群单位为毫秒。<br/> - 若传入该参数，token 有效期以传入的值为准。不要传入负数、空字符串或 `null`.<br/> - 若设置为 `0`，则 token 永久有效。 <br/> - 若不传该参数，以 [环信控制台](https://console.easemob.com/user/login/)的 **用户管理** 页面的 token 有效期的设置为准。详见 [设置 Token 有效期](/product/console/operation_user.html#设置-token-有效期)。注意：控制台设置仅影响之后新生成的 Token，不会修改已经签发的 Token。<br/>本次请求设置的 `ttl` 优先于 app 的控制台设置。 |

## 响应示例

HTTP 状态码为 `200` 时，响应 Body 包含 App Token 及其有效期信息。

```json
{
  "access_token": "YWMte3bGuOukEeiTkNP4grL7iwAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgXXXXXXXXX-ZgBPGgBFTrLhhyK8woMEI005emtrLJFJV6aoxsZSioSIZkr5kw",
  "expires_in": 3600,
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示成功返回 token。响应 body 包含如下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `access_token` | String | App Token。后续调用需要 App 管理权限的接口时，将其放入 `Authorization` Header。 |
| `expires_in` | Long | 返回时计算的剩余有效时长，普通集群单位为秒，而非到期时间戳。受处理耗时影响，可能略小于请求的 `ttl`。此处说明适用于有限有效期的 Token，不应依赖该字段识别永久 Token。 VIP 5 等特殊集群请先向环信技术支持确认该字段的单位，再设置缓存或更新时间。 |
| `application` | String | Token 所属 App 的 UUID，由环信生成，不是 App Key。 |

## 使用和更新 App Token

获取有限有效期的 Token 后，在业务服务器缓存 `access_token`，按 `expires_in` 计算刷新时间，并预留网络和处理时间。以下为业务请求的鉴权 Header 格式：

```http
Authorization: Bearer <YourAppToken>
```

App Token 即将到期时，再调用本接口获取新 Token，并更新服务器缓存。不要将重新获取 Token 理解为主动撤销旧 Token；也不要依赖“重新获取”来处理凭证泄露。

## 常见错误与排查

### 错误码

以下列出凭证模式的主要错误。不同集群的完整错误提示可能略有差异，应结合 `error` 和 `error_description` 判断。

| HTTP 状态码 | 错误类型 | 错误提示 | 可能原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| 400 | `illegal_argument` | `client_id must be provided.` | Client ID 缺失或为空。 | 从对应 App 的控制台页面复制 Client ID，按 JSON 字符串传入。详见 [环信控制台](https://console.easemob.com/user/login/)的 **应用概览** 页面中 app key 对应的 **Client ID** 参数。 |
| 400 | `illegal_argument` | `client_secret must be provided` | Client Secret 缺失或为空。 | 传入与 Client ID 属于同一 App 的 Client Secret。详见 [环信控制台](https://console.easemob.com/user/login/)的 **应用概览** 页面中 app key 对应的 **Client Secret** 参数。 |
| 400 | `invalid_grant` | `client_id does not match` | Client ID 与路径指定的 App 不匹配。 | 详见 [环信控制台](https://console.easemob.com/user/login/)的 **应用概览** 页面中 app key 对应的 **Client ID** 参数，确保请求 body 中传入的与该参数一致。同时核对 REST 域名、`org_name`、`app_name` 和 Client ID。 |
| 400 | `invalid_grant` | `client_secret does not match` | Client Secret 不正确或与 App 不匹配。 | 重新核对控制台中的 Client Secret，检查是否包含多余空格。详见 [环信控制台](https://console.easemob.com/user/login/)的 **应用概览** 页面中 app key 对应的 **Client Secret** 参数。 |
| 404 | `organization_application_not_found` | `Could not find application for ... from URI: .../token` | 路径指定的组织或 App 不存在，或者访问了错误集群。 | 核对控制台中的 REST 域名和 App Key，将 `org#app` 分别填入两个路径段。 |

其他错误参考 [响应状态码](error.html)。遇到限流响应时，应降低请求频率并使用缓存，不要持续立即重试。

### 常见问题

#### 获取 App Token 是否需要先有 App Token？

不需要。`client_credentials` 模式使用 Client ID 和 Client Secret 验证 App 身份；需要 App Token 的是后续管理操作，以及 `inherit` 模式获取 User Token 的请求。

#### 不传 ttl，Token 一定有效 60 天吗？

不一定。服务端先读取 App 的 Token 有效期配置。本文核对的服务版本仅在该配置也未设置时，才使用 60 天兜底。请以所属集群的 App 配置和实际响应为准，生产环境建议显式设置有限的 `ttl`。

#### 修改控制台有效期后，旧 Token 会改变吗？

不会。控制台设置影响之后新生成的 App Token 和 User Token，已经签发的 Token 不会因此延长或缩短有效期。

#### 业务接口返回 401，是否只需要重新获取 Token？

先检查使用的是否为 App Token、是否已过期、Header 是否为 `Bearer` 加一个英文空格，以及 Token 所属 App 是否与请求路径一致。确认是过期后，再刷新缓存并重试；凭证类型或 App 不匹配时，反复获取 Token 无法解决问题。

## 相关文档

- [Token 类型与使用指南](token_overview.html)
- [使用环信 User Token 鉴权](easemob_user_token.html)
- [Java Server SDK](java_server_sdk.html)
