# React Demo（WebIM）介绍

<Toc />

环信即时通讯 Web 端提供示例应用可供体验。为方便体验，建议使用你自己的 Demo 应用，具体步骤如下：

1. 在 [环信即时通讯云 IM 管理后台](https://console.easemob.com/user/login) 通过邮箱注册，可以看到默认的 Demo 应用（默认应用是全功能开通的应用）；
2. 在上图页面 Demo 应用右侧点击 **查看**，选择 **开放注册**；

![img](@static/images/web/3.png)

3. 打开 Demo，点击 **服务器配置**；
4. 将 Demo 的 App Key 填入，点击 **保存配置**；
5. 然后点击 **注册用户** 进行体验。

:::notice
注册模式分两种，开放注册和授权注册。只有开放注册时，才可以客户端注册。
- 开放注册是为了测试使用，正式环境中不推荐使用该方式注册环信账号；
- 授权注册的流程应该是你的应用服务器通过环信提供的 REST API 注册，之后将 token 保存到你的应用服务器或返回给客户端。
:::

## 代码下载

- 下载源代码：[github 源码地址](https://github.com/easemob/webim)

欢迎大家提交 PR 改进和修复 WebIM 中的问题。

## 运行 WebIM 工程

从 [IM SDK 及 Demo 下载](https://www.easemob.com/download/im) 下载 WEB SDK 压缩包，然后解压。解压后在 `demo` 文件夹下，即为 WebIM 的工程目录。

1. 初始化安装
    - 在 `/demo` 下执行 `npm install`
2. 运行 Demo
    - `cd demo && npm start`  
   http://localhost:3001
    - `cd demo && HTTPS=true npm start` (webrtc supports HTTPS only)  
   https://localhost:3001

## 主要模块介绍

Demo 中有几大模块

- components —— 项目中定义的组件
- config —— SDK 初始化配置
- containers —— 容器组件，包含 contact, chat, login/register
- layout —— chat 部分的布局
- selectors —— 缓存数据，优化性能
- utils —— 数据库和工具方法

## 部分 UI 展示

![img](@static/images/web/react_demo.png)