# 主题

<Toc />

`Chat UIKit SDK` UI 组件库内置浅色和深色主题，默认为浅色主题。

- 浅色主题

![img](@static/images/uikit/chatuikit/android/light_mode.png)

- 深色主题

![img](@static/images/uikit/chatuikit/android/dark_mode.png)

使用默认主题，代码如下：

```tsx
export function App() {
  const palette = usePresetPalette();
  const dark = useDarkTheme(palette);
  const light = useLightTheme(palette);
  const theme = React.useRef("light").current;

  return (
    <Container
      options={{ appKey: "appKey" }}
      palette={palette}
      theme={theme === "light" ? light : dark}
    >
      {/* 添加子组件。 */}
    </Container>
  );
}
```

## 主题自定义

主题由 `Palette` 和 `Theme` 组成。

- `Palette`：主题的调色板。
- `Theme`：通过选择不同的颜色和样式组成明暗默认主题。

主题接口定义如下：

| 属性    | 类型     | 描述                                      |
| ------------ | -------- | ------------------------------------------------ |
| style        | 主题类型 | 明暗两种类型。                                   |
| button       | 按钮主题 | 支持自定义样式和大小。                           |
| shadow       | 阴影主题 | 支持自定义样式。                                 |
| cornerRadius | 边框圆角 | 支持自定义头像、警告框、输入框、消息气泡的圆角。 |

### 修改主题颜色

通过 `useCreatePalette` hook 方法获取自定义颜色的调色板，再通过 `useCreateTheme` hook 方法创建 `Theme` 对象使用。

例如：

```tsx
export function App() {
  const { createPalette } = useCreatePalette({
    colors: {
      primary: 203,
      secondary: 155,
      error: 350,
      neutral: 203,
      neutralSpecial: 220,
    },
  });
  const palette = createPalette();
  const light = useLightTheme(p, "global");

  return (
    <Container options={{ appKey: "appKey" }} palette={palette} theme={light}>
      {/* 添加子组件。 */}
    </Container>
  );
}
```

### 修改样式

除了颜色，你还可以修改字体、边框圆角等样式。

```tsx
export function App() {
  // 通过调色板修改
  const palette = usePresetPalette();
  // 修改边框圆角大小
  palette.cornerRadius.large = 20;
  // 修改标题样式
  palette.fonts.title.large = {
    fontSize: 20,
    fontWeight: "normal",
    lineHeight: 24,
  };

  // 通过主题修改。
  const light = useLightTheme(palette);
  // 修改消息气泡边框圆角大小
  light.cornerRadius.bubble = ["extraSmall"];

  return (
    <Container
      options={{ appKey: "appKey" }}
      palette={palette}
      theme={theme === "light" ? light : dark}
    >
      {/* 添加子组件。 */}
    </Container>
  );
}
```

## 设计指南

对比 `react-native` 的其它的主题方案(例如：`react-native-paper`, `sendbird-uikit-react-native`), 这里设计更加简单实用。

[主题设计参考](https://www.figma.com/community/file/1322495388317476706)
