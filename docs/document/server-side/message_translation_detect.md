# 检测文本的源语言

## 功能说明

- 检测要翻译的文本的源语言。
- 该接口与 [翻译消息内容](message_translation_text.html) 接口的翻译共享翻译配额。
- 若要使用该接口，你需要 **联系环信商务开通翻译服务**。

**调用频率上限**：100 次/秒/App Key

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。
  
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
| `text`  | String | 是       | 需要检测语言的文本。     |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体的 `data` 中包含以下字段：

| 参数            | 类型   | 描述                 |
| :-------------- | :----- | :------- |
| `language`  | String | 检测出的文本的目标语言。    |
| `score`  | Int | 检测出的语言与实际相符的可能性。 | 
| `isTranslationSupported`  | String | 是否支持翻译该类语言的文本：<br/> - `true`：支持 <br/> - `false`：不支持 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

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

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误提示                  | 可能原因    | 处理建议      |
|:---------|:----------------------|:--------|:----------|
| 400   | An input text is missing or invalid  | 请求中的 `text` 参数未传入或传入的内容无效。    | 请求中的 `text` 参数必传，且需要传入有效字符。      |
| 400   | The input text is too long                  | 请求中的 `text` 参数传入的内容太长。    | 请求中的 `text` 参数最多可传入 10,000 个字符。|
| 400   | The request has reached the maximum limit  | 调用频率超过限制    | 请联系商务提升频率限制或降低调用频率。      |
| 400   | InternalTranslateFailedException                  | Microsoft Azure 翻译服务出错。   |       |
| 503   | service not open                  | 翻译服务未开通。    | 翻译服务为增值服务。调用接口前，请先联系商务开通翻译服务。      |