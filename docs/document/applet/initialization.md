# SDK 初始化

初始化是使用 SDK 的必要步骤,需在所有接口方法调用前完成。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信控制台的相关文档](/product/console/app_create.html)。

## SDK 初始化

使用 SDK 前需要进行初始化，示例代码如下：

```javascript
const conn = new WebIM.connection({
  appKey: "your appKey",
  url: "wss://im-api-wechat.easemob.com/websocket",
  apiUrl: "https://a1.easemob.com",
  isHttpDNS: false, // 在小程序上需设置为false
});
```

初始化 SDK 参数说明：

| 参数       | 类型   | 是否必需 | 描述                               |
| :--------- | :----- | :------- | :--------------------------------- |
| `appKey`    | String     | 是      | 环信控制台为你的应用生成的唯一标识，由应用名称（`Appname`）和组织名称（`Orgname`）组成。                  |
| `isHttpDNS`  | Bool  | 否 | 是否开启 DNS，防止 DNS 劫持。<br/> -（默认）`true`：开启 DNS；<br/> - `false`：关闭 DNS。        |
| `delivery`         | Bool  | 否    | 是否开启送达回执：<br/> - `true`：开启；<br/> -（默认）`false`：关闭。      |
| `deviceId`           | String  | 否  | 设备 ID，为默认随机值。               |
| `useOwnUploadFun`   | Bool  | 否   | 是否支持通过自己的路径将图片、文件上传到自己的服务器。<br/> -`true`：支持，需要指定路径；<br/> -（默认）`false`：关闭，通过消息服务器上传下载文件。 |
| `autoReconnectNumMax` | Int  | 否 | 最大重连次数。      |
| `apiUrl`              | String | 是       | 指定的 REST 服务器。在未开启 DNS 的情况下使用，一般适用于开发者要实现数据隔离、特别注重数据安全的场景。要获取该服务器地址，需在环信控制台的 **应用概览**页面的 **开发配置信息** 区域看域名配置。|
| `url`                 | String | 是       | 指定的消息服务器。在未开启 DNS 的情况下使用，一般适用于开发者要实现数据隔离、特别注重数据安全的场景。要获取该服务器地址，需在环信控制台的 **应用概览**页面的 **开发配置信息** 区域看域名配置。  |

