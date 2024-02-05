# 聊天消息

<Toc />

`ConversationDetail` 组件主要由输入组件、消息列表组件、菜单组件和导航栏组件组成。该组件支持以下功能：

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件和名片消息。
- 对消息进行复制、引用、撤回、删除、编辑、重新发送和审核。
- 从服务器拉取漫游消息。
- 清除本地消息。

消息相关功能，详见[功能介绍文档](chatfeature_message.html)。

![img](@static/images/uikit/chatuikit/android/page_chat.png =300x630) 

示例代码如下：

```tsx
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { navigation, route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const operateType = ((route.params as any)?.params as any)?.operateType;
  const selectedContacts = ((route.params as any)?.params as any)
    ?.selectedContacts;
  const { top, bottom } = useSafeAreaInsets();
  const im = useChatContext();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ConversationDetail
        containerStyle={{
          flexGrow: 1,
        }}
        convId={convId}
        convType={convType}
        input={{
          props: {
            top,
            bottom,
            onClickedCardMenu: () => {
              // 跳转到共享联系人页面
              navigation.push("ShareContact", {
                params: {
                  convId,
                  convType,
                  convName,
                  operateType: "share_card",
                },
              });
            },
          },
        }}
        list={{
          props: {
            onClickedItem: (
              id: string,
              model: SystemMessageModel | TimeMessageModel | MessageModel
            ) => {
              // 点击消息列表项的回调通知
              if (model.modelType !== "message") {
                return;
              }
              const msgModel = model as MessageModel;
              if (msgModel.msg.body.type === ChatMessageType.IMAGE) {
                navigation.push("ImageMessagePreview", {
                  params: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.VIDEO) {
                navigation.push("VideoMessagePreview", {
                  params: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.FILE) {
                navigation.push("FileMessagePreview", {
                  params: {
                    msgId: msgModel.msg.msgId,
                    localMsgId: msgModel.msg.localMsgId,
                  },
                });
              } else if (msgModel.msg.body.type === ChatMessageType.CUSTOM) {
                const body = msgModel.msg.body as ChatCustomMessageBody;
                const event = body.event;
                const params = body.params;
                if (event === gCustomMessageCardEventType) {
                  const cardParams = params as {
                    userId: string;
                    nickname: string;
                    avatar: string;
                  };
                  navigation.push("ContactInfo", {
                    params: {
                      userId: cardParams.userId,
                    },
                  });
                }
              }
            },
            onClickedItemAvatar: (id, model) => {
              // 点击头像的回调通知
              if (model.modelType !== "message") {
                return;
              }
              const msgModel = model as MessageModel;
              const userId = msgModel.msg.from;

              const userType = msgModel.msg.chatType as number;
              if (userType === ChatMessageChatType.PeerChat) {
                navigation.navigate("ContactInfo", {
                  params: { userId: userId },
                });
              } else if (userType === ChatMessageChatType.GroupChat) {
                const groupId = msgModel.msg.conversationId;
                const selfId = im.userId;
                if (selfId === im.userId) {
                  navigation.navigate("ContactInfo", {
                    params: {
                      userId: userId,
                    },
                  });
                } else {
                  navigation.navigate("GroupParticipantInfo", {
                    params: {
                      groupId: groupId,
                      userId: userId,
                    },
                  });
                }
              }
            },
          },
        }}
        onBack={() => {
          navigation.goBack();
        }}
        onClickedAvatar={(params: {
          convId: string;
          convType: ChatConversationType;
          ownerId?: string | undefined;
        }) => {
          // 点击会话头像的回调通知
          if (params.convType === ChatConversationType.PeerChat) {
            navigation.navigate({
              name: "ContactInfo",
              params: { params: { userId: params.convId } },
              merge: true,
            });
          } else if (params.convType === ChatConversationType.GroupChat) {
            navigation.navigate({
              name: "GroupInfo",
              params: {
                params: { groupId: params.convId, ownerId: params.ownerId },
              },
              merge: true,
            });
          }
        }}
      />
    </SafeAreaView>
  );
}
```

`ConversationDetail` 组件的核心属性介绍如下：

