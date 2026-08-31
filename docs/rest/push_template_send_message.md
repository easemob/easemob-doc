# Configure a Push Template When Sending Messages

When sending a message, you can use the `ext.em_push_template.name` message extension parameter to specify the push template name.

If you use the default **default** template, it is automatically applied when a message is pushed. You do not need to pass the template name when creating the message.

The extension parameter has the following JSON structure:

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

## Use a push template when sending one-to-one chat messages

The following example uses a custom push template when sending a one-to-one text message.

### Request example

For details about how to populate the push title and content parameters, `title_pattern` and `content_pattern`, see [Create an offline push template](push_template_create.html).

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

### Response example 

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

For API details, see [Send text messages](/rest/message_single.html#send-text-messages).

For APIs used to send other types of messages in one-to-one chat conversations, see [Send one-to-one chat messages](/rest/message_single.html).

## Use a push template when sending group chat messages

The following example uses a custom push template and group member nickname when sending a group text message:

### Request example

```bash
# Replace <YourAppToken> with the App Token generated on your server
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

### Response example

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

For API details, see [Send text messages](/rest/message_group.html#send-text-messages).

For APIs used to send other types of messages in group chat conversations, see [Send group chat messages](/rest/message_group.html).
