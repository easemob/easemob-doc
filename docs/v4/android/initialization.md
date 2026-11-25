# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

:::tip
需要在主进程中进行初始化。
:::

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK 


如果使用应用专属域名，请先按 [配置应用专属域名](#配置应用专属域名) 设置服务地址，再调用初始化接口。
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
| `setUsePushInBackground(boolean usePushInBackground)`        | 设置应用进入后台后是否断开长连接并使用厂商推送。该功能自 SDK 4.26.0 起支持，且必须在初始化 SDK 前设置。<br/> - `true`：切入后台时推送通道有效，SDK 在约 10 秒后断开长连接；回到前台则取消尚未执行的任务。若在后台连接成功且开关已开启、通道有效，则直接断连，不再等待约 10 秒。后续消息满足服务端离线推送条件时，离线消息通过厂商推送通道下发。<br/> -（默认）`false`：应用进入后台后继续保持长连接。通过 `isUsePushInBackground()` 查询当前配置。详见 [配置后台消息接收策略](/v4/android/push/push_overview.html#配置后台消息接收策略)。 |
| `setDisconnectNotifyThreshold(int seconds)` | 设置可恢复断线的通知宽限期，单位为秒，默认 `10`；小于或等于 `0` 时立即触发断开回调。自 SDK 4.26.0 起支持，初始化前后均可设置。通过 `getDisconnectNotifyThreshold()` 查询。详见 [配置断线通知宽限期](connection.html#配置断线通知宽限期)。 |
| `setAutoAcceptGroupInvitation(boolean value)`                | 设置是否自动接受加群邀请。<br/>`value` 参数表示是否自动接受加群邀请。 <br/> -（默认）`true`：自动接受加群申请； <br/> -  `false`: 不自动接受加群申请。 |
| `setAcceptInvitationAlways(boolean value)`                   | 设置是否自动接受加好友邀请。 <br/>`value` 参数表示是否自动接受加好友邀请。 <br/> -（默认）`true`：自动接受好友邀请。 <br/> -  `false`：不自动接收好友邀请。 |
| `setEnableChatroomConversation(boolean enable)`                    | 设置获取本地会话列表时是否包含聊天室会话。该配置不控制聊天室会话的创建或存储，也不影响聊天室消息的正常收发。该功能自 SDK 4.25.1 起支持。<br/> - `true`：本地会话列表中包含聊天室会话。<br/> -（默认）`false`：本地会话列表中不包含聊天室会话。必须在初始化 SDK 前设置。<br/> 你可以通过 `EMOptions#isEnableChatroomConversation()` 查询当前配置下获取本地会话列表时是否包含聊天室会话。 |
| `setDeleteMessagesAsExitChatRoom(boolean delete)`            | 设置退出(主动和被动退出)聊天室时是否删除聊天消息。<br/> `delete` 参数表示退出(主动和被动退出)聊天室时是否删除聊天消息： <br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `setDeleteMessagesAsExitGroup(boolean delete)`               | 设置退出(主动和被动退出)群组时是否删除聊天消息。<br/>`delete` 参数表示退出群组时是否删除聊天消息： <br/> -（默认）`true`: 退出群组时删除群组消息。 <br/> -  `false`: 退出群组时不删除群组消息。 |
| `allowChatroomOwnerLeave(boolean allowed)`                   | 设置是否允许聊天室所有者离开并删除会话记录。<br/>`allowed` 参数表示是否允许聊天室所有者离开。<br/> - （默认） `true`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `false`：不允许。 |

关于私有云 SDK 的 IP 地址/域名配置，详见 [配置文档](private_ip_domain.html)。

## 配置应用专属域名

Android SDK 自 **4.17.0** 起提供以下 REST 和 WebSocket 服务地址配置接口，建议使用包含 4.17.1 修复的版本。使用应用专属域名时，请使用当前应用的地址配置 SDK；域名查看入口及展示规则见 [查看应用服务器域名](/product/console/app_manage.html#查看应用服务器域名)。

#### 初始化前配置地址

在控制台进入目标应用的详情页，从 **开发配置信息 > 域名配置** 中复制 **REST API** 和 **Websocket** 地址，并使用同一页面的 App Key。请按以下格式填写 SDK 参数。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `setRestServer` 的 `restServer` | String | 是 | REST API 基准地址，保留 `https://` 及实际端口，例如 `https://api-your-app.example.com`；不追加组织名、应用名或业务接口路径。 |
| `setWebSocketServer` 的 `wsServer` | String | 是 | WebSocket 主机名，例如 `ws-your-app.example.com`；不包含 `wss://`、端口或路径。 |
| `setWebSocketPort` 的 `wsPort` | int | 是 | WSS 默认端口为 `443`；若控制台明确提供其他端口，使用实际值。 |
| `setEnableTLSConnection` 的布尔值 | boolean | 是 | 设为 `true`，使用 WSS。 |
| `enableDNSConfig` 的布尔值 | boolean | 是 | 默认 `true`；使用指定的服务连接地址时设为 `false`。 |

:::notice
选择 **创建新的正式版应用** 上线时，正式版与测试版是两个应用，应从正式版详情页重新获取 App Key 和两项地址，不能只替换 App Key。详见 [应用上线](/product/console/app_launch.html#上线事项)。
:::

以下代码替换现有初始化入口中的配置。请沿用业务所需的其他初始化设置，不要在已经初始化后通过再次调用初始化接口切换地址。请在应用主进程中执行。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setRestServer("https://api-your-app.example.com");
options.setWebSocketServer("ws-your-app.example.com");
options.setWebSocketPort(443);
options.setEnableTLSConnection(true);
options.enableDNSConfig(false);

EMClient.getInstance().init(getApplicationContext(), options);
```

应用专属域名使用 WebSocket 消息长连接，不使用 `setIMServer` 和 `setImPort` 配置 TCP 地址。自 SDK **4.25.1** 起，数据同步地址根据 REST 配置自动获取，无需单独设置。

#### 检查配置结果

地址设置方法和初始化接口不提供独立的“域名连接成功”回调。初始化完成后，按 [初始化后设置监听](#初始化后设置监听) 注册连接监听，再按 [登录](login.html) 文档登录。确认连接成功，并通过 SDK 日志检查实际连接的服务主机。

分别验证消息收发、REST 请求和启用的自动同步功能。消息连接成功不代表所有请求和数据同步均已成功；失败时请记录错误信息，并对照 [错误码](error.html) 排查 App Key、域名、端口、TLS 和网络访问情况。


## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。自 SDK 4.26.0 起，可恢复断线的通知受 [断线通知宽限期](connection.html#配置断线通知宽限期) 控制；查询当前实际连接状态请使用 `EMClient#getConnectionState()`，详见 [查询连接状态](connection.html#查询连接状态)。

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
    // SDK 成功连接到 IM 服务器时触发。
    }
    @Override
    public void onDisconnected(int errorCode) {
    // SDK 触发断开通知时调用，可恢复断线可能延迟通知。
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





