# 设置会话搜索栏

会话列表页面支持按会话名称搜索会话。你可以设置是否使用搜索栏、自定义搜索栏的样式和自定义跳转路由。

// TODO：添加会话搜索栏图片

## 设置使用默认搜索栏

你可以设置是否使用默认搜索栏：

```kotlin
// true：使用；(默认) false: 不使用。 
ChatUIKitConversationListFragment.Builder().useSearchBar(true)   
```

## 自定义跳转路由

搜索栏点击后默认跳转 `ChatUIKitSearchActivity` 搜索页面。如果默认的搜索无法满足用户需求，可以通过 `setCustomActivityRoute` 修改跳转路由，跳转自己的搜索页面。

```kotlin
ChatUIKitClient.setCustomActivityRoute(object : ChatUIKitCustomActivityRoute {
    override fun getActivityRoute(intent: Intent): Intent? {
        intent.component?.className?.let {
             when(it) {
                ChatUIKitSearchActivity::class.java.name -> {   
                    intent.setClass(context, MySearchActivity::class.java)    
                }
                else -> {
                    return intent
                }
             }
        }
    }
})
```

## 可重载方法标记

其他标记为 open / override fun 的方法均为可重载方法。如有需要，可重载对应方法实现自己业务逻辑。