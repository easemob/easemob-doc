# 集成 SDK

本文介绍如何将环信即时通讯 IM SDK 集成到你的 Windows 项目。

## 开发环境要求

- Windows SDK 1.0.5 或以上；
- Visual Studio IDE 2019 或以上；
- .Net Framework 4.5.2 或以上；
- 目前 Windows SDK 仅支持 64 位运行模式；

## 集成 SDK

1. [下载 Windows SDK](https://www.easemob.com/download/im)。下载的 NuGet 包一般存放在 `C:\Users\XXX\Downloads` (XXX 为本机用户名) 中。
   
2. 将下载的 NuGet 包拷贝到自己的工作目录下，例如 `D:\workspace\WinSDK`，下面的说明以此目录举例。
   
3. 在 Visual Studio 开发环境中，右键点击 **windows-example** 项目，选择 管理 NuGet 程序包 (N)...；

4. 在弹出的 **NuGet:windows-example** 页签中，点击右上角的齿轮图标会弹出 NuGet 程序包源的设置窗体。点击窗体右上角的 **+** 按钮，在包源的文本框内会出现 **Package source** 一栏，点击选中，并修改文本框下的 **名称** 和 **源**。例如 **名称** 可以设置为 **Local Package source**，**源** 则设置为第 2 步中的目录，**D:\workspace\WinSDK**，点击**确定**。

5. 在 **NuGet:windows-example** 页签，在右上角的**程序包源**处点击下拉菜单，选中刚刚配置的包源名称**Local Package source**。

6. 在 **NuGet:windows-example** 页签上部，选中**浏览**，在下面搜索框的右边，勾选 **包括预发行版**，此时下面的区域会出现 **agora_chat_sdk** (如果没有出现，点击搜索框右侧的刷新按钮)，选中这一栏，右边会出现一个向下的小箭头，点击进行安装，或者点击右侧栏最右边的**安装**按钮。
   
7. 在弹出的**预览更改**窗体中，点击**确定**按钮。Windows SDK 的 NuGet 包集成完毕。