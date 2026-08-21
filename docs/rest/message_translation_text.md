# Translate Message Content

## Feature overview

- Translate the content of a text message.
- This API supports text messages only.

## Feature activation

Text message translation is a value-added service. To use this feature, **contact the EasyIM business manager to enable it**.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/translate
```

For descriptions of the other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

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

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `from`  | String | No   | The language code of the source language. You can call [Retrieve the translation language list](message_translation_language_list.html) to obtain source language codes.   | 
| `text`  | String | Yes   | The text to translate. A single request supports up to 10,000 characters. The actual number of billable characters is calculated as **the number of source text characters × the number of target languages**, that is, the number of characters in `text` multiplied by the number of languages in `to`. For example, if `text` contains 500 characters and `to` contains 4 target languages, the request counts as 500 × 4 = 2,000 billable characters.| 
| `to`  | Array | Yes   | The target language codes. You can call [Retrieve the translation language list](message_translation_language_list.html) to obtain the language codes.  | 

## Response example

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

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter            | Type   | Description                 |
| :-------------- | :----- | :------- | 
| `translations`  | JSON Array | The translation results.    |
| - `text`  | String | The translated text. |
| - `to`  | String | The target language code.| 

If the returned HTTP status code is not `200`, the request fails. See [Error code](error.html) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error message                  | Possible cause    | Recommendation      |
|:---------|:----------------------|:--------|:----------|
| 400   | An input text is missing or invalid  | The `text` parameter is missing from the request or its content is invalid.    | The `text` parameter is required and must contain valid content.      |
| 400   | The target language is missing or invalid  | The `to` parameter is missing from the request or its content is invalid.     | The `to` parameter is required and must contain valid content.     |
| 400   | The input text is too long                  | The content passed in the `text` parameter is too long.    | Pass no more than 10,000 characters in the `text` parameter. Calculate the character count by multiplying the number of text characters to translate by the number of target languages, that is, the number of characters in `text` multiplied by the number of target languages in `to`. For example, if `text` contains 500 characters and `to` contains 4 target language codes, the text counts as 2000 characters.    |
| 400   | The request has reached the maximum limit  | The call frequency exceeds the limit.    | Contact the EasyIM business manager to increase the limit, or reduce the call frequency.      |
| 400   | InternalTranslateFailedException                  | An error occurred in the Microsoft Azure translation service.   |       |
| 503   | service not open                  | The translation service is not enabled.    | Translation is a value-added service. Contact the EasyIM business manager to enable it before calling the API.      |
