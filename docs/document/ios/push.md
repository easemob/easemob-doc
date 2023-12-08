# iOS 第三方推送设置

<Toc />

即时通讯 IM 支持集成 APNs 消息推送服务，为 iOS 开发者提供低延时、高送达、高并发、不侵犯用户个人数据的离线消息推送服务。

客户端断开连接或应用进程被关闭等原因导致用户离线时，即时通讯 IM 会通过 APNs 消息推送服务向该离线用户的设备推送消息通知，暂时保存这些消息。当用户再次上线时，服务器会将离线期间的消息发送给用户（这里角标表示的是离线消息数，并不是实际的未读消息数）。例如，当你离线时，有用户向你发送了消息，你的手机的通知中心会弹出消息通知，当你再次打开 app 并登录成功，即时通讯 IM SDK 会主动拉取你不在线时的消息。

若应用在后台运行，则用户仍为在线状态，即时通讯 IM 不会向用户推送消息通知。多设备登录时，可在环信控制台的**证书管理**页面配置推送在所有设备离线或任一设备离线时发送推送消息，该配置对所有推送通道生效。

<div class="alert note">1. 应用在后台运行或手机锁屏等情况，若客户端未断开与声网服务器的连接，则即时通讯 IM 不会收到离线推送通知。<br/>2. 多端登录时若有设备被踢下线，即使接入了 IM 离线推送，也收不到离线推送消息。</div>

除了满足用户离线条件外，要使用 APNs 离线推送，用户还需在环信控制台配置推送证书信息并调用客户端 SDK 提供的 `bindDeviceToken` 方法向环信服务器上传 device token。

## 技术原理

![image](@static/images/ios/push/push_ios_1_understand.png)

## 前提条件

使用消息推送前，需要在你的设备开启推送权限，并将推送证书上传到环信即时通讯 IM 管理后台。

## 开启推送权限并上传推送证书

### 1. 生成 CSR 文件

生成 Certificate Signing Request(CSR)：

![image](@static/images/ios/push/push_ios_2_keychain_access_csr.jpeg)

填写你的邮箱（该邮箱是申请 App ID 的付费帐号）和常用名称（一般默认是计算机名，不用更改），并选择保存到硬盘：

![image](@static/images/ios/push/push_ios_3_cert_assistant_cert_info.jpeg)

点击继续: 

![image](@static/images/ios/push/push_ios_4_cert_assistant_cert_save.jpeg)

在本地生成了名为 `EMImDemoAPS.certSigningRequest` 的 CSR 文件。

### 2. 创建 App ID

生成 App ID ，如果已经有 App ID 可以跳至第 3 步。

![image](@static/images/ios/push/push_ios_5_create_app_id.jpeg)

选择 App ID，点击 `Continue`；

![image](@static/images/ios/push/push_ios_6_register_new_id.jpeg)

选择 App， 点击 `Continue`；

![image](@static/images/ios/push/push_ios_7_register_select_type.jpeg)

输入你的 App ID 描述信息，可以输入工程名；Bundle ID（在工程的 General 信息中），一般格式为 com.youcompany.youprojname。

![image](@static/images/ios/push/push_ios_8_register_type_app_desc.jpeg)

选择需要支持 `Push Notification`，点击 `Continue`;

![image](@static/images/ios/push/push_ios_9_register_support_push_notifi.jpeg)

确定信息无误，点击 `Register`;

![image](@static/images/ios/push/push_ios_10_register_confirm_appid.jpeg)

### 3. 创建 app 的 APS 证书

回到 App IDs 选择你需要推送的 app。

![image](@static/images/ios/push/push_ios_11_select_app_for_push.jpeg)

找到 `Push Notifications`， 点击 `Configure`。

![image](@static/images/ios/push/push_ios_12_edit_app_id_config.jpeg)

如果是开发模式，点击 `Development SSL Certificate` 下的 `Create Certificate`。如果是生产模式，点击 `Production SSL Certificate` 下的 `Create Certificate`。

