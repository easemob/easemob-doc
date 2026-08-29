# Message Extensions for Offline Push

EasyIM supports APNs push and offline push from Android vendors, including Huawei, HarmonyOS, Honor, FCM, Xiaomi, Meizu, OPPO, and vivo. When using offline push, you can implement push features through message extension fields. For example, you can set the push title and content in a push template or configure personalized push notifications for certain users in a chat group.

## Push extension fields

`payload.ext` has the following structure:

| Field                   | Type         | Description  |
| ---------------------- | ------------ | ------------------ |
| `em_push_filter`     | Object       | Push filtering.                                                   |
| `em_at_list`             | `List<String>` | List of mentioned (`@`) users. In certain scenarios, you can use this field to make the push notification content received by `@` mentioned users different from that received by other users. For example, these users receive `{0}在群中@了我`. If this field does not meet your requirements, use directed templates to customize notification effects.      |
| `em_push_template `      | Object       | Push template.     |
| `em_ignore_notification` | Boolean      | Silent message switch. `true` indicates that no push notification is sent.  |
| `em_force_notification`  | Boolean      | Forced push switch. If set to `true`, the server does not check whether the user has enabled DND.  |
| `em_apns_ext`            | Object       | APNs push configuration. |
| `em_android_push_ext`    | Object       | Android push configuration. |
| `em_harmony_push_ext`    | Object       | HarmonyOS push extension configuration. |
| `em_push_ext`            | Object       | General configuration. |

`em_push_filter` has the following structure:

| Field                 | Type         | Description                     |
| ----------------     | ------------ | ------------------------ |
| `accept_device_id`     | `List<String>` | List of device IDs that receive push notifications.   |
| `ignore_device_id`     | `List<String>` | List of device IDs that do not receive push notifications. |
| `accept_notifier_name` | `List<String>` | List of push certificate names for which push notifications are received.     |
| `ignore_notifier_name` | `List<String>` | List of push certificate names for which push notifications are not received.   |

`em_push_template` has the following structure:

| Field         | Type         | Description                                                         |
| ------------ | ------------ | ------------------------------------------------------------ |
| `name`         | String       | Push template name.                                                 |
| `title_args`   | `List<String>` | Push template title parameters. Built-in parameter: sender nickname `{$fromNickname}`.      |
| `content_args` | `List<String>` | Push template content parameters. Built-in parameter: message content `{$msg}`. If translation is activated, the message content is displayed according to the translation result. |
| `directed_template` | Object        | Directed push template. This type of template applies to offline push for group messages when one or more users in a chat group need to receive offline push notifications that differ from those received by other users. Its fields are described in the following table.    |
| `disable_at_content` | Boolean        | Whether to disable the default @ content:<br/> - `true`: Disable.<br/> - (Default) `false`: Do not disable.  |

Fields in a directed template:

| Field           | Type          | Description             |
| -------------- | ------------- | ---------------- |
| `target`       | `Array<String>` | List of user IDs. The user IDs passed in must be entirely lowercase; otherwise, they do not take effect.     |
| `name`         | String        | Push template name.     |
| `title_args`   | `Array<String>` | Push template title. |
| `content_args` | `Array<String>` | Push template content. |

