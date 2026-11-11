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

- 本文示例适用于 iOS SDK v4.x 和 v5.x；消息翻译功能自 v3.9.1 起提供。
- 已完成 [初始化](/document/ios/initialization.html) 并登录成功。
- 已 [开通消息翻译服务](#功能开通) ，并了解 IM API 的 [使用限制](/product/limitation.html) 。
- 目标语言使用服务支持的语言编码，语言范围参见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 。

## 获取翻译服务支持的语言

你可以调用 `fetchSupportedLanguages:` 查询翻译服务支持的语言，并从返回结果中选取目标语言编码。无论是按需翻译还是自动翻译，都需要在翻译前确认目标语言受支持。

已知有效语言编码时，无需在每次翻译前重复查询。

```objectivec
[[EMClient sharedClient].chatManager fetchSupportedLanguages:^(NSArray<EMTranslateLanguage *> *languages, EMError *error) {
    if (error) {
        NSLog(@"查询语言失败：%@", error.errorDescription);
        return;
    }
    for (EMTranslateLanguage *language in languages) {
        NSLog(@"%@：%@", language.languageCode, language.languageName);
    }
}];
```

`fetchSupportedLanguages:` 的成功回调返回 `NSArray<EMTranslateLanguage *> *`：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `languageCode` | `NSString *` | 语言编码，例如 `zh-Hans`。 |
| `languageName` | `NSString *` | 语言名称。 |
| `languageNativeName` | `NSString *` | 该语言的原生名称。 |

## 按需翻译

接收方调用 `translateMessage:targetLanguages:completion:` 翻译收到的文本消息。翻译成功后，从回调返回消息的文本消息体中读取译文。按需翻译不会将译文自动发送给对端。

以下 `receivedMessage` 为收到的普通文本消息：

```objectivec
[[EMClient sharedClient].chatManager translateMessage:receivedMessage
    targetLanguages:@[@"en", @"ja"]
    completion:^(EMChatMessage *message, EMError *error) {
        if (error) {
            NSLog(@"翻译失败：%@", error.errorDescription);
            return;
        }
        EMTextMessageBody *body = (EMTextMessageBody *)message.body;
        NSLog(@"英文译文：%@", body.translations[@"en"]);
    }];
```

## 设置自动翻译

创建文本消息时设置目标语言，再发送消息。SDK 会先翻译，再将原文与译文一起发送。

通过文本消息体的 `targetLanguages` 属性设置目标语言。以下为单聊示例：

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"你好"];
body.targetLanguages = @[@"en", @"ja"];
EMChatMessage *message = [[EMChatMessage alloc]
    initWithConversationID:@"user2"
    from:[EMClient sharedClient].currentUsername
    to:@"user2"
    body:body
    ext:nil];
[[EMClient sharedClient].chatManager sendMessage:message
    progress:nil
    completion:^(EMChatMessage *sentMessage, EMError *error) {
        if (error) {
            NSLog(@"发送失败：%@", error.errorDescription);
        }
    }];
```

## 接收并展示译文

接收方收到文本消息后，可以读取译文并选择展示语言。没有所需语言的译文时，可回退展示原文。

在消息接收回调中，读取普通文本消息体的 `translations`。以下 `receivedMessage` 为收到的普通文本消息：

```objectivec
EMTextMessageBody *body = (EMTextMessageBody *)receivedMessage.body;
NSString *displayText = body.translations[@"en"] ?: body.text;
NSLog(@"展示内容：%@", displayText);
```

`EMTextMessageBody.translations` 为可空的 `NSDictionary<NSString *, NSString *> *`：

| 项目 | 类型 | 描述 |
| :--- | :--- | :--- |
| 键 | `NSString *` | 译文的语言编码，例如 `en`。 |
| 值 | `NSString *` | 对应语言的译文。 |

`body.text` 保留原文；`body.targetLanguages` 为可空的目标语言编码数组 `NSArray<NSString *> *`。

## 注意事项

- 翻译仅适用于普通文本消息。v5.x 的 [复合消息](/document/ios/message_send.html#发送复合消息) 不支持按需翻译，也不会自动翻译其中的文本消息体。
- 请先判断回调中的 `error`，再读取翻译或发送结果。
- 如需设置离线推送的展示语言，参见 [设置推送翻译](/document/ios/push/push_translation.html) 。

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| `fetchSupportedLanguages:` | `EMChatManager` | 查询支持的语言。 |
| `translateMessage:targetLanguages:completion:` | `EMChatManager` | 按需翻译普通文本消息。 |
| `targetLanguages` | `EMTextMessageBody` | 设置/获取目标语言。 |
| `translations` | `EMTextMessageBody` | 获取译文映射。 |
