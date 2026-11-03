# 添加依赖

本文介绍如何将环信即时通讯 IM SDK 集成到你的 Flutter 项目中。

## 开发环境要求

```yaml
environment:
  sdk: '>=3.3.0 <4.0.0'
  flutter: '>=3.3.0'
```

平台最低版本要求如下：

- Android：`minSdkVersion` 21，`compileSdkVersion` 34 或以上
- iOS：iOS 13.0

### 使用命令创建项目

```shell
flutter create quick_start
```

### 设置 Android

1. 打开文件 `quick_start/android/app/build.gradle`，设置 `compileSdkVersion` 和 `minSdkVersion`：

```gradle
android {
    compileSdkVersion 34

    defaultConfig {
        minSdkVersion 21
    }
}
```

如果项目使用 Kotlin DSL，文件名为 `quick_start/android/app/build.gradle.kts`，对应配置如下：

```kotlin
android {
    compileSdk = 34

    defaultConfig {
        minSdk = 21
    }
}
```

:::tip
Android 原生 SDK 5.0.0 新增的 AndroidX 传递依赖要求应用模块使用 Android API 34 或以上版本编译。较新的 Flutter 项目通常已满足该要求；旧项目需将 `compileSdkVersion` 升级至 34 或以上。
:::

2. Flutter 插件的 `AndroidManifest.xml` 已声明以下权限，构建时会自动合并到应用清单，通常无需在应用的 `AndroidManifest.xml` 中重复添加：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

3. 在 `quick_start/android/app/proguard-rules.pro` 文件中添加以下规则，防止发布版本混淆 SDK 代码：

```proguard
-keep class com.hyphenate.** {*;}
-dontwarn com.hyphenate.**
```

### 设置 iOS

iOS 需要 iOS 13.0 或以上版本。

打开文件 `quick_start/ios/Runner.xcodeproj`，选择 **TARGETS > Runner > General > Deployment Info**，将 iOS Deployment Target 设置为 13.0。

Flutter SDK 的 iOS 插件同时支持 CocoaPods 和 Swift Package Manager，项目可根据当前 Flutter 工程配置选择对应方式，无需手动添加原生 IM SDK 依赖。

### 添加依赖

在项目的 `pubspec.yaml` 文件中添加 Flutter SDK 5.0.0 依赖：

```yaml
dependencies:
  im_flutter_sdk: ^5.0.0
```

然后执行：

```shell
cd quick_start
flutter pub get
```

:::tip
如果项目从 Flutter SDK 4.x 升级至 5.0.0，更新依赖后必须重新执行 `flutter pub get` 并重新编译。iOS 使用 CocoaPods 集成时，还需在 `ios` 目录中显式执行一次 `pod install`，避免继续链接旧版本的原生 SDK。
:::
