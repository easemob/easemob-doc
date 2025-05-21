 # 群组封禁/解禁事件

成功封禁或解禁群组后，环信服务器会按照[发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看群组封禁或解禁相关信息，进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见 [增值服务费用)](/product/pricing_policy.html#增值服务费用)。
2. 如果需要群组封禁或解禁的回调事件，你需要在[环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见[配置回调规则](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送后回调的相关介绍，详见[回调说明](/document/server-side/callback_postsending.html)。
:::
 
## 回调时机

[调用 RESTful API 封禁](/document/server-side/group_manage.html#封禁群组)或[解禁了群组](/document/server-side/group_manage.html#解禁群组)时触发该事件。

## 回调请求

### 请求示例

```json
{
	"callId": "XXXX#XXXX_9536cc9b-XXXX-XXXX-affb-8eaf67741180",
	"security": "2106f88ddbaXXXX57c60430493e74dc3",
	"payload": {
		"disable": true,
		"type": "DISABLE"
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "UPDATE",
	"operator": "@ppAdmin",
	"timestamp": 1729497011797
}
```

### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `paylod`       | Object | 事件内容。                                                     |
|  - `disabled`| Boolean | <br/> - `true`：封禁  <br/> - `false`：解禁 |
|  - `type`   | String | `DISABLE`：封禁或解禁操作。  |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `id`       | String | 群组 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件。由于聊天室无封禁或解禁事件，本次事件仅对群组有效，因此值只能为 `GROUP`。   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。群组封禁或解禁的操作为 `UPDATE`。 |
| `operator`     | String | 操作人。                     | 
| `timestamp`    | Long   | 操作完成的时间戳。                | 

:::tip
群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。
::

