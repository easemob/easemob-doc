# 使用 AI 机器人聊天

使用 AI 机器人聊天，你需要首先开通 AI 智能功能，然后创建机器人。

## 1. 开通 AI 智能功能

你可以在[环信即时通讯控制台](https://console.easemob.com/user/login)开通 AI 机器人功能。

1. 登录[环信即时通讯云控制台](https://console.easemob.com/user/login)，在首页的**应用列表**区域点击目标应用的**操作**一栏中的**管理**。

![img](@static/images/aigc/app_select.png)

2. 选择**即时通讯** > **功能配置** > **功能配置总览**。选择**试用功能**页签，点击**智能机器人 Chatbot** 对应的**操作**一栏中的**申请试用**。

![img](@static/images/aigc/ai_open.png)

## 2. 创建机器人

1. 选择**即时通讯** > **AI 智能** > **AI机器人**，进入 **AI 机器人**页面。点击**创建机器人**。

:::tip
每个 app 默认支持 200 个机器人，可联系环信商务提升该上限。
:::

![img](@static/images/aigc/aichatbot_create.png)

1. 配置机器人相关信息。

| 参数   | 类型   | 是否必需     | 描述      |
| :--------- | :----- | :----------- | :--------- |
| 机器人名称                         | String      | 是  | 机器人的名称，长度在 64 个字符内。   |
| 用户 ID                            | String      | 是  | 机器人对应的 IM 的用户 ID。目前一个机器人只能绑定一个用户 ID。<br/>**若输入了不存在的用户 ID，配置机器人信息后，会自动创建用户。**<br/>用户 ID 长度不可超过 64 个字节。不可设置为空。支持以下字符集：<br/>- 26 个小写英文字母 a-z；<br/>- 26 个大写英文字母 A-Z；<br/>- 10 个数字 0-9；<br/>- “\_”, “-”, “.”。 <br/><Container type="notice" title="注意"><br/>- 该参数不区分大小写，因此 `Aa` 和 `aa` 为相同的用户 ID；<br/>- 请确保同一个 app 下，用户 ID 唯一；<br/>- 用户 ID 为公开信息，请勿使用 UUID、邮箱地址、手机号等敏感信息。</Container>   | 
| 头像                               | String      | 是  | 机器人的头像图片链接。  |
| AI引擎       |        | 是  | 目前只能选择 **MINIMAX**。 | 
| Model                    |   | 是   | 厂商支持的 AI 模型类别，当前可支持选择。关于 API 模型类别的详细介绍，请参阅 [MiniMax 官方文档](https://platform.minimaxi.com/document/Models?key=66701cb01d57f38758d581a4)。 |
| System prompt                   | String      | 是  | 具体机器人的设定，长度影响接口性能。关于该参数的更多详情，请参阅 [MiniMax 官方文档](https://platform.minimaxi.com/document/ChatCompletion%20Pro?key=66718f6ba427f0c8a57015ff)。 | 
| Top-p              | Int         | 是  | 控制生成环节采样范围，参数值越小，生成结果越稳定。关于该参数的更多详情，请参阅 [MiniMax 官方文档](https://platform.minimaxi.com/document/ChatCompletion%20Pro?key=66718f6ba427f0c8a57015ff)。|
| Temperature        | Int         | 是  | 控制生成环境采样随机性，参数值越小，生成结果越稳定。关于该参数的更多详情，请参阅 [MiniMax 官方文档](https://platform.minimaxi.com/document/ChatCompletion%20Pro?key=66718f6ba427f0c8a57015ff)。 |

![img](@static/images/aigc/aichatbot_configure.png)

3. 查看新创建的机器人。

![img](@static/images/aigc/aichatbot_view.png)

## 3. 体验用机器人聊天

创建机器人账户后，你可以体验和它进行聊天。

1. 若你开启了好友关系检查功能（**即时通讯** > **服务概览** > **设置**），可以在**即时通讯 > 运营服务 > 用户管理** 页面，添加机器人绑定的即时通讯 IM 用户为好友。例如，图中的 **aitest** 用户添加新创建的 **bbb** 用户为好友，与机器人 **aaa** 进行聊天。在 **aitest1** 用户的**操作**一栏中选择**查看IM用户好友**，在文本框中输入 **bbb**，点击**添加好友**。
   
:::tip   
若关闭了好友检查功能，则无需添加好友即可聊天。
:::

![img](@static/images/aigc/ai_add_contact.png)

1. 用户 **aitest** 与机器人 **aaa** 进行聊天，以下截图以 Android 设备为例。

<img src=@static/images/aigc/ai_chat.png  width="400" height="900"/>



## 4. 查看数据统计

你可以在即时通讯云控制台的左侧导航栏选择 **即时通讯** > **AI 智能** > **数据统计**，查看机器人账号消耗的 token 数和消耗趋势。

目前，大模型平台只能选择 **MINIMAX**。

![img](@static/images/aigc/ai_token_statistic.png)




 







