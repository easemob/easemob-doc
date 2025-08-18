# 环信 CallKit 集成

## 功能概述

环信 CallKit 是一套基于环信即时通讯 IM 和声网 RTC 结合开发的音视频 UI 库，提供以下核心功能：

- **一对一语音/视频通话**：支持高质量的一对一音视频通话。
- **群组音视频通话**：支持群组内多人同时参与的音视频会议。 // TODO：会议改为通话？
- **完整的通话流程**：包括邀请、接听、挂断、拒绝等完整的通话体验。
- **锁屏显示**：支持在锁屏状态下显示来电界面。
- **悬浮窗功能**：通话时可最小化为悬浮窗，不影响其他应用使用。
- **丰富的配置选项**：支持自定义铃声、超时时间等。

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

2. 集成环信即时通讯 IM SDK 
   
确保已集成环信 IM SDK 的基本功能，例如，登录、好友、群组等。

## 快速集成

使用 CallKit 库完成音视频通话的基本流程如下：

1. 初始化 CallKit 库，设置 CallKit 监听。
2. 主叫方调用发起通话邀请接口，进入通话界面。
3. 被叫方收到邀请自动弹出通话邀请界面，在通话邀请界面选择接通或者拒绝。
4. 主叫或者被叫挂断通话。

### 步骤 1 添加依赖

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

2. 在 app(module) 目录的 `build.gradle.kts` 文件中添加以下依赖：

```kotlin
dependencies {
    ...
    implementation("io.hyphenate:call-kit:4.17.0")
}
```

#### 方式二：本地源码集成

// TODO：替换 Callkit 源码链接。

从 GitHub 获取音视频 [CallKit 源码](https://www.xxxxx.com)，克隆到本地。按照以下步骤集成：

1. 在 Project 工程根目录下的 `settings.gradle.kts` 文件中添加如下代码：

```kotlin
include(":ease-call-kit")
// "../chatcallkit-android" 要替换成你克隆的实际工程路径，后边要拼接 "/ease-call-kit"
project(":ease-call-kit").projectDir = File("../chatcallkit-android/ease-call-kit")
```

2. 在 app(module) 目录的 `build.gradle.kts` 文件中添加如下代码：

```kotlin
dependencies {
    ...
    implementation(project(":ease-call-kit"))
}
```


### 步骤 2 初始化 CallKit

在应用启动时（通常在 `Application` 或主 `Activity` 中）初始化 CallKit。CallKit 初始化包括如下步骤：

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
            
            // （可选）配置通话超时时间（毫秒）
            callTimeout = 30000L  // 30秒
        }
        
        CallKitClient.init(this, config)
    }
}
```

### 步骤 3 （可选）配置监听器

环信 CallKit 提供 CallKitListener 监听通话过程。你可以在应用初始化时设置监听器用于处理通话相关的回调：

// TODO：上面这句话是否合适。

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

### 步骤 4 发起通话

#### 发起一对一通话

// TODO：在一对一通话过程中是否可以再邀请其他用户加入通话。一旦邀请成功，通话类型自动转为群组通话？
// TODO：一对一通话/群组通话中，音视频通话是否能互相切换？

你可以使用 `startSingleCall` 方法发起一对一通话，`CallType` 设置为 `SINGLE_VIDEO_CALL` 为视频通话，`SINGLE_VOICE_CALL` 为音频通话。

##### 一对一视频通话

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
// TODO：添加截图

##### 一对一语音通话

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
// TODO：添加截图

#### 发起群组通话

为了保证通话质量和性能，CallKit 限制群组通话最多支持 **16 人** 同时参与（包括发起者）。若选择的成员数量超过 16 人时，系统会自动提示 “人数超出最大限制16人” 并阻止发起通话。// TODO：音频和视频通话都是 16 人？

发起群组通话需要指定群组 ID，CallKit 会自动拉起群成员选择界面，界面显示群组中的所有成员（群主、管理员、普通成员），用户可以选择要邀请的成员，选中人数会实时显示。

`ext` 会在 `CallKitListener#onReceivedCall` 中回调给接收方。

// TODO：这里没有看到CallType 参数传入音频通话和视频通话值。

```kotlin
private fun startGroupCall() {
    // 群组 ID
    val groupId = "your_group_id"  

    val ext = JSONObject().apply {
        put("meetingTitle", "项目讨论会")
    }
    // ext 可传 null
    CallKitClient.startInviteMultipleCall(groupId, ext) 
}
```

// TODO：添加截图

#### 群组通话中邀请

群组通话中，当前用户可以点击通话界面右上角的邀请按钮向其他用户发起邀请。

// TODO：添加截图

### 步骤 5 接听通话

当接收到通话邀请时，`CallKit` 会自动触发 `onReceivedCall` 回调：
1. 弹出通话邀请界面。
2. 播放来电铃声。
3. 显示通话邀请通知（当 App 在后台时）。

被叫用户可以在通话邀请界面进行以下操作：
- **接听**：接受通话邀请，进入通话界面。
- **拒绝**：拒绝通话邀请。
- **挂断**：通话过程中点击挂断按钮。
  
// TODO：用户在通话中可以选择接听或拒绝其他来电。// TODO：是否需要加上

//添加截图

### 步骤 6 结束通话

正常情况下，用户通过 UI 界面挂断后由 CallKit 内部处理即可。开发者也可以通过如下接口主动挂断进行风控处理。

```kotlin
// 主动结束通话
CallKitClient.exitCall()
```

### 步骤 7 离线推送

为保证被叫用户 App 在离线时也能收到通话请求，用户需开启离线推送。关于如何开启离线推送，请参见 [开启 Android Push](/document/android/push/push_notification_mode_dnd.html)。开启离线推送后，用户在离线情况下收到呼叫请求时，其手机通知页面会弹出一条通知消息，用户点击该消息可唤醒 App 并进入振铃页面。

关于离线推送场景方案，请参见 [Android 端离线推送文档](/document/android/push/push_overview.html)。

// TODO：添加截图