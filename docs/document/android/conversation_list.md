# 会话列表

<Toc />

对于单聊、群组聊天和聊天室会话，用户发消息时 SDK 会自动创建会话并将会话添加至用户的会话列表。

环信服务器和本地均存储会话，你可以获取会话列表。**服务器默认存储 100 条会话，可存储 7 天。若提升这两个上限，需联系环信商务。**

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器和本地获取会话列表，主要方法如下：

- `asyncFetchConversationsFromServer`：从服务器获取会话列表。
- `asyncFilterConversationsFromDB`：获取本地所有会话或筛选要获取的会话。
- `getAllConversationsBySort`：获取本地所有会话。

## 实现方法

### 从服务器分页获取会话列表

你可以调用 `asyncFetchConversationsFromServer` 方法从服务端分页获取会话列表，包含单聊和群组聊天会话，不包含聊天室会话。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 `0`）、会话标记以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

:::tip
1. **若使用该功能，需在环信控制台开通，并将 SDK 升级至 4.0.3。而且，只有开通该功能，你才能使用置顶会话和会话标记功能。** 
2. 建议你在首次下载、卸载后重装应用等本地数据库无数据情况下拉取服务端会话列表。其他情况下，调用 `getAllConversationsBySort` 或 `getAllConversations` 方法获取本地所有会话即可。
3. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

示例代码如下：

