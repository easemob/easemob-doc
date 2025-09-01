# CallKit 架构文档

## 项目概述

环信 Web CallKit 是一款功能完善的音视频通话组件库，支持一对一通话、群组通话等多种通话场景。该组件库采用清晰的架构分层、完善的类型定义以及灵活的配置机制，为开发者提供强大且易用的通话功能。凭借模块化设计，各组件具备优秀的可维护性和扩展性，结合灵活的布局系统、完整的通话状态管理以及丰富的用户交互功能，该组件库可全面适配各类复杂通话需求。

## 项目结构

```
module/callkit/
├── CallKit.tsx                 # 主组件，核心逻辑入口
├── components/                 # UI 组件目录
│   ├── VideoPlayer.tsx        # 视频播放器组件
│   ├── InvitationContent.tsx  # 邀请内容组件
│   └── ...
├── layouts/                    # 布局系统目录
│   ├── FullLayoutManager.tsx  # 完整布局管理器
│   ├── OneToOneFullLayout.tsx # 一对一通话布局
│   ├── MultiPartyFullLayout.tsx # 多人通话布局
│   └── PreviewFullLayout.tsx  # 预览模式布局
├── services/                   # 服务层目录
│   ├── CallService.ts         # 通话服务核心类
│   ├── CallError.ts           # 错误处理类
│   └── ...
├── hooks/                      # 自定义 Hook 目录
│   ├── useCallTimer.ts        # 通话计时器 Hook
│   ├── useInvitationTimers.ts # 邀请定时器 Hook
│   ├── useContainerSize.ts    # 容器尺寸 Hook
│   ├── useFullscreen.ts       # 全屏控制 Hook
│   ├── useResizable.ts        # 尺寸调整 Hook
│   └── useDraggable.ts        # 拖拽控制 Hook
├── types/                      # 类型定义目录
│   ├── index.ts               # 主要类型定义
│   ├── layout.ts              # 布局相关类型
│   └── ...
└── styles/                     # 样式文件目录
    └── index.scss             # 主样式文件
```

## 核心架构组件

各组件之间的关系如下图所示：


### 核心服务层

| 组件          | 描述 | 
| :------------ | :--- |
| CallService Class         | - 负责管理通话的核心逻辑。 <br/> - 处理音视频流的创建、管理和销毁。 <br/> - 管理通话状态转换。 <br/> - 与 Web IM 和 Agora RTC 进行交互。| 
| CallServiceConfig         | -  配置 `CallService` 的各种参数。 <br/> - 包含回调函数、连接信息等配置项。| 
| CallInfo Interface          | - 定义通话信息的标准格式。 <br/> - 包含通话 ID、类型、参与者等关键信息。 | 

### CallKit 组件层

| 组件          | 描述 | 
| :------------ | :--- |
| CallKit forwardRef          | - 主要的 React 组件入口。  <br/> - 管理组件的整体状态和生命周期。  <br/> - 提供对外的方法接口。| 
| 状态管理         |  -  `videos`: 管理所有视频窗口信息。 <br/> - `callStatus`: 管理通话状态。 <br/> - `invitation`: 管理邀请相关信息。| 


### 布局系统

| 组件          | 描述 | 
| :------------ | :--- |
| - FullLayoutManager<br/> - MemoizedFullLayoutManager   | - 统一的布局管理器，支持多种布局模式。  <br/> - 使用 React.memo 进行性能优化。<br/> - 根据通话类型自动选择合适的布局。 | 
| 布局类型         | - `OneToOneFullLayout`: 一对一通话布局。  <br/> - `MultiPartyFullLayout`: 多人通话布局。  <br/> - `PreviewFullLayout`: 预览模式布局。 | 

### UI 组件层

| 组件          | 描述 | 
| :------------ | :--- |
| CallControls Component | - 通话控制按钮（静音、摄像头、扬声器等）。 <br/> - 支持自定义图标和样式。 | 
| VideoWindow Rendering          | - 视频窗口渲染组件。 <br/> - 支持本地和远程视频流。 <br/> - 包含用户头像、昵称、状态指示器等。| 
| UserSelect Component | - 用户选择组件，用于群组通话。 <br/> - 支持多选和搜索功能。| 

## 功能与特性

| 功能/特性          | 描述 | 
| :------------ | :--- |
| 通话类型支持          | - **一对一视频通话**: 支持本地预览、远程视频显示。 <br/> - **一对一音频通话**: 纯音频通话模式。 <br/> - **群组通话**: 支持多人音视频通话。 | 
| 布局系统          | - **自适应布局**: 根据参与者数量自动调整布局。 <br/> - **多种布局模式**: 支持一对一、多人、预览等不同布局。 <br/> - **响应式设计**: 支持窗口大小调整和拖拽。 | 
| 状态管理         | - **完整的状态机**: idle → calling → ringing → connected。 <br/> - **实时状态同步**: 与 CallService 保持状态一致。 <br/> - **错误处理**: 完善的错误处理和恢复机制。 | 
| 用户交互          | - **控制按钮**: 静音、摄像头、扬声器等。 <br/> - **拖拽和调整**: 支持窗口拖拽和尺寸调整。 <br/> - **全屏和最小化**: 支持全屏模式和最小化功能。 | 
| 通知系统          | - **邀请通知**: 支持自定义邀请内容和样式 <br/> - **超时处理**: 自动处理邀请超时。 <br/> -  **多语言支持**: 内置国际化支持。 | 
