# 设置推送翻译 

推送通知与翻译功能协同工作。如果用户启用[自动翻译](/document/flutter/message_translation.html)功能并发送消息，SDK 会同时发送原始消息和翻译后的消息。

作为接收方，你可以设置你在离线时希望接收的推送通知的首选语言。如果翻译后消息的语言匹配你的设置，则翻译后消息显示在推送通知栏；否则，将显示原始消息。翻译功能由 Microsoft Azure Translation API 提供，你可以点击[这里](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)了解支持的翻译语言。

以下示例代码显示如何设置和获取推送通知的首选语言：

```dart
// 设置离线推送的首选语言。
try {
  await EMClient.getInstance.pushManager.setPreferredNotificationLanguage('en');
} on EMClient catch (e) {}

// 获取设置的离线推送的首选语言。
try {
  String? language = await EMClient.getInstance.pushManager.fetchPreferredNotificationLanguage();
} on EMClient catch (e) {}
```