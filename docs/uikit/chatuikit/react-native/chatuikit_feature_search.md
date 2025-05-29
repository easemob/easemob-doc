# 本地消息搜索

本地消息搜索功能允许用户快速在会话内搜索历史消息内容，支持关键词匹配。该功能帮助用户高效找到所需信息，提高工作效率和信息管理的便捷性。

在消息搜索页面，输入关键字搜索当前会话的历史消息，如果有结果会以列表的形式返回，点击搜索结果可以跳转到该消息的位置。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/ios/message_search.png" title="本地消息搜索" />
</ImageGallery> 

## 如何使用

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

## 自定义本地消息搜索

消息搜索组件 `MessageSearch` 提供了基本的样式等参数修改。也可以自行实现消息搜索组件。