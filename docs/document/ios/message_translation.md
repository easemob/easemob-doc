# 消息翻译

## 功能说明

为方便用户在聊天过程中对文本消息进行翻译，环信即时通讯 IM iOS SDK 集成了 Microsoft Azure Translation API，支持对文本消息进行按需翻译或自动翻译：

 - **按需翻译**：接收方在收到文本消息后，将消息内容翻译为一种或多种目标语言。
 - **自动翻译**：发送方创建文本消息时设置目标语言列表。消息发送时，SDK 自动翻译文本内容；接收方收到的消息中可包含原文和译文。

![img](/images/ios/translation.png)

## 功能开通

文本翻译为增值服务，需先在[环信控制台开通](/product/console/purchase_value_added.html#消息翻译)，具体费用详见[计费策略](/product/pricing_policy.html#消息翻译)。

使用时需注意：

 - 单次翻译请求最多支持 10,000 字符，计费按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 字符翻译为 4 种语言，计费字符数为 2000。
 - 按需翻译场景下，若消息文本过长，`translateMessage` 会返回错误码 `EMErrorTranslateParamError`（1110）。

## 前提条件

开始前，请确保满足以下条件：

 - 已完成 SDK 初始化，详见 [快速开始](quickstart.html)。
 - [已开通翻译功能，并了解翻译服务的使用限制](#功能开通)。
 - 了解即时通讯 IM API 的 [使用限制](/product/limitation.html)。
 - 了解翻译服务支持的目标语言：翻译服务由 Microsoft Azure Translation API 提供。关于翻译服务支持的目标语言，详见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 获取翻译服务支持的语言

无论是按需翻译还是自动翻译，都需先调用 `fetchSupportedLanguages` 获取翻译服务支持的语言列表。`EMTranslateLanguage` 对象的 `languageCode`、`languageName` 和 `languageNativeName` 分别表示语言代码、语言名称和本地语言名称。

```objectivec
// 异步方法。
[[EMClient sharedClient].chatManager fetchSupportedLanguages:^(NSArray<EMTranslateLanguage *> *languages, EMError *error) {
    if (!error) {
        for (EMTranslateLanguage *language in languages) {
            NSString *code = language.languageCode;
            NSString *name = language.languageName;
            NSString *nativeName = language.languageNativeName;
        }
    }
}];
```

## 按需翻译

接收方调用 `translateMessage`，将收到的文本消息翻译为一种或多种目标语言。翻译成功后，可从回调返回消息的 `EMTextMessageBody#translations` 获取译文；该属性的 Key 为目标语言代码，Value 为译文。

```objectivec
// message 必须为文本消息。
NSArray<NSString *> *targetLanguages = @[@"zh-Hans", @"ja"];

[[EMClient sharedClient].chatManager translateMessage:message
                                       targetLanguages:targetLanguages
                                            completion:^(EMChatMessage *translatedMessage, EMError *error) {
    if (!error && [translatedMessage.body isKindOfClass:[EMTextMessageBody class]]) {
        EMTextMessageBody *body = (EMTextMessageBody *)translatedMessage.body;
        NSDictionary<NSString *, NSString *> *translations = body.translations;
        NSString *japaneseText = translations[@"ja"];
    }
}];
```

## 自动翻译

发送方创建文本消息后，设置 `EMTextMessageBody#targetLanguages`。发送消息时，SDK 根据该列表翻译文本内容；接收方收到的文本消息中可通过 `EMTextMessageBody#translations` 获取译文。

```objectivec
NSArray<NSString *> *targetLanguages = @[@"zh-Hans"];
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"Hello!"];
body.targetLanguages = targetLanguages;

EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId
                                                                   body:body
                                                                    ext:nil];

[[EMClient sharedClient].chatManager sendMessage:message
                                        progress:nil
                                      completion:^(EMChatMessage *sentMessage, EMError *error) {
    // 处理发送结果。
}];
```

## 参考

### 设置和获取推送的目标语言

设置推送的目标语言后，收到的离线推送将使用目标语言。如果消息中不存在该目标语言的译文，则推送原文，详见 [设置推送翻译](/document/ios/push/push_translation.html)。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`fetchSupportedLanguages`](#获取翻译服务支持的语言) | `IEMChatManager` | 获取翻译服务支持的语言列表。 |
| [`translateMessage`](#按需翻译) | `IEMChatManager` | 将文本消息按需翻译为一种或多种目标语言。 |
| [`translations`](#按需翻译) | `EMTextMessageBody` | 获取文本消息中的译文词典。 |
| [`targetLanguages`](#自动翻译) | `EMTextMessageBody` | 设置自动翻译的目标语言列表。 |
| [`sendMessage`](#自动翻译) | `IEMChatManager` | 发送包含自动翻译配置的消息。 |
