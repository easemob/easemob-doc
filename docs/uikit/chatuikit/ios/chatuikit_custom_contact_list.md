# 自定义联系人列表

你可以自定义联系人列表页面的头部导航栏、联系人列表 Header、联系人列表和联系人列表项。

![img](/images/uikit/chatuikit/ios/chatuikit_custom_contact_list.png)

## 自定义头部导航栏

联系人列表页面、聊天页面、会话列表页面、群详情页面和联系人详情页面的标题栏均使用 `EaseChatNavigationBar`。如果联系人列表页面（`ContactViewController.swift`）的标题栏不满足需求，建议自定义标题栏，重载方法传入自定义的导航类。关于头部导航栏中的标题、头像、背景色、导航栏右侧按钮的显示图片和左侧的头像，详见[自定义会话列表页面的头部标题栏](chatuikit_custom_conversation_list.html#自定义头部导航栏)。

## 自定义联系人列表 Header 

### 设置联系人列表 Header List 数据源

你可以通过 `Appearance.contact.listHeaderExtensionActions = value` 设置联系人列表 Header List 数据源。
   
下面的示例代码展示如何增加或删减数据项：

```Swift
     //增加数据项
     Appearance.contact.listHeaderExtensionActions.append(ContactListHeaderItem(featureIdentify: "New", featureName: "NewFeature", featureIcon: UIImage(named: "NewFeature")))
     //删减数据项
     Appearance.contact.listHeaderExtensionActions.removeAll { $0.featureIdentify == "you want remove" }
```

获取该数组中某单个项的点击事件，示例如下：

```Swift
        if let item = Appearance.contact.listHeaderExtensionActions.first(where: { $0.featureIdentify == "NewFriendRequest" }) {
            item.actionClosure = { [weak self] _ in
                //do something
            }
        }
        if let item = Appearance.contact.listHeaderExtensionActions.first(where: { $0.featureIdentify == "GroupChats" }) {
            item.actionClosure = { [weak self] _ in
                //do something
            }
        }
```

![img](/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_listHeaderExtensionActions.png)

### 设置联系人列表 Header Cell 的高度

你可以通过 `Appearance.contact.headerRowHeight = value` 设置联系人列表 Header Cell 的高度。

![img](/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_headerRowHeight.png)

## 自定义联系人列表

自定义联系人列表 TableView，需要重载联系人列表页面中的 `createContactList` 方法后，返回你继承 `EaseChatUIKit` 中 `ContactView` 后的类对象。关于在导航栏中实现业务逻辑，详见 `ContactView.swift` 类。示例代码如下：

```Swift
    override open func createContactList() -> ContactView {
        CustomContactView(frame: CGRect(x: 0, y: self.search.frame.maxY+5, width: self.view.frame.width, height: self.view.frame.height-NavigationHeight-BottomBarHeight-(self.tabBarController?.tabBar.frame.height ?? 49)), style: .plain)
    }
```

## 自定义联系人列表项

要自定义联系人列表中列表项 `ContactCell` 的内容，你需要执行以下步骤：

1. 继承 `EaseChatUIKit` 中的 `ContactCell` 类创建新的自定义类 `CustomContactCell`，然后进行如下代码设置：

```Swift
    ComponentsRegister.shared.ContactsCell = CustomContactCell.self
```

2. 在 `CustomContactCell` 类中，重载对应可以重载的方法。
   
   如果需要复用已有逻辑再增加新逻辑，则只需重载对应方法后调用 `super.xxx`，例如：

```Swift
    override open func refresh(profile: EaseProfileProtocol) {
       super.refresh(profile: profile)
       //继续你的新逻辑
    }
```

若要修改之前的逻辑，则需复制之前的 `refresh` 方法的代码进行修改，无需调用 `super.xxxx`。初始化方法以及部分 UI 创建的方法均可以重载。

### 设置联系人列表 Cell 的高度

你可以通过 `Appearance.contact.rowHeight = value` 设置联系人列表项（Cell）的高度。

![img](/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_rowHeight.png)

### 设置联系人头像

你可以通过 `Appearance.avatarRadius = value` 设置联系人头像圆角，分为极小、小、中、大等四个等级。

## 拦截原有组件点击事件

拦截后的业务逻辑与 UI 刷新逻辑，你需要自己完全实现，建议使用注册继承即可更快速的实现需求。

联系人列表事件如下所示：

- `didSelectedContact`：点击联系人。

- `groupWithSelected`：点击添加群成员或者创建群组选择成员。

## 联系人列表页面其他设置

1. 其他标记为 open 的方法均为可重载方法。如有需要，可重载对应方法实现自己业务逻辑。

2. 关于联系人列表页面的其他配置，包括按钮、输入框等空间的色调以及弹窗的设置，详见[通用可配项文档](chatuikit_config_item.html)。

