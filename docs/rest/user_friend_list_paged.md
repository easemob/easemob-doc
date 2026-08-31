# Retrieve the Friend List with Pagination

## Feature overview

- Retrieve a specified user's friend list with pagination. The server returns friends in descending order by the time they were added, with the most recently added friends first.
- When retrieving a friend list, you can choose whether to return friend remarks.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/user/{username}/contacts?limit={N}&cursor={cursor}&needReturnRemark={true/false}
```

| Parameter      | Type      | Required | Description                                               |
|:--------|:--------|:-----|:-------------------------------------------------|
| `username`  | String | Yes       | User ID whose friend list is to be retrieved.  |
| `limit` | Int     | No    | Expected number of friends returned per request. The value range is [1,50]. This parameter is required only for paginated retrieval and defaults to `10`. |
| `cursor` | String  | No    | Starting position of the query. This parameter is required only for paginated retrieval. Omit `cursor` on the first call to retrieve the number of friends specified by `limit`. | 
| `needReturnRemark` | Boolean | No    | Whether to return friend remarks:<br/> - `true`: Return.<br/> - (Default) `false`: Do not return. |

## Request example

```shell
curl -L -X GET 'https://XXXX/XXXX/XXXX/user/XXXX/contacts?limit=10&needReturnRemark=true' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer  <YourAppToken>'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "uri": "http://XXXX/XXXX/XXXX/users/XXXX/rostersByPage",  
  "timestamp": 1706238297509,
  "entities": [],
  "count": 1,
  "action": "get",
  "data": {
    "contacts": [
      {
        "remark": null,
        "username": "username"
      }
    ]
  },
  "duration": 27
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field                       | Type     | Description             |
|:-------------------------|:-------|:---------------|
| `data`                   | Object | Returned friend list object.     |
| `data.contacts`          | Array  | Returned friend list data.      |
| `data.contacts.remark`   | String | Friend remarks.           |
| `data.contacts.username` | String | Friend user ID. |

The other fields are described below:

| Field                       | Type     | Description             |
|:-------------------------|:-------|:---------------|
| `uri`             | String | Request URL.              |
| `timestamp`       | Long   | Unix timestamp in milliseconds.     |
| `entities`           | Array | Response entities.        |
| `count`                  | Int    | Number of friends on the current page.     | 
| `action`             | String | Request method. |
| `duration`        | String | Request response time in milliseconds.      |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

| HTTP status code | Error type | Error message          | Possible cause                               | Recommendation                 |
|:---------| :--- | :------------- |:-----------------------------------|:---------------------|
| 401      | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token.       |
| 404      | service_resource_not_found | Service resource not found | The user ID whose friend list is being retrieved does not exist.   | Verify that the user ID whose friend list is being retrieved exists. |
| 400      | illegal_argument | getContacts | page size more than max limit : 50 | The specified number of friends per page, `limit`, exceeds 50. | Reduce the value of `limit`. | 
