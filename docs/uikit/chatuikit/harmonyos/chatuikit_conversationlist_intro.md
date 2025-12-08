# 会话列表页面

## 概述

环信单群聊 ChatUIKit 提供 `ConversationListPage` 和 `ConversationListView` 两种方式方便用户快速集成会话列表页面和自定义会话列表页面。

会话列表页面用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并提供会话搜索、删除、置顶和免打扰功能。

- 点击搜索按钮，跳转到搜索页面以搜索会话。
- 点击会话列表项，跳转到会话详情页面。
- 左滑会话列表项显示菜单，可进行删除会话、置顶会话、消息免打扰操作。

单条会话展示会话名称、最后一条消息、最后一条消息的时间以及置顶和禁言状态等。

- 对于单聊，会话展示的名称为对端用户的昵称；若对端用户未设置昵称，则展示对方的用户 ID。会话头像是对方的头像，如果没有设置，则使用默认头像。
- 对于群聊，会话名称为当前群组的名称，头像为默认头像。

会话列表相关功能，详见 [功能介绍文档](chatfeature_conversation.html)。
 
<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
</ImageGallery>


## 创建会话列表页面

### 使用 ConversationListPage

单群聊 UIKit 提供 `ConversationListPage` 页面，应用程序可以采用组件导航（Navigation）跳转到 `ConversationListPage`，示例代码如下：

示例如下：

```typescript
this.pathStack.pushPath({ name: 'ConversationListPage' });
```

### 使用 ConversationListView

开发者也可以使用单群聊 UIKit 提供的 `ConversationListView` 创建会话列表页面，示例代码如下：

**步骤一**：编写包含 NavDestination 子组件的页面。
   
```typescript
import {
  ChatKitConversation,
  ChatPageParams,
  ComposeTitleBar,
  ConversationListView,
  KitCallback
} from '@easemob/chatuikit';

@ComponentV2
export struct ConversationsPage {
  navPathStack: NavPathStack = new NavPathStack();
  
  @Event onItemClick: KitCallback<ChatKitConversation> = (item: ChatKitConversation) => {
    this.navPathStack.pushPath({ name: "ChatPage", param: {
      conversationId: item.conversationId,
      conversationType: item.type
    } as ChatPageParams });
  };

  @Event onSearchClick: KitCallback = () => {
    this.navPathStack.pushPath({ name: "SearchConversationPage" });
  }

  build() {
    NavDestination() {
      Column() {
        ComposeTitleBar({
          titlePosition: HorizontalAlign.Center,
          primaryTitle: '会话列表',
          onBackPress: () => {
            this.navPathStack.pop();
          }
        });
        ConversationListView({
          onItemClick: this.onItemClick,
          onSearchClick: this.onSearchClick
        })
          .layoutWeight(1);
      }
    }
    .hideTitleBar(true)
    .onReady((context) => {
      this.navPathStack = context.pathStack;
    });
  }
}

@Builder
export function ConversationsPageBuilder() {
  ConversationsPage();
}
```

**步骤二**：将页面配置到系统配置文件 `route_map.json` 中（参考 [系统路由表](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation#%E7%B3%BB%E7%BB%9F%E8%B7%AF%E7%94%B1%E8%A1%A8)）。

```json
// 1. 工程配置文件 module.json5 中配置 {"routerMap": "$profile:route_map"}
// 2. 在 route_map.json 注册 ConversationsPage 信息
{
  "routerMap": [
    {
      "name": "ConversationsPage",
      "pageSourceFile": "src/main/ets/pages/ConversationsPage.ets",
      "buildFunction": "ConversationsPageBuilder",
      "data": {
        "description": "Conversation list page"
      }
    }
  ]
}
```

**步骤三**：跳转到 ConversationsPage 页面。
  
```typescript
@Entry
@ComponentV2
struct Index {
  pathStack: NavPathStack = new NavPathStack();

  build() {
    Navigation(this.pathStack) {
      Column() {
        Button('Conversation list page', { stateEffect: true, type: ButtonType.Capsule })
          .width('80%')
          .height(40)
          .margin(20)
          .onClick(() => {
            this.pathStack.pushPathByName('ConversationsPage', null);
          });
      }.width('100%').height('100%');
    }
    .title("Navigation")
    .mode(NavigationMode.Stack);
  }
}
```