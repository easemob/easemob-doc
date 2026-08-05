# 会话列表

## 功能说明

- **本地会话列表：** 对于单聊、群组聊天和聊天室会话，用户收发消息时，SDK 会在本地创建或更新对应会话，并将其维护在本地会话列表缓存中。应用可从本地内存或数据库读取会话列表，用于展示会话名称、头像、最后一条消息、未读数、置顶状态和会话标记等信息。
- **服务端与本地数据：** 环信服务器和 SDK 本地均可维护会话列表数据：服务端保存当前用户的会话状态，SDK 本地缓存用于客户端快速读取和展示会话列表。完成 SDK 初始化并成功登录后，SDK 会自动维护本地会话列表；会话同步、主动刷新、收发消息、删除会话、清空未读数、设置或取消置顶、添加或移除会话标记等操作均可能更新本地列表。
- **同步与变更通知：** 若需获取服务端维护的最新会话数据，应在初始化 SDK 前配置会话数据自动同步，并在登录后等待同步完成，再读取本地会话列表。当本地会话列表发生变化时，SDK 会通过会话列表更新事件通知应用；同一账号在其他设备上设置或取消会话置顶时，当前设备也可通过多设备事件感知该变更。

## 功能开通

使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 获取会话列表

应用应按照登录后自动同步、监听同步完成和读取本地会话列表的流程获取最新会话数据。

### 登录后自动同步会话列表

在调用 `EMClient#init` 初始化 SDK 前，通过 `EMOptions#setDataSyncType` 配置 `EMDataSyncType.CONVERSATIONS`。用户登录成功后，SDK 会自动同步会话列表并写入本地。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS
));

EMClient.getInstance().init(getApplicationContext(), options);
```

若还需要同步好友列表或已加入的群组列表，可以在同一个 `EnumSet` 中增加 `CONTACTS` 或 `JOINED_GROUPS`。关于登录后自动同步数据，详见[SDK 初始化文档](initialization.html)。

### 监听会话列表同步状态

通过 `EMConnectionListener` 监听会话列表同步状态。当 `type` 为 `EMDataSyncType.CONVERSATIONS` 时，表示当前同步的是会话列表。

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
        // SDK 已成功连接到 IM 服务器。
    }

    @Override
    public void onDisconnected(int errorCode) {
        // SDK 与 IM 服务器断开连接，可根据 errorCode 判断原因。
    }

    @Override
    public void onDataSyncStart(EMOptions.EMDataSyncType type) {
        if (type == EMOptions.EMDataSyncType.CONVERSATIONS) {
            // 会话列表开始同步。
        }
    }

    @Override
    public void onDataSyncFinish(
            EMOptions.EMDataSyncType type,
            int errorCode) {
        if (type != EMOptions.EMDataSyncType.CONVERSATIONS) {
            return;
        }

        if (errorCode == EMError.EM_NO_ERROR) {
            // 会话列表同步成功，可以读取本地会话列表。
        } else {
            // 会话列表同步失败，根据 errorCode 处理错误。
        }
    }
};

EMClient.getInstance().addConnectionListener(connectionListener);

// 不再需要监听时移除。
EMClient.getInstance().removeConnectionListener(connectionListener);
```

### 获取本地所有或筛选的会话

你可以调用 `asyncFilterConversationsFromDB` 从本地数据库获取全部会话或按条件筛选会话：

- `filter` 传入 `null`：获取本地数据库中的全部会话。
- `filter` 传入 `EMCustomConversationFilter` 实例：根据自定义条件筛选会话。
- `cleanConversationsCache` 为 `true`：加载筛选结果前清理已有的会话内存缓存。
- `cleanConversationsCache` 为 `false`：保留已有的会话内存缓存。

实现 `EMCustomConversationFilter#filter` 时，可以根据传入的 `EMConversation` 对象决定是否保留该会话：

- 返回 `true`：该会话会包含在回调结果中，并加载到内存。
- 返回 `false`：该会话会被过滤，不会包含在回调结果中，也不会加载到内存。

