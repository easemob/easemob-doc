# 用户登入登出

app 用户状态分为在线和离线两种，即用户已连接到环信即时通讯 IM 服务器即为在线，与环信即时通讯 IM 服务器断开连接即为离线。用户登入和登出即时通讯 IM 会导致在线状态发生变化。某些情况下，例如，进入隧道等特殊网络情况，依赖心跳超时，用户进入离线状态最长会有 5 分钟延时。

用户登入、主动登出或被踢出即时通讯 IM 时，服务器会向你的 app server 同步用户的在线或离线状态以及状态变更原因，包括 `login`、`logout` 和 `replaced`。收到回调后，app server 会向即时通讯服务器返回响应：
- 若 HTTP 状态码为 200，表示用户状态成功同步至你的 app server 。你可以自行进行业务处理。
- 若 60 秒内未收到响应，即时通讯 IM 服务器会重新发送回调。若仍未收到响应，即时通讯 IM 服务器则不再发送回调，会记录一次回调发送失败。

若在短时间内存在大量的响应失败，即时通讯 IM 服务器则停止接收你的 app server 的响应，你需要在环信控制台的 **即时通讯 > 功能配置 > 消息回调** 下的**发送后回调**窗口修改回调地址。

你可以通过登入登出回调实时监控用户在线、离线状态以及状态变更原因（登入，登出和被踢）；如应用中需要实时展示用户在线、离线状态时，可通过此服务来实现。

- 登入（login）：app 用户与环信即时通讯 IM 服务器建立连接。
- 登出（logout）：app 用户退出登录导致与环信即时通讯 IM 服务器的连接断开。
- 踢用户（replaced）：可能是用户账号被开发者从服务端强制下线，或者 app 用户在达到最大登录设备数时继续登录其他设备，则其中一端设备会被踢出，导致与环信即时通讯 IM 服务器的连接断开。多端登录时，即时通讯 IM 每端默认最多支持 4 个设备同时在线。

| 事件                | 主要字段                                 | 触发事件             |
| :------------------ | :--------------------------------------- | :------------------- |
| `userStatus`          | -                                        | 用户在线状态变更事件 |
| `userStatus:login`    | `{“status”:“online”,”reason“:“login”}`     | 用户登录             |
| `userStatus:logout`   | `{“status”:“offline”,”reason“:“logout”}`   | 用户登出             |
| `userStatus:replaced` | `{“status”:“offline”,”reason“:“replaced”}` | 用户被踢            |

## 用户登录

回调请求主要字段含义：

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 |
| `reason`    | object   | `login`，用户登录。                                          |
| `security`  | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [Console 后台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |
| `os`        | String   | 设备类型。                                                   |
| `ip`        | String   | 用户登录 IP。                                                |
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `user`      | String   | 登录用户识别号，格式为 `{app key_username@easemob.com/device operating system_device ID}`，其中 `@easemob.com` 为固定字符串，`device ID` 由 SDK 随机生成。 |
| `version`   | String   | SDK 版本号。                                                 |
| `timestamp` | long     | 登录请求到环信 IM 服务器的 Unix 时间戳，单位为 ms。          |
| `status`    | String   | `online`，在线。                                             |

回调请求示例：

```json
{
    "callId":"XXXX#XXXX_25b64a81-1376-4669-bb3d-178449a8f11b",
    "reason":"login",
    "security":"2c6dd77e61b8f26801627fdaadca893e",
    "os":"ios",
    "ip":"XXXX",
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX@easemob.com/ios_6d580737-db3a-d2b5-da18-b6045ffd195b",
    "version":"3.8.9.1",
    "timestamp":1642585154644,
    "status":"online"
}
```

## 用户登出

回调请求主要字段含义：

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `reason`    | object   | 值为 `logout`，表示用户登出。                                    |
| `security`  | String   | 签名，格式如下: `MD5（callId+secret+timestamp）`。Secret 见 [Console 后台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |
| `os`        | String   | 设备类型。                                                   |
| `ip`        | String   | 用户登录 IP。                                                |
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `user`      | String   | 登录用户识别号，格式为 `{app key_username@easemob.com/device operating system_device ID}`，其中 `@easemob.com` 为固定字符串，`device ID` 由 SDK 随机生成。             |
| `version`   | String   | SDK 版本号。                                                 |
| `timestamp` | long     | 请求到环信 IM 服务器的 Unix 时间戳，单位为 ms。              |
| `status`    | String   | `offline`，离线。                                            |

回调请求示例：

```json
{
    "callId":"XXXX#XXXX_25b54a81-1376-4669-bb3d-178339a8f11b",
    "reason":"logout",
    "security":"2c7dd77e61b8f26801627fdaadca987e",
    "os":"ios",
    "ip":"XXXX",
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX@easemob.com/ios_6d580737-db3a-d2b5-da18-b6045ffd195b",
    "version":"3.8.9.1",
    "timestamp":1642648914742,
    "status":"offline"
}
```

## 用户登出（被其他设备踢掉）

回调请求主要字段含义：

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 |
| `reason`    | object   | `replaced`，该用户登出，原因是被其他设备登录踢掉。           |
| `security`  | String   | 签名，格式如下: `MD5（callId+secret+timestamp）`。Secret 见 [Console 后台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |
| `os`        | String   | 设备类型。                                                   |
| `ip`        | String   | 用户登录 IP。                                                |
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `user`      | String   | 登录用户识别号，格式为 `{app key_username@easemob.com/device operating system_device ID}`，其中 `@easemob.com` 为固定字符串，`device ID` 由 SDK 随机生成。  |
| `version`   | String   | SDK 版本号。                                                 |
| `timestamp` | long     | 请求到环信 IM 服务器的 Unix 时间戳，单位为毫秒 。              |
| `status`    | String   | `offline`，离线。                                            |

回调请求示例：

```json
{
    "callId":"XXXX#XXXX_260ae3eb-ba31-4f01-9a62-8b3b05f3a16c",
    "reason":"replaced",
    "security":"0ac500b1a1e44fe76dbfdc664cbaa76b",
    "os":"ios",
    "ip":"223.71.97.198:52709",
    "host":"msync@ebs-ali-beijing-msync40",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX@easemob.com/ios_a5fa01fd-b5a4-84d5-ebeb-bf10e8950442",
    "version":"3.8.9.1",
    "timestamp":1642648955563,
    "status":"offline"
}
```