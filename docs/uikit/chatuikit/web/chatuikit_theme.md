# 主题

<Toc />

单群聊 UIKit 内置浅色和深色主题，默认为浅色主题。

- 浅色主题

![img](@static/images/uikit/chatuikit/web/light_mode.png)

- 深色主题

![img](@static/images/uikit/chatuikit/web/dark_mode.png)

## 切换内置主题

你可以切换为浅色或深色主题：

```jsx
import { UIKitProvider } from 'easemob-chat-uikit';

const App = () => {
  return (
    <UIKitProvider
      theme={{
        mode: 'light', // 浅色或深色主题
      }}
    ></UIKitProvider>
  );
};
```

## 自定义主题色

在单群聊 UIKit 中， 主题色要用于默认头像颜色，消息气泡颜色，按钮颜色等位置。默认的主题色如下图所示，你可以自定义为其他颜色。

![img](@static/images/uikit/chatweb/image.png)

```javascript
import { UIKitProvider } from 'agora-chat-uikit';

const App = () => {
  return (
    <UIKitProvider
      theme={{
        primaryColor: '#00CE76', // 16 进制颜色值
      }}
    ></UIKitProvider>
  );
};
```

## 设置组件形状

默认情况下，组件为大圆角形状。你可以设置 `componentsShape` 修改消息气泡、头像和输入框的圆角。

```javascript
import { UIKitProvider } from 'easemob-chat-uikit';

const App = () => {
  return (
    <UIKitProvider
      theme={{
        componentsShape: 'square', // 小圆角（square）或大圆角（ground）
      }}
    ></UIKitProvider>
  );
};
```

## 设置 SCSS 变量

单群聊 UIKit 内部使用 SCSS，并定义了一些全局变量。如果你的项目也使用 SCSS，可以通过覆盖这些全局变量修改主题，不过，这种用法并不推荐。

你可以点击[这里](https://github.com/easemob/Easemob-UIKit-web/blob/dev/common/style/themes/default.scss)查看定义的变量。

下文介绍如何修改这些变量。

### 在 Create React App 项目中修改 SCSS 变量 

在使用 Create React App 创建的项目中，你可以创建一个 SCSS 文件用于覆盖默认的变量。在以下示例中，我们将创建的文件命名为 `your-theme.scss`，然后按照下面的顺序引入文件。 

```scss
@import 'easemob-chat-uikit/style.scss'; // easemob-chat-uikit 主题
@import 'your-theme.scss'; // 你的主题文件
@import 'easemob-chat-uikit/components.scss'; // UIKit 组件样式
```

### 通过修改 Webpack 配置覆盖 SCSS 变量

通过配置 SCSS 加载器自动引入自定义的 `style.scss` 文件，覆盖 UIKit 内部的 SCSS 变量。

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              additionalData: `@import "@/styles/index.scss";`,
            },
          },
        ],
      },
    ],
  },
};
```

## 设计指南

如果你对主题颜色，设计指南和细节有任何疑问，您可以在 Figma 设计稿中添加评论并提及我们的设计师 Stevie Jiang。

- [UI 设计资源](https://www.figma.com/community/file/1322495388317476706/chatroom-uikit)。

- [UI 设计指南](design_guide.html)。
