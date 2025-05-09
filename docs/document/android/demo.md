# 环信即时通讯 IM Android Demo 

环信即时通讯 IM Android Demo 提供用户登录、单聊、群组、聊天室、子区、消息(文字、表情、语音、视频、图片、文件等)发送及管理、会话管理、好友管理、用户属性、用户在线状态（Presence）以及实时音视频通话等功能。

## 体验 Demo 

1. [下载 Demo](https://www.easemob.com/download/demo)。
2. 输入你的手机号，获取验证码，然后输入。
3. 选择同意《环信服务条款》与《环信隐私协议》，然后点击 **登录** 登录 Demo。

![img](/images/demo/android_login.png =350x750)

下面为部分 UI 界面的展示：

<ImageGallery :columns="2">
  <ImageItem src="/images/uikit/chatuikit/android/main_chat.png" title="单聊页面" />
  <ImageItem src="/images/uikit/chatuikit/android/main_chat_group.png" title="群聊页面" />
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
  <ImageItem src="/images/uikit/chatuikit/android/main_contact_list.png" title="通讯录" />
</ImageGallery>

## 快速跑通 Demo

### 开发环境要求

- Android Studio Flamingo | 2022.2.1 及以上
- Gradle 8.0 及以上
- targetVersion 26 及以上
- Android SDK API 21 及以上
- JDK 17 及以上

### 跑通步骤

1. [创建应用](/product/enable_and_configure_IM.html)。 
2. [获取应用的 App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。
3. [创建用户](/product/enable_and_configure_IM.html#创建-im-用户)。
4. [下载即时通讯 IM Demo 项目源码](https://github.com/easemob/easemob-demo-android)。
5. 下载完毕，打开 Android Studio，点击 **File > Open**，打开已下载到本地的 Demo (`easemob-demo-android`) 工程根目录即可。
6. 将你的应用的 App Key 填入 Demo 工程根目录下的 `local.properties` 文件，格式为 `APPKEY = 你申请的appkey`。
7. 编译运行项目。
8. 使用注册的用户 ID 和密码登录。

### App Server

为方便开发者快速体验即时通讯 IM 功能，跑通本工程 Demo 源码默认使用开发者注册的用户 ID 和密码直接登录，不需要依赖部署服务端 App Server。但是在此模式下，手机验证码、用户头像和 EaseCallKit 实时音视频等相关功能不可用，你可以通过部署 App Server 完整体验这些功能。

App Server 为 Demo 提供以下功能：

- 通过手机号获取验证码。
- 通过手机号和验证码返回环信用户 ID 和环信用户 Token。
- 上传头像并返回地址。
- 根据用户的信息生成 [EaseCallKit](https://doc.easemob.com/document/android/easecallkit.html) 登录所需的 Token。
- 获取音视频通话时环信用户 ID 和 Agora UID 的映射关系。

你通过以下步骤部署 App Server：

1. 部署 App Server。详见 [服务端源码](https://github.com/easemob/easemob-im-app-server/tree/dev-demo)。
2. 在 Demo 工程根目录下 `local.properties` 文件中，填写 App Server 的域名或 IP 地址，格式为 `APP_SERVER_DOMAIN = 服务器域名或ip地址`。
3. 在 Demo 工程根目录下 `local.properties` 文件中，填入 `LOGIN_WITH_APPSERVER = true`，即通知 Demo 工程需要启用 App Server，体验完整功能。

**服务端中的 App Key 要跟客户端的 App Key 保持一致。**

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
