# 会话列表的基本设置

本文介绍如何对 `ConversationListController` 进行基本设置，包括 UI 样式、侧滑操作及事件监听。如需实现复杂自定义，详见 [会话列表高级设置](chatuikit_custom_conversation_list_advanced.html)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/main_conversation_list.png" title="会话列表页面 ConversationListController.swift" />
</ImageGallery>

## 基本设置

- `ConversationListController` 默认包含标题栏、搜索按钮和会话列表。
- 默认点击会话会进入聊天页面。
- 默认支持左滑和右滑操作菜单。

### 设置方式

会话列表的基础配置主要通过以下能力完成：

| 配置方式 | 用途 | 适用场景 |
| :--- | :--- | :--- |
| `ConversationListController` | 提供默认会话列表页面。 | 需要快速接入完整会话页。 |
| `Appearance.conversation` | 配置列表样式，例如行高、占位图和侧滑菜单。 | 需要调整默认 UI 样式。 |
| `conversationList.addActionHandler(...)` | 监听列表 UI 交互事件。 | 需要处理点击、长按、侧滑等事件。 |
| `viewModel?.registerEventsListener(...)` | 监听业务事件和数据变化。 | 需要监听未读数、最新消息变化或请求结果。 |
| `ComponentsRegister` | 替换 Controller、ViewModel 或 Cell。 | 需要更深度的定制。 |

### 设置基本样式

如果只需要调整默认样式，建议直接使用 `Appearance.conversation`：

```swift
import EaseChatUIKit

Appearance.conversation.rowHeight = 76   // 设置会话条目高度
Appearance.conversation.singlePlaceHolder = UIImage(named: "my_single_avatar")  // 设置单聊默认头像
Appearance.conversation.groupPlaceHolder = UIImage(named: "my_group_avatar")  // 设置群聊默认头像
Appearance.conversation.dateFormatToday = "HH:mm"  // 设置当天显示格式 
Appearance.conversation.dateFormatOtherDay = "MM/dd"  // 设置非当天显示格式
```

这些配置适合放在 `AppDelegate` 或 `SceneDelegate` 中统一设置。

### 设置会话列表空页面

会话列表为空时，`ConversationList` 会显示默认空状态页面。你可以通过以下方式调整空页面：

- 覆盖默认资源，例如空状态图片。
- 自定义 `EmptyStateView`，替换默认空状态视图。

例如，你可以先通过覆盖资源的方式快速修改空状态图片：

```swift
// 将名为 empty 的图片资源添加到 Bundle.main 中，UIKit 会优先使用该图片
```

如果需要更复杂的空状态页面样式或交互，详见 [会话列表的高级配置](chatuikit_custom_conversation_list_advanced.html)。

## 默认会话操作

左滑或右滑会话条目可显示会话操作菜单。单群聊 UIKit 默认支持以下会话管理功能：

| 会话操作            | 描述   |
| :-------------- | :----- | 
| 会话免打扰       | 设置是否接收该会话的推送通知。   |
| 会话置顶            | 置顶或取消置顶会话。     |
| 会话标记已读           | 标记会话为已读，清除未读数。   |
| 会话删除            | 从本地删除会话记录。|

关于配置侧滑菜单按钮，详见 [会话列表的高级配置](chatuikit_custom_conversation_list_advanced.html#设置会话侧滑菜单)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/conversation_slide.png" title="会话操作" />
</ImageGallery>

## 设置事件监听

#### 监听 UI 事件  

实现 `ConversationListActionEventsDelegate` 协议，监听会话列表的 UI 交互事件：

```Swift
@objc public protocol ConversationListActionEventsDelegate: NSObjectProtocol {
    
    // 获取会话列表发生错误时调用，点击空视图中的重试按钮也会触发此方法。
    func onConversationListOccurErrorWhenFetchServer()
    
    // 会话列表滚动结束时调用，用于请求会话昵称和头像数据，然后刷新显示。 
    // - 参数 ids: [conversationId]
    func onConversationListEndScrollNeededDisplayInfos(ids: [String])
    
    // 下拉刷新事件
    func onConversationListRefresh()
    
    // 会话侧滑操作回调
    // - 参数：
    //   - type: `UIContextualActionType`
    //   - info: `ConversationInfo` 对象
    func onConversationSwipe(type: UIContextualActionType, info: ConversationInfo)
    
    // 会话选中回调
    // - 参数：
    //   - indexPath: 选中的会话条目的 `IndexPath`
    //   - info: `ConversationInfo` 对象
    func onConversationDidSelected(indexPath: IndexPath, info: ConversationInfo)
    
    // 会话长按回调
    // - 参数：
    //   - indexPath: 长按的会话条目的 `IndexPath`
    //   - info: `ConversationInfo` 对象
    func onConversationLongPressed(indexPath: IndexPath, info: ConversationInfo)
}
```

添加 UI 事件监听：

```Swift
     //调用下面方法       
    func addActionHandler(actionHandler: ConversationListActionEventsDelegate) {} 
        
```

```Swift
        
        let vc = EaseChatUIKit.ComponentsRegister.shared.ConversationsController.init()
                
        vc.conversationList.addActionHandler(actionHandler: self)
```

#### 监听 ViewModel 事件

实现 `ConversationEmergencyListener` 协议，监听业务处理、最新消息变化及未读数更新：

```Swift
@objc public protocol ConversationEmergencyListener: NSObjectProtocol {
    
    //  会话服务请求成功或失败时触发该事件。
    // - 参数说明如下：
    //   - error：若请求成功，`ChatError` 为 nil。若失败，返回具体原因。
    //   - type: `ConversationEmergencyType`
    func onResult(error: ChatError?,type: ConversationEmergencyType)
    
    // 会话最新一条消息发生变化时触发该事件。
    // - 参数说明如下：
    //   - message：最新一条消息的内容 `ChatMessage`。
    //   - info：会话信息 `ConversationInfo`，例如，会话 ID。
    func onConversationLastMessageUpdate(message: ChatMessage,info: ConversationInfo)
    
    // 单个会话未读数发生变化时触发该事件。
    // - unreadCount：单个会话的未读消息数量。
    func onConversationsUnreadCountUpdate(unreadCount: UInt)
}
```

注册 ViewModel 监听器：

```Swift
    
        let vc = EaseChatUIKit.ComponentsRegister.shared.ConversationsController.init()
        vc.viewModel?.registerEventsListener(listener: self)
```
