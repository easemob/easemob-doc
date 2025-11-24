# 绑定和解绑推送信息

## 功能说明

推送消息时，设备与推送信息会进行绑定，包括设备 ID、推送证书和 device token。

- 设备 ID：SDK 为每个设备分配的唯一标识符。

- device token：第三方推送服务提供的推送 token，该 token 用于标识每台设备上的每个应用，第三方推送服务通过该 token 明确消息是发送给哪个设备的，然后将消息转发给设备，设备再通知应用程序。例如，对于 FCM 推送，device token 指初次启动你的应用时 FCM SDK 为客户端应用实例生成的注册令牌 (registration token)。

- 推送证书：推送证书由第三方推送服务提供，一个 app 对应一个推送证书。

用户从第三方推送服务器获取 device token 和证书名称，然后向环信即时通讯服务器上传，服务器根据 device token 向用户推送消息。

你可以调用该接口对设备与推送信息进行绑定或解绑。

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```
PUT https://{host}/{org_name}/{app_name}/users/{userId}/push/binding
```

| 参数       | 类型   | 描述   | 是否必需 | 
| :--------- | :----- | :------- | :------------------ |
| `userId` | String | 要绑定或解绑哪个用户的设备与推送信息。    | 是       | 

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

**绑定请求**

```shell
curl -X PUT 'https://XXXX/XXXX/XXXX/users/XXXX/push/binding' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{    
    "device_id": "8ce08cad-XXXX-XXXX-86c8-695a0d247cda",    
    "device_token": "XXXX",    
    "notifier_name": "104410638"
}'
```

**解除绑定**

```shell
curl -X PUT 'https://XXXX/XXXX/XXXX/users/XXXX/push/binding' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{    
    "device_id": "8ce08cad-XXXX-XXXX-86c8-695a0d247cda",    
    "device_token": "",    
    "notifier_name": "104410638"
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `device_id`     | String | 移动端设备标识，服务端用于识别设备，进行推送信息的绑定和解绑。 | 是       |
| `notifier_name` | String | 推送证书名称。<br/> - 传入的证书名称必需与你在环信控制台的**添加推送证书**页面上填写的证书名称一致，否则推送失败。<br/> - 若 `notifier_name` 为空，表示解除当前设备与所有推送信息的绑定。 | 是       |
| `device_token`  | String | 推送设备 token。错误的信息会推送失败，且服务端自动解除绑定。若 `device_token` 为空，则会解除当前用户当前设备 ID 和当前证书名的绑定。 | 是       |

## 响应示例

**绑定响应**

```json
{ 
  "timestamp": 1688030642443, 
  "entities": [ 
    {            
      "device_id": "8ce08cad-9369-XXXX-XXXX-695a0d247cda",
      "device_token": "BAEAAAAAB.jkuDmf8hRUPDgOel-zX9exVlcjS1akCWQIUA3cBbB_DprnHMeFR11PV1of1sVNKPmKdKhMB22YuO8-Z_Ksoqxo8Y",
      "notifier_name": "104410638"       
    }   
  ],    
  "action": "put",   
  "duration": 28
}
```

**解除绑定响应**

```json
{    
  "timestamp": 1688030767345,    
  "entities": [],    
  "action": "put",    
  "duration": 24
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数        | 类型   | 描述                                                         |
| :---------- | :----- | :----------------------------------------------------------- |
| `entities`  | Array  | 当前设备绑定的推送信息列表。如果发送该绑定请求后该设备无任何推送绑定信息，则返回空列表。 |
| - `device_id`     | String | 移动端设备标识，服务端用于识别设备，进行推送信息的绑定和解绑。 |
| - `notifier_name` | String | 推送证书名称。 | 
| - `device_token`  | String | 推送设备 token。|
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `action`          | String | 请求方法。                                                                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [常见错误码](push_error.html) 了解可能的原因。