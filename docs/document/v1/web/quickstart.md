# Web SDK 快速集成

## 搭建本地测试环境

1. 搭建环境之前需要对环信提供的参考文档有个初步的了解，主要为以下形式，请根据下面的关键字选择源码参考

- 基于 react 开发的完整的实时 Demo ，关键字：**至少 IE9** ，**完整流程**，**webpack+react**
- 首先将源码下载到本地，[下载SDK及Demo](https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/downloads/webdemo-3.4.2.7.zip)


2. 去官网安装[NodeJS](https://nodejs.org/zh-cn/)，建议4+

- 因为整套代码需要依赖于[npm](https://www.npmjs.com/) NodeJS 的包管理工具，安装 NodeJS 会默认安装 NPM 工具
- 定位到 webim/demo 目录 在终端执行下面的命令，安装测试所需要的依赖模块

- 保证此过程没有 error 终止为成功，如果有错误中断，请保留错误日志并再次尝试，大多数情况是网络原因导致的无法连接而中断

```
npm i
```

3. 上述步骤成功后

```
# 启动测试环境
npm start （如果需要https 通过HTTPS=true npm start启动）
# 打包发布，发布后文件在 webim/demo/build 目录下
npm run build
```

4. 浏览器访问即可看到测试页面：

- http：http://localhost:3000/

- https：https://localhost:3001/

## 集成

可以通过以下方式引用 Web SDK:

- 将文件复制到本地，引用本地文件


### 引用本地文件

1. 下载demo后，将sdk目录下的 webimSDK.js（现SDK包命名为websdk+版本号的形式，例如：websdk3.4.2.js）、EMedia_x1v1.js、EMedia_sdk-dev.js，按照实际项目需求选择对应的SDK拷贝到系统相应的目录下。
:::tip
websdk：提供全功能即时通讯SDK接口，Emedia:提供音视频功能相关SDK接口。如需音视频功能，EMedia_x1v1.js与EMedia_sdk-dev.js只引用EMedia_x1v1.js即可。
:::

2. 新版本中 WebIMConfig 文件只做参数定义方便实例化 SDK 时使用，仅与自己项目结构有关。详细使用可以查看 /demo/src/config/WebIM.js文件

3. 新建 html 文件并引入相关 js 脚本。

```
<script type='text/javascript' src='WebIMConfig.js'></script>
<script type='text/javascript' src='webimSDK.js'></script>
```

:::tip
Web SDK 向下兼容V1.1.2和V1.1.1。关于详细的引用文件和配置参数（WebIMConfig）的方法，请查看本页“兼容性”的内容。
:::
初始化 WebIM.connection 和 构造消息 WebIM.message， 需要在中间加上 default，如：WebIM.default.message。

## 配置

3.0 SDK，在 WebIMConfig.js 文件内进行以下配置：

```
socketServer: 'https://xxx.xxxxx.com',    // socket Server地址

restServer: 'https://xxx.xxxxx.com',               // rest Server地址

appkey: 'easemob-demo#chatdemoui',        // App key

https : false,                            // 是否使用https

isHttpDNS: true,                          // 3.0 SDK支持，防止DNS劫持从服务端获取XMPPUrl、restUrl

isMultiLoginSessions: false,              // 是否开启多页面同步收消息，注意，需要先联系商务开通此功能

isDebug: false,                           // 打开调试，会自动打印log，在控制台的console中查看log

autoReconnectNumMax: 2,                   // 断线重连最大次数

heartBeatWait: 30000,                     // 心跳间隔（只在小程序中使用）

delivery: false,                           // 是否发送已读回执

useOwnUploadFun: false,         // 是否使用自己的上传方式（如将图片文件等上传到自己的服务器，构建消息时只传url）

deviceId: 'webim'               // 设备ID，默认可不传，如果传一个固定值，在没开启多端登录的情况下同一个账号会互踢

注意：
socketServer与restServer取值见 私有部署文档中的 2.2开通防火墙白名单 配置各服务“地址:端口”。
```

