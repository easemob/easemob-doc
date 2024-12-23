# 删除消息

<Toc />

本文介绍用户如何单向清空本地和服务端的聊天记录和单向删除服务端的历史消息。

## 技术原理

利用环信即时通讯 IM SDK 可从服务器单向删除历史消息，主要方法如下：

- `removeHistoryMessages`：单向删除服务端的历史消息。
- `deleteAllMessagesAndConversations`：单向清空服务端的聊天记录，本地若有会话和消息，也会被清除。

## 前提条件

开始前，请确保已完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。

## 实现方法

### 清空聊天记录

你可以调用 `deleteAllMessagesAndConversations` 方法单向清空服务端的当前用户的聊天记录，包括单聊、群组聊天和聊天室的消息和会话。若你清空了聊天记录，你无法从服务端拉取到会话和消息，而其他用户不受该操作影响。

若存在本地会话和消息，也会被清除。

:::tip
若使用该功能，需将 SDK 升级至 V4.5.0 或以上版本。
:::

```javascript
conn.deleteAllMessagesAndConversations().then(() => {
  // 清除全部会话和消息记录成功
})
```

### 单向删除服务端的历史消息

你可以调用 `removeHistoryMessages` 方法按照消息时间或消息 ID 单向删除服务端的历史消息。删除后，该用户无法从服务端拉取到该消息，不过，与该用户的单聊、群聊和聊天室会话中的其它用户的服务器消息不受影响，可以漫游获取。

每次最多可删除 20 条消息。多端多设备登录时，删除成功后会触发 `onMultiDeviceEvent#deleteRoaming` 回调。

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


