# App Creation

Before integrating IM, you must create an app in [EasyIM Console](https://console.easyim.ai/user/login).

- A newly created app is a **development version** by default and can be used for development, integration testing, and general testing.
- After a development version app is launched, a **production version** app is generated. For launch methods and related information, see [App Launch](app_launch.html).

## Prerequisite

Before creating an app, [register an account](account_register.html) in [EasyIM Console](https://console.easyim.ai/user/login).

## Procedure

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login) and click **Create App** on the **Applications** page.

![img](/images/console/app_create_overview.png)

2. In the **Create App** dialog box, enter the **App Name**, **Description**, **Appname**, **Data Residency**, and **Registration Mode**, and then click **Create**.

   A new app uses the Free plan by default.

![img](/images/console/app_create.png)

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| App Name | String | Yes | The product name. It cannot exceed 32 characters. |
| Description | String | Yes | The product description. It cannot exceed 512 characters. |
| Appname | String | Yes | The app name used to generate the App Key. It can contain only lowercase letters, digits, and hyphens and cannot exceed 32 characters. |
| Appkey | String | Yes | The unique app identifier in the format `orgname#appname`. The system automatically generates `orgname` when you register an account. It cannot be changed after the app is created. |
| Data Residency | String | Yes | The data center corresponding to the primary region of your end users. The default is **Singapore**. It cannot be changed after the app is created.<br/> - For details, see [Data Centers](/product/data_center.html). |
| Registration Mode | String | Yes | The user registration mode.<br/> - **Authorized Registration**: Only an enterprise admin or app admin can register users. For details, see [Register a User Through the REST API](/rest/account_register_authorized_single.html) and [Register Users in Batches](/rest/account_register_authorized_batch.html).<br/> - **Open Registration**: Users can be registered through the client or the [REST API](/rest/account_register_open.html). This mode is generally used for Demo evaluation and test environments and is not recommended for production environments. |

// TODO：没有验证这一步
3. After the app is created, the system indicates that it is a development version app. Read the basic usage and launch information for development version apps, and then click **I Understand**.

![img](/images/console/app_create_complete.png)

## Development Version App Trial

Before a development version app is [launched as a production version](/product/console/app_launch.html), you can try IM plans and basic features free of charge. For details, see [Development Version App Trial](/product/pricing_method.html#trial-plans-for-development-apps).

## Next Steps

After creating an app, we recommend that you complete the following steps first:

- Go to the [App Management and Configuration](app_manage.html) page and verify that the App Key, data center, domain names, and other configurations are correct. Try IM plans and value-added services as needed to ensure that the feature configurations in the test environment meet your business requirements.
- When you are ready to launch the app, see [App Launch](app_launch.html) and select an appropriate launch method.

