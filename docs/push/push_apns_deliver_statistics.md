# APNs 送达统计

此文档是建立在已经集成了环信推送服务的基础上提供统计苹果远程推送 (APNs) 送达的功能。

你需要在应用里创建推送服务扩展(推送扩展服务仅支持 iOS 10 及以上版本)，在推送扩展里导入环信扩展服务 SDK，调用对应的 API。

:::notice
APNs 的点击已在 SDK 内部实现，无需单独处理。
:::

## 1、推送服务扩展介绍

iOS 10 苹果增加了推送通知服务应用扩展（Notification Service Extension），用户可以在扩展基础上对远程的推送内容进行修改。

前提是推送时候在 `payload` 中必须设置 `mutable-content` 值为 1，否则推送扩展将不会被调用。

需要注意的是，一般系统会自动给你生成扩展应用的 `Bundle Identifier`，不做修改即可。如果修改了的话必须在主应用的 `Bundle Identifier` 基础上做添加，否则将会有错误。比如主应用的 `Bundle Identifier` 为 `com.xx.targetname`，那么扩展应用的 `Bundle Identifier` 应该为 `com.xx.targetname.yy`。

在创建推送服务扩展后系统默认给你创建了两个回调方法，使用 `didReceiveNotificationRequest:withContentHandler`：方法修改推送内容，系统会给你大约 30s 的时间处理这个推送，如果超过这个时间，系统将调 `serviceExtensionTimeWillExpire`方法，此时您必须立即向系统返回您所能返回的任何内容。如果从任何一个方法中调用完成处理程序失败，系统将显示通知的原始内容。

## 2、为应用创建推送服务扩展

- 点击 **Xcode**，选择 **File** > **New** > **Target**。

![img](@static/images/instantpush/push_xcode_target.png)

- 在 **iOS** > **Application Extension** 下选中 **Notification Service Extension**，点击 **Next**。

![img](@static/images/instantpush/push_apns_notificationextension.png)

- 为您的应用程序扩展指定名称和其他配置细节，点击完成。

![img](@static/images/instantpush/push_apns_targetconfi.png)

- 创建完后在工程里会自动生成三个文件 (NotificationService.h、NotificationService.m、info.plist) 和扩展应用的 Target（工程名就是创建时候填的 Product Name）。

![img](@static/images/instantpush/push_apns_serviceext.png)

## 3、推送服务扩展导入 SDK

推送扩展 SDK 支持手动和 Pod 导入，您可以选择任意一种方式进行导入。

### 通过 Pod 导入

在集成环信推送服务时候，您为主工程已创建了 Podfile 文件，在此文件基础上，您可以为扩展添加 Pod 管理，在 Podfile 文件里指明对应的 target，再添加需要导入的 SDK 名称。

```pod
target 'EMPushServerExt' do
    pod 'EMPushExtension'    
end
```

然后在 Podfile 目录下，执行更新命令。

```pod
pod install --repo-update 
```

### 手动导入

APNs 的送达统计 SDK 下载地址：

[下载推送扩展SDK](https://downloadsdk.easemob.com/downloads/EMPushExtension0_1_0.zip)

下载下来之后，将 **EMPushExtension.framework** 加入到应用扩展目录下即可。

![img](@static/images/instantpush/push_apns_extension_directory.png) 

## 4、SDK 使用

在 **NotificationService.m** 里引入头文件：

```objectiveC
#import <EMPushExtension/EMPushExtension.h> 
```

在系统提供处理推送的方法里调用 EMPushServiceExt 的两个方法，这两个方法必须都调用，且设置 Appkey的方法需要先调用。

```objectiveC
- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    
    // Modify the notification content here...
    [EMPushServiceExt setAppkey:@"appkey from easemob"];//Appkey 必须和主应用中的 Appkey 一致
    [EMPushServiceExt receiveRemoteNotificationRequest:request completion:^(NSError * _Nonnull error) {
        NSLog(@"EMPushServiceExt complete APNs delivery");
        self.contentHandler(self.bestAttemptContent);
    }];
    self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
    // Called just before the extension will be terminated by the system.
    // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.

    self.contentHandler(self.bestAttemptContent);
}
```