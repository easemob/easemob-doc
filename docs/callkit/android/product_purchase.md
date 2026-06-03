# 购买指南

实时音视频服务通过 RTC 套餐包和加油包计费。

## 订阅/升级套餐包

实时音视频服务开通时默认订阅免费版套餐包，你可以随时升级套餐包为付费版本。套餐升级后当日立即生效并计费，并自动续费。

关于声网 RTC 套餐包的计费详情，请参见声网官网的 [RTC 计费策略](https://doc.shengwang.cn/doc/rtc/android/billing/billing-strategy#套餐内订阅费用) 和 [付费方式](https://doc.shengwang.cn/doc/rtc/android/billing/payment#套餐包) 说明。

:::tip
套餐包订阅/升级需按照该自然月的剩余天数交费或补足差价，价格均摊和配额均摊规则详见 [付费方式](https://doc.shengwang.cn/doc/rtc/android/billing/payment#套餐包)。如有疑问，请联系环信商务。
:::

你可以按以下步骤升级声网 RTC 套餐包：

1. 登录 [环信控制台](https://console.easemob.com/user/login)。 
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的应用的 **操作** 栏中的 **管理**。
3. 在左侧导航栏，选择 **服务开通** > **增值服务** > **实时音视频**。
4. 点击 **升级套餐**。

![img](/images/callkit/product/rtc_package_upgrade.png)

5. 选择 RTC 套餐版本，点击 **立即购买**。

![img](/images/callkit/product/rtc_package_purchase.png)

6. 确认账单信息，点击 **下一步**。在弹出的 **付款确认** 对话框中，确认付款信息后，阅读并同意《环信云服务购买协议》，点击 **立即支付**。

![img](/images/callkit/product/rtc_billing_confirm.png)

7. 购买套餐后，可在 **实时音视频服务** 页面查看你的套餐包容量。

![img](/images/callkit/product/rtc_package_view.png)

## 订阅/升级加油包

加油包支持按时长购买，购买后立即生效，并可抵扣本月 1 日至次年该月月底产生的超量费用。

关于 RTC 加油包的计费详情，请参见声网官网的 [RTC 计费策略](https://doc.shengwang.cn/doc/rtc/android/billing/billing-strategy#使用加油包抵扣) 和 [付费方式](https://doc.shengwang.cn/doc/rtc/android/billing/payment#加油包) 说明。

:::tip
1. 加油包不支持退订。
2. 加油包支持叠加购买，如购买多个加油包，按照购买时间依次扣除。
:::

你可以按以下步骤购买声网 RTC 加油包：

1. 登录 [环信控制台](https://console.easemob.com/user/login)。 
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的应用的 **操作** 栏中的 **管理**。
3. 在左侧导航栏，选择 **服务开通** > **增值服务** > **实时音视频**。
4. 点击 **服务总览** 栏中的 **购买加油包**。

![img](/images/callkit/product/rtc_plus_purchase.png)

5. 确认加油包信息，点击 **下一步**。在弹出的 **付款确认** 对话框中，确认付款信息后，阅读并同意《环信云服务购买协议》，点击 **立即支付**。

![img](/images/callkit/product/rtc_plus_confirm.png)

6. 购买套餐包后，你可以查看当前音视频服务的总量。
   
![img](/images/callkit/product/rtc_capacity_total.png)   

## 续费套餐包

所有版本默认自动续订。如需取消续订，请将套餐切换为免费版。

## 套餐降级

套餐降级操作将立即生效。系统会根据当月剩余天数，重新计算你当月的剩余用量，并对未使用的部分进行费用退还。为保障你的业务稳定运行，建议避免在当月内频繁变更套餐。如有任何疑问，请联系环信商务。

## 充值和账单

登录环信控制台，将鼠标悬停在页面右上角的 **账单中心**，选择 **账户中心** 可以查看当前的账户余额，点击 **立即充值** 对该账户充值。选择 **订单中心**、**消费账单** 或 **充值记录**，查看 RTC 服务的订单、消费账单和充值记录。更多详情，请参见 [环信控制台文档](/product/console/account_center.html)。

## 查询当月 RTC 用量

你可以调用 [RESTful API](/document/server-side/rtc_usage_query.html) 在当前自然月内的 RTC 用量汇总数据，帮助开发者了解当月资源消耗情况及剩余可用量。





