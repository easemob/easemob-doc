# 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

:::tip
需要在主进程中进行初始化。
:::

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见 [环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

初始化时，你需要通过 `EMOptions` 中封装的 `appKey` 设置你的 App Key。

```typescript
ChatClient.getInstance()
  .init(
    new ChatOptions({
      appKey: appKey,
    }),
  )
  .then(() => {
    console.log("init: success");
  })
  .catch((reason) => {
    console.error(reason);
  });
```

下表列明初始化配置 `ChatOptions` 封装的一些属性。`ChatOptions` 封装的所有属性，详见 [API 参考](https://doc.easemob.com/apidoc/rn/classes/ChatOptions.html)。

| 属性           | 描述            |
| :----------------- | :---------------- |
| `appKey`     | `appkey` 参数为创建 app 时在环信控制台上注册的 app 唯一识别符。 |
| `autoLogin`                            | 是否自动登录。<br/> -（默认）`true`：自动登录。**若使用默认设置，首次登录后，后续会自动登录。这种情况下，若再手动登录，则会提示用户已登录。**<br/> -  `false`：不自动登录。 |
| `autoAcceptGroupInvitation`         | 是否自动接受加群邀请。<br/> -（默认）`true`：自动接受加群申请； <br/> -  `false`: 不自动接受加群申请。 |
| `acceptInvitationAlways `                   | 是否自动接受加好友邀请。 <br/> -（默认）`true`：自动接受好友邀请。 <br/> -  `false`：不自动接收好友邀请。 |
| `deleteMessagesAsExitChatRoom`         | 退出(主动和被动退出)聊天室时是否删除聊天消息。<br/> -（默认）`true`：删除。 <br/> -  `false`：保留。 |
| `deleteMessagesAsExitGroup`               | 退出(主动和被动退出)群组时是否删除聊天消息。<br/> -（默认）`true`: 退出群组时删除群组消息。 <br/> -  `false`: 退出群组时不删除群组消息。 |
| `isChatRoomOwnerLeaveAllowed`                   | 是否允许聊天室所有者离开并删除会话记录。<br/> - （默认） `true`：允许。即使聊天室所有者离开，该所有者仍具有聊天室的所有权限，只不过不再接收任何消息。<br/> - `false`：不允许。 |

## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```ts
ChatClient.getInstance().addConnectionListener({
  // SDK 成功连接到 IM 服务器时触发。
  onConnected(): void {
    console.log('LoginAndLogoutScreen.onConnected');
  },
  // SDK 与 IM 服务器断开连接时触发。
  onDisconnected(): void {
    console.log('LoginAndLogoutScreen.onDisconnected');
  },
});
ChatClient.getInstance().chatManager.addMessageListener({
   // 收到消息时触发。
   onMessagesReceived(messages: Array<ChatMessage>): void {
    console.log('onMessagesReceived: ', messages);
  },
});
```