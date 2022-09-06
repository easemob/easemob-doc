# 消息管理–从服务器获取消息

[[toc]]

环信即时通讯 IM SDK 在消息服务器上存储历史消息。当聊天用户从其他设备登录或加入群组后，您可以从服务器检索历史消息，以便用户也可以在新设备上浏览这些消息。

本文介绍如何实现用户从消息服务器获取会话和消息。

## 技术原理

利用环信即时通讯 IM SDK 可从服务器获取会话和历史消息。

- `getSessionList` 获取服务器上保存的会话列表；
- `getConversationList` 获取会话列表以及会话中的最新一条消息；
- `fetchHistoryMessages` 获取服务器上保存的指定会话中的消息；
- `getHistoryMessages` 按服务器接收消息的时间顺序获取服务器上保存的指定会话中的消息。

## 前提条件

开始前，请确保已完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。

## 实现方法

### 从服务器获取会话列表

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。用户可通过调用 `getSessionList` 或  `getConversationList` 方法查询会话列表。

`getConversationList` 可从服务器获取会话列表及每个会话中的最新一条消息，为新接口，推荐使用。

:::notice
登录用户的 ID 大小写混用会导致拉取会话列表时提示会话列表为空，因此避免大小写混用。
:::

```javascript
WebIM.conn.getSessionList().then((res) => {
    console.log(res)
    /**
    返回参数说明。
    channel_infos：所有会话。
    channel_id：会话 ID。
    meta：最新一条消息。
    unread_num：当前会话的未读消息数。
    */
})
```

```javascript
WebIM.conn.getConversationList().then((res) => {
    console.log(res)
    /**
    返回参数说明。
    channel_infos：所有会话。
    channel_id：会话 ID。
    lastMessage：最新一条消息。
    unread_num：当前会话的未读消息数。
    */
})
```

### 从服务器获取指定会话的历史消息

该功能需联系商务开通，开通后，用户默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息），如需调整会话数量或时间限制请联系环信商务经理（您可以在环信通讯云管理后台首页，扫描二维码联系您的商务经理）。

你可以调用 `fetchHistoryMessages` 或 `getHistoryMessages` 方法从服务器获取指定会话的消息。

`getHistoryMessages` 可按消息创建时间顺序获取服务器上保存的指定会话中的消息，为新接口，推荐使用。

```javascript
/**
 * 获取指定会话的历史消息。
 * @param {Object} options
 * @param {String} options.queue   - 对方用户 ID（用户 ID 只能包含小写字母）、群组 ID 或聊天室 ID。
 * @param {Number} options.count   - 每次期望获取的消息条数。
 * @param {Boolean} options.isGroup - 是否是群聊：`true`：群聊；（默认）`false`: 单聊或聊天室。
 * @param {String} options.start - （可选）起始位置的消息 ID，默认从最新一条开始。
 * @param {Boolean} options.format - （可选）是否格式化返回格式, 默认为 `false` （4.0 新语法建议设置为 `true`）。
 */
var options = {
    queue: "test1", //需特别注意：如果 queue 属性值为大小写字母混合输入或全部大写会导致拉取漫游为空数组，因此需将属性值转换为全部小写。
    isGroup: false,
    format: true,
    count: 10
}
WebIM.conn.fetchHistoryMessages(options).then((res)=>{
    // 成功获取的历史消息。
    console.log(res) 
}).catch((e)=>{
    // 拉取失败。
})
```

:::notice
如需重置拉取历史消息接口的游标，可以通过：“WebIM.conn.mr_cache = []” 方法重置 
:::

```javascript
/**
 * 按服务器接收消息的时间顺序获取会话的历史消息。
 * @param {Object} options
 * @param {String} options.targetId   - 对方的用户 ID 或者群组 ID 或聊天室 ID。
 * @param {Number} options.pageSize  - （可选）每页期望获取的消息条数。取值范围为 [1,50]，默认值为 20。
 * @param {Number} options.cursor   - （可选）查询的起始位置。若该参数设置为 `-1`、`null` 或空字符串，从最新消息开始。
 * @param {Boolean} options.chatType - （可选）会话类型（SDK V4.0)：（默认） `singleChat`：单聊；`groupChat`：群聊；`chatRoom`：聊天室聊天。
 * @param {String} options.searchDirection - 消息搜索方向：（默认）`up`：按服务器收到消息的时间的逆序获取；`down`：按服务器收到消息的时间的正序获取。
 */
var options = {
    targetId:'user1',
    pageSize: 20,
    cursor: -1,
    chatType:'groupChat',
    searchDirection: 'up',
}
WebIM.conn.getHistoryMessages(options).then((res)=>{
    // 成功获取的历史消息。
    console.log(res) 
}).catch((e)=>{
    // 获取失败。
})
```