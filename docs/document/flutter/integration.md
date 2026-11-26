# 添加依赖

本文介绍如何将环信即时通讯 IM SDK 集成到你的 Flutter 项目中。

## 开发环境要求

```yaml
environment:
  sdk: '>=3.3.0 <4.0.0'
  flutter: '>=3.3.0'
```

### 使用命令创建项目

```dart
flutter create quick_start
```

### 设置 Android

1. 打开文件 `quick_start/android/app/build.gradle` 在文件最后添加：

```dart
android {
    defaultConfig {
        minSdkVersion 21
    }
}
```

2. 打开文件 `quick_start/android/app/src/main/AndroidManifest.xml`，在 `<manifest>` 节点下、`<application>` 节点外添加以下权限：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

### 设置 iOS

iOS 需要 iOS 13.0 以上版本。

打开文件 `quick_start/ios/Runner.xcodeproj`，选择 **TARGETS > General > Deployment info**, 设置 iOS 版本为 13.0。

iOS 同时支持 CocoaPods 与 Swift Package Manager 两种集成方式，按你的 Flutter 项目配置选择即可，无需额外操作。

### 添加依赖

```shell
cd quick_start
flutter pub add im_flutter_sdk
flutter pub get
```

#### 鸿蒙平台支持

SDK 的鸿蒙（HarmonyOS）能力在 [im_flutter_sdk](https://github.com/easemob/im_flutter_sdk) 仓库的独立 `ohos` 分支上维护。由于鸿蒙版 Flutter 与官方 Flutter 不兼容，鸿蒙线暂时无法与 iOS/Android 主线（`5.x`）完全合并统一，两条线各自独立演进：

- iOS/Android：使用 pub.dev 官方发布线（即上文 `flutter pub add im_flutter_sdk`）。
- 鸿蒙：使用 `ohos` 分支发布的版本，版本号形如 `X.Y.Z-ohos`（如 `1.16.0-ohos`，跟随鸿蒙原生 SDK `@easemob/chatsdk` 的版本），通过 Git tag 方式依赖。

若要在鸿蒙平台使用，需进行以下配置：

1. 使用支持鸿蒙的 Flutter，详情请参见[相关文档](https://gitee.com/harmonycommando_flutter/flutter)。要求 HarmonyOS 5.0.0（API 12）及以上版本。

2. 在项目 `pubspec.yaml` 文件中通过 Git tag 添加依赖（以仓库实际发布的 tag 为准）：

```yaml
dependencies:
  im_flutter_sdk:
    git:
      url: "https://github.com/easemob/im_flutter_sdk.git"
      ref: 1.16.0-ohos
      path: im_flutter_sdk
```

鸿蒙实现包 `im_flutter_sdk_ohos` 与接口包 `im_flutter_sdk_interface` 由主包按版本号自动引入，无需手动添加。

3. 执行 `flutter pub get`。
