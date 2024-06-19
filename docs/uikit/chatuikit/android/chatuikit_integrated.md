# 集成单群聊 UIKit

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

- Android Studio 4.0 及以上
- Gradle 4.10.x 及以上
- targetVersion 26 及以上
- Android SDK API 21 及以上
- JDK 11 及以上

## 集成单群聊 UIKit

### Module 远程依赖

在 app 项目 build.gradle.kts 中添加以下依赖：

```kotlin
implementation("io.hyphenate:ease-chat-kit:4.7.0")
```

### 本地依赖

从 GitHub 获取[单群聊 UIKit](https://github.com/easemob/chatuikit-android) 源码，按照下面的方式集成：

1. 在根目录 `settings.gradle.kts` 文件（/Gradle Scripts/settings.gradle.kts）中添加如下代码：

```kotlin
include(":ease-im-kit")
project(":ease-im-kit").projectDir = File("../chatuikit-android/ease-im-kit")
```

2. 在 app 的 `build.gradle.kts` 文件（/Gradle Scripts/build.gradle）中添加如下代码：

```kotlin
//chatuikit-android
implementation(project(mapOf("path" to ":ease-im-kit")))
```

### 防止代码混淆

在 `app/proguard-rules.pro` 文件中添加如下行，防止代码混淆：

```kotlin
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

## 快速搭建页面

### 创建聊天页面

- 使用 `EaseChatActivity`

单群聊 UIKit 提供 `EaseChatActivity` 页面，调用 `EaseChatActivity#actionStart` 方法即可，示例代码如下：

```kotlin
// conversationId: 单聊会话为对端用户 ID，群聊会话为群组 ID。
// chatType：单聊为 EaseChatType#SINGLE_CHAT，群聊为 EaseChatType#GROUP_CHAT。
EaseChatActivity.actionStart(mContext, conversationId, chatType)
```
`EaseChatActivity` 页面主要进行权限的请求，比如相机权限，语音权限等。

- 使用 `EaseChatFragment`

开发者也可以使用单群聊 UIKit 提供的 `EaseChatFragment` 创建聊天页面，示例代码如下：

```kotlin
class ChatActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_chat)
        // conversationID: 1v1 is peer's userID, group chat is groupID
        // chatType can be EaseChatType#SINGLE_CHAT, EaseChatType#GROUP_CHAT
        EaseChatFragment.Builder(conversationId, chatType)
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```

### 创建会话列表页面

单群聊 UIKit 提供 `EaseConversationListFragment`，添加到 Activity 中即可使用。

示例如下：

```kotlin
class ConversationListActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_conversation_list)

        EaseConversationListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```

### 创建联系人列表页面

单群聊 UIKit 提供 `EaseContactsListFragment`，添加到 Activity 中即可使用。

示例如下：

```kotlin
class ContactListActivity: AppCompactActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_contact_list)

        EaseContactsListFragment.Builder()
                        .build()?.let { fragment ->
                            supportFragmentManager.beginTransaction()
                                .replace(R.id.fl_fragment, fragment).commit()
                        }
    }
}
```

