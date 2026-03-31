# 设置消息输入

聊天页面的消息输入区是消息发送的核心区域，支持文本、语音、表情、附件等多种消息类型的输入与发送。本文介绍消息底部输入部分的样式自定义、功能配置及事件监听。

消息输入区实现各类消息的输入和发送以及消息表情等功能，包括以下部分：

- 消息输入栏（`MessageInputBar.swift`）：负责文本与语音消息的输入、发送，支持表情添加及常用功能扩展，@提及等交互。

- 消息扩展菜单（`MessageInputExtensionView.swift`）：提供发送附件类型消息（如图片、视频、文件）、位置消息以及自定义消息（如名片消息等）的快捷入口。

- 表情菜单（`MessageInputEmojiView.swift`）:负责表情展示、选择与删除。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/message_input_frame.png" title="消息输入区" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_input_bar_with_button_prompt.png" title="消息输入栏 ChatPrimaryMenu" />
</ImageGallery>

## 设置消息输入栏

### 设置消息输入栏背景色

```Swift
    //在MessageListController.swift及其子类（继承注册后）
    self.messageContainer.inputBar.backgroundColor = .orange
```

### 设置文本输入框默认文本

可通过 `Appearance.chat.inputPlaceHolder` 设置文本输入框中的默认文本：

```Swift
    Appearance.chat.inputPlaceHolder = "说点什么吧..."
    Appearance.chat.maxInputHeight = 80 
```

### 监听输入内容变化 

通过 `actionClosure` 监听输入状态：

```Swift
    public var actionClosure: ((MessageInputBarActionType,NSAttributedString?) -> Void)?
    
    self.messageContainer.inputBar.actionClosure = { actionType,text in
        switch actionType {
        case .startTyping:
            print("文本内容变化:\(text ?? NSAttributedString(string: ""))")
        default:
            break
        }
    }
```

## 设置消息扩展菜单

消息扩展菜单提供发送附件类型消息（如图片、视频、文件）、位置消息以及自定义消息的快捷入口。点击输入栏右侧的加号图标即可弹出。

### 设置菜单风格

消息扩展菜单支持以下两种风格：

- 微信风格：

```Swift
        Appearance.chat.messageAttachmentMenuStyle = .followInput
```

- UIActionSheet 风格：

```Swift
        Appearance.chat.messageAttachmentMenuStyle = .actionSheet
```

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_1.png" title="UIActionSheet" />
  <ImageItem src="/images/uikit/chatuikit/ios/message_types_2.png" title="类似微信样式" />
</ImageGallery>

### 管理扩展菜单项

通过获取到的全局配置项中的 `Appearance.chat.inputExtendActions` 对象动态管理扩展菜单项，包括添加、移除、排序以及处理点击事件等操作。

```Swift
        //添加菜单项
        Appearance.chat.inputExtendActions.append(ActionSheetItem(title: "1", type: .normal, tag: "1", image: nil))
        //删除菜单项
        Appearance.chat.inputExtendActions.removeAll {$0.tag == "1"}
        //排序菜单项
        Appearance.chat.inputExtendActions = Appearance.chat.inputExtendActions.sorted { lhs, rhs in
            return lhs.tag > rhs.tag
        }
```
设置消息扩展菜单背景色：

```Swift
        self.messageContainer.inputBar.extensionMenus.backgroundColor = .blue
```

### 监听扩展菜单点击事件 

在自定义的 `MessageListController` 中重写点击方法 `processMessage`。

```Swift
    @objc open func processMessage(item: ActionSheetItemProtocol,message: ChatMessage) {
    //不处理某一个点击事件，copy原来逻辑并修改
    //新增菜单项点击事件,copy原有逻辑并增加新case
}
```

## 事件监听

输入栏支持多种事件监听，可通过闭包（Closure）进行事件响应：

- **单点监听**：每个闭包属性只能设置一个回调，后续设置会覆盖之前的监听器。
- **事件分发**：`MessageListView.swift` 已统一管理事件分发，你只需关注业务处理。
- **线程安全**：所有回调默认在主线程执行，可直接更新 UI。

```Swift
    // 输入栏动作事件回调，返回操作类型与待发送文本（可为富文本），点击发送按钮时触发。
    public var actionClosure: ((MessageInputBarActionType, NSAttributedString?) -> Void)?
    // 表情键盘切换状态回调，返回当前表情键盘是否激活。
    public var changeEmojiClosure: ((Bool) -> Void)?
```

## 自定义样式与资源

对于消息输入栏，可通过覆盖同名资源文件的方式在 `Bundle.main` 中修改消息输入区的图标、图片和国际化资源。

### 常用图标替换

对于消息输入栏 `MessageInputBar.swift` 中的常用功能图标，可在 App 工程中 `Assets.xcassets` 文件中创建同名图片资源进行替换：

| 功能                 | 资源 ID                                        |
| :----------------------- | :--------------------------------------------- |
| 语音切换按钮（小麦克风） | `audio`    |
| 表情按钮（笑脸）         | `emojiKeyboard`              |
| 扩展按钮（加号）         | `attachment`&`attachmentSelected` |

### 各模块图标资源

按子模块可划分为以下类别：

| 类别     | 资源    |
| :------------- | :-------- |
| `MessageInputExtendView`（更多菜单）   | 参见 `Appearance.chat.inputExtendActions`。 |
| `MessageInputEmojiView`（表情菜单）   |  - `airplane`：表情菜单发送图标 <br/> - `gradient_dark`&`gradient_light`：表情菜单底部渐变遮罩 <br/> - `arrow_left_thick`：当前默认的退格箭头图标 |
| `MessageInputReplyView`（引用回复条 ） | - `reply_cancel`：取消引用 <br/> - `reply_image` / `reply_video` / `reply_audio` <br/> - `reply_file` / `reply_contact` / `reply_history` |

### 录音界面资源

`MessageAudioRecordView` 类使用的图片与国际化资源，均支持在 App 主工程中进行替换：

| 资源类型       | 加载方式              | 替换方法                                             |
| :----- | :----- | :------- |
| **图片资源**   | `UIImage(chatNamed:)` | 在 `Bundle.main` 中放置同名的图片文件        |
| **国际化文案** | `.chat.localize`      | 在 `Bundle.main` 的 `Localizable.strings` 文件中为对应 Key 提供翻译即可替换 |

**图片资源**

在 `Bundle.main` 中 `Assets.xcassets` 替换：

| 资源名称     | 用途              | 替换方式                      |
| :----------- | :---------------- | :---------------------------- |
| `mic_on`     | 麦克风图标        | 添加同名图片文件 `mic_on`     |
| `trash`      | 取消发送/删除图标 | 添加同名图片文件 `trash`      |
| `send_audio` | 发送语音图标      | 添加同名图片文件 `send_audio` |

**国际化文案**

在 `Bundle.main` 中 `Localizable.strings` 中替换：

| Key         | 用途           | 替换示例                        |
| :---------- | :------------- | :------------------------------ |
| `remaining` | 剩余时间提示   | `"remaining" = "剩余时间: %@";` |
| `Record`    | 录音状态文案   | `"Record" = "录音";`            |
| `Recording` | 录音中状态文案 | `"Recording" = "录音中...";`    |
| `Play`      | 播放状态文案   | `"Play" = "播放";`              |
| `Playing`   | 播放中状态文案 | `"Playing" = "播放中...";`      |

## 可重载方法标记

标记为 `open` / `override fun` 的方法均支持重载。你可以继承对应类并重写方法实现业务逻辑。
