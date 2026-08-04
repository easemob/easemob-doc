# 查询推送绑定信息

## 功能说明

查询当前用户的所有设备的推送绑定信息。

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```
GET https://{host}/{org_name}/{app_name}/users/{userId}/push/binding
```

| 参数     | 类型   | 描述                           | 是否必需 |
| :------- | :----- | :----------------------------- | :------- |
| `userId` | String | 要查询哪个用户的推送绑定信息。 | 是       |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/users/XXXX/push/binding' \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{    
  "timestamp": 1688031327535,   
  "entities": [       
    {            
      "device_id": "8ce08cad-9369-XXXX-XXXX-695a0d247cda",      
      "device_token": "BAEAAAAAB.jkuDmf8hRUPDgOel-XXXX_XXXX_Ksoqxo8Y",  
      "notifier_name": "104410638"      
    }   
    {            
      "device_id": "8ce08cad-9369-XXXX-XXXX-695a0d247cda",      
      "device_token": "BAEAAAAAB.jkuDmf8hRUPDgOel-XXXX_XXXX_Ksoqxo8Y",  
      "notifier_name": "104410638"      
    }  
  ],    
  "action": "get",    
  "duration": 6
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数       | 类型  | 描述                                                         |
| :--------- | :---- | :----------------------------------------------------------- |
| `entities` | Array | 当前用户的所有设备的推送绑定信息列表。若当前用户的任何设备均无推送绑定信息，则返回空列表。 |
| - `device_id`     | String | 移动端设备标识，服务端用于识别设备，进行推送信息的绑定和解绑。 |
| - `notifier_name` | String | 推送证书名称。 | 
| - `device_token`  | String | 推送设备 token。|
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `action`          | String | 请求方法。                                                                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [常见错误码](push_error.html) 了解可能的原因。