# 主题

`ChatUIKitTheme` 内置浅色和深色主题，默认为浅色主题。

- 浅色主题

![img](@static/images/uikit/chatroomandroid/light_mode.png)

- 深色主题

![img](@static/images/uikit/chatroomandroid/dark_mode.png)

## 切换主题

若切换 ChatUIKitTheme 内置的浅色或深色主题，可使用以下方法：

```tsx
// ...
// 设置主题 
ChatUIKitTheme(
  color: ChatUIKitColor.light() // 浅色主题， 暗色主题为：ChatUIKitColor.dark()。
  child: child, // chatroom_uikit 所有组件需要为主题组件的子组件
),
```

如果需要修改主题色，可以通过修改 `ChatUIKitColor` 的 `hue` 值：

```dart
ChatUIKitColor({
  this.primaryHue = 203,
  this.secondaryHue = 155,
  this.errorHue = 350,
  this.neutralHue = 203,
  this.neutralSpecialHue = 220,
  this.barrageLightness = LightnessStyle.oneHundred,
  this.isDark = false,
});
```

## 设计指南

如果你对主题颜色，设计指南和细节有任何疑问，您可以在 Figma 设计稿中添加评论并提及我们的设计师 Stevie Jiang。

-[UI 设计资源](https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?node-id=137%3A38589&mode=dev)。

-[UI 设计指南](https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?node-id=137)。
