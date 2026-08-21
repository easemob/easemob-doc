# Integrate APNs into EasyIM

This page describes how to integrate APNs into EasyIM and test whether push notifications are successfully integrated.

## **Create a push certificate**

Follow these steps to create an APNs push certificate on the Apple Developer platform.

### **Step 1: Generate a CSR file**

1. Generate a Certificate Signing Request (CSR):

![image](/images/ios/push/push_ios_2_keychain_access_csr.jpeg)

2. Enter your email address, which is the paid account used to apply for the App ID, and a common name, which is usually the computer name by default and does not need to be changed. Then choose to save it to disk.

![image](/images/ios/push/push_ios_3_cert_assistant_cert_info.jpeg)

3. Click **Continue**.

![image](/images/ios/push/push_ios_4_cert_assistant_cert_save.jpeg)

The CSR file `EMImDemoAPS.certSigningRequest` is created locally.

### **Step 2: Create an App ID**

1. Create an App ID. If you already have one, you can jump to [Step 3](#step-3-create-the-apns-certificate-for-the-app).

![image](/images/ios/push/push_ios_5_create_app_id.jpeg)

2. Select  **App IDs** and click **Continue**.

![image](/images/ios/push/push_ios_6_register_new_id.jpeg)

3. Select **App** and click **Continue**.

![image](/images/ios/push/push_ios_7_register_select_type.jpeg)

4. Enter the App ID description. You can enter the project name. Set the **Bundle ID** in the project's **General** settings. The usual format is **com.youcompany.youprojname**.

![image](/images/ios/push/push_ios_8_register_type_app_desc.jpeg)

5. Select **Push Notification** support and click **Continue**.

![image](/images/ios/push/push_ios_9_register_support_push_notifi.jpeg)

6. After confirming that the information is correct, click **Register**.

![image](/images/ios/push/push_ios_10_register_confirm_appid.jpeg)

### **Step 3: Create the APNs certificate for the app**

1. Go back to **App IDs** and select the app you want to enable push notifications for.

![image](/images/ios/push/push_ios_11_select_app_for_push.jpeg)

2. Find **Push Notifications** and click **Configure**.

![image](/images/ios/push/push_ios_12_edit_app_id_config.jpeg)

3. If you are using the development environment, click **Create Certificate** under **Development SSL Certificate**. If you are using the production environment, click **Create Certificate** under **Production SSL Certificate**.

![image](/images/ios/push/push_ios_13_APNs_SSL_cert.jpeg)

4. Select **iOS** for **Platform**, choose the **CSR** file created in Step 1 for **Choose File**, and click **Continue**.

![image](/images/ios/push/push_ios_14_select_csr.jpeg)

5. The aps file is created successfully. Click **Download** to save it locally. The file name is **aps_development.cer** for the development version and **aps.cer** for the release version.

![image](/images/ios/push/push_ios_15_download_your_cert.jpeg)

### **Step 4: Generate the push certificate**

1. Import the certificate: double-click the file downloaded in [Step 3](#step-3-create-the-apns-certificate-for-the-app) (**aps_development.cer** or **aps.cer**) to install it on your computer. You can see the imported certificate in **Keychain Access**.

![image](/images/ios/push/push_ios_16_keychain_access_apple_develop.jpeg)

2. Right-click and choose to export it as a p12 file, for example, `EMImDemoAPS.p12`, and set the certificate password.

![image](/images/ios/push/push_ios_17_keychain_access_export.jpeg)

### **Step 5: Generate the Provisioning Profile file (PP file)**

1. In the [iOS Developer Center](https://developer.apple.com/cn/), choose **Account** > **Certificates, Identifiers & Profiles** > **Profiles**. On the **Provisioning** tab, click the **+** icon on the right side of **Profiles**.

![image](/images/ios/push/push_ios_18_generate_provision_file.jpeg)

2. Select **iOS App Development**. This example shows how to create a development provisioning profile. The process for a production profile is the same. If you are creating a production profile, select App Store, then click **Continue**.

![image](/images/ios/push/push_ios_19_generate_pr_register.png)

3. For App ID, select the App ID for which you want to create the PP file, then click **Continue**.

![image](/images/ios/push/push_ios_20_generate_pr_select_appid.jpeg)

![image](/images/ios/push/push_ios_21_generate_pr_select_cert.jpeg)

4. Select the devices you want to add for development. Only devices that have been added can be used for real-device debugging. This step is not required when creating a release profile. Click **Continue**.

![image](/images/ios/push/push_ios_22_generate_pr_select_devices.jpeg)

5. Enter the name of the PP file and click **Generate**.

![image](/images/ios/push/push_ios_23_generate_pr_review_name.jpeg)

6. The PP file is generated. Click **Download**.

![image](/images/ios/push/push_ios_24_generate_pr_download_install.jpeg)

## **Upload the push certificate**

Upload the APNs push certificate in [EasyIM Console](https://console.easyim.ai/user/login).

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login), select your app > **Feature Configuration** > **Value-Added Features** > **Push**.

2. On the **Certificate Management** page, click **Add push certificate**. In the **Add push certificate** dialog box, select the **Apple** tab and configure the APNs push parameters.

![img](/images/console/push_certificate_apns.png)

| Parameter | Type | Required | Description |
| :--------- | :----- | :------- | :----------------------- |
| Certificate type |  | Yes | The message push certificate type. Currently, **p8** and **p12** are supported. |
| Certificate name | String | Yes | The message push certificate name. For details, see the message push certificate name created in [Step 4](#step-4-generate-the-push-certificate) of [Create a push certificate](#create-a-push-certificate) in the APNs integration guide. |
| Push key | String | No | The message push certificate key. Enter the certificate key that you set when exporting the message push certificate file in [Step 4](#step-4-generate-the-push-certificate) of [Create a push certificate](#create-a-push-certificate). This parameter is required only when you use a p12 certificate. |
| Upload file | File | Yes | Click **Upload certificate** to upload the push certificate file. For details, see the message push certificate file obtained in [Step 4](#step-4-generate-the-push-certificate) of [Create a push certificate](#create-a-push-certificate) in the APNs integration guide. |
| key id | String | Yes | Enter the Key ID of the push certificate. This parameter is valid only for p8 certificates. |
| team id | String | Yes | Enter the Team ID of the push certificate. This parameter is valid only for p8 certificates. |
| Integration environment | | Yes | The integration environment, including the development environment and the production environment. |
| Bundle ID | String | Yes | The bundle ID. For details, see the Bundle ID that you set when creating the App ID in [Step 2](#step-2-create-an-app-id) of [Create a push certificate](#create-a-push-certificate) in the APNs integration guide.<br/> - When you upload a VoIP service certificate, add the `.voip` suffix to the Bundle ID, such as `nvyvtp.dabaoiian`. For example, if the **Bundle ID** is **com.example.demo**, enter **com.example.demo.voip** when uploading the corresponding VoIP certificate. |
| Ringtone | String | No | The ringtone reminder when the receiver gets the push notification. This parameter is valid only for offline push:<br/> - The ringtone can be up to 30 seconds long. If it exceeds this time, the system uses the default ringtone `default`.<br/> - Only aiff, wav, and caf files are supported. For example, the ringtone file name can be `test.caf`.<br/> - If the ringtone file is not found or left blank, the system uses the default ringtone. |

## **Integrate APNs on the client**

### **Step 1: Enable push permissions in the app**

Open Xcode, choose **TARGETS** > **Signing & Capabilities** > **Push Notifications**, and enable message push permissions.

![image](/images/ios/push/push_ios_26_xcode_enable_push_notifi.jpeg)

### **Step 2: Pass the certificate name to the SDK**

```objectivec
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  // Register for push notifications.
  [application registerForRemoteNotifications];

  // Initialize `Options` and set the App Key.
  EMOptions *options = [EMOptions optionsWithAppkey:@"easemob-demo#easeim"];

  // Enter the name set when uploading the certificate.
  options.apnsCertName = @"PushCertName";

  [EMClient.sharedClient initializeSDKWithOptions:options];

  return YES;
  }
  
```

### **Step 3: Get the device token and pass it to the SDK**

After DeviceToken registration, the iOS system calls you back with the DeviceToken in the following way, and you need to pass the DeviceToken to the SDK.

```objectivec
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  // Asynchronous method
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

## **Test APNs push notifications**

After you integrate and enable APNs push notifications in EasyIM, you can test whether the integration succeeded.

### **Prerequisites**

Prepare a non-jailbroken device running iOS.

To ensure reliable test results, avoid using an emulator.

### **Test steps**

1. Log in to the app on the device and confirm that the device token is bound successfully.

  You can check the logs or call the [RESTful API for obtaining user details](/document/server-side/account_detail_obtain_single.html) to confirm whether the device token is bound successfully.

1. Kill the app process.

2. Send a test message in [EasyIM Console](https://console.easyim.ai/user/login).

  On the left navigation bar, choose **Operations Management** > **Operations** > **User Management**. On the **User Management** page, click **More** in the **Actions** column for the corresponding user ID, then select **Send rest message**. In the dialog box that appears, select the message type, enter the message content, and click **Send**.

  :::tip
  In the certificate list on the **Certificate Management** page, click **More** > **Test** in the **Actions** column for each certificate. This directly calls the third-party API to push notifications, while the message-sending test on the **User Management** page first calls the EasyIM API for sending messages. If the conditions are met, namely the user is offline, the push certificate is valid, and the device token is bound, the third-party API is then called to push notifications.
  :::

1. Check whether the device receives the push notification.

### **Troubleshooting**

1. Check whether APNs push notifications are correctly integrated or enabled in EasyIM.

   On the left navigation bar, choose **Operations Management** > **Operations** > **User Management**. On the **User Management** page, click **View IM user bound push certificate** in the **Actions** column for the corresponding user ID. In the pop-up box, check whether the certificate name and device token are displayed correctly.

2. Check whether the correct APNs certificate was uploaded in [EasyIM Console](https://console.easyim.ai/user/login) and whether the correct certificate environment was set.

3. Check whether the message is being pushed in a chat room. Chat rooms do not support offline message push.

4. Check whether only-online delivery was set when sending the message (`EMChatMessage#deliverOnlineOnly = YES`). Messages sent only online are not pushed.
