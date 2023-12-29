
# 可配置项

`chatroom_uikit` 的组件中包含各种属性，你可以根据需求进行设置。

 `chatroom_uikit` 主要包括如下组件：

| 组件名称        | 组件介绍          |
| --------------- | ---------------------------- |
| [ChatroomLocal 组件](#chatroomlocal-组件)            | 可以设置 `UIKit` 所有 UI 组件的语言。         |
| [ChatRoomUIKit 组件](#chatroomuikit-组件)       | 提供基础的聊天室页面。     |
| [ChatroomMessageListView 组件](#chatroommessagelistview-组件)      | 聊天室消息区域组件，用于显示发送或者接收到的消息。             |
| [ChatroomParticipantsListView 组件](#chatroomparticipantslistview-组件) | 聊天室成员列表组件，包括聊天室成员和禁言成员的管理。   |
| [ChatroomGiftMessageListView 组件](#chatroomgiftmessagelistview-组件) | 聊天室打赏消息区域组件，用于显示打赏的礼物。      |
| [ChatroomGlobalBroadcastView 组件](#chatroomglobalbroadcastview-组件) | 聊天室全局广播组件，用于向 app 下的所有聊天室发送消息。   |
| [ChatInputBar 组件](#chatinputbar-组件)   | 聊天室底部工具栏区域，可以与消息输入组件互相切换，支持添加自定义按钮。         |
| [ChatRoomGiftListView 组件](#chatroomgiftlistview-组件) | 发送礼物组件，用于发送礼物，礼物来源由开发者指定。                   |
| [ChatroomReportListView 组件](#chatroomreportlistview-组件)   | 聊天室举报组件。     |

## ChatroomLocal 组件

UIKit 支持多国语言切换，目前内置中文和英文，可以扩展其他语言。

例如：若要 UIKit 使用英文显示，可以如下设置：

```dart
final FlutterLocalization _localization = FlutterLocalization.instance;
_localization.init(mapLocales: [
  const MapLocale('zh', ChatroomLocal.zh),
  const MapLocale('en', ChatroomLocal.en),
], initLanguageCode: 'zh');

...

return MaterialApp(
      title: 'Flutter Demo',
      supportedLocales: _localization.supportedLocales,
      localizationsDelegates: _localization.localizationsDelegates,
      ...
);

```

## ChatRoomUIKit 组件

ChatRoomUIKit 组件为聊天室组件，可以用来快速提供聊天室页面，并提供了聊天室事件监听和输入组件的自定义。

示例如下：

```dart
ChatroomController controller =
        ChatroomController(roomId: widget.roomId, ownerId: widget.ownerId);
...

@override
Widget build(BuildContext context) {
  return ChatRoomUIKit(
          controller: controller,
          inputBar: ChatInputBar( // 自定义你需要的输入样式
            actions: [
              InkWell(
                onTap: () => controller.showGiftSelectPages(),
                child: Padding(
                  padding: const EdgeInsets.all(3),
                  child: Image.asset('images/send_gift.png'),
                ),
              ),
            ],
          ),
          child: (context) {
            // 返回你的 widget
            return Container();
          },
        );
}

```

## ChatroomMessageListView 组件

聊天室消息区域组件 `ChatroomMessageListView` 提供消息的显示，聊天室接收到的文本消息、表情消息、礼物消息以及发送成功的消息会显示在该区域。

可以在消息区域中对消息进行操作，例如，翻译文本消息为目标语言、撤销消息和消息上报等。你可以通过长按消息列表项弹出菜单进行相应操作。

数据上报组件支持自定义选项，可以自定义选项上报不同内容。

示例代码如下：

```dart
ChatroomController controller =
        ChatroomController(roomId: widget.roomId, ownerId: widget.ownerId);
...

@override
Widget build(BuildContext context) {
  return ChatRoomUIKit(
          controller: controller,
          inputBar: ChatInputBar( // 自定义你需要的输入样式
            actions: [
              InkWell(
                onTap: () => controller.showGiftSelectPages(),
                child: Padding(
                  padding: const EdgeInsets.all(3),
                  child: Image.asset('images/send_gift.png'),
                ),
              ),
            ],
          ),
          child: (context) {
            return Stack(
              children: [
                const Positioned(
                  left: 16,
                  right: 78,
                  height: 204,
                  bottom: 90,
                  child: ChatroomMessageListView(), // 添加消息列表并设置位置
                )
              ],
            );
          },
        );
}
```

`ChatroomMessageListView` 提供的属性如下表所示：

| 属性                     | 是否必需 | 描述                                                          |
| ------------------------ | -------- | ----------------------------------------------- |
| onTap                  | 否     | 消息列表点击事件。                                                |
| onLongPress            | 否     | 消息列表长按事件。                                                |
| itemBuilder          | 否     | 消息列表项 build，可以用于自定义显示样式。
| reportController           | 否     | `ChatReportController` 用于自定义举报内容，默认使用 `DefaultReportController`。           |
| controller                 | 否     | `ChatroomMessageListController`, 用于配置默认长按事件，默认使用 `DefaultMessageListController`。     |

## ChatroomParticipantsListView 组件

聊天室成员组件可以显示和管理聊天室成员，聊天室所有者、禁言列表以及管理权限。

聊天室所有者可以修改成员状态，例如，对成员禁言或踢出聊天室。

:::tip
该组件不支持自定义。
:::

## ChatroomGiftMessageListView 组件

聊天室打赏消息区域组件 `ChatroomGiftMessageListView` 用于展示发送的礼物效果，礼物消息可以显示在消息列表，也可以显示在该组件单独对礼物进行显示。

示例代码如下：

```dart
ChatroomController controller =
        ChatroomController(roomId: widget.roomId, ownerId: widget.ownerId);
...

@override
Widget build(BuildContext context) {
  return ChatRoomUIKit(
          controller: controller,
          inputBar: ChatInputBar( // 自定义你需要的输入样式
            actions: [
              InkWell(
                onTap: () => controller.showGiftSelectPages(),
                child: Padding(
                  padding: const EdgeInsets.all(3),
                  child: Image.asset('images/send_gift.png'),
                ),
              ),
            ],
          ),
          child: (context) {
            return Stack(
              children: [
              const Positioned(
                left: 16,
                right: 100,
                height: 84,
                bottom: 300,
                child: ChatroomGiftMessageListView(), // 设置礼物展示区域
              ),
                const Positioned(
                  left: 16,
                  right: 78,
                  height: 204,
                  bottom: 90,
                  child: ChatroomMessageListView(), // 添加消息列表并设置位置
                )
              ],
            );
          },
        );
}
```

`ChatroomGiftMessageListView` 提供的属性如下表所示：

| 属性                    | 是否必需 | 描述                                          |
| ----------------------- | -------- | ---------------------------------------------- |
| giftWidgetBuilder                 | 否     | 单个礼物展示的 builder。  |
| placeholder          | 否     | 默认图片占位符，当礼物图片下载成功之前用于占位。 |

## ChatroomGlobalBroadcastView 组件

全局广播通知组件 `ChatroomGlobalBroadcastView` 接收和显示全局全局广播，也是通过添加消息到队列排队显示。

简单示例如下：

```dart
ChatroomController controller =
        ChatroomController(roomId: widget.roomId, ownerId: widget.ownerId);
...

@override
Widget build(BuildContext context) {
  return ChatRoomUIKit(
          controller: controller,
          inputBar: ChatInputBar( // 自定义你需要的输入样式
            actions: [
              InkWell(
                onTap: () => controller.showGiftSelectPages(),
                child: Padding(
                  padding: const EdgeInsets.all(3),
                  child: Image.asset('images/send_gift.png'),
                ),
              ),
            ],
          ),
          child: (context) {
            return Stack(
              children: [
              Positioned(
                top: MediaQuery.of(context).viewInsets.top + 10,
                height: 20,
                left: 20,
                right: 20,
                child: ChatroomGlobalBroadcastView(),  // 用于展示广播消息
              ),
              const Positioned(
                left: 16,
                right: 100,
                height: 84,
                bottom: 300,
                child: ChatroomGiftMessageListView(), // 设置礼物展示区域
              ),
                const Positioned(
                  left: 16,
                  right: 78,
                  height: 204,
                  bottom: 90,
                  child: ChatroomMessageListView(), // 添加消息列表并设置位置
                )
              ],
            );
          },
        );
}
```

`ChatroomGlobalBroadcastView` 提供的属性如下表所示：

| 属性                    | 是否必需 | 描述                                                |
| ----------------------- | -------- | ---------------------------------------------------- |
| icon                 | 否     | 设置收到广播时的图标。                                     |
| textStyle               | 否     | 设置广播内容字体。                       |
| backgroundColor          | 否     | 设置广播背景颜色。 |

## ChatInputBar 组件

消息输入框组件 `ChatInputBar` 可以发送文本、表情等消息，可以与聊天室底部工具栏区域互相动态切换。当点击聊天室底部工具栏区域组件时切换到输入状态，发送消息或者关闭输入框时切换为聊天室底部工具栏区域组件。

简单示例如下：

```dart
 Widget build(BuildContext context) {
    Widget content = ChatRoomUIKit(
      controller: controller,
      inputBar: ChatInputBar( // 添加一个礼物按钮
        actions: [
          InkWell(
            onTap: () => controller.showGiftSelectPages(),
            child: Padding(
              padding: const EdgeInsets.all(3),
              child: Image.asset('assets/images/send_gift.png'),
            ),
          ),
        ],
      ),
    );
 }
```

`ChatInputBar` 提供的属性如下表所示：

| 属性                   | 是否必需 | 描述                                          |
| ---------------------- | -------- | --------------------------------------------- |
| inputIcon     | 否     | 显示图标。                |
| inputHint     | 否     | 未输入时占位字符。            |
| leading               | 否     | 输入区域左侧区域 widget。                          |
| actions | 否     | 输入区域右侧区域 widget 数组，最多允许有 3 个 widget。                              |
| textDirection         | 否     | 输入区域的方向              |
| onSend                  | 否     | 点击**发送**按钮的回调。|

## ChatRoomGiftListView 组件

礼物列表组件 `ChatRoomGiftListView` 提供自定义礼物列表，点击礼物项的发送按钮发送到聊天室。可以通过配置 `ChatroomController#giftControllers` 进行内容填充。

`giftControllers` 为 `ChatroomGiftPageController` 数组，`chatroom_uikit` 默认提供 `DefaultGiftPageController` 实现。

:::tip
礼物列表组件是一个独立的组件，需要应用开发者自行实现显示和加载等操作。
:::

示例代码如下：

```dart
ChatroomController controller = ChatroomController(
      roomId: widget.room.id,
      ownerId: widget.room.ownerId,
      giftControllers: () async {
        List<DefaultGiftPageController> service = [];
        final value = await rootBundle.loadString('assets/data/Gifts_cn.json'); // 解析json，并赋值给 giftControllers。
        Map<String, dynamic> map = json.decode(value);
        for (var element in map.keys.toList()) {
          service.add(
            DefaultGiftPageController(
              title: element,
              gifts: () {
                List<GiftEntityProtocol> list = [];
                map[element].forEach((element) {
                  GiftEntityProtocol? gift = ChatroomUIKitClient
                      .instance.giftService
                      .giftFromJson(element);
                  if (gift != null) {
                    list.add(gift);
                  }
                });
                return list;
              }(),
            ),
          );
        }
        return service;
      }(),
    );
```

## ChatroomReportListView 组件

消息举报组件 `ChatroomReportListView`，默认界面不提供自定义部分，可以通过配置进行内容修改。

示例代码如下：

```dart
// 修改举报内容：
ChatRoomSettings.reportMap = {'tag': 'reason'};
```
