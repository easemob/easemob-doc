# 集成 ChatroomUIKit

<Toc />

使用 ChatroomUIKit 之前，你需要将 ChatroomUIKit 集成到你的应用中。

## 前提条件

- React 16.8.0 或以上版本；
- React DOM 16.8.0 或以上版本；
- 有效的 Easemob IM 开发者账号，并[获取 App Key](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。

## 创建项目

```bash
# 安装 CLI 工具。
npm install create-react-app
# 构建一个 my-app 的项目。
npx create-react-app my-app
cd my-app
```

```
项目目录：
├── package.json
├── public                  # Webpack 的静态目录。
│   ├── favicon.ico
│   ├── index.html          # 默认的单页面应用。
│   └── manifest.json
├── src
│   ├── App.css             # App 根组件的 CSS。
│   ├── App.js              # App 组件代码。
│   ├── App.test.js
│   ├── index.css           # 启动文件样式。
│   ├── index.js            # 启动文件。
│   ├── logo.svg
│   └── serviceWorker.js
└── yarn.lock
```

## 安装 easemob-chat-uikit

- 通过 npm 安装，运行以下命令：

```bash
npm install easemob-chat-uikit --save
```

- 通过 yarn 安装，运行以下命令：

```bash
yarn add easemob-chat-uikit
```


