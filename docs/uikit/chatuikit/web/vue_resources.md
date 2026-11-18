# 版本与资源

本文汇总 Vue UIKit 的更新记录、Demo 与源码，并说明升级前建议核对的版本信息。初次使用可从 [开始接入](vue_quickstart.html) 了解完整路径。

## 常用资源

| 资源 | 用途 |
| :--- | :--- |
| [更新日志](https://webim-vue-uikit-docs.easemob.com/guide/changelog.html) | 查看功能变化、问题修复、破坏性变更和升级注意事项。 |
| [体验 Vue Demo](demo_vue.html) | 查看在线体验、本地运行和单群聊消息收发说明。 |
| [在线 Demo](https://webim-vue3.easemob.com/) | 直接体验 Vue UIKit 界面与功能。 |
| [UIKit 源码](https://github.com/Easemob-Community/easemob-uikit-vue) | 查阅组件库实现。 |
| [Demo 源码](https://github.com/Easemob-Community/easemob-demo-vue3) | 参考完整应用的页面组合和业务接入。 |

## 版本兼容性与升级准备

| 检查项目 | 建议操作 |
| :--- | :--- |
| UIKit 版本 | 查看项目实际安装版本，并阅读当前版本到目标版本之间的更新日志。 |
| Web SDK 与适配器 | 核对 SDK 版本、适配器包及入口配置，确认目标版本的依赖和能力要求。 |
| 组件与配置变化 | 对照更新日志检查属性、事件、插槽、类型与全局配置是否存在变更。 |
| AI 工具资料 | 核对 Skills 来源和 MCP 发布包覆盖的文档版本，避免将旧快照直接用于新版本实现。 |

在线文档、UIKit 发布包、Demo 和 MCP 的更新节奏可能不同。使用 Demo 或源码中的示例时，应结合其依赖清单、版本标签或提交记录确认适用范围。

## 从 Demo 迁移到业务项目

Demo 可作为页面组合和交互效果的参考。接入自己的项目时，需要对接自己的环信应用、用户体系和服务端 Token 分发，再根据业务需求选择组件和配置。

升级后建议回归登录与登出、单聊和群聊收发、会话切换、联系人与群组管理，以及已定制的主题、文案和 H5 界面。相关指南见 [开发指南](vue_development.html) ，参数定义见 [API 参考](vue_api.html) 。
