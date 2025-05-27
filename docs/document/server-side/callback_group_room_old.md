# 群组和聊天室操作

| 事件                       | payload 中类型                         | 群聊触发事件                                   | 聊天室触发事件         |
| :------------------------- | :------------------------------------- | :--------------------------------------------- | :--------------------- |
| muc                        | -                                      | 群聊操作所有事件                               | 聊天室操作所有事件     |
| muc:create                 | {“operation”:“create”}                 | 创建群                                         | 不支持                 |
| muc:destroy                | {“operation”:“destroy”}                | 解散群                                         | 解散聊天室             |
| muc:apply                  | {“operation”:“apply”}                  | 用户申请加入群                                 | 不支持                 |
| muc:apply_accept           | {“operation”:“apply_accept”}           | 同意用户加群申请                               | 不支持                 |
| muc:invite                 | {“operation”:“invite”}                 | 邀请新用户进群                                 | 不支持                 |
| muc:invite_accept          | {“operation”:“invite_accept”}          | 受邀用户同意入群                               | 不支持                 |
| muc:invite_decline         | {“operation”:“invite_decline”}         | 受邀用户拒绝入群                               | 不支持                 |
| muc:kick                   | {“operation”:“kick”}                   | 踢出群      | 踢出聊天室（包括聊天室成员被聊天室所有者或管理员移出聊天室以及聊天室成员离线 2 分钟后退出聊天室时会发送该事件）             |
| muc:ban                    | {“operation”:“ban”}                    | 将用户添加到群组黑名单     | 不支持                 |
| muc:allow                  | {“operation”:“allow”}                  | 将用户移出群组黑名单  | 不支持                 |
| muc:update                 | {“operation”:“update”}                 | 群信息修改                                     | 聊天室信息修改         |
| muc:block                  | {“operation”:“block”}                  | 用户屏蔽群                                     | 不支持                 |
| muc:unblock                | {“operation”:“unblock”}                | 用户解除屏蔽群                                 | 不支持                 |
| muc:presence               | {“operation”:“presence”}               | 有新成员加入了群                                     | 有新成员加入了聊天室         |
| muc:absence                | {“operation”:“absence”}                | 有成员退出了群                                 | 有成员离开了聊天室     |
| muc:direct_joined          | {“operation”:“direct_joined”}          | 成员直接加入群（未开启加入验证）        | 不支持  |
| muc:leave                  | {“operation”:“leave”}                  | 成员主动退出群                                 | 成员主动退出聊天室     |
| muc:assing_owner           | {“operation”:“assing_owner”}           | 转让群                                         | 不支持                 |
| muc:add_admin              | {“operation”:“add_admin”}              | 添加群管理员                                   | 添加聊天室管理员       |
| muc:remove_admin           | {“operation”:“remove_admin”}           | 移除群管理员                                   | 移除聊天室管理员       |
| muc:add_mute               | {“operation”:“add_mute”}               | 将群成员禁言                                   | 将聊天室成员禁言       |
| muc:remove_mute            | {“operation”:“remove_mute”}            | 将群成员解除禁言                               | 将聊天室成员解除禁言   |
| muc:update_announcement    | {“operation”:“update_announcement”}    | 更新群公告                                     | 更新聊天室公告         |
| muc:delete_announcement    | {“operation”:“delete_announcement”}    | 删除群公告                                     | 删除聊天室公告         |
| muc:upload_file            | {“operation”:“upload_file”}            | 上传群文件                                     | /                      |
| muc:delete_file            | {“operation”:“delete_file”}            | 删除群文件                                     | /                      |
| muc:add_user_white_list    | {“operation”:“add_user_white_list”}    | 将成员加入群白名单                             | 将成员加入聊天室白名单 |
| muc:remove_user_white_list | {“operation”:“remove_user_white_list”} | 将成员移除群白名单                             | 将成员移除聊天室白名单 |
| muc:ban_group              | {“operation”:“ban_group”}              | 群全局禁言                                     | 聊天室全局禁言         |
| muc:remove_ban_group       | {“operation”:“remove_ban_group”}   | 解除群全局禁言                                 | 解除聊天室全局禁言     |
| muc:set_metadata | {“operation”:“set_metadata”} | 不支持 | 设置/更新聊天室自定义属性。|
| muc:delete_metadata | {“operation”:“delete_metadata”} | 不支持| 删除聊天室自定义属性。|
| muc:group_member_metadata_update | {“operation”:“group_member_metadata_update”} | 设置群成员的自定义属性 | 不支持 |

