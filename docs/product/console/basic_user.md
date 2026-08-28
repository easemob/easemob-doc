# User and Login

After creating an app, you can configure user-related features in [EasyIM Console](https://console.easyim.ai/user/login), including user registration, friends, presence, and multi-device login.

To open the user settings page:

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
2. On the **Applications** page, click the App Key in the **AppKey-Dev** or **AppKey-Prod** column.
3. In the left navigation pane, select **Chat** > **Features**.
4. On the **User & Login** page, configure user and login features.

![img](/images/console/basic_user.png)

## Maximum number of registered users

The maximum number of registered users supported by an app depends on its subscribed plan:

- Free: Supports up to 100 registered users. To increase the limit, click **Upgrade** to upgrade to the professional or flagship plan.
- Professional or flagship: No limit on the number of registered users.

![img](/images/console/basic_user_count.png)

## User registration mode

User registration modes include authorized registration and open registration. Click **Edit** to switch the user registration mode.

- Authorized registration: As the app admin, call the REST API provided by EasyIM to register an EasyIM user account, and then save the account on your server or return it to the client. This API is intended for production environments. For details about the related REST APIs, see [Register a User Through Authorized Registration](/document/server-side/account_register_authorized_single.html) and [Register Users in Batches Through Authorized Registration](/document/server-side/account_register_authorized_batch.html).
- Open registration: As the app admin, call the REST API provided by EasyIM to register an EasyIM user account. This API is generally intended for demo and test environments and is not recommended for production environments. For details about the related APIs, see the [REST API](/document/server-side/account_register_open.html) documentation.

![img](/images/console/basic_user_registration.png)

![img](/images/console/basic_user_registration_set.png)

## Maximum friends per user

The maximum number of friends per user depends on your subscribed plan:

- Free: Each user can have up to 100 friends. To increase the limit, click **Upgrade** to upgrade to the Pro or flagship plan.
- Professional/flagship: Each user can have up to 3,000 friends.

![img](/images/console/basic_user_friends.png)

## Friend relationship check

Friend relationship check is disabled by default, which means users can chat without adding each other as friends. When enabled, only friends can send one-to-one messages to each other.

This feature must be enabled before use on all plans.

![img](/images/console/basic_user_friend_check.png)

## User blocklist

To block messages from a user, add the user to the blocklist. A user can add any other user to the blocklist, regardless of whether that user is in the friend list. After being added to the blocklist, the blocked user cannot send messages or friend requests to the other user. For details, see [Blocklist](/document/server-side/user_friend_blocklist_add.html).

This feature is enabled by default for all plans and can be disabled.

![img](/images/console/basic_user_blocklist.png)

## Presence

Presence includes online, offline, and custom states. Users can set their own presence and subscribe to or query the presence of other users. For details, see [Presence Subscription](/document/server-side/presence_set.html).

You can enable this service based on your current plan:

- Free: Click **Upgrade Now** to upgrade to the Pro or Enterprise plan.
- Professional: Click **Buy Now** to purchase and enable the service.
- Flagship: Click **Free Activation** to enable the service.

![img](/images/console/basic_user_presence.png)

## Global user mute

Global user mute prevents an individual user from sending messages in one-to-one chats, chat groups, or chat rooms. While muted, the user cannot call client APIs or REST APIs to send messages in one-to-one chats, chat groups, or chat rooms. When the mute expires, the IM Server automatically unmutes the user and restores their permission to send messages. For details, see [Global User Mute](/document/server-side/user_global_mute_overview.html).

You can enable this service based on your plan:

- Free: Click **Upgrade Now** to upgrade to the flagship plan.
- Professional: Click **Upgrade Now** to upgrade to the flagship plan.
- Flagship: Click **Free Activation** to enable the service.

![img](/images/console/basic_user_mute.png)

## Multi-device login

Multi-device login allows the same account to be used on multiple devices at the same time. You can enable this service based on your current plan:

- Free: Click **Upgrade Now** to upgrade to the professional or flagship plan.
- Professional/flagship: Click **Free Activation** to enable the service. After enabling it, click **Settings** to specify the number of devices allowed for each platform during multi-device login. By default, up to four devices can be online simultaneously on each platform. To increase this limit, contact your business manager. You can also click **Add Custom Platform** to add a custom platform. For example, you can treat an Android phone and an Android tablet as two separate platforms.

For details, see [Multi-Device Login](/document/android/multi_device.html).

![img](/images/console/basic_user_multidevice.png)

![img](/images/console/basic_user_multidevice_set.png)

![img](/images/console/basic_user_multidevice_set_device.png)
