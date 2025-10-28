#  创建聊天页面

- 使用 `ChatPage`

单群聊 UIKit 提供 `ChatPage` 页面，应用程序可以采用组件导航（Navigation）跳转到 `ChatPage`，示例代码如下：

```typescript
// conversationId: 单聊会话为对端用户 ID，群聊会话为群组 ID。
// conversationType：单聊为 ConversationType.Chat，群聊为 ConversationType.GroupChat。
this.navPathStack?.pushPath({name: "ChatPage", param: {
        conversationId: this.conversationId,
        conversationType: this.conversationType
    } as ChatPageParams
});
```

- 使用 `ChatView`

开发者也可以使用单群聊 UIKit 提供的 `ChatView` 创建聊天页面，示例代码如下：

1. 编写包含 NavDestination 子组件的页面。
   
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
        conversationId: this.conversationId,
        chatType: this.chatType,
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

2. 将页面配置到系统配置文件 `route_map.json` 中（参考 [系统路由表](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation#%E7%B3%BB%E7%BB%9F%E8%B7%AF%E7%94%B1%E8%A1%A8)）。

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

3. 跳转到 MyChatPage 页面。
  
```typescript
this.navPathStack?.pushPath({name: "MyChatPage", param: {
        conversationId: this.conversationId,
        conversationType: this.conversationType
    } as ChatPageParams
});
```