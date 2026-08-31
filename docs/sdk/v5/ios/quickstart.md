# EasyIM iOS Quickstart

This page describes how to quickly integrate the EasyIM iOS SDK to implement one-to-one chat.

## Implementation principles

The following figure shows the workflow for sending and receiving one-to-one text messages on a client.

![img](/images/android/sendandreceivemsg.png)

## Prerequisite

- Xcode (the latest version is recommended).
- An iOS simulator or Apple device running iOS 10.0 or later.
- CocoaPods [1.10.1 or later](https://cocoapods.org/).
- A valid EasyIM developer account and App Key. For details, see the [EasyIM Console documentation](/product/console/app_manage.html#manage-apps).
- If your network environment has a firewall deployed, contact EasyIM technical support to configure an allowlist.

## 1. Prepare the development environment

### Create an Xcode project

Create an app for the iOS platform in Xcode by following these steps, with the following project settings:

- Set **Product Name** to `HyphenateChatQuickstart`.
- Set **Organization Identifier** to `hyphenatechat`.
- Select **Storyboard** for **User Interface**.
- Select **Objective-C** for **Language**.

## 2. Integrate the SDK

The SDK supports integration using **CocoaPods** or **manual integration**.

### Method 1: Integrate the SDK using CocoaPods

1. In **Terminal**, go to the project root directory and run `pod init`. A **Podfile** text file is generated in the project folder.
2. Open the **Podfile** and change its contents as follows:

```pod
# platform :ios, '10.0'

 target 'HyphenateChatQuickstart' do
     pod 'HyphenateChat'
 end
```

3. Run `pod update` to update the local library version.
4. Run `pod install` to install the HyphenateChat SDK. After installation succeeds, **Terminal** displays `Pod installation complete!`, and a **workspace** file is generated in the project folder.

If developers in China encounter network issues that prevent pod commands from running, they can use a mirror in China, such as the [Gitee mirror](https://gitee.com/mirrors/CocoaPods-Specs) or [TUNA mirror](https://mirrors.tuna.tsinghua.edu.cn/help/CocoaPods/).

### Method 2: Manually import the SDK

1. Open the [SDK download page](https://www.easemob.com/download/im#IOS), download the latest EasyIM SDK, and decompress it.
2. Drag `HyphenateChat.xcframework` and `aosl.xcframework` from the SDK package into your project.
3. Open Xcode and go to **TARGETS > Project Name > General > Frameworks, Libraries, and Embedded Content**.
4. Click **+ > Add Other… > Add Files** to add the corresponding dynamic libraries, and ensure that the **Embed** property of each added dynamic library is set to **Embed & Sign**.

After they are added, the project automatically links the required system libraries.

## 3. Initialize the SDK

Import the SDK header file.

```
#import <HyphenateChat/HyphenateChat.h>
```

In the following method in the project's AppDelegate, call the corresponding SDK method.

```objectivec
(BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary*)launchOptions
{
    // Replace appkey with the App Key of the app registered in EasyIM Console.
    EMOptions *options = [EMOptions optionsWithAppkey:@"<#appkey#>"];
    // apnsCertName is the certificate name. You can pass nil for now and provide the certificate name later when configuring APNs push.
    options.apnsCertName = nil;
    [[EMClient sharedClient] initializeSDKWithOptions:options];
    return YES;
}
```

## 4. Create an account

Create a user in [EasyIM Console](https://console.easyim.ai/user/login) and obtain the user ID and user token. For details, see [Create Users](/product/console/operation_user.html#create-a-user).

In a production environment, for security reasons, you must integrate the [Get App Token API](/rest/easemob_app_token.html) and [Get User Token API](/rest/easemob_user_token.html) into your app server to implement the business logic for obtaining Tokens, allowing users to obtain Tokens from your app server.

## 5. Log in to the account

Log in to EasyIM using the created username and token.

```objectivec
[[EMClient sharedClient] loginWithUsername:@"username"
                                     token:@"your token"
                                   completion:^(NSString *aUsername, EMError *aError) {

}];
```

## 6. Send a message

Log in to EasyIM using the created username and password, and send a message to the peer user. In the following example, a text message is sent to user 2.

```objectivec
// Create a message.
EMTextMessageBody* textBody = [[EMTextMessageBody alloc] initWithText:@"hello"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:@"user2"
                                                              from:@"user1"
                                                                to:@"user2"
                                                              body:textBody
                                                               ext:@{}];
// Send the message.
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {}];
```

## FAQ

### Conflict involving the crash reporting library used by the SDK

Because crash reporting uses the `aosl.xcframework` library, integrating `HyphenateChat 4.11.0` together with `AgoraRtcEngine_iOS 4.3.0-4.4.1` causes an AOSL library conflict. The following error occurs when `pod install` is run:

```
[!] The 'Pods-EaseChatDemo' target has frameworks with conflicting names: aosl.xcframework.
```

To fix this issue, modify the `Podfile` by adding the following script:

```ruby
pre_install do |installer|
  # Define the path of the AgoraRtcEngine_iOS framework.
  rtc_pod_path = File.join(installer.sandbox.root, 'AgoraRtcEngine_iOS')

  # Full path of aosl.xcframework.
  aosl_xcframework_path = File.join(rtc_pod_path, 'aosl.xcframework')

  # Check whether the file exists and delete it if it does.
  if File.exist?(aosl_xcframework_path)
    puts "Deleting aosl.xcframework from #{aosl_xcframework_path}"
    FileUtils.rm_rf(aosl_xcframework_path)
  else
    puts "aosl.xcframework not found, skipping deletion."
  end
end
```

Then run `pod install` again.

For details, see the [Shengwang official documentation](https://doc.shengwang.cn/faq/integration-issues/rtm2-rtc-integration-issue).

### Simulator runtime error

When you create a new project using Xcode 15, if the **Sandbox: rsync.samba(47334) deny(1) file-write-create...** error occurs during compilation, find **User Script Sandboxing** under **Target > Build Settings** and set it to **NO**.

![img](/images/ios/quickstart_emulator_error.png)


![img](/images/ios/quickstart_error_solve.png)


## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [initializeSDKWithOptions:](#3-initialize-the-sdk) | EMClient | Initializes the SDK with EMOptions. |
| [loginWithUsername:token:completion:](#5-log-in-to-the-account) | EMClient | Logs in asynchronously using a user ID and Token. |
| [sendMessage:progress:completion:](#6-send-a-message) | IEMChatManager | Sends a message asynchronously. |
