# 文本消息翻译

为方便用户在聊天过程中对文本消息进行翻译，环信即时通讯 IM HarmonyOS SDK 集成 Microsoft Azure Translation API，支持在发送或接收消息时对 **文本消息** 进行按需翻译或自动翻译：

- 按需翻译：接收方在收到文本消息后，将消息内容翻译为目标语言。
- 自动翻译：发送方发送消息时，SDK 根据发送方设置的目标语言自动翻译文本内容，然后将消息原文和译文一起发送给接收方。

## 功能开通

文本翻译为增值服务，如需使用请先在 [环信控制台开通](/product/console/purchase_value_added.html#消息翻译)。

单次翻译请求最多支持 10,000 字符。计费字符数按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 字符翻译为 4 种语言，则计费字符数为 2000 字符。

若传入的文本超过上限，则上报错误 400，错误提示为 “The input text is too long”。

该服务的费用详见 [计费策略](/product/pricing_policy.html#消息翻译)。

## 前提条件

开始前，请确保：

1. 已完成 HarmonyOS SDK 1.15.0 或以上版本的[初始化](/document/harmonyos/initialization.html)并登录成功。
2. [已开通翻译功能， 了解翻译服务的使用限制](#功能开通)。
3. 了解即时通讯 IM API 的 [使用限制](/product/limitation.html)。
4. 了解翻译服务支持的目标语言：翻译服务由 Microsoft Azure Translation API 提供。关于翻译服务支持的目标语言，详见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 技术原理

HarmonyOS SDK 通过 `ChatManager` 和 `TextMessageBody` 提供以下接口：

- `ChatManager#fetchSupportLanguages`：获取翻译服务支持的语言。
- 按需翻译：接收方收到文本消息后，调用 `ChatManager#translateMessage` 将消息翻译为一种或多种目标语言。
- 自动翻译：发送方发送文本消息前，调用 `TextMessageBody#setTargetLanguages` 设置一种或多种目标语言，然后发送消息。接收方会同时收到消息原文和译文，可通过 `TextMessageBody#getTranslations` 获取译文列表。

如下为按需翻译示例：

![img](/images/ios/translation.png)

## 获取翻译服务支持的语言

无论是按需翻译还是自动翻译，都需先调用 `fetchSupportLanguages` 获取支持的翻译语言，包括语言编码、英文名称和当前客户端语言名称：

```typescript
let languages = await ChatClient.getInstance().chatManager()?.fetchSupportLanguages();
languages?.forEach((item) => {
  // item.languageCode：语言编码。
  // item.languageName：语言名称。
  // item.languageLocalName：当前客户端中的语言显示名称。
});
```

## 按需翻译

接收方收到文本消息后，将消息和目标语言编码传入 `translateMessage`。目标语言可以传入单个字符串或字符串数组。

翻译成功之后，译文信息会保存到消息中。调用 `getTranslations` 获取译文内容。

```typescript
let translatedMessage = await ChatClient.getInstance().chatManager()?.translateMessage(
  message,
  ['en', 'ja']
);

if (translatedMessage) {
  let body = translatedMessage.getBody() as TextMessageBody;
  let translations = body.getTranslations();
  translations.forEach((item) => {
    // item.languageCode：译文语种编码。
    // item.translationText：译文文本。
  });
}
```

该方法只支持文本消息；传入其他消息类型或空消息时，Promise 会以 `ChatError.MESSAGE_INVALID` 拒绝。

## 设置自动翻译

发送方创建文本消息后，获取 `TextMessageBody` 并设置目标语言，再发送消息：

```typescript
let message = ChatMessage.createTextSendMessage('toUser', '你好，欢迎使用环信。');
if (!message) {
  return;
}

let body = message.getBody() as TextMessageBody;
body.setTargetLanguages('en');
// 也可以设置多个目标语言：body.setTargetLanguages(['en', 'ja']);

ChatClient.getInstance().chatManager()?.sendMessage(message);
```

发送时消息原文和译文一起发送。

消息发送成功后，接收方可以调用 `getTranslations` 获取译文：

```typescript
let body = receivedMessage.getBody() as TextMessageBody;
let targetLanguages = body.getTargetLanguages();
let translations = body.getTranslations();
```

## 数据结构

### TranslationLanguage

`fetchSupportLanguages` 返回 `Array<TranslationLanguage>`，每一项包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `languageCode` | `string` | 语言编码。 |
| `languageName` | `string` | 语言名称。 |
| `languageLocalName` | `string` | 当前客户端语言下的显示名称。 |

### TranslationInfo

`TextMessageBody#getTranslations` 返回 `Array<TranslationInfo>`：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `languageCode` | `string` | 译文语种编码。 |
| `translationText` | `string` | 译文文本。 |

## 注意事项

- 目标语言必须使用 `fetchSupportLanguages` 返回的语言编码。
- `translateMessage` 的结果只保存在当前设备，不会自动发送给对端；如需让对端获得译文，应在发送前调用 `setTargetLanguages`。
- 单次请求超过 10,000 个字符时，服务会返回错误。翻译服务未开通、用量达到上限或翻译失败时，请根据 Promise 返回的 `ChatError` 处理，详见[错误码](/document/harmonyos/error.html)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchSupportLanguages`](#获取翻译服务支持的语言) | `ChatManager` | 获取支持的翻译语言。 |
| [`translateMessage`](#按需翻译) | `ChatManager` | 按需翻译一条文本消息，仅更新本地消息。 |
| [`setTargetLanguages`](#设置自动翻译) | `TextMessageBody` | 设置发送时生成译文的目标语言。 |
| [`getTargetLanguages`](#设置自动翻译) | `TextMessageBody` | 获取消息设置的目标语言。 |
| [`getTranslations`](#设置自动翻译) | `TextMessageBody` | 获取消息中的译文列表。 |
