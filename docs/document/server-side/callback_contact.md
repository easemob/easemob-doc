# 好友与黑名单回调事件

## 功能说明

添加/删除好友或者拉黑/解除拉黑用户，环信服务器会按照 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调查看好友和黑名单相关操作相关信息，进行数据同步。

本文包含以下好友关系相关回调事件：

- [发起好友申请](#发起好友申请)
- [同意好友申请](#同意好友申请)
- [拒绝好友申请](#拒绝好友申请)
- [删除好友](#删除好友)
- [拉黑用户](#拉黑用户)
- [解除拉黑用户](#解除拉黑用户)

## 前提条件

- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则。详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 发起好友申请

#### 回调时机

[客户端发起了好友申请](/document/android/user_relationship.html#添加好友)。

#### 回调请求

请求示例如下：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX",
    "security":"XXXX",
    "payload":{
        "reason":"",
        "operation":"add"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst01",
    "eventType":"chat",
    "msg_id":"9XXXX2",
    "timestamp":1642648175092
    }
```

请求字段说明如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | 回调请求的唯一标识，格式为 “App Key_添加好友事件的消息 ID”。 | 
| `chat_type`       | String | `roster`：用户关系事件。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.reason`    | object   | 申请原因                |
| `payload.operation` | String   | `add`：添加好友。 |
| `host`            | String   | 服务器名称。          |
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `from`       | String | 发起方，格式为 `App Key_发起方用户 ID@easemob.com`。                                |
| `to`       | String | 接收方用户 ID。                                |
| `eventType`       | String   | <br/> - `chat`：上行消息<br/> - `chat_offline`：离线消息。                   |
| `msg_id`    | String   | 添加好友事件的消息 ID。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                             |

## 同意好友申请

#### 回调时机

收到好友申请后，[用户通过客户端同意添加对方为好友](/document/android/user_relationship.html#添加好友)。

#### 申请方收到事件

`payload.operation` 为 `remote_accept` 时，表示发起好友申请的用户会收到该事件。在这种情况下，`to` 为发起好友申请的用户。  

请求示例如下：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725899779049516",
    "security":"a2e1545231e8acf60513b50984af0c6c",
    "payload":{
        "roster_ver":"DD6E14FE5EE5A9ABC52CA86C5DE1601CF729BFD6",
        "operation":"remote_accept"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst01",
    "eventType":"chat",
    "msg_id":"96XXXX516",
    "timestamp":1642648213494
    }
```

请求字段说明如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | 回调请求的唯一标识，格式为 “App Key_同意好友申请事件的消息 ID”。 | 
| `chat_type`       | String | `roster`：用户关系事件。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.roster_ver`    | String   | 好友列表的版本号。  |
| `payload.operation` | String   | `remote_accept`：同意好友申请事件。发起好友申请的用户会收到该事件。 |
| `host`            | String   | 服务器名称。          |
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `from`       | String | 发起方，格式为 `App Key_发起方用户 ID@easemob.com`。                                |
| `to`       | String | 发起好友申请的用户的用户 ID。                                |
| `eventType`       | String   | <br/> - `chat`：上行消息<br/> - `chat_offline`：离线消息。       |
| `msg_id`    | String   | 同意好友申请事件的消息 ID。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                             |

#### 接受方收到事件

`payload.operation` 为 `accept`，表示接受好友申请的用户会收到该事件。该事件用于单设备或多设备登录场景下的操作结果同步。

在这种情况下，`to` 为接受好友申请的用户 ID。

请求示例如下：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725899779049516",
    "security":"a2e1545231e8acf60513b50984af0c6c",
    "payload":{
        "roster_ver":"DD6E14FE5EE5A9ABC52CA86C5DE1601CF729BFD6",
        "operation":"accept"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst02",
    "eventType":"chat",
    "msg_id":"96XXXX516",
    "timestamp":1642648213494
    }
```

请求字段说明如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | 回调请求的唯一标识，格式为 “App Key_同意好友申请事件的消息 ID”。 | 
| `chat_type`       | String | `roster`：用户关系事件。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.roster_ver`    | String   | 好友列表的版本号。  |
| `payload.operation` | String   | `accept`：同意好友申请。接受好友申请的用户会收到该事件。该事件用于单设备或多设备登录场景下的操作结果同步。 |
| `host`            | String   | 服务器名称。          |
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `from`       | String | 发起方，格式为 `App Key_发起方用户 ID@easemob.com`。                                |
| `to`       | String | 接受好友申请的用户 ID。                     |
| `eventType`       | String   | <br/> - `chat`：上行消息<br/> - `chat_offline`：离线消息。       |
| `msg_id`    | String   | 同意好友申请事件的消息 ID。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                             |


## 拒绝好友申请

#### 回调时机

收到好友申请后，[用户通过客户端拒绝添加对方为好友](/document/android/user_relationship.html#添加好友)。

#### 申请方收到该事件

`payload.operation` 为 `remote_decline`，表示发起好友申请的用户会收到该事件。

在这种情况下，`to` 为发起好友申请的用户 ID。 

请求示例如下所示：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966726099692161068",
    "security":"747d6297660e57bcf38315aa98c206ac",
    "payload":{
        "roster_ver":"3D81EC24A6E732B2EB1B654AA446930DB9BAFE59",
        "operation":"remote_decline"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst",
    "eventType":"chat",
    "msg_id":"9XXXX68",
    "timestamp":1642648260029
    }
```

请求字段说明如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | 回调请求的唯一标识，格式为 “App Key_拒绝好友申请事件的消息 ID”。 | 
| `chat_type`       | String | `roster`：用户关系事件。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.roster_ver`    | String   | 好友列表的版本号。  |
| `payload.operation` | String   | `remote_decline`：拒绝好友申请。发起好友申请的用户会收到该事件。 |
| `host`            | String   | 服务器名称。          |
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `from`       | String | 发起方，格式为 `App Key_发起方用户 ID@easemob.com`。                                |
| `to`       | String | 发起好友申请的用户 ID。                                |
| `eventType`       | String   | <br/> - `chat`：上行消息<br/> - `chat_offline`：离线消息。       |
| `msg_id`    | String   | 拒绝好友申请事件的消息 ID。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                             |


#### 拒绝方收到该事件

`payload.operation` 为 `decline`，表示拒绝好友申请的用户会收到该事件。该事件用于多设备登录场景下的操作结果同步。

回调请求示例：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966726099692161068",
    "security":"747d6297660e57bcf38315aa98c206ac",
    "payload":{
        "roster_ver":"3D81EC24A6E732B2EB1B654AA446930DB9BAFE59",
        "operation":"decline"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst11",
    "eventType":"chat",
    "msg_id":"9XXXX68",
    "timestamp":1642648260029
    }
```

请求字段说明如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为回调请求的唯一标识，格式为 “App Key_拒绝好友申请事件的消息 ID”。 | 
| `chat_type`       | String | `roster`：用户关系事件。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.roster_ver`    | String   | 好友列表的版本号。  |
| `payload.operation` | String   | `decline`：拒绝好友申请。拒绝好友申请的用户会收到该事件。该事件用于多设备登录场景下的操作结果同步。 |
| `host`            | String   | 服务器名称。          |
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `from`       | String | 发起方，格式为 `App Key_发起方用户 ID@easemob.com`。                                |
| `to`       | String | 拒绝好友申请的用户 ID。                                |
| `eventType`       | String   | <br/> - `chat`：上行消息<br/> - `chat_offline`：离线消息。       |
| `msg_id`    | String   | 拒绝好友申请事件的消息 ID。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                             |

## 删除好友

#### 回调时机

- [客户端删除了好友](/document/android/user_relationship.html#删除好友)。
- 调用 RESTful API [删除了单个好友](/document/server-side/user_friend_remove.html)。
- 在 [环信控制台](https://console.easemob.com/user/login)上 [删除了好友](/product/console/operation_user.html#删除用户好友)。

#### 请求示例

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX736",
    "security":"2e7XXXX2d7",
    "payload":{
        "roster_ver":"003DD920ADD15B51EB0B806E83BDD97F089B0092",
        "operation":"remove"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst01",
    "eventType":"chat",
    "msg_id":"XXXX463736",
    "timestamp":1642648138571
    }
```

#### 请求字段说明

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | 回调请求的唯一标识，格式为 “App Key_删除好友事件的消息 ID”。 | 
| `chat_type`       | String | `roster`：用户关系事件。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.roster_ver`    | String   | 好友列表的版本号。  |
| `payload.operation` | String   | `remove`：删除好友。 |
| `host`            | String   | 服务器名称。          |
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `from`       | String | 发起方，格式为 `App Key_发起方用户 ID@easemob.com`。                                |
| `to`       | String | 接收方用户 ID。                                |
| `eventType`       | String   | <br/> - `chat`：上行消息<br/> - `chat_offline`：离线消息。        |
| `msg_id`    | String   | 删除好友事件的消息 ID。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                             |

## 拉黑用户

#### 回调时机

1. [通过客户端将用户加入了黑名单](/document/android/user_relationship.html#添加用户到黑名单)。
2. [调用 RESTful API 将用户加入了黑名单](/document/server-side/user_friend_blocklist_add.html)。
3. 在 [环信控制台](https://console.easemob.com/user/login) 上 [将用户加入了黑名单](/product/console/operation_user.html#查看用户黑名单)。 

#### 请求示例

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725184268539960",
    "security":"00f070116668034ddecf3fb7db92087c",
    "payload":{
        "operation":"ban",
        "status":{
            "error_code":"ok"
            }
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst",
    "eventType":"chat",
    "msg_id":"9XXXX0",
    "timestamp":1642648046912
}
```

#### 请求字段说明

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | 回调请求的唯一标识，格式为 “App Key_拉黑用户事件的消息 ID”。 | 
| `chat_type`       | String | `roster`：用户关系事件。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.operation` | String   | `ban`：拉黑用户。 |
| `payload.status`    | object   | 包含 `error_code`。  |
| `payload.status.error_code`    | String   | 操作失败对应的错误码。 |
| `host`            | String   | 服务器名称。          |
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `from`       | String | 发起方，格式为 `App Key_发起方用户 ID@easemob.com`。                                |
| `to`       | String | 接收方用户 ID。                                |
| `eventType`       | String   | <br/> - `chat`：上行消息<br/> - `chat_offline`：离线消息。       |
| `msg_id`    | String   | 拉黑用户事件的消息 ID。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                             |


## 解除拉黑用户

#### 回调时机

1. 用户 [通过客户端将好友移除了黑名单](/document/android/user_relationship.html#将用户从黑名单移除)。
2. [调用 RESTful API 将好友加入了黑名单](/document/server-side/user_friend_blocklist_remove.html)。
3. 在 [环信控制台](https://console.easemob.com/user/login) 上 [将好友移出黑名单](/product/console/operation_user.html#查看用户黑名单)。 

#### 请求示例

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725018736134200",
    "security":"cbe8a5f1ba384107b63ef61637f55cad",
    "payload":{
        "operation":"allow",
        "status":{
            "error_code":"ok"
            }
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst",
    "eventType":"chat",
    "msg_id":"966725018736134200",
    "timestamp":1642648008357
}
```

#### 请求字段说明

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | 回调请求的唯一标识，格式为 “App Key_解除拉黑用户事件的消息 ID”。 | 
| `chat_type`       | String | `roster`：用户关系事件。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.operation` | String   | `allow`：解除拉黑用户。 |
| `payload.status`    | object   | 包含 `error_code`。  |
| `payload.status.error_code`    | String   | 操作失败对应的错误码。 |
| `host`            | String   | 服务器名称。          |
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `from`       | String | 发起方，格式为 `App Key_发起方用户 ID@easemob.com`。                                |
| `to`       | String | 接收方用户 ID。                                |
| `eventType`       | String   | <br/> - `chat`：上行消息<br/> - `chat_offline`：离线消息。       |
| `msg_id`    | String   | 解除拉黑用户事件的消息 ID。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                             |

