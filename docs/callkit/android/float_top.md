 # 悬浮窗 

- **来电展示分支**（`SignalingManager` 在收到有效来电确认后）：
  - 若设备处于锁屏，或 App 在后台且无悬浮窗权限 → 走系统来电界面（`TelecomHelper.startCallImmediately(...)`）
  - 否则：
    - 播放来电铃声：`AudioController.playRing(INCOMING)`
    - 有悬浮窗权限 → 显示顶部来电条：`IncomingCallTopWindow.showIncomingCallTopWindow()`
    - 无悬浮窗权限 → 直接启动通话 Activity,弹出来电界面

- **回到后台/前台/点击悬浮窗按钮**
  - 会根据权限申请结果决定是否展示小悬浮窗

- **悬浮窗相关 API**
  - 小窗：`showFloatWindow()` / `hideFloatWindow()` / `isFloatWindowShowing()`
  - 顶部来电条：`showIncomingCallTopWindow()` / `hideIncomingCallTopWindow()`