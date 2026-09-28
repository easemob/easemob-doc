# 搜索服务端消息

## 功能说明

服务端消息搜索用于按关键词从服务端搜索当前用户可见的历史消息，适用于全局消息搜索、会话内搜索、按消息类型过滤搜索以及按时间范围检索消息等场景。

HarmonyOS SDK 提供 `ChatManager#searchMessagesFromServer` 方法进行服务端消息搜索。该接口支持以下功能：

- 支持使用一个或多个关键词搜索历史消息，并通过设置多关键词匹配关系。
- 支持按指定会话、消息类型和消息发送时间范围筛选结果。
- 支持搜索消息内容、消息扩展字段（`ext`）或同时搜索两者。
- 搜索范围仅限于当前用户参与且有权访问的会话。
- 搜索结果按照相关性排序，支持分页查询和关键词高亮。

## 功能开通

使用前需联系环信商务开通消息搜索服务，详见[开通说明](/product/console/purchase_value_added.html#消息搜索)。消息扩展字段（`ext`）搜索默认不开启，如需使用，可在开通时一并申请或后续联系商务单独开通。

**关于扩展字段搜索**：开通消息搜索服务后，消息扩展字段（`ext`）搜索默认不开启。如需使用该功能，可在开通时一并说明，或后续联系商务单独开通。

:::tip
目前，仅国内二区集群支持该功能。
:::

## 前提条件

开始前，请确保：

- 已完成 HarmonyOS SDK 1.15.0 或以上版本的[初始化](/document/harmonyos/initialization.html)并[登录](/document/harmonyos/login.html)成功。
- 当前应用已开通消息搜索服务。
- 已了解消息搜索服务的使用限制和接口调用频率限制，详见 [使用限制](/product/limitation.html)。

## 搜索服务端消息

### 调用方法

你可以创建 `MessageSearchOption` 对象设置搜索条件，然后调用 `ChatManager#searchMessagesFromServer` 从服务端异步搜索历史消息。

#### 搜索条件和内容

服务端消息搜索支持以下搜索条件和内容：

| 搜索维度 | 支持能力 | 设置方法 |
| :--- | :--- | :--- |
| 关键词 | 支持使用一个或多个关键词搜索历史消息，并可设置匹配任一关键词或匹配全部关键词。 | `setKeywordList`、`setKeywordMatchType` |
| 会话 | 支持搜索全部会话，也可以指定单聊、群聊或聊天室会话。单聊传对方用户 ID，群聊或聊天室传对应的群组 ID 或聊天室 ID。 | `setConversationId` |
| 消息类型 | 支持搜索文本、图片、视频、位置、文件和合并消息，不支持搜索自定义消息、语音消息和透传消息。 | `setMsgTypes` |
| 时间范围 | 支持按消息发送时间范围搜索。开始时间和结束时间必须同时设置。 | `setStartTime`、`setEndTime` |
| 搜索内容 | 支持仅搜索消息内容、仅搜索消息扩展字段（`ext`），或同时搜索两者。消息内容包括文本消息内容以及自动翻译后的文本内容。 | `setSearchScope` |

#### 消息可见范围

服务端消息搜索仅返回当前用户参与且有权访问的会话中的消息：

- 单聊可返回当前用户作为发送方或接收方的消息。
- 搜索群聊或聊天室消息时，服务端会校验当前用户的成员身份。
- 搜索的消息必须是在服务端保存期限内的历史消息。
- 未设置会话 ID 时搜索当前用户有权访问的全部会话；设置会话 ID 时仅搜索指定会话。

#### 示例代码

```typescript
let option = new MessageSearchOption();

// 设置关键词列表。
option.setKeywordList(['hello']);

// 多关键词之间默认使用 OR 关系。
option.setKeywordMatchType(KeywordListMatchType.OR);

// 可选。单聊传对方用户 ID，群聊传群组 ID，聊天室传聊天室 ID；无需额外传入会话类型。
option.setConversationId('groupId');

// 可选。服务端消息搜索不支持自定义消息、语音消息和透传消息。
option.setMsgTypes([ContentType.TXT, ContentType.IMAGE]);

// 可选。起止时间必须同时设置，单位为毫秒。
option.setStartTime(1700000000000);
option.setEndTime(1700100000000);

// 可选。默认仅搜索消息内容。
option.setSearchScope(MessageSearchScope.ALL);

let pageSize = 20;
let pageNum = 1;

ChatClient.getInstance().chatManager()?.searchMessagesFromServer(
  // 搜索选项 MessageSearchOption，不能为 undefined。
  option,
  // 每页返回的结果数量，取值范围为 1-100。
  pageSize,
  // 当前页码，从 1 开始。
  pageNum
)
  .then((result) => {
    let messages = result.getData();
    let pageCount = result.getPageCount();

    messages.forEach((message) => {
      let messageId = message.getMessageId();
      let body = message.getBody();
      let highlightTexts = message.getHighlightTexts();
    });
  })
  .catch((error: ChatError) => {
    // 根据 error.errorCode 和 error.description 处理搜索失败。
  });
```

### 搜索参数

| 方法 | 参数类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `setKeywordList` | `string \| string[]` | 是 | 设置关键词。每个关键词长度为 1-120 个字符，所有关键词总长度不超过 120 个字符，最多 5 个关键词。 |
| `setKeywordMatchType` | `KeywordListMatchType` | 否 | 设置多关键词匹配关系。`OR` 表示匹配任一关键词，`AND` 表示同时匹配全部关键词，默认值为 `OR`。 |
| `setConversationId` | `string` | 否 | 设置会话 ID。单聊传对方用户 ID，群聊传群组 ID，聊天室传聊天室 ID；无需额外传入会话类型。不设置或传空字符串表示搜索全部可见会话。 |
| `setMsgTypes` | `ContentType \| ContentType[]` | 否 | 按消息类型过滤。支持 `TXT`、`IMAGE`、`VIDEO`、`LOCATION`、`FILE` 和 `COMBINE`；不支持 `CUSTOM`、`VOICE` 和 `CMD`。 |
| `setStartTime` | `number` | 否 | 设置开始时间，Unix 时间戳，单位为毫秒。需与 `setEndTime` 同时设置。 |
| `setEndTime` | `number` | 否 | 设置结束时间，Unix 时间戳，单位为毫秒。结束时间需与 `setStartTime` 同时设置，而且不应早于开始时间。 |
| `setSearchScope` | `MessageSearchScope` | 否 | 设置搜索范围：`CONTENT`（仅消息内容，默认）、`EXT`（仅消息扩展字段）或 `ALL`（消息内容和扩展字段）。 |

#### 返回结果

搜索结果由服务端按照相关性排序，支持分页查询，并返回与关键词匹配的高亮文本。

搜索成功后返回 `PageResult<SearchServerMessageResult>`：

| 方法 | 返回类型 | 描述 |
| :--- | :--- | :--- |
| `getResult()` / `getData()` | `Array<SearchServerMessageResult>` | 获取当前页的搜索结果列表。两个方法返回相同的结果。 |
| `getCount()` / `getPageCount()` | `number` | 获取符合搜索条件的结果总数。两个方法返回相同的值；可结合 `pageNum`、`pageSize` 和该总数判断是否还有下一页。 |

`SearchServerMessageResult` 为搜索摘要对象，不是完整的 `ChatMessage`。你可以从结果对象中获取消息 ID、消息体、扩展字段、发送方、接收方、会话 ID、会话类型、消息时间戳以及服务端返回的高亮文本列表。

`SearchServerMessageResult` 提供以下结果读取方法：

| 方法 | 返回类型 | 描述 |
| :--- | :--- | :--- |
| `getMessageId()` | `string` | 获取消息 ID。 |
| `getBody()` | `ChatMessageBody \| undefined` | 获取消息体，可根据实际消息类型转换为 `TextMessageBody`、`ImageMessageBody` 等具体类型。 |
| `getExt()` | `Map<string, MessageExtType>` | 获取消息扩展属性。 |
| `getFrom()` | `string` | 获取消息发送方。 |
| `getTo()` | `string` | 获取消息接收方。 |
| `getConversationId()` | `string` | 获取会话 ID。 |
| `getChatType()` | `ChatType` | 获取会话类型。可能为 `Chat`、`GroupChat` 或 `ChatRoom`。 |
| `getTimestamp()` | `number` | 获取消息时间戳，单位为毫秒。 |
| `getHighlightTexts()` | `string[]` | 获取服务端返回的搜索高亮文本列表。该列表可能为空。 |

## 常见搜索场景

#### 搜索指定会话的消息

如果需要搜索指定会话中的消息，只需调用 `setConversationId` 设置会话 ID：

```typescript
let option = new MessageSearchOption();
option.setKeywordList('订单');
option.setConversationId('userId');
let result = await ChatClient.getInstance().chatManager()?.searchMessagesFromServer(option);
```

#### 使用多个关键词搜索

如果需要搜索多个关键词，可通过 `KeywordListMatchType` 指定匹配方式。

```typescript
let option = new MessageSearchOption();
// 关键词列表最多包含 5 个关键词；每个关键词长度为 1-120 个字符；所有关键词总长度不超过 120 个字符。
option.setKeywordList(['会议', '明天']);
option.setKeywordMatchType(KeywordListMatchType.AND);
let result = await ChatClient.getInstance().chatManager()?.searchMessagesFromServer(option);
```

#### 按消息类型搜索

若按消息类型搜索，需要调用 `setMsgTypes` 设置消息类型：

```typescript
let option = new MessageSearchOption();
option.setKeywordList(['图片']);
option.setMsgTypes([ContentType.TXT, ContentType.IMAGE, ContentType.FILE]);

ChatClient.getInstance().chatManager()?.searchMessagesFromServer(option, 20, 1)
  .then((result) => {
    let messages = result.getData();
  })
  .catch((error: ChatError) => {
    // 根据 error.errorCode 和 error.description 处理搜索失败。
  });
```

#### 搜索消息扩展字段

若仅搜索消息扩展字段，需要调用 `setSearchScope`，将搜索范围设置为 `MessageSearchScope.EXT`：

```typescript
let option = new MessageSearchOption();
option.setKeywordList(['order-10001']);

// EXT 表示仅搜索消息扩展字段。
option.setSearchScope(MessageSearchScope.EXT);

ChatClient.getInstance().chatManager()?.searchMessagesFromServer(option, 20, 1)
  .then((result) => {
    let messages = result.getData();
  })
  .catch((error: ChatError) => {
    // 根据 error.errorCode 和 error.description 处理搜索失败。
  });
```

搜索范围还支持以下取值：

- `CONTENT`：仅搜索消息内容，默认值。
- `EXT`：仅搜索消息扩展字段。
- `ALL`：同时搜索消息内容和消息扩展字段。

#### 按时间范围搜索

若按时间范围搜索，需要分别调用 `setStartTime` 和 `setEndTime` 设置开始时间和结束时间。

开始时间和结束时间使用 Unix 时间戳，单位为毫秒。两个时间必须同时设置，且结束时间不能早于开始时间。

```typescript
let option = new MessageSearchOption();
option.setKeywordList(['hello']);

// 开始时间和结束时间必须同时设置，单位为毫秒。
option.setStartTime(1700000000000);
option.setEndTime(1700100000000);

ChatClient.getInstance().chatManager()?.searchMessagesFromServer(option, 20, 1)
  .then((result) => {
    let messages = result.getData();
  })
  .catch((error: ChatError) => {
    // 根据 error.errorCode 和 error.description 处理搜索失败。
  });
```

## 注意事项

- 消息搜索仅返回当前用户有权访问的会话中的消息，并且消息必须仍在服务端保存期限内。
- 服务未开通时会返回服务未启用错误；参数错误、鉴权失败或服务端异常时，请根据 Promise 的 `ChatError` 处理。详见[错误码](/document/harmonyos/error.html)。
- `searchMessagesFromServer` 返回的是搜索摘要，不会自动将结果写入本地数据库；如需继续使用完整消息对象，请根据结果中的消息 ID 和会话信息调用相应的消息获取接口。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`searchMessagesFromServer`](#调用方法) | `ChatManager` | 根据搜索条件从服务端分页搜索历史消息。 |
| [`setKeywordList`](#搜索参数) | `MessageSearchOption` | 设置搜索关键词。 |
| [`setKeywordMatchType`](#搜索参数) | `MessageSearchOption` | 设置多个关键词之间的匹配关系。 |
| [`setConversationId`](#搜索参数) | `MessageSearchOption` | 设置要搜索的会话 ID。 |
| [`setMsgTypes`](#搜索参数) | `MessageSearchOption` | 设置消息类型过滤条件。 |
| [`setStartTime`](#搜索参数) / [`setEndTime`](#搜索参数) | `MessageSearchOption` | 设置搜索时间范围。 |
| [`setSearchScope`](#搜索参数) | `MessageSearchOption` | 设置搜索消息内容、扩展字段或二者。 |
| [`getResult`](#返回结果) / [`getData`](#返回结果) | `PageResult` | 获取当前页搜索结果。 |
| [`getMessageId`](#返回结果) / [`getBody`](#返回结果) | `SearchServerMessageResult` | 获取消息 ID 和消息体。 |
| [`getHighlightTexts`](#返回结果) | `SearchServerMessageResult` | 获取高亮文本。 |
