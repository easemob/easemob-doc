# 检测文本的源语言

## 功能说明

- 检测要翻译的文本的源语言。
- 该接口与 [翻译消息内容](message_translation_text.html) 接口的翻译共享翻译配额。

**调用频率上限**：100 次/秒/App Key
  
## HTTP 请求  

```http
POST https://{host}/{org_name}/{app_name}/translate/detect
```

### 路径参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### 请求 body

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `text`  | String | 是       | 需要检测语言的文字。     |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体的 `data` 中包含以下字段：

| 参数            | 类型   | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `language`  | String | 检测出的文本的目标语言。    |
| `score`  | Int | 检测出的语言与实际相符的可能性。 | 
| `isTranslationSupported`  | String | 是否支持翻译该类语言的文本：<br/> - `true`：支持 <br/> - `false`：不支持 |

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -i -X POST "https://XXXX/XXXX/XXXX/translate/detect"   \
-H 'Content-Type: application/json'  \
-H "Authorization: Bearer <YourAppToken>"   \
-d '{
  "text": "你好"
}'
```

### 响应示例

```json
{
  "language": "zh-Hans",
  "score": 0.98,
  "isTranslationSupported": true
}
```