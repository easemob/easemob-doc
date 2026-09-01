# Change the Password of a Single User

## Feature overview

- Change a user's login password without providing the original password.
- The new password cannot exceed 64 characters.
- If the user is online, changing the password forces the user offline.
- After the password is changed, the user's original password and user token become invalid. Client devices are affected as follows:
  - Online devices are forced offline when the password is changed. The user must log in with the new password or a newly obtained token.
  - Offline devices report an authentication failure when the user comes online. The user must log in with the new password or a newly obtained token.

## Call frequency limit

The aggregate call frequency limit for this API, other user account management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-management).

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/users/{username}/password
```

| Parameter            | Type   | Required | Description              |
| :-------------- | :----- | :------- | :---------------------------------------------- |
| `username`  | String | Yes       | The user ID whose login password you want to change.      |

For descriptions of the other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server

curl -X PUT 'https://XXXX/XXXX/XXXX/users/XXXX/password'   \
-H 'Accept: application/json'    \
-H 'Content-Type: application/json'    \
-H 'Authorization: Bearer <YourAppToken>'    \
-d '{
      "newpassword":"newPassword"
    }' 
```

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Request body fields

| Parameter     | Type   | Required | Description  |
| :------- | :----- | :------- | :--------------- |
| `newpassword`  | String | Yes       | The new password. The password must contain at least 6 characters.   |

## Response example

```json
{
  "action": "set user password",
  "timestamp": 1542595598924,
  "duration": 8
}
```

## Response body fields

| Field       | Type   | Description        |
| :------------ | :----- | :------------ |
| `action` | String | The response operation. `set user password` indicates the operation of changing a user's password. |
| `timestamp` | Number | The Unix timestamp of the HTTP response, in milliseconds. |
| `duration` | Number | The time elapsed from sending the HTTP request to receiving the response, in milliseconds.  |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type     | Error message   | Possible cause    | Recommendation     |
| :---------- | :--------------- | :------------- | :------------ | :-----|
| 401         | unauthorized    | Unable to authenticate (OAuth)    | The token is invalid. It may have expired or be incorrect. | Use a new token to access the API.  |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist.   | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |
| 404         | entity_not_found  | User null not found    | The user does not exist.  | Register the user first, or check whether the username is correct.    |
| 400         | illegal_argument  | "newpassword is required"   | The request body for changing the user's password does not include the `newpassword` property. |   |
