# Query Monthly RTC Usage

## Feature overview

This API queries the aggregated real-time communication (RTC) usage data for a specified App Key in the current calendar month, helping you understand the current month's resource consumption and remaining available usage.

You can retrieve the following information through this API:

- Total RTC usage for the current month.
- Free usage included in the current plan.
- Remaining balance of currently available add-on packages.

:::tip
1. The total RTC usage for the current month returned by this API is refreshed hourly. Other data is updated in real time.
2. This is a query API and does not modify the app's RTC configuration or billing status.
:::

## Service activation

Before calling this API, activate the RTC service. For details, see [RTC service activation](/callkit/android/product_purchase.html), [subscription](/callkit/android/product_purchase.html), and [billing](/product/pricing_policy.html#real-time-audio-and-video).

## Call frequency limit

10 calls/10 seconds/App Key. The limit cannot be adjusted.

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/billing/rtc/usage-summary?appKey={org_name}%23{app_name}
```

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `appKey` | String | Yes | App Key to query. The format is `{org_name}#{app_name}`. URL-encode it when passing it in the request URL, where `#` is encoded as `%23`. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/billing/rtc/usage-summary?appKey={org_name}%23{app_name}' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

- When the RTC service is activated for the app and usage data is available, the response example is as follows:

```json
{
  "data": {
    "appKey": "hx#hxdemo",
    "planId": 9,
    "billingItemId": 49,
    "discountUsageMinutes": 500000,
    "fuelBagRemain": 0,
    "freeUsageMinutes": 120000
  },
  "meta": {
    "timestamp": 1780300500400
  }
}
```

- When the RTC service is not activated for the app, the response example is as follows:

```json
{
  "data": {
    "appKey": "hx#hxdemo2",
    "planId": null,
    "billingItemId": null,
    "discountUsageMinutes": 0,
    "fuelBagRemain": 0,
    "freeUsageMinutes": null
  },
  "meta": {
    "timestamp": 1780300691379
  }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful.

The `data` field is described as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `data` | JSON | RTC usage data for the current month. |
| `data.appKey` | String | App Key currently being queried. |
| `data.planId` | Number | Plan ID. If empty, the RTC service is not activated for the current app. |
| `data.billingItemId` | Number | Billing item ID. If empty, the RTC service is not activated for the current app. |
| `data.discountUsageMinutes` | Number | Total RTC usage for the current month, in minutes. |
| `data.fuelBagRemain` | Number | Current available add-on package balance, in minutes. |
| `data.freeUsageMinutes` | Number | Free usage included in the plan, in minutes. If empty, the RTC service is not activated for the current app. |

The `meta` field is described as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `meta` | JSON | Request metadata. |
| `meta.timestamp` | Number | Response time as a Unix timestamp in milliseconds. |
