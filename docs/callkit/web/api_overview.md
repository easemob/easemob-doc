# API 概览

本文档详细介绍 CallKit 组件的所有属性、方法和回调事件。

## 组件属性 (Props)

### 基础配置

| 属性              | 类型                  | 默认值        | 描述                                                 |
| ----------------- | --------------------- | ------------- | ---------------------------------------------------- |
| `className`       | `string`              | -             | 自定义 CSS 类名                                      |
| `style`           | `React.CSSProperties` | -             | 自定义内联样式                                       |
| `prefix`          | `string`              | `cui`         | CSS 类名前缀                                         |
| `chatClient`      | `ChatSDK.Connection`  | -             | **必须**，环信 IM SDK 实例                           |
| `layoutMode`      | `LayoutMode`          | `MULTI_PARTY` | 布局模式：`PREVIEW` \| `ONE_TO_ONE` \| `MULTI_PARTY` |
| `maxVideos`       | `number`              | `16`          | 最大显示视频数量                                     |
| `aspectRatio`     | `number`              | `1`           | 视频窗口宽高比                                       |
| `gap`             | `number`              | `6`           | 视频窗口间隙（像素）                                 |
| `backgroundImage` | `string`              | -             | 多人通话背景图片 URL                                 |
| `userSelectTitle` | `string`              | -             | 用户选择弹窗标题                                     |

### 铃声配置

| 属性                  | 类型      | 默认值 | 描述                     |
| --------------------- | --------- | ------ | ------------------------ |
| `enableRingtone`      | `boolean` | `true` | 是否启用铃声             |
| `outgoingRingtoneSrc` | `string`  | -      | 拨打电话铃声音频文件路径 |
| `incomingRingtoneSrc` | `string`  | -      | 接听电话铃声音频文件路径 |
| `ringtoneVolume`      | `number`  | `0.8`  | 铃声音量，范围 0-1       |
| `ringtoneLoop`        | `boolean` | `true` | 是否循环播放铃声         |

### 窗口大小和位置

| 属性              | 类型                              | 默认值                      | 描述                 |
| ----------------- | --------------------------------- | --------------------------- | -------------------- |
| `resizable`       | `boolean`                         | `false`                     | 是否允许调整大小     |
| `minWidth`        | `number`                          | `400`                       | 最小宽度（像素）     |
| `minHeight`       | `number`                          | `300`                       | 最小高度（像素）     |
| `maxWidth`        | `number`                          | -                           | 最大宽度（像素）     |
| `maxHeight`       | `number`                          | -                           | 最大高度（像素）     |
| `draggable`       | `boolean`                         | `true`                      | 是否允许拖拽         |
| `dragHandle`      | `string`                          | -                           | 拖拽手柄 CSS 选择器  |
| `managedPosition` | `boolean`                         | `true`                      | 是否使用内置位置管理 |
| `initialPosition` | `{left: number, top: number}`     | -                           | 初始位置             |
| `initialSize`     | `{width: number, height: number}` | `{width: 748, height: 523}` | 初始大小             |
| `minimizedSize`   | `{width: number, height: number}` | `{width: 80, height: 64}`   | 最小化时的尺寸       |

### 邀请界面配置

| 属性                      | 类型              | 默认值 | 描述               |
| ------------------------- | ----------------- | ------ | ------------------ |
| `invitationCustomContent` | `React.ReactNode` | -      | 自定义邀请内容     |
| `acceptText`              | `string`          | -      | 接听按钮文本       |
| `rejectText`              | `string`          | -      | 拒绝按钮文本       |
| `showInvitationAvatar`    | `boolean`         | `true` | 是否显示邀请者头像 |
| `showInvitationTimer`     | `boolean`         | `true` | 是否显示倒计时     |
| `autoRejectTime`          | `number`          | `30`   | 自动拒绝时间（秒） |

### 信息提供者

| 属性                | 类型                                           | 默认值 | 描述               |
| ------------------- | ---------------------------------------------- | ------ | ------------------ |
| `userInfoProvider`  | `(userIds: string[]) => Promise<UserInfo[]>`   | -      | 用户信息提供者函数 |
| `groupInfoProvider` | `(groupIds: string[]) => Promise<GroupInfo[]>` | -      | 群组信息提供者函数 |

### 其他配置

| 属性                      | 类型             | 默认值 | 描述                           |
| ------------------------- | ---------------- | ------ | ------------------------------ |
| `speakingVolumeThreshold` | `number`         | `60`   | 说话指示器音量阈值，范围 1-100 |
| `customIcons`             | `CallKitIconMap` | -      | 自定义图标映射                 |

