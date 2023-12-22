# 删除会话

<Toc />

删除好友或退出群组后，SDK 不会自动删除对应的单聊或群聊会话。你可以调用相应的接口从服务器删除单个会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器删除单个会话及其历史消息，主要方法如下：

`deleteConversation`：单向删除服务端的单个会话及其历史消息。

## 实现方法

### 单向删除服务器端会话及其对应的消息

你可以调用 `deleteConversation` 方法删除服务器端会话及其对应的消息。会话和消息删除后，当前用户无法从服务器获取该会话和消息，其他用户不受影响。

```javascript
let options = {
  // 会话 ID：单聊为对方的用户 ID，群聊为群组 ID。
  channel: "channel",
  // 会话类型：（默认） `singleChat`：单聊；`groupChat`：群聊。
  chatType: "singleChat",
  // 删除会话时是否同时删除服务端漫游消息。
  deleteRoam: true,
};
WebIM.conn
  .deleteConversation(options)
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    // 删除失败。
  });
```
