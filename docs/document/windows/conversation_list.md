# 会话列表

<Toc />

对于单聊、群组聊天和聊天室会话，用户发消息时 SDK 会自动创建会话并将会话添加至用户的会话列表。

环信服务器和本地均存储会话，你可以获取会话列表。**服务器默认存储 100 条会话，若提升该上限，需联系环信商务。**如果你的会话条数超过了上限，新会话会覆盖之前的不活跃会话。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器和本地获取会话列表，主要方法如下：

- `IChatManager#GetConversationsFromServerWithCursor`：从服务器获取会话列表。
- `IChatManager#LoadAllConversations`：获取本地所有会话。

## 实现方法

### 从服务器分页获取会话列表

你可以调用 `GetConversationsFromServerWithCursor` 方法从服务端分页获取会话列表，包含单聊和群组聊天会话，不包含聊天室会话。通过设置该方法中的 `pinOnly` 参数确定是否只获取置顶会话列表：

- 若 `pinOnly` 为 `false`，获取包括置顶和未置顶会话的列表。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 `0`）以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。
- 若为 `true` 仅获取置顶会话列表，最多可拉取 50 个置顶会话。SDK 按照会话置顶时间的倒序返回。

:::tip
1. 若使用该方法，需将 SDK 升级至 1.2.0 或以上版本。
2. 建议你在首次下载、卸载后重装应用等本地数据库无数据情况下拉取服务端会话列表。其他情况下，调用 `LoadAllConversations` 方法获取本地所有会话即可。
3. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

```csharp
// limit: 每页返回的会话数。取值范围为 [1,50]。
// cursor: 开始获取数据的游标位置。若获取数据时传 `null` 或者空字符串（""），SDK 从最新活跃的会话开始查询。
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

若不支持 `GetConversationsFromServerWithCursor` 方法，你可以调用 `GetConversationsFromServerWithPage` 方法从服务端分页获取会话列表。利用该接口，你总共可获取服务器最近 7 天内存储的 100 个会话。若提升这两个上限，需联系环信商务。

若使用该功能，需将 SDK 升级至 V1.1.0 或以上版本。

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

### 获取本地所有会话

你可以调用 `LoadAllConversations` 方法根据会话 ID 和会话类型获取本地所有会话。SDK 从内存中获取会话，若未从本地数据库中加载过，会先从数据库加载到内存中。获取会话后，SDK 按照会话活跃时间（最新一条消息的时间戳）的倒序返回会话，置顶会话在前，非置顶会话在后，会话列表为 `List<Conversation>` 结构。

本地会话列表包含单聊和群组聊天会话，至于是否包含聊天室会话，取决于在 SDK 初始化时 `Options#DeleteMessagesAsExitRoom` 参数的设置。若设置为 `true`，即离开聊天室时删除该聊天室的所有本地消息，则本地会话列表中不包含聊天室会话。若设置为 `false`，即保留该聊天室的所有本地消息，则本地会话列表中包含聊天室会话。

若在初始化时，将 `Options#EnableEmptyConversation` 设置为 `true` 允许返回空会话，则会话列表中会包含空会话，否则不包含。

示例代码如下：

```csharp
List<Conversation>list = SDKClient.Instance.ChatManager.LoadAllConversations();
```