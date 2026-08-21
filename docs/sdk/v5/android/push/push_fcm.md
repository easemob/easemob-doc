# Integrate FCM into EasyIM

The EasyIM SDK has integrated FCM push-related logic. You still need to complete the following steps.

## FCM push integration

### Step 1: Add Firebase in the [Firebase console](https://console.firebase.google.com/)

For details, see the [FCM official documentation](https://firebase.google.com/docs/android/setup?hl=zh-cn#console).

### Step 2: Get the FCM V1 certificate

1. Log in to the [FCM console](https://console.firebase.google.com) and select your project.

![image](/images/android/push/fcmproject.png)

2. Select the app under the project.

![image](/images/android/push/appsetting.png)

3. Select the **Service accounts** tab and click **Generate new private key**.

![image](/images/android/push/v1json.png)

4. Download the certificate and save it for later use.

Download the certificate file, for example, `myapplication-72d8c-firebase-adminsdk-yqa7z-4766fefcaf.json`.

```json
{
  "type": "service_account",
  "project_id": "myapplication-72d8c",
  "private_key_id": "xxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\xxx\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-yqa7z@myapplication-72d8c.iam.gserviceaccount.com",
  "client_id": "xxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yqa7z%40myapplication-72d8c.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

### Step 3: Upload the push certificate

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login). On the **App Management** page, click the App Key of the test or production app.

2. Select **Value-Added Features** > **Message Push**.

3. On the **Certificate Management** page, click **Add push certificate**. After the **Add push certificate** dialog box opens, the **Google** tab is displayed by default. You can configure the Google FCM push certificate on this page.

![img](/images/console/push_certificate_fcm.png)

| Parameter | Type | Required | Description |
| :-------------- | :----- | :------- | :---------------------------- |
| Certificate type | File | Yes | Select whether to use a V1 or legacy certificate.<br/> - **V1**: Recommended. You need to click **Upload certificate** to upload the FCM V1 certificate file and set the **certificate name**.<br/> - **Legacy**: Deprecated and not recommended. You need to configure the **certificate name** and **push key**. |
| Upload file | File | Yes | Click **Upload certificate** to upload the obtained FCM V1 certificate file (.json file). This item is valid only for V1 certificates. |
| Certificate name | String | Yes | The FCM sender ID.<br/> - V1 certificate: Obtain the sender ID in the **Firebase Cloud Messaging API (V1)** area on the **Project settings** > **Cloud Messaging** page in the [Firebase console](https://console.firebase.google.com/?hl=zh-cn), as shown below.<br/> - Legacy certificate: Obtain the sender ID in the **Cloud Messaging API (Legacy)** area on the **Project settings > Cloud Messaging** page in the [Firebase console](https://console.firebase.google.com/?hl=zh-cn), as shown below. |
| Push key | String | Yes | The FCM server key. You need to obtain the server key in the **Cloud Messaging API (Legacy)** area on the **Project settings** > **Cloud Messaging** page in the [Firebase console](https://console.firebase.google.com/), as shown below. This parameter is valid only for legacy certificates. |
| Channel ID | String | No | FCM channel ID. This parameter is valid only for offline push. |
| Push priority setting | | No | Message delivery priority. See [Set message priority](https://firebase.google.cn/docs/cloud-messaging/concept-options#setting-the-priority-of-a-message).<br/> This parameter is valid only for offline push. |
| Push message type | | No | The type of messages sent to the client through FCM:<br/> - **Data**: Data messages, which are handled by the client app.<br/> - **Notification**: Notification messages, which are automatically handled by the FCM SDK. **Data + notification**: Both notification messages and data messages can be sent through the FCM client.<br/>See FCM's [message type introduction](https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages).<br/> This parameter is valid only for offline push. |
| APNs cross-platform push support | String | No | Whether to enable APNs cross-platform push support. We recommend that you do not enable this parameter for non-cross-platform apps. This parameter is valid only for offline push. |

- Get the V1 certificate name

![image](/images/android/push/fcm_v1.png)

- Get the legacy certificate name and push key

![image](/images/android/push/fcm_old_version.png)

#### **Seamlessly switch from a legacy certificate to a V1 certificate**

The legacy HTTP or XMPP API was discontinued on June 20, 2024. Migrate to the latest FCM API (HTTP v1) certificate as soon as possible. For details, see the [FCM console](https://console.firebase.google.com). Make sure that the V1 certificate is available, because after the certificate conversion is performed, the legacy certificate is deleted. If the V1 certificate is unavailable, push failures occur.

You can follow these steps to seamlessly switch from a legacy certificate to a new V1 certificate:

1. On the **Certificate Management** page, click **Edit** in the **Actions** column of the legacy certificate.
2. In the **Google** tab of the **Edit push certificate** window, switch **Certificate type** to **V1**.
3. Click **Upload certificate** to upload the locally saved V1 certificate file (.json).
4. Click **Save** to complete the switch.

### Step 4: Integrate FCM push

1. In the `build.gradle` file of your app project, configure the dependency for the FCM library:

```gradle
plugins {
    id 'com.android.application'
    // Add the Google services Gradle plugin
    id 'com.google.gms.google-services'
}

dependencies {
    // ...
    // Import Firebase BoM.
    implementation platform('com.google.firebase:firebase-bom:32.7.4')
    // Declare the FCM dependency.
    // When using the BoM, do not specify versions in Firebase library dependencies.
    implementation 'com.google.firebase:firebase-messaging'
}
```

In your root-level (project-level) Gradle file (\<project\>/build.gradle):

```gradle
plugins {
  // ...

  // Add the dependency for the Google services Gradle plugin
  id 'com.google.gms.google-services' version '4.4.1' apply false

}
```

When using Firebase BoM, you need to explicitly declare `implementation platform('com.google.firebase:firebase-bom:32.7.4')` in the `dependencies` of the app module. After declaring the BoM, Firebase library dependencies do not need separate versions. The BoM version should be updated according to the actual needs of the project and the Firebase official release notes. For details, see [Firebase Android BoM](https://firebase.google.cn/docs/android/learn-more#bom) and [Firebase Android SDK Release Notes](https://firebase.google.cn/support/release-notes/android).

2. After synchronizing the app, inherit the service from `FirebaseMessagingService` and register it in `AndroidManifest.xml`.

```xml
<service android:name=".common.push.fcm.MyFCMMSGService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

3. Enable FCM in the EasyIM SDK.

```java
EMOptions options = new EMOptions();
...
EMPushConfig.Builder builder = new EMPushConfig.Builder(this);
// Replace with the user ID of your FCM sender.
builder.enableFCM("Your FCM sender id");
// Set pushconfig to EMOptions.
options.setPushConfig(builder.build());
// Initialize the EasyIM SDK.
EMClient.getInstance().init(this, options);
// After EasyIM SDK initialization.
EMPushHelper.getInstance().setPushListener(new PushListener() {
    @Override
    public void onBindTokenSuccess(EMPushType pushType, String pushToken) {
        EMLog.e("PushClient", "Push client bind token to easemob server success: " + pushType + " - " + pushToken);
    }
   @Override
   public void onError(EMPushType pushType, long errorCode) {
       EMLog.e("PushClient", "Push client occur a error: " + pushType + " - " + errorCode);
   }
   @Override
   // Select the push type. When the device supports both FCM push and other push types, you can use isSupportPush to select one push type.
   public boolean isSupportPush(EMPushType pushType, EMPushConfig pushConfig) {
       // Set whether FCM is supported.
       if(pushType == EMPushType.FCM) {
           return GoogleApiAvailabilityLight.getInstance().isGooglePlayServicesAvailable(MainActivity.this)
                    == ConnectionResult.SUCCESS;
       }
       return super.isSupportPush(pushType, pushConfig);
   }
});
```

4. After the EasyIM SDK login succeeds, upload the FCM device token.

When the app is initialized, the FCM SDK generates a unique registration token for the client app on the user's device. Because FCM uses this token to determine which device to send push messages to, the EasyIM server needs to obtain the registration token of the client app before it can send notification requests to FCM. FCM then verifies the registration token and sends notification messages to the Android device. We recommend placing this code on the main page after successful EasyIM login.

```java
// Check whether FCM is supported.
if(GoogleApiAvailabilityLight.getInstance().isGooglePlayServicesAvailable(MainActivity.this) != ConnectionResult.SUCCESS) {
    return;
}
FirebaseMessaging.getInstance().getToken().addOnCompleteListener(new OnCompleteListener<String>() {
    @Override
    public void onComplete(@NonNull Task<String> task) {
        if (!task.isSuccessful()) {
            EMLog.d("PushClient", "Fetching FCM registration token failed:"+task.getException());
            return;
    }
    // Get the new FCM registration token.
    String token = task.getResult();
    EMClient.getInstance().sendFCMTokenToServer(token);
    }
});

```

5. Monitor device token generation.

Override the `onNewToken` method in `FirebaseMessagingService` and update the device token to the EasyIM SDK in time after the device token is updated.

```java
public class MyFCMMSGService extends FirebaseMessagingService {
    private static final String TAG = "EMFCMMSGService";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        if (remoteMessage.getData().size() > 0) {
            String message = remoteMessage.getData().get("alert");
            Log.d(TAG, "onMessageReceived: " + message);
        }
    }

    @Override
    public void onNewToken(@NonNull String token) {
        Log.i("MessagingService", "onNewToken: " + token);
        // Save the token first to ensure it is not lost even when the SDK is not logged in.
        EMPushHelper.getInstance().setFCMPushToken(token);
        // Upload the token to the EasyIM server after successful login.
        if (EMClient.getInstance().isSdkInited()
                && EMClient.getInstance().isLoggedIn()) {
            EMClient.getInstance().sendFCMTokenToServer(token);
        }
    }
}
```

## **Test FCM push**

After you integrate and enable FCM in EasyIM, you can test whether the push integration succeeded.

### **Prerequisites**

Prepare an Android device officially released overseas to receive push notifications. Make sure the device meets the following conditions:
- It uses an overseas IP address to connect to EasyIM.
- It supports Google GMS services (Google Mobile Services).
- It can access Google network services normally. Otherwise, the device cannot receive push notifications from the FCM service.

To ensure reliable test results, avoid using an emulator.

### **Test steps**

1. Log in to the app on the device and confirm that the device token is bound successfully.
   You can check the logs or call [the RESTful API for obtaining user details](/rest/account_detail_obtain_single.html) to confirm whether the device token is bound successfully. After success, the `pushInfo` field appears under the `entities` field, and related information such as `device_Id`, `device_token`, and `notifier_name` appears under `pushInfo`.
2. Enable notification bar permissions for the app.
3. Kill the app process.
4. Send a test message in [EasyIM Console](https://console.easyim.ai/user/login).
   On the left navigation bar, choose **EasyIM** > **Operations Service** > **User Management**. On the **User Management** page, click **More** in the **Actions** column for the corresponding user ID, then select **Send rest message**. In the dialog box that appears, select the message type, enter the message content, and click **Send**.
5. Check whether the device receives the push notification.

### **Troubleshooting**

1. Check whether FCM push is correctly integrated or enabled in EasyIM.
   On the left navigation bar, choose **EasyIM > Operations Service > User Management**. On the **User Management** page, select **View IM user bound push certificate** in the **More** column for the corresponding user ID. In the pop-up box, check whether the certificate name and device token are displayed correctly.
2. Check whether the correct FCM certificate was uploaded in the console.
3. Check whether the message is being pushed in a chat room. Chat rooms do not support offline message push.
4. Check whether the device uses the ROM of a phone sold in the Chinese mainland. Some domestic phones from certain brands do not support GMS services and need to be replaced with devices released overseas.
5. Check whether only-online delivery was set when sending the message (`deliverOnlineOnly = true`). Messages sent only online are not pushed.

## API list

| API name | Module/class | Description |
| :--- | :--- | :--- |
| [`enableFCM`](#step-4-integrate-fcm-push) | `EMPushConfig.Builder` | Enables FCM push and sets the FCM Sender ID. |
| [`setPushConfig`](#step-4-integrate-fcm-push) | `EMOptions` | Sets the SDK push configuration. |
| [`init`](#step-4-integrate-fcm-push) | `EMClient` | Initializes the Android SDK. |
| [`sendFCMTokenToServer`](#step-4-integrate-fcm-push) | `EMClient` | Uploads the FCM Token to the EasyIM server. |
| [`setFCMPushToken`](#step-4-integrate-fcm-push) | `EMPushHelper` | Saves the FCM Token of the current device. |
| [`isSdkInited`](#step-4-integrate-fcm-push) | `EMClient` | Checks whether the SDK has been initialized. |
| [`isLoggedIn`](#step-4-integrate-fcm-push) | `EMClient` | Checks whether the current user has logged in. |
