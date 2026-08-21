# Chat Group and Chat Room Admin Change Webhook Events

## Feature overview

After a chat group or chat room admin is successfully added or removed, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the webhook to obtain information about the added or removed admin and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Add an admin

### Trigger conditions

- A [chat group admin](/document/android/group_members.html#add-a-group-admin) or [chat room admin](/document/android/room_members.html#add-a-chat-room-admin) is added on the client.
- A RESTful API is called to add a [chat group admin](/document/server-side/group_admin_add.html) or [chat room admin](/document/server-side/chatroom_admin_add.html).
- In the [EasyIM Console](https://console.easyim.ai/user/login), a [chat group admin](/value-added/moderation/moderation_manual_review.html#chat-group-moderation-management) or [chat room admin](/value-added/moderation/moderation_manual_review.html#chat-room-moderation-management) is added.

### Webhook request

#### Request example

The following example uses the event for adding a chat group admin. The fields are the same when a chat room admin is added.

```json
{
	"callId": "XXXX#XXXX_c74187f1-XXXX-XXXX-87cd-0c5607b777ce",
	"security": "7a219f7d318dbXXXX163aebe845018e1",
	"payload": {
		"admin": [
			"tst028"
		],
		"type": "ADD"
	},
	"appkey": "XXXX#XXXX",
	"id": "259794904612865",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "ADMIN",
	"operator": "tst01",
	"timestamp": 1729499145684
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.admin`| JSON   | User ID of the user added as a chat group or chat room admin. |
| `payload.type` | String | Event for adding a chat group or chat room admin. The value is `ADD`.  |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `ADMIN` when a chat group or chat room admin is added. |
| `operator`     | String | Operator. If an app admin adds the admin, the value is fixed as `@ppAdmin`.        |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.      |


## Remove an admin

### Trigger conditions

- A [chat group admin](/document/android/group_members.html#remove-a-group-admin) or [chat room admin](/document/android/room_members.html#remove-a-chat-room-admin) is removed on the client.
- A RESTful API is called to remove a [chat group admin](/document/server-side/group_delete.html) or [chat room admin](/document/server-side/chatroom_delete.html).

### Webhook request

#### Request example

The following example uses the event for removing a chat group admin. The fields are the same when a chat room admin is removed.

```json
{
	"callId": "XXXX#XXXX_350defcb-XXXX-XXXX-8235-a0873b63ae26",
	"security": "cb8a62aXXXXacda7a1b781b85ff547a4",
	"payload": {
		"admin": [
			"tst01"
		],
		"type": "REMOVE"
	},
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "ADMIN",
	"operator": "tst",
	"timestamp": 1729499013517
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.admin`| JSON   | User ID of the removed chat group or chat room admin. |
| `payload.type` | String | Event for removing a chat group or chat room admin. The value is `REMOVE`.    |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `ADMIN` when a chat group or chat room admin is removed. |
| `operator`     | String | Operator. If an app admin removes the admin, the value is fixed as `@ppAdmin`.         |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.      |

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
