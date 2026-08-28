# Message and Conversation

After creating an app, you can configure message- and conversation-related features in [EasyIM Console](https://console.easyim.ai/user/login), including message recall, image message thumbnails, message Reactions, and the server-side conversation list.

To open the message and conversation settings page:

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
2. On the **Applications** page, click the App Key in the **AppKey-Dev** or **AppKey-Prod** column.
3. In the left navigation pane, select **Chat** > **Features**.
4. On the **Message & Conversation** page, configure message- and conversation-related features.

![img](/images/console/basic_message_conversation.png)

## Message recall

For all plans, before using message recall, click **Free Activation** to enable the feature, and then click **Settings** to set the message recall period for the client and REST API. By default, messages can be recalled within 2 minutes after they are sent. You can set the period to a maximum of 7 days.

![img](/images/console/basic_message_recall.png)

![img](/images/console/basic_message_recall_set.png)

![img](/images/console/basic_message_recall_period.png)

## Image message thumbnails

Click **Edit** and configure the image message thumbnail **Compression Method** and **Compression Size** in the dialog box:

- Compression method: Compress by the shorter side or the longer side.
  - Compress by the shorter side: Proportionally scale the image so that the shorter of the original thumbnail's width and height matches the configured value.
  - Compress by the longer side: Proportionally scale the image so that the longer of the original thumbnail's width and height matches the configured value.
- Compression size: Set the thumbnail width and height. The default value is 170 pixels.

If the image produced with these settings is larger than the original thumbnail, the original thumbnail is retained.

![img](/images/console/basic_message_thumbnail.png)

![img](/images/console/basic_message_thumbnail_edit.png)

## Message Reactions

Message Reactions provide an intuitive way to express emotions and improve the user experience.

You can enable this service based on your current plan:

- Free: Click **Upgrade Now** to upgrade to the professional or flagship plan.
- Professional: Click **Buy Now** to purchase and enable the service.
- Flagship: Click **Free Activation** to enable the service.

![img](/images/console/basic_message_reaction.png)

## Server-side conversation list

The IM server stores the conversation list, which clients can retrieve from the server. Click **Free Activation** to enable this service.
For the professional plan, the server stores 100 conversations per user by default; for the flagship plan, it stores 500.

![img](/images/console/basic_server_conversation_list.png)

## Add messages sent through REST APIs to the conversation list

Messages sent through REST APIs are not added to the conversation list by default. Enable this feature if you want them to be added.

![img](/images/console/basic_rest_message.png)
