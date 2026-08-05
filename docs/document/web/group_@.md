# 群组 @ 消息

## 功能说明

群组 @ 消息用于在群聊中提醒指定群成员或全体群成员。发送群消息时，发送方可以在消息扩展字段中携带 @ 信息；接收方收到消息后，可以根据消息扩展字段判断该消息是否 @ 了当前用户或 @ 了全体成员。

:::tip
群组 @ 消息通常用于群聊文本消息场景，表情可作为文本消息内容的一部分发送。
:::

例如，该功能的 UI 实现如下图所示：

1. 在输入框输入 `@` 字符后，选择要 @ 的群成员。
2. 选择群成员后，返回聊天界面，继续编辑消息并发送。
3. 若收到 @ 当前用户的消息，会话列表中可展示相应提醒，例如 “Somebody@You”。
4. 打开会话页面，查看对应消息。

UI 实现示例图如下所示：

![img](/images/product/solution_common/group_mention/group_@_web.png)

## 前提条件

使用群组 @ 消息前，需完成以下准备工作：

- 完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 当前用户已加入目标群组。
- 若需要 @ 指定群成员，需获取被 @ 成员的用户 ID。

## 实现过程

在群组中，发送 @ 消息的流程与发送普通群消息基本一致，区别在于发送方需要在消息扩展字段中携带被 @ 用户的用户 ID。群组成员收到消息后，可根据该扩展字段判断当前用户是否被 @，并在 UI 上展示相应提示。

发送 @ 消息通过以下步骤实现：

1. 发送方将被 @ 用户的用户 ID 添加到消息扩展字段中，并将消息发送到群组。
2. 群组成员收到消息后，检查消息中是否存在对应扩展字段；若存在，继续判断当前登录用户的用户 ID 是否包含在该扩展字段中。
3. 若包含，表示当前用户被 @，可在 UI 上展示相应提示，例如 “[Somebody@You]”；若不包含，表示当前用户未被 @，无需做特殊展示。

SDK 通过消息扩展字段 `ext.em_at_list` 标识群组 @ 信息。`em_at_list` 的取值规则如下：

| 取值 | 类型 | 描述 |
| :--- | :--- | :--- |
| `["userId1", "userId2"]` | String[] | @ 一个或多个指定群成员。数组元素为被 @ 用户的用户 ID。 |
| `"all"` | String | @ 全体群成员。 |

:::tip
群组 @ 消息仅适用于群聊消息，即 `conversationType` 为 `groupChat` 的消息。
:::

### 发送群组 @ 消息

你可以在创建群聊消息时，通过消息扩展字段 `ext.em_at_list` 设置 @ 信息，然后调用 `client.chatManager.sendMessage` 发送消息。

#### @ 指定群成员

示例代码如下：

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'groupId',
  conversationType: 'groupChat',
  content: '@user1 @user2 请查看这条消息',
  ext: {
    em_at_list: ['user1', 'user2'],
  },
});

await client.chatManager.sendMessage(message);
```

#### @ 全体群成员

示例代码如下：

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'groupId',
  conversationType: 'groupChat',
  content: '@所有人 请查看这条消息',
  ext: {
    em_at_list: 'all',
  },
});

await client.chatManager.sendMessage(message);
```

参数说明如下：

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | String | 群组 ID。 |
| `conversationType` | String | 会话类型。群组 @ 消息需设置为 `groupChat`。 |
| `content` | String | 文本消息内容。消息内容中的 @ 文案用于客户端展示，实际 @ 关系以 `ext.em_at_list` 为准。 |
| `ext.em_at_list` | String[] \| String | 群组 @ 信息。传入用户 ID 数组表示 @ 指定成员；传入 `all` 表示 @ 全体群成员。 |

### 接收群组 @ 消息

收到群聊消息后，可以从消息对象的 `ext.em_at_list` 字段中读取 @ 信息，并判断该消息是否 @ 了当前用户。

示例代码如下：

```typescript
client.addEventHandler('group-at-message', {
  onTextMessage: message => {
    if (message.conversationType !== 'groupChat') {
      return;
    }

    const atList = message.ext?.em_at_list;
    const currentUserId = client.user;

    if (atList === 'all') {
      console.log('收到 @ 全体成员的群消息：', message);
      return;
    }

    if (Array.isArray(atList) && atList.includes(currentUserId)) {
      console.log('收到 @ 当前用户的群消息：', message);
    }
  },
});
```

客户端可根据业务需要，在会话列表或消息列表中展示“有人 @ 我”“@ 所有人”等提示。

### 与离线推送的关系

若接收方的会话 [推送通知方式](/document/web/push/push_notification_mode_dnd.html#推送通知方式) 设置为 `AT`（仅接收 @ 消息通知），服务端会根据消息扩展字段 `ext.em_at_list` 判断该群消息是否需要触发离线推送。因此，发送群组 @ 消息时，需正确设置 `em_at_list` 字段。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextMessage`](#发送群组-消息) | `ChatManager` | 创建文本消息，并通过 `ext.em_at_list` 设置群组 @ 信息。 |
| [`sendMessage`](#发送群组-消息) | `ChatManager` | 发送携带群组 @ 信息的群聊消息。 |
