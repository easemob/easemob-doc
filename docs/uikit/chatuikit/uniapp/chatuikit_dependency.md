# 集成 UIKit

<Toc />

本文介绍如何将单群聊 UIKit 集成到你的 uni-app 项目中。

## 前提条件

开始集成前，请确保你的开发环境满足以下条件：

- HBuilderX 最新版
- Vue3
- sass：sass-loader 10.1.1 及之前版本
- node：12.13.0 - 17.0.0，推荐 LTS 版本 16.17.0
- npm：版本请与 Node.js 版本匹配

## 下载 UIKit 源码

从 [GitHub](https://github.com/easemob/easemob-uikit-uniapp) 或 [Gitee](https://gitee.com/easemob-code/easemob-uikit-uniapp) 获取单群聊 UIKit 源码：

```bash
# 克隆 UIKit
git clone https://github.com/easemob/easemob-uikit-uniapp.git
# 或
git clone https://gitee.com/easemob-code/easemob-uikit-uniapp.git
```

克隆项目后，在你的 uni-app 项目根目录下执行以下命令，拷贝组件文件：

```bash
mkdir -p ./ChatUIKit
# macOS
mv ${组件项目路径}/ChatUIKit/* ./ChatUIKit
# windows
move ${组件项目路径}/ChatUIKit/* .\ChatUIKit
```

:::tip
UIKit 中依赖的静态资源（`ChatUIKit/assets`）放置在环信服务器中，存在访问频率限制，建议你将静态资源放置在你的业务服务器上，然后修改 `ChatUIKit/const/index.ts` 文件中的 `ASSETS_URL` 为你的资源服务器地址。
:::

## 安装依赖

:::tip
环信即时通讯 IM Web SDK 4.10.0 及以上。
:::

在项目根目录下执行以下命令，安装所需依赖：

```bash
npm init -y
npm i easemob-websdk@4.11.0 pinyin-pro@3.26.0 mobx@6.13.4 --save
```
