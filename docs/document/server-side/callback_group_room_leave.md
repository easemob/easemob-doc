# 群组/聊天室成员离开事件 

在群组或聊天室中的成员离开时，包括主动退出、被踢出以及被加入群组/聊天室黑名单时退出，环信服务器会按照 [发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调查看离开的成员，进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见  [增值服务费用)](/product/pricing_policy.html#增值服务费用)。
2. 如果需要群组/聊天室成员离开的回调事件，你需要在 [环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见 [配置回调规则](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送后回调的相关介绍，详见 [回调说明](/document/server-side/callback_postsending.html)。
:::

## 主动退出

### 回调时机

1. 通过客户端主动退出了群组/聊天室。
2. 由于网络等原因，用户离线 2 分钟后退出了聊天室。

### 回调请求

#### 请求示例

以下以主动退出群组的事件为例进行介绍，聊天室的字段与其相同。

```json
{
	"callId": "XXXX#XXXX_e90431f3-XXXX-XXXX-9bbb-231c371c7acb",
	"security": "e452d25366abXXXX2138fffa4b06726a",
	"payload": {
		"member": [
			"tst"
		],
		"type": "QUIT"
	},
	"appkey": "XXXX#XXXX",
	"id": "261958837272578",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "LEAVE",
	"operator": "tst",
	"member_count": 4,
	"timestamp": 1729497862844
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见 [配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.member` | JSON | 退出群组/聊天室的用户 ID。        | 
| `payload.type` | Array  | 退出方式：`QUIT` 表示主动退出群组或聊天室或者因离线退出聊天室。     |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `id`           | String | 群组/聊天室 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。用户主动退出群组/聊天室的操作为 `LEAVE`。 |
| `operator`     | String | 操作人。                     | 
| `member_count`     | Int | 用户退出后，群组/聊天室的总成员数。                     |
| `timestamp`    | Long   | 操作完成的时间戳。             | 

## 被踢

### 回调时机 

1. 通过客户端将用户踢出群组/聊天室。
2. 调用 RESTful API 将用户踢出群组/聊天室。
3. 在[环信控制台](https://console.easemob.com/user/login)将用户踢出群组/聊天室。

### 回调请求

#### 请求示例

下面以用户被踢出群组的事件为例进行介绍，聊天室的字段与其相同。

```json
{
	"callId": "XXXX#XXXX_3667067f-ac06-XXXX-96aa-a9a708c3b361",
	"security": "b77b545b538XXXXbb72e4cf2395050c3",
	"payload": {
		"member": [
			"tst01"
		],
		"type": "KICK"
	},
	"appkey": "XXXX#XXXX",
	"id": "254636824002561",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "LEAVE",
	"operator": "tst",
	"member_count": 4,
	"timestamp": 1729497896834
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.member` | JSON | 被踢出群组/聊天室的用户 ID。        | 
| `payload.type` | Array  | 退群方式：`KICK` 表示将用户踢出群组/聊天室。     |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `id`           | String | 群组/聊天室 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。将用户踢出群组/聊天室的操作为 `LEAVE`。 |
| `operator`     | String | 操作人。                     | 
| `member_count`     | Int | 用户被踢出后，群组/聊天室的总成员数。                     |
| `timestamp`    | Long   | 操作完成的时间戳。             | 


## 加入黑名单后退出

### 回调时机 

1. 通过客户端将用户加入群组/聊天室黑名单时退出群组/聊天室。
2. 调用 RESTful API 将用户加入群组/聊天室黑名单时退出群组/聊天室。
3. 在[环信控制台](https://console.easemob.com/user/login)将用户加入群组/聊天室黑名单时退出群组/聊天室。

### 回调请求

#### 请求示例

下面以用户被加入群组黑名单的事件为例进行介绍，聊天室的字段与其相同。

```json
{
	"callId": "XXXX#XXX_7dc24fac-3451-421e-a8aa-70ba0587e69d",
	"security": "9b30e4c2bXXXXcd51ef730836d427965",
	"payload": {
		"member": [
			"tst02"
		],
		"type": "BLOCK"
	},
	"appkey": "XXXX#XXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "LEAVE",
	"operator": "tst",
	"member_count": 4,
	"timestamp": 1729498876236
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.member` | JSON | 被加入群组/聊天室黑名单后离开的用户 ID。        | 
| `payload.type` | Array  | 退群方式：`BLOCK` 表示加入群组/聊天室黑名单后离开群组/聊天室。     |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `id`           | String | 群组/聊天室 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。将用户踢出群组/聊天室的操作为 `LEAVE`。 |
| `operator`     | String | 操作人。                     | 
| `member_count`     | Int | 用户加入黑名单后，群组/聊天室的总成员数。                     |
| `timestamp`    | Long   | 操作完成的时间戳。                | 

## 因解散群组/聊天室导致的用户退出

### 回调时机 

1. 通过客户端解散群组/聊天室时用户退出。
2. 调用 RESTful API 解散群组/聊天室时用户退出。
3. 在[环信控制台](https://console.easemob.com/user/login)解散群组/聊天室时用户退出。

### 回调请求

#### 请求示例

```json
{
    "callId": "XXXX#XXX_7dc24fac-3451-421e-a8aa-70ba0587e69d",
	"security": "9b30e4c2bXXXXcd51ef730836d427965",
    "id": "267575861772289",
    "operation": "LEAVE",
    "operator": "@ppAdmin",
    "payload":  {
        "member":  [
            "user1",
            "user2",
            "user3"
        ],
        "type": "DELETE"
    },
    "appkey": "XXXX#XXX_7dc24fac-3451-421e-a8aa-70ba0587e69d",
	"event": "group_op_event",
    "timestamp": 1734597600148,
    "type": "GROUP"
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。| 
| `id`           | String | 群组/聊天室 ID。                                                 |
| `operation`    | String | 操作。用户退出群组/聊天室的操作为 `LEAVE`。 |
| `operator`     | String | 操作人。                     | 
| `payload`       | Object | 事件内容。                                                     |
| `payload.member` | JSON | 群组/聊天室被解散后离开的用户 ID。        | 
| `payload.type` | Array  | 退群方式：`DELETE` 表示群组/聊天室被解散后，用户离开群组/聊天室。     |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                | 
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |

## 其他说明

**群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。**



