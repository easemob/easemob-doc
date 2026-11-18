# API 参考

本文提供 Vue UIKit 的 API 分类与常用查询入口，便于查找函数签名、返回值、状态字段和类型定义。接入步骤见 [开始接入](vue_quickstart.html) ，组件示例见 [组件文档](vue_components.html) 。

## API 分类

需要查询具体函数签名、返回值、状态字段或类型定义时，可以从 [API 总览](https://webim-vue-uikit-docs.easemob.com/api/index.html) 进入对应分类。

| 分类 | 主要内容 |
| :--- | :--- |
| [组件 Components](https://webim-vue-uikit-docs.easemob.com/api/components.html) | 基础组件、反馈组件、数据展示与业务容器的属性、事件和插槽。 |
| [组合式函数 Composables](https://webim-vue-uikit-docs.easemob.com/api/composables/index.html) | 客户端、会话、消息、联系人、群组、用户资料、主题和交互相关函数。 |
| [状态管理 Stores](https://webim-vue-uikit-docs.easemob.com/api/stores/index.html) | 连接、会话、消息、联系人、群组、在线状态和主题的 Pinia 状态契约。 |
| [工具函数 Utils](https://webim-vue-uikit-docs.easemob.com/api/utils/index.html) | 消息格式化、会话摘要、提及、下载、链接及通用工具。 |
| [类型与常量 Types](https://webim-vue-uikit-docs.easemob.com/api/types/index.html) | 公开 TypeScript 类型、常量，以及 SDK 中立契约。 |
| [配置 Configuration](https://webim-vue-uikit-docs.easemob.com/api/configuration.html) | 全局安装、Provider、功能开关、数据源和主题配置。 |

## 常用 API

| API | 查询用途 |
| :--- | :--- |
| [useUIKit](https://webim-vue-uikit-docs.easemob.com/api/composables/use-uikit.html) | 获取 UIKit 上下文与能力信息，了解当前配置和可用能力。 |
| [useClient](https://webim-vue-uikit-docs.easemob.com/api/composables/use-client.html) | 查询初始化、登录、登出与客户端状态相关操作。 |
| [useChat](https://webim-vue-uikit-docs.easemob.com/api/composables/use-chat.html) | 查询聊天与消息操作相关能力。 |
| [useConversation](https://webim-vue-uikit-docs.easemob.com/api/composables/use-conversation.html) | 查询会话列表、当前会话与会话操作。 |
| [useClientStore](https://webim-vue-uikit-docs.easemob.com/api/stores/use-client-store.html) | 查询连接、登录态及账号状态相关字段和方法。 |

## API 查询指引

| 问题 | 查询顺序 |
| :--- | :--- |
| 某个组件支持哪些配置、事件或插槽？ | 先看组件文档的使用示例，再看 Components 中的参数定义。 |
| 如何在自己的页面中复用 IM 业务逻辑？ | 从 Composables 查找对应会话、消息、联系人或群组能力。 |
| 如何读取界面当前状态？ | 先看 Store 使用指南，再查 Stores 中的字段、响应式读取方式与写入约束。 |
| 数据结构、枚举值或配置类型如何定义？ | 查阅 Types 和 Configuration，避免仅根据示例推断字段含义。 |

## 注意事项

请以项目所用 UIKit 版本的 API 为准，并核对初始化、登录和 Provider 上下文等调用前提。SDK 适配器能力、业务功能开关和用户权限可能影响实际行为；类型检查通过后，仍需在对应场景中验证。

如果使用 AI 辅助生成代码，请同时提供依赖版本和具体 API 文档，使用方式见 [AI 辅助开发](vue_development.html#ai-辅助开发) 。
