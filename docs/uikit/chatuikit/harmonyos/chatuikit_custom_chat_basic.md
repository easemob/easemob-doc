# 消息列表的基础设置

本文介绍如何通过 `ChatView` 组件实现消息列表的基础设置，包括背景样式、消息条目、事件监听等功能。

如需实现自定义消息布局、气泡等高级设置，详见 [消息列表高级设置](chatuikit_custom_chat_advanced.html)。


## 概述

`ChatView` 是聊天界面核心组件，通过参数配置实现高度自定义。以下是一个基础配置示例：

```typescript
import { ChatView, ChatType, ChatViewModel, MessageViewModel } from '@easemob/chatuikit';

ChatView({
  conversationId: 'user123',           // 会话 ID
  chatType: ChatType.Chat,             // 会话类型
  pathStack: this.pathStack,           // 导航栈
  viewModel: this.chatViewModel,       // 消息列表 ViewModel
  messageViewModel: this.messageViewModel,  // 消息发送 ViewModel
  extendMenus: this.extendMenus,       // 消息扩展菜单项
  privateMenuModel: this.menuModel,    // 输入菜单控制模型
  onItemClick: this.onItemClick,       // 消息点击事件
  onErrorIconClick: this.onErrorClick, // 发送失败图标点击事件
  onRecordClick: this.onRecordClick,   // 录音按钮点击事件
  messageItemMenusProvider: this.menuProvider  // 消息长按菜单提供者
})
```

`ChatView` 组件支持的主要参数如下表所示：

| 参数     | 类型    | 必填 | 描述           | 默认值     |
| :------- | :------ | :------- | :------ | :------ |
| `conversationId`               | String                                           | 是   | 会话 ID。单聊为对方用户 ID，群聊为群组 ID                       | -                    |
| `chatType`                     | ChatType                                         | 是   | 会话类型：`ChatType.Chat`(单聊)、`ChatType.GroupChat`(群聊) | -                    |
| `pathStack`                    | NavPathStack                                     | 否   | 导航栈，用于内部页面跳转（如发送名片、选择联系人）                  | undefined            |
| `viewModel`                    | BaseChatViewModel                                 | 否   | 消息列表 ViewModel，用于自定义消息加载逻辑                      | ChatViewModel        |
| `messageViewModel`             | BaseMessageViewModel                             | 否   | 消息发送 ViewModel，用于自定义消息发送逻辑                      | MessageViewModel     |
| `extendMenus`                  | MenuItem[]                                       | 否   | 消息扩展菜单项（底部"+"菜单）   | 默认菜单             |
| `privateMenuModel`             | ChatPrimaryMenuModel                             | 否   | 底部输入菜单控制模型          | ChatPrimaryMenuModel |
| `onItemClick`                  | (message: ChatKitMessage) => boolean             | 否   | 消息点击事件   | 默认处理             |
| `onErrorIconClick`             | (message: ChatKitMessage) => void                | 否   | 消息发送失败图标的点击事件                                            | 默认弹出消息重发对话框       |
| `onRecordClick`                | (callback: (isGranted: boolean) => void) => void | 否   | 录音按钮点击事件    | 请求麦克风权限       |
| `onExtendMenuClick`            | (id: string\| number) => void                    | 否   | 消息扩展菜单点击事件     | 默认处理             |
| `messageItemMenusProvider`     | (message: ChatKitMessage) => MessageMenuItem[]   | 否   | 消息长按菜单提供者    | 默认菜单             |
| `mediaTypeSelectDialogOptions` | BottomSheetDialogOptions     | 否   | 媒体类型选择对话框配置     | 默认配置             |
| `editMessageDialogOptions`     | EditMessageBottomSheetDialogOptions   | 否   | 消息编辑对话框配置   | 默认配置             |


## 设置消息列表背景

`ChatView` 组件本身不提供背景色参数。你可以通过为其外层容器设置 `backgroundColor` 来实现背景自定义，支持资源引用或颜色代码两种方式。

- 在导航容器中设置

当 `ChatView` 位于 `NavDestination` 内时，直接为 `NavDestination` 设置背景色：

```typescript
import { ChatView, ChatType } from '@easemob/chatuikit';

NavDestination() {
  Column() {
    ChatView({
      conversationId: 'user123',
      chatType: ChatType.Chat
    })
  }
}
.backgroundColor($r('app.color.chat_color_background'))  // 设置背景色
```

- 在自定义页面中设置

在普通页面容器中，为外层 `Column` 设置背景色：

