# Webhook Data Stored on the Chat Server

## Feature overview

Webhook data stored on the chat server is a value-added service for post-delivery webhooks and **must be purchased and activated separately**. When a post-delivery webhook cannot be delivered because of a webhook URL connection timeout, business server response timeout, temporary webhook rule ban, or another exception, this service temporarily stores the undelivered webhook message to prevent message loss. It is suitable for business scenarios that require high message reliability and retention of webhook data for subsequent compensating processing when an exception occurs. **The service stores only failed webhooks that meet the exception storage conditions. Successfully delivered messages are not stored.**

## Limitations

- Stored webhook data is retained for 3 days by default. Query and redeliver it within this period.
- Limit redelivery retries for a single set of stored data to no more than 10.
- Webhook data stored on the chat server provides only a compensating capability for exceptional scenarios. It does not replace business-side safeguards for webhook processing accuracy, consumption acknowledgment, and overall reliability.

## Activate the service

To use webhook data stored on the chat server, first activate the service in the console. For details, see [EasyIM Console activation entry](/product/console/basic_webhook.html#webhook-data-storage).

After the service is activated, when a post-delivery webhook fails and meets the exception storage conditions, the system archives failed webhook messages by time slice and **generates a date key every 10 minutes to identify a set of failed webhooks**. First call the [query API](#query-stored-webhook-data) to obtain webhook data available for redelivery, and then call the [redelivery API](#redeliver-stored-webhook-data) based on the returned result to compensate for data in exceptional scenarios.

## Query stored webhook data

This API queries sets of webhook data placed in the storage queue because of webhook exceptions under the current App Key. The system generates a date key every 10 minutes to identify the failed webhook set in the corresponding time slice. You can use the date key to query and redeliver the data.

### Request URL

```http
GET https://{host}/{org_name}/{app_name}/callbacks/storage/info
```

For the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

### Request example

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/callbacks/storage/info' \
-H 'Authorization: Bearer <YourAppToken>'
```

### Request header fields

For the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

### Response example

```json
{
  "path": "/callbacks",
  "uri": "https://XXXX/XXXX/XXXX/callbacks",
  "timestamp": 1631193031254,
  "organization": "XXXX",
  "application": "8dfb1641-XXXX-XXXX-bbe9-d8d45a3be39f",
  "action": "post",
  "data": [
    {
      "date": "202109091440",
      "size": 15,
      "retry": 0
    },
    {
      "date": "202109091450",
      "size": 103,
      "retry": 1
    }
  ],
  "duration": 153,
  "applicationName": "XXXX"
}
```

### Response body fields

HTTP status code `200` indicates that the query is successful.

The `data` field is described in the following table:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `data` | JSON Array | List of stored data sets. Each element corresponds to a time slice available for redelivery. |
| - `date` | String | Date key of the current set. It represents a 10-minute time slice and is set to the start time of that slice. |
| - `size` | Int | Number of webhook messages stored under the current date key. |
| - `retry` | Int | Number of redeliveries performed for the current set. The value is `0` if no redelivery has been performed. |

Other response fields are described in the following table:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `path` | String | Request path. |
| `uri` | String | Full request URI. |
| `timestamp` | Long | Unix timestamp when the EasyIM server receives the request, in milliseconds. |
| `organization` | String | Unique identifier of the organization registered in the EasyIM Console, corresponding to `org_name` in the console. |
| `application` | String | Unique identifier of the app registered in the EasyIM Console. |
| `action` | String | Request method. |
| `duration` | Long | Request duration, in milliseconds. |
| `applicationName` | String | Name of the app registered in the EasyIM Console. |

An HTTP status code other than `200` indicates that the request failed. See [Error code](#error-code) in this document for troubleshooting.

## Redeliver stored webhook data

This API redelivers stored webhook messages for a specified date key.

### Request URL

```http
POST https://{host}/{org_name}/{app_name}/callbacks/storage/retry
```

For the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

### Request example

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/callbacks/storage/retry' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "date": "202108272230",
    "retry": 0,
    "targetUrl": "https://localhost:8000/test"
}'
```

### Request header fields

For the `Content-Type` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

### Request body fields

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `date` | String | Yes | Date key corresponding to the data set to redeliver. The key is the start time of a 10-minute time slice. |
| `retry` | Int | No | Number of retries for the current redelivery request. Because redelivery may still fail, your business should maintain and control this value based on actual conditions. The initial value is `0`. |
| `targetUrl` | String | No | Target webhook URL for this redelivery. If this field is omitted or empty, the webhook URL configured in the original webhook rule is used. |

### Response example

```json
{
  "path": "/callbacks",
  "uri": "https://XXXX/XXXX/XXXX/callbacks",
  "timestamp": 1631194031721,
  "organization": "XXXX",
  "application": "8dfb1641-XXXX-XXXX-bbe9-d8d45a3be39f",
  "action": "post",
  "data": "success",
  "duration": 225,
  "applicationName": "XXXX"
}
```

### Response body fields

HTTP status code `200` indicates that the redelivery request was received successfully. The response body contains the following fields:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `path` | String | Request path. |
| `uri` | String | Full request URI. |
| `timestamp` | Long | Unix timestamp when the EasyIM server receives the request, in milliseconds. |
| `organization` | String | Unique identifier assigned by EasyIM to each company (organization), matching the `org_name` request parameter. |
| `application` | String | Unique identifier of the app registered in the EasyIM Console. |
| `action` | String | Request method. |
| `data` | String | Redelivery result: `success` indicates that the request succeeded, and `failure` indicates that the request failed. |
| `duration` | Long | Request duration, in milliseconds. |
| `applicationName` | String | App name. |

An HTTP status code other than `200` indicates that the redelivery request failed. See [Error code](#error-code) for possible causes.

## Error code

| Status code | Description |
| :--- | :--- |
| `200` | The request succeeded. |
| `400` | Invalid request parameters. Check them based on the returned information. |
| `401` | Authentication failed or the user has insufficient permissions. |
| `403` | The service is not activated or the current account has insufficient permissions. |
| `429` | Requests are too frequent. Try again later. |
| `500` | Internal server error. |
