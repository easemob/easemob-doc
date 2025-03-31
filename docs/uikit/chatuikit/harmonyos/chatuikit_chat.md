# 聊天消息

<Toc />

环信单群聊 ChatUIKit 提供 `ChatPage` 和 `ChatView` 两种方式方便用户快速集成聊天页面和自定义聊天页面。该页面提供如下功能：

- 发送和接收消息, 包括文本、表情、图片、语音、视频、文件和名片消息。
- 对消息进行复制、引用、撤回、删除、编辑和重新发送。
- 从服务器拉取漫游消息。
- 清除本地消息。

消息相关功能，详见 [功能介绍文档](chatfeature_message.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/custom_chat_detail.png" title="聊天页面" />
</ImageGallery>

## 使用示例

- `ChatPage`：`ChatUIKit` 提供的默认聊天页面。页面包含标题栏、消息列表和输入区域。应用程序可以采用组件导航（Navigation）跳转到 `ChatPage`。
- `ChatView`：组件包含消息列表和输入区域，开发者可以在应用页面中集成自定义的聊天页面。

### 使用 ChatPage

`ChatUIKit` 采用组件导航（Navigation）进行页面间以及组件内部的页面跳转，通过 [系统路由表](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-navigation-navigation#系统路由表) 的方式进行动态路由，已经在内部独立配置 `route_map.json` 文件，开发者只需通过 NavPathStack 提供的路由方法，传入需要路由的页面配置名称，即可完成路由跳转。

以下示例为通过 NavPathStack 跳转到 `ChatPage` 页面：

```typescript
this.navPathStack?.pushPath({name: "ChatPage", param: {
        conversationId: this.conversationId,
        conversationType: this.conversationType
    } as ChatPageParams
});
```

### 使用 ChatView

开发者可以通过添加 聊天组件 `ChatView` 将其嵌入到自己的页面中，以便进行更多的定制化开发。聊天组件不包含标题栏，需要开发者自己实现。

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

## 使用 ChatView 定制化

开发者可以通过组件 `ChatView` 实现更多的定制化开发。

### 自定义输入菜单

开发者可以通过 `ChatPrimaryMenuModel` 控制输入菜单显示哪些菜单。示例如下：

```typescript
@ComponentV2
export struct MyChatPage {
  @Local primaryMenuModel: ChatPrimaryMenuModel = new ChatPrimaryMenuModel();

  aboutToAppear(): void {
    // 控制输入菜单上的录音按钮是否可用
    this.primaryMenuModel.isRecorderEnable = false;
    // 控制输入菜单上的表情按钮是否可用
    this.primaryMenuModel.isEmojiEnable = true;
    // 控制输入菜单上的扩展功能按钮是否可用
    this.primaryMenuModel.isExtendEnable = false;
  }

  build() {
    NavDestination() {
      Column() {
        ChatView({
          ......
          privateMenuModel: this.primaryMenuModel
        })
      }
    }
  }
}
```

### 自定义处理麦克风权限逻辑

开发者可以通过监听 `onRecordClick` 处理麦克风权限逻辑。示例代码如下：

```typescript
@ComponentV2
export struct MyChatPage {
  
  build() {
    NavDestination() {
      Column() {
        ChatView({
          ......
          onRecordClick: (callback) => {
            PermissionManager.requestPermissions(getContext(), ['ohos.permission.MICROPHONE']).then((result) => {
              callback(result.authResults[0] === 0);
            });
          }
        })
      }
    }
  }
}
```

### 自定义聊天扩展功能 

1. 自定义扩展功能点击事件。

开发者可以通过监听 `ChatView` 的 `onExtendMenuClick` 来处理扩展功能点击事件。示例代码如下：

```typescript
@ComponentV2
export struct MyChatPage {
  onExtendMenuClick: (id: number | string) => void = (id) => {
    if (id === KitConstants.EXTEND_ACTION_CAMERA) {
      // 处理点击相机的逻辑
    } else if (id === KitConstants.EXTEND_ACTION_IMAGE) {
      // 处理点击相册的逻辑
    } else if (id === KitConstants.EXTEND_ACTION_FILE) {
      // 处理点击文件的逻辑
    } else if (id === KitConstants.EXTEND_ACTION_USER) {
      // 处理点击名片的逻辑
    }
  }

  build() {
    NavDestination() {
      Column() {
        ChatView({
          ......
          onExtendMenuClick: this.onExtendMenuClick
        })
      }
    }
  }
}
```

2. 增加自定义扩展功能。

开发者也可以增加自定义的扩展功能。示例代码如下：

```typescript
@ComponentV2
export struct MyChatPage {
  extendMenus: MenuItem[] = [
    {
      id: KitConstants.EXTEND_ACTION_CAMERA,
      value: $r('app.string.chat_extend_more_camera'),
      icon: $r('app.media.chat_icon_extend_more_camera'),
      order: 2,
      action: (id: string | number) => {
        // 处理点击相机的逻辑
      }
    },
    {
      id: KitConstants.EXTEND_ACTION_IMAGE,
      value: $r('app.string.chat_extend_more_image'),
      icon: $r('app.media.chat_icon_extend_more_image'),
      order: 1,
      action: (id: string | number) => {
        // 处理点击相册的逻辑
      }
    }
  ];

  build() {
    NavDestination() {
      Column() {
        ChatView({
          ......
          extendMenus: this.extendMenus,
        })
      }
    }
  }
}
```

### 自定义消息长按菜单

开发者可以根据需要对长按消息的菜单进行调整。示例代码如下：

```typescript
@ComponentV2
export struct MyChatPage {
  messageItemMenuProvider: (message: ChatKitMessage) => MessageMenuItem[] = (message) => {
    return [
      {
        id: KitConstants.MESSAGE_MENU_ACTION_COPY,
        value: $r('app.string.chat_message_menu_copy'),
        icon: $r('app.media.chat_icon_message_menu_copy'),
        messageEnable: {
          messageTypes: [ContentType.TXT]
        },
        onMenuClick: (id: string | number, message : ChatKitMessage) => {
          // 处理复制逻辑
        }
      },
      {
        id: KitConstants.MESSAGE_MENU_ACTION_EDIT,
        value: $r('app.string.chat_message_menu_edit'),
        icon: $r('app.media.chat_icon_message_menu_edit'),
        messageEnable: {
          isSender: true,
          messageStatus: [MessageStatus.SUCCESS],
          messageTypes: [ContentType.TXT],
          other: isMessageCanEdit(message.origin)
        },
        onMenuClick: (id: string | number, message : ChatKitMessage) => {
          // 处理修改消息的逻辑
        }
      },
    ]
  };

  build() {
    NavDestination() {
      Column() {
        ChatView({
          ......
          messageItemMenusProvider: this.messageItemMenuProvider
        })
      }
    }
  }
}
```

### 自定义消息发送失败事件 

开发者可以通过监听 `ChatView` 提供的回调 `onErrorIconClick` 处理点击发送失败按钮的事件。示例代码如下：

```typescript
@ComponentV2
export struct MyChatPage {
  build() {
    NavDestination() {
      Column() {
        ChatView({
          ......
          onErrorIconClick: (message) => {
            // 处理点击发送失败按钮的逻辑
          }
        })
      }
    }
  }
}
```

### 自定义点击消息事件

开发者可以通过监听 `ChatView` 提供的回调 `onItemClick` 处理点击消息的事件。示例代码如下：

```typescript
@ComponentV2
export struct MyChatPage {
  build() {
    NavDestination() {
      Column() {
        ChatView({
          ......
          onItemClick: (message) => {
            if (isImageMessage(message.origin)) {
              promptAction.showToast({message: "点击了图片"})
              return true; // 要拦截处理，返回 true。
            }
            return false; // 不拦截，采用默认逻辑，返回false。
          }
        })
      }
    }
  }
}
```

### 添加自定义消息布局类型

开发者可以通过 `ChatUIKit` 提供的接口 `ChatUIKitClient#setMessageItemProvider` 添加自定义的消息布局以满足开发需求。

`ChatUIKit` 提供了两种方式供开发者添加自定义布局：
 - 添加自定义气泡布局：`ChatMessageBubbleProvider`
 - 添加自定义消息布局：`ChatMessageItemProvider`

`ChatMessageBubbleProvider` 提供了更多的默认实现，`ChatMessageItemProvider` 则提供了更强的定制化。

两种方式的能力对比如下：

| 能力                   | ChatMessageBubbleProvider          | ChatMessageItemProvider          |
| --------------------- | ---------------------------------- | --------------------------------- |
| 头像                   | 默认实现                            | 需要自定义                          |
| 昵称                   | 默认实现                            | 需要自定义                          |
| 消息事件                | 默认实现                            | 需要自定义                          |
| 消息长按                | 默认实现                            | 需要自定义                          |
| 消息点击                | 需要自定义                          | 需要自定义                          |

`ChatMessageBubbleProvider` 和 `ChatMessageItemProvider` 可以同时使用，且添加步骤类似。

1. 定义自定义消息布局的自定义构件函数。

```typescript
@Builder
export function TextBuilder(message: ChatKitMessage) {
  MessageTextBubbleView({
    message: message
  })
}

@Builder
export function UnsentBuilder(message: ChatKitMessage) {
  MessageUnsentView({
    message: message
  })
}
```

2. 调用 `ChatUIKitClient#setMessageItemProvider` 设置自定义消息布局的自定义构件函数。

```typescript
// 通过 ChatMessageBubbleProvider 提供自定义消息布局的自定义构件函数
ChatUIKitClient.setMessageItemProvider({
    messageBubbleWrapBuilder: (message: ChatKitMessage): WrappedBuilder<[ChatKitMessage]> | undefined => {
    if (message.origin.getType() === ContentType.TXT) {
        return wrapBuilder(TextBuilder);
    } else if (message.origin.getType() === ContentType.IMAGE) {
        return wrapBuilder(ImageBuilder)
    }
    return undefined; // 使用默认布局，需要返回 undefined.
    }
} as ChatMessageBubbleProvider)

// 通过 ChatMessageItemProvider 提供自定义消息布局的自定义构件函数
ChatUIKitClient.setMessageItemProvider({
    messageItemWrapBuilder: (message: ChatKitMessage): WrappedBuilder<[ChatKitMessage]> | undefined => {
    if (isRecalledMessage(message.origin)) {
        return wrapBuilder(UnsentBuilder);
    }
    return undefined; // 使用默认布局，需要返回 undefined.
    }
} as ChatMessageItemProvider)

```

3. 通过 `ConversationLatestMessageContentProvider` 接口定义会话最后一条消息的展示内容。

如果是自定义消息，开发者除了需要添加自定义消息布局外，还需要对会话列表的最后一条消息展示内容进行自定义，开发者可以通过 `ChatUIKit` 提供的接口 `ConversationLatestMessageContentProvider` 接口定义会话最后一条消息的展示内容。

示例代码如下：

```typescript
ChatUIKitClient.setConversationLatestMessageContentProvider({
    latestMessageContent: (message: ChatMessage): string | undefined => {
        // 如果要对返回的文本消息添加特定的前缀
        if (message.getType() === ContentType.TXT) {
            let content = (message.getBody() as TextMessageBody).getContent();
            content = "From provider: "+content;
            return content;
        }
        return undefined; // 使用默认逻辑，要返回 undefined.
    }
})
```

## 设置头像和昵称

关于设置头像和昵称，详见 [用户自定义信息文档](chatuikit_userinfo.html)。