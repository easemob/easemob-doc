# 设置会话搜索栏

会话列表页面支持按会话名称搜索会话。你可以设置是否使用搜索栏、自定义搜索栏的样式和自定义搜索逻辑。

<div style="text-align: center">
  <img src=/images/uikit/chatuikit/android/searchbar.png width="1000"/>
</div>

## 设置使用默认搜索栏

- 你可以通过 `showSearchList` 属性控制是否显示搜索栏：

```jsx
<ConversationList
  showSearchList={true} // 显示搜索栏（默认）
/>
```

- 你可以通过全局配置控制是否显示搜索栏：

```jsx
// 在初始化时配置
const features = {
  conversationList: {
    search: true, // 显示搜索栏
  },
};
```

## 自定义搜索栏 UI

通过 `renderSearch` 方法可自定义搜索栏 UI。该方法接收一个包含 `onSearch` 回调的参数对象，将 `onSearch(e)` 绑定到自定义输入框的 `onChange` 事件，组件将按会话 ID 和名称进行默认过滤。

```jsx
<ConversationList
  renderSearch={({ onSearch }) => (
    <div className="custom-search">
      <input
        type="text"
        placeholder="搜索会话"
        onChange={e => onSearch(e)}
      />
    </div>
  )}
/>
```