![image](@static/images/ios/push/push_ios_13_APNs_SSL_cert.jpeg)

`Platform` 选择 `iOS`，`Choose File` 选择第一步中创建的 `CSR` 文件，点击 `Continue`。

![image](@static/images/ios/push/push_ios_14_select_csr.jpeg)

aps 文件创建成功了，点击 `Download` 下载到本地。（文件名：开发版本为 aps_development.cer，发布版本为 aps.cer）：

![image](@static/images/ios/push/push_ios_15_download_your_cert.jpeg)

### 4. 生成 Push 证书

导入证书

双击上一节下载的文件（`aps_development.cer` 和 `aps.cer`）将其安装到电脑，在 `Keychain Access` 中，可以看到已经导入的证书。

![image](@static/images/ios/push/push_ios_16_keychain_access_apple_develop.jpeg)

右键选择导出为 p12 文件， (例：存储为 `EMImDemoAPS.p12`):

![image](@static/images/ios/push/push_ios_17_keychain_access_export.jpeg)

### 5. 生成 Provisioning Profile 文件（PP 文件）

![image](@static/images/ios/push/push_ios_18_generate_provision_file.jpeg)

选择 `iOS App Development`（这里演示开发版描述文件的创建, 发布版本的创建流程一样，如果发布版本，请选择 App Store），点击 `Continue`。

![image](@static/images/ios/push/push_ios_19_generate_pr_register.png)

App ID 选择需要创建 PP 文件的 App ID， 点击 `Continue`。

![image](@static/images/ios/push/push_ios_20_generate_pr_select_appid.jpeg)

![image](@static/images/ios/push/push_ios_21_generate_pr_select_cert.jpeg)

选择需要加入开发的设备，只有加入了的设备才能进行真机调试，创建发布版本时没有这个步骤，点击 `Continue`。

![image](@static/images/ios/push/push_ios_22_generate_pr_select_devices.jpeg)

输入 PP 文件的名称，点击 `Generate`。

![image](@static/images/ios/push/push_ios_23_generate_pr_review_name.jpeg)

PP 文件生成完成， 点击 `Download`。

![image](@static/images/ios/push/push_ios_24_generate_pr_download_install.jpeg)

### 6. 上传到环信即时通讯 IM 管理后台

![image](@static/images/ios/push/push_ios_25_upload_cert.png)

## 在客户端实现推送

### 1. 在 app 中开启推送权限

需要在 xcode 中为 app 开启推送权限。选择 `TARGETS > Capabilities > Push Notifications`。

![image](@static/images/ios/push/push_ios_26_xcode_enable_push_notifi.jpeg)

### 2. 将证书名称传递给 SDK

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

### 3. 获取并将 device token 传递给 SDK

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

### 4. 设置离线推送

环信 IM 3.9.2 及以上版本对离线消息推送进行了优化。你可以对 app 以及各类型的会话开启和关闭离线推送功能，关闭时可设置关闭时长。

环信 IM 支持你对离线推送功能进行如下配置：

- 设置推送通知，包含设置推送通知方式和免打扰模式。
- 配置推送翻译和推送模板。

