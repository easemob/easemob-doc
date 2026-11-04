# 设置推送扩展功能

你可以利用扩展字段实现自定义推送设置，本文以强制推送和发送静默消息为例介绍如何实现推送扩展功能。

对于推送扩展字段，详见 [离线推送扩展字段文档](/document/server-side/push_extension.html)。

以下示例以单聊文本消息为例，调用前需完成 SDK 初始化和登录；离线推送配置参见 [推送概述](push_overview.html)。`ChatManager#sendMessage` 返回的 Promise 完成表示发送任务已提交，最终发送结果通过 `ChatMessageStatusCallback` 通知。消息发送成功不代表离线推送通知已送达设备。

## 设置自定义推送字段

创建推送消息时，可以在消息中添加自定义字段，实现自定义推送设置。React Native SDK 通过 `ChatMessage.attributes` 设置消息扩展，`em_push_ext` 和其中的 `custom` 均使用可 JSON 序列化的对象，不要转换成 JSON 字符串。

```typescript
async function sendCustomPushMessage(toChatUsername: string): Promise<void> {
  // 下面以文本消息为例，图片、文件等消息的推送扩展设置方法相同
  // 创建消息并设置接收方和消息体；单聊时 targetId 为对端用户 ID
  const message = ChatMessage.createTextMessage(
    toChatUsername,
    'message content',
    ChatMessageChatType.PeerChat
  );

  // 获取或创建推送扩展对象，保留已有的其他推送配置
  const pushExt: Record<string, unknown> = {
    ...(message.attributes.em_push_ext ?? {}),
  };
  // 在固定字段 custom 中添加自定义推送字段
  pushExt.custom = {
    key1: 'value1',
    key2: 'value2',
  };
  // 将推送扩展设置到消息中，保留已有的其他消息扩展
  message.attributes = {
    ...message.attributes,
    em_push_ext: pushExt,
  };

  const callback: ChatMessageStatusCallback = {
    onSuccess(sentMessage) {
      // 消息最终发送成功
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
    // 提交发送任务；最终发送结果由上述消息状态回调通知
    await ChatClient.getInstance().chatManager.sendMessage(message, callback);
  } catch (error: unknown) {
    // 处理提交发送任务时的异常
    console.error('提交发送任务失败：', error);
  }
}
```

自定义字段的数据结构如下：

```json
{
    "em_push_ext": {
        "custom": {
            "key1": "value1",
            "key2": "value2"
        }
    }
}
```

上述字段说明如下：

| 参数 | 描述 |
| :--- | :--- |
| `em_push_ext` | 消息推送扩展的固定字段名，不可修改，值为对象。 |
| `custom` | `em_push_ext` 中用于添加自定义推送字段的固定字段名，值为对象。 |
| `key1`/`key2` | 自定义消息推送扩展的具体内容，可按业务需要设置字段名和值。 |

应用端解析自定义字段，可参考 [Android 解析收到的推送字段](/document/android/push/push_parsing.html) 和 [iOS 解析收到的推送字段](/document/ios/push/push_parsing.html)。

## 强制推送

设置强制推送后，用户发送消息时会忽略接收方的免打扰设置，不论是否处于免打扰时间段都会正常向接收方推送消息。

`em_force_notification` 为 `true` 时启用强制推送；未设置或为 `false` 时，按正常推送规则处理。强制推送仅绕过免打扰设置，不会替代设备 Token 绑定、系统通知权限等推送条件。

```typescript
async function sendForcePushMessage(toChatUsername: string): Promise<void> {
  // 下面以文本消息为例，图片、文件等消息的推送扩展设置方法相同
  // 创建消息并设置接收方和消息体；单聊时 targetId 为对端用户 ID
  const message = ChatMessage.createTextMessage(
    toChatUsername,
    'message content',
    ChatMessageChatType.PeerChat
  );

  // 设置内置扩展字段 em_force_notification，保留已有的其他消息扩展
  // true：强制推送；未设置或为 false：按正常推送规则处理
  message.attributes = {
    ...message.attributes,
    em_force_notification: true,
  };

  const callback: ChatMessageStatusCallback = {
    onSuccess(sentMessage) {
      // 消息最终发送成功
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
    // 提交发送任务；最终发送结果由上述消息状态回调通知
    await ChatClient.getInstance().chatManager.sendMessage(message, callback);
  } catch (error: unknown) {
    // 处理提交发送任务时的异常
    console.error('提交发送任务失败：', error);
  }
}
```

## 发送静默消息

发送静默消息指发送方在发送消息时设置不推送消息，即用户离线时，环信即时通讯 IM 服务不会通过第三方厂商的消息推送服务向该用户的设备推送消息通知。因此，用户不会收到消息推送通知。当用户再次上线时，仍可接收服务端保存的离线消息。

发送静默消息和免打扰模式下均为不推送消息，区别在于发送静默消息为发送方在发送消息时设置，而免打扰模式为接收方设置在指定时间段内不接收推送通知。

`em_ignore_notification` 为 `true` 时不发送离线推送通知；未设置或为 `false` 时，按正常推送规则处理。

```typescript
async function sendSilentMessage(toChatUsername: string): Promise<void> {
  // 下面以文本消息为例，图片、文件等消息的推送扩展设置方法相同
  // 创建消息并设置接收方和消息体；单聊时 targetId 为对端用户 ID
  const message = ChatMessage.createTextMessage(
    toChatUsername,
    'message content',
    ChatMessageChatType.PeerChat
  );

  // 设置内置扩展字段 em_ignore_notification，保留已有的其他消息扩展
  // true：不发送离线推送通知；未设置或为 false：按正常推送规则处理
  message.attributes = {
    ...message.attributes,
    em_ignore_notification: true,
  };

  const callback: ChatMessageStatusCallback = {
    onSuccess(sentMessage) {
      // 消息最终发送成功
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
    // 提交发送任务；最终发送结果由上述消息状态回调通知
    await ChatClient.getInstance().chatManager.sendMessage(message, callback);
  } catch (error: unknown) {
    // 处理提交发送任务时的异常
    console.error('提交发送任务失败：', error);
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`ChatMessage#createTextMessage`](#设置自定义推送字段) | `ChatMessage` | 创建文本消息，同时设置接收方、消息体和会话类型；会话类型默认为 `ChatMessageChatType.PeerChat`。 |
| [`ChatMessage.attributes`](#设置自定义推送字段) | `ChatMessage` | 自定义推送、强制推送或静默消息所需的消息扩展字段。 |
| [`ChatManager#sendMessage`](#设置自定义推送字段) | `ChatManager` | 提交发送消息任务，返回 `Promise<void>`；可传入消息状态回调。 |
| [`ChatMessageStatusCallback#onSuccess`](#设置自定义推送字段) | `ChatMessageStatusCallback` | 消息最终发送成功，参数为发送成功后的消息对象。 |
| [`ChatMessageStatusCallback#onError`](#设置自定义推送字段) | `ChatMessageStatusCallback` | 消息最终发送失败，参数为本地消息 ID 和 `ChatError`。 |
| [`ChatMessageStatusCallback#onProgress`](#设置自定义推送字段) | `ChatMessageStatusCallback` | 附件上传进度，参数为本地消息 ID 和百分比进度（0–100）。 |
