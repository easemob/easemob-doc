# 可配项修改

<Toc />

`Appearance.swift` 是容纳了所有可配项的类。这些可配项都有默认值，如果要修改某些配置项，需要在初始化对应 UI 控件之前修改其中的属性，配置项才生效。

## 通用可配项

注意下述 `value` 为要设置的值，会改变对应配置项的 UI 样式或者数据源等。请查看[源码](https://github.com/easemob/chatuikit-ios)后使用。

1. `Appearance.pageContainerTitleBarItemWidth = value`：底部弹窗页面标题栏的宽度。若要配置，请在 Xcode 中的文件中搜索 `PageContainerTitleBar.swift`。

![img](@static/images/uikit/chatuikit/ios/configurationitem/common/Appearance_pageContainerTitleBarItemWidth.png) 

2. `Appearance.pageContainerConstraintsSize = value`：底部弹窗页面的宽度和高度。主要使用类在 Xcode 中查找到 `PageContainersDialogController.swift` 查看该属性。

![img](@static/images/uikit/chatuikit/ios/configurationitem/common/Appearance_pageContainerConstraintsSize.png)

3. Alert 的样式：

-  `Appearance.alertContainerConstraintsSize = value`：Alert 居中类型弹窗的宽度和高度。主要使用类在 Xcode 中查找到 `AlertController.swift`

- `Appearance.alertStyle = value`：弹窗的圆角样式，即是大圆角还是小圆角。

![img](@static/images/uikit/chatuikit/ios/configurationitem/common/Appearance_alertContainerConstraintsSize.png)

4. `Appearance.primaryHue = value`：主色调，用于按钮、输入框等控件的背景色。

5. `Appearance.secondaryHue = value`：辅色调，用于按钮、输入框等控件的背景色。

6. `Appearance.errorHue = value`：错误色调。

7. `Appearance.neutralHue = value`：中性色调。

8. `Appearance.neutralSpecialHue = value`：中性特殊色调。

9. `Appearance.avatarRadius = value`：头像圆角，分为极小、小、中、大等四个等级。

10. `Appearance.actionSheetRowHeight = value`：ActionSheet Cell 的行高。

![img](@static/images/uikit/chatuikit/ios/configurationitem/common/Appearance_actionSheetRowHeight.png)

11. `Appearance.avatarPlaceHolder = value` 头像占位图。

## 会话列表可配项

1. `Appearance.conversation.rowHeight = value`：会话列表 Cell 的高度。

![img](@static/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_rowHeight.png)

2. `Appearance.conversation.swipeLeftActions = value`/`Appearance.conversation.swipeRightActions = value`：会话列表左滑菜单项和右滑菜单项。

![img](@static/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_swipeLeftActions.png)

3. `Appearance.conversation.moreActions = value`：右滑会话后出现的 `...` 菜单项点击后的 ActionSheet 的菜单项。

![img](@static/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_swipe_right_more.png)

4. `Appearance.conversation.singlePlaceHolder = value` 会话列表单聊会话头像占位图和群聊会话头像占位图。

![img](@static/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_placeHolder.png)

5. `Appearance.conversation.dateFormatToday = value`/`Appearance.conversation.dateFormatOtherDay = value`：今天和今天之外的日期格式。

![img](@static/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_dateFormat.png)

6. `Appearance.conversation.listMoreActions = value`：点击会话列表右上角的 `+` 之后的 ActionSheet 的菜单项。

![img](@static/images/uikit/chatuikit/ios/configurationitem/conversation/Appearance_conversation_list_more.png)

## 联系人列表及其后续页面可配项

1. `Appearance.contact.rowHeight = value`：联系人列表 Cell 的高度。

![img](@static/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_rowHeight.png)

2. `Appearance.contact.headerRowHeight = value`：联系人列表 Header Cell 的高度。

![img](@static/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_headerRowHeight.png)

3. `Appearance.contact.listHeaderExtensionActions = value`：联系人列表 Header List 数据源。

![img](@static/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_listHeaderExtensionActions.png)

4. `Appearance.contact.detailExtensionActionItems = value`：联系人以及群组详情 header 中可配菜单项，主要功能包括聊天、音视频通话等。

![img](@static/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_detailExtensionActionItems.png)

5. `Appearance.contact.moreActions = value`：联系人以及群组详情右上角的 `...` 点击后的 ActionSheet 的菜单项。

![img](@static/images/uikit/chatuikit/ios/configurationitem/contact/Appearance_contact_moreActions.png)


## 聊天页面可配项

1. `Appearance.chat.maxInputHeight = value`：聊天页面输入框最大输入高度。

2. `Appearance.chat.inputPlaceHolder = value`：聊天页面输入框默认占位符。

3. `Appearance.chat.inputBarCorner = value`：聊天页面输入框圆角。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_input.png)

4. `Appearance.chat.bubbleStyle = value`：聊天页面消息气泡的样式分为带箭头与多圆角两种。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_bubbleStyle.png)

5. `Appearance.chat.contentStyle = value`：聊天页面消息中显示内容的可配项数组，可以将不想要的功能移除即可。可配置项有是否显示昵称、是否显示头像、是否显示 reply、是否显示reaction、是否显示 thread、是否显示时间等。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_contentStyle.png)

6. `Appearance.chat.messageLongPressedActions = value`：聊天页面长按消息后的 ActionSheet 菜单项。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_messageLongPressedActions.png)

7. `Appearance.chat.reportSelectionTags = value`：聊天页面非法消息的举报类型。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_report.png)

8. `Appearance.chat.reportSelectionReasons = value`：聊天页面非法消息的举报原因。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_report.png)

9. `Appearance.chat.inputExtendActions = value`：聊天页面输入框右侧 `+` 点击后 ActionSheet 菜单项。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_input.png)

10. `Appearance.chat.dateFormatToday = value`/`Appearance.chat.dateFormatOtherDay = value`：聊天页面消息今天和今天之外的日期格式。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_dateFormat.png)

11. `Appearance.chat.audioDuration = value`：聊天页面语音消息录制的最大时长，默认为 60 秒。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_audioDuration.png)

12. `Appearance.chat.receiveAudioAnimationImages = value`/`Appearance.chat.sendAudioAnimationImages = value`：聊天页面接收方/发送方语音消息播放时的动画图片。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_receiveAudioAnimationImages.png)

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_bubbleColor.png)

13. `Appearance.chat.receiveTextColor = value`/`Appearance.chat.sendTextColor = value`：聊天页面接收方/发送方消息文字颜色。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_textColor.png)

14. `Appearance.chat.imageMessageCorner = value`：聊天页面图片消息圆角，默认为 4。

![img](@static/images/uikit/chatuikit/ios/configurationitem/chat/Appearance_chat_imageMessageCorner.png)

15. `Appearance.chat.imagePlaceHolder = value`：聊天页面图片消息占位图。

16. `Appearance.chat.videoPlaceHolder = value`：聊天页面视频消息占位图。

17. `Appearance.chat.recallExpiredTime = value`：聊天页面消息撤回的有效时间，默认为 120 秒。

18. `Appearance.chat.newMessageSoundPath = value`：聊天页面收到新消息时的播放音频文件的路径。

19. `Appearance.chat.receiveTranslationColor = value`：消息接收方翻译文本颜色。

20. `Appearance.chat.sendTranslationColor = value`：消息发送方翻译文本颜色。

21. `Appearance.chat.enableTranslation = value`：是否开启文本消息长按翻译功能，默认为 `false`，即该功能默认关闭。如需开启该特性，需设置为 `true`。

22. `Appearance.chat.targetLanguage = value`：翻译目标语言默认为中文。

























