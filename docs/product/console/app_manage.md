# App Management and Configuration

On the **Applications** page, you can view development and production version apps and access their configuration pages.

## Manage Apps

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
   
2. Go to the **Applications** page to view all apps under the current account.
   
   Click the App Key of a development or production version to go to the corresponding app details page.

![img](/images/console/app_mgmt_list.png)

| Field | Description |
| :--- | :--- |
| App Name | The app name entered when the app was created. |
| Description | The product description entered when the app was created. |
| AppKey-Dev | The App Key of the development version app. Click it to go to the development version app details.<br> - If you select **Create a new production app**, the development version app is retained after launch.<br> - If you select **Upgrade this development app to production**, this field is empty after launch, and the App Key of the production version app is displayed under **AppKey-Prod**. |
| AppKey-Prod | The App Key of the production version app. This field is empty if the app has not been launched. After launch, click it to go to the production version app details. |
| App Status | - **Development**: Only a development version app exists.<br> - **Launching**: A launch request is submitted and the launch is ongoing. The app details are temporarily unavailable.<br> - **Production**: A production version app has been generated. |
| Operation | **Apply to Production**: Launch the development version app as a production version. For details, see [App Launch](app_launch.html). |

3. On the **Overview** page, view app details, including development configurations, basic app information, and IM service information.

![img](/images/console/app_info.png)

## Obtain App Credentials

In the **Development Configuration** section, you can view the following app credentials:

- **AppKey**: The unique app identifier in the format `orgname#appname`. The App Key cannot be changed after the app is created. For details, see [App Creation](app_create.html#procedure).
- **Client ID** and **Client Secret**: Used to generate an [app token](/rest/easemob_app_token.html) and [user token](/rest/easemob_user_token.html).

![img](/images/console/app_info_develop.png)

## Service Management

In the **Service Information** section, you can view the current plan and account balance and [change the plan](purchase_package.html#subscribe-to-or-upgrade-a-plan).

For information about trial plans and extended features for development version apps, see [Development Version App Trial](/product/pricing_method.html#测试版应用试用说明).

![img](/images/console/app_info_activation.png)

