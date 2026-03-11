# API 参考 

## 主要方法

`CallKitClient` 中的主要方法如下表所示：

| 方法 | 描述 | 参数 |
| :------------------- | :----- | :-------------------------------------------- |
| `init(context, config)` | 初始化 CallKit |- `context`: 上下文<br/> - `config`: 配置对象 |
| `startSingleCall(type, userId, ext)` | 发起一对一通话 | - `type`: 通话类型<br/> - `userId`: 对方用户 ID<br/> - `ext`: 扩展信息 |
| `startGroupCall(groupId, ext)` | 发起群组通话 | - `groupId`: 群组 ID<br/> - `ext`: 扩展信息 |
| `endCall()` | 结束通话 | 无 |
| `getCache()` | 获取缓存管理器 | 无 |

## 通话类型

通话类型 `CallType` 如下表所示：

| 类型 | 描述 |
| :------------------- | :----- |
| `SINGLE_VIDEO_CALL` | 一对一视频通话 |
| `SINGLE_VOICE_CALL` | 一对一语音通话 |
| `GROUP_CALL` | 群组通话 |

## 通话结束原因 

通话结束原因 `CallEndReason` 如下表所示：

| 原因 | 描述 |
| :------------------- | :----- |
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
| :------------------- | :----- | :---------- |
| `onEndCallWithReason(reason, callInfo)` | 通话结束回调 | - `reason`: 结束原因<br/> - `callInfo`: 通话信息 |
| `onCallError(errorType, errorCode, description)` | 通话错误回调 | - `errorType`: 错误类型<br/> - `errorCode`: 错误码<br/> - `description`: 错误描述 |
| `onReceivedCall(userId, callType, ext)` | 收到通话邀请 | - `userId`: 邀请方的用户 ID<br> - `callType`: 通话类型<br> - `ext`: 扩展信息 |
| `onRemoteUserJoined(userId, callType, channelName)` | 远端用户加入 | - `userId`: 用户 ID<br> - `callType`: 通话类型<br> - `channelName`: 频道名称 |
| `onRemoteUserLeft(userId, callType, channelName)` | 远端用户离开 | - `userId`: 用户ID<br> - `callType`: 通话类型<br> - `channelName`: 频道名称 |
| `onRtcEngineCreated(engine)` | RTC 引擎创建 | `engine`: RTC 引擎实例 |

## 错误类型

### 通话错误类型

`CallErrorType` 类中提供三类通话错误类型：

| 通话错误类型 | 描述 |
| :------------------- | :----- |
| `BUSINESS_ERROR`  | 业务逻辑异常。 |
| `RTC_ERROR`  | 音视频异常，详见 [声网 RTC 错误码](https://doc.shengwang.cn/doc/rtc/android/error-code)。 |
| `IM_ERROR`  | 即时通讯 IM 异常，详见 [环信即时通讯 IM 错误码](/document/android/error.html)  |

### 业务错误类型

`CALL_BUSINESS_ERROR` 类中提供三类业务错误类型：

| 业务错误类型 | 描述 |
| :------------------- | :----- |
| `CALL_STATE_BUSY_ERROR` | 通话状态错误: 调用呼叫 API 时，当前设备不处于空闲状态。|
| `CALL_PARAM_ERROR`  | 参数错误：主要为呼叫 API 调用参数错误为空等。 |
| `CALL_SIGNALING_ERROR` | 信令错误：大多为信令回复的方法中某些参数错误，例如，对方发的信令里缺少某种参数。  |

### 获取日志

- 日志 TAG 中包含 `Callkit` 字段的所有内容均为 CallKit 日志。你可以通过查看日志进行代码问题排查。关于如何获取日志，详见 [环信即时通讯 IM 文档](/document/android/log.html)。
- 线上获取 SDK 日志，需要设备在登录状态下联系环信技术支持。技术支持获取到线上设备的日志，排查线上用户的问题。