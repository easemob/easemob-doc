# 上传/删除群组共享文件事件

上传或删除群组共享文件后，环信服务器会按照[发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看上传或删除的群组共享文件，进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见 [增值服务费用)](/product/pricing_policy.html#增值服务费用)。
2. 如果需要上传或删除群组共享文件的回调事件，你需要在[环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见[配置回调规则](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送后回调的相关介绍，详见[回调说明](/document/server-side/callback_postsending.html)。
:::

## 群组共享文件上传事件

### 回调时机

1. 客户端上传了群组共享文件。
2. 调用 RESTful API 上传了群组共享文件。

### 回调请求

#### 请求示例

```json
{
	"callId": "XXXX#XXXX_ed88a94c-XXXX-XXXX-beba-f016f475156c",
	"security": "ea540aaXXXX33692335ecacacd80992e",
	"payload": {
		"share_file": [
			"e899d500-XXXX-XXXX-af16-6f135fe75dde"
		],
		"type": "ADD"
	},
	"appkey": "XXXX#XXX",
	"id": "test_123",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "SHARE_FILE",
	"operator": "@ppAdmin",
	"timestamp": 1729499506255
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                 |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
|  - `share_file`| String | 上传的群组共享文件。 | 
|  - `type`      | String | 群组共享文件上传事件，值为 `ADD`。 |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `id`           | String | 群组 ID。                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。群组共享文件上传的操作为 `SHARE_FILE`。 |
| `operator`     | String | 操作人。若 app 管理员上传了共享文件，该参数的值固定为 `@ppAdmin`。                     | 
| `timestamp`    | Long   | 操作完成的时间戳。            | 

## 群组共享文件删除事件

### 回调时机

1. 客户端删除了群组共享文件。
2. 调用 RESTful API 删除了群组共享文件。

### 回调请求

#### 请求示例

```json
{
	"callId": "XXXX#XXXX_876e28e5-XXXX-XXXX-825c-5a2d8527f44d",
	"security": "b573959e9b5ddXXXX05cb220500712d6",
	"payload": {
		"share_file": [
			"e899d500-XXXX-XXXX-af16-6f135fe75dde"
		],
		"type": "REMOVE"
	},
	"appkey": "XXXX#XXXX",
	"id": "test_123",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "SHARE_FILE",
	"operator": "@ppAdmin",
	"timestamp": 1729499555559
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                 |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                          |
|  - `share_file`| String | 删除的群组共享文件。                 | 
|  - `type`      | String | 群组共享文件删除事件，值为 `REMOVE`。 |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。   |
| `id`           | String | 群组 ID。                           |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。群组共享文件删除的操作为 `UPDATE`。 |
| `operator`     | String | 操作人。若 app 管理员删除了共享文件，该参数的值固定为 `@ppAdmin`。                     | 
| `timestamp`    | Long   | 操作完成的时间戳。            | 

## 其他说明

**群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。**




