# 快速开始

利用 em_chat_uikit 提供的 UI 组件，你可以轻松实现应用内的聊天。em_chat_uikit 支持单聊、群聊和聊天室会话。本文介绍如何实现在单聊会话中发送消息。

<img src=@static/images/uikit/chatflutter/ChatConversationsView.png  title=“会话列表界面” width="300"/>&nbsp;&nbsp;
<img src=@static/images/uikit/chatflutter/ChatMessagesView.png  title=聊天页面 width="300"/>

## 前提条件

集成 em_chat_uikit 前，你的开发环境需要满足以下条件：

1. 有效的环信即时通讯 IM 开发者账号，创建应用并获取 App Key。
2. 在[环信控制台](https://console.easemob.com/index)[创建两个用户用于聊天](/product/enable_and_configure_IM.html#创建-im-用户)。

### Android 平台

- Flutter 2.5.0 或以上版本
- Dart 2.19.1 或以上版本
- macOS 或 Windows 系统
- 支持 JDK 1.8 或以上版本的 Android Studio 4.0 或以上版本
- 运行 Android SDK API 级别 21 或以上的 Android 模拟器或真机

### iOS 平台

- Flutter 2.5.0 或以上版本
- Dart 2.19.1 或以上版本
- macOS
- 安装有 Xcode 命令行工具的 Xcode 12.4 或以上版本
- CocoaPods
- 运行 iOS 10.0 或以上版本的 iOS 模拟器或真机

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

## 防止代码混淆

安卓中需要配置防止代码混淆，在 `proguard-rules.pro` 文件中添加以下代码：

```
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

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

em_chat_uikit 使用了以下第三方依赖库：

```dart
dependencies:
  intl: ^0.18.0
  image_picker: ^0.8.6+4
  file_picker: ^4.6.1
  record: ^4.4.4
  audioplayers: ^3.0.1
  im_flutter_sdk: ^4.1.0
```

### 第二步 初始化即时通讯 IM SDK 

在 app 的 `main` 下调用 SDK 初始化方法。

:::notice
em_chat_uikit 不包含 IM SDK 的初始化和登录，使用时确保已完成 SDK 初始化和登录。
:::

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final options = ChatOptions(
    appKey: <#Your AppKey#>,
  );
  await EMClient.getInstance.init(options);
  runApp(const MyApp());
}
```

#### 第三步 创建聊天界面

em_chat_uikit 提供了 `ChatMessagesView`，添加到 `build` 中，传入必填参数 `conversation` 及所需的可选参数即可。详见[聊天界面参数描述](ui_chat.html#创建聊天界面)。

1. 通过 IM SDK 获取一个本地会话。

```dart
// targetId: 接收方的用户 ID。单聊为对方的用户 ID，群聊为群组 ID，聊天室为聊天 室 ID。
// type: 单聊为 `EMConversationType.Chat`, 群聊为 `EMConversationType.GroupChat`, 聊天室为 `EMConversationType.ChatRoom`。
EMConversation conversation = await EMClient.getInstance.chatManager.getConversation(targetId, type: EMConversationType.Chat);
```

2. 将会话传递给 `ChatMessagesView`。

```dart
class MessagesPage extends StatefulWidget {
  const MessagesPage(this.conversation, {super.key});

  final EMConversation conversation;

  @override
  State<MessagesPage> createState() => _MessagesPageState();
}

class _MessagesPageState extends State<MessagesPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.conversation.id),
      ),
      body: SafeArea(
        // UIKit 中的聊天界面。
        child: ChatMessagesView(
          conversation: widget.conversation,
        ),
      ),
    );
  }
}
```

<img src=@static/images/uikit/chatflutter/MessagesPage.png  width="300" height="700"/>
