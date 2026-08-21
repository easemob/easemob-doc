# Retrieve the Translation Language List

## Feature overview

- This API retrieves the translation language list.
- Translation is provided by the Microsoft Azure Translation API. Before you begin, make sure you understand the supported target languages. For details, see [Language support](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support).

## Feature activation

Text message translation is a value-added service. To use this feature, **contact the EasyIM business manager to enable it**.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/translate/support/language
```

For descriptions of the other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X GET "https://XXXX/XXXX/XXXX/translate/support/language"  \
-H "Authorization: Bearer <YourAppToken>" 
```

## Request header fields

For a description of the `Authorization` field, see [Request header field descriptions](overview.html#request-header-fields).

## Response example

The following examples show English, Greek, and Divehi:

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

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter            | Type   | Description                 |
| :-------------- | :----- | :------- | 
| `code`  | String | The language code.    |
| `name`  | String | The language name. |
| `nativeName`  | String | The name of the language in its place of origin. For example, English is called `English` in the United Kingdom.| 

If the returned HTTP status code is not `200`, the request fails. See [Error code](error.html) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error message                  | Possible cause    | Recommendation      |
|:---------|:----------------------|:--------|:----------|
| 400   | The request has reached the maximum limit  | The call frequency exceeds the limit.    | Contact the EasyIM business manager to increase the limit, or reduce the call frequency.      |
| 400   | InternalTranslateFailedException                  | An error occurred in the Microsoft Azure translation service.   |       |
| 503   | service not open                  | The translation service is not enabled.    | Translation is a value-added service. Contact the EasyIM business manager to enable it before calling the API.      |
