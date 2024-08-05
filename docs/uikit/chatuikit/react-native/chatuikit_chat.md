# 聊天消息

<Toc />

`ConversationDetail` 组件主要由输入组件、消息列表组件、菜单组件和导航栏组件组成。该组件支持以下功能：

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件和名片消息。
- 对消息进行复制、引用、撤回、删除、编辑、重新发送和审核。
- 从服务器拉取漫游消息。
- 清除本地消息。
- 消息翻译。
- 消息表情回复。
- 消息话题。
- 消息转发。

该组件支持多种模式：包括聊天模式、搜索结果显示模式、创建话题模式、话题模式。 通过 `ConversationDetailProps.type` 属性来区分。详见 `ConversationDetailModelType` 类型。

消息相关功能，详见[功能介绍文档](chatfeature_message.html)。

![img](/images/uikit/chatuikit/android/page_chat.png =300x630)

示例代码如下：

```tsx
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootParamsName, RootScreenParamsList } from "../routes";
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationDetailScreen(props: Props) {
  const { route } = props;
  const name = route.name as RootParamsName;

  // 必须填写的参数
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;

  // 搜索模式
  const messageId = ((route.params as any)?.params as any)?.messageId;

  // 是否是多选模式
  const selectType = ((route.params as any)?.params as any)?.selectType;

  // 话题模式的参数
  const thread = ((route.params as any)?.params as any)?.thread;
  const firstMessage = ((route.params as any)?.params as any)?.firstMessage;

  // 组件模式
  const comType = React.useRef<ConversationDetailModelType>(
    name === "ConversationDetail"
      ? "chat"
      : name === "MessageThreadDetail"
      ? "thread"
      : name === "MessageHistory"
      ? "search"
      : "create_thread"
  ).current;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ConversationDetail
        type={comType}
        convId={convId}
        convType={convType}
        msgId={messageId}
        thread={thread}
        firstMessage={firstMessage}
        selectType={selectType}
      />
    </SafeAreaView>
  );
}
```

`ConversationDetail` 组件的核心属性介绍如下：

