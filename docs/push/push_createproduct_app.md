## 创建产品及应用

本文档主要指导您如何在环信推送控制台创建产品和应用，以及如何配置应用。
创建推送前，需要先进行如下操作：

![img](/images/instantpush/push_createproduct_app.png)

### 1、创建环信应用

[注册环信账号，登录环信控制台](/product/console/account_register.html)，[创建应用](/product/console/app_create.html)。

### 2、开通推送服务

创建推送任务前，你需在 [环信控制台](https://console.easemob.com/user/login) 开通即时推送服务。

若仅需测试推送功能，请使用全功能应用 `Demo`，在对话框中点击 **测试DemoKey**。

![img](/images/console/push_task_create.png)

### 3、集成环信PUSH服务

#### 3.1 SDK下载

环信推送与 IM 使用相同的 SDK，SDK下载地址：[SDK 下载页](https://www.easemob.com/download/im) 。

![img](/images/instantpush/push_sdk_download.png)

:::tip
环信IM用户可直接使用，无需进行移动端集成。
:::

#### 3.2 推送集成

详细Android 推送集成参考文档:[Android 推送集成](push_integration_process_android.html)
详细iOS SDK集成参考文档:[iOS SDK集成](push_integration_process_ios.html)

### 4、配置推送证书

选择**功能配置 > 增值功能 > 即时推送 > 证书管理**，点击 **添加推送证书** 进行厂商证书的添加。

环信PUSH支持全平台系统下发，覆盖谷歌、苹果、华为、小米、魅族、OPPO、vivo、荣耀等主流手机厂商通道，iOS双证书支持。 PUSH与IM使用相同的SDK，证书配置可以通用。

![img](/images/instantpush/push_certificate_add.png)

### 5、绑定推送用户

未使用环信即时通讯 IM 的用户，需要单独创建用户并进行用户体系集成。
在环信即时通讯 IM 的左侧导航栏中，选择 **功能配置 > 增值功能 > 即时推送**，在 **用户管理** 页面，点击 **创建PUSH用户** 可以在页面中添加用户，也可使用 REST API进行用户配置。
用户体系集成介绍参考文档：[用户体系集成](/document/server-side/account_system.html) 

![img](/images/instantpush/push_bind_user.png)
