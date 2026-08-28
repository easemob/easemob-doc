# Chat Group and Chat Room Creation Webhook Events

## Feature overview

After a chat group or chat room is created successfully, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain information about the created chat group or chat room and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

- A [chat group](/document/android/group_manage.html#create-a-chat-group) or [chat room](/document/android/room_manage.html#create-a-chat-room) is created on the client.
- A RESTful API is called to create a [chat group](/rest/group_create.html) or [chat room](/rest/chatroom_create.html).
- In the [EasyIM Console](https://console.easyim.ai/user/login), a [chat group](/product/console/operation_group.html#create-a-chat-group) or [chat room](/product/console/operation_chatroom.html#create-a-chat-room) is created.

## Webhook request

### Request example

The following example shows a chat group creation event. The fields are the same for chat room creation.

```json
{
	"callId": "XXXX#XXXX_cfc0d78c-XXXX-XXXX-b687-8b84107a798b",
	"security": "4930bcf03103aXXXX632eadd9b36b6c7",
	"payload": {
		"role": {
			"tst": "owner",
			"abc": "admin"
		},
		"member": ["abc"],
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
	"operation": "CREATE",
	"operator": "tst",
	"timestamp": 1729496598231
}

```

### Request fields

The following descriptions use the chat group creation event as an example. The fields are the same for a chat room.

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The unique identifier of the webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.role` | JSON | Chat group roles. If admins are configured, the admin roles are displayed. Otherwise, only the group owner role is displayed:<br/> - User ID: `owner`<br/> - User ID: `admin` |
| `payload.member`| Array | Users added to the chat group when the chat group is created.    |
| `payload.info`   | JSON | Information about the new chat group.<br/> - `owner`: String. Group owner.<br/> - `created`: Long. Chat group creation time.<br/> - `custom`: String. Custom chat group information.<br/> - `description`: String. Chat group description.<br/> - `mute`: Bool. Whether all members are muted. `true` means yes; `false` means no.<br/> - `mute_duration`: Long. Mute duration for all members, calculated from the current time, in seconds. `0` means unmute; `-1` means mute permanently.<br/> - `avatar`: String. Chat group avatar URL.<br/> - `title`: String. Chat group name.<br/> - `max_users`: Maximum number of chat group members, including the group owner.<br/> - `invite_need_confirm`: Bool. Whether an invited user must accept the invitation to join the chat group. `true` means acceptance is required; `false` means it is not required.<br/> - `public`: Bool. Whether the chat group is public. `true` indicates a public group; `false` indicates a private group.<br/> - `allow_user_invites`: Bool. Whether regular chat group members can invite users to join the chat group. `true` means allowed; `false` means not allowed, and only the group owner and chat group admins can invite users.<br/> - `disabled`: Boolean. `true` indicates that the chat group is disabled; `false` indicates that it is enabled and can be used normally. <br/> - `last_modified`: Long. Time when the chat group information was last modified.   |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `CREATE` when a chat group is created. |
| `operator`     | String | Operator. If an app admin creates the chat group, the value is fixed as `@ppAdmin`.         |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                                                       |
