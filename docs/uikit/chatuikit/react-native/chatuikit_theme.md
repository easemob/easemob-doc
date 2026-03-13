# 主题和调色板

## 概述

UIKit 提供了灵活的主题定制能力，让您可以根据品牌需求自定义界面外观。主题系统包含三个核心部分：

- **调色板（Palette）**：基础颜色和样式系统，定义颜色、字体、渐变、圆角等基础元素
- **主题（Theme）**：基于调色板构建的高级主题配置，提供明暗两种风格
- **字体（FontFamily）**：全局字体配置，支持普通字体、Emoji 字体和标题字体

所有配置均在 `Container` 组件初始化时设置，全局生效。

## 调色板

### 调色板定义

调色板（`Palette`）是主题系统的基础，定义了应用中使用的所有颜色、字体样式、渐变和圆角。采用 HSL 色彩模型，可精确控制色相、饱和度和亮度。

### 使用默认调色板

如果你不熟悉颜色配置或希望快速上手，可直接使用内置的预设调色板。预设调色板提供了一套经过精心设计的默认颜色，开箱即用。

```tsx
import { usePresetPalette } from "react-native-chat-uikit";

export function App() {
  const palette = usePresetPalette();

  return (
    <UIKitContainer palette={palette} options={getOptions()}>
      {/* 子组件 */}
    </UIKitContainer>
  );
}
```

### 创建自定义调色板

通过 `useCreatePalette` 创建自定义调色板，自定义主色、辅助色、错误色等：

```tsx
import { useCreatePalette } from "react-native-chat-uikit";

export function App() {
  // 使用 HSL 色相值（0-360）定义颜色
  const customParams = {
    colors: {
      primary: 203, // 主色 - 蓝色系
      secondary: 155, // 辅助色 - 绿色系
      error: 350, // 错误色 - 红色系
      neutral: 203, // 中性色
      neutralSpecial: 220, // 特殊中性色
    },
  };

  const { createPalette } = useCreatePalette(customParams);
  const customPalette = createPalette();

  return (
    <UIKitContainer palette={customPalette} options={getOptions()}>
      {/* 子组件 */}
    </UIKitContainer>
  );
}
```

### 调整调色板的颜色

创建调色板后，你可以根据需要直接修改具体的颜色值。调色板中的每个颜色都包含从 0 到 100 的亮度级别，方便你精细调整。

#### 颜色层级结构

每个基础色（如 `primary`）会自动生成一系列亮度变体：

- `primary.0` 到 `primary.100`：不同亮度的颜色变体
- 数值越小颜色越深，越大颜色越浅

#### 修改示例

```tsx
const customPalette = createPalette();

// 示例 1：整体修改主色色系
// 将主色从默认值改为青色系（色相 180°）
customPalette.colors.primary = generatePrimaryColor(180); 

// 示例 2：调整特定亮度级别的颜色
// 修改主色在亮度 6 级别的具体色值
customPalette.colors.primary[6] = "hsla(203, 100%, 60%, 1)";
```

#### 亮度级别说明

| 亮度级别   | 用途               | 示例                         |
| :--------- | :----------------- | :--------------------------- |
| `[0-10]`   | 深色背景、边框     | primary.1 常用于深色按钮背景 |
| `[11-30]`  | 主要文本、图标     | primary.20 常用于主要文字    |
| `[31-70]`  | 普通背景、次要元素 | primary.50 常用于普通背景色  |
| `[71-90]`  | 浅色背景、禁用状态 | primary.80 常用于浅色背景    |
| `[91-100]` | 极浅色、高亮区域   | primary.95 常用于高亮底色    |

### 自定义字体样式

调色板支持四种字体类型，每种包含四种尺寸：

| 类型       | 用途   | 尺寸选项                      |
| :--------- | :----- | :---------------------------- |
| `headline` | 大标题 | large/medium/small/extraSmall |
| `title`    | 标题   | large/medium/small/extraSmall |
| `label`    | 标签   | large/medium/small/extraSmall |
| `body`     | 正文   | large/medium/small/extraSmall |

