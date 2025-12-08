# 聊天页面

## 概述

聊天页面组件 `ConversationDetail` 主要由输入组件、消息列表组件、菜单组件和导航栏组件组成。该组件支持以下功能：

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件和名片消息。
- 对消息进行复制、引用、撤回、删除、编辑、重新发送和审核。
- 清除本地消息。
- 消息翻译。
- 消息表情回复。
- 消息话题。
- 消息转发。

该组件支持多种模式：包括聊天模式、搜索结果显示模式、创建话题模式、话题模式。 通过 `ConversationDetailProps.type` 属性来区分。详见 `ConversationDetailModelType` 类型。

消息相关功能，详见[功能介绍文档](chatfeature_message.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/custom_chat.png" title="聊天页面" />
</ImageGallery>

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

## 聊天页面的核心属性

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
| onClickedThread      | function                    | 否       | 点击消息气泡，打开话题页面的回调通知。例如，进行路由跳转。  |
| onClickedVoice       | function                    | 否       | 点击导航栏音频按钮的回调通知。例如，进行路由跳转。  |
| onClickedVideo       | function                    | 否       | 点击导航栏视频按钮的回调通知。例如，进行路由跳转。   |
| onThreadDestroyed    | function                    | 否       | 话题销毁的回调通知。例如，进行路由跳转。   |
| onThreadKicked       | function                    | 否       | 离开话题的回调通知。例如，进行路由跳转。   |
| onForwardMessage     | function                    | 否       | 转发消息的回调通知。例如，进行路由跳转。   |