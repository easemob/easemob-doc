# 离线推送

环信即时通讯 IM 支持集成第三方离线消息推送服务。客户端断开连接或应用进程被关闭等原因导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备推送消息通知。当用户再次上线时，服务器会将离线期间的消息发送给用户。例如，当你离线时，有用户向你发送了消息，你的手机的通知中心会弹出消息通知，当你再次打开 app 并登录成功，即时通讯 IM SDK 会主动拉取你不在线时的消息。

:::tip
以下两种情况，即时通讯 IM 不会发送离线推送通知：
1. 若应用在后台运行，则用户仍为在线状态，即时通讯 IM 不会向用户推送消息通知。
2. 应用在后台运行或手机锁屏等情况，若客户端未断开与服务器的连接，则即时通讯 IM 不会收到离线推送通知。
:::

## 各端支持的推送服务或推送插件

| 平台                | 支持的推送服务            | 参考文档   |
| -------------- | ---------------- | ------ |
|  Android            | - Google FCM <br/> - 华为  <br/> - 荣耀 <br/> - OPPO  <br/> - VIVO  <br/> - 小米  <br/> - 魅族  | 各推送服务的集成以及推送设置，详见 [Android 推送文档](/document/android/push/push_overview.html)。                                    |
|  iOS            | APNs         | APNs 推送服务的集成以及推送设置，详见 [APNs 推送文档](/document/ios/push/push_overview.html)。                                  |
|  uni-app            | uni-app SDK 支持推送插件 `EMPushUniPlugin`。         | 推送插件相关描述，详见 [uni-app 推送插件](/document/applet/push/uniapp_push.html)                               |
|  React Native            | React Native SDK 支持离线推送配置。| 详见 [React Native 离线推送文档](/document/react-native/push/push_overview.html)。  |

:::tip
环信 IM Web SDK 本身不支持离线推送，只支持对移动端离线推送进行配置。具体设置，详见 [Web 离线推送文档](/document/web/push/push_overview.html)。
:::

## 推送 token

推送 token（device token） 是第三方推送厂商提供的推送 token。例如，对于 FCM 推送，初次启动你的应用时，FCM SDK 为客户端应用实例生成的注册令牌 (registration token)。该 token 用于标识每台设备上的每个应用，FCM 通过该 token 明确消息是发送给哪个设备的，然后将消息转发给设备，设备再通知应用程序。你可以调用 `FirebaseMessaging.getInstance().getToken()` 方法获得 token。

打开应用，初始化环信 IM SDK 成功且成功登录后，获取推送 token，将 token 上传至环信服务器，与 IM 的登录账号绑定。

如果退出即时通讯 IM 登录时不解绑 device token。例如，对于 Android 平台，调用 `logout` 方法时对 `unbindToken` 参数传 `false` 时不解绑 `device token`，传 `true` 表示解绑 token），用户在推送证书有效期和 token 有效期内仍会接收到离线推送通知。

## 上传推送证书

在第三方推送服务控制台创建应用后，下载推送证书并获取证书相关信息，将推送证书上传至环信控制台，并配置证书相关信息。

