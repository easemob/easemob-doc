# 管理服务端的会话和消息

<Toc />

环信即时通讯 IM SDK 在消息服务器上存储历史消息。当聊天用户从其他设备登录或加入群组后，你可以从服务器检索历史消息，以便用户也可以在新设备上浏览这些消息。

本文介绍如何实现用户从消息服务器获取会话和消息。

## 技术原理

利用环信即时通讯 IM SDK 可从服务器获取会话和历史消息。

- `getConversationlist` 获取服务器上保存的会话列表；
- `getHistoryMessages` 按服务器接收消息的时间顺序获取服务器上保存的指定会话中的消息；
- `removeHistoryMessages` 单向删除服务端的历史消息；
- `deleteConversation` 删除服务器端会话及其对应的消息。

## 前提条件

开始前，请确保已完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。

## 实现方法

### 从服务器获取会话列表

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。用户可通过调用 `getConversationlist` 方法从服务器获取会话列表及每个会话中的最新一条消息。


:::notice
登录用户的 ID 大小写混用会导致拉取会话列表时提示会话列表为空，因此避免大小写混用。
:::

```javascript
WebIM.conn.getConversationlist().then((res) => {
    console.log(res)
    /**
    * 返回参数说明。
    * channel_infos：所有会话。
    * channel_id：会话 ID。
    * lastMessage：最新一条消息。
    * unread_num：当前会话的未读消息数。
    */
})
```

### 从服务器获取指定会话的历史消息

该功能需联系商务开通，开通后，用户默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量或时间限制请联系环信商务经理（您可以在环信通讯云管理后台首页，扫描二维码联系您的商务经理）。

你可以调用 `getHistoryMessages` 方法从服务器获取指定会话的消息。

`getHistoryMessages` 可按消息创建时间顺序获取服务器上保存的指定会话中的消息。

```javascript
/**
 * 按服务器接收消息的时间顺序获取会话的历史消息。
 * @param {Object} options
 * @param {String} options.targetId ：对方的用户 ID 或者群组 ID 或聊天室 ID。
 * @param {Number} options.pageSize：（可选）每页期望获取的消息条数。取值范围为 [1,50]，默认值为 20。
 * @param {Number} options.cursor：（可选）查询的起始位置。若该参数设置为 `-1`、`null` 或空字符串，从最新消息开始。
 * @param {Boolean} options.chatType ：（可选）会话类型（SDK V4.0)：（默认） `singleChat`：单聊；`groupChat`：群聊；`chatRoom`：聊天室聊天。
 * @param {String} options.searchDirection： 消息搜索方向：（默认）`up`：按服务器收到消息的时间的逆序获取；`down`：按服务器收到消息的时间的正序获取。
 */
let options = {
  targetId: "user1",
  pageSize: 20,
  cursor: -1,
  chatType: "groupChat",
  searchDirection: "up",
};
WebIM.conn
  .getHistoryMessages(options)
  .then((res) => {
    // 成功获取历史消息。
    console.log(res);
  })
  .catch((e) => {
    // 获取失败。
  });
```

### 单向删除服务端的历史消息

你可以调用 `removeHistoryMessages` 方法按照时间或消息 ID 单向删除服务端的历史消息。每次最多可删除 50 条消息。消息删除后，该账号无法从服务端拉取到该消息。其他用户不受该操作影响。多端多设备登录时，删除成功后会触发 `onMultiDeviceEvent#deleteRoaming` 回调。

示例代码如下：

```javascript
// 按时间删除消息
connection.removeHistoryMessages({targetId: 'userId', chatType: 'singleChat', beforeTimeStamp: Date.now()})

// 按消息 ID 删除消息
connection.removeHistoryMessages({targetId: 'userId', chatType: 'singleChat', messageIds: ['messageId']})
```

### 删除服务器端会话及其对应的消息

你可以调用 `deleteConversation` 方法删除服务器端会话及其对应的消息。

```javascript
/**
 * 删除服务器端会话及其对应的消息。
 * @param {Object} options
 * @param {String} options.channel：会话 ID：对方的用户 ID 或群组 ID。
 * @param {String} options.chatType：`singleChat`：单聊；`groupChat`：群聊。
 * @param {Boolean} options.deleteRoam：删除会话时是否同时删除服务端漫游消息。
 */

let options = {
  channel: "channel",
  chatType: "singleChat",
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
