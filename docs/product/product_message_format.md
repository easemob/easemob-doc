# 消息格式描述 

目前，环信即时通讯 IM 支持的消息类型 `type` 如下表所示：

| 参数   | 类型   |
| :----- | :----- |
| `txt` | 文本消息 |
| `loc`  | 位置消息 |
| `cmd` | 透传消息 |
| `img` | 图片消息 |
| `audio` | 语音消息  |
| `video` | 视频消息 |
| `file` | 文件消息 |
| `custom` | 自定义类型消息 |
| `combine` | 合并消息 |
| `markdown` | 流式消息 |

## 消息 body 内容介绍

消息 body 为 JSONArray 结构，其中包含消息类型和消息内容。不同类型的消息只是 `body` 字段内容存在差异。

### 文本消息

文本消息的 body 包含如下字段：

| 参数   | 类型   | 描述                             |
| :----- | :----- | :------------------------------- |
| `msg`  | String | 消息内容。                       |

示例如下：

```json
{
  "msg": "testmessages"
}
```

### 位置消息

位置消息的 body 包含如下字段：

| 参数   | 类型   | 描述                         |
| :----- | :----- | :--------------------------- |
| `lat`  | double   | 位置的纬度。                 |
| `lng`  | double   | 位置的经度。                 |
| `addr` | String | 位置的地址描述。             |

示例如下：

```json
{
    "lat": 39.966,
    "lng": 116.322,
    "addr":"中国北京市海淀区中关村"
}
```

### 透传消息

透传消息的 body 包含如下字段：

| 参数     | 类型   | 描述                         |
| :------- | :----- | :--------------------------- |
| `action` | String | 命令内容。                   |

示例如下：

```json
{
  "action":"action1"
}
```

### 图片消息

对于图片消息，通过 REST API 发消息时建议传入 `filename` 参数，否则客户端收到图片消息时无法显示文件名称，而且需保证通过 `url` 参数能下载到对应图片。

若上传图片时，设置了文件访问限制（`restrict-access`），则图片上传后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取的 `share-secret`，发送图片消息时传入该参数。上传原图，环信服务器会自动为图片生成缩略图。

图片消息的 body 包含如下字段：

| 参数          | 类型   | 描述        |
| :------------ | :----- | :------------------------ |
| `filename`    | String | 图片文件名称，包含文件后缀名。     |
| `secret`      | String | 图片的访问密钥，即成功上传图片后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取的 `share-secret`。如果图片文件上传时设置了文件访问限制（`restrict-access`），则发送消息时该字段为必填。 |
| `url`         | String | 图片 URL 地址：https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}。其中 `file_uuid` 为文件 ID，成功上传图片文件后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取。  |
| `size`        | JSON   | 图片的尺寸。单位为像素。<br/> - `height`：图片高度。<br/> - `width`：图片宽度。   |

示例如下：

```json
{
    "filename":"testimg.jpg",
    "secret":"VfXXXXNb_",
    "url":"https://XXXX/XXXX/XXXX/chatfiles/55f12940-XXXX-XXXX-8a5b-ff2336f03252",
    "size": {
      "width":480,
      "height":720
    }
}
```

### 语音消息

对于语音消息，通过 REST API 发消息时建议传入 `filename` 参数，否则客户端收到语音消息时无法显示文件名称，而且需保证通过 `url` 参数能下载到对应语音。

若上传语音文件时，设置了文件访问限制（`restrict-access`），则文件上传后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取的 `share-secret`，发送语音消息时传入该参数。 

语音消息的 body 包含如下字段：

| 参数          | 类型   | 描述                                                                              |
| :------------ | :----- | :------------------------------------------ |
| `url`         | String | 语音文件的 URL 地址：https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}。其中 `file_uuid` 为文件 ID，成功上传语音文件后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取。 |
| `filename`    | String | 语音文件名称，包含文件后缀名。    |
| `length`      | Int    | 语音时长。单位为秒。    |
| `secret`      | String | 语音文件的访问密钥，即成功上传语音文件后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取的 `share-secret`。如果语音文件上传时设置了文件访问限制（`restrict-access`），则发送消息时该字段为必填。 |

示例如下：

```json
{
    "url": "https://XXXX/XXXX/XXXX/chatfiles/1dfc7f50-XXXX-XXXX-8a07-7d75b8fb3d42",
    "filename": "testaudio.amr",
    "length": 10,
    "secret": "HfXXXXCjM"
}
```

### 视频消息

对于视频消息，通过 REST API 发消息时建议传入 `filename` 参数，否则客户端收到视频消息时无法显示文件名称，而且需保证通过 `url` 参数能下载到对应视频。

