# Integrate offline push

Follow this guide to integrate and test push notifications in your environment.

## Prerequisites

Before proceeding, ensure that you meet the following requirements:

- You have initialized the Chat SDK. For details, see [SDK quickstart](https://docs.agora.io/en/agora-chat/get-started/get-started-sdk).
- You understand the call frequency limit of the Chat APIs supported by different pricing plans as described in [Limitations](https://docs.agora.io/en/agora-chat/develop/reference/limitations).

## Integrate FCM push

This section guides you through how to integrate FCM with Chat.

1. Create a project in Firebase console.
2. Add a Flutter app on Firebase console.
3. Upload the FCM certificate to Agora Console.
4. Upload the APNs certificate to Agora Console.
5. Integrate FCM to the client.

### 1. Create a project in Firebase console

1. Log in to the [Firebase console](https://console.firebase.google.com/) and click **Create a new Firebase project**.

2. On the **Create a project** page, enter a project name, and click **Create project**.

   Note: You can toggle off **Join the Google Developer Program to enrich your developer journey with access to Al
assistance, learning resources, profile badges, and more!** if this option is not needed.

3. On the **AI assistance for your Firebase project** page, click **Continue**。

   Note: You can toggle off **Enable Gemini in Firebase** if this option is not needed.

4. On the **Google Analytics for your Firebase project** page, click **Continue**.
   
   Note: You can toggle off **Enable Google Analytics for this project** if this option is not needed.

### 2. Add a Flutter App on Firebase console

1. Upon project creation, click the setting icon to the right of **Project Overview** in the left navigation bar and select **Project settings**.

2. Select the **General** tab and click the Flutter icon in the **Your apps** section.

3. Go through the steps shown on the **Add Firebase to your Flutter app** page. 
   a. Prepare your workspace: install the Firebase CLI and Flutter SDK.
   b. Install and run the FlutterFire CLI: Upon this operation, configuration files, like `lib/firebase_options.dart和google-services.json`, are automatically added to your Flutter project.
   c. Initialize Firebase and add plugins. For where to add the code, see the [SDK integration] section (https://docs.agora.io/en/agora-chat/develop/offline-push/integrate-test?platform=flutter#sdk-integration).

### 3. Upload the FCM certificate to Agora Console

1. Check the sender ID on Firebase Console.

   You can find the sender ID on the **Project settings > Cloud Messaging** page of the Firebase Console. Make sure to fill in the certificate name as the sender ID when uploading the FCM certificate to the Agora Console.

   ![Query the sender ID](https://docs.agora.io/en/assets/images/push_fcm_senderid-f9bc4941d3765be43a565cf8febbf967.png)

2. Generate and upload the private key on the Firebase Console. 

   Click **Generate new private key** on the **Project settings > Service accounts** page of the Firebase Console to generate the `.json` file and upload it to Agora Console when uploading the FCM certificate to the Agora Console.

   ![Generate new private key](https://docs.agora.io/en/assets/images/push_fcm_private_key-ab57005d4451ce829530280a773a62c1.png)

3. [Upload the FCM certificate to Agora Console](https://docs.agora.io/en/agora-chat/develop/offline-push/integrate-test?platform=flutter#2-upload-fcm-certificate-to-).

### 4. Upload the APNS certificate to Agora Console

Take the following steps to create APNs certificates and upload to Agora Console:

1. Create a push certificate on the Apple Developer Platform.
2. Create an App ID.
3. Create push notification certificates.
4. Generate the push certificate.
5. Generate the Provisioning Profile file.
6. Upload the APNs certificate in the Agora Console.

For details, see the [APNs push integration document](https://docs.agora.io/en/agora-chat/develop/offline-push/integrate-test?platform=ios#integrate-apns-push) of the iOS platform.

### 5. Integrate FCM on the client

Take the following steps to integrate FCM on the client.

1. Install `firebase_core`: Execute `flutter pub add firebase_core` in the project root directory.
2. Install `firebase_messaging`: Execute `flutter pub add firebase_messaging` in the project root directory.

**For Android**

In your Flutter project's `android/build.gradle.kts` file, check the `google-services` version and make sure it is 4.3.15 or above.

```dart
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        // START: FlutterFire Configuration
        classpath("com.google.gms:google-services:4.3.15")
        // END: FlutterFire Configuration
    }
}
```

Note the following:

As `firebase_messaging` requires the minimal version of Flutter SDK no less than 23, you need to set `minSdk = 23` if an issue with minSdk is reported during Android compilation.

**For iOS**

Before your app can start receiving messages, enable push notifications and background modes in your Xcode project.

1. Open the Xcode project workspace (`ios/Runner.xcworkspace`).

2. [Enable push notifications](https://help.apple.com/xcode/mac/current/#/devdfd3d04a1).

   On the **Signing & Capabilities** page, click **+ Capability** and select **Push Notifications**.
  
3. Enable background fetching and remote notifications [background execution modes](https://developer.apple.com/documentation/xcode/configuring-background-execution-modes).

   On the **Signing & Capabilities** page, click **+ Capability** and select **Background Modes** and then **Background fetch** and **Remote notifications**. 
  
4. Set the minimal deployment version to 15 or above.

   On the **General** page, set **Minimum Deployments** to 15 or above.

**SDK integration**

1. Import Firebase-related packages. 
   
   ```dart
    //...
    import 'dart:io';
    import 'package:firebase_messaging/firebase_messaging.dart';
    import 'package:firebase_core/firebase_core.dart';
    import 'firebase_options.dart';
	//...
   ```

2. Initialize Firebase and Chat SDK options:
   
   ```dart
    @override
      void initState() {
        //...
        setupFireBaseAndChat();
        //...
      }
	
      void setupFireBaseAndChat() async {
        // Initialize Firebase
        WidgetsFlutterBinding.ensureInitialized();
        await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
	
        // Configure Agora Chat
        const String appKey = "Your Appkey"; // Replace with your app key.
        ChatOptions options = ChatOptions(
          appKey: appKey,
          autoLogin: false,
        );
	
        // Enable push in Agora Chat
        if (Platform.isAndroid) {
          options.enableFCM("Your FCM sender id"); // Replace with your FCM Sender ID
	
        } else if (Platform.isIOS) {
          options.enableAPNs("Your APNs certificate name"); // Replace with your APNs certificate
        }
	
        // Initialize Agora Chat
        await ChatClient.getInstance.init(options);
        // Notify the SDK that the UI is ready. After the following method is executed, callbacks within ChatRoomEventHandler and ChatGroupEventHandler can be triggered.
        await ChatClient.getInstance.startCallback();
      }
	```

  Note the following:

  Make sure that `enableFCM` has the same value as **Certificate Name** on the FCM certificate page on Agora Console and `enableAPNs` has the identical value as **Certificate Name** on the APNs certificate page on Agora Console.

  ![push_fcm_add_certificate](https://docs.agora.io/en/assets/images/push_fcm_add_certificate-3b9434237425f9c98660e785b2f09098.png)

  ![push_apns_add_certificate](https://docs.agora.io/en/assets/images/push_apns_add_certificate-47c94a44ae5cc8e9933f1f55aac54270.png)

3. Pass the FCM or APNs device token to the server.

   When the app is initialized, the FCM SDK generates a unique registration token for the client app on the user's device. Since FCM or APNs uses this token to determine which device to send the push message to, the Agora server needs to obtain the client app's registration token before sending the notification request to FCM or APNs. FCM or APNs then verifies the registration token and sends the notification message to the device.

   Note that operations as indicated in the following code segment can be performed only after your login to Agora Chat.

   ```dart
      // Request push permission
      await FirebaseMessaging.instance.requestPermission();
   
      // Get the token and upload it to Chat server
      String? pushToken;
   
      // Get device Token for Android
      if (Platform.isAndroid) {
        pushToken = await FirebaseMessaging.instance.getToken();
        // Update FCM device token
        if (pushToken != null) {
          debugPrint('fcm token: $pushToken');
          await ChatClient.getInstance.pushManager.updateFCMPushToken(
            pushToken,
          );
        } else {
          debugPrint('fcm token is null');
        }
   
      // Get device Token for iOS
      } else if (Platform.isIOS) {
        pushToken = await FirebaseMessaging.instance.getAPNSToken();
        // Update APNs device token
        if (pushToken != null) {
          debugPrint('apns token: $pushToken');
          await ChatClient.getInstance.pushManager.updateAPNsDeviceToken(
            pushToken,
          );
        } else {
          debugPrint('apns token is null');
        }
      }
   ```

## Test FCM push

After integrating and enabling FCM, you can test whether the push feature is successfully integrated.

For more reliable testing, use a physical device.

### Test push notifications

1. Log in to the app on your device and confirm that the device token is successfully bound.

   You can check the log or call [RESTful API for getting user details](https://docs.agora.io/en/agora-chat/restful-api/user-system-registration#querying-a-user) to confirm whether the device token is successfully bound. If successful, there will be a `pushInfo` field under the `entities` field, and `pushInfo` will have relevant information such as `device_Id`, `device_token`, `notifier_name`, and others.

2. Enable app notification bar permissions.

3. Kill the application process.

4. Send a test message in the [Agora Console](https://console.agora.io/v2).

   Select **Operation Management** > **User** in the left navigation bar. On the **Users** page, select **Send Admin Message** in the **Action** column for the corresponding user ID. In the dialog box that pops up, select the message type, enter the message content, and then click **Send** .

   Note the following:
  
   In the **Push Certificate** page, in the **Action** column of each certificate, click **More** and **Test** will appear. This is to directly call the third-party interface to push. The message sending test in the **Users** page first calls the Chat message sending interface and then the third-party interface when the conditions are met (that is, the user is offline, the push certificate is valid and bound to the device token).

5. Check your device to see if it has received the push notification.

### Troubleshooting

In case of issues, take the following steps:

1. Check whether FCM push is correctly integrated or enabled:

   Select **Operation Management** > **User** in the left navigation bar. On the **User Management** page, select **Push Certificate** in the **Action** column for the corresponding user ID. In the pop-up box, check whether the certificate name and device token are displayed correctly.

2. Check whether the correct FCM certificate is uploaded in the [Agora Console](https://console.agora.io/v2).

3. Check whether the message is pushed in the chat room. The chat room does not support offline message push.

4. Check if the device supports GMS.

5. Check whether online-only delivery is enabled (`deliverOnlineOnly` = `true`). Messages set to be delivered only when the receiver is online will not be pushed.