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
import "easemob-chat-uikit/style.css";
```

### 3. 引入 CallKit

```tsx
import { CallKit, Provider, rootStore } from "easemob-chat-uikit";
import type { CallKitRef } from "easemob-chat-uikit";
```

### 步骤 2 配置 CallKit 组件

在你的应用根组件中，需要使用 `Provider` 组件包裹整个应用，并在其中使用 `CallKit` 组件：

```tsx
import React, { useRef } from "react";
import { Provider, CallKit, rootStore } from "easemob-chat-uikit";
import type { CallKitRef } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const App = () => {
  const callKitRef = useRef<CallKitRef>(null);

  // 用户信息提供者
  const userInfoProvider = async (userIds: string[]) => {
    return userIds.map((userId) => ({
      userId,
      nickname: `用户 ${userId}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    }));
  };

  // 群组信息提供者
  const groupInfoProvider = async (groupIds: string[]) => {
    return groupIds.map((groupId) => ({
      groupId,
      groupName: `群组 ${groupId}`,
      groupAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=group-${groupId}`,
    }));
  };

  return (
    <Provider
      initConfig={{
        appKey: "your_app_key", // 你的应用 App Key
        userId: "current_user_id", // 当前用户 ID
        token: "user_token", // 用户 token，或使用 password 进行密码登录
      }}
    >
      <CallKit
        ref={callKitRef}
        chatClient={rootStore.client} // 环信 IM 客户端实例
        userInfoProvider={userInfoProvider} // 用户信息提供者
        groupInfoProvider={groupInfoProvider} // 群组信息提供者
        enableRingtone={true} // 启用铃声
        resizable={true} // 允许调整大小
        draggable={true} // 允许拖拽
      />
    </Provider>
  );
};

export default App;
```

### 重要说明

1. **Provider 组件**：负责初始化环信 IM SDK 连接，必须包裹在应用的最外层。
2. **initConfig 配置**：包含应用的 App Key、用户 ID 和登录凭证（token）。
3. **CallKit 组件**：音视频通话组件，会自动处理内部的初始化逻辑。
4. **chatClient 属性**：传入 `rootStore.client`，这是 Provider 创建的 IM 连接实例。
5. **信息提供者**：`userInfoProvider` 和 `groupInfoProvider` 用于获取用户和群组的显示信息。

Provider 组件会自动处理 IM SDK 的初始化和登录，CallKit 组件会在内部自动初始化音视频服务，无需手动调用初始化方法。

## 步骤 3 登录 IM

Callkit 内部依赖 IM SDK 进行信令交互，所以在使用 Callkit 之前需要先登录 IM。登录 IM 有两种方式可以选择：

1. 使用 UIKit，UIKit Provider 组件内部集成了 IM SDK，提供 userId 和 token 属性，内部会自动登录。

```tsx
import React, { useRef } from "react";
import { Provider, CallKit, rootStore } from "easemob-chat-uikit";
import type { CallKitRef } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const App = () => {
  const callKitRef = useRef<CallKitRef>(null);
  return (
    <Provider
      initConfig={{
        appKey: "your_app_key", // 你的应用 App Key
        userId: "current_user_id", // 当前用户 ID
        token: "user_token", // 用户 token
      }}
    >
      <CallKit
        ref={callKitRef}
        chatClient={rootStore.client} // 环信 IM 客户端实例
        enableRingtone={true} // 启用铃声
        resizable={true} // 允许调整大小
        draggable={true} // 允许拖拽
      />
    </Provider>
  );
};

export default App;
```

如果想要手动登录，可以从 rootStore 获取 IM SDK 实例，调用 SDK open 方法去登录。

```tsx
import React, { useRef, useEffect } from "react";
import { Provider, CallKit, rootStore } from "easemob-chat-uikit";
import type { CallKitRef } from "easemob-chat-uikit";
import "easemob-chat-uikit/style.css";

