# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK 

初始化时，你需要通过 `appKey` 参数设置你的 App Key。

```typescript
let options = new ChatOptions({
  appKey: "你的 AppKey"
});
......// 其他 ChatOptions 配置。
// 初始化时传入上下文以及 options
ChatClient.getInstance().init(context, options);
```

自 SDK 1.8.0 开始，支持通过字面量的方式设置初始化时的条件，示例代码如下：
  
```typescript
ChatClient.getInstance().init(this.context, {
  appKey: "您的AppKey",
  appIDForPush: "您在 AppGallery Connect 获取到的 ClientID。",
  // 关闭自动登录
  isAutoLogin: false,
  // 其他更多设置
});
```

下表列明初始化配置 `ChatOptions` 封装的一些方法。`ChatOptions` 封装的所有方法，详见 [API 参考](https://doc.easemob.com/apidoc/harmony/chat3.0/classes/ChatOptions.ChatOptions.html)。

| 方法名称           | 描述            |
| :----------------- | :---------------- |
| `setAppKey(appKey)`                                   | 设置 App Key。<br/>`appKey` 参数为创建 app 时在环信控制台上注册的 app 唯一识别符。 |
| `setAutoLogin(boolean autoLogin)`                            | 开启/关闭自动登录。<br/>`autoLogin` 参数表示是否开启自动登录： <br/> -（默认）`true`：自动登录。**若使用默认设置，首次登录后，后续会自动登录。这种情况下，若再手动登录，则会提示用户已登录。**<br/> -  `false`：不自动登录。 |
| `setAppIDForPush(appId)`                     | 设置用于推送的 app ID。         |
| `setAutoAcceptGroupInvitations(isAutoAcceptGroups)`                | 设置是否自动接受加群邀请。<br/>`isAutoAcceptGroups` 参数表示是否自动接受加群邀请。 <br/> -（默认）`true`：自动接受加群申请； <br/> -  `false`: 不自动接受加群申请。 |
| `setAcceptInvitationAlways(isAutoAccept)`                   | 设置是否自动接受加好友邀请。 <br/>`isAutoAccept` 参数表示是否自动接受加好友邀请。 <br/> -（默认）`true`：自动接受好友邀请。 <br/> -  `false`：不自动接收好友邀请。 |
| `isDeleteMessagesOnLeaveChatroom()`            | 设置退出(主动和被动退出)聊天室时是否删除聊天消息。<br/>返回值如下：<br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `isDeleteMessagesOnLeaveGroup`               | 设置退出(主动和被动退出)群组时是否删除聊天消息。<br/>返回值如下：<br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `allowChatroomOwnerLeave(isChatroomOwnerLeaveAllowed)`                   | 设置是否允许聊天室所有者离开并删除会话记录。`isChatroomOwnerLeaveAllowed` 的值如下：<br/> - （默认） `true`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `false`：不允许。 |

关于私有云 SDK 的 IP 地址/域名配置，详见 [配置文档](private_ip_domain.html)。

## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```typescript
    // 设置连接状态监听器。
    ChatClient.getInstance().addConnectionListener({
      onConnected: (): void => {
        // SDK 成功连接到 IM 服务器时触发。
      },
      onDisconnected: (errorCode: number): void => {
        // SDK 与 IM 服务器断开连接时触发。
      }
    });
    // 设置消息监听器。
    ChatClient.getInstance().chatManager()?.addMessageListener({
      onMessageReceived: (messages: ChatMessage[]): void => {
        // 处理接收到的消息
      }
    });
```