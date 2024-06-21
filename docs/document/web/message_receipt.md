# 实现消息回执

<Toc />

**单聊会话支持消息送达回执和消息已读回执**，发送方发送消息后可及时了解接收方是否及时收到并阅读了消息。

**群聊会话只支持消息已读回执，不支持送达回执**。群成员在发送消息时，可以设置该消息是否需要已读回执。要使用该功能，你需要[在环信即时通讯云控制台上开通该功能](/product/enable_and_configure_IM.html#设置群消息已读回执)，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。

- 消息送达回执的效果示例，如下图所示：

![img](@static/images/uikit/chatuikit/feature/web/common/message_delivery_receipt.png) 

- 消息已读回执的效果示例，如下图所示：

![img](@static/images/uikit/chatuikit/feature/web/common/message_read_receipt.png) 

## 技术原理

实现消息送达回执和已读回执的逻辑如下：

- 单聊消息送达回执：

1. SDK 初始化时，用户将 [`ConnectionParameters` 类型中的 `delivery` 参数](https://doc.easemob.com/jsdoc/interfaces/Connection.ConnectionParameters.html#delivery)设置为 `true`。 

2. 接收方收到消息后，SDK 会自动向发送方发送送达回执。

3. 发送方通过监听 `onDeliveredMessage` 收到消息送达回执。

- 单聊消息已读回执：

  1. 发送方发送一条消息。

  2. 消息接收方收到消息后，调用 `send` 发送消息已读回执；
  
  3. 消息发送方通过 `onReadMessage` 回调接收消息已读回执。

- 群聊消息已读回执：

  1. 发送方发送一条消息，消息中的 `allowGroupAck` 字段设置为 `true`，要求返回已读回执；

  2. 消息接收方收到消息后调用 `send` 方法发送群组消息的已读回执。

  3. 发送方在线监听 `onReadMessage` 回调或离线监听 `onStatisticsMessage` 回调接收消息回执。
  
  4. 发送方通过 `getGroupMsgReadUser` 方法获取阅读消息的用户的详情。

## 前提条件

开始前，请确保满足以下要求：

- 已经集成和初始化环信 IM SDK，并实现了注册账号和登录功能。详情请参见 [快速开始](quickstart.html)。
- 了解 [使用限制](/product/limitation.html) 中的 API 调用频率限制。
- 要使用群消息已读回执功能，需在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通，具体费用详见[产品价格](/product/pricing.html#增值服务费用)。

## 实现方法

### 单聊消息送达回执

发送消息送达回执，可参考以下步骤：

1. 消息发送方在 SDK 初始化时将 `ConnectionParameters` 中的 `delivery` 设置为 `true`。

当接收方收到消息后，SDK 底层会自动进行消息送达回执。

```javascript
const conn = new websdk.connection({
  appKey: "your appKey",
  delivery: true,
});
```

2. 接收方收到消息后，发送方会收到 `onDeliveredMessage` 回调，得知消息已送达接收方。

```javascript
conn.addEventHandler("customEvent", {
  onReceivedMessage: function (message) {}, // 收到消息送达服务器回执。
  onDeliveredMessage: function (message) {}, // 收到消息送达客户端回执。
});
```

### 单聊消息已读回执

单聊既支持消息已读回执，也支持[会话已读回执](conversation_receipt.html)。我们建议你结合使用这两种回执：

- 聊天页面打开时，若收到消息，发送消息已读回执。
- 聊天页面未打开时，若有未读消息，进入聊天页面，发送会话已读回执。这种方式可避免发送多个消息已读回执。

单聊消息的已读回执有效期与消息在服务端的存储时间一致，即在服务器存储消息期间均可发送已读回执。消息在服务端的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。 

参考如下步骤在单聊中实现消息已读回执。

1. 接收方发送消息已读回执。

- 消息接收方进入会话时，发送会话已读回执。

```javascript
let option = {
  chatType: "singleChat", // 会话类型，设置为单聊。
  type: "channel", // 消息类型。
  to: "userId", // 接收消息对象的用户 ID。
};
let msg = WebIM.message.create(option);
conn.send(msg);
```

- 在会话页面，接收到消息时发送消息已读回执，如下所示：

```javascript
let option = {
  type: "read", // 消息类型为消息已读回执。
  chatType: "singleChat", // 会话类型，这里为单聊。
  to: "userId", // 消息接收方的用户 ID。
  id: "id", // 需要发送已读回执的消息 ID。
};
let msg = WebIM.message.create(option);
conn.send(msg);
```

2. 消息发送方监听消息已读回调。

你可以调用接口监听指定消息是否已读，示例代码如下：

```javascript
conn.addEventHandler("customEvent", {
  onReadMessage: (message) => {},
});
```

### 群聊消息已读回执 

对于群聊，群成员发送消息时，可以设置该消息是否需要已读回执。若需要，每个群成员在阅读消息后，SDK 均会发送已读回执，即阅读该消息的群成员数量即为已读回执的数量。

群消息已读回执特性的使用限制如下表所示：

| 使用限制| 默认 | 描述 | 报错 |
| :--------- | :----- | :------- | :--------------- |
| 功能开通   | 关闭   | 仅专业版及以上版本支持群消息已读回执功能。若要使用该功能，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**即时通讯** > **功能配置** > **功能配置总览**> **基础功能**页签下，搜索找到 **消息已读回执（群聊）** 开通功能。具体费用详见[产品价格](/product/pricing.html#增值服务费用)。 | 若使用前未开通，SDK 提示 "group ack msg not open" 错误。|
| 使用权限  | 群组管理员和群主    | 默认情况下，群主和群组管理员有权限。<br/>可以联系环信商务为普通群成员开放权限。   | 若该权限未开放给普通群成员，普通成员发送消息要求已读回执时，SDK 会提示 "group ack msg permission denied" 错误。  |
| 已读回执有效期    | 3 天    | 群聊已读回执的有效期为 3 天，即群组中的消息发送时间超过 3 天，服务器不记录阅读该条消息的群组成员，也不会发送已读回执。   | 若超过上限天数，SDK 会提示 "group ack msg not found" 错误。  |
| 群规模    |  500 人   | 该特性最大支持 500 人的群组。也就是说，群组中每条消息最多可返回 500 条已读回执。  | 不报错。若超过该上限，最新的已读回执记录会覆盖最早的记录。 |
| 群消息条数上限    | 500 条 | 单个群组每天最多支持 500 条消息要求已读回执。  | 若超过上限，SDK 返回 "limit send group ack msg" 错误。  |

你可以按以下步骤实现群消息已读回执特性：

1. 群成员发送消息时若需已读回执，需设置 `allowGroupAck` 为 `true`：

```javascript
sendGroupReadMsg = () => {
    let option = {
        type: 'txt',            // 消息类型。
        chatType: 'groupChat',  // 会话类型，这里为群聊。
        to: 'groupId',          // 消息接收方，即群组 ID。
        msg: 'message content'  // 消息内容。
        msgConfig: { allowGroupAck: true } // 设置此消息需要已读回执。
    }

    let msg = WebIM.message.create(option);
    conn.send(msg).then((res) => {
        console.log('send message success');
    }).catch((e) => {
        console.log("send message error");
    })
}
```

2. 阅读消息后，消息接收方发送群消息已读回执。

```javascript
sendReadMsg = () => {
  let option = {
    type: "read", // 消息是否已读。
    chatType: "groupChat", // 会话类型，这里为群聊。
    id: "msgId", // 需要发送已读回执的消息 ID。
    to: "groupId", // 群组 ID。
    ackContent: JSON.stringify({}), // 回执内容。
  };
  let msg = WebIM.message.create(option);
  conn.send(msg);
};
```

3. 消息发送方通过监听以下任一回调接收消息已读回执：

   - `onReadMessage`：消息发送方在线时监听该回调。
   - `onStatisticMessage`：消息发送方离线时监听该回调。

   ```javascript
   // 在线时可以在 onReadMessage 里监听。
   conn.addEventHandler("customEvent", {
     onReadMessage: (message) => {
       let { mid } = message;
       let msg = {
         id: mid,
       };
       if (message.groupReadCount) {
         // 消息已读数。
         msg.groupReadCount = message.groupReadCount[message.mid];
       }
     },

     // 离线时收到回执，登录后会在这里监听到。
     onStatisticMessage: (message) => {
       let statisticMsg = message.location && JSON.parse(message.location);
       let groupAck = statisticMsg.group_ack || [];
     },
   });
   ```

4. 消息发送方收到群消息已读回执后，可以获取已阅读该消息的用户的详细信息：

   ```javascript
   conn
     .getGroupMsgReadUser({
       msgId: "messageId", // 消息 ID。
       groupId: "groupId", // 群组 ID。
     })
     .then((res) => {
       console.log(res);
     });
   ```

### 已读回执与未读消息数

会话已读回执发送后，如果用户启用了本地数据库，可以手动调用 `clearConversationUnreadCount` 方法，将该会话的未读消息数清零。


