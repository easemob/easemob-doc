# Proactive Text Moderation

## Feature overview

1. This REST API proactively moderates input text content.
2. The differences between this API and the [text moderation service](/value-added/moderation/moderation_rule_config.html#add-text-moderation-rules) are shown in the following table. Select the appropriate option for your business scenario.

|  Text moderation type     | Moderated content| Usage |  Service activation |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| Proactive text moderation REST API  | Text content passed by the business server.   | Call the text moderation API. The business server passes the text content to be moderated, and the EasyIM server moderates it and returns the result.| 1. [Activate the text moderation service](/value-added/moderation/moderation_enable.html) in the EasyIM Console.<br/> 2. Contact the EasyIM business manager to activate this API. |                                                          |
| Text moderation service            | Text messages sent by EasyIM.   | The text moderation service is ready to use. Based on your business moderation rules, configure [text moderation rules](/value-added/moderation/moderation_rule_config.html#add-text-moderation-rules) for one-to-one chat, chat group, or chat room conversations.  | [Activate the text moderation service](/value-added/moderation/moderation_enable.html) in the EasyIM Console.                                                         |

## Service activation

Before using this API, you need to:
 - [Activate the text moderation service](/value-added/moderation/moderation_enable.html) in the EasyIM Console.
 - **Contact the EasyIM business manager** to activate this API.

## Call frequency limit

- The default limit is 100 calls/second/App Key.
- You can increase this limit. A single add-on package provides 50 calls/second.
- For the call frequency limits of other APIs, see [REST API call frequency limits](limitationapi.html).

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/moderation/txt/check
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server
curl -X POST 'https://XXXX/XXX/XXX/moderation/txt/check' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "content":"【放心借】新户福利！抖音钱包-放心借为您下发了一张30天0息券，戳 https://z.douyin.com/3gq2Eis 拒收请回复R"
}'
```

### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

### Request body fields

| Parameter    | Type   | Required | Description           |
| :------ | :----- | :------- | :------------- |
| `content` | String | Yes       | Text content to moderate. The content length limit depends on the content moderation provider. |

## Response example

```json
{
    "code": 200,
    "data": {
        "type": "REJECT",
        "riskType": "广告:联系方式:网址", 
        "riskLabel": "AD",
        "exchangeText": "*********************************************************************",
        "sensitiveWords": [
            "【放心借】新户福利！抖音钱包-放心借为您下发了一张30天0息券，戳 https://z.douyin.com/3gq2Eis 拒收请回复R"
        ]
    },
    "meta": {
        "timestamp": 1753260864654,
        "requestId": ""
    }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field               | Type       | Description                           |
| :----------------- | :--------- | :----------------------------- |
| `code`             | Int        | Request status. If the request succeeds, `200` is returned. |
| `data`             | JSON Array | Data details in the response.                     |
| - `type`           | String     | Moderation result: <br/> - `PASS`: Passed, indicating that the text poses no risk.<br/> - `REVIEWED`: Suspected, indicating that the text may pose a risk.<br/> - `REJECT`: Rejected, indicating that the text poses a risk.<br/> - `UNKNOWN`: Unknown, indicating that the text risk is unknown. |
| - `riskType`       | String     | Risk type, for example, `无风险`, `涉政`, `仇恨言论`, `色情`, `成人内容`, `暴恐`, `违禁`, `广告`, `二维码`, or `未知`. |
| - `riskLabel`      | String     | Risk label, for example, `NONE`: None; `POLITICS`: Politics; `VIOLENCE`: Violence and terrorism; `PORN`: Pornography; `BAN`: Prohibited content; `ABUSE`: Abuse; `AD`: Advertising; `QR`: QR code; `UNKNOWN`: Unknown. |
| - `exchangeText`   | String     | Replacement text. The returned content of this field depends on the content moderation provider. |
| - `sensitiveWords` | JSON Array | Sensitive words contained in the moderated text content.   |
| - `probability`    | Double     | Maliciousness score for text moderation. A higher value indicates a higher degree of maliciousness. Only the Microsoft content moderation service provides this field.|
| `meta`             |            | Metadata.<br/> - `requestId`: String, reserved field that you can ignore.<br/> - `timestamp`: Long, Unix timestamp of the HTTP response in milliseconds. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](error.html) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type     | Error code | Error message                         | Possible cause                              | Recommendation              |
| :---------- | :----------- | :------- | :------------------------------- | :------------------------------------ | --------------------- |
| 401         | unauthorized |          | Unable to authenticate (OAuth)   | The token is invalid, expired, or incorrect. | Use a new token to access the API. |
| 400         | Bad request  | 4000005  | message content is empty or null | The message content is empty.                         | Pass the correct message content.    |
| 400         | Bad request  | 4000303  | orgName not found                | `org_name` is incorrect.                      | Pass the correct `org_name`.   |
| 400         | Bad request  | 4000303  | application not found            | `app_name` is incorrect.                        | Pass the correct `app_name`.  |
| 400         | Bad request  | 4000404  | text moderation not open         | Text moderation is not activated.                        | Before calling this API, go to the [EasyIM Console](https://console.easyim.ai/user/login) and [activate the text moderation service](/value-added/moderation/moderation_enable.html#activation-process).|
| 400         | Bad request  | 4000303  | text rule moderation not exist   | The moderation rule corresponding to this API does not exist. Contact the EasyIM business manager. After the API service is activated, the [EasyIM Console](https://console.easyim.ai/user/login) creates a separate rule for this API to moderate content. Do not delete this rule. | Contact the EasyIM business manager to create the text moderation rule corresponding to this API in the [EasyIM Console](https://console.easyim.ai/user/login).   |
| 400         | Bad request  | 4000404  | text rule moderation not active  | After the API service is activated, the [EasyIM Console](https://console.easyim.ai/user/login) creates a separate rule for this API to moderate content. Before using this API, you need to enable the rule. This error is reported if the rule is disabled.        | Before calling this API, go to the [EasyIM Console](https://console.easyim.ai/user/login) and [enable the text moderation rule corresponding to this API](/value-added/moderation/moderation_rule_config.html).   |
