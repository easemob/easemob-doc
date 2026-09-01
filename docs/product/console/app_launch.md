# App Launch

After development and testing of a development version app are complete, you can apply to launch it as a production version for production business operations.

## Preparation

Before applying to launch an app, make sure that all of the following conditions are met:

- The current app is still a **development version**, and no production version has been generated.
- The [IM Professional or Flagship plan](/product/pricing_method.html#subscribe-to-or-upgrade-a-plan) has been activated for the development version.
- You have determined whether to retain the plans and extended features activated for the development version in the production version.

## Procedure

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).

2. On the **Applications** page, find the target development version app and click **Apply to Production** in the **Operation** column.

![img](/images/console/app_launch_apply.png)

3. In the **Launch** dialog box, select a launch method based on your business requirements. We recommend that you first review the [Launch Considerations](#launch-considerations) table before selecting a method.

| Launch method | Use case |
| :--- | :--- |
| Upgrade this development app to production | Retain development version app data. |
| Create a new production app | Isolate the development and production environments. |

After selecting a method, enter the production version app information as needed:

| Item | Create a new production app | Upgrade this development app to production |
| :--- | :--- | :--- |
| Development app information | Confirm the app name, app key, and data center of the development version app. | Confirm the app name, app key, and data center. |
| Production app information | Enter the app name and confirm the app key and data center of the production version app.<br/> - For field descriptions, see [App Creation](app_create.html#procedure). | No information is required. |
| Fees | Confirm the fees to be paid after launch. | Confirm the fees to be paid after launch. |

After confirming or entering the production version app information, click **Release**.

:::tip
- The launch process usually takes **5–15 minutes**.
- During the launch process, you cannot modify the app information or feature configurations of the development or production version.
- Wait until you receive an SMS or email notification before performing subsequent operations to avoid affecting your business.
:::

![img](/images/console/app_launch_confirm.png)

4. In the **Apply to Production** confirmation dialog box, click **Confirm**.

![img](/images/console/app_launch_prompt.png)

// TODO：第 5 步和第 6 步尚未验证

5. When the system indicates that the **launch application has been submitted**, click **Got It**.

   You will receive SMS and email notifications after the launch succeeds. Wait until you receive the notifications before performing subsequent operations.

![img](/images/console/app_launch_commit.png)

6. After the launch is complete, verify the following information in the app list:

- **App Status** is **Production**.
- The App Key of the production version is displayed under **AppKey-Prod**. If you selected **Upgrade this development app to production**, **AppKey-Dev** is empty after launch.

![img](/images/console/app_launch_complete.png)

## Launch Considerations

| Consideration | Create a new production app | Upgrade this development app to production |
| :--- | :--- | :--- |
| Client and server configurations (app name / app key / URL) | **Changes required**.<br/> - Update the production version `App Key` in the client SDK initialization configuration.<br/> - Update `{app_name}` in the server request URL. | **No action required**. |
| Feature configurations | **Synchronized**: The feature configurations of the development version are automatically synchronized to the new production version. | **Inherited**: The production version fully inherits all feature configurations from the development version. |
| Business data | **Isolated**: Data in the development and production versions is completely isolated and is not shared. | **Inherited**: The production version fully inherits all existing business data from the development version. |
| Environment configuration checks (webhook URLs / IP allowlist) | - Check the [pre-delivery and post-delivery webhook URLs](basic_webhook.html) and switch them to the production environment as needed.<br/> - Check the [REST IP allowlist](basic_security.html#rest-ip-allowlist) and configure it again for the production version as needed. | **No action required**. |