const App = () => {
  const callKitRef = useRef<CallKitRef>(null);

  useEffect(() => {
    // 手动登录
    rootStore.client.open({
      user: "userId",
      accessToken: "accessToken",
    });
  }, []);

  return (
    <Provider
      initConfig={{
        appKey: "your_app_key", // 你的应用 App Key
      }}
    >
      <CallKit
        ref={callKitRef}
        chatClient={rootStore.client} // 环信 IM 客户端实例
        enableRingtone={true} // 启用铃声
        resizable={true} // 允许调整大小
        draggable={true} // 允许拖拽
      />
    </Provider>
  );
};

export default App;
```

2. 如果不使用 UIKit provider, 只使用 Callkit 组件，可以自己集成 IM SDK 并处理登录。

```tsx
import React, { useRef } from "react";
import { CallKit } from "easemob-chat-uikit";
import type { CallKitRef } from "easemob-chat-uikit";
import ChatSDK from "easemob-websdk";
import "easemob-chat-uikit/style.css";

const App = () => {
  const callKitRef = useRef<CallKitRef>(null);
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    const chat = new ChatSDK.connection({
      appKey: "your appKey",
    });

    chat.open({
      user: "userId",
      accessToken: "accessToken",
    });
    setChatClient(chat);
  }, []);
  return (
    <CallKit
      ref={callKitRef}
      chatClient={chatClient} // 环信 IM 客户端实例
      enableRingtone={true} // 启用铃声
      resizable={true} // 允许调整大小
      draggable={true} // 允许拖拽
    />
  );
};

