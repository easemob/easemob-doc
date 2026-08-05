# 会话置顶

## 功能说明

会话置顶用于将重要的单聊、群聊或聊天室会话固定在会话列表靠前位置，方便用户快速找到高频或重点会话。置顶状态会保存到服务端，并同步到当前用户的其他设备和本地会话数据。

## 功能开通

会话置顶属于服务端会话列表功能的一部分。使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已开通[服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 设置或取消置顶会话

调用 `EMChatManager#asyncPinConversation` 设置或取消会话置顶。置顶状态会存储在服务器上，状态变更会同时更新服务端和本地。`isPinned` 为 `true` 时置顶，为 `false` 时取消置顶。
多设备登录时，当前用户在一台设备上设置或取消会话置顶后，其他在线设备会通过 `EMMultiDeviceListener#onConversationEvent` 收到多设备会话事件。设置置顶对应 `CONVERSATION_PINNED`，取消置顶对应 `CONVERSATION_UNPINNED`。

你最多可以置顶 50 个会话。

```java
boolean isPinned = true;

// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncPinConversation(
                // 单聊传入对端用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID
                conversationId,
                // 为 `true` 时置顶，为 `false` 时取消置顶。
                isPinned,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 会话置顶状态设置成功。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 根据错误码和错误信息处理。
                    }
                });
```

参数说明如下：

| 参数 | 类型 | 说明 |
| :--- | :--- | :--- |
| `conversationId` | String | 会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `isPinned` | Boolean | 是否置顶：`true` 表示置顶，`false` 表示取消置顶。 |
| `callback` | `EMCallBack` | 操作结果回调。 |

`asyncPinConversation` 不直接返回更新后的会话对象。调用成功后，可重新读取本地会话，并通过以下接口获取置顶状态：

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null) {
    boolean pinned = conversation.isPinned();
    // 返回会话置顶时的 UNIX 时间戳，单位为毫秒；会话未置顶时返回 `0`。 
    long pinnedTime = conversation.getPinnedTime();
}
```

## 获取置顶会话列表

置顶状态随会话数据在登录后自动同步并写入本地，应用应在同步完成后读取本地会话列表。

初始化 SDK 前，通过 `EMOptions#setDataSyncType` 配置 `EMDataSyncType.CONVERSATIONS`：

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS));

EMClient.getInstance().init(getApplicationContext(), options);
```

当 `EMConnectionListener#onDataSyncFinish` 回调中的 `type` 为 `CONVERSATIONS` 且 `errorCode` 为 `EMError.EM_NO_ERROR` 时，可调用 `getAllConversationsBySort` 获取本地会话列表，再筛选置顶会话：

```java
List<EMConversation> conversations = EMClient.getInstance()
        .chatManager()
        .getAllConversationsBySort();

List<EMConversation> pinnedConversations = new ArrayList<>();
for (EMConversation conversation : conversations) {
    if (conversation.isPinned()) {
        pinnedConversations.add(conversation);
    }
}
```

`EMConversation` 中与会话置顶相关的接口如下：

| API | 返回类型 | 说明 |
| :--- | :--- | :--- |
| `conversationId()` | String | 会话 ID。 |
| `getType()` | `EMConversationType` | 获取会话类型。 |
| `isPinned()` | Boolean | 会话是否置顶。 |
| `getPinnedTime()` | long | 获取置顶时间戳，单位为毫秒；未置顶时返回 `0`。 |

:::tip
若需要从本地数据库加载空会话，应在初始化 SDK 前调用 `EMOptions#setLoadEmptyConversations(true)`。否则，从本地数据库加载会话时默认不包含空会话。
:::

## 监听本地会话列表更新

本地会话发生变化时，SDK 会触发 `EMConversationListener#onConversationUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。

```java
EMConversationListener conversationListener =
        new EMConversationListener() {
            @Override
            public void onConversationUpdate() {
                List<EMConversation> conversations = EMClient.getInstance()
                        .chatManager()
                        .getAllConversationsBySort();
                // 使用最新会话列表刷新界面。
            }
        };

EMClient.getInstance()
        .chatManager()
        .addConversationListener(conversationListener);

// 不再需要监听时移除监听器。
EMClient.getInstance()
        .chatManager()
        .removeConversationListener(conversationListener);
```

## 监听多设备会话置顶事件

同一用户在其他设备上设置或取消会话置顶时，当前设备可通过 `EMMultiDeviceListener#onConversationEvent` 接收多设备会话事件：

