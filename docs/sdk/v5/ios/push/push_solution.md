# FAQs

**Q**: If the push notification is not shown in the notification bar, what is the reason?

**A**: You can troubleshoot in the following order:

1. Check whether the iOS app has been granted notification permissions.

![image](/images/ios/push/push_notification_channel_ios.png)

2. Check whether the user who receives the push notification exists.

![image](/images/android/push/push_notification_user_search.png)

3. Check whether the receiving user of the push notification has bound push information.

![image](/images/android/push/push_notification_user_bind.png)

![image](/images/android/push/push_notification_user_bind_info.png)

4. Check whether the push certificate exists and whether push testing is available.

On the [EasyIM Console](https://console.easemob.com), go to **Value-Added Features** > **Push** > **Certificate Management**, select the push certificate you want to test, which is the certificate bound to the user, and choose **More** > **Test**.

![image](/images/android/push/push_notification_test.png)

In the **Test Push Certificate** dialog box, enter the user's bound **device token**, **push title**, and **push content**, then click **Test** to view the test result for the corresponding platform.

![image](/images/android/push/huawei_push_notification_test.png)

5. If the issue still exists after all of the above checks, contact EasyIM technical support for further investigation.
