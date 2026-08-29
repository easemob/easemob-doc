# Chat Group and Chat Room Information Update Webhook Events

## Feature overview

After chat group or chat room information is updated successfully, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain the updated information and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

This event is triggered when any of the following chat group or chat room information is modified through the [client](/sdk/v5/android/group_attributes.html) or a [RESTful API](/rest/group_modify.html):

1. Chat group
- Chat group name
- Chat group description
- Maximum number of chat group members
- Whether joining the chat group requires approval from the group owner or a chat group admin
- Whether chat group members can invite others to join the chat group
- Whether invitees must accept the invitation before joining the chat group
- Chat group extension information
- Whether the chat group is public

1. Chat room
- Chat room name
- Chat room description
- Maximum number of chat room members

## Webhook request

### Request example

The following example shows a chat group information update event:

```json
{
	"callId": "XXXX#XXXX_0679c3e3-XXXX-XXXX-8900-0cca0f24198e",
	"security": "4249dff0f1XXXX084cd9eebe4b4781e7",
	"payload": {
		"type": "INFO",
		"info": {
			"owner": "XXXX#XXXX_tst",
			"created": "1729496598199",
			"custom": "",
			"description": "描述",
			"mute": "false",
			"mute_duration": -1,
			"avatar": "https://XXXX/XXXX/XXXX",
			"title": "测试01",
			"max_users": "200",
			"invite_need_confirm": "true",
			"public": "true",
			"allow_user_invites": "false",
			"disabled": "false",
			"last_modified": "1729496598199"
		}
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "UPDATE",
	"operator": "@ppAdmin",
	"timestamp": 1729497138792
}
```

### Request fields

The following descriptions use the chat group creation event as an example:

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
|  - `type`| String |     | Chat group information modification event. |
|  - `info`   | JSON | Modified chat group information.<br/> - `owner`: String. Group owner.<br/> - `created`: Long. Chat group creation time.<br/> - `custom`: String. Custom chat group information.<br/> - `description`: String. Chat group description.<br/> - `mute`: Bool. Whether all members are muted. `true` means yes; `false` means no.<br/> - `mute_duration`: Long. Mute duration for all members, calculated from the current time, in seconds. `0` means unmute; `-1` means mute permanently.<br/> - `avatar`: String. Chat group avatar URL.<br/> - `title`: String. Chat group name.<br/> - `max_users`: Maximum number of chat group members, including the group owner.<br/> - `invite_need_confirm`: Bool. Whether an invited user must accept the invitation to join the chat group. `true` means acceptance is required; `false` means it is not required.<br/> - `public`: Bool. Whether the chat group is public. `true` indicates a public group; `false` indicates a private group.<br/> - `allow_user_invites`: Bool. Whether regular chat group members can invite users to join the chat group. `true` means allowed; `false` means not allowed, and only the group owner and chat group admins can invite users.<br/> - `disabled`: Boolean. `true` indicates that the chat group is disabled; `false` indicates that it is enabled and can be used normally. <br/> - `last_modified`: Long. Time when the chat group information was last modified. |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.           |
| `id`       | String | Chat group ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `UPDATE` when chat group information is modified. |
| `operator`     | String | Operator.                     |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                |

:::tip
More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.
::
