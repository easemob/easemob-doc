# Chat Group and Chat Room Announcement Callback

## Feature overview

After a chat group or chat room announcement is set or updated, the EasyIM server sends a callback request to your app server according to the [post-delivery callback rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the callback to obtain the announcement information and synchronize data.

## Prerequisite

- The post-delivery callback service is activated. For details, see [Activate the message callback service](/product/console/basic_webhook.html#activate-the-service) and [Callback overview](/document/server-side/callback_postsending.html).
- Post-delivery callback rules are configured in the [Easemob Console](https://console.easemob.com/user/login). For details, see [Configure callback rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Trigger conditions

- A [chat group announcement](/document/android/group_attributes.html#update-the-group-announcement) or [chat room announcement](/document/android/room_attributes.html#update-the-chat-room-announcement) is set or updated on the client.
- A RESTful API is called to set or update a [chat group announcement](/document/server-side/group_announcement_modify.html) or [chat room announcement](/document/server-side/chatroom_announcement_update.html).
- In the [Easemob Console](https://console.easemob.com/user/login), a [chat group announcement](/value-added/moderation/moderation_manual_review.html#chat-group-moderation-management) or [chat room announcement](/value-added/moderation/moderation_manual_review.html#chat-room-moderation-management) is set or updated.

## Callback request

### Request example

```json
{
	"callId": "XXXX#XXXX_b9a9862f-XXXX-XXXX-acf5-8816f0303c7c",
	"security": "de170d1c00XXXX9f294306ec72831d53",
	"payload": {
		"type": "ANNOUNCEMENT",
		"announcement": "公告"
	},
	"appkey": "XXXX#XXXX",
	"id": "262246968131585",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "UPDATE",
	"operator": "tst",
	"timestamp": 1729496921620
}
```

### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The `callId` field is the unique identifier of each callback request, in the format `App Key_UUID`. | 
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure callback rules in the Easemob Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `paylod`       | Object | Event content.                                                     |
|  - `type` | String | Announcement update event. | 
|  - `announcement`   | String | New announcement content. This field does not exist if the announcement content is deleted. |
| `appkey`       | String | Unique identifier of the app registered in the Easemob Console.  |
| `id`       | String | Chat group ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. | 
| `operation`    | String | Operation. The value is `UPDATE` when a chat group announcement is set or updated. |
| `operator`     | String | Operator. If an app admin sets or updates the announcement, the value is fixed as `@ppAdmin`. | 
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                | 

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
