# Chat Group and Chat Room Mute List Webhook Events

## Feature overview

After a chat group or chat room member is successfully added to or removed from the mute list, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain information about the mute or unmute and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Add a member to the mute list

### Trigger conditions

1. A [chat group member](/sdk/v5/android/group_members.html#mute-specified-members) or [chat room member](/sdk/v5/android/room_members.html#add-members-to-the-chat-room-mute-list) is added to the mute list on the client.
2. A RESTful API is called to add a [chat group member](/rest/group_member_mute.html) or [chat room member](/rest/chatroom_member_mute.html) to the mute list.

### Webhook request

#### Request example

```json
{
	"callId": "XXX#XXXX_23002282-ff00-4e06-b7bb-e0ff39121c1b",
	"security": "d6114aXXXXf29767f83f4e91150ddef3",
	"payload": {
		"member": [
			"tst01"
		],
		"expire_timestamp": 1729585614955,
		"type": "ADD"
	},
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "MUTE",
	"operator": "@ppAdmin",
	"timestamp": 1729499214968
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.member` | JSON   | User ID of the member added to the mute list. |
| `payload.expire_timestamp` | LONG   | Mute expiration time. After a chat group or chat room member is muted, the system automatically assigns a mute expiration timestamp. |
| `payload.type` | String | Event for adding a member to the mute list. The value is `ADD`. |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `id`           | String | Chat group or chat room ID.                                                |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `MUTE` when a member is added to the chat group or chat room mute list. |
| `operator`     | String | Operator. If an app admin adds the member to the mute list, the value is fixed as `@ppAdmin`.                                      |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |

## Remove a member from the mute list

### Trigger conditions

1. A [chat group member](/sdk/v5/android/group_members.html#unmute-specified-members) or [chat room member](/sdk/v5/android/room_members.html#remove-members-from-the-chat-room-mute-list) is removed from the mute list on the client.
2. A RESTful API is called to remove a [chat group member](/rest/group_member_unmute.html) or [chat room member](/rest/chatroom_member_mute.html) from the mute list.

### Webhook request

#### Request example

```json
{
	"callId": "XXXX#XXXX_e4b07cc0-XXXX-XXXX-b526-1e68bf8cddb5",
	"security": "d880cdeXXXXeb4e85cdeb364dca0b52d",
	"payload": {
		"member": [
			"tst01"
		],
		"type": "REMOVE"
	},
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "MUTE",
	"operator": "@ppAdmin",
	"timestamp": 1729499252371
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.member` | JSON   | User ID of the member removed from the mute list. |
| `payload.type` | String | Event for removing a member from the mute list. The value is `REMOVE`. |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.        |
| `id`           | String | Chat group or chat room ID.                                                |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `MUTE` when a member is removed from the mute list. |
| `operator`     | String | Operator. If an app admin removes the member from the mute list, the value is fixed as `@ppAdmin`.                                      |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