## 创建群组

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群组 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。<br> - `true`：是；<br> - `false`：否。             |
| `operation`   | String   | `create` 创建群组。                                  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 创建群组失败的原因描述。                             |
| `error_code`  | String   | 创建失败对应的错误码。                                       |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_群组创建事件的消息 ID”。 | 
| `msg_id`    | String   | 群组创建事件的消息 ID。 | 

创建群组回调请求示例：

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

## 解散群/聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `operation`   | String   | `destroy` 解散群/聊天室。                                    |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 解散群组或聊天室失败的原因描述。                             |
| `error_code`  | String   | 操作失败对应的错误码。                                       |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_群组解散事件的消息 ID”。 | 
| `msg_id`    | String   | 群组解散事件的消息 ID。 | 

解散群组回调请求示例：

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

解散聊天室回调请求示例：

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_聊天室解散事件的消息 ID”。 | 
| `msg_id`    | String   | 聊天室解散事件的消息 ID。 | 

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

## 用户申请加入群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群组 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `apply`：申请加入群。                                        |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 申请加入群组失败的原因描述。                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_用户申请入群事件的消息 ID”。 | 
| `msg_id`    | String   | 用户申请入群事件的消息 ID。 | 

回调请求示例：

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

## 同意成员加群申请

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `apply_accept`：接受加入群组的申请。                               |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_用户同意入群事件的消息 ID”。 | 
| `msg_id`    | String   | 用户同意入群事件的消息 ID。 | 

回调请求示例：

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

## 邀请新用户进群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `invite`：邀请新成员加入群。                                 |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 邀请新用户加入群组失败的原因描述。                           |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_邀请新用户入群事件的消息 ID”。 | 
| `msg_id`    | String   | 邀请新用户入群事件的消息 ID。 | 

回调请求示例：

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

## 受邀用户同意入群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `invite_accept`：受邀用户同意加入群。                        |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_受邀用户同意入群事件的消息 ID”。 | 
| `msg_id`    | String   | 受邀用户同意入群事件的消息 ID。 | 

回调示例：

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

## 受邀用户拒绝入群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `invite_decline`：受邀用户拒绝加入群。                       |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_受邀用户拒绝入群事件的消息 ID”。 | 
| `msg_id`    | String   | 受邀用户拒绝入群事件的消息 ID。 | 

回调请求示例：

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

## 踢出群/聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义         |
| :------------ | :------- | :---------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `kick`：将成员踢出群组或聊天室。<br/>对于聊天室来说，环信服务器会在以下两种情况向你的应用服务器发送回调请求：<br/> - 聊天室成员被聊天室所有者或管理员移出聊天室；<br/> - 聊天室成员离线 2 分钟后退出聊天室。    |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。    |
| `description` | String   | 操作失败的原因描述。  |
| `error_code`  | String   | 失败对应的错误码。  |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_用户被踢出群/聊天室事件的消息 ID”。 | 
| `msg_id`    | String   | 用户被踢出群/聊天室事件的消息 ID。 | 

踢出群回调请求示例：

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

踢出聊天室请求示例：

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

## 添加成员至群组黑名单

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `ban`：将成员添加到黑名单。                  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_用户被添加至群黑名单事件的消息 ID”。 | 
| `msg_id`    | String   | 用户被添加至群黑名单事件的消息 ID。 | 

封禁群成员，即将群成员添加到黑名单的回调请求示例：

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

## 将成员从群组黑名单中移除

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `allow`：将成员从黑名单中移除。                          |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_用户被移出群黑名单事件的消息 ID”。 | 
| `msg_id`    | String   | 用户被移出群黑名单事件的消息 ID。 | 

回调示例如下所示：

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

## 群/聊天室信息修改

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `update`：群/聊天室信息修改。                                |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_群/聊天室信息修改事件的消息 ID”。 | 
| `msg_id`    | String   | 群/聊天室信息修改事件的消息 ID。 | 

群信息修改回调请求示例：

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

聊天室信息修改回调请求示例：

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

## 屏蔽群组

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `block`：用户屏蔽群。                                        |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_群组屏蔽事件的消息 ID”。 | 
| `msg_id`    | String   | 群组屏蔽事件的消息 ID。 | 

用户屏蔽群回调请求示例：

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

## 解除屏蔽群组

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `unblock`：用户解除屏蔽群组。                               |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_解除屏蔽群组事件的消息 ID”。 | 
| `msg_id`    | String   | 解除屏蔽群组事件的消息 ID。 | 

请求示例：

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

## 有新成员加入了群组或聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `operation`   | String   | `presence`：成员进群/聊天室。                                |
| `is_chatroom` | Bool     | 是否是聊天室。<br/> - `true`：是；<br/> - `false`：否。                |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_新成员加入群组或聊天室事件的消息 ID”。 | 
| `msg_id`    | String   | 新成员加入群组或聊天室事件的消息 ID。 | 
| `from`    | String   | 格式为：新成员的用户 ID*@easemob.com。 | 
| `to`    | String   | 群组 ID 或聊天室 ID。 | 

