# 会话页面

会话列表组件支持创建、更新、删除会话、会话样式修改、会话状态改变（如未读消息数）等。

## 集成会话页面

在项目中集成会话页面组件 `ConversationListFragment`，并传入相应的参数即可使用。

| 参数           | 是否必需   | 描述      |
| :------------- | :-----| :----- | :-------- |
| `chatId `        | 是   | 会话 ID。     |
| `chatType`         | 是   | 会话类型。 <br/> - `0`：单聊；<br/> - `1`：群聊； <br/> - `2`：聊天室。             |
| `propsRef` | 否 | 设置会话列表控制器。通过会话列表控制器可以实现以下会话操作：<br/> - 创建会话；<br/> - 更新会话，如更新会话排序、会话样式和消息未读数；<br/> - 删除会话；<br/> - `updateRead`：将会话设置为已读；<br/> - `updateExtension`：设置会话自定义字段。|
| `onLongPress` | 否 | 按住会话列表项时发生。  |
| `onPress` | 否 | 单击会话列表项时发生。  |
| `onUpdateReadCount` | 否 | 更新会话列表项的消息未读数时发生。  |
| `sortPolicy` | 否 | 设置会话列表项的排序规则。  |
| `RenderItem`  | 否 | 自定义会话列表项的样式。  |

```typescript
import * as React from "react";
import {
  ConversationListFragment,
  ScreenContainer,
} from "react-native-chat-uikit";
export default function ChatScreen(): JSX.Element {
  const chatId = "xxx"; // 会话 ID，String 类型。
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={["right", "left", "bottom"]}>
      <ConversationListFragment />
    </ScreenContainer>
  );
}
```

效果如下图所示：

![img](@static/images/rnuikit/conv_list_overview.png)

## 自定义实现
### 自定义会话样式

你可以设置 `ConversationListFragment` 中的 `RenderItem` 自定义会话样式，例如自定义头像、消息未读数以及消息时间戳等。

:::notice
如果开启侧滑功能，则需要设置侧滑组件的宽度。
:::

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = "xxx";
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={["right", "left", "bottom"]}>
      <ConversationListFragment
        RenderItem={(props) => {
          return <View />;
        }}
      />
    </ScreenContainer>
  );
}
```

效果如下图所示：

![img](@static/images/rnuikit/conv_list_custom_1.png)
![img](@static/images/rnuikit/conv_list_custom_2.png)
![img](@static/images/rnuikit/conversation_list_slide_menu.png)

### 自定义会话排序

会话默认按会话 ID `convId` 排序。你可以设置 `ConversationListFragment` 中的 `sortPolicy` 自定义会话排序，如置顶会话或按会话中的最新一条消息的时间戳排序。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = "xxx";
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={["right", "left", "bottom"]}>
      <ConversationListFragment
        sortPolicy={(a: ItemDataType, b: ItemDataType) => {
          if (a.key > b.key) {
            return 1;
          } else if (a.key < b.key) {
            return -1;
          } else {
            return 0;
          }
        }}
      />
    </ScreenContainer>
  );
}
```

效果如下图所示：

![img](@static/images/rnuikit/conv_list_sort.png)

### 自定义会话的未读消息数

很多组件需要关注会话的未读消息数的通知来改变消息提醒的状态。

你可以设置 `ConversationListFragment` 中的 `onUpdateReadCount` 自定义会话的未读消息数。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = "xxx";
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={["right", "left", "bottom"]}>
      <ConversationListFragment
        onUpdateReadCount={(unreadCount: number) => {
          // TODO：显示未读消息数
        }}
      />
    </ScreenContainer>
  );
}
```

效果如下图所示：

![img](@static/images/rnuikit/conv_list_unread_count.png)

### 自定义会话点击事件

你可以设置 `ConversationListFragment` 中的 `onPress` 自定义会话点击事件。例如，你可以点击会话列表项，进入聊天页面。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = "xxx";
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={["right", "left", "bottom"]}>
      <ConversationListFragment
        onPress={(data?: ItemDataType) => {
          // TODO：进入聊天页面。
        }}
      />
    </ScreenContainer>
  );
}
```

### 自定义会话列表项长按事件

你可以设置 `ConversationListFragment` 中的 `onLongPress` 自定义会话列表项，例如长按后显示该项目的右键菜单。

```typescript
export default function ChatScreen(): JSX.Element {
  const chatId = "xxx";
  const chatType = 0;
  return (
    <ScreenContainer mode="padding" edges={["right", "left", "bottom"]}>
      <ConversationListFragment
        onLongPress={(data?: ItemDataType) => {
          // TODO：显示自定义菜单。
        }}
      />
    </ScreenContainer>
  );
}
```

效果如下图所示：

![img](@static/images/rnuikit/conv_list_long_press.png)






