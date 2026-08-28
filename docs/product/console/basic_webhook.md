# Webhooks

After creating an app, you can enable webhooks and webhook data storage in [EasyIM Console](https://console.easyim.ai/user/login).

## Webhook overview

Before or after an event occurs, the IM Server sends a notification to your App Server through an HTTP POST request. Depending on whether the webhook can intervene in message delivery, webhooks are divided into two types:

- Pre-delivery webhook: After the IM Server receives an upstream one-to-one, group, or chat room message from a user and before delivering it to the target user, the IM Server notifies your App Server through an HTTP/HTTPS POST request. Your App Server can process users' chat messages in real time through pre-delivery webhooks, for example, by intercepting text, image, custom, and other message types.
- Post-delivery webhook: After a message is sent or a chat group-, chat room-, or friend-related operation is performed, the IM Server sends a webhook request to your App Server. This type of webhook is typically used when the app backend needs to implement required data synchronization.

## Activate the Service

### Webhooks

You can enable this service based on your current plan:

- Free: Click **Upgrade** to upgrade to the Professional or Flagship plan.
- Professional: Click **Buy Now** to purchase the service separately.
- Flagship: Click **Free Activation** to enable the service.

![img](/images/console/basic_message_webhook.png)

### Webhook data storage

For a post-delivery webhook, each failed webhook request is retried only once and discarded if the retry also fails. If webhook data must not be lost, you can enable webhook data storage on the IM Server.

After enabling the service, you can use the APIs to [query stored webhook data](/rest/callback_postsending_exception_storage.html#query-stored-webhook-data) and [resend stored webhook data](/rest/callback_postsending_exception_storage.html#redeliver-stored-webhook-data) APIs.

You can enable this service based on your current plan:

- Free: Click **Upgrade Now** to upgrade to the Professional/Flagship plan, and then click **Buy Now** to subscribe to the service separately.
- Professional/Flagship: Click **Buy Now** to subscribe to the service separately.

![img](/images/console/basic_message_webhook_storage.png)

## Configure webhook rules

You can configure up to four pre-delivery webhook rules and four post-delivery webhook rules. After you configure a webhook rule, the IM Server automatically generates a secret for the rule. When sending data to your App Server, the IM Server uses this secret to generate a signature, which is the `security` parameter in the request. Your server uses the signature to verify the IM Server. To use a custom secret, contact EasyIM sales.

:::tip
If you configured a pre-delivery or post-delivery webhook URL for a development app, check the URL after the app goes live and change it to the production URL as needed.
:::

### Pre-delivery webhook

On the **Webhook Settings** page, click **Add Webhook Address**. In the dialog box, select **Pre-delivery Webhook** and configure the relevant fields.

![img](/images/console/basic_presending_rule.png)

#### Basic settings

| Field | Required | Description |
| :--- | :--- | :--- |
| Rule Name | Yes | Supports Chinese and English characters and can contain up to 32 characters. The rule name must be unique. |
| Conversation Type | Yes | Conversation type:<br/>- **1-on-1 chat**: A message before it is sent in a one-to-one conversation.<br/>- **Group chat**: A message before it is sent in a group conversation.<br/>- **Chat room**: A message before it is sent in a chat room conversation.<br/>- **Edit message**: A pending edit to a successfully sent message in a one-to-one, group, or chat room conversation. |
| Message Type | Yes | Message types supported by pre-delivery webhooks include text, image, video, location, voice, file, command, and custom messages. |
| Timeout | Yes | The backend timeout, which is 200 milliseconds by default. If the webhook times out without a response, the message is delivered normally by default. You can change the message processing logic. |
| Fallback Action | Yes | Whether to allow or reject the message when your server returns an invalid result or does not return a result within the timeout. |
| Report Error | Yes | Whether to notify the sender's SDK that message sending failed when a message is intercepted:<br/>- **Yes**: Notifies the sender's SDK. The sender is aware of the message sending failure.<br/>- **No**: Does not notify the sender's SDK. The sender is not aware of the message sending failure. |
| Status | Yes | Whether the webhook rule takes effect immediately:<br/>- **Enabled**: Takes effect immediately.<br/>- **Disabled**: Does not take effect yet.<br/>When creating a rule for the first time, we recommend setting it to **Disabled** and changing it to **Enabled** after your server is configured to verify requests. |

#### Webhook routing settings

Webhook routing routes different messages under the same App Key to different webhook URLs by environment.

| Field | Required | Description |
| :--- | :--- | :--- |
| Callback Env | Yes | Supports letters and digits only, with a maximum length of eight characters. The default value is `default` and cannot be deleted. |
| Callback URL | No | The maximum length is 512 characters. If left empty, webhooks are not triggered for this environment. |

Webhook routing applies as follows:

| Webhook type | Scope | Description |
| :--- | :--- | :--- |
| [Pre-delivery webhook](/rest/callback_presending.html) | Applies only to **messages sent through the SDK**. Targeted group and chat room messages are not supported. | Before a message is delivered to the target user, your server can determine whether to intercept the message or modify its content. |
| [Post-delivery webhook](/rest/callback_postsending.html) | Applies to **messages sent through both the SDK and REST API**. | Notifies your server after a message is successfully sent. |

Webhook routing is subject to the following configuration rules:

- You can configure up to eight routes for each webhook stage, including the `default` route.
- The webhook routes for pre-delivery and post-delivery webhooks are **independent**. Each stage maintains its own environment-to-URL mapping.

If a webhook environment is specified when sending a message, the route is selected as follows:

- If the message carries an environment value that exactly matches a valid route for the current stage, the message uses that route.
- If the message carries an environment value that does not match a valid route, **no webhook is triggered**. The `default` route **does not apply** in this case.
- If the message does not carry an environment value, it is automatically routed to the webhook URL for the `default` environment.
- If the same message needs to trigger both pre-delivery and post-delivery webhooks, configure the **same webhook environment value** for both stages. The message then needs to carry only one environment value for both webhooks to take effect. For example, if the pre-delivery webhook uses `test -> url1` and the post-delivery webhook uses `test -> url2`, the message only needs to carry the webhook environment value `test`.

### Post-delivery webhook

On the **Webhook Settings** page, click **Add Webhook Address**. In the dialog box, select **Post-delivery Webhook** and configure the relevant fields.

![img](/images/console/basic_postsending_rule.png)

#### Basic filters

| Field | Required | Description |
| :--- | :--- | :--- |
| Rule Name | Yes | Supports letters, digits, and underscores only. Chinese characters are not supported. The maximum length is 32 characters. The rule name must be unique. |
| Status | Yes | Whether to enable the rule. |
| Webhook Type | Yes | The webhook type. You can select webhooks for various types of one-to-one, group, and chat room messages and events. For details, see [Webhook Events](/rest/callback_message_send.html). |
| Message Type | Yes | The type to be included in webhooks:<br/>- **Chat message**: A successfully sent message, including messages sent through a client or REST API. These messages are consistent with those returned by exported chat history. For example, when user u1 sends a message to user u2, one chat message is generated regardless of whether the recipient is online. In the received message, `from` is u1 and `to` is u2. When user u1 sends a message in chat group g1, one chat message is generated. In the received message, `from` is u1 and `to` is g1, and the response contains the `group_id` field.<br/>- **Offline message**: A message for which the recipient was offline when it was sent. For example, in a one-to-one chat, an offline message is generated if the other user is offline. In a group chat, if several group members are offline, several offline messages are generated. The `to` parameter in these offline messages is the user ID of the message recipient, not the group ID. The app can use a push service to send personalized notifications for these messages. |
| Message Source | Yes | The source of messages to include in webhooks:<br/>- **SDK message**: A message sent through the SDK.<br/>- **Rest message**: A message sent through a REST API. |

#### Webhook routing

Webhook routing delivers different messages under the same App Key to different webhook URLs by environment.

| Field | Required | Description |
| :--- | :--- | :--- |
| Callback Env | Yes | Supports letters and digits only, with a maximum length of eight characters. The default value is `default` and cannot be deleted. |
| Callback URL | No | The maximum length is 512 characters. If left empty, webhooks are not triggered for this environment. |

Webhook routes are matched as follows:

- Message webhooks: Routed according to the webhook environment value carried in the message. The value must exactly match a valid route for the current stage.
- Event webhooks: Always use the webhook URL for the `default` environment and do not participate in environment matching.

Other configuration rules, such as route limits, dual-stage routing recommendations, and message-to-route matching, are the same as those for pre-delivery webhooks. For details, see [Webhook routing settings](#webhook-routing-settings).

#### Advanced filters

| Field | Required | Description |
| :--- | :--- | :--- |
| From ID | No | The user ID of the message sender or operator. Enter one per line, with a maximum of 50. If specified, webhooks are triggered only for messages sent and operations performed by these users, such as friend-, chat group-, or chat room-related operations. If not specified, no restriction applies. |
| To ID | No | The user ID of the recipient of a one-to-one message or event. Enter one per line, with a maximum of 50. If not specified, no restriction applies. |
| Group/Chat Room ID | No | A chat group or chat room ID. Enter one per line, with a maximum of 50. If specified, webhooks are triggered only for messages or events in these chat groups or chat rooms. If not specified, no restriction applies. |
| Extension Attribute Key | No | An attribute key in the message extension. Enter one per line, with a maximum of 50. If specified, webhooks are triggered only for messages containing the attribute key. If not specified, no restriction applies. |

**Advanced filter examples**

| Scenario | Configuration | Result |
| :--- | :--- | :--- |
| One-to-one webhooks only | Set **From ID** and **To ID**. | A webhook is triggered when the specified sender sends a one-to-one message to the specified recipient or performs an operation, such as deleting a friend. For example, if **From ID** is test1 and **To ID** is test2, a webhook notification is received when test1 sends a one-to-one message to test2. |
| Chat group/chat room webhooks only | Set only **Group/Chat Room ID**. | A webhook is triggered only when a message is sent or an operation is performed in the specified chat group or chat room. For example, if the chat group ID is 228978, a webhook notification is received only when a message is sent in that chat group. |
| Webhooks for a specific user in a chat group only | Set **From ID** and **Group/Chat Room ID**. | A webhook is triggered only when the specified user sends a message or performs an operation in the chat group or chat room. For example, if **From ID** is test1 and the chat group ID is 228978, a webhook notification is received only when test1 sends a message in that chat group. |

:::tip
If **From ID**, **To ID**, and **Group/Chat Room ID** are all set, **no webhook notification is received** when the sender sends a one-to-one or group message to the recipient because these settings are mutually exclusive.
:::

## Configure post-delivery webhook failure alerts

If the cumulative number of post-delivery webhook failures reaches the threshold within a specific period, the webhook rule for the app is disabled. To learn about post-delivery webhook failures promptly and take appropriate action, configure post-delivery webhook alerts to prevent the app's webhook rule from being disabled.

On the **Webhook Settings** page, click **Webhook Failure Alert**. In the dialog box, configure the alert fields.

![img](/images/console/basic_webhook_alert.png)

| Field | Required | Description |
| :--- | :--- | :--- |
| Alert Status | Yes | Whether to enable post-delivery webhook failure alerts. |
| Alert Strategy | Yes | - **Alert Interval**: The interval for triggering alerts, in increments of 5 minutes.<br/>- **Trigger Count**: The number of webhook failures that triggers an alert within the alert interval. |
| Email Address | Yes | Email addresses that receive post-delivery webhook failure alerts. Enter up to 20 addresses, one per line. |
