# 全局配置

单群聊 UIKit 提供了一些全局配置，可以在初始化时进行设置，示例代码如下：

```kotlin
val avatarConfig = ChatUIKitAvatarConfig()
// 将头像设置为圆角
avatarConfig.avatarShape = ChatUIKitImageView.ShapeType.ROUND
val config = ChatUIKitConfig(avatarConfig = avatarConfig)
ChatUIKitClient.init(this, options, config)
```

`ChatUIKitAvatarConfig` 提供的配置项如下表所示：

| 属性                                    | 描述                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| avatarShape                            | 头像样式，有默认，圆形和矩形三种样式，默认样式为默认。                    |
| avatarRadius                           | 头像圆角半径，仅在头像样式设置为矩形后有效。                            |
| avatarBorderColor                      | 头像边框的颜色。                                                    |
| avatarBorderWidth                      | 头像边框的宽度。                                                    |

`ChatUIKitConfig` 提供的配置项如下表所示，各项可以通过 `ChatUIKitClient.getConfig()?.chatConfig?.xxx` 的方式进行设置：

| 属性                                    | 描述                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| enableReplyMessage                     | 消息回复功能是否可用，默认为可用。                                     |
| enableModifyMessageAfterSent           | 消息编辑功能是否可用，默认为可用。                                     |
| timePeriodCanRecallMessage             | 设置消息可撤回的时间，单位为毫秒，默认值为 -1，为 -1 时生效默认 120000 毫秒（即 120 秒）。 |
| compatibilityModeForUserInfo            | 5.0 新增。是否将当前用户的昵称和头像写入消息扩展以兼容旧版 UIKit，默认为关闭。 |
| enableUrlPreview                        | 是否开启消息中的链接预览功能，默认为开启。                               |
| targetTranslationLanguage               | 消息翻译的目标语言，默认为 "zh"。                                      |
| showUnreadNotificationInChat            | 聊天页面是否显示未读消息通知，默认为开启。                                |


`ChatUIKitDateFormatConfig` 提供的配置项如下表所示：

| 属性                                    | 描述                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| convTodayFormat                       | 会话列表当天日期格式，英文环境默认为："HH:mm"。                            |
| convOtherDayFormat                    | 会话列表其他日期的格式，英文环境默认为： "MMM dd"。                        |
| convOtherYearFormat                   | 会话列表其他年日期的格式，英文环境默认为： "MMM dd, yyyy"。                |
| chatTodayFormat                       | 聊天页面当天日期格式，英文环境默认为："HH:mm"。                          |
| chatOtherDayFormat                    | 聊天页面其他日期的格式，英文环境默认为： "MMM dd, HH:mm"。                 |
| chatOtherYearFormat                   | 聊天页面其他年日期的格式，英文环境默认为： "MMM dd, yyyy HH:mm"。           |
| useDefaultLocale                      | 会话列表和聊天页面的日期格式是否使用系统默认 Locale，默认为 false，即为 false 时使用英文 Locale。 |


`ChatUIKitSystemMsgConfig` 提供的配置项如下表所示：

| 属性                                    | 描述                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| useDefaultContactSystemMsg             | 是否启用系统消息功能，默认为启用。                                       |


`ChatUIKitMultiDeviceEventConfig` 提供的配置项如下表所示：

| 属性                                   | 描述               |
|--------------------------------------|-------------------|
| useDefaultMultiDeviceContactEvent    | 是否启用默认的多设备好友事件处理。 |
| useDefaultMultiDeviceGroupEvent      | 是否启用默认的多设备群组事件处理。  |