# 可配项修改

<Toc />

`Appearance.swift` 是容纳了所有可配项的类。这些可配项都有默认值，如果要修改某些配置项，需要在初始化对应 UI 控件之前修改其中的属性，配置项才生效。

## 通用可配项

注意下述 `value` 为要设置的值，会改变对应配置项的 UI 样式或者数据源等。请查看[源码](https://github.com/easemob/chatuikit-ios)后使用。

1. `Appearance.pageContainerTitleBarItemWidth = value`：底部弹窗页面标题栏的宽度。若要配置，请在 Xcode 中的文件中搜索 `PageContainerTitleBar.swift`。

![img](/images/uikit/chatuikit/ios/configurationitem/common/Appearance_pageContainerTitleBarItemWidth.png) 

2. `Appearance.pageContainerConstraintsSize = value`：底部弹窗页面的宽度和高度。主要使用类在 Xcode 中查找到 `PageContainersDialogController.swift` 查看该属性。

![img](/images/uikit/chatuikit/ios/configurationitem/common/Appearance_pageContainerConstraintsSize.png)

3. Alert 的样式：

-  `Appearance.alertContainerConstraintsSize = value`：Alert 居中类型弹窗的宽度和高度。主要使用类在 Xcode 中查找到 `AlertController.swift`

- `Appearance.alertStyle = value`：弹窗的圆角样式，即是大圆角还是小圆角。

![img](/images/uikit/chatuikit/ios/configurationitem/common/Appearance_alertContainerConstraintsSize.png)

4. `Appearance.primaryHue = value`：主色调，用于按钮、输入框等控件的背景色。

5. `Appearance.secondaryHue = value`：辅色调，用于按钮、输入框等控件的背景色。

6. `Appearance.errorHue = value`：错误色调。

7. `Appearance.neutralHue = value`：中性色调。

8. `Appearance.neutralSpecialHue = value`：中性特殊色调。

9. `Appearance.avatarRadius = value`：头像圆角，分为极小、小、中、大等四个等级。

10. `Appearance.actionSheetRowHeight = value`：ActionSheet Cell 的行高。

![img](/images/uikit/chatuikit/ios/configurationitem/common/Appearance_actionSheetRowHeight.png)

11. `Appearance.avatarPlaceHolder = value` 头像占位图。
























