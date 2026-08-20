# Post-Delivery Callback

## Feature overview

The post-delivery callback sends the corresponding event to your business server in real time after a message is sent successfully. It applies to chat messages sent through the SDK or RESTful API, including one-to-one, group, and chat room messages, as well as various operation events.

The post-delivery callback is commonly used in the following scenarios:

- Synchronize messages with a business system in real time for data coordination or auditing;
- Trigger automatic replies, bot processing, or business workflow orchestration based on message content;
- Promptly archive chat history, offline messages, or business event data on the app server.

:::tip
1. If your business does not have strict real-time message synchronization requirements, use the free [RESTful API for downloading chat history files](message_historical.html#historical-message-content) to obtain historical messages. You do not need to activate the post-delivery callback.
2. If anti-spam or sensitive word filtering is activated for the app, a message that is identified and intercepted is not sent successfully and therefore does not trigger the post-delivery callback.
:::

![](/images/server-side/im-callback1.png)

## Scope

The post-delivery callback applies to message callbacks in one-to-one chats, group chats, and chat rooms, and supports messages sent through a client SDK or RESTful API. In addition to message callbacks, it supports callbacks for some server-side and client-side operation events, such as user login and logout, message-related events, and chat group and chat room operation events. The actual supported event scope is determined by the [callback rule settings in the Easemob Console](/product/console/basic_webhook.html#configure-message-callback-rules).

## Activation and configuration

Before using the post-delivery callback, complete the following configuration:

1. In the [Easemob Console](https://console.easemob.com/user/login), [activate the callback service](/product/console/basic_webhook.html).
2. Configure callback rules based on your business requirements. For example, provide an accessible HTTP or HTTPS callback URL to receive callback requests initiated by the EasyIM server. For details, see [Callback rule configuration](/product/console/basic_webhook.html#configure-message-callback-rules).

After you complete this configuration, when a message is sent or a related event occurs, the EasyIM server sends a callback to your business server according to the configured rules.

## Callback rules

To use the post-delivery callback, first configure callback rules in the [Easemob Console](https://console.easemob.com/user/login). For details, see [Callback rule configuration](/product/console/basic_webhook.html#configure-message-callback-rules).

For the same app, you can configure separate callback rules for chat messages and offline messages. If your business needs both callback types, use separate callback URLs to facilitate server decoupling, log tracing, and troubleshooting. If the callback types share the same callback URL, use the `eventType` field in the request body to distinguish them.

## Callback latency

Post-delivery callback latency is the time between when the EasyIM message server receives a message and when the message is successfully sent to your specified business server through a callback.

The service objective is to deliver 99.95% of callback requests within 30 seconds.

## Retry and banning mechanisms

### Retry mechanism

After the EasyIM server sends a request to your callback URL, if the received HTTP response status code is not `200`, the callback is considered failed and one retry is triggered immediately.

The default retry policy is as follows:

- Each callback message is retried only 1 time;
- The retry occurs immediately after the first callback attempt fails;
- If the retry also fails, the callback is no longer delivered automatically.

If [Callback Data Stored on the Chat Server](callback_postsending_exception_storage.html) is activated, callback messages whose retries fail are stored for subsequent queries and redelivery.

### Banning mechanism

If, within 30 seconds, the cumulative number of failures reaches 90, the system temporarily bans the app's callback rules.

The banning rules are as follows:

- Within 24 hours, consecutive bans are counted up to 5 times. Any bans beyond 5 are still counted as 5;
- Ban 1 lasts 5 minutes;
- From ban 2 through ban 5, the duration increases according to “number of bans × 5 minutes”;
- After ban 5, the duration remains fixed at 25 minutes.

The corresponding ban durations are as follows:

| Number of bans | Ban duration |
| :--- | :--- |
| 1 | 5 minutes |
| 2 | 10 minutes |
| 3 | 15 minutes |
| 4 | 20 minutes |
| 5 and later | 25 minutes |

:::tip
1. Neither **callback messages whose retries fail** nor **callback messages generated while callback rules are banned** are automatically recovered by the system. You can recover them using the historical message feature.
2. If your business has strict requirements that callback messages not be lost, activate [Callback Data Stored on the Chat Server](callback_postsending_exception_storage.html), and use the [query stored callback data](callback_postsending_exception_storage.html#query-stored-callback-data) and [redeliver stored callback data](callback_postsending_exception_storage.html#redeliver-stored-callback-data) APIs for compensating processing.
:::

## Callback example

### Callback request

After a message is sent or a related event occurs, the EasyIM server sends an `HTTP/HTTPS POST` request to your business server. The request body is a `UTF-8`-encoded JSON string.

To allow your server to verify the request, the EasyIM server signs the callback request. The current signature algorithm is MD5, implemented by `org.apache.commons.codec.digest.DigestUtils#md5Hex`.

#### Request example

```json
{
  "callId": "XXXX-demo#XXXX-dp01-XXXX-8696-cf3b48b20e7e",
  "eventType": "chat_offline",
  "timestamp": 1600060847294,
  "chat_type": "groupchat",
  "group_id": "169XXXX21545",
  "from": "user1",
  "to": "user2",
  "msg_id": "8924312242322",
  "payload": {
    // Specific message content
  },
  "securityVersion": "1.0.0",
  "security": "2ca02c394bef9e7abc83958bcc3156d3"
}
```

#### Request parameters

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `callId` | String | Unique callback identifier in the format `{appkey}_{uuid}`, where `uuid` is a randomly generated unique value. |
| `eventType` | String | Callback event type:<br/> - `chat`: Chat message;<br/> - `chat_offline`: Offline message.  |
| `timestamp` | Long | Unix timestamp when the EasyIM server receives the message, in milliseconds. |
| `chat_type` | String | Conversation type:<br/> - `chat`: One-to-one chat;<br/> - `groupchat`: Group chat, including message callbacks for chat groups and chat rooms. All are selected by default.|
| `group_id` | String | ID of the chat group containing the message. This field is returned only when `chat_type` is `groupchat`. |
| `from` | String | Message sender. |
| `to` | String | Message recipient. |
| `msg_id` | String | Message ID. |
| `payload` | Object | Message content, with the same message body structure as a message sent through the RESTful API. For details, see [Message format](message_historical.html#historical-message-content). |
| `securityVersion` | String | Security verification version, currently fixed as `1.0.0`. This field can currently be ignored. |
| `security` | String | Request signature calculated as `MD5(callId + Secret + timestamp)`. For information about configuring `Secret`, see [Callback rule configuration](/product/console/basic_webhook.html#configure-message-callback-rules). |

### Callback response

The EasyIM server does not validate the response body. The callback is considered processed successfully as long as your business server returns HTTP status code `200`.

When processing a callback request, your business server must meet the following requirements:

- The response body cannot exceed 1,000 characters;
- If oversized response content is returned continuously and, within 30 seconds, reaches a total of 90 occurrences, [callback rule banning](#banning-mechanism) may also be triggered.
