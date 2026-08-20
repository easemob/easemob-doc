# Retrieve Chat Groups in an App

## Feature overview

- Retrieve information about chat groups in an app by page.
- For the number of chat groups supported by an app, see [IM plan features](/product/product_package_feature.html).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups?limit={N}&cursor={cursor}
```

The query parameters in the request URL are described as follows:

| Parameter     | Type   | Required | Description                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `limit`  | Int    | No       | Number of chat groups to return per page. The value range is [1,1000], and the default is `10`. If the value exceeds `1000`, the server still returns 1000 chat groups per page. |
| `cursor` | String | No       | Cursor that specifies where to start the query. For the first request, omit `cursor`; the server returns the number of chat groups specified by `limit` in reverse chronological order of creation. For each subsequent request, pass the `cursor` value returned by the previous response. |

:::tip
If `limit` and `cursor` are omitted, the EasyIM server returns the first 10 chat groups in reverse chronological order of creation.
:::

For details about the parameter description in the request URL, see [Request structure](overview.html#request-structure).

## Request example

First page

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups?limit=2'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

Second page

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups?limit=2&cursor=ZGNXXXX6Mg'  \
-H 'Accept: application/json'  \ 
-H 'Authorization: Bearer <YourAppToken>' 
```

## Response example

```json
{
  "action": "get",
  "params": {
    "limit": ["2"]
  },
  "uri": "https://XXXX/XXXX/XXXX/chatgroups",
  "entities": [],
  "data": [
    {
      "owner": "XXXX#testapp_user1",
      "groupid": "10XXXX60",
      "affiliations": 2,
      "type": "group",
      "lastModified": "1441021038124",
      "groupname": "testgroup1"
    },
    {
      "owner": "XXXX#testapp_user2",
      "groupid": "10XXXX76",
      "affiliations": 1,
      "type": "group",
      "lastModified": "1441074471486",
      "groupname": "testgroup2"
    }
  ],
  "timestamp": 1441094193812,
  "duration": 14,
  "cursor": "Y2hhdGdyb3VwczplYXNlbW9iLWRlbW8vY2hhdGRlbW91aV8z",
  "count": 2
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field                 | Type   | Description                                     |
| :------------------- | :----- | :--------------------------------------- |
| `data` | JSON Array | Response data. |
|  - `owner`         | String | The user ID of the group owner. For example: {"owner": "user1}. |
|  - `groupid`       | String | Chat group ID.                                |
|  - `affiliations`  | int    | Current number of chat group members. |
|  - `type`          | String | Chat group type. The value is "group". |
|  - `lastModified` | String | The timestamp of the last modification, in milliseconds.       |
|  - `groupname`     | String | Chat group name. |

The other fields are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | Request method. |
| `params.limit`          | JSON | Number of chat groups requested per page. |
| `uri`             | String | Request URL. |
| `entities`        | JSON Array   | Response entities. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `cursor`             | String | Query cursor, specify the starting position of the next query.       |
| `count`              | Int    | Actual number of chat groups returned. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | resource_not_found | grpID XX does not exist! | The chat group does not exist. | Use a valid chat group ID. |

For other errors, see [Response status codes](error.html) for possible causes.
