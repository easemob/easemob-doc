# 本地搜索

本地搜索功能允许用户快速根据类型搜索，包括搜索联系人（带有或无选择框）、会话、历史消息和黑名单，支持关键词匹配。该功能帮助用户高效找到所需信息，提高工作效率和信息管理的便捷性。

UIKit 提供封装的 `ChatUIKitSearchActivity` 搜索页面，用户根据 `ChatUIKitSearchType` 和输入关键词后，将根据 `ChatUIKitSearchType` 类型搜索数据展示搜索结果。

同时，UIKit 也提供搜索基类 `ChatUIKitBaseSearchFragment`，用户可以更好地继承扩展实现。`ChatUIKitBaseSearchFragment` 中的 `initAdapter()` 抽象方法实现自己的 adapter，进行数据处理和展示。

例如，以下为搜索消息的页面。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/android/message_search.png" title="本地消息搜索" />
</ImageGallery>

## 如何使用

跳转 `ChatUIKitSearchActivity` 页面，根据自己需要搜索的类型（`ChatUIKitSearchType：USER、SELECT_USER、CONVERSATION、MESSAGE、BLOCK_USER`）传入需要的参数，将匹配关键词并展示搜索结果。

例如，搜索黑名单的示例代码如下 ：

```kotlin
    
    private val returnSearchClickResult: ActivityResultLauncher<Intent> = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result -> onClickResult(result) }

    returnSearchClickResult.launch(
        ChatUIKitSearchActivity.createIntent(
            context = mContext,
            searchType = ChatUIKitSearchType.BLOCK_USER
        )
    )
    private fun onClickResult(result: ActivityResult) {
        if (result.resultCode == Activity.RESULT_OK) {
            result.data?.getSerializableExtra("user")?.let {
                if (it is ChatUIKitUser) {
                    // it 为搜索结果 
                }
            }
        }
    }

```