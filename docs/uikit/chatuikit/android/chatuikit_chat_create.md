# 创建聊天页面

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