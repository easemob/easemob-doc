
# API 参考 

## 主要方法

`CallKitManager` 中的主要方法如下表所示：

| 方法 | 说明 | 参数 |
| :--------- | :----- | :---------- |
| `setup(_ config)` | 初始化 CallKit | - `config`: 配置对象 |
| `call(userId, type, extensionInfo)` | 发起一对一通话 | - `type`: 通话类型<br/> - `userId`: 对方用户 ID<br/> - （可选）`extensionInfo`: 扩展信息 |
| `groupCall(groupId, extensionInfo)` | 发起群组通话 | - `groupId`: 群组 ID<br/> - （可选）`extensionInfo`: 扩展信息 |
| `hangup()` | 结束通话 | 用户调用即可内部会自行根据状态判断 |
| `CallKitManager.shared.usersCache` | 缓存属性可读可写 | 无 |
| `cleanUserDefaults()` | 清理持久化资源，例如 Token 和 RTC UID 等 | 无 |
| `tearDown()` | 销毁 CallKit 释放所有资源 | 无 |
| `CallKitManager.shared.currentUserInfo` | 当前用户信息、可读写 | 无 |
| `CallKitManager.shared.callInfo` | 当前通话信息、可读写 | 无 |
| `CallKitManager.shared.profileProvider = self` | 信息提供代理 | 无 |
| `CallKitManager.shared.addListener(self)` | 监听器 | `listener`: `CallServiceListener` 实现了 `CallServiceListener` 的对象|

## 通话类型

通话类型 `CallType` 如下表所示：

| 类型 | 说明 |
| :--------- | :----- |
| `singleAudio` | 一对一语音通话 |
| `singleVideo` | 一对一视频通话 |
| `group` | 群组通话 |

## 通话结束原因

通话结束原因 `CallEndReason` 如下表所示： 

| 原因 | 说明 |
| :--------- | :----- |
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

## 监听方法

环信 CallKit 提供 `CallKitListener` 监听通话过程。你可以设置监听器用于处理通话相关的回调。

**所有回调方法都不在主线程执行，需要使用 `runOnUiThread` 来更新 UI。**

| 方法 | 描述 | 参数 |
| :--------- | :----- | :---------- |
| `@objc optional func didUpdateCallEndReason(reason: CallEndReason,info: CallInfo)` | 通话结束回调 | - `reason`: 结束原因<br/> - `callInfo`: 通话信息 |
| `@objc optional func didOccurError(error: CallError)` | 通话错误回调 | - `error`: 错误对象 <br/>  |
| `@objc optional func onReceivedCall(callType: CallType, userId: String, extensionInfo: [String:Any]?)` | 收到通话邀请 | - `userId`: 邀请方的用户 ID<br> - `callType`: 通话类型<br> - `extensionInfo`: 扩展信息 |
| `@objc optional func remoteUserDidJoined(userId: String, channelName: String, type: CallType)` | 远端用户加入 | - `userId`: 用户 ID<br> - `callType`: 通话类型<br> - `channelName`: 频道名称 |
| `@objc optional func remoteUserDidLeft(userId: String, channelName: String, type: CallType)` | 远端用户离开 | - `userId`: 用户ID<br> - `callType`: 通话类型<br> - `channelName`: 频道名称 |
| `@objc optional func onRtcEngineCreated(engine: AgoraRtcEngineKit)` | RTC 引擎创建 | `engine`: RTC 引擎实例 |

## 错误类型

### 通话错误类型

`CallErrorModule` 类中提供三类通话错误类型：

| 通话错误类型 | 描述 |
| :--------- | :----- |
| `business`  | 业务逻辑异常。 |
| `rtc`  | 音视频异常，详见 [声网 RTC 错误码](https://doc.shengwang.cn/doc/rtc/ios/error-code)。 |
| `im`  | 即时通讯 IM 异常，详见 [环信即时通讯 IM 错误码](/document/ios/error.html)  |
| `unknown`  | 未知错误。 |

### 业务错误类型

`CallBusinessErrorCode` 类中提供四类业务错误类型：

| 业务错误类型       | 描述   | 
| :--------- | :----- | 
| `state `      | 通话状态错误：<br/> - "A call is already in progress"：当前已有通话在进行中。<br/> - "MultiCallParticipantsController is already presented"：多人通话邀请界面已展示，表示重复调用群组通话 API。<br/> - "Call already in progress with different group ID"：当前已有通话在进行中且群组 ID 不同，表示点击多人通话页面右上角时，呼叫的群组 ID 有误或者中途被其它地方改变。    | 
| `param `      | 参数错误：主要为呼叫 API 调用参数错误为空等。    | 
| `signaling`       | 信令错误：大多为信令回复的方法中某些参数错误，例如，对方发的信令里缺少某种参数。   | 
| `unknown`       | 未知错误。   | 

### 获取日志

- 日志中携带 `EaseCallKit Log:` 的所有内容均为 CallKit 日志。你可以通过查看日志进行代码问题排查。关于如何获取日志，详见 [环信即时通讯 IM 文档](/document/ios/log.html)。
- 线上获取 SDK 日志，需要设备在登录状态下联系环信技术支持。技术支持获取到线上设备的日志，排查线上用户的问题。


