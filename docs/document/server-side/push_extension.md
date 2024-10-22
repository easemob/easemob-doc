 # 离线推送的消息扩展说明

环信即时通讯 IM 支持 APNs 推送和 Android 厂商离线推送，包括华为、荣耀、FCM、小米、魅族、OPPO 和 vivo。

## 推送扩展字段

`payload.ext` 结构如下：

| 字段                   | 类型         | 作用  |
| ---------------------- | ------------ | ------------------ |
| `em_push_filter`     | Object       | 推送过滤。                                                   |
| `em_at_list`             | `List<String>` | `@`列表。      |
| `em_push_template `      | Object       | 推送模板。     |
| `em_ignore_notification` | Boolean      | 静默消息开关，`true` 表示不推送。  |
| `em_force_notification`  | Boolean      | 强制推送开关，`true` 则不检查用户是否开启免打扰。  |
| `em_apns_ext`            | Object       | APNs 配置。 |
| `em_android_push_ext`    | Object       | Android 配置。 |
| `em_harmony_push_ext`    | Object       | 鸿蒙推送扩展配置。 |
| `em_push_ext`            | Object       | 新的推送配置，用于集中管理，后续通用的配置会添加到该字段。 |

`em_push_filter` 结构如下：

| 字段                 | 类型         | 作用                     |
| ----------------     | ------------ | ------------------------ |
| `accept_device_id`     | `List<String>` | 接收推送通知的设备 ID 列表。   |
| `ignore_device_id`     | `List<String>` | 不接收推送通知的设备 ID 列表。 |
| `accept_notifier_name` | `List<String>` | 接收推送的证书名列表。     |
| `ignore_notifier_name` | `List<String>` | 不接收推送的证书名列表。   |

`em_push_template` 结构如下：

| 字段         | 类型         | 作用                                                         |
| ------------ | ------------ | ------------------------------------------------------------ |
| `name`         | String       | 推送模板名称。                                                 |
| `title_args`   | `List<String>` | 推送模板标题参数，内置参数：发送者昵称 `{$fromNickname}`。      |
| `content_args` | `List<String>` | 推送模板内容参数，内置参数：消息内容 `{$msg}`，如果开通了翻译，消息内容会跟随翻译结果显示。 |

关于 `title_args` 和 `content_args` 字段的设置，详见[推送模板文档](push.html#使用推送模板)。

`em_push_ext` 结构如下：

| 字段                  | 类型   | 作用                                           |
| --------------------- | ------ | ---------------------------------------------- |
| `title`               | String | 自定义推送标题。                                 |
| `content`             | String | 自定义推送内容。                                 |
| `custom`              | Object | 自定义推送扩展参数(t, f, m, g, e) 中 e 的内容。 |
| `group_user_nickname` | String | 发送方群组昵称（用于推送显示替换发送方信息）。   |

`em_apns_ext` 结构如下：

| 字段                | 类型             | 描述   |
| -------------- | ---------------- | ------ |
| `em_push_category`           | String           | APNs 推送配置，推送通知类别。                                       |
| `em_push_mutable_content`    | Boolean          | APNs 推送配置，`true` 为富文本推送通知，`false` 则为普通通知。             |
| `em_push_sound`              | String           | APNs 推送配置，自定义铃声，`Library/Sounds/` 目录下的 `aiff`、`wav` 或 `caf` 文件，例如 `appsound.caf`。 |
| `em_push_badge`              | Integer          | APNs 推送配置，自定义角标数。      |

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
| `oppo_channel_id`           | String  | OPPO 推送通道（最高优先级），优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **OPPO** 页面设置的 **Activity** 参数的配置。 |
| `oppo_click_activity`       | String  | OPPO 点击跳转 activity，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **OPPO** 页面设置的 **Activity** 参数的配置。 |
| `vivo_category`             | String  | vivo 二级分类配置，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **VIVO** 页面设置的 **Category** 参数的配置。 |
| `vivo_click_activity`       | String  | vivo 点击跳转 activity，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **VIVO** 页面设置的 **Activity** 参数的配置。 |
| `xiaomi_channel_id` | String  | 小米通道 ID，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **小米** 页面设置的 **Channel ID** 参数的配置。 |
| `xiaomi_click_action`       | String  | 小米点击跳转 action，优先级高于在环信即时通讯控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **小米** 页面设置的 **Action** 参数的配置。 |

`em_harmony_push_ext` 结构如下：

| 字段              | 类型    | 作用                                  |
| ----------------- | ------- | ------------------------------------- |
| `category`        | String  | 消息分类。                              |
| `click_action`    | String  | 点击跳转应用内页。                      |
| `is_test_message` | Boolean | 是否是推送测试消息(beta 版仅支持测试)。 |
| `notify_id`       | Integer | 通知 ID，相同的 ID 通知替换。             |
| `receipt_id`      | String  | 回执 ID。                                |

## 示例

离线推送的消息扩展字段如下所示：

```
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
            "em_push_badge": 1
        },
        "em_android_push_ext": {
            "fcm_options": {
                "key": "value"
            },
            "fcm_channel_id": "",
            "honor_click_action": "",
            "honor_importance": ""
            "honor_target_user_type": 0
            "huawei_target_user_type": 0
            "huawei_category": "",
            "huawei_receipt_id": "",
            "huawei_click_action": "",
            "huawei_channel_id": "",
            "meizu_click_activity": "",
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






