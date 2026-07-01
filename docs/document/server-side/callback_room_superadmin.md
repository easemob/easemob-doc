# 聊天室超级管理员变更回调事件 

## 功能说明

成功添加或删除聊天室超级管理员后，环信服务器会按照 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调查看添加/删除的聊天室超级管理员，进行数据同步。

## 前提条件

- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则。详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 添加超级管理员
 
### 回调时机

调用 RESTful API [添加了聊天室超级管理员](/document/server-side/chatroom_admin_add.html)。

### 回调请求

#### 请求示例

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

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.admin`| JSON   | 添加的聊天室超级管理员的用户 ID。 | 
| `payload.type` | String | 添加聊天室超级管理员的事件，值为 `ADD`。  | 
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `id`           | String | 聊天室 ID。                                                 |
| `type`         | String | 事件类型。此处为 `CHATROOM`（聊天室事件）。     |
| `event`        | String | 事件名称。该参数的值固定为 `group_op_event`。 |
| `operation`    | String | 具体操作。添加聊天室超级管理员的操作为 `ROOM_SUPER_ADMIN`。 |
| `operator`     | String | 操作人。若 app 管理员添加了超级管理员，该参数的值固定为 `@ppAdmin`。        |
| `timestamp`    | Long   | 操作完成的时间戳。      | 


## 移除超级管理员
 
### 回调时机

调用 RESTful API [移除了聊天室超级管理员](/document/server-side/chatroom_admin_remove.html)。 

### 回调请求

#### 请求示例

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

#### 请求字段说明

| 字段名称         | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `security`     | String | 签名，格式如下: `MD5(callId+secret+timestamp)`。详见[配置环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。|
| `payload`       | Object | 事件内容。                                                     |
| `payload.admin`| JSON   | 移除的聊天室超级管理员的用户 ID。 | 
| `payload.type` | String | 移除聊天室超级管理员的事件，值为 `REMOVE`。  | 
| `appkey`       | String | 你在环信控制台注册的应用唯一标识。                                |
| `id`           | String | 聊天室 ID。                                                 |
| `type`         | String | 事件类型。此处为 `CHATROOM`（聊天室事件）。     |
| `event`        | String | 事件名称。该参数的值固定为 `group_op_event`。 |
| `operation`    | String | 具体操作。移除聊天室超级管理员的操作为 `ROOM_SUPER_ADMIN`。 |
| `operator`     | String | 操作人。若 app 管理员移除了超级管理员，该参数的值固定为 `@ppAdmin`。        |
| `timestamp`    | Long   | 操作完成的时间戳。      | 

## 其他说明

**群组操作的事件以及子事件后续会有更多新增。若业务强依赖这些事件或者子事件，业务中需添加对`operation` 和 `payload.type` 的强判断。**







