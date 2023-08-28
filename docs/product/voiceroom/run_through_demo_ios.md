#  跑通语聊房示例项目

环信提供一个开源的[语聊房示例项目](https://github.com/easemob/voiceroom_demo_ios)，演示了如何使用环信 IM SDK、App Server 和 Agora Audio SDK 实现基本的消息互动、音频互动、房间管理和麦位管理等场景。

本文展示如何编译并运行 iOS 平台的语聊房示例项目，体验房间内的互动。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- Xcode 13.0 或以上版本。
- CocoaPods。你可以参考 [CocoaPods 安装指南](https://guides.cocoapods.org/using/getting-started.html#getting-started)。
- iOS 13.0 或以上版本的设备。部分模拟机可能无法支持本项目的全部功能，所以推荐使用真机。

## 操作步骤

### 获取示例项目

- 下载 [Easemob Chat Room 示例项目](https://github.com/easemob/voiceroom_demo_ios)。

- 进入项目文件夹拖拽文件夹到终端，然后运行如下命令安装依赖库：

    ```
    pod update
    pod install 
    ```

### 运行示例项目

- 使用 Xcode 打开 xcworkspace 工程文件。
- 通过 USB 线将 iOS 设备接入你的电脑。
- 在 Xcode 中，点击 **Build and run** 按钮。运行一段时间后，EaseMobVoiceChatRoom 应用会安装在 iOS 设备上。
- 打开 EaseMobVoiceChatRoom 应用进行体验。

## 编译常见问题

在编译示例项目过程中，如果 Xcode 报错 `Error: Multiple commands produce`，可以参考如下步骤进行错误排查：
- 在 Xcode 中，选择 **File > Workspace Settings**。
- 在弹出的面板中，点击 **Shared Workspace Settings** 区域的 **Build System** 框，将 **New Build System (Default)** 切换为 **Legacy Build System**。
