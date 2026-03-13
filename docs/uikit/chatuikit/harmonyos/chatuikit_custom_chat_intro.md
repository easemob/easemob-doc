# 聊天页面介绍

环信单群聊 UIKit 提供 `ChatPage` 和 `ChatView` 两种方式方便用户快速集成聊天页面和自定义聊天页面。该页面提供如下功能：

- 发送和接收消息，包括文本、表情、图片、语音、视频、文件和名片消息。
- 对消息进行复制、引用、撤回、删除、编辑、重新发送。
- 清除本地消息。

## 页面组件

聊天页面通过 `ChatPage` 或 `ChatView` 实现，由标题栏、消息列表和底部输入框组成。

// TODO：添加截图

### 标题栏

`ChatPage` 中的标题栏使用 `ComposeTitleBar` 组件，展示会话名称、头像和操作菜单。详见 [设置标题栏](chatuikit_custom_titlebar.html)。

### 消息列表

消息列表由 `ChatView` 实现，展示消息并支持交互操作：

- **发送和接收消息**：包括文本、表情、图片、语音、视频、文件和名片等消息。
- **消息操作**：对消息进行复制、引用、撤回、删除、编辑、重新发送操作。

### 底部输入框

消息底部输入框实现各类消息的输入和发送以及表情等功能，包括两部分：

- **底部输入菜单**：输入和发送文本和语音消息、添加表情以及扩展功能等。
- **消息扩展菜单**：发送附件类型消息，例如，图片、视频、文件以及自定义类型消息（如名片消息）等。

## 创建聊天页面

你可以根据使用场景选择方案：

| 场景                 | 推荐方案                    |
| :------------------- | :-------------------------- |
| 快速集成标准聊天功能 | `ChatPage`                  |
| 需要自定义标题栏     | `ChatView` + 自定义标题栏   |
| 需要深度自定义页面布局 | `ChatView` + 完全自定义布局 |

### 使用 ChatPage

`ChatPage` 包含完整的聊天界面，即包括标题栏、消息列表和底部输入框，通过 Navigation 路由直接跳转，示例代码如下：

```typescript
import { ChatType, ChatPageParams } from '@easemob/chatuikit';

// 在 NavPathStack 中跳转到 ChatPage
pathStack.pushPath({
  name: "ChatPage", 
  param: {
    conversationId: "user123",  // 单聊为对方用户 ID，群聊为群组 ID
    conversationType: ChatType.Chat  // ChatType.Chat(单聊) 或 ChatType.GroupChat(群聊)
  } as ChatPageParams
})
```

### 使用 ChatView

`ChatView` 仅包含消息列表和底部输入框，适用于需要自定义标题栏或页面布局的场景。

1. 创建自定义聊天页面：

```typescript
import { ChatPageParams, ChatType, ChatView, ComposeTitleBar } from '@easemob/chatuikit';

@ComponentV2
export struct MyChatPage {
  pathStack: NavPathStack = new NavPathStack();
  @Local conversationId: string = '';
  @Local chatType: ChatType = ChatType.Chat;

  build() {
    NavDestination() {
      ComposeTitleBar({
        primaryTitle: this.conversationId,
        onBackPress: () => {
          this.pathStack.pop();
        }
      })
      ChatView({
        conversationId: this.conversationId, // 单聊为对方用户 ID，群聊为群组 ID
        chatType: this.chatType,             // ChatType.Chat(单聊) 或 ChatType.GroupChat(群聊)
        pathStack: this.pathStack
      })
        .layoutWeight(1)
    }
    .hideTitleBar(true)
    .onReady((context) => {
      this.pathStack = context.pathStack;
      let params = this.pathStack.getParamByName("MyChatPage") as ChatPageParams[]
      if (params) {
        let param = params[0] as ChatPageParams;
        this.conversationId = param.conversationId;
        this.chatType = param.conversationType as number;
      } else {
        // 如果没有传参数则关闭当前页面
        this.pathStack.removeByName("MyChatPage");
      }
    })
  }
}

@Builder
export function MyChatPageBuilder() {
  MyChatPage();
}
```

以上示例创建了名为 `MyChatPage` 的自定义聊天页面。该页面包含自定义的标题栏和 `ChatView` 组件。

2. 在 `route_map.json` 中注册自定义页面：

```json
// 1. 工程配置文件 module.json5 中配置 {"routerMap": "$profile:route_map"}
// 2. 在 route_map.json 注册 MyChatPage 信息
{
  "routerMap": [
    {
      "name": "MyChatPage",
      "pageSourceFile": "src/main/ets/pages/MyChatPage.ets",
      "buildFunction": "MyChatPageBuilder",
      "data": {
        "description" : "Chat page"
      }
    }
  ]
}
```

3. 跳转到自定义聊天页面：

```typescript
this.navPathStack?.pushPath({name: "MyChatPage", param: {
    conversationId: this.conversationId,
    conversationType: this.conversationType
} as ChatPageParams
});
```
