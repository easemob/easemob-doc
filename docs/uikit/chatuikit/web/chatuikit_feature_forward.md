# 消息转发

消息转发包括消息合并转发和单条消息转发。

## 消息合并转发

消息转发指用户可以将消息转发给其他用户。可以选择多条消息进行合并转发。

该功能在 UIKit 里的消息组件中，如 `TextMessage`、`AudioMessage`、`FileMessage` 等。

<ImageGallery :columns="1">
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/messages_forward_web_1.png" title="点击多选" />
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/messages_forward_web_2.png" title="选择消息" />
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/messages_forward_web_3.png" title="选择消息接收方" />
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/messages_forward_web_4.png" title="发送合并消息" />
</ImageGallery>

### 如何使用

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

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/web/message/message_forward_single_web.png" title="消息单条转发" />
</ImageGallery>

### 如何使用

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