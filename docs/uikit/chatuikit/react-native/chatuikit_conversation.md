# 会话列表

<Toc />

`ConversationList` 组件提供显示和管理会话列表。默认情况下，该组件提供创建新会话、删除会话、会话消息免打扰、会话置顶等功能：

- 点击搜索按钮，跳转到搜索页面，搜索会话。
- 点击会话列表项，跳转到会话详情页面。
- 点击导航栏的扩展按钮，选择新会话，创建新会话。
- 长按会话列表项显示菜单，可进行删除会话、置顶会话、消息免打扰操作。

单条会话展示会话名称、最后一条消息、最后一条消息的时间以及置顶和禁言状态等。

会话的名称展示取决于会话的类型：

- 对于单聊, 会话展示的名称为对端用户的昵称。若对端用户未设置昵称则展示对方的用户 ID；会话头像是对方的头像，如果没有设置则使用默认头像。

- 对于群聊，会话名称为当前群组的名称，头像为默认头像。

会话列表相关功能，详见[功能介绍文档](chatfeature_conversation.html)。

![img](/images/uikit/chatuikit/android/page_conversation.png =400x840)

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

## 自定义会话列表页面

`ConversationList` 组件提供的核心属性如下：

| 属性                     | 类型      | 是否必选 | 描述                                                                   |
| ------------------------ | --------- | -------- | ---------------------------------------------------------------------- |
| containerStyle           | object    | 否       | 修改组件样式。                                                 |
| onSort                   | function  | 否       | 自定义列表排序策略。          |
| onClickedNewConversation | function  | 否       | 点击导航栏右上角的按钮，创建新会话后的回调。例如，进行路由跳转。 |
| onClickedNewGroup        | function  | 否       | 点击导航栏右上角的按钮，点击创建群组按钮的回调。例如，进行路由跳转。                            |
| onClickedNewContact      | function  | 否       | 点击导航栏右上角的按钮，点击添加联系人按钮的回调。 例如，进行路由跳转。             |
| ListItemRender           | function  | 否       | 自定义会话列表项的组件。可以实现修改布局、样式、是否可见等，包括头像、昵称、时间，最后一条消息的快照等。 |
| onStateChanged           | function  | 否       | 列表组件状态通知。包括：加载失败、列表为空等。                         |
| propsRef                 | reference | 否       | 列表组件的引用对象，可以主动添加、修改、删除会话列表项，注意操作条件。 |
| onInitNavigationBarMenu  | function  | 否       | 自定义列表导航栏，可以修改样式、事件行为等。                           |
| onInitBottomMenu         | function  | 否       | 注册菜单项，自定义菜单。                                               |
| filterEmptyConversation  | function  | 否       | 是否过滤空会话。                                                       |
| onChangeUnreadCount      | function  | 否       | 未读消息总数变更的回调通知。                                           |

### 自定义导航栏

导航栏组件为通用组件，布局为左中右。该组件 `TopNavigationBar` 支持自定义左中右布局。左中右子组件可选且支持自定义，例如，修改样式、布局、行为、颜色等。

例如，导航栏左侧可添加返回按钮、头像，中部组件可添加标题，右侧可添加扩展菜单等。

你也可以使用 `View` 组件实现自定义导航栏。相对于 `TopNavigationBar` 组件，`View` 组件较为灵活，例如支持设置导航栏背景色。

```tsx
type MyConversationListScreenProps = {};
function MyConversationListScreen(props: MyConversationListScreenProps) {
  const {} = props;
  const convRef = React.useRef<ConversationListRef>({} as any);
  const { tr } = useI18nContext();

  return (
    <ConversationList
      propsRef={convRef}
      customNavigationBar={
        <TopNavigationBar
          Left={
            <StatusAvatar
              url={
                'https://cdn3.iconfinder.com/data/icons/vol-2/128/dog-128.png'
              }
              size={32}
              onClicked={() => {
                convRef.current?.showStatusActions?.();
              }}
              userId={'userId'}
            />
          }
          Right={TopNavigationBarRight}
          RightProps={{
            onClicked: () => {
              convRef.current?.showMoreActions?.();
            },
            iconName: 'plus_in_circle',
          }}
          Title={TopNavigationBarTitle({
            text: tr('_uikit_navi_title_chat'),
          })}
        />
      }
    />
  );
}
```

### 设置会话列表项

通过 `ListItemRender` 属性实现列表项的样式、布局修改，例如，会话列表项的高度、宽度、背景颜色、上下边距、左右边距以及会话列表项的自定义点击行为和长按行为等。

```tsx
type MyConversationListScreenProps = {};
function MyConversationListScreen(props: MyConversationListScreenProps) {
  const {} = props;
  const convRef = React.useRef<ConversationListRef>({} as any);

  return (
    <ConversationList
      propsRef={convRef}
      ListItemRender={() => {
        // todo: 自定义列表项样式
        return (
          <Pressable
            style={{
              height: 40,
              width: '100%',
              marginVertical: 10,
              backgroundColor: 'red',
            }}
            onPress={() => {
              // todo: 自定义点击行为
            }}
            onLongPress={() => {
              // todo: 自定义长按行为
            }}
          />
        );
      }}
    />
  );
}
```

默认组件不支持侧滑，你需要自定义列表项组件，例如，在左滑和右滑菜单中添加按钮。其中，`SlideListItem` 组件在 `uikit` 中提供，示例如下：

```tsx
type MyConversationListScreenProps = {};
function MyConversationListScreen(props: MyConversationListScreenProps) {
  const {} = props;
  const convRef = React.useRef<ConversationListRef>({} as any);

  return (
    <ConversationList
      propsRef={convRef}
      ListItemRender={() => {
        const { data } = props;
        return (
          <SlideListItem    
            height={100}
            leftExtraWidth={100}
            rightExtraWidth={100}
            data={data}
            key={data.convId}
            containerStyle={{
              backgroundColor: 'orange',
            }}
            onPress={() => {
              console.log('test:zuoyu: onPress');
            }}
            onLongPress={() => {
              console.log('test:zuoyu: onLongPress');
            }}
          >
            <View 
              style={{
                width: Dimensions.get('window').width + 200,
                height: '100%',
                backgroundColor: 'orange',
                flexDirection: 'row',
              }}
            >
              <View
                style={{
                  backgroundColor: 'yellow',
                  height: '100%',
                  width: 100,
                }}
              />
              <View
                style={{
                  backgroundColor: 'blue',
                  height: '100%',
                  width: Dimensions.get('window').width,
                }}
              />
              <View />
            </View>
          </SlideListItem>
        );
      }}
    />
  );
}
```

### 设置头像和昵称

`ConversationList` 组件列表项主要分为用户和群组。列表项的头像和昵称优先使用用户提供的数据，缺省使用默认头像和 ID，例如，群组类型缺省使用默认头像和群组 ID。

可通过以下方式提供头像和昵称：

- 注册回调：使用 `Container` 组件的 `onUsersHandler` 和 `onGroupsHandler` 属性实现。
- 主动调用：使用 `ChatService.updateDataList` 方法实现。调用该方法会触发内部事件分发, 还可以自定义分发句柄，刷新已加载的组件页面。

:::tip
无论哪种更新方式，都会更新缓存数据，主动更新还会触发 UI 组件刷新。
:::

### 事件通知

事件通知在列表中已经实现，收到对应事件会更新列表。通常情况下，不需要开发者关注。
