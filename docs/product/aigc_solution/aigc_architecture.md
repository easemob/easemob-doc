# 方案原理

通过配置服务端和客户端，利用环信即时通讯 IM 服务器回调功能，在 IM 中引入 AI 服务（以 MiniMax 中文大语言模型为例），创建机器人账号，从而跑通示例项目。

## 技术架构

目前，环信 AIGC 方案可通过服务器回调服务实现与机器人聊天，以单聊为例，工作流程如下：

1. 用户发消息给机器人。
2. 环信服务器收到消息后，通过服务端回调将事件通知第三方大模型厂商。
3. 第三方大模型厂商收到事件通知，将消息回复内容发送给 app server。
4. app server 调用 Restful API 将回复内容发送给环信服务器。
5. 环信服务器将回复内容发送给用户。

![img](/images/aigc/technical_architecture1.png)

## 跑通示例项目

完成客户端和服务端配置，跑通 [GitHub 示例项目](https://github.com/easemob/Easemob-AIGCService-Example)，体验与 AIGC 数字人沟通方案。

有关更多信息，请参见 [跑通示例项目文档说明](aigc_run_through_demo_server.html)。


