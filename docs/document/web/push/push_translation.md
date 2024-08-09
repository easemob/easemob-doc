# 设置推送翻译

如果用户启用[自动翻译](message_translation.html) 功能并发送消息，SDK 会同时发送原始消息和翻译后的消息。

推送通知与翻译功能协同工作。作为接收方，你可以设置你在离线时希望接收的推送通知的首选语言。如果翻译消息的语言符合你的设置，则翻译消息显示在推送通知中；否则，将显示原始消息。翻译功能由 Microsoft Azure Translation API 提供，你可以点击[这里](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)了解支持的翻译语言。

你可以调用 `setPushPerformLanguage` 设置推送通知的首选语言，示例代码如下：

```javascript
/**
	language: string, // 推送通知的首选语言。
*/
const params = {
  language: 'EU'
}
WebIM.conn.setPushPerformLanguage(params)
```

你可以调用 `getPushPerformLanguage` 获取推送通知的首选语言，示例代码如下：

```javascript
WebIM.conn.getPushPerformLanguage() // 无需传参数，直接调用。
```

