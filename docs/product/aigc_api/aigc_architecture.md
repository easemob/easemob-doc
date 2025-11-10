# 环信 AIGC 方案架构

本文介绍使用环信即时通讯 IM 提供的 AI 智能功能。

使用环信即时通讯 IM 提供的 AI 机器人聊天。你需要在 [环信控制台](https://console.easemob.com/user/login) 开通 AI 智能功能，创建机器人，即实现与机器人的 **单聊** 功能。

此外，你可以在[环信控制台](https://console.easemob.com/user/login)查看机器人账号消耗的 token 数和消耗趋势。

有关更多信息，请参见 [使用 AI 机器人聊天](aigc_use.html) 和 [调用 REST API 获取 app 下的机器人列表](aigc_rest_api.html)相关文档。

## 技术架构

目前，环信 AI 智能功能**仅支持单聊**，工作流程如下：

1. 用户发消息给机器人。
2. 环信服务器收到消息后，通过环信机器人服务将用户消息传递给第三方大模型厂商。
3. 第三方大模型厂商对用户消息进行回复，将消息回复内容发送给环信机器人服务。
4. 环信机器人服务收到消息后，通过环信服务器将回复内容发送给用户。

![img](/images/aigc/technical_architecture2.png)


