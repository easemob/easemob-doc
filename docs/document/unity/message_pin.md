# 消息置顶

消息置顶指将会话中的消息固定在会话顶部，方便会话中的所有用户快速查看重要消息。

目前，**群组和聊天室**聊天支持对消息置顶和取消置顶，单聊消息不支持该功能。

**若使用该功能，你需要将 IM SDK 升级至 1.3.0 版本并联系环信商务开通。**

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持消息置顶，主要方法和类如下：

- `ChatManager#PinMessage`：置顶或取消置顶消息。
- `ChatManager#GetPinnedMessagesFromServer`：从服务端获取单个会话的置顶消息列表。
- `PinnedInfo`：消息的置顶或取消置顶详情。

## 置顶消息

你可以调用 `ChatManager#PinMessage` 方法在群组或聊天室聊天中置顶消息，即将 `isPinned` 参数设置为 `true`。消息置顶状态变化后，群组或聊天室会话中的其他成员会收到 `IChatManagerDelegate#OnMessagePinChanged` 事件。多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `IChatManagerDelegate#OnMessagePinChanged` 事件。

在群组和聊天室会话中，支持多个用户置顶同一条消息，最新的消息置顶信息会覆盖较早的信息，即 `PinnedInfo` 的置顶消息的操作者的用户 ID 和置顶时间为最新置顶操作的相关信息。

若消息在本地存储，而在服务端因过期而删除，则消息置顶失败。

对于单个会话来说，默认可置顶 20 条消息。你可以联系环信商务提升该上限，最大可调整至 100。

```csharp
bool isPinned = true;
SDKClient.Instance.ChatManager.PinMessage(msgId, isPinned, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

## 取消置顶消息

你可以调用 `ChatManager#PinMessage` 方法在群组或聊天室聊天中取消置顶消息，即将 `isPinned` 参数设置为 `false`。与置顶消息相同，取消置顶消息后，群组或聊天室会话中的其他成员会收到 `IChatManagerDelegate#OnMessagePinChanged` 事件。多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他设备分别会收到 `IChatManagerDelegate#OnMessagePinChanged` 事件。

群组或聊天室中的所有成员均可取消置顶消息，不论该消息由哪个成员置顶。取消置顶消息后，`Message#PinnedInfo` 获取到的信息中 `PinnedBy` 为空，`PinnedAt` 为`0`，该会话的置顶消息列表中也不再包含该消息。

```csharp
bool isPinned = false;
SDKClient.Instance.ChatManager.PinMessage(msgId, isPinned, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

## 获取单个会话中的置顶消息

你可以调用 `ChatManager#GetPinnedMessagesFromServer` 方法从服务端获取单个会话中的置顶消息。SDK 按照消息置顶时间的倒序返回。

:::tip
1. 若消息置顶后，消息在服务端过期或用户从服务端单向删除了该消息，当前用户拉漫游消息时拉不到该消息，但当前用户和其他用户均可以在置顶消息列表中拉取到该消息。
2. 若消息置顶后，用户撤回了该消息，则该消息从服务端移除，所有用户在从服务器拉取置顶消息列表时无法拉取到该消息。
:::

```csharp
SDKClient.Instance.ChatManager.GetPinnedMessagesFromServer(convId, new ValueCallBack<List<Message>>(
    onSuccess: (list) => {
        foreach (var it in list)
        {
            //遍历消息列表
        }
    },
    onError: (code, desc) => {
    }
));
```

## 获取单条消息的置顶详情

你可以通过 `PinnedInfo` 类获取单条消息的置顶详情。

- 若消息为置顶状态，该类返回消息置顶的时间以及操作者的用户 ID。
- 若消息为非置顶状态，则 `PinnedInfo` 中的 `PinnedBy` 为空，`PinnedAt` 为 `0`。

```csharp
PinnedInfo pinnedInfo = msg.PinnedInfo;
string operatorId = pinnedInfo.PinnedBy;
long pinTime = pinnedInfo.PinnedAt;

if (operatorId.CompareTo("") != 0 && pinTime != 0)
{
	//置顶状态
} else {
	//非置顶状态
}
```

## 监听消息置顶事件

```csharp
public class ChatManagerDelegate : IChatManagerDelegate
{
	// 实现 IChatManagerDelegate 中的其它功能
	
		public void OnMessagePinChanged(string messageId, string conversationId, bool isPinned, string operatorId, long operationTime)
    {
			if (isPinned == true) {
				// 消息置顶
			} else {
				// 消息取消置顶
			}
    }	
}

ChatManagerDelegate chatManagerDelegate = new ChatManagerDelegate();
SDKClient.Instance.ChatManager.AddChatManagerDelegate(chatManagerDelegate);

//若 chatManagerDelegate 不需要，请及时移除。
//SDKClient.Instance.ChatManager.RemoveChatManagerDelegate(chatManagerDelegate);
```        



