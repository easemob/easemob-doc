
# API 参考 

## CallKitManager 主要方法

| 方法 | 说明 | 参数 |
|------|------|------|
| `setup(_ config)` | 初始化 CallKit | - `config`: 配置对象 |
| `call(userId, type, extensionInfo)` | 发起一对一通话 | - `type`: 通话类型<br/> - `userId`: 对方用户 ID<br/> - `extensionInfo`: 扩展信息(可选) |
| `groupCall(groupId, extensionInfo)` | 发起群组通话 | - `groupId`: 群组 ID<br/> - `extensionInfo`: 扩展信息（可选） |
| `hangup()` | 结束通话 | 用户调用即可内部会自行根据状态判断 |
| `CallKitManager.shared.usersCache` | 缓存属性可读可写 | 无 |
| `cleanUserDefaults()` | 清理持久化资源token、rtc uid等 | 无 |
| `tearDown()` | 销毁CallKit释放所有资源 | 无 |
| `CallKitManager.shared.currentUserInfo` | 当前用户信息、可读写 | 无 |
| `CallKitManager.shared.callInfo` | 当前通话信息、可读写 | 无 |
| `CallKitManager.shared.profileProvider = self` | 信息提供代理 | 无 |
| `CallKitManager.shared.addListener(self)` | 监听器 | - listener: `CallServiceListener` 实现了 `CallServiceListener` 的对象|

## CallType 通话类型

| 类型 | 说明 |
|------|------|
| `singleAudio` | 一对一视频通话 |
| `singleVideo` | 一对一语音通话 |
| `group` | 群组通话 |

## CallEndReason 通话结束原因

| 原因 | 说明 |
|------|------|
| `CallEndReasonHangup` | 正常挂断 |
| `CallEndReasonCancel` | 本地用户取消通话 |
| `CallEndReasonRemoteCancel` | 对方取消通话 |
| `CallEndReasonRefuse` | 本地用户拒绝接听 |
| `CallEndReasonRemoteRefuse` | 对方拒绝接听 |
| `CallEndReasonBusy` | 忙线中 |
| `CallEndReasonNoResponse` | 本地用户无响应 |
| `CallEndReasonRemoteNoResponse` | 对方无响应 |
| `CallEndReasonHandleOnOtherDevice` | 在其他设备接听 |
| `CallEndReasonRemoteDrop` | 通话中断 |

## CallKitListener 监听方法

**所有回调方法都不在主线程执行，需要使用 `runOnUiThread` 来更新 UI。**

| 方法 | 描述 | 参数 |
|------|------|------|
| `@objc optional func didUpdateCallEndReason(reason: CallEndReason,info: CallInfo)` | 通话结束回调 | - `reason`: 结束原因<br/> - `callInfo`: 通话信息 |
| `@objc optional func didOccurError(error: CallError)` | 通话错误回调 | - `error`: 错误对象 <br/>  |
| `@objc optional func onReceivedCall(callType: CallType, userId: String, extensionInfo: [String:Any]?)` | 收到通话邀请 | - `userId`: 邀请方的用户 ID<br> - `callType`: 通话类型<br> - `extensionInfo`: 扩展信息 |
| `@objc optional func remoteUserDidJoined(userId: String, channelName: String, type: CallType)` | 远端用户加入 | - `userId`: 用户 ID<br> - `callType`: 通话类型<br> - `channelName`: 频道名称 |
| `@objc optional func remoteUserDidLeft(userId: String, channelName: String, type: CallType)` | 远端用户离开 | - `userId`: 用户ID<br> - `callType`: 通话类型<br> - `channelName`: 频道名称 |
| `@objc optional func onRtcEngineCreated(engine: AgoraRtcEngineKit?)` | RTC 引擎创建 | `engine`: RTC 引擎实例 |

