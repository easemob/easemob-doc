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

在集成 CallKit 之前，你需要完成以下准备工作：

1. 在 [环信控制台](https://console.easemob.com/user/login) 进行如下操作：
  - [注册环信账号](/product/console/account_register.html#注册账号)。
  - [创建应用](/product/console/app_create.html)，[获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，格式为 `orgname#appname`。
  - [创建用户](/product/console/operation_user.html#创建用户)，获取用户 ID。
  - [创建群组](/product/console/operation_group.html#创建群组)，获取群组 ID。将用户加入群组。
  - [开通音视频服务](product_activation.html)。

2. 集成环信即时通讯 IM SDK。
   
确保已集成环信 IM SDK 并完成登录。

## 集成步骤

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

- **发起一对一通话**
  
  你可以使用 `startSingleCall` 方法发起一对一通话，`callType` 设置为 `video` 为视频通话，`audio` 为音频通话。

- **发起群组通话**
  
  要发起群组通话，你需要首先创建群组，在群组中添加用户，详见 [环信控制台文档](/product/console/operation_group.html#创建群组)。

  你可以使用 `startGroupCall` 发起群组通话，指定群组 ID，`callType` 设置为 `video` 为视频通话，`audio` 为音频通话，并设置邀请消息 `msg`。CallKit 会自动拉起群成员选择界面，界面显示群组中的所有成员（群主、管理员、普通成员），用户可以选择要邀请的成员，选中人数会实时显示。为了保证通话质量和性能，CallKit 限制群组通话最多支持 **16 人** 同时参与（包括发起者）。

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

## 高阶功能

### 错误处理  

// TODO：添加错误类型和描述。 
// TODO：下面的代码有问题吗？

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

### 用户信息

- 默认情况下，音视频通话中显示用户 ID 和默认头像，你可以通过 `userInfoProvider` 设置用户昵称和头像。
- 默认情况下，群组音视频通话中显示群组 ID 和默认群组头像，你可以通过 `groupInfoProvider` 设置群组名称和群组头像。

```tsx
// 实现用户信息提供者
const userInfoProvider = async (userIds: string[]) => {
  // 从你的服务器或本地缓存获取用户信息
  return userIds.map(userId => ({
    userId,
    nickname: `用户 ${userId}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
  }));
};
// 实现群组信息提供者
const groupInfoProvider = async (groupIds: string[]) => {
  // 从你的服务器或本地缓存获取群组信息
  return groupIds.map(groupId => ({
    groupId,
    groupName: `群组 ${groupId}`,
    groupAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=group-${groupId}`,
  }));
};
```

### 用户信息缓存

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

### 组件卸载时清理缓存数据

CallKit 组件卸载时需要清理缓存数据。

```tsx
useEffect(() => {
  return () => {
    // 组件卸载时结束通话
    callKitRef.current?.exitCall();
  };
}, []);
```
