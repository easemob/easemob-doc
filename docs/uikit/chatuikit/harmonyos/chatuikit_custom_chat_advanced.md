# 消息列表的高级设置

<Toc />

本文介绍聊天页面的高级自定义功能，包括自定义消息布局、ViewModel 扩展、会话最后一条消息展示等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/message_list.png" title="消息列表组件 MessageListView" />
</ImageGallery>

## 自定义消息布局

单群聊 UIKit 提供两种方式自定义消息布局：

- **ChatMessageBubbleProvider**：（推荐）仅自定义消息气泡。
- **ChatMessageItemProvider**：自定义整个消息条目，包括头像、昵称、时间戳等。

### 自定义消息气泡

`ChatMessageBubbleProvider` 用于自定义消息气泡的展示，保留默认的头像、昵称、时间戳等布局，适用于大部分自定义场景。

<div style="text-align: center">
  <img src=/images/uikit/chatuikit/android/message_bubble.png width="600" />
</div>

#### 实现自定义气泡

**步骤 1 创建自定义气泡组件**

使用 `@Builder` 定义消息气泡的 UI 布局。根据消息类型（文本、图片等）分别实现对应的气泡组件，通过 `message.origin.getBody()` 获取消息体数据并渲染。

```typescript
import { 
  ChatKitMessage,
  TextMessageBody,
  ImageMessageBody
} from '@easemob/chatuikit';

@Builder
function CustomTextBubble(message: ChatKitMessage) {
  Text((message.origin.getBody() as TextMessageBody)?.getContent() ?? '')
    .fontSize(16)
    .fontColor(Color.White)
    .padding(12)
    .backgroundColor('#007AFF')
    .borderRadius(8)
    .maxLines(10)
}

@Builder
function CustomImageBubble(message: ChatKitMessage) {
  Image((message.origin.getBody() as ImageMessageBody)?.getLocalPath() ?? '')
    .width(200)
    .height(200)
    .borderRadius(8)
    .objectFit(ImageFit.Cover)
}
```

**步骤 2 实现 `ChatMessageBubbleProvider` 接口**

实现 `ChatMessageBubbleProvider` 接口，在 `messageBubbleWrapBuilder` 中根据消息类型返回对应的气泡 Builder。返回 `undefined` 时使用默认气泡。

```typescript
import { 
  ChatMessageBubbleProvider, 
  ChatKitMessage,
  ContentType
} from '@easemob/chatuikit';

class MyMessageBubbleProvider implements ChatMessageBubbleProvider {
  messageBubbleWrapBuilder(message: ChatKitMessage): WrappedBuilder<[ChatKitMessage]> | undefined {
    if (message.origin.getType() === ContentType.TXT) {
      return wrapBuilder<[ChatKitMessage]>(CustomTextBubble);
    } else if (message.origin.getType() === ContentType.IMAGE) {
      return wrapBuilder<[ChatKitMessage]>(CustomImageBubble);
    }
    return undefined;
  }
}
```

**步骤 3 注册 Provider**

在聊天页面的 `aboutToAppear` 生命周期中，通过 `ChatUIKitClient.setMessageItemProvider()` 注册自定义气泡提供者，使 ChatView 利用你的自定义气泡渲染消息。

```typescript
import { 
  ChatUIKitClient,
  ChatView,
  ChatType
} from '@easemob/chatuikit';

@Entry
@ComponentV2
struct ChatPageDemo {
  aboutToAppear() {
    ChatUIKitClient.setMessageItemProvider(new MyMessageBubbleProvider());
  }

  build() {
    Column() {
      ChatView({
        conversationId: 'user123',
        chatType: ChatType.Chat
      })
    }
  }
}
```

#### ChatMessageBubbleProvider 接口

`ChatMessageBubbleProvider` 接口为消息气泡的 Builder 提供者，返回 `WrappedBuilder` 或 `undefined`（使用默认气泡）。

```typescript
interface ChatMessageBubbleProvider {
  // message 消息对象
  messageBubbleWrapBuilder: (message: ChatKitMessage) => WrappedBuilder<[ChatKitMessage]> | undefined;
}
```

## 设置消息状态图标

### 自定义图标资源

如需自定义消息状态图标，你可在应用工程的 `resources/base/media/` 目录下放置与下表同名的资源文件（支持 .svg 或 .png 格式）。系统将自动使用你提供的资源覆盖默认图标。

| 状态     | 资源名称             |
| :------- | :-------------------------- |
| 已发送 | `message_sent`     |
| 已送达 | `message_delivered` |
| 已读   | `message_read`     |
| 发送失败 | `message_fail`   |

### 图标显示规则

消息已送达和已读图标的显示行为与 SDK 初始化的 `ChatOptions` 配置有关：

- **已送达图标**：当 `requireDeliveryAck = true` 且消息收到送达回执时显示。
- **已读图标**：当 `requireReadAck = true` 且消息收到已读回执时显示。

```typescript
import { ChatClient, ChatOptions, ChatUIKitClient } from '@easemob/chatuikit';

// SDK 初始化时设置
let options = new ChatOptions({
  appKey: 'your_app_key',
  isRequireReadAck: true,         // 是否需要已读回执
  isRequireDeliveryAck: true      // 是否需要送达回执
});

let client = ChatClient.getInstance();
client.init(context, options);
ChatUIKitClient.init(client);
```

### 隐藏状态图标

