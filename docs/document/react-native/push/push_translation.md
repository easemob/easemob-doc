# 设置推送翻译

推送通知与翻译功能协同工作。如果用户启用 [自动翻译](/value-added/translation/message_translation_react-native.html) 功能并发送文本消息，SDK 会将消息原文和译文一起发送给接收方。

作为接收方，你可以设置你在离线时希望接收的推送通知的首选语言。如果翻译消息的语言符合你的设置，则翻译消息显示在推送通知中；否则，将显示原始消息。翻译功能由 Microsoft Azure Translation API 提供，你可以在 [微软官网](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 了解支持的翻译语言。

调用 `ChatPushManager#setPreferredNotificationLanguage` 设置离线推送的首选语言，传入语言代码（例如 `en`），返回 `Promise<void>`；调用 `ChatPushManager#fetchPreferredNotificationLanguage` 获取已设置的语言代码，返回 `Promise<string | undefined>`。语言代码为必填参数，`en` 仅为示例，不是默认语言；获取结果可能为 `undefined`。该设置用于选择离线推送的展示语言，不会替代发送方的自动翻译配置。

使用前，发送方需按 [自动翻译](/value-added/translation/message_translation_react-native.html) 文档开通并配置翻译功能，接收方需完成离线推送配置。以下代码示例显示了如何设置和获取推送通知的首选语言，在 SDK 初始化并成功登录后调用：

```typescript
async function configureNotificationLanguage(): Promise<void> {
  // 设置离线推送的首选语言，en 表示英语
  try {
    await ChatClient.getInstance().pushManager
      .setPreferredNotificationLanguage('en');
    // 设置成功
    console.log('设置离线推送首选语言成功');
  } catch (error: unknown) {
    // 处理设置失败
    console.error('设置离线推送首选语言失败：', error);
  }

  // 获取设置的离线推送的首选语言
  try {
    const language = await ChatClient.getInstance().pushManager
      .fetchPreferredNotificationLanguage();
    // 获取成功，language 为返回的语言代码，可能为 undefined
    console.log('离线推送首选语言：', language);
  } catch (error: unknown) {
    // 处理获取失败
    console.error('获取离线推送首选语言失败：', error);
  }
}
```
