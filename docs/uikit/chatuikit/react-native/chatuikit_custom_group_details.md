# 群详情页面

你可以配置群详情页面的导航栏、自定义按钮和群详情列表项等。

![img](/images/uikit/chatuikit/ios/custom_group_details.png)

## 自定义导航栏

该导航栏组件为通用组件，在成员页面,导航栏左边组件为返回按钮、右边为功能扩展菜单。自定义方式和方法和会话列表类似。

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupParticipantListScreen(props: Props) {
  const { route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  return (
    <GroupParticipantList
      groupId={groupId}
      customNavigationBar={
        <TopNavigationBar
          Left={
            <TopNavigationBarLeft onBack={() => {}} content={"participant"} />
          }
          Right={
            isOwner === true ? (
              <View style={{ flexDirection: "row" }}>
                <Pressable style={{ padding: 6 }}>
                  <IconButton
                    iconName={"person_add"}
                    style={{ width: 24, height: 24 }}
                    onPress={() => {}}
                  />
                </Pressable>
                <View style={{ width: 4 }} />
                <Pressable style={{ padding: 6 }}>
                  <IconButton
                    iconName={"person_minus"}
                    style={{ width: 24, height: 24, padding: 6 }}
                    onPress={() => {}}
                  />
                </Pressable>
              </View>
            ) : null
          }
        />
      }
    />
  );
}
```

## 自定义列表项

对于详情页面提供了 属性 `customItemRender` 可以修改列表项。默认包括消息免打扰、清空聊天记录等。

可以添加、删除、修改列表项，每个列表项可以修改样式、布局、事件等内容。

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupInfoScreen(props: Props) {
  const { route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const ownerId = ((route.params as any)?.params as any)?.ownerId;

  return (
    <GroupInfo
      groupId={groupId}
      ownerId={ownerId}
      customItemRender={(items) => {
        items.push(
          <View style={{ height: 100, width: 100, backgroundColor: "green" }} />
        );
        return items;
      }}
    />
  );
}
```

## 自定义按钮

对于详情页面，提供了属性 `onInitButton` 自定义按钮。默认包括发消息、音频通话、视频通话等。

可以添加、删除、修改按钮项，每个按钮项可以修改样式、布局、事件等内容。

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function GroupInfoScreen(props: Props) {
  const { route } = props;
  const groupId = ((route.params as any)?.params as any)?.groupId;
  const ownerId = ((route.params as any)?.params as any)?.ownerId;

  return (
    <GroupInfo
      groupId={groupId}
      ownerId={ownerId}
      onInitButton={(items) => {
        items.length = 0;
        items.push(
          <BlockButton key={"1001"} iconName="2_bars_in_circle" text="test" />
        );
        return items;
      }}
    />
  );
}
```
