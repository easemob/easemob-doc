# Chat Group and Chat Room Owner Change Webhook Events

## Feature overview

After the group owner or chat room owner is changed successfully, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the webhook to obtain information about the new owner and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Trigger conditions

- The [group owner](/document/android/group_members.html#change-the-group-owner) or [chat room owner](/document/android/room_members.html#change-the-chat-room-owner) is changed on the client.
- A RESTful API is called to change the [group owner](/document/server-side/group_owner_transfer.html) or [chat room owner](/document/server-side/chatroom_owner_transfer.html).

## Webhook request

### Request example

The following example uses a group owner change event. The fields are the same when the chat room owner is changed.

```json
{
	"callId": "XXXX#XXXX_f8349be2-XXXX-XXXX-96e9-7a3802ef85c8",
	"security": "5ed7072a9XXXX57c2633fe674faaf71",
	"payload": {
		"owner": "tst",
		"new_owner": "tst01",
		"type": "OWNER"
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "UPDATE",
	"operator": "@ppAdmin",
	"timestamp": 1729497333975
}

```

### Request fields

The following field descriptions use a group owner change event as an example. The fields are the same when the chat room owner is changed.

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
|  - `owner`| String | Previous group owner. |
|  - `new_owner`   | String | New group owner. |
|  - `type`   | String | The value is `OWNER`, indicating a group owner change. |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`       | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `UPDATE` when the group owner is changed. |
| `operator`     | String | Operator.                      |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.             |

:::tip
More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.
::
