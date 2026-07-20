# 搜索服务端消息

## 功能说明

服务端消息搜索用于按关键词从服务端搜索当前用户可见的历史消息，适用于全局消息搜索、会话内搜索、按消息类型过滤搜索以及按时间范围检索消息等场景。

Web SDK 提供 `WebIM.conn.contact.searchMessages` 方法进行服务端消息搜索。该接口支持以下功能：

- 支持使用一个或多个关键词搜索历史消息，并设置多关键词匹配关系。
- 支持按指定会话、消息类型和消息发送时间范围筛选结果。
- 支持搜索消息内容、消息扩展字段（`ext`）或同时搜索两者。
- 搜索范围仅限于当前用户参与且有权访问的会话。
- 搜索结果按照相关性排序，支持分页查询和关键词高亮。

## 功能开通

要使用服务端消息搜索功能，需 **联系环信商务开通**。

**关于扩展字段搜索**： 开通消息搜索服务后，消息扩展字段（`ext`）搜索默认不开启。如需使用该功能，可在开通时一并说明，或后续联系商务单独开通。

:::tip
目前，仅国内二区集群支持该功能。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 Web SDK v4.24.1 或以上版本的 [初始化](initialization.html) 并 [登录](login.html) 成功。
- 当前应用已开通消息搜索服务。
- 已了解消息搜索服务的使用限制和接口调用频率限制，详见 [使用限制](/product/limitation.html)。

## 搜索服务端消息

### 调用方法

你可以创建 `MessageSearchOption` 对象设置搜索条件，然后调用 `WebIM.conn.contact.searchMessages` 从服务端搜索历史消息。

#### 搜索条件和内容

服务端消息搜索支持以下搜索条件和内容：

| 搜索维度 | 支持能力 | 设置参数 |
| :--- | :--- | :--- |
| 关键词 | 支持使用一个或多个关键词搜索历史消息，并可设置匹配任一关键词或匹配全部关键词。 | `keywordList`、`keywordListMatchType` |
| 会话 | 支持搜索全部会话，也可以指定单聊、群聊或聊天室会话。单聊传对方用户 ID，群聊或聊天室传对应的群组 ID 或聊天室 ID。Web SDK 指定会话时必须同时传入会话类型。 | `conversationId`、`conversationType` |
| 消息类型 | 支持搜索文本、图片、视频、位置、文件和合并消息，不支持搜索自定义消息、语音消息和透传消息。 | `msgTypes` |
| 时间范围 | 支持按消息发送时间范围搜索。开始时间和结束时间必须同时设置。 | `startTime`、`endTime` |
| 搜索内容 | 支持仅搜索消息内容、搜索消息内容和消息扩展字段（`ext`），或仅搜索消息扩展字段。消息内容包括文本消息内容以及自动翻译后的文本内容。 | `searchScope` |

#### 消息可见范围

服务端消息搜索仅返回当前用户参与且有权访问的会话中的消息：

- 单聊可返回当前用户作为发送方或接收方的消息。
- 搜索群聊或聊天室消息时，需指定对应的群组 ID 或聊天室 ID，并通过服务端成员身份校验。
- 当前用户已单方面删除的消息不会出现在搜索结果中。

#### 示例代码

```typescript
import WebIM from 'easemob-websdk';
import type { EasemobChat } from 'easemob-websdk/Easemob-chat';

const option: EasemobChat.MessageSearchOption = {
  // 设置关键词列表。
  keywordList: ['hello'],

  // 多关键词之间默认使用 or 关系。
  keywordListMatchType: 'or',

  // 可选。指定会话搜索时，conversationId 和 conversationType 必须同时传入。
  // 单聊传对方用户 ID，群聊传群组 ID，聊天室传聊天室 ID。
  conversationId: 'groupId',
  conversationType: 'groupChat',

  // 可选。服务端消息搜索不支持语音消息和透传消息。
  msgTypes: ['txt', 'img'],

  // 可选。起止时间必须同时设置，单位为毫秒。
  startTime: 1700000000000,
  endTime: 1700100000000,

  // 可选。默认仅搜索消息内容。
  searchScope: 'with',
};

try {
  const result = await WebIM.conn.contact.searchMessages({
    option,
    // 当前页码，从 1 开始。
    pageNum: 1,
    // 每页返回的结果数量，取值范围为 1-100，默认值为 20。
    pageSize: 20,
  });

  const { messages, totalPages, isLast } = result;

  messages.forEach((message) => {
    const messageId = message.id;
    const messageType = message.type;
    const conversationId = message.conversationId;
    const highlightTexts = message.highlight || [];
    const summaryText = message.text;
  });
} catch (error) {
  // 处理搜索失败。
  console.log('searchMessages error', error);
}
```

