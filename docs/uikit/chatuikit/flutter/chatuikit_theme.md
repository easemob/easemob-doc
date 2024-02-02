# 主题

<Toc />

单群聊 UIKit 内置浅色和深色主题，默认为浅色主题。

```dart
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      ...
      builder: (context, child) {
        // 设置单群聊 UIKit 主题
        return ChatUIKitTheme(child: child!);
      },
    );
  }
```

- 浅色主题
// TODO: 图片

- 深色主题
// TODO: 图片

## 切换主题

若从当前的主题切换到单群聊 UIKit 内置的浅色或深色主题，可使用以下方法：

```dart
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      ...
      builder: (context, child) {
        return ChatUIKitTheme(
          // 设置使用亮色主题，暗色为：ChatUIKitColor.dark()。
          color: ChatUIKitColor.light(),
          child: child!,
        );
      },
    );
  }
```

## 切换为自定义主题

自定义设置主题时，需要参考[设计指南](https://github.com/StevieJiang/Chatroom-UIkit-Design-Guide/blob/main/README.md)的主题色定义以下五种主题色的色相值。

单群聊 UIKit 中的所有颜色均使用 HSLA 颜色模型定义，该模型是一种使用色调、饱和度、亮度和 Alpha 表示颜色的方式。

- H（Hue）：色相，颜色的基本属性，是色轮上从 `0` 到 `360` 的度数。`0` 是红色，`120` 是绿色，`240` 是蓝色。

- S（饱和度）：饱和度是颜色的强度或纯度。饱和度越高，颜色越鲜艳；饱和度越低，颜色越接近灰色。饱和度以百分比值表示，范围为 `0%` 到 `100%`。`0%` 表示灰度，`100%` 表示全色。

- L（明度）：明度是颜色的亮度或暗度。亮度越高，颜色越亮；亮度越低，颜色越深。亮度以百分比值表示，范围为 `0%` 到 `100%`。`0%`表示黑色，`100%` 表示白色。

- A（Alpha）：Alpha 是颜色的透明度。值 `1` 表示完全不透明，`0` 表示完全透明。

通过调整 HSLA 模型的色相值，你可以实现精确的色彩控制。

```dart
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      ...
      builder: (context, child) {
        return ChatUIKitTheme(
            // 调整亮色模式下的色值，暗色为: 
            //  ChatUIKitColor.dark(
            //     primaryHue: 203,
            //     secondaryHue: 155,
            //     errorHue: 350,
            //     neutralHue: 203,
            //     neutralSpecialHue: 220,
            //  ),
          color: ChatUIKitColor.light(
            primaryHue: 203,
            secondaryHue: 155,
            errorHue: 350,
            neutralHue: 203,
            neutralSpecialHue: 220,
          ),
          child: child!,
        );
      },
    );
  }
```

