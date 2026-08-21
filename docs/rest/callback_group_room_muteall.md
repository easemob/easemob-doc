# Chat Group and Chat Room Mute-All Webhook Events

## Feature overview

After all chat group or chat room members are muted or unmuted, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the webhook to obtain the mute-all status and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easemob.com/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Mute/unmute all members

### Trigger conditions

- All members of a [chat group](/document/android/group_members.html#mute-all-members) or [chat room are muted or unmuted](/document/android/room_members.html#mute-and-unmute-all-chat-room-members) on the client.
- A RESTful API is called to mute or unmute all members of a [chat group](/document/server-side/group_member_mute_all.html) or [chat room](/document/server-side/chatroom_member_mute_all.html).
- In the [EasyIM Console](https://console.easemob.com/user/login), all members of a [chat group](/product/console/operation_group.html#chat-group-moderation-management) or [chat room are muted or unmuted](/product/console/operation_chatroom.html#chat-room-moderation-management).

### Webhook request

#### Request example

```json
{
	"callId": "XXXX#XXXX_2b17ccf8-XXXX-XXXX-9592-0ebd9221afd7",
	"security": "17761ffeXXXX17e27eeec4a651549c85",
	"payload": {
		"mute": true,
		"type": "MUTE"
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "UPDATE",
	"operator": "@ppAdmin",
	"timestamp": 1729497065641
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`.      |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `paylod`       | Object | Event content.                                                     |
| `payload.mute` | JSON   | Whether all members are muted or unmuted:<br/> - `true`: Mute all members <br/> - `false`: Unmute all members |
| `payload.type` | String | Mute-all or unmute-all event. The value is `MUTE`.        |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                           |
| `id`           | String | Chat group or chat room ID.                                                |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `UPDATE` when all chat group or chat room members are muted. |
| `operator`     | String | Operator. If an app admin mutes or unmutes all chat group or chat room members, the value is fixed as `@ppAdmin`.     |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.  |


## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
