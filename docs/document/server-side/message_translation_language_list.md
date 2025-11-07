# 获取翻译语言列表

## 功能说明

- 该接口获取翻译语言列表。
- 翻译功能由 Microsoft Azure Translation API 提供，开始前请确保你了解该功能支持的目标语言。详见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。

## 功能开通

文本消息翻译为增值服务，要使用该功能，你需要 **联系环信商务开通**。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/translate/support/language
```

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例 

```shell
curl -X GET "https://XXXX/XXXX/XXXX/translate/support/language"  \
-H "Authorization: Bearer <YourAppToken>" 
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

以下分别是英语、希腊语和马尔代夫语的示例：

```json
  [
    {
      "code": "en",
      "name": "English",
      "nativeName": "English"
    },
    {
      "code": "el",
      "name": "Greek",
      "nativeName": "Ελληνικά"
    },
    {
      "code": "dv",
      "name": "Divehi",
      "nativeName": "ދިވެހިބަސް"
    }
  ]
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数            | 类型   | 描述                 |
| :-------------- | :----- | :------- | 
| `code`  | String | 语言代码。    |
| `name`  | String | 语言名称。 |
| `nativeName`  | String | 语言在其起源地的名称，例如，英语在英国称为 `English`。| 

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误提示                  | 可能原因    | 处理建议      |
|:---------|:----------------------|:--------|:----------|
| 400   | The request has reached the maximum limit  | 调用频率超过限制    | 请联系商务提升频率限制或降低调用频率。      |
| 400   | InternalTranslateFailedException                  | Microsoft Azure 翻译服务出错。   |       |
| 503   | service not open                  | 翻译服务未开通。    | 翻译服务为增值服务。调用接口前，请先联系商务开通翻译服务。      |