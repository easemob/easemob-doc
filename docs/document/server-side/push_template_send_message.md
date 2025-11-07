# 发消息时配置推送模板

发送消息时，可使用消息扩展参数 `ext.em_push_template.name` 指定推送模板名称。

若使用默认模板 **default**，消息推送时自动使用默认模板，创建消息时无需传入模板名称。

该扩展参数的 JSON 结构如下：

```json
{
    "ext":{
        "em_push_template":{
            "name":"hxtest"
        },
         "em_push_ext":{
                "group_user_nickname":"Jane"
            }
    }
}
```

## 发单聊消息使用推送模板

下面以发送单聊文本消息时使用自定义推送模板为例进行介绍。

### 请求示例

关于推送标题和推送内容参数的填充，即 `title_pattern` 和 `content_pattern`，详见 [创建离线推送模板](push_template_create.html)。

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/messages/users' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "from": "user1",
    "to": [
        "user2"
    ],
    "type": "txt",
    "body": {
        "msg": "testmessages"
    },
    "ext": {
        "em_push_template": {
            "name": "hxtest"
        }
    }
}'
```

### 响应示例 

```json
{
  "path": "/messages/users",
  "uri": "https://XXXX/XXXX/XXXX/messages/users",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "user2": "1029457500870543736"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

接口详情，请参见[发送文本消息](/document/server-side/message_single.html#发送文本消息)。

单聊会话中发送其他类型的消息的接口，请参见[发送单聊消息](/document/server-side/message_single.html)接口描述。

## 发群聊消息使用推送模板

下面以发送群聊文本消息时使用自定义推送模板和群组昵称为例进行介绍：

### 请求示例

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatgroups' 
-H 'Content-Type: application/json' 
-H 'Accept: application/json' 
-H 'Authorization: Bearer <YourAppToken>' 
-d '{
    "from": "user1",
    "to": ["184524748161025"],
    "type": "txt",
    "need_group_ack": false,
    "body": {
        "msg": "testmessages"
    },
    "ext": {
        "em_push_template": {
            "name": "hxtest"
        },
        "em_push_ext":{
                "group_user_nickname":"Jane"
            }
    },        
    "routetype":"ROUTE_ONLINE"
}'
```

### 响应示例

```json
{
  "path": "/messages/chatgroups",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatgroups",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "184524748161025": "1029544257947437432"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

接口详情，请参见[发送文本消息](/document/server-side/message_group.html#发送文本消息)。

群聊会话中发送其他类型的消息的接口，请参见[发送群聊消息](/document/server-side/message_group.html)接口描述。
