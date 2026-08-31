# Security

After creating an app, you can enable security-related features in addition to user, message, chat group, and chat room features.

To open the security settings page:

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
2. On the **Applications** page, click the App Key in the **AppKey-Dev** or **AppKey-Prod** column.
3. In the left navigation pane, select **Chat** > **Features**.
4. On the **Security** page, configure security-related features.

![img](/images/console/basic_security.png)

## REST IP allowlist

If you want to allow messages to be sent through REST APIs only from specific IP addresses, add those addresses to the IP allowlist. IP addresses outside the allowlist cannot call REST APIs to send messages.

Click **Free Activation** to enable the REST IP allowlist.

![img](/images/console/basic_other_rest_ip.png)

### Add an IP address

1. After enabling the REST IP allowlist, click **Settings** to open the REST IP allowlist page.

![img](/images/console/basic_other_rest_ip_set.png)

2. Click **Add IP**.

![img](/images/console/basic_other_rest_ip_list.png)

3. Add an IP address.

Enter a valid IPv4 address. You can enter only one IP address at a time and add up to eight IP addresses.
An added IP address takes effect in about 10 minutes. If the IP allowlist is empty, all IP addresses can call REST APIs.

![img](/images/console/basic_other_rest_ip_add.png)

### Delete an IP address

If you no longer want to allow an IP address to send REST messages, delete it from the IP allowlist. If you delete all IP addresses and the allowlist becomes empty, all IP addresses can send REST messages by default.

1. In the IP allowlist, click **Delete** in the **Operation** column for the specified IP address.

![img](/images/console/basic_other_rest_ip_delete.png)

2. In the confirmation dialog box, click **OK** to delete the IP address.

![img](/images/console/basic_other_rest_ip_delete_confirm.png)
