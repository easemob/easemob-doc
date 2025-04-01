# Demo（EaseIM App）介绍

<Toc />

环信即时通讯 IM Android 端提供示例应用可供体验。

1. [下载 Demo](https://www.easemob.com/download/demo)。

2. 输入你的手机号，获取验证码，然后输入。

3. 选择同意《环信服务条款》与《环信隐私协议》，然后点击 **登录** 登录 Demo。

![img](/images/demo/android_login.png)

## 代码下载

您可以通过以下两种方式获取到源代码：
- 下载代码压缩包：[IM SDK 及 Demo 下载](https://www.easemob.com/download/im)
- 下载源代码：[GitHub 源码地址](https://github.com/easemob/easemob-demo-android)
  - 4.5.0 及之前版本的 Demo 为 Java 语言。你可以查看 [Demo 源码地址](https://github.com/easemob/chat-android)。环信已不再维护该地址的 Demo 源码。
  - 4.6.0 及之后版本的 Demo 为 Kotlin 语言。你可以查看 [Demo 源码地址](https://github.com/easemob/easemob-demo-android)。

## 导入 EaseIM

从 [IM SDK 及 Demo 下载](https://www.easemob.com/download/im) 下载 Android SDK 压缩包，然后解压。解压后在 `examples` 文件夹下，即为 EaseIM 的工程目录。

### 导入到 Android Studio

打开 Android Studio，点击 `File > Open`，打开 `examples/EaseIm3.0` 根目录即可。

## 使用的第三方库

| 第三方库                | 描述     | 
| :------------------- | :------------- |
| `androidx.core:core-ktx:1.10.1`   |  Kotlin 库。 |
| `org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3`  | Kotlin 协程库。  |   
| `org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3`  | Kotlin 协程库。  |  
| `androidx.appcompat:appcompat`       | `appcompat` 库，对应以前的 `appcompat-v7` 库。   |
| `com.google.android.material:material：material`      | 对应以前的 design 库。如果用到 TabLayout、CardView 等 Material Design 控件时需要添加。  |
| `androidx.constraintlayout:constraintlayout`      | constraintlayout 布局。   |
| `androidx.lifecycle:lifecycle-runtime-ktx`      | lifecycle 库。  |
| `androidx.lifecycle:lifecycle-viewmodel-ktx`  |  ViewModel 和 lifecycle 库。  |
| `com.android.support:multidex`  | 工程总方法数超过 64 KB 时，需要用这个库做分包处理。  |
| `play-services-base和firebase-messaging`      | 谷歌推送所需要的库，使用 FCM 推送时需要添加。  |
| `com.scwang.smartrefresh:SmartRefreshLayout`      | 下拉刷新及上拉加载更多库。 |
| `androidx.swiperefreshlayout:swiperefreshlayout`      | 下拉刷新库。|
| `androidx.room`      | Android 数据库。   |
| `com.huawei.hms:push`      |  华为推送所需要的库。  |
| `com.meizu.flyme.internet:push-internal`      | 魅族推送所需要的库。   |
| `vivo_push_v4.0.4.0_504.aar`       | vivo 推送所需要的库。  |
| `oppo_push_3.5.2.aar`      | OPPO 推送所需要的库。   |
| `MiPush_SDK_Client_6_0_1-C_3rd.aar`      | 小米推送所需要的库。  |
| `com.hihonor.mcs:push`      | 7.0.61.303 荣耀推送所需要的库。  |

## 主要模块介绍

| 模块               | 描述   | 
| :------------------- | :----- |
| 聊天模块    | 展示如何依赖 EaseIMKit 实现聊天列表，如何扩展消息类型及如何增加扩展菜单等的逻辑。    | 
| 会话列表模块 | 展示如何依赖 EaseIMKit 实现会话列表的逻辑及实现系统消息的具体逻辑。   | 
| 联系人模块  | 展示如何依赖 EaseIMKit 实现联系人列表的逻辑。   | 
| 聊天设置模块  | 展示 IM SDK 提供的对于群聊及聊天室的对成员及群组属性的操作。    | 
| 设置模块  | 展示 IM SDK 对于新消息的设置及消息免打扰，群组等通用设置。   | 
| 开发者模块  | 展示 IM SDK 提供的一些常规的开发者可以设置的功能。   | 

## 主要类介绍

| 模块               | 描述   | 
| :------------------- | :----- |
| DemoHelper               | 环信（EaseIM）全局帮助类，主要功能为初始化 IM SDK，初始化 EaseIMKit 相关及注册对话类型等。  | 
| ConversationListFragment   | 继承自 EaseIMKit 中的 `ChatUIKitConversationListFragment`，展示扩展条目长按事件，在列表前端添加布局及条目点击事件实现等  | 
| ChatActivity及ChatFragment  | ChatFragment 继承自 EaseIMKit 中的 UIKitChatFragment，展示了扩展条目长按事件，预置条目长按菜单及对重写部分长按事件功能，展示了如何重置及添加更多扩展功能，并展示了实现了头像点击事件及正在输入等事件的相应。  | 
| ChatContactListFragment                | 继承自 EaseIMKit 中的 ChatUIKitContactsListFragment，展示了添加头布局，添加条目长按功能及实现条目点击事件等  |
| ChatGroupDetailActivity  | 实现了如下功能：添加群成员，修改群公告及群介绍，上传共享文件，进行群组管理，设置消息免打扰及解散或者退出群组等。   | 

## 部分 UI 展示

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/main_chat.png" title="聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
  <ImageItem src="/images/uikit/chatuikit/android/main_contact_list.png" title="通讯录" />
</ImageGallery>
