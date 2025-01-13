# 更新群组/聊天室信息事件

成功更新群组/聊天室信息后，环信服务器会按照[发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看更新后的群组/聊天室的信息，进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见[增值服务说明](/product/pricing.html#增值服务费用)。
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
			"description": "updategroupinfo123",
			"scale": "large", 
			"title": "This is Newgroup0912",
			"last_modified": "1729497138786",
			"max_users": 2000
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
|  - `info`   | JSON | 修改后的群组信息。 |
|  - `info.description`   | String | 群组描述。    |
|  - `info.scale`   | String | 该字段只对群组信息更新事件有效，对聊天室事件无效。该字段为系统字段，开发者可忽略。若 `maxusers` 超过了普通群的最大人数限制，系统自动将该参数的值设为 `large`。设置后，即使群人数减少，该参数的值仍不变。    | 
|  - `info.title`   | String | 群组名称。    |
|  - `info.last_modified`   | Long | 群组的最新修改时间。    |
|  - `info.max_users`   | Int | 群组最大成员数（包括群主）。    |
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

