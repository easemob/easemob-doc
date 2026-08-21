# Create an Offline Push Template

## Feature overview

Create offline push message templates, including the default **default** and **detail** templates and custom templates. You can also create push templates in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Push template configuration](/document/android/push/push_template.html#feature-activation).

If you use the default **default** or **detail** template, the default template is automatically applied when a message is pushed. You do not need to pass the template name when creating the message.

## Call frequency limit

10 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/notification/template
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```bash
curl -X POST 'https://XXXX/XXXX/XXXX/notification/template' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "name": "test7",
    "title_pattern": "你好,{0}",
    "content_pattern": "推送测试,{0}"
}'
```

## Request header fields

For details about the `Content-Type` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter              | Type   | Description                                  | Required |
| :---------------- | :----- | :------------------------------------ | :------- |
| `name`            | String | Name of the push template to add. The template name can contain up to 64 characters from the following character sets:<br/>- 26 lowercase letters, a-z;<br/>- 26 uppercase letters, A-Z;<br/>- 10 digits, 0-9.              | Yes       |
| `title_pattern`   | String | Custom push title, for example, Title {0}.     | Yes       |
| `content_pattern` | String | Custom push content, for example, Content {0}, {1}. | Yes       |

You can set `title_pattern` and `content_pattern` in the following ways:
- Enter fixed content. For example, set the title to "Hello" and the content to "You have a new message."
- Use built-in parameters:
  - `{$dynamicFrom}`: Fills in friend remarks, the [group member nickname](push_template_send_message.html), or the push nickname, in descending order of priority.
  - `{$fromNickname}`: Push nickname.  
  - `{$msg}`: Message content.
- Use custom parameters: Enter array index placeholders in the template in the following format: {0} {1} {2} ... {n}

 For the push title and content, when using either of the first two methods, you do not need to pass the parameter when creating a message because the server obtains it automatically. For the third method, you need to pass the parameter through the `ext.em_push_template` extension field with the following JSON structure:

  ```json
  {
      "ext":{
          "em_push_template":{
              "title_args":[
                  "环信"
              ],
              "content_args":[
                  "欢迎使用im-push",
                  "加油"
              ]
          }
      }
  }
  
  # title: {0} = "环信"
  # content: {0} = "欢迎使用im-push" {1} = "加油"
  ```

A group member nickname is the nickname of a member in a chat group. When sending a group message, the member sets the nickname through an extension field with the following JSON structure:

```json
  {
    "ext":{
            "em_push_ext":{
                "group_user_nickname":"Jane"
            }
        }
  }      
```        

## Response example

```json
{
  "uri": "https://XXXX/XXXX/XXXX/notification/template",
  "timestamp": 1646989584108,
  "organization": "hx",
  "application": "17fe201b-XXXX-XXXX-XXXX-1ed1ebd7b227",
  "action": "post",
  "data": {
    "name": "test7",
    "createAt": 1646989584124,
    "updateAt": 1646989584124,
    "title_pattern": "你好,{0}",
    "content_pattern": "推送测试,{0}"
  },
  "duration": 26,
  "applicationName": "XXXX"
}
```

## Response body fields

If the returned HTTP status code is 200, the request succeeds. The response body contains the following fields:

| Parameter                   | Type   | Description                                         |
| :--------------------- | :----- | :------------------------------------------- |
| `data`                 | JSON   | Information about the push template.                         |
| `data.name`            | String | Push template name.                             |
| `data.createAt`        | Number | Unix timestamp when the template was created, in milliseconds.         |
| `data.updateAt`        | Number | Unix timestamp when the template was last updated, in milliseconds. |
| `data.title_pattern`   | String | Custom title of the push template.                       |
| `data.content_pattern` | String | Custom content of the push template.                       |

The other fields in the response body are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not 200, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not 200, the request fails. See [Common error codes](push_error.html) for possible causes.
