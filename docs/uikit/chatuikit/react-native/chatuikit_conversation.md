# 会话列表

<Toc />

`ConversationList` 组件提供显示和管理会话列表。默认情况下，该组件提供创建新会话、删除会话、会话消息免打扰、会话置顶等功能：

- 点击搜索按钮，跳转到搜索页面，搜索会话。
- 点击会话列表项，跳转到会话详情页面。
- 点击导航栏的扩展按钮，选择新会话，创建新会话。
- 长按会话列表项显示菜单，可进行删除会话、置顶会话、消息免打扰操作。

会话的名称展示取决于会话的类型：

- 对于单聊, 会话展示的名称为对端用户的昵称。若对端用户未设置昵称则展示对方的用户 ID；会话头像是对方的头像，如果没有设置则使用默认头像。

- 对于群聊，会话名称为当前群组的名称，头像为默认头像。

![img](@static/images/uikit/chatuikit/android/page_conversation.png =400x800) 

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
        containerStyle={{
          flexGrow: 1,
        }}
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

## 自定义会话列表

`ConversationList` 组件提供的核心属性如下：

| 属性                     | 类型      | 是否必选 | 描述                                                                   |
| ------------------------ | --------- | -------- | ---------------------------------------------------------------------- |
| containerStyle           | object    | 否       | 修改组件样式。                                                         |
| onSort                   | function  | 否       | 自定义列表排序策略。                                                   |
| onClickedNewConversation | function  | 否       | 点击创建新会话按钮的回调。                                             |
| onClickedNewGroup        | function  | 否       | 点击创建群组按钮的回调。                                               |
| onClickedNewContact      | function  | 否       | 点击添加联系人按钮的回调。                                             |
| ListItemRender           | function  | 否       | 自定义会话列表项的组件。可以实现修改布局、样式、是否可见等。           |
| onStateChanged           | function  | 否       | 列表组件状态通知。包括：加载失败、列表为空等。                         |
| propsRef                 | reference | 否       | 列表组件的引用对象，可以主动添加、修改、删除会话列表项，注意操作条件。 |
| onInitNavigationBarMenu  | function  | 否       | 自定义列表导航栏，可以修改样式、事件行为等。                           |
| onInitBottomMenu         | function  | 否       | 注册菜单项，自定义菜单。                                               |
| filterEmptyConversation  | function  | 否       | 是否过滤空会话。                                                       |

## 头像和昵称

`ConversationList` 组件列表项主要分为用户和群组。列表项的头像和昵称优先使用用户提供的数据，缺省使用默认头像和 ID。如果群组类型缺省使用默认头像和 ID。（有人会问为啥不使用群组名称，因为这里还没有获取到群组列表，后续会优化）。

可通过以下方式提供头像和昵称：

- 注册回调：使用 `Container` 组件的 `onRequestMultiData` 属性实现。
- 主动调用：使用 `ChatService.updateRequestData` 方法实现。调用该方法会触发内部事件分发，刷新已加载的组件页面。

:::tip
无论哪种更新方式，都会更新缓存数据，主动更新还会触发 UI 组件刷新。
:::

### 事件通知

事件通知在列表中已经实现，收到对应事件会更新列表。通常情况下，不需要开发者关注。

### 示例应用

TODO：添加如何获取会话中未读消息总数，添加描述+示例代码 没时间不做了
