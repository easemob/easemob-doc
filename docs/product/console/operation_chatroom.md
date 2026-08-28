# Chat Room Management

In [EasyIM Console](https://console.easyim.ai/user/login), you can create and manage chat rooms, including creating a chat room and viewing its member list, admin list, and blocklist:

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
2. On the **Applications** page, click the App Key in the **AppKey-Dev** or **AppKey-Prod** column.
3. In the left navigation pane, select **Operation** > **IM Admin**.
4. On the **Chat Rooms** page, create and manage chat rooms.

![img](/images/console/operation_chatroom.png)

## Create a chat room

1. On the **Chat Rooms** page, click **Create Chat Room**.
2. In the **Create Chat Room** dialog box, enter the chat room name, description, superadmin, regular admins, and other parameters, and then click **Save**.

![img](/images/console/operation_chatroom_create.png)

| Parameter | Type | Required | Description |
| :-------- | :--- | :------- | :---------- |
| Chat Room Name | String | Yes | The chat room name. It cannot exceed 128 characters. |
| Description | String | Yes | The chat room description. It cannot exceed 512 characters. |
| Chat Room Superadmin | String | Yes | The user ID of the superadmin. The superadmin is the chat room owner. |
| Chat Room Admin | String | No | The user IDs of regular chat room admins. Separate multiple user IDs with commas. |
| Maximum Members | String | No | The maximum number of chat room members, including the chat room owner. The value ranges from 1 to 10,000, and the default is 10,000. If you enter a value greater than 10,000, it is treated as 10,000. To increase the limit, contact the Agora sales team. |

## Search for a chat room ID

Enter a chat room ID in the search box in the upper-right corner of the chat room list. If the chat room ID exists, the chat room is displayed in the list.

![img](/images/console/operation_chatroom_search.png)

## Edit chat room information

In the chat room list, click **More** in the **Operation** column for the target chat room and select **Change Chat Room Information**.

![img](/images/console/operation_chatroom_edit.png)

## View the chat room member list

In the chat room list, click **More** in the **Operation** column for the target chat room and select **View Chat Room Members**.

To add a user to the chat room, enter a user ID and click **Add**.

![img](/images/console/operation_chatroom_member.png)

## View the chat room admin list

In the chat room list, click **More** in the **Operation** column for the target chat room and select **View Chat Room Admins**.

![img](/images/console/operation_chatroom_admin.png)

## View the chat room blocklist

In the chat room list, click **More** in the **Operation** column for the target chat room and select **View Chat Room Blocklist**.

To add a user to the chat room blocklist, enter a user ID and click **Add**.

![img](/images/console/operation_chatroom_block_list.png)

## View the chat room mute list

In the chat room list, click **More** in the **Operation** column for the target chat room and select **View Chat Room Mute List**.

To add a user to the chat room mute list, enter a user ID, set the mute duration, and click **Add**. For a temporary mute, the user is automatically unmuted when the duration expires. For a permanent mute, you must manually unmute the user.

![img](/images/console/operation_chatroom_block_list.png)

## Delete a chat room

In the chat room list, click **More** in the **Operation** column for the target chat room and select **Delete Chat Room**.

After the chat room is deleted, the chat room information and conversation no longer exist on the server, but its messages are retained.

![img](/images/console/operation_chatroom_delete.png)
