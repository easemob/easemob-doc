# 使用环信 User Token 鉴权

## 功能说明

User Token 是代表某个环信用户身份的访问令牌，用于客户端 SDK 登录和后续鉴权。客户端登录时，用户 ID 必须与 Token 绑定的用户一致，App Key 必须与 Token 所属的 App 一致。

业务服务器必须先验证用户的业务登录状态和账号绑定关系，确认其有权获取对应环信用户的 Token，再获取并分发 User Token。客户端仅接收属于自己的 User Token。

本文介绍以下两种获取 User Token 的方式：

- **通过 REST API 获取**：业务服务器携带 App Token，为指定用户获取 User Token；支持按需自动创建不存在的环信用户。
- **生成动态 User Token**：业务服务器使用 App 的 Client ID、Client Secret、App Key 和用户 ID 等参数，在本地生成 User Token，每次签发无需调用获取 Token 的 REST API。客户端登录时，由环信服务验证其有效性。

上述流程中使用的 App Token 和 Client Secret 仅在业务服务器保存和使用，不得分发给客户端。动态 User Token 的生成逻辑也必须在业务服务器执行。

以上两种方式获得的 User Token 均代表用户身份，不能代替 App Token 执行 App 管理操作。各类 Token 的区别和选择方法详见 [Token 类型与使用指南](token_overview.html)。

## 通过用户 ID 获取 User Token

业务服务器调用本接口，为指定用户获取 User Token。若用户不存在，是否创建由 `autoCreateUser` 决定；用户已存在时，不会重复创建。被封禁的用户不能通过本接口正常获取 User Token。

### 调用频率上限

现有调用频率限制表将获取 App Token 和 User Token 列为同一接口，上限为 **300 次/秒/App Key**。

### 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/token
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

### 请求示例

以下示例适用于 Bash。请先 [获取 App Token](easemob_app_token.html)，替换所有占位值。示例为已注册用户获取有限有效期的 User Token，不会自动注册用户。

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/token' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <YourAppToken>' \
  -d '{
        "grant_type": "inherit",
        "username": "example_user",
        "autoCreateUser": false,
        "ttl": 3600
  }'
