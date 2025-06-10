# 离线推送的消息扩展说明

环信即时通讯 IM 支持 APNs 推送和 Android 厂商离线推送，包括华为、荣耀、FCM、小米、魅族、OPPO 和 vivo。使用离线推送时，你可以通过消息扩展字段实现推送相应功能，例如，设置推送模板中的推送标题和内容，或者设置群组中针对某些用户的个性化推送通知等。

## 推送扩展字段

`payload.ext` 结构如下：

| 字段                   | 类型         | 描述  |
| ---------------------- | ------------ | ------------------ |
| `em_push_filter`     | Object       | 推送过滤。                                                   |
| `em_at_list`             | `List<String>` | 被提及(`@`)用户列表。可通过该字段实现在某些场景下被 `@` 的用户收到的推送通知内容与其他用户不同，例如，这些用户会收到 `{0}在群中@了我`。如果未满足使用，则建议使用定向模板功能自定义通知效果。      |
| `em_push_template `      | Object       | 推送模板。     |
| `em_ignore_notification` | Boolean      | 静默消息开关，`true` 表示不推送。  |
| `em_force_notification`  | Boolean      | 强制推送开关，`true` 则不检查用户是否开启免打扰。  |
| `em_apns_ext`            | Object       | APNs 配置。 |
| `em_android_push_ext`    | Object       | Android 配置。 |
| `em_harmony_push_ext`    | Object       | 鸿蒙推送扩展配置。 |
| `em_push_ext`            | Object       | 通用的配置。 |

`em_push_filter` 结构如下：

| 字段                 | 类型         | 描述                     |
| ----------------     | ------------ | ------------------------ |
| `accept_device_id`     | `List<String>` | 接收推送通知的设备 ID 列表。   |
| `ignore_device_id`     | `List<String>` | 不接收推送通知的设备 ID 列表。 |
| `accept_notifier_name` | `List<String>` | 接收推送的证书名列表。     |
| `ignore_notifier_name` | `List<String>` | 不接收推送的证书名列表。   |

`em_push_template` 结构如下：

| 字段         | 类型         | 描述                                                         |
| ------------ | ------------ | ------------------------------------------------------------ |
| `name`         | String       | 推送模板名称。                                                 |
| `title_args`   | `List<String>` | 推送模板标题参数，内置参数：发送方昵称 `{$fromNickname}`。      |
| `content_args` | `List<String>` | 推送模板内容参数，内置参数：消息内容 `{$msg}`，如果开通了翻译，消息内容会跟随翻译结果显示。 |
| `directed_template` | Object        | 定向推送模板。此类模板适用于群组消息的离线推送，即群组中某个或某些用户需要接收接收的离线推送通知与其他用户不同的场景。其中的字段如下表所示。    |

定向模板中的字段：

| 字段           | 类型          | 作用             |
| -------------- | ------------- | ---------------- |
| `target`       | `Array<String>` | 用户 ID 列表，传入的用户 ID 必须为全部小写，否则不生效。     |
| `name`         | String        | 推送模板名称。     |
| `title_args`   | `Array<String>` | 推送模板标题。 |
| `content_args` | `Array<String>` | 推送模板内容。 |

