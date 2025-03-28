# 集成 SDK

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

iOS 需要 iOS 12.0 以上版本。

打开文件 `quick_start/ios/Runner.xcodeproj`，选择 **TARGETS > General > Deployment info**, 设置 iOS 版本为 12.0。

### 集成 SDK

```shell
cd quick_start
flutter pub add im_flutter_sdk
flutter pub get
```

#### 鸿蒙平台支持

自 SDK 4.13.0 开始支持鸿蒙。若要在鸿蒙平台使用，需进行以下配置：

1. 使用支持鸿蒙的 Flutter，详情请参见[相关文档](https://gitee.com/harmonycommando_flutter/flutter)。

2. 添加鸿蒙插件依赖。在项目 `pubspec.yaml` 文件中添加：

```yaml
im_flutter_sdk: ^4.13.0
im_flutter_sdk_ohos:
  git:
    url: "https://github.com/easemob/im_flutter_sdk_oh.git"
    ref: 1.5.3
```

3. 执行 `flutter pub get`。