# Vue Demo（WebIM）介绍

<Toc />

环信即时通讯 Web 端提供示例应用可供体验。你可以按以下步骤体验：

1. 登录 [Vue 3 Demo](https://webim-vue3.easemob.com/login)

![img](/images/demo/web_vue3_login.png)

2. 输入你的手机号，获取验证码，然后输入。

3. 点击 **登录** 登录 Demo。

## 代码下载

- Vue 3：[GitHub 源码地址](https://github.com/easemob/webim-vue-demo/tree/vue3-miniCore)

## 运行 web-vue3-demo 项目

从 [github 下载](https://github.com/easemob/webim-vue-demo/tree/vue3-miniCore) 下载项目代码压缩包，然后解压。解压后，`webim-vue-demo` 文件夹即为 Web IM 的项目目录。
> 确保`node`运行环境为16或17版本。
1. 安装 Demo 所需的依赖：在终端执行 `npm install`或 `yarn` 命令。

2. 运行 Demo：
   - 在终端中运行 `npm run dev`。
   - 在浏览器中访问 `http://localhost:9001`，即可体验`webim-vue3-demo`。

## 主要模块介绍

Demo 中的主要模块如下：

| 模块名称     | 描述                   |
| :----------- | :--------------------- |
| `assets`     | 资源文件。             |
| `components` | 项目中定义的组件。     |
| `views`      | 登录和聊天等相关页面。       |
| `router`     | 路由。                 |
| `store`      | 使用 Vuex 处理的数据。 |
| `utils`      | 工具方法。             |

## 部分 Vue 3 Demo 界面展示

![img](/images/web/vue3_home.png)

![img](/images/web/vue3_chat.png)