| 事件 | 说明 |
| :--- | :--- |
| `CONVERSATION_PINNED` | 当前用户在其他设备上置顶会话。 |
| `CONVERSATION_UNPINNED` | 当前用户在其他设备上取消会话置顶。 |

```java
EMMultiDeviceListener multiDeviceListener =
        new EMMultiDeviceListener() {
            @Override
            public void onConversationEvent(
                    int event,
                    String conversationId,
                    EMConversationType type) {
                if (event == EMMultiDeviceListener.CONVERSATION_PINNED
                        || event == EMMultiDeviceListener.CONVERSATION_UNPINNED) {
                    List<EMConversation> conversations = EMClient.getInstance()
                            .chatManager()
                            .getAllConversationsBySort();
                    // 使用最新会话列表刷新界面。
                }
            }
        };

EMClient.getInstance().addMultiDeviceListener(multiDeviceListener);

// 不再需要监听时移除监听器。
EMClient.getInstance().removeMultiDeviceListener(multiDeviceListener);
```

:::tip
多设备事件通知当前用户的其他在线设备。当前设备发起置顶操作后，应以 `asyncPinConversation` 的结果回调为操作结果，并按需重新读取本地会话列表。
:::

## 排序与展示建议

`getAllConversationsBySort` 返回的会话列表遵循以下排序规则：
  - 置顶会话位于非置顶会话之前。
  - 置顶和非置顶会话内部均按最后一条消息的时间戳倒序排列。
展示会话列表时，建议直接使用 SDK 返回的顺序。如果业务需要按“最近置顶时间”排列多个置顶会话，可以使用 `EMConversation#getPinnedTime()` 返回的时间戳进行倒序排序，使最近置顶的会话更靠前。

```java
List<EMConversation> conversations =
        EMClient.getInstance()
                .chatManager()
                .getAllConversationsBySort();

// 将置顶会话和非置顶会话分开。
List<EMConversation> pinnedConversations = new ArrayList<>();
List<EMConversation> unpinnedConversations = new ArrayList<>();

for (EMConversation conversation : conversations) {
    if (conversation.isPinned()) {
        pinnedConversations.add(conversation);
    } else {
        unpinnedConversations.add(conversation);
    }
}

// 置顶会话按置顶时间倒序排列，使最近置顶的会话更靠前。
Collections.sort(
        pinnedConversations,
        (first, second) ->
                Long.compare(
                        second.getPinnedTime(),
                        first.getPinnedTime()));

// 合并列表，置顶会话保持在非置顶会话之前。
List<EMConversation> sortedConversations = new ArrayList<>();
sortedConversations.addAll(pinnedConversations);
sortedConversations.addAll(unpinnedConversations);
```

## 注意事项

- 会话置顶支持单聊、群聊和聊天室会话。
- `conversationId` 不能为空；调用失败时，应根据回调中的错误码和错误信息处理。
- 最多可以置顶 50 个会话。
- 会话置顶状态保存在服务端，并同步到当前用户的其他设备。
- 应在会话数据同步完成后，通过本地接口读取并筛选置顶会话。
- 会话置顶不影响消息收发、会话未读数、消息已读状态或会话标记。
- 本地会话列表默认不包含从数据库加载的空会话；如需包含，应在初始化 SDK 前调用 `setLoadEmptyConversations(true)`。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncPinConversation`](#设置或取消置顶会话) | `EMChatManager` | 设置或取消指定会话的置顶状态。 |
| [`getConversation`](#设置或取消置顶会话) | `EMChatManager` | 获取指定的本地会话对象。 |
| [`setAppKey`](#获取置顶会话列表) | `EMOptions` | 设置应用的 App Key。 |
| [`setDataSyncType`](#获取置顶会话列表) | `EMOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#获取置顶会话列表) | `EMClient` | 使用指定配置初始化 SDK。 |
| [`getAllConversationsBySort`](#获取置顶会话列表) | `EMChatManager` | 获取置顶优先排序的本地会话列表。 |
| [`conversationId`](#获取置顶会话列表) / [`getType`](#获取置顶会话列表) | `EMConversation` | 获取会话 ID 和会话类型。 |
| [`setLoadEmptyConversations`](#获取置顶会话列表) | `EMOptions` | 设置从本地数据库加载会话时是否包含空会话。 |
