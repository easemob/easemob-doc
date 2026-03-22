# 会话列表的基本设置

本文介绍如何配置会话列表相关组件，包括 `ConversationListPage`（完整页面）和 `ConversationListView`（会话列表组件）的基本参数、事件监听及样式自定义。如需实现复杂自定义，例如动态菜单或过滤逻辑，详见 [会话列表高级设置](chatuikit_custom_conversation_list_advanced.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="完整会话列表页面 ConversationListPage" />
  <ImageItem src="/images/uikit/chatuikit/android/conversation_list.png" title="会话列表组件 ConversationListView" />
</ImageGallery>

## 组件选型

单群聊 UIKit 提供两种会话列表组件，可根据实际场景灵活选择：

| 组件                   | 包含内容                        | 适用场景                           |
| :--------------------- | :------------------------------ | :--------------------------------- |
| `ConversationListPage` | 标题栏 + 搜索栏 + 会话列表      | 快速集成完整会话页面的场景。     |
| `ConversationListView` | 搜索栏 + 会话列表（不含标题栏） | 将会话列表嵌入自定义页面的场景。 |

### ConversationListPage 参数列表

`ConversationListPage` 是一个完整的会话列表页面组件，默认包含标题栏、搜索栏和会话列表。

| 参数 | 类型 | 必填 | 描述 | 默认值 |
| :------ | :----- | :------- | :---- | :-----| 
| `pathStack` | NavPathStack | 否 | Navigation 导航栈 | `undefined` |
| `viewModel` | ConvListViewModel | 否 | 会话列表 ViewModel | `ConvListViewModel` |
| `hideTitleBar` | Boolean | 否 | 是否隐藏标题栏 | `false` |
| `hideBackIcon` | Boolean | 否 | 是否隐藏返回按钮 | `true` |
| `onItemClick` | KitCallback&lt;ChatKitConversation&gt;| 否 | 会话点击事件 | 默认跳转到聊天页面 |
| `titleOperationMenus` | MenuItem[] | 否 | 标题栏右侧菜单 | 默认菜单（新建会话、添加联系人、创建群组） |
| `onAvatarClick` | () => void | 否 | 点击头像事件 | - |
| `onBackPress` | () => void | 否 | 点击返回事件 | 默认调用 `pop()` |
| `onSearchClick` | KitCallback | 否 | 搜索栏点击事件 | 默认跳转到搜索页面 |

### ConversationListView 参数列表

`ConversationListView` 是独立的会话列表组件，仅包含搜索栏和会话列表，不包含标题栏，便于灵活嵌入自定义页面。

| 参数 | 类型 | 必填 | 描述 | 默认值 |
| :------ | :----- | :------- | :---- | :-----| 
| `viewModel` | BaseConvListViewModel | 否 | 会话列表 ViewModel | `ConvListViewModel` |
| `itemMenus` | ConvMenuItem[] | 否 | 左滑菜单项 | 默认菜单（置顶、免打扰、删除） |
| `showSearchView` | boolean | 否 | 是否显示搜索栏 | `true` |
| `onItemClick` | KitCallback&lt;ChatKitConversation&gt; | 否 | 会话点击事件 | - |
| `onSearchClick` | KitCallback | 否 | 搜索栏点击事件 | - |
| `searchBuilder` | BuilderParam | 否 | 自定义搜索栏组件 | 默认搜索栏 |
| `emptyDataBuilder` | BuilderParam | 否 | 自定义空数据布局 | 默认空布局 |

## 设置会话列表背景色

根据所选组件类型，可通过以下方式自定义背景色：

- **使用 `ConversationListView`**：在其外层的 `Column` 容器中设置背景色。
- **使用 `ConversationListPage`**：通过外层 `NavDestination` 的 `backgroundColor` 属性设置。

```typescript
// 使用 ConversationListView 时
Column() {
  ConversationListView({
    viewModel: new ConvListViewModel()
  })
}
.height('100%')
.backgroundColor($r('app.color.chat_color_background'))  // 设置背景色

// 使用 ConversationListPage 时
NavDestination() {
  ConversationListPage({ pathStack: this.pathStack })
}
.backgroundColor($r('app.color.chat_color_background'))
```

## 设置会话列表空页面

当会话列表为空时，可通过 `emptyDataBuilder` 自定义空数据布局：

```typescript
@Builder
function customEmptyDataBuilder(onClick?: KitCallback<ClickEvent>) {
  Column() {
    Image($r('app.media.icon_empty_conversation'))
      .width(120)
      .height(120)
    Text('暂无会话')
      .fontSize(16)
      .fontColor('#999999')
      .margin({ top: 16 })
    Button('发起会话')
      .fontSize(14)
      .margin({ top: 24 })
      .onClick((event: ClickEvent) => {
        onClick?.(event);  // 触发点击事件
      })
  }
  .width('100%')
  .height('100%')
  .justifyContent(FlexAlign.Center)
}

ConversationListView({
  viewModel: new ConvListViewModel(),
  emptyDataBuilder: customEmptyDataBuilder
})
```

## 默认会话操作

长按会话条目会显示会话操作菜单。`ConversationListView` 通过 `ConvListViewModel` 提供的方法默认实现了以下操作：

| 会话操作 | 描述 |
| :------- | :--- |
| 会话免打扰 | `muteConversation`：设置是否开启会话免打扰。 |
| 会话置顶 | `pinConversation`：设置置顶/取消置顶会话。 |
| 会话删除 | `deleteConversation`：删除会话。 |

## 事件监听

### 监听会话点击事件

```typescript
import { ConversationListView, ConvListViewModel, ChatKitConversation, ChatPageParams } from '@easemob/chatuikit';

ConversationListView({
  viewModel: new ConvListViewModel(),
  onItemClick: (conversation: ChatKitConversation) => {
    console.log('点击会话:', conversation.conversationId);
    console.log('会话类型:', conversation.type);  // ConversationType.Chat(单聊) 或 ConversationType.GroupChat(群聊)
    console.log('未读数:', conversation.unreadCount);
    console.log('置顶状态:', conversation.isPinned);
    console.log('免打扰状态:', conversation.isMuted);
    
    // 跳转到聊天页面
    this.pathStack?.pushPath({
      name: "ChatPage",
      param: {
        conversationId: conversation.conversationId,
        conversationType: conversation.type
      } as ChatPageParams
    });
  }
})
```

### 监听搜索点击事件

```typescript
ConversationListView({
  viewModel: new ConvListViewModel(),
  onSearchClick: () => {
    console.log('点击搜索');
    // 跳转到搜索页面
    this.pathStack?.pushPath({ name: "SearchConversationPage" });
  }
})
```