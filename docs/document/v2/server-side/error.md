# 常见错误代码

<Toc />

本文介绍 REST 接口调用后的返回结果响应码。可根据返回数据中的 error 字段判断具体错误。

- 响应码：200（成功）
- 响应码：4xx（请求错误）。这些状态代码表示请求可能出错，妨碍了服务器的处理。
- 响应码：5xx（服务器错误）。这些状态代码表示服务器在尝试处理请求时发生内部错误。

#### 返回示例

![REST API返回错误示例](@static/images/server-side/response_icon.jpeg)

建议对 App 自己的服务器端调用的 REST API 结果做容错处理，比如：

- catch 接口调用返回的异常 timeout 可以尝试重新调用。
- 对于系统级别错误或重试后仍旧出错，应该记录到系统日志，并及时报警提示运维人员做补救措施，如人工补发。

## 索引 错误状态码

| HTTP 返回码（Status Code）<div style="width: 220px;"></div> | 说明（Description）                                          |
| :------------------------- | :----------------------------------------------------------- |
| 400                        | （错误请求）服务器不理解请求的语法。                         |
| 401                        | （未授权）请求要求身份验证。对于需要 token 的接口，服务器可能返回此响应。 |
| 403                        | （禁止）服务器拒绝请求。对于群组/聊天室服务，表示本次调用不符合群组/聊天室操作的正确逻辑，例如调用添加成员接口，添加已经在群组里的用户，或者移除聊天室中不存在的成员等操作。 |
| 404                        | （未找到）服务器找不到请求的接口。                           |
| 405                        | （请求方式错误）请按照环信官网接口说明，正确的使用接口 GET，POST 等请求方式。 |
| 408                        | （请求超时）服务器等候请求时发生超时。                       |
| 413                        | （请求体过大）请求体超过了 5 KB，拆成更小的请求体重试即可。  |
| 415                        | 请求体的类型不支持。                                         |
| 429                        | （服务不可用）请求接口超过调用频率限制，即接口被限流。或超过社区版限制，如有需要可联系商务。 |
| 500                        | （服务器内部错误）服务器遇到错误，无法完成请求。             |
| 501                        | （尚未实施）服务器不具备完成请求的功能。例如，服务器无法识别请求方法时可能会返回此代码。 |
| 502                        | （错误网关）服务器作为网关或代理，从上游服务器收到无效响应。 |
| 503                        | （服务器超时）Service Unavailable。                          |
| 504                        | （网关超时）服务器作为网关或代理，但是没有及时从上游服务器收到请求。 |

## 索引 错误结果说明

