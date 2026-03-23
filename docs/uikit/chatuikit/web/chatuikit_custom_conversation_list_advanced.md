# 会话列表的高级设置

## 概述

你可以通过 `ConversationList` 组件的 `itemProps` 属性进行高级设置，包括会话条目的背景、头像、高度、内容、时间等。

```jsx
<ConversationList
  itemProps={{
    // 设置头像
    avatarSize: 50,
    avatarShape: 'circle', // 或 'square'
    avatar: <CustomAvatar />,
    // 设置未读数气泡颜色
    badgeColor: '#ff0000',
    // 设置时间格式
    formatDateTime: time => new Date(time).toLocaleString(),
    // 自定义消息内容渲染
    renderMessageContent: msg => <div>自定义消息内容</div>,
    // 设置更多操作菜单
    moreAction: {
      visible: true,
      actions: [{ content: 'DELETE' }, { content: 'PIN' }, { content: 'SILENT' }],
    },
  }}
/>
``` 

## 设置会话列表背景

- 方式一：通过 style 属性设置：

```jsx
<ConversationList
  style={{
    backgroundImage: 'url(/path/to/background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
/>
```

- 方式二：通过 CSS 类名设置：

```css
.cui-conversationList {
  background-image: url(/path/to/background.jpg);
  background-size: cover;
  background-position: center;
}
```

## 设置会话条目背景

通过 CSS 类名可以设置会话条目的背景：

```css
// 无操作时的会话条目的背景色
.cui-conversationItem {
  background-color: #fff;
}
// 鼠标悬停会话条目时的背景色
.cui-conversationItem:hover {
  background-color: #f5f5f5;
}
// 选中的会话条目时的背景色
.cui-conversationItem-selected {
  background-color: #e6f5ff;
}
// 置顶的会话条目的背景色
.cui-conversationItem-sticky {
  background-color: #fff9e6;
}
```

## 设置会话条目高度

你可以通过 CSS 设置会话条目的高度：

```css
.cui-conversationItem {
  height: 74px;
  min-height: 74px;
}
```

## 设置会话标题样式

会话条目的标题通常显示会话名称，规则如下：
- 单聊会话：对于单聊, 会话展示的名称为对方昵称，若对方未设置昵称则展示对方的用户 ID，会话头像是对方的头像，如果没有设置则使用默认头像。
- 群聊会话：会话名称为当前群组的名称，头像为默认头像。

你可以通过 CSS 设置会话标题的文字大小和颜色。

```css
.cui-conversationItem-nickname {
  font-size: 16px;
  color: #171a1c;
}
```

## 设置最新消息样式

默认情况下，会话条目的内容区域显示 **最新一条消息摘要**，例如，文字、图片、语音等会转换为对应的摘要文本。

你可以通过 `itemProps.renderMessageContent` 自定义消息内容渲染：

```jsx
<ConversationList
  itemProps={{
    renderMessageContent: msg => {
      if (msg.type === 'txt') {
        return <div>文本消息：{msg.msg}</div>;
      } else if (msg.type === 'img') {
        return <div>[图片]</div>;
      }
      return <div>其他消息</div>;
    },
  }}
/>
```

你可以通过 CSS 调整内容样式，例如，文字大小和颜色：

```css
.cui-conversationItem-message {
  font-size: 14px;
  color: #666;
}
```

## 设置会话时间格式和样式

默认情况下，会话条目的时间区域显示 **最新消息时间**（格式化后的时间字符串）。

1. 你可以通过 `itemProps.formatDateTime` 设置时间格式：

```jsx
<ConversationList
  itemProps={{
    formatDateTime: time => {
      const date = new Date(time);
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleString('zh-CN');
    },
  }}
/>
```

2. 你可以通过 CSS 调整时间样式，例如，文字大小和颜色：

```css
.cui-conversationItem-time {
  font-size: 12px;
  color: #999;
}
```

## 设置会话头像

#### 设置默认头像

会话条目的默认头像由 `Avatar` 组件处理。如果会话数据中没有 `avatarUrl`，则使用默认头像。

#### 设置头像样式

