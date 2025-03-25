# 环信即时通讯 IM Flutter SDK 

// TODO：以 Flutter 端为例进行描述
// TODO：优化后的架构与腾讯云的主要差别在于应用场景没有配图，产品经理是否配图，如果是，需提供图。
// TODO：产品提供一下 SDK 的说明和环信 IM 的说明。

环信即时通讯 IM Flutter SDK 支持丰富的消息类型、包括文本、图片、音频、视频、位置、自定义等，提供单聊、群聊和聊天室功能，轻松构建满足不同场景需求的高效沟通平台，助力用户享受流畅便捷的交流方式。

## 关于环信即时通讯 IM

即时通讯 IM 为开发者提供高可靠、低时延、高并发、安全、全球化的即时聊天云服务，支持单聊、群聊、聊天室，提供多平台 SDK 支持，包括 Android、iOS、Web、Windows、Unity、Flutter、React Native 和小程序，同时提供服务端 RESTful API 以及单群聊 UIKit，帮助开发者快速构建端到端的即时通讯场景。

你可以登录[环信控制台](https://console.easemob.com/user/login)对环信即时通讯 IM 进行配置和管理。

关于环信即时通讯 IM 的更多详情，请参见[环信官网介绍](https://www.easemob.com/)。

## 应用场景

- 应用内聊天
- 应用内通知
- 视频/语音直播
- 企业协作
- 游戏交流
- 在线教育
- 买家卖家沟通
- 线上问诊

## 快速开始 

通过本文可以实现一个集成聊天 SDK 的简单 app。

### 前提条件 

开始前，请确保你的开发环境满足如下要求：

- Xcode 12.4 或以上版本，包括命令行工具;
- iOS 11 或以上版本;
- Android SDK API 等级 21 或以上版本；
- Android Studio 4.0 或以上版本，包括 JDK 1.8 或以上版本;
- CocoaPods 包管理工具;
- Flutter 3.3.0 或以上版本;
- Dart 3.3.0 或以上版本;

配置开发或者运行环境如果遇到问题，请参考 [这里](https://docs.flutter.dev/get-started/install)。

### 项目设置 

#### 使用命令创建项目 

打开终端，进入需要创建项目的目录，输入命令进行 `flutter create` 项目创建：

```bash
flutter create quick_start
```

#### 设置 Android 

1. 打开文件 `quick_start/android/app/build.gradle` 在文件最后添加：

```gradle
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

```dart
-keep class io.agora.** {*;}
-dontwarn  io.agora.**
```

#### 设置 iOS 

iOS 需要 iOS 11.0 以上版本，

打开文件 `quick_start/ios/Runner.xcodeproj`，修改：`TARGETS -> General -> Deployment info`, 设置 iOS 版本为 11.0。

#### 集成 SDK 

在终端命令行，输入命令添加依赖：

```bash
cd quick_start
flutter pub add shengwang_chat_sdk
flutter pub get
```

### 添加示例代码 

打开 `quick_start/lib/main.dart` 文件，引入头文件：

```dart
import 'package:flutter/material.dart';
import 'package:shengwang_chat_sdk/shengwang_chat_sdk.dart';
```

修改 `_MyHomePageState` 代码：

```dart
class _MyHomePageState extends State<MyHomePage> {

  ScrollController scrollController = ScrollController();
  String _username = "";
  String _token = "";
  String _messageContent = "";
  String _chatId = "";
  final List<String> _logText = [];

  @override
  void initState() {
    super.initState();
    _initSDK();
    _addChatListener();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Container(
        padding: const EdgeInsets.only(left: 10, right: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.max,
          children: [
            TextField(
              decoration: const InputDecoration(hintText: "Enter username"),
              onChanged: (username) => _username = username,
            ),
            TextField(
              decoration: const InputDecoration(hintText: "Enter token"),
              onChanged: (token) => _token = token,
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Expanded(
                  flex: 1,
                  child: TextButton(
                    onPressed: _signIn,
                    child: const Text("SIGN IN"),
                    style: ButtonStyle(
                      foregroundColor: MaterialStateProperty.all(Colors.white),
                      backgroundColor:
                          MaterialStateProperty.all(Colors.lightBlue),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: TextButton(
                    onPressed: _signOut,
                    child: const Text("SIGN OUT"),
                    style: ButtonStyle(
                      foregroundColor: MaterialStateProperty.all(Colors.white),
                      backgroundColor:
                          MaterialStateProperty.all(Colors.lightBlue),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            TextField(
              decoration: const InputDecoration(
                  hintText: "Enter the username you want to send"),
              onChanged: (chatId) => _chatId = chatId,
            ),
            TextField(
              decoration: const InputDecoration(hintText: "Enter content"),
              onChanged: (msg) => _messageContent = msg,
            ),
            const SizedBox(height: 10),
            TextButton(
              onPressed: _sendMessage,
              child: const Text("SEND TEXT"),
              style: ButtonStyle(
                foregroundColor: MaterialStateProperty.all(Colors.white),
                backgroundColor: MaterialStateProperty.all(Colors.lightBlue),
              ),
            ),
            Flexible(
              child: ListView.builder(
                controller: scrollController,
                itemBuilder: (_, index) {
                  return Text(_logText[index]);
                },
                itemCount: _logText.length,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _initSDK() async {
  }

  void _addChatListener() {
  }

  void _signIn() async {
  }

  void _signOut() async {
  }

  void _sendMessage() async {
  }

  void _addLogToConsole(String log) {
    _logText.add(_timeString + ": " + log);
    setState(() {
      scrollController.jumpTo(scrollController.position.maxScrollExtent);
    });
  }

  String get _timeString {
    return DateTime.now().toString().split(".").first;
  }
}
```

#### 初始化 SDK 

在 `_initSDK` 方法中添加 SDK 初始化：

```dart
void _initSDK() async {
    ChatOptions options = ChatOptions.withAppId(
        "<#Your AppId#>",
        autoLogin: false,
    );
    await ChatClient.getInstance.init(options);
    // 通知 SDK UI 已准备好。该方法执行后才会收到 `ChatRoomEventHandler`、`ChatContactEventHandler` 和 `ChatGroupEventHandler` 回调。
    await ChatClient.getInstance.startCallback();
}
```

#### 注册即时通讯 IM 用户 

1. 创建用户

在[声网控制台](https://console.shengwang.cn/overview)按照如下步骤创建用户：

1. 展开控制台左上角下拉框，选择需要开通即时通讯 IM 服务的项目。
2. 点击左侧导航栏的**全部产品**。
3. 在下拉列表中找到**即时通讯 IM** 并点击。
4. 在**即时通讯 IM** 页面，进入**运营管理**标签页。
5. 在**用户** 页签下，点击**创建IM用户**。
6. 在弹出的对话框中，配置用户相关参数，点击**确定**。

2. 获取用户 token

创建用户后，在用户列表点击对应的用户的**操作**一栏中的**更多**，选择**查看Token**。

在弹出的对话框中，可以查看用户 Token，也可以点击**重新生成**，生成用户 token。

#### 添加登录 

在 `_signIn` 方法中添加登录代码。

```dart
void _signIn() async {
    if (_username.isEmpty || _token.isEmpty) {
        _addLogToConsole("username or token is null");
        return;
    }

    try {
        await ChatClient.getInstance.loginWithToken(_username, _token);
        _addLogToConsole("sign in succeed, username: $_username");
    } on ChatError catch (e) {
        _addLogToConsole("sign in failed, e: ${e.code} , ${e.description}");
    }
}
```

#### 添加退出 

在 `_signOut` 方法中添加退出代码。

```dart
void _signOut() async {
    try {
        await ChatClient.getInstance.logout(true);
        _addLogToConsole("sign out succeed");
    } on ChatError catch (e) {
        _addLogToConsole(
            "sign out failed, code: ${e.code}, desc: ${e.description}");
    }
}
```

#### 添加发消息 

在 `_sendMessage` 方法中添加发消息代码。

```dart
void _sendMessage() async {
  if (_chatId.isEmpty || _messageContent.isEmpty) {
    _addLogToConsole("single chat id or message content is null");
    return;
  }

  var msg = ChatMessage.createTxtSendMessage(
    targetId: _chatId,
    content: _messageContent,
  );

  ChatClient.getInstance.chatManager.sendMessage(msg);
}
```

#### 添加收消息监听 

在 `_addChatListener` 方法中添加代码。

```dart
void _addChatListener() {

  // 添加消息状态变更监听
  ChatClient.getInstance.chatManager.addMessageEvent(
      // ChatMessageEvent 对应的 key。
        "UNIQUE_HANDLER_ID",
        ChatMessageEvent(
          onSuccess: (msgId, msg) {
            _addLogToConsole("send message succeed");
          },
          onProgress: (msgId, progress) {
            _addLogToConsole("send message succeed");
          },
          onError: (msgId, msg, error) {
            _addLogToConsole(
              "send message failed, code: ${error.code}, desc: ${error.description}",
            );
          },
        ));


  // 添加收消息监听
  ChatClient.getInstance.chatManager.addEventHandler(
    // ChatEventHandler 对应的 key。
    "UNIQUE_HANDLER_ID",
    ChatEventHandler(
      onMessagesReceived: (messages) {
        for (var msg in messages) {
          switch (msg.body.type) {
            case MessageType.TXT:
              {
                ChatTextMessageBody body = msg.body as ChatTextMessageBody;
                _addLogToConsole(
                  "receive text message: ${body.content}, from: ${msg.from}",
                );
              }
              break;
            case MessageType.IMAGE:
              {
                _addLogToConsole(
                  "receive image message, from: ${msg.from}",
                );
              }
              break;
            case MessageType.VIDEO:
              {
                _addLogToConsole(
                  "receive video message, from: ${msg.from}",
                );
              }
              break;
            case MessageType.LOCATION:
              {
                _addLogToConsole(
                  "receive location message, from: ${msg.from}",
                );
              }
              break;
            case MessageType.VOICE:
              {
                _addLogToConsole(
                  "receive voice message, from: ${msg.from}",
                );
              }
              break;
            case MessageType.FILE:
              {
                _addLogToConsole(
                  "receive image message, from: ${msg.from}",
                );
              }
              break;
            case MessageType.CUSTOM:
              {
                _addLogToConsole(
                  "receive custom message, from: ${msg.from}",
                );
              }
              break;
            case MessageType.COMBINE:
                {
                  _addLogToConsole(
                      "receive combine message, from: ${msg.from}");
              }
              break;
            case MessageType.CMD:
              {
                // 当前回调中不会有 CMD 类型消息，CMD 类型消息通过 `ChatEventHandler#onCmdMessagesReceived` 回调接收
              }
              break;
          }
        }
      },
    ),
  );
}
```

#### 移除消息监听 

在 `dispose` 方法中添加代码移除监听：

```dart
@override
void dispose() {
  // 移除消息状态监听
  ChatClient.getInstance.chatManager.removeMessageEvent("UNIQUE_HANDLER_ID");
  // 移除收消息监听
  ChatClient.getInstance.chatManager.removeEventHandler("UNIQUE_HANDLER_ID");
  super.dispose();
}
```

### 运行项目 

以 iOS 为例，首先打开模拟器，然后在终端运行以下命令。

```bash
flutter run
```

### 后续步骤 

为保障通信安全，在正式生产环境中，你需要在自己的 app 服务端生成 Token。详见使用 Token 鉴权。


## API 文档

关于 API 详情，请参见 [官网 API 参考](https://sdkdocs.easemob.com/apidoc/flutter/index.html)文档。

## 更新日志

关于版本更新日志，请参见 [官网更新日志](https://doc.easemob.com/document/flutter/releasenote.html)文档。

## 参考

[集成文档](https://doc.easemob.com/document/flutter/integration.html)

[环信即时通讯 IM 产品介绍](https://doc.easemob.com/product/introduction.html)

## 关键字

// TODO：这里的关键字链接到官网的文档

消息、会话、群组、聊天室、离线推送、用户关系







