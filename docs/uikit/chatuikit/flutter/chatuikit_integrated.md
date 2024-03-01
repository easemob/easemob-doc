# 集成单群聊 UIKit

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

- Flutter 3.3.0 或以上版本;
- iOS 11 或以上版本;
- Android 21 或以上版本。

## 操作步骤

### 第一步 安装单群聊 UIKit

```base
flutter pub add em_chat_uikit
```

### 第二步 添加权限

因为单群聊 UIKit 中包含发送图片和语音的功能，所以需要开启录音权限、摄像头权限和访问图片库的权限。

- iOS: 你需要在 `<project root>/ios/Runner/Info.plist` 中添加以下权限。

```xml
NSPhotoLibraryUsageDescription
NSCameraUsageDescription
NSMicrophoneUsageDescription
```

- Android: `em_chat_uikit` 已经在 `AndroidManifest.xml` 中添加以下权限, 无需再重复添加。

```xml
  <uses-permission android:name="android.permission.CAMERA" />
  <uses-permission android:name="android.permission.RECORD_AUDIO" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 第三步 引入头文件

```dart
// 导入头文件
import 'package:em_chat_uikit/chat_uikit.dart';
```

### 第四步 初始化单群聊 UIKit

项目中用到的组件都需要在 `ChatUIKitTheme` 内部使用。使用单群聊 UIKit 时，首先要配置 `ChatUIKitTheme`。

```dart
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      ...
      builder: (context, child) {
        return ChatUIKitTheme(child: child!);
      },
    );
  }
```

在 App 启动时初始化即时通讯 SDK。

```dart
void main() {
  ChatUIKit.instance
      .init(options: Options(appKey: appkey, autoLogin: false))
      .then((value) {
    runApp(const MyApp());
  });
}
```

### 第五步 登录单群聊 UIKit

`ChatUIKit` 提供以下两种登录方式：

- 使用用户 ID 和密码登录：

```dart
ChatUIKit.instance.loginWithPassword(userId: userId, password: password);
```

- 使用用户 ID 和用户 token 登录：

```dart
ChatUIKit.instance.loginWithToken(userId: userId, token: token);
```

### 第六步 搭建界面

单群聊 UIKit 提供会话列表、聊天、群组设置和通讯录等组件。你可以使用这些组件搭建界面，这些组件支持自定义，具体可以参考相应组件的文档。

下面以会话列表和聊天组件组成的界面为例：

```dart
import 'package:em_chat_uikit/chat_uikit.dart';
import 'package:flutter/material.dart';

class Conversations extends StatefulWidget {
  const Conversations({super.key});

  @override
  State<Conversations> createState() => _ConversationsState();
}

class _ConversationsState extends State<Conversations> {
  @override
  Widget build(BuildContext context) {
    return const ConversationsView();
  }
}
```

### 第七步 打包 app

安卓打包时，需要在 `project/android/app/proguard-rules.pro` 文件中（如不存在，新建一个即可）增加以下代码：

```dart
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```
