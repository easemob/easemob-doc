# 管理和配置应用

你可以在 **应用管理** 页面查看测试版和正式版应用，并进入对应配置页面。

## 管理应用

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
   
2. 在页面上方选择 **应用管理**，或在首页 **应用概览** 区域点击 **应用管理**。

![img](/images/console/app_mgmt_menu.png)

3. 进入应用列表页面后，你可以查看当前账号下的所有产品和应用。
   
   点击测试版或正式版的 App Key，即可进入对应应用详情页。

![img](/images/console/app_mgmt_list.png)

| 字段 | 说明 |
| :--- | :--- |
| 产品名称 | 创建应用时填写的产品名称。 |
| 产品描述 | 创建应用时填写的产品描述。 |
| AppKey-测试版 | 测试版应用的 App Key。点击可进入测试版应用详情。<br> - 若上线方式选择 **创建新的正式版应用**，应用上线后，测试版应用仍保留。<br> - 若上线方式选择 **原测试版应用升级为正式版**，上线后该项为空，**AppKey-正式版** 中显示正式版应用的 App Key。 |
| AppKey-正式版 | 正式版应用的 App Key。若应用尚未上线，该项为空。应用上线后，点击可进入正式版应用详情。 |
| 应用状态 | - **未上线**：仅有测试版应用。<br> - **上线中**：已提交上线申请，暂时无法进入应用详情。<br> - **已上线**：已生成正式版应用。 |
| 操作 | - **申请上线**：将测试版应用上线为正式版。详见 [应用上线](app_launch.html) 说明。<br> - **应用备案**：对正式版应用进行备案。详见 [应用备案](app_file.html) 说明。 |

4. 在 **应用概览** 页面查看应用详情，包含开发配置信息、应用基本信息、应用备案信息和服务开通信息。

![img](/images/console/app_info.png)

## 获取应用凭证

你可以在 **开发配置信息** 栏查看以下应用凭证：

- **AppKey**：应用唯一标识，格式为 `orgname#appname`。应用创建后，App Key 不可修改。详见 [创建应用文档](app_create.html#操作步骤)。
- **Client ID** 和 **Client Secret**：可用于生成 [App Token](/document/server-side/easemob_app_token.html) 和 [用户 Token](/document/server-side/easemob_user_token.html)。

![img](/images/console/app_info_develop.png)

## 查看应用服务器域名

进入目标测试版或正式版应用的 **应用概览** 页面，在 **开发配置信息 > 域名配置** 中查看 **REST API** 和 **Websocket** 两项地址，点击地址右侧的复制图标分别复制。

应用的服务器域名分为应用专属域名和集群域名，展示及使用规则如下：

| 域名类型 | 页面展示的地址 | 分配方式| 适用应用及使用要求  |
| :--- | :--- | :--- | :--- |
| 应用专属域名 | 当前应用的 REST API 和 WebSocket 专属地址。            | 按应用分配，每个应用使用自己的域名。 | 目前仅国内 2 区支持。**自 2026 年 11 月 27 日起在国内 2 区创建的应用，必须使用为该应用分配的专属域名。** |
| 集群域名     | 从 DNS 配置服务获取的 REST API 和 WebSocket 集群地址。 | 同一集群内的应用共用域名。   | 适用于国内 2 区仍使用集群域名的历史应用，以及其他数据中心的应用。 |

请以当前应用页面展示的实际地址为准。

下图展示国内 2 区已分配应用专属域名的应用。

![img](/images/console/app_domain.png)

两项地址的用途如下：

| 服务名称 | 用途 | 地址格式示例 |
| :--- | :--- | :--- |
| REST API | SDK 的 HTTP 请求及服务端 RESTful API 请求。 | `https://api-your-app.example.com` |
| Websocket | 收发 IM 消息的 WebSocket 长连接。 | `wss://ws-your-app.example.com` |

请使用同一应用、同一环境页面中的 App Key 和两项地址。客户端接收地址的格式因平台而异：例如，Android 分别设置 WebSocket 主机名、端口及 TLS，Web 使用完整 URL。各端配置方法见下表。服务端调用 RESTful API 时，在 REST 基准地址后按具体 API 文档追加应用路径及接口路径。

| 客户端 | SDK V4 配置说明 | SDK V5 配置说明 |
| :--- | :--- | :--- |
| Android | [配置应用专属域名](/v4/android/initialization.html#配置应用专属域名) | [配置应用专属域名](/document/android/initialization.html#配置应用专属域名) |
| iOS | [配置应用专属域名](/v4/ios/initialization.html#配置应用专属域名) | [配置应用专属域名](/document/ios/initialization.html#配置应用专属域名) |
| HarmonyOS | [配置应用专属域名](/v4/harmonyos/initialization.html#配置应用专属域名) | [配置应用专属域名](/document/harmonyos/initialization.html#配置应用专属域名) |
| Flutter | [配置应用专属域名](/v4/flutter/initialization.html#配置应用专属域名) | [配置应用专属域名](/document/flutter/initialization.html#配置应用专属域名) |
| React Native | [配置应用专属域名](/v4/react-native/initialization.html#配置应用专属域名) | [配置应用专属域名](/document/react-native/initialization.html#配置应用专属域名) |
| Web | [配置应用专属域名](/v4/web/initialization.html#配置应用专属域名) | [配置应用专属域名](/document/web/initialization.html#配置应用专属域名) |
| 小程序 | [配置应用专属域名](/v4/applet/initialization.html#配置应用专属域名) | [与 Web 共用配置](/document/web/initialization.html#配置应用专属域名) |

选择 **创建新的正式版应用** 上线时，正式版是另一个应用；国内 2 区应用使用应用专属域名时，两者域名不同，应重新获取正式版 App Key 和两项地址。选择 **原测试版应用直接升级** 时沿用原应用。详见 [应用上线](app_launch.html#上线事项)。

## 服务管理入口

在 **服务开通信息** 区域，可查看当前套餐版本与账户余额，也可 [调整套餐包](purchase_package.html#订阅-升级套餐包)、[开通增值服务](purchase_value_added.html) 并进行配置。

关于测试版应用试用套餐包、增值服务和扩展功能的说明，详见 [测试版应用试用说明](/product/pricing_method.html#测试版应用试用说明)。

![img](/images/console/app_info_activation.png)



