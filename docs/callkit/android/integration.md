# CallKit 集成指南

## 功能概述

环信 CallKit 是一套基于环信即时通讯 IM（基于 IM 4.16.0 及以上）和声网 RTC 结合开发的音视频 UI 库。使用环信 CallKit 之前，你需要将其集成到你的应用中。

<ImageGallery>
  <ImageItem src="/images/callkit/android/1v1_video_caller_invitation.png" title="一对一通话邀请" />
  <ImageItem src="/images/callkit/android/group_call_ongoing.png" title="群组通话" />
</ImageGallery>

## 推荐开发环境

- Android SDK: API Level 24 及以上
- Android Studio: 推荐最新版本
- Kotlin: 2.0.21
- JDK: 17
- Gradle 版本: 8.13

## 前提条件

在集成 CallKit 之前，你需要完成以下准备工作：

1. 在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
  - [注册环信账号](/product/console/account_register.html#注册账号)。
  - [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
  - [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID。
  - [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID。将用户加入群组。
  - [开通音视频服务](product_activation.html)。

2. 集成环信即时通讯 IM SDK。 
   
确保已集成环信 IM SDK 并完成登录。

## 集成步骤

### 步骤 1： 添加依赖

#### 方式一：（推荐）Gradle 远程依赖

1. 在 Project 工程根目录下的 `settings.gradle.kts` 文件内，添加 `mavenCentral()` 仓库：

```kotlin
pluginManagement {
   repositories {
      ...
      mavenCentral()
   }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        ...
        mavenCentral()
    }
}
```

2. 在 app(module) 目录的 `build.gradle.kts` 文件中添加以下依赖。关于 CallKit 的最新版本，详见 [Maven 仓库](https://central.sonatype.com/artifact/io.hyphenate/chat-call-kit/overview)。

```kotlin
dependencies {
    ...
    implementation("io.hyphenate:chat-call-kit:4.16.0")
}
```

#### 方式二：本地源码集成

从 [GitHub](https://github.com/easemob/easemob-callkit-android.git) 或 [Gitee](https://gitee.com/easemob-code/easemob-callkit-android) 获取音视频 CallKit 源码，克隆到本地。按照以下步骤集成：

1. 在 Project 工程根目录下的 `settings.gradle.kts` 文件中添加如下代码：

```kotlin
include(":ease-call-kit")
// "../easemob-callkit-android" 要替换成你克隆的实际工程路径，后边要拼接 "/ease-call-kit"
project(":ease-call-kit").projectDir = File("../easemob-callkit-android/ease-call-kit")
```

2. 在 app(module) 目录的 `build.gradle.kts` 文件中添加如下代码：

```kotlin
dependencies {
    ...
    implementation(project(":ease-call-kit"))
}
```


### 步骤 2 初始化 CallKit

在应用启动时（通常在 `Application` 或主 `Activity` 中）初始化 CallKit：

1. 初始化 IM SDK。CallKit 基于即时通讯 IM 作为信令通道，因此需先初始化 IM SDK。
   - 填入你的应用的 App Key。
   - 设置即时通讯 IM SDK 中的一些选项（`EMOptions` 类），例如，是否自动登录。
2. 初始化 CallKit。你可以自定义铃声和通话超时时间。

在整个应用生命周期中，初始化一次即可。

```kotlin
class MainActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        initCallKit()
    }
    
    private fun initCallKit() {
        // 1. 初始化环信 IM SDK
        val options = ChatOptions().apply {
            appKey = "your_app_key"  // 替换为你的 App Key
            autoLogin = false
        }
        ChatClient.getInstance().init(this, options)
        ChatClient.getInstance().setDebugMode(true)
        
        // 2. 初始化 CallKit
        val config = CallKitConfig().apply {
            // （可选）配置自定义铃声
            incomingRingFile = "assets://incoming_ring.mp3"
            outgoingRingFile = "assets://outgoing_ring.mp3"
            dingRingFile = "assets://ding.mp3"
            
            // （可选）配置通话超时时间（秒）
            callTimeout = 30  // 30秒
        }
        
        CallKitClient.init(this, config)
    }
}
```

### 步骤 3 配置监听器

环信 CallKit 提供 `CallKitListener` 监听通话过程。你可以在应用初始化时设置监听器用于处理通话相关的回调：

```kotlin
class MainActivity : AppCompatActivity() {
    
    private val callKitListener = object : CallKitListener {
        
        // 通话结束
        override fun onEndCallWithReason(reason: CallEndReason, callInfo: CallInfo?) {
            runOnUiThread {
                when (reason) {
                    CallEndReason.CallEndReasonHangup -> {
                        showToast("通话已挂断")
                    }
                    CallEndReason.CallEndReasonCancel -> {
                        showToast("通话已取消")
                    }
                    CallEndReason.CallEndReasonRemoteRefuse -> {
                        showToast("对方拒绝通话")
                    }
                    CallEndReason.CallEndReasonRemoteNoResponse -> {
                        showToast("对方无响应")
                    }
                    // ... 其他结束原因
                }
            }
        }
        
        // 通话错误
        override fun onCallError(
            errorType: CallKitClient.CallErrorType,
            errorCode: Int,
            description: String?
        ) {
            runOnUiThread {
                showToast("通话错误: $description")
            }
        }
        
        // 收到通话邀请
        override fun onReceivedCall(userId: String, callType: CallType, ext: JSONObject?) {
            runOnUiThread {
                val typeStr = when (callType) {
                    CallType.SINGLE_VIDEO_CALL -> "视频通话"
                    CallType.SINGLE_VOICE_CALL -> "语音通话"
                    CallType.GROUP_CALL -> "群组通话"
                }
                showToast("收到来自 $userId 的$typeStr")
            }
        }
        
        // 远端用户加入
        override fun onRemoteUserJoined(userId: String, callType: CallType, channelName: String) {
            runOnUiThread {
                showToast("$userId 加入通话")
            }
        }
        
        // 远端用户离开
        override fun onRemoteUserLeft(userId: String, callType: CallType, channelName: String) {
            runOnUiThread {
                showToast("$userId 离开通话")
            }
        }
        
        // RTC 引擎创建（可用于私有化部署配置）
        override fun onRtcEngineCreated(engine: RtcEngine) {
            // 如需私有化部署，在此处配置
        }
    }
    
    private fun initCallKit() {
        // ... 初始化代码
        
        // 设置监听器
        CallKitClient.callKitListener = callKitListener
    }
}
```

### 步骤 4 登录 IM

```kotlin
ChatClient.getInstance().loginWithToken(username, token, object : ChatCallback {
        override fun onSuccess() {
            runOnUiThread {
                showToast("登录成功")
            }
        }

        override fun onError(code: Int, error: String?) {
            runOnUiThread {
                showToast("登录失败: $error")
            }
        }
    })

```

### 步骤 5 发起通话

#### 发起一对一通话

你可以使用 `startSingleCall` 方法发起一对一通话，`CallType` 设置为 `SINGLE_VIDEO_CALL` 为视频通话，`SINGLE_VOICE_CALL` 为音频通话。

<ImageGallery>
  <ImageItem src="/images/callkit/android/1v1_video_caller_invitation.png" title="视频通话" />
  <ImageItem src="/images/callkit/android/1v1_voice_caller_invitation.png" title="音频通话" />
</ImageGallery>

- 发起一对一视频通话

```kotlin
private fun startVideoCall() {
    // 检查登录状态
    if (!ChatClient.getInstance().isLoggedInBefore) {
        showToast("请先登录")
        return
    }
    
    val targetUserId = "peer_user_id"  // 对方用户 ID
    val ext = JSONObject().apply {
        put("customKey", "customValue")  // 可选的扩展信息
    }
    
    CallKitClient.startSingleCall(
        CallType.SINGLE_VIDEO_CALL,
        targetUserId,
        ext  // 可传 null
    )
}
```

- 发起一对一语音通话

```kotlin
private fun startVoiceCall() {
    val targetUserId = "peer_user_id"
    
    CallKitClient.startSingleCall(
        CallType.SINGLE_VOICE_CALL,
        targetUserId,
        null
    )
}
```

#### 发起群组通话

- **创建群组**：要发起群组通话，你需要首先创建群组，在群组中添加用户，详见 [即时通讯 IM Android SDK 文档](/document/android/group_manage.html#创建群组) 或 [环信控制台文档](/product/console/operation_group.html#创建群组)。
- **发起群组通话**：指定群组 ID 后，CallKit 会自动拉起群成员选择界面，界面显示群组中的所有成员（群主、管理员、普通成员），用户可以选择要邀请的成员，选中人数会实时显示。为了保证通话质量和性能，CallKit 限制群组通话最多支持 **16 人** 同时参与（包括发起者）。若选择的成员数量超过 16 人时，系统会自动提示 “人数超出最大限制16人” 并阻止发起通话。
- **通话扩展信息**：`ext` 会在 `CallKitListener#onReceivedCall` 中回调给接收方。
- **通话中邀请他人**：群组通话中，当前用户可以点击通话界面右上角的邀请按钮向其他用户发起邀请。

```kotlin
private fun startGroupCall() {
    // 群组 ID
    val groupId = "your_group_id"  

    val ext = JSONObject().apply {
        put("meetingTitle", "项目讨论会")
    }
    // ext 可传 null
    CallKitClient.startGroupCall(groupId, ext) 
}
```

<ImageGallery>
  <ImageItem src="/images/callkit/android/group_call_caller_user_selection.png" title="主叫选择用户进入通话" />
</ImageGallery>

### 步骤 6 接听通话

当接收到通话邀请时，CallKit 会自动触发 `onReceivedCall` 回调：
1. 弹出通话邀请界面。
2. 播放来电铃声。
3. 显示通话邀请通知（当 App 在后台时）。

被叫用户可选择接听、拒绝或挂断通话。

<ImageGallery :columns="3">
  <ImageItem src="/images/callkit/android/1v1_video_callee_invitation.png" title="一对一视频通话" />
  <ImageItem src="/images/callkit/android/1v1_voice_callee_invitation.png" title="一对一音频通话" />
  <ImageItem src="/images/callkit/android/group_call_callee_invitation.png" title="群组通话" />
</ImageGallery>

### 步骤 7 离线推送

为保证被叫用户 App 在离线时也能收到通话请求，用户需开启离线推送。关于如何开启离线推送，请参见 [开启 Android Push](/document/android/push/push_notification_mode_dnd.html)。开启离线推送后，用户在离线情况下收到呼叫请求时，其手机通知页面会弹出一条通知消息，用户点击该消息可唤醒 App 并进入振铃页面。

关于离线推送场景方案，请参见 [Android 端离线推送文档](/document/android/push/push_overview.html)。

<ImageGallery>
  <ImageItem src="/images/callkit/android/notification_system.png" title="系统级来电通知" />
</ImageGallery>


## 进阶功能

### 用户信息

默认情况下，音视频通话时，对于用户信息，CallKit 会显示默认图像和用户 ID；对于群信息，CallKit 会根据群组 ID 从 SDK 中拉取群信息来对应显示群组名称和群图像。

如果要在一对一通话界面显示自定义用户头像和昵称，群聊通话显示自定义群图像和群名称，你可以通过 `CallInfoProvider` 实现自定义用户信息。

```kotlin
class MyCallInfoProvider : CallInfoProvider {
    
    override fun asyncFetchUsers(
        userIds: List<String>,
        onValueSuccess: OnValueSuccess<List<CallKitUserInfo>>
    ) {
        // 异步获取用户信息
        GlobalScope.launch {
            val userInfos = mutableListOf<CallKitUserInfo>()
            
            userIds.forEach { userId ->
                // 从你的用户系统获取用户信息
                val userInfo = getUserFromApi(userId)
                userInfos.add(
                    CallKitUserInfo().apply {
                        this.userId = userId
                        this.nickName = userInfo.nickname
                        this.avatar = userInfo.avatar
                    }
                )
            }
            
            // 回调用户信息
            onValueSuccess.onSuccess(userInfos)
        }
    }
    
    override fun asyncFetchGroupInfo(
        groupId: String,
        onValueSuccess: OnValueSuccess<CallKitGroupInfo>
    ) {
        // 异步获取群组信息
        GlobalScope.launch {
            val groupInfo = getGroupFromApi(groupId)
            val callKitGroupInfo = CallKitGroupInfo().apply {
                this.groupID = groupId
                this.groupName = groupInfo.name
                this.groupAvatar = groupInfo.avatar
            }
            
            onValueSuccess.onSuccess(callKitGroupInfo)
        }
    }
    
    private suspend fun getUserFromApi(userId: String): UserInfo {
        // 实现你的用户信息获取逻辑
        return UserInfo(userId, "昵称", "头像URL")
    }
    
    private suspend fun getGroupFromApi(groupId: String): GroupInfo {
        // 实现你的群组信息获取逻辑
        return GroupInfo(groupId, "群组名称", "群组头像URL")
    }
}

// 设置用户信息提供者
CallKitClient.callInfoProvider = MyCallInfoProvider()
```

### 自定义视频分辨率

环信 CallKit 中默认设置的分辨率为 1280x720。网络连接不稳定时，声网 RTC SDK 会主动降低分辨率或帧率。

若要修改本地摄像头视频采集的分辨率，可以在创建声网 RTC 引擎时进行配置。

```kotlin
private val callKitListener = object : CallKitListener {
    
    override fun onRtcEngineCreated(engine: RtcEngine) {
         val configuration=  VideoEncoderConfiguration()
         //例如，修改分辨率为 1280x720 
         configuration.dimensions= VD_1280x720  
         rtcEngine?.setVideoEncoderConfiguration(configuration)
    }
    
    // ... 其他回调
}
```
更多其他配置可以参考 [声网 RTC 文档](https://doc.shengwang.cn/doc/rtc/android/basic-features/video-profile#视频参数推荐值)。