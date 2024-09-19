# 自定义群详情页面

你可以配置群详情页面的头部导航栏、点击右侧图片显示的群组操作和群详情自定义列表项等。

![img](/images/uikit/chatuikit/ios/custom_group_details.png =350x750)

## 自定义头部导航栏

群详情页面、联系人列表页面、聊天页面、会话列表页面和联系人详情页面的标题栏均使用 `EaseChatNavigationBar`。如果群详情页面的标题栏不满足需求，建议自定义标题栏，重载方法传入自定义的导航类。关于头部导航栏中的标题、头像、背景色、导航栏右侧按钮的显示图片和左侧的头像，详见[自定义会话列表页面的头部标题栏](custom_conversation_list.html#自定义头部导航栏)。

### 设置点击右侧图片显示的群组操作

群详情页面中右上角按钮 `...` 点击后弹出 `ActionSheet` 菜单中的数据源可配项 `Appearance.contact.moreActions`。你可以增加或删除菜单项，示例代码如下：

```
     //增加菜单项
     Appearance.contact.moreActions.append(ActionSheetItem(title: "new list item", type: .destructive, tag: "contact_custom"))
     //删除菜单项
     Appearance.contact.moreActions.removeAll { $0. tag == "you want remove" }
```

获取该数组中某单个项的点击事件，示例如下所示：

```
        if let item = Appearance.contact.moreActions.first(where: { $0.tag == "xxx" }) {
            item.actionClosure = { [weak self] _ in
                //do something
            }
        }
        if let item = Appearance.contact.moreActions.first(where: { $0.tag == "xxx" }) {
            item.actionClosure = { [weak self] _ in
                //do something
            }
        }
```

## 群详情自定义列表项

群组详情页面 Header 中按钮 `CollectionView` 中数据源可配项 `Appearance.contact.detailExtensionActionItems`，主要功能包括聊天、音视频通话等。关于事件监听，详见[设置点击右侧图片显示的群组操作](#设置点击右侧图片显示的联系人操作)。首先，继承群组详情页面，然后，将继承后的群详情页面注册入 `EaseChatUIKit`，即 `ComponentsRegister.shared.GroupInfoController = MineGroupDetailViewController.self`，增加可配项，示例如下所示： 

```Swift
final class MineGroupDetailViewController: GroupInfoViewController {
    
    override func cleanHistoryMessages() {
        super.cleanHistoryMessages()
        self.showToast(toast: "Clean successful!".localized())
    }

    override func viewDidLoad() {
        Appearance.contact.detailExtensionActionItems = [ContactListHeaderItem(featureIdentify: "Chat", featureName: "Chat".chat.localize, featureIcon: UIImage(named: "chatTo", in: .chatBundle, with: nil)),ContactListHeaderItem(featureIdentify: "AudioCall", featureName: "AudioCall".chat.localize, featureIcon: UIImage(named: "voice_call", in: .chatBundle, with: nil)),ContactListHeaderItem(featureIdentify: "VideoCall", featureName: "VideoCall".chat.localize, featureIcon: UIImage(named: "video_call", in: .chatBundle, with: nil)),ContactListHeaderItem(featureIdentify: "SearchMessages", featureName: "SearchMessages".chat.localize, featureIcon: UIImage(named: "search_history_messages", in: .chatBundle, with: nil))]
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        self.header.status.isHidden = true
    }
    

    override func headerActions() {
        if let chat = Appearance.contact.detailExtensionActionItems.first(where: { $0.featureIdentify == "Chat" }) {
            chat.actionClosure = { [weak self] in
                //do something
            }
        }
        if let search = Appearance.contact.detailExtensionActionItems.first(where: { $0.featureIdentify == "SearchMessages" }) {
            search.actionClosure = { [weak self] in
                //do something
            }
        }
        if let audioCall = Appearance.contact.detailExtensionActionItems.first(where: { $0.featureIdentify == "AudioCall" }) {
            audioCall.actionClosure = { [weak self] in
                //do something
            }
        }
        if let videoCall = Appearance.contact.detailExtensionActionItems.first(where: { $0.featureIdentify == "VideoCall" }) {
            videoCall.actionClosure = { [weak self] in
                //do something
            }
        }
    }
    
    
}
```


 