```java
// limit: 每页返回的会话数。取值范围为 [1,50]。
// cursor: 开始获取数据的游标位置。若获取数据时传 `null` 或者空字符串（""），SDK 从最新活跃的会话开始获取。
int limit = 10;
String cursor = "";
EMClient.getInstance().chatManager().asyncFetchConversationsFromServer(limit, cursor, new EMValueCallBack<EMCursorResult<EMConversation>>() {
    @Override
    public void onSuccess(EMCursorResult<EMConversation> result) {
        // 获取到的会话列表
        List<EMConversation> conversations = result.getData();
        // 下一次请求的 cursor
        String nextCursor = result.getCursor();
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

### 获取本地所有或筛选的会话

你可以调用 `asyncFilterConversationsFromDB` 方法，获取本地所有会话（`filter` 参数为 `null`）或筛选会话。

如果要筛选会话，你需要自己实现 `EMCustomConversationFilter` 接口中的过滤器 `filter`，根据 `filter` 方法中传递过来的会话对象 `emConversation` 自己决定是返回 `true` 还是 `false`。如果返回 `true`，这条会话会被添加到内存中，并最终在 `callback` 中返回给调用者，如果返回 `false`，这条会话会被舍弃，不会被添加到内存里，不会在`callback` 中返回给调用者。

:::tip
若使用该功能，需将 SDK 升级至 4.6.0。
:::

```java
EMClient.getInstance().chatManager().asyncFilterConversationsFromDB(new EMCustomConversationFilter() {
    @Override
    public boolean filter(EMConversation emConversation) {
        //在这里可以根据会话 emConversation 的属性决定返回 true 或false 来过滤会话。
        return true;
    }
},false, new EMValueCallBack<List<EMConversation>>() {
    @Override
    public void onSuccess(List<EMConversation> filterConversations) {
        //filterConversations 为最终过滤后的会话结果。
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

下表为初始化时设置的会话相关选项：

 | 选项 | 描述    | 
 | :--------- | :----- |
 | `com.hyphenate.chat.EMOptions#setDeleteMessagesAsExitChatRoom`   | 通过该选项确定获取本地会话时是否返回聊天室会话。默认情况下，只包含单聊和群组聊天会话。<br/> - `true`：离开聊天室时删除该聊天室的所有本地消息，则本地会话列表中不包含聊天室会话。<br/> - `false`：离开聊天室时保留该聊天室的所有本地消息，则本地会话列表中包含聊天室会话。| 
 |`EMOptions#setLoadEmptyConversations` | 获取本地会话时是否包含空会话：<br/> - `true`：返回空会话。<br/> - `false`：不包含空会话。| 

### 一次性获取本地所有会话

- 要一次性获取本地所有会话，你可以调用 `getAllConversationsBySort` 方法。SDK 首先从内存中获取会话，若会话未从本地数据库加载过，SDK 会先将数据库中的会话加载到内存。获取会话后，SDK 按照会话活跃时间（最新一条消息的时间戳）的倒序返回会话，置顶会话在前，非置顶会话在后，会话列表为 `List<EMConversation>` 结构。

:::tip
若使用该功能，需将 SDK 升级至 4.0.3。
:::

示例代码如下：

```java
List<EMConversation> conversations = EMClient.getInstance().chatManager().getAllConversationsBySort();
```

- 你也可以调用 `getAllConversations` 方法返回 `Map <String, EMConversation>` 结构的会话。

**两个 API 与自动加载会话之间的关系**

SDK 初始化时，你可以设置 `EMOptions#setAutoLoadAllConversations` 方法，确定用户自动登录成功后是否将数据库中的会话自动加载到内存。
- `true`：数据库中的所有会话会自动加载到内存。调用 `EMChatManager#getAllConversationsBySort` 或 `EMChatManager#getAllConversations` 时，若内存中没有任何缓存的会话，SDK 会首先将数据库中的会话加载到内存，然后返回获取的会话。
- `false`：会话不会自动加载，节省内存。调用 `EMChatManager#getAllConversationsBySort` 或 `EMChatManager#getAllConversations` 时，若内存中没有任何缓存的会话，获取到的会话数为 0，SDK 不会将数据库中的会话加载到内存。而且，这种情况下，调用 `EMChatManager#getUnreadMessageCount` 方法获取到的未读消息数也为 0。这种情况下，若需要通过这三个 API 获取所有会话及未读数，需要先调用 `EMChatManager#loadAllConversations` 或者 `EMChatManager#asyncFilterConversationsFromDB` 方法将数据库中的会话加载到内存。

:::tip
若使用自动加载会话功能，需将 SDK 升级至 4.6.0。
:::

### 清除内存中的会话

你可以调用 `cleanConversationsMemoryCache` 方法，清除本地内存中的所有会话，从而释放内存。

```java
EMClient.getInstance().chatManager().cleanConversationsMemoryCache();
```

### 降低会话占用内存的实例

对于用户存在很多会话的场景，若在运行过程中降低会话对内存的占用，可采取以下步骤：

1. 关闭自动加载会话开关：SDK 初始化时，将 `EMOptions#setAutoLoadAllConversations` 设置为 `false`。
2. 获取会话前清空内存中的会话：调用 `asyncFilterConversationsFromDB` 获取过滤的会话时，将 `cleanConversationsCache` 参数传 `true`。
3. 监控到内存较高时（开发者自己实现）释放内存: 调用 `cleanConversationsMemoryCache` 方法清空内存中的会话，释放内存。

```java
//step 1：SDK 初始化时，关闭自动加载会话开关。
EMOptions options = initChatOptions(context);
options.setAutoLoadAllConversations(false);
EMClient.getInstance().init(mContext, options);

//step 2：需要使用会话时，使用 asyncFilterConversationsFromDB 过滤后获取到会话，cleanConversationsCache 参数传 true。
EMClient.getInstance().chatManager().asyncFilterConversationsFromDB(new EMCustomConversationFilter() {
    @Override
    public boolean filter(EMConversation emConversation) {
         //在这里可以根据会话 emConversation 的属性决定返回 true/false 来过滤会话。
        return true;
    }
},true, new EMValueCallBack<List<EMConversation>>() {
    @Override
    public void onSuccess(List<EMConversation> filterConversations) {
        //filterConversations 为最终过滤后的会话结果。
    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
//step 3：当监控到内存较高时（该逻辑开发者自己去实现），调用以下方法释放内存。
EMClient.getInstance().chatManager().cleanConversationsMemoryCache();

```