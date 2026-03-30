# 消息列表的高级设置

消息列表是聊天界面的核心组件，基于 `MessageListController` 和 `MessageListView` 实现。本文介绍如何通过配置 `Appearance` 和 `ComponentsRegister` 实现消息列表的高级设置。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/chat_page_no_titlebar.png" title="消息列表和底部输入栏" />
</ImageGallery>

## 概述

可通过以下方式定制消息列表：

- **Appearance.chat**: 配置 UI 样式、图标、菜单项等。
- **ComponentsRegister**: 注册自定义消息条目或替换核心组件类。

:::tip
- 所有配置项均可通过 `Appearance.chat` 全局调整。
- `contentStyle` 支持组合使用多个样式，例如 `[.withReply, .withAvatar]`。
- 图片资源可通过在 `Bundle.main` 中提供同名文件覆盖。
- 国际化字符串可通过在 `Bundle.main` 的 `Localizable.strings` 中提供同名 key 覆盖。
:::

### Appearance.chat 消息配置

- **消息气泡样式**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- |
| `bubbleStyle` | MessageBubbleDisplayStyle | .withArrow | 消息气泡显示样式：带箭头(`.withArrow`) 或多圆角(`.withMultiCorner`)  |
| `contentStyle` | [MessageContentDisplayStyle] | [.withReply, .withAvatar, .withNickName, .withDateAndTime] | 内容显示组合：回复、头像、昵称、时间等 |

- **输入框配置**
   
| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- |
| `maxInputHeight` | CGFloat | 88 | 输入框最大高度限制：`MessageInputBar` 高度上限 |
| `inputPlaceHolder` | String | "Aa" | 输入框占位符文本：`MessageInputBar` 提示文字 |
| `inputBarCorner` | CornerRadius | .extraSmall | 输入框圆角样式：`MessageInputBar` 圆角 |

- **消息操作菜单**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- |
| `messageLongPressedActions` | [ActionSheetItemProtocol] | 12 个操作项 | 长按消息操作菜单：包含复制、转发、话题、回复、撤回、编辑、多选、置顶、翻译、显示原文、举报、删除 |
| `messageLongPressMenuStyle` | MessageLongPressMenuStyle | .withArrow | 消息长按菜单样式：<br/> - 带箭头菜单(.withArrow)<br/> - ActionSheet(.actionSheet) |

- **消息翻译**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- |
| `targetLanguage` | LanguageType | .Chinese | 目标翻译语言 |
| `enableTranslation` | Bool | false | 是否启用翻译功能：需从控制台开启后设置为 `true` |

- **举报功能**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- |
| `reportSelectionTags` | [String] | ["tag1"..."tag9"] | 消息举报类型标签 |
| `reportSelectionReasons` | [String] | 9 个违规原因 | 消息举报原因列表 | 

- **附件菜单配置**

| 配置项 | 类型 | 默认值 | 说明 | 
| :-------- | :------- | :---------- | :--------------- |
| `inputExtendActions` | [ActionSheetItemProtocol] | 4 个操作项 | 点击"+"按钮弹出的菜单项：包含照片、相机、文件、联系人 |
| `messageAttachmentMenuStyle` | MessageAttachmentMenuStyle | .followInput | 附件菜单样式：跟随输入框(.followInput) 或 ActionSheet(.actionSheet) |

- **消息时间格式**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- | 
| `dateFormatToday` | String | "HH:mm" | 当天消息时间格式 | 
| `dateFormatOtherDay` | String | "yyyy-MM-dd HH:mm" | 非当天消息时间格式 | 

- **语音消息配置**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- | 
| `audioDuration` | Int | 60 | 录音时长限制（秒）：最长 60 秒
| `receiveAudioAnimationImages` | [UIImage] | 3 张图片 | 接收方音频播放动画图片：左侧音频播放动画帧 |
| `sendAudioAnimationImages` | [UIImage] | 3 张图片 | 发送方音频播放动画图片： 右侧音频播放动画帧 |
| `newMessageSoundPath` | String | 系统音效路径 | 新消息提示音路径：收到新消息的提示音 |

- **文本颜色配置**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- | 
| `receiveTextColor` | UIColor | 深色模式：`neutralColor98`<br/>浅色模式：`neutralColor1` | 接收方文本颜色 |
| `sendTextColor` | UIColor | 深色模式：`neutralColor`1<br/>浅色模式：`neutralColor98` | 发送方文本颜色 |
| `receiveTranslationColor` | UIColor | 深色模式：`neutralColor7`<br/>浅色模式：`neutralColor5` | 接收方翻译文本颜色 |
| `sendTranslationColor` | UIColor | 深色模式：`neutralSpecialColor2`<br/>浅色模式：`neutralSpecialColor95` | 发送方翻译文本颜色 |

- **图片/视频消息配置**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- |
| `imageMessageCorner` | CGFloat | 4 | 图片消息圆角大小 |
| `imagePlaceHolder` | UIImage? | image_message_placeHolder | 图片加载占位图 | 
| `videoPlaceHolder` | UIImage? | video_message_placeHolder | 视频封面占位图 |

- **消息撤回配置**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- |
| `recallExpiredTime` | UInt | 120 | 消息撤回时限（秒）：消息发送后可撤回的最长时间 |

- **群组配置** 

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- |
| `groupParticipantsLimitCount` | Int | 1000 | 群成员最大数量 |

- **新消息提醒配置**

| 配置项 | 类型 | 默认值 | 说明 | 
| :-------- | :------- | :---------- | :--------------- | 
| `moreMessageAlertPosition` | MoreMessagePosition | .center | 新消息提醒位置：左侧(.left)、居中(.center)、右侧(.right) |

- **输入状态配置**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- |
| `enableTyping` | Bool | true | 是否显示对方正在输入状态 | 

- **置顶消息配置**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- | 
| `enablePinMessage` | Bool | true | 是否启用置顶消息功能 |

- **URL 预览配置**

| 配置项 | 类型 | 默认值 | 说明 |
| :-------- | :------- | :---------- | :--------------- | 
| `titlePreviewPattern` | String | "" | URL 预览标题正则表达式 | 
| `descriptionPreviewPattern` | String | "" | URL 预览描述正则表达式 |
| `imagePreviewPattern` | String | "" | URL 预览图片正则表达式 | 
| `enableURLPreview` | Bool | true | 是否启用 URL 预览 |

### 消息相关枚举类型说明

- `MessageAttachmentMenuStyle`：附件菜单样式
  
| 值 | 说明 |
|----|------|
| `.followInput` | 菜单跟随输入框显示（类似微信） |
| `.actionSheet` | 使用 `ActionSheet` 样式（类似系统菜单） |

- `MessageLongPressMenuStyle`：长按菜单样式