若上传视频文件时，设置了文件访问限制（`restrict-access`），则文件上传后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取的 `share-secret`，发送视频消息时传入该参数。环信服务器不会自动为视频文件生成缩略图。若需要视频缩略图，需先调用[文件上传](/document/server-side/message_upload_file.html)接口上传缩略图。然后，再次调用文件上传接口上传视频源文件。

视频消息的 body 包含如下字段：

| 参数           | 类型   | 描述    |
| :------------- | :----- | :--------- |
| `filename`     | String | 视频文件名称，包含文件后缀名。  |
| `thumb`        | String | 视频缩略图的 URL 地址，格式为 https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}。其中，`file_uuid` 为视频缩略图上传后，环信服务器返回的缩略图的 UUID。 |
| `length`       | Int    | 视频时长。单位为秒。   |
| `secret`       | String | 视频文件的访问密钥，即成功上传视频文件后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取的 `share-secret`。如果视频文件上传时设置了文件访问限制（`restrict-access`），则发送消息时该字段为必填。  |
| `file_length`  | Long   | 否      | 视频文件大小，单位为字节。  |
| `thumb_secret` | String | 缩略图文件访问密钥。如果文件上传时设置了文件访问限制，则该字段存在。 |
| `url`          | String | 视频文件的 URL 地址：https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}。其中 `file_uuid` 为文件 ID，成功上传视频文件后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取。 |

示例如下：

```json
{
    "filename" : "test.avi",
    "thumb" : "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97",
    "length" : 0,
    "secret":"VfXXXXNb_",
    "file_length" : 58103,
    "thumb_secret" : "ZyXXXX2I",
    "url" : "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"
}
```

### 文件消息

对于文件消息，通过 REST API 发消息时建议传入 `filename` 参数，否则客户端收到文件消息时无法显示文件名称，而且需保证通过 `url` 参数能下载到对应文件。

若上传文件时，设置了文件访问限制（`restrict-access`），则文件上传后，从[文件上传](/document/server-side/message_upload_file.html)的响应 body 中获取的 `share-secret`，发送文件消息时传入该参数。 

文件消息的 body 包含如下字段：

| 参数       | 类型   | 是否必需 | 描述     |
| :--------- | :----- | :------- | :------------ |
| `filename` | String | 否       | 文件名称。建议传入该参数，否则客户端收到文件消息时无法显示文件名称。   |
| `secret`   | String | 否       | 文件访问密钥，即成功上传文件后，从 [文件上传](/document/server-side/message_upload_file.html) 的响应 body 中获取的 `share-secret`。如果文件上传时设置了文件访问限制（`restrict-access`），则该字段为必填。      |
| `url`      | String | 是       | 文件 URL 地址：`https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。其中 `file_uuid` 为文件 ID，成功上传视频文件后，从 [文件上传](/document/server-side/message_upload_file.html) 的响应 body 中获取。 |

示例如下：

```json
{
    "filename":"test.txt",
    "secret":"1-g0XXXXua",
    "url": "https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"
}
```

### 消息携带自定义扩展字段

你可以在消息扩展部分 `ext` 中保存更多信息。例如，下面示例中的 `em_ignore_notification` 表示是否发送静默消息。

```json
"ext": {
      "em_ignore_notification": true
    }
