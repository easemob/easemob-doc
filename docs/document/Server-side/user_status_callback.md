# 用户在线状态回调

<Toc />

## 功能描述

开发者可以通过该回调实现实时监控用户在线、离线状态，以及状态变更原因（登入，登出，用户账号被动退出）；如应用中需要实时展示用户在线、离线状态时，可通过此服务来实现。

每个用户的状态类型有以下 2 种：

- 在线状态（Online）：app 用户已连接到 环信即时通讯 IM 服务器。
- 离线状态（Offline）：app 用户已与环信即时通讯 IM 服务器断开连接。

状态变更原因包含以下3种：

- 登入（login）：app 用户与环信即时通讯 IM 服务器建立连接。
- 登出（logout）：app 用户退出登录导致与环信即时通讯 IM 服务器的连接断开。
- 踢用户（replaced）：可能是用户账号被开发者从服务端强制下线，或者 app 用户在达到最大登录设备数时继续登录其他设备，则其中一端设备会被踢出，导致与环信即时通讯 IM 服务器的连接断开。对于 iOS，Android 和 Web 端，同一用户 ID 每端最多可登录 4 个设备。

## 前提条件

- 该服务为增值服务，需要开通相应版本后才能使用，具体见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)；
- 服务开通后，若用户状态变更（在线、离线），环信即时通讯 IM 服务器会实时将状态同步到开发者设置的应用服务器地址，开发者接收到状态后自行进行业务处理。
- 某些情况下，例如进入隧道等特殊网络情况，依赖心跳超时，用户进入离线状态最长会有 5 分钟延时。

## 实现方法

直接在发送后回调添加规则页配置，具体见 [环信即时通讯云控制台](https://console.easemob.com/user/login)。

## 应答要求

同步在线状态时需要接收服务提供应答，只要有 HTTP 应答码 200 ，环信即时通讯 IM 服务器认为状态已经同步；如果应答超时 60 秒，会尝试第 2 次推送，如果仍然失败，环信即时通讯 IM 服务器将不再同步此条状态，同时记录 1 次推送失败。若短时间内有大面积超时，将暂停推送。

## 请求体参数描述

该回调类型为用户在 环信即时通讯 IM 服务器在离线（online/offline）状态变更事件，其中包含变更原因登入，登出，踢用户。 对应 login，logout，replaced。

| 参数       | 参数类型 | 描述                                                         |
| :--------- | ------------ | :----------------------------------------------------------- |
| `callId`   | String       | callId 为 {appkey}_{uuid} ，其中 uuid 为 随机生成，作为每条回调的唯一标识。 |
| `security` | String       | 签名。格式如下: MD5（callId+密钥+timestamp）。               |
| `host`     | String       | 环信即时通讯 IM 服务器名称，无需关注。                            |
| `timestamp` | Long  | 环信即时通讯 IM 接收到此消息的 Unix 时间戳，单位为 ms。 |
| `appkey`   | String       | 应用的唯一标识。                                             |
| `user`     | String       | 环信即时通讯 IM 用户名和设备 resource。                           |
| `reason`   | String       | 用户状态变更原因（login/logout/replaced）。                  |
| `os`       | String       | 设备类型（android/ios/webim）。                              |
| `ip`       | String       | IP 地址和端口号。                                            |
| `version`  | String       | 客户端 sdk 版本号。                                          |
| `status`   | String       | 用户当前状态（online/offline）。                             |

#### 请求示例

```shell
{
    "callId": "easemob-demo#test_0770a64f-cf01-4c41-8786-df3b48b20e7e",
    "security": "2ca02c394bef9e7abc83958bcc3156d3",
    "host": "msync@hsb",
    "timestamp": 1600060847294,
    "appkey": "easemob-demo#test",
    "user": "easemob-demo#test_hxtest@easemob.com/android_b069b852-79a3-3c9e-9d08-ee5176b95df5",
    "reason": "login",
    "os": "android", 
    "ip": "211.157.146.18:48098",     
    "version": "3.7.1",
    "status": "online" 
}
```
