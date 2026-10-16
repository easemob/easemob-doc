# 群组 @ 消息

群组 @ 消息指在群组聊天中，用户可以 @ 单个、多个或所有成员并发送消息。群组中的每个成员均可使用 @ 功能，也可以 @ 群内所有成员。

:::tip
目前，该功能只支持文本消息和表情。表情作为文本消息内容的一部分发送。
:::

例如，该功能的 UI 实现如下图所示：

1. 在输入框输入“@”字符后，选择要 @ 的群成员。
2. 选择群成员后返回聊天页面，编辑并发送消息。
3. 当前用户被 @ 时，在会话列表或消息页面显示相应提示，例如“Somebody@You”。
4. 用户进入会话页面查看消息。

UI 实现示例图如下：

![img](/images/product/solution_common/group_mention/group_@_mobile.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

群组 @ 消息的发送方式与普通群消息相同。发送方通过消息扩展字段 `em_at_list` 指定被 @ 的群成员；SDK 不会自动生成 @ 提示或处理相关 UI，应用需要自行解析该字段并展示。

实现流程如下：

1. 发送方创建群消息后，将被 @ 成员的用户 ID 写入扩展字段 `em_at_list`，然后发送消息。
2. 接收方通过 `ChatMessageListener#onMessageReceived` 接收消息，并调用 `ChatMessage#ext` 读取扩展字段。
3. 若 `em_at_list` 包含当前登录用户的用户 ID，或该字段值为 `ALL`，应用可在 UI 中显示 @ 提示；否则按普通群消息处理。

`em_at_list` 的数据格式如下：

- @ 单个或多个群成员：值为用户 ID 数组，例如 `['user1', 'user2']`。
- @ 群内所有成员：值为字符串 `ALL`。

HarmonyOS SDK 的扩展字段使用 `Map<string, MessageExtType>` 表示。数组属于 `object` 类型，调用 `ChatMessage#setExt` 时由 SDK 序列化，接收方调用 `ChatMessage#ext` 时会还原为数组对象。

:::tip
被 @ 成员的用户 ID 不包含“@”前缀。发送方与接收方应统一约定字段名、字段值类型以及 `ALL` 的含义。
:::

### 发送消息

发送方发送群组 @ 消息的示例代码如下：

```typescript
// 扩展字段中填写被 @ 成员的用户 ID，不要添加“@”前缀。
let atUserList: string[] = ['user1', 'user2'];

// 第一个参数为群组 ID，第二个参数为文本内容。
let message: ChatMessage | undefined = ChatMessage.createTextSendMessage(
  groupId,
  '@user1 @user2 你好'
);
if (!message) {
  return;
}

// 群组 @ 消息必须设置为群聊类型。
message.setChatType(ChatType.GroupChat);

let ext: Map<string, MessageExtType> = new Map<string, MessageExtType>();
// @ 单个或多个成员时，将用户 ID 数组写入 em_at_list。
ext.set('em_at_list', atUserList);
// @ 所有人时，将 em_at_list 的值设置为字符串 'ALL'：
// ext.set('em_at_list', 'ALL');
message.setExt(ext);

// 发送群组消息。
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

### 接收消息

接收方收到消息后，可调用 `ChatMessage#ext` 读取 `em_at_list`，并根据字段值的类型判断消息是否 @ 了当前用户：

```typescript
function isCurrentUserMentioned(message: ChatMessage): boolean {
  let atValue: MessageExtType | undefined = message.ext().get('em_at_list');

  // 字符串 'ALL' 表示 @ 所有人，比较时忽略大小写。
  if (typeof atValue === 'string') {
    return atValue.toUpperCase() === 'ALL';
  }

  // @ 单个或多个成员时，em_at_list 为用户 ID 数组。
  if (typeof atValue === 'object' && atValue instanceof Array) {
    let currentUser: string = ChatClient.getInstance().getCurrentUser();
    let atUserList: string[] = atValue as string[];
    return atUserList.includes(currentUser);
  }

  // 扩展字段不存在或格式不正确，按普通群消息处理。
  return false;
}

let messageListener: ChatMessageListener = {
  onMessageReceived: (messages: Array<ChatMessage>): void => {
    messages.forEach((message: ChatMessage): void => {
      // 仅解析群聊文本消息中的 @ 扩展字段。
      if (message.getChatType() !== ChatType.GroupChat
        || message.getType() !== ContentType.TXT) {
        return;
      }

      if (isCurrentUserMentioned(message)) {
        // 消息 @ 了当前用户或群内所有成员，在会话列表或消息页面显示 @ 提示。
      }
    });
  }
};
```

创建监听器后，调用 `ChatManager#addMessageListener` 注册监听器；页面或组件销毁且不再需要监听时，通过 `removeMessageListener` 移除同一个监听器实例：

```typescript
// 注册保存为成员变量的消息监听器，接收新消息事件。
ChatClient.getInstance().chatManager()?.addMessageListener(messageListener);

// 页面或组件销毁且不再需要监听时，移除同一个监听器实例。
ChatClient.getInstance().chatManager()?.removeMessageListener(messageListener);
```

## 常见问题

1. Q：@ 群所有人时为何没有显示 @ 提示？

   A：请检查 `em_at_list` 的值是否为字符串 `ALL`。由于 @ 功能由应用通过消息扩展实现，字段名、字段值类型或拼写不一致不会导致普通消息发送失败，但会导致接收方无法正确识别 @ 状态。比较时可忽略大小写。

2. Q：@ 多个成员与 @ 所有成员有什么区别？

   A：设置消息扩展字段时，若 @ 单个或多个群成员，`em_at_list` 的值为这些成员的用户 ID 数组；若 @ 所有人，字段值为字符串 `ALL`。

3. Q：SDK 是否会自动显示“有人 @ 我”提示？

   A：不会。SDK 负责传输消息及其扩展字段。应用需要在 `ChatMessageListener#onMessageReceived` 事件中读取 `ChatMessage` 的扩展字段，并自行更新会话列表或消息页面的 UI。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#发送消息) | `ChatMessage` | 创建待发送的文本消息。 |
| [`setChatType`](#发送消息) | `ChatMessage` | 将消息设置为群聊类型。 |
| [`setExt`](#发送消息) / [`ext`](#接收消息) | `ChatMessage` | 设置或获取消息扩展字段。 |
| [`sendMessage`](#发送消息) | `ChatManager` | 发送群组消息。 |
| [`getCurrentUser`](#接收消息) | `ChatClient` | 获取当前登录用户的用户 ID。 |
| [`addMessageListener`](#接收消息) / [`removeMessageListener`](#接收消息) | `ChatManager` | 注册或移除消息监听器。 |
