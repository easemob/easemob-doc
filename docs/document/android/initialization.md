# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

:::tip
需要在主进程中进行初始化。
:::

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK 

初始化时，你需要通过 `EMOptions` 中封装的 `setAppKey` 设置你的 App Key。

```java
EMOptions options = new EMOptions();
options.setAppKey("Your appkey");
......// 其他 EMOptions 配置。
EMClient.getInstance().init(context, options);
```

下表列明初始化配置 `EMOptions` 封装的一些方法。`EMOptions` 封装的所有方法，详见 [API 参考](https://doc.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_options.html)。

| 方法名称           | 描述            |
| :----------------- | :---------------- |
| `setAppKey(String appkey)`                                   | 设置 App Key。<br/>`appkey` 参数为创建 app 时在环信控制台上注册的 app 唯一识别符。 |
| `setAutoLogin(boolean autoLogin)`                            | 开启/关闭自动登录。<br/>`autoLogin` 参数表示是否开启自动登录： <br/> -（默认）`true`：自动登录。**若使用默认设置，首次登录后，后续会自动登录。这种情况下，若再手动登录，则会提示用户已登录。**<br/> -  `false`：不自动登录。 |
| `setPushConfig(EMPushConfig pushConfig)`                     | 设置推送相关配置。<br/>`pushConfig` 参数为推送相关配置。         |
| `setAutoAcceptGroupInvitation(boolean value)`                | 设置是否自动接受加群邀请。<br/>`value` 参数表示是否自动接受加群邀请。 <br/> -（默认）`true`：自动接受加群申请； <br/> -  `false`: 不自动接受加群申请。 |
| `setAcceptInvitationAlways(boolean value)`                   | 设置是否自动接受加好友邀请。 <br/>`value` 参数表示是否自动接受加好友邀请。 <br/> -（默认）`true`：自动接受好友邀请。 <br/> -  `false`：不自动接收好友邀请。 |
| `setDeleteMessagesAsExitChatRoom(boolean delete)`            | 设置退出(主动和被动退出)聊天室时是否删除聊天消息。<br/> `delete` 参数表示退出(主动和被动退出)聊天室时是否删除聊天消息： <br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `setDeleteMessagesAsExitGroup(boolean delete)`               | 设置退出(主动和被动退出)群组时是否删除聊天消息。<br/>`delete` 参数表示退出群组时是否删除聊天消息： <br/> -（默认）`true`: 退出群组时删除群组消息。 <br/> -  `false`: 退出群组时不删除群组消息。 |
| `allowChatroomOwnerLeave(boolean allowed)`                   | 设置是否允许聊天室所有者离开并删除会话记录。<br/>`allowed` 参数表示是否允许聊天室所有者离开。<br/> - （默认） `true`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `false`：不允许。 |

关于私有云 SDK 的 IP 地址/域名配置，详见 [配置文档](private_ip_domain.html)。

## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
    // SDK 成功连接到 IM 服务器时触发。
    }
    @Override
    public void onDisconnected(int errorCode) {
    // SDK 与 IM 服务器断开连接时触发。
    }
};
// 注册连接状态监听
EMClient.getInstance().addConnectionListener(connectionListener);
// 移除连接状态监听
EMClient.getInstance().removeConnectionListener(connectionListener);
EMMessageListener msgListener = new EMMessageListener() {

   // 收到消息，遍历消息队列，解析和显示。
   @Override
   public void onMessageReceived(List<EMMessage> messages) {

   }
};
// 注册消息监听
EMClient.getInstance().chatManager().addMessageListener(msgListener);
// 解注册消息监听
EMClient.getInstance().chatManager().removeMessageListener(msgListener);
```





