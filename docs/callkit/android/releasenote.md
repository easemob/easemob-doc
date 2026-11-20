# Android CallKit 更新日志

## v5.1.0

该版本在 2026 年 9 月 18 日发布。

#### 新增功能

**新增外部注入环信 ID 与 Agora UID 映射的接口**：`RTCConfigProvider` 新增 `onAsyncFetchUserIdByUid(uids, callback)`（及挂起函数扩展 `getUserIdsByUids()`），应用可自行提供 Agora UID 到环信用户 ID 的映射；返回 `null` 或映射缺失时自动回退到 SDK 查询。

#### 优化

- **RTC 引擎创建与销毁安全防护**：新引擎创建前会等待上一次通话的引擎销毁完成，避免旧引擎尚未释放摄像头等资源时新引擎 `startPreview` 采集失败，导致偶现远端无画面的问题（`RtcManager`）。
- **Telecom 接听兼容性优化**：Android 10 及以上版本严格限制后台启动 Activity，使用 Telecom（系统通话 UI）接听后，若应用不在前台且未授予悬浮窗权限，改为发送带 `fullScreenIntent` 的通话通知拉起通话界面（锁屏或灭屏自动全屏弹出，亮屏显示为顶部横幅，点击进入通话），避免拉不起页面且无任何展示的问题（`CallForegroundService`）。

#### 修复

- 修复一对一通话中不显示对方已读图标的问题：单聊通话邀请信令消息补充 `setIsNeedReadReceipt(true)`，适配 SDK 5.0 按消息控制的已读回执机制（`SignalingManager`）。
- 发送全屏通话通知前增加 `POST_NOTIFICATIONS` 通知权限检查，未授权时跳过并记录日志，避免异常。

## v5.0.0

该版本在 2026 年 8 月 12 日发布。

本版本为 IM SDK 5.0.0 适配版本，CallKit 自身无功能与行为变化。

#### API 变更

**类型别名清理**：删除 `ChatGroupStyle`（`EMGroupStyle`）、`ChatGroupOptions`（`EMGroupOptions`）和 `ChatGroupReadAck`（`EMGroupReadAck`）。这些类型别名对应的 SDK 类已在 SDK 5.0.0 中删除，CallKit 内部未使用这些类型别名。

## v4.22.0

修改了 `CallAction.CALL_END` 信令的投递逻辑：由“仅面向在线用户投递”变更为“面向全体用户投递”。

## v4.19.1

该版本在 2026 年 3 月 11 日发布。

#### 优化

- 优化 Telecom 来电流程，修复特定机型通话页面拉起失败、接听后页面未跳转等问题。
- 优化静音模式下与第三方音乐的协同处理，修复来电、来电无应答（振铃超时）等场景下音乐暂停/恢复异常的问题。
- 调整音乐焦点申请与释放策略，降低部分机型上嗡鸣、停顿等音频冲突问题。
- 增强来电通知处理，支持通知点击跳转通话页面，提升后台来电场景可达性。

#### 修复

- 修复前台服务通知残留等问题，提升整体稳定性。

## v4.19.0

该版本在 2026 年 2 月 4 日发布。

#### 新增特性

- 新增 `RtcConfigProvider` 接口，用于灵活配置 RTC 参数。
- 新增 `CallKitConfig#getDisableRTCTokenValidation` 开关，支持控制是否禁用 RTC Token 验证。

#### 优化

- RTC 依赖升级并迁移至声网 SDK（cn.shengwang.rtc:lite-sdk:4.6.0）。
- 优化多方呼叫逻辑：双方同时呼叫第三方时，后发起方会收到“对方正忙”提示。
- 移除 `READ_PHONE_NUMBERS` 权限，提升隐私合规性。
- 优化获取 App ID 的流程，并完善 App ID 为空时的异常处理。

#### 修复

- 修复群组通话中， 取消信令失败会导致异常退出通话的问题。
- 修复同时发起呼叫时，`callInfo` 被错误覆盖的问题。

## v4.18.1 

该版本在 2025 年 11 月 6 日发布。

#### 优化

- 群组通话来电页面中视频开关可控制预览。
- 移除一对一视频时对方是否静音的状态图标的展示。

#### 修复

- 修复多人通话界面自己说话状态图标不展示问题。
- 修复通话页面回到后台时，麦克风自动解禁的问题。

## v4.18.0

该版本在 2025 年 10 月 31 日发布。

修复用户 RTC 相关状态未重置问题。

## v4.16.4

该版本在 2026 年 9 月 1 日发布。

本版本基于 CallKit v4.24.0 主线代码，搭配 IM SDK 4.16.4 版本线发布（依赖 `io.hyphenate:hyphenate-chat:4.16.4`），CallKit 功能与 v4.24.0 保持一致，并新增以下能力：

**新增外部注入环信 ID 与 Agora UID 映射的接口**:`RTCConfigProvider` 新增 `onAsyncFetchUserIdByUid(uids, callback)`（及挂起函数扩展 `getUserIdsByUids()`），应用可自行提供 Agora UID 到环信用户 ID 的映射；返回 `null` 或映射中缺少对应 UID 时，自动回退到 SDK 查询（`asyncGetUserIdsWithRTCUids`）。通话中解析对端身份时优先使用该映射。

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