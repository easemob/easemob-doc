# 查询离线推送结果统计数据

要查询离线推送结果，你需要联系环信商务开通该功能。该功能开通后，环信离线推送服务会产生推送结果消息。

## 离线推送结果查询方式

你可以通过以下方式查询离线推送的结果：

- 在[环信即时通讯控制台](https://console.easemob.com/user/login)上查看 IM 消息投递查询：
  - 在 **应用列表** 中点击目标应用的 **操作** 栏中的 **管理** 按钮，进入 **应用详情** 页面。
  - 选择 **即时通讯 > 实时查询 > IM消息投递查询**，查看推送结果记录，如下图所示：

![img](/images/server-side/message_delivery_query.png)

- 推送结果回调：[创建发送后回调规则](/product/enable_and_configure_IM.html#配置回调规则)，对于**回调类型**参数选择**离线推送事件**，然后选择**推送成功**、**推送失败**或**推送异常**，即可接收到推送结果消息回调内容。关于离线推送事件，详见[发送后回调事件](/document/server-side/callback_login_logout.html)。

![img](/images/server-side/post_callback_push.png)

- 调用 RESTful API 查询离线推送结果统计。

## 调用 RESTful API 查询离线推送结果统计数据

**接口调用频率上限**：10 次/10 秒/App Key

### HTTP 请求

```shell
GET https://{host}/{org_name}/{app_name}/push/data/offline-push/begin/{startTime}/end/{endTime}
```

#### 路径参数

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :------------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `startTime` | String |  是       | 查询数据的开始时间，格式为 yyyy-MM-dd，例如，`2024-04-01`。 |
| `endTime`   | String |  是       | 查询数据的结束时间，格式为 yyyy-MM-dd，例如，`2024-04-02`。 |

#### 查询参数

| 参数       | 类型 | 描述                                                         | 是否必需 |
| :--------- | :--- | :----------------------------------------------------------- | :------- |
| `platform` | enum | 查询的平台，取值如下：<br/> - （默认）`ALL`：查询所有推送平台的推送统计结果。<br/> - `APNS`：APNs 推送；<br/> - `ANDROID`：FCM 推送；<br/> - `XIAOMIPUSH`：小米推送；<br/> - `HUAWEIPUSH`：华为推送<br/> - `MEIZUPUSH`：魅族推送；<br/> - `OPPOPUSH`：OPPO 推送；<br/> - `VIVOPUSH`：vivo 推送；<br/> - `HONOR`：荣耀推送。| 是       |

#### 请求 header

| 参数            | 类型   | 描述        | 是否必需 |
| :-------------- | :----- | :------------------- | :------- |
| `Authorization` | String | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数        | 类型   | 描述                                                         |
| :---------- | :----- | :----------------------------------------------------------- |
| `status`  | String | 请求状态。若请求成功，返回 `OK`。 |
| `data`  | JSON | 离线推送结果。 |
| `data.successCount`  | Int | 成功发送的离线推送通知数量。 |
| `data.failCount`  | Int | 发送失败的离线推送通知数量。 |
| `data.arriveCount`  | Int | 送达到接收方的离线推送通知的数量。 |

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -g -X GET 'https://XXXX/XXXX/XXXX/push/data/offline-push/begin/2024-04-01/end/2024-04-02?platform=ALL' \
-H 'Authorization: Bearer <YourAppToken>
```

#### 响应示例

```json
{
    "status": "OK",
    "data": {
        "2024-04-02": {
            "HONOR": {
                "successCount": 7218,
                "failCount": 239
            },
            "HUAWEIPUSH": {
                "successCount": 48852,
                "failCount": 1969
            },
            "OPPOPUSH": {
                "successCount": 66226,
                "failCount": 3774
            },
            "VIVOPUSH": {
                "successCount": 42380,
                "failCount": 2189,
                "arriveCount": 40559
            },
            "XIAOMIPUSH": {
                "successCount": 23071
            }
        },
        "2024-04-01": {
            "HONOR": {
                "successCount": 8306,
                "failCount": 1208
            },
            "HUAWEIPUSH": {
                "successCount": 55933,
                "failCount": 1335
            },
            "OPPOPUSH": {
                "successCount": 76026,
                "failCount": 4534
            },
            "VIVOPUSH": {
                "successCount": 52091,
                "failCount": 3042,
                "arriveCount": 49623
            },
            "XIAOMIPUSH": {
                "successCount": 26364
            }
        }
    }
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型         | 错误提示       | 可能原因            | 处理建议             |
| :---------- | :--------------- | :------------------ | :-------------- | :--------------- |
| 403         | forbidden_op     |        | 查询离线推送结果统计的功能未开通。                               | 联系环信商务开通该功能。                                     |
| 401         | unauthorized     | Unable to authenticate (OAuth)                               | token 不合法，可能过期或 token 错误。                        | 使用新的 token 访问。                                        |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。