export default App;
```

## 步骤 4 设置监听

CallKit 组件可以设置回调事件，实现监听 Callkit 内部状态，和错误事件。

// TODO：需要添加这么多代码？

```tsx
<CallKit
  ref={callKitRef} // CallKit 组件引用，用于调用组件方法
  // === 基础配置 ===
  className="custom-callkit" // 自定义 CSS 类名
  style={{ zIndex: 9999 }} // 自定义样式
  prefix="custom" // CSS 类名前缀
  // === 通话核心配置 ===
  chatClient={rootStore.client} // 环信 IM 客户端实例，必须传入
  enableRealCall={true} // 是否启用真实通话功能，默认 true
  // === 用户信息提供者 ===
  userInfoProvider={userInfoProvider} // 用户信息提供者函数
  groupInfoProvider={groupInfoProvider} // 群组信息提供者函数
  // === 布局相关配置 ===
  layoutMode={LayoutMode.MULTI_PARTY} // 布局模式：PREVIEW | ONE_TO_ONE | MULTI_PARTY
  maxVideos={16} // 最大显示视频数量，默认无限制
  aspectRatio={16 / 9} // 视频窗口宽高比，默认 1
  gap={8} // 视频窗口间隙，默认 6px
  backgroundImage="/path/to/bg.jpg" // 多人通话背景图片
  // === 控制按钮配置 ===
  showControls={true} // 是否显示控制按钮，默认 true
  muted={false} // 初始静音状态，默认 false
  cameraEnabled={true} // 初始摄像头状态，默认 true
  speakerEnabled={true} // 初始扬声器状态，默认 true
  screenSharing={false} // 初始屏幕共享状态，默认 false
  // === 铃声配置 ===
  enableRingtone={true} // 是否启用铃声，默认 true
  outgoingRingtoneSrc="/sounds/outgoing.mp3" // 拨打电话铃声
  incomingRingtoneSrc="/sounds/incoming.mp3" // 接听电话铃声
  ringtoneVolume={0.8} // 铃声音量，范围 0-1，默认 0.8
  ringtoneLoop={true} // 是否循环播放铃声，默认 true
  // === 窗口大小和位置 ===
  resizable={true} // 是否允许调整大小，默认 false
  minWidth={400} // 最小宽度，默认 400px
  minHeight={300} // 最小高度，默认 300px
  maxWidth={1200} // 最大宽度，默认无限制
  maxHeight={800} // 最大高度，默认无限制
  draggable={true} // 是否允许拖拽，默认 false
  dragHandle=".callkit-header" // 拖拽手柄 CSS 选择器
  managedPosition={true} // 是否使用内置位置管理，默认 true
  initialPosition={{ left: 100, top: 100 }} // 初始位置
  initialSize={{ width: 748, height: 523 }} // 初始大小
  // === 最小化配置 ===
  isMinimized={false} // 初始最小化状态
  minimizedSize={{ width: 80, height: 64 }} // 最小化时的尺寸
  // === 邀请界面配置 ===
  showInvitationAvatar={true} // 是否显示邀请者头像，默认 true
  showInvitationTimer={true} // 是否显示倒计时，默认 true
  autoRejectTime={30} // 自动拒绝时间（秒），默认 30
  acceptText="接听" // 接听按钮文本
  rejectText="拒绝" // 拒绝按钮文本
  invitationCustomContent={<CustomInviteContent />} // 自定义邀请内容
  // === 群组通话配置 ===
  userSelectTitle="选择参与者" // 用户选择弹窗标题
  groupMembers={groupMemberList} // 群组成员列表（可选）
  webimGroupId="group123" // WebIM 群组 ID（可选）
  // === 音量和网络 ===
  speakingVolumeThreshold={60} // 说话指示器音量阈值，范围 1-100
  // === 自定义图标 ===
  customIcons={{
    controls: {
      micOn: <CustomMicOnIcon />,
      micOff: <CustomMicOffIcon />,
      cameraOn: <CustomCameraOnIcon />,
      cameraOff: <CustomCameraOffIcon />,
      hangup: <CustomHangupIcon />,
    },
    header: {
      minimize: <CustomMinimizeIcon />,
      addParticipant: <CustomAddIcon />,
    },
  }}
  // === 事件回调 ===
  // 错误处理
  onCallError={(error) => {
    switch (error.errorType) {
      case "callkit":
        console.log("CallKit 组件错误", error);
        break;
      case "rtc":
        console.log("RTC SDK 错误", error);
        break;
      case "chat":
      default:
        console.log("IM SDK 错误", error.message);
    }
  }}
  // 通话状态回调
  onReceivedCall={(callType, userId, ext) => {
    console.log(`收到来自 ${userId} 的${callType}通话邀请`, ext);
  }}
  onCallStart={(videos) => {
    console.log("通话开始", videos);
  }}
  onEndCallWithReason={(reason, callInfo) => {
    console.log("通话结束", reason, callInfo);
  }}
  // 用户状态回调
  onRemoteUserJoined={(userId, callType) => {
    console.log(`用户 ${userId} 加入通话`);
  }}
  onRemoteUserLeft={(userId, callType) => {
    console.log(`用户 ${userId} 离开通话`);
  }}
  // 界面操作回调
  onMinimizedChange={(minimized) => {
    console.log(`窗口${minimized ? "最小化" : "恢复"}`);
  }}
  onResize={(width, height) => {
    console.log(`窗口大小调整: ${width}x${height}`);
  }}
  onDragEnd={(position) => {
    console.log("拖拽结束", position);
  }}
  // RTC 引擎回调
  onRtcEngineCreated={(rtc) => {
    console.log("RTC 引擎创建成功", rtc);
    // 可以在这里对 RTC 引擎进行自定义配置
  }}
