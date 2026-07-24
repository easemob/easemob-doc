# 快速开始

<Toc />

利用 `em_chat_uikit` 内置的 ChatroomUIKit 能力，你可以轻松实现聊天室内的用户交互。本文介绍如何实现在聊天室中发送消息。

:::tip
ChatroomUIKit 已合并到 `em_chat_uikit` 中，当前版本不再单独发布 `chatroom_uikit` 包。请不要再通过 `flutter pub add chatroom_uikit` 集成。
:::

## 前提条件

- Flutter 3.3.0 或以上版本；
- Android minSDKVersion 24 或以上版本；
- iOS 12 或以上版本；
- 有效的环信即时通讯 IM 开发者账号和 [App Key](/product/console/app_manage.html#管理应用)。

## 操作流程

### 第一步 创建聊天室和用户

在环信控制台 [创建聊天室](/product/console/operation_chatroom.html#创建聊天室)和 [用户](/product/console/operation_user.html#创建用户)。

### 第二步 创建项目

```sh
flutter create --platforms=android,ios room_project
```

### 第三步 项目中安装 UIKit

进入创建的项目，执行以下命令：

```sh
flutter pub add em_chat_uikit
```

在 Dart 文件中引入 UIKit：

```dart
import 'package:em_chat_uikit/chat_uikit.dart';
```

### 第四步 初始化 ChatUIKit

你可以在应用加载时初始化 `ChatUIKit`。

初始化时，需传入 App Key。你可以在[环信控制台](https://console.easemob.com/user/login)的**应用概览**页面查看 App Key。

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  assert(appKey.isNotEmpty, 'appKey is empty');
  await ChatUIKit.instance.init(
    options: Options.withAppKey(appKey),
  );
  runApp(const MyApp());
}
```

### 第五步 登录 ChatUIKit

在 [环信控制台](https://console.easemob.com/user/login) 创建用户，获取用户 ID 和用户 token 登录 `ChatUIKit`。详见 [创建用户文档](/product/console/operation_user.html#创建用户)。

:::tip
若你已集成了 IM SDK，SDK 的所有用户 ID 均可用于登录 `ChatUIKit`。
:::

在生产环境中，为了安全考虑，你需要在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，使你的用户从你的应用服务器获取 Token。

登录服务可使用 `userId` 和密码登录，也可以使用 `userId` 和 token 登录。生产环境推荐使用 token 登录。

- 使用 `userId` 和 `password` 登录：

```dart
try {
  await ChatUIKit.instance.loginWithPassword(
    userId: userId,
    password: password,
  );
} on ChatError catch (e) {
  // error.
}
```

- 使用 `userId` 和 token 登录：

```dart
try {
  await ChatUIKit.instance.loginWithToken(
    userId: userId,
    token: token,
  );
} on ChatError catch (e) {
  // error.
}
```

### 第六步 设置主题颜色

可以通过 `ChatUIKitTheme` 进行主题设置，默认提供了 `light` 和 `dark` 两种主题:

```dart
ChatUIKitTheme(
  child: child,
),
```

如果需要修改主题色，可以通过修改`ChatUIKitColor` 的 `hue` 值：

```dart
ChatUIKitColor({
  this.primaryHue = 203,
  this.secondaryHue = 155,
  this.errorHue = 350,
  this.neutralHue = 203,
  this.neutralSpecialHue = 220,
  this.barrageLightness = LightnessStyle.oneHundred,
  this.isDark = false,
});
```


### 第七步 使用聊天室组件

1. 需要确保 `ChatUIKitTheme` 在聊天室组件的父节点，建议将 `ChatUIKitTheme` 放到项目的根节点。

```dart

@override
  Widget build(BuildContext context) {
    return MaterialApp(
      builder: (context, child) {
        return ChatUIKitTheme(child: child!);
      },
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
      ...
    );
  }
```


2. 在需要使用聊天室组件时，先加入聊天室，然后组合消息列表和输入组件。

```dart
class RoomPage extends StatefulWidget {
  const RoomPage({required this.roomId, super.key});

  final String roomId;

  @override
  State<RoomPage> createState() => _RoomPageState();
}

class _RoomPageState extends State<RoomPage> {
  final RoomInputBarController inputBarController = RoomInputBarController();

  @override
  void initState() {
    super.initState();
    ChatUIKit.instance.joinChatRoom(roomId: widget.roomId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          Positioned(
            left: 16,
            right: 78,
            height: 204,
            bottom: 90,
            child: ChatRoomMessagesWidget(roomId: widget.roomId),
          ),
          Positioned(
            left: 0,
            right: 0,
            bottom: 40,
            child: ChatRoomInputBar(
              controller: inputBarController,
              onSend: (text) {
                if (text.trim().isEmpty) {
                  return;
                }
                ChatUIKit.instance.sendMessage(
                  message: ChatRoomMessage.roomMessage(widget.roomId, text),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

### 第八步 发送第一条消息

输入消息内容，点击 **发送** 按钮，发送消息。

![img](/images/uikit/chatroomandroid/click_chat.png =500x500)
