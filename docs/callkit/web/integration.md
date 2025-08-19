# CallKit 集成指南

本文档详细介绍如何在你的 React 项目中集成和使用环信 CallKit，实现完整的音视频通话功能。

## 功能概述

CallKit 是环信提供的一站式音视频通话解决方案，提供以下核心功能：

- **一对一语音/视频通话**：支持视频通话和语音通话。
- **群组语音/视频通话**：支持多人视频通话和语音通话。
- **丰富的控制功能**：静音、摄像头控制、扬声器控制等。
- **灵活的布局管理**：多种布局模式、可拖拽、可调整大小。
- **完善的用户体验**：来电通知、铃声、网络质量指示等。

## 推荐环境

- Node.js: 18.0 及以上
- npm: 9.0 及以上 或 yarn: 1.22 及以上
- React: 18.0 及以上
- TypeScript: 4.9 及以上
- Vite: 4.0 及以上
- 现代浏览器: Chrome/Firefox/Safari/Edge 最新版本

## 前提条件  

在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
1. [注册环信账号](/product/console/account_register.html#注册账号)。
2. [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
3. [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID。
4. [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID。将用户加入群组。
5. [开通音视频服务](product_activation.html)。

## 快速集成

## 步骤 1 安装与引入 CallKit

### 1. 安装依赖

```bash
npm install easemob-chat-uikit
# 或
yarn add easemob-chat-uikit
```

### 2. 导入样式

```tsx
import 'easemob-chat-uikit/style.css';
```

### 3. 引入 CallKit

```tsx
import React, { useRef } from 'react';
import { CallKit, Provider, rootStore } from 'easemob-chat-uikit';
import type { CallKitRef } from 'easemob-chat-uikit';
```

### 步骤 2 初始化 CallKit

// TODO：下面是 Android 的，请修改，并且添加 Web 的代码。

在应用启动时（通常在 `Application` 或主 `Activity` 中）初始化 CallKit。CallKit 初始化包括如下步骤：

1. 初始化 IM SDK。CallKit 基于即时通讯 IM 作为信令通道，因此需先初始化 IM SDK。
   - 填入你的应用的 App Key。
   - 设置即时通讯 IM SDK 中的一些选项（`EMOptions` 类），例如，是否自动登录。
2. 初始化 CallKit。你可以自定义铃声和通话超时时间。

在整个应用生命周期中，初始化一次即可。

```tsx

```

## 步骤 4 发起通话 

你可以使用 `startSingleCall` 方法发起一对一通话，`callType` 设置为 `video` 为视频通话，`audio` 为音频通话。

为了保证通话质量和性能，CallKit 限制群组通话最多支持 **16 人** 同时参与（包括发起者）。

你可以使用 `startGroupCall` 发起群组通话，指定群组 ID，callType 设置为 `video` 为视频通话，`audio` 为音频通话，并设置邀请消息 `msg`。CallKit 会自动拉起群成员选择界面，界面显示群组中的所有成员（群主、管理员、普通成员），用户可以选择要邀请的成员，选中人数会实时显示。

// TODO：调整代码

```tsx
import React, { useRef } from 'react';
import { CallKit, Provider, rootStore, CallKitRef } from 'easemob-chat-uikit';

const App = () => {
  const callKitRef = useRef<CallKitRef>(null);
  // 一对一视频通话
const startVideoCall = () => {
  callKitRef.current?.startSingleCall({
    to: 'target_user_id',
    callType: 'video',
    msg: '邀请你进行视频通话',
  });
};

// 一对一语音通话
const startAudioCall = () => {
  callKitRef.current?.startSingleCall({
    to: 'target_user_id',
    callType: 'audio',
    msg: '邀请你进行语音通话',
  });
};

// 群组通话
const startGroupCall = () => {
  callKitRef.current?.startGroupCall({
    groupId: 'group_id',
    callType: 'video',
    msg: '邀请加入群组视频通话',
  });
};
  return (
    <Provider
      initConfig={{
        appKey: 'your appKey',
        userId: 'userId',
        token: 'token',
      }}
    >
      <CallKit
        ref={callKitRef}
        chatClient={rootStore.client}
        userInfoProvider={userInfoProvider}
        groupInfoProvider={groupInfoProvider}
      />
    </Provider>
  );
};

```

## API 方法  // TODO：改成 Android 样式，单独弄一篇文档。

通过 ref 可以调用以下方法：

### 通话控制

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

<!-- ### 通话控制

```tsx
// 切换静音
callKitRef.current?.toggleMute();

// 切换摄像头
callKitRef.current?.toggleCamera();

// 添加参与者
callKitRef.current?.addParticipants(['user1', 'user2']);
``` -->

### 窗口控制

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

<!-- ## 高级功能

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

## 最佳实践

### 1. 错误处理  

// TODO：添加错误类型和描述。

```tsx
<CallKit
  onCallError={error => {
    // 根据错误类型进行不同处理
    switch (error.code) {
      case 'PERMISSION_DENIED':
        alert('请授权摄像头和麦克风权限');
        break;
      case 'NETWORK_ERROR':
        alert('网络连接异常，请检查网络');
        break;
      default:
        alert(`通话错误: ${error.message}`);
    }
  }}
/>
```

### 2. 用户信息缓存

通话过程中，优先使用缓存中的用户信息。若缓存中没有用户信息，你可以去服务器获取。

```tsx
const userInfoCache = new Map();

const userInfoProvider = async (userIds: string[]) => {
  const uncachedIds = userIds.filter(id => !userInfoCache.has(id));

  if (uncachedIds.length > 0) {
    // 只请求未缓存的用户信息
    const newUserInfos = await fetchUserInfoFromServer(uncachedIds);
    newUserInfos.forEach(info => {
      userInfoCache.set(info.userId, info);
    });
  }

  return userIds.map(id => userInfoCache.get(id));
};
```

### 3. 组件卸载时清理缓存数据

CallKit 组件卸载时需要清理缓存数据。

```tsx
useEffect(() => {
  return () => {
    // 组件卸载时结束通话
    callKitRef.current?.exitCall();
  };
}, []);
```
