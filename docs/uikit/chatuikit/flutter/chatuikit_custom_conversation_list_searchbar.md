# 设置会话搜索栏

会话列表页面支持按会话名称搜索会话。你可以设置是否使用搜索栏、自定义搜索栏的样式和自定义跳转路由。

// TODO：添加会话搜索栏图片

## 设置使用默认搜索栏

你可以设置是否使用默认搜索栏：

```dart
ConversationsView(
  enableSearchBar: true, // true：使用；(默认) false: 不使用。
  searchBarHideText: '搜索', // 搜索栏占位文本
)
```

## 自定义跳转路由

搜索栏点击后默认跳转 `SearchView` 搜索页面。如果默认的搜索无法满足用户需求，可以通过 `onSearchTap` 修改跳转路由，跳转自己的搜索页面。

```dart
ConversationsView(
  enableSearchBar: true,
  onSearchTap: (List<ConversationItemModel> data) {
    // 自定义搜索页面跳转
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => MySearchPage(
          conversations: data,
        ),
      ),
    );
  },
)
```

## 添加自定义搜索栏

你可以通过自定义 `beforeWidgets` 或 `afterWidgets` 添加自定义搜索栏：

```dart
ConversationsView(
  enableSearchBar: false, // 禁用默认搜索栏
  beforeWidgets: [
    // 自定义搜索栏
    Container(
      padding: EdgeInsets.all(16),
      child: TextField(
        decoration: InputDecoration(
          hintText: '搜索会话',
          prefixIcon: Icon(Icons.search),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        onTap: () {
          // 处理搜索
        },
      ),
    ),
  ],
)
```
