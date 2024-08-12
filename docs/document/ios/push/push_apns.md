# 在即时通讯 IM 中集成 APNs

本页介绍如何在即时通讯 IM 中集成 APNs 并测试推送是否成功集成。

## **创建推送证书**

按照以下步骤，在苹果开发者平台创建 APNs 推送证书。

### **步骤一 生成 CSR 文件**

1. 生成 Certificate Signing Request(CSR)：

![image](/images/ios/push/push_ios_2_keychain_access_csr.jpeg)

2. 填写你的邮箱（该邮箱是申请 App ID 的付费帐号）和常用名称（一般默认是计算机名，无需更改），并选择保存到硬盘。

![image](/images/ios/push/push_ios_3_cert_assistant_cert_info.jpeg)

3. 点击 **Continue**。 

![image](/images/ios/push/push_ios_4_cert_assistant_cert_save.jpeg)

本地生成 CSR 文件 `EMImDemoAPS.certSigningRequest`。

### **步骤二 创建 App ID**

1. 生成 App ID。如果已经有 App ID 可以跳至[步骤三](步骤三-创建-app-的-aps-证书)。// TODO：验证链接。在本文中查找“步骤”，验证链接。

![image](/images/ios/push/push_ios_5_create_app_id.jpeg)

2. 选择 App ID，点击 **Continue**。

![image](/images/ios/push/push_ios_6_register_new_id.jpeg)

3. 选择 App， 点击 **Continue**。

![image](/images/ios/push/push_ios_7_register_select_type.jpeg)

4. 输入你的 App ID 描述信息，可以输入工程名。设置 **Bundle ID**（在工程的 **General** 信息中），一般格式为 **com.youcompany.youprojname**。

![image](/images/ios/push/push_ios_8_register_type_app_desc.jpeg)

5. 选择需要支持 **Push Notification**，点击 **Continue**。

![image](/images/ios/push/push_ios_9_register_support_push_notifi.jpeg)

6. 确定信息准确后，点击 **Register**。

![image](/images/ios/push/push_ios_10_register_confirm_appid.jpeg)

### **步骤三 创建 app 的 APS 证书**

1. 返回到 App IDs 选择你需要推送的 app。

![image](/images/ios/push/push_ios_11_select_app_for_push.jpeg)

2. 找到 **Push Notifications**， 点击 **Configure**。

![image](/images/ios/push/push_ios_12_edit_app_id_config.jpeg)

3. 如果是开发模式，点击 **Development SSL Certificate** 下的 **Create Certificate**。如果是生产模式，点击 **Production SSL Certificate** 下的 **Create Certificate**。

![image](/images/ios/push/push_ios_13_APNs_SSL_cert.jpeg)

4. **Platform** 选择 **iOS**，**Choose File** 选择第一步中创建的 **CSR** 文件，点击 **Continue**。

![image](/images/ios/push/push_ios_14_select_csr.jpeg)

5. aps 文件创建成功了，点击 **Download** 下载到本地。（文件名：开发版本为 **aps_development.cer**，发布版本为 **aps.cer**）：

![image](/images/ios/push/push_ios_15_download_your_cert.jpeg)

### **步骤四 生成推送证书**

1. 导入证书：双击[步骤三](步骤三-创建-app-的-aps-证书)下载的文件（**aps_development.cer** 和 **aps.cer**）将其安装到电脑，在 **Keychain Access** 中，可以看到导入的证书。

![image](/images/ios/push/push_ios_16_keychain_access_apple_develop.jpeg)

2. 右键选择导出为 p12 文件（例如：存储为 `EMImDemoAPS.p12`），设置证书密钥。

![image](/images/ios/push/push_ios_17_keychain_access_export.jpeg)

### **步骤五 生成 Provisioning Profile 文件（PP 文件）**

