# 常见问题

**Q**：如果推送通知栏未展示推送通知，是什么原因？

**A**：你可以按照以下顺序排查：

1. 确认接收方是否满足离线推送条件。应用进入后台或手机锁屏并不表示用户已离线；若长连接仍保持，不会因此触发离线推送。SDK 4.26.0 中，网络异常等可恢复断线的 `onDisconnected` 回调可能延迟，不能仅凭是否收到该回调判断当前连接状态。相关说明详见[离线推送过程](push_overview.html#离线推送过程)和[后台断连与断线通知宽限期](push_overview.html#后台断连与断线通知宽限期)。

2. 查看 Android 端通知权限是否打开，即通道通知权限是否打开。

![image](/images/android/push/push_notification_channel_android.png)

3. 检查推送通知的接收用户是否存在。

![image](/images/android/push/push_notification_user_search.png)

4. 查看推送通知的接收用户是否绑定了推送信息。

![image](/images/android/push/push_notification_user_bind.png)

![image](/images/android/push/push_notification_user_bind_info.png)

5. 查看推送证书是否存和证书推送测试。

在 [环信控制台](https://console.easemob.com) 的 **功能配置**  > **增值功能** > **即时推送** > **证书管理**页面选择要测试的推送证书（用户绑定的推送证书），选择 **更多** > **测试**。

![image](/images/android/push/push_notification_test.png)

在弹出的 **测试推送证书** 对话框中输入用户绑定的**设备Token**、**推送标题**、**推送内容**，然后点击**测试**，返回对应平台的测试结果。

![image](/images/android/push/huawei_push_notification_test.png)

6. 查看是否超过了厂商通道限制。

详见[推送消息分类](push_message_classification.html)。

7. 若以上均已排查后问题仍存在，请联系环信技术支持进一步排查问题原因。