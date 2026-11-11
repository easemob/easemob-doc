# 消息翻译

## 功能说明

为方便用户在聊天过程中翻译文本消息，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持以下两种方式：

- 按需翻译：接收方收到文本消息后，将消息内容翻译为目标语言。
- 自动翻译：发送方设置目标语言后，SDK 在发送消息前翻译文本，将原文和译文一起发送给接收方。

如下为按需翻译示例：

![img](/images/ios/translation.png)

## 功能开通

消息翻译为增值服务，使用前请先在 [环信控制台开通](/product/console/purchase_value_added.html#消息翻译) 。

单次翻译请求最多支持 10,000 个字符。计费字符数按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 个字符翻译为 4 种语言，计费字符数为 2,000。

该服务的费用详见 [计费策略](/product/pricing_policy.html#消息翻译) 。

## 前提条件

- 完成 Unity SDK 1.0.5 初始化，详见 [初始化](/document/unity/initialization.html) 并登录成功。
- 已 [开通消息翻译服务](#功能开通) ，并了解 IM API 的 [使用限制](/product/limitation.html) 。
- 目标语言使用服务支持的语言编码，语言范围参见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support) 。

## 获取翻译服务支持的语言

你可以调用 `FetchSupportLanguages()` 查询翻译服务支持的语言，并从返回结果中选取目标语言编码。无论是按需翻译还是自动翻译，都需要在翻译前确认目标语言受支持。

已知有效语言编码时，无需在每次翻译前重复查询。

```csharp
SDKClient.Instance.ChatManager.FetchSupportLanguages(
    new ValueCallBack<List<SupportLanguage>>(
        onSuccess: languages =>
        {
            foreach (var language in languages)
            {
                Debug.Log($"{language.LanguageCode}: {language.LanguageName}");
            }
        },
        onError: (code, description) =>
        {
            Debug.LogError($"{code}: {description}");
        }));
```

`FetchSupportLanguages()` 的成功回调返回 `List<SupportLanguage>`：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `LanguageCode` | `string` | 语言编码，例如 `zh-Hans`。 |
| `LanguageName` | `string` | 语言名称。 |
| `LanguageNativeName` | `string` | 该语言的原生名称。 |

## 按需翻译

接收方调用 `TranslateMessage()` 翻译收到的文本消息。翻译成功后，从回调返回消息的文本消息体读取译文；结果不会自动发送给对端。

```csharp
// receivedMessage 为收到的普通文本消息。
var languages = new List<string> { "en", "ja" };
SDKClient.Instance.ChatManager.TranslateMessage(
    receivedMessage, languages, new ValueCallBack<Message>(
        onSuccess: translatedMessage =>
        {
            var body = (MessageBody.TextBody)translatedMessage.Body;
            if (body.Translations != null)
            {
                foreach (var item in body.Translations)
                {
                    Debug.Log($"{item.Key}: {item.Value}");
                }
            }
        },
        onError: (code, description) =>
        {
            Debug.LogError($"{code}: {description}");
        }));
```

## 设置自动翻译

创建文本消息时设置目标语言，再发送消息。SDK 会先翻译，再将原文与译文一起发送。

通过文本消息体的 `TargetLanguages` 设置目标语言。以下为单聊示例：

```csharp
Message message = Message.CreateTextSendMessage("user2", "你好");
var body = (MessageBody.TextBody)message.Body;
body.TargetLanguages = new List<string> { "en", "ja" };
SDKClient.Instance.ChatManager.SendMessage(ref message, new CallBack(
    onSuccess: () => { Debug.Log("发送成功"); },
    onError: (code, description) => { Debug.LogError($"{code}: {description}"); }
));
```

## 接收并展示译文

接收方收到文本消息后，可以读取译文并选择展示语言。没有所需语言的译文时，可回退展示原文。

在消息接收回调中，读取普通文本消息体的 `Translations`：

```csharp
// receivedMessage 为消息接收回调中的普通文本消息。
var body = (MessageBody.TextBody)receivedMessage.Body;
string displayText = body.Text;
if (body.Translations != null && body.Translations.TryGetValue("en", out var translation))
{
    displayText = translation;
}
Debug.Log(displayText);
```

文本消息体为 `MessageBody.TextBody`：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `Text` | `string` | 原文。 |
| `TargetLanguages` | `List<string>` | 目标语言编码列表。 |
| `Translations` | `Dictionary<string, string>` | 语言编码到译文的映射；使用前判断是否为空。 |

## 注意事项

- 翻译仅适用于文本消息；示例中的 `receivedMessage` 应来自消息接收回调或本地消息查询。
- 翻译和发送失败时，请在回调的 `onError` 中处理错误。
- 本页使用 `AgoraChat` 命名空间中的类型。示例所需集合类型来自 `System.Collections.Generic`，日志使用 `UnityEngine.Debug`。

## 常见错误

[Unity 错误码](/document/unity/error.html) 和 [Windows 错误码](/document/windows/error.html)一致，两端的常见翻译错误如下表所示：

| 错误码 | 错误信息 | 描述 | 可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- | :--- |
| 1110 | `TRANSLATE_PARAM_INVALID` | 翻译参数错误。 | 传入的翻译参数不符合接口要求。 | 结合错误描述和 SDK 日志检查翻译接口的参数；目标语言应使用查询接口返回的有效语言编码。 |
| 1111 | `TRANSLATE_SERVICE_NOT_ENABLE` | 翻译服务未启用。 | 当前应用尚未开通翻译服务。 | 在 [环信控制台](https://console.easemob.com/user/login) 开通翻译服务后重试。 |
| 1112 | `TRANSLATE_USAGE_LIMIT` | 翻译用量达到上限。 | 当前应用的翻译额度已用尽。 | 联系环信商务续费或增加翻译用量后重试。 |
| 1113 | `TRANSLATE_MESSAGE_FAIL` | 消息翻译失败。 | 具体原因需结合错误描述和 SDK 日志确认。 | 保留错误码、错误描述和 SDK 日志，排查失败原因；若持续失败，联系技术支持。 |

## 接口列表

| API | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| `FetchSupportLanguages` | `ChatManager` | 查询支持的语言。 |
| `TranslateMessage` | `ChatManager` | 按需翻译文本消息。 |
| `TargetLanguages` | `MessageBody.TextBody` | 设置/获取目标语言。 |
| `Translations` | `MessageBody.TextBody` | 获取译文映射。 |