## 组件方法 (Methods)

通过 `ref` 调用以下方法：

```tsx
const callKitRef = useRef<CallKitRef>(null);
```

### 通话控制方法

| 方法              | 参数                                                        | 返回值                                 | 描述             |
| ----------------- | ----------------------------------------------------------- | -------------------------------------- | ---------------- |
| `startSingleCall` | `{to: string, callType: 'video'\|'audio', msg: string}`     | `Promise<ChatSDK.TextMsgBody \| null>` | 发起一对一通话   |
| `startGroupCall`  | `{groupId: string, msg: string, ext?: Record<string, any>}` | `Promise<ChatSDK.TextMsgBody \| null>` | 发起群组通话     |
| `answerCall`      | `result: boolean`                                           | `void`                                 | 接听/拒绝通话    |
| `exitCall`        | `reason?: string`                                           | `void`                                 | 退出通话         |
| `adjustSize`      | `newSize: {width: number, height: number}`                  | `void`                                 | 动态调整窗口尺寸 |

## 回调事件 (Callbacks)

### 通话状态回调

| 回调事件              | 参数                                                             | 返回值 | 触发时机                 |
| --------------------- | ---------------------------------------------------------------- | ------ | ------------------------ |
| `onCallStart`         | `videos: VideoWindowProps[]`                                     | `void` | 通话开始时               |
| `onEndCallWithReason` | `reason: string, callInfo: CallInfo`                             | `void` | 通话结束时（带详细原因） |
| `onReceivedCall`      | `callType: 'video'\|'audio'\|'group', userId: string, ext?: any` | `void` | 收到通话邀请时           |
| `onCallError`         | `error: CallError`                                               | `void` | 通话过程中发生错误时     |

### 用户状态回调

| 回调事件             | 参数                                                  | 返回值 | 触发时机           |
| -------------------- | ----------------------------------------------------- | ------ | ------------------ |
| `onRemoteUserJoined` | `userId: string, callType: 'video'\|'audio'\|'group'` | `void` | 远程用户加入通话时 |
| `onRemoteUserLeft`   | `userId: string, callType: 'video'\|'audio'\|'group'` | `void` | 远程用户离开通话时 |

### 邀请处理回调

| 回调事件             | 参数                         | 返回值 | 触发时机       |
| -------------------- | ---------------------------- | ------ | -------------- |
| `onInvitationAccept` | `invitation: InvitationInfo` | `void` | 用户接受邀请时 |
| `onInvitationReject` | `invitation: InvitationInfo` | `void` | 用户拒绝邀请时 |

### 界面状态回调

| 回调事件             | 参数                           | 返回值 | 触发时机         |
| -------------------- | ------------------------------ | ------ | ---------------- |
| `onLayoutModeChange` | `layoutMode: 'grid' \| 'main'` | `void` | 布局模式变化时   |
| `onMinimizedChange`  | `minimized: boolean`           | `void` | 最小化状态变化时 |
| `onMinimizedToggle`  | -                              | `void` | 最小化切换时     |

### 窗口操作回调

| 回调事件      | 参数                                                                                  | 返回值 | 触发时机       |
| ------------- | ------------------------------------------------------------------------------------- | ------ | -------------- |
| `onResize`    | `width: number, height: number, deltaX?: number, deltaY?: number, direction?: string` | `void` | 窗口大小调整时 |
| `onDragStart` | `startPosition: {x: number, y: number}`                                               | `void` | 开始拖拽时     |
| `onDrag`      | `newPosition: {x: number, y: number}, delta: {x: number, y: number}`                  | `void` | 拖拽过程中     |
| `onDragEnd`   | `finalPosition: {x: number, y: number}`                                               | `void` | 拖拽结束时     |

### 技术回调

| 回调事件             | 参数       | 返回值 | 触发时机           |
| -------------------- | ---------- | ------ | ------------------ |
| `onRtcEngineCreated` | `rtc: any` | `void` | RTC 引擎创建完成时 |

## 类型定义

### UserInfo

```tsx
interface UserInfo {
  userId: string;
  nickname?: string;
  avatarUrl?: string;
}
```

### GroupInfo

```tsx
interface GroupInfo {
  groupId: string;
  groupName?: string;
  groupAvatar?: string;
}
```

### CallError

```tsx
interface CallError {
  errorType: "callkit" | "rtc" | "chat";
  message: string;
  code?: string;
}
```
