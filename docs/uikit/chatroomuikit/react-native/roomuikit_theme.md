# 主题

ChatroomUIkit 内置浅色和深色主题，默认为浅色主题。每个 UI 组件都会用到主题。

// TODO：将浅色和深色主题的截图贴在这里。截图

## 切换主题 

若切换 ChatroomUIKit 内置的浅色或深色主题，可使用以下方法：

```tsx
// ...
// 设置主题 
const palette = usePresetPalette();
const dark = useDarkTheme(palette);
const light = useLightTheme(palette);
const [theme, setTheme] = React.useState(light);
// ...
// 添加组件到渲染树
<Container appKey={env.appKey} palette={palette} theme={theme} />;
// ...
// 切换为浅色或深色主题
setTheme(theme === light ? dark : light);
```

## 设置自定义主题颜色  

`usePresetPalette` 可以使用内置的默认主题颜色，也可以使用 `useCreatePalette` 设置自定义主题颜色。

```Swift
// 自定义颜色。通过修改颜色具体值，组件中对应颜色将统一改变。
// 参考这里：https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?type=design&node-id=101-41012&mode=design&t=Fzou3Gwsk4owLLbr-4
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
// ...
```

## 设计指南 

如果你对主题颜色，设计指南和细节有任何疑问，您可以在 Figma 设计稿中添加评论并提及我们的设计师 Stevie Jiang。

-[UI 设计资源](https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?node-id=137%3A38589&mode=dev)。

-[UI 设计指南](https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?node-id=137)。
