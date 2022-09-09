# 环信即时通讯 IM Flutter 快速入门

<Toc />

通过本文可以实现一个集成聊天 SDK 的简单 app。

## 实现原理

下图展示在客户端发送和接收一对一文本消息的工作流程。

![img](@static/images/android/sendandreceivemsg.png)

如上图所示，发送和接收单聊消息的步骤如下：

1. 客户端向你的应用服务器请求 Token，你的应用服务器返回 Token。
2. 客户端 A 和客户端 B 使用获得的 Token 登录环信即时通讯系统。
3. 客户端 A 发送消息到环信即时通讯服务器。
4. 环信即时通讯服务器将消息发送到客户端 B，客户端 B 接收消息。

## 前提条件

开始前，请确保你的开发环境满足如下要求：

- Xcode 12.4 或以上版本，包括命令行工具;
- iOS 10 或以上版本;
- Android SDK API 等级 21 或以上版本；
- Android Studio 4.0 或以上版本，包括 JDK 1.8 或以上版本;
- CocoaPods 包管理工具;
- Flutter 2.10 或以上版本;
- Dart 2.16 或以上版本;

[配置开发或者运行环境如果遇到问题，请参考这里](https://docs.flutter.dev/get-started/install)
- 有效的环信即时通讯 IM 开发者账号和 App Key，详见 [环信即时通讯云控制台](https://console.easemob.com/user/login)。

## 项目设置

### 使用命令创建项目

打开终端，进入需要创建项目的目录，输入命令进行 `flutter create` 项目创建：

```bash
flutter create quick_start
```

### 设置 Android

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
-keep class com.hyphenate.** {*;}
-dontwarn  com.hyphenate.**
```

### 设置 iOS

iOS 需要 iOS 10.0 以上版本，

打开文件 `quick_start/ios/Runner.xcodeproj`，修改：`TARGETS -> General -> Deployment info`, 设置 iOS 版本为 10.0。

### 集成 SDK

在终端命令行，输入命令添加依赖：

```bash
cd quick_start
flutter pub add im_flutter_sdk
flutter pub get
```

## 添加示例代码

打开 `quick_start/lib/main.dart` 文件，引入头文件：

```dart
import 'package:flutter/material.dart';
import 'package:im_flutter_sdk/im_flutter_sdk.dart';
```

修改 `_MyHomePageState` 代码：

```dart
class _MyHomePageState extends State<MyHomePage> {

  ScrollController scrollController = ScrollController();
  String _username = "";
  String _password = "";
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
              decoration: const InputDecoration(hintText: "Enter password"),
              onChanged: (password) => _password = password,
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
                const SizedBox(width: 10),
                Expanded(
                  child: TextButton(
                    onPressed: _signUp,
                    child: const Text("SIGN UP"),
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

  void _signUp() async {
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

### 初始化 SDK

在 `_initSDK` 方法中添加 SDK 初始化：

```dart
void _initSDK() async {
    EMOptions options = EMOptions(
        appKey: "<#Your AppKey#>",
        autoLogin: false,
    );
    await EMClient.getInstance.init(options);
}
```

### 注册环信 IM 用户

Demo 中使用 [开放注册](https://docs-im.easemob.com/im/server/ready/user?s[]=%E5%BC%80%E6%94%BE%E6%B3%A8%E5%86%8C)，在开放注册模式下，允许通过 App 注册，正式环境中请使用授权。

在 `_signUp` 方法中添加注册代码：

```dart
void _signUp() async {
  if (_username.isEmpty || _password.isEmpty) {
    _addLogToConsole("username or password is null");
    return;
  }

  try {
    await EMClient.getInstance.createAccount(_username, _password);
    _addLogToConsole("sign up succeed, username: $_username");
  } on EMError catch (e) {
    _addLogToConsole("sign up failed, e: ${e.code} , ${e.description}");
  }
}
```

### 添加登录

在 `_signIn` 方法中添加登录代码。

```dart
void _signIn() async {
    if (_username.isEmpty || _password.isEmpty) {
        _addLogToConsole("username or password is null");
        return;
    }

    try {
        await EMClient.getInstance.login(_username, _password);
        _addLogToConsole("sign in succeed, username: $_username");
    } on EMError catch (e) {
        _addLogToConsole("sign in failed, e: ${e.code} , ${e.description}");
    }
}
```

### 添加退出

在 `_signOut` 方法中添加退出代码。

```dart
void _signOut() async {
    try {
        await EMClient.getInstance.logout(true);
        _addLogToConsole("sign out succeed");
    } on EMError catch (e) {
        _addLogToConsole(
            "sign out failed, code: ${e.code}, desc: ${e.description}");
    }
}
```

### 添加发消息

在 `_sendMessage` 方法中添加发消息代码。

```dart
void _sendMessage() async {
  if (_chatId.isEmpty || _messageContent.isEmpty) {
    _addLogToConsole("single chat id or message content is null");
    return;
  }

  var msg = EMMessage.createTxtSendMessage(
    targetId: _chatId,
    content: _messageContent,
  );
  msg.setMessageStatusCallBack(MessageStatusCallBack(
    onSuccess: () {
      _addLogToConsole("send message succeed");
    },
    onError: (e) {
      _addLogToConsole(
        "send message failed, code: ${e.code}, desc: ${e.description}",
      );
    },
  ));
  EMClient.getInstance.chatManager.sendMessage(msg);
}
```

### 添加收消息监听

在 `_addChatListener` 方法中添加代码。

```dart
void _addChatListener() {
  EMClient.getInstance.chatManager.addEventHandle(
    // EMChatEventHandle 对应的 key。
    "UNIQUE_HANDLER_ID",
    EMChatEventHandler(
      onMessagesReceived: (messages) {
        for (var msg in messages) {
          switch (msg.body.type) {
            case MessageType.TXT:
              {
                EMTextMessageBody body = msg.body as EMTextMessageBody;
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
            case MessageType.CMD:
              {
                // 当前回调中不会有 CMD 类型消息，CMD 类型消息通过 `EMChatEventHandler#onCmdMessagesReceived` 回调接收
              }
              break;
          }
        }
      },
    ),
  );
}
```

### 移除消息监听

在 `dispose` 方法中添加代码移除监听：

```dart
@override
void dispose() {
  EMClient.getInstance.chatManager.removeEventHandle("UNIQUE_HANDLER_ID");
  super.dispose();
}
```

## 运行项目

以 iOS 为例，首先打开模拟器，之后在终端输入。

```bash
flutter run
```

运行结果如下：

<img src="@static/images/flutter/simulator_screen_shot1.png" width="500" />

参考以下步骤发送和接收文本消息：

1. 输入任意用户名（如 `flutter001` 和 `flutter002`）和密码 `1`，点击 `SIGN UP` 创建用户；
2. 以 `flutter001` 身份登录 Demo，将 `Enter the username you want to send` 输如为 `flutter002`， 发送文本消息；

<img src="@static/images/flutter/simulator_screen_shot2.png" width="500" />

3. 以 `flutter002` 身份登录 Demo，查看 Log 信息确认是否都到消息。

<img src="@static/images/flutter/simulator_screen_shot3.png" width="500" />

## 后续步骤

为保障通信安全，在正式生产环境中，你需要在自己的 app 服务端生成 Token。详见使用 [Token 鉴权](/product/easemob_app_token.html)。