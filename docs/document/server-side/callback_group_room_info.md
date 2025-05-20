# 更新群组/聊天室信息事件

成功更新群组/聊天室信息后，环信服务器会按照[发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看更新后的群组/聊天室的信息，进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见 [增值服务费用)](/product/pricing_policy.html#增值服务费用)。
2. 如果需要群组/聊天室信息更新的回调事件，你需要在[环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见[配置回调规则](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送后回调的相关介绍，详见[回调说明](/document/server-side/callback_postsending.html)。
:::
 
## 回调时机

通过客户端、RESTful API 或在[环信控制台](https://console.easemob.com/user/login)修改群组/聊天室的以下信息时会触发该事件：

1. 群组
- 群组名称
- 群组描述
- 群组最大成员数
- 加入群组是否需要群主或者群管理员审批
- 是否允许群成员邀请别人加入此群
- 受邀人加入群组前是否需接受入群邀请
- 群组扩展信息
- 是否是公开群

2. 聊天室
- 聊天室名称
- 聊天室描述 
- 聊天室最大成员数  

## 回调请求

### 请求示例

下面的请求示例为更新群组信息的事件：

```json
{
	"callId": "XXXX#XXXX_0679c3e3-XXXX-XXXX-8900-0cca0f24198e",
	"security": "4249dff0f1XXXX084cd9eebe4b4781e7",
	"payload": {
		"type": "INFO",
		"info": {
			"owner": "XXXX#XXXX_tst",
			"created": "1729496598199",
			"custom": "",
			"description": "描述",
			"mute": "false",
			"mute_duration": -1,
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
	"operation": "UPDATE",
	"operator": "@ppAdmin",
	"timestamp": 1729497138792
}
```

### 请求字段说明

以下以创建群组的事件为例进行字段介绍：

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
|  - `type`| String |     | 群组信息修改事件。 |
|  - `info`   | JSON | 修改后的群组信息。<br/> - `owner`：String 类型，群主。<br/> - `created`：Long 类型，群组创建时间。<br/> - `custom`：String 类型，群组自定义信息。<br/> - `description`：String 类型，群组描述。<br/> - `mute`：Bool 类型，是否进行全员禁言，`true` 表示是，`false` 表示否。<br/> - `mute_duration`：Long 类型，全员禁言时长，从当前时间开始计算。单位为秒。`0` 表示取消禁言，`-1` 表示永久禁言。<br/> - `avatar`：String，群组头像 URL。<br/> - `title`：String 类型，群组名称。<br/> - `max_users`：群组最大成员数（包括群主）。<br/> - `invite_need_confirm`：Bool 类型，邀请用户入群时是否需要被邀用户同意，`true` 表示需要被邀用户同意，`false` 表示不需要。<br/> - `public`：Bool 类型，是否是公开群, `true` 表示公开群，`false` 表示私有群。<br/> - `allow_user_invites`：Bool 类型，是否允许普通群成员邀请用户加入群组，`true` 表示允许，`false` 表示不允许，只有群主和群管理员才能邀请用户入群。<br/> - `disabled`：Boolean 类型，`true` 表示群组为禁用状态，`false`，表示群组为非禁用状态，可正常使用。 <br/> - `last_modified`：Long 类型，群组信息的最新修改时间。 |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。           |
| `id`       | String | 群组 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。修改群组信息的操作为 `UPDATE`。 |
| `operator`     | String | 操作人。                     | 
| `timestamp`    | Long   | 操作完成的时间戳。                | 

:::tip
群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。
::