例如，对于 FCM 推送证书相关配置，详见 [FCM 推送集成文档](/document/android/push/push_fcm.html#步骤三-上传推送证书)。 

## 多设备离线推送策略

多设备登录时，可在环信控制台的证书管理页面配置推送策略，该策略配置对所有推送通道生效：

- 所有设备离线时，才发送推送消息；
- 任一设备离线时，都发送推送消息。

**多端登录时若有设备被踢下线，即使接入了 IM 离线推送，也收不到离线推送消息。**

## 推送通知方式

推送通知方式包括以下三种：
- 接收所有离线消息的推送通知。
- 仅接收提及某些用户的消息的推送通知。该参数推荐在群聊中使用。若提及一个或多个用户，需在创建消息时对 ext 字段传 "em_at_list":["user1", "user2" ...]；若提及所有人，对该字段传 "em_at_list":"all"。
- 不接收离线消息的推送通知。

推送通知方式在 App 或单聊/群聊会话层级生效，会话级别的设置优先于 app 级别的设置，未设置推送通知方式的会话默认采用 app 的设置。

关于推送通知方式的设置，详见相应文档，例如，对于 Android，可参见[推送通知方式文档](/document/android/push/push_notification_mode_dnd.html#推送通知方式)。

## 免打扰模式

免打扰的设置包括免打扰时间段和免打扰时长。环信 IM 在这两个时间段内不发送离线推送通知，因此，你可以通过设置免打扰模式关闭推送。若在免打扰时段或时长生效期间需要对指定用户推送消息，需设置[强制推送](/document/android/push/push_extension.html#强制推送)。

免打扰时间段仅在 app 级别生效，而免打扰时长对 app、单聊和群聊会话均生效。如果你既设置了免打扰时间段，又设置了免打扰时长，免打扰模式的生效时间为这两个时间段的累加。

关于免打扰时间段和免打扰时长的设置，详见相应文档，例如，对于 Android，可参见[免打扰模式文档](/document/android/push/push_notification_mode_dnd.html#免打扰模式)。

免打扰模式与推送通知方式之间的关系

对于 app 和 app 中的所有会话，免打扰模式的设置优先于推送通知方式的设置。对于二者关系的具体描述，详见相应文档，例如，对于 Android，可参见[推送通知方式与免打扰模式之间的关系文档](/document/android/push/push_notification_mode_dnd.html#免打扰模式)。

## 使用推送模板

设置推送模板为推送的高级功能，使用前需要在[环信控制台](https://console.easemob.com/user/login)的 **功能配置** > **基础功能** > **消息** > **设置离线推送模板** 中激活推送高级功能。

推送模板主要用于服务器提供的默认配置不满足你的需求时，可使你设置全局范围的推送标题和推送内容。例如，服务器提供的默认设置为中文和英文的推送标题和内容，你若需要使用韩语或日语的推送标题和内容，则可以设置对应语言的推送模板。推送模板包括默认推送模板 `default` 和自定义推送模板。对于群组消息，你可以使用定向模板向某些用户推送与其他用户不同的离线通知。

你可以通过以下两种方式设置：

- [调用 REST API 配置](/document/server-side/push_template_overview.html)。
- 在[环信控制台](https://console.easemob.com/user/login)设置推送模板，详见[设置推送模板的文档](/document/android/push/push_template.html)。

使用推送模板有以下优势：

1. 自定义修改环信服务端默认的推送内容。   
2. 接收方可以决定使用哪个模板。 
3. 按优先级选择模板使用方式： 
   - 使用自定义推送模板的优先级高于默认推送模板。
   - 若发送方发消息时设置了推送模板，接收方即使设置了推送模板，收到推送通知后也按照发送方设置的推送模板显示。

关于推送模板的详情，可以参见各端的 [如何使用推送模板](/document/android/push/push_template.html)的文档。

## 开启第三方离线推送服务

在环信即时通讯 IM SDK 初始化时开启相应的离线推送服务，例如 对于 FCM 推送，详见 [FCM 推送集成文档](/document/android/push/push_fcm.html#步骤四-fcm-推送集成)。

## 设置推送通知的显示内容

对于推送通知的标题和内容，你可以通过多种方式设置，包括调用 API、使用推送模板以及发送消息时使用消息扩展字段。

关于这些设置方式的使用和设置优先级，详见具体文档，例如，对于 Android，可参见[设置通知的显示内容](/document/android/push/push_display_attribute.html#设置推送通知的显示属性)。

## 推送翻译

推送通知与[翻译功能](/value-added/translation/message_translation_android.html)协同工作。如果用户启用自动翻译功能并发送消息，SDK 会同时发送原始消息和翻译后的消息。

作为接收方，你可以设置你在离线时希望接收的推送通知的首选语言。如果翻译消息的语言符合你的设置，则翻译消息显示在推送通知中；否则，将显示原始消息。翻译功能由 Microsoft Azure Translation API 提供，你可以点击[这里](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)了解支持的翻译语言。

关于如何设置和获取推送通知的首选语言，详见相应文档，例如，对于 Android，可参见[设置推送翻译文档](/document/android/push/push_translation.html)。

## 推送扩展

你可以利用扩展字段实现自定义推送设置，包括仅对群组中某些成员推送通知、设置通知栏折叠、强制推送和发送静默消息。

关于如何设置推送扩展字段，详见相应文档，例如，对于 Android，可参见[设置推送扩展功能文档](/document/android/push/push_extension.html)。