如果要全局设置头像昵称，参见 [GitHub 文档](https://github.com/easemob/easemob-uikit-react/wiki/%E5%A4%B4%E5%83%8F%E6%98%B5%E7%A7%B0)。

你可以通过 `itemProps` 设置头像的大小和形状：

```jsx
<ConversationList
  itemProps={{
    avatarSize: 50, // 头像大小，单位 px
    avatarShape: 'circle', // 头像形状：'circle' | 'square'
    // 或完全自定义头像
    avatar: (
      <Avatar src={customAvatarUrl} size={50} shape="square" style={{ borderRadius: '8px' }} />
    ),
  }}
/>
```

#### 隐藏会话条目头像

你可以通过 `renderItem` 方法自定义渲染，不渲染头像：

```jsx
<ConversationList
  renderItem={(cvs, index) => {
    return (
      <ConversationItem
        data={cvs}
        avatar={null} // 不显示头像
        itemProps={
          {
            // 其他配置...
          }
        }
      />
    );
  }}
/>
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/conversation_list_avatar.png" title="会话列表带头像" />
  <ImageItem src="/images/uikit/chatuikit/web/conversation_list_avatar_no.png" title="会话列表无头像" />
</ImageGallery>

## 设置会话操作

你可以通过 `itemProps.moreAction` 来管理会话操作菜单项：

```jsx
<ConversationList
  itemProps={{
    moreAction: {
      visible: true,
      actions: [
        {
          content: 'DELETE',
          onClick: async cvs => {
            // 自定义删除逻辑
            const confirmed = await showConfirmDialog();
            if (confirmed) {
              // 执行删除
              return true;
            }
            return false;
          },
        },
        {
          content: 'PIN',
          onClick: cvs => {
            // 自定义置顶逻辑
            console.log('置顶会话', cvs);
          },
        },
        {
          content: 'SILENT',
          onClick: cvs => {
            // 自定义免打扰逻辑
            console.log('免打扰会话', cvs);
          },
        },
        {
          content: '自定义操作',
          icon: <Icon type="STAR" />,
          onClick: cvs => {
            console.log('自定义操作', cvs);
          },
        },
      ],
    },
  }}
/>
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/custom_conversation_list_action.png" title="自定义会话操作" />
</ImageGallery>

## 设置消息未读计数图标

会话列表的未读提示支持 **数字** 与 **小蓝点** 两种样式。默认以数字形式显示在会话条目右侧。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_unread.png" title="消息未读计数图标" />
</ImageGallery>

#### 设置计数展示方式

你可以通过 `itemProps.badgeColor` 设置未读数气泡颜色：

```jsx
<ConversationList
  itemProps={{
    badgeColor: '#ff0000', // 未读数气泡颜色
  }}
/>
```

未读数的显示逻辑由 `Badge` 组件控制：

- 当 `unreadCount > 0` 时，显示数字。
- 当 `silent === true` 时，显示小点（dot）。

#### 替换背景与图标

通过 CSS 可以自定义未读数气泡的样式：

```css
.cui-badge {
  /* 未读数气泡样式 */
  background-color: #ff0000;
  color: #fff;
}

.cui-badge-dot {
  /* 未读点样式 */
  background-color: #ff0000;
}
```

#### 隐藏未读图标

你可以通过自定义渲染来隐藏未读图标：

```jsx
<ConversationList
  renderItem={(cvs, index) => {
    return (
      <ConversationItem
        data={{
          ...cvs,
          unreadCount: 0, // 设置为 0 隐藏未读数
        }}
      />
    );
  }}
/>
```

## 完全自定义会话条目

你可以通过 `renderItem` 方法自定义会话条目的渲染：

```jsx
import { ConversationList, ConversationItem } from 'easemob-chat-uikit';

const CustomConversationItem = ({ cvs }) => {
  return (
    <div className="custom-conversation-item">
      <Avatar src={cvs.avatarUrl} />
      <div>
        <div>{cvs.name}</div>
        <div>{cvs.lastMessage?.msg}</div>
      </div>
    </div>
  );
};

<ConversationList
  renderItem={(cvs, index) => {
    return <CustomConversationItem cvs={cvs} />;
  }}
/>;
```

## 可自定义的 CSS 类名

`ConversationList` 提供了以下主要的 CSS 类名，你可以通过覆盖这些类名自定义样式：

| 类名                             | 说明                         |
| :------------------------------- | :--------------------------- |
| `.cui-conversationList`          | 会话列表容器                 |
| `.cui-conversationList-search`   | 搜索栏容器                   |
| `.cui-conversationItem`          | 会话条目                     |
| `.cui-conversationItem-selected` | 选中的会话条目               |
| `.cui-conversationItem-sticky`   | 置顶的会话条目               |
| `.cui-conversationItem-nickname` | 会话名称                     |
| `.cui-conversationItem-message`  | 会话消息内容                 |
| `.cui-conversationItem-time`     | 会话时间                     |
| `.cui-conversationItem-info`     | 会话信息区域（时间和未读数）   |

## ConversationList 属性总览

| 参数 | 类型 | 描述 |
| :-- | :-- | :-- |
| `className` | String | 组件的类名 |
| `prefix` | String | CSS 类名前缀 |
| `style` | `React.CSSProperties` | 组件的内联样式 |
| `headerProps` | `HeaderProps` | `Header` 组件的参数 |
| `itemProps` | `Partial<ConversationItemProps>` | `ConversationItem` 组件的参数 |
| `renderHeader` | `() => React.ReactNode` | 自定义渲染 `Header` 组件的方法 |
| `renderSearch` | `(props: { onSearch: (e: ChangeEvent<HTMLInputElement>) => void }) => React.ReactNode` | 自定义渲染搜索栏；参数中的 `onSearch` 需绑定到输入框的 `onChange` 以触发搜索并更新列表 |
| `renderItem` | `(cvs: Conversation, index: number) => React.ReactNode` | 自定义渲染会话条目的方法 |
| `onItemClick` | `(data: Conversation) => void` | 点击会话列表中每个会话的回调事件 |
| `onSearch` | `(e: React.ChangeEvent<HTMLInputElement>) => boolean` | 搜索输入框的 `change` 事件，当函数返回 `false` 时，会阻止默认的搜索行为 |
| `showSearchList` | Boolean | 是否显示搜索列表 |
| `includeEmptyConversations` | Boolean | 是否包含空会话（会话里消息被撤回或者过期） |
| `presence` | Boolean | 是否显示在线状态 |

## ConversationItem 属性总览

| 参数 | 类型 | 描述 |
| :-- | :-- | :-- |
| `className` | String | 组件的类名 |
| `prefix` | String | CSS 类名前缀 |
| `style` | `React.CSSProperties` | 组件的内联样式 |
| `avatarSize` | `number` | 头像大小，单位 px，默认 50 |
| `avatarShape` | `'circle' \| 'square'` | 头像形状，默认 'circle' |
| `avatar` | `ReactNode` | 自定义头像 |
| `badgeColor` | String | 未读数气泡颜色 |
| `isActive` | Boolean | 是否被选中 |
| `data` | `Conversation` | 会话数据 |
| `renderMessageContent` | `(msg: BaseMessageType) => ReactNode \| undefined` | 自定义渲染消息内容的方法 |
| `formatDateTime` | `(time: number) => string` | 自定义时间格式化方法 |
| `moreAction` | Object | 更多操作菜单配置 |
| `ripple` | Boolean | 是否显示涟漪效果 |

## 主题相关变量

`ConversationList` 组件提供了以下与会话列表页面主题相关的 SCSS 变量。关于如何修改主题，参见 [主题文档](https://github.com/easemob/Easemob-UIKit-web/blob/dev/docs/theme.md)。

```scss
// 会话主题相关变量如下：
$cvs-background: $component-background;
$cvs-search-margin: $margin-xs $margin-sm;
$cvs-item-height: 74px;
$cvs-item-padding: $padding-s;
$cvs-item-border-radius: 16px;
$cvs-item-margin: $margin-xss $margin-xs;
$cvs-item-selected-bg-color: #e6f5ff;
$cvs-item-selected-name-color: $blue-6;
$cvs-item-hover-bg-color: $gray-98;
$cvs-item-active-bg-color: $gray-9;
$cvs-item-info-right: 16px;
$cvs-item-name-margin: 0 $margin-sm;
$cvs-item-name-font-size: $font-size-lg;
$cvs-item-name-font-weight: 500;
$cvs-item-name-color: $title-color;
$cvs-item-message-margin-left: $margin-sm;
$cvs-item-message-font-size: $font-size-base;
$cvs-item-message-font-weight: 400;
$cvs-item-message-color: $font-color;
$cvs-item-time-font-weight: 400;
$cvs-item-time-font-size: $font-size-sm;
$cvs-item-time-color: $gray-5;
$cvs-item-time-margin-bottom: 9px;
```
