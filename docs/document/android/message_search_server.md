# 搜索服务端消息

## 功能说明

服务端消息搜索用于按关键词从服务端搜索当前用户可见的历史消息，适用于全局消息搜索、会话内搜索、按消息类型过滤搜索以及按时间范围检索消息等场景。

Android SDK 提供 `EMChatManager#asyncSearchMessagesFromServer` 方法进行服务端消息搜索。该接口支持以下功能：

- 支持使用一个或多个关键词搜索历史消息，并设置多关键词匹配关系。
- 支持按指定会话、消息类型和消息发送时间范围筛选结果。
- 支持搜索消息内容、消息扩展字段（`ext`）或同时搜索两者。
- 搜索范围仅限于当前用户参与且有权访问的会话。
- 搜索结果按照相关性排序，支持分页查询和关键词高亮。

:::tip
默认不支持搜索扩展字段 `ext`；如需支持，请联系环信商务。
:::

## 功能开通

要使用服务端消息搜索功能，需 **联系环信商务开通**。

目前仅国内二区集群支持该功能。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 Android SDK v4.24.0 或以上版本的 [初始化](initialization.html) 并 [登录](login.html) 成功。
- 当前应用已开通消息搜索服务。
- 已了解消息搜索服务的使用限制和接口调用频率限制，详见 [使用限制](/product/limitation.html)。

## 搜索服务端消息

### 调用方法

你可以创建 `EMMessageSearchOption` 对象设置搜索条件，然后调用 `EMChatManager#asyncSearchMessagesFromServer` 从服务端异步搜索历史消息。

#### 搜索条件和内容

服务端消息搜索支持以下搜索条件和内容：

| 搜索维度 | 支持能力 | 设置方法 |
| :-------------- | :----- | :------- |
| 关键词 | 支持使用一个或多个关键词搜索历史消息，并可设置匹配任一关键词或匹配全部关键词。 | `setKeywordList`、`setKeywordMatchType` |
| 会话 | 支持搜索全部会话，也可以指定单聊、群聊或聊天室会话。单聊传对方用户 ID，群聊或聊天室传对应的群组 ID 或聊天室 ID。 | `setConversationId` |
| 消息类型 | 支持搜索文本、图片、视频、位置、文件、自定义和合并消息，不支持搜索语音消息和透传消息。 | `setMsgTypes` |
| 时间范围 | 支持按消息发送时间范围搜索。开始时间和结束时间必须同时设置。 | `setStartTime`、`setEndTime` |
| 搜索内容 | 支持仅搜索消息内容、仅搜索消息扩展字段（`ext`），或同时搜索两者。消息内容包括文本消息内容以及自动翻译后的文本内容。 | `setSearchScope` |

#### 消息可见范围

服务端消息搜索仅返回当前用户参与且有权访问的会话中的消息：

- 单聊可返回当前用户作为发送方或接收方的消息。
- 搜索群聊或聊天室消息时，需指定对应的群组 ID 或聊天室 ID，并通过服务端成员身份校验。
- 当前用户已单方面删除的消息不会出现在搜索结果中。

#### 示例代码

```java
EMMessageSearchOption option = new EMMessageSearchOption();

// 设置关键词列表。
option.setKeywordList(Arrays.asList("hello"));

// 多关键词之间默认使用 OR 关系。
option.setKeywordMatchType(EMKeywordListMatchType.OR);

// 可选。单聊传对方用户 ID，群聊传群组 ID，聊天室传聊天室 ID。
option.setConversationId("groupId");

// 可选。服务端消息搜索不支持语音消息和透传消息。
option.setMsgTypes(Arrays.asList(EMMessage.Type.TXT, EMMessage.Type.IMAGE));

// 可选。起止时间必须同时设置，单位为毫秒。
option.setStartTime(1700000000000L);
option.setEndTime(1700100000000L);

// 可选。默认仅搜索消息内容。
option.setSearchScope(EMConversation.EMMessageSearchScope.ALL);

int pageSize = 20;
int pageNum = 1;

EMClient.getInstance().chatManager().asyncSearchMessagesFromServer(
    // 搜索选项 `EMMessageSearchOption`。不能为 `null`。
    option,
    // 每页返回的结果数量，取值范围为 1-100。
    pageSize,
    // 当前页码，从 1 开始。
    pageNum,
    new EMValueCallBack<EMPageResult<EMSearchServerMessageResult>>() {
        @Override
        public void onSuccess(EMPageResult<EMSearchServerMessageResult> result) {
            List<EMSearchServerMessageResult> messages = result.getData();
            int pageCount = result.getPageCount();

            for (EMSearchServerMessageResult message : messages) {
                String messageId = message.getMessageId();
                EMMessageBody body = message.getBody();
                List<String> highlightTexts = message.getHighlightTexts();
            }
        }

        @Override
        public void onError(int errorCode, String errorMessage) {
            // 处理搜索失败。
        }
    }
);
```

