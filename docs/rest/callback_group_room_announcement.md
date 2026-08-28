# Chat Group and Chat Room Announcement Webhook Events

## Feature overview

After a chat group or chat room announcement is set or updated, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain the announcement information and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

- A [chat group announcement](/document/android/group_attributes.html#update-the-group-announcement) or [chat room announcement](/document/android/room_attributes.html#update-the-chat-room-announcement) is set or updated on the client.
- A RESTful API is called to set or update a [chat group announcement](/rest/group_announcement_modify.html) or [chat room announcement](/rest/chatroom_announcement_update.html).
- In the [EasyIM Console](https://console.easyim.ai/user/login), a [chat group announcement](/value-added/moderation/moderation_manual_review.html#chat-group-moderation-management) or [chat room announcement](/value-added/moderation/moderation_manual_review.html#chat-room-moderation-management) is set or updated.

## Webhook request

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
| `callId`       | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `paylod`       | Object | Event content.                                                     |
|  - `type` | String | Announcement update event. |
|  - `announcement`   | String | New announcement content. This field does not exist if the announcement content is deleted. |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`       | String | Chat group ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `UPDATE` when a chat group announcement is set or updated. |
| `operator`     | String | Operator. If an app admin sets or updates the announcement, the value is fixed as `@ppAdmin`. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                |

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