有新成员加入了群组时，即时通讯 IM 服务会向你的应用服务器发送用户加入了群组的通知。回调请求示例：

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

有新成员加入了聊天室时，即时通讯 IM 服务会向你的应用服务器发送用户加入了聊天室的通知。回调请求示例：

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

## 有成员离开了群组或聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `operation`   | String   | `absence`：成员离开群/聊天室。                                |
| `is_chatroom` | Bool     | 是否是聊天室。<br/> - `true`：是；<br/> - `false`：否。                |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_有成员离开了群组或聊天室事件的消息 ID”。 | 
| `msg_id`    | String   | 有成员离开了群组或聊天室事件的消息 ID。 | 
| `from`    | String   | 格式为：离开的成员的用户 ID*@easemob.com。 | 
| `to`    | String   | 群组 ID 或聊天室 ID。 | 

有新成员主动离开了群组或被移出时，即时通讯 IM 服务会向你的应用服务器发送用户离开了群组的通知。回调请求示例：

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

有新成员主动离开了聊天室或被移出时，即时通讯 IM 服务会向你的应用服务器发送用户离开了聊天室的通知。回调请求示例：

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

## 成员主动退出群/成员主动离开聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `operation`   | String   | `leave`：有成员主动退出群/主动离开聊天室。                   |
| `is_chatroom` | Bool     | 是否是聊天室。<br/> - `true`：是；<br/> - `false`：否。                |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_有成员退出了群组或聊天室事件的消息 ID”。 | 
| `msg_id`    | String   | 有成员退出了群组或聊天室事件的消息 ID。 | 

成员主动退出群回调请求示例：

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

成员主动离开聊天室回调请求示例：

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

## 转让群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群}@conference.easemob.com`。 |
| `operation`   | String   | `assing_owner`：转让群。                                     |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_群组转让事件的消息 ID”。 | 
| `msg_id`    | String   | 群组转让事件的消息 ID。 | 

转让群回调请求示例：

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

## 添加群/聊天室管理员

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `add_admin`：添加群/聊天室管理员。                           |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_添加群/聊天室管理员事件的消息 ID”。 | 
| `msg_id`    | String   | 添加群/聊天室管理员事件的消息 ID。 | 

添加群管理员回调请求示例：

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

添加聊天室管理员回调请求示例：

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

## 删除群/聊天室管理员

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `remove_admin`：删除群/聊天室管理员。                        |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_删除群/聊天室管理员事件的消息 ID”。 | 
| `msg_id`    | String   | 删除群/聊天室管理员事件的消息 ID。 | 

删除群管理员回调请求示例：

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

删除聊天室管理员回调请求示例：

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

## 将群/聊天室成员禁言

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `add_mute`：将群/聊天室成员禁言。                            |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_禁言群/聊天室成员事件的消息 ID”。 | 
| `msg_id`    | String   | 禁言群/聊天室成员事件的消息 ID。 | 

将群成员禁言回调示例：

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

将聊天室成员禁言回调示例：

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

## 将群/聊天室成员解除禁言

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `remove_mute`：将群/聊天室成员解除禁言。                     |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_解除禁言群/聊天室成员事件的消息 ID”。 | 
| `msg_id`    | String   | 解除禁言群/聊天室成员事件的消息 ID。 | 

将群成员解除禁言回调请求示例：

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

将聊天室成员解除禁言回调请求示例：

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

## 更新群/聊天室公告

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | 群公告内容。                                                 |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `update_announcement`：更新群/聊天室公告。                   |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_更新群/聊天室公告事件的消息 ID”。 | 
| `msg_id`    | String   | 更新群/聊天室公告事件的消息 ID。 | 

更新群公告示例：

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

更新聊天室公告示例：

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

## 删除群/聊天室公告

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | 删除后群公告内容，为空。                                     |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `delete_announcement`：删除群/聊天室公告。                   |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_删除群/聊天室公告事件的消息 ID”。 | 
| `msg_id`    | String   | 删除群/聊天室公告事件的消息 ID。 | 

删除群公告回调请求示例：

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

删除聊天室公告回调请求示例：

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

## 上传群共享文件

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | object   | 包含 `file_id`、`file_name`、`file_owner`、`file_size`、`created` 几个字段。 |
| `file_id`     | String   | 文件 ID。                                                    |
| `file_name`   | String   | 文件名称。                                                   |
| `file_owner`  | String   | 文件所有者。                                                 |
| `file_size`   | Int      | 文件大小，单位为字节。                                       |
| `created`     | long     | 文件创建的 Unix 时间戳，单位为 ms。                          |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `upload_file`：上传群文件。                                  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_上传群共享文件事件的消息 ID”。 | 
| `msg_id`    | String   | 上传群共享文件事件的消息 ID。 | 

