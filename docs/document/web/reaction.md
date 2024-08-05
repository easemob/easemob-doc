# 消息表情回复 Reaction

<Toc />

环信即时通讯 IM 提供消息表情回复（下文统称 “Reaction”）功能。用户可以在单聊和群聊中对消息添加、删除表情。表情可以直观地表达情绪，利用 Reaction 可以提升用户的使用体验。同时在群组中，利用 Reaction 可以发起投票，根据不同表情的追加数量确认投票。

:::notice
目前 Reaction 仅适用于单聊和群组。聊天室暂不支持 Reaction 功能。
:::

## 技术原理

环信即时通讯 IM SDK 支持你通过调用 API 在项目中实现如下功能：

- `addReaction` 在消息上添加 Reaction；
- `deleteReaction` 删除消息的 Reaction；
- `getReactionlist` 获取消息的 Reaction 列表；
- `getReactionDetail` 获取 Reaction 详情；
- `getHistoryMessages ` 获取漫游消息中的 Reaction。

添加 Reaction：

![](/images/web/web_chat_reaction_add_reaction.png)

查看 Reaction：

![](/images/web/web_group_chat_reaction_detail_another_version.png)

## 前提条件

开始前，请确保满足以下条件：

1. 完成 `4.0.5 及以上版本` SDK 初始化，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
3. 已联系商务开通 Reaction 功能。

## 实现方法

### 在消息上添加 Reaction

调用 `addReaction` 在消息上添加 Reaction。对于单聊会话，对端用户会收到 `onReactionChange` 事件，而群聊会话中，除操作者之外的其他群组成员均会收到该事件。该事件中的信息包括会话 ID、消息 ID，该消息的 Reaction 列表和 Reaction 操作列表（列明添加者的用户 ID、添加的 Reaction 的 ID 以及明确该操作为添加操作）。

对于同一条 Reaction，一个用户只能添加一次，重复添加会报错误 1101。

示例代码如下：

```javascript
// 添加 Reaction。
conn.addReaction({ messageId: "messageId", reaction: "reaction" });

// 监听 Reaction 更新。
conn.addEventHandler("REACTION", {
  onReactionChange: (reactionMsg) => {
    console.log(reactionMsg);
  },
});
```

### 删除消息的 Reaction

调用 `deleteReaction` 删除消息的 Reaction。对于单聊会话，对端用户会收到 `onReactionChange` 事件，而群聊会话中，除操作者之外的其他群组成员均会收到该事件。该事件中的信息包括会话 ID、消息 ID，该消息的 Reaction 列表和 Reaction 操作列表（列明添加者的用户 ID、添加的 Reaction 的 ID 以及明确该操作为删除操作）。

示例代码如下：

```javascript
// 删除 Reaction。
conn.deleteReaction({ messageId: "messageId", reaction: "reaction" });

// 监听 Reaction 更新。
conn.addEventHandler("REACTION", {
  onReactionChange: (reactionMsg) => {
    console.log(reactionMsg);
  },
});
```

### 获取消息的 Reaction 列表

调用 `getReactionlist` 方法可以从服务器获取 Reaction 概览列表，列表内容包含 Reaction 内容，添加或移除 Reaction 的用户数量，以及添加或移除 Reaction 的前三个用户的用户 ID。示例代码如下：

```javascript
conn
  .getReactionlist({ chatType: "singleChat", messageId: "messageId" })
  .then((res) => {
    console.log(res);
  });
```

### 获取 Reaction 详情

调用 `getReactionDetail` 方法可以从服务器获取 Reaction 详情，包括 Reaction 内容，添加或移除 Reaction 的用户数量以及添加或移除 Reaction 的全部用户列表。示例代码如下：

```javascript
conn
  .getReactionDetail({
    messageId: "messageId",
    reaction: "reaction",
    cursor: null,
    pageSize: 20,
  })
  .then((res) => {
    console.log(res);
  });
```

### 获取漫游消息中的 Reaction

调用 `getHistoryMessages` 可以获取漫游消息，如果一条消息已添加 Reaction，消息体中会包含 Reaction 概览。

示例代码如下：

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
