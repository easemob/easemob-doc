# 创建应用

接入即时通讯 IM 前，你需要先在 [环信控制台](https://console.easemob.com/user/login) 创建应用。

- 新创建的应用默认为 **测试版**，可用于开发、联调和测试。
- 测试版应用上线后会生成 **正式版** 应用。上线方式及说明详见 [应用上线说明](app_launch.html)。

## 前提条件

创建应用前，你需要先在 [环信控制台](https://console.easemob.com/user/login) [注册账号](account_register.html)。

## 操作步骤

1. 登录 [环信控制台](https://console.easemob.com/user/login)，在首页 **应用概览** 区域点击 **创建应用**。

![img](/images/console/app_overview.png)

2. 在 **创建应用** 对话框中填写应用的 **产品名称**、**描述**、**Appname**、**所在地**、**数据中心** 和 **注册模式**，然后点击 **创建**。

   新应用的服务版本默认使用免费版套餐包。

![img](/images/console/app_create.png)

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| 产品名称 | String | 是 | 产品名称，不能超过 32 个字符。 |
| 描述 | String | 是 | 产品描述，不能超过 512 个字符。 |
| Appname | String | 是 | 应用名称，用于生成 App Key。仅支持小写字母、数字和连字符，长度不能超过 32 个字符。 |
| Appkey | String | 是 | 应用唯一标识，格式为 `orgname#appname`。`orgname` 在你注册账号时由系统自动生成，创建后不可修改。 |
| 所在地 | String | 是 | 应用的所在地，支持选择 **国内** 或 **海外**。所在地将影响可选数据中心范围，应用创建后不能修改。 |
| 数据中心 | String | 是 | 终端用户所在的主要区域对应的数据中心，应用创建后不能修改。<br/> - 若 **所在地** 为 **国内**，数据中心默认为 **国内 2 区**。<br/> - 若 **所在地** 为 **海外**，数据中心可选择 **新加坡一区**、**美东一区** 或 **德国二区**。<br/> - 关于数据中心详情，参见 [数据中心文档](/product/data_center.html)。 |
| 注册模式 | String | 是 | 用户注册模式。<br/> - **授权注册**：只有企业管理员或者应用管理员才能注册用户。详见 [通过 REST API 授权注册单个用户](/document/server-side/account_register_authorized_single.html) 和 [批量授权注册用户](/document/server-side/account_register_authorized_batch.html)。<br/> - **开放注册**：使用客户端或 [REST API](/document/server-side/account_register_open.html) 开放注册用户。一般在体验 Demo 和测试环境时使用，正式环境中不推荐这种方式。 |

3. 应用创建完成后，系统会提示该应用为测试版应用。阅读测试版应用的基本使用方式和上线说明后，点击 **我已知晓**。

![img](/images/console/app_create_complete.png)

## 测试版应用试用说明

测试版应用在 [正式上线](/product/console/app_launch.html) 前，可免费试用 IM 各类套餐包、基础功能以及增值服务，无需支付任何费用。详见 [测试版应用试用说明](/product/pricing_method.html#测试版应用试用说明)。

## 后续操作

创建应用后，建议优先完成以下操作：

- 进入 [应用管理和配置页面](app_manage.html)，核对 App Key、数据中心和域名等配置是否正确。按需试用 IM 套餐和增值服务，确认测试环境中的功能配置符合业务预期。
- 准备上线时，参考 [应用上线说明](app_launch.html)，选择合适的上线方式。
