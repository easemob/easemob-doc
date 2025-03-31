# 集成单群聊 UIKit

<Toc />

使用单群聊 UIKit 之前，你需要将其集成到你的应用中。

## 前提条件

- DevEco Studio NEXT Release（5.0.3.900）及以上；
- HarmonyOS SDK API 12 及以上；
- HarmonyOS NEXT.0.0.71 或以上版本的模拟器或者真机；
- 有效的环信即时通讯 IM 开发者账号和 App Key，请参见 [环信控制台文档](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。

## 集成单群聊 UIKit

### 远程依赖

在项目根目录下执行如下命令：

```shell
ohpm install @easemob/chatuikit
```

:::tip
上面的命令在根目录执行，会将 SDK 依赖添加到项目级别；如果要将 SDK 依赖到 Module 级别，需要在对应的 Module 目录下执行上面的命令。
:::

### 本地依赖

从 GitHub 获取 [单群聊 UIKit 源码](https://github.com/easemob/easemob-uikit-harmonyos)，按照下面的方式集成：

- 点击 **Import**，选择 **Import Module**，导入 `chatuikit` 模块。
- 在项目 Module 中引入 `chatuikit` 模块。

修改模块目录的 **oh-package.json5** 文件，在 **dependencies** 节点增加依赖声明。

```json
"dependencies": {
    "@easemob/chatuikit": "file:./../chatuikit"
}
```

然后点击同步按钮，同步完成后，就可以在模块中使用 `chatuikit`。

### 添加项目权限

在模块的 `module.json5` ，例如：`HelloWorld` 中 `entry` 模块的 `module.json5` 中，配置示例如下：

```
{
  module: {
    requestPermissions: [
      {
        name: "ohos.permission.GET_NETWORK_INFO",
      },
      {
        name: "ohos.permission.INTERNET",
      },
      {
        "name": "ohos.permission.MICROPHONE",
        "reason": "$string:record_permission_reason",
        "usedScene": {
          "abilities": [
            "EntryAbility"
          ],
          "when": "always"
        }
      }
    ],
  },
}
```

需要在对应模块的 `string.json` 文件中增加如下：

```json
{
    "name": "record_permission_reason",
    "value": "录制语音需要"
}
```

## 初始化

在使用 UIKit 的控件前，必须要先初始化。例如在 `EntryAbility` 中：

```typescript
export default class EntryAbility extends UIAbility {
  private appKey: string = [项目的AppKey]; // 将[项目的AppKey]替换为项目的AppKey字符串

  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    let options = new ChatOptions({
      appKey: this.appKey
    });
    options.setAutoLogin(false);
    let client = ChatClient.getInstance();
    client.init(getContext(), options);
    ChatUIKitClient.init(client);
  }

}
```

## 快速搭建页面

### 创建聊天页面

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

### 创建会话列表页面

- 使用 `ConversationListPage`

单群聊 UIKit 提供 `ConversationListPage` 页面，应用程序可以采用组件导航（Navigation）跳转到 `ConversationListPage`，示例代码如下：

示例如下：

```typescript
this.pathStack.pushPath({ name: 'ConversationListPage' });
```

- 使用 `ConversationListView`

开发者也可以使用单群聊 UIKit 提供的 `ConversationListView` 创建会话列表页面，示例代码如下：

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

3. 跳转到 ConversationsPage 页面。
  
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

### 创建联系人列表页面

- 使用 `ContactListPage`

单群聊 UIKit 提供 `ContactListPage`页面，应用程序可以采用组件导航（Navigation）跳转到 `ContactListPage`，示例代码如下：

示例如下：

```typescript
this.pathStack.pushPath({ name: 'ContactListPage' });
```

- 使用 `ContactListView`

开发者也可以使用单群聊 UIKit 提供的 `ContactListView` 创建联系人列表页面，示例代码如下：

1. 编写包含 NavDestination 子组件的页面。
   
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

2. 将页面配置到系统配置文件 `route_map.json` 中（参考 [系统路由表](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation#%E7%B3%BB%E7%BB%9F%E8%B7%AF%E7%94%B1%E8%A1%A8)）。

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

3. 跳转到 ContactsPage 页面。
   
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