```

如需在用户不存在时自动创建用户，将 `autoCreateUser` 设为 `true`。用户 ID 的字符和长度要求详见 [注册用户](account_register_open.html)。

### 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的通用说明，详见 [请求 header 参数说明](overview.html#请求-header)。

**本接口的 `inherit` 模式必须使用具有对应 App 管理权限的 App Token，不能使用客户端登录的 User Token。** Header 格式为 `Authorization: Bearer <YourAppToken>`。

### 请求 body 参数

请求 Body 为 JSON 对象，参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `grant_type` | String | 是 | 固定为 `inherit`，表示由具有管理权限的调用方为用户获取 Token。 |
| `username` | String | 是 | 环信用户 ID。不是客户端自行选择的任意身份；业务服务器应先验证与业务账号的绑定关系。 |
| `autoCreateUser` | Boolean | 否 | 用户不存在时是否自动创建。仅设置 `true` 时创建；设置为 `false` 或省略时，不自动创建，用户不存在则请求失败。建议显式传入。用户已存在时，不会重复创建。 |
| `ttl`           | Long   | 否       | 请求的 User Token 有效时长，普通集群单位为秒，VIP 5 集群单位为毫秒。<br/> - 若传入该参数，token 有效期以传入的值为准。不要传入负数、空字符串或 `null`.<br/> - 若设置为 `0`，则 token 永久有效。 <br/> - 若不传该参数，以 [环信控制台](https://console.easemob.com/user/login/)的 **用户管理** 页面的 token 有效期的设置为准。详见 [设置 Token 有效期](/product/console/operation_user.html#设置-token-有效期)。注意：控制台设置仅影响之后新生成的 Token，不会修改已经签发的 Token。<br/>本次请求设置的 `ttl` 优先于 app 的控制台设置。 |

### 响应示例

HTTP 状态码为 `200` 时，返回 User Token 及用户信息。

```json
{
  "access_token": "YWMthyeiFhbyEe2eMGeYZSLlT7sMrFep3U6BvVj7KSnNonUiDB-wFvIR7a5Ttx2-01MYAwMAAAGCfIeryQAPoAAsuveDfkUrePkEM2Hgy6SaOTeTx3ETgh5cnXcP_HfBPg",
  "expires_in": 3600,
  "user": {
    "uuid": "220c1fb0-XXXX-XXXX-ae53-b71dbed35318",
    "type": "user",
    "created": 1700000000000,
    "modified": 1700000000000,
    "username": "example_user",
    "activated": true
  }
}
```

### 响应 body 字段

如果返回的 HTTP 状态码为 200，表示成功获取 token，响应包体中包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `access_token` | String | 为指定用户签发的 User Token，应仅分发给该用户的已授权客户端。 |
| `expires_in` | Long | 返回时计算的剩余有效时长，普通集群单位为秒，不是 Unix 时间戳。受处理耗时影响，可能略小于请求的 `ttl`。此处适用于有限有效期的 Token，不应依赖该字段识别永久 Token。 VIP 5 等特殊集群请先向环信技术支持确认该字段的单位，再设置缓存或更新时间。 |
| `user` | JSON | 对应的环信用户信息。用户已存在和本次自动创建成功时均会返回。 |
| `user.uuid` | String | 环信内部使用的用户 UUID，与登录和通信使用的用户 ID 不同。 |
| `user.type` | String | 资源类型，此处为 `user`，无需关注。 |
| `user.created` | Long | 用户创建时间，Unix 时间戳，单位为毫秒。 |
| `user.modified` | Long | 用户最近一次修改时间，Unix 时间戳，单位为毫秒。 |
| `user.username` | String | 环信用户 ID，客户端登录时使用该值。 |
| `user.activated` | Boolean | 用户是否处于启用状态。`true` 表示启用，`false` 表示封禁；本接口会拒绝为被封禁用户正常签发 Token。如要使用已被封禁的用户，你需要调用 [解禁用户的 API](/document/server-side/account_unban.html)对用户解除封禁。 |

### 常见错误与排查

#### 错误码

以下列出本接口的主要错误。错误提示可能随服务版本变化，应同时读取 `error` 和 `error_description`。

| HTTP 状态码 | 错误类型 | 错误提示 | 可能原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| 400 | `illegal_argument` | `username is null` | 用户 ID 缺失或为空。 | 传入已经通过业务服务器身份校验的用户 ID。 |
| 400 | `illegal_argument` | `token is invalid` | 调用方凭证的格式无法识别。 | 核对 App Token 的复制和传递过程，不要传入用户 ID、App Key 或 Client Secret。 |
| 400 | `invalid_grant` | `user not activated` | 用户被封禁。 | 核实账号状态；如业务允许，先 [解禁用户](account_unban.html)，再获取 Token。 |
| 401 | `unauthorized` 或 `auth_bad_access_token` | `Unable to authenticate due to corrupt access token` 或具体的 Token 错误提示 | 调用使用的 App Token 过期、损坏、权限类型错误，或与路径中的 App 不一致。 | 核对 Header、Token 类型和 App；确认过期后再重新获取 App Token。 |
| 404 | `invalid_grant` | `user not found` | 用户不存在，且未启用自动创建；也可能是自动创建过程失败。 | 先确认用户 ID 和 App 是否正确；按需预先注册用户或显式设置 `autoCreateUser: true`。启用自动创建后仍失败时，也应按 [注册用户](account_register_open.html) 检查用户 ID 的字符、长度及注册限制。 |
| 404 | `organization_application_not_found` | `Could not find application for ... from URI: .../token` | 组织或 App 不存在，或者 REST 域名对应错误集群。 | 从控制台核对所属集群和 App Key，正确填写请求路径。 |
| 409 | `concurrent_operation_error` | `concurrent operation are not allowed`，部分版本提示为 `concurrency create app user failed` | 多个请求同时尝试自动创建同一用户。 | 对同一用户合并并发请求；短暂退避后确认用户是否已创建，再获取 Token。不要持续并发注册。 |
| 429 | `resource_limited` | `You have exceeded the limit of the community edition,Please upgrade to the enterprise edition` | 自动创建用户触发当前套餐的注册用户数量限制。 | 核对用户数量及套餐配额；需要更多用户时调整套餐。不要将该错误仅当作请求速率限制反复重试。 |

自动创建过程中的部分异常可能统一返回 `user not found`，不要仅根据错误文字判断用户不存在。若仍无法定位，请向技术支持提供请求时间、App 标识和脱敏后的错误响应，不要提供 Client Secret 或完整 Token。

其他错误参考 [响应状态码](error.html)。

#### 已注册用户还需要把 autoCreateUser 设为 true 吗？

不需要。建议对预先注册的用户设置为 `false`；只有业务确实需要在获取 Token 时创建用户，才设置为 `true`。

#### 获取 User Token 是否会要求用户密码？

`inherit` 模式不要求用户密码，而是依靠调用方的 App 管理权限。你的业务服务器必须先验证用户身份。不要把免传环信密码理解为无需验证业务账号。

#### 用户 ID 不存在时，动态 Token 也会自动创建用户吗？

不能把 REST 接口的 `autoCreateUser` 行为套用到动态 Token。动态 Token 的生成过程不调用本接口，也不包含该参数；用户注册和登录侧的行为应按所用服务的配置及接入说明处理。

## 生成动态 User Token

动态 User Token 由你的业务服务器基于 App 凭证和用户 ID 生成，适合希望自行控制 Token 签发流程、减少签发阶段 REST API 请求的场景。客户端获取 Token 后，使用对应的用户 ID 和 Token 登录 SDK，由环信服务验证其有效性。

生成动态 Token 需要使用 Client Secret，生成逻辑必须在业务服务器执行，不能放在客户端。

#### 准备签名参数

登录 [环信控制台](https://console.easemob.com/user/login/)，在应用的 **应用概览** 页面查看 App Key、Client ID 和 Client Secret。生成动态 Token 所需的参数如下：

| 参数           | 类型   | 描述                                                         |
| -------------- | ------ | ------------------------------------------------------------ |
| `clientId`     | String | App 的 Client ID，参与签名。详见 [环信控制台](https://console.easemob.com/user/login/)的 **应用概览** 页面中 app key 对应的 **Client ID** 参数。 |
| `appkey`       | String | App Key，格式为 `org_name#app_name`，组织名称与应用名称之间使用 `#` 分隔。 |
| `userId`       | String | Token 对应的环信用户 ID，即注册用户时传入的 `username`。     |
| `curTime`      | Long   | 签发时的 Unix 时间戳，单位为秒。                             |
| `ttl`          | Long   | 动态 User Token 的有效时长，单位为秒，由业务服务器指定，不受环信控制台中 Token 有效期配置的影响。建议使用正整数，例如 `600` 表示 10 分钟。到期时间为 `curTime` + `ttl`，例如，`curTime` 对应今天 10:00:00，`ttl = 600` 秒（10 分钟），那么 Token 在今天 10:10:00 到期。不要直接套用 REST Token 的 ttl = 0 永久有效规则。|
| `clientSecret` | String | App 的 Client Secret，仅参与签名，不放入最终 Token 的 JSON。详见 [环信控制台](https://console.easemob.com/user/login/)的 **应用概览** 页面中 app key 对应的 **Client Secret** 参数。 |

#### 生成步骤

按以下步骤生成动态 Token：

1. 获取当前 Unix 秒时间戳 `curTime`，设置有效时长 `ttl`。
2. 按 `clientId + appkey + userId + curTime + ttl + clientSecret` 的顺序拼接字符串，不插入分隔符。其中，`curTime` 和 `ttl` 使用十进制整数的文本形式。
3. 将拼接后的字符串按 UTF-8 编码，计算 SHA-256 摘要，再将摘要转换为小写十六进制字符串，得到 `signature`。
4. 构造包含 `signature`、`appkey`、`userId`、`curTime` 和 `ttl` 的 JSON 对象，并序列化为字符串。`curTime` 和 `ttl` 在 JSON 中保持整数类型。
5. 在 JSON 字符串前添加 `dt-`，将完整字符串按 UTF-8 编码，再进行 URL 安全的 Base64 编码，得到最终 Token。
6. 将 Token 分发给对应用户的已授权客户端，用于 SDK 登录。

以下为生成过程的伪代码。`decimal()` 表示将整数转换为十进制字符串，`serializeJson()` 表示将对象序列化为 JSON 字符串。

```
source = clientId + appkey + userId + decimal(curTime) + decimal(ttl) + clientSecret
signature = lowercase_hex(SHA256(UTF8(source)))

payload = {
  "signature": signature,
  "appkey": appkey,
  "userId": userId,
  "curTime": curTime,
  "ttl": ttl
}

jsonString = serializeJson(payload)
userToken = Base64URL(UTF8("dt-" + jsonString))
```

`dt-` 是编码前字符串的一部分，不是在编码完成后追加的明文前缀。Base64URL 仅用于编码，不提供加密保护；不要在编码内容中加入 Client Secret。

## 登录和更新 User Token

客户端获取 User Token 后，使用与之对应的用户 ID 登录所用平台的环信 SDK，具体方法参见对应平台的集成文档。业务服务器应返回 Token 的到期信息，便于客户端安排更新。

Token 即将到期时，按以下流程更新：

1. 客户端收到 SDK 的 Token 即将过期或已过期通知后，向业务服务器申请新 Token。
2. 业务服务器重新验证业务用户身份，调用 REST API 或重新生成动态 Token。
3. 客户端获得新 Token 后，调用对应平台 SDK 的 Token 更新接口；部分平台的方法名为 `renewToken`。若已经断开登录，按对应 SDK 的连接状态和登录流程处理。

## 常见问题

#### 修改控制台有效期会影响动态 Token 吗？

REST 签发 Token 使用本次 `ttl` 或 App 的配置；动态 Token 的有效时长由签名参数 `ttl` 指定。不要依赖控制台调整来延长已经生成的动态 Token。

#### 是否可以一直使用同一个永久 User Token？

不建议。生产环境使用有限有效期，按上述流程更新。Token 不按时间过期不代表永远可用，用户身份、封禁状态和服务配置等仍可能影响鉴权。

#### 为什么生成了 Token 仍然登录失败？

依次检查客户端 App Key、登录用户 ID 与 Token 是否匹配；检查用户是否存在及是否被封禁；确认 Token 未过期。动态 Token 还应检查服务器时钟、秒与毫秒的转换、签名参数顺序和编码方式。

## 相关文档

- [Token 类型与使用指南](token_overview.html)
- [使用环信 App Token 鉴权](easemob_app_token.html)
- [注册用户](account_register_open.html)
