# 会话列表页面

## 概述

会话列表组件 `ConversationList` 组件提供显示和管理会话列表。默认情况下，该组件提供创建新会话、删除会话、会话消息免打扰、会话置顶等功能：

- 点击搜索按钮，跳转到搜索页面，搜索会话。
- 点击会话列表项，跳转到会话详情页面。
- 点击导航栏的扩展按钮，选择新会话，创建新会话。
- 长按会话列表项显示菜单，可进行删除会话、置顶会话、消息免打扰操作。

单条会话展示会话名称、最后一条消息、最后一条消息的时间以及置顶和禁言状态等。

会话的名称展示取决于会话的类型：

- 对于单聊, 会话展示的名称为对端用户的昵称。若对端用户未设置昵称则展示对方的用户 ID；会话头像是对方的头像，如果没有设置则使用默认头像。

- 对于群聊，会话名称为当前群组的名称，头像为默认头像。

会话列表相关功能，详见[功能介绍文档](chatfeature_conversation.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/custom_conversation_list.png" title="会话列表" />
</ImageGallery>

使用默认参数时的示例代码如下：

```tsx
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ConversationListScreen(props: Props) {
  const { navigation } = props;

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ConversationList
        onClickedSearch={() => {
          // 跳转到搜索页面
          navigation.push("SearchConversation", {});
        }}
        onClickedItem={(data) => {
          // 跳转到会话详情页面
          if (data === undefined) {
            return;
          }
          const convId = data?.convId;
          const convType = data?.convType;
          const convName = data?.convName;
          navigation.push("ConversationDetail", {
            params: {
              convId,
              convType,
              convName: convName ?? convId,
            },
          });
        }}
        onClickedNewConversation={() => {
          // 跳转到创建新会话页面
          navigation.navigate("NewConversation", {});
        }}
      />
    </SafeAreaView>
  );
}
```

## 会话列表组件的核心属性

`ConversationList` 组件提供的核心属性如下：

| 属性                     | 类型      | 是否必选 | 描述      |
| ------------------------ | --------- | -------- | ------------------------ |
| containerStyle           | object    | 否       | 修改组件样式。     |
| onSort                   | function  | 否       | 自定义列表排序策略。          |
| onClickedNewConversation | function  | 否       | 点击导航栏右上角的按钮，创建新会话后的回调。例如，进行路由跳转。 |
| onClickedNewGroup        | function  | 否       | 点击导航栏右上角的按钮，点击创建群组按钮的回调。例如，进行路由跳转。    |
| onClickedNewContact      | function  | 否       | 点击导航栏右上角的按钮，点击添加联系人按钮的回调。 例如，进行路由跳转。  |
| ListItemRender           | function  | 否       | 自定义会话列表项的组件。可以实现修改布局、样式、是否可见等，包括头像、昵称、时间，最后一条消息的快照等。 |
| onStateChanged           | function  | 否       | 列表组件状态通知。包括：加载失败、列表为空等。   |
| propsRef                 | reference | 否       | 列表组件的引用对象，可以主动添加、修改、删除会话列表项，注意操作条件。 |
| onInitNavigationBarMenu  | function  | 否       | 自定义列表导航栏，可以修改样式、事件行为等。  |
| onInitBottomMenu         | function  | 否       | 注册菜单项，自定义菜单。    |
| filterEmptyConversation  | function  | 否       | 是否过滤空会话。       |
| onChangeUnreadCount      | function  | 否       | 未读消息总数变更的回调通知。             |