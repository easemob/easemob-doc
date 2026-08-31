# Retrieve Push Binding Information

## Feature overview

Retrieves push binding information for all devices of the current user.

## Call frequency limit

The aggregate call frequency limit for this API, other user account management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-management).

## Request URL

```
GET https://{host}/{org_name}/{app_name}/users/{userId}/push/binding
```

| Parameter     | Type   | Description                           | Required |
| :------- | :----- | :----------------------------- | :------- |
| `userId` | String | User ID of the user whose push binding information to retrieve. | Yes       |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/users/XXXX/push/binding' \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{    
  "timestamp": 1688031327535,   
  "entities": [       
    {            
      "device_id": "8ce08cad-9369-XXXX-XXXX-695a0d247cda",      
      "device_token": "BAEAAAAAB.jkuDmf8hRUPDgOel-XXXX_XXXX_Ksoqxo8Y",  
      "notifier_name": "104410638"      
    }   
    {            
      "device_id": "8ce08cad-9369-XXXX-XXXX-695a0d247cda",      
      "device_token": "BAEAAAAAB.jkuDmf8hRUPDgOel-XXXX_XXXX_Ksoqxo8Y",  
      "notifier_name": "104410638"      
    }  
  ],    
  "action": "get",    
  "duration": 6
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field       | Type  | Description                                                         |
| :--------- | :---- | :----------------------------------------------------------- |
| `entities` | Array | List of push binding information for all devices of the current user. If none of the current user's devices has push binding information, an empty list is returned. |
| - `device_id`     | String | Mobile device identifier used by the server to identify the device and bind or unbind push information. |
| - `notifier_name` | String | Push certificate name. | 
| - `device_token`  | String | Push device token.|
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

## Error code

If the returned HTTP status code is not 200, the request fails. See [Common error codes](push_error.html) for possible causes.
