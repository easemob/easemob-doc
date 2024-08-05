# Vue Demo（WebIM）介绍

<Toc />

环信即时通讯 Web 端提供示例应用可供体验。你可以按以下步骤体验：

1. 登录 [Vue 3 Demo](https://webim-vue3.easemob.com/login)

![img](/images/demo/web_vue3_login.png)

2. 输入你的手机号，获取验证码，然后输入。

3. 点击 **登录** 登录 Demo。

## 代码下载

- Vue 3 下载源代码：[github 源码地址](https://github.com/easemob/webim-vue-demo/tree/demo-vue3)
- Vue 3（miniCore） 下载源码：[github 源码地址](https://github.com/easemob/webim-vue-demo/tree/vue3-miniCore) **miniCore 版本提供 WebIM SDK 按需引入示例以及本地会话使用方式示例，后续新功能将在此版本添加**。

欢迎大家提交 PR 改进和修复 Web IM 中的问题。

## 运行 Web IM 项目

从 [github 下载](https://github.com/easemob/webim-vue-demo/tree/dev-4.0) 下载项目代码压缩包，然后解压。解压后，`webim-vue-demo` 文件夹即为 Web IM 的项目目录。

1. 安装 Demo 所需的依赖：在终端中运行 `cd demo` 和 `npm install` 命令。

2. 运行 Demo：
   - 如果通过 HTTP 访问 Demo，在终端中运行 `cd demo` 和 `npm start` 命令。命令运行后会生成 Demo 的访问地址，例如 https://localhost:3001。通过 HTTP 访问的 Demo 中不包含音视频功能。
   - 如果通过 HTTPS 访问 Demo，在终端中运行 `cd demo` 和 `HTTPS=true npm start` 命令。命令运行后会生成 Demo 的访问地址，例如 https://localhost:3001。通过 HTTPS 访问的 Demo 中包含音视频功能。

## 主要模块介绍

Demo 中的主要模块如下：

| 模块名称     | 描述                   |
| :----------- | :--------------------- |
| `assets`     | 资源文件。             |
| `components` | 项目中定义的组件。     |
| `config`     | 消息表情。             |
| `pages`      | 登录和聊天页面。       |
| `router`     | 路由。                 |
| `store`      | 使用 Vuex 处理的数据。 |
| `utils`      | SDK 配置。             |

## 部分 Vue 3 Demo 界面展示

![img](/images/web/vue3_home.png)

![img](/images/web/vue3_chat.png)
