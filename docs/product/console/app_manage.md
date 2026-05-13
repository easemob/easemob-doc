# 查看和配置应用

## 查看应用信息

登录 [环信控制台](https://console.easemob.com/user/login)，在页面上方选择 **应用管理** 或者在 **首页** 的 **应用概览** 区域选择 **应用管理**。

![img](/images/console/app_mgmt_menu.png)

在应用列表中，单击指定应用的测试版或正式版的 App Key查看该应用的信息。

![img](/images/console/app_mgmt_list.png)

| 字段              | 说明                                                         |
| :---------------- | :----------------------------------------------------------- |
| 产品名称     | 创建应用时填写的产品名称。                                   |
| 产品描述     | 创建应用时填写的产品描述。                                   |
| AppKey-测试版 | 创建应用时根据你填写的 **AppName** 自动生成。点击可进入测试版应用详情并进行相关配置。 |
| AppKey-正式版 | 应用上线时根据你填写的 **AppName** 自动生成。若你的测试版应用尚未上线，该项为空。点击可进入正式版应用详情并进行相关配置。 |
| 应用状态      | - **未上线**：产品仅有测试版应用。<br>- **上线中**：临时状态，产品的测试版应用已申请上线，约 5-10 分钟完成上线后变为已上线状态。处于上线中状态的应用无法进入应用详情。<br>- **已上线**：产品已上线正式版，可进入应用详情并进行相关配置。 |
| 操作        | - **申请上线**：测试版应用可申请上线，详见 [应用上线步骤](app_launch.html)。<br>- **应用备案**：正式版应用可申请上线，详见 [应用备案](app_file.html)。 |

**应用概览** 页面包含开发配置信息、应用基本信息、应用备案信息和服务开通信息。

![img](/images/console/app_info.png)

## 获取应用凭证

你可以在 **开发配置信息** 栏查看应用的 **AppKey**、**Client ID** 和 **Client Secret**。

- AppKey：应用的唯一标识，由 **Org Name** 和 **App Name** 组成，生成后不允许修改。创建应用时会生成应用的 App Key，详见 [创建应用文档](app_create.html#操作步骤)。
- Client ID/Client Secret：可用于生成 [App Token](/document/server-side/easemob_app_token.html) 和 [用户 Token](/document/server-side/easemob_user_token.html)。

![img](/images/console/app_info_develop.png)

## 开通服务

**服务开通信息** 栏展示当前套餐版本和账户剩余费用。你可以 [调整套餐包](purchase_package.html)、[开通增值服务](purchase_value_added.html) 并进行配置。

![img](/images/console/app_info_activation.png)

### 测试版试用套餐包

对于测试版应用，你可以 [免费试用专业版或旗舰版](purchase_package.html#订阅-升级套餐包)，或者选择购买扩展功能，而无需支付任何费用。

请注意即使你订阅了套餐，测试版应用仍存在如下限制：

| 功能              | 限制       |
| :---------------- | :--------- |
| 注册用户数        | 100     |
| 群组数            | 100     |
| 聊天室数          | 100    |
| 单群聊消息云存储  | 7 天       |
| 聊天室消息云存储  | 3 天       |
| 服务端 API 调用频率 | 不支持调整 |

![img](/images/console/app_info_activation_test.png)

### 测试版试用增值服务

对于测试版应用，你可以在实时音视频、内容审核、消息翻译和即时推送服务页签中点击 **立即订阅** 或 **免费使用** [开通](purchase_value_added.html) 服务，使用服务的 [免费额度](/product/pricing_policy.html#增值服务)，无需支付任何费用。

此外，对于内容审核和消息翻译服务，若你在上线正式版时不需要该服务，可点击**关闭服务**。对于内容审核服务，关闭服务后再上线正式版，你的内容审核相关配置会丢失。
 
// 此时申请上线转为正式版时不会收取服务费用。TODO：这句话是什么意思，这个还需要说吗？

![img](/images/console/app_info_activation_test_deactivation.png)

### 测试版试用基础功能

对于测试版应用，你可以在控制台开通即时通讯 IM 的相关基础功能，包括 [用户](basic_user.html)、[消息](basic_message.html)、[会话](basic_conversation_group_chatroom.html)、[群组](basic_conversation_group_chatroom.html)、[聊天室](basic_conversation_group_chatroom.html)、[消息回调](basic_webhook.html)、[RESTful IP 白名单](basic_other.html#rest-ip-白名单) 等服务，但不能上调 [服务端 API 调用频率](basic_restful_api_call.html)。

例如，开通用户相关的基础功能：

![img](/images/console/basic_user.png)













