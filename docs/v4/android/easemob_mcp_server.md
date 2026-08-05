# 环信 MCP Server 使用指南

## 功能说明

环信 MCP Server 基于 MCP（Model Context Protocol）实现，为支持 MCP 的 AI 编程工具提供环信 IM 相关文档查询和源码检索能力，可用于以下场景：

- 查询 SDK、单群聊 UIKit、CallKit、聊天室 UIKit 文档。
- 检索 Demo 或示例工程源码。
- 辅助集成、功能开发和问题排查。

MCP（Model Context Protocol，模型上下文协议）是 Anthropic 推出的一项开放标准，旨在为 AI 应用与外部数据源及工具之间建立安全、统一的交互方式。通过 MCP，AI 助手可以动态访问知识库、调用 API、操作本地资源，从而拓展能力边界。

更多信息请参考：[MCP 官方文档](https://modelcontextprotocol.io/)。

## 支持范围

支持以下平台 SDK、单群聊 UIKit、CallKit、聊天室 UIKit 的文档查询与源码检索能力：

| 平台         | SDK  | 单群聊 UIKit | CallKit | 聊天室 UIKit | Demo 源码 |
| :----------- | :--- | :---- | :------ | :------------ | :-------- |
| iOS          | ✓    | ✓     | ✓       | ✓             | ✓         |
| Android      | ✓    | ✓     | ✓       | ✓             | ✓         |
| Web          | ✓    | ✓     | ✓       | ✓             | ✓         |
| HarmonyOS    | ✓    | ✓     | ✗       | ✗             | ✗         |
| Flutter      | ✓    | ✓     | ✗       | ✓             | ✓         |
| React Native | ✓    | ✓     | ✗       | ✓             | ✓         |

:::tip
- CallKit 仅 iOS、Android、Web 平台支持。
- 聊天室 UIKit 仅 HarmonyOS 平台不支持，其他平台均支持。
- Demo 源码仅 HarmonyOS 平台不支持，其他平台均包含。
:::

## 支持的工具

环信 MCP Server 支持以下 AI 编程工具：

- Claude（Desktop/CLI）
- Cursor
- Codex（Desktop/CLI）
- Qoder
- Kiro（IDE/CLI）
- Trae
- Copilot CLI
- VSCode
- AMP

## 安装说明

安装前需满足如下条件：

- 已安装 Node.js 和 npm。
- AI 编程工具支持 MCP 配置。

安装步骤如下：

1. 克隆代码仓库：

   ```bash
   git clone https://github.com/easemob/imdev-mcp-server
   ```

2. 进入项目目录并安装依赖：

   ```bash
   cd imdev-mcp-server/easeim-mcp-server
   npm install
   npm run build
   ```

## 配置说明

在 AI 编程工具的 MCP 配置文件中添加以下内容，并将路径替换为本机绝对路径：

```json
{
  "mcpServers": {
    "easeim": {
      "command": "node",
      "args": ["/Path/imdev-mcp-server/easeim-mcp-server/dist/index.js"],
      "env": {
        "EASEIM_TRACE_LOG": "true",
        "EASEIM_TRACE_LOG_PATH": "/Path/imdev-mcp-server/easeim-mcp-server/tmp/easeim-mcp-server.log",
        "EASEIM_SMART_ASSIST_LOG": "1",
        "EASEIM_SMART_ASSIST_LOG_PATH": "/Path/imdev-mcp-server/easeim-mcp-server/tmp/smart_assist.log",
        "EASEIM_TOOL_LOG": "1",
        "EASEIM_TOOL_LOG_PATH": "/Path/imdev-mcp-server/easeim-mcp-server/tmp/tool.log"
      }
    }
  }
}
```

配置项说明如下：

- `command`：启动命令。
- `args`：服务入口文件路径。
- `EASEIM_TRACE_LOG` / `EASEIM_TRACE_LOG_PATH`：链路日志开关和路径。
- `EASEIM_TOOL_LOG` / `EASEIM_TOOL_LOG_PATH`：工具日志开关和路径。

## 使用建议

你可以按照以下方式使用环信 MCP Server：

1. 在 AI 编程工具中打开你的项目工程目录。
2. 确认该工具已正确加载环信 MCP Server。
3. 直接以自然语言发起提问，AI 工具会结合环信文档与源码进行回答。

为了获得更准确的回答，建议在提问时尽量补充以下信息：

- 平台类型，例如 iOS、Android、Web、Flutter、React Native。
- 产品类型，例如 SDK、单群聊 UIKit、CallKit、聊天室 UIKit。
- 目标场景，例如集成、登录、消息收发、自定义 UI、问题排查。
- 当前遇到的问题现象或报错信息。

示例问题如下：
   - **SDK 集成** <br/>
     环信 IM iOS SDK 如何集成？
   - **SDK 功能使用**<br/>
     环信 IM Android SDK 如何登录？<br/>
     环信 IM iOS SDK 如何收发消息？<br/>
     环信 IM Web SDK 收不到透传消息，应该如何排查？<br/>
     环信 IM Flutter SDK 如何撤回消息？<br/>
   - **单群聊 UIKit 集成与自定义**<br/>
     环信 IM iOS 单群聊 UIKit 如何集成？<br/>
     环信 IM Android 单群聊 UIKit 如何自定义收发消息的文字大小与颜色？<br/>
     环信 IM React Native 单群聊 UIKit 如何实现完整的自定义消息收发及布局样式？<br/>
   - **CallKit 集成与自定义**<br/>
     环信 IM iOS CallKit 如何集成？<br/>
     环信 IM Android CallKit 如何修改通话背景？<br/>
   - **Demo 源码**<br/>
    环信 IM Flutter Demo 中会话列表页面对应哪部分源码？

## 问题反馈

如遇回答错误，请将 `easeim-mcp-server` 目录下的 `tmp` 文件夹压缩打包，发送至技术支持群，联系技术支持或售后人员。相关人员会将文件转交开发同学进行分析与修复。

## 常见问题

### 1. 工具为何无法识别 MCP Server？

请进行如下检查：

- 配置文件路径是否为绝对路径；
- `dist/index.js` 是否已生成；
- `node` 是否可正常执行；
- AI 工具是否已重启或重新加载配置。

### 2. 日志文件为何没有生成？

请进行如下检查：

- 日志开关是否已开启；
- 日志目录是否存在且可写；
- MCP Server 是否已实际启动。

### 3. 回答为何不完整？

常见原因如下：

- 提问超出当前文档或源码覆盖范围；
- 问题描述过于宽泛；
- 当前平台不支持对应能力。

关于提问方式，详见 [使用建议](#使用建议)。


