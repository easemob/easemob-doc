# 消息仅投递在线用户

环信即时通讯 IM 支持只将消息投递给在线用户。若接收方不在线，则无法收到消息。该功能用于实现应用只需要向在线用户进行展示目的，例如，利用透传消息实现群投票的票数实时变化, 只有在线用户需要关注实时变化的动态, 离线用户只需要再次上线时获取最终状态。

各类型的消息均支持该功能，但该功能只支持单聊和群组聊天，**不适用于聊天室**。该类的消息与普通消息相比，存在如下差异：

1. **不支持离线存储**：若发送消息时，接收方离线则无法收到消息，即使重新登录后也收不到消息。对于普通消息，当接收方在线时, 实时收到消息提醒；当接收方离线时，实时发送离线推送消息，接收方再次上线时, 由环信 IM 服务器主动推给客户端离线期间的消息。
2. **默认不支持漫游存储**：发送的消息默认不存储在环信消息服务器，用户在其他终端设备上无法获取到该消息。**如需开通在线消息的漫游存储，需联系环信商务。**

## 技术原理

环信即时通讯 IM 通过 `Message` 类支持只将消息投递给在线用户：

- `deliverOnlineOnly`：设置消息是否只投递给在线用户。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

要将消息只投递给在线用户，你需要在发送消息时将 `Message#deliverOnlineOnly` 设置为 `true`。

下面以发送文本消息为例进行说明：

```javascript
// 发送文本消息。
function sendTextMessage() {
  let option = {
    // 消息类型。
    type: "txt",
    // 消息内容。
    msg: "message content",
    // 消息接收方：单聊为对方用户 ID，群聊为群组 ID。
    to: "username",
    // 会话类型：单聊和群聊分别为 `singleChat` 和 `groupChat`，默认为单聊。
    chatType: "singleChat",
    // 消息是否只投递在线用户。（默认）`false`：不论用户是否在线均投递；`true`：只投递给在线用户。若用户离线，消息投递失败。
    deliverOnlineOnly: "true",
  };
  // 创建文本消息。
  let msg = WebIM.message.create(option);
  // 调用 `send` 方法发送该文本消息。
    conn.send(msg).then((res)=>{
      console.log("Send message success",res);
    }).catch((e)=>{
      console.log("Send message fail",e);
    });
}
```
