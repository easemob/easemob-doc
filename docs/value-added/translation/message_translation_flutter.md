# 消息翻译

<Toc />

为方便用户在聊天过程中 **翻译文本消息**，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持以下两种方式：

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

- 消息翻译功能自 Flutter SDK 1.0.5 起提供。
- 较早版本使用 `EM*` 类型；已采用 `Chat*` 命名的 4.220 之后的 4.x 版本和 V5.x 使用 `Chat*` 类型。请按所集成 SDK 的实际类型名称选择下方示例。V5.x 保留的 `EM*` 弃用兼容别名不作为新接入代码的首选。
- 已完成 [初始化](/document/flutter/initialization.html) 并登录成功。
- 已 [开通消息翻译服务](#功能开通) ，并了解 IM API 的 [使用限制](/product/limitation.html) 。
- 目标语言使用服务支持的语言编码，语言范围参见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 。

## 获取翻译服务支持的语言

你可以调用 `fetchSupportedLanguages()` 查询翻译服务支持的语言，并从返回结果中选取目标语言编码。无论是按需翻译还是自动翻译，都需要在翻译前确认目标语言受支持。

已知有效语言编码时，无需在每次翻译前重复查询。

::: tabs#code

@tab EM* 类型

```dart
try {
  final languages = await EMClient.getInstance.chatManager.fetchSupportedLanguages();
  for (final language in languages) {
    debugPrint('${language.languageCode}: ${language.languageName}');
  }
} on EMError catch (error) {
  debugPrint('${error.code}: ${error.description}');
}
```

@tab Chat* 类型（含 V5.x）

```dart
try {
  final languages = await ChatClient.getInstance.chatManager.fetchSupportedLanguages();
  for (final language in languages) {
    debugPrint('${language.languageCode}: ${language.languageName}');
  }
} on ChatError catch (error) {
  debugPrint('${error.code}: ${error.description}');
}
```

:::

`fetchSupportedLanguages()` 返回语言对象列表。旧类型名为 `EMTranslateLanguage`，新类型名为 `ChatTranslateLanguage`，字段一致：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `languageCode` | `String` | 语言编码，例如 `zh-Hans`。 |
| `languageName` | `String` | 语言名称。 |
| `languageNativeName` | `String` | 该语言的原生名称。 |

## 按需翻译

接收方调用 `translateMessage()` 翻译收到且仍保存在本地数据库中的文本消息。翻译成功后，从返回消息的文本消息体读取译文；结果不会自动发送给对端。

::: tabs#code

@tab EM* 类型

```dart
// receivedMessage 为收到且仍保存在本地数据库中的普通文本消息。
try {
  final translatedMessage = await EMClient.getInstance.chatManager.translateMessage(
    msg: receivedMessage,
    languages: ['en', 'ja'],
  );
  final body = translatedMessage.body as EMTextMessageBody;
  debugPrint(body.translations?['en'] ?? body.content);
} on EMError catch (error) {
  debugPrint('${error.code}: ${error.description}');
}
```

@tab Chat* 类型（含 V5.x）

```dart
// receivedMessage 为收到且仍保存在本地数据库中的普通文本消息。
try {
  final translatedMessage = await ChatClient.getInstance.chatManager.translateMessage(
    msg: receivedMessage,
    languages: ['en', 'ja'],
  );
  final body = translatedMessage.body as ChatTextMessageBody;
  debugPrint(body.translations?['en'] ?? body.content);
} on ChatError catch (error) {
  debugPrint('${error.code}: ${error.description}');
}
```

:::

## 设置自动翻译

创建文本消息时设置目标语言，再发送消息。SDK 会先翻译，再将原文与译文一起发送。

创建消息时设置 `targetLanguages`；接收方参数名为 `targetId`。以下为单聊示例：

::: tabs#code

@tab EM* 类型

```dart
final message = EMMessage.createTxtSendMessage(
  targetId: 'user2',
  content: '你好',
  targetLanguages: ['en', 'ja'],
);
try {
  await EMClient.getInstance.chatManager.sendMessage(message);
} on EMError catch (error) {
  debugPrint('${error.code}: ${error.description}');
}
```

@tab Chat* 类型（含 V5.x）

```dart
final message = ChatMessage.createTxtSendMessage(
  targetId: 'user2',
  content: '你好',
  targetLanguages: ['en', 'ja'],
);
try {
  await ChatClient.getInstance.chatManager.sendMessage(message);
} on ChatError catch (error) {
  debugPrint('${error.code}: ${error.description}');
}
```

:::

## 接收并展示译文

接收方收到文本消息后，可以读取译文并选择展示语言。没有所需语言的译文时，可回退展示原文。

::: tabs#code

@tab EM* 类型

```dart
// receivedMessage 为消息接收回调中的普通文本消息。
final body = receivedMessage.body as EMTextMessageBody;
debugPrint(body.translations?['en'] ?? body.content);
```

@tab Chat* 类型（含 V5.x）

```dart
// receivedMessage 为消息接收回调中的普通文本消息。
final body = receivedMessage.body as ChatTextMessageBody;
debugPrint(body.translations?['en'] ?? body.content);
```

:::

`EMTextMessageBody`/`ChatTextMessageBody` 的 `translations` 均为 `Map<String, String>?`，键为语言编码，值为对应译文。

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `content` | `String` | 原文。 |
| `targetLanguages` | `List<String>?` | 目标语言编码列表。 |
| `translations` | `Map<String, String>?` | 语言编码到译文的映射；未生成译文时可能为空。 |

## 注意事项

- 按需翻译会根据消息 ID 查找本地消息。不要直接传入尚未发送、尚未入库的新建消息。
- 请处理 `EMError`/`ChatError`，并在翻译成功后读取返回消息中的译文。
- 本页两组代码的区别在于 SDK 类型名称，不能简单将所有 V4.x 归为 `EM*`。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| `fetchSupportedLanguages` | `EMChatManager / ChatManager` | 查询支持的语言。 |
| `translateMessage` | `EMChatManager / ChatManager` | 按需翻译普通文本消息。 |
| `targetLanguages` | `EMTextMessageBody / ChatTextMessageBody` | 设置/获取目标语言。 |
| `translations` | `EMTextMessageBody / ChatTextMessageBody` | 获取译文映射。 |
