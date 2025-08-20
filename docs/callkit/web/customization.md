
# 自定义资源

// TODO：按照 Android 的大致架构调整一下：

## 修改 UI 配置项

### 布局配置

```tsx
<CallKit
  // 视频窗口宽高比
  aspectRatio={16 / 9}
  // 窗口间距
  gap={8}
  // 最大显示视频数量
  maxVideos={12}
  // 背景图片
  backgroundImage="https://example.com/background.jpg"
/>
```

### 窗口管理配置

```tsx
<CallKit
  // 可调整大小
  resizable={true}
  minWidth={400}
  minHeight={300}
  maxWidth={1200}
  maxHeight={800}
  onResize={(width, height) => console.log('窗口尺寸:', width, height)}
  // 可拖拽
  draggable={true}
  onDragStart={() => console.log('开始拖拽')}
  onDrag={position => console.log('拖拽位置:', position)}
  onDragEnd={() => console.log('拖拽结束')}
  // 内置位置管理
  managedPosition={true}
  initialPosition={{ left: 100, top: 100 }}
  initialSize={{ width: 800, height: 600 }}
  // 最小化
  minimizedSize={{ width: 120, height: 80 }} // 群组通话最小化的尺寸
  onMinimizedChange={minimized => console.log('最小化状态:', minimized)}
/>
```

### 自定义通话背景

```tsx
// 预设背景选项
const backgroundOptions = [
  {
    id: 0,
    name: '默认背景',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  },
  // 更多背景选项...
];

// 应用背景
<CallKit
  backgroundImage={backgroundOptions[selectedBackground].url}
  // 其他配置...
/>;
```

### 邀请配置

```tsx
<CallKit
  // 自定义邀请内容
  invitationCustomContent={<CustomInvitationComponent />}
  // 邀请界面显示配置
  showInvitationAvatar={true}
  autoRejectTime={30} // 30秒自动拒绝
/>
```

### 铃声配置

```tsx
<CallKit
  // 呼出铃声
  outgoingRingtoneSrc="/sounds/outgoing.mp3"
  // 来电铃声
  incomingRingtoneSrc="/sounds/incoming.mp3"
  // 启用铃声
  enableRingtone={true}
  // 铃声音量 (0-1)
  ringtoneVolume={0.8}
  // 循环播放
  ringtoneLoop={true}
/>
```

### 音量指示器

```tsx
<CallKit
  // 音量阈值（说话检测 0-100，默认为 60）
  speakingVolumeThreshold={60}
/>
```

### 自定义图标

```tsx
const customIcons = {
  controls: {
    micOn: <CustomMicOnIcon />,
    micOff: <CustomMicOffIcon />,
    cameraOn: <CustomCameraOnIcon />,
    cameraOff: <CustomCameraOffIcon />,
    speakerOn: <CustomSpeakerOnIcon />,
    speakerOff: <CustomSpeakerOffIcon />,
    hangup: <CustomHangupIcon />,
    accept: <CustomAcceptIcon />,
    reject: <CustomRejectIcon />,
  },
  header: {
    minimize: <CustomMinimizeIcon />,
    fullscreen: <CustomFullscreenIcon />,
    exitFullscreen: <CustomExitFullscreenIcon />,
    addParticipant: <CustomAddIcon />,
  },
};

<CallKit customIcons={customIcons} />;
```


