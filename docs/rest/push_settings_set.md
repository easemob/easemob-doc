# Configure Offline Push

## Feature overview

You can configure a user's offline push settings for a specified one-to-one chat, group chat, or globally.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
PUT https://{host}/{org}/{app}/users/{userId}/notification/{chattype}/{key}
```

| Parameter       | Type   | Description          | Required |
| :--------- | :----- | :--------------------------------- | :------- |
| `userId` | String | User ID of the user whose offline push settings to configure.    | Yes       | 
| `chattype` | String | Object type, that is, the conversation type:<br/> - `user`: A user, indicating a one-to-one chat.<br/> - `chatgroup`: A chat group, indicating a group chat. | Yes       |
| `key`      | String | Object name:<br/> - For a one-to-one chat, the peer user's user ID.<br/> - For a group chat, the chat group ID.                      | Yes       |

:::tip
To configure a user's global offline push settings, set both `userId` and `key` to the user's user ID and set `chattype` to `user`.
:::

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```bash
// Replace <YourUserToken> with your user token
curl -X PUT 'https://XXXX/XXXX/XXXX/users/XXXX/notification/user/XXXX' \
-H 'Authorization: Bearer <YourUserToken>' \
-H 'Content-Type: application/json' \
-d '{
    "type":"NONE",
    "ignoreInterval":"21:30-08:00",
    "ignoreDuration":86400000
}'
```

## Request header fields

For details about the `Content-Type` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter             | Type   | Description      | Required |
| :--------------- | :----- | :------------ | :------- |
| `type`           | String | Offline push notification mode:<br/> - `DEFAULT`: The specified conversation uses the app settings. This value applies only to one-to-one or group chat conversations, not at the app level.<br/> - `ALL`: Receive push notifications for all offline messages.<br/> - `AT`: Receive push notifications only for offline messages that mention the current user. This field is recommended for group chats. To mention one or more users, pass "em_at_list":["user1", "user2" ...] in the `ext` field when creating the message. To mention everyone, pass "em_at_list":"all" in this field.<br/> - `NONE`: Do not receive push notifications for offline messages. <Container type="notice" title="Notice">If this parameter is set at both the app and specified conversation levels, the conversation uses its own setting, while other conversations use the app setting.</Container> | No      |
| `ignoreInterval` | String | Daily DND period for offline push, accurate to the minute, in HH:MM-HH:MM format, for example, 08:30-10:00. The time uses the 24-hour clock. The valid ranges for the hour and minute values in the start and end times are [00,23] and [00,59], respectively.<br/> Configure this parameter as follows:<br/> - This parameter applies only at the app level, not to one-to-one or group chats.<br/> - After this parameter is set, DND mode is triggered at the specified time every day. For example, if the start time is `08:00` and the end time is `10:00`, DND mode is active from 8:00 to 10:00 every day. If, at 11:00, you set the start time to `08:00` and the end time to `12:00`, DND mode is active from 11:00 to 12:00 that day and from 8:00 to 12:00 every subsequent day.<br/> - If the start and end times are the same, DND mode is active all day.<br/> - If the end time is earlier than the start time, DND mode is active from the start time each day to the end time on the following day. For example, if the start time is `10:00` and the end time is `08:00`, DND mode is active from 10:00 that day to 8:00 the following day.<br/> - Currently, DND mode can be enabled for only one specified period per day. Multiple DND periods are not supported, and a new setting overwrites the previous setting.<br/> - If you do not set this parameter, pass an empty string.<br/> - If both this parameter and `ignoreDuration` are set, DND mode is active during both periods on that day. For example, at 8:00, set the app-level `ignoreInterval` to 8:00-10:00 and `ignoreDuration` to 14400000 milliseconds (4 hours). The app is then in DND mode from 8:00 to 12:00 today and from 8:00 to 10:00 every subsequent day.| No      |
| `ignoreDuration` | Long   | DND duration for offline push, in milliseconds. The value range is [0,604800000]. `0` indicates that this parameter is invalid, and `604800000` indicates that DND mode lasts for 7 days.<br/> - This parameter applies at the app level and to one-to-one and group chats.<br/> - Unlike `ignoreInterval`, which takes effect every day, this parameter takes effect only once and immediately after it is set. For example, at 8:00, set the app-level `ignoreDuration` to 14400000 milliseconds (4 hours). The app is then in DND mode only from 8:00 to 12:00 today.<br/> - If both this parameter and `ignoreInterval` are set, DND mode is active during both periods on that day. For example, at 8:00, set the app-level `ignoreInterval` to 8:00-10:00 and `ignoreDuration` to 14400000 milliseconds (4 hours). The app is then in DND mode from 8:00 to 12:00 today and from 8:00 to 10:00 every subsequent day. | No      |

## Response example

```json
{
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users/notification/user/XXXX",
  "timestamp": 1647503749918,
  "organization": "hx",
  "application": "17fe201b-XXXX-XXXX-XXXX-1ed1ebd7b227",
  "action": "put",
  "data": {
    "type": "NONE",
    "ignoreDuration": 1647590149924,
    "ignoreInterval": "21:30-08:00"
  },
  "duration": 20,
  "applicationName": "hxdemo"
}
```

## Response body fields

If the returned HTTP status code is 200, the request is successful. The response body contains the following fields:

| Field                  | Type   | Description                   |
| :-------------------- | :----- | :--------------------- |
| `data`                | JSON   | Offline push settings.       |
| - `type`           | String | Offline push notification mode.     |
| - `ignoreInterval` | String | DND period for offline push. |
| - `ignoreDuration` | Long   | DND duration for offline push.   |

The other fields in the response body are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the Easemob Console, identical to the `app_name` request parameter. |

## Error code

If the returned HTTP status code is not 200, the request fails. See [Common error codes](push_error.html) for possible causes.
