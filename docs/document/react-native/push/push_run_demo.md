# 运行示例项目

查看完整示例项目，请点击[这里](https://github.com/AsteriskZuo/RNTestPushExample/tree/chat)。

启动项目后，界面如下图所示。

![img](/images/react-native/push/push_example_ui.png)

在该页面，你可以发送消息，接收方若离线会收到推送通知：

1. 在页面上输入 `pushtype` 和 `appkey`，点击 `init action` 按钮, 执行初始化，初始化日志以及后续日志会在空白位置显示。

2. 在页面上输入用户 ID 和密码，点击 `login action` 按钮进行登录。

3. 点击 `get token action` 按钮获取 Token，并发送到服务端。

4. 输入 `target id` 和 `content`，点击 `send text message` 按钮发送文本消息。
   
5. 接收方的登录设备会在通知栏收到离线推送通知，如下图所示。

**注意：接收离线消息，需要杀死当前登录的应用，否则服务端将按照在线推送消息，不推送离线消息。**

![img](/images/android/push/push_displayattribute_1.png)