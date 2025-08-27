# 权限与业务逻辑

## 权限声明

环信 CallKit 所需权限已在 `Manifest.xml` 文件中声明。若不需要某项功能，可根据实际情况修改。

```xml
    <!-- 联网权限 -->
    <uses-permission android:name="android.permission.INTERNET" /> 
    
    <!-- 悬浮窗权限 -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" /> 
    
    <!-- android 13+ 通知相关权限 -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" /> 
    
    <!-- 锁屏显示所需权限 -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.USE_FULL_SCREEN_INTENT" />
    <uses-permission android:name="android.permission.DISABLE_KEYGUARD" />
    
    <!-- 前台服务权限，用于后台保持通话状态 -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission
        android:name="android.permission.FOREGROUND_SERVICE_CAMERA"
        android:minSdkVersion="34" />
    <uses-permission
        android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE"
        android:minSdkVersion="34" />
    <uses-permission
        android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK"
        android:minSdkVersion="34" />

    <!-- 标准 telecom ConnectionService 所需权限 -->
    <uses-permission android:name="android.permission.MANAGE_OWN_CALLS" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.USE_SIP" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_PHONE_CALL"/>
    <uses-permission android:name="android.permission.READ_PHONE_NUMBERS"/>

    <!--  RTC 所需权限 -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.BLUETOOTH" /> 
    <!-- 对于 Android 12.0 及以上且集成 v4.1.0 以下 SDK 的设备，还需要添加以下权限 -->
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" /> 
    <!-- 对于 Android 12.0 及以上设备，还需要添加以下权限 -->
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
    
    <!-- 声明硬件特性为非必需，以支持没有电话功能的设备 -->
    <uses-feature android:name="android.hardware.telephony" android:required="false" />
    <uses-feature android:name="android.hardware.microphone" android:required="false" />
```

## 动态权限

动态权限也称为运行时权限。一些权限需要动态申请，申请逻辑位于 `BaseCallActivity#initPermissions` 函数。

例如，以下为动态权限：

- 录音：`RECORD_AUDIO`
- 摄像头：`CAMERA`
- Android 12+：`READ_PHONE_STATE`、`BLUETOOTH_CONNECT`
- Android 13+：`POST_NOTIFICATIONS`
- 申请权限被拒：逻辑统一在 `BaseCallActivity.onRequestPermissionsResult` 中。
  如果任一必要权限被拒，结束当前通话流程：
    - 主叫：发送取消信令 `SignalingManager.cancelCall(...)` ，取消通话。
    - 被叫：发送拒绝信令 `SignalingManager.refuseCall()`，拒绝接听。

<ImageGallery :columns="3">
  <ImageItem src="/images/callkit/android/notification_audio.png" title="录音权限" />
  <ImageItem src="/images/callkit/android/notification_photo_video.png" title="摄像头权限" />
  <ImageItem src="/images/callkit/android/notification_easemob.png" title="发送通知" />
  <ImageItem src="/images/callkit/android/notification_phone.png" title="拨打电话和通话管理" />
  <ImageItem src="/images/callkit/android/notification_device_info.png" title="获取设备信息" />
  <ImageItem src="/images/callkit/android/notification_device_info_near.png" title="获取附近设备信息" />
</ImageGallery>

## 悬浮窗

当用户点击悬浮窗按钮或者在通话状态时 app 回到后台，会触发悬浮窗权限检查：
- 悬浮窗权限：`SYSTEM_ALERT_WINDOW`
- 检查悬浮窗权限：`PermissionHelper.hasFloatWindowPermission(...)`
- 引导开启悬浮窗权限：`requestFloatWindowPermission(...)`
- 开启悬浮窗权限被拒：CallKit 在 `SingleCallViewModel.handleRequestFloatWindowPermissionCancel()` 会按当前 `CallState` 执行取消/拒绝/挂断的兜底。
- 悬浮窗显示时，为保证通话正常进行（即摄像头、麦克风正常采集数据流），需要开启媒体类型前台服务。
  前台服务权限为 `FOREGROUND_SERVICE`，媒体类型为 `camera` `microphone` 和 `mediaPlayback`。

申请悬浮窗权限的界面展示如下：

<ImageGallery :columns="3">
  <ImageItem src="/images/callkit/android/float_permission_apply_1.png" title="需要悬浮窗权限" />
  <ImageItem src="/images/callkit/android/float_permission_apply_2.png" title="设置应用展示在其他应用上层" />
</ImageGallery>  
  
## 锁屏唤醒 

锁屏唤醒权限：`USE_FULL_SCREEN_INTENT`、`WAKE_LOCK`、`DISABLE_KEYGUARD`。
  
若 App 在后台运行，收到来电时，app 会被唤醒，显示来电通知。

## 最佳实践

为了确保流畅的用户通话体验，需在启动 app 后就提前申请以下权限：

```Kotlin
  1. 动态权限申请
    ActivityCompat.requestPermissions(this,getRequiredPermissions(),Constant.PERMISSION_REQ_ID)

  // 获取体验实时音视频互动所需的录音、摄像头等权限
    private fun getRequiredPermissions(): Array<String> {
        var basePermission = arrayOf(
            Manifest.permission.RECORD_AUDIO,  // 录音权限
            Manifest.permission.CAMERA,  // 摄像头权限
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            basePermission += arrayOf(
                Manifest.permission.READ_PHONE_STATE,  // 读取电话状态权限
                Manifest.permission.BLUETOOTH_CONNECT, // 蓝牙连接权限
            )
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU){
            basePermission += arrayOf(
                Manifest.permission.POST_NOTIFICATIONS //通知权限
            )
        }
        return basePermission
    }
  
  2. 悬浮窗权限申请
  PermissionHelper.showPermissionExplanationDialog(
            this,
            onConfirm = {
                PermissionHelper.requestFloatWindowPermission(
                    this,
                    Constant.FLOAT_WINDOW_PERMISSION_REQUEST_CODE
                )
            },
            onCancel = {
                
            }
        )
```