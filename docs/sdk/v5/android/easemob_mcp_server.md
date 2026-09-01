# EasyIM MCP Server User Guide

## Feature overview

EasyIM MCP Server is based on MCP (Model Context Protocol). It enables AI coding tools that support MCP to query EasyIM-related documentation and search source code. You can use it to assist with integration, feature development, and troubleshooting.

[MCP (Model Context Protocol)](https://modelcontextprotocol.io/) is an open standard introduced by Anthropic to establish secure, unified interactions between AI applications and external data sources and tools. Through MCP, an AI assistant can dynamically access knowledge bases, call APIs, and operate local resources, thereby extending its capabilities.

## Supported scope

The following table shows documentation querying and source-code search support for SDKs:

| Platform | SDK | 
| :----------- | :--- |
| iOS | ✓ |
| Android | ✓ |
| Web | ✓ |

## Supported tools

EasyIM MCP Server supports the following AI coding tools:

- Claude (Desktop/CLI)
- Cursor
- Codex (Desktop/CLI)
- Qoder
- Kiro (IDE/CLI)
- Trae
- Copilot CLI
- VSCode
- AMP

## Installation

Before installation, ensure that the following requirements are met:

- Node.js and npm are installed.
- The AI coding tool supports MCP configuration.

Install EasyIM MCP Server as follows:

1. Clone the code repository:

   ```bash
   git clone https://github.com/easemob/imdev-mcp-server
   ```

2. Enter the project directory and install dependencies:

   ```bash
   cd imdev-mcp-server/easeim-mcp-server
   npm install
   npm run build
   ```

## Configuration

Add the following content to the MCP configuration file of the AI coding tool, replacing the paths with absolute paths on your machine:

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
        "EASEIM_TOOL_LOG_PATH": "/Path/imdev-mcp -server/easeim-mcp-server/tmp/tool.log"
      }
    }
  }
}
```

The configuration options are as follows:

- `command`: Startup command.
- `args`: Path to the service entry file.
- `EASEIM_TRACE_LOG` / `EASEIM_TRACE_LOG_PATH`: Trace log switch and path.
- `EASEIM_TOOL_LOG` / `EASEIM_TOOL_LOG_PATH`: Tool log switch and path.

## Usage recommendations

Use EasyIM MCP Server as follows:

1. Open your project directory in the AI coding tool.
2. Confirm that the tool has correctly loaded EasyIM MCP Server.
3. Ask questions directly in natural language. The AI tool answers using EasyIM documentation and source code.

For more accurate answers, include as much of the following information as possible in your question:

- Platform, such as iOS, Android, Web.
- Target scenario, such as integration, login, message sending and receiving, or troubleshooting.
- The current symptom or error information.

Example questions:
   - **SDK integration** <br/>
     How do I integrate the EasyIM iOS SDK?
   - **Using SDK features**<br/>
     How do I log in with the EasyIM Android SDK?<br/>
     How do I send and receive messages with the EasyIM iOS SDK?<br/>
     The EasyIM Web SDK cannot receive command messages. How should I troubleshoot this?<br/>
     How do I recall a message with the EasyIM Flutter SDK?<br/>

## Feedback

If an answer is incorrect, compress the `tmp` folder in the `easeim-mcp-server` directory and send it to the technical support group. Contact technical support or after-sales staff, who will forward the files to the developers for analysis and correction.

## FAQ

### 1. Why can't the tool recognize MCP Server?

Check the following:

- Whether the configuration file path is absolute.
- Whether `dist/index.js` has been generated.
- Whether `node` can run normally.
- Whether the AI tool has been restarted or reloaded the configuration.

### 2. Why wasn't the log file generated?

Check the following:

- Whether logging is enabled.
- Whether the log directory exists and is writable.
- Whether MCP Server has actually started.

### 3. Why is the answer incomplete?

Common causes include:

- The question is outside the scope of the current documentation or source code.
- The question is too broad.
- The current platform does not support the corresponding capability.

For guidance on asking questions, see [Usage recommendations](#usage-recommendations).
