# 屏蔽/解除屏蔽群组事件 

成功屏蔽/解除屏蔽群组后，环信服务器会按照[发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看群组屏蔽/解除屏蔽的信息，进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见 [增值服务费用)](/product/pricing_policy.html#增值服务费用)。
2. 如果你需要屏蔽/解除屏蔽群组的事件，你需要在[环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见[配置回调规则](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送后回调的相关介绍，详见[回调说明](/document/server-side/callback_postsending.html)。
:::

## 屏蔽群组

### 回调时机

客户端屏蔽了群组。

### 回调请求

#### 请求示例

```json
{
    "callId": "XXXX#XXXX_a64cbdc6-XXXX-XXXX-81b0-b64285c5f711",
    "security": "eed92d60XXXXa3f30c39b111fc0dfffa",
    "payload": {
        "type": "ADD"
    },
    "appkey": "XXXX#XXXX",
    "id": "test_123",
    "type": "GROUP",
    "event": "group_op_event",
    "operation": "SHIELD",
    "operator": "wzy",
    "timestamp": 1732518372734
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.type` | String | 屏蔽群组事件，值为 `ADD`。 |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。                                |
| `id`           | String | 群组/聊天室 ID。                                                |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室     |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 |
| `operation`    | String | 操作。屏蔽群组的操作为 `SHIELD`。 |
| `operator`     | String | 操作人。若 app 管理员屏蔽群组，该参数的值固定为 `@ppAdmin`。                                      |
| `timestamp`    | Long   | 操作完成的时间戳。                             |

## 解除屏蔽群组

### 回调时机

客户端解除屏蔽了群组。

### 回调请求

#### 请求示例

```json
{
    "callId": "XXXX#XXXX_124b1da0-XXXX-XXXX-8b2f-d5d376c3ad16",
    "security": "895b3f0dfXXXX0a8efb6104d67232961",
    "payload": {
        "type": "REMOVE"
    },
    "appkey": "XXXX#XXXX",
    "id": "test_123",
    "type": "GROUP",
    "event": "group_op_event",
    "operation": "SHIELD",
    "operator": "wzy",
    "timestamp": 1732518426833
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `paylod`       | Object | 事件内容。                                                     |
| `payload.type` | String | 解除屏蔽群组事件，值为 `REMOVE`。 |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。                                |
| `id`           | String | 群组/聊天室 ID。                                                |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室     |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 |
| `operation`    | String | 操作。解除屏蔽群组的操作为 `SHIELD`。 |
| `operator`     | String | 操作人。若 app 管理员解除屏蔽群组，该参数的值固定为 `@ppAdmin`。             |
| `timestamp`    | Long   | 操作完成的时间戳。                             |

## 其他说明

**群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。**
