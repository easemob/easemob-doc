# 使用 Agent Skills 集成

本文介绍如何安装和使用环信 IM Agent Skills。安装完成后，你可以通过自然语言让 Coding Agent 在项目中集成 `easemob-websdk`、实现即时通讯功能、查询 SDK 接口或排查问题。

## 功能概述

`@easemob/chat-agent-skills` 是 `easemob-websdk` 的 AI 辅助集成工具。安装后，Coding Agent 会获得名为 `easemob-chat` 的项目级 Skills，可以：

- **分析项目**：识别现有技术栈、SDK 集成状态及可复用的客户端、状态管理和 UI 组件。
- **匹配方案**：根据功能需求和浏览器、小程序、Taro、uni-app、uni-app X 等宿主环境选择合适的集成方式。
- **核对接口**：按需查阅 SDK 文档、API Reference 和 TypeScript 类型声明，确保接口与项目安装的 SDK 版本匹配。
- **完成集成**：安装或更新 `easemob-websdk`，复用项目现有架构，实现初始化、登录、事件注册及业务功能。
- **验证排障**：运行必要的检查或测试，并根据接口定义、错误信息和脱敏日志排查问题。

Skills 当前覆盖的主要能力如下：

| 模块 | 能力 |
| --- | --- |
| 初始化与连接 | 初始化、Token 登录、登出、连接状态和事件注册 |
| 会话与消息 | 会话列表、未读数、单聊、群聊、历史消息、消息收发、已读、撤回、编辑和附件消息 |
| 联系人与资料 | 通讯录、好友申请、黑名单和用户资料 |
| 群组与聊天室 | 群组和聊天室的成员、管理员、公告、禁言及属性管理 |
| 扩展能力 | 在线状态、推送偏好和 Thread |
| 辅助能力 | API 查询、故障排查、平台适配和旧版 SDK 迁移 |

## 前提条件与兼容性

#### 前提条件

- 已安装 Node.js 18 或更高版本。
- 使用 Codex、Cursor，或其他支持项目级 Open Agent Skills 的 Coding Agent。
- 已在 Coding Agent 中打开需要集成环信 SDK 的业务项目，并且可在项目根目录执行命令。

#### 兼容性说明

| 类别 | 已覆盖范围 | 使用说明 |
| --- | --- | --- |
| Coding Agent | Codex、Cursor、兼容 Open Agent Skills 的其他工具 | 不同工具对应不同的安装参数和目录 |
| JavaScript 宿主 | 浏览器、小程序、Taro、uni-app、uni-app X | 附件选择、网络和文件 API 可能因宿主而异 |

:::tip
小程序、Taro、uni-app 和 uni-app X 等跨端宿主可能存在平台 API 差异。涉及文件、图片、推送或网络切换时，建议在需求中明确要求真机验证项。
:::

## 安装 Skills

无需预先全局安装 `@easemob/chat-agent-skills`。进入业务项目根目录，再根据使用的 Coding Agent 执行对应命令：

| 工具 | 安装命令 | 安装位置 |
| --- | --- | --- |
| Cursor | `npx @easemob/chat-agent-skills@latest init --tool cursor` | `.cursor/skills/easemob-chat/` |
| Codex | `npx @easemob/chat-agent-skills@latest init --tool codex` | `.agents/skills/easemob-chat/` |
| 其他兼容工具 | `npx @easemob/chat-agent-skills@latest init --tool agent` | `.agents/skills/easemob-chat/` |

`npx` 会临时下载并运行最新版安装器。安装器会先展示文件写入计划并请求确认。安装完成后，请重新打开项目会话或重新加载 Coding Agent，使 Skills 生效。

执行以下命令检查安装状态：

```bash
npx @easemob/chat-agent-skills@latest doctor
```

如果输出中包含 `healthy=yes`，则表示 Skills 安装正常。

:::tip
安装 Skills 时，业务项目可以尚未安装 SDK。最终的业务代码需依赖 `easemob-websdk`；如果项目中尚未安装，可以自行执行 `npm install easemob-websdk`，也可以在集成需求中明确让 Agent 添加依赖。
:::

## 最佳实践

以下示例介绍 `easemob-chat` 的基本用法，以及不同集成场景下的推荐实践。

### 基本用法

安装完成后，你可以直接在 Coding Agent 的项目对话中描述需求。为确保正确触发 `easemob-chat`，请明确写出“环信 SDK”或 `easemob-websdk`，并说明使用场景、目标功能和验证要求。

通用句式：

```text
使用环信 SDK 实现[功能]
使用环信 SDK 实现[风格/场景]的[功能]
使用环信 SDK 在[宿主/框架]中实现[功能]
使用 easemob-websdk 实现[功能]
```

也可以显式调用 Skills：

```text
$easemob-chat 使用环信 SDK 实现[功能]
```

### 新项目首次集成

如果项目尚未接入 SDK，建议同时说明初始化、登录、连接状态和验证要求。

```text
使用环信 SDK 实现初始化、Token 登录和连接状态处理。
```

### 现有项目增加聊天功能

