# 添加依赖

本文介绍如何将环信即时通讯 IM SDK 集成到你的 React Native 项目中。

## 开发环境需求

React Native SDK 5.x 仅支持 React Native 新架构。以下以 SDK 示例项目使用的 React Native 0.83.10 为集成基准，不代表所有 React Native 版本的最低环境要求。

- React Native 0.83.10，使用新架构。
- 推荐 Node.js 24 LTS。
- 使用 Yarn 管理项目依赖。

对于 Android 平台：

- Android Studio 及 Android SDK、NDK、CMake 构建工具，版本与所选 React Native 工程匹配。
- JDK 17 及以上。
- 本示例工程的 `minSdkVersion` 为 `24`，`compileSdkVersion` 和 `targetSdkVersion` 为 `36`，运行设备或模拟器为 Android 7.0（API 24）及以上。

对于 iOS 平台：

- macOS、Xcode 及命令行工具，版本满足所选 React Native 版本的构建要求。
- Ruby、Bundler 和 CocoaPods，用于安装 React Native 原生模块及其依赖。
- 本示例工程的 iOS 部署目标为 `15.1`，运行设备或模拟器为 iOS 15.1 及以上。

配置开发或者运行环境如果遇到问题，请参考 [React Native 开发环境配置](https://reactnative.dev/docs/0.83/set-up-your-environment)。已有工程需确认已启用新架构；React Native 0.82 起仅支持新架构。

## 添加 SDK 至项目

打开终端，进入项目根目录，添加依赖到项目中：

```sh
yarn add react-native-chat-sdk
```

SDK 通过 React Native 自动链接集成原生模块，无需手动复制 Android 原生 SDK 或 iOS framework。添加或更新 SDK 后，需要重新编译原生工程，仅刷新 JavaScript 代码不能完成原生依赖更新。

### Android 原生依赖

SDK 已声明 `io.hyphenate:hyphenate-chat:5.0.0` 依赖。确保工程的依赖仓库包含 `google()` 和 `mavenCentral()`，由 Gradle 下载原生依赖，无需再次手动添加同一 IM SDK。

确认 `android/gradle.properties` 中启用了新架构：

```properties
newArchEnabled=true
```

### iOS 原生依赖

React Native SDK 5.x 推荐通过 Swift Package Manager（SPM）集成 `HyphenateChat` 原生依赖，同时继续支持 CocoaPods。两种方式都需要运行 `pod install` 安装 React Native 原生模块；不需要再手动向 Xcode 添加同一 `HyphenateChat` 依赖。

**（推荐）SPM 方式**

宿主工程需支持 `spm_dependency`，并启用动态框架。本页使用的 React Native 0.83.10 满足该帮助方法的版本要求。

确认 `ios/Podfile` 中包含以下配置，以便根据环境变量启用框架；使用标准模板且已有该配置时，无需重复添加：

```ruby
linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  use_frameworks! :linkage => linkage.to_sym
end
```

在 macOS 终端的项目根目录执行：

```sh
bundle install
cd ios
USE_FRAMEWORKS=dynamic bundle exec pod install
cd ..
```

`ChatSdk.podspec` 检测到 `spm_dependency` 和 `USE_FRAMEWORKS=dynamic` 后，会通过官方 SPM 包集成 `HyphenateChat`，版本约束为从 `5.0.0` 起的下一个次版本之前。首次安装需要联网下载包及二进制文件；安装后重新打开 `ios` 目录中的 `.xcworkspace`。

**CocoaPods 方式**

不使用动态框架，或宿主环境不满足 SPM 条件时，SDK 使用 CocoaPods 的 `HyphenateChat ~> 5.0.0` 依赖。在项目根目录执行：

```sh
bundle install
cd ios
bundle exec pod install
cd ..
```

静态链接场景使用 CocoaPods 路径，不要同时手动添加相同的 SPM 包。若工程此前配置了 `USE_FRAMEWORKS=dynamic`，切换方式时也需相应调整该环境变量及 Podfile 配置。

## 添加权限

根据场景需要配置相应的设备权限。仅发送和接收文本消息时，需要网络访问能力，不需要相机、麦克风或定位权限。

对于 iOS 平台，访问网络不需要申请运行时权限。拍摄、录音等功能需由应用在 `Info.plist` 中配置用途说明，并在使用时申请对应权限。

对于 Android 平台，SDK 自带的 `AndroidManifest.xml` 已声明网络等权限，构建时会合并到应用的清单中。请确认合并后的清单包含以下网络权限：

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- 访问网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- 获取网络状态 -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
</manifest>
```

拍照、录音、读取附件或定位等功能还需根据 Android 系统版本，由应用配置并申请对应权限；清单中声明权限不等于已获得运行时授权。

### 防止代码混淆

如果 Android 发布构建开启代码混淆，在 `android/app/proguard-rules.pro` 中添加如下规则，防止混淆 SDK 的代码：

```proguard
-keep class com.hyphenate.** {*;}
-dontwarn com.hyphenate.**
```

完成依赖集成后，可参考 [快速开始](quickstart.html) 实现单聊消息的发送和接收。
