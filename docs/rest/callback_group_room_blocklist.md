# Chat Group and Chat Room Blocklist Webhook Events

## Feature overview

When a chat group or chat room member is added to or removed from the blocklist, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to identify the affected member and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Add a member to the blocklist

After a member is added to the chat group or chat room blocklist, they are removed from the chat group or chat room. For the removal webhook event, see [Leave after being added to the blocklist](callback_group_room_leave.html#leave-after-being-added-to-the-blocklist).

### Trigger conditions

- A [chat group member](/sdk/v5/android/group_members.html#add-members-to-the-blocklist) or [chat room member](/sdk/v5/android/room_members.html#add-members-to-the-chat-room-allowlist) is added to the blocklist on the client.
- A RESTful API is called to add a [chat group member](/rest/group_member_blocklist_add_single.html) or [chat room member](/rest/chatroom_allowlist_add_single.html) to the blocklist.

### Webhook request

#### Request example

```json
{
	"callId": "XXXX#XXXX_e2bf62d5-XXXX-XXXX-8664-d011f9d4ccbf",
	"security": "d0b53a5aXXXX3fdf42ca362737983392",
	"payload": {
		"member": [
			"tst02"
		],
		"expire_timestamp": 4638873600000,
		"type": "ADD"
	},
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "BLOCK",
	"operator": "tst",
	"timestamp": 1729498876236
}

```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The unique identifier of the webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `paylod`       | Object | Event content.                                                     |
| `payload.member` | Array | User ID of the user added to or removed from the chat group or chat room blocklist.        |
| `payload.expire_timestamp` | Long | Expiration time of the user's blocklist entry. The system automatically assigns this value after the user is added to the blocklist.  |
| `payload.type` | String  | Event type. `ADD` indicates that a user is added to the chat group or chat room blocklist.     |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | The value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `BLOCK` when a user is added to the chat group or chat room blocklist. |
| `operator`     | String | Operator. If an app admin adds the member to the blocklist, the value is fixed as `@ppAdmin`.                         |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                |

## Remove a member from the blocklist

### Trigger conditions

1. A member is removed from the chat group or chat room blocklist on the client.
2. A RESTful API is called to remove a member from the [chat group blocklist](/rest/group_allowlist_remove.html) or chat room blocklist.
3. A user is removed from the chat group or chat room blocklist in the [EasyIM Console](https://console.easyim.ai/user/login).

### Webhook request

#### Request example

```json
{
	"callId": "XXXX#XXXX_0fb0c3cf-XXXX-XXXX-9eb8-e9b756c83ec4",
	"security": "3c10eae0ec4aXXXX891a85ea974f75ca",
	"payload": {
		"member": [
			"tst07"
		],
		"type": "REMOVE"
	},
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "BLOCK",
	"operator": "@ppAdmin",
	"timestamp": 1729499386434
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.member` | Array | User ID of the user removed from the chat group or chat room blocklist.        |
| `payload.type` | Array  | Event for removing a user from the chat group or chat room blocklist. The value is `REMOVE`.     |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `BLOCK` when a user is removed from the chat group or chat room blocklist. |
| `operator`     | String | Operator. If an app admin removes the member from the blocklist, the value is fixed as `@ppAdmin`.                       |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.  |

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
