# Chat Room Superadmin Change Callback 

## Feature overview

After a chat room superadmin is added or removed successfully, the EasyIM server sends a callback request to your app server according to the [post-delivery callback rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the callback to obtain information about the added or removed chat room superadmin and synchronize data.

## Prerequisite

- The post-delivery callback service is activated. For details, see [Activate the message callback service](/product/console/basic_webhook.html#activate-the-service) and [Callback overview](/document/server-side/callback_postsending.html).
- Post-delivery callback rules are configured in the [Easemob Console](https://console.easemob.com/user/login). For details, see [Configure callback rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Add a superadmin
 
### Trigger conditions

A RESTful API is called to [add a chat room superadmin](/document/server-side/chatroom_admin_add.html).

### Callback request

#### Request example

```json
{
    "callId": "XXXX#XXXX_ae4d47d1-XXXX-XXXX-9743-0398b8bd90b3",
    "security": "935656a045aXXXX842a897ce818c03a0",
    "payload": {
        "admin": [
            "wzy"
        ],
        "type": "ADD"
    },
    "appkey": "XXXX#XXXX",
    "id": "",
    "type": "CHATROOM",
    "event": "group_op_event",
    "operation": "ROOM_SUPER_ADMIN",
    "operator": "@ppAdmin",
    "timestamp": 1732518949817
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each callback request, in the format `App Key_UUID`. | 
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure callback rules in the Easemob Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.admin`| JSON   | User ID of the added chat room superadmin. | 
| `payload.type` | String | Event for adding a chat room superadmin. The value is `ADD`.  | 
| `appkey`       | String | Unique identifier of the app registered in the Easemob Console.                                |
| `id`           | String | Chat room ID.                                                 |
| `type`         | String | Event type. The value is `CHATROOM`, indicating a chat room event.     |
| `event`        | String | Event name. The value is fixed as `group_op_event`. |
| `operation`    | String | Operation. The value is `ROOM_SUPER_ADMIN` when a chat room superadmin is added. |
| `operator`     | String | Operator. If an app admin adds the superadmin, the value is fixed as `@ppAdmin`.        |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.      | 


## Remove a superadmin
 
### Trigger conditions

A RESTful API is called to [remove a chat room superadmin](/document/server-side/chatroom_admin_remove.html). 

### Callback request

#### Request example

```json
{
    "callId": "easemob-demo#testy_aba13c39-661f-46ef-8e43-8cd6205aa6a0",
    "security": "ec49e76b5d74b89218987bfc405a839b",
    "payload": {
        "admin": [
            "wzy"
        ],
        "type": "REMOVE"
    },
    "appkey": "easemob-demo#testy",
    "id": "",
    "type": "CHATROOM",
    "event": "group_op_event",
    "operation": "ROOM_SUPER_ADMIN",
    "operator": "@ppAdmin",
    "timestamp": 1732519041930
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each callback request, in the format `App Key_UUID`. | 
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure callback rules in the Easemob Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.admin`| JSON   | User ID of the removed chat room superadmin. | 
| `payload.type` | String | Event for removing a chat room superadmin. The value is `REMOVE`.  | 
| `appkey`       | String | Unique identifier of the app registered in the Easemob Console.                                |
| `id`           | String | Chat room ID.                                                 |
| `type`         | String | Event type. The value is `CHATROOM`, indicating a chat room event.     |
| `event`        | String | Event name. The value is fixed as `group_op_event`. |
| `operation`    | String | Operation. The value is `ROOM_SUPER_ADMIN` when a chat room superadmin is removed. |
| `operator`     | String | Operator. If an app admin removes the superadmin, the value is fixed as `@ppAdmin`.        |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.      | 

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**






