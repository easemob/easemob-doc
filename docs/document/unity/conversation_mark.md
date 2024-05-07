# 会话标记

<Toc />

某些情况下，你可能需要对会话添加标记，例如会话标星或将会话标为已读或未读。即时通讯云 IM 支持对单聊和群聊会话添加标记，最大支持 20 个标记，所以一个会话最多可添加 20 个标记。

**如果要使用会话标记功能，你需要确保开通了[会话列表服务](conversation_list.html#从服务器分页获取会话列表)并将 SDK 版本升级至 1.3.0 或以上版本。**

你需要自行维护会话标记与具体业务含义（比如 `MarkType0` 为重要会话）之间的映射关系。例如：

```csharp
Dictionary<MarkType, string> dict = new Dictionary<string, string>();
dict.Add(MarkType0, "important");
dict.Add(MarkType1, "normal");
dict.Add(MarkType2, "unimportant");
dict.Add(MarkType3, "boys");
dict.Add(MarkType4, "girls");
//……
```

## 技术原理

环信即时通讯 IM 支持会话标记功能，主要方法如下：

- `ChatManager#MarkConversations`：标记或取消会话。
- `ChatManager#GetConversationsFromServerWithCursor`：根据会话标记从服务器分页查询会话列表。
- 根据会话标记从本地查询会话列表：调用 `ChatManager#LoadAllConversations` 方法获取本地所有会话后自己进行会话过滤。
- `Conversation#Marks`：获取本地单个会话的所有标记。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- **[开通服务端会话列表功能](conversation_list.html#从服务器分页获取会话列表)**。

## 实现方法

### 标记会话

你可以调用 `MarkConversations` 方法标记会话，即将参数 `isMark` 设置为 `true`。每次最多可为 20 个会话添加标记。调用该方法会同时为本地和服务器端的会话添加标记。

添加会话标记后，若调用 `GetConversationsFromServerWithCursor` 接口从服务器分页获取会话列表，返回的会话对象中包含会话标记，你需要通过 `Conversation#Marks` 方法获取。若你已经达到了服务端会话列表长度限制（默认 100 个会话），服务端会根据会话的活跃度（最新一条消息的时间戳）删除不活跃会话，这些会话的会话标记也随之删除。

:::tip
对会话添加标记，例如会话标星，并不影响会话的其他逻辑，例如会话的未读消息数。
:::

```csharp
List<string> list = new List<string>();
list.Add("huanhuan");
bool isMarked = true;
SDKClient.Instance.ChatManager.MarkConversations(list, isMarked, (MarkType)mark, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 取消标记会话

同样，你也可以调用 `MarkConversations` 方法删除会话标记，即将 `isMark` 参数设置为 `false`。每次最多可移除 20 个会话的标记。

调用该方法会同时移除本地和服务器端会话的标记。

```csharp
List<string> list = new List<string>();
list.Add("huanhuan");
bool isMarked = false;
SDKClient.Instance.ChatManager.MarkConversations(list, isMarked, (MarkType)mark, new CallBack(
    onSuccess: () =>
    {
    },
    onError: (code, desc) =>
    {
    }
));
```

### 根据会话标记从服务器分页查询会话列表

你可以调用 `GetConversationsFromServerWithCursor` 方法根据会话标记从服务器分页获取会话列表。SDK 会按会话标记的时间的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 0）、会话标记以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

```csharp
SDKClient.Instance.ChatManager.GetConversationsFromServerWithCursor((MarkType)mark, cursor, limit, new ValueCallBack<CursorResult<Conversation>>(
   onSuccess: (result) =>
   {
       foreach (var conv in result.Data)
       {
       	//遍历 result.Data 中的会话
       }
   },
   onError: (code, desc) =>
   {
   }
  ));
```

### 根据会话标记从本地查询会话列表

对于本地会话，你可以调用 `LoadAllConversations` 方法获取本地所有会话后自己进行会话过滤。下面以查询标记了 `EMConversation.EMMarkType.MARK_0` 的所有本地会话为例。

```csharp
//最终的查询结果全部放入 result 中。
List<Conversation> result = new List<Conversation>();
List<Conversation> localConversations = SDKClient.Instance.ChatManager.LoadAllConversations();
foreach(var conv in localConversations)
{
    List<MarkType> Marks = conv.Marks();
    foreach(var mark in Marks)
    {
        if (MarkType.MarkType0 == mark)
        {
            result.Add(conv);
        }
    }
}
```

### 获取本地单个会话的所有标记

你可以调用 `Conversation#Marks` 方法获取本地单个会话的所有标记，示例代码如下：

```csharp
Conversation conv = SDKClient.Instance.ChatManager.GetConversation("conversationId", conversationType);
List<MarkType> Marks = conv.Marks();
```








