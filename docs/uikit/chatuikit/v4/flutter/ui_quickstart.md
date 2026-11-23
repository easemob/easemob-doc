# 快速开始

利用 em_chat_uikit 提供的 UI 组件，你可以轻松实现应用内的聊天。em_chat_uikit 支持单聊、群聊和聊天室会话。本文介绍如何实现在单聊会话中发送消息。

<img src=/images/uikit/chatflutter/ChatConversationsView.png  title=“会话列表界面” width="300"/>&nbsp;&nbsp;
<img src=/images/uikit/chatflutter/ChatMessagesView.png  title=聊天页面 width="300"/>

## 前提条件

集成 em_chat_uikit 前，你的开发环境需要满足以下条件：

1. 有效的环信即时通讯 IM 开发者账号，创建应用并获取 App Key。
2. 在[环信控制台](https://console.easemob.com/index)[创建两个用户用于聊天](/product/console/operation_user.html#创建用户)。

### Android 平台

- Flutter 3.3.0 或以上版本
- Dart 3.0.0 或以上版本
- macOS 或 Windows 系统
- 支持 JDK 1.8 或以上版本的 Android Studio 4.0 或以上版本
- 运行 Android SDK API 级别 24 或以上的 Android 模拟器或真机

### iOS 平台

- Flutter 3.3.0 或以上版本
- Dart 3.0.0 或以上版本
- macOS
- 安装有 Xcode 命令行工具的 Xcode 12.4 或以上版本
- CocoaPods
- 运行 iOS 12.0 或以上版本的 iOS 模拟器或真机

## 所需权限

### Android

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.RECORD_AUDIO"/>
```

### iOS  

| 键 | 值 |
| :------------ | :------- |
| `Privacy - Microphone Usage Description` | 麦克风权限   |
| `Privacy - Camera Usage Description` | 摄像头权限  |
| `Privacy - Photo Library Usage Description` | 相册权限 |

## 发送第一条消息

### 第一步 集成 em_chat_uikit

em_chat_uikit 支持 pub.dev 接入和本地源码集成。

- pub.dev 接入集成：

```dart
flutter pub add em_chat_uikit
flutter pub get
```

- 本地源码集成：

```dart
dependencies:
    em_chat_uikit:
        path: `<#uikit path#>`
```

`em_chat_uikit` 会通过自身 `pubspec.yaml` 管理所需的 IM SDK 和第三方依赖，业务项目无需手动添加这些间接依赖。

### 第二步 初始化 ChatUIKit

在 app 的 `main` 下调用 `ChatUIKit` 初始化方法。

:::tip
使用 UIKit 组件前，需要先完成 `ChatUIKit` 初始化和登录。
:::

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ChatUIKit.instance.init(
    options: Options.withAppKey(appKey),
  );
  runApp(const MyApp());
}
```

#### 第三步 创建聊天界面

em_chat_uikit 提供了 `MessagesView`，添加到 `build` 中，传入必填参数 `profile` 及所需的可选参数即可。详见[聊天页面介绍](chatuikit_chat_intro.html#创建聊天页面)。

1. 创建对端用户的 `ChatUIKitProfile`。

```dart
// targetId: 接收方的用户 ID。
final profile = ChatUIKitProfile.contact(id: targetId);
```

2. 将用户信息传递给 `MessagesView`。

```dart
class MessagesPage extends StatefulWidget {
  const MessagesPage(this.profile, {super.key});

  final ChatUIKitProfile profile;

  @override
  State<MessagesPage> createState() => _MessagesPageState();
}

class _MessagesPageState extends State<MessagesPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.profile.id),
      ),
      body: SafeArea(
        // UIKit 中的聊天界面。
        child: MessagesView(
          profile: widget.profile,
        ),
      ),
    );
  }
}
```

<img src=/images/uikit/chatflutter/MessagesPage.png  width="300" height="700"/>
