# React Demo（WebIM）介绍

<Toc />

环信即时通讯 Web 端提供示例应用可供体验。你可以按以下步骤体验：

1. [登录 Demo](https://webim-h5.easemob.com/#/login)。

![img](@static/images/demo/web_react_login.png)

2. 输入你的手机号，获取验证码，然后输入。

3. 点击 **登录** 登录 Demo。

## 代码下载

下载源代码：[github 源码地址](https://github.com/easemob/webim)

欢迎大家提交 PR 改进和修复 Web IM 中的问题。

## 运行 Web IM 项目

从 [IM SDK 及 Demo 下载](https://www.easemob.com/download/im) 下载 Web SDK 压缩包，然后解压。解压后在 `demo` 文件夹即为 Web IM 的项目目录。

1. 安装 Demo 所需的依赖：在终端中运行 `cd demo` 和 `npm install` 命令。

2. 运行 Demo：
   - 如果通过 HTTP 访问 Demo，在终端中运行 `cd demo` 和 `npm start` 命令。命令运行后会生成 Demo 的访问地址，例如 https://localhost:3001。通过 HTTP 访问的 Demo 中不包含音视频功能。
   - 如果通过 HTTPS 访问 Demo，在终端中运行 `cd demo` 和 `HTTPS=true npm start` 命令。命令运行后会生成 Demo 的访问地址，例如 https://localhost:3001。通过 HTTPS 访问的 Demo 中包含音视频功能。

## 主要模块介绍

Demo 中的主要模块如下：

| 模块名称     | 描述                                     |
| :----------- | :--------------------------------------- |
| `components` | 项目中定义的组件。                       |
| `config`     | SDK 初始化配置。                         |
| `containers` | 容器组件，包含联系人、聊天、登录和注册。 |
| `layout`     | 聊天部分的布局。                         |
| `selectors`  | 缓存数据，优化性能。                     |
| `utils`      | 数据库和工具方法。                       |

## 部分 UI 展示

![img](@static/images/web/react_demo.png)