修改字体样式示例：

```tsx
// 修改大标题字体
customPalette.fonts.headline = {
  large: {
    fontSize: 24, // 原为 23
    fontWeight: "600",
    lineHeight: 32,
    ...customPalette.fonts.headline.large,
  },
  ...customPalette.fonts.headline,
};

// 修改正文字体
customPalette.fonts.body = {
  large: {
    fontSize: 18,
    fontWeight: "400",
    lineHeight: 24,
    ...customPalette.fonts.body.large,
  },
  ...customPalette.fonts.body,
};
```

## 主题

主题（`Theme`）是基于调色板构建的高级配置层，将基础颜色和样式组合成统一的界面视觉语言。UIKit 内置了明暗两种主题，满足不同场景下的显示需求。

### 使用默认主题

内置明暗两种主题，可动态切换：

```tsx
import { useDarkTheme, useLightTheme } from "react-native-chat-uikit";

export function App() {
  const palette = usePresetPalette();
  const darkTheme = useDarkTheme(palette); // 暗色主题
  const lightTheme = useLightTheme(palette); // 亮色主题

  const [isDark, setIsDark] = React.useState(false);

  return (
    <UIKitContainer
      palette={palette}
      theme={isDark ? darkTheme : lightTheme}
      options={getOptions()}
    >
      {/* 子组件 */}
    </UIKitContainer>
  );
}
```

### 创建自定义主题

使用 `useCreateTheme` 创建完全自定义的主题：

```tsx
import { useCreateTheme } from "react-native-chat-uikit";

export function App() {
  const palette = usePresetPalette();

  const params = React.useMemo(() => {
    return {
      palette,
      themeType: "light" as ThemeType,
      releaseArea: "global" as ReleaseArea,
    };
  }, [palette]);

  const { createTheme } = useCreateTheme(params);
  const customTheme = createTheme();

  return (
    <UIKitContainer
      palette={palette}
      theme={customTheme}
      options={getOptions()}
    >
      {/* 子组件 */}
    </UIKitContainer>
  );
}
```

### 自定义阴影效果

主题对象中包含阴影样式，支持自定义按钮、卡片等组件的阴影效果：

```tsx
import type { Shadow } from "react-native-chat-uikit";

const customTheme = createTheme();

// 修改小尺寸阴影
customTheme.shadow.style.small = [
  {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as Shadow,
];

// 修改中等尺寸阴影
customTheme.shadow.style.medium = [
  {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  } as Shadow,
];
```

### 自定义圆角样式

主题中的圆角配置会影响头像、输入框、消息气泡等组件：

```tsx
customTheme.cornerRadius = {
  avatar: "large", // 头像圆角：small | medium | large | extraLarge | extraSmall
  alert: "medium", // 提示框圆角
  input: "extraLarge", // 输入框圆角
  bubble: ["extraSmall", "medium", "extraLarge"], // 消息气泡支持多种圆角
};
```

## 字体

### 字体类型

UIKit 提供三种字体（`FontFamily`）配置，分别应用于不同的界面元素：

| 配置项             | 作用范围       |
| :----------------- | :------------- |
| `fontFamily`       | 大部分 UI 文本 |
| `emojiFontFamily`  | Emoji 表情显示 |
| `headerFontFamily` | 导航栏和标题   |

### 使用自定义字体

组件库支持通过主题配置全局使用自定义字体。你只需完成字体加载、标识符设置、组件应用三个步骤。

1. **加载字体对象**：
   在应用入口处，使用字体加载工具（如 `useFonts`）加载自定义字体文件，并为其定义一个标识符（如字体名称）。
2. **设置字体标识符**：
   在 `UIKitContainer` 组件中，通过 `fontFamily` 属性传入字体标识符，将字体应用到整个 UI 组件库。
3. **在组件中使用字体**：
   在自定义组件中，可通过 `useConfigContext()` 获取当前设置的字体标识符，并应用到文本样式上。

