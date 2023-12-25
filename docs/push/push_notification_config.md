# 配置推送通知

本文主要介绍推送通知的结构和字段，建议按需配置。推送通知包含环信提供的基本推送配置以及各厂商的推送配置，默认情况下，后者优先级较高，会覆盖前者。

以下为推送通知的结构：

```json
{  
  "title": "您有一条新消息",
  "subTitle": "",
  "content": "请及时查看",
  "ext": {},
  "config": {
    "clickAction": {
      "url":"", 
      "action":"", 
      "activity":""
    },
    "badge": {
      "addNum": 0, 
      "setNum": 0
      }
  },
  
  "easemob":{},
  "apns": {},
  "fcm": {},
  "fcmV1":{},
  "huawei": {},
  "meizu": {},
  "oppo": {},
  "vivo": {},
  "xiaomi": {},
  "honor":{}
}
```

## 基本推送配置

| 字段                 | 类型   | 描述                                                         | 支持平台      | 是否必需 |
| :------------------- | :----- | :----------------------------------------------------------- | :------------ | :------- |
| `title`              | String | 通知栏展示的通知标题，默认为“您有一条新消息”。该字段长度不能超过 32 个字符（一个汉字相当于两个字符）。 | iOS & Android | 是       |
| `subTitle`           | String | 通知栏展示的通知副标题。该字段长度不能超过 10 个字符。       | iOS           | 否       |
| `content`            | String | 通知栏展示的通知内容。默认为“请及时查看”。该字段长度不能超过 100 个字符（一个汉字相当于两个字符）。 | iOS & Android | 是       |
| `ext`                | Object | 推送自定义扩展信息，为自定义 key-value 键值对。键值对个数不能超过 10 且长度不能超过 1024 个字符。 | iOS & Android | 否       |
| `config`             | Object | 与用户点击通知相关的操作。以及角标的配置，包含 `clickAction` 和 `badge` 字段。 | iOS & Android | 否       |
| `config.clickAction` | Object | 在通知栏中点击触发的动作，均为字符串类型：<br/> - `url`：打开自定义的 URL；<br/> - `action`：打开应用的指定页面；<br/> - `activity`：打开应用包名或 Activity 组件路径。若不传该字段，默认打开应用的首页。<br/><Container type="notice" title="注意">环信 iOS 推送通道只支持设置为 `url`。</Container> | Android       | 否       |
| `config.badge`       | Object | 推送角标，包含以下三个字段：<br/> - `addNum`：整型，表示推送通知到达设备时，角标数字累加的值。<br/> - `setNum`：整型，表示推送通知到达设备时，角标数字显示的值。<br/> - `activity`：字符串类型，入口类（华为角标需要配置）。 | Android       | 否       |

## 各厂商推送配置

| 字段      | 类型   | 描述                           | 是否必需 |
| :-------- | :----- | :----------------------------- | :------- |
| `easemob` | Object | 环信推送                       | 否       |
| `apns`    | Object | Apple 推送通知服务（APNs）     | 否       |
| `fcm`     | Object | 谷歌 Firebase 云消息传递 (FCM) | 否       |
| `fcmV1`     | Object | 谷歌 Firebase 云消息传递 (FCM) V1 | 否       |
| `xiaomi`  | Object | 小米推送。                     | 否       |
| `vivo`    | Object | vivo 推送。                    | 否       |
| `oppo`    | Object | OPPO 推送。                    | 否       |
| `meizu`   | Object | 魅族推送特性。                 | 否       |
| `huawei`  | Object | 华为推送特性。                 | 否       |
| `honor`   | Object | 荣耀推送特性。                 | 否       |

### Easemob 推送说明

下面为包含大图片的通知的代码示例，你可以按实际需求配置：

```json
{
    "title": "通知栏显示的通知标题",
    "content": "通知栏展示的通知内容",
    "subTitle": "通知栏显示的通知副标题",
    "iconUrl": "https://docs-im.easemob.com/lib/tpl/bootstrap3_ori/images/logo.png",
    "needNotification": true,
    "badge": {
        "setNum": 0,
        "addNum": 1,
        "activity": "com.hyphenate.easeim.section.me.activity.AboutHxActivity"
    },
    "operation": {
        "type": "2",
        "openUrl": "https://www.baidu.com/",
        "openAction": "com.hyphenate.easeim.section.me.activity.OfflinePushSettingsActivity"
    },
    "channelId": "chat",
    "channelName": "消息",
    "channelLevel": 3,
    "autoCancel": 1,
    "expiresTime": 3600000,
    "sound": 0,
    "vibrate": 0,
    "style": 2,
    "bigTxt": "大文本内容",
    "bigPicture": "https://docs-im.easemob.com/lib/tpl/bootstrap3_ori/images/logo.png",
    "id": 056734579
}
```

推送字段说明如下表所示：

