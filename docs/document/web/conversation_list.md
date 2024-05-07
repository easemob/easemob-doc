# 会话列表

<Toc />

对于单聊和群组聊天会话，用户发消息时 SDK 会自动创建会话并将会话添加至用户的会话列表。

**服务器默认存储 100 条会话，若提升该上限，需联系环信商务。**如果你的会话条数超过了上限，新会话会覆盖之前的不活跃会话。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器获取会话列表，主要方法如下：

`getServerConversations`：从服务器分页获取会话列表。

## 实现方法

### 从服务器分页获取会话列表

你可以调用 `getServerConversations` 方法从服务端分页获取会话列表，包含单聊和群组聊天会话，不包含聊天室会话。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表。

:::tip
1. **若使用该功能，需在环信控制台开通，并将 SDK 升级至 4.1.7 或以上版本。而且，只有开通该功能，你才能使用置顶会话和会话标记功能。**
2. 登录用户的 ID 大小写混用会导致拉取会话列表时提示会话列表为空，因此建议用户 ID 使用小写字母。
3. 服务端会话列表的更新存在延时，建议你仅在登录时调用该方法。
4. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

示例代码如下：

```javascript
// pageSize: 每页期望获取的会话数量。取值范围为 [1,50]，默认为 `20`。
// cursor：开始获取数据的游标位置。若传空字符串（''），SDK 从最新活跃的会话开始获取。
connection.getServerConversations({pageSize:50, cursor: ''}).then((res)=>{
    console.log(res)
})
```
该方法的返回数据包含 `conversations` 和 `cursor` 参数：

- conversations: 会话列表。`conversations` 为 `ConversationItem[]` 类型，`ConversationItem` 包含如下属性：

| 属性名称 | 描述 |
| :--------- | :----- |
| `conversationId`  | 会话 ID。 |
| `conversationType` | 会话类型。|
| `isPinned` | 是否置顶：<br/> - `true`：置顶；<br/> - `false`：不置顶。 |
| `pinnedTime`| 会话置顶的 UNIX 时间戳，单位为毫秒。未置顶时值为 `0` |
| `lastMessage` | 最新一条消息概况。 |
| `unReadCount` | 未读消息数。 |
| `marks` | 会话标记。|

- cursor: 下次查询数据的游标位置。若 SDK 返回的数据条数小于请求中设置的数目，`cursor` 的值为空字符串（''），表示当前为最后一页数据。否则，SDK 返回具体的游标位置，指定开始获取数据的位置。