# 编辑消息

## 功能说明

环信即时通讯 IM 提供消息编辑功能。用户可以修改已发送成功的消息，服务端和本地存储的消息将同步更新，无需重新发送一条消息。

### 支持范围

该功能适用于单聊、群聊和聊天室，支持范围如下：

- 文本消息和自定义消息：支持修改消息体 `body` 和扩展字段。React Native 的编辑接口参数名为 `ext`，消息对象中的扩展字段为 `attributes`。
- 文件、视频、语音、图片、位置和合并消息：仅支持修改扩展字段，不支持修改消息体。
- 透传消息：不支持编辑。

### 消息编辑流程

1. 应用调用消息编辑 API，传入消息 ID、修改后的消息体和/或扩展字段。
2. SDK 将编辑请求发送至服务端，服务端完成更新后向 SDK 返回编辑后的消息。
3. SDK 更新本地对应消息，并通过 Promise 返回更新后的 `ChatMessage`。
4. 消息所属会话的其他成员收到消息编辑事件后，可通过消息编辑事件获取更新后的消息，并刷新业务界面。

### 各类会话的消息编辑权限

- 单聊：只有消息发送方可以编辑。
- 群聊和聊天室：普通成员只能编辑自己发送的消息；群主、聊天室所有者和管理员还可以编辑普通成员发送的消息。这种情况下，消息的原发送方不变，消息体中的编辑者用户 ID 为群主、聊天室所有者或管理员的用户 ID。

### 消息编辑后的生命周期

编辑消息没有时间限制，即只要这条消息仍在服务端存储就可以编辑。消息编辑后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）编辑了消息，编辑成功后该消息还可以在服务器上保存 180 天。

## 功能开通

若使用该功能，**需联系环信商务开通**。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录、连接服务器，详见 [快速开始](quickstart.html) 和 [初始化](initialization.html)。
- 已联系环信商务开通消息编辑功能。
- 已了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。

## 编辑消息

调用 `ChatManager#modifyMsgBody({ msgId, body, ext })`，返回 `Promise<ChatMessage>`。编辑成功后消息 ID 不变，消息体可包含最后编辑者、编辑时间和累计编辑次数；除消息体和扩展字段外，发送方、接收方等信息保持不变。

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `msgId` | `string` | 是 | 已发送成功且仍保存在服务端的消息 ID。 |
| `body` | `ChatMessageBody` | 否 | 新消息体，仅文本或自定义消息支持；不传表示保留原消息体。 |
| `ext` | `Record<string, any>` | 否 | 新扩展字段，覆盖原有全部扩展字段；不传表示保留原扩展字段。 |

`body` 和 `ext` 至少提供一项。扩展字段应使用可序列化的 JSON 数据；如需保留原业务字段，应先与原消息的 `attributes` 合并再传入。

:::tip
一条消息默认最多可编辑 10 次。
:::

以下三个函数分别演示不同消息类型的编辑方式：

```typescript
const manager = ChatClient.getInstance().chatManager;

// 文本消息：同时修改消息体和扩展字段
async function editTextMessage(message: ChatMessage): Promise<void> {
  try {
    const updated = await manager.modifyMsgBody({
      msgId: message.msgId,
      body: new ChatTextMessageBody({ content: '更新后的文本' }),
      ext: { ...message.attributes, businessStatus: 'updated' },
    });
    console.log('文本消息已更新：', updated.msgId);
  } catch (error: unknown) {
    console.error('编辑文本消息失败：', error);
  }
}

// 自定义消息：同时修改消息体和扩展字段
async function editCustomMessage(message: ChatMessage): Promise<void> {
  try {
    const updated = await manager.modifyMsgBody({
      msgId: message.msgId,
      body: new ChatCustomMessageBody({
        event: 'order_updated',
        params: { orderStatus: 'completed' },
      }),
      ext: { ...message.attributes, businessStatus: 'updated' },
    });
    console.log('自定义消息已更新：', updated.msgId);
  } catch (error: unknown) {
    console.error('编辑自定义消息失败：', error);
  }
}

// 图片、语音、视频、文件、位置和合并消息：只修改扩展字段
async function editMessageAttributes(message: ChatMessage): Promise<void> {
  try {
    const updated = await manager.modifyMsgBody({
      msgId: message.msgId,
      ext: { ...message.attributes, businessStatus: 'updated' },
    });
    console.log('扩展字段已更新：', updated.attributes);
  } catch (error: unknown) {
    console.error('编辑消息扩展字段失败：', error);
  }
}
```

消息接收方及当前账号的其他在线设备可通过 `ChatMessageEventListener#onMessageContentChanged` 接收更新通知，回调携带更新后的消息、最后一次编辑者用户 ID 和编辑时间。群聊和聊天室中的其他相关成员也通过该事件更新界面。

:::tip
通过 [RESTful API 编辑自定义消息](/document/server-side/message_modify.html) 时，接收方同样通过 `onMessageContentChanged` 获取编辑后的消息。
:::

消息体提供以下可选属性：

| 属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `lastModifyOperatorId` | `string \| undefined` | 最后编辑者用户 ID。 |
| `lastModifyTime` | `number \| undefined` | 最后编辑时间，Unix 时间戳，单位为毫秒。 |
| `modifyCount` | `number \| undefined` | 累计编辑次数。 |

注册监听器的示例如下：

```typescript
const manager = ChatClient.getInstance().chatManager;
const listener: ChatMessageEventListener = {
  onMessageContentChanged: (message, lastModifyOperatorId, lastModifyTime) => {
    console.log('消息已编辑：', message.msgId);
    console.log('编辑者和时间：', lastModifyOperatorId, lastModifyTime);
    console.log('累计编辑次数：', message.body.modifyCount);
    console.log('更新后的扩展字段：', message.attributes);
    // 使用回调中的新消息对象替换界面中的旧消息
  },
};
manager.addMessageListener(listener);

// 页面或组件销毁、不再需要监听时执行
// manager.removeMessageListener(listener);
```

编辑失败时应检查功能是否开通、消息是否仍在服务端、账号权限、消息类型及编辑次数限制，不要通过本地 `updateMessage` 冒充服务端编辑成功。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`modifyMsgBody`](#编辑消息-1) | `ChatManager` | 编辑服务端和本地消息，返回更新后的消息。 |
| [`onMessageContentChanged`](#编辑消息-1) | `ChatMessageEventListener` | 接收消息编辑事件。 |
| [`lastModifyOperatorId`](#编辑消息-1) / [`lastModifyTime`](#编辑消息-1) / [`modifyCount`](#编辑消息-1) | `ChatMessageBody` | 读取消息编辑信息。 |
| [`attributes`](#编辑消息-1) | `ChatMessage` | 读取更新后的消息扩展字段。 |

