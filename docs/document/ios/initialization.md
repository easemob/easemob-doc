# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

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
| `pushKitCertName`   | PushKit 的证书名称。 |
| `setPushConfig(EMPushConfig pushConfig)`                     | 设置推送相关配置。<br/>`pushConfig` 参数为推送相关配置。         |
| `autoAcceptGroupInvitation`   可             | 是否自动接受加群邀请。<br/> -（默认）`YES`：自动接受加群申请。 <br/> -  `NO`: 不自动接受加群申请。 |
| `autoAcceptFriendInvitation`   可     | 设置是否自动接受加好友邀请。 <br/> -（默认）`YES`：自动接受好友邀请。 <br/> -  `NO`：不自动接收好友邀请。 |
| `deleteMessagesOnLeaveChatroom`            | 退出(主动和被动退出)聊天室时是否删除聊天消息。<br/> -（默认）`YES`：删除。 <br/> -  `NO`：保留。 |
| `deleteMessagesOnLeaveGroup`               | 退出(主动和被动退出)群组时是否删除聊天消息。<br/> -（默认）`YES`: 退出群组时删除群组消息。 <br/> -  `NO`: 退出群组时不删除群组消息。 |
| `canChatroomOwnerLeave`                   | 是否允许聊天室所有者离开并删除会话记录。<br/> - （默认） `YES`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `NO`：不允许。 |

关于私有云 SDK 的 IP 地址/域名配置，详见 [配置文档](private_ip_domain.html)。

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
