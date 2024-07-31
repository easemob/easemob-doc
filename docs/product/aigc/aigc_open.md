# 跑通准备

本文介绍如何在[环信即时通讯云控制台](https://console.easemob.com/user/login)上完成跑通 AIGC 服务示例项目的准备。

### 1. 创建应用

登录[环信即时通讯云控制台](https://console.easemob.com/user/login)，点击**添加应用**，填写应用相关信息。

![img](@static/images/aigc/app_create.png)

### 2. 获取 app 信息

选中创建的应用，点击**管理**，进入**应用详情**页面，获取 **App Key**、**ClientID** 及**ClientSecret**。

![img](@static/images/aigc/app_view.png)

### 3. 配置服务

设置**用户注册模式**为**开放注册**，关闭好友关系检查。

![img](@static/images/aigc/service_config.png)

### 4. 创建机器人用户

选择**应用概览** > **用户认证**，创建 8 个机器人的账号。

:::tip
不能修改这 8 个基础账号的用户 ID，否则需要调整代码中 `BotSettingUtil` 中 8 个对应机器人的账号。
:::

![img](@static/images/aigc/robot_account_create.png)

### 5. 配置回调规则

选择**即时通讯** > **功能配置** > **消息回调**，点击**添加回调地址**，配置发送前和发送后回调地址。请确保环信即时通讯 IM 可以通过外网访问到回调地址。

若使用消息回调功能，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通该功能，详见[回调相关文档](/product/enable_and_configure_IM.html#配置消息回调)。

![img](@static/images/aigc/callback_address.png)




