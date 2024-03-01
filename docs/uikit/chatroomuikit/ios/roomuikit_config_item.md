# 可配置项

[Appearance.swift](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Core/UIKit/Utils/Appearance.swift) 是容纳了所有可配置项的类，你需要在初始化 ChatroomView 之前修改其中的属性。

## 消息视图

1. Appearance.giftDialogContainerConstraintsSize：礼物弹窗的大小。

![img](@static/images/uikit/chatroomios/giftContainerConstraintsSize.png)

2. `Appearance.giftPlaceHolder`：礼物默认图。

![img](@static/images/uikit/chatroomios/giftPlaceHolder.png)

3. Appearance.avatarPlaceHolder：头像默认图。

![img](@static/images/uikit/chatroomios/avatarPlaceHolder.png)

4. Appearance.userIdentifyPlaceHolder：用户身份标识默认图。

![img](@static/images/uikit/chatroomios/userIdentityPlaceHolder.png)

5. Appearance.messageDisplayStyle：弹幕区域 Cell 的展示样式。你可以选择对时间戳、用户标识和用户头像进行显示或隐藏。

![img](@static/images/uikit/chatroomios/customchatbarrage.png)

6. `Appearance.notifyMessageIcon`：全局广播通知左侧图标默认图。

![img](@static/images/uikit/chatroomios/notifyMessageIcon.png)

7. `Appearance.defaultMessageActions`：长按消息后弹起弹窗的数据源。

![img](@static/images/uikit/chatroomios/messageActions.png)

8. `Appearance.actionSheetRowHeight`：`ActionSheet` 单行高度。

![img](@static/images/uikit/chatroomios/messageActions.png)

9. `Appearance.reportTags`：消息举报弹窗内显示的非法信息类型。

![img](@static/images/uikit/chatroomios/report.png)

10. Appearance.messageTranslationLanguage：目标翻译语言。你可以根据你的用户设备的语言环境设置对应的目标翻译语言，前提是需要在环信控制台开通翻译功能。目前，聊天室 UIKit 内置支持中文简体、中文繁体，英文，俄语，德语，法语，日语，韩语。 

## 文本输入视图

1. Appearance.maxInputHeight：输入框的最大高度。

![img](@static/images/uikit/chatroomios/maxInputHeight.png)

2. Appearance.inputPlaceHolder：输入框默认显示的文字。该选项的默认值是 Aa。

![img](@static/images/uikit/chatroomios/inputCorner.png)

3. Appearance.inputBarCorner：输入框的圆角半径，默认为 `large`，即输入框高度的一半。

![img](@static/images/uikit/chatroomios/inputCorner.png)

4. Appearance.emojiMap：若要替换全部的表情可以配置该 map，key 是代码注释中的固定字符串，value 可以传入不同 UIImage 对象即可。

![img](@static/images/uikit/chatroomios/customchatbarrage.png)

## 用户列表

 `Appearance.defaultOperationUserActions`：成员列表中聊天室所有者对普通成员的操作项。

 ![img](@static/images/uikit/chatroomios/moreAction.png)

## 弹窗

1. Appearance.pageContainerTitleBarItemWidth：`PageContainerTitleBar`（各弹窗页面顶部）的单个条目的宽度。

![img](@static/images/uikit/chatroomios/pageContainerTitleBarItemWidth.png)

2. Appearance.pageContainerConstraintsSize：`PageContainersDialogController` 弹窗的大小。 

![img](@static/images/uikit/chatroomios/pageContainerTitleBarItemWidth.png)
