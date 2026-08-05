# 消息翻译

## 功能说明

为方便用户在聊天过程中对文本消息进行翻译，环信即时通讯 IM Android SDK 集成了 Microsoft Azure Translation API，支持对文本消息进行按需翻译或自动翻译：

- **按需翻译**：接收方在收到文本消息后，将消息内容翻译为一种或多种目标语言。
- **自动翻译**：发送方在创建文本消息时设置目标语言列表。消息发送时，SDK 会自动翻译文本内容，接收方收到的消息中可包含原文和译文。

## 功能开通

文本翻译为增值服务，需先在[环信控制台开通](/product/console/purchase_value_added.html#消息翻译)，具体费用详见[计费策略](/product/pricing_policy.html#消息翻译)。

使用时需注意：

- 单次翻译请求最多支持 10,000 字符，计费按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 字符翻译为 4 种语言，计费字符数为 2000。
- 按需翻译场景下，若消息文本过长，`translateMessage` 将返回错误码 `1110`，错误原因为 `translate_text_too_long`。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- [已开通翻译功能，并了解翻译服务的使用限制](#功能开通)。
- 了解即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解翻译服务支持的目标语言：翻译服务由 Microsoft Azure Translation API 提供。关于翻译服务支持的目标语言，详见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 获取翻译服务支持的语言

无论是按需翻译还是自动翻译，都需先调用 `EMChatManager#fetchSupportLanguages` 获取翻译服务支持的语言列表。`EMLanguage` 对象中的 `LanguageCode`、`LanguageName` 和 `LanguageLocalName` 分别表示语言代码、语言名称和本地语言名称。

```java
EMClient.getInstance()
        .chatManager()
        .fetchSupportLanguages(
                new EMValueCallBack<List<EMLanguage>>() {
                    @Override
                    public void onSuccess(List<EMLanguage> languages) {
                        for (EMLanguage language : languages) {
                            String code = language.LanguageCode;
                            String name = language.LanguageName;
                            String localName = language.LanguageLocalName;
                        }
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## 按需翻译

接收方调用 `EMChatManager#translateMessage`，将收到的文本消息翻译为一种或多种目标语言。翻译成功后，可从回调返回的消息中调用 `EMTextMessageBody#getTranslations` 获取译文列表。

![img](/images/ios/translation.png)

```java
List<String> targetLanguages = Arrays.asList("zh-Hans", "ja");

EMClient.getInstance()
        .chatManager()
        .translateMessage(
                message,
                targetLanguages,
                new EMValueCallBack<EMMessage>() {
                    @Override
                    public void onSuccess(EMMessage translatedMessage) {
                        if (translatedMessage.getType()
                                != EMMessage.Type.TXT) {
                            return;
                        }

                        EMTextMessageBody body =
                                (EMTextMessageBody) translatedMessage.getBody();
                        List<EMTextMessageBody.EMTranslationInfo>
                                translations = body.getTranslations();

                        for (EMTextMessageBody.EMTranslationInfo info
                                : translations) {
                            String languageCode = info.languageCode;
                            String translatedText = info.translationText;
                        }
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## 自动翻译

发送方创建文本消息后，调用 `EMTextMessageBody#setTargetLanguages` 设置自动翻译的目标语言列表。发送消息时，SDK 会根据该列表翻译文本内容。接收方收到的文本消息中可包含原文和译文。

```java
List<String> targetLanguages =
        Collections.singletonList("zh-Hans");

EMMessage message = EMMessage.createTextSendMessage(
        "Hello!",
        conversationId);

// 群聊设置为 GroupChat，聊天室设置为 ChatRoom；单聊默认为 Chat。
message.setChatType(EMMessage.ChatType.Chat);

EMTextMessageBody body =
        (EMTextMessageBody) message.getBody();
// 设置自动翻译的目标语言列表。
body.setTargetLanguages(targetLanguages);

EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

接收方收到文本消息后，可以调用 `EMTextMessageBody#getTranslations` 获取译文列表：

```java
if (message.getType() == EMMessage.Type.TXT) {
    EMTextMessageBody body =
            (EMTextMessageBody) message.getBody();
    List<EMTextMessageBody.EMTranslationInfo> translations =
            body.getTranslations();
}
```

## 参考

#### 设置和获取推送的目标语言

设置推送的目标语言后，收到的离线推送将使用目标语言。如果消息中不存在该目标语言的译文，则推送原文。详见[设置推送翻译](/document/android/push/push_translation.html)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchSupportLanguages`](#获取翻译服务支持的语言) | `EMChatManager` | 获取翻译服务支持的语言列表。 |
| [`translateMessage`](#按需翻译) | `EMChatManager` | 将文本消息按需翻译为一种或多种目标语言。 |
| [`createTextSendMessage`](#自动翻译) | `EMMessage` | 创建文本消息。 |
| [`sendMessage`](#自动翻译) | `EMChatManager` | 发送包含自动翻译配置的文本消息。 |