| 值 | 说明 |
|----|------|
| `.withArrow` | 带箭头的菜单（类似微信） |
| `.actionSheet` | 使用 `ActionSheet` 样式（类似系统菜单） |

- `MessageBubbleDisplayStyle`：消息气泡显示样式
  
| 值 | 说明 |
|----|------|
| `.withArrow` | 带箭头的气泡样式 |
| `.withMultiCorner` | 多圆角气泡样式（无箭头） |

- `MessageContentDisplayStyle`：消息气泡内容显示样式

| 值 | 说明 |
|----|------|
| `.withReply` | 显示回复内容 |
| `.withAvatar` | 显示用户头像 |
| `.withNickName` | 显示用户昵称 |
| `.withDateAndTime` | 显示日期时间 |
| `.withMessageThread` | 显示消息话题 |
| `.withMessageReaction` | 显示消息表情回应 |

## 修改文本消息字体和颜色

需继承 `MessageEntity` 类并注册到 `EaseChatUIKit` 中的 `ComponentsRegister` 中，重载 `convertTextAttribute` 方法。

```Swift
import EaseChatUIKit

class MineMessageEntity: MessageEntity {
    override func convertTextAttribute() -> NSAttributedString? {
        //根据具体需求参考或者复制原有逻辑改动相关字体颜色代码
    }
}
```

## 设置消息状态图标

消息状态图标包括：正在发送、已发送成功、发送失败、已送达、已读。

#### 自定义图标资源

- 方式一：（推荐）替换图片资源

在主 Bundle 中添加同名图片文件自动替换：

| 状态       | 默认图片名称              |
| :--------- | :------------------------ |
| 正在发送   | `message_status_spinner`  | 
| 已发送成功 | `message_status_succeed`  |
| 发送失败   | `message_status_failure`  |
| 已送达     | `message_status_delivery` | 
| 已读       | `message_status_read`     |

- 方式二：代码动态设置

1. 继承 `MessageEntity`，创建自定义子类。
2. 重写 `getStateImage()` 方法，返回自定义图标。
3. 注册自定义类至 `ComponentsRegister.shared.MessageEntity`。

```Swift
    open func getStateImage() -> UIImage? {
        switch self.state {
        case .sending:
            return UIImage(chatNamed: "message_status_spinner")
        case .succeed:
            return UIImage(chatNamed: "message_status_succeed")
        case .failure:
            return UIImage(chatNamed: "message_status_failure")
        case .delivered:
            return UIImage(chatNamed: "message_status_delivery")
        case .read:
            return UIImage(chatNamed: "message_status_read")
        }
    }
    
```

#### 隐藏状态图标

若要完全隐藏消息状态图标，请按以下步骤操作：

1. 继承 `MessageCell`，创建自定义 `MessageCell` 子类。
2. 重写 `refresh(entity:)` 方法，隐藏 `status` 视图。
3. 注册自定义类至 `ComponentsRegister`。

```Swift
        override func refresh(entity: MessageEntity) {
            super.refresh(entity: entity)
            self.status.isHidden = true //隐藏状态图标
        }
```
## 设置长按消息菜单

通过 `Appearance.chat.messageLongPressedActions` 配置长按菜单项，可添加自定义项或移除默认项。

