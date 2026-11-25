# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK


如果使用应用专属域名，请先按 [配置应用专属域名](#配置应用专属域名) 设置服务地址，再调用初始化接口。
初始化时，你需要通过 `appKey` 参数设置你的 App Key。

```swift
let options = EMOptions(appkey: "Your appkey")
......// 其他 EMOptions 配置。
EMClient.shared().initializeSDK(with: options)
```

下表列明初始化配置 `EMOptions` 封装的一些属性。`EMOptions` 封装的所有属性，详见 [API 参考](https://doc.easemob.com/apidoc/ios/chat3.0/interface_e_m_options.html)。

| 属性           | 描述            |
| :----------------- | :---------------- |
| `appkey`                                   | `appkey` 属性为创建 app 时在环信控制台上注册的 app 唯一识别符。 |
| `isAutoLogin`   | 是否自动登录。<br/> -（默认）`YES`：自动登录。**若使用默认设置，首次登录后，后续会自动登录。这种情况下，若再手动登录，则会提示用户已登录。**<br/> -  `NO`：不自动登录。 |
| `disconnectNotifyThreshold` | 断线通知宽限时间，单位为秒，默认值为 `10`，自 SDK 4.26.0 起支持。成功建立连接后，发生可恢复断线时，宽限期内重连成功则不触发断开连接回调；到期仍未恢复才触发。设置为小于或等于 `0` 时不启用宽限期。首次连接失败、token 过期或被踢下线等情况仍按原有机制通知。宽限期仅影响断开连接回调的时机，不延迟连接状态变化。详见 [配置断线通知宽限期](connection.html#配置断线通知宽限期)。 |
| `pushKitCertName`   | PushKit 的证书名称。 |
| `apnsCertName` | APNs 推送证书名称，需与环信控制台配置的证书名称一致。在 SDK 初始化时设置，具体步骤见 [将证书名称传递给 SDK](/push/push_apns.html#步骤二-将证书名称传递给-sdk)。 |
| `autoAcceptGroupInvitation`   可             | 是否自动接受加群邀请。<br/> -（默认）`YES`：自动接受加群申请。 <br/> -  `NO`: 不自动接受加群申请。 |
| `autoAcceptFriendInvitation`   可     | 设置是否自动接受加好友邀请。 <br/> -（默认）`YES`：自动接受好友邀请。 <br/> -  `NO`：不自动接收好友邀请。 |
| `enableChatroomConversation`            | 设置获取本地会话列表时是否包含聊天室会话。该配置不控制聊天室会话的创建或存储，也不影响聊天室消息的正常收发。该功能自 SDK 4.25.0 起支持。<br/> - `YES`：本地会话列表中包含聊天室会话。<br/> -（默认）`NO`：本地会话列表中不包含聊天室会话。必须在初始化 SDK 前设置。<br/> 你可以通过 `EMOptions#enableChatroomConversation` 查询当前配置下获取本地会话列表时是否包含聊天室会话。 |
| `deleteMessagesOnLeaveChatroom`            | 设置主动或被动退出聊天室时是否删除该聊天室的本地消息。该配置不决定获取本地会话列表时是否包含聊天室会话。<br/> -（默认）`YES`：删除本地消息。 <br/> - `NO`：保留本地消息。 |
| `deleteMessagesOnLeaveGroup`               | 退出(主动和被动退出)群组时是否删除聊天消息。<br/> -（默认）`YES`: 退出群组时删除群组消息。 <br/> -  `NO`: 退出群组时不删除群组消息。 |
| `canChatroomOwnerLeave`                   | 是否允许聊天室所有者离开并删除会话记录。<br/> - （默认） `YES`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `NO`：不允许。 |

关于私有云 SDK 的 IP 地址/域名配置，详见 [配置文档](private_ip_domain.html)。

## 配置应用专属域名

iOS SDK 自 **4.17.0** 起提供以下 REST 和 WebSocket 服务地址配置属性，建议使用包含 4.17.1 修复的版本。使用应用专属域名时，请使用当前应用的地址配置 SDK；域名查看入口及展示规则见 [查看应用服务器域名](/product/console/app_manage.html#查看应用服务器域名)。

#### 初始化前配置地址

在控制台进入目标应用的详情页，从 **开发配置信息 > 域名配置** 中复制 **REST API** 和 **Websocket** 地址，并使用同一页面的 App Key。请按以下格式填写 SDK 参数。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `restServer` | NSString | 是 | REST API 基准地址，保留 `https://` 及实际端口，例如 `https://api-your-app.example.com`；不追加组织名、应用名或业务接口路径。 |
| `webSocketServer` | NSString | 是 | WebSocket 主机名，例如 `ws-your-app.example.com`；不包含 `wss://`、端口或路径。 |
| `webSocketPort` | int | 是 | WSS 默认端口为 `443`；若控制台明确提供其他端口，使用实际值。 |
| `enableTLSConnection` | BOOL | 是 | 默认 `NO`；本文设为 `YES`，使用 WSS。 |
| `usingHttpsOnly` | BOOL | 否 | 示例显式设为 `YES`，REST 请求仅使用 HTTPS；不能替代 WebSocket 的 TLS 开关。 |
| `enableDnsConfig` | BOOL | 是 | 默认 `YES`；本文设为 `NO`。必须在首次初始化前设置。 |

:::notice
选择 **创建新的正式版应用** 上线时，正式版与测试版是两个应用，应从正式版详情页重新获取 App Key 和两项地址，不能只替换 App Key。详见 [应用上线](/product/console/app_launch.html#上线事项)。
:::

以下代码替换现有初始化入口中的配置。请沿用业务所需的其他初始化设置，不要在已经初始化后通过再次调用初始化接口切换地址。以下为 Objective-C 示例，请引入 `EMOptions+PrivateDeploy.h` 后配置；Swift 项目使用对应的 `EMOptions` 属性完成相同设置。

```objectivec
#import <HyphenateChat/HyphenateChat.h>
#import <HyphenateChat/EMOptions+PrivateDeploy.h>

EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.restServer = @"https://api-your-app.example.com";
options.webSocketServer = @"ws-your-app.example.com";
options.webSocketPort = 443;
options.enableTLSConnection = YES;
options.usingHttpsOnly = YES;
options.enableDnsConfig = NO;

EMError *error = [[EMClient sharedClient] initializeSDKWithOptions:options];
if (error != nil) {
    NSLog(@"SDK 初始化失败：%@", error.errorDescription);
}
```

WebSocket 地址只填写主机名，端口和 TLS 分别配置，不使用 TCP 的 `chatServer` 和 `chatPort`。自 SDK **4.25.0** 起，数据同步地址根据 REST 配置自动获取，无需单独设置。

#### 检查配置结果

地址设置方法和初始化接口不提供独立的“域名连接成功”回调。初始化完成后，按 [初始化后设置监听](#初始化后设置监听) 注册连接监听，再按 [登录](login.html) 文档登录。确认连接成功，并通过 SDK 日志检查实际连接的服务主机。

分别验证消息收发、REST 请求和启用的自动同步功能。消息连接成功不代表所有请求和数据同步均已成功；失败时请记录错误信息，并对照 [错误码](error.html) 排查 App Key、域名、端口、TLS 和网络访问情况。


## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```swift
// 设置连接状态监听器。
EMClient.shared().add(self, delegateQueue: nil)

extension ViewController: EMClientDelegate {
    func connectionStateDidChange(_ aConnectionState: EMConnectionState) {
        if aConnectionState == .connected {
            // SDK 成功连接到 IM 服务器时触发。
        } else {
            // SDK 与 IM 服务器断开连接时触发。
        }
    }
}

// 设置消息监听器。
EMClient.shared().chatManager?.add(self, delegateQueue: nil)

extension ViewController: EMChatManagerDelegate {
    func messagesDidReceive(_ aMessages: [EMChatMessage]) {
        // 处理接收到的消息
    }
}
```
