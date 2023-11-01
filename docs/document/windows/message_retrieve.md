# 从服务器获取会话和消息

<Toc />

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。本文介绍用户如何从消息服务器获取和删除会话和消息。

:::tip
本文介绍的功能均为增值服务，需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。
:::

## 实现原理

使用环信即时通讯 IM SDK 可以通过 `IChatManager` 类的以下方法从服务器获取历史消息：

- `GetConversationsFromServerWithPage` 分页获取服务器保存的会话列表；
- `GetConversationsFromServerWithCursor` 分页获取服务器保存的置顶会话列表；
- `PinConversation` 置顶会话。
- `FetchHistoryMessagesFromServer` 获取服务器保存的指定会话中的消息;
- `RemoveMessagesFromServer` 单向删除服务端的历史消息；
- `DeleteConversationFromServer` 删除服务端的会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取会话

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。

你可以调用 `GetConversationsFromServerWithCursor` 方法从服务端分页获取会话列表。通过设置该方法中的 `pinOnly` 参数确定是否只获取置顶会话列表：

- 若 `pinOnly` 为 `false`，获取包括置顶和未置顶会话的列表。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表。若会话中没有消息，则 SDK 按照会话创建时间的倒序返回会话列表。服务器默认存储 100 条会话，可存储 7 天。若提升这两个上限，需联系环信商务。
- 若为 `true` 仅获取置顶会话列表，最多可拉取 50 个置顶会话。SDK 按照会话置顶时间的倒序返回。

:::notice
1. 若使用该方法，需将 SDK 升级至 1.2.0。
2. 建议你在首次下载、卸载后重装应用等本地数据库无数据情况下拉取服务端会话列表。其他情况下，调用 `LoadAllConversations` 方法获取本地所有会话即可。
3. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

```csharp
// limit: 每页返回的会话数。取值范围为 [1,50]。
// cursor：开始获取数据的游标位置。若传空字符串（''），SDK 则从最新活跃的会话开始获取。
int limit = 10;
string cursor = "";
bool pinOnly = false; // `false`：获取所有会话；`true`仅获取置顶会话列表。
SDKClient.Instance.ChatManager.GetConversationsFromServerWithCursor(pinOnly, cursor, limit, new ValueCallBack<CursorResult<Conversation>>(
   onSuccess: (result) =>
   {
       // 遍历获取到的会话列表
       foreach (var conv in result.Data)
       {

       }
       // 下一次请求的 cursor
       string nextCursor = result.Cursor;
   },
   onError: (code, desc) =>
   {

   }
));

```

此外，你可以调用 `GetConversationsFromServerWithPage` 方法从服务端分页获取会话列表，每个会话包含最新一条历史消息。

若使用该功能，需将 SDK 升级至 V1.1.0。

```csharp
SDKClient.Instance.ChatManager.GetConversationsFromServerWithPage(pageNum, pageSize, new ValueCallBack<List<Conversation>>(
    //获取会话成功后的处理逻辑。
    //list 为 List<Conversation> 类型。
    onSuccess: (list) =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 置顶会话

会话置顶指将单聊或群聊会话固定在会话列表的顶部，方便用户查找。例如，将重点会话置顶，可快速定位会话。

置顶状态会存储在服务器上，多设备登录情况下，更新置顶状态会同步到其他登录设备。你最多可以置顶 50 个会话。

你可以调用 `PinConversation` 方法设置是否置顶会话。多设备登录情况下，会话置顶或取消置顶后，其他登录设备分别会收到 `CONVERSATION_PINNED` 和 `CONVERSATION_UNPINNED` 事件。

:::notice
若使用该功能，需将 SDK 升级至 1.2.0。
:::

示例代码如下：

```csharp
SDKClient.Instance.ChatManager.PinConversation(convId, isPinned, new CallBack(
    onSuccess: () =>
    {

    },
    onError: (code, desc) =>
    {

    }
));
```

你可以通过 `EMConversation` 对象的 `isPinned` 字段检查会话是否为置顶状态，或者调用 `getPinnedTime` 方法获取会话置顶时间。


### 分页获取指定会话的历史消息

你可以调用 `FetchHistoryMessagesFromServer` 方法从服务器分页获取指定会话的历史消息，实现消息漫游。该功能需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。

为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

```csharp
SDKClient.Instance.ChatManager.FetchHistoryMessagesFromServer(conversationId, type, startId, pageSize, new ValueCallBack<CursorResult<Message>>(
    // 获取历史消息成功。
    // result 为 CursorResult<Message> 类型。
    onSuccess: (result) => {
    },

    // 获取历史消息失败。
    onError:(code, desc) => {
    }
));
```

### 单向删除服务端的历史消息

你可以调用 `RemoveMessagesFromServer` 方法单向删除服务端的历史消息，每次最多可删除 50 条消息。消息删除后，该用户无法从服务端拉取到该消息。其他用户不受该操作影响。已删除的消息自动从设备本地移除。

:::tip
若使用该功能，需将 SDK 升级至 V1.1.0 或以上版本并联系商务。
:::

```csharp
// 按时间删除历史消息
SDKClient.Instance.ChatManager.RemoveMessagesFromServer(convId, ctype, time, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
// 按消息 ID 删除历史消息
SDKClient.Instance.ChatManager.RemoveMessagesFromServer(convId, ctype, msgList, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 单向删除服务端会话及其历史消息

你可以调用 `DeleteConversationFromServer` 方法删除服务器端会话和历史消息。会话和消息删除后，当前用户无法从服务器获取该会话和消息，对本地的会话无影响，但会删除本地消息，而其他用户不受影响。

```csharp
SDKClient.Instance.ChatManager.DeleteConversationFromServer(conversationId, conversationType, isDeleteServerMessages, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```