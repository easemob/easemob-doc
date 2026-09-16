# Message Volume Statistics

EasyIM collects message volume statistics for an app and for one-to-one chats, group chats, and chat rooms within the app. After selecting the target app, select **Operations** > **Analytics** in the left navigation bar to view message statistics for all conversations, one-to-one chats, group chats, and chat rooms in the app.

## How Message Metrics Are Calculated

Unless otherwise specified, the following calculation rules apply to app, one-to-one chat, group chat and chat room statistics.

| Metric | Definition |
| :--- | :--- |
| **Total uplink messages** | The number of messages sent from clients or via REST APIs and successfully received by the EasyIM server. The count increases by 1 each time the server receives a message. |
| **Total downlink messages** | The number of messages delivered to recipients, including messages delivered to online users in real time and messages delivered after offline users come back online. The count increases by 1 each time the server delivers a message. |
| **Total offline messages** | The number of messages cached on the server because recipients are offline. The count increases by 1 each time the server detects that a recipient is offline. |
| **Total distributed messages** | Total downlink messages + total offline messages. |

## App Message Statistics

On the **Messages** page, select the **All** tab and set the statistics period to **Last 7 Days**, **Current Month**, or a custom period. The **All** tab applies the calculation rules above to all conversations in the app and displays total uplink messages, total downlink messages, total offline messages, and total distributed messages.

After setting the statistics period, you can also view the overall app message trend and trends by uplink, downlink, and offline message type. Alternatively, click **Export** in the upper-right corner of the page to export the statistics as an XLS file.

![img](/images/console/operation_data_message_statistics_app_overview.png)

### Overall Message Trend

In the **Message Trend** section, you can view trends for uplink messages, downlink messages, offline messages, and distributed messages in the app.

![img](/images/console/operation_data_message_statistics_app_trend.png)

### Trends by Uplink, Downlink, and Offline Message Type

The uplink, downlink, and offline message trend charts show trends for the following message types:

- One-to-one chat
- Group chat
- Chat room
- Message edit
- Message receipt
- Message recall
- Notifications of users joining groups and chat rooms
- Notifications of users leaving groups and chat rooms

![img](/images/console/operation_data_message_statistics_app_uplink.png)

![img](/images/console/operation_data_message_statistics_app_downlink.png)

![img](/images/console/operation_data_message_statistics_app_offline.png)

## One-to-One Chat Message Statistics

On the **Messages** page, select the **1-on-1 Chat** tab and set the statistics period to **Last 7 Days**, **Current Month**, or a custom period. The **1-on-1 Chat** tab applies the calculation rules above only to one-to-one chat conversations and displays total uplink messages, total downlink messages, total offline messages, and total distributed messages.

After setting the statistics period, you can also view the overall message trend for one-to-one chat conversations and trends by uplink, downlink, and offline message type. Alternatively, click **Export** in the upper-right corner of the page to export the statistics as an XLS file.

![img](/images/console/operation_data_message_statistics_single_overview.png)

### Overall Message Trend

In the **Message Trend** section, you can view the overall trends for uplink messages, downlink messages, offline messages, and distributed messages in one-to-one chat conversations.

![img](/images/console/operation_data_message_statistics_single_trend.png)

### Uplink, Downlink, and Offline Message Trends

In the **Upstream Message Type Trend**, **Downstream Message Type Trend**, and **Offline Message Type Trend** sections, you can view trends for the following message types:

- Text messages
- Image messages
- Video messages
- Voice messages
- Command messages
- Location messages
- File messages
- Custom messages
- Combined messages
- Empty messages

![img](/images/console/operation_data_message_statistics_single_uplink.png)
![img](/images/console/operation_data_message_statistics_single_downlink.png)
![img](/images/console/operation_data_message_statistics_single_offline.png)

## Group Chat and Chat Room Message Statistics

The message metrics and message types displayed in trend charts for group chat and chat room conversations are similar to those for one-to-one chats.

### Group Chat Statistics

Group chat statistics apply the calculation rules above only to group chat conversations.

![img](/images/console/operation_data_message_statistics_group_overview.png)

![img](/images/console/operation_data_message_statistics_group_trend.png)

![img](/images/console/operation_data_message_statistics_group_uplink.png)

![img](/images/console/operation_data_message_statistics_group_downlink.png)

![img](/images/console/operation_data_message_statistics_group_offline.png)

### Chat Room Statistics

Chat rooms do not store offline messages. Therefore, the total number of distributed messages equals the total number of downlink messages.

![img](/images/console/operation_data_message_statistics_room_overview.png)

![img](/images/console/operation_data_message_statistics_room_trend.png)

![img](/images/console/operation_data_message_statistics_room_uplink.png)

![img](/images/console/operation_data_message_statistics_room_downlink.png)