关于如何使用定向模板，详见[使用示例](#使用定向模板)。

关于 `title_args` 和 `content_args` 字段的设置，详见[推送模板文档](push.html#使用推送模板)。

`em_push_ext` 结构如下：

| 字段                  | 类型   | 描述                                           |
| --------------------- | ------ | ---------------------------------------------- |
| `title`               | String | 自定义推送标题。                                 |
| `content`             | String | 自定义推送内容。                                 |
| `custom`              | Object | 自定义推送扩展参数(t, f, m, g, e) 中 e 的内容。 |
| `group_user_nickname` | String | 发送方群组昵称（用于推送显示替换发送方信息）。   |
| `type` | String | 当前消息为 VOIP 推送通知。注意：仅 APNs 已支持 VOIP 推送通知时使用。   |

`em_apns_ext` 结构如下：

| 字段                | 类型             | 描述   |
| -------------- | ---------------- | ------ |
| `em_push_category`           | String           | APNs 推送配置，推送通知类别。                                       |
| `em_push_mutable_content`    | Boolean          | APNs 推送配置，`true` 为富文本推送通知，`false` 则为普通通知。             |
| `em_push_sound`              | String           | APNs 推送配置，自定义铃声，`Library/Sounds/` 目录下的 `aiff`、`wav` 或 `caf` 文件，例如 `appsound.caf`。 |
| `em_push_badge`              | Integer          | APNs 推送配置，自定义角标数。      |
| `thread_id`         | String         | 通知分组标识符。|
| `em_push_content_available`              | Integer          | 设置为 `1` 表示后台通知。详见[苹果官网的用户通知文档](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app?language=objc)。  |

`em_android_push_ext` 结构如下：

| 字段                      | 类型    | 描述                                                         |
| ------------------------- | ------- | ------------------------------------------------------------ |
| `fcm_options`               | Object  | FCM SDK 功能选项。                                           |
| `fcm_channel_id`            | String  | FCM 推送通道（最高优先级）。                                 |
| `honor_click_action`        | String  | 荣耀点击跳转，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **荣耀** 页面设置的 **Action** 参数的配置。 |
| `honor_importance`          | String  | 荣耀推送优先级：<br/> - `LOW`：低优先级；<br/> - （默认）`NORMAL`：普通优先级。 |
| `honor_target_user_type`  | Integer | 推送用户类型：<br/> - `0`：普通 <br/> - `1`：测试             |
| `huawei_target_user_type` | Integer | 推送用户类型：<br/> - `0`：普通 <br/> - `1`：测试              |
| `huawei_category`   | String  | 完成[自分类权益申请](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835#section893184112272)后，用于标识消息类型，确定[消息提醒方式](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835#ZH-CN_TOPIC_0000001149358835__p3850133955718)，对特定类型消息加快发送，取值如下：[华为官方文档中category字段的解释](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/https-send-api-0000001050986197#section13271045101216)。该参数的设置优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **华为** 页面设置的 **Category** 参数的配置。 |
| `huawei_receipt_id`       | String  | 华为回执地址 ID。                           |
| `huawei_click_action`       | String  | 华为点击跳转 action，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **华为** 页面设置的 **Action** 参数的配置。 |
| `huawei_channel_id`         | String  | 华为推送通道（最高优先级）。                                 |
| `meizu_click_activity`      | String  | 魅族点击跳转 activity，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **魅族** 页面设置的 **Activity** 参数的配置。 |
| `meizu_notice_type`      | Int  | 通道类型：<br/> - `0`：公信通道<br/> - `1`：私信通道 |
| `oppo_channel_id`           | String  | OPPO 推送通道（最高优先级），优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **OPPO** 页面设置的 **Activity** 参数的配置。 |
| `oppo_click_activity`       | String  | OPPO 点击跳转 activity，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **OPPO** 页面设置的 **Activity** 参数的配置。 |
| `oppo_category`       | String  | 通道类别名，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **OPPO** 页面设置的 **Category** 参数的配置。 |
| `oppo_notify_level`       | String  | 通知栏消息提醒等级取值定义，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **OPPO** 页面设置的 **NotifyLevel** 参数的配置。<br/> - `1`：通知栏<br/> - `2`：通知栏+锁屏<br/> - `16`：通知栏+锁屏+横幅+震动+铃声<br/>使用 `notify_level` 参数时，`oppo_category` 参数必传。|
| `vivo_category`             | String  | vivo 二级分类配置，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **VIVO** 页面设置的 **Category** 参数的配置。 |
| `vivo_click_activity`       | String  | vivo 点击跳转 activity，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **VIVO** 页面设置的 **Activity** 参数的配置。 |
| `xiaomi_channel_id` | String  | 小米通道 ID，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **小米** 页面设置的 **Channel ID** 参数的配置。 |
| `xiaomi_click_action`       | String  | 小米点击跳转 action，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **小米** 页面设置的 **Action** 参数的配置。 |

`em_harmony_push_ext` 结构如下：

| 字段              | 类型    | 描述                                  |
| ----------------- | ------- | ------------------------------------- |
| `category`        | String  | 消息分类。                              |
| `click_action`    | String  | 点击跳转应用内页。                      |
| `is_test_message` | Boolean | 是否是推送测试消息(beta 版仅支持测试)。 |
| `notify_id`       | Integer | 通知 ID，相同的 ID 通知替换。             |
| `receipt_id`      | String  | 回执 ID。                                |

## 示例

### 离线推送相关的扩展字段

离线推送的消息扩展字段如下所示：

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
            "em_push_title": "您有一条新消息",
            "em_push_content": "您有一条新消息",
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
            "honor_click_action": "",
            "honor_importance": "",
            "honor_target_user_type": 0,
            "huawei_target_user_type": 0,
            "huawei_category": "",
            "huawei_receipt_id": "",
            "huawei_click_action": "",
            "huawei_channel_id": "",
            "meizu_click_activity": "",
            "meizu_notice_type": 1,
            "xiaomi_channel_id": "",
            "oppo_channel_id": "",
            "oppo_click_activity": "",
            "vivo_category": "",
            "vivo_click_activity": "",
            "xiaomi_channel_id": "",
            "xiaomi_click_action": "",
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

### 使用定向模板

下面介绍如何使用定向模板实现群组中针对某个用户推送的通知与其他用户不同的情况：

1. 创建定向推送模板。

```json
{
    "name": "at_push_template",
    "title_pattern": "{0}",
    "content_pattern": "{0}:{1}"
}
```

2. 在群组中发送消息时使用定向推送模板。例如，向群组中的 `hxtest` 用户发送推送通知 “张三在群里@了你”，其他用户收到“张三发来一条消息”。

```json
{
    "em_push_template": {
        "name": "push_template",
        "title_args": [
            "群组名"
        ],
        "content_args": [
            "张三",
            "发来一条消息"
        ],
        "directed_template": {
            "target": [
                "hxtest"
            ],
            "name": "at_push_template",
            "title_args": [
                "群组名"
            ],
            "content_args": [
                "张三",
                "在群里@了你"
            ]
        }
    }
}
```

另外，对于被提及的用户之外的其他用户，推送内容也并非一定要用模板，也可用推送扩展字段自定义标题和内容：

```json
{
    "em_push_template": {
        "directed_template": {
            "target": [
                "hxtest"
            ],
            "name": "at_push_template",
            "title_args": [
                "群组名"
            ],
            "content_args": [
                "张三",
                "在群里@了你"
            ]
        }
    },
    "em_push_ext": {
        "title": "群组名",
        "content": "张三:发来一条消息",
        "type": "call"

    }
}
```

3. 推送通知内容显示。

群组被 @ 的用户收到的通知如下图所示：

![img](/images/server-side/push_@.png)

群组中其他用户收到的通知如下图所示：

![img](/images/server-side/push_other.png)