/>
```

### 回调事件说明

| 回调事件              | 参数                                            | 描述                                             |
| --------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `onCallError`         | `(error: CallError)`                            | 通话过程中发生错误时触发，包含错误类型和详细信息 |
| `onReceivedCall`      | `(callType, userId, ext)`                       | 收到通话邀请时触发                               |
| `onCallStart`         | `(videos: VideoWindowProps[])`                  | 通话开始时触发                                   |
| `onEndCallWithReason` | `(reason: string, callInfo: CallInfo)`          | 通话结束原因回调                                 |
| `onRemoteUserJoined`  | `(userId: string, callType)`                    | 远程用户加入通话时触发                           |
| `onRemoteUserLeft`    | `(userId: string, callType)`                    | 远程用户离开通话时触发                           |
| `onInvitationAccept`  | `(invitation: InvitationInfo)`                  | 用户接受邀请时触发                               |
| `onInvitationReject`  | `(invitation: InvitationInfo)`                  | 用户拒绝邀请时触发                               |
| `onLayoutModeChange`  | `(layoutMode: string)`                          | 布局模式变化时触发                               |
| `onMinimizedChange`   | `(minimized: boolean)`                          | 最小化状态变化时触发                             |
| `onResize`            | `(width, height, deltaX?, deltaY?, direction?)` | 窗口大小调整时触发                               |
| `onDragStart`         | `(startPosition: {x, y})`                       | 开始拖拽时触发                                   |
| `onDrag`              | `(newPosition: {x, y}, delta: {x, y})`          | 拖拽过程中触发                                   |
| `onDragEnd`           | `(finalPosition: {x, y})`                       | 拖拽结束时触发                                   |
| `onRtcEngineCreated`  | `(rtc: any)`                                    | RTC 引擎创建完成时触发，可用于自定义配置         |
| `onAddParticipant`    | `()`                                            | 用户点击添加参与者按钮时触发                     |

## 步骤 5 发起通话

- **发起一对一通话**

  你可以使用 `startSingleCall` 方法发起一对一通话，`callType` 设置为 `video` 为视频通话，`audio` 为音频通话。

```tsx
const App = () => {
  const callKitRef = useRef<CallKitRef>(null);
  // 一对一视频通话
  const startVideoCall = () => {
    callKitRef.current?.startSingleCall({
      to: "target_user_id",
      callType: "video",
      msg: "邀请你进行视频通话",
    });
  };

  // 一对一语音通话
  const startAudioCall = () => {
    callKitRef.current?.startSingleCall({
      to: "target_user_id",
      callType: "audio",
      msg: "邀请你进行语音通话",
    });
  };
  return (
    <Provider
      initConfig={{
        appKey: "your appKey",
        userId: "userId",
        token: "token",
      }}
    >
      <CallKit ref={callKitRef} chatClient={rootStore.client} />
    </Provider>
  );
};
```

- **发起群组通话**

  要发起群组通话，你需要首先创建群组，在群组中添加用户，详见 [环信控制台文档](/product/console/operation_group.html#创建群组)。

  你可以使用 `startGroupCall` 发起群组通话，指定群组 ID，`callType` 设置为 `video` 为视频通话，`audio` 为音频通话，并设置邀请消息 `msg`。CallKit 会自动拉起群成员选择界面，界面显示群组中的所有成员（群主、管理员、普通成员），用户可以选择要邀请的成员，选中人数会实时显示。为了保证通话质量和性能，CallKit 限制群组通话最多支持 **16 人** 同时参与（包括发起者）。

```tsx
// 群组通话
const startGroupCall = () => {
  callKitRef.current?.startGroupCall({
    groupId: "group_id",
    callType: "video",
    msg: "邀请加入群组视频通话",
  });
};
```

## 高阶功能

### 用户信息

- 默认情况下，音视频通话中显示用户 ID 和默认头像，你可以通过 `userInfoProvider` 设置用户昵称和头像。
- 默认情况下，群组音视频通话中显示群组 ID 和默认群组头像，你可以通过 `groupInfoProvider` 设置群组名称和群组头像。

```tsx
// 实现用户信息提供者
const userInfoProvider = async (userIds: string[]) => {
  // 从你的服务器或本地缓存获取用户信息
  return userIds.map((userId) => ({
    userId,
    nickname: `用户 ${userId}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
  }));
};
// 实现群组信息提供者
const groupInfoProvider = async (groupIds: string[]) => {
  // 从你的服务器或本地缓存获取群组信息
  return groupIds.map((groupId) => ({
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
  const uncachedIds = userIds.filter((id) => !userInfoCache.has(id));

  if (uncachedIds.length > 0) {
    // 只请求未缓存的用户信息
    const newUserInfos = await fetchUserInfoFromServer(uncachedIds);
    newUserInfos.forEach((info) => {
      userInfoCache.set(info.userId, info);
    });
  }

  return userIds.map((id) => userInfoCache.get(id));
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
