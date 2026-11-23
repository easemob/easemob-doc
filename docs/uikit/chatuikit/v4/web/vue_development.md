# 开发指南

本文按开发任务整理 Vue UIKit 的指南入口。首次接入先阅读 [开始接入](vue_quickstart.html) ；定制过程中，再结合 [组件文档](vue_components.html) 和 [API 参考](vue_api.html) 核对用法。

## AI 辅助开发

Vue UIKit 提供面向 AI 编程工具的资料和查询能力。接入方式见 [AI 集成（Skills / MCP）](https://webim-vue-uikit-docs.easemob.com/guide/ai-integration.html) 。

| 方式 | 用途 |
| :--- | :--- |
| Agent Skills | 向支持 Skills 的 AI 编程工具提供接入知识、组件用法、主题与 H5 配置等参考。 |
| Vue UIKit 专用 MCP | 通过 `@easemob-community/uikit-mcp` 查询组件清单、组件 API 和文档，获取版本信息，并校验 Provider 配置。 |

专用 MCP 使用随发布包提供的文档快照，覆盖的 UIKit 版本和组件范围可能落后于在线文档；查询最新版本也不会自动更新整套快照。使用前请核对所用 MCP 版本的覆盖范围，具体 API 以对应 UIKit 版本的文档为准。

#### 推荐使用方式

1. 向 AI 工具说明项目使用 Vue 3，并提供当前 UIKit 版本、Web SDK 版本及适配器信息。
2. 按 [AI 集成文档](https://webim-vue-uikit-docs.easemob.com/guide/ai-integration.html) 接入 Skills 或 Vue UIKit 专用 MCP。
3. 先让 AI 查阅相关组件文档和 API，再生成接入或定制代码；需要修改配置时，结合 MCP 的配置校验能力检查。
4. 在项目中验证登录、消息收发和页面交互。AI 生成的实现仍需与项目依赖版本及对应文档核对。

Skills 适合提供整体接入知识，MCP 适合按问题查询组件、API 和资料，两者可以配合使用。左侧 React UIKit 下的“使用 MCP 集成”是另一套入口，Vue 项目应使用本节提供的 Vue 专用说明。

## 按主题查找指南

| 文档 | 主要内容 | 适用场景 |
| :--- | :--- | :--- |
| [术语与数据模型](https://webim-vue-uikit-docs.easemob.com/guide/data-model.html) | 会话、消息、联系人、用户资料、在线状态的概念，以及列表字段的展示规则。 | 对齐产品与开发概念，理解数据如何显示。 |
| [进阶指南](https://webim-vue-uikit-docs.easemob.com/guide/advanced.html) | 功能开关、自定义数据源、组合式函数、用户资料、国际化、键盘交互及 SDK 适配器。 | 对接业务数据，调整功能行为，进行二次开发。 |
| [系统通知文案定制](https://webim-vue-uikit-docs.easemob.com/guide/notice-customization.html) | 系统通知的文案改写、条件过滤、事件禁用和渲染接管。 | 定制入群、退群等时间线提示。 |
| [AI 流式消息](https://webim-vue-uikit-docs.easemob.com/guide/ai-stream-message.html) | 流式消息的 SDK 语义、渲染与插件接入，以及能力边界。 | 在聊天中接入 AI 回复及流式内容。 |
| [主题定制](https://webim-vue-uikit-docs.easemob.com/guide/theme.html) | CSS 变量、品牌色、明暗模式、主题预设和运行时定制。 | 调整产品的整体视觉风格。 |
| [设计变量](https://webim-vue-uikit-docs.easemob.com/guide/design-tokens.html) | 颜色、字号、间距、圆角、阴影和动效等变量。 | 精细调整组件样式。 |
| [图标](https://webim-vue-uikit-docs.easemob.com/guide/icons.html) | 图标清单、业务图标映射，以及图标覆盖和新增方式。 | 查找、替换或扩展图标。 |
| [H5 适配指南](https://webim-vue-uikit-docs.easemob.com/guide/h5-adaptation.html) | 安全区、键盘避让、断点布局、页面导航与移动交互。 | 在移动浏览器中使用 UIKit。 |

## 选择合适的定制方式

| 需求 | 建议路径 |
| :--- | :--- |
| 配置好友、群组、在线状态等能力 | 先核对 Provider 的全局配置，再检查业务组件的局部配置与 SDK 能力。 |
| 修改名称、头像、联系人等业务数据 | 先理解数据模型，再按 Provider 和进阶指南中的数据接管方式对接业务数据。 |
| 调整操作菜单、输入区或消息渲染 | 先查看对应组件的属性、事件和插槽，再决定是否使用组合式函数或插件扩展。 |
| 调整品牌视觉与文案 | 外观从主题、设计变量和图标入手；语言与文案定制查阅进阶指南。 |
| 适配移动浏览器 | 结合 H5 指南处理布局、安全区、键盘避让及页面导航。 |

全局配置入口见 [Provider 全局配置](https://webim-vue-uikit-docs.easemob.com/components/provider.html) 。涉及数据接管时，请以当前版本文档推荐的配置方式为准，避免混用不同版本的示例。

## 开发与验证建议

先用默认组件跑通消息收发，再逐项开启能力或接管业务行为。每次调整后，结合相关角色、消息类型和设备检查实际效果；消息翻译、语音转文字等能力还需核对服务开通情况。
