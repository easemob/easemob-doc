# 会话列表

<Toc />

环信单群聊 ChatUIKit 提供 `ConversationListPage` 和 `ConversationListView` 两种方式方便用户快速集成会话列表页面和自定义会话列表页面。

会话列表页面用于展示当前用户的所有会话，包含单聊和群组聊天（不包括聊天室），并提供会话搜索、删除、置顶和免打扰功能。

- 点击搜索按钮，跳转到搜索页面以搜索会话。
- 点击会话列表项，跳转到会话详情页面。
- 左滑会话列表项显示菜单，可进行删除会话、置顶会话、消息免打扰操作。

单条会话展示会话名称、最后一条消息、最后一条消息的时间以及置顶和禁言状态等。

- 对于单聊，会话展示的名称为对端用户的昵称；若对端用户未设置昵称，则展示对方的用户 ID。会话头像是对方的头像，如果没有设置，则使用默认头像。
- 对于群聊，会话名称为当前群组的名称，头像为默认头像。

会话列表相关功能，详见[功能介绍文档](chatfeature_conversation.html)。
 
<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
</ImageGallery>

## 使用示例

- `ConversationListPage`：`ChatUIKit` 提供的默认会话列表页面。页面包含标题栏和会话列表。应用程序可以采用组件导航（Navigation）跳转到 `ConversationListPage`。
- `ConversationListView`：组件包含会话列表区域，开发者可以在应用页面中集成自定义的会话列表页面。

### 使用 ConversationListPage

使用鸿蒙提供的组件导航 [Navigation](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation) 跳转到会话列表页面 `ConversationListPage`。

```typescript
this.pathStack.pushPath({ name: 'ConversationListPage' });
```

### 使用 ConversationListView

开发者可以通过添加会话列表组件 `ConversationListView` 将其嵌入到自己的页面中，以便进行更多的定制化开发。会话列表组件不包含标题栏，需要开发者自己实现。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_conversation_list.png" title="会话列表" />
</ImageGallery>

`ConversationListView` 组件已经封装了会话列表的主要逻辑，开发者需要实现条目的点击事件以及点击搜索框的事件。示例如下：

1. 编写包含 NavDestination 子组件的页面。
   
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

