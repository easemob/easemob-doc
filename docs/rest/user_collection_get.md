# Get User Favorites by Page

EasyIM lets you favorite successfully sent messages and other custom content. Favorites are stored permanently and can be viewed at any time. For example, to favorite a message attachment, first [set the message attachment to permanent storage](message_attachment_storage.html), and then add it to favorites so that its content remains available.

## Feature overview

Call this API to retrieve a specified user's favorites.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/collections  
```

| Parameter       | Type   | Required | Description                     |
| :--------- | :----- | :------- | ------------------------ |
| `username` | String | Yes       | User ID whose favorites are to be retrieved. |

The query parameters are described below:

User favorites can be queried in two ways. Except for the `type` and `limit` settings, configure the two methods as follows:
1. By time range: Use the time range fields with `direction`. You must pass `begin_time` and `end_time`. The default value of `direction` is `desc`, which sorts favorites by favorite time in descending order.
2. From a specified favorite ID: Use `collection_id` with `direction`. You must pass `collection_id`.

**Note: The second query method takes precedence over the first. If you pass `collection_id`, the specified `begin_time` and `end_time` fields do not take effect.**

| Parameter     | Type   | Required | Description  |
| :------- | :----- | :------- | :--------------- |
| `begin_time`  | Number   | No  | Query start time as a UNIX timestamp in milliseconds. The default is `0`. This field must be less than or equal to `end_time`. |
| `end_time`  | Number    | No | Query end time as a UNIX timestamp.<br/> - This field must be greater than or equal to `begin_time`. The default is the current system time. The unit is milliseconds.<br/> - If `end_time` equals `begin_time`, the server queries favorites at that point in time. |
| `direction`  | String   | No | Query direction:<br/> - (Default) `desc`: Sort by favorite time in descending order.<br/> - `asc`: Sort by favorite time in ascending order. |
| `type` | Int | No       | Favorite type. If this parameter is omitted, the favorite type is not restricted and all favorites that match the query criteria are returned. |
| `limit`  | Int    | No       | Number of favorites to query. The value range is [1,200], and the default is `100`. A value greater than `200` returns a parameter error. |
| `collection_id` | String | No       | Favorite ID. When this parameter is not empty:<br/> - If `direction` is `desc`, the server uses the current favorite's timestamp as the query end time and returns the current favorite and all favorites added before it in descending order by favorite time.<br/> - If `direction` is `asc`, the server uses the current favorite's creation timestamp as the query start time and returns the current favorite and all favorites created after it in ascending order by favorite time. |

## Request example

```shell
Replace <YourAppToken> with the App Token generated on your server 
curl -X GET https://XXX/XXX/XXX/users/{username}/collections    \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
    "collections": [
    {
    "id": "string",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0 
    }
  ]
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field     | Type | Description               |
| :------- | :--- | :----------------- |
| `collections` | JSON Array   | Details of the retrieved user favorites. |
| - `id` | String  | Favorite ID. |
| - `type` | Int  | Favorite type. |
| - `data` | String | Favorite content. |
| - `ext`| String  | Favorite extension information. |
| - `createdAt` | Long  | Favorite creation time. |
| - `updatedAt` | Long  | Favorite update time. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type | Error message | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | The user ID is invalid. | See the registered username [requirements](account_register_open.html). |
| 400         | illegal_argument  | limit should be less than 200   | The number of favorites per page specified by `limit` cannot exceed 200. | Set `limit` to no more than 200. |
| 400         | illegal_argument  | direction should be desc or asc   | The `direction` parameter is invalid. | Set `direction` to `desc` or `asc`. |
| 400         |     | user collection not found  | The user favorite was not found. | Pass an existing user favorite ID in `collection_id`. |

For other errors, see [Error codes](error.html) for possible causes.
