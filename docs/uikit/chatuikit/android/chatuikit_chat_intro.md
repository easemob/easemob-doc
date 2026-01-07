# 聊天页面介绍

环信单群聊 UIKit 提供 `UIKitChatActivity` 和 `UIKitChatFragment` 两种方式方便用户快速集成聊天页面和自定义聊天页面。该页面提供如下功能：

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件和名片消息。
- 对消息进行复制、引用、撤回、删除、编辑、重新发送和审核。
- 清除本地消息。

## 创建聊天页面

- 使用 `UIKitChatActivity`

单群聊 UIKit 提供 `UIKitChatActivity` 页面，调用 `UIKitChatActivity#actionStart` 方法即可，示例代码如下：

```kotlin
// conversationId: 单聊会话为对端用户 ID，群聊会话为群组 ID。
// chatType：单聊为 ChatUIKitType#SINGLE_CHAT，群聊为 ChatUIKitType#GROUP_CHAT。
UIKitChatActivity.actionStart(mContext, conversationId, chatType)
```
`UIKitChatActivity` 页面主要进行权限的请求，比如相机权限，语音权限等。

- 使用 `UIKitChatFragment`

开发者也可以使用单群聊 UIKit 提供的 `UIKitChatFragment` 创建聊天页面，示例代码如下：

```kotlin
class ChatActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat)
        // conversationID: 1v1 is peer's userID, group chat is groupID
        // chatType can be ChatUIKitType#SINGLE_CHAT, ChatUIKitType#GROUP_CHAT
        UIKitChatFragment.Builder(conversationId, chatType)
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```

## 页面组件

聊天页面通过 `UIKitChatFragment` 实现，由标题栏、消息列表和底部输入框组成。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_chat.png" title="聊天页面" />
</ImageGallery>

### 标题栏

聊天页面与会话列表页面、通讯录页面、群详情页面和联系人详情页面的标题栏均使用 `ChatUIKitTitleBar`。详见 [设置标题栏](chatuikit_chat_titlebar.html)。//todo 把这里改成跳转到新写的ChatUIKitTitleBar的文档@秀文

### 消息列表

消息列表 `ChatUIKitMessageListLayout` 用于展示发送和接收的消息，以及对消息进行操作：

- **发送和接收消息**：包括文本、表情、图片、语音、视频、文件和名片等消息。
- **消息操作**：对消息进行复制、引用、撤回、删除、编辑、重新发送、举报、翻译、转发、多选、置顶操作。
  
关于自定义，详见 [自定义消息列表](chatuikit_chat_list.html)。

消息列表项组件 `ChatUlKitRow` 实现单条消息展示，包括展示消息内容的消息气泡、对端用户头像或群头像、消息时间等。关于自定义，详见 [设置消息列表项](chatuikit_chat_list.html#设置消息列表-item)。

### 底部输入框

消息底部输入框 `ChatUIKitInputMenu` 实现各类消息的输入和发送以及表情等功能，包括两部分：

- 底部输入菜单 `ChatUIKitPrimaryMenu`：输入和发送文本和语音消息、添加表情以及扩展功能等。
- 扩展菜单 `ChatUIKitExtendMenu`：发送附件类型消息，例如，图片、视频、文件以及自定义类型消息（如名片消息）等。

关于自定义，详见 [自定义底部输入框](chatuikit_chat_inputmenu.html)。