# 翻译消息内容

## 功能说明

- 翻译文本消息的内容。
- 该接口只支持文本消息。

## 功能开通

文本消息翻译为增值服务，要使用该功能，你需要 **联系环信商务开通**。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/translate
```

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](/document/server-side/overview.html#请求-url)。

## 请求示例

```shell
curl -X POST "https://XXXX/XXXX/XXXX/translate"  \
-H 'Content-Type: application/json'   \
-H "Authorization: Bearer <YourAppToken>"   \
-d '{
  "from": "zh-Hans",
  "text": "学习",
  "to": [
    "en",
    "zh-Hant"
  ]
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](/document/server-side/overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `from`  | String | 否   | 源语言的语言代码。你可以调用 [获取翻译语言列表](message_translation_language_list_rest.html) 获取源语言的语言代码。   | 
| `text`  | String | 是   | 需要翻译的文本。最多可传入 10,000 个字符。计算方法：需要翻译的文本字符数 x 目标翻译语言的数量，即 `text` 中的字符数 x `to` 中的目标语言数量。例如，你对 `text` 传入了 500 个字符，`to` 中传入了 4 种目标语言代码，则 `text` 中的文本字符数算作 2000。| 
| `to`  | Array | 是   | 目标语言的代码。你可以调用 [获取翻译语言列表](message_translation_language_list_rest.html) 获取源语言的语言代码。  | 

## 响应示例

```json
[
  {
    "translations": [
      {
        "text": "study",
        "to": "en"
      }
      {
        "text": "學習",
        "to": "zh-Hant"
      }
    ]
  }
]
```

## 响应 body 参数

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数            | 类型   | 描述                 |
| :-------------- | :----- | :------- | 
| `translations`  | JSON Array | 翻译结果。    |
| - `text`  | String | 翻译后的文本。 |
| - `to`  | String | 翻译目标语言的代码。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](/document/server-side/error.html) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误提示                  | 可能原因    | 处理建议      |
|:---------|:----------------------|:--------|:----------|
| 400   | An input text is missing or invalid  | 请求中的 `text` 参数未传入或传入的内容无效。    | 请求中的 `text` 参数必传，且需要传入有效字符。      |
| 400   | The target language is missing or invalid  | 请求中的 `to` 参数未传入或传入的内容无效。     |  请求中的 `to` 参数必传且传入有效内容。     |
| 400   | The input text is too long                  | 请求中的 `text` 参数传入的内容太长。    | 请求中的 `text` 参数最多可传入 10,000 个字符。计算方法：需要翻译的文本字符数 x 目标翻译语言的数量，即 `text` 中的字符数 x `to` 中的目标语言数量。例如，你对 `text` 传入了 500 个字符，`to` 中传入了 4 中目标语言代码，则 `text` 中的文本字符数算作 2000。    |
| 400   | The request has reached the maximum limit  | 调用频率超过限制    | 请联系商务提升频率限制或降低调用频率。      |
| 400   | InternalTranslateFailedException                  | Microsoft Azure 翻译服务出错。   |       |
| 503   | service not open                  | 翻译服务未开通。    | 翻译服务为增值服务。调用接口前，请先联系商务开通翻译服务。      |