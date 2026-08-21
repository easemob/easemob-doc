# Chat Group and Chat Room Member Join Webhook Events

## Feature overview

When users are added during chat group or chat room creation, invited to join, or join by application, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the webhook to synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Join directly

### Trigger conditions

- Users are added directly when a [chat group](/document/android/group_manage.html#create-a-chat-group) or [chat room](/document/android/room_manage.html#create-a-chat-room) is created on the client.
- A user [joins a chat room](/document/android/room_manage.html#join-a-chat-room) on the client.
- Users are added directly when a RESTful API is called to [create a chat group](/document/server-side/group_create.html) or [chat room](/document/server-side/chatroom_create.html).

### Webhook request

#### Request example

The following example shows an event generated when users are added during chat group or chat room creation or when a user joins a chat room on the client.

Note: The `payload.options.ext` field applies only to chat room join events, not chat group join events.

```json
{
    "callId": "XXXX#XXXX_34092a82-XXXX-XXXX-aa2e-aefeb0bb5a65",
    "security": "0b787dc5dXXXXdeb1e9ffe8803d01eaa",
    "payload": {
        "member": [
            "tst01"
        ],
        "options": {
            "ext": "11111"
        },
        "type": "DIRECT"
    },
    "appkey": "XXXX#XXXX",
    "id": "262246968131585",
    "type": "GROUP",
    "event": "group_op_event",
    "operation": "JOIN",
    "operator": "@ppAdmin",
    "member_count": 4,
    "timestamp": 1729497286675
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.member` | JSON | <br/> - IDs of users added to the chat group or chat room during its creation. <br/> - ID of a user who actively joins a chat room.       |
| `payload.options.ext` | JSON  | Extension information. This field applies only to chat room join events, not chat group join events.    |
| `payload.type` | Array  | Join method: `DIRECT` indicates that users are added during chat group or chat room creation, or that a user actively joins a chat room.     |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `JOIN` when a user joins a chat group or chat room. |
| `operator`     | String | <br/> - Operator who adds the user to the chat group or chat room.<br/> - ID of the user who actively joins the chat room.                     |
| `member_count`     | Int | Current number of chat group or chat room members.                     |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.          |

## Invite a user to join a chat group

### Trigger conditions

A regular chat group member [invites a user to join the chat group on the client](/document/android/group_manage.html#invite-a-user-to-join-a-chat-group), and the user joins successfully.

**Chat rooms do not have this event.**

### Webhook request

#### Request example

```json
{
	"callId": "XXXX#XXXX_643c3149-f7cc-4492-8341-c7473ee63f86",
	"security": "1ed483cf9cXXXXb78f99c1e0c4292d41",
	"payload": {
		"member": [
			"tst0"
		],
		"type": "INVITE"
	},
	"appkey": "XXXX#XXXX",
	"id": "262424566497281",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "JOIN",
	"operator": "tst0",
	"member_count": 4,
	"timestamp": 1729665977191
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.member`| JSON  | ID of the invited user.        |
| `payload.type` | Array  | Join method: `INVITE` indicates that a user is invited to join the chat group.     |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`           | String | Chat group ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room  <br/> Because chat rooms do not have this event, the value can only be `GROUP`. |
| `event`        | String | Chat group operation event. The value is `group_op_event`. |
| `operation`    | String | Operation. The value is `JOIN` when a user joins a chat group. |
| `operator`     | String | Operator.                                 |
| `member_count`     | Int | Total number of chat group members after the new user joins.                     |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |

## Apply to join

### Trigger conditions

A user successfully joins a [chat group by application on the client](/document/android/group_manage.html#apply-to-join-a-chat-group) or [chat room](/document/android/room_manage.html#join-a-chat-room).

### Webhook request

#### Request example

The following example uses an event generated when a user applies to join a chat group. The fields are the same for a chat room.

```json
{
	"callId": "XXXX#XXXX_c158594d-1165-4641-8336-68125ba68a22",
	"security": "1824c552acXXXXb0bf1c80160c65a1d0",
	"payload": {
		"member": [
			"tst"
		],
		"type": "APPLY"
	},
	"appkey": "XXXX#XXXX",
	"id": "261958837272578",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "JOIN",
	"operator": "tst",
	"member_count": 4,
	"timestamp": 1729497831163
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `paylod`       | Object | Event content.                                                     |
| `payload.member` | JSON | ID of the user applying to join.        |
| `payload.type`| Array | Join method: `APPLY` indicates an application to join a chat group.     |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`       | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `JOIN` when a user joins a chat group or chat room. |
| `operator`     | String | Operator.                     |
| `member_count`     | Int | Total number of chat group or chat room members after the new user joins.                     |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.            |

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
