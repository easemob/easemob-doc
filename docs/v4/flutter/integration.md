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

使用 Xcode 打开 `quick_start/ios/Runner.xcodeproj`，选择 **TARGETS > General > Deployment info**, 将 iOS 部署版本设置为 13.0。

iOS 支持 CocoaPods 与 Swift Package Manager 两种集成方式，可根据 Flutter 项目的配置选择，无需额外操作。

### 添加依赖

```shell
cd quick_start
flutter pub add im_flutter_sdk
flutter pub get
```

#### 鸿蒙平台支持

Flutter SDK 的鸿蒙（HarmonyOS）版本在 [im_flutter_sdk](https://github.com/easemob/im_flutter_sdk) 仓库的 `ohos` 分支中独立维护。由于鸿蒙版 Flutter 与官方 Flutter 存在兼容性差异，鸿蒙版本目前与 iOS/Android 的 `4.x` 主线分别维护和发布：

- **iOS/Android**：使用 pub.dev 发布的版本，通过 `flutter pub add im_flutter_sdk` 添加依赖。
- **鸿蒙**：通过 Git tag 引入 `ohos` 分支发布的版本。版本号跟随鸿蒙原生 SDK `@easemob/chatsdk`，采用 `X.Y.Z-ohos` 格式，例如 `1.16.0-ohos`。

在鸿蒙平台集成 SDK，请完成以下配置：

1. 安装支持鸿蒙的 Flutter，详见 [鸿蒙 Flutter 文档](https://gitee.com/harmonycommando_flutter/flutter)。设备系统需为 HarmonyOS 5.0.0（API 12）或以上版本。

2. 在项目的 `pubspec.yaml` 中通过 Git tag 添加依赖。以下以 `1.16.0-ohos` 为例，请以仓库实际发布的 tag 为准：

   ```
   dependencies:
     im_flutter_sdk:
       git:
         url: https://github.com/easemob/im_flutter_sdk.git
         ref: 1.16.0-ohos
         path: im_flutter_sdk
   ```

   主包会自动引入对应版本的鸿蒙实现包 `im_flutter_sdk_ohos` 和接口包 `im_flutter_sdk_interface`，无需手动添加。

3. 使用鸿蒙版 Flutter 执行以下命令，获取依赖：

   ```
   flutter pub get
   ```
