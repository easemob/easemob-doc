# 实现新类型的自定义消息 Cell

本文以红包消息为例介绍如何添加一种新类型的自定义消息 Cell。

## 步骤一 继承自定义消息 Cell

根据需求继承 `EaseChatUIKit` 中的自定义消息 Cell。

```swift
import UIKit
import EaseChatUIKit

class RedPackageCell: CustomMessageCell {

    override func createContent() -> UIView {
        UIView(frame: self.contentView.bounds).backgroundColor(.clear).tag(bubbleTag).backgroundColor(.systemRed)
    }
    
    override func refresh(entity: MessageEntity) {
        super.refresh(entity: entity)
    }
            
        //如果想让气泡尖角改颜色
        override func updateAxis(entity: MessageEntity) {
        super.updateAxis(entity: entity)
        if Appearance.chat.bubbleStyle == .withArrow {
            self.bubbleWithArrow.arrow.image = UIImage(named: self.towards == .left ? "arrow_left": "arrow_right", in: .chatBundle, with: nil)?.withTintColor(self.towards == .left ? .systemRed:.systemRed)
        } else {
            self.bubbleMultiCorners.backgroundColor = .systemRed
        }
    }
}

```

## 步骤二 继承 Cell 的渲染模型

根据需求继承 `EaseChatUIKit` 中的 Cell 的渲染模型 `MessageEntity`，并指定气泡大小，其中 `redPackageIdentifier` 为红包的自定义消息的 `event` 事件。

```swift
import UIKit
import EaseChatUIKit

final class MineMessageEntity: MessageEntity {
    
    override func customSize() -> CGSize {
        if let body = self.message.body as? ChatCustomMessageBody {
            switch body.event {
            case EaseChatUIKit_user_card_message:
                return CGSize(width: self.historyMessage ? ScreenWidth-32:limitBubbleWidth, height: contactCardHeight)
            case EaseChatUIKit_alert_message:
                let label = UILabel().numberOfLines(0).lineBreakMode(.byWordWrapping)
                label.attributedText = self.convertTextAttribute()
                let size = label.sizeThatFits(CGSize(width: ScreenWidth-32, height: 9999))
                return CGSize(width: ScreenWidth-32, height: size.height+50)
            case redPackageIdentifier:
                return CGSize(width: limitBubbleWidth, height: limitBubbleWidth*(5/3.0))
            default:
                return .zero
            }
            
        } else {
            return .zero
        }
    }

    
}
```

## 步骤三 添加附件消息类型

添加附件消息的类型，例如，增加红包消息。

```swift
        
        let redPackage = ActionSheetItem(title: "红包".chat.localize, type: .normal,tag: "Red",image: UIImage(named: "photo", in: .chatBundle, with: nil))
        Appearance.chat.inputExtendActions.append(redPackage)
```

## 步骤四 处理新增的附件消息类型的点击事件

继承 `MessageListController`，处理新增的附件消息类型的点击事件。

```swift
class CustomMessageListController: MessageListController {

        //要实现微信样式（followInput），需要同时重载下面的方法以及仿系统 UIActionSheet 样式（ActionSheet）的方法
    override func processFollowInputAttachmentAction() {
        if Appearance.chat.messageAttachmentMenuStyle == .followInput {
            if let fileItem = Appearance.chat.inputExtendActions.first(where: { $0.tag == "File" }) {
                fileItem.action = { [weak self] item,object in
                    self?.handleAttachmentAction(item: item)
                }
            }
            if let photoItem = Appearance.chat.inputExtendActions.first(where: { $0.tag == "Photo" }) {
                photoItem.action = { [weak self] item,object in
                    self?.handleAttachmentAction(item: item)
                }
            }
            if let cameraItem = Appearance.chat.inputExtendActions.first(where: { $0.tag == "Camera" }) {
                cameraItem.action = { [weak self] item,object in
                    self?.handleAttachmentAction(item: item)
                }
            }
            if let contactItem = Appearance.chat.inputExtendActions.first(where: { $0.tag == "Contact" }) {
                contactItem.action = { [weak self] item,object in
                    self?.handleAttachmentAction(item: item)
                }
            }
            if let redPackageItem = Appearance.chat.inputExtendActions.first(where: { $0.tag == "Red" }) {
                redPackageItem.action = { [weak self] item,object in
                    self?.handleAttachmentAction(item: item)
                }
            }
            
        }
    }
    
    //仿系统 UIActionSheet 样式（ActionSheet）只需要重载以下方法
    override func handleAttachmentAction(item: any ActionSheetItemProtocol) {
        switch item.tag {
        case "File": self.selectFile()
        case "Photo": self.selectPhoto()
        case "Camera": self.openCamera()
        case "Contact": self.selectContact()
        case "Red": self.redPackageMessage()
        default:
            break
        }
    }
    
    private func redPackageMessage() {
        self.viewModel.sendRedPackageMessage()
    }

}

let redPackageIdentifier = "redPackage"

```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/red_package_attachment.png" title="红包消息" />
</ImageGallery>

## 步骤五 增加发送新类型附件消息的方法

在 `EaseChatUIKit` 的 `MessageListViewModel` 中增加发送红包消息的方法。

