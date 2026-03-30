# 会话列表的高级设置

<Toc />

本文介绍会话列表的高级自定义功能，包括自定义会话条目组件、ViewModel 扩展等。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/harmonyOS/conversation_list_detail.png" title="会话列表组件 ConversationListView" />
</ImageGallery>

## 自定义会话最新消息内容

当应用中存在自定义消息类型（如红包、位置分享、名片等）时，可通过实现 `ConversationLatestMessageContentProvider` 接口来自定义这些消息在会话列表中的展示内容。

#### 实现自定义消息内容提供者

```typescript
import {
  ConversationLatestMessageContentProvider,
  ChatUIKitClient,
  ChatMessage
} from '@easemob/chatuikit';

// 实现自定义内容提供者
class MyContentProvider implements ConversationLatestMessageContentProvider {
  latestMessageContent(message: ChatMessage): string | undefined {
    // 通过消息扩展字段判断自定义消息类型
    let ext = message.ext();
    if (ext.has('customType')) {
      const customType = ext.get('customType');
    
      // 自定义红包消息展示
      if (customType === 'red_packet') {
        return '[红包] 恭喜发财';
      }
    
      // 自定义位置消息展示
      if (customType === 'location') {
        return '[位置] 分享了位置';
      }
    
    }
  
    // 返回 undefined 使用默认展示
    return undefined;
  }
}

// 注册自定义内容提供者
@Entry
@ComponentV2
struct ConvListAdvancedDemo {
  aboutToAppear() {
    // 在 ChatUIKitClient.init 之后注册
    ChatUIKitClient.setConversationLatestMessageContentProvider(
      new MyContentProvider()
    );
  }

  build() {
    Column() {
      ConversationListView({
        viewModel: new ConvListViewModel()
      })
    }
  }
}
```

#### ConversationLatestMessageContentProvider 接口

`ConversationLatestMessageContentProvider` 接口提供会话列表中最后一条消息的自定义展示内容，返回自定义展示文本，返回 `undefined` 则使用默认展示。

```typescript
export interface ConversationLatestMessageContentProvider {
  // message 最后一条消息对象
  latestMessageContent: (message: ChatMessage) => string | undefined;
}
```

:::tip

- **返回值**：返回自定义文本时显示该文本；返回 `undefined` 时使用 UIKit 默认逻辑。
- **消息扩展**：通过 `message.ext()` 获取消息扩展字段，判断自定义消息类型。
- **注册时机**：建议在 `ChatUIKitClient.init()` 后注册，确保在会话列表渲染前完成注册。
:::

#### 配合自定义消息布局使用

如果你在聊天页面实现了自定义消息气泡或消息条目布局，建议同时实现 `ConversationLatestMessageContentProvider`，保持会话列表与聊天页面的消息展示一致性。

