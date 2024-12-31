# AI 会话摘要插件

环信即时通讯 IM 提供群组会话摘要插件，通过 AI 技术针对单个群组会话中一段时间内的消息内容生成会话摘要，按话题详细列明讨论内容，包括话题标题、概要内容、相关消息条数及参与人人数及列表，支持用户一键跳转到首条消息，便于精读原文。该插件可帮助用户快速浏览大量未读消息，减少信息遗漏，助力用户高效获取关键信息，提升群聊体验。

## 效果展示

你可以点击[这里](https://console5-hsb.easemob.com)，体验 Web Demo，感受高效的聊天摘要功能。

下图为集成会话摘要插件后的示例效果： 

![img](/images/product/ai/conversation_summary_demo1.png)

## 开通功能

开通会话摘要插件前，确保你已成为环信的付费客户（已订阅专业版或旗舰版）且已开通消息漫游服务。

你可以按以下步骤在[环信即时通讯云控制台](https://console.easemob.com/user/login)开通。

1. 在环信即时通讯云的左侧导航栏中，选择 **即时通讯** > **AI 智能** > **AI 会话摘要助手**，点击**去配置**按钮。

![img](/images/product/ai/conversation_summary_configure.png)
   
2. 在**功能配置总览** > **基础功能** 页面，点击 **AI会话摘要助手**一栏中的**免费开通**。

![img](/images/product/ai/conversation_summary_enable.png)

3. 选择 **即时通讯** > **AI 智能** > **AI 会话摘要助手**，进行助手设置。

- 若选择**环信免费账户**，可免费试用 7 天，每天最多可调用 100 次 [RESTful API 生成会话摘要](conversation_summary_restful.html#生成会话摘要)，该额度每日 00:00 刷新，未使用部分将清零且不累积。
- 若选择 **OpenAI** 或 **MiniMax**，需要配置你的**模型设置**和 **API 密钥**。配置后，可点击**验证**，检验你的配置是否正确。

![img](/images/product/ai/conversation_summary_use.png)



