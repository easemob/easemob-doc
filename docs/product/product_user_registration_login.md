# User Registration and Login

This document describes user registration modes and login methods.

## User registration

Before logging in to the SDK, you must first create an EasyIM user. Before creating the user, set the user registration mode on the **EasyIM > Basic Features** > **Users** page of the [EasyIM Console](https://console.easyim.ai/user/login).

The following user registration modes are available:

- **Authorized registration**: Register users through a REST API provided by EasyIM. This mode is suitable for production environments. After registration succeeds, you can save the user account to your app server or return it to the client.
- **Open registration**: Allow a client or REST API to register users directly. This mode is generally used for demos and test environments and is not recommended for production environments.

After setting the registration mode, you can create users in the following ways:

1. **Call a REST API to create users**

   - Authorized registration: Call the [authorized registration of a single user](/document/server-side/account_register_authorized_single.html) or [authorized registration of users in a batch](/document/server-side/account_register_authorized_batch.html) API to create users.
   - Open registration: After enabling open registration, create users through a client or the [REST API for open user registration](/document/server-side/account_register_open.html).

2. **Create users in the EasyIM Console**

   You can create users in production or test environments in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Create a user](/product/console/operation_user.html#create-a-user).

## User login

After initializing the EasyIM SDK, call the login API to log in. You can use EasyIM features, such as messages and conversations, only after login succeeds.

EasyIM supports login using a user ID and token.

| Parameter       | Type   | Required | Description          |
| :--------- | :----- | :------- | :-------------------------------------------- |
| `username` | String | Yes  | User ID. The length cannot exceed 64 bytes, and the value cannot be empty. The following characters are supported:<br/>- 26 lowercase English letters, a-z;<br/>- 10 digits, 0-9;<br/>- "_", "-", and ".". <br/><Container type="notice" title="Notice"><br/>- Do not use uppercase English letters, A-Z. If you use both uppercase and lowercase letters, the user ID returned in the response contains only lowercase letters.<br/>- A user ID is public information. Do not use sensitive information such as a UUID, email address, or phone number.</Container> |
| `token` | String | Yes | You can obtain a token by calling a REST API and passing a user ID (or a user ID and password) and the token validity period. For details, see [Obtain an EasyIM user token](/document/server-side/easemob_user_token.html).<br/><Container type="notice" title="Notice"><br/>- When calling the REST API to obtain a token, you can pass the `ttl` parameter to set the token validity period. You can also set the token validity period on the **User Management** page of the [EasyIM Console](https://console.easyim.ai/user/login/). The most recently configured value takes effect.<br/>- The EasyIM server fully trusts user tokens. To prevent disruption to your business, keep tokens secure.</Container> |

## Login process

![img](/images/product/login_userid_token.png)

:::tip
1. For information about obtaining tokens, see [Obtain an App Token](/document/server-side/easemob_app_token.html) and [Obtain a User Token](/document/server-side/easemob_user_token.html).
2. When you obtain a token, the value passed for `ttl` determines the token validity period. If this parameter is not passed, the token validity period configured on the **User Management** page of the [EasyIM Console](https://console.easyim.ai/user/login) is used. The default is 60 days. If the value is set to `0`, the token never expires.
:::
