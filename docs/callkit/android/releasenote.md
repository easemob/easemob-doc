# Android CallKit 更新日志

## v4.18.1 

该版本在 2026 年 11 月 6 日发布。

#### 优化

- 群组通话来电页面中视频开关可控制预览。
- 移除一对一视频时对方是否静音的状态图标的展示。

#### 修复

- 修复多人通话界面自己说话状态图标不展示问题。
- 修复通话页面回到后台时，麦克风自动解禁的问题。

## v4.18.0

该版本在 2026 年 10 月 31 日发布。

修复用户 RTC 相关状态未重置问题。

## v4.16.0

该版本在 2025 年 8 月 29 日发布。

从该版本开始，Android CallKit 源码使用 Kotlin 语言开发，代码迁移至 [GitHub 新 repo](https://github.com/easemob/easemob-callkit-android) 或 [Gitee](https://gitee.com/easemob-code/easemob-callkit-android) ，老版本不再维护。

该版本的 CallKit 主要变更如下：
1. 优化了 [单群聊音视频通话的 UI 界面](product_overview.html#界面效果)。
2. 采用 MVVM 框架设计抽离各个模块的代码，职责分离。
   功能模块主要包括：
   - `RtcManager`: 管理具体音视频
   - `SignalingManager`: 管理信令交互
   - `AudioController`: 管理铃声
   - `FloatWindow` 和 `IncomingCallTopWindow`: 管理悬浮窗
   - `CallKitCache`: 管理缓存
   - `CallKitNotifier`: 管理通知
3. 合并信令，由原来三个地方合并为一处。解决了 Activity 被回收导致信令不通问题。
4. 在应用集成了 FCM 推送的设备上，当应用进程被杀死时，支持 [使用 Telecom](telecom.html) 唤起设备，实现系统级丝滑呼叫体验。
5. [群组通话的邀请界面](integration.html#步骤-5-发起通话) 改为 CallKit 内部实现，不再需要开发者自己实现。
6. 移除 App Server 的依赖，直接由 CallKit 内部从 SDK 中获取 RTC App ID、rtcToken、UID 和 userID 映射关系等。