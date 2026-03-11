# 通讯录

<Toc />

## 使用示例

- `ContactListPage`：`ChatUIKit` 提供的默认联系人列表页面。页面包含标题栏和联系人列表。应用程序可以采用组件导航（Navigation）跳转到 `ContactListPage`。
- `ContactListView`：组件包含联系人区域，开发者可以在应用页面中集成自定义的联系人页面。

### 使用 ContactListPage

使用鸿蒙提供的组件导航 [Navigation](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation) 跳转到会话列表页面 `ContactListPage`。

```typescript
this.pathStack.pushPath({ name: 'ContactListPage' });
```

### 使用 ContactListView

开发者可以通过添加联系人列表组件 `ContactListView` 将其嵌入到自己的页面中，以便进行更多的定制化开发。联系人列表组件不包含标题栏，需要开发者自己实现。

`ContactListView` 组件已经封装了联系人列表的主要逻辑，开发者需要实现列表项的点击事件以及点击搜索框的事件。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/harmonyos/contact_list_view.png" title="使用 ContactListView" />
</ImageGallery>

示例如下：

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

**步骤二**：将页面配置到系统配置文件 `route_map.json` 中（参见 [系统路由表](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation#%E7%B3%BB%E7%BB%9F%E8%B7%AF%E7%94%B1%E8%A1%A8)）。

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

## 使用 ContactListView 定制化

### 自定义列表项点击事件

开发者如果使用的是组件 `ContactListView`，需要实现列表项的点击事件。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/harmonyos/custom_contact_item_click.png" title="自定义列表项点击事件" />
</ImageGallery>

示例如下：

```typescript
@ComponentV2
export struct ContactsPage {
  navPathStack: NavPathStack = new NavPathStack();

  @Event onItemClick: KitCallback<ChatKitContact> = (item: ChatKitContact) => {
    this.navPathStack.pushPath({ name: "ChatPage", param: {
      conversationId: item.id,
      conversationType: ConversationType.Chat
    } as ChatPageParams });
  };

  build() {
    NavDestination() {
      Column() {
        ContactListView({
          onItemClick: this.onItemClick
        })
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

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/harmonyos/custom_contact_search_hide.png" title="隐藏搜索框" />
  <ImageItem src="/images/uikit/chatuikit/harmonyos/custom_contact_search_click.png" title="点击搜索框" />
  <ImageItem src="/images/uikit/chatuikit/harmonyos/custom_contact_search_layout.png" title="自定义搜索框布局" />
</ImageGallery>

示例如下：

```typescript
@ComponentV2
export struct ContactsPage {
  navPathStack: NavPathStack = new NavPathStack();

  @Event onSearchClick: KitCallback = () => {
    this.navPathStack.pushPath({ name: "SearchContactPage" });
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
        ContactListView({
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

### 自定义联系人列表更多功能项

开发者可以在联系人列表的头部增加自定义的功能布局，比如增加群组列表的入口，黑名单的入口等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/harmonyos/custom_contact_entry.png" title="自定义联系人列表更多功能项" />
</ImageGallery>

示例代码如下：

```typescript
@ComponentV2
export struct ContactsPage {
  navPathStack: NavPathStack = new NavPathStack();

  @Event onMoreActionClick: KitCallback<number> = (index) => {
    if (index === 0) {
      // 处理点击好友请求列表项的逻辑
    } else if (index === 1) {
      this.navPathStack?.pushPath({name: "GroupListPage"});
    }
  }

  @Builder
  moreActionBuilder(onClick: KitCallback<number>) {
    ListItem() {
      Column() {
        ComposeBadgeListItem({
          title: $r('app.string.new_request')
        })
          .onClick(() => {
            onClick(0);
          })
        ComposeBadgeListItem({
          title: $r('app.string.group_chat')
        })
          .onClick(() => {
            onClick(1);
          })
      }
    }
  }

  build() {
    NavDestination() {
      Column() {
        ContactListView({
          ......
          moreActionBuilder: this.moreActionBuilder,
          onMoreActionClick: this.onMoreActionClick
        });
      }
    }
    .onReady((context) => {
      this.navPathStack = context.pathStack;
    });
  }
}
```
