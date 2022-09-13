# 翻译

<Toc />

文本消息支持翻译功能，包含按需翻译和自动翻译。

- 按需翻译：收到消息时，接收方将消息内容翻译成目标语言。
- 自动翻译：用户发送消息时，SDK 根据设置的目标语言自动翻译消息内容，然后将消息原文和译文一并发送给消息接收方。

:::notice
翻译服务由 Microsoft Azure Translator API 提供支持。可以在 [Microsoft Azure Translator Language Support](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support) 页面查看目前支持的语言。
:::

## 前提条件

开始前，请确保满足以下条件：

1. 完成 `3.9.1 以上版本` SDK 初始化，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的[使用限制](/product/limitation.html)。
3. 已联系商务开通翻译功能。

如下为按需翻译示例：

![img](@static/images/ios/translation.png)

## 技术原理

iOS SDK 支持你通过调用 API 在项目中实现如下功能：

- `fetchSupportedLanguages`：获取支持的翻译语言；
- `translateMessage`：翻译文本消息；
- 设置自动翻译。

## 实现方法

### 获取翻译服务支持的语言

SDK 支持所有微软翻译服务支持的语言，你可以使用 EMChatManager 模块的如下接口获取翻译功能支持的目标语言。

```objectivec
/*!
 *  \~chinese
 *  获取翻译服务支持的语言。
 *  @param aCompletionBlock 完成的回调。
 *
 *  \~english
 *
 *  Fetches all languages what the translate service support.
 *
 *  @param aCompletionBlock The complete callback.
 */
- (void)fetchSupportedLanguages:(void(^_Nullable)(NSArray<EMTranslateLanguage*>* _Nullable languages,EMError* _Nullable error))aCompletionBlock
```

使用过程如下:

```objectivec
[[[EMClient sharedClient] chatManager] fetchSupportedLangurages:^(NSArray<EMTranslateLanguage *> * _Nullable languages, EMError * _Nullable error) {

}];
```

### 翻译文本消息

#### 点击文本翻译

用户可以在收到文本消息后调用消息翻译接口进行翻译。接口定义如下：

```objectivec
/*
 *  翻译消息。
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