#### 搜索参数

`EMMessageSearchOption` 参数说明如下：

| 设置方法 | 参数类型 | 是否必需 | 描述 |
| --- | --- | --- | --- |
| `setKeywordList` | `List<String>` | 是 | 设置关键词列表。每个关键词长度为 1-120 个字符，所有关键词总长度不超过 120 个字符，最多设置 5 个关键词。 |
| `setKeywordMatchType` | `EMKeywordListMatchType` | 否 | 设置多关键词匹配关系。`OR` 表示匹配任一关键词，`AND` 表示同时匹配全部关键词。默认值为 `OR`；传入 `null` 时也使用 `OR`。 |
| `setConversationId` | String | 否 | 设置会话 ID。单聊传对方用户 ID；群聊传群组 ID；聊天室传聊天室 ID。为空表示搜索所有会话。Android SDK 不需要额外传入会话类型。 |
| `setMsgTypes` | `List<EMMessage.Type>` | 否 | 设置消息类型过滤条件。可使用 `TXT`、`IMAGE`、`VIDEO`、`LOCATION`、`FILE`、`CUSTOM` 和 `COMBINE`。不支持 `VOICE` 和 `CMD`。 |
| `setStartTime` | Long | 否 | 设置查询开始时间，Unix 时间戳，单位为毫秒。需与结束时间同时设置。 |
| `setEndTime` | Long | 否 | 设置查询结束时间，Unix 时间戳，单位为毫秒。结束时间需与开始时间同时设置，而且不应早于开始时间。|
| `setSearchScope` | `EMConversation.EMMessageSearchScope` | 否 | 设置搜索范围。`CONTENT` 表示仅搜索消息内容，`EXT` 表示仅搜索消息扩展字段，`ALL` 表示搜索消息内容和扩展字段。默认值为 `CONTENT`；传入 `null` 时也使用 `CONTENT`。 |

#### 返回结果

搜索结果由服务端按照相关性排序，支持分页查询，并返回与关键词匹配的高亮文本。

搜索成功后，SDK 返回 `EMPageResult<EMSearchServerMessageResult>`：

| 方法 | 返回类型 | 描述 |
| --- | --- | --- |
| `getData()` | `List<EMSearchServerMessageResult>` | 获取当前页的搜索结果列表。 |
| `getPageCount()` | `int` | 获取服务端返回的分页页数信息。 |

搜索结果为 `EMSearchServerMessageResult` 对象列表。你可以从结果对象中获取消息 ID、消息体、扩展字段、发送方、接收方、会话 ID、会话类型、消息时间戳以及服务端返回的高亮文本列表。

`EMSearchServerMessageResult` 提供以下结果读取方法：

| 方法 | 返回类型 | 描述 |
| --- | --- | --- |
| `getMessageId()` | String | 获取消息 ID。 |
| `getBody()` | `EMMessageBody` | 获取消息体。可根据实际消息体类型转换为 `EMTextMessageBody`、`EMImageMessageBody` 等具体类型。 |
| `getExt()` | `Map<String, Object>` | 获取消息扩展属性。 |
| `getFrom()` | String | 获取消息发送方。 |
| `getTo()` | String | 获取消息接收方。 |
| `getConversationId()` | String | 获取会话 ID。 |
| `getChatType()` | EMMessage.ChatType | 获取会话类型。可能为 `Chat`、`GroupChat` 或 `ChatRoom`。 |
| `getTimestamp()` | Long | 获取消息时间戳，单位为毫秒。 |
| `getHighlightTexts()` | `List<String>` | 获取服务端返回的搜索高亮文本列表。该列表可能为空。 |

### 常见搜索场景

#### 搜索指定会话的消息

如果需要搜索指定会话中的消息，只需设置 `conversationId`。

```java
EMMessageSearchOption option = new EMMessageSearchOption();
option.setKeywordList(Arrays.asList("订单"));
option.setConversationId("userId");

EMClient.getInstance().chatManager().asyncSearchMessagesFromServer(
    option,
    20,
    1,
    new EMValueCallBack<EMPageResult<EMSearchServerMessageResult>>() {
        @Override
        public void onSuccess(EMPageResult<EMSearchServerMessageResult> result) {
            List<EMSearchServerMessageResult> messages = result.getData();
        }

        @Override
        public void onError(int errorCode, String errorMessage) {
        }
    }
);
```

