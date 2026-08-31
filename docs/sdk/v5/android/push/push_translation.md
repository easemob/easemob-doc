# Set Push Translation

Push notifications work with the translation feature. If a user enables [automatic translation](/value-added/translation/message_translation_android.html) and sends a message, the SDK sends both the original message and the translated message.

As the receiver, you can set the preferred language of the push notifications you want to receive while offline. If the language of the translated message matches your setting, the translated message is displayed in the push notification. Otherwise, the original message is displayed. The translation feature is provided by Microsoft Azure Translation API. You can learn about supported translation languages on the [Microsoft website](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support).

The following code example shows how to set and get the preferred language of push notifications:

```java
// Set the preferred language for offline push.
EMClient.getInstance().pushManager().setPreferredNotificationLanguage("en", new EMCallBack(){});

// Get the configured preferred language for offline push.
EMClient.getInstance().pushManager().getPreferredNotificationLanguage(new EMValueCallBack<String>(){});
```
