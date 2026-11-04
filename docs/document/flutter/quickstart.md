# 快速开始

通过本文可以实现一个集成聊天 SDK 的简单 app。

## 实现原理

下图展示在客户端发送和接收一对一文本消息的工作流程。

![img](/images/android/sendandreceivemsg.png)

如上图所示，发送和接收单聊消息的步骤如下：

1. 客户端向你的应用服务器请求 Token，你的应用服务器返回 Token。
2. 客户端 A 和客户端 B 使用获得的 Token 登录环信即时通讯系统。
3. 客户端 A 发送消息到环信即时通讯服务器。
4. 环信即时通讯服务器将消息发送到客户端 B，客户端 B 接收消息。

## 前提条件

开始前，请确保你的开发环境满足如下要求：

- iOS 13.0 或以上版本；
- Android `minSdkVersion` 21，`compileSdkVersion` 34 或以上；
- Flutter 3.3.0 或以上版本；
- Dart 3.3.0 或以上、4.0.0 以下版本；

配置开发或者运行环境如果遇到问题，请参考 [这里](https://docs.flutter.dev/get-started/install)。

- 有效的环信即时通讯 IM 开发者账号和 App Key，详见 [环信控制台](https://console.easemob.com/user/login)。

## 项目设置

### 使用命令创建项目

打开终端，进入需要创建项目的目录，输入命令进行 `flutter create` 项目创建：

```bash
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

如果你的工程使用 Kotlin DSL，则打开 `quick_start/android/app/build.gradle.kts`，设置 `compileSdk` 和 `minSdk`：

```kotlin
android {
    compileSdk = 34

    defaultConfig {
        minSdk = 21
    }
}
```

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

### 集成 SDK

在项目的 `pubspec.yaml` 文件中添加 Flutter SDK 5.x 依赖：

```yaml
dependencies:
  im_flutter_sdk: ^5.0.0
```

然后执行：

```shell
cd quick_start
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

  final ScrollController scrollController = ScrollController();
  String _username = "";
  String _token = "";
  String _messageContent = "";
  String _chatId = "";
  final List<String> _logText = [];
  bool _isSdkReady = false;

  @override
  void initState() {
    super.initState();
    _initialize();
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
                    onPressed: _isSdkReady ? _signIn : null,
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
                    onPressed: _isSdkReady ? _signOut : null,
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
              onPressed: _isSdkReady ? _sendMessage : null,
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

  Future<void> _initialize() async {
  }

  Future<void> _initSDK() async {
  }

  void _addChatListener() {
  }

  Future<void> _signIn() async {
  }

  Future<void> _signOut() async {
  }

  Future<void> _sendMessage() async {
  }

  void _addLogToConsole(String log) {
    if (!mounted) return;
    setState(() {
      _logText.add("$_timeString: $log");
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && scrollController.hasClients) {
        scrollController.jumpTo(scrollController.position.maxScrollExtent);
      }
    });
  }

  String get _timeString {
    return DateTime.now().toString().split(".").first;
  }
}
```

### 初始化 SDK

初始化 SDK，等待初始化和 `startCallback` 完成后再添加监听并启用登录、退出和发送按钮：

```dart
Future<void> _initialize() async {
  try {
    await _initSDK();
    _addChatListener();
    if (!mounted) return;
    setState(() {
      _isSdkReady = true;
    });
  } on ChatError catch (e) {
    _addLogToConsole(
      "init SDK failed, code: ${e.code}, desc: ${e.description}",
    );
  }
}

Future<void> _initSDK() async {
  final ChatOptions options = ChatOptions.withAppKey(
    "<#Your AppKey#>",
  );
  await ChatClient.getInstance.init(options);
  // 通知 SDK UI 已准备好。该方法执行后才会收到 `ChatRoomEventHandler`、`ChatContactEventHandler` 和 `ChatGroupEventHandler` 回调。
  await ChatClient.getInstance.startCallback();
}
```

### 创建用户

在 [环信控制台](https://console.easemob.com/user/login) 创建用户，获取用户 ID 和用户 token。详见 [创建用户文档](/product/console/operation_user.html#创建用户)。

在生产环境中，为了安全考虑，你需要在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，使你的用户从你的应用服务器获取 Token。


### 添加登录

在 `_signIn` 方法中添加登录代码。

```dart
Future<void> _signIn() async {
  if (_username.isEmpty || _token.isEmpty) {
    _addLogToConsole("username or token is null");
    return;
  }

  try {
    await ChatClient.getInstance.loginWithToken(_username, _token);
    _addLogToConsole("sign in succeed, username: $_username");
  } on ChatError catch (e) {
    _addLogToConsole("sign in failed, e: ${e.code}, ${e.description}");
  }
}
```

### 添加退出

在 `_signOut` 方法中添加退出代码。

```dart
Future<void> _signOut() async {
  try {
    await ChatClient.getInstance.logout(true);
    _addLogToConsole("sign out succeed");
  } on ChatError catch (e) {
    _addLogToConsole(
      "sign out failed, code: ${e.code}, desc: ${e.description}",
    );
  }
}
```

### 添加发消息

在 `_sendMessage` 方法中添加发消息代码。

```dart
Future<void> _sendMessage() async {
  if (_chatId.isEmpty || _messageContent.isEmpty) {
    _addLogToConsole("single chat id or message content is null");
    return;
  }

  var msg = ChatMessage.createTxtSendMessage(
    targetId: _chatId,
    content: _messageContent,
  );

  try {
    await ChatClient.getInstance.chatManager.sendMessage(msg);
  } on ChatError catch (e) {
    _addLogToConsole(
      "send message failed, code: ${e.code}, desc: ${e.description}",
    );
  }
}
```

### 添加收消息监听

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
            _addLogToConsole("send message progress: $progress");
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
                  "receive file message, from: ${msg.from}",
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
                  "receive combine message, from: ${msg.from}",
                );
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

### 移除消息监听

在 `dispose` 方法中添加代码移除监听：

```dart
@override
void dispose() {
  // 移除消息状态监听
  ChatClient.getInstance.chatManager.removeMessageEvent("UNIQUE_HANDLER_ID");
  // 移除收消息监听
  ChatClient.getInstance.chatManager.removeEventHandler("UNIQUE_HANDLER_ID");
  scrollController.dispose();
  super.dispose();
}
```

## 运行项目

以 iOS 为例，首先打开模拟器，然后在终端运行以下命令。

```bash
flutter run
```

运行结果如下：

<img src="/images/flutter/simulator_screen_shot1.png" width="500" />
