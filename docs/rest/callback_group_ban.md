# Chat Group Ban Status Change Webhook Events

## Feature overview

After a chat group is successfully banned or unbanned, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the webhook to obtain information about the ban or unban and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Trigger conditions

This event is triggered when you call a RESTful API to [ban](/document/server-side/group_ban.html) or [unban a chat group](/document/server-side/group_unban.html).

## Webhook request

### Request example

```json
{
	"callId": "XXXX#XXXX_9536cc9b-XXXX-XXXX-affb-8eaf67741180",
	"security": "2106f88ddbaXXXX57c60430493e74dc3",
	"payload": {
		"disable": true,
		"type": "DISABLE"
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "UPDATE",
	"operator": "@ppAdmin",
	"timestamp": 1729497011797
}
```

### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `paylod`       | Object | Event content.                                                     |
|  - `disabled`| Boolean | <br/> - `true`: Ban  <br/> - `false`: Unban |
|  - `type`   | String | `DISABLE`: A ban or unban operation.  |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`       | String | Chat group ID.                                                 |
| `type`         | String | Distinguishes a chat group event from a chat room event. Because chat rooms do not have ban or unban events, this event applies only to chat groups, and the value can only be `GROUP`.   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `UPDATE` for banning or unbanning a chat group. |
| `operator`     | String | Operator.                     |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                |

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
