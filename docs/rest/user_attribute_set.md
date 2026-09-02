# Set User Attributes

User attributes are information about users in real-time messaging interactions, such as nicknames, avatars, email addresses, phone numbers, gender, signatures, and birthdays.

For example, in a recruitment scenario, user attributes can store gender, email address, user type such as interviewee, and job type such as web development. You can query the user attribute information stored on the server when viewing user information.

EasyIM provides RESTful APIs for managing server-side user attributes.

:::tip
To protect user information, EasyIM allows only the user or an app admin to set the user's attributes.
:::

## Feature overview

- Set the attributes of a user.
- User attributes consist of one or more plain-text key-value pairs.
- By default, the total length of a user's attributes cannot exceed 2 KB, and the total length of all user attributes in an app cannot exceed 10 GB.
- The request example uses the keys `avatarurl`, `ext`, and `nickname`. Determine the keys and values based on your use case.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

| Parameter              | Type   | Required | Description                |
| :---------------- | :----- | :------- | :------------------ |
| `username`  | String | Yes       | User ID whose attributes are to be set. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server
curl -X PUT 'https://XXXX/XXXX/XXXX/metadata/user/user1'  \
-H 'Content-Type: application/x-www-form-urlencoded'  \
-H 'Authorization: Bearer <YourAppToken>'   \
-d 'avatarurl=http://easyim.ai/avatar.png&ext=ext&nickname=nickname' 
```

## Request header fields

| Parameter            | Type   | Required | Description                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | Yes       | Content type. Set it to `application/x-www-form-urlencoded`. |

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

The request body is of the `x-www-form-urlencoded` type and contains the following fields:

| Field    | Type   | Description     | Required |
| :------ | :----- | :------- | :------- |
| `Key`   | String | Attribute name | Yes       |
| `Value` | String | Attribute value | Yes       |

For user attributes, the client uses the following default keys for the user nickname, avatar URL, contact information, email address, gender, signature, birthday, and extension field. When setting user attributes through this RESTful API, use these same keys so that the client can retrieve the settings. Determine the values based on your use case:

| Field | Description |
| :---------- | :-------------------------------------- |
| `nickname`  | User nickname, up to 64 characters. |
| `avatarurl` | User avatar URL, up to 256 characters. |
| `phone`     | User contact information, up to 32 characters. |
| `mail`      | User email address, up to 64 characters. |
| `gender`    | User gender:<br/> - `1`: Male.<br/> - `2`: Female.<br/> - `0`: Unknown. |
| `sign`      | User signature, up to 256 characters. |
| `birth`     | User birthday, up to 64 characters. |
| `ext`       | Extension field. |

## Response example

```json
{
  "timestamp": 1620445147011,
  "data": {
    "ext": "ext",
    "nickname": "nickname",
    "avatarurl": "http://easyim.ai/avatar.png"
  },
  "duration": 166
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type | Description                                                       |
| :----- | :--- | :--------------------------------------------------------- |
| `data` | JSON | Response data details, containing the user attribute key-value pairs set in this request. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`        | Long   | Duration from sending the HTTP request to receiving the response, in milliseconds. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

### Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type | Error message | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | The user attribute feature is not activated. | Contact the business manager to activate the user attribute feature. |
| 403     | FORBIDDEN         | size of metadata for this single user exceeds the user defined limit, {}Bytes        | User attribute usage for a user exceeds the limit. By default, the total length of a user's attributes cannot exceed 2 KB. | Reduce usage or contact the business manager to increase the limit. |
| 403     | FORBIDDEN         | size of metadata for this single user exceeds the current mysql column size, {}Bytes        | A user attribute exceeds its field length limit. For field length limits, such as the user nickname limit, see [Set user attributes](/rest/user_attribute_set.html). | Reduce the length of the user attribute field. |
| 403     | FORBIDDEN          | total size of user metadata for this app exceeds the user defined limit, {}Bytes        | User attribute usage for the entire app exceeds the limit. By default, the total length of all user attributes in an app cannot exceed 10 GB. | Reduce usage or contact the business manager to increase the limit. |
| 409 | CONFLICT | Failed to xxx. Concurrent xxx not allowed | Concurrent requests are modifying the same resource. | Reduce concurrent request operations. |
| 415 | UNSUPPORTED_MEDIA_TYPE | Content-Type 'application/json;charset=UTF-8' is not supported. | The specified `Content-Type` is not supported because a JSON request body was used. | Change `Content-Type` to `application/x-www-form-urlencoded` and submit the request body as form data. |
| 500     | INTERNAL_SERVER_ERROR          | update metadata failed        | A server error caused the user attribute update to fail. |     |

For other errors, see [Response status codes](error.html) for possible causes.