For details about how to use a directed template, see [Use a directed template](#use-a-directed-template).

For details about setting the `title_args` and `content_args` fields, see [Push templates](push_template_overview.html).

`em_push_ext` has the following structure:

| Field                  | Type   | Description                                           |
| --------------------- | ------ | ---------------------------------------------- |
| `title`               | String | Custom push title.                                 |
| `content`             | String | Custom push content.                                 |
| `custom`              | Object | Content of e in the custom push extension parameters (t, f, m, g, e). |
| `group_user_nickname` | String | Sender's group member nickname, used to replace the sender information displayed in push notifications.   |
| `type` | String | Indicates that the current message is a VoIP push notification. Note: Use this field only for APNs, which currently supports VoIP push
notifications.<br/> Set this field to `call` to specify that the current message is a VoIP notification message. If the receiver has bound an APNs VoIP push certificate (*.voip), the message is pushed through the VoIP channel by default.  |

`em_apns_ext` has the following structure:

| Field                | Type             | Description   |
| -------------- | ---------------- | ------ |
| `em_push_category`           | String           | APNs push configuration: Push notification category.                                       |
| `em_alert_subTitle`           | String           | APNs push configuration: Push notification subtitle.                                       |
| `em_push_mutable_content`    | Boolean          | APNs push configuration: `true` for a rich-text push notification or `false` for a regular notification.             |
| `em_push_sound`              | String           | APNs push configuration: Custom alert sound. Specify a file in the `Library/Sounds/` directory in `aiff`, `wav`, or `caf` format, for example, `appsound.caf`. |
| `em_push_badge`              | Integer          | APNs push configuration: Custom badge number.      |
| `thread_id`         | String         | Notification grouping identifier.|
| `em_push_content_available`              | Integer          | Set to `1` to indicate a background notification. For details, see [Apple's user notification documentation](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app?language=objc).  |

`em_android_push_ext` has the following structure:

| Field                      | Type    | Description                                                         |
| ------------------------- | ------- | ------------------------------------------------------------ |
| `fcm_options`               | Object  | FCM SDK feature options.                                           |
| `fcm_channel_id`            | String  | FCM push channel, with the highest priority.                                 |


`em_harmony_push_ext` has the following structure:

| Field              | Type    | Description                                  |
| ----------------- | ------- | ------------------------------------- |
| `category`        | String  | Message category.                              |
| `click_action`    | String  | Click action that opens a page in the app.                      |
| `is_test_message` | Boolean | Whether the message is a push test message. The beta version supports test messages only. |
| `notify_id`       | Integer | Notification ID. A notification with the same ID replaces the existing notification.             |
| `receipt_id`      | String  | Receipt ID.                                |

## Examples

### Extension fields related to offline push

The message extension fields for offline push are as follows:

```json
{
    "ext": {
        "em_push_filter": {
            "accept_device_id": [

            ],
            "ignore_device_id": [

            ],
            "accept_notifier_name": [

            ],
            "ignore_notifier_name": [

            ]
        },
        "em_at_list": [
            "abc"
        ],
        "em_push_template": {
            "name": "test6",
            "title_args": [
                "test1"
            ],
            "content_args": [
                "{$fromNickname}",
                "{$msg}"
            ]
        },
        "em_push_ext": {
            "custom": {
                "test": 1
            },
            "group_user_nickname": "happy"
        },
        "em_ignore_notification": false,
        "em_force_notification": true,
        "em_apns_ext": {
            "em_push_category": "",
            "em_push_mutable_content": true,
            "em_push_sound": "appsound.mp3",
            "em_push_badge": 1,
            "thread_id": "abc",
            "em_push_content_available": 1
        },
        "em_android_push_ext": {
            "fcm_options": {
                "key": "value"
            },
            "fcm_channel_id": "",
        },
        "em_harmony_push_ext": {
          "click_action": "com.a.b.shot",
          "category": "IM",
          "notify_id": 1,
          "receipt_id": "RCP78C959D4",
          "is_test_message":true
       }
    }
}
```

### Use a directed template

The following describes how to use a directed template so that the push notification sent to a specific user in a chat group differs from the notifications sent to other users:

1. Create a directed push template.

```json
{
    "name": "at_push_template",
    "title_pattern": "{0}",
    "content_pattern": "{0}:{1}"
}
```

2. Use the directed push template when sending a message in a chat group. For example, send the push notification "Allen mentioned you in the group" to user `hxtest` in the chat group, while other users receive "Allen sent a message."

```json
{
    "em_push_template": {
        "name": "push_template",
        "title_args": [
            "Group Name"
        ],
        "content_args": [
            "Allen",
            "Sent a message"
        ],
        "directed_template": {
            "target": [
                "hxtest"
            ],
            "name": "at_push_template",
            "title_args": [
                "Group Name"
            ],
            "content_args": [
                "Allen",
                "Mentioned you in the group"
            ]
        }
    }
}
```

For users other than the mentioned user, you do not have to use a template for the push content. You can also customize the title and content using push extension fields:

```json
{
    "em_push_template": {
        "directed_template": {
            "target": [
                "hxtest"
            ],
            "name": "at_push_template",
            "title_args": [
                "Group Name"
            ],
            "content_args": [
                "Allen",
                "Mentioned you in the group"
            ]
        }
    },
    "em_push_ext": {
        "title": "Group Name",
        "content": "Allen: Sent a message",
        "type": "call"

    }
}
```

3. View the push notification content.

The notification received by the @ mentioned user in the chat group is shown below:

![img](/images/server-side/push_@.png)

The notification received by other users in the chat group is shown below:

![img](/images/server-side/push_other.png)