#### 搜索参数

`MessageSearchOption` 参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| --- | --- | --- | --- |
| `keywordList` | `string[]` | 是 | 设置关键词列表。SDK 会去除关键词首尾空白并过滤空字符串，最多设置 5 个关键词。 |
| `keywordListMatchType` | `'or' \| 'and'` | 否 | 设置多关键词匹配关系。`or` 表示匹配任一关键词，`and` 表示同时匹配全部关键词。默认值为 `or`。 |
| `conversationId` | `string` | 否 | 设置会话 ID。单聊传对方用户 ID；群聊传群组 ID；聊天室传聊天室 ID。为空表示搜索所有会话。若传入该参数，必须同时传入 `conversationType`。 |
| `conversationType` | `'singleChat' \| 'groupChat' \| 'chatRoom'` | 否 | 设置会话类型。指定 `conversationId` 时必传。`singleChat` 表示单聊，`groupChat` 表示群聊，`chatRoom` 表示聊天室。 |
| `msgTypes` | `MessageType[]` | 否 | 设置消息类型过滤条件。可使用 `txt`、`img`、`video`、`loc`、`file` 和 `combine`。不支持 `custom`、`audio`、`cmd`、`read`、`delivery`、`channel` 等类型。 |
| `startTime` | `number` | 否 | 设置查询开始时间，Unix 时间戳，单位为毫秒。需与 `endTime` 同时设置。 |
| `endTime` | `number` | 否 | 设置查询结束时间，Unix 时间戳，单位为毫秒。需与 `startTime` 同时设置，而且不能早于 `startTime`。 |
| `searchScope` | `'none' \| 'with' \| 'only'` | 否 | 设置搜索范围。`none` 表示仅搜索消息内容，`with` 表示搜索消息内容和扩展字段，`only` 表示仅搜索扩展字段。默认值为 `none`。 |

#### 返回结果

搜索结果由服务端按照相关性排序，支持分页查询，并返回与关键词匹配的高亮文本。

搜索成功后，SDK 返回 `Promise<ServerSearchMessagesResult>`：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `messages` | `ServerSearchMessage[]` | 当前页的搜索结果消息列表。 |
| `pageNum` | `number` | 当前页码。 |
| `pageSize` | `number` | 当前页请求的每页数量。 |
| `totalPages` | `number` | 服务端返回的总页数。若服务端未返回该字段，SDK 返回 `-1`。 |
| `isLast` | `boolean` | 当前页是否为最后一页。 |
| `requestId` | `string` | 服务端返回的请求追踪 ID。 |
| `timestamp` | `number` | 服务端响应时间戳，单位为毫秒。 |

`messages` 中的每一项为 `ServerSearchMessage`。该对象会被 SDK 映射为 Web SDK 消息结构，可按普通消息字段读取消息 ID、消息类型、发送方、接收方、会话类型、消息时间戳、消息体字段和扩展字段。

