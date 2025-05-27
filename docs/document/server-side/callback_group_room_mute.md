# 将群组/聊天室成员添加或移出禁言列表的事件 

成功将群组或聊天室成员添加或移出禁言列表后，环信服务器会按照[发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看成员禁言/解除禁言的信息，进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见 [增值服务费用)](/product/pricing_policy.html#增值服务费用)。
2. 如果需要将群组或聊天室成员添加或移出禁言列表的事件，你需要在[环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见[配置回调规则](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送后回调的相关介绍，详见[回调说明](/document/server-side/callback_postsending.html)。
:::

## 将成员加入禁言列表

### 回调时机

1. 客户端将群组或聊天室成员加入了禁言列表。
2. 调用 RESTful API 将群组或聊天室成员加入了禁言列表。
3. 在[环信控制台](https://console.easemob.com/user/login)将群组或聊天室成员加入了禁言列表。

### 回调请求

#### 请求示例

```json
{
	"callId": "XXX#XXXX_23002282-ff00-4e06-b7bb-e0ff39121c1b",
	"security": "d6114aXXXXf29767f83f4e91150ddef3",
	"payload": {
		"member": [
			"tst01"
		],
		"expire_timestamp": 1729585614955,
		"type": "ADD"
	},
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "MUTE",
	"operator": "@ppAdmin",
	"timestamp": 1729499214968
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.member` | JSON   | 被加入禁言列表的成员的用户 ID。 |
| `payload.expire_timestamp` | LONG   | 禁言过期时间。将群组或聊天室成员禁言后，系统会自动分配一个禁言过期时间戳。 |
| `payload.type` | String | 将成员加入禁言列表的事件，值为 `ADD`。 |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。                                |
| `id`           | String | 群组/聊天室 ID。                                                |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM`：聊天室     |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 |
| `operation`    | String | 操作。将成员加入群组/聊天室的禁言列表的操作为 `MUTE`。 |
| `operator`     | String | 操作人。若 app 管理员将成员加入禁言列表，该参数的值固定为 `@ppAdmin`。                                      |
| `timestamp`    | Long   | 操作完成的时间戳。                             |

## 将成员移出禁言列表

### 回调时机

1. 客户端将群组/聊天室成员移出了禁言列表。
2. 调用 RESTful API 将群组/聊天室成员移出了禁言列表。
3. 在 [环信控制台](https://console.easemob.com/user/login) 将群组/聊天室成员移出了禁言列表。

### 回调请求

#### 请求示例

```json
{
	"callId": "XXXX#XXXX_e4b07cc0-XXXX-XXXX-b526-1e68bf8cddb5",
	"security": "d880cdeXXXXeb4e85cdeb364dca0b52d",
	"payload": {
		"member": [
			"tst01"
		],
		"type": "REMOVE"
	},
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "MUTE",
	"operator": "@ppAdmin",
	"timestamp": 1729499252371
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 |
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.member` | JSON   | 被移出禁言列表的成员的用户 ID。 | 
| `payload.type` | String | 将成员移出禁言列表的事件，值为 `REMOVE`。 |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。        |
| `id`           | String | 群组/聊天室 ID。                                                |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室     |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 |
| `operation`    | String | 操作。将成员移出禁言列表的操作为 `MUTE`。 |
| `operator`     | String | 操作人。若 app 管理员将成员移出禁言列表，该参数的值固定为 `@ppAdmin`。                                      |
| `timestamp`    | Long   | 操作完成的时间戳。                             |

## 其他说明

**群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。**















