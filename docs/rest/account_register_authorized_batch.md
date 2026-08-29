# Register Users in Batches with Authorization

## Feature overview

- Batch registration uses authorized registration. The server must validate a valid app token before performing the operation.
- You can register up to 60 user IDs in a single request.
- User IDs and passwords must meet the relevant requirements when you register users.

## Configure authorized registration

To use authorized registration, set the user registration mode on the **Chat > Features > User & Login** page in [EasyIM Console](https://console.easyim.ai/user/login).

## Call frequency limit

The aggregate call frequency limit for this API, other user management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-management).

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users
```

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example 1

Register 2 users:

```shell
# Replace <YourAppToken> with the app token generated on your server

curl -X POST -H "Authorization: Bearer <YourAppToken>" -i  "https://XXXX/XXXX/XXXX/users" -d '[{"username":"user1", "password":"123"}, {"username":"user2", "password":"456"}]'
```

## Response example 1

```json
{
  "action": "post",
  "application": "22bcffa0-XXXX-XXXX-9df8-516f6df68c6d",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "278b5e60-XXXX-XXXX-8f9b-d5d83ebec806",
      "type": "user",
      "created": 1541587920710,
      "modified": 1541587920710,
      "username": "user1",
      "activated": true
    },
    {
      "uuid": "278bac80-XXXX-XXXX-b192-73e4cd5078a5",
      "type": "user",
      "created": 1541587920712,
      "modified": 1541587920712,
      "username": "user2",
      "activated": true
    }
  ],
  "timestamp": 1541587920714,
  "data": [],
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## Request example 2

If the request body contains a previously registered user, user 3, registration fails for user 3, and the failure is returned in the `data` array in the response body. Users 1 and 2 are still registered successfully.

```shell
# Replace <YourAppToken> with the app token generated on your server

curl -X POST -i  "https://XXXX/XXXX/XXXX/users"  \
-H "Authorization: Bearer <YourAppToken>"  \
-d '[
      {"username":"user1", "password":"123"}, 
      {"username":"user2", "password":"456"}, 
      {"username":"user3", "password":"789"}
  ]'
```

## Response example 2

