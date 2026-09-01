# Manage Plans

## Subscribe to or upgrade a plan

- **Development app**: The Free EasyIM plan is enabled by default after the app is created. You can upgrade it to the Professional or Flagship plan. **No fees are charged before the app is launched as a production version. Billing starts on the day the app is launched as a production version.**
- **Production app**: You can upgrade from the Professional to the Flagship plan. Billing starts on the day the subscription succeeds.

You can subscribe to or upgrade a plan in either of the following ways.

#### Method 1

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
2. On the **Applications** page, click the App Key in the **AppKey-Dev** or **AppKey-Prod** column.
3. In the left navigation pane, select **Chat** > **Plans**.
4. Select a plan and click **Subscribe Now**.
   
   ![img](/images/console/package_purchase.png)

5. Complete the configuration on the **Activate Service Plan** page, and then click **Next** or **Free Trial**.
   
   - **Confirm the App Key**: The App Key cannot be changed after purchase.
   - **Select a service plan**: You can upgrade the Free plan to the Professional to the Flagship plan. You can upgrade the Professional plan to the Flagship plan.
   - **Purchase add-ons**: Add-ons such as message cloud storage and the maximum number of chat group members are available.
  
   :::tip
   - The prepaid amount displayed on the page is only the base fee. Charges for a production app are based on the monthly bill.
   - For details, see [Pricing Policy](/product/pricing_policy.html) and [Plan Feature Comparison](/product/product_package_feature.html).
   :::

   ![img](/images/console/package_price.png)

6. After the purchase succeeds, click **View Bill** or **Close**.

![img](/images/console/package_pay_finish.png)

#### Method 2

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
2. On the **Applications** page, click the App Key in the **AppKey-Dev** or **AppKey-Prod** column.
3. In the **Service Information** section of the **Overview** page, click **Adjust Plan** to upgrade the plan.
4. Activate the service plan and pay the fee. For details, see [Method 1](#method-1).

![img](/images/console/app_info_activation.png)

## Trial plans for development apps

A development app can [try the Professional or Flagship plan for Free](#subscribe-to-or-upgrade-a-plan) and can also try add-ons. No fees are charged during the trial.

Even if a development app is using a trial of the Professional to the Flagship plan, the following limits still apply:

| Feature | Limit |
| :--- | :--- |
| Registered users | 100 |
| Chat groups | 100 |
| Chat rooms | 100 |
| Cloud storage for one-to-one and group chat message  | 7 days |
| cloud storage for chat room messages  | 3 days |
| Server API call frequency | Cannot be adjusted |

:::tip
1. Trial quotas and services for development apps may be adjusted. Refer to the latest rules.
2. Only development apps using a trial of the Professional or Flagship plan can be launched as a production version, while apps on the Free plan cannot.
:::

## Upgrade and downgrade notes

| App type | Upgrade | Downgrade |
| :--- | :--- | :--- |
| **Production app** | After a successful upgrade, billing under the new plan starts on the same day, and the unused amount from the previous plan is automatically refunded. | 1. Contact EasyIM business manager to downgrade or cancel a plan.<br/>2. After a downgrade, features not included in the target plan are disabled. Disabling some features, such as webhooks, clears the associated data, which cannot be recovered. |
| **Development app** | You can upgrade from the Free plan to the Professional or Flagship plan at no additional cost. | You can downgrade from the Flagship plan to the Professional plan. Basic features and add-ons enabled before the downgrade remain enabled afterward. |

## Renew a plan

All EasyIM plans renew automatically by default. When a plan expires, you can also place a new order on [EasyIM Console](https://console.easyim.ai/user/login) to [subscribe to the same or another plan](#subscribe-to-or-upgrade-a-plan). EasyIM Console does not currently support combining the subscription periods of multiple orders. If you create a new order before the current plan expires, the system automatically closes the old order and refunds the unused amount.