| 字段               | 类型    | 描述                                                         | 支持平台      |
| :----------------- | :------ | :----------------------------------------------------------- | :------------ |
| `title`            | String  | 通知栏展示的通知标题。                                       | iOS & Android |
| `content`          | String  | 通知栏展示的通知内容。                                       | iOS & Android |
| `subTitle`         | String  | 通知栏展示的通知副标题。                                     | iOS           |
| `iconUrl`          | String  | 推送图标的 URL。                                             | iOS & Android |
| `needNotification` | boolean | 是否弹出通知：<br/> - （默认）`true`：通知消息；<br/> - `false`：透传消息。 | iOS & Android |
| `badge`            | Object  | 推送角标。详见 [基本推送配置](#基本推送配置)中的角标说明。 | iOS & Android |
| `operation`        | Object  | 在通知栏中点击触发的动作。                                   | iOS & Android |
| `operation.type`   | Int     | 在通知栏中点击触发的动作类型。<br/> - （默认）`0`：启动应用。<br/> - `1`：打开自定义的 URL。需设置 `openUrl` 字段为自定义的 URL，若不设置，点击无效果。<br/> - `2`：打开应用的指定页面。需设置 `openAction` 为打开的应用页面的地址。若不设置，点击无效果。 <br/><Container type="notice" title="注意">环信 iOS 推送通道只支持启动应用和打开自定义 URL，因此只能设置为 `0` 和 `1`。</Container>| iOS & Android |
| `channelId`        | String  | 通知渠道 ID，默认为 `chat`。客户端渠道存在则通知。若客户端渠道不存在，则结合 channelName，channelLevel 创建新通道。 | Android       |
| `channelName`      | String  | 通知渠道名称，默认为 `消息`。只有第一次创建通道时使用。      | Android       |
| `channelLevel`     | Int     | 通知级别，只有第一次创建通道时使用。<br/> - `0`：最低；<br/> - `3`：默认；<br/> - `4`：高。 | Android       |
| `autoCancel`       | Int     | 点击通知后是否自动关闭通知栏。<br/> - `0`：否；<br/> - （默认）`1`：是。 | Android       |
| `expiresTime`      | Long    | 通知展示的过期时间，为 Unix 时间戳，单位为毫秒。             | iOS & Android |
| `sound`            | Int     | 声音提醒。<br/> - （默认）`0`：无声音； <br/> - `1`：声音提醒。           | iOS & Android |
| `vibrate`          | Int     | 振动提醒。<br/> - （默认）`0`：无振动；<br/> - `1`：振动提醒。             | iOS & Android |
| `style`            | Int     | 展示样式。<br/> -（默认）`0`：普通样式； <br/>- `1`：大文本样式； <br/>- `2`：大图片样式。 | iOS & Android |
| `bigTxt`           | String  | 大文本内容。该字段仅在 `style` 为 `1` 时需要设置。           | iOS & Android |
| `bigPicture`       | String  | 大图片 URL。该字段仅在 `style` 为 `2` 时需要设置。           | Android       |
| `id`               | Long    | 通知 ID。默认值为随机数。当 ID 相同时，新通知的内容会覆盖之前的通知。 | iOS & Android |

### APNs 推送说明

| 字段               | 类型   | 描述                                                         |
| :----------------- | :----- | :----------------------------------------------------------- |
| `invalidationTime` | Int    | 推送过期时间间隔，单位为毫秒。                               |
| `priority`         | Int    | 通知的优先级。<br/> - `5`：发送通知时会考虑设备电量；<br/> - `10`：立即发送通知。 |
| `pushType`         | String | 推送展示类型。在 iOS 13 或 watchOS 6 以上设备支持，只能为 “background” 或 “alert”，默认为 “alert”。 |
| `collapseId`       | String | 用于将多个通知合并为用户的单个通知的标识符。                 |
| `apnsId`           | String | 通知的唯一标识。                                             |
| `badge`            | Int    | 应用的图标上方显示的角标数字。                               |
| `sound`            | String | 设备收到通知时要播放的铃声：<br/> - 设置的铃声最多为 30 秒。若超过该时间，系统会启用默认铃声 `default`; <br/> - 铃声文件只支持 `aiff`、`wav` 和 `caf` 格式，例如 test.caf。<br/> - 铃声文件必须放在 app 的 /Library/Sounds 目录中。 |
| `mutableContent`   | Bool   | 是否向推送中增加 `mutable-content` 字段开启 APNs 通知扩展。<br/> - `true`：是；<br/> - `false`：否。 |
| `contentAvailable` | Bool   | 是否配置后台更新通知。开启后系统会在后台唤醒您的应用程序，并将通知传递。<br/> - `true`：是；<br/> - `false`：否。 |
| `categoryName`     | String | 通知的类型。                                                 |
| `threadId`         | String | 通知分组标识符，在应用中唯一。                               |
| `title`            | String | 通知的标题。                                                 |
| `subTitle`         | String | 通知的副标题。                                               |
| `content`          | String | 通知的正文内容。                                             |
| `titleLocKey`      | String | 用于将标题字符串进行本地化的键。                             |
| `titleLocArgs`     | List   | 字符串的数组，用于替换标题字符串中的变量。                   |
| `subTitleLocKey`   | String | 用于将副标题字符串进行本地化的键。                           |
| `subTitleLocArgs`  | List   | 字符串的数组，用于替换副标题字符串中的变量。                 |
| `bodyLocKey`       | String | 用于将消息文本进行本地化的键。                               |
| `bodyLocArgs`      | List   | 字符串的数组，用于替换消息文本中的变量。                     |
| `ext`              | Object | 自定义推送扩展信息。                                         |
| `launchImage`      | String | 要显示的启动图像文件的名称。                                 |

### FCM 推送说明

| 字段                    | 类型   | 描述                                                         |
| :---------------------- | :----- | :----------------------------------------------------------- |
| `condition`             | String | 用于确定消息目标的逻辑条件表达式。                           |
| `collapseKey`           | String | 指定一组可折叠的消息（例如，含有 collapse_key: “Updates Available”），以便当恢复传送时只发送最后一条消息。这是为了避免当设备恢复在线状态或变为活跃状态时重复发送过多相同的消息。 |
| `priority`              | String | 消息的优先级，即“normal”（普通）和“high”（高）。在 Apple 平台中，这些值对应于 APNs 优先级中的 5 和 10。 |
| `timeToLive`            | String | 设备离线后消息在 FCM 存储空间中保留的时长（以秒为单位）。支持的最长存留时间为 4 周，默认值为 4 周。 |
| `dryRun`                | Bool   | 是否为测试消息。<br/> - `true`：是。开发者可在不实际发送消息的情况下对请求进行测试。<br/> - `false`：否。 |
| `restrictedPackageName` | String | 应用的软件包名称，其注册令牌必须匹配才能接收消息。           |
| `data`                  | Object | 自定义推送扩展信息。                                         |
| `notification`          | Object | 用户可见的预定义通知载荷键值对，详见 [FCM 推送通知的字段](#fcm-推送通知的字段) |

#### FCM 推送通知的字段

| 字段               | 类型   | 描述                                                         |
| :----------------- | :----- | :----------------------------------------------------------- |
| `title`            | String | 通知栏中展示的通知的标题。                                   |
| `body`             | String | 通知栏中展示的通知的内容。                                   |
| `androidChannelId` | String | 通知的渠道 ID。<br/> - 应用必须使用此渠道 ID 创建一个渠道，才能收到包含此渠道 ID 的所有通知。<br/> - 如果你不在请求中发送该渠道 ID，或者应用尚未创建所提供的渠道 ID，则 FCM 将使用应用清单文件中指定的渠道 ID。 |
| `icon`             | String | 通知图标。                                                   |
| `sound`            | String | 设备收到通知时要播放的声音，例如 ring.mp3。声音文件必须放在 app 的 /res/raw/ 目录中。 |
| `tag`              | String | 用于替换抽屉式通知栏中现有通知的标识符。                     |
| `color`            | String | 通知的图标颜色。                                             |
| `clickAction`      | String | 与用户点击通知相关的操作。点击通知时，将会启动带有匹配 intent 过滤器的 Activity。 |
| `titleLocKey`      | String | 应用的字符串资源中标题字符串的键，用于将标题文字本地化为用户当前的本地化设置语言。 |
| `titleLocArgs`     | List   | 将用于替换 `title_loc_key`（用来将标题文字本地化为用户当前的本地化设置语言）中的格式说明符的变量字符串值。 |
| `bodyLocKey`       | String | 应用的字符串资源中正文字符串的键，用于将正文文字本地化为用户当前的本地化设置语言。 |
| `bodyLocArgs`      | List   | 将用于替换 `body_loc_key`（用来将正文文字本地化为用户当前的本地化设置语言）中的格式说明符的变量字符串值。 |

### FCM V1 推送说明

| 字段            | 类型   | 描述                                                         |
| :-------------- | :----- | :----------------------------------------------------------- |
| `type`          | Enum   | FCM 推送通知类型：`BOTH`、`DATA` 和 `NOTIFICATION`。<Container type="notice" title="注意">不同的推送通知类型对应不同的默认选项。</Container>详见[在 Android 应用中接收消息](https://firebase.google.cn/docs/cloud-messaging/android/receive)。 |
| `data`          | Object | 自定义推送扩展，为键值对格式，例如 `{"k1":"v1", "k2":"v2"}`。                     |
| `notification`  | Object | 自定义推送内容，详见 [FCM V1 推送通知的字段](#fcm-v1-推送通知的字段)。          |
| `androidConfig` | Object | Android 推送配置，详见 [Android 推送配置](#android-推送配置)。           |
| `webPushConfig` | Object | Web 推送配置，详见 [Web 推送配置](#web-推送配置)。  |
| `apnsConfig`    | Object | APNs 推送配置，详见 [APNs 推送配置](#apns-推送配置)。   |
| `options`       | Object | 自定义推送配置选项，为键值对格式，例如，{"k1":"v1", "k2":"v2"}。     |
| `condition`     | String | 发送推送消息的条件。|

#### FCM V1 推送通知的字段

| 字段    | 类型   | 描述                                          |
| :------ | :----- | :-------------------------------------------- |
| `title` | String | 推送标题。                                      |
| `body`  | String | 推送内容。                                      |
| `image` | String | 显示在通知中的图片的 URL。图片不能超过 1 MB。 |

#### Android 推送配置

| 字段                  | 类型   | 描述                                                         |
| :-------------------- | :----- | :----------------------------------------------------------- |
| `collapseKey`         | String | 消息折叠标识，以便在可以恢复传递时仅发送最后一条消息。在任何指定时间内最多允许使用 4 个不同的折叠键。 |
| `priority`            | String | 消息优先级：<br/> - `NORMAL`：普通。 <br/> - `HIGH`：高。|
| `ttl`                 | String | 离线保留时长，默认为 4 周。该参数值的单位为秒，最多可精确到小数点后九位，以 `s` 结尾，例如 `3.5s`。 |
| `androidNotification` | Object | 安卓推送通知。详见 [Android 推送通知的字段](#android-推送通知的字段)。 |
| `directBootOk`        | Bool   | 如果设置为 `true`，当设备处于直接启动模式时，消息将被允许传送到应用程序。详见[支持直接启动模式](https://developer.android.google.cn/training/articles/direct-boot?hl=zh-cn)。 |

#### Android 推送通知的字段

| 字段             | 类型   | 描述                                           |
| :------------- | :----- | :--------------------------------------------- |
| `title`        | String | 推送标题，覆盖 [FCM V1 推送通知的字段](#fcm-v1-推送通知的字段)中的 `title` 字段。              |
| `body`         | String | 推送内容，覆盖 [FCM V1 推送通知的字段](#fcm-v1-推送通知的字段)中的 `body` 字段。              |
| `icon`         | String | 通知的图标。默认为应用图标。                       |
| `color`        | String | 通知的图标颜色，以 #rrggbb 格式表示。            |
| `sound`        | String | 通知铃声，声音文件必须位于 /res/raw/。         |
| `tag`          | String | 替换标识，如果通知栏已存在相同标识的通知则替换 |
| `image`        | String | 显示的图像的 URL，覆盖 [FCM V1 推送通知的字段](#fcm-v1-推送通知的字段)中的 `image` 字段。    |
| `clickAction`  | String | 用户点击通知操作。                             |
| `bodyLocKey`   | String | 推送内容本地化键。                               |
| `bodyLocArgs`  | Array  | 推送内容本地化参数。                             |
| `titleLocKey`  | String | 推送标题本地化参数。                             |
| `titleLocArgs` | Array  | 推送标题本地化参数。                             |
| `channelId`    | String | 通道 ID。                                        |

#### Web 推送配置

| 字段           | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `headers`      | Object | web push 协议中定义的 HTTP 标头，例如，`{ "k1": "v1", "k2": "v2"}`。 |
| `notification` | Object | 推送内容, 详见 [FCM V1 推送通知的字段](#fcm-v1-推送通知的字段)。                 |

#### APNs 推送配置

| 字段      | 类型   | 描述                                                         |
| :-------- | :----- | :----------------------------------------------------------- |
| `headers` | Object | Apple 推送通知服务中定义的 HTTP 请求标头。详见 [APNs 请求标头](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/sending_notification_requests_to_apns)了解支持的标头，例如，`{ "apns-push-type": "alert", "apns-priority": "10"}`。 |
| `payload` | Object | 作为 JSON 对象的 APNs 负载，包括 `aps` 字典和自定义负载。详见[有效负载密钥参考](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification)。例如，`{"aps":{"alert":{"title":"环信推送提醒","subtitle":"环信","body":"欢迎使用环信即时推送服务"}},"EPush":"{}"}`。 |

### 小米推送说明

自定义通道和跳转。

```json
{
    "title":"你好，欢迎使用环信",
    "content":"你好",
    "channelId":"easemob-test",
    "notifyEffect":3,
    "webUri":"http://www.easemob.com"
}
```

推送字段说明：

| 字段                     | 类型   | 描述                                                         |
| :----------------------- | :----- | :----------------------------------------------------------- |
| `title`                  | String | 通知栏中展示的通知的标题。 该字段长度不能超过 50 字符（一个汉字等于一个字符）。 |
| `description`            | String | 通知栏中展示的通知的内容。该字段长度不能超过 128 字符（一个汉字等于一个字符）。 |
| `restrictedPackageNames` | String | 应用包名。                                                   |
| `passThrough`            | Int    | 是否弹出通知：<br/> - `0`：通知；<br/> - `1`：透传消息。               |
| `payload`                | Object | 通知的内容。                                                 |
| `notifyType`             | Int    | 通知方式。<br/> - `-1`：默认全部；<br/> - `1`：使用默认提示音提示；<br/> - `2`：使用默认振动提示；<br/> - `4`：使用默认 led 灯光提示。 |
| `timeToLive`             | Long   | 离线保留时长（单位为毫秒）。                                 |
| `timeToSend`             | Long   | 定时发送消息。用自 1970 年 1 月 1 日以来 00:00:00.0 UTC 时间表示。 |
| `notifyId`               | Int    | 相同 notify_id 的通知栏消息会覆盖之前。                      |
| `sound`                  | String | 铃声，例：`"android.resource://" + PACKAGENAME + "/raw/shaking"` |
| `ticker`                 | String | 开启通知消息在状态栏滚动显示。                               |
| `notifyForeground`       | String | 开启或关闭 app 在前台时的通知弹出。<br/> - `0`：开启； <br/> - `1`：关闭。 |
| `notifyEffect`           | String | 预定义通知栏消息的点击行为。通过设置 `extra.notify_effect` 的值以得到不同的预定义点击行为。<br/> - `1`：通知栏点击后打开 app 的 Launcher Activity; <br/> - `2`：通知栏点击后打开 app 的任一 Activity（intentUri）；<br/> - `3`：通知栏点击后打开网页（webUri）。 |
| `intentUri`              | String | 当前 app 的组件。当 `notifyEffect` 为 2 时，该参数值的格式为 “intent:#Intent;action=xxxx;end”。 |
| `webUri`                 | String | 网页。                                                       |
| `flowControl`            | Int    | 控制是否需要进行平缓发送。                                   |
| `jobkey`                 | String | 消息聚合，相同 jobkey 的消息只展示第一条。                   |
| `callbackUrl`            | String | 回调地址。                                                   |
| `callbackParam`          | String | 回调参数。                                                   |
| `callbackType`           | Int    | 回调类型：<br/> - `1`：送达；<br/> - `2`：点击；<br/> - `3`：送达或点击；<br/> - `16`：设备无效；<br/> - `32`：禁用 PUSH；<br/> - `64`：不符合过滤条件；<br/> - `128`：推送超限；<br/> - `1024`：TTL 过期。 |
| `locale`                 | String | 可以接收消息的设备的语言范围，用逗号分隔。                   |
| `localeNotIn`            | String | 不可以接收消息的设备的语言范围，用逗号分隔。                 |
| `model`                  | String | 可以收到消息的设备的机型/品牌/价格范围。                     |
| `modelNotIn`             | String | 不可以收到消息的设备的机型/品牌/价格范围。                   |
| `appVersion`             | String | 可以接收消息的 app 版本号。                                  |
| `appVersionNotIn`        | String | 不可以接收消息的 app 版本号。                                |
| `connpt`                 | String | 特定的网络环境下才能接收到消息。目前仅支持指定 ”wifi”。      |
| `onlySendOnce`           | String | 值为 `1`时表示消息仅在设备在线时发送一次，不缓存离线消息进行多次下发。 |
| `channelId`              | String | [通知类别的 ID。](https://dev.mi.com/console/doc/detail?pId=1163#_11) |

### vivo 推送说明

系统消息，回执和打开网页。

```json
{
    "classification": 1,
    "extra": {
      "callback": "http://www.easemob.com/callback",
      "callbackParam": "test push callback"
    },
    "skipContent": "http://www.easemob.com",
    "skipType": 2
  }
```

推送字段说明：

| 字段              | 类型   | 描述                                                         |
| :---------------- | :----- | :----------------------------------------------------------- |
| `title`           | String | 通知栏中展示的通知的标题。该字段长度不能超过 40 字符（一个汉字等于两个字符）。 |
| `content`         | String | 通知栏中展示的通知的内容。 该字段长度不能超过 100 字符（一个汉字等于两个字符）。 |
| `notifyType`      | Int    | 通知类型。<br/> - `1`：无； <br/> - `2`：响铃；<br/> - `3`：振动； <br/>- `4`：响铃和振动。 |
| `timeToLive`      | Int    | 消息保留时长（单位：秒）。                                   |
| `skipType`        | Int    | 点击跳转类型。<br/> - `1`：打开APP首页；<br/> - `2`：打开链接；<br/> - `3`：自定义；<br/> - `4`：打开 app 内指定页面。 |
| `skipContent`     | String | 跳转内容。跳转类型为 2 时，跳转内容最大 1000 个字符。跳转类型为 4 时，跳转内容的格式为 “intent:#Intent;component=应用包名/activity类路径;end”。 |
| `networkType`     | Int    | 网络方式。<br/> - （默认）`-1`：不限；<br/> - `1`：Wi-Fi 下发送。      |
| `classification`  | Int    | 消息类型。 <br/> - `0`：运营类消息；<br/> - `1`：系统类消息。 在环信控制台的 vivo 推送的**添加推送证书**对话框中也可以配置该消息类型，但这里的优先级高于控制台的配置。 |
| `clientCustomMap` | Object | 客户端自定义键值对。                                         |
| `requestId`       | String | 用户请求唯一标识，长度限制为 64 字符。                       |
| `pushMode`        | Int    | 推送模式。<br/> - （默认）`0`：正式推送；<br/> - `1`：测试推送。       |
| `extra`           | Object | [推送回调](#vivo-推送回调)。 |
| `category`        | String | 二级分类，字段的值详见[二级分类标准 中category说明](https://dev.vivo.com.cn/documentCenter/doc/359)。 1. 填写`category` 后，可以不设置 `classification` 参数，但若设置 `classification`，需保证 `category` 与 `classification` 是正确对应关系，否则推送失败。 2. 该参数请按照消息分类规则填写，且必须大写；若传入无效的值，则推送失败。 |
| `notifyId`        | Int    | 通知 ID，即通知的唯一标识。若多个消息的通知 ID 相同，到达设备的新消息会覆盖旧消息显示在设备通知栏中。取值范围为：1-2147483647。 |
| `profileId` | String| 关联终端设备登录用户标识，最大长度为 64 字符。|
| `sendOnline` | Bool| 是否在线直推，设置为 `true` 表示是在线直推，`false` 表示非直推。在线直推功能推送时在设备在线下发一次，设备离线直接丢弃。|

#### vivo 推送回调

| 字段            | 类型   | 描述                             |
| :-------------- | :----- | :------------------------------- |
| `callback`      | String | 回调 URL， 长度限制为 128 字符。 |
| `callbackParam` | String | 回调参数，长度限制为 64 字符。   |

### OPPO 推送说明

标题和跳转：

```json
{
    "title":"你好，欢迎使用环信推送",
    "subTitle":"你好",
    "content":"你好先生",
    "channelId":"easemob-channel",
    "clickActionType":2,
    "clickActionUrl":"http://www.easemob.com"
}
```

推送字段说明：

| 字段                  | 类型   | 描述                                                         |
| :-------------------- | :----- | :----------------------------------------------------------- |
| `title`               | String | 通知栏中展示的通知的标题。该字段长度不能超过 32 字符（一个汉字等于一个字符）。 |
| `subTitle`            | String | 通知栏中展示的通知的副标题。                                 |
| `content`             | String | 推送显示内容。 该字段长度不能超过 200 字符（一个汉字等于一个字符）。 |
| `channelId`           | String | 通道 ID。                                                    |
| `appMessageId`        | String | 同一 message id 只推一次。                                   |
| `style`               | Int    | 通知栏样式。<br/> - `1`：标准；<br/> - `2`：长文本；<br/> - `3`：大图。     |
| `clickActionType`     | Int    | 点击动作类型。<br/> - `0`：启动应用；<br/> - `1`：打开应用内页（activity的intent action）；<br/> - `2`：打开网页；<br/> - `4`：打开应用内页（activity）；<br/> - `5`：Intent scheme URL。 |
| `clickActionActivity` | String | 应用内页地址【`click_action_type` 为 `1` 或 `4` 时必填，长度限制为 500 字符】 |
| `clickActionUrl`      | String | 网页地址【`click_action_type` 为 `2` 与 `5` 时必填，长度限制为 500 字符】 |
| `actionParameters`    | Object | 动作参数，打开应用内页或网页时传递给应用或网页。             |
| `offLine`             | Bool   | 是否进离线消息。<br/> - `true`：是；<br/> - `false`：否。              |
| `offLineTtl`          | Int    | 离线消息保存时长 (单位为秒) 。                               |
| `timeZone`            | String | 时区（GMT+08:00）。                                          |
| `callBackUrl`         | String | 回调地址。                                                   |
| `callBackParameter`   | String | 回调参数。                                                   |
| `showTtl`             | Int    | 限时展示(秒) 。                                              |
| `notifyId`            | Int    | 通知显示时的唯一标识，实现新的消息覆盖上一条消息功能。       |

### 魅族推送说明

| 字段                  | 类型   | 描述                                                         |
| :-------------------- | :----- | :----------------------------------------------------------- |
| `title`               | String | 通知栏中展示的通知的标题。该字段长度不能超过 32 字符（一个汉字等于一个字符）。 |
| `content`             | String | 通知栏中展示的通知的内容。该字段长度不能超过 100 字符（一个汉字等于一个字符）。 |
| `noticeExpandType`    | Int    | 展开方式。<br/> - `0`：禁用； <br/> - `1`：文本。                       |
| `noticeExpandContent` | String | 展开内容。`noticeExpandType` 为 `1` 时，即为文本时，必填。   |
| `clickType`           | Int    | 点击动作。<br/> - `0`：打开应用；<br/> - `1`：打开应用页面；<br/> - `2`：打开 H5 地址； <br/> - `3`：应用客户端自定义。 |
| `url`                 | String | H5 页面地址。                                                |
| `parameters`          | Object | 参数。                                                       |
| `activity`            | String | 应用页面地址。                                               |
| `customAttribute`     | String | 应用客户端自定义内容。                                       |
| `isOffLine`           | Bool   | 是否进离线消息。<br/> - `true`：是； <br/> - `false`：否。              |
| `validTime`           | Int    | 有效时长（小时）。                                           |
| `isSuspend`           | Bool   | 是否通知栏悬浮窗显示。<br/> - `true`：是；<br/> - `false`：否。        |
| `isClearNoticeBar`    | Bool   | 是否可清除通知栏。<br/> - `true`：是；<br/> - `false`：否。            |
| `isFixDisplay`        | Bool   | 是否定时展示。<br/> - `true`：是；<br/> - `false`：否。                |
| `fixStartDisplayDate` | date   | 定时展示开始时间。                                           |
| `fixEndDisplayDate`   | date   | 定时展示结束时间。                                           |
| `vibrate`             | Bool   | 通知方式：是否振动。<br/> - `true`：是；<br/> - `false`：否。          |
| `lights`              | Bool   | 通知方式：是否闪光。 <br/> - `true`：是；<br/> - `false`：否。          |
| `sound`               | Bool   | 通知方式：是否有声音。<br/> - `true`：是；<br/> - `false`：否。        |
| `notifyKey`           | String | 分组合并推送的 key，凡是带有此 key 的通知栏消息只会显示最后到达的一条。 |
| `callback`            | String | 回调 URL， 长度限制 128 字符。                               |
| `callbackParam`       | String | 回调参数，长度限制 64 字符。                                 |
| `callbackType`        | String | int(可选字段)，回执类型。<br/> - `1`：送达回执；<br/> - `2`：点击回执； <br/> - （默认）`3`：送达与点击回执。 |

### 华为推送说明

华为自定义铃声样例：

```json
{
    "message":{
        "android":{
            "notification":{
                "title":"wx1994发来新消息3",
                "body":"联系人发来新消息",
                "channelId":"hyphenate_offline_push_notification",
                "defaultSound":false,
                "sound":"/raw/ring",
                "importance":"NORMAL"
            }
        }
    }
}
```

| 字段           | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `validateOnly` | Bool   | 是否为测试消息，实际不会下发。<br/> - `true`：是；<br/> - `false`：否。 |
| `message`      | Object | 推送消息内容。                                               |
| `review`       | Object | 第三方审核机构审核结果，具体请参考华为官网[Review](https://developer.huawei.com/consumer/cn/doc/development/HMS-References/push-sendapi#Review)的定义。 |

#### 推送消息结构体

| 字段           | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `data`         | Object | 自定义消息负载。                                             |
| `notification` | Object | [通知栏消息内容](#通知栏消息内容)。 |
| `android`      | Object | [安卓消息推送控制参数](#安卓消息推送控制参数)。 |

##### 通知栏消息内容

| 字段    | 类型   | 描述                                   |
| :------ | :----- | :------------------------------------- |
| `title` | String | 通知栏消息的标题。                     |
| `body`  | String | 通知栏消息的内容。                     |
| `image` | String | 用户自定义的通知栏消息右侧大图标 URL。 |

##### 安卓消息推送控制参数

| 字段                | 类型   | 描述                                                         |
| :------------------ | :----- | :----------------------------------------------------------- |
| `collapseKey`       | Int    | 离线消息缓存分组标识。                                       |
| `urgency`           | String | 透传消息投递优先级。                                         |
| `category`          | String | 用于重要优先级的透传消息发送场景标识。                       |
| `ttl`               | String | 消息缓存时间（单位为秒）。                                   |
| `biTag`             | String | 批量任务消息标识。                                           |
| `fastAppTargetType` | Int    | 快应用发送透传消息时，指定小程序的模式类型。<br/> - `1`：开发态；<br/> - （默认）`2`：生产态。 |
| `data`              | String | 自定义消息负载，此处如果设置了 data，则会覆盖 `message.data` 字段。 |
| `notification`      | Object | [安卓通知栏消息结构体](#安卓通知栏消息结构体)。 |
| `receiptId` | String| 输入一个唯一的回执 ID 指定本次下行消息的回执地址及配置，该回执 ID 可以在回执参数配置中查看。| 
| `targetUserType` | Int | <br/> - `0`：普通消息（默认值）；<br/> - `1`：测试消息。每个应用每日可发送该测试消息 500 条且不受每日单设备推送数量上限要求。|

##### 安卓通知栏消息结构体

| 字段                | 类型   | 描述                                                         |
| :------------------ | :----- | :----------------------------------------------------------- |
| `title`             | String | 安卓通知栏消息标题。                                         |
| `body`              | String | 安卓通知栏消息内容。                                         |
| `icon`              | String | 自定义通知栏左侧小图标，本地的 /res/raw/，支持的文件格式目前包括 png、jpg。 |
| `color`             | String | 自定义通知栏按钮颜色。                                       |
| `sound`             | String | 自定义消息通知铃声，在新创建渠道时有效，此处设置的铃声文件必须存放在应用的/res/raw路径下，例如设置为“/raw/shake”，对应应用本地的/res/raw/shake.xxx文件，支持的文件格式包括mp3、wav、mpeg等，如果不设置使用默认系统铃声。注意：由于铃声是通知渠道的属性，因此铃声仅在渠道创建时有效，渠道创建后，即使设置自定义铃声也不会播放，而使用创建渠道时设置的铃声。 |
| `defaultSound`      | Bool   | 默认铃声控制开关。<br/> - `true`：打开；<br/> - `false`：关闭。        |
| `tag`               | String | 消息标签，同一应用下使用同一个消息标签的消息会相互覆盖，只展示最新的一条。 |
| `clickAction`       | Object | [消息点击行为](#自定义消息点击行为)。 |
| `bodyLocKey`        | String | 通知显示本地化。                                             |
| `bodyLocArgs`       | List   |                                                              |
| `titleLocKey`       | String | 标题本地化 key。                                             |
| `titleLocArgs`      | List   |                                                              |
| `multiLangKey`      | List   | 消息国际化多语言参数。                                       |
| `channelId`         | String | 通道 ID。                                                    |
| `notifySummary`     | String | 安卓通知栏消息简要描述。                                     |
| `image`             | String | 自定义的安卓通知栏消息右侧大图标 URL。                       |
| `style`             | Int    | 通知栏样式：<br/> - `0`：默认样式；<br/> - `1`：大文本样式；<br/> - `3`：Inbox样式。 |
| `bigTitle`          | String | 安卓通知栏消息大文本标题。                                   |
| `bigBody`           | String | 安卓通知栏消息大文本内容。                                   |
| `autoClear`         | Int    | 消息展示时长，超过后自动清除，单位为毫秒。                   |
| `notifyId`          | Int    | 每条消息在通知显示时的唯一标识。实现新的通知栏消息覆盖老的。 |
| `group`             | String | 消息分组，将同一组的消息只显示 1 条。                        |
| `badge`             | Object | [安卓通知消息角标控制](#自定义角标)。 |
| `autoCancel`        | Bool   | 安卓通知栏消息保持标识，在点击通知栏消息后，消息是否不显示在通知栏。<br/> - `true`：是；<br/> - `false`：否。 |
| `when`              | String | 消息的排序时间，安卓通知栏消息根据这个值将消息排序，同时这个时间在通知栏上显示。样例：2014-10-02T15:01:23.045123456Z |
| `importance`        | String | Android通知消息分类，决定用户设备消息通知行为，取值如下：<br/> - `LOW`：资讯营销类消息；<br/> - `NORMAL`：服务与通讯类消息。 |
| `useDefaultVibrate` | Bool   | 是否使用系统默认振动模式控制开关。<br/> - `true`：是；<br/> - `false`：否。 |
| `useDefaultLight`   | Bool   | 是否使用默认呼吸灯模式控制开关。<br/> - `true`：是；<br/> - `false`：否。 |
| `vibrateConfig`     | String | 安卓自定义通知消息振动模式，每个数组元素按照 “[0-9]+｜[0-9]+[sS]｜[0-9]+[.][0-9]{1,9}｜[0-9]+[.][0-9]{1,9}[sS]“ 格式，取值样例 [“3.5S”,”2S”,“1S”,“1.5S”]，数组元素最多支持 10 个，每个元素数值整数大于 0 小于等于 60。 |
| `visibility`        | String | 安卓通知栏消息可见性，取值如下：`VISIBILITY_UNSPECIFIEDPRIVATEPUBLICSECRET`。取值说明请参考[锁屏不展示通知内容](https://developer.huawei.com/consumer/cn/doc/development/HMS-Guides/push-other#h1-1576835261364)。 |
| `lightSettings`     | Object | [自定义呼吸灯模式](#自定义呼吸灯模式)。 |
| `foregroundShow`    | Bool   | 设备应用在前台时通知栏消息是否前台展示开关。<br/> - `true`：是；<br/> - `false`：否。 |
| `inboxContent`      | List   | 当 style 为 `3` 时，Inbox 样式的内容（必选），支持最大 5 条内容，每条最大长度 1024 字符。展示效果请参考[Inbox 样式](https://developer.huawei.com/consumer/cn/doc/development/HMS-Guides/push-other#inbox_style)章节。 |
| `buttons`           | List   | [通知栏消息动作按钮](#通知栏消息动作按钮)，最多设置 3 个。 |

##### 通知栏消息动作按钮

| 字段         | 类型   | 描述                                                         |
| :----------- | :----- | :----------------------------------------------------------- |
| `name`       | String | 按钮名称，必填，最大长度 40 字符。                           |
| `actionType` | Int    | 按钮动作类型。<br/> - `0`：打开应用首页；<br/> - `1`：打开应用自定义页面； <br/> - `2`：打开指定的网页；<br/> - `3`：清除通知； - `4`：分享功能。 |
| `intentType` | Int    | 打开自定义页面的方式：<br/> - `0`：设置通过**intent**打开应用自定义页面；<br/> - `1`：设置通过**action** 打开应用自定义页面；当 `action_type` 为 `1` 时，该字段必填。 |
| `intent`     | String | 当 `action_type` 为 `1`，此字段按照 `intent_type` 字段设置应用页面的 uri 或者 action. |
| `data`       | String | 最大长度 1024 字符。<br/> - 当字段 `action_type` 为 `0` 或 `1` 时，该字段用于在点击按钮后给应用透传数据，选填，格式必须为 key-value 形式：{“key1”:“value1”,“key2”:“value2”,…}。<br/> - 当 `action_type` 为 `4` 时，此字段必选，为分享的内容。 |

##### 自定义角标

| 字段         | 类型   | 描述                                                         |
| :----------- | :----- | :----------------------------------------------------------- |
| `addNum`     | Int    | 角标累加数字，大于 0 小于 100 的正整数。                     |
| `badgeClass` | String | 应用包名+应用入口 Activity 类名。样例：`com.huawei.codelabpush.MainActivity`。 |
| `setNum`     | Int    | 角标设置数字，大于等于 0 小于 100 的整数。                   |

##### 自定义消息点击行为

| 字段     | 类型   | 描述                                                         |
| :------- | :----- | :----------------------------------------------------------- |
| `type`   | Int    | 消息点击行为类型。<br/> - `1`：用户自定义点击行为； <br/> - `2`：点击后打开特定 url；<br/> - `3`：点击后打开应用 App。 |
| `intent` | String | 自定义页面中 intent 的实现，当 `type` 为 `1` 时，字段 `intent` 和 `action` 至少二选一。 |
| `url`    | String | 设置打开特定 URL，URL 使用的协议必须是 HTTPS 协议。          |
| `action` | String | 设置通过 action 打开应用自定义页面。                         |

##### 自定义呼吸灯模式

| 字段               | 类型   | 描述                                                         |
| :----------------- | :----- | :----------------------------------------------------------- |
| `color`            | Object | [呼吸灯颜色](#呼吸灯颜色)。 |
| `lightOnDuration`  | String | 呼吸灯点亮时间间隔，格式按照 “｜[sS]｜.｜.[sS]”。            |
| `lightOffDuration` | String | 呼吸灯熄灭时间间隔，格式按照 “｜[sS]｜.｜.[sS]”。            |

##### 呼吸灯颜色

| 字段    | 类型  | 描述                                                    |
| :------ | :---- | :------------------------------------------------------ |
| `alpha` | Float | RGB 颜色中的 alpha 设置，默认值为 `1`，取值范围 [0,1]。 |
| `red`   | Float | RGB 颜色中的 red 设置，默认值为 `0`，取值范围 [0,1]。   |
| `green` | Float | RGB 颜色中的 green 设置，默认值为 `0`，取值范围 [0,1]。 |
| `blue`  | Float | RGB 颜色中的 blue 设置，默认值为 `0`，取值范围 [0,1]。  |

### 荣耀推送说明

```json
{
    "data":{
        "key1":"value1"
    },
    "androidConfig":{
        "androidNotification":{
            "title":"honor",
            "body":"body",
            "clickAction":{
                "type":2,
                "url":"https://wwww.easemob.com"
            },
            "badgeNotification":{
                "setNum":1,
                "badgeClass":"com.hyphenate.chatdemo.section.login.activity.SplashActivity"
            }
        }
    }
}
```

#### 推送通知结构体

| 字段            | 类型   | 描述                                                         |
| :-------------- | :----- | :----------------------------------------------------------- |
| `data`          | Object | 自定义消息负载，为 key-value 格式。                          |
| `androidConfig` | Object | [Android消息推送控制参数](#android-消息推送控制参数)。 |

#### Android消息推送控制参数

| 字段                  | 类型   | 描述                                                         |
| :-------------------- | :----- | :----------------------------------------------------------- |
| `ttl`                 | String | 消息缓存时间，单位为秒。                                     |
| `biTag`               | String | 批量任务消息标识，消息回执时会返回给应用服务器。             |
| `data`                | String | 自定义消息负载。若设置了该字段，则会覆盖[上层的 data 字段](#推送通知结构体)。 |
| `androidNotification` | Object | [Android 通知栏消息结构体](#android-通知栏消息结构体)。 |

#### Android通知栏消息结构体

| 参数                | 类型   | 描述                                                         |
| :------------------ | :----- | :----------------------------------------------------------- |
| `title`             | String | 安卓通知栏消息标题。                                         |
| `body`              | String | 安卓通知栏消息内容。                                         |
| `clickAction`       | Object | [消息点击动作](#通知栏消息单击动作)。 |
| `image`             | String | 自定义通知栏消息右侧大图标 URL。                             |
| `style`             | Int    | 通知栏样式：<br/> - `0`：默认样式；<br/> - `1`：大文本样式。           |
| `bigTitle`          | String | 大文本标题，当 `style` 为 `1` 时必选。                       |
| `bigBody`           | String | 大文本内容，当 `style` 为 `1` 时必选。                       |
| `importance`        | String | Android 通知消息分类，对不同类别消息的默认展示方式、消息样式进行差异化管理： <br/> - `LOW`：资讯营销类消息，包括内容资讯消息和活动营销消息。<br/> - `NORMAL`：服务与通讯类消息，包括社交通讯消息和服务提醒消息。 |
| `when`              | String | 通知栏消息的到达时间，为 UTC 时间戳，，例如 2014-10-02T15:01:23.045123456Z。 |
| `buttons`           | List   | [通知栏消息动作按钮](#通知栏消息行为按钮)，最多可设置 3 个。例如，“buttons”:[{“name”:“打开应用”,“actionType”:“1”}]。 |
| `badgeNotification` | Object | [角标控制](#角标控制)。 |
| `notifyId`          | Int    | 每条消息在通知显示时的唯一标识。新的消息的标识会覆盖上一条消息的标识。 |

#### 通知栏消息单击动作

| 参数     | 是否必选 | 参数类型 | 描述                                                         |
| :------- | :------- | :------- | :----------------------------------------------------------- |
| `type`   | 是       | Int      | 消息点击行为类型：<br/> - `1`：打开应用自定义页面。<br/> - `2`：点击后打开特定 URL。<br/> - （默认）`3`：点击后打开应用首页。 |
| `intent` | 否       | String   | 通过 `intent` 打开应用自定义页面。若 `type` 为 `1`，`intent` 和 `action` 参数至少二选一。 |
| `url`    | 否       | String   | 设置打开特定 URL，URL 使用的协议必须是 HTTPS 协议。          |
| `action` | 否       | String   | 通过 `action` 打开应用自定义页面。                           |

#### 通知栏消息行为按钮

| 参数         | 是否必选 | 参数类型 | 描述                                                         |
| :----------- | :------- | :------- | :----------------------------------------------------------- |
| `name`       | 是       | String   | 按钮名称，最大长度为 40 个字符。                             |
| `actionType` | 是       | Int      | 按钮动作类型：<br/> - `0`：打开应用首页；<br/> - `1`：打开应用自定义页面；<br/> - `2`：打开指定的页面。 |
| `intentType` | 否       | Int      | 打开自定义页面的方式： <br/> - `0`：设置通过 `intent` 打开应用自定义页面；<br/> - `1`：设置通过 `action` 打开应用自定义页面。 当 `actionType` 为 `1` 时，该字段必填。 |
| `intent`     | 否       | String   | <br/> - 若 `actionType` 为 `1`，按照 `intentType` 字段设置应用页面的 URL 或 `action`。具体设置方式参见打开应用自定义页面。<br/> - 若 `actionType` 为 `2`，此字段设置打开指定网页的 URL，URL 使用的协议必须是 HTTPS 协议，例如，https://example.com/image.png。 |
| `data`       | 否       | String   | 最大长度为 1024 个字符。 若 `actionType` 为 `0` 或 `1`，该参数用于在点击按钮后给应用透传数据，格式必须为 key-value 形式，例如 {“key1”:“value1”,“key2”:“value2”,…}。 |

#### 角标控制

| 参数         | 是否必选 | 参数类型 | 描述                                                         |
| :----------- | :------- | :------- | :----------------------------------------------------------- |
| `addNum`     | 否       | Int      | 应用角标累加数字非应用角标实际显示数字，为大于 `0` 小于 `100` 的整数。 |
| `badgeClass` | 是       | String   | 应用入口 Activity 类全路径。 例如，com.example.test.MainActivity。 |
| `setNum`     | 否       | Int      | 角标设置数字，大于等于 `0` 小于 `100` 的整数。如果 `setNum` 与 `addNum` 同时存在时，以 `setNum` 为准。 |