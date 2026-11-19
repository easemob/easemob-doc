# 消息翻译

消息翻译是环信即时通讯 IM 的增值服务，基于 Microsoft Azure Translation API，可将文本消息翻译为一种或多种目标语言。你可以通过客户端 SDK 或服务端 RESTful API，将翻译能力集成到应用中，帮助使用不同语言的用户沟通。

## 适用场景

- **跨语言聊天**：在单聊或群聊中，将文本消息翻译为用户使用的语言。
- **多语言客服**：将用户与客服之间的文本消息翻译为各自熟悉的语言，便于沟通。
- **多语言内容展示**：为同一条文本消息提供多种语言的译文，按用户的语言偏好展示。

## 翻译能力

客户端 SDK 提供按需翻译和自动翻译两种使用方式：

| 使用方式 | 说明 |
| :--- | :--- |
| 按需翻译 | 接收方收到文本消息后，按需将消息内容翻译为目标语言。翻译结果供当前用户读取和展示，不会自动发送给对端。 |
| 自动翻译 | 发送方设置目标语言后，SDK 在发送消息前翻译文本，将原文和译文一起发送给接收方。 |

服务端 RESTful API 提供 [翻译消息内容](message_translation_text_rest.html)、[获取翻译语言列表](message_translation_language_list_rest.html) 和 [检测文本的源语言](message_translation_detect_rest.html) 三个接口，可用于在业务服务器中处理翻译请求。

## 使用限制

- 消息翻译适用于普通文本消息；复合消息及其中的文本消息体不支持消息翻译。
- 单次翻译请求最多支持 10,000 个字符。
- 目标语言必须使用服务支持的语言编码。你可以通过客户端 SDK 或 [获取翻译语言列表](message_translation_language_list_rest.html) 接口查询，语言范围详见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。
- 各平台支持的 SDK 版本、接口参数及调用方式以对应的 [服务集成文档](#集成入口) 为准。服务端接口的调用频率限制详见 [RESTful API 调用频率限制](/document/server-side/limitationapi.html)。

## 开通与计费

使用前，请在环信控制台的 **增值服务** > **消息翻译** 中联系环信商务开通，详见 [开通说明](/product/console/purchase_value_added.html#消息翻译)。

消息翻译服务提供总计 50 万字符的免费试用额度。付费服务按套餐订阅费用和超量使用费用计费，计费字符数按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 个字符翻译为 4 种语言，计费字符数为 2,000。

收费标准分别参见 [国内计费说明](message_translation_billing_domestic.html) 和 [海外计费说明](message_translation_billing_overseas.html)。

测试版应用已开通消息翻译服务时，上线后继续生效，并按正式版规则计费。若上线后暂不需要该服务，请在上线前关闭，详见 [测试版应用试用说明](/product/console/purchase_value_added.html#测试版应用试用说明)。

## 集成入口

开通服务后，选择对应平台的服务集成文档：

| 平台 | 文档 |
| :--- | :--- |
| Android | [Android 集成文档](message_translation_android.html) |
| iOS | [iOS 集成文档](message_translation_ios.html) |
| Web/小程序 | [Web/小程序集成文档](message_translation_web.html) |
| HarmonyOS | [HarmonyOS 集成文档](message_translation_harmonyos.html) |
| Flutter | [Flutter 集成文档](message_translation_flutter.html) |
| React Native | [React Native 集成文档](message_translation_react-native.html) |
| Unity/Windows | [Unity/Windows 集成文档](message_translation_unity.html) |
| 服务端 | [翻译消息内容](message_translation_text_rest.html)、[获取翻译语言列表](message_translation_language_list_rest.html)、[检测文本的源语言](message_translation_detect_rest.html) |
