# 自定义会话列表页面

## 自定义导航栏

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

## 设置会话列表项

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

## 设置头像和昵称

`ConversationList` 组件列表项主要分为用户和群组。列表项的头像和昵称优先使用用户提供的数据，缺省使用默认头像和 ID，例如，群组类型缺省使用默认头像和群组 ID。

可通过以下方式提供头像和昵称：

- 注册回调：使用 `Container` 组件的 `onUsersHandler` 和 `onGroupsHandler` 属性实现。
- 主动调用：使用 `ChatService.updateDataList` 方法实现。调用该方法会触发内部事件分发, 还可以自定义分发句柄，刷新已加载的组件页面。

:::tip
无论哪种更新方式，都会更新缓存数据，主动更新还会触发 UI 组件刷新。
:::

## 事件通知

事件通知在列表中已经实现，收到对应事件会更新列表。通常情况下，不需要开发者关注。
