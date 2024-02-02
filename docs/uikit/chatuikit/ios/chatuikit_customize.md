# 自定义

<Toc />

你可以对单群聊 UIKit 中的一些控件进行自定义，添加自己的业务逻辑，实现个性化业务需求。

所有的可继承组件都在 `ComponentsRegister.swift` 中，继承后替换原有的组件即可。

## 如何自定义

### 自定义消息 Cell 样式

你可以对单群聊 UIKit 提供的消息 cell 的样式进行自定义，例如增加或隐藏。

以下以自定义位置消息 cell 为例介绍：

```Swift
class CustomLocationMessageCell: LocationMessageCell {
    //创建返回你想展示的 view 即可，气泡会包裹住你的 view。
    @objc open override func createContent() -> UIView {
        UIView(frame: .zero).backgroundColor(.clear).tag(bubbleTag)
    }
}
//在 EaseChatUIKit 中注册继承原有类的自定义类来替换原来的类。
//在创建消息页面或使用其他 UI 组件之前调用此方法。
ComponentsRegister.shared.ChatLocationCell = CustomLocationMessageCell.self
```

若实现自定义消息 cell 的样式，可以继承基础消息 cell 根据自身业务进行样式进行自定义。

```Swift
ComponentsRegister.shared.registerCustomizeCellClass(cellType: YourMessageCell.self)
class YourMessageCell: MessageCell {
    override func createAvatar() -> ImageView {
        ImageView(frame: .zero)
    }
}
```

### 拦截原有组件点击事件

拦截后的业务逻辑与 UI 刷新逻辑，你需要自己完全实现，建议使用注册继承即可更快速的实现需求。

#### 会话列表

- swipeAction：滑动事件。

- longPressed：长按事件。

- didSelected：点击事件。

以下示例代码为会话长按事件：

```Swift    
ComponentViewsActionHooker.shared.conversation.longPressed = { [weak self] indexPath,info in 
    //Process you business logic.
}
```

#### 联系人列表

- didSelectedContact：点击联系人。

- groupWithSelected：点击添加群成员或者创建群组选择成员。

#### 消息列表

- replyClicked：消息中引用消息气泡点击。

- bubbleClicked：消息气泡点击。

- bubbleLongPressed：消息气泡长按。

- avatarClicked：头像点击。

- avatarLongPressed：头像长按。