#### 使用多个关键词搜索

如果需要搜索多个关键词，可通过 `EMKeywordListMatchType` 指定匹配方式。

```java
EMMessageSearchOption option = new EMMessageSearchOption();
// 关键词列表最多包含 5 个关键词；每个关键词长度为 1-512 个字符；所有关键词总长度不超过 1024 个字符。
option.setKeywordList(Arrays.asList("会议", "明天"));
option.setKeywordMatchType(EMKeywordListMatchType.AND);

EMClient.getInstance().chatManager().asyncSearchMessagesFromServer(
    option,
    20,
    1,
    new EMValueCallBack<EMPageResult<EMSearchServerMessageResult>>() {
        @Override
        public void onSuccess(EMPageResult<EMSearchServerMessageResult> result) {
            List<EMSearchServerMessageResult> messages = result.getData();
        }

        @Override
        public void onError(int errorCode, String errorMessage) {
        }
    }
);
```

#### 按消息类型搜索

若按消息类型搜索，需要调用 `setMsgTypes` 设置消息类型：

```java
EMMessageSearchOption option = new EMMessageSearchOption();
option.setKeywordList(Arrays.asList("图片"));
option.setMsgTypes(Arrays.asList(
    EMMessage.Type.TXT,
    EMMessage.Type.IMAGE,
    EMMessage.Type.FILE
));

EMClient.getInstance().chatManager().asyncSearchMessagesFromServer(
    option,
    20,
    1,
    new EMValueCallBack<EMPageResult<EMSearchServerMessageResult>>() {
        @Override
        public void onSuccess(
            EMPageResult<EMSearchServerMessageResult> result) {
            List<EMSearchServerMessageResult> messages = result.getData();
        }

        @Override
        public void onError(int errorCode, String errorMessage) {
        }
    }
);
```

#### 搜索消息扩展字段

若仅搜索消息扩展字段，需要调用 `setSearchScope`，将搜索范围设置为 `EMMessageSearchScope.EXT`：

```java
EMMessageSearchOption option = new EMMessageSearchOption();
option.setKeywordList(Arrays.asList("order-10001"));

// EXT 表示仅搜索消息扩展字段。
option.setSearchScope(EMConversation.EMMessageSearchScope.EXT);

EMClient.getInstance().chatManager().asyncSearchMessagesFromServer(
    option,
    20,
    1,
    new EMValueCallBack<EMPageResult<EMSearchServerMessageResult>>() {
        @Override
        public void onSuccess(
            EMPageResult<EMSearchServerMessageResult> result) {
            List<EMSearchServerMessageResult> messages = result.getData();
        }

        @Override
        public void onError(int errorCode, String errorMessage) {
        }
    }
);
```

搜索范围还支持以下取值：

- `CONTENT`：仅搜索消息内容，默认值。
- `EXT`：仅搜索消息扩展字段。
- `ALL`：同时搜索消息内容和消息扩展字段。

#### 按时间范围搜索

若按时间范围搜索，需要分别调用 `setStartTime` 和 `setEndTime` 设置开始时间和结束时间。

开始时间和结束时间使用 Unix 时间戳，单位为毫秒。两个时间必须同时设置，且结束时间不能早于开始时间。

```java
EMMessageSearchOption option = new EMMessageSearchOption();
option.setKeywordList(Arrays.asList("hello"));

// 开始时间和结束时间必须同时设置，单位为毫秒。
option.setStartTime(1700000000000L);
option.setEndTime(1700100000000L);

EMClient.getInstance().chatManager().asyncSearchMessagesFromServer(
    option,
    20,
    1,
    new EMValueCallBack<EMPageResult<EMSearchServerMessageResult>>() {
        @Override
        public void onSuccess(
            EMPageResult<EMSearchServerMessageResult> result) {
            List<EMSearchServerMessageResult> messages = result.getData();
        }

        @Override
        public void onError(int errorCode, String errorMessage) {
        }
    }
);
```

## 注意事项

- 当前用户已单方面删除的消息不会出现在搜索结果中。
- 搜索服务需要单独开通。若未开通，服务端可能返回 `EMError.SERVICE_NOT_ENABLED`（错误码 `505`）。
- 参数错误可能通过 `EMValueCallBack#onError` 返回 `EMError.INVALID_PARAM`（错误码 `110`）；鉴权失败可能返回 `EMError.USER_AUTHENTICATION_FAILED`（错误码 `202`）；未知服务端错误可能返回 `EMError.SERVER_UNKNOWN_ERROR`（错误码 `303`）。
