# 消息特性

<Toc />

本文介绍消息相关特性，包括消息复制、删除、撤回、编辑、引用、翻译、表情回复、话题和转发。

对于消息引用、翻译、话题和消息转发，你可以决定是否开启或关闭该特性。

消息 cell 包含如下显示模块：

- 消息引用
- 用户头像
- 用户昵称
- 消息时间
- 消息话题
- 表情回复

若不显示某个模块，可将其隐藏，示例代码如下：

```Swift
// 消息 cell 包含的显示模块
   @objc public enum MessageContentDisplayStyle: UInt {
    case withReply = 1  
    case withAvatar = 2  
    case withNickName = 4
    case withDateAndTime = 8
    case withMessageThread = 16
    case withMessageReaction = 32
}
// 若不显示，可将其隐藏。
Appearance.chat.contentStyle: [MessageContentDisplayStyle] = [.withReply,.withAvatar,.withNickName,.withDateAndTime,.withMessageThread,.withMessageReaction]

        if hiddenTopic {
            Appearance.chat.contentStyle.removeAll { $0 == .withMessageThread }
        }
        if hiddenReaction {
            Appearance.chat.contentStyle.removeAll { $0 == .withMessageReaction }
        }
```

## 消息复制

消息复制是指用户可以将一条消息复制到剪贴板。消息复制可以帮助用户将消息保存到其他地方，或将其粘贴到其他应用程序中。

![img](/images/uikit/chatuikit/feature/message/message_copy.png =600x600) 

## 消息删除	

消息删除是指用户可以删除一条消息。消息删除可以帮助用户删除错误发送的消息，或删除不想保留的消息。

![img](/images/uikit/chatuikit/feature/message/message_delete.png) 

## 消息撤回

消息撤回是指用户可以撤回一条已发送的消息。消息撤回可以帮助用户撤回错误发送的消息，或撤回不想让其他用户看到的消息。

![img](/images/uikit/chatuikit/feature/message/message_recall.png) 

## 消息编辑

消息编辑是指用户可以编辑一条已发送的消息。消息编辑可以帮助用户纠正错误，或添加新信息。

![img](/images/uikit/chatuikit/feature/message/message_edit.png) 

## 消息引用	

消息引用是指用户可以引用一条已发送的消息。消息引用可以帮助用户回复特定的消息，或强调特定的信息。

![img](/images/uikit/chatuikit/feature/message/message_reply.png) 

消息引用特性默认开启，若不需要可将其隐藏，示例代码如下：

```Swift
Appearance.chat.contentStyle: [MessageContentDisplayStyle] = [.withReply,.withAvatar,.withNickName,.withDateAndTime,.withMessageThread,.withMessageReaction]

        if hiddenTopic {
            Appearance.chat.contentStyle.removeAll { $0 == .withReply }
        }
```

## 消息翻译

消息翻译是指用户可以将一条消息翻译成其他语言。消息翻译可以帮助使用不同语言的用户进行沟通。

目前，单群聊 UIKit 支持翻译文本消息。消息翻译的 UI 和逻辑部分在 `Appearance.swift` 中。

![img](/images/uikit/chatuikit/feature/message/message_translate.png) 

### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已申请试用该功能。

1. 开启消息翻译特性。

消息翻译特性在 `Appearance.swift` 中默认关闭，即 `Appearance.chat.enableTranslation` 的默认值为 `false`。要开启该特性，需将该参数设置为 `true`。

2. 设置翻译的目标语言。

单群聊 UiKit 的 `Appearance.swift` 中提供了 `Appearance.chat.targetLanguage` 设置目标翻译语言。

如果未设置翻译的目标语言，则默认使用中文。

更多翻译目标语言，请参考 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

示例代码如下：

```Swift
Appearance.chat.enableTranslation = true
Appearance.chat.targetLanguage = .English
```

## 表情回复

表情回复（即 Reaction）指用户可以使用表情符号回复消息。表情回复可以帮助用户表达情绪、态度、进行调查或投票。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。

目前，单群聊 UIKit 支持 Reaction，可在 `Appearance.swift` 中开启或关闭。

![img](/images/uikit/chatuikit/feature/message/message_reactions.png) 

### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息表情回复特性在 `Appearance.swift` 中默认关闭，即 `Appearance.chat.contentStyle` 数组中默认不包含 `.withMessageReaction`。

要开启该特性，需在该数组中添加 `.withMessageReaction`。**注意不要重复添加**。

示例代码如下：

```Swift
Appearance.chat.contentStyle.append(.withMessageReaction)

```

## 消息话题

消息话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

单群聊 UIKit 中实现了 Thread，可在 `Appearance.swift` 中开启或关闭。

![img](/images/uikit/chatuikit/feature/message/message_thread.png) 

### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

Thread 特性在 `Appearance.swift` 中默认关闭，即` Appearance.chat.contentStyle` 数组中默认不包含 `.withMessageThread`。

要开启该特性，需在该数组中添加 `.withMessageThread`。**注意不要重复添加**。

```Swift
Appearance.chat.contentStyle.append(.withMessageThread)

```

## 消息合并转发

消息转发指用户可以将消息转发给其他用户。你可以转发单条消息，也可以选择多条消息进行合并转发。

消息转发 UI 和逻辑部分结构如下：

- `MessageMultiSelectedBottomBar.swift`：底部菜单 View。
- `MessageListController.swift`：处理 UI 布局变更以及转发和删除的逻辑。
- `MessageListController.swift`：消息选择帮助类用于记录选中的消息信息并提供获取方法。

![img](/images/uikit/chatuikit/feature/message/message_forward.png)

## 消息置顶	

消息置顶指用户将重要信息做标记方便查看，有助于用户快速找到关键信息，避免遗漏重要内容。该特性尤其适用于处理紧急事务或持续跟进的项目，帮助高效管理重要通告。注意：这里需要先去环信开发者控制台开启此功能。

目前，单群聊 UIKit 支持消息置顶。消息置顶 UI 和逻辑结构如下：
- `Appearance.chat.enablePinMessage`：控制消息置顶功能显示与隐藏。
- `Appearance.chat.messageLongPressedActions`：包含消息长按菜单所有功能项，如果不需要置顶可删除对应项，默认带着置顶功能，但是在未开启上述开关的情况下会过滤此项。
- `MessageListController#showPinnedMessages`：显示置顶消息列表。

![img](/images/uikit/chatuikit/feature/message/message_pin.png) 

### 如何使用

消息置顶特性在 `Appearance.chat` 中默认开启，即 `enablePinMessage` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

示例代码如下：

```Swift
Appearance.chat.enablePinMessage = false
Appearance.chat.messageLongPressedActions.removeAll { $0.tag == "Pin" }
```

