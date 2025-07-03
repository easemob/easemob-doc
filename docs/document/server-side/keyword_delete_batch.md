# 批量删除关键词

## 功能说明

批量删除关键词名单中的关键词。

**调用频率上限**：100 次/秒/App Key 

## HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/moderation/text/list/text/list/(list_id)/word/batch
```

### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `list_id`        | String | 是       | 关键词名单 ID。 |

### 请求 body

| 参数     | 类型   | 是否必需 | 描述  |
| :------- | :----- | :------- | :--------------- |
| `wordIds`  | Array    | 是       | 要删除的关键词的 ID。一次最多可删除 100 个关键词。  |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `status` | String | 请求状态。若请求成功，返回 `OK`。 |
| `entity` | Int | 是否删除成功：<br/> - `0`：删除成功 <br/> - `1`：删除失败 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

// TODO：请提供请求示例和响应示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/moderation/text/list/text/list/{list_id}/word/batch' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
     "wordIds": ["t1", "t2"]
    }'
```

### 响应示例

```json
{
  "status": "OK",
  "entity": 0
}
```

## 错误码

// TODO：请添加错误码，例如传入的名单 ID 或关键词 ID 不存在。

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |









关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
