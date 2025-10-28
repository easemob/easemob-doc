# 通讯录页面

## 概述

环信单群聊 ChatUIKit 提供 `ContactListPage` 和 `ContactListView` 两种方式方便用户快速集成通讯录页面和自定义通讯录页面。

通讯录页面用于展示通讯录列表，包括联系人搜索，添加联系人，群组列表入口，联系人列表。

昵称在中文或者英文的情况下可以实现按首字母分类。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/page_contact_list.png" title="通讯录" />
</ImageGallery>

## 创建通讯录页面

### 使用 ContactListPage

单群聊 UIKit 提供 `ContactListPage`页面，应用程序可以采用组件导航（Navigation）跳转到 `ContactListPage`，示例代码如下：

示例如下：

```typescript
this.pathStack.pushPath({ name: 'ContactListPage' });
```

### 使用 ContactListView

开发者也可以使用单群聊 UIKit 提供的 `ContactListView` 创建联系人列表页面，示例代码如下：

**步骤一**：编写包含 NavDestination 子组件的页面。
   
```typescript
import {
  ChatKitContact,
  ChatPageParams,
  ComposeTitleBar,
  ContactListView,
  ConversationType,
  KitCallback
} from '@easemob/chatuikit';

@ComponentV2
export struct ContactsPage {
  navPathStack: NavPathStack = new NavPathStack();

  @Event onItemClick: KitCallback<ChatKitContact> = (item: ChatKitContact) => {
    this.navPathStack.pushPath({ name: "ChatPage", param: {
      conversationId: item.id,
      conversationType: ConversationType.Chat
    } as ChatPageParams });
  };

  @Event onSearchClick: KitCallback = () => {
    this.navPathStack.pushPath({ name: "SearchContactPage" });
  }

  build() {
    NavDestination() {
      Column() {
        ComposeTitleBar({
          titlePosition: HorizontalAlign.Center,
          primaryTitle: '联系人列表',
          onBackPress: () => {
            this.navPathStack.pop();
          }
        });
        ContactListView({
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
export function ContactsPageBuilder() {
  ContactsPage()
}
```

**步骤二**:将页面配置到系统配置文件 `route_map.json` 中（参考 [系统路由表](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation#%E7%B3%BB%E7%BB%9F%E8%B7%AF%E7%94%B1%E8%A1%A8)）。

```json
// 1. 工程配置文件 module.json5 中配置 {"routerMap": "$profile:route_map"}
// 2. 在 route_map.json 注册 ContactsPage 信息
{
  "routerMap": [
    {
      "name": "ContactsPage",
      "pageSourceFile": "src/main/ets/pages/ContactsPage.ets",
      "buildFunction": "ContactsPageBuilder",
      "data": {
        "description" : "Contact list page"
      }
    }
  ]
}
```

**步骤三**：跳转到 ContactsPage 页面。
   
```typescript
@Entry
@ComponentV2
struct Index {
  pathStack: NavPathStack = new NavPathStack();

  build() {
    Navigation(this.pathStack) {
      Column() {
        Button('Contact list page', { stateEffect: true, type: ButtonType.Capsule })
          .width('80%')
          .height(40)
          .margin(20)
          .onClick(() => {
            this.pathStack.pushPathByName('ContactsPage', null);
          });
      }.width('100%').height('100%');
    }
    .title("Navigation")
    .mode(NavigationMode.Stack);
  }
}
```

