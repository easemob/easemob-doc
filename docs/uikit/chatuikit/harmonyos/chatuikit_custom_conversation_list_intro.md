# 会话列表介绍

环信单群聊 UIKit 提供 `ConversationListPage` 和 `ConversationListView` 两种方式，满足从快速集成到深度自定义的会话列表场景。该页面提供如下功能：

- **会话展示**：展示所有单聊和群聊会话，按最新消息时间倒序排列
- **会话管理**：支持会话置顶、删除、免打扰等操作。
- **会话状态展示**：显示会话的未读消息数和免打扰状态。

## 页面组件

会话列表页面通过 `ConversationListPage` 或 `ConversationListView` 实现，由标题栏、搜索栏和会话列表组成。

### 标题栏

`ConversationListPage` 中的标题栏使用 `ComposeTitleBar` 组件，展示当前用户头像、标题和操作菜单。详见 [设置标题栏](chatuikit_custom_titlebar.html)。

可通过 `hideTitleBar` 参数隐藏标题栏，或者使用 `ConversationListView` 组件自定义页面布局。

### 会话搜索栏

会话搜索栏实现会话搜索功能。默认情况下，`ConversationListView` 显示搜索栏。关于自定义，详见 [设置会话搜索栏](chatuikit_custom_conversation_list_searchbar.html)。

### 会话列表

会话列表组件 `ConversationListView` 实现按会话中最新一条消息的时间倒序显示所有会话，包括：
- 通过标题栏右侧的加号创建的本地会话。
- 两个用户之间发送消息后创建的单聊会话。
- 群组中发送消息后创建的群组会话。

在会话列表中，置顶的会话排在列表最上方。

**会话条目** 包括会话名称、头像、最新一条消息、最新一条消息的时间以及置顶和免打扰状态等。

- **会话名称和头像**：
  - 单聊：会话名称为对端用户的昵称，若对端用户未设置昵称则展示对方用户 ID；会话头像是对方头像，若未设置则使用默认头像。
  - 群聊:会话名称为当前群组的名称或群组 ID，头像为默认头像。
- **点击会话**：点击单个会话条目，跳转到聊天页面。
- **左滑会话**：左滑单个会话条目显示会话操作菜单，默认实现会话免打扰、会置顶和删除操作。

## 创建会话列表页面

你可以根据使用场景选择方案：

| 场景                 | 推荐方案                                | 说明               |
| :------------------- | :-------------------------------------- | :----------------- |
| 快速集成标准会话列表 | `ConversationListPage`                  | 完整页面，开箱即用。 |
| 需要自定义标题栏     | `ConversationListView` + 自定义标题栏   | 灵活控制顶部区域。  |
| 深度自定义页面布局     | `ConversationListView` + 完全自定义布局 | 完全自定义页面。         |

### 使用 ConversationListPage

单群聊 UIKit 提供 `ConversationListPage` 页面组件，通过 `Navigation` 路由跳转即可使用，示例代码如下：

**方式一：作为独立页面**

```typescript
import { ConversationListPage } from '@easemob/chatuikit';

// 在 NavPathStack 中跳转到 ConversationListPage
pathStack.pushPath({ name: "ConversationListPage" })
```

`ConversationListPage` 包含完整的会话列表界面，包括标题栏、搜索栏和会话列表。

**方式二：作为组件嵌入**

在以下示例中，通过设置 `hideTitleBar: true` 隐藏 `ConversationListPage` 的默认标题栏，使用 `Navigation` 的 `title` 作为页面标题，从而将会话列表作为组件嵌入到页面中。

```typescript
import { ConversationListPage } from '@easemob/chatuikit';

@Entry
@ComponentV2
struct Index {
  pathStack: NavPathStack = new NavPathStack();

  build() {
    Navigation(this.pathStack) {
      Column() {
        // 在页面中嵌入会话列表组件
        ConversationListPage({ 
          pathStack: this.pathStack,
          hideTitleBar: true  // 隐藏标题栏，使用页面自己的标题
        })
      }
      .width('100%')
      .height('100%')
    }
    .title('消息')
    .mode(NavigationMode.Stack)
  }
}
```

### 使用 ConversationListView

`ConversationListView` 仅包含会话列表（包含搜索栏），不包含顶部标题栏，适用于需要自定义标题栏或页面布局的场景。

1. 创建包含 `NavDestination` 子组件的页面。

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

2. 注册路由。
   
将页面配置到系统配置文件 `route_map.json` 中。详见 [系统路由表](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation#系统路由表)。

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

3. 跳转到 `ConversationsPage` 页面。

`ConversationListPage` 内置了点击跳转逻辑，而 `ConversationListView` 需要自行实现 `onItemClick` 和 `onSearchClick` 事件处理。

```typescript
@Entry
@ComponentV2
struct Index {
  pathStack: NavPathStack = new NavPathStack();

  build() {
    Navigation(this.pathStack) {
      Column() {
        Button('会话列表', { stateEffect: true, type: ButtonType.Capsule })
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
