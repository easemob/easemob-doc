# Token 概览

## 功能说明

接入环信即时通讯时，需要先区分两类身份：业务服务器使用 App Token 管理 App 资源，客户端使用 User Token 登录某个用户。两者的权限不同，不能相互替代。

User Token 可以由环信 REST API 签发，也可以在你的业务服务器生成动态 Token。动态 Token 是 User Token 的一种生成方式，不是另一种 App 管理权限。

## Token 类型

以下对比面向普通集群的 App 管理和客户端 IM 登录。具体接口和获取流程见表中的链接。

| 类型 | 有效期 | 使用场景 | 获取接口 |
| :--- | :--- | :--- | :--- |
| App Token | 请求 `ttl` 指定，普通集群单位为秒；省略时使用 App 配置。`0` 表示不按时间过期。 | 业务服务器调用需要 App 管理权限的 REST API，例如管理用户、发送消息、为用户获取 User Token。 | `POST /{org_name}/{app_name}/token`，`grant_type: client_credentials`，使用 Client ID 和 Client Secret。详见 [App Token 鉴权](easemob_app_token.html)。 |
| User Token（REST API 签发） | 请求 `ttl` 指定，普通集群单位为秒；省略时使用 App 配置。`0` 表示不按时间过期。 | 为指定环信用户提供客户端 SDK 登录凭证，登录后由 SDK 用于服务交互。 | `POST /{org_name}/{app_name}/token`，`grant_type: inherit`，携带 App Token 并传入 `username`。详见 [通过用户 ID 获取 User Token](easemob_user_token.html#通过用户-id-获取-user-token)。 |
| User Token（动态生成） | 由业务服务器设置签名参数 `ttl`，单位为秒；签发时间使用 Unix 秒时间戳 `curTime`。使用有限的正有效期，不沿用 REST Token 的永久有效语义。 | 希望自行控制签发流程、减少签发阶段的 REST 调用；客户端仍需联网向环信服务完成登录鉴权。 | 没有单独的公开 REST 获取接口；业务服务器基于 Client ID、App Key、用户 ID、时间和 Client Secret 生成。详见 [生成动态 User Token](easemob_user_token.html#生成动态-user-token)。 |

:::tip
表中的 REST 有效期单位适用于普通集群。若使用 VIP 5 等特殊集群，请向环信技术支持分别确认请求 `ttl` 和响应 `expires_in` 的单位，确认前不要直接套用秒与毫秒的换算。生产环境建议使用有限有效期，并按下文的更新流程更换 Token。
:::

## Token 选择

根据要完成的操作选择凭证：

- **调用 REST API 管理 App 资源**：使用 App Token，具体权限以目标接口文档为准。
- **让客户端登录环信用户**：使用该用户的 User Token；不能将 App Token 交给客户端当作登录凭证。
- **需要在获取 User Token 时创建不存在的用户**：使用 `inherit` 接口并显式设置 `autoCreateUser: true`。若用户已预先注册，建议设置为 `false`。
- **希望业务服务器自行签发用户凭证**：选择动态 User Token，并先验证所接入集群的签名和有效期规则。

同一个 `/token` 路径通过 `grant_type` 区分操作。获取 App Token 不需要已有 App Token；`inherit` 模式获取 User Token 则需要 App 管理权限。

## 接入流程

业务账号与环信用户可以采用不同的 ID，但应在业务服务器维护可信的绑定关系。推荐流程如下：

1. 用户先完成你的业务账号登录。
2. 业务服务器校验登录状态，确定该账号对应的环信用户 ID。
3. 业务服务器调用 `inherit` 接口获取 User Token，或生成动态 User Token。
4. 业务服务器通过受保护的连接，把用户 ID、User Token 及到期信息返回给该用户的客户端。
5. 客户端使用对应的用户 ID 和 User Token 登录环信 SDK。
6. 即将到期时，客户端向业务服务器申请新 Token，再调用所用 SDK 的 Token 更新接口。

## 有效期与更新

#### ttl 与 expires_in 区别

`ttl` 是获取 Token 时请求的有效时长；`expires_in` 是 REST 响应中返回的剩余有效时长。两者不是到期 Unix 时间戳，且 `expires_in` 可能因处理耗时略小于 `ttl`。

对于普通集群的有限有效期 Token，可根据收到响应的时间和 `expires_in` 安排更新，并预留安全余量。动态 Token 的预计到期秒时间戳则由 `curTime + ttl` 决定，签名服务器应保持时钟同步。

User Token 响应中的 `user.created` 和 `user.modified` 是用户信息的创建、修改时间，单位为毫秒，不能当作 Token 签发时间或到期时间。

#### 默认有效期

REST 签发的 App Token 和 User Token 按以下顺序选择有效期：

1. 请求显式传入 `ttl` 时，使用本次请求值。
2. 省略 `ttl` 时，使用 App 的 Token 有效期配置。
3. App 配置也未设置时，本文核对的服务版本使用 60 天兜底。

新建 App 可能已经带有有效期配置，不能把兜底值视为所有 App 的实际默认值；请以所属集群的 App 配置和实际响应为准。

控制台 **用户管理** 页面中的 [Token 有效期设置](/product/console/operation_user.html#设置-token-有效期) 对之后新生成的 App Token 和 User Token 生效，不会修改已经签发的 Token。动态 Token 的有效期由签名参数指定。

#### 使用永久 Token

REST 获取接口的 `ttl = 0` 表示不按时间过期。生产环境建议使用有限有效期，避免凭证泄露后被长期使用。

永久 Token 的返回值不应套用有限有效期 Token 的 `expires_in` 缓存计算方式；不要仅根据 `expires_in` 为零或负数判断凭证一定无效。建议通过有限有效期避开此类兼容差异。

#### 更新 Token

App Token 由业务服务器缓存并更新。应在有效期内复用，临近到期时重新获取；多实例服务应避免同时重复刷新。

User Token 由业务服务器重新签发，再交给客户端 SDK 更新。SDK 的 `renewToken` 等更新方法只使用新 Token，不负责替你签发。回调名称和处理步骤以所用 SDK 平台和版本为准。

本文两个 REST 获取接口的响应没有提供 `refresh_token` 字段。不要自行假设可以使用 `grant_type: refresh_token` 刷新，而应按原有签发方式获取新 Token。

## 凭证与安全边界

常见标识和凭证的用途如下：

| 名称 | 含义 | 使用位置 |
| :--- | :--- | :--- |
| App Key | App 标识，常见格式为 `org_name#app_name`，不是 App Token。 | SDK 配置、业务服务器选择 App。 |
| Client ID | App 的凭证标识，与 Client Secret 配合使用。 | 业务服务器获取 App Token、生成动态 User Token。 |
| Client Secret | App 的签名或鉴权密钥。 | 仅保存在业务服务器，不能分发给客户端。 |
| 用户 ID | 某个 App 内的用户标识，不是访问凭证。 | 账号绑定、SDK 登录和消息收发。 |
| App Token | App 管理身份凭证。 | 仅在业务服务器调用相应管理接口。 |
| User Token | 代表指定用户的身份凭证。 | 分发给该用户的已授权客户端，用于 SDK 登录和鉴权。 |

业务服务器不能仅凭客户端提交的用户 ID 就返回对应 Token，必须验证业务登录身份和账号绑定关系。否则攻击者可能冒用其他用户。

使用 HTTPS 传递凭证，避免将 Token 或 Client Secret 写入 URL 查询参数、公开日志和代码仓库。Base64 编码不等于加密，不能通过编码保护 Client Secret。

不要依赖“重新获取 Token”使旧 Token 自动失效。发现泄露时，按实际泄露的凭证类型联系技术支持并采取相应账号或凭证处理措施。

## 常见问题

#### 获取 Token 为什么没有弹出用户授权页面？

这里介绍的是服务器之间的凭证签发，不是浏览器 OAuth 授权页面。`inherit` 模式由业务服务器用 App 管理权限为已验证的业务用户获取凭证。

#### 收到 401 后，是否应立即循环刷新？

不应循环刷新。先确认凭证类型、所属 App、Header 格式及有效期。只有确认过期或凭证失效后，才重新获取并进行受控重试；权限或 App 不匹配需要先修正配置。

#### User Token 能否用于另一个用户或另一个 App？

不能。客户端的 App Key、用户 ID 和 User Token 必须匹配。动态 Token 还必须使用对应 App 的签名凭证。

#### SDK 更新 Token 是否等于用户重新登录？

两者是不同操作。正常连接时按 SDK 的 Token 更新流程使用新凭证；已经断开或退出登录时，应结合当前连接状态按对应 SDK 文档处理。

#### 获取 Token 是否会消耗用户注册配额？

为已存在的用户获取 Token 不会因此新建用户。若 `inherit` 请求设置 `autoCreateUser: true` 且用户不存在，则会创建用户，并受到套餐配额限制。

## 相关文档

- [使用环信 App Token 鉴权](easemob_app_token.html)
- [使用环信 User Token 鉴权](easemob_user_token.html)
- [RESTful API 调用频率限制](/document/server-side/limitationapi.html)
