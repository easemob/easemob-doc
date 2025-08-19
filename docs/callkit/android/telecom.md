# Telecom

Android 系统中的 Telecom 框架，主要负责管理设备上的所有通话，包括传统的基于 SIM 卡的电话和VoIP 通话。当有来电时，Telecom 框架会负责处理来电显示、接听、挂断等功能，并通知相关的应用程序.

## 适用场景

  - 1、客户端已集成FCM推送，后台无app进程存活。实测当客户端收到推送时，会唤醒app进程，如果客户端已设置自动登录，会拉取离线消息，触发Telecom系统原生通话界面的唤起，确保系统级来电体验。
  - 2、其他：进程需在后台存活，IM SDK正常收发消息时，会采用以下策略：
    - **锁屏 + 有悬浮窗权限**：优先使用 Telecom 系统原生通话界面

    - **锁屏 + 无悬浮窗权限**：使用 Telecom 系统原生通话界面

    - **后台 + 无悬浮窗权限**：使用 Telecom 系统原生通话界面

    - **前台 + 有悬浮窗权限**：使用 CallKit 悬浮窗

    - **解锁后**：自动切换到 CallKit 默认UI界面

## 核心组件

  - `IncomingCallService`：前台服务 → `TelecomManager.addNewIncomingCall(handle, extras)` 触发系统来电；失败或账号未启用时，兜底到默认来电 UI（`CallKitClient.signalingManager.startSendEvent()`）
  - `VoipConnectionService`（`ConnectionService`）：系统接听/拒绝 → 分别调用 `signalingManager.answerCall()` / `signalingManager.refuseCall()` 并启动callkit通话界面
  - `PhoneAccountHelper`：注册检测 `PhoneAccount`，提供“通话账户”设置页引导

## 必要权限与声明

  - 权限：`MANAGE_OWN_CALLS`、`READ_PHONE_STATE`、`CALL_PHONE`、`READ_PHONE_NUMBERS`、`FOREGROUND_SERVICE_PHONE_CALL`
  - 服务：`.telecom.IncomingCallService`、`.telecom.VoipConnectionService`（需 `android.permission.BIND_CONNECTION_SERVICE`）
  - 账户：用户需创建并启用voip账户

## 接入指引
  
  ```kotlin
  // 1. 注册 PhoneAccount（建议初始化或设置页）
PhoneAccountHelper.registerPhoneAccount(context)
  
  // 2. 引导用户启用（系统 设置 -> 通话账户）
  PhoneAccountHelper.showPhoneAccountEnableGuide(context) { enabled ->
      // 根据 enabled 做降级：未启用则使用默认来电 UI
}
  
  // 3. 运行前检查状态
  val status = PhoneAccountHelper.getPhoneAccountStatus(context)
  // status.isSupported / isRegistered / isEnabled
  ```

## 最佳实践

推荐：在一启动app后就提前将voip账户创建并启用。可参考 DEMO工程的[MainActivity#checkPhoneAccount](https://github.com/easemob/easemob-demo-android/blob/main/app/src/main/kotlin/com/hyphenate/chatdemo/MainActivity.kt)函数实现。