# 翻译

## 功能说明

为方便用户在聊天过程中对文本消息进行翻译，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持对文本消息进行按需翻译或自动翻译：

- **按需翻译**：接收方在收到文本消息后，将消息内容翻译为目标语言。
- **自动翻译**：发送方在创建文本消息时设置目标语言列表。消息发送时，SDK 会自动翻译文本内容，接收方收到的消息中可包含原文和译文。

## 功能开通

文本翻译为增值服务，需先在[环信控制台开通](/product/console/purchase_value_added.html#消息翻译)，具体费用详见[计费策略](/product/pricing_policy.html#消息翻译)。

使用时需注意：

- 单次翻译请求最多支持 10,000 字符，计费按 **源文本字符数 × 目标语言数量** 计算（例如，将 500 字符翻译为 4 种语言，计费 2000 字符）。
- 按需翻译场景下，若消息文本过长，`translateMessage` 将返回错误码 `1110`，错误原因为 `translate_text_too_long`。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- [已开通翻译功能，了解翻译服务的使用限制](#功能开通)。
- 已注册 `ChatManager`，能够通过 `client.chatManager` 调用消息翻译相关接口。
- 了解即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解翻译服务支持的目标语言：翻译服务由 Microsoft Azure Translation API 提供。关于翻译服务支持的目标语言，详见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 获取翻译服务支持的语言

无论是按需翻译还是自动翻译，都需先调用 `getSupportedTranslationLanguages` 获取支持的翻译语言。示例代码如下：

```typescript
const languages = await client.chatManager.getSupportedTranslationLanguages();
console.log('支持的语言:', languages);
// [{ code: 'zh-Hans', name: 'Chinese Simplified', nativeName: '中文简体' }, { code: 'en', name: 'English', nativeName: 'English' }, ...]
```

## 按需翻译

接收方调用 `translateMessage` 将接收到的消息翻译成目标语言。示例代码如下：

```typescript
const result = await client.chatManager.translateMessage({
  message,
  targetLanguages: ['zh-Hans', 'ja'],
});

console.log('翻译结果:', result.translations);
// [{ to: 'zh-Hans', text: '你好' }, { to: 'ja', text: 'こんにちは' }]
```

## 自动翻译

设置自动翻译的目标语言后，在发送消息时 SDK 会将目标语言列表写入文本消息体。接收方收到的文本消息中可包含原文以及译文。

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'user2',
  // 单聊、群组聊天和聊天室分别为 `singleChat`、`groupChat` 和 `chatRoom`。
  conversationType: 'singleChat',
  content: 'Hello!',
  targetLanguages: ['zh-Hans'], // 设置目标语言列表。
});

const sentMessage = await client.chatManager.sendMessage(message);
```

## 参考

#### 设置和获取推送的目标语言

设置推送的目标语言，设置后收到的离线推送为目标语言。如果目标语言在消息里不存在，只推送原文，详见[设置推送翻译](/document/web/push/push_translation.html)。

## 接口列表

| API 名称                                                     | 所属模块/类   | 说明                                                         |
| ------------------------------------------------------------ | ------------- | ------------------------------------------------------------ |
| [`getSupportedTranslationLanguages`](#获取翻译服务支持的语言) | `ChatManager` | 获取翻译服务支持的语言列表。                                 |
| [`translateMessage`](#按需翻译)                              | `ChatManager` | 将接收到的文本消息按需翻译为目标语言。                       |
| [`createTextMessage`](#自动翻译)                             | `ChatManager` | 创建文本消息，并可通过 `targetLanguages` 设置自动翻译的目标语言。 |
| [`sendMessage`](#自动翻译)                                   | `ChatManager` | 发送包含自动翻译目标语言配置的文本消息。                     |