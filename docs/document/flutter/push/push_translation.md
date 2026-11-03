# 设置推送翻译

推送通知与翻译功能协同工作。如果用户启用 [自动翻译](/value-added/translation/message_translation_flutter.html) 功能并发送文本消息，SDK 会将消息原文和译文一起发送给接收方。

作为接收方，你可以设置你在离线时希望接收的推送通知的首选语言。如果翻译消息的语言符合你的设置，则翻译消息显示在推送通知中；否则，将显示原始消息。翻译功能由 Microsoft Azure Translation API 提供，你可以在 [微软官网](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 了解支持的翻译语言。

调用 `ChatPushManager#setPreferredNotificationLanguage` 设置离线推送的首选语言，传入语言代码（例如 `en`），返回 `Future<void>`；调用 `fetchPreferredNotificationLanguage` 获取已设置的语言代码，返回 `Future<String?>`。该设置用于选择离线推送的展示语言，不会替代发送方的自动翻译配置。

使用前，发送方需按 [自动翻译](/value-added/translation/message_translation_flutter.html) 文档开通并配置翻译功能，接收方需完成离线推送配置。以下代码示例显示了如何设置和获取推送通知的首选语言，在 SDK 初始化并成功登录后调用：

```dart
// 设置离线推送的首选语言，en 表示英语。
try {
  await ChatClient.getInstance.pushManager
      .setPreferredNotificationLanguage('en');
  // 设置成功。
} on ChatError catch (error) {
  // 设置失败，根据错误码和错误信息处理。
  debugPrint('Set notification language failed: '
      '${error.code}, ${error.description}');
}

// 获取设置的离线推送的首选语言。
try {
  final String? language = await ChatClient.getInstance.pushManager
      .fetchPreferredNotificationLanguage();
  // 获取成功，language 为返回的语言代码。
  debugPrint('Preferred notification language: $language');
} on ChatError catch (error) {
  // 获取失败，根据错误码和错误信息处理。
  debugPrint('Fetch notification language failed: '
      '${error.code}, ${error.description}');
}
```