```tsx
export function App() {
  // 加载字体对象
  const fontFamily = 'Twemoji-Mozilla';
  const [fontsLoaded] = useFonts({
    [fontFamily]: require('../assets/Twemoji.Mozilla.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  // 设置字体标识符
  return (
    <UIKitContainer
      palette={palette}
      theme={theme}
      fontFamily={fontFamily} // 普通文本字体
      options={getOptions()}
    >
      {/* 子组件 */}
    </UIKitContainer>
  );
}

// 使用字体
import { useConfigContext } from 'react-native-chat-uikit'
export function MyComponent() {
  const { fontFamily } = useConfigContext();
  return <Text style={{fontFamily}}>"Test Font Family"</Text>
}
```

## 发布区域

UIKit 支持根据不同发布区域（Release Area）自动调整界面风格：

- **china**：中国区风格，使用较小的圆角
- **global**：国际区风格，使用较大的圆角

```tsx
export function App() {
  return (
    <UIKitContainer
      palette={palette}
      theme={theme}
      releaseArea="global" // 或 "china"
      options={getOptions()}
    >
      {/* 子组件 */}
    </UIKitContainer>
  );
}
```

**区域影响范围：**

- 头像圆角大小
- 输入框圆角大小
- 提示框圆角大小
- 消息气泡圆角选项

## 完整示例

以下为包含自定义调色板、主题和字体的完整示例：

```tsx
import * as React from "react";
import {
  UIKitContainer,
  usePresetPalette,
  useCreatePalette,
  useLightTheme,
  useDarkTheme,
  generatePrimaryColor,
} from "react-native-chat-uikit";

export function App() {
  // 创建自定义调色板
  const customParams = {
    colors: {
      primary: 210, // 蓝色系
      secondary: 160, // 绿色系
      error: 5, // 红色系
      neutral: 210,
      neutralSpecial: 220,
    },
  };

  const { createPalette } = useCreatePalette(customParams);
  const palette = createPalette();

  // 自定义字体大小
  palette.fonts.headline.large = {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
    ...palette.fonts.headline.large,
  };

  // 创建主题
  const darkTheme = useDarkTheme(palette);
  const lightTheme = useLightTheme(palette);

  // 自定义阴影
  darkTheme.shadow.style.medium = [
    {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  ];

  const [isDark, setIsDark] = React.useState(false);

  return (
    <UIKitContainer
      palette={palette}
      theme={isDark ? darkTheme : lightTheme}
      fontFamily="PingFang SC"
      headerFontFamily="PingFang SC Medium"
      releaseArea="global"
      options={getOptions()}
    >
      {/* 您的应用内容 */}
    </UIKitContainer>
  );
}
```

## 最佳实践

### 保持颜色系统一致

调色板的核心优势在于其自动生成的色彩梯度系统。建议只修改基础色相值（0-360），让系统自动生成完整的亮度变体，确保颜色体系的内在一致性。

```tsx
// ✅ 推荐：只修改色相
const customParams = {
  colors: {
    primary: 210, // 系统会自动生成 primary.0 到 primary.100
  },
};

// ❌ 不推荐：手动设置每个亮度级别
customPalette.colors.primary[0] = "#000000";// 深色
customPalette.colors.primary[1] = "#1a1a1a";// 次深色
// ... 手动设置 100 个色值不仅繁琐，且难以保证色彩过渡的自然性
```

### 配置顺序

建议遵循如下配置顺序：

1. 创建或获取调色板
2. 修改调色板的颜色和字体
3. 基于调色板创建主题
4. 修改主题的阴影和圆角

### 优化性能

主题和调色板的创建涉及颜色计算和样式生成，相对耗时，建议使用 `React.useMemo` 缓存：

```tsx
const palette = React.useMemo(() => {
  const { createPalette } = useCreatePalette(customParams);
  return createPalette();
}, [customParams]);

const theme = React.useMemo(() => {
  return useLightTheme(palette);
}, [palette]);
```