:::tip
关于如何在聊天页面自定义消息布局，请参考 [消息列表的高级设置](chatuikit_custom_chat_advanced.md#自定义消息布局)。
:::

## 自定义左滑菜单

会话列表支持左滑操作，可通过配置菜单项实现置顶、删除等快捷操作。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/harmonyos/conversation_slide.png" title="会话左滑菜单" />
  <ImageItem src="/images/uikit/chatuikit/harmonyos/custom_conversation_slide_menu.png" title="自定义左滑菜单" />
</ImageGallery>

#### 设置菜单项

通过 `ConversationListView` 的 `itemMenus` 参数传入 `ConvMenuItem[]` 数组，添加和移除菜单项。

```typescript
import { ConversationListView, ConvListViewModel, ConvMenuItem, ChatKitConversation, KitConstants } from '@easemob/chatuikit';

@Entry
@ComponentV2
struct CustomConvListPage {
  @Local itemMenus: ConvMenuItem[] = [
    // 置顶（根据会话状态动态显示）
    {
      id: KitConstants.CONV_MENU_ACTION_PIN,
      value: $r('app.string.conv_item_action_pin'),
      icon: $r('app.media.chat_icon_conv_menu_pin'),
      backgroundColor: $r('app.color.chat_color_conv_item_menu_bg_pin'),
      fontColor: Color.White,
      onMenuClick: (id: string | number, conv: ChatKitConversation) => {
        console.log('置顶会话:', conv.conversationId);
        // ViewModel 会自动处理置顶逻辑
      }
    },
    // 取消置顶
    {
      id: KitConstants.CONV_MENU_ACTION_UNPIN,
      value: $r('app.string.conv_item_action_unpin'),
      icon: $r('app.media.chat_icon_conv_menu_unpin'),
      backgroundColor: $r('app.color.chat_color_conv_item_menu_bg_pin'),
      fontColor: Color.White,
      onMenuClick: (id: string | number, conv: ChatKitConversation) => {
        console.log('取消置顶会话:', conv.conversationId);
      }
    },
    // 免打扰
    {
      id: KitConstants.CONV_MENU_ACTION_MUTE,
      value: $r('app.string.conv_item_action_mute'),
      icon: $r('app.media.chat_icon_conv_menu_mute'),
      backgroundColor: $r('app.color.chat_color_conv_item_menu_bg_mute'),
      fontColor: Color.White,
      onMenuClick: (id: string | number, conv: ChatKitConversation) => {
        console.log('免打扰会话:', conv.conversationId);
      }
    },
    // 删除会话
    {
      id: KitConstants.CONV_MENU_ACTION_DELETE,
      value: $r('app.string.conv_item_action_delete'),
      icon: $r('app.media.chat_icon_conv_menu_delete'),
      backgroundColor: $r('app.color.chat_color_conv_item_menu_bg_delete'),
      fontColor: Color.White,
      onMenuClick: (id: string | number, conv: ChatKitConversation) => {
        console.log('删除会话:', conv.conversationId);
      }
    },
    // 自定义菜单项
    {
      id: 'mark_unread',
      value: '标记未读',
      backgroundColor: '#7B68EE',
      fontColor: Color.White,
      onMenuClick: (id: string | number, conv: ChatKitConversation) => {
        console.log('标记未读:', conv.conversationId);
        // 执行标记未读逻辑
      }
    }
  ];

  build() {
    Column() {
      ConversationListView({
        viewModel: new ConvListViewModel(),
        itemMenus: this.itemMenus  // 传入自定义菜单
      })
    }
  }
}
```

左滑菜单项的默认 ID 如下表所示：

| ID 常量                     | 值         | 描述         |
| :-------------------------- | :--------- | :----------- |
| `CONV_MENU_ACTION_PIN`    | `pin`    | 置顶会话。   |
| `CONV_MENU_ACTION_UNPIN`  | `unpin`  | 取消置顶。   |
| `CONV_MENU_ACTION_MUTE`   | `mute`   | 免打扰。     |
| `CONV_MENU_ACTION_UNMUTE` | `unmute` | 取消免打扰。 |
| `CONV_MENU_ACTION_DELETE` | `delete` | 删除会话。   |

#### 设置菜单项样式

`ConvMenuItem` 用于配置会话左滑菜单项的样式。以下是在 `ConversationListView` 中使用的属性：

| 属性 | 类型     | 必填 | 默认值 | 描述        |
| :---------- | :------- | :--- | :---- | :----- |
| `id`              | Number\| String                                          | 是   | -             | 菜单项唯一标识，可使用预定义常量（如 `CONV_MENU_ACTION_PIN`）或自定义字符串。 |
| `value`           | ResourceStr                                              | 是   | -             | 显示文本，支持字符串或资源引用。                                                |
| `icon`            | Resource                                                 | 否   | `undefined` | （可选）菜单项图标。                                                            |
| `backgroundColor` | ResourceColor                                            | 否   | `undefined` | 背景色。                                                                        |
| `fontColor`       | ResourceColor                                            | 否   | `undefined` | 文字颜色。                                                                      |
| `enable`          | boolean                                                  | 否   | true          | 是否可用。                                                                      |
| `onMenuClick`     | (id: string\| number, conv: ChatKitConversation) => void | 否   | `undefined` | 点击回调函数，参数为菜单 ID 和当前会话对象。                                    |

#### 动态显示菜单项

左滑菜单需根据会话状态动态显示。UIKit 提供两种方式：

**方式一：使用默认动态过滤逻辑**

使用 **预定义菜单 ID** 时，`ConvListViewModel` 自动根据会话状态过滤菜单项，**无需额外代码**（无需重写 `getTargetMenus` 方法）。

```typescript
@Local itemMenus: ConvMenuItem[] = [
  {
    id: KitConstants.CONV_MENU_ACTION_PIN,      /// 置顶：自动在未置顶时显示
    value: $r('app.string.conv_item_action_pin'),
    backgroundColor: $r('app.color.chat_color_conv_item_menu_bg_pin')
  },
  {
    id: KitConstants.CONV_MENU_ACTION_UNPIN,    // 取消置顶：自动在已置顶时显示
    value: $r('app.string.conv_item_action_unpin'),
    backgroundColor: $r('app.color.chat_color_conv_item_menu_bg_pin')
  },
  {
    id: KitConstants.CONV_MENU_ACTION_DELETE,   // 删除：始终显示
    value: $r('app.string.conv_item_action_delete'),
    backgroundColor: $r('app.color.chat_color_conv_item_menu_bg_delete')
  }
];

// 使用默认 ViewModel，无需重写 getTargetMenus
ConversationListView({
  viewModel: new ConvListViewModel(),// 默认 ViewModel 已内置过滤逻辑
  itemMenus: this.itemMenus  // 系统自动根据会话状态过滤菜单
})
```

自动过滤规则：

| 菜单 ID                     | 显示条件           |
| :-------------------------- | :----------------- |
| `CONV_MENU_ACTION_PIN`    | 会话未置顶  |
| `CONV_MENU_ACTION_UNPIN`  | 会话已置顶   |
| `CONV_MENU_ACTION_MUTE`   | 会话未免打扰 |
| `CONV_MENU_ACTION_UNMUTE` | 会话已免打扰 |
| `CONV_MENU_ACTION_DELETE` | 始终显示     |

**方式二：自定义过滤逻辑**

以下场景需继承 `ConvListViewModel` 并重写 `getTargetMenus` 方法：

- **自定义菜单 ID** 的显示/隐藏控制。
- **基于业务逻辑** 控制菜单项显示：例如，某些会话禁止删除。
- **修改默认过滤规则**：例如，某些场景不显示置顶。

实现步骤如下：

1. 继承 `ConvListViewModel` 并重写 `getTargetMenus` 方法。
2. 通过设置菜单项的 `enable` 属性控制其显示。
3. 返回 `enable === true` 的菜单项数组。
4. 在组件中使用自定义 `ViewModel`。

```typescript
import {
  ConvListViewModel,
  ConvMenuItem,
  ChatKitConversation,
  KitConstants,
  ConversationType
} from '@easemob/chatuikit';

class MyConvListViewModel extends ConvListViewModel {
  // 重写 getTargetMenus 方法，控制菜单项的显示与否
  getTargetMenus(menus: ConvMenuItem[], conv: ChatKitConversation): ConvMenuItem[] {
    const isPinned = conv.isPinned;
    const isMuted = conv.isMuted;
  
    menus.forEach(item => {
      // 默认菜单 ID 的过滤逻辑 
      if (item.id === KitConstants.CONV_MENU_ACTION_PIN) {
        item.enable = !isPinned;  // 未置顶时显示"置顶"
      } else if (item.id === KitConstants.CONV_MENU_ACTION_UNPIN) {
        item.enable = isPinned;   // 已置顶时显示"取消置顶"
      } else if (item.id === KitConstants.CONV_MENU_ACTION_MUTE) {
        item.enable = !isMuted;   // 未免打扰时显示"免打扰"
      } else if (item.id === KitConstants.CONV_MENU_ACTION_UNMUTE) {
        item.enable = isMuted;    // 已免打扰时显示"取消免打扰"
      } 
      // 自定义菜单 ID 的过滤逻辑
      else if (item.id === 'mark_unread') {
        // 示例：仅当会话有未读消息时才显示"标记未读"
        item.enable = conv.unreadCount === 0;
      } else if (item.id === 'export_chat') {
        // 示例：仅单聊会话显示"导出聊天记录"
        item.enable = conv.type === ConversationType.Chat;
      } 
      // 删除菜单的自定义逻辑
      else if (item.id === KitConstants.CONV_MENU_ACTION_DELETE) {
        // 示例：禁止删除系统会话
        item.enable = !conv.conversationId.startsWith('system_');
      } else {
        // 其他自定义菜单默认显示
        item.enable = true;
      }
    });
  
    // 返回 enable 为 true 的菜单项
    return menus.filter((item) => item.enable);
  }
}

// 使用自定义 ViewModel
@Entry
@ComponentV2
struct CustomConvListPage {
  @Local itemMenus: ConvMenuItem[] = [
    {
      id: KitConstants.CONV_MENU_ACTION_PIN,
      value: $r('app.string.conv_item_action_pin')
    },
    {
      id: 'mark_unread',  // 自定义菜单 ID
      value: '标记未读',
      backgroundColor: '#7B68EE'
    },
    {
      id: 'export_chat',  // 自定义菜单 ID
      value: '导出记录',
      backgroundColor: '#4CAF50'
    },
    {
      id: KitConstants.CONV_MENU_ACTION_DELETE,
      value: $r('app.string.conv_item_action_delete')
    }
  ];

  build() {
    Column() {
      ConversationListView({
        viewModel: new MyConvListViewModel(),  // 使用重写了 getTargetMenus 的 ViewModel
        itemMenus: this.itemMenus
      })
    }
  }
}
```

:::tip
- 标准操作（置顶/免打扰/删除）使用预定义 ID 即可，无需重写 `getTargetMenus`，`ConvListViewModel` 自动处理。
- 自定义过滤逻辑时必须重写 `getTargetMenus` 控制菜单项显示。
- 点击后的业务逻辑在 `onMenuClick` 中实现，`getTargetMenus` 只负责控制显示或隐藏。
:::

## 设置消息未读计数图标

会话列表未读提示支持 **数字** 与 **小蓝点** 两种样式，与会话免打扰状态（`ChatKitConversation.isMuted`）相关：

| 会话免打扰状态 | 未读计数样式             |
| :------------- | :----------------------- |
| 未开启         | 数字徽章，显示具体未读数 |
| 已开启         | 小圆点，仅提示有未读消息 |

默认以数字形式显示在会话条目右侧。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_unread.png" title="消息未读计数图标" />
</ImageGallery>

## 完全自定义会话条目

通过实现 `ConversationItemProvider` 接口，可自定义会话条目（`ConversationItemView`）的完整布局。

<img src="/images/uikit/chatuikit/android/conversation_list_item.png">

#### 完全自定义会话列表

**步骤 1 创建自定义会话条目组件**

使用 `@Builder` 定义会话条目的完整 UI 布局，包括头像、会话名称、最后一条消息、未读数、置顶与免打扰标记等。通过 `conversation` 参数（`ChatKitConversation`）获取会话数据进行渲染。时间戳使用 `formatConversationDate` 格式化，最后一条消息内容使用 `ChatConvInfoManager.getInstance().getLatestMessageContent()` 获取。

```typescript
import {
  ChatKitConversation,
  ChatConvInfoManager,
  formatConversationDate
} from '@easemob/chatuikit';

@Builder
function CustomConversationItem(conversation: ChatKitConversation) {
  Row() {
    // 自定义头像
    Image(conversation.getAvatar())
      .width(50)
      .height(50)
      .borderRadius(25)
      .margin({ right: 12 })
  
    Column({ space: 4 }) {
      Row() {
        // 会话名称
        Text(conversation.getName())
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .layoutWeight(1)
    
        // 置顶标记
        if (conversation.isPinned) {
          Image($r('app.media.chat_icon_conv_pin'))
            .width(16)
            .height(16)
            .margin({ right: 4 })
        }
    
        // 时间戳
        Text(formatTime(conversation.latestMessage?.getServerTimestamp()))
          .fontSize(12)
          .fontColor('#999999')
      }
      .width('100%')
  
      Row() {
        // 最后一条消息内容
        Text(getMessageContent(conversation.latestMessage))
          .fontSize(14)
          .fontColor('#666666')
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
          .layoutWeight(1)
    
        // 未读数标记
        if (conversation.unreadCount && conversation.unreadCount > 0) {
          Badge({
            count: conversation.unreadCount,
            maxCount: 99,
            style: { badgeSize: 18, badgeColor: '#FF5A5F' }
          })
            .margin({ left: 4 })
        }
    
        // 免打扰图标
        if (conversation.isMuted) {
          Image($r('app.media.chat_icon_conv_mute'))
            .width(16)
            .height(16)
            .margin({ left: 4 })
        }
      }
      .width('100%')
    }
    .layoutWeight(1)
    .alignItems(HorizontalAlign.Start)
  }
  .width('100%')
  .padding({ left: 12, right: 12, top: 10, bottom: 10 })
  .backgroundColor(Color.White)
}
```

**步骤 2 实现 ConversationItemProvider 接口**

实现 `ConversationItemProvider` 接口，在 `itemWrapBuilder` 中根据会话类型返回对应的会话条目 Builder。返回 `wrapBuilder(CustomConversationItem)` 使用自定义布局，返回 `undefined` 则使用默认布局。

```typescript
import {
  ConversationItemProvider,
  ChatKitConversation
} from '@easemob/chatuikit';

class MyConversationItemProvider implements ConversationItemProvider {
  itemWrapBuilder(item: ChatKitConversation): WrappedBuilder<[ChatKitConversation]> | undefined {
    // 所有会话均使用自定义布局（包括单聊和群聊）
    return wrapBuilder<[ChatKitConversation]>(CustomConversationItem);
  
    // 按会话类型返回不同布局：
    // if (item.type === ConversationType.GroupChat) {
    //   return wrapBuilder<[ChatKitConversation]>(CustomConversationItem);
    // }
    // return undefined;  // 单聊使用默认布局
  }
}
```

**步骤 3：注册 Provider**

在页面 `aboutToAppear` 生命周期中，通过 `ChatUIKitClient.setConversationItemProvider()` 注册自定义会话条目提供者，使 `ConversationListView` 使用自定义布局渲染会话列表。

```typescript
import {
  ChatUIKitClient,
  ConversationListView,
  ConvListViewModel
} from '@easemob/chatuikit';

@Entry
@ComponentV2
struct ConvListAdvancedDemo {
  aboutToAppear() {
    // 注册自定义会话条目提供者
    ChatUIKitClient.setConversationItemProvider(
      new MyConversationItemProvider()
    );
  }

  build() {
    Column() {
      ConversationListView({
        viewModel: new ConvListViewModel()
      })
    }
  }
}
```

#### ConversationItemProvider 接口

`ConversationItemProvider` 为 会话条目的 Builder 提供者，返回 `WrappedBuilder` 或 `undefined`（使用默认布局）。

```typescript
export interface ConversationItemProvider {
  // item：会话对象
  itemWrapBuilder: (item: ChatKitConversation) => WrappedBuilder<[ChatKitConversation]> | undefined;
}
```

#### ChatKitConversation 属性

`ChatKitConversation` 对象提供以下属性和方法：

| 属性/方法          | 类型                               | 描述                                                                                |
| :-------------- | :----- | :------- |
| `conversationId` | String                             | 会话 ID。                                                                           |
| `type`           | ConversationType                   | 会话类型：<br/> - 单聊为 `ConversationType.Chat`；<br/> - 群聊为 `ConversationType.GroupChat`。 |
| `unreadCount`    | Number                             | 未读消息数。                                                                        |
| `isPinned`       | Boolean                            | 是否置顶。                                                                          |
| `isMuted`        | Boolean                            | 是否免打扰。                                                                        |
| `hasMention`     | Boolean                            | 是否有@消息。                                                                       |
| `latestMessage`  | ChatMessage                        | 最后一条消息对象。                                                                  |
| `latestUser`     | ChatUserProfile                    | 最后一条消息的发送方。                                                              |
| `profile`        | ChatUserProfile\| ChatGroupProfile | 会话信息（会话名称和头像）。                                                        |
| `getName()`      | String                             | 获取会话名称。                                                                      |
| `getAvatar()`    | ResourceStr                        | 获取会话头像。                                                                      |

## 自定义 ViewModel

### 基础使用示例

通过继承 `BaseConvListViewModel` 或 `ConvListViewModel` 重写会话列表的数据加载和操作逻辑。自定义 `ViewModel` 需完成以下两个步骤：

1. 创建自定义 `ViewModel` 类。
2. 在页面中使用自定义 `ViewModel`。

**步骤 1 创建自定义 ViewModel 类**

继承 `ConvListViewModel`，按需重写 `aboutToAppear`、`pinConversation`、`muteConversation`、`deleteConversation`、`searchConversations` 等方法，以扩展或拦截会话列表的加载与操作逻辑。

```typescript
import { ConvListViewModel, ChatKitConversation } from '@easemob/chatuikit';

export class MyConvListViewModel extends ConvListViewModel {
  // 重写会话加载逻辑
  aboutToAppear(): void {
    console.log('会话列表 ViewModel 初始化');
    super.aboutToAppear();
    // 执行自定义初始化逻辑
  }

  // 重写置顶会话逻辑
  pinConversation(conversation: ChatKitConversation, isPinned: boolean): void {
    console.log(`${isPinned ? '置顶' : '取消置顶'}会话:`, conversation.conversationId);
    super.pinConversation(conversation, isPinned);
    // 执行自定义逻辑（如上报统计）
  }

  // 重写免打扰逻辑
  muteConversation(conversation: ChatKitConversation, isMuted: boolean): void {
    console.log(`${isMuted ? '设置' : '取消'}免打扰:`, conversation.conversationId);
    super.muteConversation(conversation, isMuted);
  }

  // 重写删除会话逻辑
  deleteConversation(conversation: ChatKitConversation): void {
    console.log('删除会话:', conversation.conversationId);
    super.deleteConversation(conversation);
    // 执行自定义逻辑
  }

  // 重写会话搜索逻辑
  searchConversations(key: string) {
    console.log('搜索关键词:', key);
    super.searchConversations(key);
  }
}
```

**步骤 2 在页面中使用自定义 ViewModel**

在 `ConversationListView` 的 `viewModel` 参数中传入自定义 `ViewModel` 实例，使会话列表使用你的扩展逻辑。

```typescript
import { BaseConvListViewModel, ConversationListView } from '@easemob/chatuikit';

@Entry
@ComponentV2
struct CustomConvListPage {
  @Local myViewModel: BaseConvListViewModel = new MyConvListViewModel();

  build() {
    Column() {
      ConversationListView({
        viewModel: this.myViewModel
      })
    }
  }
}
```

### ViewModel 配置项

```typescript
class MyConvListViewModel extends ConvListViewModel {
  constructor() {
    super(true); // 删除会话时是否同时删除消息// true: 删除消息，false: 仅删除会话
    // 设置是否从服务器拉取会话列表
    this.fetchFromServer(false);  // （默认）false: 从本地数据库加载；true: 从服务器拉取
  }
}
```

### BaseConvListViewModel 抽象方法

`BaseConvListViewModel` 提供以下抽象方法供子类实现：

| 方法                    | 参数                                                  | 描述                | 使用场景                          |
| :---------------------- | :---------------------------------------------------- | :------------------ | :-------------------------------- |
| `muteConversation`    | `conv: ChatKitConversation, isMute: boolean`        | 设置/取消会话免打扰 | 需要拦截或扩展免打扰逻辑时重写。  |
| `pinConversation`     | `conv: ChatKitConversation, isPin: boolean`         | 设置/取消会话置顶   | 需要拦截或扩展置顶逻辑时重写。    |
| `deleteConversation`  | `conv: ChatKitConversation`                         | 删除会话            | 需要拦截或扩展删除逻辑时重写。    |
| `searchConversations` | `key: string`                                       | 搜索会话            | 需要自定义搜索逻辑时重写。        |
| `getTargetMenus`      | `menus: ConvMenuItem[], conv: ChatKitConversation`  | 获取会话菜单项      | 需要动态控制菜单显示/隐藏时重写。 |
| `updateItem`          | `conv: ChatKitConversation \| Conversation \| string` | 更新会话条目        | 需要手动刷新某个会话 UI 时调用。  |

### ViewModel 生命周期

`ConvListViewModel` 提供以下生命周期方法：

| 方法                 | 描述                 | 调用时机       |
| -------------------- | -------------------- | -------------- |
| `aboutToAppear`    | `ViewModel` 初始化 | 组件即将显示。 |
| `aboutToDisAppear` | `ViewModel` 销毁   | 组件即将销毁。 |

## 自定义样式和资源

本节介绍会话列表相关的可自定义资源，包括颜色资源、图标资源和图片资源。

### 常用颜色资源

以下颜色资源位于 `chatuikit/src/main/resources/base/element/uikit_color.json` 中，可在 App 模块的 `resources/base/element/uikit_color.json` 中添加同名条目进行覆盖。

| 资源名称                                     | 描述                                  |
| :-------------- | :----- |
| `chat_color_conv_item_name`                | 会话名称的颜色                        |
| `chat_color_conv_item_date`                | 会话日期的颜色                        |
| `chat_color_conv_item_message`             | 会话条目的最近一条消息的颜色          |
| `chat_color_conv_item_mention`             | 会话条目 @ 内容颜色                   |
| `chat_color_conv_item_badge`               | 会话条目的未读数标记背景颜色          |
| `chat_color_conv_item_badge_count`         | 会话条目的未读数标记文字颜色          |
| `chat_color_conv_item_bg`                  | 会话条目的背景色                      |
| `chat_color_conv_item_bg_pinned`           | 会话条目的置顶背景色                  |
| `chat_color_conv_item_bg_pressed`          | 会话条目的点击背景色                  |
| `chat_color_conv_item_menu_bg_mute`        | 会话条目的免打扰/取消免打扰菜单背景色 |
| `chat_color_conv_item_menu_bg_pin`         | 会话条目的置顶/取消置顶菜单背景色     |
| `chat_color_conv_item_menu_bg_delete`      | 会话条目的删除菜单背景色              |
| `chat_color_conv_item_menu_icon_fillColor` | 会话条目的滑动菜单图标填充色          |
| `chat_color_conv_item_mute_icon_fillColor` | 会话条目的免打扰图标填充色            |
| `chat_color_search_select_keyword`         | 搜索结果关键字高亮颜色                |
| `chat_color_search_icon_fill`              | 搜索图标填充颜色                      |
| `chat_color_list_separator`                | 会话列表分割线颜色                    |

### 常用图标资源

以下图标资源位于 `chatuikit/src/main/resources/base/media/` 目录，可在 App 模块的 `resources/base/media/` 目录下创建同名 SVG 文件覆盖。

**会话条目与状态图标**

| 资源名称                 | 描述                           |
| :-------------- | :----- |
| `chat_icon_conv_muted` | 会话的免打扰标记图标       |
| `message_sent`         | 会话的消息已发送状态图标   |
| `message_read`         | 会话的消息已读状态图标     |
| `message_delivered`    | 会话的消息已送达状态图标   |
| `message_fail`         | 会话的消息发送失败状态图标 |

**滑动菜单与标题栏图标**

| 资源名称                       | 描述                                 |
| :-------------- | :----- |
| `chat_icon_conv_menu_mute`   | 左滑菜单中的免打扰图标               |
| `chat_icon_conv_menu_unmute` | 左滑菜单中的取消免打扰图标         |
| `chat_icon_conv_menu_pin`    | 左滑菜单中的置顶图标                 |
| `chat_icon_conv_menu_unpin`  | 左滑菜单中的取消置顶图标             |
| `chat_icon_conv_menu_delete` | 左滑菜单中的删除图标                 |
| `chat_icon_new_chat`         | 会话列表的标题栏“新聊天”图标       |
| `chat_icon_add_contact`      | 会话列表的标题栏的“添加联系人”图标 |
| `chat_icon_create_group`     | 会话列表的标题栏的“创建群组”图标   |

**搜索相关图标**

| 资源名称             | 描述             |
| :-------------- | :----- |
| `chat_icon_search` | 会话列表搜索图标 |

### 常用图片资源

以下图片资源位于 `chatuikit/src/main/resources/base/media/` 目录下，可在 App 模块的 `resources/base/media/` 目录下创建同名 SVG 或 PNG 文件进行覆盖。

| 资源名称                 | 描述           |
| :-------------- | :----- |
| `chat_icon_empty_data` | 会话列表空态图 |
| `avatar_default`       | 默认用户头像   |
| `avatar_group_default` | 默认群组头像   |

### 资源覆盖示例

详见 [消息列表的高级设置](chatuikit_custom_chat_advanced.html#资源覆盖示例)。

### 注意事项

- **图标格式**：覆盖图标时需保持与原资源相同的文件格式（SVG 或 PNG）。
- **命名精确**：文本资源的 `name` 必须与 UIKit 中的资源名称完全一致（区分大小写）。
- **编译生效**：所有资源修改后均需重新编译 App 模块才能生效。
- **增量覆盖**：只需覆盖需要修改的资源，未覆盖的资源将自动使用 UIKit 的默认值。