- **仅隐藏已读/已送达图标**：将 `setRequireReadAck(false)` 或 `setRequireDeliveryAck(false)`，则对应状态图标不会显示，但发送成功后仍显示已发送图标。
- **完全隐藏所有发送状态图标（含已发送）**：需通过 `ChatMessageItemProvider` 自定义整个消息条目布局，在自定义布局中不渲染状态图标组件。

## 设置消息长按菜单

消息列表中长按消息可弹出操作菜单。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/harmonyos/custom_chat_long_press.png" title="自定义消息长按菜单" />
</ImageGallery>

### 管理菜单项

你可以添加、移除菜单项以及控制菜单项在的显示与隐藏：

```typescript
import { MessageMenuItem, ChatKitMessage, KitConstants, ContentType, isSender } from '@easemob/chatuikit';

ChatView({
  conversationId: 'user123',
  chatType: ChatType.Chat,
  messageItemMenusProvider: (message: ChatKitMessage) => {
    // 基础菜单
    let menus: MessageMenuItem[] = [];
  
    // 复制（仅文本消息）
    if (message.origin.getType() === ContentType.TXT) {
      menus.push({
        id: KitConstants.MESSAGE_MENU_ACTION_COPY,
        value: '复制'
      });
    }
  
    // 回复
    menus.push({
      id: KitConstants.MESSAGE_MENU_ACTION_REPLY,
      value: '回复'
    });
  
    // 删除
    menus.push({
      id: KitConstants.MESSAGE_MENU_ACTION_DELETE,
      value: '删除'
    });
  
    // 撤回（仅发送方，且在时间限制内）
    if (isSender(message.origin)) {
      menus.push({
        id: KitConstants.MESSAGE_MENU_ACTION_RECALL,
        value: '撤回'
      });
    }
  
    // 编辑（仅文本消息，且为发送方）
    if (message.origin.getType() === ContentType.TXT && isSender(message.origin)) {
      menus.push({
        id: KitConstants.MESSAGE_MENU_ACTION_EDIT,
        value: '编辑'
      });
    }
  
    // 自定义菜单项
    menus.push({
      id: 'translate',
      value: '翻译',
      onMenuClick: (id, msg) => {
        console.log('翻译消息:', msg.messageId);
      }
    });
  
    return menus;
  }
})
```

**消息长按菜单项默认 ID**

| ID 常量                         | 值          | 描述     |
| :-------------- | :----- | :------- |
| `MESSAGE_MENU_ACTION_COPY`    | `copy`    | 复制文本 |
| `MESSAGE_MENU_ACTION_REPLY`   | `reply`   | 回复消息 |
| `MESSAGE_MENU_ACTION_DELETE`  | `delete`  | 删除消息 |
| `MESSAGE_MENU_ACTION_RECALL`  | `recall`  | 撤回消息 |
| `MESSAGE_MENU_ACTION_EDIT`    | `edit`    | 编辑消息 |
| `MESSAGE_MENU_ACTION_FORWARD` | `forward` | 转发消息 |
| `MESSAGE_MENU_ACTION_REPORT`  | `report`  | 举报消息 |

### 设置菜单样式

`MessageMenuItem` 属性说明：

```typescript
class MessageMenuItem {
  id: number | string;  // 菜单项 ID
  value: ResourceStr;   // 菜单项文本
  icon?: Resource;      //（可选）菜单项图标 
  fontColor?: ResourceColor;  //（可选）文字颜色
  messageEnable?: MessageEnableOptions;  //（可选）消息类型过滤条件
  onMenuClick?: (id: string | number, message: ChatKitMessage) => void;  // 点击回调
}
```

### 动态显示菜单项

使用 `MessageEnableOptions` 根据消息类型和状态动态显示菜单：

| 属性              | 类型            | 描述          |
| :------- | :------ | :--------- |
| `isSender`      | Boolean         | 是否为发送方，`true` 仅发送方显示，`false` 仅接收方显示。 |
| `messageTypes`  | ContentType[]   | 消息类型数组，仅指定类型的消息显示该菜单项。                  |
| `messageStatus` | MessageStatus[] | 消息状态数组，仅指定状态的消息显示该菜单项。                  |
| `other`         | Boolean         | 其他自定义条件，可结合消息属性进行更复杂的动态判断逻辑。      |

:::tip
所有条件需同时满足，菜单项才会显示。
:::

以下是在 `messageItemMenusProvider` 回调中使用 `MessageEnableOptions` 的完整示例：

```typescript
import { 
  MessageMenuItem, 
  ChatKitMessage, 
  KitConstants, 
  ContentType, 
  MessageStatus,
  isMessageCanRecall,
  isMessageCanEdit
} from '@easemob/chatuikit';

messageItemMenusProvider: (message: ChatKitMessage) => {
  return [
    // 复制：仅文本消息显示
    {
      id: KitConstants.MESSAGE_MENU_ACTION_COPY,
      value: '复制',
      messageEnable: {
        messageTypes: [ContentType.TXT]
      }
    },
    // 回复：仅发送成功的消息显示
    {
      id: KitConstants.MESSAGE_MENU_ACTION_REPLY,
      value: '回复',
      messageEnable: {
        messageStatus: [MessageStatus.SUCCESS]
      }
    },
    // 撤回：发送方 + 发送成功 + 在可撤回时间内
    {
      id: KitConstants.MESSAGE_MENU_ACTION_RECALL,
      value: '撤回',
      messageEnable: {
        isSender: true,
        messageStatus: [MessageStatus.SUCCESS],
        other: isMessageCanRecall(message.origin)  // 判断是否在可撤回时间内
      }
    },
    // 编辑：发送方 + 文本消息 + 发送成功 + 在可编辑时间内
    {
      id: KitConstants.MESSAGE_MENU_ACTION_EDIT,
      value: '编辑',
      messageEnable: {
        isSender: true,
        messageTypes: [ContentType.TXT],
        messageStatus: [MessageStatus.SUCCESS],
        other: isMessageCanEdit(message.origin)  // 判断是否在可编辑时间内
      }
    },
    // 举报：仅接收方 + 发送成功的消息显示
    {
      id: KitConstants.MESSAGE_MENU_ACTION_REPORT,
      value: '举报',
      messageEnable: {
        isSender: false,
        messageStatus: [MessageStatus.SUCCESS]
      }
    },
    // 删除：所有消息都显示（无过滤条件）
    {
      id: KitConstants.MESSAGE_MENU_ACTION_DELETE,
      value: '删除'
    }
  ];
}
```

