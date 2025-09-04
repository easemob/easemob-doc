# CallKit 架构

## 项目概述

环信 Android CallKit 是基于环信即时通讯 IM SDK 和声网 RTC SDK 开发的实时音视频通话框架。项目采用 Kotlin 作为开发语言，使用 MVVM 架构模式来分离业务逻辑和 UI 展示。通过 Kotlin Flow（StateFlow/SharedFlow）进行响应式状态管理，确保 UI 能够及时响应数据变化。异步操作统一使用 Kotlin Coroutines 处理，提供流畅的用户体验。

## 主要模块

环信 CallKit 的整体架构采用模块化设计，各个模块职责清晰，便于维护和扩展。

![img](/images/callkit/android/architecture.png)
  
### CallKitClient
 
`CallKitClient` 是 CallKit 的核心管理器，负责初始化、对外 API、通话状态、通话类型、资源回收，聚合内部模块。

| 组件 | 说明 |
| :--- | :--- |
| `RtcManager` | - 管理声网 RTC 引擎：加入/离开频道、前后台质量、参与者、摄像头/麦克风、切换等。<br/> - [查看更多功能实现](https://doc.shengwang.cn/doc/rtc/android/get-started/quick-start#%E5%AE%9E%E7%8E%B0%E5%B8%B8%E7%94%A8%E5%9B%9E%E8%B0%83)。 |
| `SignalingManager` | 负责信令交互（邀请、Alert/仲裁、接听/拒绝/取消、超时控制），触发 UI（Activity/悬浮窗/Telecom）和 RTC 引擎执行对应的动作。[点击查看具体信令](signaling.html)。 |
| `AudioController` | 负责铃声播放（外呼、来电、结束 ding），支持 assets/raw/绝对文件路径。 |
| `FloatWindow` | 悬浮窗的显示。 |
| `IncomingCallTopWindow` | 来电通知栏的显示。 |
| `CallKitCache` | 用户信息、群组信息、Token 等缓存。 |
| 其他  | 前台服务 `CallForegroundService`，通知工具 `CallKitNotifier`。 |

### UI 层

UI 层实现通话界面。

| 组件 | 说明 |
| :--- | :--- |
| `BaseCallActivity` | 通话 Activity 基类：负责统一处理锁屏显示、动态权限申请、前后台切换、悬浮窗权限引导。 |
| `SingleCallActivity` | 一对一通话界面。 |
| `MultiCallActivity` | 群组通话界面。 |
| `ViewModel` | `SingleCallViewModel`/`MultipleCallViewModel` 等：封装一对一通话/群组通话的业务动作（接听、挂断、展示悬浮窗等）。 |

### Telecom

Telecom 模块提供系统来电功能。

| 组件 | 说明 |
| :--- | :--- |
| `TelecomHelper` | 统一处理 Telecom 服务。 |
| `IncomingCallService` | `TelecomManager.addNewIncomingCall(...)` 触发系统来电界面。 |
| `VoipConnectionService` | `ConnectionService` 实现，将系统接听/拒绝动作桥接到 `SignalingManager`。 |
| `PhoneAccountHelper` | VoIP 账户的注册、启用检测和设置引导。 |
