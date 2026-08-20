# Chat Group Shared File Callback

## Feature overview

After a chat group shared file is uploaded or deleted, the EasyIM server sends a callback request to your app server according to the [post-delivery callback rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the callback to obtain information about the uploaded or deleted file and synchronize data.

## Prerequisite

- The post-delivery callback service is activated. For details, see [Activate the message callback service](/product/console/basic_webhook.html#activate-the-service) and [Callback overview](/document/server-side/callback_postsending.html).
- Post-delivery callback rules are configured in the [Easemob Console](https://console.easemob.com/user/login). For details, see [Configure callback rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Chat group shared file upload event

### Trigger conditions

- A [chat group shared file is uploaded on the client](/document/android/group_attributes.html#upload-a-shared-file).
- A [RESTful API is called to upload a chat group shared file](/document/server-side/group_shared_file_upload.html).

### Callback request

#### Request example

```json
{
	"callId": "XXXX#XXXX_ed88a94c-XXXX-XXXX-beba-f016f475156c",
	"security": "ea540aaXXXX33692335ecacacd80992e",
	"payload": {
		"share_file": [
			"e899d500-XXXX-XXXX-af16-6f135fe75dde"
		],
		"type": "ADD"
	},
	"appkey": "XXXX#XXX",
	"id": "test_123",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "SHARE_FILE",
	"operator": "@ppAdmin",
	"timestamp": 1729499506255
}
```

#### Request fields

| Field         | Type   | Description                                                 |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String   | The unique identifier of the callback request, in the format `App Key_UUID`. | 
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure callback rules in the Easemob Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
|  - `share_file`| String | Uploaded chat group shared file. | 
|  - `type`      | String | Chat group shared file upload event. The value is `ADD`. |
| `appkey`       | String | Unique identifier of the app registered in the Easemob Console.  |
| `id`           | String | Chat group ID.                 |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. | 
| `operation`    | String | Operation. The value is `SHARE_FILE` when a chat group shared file is uploaded. |
| `operator`     | String | Operator. If an app admin uploads the shared file, the value is fixed as `@ppAdmin`.                     | 
| `timestamp`    | Long   | Unix timestamp when the operation is completed.            | 

## Chat group shared file deletion event

### Trigger conditions

- A [chat group shared file is deleted on the client](/document/android/group_attributes.html#manage-shared-files).
- A [RESTful API is called to delete a chat group shared file](/document/server-side/group_shared_file_delete.html).

### Callback request

#### Request example

```json
{
	"callId": "XXXX#XXXX_876e28e5-XXXX-XXXX-825c-5a2d8527f44d",
	"security": "b573959e9b5ddXXXX05cb220500712d6",
	"payload": {
		"share_file": [
			"e899d500-XXXX-XXXX-af16-6f135fe75dde"
		],
		"type": "REMOVE"
	},
	"appkey": "XXXX#XXXX",
	"id": "test_123",
	"type": "GROUP",
	"event": "group_op_event",
	"operation": "SHARE_FILE",
	"operator": "@ppAdmin",
	"timestamp": 1729499555559
}
```

#### Request fields

| Field         | Type   | Description                                                 |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each callback request, in the format `App Key_UUID`. | 
| `security`     | String | Signature in the format `MD5（callId+secret+timestamp）`. For details, see [Configure callback rules in the Easemob Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                          |
|  - `share_file`| String | Deleted chat group shared file.                 | 
|  - `type`      | String | Chat group shared file deletion event. The value is `REMOVE`. |
| `appkey`       | String | Unique identifier of the app registered in the Easemob Console.   |
| `id`           | String | Chat group ID.                           |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room   |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. | 
| `operation`    | String | Operation. The value is `UPDATE` when a chat group shared file is deleted. |
| `operator`     | String | Operator. If an app admin deletes the shared file, the value is fixed as `@ppAdmin`.                     | 
| `timestamp`    | Long   | Unix timestamp when the operation is completed.            | 

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
