# 查看和配置应用

你可以在 **应用管理** 页面查看测试版和正式版应用，并进入对应配置页面。

## 查看应用列表

登录 [环信控制台](https://console.easemob.com/user/login)，在页面上方选择 **应用管理**，或者在首页 **应用概览** 区域选择 **应用管理**。

![img](/images/console/app_mgmt_menu.png)

在应用列表中，点击测试版或正式版的 App Key，可进入对应应用详情页。

![img](/images/console/app_mgmt_list.png)

| 字段 | 说明 |
| :--- | :--- |
| 产品名称 | 创建应用时填写的产品名称。 |
| 产品描述 | 创建应用时填写的产品描述。 |
| AppKey-测试版 | 测试版应用的 App Key。点击可进入测试版应用详情。 |
| AppKey-正式版 | 正式版应用的 App Key。若应用尚未上线，该项为空。点击可进入正式版应用详情。 |
| 应用状态 | - **未上线**：仅有测试版应用。<br>- **上线中**：已提交上线申请，暂时无法进入应用详情。<br>- **已上线**：已生成正式版应用。 |
| 操作 | - **申请上线**：将测试版应用上线为正式版。详见 [应用上线](app_launch.html) 说明。<br>- **应用备案**：对正式版应用进行备案。详见 [应用备案](app_file.html) 说明。 |

## 查看应用详情

**应用概览** 页面包含开发配置信息、应用基本信息、应用备案信息和服务开通信息。

![img](/images/console/app_info.png)

## 获取应用凭证

你可以在 **开发配置信息** 栏查看以下应用凭证：

- **AppKey**：应用唯一标识，格式为 `orgname#appname`。创建后不可修改。详见 [创建应用文档](app_create.html#操作步骤)。
- **Client ID** 和 **Client Secret**：可用于生成 [App Token](/document/server-side/easemob_app_token.html) 和 [用户 Token](/document/server-side/easemob_user_token.html)。

![img](/images/console/app_info_develop.png)

## 服务管理入口

在 **服务开通信息** 区域，可查看当前套餐版本与账户余额，也可 [调整套餐包](purchase_package.html#订阅-升级套餐包)、[开通增值服务](purchase_value_added.html) 并进行配置。

关于测试版应用试用套餐包、增值服务和扩展功能的说明，详见 [测试版应用试用说明](/product/pricing_method.html#测试版应用试用说明)。

![img](/images/console/app_info_activation.png)



