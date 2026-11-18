# 开发文档导航

本文汇总 Vue3 UIKit 的接入指南、组件文档和 API 参考，帮助你按开发任务查找资料。产品定位、功能和界面效果见[产品概述](vue_overview.html)；完整的使用说明、示例代码和参数定义见下方链接的 Vue3 UIKit 文档。

## 开始接入

首次使用时，建议按以下顺序阅读：

1. **体验 Demo**：通过[体验 Vue Demo](demo_vue.html)了解在线效果，也可以下载源码，在本地使用自己的环信应用验证单聊和群聊。
2. **完成基础接入**：按照[快速开始](https://webim-vue-uikit-docs.easemob.com/guide/quickstart.html)准备依赖，注册 Pinia、UIKit、所选 SDK 适配器及主题样式。
3. **配置初始化与登录**：结合 [Provider 全局配置](https://webim-vue-uikit-docs.easemob.com/components/provider.html)和 [useClient](https://webim-vue-uikit-docs.easemob.com/api/composables/use-client.html)，了解初始化、登录、Token 过期处理及全局功能配置。
4. **搭建业务界面**：组合[会话模块](https://webim-vue-uikit-docs.easemob.com/components/conversation-container.html)与[聊天模块](https://webim-vue-uikit-docs.easemob.com/components/chat-container.html)，再按需加入通讯录和群组管理。
5. **定制与扩展**：根据业务需要查阅下方的开发指南、组件配置与 API。

如果你已经接入 UIKit，可以直接按主题查找文档。安装依赖和配置示例请使用同一版本的文档，并根据所用 Web SDK 版本选择适配器。

## 开发指南

指南说明接入方式、功能原理和常见定制场景；具体组件参数与函数签名见后续的组件文档和 API 参考。

| 文档 | 主要内容 | 适用场景 |
| --- | --- | --- |
| [术语与数据模型](https://webim-vue-uikit-docs.easemob.com/guide/data-model.html) | 会话、消息、联系人、用户资料、在线状态的概念，以及列表字段的展示规则。 | 对齐产品与开发概念，理解数据如何显示。 |
| [进阶指南](https://webim-vue-uikit-docs.easemob.com/guide/advanced.html) | 功能开关、自定义数据源、组合式函数、用户资料、国际化、键盘交互及 SDK 适配器。 | 对接业务数据，调整功能行为，进行二次开发。 |
| [系统通知文案定制](https://webim-vue-uikit-docs.easemob.com/guide/notice-customization.html) | 系统通知的文案改写、条件过滤、事件禁用和渲染接管。 | 定制入群、退群等时间线提示。 |
| [AI 流式消息](https://webim-vue-uikit-docs.easemob.com/guide/ai-stream-message.html) | 流式消息的 SDK 语义、渲染与插件接入，以及能力边界。 | 在聊天中接入 AI 回复及流式内容。 |
| [主题定制](https://webim-vue-uikit-docs.easemob.com/guide/theme.html) | CSS 变量、品牌色、明暗模式、主题预设和运行时定制。 | 调整产品的整体视觉风格。 |
| [设计变量](https://webim-vue-uikit-docs.easemob.com/guide/design-tokens.html) | 颜色、字号、间距、圆角、阴影和动效等变量。 | 精细调整组件样式。 |
| [图标](https://webim-vue-uikit-docs.easemob.com/guide/icons.html) | 图标清单、业务图标映射，以及图标覆盖和新增方式。 | 查找、替换或扩展图标。 |
| [H5 适配指南](https://webim-vue-uikit-docs.easemob.com/guide/h5-adaptation.html) | 安全区、键盘避让、断点布局、页面导航与移动交互。 | 在移动浏览器中使用 UIKit。 |

#### AI 辅助开发

Vue3 UIKit 提供面向 AI 编程工具的资料和查询能力。接入方式见 [AI 集成（Skills / MCP）](https://webim-vue-uikit-docs.easemob.com/guide/ai-integration.html)。

| 方式 | 用途 |
| --- | --- |
| Agent Skills | 向支持 Skills 的 AI 编程工具提供接入知识、组件用法、主题与 H5 配置等参考。 |
| Vue UIKit 专用 MCP | 通过 `@easemob-community/uikit-mcp` 查询组件清单、组件 API 和文档，获取版本信息，并校验 Provider 配置。 |

专用 MCP 使用随发布包提供的文档快照，覆盖的 UIKit 版本和组件范围可能落后于在线文档；查询最新版本也不会自动更新整套快照。使用前请核对所用 MCP 版本的覆盖范围，具体 API 以对应 UIKit 版本的文档为准。

## 组件文档

组件文档提供使用示例，以及属性（Props）、事件（Events）和插槽（Slots）说明。建议先了解全局配置，再选择业务容器；需要调整局部界面时，再查阅基础组件和配套组件。

### 全局配置与状态管理

| 文档 | 用途 |
| --- | --- |
| [Provider 全局配置](https://webim-vue-uikit-docs.easemob.com/components/provider.html) | 配置 SDK 初始化、功能开关、主题、语言、通知和数据接管等全局能力。 |
| [Store 状态管理](https://webim-vue-uikit-docs.easemob.com/components/stores.html) | 了解 Pinia 状态读取、同步、Mock 数据注入，以及直接修改状态的边界。 |

### 业务模块组件

| 文档 | 用途 |
| --- | --- |
| [会话模块](https://webim-vue-uikit-docs.easemob.com/components/conversation-container.html) | 展示会话列表，处理会话选择、未读、置顶、免打扰及自定义入口。 |
| [聊天模块](https://webim-vue-uikit-docs.easemob.com/components/chat-container.html) | 组合聊天头部、消息列表、输入区和详情抽屉，配置消息操作及插件扩展。 |
| [消息列表](https://webim-vue-uikit-docs.easemob.com/components/message-list.html) | 定制消息气泡、头像、时间、消息状态及历史消息展示。 |
| [复合消息](https://webim-vue-uikit-docs.easemob.com/components/multi-body-message.html) | 使用图文等内容混排的复合消息，了解其与合并转发消息的区别。 |
| [通讯录模块](https://webim-vue-uikit-docs.easemob.com/components/contact-container.html) | 展示联系人、好友请求和群组入口，配置搜索、排序及详情视图。 |
| [地址簿容器](https://webim-vue-uikit-docs.easemob.com/components/address-book-container.html) | 接管通讯录子视图，组合自定义地址簿界面。 |
| [群组模块](https://webim-vue-uikit-docs.easemob.com/components/group-container.html) | 展示、搜索、排序和选择群组。 |
| [群管理模块](https://webim-vue-uikit-docs.easemob.com/components/group-management.html) | 使用成员、群公告、共享文件、入群申请、禁言和黑白名单等管理组件。 |
| [黑名单模块](https://webim-vue-uikit-docs.easemob.com/components/block-list.html) | 展示和管理黑名单，配置添加黑名单及相关子视图。 |
| [添加联系人弹窗](https://webim-vue-uikit-docs.easemob.com/components/add-contact-modal.html) | 配置联系人搜索和添加流程，或接管业务侧添加动作。 |
| [创建群组弹窗](https://webim-vue-uikit-docs.easemob.com/components/create-group-modal.html) | 配置建群表单、成员选择及创建动作。 |

### 基础 UI 组件

| 文档 | 用途 |
| --- | --- |
| [Button 按钮](https://webim-vue-uikit-docs.easemob.com/components/button.html) | 触发操作，配置按钮类型、尺寸和状态。 |
| [Icon 图标](https://webim-vue-uikit-docs.easemob.com/components/icon.html) | 展示图标。 |
| [Avatar 头像](https://webim-vue-uikit-docs.easemob.com/components/avatar.html) | 展示用户或群组头像。 |
| [Badge 徽标](https://webim-vue-uikit-docs.easemob.com/components/badge.html) | 展示数量或状态标记。 |
| [Cell 单元格](https://webim-vue-uikit-docs.easemob.com/components/cell.html) | 组合列表行和设置项。 |
| [Checkbox 多选指示](https://webim-vue-uikit-docs.easemob.com/components/checkbox.html) | 展示多选状态。 |
| [CopyableText 可复制文本](https://webim-vue-uikit-docs.easemob.com/components/copyable-text.html) | 展示可复制的文本。 |
| [Empty 空状态](https://webim-vue-uikit-docs.easemob.com/components/empty.html) | 展示无数据或无选中项的状态。 |
| [Input 输入框](https://webim-vue-uikit-docs.easemob.com/components/input.html) | 接收文本输入。 |
| [IconButton 图标按钮](https://webim-vue-uikit-docs.easemob.com/components/icon-button.html) | 提供图标形式的操作入口。 |
| [ScrollToTop 回到顶部](https://webim-vue-uikit-docs.easemob.com/components/scroll-to-top.html) | 在滚动区域中提供回到顶部入口。 |
| [Skeleton 骨架屏](https://webim-vue-uikit-docs.easemob.com/components/skeleton.html) | 展示加载占位。 |
| [Switch 开关](https://webim-vue-uikit-docs.easemob.com/components/switch.html) | 切换布尔配置。 |
| [Resizable 拖拽尺寸](https://webim-vue-uikit-docs.easemob.com/components/resizable.html) | 通过拖拽调整容器尺寸。 |
| [Text 排版文本](https://webim-vue-uikit-docs.easemob.com/components/text.html) | 统一文本层级、字号、字重和颜色。 |

### 交互与反馈组件

| 文档 | 用途 |
| --- | --- |
| [ActionSheet 操作菜单](https://webim-vue-uikit-docs.easemob.com/components/action-sheet.html) | 展示操作选项。 |
| [Modal 弹窗](https://webim-vue-uikit-docs.easemob.com/components/modal.html) | 展示对话框或确认操作。 |
| [Popup 弹出层](https://webim-vue-uikit-docs.easemob.com/components/popup.html) | 展示浮层内容。 |
| [Toast 轻提示](https://webim-vue-uikit-docs.easemob.com/components/toast.html) | 提供轻量操作反馈。 |
| [StatusBanner 状态横幅](https://webim-vue-uikit-docs.easemob.com/components/status-banner.html) | 展示连接等状态提示。 |
| [Notification 消息通知](https://webim-vue-uikit-docs.easemob.com/components/notification.html) | 配置页内与浏览器消息通知。 |
| [EmojiPicker 表情选择](https://webim-vue-uikit-docs.easemob.com/components/emoji-picker.html) | 选择表情。 |
| [ImageViewer 图片预览](https://webim-vue-uikit-docs.easemob.com/components/image-viewer.html) | 预览图片。 |

### 数据展示组件

| 文档 | 用途 |
| --- | --- |
| [PresenceAvatar 在线头像](https://webim-vue-uikit-docs.easemob.com/components/presence-avatar.html) | 结合头像展示在线状态。 |
| [PresenceSelector 状态选择](https://webim-vue-uikit-docs.easemob.com/components/presence-selector.html) | 选择和发布在线状态。 |
| [UserCard 用户卡片](https://webim-vue-uikit-docs.easemob.com/components/user-card.html) | 展示用户资料卡片。 |
| [GroupCard 群组卡片](https://webim-vue-uikit-docs.easemob.com/components/group-card.html) | 展示群组资料卡片。 |

## API 参考

需要查询具体函数签名、返回值、状态字段或类型定义时，可以从 [API 总览](https://webim-vue-uikit-docs.easemob.com/api/index.html)进入对应分类。

| 分类 | 主要内容 |
| --- | --- |
| [组件 Components](https://webim-vue-uikit-docs.easemob.com/api/components.html) | 基础组件、反馈组件、数据展示与业务容器的属性、事件和插槽。 |
| [组合式函数 Composables](https://webim-vue-uikit-docs.easemob.com/api/composables/index.html) | 客户端、会话、消息、联系人、群组、用户资料、主题和交互相关函数。 |
| [状态管理 Stores](https://webim-vue-uikit-docs.easemob.com/api/stores/index.html) | 连接、会话、消息、联系人、群组、在线状态和主题的 Pinia 状态契约。 |
| [工具函数 Utils](https://webim-vue-uikit-docs.easemob.com/api/utils/index.html) | 消息格式化、会话摘要、提及、下载、链接及通用工具。 |
| [类型与常量 Types](https://webim-vue-uikit-docs.easemob.com/api/types/index.html) | 公开 TypeScript 类型、常量，以及 SDK 中立契约。 |
| [配置 Configuration](https://webim-vue-uikit-docs.easemob.com/api/configuration.html) | 全局安装、Provider、功能开关、数据源和主题配置。 |

常用入口：[useUIKit](https://webim-vue-uikit-docs.easemob.com/api/composables/use-uikit.html)、[useClient](https://webim-vue-uikit-docs.easemob.com/api/composables/use-client.html)、[useChat](https://webim-vue-uikit-docs.easemob.com/api/composables/use-chat.html)、[useConversation](https://webim-vue-uikit-docs.easemob.com/api/composables/use-conversation.html)、[useClientStore](https://webim-vue-uikit-docs.easemob.com/api/stores/use-client-store.html)。

## 版本与资源

| 资源 | 用途 |
| --- | --- |
| [更新日志](https://webim-vue-uikit-docs.easemob.com/guide/changelog.html) | 查看功能变化、问题修复、破坏性变更和升级注意事项。 |
| [体验 Vue Demo](demo_vue.html) | 查看在线体验、本地运行和单群聊消息收发说明。 |
| [在线 Demo](https://webim-vue3.easemob.com/) | 直接体验 Vue3 UIKit 界面与功能。 |
| [UIKit 源码](https://github.com/Easemob-Community/easemob-uikit-vue) | 查阅组件库实现。 |
| [Demo 源码](https://github.com/Easemob-Community/easemob-demo-vue3) | 参考完整应用的页面组合和业务接入。 |
