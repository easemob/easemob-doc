# 自定义

你可以对 ChatroomUIKit 中的一些控件进行自定义，添加自己的业务逻辑，实现个性化业务需求。

## 支持自定义的控件

目前，现有组件中的以下控件支持自定义：

- `GiftBarrageCell`：礼物弹幕列表 Cell 类。

![img](@static/images/uikit/chatroomios/GiftBarrageCell.png)

- `GiftEntityCell`：礼物视图 Cell 类。

![img](@static/images/uikit/chatroomios/GiftEntityCell.png)

- `ChatInputBar`：聊天输入框类。

![img](@static/images/uikit/chatroomios/ChatInputBar.png)

- `ReportOptionsController`：消息举报控制器类。

![img](@static/images/uikit/chatroomios/ReportOptionsController.png)

- `ParticipantsController`：聊天室成员列表/黑名单列表控制器类。

![img](@static/images/uikit/chatroomios/ParticipantsController.png)

- `ChatroomParticipantsCell`：聊天室成员列表/黑名单列表 Cell 类。

![img](@static/images/uikit/chatroomios/ChatroomParticipantsCell.png)

- `GiftsViewController`：礼物视图控制器类。

礼物的容器的自定义方式与其他控件类似，你需要继承 `GiftsViewController` 创建新类，在调用时 `DialogManager.shared.showGiftsDialog(titles: ["Gifts","1231232"], gifts: [self.gift1,self.gift2])` 传入新类的对象。

你需要在确保你的服务器端的礼物业务处理完毕，再调用 ChatroomUIKit 提供的发送礼物消息 API。

![img](@static/images/uikit/chatroomios/GiftsViewController.png)

## 自定义示例

下面以如何自定义礼物弹幕视图 Cell 为例介绍如何自定义控件。首先，继承 `GiftBarrageCell`，添加自己的逻辑，然后在 ChatroomUIKit 中注册新类替换原有的类。

````Swift
class CustomGiftBarragesViewCell: GiftBarrageCell {
    lazy var redDot: UIView = {
        UIView().backgroundColor(.red).cornerRadius(.large)
    }()
    
    override init(style: UITableViewCell.CellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        self.addSubview(redDot)
    }
    
    override func refresh(item: GiftEntityProtocol) {
        super.refresh(item: item)
        self.redDot.isHidden = item.selected
    }
}
//在创建 ChatroomView 或使用其他 UI 组件之前调用此方法。
ComponentsRegister.shared.GiftBarragesViewCell = CustomGiftBarragesViewCell.self
````