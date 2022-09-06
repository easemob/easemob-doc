# 翻译

[[toc]]

为方便用户在聊天过程中对文字消息进行翻译，环信即时通讯 IM SDK 集成了 Microsoft Azure Translation API，支持在发送或接收消息时对文本消息进行按需翻译或自动翻译：

- 按需翻译：接收方在收到文本消息后，将消息内容翻译为目标语言。

- 自动翻译：发送方发送消息时，SDK 根据发送方设置的目标语言自动翻译文本内容，然后将消息原文和译文一起发送给接收方。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 `1.0.6 以上版本` SDK 初始化，详见 [快速开始](../Unity/quick_start_unity.md)。
2. 了解环信即时通讯 IM API 的 [使用限制](https://docs-im.easemob.com/ccim/limitation)。
3. 已在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通翻译功能。
4. 该功能由 Microsoft Azure Translation API 提供，因此开始前请确保你了解该功能支持的目标语言。详见 [Language support](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/language-support)。

## 技术原理

SDK 支持你通过调用 API 在项目中实现如下功能：

- `FetchSupportLanguages` 获取支持的翻译语言；
- 按需翻译：接收方在收到文本消息后调用 `TranslateMessage` 进行翻译；
- 自动翻译：发送方发送消息之前设置 `TextBody` 中的 `TargetLanguages` 字段为目标语言，然后发送消息，接收方会收到消息原文和译文。

## 实现方法

### 获取翻译服务支持的语言

无论是按需翻译还是自动翻译，都需先调用 `FetchSupportLanguages` 获取支持的翻译语言。示例代码如下：

```csharp
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

```csharp
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

```csharp
Message msg = Message.CreateTextSendMessage(to, text);
TextBody tb = (TextBody)msg.Body;
tb.TargetLanguages = languageList;
```

发送时消息原文和译文一起发送。

接收方收到消息后，接收方从 `TextBody` 中获取消息的译文列表，示例代码如下：

```csharp
TextBody tb = (TextBody)msg.Body;
foreach(var it in tb.Translations)
{
  Debug.Log($"Translate, lang:{it.Key}, result:{it.Value}");
}
```

## 参考

### 设置和获取推送的目标语言

设置推送的目标语言，设置之后收到的离线推送就会是目标语言，如果目标语言在消息里不存在，就以原文推送，详见（https://docs-im.easemob.com/ccim/web/push#%E8%AE%BE%E7%BD%AE%E6%8E%A8%E9%80%81%E7%BF%BB%E8%AF%91）。