```java
EMClient.getInstance()
        .chatManager()
        .asyncFilterConversationsFromDB(
                new EMCustomConversationFilter() {
                    @Override
                    public boolean filter(EMConversation conversation) {
                        // 根据会话属性决定是否保留该会话。
                        return true;
                    }
                },
                false,
                new EMValueCallBack<List<EMConversation>>() {
                    @Override
                    public void onSuccess(
                            List<EMConversation> conversations) {
                        // conversations 为最终筛选结果。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

下表列出了初始化时可设置的会话相关选项：

| 选项                                        | 描述                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| `EMOptions#setDeleteMessagesAsExitChatRoom` | 设置退出聊天室时是否删除该聊天室的本地消息。 -（默认）`true`：删除本地消息。 - `false`：保留本地消息。 |
| `EMOptions#setLoadEmptyConversations`       | 设置从本地数据库加载会话时是否包含空会话。 - `true`：包含空会话。 -（默认）`false`：不包含空会话。必须在初始化 SDK 前设置。 |

### 一次性获取本地所有会话

调用 `getAllConversationsBySort` 可以获取经过排序的本地会话列表。该接口返回 `List<EMConversation>`，排序规则如下：

- 置顶会话排在非置顶会话之前。
- 置顶和非置顶会话内部均按照最后一条消息的时间戳倒序排列。

```java
List<EMConversation> conversations = EMClient.getInstance()
        .chatManager()
        .getAllConversationsBySort();
```

如果不需要 SDK 返回排序后的列表，可以调用 `getAllConversations`，获取以会话 ID 为键的 `Map<String, EMConversation>`：

```java
Map<String, EMConversation> conversationMap = EMClient.getInstance()
        .chatManager()
        .getAllConversations();
```

**本地会话读取接口与自动加载会话的关系**

初始化 SDK 前，可以通过 `EMOptions#setAutoLoadAllConversations` 设置登录成功后是否自动将本地数据库中的全部会话加载到内存：

- （默认）`true`：登录成功后自动加载全部会话。应用可以直接调用 `getAllConversationsBySort`、`getAllConversations` 或 `getUnreadMessageCount` 读取内存中的会话及未读数。

