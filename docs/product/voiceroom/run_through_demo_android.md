#  跑通语聊房示例项目

环信提供一个开源的[语聊房示例项目](https://github.com/easemob/voiceroom_demo_android)，演示了如何使用环信 IM SDK、App Server 和 Agora RTC SDK 实现基本的消息互动、音频互动、房间管理和麦位管理等场景。

本文展示如何编译并运行 Android 平台的语聊房示例项目，体验房间内的互动。

## 前提条件

开始前，确保你的开发环境满足如下条件：

- Android Studio 3.0 或以上版本；
- Android SDK API 等级 23 或以上；
- Android 6.0 或以上版本的设备。

## 操作步骤

### 获取示例项目

- 下载 [Easemob Chat Room 示例项目](https://github.com/easemob/voiceroom_demo_android)。
- 下载 [Easemob Chat Room APK](https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/IMDemo/easevoiceroom-demo1.0.apk)。

### 运行示例项目

- 使用 Android Studio 打开 VoiceChatRoom 工程文件。
- 项目中使用的 Gradle 7.3.3 和 Gradle Plugin 7.2.1。若下载失败，可以尝试使用代理或者降低 Gradle 版本。
- 编译项目前，需要在 `local.properties` 文件中配置环信 App Key、agora_appid 和 app_server_host。如未搭建 App Server，可以从官网下载 APK 安装体验。
- Easemob Chat Room 为模块化项目。在 `gradle.properties` 文件中配置 `isChatroomModule=true` 使 chatroom 模块成为可独立运行的项目。
- 配置项完成且编译通过后，使用 USB 线将 Android 设备接入你的电脑。启动选择 `business.chatroom` 项目，点击 `Run business.chatroom` 进行编译安装。
- 打开 Easemob Chat Room 应用进行体验。

## 运行常见问题

在编译示例项目过程中，如果在 Android 12 设备运行报错，可以在 `gradle.properties` 文件中添加 `android.injected.testOnly=false`。
