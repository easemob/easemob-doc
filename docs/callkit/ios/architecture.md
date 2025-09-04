# CallKit 架构

## 项目概述

环信 iOS CallKit 是基于环信即时通讯 IM SDK 和声网 RTC SDK 开发的实时音视频通话框架。该项目使用 Swift 作为开发语言，包含如下模块：

- `CoreService`：核心协议层以及定义。
  - `Provider`：包含 `CallProfileProtocol.swift` 用户信息协议以及 `Providers.swift` 信息提供者协议。 
  - `Services`：包含 `CallError.swift` 错误信息以及 `CallMessageService.swift` 呼叫 API 协议以及回调方法和结束原因枚举等。
  - `Implements`：对应协议的实现组件。
- `Resource`：图像或本地化文件。  
- `Commons`：包含一些工具类、UI 配置类和主题类等。`CallKitManager` 用到的工具类：`AudioPlayerManager`、`LiveCommunicationManager`、`GlobalTimerManager`。
- `UI`：包含所有 UI 组件，包括视图控制器、`UIView`、`UITableViewCell` 等。

## 项目结构

```
Classes
├─ CoreService // 核心协议层以及定义。
│ ├─ Provider //CallKit 用户信息获取缓存等。
│ ├─ Service // 业务协议。
│ │ ├─ CallMessageService // 呼叫 API 和部分回调，以及常量枚举定义。
│ └─ Implements // 上面对应协议的实现组件。核心`CallKitManager`实现，分别为扩展处理`CallKitManager+Signaling.swift`、`CallKitManager+RTC.swift`等。
├─ Resource // 图像或本地化文件。
├─ Commons
       ├─ Utils // 一些 CallKitManager 用到的工具类（AudioPlayerManager、LiveCommunicationManager、GlobalTimerManager）以及相关 UI 类。
       ├─ Appearance // UI 以及资源配置相关。
       ├─ ConsoleLog // 日志打印相关。
       ├─ Theme // 主题相关组件，包括颜色、字体、换肤协议及其组件。
       └─ Extension // 一些方便的系统类扩展。
│
└─ UI // 基本 UI 组件，不带业务。
    ├─ Controllers // 视图控制器。
    ├─ Views // 所有 UIView。
    └─ Cells // 所有 UITableViewCell。
```