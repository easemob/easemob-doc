# 设置会话列表页面

你可以配置会话列表页面的头部导航栏、会话列表项。详见 [ConversationListController.swift](https://github.com/easemob/easemob-uikit-ios/blob/main/Sources/EaseChatUIKit/Classes/UI/Components/Conversation/Controllers/ConversationListController.swift)。

![img](/images/uikit/chatuikit/ios/custom_conversation_list.png)

## 自定义导航栏

会话列表页面、聊天页面、联系人列表页面、群详情页面和联系人详情页面的导航栏均使用 `EaseChatNavigationBar`。如果会话列表页面的标题栏不满足需求，建议自定义导航栏，重载方法传入自定义的导航类。

1. 在 Demo 中继承 `EaseChatUIKit` 中的 `EaseChatNavigationBar` 类创建自己的会话列表页面导航栏，例如 `CustomConversationNavigationBar`。
2. 重载 `createNavigation()` 方法并返回你使用 `CustomConversationNavigationBar` 创建的对象。示例代码如下：

```Swift
    override func createNavigationBar() -> EaseChatNavigationBar {
        CustomConversationNavigationBar(showLeftItem: false,rightImages: [UIImage(named: "add", in: .chatBundle, with: nil,hiddenAvatar: false)])
    }
```

会话列表页面的头部导航栏包含左、中、右三个区域，本节介绍如何配置这些区域。

### 设置导航栏编辑模式

对于导航栏的编辑模式，可设置 `editMode = true`，即隐藏左侧返回按钮和右侧三个按钮，但会显示**取消**按钮。

### 设置背景色

设置导航背景颜色可以通过 `self.navigation.backgroundColor = .red` 实现。导航内部组件也可支持通过该方式修改，不过，切换主题后会切换为主题默认的颜色。

### 设置左侧头像

你可以设置 `hiddenAvatar` 参数确定是否显示导航栏左侧的头像。若修改导航头像，可通过 `self.navigation.avatarURL = "https://xxx.xxx.xxx"` 实现。

### 设置中部标题

对于导航标题内容，可设置 `self.navigation.title = "Chats".chat.localize`，子标题可设置 `self.navigation.subtitle = "xxx"`。若导航的标题和子标题均需修改，需先修改子标题，再修改标题，旨在更新导航中对应的布局位置。

### 设置右侧显示图片

你可以设置 `rightImages` 参数，自定义导航栏右侧按钮的显示图片。**注意按照顺序分别是 0,1,2。**

### 设置点击右侧图片显示的操作

你可以利用 `Appearance.conversation.listMoreActions = value` 设置点击会话列表右上角的 `+` 之后的 `ActionSheet` 的菜单项。你可以增加或删除菜单项，示例代码如下：

```Swift
     //新增菜单项
     Appearance.conversation.listMoreActions.append(ActionSheetItem(title: "new list item", type: .destructive, tag: "custom"))
     //删除菜单项
     Appearance.conversation.listMoreActions.removeAll { $0. tag == "you want remove" }
```
![img](/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_list_more.png)

### 设置点击监听事件

对于导航点击事件的监听，你需要重载会话列表页面中的 `navigationClick` 方法，然后根据对应的点击区域做对应的处理，示例代码如下：

```Swift
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

## 自定义会话列表

自定义会话列表 TableView，需要重载会话列表页面中的 `createList` 方法后，返回你继承 `EaseChatUIKit` 中 `ConversationList` 后的类对象。关于在导航栏中实现业务逻辑，详见 `ConversationList.swift` 类。示例代码如下：

```Swift
    override open func createList() -> ConversationList {
        CustomConversationList(frame: CGRect(x: 0, y: self.search.frame.maxY+5, width: self.view.frame.width, height: self.view.frame.height-NavigationHeight-BottomBarHeight-(self.tabBarController?.tabBar.frame.height ?? 49)), style: .plain)
    }
```

## 设置会话列表项

要自定义会话列表中列表项的内容，你需要执行以下步骤：

1. 继承 `EaseChatUIKit` 中的 `ConversationCell` 类创建新的自定义类 `CustomConversationCell`，然后进行如下代码设置：

```Swift
    ComponentsRegister.shared.ConversationCell = CustomConversationCell.self
```

2. 在 `CustomConversationCell` 类中，重载对应可以重载的方法。

   如果需要复用已有逻辑再增加新逻辑，则只需重载对应方法后调用 `super.xxx`，例如：

```Swift
    override open func refresh(info: ConversationInfo) {
       super.refresh(info:info)
       //继续你的新逻辑即可
    }
```

若要修改之前的逻辑，则需复制之前的 `refresh` 方法的代码进行修改，无需调用 `super.xxxx`。初始化方法以及部分 UI 创建的方法均可以重载。

### 设置会话列表项的高度

你可以利用 `Appearance.conversation.rowHeight = value` 设置会话列表项（会话列表  Cell）的高度。

![img](/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_rowHeight.png)

### 设置会话头像

1. 设置会话头像圆角：

头像圆角，分为极小、小、中、大等四个等级。你可以利用 `Appearance.avatarRadius = value` 设置头像圆角。

2. 设置会话头像占位图：

你可以利用 `Appearance.conversation.singlePlaceHolder = value` 设置会话列表中单聊会话头像占位图和群聊会话头像占位图。

![img](/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_placeHolder.png)

### 设置会话列表项左滑和右滑菜单项

你可以利用 `Appearance.conversation.swipeLeftActions = value`/`Appearance.conversation.swipeRightActions = value` 设置会话列表项的左滑和右滑菜单项。

默认情况下，左滑菜单项包括禁言、置顶会话和删除会话，右滑菜单包括会话已读和唤起更多菜单 `ActionSheet`。因为是枚举数组，只支持删减菜单项，不能新增。 

```Swift
     //Remove
     Appearance.conversation.swipeLeftActions.removeAll { $0 == .more }
```

![img](/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_swipeLeftActions.png)

### 设置更多会话操作

你可以利用 `Appearance.conversation.moreActions = value` 设置右滑会话后出现的 `...` 菜单项点击后的 `ActionSheet` 的菜单项。你可以添加或删减菜单项，示例代码如下：

```Swift
     //添加菜单项
     Appearance.conversation.moreActions.append(ActionSheetItem(title: "new list item", type: .destructive, tag: "custom"))
     //删减菜单项
     Appearance.conversation.moreActions.removeAll { $0. tag == "you want remove" }
```

获取该数组中某一项的点击事件，示例代码如下：

```Swift
        if let item = Appearance.conversation.listMoreActions.first(where: { $0.tag == "xxx" }) {
            item.actionClosure = { [weak self] _ in
                //do something
            }
        }
        if let item = Appearance.conversation.listMoreActions.first(where: { $0.tag == "xxx" }) {
            item.actionClosure = { [weak self] _ in
                //do something
            }
        }
```

![img](/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_swipe_right_more.png)

### 设置会话时间

你可以利用以下两个参数设置会话时间：

- `Appearance.conversation.dateFormatToday = value`：设置当日的会话时间，格式为“小时：分钟”，即 "HH:mm"。
- `Appearance.conversation.dateFormatOtherDay = value`：设置当日之外的日期，格式为 "MM/dd"。

![img](/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_dateFormat.png)

## 拦截原有组件点击事件

拦截后的业务逻辑与 UI 刷新逻辑，你需要自己完全实现，建议使用注册继承即可更快速的实现需求。

会话列表事件如下所示：

- `swipeAction`：滑动事件。

- `longPressed`：长按事件。

- `didSelected`：点击事件。

以下示例代码为会话长按事件：

```Swift    
ComponentViewsActionHooker.shared.conversation.longPressed = { [weak self] indexPath,info in 
    //Process you business logic.
}
```

## 会话列表页面其他设置

1. 其他标记为 open 的方法均为可重载方法。如有需要，可重载对应方法实现自己业务逻辑。

2. 关于会话列表页面的其他配置，包括按钮、输入框等空间的色调以及弹窗的设置，详见[通用可配项文档](chatuikit_config_item.html)。