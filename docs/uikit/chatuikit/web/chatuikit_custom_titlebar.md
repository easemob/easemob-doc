# 设置标题栏

`Header` 是可自定义的标题栏组件，支持显示头像、状态图标、标题、副标题、导航按钮和菜单等多种元素。聊天页面、会话列表页面、联系人列表页面、群详情页面和联系人详情页面的标题栏均使用 `Header`。你可以根据自身需求设置标题栏。

1. 单聊聊天页面的标题栏（绿点表示对端用户在线）如下图所示：

```
┌──────────────────────────────────────────────────┐
│ ← │ 👤🟢 │ 张三                         ⋮        │
│   │       │ 在线                                 │
└──────────────────────────────────────────────────┘
  ↑   ↑     ↑                              ↑
  │   │     └─ 标题 + 副标题                └─ 菜单
  │   └────── 头像
  └────────── 导航（返回）按钮
```


2. 群聊页面的标题栏如下图所示：

```
┌──────────────────────────────────────────────────┐
│ ← │ 👥  │ 开发组                      ⋮           │
└──────────────────────────────────────────────────┘
    
```


## 设置标题栏属性

聊天页面的标题栏使用 `Header` 组件，你可以通过 `Chat` 组件的 `headerProps` 进行自定义设置。

以下示例代码以聊天页面为例：

```jsx
<Chat
  headerProps={{
    // 标题内容
    content: '聊天标题',
    // 副标题
    subtitle: '在线',
    // 设置头像
    avatar: <img src="https://example.com/avatar.jpg" />, 
    // 头像地址
    avatarSrc: 'https://example.com/avatar.jpg',
    // 头像形状：'circle' | 'square'
    avatarShape: 'circle',
    // 是否显示返回按钮
    back: true,
    // 返回按钮点击事件
    onClickBack: () => {
      console.log('点击返回');
    },
    // 右侧自定义图标
    suffixIcon: [<Icon type="PIN" key="pin" />, <Icon type="VIDEO_CAMERA" key="video" />],
    // 更多操作菜单
    moreAction: {
      visible: true,
      actions: [
        {
          content: '清除消息',
          onClick: () => {
            console.log('清除消息');
          },
        },
        {
          content: '删除会话',
          onClick: () => {
            console.log('删除会话');
          },
        },
      ],
    },
    // 自定义渲染中间内容部分
    renderContent: () => {
      return <div>自定义标题内容</div>;
    },
    onClickAvatar: () => {
      // 点击头像事件
    },
    style={{
      background: '#ccc' // 设置背景颜色
    }}
  }}
/>
```

## 自定义渲染标题栏

### 自定义渲染会话列表页面标题栏

你也可以通过 `renderHeader` 完全自定义会话列表页面的标题栏：

```jsx
<ConversationList
  renderHeader={() => {
    return (
      <div className="custom-header">
        <div>会话列表</div>
        <div>自定义标题栏内容</div>
      </div>
    );
  }}
/>
```

### 自定义渲染聊天页面标题栏

你也可以通过 `renderHeader` 完全自定义聊天页面的标题栏：

```jsx
<Chat
  renderHeader={cvs => {
    return (
      <div className="custom-header">
        <div>{cvs.name || cvs.conversationId}</div>
        <div>自定义标题栏内容</div>
      </div>
    );
  }}
/>
```