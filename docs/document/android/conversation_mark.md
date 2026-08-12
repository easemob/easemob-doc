# 会话标记

## 功能说明

会话标记用于为会话添加业务分类，例如标星、待处理或重要客户等。SDK 支持为单聊、群聊和聊天室会话添加或移除标记。

SDK 提供 `MARK_0` 至 `MARK_19` 共 20 个标记，单个会话最多可同时包含 20 个标记。各标记的业务含义由应用自行定义和维护。

```java
Map<EMConversation.EMMarkType, String> markMapping = new HashMap<>();
markMapping.put(EMConversation.EMMarkType.MARK_0, "important");
markMapping.put(EMConversation.EMMarkType.MARK_1, "pending");
markMapping.put(EMConversation.EMMarkType.MARK_2, "customer");
```

:::tip
会话标记只用于会话分类和筛选，不会影响会话未读数、消息收发、置顶状态或消息已读状态。
:::

## 功能开通

会话标记属于服务端会话列表功能的一部分。使用前，需要在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见[快速开始](quickstart.html)。
- 已开通[服务端会话列表功能](/product/console/basic_conversation_group_chatroom.html#服务端会话列表)。
- 已了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 添加会话标记

调用 `EMChatManager#asyncAddConversationMark` 为一个或多个会话添加指定标记。该操作会同时更新服务端和本地的会话标记。单次最多可传入 20 个会话 ID。

添加会话标记后，标记数据会同时更新到服务端和本地。会话标记会随会话数据在登录后自动同步并写入本地；同步完成后，可通过本地会话列表接口获取 `EMConversation` 对象，再调用 `EMConversation#marks` 获取该会话的全部标记。

若服务端会话列表达到数量限制（默认最多 100 个会话），服务端可能根据会话活跃度移除不活跃会话。对应会话的标记也可能不再随服务端会话列表同步到本地。

:::tip 

会话标记仅用于业务分类和筛选，不会影响消息收发、会话未读数、消息已读状态或会话置顶状态。

 :::

```java
List<String> conversationIds = Arrays.asList(
        "user2",
        "group1");

// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncAddConversationMark(
                conversationIds,
                EMConversation.EMMarkType.MARK_0,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 会话标记添加成功。
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
| `conversationIds` | `List<String>` | 会话 ID 列表，不能为空；单次最多传入 20 个会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `mark` | `EMConversation.EMMarkType` | 添加的标记，取值为 `MARK_0` 至 `MARK_19`。 |
| `callback` | `EMCallBack` | 操作结果回调。调用成功触发 `onSuccess`，失败触发 `onError`。 |

## 移除会话标记

调用 `EMChatManager#asyncRemoveConversationMark` 从一个或多个会话中移除指定标记。该操作会同时更新服务端和本地的会话标记。单次最多可传入 20 个会话 ID。

```java
List<String> conversationIds = Arrays.asList(
        "user2",
        "group1");

// 异步方法。
EMClient.getInstance()
        .chatManager()
        .asyncRemoveConversationMark(
                conversationIds,
                EMConversation.EMMarkType.MARK_0,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // 会话标记移除成功。
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // 根据错误码和错误信息处理。
                    }
                });
```

`asyncRemoveConversationMark` 的参数规则与 `asyncAddConversationMark` 相同。

## 按标记筛选会话列表

会话标记随会话数据在登录后自动同步并写入本地，应用应在同步完成后读取本地会话列表，并通过 `EMConversation#marks` 筛选带有指定标记的会话。

初始化 SDK 前，通过 `EMOptions#setDataSyncType` 配置 `EMDataSyncType.CONVERSATIONS`：

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS));

EMClient.getInstance().init(getApplicationContext(), options);
```

当 `EMConnectionListener#onDataSyncFinish` 回调中的 `type` 为 `CONVERSATIONS` 且 `errorCode` 为 `EMError.EM_NO_ERROR` 时，可以读取本地会话列表并按标记筛选：

