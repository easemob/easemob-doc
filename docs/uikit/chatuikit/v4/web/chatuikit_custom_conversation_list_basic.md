# 会话列表的基本设置

本文介绍如何通过 `ConversationList` 组件的属性实现会话列表的设置，包括会话列表背景、会话列表空页面和设置会话事件监听。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/custom_conversation_list.png" title="会话列表页面 ConversationList" />
</ImageGallery>

## 基本设置

### 使用示例

`ConversationList` 组件提供了以下属性，方便开发者进行自定义设置：

```jsx
<ConversationList
  className="custom-conversation-list"
  style={{ backgroundColor: '#f5f5f5' }}
  // 自定义渲染 Header
  renderHeader={() => <CustomHeader />}
  // 自定义渲染 Search
  renderSearch={() => <CustomSearch />}
  // 自定义渲染会话条目
  renderItem={(cvs, index) => <CustomConversationItem cvs={cvs} />}
  // Header 的配置
  headerProps={{
    content: '会话',
    back: false,
    moreAction: {
      visible: true,
      actions: [{ content: '清除消息', onClick: () => {} }],
    },
  }}
  // 会话条目的配置
  itemProps={{
    avatarSize: 50,
    avatarShape: 'circle',
    badgeColor: '#ff0000',
    formatDateTime: time => new Date(time).toLocaleString(),
    renderMessageContent: msg => <div>自定义消息内容</div>,
    moreAction: {
      visible: true,
      actions: [{ content: 'DELETE' }, { content: 'PIN' }, { content: 'SILENT' }],
    },
  }}
  // 事件监听
  onItemClick={cvs => {
    console.log('点击会话', cvs);
  }}
  onSearch={e => {
    // 自定义搜索逻辑，返回 false 阻止默认搜索
    return true;
  }}
/>
```

### 属性列表

`ConversationList` 组件提供的主要属性如下表所示：

| 属性 | 类型 | 描述 |
| :-- | :-- | :-- |
| `className` | String | 组件的类名 |
| `style` | `React.CSSProperties` | 组件的内联样式 |
| `renderHeader` | `() => React.ReactNode` | 自定义渲染 Header 组件的方法 |
| `renderSearch` | `() => React.ReactNode` | 自定义渲染 Search 组件的方法 |
| `renderItem` | `(cvs: Conversation, index: number) => React.ReactNode` | 自定义渲染会话条目的方法 |
| `headerProps` | `HeaderProps` | Header 组件的参数 |
| `itemProps` | `Partial<ConversationItemProps>` | `ConversationItem` 组件的参数 |
| `onItemClick` | `(data: Conversation) => void` | 点击会话条目的事件监听器 |
| `onSearch` | `(e: React.ChangeEvent<HTMLInputElement>) => boolean` | 搜索输入框的 `change` 事件，返回 `false` 会阻止默认搜索行为 |
| `showSearchList` | Boolean | 是否显示搜索列表 |
| `includeEmptyConversations` | Boolean | 是否包含空会话 |

### 设置会话列表背景

- 通过 `ConversationList` 组件的 `className` 和 `style` 属性设置会话列表背景：

```jsx
<ConversationList
  className="custom-conversation-list"
  style={{
    backgroundImage: 'url(/path/to/background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
/>
```

- 使用 CSS 类设置会话列表背景：

```css
.custom-conversation-list {
  background-image: url(/path/to/background.jpg);
  background-size: cover;
  background-position: center;
}
```

### 设置会话列表空页面

你可以通过 `renderItem` 属性自定义会话条目的渲染。没有任何会话时，可通过外层容器处理空白状态：

```jsx
<ConversationList
  renderItem={(cvs, index) => {
    if (!cvs) {
      return (
        <div className="empty-conversation">
          <p>暂无会话</p>
        </div>
      );
    }
    return <ConversationItem data={cvs} />;
  }}
/>
```

## 默认会话操作

点击会话右侧的 `⋮️` 显示会话操作。会话列表页面默认实现以下操作：

| 会话操作   | 描述                |
| :--------- | :------------------ |
| 会话免打扰 | 设置/取消会话免打扰。 |
| 会话置顶   | 置顶/取消置顶会话。   |
| 会话删除   | 删除会话。           |

你可以通过 `itemProps.moreAction` 来配置这些操作：

```jsx
<ConversationList
  itemProps={{
    moreAction: {
      visible: true,
      actions: [
        {
          content: 'DELETE', // 删除会话
        },
        {
          content: 'PIN', // 置顶会话
        },
        {
          content: 'SILENT', // 免打扰
        },
        {
          content: '自定义操作',
          onClick: cvs => {
            console.log('自定义操作', cvs);
          },
          icon: <Icon type="STAR" />,
        },
      ],
    },
  }}
/>
```

## 设置事件监听

`ConversationList` 组件提供了针对会话条目的事件监听配置：

```jsx
<ConversationList
  // 点击会话条目事件
  onItemClick={cvs => {
    console.log('点击会话', cvs);
    // 跳转到聊天页面
    navigateToChat(cvs);
  }}
  // 搜索事件
  onSearch={e => {
    const value = e.target.value;
    console.log('搜索内容', value);
    // 返回 false 会阻止默认搜索行为，可以使用自己的搜索逻辑
    // return false;
    return true;
  }}
/>
```

