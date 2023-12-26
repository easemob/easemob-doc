# 主题

主题即一个应用的主题颜色。ChatroomUIkit 内置浅色和深色主题，默认为浅色主题。

// TODO：将浅色和深色主题的截图贴在这里。截图

## 切换为内置主题 

若从当前的主题切换到 ChatroomUIKit 内置的浅色或深色主题，可使用以下方法：

````swift
Theme.switchTheme(style: .dark)
````

````swift
Theme.switchTheme(style: .light)
````

## 切换为自定义主题   

自定义设置主题时，需要参考[设计文档]()的主题色定义以下五种主题色的色相值。  // TODO：添加设计文档链接 含笑

ChatroomUIKit 中的所有颜色均使用 HSLA 颜色模型定义，该模型是一种使用色调、饱和度、亮度和 Alpha 表示颜色的方式。

- H（Hue）：色相，颜色的基本属性，是色轮上从 `0` 到 `360` 的度数。`0` 是红色，`120` 是绿色，`240` 是蓝色。

- S（饱和度）：饱和度是颜色的强度或纯度。饱和度越高，颜色越鲜艳；饱和度越低，颜色越接近灰色。饱和度以百分比值表示，范围为 `0%` 到 `100%`。`0%` 表示灰度，`100%` 表示全色。

- L（明度）：明度是颜色的亮度或暗度。亮度越高，颜色越亮；亮度越低，颜色越深。亮度以百分比值表示，范围为 `0%` 到 `100%`。`0%`表示黑色，`100%` 表示白色。

- A（Alpha）：Alpha 是颜色的透明度。值 `1` 表示完全不透明，`0` 表示完全透明。

通过调整 HSLA 模型的各个分量的值，你可以实现精确的色彩控制。

```Swift
Appearance.primaryHue = 191/360.0
Appearance.secondaryHue = 210/360.0
Appearance.errorHue = 189/360.0
Appearance.neutralHue = 191/360.0
Appearance.neutralSpecialHue = 199/360.0
Theme.switchTheme(style: .custom)
```

## 切换 App 中除 ChatroomUIKit 之外的其他视图的主题

设置 ChatroomUIKit 的主题后，若你希望 app 的其他部分也与 ChatroomUIKit 使用相同的主题，可以使用以下方法确保 app 使用统一主题。

1. 在 `Theme` 类中注册你的视图。

```Swift
Theme.registerSwitchThemeViews(view: self)
```

2. 在上述视图中实现 `ThemeSwitchProtocol` 协议。

```Swift
extension YourView: ThemeSwitchProtocol {

}
```

3. 在 `switchTheme` 方法中根据主题类型（浅色、深色和自定义）给你的子视图设置对应颜色。

## 设计指南 

如果你对主题颜色，设计指南和细节有任何疑问，您可以在 Figma 设计稿中添加评论并提及我们的设计师 Stevie Jiang。

-[UI 设计资源](https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?node-id=137%3A38589&mode=dev)。

-[UI 设计指南](https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?node-id=137)。