```

| 参数          | 类型   | 描述                                                                          |
| :------------ | :----- | :---------------------------------------------------------------------------- |
| `ext` | JSON | 消息支持扩展字段，可添加自定义信息。不能对该参数传入 `null`。 |

### 自定义消息

自定义消息的 body 包含如下字段：

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| `customExts`  | JSON   | 用户自定义的事件属性，类型必须是 `Map<String,String>`，最多可以包含 16 个元素。`customExts` 是可选的，发消息时不需要可以不传。 |
| `customEvent` | String | 用户自定义的事件类型。该参数的值必须满足正则表达式 [a-zA-Z0-9-_/\.]{1,32}，长度为 1-32 个字符。 |
| `type`        | String | 消息类型。自定义消息为 `custom`。                |

自定义类型消息格式示例如下：

```json
[
  {
  "customExts":
    {
    "name":"flower",
    "size":"16",
    "price":"100"
    },
  "customEvent":"gift_1",
  "type":"custom"
 }
]
```

## 离线推送的消息扩展字段

环信即时通讯 IM 支持 APNs 推送和 Android 厂商离线推送，包括华为、荣耀、FCM、小米、魅族、OPPO 和 vivo。使用离线推送时，你可以通过消息扩展字段实现推送相应功能，例如，设置推送模板中的推送标题和内容、设置仅接收提及（`@`）某些用户的推送通知等。

### 推送扩展字段

`payload.ext` 结构如下：

| 字段                   | 类型         | 描述  |
| ---------------------- | ------------ | ------------------ |
| `em_push_filter`     | Object       | 推送过滤。                                                   |
| `em_at_list`             | `List<String>` | `@`列表。      |
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
| `directed_template` | Object        | 定向推送模板。此类模板适用于群组消息的离线推送，即群组中某个或某些用户需要接收的离线推送通知与其他用户不同的场景。其中的字段如下表所示。    |
| `disable_at_content` | Boolean        | 是否禁用默认 @ 内容：<br/> - `true`：禁用<br/> - （默认）`false`：不禁用  |

关于 `title_args` 和 `content_args` 字段的设置，详见[推送模板文档](/document/server-side/push_template_overview.html)。

`em_push_ext` 结构如下：

| 字段                  | 类型   | 描述                                           |
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
| `thread_id`         | String         | 通知分组标识符。|
| `em_push_content_available`              | Integer          | 设置为 `1` 表示后台通知。详见[苹果官网的用户通知文档](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app?language=objc)。  |


`em_android_push_ext` 结构如下：

| 字段                      | 类型    | 描述                                                         |
| ------------------------- | ------- | ------------------------------------------------------------ |
| `fcm_options`               | Object  | FCM SDK 功能选项。                                           |
| `fcm_channel_id`            | String  | FCM 推送通道（最高优先级）。                                 |
| `honor_click_action`        | String  | 荣耀点击跳转，优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **荣耀** 页面设置的 **Action** 参数的配置。 |
| `honor_importance`          | String  | 荣耀推送优先级：<br/> - `LOW`：低优先级；<br/> - （默认）`NORMAL`：普通优先级。 |
| `honor_target_user_type`  | Integer | 推送用户类型：<br/> - `0`：普通 <br/> - `1`：测试             |
| `huawei_target_user_type` | Integer | 推送用户类型：<br/> - `0`：普通 <br/> - `1`：测试              |
| `huawei_category`   | String  | 完成[自分类权益申请](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835#section893184112272)后，用于标识消息类型，确定[消息提醒方式](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/message-classification-0000001149358835#ZH-CN_TOPIC_0000001149358835__p3850133955718)，对特定类型消息加快发送，取值如下：[华为官方文档中category字段的解释](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-References/https-send-api-0000001050986197#section13271045101216)。该参数的设置优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **华为** 页面设置的 **Category** 参数的配置。 |
| `huawei_receipt_id`       | String  | 华为回执地址 ID。                           |
| `huawei_click_action`       | String  | 华为点击跳转 action，优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **华为** 页面设置的 **Action** 参数的配置。 |
| `huawei_channel_id`         | String  | 华为推送通道（最高优先级）。                                 |
| `meizu_click_activity`      | String  | 魅族点击跳转 activity，优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **魅族** 页面设置的 **Activity** 参数的配置。 |
| `meizu_notice_type`      | Int  | 通道类型：<br/> - `0`：公信通道<br/> - `1`：私信通道 |
| `oppo_channel_id`           | String  | OPPO 推送通道（最高优先级），优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **OPPO** 页面设置的 **Activity** 参数的配置。 |
| `oppo_click_activity`       | String  | OPPO 点击跳转 activity，优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **OPPO** 页面设置的 **Activity** 参数的配置。 |
| `vivo_category`             | String  | vivo 二级分类配置，优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **VIVO** 页面设置的 **Category** 参数的配置。 |
| `vivo_click_activity`       | String  | vivo 点击跳转 activity，优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **VIVO** 页面设置的 **Activity** 参数的配置。 |
| `xiaomi_channel_id` | String  | 小米通道 ID，优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **小米** 页面设置的 **Channel ID** 参数的配置。 |
| `xiaomi_click_action`       | String  | 小米点击跳转 action，优先级高于在环信控制台的**即时通讯** > **功能配置** > **消息推送** > **证书管理** > **添加推送证书** > **小米** 页面设置的 **Action** 参数的配置。 |

`em_harmony_push_ext` 结构如下：

| 字段              | 类型    | 描述                                  |
| ----------------- | ------- | ------------------------------------- |
| `category`        | String  | 消息分类。                              |
| `click_action`    | String  | 点击跳转应用内页。                      |
| `is_test_message` | Boolean | 是否是推送测试消息(beta 版仅支持测试)。 |
| `notify_id`       | Integer | 通知 ID，相同的 ID 通知替换。             |
| `receipt_id`      | String  | 回执 ID。                                |

### 示例

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
            "thread_id": "abc"
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






