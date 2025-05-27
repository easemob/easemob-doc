# 私有化部署流程说明

<Toc />

## 1、服务说明

​为满足私有化客户试用体验、二次开发验证及正式使用等需求，我们致力于提供一种高效、安全、灵活的自动化安装部署方案，无论部署在本地服务器、云端或者信创等任意环境，都可以使用到一致的高质量服务。

同时为了客户能够更便捷地开始使用产品，整套自动化部署流程非常简单，已提供相应安装介质及统一申请授权流程，只需提供使用需求信息，即可快速获取授权，具体流程可见文中详解，期待满足您的私有化部署需求，为您提供卓越的服务体验。

## 2、部署流程

![img](/images/privitization/deploy_flowchart.png)

### 2.1 下载部署资料

信息安全已成为国家重要安全战略，各行业客户对业务环境、功能及数据存储的安全性要求越来越高。需要将功能完备的即时通讯服务部署到内网物理服务器集群、公有云以及私有云等多种平台，请根据实际使用场景选择安装包及部署手册，下载后请按照部署手册要求准备环境并实施部署。

| 安装包名称       | 适配环境要求           | 下载安装包         | 下载部署手册      |
| :------------ | :----- | :------- | :------------------------------------------- |
| 环信私有化即时通讯服务安装包（单机版） | 操作系统：Linux、ubuntu 20 及以上、centos 7 及以上 CPU 架构：X86（优先推荐）、ARM | [立即下载](https://zim-private.oss-cn-beijing.aliyuncs.com/zim/ZIM-23.1.5.x86_64-license/20230912/ZIM-23.1.5.x86_64.all.tar) | [立即下载](https://zim-private.oss-cn-beijing.aliyuncs.com/zim/ZIM-23.1.5.x86_64-license/%E7%8E%AF%E4%BF%A1%E7%A7%81%E6%9C%89%E5%8C%96IM%E9%83%A8%E7%BD%B2%E6%96%87%E6%A1%A320230516.pdf) |

### 2.2 申请授权

当服务部署完成后，处于未授权状态，需要根据当前服务机器码申请授权。

1. 获取机器码

使用部署手册中提供的环信控制台信息（包括登录地址、登录账号）进行登录，登录成功后，在环信控制台首页获取机器码标识。

![img](/images/privitization/deploy_machine_code.png)

2. 申请授权码 license

无论是正式版还是试用版服务，均可通过填写机器码信息申请授权，[申请授权地址](https://get-license.easemob.com/)。

-正式版：支持设置服务用户量及使用时间，申请后商务经理一日内反馈提供；

-试用版：固定服务用户量及使用时间，申请后立即生成，可进行试用体验；

3. 配置授权码 license

获取授权码后，登录环信控制台首页，点击 **激活 License** 按钮，在弹窗中填写授权码信息，点击 **确定** 生效。

![img](/images/privitization/deploy_auth_code.png)

### 2.3 验证服务

当服务配置完成后，可直接使用 Web IM-Demo  进行各类消息及功能测试，在浏览器中输入地址：**http://IP:12005**，即可访问 Web IM-Demo。

1. 验证授权：

通过注册用户账号验证服务是否被授权，如果注册成功，则已开通用户授权；如果注册失败，客户端提示错误码 “无license”，此时需要登录环信控制台检查 license 配置是否生效。

2. 验证功能：

启动两个 Web IM-Demo ，可以完成添加好友、创建会话、发送消息等功能验证。

## 3、集成测试

当服务端验证完成后，可通过下载需要的客户端 SDK 及 Demo 进行集成体验。环信客户端 SDK 已对  IM 核心服务完成封装， 通过调用 SDK API 接口，即可快速获得消息收发 、会话管理 、群组 、好友 、聊天室等功能。目前客户端 SDK 已覆盖 Windows 、Linux 、MacOS 、Android 、iOS 、Web 、小程序等多种平台，服务器端 SDK 已覆盖 Java 、PHP 等平台，[下载私有化客户端 SDK](http://doc.easemob.com/product/uc_private.html#私有化-sdk-下载)。

示例一：以 Android 端 demo 体验为例

下载并安装 demo 后，打开应用服务器设置页面，配置以下信息：

- 使用自定义服务器：开启
- appkey：easemob-demo#zim
- 使用私有化服务器：开启
- IM server：私有化服务器主机地址
-  IM Port：msync 端口，6717
- Rest server 地址&端口：Rest API 地址

![img](/images/privitization/deploy_android_custom_server.png)

示例二：以iOS端 demo体验为例

下载并安装demo后，打开应用服务器设置页面，配置以下信息

- 使用自定义服务器：开启
- appkey：easemob-demo#zim
- Specify Server：开启
- IM server：私有化服务器主机地址
-  IM Port：msync端口，6717
- Rest server 地址&端口：Rest api地址

![img](/images/privitization/deploy_ios_custom_server.png)

## 4、联系我们

如果您准备使用或正在使用私有化即时通讯服务，有任何疑问和建议，欢迎您添加方案负责人或提交工单与我们交流

1. 联系方案负责人

微信 扫一扫，添加方案负责人：

![img](/images/privitization/deploy_wechat_code.png)

2. 提交工单

登录[环信通讯云管理后台](https://console.easemob.com/user/login)，点击“服务支持-工单支持”，点击“进入工单系统”

![img](/images/privitization/deploy_ticket.png)

3. Geek 社区

[Geek开发者社区](http://www.imgeek.org/)里面的环信专区/环信技术交流板块提供了很多常见问题的讨论和解答，您也可以发帖提问，我们的技术和服务人员会尽力解答您的疑问！

- 技术咨询邮箱：[support@easemob.com](mailto:support@easemob.com)