## 自定义消息条目

`ChatMessageItemProvider` 用于完全自定义整个消息条目，包括头像、昵称、时间戳、消息状态等。

<div style="text-align: center">
  <img src=/images/uikit/chatuikit/android/message_item.png  width="1000" />
</div>

#### 实现自定义消息条目

**步骤 1 创建自定义消息条目组件**

使用 `@Builder` 定义消息条目的完整 UI 布局，包括头像、昵称、消息内容、时间戳等。通过 `message.origin` 获取原始消息数据进行渲染。

```typescript
import { 
  ChatKitMessage,
  TextMessageBody
} from '@easemob/chatuikit';

@Builder
function CustomMessageItem(message: ChatKitMessage) {
  Row() {
    // 自定义头像
    Image($r('app.media.avatar_default'))
      .width(40)
      .height(40)
      .borderRadius(20)
      .margin({ right: 8 })
  
    Column({ space: 4 }) {
      // 自定义昵称
      Text(message.origin.getFrom())
        .fontSize(12)
        .fontColor('#999')
  
      // 自定义消息内容
      Text((message.origin.getBody() as TextMessageBody)?.getContent() ?? '')
        .fontSize(16)
        .fontColor('#333')
        .padding(12)
        .backgroundColor('#E5E5EA')
        .borderRadius(8)
  
      // 自定义时间戳
      Text(new Date(message.origin.getServerTimestamp()).toLocaleTimeString())
        .fontSize(10)
        .fontColor('#CCC')
    }
    .alignItems(HorizontalAlign.Start)
    .layoutWeight(1)
  }
  .width('100%')
  .padding(12)
}
```

**步骤 2 实现 ChatMessageItemProvider 接口**

实现 `ChatMessageItemProvider` 接口，在 `messageItemWrapBuilder` 中根据消息类型返回对应的消息条目 Builder。返回 `undefined` 时使用默认布局。

```typescript
import { 
  ChatMessageItemProvider, 
  ChatKitMessage,
  ContentType
} from '@easemob/chatuikit';

class MyMessageItemProvider implements ChatMessageItemProvider {
  messageItemWrapBuilder(message: ChatKitMessage): WrappedBuilder<[ChatKitMessage]> | undefined {
    // 针对特定消息类型自定义
    if (message.origin.getType() === ContentType.TXT) {
      return wrapBuilder<[ChatKitMessage]>(CustomMessageItem);
    }
    // 返回 undefined 使用默认布局
    return undefined;
  }
}
```

**步骤 3 注册 Provider**

在聊天页面的 `aboutToAppear` 生命周期中，通过 `ChatUIKitClient.setMessageItemProvider()` 注册自定义消息条目提供者，使 `ChatView` 使用你的自定义布局渲染消息。

```typescript
import { 
  ChatUIKitClient,
  ChatView,
  ChatType
} from '@easemob/chatuikit';

@Entry
@ComponentV2
struct ChatPageDemo {
  aboutToAppear() {
    ChatUIKitClient.setMessageItemProvider(new MyMessageItemProvider());
  }

  build() {
    Column() {
      ChatView({
        conversationId: 'user123',
        chatType: ChatType.Chat
      })
    }
  }
}
```

#### ChatMessageItemProvider 接口

`ChatMessageItemProvider` 为消息条目的 Builder 提供者，返回 `WrappedBuilder` 或 `undefined`（使用默认布局）。

```typescript
interface ChatMessageItemProvider {
// message 消息对象
  messageItemWrapBuilder: (message: ChatKitMessage) => WrappedBuilder<[ChatKitMessage]> | undefined;
}
```