| 属性                 | 类型                        | 是否必选 | 描述      |
| -------- | -------------- | -------- | ------------------------------- |
| type                 | ConversationDetailModelType | 是       | 组件模式。包括聊天模式、搜索模式、创建话题模式和话题模式。 |
| convId               | string                      | 是       | 会话 ID。 |
| convType             | ChatConversationType        | 是       | 会话类型。 |
| convName             | string                      | 否       | 会话名称。 |
| containerStyle       | object                      | 否       | 修改组件样式。  |
| input                | object                      | 否       | 输入组件属性、引用属性、自定义组件。详见[输入组件介绍](#输入组件)。 |
| list                 | object                      | 否       | 消息列表组件属性、引用属性、自定义组件。详见[列表组件介绍](#消息列表组件)。 |
| onClickedAvatar      | function                    | 否       | 点击会话头像的回调。   |
| NavigationBar        | function                    | 否       | 自定义导航栏组件。   |
| enableNavigationBar  | boolean                     | 否       | 是否激活导航栏。如果为 `false`，则不显示导航栏。    |
| selectType           | ConversationSelectModeType  | 否       | 选择模式。包括普通模式和多选模式。   |
| thread               | ChatMessageThread           | 否       | 话题模式参数。话题对象。   |
| firstMessage         | ChatMessageThread           | 否       | 话题模式参数。话题消息对象。 |
| msgId                | string                      | 否       | 创建话题模式或者搜索模式的参数。话题消息的 ID，或者是搜索模式的消息关键字。|
| parentId             | string                      | 否       | 创建话题模式参数。该话题的所在群组 ID。  |
| newThreadName        | string                      | 否       | 创建话题模式参数。该话题的名称。   |
| onCreateThreadResult | string                      | 否       | 创建话题模式参数。创建话题的结果回调通知。      |
| onClickedThread      | function                    | 否       | 点击消息气泡，打开话题页面的回调通知。可能用到路由。  |
| onClickedVoice       | function                    | 否       | 点击导航栏音频按钮的回调通知。可能用到路由。  |
| onClickedVideo       | function                    | 否       | 点击导航栏视频按钮的回调通知。可能用到路由。   |
| onThreadDestroyed    | function                    | 否       | 话题销毁的回调通知。可能用到路由。   |
| onThreadKicked       | function                    | 否       | 离开话题的回调通知。可能用到路由。   |
| onForwardMessage     | function                    | 否       | 转发消息的回调通知。可能用到路由。   |

## 输入组件

`MessageInput` 组件主要发送消息。默认支持发送文本、表情、图片、语音、视频、文件、自定义等消息。还支持发送复合类型消息，例如：引用消息、修改消息、名片消息等。

### 自定义输入组件

`MessageInput` 组件提供自定义菜单，可以添加自定义项，实现发送自定义消息。

核心属性如下：

| 属性                             | 类型                       | 是否必选 | 描述                                              |
| -------------------------------- | -------------------------- | -------- | ------------------------------------------------- |
| convId                           | string                     | 是       | 会话 ID。                                         |
| convType                         | ChatConversationType       | 是       | 会话类型。                                        |
| selectType                       | ConversationSelectModeType | 否       | 选择模式。包括普通模式和多选模式。                |
| top                              | number                     | 否       | 若使用了 `SafeAreaView` 组件，需要设置 `top`。    |
| bottom                           | number                     | 否       | 若使用了 `SafeAreaView` 组件，需要设置 `bottom`。 |
| numberOfLines                    | number                     | 否       | 输入文本组件的最大行数。默认 4 行。               |
| onClickedSend                    | function                   | 否       | 点击发送按钮的回调。                              |
| onEditMessageFinished            | function                   | 否       | 编辑消息完成的回调。                              |
| onClickedCardMenu                | function                   | 否       | 点击名片消息的回调。                              |
| onInitMenu                       | function                   | 否       | 注册初始化菜单的回调。                            |
| emojiList                        | string[]                   | 否       | 自定义表情列表。如果不设置，使用默认列表。        |
| multiSelectCount                 | number                     | 否       | 多选模式下的选择消息数量。                        |
| onClickedMultiSelectDeleteButton | function                   | 否       | 点击删除按钮的回调通知。 内部跳转。               |
| onClickedMultiSelectShareButton  | function                   | 否       | 点击转发按钮的回调通知。内部路由。                |
| unreadCount                      | number                     | 否       | 消息未读数。                                      |
| onClickedUnreadCount             | function                   | 否       | 消息未读数的回调通知。                            |

引用对象的核心方法如下：

| 方法            | 描述                               |
| --------------- | ---------------------------------- |
| close           | 关闭输入组件键盘，切换到一般模式。 |
| quoteMessage    | 回复消息。                         |
| editMessage     | 编辑消息。                         |
| showMultiSelect | 打开多选模式。消息列表出现复选框。 |
| hideMultiSelect | 取消多选模式。消息列表隐藏复选框。 |

## 消息列表组件

`MessageList` 组件主要显示和管理消息列表，支持添加、编辑和删除消息列表项。

- 发送消息会显示在消息列表，消息发送到服务器会修改消息状态，对方已读会修改状态。
- 发送消息后，在规定时间内可以撤销、编辑和回复。
- 接收的消息可以设置已读状态，附件类型消息支持附件下载。
- 消息菜单支持更新或者添加自定义项。
- 消息列表项支持修改样式、布局和显示隐藏。

### 自定义消息列表组件

核心属性如下：

| 属性                          | 类型                       | 是否必选 | 描述                                                                        |
| ----------------------------- | -------------------------- | -------- | --------------------------------------------------------------------------- |
| convId                        | string                     | 是       | 会话 ID。                                                                   |
| convType                      | ChatConversationType       | 是       | 会话类型。                                                                  |
| selectType                    | ConversationSelectModeType | 否       | 选择模式。包括普通模式和多选模式。                                          |
| containerStyle                | object                     | 否       | 修改组件样式。                                                              |
| thread                        | ChatMessageThread          | 否       | 话题模式参数。话题对象。                                                    |
| msgId                         | string                     | 否       | 创建话题模式或者搜索模式的参数。话题消息的 ID，或者是搜索模式的消息关键字。 |
| parentId                      | string                     | 否       | 创建话题模式参数。该话题的所在群组 ID。                                     |
| newThreadName                 | string                     | 否       | 创建话题模式参数。该话题的名称。                                            |
| firstMessage                  | ChatMessageThread          | 否       | 话题模式参数。话题消息对象。                                                |
| onClicked                     | function                   | 否       | 点击消息列表的回调。                                                        |
| onClickedItem                 | function                   | 否       | 点击消息的回调。                                                            |
| onLongPressItem               | function                   | 否       | 长按消息的回调。                                                            |
| onClickedItemAvatar           | function                   | 否       | 点击消息头像的回调。                                                        |
| onClickedItemQuote            | function                   | 否       | 点击消息的回复的回调。                                                      |
| onQuoteMessageForInput        | function                   | 否       | 回复消息的回调。                                                            |
| onEditMessageForInput         | function                   | 否       | 修改消息的回调。                                                            |
| reportMessageCustomList       | array                      | 否       | 自定义消息举报的否的列表项。                                                |
| listItemRenderProps           | MessageListItemRenders     | 否       | 消息列表项的组件的自定义。还支持内部组件的自定义。                          |
| recvMessageAutoScroll         | boolean                    | 否       | 收到消息是否滚动到列表最下面。                                              |
| messageLayoutType             | MessageLayoutType          | 否       | 消息布局靠左还是靠右。                                                      |
| onInitMenu                    | function                   | 否       | 注册初始化菜单的回调。                                                      |
| onCopyFinished                | function                   | 否       | 复制完成的回调。                                                            |
| recvMessageAutoScroll         | boolean                    | 否       | 收到新消息是否自动滚动屏幕消息列表。                                        |
| messageLayoutType             | MessageLayoutType          | 否       | 消息列表是居左还是居右。默认接收消息在左边，发送消息在右边。                |
| messageLayoutType             | MessageLayoutType          | 否       | 消息列表是居左还是居右。默认接收消息在左边，发送消息在右边。                |
| onNoMoreMessage               | function                   | 否       | 已经没有更多消息的回调通知。可能多次通知注意去重。                          |
| onCreateThread                | function                   | 否       | 请求创建话题的回调通知。可能用到路由。                                      |
| onOpenThread                  | function                   | 否       | 打开话题的回调通知。可能用到路由。                                          |
| onCreateThreadResult          | function                   | 否       | 创建话题结果的回调通知。可能用到路由。                                      |
| onClickedEditThreadName       | function                   | 否       | 编辑话题名称的回调通知。可能用到路由。                                      |
| onClickedOpenThreadMemberList | function                   | 否       | 查看话题成员列表的回调通知。可能用到路由。                                  |
| onClickedLeaveThread          | function                   | 否       | 离开话题的回调通知。可能用到路由。                                          |
| onClickedDestroyThread        | function                   | 否       | 销毁话题的回调通知。可能用到路由。                                          |
| onClickedMultiSelected        | function                   | 否       | 点击多选菜单的回调通知。                                                    |
| onChangeMultiItems            | function                   | 否       | 多选结果的回调通知。                                                        |
| onClickedSingleSelect         | function                   | 否       | 点击转发的回调通知。                                                        |
| onClickedHistoryDetail        | function                   | 否       | 点击历史消息的回调通知。可能用到路由。                                      |
| onChangeUnreadCount           | function                   | 否       | 未读数发生变更的回调通知。可能用到路由。                                    |

对象引用的方法如下：

| 方法                     | 描述                              |
| ------------------------ | --------------------------------- |
| addSendMessage           | 发送消息。                        |
| addSendMessageToUI       | 发送消息到 UI，不会发送到服务器。 |
| sendMessageToServer      | 发送到服务器。                    |
| removeMessage            | 移除消息。                        |
| recallMessage            | 撤回消息。                        |
| updateMessage            | 更新消息。                        |
| loadHistoryMessage       | 加载历史消息。                    |
| onInputHeightChange      | 输入组件的高度变化。              |
| editMessageFinished      | 编辑消息完成。                    |
| scrollToBottom           | 滚动到消息底部。                  |
| startShowThreadMoreMenu  | 显示底部话题菜单。                |
| cancelMultiSelected      | 取消多选。                          |
| removeMultiSelected      | 移除已经选择的消息。              |
| getMultiSelectedMessages | 获取已经选择的消息列表。          |

### 消息列表的头像和昵称

`MessageList` 组件内部并没有头像和昵称的默认值，需要用户提供。若未提供，则展示默认头像和用户 ID。

可通过以下方式提供头像和昵称：

- 注册回调：使用 `Container` 组件的 `onRequestMultiData` 属性实现。
- 主动调用：使用 `ChatService.updateDataList` 方法实现。调用该方法会触发内部事件分发，刷新已加载的组件页面。
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
        type={"chat"}
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
