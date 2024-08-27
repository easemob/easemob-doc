# 单群聊 UIKit 通用特性

本文介绍单群聊 UIKit 通用特性，包括会话列表、聊天、群组和联系人等相关功能。

<Toc />

## 会话列表

会话列表呈现了用户所有正在进行的对话，帮助用户快速找到所需联系人并查看消息进展。

![img](/images/uikit/chatuikit/feature/common/conversation_list.png =350x750)

## 聊天	

聊天是即时通讯的核心功能之一，它允许用户与其他用户进行实时文字交流。聊天通常以会话的形式进行，每个会话由两个或多个用户组成。

![img](/images/uikit/chatuikit/feature/common/chat.png  =350x750)

## 创建会话

创建会话是即时通讯的核心功能之一，它允许用户启动与一个或多个其他用户交流。

![img](/images/uikit/chatuikit/feature/common/conversation_create.png)

## 创建群组	

群组是允许多个用户加入的聊天会话。用户可以邀请其他用户加入群组，并对群组进行管理。

![img](/images/uikit/chatuikit/feature/common/group_create.png)

## 群组管理员	

群组管理员拥有对群组的所有权限，包括：添加或删除群成员，修改群组名称、描述和头像，禁言或踢出群成员等。

![img](/images/uikit/chatuikit/feature/common/group_admin.png) 

## 用户列表	

用户列表显示了用户的所有联系人，包括联系人列表，群成员列表和黑名单等。用户可以通过用户列表快速找到需要联系的人。

![img](/images/uikit/chatuikit/feature/common/user_list.png =350x760) 

## 文件共享	

文件共享允许用户通过即时通讯应用发送和接收文件。文件共享可以用于分享文档、图片、视频等文件。

![img](/images/uikit/chatuikit/feature/common/file_share.png =600x630) 

## 未读消息数	

未读消息数是指用户收到的但尚未查看的消息数量。

![img](/images/uikit/chatuikit/feature/common/message_unread_count.png =600x630) 

## 已发送回执	

已发送回执用于告知消息发送者，其发送的消息已经成功发送到服务器、接收方以及发送失败。

![img](/images/uikit/chatuikit/feature/common/message_delivery_receipt.png) 

## 已读回执

已读回执用于告知消息发送者，接收者已经阅读了其发送的消息。

![img](/images/uikit/chatuikit/feature/common/message_read_receipt.png =300x630) 

## 联系人名片	

联系人名片指包含联系人详细信息的电子卡片，通常包括头像和昵称等信息。通过联系人名片，用户可以快速添加联系人或开始会话。

![img](/images/uikit/chatuikit/feature/common/contact_namecard.png) 

## 语音消息

语音消息指以语音形式发送和接收的消息，可替代文字交流。

![img](/images/uikit/chatuikit/feature/common/message_audio.png =700x730) 

## 消息审核

消息审核对用户发送的消息内容进行审查，判断其是否符合平台的社区准则、服务条款和相关法律法规。

![img](/images/uikit/chatuikit/feature/common/message_report.png =300x630) 

## 输入状态指示

输入状态指示功能指在单聊会话中实时显示会话的一方正在输入的状态，增强通讯互动的实时性。此功能有助于用户了解对方是否正在回复，从而优化沟通体验，提升对话流畅度。

在单聊页面中，当前用户持续输入文本字符，该行为会通过服务器将该状态传输给对方，对方收到输入状态，将状态显示在 UI 上。

// image

### 如何使用

输入状态指示特性默认开启，默认值为 `true`。要关闭该特性，需将 `ContainerProps.enableTyping` 参数设置为 `false`。

示例代码如下：

```tsx
export function App() {
  // 设置是否启用正在输入状态
  const enableTypingRef = React.useRef(false);

  return (
    <UIKitContainer enableTyping={enableTypingRef.current}>
      {/* your custom component */}
      <ToastView />
    </UIKitContainer>
  );
}
```

### 自定义输入状态指示 UI

本功能使用 SDK 的透传消息实现，详见 [SDK 相关文档](/document/android/message_send_receive.html#通过透传消息实现输入指示器)。

如果需要自定义正在输入组件样式，需要自定义聊天页面组件的导航栏组件，可以参考 `ConversationDetailNavigationBar` 组件。

## 本地消息搜索

本地消息搜索功能允许用户快速在会话内搜索历史消息内容，支持关键词匹配。该功能帮助用户高效找到所需信息，提高工作效率和信息管理的便捷性。

在消息搜索页面，输入关键字搜索当前会话的历史消息，如果有结果会以列表的形式返回，点击搜索结果可以跳转到该消息的位置。

// image

### 如何使用

消息搜索组件 `MessageSearch` 为独立页面，需要输入必要参数 `convId`, `convType`, `onClickedItem`。

示例代码如下：

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function MessageSearchScreen(props: Props) {
  const { route } = props;
  const navi = useStackScreenRoute(props);
  const convId = ((route.params as any)?.params as any)?.convId;
  const convType = ((route.params as any)?.params as any)?.convType;
  return (
    <SafeAreaViewFragment>
      <MessageSearch
        onCancel={(_data?: MessageSearchModel) => {
          navi.goBack();
        }}
        convId={convId}
        convType={convType}
        onClickedItem={(item) => {
          navi.push({
            to: "MessageHistory",
            props: {
              convId: convId,
              convType: convType,
              messageId: item.msg.msgId,
            },
          });
        }}
      />
    </SafeAreaViewFragment>
  );
}
```

### 自定义本地消息搜索

消息搜索组件 `MessageSearch` 提供了基本的样式等参数修改。也可以自行实现消息搜索组件。
