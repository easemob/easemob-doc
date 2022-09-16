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
| 413                        | （请求体过大）请求体超过了 5 kb，拆成更小的请求体重试即可。  |
| 415                        | 请求体的类型不支持。                                         |
| 429                        | （服务不可用）请求接口超过调用频率限制，即接口被限流。或超过社区版限制，如有需要可联系商务。 |
| 500                        | （服务器内部错误）服务器遇到错误，无法完成请求。             |
| 501                        | （尚未实施）服务器不具备完成请求的功能。例如，服务器无法识别请求方法时可能会返回此代码。 |
| 502                        | （错误网关）服务器作为网关或代理，从上游服务器收到无效响应。 |
| 503                        | （服务器超时）Service Unavailable。                          |
| 504                        | （网关超时）服务器作为网关或代理，但是没有及时从上游服务器收到请求。 |

## 索引 错误结果说明

| HTTP Status Code<div style="width: 220px;"></div> | Error                              | Error Description                                            | 可能原因                                                     |
| :--------------- | :--------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 400              | invalid_grant                      | invalid username or password                                 | 用户名或者密码输入错误。                                     |
| 400              | invalid_grant                      | “client_id does not match”                                   | “client_id does not match” 是 client_id 传入不正确，“client_secret does not match” 是 client_secret 传入不正确，client_id 以及 client_secret 在管理后台对应的应用详情中查看。 |
| 400              | json_parse                         | “Unexpected character (‘=’ (code 61)): was expecting a colon to separate field name and value\n at [Source: java.io.BufferedInputStream@170e3f35; line: 1, column: 23]” | 发送请求时请求体不符合标准的 JSON 格式，服务器无法正确解析。 |
| 400              | illegal_argument                   | “Entity user requires a property named username”             | 创建用户请求体未提供 “username”。                            |
| 400              | illegal_argument                   | “password or pin must provided”                              | 创建用户请求体未提供 “password” 或提供了 password 但是值为空字符。 |
| 400              | illegal_argument                   | “newpassword is required”                                    | 修改用户密码的请求体没提供 newpassword 属性。                |
| 400              | illegal_argument                   | “oldPassword is required”                                    | 这个是因为没有加管理员 token 的 header 导致，需要 header 加上管理员 token 的参数即可。 |
| 400              | illegal_argument                   | “group member username1 doesn’t exist”                       | 批量添加群组时预加入群组的新成员 username 不存在。           |
| 400              | illegal_argument                   | “this is an invalid request.”                                | 请求无效，请检查调用接口的 url、header、body，是否符合所调用接口的要求，可以使用 curl 命令进行测试。 |
| 400              | illegal_argument                   | “from can't be empty”                                        | from 表示消息发送者，无此字段 Server 会默认设置为 “from”:“admin”，有 from 字段但值为空字符串(“”)时请求失败，返回 400。 |
| 400              | illegal_argument                   | “target_type can only be 'users' or 'chatgroups' or 'chatrooms'” | target_type 只能为 'users' or 'chatgroups' or 'chatrooms'，为其他字符串时请求失败，返回 400。 |
| 400              | illegal_argument                   | “username is not legal”                                      | 注册使用的 username 不合法，username(Chat ID) 规则见 [用户体系集成](account_system.html#注册用户) |
| 400              | illegal_argument                   | “This chatmessage request is not supported”                  | 可能是传入的时间格式不正确，正确的格式是：YYYYMMDDHH，如要获取 2018 年 02 月 09 日 12 点到 13 点的聊天记录，这样设置：2018020912。 |
| 400              | illegal_argument                   | “illegal arguments: appkey: easemob-demo#chatdemoui, time: 2018020918, maybe chat message history is expired or unstored” | 对应时间的聊天记录还未生成或已过期，目前聊天记录免费保存 3 天。 |
| 400              | invalid_parameter                  | “some of [groupid] are not valid fields”                     | 修改群信息目前只支持修改“群名称”、“群描述”、“群最大人数”，这个 error 是修改的参数不支持，如修改 groupid。 |
| 400              | required_property_not_found        | “Entity user requires a property named username”             | 这个是被重置密码的 username 不存在导致。                     |
| 400              | duplicate_unique_property_exists   | “Application null Entity user requires that property named username be unique, value of hxtest1 exists” | 注册的 username 已存在，返回 400；注：如果是批量注册，若一次调用返回一个 ID 已存在，则此次调用注册的其他不存在的 ID 不会注册，需将已存在的 ID 从数组中移除重新调用注册。 |
| 400              |                                    | “set presence failed”                                        | 在线状态设置失败。                                           |
| 400              |                                    | “ext is too big”                                             | 在线状态扩展信息长度超过限制                                 |
| 400              |                                    | “resource not exist”                                         | 设备来源不存在。                                             |
| 400              |                                    | “you can't sub yourself”                                     | 无法订阅自己的在线状态。                                     |
| 400              |                                    | “too many sub presence”                                      | 订阅用户数量超过上限。                                       |
| 400              |                                    | “too many get presences”                                     | 获取在线状态的用户数量超过上限。                             |
| 400              |                                    | “too many unsub presences”                                   | 取消订阅的用户数量超过上限。                                 |
| 400              |                                    | “too many queries”                                           | 查询次数超过限制。                                           |
| 401              | unauthorized                       | “registration is not open, please contact the app admin”     | 返回 401 是未授权，error_description 的描述为 App Key 使用了授权注册，需要 header 加上管理员 token，才有权限注册用户；若加上 token 返回 401，则 token 可能失效，建议重取重试。 |
| 401              | unauthorized                       | “Unable to authenticate due to expired access token”         | token 过期或未传 token。                                     |
| 401              | auth_bad_access_token              | “Unable to authenticate due to corrupt access token”         | 发送请求时使用的 token 错误。注意：不是 token 过期。         |
| 401              | auth_bad_access_token              | “Unable to authenticate”                                     | 无效 token，符合 token 的格式，但是该 token 不是接受请求的系统生成的，系统无法识别该 token。 |
| 403              | forbidden_op                       | “can not join this group, reason:user: hxtest1 already in group: 40659491815425\n” | 群组加人返回 403 说明用户已经在群内。                        |
| 403              | forbidden_op                       | “users [hxtest100] are not members of this group!”           | 群组减人返回 403 说明被踢的用户本身就不在群内。              |
| 403              | forbidden_op                       | “user: username1 doesn't exist in group: 40659491815425”     | 转让群组返回 403，error_description 说明用户被转让的用户不是群成员，无法转让。 |
| 403              | forbidden_op                       | “new owner and old owner are the same”                       | 转让群组返回 403，error_description 说明被转让的用户已经是群主。 |
| 403              | forbidden_op                       | “forbidden operation on group owner!”                        | 不能将群主加入黑名单。                                       |
| 403              | forbidden_op                       | “can not join this group, reason：user %s has joined too many groups/chatroom!” | 用户加入群组或聊天室数超过了限制。                           |
| 403              | forbidden_op                       | “this appKey has create too many groups/chatrooms!”          | AppKey 下创建的群组或聊天室数量以达到限制。                  |
| 404              | organization_application_not_found | “Could not find application for hx/hxdeo2 from URI: hx/hxdeo2/token” | hx/hxdeo2 这个设置不正确或不存在，或 baseurl 集群设置错误（只针对 vip 集群的 AppKey），正确的是 orgname/appname，即 AppKey 的 “#“ 换成 ”/“。 |
| 404              | service_resource_not_found         | “Service resource not found”                                 | URL 指定的资源不存在，如用户相关接口是用户不存在，群组相关接口是群组不存在，聊天室相关接口是聊天室不存在。 |
| 404              | service_resource_not_found         | “Service resource not found”                                 | 获取的 username 不存在，若用户列表存在该 username，则是因为存在脏数据，可以使用 uuid 代替 username 将该 ID 删除，再使用该 username 重新创建。 |
| 404              | service_resource_not_found         | “Service resource not found”                                 | 要删除的 username 不存在，若用户列表存在该 username，则可使用 user 的 uuid 代替 username 删除。 |
| 404              | storage_object_not_found           | “Failed to find chat message history download url for appkey: hx#hxdemo2, time: 2018020912” | 对应的时间没有聊天记录，如确定有聊天记录，请提交工单反馈 Agora Chat 技术支持团队确认。 |
| 413              | Request Entity Too Large           | “Request Entity Too Large”                                   | 请求体过大，如上传文件时文件过大；或发送消息时消息体过大，请求体如果超过 5kb 会导致 413 错误，需要拆成几个更小的请求体重试，同时用户消息+扩展字段的长度在 4k 字节以内。 |
| 415              | web_application                    | “Unsupported Media Type”                                     | 请求体的类型不支持，请检查 header 是否添加 ”Content-Type”:“application/json”，body 是否符合标准的 JSON 格式，再确认 header 中是否还有非接口需要的参数，可以舍去。 |
| 429              | resource_limited                   | “You have exceeded the limit of the Free edition. Please upgrade to higher edition.” | 说明触发了免费版限制，请联系环信客户经理咨询。               |
| 429              | reach_limit                        | “This request has reached api limit”                         | 超过接口每秒调用次数，加大调用间隔或者联系商务调整限流大小，见 [限制条件](/product/limitation.html)。 |
| 500              | no_full_text_index                 | “Entity ‘user’ with property named ‘username’ is not full text indexed. You cannot use the ‘contains’ operand on this field” | username 不支持全文索引，不可以对该字段进行 contains 操作。  |
| 500              | unsupported_service_operation      | “Service operation not supported”                            | 请求方式不被发送请求的 URL 支持。                            |
| 500              | web_application                    | “javax.ws.rs.WebApplicationException”                        | 错误的请求，给一个未提供的 API 发送了请求。                  |