1. 在 [iOS Developer Center](https://developer.apple.com/cn/)，选择 **Account** > **Certificates, Identifiers & Profiles** > **Profiles**。在 **Provisioning** 页签，点击 **Profiles** 右侧的 **+** 图标。

![image](/images/ios/push/push_ios_18_generate_provision_file.jpeg)

2. 选择 **iOS App Development**（这里演示开发版描述文件的创建, 发布版本的创建流程一样，如果发布版本，请选择 App Store），点击 **Continue**。

![image](/images/ios/push/push_ios_19_generate_pr_register.png)

3. App ID 选择需要创建 PP 文件的 App ID， 点击 **Continue**。

![image](/images/ios/push/push_ios_20_generate_pr_select_appid.jpeg)

![image](/images/ios/push/push_ios_21_generate_pr_select_cert.jpeg)

4. 选择需要加入开发的设备，只有加入了的设备才能进行真机调试，创建发布版本时没有这个步骤，点击 **Continue**。

![image](/images/ios/push/push_ios_22_generate_pr_select_devices.jpeg)

5. 输入 PP 文件的名称，点击 **Generate**。

![image](/images/ios/push/push_ios_23_generate_pr_review_name.jpeg)

6. PP 文件生成完成， 点击 **Download**。

![image](/images/ios/push/push_ios_24_generate_pr_download_install.jpeg)

## **上传推送证书**

在[环信即时通讯云控制台](https://console.easemob.com/user/login)上传 APNs 推送证书。

1. 在[环信即时通讯云控制台](https://console.easemob.com/user/login)首页的**应用列表**中，点击目标应用的**操作**栏中的**管理**。

2. 在左侧导航栏中，选择**即时通讯** > **功能配置** > **消息推送** > **证书管理**，点击**添加推送证书**。

3. 在**添加推送证书**对话框中选择**苹果**页签，配置 APNs 推送参数。

![image](/images/ios/push/push_ios_25_upload_cert.png)

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------- |
| **证书类型**      |  | 是 | 消息推送证书类型，目前支持 **p8** 和 **p12**。        |
| **证书名称**      | String  | 是 | 消息推送证书名称。[创建推送证书](#在苹果开发者平台创建推送证书)的[步骤四](#步骤四-生成推送证书)中创建的消息推送证书名称。 |
| **推送密钥**      | String  | 是 | 消息推送证书密钥。填写在[创建推送证书](#在苹果开发者平台创建推送证书)的[步骤四](#步骤四-生成推送证书)中导出消息推送证书文件时设置的证书密钥。该参数仅在使用 p12 证书时需要配置。  |
| **上传文件**      | File  | 是 | 点击 **上传证书** 上传[创建推送证书](#在苹果开发者平台创建推送证书)的[步骤四](#步骤四-生成推送证书)中获取的消息推送证书文件。  |
| **key id**      | String  | 是 | 输入推送证书的 Key ID。该参数仅在使用 p8 证书时需要配置。  |
| **team id**      | String  | 是 | 输入推送证书的 Team ID。该参数仅在使用 p8 证书时需要配置。  |
| **集成环境**      | | 是 | 集成环境：<br/> - **Development**：开发环境；<br/> - **Production**：生产环境。 |
| **Bundle ID**      | String  | 是 | 绑定 ID。[创建推送证书](#在苹果开发者平台创建推送证书)的[步骤二](#步骤二-创建-app-id)中创建 App ID 时设置的 Bundle ID。 |
| **铃声**      | String  | 否 | 接收方收到推送通知时的铃声提醒。 |

## **在客户端集成 APNs**

### **步骤一 在 app 中开启推送权限**

打开 Xcode，选择 **TARGETS** > **Signing & Capabilities** > **Push Notifications** 开启消息推送权限。

![image](/images/ios/push/push_ios_26_xcode_enable_push_notifi.jpeg)

### **步骤二 将证书名称传递给 SDK**

```plaintext
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  // 注册推送。
  [application registerForRemoteNotifications];

  // 初始化 `Options`，设置 App Key。
  EMOptions *options = [EMOptions optionsWithAppkey:@"easemob-demo#easeim"];

  // 填写上传证书时设置的名称。
  options.apnsCertName = @"PushCertName";

  [EMClient.sharedClient initializeSDKWithOptions:options];

  return YES;
  }
  
```

### **步骤三 获取 device token 并传递给 SDK**

DeviceToken 注册后，iOS 系统会通过以下方式将 DeviceToken 回调给你，你需要把 DeviceToken 传给 SDK。

```
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  // 异步方法
  [EMClient.sharedClient registerForRemoteNotificationsWithDeviceToken:deviceToken completion:^(EMError *aError) {
      if (aError) {
          NSLog(@"bind deviceToken error: %@", aError.errorDescription);
      }
  }];
  }
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"Register Remote Notifications Failed");
  }
  
```

## **测试 APNs 推送**

在即时通讯 IM 中集成并启用 APNs 推送后，可测试推送是否成功集成。

### **前提条件**

准备一台使用 iOS 系统的未越狱的设备。

为了确保测试效果可靠，请避免使用模拟器进行测试。

### **测试步骤**

1. 在设备上登录应用，并确认 device token 绑定成功。
   
  可以查看日志或调用[获取用户详情的 RESTful 接口](/document/server-side/account_system.html#获取单个用户的详情)确认 device token 是否绑定成功。

2. 杀掉应用进程。
   
3. 在[环信即时通讯控制台](https://console.easemob.com/user/login)发送测试消息。
   
  在左侧导航栏中选择**运营服务** > **用户管理**。在**用户管理**页面中，在对应用户 ID 的**操作**栏中选择**发送rest消息**。在弹出的对话框中选择消息类型，输入消息内容，然后点击**发送**。

  :::tip
  在**证书管理**页面中证书列表中，在每个证书的**操作**一栏中，点击 **更多** > **测试**，这里是直接调用第三方接口推送，而**用户管理**页面中的消息发送测试是先调用即时通讯 IM 的发消息的接口，满足条件后（即用户离线、推送证书有效且绑定了 device token）再调第三方的接口进行推送。
  :::

4. 查看设备是否收到推送通知。

### **故障排除**

1. 检查在即时通讯 IM 中是否正确集成或启用了 APNs 推送。
   
   在左侧导航栏中选择**运营服务** > **用户管理**。在**用户管理**页面中，在对应用户 ID 的**操作**栏中选择**查看IM用户绑定推送证书**。在弹出框中查看是否正确显示了证书名称和 device token。

2. 检查是否在[环信即时通讯控制台](https://console.easemob.com/user/login)上传了正确的 APNs 证书且设置了正确的证书环境。
   
3. 检查是否在聊天室中推送消息。聊天室不支持离线消息推送。
   
4. 检查发送消息时是否设置了只发在线(`EMChatMessage#deliverOnlineOnly = YES`)。只发在线的消息不推送。