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

- 本文示例适用于使用以下接口的 React Native SDK v1.x 和 v5.x。
- 已完成 [初始化](/document/react-native/initialization.html) 并登录成功。
- 已 [开通消息翻译服务](#功能开通) ，并了解 IM API 的 [使用限制](/product/limitation.html) 。
- 目标语言使用服务支持的语言编码，语言范围参见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 。

## 获取翻译服务支持的语言

你可以调用 `fetchSupportedLanguages()` 查询翻译服务支持的语言，并从返回结果中选取目标语言编码。无论是按需翻译还是自动翻译，都需要在翻译前确认目标语言受支持。

已知有效语言编码时，无需在每次翻译前重复查询。

```typescript
try {
  const languages = await ChatClient.getInstance().chatManager.fetchSupportedLanguages();
  for (const language of languages) {
    console.log(language.code, language.name, language.nativeName);
  }
} catch (error) {
  console.error('查询语言失败:', error);
}
```

`fetchSupportedLanguages()` 返回 `Promise<ChatTranslateLanguage[]>`，每个语言对象包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `code` | `string` | 语言编码，例如 `zh-Hans`。 |
| `name` | `string` | 语言名称。 |
| `nativeName` | `string` | 该语言的本地显示名称。 |

## 按需翻译

接收方调用 `translateMessage()` 翻译收到且仍保存在本地数据库中的文本消息。翻译成功后，从返回消息的文本消息体读取译文；结果不会自动发送给对端。

```typescript
// receivedMessage 为收到且仍保存在本地数据库中的普通文本消息。
try {
  const translatedMessage = await ChatClient.getInstance().chatManager.translateMessage(
    receivedMessage,
    ['en', 'ja'],
  );
  const body = translatedMessage.body as ChatTextMessageBody;
  console.log('英文译文:', body.translations?.['en'] ?? body.content);
} catch (error) {
  console.error('翻译失败:', error);
}
```

## 设置自动翻译

创建文本消息时设置目标语言，再发送消息。SDK 会先翻译，再将原文与译文一起发送。

创建消息时通过 `targetLanguageCodes` 设置目标语言。以下为单聊示例：

```typescript
const message = ChatMessage.createTextMessage(
  'user2',
  '你好',
  ChatMessageChatType.PeerChat,
  { targetLanguageCodes: ['en', 'ja'] },
);
try {
  await ChatClient.getInstance().chatManager.sendMessage(message);
} catch (error) {
  console.error('发送请求失败:', error);
}
```

## 接收并展示译文

接收方收到文本消息后，可以读取译文并选择展示语言。没有所需语言的译文时，可回退展示原文。

在消息接收回调中，读取普通文本消息体的 `translations`：

```typescript
// receivedMessage 为消息接收回调中的普通文本消息。
const body = receivedMessage.body as ChatTextMessageBody;
console.log('展示内容:', body.translations?.['en'] ?? body.content);
```

`ChatTextMessageBody.translations` 是语言编码到译文的键值对象。SDK 公开声明为可选的 `any`，使用时应判断字段是否存在。

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `content` | `string` | 原文。 |
| `targetLanguageCodes` | `string[]（可选）` | 目标语言编码列表。 |
| `translations` | `any（可选）` | 语言编码到译文的键值对象，例如 `{ en: "Hello" }`。 |

## 注意事项

- 按需翻译会根据消息 ID 查找本地消息。不要直接传入尚未发送、尚未入库的新建消息。
- 自动翻译参数是 `targetLanguageCodes`，不是 `targetLanguages`。
- 请处理 Promise 异常；消息最终发送状态还可通过 `sendMessage()` 的消息状态回调处理。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| `fetchSupportedLanguages` | `ChatManager` | 查询支持的语言。 |
| `translateMessage` | `ChatManager` | 按需翻译普通文本消息。 |
| `createTextMessage` | `ChatMessage` | 创建文本消息，通过选项中的 targetLanguageCodes 设置目标语言。 |
| `translations` | `ChatTextMessageBody` | 获取译文映射。 |