2. 将页面配置到系统配置文件 `route_map.json` 中（参考 [系统路由表](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation#%E7%B3%BB%E7%BB%9F%E8%B7%AF%E7%94%B1%E8%A1%A8)）。

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

## 使用 ConversationListView 定制化

### 自定义空数据布局

`ChatUIKit` 提供了默认的空数据布局，开发者可以根据自己的需要自定义符合自己 App 样式的空数据布局。示例代码如下：

```typescript
@ComponentV2
export struct ConversationsPage {

  @Builder
  myEmptyDataBuilder() {
    Column() {
      Text('没有数据');
    }
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .width('100%')
    .height('100%');
  }

  build() {
    NavDestination() {
      Column() {
        ConversationListView({
          emptyDataBuilder: this.myEmptyDataBuilder
        });
      }
    }
  }
}
```

### 自定义会话条目点击事件

开发者如果使用的是组件 `ConversationListView`，需要实现会话条目的点击事件，示例如下：

```typescript
@ComponentV2
export struct ConversationsPage {
  navPathStack: NavPathStack = new NavPathStack();

  @Event onItemClick: KitCallback<ChatKitConversation> = (item: ChatKitConversation) => {
    this.navPathStack.pushPath({ name: "ChatPage", param: {
      conversationId: item.conversationId,
      conversationType: item.type
    } as ChatPageParams });
  };

  build() {
    NavDestination() {
      Column() {
        ConversationListView({
          onItemClick: this.onItemClick
        });
      }
    }
    .onReady((context) => {
      this.navPathStack = context.pathStack;
    });
  }
}
```

### 自定义搜索框事件

搜索框部分，开发者可以做到以下定制化：
 - 是否显示搜索框；
 - 自定义搜索框点击事件；
 - 自定义搜索框布局。

示例如下：

```typescript
@ComponentV2
export struct ConversationsPage {
  navPathStack: NavPathStack = new NavPathStack();
  
  // 自定义搜索框点击事件
  @Event onSearchClick: KitCallback = () => {
    this.navPathStack.pushPath({ name: "SearchConversationPage" });
  }

  // 搜索框自定义构件函数
  @Builder
  customSearchBuilder(onClick: KitCallback) {
    Row() {
      Text('搜索')
        .width('80%')
        .height('80%')
        .backgroundColor(Color.Gray)
        .textAlign(TextAlign.Center)
        .borderRadius(5)
        .onClick(() => {
          onClick();
        });
    }
    .justifyContent(FlexAlign.Center)
    .width('100%')
    .height(50);
  }

  build() {
    NavDestination() {
      Column() {
        ConversationListView({
          showSearchView: true, // 决定是否展示搜索框
          onSearchClick: this.onSearchClick, // 处理点击搜索框的事件
          searchBuilder: this.customSearchBuilder // 自定义搜索框布局
        });
      }
    }
    .onReady((context) => {
      this.navPathStack = context.pathStack;
    });
  }
}
```

### 自定义会话列表逻辑

开发者如果有自己的逻辑需要，可以通过继承 `BaseConvListViewModel` 或者 `ConvListViewModel`（ChatUIKit 内部 `BaseConvListViewModel` 的实现类）来增加自己的逻辑。

示例如下：

```typescript
export class MyConversationListViewModel extends ConvListViewModel {

  aboutToAppear(): void {
    super.aboutToAppear();
    // 增加其他需要在页面可见时需要添加的逻辑
  }

  aboutToDisAppear(): void {
    super.aboutToDisAppear();
    // 增加其他需要在页面销毁时需要释放的逻辑
  }

  async getConversations(pageSize?: number, cursor?: string): Promise<void> {
    await super.getConversations(pageSize, cursor);
    // 添加其他逻辑
  }
}

@ComponentV2
export struct ConversationsPage {
  @Local viewModel: MyConversationListViewModel = new MyConversationListViewModel();
  
  build() {
    NavDestination() {
      Column() {
        ConversationListView({
          viewModel: this.viewModel,
          onItemClick: this.onItemClick,
          onSearchClick: this.onSearchClick
        });
      }
    }
  }
}
```

### 自定义会话条目左滑菜单

开发者可以增加或者修改会话条目左滑菜单项。示例如下：

```typescript
import { ChatKitConversation, ConversationListView, ConvMenuItem, KitConstants } from '@easemob/chatuikit';
import { MyConversationListViewModel } from '../viewmodel/MyConversationListViewModel';

@ComponentV2
export struct ConversationsPage {
  @Local viewModel: MyConversationListViewModel = new MyConversationListViewModel();

  private myItemMenus: ConvMenuItem[] = [
    {
      id: KitConstants.CONV_MENU_ACTION_MUTE,
      value: $r('app.string.conv_item_action_mute'),
      icon: $r('app.media.chat_icon_conv_menu_mute'),
      backgroundColor: $r('app.color.chat_color_conv_item_menu_bg_mute'),
      onMenuClick: (id: string | number, conv: ChatKitConversation) => {
        this.viewModel.muteConversation(conv, true);
      }
    }
  ];

  build() {
    NavDestination() {
      Column() {
        ConversationListView({
          viewModel: this.viewModel,
          itemMenus: this.myItemMenus
        });
      }
    }
  }
}

// 在自定义 viewModel 中复写 getTargetMenus 方法，添加自定义过滤条件
export class MyConversationListViewModel extends ConvListViewModel {

  getTargetMenus(menus: ConvMenuItem[], conv: ChatKitConversation): ConvMenuItem[] {
    let targetMenus = menus;
    // 增加筛选和过滤逻辑
    return targetMenus;
  }
}
```

### 增加自定义会话条目组件

开发者可以根据自己的业务需要通过 `ConversationItemProvider` 提供自己的会话条目样式。示例代码如下：

1. 定义自定义构件函数
   
```typescript
@Builder
export function ConversationItemBuilder(item: ChatKitConversation) {
  Text(item.conversationId)
    .width('100%')
    .height(60)
    .padding({
      left: 20, right: 20
    })
    .textAlign(TextAlign.Start)
    .onClick(() => {
      console.log('点击了自定义条目布局');
    });
}
```

2. 通过 `ConversationItemProvider` 将自定义构件函数注册给 `ChatUIKit`。

```typescript
ChatUIKitClient.setConversationItemProvider({
    itemWrapBuilder: (item: ChatKitConversation): WrappedBuilder<[ChatKitConversation]> | undefined => {
        if (item.conversationId == this.targetConvId) {
            return wrapBuilder(ConversationItemBuilder);
        }
        return undefined;
    }
});
```

### 设置头像和昵称

关于设置头像和昵称，详见[用户自定义信息文档中的介绍](chatuikit_userinfo.html#设置会话头像和昵称)。

## ConversationListView 中默认实现的功能

`ConversationListView` 中默认实现会话免打扰、会话置顶和会话删除功能。

### 免打扰

使用 `ConvListViewModel` 提供的方法设置免打扰，例如：

- `muteConversation`：设置会话免打扰/取消免打扰。

### 会话置顶

使用 `ConvListViewModel` 提供的方法设置会话置顶，例如：

- `pinConversation`：设置会话置顶/取消置顶。

### 会话删除

使用 `ConvListViewModel` 提供的方法 `deleteConversation` 方法删除会话。

