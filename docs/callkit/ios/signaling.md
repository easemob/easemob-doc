
# 音视频通话信令交互逻辑

## 信令概述

本系统使用即时通讯 IM 消息作为信令载体，通过消息扩展字段（`ext`）传递通话控制信息。

### 核心信令

| 信令类型 | Action 标识 | 发送方 | 接收方 | 描述 |  发送信令消息规则   |
| :---------------- | :----- | :----- | :----- | :----- | :----- |
| 通话邀请信令 | `CALL_INVITE` | 主叫 | 被叫 | 发起通话邀请，包含：<br/> - `callId`: 通话唯一标识。 <br/> - `channelName`：声网 RTC 频道名称。 <br/> - `callType`：`CallTypeAudio` 为音频通话，`CallTypeVideo` 为视频通话，`CallTypeGroup`为群组通话。<br/> - `callerDevId`：主叫设备 ID。<br/>对于群聊通话，该信令还包含以下参数：<br/> - `groupId`：群组 ID。 <br/> - `receiverList`：接收通话邀请的目标用户。|   一对一通话：使用普通文本消息，支持离线推送。 <br/> 群组通话：使用定向文本消息，设置 `chatType = .groupChat`，`receiverList` 指定接收者，支持离线推送   |
| 响应信令 | `CALL_ALERT` | 被叫 | 主叫 | 通知主叫已收到邀请，包含：<br/> - `callId`：对应的通话 ID。<br/> - `calleeDevId`：被叫设备 ID。 |  使用 CMD 消息，设置 `deliverOnlineOnly = true`，表示仅在线用户能收到，不存储。  |
| 确认振铃信令 | `CALL_CONFIRM_RING` | 主叫 | 被叫 | 确认被叫可以开始振铃，包含呼叫状态 `callStatus`：<br/> - `1` 为呼叫有效<br/> - `0` 为呼叫无效 |  使用 CMD 消息，设置 `deliverOnlineOnly = false`。   |
| 应答信令 | `CALL_ANSWER` | 被叫 | 主叫 | 通知主叫是否接听，包含 `callResult` 参数： `accept`：接听`refuse` 拒绝`busy`：忙碌 |  使用 CMD 消息，设置 `deliverOnlineOnly = true`，表示仅在线用户能收到，不存储。  |
| 确认被叫信令 | `CALL_CONFIRM_CALLEE` | 主叫 | 被叫 | 确认被叫设备和状态，包含：<br/> - `calleeDeviceId`：被叫设备标识<br/> -  `callResult`：通知主叫是否接听，详见应答信令中的描述。| 使用 CMD 消息，设置 `deliverOnlineOnly = false`。 |
| 取消呼叫信令 | `CALL_CANCEL` | 主叫 | 被叫 | 主叫取消呼叫。 |  使用 CMD 消息，设置 `deliverOnlineOnly = false`，便于久不上线的用户收到离线消息做判断。  |
| 退出通话信令 | `CALL_END` | 任意一方 | 通话双方 | 退出通话。 |  使用 CMD 消息，设置 `deliverOnlineOnly = true`。  |

### 信令特点

| 信令特点 | 描述 | 
| :---------------- | :----- |
| 信令可靠性 | <br/> - 关键信令（邀请）使用普通文本消息<br/> - 实时信令使用 CMD 消息，降低延迟。  |
| 状态机管理 | <br/> - 每个信令对应状态转换。<br/> - 非法状态转换直接忽略。  |
| 超时保护 | <br/> - 多级超时机制。<br/> - 超时后自动清理资源。  |
| 扩展性设计 | <br/> - `ext` 字段支持自定义扩展。<br/> - 群组呼叫信令支持动态成员，用户可随时加人或退出通话。 |

## 一对一通话信令交互流程

### 完整通话信令流程

<img src="/images/callkit/ios/signaling_entire.png" >

### 主叫取消流程

<img src="/images/callkit/ios/signaling_cancel_caller.png" >

### 被叫忙碌流程

<img src="/images/callkit/ios/signaling_busy_callee.png" >

## 群组通话信令交互流程

群组通话信令特点如下：

1. 批量发送: 一条消息发给多个接收方。
2. 独立响应: 每个被叫独立处理和响应。
3. 动态邀请: 支持通话中继续邀请新成员。

<img src="/images/callkit/ios/signaling_group.png" >

## 信令时序控制

| 信令交互 | 预期响应时间 | 超时处理 |
| :---------------- | :----- | :----------------- |
| CALL_INVITE → CALL_ALERT | 30 秒内 |  |
| CALL_ALERT → CALL_CONFIRM_RING | 10 秒内 | 主叫快速判断并响应。 |
| CALL_CONFIRM_RING → CALL_ANSWER | 30 秒内 | 被叫振铃超时，自动结束。 |
| CALL_ANSWER → CALL_CONFIRM_CALLEE | 10 秒内 | 主叫快速确认被叫设备以及状态。 |
| 整体呼叫流程 | 30 秒 | 主叫等待超时，自动取消呼叫。被叫超时不接，同样自动取消。 |

## 多设备场景

被叫方使用同一账号登录多个设备，信令中通过主叫或被叫的设备 ID（`callerDevId` 和 `calleeDevId`）区分，只有指定的设备处理信令，其他设备收到后忽略或显示类似 “已在其他设备处理” 等提示。

```swift
// 判断是否本设备
if calleeDevId == currentDeviceId {
    // 本设备处理
    processCall()
} else {
    // 其他设备处理
    showMessage("已在其他设备处理")
    dismissUI()
}
```

## 异常处理

### 信令丢失处理

| 信令丢失场景 | 处理方式 |
| :---------------- | :----- |
| CALL_ALERT 信令丢失 | 30 秒后主叫端超时，用户可以点击重新发起呼叫。 |
| CALL_CONFIRM_RING 信令丢失 | 被叫等待 10 秒后结束呼叫流程。 |
| CALL_ANSWER 信令丢失 | 主叫 30 秒超时，发送取消呼叫信令。 |
| CALL_CONFIRM_CALLEE 信令丢失 | 被叫 10 秒超时，主动结束通话。 |

### 信令冲突处理

| 信令冲突场景 | 处理方式 |
| :---------------- | :----- |
| 重复邀请 | 检查 `callId`，相同则忽略。   |
| 并发呼叫 | 返回忙碌 `busy`，保持当前通话。   |
| 呼叫状态不一致 | 以最新信令为准，更新本地呼叫状态：空闲、拨号中、振铃中、应答中。   |

