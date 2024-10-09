# 消息特性

<Toc />

本文介绍消息相关特性，包括消息删除、撤回、编辑、引用、翻译、表情回复、话题和转发。你可以决定是否开启或关闭这些特性。

## 消息复制

消息复制是指用户可以将一条消息复制到剪贴板。消息复制可以帮助用户将消息保存到其他地方，或将其粘贴到其他应用程序中。

![img](/images/uikit/chatuikit/feature/web/message/message_copy.png) 

## 消息删除

消息删除是指用户可以删除一条消息。消息删除可以帮助用户删除错误发送的消息，或删除不想保留的消息。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等。

#### 如何使用

消息删除特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.delete = false;
```

![img](/images/uikit/chatuikit/feature/web/message/message_delete.png)

## 消息撤回

消息撤回是指用户可以撤回一条已发送的消息。消息撤回可以帮助用户撤回错误发送的消息，或撤回不想让其他用户看到的消息。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage` 和 `FileMessage` 等。

![img](/images/uikit/chatuikit/feature/web/message/message_recall.png)

#### 如何使用

消息撤回特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.recall = false;
```

## 消息编辑

消息编辑是指用户可以编辑一条已发送的消息。消息编辑可以帮助用户纠正错误，或添加新信息。

该功能在 UIKit 里的 `TextMessage` 组件中。

![img](/images/uikit/chatuikit/feature/web/message/message_edit.png)

#### 如何使用

消息编辑特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.edit = false;
```

## 消息引用

消息引用指用户可以引用一条已发送的消息。消息引用可以帮助用户回复特定的消息，或强调特定的信息。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等

![img](/images/uikit/chatuikit/feature/web/message/message_reply.png)

#### 如何使用

消息编辑特性默认开启，若要在全局配置中关闭可以进行如下设置：

```jsx
features.chat.message.reply = false;
```

## 消息翻译

消息翻译是指用户可以将一条消息翻译成其他语言。消息翻译可以帮助使用不同语言的用户进行沟通。

该功能在 UIKit 里的 `TextMessage` 组件中。

![img](/images/uikit/chatuikit/feature/web/message/message_translate.png) 

#### 如何使用

1. 使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已申请试用该功能。

消息翻译特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.translate = false;
```

2. 设置翻译的目标语言。

初始化 UIKit 的配置 `initConfig.translationTargetLanguage` 设置为翻译的目标语言。

如果未设置翻译的目标语言，则默认使用中文。

更多翻译目标语言，请参考 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 表情回复

表情回复（即 `Reaction`）指用户可以使用表情符号回复消息。表情回复可以帮助用户表达情绪、态度、进行调查或投票。在单群聊 UIKit 中，用户可以长按单条消息触发消息拓展功能菜单，选择表情回复。

目前，单群聊 UIKit 支持对消息添加表情回复。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等。

![img](/images/uikit/chatuikit/feature/web/message/message_reactions.png) 

#### 如何使用

使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

表情回复特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.reaction = false;
```

## 消息话题

消息话题（即 `Thread`）指用户可以在群组聊天中根据一条消息创建话题进行深入探讨，讨论和追踪特定项目任务，而不影响其他聊天内容。

单群聊 UIKit 中实现了 Thread 页面 `EaseChatThreadActivity`，开发者只需要调用 `EaseChatThreadActivity.actionStart` 启动该页面传入需要的参数即可。

该功能在 UIKit 里的 `TextMessage` 组件中。

![img](/images/uikit/chatuikit/feature/web/message/message_thread.png) 

#### 如何使用

1. 使用该特性前，请确保在[环信即时通信控制台](https://console.easemob.com/user/login)上已开通该功能。

消息话题特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.thread = false;
```

2. 从 UIKit 中引入 Thread 组件，监听 `rootStore.threadStore.showThreadPanel` 为 `true` 时显示此组件。

## 消息合并转发

消息转发指用户可以将消息转发给其他用户。可以选择多条消息进行合并转发。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等。

![img](/images/uikit/chatuikit/feature/web/message/messages_forward.png) 

#### 如何使用

1. 消息合并转发特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.select = false;
```

2. 在 Chat 组件中监听 `onSendMessage` 事件，判断如果是合并消息，可以显示联系人组件，选择消息转发的目标用户，然后发送消息。

示例代码：

```jsx
// ...
<Chat
  messageInputProps={{
    onSendMessage: (message) => {
      if (message.type == "combine") {
        forwardedMessages = message
        setContactListVisible(true); // 展示联系人组件
      }
    },
  }}
></Chat>

//...
<ContactList
    onItemClick={(data) => {
        forwardedMessages.to = data.id;
        forwardedMessages.chatType =
        data.type == "contact" ? "singleChat" : "groupChat";
        rootStore.messageStore.sendMessage(forwardedMessages); // 发送消息

        // 设置进入新的会话
        rootStore.conversationStore.setCurrentCvs({
            chatType: data.type == "contact" ? "singleChat" : "groupChat",
            conversationId: data.id,
            lastMessage: forwardedMessages,
        });

         // 设置当前会话关闭消息选择状态
        rootStore.messageStore.setSelectedMessage(currentConversation, {
            selectable: false,
            selectedMessage: [],
        });
    }}
></ContactList>
```

## 消息单条转发

消息转发指用户可以将消息转发给其他用户。你可以转发单条消息。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等。

![img](/images/uikit/chatuikit/feature/web/message/message_forward.png) 

#### 如何使用

1. 消息单条转发特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.message.forward = false;
```

2. 在 Chat 组件监听 `onForwardMessage` 事件， 显示联系人组件，选择消息转发的目标用户，然后发送消息。

示例代码：

```jsx
// ...
<Chat
  messageListProps={{
    messageProps: {
        onForwardMessage: (msg) => {
            forwardedMessages = {...msg}
            forwardedMessages.id = Date.now() + ""; // 设置新的消息 ID
            forwardedMessages.from = rootStore.client.user; // 设置为自己的用户 ID
            setContactListVisible(true); // 显示联系人组件
        }
  }
}}
></Chat>

// 联系人组件与合并转发的相同
```

## 消息置顶

消息置顶指用户将重要信息固定在会话顶部，有助于用户快速访问关键会话，避免遗漏重要内容。该特性尤其适用于处理紧急事务或持续跟进的项目，帮助高效管理重要会话。

目前，单群聊 UIKit 支持消息置顶。该功能在 UIKit 的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等，置顶消息列表功能在 `PinnedMessage` 组件中。

![img](/images/uikit/chatuikit/feature/web/message/message_pin.png) 

#### 如何使用

消息置顶特性默认开启，若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.header.pinMessage = false;
features.chat.message.pin = false;
```

## 输入状态指示

输入状态指示功能指在单聊会话中实时显示会话的一方正在输入的状态，增强通讯互动的实时性。此功能有助于用户了解对方是否正在回复，从而优化沟通体验，提升对话流畅度。

该功能在 UIKit 里的 `Typing` 组件中。

![img](/images/uikit/chatuikit/feature/web/common/typing_indicator.png) 

#### 如何使用

输入状态指示特性默认开启。若要在全局配置中关闭，可以进行如下设置：

```jsx
features.chat.messageInput.typing = false;
```

#### 自定义

本功能使用 SDK 的透传消息实现，详见 [SDK 相关文档](/document/web/message_send_receive.html#通过透传消息实现输入指示器)。

