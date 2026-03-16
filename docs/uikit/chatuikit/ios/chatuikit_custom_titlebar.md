# 自定义导航栏

会话列表页面、聊天页面、联系人列表页面、群详情页面和联系人详情页面的导航栏均使用 `EaseChatNavigationBar`。会话列表页面的导航栏包含左、中、右三个区域，本节介绍如何配置这些区域。

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/titlebar_conversation_list.png" title="会话列表导航栏" />
  <ImageItem src="/images/uikit/chatuikit/android/title_chat_single_group.png" title="聊天页面导航栏" />
  <ImageItem src="/images/uikit/chatuikit/ios/custom_chat_navigation.png" title="自定义导航栏" />
</ImageGallery>


## 设置导航栏编辑模式

对于导航栏的编辑模式，可设置 `editMode = true`，即隐藏左侧返回按钮和右侧三个按钮，但会显示**取消**按钮。

## 设置背景色

设置导航背景颜色可以通过 `self.navigation.backgroundColor = .red` 实现。导航内部组件也可支持通过该方式修改，不过，切换主题后会切换为主题默认的颜色。

## 设置左侧头像

你可以设置 `hiddenAvatar` 参数确定是否显示导航栏左侧的头像。若修改导航头像，可通过 `self.navigation.avatarURL = "https://xxx.xxx.xxx"` 实现。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/conversation_list_avatar.png" title="会话列表有头像" />
  <ImageItem src="/images/uikit/chatuikit/ios/conversation_list_noavatar.png" title="会话列表无头像" />
</ImageGallery>

## 设置中部标题

对于导航标题内容，可设置 `self.navigation.title = "Chats".chat.localize`，子标题可设置 `self.navigation.subtitle = "xxx"`。若导航的标题和子标题均需修改，需先修改子标题，再修改标题，旨在更新导航中对应的布局位置。

## 设置右侧显示图片

你可以设置 `rightImages` 参数，自定义导航栏右侧按钮的显示图片。**注意按照顺序分别是 0,1,2。**

## 设置点击右侧图片显示的操作

你可以利用 `Appearance.conversation.listMoreActions = value` 设置点击会话列表右上角的 `+` 之后的 `ActionSheet` 的菜单项。你可以增加或删除菜单项，示例代码如下：

```swift
     //新增菜单项
     Appearance.conversation.listMoreActions.append(ActionSheetItem(title: "new list item", type: .destructive, tag: "custom"))
     //删除菜单项
     Appearance.conversation.listMoreActions.removeAll { $0. tag == "you want remove" }
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_list_more1.png" title="更多会话操作" />
</ImageGallery>

## 设置点击监听事件

对于导航点击事件的监听，你需要重载会话列表页面中的 `navigationClick` 方法，然后根据对应的点击区域做对应的处理，示例代码如下：

```swift
    override func navigationClick(type: EaseChatNavigationBarClickEvent, indexPath: IndexPath?) {
        switch type {
        case .back: self.backAction()
        case .avatar: self.avatarAction()
        case .title: self.titleAction()
        case .subtitle: self.subtitleAction()
        case .rightItems: self.rightItemsAction(indexPath: indexPath)
        default:
            break
        }
    }
```

## 完全自定义标题栏

如果会话列表页面的导航栏不满足需求，建议自定义导航栏，重载方法传入自定义的导航类。

1. 在 Demo 中继承 `EaseChatUIKit` 中的 `EaseChatNavigationBar` 类创建自己的会话列表页面导航栏，例如 `CustomConversationNavigationBar`。
2. 重载 `createNavigation()` 方法并返回你使用 `CustomConversationNavigationBar` 创建的对象。示例代码如下：

```swift
    override func createNavigationBar() -> EaseChatNavigationBar {
        CustomConversationNavigationBar(showLeftItem: false,rightImages: [UIImage(named: "add", in: .chatBundle, with: nil,hiddenAvatar: false)])
    }
```