```typescript
Column() {
  ChatView({
    conversationId: 'user123',
    chatType: ChatType.Chat
  })
}
.height('100%')
.width('100%')
.backgroundColor('#F5F5F5')  // 自定义背景色
```

## 设置消息列表空页面

暂不支持通过 `ChatView` 参数直接设置空页面。如有需要，你可以自定义 `ChatViewModel`，在数据为空时通过自定义布局实现。

## 设置消息条目

你可以对消息条目进行设置，例如：

- 添加自定义消息条目。详见 [聊天页面高级设置](chatuikit_custom_chat_advanced.html#自定义消息布局)。
- 设置头像和昵称。
- 设置消息气泡。
- 设置消息时间。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/message_item.png" title="消息条目 MessageItemView" />
</ImageGallery>

### 设置头像和昵称

暂不支持通过 `ChatView` 参数直接设置头像和昵称的显示和隐藏。你可以通过自定义消息布局实现，详见 [聊天页面高级设置](chatuikit_custom_chat_advanced.html#自定义消息布局)。

关于使用自己的头像和昵称，可以通过 `UserProfileProvider` 提供用户信息，详见 [用户自定义信息文档中的介绍](chatuikit_userinfo.html#用户信息或者群组信息提供)。

### 设置消息气泡

暂不支持通过 `ChatView` 参数直接设置消息气泡背景。

你可以通过 `ChatMessageBubbleProvider` 自定义消息气泡，详见 [消息列表的高级设置](chatuikit_custom_chat_advanced.html#自定义消息气泡)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/message_bubble.png" title="消息气泡" />
</ImageGallery>

### 设置消息时间

你可以设置消息的发送和接收时间的格式和样式。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/message_time.png" title="消息时间" />
</ImageGallery>

#### 设置消息时间格式

暂不支持通过 `ChatUIKitConfigs` 自定义消息时间格式。当前格式由系统根据国际化标准自动处理：
- **当天**：显示具体时间，例如 `16:28`。
- **今年**：显示月日+时间，例如 `2月10日 16:28`。
- **其他年份**：显示年月日+时间，例如 `2025年2月10日 16:28`。

如需自定义时间格式，请使用自定义消息布局并调用 `DateUtil.formatDate()` 等方法实现，详见 [消息列表的高级设置](chatuikit_custom_chat_advanced.html#实现自定义消息条目)。

#### 设置消息时间样式

暂不支持通过 `ChatView` 参数直接设置消息时间的颜色、大小和背景。

如需修改，可通过自定义消息布局实现，详见 [消息列表的高级设置](chatuikit_custom_chat_advanced.html#实现自定义气泡)。

## 设置消息事件监听

通过 `ChatView` 提供的事件回调，你可以处理用户在消息列表上的各种交互。

### 消息点击事件

通过 `onItemClick` 监听消息点击事件，返回值控制是否拦截默认行为：  

```typescript
import { ChatView, ChatKitMessage, ChatType } from '@easemob/chatuikit';

ChatView({
  conversationId: this.conversationId,
  chatType: this.chatType,
  onItemClick: (message: ChatKitMessage) => {
    console.log('点击消息:', message.messageId);
    // 返回 true: 拦截，完全自定义处理
    // 返回 false: 不拦截，执行默认行为
    return false;
  }
})
```

**默认点击行为**：

| 消息类型            | 默认行为  | 
| :-------------- | :----- | 
| 图片消息           | 打开大图预览对话框。   |
| 视频消息           | 打开视频播放对话框。    |
| 文件消息           | 打开文件下载/查看对话框。   |
| 语音消息           | 播放/停止播放语音。   |
| 文本消息           | 无。   |
| 名片消息           | 返回 `true` 阻止点击，需你自行实现跳转。   |

### 发送失败点击事件

监听红色失败图标的点击，实现自定义重发逻辑：

```typescript
import { ChatView, ChatKitMessage, ChatType, AlertDialog } from '@easemob/chatuikit';

ChatView({
  conversationId: this.conversationId,
  chatType: this.chatType,
  onErrorIconClick: (message: ChatKitMessage) => {
    // 自定义失败处理逻辑
    AlertDialog.show(this.getUIContext(), {
      title: {
        content: '重新发送'
      },
      content: {
        content: '是否重新发送此消息?'
      },
      cornerRadius: $r('app.float.corner_radius_small_extra'),
      alignment: DialogAlignment.Center,
      cancelButton: {
        content: '取消'
      },
      confirmButton: {
        content: '确定'
      },
      onAction: (action: number, content: string) => {
        if (action === 1) {
          // 调用重发逻辑
          this.messageViewModel.resendMessage(message.origin);
        }
      }
    });
  }
})
```

**默认行为**：点击消息发送失败图标显示确认对话框，确定后重新发送消息。

### 录音按钮点击事件

监听底部输入栏录音按钮的点击，在此处理麦克风权限申请。

```typescript
import { ChatView, ChatType, PermissionManager } from '@easemob/chatuikit';

ChatView({
  conversationId: this.conversationId,
  chatType: this.chatType,
  onRecordClick: (callback: (isPermissionGranted: boolean) => void) => {
    // 请求麦克风权限
    PermissionManager.requestPermissions(
      getContext(), 
      ['ohos.permission.MICROPHONE']
    ).then((result) => {
      // 回调权限结果
      callback(result.authResults[0] === 0);
    });
  }
})
```

**默认行为**：自动请求麦克风权限，并将结果回调给 `ChatView`。

### 扩展菜单点击事件

监听底部输入栏（"+"按钮）中菜单项的点击事件，用于自定义行为或埋点。

```typescript
import { ChatView, ChatType, KitConstants } from '@easemob/chatuikit';

ChatView({
  conversationId: this.conversationId,
  chatType: this.chatType,
  onExtendMenuClick: (id: string | number) => {
    console.log('点击了扩展菜单:', id);
    
    // 处理默认菜单项
    if (id === KitConstants.EXTEND_ACTION_CAMERA) {
      // 自定义点击相机逻辑
      console.log('相机');
    } else if (id === KitConstants.EXTEND_ACTION_IMAGE) {
      // 自定义点击相册逻辑
      console.log('相册');
    } else if (id === KitConstants.EXTEND_ACTION_FILE) {
      // 自定义点击文件逻辑
      console.log('文件');
    } else if (id === KitConstants.EXTEND_ACTION_USER) {
      // 自定义点击名片逻辑
      console.log('名片');
    }
    
  }
})
```

**各菜单项默认行为**：

| 菜单项           | 默认点击行为   | 
| :-------------- | :----- | 
| 拍照 (`KitConstants.EXTEND_ACTION_CAMERA`)         | 弹出对话框，选择拍照或录像。   |
| 相册 (`KitConstants.EXTEND_ACTION_IMAGE`)          | 打开系统图片/视频选择器。   |
| 文件 (`KitConstants.EXTEND_ACTION_FILE`)          | 打开系统文件选择器。   |
| 名片 (`KitConstants.EXTEND_ACTION_USER`)          | 跳转到联系人选择页面（需传入 `pathStack`）。   |

:::tip
如需增删改扩展菜单项，详见 [自定义消息扩展菜单](chatuikit_custom_chat_inputmenu.html#自定义扩展菜单项)。
:::

## 设置消息发送回调

通过自定义 `MessageViewModel` 并重写其方法，可以在消息发送的不同生命周期（如发送前、成功后、失败后）执行自定义逻辑。

```typescript
import { BaseMessageViewModel, MessageViewModel, ChatMessage, ChatType, ChatError } from '@easemob/chatuikit';

class MyMessageViewModel extends MessageViewModel {
  constructor(conversationId: string, chatType: ChatType) {
    super(conversationId, chatType);
  
    // 设置回调属性
    this.onMessageSent = (message: ChatMessage) => {
      console.log('消息发送成功:', message.getMsgId());
      // 自定义逻辑（如统计、日志上报等）
    };
  
    this.onMessageSendFailed = (messageId: string, error: ChatError) => {
      console.error('消息发送失败:', messageId, error);
      // 自定义错误处理
    };
  }

  // 重写发送前的方法
  willSendMessage(message: ChatMessage): void {
    console.log('即将发送消息:', message.getMsgId());
  
    // 添加自定义扩展字段
    let ext = message.ext();
    ext.set('customField', 'customValue');
    message.setExt(ext);
  
    super.willSendMessage(message);
  }
}

// 使用自定义 MessageViewModel
ChatView({
  conversationId: 'user123',
  chatType: ChatType.Chat,
  messageViewModel: new MyMessageViewModel('user123', ChatType.Chat)
})
```

## 其他设置

- **自定义 ViewModel**：实现复杂的消息加载、排序逻辑等，详见 [消息列表高级设置](chatuikit_custom_chat_advanced.html#自定义-viewmodel)。
- **自定义对话框**：修改媒体选择、消息编辑等对话框样式，详见 [消息列表高级设置](chatuikit_custom_chat_advanced.html#对话框自定义)。