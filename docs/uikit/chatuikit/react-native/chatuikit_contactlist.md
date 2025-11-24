# 自定义通讯录页面

## 自定义导航栏

导航栏组件为通用组件，布局为左中右。自定义方式和方法与会话列表类似，详见[会话列表页面的自定义导航栏部分](chatuikit_conversation.html#自定义导航栏)。

## 自定义联系人列表 Header

自定义 Header 列表项，可以添加、删除、修改列表项，每个列表项可以实现样式、布局、颜色等属性的修改。

```tsx
export const MyCustomItemView = (props: ContactItemProps) => {
  const {} = props;
  return <View style={{ width: 100, height: 44, backgroundColor: 'red' }} />;
};

export type MyContactListScreenProps = {};
function MyContactListScreen(props: MyContactListScreenProps) {
  const {} = props;

  return (
    <ContactList
      contactType={'contact-list'}
      onInitListItemActions={(
        defaultItems: React.ReactElement<ContactItemProps>[]
      ) => {
        defaultItems.push(<MyCustomItemView name={'custom item'} />);
        return defaultItems;
      }}
    />
  );
}
```

## 是否显示字母索引表和字母导航列表

```tsx
export type MyContactListScreenProps = {};
function MyContactListScreen(props: MyContactListScreenProps) {
  const {} = props;

  return (
    <ContactList
      contactType={'contact-list'}
      isVisibleIndex={false}
      isVisibleItemHeader={false}
    />
  );
}
```

## 自定义列表项样式

自定义列表项可以修改头像、昵称、样式（例如，列表项的高度和背景颜色）、布局等。

```tsx
export type MyContactListScreenProps = {};
function MyContactListScreen(props: MyContactListScreenProps) {
  const {} = props;

  return (
    <ContactList
      contactType={'contact-list'}
      ListItemRender={() => (
        <View style={{ height: 20, backgroundColor: 'red' }} />
      )}
    />
  );
}
```

## 设置头像和昵称

`ContactList` 组件内部并没有头像和昵称的默认值，需要用户提供。若未提供，则展示默认头像和用户 ID。

可通过以下方式提供头像和昵称：

- 注册回调：使用 `Container` 组件的 `onUsersHandler` 属性实现。
- 主动调用：使用 `ChatService#updateDataList` 方法实现。调用该方法会触发内部事件分发，刷新已加载的组件页面。

:::tip
无论哪种更新方式，都会更新缓存数据，主动更新还会触发 UI 组件刷新。
:::

## 事件通知

事件通知在列表中已经实现，收到对应事件会更新列表。通常情况下，不需要开发者关注。
