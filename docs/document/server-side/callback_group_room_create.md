# 创建群组/聊天室事件 
成功创建群组或聊天室后，环信服务器会按照[发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看创建的群组/聊天室的信息，进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见[增值服务说明](/product/pricing.html#增值服务费用)。
2. 如果需要创建群组/聊天室的回调事件，你需要在[环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见[配置回调规则](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送后回调的相关介绍，详见[回调说明](/document/server-side/callback_postsending.html)。
:::
 
## 回调时机

1. 客户端创建了群组/聊天室。
2. 调用 RESTful API 创建了群组/聊天室。
3. 在[环信控制台](https://console.easemob.com/user/login)上创建了群组/聊天室。 

## 回调请求

### 请求示例

下面的请求示例为创建群组的事件，创建聊天室的字段与其相同。

```json
{
	"callId": "XXXX#XXXX_cfc0d78c-XXXX-XXXX-b687-8b84107a798b",
	"security": "4930bcf03103aXXXX632eadd9b36b6c7",
	"payload": {
		"role": {
			"tst": "owner",
			"abc": "admin"
		},
		"member": ["abc"],
		"info": { 
			"owner": "XXXX#XXXX_tst",
			"created": "1729496598199",
			"custom": "",
			"description": "描述",
			"mute": "false",
			"avatar": "https://XXXX/XXXX/XXXX",
			"title": "测试01",
			"max_users": "200",
			"invite_need_confirm": "true",
			"public": "true",
			"allow_user_invites": "false",
			"disabled": "false",
			"last_modified": "1729496598199"
		}
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "CREATE",
	"operator": "tst",
	"timestamp": 1729496598231
}

```

### 请求字段说明

以下以创建群组的事件为例进行介绍，聊天室的字段与其相同。

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.role` | JSON | 群组角色。若设置了管理员，显示管理员角色，若未设置，则只显示群组角色：<br/> - 用户 ID：`owner`<br/> - 用户 ID：`admin` | 
| `payload.member`| Array | 创建群组时拉入群的用户。    | 
| `payload.info`   | JSON | 新群组的相关信息。除了以下参数，其他群组参数详见[创建群组 RESTful API](/document/server-side/group_manage.html#创建群组)。<br/> - `title`：String 类型，群组名称。 <br/> - `disabled` ：Boolean 类型，取值为 `false`，表示群组为非禁用状态，可正常使用。 <br/> - `last_modified`：Long 类型，群组信息的最新修改时间。   |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。                                |
| `id`           | String | 群组/聊天室 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室     |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 |
| `operation`    | String | 操作。创建群组的操作为 `CREATE`。 |
| `operator`     | String | 操作人。若 app 管理员创建了群组，该参数的值固定为 `@ppAdmin`。         |
| `timestamp`    | Long   | 操作完成的时间戳。                                                       | 

