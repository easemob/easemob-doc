# 管理服务端的会话和消息

<Toc />

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。本文介绍如何实现用户从消息服务器获取会话和消息。


## 技术原理

利用环信即时通讯 IM SDK 可从服务器获取会话和历史消息。

- `getServerConversations` 分页获取会话列表以及会话中的最新一条消息；
- `getServerPinnedConversations` 获取服务端的置顶会话列表；
- `pinConversation` 设置是否置顶会话；
- `getHistoryMessages` 按服务器接收消息的时间顺序获取服务器上保存的指定会话中的消息；
- `removeHistoryMessages` 单向删除服务端的历史消息；
- `deleteConversation` 删除服务器端会话及其对应的消息。

## 前提条件

开始前，请确保已完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。

## 实现方法

### 从服务器分页获取会话列表

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。

你可以调用 `getServerConversations` 方法从服务端分页获取会话列表，每个会话包含最新一条历史消息。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表。若会话中没有消息，则 SDK 按照会话创建时间的倒序返回会话列表。

服务器默认存储 100 条会话。若提升该上限，需联系环信商务，最多能增加至 500 条。

:::notice
1. 若使用该功能，需将 SDK 升级至 4.1.7 或以上版本。 
2. 登录用户的 ID 大小写混用会导致拉取会话列表时提示会话列表为空，因此建议用户 ID 使用小写字母。
3. 服务端会话列表的更新存在延时，建议你仅在登录时调用该方法。
4. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

示例代码如下：

```javascript
// pageSize: 每页期望获取的会话数量。取值范围为 [1,50]，默认为 `20`。
// cursor：开始获取数据的游标位置。若传空字符串（''），SDK从最新活跃的会话开始获取。
connection.getServerConversations({pageSize:50, cursor: ''}).then((res)=>{
    console.log(res)
})
```
该方法的返回数据包含 `conversations` 和 `cursor` 参数：

- conversations: 会话列表。`conversations` 为 `ConversationItem[]` 类型，`ConversationItem` 包含如下属性：

| 属性名称 | 描述 |
| :--------- | :----- |
| `conversationId`  | 会话 ID。 |
| `conversationType`| 会话类型。|
| `isPinned` | 是否置顶：<br/> - `true`：置顶；<br/> - `false`：不置顶。 |
| `pinnedTime`| 会话置顶的 UNIX 时间戳，单位为毫秒。未置顶时值为 `0` |
| `lastMessage` | 最新一条消息概况。 | 
| `unReadCount` | 未读消息数。 |  

- cursor: 下次查询数据的游标位置。若 SDK 返回的数据条数小于请求中设置的数目，`cursor` 的值为空字符串（''），表示当前为最后一页数据。否则，SDK 返回具体的游标位置，指定开始获取数据的位置。

### 获取服务端的置顶会话列表

你可以调用 `getServerPinnedConversations` 方法从服务端分页获取置顶会话列表。SDK 按照会话置顶时间的倒序返回。 

你最多可以拉取 50 个置顶会话。

:::notice
若使用该功能，需将 SDK 升级至 4.1.7 或以上版本。
:::

示例代码如下，返回数据类型参见getServerConversations： 

```javascript
connection.getServerPinnedConversations({pageSize:50, cursor: ''})
```

该方法的返回数据与[获取服务端的会话列表](#从服务器分页获取会话列表)相同。

### 置顶会话

会话置顶指将单聊或群聊会话固定在会话列表的顶部，方便用户查找。例如，将重点会话置顶，可快速定位会话。

置顶状态会存储在服务器上，多设备登录情况下，更新置顶状态会同步到其他登录设备。你最多可以置顶 50 个会话。

你可以调用 `pinConversation` 方法设置是否置顶会话。多设备登录情况下，会话置顶或取消置顶后，其他登录设备会收到 `onMultiDeviceEvent` 事件，事件名分别为 `pinnedConversation` 和 `unpinnedConversation` 事件。

:::notice
若使用该功能，需将 SDK 升级至 4.1.7 或以上版本。
:::

示例代码如下： 

```javascript
connection.pinConversation({conversationId:'conversationId', conversationType: 'singleChat', isPinned: true})
```

### 从服务器获取指定会话的历史消息

你可以调用 `getHistoryMessages` 方法从服务器获取指定会话的消息（消息漫游）。你可以指定消息查询方向，即明确按时间顺序或逆序获取。为确保数据可靠，我们建议你每次最多获取 50 条消息，可多次获取。拉取后，SDK 会自动将消息更新到本地数据库。

```javascript
let options = {
  // 对方的用户 ID 或者群组 ID 或聊天室 ID。
  targetId: "user1",
  // 每页期望获取的消息条数。取值范围为 [1,50]，默认值为 20。
  pageSize: 20,
  // 查询的起始消息 ID。若该参数设置为 `-1`、`null` 或空字符串，从最新消息开始。
  cursor: -1,
  // 会话类型：（默认） `singleChat`：单聊；`groupChat`：群聊。
  chatType: "groupChat",
  // 消息搜索方向：（默认）`up`：按服务器收到消息的时间的逆序获取；`down`：按服务器收到消息的时间的正序获取。
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

:::tip
若使用该功能，需将 SDK 升级至 V4.1.2 或以上版本。
:::

示例代码如下：

```javascript
// 按时间删除消息
connection.removeHistoryMessages({targetId: 'userId', chatType: 'singleChat', beforeTimeStamp: Date.now()})

// 按消息 ID 删除消息
connection.removeHistoryMessages({targetId: 'userId', chatType: 'singleChat', messageIds: ['messageId']})
```

### 删除服务器端会话及其对应的消息

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
