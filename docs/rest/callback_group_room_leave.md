# Chat Group and Chat Room Member Leave Webhook Events

## Feature overview

When a member leaves a chat group or chat room voluntarily, is removed, or leaves after being added to the blocklist, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the webhook to identify the member who left and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Leave voluntarily

### Trigger conditions

- A user voluntarily leaves a [chat group](/document/android/group_manage.html#leave-a-chat-group) or [chat room](/document/android/room_manage.html#leave-a-chat-room) on the client.
- A user leaves a chat room after being offline for 2 minutes due to network or other issues.

### Webhook request

#### Request example

The following examples show chat room leave events.

- A user voluntarily leaves a chat room. Chat group leave events do not support the `payload.action` field. The other fields have the same meanings as those for chat rooms.

```json
{
	"callId": "XXXX#XXXX_e90431f3-XXXX-XXXX-9bbb-231c371c7acb",
	"security": "e452d25366abXXXX2138fffa4b06726a",
	"payload": {
		"member": [
			"tst"
		],
		"action": "user_quit",
		"type": "QUIT"
	},
	"appkey": "XXXX#XXXX",
	"id": "26195XXXX272578",
	"type": "CHATROOM",
	"event": "group_op_event",
	"operation": "LEAVE",
	"operator": "tst",
	"member_count": 4,
	"timestamp": 1729497862844
}
```

- A user leaves a chat room because they are offline. Chat groups do not have this event.

```json
{
	"callId": "XXXX#XXXX_4dd8749a-c7da-4087-a6c4-8a78e83ca6b7",
	"security": "bf37becbcXXXX65326fd430a26cf0bc6",
	"payload": {
		"member": [ "p1" ],
		"action": "user_offline",
		"type": "QUIT"
	},
	"appkey": "XXXX#XXXX",
	"id": "2839XXXX3548801",
	"member_count": 0,
	"type": "CHATROOM",
	"event": "group_op_event",
	"operation": "LEAVE",
	"operator": "@ppAdmin",
	"timestamp": 1750302436036
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.member` | JSON | ID of the user who leaves the chat group or chat room.        |
| `payload.action` | JSON | This field applies only to chat room leave events, not chat group leave events:<br/> - `user_quit`: The user voluntarily leaves the chat room.<br/> - `user_offline`: The user leaves the chat room because they are offline. |
| `payload.type` | Array  | Leave method: `QUIT` indicates that a user voluntarily leaves a chat group or chat room, or leaves a chat room because they are offline.     |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `LEAVE` when a user voluntarily leaves a chat group or chat room. |
| `operator`     | String | Operator.                     |
| `member_count`     | Int | Total number of chat group or chat room members after the user leaves.                     |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.             |

## Be removed

### Trigger conditions

- A user is removed from a [chat group](/document/android/group_manage.html#remove-a-member) or [chat room](/document/android/room_manage.html#be-removed) on the client.
- A [RESTful API is called to remove a user from a chat group](/document/server-side/group_member_remove_single.html) or [chat room](/document/server-side/chatroom_member_remove_single.html).
- In the [EasyIM Console](https://console.easyim.ai/user/login), a user is removed from a [chat group](/product/console/operation_group.html#chat-group-moderation-management) or [chat room](/product/console/operation_chatroom.html#chat-room-moderation-management).

### Webhook request

#### Request example

The following example shows an event generated when a user is removed from a chat group. The fields are the same for a chat room.

```json
{
	"callId": "XXXX#XXXX_3667067f-ac06-XXXX-96aa-a9a708c3b361",
	"security": "b77b545b538XXXXbb72e4cf2395050c3",
	"payload": {
		"member": [
			"tst01"
		],
		"type": "KICK"
	},
	"appkey": "XXXX#XXXX",
	"id": "254636824002561",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "LEAVE",
	"operator": "tst",
	"member_count": 4,
	"timestamp": 1729497896834
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.member` | JSON | ID of the user removed from the chat group or chat room.        |
| `payload.type` | Array  | Leave method: `KICK` indicates that a user is removed from a chat group or chat room.     |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `LEAVE` when a user is removed from a chat group or chat room. |
| `operator`     | String | Operator.                     |
| `member_count`     | Int | Total number of chat group or chat room members after the user is removed.                     |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.             |

## Leave after being added to the blocklist

### Trigger conditions

- A user leaves a chat group or chat room after being added to the [chat group blocklist](/document/android/group_members.html#add-members-to-the-blocklist) or [chat room blocklist](/document/android/room_members.html#add-members-to-the-chat-room-blocklist) on the client.
- A user leaves a chat group or chat room when a RESTful API is called to add the user to the [chat group blocklist](/document/server-side/group_member_blocklist_add_single.html) or [chat room blocklist](/document/server-side/chatroom_member_blocklist_add_single.html).
- In the [EasyIM Console](https://console.easyim.ai/user/login), a user leaves a chat group or chat room after being added to the [chat group blocklist](/product/console/operation_group.html#chat-group-moderation-management) or [chat room blocklist](/product/console/operation_chatroom.html#chat-room-moderation-management).

### Webhook request

#### Request example

The following example shows an event generated when a user is added to the group blocklist. The fields are the same for a chat room.

```json
{
	"callId": "XXXX#XXX_7dc24fac-3451-421e-a8aa-70ba0587e69d",
	"security": "9b30e4c2bXXXXcd51ef730836d427965",
	"payload": {
		"member": [
			"tst02"
		],
		"type": "BLOCK"
	},
	"appkey": "XXXX#XXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "LEAVE",
	"operator": "tst",
	"member_count": 4,
	"timestamp": 1729498876236
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.member` | JSON | ID of the user who leaves after being added to the chat group or chat room blocklist.        |
| `payload.type` | Array  | Leave method: `BLOCK` indicates that a user leaves a chat group or chat room after being added to its blocklist.     |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `LEAVE` when a user is removed from a chat group or chat room. |
| `operator`     | String | Operator.                     |
| `member_count`     | Int | Total number of chat group or chat room members after the user is added to the blocklist.                     |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                |

## Leave because the chat group or chat room is destroyed

### Trigger conditions

- Users leave when a [chat group](/document/android/group_manage.html#destroy-a-chat-group) or [chat room](/document/android/room_manage.html#destroy-a-chat-room) is destroyed on the client.
- Users leave when a RESTful API is called to [destroy a chat group](/document/server-side/group_delete.html) or [chat room](/document/server-side/chatroom_delete.html).
- In the [EasyIM Console](https://console.easyim.ai/user/login), users leave when a [chat group](/product/console/operation_group.html#delete-a-chat-group) or [chat room](/product/console/operation_chatroom.html#delete-a-chat-room) is destroyed.

### Webhook request

#### Request example

```json
{
    "callId": "XXXX#XXX_7dc24fac-3451-421e-a8aa-70ba0587e69d",
	"security": "9b30e4c2bXXXXcd51ef730836d427965",
    "id": "267575861772289",
    "operation": "LEAVE",
    "operator": "@ppAdmin",
    "payload":  {
        "member":  [
            "user1",
            "user2",
            "user3"
        ],
        "type": "DELETE"
    },
    "appkey": "XXXX#XXX_7dc24fac-3451-421e-a8aa-70ba0587e69d",
	"event": "group_op_event",
    "timestamp": 1734597600148,
    "type": "GROUP"
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `id`           | String | Chat group or chat room ID.                                                 |
| `operation`    | String | Operation. The value is `LEAVE` when a user leaves a chat group or chat room. |
| `operator`     | String | Operator.                     |
| `payload`       | Object | Event content.                                                     |
| `payload.member` | JSON | IDs of users who leave after the chat group or chat room is destroyed.        |
| `payload.type` | Array  | Leave method: `DELETE` indicates that users leave a chat group or chat room after it is destroyed.     |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
