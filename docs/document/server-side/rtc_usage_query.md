# 查询实时音视频服务的当月用量

## 功能说明

该接口用于查询指定 App Key 在当前自然月内的实时音视频服务（RTC）用量汇总数据，帮助开发者了解当月资源消耗情况及剩余可用量。

通过该接口可获取以下信息：

- 当月 RTC 总用量。
- 当前套餐的免费用量。
- 当前可用加油包余量。

:::tip
1. 该接口返回的当月 RTC 总用量按小时刷新，其他数据实时更新。
2. 该接口为查询类接口，不会修改应用的 RTC 配置或计费状态。
:::

## 开通服务

调用该接口前，需要先开通 RTC 服务，详见 [RTC 服务的开通](/callkit/android/product_purchase.html)、[订阅](/callkit/android/product_purchase.html) 和 [计费](/product/pricing_policy.html#实时音视频)说明。

## 调用频率上限

10 次/10 秒/App Key，不支持调整上限。

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/billing/rtc/usage-summary?appKey={org_name}%23{app_name}
```

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `appKey` | String | 是 | 要查询的 App Key。格式为 `{org_name}#{app_name}`，传入请求 URL 时需进行 URL Encode，其中 `#` 编码为 `%23`。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/billing/rtc/usage-summary?appKey={org_name}%23{app_name}' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

- 当应用已开通 RTC 服务，且已有用量数据时，响应示例如下：

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

- 当应用未开通 RTC 服务时，响应示例如下：

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

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功。

`data` 字段说明如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `data` | JSON | RTC 当月用量数据。 |
| `data.appKey` | String | 当前查询的 App Key。 |
| `data.planId` | Number | 套餐 ID。若为空，表示当前应用未开通 RTC 服务。 |
| `data.billingItemId` | Number | 计费项 ID。若为空，表示当前应用未开通 RTC 服务。 |
| `data.discountUsageMinutes` | Number | 当月 RTC 总用量，单位为分钟。 |
| `data.fuelBagRemain` | Number | 当前可用加油包余量，单位为分钟。 |
| `data.freeUsageMinutes` | Number | 套餐免费用量，单位为分钟。若为空，表示当前应用未开通 RTC 服务。 |

`meta` 字段说明如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `meta` | JSON | 请求元信息。 |
| `meta.timestamp` | Number | 响应时间，Unix 时间戳，单位为毫秒。 |
