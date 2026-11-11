# 消息翻译

## 功能说明

为方便用户在聊天过程中 **翻译文本消息**，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持以下两种方式：

- 按需翻译：接收方收到文本消息后，将消息内容翻译为目标语言。
- 自动翻译：发送方设置目标语言后，SDK 在发送消息前翻译文本，将原文和译文一起发送给接收方。

如下为按需翻译示例：

<img src="/images/ios/translation.png" width="600" >

## 功能开通

消息翻译为增值服务，使用前请先在 [环信控制台开通](/product/console/purchase_value_added.html#消息翻译)。

单次翻译请求最多支持 10,000 个字符。计费字符数按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 个字符翻译为 4 种语言，计费字符数为 2,000。

该服务的费用详见 [计费策略](/product/pricing_policy.html#消息翻译) 。

## 前提条件

- 本文示例适用于 Android SDK v4.x 和 v5.x；消息翻译功能自 v3.9.1 起提供。
- 已完成 [Unity 初始化](/document/android/initialization.html) 或 [Windows 初始化](/document/android/initialization.html)并登录成功。
- 已 [开通消息翻译服务](#功能开通) ，并了解 IM API 的 [使用限制](/product/limitation.html) 。
- 目标语言使用服务支持的语言编码，语言范围参见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 。

## 获取翻译服务支持的语言

你可以调用 `fetchSupportLanguages()` 查询翻译服务支持的语言，并从返回结果中选取目标语言编码。无论是按需翻译还是自动翻译，都需要在翻译前确认目标语言受支持。

已知有效语言编码时，无需在每次翻译前重复查询。

```java
EMClient.getInstance().chatManager().fetchSupportLanguages(
    new EMValueCallBack<List<EMLanguage>>() {
        @Override
        public void onSuccess(List<EMLanguage> languages) {
            for (EMLanguage language : languages) {
                Log.d("Translation", language.LanguageCode + ": " + language.LanguageName);
            }
        }

        @Override
        public void onError(int code, String description) {
            Log.e("Translation", code + ": " + description);
        }
    });
```

`fetchSupportLanguages()` 的成功回调返回 `List<EMLanguage>`。以下字段名的首字母为大写：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `LanguageCode` | `String` | 语言编码，例如 `zh-Hans`。 |
| `LanguageName` | `String` | 语言名称。 |
| `LanguageLocalName` | `String` | 该语言的本地显示名称。 |

## 按需翻译

接收方调用 `translateMessage()` 翻译收到的文本消息。翻译成功后，从回调返回消息的文本消息体中读取译文。按需翻译不会将译文自动发送给对端。

以下 `message` 为收到的普通文本消息：

```java
List<String> languages = Arrays.asList("en", "ja");
EMClient.getInstance().chatManager().translateMessage(
    message, languages, new EMValueCallBack<EMMessage>() {
        @Override
        public void onSuccess(EMMessage translatedMessage) {
            EMTextMessageBody body = (EMTextMessageBody) translatedMessage.getBody();
            for (EMTextMessageBody.EMTranslationInfo item : body.getTranslations()) {
                Log.d("Translation", item.languageCode + ": " + item.translationText);
            }
        }

        @Override
        public void onError(int code, String description) {
            Log.e("Translation", code + ": " + description);
        }
    });
```

## 设置自动翻译

创建文本消息时设置目标语言，再发送消息。SDK 会先翻译，再将原文与译文一起发送。

调用文本消息体的 `setTargetLanguages()` 方法设置目标语言。以下为单聊示例：

```java
EMMessage message = EMMessage.createTextSendMessage("你好", "user2");
EMTextMessageBody body = (EMTextMessageBody) message.getBody();
body.setTargetLanguages(Arrays.asList("en", "ja"));
EMClient.getInstance().chatManager().sendMessage(message);
```

## 接收并展示译文

接收方收到文本消息后，可以读取译文并选择展示语言。没有所需语言的译文时，可回退展示原文。

在消息接收回调中，对普通文本消息调用 `getTranslations()`。以下 `receivedMessage` 为收到的普通文本消息：

```java
EMTextMessageBody body = (EMTextMessageBody) receivedMessage.getBody();
for (EMTextMessageBody.EMTranslationInfo item : body.getTranslations()) {
    Log.d("Translation", item.languageCode + ": " + item.translationText);
}
// 原文可通过 body.getMessage() 获取。
```

`EMTextMessageBody.getTranslations()` 返回 `List<EMTextMessageBody.EMTranslationInfo>`：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `languageCode` | `String` | 译文的语言编码。 |
| `translationText` | `String` | 译文文本。 |

目标语言通过 `setTargetLanguages(List<String>)` 设置，通过 `getTargetLanguages()` 获取。

## 注意事项

- 翻译仅适用于普通文本消息。v5.x 的 [复合消息](/document/android/message_send.html#发送复合消息) 不支持按需翻译，也不会自动翻译其中的文本消息体。
- 翻译失败时，通过 `EMValueCallBack.onError()` 或消息发送回调获取错误；按需翻译应在 `onSuccess()` 中读取结果。
- 如需设置离线推送的展示语言，参见 [设置推送翻译](/document/android/push/push_translation.html) 。

## 常见错误

v4.x 和 v5.x 的以下翻译错误码一致，错误名称以对应平台的错误码文档为准。更多错误参见 [v4.x 错误码](/v4/android/error.html) 和 [v5.x 错误码](/document/android/error.html) 。

| 错误码 | 错误信息 | 描述 | 可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- | :--- |
| 1110 | `TRANSLATE_PARAM_INVALID` | 翻译参数错误。 | 传入的翻译参数不符合接口要求。 | 结合错误描述和 SDK 日志检查翻译接口的参数；目标语言应使用查询接口返回的有效语言编码。 |
| 1111 | `TRANSLATE_SERVICE_NOT_ENABLE` | 翻译服务未启用。 | 当前应用尚未开通翻译服务。 | 在 [环信控制台](https://console.easemob.com/user/login) 开通翻译服务后重试。 |
| 1112 | `TRANSLATE_USAGE_LIMIT` | 翻译用量达到上限。 | 当前应用的翻译额度已用尽。 | 联系环信商务续费或增加翻译用量后重试。 |
| 1113 | `TRANSLATE_MESSAGE_FAIL` | 消息翻译失败。 | 具体原因需结合错误描述和 SDK 日志确认。 | 保留错误码、错误描述和 SDK 日志，排查失败原因；若持续失败，联系技术支持。 |

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| `fetchSupportLanguages` | `EMChatManager` | 查询支持的语言。 |
| `translateMessage` | `EMChatManager` | 按需翻译普通文本消息。 |
| `setTargetLanguages / getTargetLanguages` | `EMTextMessageBody` | 设置/获取目标语言。 |
| `getTranslations` | `EMTextMessageBody` | 获取译文列表。 |
