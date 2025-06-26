# 获取翻译语言列表

## 功能说明

- 该接口获取翻译语言列表。
- 翻译功能由 Microsoft Azure Translation API 提供，因此开始前请确保你了解该功能支持的目标语言。详见 [翻译语言支持](https://learn.microsoft.com/zh-cn/azure/ai-services/translator/language-support)。
- 若要使用这些接口，你需要联系环信商务开通翻译服务。

**调用频率上限**：100 次/秒/App Key

## HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/translate/support/language
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
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数            | 类型   | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `code`  | String | 语言代码。    |
| `name`  | String | 语言名称。 |
| `nativeName`  | String | 语言在其起源地的名称，例如，英语在英国称为 `English`。| 

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 示例 

### 请求示例 

```shell
curl -i -X POST "https://XXXX/XXXX/XXXX/translate/support/language"  \
-H "Authorization: Bearer <YourAppToken>" 
```

### 响应示例

以下分别是英语、希腊语和马尔代夫语的示例：

```json
  [
    {
      "code": "en",
      "name": "English",
      "nativeName": "English"
    },
    {
      "code": "el",
      "name": "Greek",
      "nativeName": "Ελληνικά"
    },
    {
      "code": "dv",
      "name": "Divehi",
      "nativeName": "ދިވެހިބަސް"
    }
  ]
```