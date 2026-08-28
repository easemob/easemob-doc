# Chat Group Management

In [EasyIM Console](https://console.easyim.ai/user/login), you can create and manage chat groups, including creating a chat group and viewing its member list and blocklist:

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
2. On the **Applications** page, click the App Key in the **AppKey-Dev** or **AppKey-Prod** column.
3. In the left navigation pane, select **Operation** > **IM Admin**.
4. On the **Chat Groups** page, create and manage chat groups.

![img](/images/console/operation_chatgroup.png)

## Create a chat group

1. On the **Chat Groups** page, click **Create Group**.
2. In the **Create Group** dialog box, enter the chat group name, description, group owner, and other parameters, and then click **Create**.

![img](/images/console/operation_group_create.png)

| Parameter | Type | Required | Description |
| :-------- | :--- | :------- | :---------- |
| Group Name | String | Yes | The chat group name. It cannot exceed 128 characters. |
| Description | String | Yes | The chat group description. It cannot exceed 512 characters. |
| Group Owner | Bool | Yes | The user ID of the group owner. |
| Maximum Members | Int | No | The maximum number of chat group members, including the group owner. The default value is `200`. By default, offline push is no longer supported when this value exceeds `3000`. To use offline push for a larger group, contact the Agora sales team to enable it. |
| Group Type | String | No | - **Public Group** (default): A public group can be found through search, and users can request to join it.<br/>- **Private Group**: A private group cannot be found through search. Users can join it only after being invited by a group member. |
| Authentication | Bool | No | Whether a request to join the group requires approval from the group owner or an admin.<br/>- **No approval** (default): The user joins the group directly without approval.<br/>- **Need approval**: Approval is required.<br/>This parameter applies only to public groups. Users cannot request to join a private group and can join it only through a group member invitation. |
| Permission to invite | Bool | No | Whether regular group members can invite users to the group:<br/>- **Group owner/admin** (default): Only the group owner and admins can invite users.<br/>- **All group members**: Regular group members can invite users.<br/><Container type="notice" title="Notice"><br/>For public groups, only the group owner and admins can invite users.</Container> |
| User confirm | Bool | No | Whether an invited user must accept the invitation before joining the group:<br/>- **Verify** (default): The user's confirmation is required.<br/>- **No verification**: The user's confirmation is not required. |

## Search for a chat group ID

Enter a chat group ID in the search box in the upper-right corner of the chat group list. If the chat group ID exists, the chat group is displayed in the list.

![img](/images/console/operation_group_search.png)

## View the chat group member list

In the chat group list, click **More** in the **Operation** column for the target chat group and select **View Group Members**.

To add a user to the chat group, enter a user ID and click **Add**.

![img](/images/console/operation_group_member.png)

## View the chat group blocklist

In the chat group list, click **More** in the **Operation** column for the target chat group and select **View Group Blocklist**.

To add a user to the chat group blocklist, enter a user ID and click **Add**.

![img](/images/console/operation_group_block_list.png)

## Send a message through the REST API

In the chat group list, click **More** in the **Operation** column for the target chat group and select **Send Admin Message** to call the [REST API](/document/server-side/message_group.html) to send a text or image message to the group.

![img](/images/console/operation_group_rest_send.png)

## Delete a chat group

In the chat group list, click **More** in the **Operation** column for the target chat group and select **Delete Group**.

- After the chat group is deleted, files in the group can no longer be downloaded.
- After the chat group is deleted, the group information and group conversation no longer exist on the server, but group messages are retained according to the message retention period of the subscribed plan. Clients can still retrieve roaming messages from the deleted group.

![img](/images/console/operation_group_delete.png)
