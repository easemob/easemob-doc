# 会话列表的基本设置

本文介绍如何对 `ConversationListController` 进行基本设置，包括 UI 样式、侧滑操作及事件监听。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/main_conversation_list.png" title="会话列表页面 ConversationListController.swift" />
</ImageGallery>

## 概述

会话列表的自定义主要通过以下方式实现：
- **Appearance.conversation**: 设置列表的 UI 与样式，如行高、占位图及侧滑菜单。
- **ComponentsRegister**: 继承注册后重载业务逻辑等。

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

添加事件监听：

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
    //   - info：会话信息 ConversationInfo，例如，会话 ID。
    func onConversationLastMessageUpdate(message: ChatMessage,info: ConversationInfo)
    
    // 单个会话未读数发生变化时触发该事件。
    // - unreadCount：单个会话的未读消息数量。
    func onConversationsUnreadCountUpdate(unreadCount: UInt)
}
```

注册监听器：

```Swift
    
        let vc = EaseChatUIKit.ComponentsRegister.shared.ConversationsController.init()
        vc.viewModel?.registerEventsListener(listener: self)
```

## 设置会话列表空页面

会话列表为空时，`ConversationList` 会显示空状态页面。可通过覆盖资源或自定义 `EmptyStateView` 实现自定义样式。
