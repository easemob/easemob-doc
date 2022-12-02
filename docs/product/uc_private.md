# 私有化即时通讯

<Toc />

环信即时通讯私有化服务是基于 IM 核心技术实现的可私有化部署解决方案。本方案可适配内网物理服务器集群、公有云以及私有云等任意部署环境，提供功能完备、安全可靠、易于扩展的即时通讯平台。整体通讯平台架构主要由三部分组成，分别为客户端、服务端、Web 控制台。

 - **客户端**：采用 SDK 形式，对核心通信模块进行封装，提供场景功能接口，覆盖多种平台（包括：Android、iOS、Web、小程序、 Windows/Mac OS、Linux），支持快速集成终端用户应用。
 - **服务端**：采用 Java 和 Erlang 语言编写，可支持用户高并发连接和系统动态调配，高效处理用户长连接相关的服务和用户管理、推送等无状态服务。同时提供服务端REST API 和 Java Server SDK 接口，便于完成即时通讯软件中服务的控制、数据的转发存储工作。
 - **Web 控制台**：是基于 B/S 模式的可视化操作平台，可支持开通与配置应用功能，查询各类 IM 服务情况，管理与维护用户体系（增、删、改、查），满足系统管理员、开发者等多种业务角色使用需求，提升业务集成与运营管理效率。

## 私有化服务优势

### 部署多样化

环信即时通讯系统支持 Linux 裸系统、容器化等多种部署方式。不仅可以提供更灵活、更便捷、更稳定的平台性能，同时容器化部署可实现自动部署，具备服务自动发现、服务自动负载均衡等特点。

### 高可用

环信即时通讯系统具备高可用特性，当系统内某一个节点或主机出现宕机后，该故障节点上的所有服务会自动转移到其他节点上而不会引发服务中断，保障系统可用性。

### 易扩展

环信即时通讯系统服务架构支持弹性扩展，系统内所有资源可在各节点之间实现灵活调度，当 CPU、内存等计算资源利用率较高时，可通过横向添加 node 实现平滑扩容。
### 安全性

环信即时通讯系统实现通讯全流程安全加密，支持客户端敏感信息加密存储、服务器密钥权限管理、消息传输过程私有协议加密以及用户信息隐私保护等措施。

### 国产化

环信即时通讯系统严格遵循国家法律法规和技术标准规范，积极响应国内自主可控、安全可控要求，从IT基础设置、操作系统、数据库等方面进行国产化升级，满足信创环境部署要求。

## 私有化 SDK 下载

环信客户端及服务端SDK已对IM核心服务完成封装，通过调用SDK API接口，即可快速获得消息收发、会话管理、群组、好友、聊天室等功能，目前客户端 SDK 已覆盖 Windows、Linux、MacOS、Android、iOS、Web、小程序等多种平台，服务器端 SDK 已覆盖 Java、PHP 等平台，各端 SDK 下载及开发指南如下所示。

|SDK|版本号 |下载地址|开发指南|
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
|Android|[3.9.1](http://docs-im-beta.easemob.com/document/android/releasenote.html#%E7%89%88%E6%9C%AC-v3-9-1-2022-4-19)|[下载 SDK](https://downloadsdk.easemob.com/downloads/easemob-sdk-3.9.1.zip)    [下载 Demo](https://downloadsdk.easemob.com/downloads/imsdkdemo_android-3.9.1.apk) | [查看](http://docs-im-beta.easemob.com/document/android/privatecloud.html) |
|Web|[4.0.4](http://docs-im-beta.easemob.com/document/web/releasenote.html#%E7%89%88%E6%9C%AC-v4-0-4-2022-4-19)|[下载 SDK](https://github.com/easemob/websdk/releases/tag/v4.0.4)   [下载 Demo](https://zq-im-management-hsb.easemob.com) | [查看](http://docs-im-beta.easemob.com/document/web/privatecloud.html) |
|iOS|[3.9.1](http://docs-im-beta.easemob.com/document/ios/releasenote.html#%E7%89%88%E6%9C%AC-v3-9-1-2022-4-19)|[下载 SDK](https://downloadsdk.easemob.com/downloads/iOS_IM_SDK_V3.9.1.zip)    [下载 Demo](https://www.pgyer.com/2XKY) | [查看](http://docs-im-beta.easemob.com/document/ios/privatecloud.html) |
|Windows（C++）|3.9.1|[下载 SDK 及 Demo](https://gitee.com/liyuzhao/im-cpp-demo)  | [查看](https://gitee.com/liyuzhao/im-cpp-demo) |
|Windows（C#）|[1.0.2](http://docs-im-beta.easemob.com/document/windows/releasenote.html#%E7%89%88%E6%9C%AC-v1-0-2-1-2022-06-22)|[下载 SDK](https://downloadsdk.easemob.com/downloads/SDK/WinSDK/agora_chat_sdk.1.0.2-beta.nupkg) | [查看](http://docs-im-beta.easemob.com/document/windows/quickstart.html) |
|Linux|[3.1.0](https://docs-im.easemob.com/im/linux/releasenote)|[下载 SDK](https://downloadsdk.easemob.com/downloads/linux_IM_SDK_V3.1.0_r1.zip) | [查看](https://docs-im.easemob.com/im/linux/integration) |
|Electron|[3.8.4](https://docs-im.easemob.com/im/pc/log/releasenote#%E7%89%88%E6%9C%AC_v384_2021-12-09)|[下载 SDK](https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/Desktop_IM_SDK_3.8.4.zip) | [查看](https://docs-im.easemob.com/im/pc/intro/integration) |
|uni-app|[4.0.4](https://docs-im.easemob.com/im/applet/releasenote#%E7%89%88%E6%9C%AC_v404_dev_2022-4-19)|[下载 SDK 及 Demo](https://github.com/easemob/webim-uniapp-demo/releases/tag/4.0.4) | [查看](https://docs-im.easemob.com/im/applet/uniapp) |
|小程序|[4.0.4](https://docs-im.easemob.com/im/applet/releasenote#%E7%89%88%E6%9C%AC_v404_dev_2022-4-19)|[下载 SDK 及 Demo](https://github.com/easemob/webim-uniapp-demo/releases/tag/4.0.4) | [查看](https://docs-im.easemob.com/im/applet/wechat) |
|Unity|3.9.0|[下载 SDK](https://downloadsdk.easemob.com/downloads/SDK/Unity/im_unity_sdk_3_9_0.unitypackage) |  |
|Flutter|[3.9.0+2](https://pub.flutter-io.cn/packages/im_flutter_sdk/changelog#3902)|[下载 SDK](https://pub.flutter-io.cn/packages/im_flutter_sdk/versions/3.9.0+2) | [查看](http://docs-im-beta.easemob.com/document/flutter/quickstart.html) |
|Java|[0.6.3](https://docs-im.easemob.com/im/server/ready/releasenote)|[下载 SDK](https://github.com/easemob/easemob-im-server-sdk) | [查看](http://docs-im-beta.easemob.com/document/server-side/java_server_sdk.html) |
| PHP|0.1.0|[下载 SDK](https://github.com/easemob/im-php-server-sdk) | [查看](http://docs-im-beta.easemob.com/document/server-side/php_server_sdk.html) |

