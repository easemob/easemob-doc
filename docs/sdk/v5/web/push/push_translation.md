# Configure Push Translation

If a user enables [automatic translation](/value-added/translation/message_translation_web.html) and sends a message, the SDK can include both the original content and the translation in the message.

Push notifications can work with message translation. As a recipient, use `client.pushManager.setPushLanguage` to set the preferred language for offline push notifications. If the language of the translated message matches the recipient's preferred language, the push notification displays the translated content. Otherwise, it displays the original message content.

When calling `setPushLanguage`, pass a valid language identifier such as `zh-Hans` or `en`. Translation is provided by the Microsoft Azure Translation API. For supported languages, see the [Microsoft documentation](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support).


Example code:

```typescript
await client.pushManager.setPushLanguage({
  language: 'zh-Hans', // Preferred language for push notifications.
});
```

Call `getPushLanguage` to retrieve the preferred language for push notifications, as shown in the following example:

```typescript
const result = await client.pushManager.getPushLanguage();
console.log(result.language);
```
