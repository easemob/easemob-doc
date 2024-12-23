# 集成 SDK

本文介绍如何将环信即时通讯 IM SDK 集成到你的 Flutter 项目中。

## 开发环境要求

- Flutter 2.0.0 或以上版本;
- Dart 2.12 或以上版本;

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

2. 打开文件 `quick_start/android/app/src/main/AndroidManifest.xml`，在 `</application>` 下添加：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>
```

3. 在 `quick_start/android/app/proguard-rules.pro` 中设置免混淆规则：

```java
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

### 设置 iOS

iOS 需要 iOS 11.0 以上版本。

打开文件 `quick_start/ios/Runner.xcodeproj`，选择 **TARGETS > General > Deployment info**, 设置 iOS 版本为 11.0。

### 集成 SDK

```shell
cd quick_start
flutter pub add im_flutter_sdk
flutter pub get
```
