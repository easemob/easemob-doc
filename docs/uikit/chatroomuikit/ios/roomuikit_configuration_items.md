# 可配项修改

Appearance.swift 是容纳了所有可配项的类，你需要在初始化 ChatroomView 之前修改其中的属性。

## 消息视图

1. [Appearance.giftContainerConstraintsSize](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Core/UIKit/Utils/Appearance.swift)：礼物弹窗的大小。

![位置示意图](giftContainerConstraintsSize.png)

2. `Appearance.giftPlaceHolder`：礼物默认图。

![位置示意图](giftPlaceHolder.png)

3. [Appearance.avatarPlaceHolder](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Components/Chat/Cells/ChatBarrageCell.swift)：头像默认图。

![位置示意图](avatarPlaceHolder.png)

4. [Appearance.userIdentifyPlaceHolder](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Components/Chat/Cells/ChatBarrageCell.swift)：用户身份标识默认图。

![位置示意图](userIdentifyPlaceHolder.png)

5. [Appearance.barrageCellStyle](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Core/UIKit/Utils/Appearance.swift)：弹幕区域 Cell 的展示样式。你可以选择对时间戳、用户标识和用户头像进行显示或隐藏。

![位置示意图](customchatbarrage.png)

6. `Appearance.notifyMessageIcon`：全局广播通知左侧图标默认图。

![位置示意图](notifyMessageIcon.png)

7. `Appearance.defaultMessageActions`：长按消息后弹起弹窗的数据源。

![位置示意图](messageActions.png)

8. [`Appearance.actionSheetRowHeight`](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Core/UIKit/DialogComponent/ActionSheet.swift)：`ActionSheet` 单行高度。

![位置示意图](messageActions.png).

9. `Appearance.reportTags`：消息举报弹窗内显示的非法信息类型。

![位置示意图](report.png)

10. [Appearance.messageTranslationLanguage](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Core/UIKit/Utils/LanguageConvertor.swift)：目标翻译语言。你可以根据你的用户设备的语言环境设置对应的目标翻译语言，前提是需要在环信控制台开通翻译功能。目前，聊天室 UIKit 内置支持中文简体、中文繁体，英文，俄语，德语，法语，日语，韩语。 

## 文本输入视图

1. [Appearance.maxInputHeight](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Components/Input/Views/ChatInputBar.swift)：输入框的最大高度。

![位置示意图](maxInputHeight.png)

2. [Appearance.inputPlaceHolder](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Components/Input/Views/ChatInputBar.swift)：输入框默认显示的文字。该选项的默认值是 Aa。

![位置示意图](inputCorner.png) 

3. [Appearance.inputBarCorner](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Components/Input/Views/ChatInputBar.swift)：输入框的圆角半径，默认为`large`，即输入框高度的一半。

![位置示意图](inputCorner.png) 

4. [Appearance.emojiMap](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Components/Input/Convertor/ChatEmojiConvertor.swift)：若要替换全部的表情可以配置该 map，key 是代码注释中的固定字符串，value 可以传入不同 UIImage 对象即可。

![位置示意图](customchatbarrage.png)

## 用户列表

 `Appearance.defaultOperationUserActions`：成员列表中聊天室所有者对普通成员的操作项。

![位置示意图](moreAction.png)

## 弹窗

1. [Appearance.pageContainerTitleBarItemWidth](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Core/UIKit/Utils/Appearance.swift)：`PageContainerTitleBar`（各弹窗页面顶部）的单个条目的宽度。

![位置示意图](./pageContainerTitleBarItemWidth.png).

2. [Appearance.pageContainerConstraintsSize](https://github.com/zjc19891106/ChatroomUIKit/blob/main/Sources/ChatroomUIKit/Classes/UI/Core/UIKit/Utils/Appearance.swift)：`PageContainersDialogController` 弹窗的大小。 

![位置示意图](./pageContainerTitleBarItemWidth.png)
