# API 参考 

## CallKitClient 主要方法

| 方法 | 说明 | 参数 |
|------|------|------|
| `init(context, config)` | 初始化 CallKit |- `context`: 上下文<br/> - `config`: 配置对象 |
| `startSingleCall(type, userId, ext)` | 发起一对一通话 | - `type`: 通话类型<br/> - `userId`: 对方用户 ID<br/> - `ext`: 扩展信息 |
| `startGroupCall(groupId, ext)` | 发起群组通话 | - `groupId`: 群组 ID<br/> - `ext`: 扩展信息 |
| `endCall()` | 结束通话 | 无 |
| `getCache()` | 获取缓存管理器 | 无 |
| `cleanUp()` | 清理资源 | 无 |

## CallType 通话类型

| 类型 | 说明 |
|------|------|
| `SINGLE_VIDEO_CALL` | 一对一视频通话 |
| `SINGLE_VOICE_CALL` | 一对一语音通话 |
| `GROUP_CALL` | 群组通话 |

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
| `onEndCallWithReason(reason, callInfo)` | 通话结束回调 | - `reason`: 结束原因<br/> - `callInfo`: 通话信息 |
| `onCallError(errorType, errorCode, description)` | 通话错误回调 | - `errorType`: 错误类型<br/> - `errorCode`: 错误码<br/> - `description`: 错误描述 |
| `onReceivedCall(userId, callType, ext)` | 收到通话邀请 | - `userId`: 邀请方的用户 ID<br> - `callType`: 通话类型<br> - `ext`: 扩展信息 |
| `onRemoteUserJoined(userId, callType, channelName)` | 远端用户加入 | - `userId`: 用户 ID<br> - `callType`: 通话类型<br> - `channelName`: 频道名称 |
| `onRemoteUserLeft(userId, callType, channelName)` | 远端用户离开 | - `userId`: 用户ID<br> - `callType`: 通话类型<br> - `channelName`: 频道名称 |
| `onRtcEngineCreated(engine)` | RTC 引擎创建 | `engine`: RTC 引擎实例 |