关于选择微信样式菜单或仿系统 `ActionSheet` 样式，详见 [消息列表的基本设置说明](chatuikit_custom_chat_basic.html#设置长按消息菜单)。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_1.png" title="UIActionSheet" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_2.png" title="类似微信样式" />
</ImageGallery>

### 管理菜单项

```swift
// 获取默认菜单项
var actions = Appearance.chat.messageLongPressedActions

// 添加自定义菜单项
let customAction = ActionSheetItem(title: "自定义", type: .normal, tag: "CustomTag", image: UIImage(named: "custom_icon"))
customAction.action = { item, message in
    // 处理点击事件
    print("点击了自定义菜单")
}

// 添加到菜单列表
actions.append(customAction)

// 移除不需要的菜单项
actions.removeAll { $0.tag = "xxx"} 

// 更新配置 
Appearance.chat.messageLongPressedActions = actions
```

### 设置菜单样式

- 图标替换/隐藏：详见 [Chat/消息条目的图片和国际化资源表](#chat-消息条目的图片和国际化资源表)。
- 文字颜色：详见 [主题色的说明](chatuikit_theme.html#切换为自定义主题)。
- 修改菜单项文字大小：
  菜单样式属于全局统一配置，目前不支持对单个菜单项的文字大小进行单独修改。
  若需调整菜单项的文字大小及其相关子视图的尺寸，可通过修改全局字体样式实现。例如，更新 `UIFont.theme.labelSmall` 来统一控制菜单中对应级别的文字外观：

```Swift
        UIFont.theme.labelSmall = UIFont.systemFont(ofSize: 12, weight: .medium)
```

## 完全自定义消息条目

若要展示自定义类型的消息，或完全重写现有消息的展示样式，可通过 `ComponentsRegister` 注册自定义消息条目（Cell）。

本节以红包消息为例，介绍如何添加新类型消息条目。

#### 步骤一 继承自定义消息条目

根据需求继承 `EaseChatUIKit` 中的自定义消息条目。

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
            
         // 自定义气泡箭头颜色
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

#### 步骤二 继承消息条目的渲染模型

根据需求继承 `MessageEntity`（消息条目的渲染模型），重写 `customSize()` 方法指定气泡尺寸。其中 `redPackageIdentifier` 为红包的自定义消息的 `event` 标识。

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

#### 步骤三 添加附件消息类型

添加附件消息的类型，例如，增加红包消息。

```swift
        
        let redPackage = ActionSheetItem(title: "红包".chat.localize, type: .normal,tag: "Red",image: UIImage(named: "photo", in: .chatBundle, with: nil))
        Appearance.chat.inputExtendActions.append(redPackage)
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/red_package_attachment.png" title="新增的附件消息类型" />
</ImageGallery>

#### 步骤四 处理附件消息点击

继承 `MessageListController`，处理新增附件消息类型的点击事件。

```swift
class CustomMessageListController: MessageListController {
    
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

#### 步骤五 增加发送方法

在 `EaseChatUIKit` 的 `MessageListViewModel` 中增加发送红包消息的方法。

```swift
extension MessageListViewModel {
    func sendRedPackageMessage() {
        var ext = Dictionary<String,Any>()
        ext["something"] = "发红包"
        let json = ChatUIKitContext.shared?.currentUser?.toJsonObject() ?? [:]
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

#### 步骤六 注册继承的对象

将继承的对象初始化后注册在 `EaseChatUIKit` 中。

```swift
        
        ComponentsRegister.shared.MessageRenderEntity = MineMessageEntity.self
        ComponentsRegister.shared.Conversation = MineConversationInfo.self
        ComponentsRegister.shared.MessageViewController = CustomMessageListController.self
        //redPackageIdentifier 为消息条目的唯一标识，也是环信自定义消息的时间类型
        ComponentsRegister.shared.registerCustomCellClasses(cellType: RedPackageCell.self,identifier: redPackageIdentifier)
```

其中 `ComponentsRegister.shared.Conversation = MineConversationInfo.self` 用于在会话列表中自定义新消息的展示内容。例如，收到红包消息时显示为 "[红包]"。通过在 `else` 分支中根据消息的 `event` 类型返回对应文本实现：
  
```swift
import UIKit
import EaseChatUIKit


final class MineConversationInfo: ConversationInfo {
    
    override func contentAttribute() -> NSAttributedString {
        guard let message = self.lastMessage else { return NSAttributedString() }
        var text = NSMutableAttributedString()
        
        let from = message.from
        let mentionText = "Mentioned".chat.localize
        let user = ChatUIKitContext.shared?.userCache?[from]
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

#### 步骤七 注册消息条目

```swift
// 替换默认的文本消息条目
ComponentsRegister.shared.ChatTextMessageCell = MyCustomMessageCell.self

// 对应的 `ChatImageMessageCell`&`ChatGIFMessageCell`&`ChatAudioMessageCell`&`ChatVideoMessageCell`&`ChatFileMessageCell`&`ChatContactMessageCell`&`ChatAlertCell`&`ChatLocationCell`&`ChatCombineCell` 与文本消息一致
// 或者注册全新的自定义消息类型 Cell
// 假设你有一个自定义消息类型，Identifier 为 "CustomEvent"
ComponentsRegister.shared.registerCustomCellClasses(cellType: MyCustomMessageCell.self, identifier: "CustomEvent")
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/red_package_receive.png" title="接收红包消息" />
</ImageGallery>

## 消息条目业务方法信息及重载

### 方法列表

方法说明如下：

1. **`@objc` 标记**：方法可被 Objective-C 调用。
2. **`open` 关键字**：方法可在子类中重载。
3. **`createXXX()` 系列**：方法用于创建自定义 UI 组件。
4. **`refresh()` 方法**：用于更新消息条目显示内容。
5. **`switchTheme()` 方法**：用于适配主题切换。

:::tip
`lazy var` 属性会在首次访问时才会调用对应方法。
:::

#### 1. MessageCell (基础消息条目)

- **UI 组件创建方法**

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :--------- | :------ | :--------- |
| `createCheckbox()` | `@objc open func createCheckbox() -> UIImageView` | 创建多选框图标 | UIImageView | 无参数 |
| `createAvatar()` | `@objc open func createAvatar() -> ImageView` | 创建头像视图 | ImageView | 无参数 |
| `createNickName()` | `@objc open func createNickName() -> UILabel` | 创建昵称标签 | UILabel | 无参数 |
| `createReplyContent()` | `@objc open func createReplyContent() -> MessageReplyView` | 创建回复内容视图 | MessageReplyView | 无参数 |
| `createBubbleWithArrow()` | `@objc open func createBubbleWithArrow() -> MessageBubbleWithArrow` | 创建带箭头的气泡 | MessageBubbleWithArrow | 无参数 |
| `createBubbleMultiCorners()` | `@objc open func createBubbleMultiCorners() -> MessageBubbleMultiCorner` | 创建多圆角气泡 | MessageBubbleMultiCorner | 无参数 |
| `statusView()` | `@objc open func statusView() -> UIImageView` | 创建状态图标视图 | UIImageView | 无参数 |
| `createMessageDate()` | `@objc open func createMessageDate() -> UILabel` | 创建消息时间标签 | UILabel | 无参数 |
| `createTopicView()` | `@objc open func createTopicView() -> MessageTopicView` | 创建话题视图 | MessageTopicView | 无参数 |
| `createReactionView()` | `@objc open func createReactionView() -> MessageReactionView` | 创建表情回应视图 | MessageReactionView | 无参数 |

- **核心方法**

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :--------- | :------ | :--------- |
| `refresh(entity:)` | `@objc(refreshWithEntity:) open func refresh(entity: MessageEntity)` | 刷新消息条目数据显示 | Void | entity: 消息实体对象 |
| `updateAxis(entity:)` | `@objc(updateAxisWithEntity:) open func updateAxis(entity: MessageEntity)` | 更新子视图布局坐标 | Void | entity: 消息实体对象 |
| `clickAction(gesture:)` | `@objc open func clickAction(gesture: UITapGestureRecognizer)` | 处理点击手势 | Void | gesture: 点击手势识别器 |
| `longPressAction(gesture:)` | `@objc open func longPressAction(gesture: UILongPressGestureRecognizer)` | 处理长按手势 | Void | gesture: 长按手势识别器 |
| `switchTheme(style:)` | `open func switchTheme(style: ThemeStyle)` | 切换主题样式 | Void | style: 主题样式枚举 |

#### 2. TextMessageCell (文本消息条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :---------- | :------- | :--------- |
| `createContent()` | `@objc open func createContent() -> LinkRecognizeTextView` | 创建文本内容视图 | LinkRecognizeTextView | 无参数，支持链接识别 |
| `createEditSymbol()` | `@objc open func createEditSymbol() -> UIButton` | 创建编辑标识按钮 | UIButton | 显示 "Edited" 标记 |
| `createTranslationContainer()` | `@objc open func createTranslationContainer() -> TranslateTextView` | 创建翻译容器视图 | TranslateTextView | 无参数 |
| `createTranslation()` | `@objc open func createTranslation() -> UILabel` | 创建翻译内容标签 | UILabel | 无参数 |
| `createTranslateSymbol()` | `@objc open func createTranslateSymbol() -> UIButton` | 创建翻译标识按钮 | UIButton | 显示 "Translated" 标记 |
| `createPreviewContent()` | `@objc open func createPreviewContent() -> URLPreviewResultView` | 创建 URL 预览视图 | URLPreviewResultView | 用于链接预览 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新文本消息显示 | Void | 包含编辑、翻译、URL 预览逻辑 |
| `switchTheme(style:)` | `open override func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 调用 `onThemeChanged()` |
| `onThemeChanged()` | `open func onThemeChanged()` | 主题变化时更新 UI | Void | 处理链接颜色、选中颜色等 |

#### 3. ImageMessageCell (图片消息条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :------- | :------------- | :--------- |
| `createContent()` | `@objc open func createContent() -> ImageView` | 创建图片内容视图 | ImageView | 带圆角的图片视图 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新图片消息显示 | Void | 处理本地/远程图片加载 |
| `switchTheme(style:)` | `open override func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新背景色和边框 |

#### 4. VideoMessageCell (视频消息条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :--------- | :------- | :--------- |
| `createContent()` | `@objc open func createContent() -> ImageView` | 创建视频封面视图 | ImageView | 显示视频缩略图 |
| `createPlay()` | `@objc open func createPlay() -> UIImageView` | 创建播放按钮图标 | UIImageView | 居中显示的播放图标 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新视频消息显示 | Void | 加载视频缩略图、控制播放按钮的显示和隐藏 |
| `switchTheme(style:)` | `open override func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新背景色和边框 |

#### 5. AudioMessageCell (语音消息条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :-------- | :------- | :--------- |
| `createContent()` | `@objc open func createContent() -> UIView` | 创建语音内容视图 | UIView | 返回 `AudioMessageView` 实例 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新语音消息显示 | Void | 显示已读/未读红点 |
| `switchTheme(style:)` | `open override func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新红点颜色 |

#### 6. FileMessageCell (文件消息条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :--------- | :-------- | :--------- |
| `createContent()` | `@objc open func createContent() -> UIView` | 创建文件内容视图 | UIView | 返回`FileMessageView` 实例 |
| `refresh(entity:)` | `public override func refresh(entity: MessageEntity)` | 刷新文件消息显示 | Void | 调用 `FileMessageView` 的 `refresh` |

#### 7. LocationMessageCell (位置消息条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :-------- | :------------- | :--------- |
| `createContent()` | `@objc open func createContent() -> UIView` | 创建位置内容视图 | UIView | 空白视图，需自定义实现 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新位置消息显示 | Void | 包含收发消息 UI 区分 |
| `switchTheme(style:)` | `open override func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 空实现，可自定义 |

#### 8. CustomMessageCell (自定义消息条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :------------ | :---------- | :--------- |
| `createContent()` | `@objc open func createContent() -> UIView` | 创建自定义内容视图 | UIView | 空白视图，需自定义实现 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新自定义消息显示 | Void | 包含收发消息 UI 区分 |
| `switchTheme(style:)` | `open override func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 空实现，可自定义 |

#### 9. ContactCardCell (联系人卡片条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :----------- | :------------ | :--------- |
| `createContent()` | `@objc open func createContent() -> UIView` | 创建联系人卡片视图 | UIView | 返回 `ContactCardView` 实例 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新联系人卡片显示 | Void | 调用 `ContactCardView` 的 `refresh` |

#### 10. CombineMessageCell (合并消息条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :-------------- | :--------- | :--------- |
| `createContent()` | `@objc open func createContent() -> CombineMessageView` | 创建合并消息视图 | `CombineMessageView` | 显示聊天记录摘要 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新合并消息显示 | Void | 调用 `CombineMessageView` 的 `refresh` |
| `switchTheme(style:)` | `open override func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 空实现，可自定义 |

#### 11. GIFMessageCell (GIF 消息条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :-------- | :------------- | :--------- |
| `createContent()` | `@objc open func createContent() -> GIFAnimatedImageView` | 创建 GIF 动画视图 | GIFAnimatedImageView | 支持 GIF 动画播放 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新 GIF 消息显示 | Void | 加载并播放 GIF 动画 |
| `switchTheme(style:)` | `open override func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新背景色和边框 |

#### 12. AlertMessageCell (提醒消息)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :----- | :------- | :--------- |
| `clickAction(gesture:)` | `open override func clickAction(gesture: UITapGestureRecognizer)` | 处理点击手势 | Void | 仅当有 `threadId` 时响应 |
| `refresh(entity:)` | `open override func refresh(entity: MessageEntity)` | 刷新提醒消息显示 | Void | 显示时间和提醒内容 |
| `switchTheme(style:)` | `public override func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新时间文字颜色 |

#### 13. ChatHistoryCell (聊天历史)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :---------- | :------------ | :--------- |
| `refresh(entity:)` | `@objc open func refresh(entity: MessageEntity)` | 刷新聊天历史显示 | Void | 支持图片、视频、文本消息显示 |
| `switchTheme(style:)` | `public func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新昵称、分隔线、日期颜色 |

#### 14. ChatThreadCell (话题)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :------------- | :------------ | :--------- |
| `refresh(chatThread:)` | `open func refresh(chatThread: EaseChatThread)` | 刷新话题信息显示 | Void | `chatThread`: 话题对象 |
| `renderMessageContent(message:)` | `open func renderMessageContent(message: ChatMessage?) -> NSAttributedString` | 渲染消息内容 | `NSAttributedString` | `message`: 最新消息对象 |
| `switchTheme(style:)` | `public func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新各元素颜色 |

#### 15. PinnedMessageCell (置顶消息)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :-------- | :-------- | :--------- |
| `refresh(entity:)` | `@objc open func refresh(entity: PinnedMessageEntity)` | 刷新置顶消息显示 | Void | entity: 置顶消息实体 |
| `removeAction()` | `@objc open func removeAction()` | 移除按钮点击 | Void | 显示确认移除按钮 |
| `confirmRemoveAction()` | `@objc open func confirmRemoveAction()` | 确认移除按钮点击 | Void | 触发移除回调 |
| `switchTheme(style:)` | `public func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新容器和按钮颜色 |

#### 16. ForwardTargetCell (转发目标条目)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :--------- | :----------- | :--------- |
| `refresh(info:keyword:forward:)` | `open func refresh(info: ChatUserProfileProtocol, keyword: String, forward state: ForwardTargetState)` | 刷新转发目标显示 | Void | `info`: 用户信息<br/>`keyword`: 搜索关键词<br/>`state`: 转发状态 |
| `highlightKeywords(keyword:in:)` | `func highlightKeywords(keyword: String, in string: String) -> NSAttributedString` | 高亮关键词 | NSAttributedString | 搜索结果关键词高亮 |
| `actionClick()` | `@objc open func actionClick()` | 发送按钮点击 | Void | 触发转发回调 |

#### 17. ReactionDetailCell (表情回应详情)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :---------- | :------------ | :--------- |
| `refresh(reaction:)` | `@objc open func refresh(reaction: MessageReaction)` | 刷新表情回应显示 | Void | `reaction`: 表情回应对象 |

#### 18. ReactionUserCell (表情回应用户)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :---------- | :---------- | :--------- |
| `createCheckbox()` | `@objc open func createCheckbox() -> UIImageView` | 创建多选框 | UIImageView | 无参数 |
| `createAvatar()` | `@objc open func createAvatar() -> ImageView` | 创建头像视图 | ImageView | 无参数 |
| `createNickName()` | `@objc open func createNickName() -> UILabel` | 创建昵称标签 | UILabel | 无参数 |
| `refresh(profile:)` | `@objc open func refresh(profile: ChatUserProfileProtocol)` | 刷新用户信息显示 | Void | `profile`: 用户信息对象 |

#### 19. ReportOptionCell (举报选项)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :-------- | :--------- | :--------- |
| `refresh(select:title:)` | `@objc open func refresh(select: Bool, title: String)` | 刷新举报选项显示 | Void | `select`: 是否选中<br/>`title`: 选项标题 |
| `switchTheme(style:)` | `open func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新选中/未选中图标颜色 |

#### 20. SearchHistoryMessageCell (搜索历史消息)

| 方法名 | 方法签名 | 说明 | 返回类型 | 参数说明 |
| :-------- | :------- | :----------- | :----------- | :--------- |
| `refresh(message:info:keyword:)` | `func refresh(message: ChatMessage, info: ChatUserProfileProtocol, keyword: String)` | 刷新搜索结果显示 | Void | `message`: 消息对象<br/>`info`: 用户信息<br/>`keyword`: 搜索关键词 |
| `highlightKeywords(keyword:in:)` | `func highlightKeywords(keyword: String, in string: String) -> NSAttributedString` | 高亮关键词 | NSAttributedString | 搜索结果关键词高亮 |
| `switchTheme(style:)` | `public func switchTheme(style: ThemeStyle)` | 切换主题 | Void | 更新会话名称颜色 |

#### 21. MessageEntity 消息模型实例

- **尺寸计算相关方法**

**重载尺寸计算方法时避免重复计算。**

| 方法名 | 方法签名 | 返回类型 | 参数说明 | 作用描述 |
| :-------- | :------- | :----- | :----------- | :--------- |
| `cellHeight()` | `open func cellHeight() -> CGFloat` | CGFloat | 无参数 | 计算消息条目的总高度<br/>包含：昵称、回复、气泡、时间、话题、表情回应高度 |
| `reactionMenuWidth()` | `open func reactionMenuWidth() -> CGFloat` | CGFloat | 无参数 | 计算表情回应区域的宽度<br/>返回可见表情回应的总宽度，超出最大宽度时截断 |
| `topicContentHeight()` | `open func topicContentHeight() -> CGFloat` | CGFloat | 无参数 | 计算话题内容区域的高度<br/>如果消息包含 Thread 话题，返回`topicHeight(58)`，否则返回 `0` |
| `reactionContentHeight()` | `open func reactionContentHeight() -> CGFloat` | CGFloat | 无参数 | 计算表情回应内容的高度<br/>如果有表情回应，返回reactionHeight(30)，否则返回 `0`。 |
| `updateBubbleSize()` | `open func updateBubbleSize() -> CGSize` | CGSize | 无参数 | 根据消息类型计算气泡尺寸<br/>支持文本、图片、语音、视频、文件、位置、合并、自定义消息 |
| `textSize()` | `open func textSize() -> CGSize` | CGSize | 无参数 | 计算文本消息内容的尺寸<br/>考虑文本属性、换行、emoji 等因素 |
| `textBubbleSize()` | `open func textBubbleSize() -> CGSize` | CGSize | 无参数 | 计算文本消息气泡的尺寸<br/>包含文本、编辑标记、翻译、URL 预览的总尺寸 |
| `urlPreviewHeight()` | `@objc open func urlPreviewHeight() -> CGFloat` | CGFloat | 无参数 | 计算URL预览区域的高度<br/>包含图片、标题、描述的高度，未加载时返回38 |
| `translationSize()` | `open func translationSize() -> CGSize` | CGSize | 无参数 | 计算翻译内容的尺寸<br/>如果显示翻译，计算翻译文本的实际尺寸 |
| `thumbnailSize(video:)` | `open func thumbnailSize(video: Bool) -> CGSize` | CGSize | video: 是否为视频消息 | 计算图片/视频缩略图尺寸<br/>根据原图宽高比计算适配后的显示尺寸 |
| `audioSize()` | `open func audioSize() -> CGSize` | CGSize | 无参数 | 计算语音消息气泡尺寸<br/>根据语音时长返回不同宽度（75-limitBubbleWidth） |
| `customSize()` | `open func customSize() -> CGSize` | CGSize | 无参数 | 计算自定义消息尺寸<br/>支持联系人卡片、提醒消息等自定义类型 |
| `updateReplySize()` | `open func updateReplySize() -> CGSize` | CGSize | 无参数 | 计算回复消息气泡的尺寸<br/>包含回复标题和内容的尺寸 |

- **内容转换相关方法** 

| 方法名 | 方法签名 | 返回类型 | 参数说明 | 作用描述 |
| :-------- | :------- | :--- | :---------- | :--------- |
| `getStateImage()` | `open func getStateImage() -> UIImage?` | UIImage? | 无参数 | 获取消息状态图标<br/>返回：发送中、成功、失败、送达、已读的图标 |
| `convertTextAttribute()` | `open func convertTextAttribute() -> NSAttributedString?` | NSAttributedString? | 无参数 | 转换文本为富文本属性字符串<br/>处理：文本颜色、emoji、@提醒、链接检测等 |
| `convertTopicContent()` | `open func convertTopicContent() -> NSAttributedString?` | NSAttributedString? | 无参数 | 转换话题内容为富文本<br/>显示 Thread 话题的最新消息内容 |
| `convertTextTranslationAttribute()` | `open func convertTextTranslationAttribute() -> NSAttributedString?` | NSAttributedString? | 无参数 | 转换翻译文本为富文本属性字符串<br/>应用翻译文本的颜色和字体样式 |
| `convertReplyTitle()` | `open func convertReplyTitle() -> NSAttributedString?` | NSAttributedString? | 无参数 | 转换回复消息的标题<br/>显示被回复用户的昵称或 "message doesn't exist" |
| `convertToReply()` | `open func convertToReply() -> NSAttributedString?` | NSAttributedString? | 无参数 | 转换回复消息内容为富文本<br/>根据消息类型显示不同的回复预览（文本、图片、语音等） |

- **URL 预览相关方法** 

| 方法名 | 方法签名 | 返回类型 | 参数说明 | 作用描述 |
| :-------- | :------- | :--- | :---------- | :--------- |
| `previewStart()` | `open func previewStart()` | Void | 无参数 | 启动 URL 预览解析<br/>异步加载链接的标题、描述、图片，完成后更新气泡尺寸 |

### 使用示例

#### 自定义尺寸计算

```swift
// 示例 1: 自定义消息高度计算
class MyMessageEntity: MessageEntity {
    override func cellHeight() -> CGFloat {
        var height = super.cellHeight()
        // 添加自定义高度
        height += 20
        return height
    }
}

// 示例 2: 自定义文本属性转换
class MyMessageEntity: MessageEntity {
    override func convertTextAttribute() -> NSAttributedString? {
        guard let attributedText = super.convertTextAttribute() else {
            return nil
        }
        // 添加自定义样式
        let mutableText = NSMutableAttributedString(attributedString: attributedText)
        mutableText.addAttribute(.kern, value: 1.5, range: NSRange(location: 0, length: mutableText.length))
        return mutableText
    }
}

// 示例 3: 自定义气泡尺寸
class MyMessageEntity: MessageEntity {
    override func updateBubbleSize() -> CGSize {
        var size = super.updateBubbleSize()
        // 为所有消息增加padding
        size.width += 20
        size.height += 10
        return size
    }
}

// 示例 4: 自定义消息类型显示
extension ChatMessage {
    open override var showType: String {
        if self.body.type == .custom {
            if let body = self.body as? ChatCustomMessageBody {
                if body.event == "my_custom_type" {
                    return "[自定义消息]"
                }
            }
        }
        return super.showType
    }
}

// 示例 5: 自定义自定义消息尺寸
class MyMessageEntity: MessageEntity {
    override func customSize() -> CGSize {
        if let body = self.message.body as? ChatCustomMessageBody {
            switch body.event {
            case "my_order_card":
                return CGSize(width: limitBubbleWidth, height: 150)
            case "my_product_card":
                return CGSize(width: limitBubbleWidth, height: 180)
            default:
                return super.customSize()
            }
        }
        return super.customSize()
    }
}
```

#### 自定义各消息类型条目

```swift
// 示例1: 自定义文本消息条目的内容视图
class MyTextMessageCell: TextMessageCell {
    override func createContent() -> LinkRecognizeTextView {
        let textView = super.createContent()
        textView.font = UIFont.systemFont(ofSize: 16)
        return textView
    }
}

// 示例2: 自定义图片消息条目的刷新逻辑
class MyImageMessageCell: ImageMessageCell {
    override func refresh(entity: MessageEntity) {
        super.refresh(entity: entity)
        // 添加自定义水印
        self.content.layer.borderWidth = 2
        self.content.layer.borderColor = UIColor.red.cgColor
    }
}

// 示例3: 完全自定义消息条目
class OrderMessageCell: CustomMessageCell {
    override func createContent() -> UIView {
        // 创建订单卡片视图
        let orderView = OrderCardView(frame: .zero)
        return orderView
    }
    
    override func refresh(entity: MessageEntity) {
        super.refresh(entity: entity)
        // 解析订单数据并显示
        if let orderData = parseOrderData(entity.message) {
            (self.content as? OrderCardView)?.showOrder(orderData)
        }
    }
}
```

## ChatMessage 扩展中可重载方法

| 方法名 | 方法签名 | 返回类型 | 作用描述 |
| :-------- | :------- | :------------------------------------- | :------------------------------------- |
| `showDate` | `@objc open var showDate: String { get }` | String | 获取会话列表中显示的日期<br/>当天：HH:mm；非当天：yyyy-MM-dd HH:mm |
| `showDetailDate` | `@objc open var showDetailDate: String { get }` | String | 获取聊天消息条目中显示的详细日期<br/>格式同 showDate，可单独配置 |
| `showType` | `@objc open var showType: String { get }` | String | 获取消息类型的显示文本<br/>返回：[图片]、[语音]、[视频]、[文件]、[位置]等本地化文本 |
| `replyIcon` | `@objc open var replyIcon: UIImage? { get }` | UIImage? | 获取回复消息的图标<br/>根据消息类型返回对应图标（图片、语音、视频、文件等） |
| `showContent` | `@objc open var showContent: String { get }` | String | 获取消息显示内容<br/>文本：消息内容；语音：时长；文件：文件名；自定义：自定义内容 |
| `contentSize` | `@objc open var contentSize: CGSize { get }` | CGSize | 获取自定义消息的内容尺寸<br/>返回自定义消息类型的默认尺寸 |

使用示例如下：

```swift
// 自定义消息类型显示
extension ChatMessage {
  open override var showType: String {
​    if self.body.type == .custom {
​      if let body = self.body as? ChatCustomMessageBody {
​        if body.event == "my_custom_type" {
​          return "[自定义消息]"
​        }
​      }
​    }
​    return super.showType
  }
}
```

## 替换核心组件 

1. 如需深度定制消息列表的逻辑（如 ViewModel 或 Controller），可通过替换注册表中的类实现：

```swift
// 替换消息列表 ViewModel
ComponentsRegister.shared.MessagesViewModel = MyMessageListViewModel.self

// 替换消息列表 Controller
ComponentsRegister.shared.MessageViewController = MyMessageListController.self
```

2. 如需替换 `MessageListView`，可在继承 `MessageListController` 后重写 `createMessageContainer()` 方法，返回自定义的 `MessageListView` 实例。需确保自定义视图正确实现 `IMessageListViewDriver` 协议中的方法，并处理好键盘交互、UI 交互及事件分发。

## 业务逻辑重载

本节所列方法均声明为 `open`，可在子类中重写以实现自定义逻辑：

```swift
override open func methodName(parameters) -> ReturnType {
    // 自定义实现
    super.methodName(parameters) // 可选：调用父类实现
}
```

#### MessageListController

| 方法名 | 作用 | 参数说明 |
| :-------- | :------- | :------------------------------------- |
| `createNavigation()` | 创建并返回导航栏 | 返回 `ChatNavigationBar` 实例 |
| `rightImages()` | 定义导航栏右侧图标 | 返回图标数组（话题、置顶消息） |
| `createMessageContainer()` | 创建消息列表容器视图 | 返回 `MessageListView` 实例 |
| `createLoading()` | 创建加载视图 | 返回 `LoadingView` 实例 |
| `processFollowInputAttachmentAction()` | 处理输入框附件按钮跟随样式的行为 | 配置附件菜单项的点击事件 |
| `setupNavigation()` | 设置导航栏的标题、头像等信息 | 根据用户资料配置导航栏 |
| `showPinnedMessages()` | 显示置顶消息列表 | 加载并展示置顶消息容器 |
| `navigationClick(type:indexPath:)` | 处理导航栏点击事件 | `type`: 事件类型, `indexPath`: 索引路径 |
| `viewDetail()` | 查看聊天详情（联系人/群组信息） | 根据聊天类型跳转到详情页 |
| `rightItemsAction(indexPath:)` | 处理导航栏右侧按钮点击 | `indexPath`: 按钮索引 |
| `viewTopicList()` | 查看话题列表 | 跳转到话题列表页面 |
| `pop()` | 返回上一页 | 执行页面返回操作 |
| `otherPartyTypingText()` | 对方正在输入提示 | 显示输入状态提示 |
| `performTypingTask()` | 执行输入状态任务 | 清除输入状态提示 |
| `forwardMessages(messages:)` | 转发多条消息（合并转发） | `messages`: 要转发的消息数组 |
| `forwardMessage(message:)` | 转发单条消息 | `message`: 要转发的消息 |
| `deleteMessages(messages:)` | 删除多条消息 | `messages`: 要删除的消息数组 |
| `filterSelectedMessages()` | 过滤已选中的消息 | 返回选中的消息数组 |
| `enterTopic(threadId:message:)` | 进入话题详情 | `threadId`: 话题 ID, `message`: 消息对象 |
| `messageWillSendFillExtensionInfo()` | 消息发送前填充扩展信息 | 返回扩展信息字典 |
| `filterMessageActions(message:)` | 过滤消息长按菜单项 | `message`: 消息实体，返回可用的菜单项 |
| `showMessageLongPressedDialog(cell:)` | 显示消息长按对话框 | `cell`: 消息条目 |
| `showMessageLongPressedMenuWithArrow(cell:items:header:)` | 显示带箭头的长按菜单 | `cell`: 消息条目, `items`: 菜单项, `header`: 头部视图 |
| `showMessageLongPressedMenuActionSheet(cell:items:header:)` | 显示 `ActionSheet` 样式的长按菜单 | `cell`: 消息条目, `items`: 菜单项, `header`: 头部视图 |
| `feedback(with:)` | 触觉反馈 | `style`: 反馈样式 |
| `showAllReactionsController(message:)` | 显示所有表情回应选择器 | `message`: 消息实体 |
| `showReactionDetailsController(message:)` | 显示表情回应详情 | `message`: 消息实体 |
| `processMessage(item:message:)` | 处理消息操作 | `item`: 操作项, `message`: 消息对象 |
| `multiSelect(message:)` | 进入多选模式 | `message`: 初始选中的消息 |
| `toCreateThread(message:)` | 创建话题 | `message`: 关联的消息 |
| `editAction(message:)` | 编辑消息 | `message`: 要编辑的消息 |
| `reportAction(message:)` | 举报消息 | `message`: 要举报的消息 |
| `messageAttachmentLoading(loading:)` | 消息附件加载状态 | `loading`: 是否正在加载 |
| `messageBubbleClicked(message:)` | 消息气泡点击事件 | `message`: 消息实体 |
| `viewHistoryMessages(entity:)` | 查看历史消息 | `entity`: 合并消息实体 |
| `viewAlertDetail(message:)` | 查看提醒消息详情 | `message`: 提醒消息 |
| `viewContact(body:)` | 查看联系人名片 | `body`: 自定义消息体 |
| `messageAvatarClick(user:)` | 消息头像点击 | `user`: 用户资料 |
| `audioDialog()` | 显示录音对话框 | 弹出录音视图 |
| `mentionAction()` | @提及功能 | 选择要@的成员 |
| `attachmentDialog()` | 显示附件菜单 | 弹出附件选择菜单 |
| `handleAttachmentAction(item:)` | 处理附件操作 | `item`: 附件操作项 |
| `selectPhotoWithPHPicker()` | 使用 PHPicker 选择照片 | 打开系统相册 |
| `selectPhoto()` | 选择照片（旧API） | 使用 `UIImagePickerController` |
| `openCamera()` | 打开相机 | 拍照或录像 |
| `selectFile()` | 选择文件 | 打开文件选择器 |
| `selectContact()` | 选择联系人 | 分享联系人名片 |
| `openFile()` | 打开文件预览 | 使用 `QuickLook` 预览 |
| `processImagePickerData(info:)` | 处理图片选择器数据 | `info`: 选择的媒体信息 |
| `documentPickerOpenFile(controller:urls:)` | 处理文档选择器结果 | `controller`: 选择器, `urls`: 文件 URLs |

#### MessageListView

| 方法名 | 作用 | 参数说明 |
| :-------- | :------- | :------------------------------------- |
| `refreshPreviewResult(entity:)` | 刷新 URL 预览结果 | `entity`: 消息实体 |
| `scrollToBottom()` | 滚动到底部 | 平滑滚动到消息列表底部 |

:::tip
`MessageListView` 作为视图类，主要提供协议方法的实现，可复写的 `open` 方法较少。大部分逻辑通过实现 `IMessageListViewDriver` 协议定义，由内部调用，通常无需直接复写。
:::

#### MessageListViewModel

| 方法名 | 作用 | 参数说明 |
| :-------- | :------- | :------------------------------------- |
| `bindDriver(driver:searchMessageId:)` | 绑定视图驱动器 | `driver`: 视图驱动, `searchMessageId`: 搜索消息ID |
| `bindPinContainerDriver(driver:)` | 绑定置顶消息容器驱动器 | `driver`: 置顶容器驱动 |
| `loadSearchMessage()` | 加载搜索消息 | 根据消息ID加载上下文消息 |
| `loadMessages()` | 加载历史消息 | 下拉加载更多消息 |
| `sendMessage(text:type:extensionInfo:)` | 发送消息 | `text`: 消息内容/路径, `type`: 消息类型, `extensionInfo`: 扩展信息 |
| `constructMessage(text:type:extensionInfo:)` | 构造消息对象 | `text`: 消息内容, `type`: 消息类型, `extensionInfo`: 扩展信息 |
| `updateMentionIds(profile:type:)` | 更新@提及列表 | `profile`: 用户资料, `type`: 添加/删除 |
| `processMessage(operation:message:edit:)` | 处理消息操作 | `operation`: 操作类型, `message`: 消息, `edit`: 编辑文本 |
| `fetchPinnedMessages()` | 获取置顶消息 | 从服务器获取置顶消息列表 |
| `showPinnedMessages()` | 显示置顶消息 | 返回置顶消息实体数组 |
| `pin(message:)` | 置顶消息 | `message`: 要置顶的消息 |
| `pinAlert(info:operation:)` | 置顶提醒消息 | `info`: 置顶信息, `operation`: 置顶/取消置顶 |
| `translateMessage(message:)` | 翻译消息 | `message`: 要翻译的消息 |
| `showOriginalText(message:)` | 显示原文 | `message`: 消息对象 |
| `editMessage(message:content:)` | 编辑消息 | `message`: 消息, `content`: 新内容 |
| `copyMessage(message:)` | 复制消息 | `message`: 要复制的消息 |
| `replyMessage(message:)` | 回复消息 | `message`: 要回复的消息 |
| `recallMessage(message:)` | 撤回消息 | `message`: 要撤回的消息 |
| `recallAction(message:)` | 撤回动作处理 | `message`: 被撤回的消息 |
| `deleteMessage(message:)` | 删除消息 | `message`: 要删除的消息 |
| `deleteMessages(messages:)` | 删除多条消息 | `messages`: 要删除的消息数组 |
| `notifyUnreadCountChanged()` | 通知未读数变化 | 发送未读数变化通知 |
| `messageTopicClicked(entity:)` | 消息话题点击 | `entity`: 消息实体 |
| `messageReactionClicked(reaction:entity:)` | 消息表情回应点击 | `reaction`: 回应表情, `entity`: 消息实体 |
| `operationReaction(emoji:message:)` | 操作表情回应 | `emoji`: 表情, `message`: 消息 |
| `messageVisibleMark(entity:)` | 消息可见标记 | `entity`: 可见的消息实体 |
| `retrySendMessage(entity:)` | 重试发送消息 | `entity`: 发送失败的消息 |
| `onMessageBubbleClicked(message:)` | 消息气泡点击处理 | `message`: 消息实体 |
| `audioMessagePlay(message:)` | 音频消息播放 | `message`: 音频消息实体 |
| `downloadMessageAttachment(message:)` | 下载消息附件 | `message`: 消息实体 |
| `cacheImage(message:)` | 缓存图片 | `message`: 图片消息 |
| `cacheFrame(attachMessage:)` | 缓存视频帧 | `attachMessage`: 视频消息 |
| `messageAvatarLongPressed(profile:)` | 消息头像长按 | `profile`: 用户资料 |
| `processInputEvents(action:attributeText:)` | 处理输入事件 | `action`: 输入动作, `attributeText`: 富文本 |
| `notifyTypingState()` | 通知输入状态 | 发送正在输入的通知 |
| `willSendMessage(attributeText:)` | 即将发送消息 | `attributeText`: 输入的富文本 |
| `messageDidReceived(message:)` | 收到消息 | `message`: 接收到的消息 |
| `messageDidRecalled(recallInfo:)` | 消息被撤回 | `recallInfo`: 撤回信息 |
| `messageDidEdited(message:)` | 消息被编辑 | `message`: 编辑后的消息 |
| `messageStatusChanged(message:status:error:)` | 消息状态变化 | `message`: 消息, `status`: 状态, `error`: 错误 |
| `messageAttachmentStatusChanged(message:error:)` | 附件状态变化 | `message`: 消息, `error`: 错误 |
| `messageReactionChanged(changes:)` | 表情回应变化 | `changes`: 变化数组 |

## 自定义资源

在 `Bundle.main` 中添加同名资源即可覆盖默认资源：

- 图片资源：通过 `UIImage(chatNamed:)` 加载，在 `Bundle.main` 中放置同名文件即可覆盖。
- 国际化资源：通过 `.chat.localize` 扩展加载，在 `Bundle.main` 的对应语言目录的 `Localizable.strings` 中添加相同 key 的翻译即可覆盖。
- 主题适配：图片会根据当前系统模式自动渲染（如 `audio_message_icon_show_left`/`audio_message_icon_show_right` 在亮色/暗色模式下显示不同颜色），无需提供两套资源。如需修改颜色，可调整 `Appearance` 中的 `hue` 值（如 `Appearance.neutralHue`、`Appearance.neutralSpecialHue`），或在组件的 `ThemeSwitchProtocol` 扩展中自定义。

以 `AudioMessageView` 为例，图片会根据系统模式自动适配颜色：
  
```swift
              extension AudioMessageView: ThemeSwitchProtocol {
    public func switchTheme(style: ThemeStyle) {
        if self.towards == .left {
            self.audioIcon.image = UIImage(chatNamed: "audio_message_icon_show_left")?.withTintColor(style == .dark ? UIColor.theme.neutralSpecialColor6:UIColor.theme.neutralSpecialColor5)
            self.audioIcon.animationImages = Appearance.chat.receiveAudioAnimationImages
        } else {
            self.audioIcon.image = UIImage(chatNamed: "audio_message_icon_show_right")?.withTintColor(style == .dark ? UIColor.theme.neutralSpecialColor6:UIColor.theme.neutralColor98)
            self.audioIcon.animationImages = Appearance.chat.sendAudioAnimationImages
        }
    }
}
```

- 若只需支持亮色模式，仅需配置亮色模式相关的 `hue` 值即可。

#### Chat/消息条目的图片和国际化资源表

| 类别 | 资源类型 | 覆盖方式 |
| :-------- | :------- | :------------------------------------- |
| `video_message_play` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `video_message_play` |
| `thread_more` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `thread_more` |
| `reaction_trash` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `reaction_trash` |
| `uncheck` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `uncheck` |
| `check` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `check` |
| `text_message_edited` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `text_message_edited` |
| `text_message_translated` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `text_message_translated` |
| `select` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `select` |
| `unselect` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `unselect` |
| `No Messages` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `No Messages` |
| `Sen`d | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Send` |
| `Sent` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Sent` |
| `Remove` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Remove` |
| `Confirm Remove` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Confirm Remove` |
| `Edited` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Edited` |
| `Translated` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Translated` |

#### Chat/Views 图片和国际化资源表

| 类别 | 资源类型 | 覆盖方式 |
| :-------- | :------- | :------------------------------------- |
| `audio_message_icon_show_left` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `audio_message_icon_show_left` |
| `audio_message_icon_show_right` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `audio_message_icon_show_right` |
| `reaction_all` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `reaction_all` |
| `file_message_icon` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `file_message_icon` |
| `mic_on` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `mic_on` |
| `trash` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `trash` |
| `send_audio` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `send_audio` |
| `edit_bar_status` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `edit_bar_status` |
| `audio` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `audio` |
| `attachment` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `attachment` |
| `attachmentSelected` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `attachmentSelected` |
| `emojiKeyboard` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `emojiKeyboard` |
| `textKeyboard` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `textKeyboard` |
| `message_select_bottom_forward` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `message_select_bottom_forward` |
| `more_messages` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `more_messages` |
| `pinned_messages` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `pinned_messages` |
| `Chat History` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Chat History` |
| `input_extension_menu_contact` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `input_extension_menu_contact` |
| `remaining` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `remaining` |
| `Record` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Record` |
| `Recording` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Recording` |
| `Play` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Play` |
| `Playing` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Playing` |
| `Editing` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Editing` |
| `new messages` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `new messages` |
| `Pin Messages` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Pin Messages` |
| `Sticky Message` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Sticky Message` |

#### MessageListController 图片和国际化资源表

| 类别 | 资源类型 | 覆盖方式 |
| :-------- | :------- | :------------------------------------- |
| `message_action_topic` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `message_action_topic` |
| `pinned_messages` | 图片资源 | 在 `Bundle.main` 中添加同名图片 `pinned_messages` |
| `No pinned messages` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `No pinned messages` |
| `Typing...` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Typing...` |
| `Please select greater than one message.` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Please select greater than one message.` |
| `barrage_long_press_menu_delete` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `barrage_long_press_menu_delete` |
| `messages` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `messages` |
| `permissions disable` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `permissions disable` |
| `photo_disable` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `photo_disable` |
| `camera_disable` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `camera_disable` |
| `Share Contact` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `Share Contact` |
| `to` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `to` |
| `file_disable` | 国际化资源 | 在 `Bundle.main` 的 Localizable.strings 中添加 key 为 `file_disable` |

## 可重载方法标记

`MessageListController` 及其组件类中的许多方法均标记为 `open`，可通过子类化深度定制业务逻辑。