其中，设置推送通知方式、免打扰模式和推送模板为推送的高级功能，使用前需要在 [环信控制台](https://console.easemob.com/user/login)的**即时通讯 > 功能配置 > 功能配置总览**页面激活推送高级功能。高级功能激活后，你可以设置推送通知方式、免打扰模式和自定义推送模板。如需关闭推送高级功能必须联系商务，因为该操作会删除所有相关配置。

![image](@static/images/ios/push/push_ios_27_enable_push.png)

#### 4.1 设置推送通知 

为优化用户在处理大量推送通知时的体验，环信 IM 在 app 和会话层面提供了推送通知方式和免打扰模式的细粒度选项。

**推送通知方式**

<table>
<tbody>
<tr>
<td width="184">
<p><strong>推送通知方式参数</strong></p>
</td>
<td width="420">
<p><strong>描述</strong></p>
</td>
<td width="321">
<p><strong>应用范围</strong></p>
</td>
</tr>
<tr>
<td width="184">
<p>All</p>
</td>
<td width="420">
<p>接收所有离线消息的推送通知。</p>
</td>
<td rowspan="3" width="321">
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>App 或单聊/群聊会话</p>
</td>
</tr>
<tr>
<td width="184">
<p>MentionOnly</p>
</td>
<td width="420">
<p>仅接收提及消息的推送通知。</p>
<p>该参数推荐在群聊中使用。若提及一个或多个用户，需在创建消息时对 ext 字段传 "em_at_list":["user1", "user2" ...]；若提及所有人，对该字段传 "em_at_list":"all"。</p>
</td>
</tr>
<tr>
<td width="184">
<p>NONE</p>
</td>
<td width="420">
<p>不接收离线消息的推送通知。</p>
</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>

会话级别的推送通知方式设置优先于 app 级别的设置，未设置推送通知方式的会话默认采用 app 的设置。

例如，假设 app 的推送方式设置为 `MentionOnly`，而指定会话的推送方式设置为 `All`。你会收到来自该会话的所有推送通知，而对于其他会话来说，你只会收到提及你的消息的推送通知。

**免打扰模式**

你可以在 app 级别指定免打扰时间段和免打扰时长，环信 IM 在这两个时间段内不发送离线推送通知。若既设置了免打扰时间段，又设置了免打扰时长，免打扰模式的生效时间为这两个时间段的累加。

免打扰时间参数的说明如下表所示：

| 免打扰时间参数       | 类型 |描述           | 应用范围           |
| :------------------- | :------------------- | :--------------------------- | :------------------- |
| EMSilentModeParamTypeInterval | Int |每天定时触发离线推送免打扰的时间段，采用 24 小时制，精确到分钟，格式为 H:M-H:M，例如 8:30-10:0，开始时间和结束时间中的小时数和分钟数的取值范围分别为 [0,23] 和 [0,59]。免打扰时间段的设置说明如下：<br/> - 该参数仅针对 app 生效，对单聊或群聊不生效。<br/> - 开始时间和结束时间设置后，免打扰模式每天定时触发。例如，若该时间段设置为 `8:0`-`10:0`，免打扰模式在每天的 8:00-10:00 内生效。若你在 11:00 设置开始时间为 `8:0`，结束时间为 `12:0`，则免打扰模式在当天的 11:00-12:00 生效，以后每天均在 8:00-12:00 生效。<br/> - 若开始时间和结束时间相同，免打扰模式则全天生效。不过，若设置为  `0:0`-`0:0`，则关闭免打扰模式。<br/> - 若结束时间早于开始时间，则免打扰模式在每天的开始时间到次日的结束时间内生效。例如，开始时间为 `10:0`，结束时间为 `8:0`，则免打扰模式的在当天的 10:00 到次日的 8:00 生效。<br/> - 目前仅支持在每天的一个指定时间段内开启免打扰模式，不支持多个免打扰时间段，新的设置会覆盖之前的设置。<br/> - 若不设置该参数，传空字符串。<br/> - 若该参数和 `EMSilentModeParamTypeDuration` 均设置，免打扰模式当日在这两个时间段均生效，例如，例如，上午 8:00 将 `EMSilentModeParamTypeInterval` 设置为 8:0-10:0，`EMSilentModeParamTypeDuration` 设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。 | 仅用于 app 级别，对单聊或群聊会话不生效。 |
| EMSilentModeParamTypeDuration | Int |免打扰时长，单位为分钟。免打扰时长的取值范围为 [0,10080]，`0` 表示该参数无效，`10080` 表示免打扰模式持续 7 天。<br/> 与免打扰时间段的设置每天生效不同，该参数为一次有效。设置后立即生效，例如，上午 8:00 将 app 层级的时长设置为 240 分钟（4 个小时），则 app 在当天 8:00-12:00 处于免打扰模式。<br/> - 若该参数和 `EMSilentModeParamTypeInterval` 均设置，免打扰模式当日在这两个时间段均生效，例如，上午 8:00 将 app 级的 `EMSilentModeParamTypeInterval` 设置为 8:00-10:00，免打扰时长设置为 240 分钟（4 个小时），则 app 在当前 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。    | App 或单聊/群聊会话。   |

:::tip
若在免打扰时段或时长生效期间需要对指定用户推送消息，需设置[强制推送](#强制推送)。
:::

**推送通知方式与免打扰时间设置之间的关系**

对于 app 和 app 中的所有会话，免打扰模式的设置优先于推送通知方式的设置。例如，假设在 app 级别指定了免打扰时间段，并将指定会话的推送通知方式设置为 `All`。免打扰模式与推送通知方式的设置无关，即在指定的免打扰时间段内，你不会收到任何推送通知。

或者，假设为会话指定了免打扰时间段，而 app 没有任何免打扰设置，并且其推送通知方式设置为 `All`。在指定的免打扰时间段内，你不会收到来自该会话的任何推送通知，而所有其他会话的推送保持不变。

##### 4.1.1 设置 app 的推送通知

你可以调用 `setSilentModeForAll` 设置 app 级别的推送通知，并通过指定 `EMSilentModeParam` 字段设置推送通知方式和免打扰模式，如下代码示例所示：

```objectivec
//设置推送通知方式为 `MentionOnly`。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeRemindType];
param.remindType = EMPushRemindTypeMentionOnly;

//设置 app 的离线推送免打扰模式。
// 异步方法
[[EMClient sharedClient].pushManager setSilentModeForAll:param completion:^(EMSilentModeResult *aResult, EMError *aError) {
        if (aError) {
            NSLog(@"setSilentModeForAll error---%@",aError.errorDescription);
        }
    }];

//设置离线推送免打扰时长为 15 分钟。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeDuration];
param.silentModeDuration = 15;

//设置离线推送的免打扰时间段为 8:30 到 15:00。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeInterval];
param.silentModeStartTime = [[EMSilentModeTime alloc]initWithHours:8 minutes:30];
param.silentModeEndTime = [[EMSilentModeTime alloc]initWithHours:15 minutes:0];
```

##### 4.1.2 获取 app 的推送通知设置

你可以调用 `getSilentModeForAll` 获取 app 级别的推送通知设置，如以下代码示例所示：

```objectivec
// 异步方法
[[EMClient sharedClient].pushManager getSilentModeForAllWithCompletion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (!aError) {
        //获取 app 的推送通知方式。
        EMPushRemindType remindType = aResult.remindType;
        //获取 app 的离线推送免打扰过期 Unix 时间戳。
        NSTimeInterval ex = aResult.expireTimestamp;
        //获取 app 的离线推送免打扰时段的开始时间。
        EMSilentModeTime *startTime = aResult.silentModeStartTime;
        EMSilentModeTime *endTime = aResult.silentModeEndTime;
    }else{
        NSLog(@"getSilentModeForAll error---%@",aError.errorDescription);
    }
}];
```

##### 4.1.3 设置单个会话的推送通知

你可以调用 `setSilentModeForConversation` 设置指定会话的推送通知，并通过指定 `EMSilentModeParam` 字段设置推送通知方式和免打扰模式，如以下代码示例所示：

```objectivec
//设置推送通知方式为 `MentionOnly`。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeRemindType];
param.remindType = EMPushRemindTypeMentionOnly;

//设置离线推送免打扰时长为 15 分钟。
EMSilentModeParam *param = [[EMSilentModeParam alloc]initWithParamType:EMSilentModeParamTypeDuration];
param.silentModeDuration = 15;
                                
EMConversationType conversationType = EMConversationTypeGroupChat;
// 异步方法
[[EMClient sharedClient].pushManager setSilentModeForConversation:@"conversationId" conversationType:conversationType params:param completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForConversation error---%@",aError.errorDescription);
    }
}];
```

##### 4.1.4 获取单个会话的推送通知设置

你可以调用 `getSilentModeForAllWithCompletion` 获取指定会话的推送通知设置，如以下代码示例所示：

```objectivec
// 异步方法
[[EMClient sharedClient].pushManager getSilentModeForAllWithCompletion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (!aError) {
        //获取会话的推送通知方式。
        if(aResult.isSetConversationRemindType){
            EMPushRemindType remindType = aResult.remindType;
        }
        //获取会话的离线推送免打扰过期 Unix 时间戳。
        NSTimeInterval ex = aResult.expireTimestamp;
        //获取会话的离线推送免打扰时段的开始时间。
        EMSilentModeTime *startTime = aResult.silentModeStartTime;
        EMSilentModeTime *endTime = aResult.silentModeEndTime;
    }else{
        NSLog(@"getSilentModeForAll error---%@",aError.errorDescription);
    }s
}];
```

##### 4.1.5 获取多个会话的推送通知设置

1. 你可以在每次调用中最多获取 20 个会话的设置。
2. 如果会话继承了 app 设置或其推送通知设置已过期，则返回的字典不包含此会话。

你可以调用 `getSilentModeForConversations` 获取多个会话的推送通知设置，如以下代码示例所示：

```objectivec
NSArray *conversations = @[conversation1,conversation2];
// 异步方法
    [[EMClient sharedClient].pushManager getSilentModeForConversations:conversationArray completion:^(NSDictionary<NSString*,EMSilentModeResult*>*aResult, EMError *aError) {
        if (aError) {
            NSLog(@"getSilentModeForConversations error---%@",aError.errorDescription);
        }
    }];
```

##### 4.1.6 清除单个会话的推送通知方式的设置

你可以调用 `clearRemindTypeForConversation` 清除指定会话的推送通知方式的设置。清除后，默认情况下，此会话会继承 app 的设置。

以下代码示例显示了如何清除会话的推送通知方式的设置：

```objectivec
//清除指定会话的推送通知方式的设置。清除后，该会话会采取 app 的设置。
// 异步方法
[[EMClient sharedClient].pushManager clearRemindTypeForConversation:@"" conversationType:conversationType completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"clearRemindTypeForConversation error---%@",aError.errorDescription);
    }
}];
```

#### 4.2 设置显示属性

##### 4.2.1 设置推送通知的显示属性

你可以调用 `updatePushDisplayName` 设置推送通知中显示的昵称，如以下代码示例所示：

```objectivec
// 异步方法
[EMClient.sharedClient.pushManager updatePushDisplayName:@"displayName" completion:^(NSString * aDisplayName, EMError * aError) {
    if (aError) {
        NSLog(@"update push display name error: %@", aError.errorDescription);
    }
}];
```

你也可以调用 `updatePushDisplayStyle` 设置推送通知的显示样式，如下代码示例所示：

```objectivec
// 异步方法
[EMClient.sharedClient.pushManager updatePushDisplayStyle:EMPushDisplayStyleSimpleBanner completion:^(EMError * aError)
{
    if (aError) {
        NSLog(@"update display style error --- %@", aError.errorDescription);
    }
}];
```

`DisplayStyle` 是枚举类型。

| 参数                               | 描述                   |
| :--------------------------------- | :--------------------- |
| `EMPushDisplayStyleSimpleBanner`   | 显示“你有一条新消息”。 |
| `EMPushDisplayStyleMessageSummary` | 显示消息内容。         |

##### 4.2.2 获取推送通知的显示属性

你可以调用 `getPushNotificationOptionsFromServerWithCompletion` 获取推送通知中的显示属性，如以下代码示例所示：

```objectivec
// 异步方法
[EMClient.sharedClient.pushManager getPushNotificationOptionsFromServerWithCompletion:^(EMPushOptions * aOptions, EMError * aError)
{
    if (aError) {
        NSLog(@"get push options error --- %@", aError.errorDescription);
    }
}];
```

`EMPushOptions` 推送配置对象。 

| 属性名               | 描述                                                         |
| :------------------- | :----------------------------------------------------------- |
| `displayName`        | 对方收到推送时发送方展示的名称。                             |
| `displayStyle`       | 推送显示类型。                                               |

#### 4.3 设置推送翻译

如果用户启用 [自动翻译](message_translation.html) 功能并发送消息，SDK 会同时发送原始消息和翻译后的消息。

推送通知与翻译功能协同工作。作为接收方，你可以设置你在离线时希望接收的推送通知的首选语言。如果翻译消息的语言符合你的设置，则翻译消息显示在推送通知中；否则，将显示原始消息。翻译功能由 Microsoft Azure Translation API 提供，你可以点击[这里](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)了解支持的翻译语言。

以下代码示例显示了如何设置和获取推送通知的首选语言：

```objectivec
//设置离线推送的首选语言。
// 异步方法
[[EMClient sharedClient].pushManager setPreferredNotificationLanguage:@"EU" completion:^(EMError *aError) {
    if (aError) {
        NSLog(@"setPushPerformLanguageCompletion error---%@",aError.errorDescription);
    }
}];

//获取离线推送的首选语言。
[[EMClient sharedClient].pushManager getPreferredNotificationLanguageCompletion:^(NSString *aLanguageCode, EMError *aError) {
    if (!aError) {
        NSLog(@"getPushPerformLanguage---%@",aLanguageCode);
    }
}];
```

#### 4.4 设置推送模板

环信 IM 支持自定义推送通知模板。使用前，你可参考以下步骤在环信即时通讯云管理后台上创建推送模板：

1. 登录环信 IM Console，进入首页。
2. 在 **应用列表** 区域中，点击对应 app 的 **操作** 一栏中的 **查看** 按钮。
3. 在环信 IM 配置页面的左侧导航栏，选择 **即时通讯 > 功能配置 > 消息推送 > 模板管理**，进入推送模板管理页面。

![image](@static/images/ios/push/push_ios_28_template_mgmt.png)

4. 点击 **添加推送模板**。弹出以下页面，进行参数配置。

![image](@static/images/ios/push/push_ios_29_template_add.png)

在环信即时通讯云管理后台中完成模板创建后，用户可以在发送消息时选择此推送模板作为默认布局，如下代码示例所示：

```objectivec
//下面以文本消息为例，其他类型的消息设置方法相同。
EMTextMessageBody *body = [[EMTextMessageBody alloc]initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc]initWithConversationID:@"conversationId" from:@"currentUsername" to:@"conversationId" body:body ext:nil];
//设置推送模板。设置前需在环信即时通讯云管理后台上创建推送模板。
NSDictionary *pushObject = @{
    @"name":@"templateName",//设置推送模板名称。
    @"title_args":@[@"titleValue1"],//设置填写模板标题的 value 数组。
    @"content_args":@[@"contentValue1"]//设置填写模板内容的 value 数组。
};
message.ext = @{
    @"em_push_template":pushObject,
};
message.chatType = EMChatTypeChat;
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

### 5. 解析收到的推送字段

当设备收到推送并点击时，iOS 会通过 `launchOptions` 将推送中的 JSON 传递给 app，这样就可以根据推送的内容定制 app 的一些行为，比如页面跳转等。 当收到推送通知并点击推送时，app 获取推送内容的方法：

```plaintext
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
      NSDictionary *userInfo = launchOptions[UIApplicationLaunchOptionsRemoteNotificationKey];
  }
  
```

userInfo:

```plaintext
{
    "aps":{
        "alert":{
            "body":"你有一条新消息"
        },   
        "badge":1,               
        "sound":"default"   
    },
    "f":"6001",                  
    "t":"6006", 
    "g":"1421300621769",    
    "m":"373360335316321408"
}
```

| 参数    | 描述                    |
| :------ | :---------------------- |
| `body`  | 显示内容。              |
| `badge` | 角标数。                |
| `sound` | 提示铃声。              |
| `f`     | 消息发送方 ID。         |
| `t`     | 消息接收方 ID。         |
| `g`     | 群组 ID，单聊无该字段。 |
| `m`     | 消息 ID。               |

## 更多功能

### 自定义字段

向推送中添加自定义业务字段满足业务需求，例如，通过这条推送跳转到某个活动页面。

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"extern":@"custom string"}}; 
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数             | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| `body`           | 消息体。                                                     |
| `ConversationID` | 消息属于的会话 ID。                                          |
| `from`           | 消息发送方，一般为当前登录 ID。                              |
| `to`             | 消息接收方 ID，一般与 `ConversationID` 一致。                |
| `em_apns_ext`    | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `extern`         | 自定义字段 key，用于设置自定义的内容，该值为固定值，不可修改。 |
| `custom string`  | 自定义字段内容。                                             |

**解析的内容**

```plaintext
{
    "apns": {
        "alert": {
            "body": "test"
        }, 
        "badge": 1, 
        "sound": "default"
    }, 
    "e": "custom string", 
    "f": "6001", 
    "t": "6006", 
    "m": "373360335316321408"
}
```

| 参数    | 描述            |
| :------ | :-------------- |
| `body`  | 显示内容。      |
| `badge` | 角标数。        |
| `sound` | 提示铃声。      |
| `f`     | 消息发送方 ID。 |
| `t`     | 消息接收方 ID。 |
| `e`     | 自定义信息。    |
| `m`     | 消息 ID。       |

### 自定义显示

自定义显示内容时，你可以随意设置 APNs 通知时显示的内容。

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{
    @"em_push_title": @"customTitle",
    @"em_alert_subTitle": @"customSubTitle",
    @"em_push_content": @"customContent"
}};

message.chatType = EMChatTypeChat;
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数                  | 描述                                                         |
| :-------------------- | :----------------------------------------------------------- |
| `body`                | 消息体。                                                     |
| `ConversationID`      | 消息属于的会话 ID。                                          |
| `from`                | 消息发送方，一般为当前登录 ID。                              |
| `to`                  | 消息接收方 ID，一般与 `ConversationID` 一致。                |
| `em_apns_ext`         | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `em_push_title`          | 推送通知的自定义标题。 |
| `em_alert_subTitle`        | 推送通知的自定义副标题。 |
| `em_push_content`          |推送通知展示的自定义内容。 |

**解析的内容**

```plaintext
{
    "aps":{
        "alert":{
            "body":"custom push content"
        },   
        "badge":1,               
        "sound":"default"        
    },
    "f":"6001",                  
    "t":"6006",                  
    "m":"373360335316321408",
}
```

| 参数    | 描述            |
| :------ | :-------------- |
| `body`  | 显示内容。      |
| `badge` | 角标数。        |
| `sound` | 提示铃声。      |
| `f`     | 消息发送方 ID。 |
| `t`     | 消息接收方 ID。 |
| `m`     | 消息 ID。       |

### 自定义铃声

推送铃声是指用户收到推送时的提示音，你需要将音频文件加入到 app 中，并在推送中配置使用的音频文件名称。

- 支持格式 Linear PCM MA4 (IMA/ADPCM) µLaw aLaw。
- 音频文件存放路径 AppData/Library/Sounds，时长不得超过 30 秒。

更多内容可以参考苹果官方文档：[生成远程推送通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification?language=objc)。

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_sound":@"custom.caf"}};
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数             | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| `body`           | 消息体。                                                     |
| `ConversationID` | 消息属于的会话 ID。                                          |
| `from`           | 消息发送方，一般为当前登录 ID。                              |
| `to`             | 消息接收方 ID，一般与 `ConversationID` 一致。                |
| `em_apns_ext`    | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `em_push_sound`  | 自定义字段，用于设置自定义要显示的内容，该值为固定值，不可修改。 |
| `custom.caf`     | 音频文件名称。                                               |

**解析的内容**

```plaintext
{
    "aps":{
        "alert":{
            "body":"你有一条新消息"
        },  
        "badge":1,  
        "sound":"custom.caf"  
    },
    "f":"6001",  
    "t":"6006",  
    "m":"373360335316321408"  
}
```

| 参数    | 描述            |
| :------ | :-------------- |
| `body`  | 显示内容。      |
| `badge` | 角标数。        |
| `sound` | 提示铃声。      |
| `f`     | 消息发送方 ID。 |
| `t`     | 消息接收方 ID。 |
| `m`     | 消息 ID。       |

### 强制推送

使用该方式设置后，本条消息会忽略接收方的免打扰设置，不论是否处于免打扰时间段都会正常向对方推送通知；

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_force_notification":@YES};
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数                    | 描述                                          |
| :---------------------- | :-------------------------------------------- |
| `body`                  | 消息体。                                      |
| `ConversationID`        | 消息属于的会话 ID。                           |
| `from`                  | 消息发送方，一般为当前登录 ID。               |
| `to`                    | 消息接收方 ID，一般与 `ConversationID` 一致。 |
| `em_force_notification` | 是否为强制推送：<br/> - `YES`：强制推送<br/> - （默认）`NO`：非强制推送。<br/>该字段名固定，不可修改。   |

### 发送静默消息

发送静默消息指发送方在发送消息时设置不推送消息，即用户离线时，环信即时通讯 IM 服务不会通过第三方厂商的消息推送服务向该用户的设备推送消息通知。因此，用户不会收到消息推送通知。当用户再次上线时，会收到离线期间的所有消息。

发送静默消息和免打扰模式下均为不推送消息，区别在于发送静默消息为发送方在发送消息时设置，而免打扰模式为接收方设置在指定时间段内不接收推送通知。

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_ignore_notification":@YES};
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数                    | 描述                                          |
| :---------------------- | :-------------------------------------------- |
| `body`                  | 消息体。                                      |
| `ConversationID`        | 消息属于的会话 ID。                           |
| `from`                  | 消息发送方，一般为当前登录 ID。               |
| `to`                    | 消息接收方 ID，一般与 `ConversationID` 一致。 |
| `em_ignore_notification` | 是否发送静默消息。<br/> - `YES`：发送静默消息；<br/> - （默认）`NO`：推送该消息。<br/>该字段名固定，不可修改。 |

### 基于 UNNotificationServiceExtension 的扩展功能

在 iOS 10 之后生效，目的是为了唤醒 [UNNotificationServiceExtension](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension?language=objc)，让你可以做更多的扩展。

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_mutable_content":@YES}}; 
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数                      | 描述                                                         |
| :------------------------ | :----------------------------------------------------------- |
| `body`                    | 消息体。                                                     |
| `ConversationID`          | 消息属于的会话 ID。                                          |
| `from`                    | 消息发送方，一般为当前登录 ID。                              |
| `to`                      | 消息接收方 ID，一般与 `ConversationID` 一致。                |
| `em_apns_ext`             | 消息扩展字段，该字段名固定，不可修改。该字段用于配置富文本推送通知，包含自定义字段。 |
| `em_push_mutable_content` | 是否使用富文本推送通知（`em_apns_ext`）：<br/> - `YES`：富文本推送通知；<br/> - （默认）`NO`：普通推送通知。<br/>该字段名固定，不可修改。   |

**解析的内容**

```plaintext
{
    "aps":{
        "alert":{
            "body":"test"
        },  
        "badge":1,  
        "sound":"default",
        "mutable-content":1  
    },
    "f":"6001",  
    "t":"6006",  
    "m":"373360335316321408"  
}
```

| 参数              | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| `body`            | 显示内容。                                                   |
| `badge`           | 角标数。                                                     |
| `sound`           | 提示铃声。                                                   |
| `mutable-content` | 苹果要求的关键字，存在之后才可唤醒 UNNotificationServiceExtension。 |
| `f`               | 消息发送方 ID。                                              |
| `t`               | 消息接收方 ID。                                              |
| `m`               | 消息 ID。                                                    |