常用字段如下：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `id` | `string` | 消息 ID。 |
| `type` | `string` | 消息类型，例如 `txt`、`img`、`video`、`file`、`loc` 或 `combine`。 |
| `chatType` | `string` | 会话类型。可能为 `singleChat`、`groupChat` 或 `chatRoom`。 |
| `from` | `string` | 消息发送方。 |
| `to` | `string` | 消息接收方。 |
| `conversationId` | `string` | 消息所属会话 ID。 |
| `time` | `number` | 消息发送时间戳，单位为毫秒。 |
| `ext` | `Record<string, any>` | 消息扩展属性。 |
| `highlight` | `string[]` | 服务端返回的搜索高亮片段。该列表可能为空或不存在。 |
| `text` | `string` | 服务端返回的摘要文本。该字段可能不存在。 |
| `msg` | `string` | 文本消息内容。仅文本消息通常包含该字段。 |

不同消息类型还会包含对应的消息体字段。例如图片消息包含 `url`、`width`、`height`、`thumb` 等字段，文件消息包含 `url`、`filename`、`file_length` 等字段。

### 常见搜索场景

#### 搜索指定会话的消息

如果需要搜索指定会话中的消息，需要同时设置 `conversationId` 和 `conversationType`。

```typescript
const result = await WebIM.conn.contact.searchMessages({
  option: {
    keywordList: ['订单'],
    conversationId: 'userId',
    conversationType: 'singleChat',
  },
  pageNum: 1,
  pageSize: 20,
});

console.log(result.messages);
```

#### 使用多个关键词搜索

如果需要搜索多个关键词，可通过 `keywordListMatchType` 指定匹配方式。

```typescript
const result = await WebIM.conn.contact.searchMessages({
  option: {
    // 关键词列表最多包含 5 个关键词。
    keywordList: ['会议', '明天'],
    // and 表示结果需要同时命中全部关键词。
    keywordListMatchType: 'and',
  },
  pageNum: 1,
  pageSize: 20,
});

console.log(result.messages);
```

#### 按消息类型搜索

若按消息类型搜索，需要传入 `msgTypes` 字段：

```typescript
const result = await WebIM.conn.contact.searchMessages({
  option: {
    keywordList: ['图片'],
    msgTypes: ['txt', 'img', 'file'],
  },
});

console.log(result.messages);
```

#### 搜索消息扩展字段

若按消息扩展搜索，`searchScope` 需要传入 `only`：

```typescript
const result = await WebIM.conn.contact.searchMessages({
  option: {
    keywordList: ['order-10001'],
    // only 表示仅搜索消息 ext 字段。
    searchScope: 'only',
  },
});

console.log(result.messages);
```

#### 按时间范围搜索

若按消息类型搜索需要传入 `startTime` 和 `endTime` 字段。开始时间和结束时间使用 Unix 时间戳，单位为毫秒。两个时间必须同时设置，且结束时间不能早于开始时间。

```typescript
const result = await WebIM.conn.contact.searchMessages({
  option: {
    keywordList: ['hello'],
    startTime: 1700000000000,
    endTime: 1700100000000,
  },
});

console.log(result.messages);
```

## 注意事项

- 当前用户已单方面删除的消息不会出现在搜索结果中。
- 搜索服务需要单独开通。若未开通，服务端可能返回服务未开通错误，Web SDK 会映射为 `Code.SERVICE_NOT_ENABLED`（错误码 `505`）。
- 调用前需确保 SDK 已初始化并登录成功，否则 `searchMessages` 会直接返回连接状态相关错误。
- `conversationId` 和 `conversationType` 必须同时设置或同时不设置。仅设置其中一个会返回 `Code.REQUEST_PARAMETER_ERROR`（错误码 `-3`）。
- 参数错误会在请求发出前由 SDK 以 `Code.REQUEST_PARAMETER_ERROR`（错误码 `-3`）拒绝。
- 服务端鉴权失败、应用不存在、服务异常等错误会按照 Web SDK 统一错误处理逻辑返回。常见错误包括：`WEBIM_CONNCTION_AUTH_ERROR`(错误码 2)、`WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR`(错误码 28)、`WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR`(错误码 27)、`REST_PARAMS_STATUS`(错误码 700)、`SERVICE_NOT_ENABLED`(错误码 505)、`SERVER_BUSY`(错误码 500) 和 `SERVER_UNKNOWN_ERROR`(错误码 503) 等。详见 [错误码文档](error.html)。
