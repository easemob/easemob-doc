# Friend and Blocklist Webhook Events

## Feature overview

After a friend is added or deleted, or a user is added to or removed from the blocklist, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain information about friend and blocklist operations and synchronize data.

This document describes the following user relationship webhook events:

- [Send a friend request](#send-a-friend-request)
- [Accept a friend request](#accept-a-friend-request)
- [Decline a friend request](#decline-a-friend-request)
- [Delete a friend](#delete-a-friend)
- [Add a user to the blocklist](#add-a-user-to-the-blocklist)
- [Remove a user from the blocklist](#remove-a-user-from-the-blocklist)

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Send a friend request

#### Trigger conditions

A [client sends a friend request](/document/android/user_relationship.html#add-a-friend).

#### Webhook request

Request example:

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX",
    "security":"XXXX",
    "payload":{
        "reason":"",
        "operation":"add"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst01",
    "eventType":"chat",
    "msg_id":"9XXXX2",
    "timestamp":1642648175092
    }
```

Request fields:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | Unique identifier of the webhook request, in the format “App Key_message ID of the friend addition event”. |
| `chat_type`       | String | `roster`: User relationship event. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.reason`    | object   | Reason for the friend request.                |
| `payload.operation` | String   | `add`: Add a friend. |
| `host`            | String   | Server name.          |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `from`       | String | Initiator, in the format `App Key_发起方用户 ID@easemob.com`.                                |
| `to`       | String | User ID of the recipient.                                |
| `eventType`       | String   | <br/> - `chat`: Uplink message<br/> - `chat_offline`: Offline message.                   |
| `msg_id`    | String   | Message ID of the friend addition event. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |

## Accept a friend request

#### Trigger conditions

After receiving a friend request, a [user accepts the request on the client](/document/android/user_relationship.html#add-a-friend).

#### Event received by the requester

When `payload.operation` is `remote_accept`, the user who sent the friend request receives the event. In this case, `to` is the user who sent the friend request.

Request example:

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725899779049516",
    "security":"a2e1545231e8acf60513b50984af0c6c",
    "payload":{
        "roster_ver":"DD6E14FE5EE5A9ABC52CA86C5DE1601CF729BFD6",
        "operation":"remote_accept"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst01",
    "eventType":"chat",
    "msg_id":"96XXXX516",
    "timestamp":1642648213494
    }
```

Request fields:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | Unique identifier of the webhook request, in the format “App Key_message ID of the friend request acceptance event”. |
| `chat_type`       | String | `roster`: User relationship event. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.roster_ver`    | String   | Version number of the friend list.  |
| `payload.operation` | String   | `remote_accept`: Friend request acceptance event. The user who sent the friend request receives this event. |
| `host`            | String   | Server name.          |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `from`       | String | Initiator, in the format `App Key_发起方用户 ID@easemob.com`.                                |
| `to`       | String | User ID of the user who sent the friend request.                                |
| `eventType`       | String   | <br/> - `chat`: Uplink message<br/> - `chat_offline`: Offline message.       |
| `msg_id`    | String   | Message ID of the friend request acceptance event. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |

#### Event received by the acceptor

When `payload.operation` is `accept`, the user who accepted the friend request receives the event. This event synchronizes the operation result in single-device and multi-device login scenarios.

In this case, `to` is the ID of the user who accepted the friend request.

Request example:

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725899779049516",
    "security":"a2e1545231e8acf60513b50984af0c6c",
    "payload":{
        "roster_ver":"DD6E14FE5EE5A9ABC52CA86C5DE1601CF729BFD6",
        "operation":"accept"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst02",
    "eventType":"chat",
    "msg_id":"96XXXX516",
    "timestamp":1642648213494
    }
```

Request fields:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | Unique identifier of the webhook request, in the format “App Key_message ID of the friend request acceptance event”. |
| `chat_type`       | String | `roster`: User relationship event. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.roster_ver`    | String   | Version number of the friend list.  |
| `payload.operation` | String   | `accept`: Accept a friend request. The user who accepted the request receives this event, which synchronizes the operation result in single-device and multi-device login scenarios. |
| `host`            | String   | Server name.          |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `from`       | String | Initiator, in the format `App Key_发起方用户 ID@easemob.com`.                                |
| `to`       | String | ID of the user who accepted the friend request.                     |
| `eventType`       | String   | <br/> - `chat`: Uplink message<br/> - `chat_offline`: Offline message.       |
| `msg_id`    | String   | Message ID of the friend request acceptance event. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |


## Decline a friend request

#### Trigger conditions

After receiving a friend request, a [user declines the request on the client](/document/android/user_relationship.html#add-a-friend).

#### Event received by the requester

When `payload.operation` is `remote_decline`, the user who sent the friend request receives the event.

In this case, `to` is the ID of the user who sent the friend request.

Request example:

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966726099692161068",
    "security":"747d6297660e57bcf38315aa98c206ac",
    "payload":{
        "roster_ver":"3D81EC24A6E732B2EB1B654AA446930DB9BAFE59",
        "operation":"remote_decline"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst",
    "eventType":"chat",
    "msg_id":"9XXXX68",
    "timestamp":1642648260029
    }
```

Request fields:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | Unique identifier of the webhook request, in the format “App Key_message ID of the friend request decline event”. |
| `chat_type`       | String | `roster`: User relationship event. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.roster_ver`    | String   | Version number of the friend list.  |
| `payload.operation` | String   | `remote_decline`: Decline a friend request. The user who sent the request receives this event. |
| `host`            | String   | Server name.          |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `from`       | String | Initiator, in the format `App Key_发起方用户 ID@easemob.com`.                                |
| `to`       | String | ID of the user who sent the friend request.                                |
| `eventType`       | String   | <br/> - `chat`: Uplink message<br/> - `chat_offline`: Offline message.       |
| `msg_id`    | String   | Message ID of the friend request decline event. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |


#### Event received by the user who declined the request

When `payload.operation` is `decline`, the user who declined the friend request receives the event. This event synchronizes the operation result in multi-device login scenarios.

Webhook request example:

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966726099692161068",
    "security":"747d6297660e57bcf38315aa98c206ac",
    "payload":{
        "roster_ver":"3D81EC24A6E732B2EB1B654AA446930DB9BAFE59",
        "operation":"decline"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst11",
    "eventType":"chat",
    "msg_id":"9XXXX68",
    "timestamp":1642648260029
    }
```

Request fields:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | The `callId` field is the unique identifier of the webhook request, in the format “App Key_message ID of the friend request decline event”. |
| `chat_type`       | String | `roster`: User relationship event. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.roster_ver`    | String   | Version number of the friend list.  |
| `payload.operation` | String   | `decline`: Decline a friend request. The user who declined the request receives this event, which synchronizes the operation result in multi-device login scenarios. |
| `host`            | String   | Server name.          |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `from`       | String | Initiator, in the format `App Key_发起方用户 ID@easemob.com`.                                |
| `to`       | String | ID of the user who declined the friend request.                                |
| `eventType`       | String   | <br/> - `chat`: Uplink message<br/> - `chat_offline`: Offline message.       |
| `msg_id`    | String   | Message ID of the friend request decline event. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |

## Delete a friend

#### Trigger conditions

- A [friend is deleted on the client](/document/android/user_relationship.html#delete-a-friend).
- A RESTful API is called to [delete a friend](/rest/user_friend_remove.html).
- In the [EasyIM Console](https://console.easyim.ai/user/login), a [friend is deleted](/product/console/operation_user.html#delete-a-users-friend).

#### Request example

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX736",
    "security":"2e7XXXX2d7",
    "payload":{
        "roster_ver":"003DD920ADD15B51EB0B806E83BDD97F089B0092",
        "operation":"remove"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst01",
    "eventType":"chat",
    "msg_id":"XXXX463736",
    "timestamp":1642648138571
    }
```

#### Request fields

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | Unique identifier of the webhook request, in the format “App Key_message ID of the friend deletion event”. |
| `chat_type`       | String | `roster`: User relationship event. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.roster_ver`    | String   | Version number of the friend list.  |
| `payload.operation` | String   | `remove`: Delete a friend. |
| `host`            | String   | Server name.          |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `from`       | String | Initiator, in the format `App Key_发起方用户 ID@easemob.com`.                                |
| `to`       | String | User ID of the recipient.                                |
| `eventType`       | String   | <br/> - `chat`: Uplink message<br/> - `chat_offline`: Offline message.        |
| `msg_id`    | String   | Message ID of the friend deletion event. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |

## Add a user to the blocklist

#### Trigger conditions

1. A [user is added to the blocklist on the client](/document/android/user_relationship.html#add-a-user-to-the-blocklist).
2. A [RESTful API is called to add a user to the blocklist](/rest/user_friend_blocklist_add.html).
3. In the [EasyIM Console](https://console.easyim.ai/user/login), a [user is added to the blocklist](/product/console/operation_user.html#view-a-users-blocklist).

#### Request example

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725184268539960",
    "security":"00f070116668034ddecf3fb7db92087c",
    "payload":{
        "operation":"ban",
        "status":{
            "error_code":"ok"
            }
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst",
    "eventType":"chat",
    "msg_id":"9XXXX0",
    "timestamp":1642648046912
}
```

#### Request fields

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | Unique identifier of the webhook request, in the format “App Key_message ID of the user block event”. |
| `chat_type`       | String | `roster`: User relationship event. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.operation` | String   | `ban`: Add a user to the blocklist. |
| `payload.status`    | object   | Contains `error_code`.  |
| `payload.status.error_code`    | String   | Error code for an operation failure. |
| `host`            | String   | Server name.          |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `from`       | String | Initiator, in the format `App Key_发起方用户 ID@easemob.com`.                                |
| `to`       | String | User ID of the recipient.                                |
| `eventType`       | String   | <br/> - `chat`: Uplink message<br/> - `chat_offline`: Offline message.       |
| `msg_id`    | String   | Message ID of the user block event. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |


## Remove a user from the blocklist

#### Trigger conditions

1. A user [removes a friend from the blocklist on the client](/document/android/user_relationship.html#remove-a-user-from-the-blocklist).
2. A [RESTful API is called to remove a friend from the blocklist](/rest/user_friend_blocklist_remove.html).
3. In the [EasyIM Console](https://console.easyim.ai/user/login), a [friend is removed from the blocklist](/product/console/operation_user.html#view-a-users-blocklist).

#### Request example

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725018736134200",
    "security":"cbe8a5f1ba384107b63ef61637f55cad",
    "payload":{
        "operation":"allow",
        "status":{
            "error_code":"ok"
            }
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX_XXXX@easemob.com",
    "to":"tst",
    "eventType":"chat",
    "msg_id":"966725018736134200",
    "timestamp":1642648008357
}
```

#### Request fields

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | Unique identifier of the webhook request, in the format “App Key_message ID of the user unblock event”. |
| `chat_type`       | String | `roster`: User relationship event. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.operation` | String   | `allow`: Remove a user from the blocklist. |
| `payload.status`    | object   | Contains `error_code`.  |
| `payload.status.error_code`    | String   | Error code for an operation failure. |
| `host`            | String   | Server name.          |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `from`       | String | Initiator, in the format `App Key_sender user ID@easemob.com`.                                |
| `to`       | String | User ID of the recipient.                                |
| `eventType`       | String   | <br/> - `chat`: Uplink message<br/> - `chat_offline`: Offline message.       |
| `msg_id`    | String   | Message ID of the user unblock event. |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |
