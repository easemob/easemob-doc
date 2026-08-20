# Chat Group and Chat Room Operations

:::tip
**This document describes legacy callback events and is no longer maintained or updated by Easemob. See the [new chat group and chat room callback documentation](callback_group_room_create.html).**
:::

| Event                       | Type in payload                         | Group chat trigger event                                   | Chat room trigger event         |
| :------------------------- | :------------------------------------- | :--------------------------------------------- | :--------------------- |
| muc                        | -                                      | All group chat operation events                               | All chat room operation events     |
| muc:create                 | {“operation”:“create”}                 | Create a chat group                                         | Not supported                 |
| muc:destroy                | {“operation”:“destroy”}                | Destroy a chat group                                         | Destroy a chat room             |
| muc:apply                  | {“operation”:“apply”}                  | A user applies to join a chat group                                 | Not supported                 |
| muc:apply_accept           | {“operation”:“apply_accept”}           | Approve a user's application to join a chat group                               | Not supported                 |
| muc:invite                 | {“operation”:“invite”}                 | Invite a new user to join a chat group                                 | Not supported                 |
| muc:invite_accept          | {“operation”:“invite_accept”}          | An invited user accepts a chat group invitation                               | Not supported                 |
| muc:invite_decline         | {“operation”:“invite_decline”}         | An invited user declines a chat group invitation                               | Not supported                 |
| muc:kick                   | {“operation”:“kick”}                   | Remove a user from a chat group      | Remove a user from a chat room (this event is sent when a chat room member is removed by the chat room owner or an admin, or leaves after being offline for 2 minutes)             |
| muc:ban                    | {“operation”:“ban”}                    | Add a user to the group blocklist     | Not supported                 |
| muc:allow                  | {“operation”:“allow”}                  | Remove a user from the group blocklist  | Not supported                 |
| muc:update                 | {“operation”:“update”}                 | Modify chat group information                                     | Modify chat room information         |
| muc:block                  | {“operation”:“block”}                  | A user blocks a chat group                                     | Not supported                 |
| muc:unblock                | {“operation”:“unblock”}                | A user unblocks a chat group                                 | Not supported                 |
| muc:presence               | {“operation”:“presence”}               | A new member joins a chat group                                     | A new member joins a chat room         |
| muc:absence                | {“operation”:“absence”}                | A member leaves a chat group                                 | A member leaves a chat room     |
| muc:direct_joined          | {“operation”:“direct_joined”}          | A member directly joins a chat group when join verification is disabled        | Not supported  |
| muc:leave                  | {“operation”:“leave”}                  | A member voluntarily leaves a chat group                                 | A member voluntarily leaves a chat room     |
| muc:assing_owner           | {“operation”:“assing_owner”}           | Transfer chat group ownership                                         | Not supported                 |
| muc:add_admin              | {“operation”:“add_admin”}              | Add a chat group admin                                   | Add a chat room admin       |
| muc:remove_admin           | {“operation”:“remove_admin”}           | Remove a chat group admin                                   | Remove a chat room admin       |
| muc:add_mute               | {“operation”:“add_mute”}               | Mute a chat group member                                   | Mute a chat room member       |
| muc:remove_mute            | {“operation”:“remove_mute”}            | Unmute a chat group member                               | Unmute a chat room member   |
| muc:update_announcement    | {“operation”:“update_announcement”}    | Update a chat group announcement                                     | Update a chat room announcement         |
| muc:delete_announcement    | {“operation”:“delete_announcement”}    | Delete a chat group announcement                                     | Delete a chat room announcement         |
| muc:upload_file            | {“operation”:“upload_file”}            | Upload a chat group file                                     | /                      |
| muc:delete_file            | {“operation”:“delete_file”}            | Delete a chat group file                                     | /                      |
| muc:add_user_white_list    | {“operation”:“add_user_white_list”}    | Add a member to the group allowlist                             | Add a member to the chat room allowlist |
| muc:remove_user_white_list | {“operation”:“remove_user_white_list”} | Remove a member from the group allowlist                             | Remove a member from the chat room allowlist |
| muc:ban_group              | {“operation”:“ban_group”}              | Globally mute a chat group                                     | Globally mute a chat room         |
| muc:remove_ban_group       | {“operation”:“remove_ban_group”}   | Unmute a globally muted chat group                                 | Unmute a globally muted chat room     |
| muc:set_metadata | {“operation”:“set_metadata”} | Not supported | Set or update chat room custom attributes.|
| muc:delete_metadata | {“operation”:“delete_metadata”} | Not supported| Delete chat room custom attributes.|
| muc:group_member_metadata_update | {“operation”:“group_member_metadata_update”} | Set custom chat group member attributes | Not supported |

## Create a chat group

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群组 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room.<br> - `true`: Yes;<br> - `false`: No.             |
| `operation`   | String   | `create` Create a chat group.                                  |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the chat group creation failure.                             |
| `error_code`  | String   | Error code corresponding to the creation failure.                                       |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group creation event message ID”. | 
| `msg_id`    | String   | Chat group creation event message ID. | 

Chat group creation callback request example:

```json
{ 
    "chat_type": "muc",
    "callId": "XXXX#XXXX_976459883882744164", 
    "security": "f0f8645cb9b2ccdab3c16db239b13e83", 
    "payload": {
        "muc_id": "XXXX#XXXX_173556296122369@conference.easemob.com", 
        "reason": "",
        "is_chatroom": false,
        "operation": "create",
        "status": {
            "description":"",
            "error_code": "ok"
            }
        },
    "group_id": "173556296122369",
    "host": "XXXX",
    "appkey": "XXXX#XXXX",
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-795eb6e63d",
    "to": "1111",
    "eventType": "chat",
    "msg_id": "976459883882744164",
    "timestamp": 1644914583273
}
```

## Destroy a chat group or chat room

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `operation`   | String   | `destroy` Destroy a chat group or chat room.                                    |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the chat group or chat room destruction failure.                             |
| `error_code`  | String   | Error code corresponding to the operation failure.                                       |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group destruction event message ID”. | 
| `msg_id`    | String   | Chat group destruction event message ID. | 

Chat group destruction callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976430482738645348",  
    "security": "c6f411dedb43ebc499b14779eaa9a82b", 
    "payload": { 
        "muc_id": "XXXX#XXXX_173548612157441@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "destroy", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "173548612157441", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_a3-af9c-2a3ae9d778b0", 
    "to": "admin", 
    "eventType": "chat", 
    "msg_id": "976430482738645348", 
    "timestamp": 1644907737798 
}
```

Chat room destruction callback request example:

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat room destruction event message ID”. | 
| `msg_id`    | String   | Chat room destruction event message ID. | 

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX",  
    "security": "776cbf0b06df9a59d660f6c024aeeb81", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "destroy", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        },
    "group_id": "XXXX",
    "host": "XXXX",
    "appkey": "XXXX#XXXX",
    "from": "XXXX#XXXX",
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644912946446
}
```

## A user applies to join a chat group

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群组 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `apply`: Apply to join a chat group.                                        |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the failure to join the chat group by application.                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_user application to join a chat group event message ID”. | 
| `msg_id`    | String   | User application to join a chat group event message ID. | 

Callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "08eaa57abe898b83df9c84bb4a50c5a5", 
    "payload": { 
        "muc_id": "XXXX#XXXX_.com", 
        "reason": "join group123", 
        "is_chatroom": false, 
        "operation": "apply", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXXcom", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908512194 
}
```

## Approve a member's application to join a chat group

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `apply_accept`: Accept an application to join a chat group.                               |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_approval of a user's application to join a chat group event message ID”. | 
| `msg_id`    | String   | Approval of a user's application to join a chat group event message ID. | 

Callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976435003388856676", 
    "security": "d86bb27395e87e0dffe56e061669a2d9", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "apply_accept", 
        "status": { 
            "description": ""
            }
        },
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "aaa111", 
    "eventType": "chat", 
    "msg_id": "976435003388856676", 
    "timestamp": 1644908790333 
}
```

## Invite a new user to join a chat group

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `invite`: Invite a new member to join a chat group.                                 |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the failure to invite a new user to join the chat group.                           |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_new user invitation to join a chat group event message ID”. | 
| `msg_id`    | String   | New user invitation to join a chat group event message ID. | 

Callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976447662725273956", 
    "security": "2ae5959b661c26cbf55f4582cb2a8931", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com",
        "reason": "你好啊", 
        "is_chatroom": false, 
        "operation": "invite", 
        "status": { 
            "description": "",
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_@XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "976447662725273956", 
    "timestamp": 1644911737827 
}
```

## An invited user accepts a chat group invitation

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `invite_accept`: An invited user accepts a chat group invitation.                        |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_invited user acceptance of a chat group invitation event message ID”. | 
| `msg_id`    | String   | Invited user acceptance of a chat group invitation event message ID. | 

Callback example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976447989306362212", 
    "security": "1881ae2f25c7f92a8b05c6ce0866929f", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "invite_accept", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-7be0-4959-b4a2-06795eb6e63d", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "976447989306362212", 
    "timestamp": 1644911813866 
}
```

## An invited user declines a chat group invitation

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `invite_decline`: An invited user declines a chat group invitation.                       |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_invited user rejection of a chat group invitation event message ID”. | 
| `msg_id`    | String   | Invited user rejection of a chat group invitation event message ID. | 

Callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976448350272358756", 
    "security": "5f5dea4fec2582c20a9ff5b3e1330a02", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "invite_decline", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX",
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-7be0-4959-b4a2-06795eb6e63d", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "976448350272358756", 
    "timestamp": 1644911897910 
}
```

## Remove a user from a chat group or chat room

Payload fields:

| Field          | Type | Description         |
| :------------ | :------- | :---------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `kick`: Remove a member from a chat group or chat room.<br/>For chat rooms, the EasyIM server sends a callback request to your app server in either of the following cases:<br/> - A chat room member is removed by the chat room owner or an admin;<br/> - A chat room member leaves after being offline for 2 minutes.    |
| `status`      | object   | Status, including `description` and `error_code`.    |
| `description` | String   | Description of the cause of the operation failure.  |
| `error_code`  | String   | Error code corresponding to the failure.  |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_user removal from a chat group or chat room event message ID”. | 
| `msg_id`    | String   | User removal from a chat group or chat room event message ID. | 

Chat group member removal callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976432657191668068", 
    "security": "f8956ab6d6f78df93efb2dbca5f2eb83", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "kick", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "aaa111", 
    "eventType": "chat", 
    "msg_id": "976432657191668068", 
    "timestamp": 1644908244060 
}
```

Chat room member removal callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976453352206371172", 
    "security": "693b47daf71607ddd748bf923357e965", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "kick", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "3333", 
    "eventType": "chat", 
    "msg_id": "976453352206371172", 
    "timestamp": 1644913062505 
}
```

## Add a member to the group blocklist

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `ban`: Add a member to the blocklist.                  |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_user addition to the group blocklist event message ID”. | 
| `msg_id`    | String   | User addition to the group blocklist event message ID. | 

Callback request example for banning a chat group member by adding them to the blocklist:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "57a539e96d9cc5c8de9ff779b029c10e", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "ban", 
        "status": { 
            "description": "",
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-7be0-4959-b4a2-06795eb6e63d", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644916572276 
}
```

## Remove a member from the group blocklist

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `allow`: Remove a member from the blocklist.                          |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_user removal from the group blocklist event message ID”. | 
| `msg_id`    | String   | User removal from the group blocklist event message ID. | 

Callback example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "f16b58abc9819e9c24b44e062910fd96", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "undefined", 
        "is_chatroom": false, 
        "operation": "allow", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908410143 
}
```

## Modify chat group or chat room information

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `update`: Modify chat group or chat room information.                                |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group or chat room information modification event message ID”. | 
| `msg_id`    | String   | Chat group or chat room information modification event message ID. | 

Chat group information modification callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976436197985356132", 
    "security": "635636b9e800bbf1387734b206552c5f", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "update", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "976436197985356132", 
    "timestamp": 1644909068475 
}
```

Chat room information modification callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "07796ba1504c284f49710b55fa42dd47", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "update", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644912742341 
}
```

## Block a chat group

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `block`: A user blocks a chat group.                                        |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group block event message ID”. | 
| `msg_id`    | String   | Chat group block event message ID. | 

Chat group block callback request example:

```json
{
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "e8d00a68ea63e76a3d86d6853cf1f5e1", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "block", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_3333@easemob.com/ios_f43087fc-5823-4f53-9276-52546f3a4649", 
    "to": "3333", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644918981507 
}
```

## Unblock a chat group

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `unblock`: A user unblocks a chat group.                               |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group unblock event message ID”. | 
| `msg_id`    | String   | Chat group unblock event message ID. | 

Request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "2f217429e4c2d8c09330cb5e2946aa90", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "unblock", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            }
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_3333@easemob.com/ios_f43087fc-5823-4f53-9276-52546f3a4649", 
    "to": "3333", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644919019526 
}
```

## A new member joins a chat group or chat room

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `operation`   | String   | `presence`: A member joins a chat group or chat room.                                |
| `is_chatroom` | Bool     | Whether this is a chat room.<br/> - `true`: Yes;<br/> - `false`: No.                |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_new member joining a chat group or chat room event message ID”. | 
| `msg_id`    | String   | New member joining a chat group or chat room event message ID. | 
| `from`    | String   | Format: user ID of the new member*@easemob.com. | 
| `to`    | String   | Chat group ID or chat room ID. | 

When a new member joins a chat group, EasyIM sends your app server a notification that the user joined the chat group. Callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976428411540998500", 
    "security": "13abc508b407d38d9c0d0e11bb8b9903", 
    "payload": {
        "muc_id": "XXXX#XXXX_173548612157441@conference.easemob.com", 
        "is_chatroom": false,
        "operation": "presence" 
        }, 
    "group_id": "173548612157441", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com",
    "to": "173548612157441", 
    "eventType": "chat",
    "msg_id": "976428411540998500",
    "timestamp": 1644907255555
}
```

When a new member joins a chat room, EasyIM sends your app server a notification that the user joined the chat room. Callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "dde4f43158aea3e142bc6cbc21862f91", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "presence" 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_2222@easemob.com", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644912467208 
}
```

## A member leaves a chat group or chat room

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `operation`   | String   | `absence`: A member leaves a chat group or chat room.                                |
| `is_chatroom` | Bool     | Whether this is a chat room.<br/> - `true`: Yes;<br/> - `false`: No.                |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_member leaving a chat group or chat room event message ID”. | 
| `msg_id`    | String   | Member leaving a chat group or chat room event message ID. | 
| `from`    | String   | Format: user ID of the member who left*@easemob.com. | 
| `to`    | String   | Chat group ID or chat room ID. | 

When a member voluntarily leaves or is removed from a chat group, EasyIM sends your app server a notification that the user left the chat group. Callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "d738f1b0379179677827f3da023d1195", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "absence" 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_aaa111@easemob.com", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908244062 
}
```

When a member voluntarily leaves or is removed from a chat room, EasyIM sends your app server a notification that the user left the chat room. Callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "5aed52a1df02d8103afd2d8dd2dce04b", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "absence" 
        },
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644912308123 
}
```

## A member voluntarily leaves a chat group or chat room

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `operation`   | String   | `leave`: A member voluntarily leaves a chat group or chat room.                   |
| `is_chatroom` | Bool     | Whether this is a chat room.<br/> - `true`: Yes;<br/> - `false`: No.                |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_member voluntarily leaving a chat group or chat room event message ID”. | 
| `msg_id`    | String   | Member voluntarily leaving a chat group or chat room event message ID. | 

Chat group member voluntary leave callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976437246481664356", 
    "security": "a44839d3599f71c4ce237e216bd502aa", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "leave", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_aaa111@easemob.com", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976437246481664356", 
    "timestamp": 1644909312600 
}
```

Chat room member voluntary leave callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976450112211388772", 
    "security": "52f2b10050c763a64067bf339e5dc2b1", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "leave", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976450112211388772", 
    "timestamp": 1644912308125
}
```

## Transfer chat group ownership

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群}@conference.easemob.com`. |
| `operation`   | String   | `assing_owner`: Transfer chat group ownership.                                     |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group ownership transfer event message ID”. | 
| `msg_id`    | String   | Chat group ownership transfer event message ID. | 

Chat group ownership transfer callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "fccdff91bd5e0cc3c4758ee3670a5ec2", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "assing_owner", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com", 
    "to": "2222", 
    "eventType": "chat",
    "msg_id": "XXXX", 
    "timestamp": 1644907917897
}
```

## Add a chat group or chat room admin

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `add_admin`: Add a chat group or chat room admin.                           |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group or chat room admin addition event message ID”. | 
| `msg_id`    | String   | Chat group or chat room admin addition event message ID. | 

Chat group admin addition callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "5f7e42423ad70312a3e024ee02ac849a", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "add_admin", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908059969 
}
```

Chat room admin addition callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "d48c298d2356d8e1799bf9ef2d6bc4f3", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "add_admin", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644913136541 
}
```

## Remove a chat group or chat room admin

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `remove_admin`: Remove a chat group or chat room admin.                        |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group or chat room admin removal event message ID”. | 
| `msg_id`    | String   | Chat group or chat room admin removal event message ID. | 

Chat group admin removal callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "bb1cea362da70f2f47424e526382e5f1", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "remove_admin", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX",
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908095988 
}
```

Chat room admin removal callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "f9cab6ee655af0e9de66e8be3de978a4", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "remove_admin", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType":"chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644913174560
}
```

## Mute a chat group or chat room member

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `add_mute`: Mute a chat group or chat room member.                            |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group or chat room member mute event message ID”. | 
| `msg_id`    | String   | Chat group or chat room member mute event message ID. | 

Chat group member mute callback example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "57a539e96d9cc5c8de9ff779b029c10e", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "ban", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-7be0-4959-b4a2-06795eb6e63d",
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644916572276 
}
```

Chat room member mute callback example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454013950101860", 
    "security": "6a6445651e66043b1cbc7b605ef1692a", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "add_mute", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976454013950101860", 
    "timestamp": 1644913216581 
}
```

## Unmute a chat group or chat room member

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `remove_mute`: Unmute a chat group or chat room member.                     |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group or chat room member unmute event message ID”. | 
| `msg_id`    | String   | Chat group or chat room member unmute event message ID. | 

Chat group member unmute callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976435338580855140", 
    "security": "710b5e43699a35d98a6de6a9fc89d937", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "remove_mute", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
          } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976435338580855140", 
    "timestamp": 1644908868377 
}
```

Chat room member unmute callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454039732488548", 
    "security": "40b3accd9c2403c387808e92204db200", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "remove_mute", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976454039732488548", 
    "timestamp": 1644913222584 
}
```

## Update a chat group or chat room announcement

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `reason`      | String   | Chat group announcement content.                                                 |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `update_announcement`: Update a chat group or chat room announcement.                   |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group or chat room announcement update event message ID”. | 
| `msg_id`    | String   | Chat group or chat room announcement update event message ID. | 

Chat group announcement update example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976445325097044324", 
    "security": "06091170b6e9b9c20cd7c29266ad038c", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "gogngao", 
        "is_chatroom": false, 
        "operation": "update_announcement", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976445325097044324", 
    "timestamp": 1644911193549 
}
```

Chat room announcement update example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454374907709796", 
    "security": "0d6cdf339ec1d78ec6ee8337892ae52f", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "reason": "1111", 
        "is_chatroom": true, 
        "operation": "update_announcement", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        },
    "group_id": "XXXX",
    "host": "XXXX",
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976454374907709796", 
    "timestamp": 1644913300624 
}
```

## Delete a chat group or chat room announcement

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `reason`      | String   | Chat group announcement content after deletion, which is empty.                                     |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `delete_announcement`: Delete a chat group or chat room announcement.                   |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group or chat room announcement deletion event message ID”. | 
| `msg_id`    | String   | Chat group or chat room announcement deletion event message ID. | 

Chat group announcement deletion callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454194401642852", 
    "security": "d8f31984da8d33462a4c9558c9b793fc", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "delete_announcement", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            }
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976454194401642852", 
    "timestamp": 1644913258595 
}
```

Chat room announcement deletion callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976471348589103460", 
    "security": "f809f2d2099a3d58323ec879da08b689", 
    "payload": { 
        "muc_id": "XXXX#XXXX_173558850453505@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": true, 
        "operation": "delete_announcement", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "173558850453505",
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "173558850453505", 
    "eventType": "chat", 
    "msg_id": "976471348589103460", 
    "timestamp": 1644917252616 
}
```

## Upload a chat group shared file

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群 ID}@conference.easemob.com`. |
| `reason`      | object   | Contains `file_id`、`file_name`、`file_owner`、`file_size`、`created`  fields. |
| `file_id`     | String   | File ID.                                                    |
| `file_name`   | String   | File name.                                                   |
| `file_owner`  | String   | File owner.                                                 |
| `file_size`   | Int      | File size in bytes.                                       |
| `created`     | long     | Unix timestamp when the file is created, in milliseconds.                          |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `upload_file`: Upload a chat group file.                                  |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group shared file upload event message ID”. | 
| `msg_id`    | String   | Chat group shared file upload event message ID. | 

Chat group shared file upload callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976438097292036452", 
    "security": "426c327006ccc3283d157d7da22db27f", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": {
            "data": {
                "file_id": "79ddf840-XXXX-XXXX-bec3-ad40868b03f9",
                "file_name": "a.csv",
                "file_owner": "@ppAdmin",
                "file_size": 6787,
                "created": 1644909510085
                }
            },
        "is_chatroom": false, 
        "operation": "upload_file", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976438097292036452", 
    "timestamp": 1644909510697 
}
```

