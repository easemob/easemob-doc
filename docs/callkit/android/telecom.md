# Telecom

Android 系统中的 Telecom 框架主要负责管理设备上的所有通话，包括传统的基于 SIM 卡的电话和 VoIP 通话。当有来电时，Telecom 框架会处理来电显示、接听、挂断等功能，并通知相关的应用程序。

## 应用场景

- 客户端已集成 FCM 推送且后台无 app 进程存活，当客户端收到推送时，会唤醒 app 进程。如果客户端已设置了自动登录，会拉取离线消息，触发 Telecom 系统原生通话界面的唤起，确保系统级来电体验。
- 若进程在前台运行或需在后台存活，即时通讯 IM SDK 正常收发消息时，通话通知界面的显示会遵循以下策略：
   
| 场景 | 界面显示 |
| :------------------- | :----- | 
| 锁屏 + 有悬浮窗权限 | 使用 Telecom 系统原生通话界面。 |
| 锁屏 + 无悬浮窗权限 | 使用 Telecom 系统原生通话界面。 |
| 后台 + 无悬浮窗权限 | 使用 Telecom 系统原生通话界面。 |
| 后台 + 有悬浮窗权限 | 使用 CallKit 顶部悬浮窗。 |
| 前台 + 有悬浮窗权限 | 使用 CallKit 顶部悬浮窗。 |
| 前台 + 无悬浮窗权限 | 使用 CallKit 默认 UI 界面。 |

## 核心组件

| 组件 | 说明 |
| :--- | :--- |
| `IncomingCallService` | 用于接收 CallKit 来电请求，并将其转发给你自己的 `ConnectionService` 进行处理。在该服务中，通过 `TelecomManager.addNewIncomingCall(handle, extras)` 触发系统来电。失败或账号未启用时，通过 `CallKitClient.signalingManager.startSendEvent()` 跳转到默认来电 UI 兜底。 |
| `VoipConnectionService`（`ConnectionService`） | 充当你的 VoIP 应用与 Android 系统原生通话 UI 和逻辑之间的桥梁，唤起来电界面。系统接听/拒绝，分别调用 `signalingManager.answerCall()` / `signalingManager.refuseCall()` 并启动 CallKit 通话界面。 |  
| `PhoneAccountHelper` | VoIP 账户的注册、启用检测和设置引导。 |

## 所需权限

使用 Telecom 需要以下权限，CallKit 内部已进行了声明：

- `MANAGE_OWN_CALLS`
- `READ_PHONE_STATE`
- `CALL_PHONE`
- `USE_SIP`
- `READ_PHONE_NUMBERS`
- `FOREGROUND_SERVICE_PHONE_CALL`

## 接入指引

若使应用具备 VoIP 功能，你需要在启动 app 后创建并启用 VoIP 账户。可参考 Demo 工程的 [MainActivity#checkPhoneAccount](https://github.com/easemob/easemob-demo-android/blob/main/app/src/main/kotlin/com/hyphenate/chatdemo/MainActivity.kt) 函数实现。

1. 注册 VoIP 账户：
  
```kotlin
PhoneAccountHelper.registerPhoneAccount(context)
```

2. 引导用户启用创建的 VoIP 账户，可采用以下两种方式：
   - 以小米手机为例，点击电话拨号图标，点击右上角设置图标，选择 **高级设置 > 通话账户设置**，启用对应的 VoIP 账户。
   - 通过 `PhoneAccountHelper` 已封装好的弹窗来引导用户开启 VoIP 账户。 
  
```kotlin
  PhoneAccountHelper.showPhoneAccountEnableGuide(context) 
```

3. 启用 Telecom 前，CallKit 内部会检查 VoIP 账户的状态：
   - `status.isSupported`：设备是否支持 VoIP 功能。
   - `isRegistered`：是否已注册。
   - `isEnabled`：是否已开启。
   
```kotlin
val status = PhoneAccountHelper.getPhoneAccountStatus(context)
```
