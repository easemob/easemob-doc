# 可配项修改

<Toc />

Appearance.swift 是容纳了所有可配项的类。这些可配项都有默认值，如果要修改某些配置项，需要在初始化对应 UI 控件之前修改其中的属性，配置项才生效。

## 通用可配项

1. `Appearance.pageContainerTitleBarItemWidth`：底部弹窗页面标题栏的宽度。若要配置，请在 Xcode 中的文件中搜索 `PageContainerTitleBar.swift`。

![](./IndicatorImages/Appearance_pageContainerTitleBarItemWidth.png)

2. `Appearance.pageContainerConstraintsSize`：底部弹窗页面的宽度和高度。主要使用类在 Xcode 中查找到 `PageContainersDialogController.swift` 查看该属性。

![](./IndicatorImages/Appearance_pageContainerConstraintsSize.png)

3. Alert 的样式：

-  `Appearance.alertContainerConstraintsSize`：Alert 居中类型弹窗的宽度和高度。主要使用类在 Xcode 中查找到 `AlertController.swift`

- `Appearance.alertStyle`：弹窗的圆角样式，即是大圆角还是小圆角。

![](./IndicatorImages/Appearance_alertContainerConstraintsSize.png)

4. `Appearance.primaryHue`：主色调，用于按钮、输入框等控件的背景色。

5. `Appearance.secondaryHue`：辅色调，用于按钮、输入框等控件的背景色。

6. `Appearance.errorHue`：错误色调。

7. `Appearance.neutralHue`：中性色调。

8. `Appearance.neutralSpecialHue`：中性特殊色调。

9. `Appearance.avatarRadius`：头像圆角，分为极小、小、中、大等四个等级。

10. `Appearance.actionSheetRowHeight`：ActionSheet Cell 的行高。

![](./IndicatorImages/Appearance_actionSheetRowHeight.png)

11. `Appearance.avatarPlaceHolder` 头像占位图。

## 会话列表可配项

1. `Appearance.conversation.rowHeight`：会话列表 Cell 的高度。

![](./IndicatorImages/Appearance_conversation_rowHeight.png)

2. `Appearance.conversation.swipeLeftActions`/`Appearance.conversation.swipeRightActions`：会话列表左滑菜单项和右滑菜单项。

![](./IndicatorImages/Appearance_conversation_swipeLeftActions.png)

3. `Appearance.conversation.moreActions`：右滑会话后出现的 `...` 菜单项点击后的 ActionSheet 的菜单项。

![](./IndicatorImages/Appearance_conversation_swipe_right_more.png)

4. `Appearance.conversation.singlePlaceHolder` 会话列表单聊会话头像占位图和群聊会话头像占位图。

![](./IndicatorImages/Appearance_conversation_placeHolder.png)

5. `Appearance.conversation.dateFormatToday`/`Appearance.conversation.dateFormatOtherDay`：今天和今天之外的日期格式。

![](./IndicatorImages/Appearance_conversation_dateFormat.png)

6. `Appearance.conversation.listMoreActions`：点击会话列表右上角的 `+` 之后的 ActionSheet 的菜单项。

![](./IndicatorImages/Appearance_conversation_list_more.png)

## 联系人列表及其后续页面可配项

1. `Appearance.contact.rowHeight`：联系人列表 Cell 的高度。

![](./IndicatorImages/Appearance_contact_rowHeight.png)

2. `Appearance.contact.headerRowHeight`：联系人列表 Header Cell 的高度。

![](./IndicatorImages/Appearance_contact_headerRowHeight.png)

3. `Appearance.contact.listHeaderExtensionActions`：联系人列表 Header List 数据源。

![](./IndicatorImages/Appearance_contact_listHeaderExtensionActions.png)

4. `Appearance.contact.detailExtensionActionItems`：联系人以及群组详情 header 中可配菜单项，主要功能包括聊天、音视频通话等。

![](./IndicatorImages/Appearance_contact_detailExtensionActionItems.png)

5. `Appearance.contact.moreActions`：联系人以及群组详情右上角的 `...` 点击后的 ActionSheet 的菜单项。

![](./IndicatorImages/Appearance_contact_moreActions.png)


## 聊天页面可配项

1. `Appearance.chat.maxInputHeight`：聊天页面输入框最大输入高度。

2. `Appearance.chat.inputPlaceHolder`：聊天页面输入框默认占位符。

3. `Appearance.chat.inputBarCorner`：聊天页面输入框圆角。

![](./IndicatorImages/Appearance_chat_input.png)

4. `Appearance.chat.bubbleStyle`：聊天页面消息气泡的样式分为带箭头与多圆角两种。

![](./IndicatorImages/Appearance_chat_bubbleStyle.png)

5. `Appearance.chat.contentStyle`：聊天页面消息中显示内容的可配项数组，可以将不想要的功能移除即可。

![](./IndicatorImages/Appearance_chat_contentStyle.png)

6. `Appearance.chat.messageLongPressedActions`：聊天页面长按消息后的 ActionSheet 菜单项。

![](./IndicatorImages/Appearance_chat_messageLongPressedActions.png)

7. `Appearance.chat.reportSelectionTags`：聊天页面非法消息的举报类型。

![](./IndicatorImages/Appearance_chat_report.png)

8. `Appearance.chat.reportSelectionReasons`：聊天页面非法消息的举报原因。

![](./IndicatorImages/Appearance_chat_report.png)

9. `Appearance.chat.inputExtendActions`：聊天页面输入框右侧 `+` 点击后 ActionSheet 菜单项。

![](./IndicatorImages/Appearance_chat_input.png)

10. `Appearance.chat.dateFormatToday`/`Appearance.chat.dateFormatOtherDay`：聊天页面消息今天和今天之外的日期格式。

![](./IndicatorImages/Appearance_chat_dateFormat.png)

12. `Appearance.chat.audioDuration`：聊天页面语音消息录制的最大时长，默认为 60 秒。

![](./IndicatorImages/Appearance_chat_audioDuration.png)

13. `Appearance.chat.receiveAudioAnimationImages`/`Appearance.chat.sendAudioAnimationImages`：聊天页面接收方/发送方语音消息播放时的动画图片。

![](./IndicatorImages/Appearance_chat_receiveAudioAnimationImages.png)

14. `Appearance.chat.receiveBubbleColor`：聊天页面接收方消息气泡颜色。

![](./IndicatorImages/Appearance_chat_bubbleColor.png)

15. `Appearance.chat.sendBubbleColor`：聊天页面发送方消息气泡颜色。

![](./IndicatorImages/Appearance_chat_bubbleColor.png)

16. `Appearance.chat.receiveTextColor`/`Appearance.chat.sendTextColor`：聊天页面接收方/发送方消息文字颜色。

![](./IndicatorImages/Appearance_chat_textColor.png)

17. `Appearance.chat.imageMessageCorner`：聊天页面图片消息圆角。

![](./IndicatorImages/Appearance_chat_imageMessageCorner.png)

18. `Appearance.chat.imagePlaceHolder`：聊天页面图片消息占位图。

19. `Appearance.chat.videoPlaceHolder`：聊天页面视频消息占位图。

20. `Appearance.chat.recallExpiredTime`：聊天页面消息撤回的有效时间。

21. `Appearance.chat.newMessageSoundPath`：聊天页面收到新消息时的播放音频文件的路径。


























