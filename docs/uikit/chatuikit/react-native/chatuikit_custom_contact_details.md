# 联系人详情页面

对于联系人详情页面，你可以自定义联系人导航栏、联系人列表项和自定义发消息、音频通话、视频通话等按钮。

<img src=/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_moreActions.png  title=“点击图片显示联系人操作” />&nbsp;&nbsp;
<img src=/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_detailExtensionActionItems.png  title="联系人详情自定义列表项"/>

## 自定义导航栏

导航栏组件为通用组件，布局为左中右。自定义方式和方法与会话列表类似，详见[会话列表页面的自定义导航栏部分](chatuikit_conversation.html#自定义导航栏)。

## 自定义按钮

对于详情页面，提供了属性 `onInitButton` 自定义按钮。默认包括发消息、音频通话、视频通话等。

可以添加、删除、修改按钮项，每个按钮项可以修改样式、布局、事件等内容。

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { route } = props;
  const userId = ((route.params as any)?.params as any)?.userId;

  return (
    <ContactInfo
      userId={userId}
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

## 自定义列表项

对于详情页面提供了 `customItemRender` 属性可以修改列表项。默认包括消息免打扰、清空聊天记录等。

可以添加、删除、修改列表项，每个列表项可以修改样式、布局、事件等内容。

```tsx
type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ContactInfoScreen(props: Props) {
  const { route } = props;
  const userId = ((route.params as any)?.params as any)?.userId;

  return (
    <ContactInfo
      userId={userId}
      customItemRender={(list) => {
        // todo: 增加自定义列表项
        list.push(
          <View style={{ height: 100, width: 100, backgroundColor: "green" }} />
        );
        return list;
      }}
    />
  );
}
```
