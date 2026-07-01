# 群组和聊天室删除回调事件

## 功能说明

成功删除群组或聊天室后，环信服务器会按照 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调进行数据同步。

## 前提条件

- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则。详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。
 
## 回调时机

- 用户通过客户端删除了 [群组](/document/android/group_manage.html#解散群组)/[聊天室](/document/android/room_manage.html#解散聊天室)。
- 用户调用 RESTful API 解散了 [群组](/document/server-side/group_delete.html)/[聊天室](/document/server-side/chatroom_delete.html)。
- 用户在 [环信控制台](https://console.easemob.com/user/login)删除了 [群组](/product/console/operation_group.html#删除群组)/[聊天室](/product/console/operation_chatroom.html#删除聊天室)。

## 回调请求

### 请求示例

```json
{
	"callId": "XXXX#XXXX_2e962475-XXXX-XXXX-a90c-d7e2949440f2",
	"security": "4e5d778c77dXXXXab41ed2528594e449",
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "DELETE",
	"operator": "@ppAdmin",
	"timestamp": 1729499587640
}
```

### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | 回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。  |
| `id`           | String | 群组/聊天室 ID。                                                 |
| `type`         | String | 区分群组或聊天室事件：<br/> - `GROUP`：群组 <br/> - `CHATROOM` ：聊天室   |
| `event`        | String | 对于群组和聊天室，该参数的值固定为 `group_op_event`。接收方可按此字段区分是否是群组/聊天室操作事件。 | 
| `operation`    | String | 操作。群组/聊天室删除的操作为 `DELETE`。 |
| `operator`     | String | 操作人。                               | 
| `timestamp`    | Long   | 操作完成的时间戳。                      | 