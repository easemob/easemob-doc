# Pricing Policy

This document describes the EasyIM pricing policy.

## Billing overview

EasyIM is billed monthly. On the first day of each month, the charges for the previous month are calculated, a bill is generated, and payment is automatically deducted.

EasyIM uses the following billing methods:

- **Prepaid**: One-time payment at the time of purchase. This applies to plans, plan add-ons, and value-added services.
- **Postpaid**: Billed monthly, with charges deducted on the 1st day of the following month. This applies to overage fees for plans and value-added services.

## Basic services

| Billing item | Billing method | Description |
| --- | --- | --- |
| Plan subscription fee | Prepaid | EasyIM offers Free, Professional, and Flagship plans. |
| Overage charges | Postpaid | Charges for usage exceeding the plan quota, based on peak Daily Active Users (DAU). |
| Add-on service fees | Prepaid | After purchasing the Professional or Flagship plan, you can separately activate features not included in the plan. Each add-on has its own billing rules. Add-ons include one-to-one and group chat message cloud storage, chat room message cloud storage, increased chat group member limits, presence subscriptions, pre-delivery webhooks, message Reactions, webhook failure storage, request quality monitoring, and increased server API call limits. |

### Plan subscription fees

- During testing, an app uses the Free plan by default after it is [created](/product/console/app_create.html). You can upgrade a app of the development version to the Professional or Flagship plan free of charge. Development apps remain subject to trial restrictions.
- Before you [launch an app](/product/console/app_launch.html), you must select the Professional or Flagship plan.

Automatic renewal is enabled by default for all paid plans. When a plan expires, you can also place a new order in EasyIM Console for the same plan or a different plan.

:::tip
For the differences between plans, see [Plan Feature Comparison](product_package_feature.html).
:::

| Plan | Price | Billing method | Description |
| --- | --- | --- | --- |
| Free | Free | — | Supports chat scenarios with up to 100 users. Includes basic messaging, conversation, chat group, and chat room features, and allows free subscriptions to value-added services. You can upgrade to the Professional or Flagship plan. |
| Professional | $364/month | Prepaid | Required for production apps and subscribed to monthly. The subscription is valid from the purchase date to the corresponding date in the following month. Supports 10,000 DAU and core one-to-one chat, group chat, and chat room capabilities, including message sending and retrieval, message receipts, targeted messages, conversation lists and marks, and chat group/chat room and member management. You can upgrade to the Flagship plan. |
| Flagship | $840/month | Prepaid | Required for production apps and subscribed to monthly. The subscription is valid from the purchase date to the corresponding date in the following month. Supports 10,000 DAU. In addition to features of the Professional plan, it includes presence subscriptions, message reactions, broadcast messages, and other advanced features. |

### Overage charges

You are charged for actual usage that exceeds the allowance included in your plan.

| Service | Description | Billing method | Professional | Flagship |
| --- | --- | --- | --- | --- |
| Peak daily active users (DAU) | The highest number of active users reached in a single day | Postpaid | Includes 10,000 DAU. Additional usage is charged at $420 per 10,000 DAU per month. Any amount below 10,000 is rounded up to 10,000. | Includes 10,000 DAU. Additional usage is charged at $420 per 10,000 DAU per month. Any amount below 10,000 is rounded up to 10,000. |

### Add-on service fees

After purchasing the Professional or Flagship plan, you can activate the following add-ons based on your business requirements. Each add-on has its own billing rules.

| Service | Description | Billing method | Professional | Flagship |
| --- | --- | --- | --- | --- |
| [One-to-one and group chat message cloud storage](/product/console/basic_single_group_chat.html#message-storage-duration) | Includes historical message record files and roaming messages | Prepaid | 180 days: $210/month<br/>360 days: $420/month<br/>720 days: $840/month | 180 days: $105/month<br/>360 days: $315/month<br/>720 days: $735/month |
| [Chat room message cloud storage](/product/console/basic_chat_room.html#chat-room-message-storage-duration) | Includes historical message record files and roaming messages | Prepaid | 30 days: $210/month<br/>60 days: $420/month<br/>90 days: $630/month | 30 days: $210/month<br/>60 days: $420/month<br/>90 days: $630/month |
| [Chat group member limit](/product/console/basic_single_group_chat.html#maximum-members-per-chat-group) | Maximum number of members in each chat group in an app | Prepaid | Increase to 3,000 members: $210/month | Increase to 8,000 members: $210/month |
| [Presence](/product/console/basic_user.html#presence) | Subscribe to and query user presence | Prepaid | $420/month | Included |
| [Pre-delivery webhooks](/product/console/basic_webhook.html) | The EasyIM server notifies your app server before delivering a message, allowing it to process the message, for example, for content moderation. | Prepaid | $420/month | Included |
| [Message Reactions](/product/console/basic_message_conversation.html#message-reactions) | Add emoji reactions to messages for richer interactions | Prepaid | $252/month | Included |
| [Webhook data storage](/rest/callback_postsending_exception_storage.html) | High-reliability webhook delivery | Prepaid | $840/month | $840/month |
| [Server API call limits](/product/console/basic_restful_api_call.html) | Increase RESTful Server API call limits | Prepaid | $56/month/add-on package<br/>See [RESTful API Call Frequency Limits](/rest/limitationapi.html). | $56/month/add-on package<br/>See [RESTful API Call Frequency Limits](/rest/limitationapi.html). |

### Billing example

Suppose a customer subscribes to the Professional plan, reaches a peak DAU of 15,000 during the month, and activates webhook data storage on the first day of that month. The total EasyIM charge for the month is:

`$182 (Professional plan subscription) + $140 (DAU overage) + $280 (webhook data storage) = $602`
  