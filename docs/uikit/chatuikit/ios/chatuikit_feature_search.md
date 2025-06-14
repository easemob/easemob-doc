# 本地消息搜索

本地消息搜索功能允许用户快速在会话内搜索历史消息内容，支持关键词匹配。该功能帮助用户高效找到所需信息，提高工作效率和信息管理的便捷性。

本地消息搜索的 UI 和逻辑结构如下：

- `SearchHistoryMessagesViewController` 为搜索历史消息的页面，用户输入关键词后，将在历史消息中匹配关键词并展示搜索结果。
- `SearchResultMessagesController` 为搜索结果的页面，展示搜索结果的消息列表。
- `SearchHistoryMessageCell`为搜索历史消息的 cell，展示搜索结果的消息列表。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/feature/common/ios/message_search.png" title="本地消息搜索" />
</ImageGallery>

## 如何使用

跳转 `SearchHistoryMessagesViewController` 页面，入参为会话 ID，输入关键词后，将在历史消息中匹配关键词并展示搜索结果。

本地消息搜索特性在联系人详情以及群详情中默认开启，`Appearance.contact.detailExtensionActionItems` 中包含 `ContactListHeaderItem(featureIdentify: "SearchMessages", featureName: "SearchMessages".chat.localize, featureIcon: UIImage(named: "search_history_messages", in: .chatBundle, with: nil))`。如果不想要搜索功能删除此项即可。

示例代码如下：

```swift
    Appearance.contact.detailExtensionActionItems.removeAll { $0.featureIdentify ==  "SearchMessages" }

```