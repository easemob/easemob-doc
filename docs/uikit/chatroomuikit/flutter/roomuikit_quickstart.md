# 快速开始

<Toc />

利用 `chatroom_uikit`，你可以轻松实现聊天室内的用户交互。本文介绍如何实现在聊天室中发送消息。

## 前提条件

- 即时通讯 SDK 3.0.0（包含）-4.0.0；
- Flutter 3.3.0 或以上版本；
- 有效的环信即时通讯 IM 开发者账号和 [App Key](/product/console/app_manage.html#查看应用信息)。

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
flutter pub get add chatroom_uikit
```

### 第四步 初始化 chatroom_uikit

你可以在应用加载时或使用 `chatroom_uikit` 之前对其进行初始化。

初始化时，需传入 App Key。你可以在[环信控制台](https://console.easemob.com/user/login)的**应用详情**页面查看 App Key。

```dart
void main() async {
  assert(appKey.isNotEmpty, 'appKey is empty');
  await ChatroomUIKitClient.instance.initWithAppkey(
    appKey,
  );
  runApp(const MyApp());
}
```

### 第五步 登录 chatroom_uikit

在 [环信控制台](https://console.easemob.com/user/login) 创建用户，获取用户 ID 和用户 token 登录 `chatroom_uikit`。详见 [创建用户文档](/product/console/operation_user.html#创建用户)。

:::tip
若你已集成了 IM SDK，SDK 的所有用户 ID 均可用于登录 `chatroom_uikit`。
:::

在生产环境中，为了安全考虑，你需要在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，使你的用户从你的应用服务器获取 Token。

登录服务, 可使用 `userId` 和 `password` 登录，也可以使用 `userId` 和 token 进行登录。

- 使用 `userId` 和 `password` 登录：

```dart
// ...
//设置当前用户的头像和昵称
 UserEntity user = UserEntity(userId, nickname: nickname, avatarURL: avatarURL);
try {
  // 通过密码登录
  await ChatroomUIKitClient.instance.loginWithPassword(
    userId: userId!,
    password: password,
    userInfo: user,
  );

} on ChatError catch (e) {
  // error.
}
```

- 使用 `userId` 和 token 登录：

```dart
//设置当前用户的头像和昵称
 UserEntity user = UserEntity(userId, nickname: nickname, avatarURL: avatarURL);
try {
  await ChatroomUIKitClient.instance.loginWithToken(
    userId: userId,
    token: token!,
    userInfo: user,
  );

} on ChatError catch (e) {
  // error.
}
```

### 第六步 设置主题颜色

可以通过 `ChatUIKitTheme` 进行主题设置，默认提供了 `light` 和 `dart` 两种主题:

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


### 第七步 使用 chatroom_uikit 组件

1. 需要确保 `ChatUIKitTheme` 在 `ChatroomUIKit` 组件在你项目的父节点，建议将 `ChatUIKitTheme` 放到项目的根节点。

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


2. 在需要使用 `chatroom_uikit` 时，需要先创建 `ChatroomController`, 并使 `ChatRoomUIKit` 作为当前页面的根节点，并将其他组件作为 `ChatRoomUIKit` 的子组件。

```dart
// roomId: 需要加入的房间id；
// ownerId: 房主id；
ChatroomController controller = ChatroomController(roomId: roomId, ownerId: ownerId);

@override
Widget build(BuildContext context) {
  Widget content = Scaffold(
    resizeToAvoidBottomInset: false,
    appBar: AppBar(),
    body: ChatRoomUIKit(
      controller: controller,
      child: (context) {
        // 在子组件中构建页面，比如 礼物弹窗，消息列表等。
        return ...;
      },
    ),
  );

  return content;
}

```

### 第八步 发送第一条消息

输入消息内容，点击 **发送** 按钮，发送消息。

![img](/images/uikit/chatroomandroid/click_chat.png =500x500)
