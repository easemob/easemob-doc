# 翻译

<Toc />

为方便用户在聊天过程中对文字消息进行翻译，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持在发送或接收消息时对 **文本消息** 进行按需翻译或自动翻译：

- 按需翻译：接收方在收到文本消息后，将消息内容翻译为目标语言。

- 自动翻译：发送方发送消息时，SDK 根据发送方设置的目标语言自动翻译文本内容，然后将消息原文和译文一起发送给接收方。

如下为按需翻译示例：

![img](/images/ios/translation.png)

## 功能开通

文本翻译为增值服务，如需使用请先在 [环信控制台开通](/product/console/purchase_value_added.html#消息翻译)。

单次翻译请求最多支持 10,000 字符。计费字符数按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 字符翻译为 4 种语言，则计费字符数为 2000 字符。

若传入的文本超过上限，则上报错误 400，错误提示为 “The input text is too long”。

该服务的费用详见 [计费策略](/product/pricing_policy.html#消息翻译)。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 `3.9.1 或以上版本` SDK 初始化，详见 [快速开始](/document/ios/quickstart.html)。
2. [已开通翻译功能， 了解翻译服务的使用限制](#功能开通)。
3. 了解即时通讯 IM API 的 [使用限制](/product/limitation.html)。
4. 了解翻译服务支持的目标语言：翻译服务由 Microsoft Azure Translation API 提供。关于翻译服务支持的目标语言，详见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 技术原理

iOS SDK 支持你通过调用 API 在项目中实现如下功能：

- `fetchSupportedLanguages`：获取支持的翻译语言；
- 按需翻译：接收方在收到文本消息后调用 `translateMessage` 进行翻译；
- 自动翻译：发送方发送消息之前设置 `EMTextMessageBody` 中的 `targetLanguages` 字段为目标语言，然后发送消息，接收方会收到消息原文和译文。

## 实现方法

### 获取翻译服务支持的语言

SDK 支持所有微软翻译服务支持的语言，你可以使用 EMChatManager 模块的如下接口获取翻译功能支持的目标语言。

```objectivec
/**
 *  获取翻译服务支持的语言。
 *  @param aCompletionBlock 完成的回调。
 *
 */
- (void)fetchSupportedLanguages:(void(^_Nullable)(NSArray<EMTranslateLanguage*>* _Nullable languages,EMError* _Nullable error))aCompletionBlock
```

使用过程如下:

```objectivec
// 异步方法
[[[EMClient sharedClient] chatManager] fetchSupportedLanguages:^(NSArray<EMTranslateLanguage *> * _Nullable languages, EMError * _Nullable error) {

}];
```

### 翻译文本消息

#### 点击文本翻译

用户可以在收到文本消息后调用消息翻译接口进行翻译。接口定义如下：

```objectivec
/**
 *  翻译消息，异步方法。
 *
 *  @param aMessage         消息对象。
 *  @param aLanguages       要翻译的目标语言 code，EMTranslateLanguage 类中的 languageCode 数组。
 *  @param aCompletionBlock 该方法完成调用的回调。如果该方法调用失败，会包含调用失败的原因。
 */
- (void)translateMessage:(EMChatMessage *)aMessage
         targetLanguages:(NSArray<NSString*>*)aLanguageCodes
              completion:(void (^)(EMChatMessage *message, EMError *error))aCompletionBlock;
```

调用过程如下：

```objectivec
// 消息必须为文本消息。
[[[EMClient sharedClient] chatManager] translateMessage:msg targetLanguages:@[@"en",@"ja"] completion:^(EMChatMessage *message, EMError *error) {
    // 翻译后的译文信息获取。
    EMTextMessageBody* body = (EMTextMessageBody*)message.body;
    NSDictionary* translations = body.translations;
}];
```

### 设置自动翻译

用户可以在发送文本消息时，设置消息的目标语言，消息将在翻译后进行发送，接收方收到的消息将包含译文信息。使用过程如下：

```objectivec
EMTextMessageBody* msgBody = [[EMTextMessageBody alloc] initWithText:@"你好"];
msgBody.targetLanguages = @[@"en",@"ja"];
EMMessage*message = [[EMMessage alloc] initWithConversationID:@"to" from:@"from" to:@"to" body:msgBody ext:nil];
[[[EMClient sharedClient] chatManager] sendMessage:message progress:nil completion:nil];
```
## 参考

### 设置和获取推送的目标语言

设置推送的目标语言，设置后收到的离线推送为目标语言。如果目标语言在消息里不存在，只推送原文，详见[设置推送翻译](/document/ios/push/push_translation.html)。