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

