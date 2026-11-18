# 组件文档

本文按用途汇总 Vue UIKit 的组件文档。每个链接提供使用示例及属性（Props）、事件（Events）和插槽（Slots）说明；完整参数定义还可查阅 [API 参考](vue_api.html) 。

## 选择组件

推荐先按 [开始接入](vue_quickstart.html) 完成依赖与登录，再配置 Provider、选择业务容器，最后按需替换局部界面。

| 开发任务 | 优先查阅 |
| :--- | :--- |
| 配置初始化、功能、主题和语言 | 全局配置与状态管理 |
| 搭建会话、聊天、通讯录和群组页面 | 业务模块组件 |
| 定制按钮、头像、输入框与设置项 | 基础 UI 组件 |
| 增加操作菜单、通知、预览与反馈 | 交互与反馈组件 |
| 展示用户资料、群资料和在线状态 | 数据展示组件 |

## 全局配置与状态管理

| 文档 | 用途 |
| :--- | :--- |
| [Provider 全局配置](https://webim-vue-uikit-docs.easemob.com/components/provider.html) | 配置 SDK 初始化、功能开关、主题、语言、通知和数据接管等全局能力。 |
| [Store 状态管理](https://webim-vue-uikit-docs.easemob.com/components/stores.html) | 了解 Pinia 状态读取、同步、Mock 数据注入，以及直接修改状态的边界。 |

## 业务模块组件

| 文档 | 用途 |
| :--- | :--- |
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

## 基础 UI 组件

| 文档 | 用途 |
| :--- | :--- |
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

## 交互与反馈组件

| 文档 | 用途 |
| :--- | :--- |
| [ActionSheet 操作菜单](https://webim-vue-uikit-docs.easemob.com/components/action-sheet.html) | 展示操作选项。 |
| [Modal 弹窗](https://webim-vue-uikit-docs.easemob.com/components/modal.html) | 展示对话框或确认操作。 |
| [Popup 弹出层](https://webim-vue-uikit-docs.easemob.com/components/popup.html) | 展示浮层内容。 |
| [Toast 轻提示](https://webim-vue-uikit-docs.easemob.com/components/toast.html) | 提供轻量操作反馈。 |
| [StatusBanner 状态横幅](https://webim-vue-uikit-docs.easemob.com/components/status-banner.html) | 展示连接等状态提示。 |
| [Notification 消息通知](https://webim-vue-uikit-docs.easemob.com/components/notification.html) | 配置页内与浏览器消息通知。 |
| [EmojiPicker 表情选择](https://webim-vue-uikit-docs.easemob.com/components/emoji-picker.html) | 选择表情。 |
| [ImageViewer 图片预览](https://webim-vue-uikit-docs.easemob.com/components/image-viewer.html) | 预览图片。 |

## 数据展示组件

| 文档 | 用途 |
| :--- | :--- |
| [PresenceAvatar 在线头像](https://webim-vue-uikit-docs.easemob.com/components/presence-avatar.html) | 结合头像展示在线状态。 |
| [PresenceSelector 状态选择](https://webim-vue-uikit-docs.easemob.com/components/presence-selector.html) | 选择和发布在线状态。 |
| [UserCard 用户卡片](https://webim-vue-uikit-docs.easemob.com/components/user-card.html) | 展示用户资料卡片。 |
| [GroupCard 群组卡片](https://webim-vue-uikit-docs.easemob.com/components/group-card.html) | 展示群组资料卡片。 |

## 组合与定制建议

- 先了解 Provider 与 Store 的职责，再组合业务容器；不要将演示中的 Mock 状态写入方式直接当作正式业务数据同步方案。
- 仅需改变局部展示或行为时，优先核对对应组件提供的配置、事件和插槽。
- 需要复用业务逻辑时，查阅 [组合式函数 API](https://webim-vue-uikit-docs.easemob.com/api/composables/index.html) ；调整数据读取和同步前，先阅读 Store 文档中的约束。
- 定制主题、文案和 H5 交互时，可继续阅读 [开发指南](vue_development.html) 。
