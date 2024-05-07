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

- `IEMChatManager#getConversationsFromServerWithCursor:pageSize:completion`：从服务器获取会话列表。
- `IEMChatManager#filterConversationsFromDB`：获取本地所有会话或筛选要获取的会话。
- `IEMChatManager#getAllConversations:`：一次性获取本地所有会话。
- `cleanConversationsMemoryCache`：清除内存中的会话。

## 实现方法

### 从服务器分页获取会话列表

你可以调用 `IEMChatManager#getConversationsFromServerWithCursor:pageSize:completion` 方法从服务端分页获取会话列表，包含单聊和群组聊天会话，不包含聊天室会话。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 `0`）以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

:::tip
1. **若使用该功能，需在环信控制台开通该功能，并将 SDK 升级至 4.0.3。只有开通该功能，你才能使用置顶会话和会话标记功能。** 
2. 建议你在首次下载、卸载后重装应用等本地数据库无数据情况下拉取服务端会话列表。其他情况下，调用 `filterConversationsFromDB`、`getAllConversations:` 或 `getAllConversations` 方法获取本地所有会话即可。
3. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

示例代码如下：

```objectivec
// pageSize: 每页返回的会话数。取值范围为 [1,50]。
// cursor：查询的开始位置。若传入 `nil` 或 `@""`，SDK 从最新活跃的会话开始获取。
NSString *cursor = @"";
[EMClient.sharedClient.chatManager getConversationsFromServerWithCursor:cursor pageSize:20 completion:^(EMCursorResult<EMConversation *> * _Nullable result, EMError * _Nullable error) {
}];
```

### 获取本地所有或筛选的会话

你可以调用 `IEMChatManager#filterConversationsFromDB` 方法，获取本地所有会话（`filter` 参数为 `nil`）或实现筛选器闭包根据闭包中的会话对象返回对应的 Boolean 值。

:::tip
若使用该功能，需将 SDK 升级至 4.6.0。
:::

```Swift
        EMClient.shared().chatManager?.filterConversationsFromDB(cleanMemoryCache: true, filter: { conversation in
               //case1: 判断 ext 中是否含有某个 key 然后返回 `true` or `false`
              //case2: 根据会话类型返回 Boolean 值
              //case3: 根据会话 ID 返回 Boolean 值
              //case4: 是否置顶会话
             //case5: 是否全部消息已读会话
             //case6: 会话中最后一条消息时间戳
        })
 ```

下表为初始化时设置的会话相关选项：

| 选项 | 描述    | 
 | :--------- | :----- |
 | `EMOptions#deleteMessagesOnLeaveChatroom`   | 通过该选项确定获取本地会话时是否返回聊天室会话。默认情况下，只包含单聊和群组聊天会话。<br/> - `YES`：离开聊天室时删除该聊天室的所有本地消息，则本地会话列表中不包含聊天室会话。<br/> - `NO`：离开聊天室时保留该聊天室的所有本地消息，则本地会话列表中包含聊天室会话。| 
 |`EMOptions#loadEmptyConversations` | 获取本地会话时是否包含空会话：<br/> - `YES`：返回空会话。<br/> - `NO`：不包含空会话。| 

### 一次性获取本地所有会话

- 要一次性获取本地所有会话，你可以调用 `IEMChatManager#getAllConversations:` 方法。SDK 从内存中获取会话，若未从本地数据库中加载过，会先从数据库加载到内存中。获取会话后，SDK 按照会话活跃时间（最新一条消息的时间戳）的倒序返回会话，置顶会话在前，非置顶会话在后，会话列表为 `NSArray<__kindof EMConversation*>*` 结构。

:::tip
若使用该功能，需将 SDK 升级至 4.0.3。
:::

示例代码如下：

```objectivec
NSArray <EMConversation *>*conversations = [EMClient.sharedClient.chatManager getAllConversations:YES];
```

- 你也可以调用 `IEMChatManager#getAllConversations` 方法返回 `NSArray <EMConversation *>` 结构的会话。

**两个 API 与自动加载会话之间的关系**

SDK 初始化时，你可以设置 `EMOptions#autoLoadConversations` 属性，确定用户登录成功后是否将数据库中的会话自动加载到内存。
- `true`：数据库中的所有会话会自动加载到内存。调用 `IEMChatManager#getAllConversations:` 或 `IEMChatManager#getAllConversations` 时，若内存中没有任何缓存的会话，SDK 会首先将数据库中的会话加载到内存，然后返回获取的会话。
- `false`：会话不会自动从数据库加载，只会在内存中查找。调用 `IEMChatManager#getAllConversations:` 或 `IEMChatManager#getAllConversations` 时，若 SDK 内存中没有任何缓存的会话，获取到的会话数为 0，SDK 不会将数据库中的会话加载到内存。而且，这种情况下，调用 `EMConversation#unreadMessagesCount` 方法获取到的未读消息数也为 0。这种情况下，若需要通过这三个 API 获取所有会话及未读数，需要先调用 `IEMChatManager#filterConversationsFromDB(cleanMemoryCache:filter:)` 方法将数据库中的会话加载到内存，然后遍历数组根据会话的未读消息数进行叠加计算。

:::tip
若使用自动加载会话功能，需将 SDK 升级至 4.6.0。
:::

### 清除内存中的会话

你可以调用 `cleanConversationsMemoryCache` 方法，清除本地内存中的所有会话，从而释放内存。

```Swift
EMClient.shared().chatManager?.cleanConversationsMemoryCache()
```

### 降低会话占用内存的实例

对于用户存在很多会话的场景，若在运行过程中降低会话对内存的占用，可采取以下步骤：

1. 关闭自动加载会话开关：SDK 初始化时，将 `EMOptions#autoLoadConversations` 设置为 `false`。
2. 获取会话前清空内存中的会话：调用 `filterConversationsFromDB` 获取过滤的会话时，将 `cleanMemoryCache` 参数传 `true`。
3. 监控到内存较高时（开发者自己实现）释放内存: 调用 `cleanConversationsMemoryCache` 方法清空内存中的会话，释放内存。

```Swift
//step 1：SDK 初始化时，关闭自动加载会话开关。
option.autoLoadConversations = false

//step 2：需要使用会话时，使用 filterConversationsFromDB 过滤后获取到会话，EMClient.shared().chatManager?.filterConversationsFromDB(cleanMemoryCache: true, filter: { conversation in
               //case1: 判断 ext 中是否含有某个 key 然后返回 `true` or `false`
              //case2: 根据会话类型返回 Boolean 值
              //case3: 根据会话 ID 返回 Boolean 值
              //case4: 是否置顶会话
             //case5: 是否全部消息已读会话
             //case6: 会话中最后一条消息时间戳
        })
//step 3：当监控到内存较高时（该逻辑开发者自己去实现），调用以下方法释放内存。
EMClient.shared().chatManager?.cleanConversationsMemoryCache()

```