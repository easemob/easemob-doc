# Android CallKit 更新日志

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