:::tip
若实现了自定义消息布局（`ChatMessageBubbleProvider` 或 `ChatMessageItemProvider`），并希望在会话列表中也展示对应的自定义内容，可通过 `ChatUIKitClient.setConversationLatestMessageContentProvider()` 方法配置。详见 [会话列表高级设置](chatuikit_custom_conversation_list_advanced.html#设置会话条目内容)。
:::

## 自定义 ViewModel

### 自定义消息列表 ViewModel

**步骤 1 自定义 ViewModel，重写逻辑**

继承 `ChatViewModel`，重写 `getMoreMessages` 和 `sortMessages` 等方法以实现自定义消息加载与排序逻辑。

```typescript
import { 
  ChatViewModel,
  ChatMessage,
  ChatKitMessage,
  ChatType
} from '@easemob/chatuikit';

class MyChatViewModel extends ChatViewModel {
  // 重写消息加载逻辑
  getMoreMessages(): void {
    console.log('加载更多消息');
    // 自定义消息加载：从本地数据库加载或从服务器拉取
    super.getMoreMessages();
  }

  // 重写消息排序逻辑
  // 注意：sortMessages 方法支持可选参数 dataList，如果传入则对传入的数组排序并返回，否则对 this.dataList 排序
  sortMessages(dataList?: ChatKitMessage[]): ChatKitMessage[] {
    console.log('排序消息列表');
    // 自定义排序规则
    let sortArray = dataList ?? this.dataList;
    sortArray.sort((a, b) => {
      return a.serverTimestamp - b.serverTimestamp;
    });
    // 如果传入了 dataList，返回排序后的数组；否则更新 this.dataList 并返回
    if (dataList) {
      return sortArray;
    }
    this.dataList = sortArray;
    return sortArray;
  }
}
```

**步骤 2 使用自定义 ViewModel**

在 `ChatView` 中通过 `viewModel` 参数传入自定义 `ViewModel`，并在 `onReady` 中从 `pathStack` 获取参数后完成初始化。回调属性（如 `onReceivedMessage`、`onDeleteMessageResult` 等）需在 `onAppear` 中设置。

```typescript
import {  
  BaseChatViewModel, 
  ChatView,
  ChatMessage,
  ChatType,
  ChatPageParams
} from '@easemob/chatuikit';

@ComponentV2
struct CustomChatPage {
  pathStack: NavPathStack = new NavPathStack();
  @Local conversationId: string = '';
  @Local chatType: ChatType = ChatType.Chat;
  @Local myViewModel?: BaseChatViewModel;

  setChatViewModelCallback() {
    if (this.myViewModel) {
      // 设置回调属性
      // onReceivedMessage: 收到新消息时调用
      this.myViewModel.onReceivedMessage = (message: ChatMessage) => {
        console.log('收到新消息');
        // 执行自定义逻辑（如推送通知、声音提示等）
      };

      // onDeleteMessageResult: 删除消息结果回调
      this.myViewModel.onDeleteMessageResult = (messageId: string) => {
        console.log('消息已删除:', messageId);
        // 执行自定义逻辑
      };

      // onRecallMessageResult: 撤回消息结果回调
      this.myViewModel.onRecallMessageResult = (code: number, messageId: string) => {
        if (code === 0) {
          console.log('消息撤回成功:', messageId);
        } else {
          console.log('消息撤回失败:', messageId, 'code:', code);
        }
      };
    }
  }

  build() {
    NavDestination() {
      Column() {
        ChatView({
          conversationId: this.conversationId,
          chatType: this.chatType,
          viewModel: this.myViewModel,
          pathStack: this.pathStack
        })
          .layoutWeight(1)
          .onAppear(() => {
            this.setChatViewModelCallback();
          })
      }
    }
    .hideTitleBar(true)
    .backgroundColor($r('app.color.chat_color_background'))
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack;
      // 从 pathStack 获取参数
      let params = this.pathStack.getParamByName("CustomChatPage") as ChatPageParams[];
      if (params && params.length > 0) {
        let param = params[0] as ChatPageParams;
        this.conversationId = param.conversationId;
        this.chatType = param.conversationType as number;
        // 在获取到参数后初始化 ViewModel
        this.myViewModel = new MyChatViewModel(this.conversationId, this.chatType);
      } else {
        // 如果没有传参数则关闭当前页面
        this.pathStack.removeByName("CustomChatPage");
      }
    })
  }
}
```

### ChatViewModel 常用方法

`ChatViewModel` 提供以下常用方法，你可以调用或重写：

| 方法           | 说明              |
| :----------- | :-------------- |
| `setFetchFromServer(isFromServer: boolean)`                    | 设置是否从服务器拉取消息，默认 `false`（从本地数据库加载） |
| `getMessages(pageSize?, cursorOrStartMsgId?, fetchOptions?)`   | 获取消息列表                                                 |
| `getMoreMessages()`                                            | 加载更多历史消息（下拉刷新时调用）                           |
| `sortMessages(dataList?)`                                      | 对消息列表排序                                               |
| `insertMessage(message: ChatKitMessage)`                       | 插入一条本地消息                                             |
| `deleteMessage(message: ChatKitMessage)`                       | 删除一条本地消息                                             |
| `recallMessage(message: ChatKitMessage)`                       | 撤回一条已发送的消息                                         |
| `updateMessage(messageId: string, newMsg?: ChatMessage)`       | 更新消息状态                                                 |
| `scrollToLatest()`                                             | 滑动到最新消息                                               |
| `scrollToTarget(target: number, smooth?, align?, options?)`    | 滑动到指定索引位置                                           |
| `markAllMessagesAsRead()`                                      | 将会话所有消息置为已读                                       |
| `ackConversationRead(isCheckUnreadCount?: boolean)`            | 发送会话已读回执                                             |
| `ackMessageRead(message: ChatMessage, isCheckMedia?: boolean)` | 发送消息已读回执                                             |
| `downloadThumbnail(message: ChatMessage)`                      | 下载图片/视频缩略图或语音文件                                |

例如，设置消息拉取来源：

```typescript
class MyChatViewModel extends ChatViewModel {
  constructor(conversationId: string, chatType: ChatType) {
    super(conversationId, chatType);
    // 设置从服务器拉取消息（默认从本地数据库加载）
    this.setFetchFromServer(true);
  }
}
```

### 自定义消息发送 ViewModel

继承 `MessageViewModel` 可自定义消息发送、编辑等逻辑：

```typescript
import { 
  BaseMessageViewModel, 
  MessageViewModel,
  ChatMessage,
  ChatType,
  ChatError,
  ChatPageParams
} from '@easemob/chatuikit';

class MyMessageViewModel extends MessageViewModel {
  // 重写消息发送前的钩子方法
  willSendMessage(message: ChatMessage): void {
    console.log('即将发送消息:', message.getMsgId());

    // 添加自定义扩展字段
    let ext = message.ext();
    ext.set('deviceType', 'harmonyos');
    ext.set('clientVersion', '1.0.0');
    message.setExt(ext);

    super.willSendMessage(message);
  }
}

// 使用自定义 MessageViewModel
@ComponentV2
struct CustomChatPageWithMessageViewModel {
  pathStack: NavPathStack = new NavPathStack();
  @Local conversationId: string = '';
  @Local chatType: ChatType = ChatType.Chat;
  @Local messageViewModel?: BaseMessageViewModel;

  setMessageCallback() {
    if (this.messageViewModel) {
      // 设置回调属性
      // onWillSendMessage: 消息发送前调用（可用于添加扩展字段）
      this.messageViewModel.onWillSendMessage = (message: ChatMessage) => {
        console.log('即将发送消息:', message.getMsgId());
        // 可在此添加自定义扩展字段
        let ext = message.ext();
        ext.set('customField', 'customValue');
        message.setExt(ext);
      };

      // onMessageSent: 消息发送后立即调用（无论成功或失败）
      this.messageViewModel.onMessageSent = (message: ChatMessage) => {
        console.log('消息已发送:', message.getMsgId());
        // 自定义逻辑（如统计、日志上报等）
      };

      // onMessageSendSuccess: 消息发送成功时调用
      this.messageViewModel.onMessageSendSuccess = (oldMsgId: string, message: ChatMessage) => {
        console.log('消息发送成功:', oldMsgId, message.getMsgId());
        // 自定义逻辑（如统计、日志上报等）
      };

      // onMessageSendFailed: 消息发送失败时调用
      this.messageViewModel.onMessageSendFailed = (messageId: string, error: ChatError) => {
        console.error('消息发送失败:', messageId, error);
        // 自定义错误处理
      };

      // onMessageProgress: 附件消息上传进度回调
      this.messageViewModel.onMessageProgress = (message: ChatMessage, progress: number) => {
        console.log('上传进度:', message.getMsgId(), progress + '%');
        // 自定义进度显示逻辑
      };
    }
  }

  build() {
    NavDestination() {
      Column() {
        ChatView({
          conversationId: this.conversationId,
          chatType: this.chatType,
          messageViewModel: this.messageViewModel,
          pathStack: this.pathStack
        })
          .layoutWeight(1)
          .onAppear(() => {
            this.setMessageCallback();
          })
      }
    }
    .hideTitleBar(true)
    .backgroundColor($r('app.color.chat_color_background'))
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack;
      // 从 pathStack 获取参数
      let params = this.pathStack.getParamByName("CustomChatPageWithMessageViewModel") as ChatPageParams[];
      if (params && params.length > 0) {
        let param = params[0] as ChatPageParams;
        this.conversationId = param.conversationId;
        this.chatType = param.conversationType as number;
        // 在获取到参数后初始化 ViewModel
        this.messageViewModel = new MyMessageViewModel(this.conversationId, this.chatType);
      } else {
        // 如果没有传参数则关闭当前页面
        this.pathStack.removeByName("CustomChatPageWithMessageViewModel");
      }
    })
  }
}
```

### MessageViewModel 主要方法

`MessageViewModel` 提供以下常用方法，你可以调用或重写：

| 方法         | 说明        |
| :-------------- | :------- |
| `willSendMessage(message: ChatMessage)`   | 发送前钩子方法，可重写以添加扩展字段等逻辑     |
| `sendTextMessage(content?, isNeedGroupAck?, onError?, onSuccess?)`   | 发送文本消息                                                 |
| `sendVoiceMessage(voicePath, duration, onError?, onSuccess?)`       | 发送语音消息                                                 |
| `sendImageMessage(imagePath, onError?, onSuccess?, onProgress?)`     | 发送图片消息                                                 |
| `sendVideoMessage(videoPath, duration, onError?, onSuccess?, onProgress?)` | 发送视频消息                                         |
| `sendFileMessage(filePath, onError?, onSuccess?, onProgress?)`       | 发送文件消息                                                 |
| `sendUserCard(user, onError?, onSuccess?)`                           | 发送名片消息                                                 |
| `sendCmdMessage(action, onError, onSuccess)`                         | 发送命令消息                                                 |
| `editMessage(messageId, modifiedBody, onError?, onSuccess?)`         | 编辑消息                                                     |
| `resendMessage(message, onError?, onSuccess?, onProgress?)`          | 重新发送失败的消息                                           |
| `getLatestMessage(conversationId)`                                   | 获取会话最新一条消息                                         |

回调属性（可设置）：`onWillSendMessage`、`onMessageSent`、`onMessageSendSuccess`、`onMessageSendFailed`、`onMessageProgress`、`onEditSuccess`、`onEditError`。

## Provider 注册管理

### ChatUIKitClient

`ChatUIKitClient` 提供 API 注册所有的消息布局提供者：

```typescript
import { ChatUIKitClient } from '@easemob/chatuikit';

// 注册消息气泡提供者或消息条目提供者
ChatUIKitClient.setMessageItemProvider(provider);
```

### 注册时机

建议在 `ChatUIKitClient.init` 后立即注册 Provider，确保页面渲染前完成：

```typescript

export default class EntryAbility extends UIAbility {

  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    let client = ChatClient.getInstance();
    client.init(this.context, {
      appKey: this.appKey
    });
    ChatUIKitClient.init(client);
    // 注册所有自定义 Provider
    ChatUIKitClient.setMessageItemProvider(new MyBubbleProvider());
  }

}
```

## 自定义对话框

`ChatView` 提供两类对话框自定义能力：

- **Options 参数**：自定义对话框配置（菜单项、回调等）
- **Wrapper 参数**：完全替换对话框 UI 组件

| 参数                             | 类型                                                      | 说明                     |
| :------------------------------- | :-------------------------------------------------------- | :----------------------- |
| `mediaTypeSelectDialogOptions` | `BottomSheetDialogOptions`                              | 媒体类型选择对话框配置   |
| `mediaTypeSelectDialogWrapper` | `WrappedBuilder<[BottomSheetDialogOptions]>`            | 自定义媒体选择对话框组件 |
| `editMessageDialogOptions`     | `EditMessageBottomSheetDialogOptions`                   | 消息编辑对话框配置       |
| `editMessageDialogWrapper`     | `WrappedBuilder<[EditMessageBottomSheetDialogOptions]>` | 自定义消息编辑对话框组件 |

// TODO：添加两个图，研发忽略

### 自定义媒体类型选择回调

点击相机扩展菜单时，弹出拍照/录像选择对话框。你可以自定义选择后的处理逻辑：

```typescript
import { BottomSheetDialogOptions, ChatView, ChatType, KitConstants, ChatPageParams } from '@easemob/chatuikit';

@ComponentV2
struct CustomChatPage {
  pathStack: NavPathStack = new NavPathStack();
  @Local conversationId: string = '';
  @Local chatType: ChatType = ChatType.Chat;
  // 自定义对话框选项
  @Local mediaSelectOptions: BottomSheetDialogOptions = {
    alignment: DialogAlignment.Bottom,
    autoCancel: true,
    menus: [
      {
        id: 'photo',
        icon: $r('app.media.icon_camera'),
        value: '拍照',
        action: (id: string | number) => {
          // 调用拍照
          console.log('拍照');
        }
      },
      {
        id: 'camera',
        icon: $r('app.media.icon_video'),
        value: '录像',
        action: (id: string | number) => {
          // 调用录像
          console.log('录像');
        }
      }
    ]
  };

  build() {
    NavDestination() {
      Column() {
        ChatView({
          conversationId: this.conversationId,
          chatType: this.chatType,
          mediaTypeSelectDialogOptions: this.mediaSelectOptions,
          pathStack: this.pathStack
        })
          .layoutWeight(1)
      }
    }
    .hideTitleBar(true)
    .backgroundColor($r('app.color.chat_color_background'))
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack;
      // 从 pathStack 获取参数
      let params = this.pathStack.getParamByName("CustomChatPage") as ChatPageParams[];
      if (params) {
        let param = params[0] as ChatPageParams;
        this.conversationId = param.conversationId;
        this.chatType = param.conversationType as number;
      } else {
        // 如果没有传参数则关闭当前页面
        this.pathStack.removeByName("CustomChatPage");
      }
    })
  }
}
```

### 自定义消息编辑回调

点击编辑消息后，你可以自定义编辑完成后的处理逻辑：

```typescript
import { EditMessageBottomSheetDialogOptions, ChatView, ChatType, ChatPageParams } from '@easemob/chatuikit';

@ComponentV2
struct CustomChatPage {
  pathStack: NavPathStack = new NavPathStack();
  @Local conversationId: string = '';
  @Local chatType: ChatType = ChatType.Chat;
  @Local editOptions: EditMessageBottomSheetDialogOptions = {
    alignment: DialogAlignment.Bottom,
    autoCancel: true,
    onEditChange: (messageId: string | undefined, newText: string) => {
      if (messageId) {
        console.log(`编辑消息 ${messageId} 为: ${newText}`);
        // 调用消息编辑接口
      }
    }
  };

  build() {
    NavDestination() {
      Column() {
        ChatView({
          conversationId: this.conversationId,
          chatType: this.chatType,
          editMessageDialogOptions: this.editOptions,
          pathStack: this.pathStack
        })
          .layoutWeight(1)
      }
    }
    .hideTitleBar(true)
    .backgroundColor($r('app.color.chat_color_background'))
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack;
      // 从 pathStack 获取参数
      let params = this.pathStack.getParamByName("CustomChatPage") as ChatPageParams[];
      if (params) {
        let param = params[0] as ChatPageParams;
        this.conversationId = param.conversationId;
        this.chatType = param.conversationType as number;
      } else {
        // 如果没有传参数则关闭当前页面
        this.pathStack.removeByName("CustomChatPage");
      }
    })
  }
}
```

### 自定义对话框组件

使用 Wrapper 参数完全自定义对话框 UI：

```typescript
import { 
  ChatView, 
  ChatType, 
  BottomSheetDialogOptions,
  MenuItem,
  ChatPageParams
} from '@easemob/chatuikit';

// 1. 自定义媒体选择对话框组件
@Builder
function CustomMediaSelectDialog(options: BottomSheetDialogOptions) {
  Column() {
    // 自定义对话框布局
    Text('选择媒体类型')
      .fontSize(18)
      .fontWeight(FontWeight.Bold)
      .margin({ bottom: 16 })
  
    ForEach(options.menus, (menu: MenuItem) => {
      Row() {
        Image(menu.icon)
          .width(24)
          .height(24)
        Text(menu.value as string)
          .fontSize(16)
          .margin({ left: 12 })
      }
      .width('100%')
      .padding(12)
      .onClick(() => {
        menu.action?.(menu.id);
      })
    })
  }
  .padding(16)
  .backgroundColor(Color.White)
  .borderRadius({ topLeft: 16, topRight: 16 })
}

// 2. 使用自定义 Wrapper
@ComponentV2
struct CustomChatPage {
  pathStack: NavPathStack = new NavPathStack();
  @Local conversationId: string = '';
  @Local chatType: ChatType = ChatType.Chat;

  build() {
    NavDestination() {
      Column() {
        ChatView({
          conversationId: this.conversationId,
          chatType: this.chatType,
          // 使用自定义对话框组件
          mediaTypeSelectDialogWrapper: wrapBuilder(CustomMediaSelectDialog),
          pathStack: this.pathStack
        })
          .layoutWeight(1)
      }
    }
    .hideTitleBar(true)
    .backgroundColor($r('app.color.chat_color_background'))
    .onReady((context: NavDestinationContext) => {
      this.pathStack = context.pathStack;
      let params = this.pathStack.getParamByName("CustomChatPage") as ChatPageParams[];
      if (params) {
        let param = params[0] as ChatPageParams;
        this.conversationId = param.conversationId;
        this.chatType = param.conversationType as number;
      } else {
        this.pathStack.removeByName("CustomChatPage");
      }
    })
  }
}
```

## 自定义样式和资源

UIKit 提供默认的图标和文本资源，可通过资源覆盖方式自定义。

资源位于 UIKit 模块的 `src/main/resources/` 目录，在 App 模块同名文件或条目中覆盖即可。

- 图标资源：位于 `base/media/`，覆盖时需保持文件名和格式（SVG/PNG）一致。
- 文本资源：位于 `base/element/string.json` 中，覆盖时需保持名称(`name` 属性)一致。

### 常用图标资源

以下图标资源位于 `chatuikit/src/main/resources/base/media/`，可在 App 模块的 `resources/base/media/` 创建同名 SVG 文件覆盖。

**消息状态图标**

| 资源名称              | 描述             |
| :-------------- | :----- |
| `message_sent`      | 消息已发送图标   |
| `message_read`      | 消息已读图标     |
| `message_delivered` | 消息已送达图标   |
| `message_fail`      | 消息发送失败图标 |

**语音消息图标**

| 资源名称  | 描述   |
| :-------------- | :----- |
| `message_voice_send`                     | 发送方语音消息图标   |
| `message_voice_receive`                  | 接收方语音消息图标   |
| `message_voice_send_playing_f1/f2/f3`    | 发送方语音播放动画帧 |
| `message_voice_receive_playing_f1/f2/f3` | 接收方语音播放动画帧 |

**媒体消息图标**

| 资源名称 | 描述  |
| :-------------- | :----- |
| `message_video_flag`      | 视频消息播放指示器 |
| `message_file_icon`       | 文件消息图标       |
| `media_screen_icon_play`  | 媒体播放器播放按钮 |
| `media_screen_icon_pause` | 媒体播放器暂停按钮 |
| `media_screen_icon_large` | 媒体全屏按钮       |

**回复消息图标**

| 资源名称   | 描述             |
| :-------------- | :----- |
| `chat_icon_reply_off`       | 关闭回复图标     |
| `chat_icon_reply_image`     | 回复图片类型图标 |
| `chat_icon_reply_video`     | 回复视频类型图标 |
| `chat_icon_reply_voice`     | 回复语音类型图标 |
| `chat_icon_reply_file`      | 回复文件类型图标 |
| `chat_icon_reply_user_card` | 回复名片类型图标 |
| `quote_default_image_icon`  | 引用图片占位图   |
| `quote_default_video_icon`  | 引用视频占位图   |

**头像和其他图标**

| 资源名称  | 描述   |
| :-------------- | :----- |
| `avatar_default`          | 默认用户头像     |
| `avatar_group_default`    | 默认群组头像     |
| `chat_icon_edit_message`  | 消息已编辑指示器 |
| `chat_icon_cancel`        | 取消按钮图标     |
| `chat_icon_record`        | 录音按钮图标     |
| `chat_icon_record_send`   | 发送录音图标     |
| `chat_icon_record_delete` | 删除录音图标     |

**消息长按菜单**

| 资源名称                           | 描述     |
| :--------------------------------- | :------- |
| `chat_icon_message_menu_copy`    | 复制图标 |
| `chat_icon_message_menu_reply`   | 回复图标 |
| `chat_icon_message_menu_forward` | 转发图标 |
| `chat_icon_message_menu_edit`    | 编辑图标 |
| `chat_icon_message_menu_delete`  | 删除图标 |
| `chat_icon_message_menu_recall`  | 撤回图标 |
| `chat_icon_message_menu_report`  | 举报图标 |

### 常用文本资源

以下文本资源位于 `chatuikit/src/main/resources/base/element/string.json`，在 App 模块的 `resources/base/element/string.json` 中添加同名条目覆盖。

**下载提示**

| 资源名称  | 默认值   | 描述  |
| :--------- | :------- | :------- |
| `downloading_image_tips`    | 图片下载中，请稍后...     | 图片下载中提示   |
| `download_image_error_tips` | 图片下载失败              | 图片下载失败提示 |
| `downloading_video_tips`    | 视频文件下载中，请稍后... | 视频下载中提示   |
| `download_video_error_tips` | 视频文件下载失败          | 视频下载失败提示 |
| `download_file_error_tips`  | 文件下载失败              | 文件下载失败提示 |
| `downloading_tips`          | 下载中...                 | 通用下载中提示   |

**回复消息文本**

| 资源名称   | 默认值 | 描述  |
| :--------- | :------- | :------- |
| `chat_reply_tips`               | 正在回复         | 回复指示前缀                 |
| `chat_reply_file_tips`          | 附件             | 回复文件类型提示             |
| `chat_reply_voice_tips`         | 语音             | 回复语音类型提示             |
| `chat_reply_image_tips`         | 图片             | 回复图片类型提示             |
| `chat_reply_video_tips`         | 视频             | 回复视频类型提示             |
| `chat_reply_file_message_tips`  | 附件             | 消息中被回复消息附件提示内容 |
| `chat_reply_voice_message_tips` | 语音             | 消息中被回复消息语音提示内容 |
| `chat_reply_lost_message_tips`  | 引用的内容不存在 | 引用消息不存在提示           |
| `chat_reply_preview_image`      | [Image]          | 回复预览图片标签             |
| `chat_reply_preview_video`      | [Video]          | 回复预览视频标签             |
| `chat_reply_preview_file`       | [File]           | 回复预览文件标签             |
| `chat_reply_preview_voice`      | [Audio]          | 回复预览语音标签             |
| `chat_reply_preview_custom`     | [Custom message] | 回复预览自定义消息标签       |
| `chat_reply_preview_combine`    | [Chat history]   | 回复预览聊天记录标签         |

**消息状态文本**

| 资源名称     | 默认值     | 描述   |
| :--------- | :------- | :------- |
| `chat_edit_message_flag`        | 已编辑                            | 消息已编辑标记   |
| `chat_msg_recall_content_self`  | 你撤回了一条消息                  | 自己撤回消息文本 |
| `chat_msg_recall_content_other` | %s 撤回了一条消息（%s 为用户 ID） | 他人撤回消息文本 |

**消息类型标签**

| 资源名称                     | 默认值       | 描述             |
| :--------------------------- | :----------- | :--------------- |
| `chat_msg_label_image`     | [图片]       | 图片消息标签     |
| `chat_msg_label_video`     | [视频]       | 视频消息标签     |
| `chat_msg_label_voice`     | [语音]       | 语音消息标签     |
| `chat_msg_label_file`      | [附件]       | 文件消息标签     |
| `chat_msg_label_custom`    | [自定义消息] | 自定义消息标签   |
| `chat_msg_label_combine`   | [聊天记录]   | 合并转发消息标签 |
| `chat_msg_label_user_card` | [联系人] %s  | 名片消息标签     |

**对话框文本**

| 资源名称  | 默认值 | 描述   |
| :--------- | :------- | :----------------- |
| `chat_message_resend_title`          | 确认重新发送这条消息？             | 重发确认对话框标题 |
| `chat_message_delete_dialog_title`   | 确认删除这条消息？                 | 删除确认对话框标题 |
| `chat_message_delete_dialog_content` | 删除后，对方依旧可以看到这条消息。 | 删除确认对话框内容 |
| `chat_message_recall_dialog_title`   | 确认撤回这条消息？                 | 撤回确认对话框标题 |
| `cancel`                             | 取消                               | 取消按钮           |
| `confirm`                            | 确定                               | 确认按钮           |

**群组 @ 提及文本**

| 资源名称                        | 默认值    | 描述                  |
| :--------- | :------- | :----------------- |
| `chat_group_mention_title`    | @提及     | 群 @ 消息成员列表标题 |
| `chat_group_mention_all`      | 所有人    | @ 所有人选项          |
| `chat_conv_mention_self_flag` | [有人@你] | 有人 @ 你标记         |
| `chat_conv_mention_all_flag`  | [@所有人] | @ 所有人标记          |

### 资源覆盖示例

- 文本资源覆盖：

文本资源定义位于 UIKit 模块的 `chatuikit/src/main/resources/base/element/string.json` 文件。如需自定义：

1. 在你的 App 模块下创建或修改 `resources/base/element/string.json` 文件。
2. 添加与 UIKit 同名的资源条目（`name` 属性一致）。
3. 系统将自动优先使用你 App 模块中定义的文本。

```json
{
  "string": [
    {
      "name": "chat_edit_message_flag",
      "value": "已编辑"
    },
    {
      "name": "chat_msg_recall_content_self",
      "value": "你撤回了一条消息"
    },
    {
      "name": "chat_message_resend_title",
      "value": "重新发送消息？"
    },
    {
      "name": "cancel",
      "value": "取消"
    },
    {
      "name": "confirm",
      "value": "确定"
    }
  ]
}
```

- 图标资源覆盖

将自定义 SVG 文件放入 `App/resources/base/media/` 目录，保持文件名与 UIKit 一致即可。

例如，将自定义的 `avatar_default.svg` 文件放入 `App/resources/base/media/` 目录即可替换默认头像。

### 注意事项

- **图标格式**：覆盖图标时需保持与原资源相同的文件格式（SVG 或 PNG）。
- **命名精确**：文本资源的 `name` 必须与 UIKit 完全一致（区分大小写）。
- **编译生效**：所有资源修改后均需重新编译 App 模块才能生效。
- **增量覆盖**：仅覆盖需要修改的资源，其余自动使用默认值。
