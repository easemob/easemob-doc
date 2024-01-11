# 删除消息

<Toc />

本文介绍用户如何单向删除服务端的历史消息。

## 技术原理

利用环信即时通讯 IM SDK 可从服务器单向删除历史消息，主要方法如下：

- `removeHistoryMessages`：单向删除服务端的历史消息。

## 前提条件

开始前，请确保已完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。

## 实现方法

### 单向删除服务端的历史消息

你可以调用 `removeHistoryMessages` 方法按照时间或消息 ID 单向删除服务端的历史消息。每次最多可删除 20 条消息。消息删除后，该账号无法从服务端拉取到该消息。其他用户不受该操作影响。

多端多设备登录时，删除成功后会触发 `onMultiDeviceEvent#deleteRoaming` 回调。

:::tip
若使用该功能，需将 SDK 升级至 V4.1.2 或以上版本并联系商务开通。
:::

示例代码如下：

```javascript
// 按时间删除消息
connection.removeHistoryMessages({targetId: 'userId', chatType: 'singleChat', beforeTimeStamp: Date.now()})

// 按消息 ID 删除消息
connection.removeHistoryMessages({targetId: 'userId', chatType: 'singleChat', messageIds: ['messageId']})
```


