# 消息置顶

消息置顶指用户将重要信息固定在会话顶部，有助于用户快速访问关键会话，避免遗漏重要内容。该特性尤其适用于处理紧急事务或持续跟进的项目，帮助高效管理重要会话。

目前，群聊 UIKit 支持消息置顶。
通过 `ContainerProps.enableMessagePin` 控制消息置顶是否开启。默认开启。
在组件 `ConversationDetail` 内，内置消息置顶监听，动态更新消息置顶列表。
在组件 `MessageList` 内，调用上下文菜单，可以对消息进行置顶操作。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/message/message_pin_ios.png" title="消息置顶" />
</ImageGallery>

#### 如何使用

消息置顶特性默认开启，即 `enableMessagePin` 的默认值为 `true`。要关闭该特性，需将该参数设置为 `false`。

在聊天页面对消息置顶/取消置顶操作。在消息气泡上调用上下文菜单，选择消息置顶/取消置顶选项，执行成功后，更新消息置顶列表。

下面的示例代码为如何开启消息置顶功能：

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { Container as UIKitContainer } from "react-native-chat-uikit";
export function App() {
  // 默认为开启。若关闭，设置为 false。
  const enableMessagePin = true;
  return (
    <UIKitContainer
      options={{
        appKey: gAppKey,
      }}
      enableMessagePin={enableMessagePin}
    >
      {/** 其他示例代码 */}
    </UIKitContainer>
  );
}
```