```json
{
  "action": "post",
  "application": "22bcffa0-XXXX-XXXX-9df8-516f6df68c6d",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/testapp/users",
  "entities": [
    {
      "uuid": "278b5e60-XXXX-XXXX-8f9b-d5d83ebec806",
      "type": "user",
      "created": 1541587920710,
      "modified": 1541587920710,
      "username": "user1",
      "activated": true
    },
    {
      "uuid": "278bac80-XXXX-XXXX-b192-73e4cd5078a5",
      "type": "user",
      "created": 1541587920712,
      "modified": 1541587920712,
      "username": "user2",
      "activated": true
    }
  ],
  "timestamp": 1541587920714,
  "data": [
    {
      "username": "user3",
      "registerUserFailReason": "the user3 already exists"
    }
  ],
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Request body fields

| Parameter       | Type   | Required | Description        |
| :--------- | :----- | :------- | :----------------------------- |
| `username` | String | Yes       | The user ID. The length cannot exceed 64 bytes, and the value cannot be empty. The following character set is supported:<br/>- 26 lowercase English letters, a-z;<br/>- 10 digits, 0-9;<br/>- "\_", "-", and ".". <br/><Container type="notice" title="Notice"><br/>- Do not use uppercase English letters, A-Z. If you use both uppercase and lowercase letters, the user ID returned in the response contains only lowercase letters.<br/>- Make sure that each user ID is unique within an app.<br/>- A user ID is public information. Do not use sensitive information such as a UUID, email address, or phone number.</Container> |
| `password` | String | Yes       | The user's login password. The length cannot exceed 64 characters.      |

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `entities` field in the response body is described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `entities`        | JSON Array | The response entity.                                                   |
| - `uuid`          | String     | The user's UUID. EasyIM generates this unique internal identifier for the app or user in the request. It is used to generate a user token. |
| - `type`          | String     | The object type. You do not need to pay attention to this field.                                         |
| - `created`       | Long       | The Unix timestamp when the user was registered, in milliseconds.                         |
| - `modified`      | Long       | The Unix timestamp when the user information was last modified, in milliseconds.             |
| - `username`      | String     | The user ID.                                                    |
| - `activated`     | Bool       | Whether the user is active: - `true`: The user is active. - `false`: The user is banned. To use a banned user account, call [Unban a user](account_unban.html) to unban the user. |

The other fields in the response body are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | The request method.                                                                     |
| `application`     | String | The unique identifier of the app in the system. The identifier is generated by the system. You do not need to pay attention to this field.                     |
| `path`               | String | The request path, which is part of the request URL. You do not need to pay attention to this field.       |
| `uri`             | String | The request URL.                                                                     |
| `timestamp`       | Long   | The Unix timestamp, in milliseconds.                                                      |
| `duration`        | Int    | The time elapsed from sending the request to receiving the response, in milliseconds.                                           |
| `organization`    | String | The unique identifier that EasyIM assigns to each company or organization. This value is the same as the request parameter `org_name`. |
| `applicationName` | String | The app name you entered when creating the app in the EasyIM Console. This value is the same as the request parameter `app_name`. |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type   | Error message      | Possible cause   | Recommendation       |
| :----- | :----------- | :----| :-------| :---------------|
| 400         | illegal_argument                   | username XXX is not legal  | The username is invalid.| See the [username requirements](account_register_open.html). |
| 400         | illegal_argument                   | USERNAME_TOO_LONG    | The username exceeds the length limit. | See the [username requirements](account_register_open.html). |
| 400         | illegal_argument                   | password or pin must provided  | The `password` parameter is not provided in the request body for user registration.  | Provide `password` in the request body for user registration.  |
| 400         | illegal_argument                   | NICKNAME_TOO_LONG    | The push nickname of the user being registered exceeds the length limit.  | See the [username requirements](account_register_open.html). |
| 400         | duplicate_unique_property_exists   | Application XXX Entity user requires that property named username be unique, value of XXX exists | The username being registered already exists.  | Register the user again with a different username.  |
| 400         | duplicate_unique_property_exists   | the same user XXX has a different password, the passwords are XXX | The request body contains the same `username` with different passwords. | Modify the entries with the same `username` and register them again.    |
| 400         | illegal_argument                   | username [XXX] is not legal    | The `username` of the user being registered is invalid. | Register the user according to the username requirements. |
| 400         | illegal_argument                   | USERNAME_TOO_LONG      | The `username` of the user being registered exceeds the length limit.| Register the user according to the username requirements. |
| 400         | illegal_argument                   | password or pin must provided       | No password is provided when registering the user. | Provide a password for the user before registering.|
| 400         | illegal_argument                   | NICKNAME_TOO_LONG       | The `nickname` of the user being registered exceeds the length limit. | Register the user according to the push nickname requirements. |
| 400         | illegal_argument                   | Request body array size[XXX] had almost reached or been greater than the upper range value[XXX] | The number of users to register exceeds the limit.  | Change the number of users to register.  |
| 401         | unauthorized                       | token is illegal.     | The token is invalid. The information used to generate the token does not match the information carried in the request.  | Use a new token to access the API. |
| 401         | unauthorized                       | Unable to authenticate (OAuth)     | The token is invalid. It may have expired or be incorrect.  | Use a new token to access the API.  |
| 401         | unauthorized                       | Open registration doesn't allow, so register user need token, | A token is required to register users in authorized registration mode.  | Include a token in the request. |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist. | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |
| 429         | resource_limited                   | You have exceeded the limit of the community edition,Please upgrade to the enterprise edition | The number of registered users exceeds the limit of the current product plan. | The free plan supports up to 100 registered users. You can [upgrade to a paid plan](/product/pricing_method.html#subscribe-to-or-upgrade-a-plan). The Professional and Flagship plans have no limit on the number of registered users. |
