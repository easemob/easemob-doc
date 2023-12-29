# 主题

ChatroomUIkit 内置浅色和深色主题，默认为浅色主题。

- 浅色主题

![img](@static/images/uikit/chatroomandroid/light_mode.png =500x500)

- 深色主题

![img](@static/images/uikit/chatroomandroid/dark_mode.png =500x500)

## 自定义主题

你可以通过更新主题相关的配置项自定义主题。若对任何配置项不做修改，可以使用默认主题。

```kotlin
@Composable
fun ChatroomUIKitTheme(
    isDarkTheme: Boolean = isSystemInDarkTheme(),
    colors: UIColors = if (!isDarkTheme) UIColors.defaultColors() else UIColors.defaultDarkColors(),
    shapes: UIShapes = UIShapes.defaultShapes(),
    dimens: UIDimens = UIDimens.defaultDimens(),
    typography: UITypography = UITypography.defaultTypography(),
    content: @Composable () -> Unit
)
```