```swift
extension MessageListViewModel {
    func sendRedPackageMessage() {
        var ext = Dictionary<String,Any>()
        ext["something"] = "发红包"
        let json = EaseChatUIKitContext.shared?.currentUser?.toJsonObject() ?? [:]
        ext.merge(json) { _, new in
            new
        }
        let chatMessage = ChatMessage(conversationID: self.to, body: ChatCustomMessageBody(event: redPackageIdentifier, customExt: ["money": "20", "name": "张三","message": "恭喜发财大吉大利"]), ext: ext)
        self.driver?.showMessage(message: chatMessage)
        self.chatService?.send(message: chatMessage) { [weak self] error, message in
            if error == nil {
                if let message = message {
                    self?.driver?.updateMessageStatus(message: message, status: .succeed)
                }
            } else {
                consoleLogInfo("send text message failure:\(error?.errorDescription ?? "")", type: .error)
                if let message = message {
                    self?.driver?.updateMessageStatus(message: message, status: .failure)
                }
            }
        }
    }
    
    
}

```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/red_package_send.png" title="发送红包消息" />
</ImageGallery>

## 步骤六 注册继承的对象

将上述继承的对象初始化后，在 `EaseChatUIKit` 中进行注册。

```swift
        
        ComponentsRegister.shared.MessageRenderEntity = MineMessageEntity.self
        ComponentsRegister.shared.Conversation = MineConversationInfo.self
        ComponentsRegister.shared.MessageViewController = CustomMessageListController.self
        ComponentsRegister.shared.registerCustomizeCellClass(cellType: RedPackageCell.self)
```

这里的 `ComponentsRegister.shared.Conversation = MineConversationInfo.self` 用于在会话列表中展示收到的新类型的自定义消息内容。

例如，在以下示例代码中，会话中收到新消息时显示为 "[红包]"，主要调整了在非文本消息类型的 `else` 中根据自定义消息的 `event` 显示对应的内容。
  
```swift
import UIKit
import EaseChatUIKit


final class MineConversationInfo: ConversationInfo {
    
    override func contentAttribute() -> NSAttributedString {
        guard let message = self.lastMessage else { return NSAttributedString() }
        var text = NSMutableAttributedString()
        
        let from = message.from
        let mentionText = "Mentioned".chat.localize
        let user = EaseChatUIKitContext.shared?.userCache?[from]
        var nickName = user?.remark ?? ""
        if nickName.isEmpty {
            nickName = user?.nickname ?? ""
        }
        if nickName.isEmpty {
            nickName = from
        }
        if message.body.type == .text {
            var result = message.showType
            for (key,value) in ChatEmojiConvertor.shared.oldEmojis {
                result = result.replacingOccurrences(of: key, with: value)
            }
            text.append(NSAttributedString {
                AttributedText(result).foregroundColor(Theme.style == .dark ? UIColor.theme.neutralColor6:UIColor.theme.neutralColor5).font(UIFont.theme.bodyLarge)
            })
            let string = text.string as NSString
            for symbol in ChatEmojiConvertor.shared.emojis {
                if string.range(of: symbol).location != NSNotFound {
                    let ranges = text.string.chat.rangesOfString(symbol)
                    text = ChatEmojiConvertor.shared.convertEmoji(input: text, ranges: ranges, symbol: symbol,imageBounds: CGRect(x: 0, y: -3, width: 16, height: 16))
                    text.addAttribute(.font, value: UIFont.theme.bodyLarge, range: NSMakeRange(0, text.length))
                    text.addAttribute(.foregroundColor, value: Theme.style == .dark ? UIColor.theme.neutralColor6:UIColor.theme.neutralColor5, range: NSMakeRange(0, text.length))
                }
            }
            if self.mentioned {
                let showText = NSMutableAttributedString {
                    AttributedText("[\(mentionText)] ").foregroundColor(Theme.style == .dark ? UIColor.theme.primaryColor6:UIColor.theme.primaryColor5).font(Font.theme.bodyMedium)
                    AttributedText(nickName + ": ").foregroundColor(Theme.style == .dark ? UIColor.theme.neutralColor6:UIColor.theme.neutralColor5)
                }
                
                let show = NSMutableAttributedString(attributedString: text)
                show.addAttribute(.foregroundColor, value: Theme.style == .dark ? UIColor.theme.neutralColor6:UIColor.theme.neutralColor5, range: NSRange(location: 0, length: show.length))
                show.addAttribute(.font, value: UIFont.theme.bodyMedium, range: NSRange(location: 0, length: show.length))
                showText.append(show)
                return showText
            } else {
                let showText = NSMutableAttributedString {
                    AttributedText(message.chatType != .chat ? nickName + ": ":"").foregroundColor(Theme.style == .dark ? UIColor.theme.neutralColor6:UIColor.theme.neutralColor5).font(Font.theme.bodyMedium)
                }
                showText.append(text)
                showText.addAttribute(.foregroundColor, value: Theme.style == .dark ? UIColor.theme.neutralColor6:UIColor.theme.neutralColor6, range: NSRange(location: 0, length: showText.length))
                showText.addAttribute(.font, value: UIFont.theme.bodyMedium, range: NSRange(location: 0, length: showText.length))
                return showText
            }
        } else {
            var content = message.showContent
            if let body = message.body as? ChatCustomMessageBody,body.event == redPackageIdentifier {
                content = "[红包]"
            }
            let showText = NSMutableAttributedString {
                AttributedText((message.chatType == .chat ? content:(nickName+":"+content))).foregroundColor(Theme.style == .dark ? UIColor.theme.neutralColor6:UIColor.theme.neutralColor5).font(UIFont.theme.bodyMedium)
            }
            return showText
        }
    }

}

```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/red_package_receive.png" title="接收红包消息" />
</ImageGallery>
