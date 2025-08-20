 # 悬浮窗 
- CallKit内部包含顶部来电悬浮窗和通话状态时展示在屏幕右上角的小悬浮窗。顶部来电悬浮窗主要包括接听和拒绝按钮。屏幕右上角的小悬浮窗在视频通话时，展示的是对方的视频画面或者图像，在音频通话时展示的是计时器。悬浮窗的展示需要用户授予悬浮窗权限。
- **来电展示**（`SignalingManager` 在收到有效来电确认后）：
  - 若设备处于锁屏，或 App 在后台且无悬浮窗权限 → 走系统来电界面（`TelecomHelper.startCallImmediately(...)`）
  - 否则：
    - 播放来电铃声：`AudioController.playRing(INCOMING)`
    - 有悬浮窗权限 → 显示顶部来电悬浮窗：`IncomingCallTopWindow.showIncomingCallTopWindow()`
    - 无悬浮窗权限 → 直接启动通话 Activity,弹出来电界面

- **回到后台/前台/点击悬浮窗按钮**
  - 会根据权限申请结果决定是否展示小悬浮

- **悬浮窗相关 API**
  - 小窗：`showFloatWindow()` / `hideFloatWindow()` / `isFloatWindowShowing()`
  - 顶部来电条：`showIncomingCallTopWindow()` / `hideIncomingCallTopWindow()`