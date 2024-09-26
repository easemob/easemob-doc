# 设置联系人详情页面

你可以配置联系人详情页面的头部导航栏、点击右侧图片显示的联系人操作和联系人详情自定义列表项等。详见 [ContactInfoViewController](https://github.com/easemob/easemob-uikit-ios/tree/main/Documentation/EaseChatUIKit.doccarchive/documentation/easechatuikit/contactinfoviewcontroller)。

![img](/images/uikit/chatuikit/ios/custom_contact_details.png)

## 自定义导航栏

联系人详情页面、聊天页面、会话列表页面、联系人列表页面和群详情页面的导航栏均使用 `EaseChatNavigationBar`。如果联系人详情页面的导航栏不满足需求，建议自定义导航栏，重载方法传入自定义的导航类。关于导航栏中的标题、头像、背景色、导航栏右侧按钮的显示图片和左侧的头像，详见[自定义会话列表页面的导航栏](chatuikit_custom_conversation_list.html#自定义头部导航栏)。

### 设置点击右侧图片显示的联系人操作

联系人详情页面中右上角按钮 `...` 点击后弹出 `ActionSheet` 菜单中的数据源可配项`Appearance.contact.moreActions`。你可以增加或删除菜单项，示例代码如下：

```Swift
     //增加菜单项
     Appearance.contact.moreActions.append(ActionSheetItem(title: "new list item", type: .destructive, tag: "contact_custom"))
     //删除菜单项
     Appearance.contact.moreActions.removeAll { $0. tag == "you want remove" }
```

获取该数组中某单个项的点击事件，示例如下：

```Swift
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

## 自定义按钮

联系人详情页面 Header 中按钮 `CollectionView` 中数据源可配项 `Appearance.contact.detailExtensionActionItems`，主要功能包括聊天、音视频通话等。关于事件监听，详见[设置点击右侧图片显示的联系人操作](#设置点击右侧图片显示的联系人操作)。首先继承联系人详情页面，然后将继承后的群详情页面注册入 `EaseChatUIKit`，即 `ComponentsRegister.shared.ContactInfoController = MineContactDetailViewController.self`，增加可配项，示例如下所示： 

```Swift
final class MineContactDetailViewController: ContactInfoViewController {
    
    override func createHeader() -> DetailInfoHeader {
        super.createHeader()
    }
    
    override func dataSource() -> [DetailInfo] {
        let json: [String : Any] = ["title":"contact_details_button_remark".localized(),"detail":"","withSwitch": false,"switchValue":false]
        let info = self.dictionaryMapToInfo(json: json)
        var infos = super.dataSource()
        infos.insert(info, at: 0)
        return infos
    }

    override func viewDidLoad() {
        Appearance.contact.detailExtensionActionItems = [
            ContactListHeaderItem(featureIdentify: "Chat", featureName: "Chat".chat.localize, featureIcon: UIImage(named: "chatTo", in: .chatBundle, with: nil)),
            ContactListHeaderItem(featureIdentify: "AudioCall", featureName: "AudioCall".chat.localize, featureIcon: UIImage(named: "voice_call", in: .chatBundle, with: nil)),
            ContactListHeaderItem(featureIdentify: "VideoCall", featureName: "VideoCall".chat.localize, featureIcon: UIImage(named: "video_call", in: .chatBundle, with: nil)),
            ContactListHeaderItem(featureIdentify: "SearchMessages", featureName: "SearchMessages".chat.localize, featureIcon: UIImage(named: "search_history_messages", in: .chatBundle, with: nil))
        ]
        super.viewDidLoad()
        self.requestInfo()
        self.header.status.isHidden = true
        // Do any additional setup after loading the view.
    }
    
    
}
```


 