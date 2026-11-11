# 消息翻译

<Toc />

为方便用户在聊天过程中翻译文本消息，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持以下两种方式：

- 按需翻译：接收方收到文本消息后，将消息内容翻译为目标语言。
- 自动翻译：发送方设置目标语言后，SDK 在发送消息前翻译文本，将原文和译文一起发送给接收方。

如下为按需翻译示例：

![img](/images/ios/translation.png)

## 功能开通

消息翻译为增值服务，使用前请先在 [环信控制台开通](/product/console/purchase_value_added.html#消息翻译) 。

单次翻译请求最多支持 10,000 个字符。计费字符数按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 个字符翻译为 4 种语言，计费字符数为 2,000。

文本超长、服务未开通、用量达到上限或翻译失败时，请处理 SDK 返回的错误。例如，“The input text is too long” 表示文本超过上限；翻译服务的 HTTP 400 不等于 SDK 对外返回的错误码。

该服务的费用详见 [计费策略](/product/pricing_policy.html#消息翻译) 。

## 前提条件

- 消息翻译功能自 HarmonyOS SDK 1.15.0 起提供；以下接口也适用于 V5.x。
- 已完成 [初始化](/document/harmonyos/initialization.html) 并登录成功。
- 已 [开通消息翻译服务](#功能开通) ，并了解 IM API 的 [使用限制](/product/limitation.html) 。
- 目标语言使用服务支持的语言编码，语言范围参见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 。

## 获取翻译服务支持的语言

你可以调用 `fetchSupportLanguages()` 查询翻译服务支持的语言，并从返回结果中选取目标语言编码。无论是按需翻译还是自动翻译，都需要在翻译前确认目标语言受支持。

已知有效语言编码时，无需在每次翻译前重复查询。

```typescript
try {
  const languages = await ChatClient.getInstance().chatManager()?.fetchSupportLanguages();
  languages?.forEach((language) => {
    console.info(language.languageCode, language.languageName, language.languageLocalName);
  });
} catch (error) {
  console.error('查询语言失败:', error);
}
```

`fetchSupportLanguages()` 返回 `Promise<Array<TranslationLanguage>>`，每个语言对象包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `languageCode` | `string` | 语言编码，例如 `zh-Hans`。 |
| `languageName` | `string` | 语言名称。 |
| `languageLocalName` | `string` | 该语言的本地显示名称。 |

## 按需翻译

接收方调用 `translateMessage()` 翻译收到的文本消息。目标语言可以是单个字符串或字符串数组。翻译成功后，从返回消息的文本消息体读取译文；结果只保存在当前设备，不会自动发送给对端。

```typescript
// receivedMessage 为收到的普通文本消息。
try {
  const message = await ChatClient.getInstance().chatManager()?.translateMessage(
    receivedMessage,
    ['en', 'ja'],
  );
  if (message) {
    const body = message.getBody() as TextMessageBody;
    body.getTranslations().forEach((item) => {
      console.info(item.languageCode, item.translationText);
    });
  }
} catch (error) {
  console.error('翻译失败:', error);
}
```

## 设置自动翻译

创建文本消息时设置目标语言，再发送消息。SDK 会先翻译，再将原文与译文一起发送。

调用文本消息体的 `setTargetLanguages()` 设置一种或多种目标语言。以下为单聊示例：

```typescript
const message = ChatMessage.createTextSendMessage('user2', '你好');
if (message) {
  const body = message.getBody() as TextMessageBody;
  body.setTargetLanguages(['en', 'ja']);
  // 只设置一种语言时，也可调用 body.setTargetLanguages('en')。
  ChatClient.getInstance().chatManager()?.sendMessage(message);
}
```

## 接收并展示译文

接收方收到文本消息后，可以读取译文并选择展示语言。没有所需语言的译文时，可回退展示原文。

在消息接收回调中，对普通文本消息调用 `getTranslations()`：

```typescript
// receivedMessage 为消息接收回调中的普通文本消息。
const body = receivedMessage.getBody() as TextMessageBody;
const translation = body.getTranslations().find((item) => item.languageCode === 'en');
console.info(translation?.translationText ?? body.getContent());
```

`TextMessageBody.getTranslations()` 返回 `Array<TranslationInfo>`：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `languageCode` | `string` | 译文的语言编码。 |
| `translationText` | `string` | 译文文本。 |

`getContent()` 返回原文，`getTargetLanguages()` 返回目标语言编码数组。

## 注意事项

- `translateMessage()` 仅支持文本消息。传入其他消息类型或空消息时，Promise 会以 `ChatError.MESSAGE_INVALID` 拒绝。
- 请处理 Promise 返回的 `ChatError`，错误码参见 [错误码](/document/harmonyos/error.html) 。
- `setTargetLanguages()` 只设置目标语言，不会立即发起翻译；发送消息时执行自动翻译。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| `fetchSupportLanguages` | `ChatManager` | 查询支持的语言。 |
| `translateMessage` | `ChatManager` | 按需翻译普通文本消息。 |
| `setTargetLanguages / getTargetLanguages` | `TextMessageBody` | 设置/获取目标语言。 |
| `getTranslations` | `TextMessageBody` | 获取译文列表。 |