| HTTP Status Code | Error                              | Error Description                                            | 可能原因                                                     |
| :--------------- | :--------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 400              | invalid_grant                      | invalid username or password                                 | 用户名或者密码输入错误。                                     |
| 400              | invalid_grant                      | “client_id does not match”                                   | <br/>- “client_id does not match”：传入的 client_id 不正确；<br/>- “client_secret does not match”：传入的 client_secret 不正确。<br/>client_id 以及 client_secret 在环信管理后台的**应用详情**页面中查看。 |
| 400              | json_parse                         | “Unexpected character (‘=’ (code 61)): was expecting a colon to separate field name and value\n at [Source: java.io.BufferedInputStream@170e3f35; line: 1, column: 23]” | 发送请求时请求体不符合标准的 JSON 格式，服务器无法正确解析。 |
| 400              | illegal_argument                   | “Entity user requires a property named username”             | 注册用户请求未提供用户 ID（`username`）。                         |
| 400              | illegal_argument                   | “password or pin must provided”                              | 注册用户请求未提供用户密码（`password`）或提供的密码为空。 |
| 400              | illegal_argument                   | “newpassword is required”                                    | 修改用户密码的请求体未提供 `newpassword` 属性。   |
| 400              | illegal_argument                   | “oldPassword is required”                                    | 修改用户密码的请求体未提供 `oldPassword` 属性。 |
| 400              | illegal_argument                   | “group member username1 doesn’t exist”                       | 批量添加群组成员时，`username1` 不存在。         |
| 400              | illegal_argument                   | “this is an invalid request.”                                | 请求无效，请检查调用接口的 url、header、body，是否符合所调用接口的要求，可以使用 curl 命令进行测试。 |
| 400              | illegal_argument                   | “from can't be empty”                                        | 消息发送方（`from`）为空。若不传该字段， 服务器会默认设置为 `admin`。 |
| 400              | illegal_argument                   | “target_type can only be 'users' or 'chatgroups' or 'chatrooms'” | 发送消息时，对象类型（`target_type`）只能传入 `users`、`chatgroups` 或 `chatrooms`。若传入其他值，提示该错误。 |
| 400              | illegal_argument                   | “username is not legal”                                      | 注册用户时传入的 username 不合法，详见 [用户体系集成](account_system.html#注册用户) |
| 400              | illegal_argument                   | “This chatmessage request is not supported”                  | 查询历史消息时传入的时间格式不正确，正确的格式为 YYYYMMDDHH。例如，要获取 2018 年 02 月 09 日 12 点到 13 点的历史消息，传入的时间为 `2018020912`。 |
| 400              | illegal_argument                   | “illegal arguments: appkey: easemob-demo#chatdemoui, time: 2018020918, maybe chat message history is expired or unstored” | 查询的历史消息未生成或已过期。消息的保留时间取决于初始设置。 |
| 400              | invalid_parameter                  | “some of [groupid] are not valid fields”                     | 修改的群组信息时，传入的参数不支持，例如修改 `groupid`。修改群信息目前只支持修改“群名称”、“群描述” 和 “群最大人数”。 |
| 400              | required_property_not_found        | “Entity user requires a property named username”             | 修改用户密码请求未提供用户 ID（`username`）。    |
| 400              | duplicate_unique_property_exists   | “Application null Entity user requires that property named username be unique, value of hxtest1 exists” | 注册用户时，用户 ID 已存在，请更换用户 ID 重新注册。 注：如果是批量注册，若一次调用返回一个 ID 已存在，则此次调用注册的其他不存在的 ID 不会注册，需将已存在的 ID 从数组中移除重新调用注册。 |
| 400              | illegal_argument | “message is too large”     | 发送消息时消息体超过了 40 KB 会导致该错误，需要拆成几个更小的请求体重试。     |
| 400              |              | “set presence failed”     | 在线状态设置失败。               |
| 400              |     | “ext is too big”                                             | 在线状态扩展信息长度超过限制               |
| 400              |         | “resource not exist”                                         | 设备来源不存在。                                             |
| 400              |      | “you can't sub yourself”        | 无法订阅自己的在线状态。          |
| 400              |                                    | “too many sub presence”                                      | 订阅用户数量超过上限。                                       |
| 400              |                                    | “too many get presences”                                     | 获取在线状态的用户数量超过上限。                             |
| 400              |                                    | “too many unsub presences”                                   | 取消订阅的用户数量超过上限。                                 |
| 400              |                                    | “too many queries”         | 查询次数超过限制。                                           |
| 401              | unauthorized                       | “registration is not open, please contact the app admin”     | 授权注册模式下，调用[注册单个用户](account_system.html#授权注册单个用户)和[批量注册用户](account_system.html#批量注册用户)的 RESTful 接口时，未传入 App Token 或传入了错误的 App Token 时提示该错误，例如 Token 已过期或格式不正确。 |
| 401              | unauthorized                       | “Unable to authenticate due to expired access token”         | 调用 RESTful 接口发送请求时使用的 App Token 过期或未传入 App Token。<br/>该错误码针对除[注册单个用户](account_system.html#授权注册单个用户)和[批量注册用户](account_system.html#批量注册用户)之外的 RESTful 接口有效。     |
| 401              | auth_bad_access_token              | “Unable to authenticate due to corrupt access token”         | 调用 RESTful 接口发送请求时使用的 App Token 格式错误。<br/>该错误码针对除[注册单个用户](account_system.html#授权注册单个用户)和[批量注册用户](account_system.html#批量注册用户)之外的 RESTful 接口有效。      |
| 401              | auth_bad_access_token              | “Unable to authenticate”                                     | 调用 RESTful 接口发送请求时使用的 App Token 无效。App Token 的格式正确，但不是由接收请求的服务器生成的，导致服务器无法识别该 Token。<br/>该错误码针对除[注册单个用户](account_system.html#授权注册单个用户)和[批量注册用户](account_system.html#批量注册用户)两个 RESTful 接口之外的接口有效。 |
| 403              | forbidden_op                       | “can not join this group, reason:user: hxtest1 already in group: 40659491815425\n” | 添加群组或聊天室成员时，被添加用户已在群组或聊天室内。                       |
| 403              | forbidden_op                       | “users [hxtest100] are not members of this group!”           | 踢除群组或聊天室成员时，被踢除的用户不在群组或聊天室内。              |
| 403              | forbidden_op                       | “user: username1 doesn't exist in group: 40659491815425”     | 转让群组时，被转让的用户不是群组内成员。 |
| 403              | forbidden_op                       | “new owner and old owner are the same”                       | 转让群组时，被转让的用户已经是群主。 |
| 403              | forbidden_op                       | “forbidden operation on group owner!”                        | 当前操作禁止对群主使用，如将群主加入黑名单。                                    |
| 403              | forbidden_op                       | “can not join this group, reason：user %s has joined too many groups/chatroom!” | 用户加入的群组或聊天室数超过了限制。                           |
| 403              | forbidden_op                       | “this appKey has create too many groups/chatrooms!”          | 加入群组或聊天室时，群组或聊天室人数已达到上限。                |
| 404              | organization_application_not_found | “Could not find application for hx/hxdeo2 from URI: hx/hxdeo2/token” | hx/hxdeo2 这个设置不正确或不存在，或 baseurl 集群设置错误（只针对 vip 集群的 AppKey），正确的是 orgname/appname，即 AppKey 的 “#“ 换成 ”/“。 |
| 404              | service_resource_not_found         | “Service resource not found”                                 | URL 指定的资源不存在，如用户相关接口提示用户不存在，群组相关接口提示群组不存在，聊天室相关接口提示聊天室不存在。 |
| 404              | service_resource_not_found         | “Service resource not found”                                 | 获取的 username 不存在，若用户列表存在该 username，则是因为存在脏数据，可以使用 uuid 代替 username 将该 ID 删除，再使用该 username 重新创建。 |
| 404              | service_resource_not_found         | “Service resource not found”                                 | 要删除的 username 不存在，若用户列表存在该 username，则可使用 user 的 uuid 代替 username 删除。 |
| 404              | storage_object_not_found           | “Failed to find chat message history download url for appkey: hx#hxdemo2, time: 2018020912” | 对应的时间没有历史消息，如确定有历史消息，请联系[环信技术支持](mailto:support@easemob.com)。 |
| 413              | Request Entity Too Large           | “Request Entity Too Large”                                   | 请求体过大，如上传文件时文件过大，需要拆成几个更小的请求体重试。 |
| 415              | web_application                    | “Unsupported Media Type”                                     | 请求体的类型不支持，请检查请求头是否添加了 `Content-Type`: `application/json`，请求包体是否符合标准的 JSON 格式，以及请求头中是否有接口不需要的参数。 |
| 429              | resource_limited                   | “You have exceeded the limit of the Free edition. Please upgrade to higher edition.” | 超过免费版套餐包限制。如需开通其他版本套餐包，需联系环信商务。               |
| 429              | reach_limit                        | “This request has reached api limit”                         | 超过即时通讯 RESTful API 的调用频率限制。 |
| 500              | no_full_text_index                 | “Entity ‘user’ with property named ‘username’ is not full text indexed. You cannot use the ‘contains’ operand on this field” | username 不支持全文索引，不可以对该字段进行 `contains` 操作。  |
| 500              | unsupported_service_operation      | “Service operation not supported”                            | 请求 URL 不支持该请求方式。                            |
| 500              | web_application                    | “javax.ws.rs.WebApplicationException”                        | 请求 URL 错误。 |