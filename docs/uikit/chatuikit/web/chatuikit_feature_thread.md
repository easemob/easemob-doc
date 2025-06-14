# 消息话题

消息话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

单群聊 UIKit 中实现了 Thread 页面 `EaseChatThreadActivity`，开发者只需要调用 `EaseChatThreadActivity.actionStart` 启动该页面传入需要的参数即可。

该功能在 UIKit 里的 `TextMessage` 组件中。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_thread_web.png" title="消息话题" />
</ImageGallery>

## 如何使用

1. 使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息话题特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.thread = false;
```

2. 从 UIKit 中引入 Thread 组件，监听 `rootStore.threadStore.showThreadPanel` 为 `true` 时显示此组件。