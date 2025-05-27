# 会话置顶

<Toc />

会话置顶指将单聊或群聊会话固定在会话列表的顶部，方便用户查找。例如，将重点会话置顶，可快速定位会话。

**若使用会话置顶功能，需将 SDK 升级至 4.1.0，并[开通服务端会话列表功能](conversation_list#从服务器分页获取会话列表)。**

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- **[开通服务端会话列表功能](conversation_list#从服务器分页获取会话列表)**。

## 技术原理

环信即时通讯 IM 支持会话置顶，主要方法如下：

- `EMChatManager#pinConversation`：置顶/取消置顶会话。
- `EMChatManager#fetchPinnedConversations`：分页获取服务器保存的置顶会话列表。

## 实现方法

### 置顶/取消置顶会话

你可以调用 `pinConversation` 方法设置是否置顶会话。多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `EMMultiDevicesEvent.CONVERSATION_PINNED` 和 `EMMultiDevicesEvent.CONVERSATION_UNPINNED` 事件。

你最多可以置顶 50 个会话。

:::tip
若使用该功能，需将 SDK 升级至 4.0.3。
:::

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatManager.pinConversation(
    conversationId: conversationId,
    isPinned: true,
  );
} on EMError catch (e) {}
```

你可以通过 `EMConversation` 对象的 `isPinned` 字段检查会话是否为置顶状态，或者调用 `getPinnedTime` 方法获取会话置顶时间。

## 获取服务端的置顶会话列表

你可以调用 `fetchConversationsByOptions` 方法从服务端分页获取置顶会话列表。SDK 按照会话置顶时间的倒序返回。

:::tip
1. 你最多可以拉取 50 个置顶会话。
2. 若使用该功能，需将 SDK 升级至 V4.5.0 或以上版本。
:::

示例代码如下： 

```dart
EMCursorResult<EMConversation> result = await EMClient.getInstance.chatManager.fetchConversationsByOptions(
      options: ConversationFetchOptions.pinned(),
    )
```