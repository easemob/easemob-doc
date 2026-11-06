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

1. 生成 App ID。如果已经有 App ID 可以跳至[步骤三](#步骤三-创建-app-的-apns-证书)。

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

### **步骤三 创建 app 的 APNs 证书**

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

1. 导入证书：双击[步骤三](#步骤三-创建-app-的-apns-证书)下载的文件（**aps_development.cer** 和 **aps.cer**）将其安装到电脑，在 **Keychain Access** 中，可以看到导入的证书。

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

在[环信控制台](https://console.easemob.com/user/login)上传 APNs 推送证书。

1. 登录 [环信控制台](https://console.easemob.com/user/login)，选择你的应用 > **功能配置** > **增值功能** > **即时推送**。
   
2. 在 **证书管理** 页面，点击 **添加推送证书**。在 **添加推送证书** 对话框中选择 **苹果**页签，配置 APNs 推送参数。

![img](/images/console/push_certificate_apns.png)

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------- |
| 证书类型    |  | 是 | 消息推送证书类型，目前支持 **p8** 和 **p12**。        |
| 证书名称     | String  | 是 | 消息推送证书名称。详见 APNs 集成文档中 [创建推送证书](/v4/ios/push/push_apns.html#创建推送证书) 的 [步骤四](/v4/ios/push/push_apns.html#步骤四-生成推送证书)  中创建的消息推送证书名称。 |
| 推送密钥      | String  | 否 | 消息推送证书密钥。填写在 [创建推送证书](/v4/ios/push/push_apns.html#创建推送证书)的 [步骤四](/v4/ios/push/push_apns.html#步骤四-生成推送证书) 中导出消息推送证书文件时设置的证书密钥。该参数仅在使用 p12 证书时需要配置。  |
| 上传文件     | File  | 是 | 点击 **上传证书** 上传推送证书文件。详见 APNs 集成文档中 [创建推送证书](/v4/ios/push/push_apns.html#创建推送证书)的 [步骤四](/v4/ios/push/push_apns.html#步骤四-生成推送证书) 中获取的消息推送证书文件。  |
| key id     | String  | 是 | 输入推送证书的 Key ID。该参数仅对 p8 证书有效。  |
| team id     | String  | 是 | 输入推送证书的 Team ID。该参数仅对 p8 证书有效。  |
| 集成环境      | | 是 | 集成环境，包括开发环境和生产环境。 |
| Bundle ID     | String  | 是 | 绑定 ID。详见 APNs 集成文档中 [创建推送证书](/v4/ios/push/push_apns.html#创建推送证书)的 [步骤二](/v4/ios/push/push_apns.html#步骤二-创建-app-id) 中创建 App ID 时设置的 Bundle ID。<br/> - 上传 VoIP 服务证书时，Bundle ID 末尾需要加 .voip 后缀，例如，**Bundle ID** 为 **com.example.demo**，上传对应 VoIP 证书时需要填写 **com.example.demo.voip**。|
| 铃声    | String  | 否 | 接收方收到推送通知时的铃声提醒。该参数仅对离线推送有效：<br/> - 设置的铃声最多为 30 秒。若超过该时间，系统会启用默认铃声 default。<br/> - 铃声文件只支持 aiff、wav 和 caf 格式，例如，铃声文件名为  `test.caf`。<br/> - 如果铃声文件未找到或不填，响铃为系统默认铃声。 |

## **在客户端集成 APNs**

### **步骤一 在 app 中开启推送权限**

打开 Xcode，选择 **TARGETS** > **Signing & Capabilities** > **Push Notifications** 开启消息推送能力。若需展示横幅、声音或角标，还应向用户申请相应的通知授权；测试时确认系统设置中已允许该应用发送通知。

![image](/images/ios/push/push_ios_26_xcode_enable_push_notifi.jpeg)

### **步骤二 将证书名称传递给 SDK**

```objectivec
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

APNs 注册成功后，iOS 会通过 `application:didRegisterForRemoteNotificationsWithDeviceToken:` 返回 device token。这只表示已获取 APNs token，不代表已完成环信服务器绑定。完成 SDK 初始化并设置 `apnsCertName` 后，将该 token 传递给 SDK，并处理异步绑定结果。

```objectivec
- (void)application:(UIApplication *)application
        didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    [[EMClient sharedClient] registerForRemoteNotificationsWithDeviceToken:deviceToken
        completion:^(EMError *aError) {
            if (aError) {
                if (aError.code == EMErrorUserNotLogin) {
                    // 当前尚未登录，SDK 会在登录成功后尝试上传已保存的 token。
                    // 登录后需再次确认服务器端的绑定结果。
                } else {
                    // 处理绑定失败，可通过 aError.code 和 aError.errorDescription 获取原因。
                }
                return;
            }
            // 本次 token 绑定成功，随后结合后台场景进行真机推送测试。
        }];
}

- (void)application:(UIApplication *)application
        didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
    // 处理 APNs token 注册失败，检查网络、签名和推送能力配置。
}
```

SDK 的绑定完成回调返回本次向环信服务器绑定 token 的结果。首次传入 token 时若尚未登录，SDK 会在登录成功后尝试上传已保存的 token，应在登录后确认服务器端的绑定结果。绑定结果检查和实际通知验证见下文 [测试 APNs 推送](#测试-apns-推送)。

### 步骤四 处理应用前后台切换

完成 SDK 初始化后，在应用实际进入后台和回到前台时，将对应的生命周期事件传递给 SDK。生命周期转发无需等待 device token 绑定完成。以下示例适用于由 `AppDelegate` 管理应用生命周期的项目：

```objectivec
- (void)applicationDidEnterBackground:(UIApplication *)application {
    // 已登录时，SDK 主动断开 IM 长连接。
    [[EMClient sharedClient] applicationDidEnterBackground:application];
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // 已登录时，SDK 检查连接或尝试重连。
    [[EMClient sharedClient] applicationWillEnterForeground:application];
}
```

使用 `SceneDelegate` 管理场景生命周期的项目，应按应用整体的前后台状态统一转发上述两个 SDK 调用，并传入 `UIApplication` 实例。多窗口应用应避免仅因某个场景进入后台就断开其他活跃场景仍需使用的 IM 连接，也应避免重复转发同一次状态变化。

SDK 的后台断连不以 token 绑定成功为前提。验证后台推送前，应先完成 APNs 证书配置和 token 绑定，并确认通知权限及推送设置允许展示本次通知。若用户已退出登录或被强制下线，返回前台后需按业务流程重新登录。

SDK 初始化且用户已登录时，调用 `applicationDidEnterBackground:` 会主动断开 IM 长连接。后台断连和返回前台后的连接处理见 [应用前后台切换](push_overview.html#应用前后台切换)。

## **测试 APNs 推送**

在即时通讯 IM 中集成并启用 APNs 推送后，可测试推送是否成功集成。

### **前提条件**

准备一台使用 iOS 系统的未越狱的设备。

为了确保测试效果可靠，请避免使用模拟器进行测试。

### **测试步骤**

1. 在设备上登录应用，并确认 device token 绑定成功。
   
  可以查看日志或调用 [获取用户详情的 RESTful 接口](/document/server-side/account_detail_obtain_single.html)确认 device token 是否绑定成功。

1. 杀掉应用进程。
   
2. 在[环信控制台](https://console.easemob.com/user/login)发送测试消息。
   
  在左侧导航栏中选择 **运营管理** > **运营操作** > **用户管理**。在 **用户管理** 页面中，在对应用户 ID 的 **操作** 栏中点击 **更多**，然后选择 **发送rest消息**。在弹出的对话框中选择消息类型，输入消息内容，然后点击**发送**。

  :::tip
  在 **证书管理** 页面中证书列表中，在每个证书的**操作**一栏中，点击 **更多** > **测试**，这里是直接调用第三方接口推送，而 **用户管理** 页面中的消息发送测试是先调用即时通讯 IM 的发消息的接口，满足条件后（即用户离线、推送证书有效且绑定了 device token）再调第三方的接口进行推送。
  :::

1. 查看设备是否收到推送通知。

### **故障排除**

1. 核对环信服务器上的 token 绑定结果。在环信控制台的 **运营管理** > **运营操作** > **用户管理** 中，选择对应用户的 **操作** > **查看IM用户绑定推送证书**，检查证书名称及 device token；也可以调用 [获取用户详情的 RESTful 接口](/document/server-side/account_detail_obtain_single.html) 检查。若未绑定或信息不匹配，返回 [步骤三](#步骤三-获取-device-token-并传递给-sdk)，检查 token 注册与绑定回调中的错误。

2. 检查是否在 [环信控制台](https://console.easemob.com/user/login) 上传了正确的 APNs 证书，并确认客户端设置的证书名称与控制台一致、推送环境与安装包匹配。

3. 检查是否在聊天室中推送消息。聊天室不支持离线消息推送。

4. 检查发送消息时是否设置了 `EMChatMessage.deliverOnlineOnly = YES`。只向在线用户投递的消息不触发离线推送。

5. 检查设备通知设置、应用的 [推送通知方式](push_notification_mode_dnd.html#推送通知方式) 和 [免打扰模式](push_notification_mode_dnd.html#免打扰模式) 是否屏蔽本次通知。token 绑定成功不代表设备一定会展示通知。

6. 若正常切后台后没有通知，检查 [前后台生命周期事件](#步骤四-处理应用前后台切换) 是否正确传递给 SDK，并检查服务端在线状态。SDK 4.26.0 及以上可结合 [连接状态查询](/v4/ios/connection.html#查询连接状态) 排查当前是否仍保持 IM 长连接；多设备登录时，还需检查控制台配置的 [推送策略](push_overview.html#多设备离线推送策略)。