- `false`：登录成功后不自动加载全部会话，可以减少内存占用。此时，上述接口读取到的会话可能为空，未读消息总数可能为 `0`。如需按条件读取本地会话，可调用 [`asyncFilterConversationsFromDB`](#获取本地所有或筛选的会话)。

:::tip
`EMOptions#setDataSyncType` 与 `EMOptions#setAutoLoadAllConversations` 控制不同的数据处理阶段：

- `setDataSyncType` 包含 `EMDataSyncType.CONVERSATIONS`：登录成功后，将服务端会话数据同步到本地。
- `setAutoLoadAllConversations(true)`：登录成功后，将本地数据库中的全部会话加载到内存，默认值为 `true`。

如果开启会话列表自动同步但关闭自动加载，SDK 仍会同步服务端会话数据，但不会自动将本地全部会话加载到内存。应用可调用 [`asyncFilterConversationsFromDB`](#获取本地所有或筛选的会话) 按条件读取本地会话。
:::

## 获取会话名称和头像

调用 `EMConversation#getConversationName()` 和 `EMConversation#getConversationAvatar()` 可获取会话的显示名称和头像：

- 单聊会话：分别为对端用户的昵称和头像。
- 群聊会话：分别为群名称和群头像。
- 聊天室会话：通常为聊天室名称和头像。
- 相关数据尚未同步时，这两个方法可能返回空字符串。

```java
String conversationName = conversation.getConversationName();
String conversationAvatar = conversation.getConversationAvatar();
```

## 清除内存中的会话

你可以调用 `cleanConversationsMemoryCache` 清除内存中的全部会话以释放内存。清理后，`getAllConversations` 和 `getAllConversationsBySort` 返回的会话可能为空，`getUnreadMessageCount` 返回的未读消息总数可能为 `0`。

如需按条件重新读取会话，可调用 [`asyncFilterConversationsFromDB`](#获取本地所有或筛选的会话) 。

```java
EMClient.getInstance()
        .chatManager()
        .cleanConversationsMemoryCache();
```

## 降低会话占用内存的示例

对于会话数量较多的场景，可以采用以下方式降低会话数据的内存占用：

1. 初始化 SDK 前，将 `EMOptions#setAutoLoadAllConversations` 设置为 `false`，关闭登录成功后自动将全部本地会话加载到内存。
2. 按需调用 [`asyncFilterConversationsFromDB`](#获取本地所有或筛选的会话) 加载部分会话，并将 `cleanConversationsCache` 设置为 `true`，使 SDK 在加载筛选结果前清理已有的会话内存缓存。
3. 当业务侧检测到内存占用较高，且暂时不需要内存中的会话数据时，调用 `cleanConversationsMemoryCache` 清理会话内存缓存。

:::tip
调用 `cleanConversationsMemoryCache` 会清除内存中的会话数据，并可能影响本地会话列表及未读数的读取结果。关于清理后的影响和重新加载方式，详见 [清除内存中的会话](#清除内存中的会话)。
:::

```java
// 步骤 1：初始化 SDK 前关闭自动加载全部会话。
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setAutoLoadAllConversations(false);

EMClient.getInstance().init(getApplicationContext(), options);

// 步骤 2：按业务条件从数据库加载部分会话。
EMClient.getInstance()
        .chatManager()
        .asyncFilterConversationsFromDB(
                new EMCustomConversationFilter() {
                    @Override
                    public boolean filter(EMConversation conversation) {
                        // 示例：只加载存在未读消息的会话。
                        return conversation.getUnreadMsgCount() > 0;
                    }
                },
                true,
                new EMValueCallBack<List<EMConversation>>() {
                    @Override
                    public void onSuccess(
                            List<EMConversation> conversations) {
                        // conversations 为符合条件的会话列表。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

当业务侧检测到内存占用较高，且当前不再需要内存中的会话数据时，再单独清理：

```java
EMClient.getInstance()
        .chatManager()
        .cleanConversationsMemoryCache();
```

## 会话列表数据更新场景

| 场景 | 是否影响服务端数据 | 是否影响本地会话列表 |
| :--- | :--- | :--- |
| 登录后从服务端同步会话数据并写入本地，不修改服务端会话状态 | 否 | 是 |
| 收发消息时，SDK 创建或更新本地会话的最后一条消息、排序和未读数 | 视服务端配置而定 | 是 |
| 设置或取消会话置顶，同时更新服务端和本地置顶状态<br/>方法：`asyncPinConversation` | 是 | 是 |
| 添加或移除服务端及本地会话标记<br/>方法：`asyncAddConversationMark` / `asyncRemoveConversationMark` | 是 | 是 |
| 删除本地会话，由 `deleteMessages` 参数决定是否同时删除本地消息<br/>方法：`deleteConversation` | 否 | 是 |
| 删除服务端和本地的指定会话，由 `isDeleteServerMessages` 参数决定是否删除服务端历史消息<br/>方法：`deleteConversationFromServer` | 是 | 是 |
| 清空指定会话的未读消息数并同步多设备状态<br/>方法：`asyncClearConversationUnreadMessageCount` | 是 | 是 |
| 清空全部会话的未读消息数并同步多设备状态<br/>方法：`asyncClearAllConversationUnreadMessageCount` | 是 | 是 |

## 监听会话列表更新

当本地会话发生变化时，SDK 会触发 `EMConversationListener#onConversationUpdate`。该回调不直接返回完整会话列表，应用应重新调用 `getAllConversationsBySort` 获取最新的排序结果并刷新 UI。

```java
EMConversationListener conversationListener = new EMConversationListener() {
    @Override
    public void onConversationUpdate() {
        List<EMConversation> conversations = EMClient.getInstance()
                .chatManager()
                .getAllConversationsBySort();
        // 使用最新会话列表刷新 UI。
    }
};

EMClient.getInstance()
        .chatManager()
        .addConversationListener(conversationListener);

// 不再需要监听时移除。
EMClient.getInstance()
        .chatManager()
        .removeConversationListener(conversationListener);
```

## 接口最佳实践

| 场景 | 推荐做法 |
| :--- | :--- |
| 获取最新会话列表 | 初始化 SDK 前配置 `EMDataSyncType.CONVERSATIONS`，在会话同步成功后读取本地数据。不要调用 V5 已移除的服务端会话列表拉取接口。 |
| 展示会话列表 | 优先调用 `getAllConversationsBySort`，直接使用 SDK 返回的置顶优先、按最后消息时间倒序的列表。 |
| 响应会话变化 | 注册 `EMConversationListener`；收到 `onConversationUpdate` 后重新读取本地会话列表并刷新 UI。 |
| 管理监听器 | 页面或组件销毁时移除 `EMConnectionListener` 和 `EMConversationListener`，避免重复回调和内存泄漏。 |
| 释放并恢复会话内存 | 调用 `cleanConversationsMemoryCache` 后，如需按条件重新读取会话，可调用 [`asyncFilterConversationsFromDB`](#获取本地所有或筛选的会话) 。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setAppKey`](#登录后自动同步会话列表) | `EMOptions` | 设置应用的 App Key。 |
| [`setDataSyncType`](#登录后自动同步会话列表) | `EMOptions` | 设置登录成功后自动同步的数据类型。 |
| [`setLoadEmptyConversations`](#获取本地所有或筛选的会话) | `EMOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
| [`setDeleteMessagesAsExitChatRoom`](#获取本地所有或筛选的会话) | `EMOptions` | 设置退出聊天室时是否删除该聊天室的本地消息。 |
| [`setAutoLoadAllConversations`](#一次性获取本地所有会话) | `EMOptions` | 设置登录成功后是否自动将全部本地会话加载到内存。 |
| [`init`](#登录后自动同步会话列表) | `EMClient` | 使用指定配置初始化 Android SDK。 |
| [`asyncFilterConversationsFromDB`](#获取本地所有或筛选的会话) | `EMChatManager` | 从本地数据库获取全部会话或按条件筛选会话。 |
| [`getAllConversationsBySort`](#一次性获取本地所有会话) | `EMChatManager` | 获取置顶优先并按最后消息时间倒序排列的本地会话列表。 |
| [`getAllConversations`](#一次性获取本地所有会话) | `EMChatManager` | 获取以会话 ID 为键的本地会话映射。 |
| [`getConversationName`](#获取会话名称和头像) / [`getConversationAvatar`](#获取会话名称和头像) | `EMConversation` | 获取单聊或群聊会话的显示名称和头像。 |
| [`cleanConversationsMemoryCache`](#清除内存中的会话) | `EMChatManager` | 清理内存中的全部会话。 |
| [`getUnreadMessageCount`](#一次性获取本地所有会话) | `EMChatManager` | 获取本地全部会话的未读消息总数。 |
| [`asyncPinConversation`](#会话列表数据更新场景) | `EMChatManager` | 设置或取消会话置顶。 |
| [`asyncAddConversationMark`](#会话列表数据更新场景) / [`asyncRemoveConversationMark`](#会话列表数据更新场景) | `EMChatManager` | 添加或移除会话标记。 |
| [`deleteConversation`](#会话列表数据更新场景) | `EMChatManager` | 删除本地会话，并按参数决定是否删除本地消息。 |
| [`deleteConversationFromServer`](#会话列表数据更新场景) | `EMChatManager` | 删除服务端和本地的指定会话。 |
| [`asyncClearConversationUnreadMessageCount`](#会话列表数据更新场景) | `EMChatManager` | 清空指定会话的未读消息数。 |
| [`asyncClearAllConversationUnreadMessageCount`](#会话列表数据更新场景) | `EMChatManager` | 清空全部会话的未读消息数。 |
| [`filter`](#获取本地所有或筛选的会话) | `EMCustomConversationFilter` | 判断会话是否保留在筛选结果中并加载到内存。 |