## Delete a chat group shared file

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群 ID}@conference.easemob.com`. |
| `reason`      | object   | Same as the `file_id` used when the chat group file is uploaded.                              |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `delete_file`: Delete a chat group file.                                  |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group shared file deletion event message ID”. | 
| `msg_id`    | String   | Chat group shared file deletion event message ID. | 

Chat group shared file deletion callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976438501211900260", 
    "security": "63820599e494260f350d3bf1d8d2ffea", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "79ddf840-8e2f-11ec-bec3-ad40868b03f9", 
        "is_chatroom": false, 
        "operation": "delete_file", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976438501211900260", 
    "timestamp": 1644909604744 
}
```

## Add a user to the chat group or chat room allowlist

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `add_user_white_list`: Add a user to the chat group or chat room allowlist.           |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_user addition to the chat group or chat room allowlist event message ID”. | 
| `msg_id`    | String   | User addition to the chat group or chat room allowlist event message ID. | 

Callback request example for adding a user to the group allowlist:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX", 
    "security": "93cd067cebd7313c7fcfcb0a682e30a8", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "add_user_white_list", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976437461330692452", 
    "timestamp": 1644909362624 
}
```

Callback request example for adding a user to the chat room allowlist:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976456222645422436", 
    "security": "b0996aa98a641988f897b30feea32c88", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "add_user_white_list", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976456222645422436", 
    "timestamp": 1644913730839 
}
```

## Remove a user from the chat group or chat room allowlist

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `remove_user_white_list`: Remove a user from the chat group or chat room allowlist.      |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_user removal from the chat group or chat room allowlist event message ID”. | 
| `msg_id`    | String   | User removal from the chat group or chat room allowlist event message ID. | 

Callback request example for removing a user from the group allowlist:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976437487104690532", 
    "security": "b1c9ddc90c220a5aec2094d99a057b27", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "remove_user_white_list", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976437487104690532", 
    "timestamp": 1644909368625 
}
```

Callback request example for removing a user from the chat room allowlist:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976456643757738340", 
    "security": "986f3b741cc28092768e0ff3b5b668e7", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "remove_user_white_list", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976456643757738340", 
    "timestamp": 1644913828888 
}
```

## Globally mute a chat group or chat room

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No.                 |
| `operation`   | String   | `ban_group`: Globally mute a chat group or chat room.                          |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group or chat room global mute event message ID”. | 
| `msg_id`    | String   | Chat group or chat room global mute event message ID. | 

Chat group global mute callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976455861675231588", 
    "security": "b647e5b0c0c07f61426b1143f107b362", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "ban_group", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976455861675231588", 
    "timestamp": 1644913646792 
}
```

Chat room global mute callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454710078736740", 
    "security": "f1da0b9cfbf3a265ce26bf974ba442db", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "ban_group", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976454710078736740", 
    "timestamp": 1644913378662
}
```

## Unmute a globally muted chat group or chat room

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat group or chat room where the callback event occurs, `{appkey}_{群/聊天室 ID}@conference.easemob.com`. |
| `is_chatroom` | Bool     | Whether this is a chat room.<br/> - `true`: Yes;<br/> - `false`: No.                |
| `operation`   | String   | `remove_ban_group`: Unmute a globally muted chat group or chat room.                 |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.                                         |
| `error_code`  | String   | Error code corresponding to the failure.                                           |

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat group or chat room global unmute event message ID”. | 
| `msg_id`    | String   | Chat group or chat room global unmute event message ID. | 

Chat group global unmute callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "XXXX", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "remove_ban_group", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644913644791 
}
```

Chat room global unmute callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "5edfc6329c37e83e4602943663320797", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "remove_ban_group", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644913522735 
}
```

## Set or update chat room custom attributes

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat room where the callback event occurs, `{appkey}_{聊天室 ID}@conference.easemob.com`. |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No. |
| `event_info.ext`   | String   | Message extension field containing chat room custom attribute content.   |
| `event_info.type`   | String   | Chat room custom attribute type.    |
| `operation`   | String   | `set_metadata`: Set or update chat room custom attributes.  |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.|
| `error_code`  | String   | Error code corresponding to the failure.|

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat room custom attribute setting or update event message ID”. | 
| `msg_id`    | String   | Chat room custom attribute setting or update event message ID. | 
| `from`    | String   | Chat room ID. | 
| `to`    | String   | User ID of a chat room member. | 