```java
List<EMConversation> conversations = EMClient.getInstance()
        .chatManager()
        .getAllConversationsBySort();

List<EMConversation> markedConversations = new ArrayList<>();
for (EMConversation conversation : conversations) {
    Set<EMConversation.EMMarkType> marks = conversation.marks();
    if (marks.contains(EMConversation.EMMarkType.MARK_0)) {
        markedConversations.add(conversation);
    }
}
```

如需获取单个本地会话的全部标记，可以先调用 `getConversation` 获取会话对象，再调用 `marks`：

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

Set<EMConversation.EMMarkType> marks = conversation == null
        ? Collections.emptySet()
        : conversation.marks();
```

:::tip
`getAllConversationsBySort` 和 `getConversation` 读取本地会话，不会主动向服务器请求数据。若需要最新的服务端标记状态，应先等待会话数据同步完成。
:::

## 监听会话列表更新

本地会话发生变化时，SDK 会触发 `EMConversationListener#onConversationUpdate`。该回调不返回完整会话列表，应用应重新读取本地会话列表并刷新界面。

```java
EMConversationListener conversationListener =
        new EMConversationListener() {
            @Override
            public void onConversationUpdate() {
                List<EMConversation> conversations = EMClient.getInstance()
                        .chatManager()
                        .getAllConversationsBySort();
                // 重新筛选带有目标标记的会话并刷新界面。
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

同一用户在其他设备上更新会话标记时，当前设备可通过 `EMMultiDeviceListener#onConversationEvent` 接收 `CONVERSATION_MARK_UPDATE` 事件。收到事件后，可重新读取本地会话列表并刷新界面。

```java
EMMultiDeviceListener multiDeviceListener =
        new EMMultiDeviceListener() {
            @Override
            public void onConversationEvent(
                    int event,
                    String conversationId,
                    EMConversation.EMConversationType type) {
                if (event == EMMultiDeviceListener.CONVERSATION_MARK_UPDATE) {
                    // 其他设备更新了会话标记，重新读取本地会话列表。
                }
            }
        };

EMClient.getInstance().addMultiDeviceListener(multiDeviceListener);

// 不再需要监听时移除监听器。
EMClient.getInstance().removeMultiDeviceListener(multiDeviceListener);
```

## 注意事项

- 会话标记支持单聊、群聊和聊天室会话。
- 会话标记取值为 `MARK_0` 至 `MARK_19`，各标记的业务含义由应用维护。
- 单个会话最多可以同时包含 20 个标记。
- `asyncAddConversationMark` 和 `asyncRemoveConversationMark` 可同时操作多个会话，单次最多传入 20 个会话 ID。
- 会话 ID 列表不能为空，标记不能为空；调用失败时，应根据回调中的错误码和错误信息处理。
- 会话标记会同时更新服务端和本地会话数据，并同步到当前用户的其他设备。
- 会话标记不影响会话未读数、消息已读状态、消息收发或会话置顶状态。
- 应在会话数据同步完成后，通过本地接口读取并筛选会话。
- 若服务端会话列表达到数量限制，不活跃会话可能被移出服务端会话列表，对应标记也可能不再随会话列表返回。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`asyncAddConversationMark`](#添加会话标记) | `EMChatManager` | 为一个或多个会话添加指定标记。 |
| [`asyncRemoveConversationMark`](#移除会话标记) | `EMChatManager` | 从一个或多个会话中移除指定标记。 |
| [`setAppKey`](#按标记筛选会话列表) | `EMOptions` | 设置应用的 App Key。 |
| [`setDataSyncType`](#按标记筛选会话列表) | `EMOptions` | 设置登录成功后自动同步的数据类型。 |
| [`init`](#按标记筛选会话列表) | `EMClient` | 使用指定配置初始化 SDK。 |
| [`getAllConversationsBySort`](#按标记筛选会话列表) | `EMChatManager` | 获取置顶优先排序的本地会话列表。 |
| [`getConversation`](#按标记筛选会话列表) | `EMChatManager` | 获取指定的本地会话对象。 |
| [`marks`](#按标记筛选会话列表) | `EMConversation` | 获取会话的全部标记。 |
