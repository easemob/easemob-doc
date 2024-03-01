# 最佳实践

<Toc />

## 初始化 chatroom_uikit

初始化是使用 `chatroom_uikit` 的必要步骤，需在所有接口方法调用前完成。

```dart
void main() async {
  assert(appKey.isNotEmpty, 'appKey is empty');
  await ChatroomUIKitClient.instance.initWithAppkey(
    appKey,
  );
  runApp(const MyApp());
}
```

## 登录 chatroom_uikit

你可以通过使用项目中的用户对象并遵守 `UserInfoProtocol` 协议登录。chatroom_uikit 提供了默认的 `UserEntity` 实现，如果需要自己添加属性，可以继承 `UserEntity`：

- 使用用户 ID `userId` 和密码 `password` 登录：

```dart
// ...
//设置当前用户的头像和昵称。
 UserEntity user = UserEntity(userId, nickname: nickname, avatarURL: avatarURL);
try {
  // 通过密码登录。
  await ChatroomUIKitClient.instance.loginWithPassword(
    userId: userId!,
    password: password,
    userInfo: user,
  );

} on ChatError catch (e) {
  // error.
}
```

- 使用用户 ID `userId` 和 token 登录：

```dart
//设置当前用户的头像和昵称。
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

## 初始化聊天室视图

1. 使用聊天室视图，需要先配置主题，确保聊天室能正常加载到主题，

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

2. 获取聊天室列表，加入指定的聊天室。除此之外，你还可以在环信即时通讯云控制台上[创建聊天室](/product/enable_and_configure_IM.html#创建聊天室)，获取聊天室 ID。

3. 使用 `chatroom_uikit` 前，需要先创建 `ChatroomController`, 并使 `ChatRoomUIKit` 作为当前页面的根节点，并将其他组件作为 `ChatRoomUIKit` 的子节点。

```dart
// roomId: 需要加入的聊天室 ID。
// ownerId: 聊天室所有者的用户 ID。
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

## 监听聊天室的事件和错误

你可以在初始化 `ChatroomController` 时设置聊天室事件的监听器 `ChatroomEventListener`, 当前聊天室的相关事件会通过该回调返回。

```dart
controller = ChatroomController(
  listener: ChatroomEventListener((type, error) {
    // catch errors.
  }),
  roomId: widget.room.id,
  ownerId: widget.room.ownerId,
);
```

如果需要监听全局事件，可以使用 `ChatroomResponse` 和 `ChatroomEventResponse`

```dart

class _ChatroomViewState extends State<ChatroomView>
    with ChatroomResponse, ChatroomEventResponse {
  @override
  void initState() {
    super.initState();

    ChatroomUIKitClient.instance.roomService.bindResponse(this);
    ChatroomUIKitClient.instance.bindRoomEventResponse(this);
  }

  @override
  void dispose() {
    ChatroomUIKitClient.instance.roomService.unbindResponse(this);
    ChatroomUIKitClient.instance.unbindRoomEventResponse(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return const Placeholder();
  }
}

```

## 参考

若要了解以上最佳实践的详情，请访问 [GitHub 仓库](https://github.com/easemob/ChatroomDemo/tree/dev/flutter/chatroom_uikit_demo)。