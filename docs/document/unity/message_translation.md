# 翻译

<Toc />

为方便用户在聊天过程中对文字消息进行翻译，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持在发送或接收消息时对文本消息进行按需翻译或自动翻译：

- 按需翻译：接收方在收到文本消息后，将消息内容翻译为目标语言。
- 自动翻译：发送方发送消息时，SDK 根据发送方设置的目标语言自动翻译文本内容，然后将消息原文和译文一起发送给接收方。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 `1.0.5 或以上版本` SDK 初始化，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
3. 已在 [环信即时通讯云控制台](https://console.easemob.com/user/login) 开通翻译功能。
4. 该功能由 Microsoft Azure Translation API 提供，因此开始前请确保你了解该功能支持的目标语言。详见 [翻译语言支持](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support)。

## 技术原理

SDK 支持你通过调用 API 在项目中实现如下功能：

- `FetchSupportLanguages` 获取支持的翻译语言；
- 按需翻译：接收方在收到文本消息后调用 `TranslateMessage` 进行翻译；
- 自动翻译：发送方发送消息之前设置 `TextBody` 中的 `TargetLanguages` 字段为目标语言，然后发送消息，接收方会收到消息原文和译文。

## 实现方法

### 获取翻译服务支持的语言

无论是按需翻译还是自动翻译，都需先调用 `FetchSupportLanguages` 获取支持的翻译语言。示例代码如下：

```C#
// 获取翻译服务支持的语言。
SDKClient.Instance.ChatManager.FetchSupportLanguages(new ValueCallBack<List<SupportLanguage>>(
     onSuccess: (list) =>
     {
         Debug.Log($"FetchSupportLanguages found total: {list.Count}");
         foreach (var lang in list)
         {
             Debug.Log($"code: {lang.LanguageCode}, name:{lang.LanguageName}, nativename:{lang.LanguageNativeName}");
         }
     },
     onError: (code, desc) =>
     {
         Debug.Log($"FetchSupportLanguages failed, code:{code}, desc:{desc}");
     }
    ));
```

### 按需翻译

接收方调用 `TranslateMessage` 对收到的文本消息进行翻译。翻译调用过程如下：

```C#
SDKClient.Instance.ChatManager.TranslateMessage(msg, targetLanguages, new ValueCallBack<Message>(
 onSuccess: (dmsg) =>
 {
     Debug.Log($"TranslateMessage success.");
     TextBody tb = (TextBody)dmsg.Body;
     foreach(var it in tb.Translations)
     {
         Debug.Log($"Translate, lang:{it.Key}, result:{it.Value}");
     }

 },
 onError: (code, desc) =>
 {
     Debug.Log($"TranslateMessage failed, code:{code}, desc:{desc}");
 }
));
```

### 设置自动翻译

创建消息时，发送方设置 `TextBody` 中的 `TargetLanguages` 字段为译文语言，设置过程如下：

```C#
Message msg = Message.CreateTextSendMessage(to, text);
TextBody tb = (TextBody)msg.Body;
tb.TargetLanguages = languageList;
```

发送时消息原文和译文一起发送。

接收方收到消息后，接收方从 `TextBody` 中获取消息的译文列表，示例代码如下：

```C#
TextBody tb = (TextBody)msg.Body;
foreach(var it in tb.Translations)
{
  Debug.Log($"Translate, lang:{it.Key}, result:{it.Value}");
}
```
