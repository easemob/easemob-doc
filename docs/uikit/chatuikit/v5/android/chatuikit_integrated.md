# 集成单群聊 UIKit

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

- Android Studio Ladybug 2024.2.2 及以上
- Gradle 8.7 及以上
- compileSdk 34 及以上
- Android SDK API 21 及以上
- JDK 17 及以上

## 集成单群聊 UIKit

### Module 远程依赖

在 app 项目 `build.gradle.kts` 中添加以下依赖：

```kotlin
implementation("io.hyphenate:ease-chat-kit:5.1.0")
```

若要查看最新版本号，请点击[这里](https://central.sonatype.com/artifact/io.hyphenate/ease-chat-kit/versions)。

### 本地依赖

从 [GitHub](https://github.com/easemob/easemob-uikit-android) 或 [Gitee](https://gitee.com/easemob-code/easemob-uikit-android) 获取单群聊 UIKit 源码，按照下面的方式集成：

1. 在 Project 根目录 `settings.gradle.kts` 文件中添加如下代码：

```kotlin
include(":ease-chat-kit")
project(":ease-chat-kit").projectDir = File("../easemob-uikit-android/ease-im-kit")
```

其中 `:ease-chat-kit` 为 UIKit 源码模块 `ease-im-kit` 在工程中的别名，`../easemob-uikit-android/ease-im-kit` 为 UIKit 源码在本地的相对路径，请根据实际存放位置调整。

2. 在 app 的 `build.gradle.kts` 文件中添加如下代码：

```kotlin
implementation(project(mapOf("path" to ":ease-chat-kit")))
```

### 防止代码混淆

在 `app/proguard-rules.pro` 文件中添加如下行，防止代码混淆：

```kotlin
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

## 初始化

在使用 UIKit 的控件前，必须要先初始化。例如在 `Application` 中：

```kotlin
import com.hyphenate.chat.EMOptions.EMDataSyncType
import java.util.EnumSet

class DemoApplication: Application() {
    
    override fun onCreate() {
        val options = ChatOptions()
        options.appKey = "你的appkey"
        // 开启 SDK 用户信息托管：消息携带发送者资料、登录后自动同步用户属性等。UIKit 展示用户昵称和头像依赖该配置。
        options.setEnableUserInfo(true)
        // 设置登录后自动同步的数据类型：会话、联系人和已加入的群组。默认仅同步会话数据。
        options.setDataSyncType(EnumSet.of(EMDataSyncType.CONVERSATIONS, EMDataSyncType.CONTACTS, EMDataSyncType.JOINED_GROUPS))
        ChatUIKitClient.init(this, options)
    }
}
```

## 快速搭建页面

### 创建聊天页面

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
class ChatActivity: AppCompatActivity() {
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

### 创建会话列表页面

单群聊 UIKit 提供 `ChatUIKitConversationListFragment`，添加到 Activity 中即可使用。

示例如下：

```kotlin
class ConversationListActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_conversation_list)

        ChatUIKitConversationListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```

### 创建好友列表页面

单群聊 UIKit 提供 `ChatUIKitContactsListFragment`，添加到 Activity 中即可使用。

示例如下：

```kotlin
class ContactListActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contact_list)

        ChatUIKitContactsListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```
