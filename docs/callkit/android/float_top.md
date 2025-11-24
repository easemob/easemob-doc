# 来电通知和悬浮窗

要展示来电通知栏和悬浮窗，需要用户授予悬浮窗权限（`android.permission.SYSTEM_ALERT_WINDOW`）。
- 来电通知栏:主要包括接听和拒绝按钮。
- 悬浮窗：位于屏幕右上角。在视频通话时，小悬浮窗展示对方的视频画面或者图像，音频通话时展示计时器。

## 来电通知栏

来电时（`SignalingManager` 收到有效来电确认后），CallKit 首先播放来电铃声，然后按以下方式展示通话界面：

- 若应用处于前台或处于后台且有悬浮窗权限，显示来电通知栏 `IncomingCallTopWindow.showIncomingCallTopWindow()`。
- 若设备处于锁屏（无论有或无悬浮窗权限），或者 App 在后台且无悬浮窗权限，使用系统来电界面 `TelecomHelper.startCallImmediately(...)`。
- 若应用处于前台且无悬浮窗权限，直接启动通话 Activity，使用 CallKit 默认 UI 界面。

<ImageGallery :columns="3">
  <ImageItem src="/images/callkit/android/1v1_video_notification_inapp.png" title="一对一视频通话来电通知" />
  <ImageItem src="/images/callkit/android/1v1_voice_notification_inapp.png" title="一对一语音通话来电通知" />
  <ImageItem src="/images/callkit/android/group_call_notification_inapp.png" title="群组通话来电通知" />
</ImageGallery>

## 悬浮窗

若申请了悬浮窗权限，悬浮窗的展示如下：

- 应用在前台进入后台，展示悬浮窗。
- 应用在前台点击悬浮窗按钮，展示悬浮窗。
- 应用后台回到前台，隐藏悬浮窗。

<ImageGallery :columns="3">
  <ImageItem src="/images/callkit/android/1v1_video_float.png" title="一对一视频通话悬浮窗" />
  <ImageItem src="/images/callkit/android/1v1_voice_float.png" title="一对一音频通话悬浮窗" />
  <ImageItem src="/images/callkit/android/group_call_float.png" title="群组通话悬浮窗" />
</ImageGallery>

## 相关 API

- 来电通知栏
  
  `showIncomingCallTopWindow()`：展示来电通知栏。

  `hideIncomingCallTopWindow()`：隐藏来电通知栏。

- 悬浮窗

  `showFloatWindow()`：展示悬浮窗。

  `hideFloatWindow()`：隐藏悬浮窗。
   
  `isFloatWindowShowing()`：悬浮窗是否在展示。
  
