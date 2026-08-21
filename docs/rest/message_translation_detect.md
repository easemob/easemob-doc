# Detect the Source Language of Text

## Feature overview

- Detect the source language of the text to translate.
- This API and the [Translate message content](message_translation_text.html) API share the same translation quota.

## Feature activation

Text translation is a value-added service. To use it, first enable [message translation in the EasyIM Console](/product/console/purchase_value_added.html#message-translation).

A single translation request supports up to 10,000 characters. The number of billable characters is calculated as **the number of source text characters × the number of target languages**. For example, translating 500 characters into 4 languages counts as 2000 billable characters.

If the input text exceeds the limit, error `400` is reported with the error message “The input text is too long”.

For the service fees, see [Pricing policy](/product/pricing_policy.html#message-translation).

## Call frequency limit

100 requests per second per App Key
  
## Request URL

```http
POST https://{host}/{org_name}/{app_name}/translate/detect
```

For descriptions of the other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -i -X POST "https://XXXX/XXXX/XXXX/translate/detect"   \
-H 'Content-Type: application/json'  \
-H "Authorization: Bearer <YourAppToken>"   \
-d '{
  "text": "你好"
}'
```

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `text`  | String | Yes       | The text whose language you want to detect.     |

## Response example

```json
{
  "language": "zh-Hans",
  "score": 0.98,
  "isTranslationSupported": true
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter            | Type   | Description                 |
| :-------------- | :----- | :------- |
| `language`  | String | The detected language of the text.    |
| `score`  | Int | The probability that the detected language matches the actual language. | 
| `isTranslationSupported`  | String | Whether translation is supported for text in this language:<br/> - `true`: Supported.<br/> - `false`: Not supported. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](error.html) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error message                  | Possible cause    | Recommendation      |
|:---------|:----------------------|:--------|:----------|
| 400   | An input text is missing or invalid  | The `text` parameter is missing from the request or its content is invalid.    | The `text` parameter is required and must contain valid characters.      |
| 400   | The input text is too long                  | The content passed in the `text` parameter is too long.    | Pass no more than 10,000 characters in the `text` parameter.|
| 400   | The request has reached the maximum limit  | The call frequency exceeds the limit.    | Contact the EasyIM business manager to increase the limit, or reduce the call frequency.      |
| 400   | InternalTranslateFailedException                  | An error occurred in the Microsoft Azure translation service.   |       |
| 503   | service not open                  | The translation service is not enabled.    | Translation is a value-added service. Contact the EasyIM business manager to enable it before calling the API.      |