| 属性                | 类型                 | 是否必选 | 描述                                                                        |
| ------------------- | -------------------- | -------- | --------------------------------------------------------------------------- |
| convId              | string               | 是       | 会话 ID。                                                                   |
| convType            | ChatConversationType | 是       | 会话类型。                                                                  |
| convName            | string               | 否       | 会话名称。                                                                  |
| containerStyle      | object               | 否       | 修改组件样式。                                                              |
| input               | object               | 否       | 输入组件属性、引用属性、自定义组件。详见[输入组件介绍](#输入组件)。         |
| list                | object               | 否       | 消息列表组件属性、引用属性、自定义组件。详见[列表组件介绍](#消息列表组件)。 |
| onClickedAvatar     | function             | 否       | 点击会话头像的回调。                                                        |
| NavigationBar       | function             | 否       | 自定义导航栏组件。                                                          |
| enableNavigationBar | boolean              | 否       | 是否激活导航栏。如果为 `false`，则不显示导航栏。                            |

## 输入组件

`MessageInput` 组件主要发送消息。默认支持发送文本、表情、图片、语音、视频、文件、自定义等消息。还支持发送复合类型消息，例如：引用消息、修改消息、名片消息等。

### 自定义输入组件

`MessageInput` 组件提供自定义菜单，可以添加自定义项，实现发送自定义消息。

核心属性如下：

| 属性                  | 类型                 | 是否必选 | 描述                                              |
| --------------------- | -------------------- | -------- | ------------------------------------------------- |
| convId                | string               | 是       | 会话 ID。                                         |
| convType              | ChatConversationType | 是       | 会话类型。                                        |
| top                   | number               | 否       | 若使用了 `SafeAreaView` 组件，需要设置 `top`。    |
| bottom                | number               | 否       | 若使用了 `SafeAreaView` 组件，需要设置 `bottom`。 |
| numberOfLines         | number               | 否       | 输入文本组件的最大行数。默认 4 行。               |
| onClickedSend         | function             | 否       | 点击发送按钮的回调。                              |
| onEditMessageFinished | function             | 否       | 编辑消息完成的回调。                              |
| onClickedCardMenu     | function             | 否       | 点击名片消息的回调。                              |
| onInitMenu            | function             | 否       | 注册初始化菜单的回调。                            |
| emojiList             | string[]             | 否       | 自定义表情列表。如果不设置，使用默认列表。        |

引用对象的核心方法如下：

| 方法         | 描述                               |
| ------------ | ---------------------------------- |
| close        | 关闭输入组件键盘，切换到一般模式。 |
| quoteMessage | 回复消息。                         |
| editMessage  | 编辑消息。                         |

## 消息列表组件

`MessageList` 组件主要显示和管理消息列表，支持添加、编辑和删除消息列表项。

- 发送消息会显示在消息列表，消息发送到服务器会修改消息状态，对方已读会修改状态。
- 发送消息后，在规定时间内可以撤销、编辑和回复。
- 接收的消息可以设置已读状态，附件类型消息支持附件下载。
- 消息菜单支持更新或者添加自定义项。
- 消息列表项支持修改样式、布局和显示隐藏。

### 自定义消息列表组件

核心属性如下：

| 属性                    | 类型                   | 是否必选 | 描述                                               |
| ----------------------- | ---------------------- | -------- | -------------------------------------------------- |
| convId                  | string                 | 是       | 会话 ID。                                          |
| convType                | ChatConversationType   | 是       | 会话类型。                                         |
| containerStyle          | object                 | 否       | 修改组件样式。                                     |
| onClicked               | function               | 否       | 点击消息列表的回调。                               |
| onClickedItem           | function               | 否       | 点击消息的回调。                                   |
| onLongPressItem         | function               | 否       | 长按消息的回调。                                   |
| onClickedItemAvatar     | function               | 否       | 点击消息头像的回调。                               |
| onClickedItemQuote      | function               | 否       | 点击消息的回复的回调。                             |
| onQuoteMessageForInput  | function               | 否       | 回复消息的回调。                                   |
| onEditMessageForInput   | function               | 否       | 修改消息的回调。                                   |
| reportMessageCustomList | array                  | 否       | 自定义消息举报的否的列表项。                       |
| listItemRenderProps     | MessageListItemRenders | 否       | 消息列表项的组件的自定义。还支持内部组件的自定义。 |
| recvMessageAutoScroll   | boolean                | 否       | 收到消息是否滚动到列表最下面。                     |
| messageLayoutType       | MessageLayoutType      | 否       | 消息布局靠左还是靠右。                             |
| onInitMenu              | function               | 否       | 注册初始化菜单的回调。                             |
| onCopyFinished          | function               | 否       | 复制完成的回调。                                   |

对象引用的方法如下：

| 方法                | 描述                 |
| ------------------- | -------------------- |
| addSendMessage      | 发送消息。           |
| removeMessage       | 移除消息。           |
| recallMessage       | 撤回消息。           |
| updateMessage       | 更新消息。           |
| loadHistoryMessage  | 加载历史消息。       |
| onInputHeightChange | 输入组件的高度变化。 |
| editMessageFinished | 编辑消息完成。       |
| scrollToBottom      | 滚动到消息底部。     |

### 消息列表的头像和昵称

`MessageList` 组件内部并没有头像和昵称的默认值，需要用户提供。若未提供，则展示默认头像和用户 ID。

可通过以下方式提供头像和昵称：

- 注册回调：使用 `Container` 组件的 `onRequestMultiData` 属性实现。
- 主动调用：使用 `ChatService.updateRequestData` 方法实现。调用该方法会触发内部事件分发，刷新已加载的组件页面。
- 消息携带：优先使用消息携带的头像和昵称。

### 事件通知

事件通知在列表中已经实现，收到对应事件会更新列表。通常情况下，不需要开发者关注。

### 示例应用

实现的核心是，自定义输入组件的菜单，点击自定义项发送自定义消息，自定义渲染组件来显示自定义消息。

示例如下：

```tsx
export function MyMessageContent(props: MessageContentProps) {
  const { msg } = props;
  if (msg.body.type === ChatMessageType.CUSTOM) {
    return (
      <View>
        <Text>{(msg.body as ChatCustomMessageBody).params?.test}</Text>
      </View>
    );
  }
  return <MessageContent {...props} />;
}
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { navigation, route } = props;
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  const listRef = React.useRef<MessageListRef>({} as any);
  const inputRef = React.useRef<MessageInputRef>({} as any);
  const { top, bottom } = useSafeAreaInsets();
  const im = useChatContext();

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ConversationDetail
        containerStyle={{
          flexGrow: 1,
        }}
        convId={convId}
        convType={convType}
        input={{
          ref: inputRef,
          props: {
            top,
            bottom,
            onInitMenu: (menu) => {
              return [
                ...menu,
                {
                  name: "test",
                  isHigh: false,
                  icon: "bell",
                  onClicked: () => {
                    listRef.current?.addSendMessage({
                      type: "custom",
                      msg: ChatMessage.createCustomMessage(convId, "test", 1, {
                        params: { test: "111" },
                      }),
                    });
                  },
                },
              ];
            },
          },
        }}
        list={{
          ref: listRef,
          props: {
            listItemRenderProps: {
              MessageContent: MyMessageContent,
            },
          },
        }}
      />
    </SafeAreaView>
  );
}
```
