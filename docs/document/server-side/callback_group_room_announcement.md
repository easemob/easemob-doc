# 群组/聊天室公告事件

设置或更新群组/聊天室公告后，环信服务器会按照[发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看公告信息，进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见 [增值服务费用)](/product/pricing_policy.html#增值服务费用)。
2. 如果需要群组/聊天室公告事件的回调事件，你需要在[环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见[配置回调规则](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送后回调的相关介绍，详见[回调说明](/document/server-side/callback_postsending.html)。
:::

## 回调时机

1. 客户端设置或更新了群组/聊天室公告。
2. 调用 RESTful API 设置/更新了群组/聊天室公告。
3. 在[环信控制台](https://console.easemob.com/user/login)设置或更新了群组/聊天室公告。

## 回调请求

### 请求示例

```json
{
	"callId": "XXXX#XXXX_b9a9862f-XXXX-XXXX-acf5-8816f0303c7c",
	"security": "de170d1c00XXXX9f294306ec72831d53",
	"payload": {
		"type": "ANNOUNCEMENT",
		"announcement": "公告"
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "UPDATE",
	"operator": "tst",
	"timestamp": 1729496921620
}
```

### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `paylod`       | Object | 事件内容。                                                     |
|  - `type` | String | 公告更新事件。 | 
|  - `announcement`   | String | 新公告内容。若删除了公告内容，则该字段不存在。 |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `id`       | String | 群组 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。设置或更新群组公告的操作为 `UPDATE`。 |
| `operator`     | String | 操作人。若 app 管理员设置或更新了公告，该参数的值固定为 `@ppAdmin`。 | 
| `timestamp`    | Long   | 操作完成的时间戳。                | 

:::tip
群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。
:::
