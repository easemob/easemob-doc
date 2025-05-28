# 全局配置

默认配置项需要在应用启动时配置。

## 配置头像圆角

默认为 `CornerRadius.medium`。

```dart
ChatUIKitSettings.avatarRadius = CornerRadius.large;
```

## 配置搜索框圆角

默认为 `CornerRadius.small`。

```dart
ChatUIKitSettings.searchBarRadius = CornerRadius.large;
```

## 配置默认头像

默认为 `packages/em_chat_uikit/assets/images/default_avatar.png`。

```dart
ChatUIKitSettings.avatarPlaceholder = const AssetImage(
  'packages/em_chat_uikit/assets/images/default_avatar.png',
);
```

## 配置 Dialog 圆角

默认为 `ChatUIKitDialogRectangleType.filletCorner`。

```dart
ChatUIKitSettings.dialogRectangleType = ChatUIKitDialogRectangleType.circular;
```

## 配置会话列表是否显示头像

默认为 `true`。

```dart
ChatUIKitSettings.showConversationListAvatar = true;
```

## 配置会话列表是否显示未读数

默认为 `true`。

```dart
ChatUIKitSettings.showConversationListUnreadCount = true;
```

## 配置会话列表显示的静音图标

默认为 `packages/em_chat_uikit/assets/images/no_disturb.png`。

```dart
ChatUIKitSettings.conversationListMuteImage = const AssetImage(
  'packages/em_chat_uikit/assets/images/no_disturb.png',
)
```

## 设置消息长按顺序

长按消息时会弹出消息操作菜单，可以通过 `ChatUIKitSettings.msgItemLongPressActions` 进行默认值修改。默认设置如下：

```dart
  static List<MessageLongPressActionType> msgItemLongPressActions = [
    MessageLongPressActionType.reaction,
    MessageLongPressActionType.copy, // 仅适用于文本消息。
    MessageLongPressActionType.reply,
    MessageLongPressActionType.forward,
    MessageLongPressActionType.multiSelect,
    MessageLongPressActionType.translate, // 仅适用于文本消息。
    MessageLongPressActionType.thread, // 仅适用于群组消息。
    MessageLongPressActionType.edit, // 仅适用于文本消息。
    MessageLongPressActionType.report,
    MessageLongPressActionType.recall,
    MessageLongPressActionType.delete,
  ];
```

此时长按消息时，可以通过调整顺序和内容对弹出的菜单进行修改，例如，移除 `ChatUIKitSettings.msgItemLongPressActions` 中的 `MessageLongPressActionType.copy`, 长按文本消息时将不再显示 "copy"。

## 设置是否开启消息话题

消息话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/)上已开通该功能。

消息话题特性在 `ChatUIKitSettings.enableChatThreadMessage` 中提供开关，默认值为 `false`。要开启该特性，需将该参数设置为 `true`。

示例代码如下：

```dart
    ChatUIKitSettings.enableMessageThread = true;
```

## 设置是否开启消息翻译

消息翻译是指用户可以将一条消息翻译成其他语言。消息翻译可以帮助使用不同语言的用户进行沟通。

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/)上已试用该功能。

1. 开启消息翻译特性。

单群聊 UiKit 的 `ChatUIKitSettings` 对象中提供了 `ChatUIKitSettings.enableMessageTranslation` 设置是否开启消息翻译功能，默认值为 `false`。要开启该特性，需将该参数设置为 `true`。示例代码如下：

```dart
   ChatUIKitSettings.enableMessageTranslation = true;
```

2. 设置翻译的目标语言。

单群聊 UiKit 的 `ChatUIKitSettings` 对象中提供了 `translateTargetLanguage` 属性设置目标翻译语言。

```dart
   ChatUIKitSettings.translateTargetLanguage = 'zh-Hans';
```

如果未设置翻译的目标语言，则默认使用中文。

更多翻译目标语言，请参考[翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 设置是否开启表情回复

表情回复（即 `Reaction`）指用户可以使用表情符号回复消息。表情回复可以帮助用户表达情绪、态度、进行调查或投票。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/)上已开通该功能。

单群聊 UiKit 的 `ChatUIKitSettings` 对象中提供了 `enableMessageReaction` 属性用于设置是否开启 `Reaction` 功能, 默认值为 `false`。要开启该功能，将该参数设置为 `true`。示例代码如下：

```dart
    ChatUIKitSettings.enableMessageReaction = true;
```

## 设置是否开启消息引用

消息引用，即长按消息时对消息进行回复，在回复发出去后会在回复的消息中展示原消息内容。该功能默认 `true`， 如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageReply = false;
```

## 设置是否开启消息撤回

消息撤回，即消息的发送方可以在规定时间内对消息进行撤回的操作。该功能默认 `true`，如果不需要，可以将参数设置为 `false`。示例代码如下：

```dart
ChatUIKitSettings.enableMessageRecall = false;
```

配置 `撤回消息` 条目显示的时长，默认为 `120` 秒。若超过该时长，长按消息后将不再显示 `撤回消息`。

```dart
ChatUIKitSettings.recallExpandTime = 120;
```

## 设置是否开启消息编辑

消息编辑，即对自己发出的文本消息进行编辑，该功能默认为 `true`, 如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageEdit = false;
```

## 设置是否开启消息举报

消息举报，即对发送或者收到的消息进行举报，该功能默认为 `true`, 如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageReport = false;
```

设置举报内容，举报内容是一组键值对（key-value），为 Map<String, String> 结构，即非法消息的标签和举报原因。UIKit 中提供了设置非法消息标签的方式，对应的举报原因需要在国际化文件中进行填写。示例代码如下：

```dart
  /// 非法消息的标签, 可以自定义。
  // 举报原因需要填写在国际化文件中，国际化文件中的举报原因的 key 要和非法消息的标签一致。可以参考 [ChatUIKitLocal.reportTarget1]。
  static List<String> reportMessageTags = [
    'tag1',
    'tag2',
    'tag3',
    'tag4',
    'tag5',
    'tag6',
    'tag7',
    'tag8',
    'tag9',
  ];
```

## 设置是否开启消息合并转发

合并转发，即同时选择多条消息进行转发，该功能默认为 `true`。如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageMultiSelect = false;
```

## 设置是否开启单条消息转发

单条消息转发，即转发收到或者发送成功的消息，该功能默认为 `true`。如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageForward = false;
```

## 联系人首字母索引顺序

联系人首字母索引顺序，即通讯录中联系人排序顺序，默认为 `ABCDEFGHIJKLMNOPQRSTUVWXYZ#`, 如果需要修改，可以参考一下代码：

```dart
// 将首字母排序中的#号排到最前面
ChatUIKitSettings.sortAlphabetical = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
```