# Chat Group and Chat Room Allowlist Webhook Events

## Feature overview

After a chat group or chat room member is added to or removed from the allowlist, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the webhook to identify the affected member and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Add a member to the allowlist

### Trigger conditions

- A [chat group member](/document/android/group_members.html#add-members-to-the-allowlist) or [chat room member](/document/android/room_members.html#add-members-to-the-chat-room-allowlist) is added to the allowlist on the client.
- A RESTful API is called to add a [chat group member](/document/server-side/group_allowlist_add_single.html) or [chat room member](/document/server-side/chatroom_allowlist_add_single.html) to the allowlist.

### Webhook request

#### Request example

```json
{
	"callId": "XXXX#XXXX_763084e9-XXXX-XXXX-b550-9196e3163b6b",
	"security": "8131be530aXXXX9108ee0411958b91b9",
	"payload": {
		"member": [
			"tst01"
		],
		"type": "ADD"
	},
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "WHITE",
	"operator": "@ppAdmin",
	"timestamp": 1729499291465
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`.      |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.member` | Array   | User ID of the member added to the allowlist. |
| `payload.type` | String | Event for adding a chat group or chat room member to the allowlist. The value is `ADD`.                                    |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                           |
| `id`           | String | Chat group or chat room ID.                                                |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `WHITE` when a chat group or chat room member is added to the allowlist. |
| `operator`     | String | Operator.                                                       |
| `timestamp`    | Long   | Unix timestamp when the operation is completed. If an app admin adds the chat group or chat room member to the allowlist, the value is fixed as `@ppAdmin`.  |

## Remove a member from the allowlist

### Trigger conditions

1. A [chat group member](/document/android/group_members.html#remove-members-from-the-allowlist) or [chat room member](/document/android/room_members.html#remove-members-from-the-chat-room-allowlist) is removed from the allowlist on the client.
2. A RESTful API is called to remove a [chat group member](/document/server-side/group_allowlist_remove.html) or [chat room member](/document/server-side/chatroom_allowlist_remove.html) from the allowlist.

### Webhook request

#### Request example

```json
{
	"callId": "XXXX#XXXX_7907fe50-15c1-493e-9774-4a628c050fc9",
	"security": "2f73f64eXXXX1f86e9db9ab6ffe746f4",
	"payload": {
		"member": [
			"tst01",
			"tst02"
		],
		"type": "REMOVE"
	},
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "WHITE",
	"operator": "@ppAdmin",
	"timestamp": 1729499336703
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The unique identifier of the webhook request, in the format `App Key_UUID`.      |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `paylod`       | Object | Event content.                                                     |
| `payload.member` | JSON   | User ID of the member removed from the allowlist. |
| `payload.type` | String | Event for removing a chat group or chat room member from the allowlist. The value is `REMOVE`.          |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                           |
| `id`           | String | Chat group or chat room ID.                                                |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `WHITE` when a chat group or chat room member is removed from the allowlist. |
| `operator`     | String | Operator. If an app admin removes the chat group or chat room member from the allowlist, the value is fixed as `@ppAdmin`.                                                       |
| `timestamp`    | Long   | Unix timestamp when the operation is completed. |

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
