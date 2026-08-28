# User Management

In [EasyIM Console](https://console.easyim.ai/user/login), you can create and manage IM users:

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
2. On the **Applications** page, click the App Key in the **AppKey-Dev** or **AppKey-Prod** column.
3. In the left navigation pane, select **Operation** > **IM Admin**.
4. On the **Users** page, create and manage users.

![img](/images/console/operation_user.png)

## Create a user

1. On the **Users** page, click **Create User**.
2. In the **Create User** dialog box, enter the user ID, user nickname (used only for offline push), and password, and then click **Save**.

![img](/images/console/operation_user_create.png)

| Parameter | Type | Required | Description |
| :-------- | :--- | :------- | :---------- |
| User ID | String | Yes | The user ID cannot exceed 64 bytes and supports the following characters:<br/>- The 26 lowercase English letters a–z.<br/>- The 10 digits 0–9.<br/>- Underscores (`_`), hyphens (`-`), and periods (`.`).<br/><Container type="notice" title="Notice"><br/>- Do not use uppercase English letters A–Z.<br/>- Make sure that each user ID is unique within the same app.<br/>- A user ID is public information. Do not use sensitive information such as a UUID, email address, or mobile number.</Container> |
| User Nickname | String | No | The sender nickname displayed in the recipient's notification bar for offline push. You can customize this nickname. It cannot exceed 100 characters.<br/>The following characters are supported:<br/>- The 26 lowercase English letters a–z.<br/>- The 26 uppercase English letters A–Z.<br/>- The 10 digits 0–9.<br/>- Chinese characters.<br/>- Special characters.<Container type="notice" title="Notice">1. If no nickname is set, the sender's user ID is displayed instead of a nickname in push notifications.<br/>2. This nickname can differ from the nickname in the user attributes. However, we recommend keeping the two nicknames consistent. When you modify one nickname, call the corresponding method to update the other. For information about updating the nickname in user attributes, see [Set User Attributes](/document/server-side/user_attribute_set.html).</Container> |
| Password | String | Yes | The user login password. It cannot exceed 64 characters. |
| Confirm Password | String | Yes | Enter the user login password again. |

## Set the token validity period

You can set the token validity period above the user list. This setting applies to both app tokens and user tokens under the current App Key. It applies only to tokens generated after the setting is changed and does not affect previously generated tokens.

![img](/images/console/operation_user_token_expiry.png)

## Edit user information

In the user list, click **More** in the **Operation** column for the target user and select **Edit User Information**.

![img](/images/console/operation_user_modify.png)

| Parameter | Type | Description |
| :-------- | :--- | :---------- |
| User Nickname | String | See the description of **User Nickname** in the [Create a user](#create-a-user) section. |
| Notification Mode | String | The display mode of offline push notifications received by the user:<br/>- **Notify Only**: The push title is “You've got a new message,” and the push content is “Please click to view.”<br/>- **Send Details**: The push title is “You've got a new message,” and the push content includes the sender nickname and offline message content. |
| Do Not Disturb | String | Whether to enable Do Not Disturb (DND). |
| Push Certificate | String | The offline push certificate. |

## View a user's friends

In the user list, click **More** in the **Operation** column for the target user and select **View Friends** to view the user's friend list.

To add a friend for the user, enter a user ID and click **Add**.

![img](/images/console/operation_user_friend.png)

## Delete a user's friend

In the user list, click **More** in the **Operation** column for the target user, select **View Friends**, and click **Delete** in the friend list.

![img](/images/console/operation_user_friend_delete.png)

## View a user's blocklist

In the user list, click **More** in the **Operation** column for the target user and select **View Blocklist** to view the user's blocklist.

To add a user to the blocklist, enter the user ID and click **Add**.

![img](/images/console/operation_user_blocklist.png)

After adding a user to the blocklist, click **Remove** to remove the user from it.

## View the push certificate bound to a user

In the user list, click **More** in the **Operation** column for the target user and select **Push Certificate** to view the push certificate bound to the user.

If the user is not bound to any push certificate, the following dialog box appears:

![img](/images/console/operation_user_certificate_no.png)

## View a user token

In the user list, click **More** in the **Operation** column for the target user and select **View Token** to view the user's token.

![img](/images/console/operation_user_token.png)

## Reset a password

In the user list, click **More** in the **Operation** column for the target user and select **Reset Password** to reset the user's password. The password cannot exceed 64 characters.

![img](/images/console/operation_user_pwd.png)

## Send a message through the REST API

In the user list, click **More** in the **Operation** column for the target user and select **Send Admin Message** to call the [REST API](/document/server-side/message_single.html) to send a text or image message to the user.

![img](/images/console/operation_user_rest_msg.png)

## Ban a user

In the user list, click **More** in the **Operation** column for the target user and select **Ban User**.

After the user is banned, the user is immediately logged out and cannot log in to IM until unbanned. While banned, other users can send messages to the banned user, but the banned user cannot receive messages or push notifications.

![img](/images/console/operation_user_ban.png)

## Unban a user

In the user list, click **More** in the **Operation** column for the target user and select **Unban**.

After being unbanned, the user can connect to and use IM normally. When the user gets online again, the user can receive offline messages generated during the ban. Note that offline messages are stored for up to seven days by default. If the client does not get online within seven days, the server discards the expired messages.

![img](/images/console/operation_user_unban.png)

## Force a user offline

In the user list, click **More** in the **Operation** column for the target user and select **Force Offline**.

If multi-device login is enabled, the user is logged out from all logged-in devices.

![img](/images/console/operation_user_offline.png)

## Delete a user

In the user list, click **More** in the **Operation** column for the target user and select **Delete User**.

After the user is deleted, the user's friend relationships, user attributes, messages, conversations, and other server-side data are also deleted. If the user is a group owner or chat room owner, the corresponding chat groups and chat rooms are also deleted. Confirm the impact before performing this operation.

![img](/images/console/operation_user_delete.png)
