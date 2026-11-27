# 开始接入

本文说明 Vue UIKit 的接入准备、推荐阅读顺序与验证要点。Vue UIKit 适用于 Vue 3 项目；产品功能见 [产品概述](vue_overview.html) ，全部资料见 [开发文档导航](vue_guide.html) 。

## 接入准备

| 准备项 | 说明 |
| :--- | :--- |
| 环信应用 | 创建应用并获取 App Key。账号、应用和用户 Token 的准备方法见 [入门指引](beginner_guide.html#集成步骤) 。 |
| 测试用户 | 准备同一应用下的两个 IM 用户及其用户 Token，用于验证单聊和群聊。生产环境由业务服务器获取并分发用户 Token。 |
| Vue 项目 | 按 [快速开始](https://webim-vue-uikit-docs.easemob.com/guide/quickstart.html) 核对 Vue、Pinia、Node.js 和依赖要求。 |
| SDK 适配器 | 根据使用的环信 Web SDK 版本选择适配器，安装依赖和注册入口应与所选版本一致。 |

## 推荐接入顺序

首次使用时，建议按以下顺序阅读：

1. **体验 Demo**：通过 [体验 Vue Demo](demo_vue.html) 了解在线效果，也可以下载源码，在本地使用自己的环信应用验证单聊和群聊。
2. **完成基础接入**：按照 [快速开始](https://webim-vue-uikit-docs.easemob.com/guide/quickstart.html) 准备依赖，注册 Pinia、UIKit、所选 SDK 适配器及主题样式。
3. **配置初始化与登录**：结合 [Provider 全局配置](https://webim-vue-uikit-docs.easemob.com/components/provider.html) 和 [useClient](https://webim-vue-uikit-docs.easemob.com/api/composables/use-client.html) ，了解初始化、登录、Token 过期处理及全局功能配置。
4. **搭建业务界面**：组合 [会话模块](https://webim-vue-uikit-docs.easemob.com/components/conversation-container.html) 与 [聊天模块](https://webim-vue-uikit-docs.easemob.com/components/chat-container.html) ，再按需加入通讯录和群组管理。
5. **定制与扩展**：根据业务需要查阅 [开发指南](vue_development.html) 、 [组件文档](vue_components.html) 与 [API 参考](vue_api.html) 。

如果你已经接入 UIKit，可以直接按主题查找文档。安装依赖和配置示例请使用同一版本的文档，并根据所用 Web SDK 版本选择适配器。

## 验证接入结果

验证消息收发属于接入过程的一部分。完成基础界面后，建议检查以下内容：

| 检查项 | 验证方式 |
| :--- | :--- |
| 登录与连接 | 确认所用用户属于当前应用，能够登录，并能通过连接状态区分未连接、连接中和已连接。 |
| 单聊与群聊 | 使用两个独立登录环境发送和接收消息；群聊测试前，确认两个用户已加入目标群组。 |
| 会话与消息 | 切换会话，检查消息列表、未读数及发送状态是否符合预期。 |
| 账号切换 | 登出后使用另一用户登录，确认业务页面和账号状态正确切换。 |

如果界面有数据但消息收发失败，应检查 App Key、用户 Token、SDK 适配器和连接状态；如果组件外观异常，先检查主题样式是否已引入。更详细的配置与排查依据见 [Provider 全局配置](https://webim-vue-uikit-docs.easemob.com/components/provider.html) 和 [useClient](https://webim-vue-uikit-docs.easemob.com/api/composables/use-client.html) 。

## 继续开发

- 使用 AI 编程工具辅助接入：阅读 [开发指南中的 AI 辅助开发](vue_development.html#ai-辅助开发) 。
- 选择和组合业务界面：阅读 [组件文档](vue_components.html) 。
- 查询函数签名与参数：阅读 [API 参考](vue_api.html) 。
