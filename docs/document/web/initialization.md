# 初始化

初始化是使用 SDK 的必要步骤,需在所有接口方法调用前完成。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见 [环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

初始化时通过传入 `appKey` 来获取 SDK 实例。

```javascript
import ChatSDK from "easemob-websdk";
const conn = new ChatSDK.connection({
  appKey: "Your appKey",
});
```

下表明确初始化 SDK 时的一些参数。全部参数详见 [API 参考](https://doc.easemob.com/apidoc/web/modules/Connection.html#ConnectionParameters)。

| 属性       | 类型 | 是否必需   | 描述            |
| :----------------- | :---------------- | :------ | :-------- |
| `appKey`    | String         | 是                   | `appkey` 为创建 app 时在环信控制台上注册的 app 唯一识别符。 |
| `delivery`       | Boolean | 否   | 是否开启已送达回执。<br/> - `true`：开启。<br/> -（默认）`false`：关闭。           |
| `isFixedDeviceId`       | Boolean | 否   | 是否使用固定的设备标识（`deviceId`）。<br/> -（默认）`true`：SDK 对设备生成一个设备标识并存入本地存储，即对一个浏览器来说，所有 SDK 实例的连接都被认为是同一设备。 <br/> - `false`：每一个 SDK 实例连接时，使用随机字符串作为设备标识，即每个实例采用的不同的设备连接。该参数会影响多端登录互踢的策略，详见 [多设备登录文档](multi_device.html)。   |

## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```javascript
conn.addEventHandler("connectionListener", {
  // SDK 成功连接到 IM 服务器时触发。
  onConnected: () => {
    console.log("连接成功");
  },
  // SDK 与 IM 服务器断开连接时触发。
  // 自 4.8.0 版本，`onDisconnected` 事件新增断开原因回调参数, 告知用户触发 `onDisconnected` 的原因。
  onDisconnected: () => {
    console.log("连接断开");
  },
  // SDK 与 IM 服务器正在连接时触发。
  onReconnecting: () => {
    console.log("重连中");
  },
});
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onTextMessage: function (message) {},
}); 
```


