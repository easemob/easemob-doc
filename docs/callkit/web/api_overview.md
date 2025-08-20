# API 方法 

// TODO：按照 Android 的大致架构调整一下：

通过 ref 可以调用以下方法：

## 通话控制

```tsx
const callKitRef = useRef<CallKitRef>(null);

// 发起一对一通话
callKitRef.current?.startSingleCall({
  to: string,
  callType: 'video' | 'audio',
  msg: string,
  ext?: Record<string, any>
});

// 发起群组通话
callKitRef.current?.startGroupCall({
  groupId: string,
  msg: string,
  ext?: Record<string, any>
});

// 挂断通话
callKitRef.current?.exitCall(reason?: string);

// 接听/拒绝通话
callKitRef.current?.answerCall(accept: boolean);
```


```tsx
// 切换静音
callKitRef.current?.toggleMute();

// 切换摄像头
callKitRef.current?.toggleCamera();

// 添加参与者
callKitRef.current?.addParticipants(['user1', 'user2']);
``` 

## 窗口控制

```tsx
// 调整窗口大小
callKitRef.current?.adjustSize({ width: 800, height: 600 });

// // 显示预览
// callKitRef.current?.showPreview('video');

// // 隐藏邀请
// callKitRef.current?.hideInvitation();
```

## 事件回调

### 通话事件

```tsx
<CallKit
  // 通话开始
  onCallStart={videos => {
    console.log('通话开始，视频列表:', videos);
  }}
  // 通话结束
  onEndCallWithReason={(reason, callInfo) => {
    console.log('通话结束:', reason, callInfo);
  }}
  // 通话错误
  onCallError={error => {
    console.error('通话错误:', error);
  }}
  // 收到通话邀请
  onReceivedCall={invitation => {
    console.log('收到通话邀请:', invitation);
  }}
/>
```

### 用户事件

```tsx
<CallKit
  // 远程用户加入
  onRemoteUserJoined={userId => {
    console.log('远程用户加入:', userId);
  }}
  // 远程用户离开
  onRemoteUserLeft={userId => {
    console.log('远程用户离开:', userId);
  }}
  // 正在说话的用户变化
  onTalkingUsersChange={talkingUsers => {
    console.log('正在说话的用户:', talkingUsers);
  }}
/>
```

### 布局事件

```tsx
<CallKit
  // 布局模式变化
  onLayoutModeChange={mode => {
    console.log('布局模式变化:', mode);
  }}
/>
```

### RTC 引擎事件

```tsx
<CallKit
  // RTC 引擎创建
  onRtcEngineCreated={engine => {
    console.log('RTC引擎创建:', engine);
  }}
/>
```

## 高级功能

### 群组成员自动获取

当配置了 `chatClient` 和 `userInfoProvider` 时，CallKit 会自动获取群组成员信息：

```tsx
<CallKit
  chatClient={rootStore.client}
  userInfoProvider={userInfoProvider}
  groupInfoProvider={groupInfoProvider}
  // 手动提供群组成员（可选）
  groupMembers={[
    { userId: 'user1', nickname: '用户1', avatarUrl: 'url1' },
    { userId: 'user2', nickname: '用户2', avatarUrl: 'url2' },
  ]}
/>
```

### 用户选择配置

```tsx
<CallKit
  // 用户选择标题
  userSelectTitle="选择通话成员"
  // 群组成员（用于多人通话时选择）
  groupMembers={groupMembers}
/>
```

### 网络质量监控

```tsx
<CallKit
  // 网络质量变化回调
  onNetworkQualityChange={quality => {
    console.log('网络质量:', quality);
  }}
/>
```

### 预览模式

```tsx
// 显示预览界面
callKitRef.current?.showPreview('video');

// 预览模式回调
<CallKit
  onPreviewAccept={() => console.log('预览接受')}
  onPreviewReject={() => console.log('预览拒绝')}
/>;
``` -->
