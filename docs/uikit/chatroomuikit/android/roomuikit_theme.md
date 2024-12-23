# 主题

<Toc />

ChatroomUIkit 内置浅色和深色主题，默认为浅色主题。

- 浅色主题

![img](/images/uikit/chatroomandroid/light_mode.png)

- 深色主题

![img](/images/uikit/chatroomandroid/dark_mode.png)

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

## 设计指南 

如果你对主题颜色，设计指南和细节有任何疑问，您可以在 Figma 设计稿中添加评论并提及我们的设计师 Stevie Jiang。

- [UI 设计资源](https://www.figma.com/community/file/1322495388317476706/chatroom-uikit)。

- [UI 设计指南](design_guide.html)。

