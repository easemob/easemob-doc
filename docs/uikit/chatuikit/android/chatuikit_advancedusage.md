# 进阶用法

<Toc />

## Activity 跳转路径设置 

如果默认的 Activity 及其提供的可配置项不满足需求时，需要你继承默认的 Activity 新增需要的逻辑。如果该 Activity 为 UIKit 内部调用的页面，你可以通过下面方法修改 Activity 的跳转。

例如，若 `UIKitChatActivity` 无法满足当前需求，可以继承 `UIKitChatActivity` 实现新的 `ChatActivity`。当调用 `UIKitChatActivity.actionStart` 跳转页面时，UIKit 会通过 `getActivityRoute()` 拦截原有跳转，而将跳转指向 `ChatActivity`。

:::tip
只有实现了 `ChatUIKitClient.getCustomActivityRoute()?.getActivityRoute()` 的 Activity 才可以进行拦截。
:::

```kotlin
//实现 UIKitChatActivity 页面的 getActivityRoute

companion object {
    private const val REQUEST_CODE_STORAGE_PICTURE = 111
    private const val REQUEST_CODE_STORAGE_VIDEO = 112
    private const val REQUEST_CODE_STORAGE_FILE = 113

    fun actionStart(context: Context, conversationId: String, chatType: ChatUIKitType) {
        Intent(context, UIKitChatActivity::class.java).apply {
             putExtra(ChatUIKitConstant.EXTRA_CONVERSATION_ID, conversationId)
             putExtra(ChatUIKitConstant.EXTRA_CHAT_TYPE, chatType.ordinal)
             ChatUIKitClient.getCustomActivityRoute()?.getActivityRoute(this.clone() as Intent)?.let {
                    if (it.hasRoute()) {
                    context.startActivity(it)
                    return
                }
            }
            context.startActivity(this)
        }
    }
}


// application 中路由拦截实现
ChatUIKitClient.setCustomActivityRoute(object : ChatUIKitCustomActivityRoute {
    override fun getActivityRoute(intent: Intent): Intent {
        if (intent.component?.className == UIKitChatActivity::class.java.name) {
            intent.setClass(this@DemoApplication, ChatActivity::class.java)
         }
        return intent
    }
})
```

## 全局配置

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

`ChatUIKitConfig` 提供的配置项如下表所示：

| 属性                                    | 描述                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| enableReplyMessage                     | 消息回复功能是否可用，默认为可用。                                     |
| enableModifyMessageAfterSent           | 消息编辑功能是否可用，默认为可用。                                     |
| timePeriodCanRecallMessage             | 设置消息可撤回的时间，默认为 2 分钟。                                    |


`ChatUIKitDateFormatConfig` 提供的配置项如下表所示：

| 属性                                    | 描述                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| convTodayFormat                       | 会话列表当天日期格式，英文环境默认为："HH:mm"。                            |
| convOtherDayFormat                    | 会话列表其他日期的格式，英文环境默认为： "MMM dd"。                        |
| convOtherYearFormat                   | 会话列表其他年日期的格式，英文环境默认为： "MMM dd, yyyy"。                |


`ChatUIKitSystemMsgConfig` 提供的配置项如下表所示：

| 属性                                    | 描述                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| useDefaultContactInvitedSystemMsg      | 是否启用系统消息功能，默认为启用。                                       |


`ChatUIKitMultiDeviceEventConfig` 提供的配置项如下表所示：

| 属性                                   | 描述               |
|--------------------------------------|-------------------|
| useDefaultMultiDeviceContactEvent    | 是否启用默认的多设备联系人事件处理。 |
| useDefaultMultiDeviceGroupEvent      | 是否启用默认的多设备群组事件处理。  |

