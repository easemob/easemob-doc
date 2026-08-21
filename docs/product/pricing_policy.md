# Pricing Policy

This document describes the EasyIM pricing policy.

## Billing overview

EasyIM is billed monthly. On the first day of each month, the charges for the previous month are calculated, a [bill](/product/console/account_center.html) is generated, and payment is automatically deducted.

EasyIM uses the following billing methods:

- **Prepaid**: Pay the full amount at the time of purchase. This applies to plans, plan add-ons, and value-added services.
- **Postpaid**: Charges are settled monthly and deducted on the first day of the following month. This applies to usage that exceeds the allowances included in a plan or value-added service.

## Basic services

| Billing item | Billing method | Description |
| --- | --- | --- |
| Plan subscription fee | Prepaid | EasyIM offers Free, Pro, and Enterprise plans. |
| Overage charges | Postpaid | Charges for usage exceeding the plan allowance, calculated based on peak daily active users (DAU). |
| Add-on service fees | Prepaid | After purchasing the Pro or Enterprise plan, you can separately activate features not included in the plan. Each add-on has its own billing rules. Add-ons include one-to-one and group chat message cloud storage, chat room message cloud storage, increased chat group member limits, presence subscriptions, pre-delivery webhooks, message reactions, webhook failure storage, request quality monitoring, and increased Server API call limits. |

### Plan subscription fees

- During testing, an app uses the Free plan by default after it is [created](/product/console/app_create.html). You can upgrade a test app to the Pro or Enterprise plan free of charge. Test apps remain subject to trial restrictions.
- Before you [launch an app](/product/console/app_launch.html), you must select the Pro or Enterprise plan.

Automatic renewal is enabled by default for all paid plans. When a plan expires, you can also place a new order in Easemob Console for the same plan or a different plan.

:::tip
For the differences between plans, see [Plan Feature Comparison](product_package_feature.html).
:::

| Plan | Price | Billing method | Description |
| --- | --- | --- | --- |
| Free | Free | — | Supports chat scenarios with up to 100 users. Includes basic messaging, conversation, chat group, and chat room features, and allows free subscriptions to value-added services. You can upgrade to the Pro or Enterprise plan. |
| Pro | CNY 1,299/month | Prepaid | Required for production apps and subscribed to monthly. The subscription is valid from the purchase date to the corresponding date in the following month. Supports 10,000 DAU and core one-to-one chat, group chat, and chat room capabilities, including message sending and retrieval, message receipts, targeted messages, conversation lists and marks, and chat group/chat room and member management. You can upgrade to Enterprise. |
| Enterprise | CNY 2,999/month | Prepaid | Required for production apps and subscribed to monthly. The subscription is valid from the purchase date to the corresponding date in the following month. Supports 10,000 DAU. In addition to Pro features, it includes presence subscriptions, message reactions, broadcast messages, and other advanced features. |

### Overage charges

You are charged for actual usage that exceeds the allowance included in your plan.

| Service | Description | Billing method | Pro | Enterprise |
| --- | --- | --- | --- | --- |
| Peak daily active users (DAU) | The highest number of active users reached in a single day | Postpaid | Includes 10,000 DAU. Additional usage is charged at CNY 1,000 per 10,000 DAU per month. Any amount below 10,000 is rounded up to 10,000. | Includes 10,000 DAU. Additional usage is charged at CNY 1,000 per 10,000 DAU per month. Any amount below 10,000 is rounded up to 10,000. |

### Add-on service fees

After purchasing the Pro or Enterprise plan, you can activate the following add-ons based on your business requirements. Each add-on has its own billing rules.

| Service | Description | Billing method | Pro | Enterprise |
| --- | --- | --- | --- | --- |
| [One-to-one and group chat message cloud storage](/product/console/basic_message.html) | Includes historical message record files and roaming messages | Prepaid | 180 days: CNY 500/month<br/>360 days: CNY 1,000/month<br/>720 days: CNY 2,000/month | 180 days: CNY 250/month<br/>360 days: CNY 750/month<br/>720 days: CNY 1,750/month |
| [Chat room message cloud storage](/product/console/basic_message.html) | Includes historical message record files and roaming messages | Prepaid | 30 days: CNY 500/month<br/>60 days: CNY 1,000/month<br/>90 days: CNY 1,500/month | 30 days: CNY 500/month<br/>60 days: CNY 1,000/month<br/>90 days: CNY 1,500/month |
| [Chat group member limit](/product/console/basic_conversation_group_chatroom.html) | Maximum number of members in each chat group in an app | Prepaid | Increase to 3,000 members: CNY 500/month | Increase to 8,000 members: CNY 500/month |
| [Presence subscriptions](/product/console/basic_user.html) | Subscribe to and query user presence | Prepaid | CNY 1,000/month | Included |
| [Pre-delivery webhooks](/product/console/basic_webhook.html) | The EasyIM server notifies your app server before delivering a message, allowing it to process the message, for example, for content moderation. | Prepaid | CNY 1,000/month | Included |
| [Message reactions](/product/console/basic_message.html) | Add emoji reactions to messages for richer interactions | Prepaid | CNY 600/month | Included |
| [Webhook failure storage](/rest/callback_postsending_exception_storage.html) | High-reliability webhook delivery | Prepaid | CNY 2,000/month | CNY 2,000/month |
| [Request quality monitoring](/product/console/operation_troubleshooting_request_quality.html) | Provides real-time, fine-grained monitoring of endpoint request quality worldwide. | Prepaid | CNY 2,000/month | CNY 2,000/month |
| [Server API call limits](/product/console/basic_restful_api_call.html) | Increase RESTful Server API call limits | Prepaid | See [RESTful API Call Frequency Limits](/rest/limitationapi.html). | See [RESTful API Call Frequency Limits](/rest/limitationapi.html). |

### Billing example

Suppose a customer subscribes to the Pro plan, reaches a peak DAU of 15,000 during the month, and activates webhook failure storage on the first day of that month. The total EasyIM charge for the month is:

`CNY 1,299 (Pro subscription) + CNY 1,000 (DAU overage) + CNY 2,000 (webhook failure storage) = CNY 4,299`
