# 群组和聊天室全员禁言回调事件

## 功能说明

群组/聊天室全员禁言或解除禁言后，环信服务器会按照 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调查看全员禁言状态，进行数据同步。

## 前提条件

- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则。详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 全员禁言/解除禁言

### 回调时机

- 客户端将 [群组](/document/android/group_members.html#开启全员禁言)/[聊天室全员禁言或解除了全员禁言](/document/android/room_members.html#开启和关闭聊天室全员禁言)。
- 调用 RESTful API 将 [群组](/document/server-side/group_member_mute_all.html)/[聊天室全员禁言或解除了全员禁言](/document/server-side/chatroom_member_mute_all.html)。
- 在 [环信控制台](https://console.easemob.com/user/login) 将 [群组](/product/console/operation_group.html#群组审核管理)/[聊天室全员禁言或解除了全员禁言](/product/console/operation_chatroom.html#聊天室审核管理)。
 
### 回调请求

#### 请求示例

```json
{
	"callId": "XXXX#XXXX_2b17ccf8-XXXX-XXXX-9592-0ebd9221afd7",
	"security": "17761ffeXXXX17e27eeec4a651549c85",
	"payload": {
		"mute": true,
		"type": "MUTE"
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "UPDATE",
	"operator": "@ppAdmin",
	"timestamp": 1729497065641
}
```

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。      |
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `paylod`       | Object | 事件内容。                                                     |
| `payload.mute` | JSON   | 全员禁言或解除全员禁言：<br/> - `true`：全员禁言 <br/> - `false`：解除全员禁言 | 
| `payload.type` | String | 全员禁言/解除全员禁言事件，值为 `MUTE`。        |
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                           |
| `id`           | String | 群组/聊天室 ID。                                                |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室     |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 |
| `operation`    | String | 操作。群组/聊天室的全员禁言的操作为 `UPDATE`。 |
| `operator`     | String | 操作人。若 app 管理员将群组/聊天室全员禁言或解除禁言，该参数的值固定为 `@ppAdmin`。     |
| `timestamp`    | Long   | 操作完成的时间戳。  |


## 其他说明

**群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。**












