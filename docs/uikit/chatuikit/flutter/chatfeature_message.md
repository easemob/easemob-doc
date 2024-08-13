# 消息特性

<Toc />

本文介绍消息相关特性，包括消息复制、删除、撤回、编辑、引用、翻译、表情回复、话题和转发。

对于消息引用、翻译、表情回复、话题和转发，你可以决定是否开启或关闭该特性。

## 消息复制

消息复制是指用户可以将一条消息复制到剪贴板。消息复制可以帮助用户将消息保存到其他地方，或将其粘贴到其他应用程序中。

![img](/images/uikit/chatuikit/feature/message/message_copy.png =600x600) 

## 消息删除	

消息删除是指用户可以删除一条消息。消息删除可以帮助用户删除错误发送的消息，或删除不想保留的消息。

![img](/images/uikit/chatuikit/feature/message/message_delete.png) 

## 消息撤回

消息撤回是指消息的发送方可以在规定时间内对发送的消息进行撤回的操作。消息撤回可以帮助用户撤回错误发送的消息，或撤回不想让其他用户看到的消息。

![img](/images/uikit/chatuikit/feature/message/message_recall.png) 

### 如何使用

消息撤回功能默认开启，即 `ChatUIKitSettings.enableMessageRecall` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageRecall = false;
```

配置 `撤回消息` Item 显示的时长，默认为 `120` 秒。若超过该时长，长按消息后将不再显示 `撤回消息`。

```dart
ChatUIKitSettings.recallExpandTime = 120;
```

## 消息编辑

消息编辑是指用户可以编辑一条已发送的消息。消息编辑可以帮助用户纠正错误，或添加新信息。

![img](/images/uikit/chatuikit/feature/message/message_edit.png) 

### 如何使用

消息编辑功能默认开启，即 `ChatUIKitSettings.enableMessageEdit` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageEdit = false;
```

## 消息引用	

消息引用指用户可以引用一条已发送的消息。消息引用可以帮助用户回复特定的消息，或强调特定的信息。

![img](/images/uikit/chatuikit/feature/message/message_reply.png)

目前，单群聊 UIKit 支持引用消息进行回复。消息引用 UI 和逻辑结构如下：

- `ChatUIKitQuoteWidget`：消息气泡的引用消息自定义 View。
- `ChatUIKitReplyBar`：底部输入框组件上方展示的引用消息自定义 View。

### 如何使用

消息转发特性默认开启，即 `ChatUIKitSettings.enableMessageReply` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```dart
ChatUIKitSettings.enableMessageReply = false;
```

## 消息翻译

消息翻译是指用户可以将一条消息翻译成其他语言。消息翻译可以帮助使用不同语言的用户进行沟通。

目前，单群聊 UIKit 支持翻译文本消息。消息翻译的 UI 和逻辑部分结构如下：

- 消息翻译的 UI 布局在 `ChatUIKitTextMessageWidget` 中。

![img](/images/uikit/chatuikit/feature/message/message_translate.png)

### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已申请试用该功能。

1. 开启消息翻译特性。

单群聊 UiKit 的 `ChatUIKitSettings` 对象中提供了  `ChatUIKitSettings.enableMessageTranslation` 设置是否开启消息翻译功能，默认值为 `false`。要开启该特性，需将该参数设置为 `true`。示例代码如下：

```dart
ChatUIKitSettings.enableMessageTranslation = true;
```

2. 设置翻译的目标语言。

单群聊 UiKit 的 `ChatUIKitSettings` 对象中提供了 `translateTargetLanguage` 属性设置目标翻译语言。

```dart
ChatUIKitSettings.translateTargetLanguage = 'zh-Hans';
```

如果未设置翻译的目标语言，则默认使用中文。

更多翻译目标语言，请参考 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 表情回复

表情回复（即 `Reaction`）指用户可以使用表情符号回复消息。表情回复可以帮助用户表达情绪、态度、进行调查或投票。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。

目前，单群聊 UIKit 支持对消息添加表情回复。Reaction UI 和逻辑部分结构如下：

- Reaction 在消息列表中的 UI 布局实现 `ChatUIKitMessageReactionsRow` 自定义布局。

- Reaction 表情列表的弹窗 `ChatUIKitMessageReactionInfo`。

![img](/images/uikit/chatuikit/feature/message/message_reactions.png)

### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

单群聊 UiKit 的 `ChatUIKitSettings` 对象中提供了 `enableMessageReaction` 属性用于设置是否开启 `Reaction` 功能, 默认值为 `false`。要开启该功能，将该参数设置为 `true`。示例代码如下：

```dart
ChatUIKitSettings.enableMessageReaction = true;
```

## 消息话题

消息话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

![img](/images/uikit/chatuikit/feature/message/message_thread.png)

### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息话题特性在 `ChatUIKitSettings.enableChatThreadMessage` 中提供开关，默认值为 `false`。要开启该特性，需将该参数设置为 `true`。

示例代码如下：

```dart
ChatUIKitSettings.enableMessageThread = true;
```

## 消息合并转发

消息转发指用户可以将消息转发给其他用户。你可以转发单条消息，也可以选择多条消息进行合并转发。

消息合并转发 UI 和逻辑部分结构如下：

- 选择转发消息接收人页面 `ForwardMessageSelectView`。

![img](/images/uikit/chatuikit/feature/message/message_forward.png)

### 如何使用

消息转发特性在 `ChatUIKitSettings.enableMessageMultiSelect` 中提供开关，默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```dart
ChatUIKitSettings.enableMessageMultiSelect = true;
```

## 单条消息转发

单条消息转发是指将收到或者发送成功的单条消息转发给其他用户。

单条消息转发 UI 和逻辑部分结构如下：

- 选择转发消息接收人页面 `ForwardMessageSelectView`。

### 如何使用

该功能默认开启，即 `ChatUIKitSettings.enableMessageForward` 的默认值为 `true`。如果不需要，可以将参数设置为 `false`。 示例代码如下：

```dart
ChatUIKitSettings.enableMessageForward = false;
```

## 消息置顶	

消息置顶指用户将重要信息固定在会话顶部，有助于用户快速访问关键会话，避免遗漏重要内容。该特性尤其适用于处理紧急事务或持续跟进的项目，帮助高效管理重要会话。

![img](/images/uikit/chatuikit/feature/message/message_pin.png) 

### 如何使用

消息置顶功能默认开启，即 `ChatUIKitSettings.enablePinMsg` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```dart
ChatUIKitSettings.enablePinMsg = false;
```

