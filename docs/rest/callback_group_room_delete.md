# Chat Group and Chat Room Deletion Events

## Feature overview

After a chat group or chat room is deleted successfully, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

- A user destroys a [chat group](/sdk/v5/android/group_manage.html#destroy-a-chat-group) or [chat room](/sdk/v5/android/room_manage.html#destroy-a-chat-room) on the client.
- A user calls a RESTful API to destroy a [chat group](/rest/group_delete.html) or [chat room](/rest/chatroom_delete.html).
- In the [EasyIM Console](https://console.easyim.ai/user/login), a user deletes a [chat group](/product/console/operation_group.html#delete-a-chat-group) or [chat room](/product/console/operation_chatroom.html#delete-a-chat-room).

## Webhook request

### Request example

```json
{
	"callId": "XXXX#XXXX_2e962475-XXXX-XXXX-a90c-d7e2949440f2",
	"security": "4e5d778c77dXXXXab41ed2528594e449",
	"appkey": "XXXX#XXXX",
	"id": "255445981790209",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "DELETE",
	"operator": "@ppAdmin",
	"timestamp": 1729499587640
}
```

### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The unique identifier of the webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.  |
| `id`           | String | Chat group or chat room ID.                                                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The recipient can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `DELETE` when a chat group or chat room is deleted. |
| `operator`     | String | Operator.                               |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                      |
