# 使用消息扩展字段设置推送通知显示内容

## 通过消息扩展字段设置推送通知显示内容

发送消息时，可以通过固定消息扩展字段 `em_push_ext` 设置自定义推送展示内容。在 React Native 中，通过 `ChatMessage.attributes` 设置消息扩展，`em_push_ext` 的值为可 JSON 序列化的对象，其中使用 `title` 和 `content` 分别设置推送标题和推送内容。

完成 SDK 初始化并成功登录后，在发送消息前设置上述字段。下面以单聊文本消息为例，图片等附件消息的推送扩展设置方法相同。

```typescript
async function sendMessageWithPushContent(toChatUsername: string): Promise<void> {
  // 创建文本消息并设置消息体；单聊时 targetId 为对端用户 ID
  const message = ChatMessage.createTextMessage(
    toChatUsername,
    'message content',
    ChatMessageChatType.PeerChat
  );

  // 获取或创建推送扩展对象，保留已有的其他推送配置
  const pushExt: Record<string, unknown> = {
    ...(message.attributes.em_push_ext ?? {}),
  };
  // 固定字段 title：自定义推送标题，字段名不可修改
  pushExt.title = 'custom push title';
  // 固定字段 content：自定义推送内容，字段名不可修改
  pushExt.content = 'custom push content';

  // 将推送扩展设置到消息中，并保留已有的其他消息扩展
  message.attributes = {
    ...message.attributes,
    em_push_ext: pushExt,
  };

  const callback: ChatMessageStatusCallback = {
    onSuccess(sentMessage) {
      // 消息最终发送成功；使用回调返回的消息读取服务端消息 ID
      console.log('消息发送成功：', sentMessage.msgId);
    },
    onError(localMsgId, error) {
      // 消息最终发送失败，根据错误码和错误信息处理
      console.error('消息发送失败：', localMsgId, error.code, error.description);
    },
    onProgress(localMsgId, progress) {
      // 附件上传进度；文本消息通常没有上传进度回调
      console.log('附件上传进度：', localMsgId, progress);
    },
  };

  try {
    // 提交发送任务；await 返回不代表消息最终发送成功
    await ChatClient.getInstance().chatManager.sendMessage(message, callback);
  } catch (error: unknown) {
    // 处理提交发送任务时的异常
    console.error('提交发送任务失败：', error);
  }
}
```

`ChatManager#sendMessage` 返回 `Promise<void>`，`callback` 为可选参数。示例通过传入的 `ChatMessageStatusCallback` 获取当前消息的最终发送结果和附件上传进度，无需另行注册全局消息状态监听。

消息发送成功不代表离线推送已送达设备。推送还需满足设备 Token 绑定、离线推送策略等条件，详见 [离线推送概述](push_overview.html)。

`attributes` 对应服务端消息 JSON 的 `ext`。直接设置 `attributes.em_push_ext` 即可，不要再在 `attributes` 中嵌套一层 `ext`，也不要将 `em_push_ext` 的值转换成 JSON 字符串。若原消息已包含 `em_push_ext` 中的其他字段，应合并该对象后再更新 `title`、`content`，避免覆盖已有配置。

示例中的参数和扩展字段说明如下：

| 参数 | 描述 |
| :--- | :--- |
| `toChatUsername` | 单聊消息接收方的用户 ID，对应 `ChatMessage#createTextMessage` 的 `targetId`。群聊或聊天室场景应传入对应的群组或聊天室 ID，并分别设置 `chatType` 为 `ChatMessageChatType.GroupChat` 或 `ChatMessageChatType.ChatRoom`；会话类型设置不代表该场景一定支持离线推送，聊天室不支持离线推送。 |
| `em_push_ext` | 用于自定义推送展示内容的固定消息扩展字段，值为可 JSON 序列化的对象。字段名不可修改。 |
| `title` | `em_push_ext` 中用于设置自定义推送标题的固定 Key，值为 `string`。 |
| `content` | `em_push_ext` 中用于设置自定义推送内容的固定 Key，值为 `string`。 |

## 接口列表

本文涉及的接口及属性如下：

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextMessage`](#使用消息扩展字段设置推送通知显示内容) | `ChatMessage` | 创建文本消息，同时设置接收方、消息体和会话类型；会话类型默认值为 `ChatMessageChatType.PeerChat`。 |
| [`attributes`](#使用消息扩展字段设置推送通知显示内容) | `ChatMessage` | 消息扩展字段，类型为 `Record<string, any>`。 |
| [`sendMessage`](#使用消息扩展字段设置推送通知显示内容) | `ChatManager` | 提交发送消息任务，返回 `Promise<void>`；可传入 `ChatMessageStatusCallback` 获取消息状态。 |
| [`onSuccess`](#使用消息扩展字段设置推送通知显示内容) | `ChatMessageStatusCallback` | 消息发送成功回调，参数为发送成功后的消息对象。 |
| [`onError`](#使用消息扩展字段设置推送通知显示内容) | `ChatMessageStatusCallback` | 消息发送失败回调，参数为本地消息标识和 `ChatError`。 |
| [`onProgress`](#使用消息扩展字段设置推送通知显示内容) | `ChatMessageStatusCallback` | 可选的附件上传进度回调，参数为本地消息标识和进度，进度范围为 0–100。 |
