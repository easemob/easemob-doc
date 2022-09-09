# Vue Demo（WebIM）介绍

<Toc />

环信即时通讯 WEB 端提供示例应用可供体验。为方便体验，建议使用你自己的 Demo 应用，具体步骤如下：

1. 在 [环信即时通讯云 IM 管理后台](https://console.easemob.com/user/login) 通过邮箱注册，可以看到默认的 Demo 应用（默认应用是全功能开通的应用）；
2. 在上图页面 Demo 应用右侧点击 **查看**，选择 **开放注册**；

![img](@static/images/web/3.png)

3. 打开 Demo，找到 `src/utils/WebIMConfig`；
4. 将 Demo 的 App Key 填入，保存配置；
5. 运行 Demo，然后点击 **注册用户** 进行体验。

:::notice
注册模式分两种，开放注册和授权注册。只有开放注册时，才可以客户端注册。
- 开放注册是为了测试使用，正式环境中不推荐使用该方式注册环信账号；
- 授权注册的流程应该是你的应用服务器通过环信提供的 REST API 注册，之后将 token 保存到你的应用服务器或返回给客户端。
:::

## 代码下载

- 下载源代码：[github 源码地址](https://github.com/easemob/webim-vue-demo)

欢迎大家提交 PR 改进和修复 WebIM 中的问题。

## 运行 WebIM 工程

从 [github 下载](https://github.com/easemob/webim-vue-demo) 在 `webim-vue-demo` 文件夹下，即为 WebIM 的工程目录。

1. 初始化安装
    - `npm install`
2. 运行 demo
    - `npm start`  
    http://localhost:3001
    - `HTTPS=true npm start` (webrtc supports HTTPS only)  
    https://localhost:3001

## 主要模块介绍

Demo 中有几大模块

- assets —— 资源文件
- components —— 项目中定义的组件
- config —— 消息表情
- pages —— 登录和聊天页面
- router —— 路由
- store —— 使用 Vuex 处理的数据
- utils —— SDK 配置

## 部分 UI 展示

![img](@static/images/web/vue_demo.png)