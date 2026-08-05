# 设置推送翻译

如果用户启用 [自动翻译](/value-added/translation/message_translation_web.html) 功能并发送消息，SDK 可以在消息中携带原始内容和翻译结果。

推送通知可与消息翻译功能协同工作。作为接收方，你可以通过 `client.pushManager.setPushLanguage` 设置离线推送通知的首选语言。如果翻译消息的语言与接收方设置的首选语言匹配，推送通知中将展示翻译后的内容；否则，将展示原始消息内容。

调用 `setPushLanguage` 时，需传入有效的语言标识，例如 `zh-Hans`、`en` 等。翻译功能由 Microsoft Azure Translation API 提供，你可以点击 [微软官网](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 了解支持的翻译语言。


示例代码如下：

```typescript
await client.pushManager.setPushLanguage({
  language: 'zh-Hans', // 推送通知的首选语言。
});
```

你可以调用 `getPushLanguage` 获取推送通知的首选语言，示例代码如下：

```typescript
const result = await client.pushManager.getPushLanguage();
console.log(result.language);
```