上传群共享文件回调请求示例：

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

## 删除群共享文件

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | object   | 跟上传群文件时 `file_id` 一致。                              |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `delete_file`：删除群文件。                                  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_删除群共享文件事件的消息 ID”。 | 
| `msg_id`    | String   | 删除群共享文件事件的消息 ID。 | 

删除群共享文件回调请求示例：

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

## 添加用户进群/聊天室白名单

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `add_user_white_list`：添加用户进群/聊天室白名单。           |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_添加用户进群/聊天室白名单事件的消息 ID”。 | 
| `msg_id`    | String   | 添加用户进群/聊天室白名单事件的消息 ID。 | 

添加用户进群白名单回调请求示例：

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

添加用户进聊天室白名单回调请求示例：

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

## 将用户移出群/聊天室白名单

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `remove_user_white_list`：将用户从群/聊天室白名单移除。      |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_将用户移出群/聊天室白名单事件的消息 ID”。 | 
| `msg_id`    | String   | 将用户移出群/聊天室白名单事件的消息 ID。 | 

将用户移出群白名单回调请求示例：

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

将用户移出聊天室白名单回调请求示例：

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

## 群/聊天室全局禁言

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `ban_group`：将群或聊天室全局禁言。                          |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_群/聊天室全局禁言事件的消息 ID”。 | 
| `msg_id`    | String   | 群/聊天室全局禁言事件的消息 ID。 | 

群全局禁言回调请求示例：

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

聊天室全局禁言回调请求示例：

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

## 解除群/聊天室全局禁言

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | Bool     | 是否是聊天室。<br/> - `true`：是；<br/> - `false`：否。                |
| `operation`   | String   | `remove_ban_group`：解除群或聊天室全局禁言。                 |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_解除群/聊天室全局禁言事件的消息 ID”。 | 
| `msg_id`    | String   | 解除群/聊天室全局禁言事件的消息 ID。 | 

解除群全局禁言回调请求示例：

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

解除聊天室全局禁言回调请求示例：

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

## 设置/更新聊天室自定义属性

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在聊天室在服务器的唯一标识，`{appkey}_{聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。 |
| `event_info.ext`   | String   | 消息扩展字段，包含聊天室的自定义属性内容。   |
| `event_info.type`   | String   | 聊天室自定义属性类型。    |
| `operation`   | String   | `set_metadata`：设置或更新聊天室自定义属性。  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。|
| `error_code`  | String   | 失败对应的错误码。|

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_设置/更新聊天室自定义属性事件的消息 ID”。 | 
| `msg_id`    | String   | 设置/更新聊天室自定义属性事件的消息 ID。 | 
| `from`    | String   | 聊天室 ID。 | 
| `to`    | String   | 聊天室中成员的用户 ID。 | 

设置/更新聊天室自定义属性回调请求示例：

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

## 删除聊天室自定义属性

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在聊天室在服务器的唯一标识，`{appkey}_{聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。 |
| `event_info.ext`   | String   | 消息扩展字段，包含聊天室的自定义属性内容。   |
| `event_info.type`   | String   | 聊天室自定义属性类型。    |
| `operation`   | String   | `delete_metadata`：删除聊天室自定义属性。  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。|
| `error_code`  | String   | 失败对应的错误码。|

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_删除聊天室自定义属性事件的消息 ID”。 | 
| `msg_id`    | String   | 删除聊天室自定义属性事件的消息 ID。 | 
| `from`    | String   | 聊天室 ID。 | 
| `to`    | String   | 聊天室中成员的用户 ID。 | 

删除聊天室自定义属性回调请求示例：

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

## 设置群成员的自定义属性

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在聊天室在服务器的唯一标识，`{appkey}_{群组 ID}@conference.easemob.com`。 |
| `is_chatroom` | Bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。 |
| `event_info.ext`   | String   | 消息扩展字段，包含群组成员的自定义属性内容。   |
| `event_info.type`   | String   | 群组成员的自定义属性类型。    |
| `operation`   | String   | `group_member_metadata_update`：设置或更新群组成员的自定义属性。  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。|
| `error_code`  | String   | 失败对应的错误码。|

payload 之外的字段如下表所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_设置群成员的自定义属性事件的消息 ID”。 | 
| `msg_id`    | String   | 设置群成员的自定义属性事件的消息 ID。 | 
| `from`    | String   | 群组 ID。 | 
| `to`    | String   | 群组成员的用户 ID。 | 

设置群成员的自定义属性的回调请求示例：

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