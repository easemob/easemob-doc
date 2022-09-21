# Vue Demo（WebIM）介绍

<Toc />

环信即时通讯 Web 端提供示例应用可供体验。为方便体验，建议使用你自己的 Demo 应用，具体步骤如下：

1. 在 [环信即时通讯云 IM 管理后台](https://console.easemob.com/user/login) 通过邮箱注册后登录，打开首页。

   在 **应用列表** 下可以看到默认的 Demo 应用。该 Demo 默认开通全部功能。

![img](@static/images/web/demo_view.png)

2. 选择 **即时通讯** > **服务概览**，在 **设置** 区域中配置 **用户注册模式**。

![img](@static/images/web/3.png)

:::notice
注册模式包含开放注册和授权注册：
- 开放注册：通过客户端注册环信账号。该方式只用于测试，在正式环境中不推荐使用。
- 授权注册：你的应用服务器通过环信提供的 REST API 注册环信账号，然后将 token 保存到你的应用服务器或返回给客户端。
:::

3. 修改为你的 App Key，即在环信即时通讯管理后台创建应用时即时通讯服务为你生成的 App Key。

在 `/demo/src/config/WebIMConfig.js` 文件中修改为你的 App Key。

## 代码下载

-下载源代码：[github 源码地址](https://github.com/easemob/webim-vue-demo/tree/dev-4.0)

欢迎大家提交 PR 改进和修复 Web IM 中的问题。

## 运行 Web IM 项目

从 [github 下载](https://github.com/easemob/webim-vue-demo/tree/dev-4.0) 下载 Web SDK 压缩包，然后解压。节后后， `webim-vue-demo` 文件夹即为 Web IM 的项目目录。

1. 安装 Demo 所需的依赖：在终端中运行 `cd demo` 和 `npm install` 命令。

2. 运行 Demo：
   - 如果通过 HTTP 访问 Demo，在终端中运行 `cd demo` 和 `npm start` 命令。命令运行后会生成 Demo 的访问地址，例如 http://localhost:3001。通过 HTTP 访问的 Demo 中不包含音视频功能。
   - 如果通过 HTTPS 访问 Demo，在终端中运行 `cd demo` 和 `HTTPS=true npm start` 命令。命令运行后会生成 Demo 的访问地址，例如 https://localhost:3001。通过 HTTPS 访问的 Demo 中包含音视频功能。

## 主要模块介绍

Demo 中的主要模块如下：

| 模块名称       | 描述                 |
| :------------- | :----------------- |
| `assets` | 资源文件。 |
| `components` | 项目中定义的组件。 |
| `config` | 消息表情。 |
| `pages` | 登录和聊天页面。 |
| `router` | 路由。 |
| `store` | 使用 Vuex 处理的数据。 |
| `utils` | SDK 配置。 |

## 部分 UI 展示

![img](@static/images/web/vue_demo.png)