Chat room custom attribute setting or update callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976432657191668068", 
    "security": "f8956ab6d6f78df93efb2dbca5f2eb83", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "event_info":{
           "ext":"{\"result\":{\"successKeys\": [\"key1\",\"key2\"],\"errorKeys\":{}},\"identify\":\"\",\"is_forced\":false,\"muc_name\":\"Take\",\"need_notify\":true, \"properties\":{\"key1\": \"value1\",\"key2\": \"value2 \"}, \"operator \": \"user1\"}",
           "type":"event_none" 
        },
        "operation": "set_metadata", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
        } 
    }, 
    "group_id": "662XXXX13", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "662XXXX13", 
    "to": "aaa111", 
    "eventType": "chat", 
    "msg_id": "976432657191668068", 
    "timestamp": 1644908244060 
}
```

## Delete chat room custom attributes

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat room where the callback event occurs, `{appkey}_{聊天室 ID}@conference.easemob.com`. |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No. |
| `event_info.ext`   | String   | Message extension field containing chat room custom attribute content.   |
| `event_info.type`   | String   | Chat room custom attribute type.    |
| `operation`   | String   | `delete_metadata`: Delete chat room custom attributes.  |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.|
| `error_code`  | String   | Error code corresponding to the failure.|

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_chat room custom attribute deletion event message ID”. | 
| `msg_id`    | String   | Chat room custom attribute deletion event message ID. | 
| `from`    | String   | Chat room ID. | 
| `to`    | String   | User ID of a chat room member. | 

Chat room custom attribute deletion callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976432657191668068", 
    "security": "f8956ab6d6f78df93efb2dbca5f2eb83", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "event_info":{
           "ext":"{\"result\":{\"successKeys\": [\"key1\",\"key2\"],\"errorKeys\":{}},\"identify\":\"\",\"is_forced\":false,\"muc_name\":\"Take\",\"need_notify\":true, \"properties\":{\"key1\": \"value1\",\"key2\": \"value2 \"}, \"operator \": \"user1\"}",
           "type":"event_none" 
        },
        "operation": "delete_metadata", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
        } 
    }, 
    "group_id": "662XXXX13", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "662XXXX13", 
    "to": "aaa111", 
    "eventType": "chat", 
    "msg_id": "976432657191668068", 
    "timestamp": 1644908244060 
}
```

## Set custom chat group member attributes

Payload fields:

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | Unique identifier on the server of the chat room where the callback event occurs, `{appkey}_{群组 ID}@conference.easemob.com`. |
| `is_chatroom` | Bool     | Whether this is a chat room. <br/> - `true`: Yes;<br/> - `false`: No. |
| `event_info.ext`   | String   | Message extension field containing custom chat group member attribute content.   |
| `event_info.type`   | String   | Custom chat group member attribute type.    |
| `operation`   | String   | `group_member_metadata_update`: Set or update custom chat group member attributes.  |
| `status`      | object   | Status, including `description` and `error_code`.                   |
| `description` | String   | Description of the cause of the operation failure.|
| `error_code`  | String   | Error code corresponding to the failure.|

Fields outside the payload are described in the following table:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` is the unique identifier of each callback request, in the format “App Key_custom chat group member attribute setting event message ID”. | 
| `msg_id`    | String   | Custom chat group member attribute setting event message ID. | 
| `from`    | String   | Chat group ID. | 
| `to`    | String   | User ID of a chat group member. | 

Custom chat group member attribute setting callback request example:

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976432657191668068", 
    "security": "f8956ab6d6f78df93efb2dbca5f2eb83", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "event_info":{
           "ext":"{\"result\":{\"successKeys\": [\"key1\",\"key2\"],\"errorKeys\":{}},\"identify\":\"\",\"is_forced\":false,\"muc_name\":\"Take\",\"need_notify\":true, \"properties\":{\"key1\": \"value1\",\"key2\": \"value2 \"}, \"operator \": \"user1\"}",
           "type":"event_none" 
        },
        "operation": "group_member_metadata_update", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
        } 
    }, 
    "group_id": "632XXXX13", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "632XXXX13", 
    "to": "aaa111", 
    "eventType": "chat", 
    "msg_id": "976432657191668068", 
    "timestamp": 1644908244060 
}
```
