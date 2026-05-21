# 检测文本的源语言

## 功能说明

- 检测要翻译的文本的源语言。
- 该接口与 [翻译消息内容](message_translation_text.html) 接口的翻译共享翻译配额。

## 功能开通

文本翻译为增值服务，如需使用请先在 [环信控制台开通](/product/console/purchase_value_added.html#消息翻译)。

单次翻译请求最多支持 10,000 字符。计费字符数按 **源文本字符数 × 目标语言数量** 计算。例如，将 500 字符翻译为 4 种语言，则计费字符数为 2000 字符。

若传入的文本超过上限，则上报错误 400，错误提示为 “The input text is too long”。

该服务的费用详见 [计费策略](/product/pricing_policy.html#消息翻译)。

## 调用频率上限

100 次/秒/App Key
  
## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/translate/detect
```

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -i -X POST "https://XXXX/XXXX/XXXX/translate/detect"   \
-H 'Content-Type: application/json'  \
-H "Authorization: Bearer <YourAppToken>"   \
-d '{
  "text": "你好"
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `text`  | String | 是       | 需要检测语言的文本。     |

## 响应示例

```json
{
  "language": "zh-Hans",
  "score": 0.98,
  "isTranslationSupported": true
}
```

## 响应 body 参数

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数            | 类型   | 描述                 |
| :-------------- | :----- | :------- |
| `language`  | String | 检测出的文本的目标语言。    |
| `score`  | Int | 检测出的语言与实际相符的可能性。 | 
| `isTranslationSupported`  | String | 是否支持翻译该类语言的文本：<br/> - `true`：支持 <br/> - `false`：不支持 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误提示                  | 可能原因    | 处理建议      |
|:---------|:----------------------|:--------|:----------|
| 400   | An input text is missing or invalid  | 请求中的 `text` 参数未传入或传入的内容无效。    | 请求中的 `text` 参数必传，且需要传入有效字符。      |
| 400   | The input text is too long                  | 请求中的 `text` 参数传入的内容太长。    | 请求中的 `text` 参数最多可传入 10,000 个字符。|
| 400   | The request has reached the maximum limit  | 调用频率超过限制    | 请联系商务提升频率限制或降低调用频率。      |
| 400   | InternalTranslateFailedException                  | Microsoft Azure 翻译服务出错。   |       |
| 503   | service not open                  | 翻译服务未开通。    | 翻译服务为增值服务。调用接口前，请先联系商务开通翻译服务。      |