# 消息话题

消息话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

单群聊 UIKit 中实现了 Thread 页面 `ChatUIKitThreadActivity`，开发者只需要调用 `ChatUIKitThreadActivity.actionStart` 启动该页面传入需要的参数即可。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_thread_android.png" title="消息话题" />
</ImageGallery>

## 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息话题特性在 `ChatUIKitConfig` 中默认关闭，即 `enableChatThreadMessage` 的默认值为 `false`。要开启该特性，需将该参数设置为 `true`。

示例代码如下：

```kotlin

    ChatUIKitClient.getConfig()?.chatConfig?.enableChatThreadMessage

```

## 如何自定义

你可以通过继承 `ChatUIKitThreadActivity` 添加自己的逻辑，示例如下：

```kotlin

class ChatThreadActivity:ChatUIKitThreadActivity() {
    override fun setChildSettings(builder: UIKitChatFragment.Builder) {
        super.setChildSettings(builder)
    }
}

```