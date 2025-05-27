# 群组/聊天室加人事件 

在群组或聊天室创建时拉人进入、邀请用户加入、或用户申请加入时，环信服务器会按照 [发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调进行数据同步。

:::tip
1. 你所使用的环信即时通讯 IM 的版本可能需要单独开通回调服务，详见  [增值服务费用)](/product/pricing_policy.html#增值服务费用)。
2. 如果需要群组/聊天室加人的回调事件，你需要在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则，详见 [配置回调规则](/product/enable_and_configure_IM.html#配置回调规则)。
3. 发送后回调的相关介绍，详见 [回调说明](/document/server-side/callback_postsending.html)。
:::

## 直接加入

### 回调时机

- 客户端创建群组或聊天室时直接将用户拉入。
- 客户端加入聊天室。
- 调用 RESTful API 创建群组或聊天室时直接将用户拉入。

### 回调请求

#### 请求示例

下面的请求示例为创建群组或聊天室时拉人或客户端加入聊天室的事件。

```json
{
	"callId": "XXXX#XXXX_34092a82-XXXX-XXXX-aa2e-aefeb0bb5a65",
	"security": "0b787dc5dXXXXdeb1e9ffe8803d01eaa",
	"payload": {
		"member": [
			"tst01"
		],
		"type": "DIRECT"
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "JOIN",
	"operator": "@ppAdmin",
	"member_count": 4,
	"timestamp": 1729497286675
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见 [配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.member` | JSON | <br/> - 创建群组或聊天室时，被拉入进群/聊天室的用户 ID。 <br/> - 用户主动加入聊天室时，该用户的 ID。       | 
| `payload.type` | Array  | 加入方式：`DIRECT` 表示创建群组或聊天室时拉人进入或用户主动加入聊天室。     |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `id`           | String | 群组/聊天室 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。用户加入群组/聊天室操作的为 `JOIN`。 |
| `operator`     | String | <br/> - 将用户拉入群组/聊天室的操作人。<br/> - 主动加入聊天室的用户 ID。                     | 
| `member_count`     | Int | 当前群组/聊天室的成员数。                     | 
| `timestamp`    | Long   | 操作完成的时间戳。          | 

## 邀请用户入群 

### 回调时机

普通群成员通过客户端邀请用户入群，用户成功入群。

**聊天室无此事件。**

### 回调请求

#### 请求示例

```json
{
	"callId": "XXXX#XXXX_643c3149-f7cc-4492-8341-c7473ee63f86",
	"security": "1ed483cf9cXXXXb78f99c1e0c4292d41",
	"payload": {
		"member": [
			"tst0"
		],
		"type": "INVITE"
	},
	"appkey": "XXXX#XXXX",
	"id": "262424566497281",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "JOIN",
	"operator": "tst0",
	"member_count": 4,
	"timestamp": 1729665977191
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见 [配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.member`| JSON  | 被邀请的用户 ID。        | 
| `payload.type` | Array  | 入群方式：`INVITE` 表示邀请用户入群。     |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `id`           | String | 群组 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室  <br/> 由于聊天室无此事件，因此该参数只能为 `GROUP`。 |
| `event`        | String | 群组操作事件，值为 `group_op_event`。 | 
| `operation`    | String | 操作。用户加入群组的操作为 `JOIN`。 |
| `operator`     | String | 操作人。                                 | 
| `member_count`     | Int | 新用户加入后，群组的总成员数。                     |
| `timestamp`    | Long   | 操作完成的时间戳。                             | 

## 申请加入

### 回调时机

用户通过客户端申请方式成功加入群组/聊天室。

### 回调请求

#### 请求示例

下面以用户申请加入群组的事件为例进行介绍，聊天室的字段与其相同。

```json
{
	"callId": "XXXX#XXXX_c158594d-1165-4641-8336-68125ba68a22",
	"security": "1824c552acXXXXb0bf1c80160c65a1d0",
	"payload": {
		"member": [
			"tst"
		],
		"type": "APPLY"
	},
	"appkey": "XXXX#XXXX",
	"id": "261958837272578",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "JOIN",
	"operator": "tst",
	"member_count": 4,
	"timestamp": 1729497831163
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见 [配置环信控制台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。|
| `paylod`       | Object | 事件内容。                                                     |
| `payload.member` | JSON | 申请加入的用户 ID。        | 
| `payload.type`| Array | 加入方式：`APPLY` 表示申请入群。     |
| `appkey`       | String | 你在环信管理后台注册的应用唯一标识。  |
| `id`       | String | 群组/聊天室 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。用户加入群组/聊天室操作的为 `JOIN`。 |
| `operator`     | String | 操作人。                     | 
| `member_count`     | Int | 新用户加入后，群组/聊天室的总成员数。                     |
| `timestamp`    | Long   | 操作完成的时间戳。            | 

## 其他说明

**群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。**