说明宿主或框架、功能范围和需要复用的项目能力，可以减少不必要的改造。

```text
使用环信 SDK 在 React 浏览器项目中实现会话列表和消息收发。
使用环信 SDK 在微信小程序原生项目中实现图片消息发送，并列出真机验证项。
使用环信 SDK 在 Taro React 项目中实现聊天和附件选择，保留当前状态管理和组件库。
```

也可以按功能模块提出需求：

```text
使用环信 SDK 实现会话列表、未读数、历史消息和文本/图片消息收发。
使用环信 SDK 实现通讯录、好友申请和黑名单。
使用环信 SDK 实现群列表、创建群、群成员管理和群公告。
```

### 实现业务场景

对于客服、社区或类似微信的完整场景，建议限定必需功能，避免范围过大。

```text
使用环信 SDK 实现类似微信的聊天功能。
使用环信 SDK 实现商城客服聊天，只需要固定单聊窗口、历史消息、文本和图片消息。
使用环信 SDK 实现一个群社区，包含群列表、群成员、群公告和群聊。
```

### 查询 API 或排查问题

如果只需要结论，请明确说明不要修改工程。排障时建议提供错误信息、复现步骤和已脱敏日志。

```text
查询环信 SDK `ChatManager.sendMessage` 的参数和返回值，不要修改工程。
环信 SDK 登录出现 Provision rejected，请根据错误信息和脱敏日志排查，不要输出 Token。
```

### 从旧版 SDK 迁移

迁移前建议让 Agent 先确认当前 SDK 版本、现有调用方式和改造范围，再逐步替换并验证。

```text
把当前项目旧版环信 SDK 的初始化、登录和消息发送代码迁移到 `easemob-websdk`。
```

## 提示词示例

为了让 Agent 准确理解并直接实现需求，建议说明以下信息：

| 信息 | 示例 |
| --- | --- |
| SDK 标识 | 环信 SDK、`easemob-websdk` |
| 宿主或框架 | React 浏览器项目、Vue、微信小程序、Taro |
| 目标场景 | 在线客服、群社区、会话列表 |
| 必需功能 | Token 登录、历史消息、文本和图片消息 |
| 复用项或限制 | 复用 Pinia store、不新增 UI 库、不修改工程 |
| 验证要求 | 运行类型检查、列出真机验证项 |

例如：

```text
使用环信 SDK 在现有 Vue 项目中实现在线客服聊天，只包含 Token 登录、固定单聊、历史消息、文本和图片消息；复用当前 Pinia store 和组件库，完成后运行类型检查。
```

为确保正确触发 Skills，请在需求中明确写出“环信 SDK”或 `easemob-websdk`。仅描述“做一个聊天页面”或“实现群组管理”等通用需求时，Skills 默认不会触发，以避免在普通业务开发中加载不必要的 SDK 文档并消耗额外 Token。

## 更新 Skills

升级 `easemob-websdk` 后，或需要获取新版集成知识时，执行：

```bash
npx @easemob/chat-agent-skills@latest update --tool cursor
```

将命令中的 `cursor` 替换为实际使用的 `codex` 或 `agent`。更新操作默认不会覆盖手动修改过的 Skills 文件。

更新完成后，建议重新加载 Coding Agent，然后再次执行：

```bash
npx @easemob/chat-agent-skills@latest doctor
```

确认输出中包含 `healthy=yes`。

## 安全注意事项

- 用户 Token 应由业务服务端安全签发，不应由前端生成。
- 不要在前端源码、Agent 对话、代码仓库或日志中写入 App Secret、明文密码或生产环境 Token。
- 提供日志给 Agent 前，应先对 Token、用户标识和其他敏感字段进行脱敏。
- 不要为了便于本地调试而在前端长期保存生产凭据。
- 上线前，应使用测试账号验证登录、消息收发、推送、多设备和真机行为，并对权限、限流和异常分支进行检查。

## 常见问题

#### Skills 没有触发怎么办？

先执行安装检查：

```bash
npx @easemob/chat-agent-skills@latest doctor
```

如果已显示 `healthy=yes`，请重新打开项目会话或重新加载 Coding Agent。提问时明确写出“环信 SDK”或 `easemob-websdk`，也可以显式使用 `$easemob-chat`。

#### 项目还没有安装 `easemob-websdk` 怎么办？

Skills 和 SDK 是两个不同的依赖。可以在项目根目录执行：

```bash
npm install easemob-websdk
```

也可以在需求中明确让 Agent 安装 SDK 并完成集成。

#### 示例接口与项目中的类型不一致怎么办？

以项目实际安装版本的 `.d.ts` 文件和对应版本文档为准。可以要求 Agent 先确认 SDK 版本、核对类型声明，再修改代码。

#### 为什么更新后没有覆盖手动修改的 Skills 文件？

更新操作默认保护手动修改过的 Skills 文件，避免丢失项目级定制。请先检查更新输出和文件差异，再决定如何合并。

#### 只查询 API，无需 Agent 改代码怎么办？

在问题中明确写出“不要修改工程”或“仅输出接口说明和示例”。Agent 将以查询和解释为主。

