# 常见错误代码

<Toc />

本文主要介绍在调用环信即时通讯的接口过程中，SDK 返回的错误码和错误信息。

你可以根据如下错误码及错误信息了解出错的可能原因，并采取响应措施。

环信即时通讯 SDK 在运行过程中，可能通过如下方式返回错误码和错误信息：

- 调用方法失败时的返回值。
- 通过 `onError` 回调报告错误码。

例如，注册时用户返回已存在的错误可以这样检测：

```csharp
SDKClient.Instance.Login(username, passwd,
    callback: new CallBack(
        onSuccess: () =>
        {
        },
        onError: (code, desc) =>
        {
            //注册失败，回调函数会返回错误码和错误描述
            //如：code为：USER_ALREADY_EXIST(203)
            //desc : User already exist.
        }
    )
);
```

错误码定义如下：

| 错误码 | 错误信息                              | 描述和可能原因          |
| :----- | :-------------------------------------| :--------------------- |
| 0      | EM_NO_ERROR                           | 提示操作成功。   |
| 1      | GENERAL_ERROR                         | SDK 或请求相关的默认错误，未区分具体错误类型：例如，SDK 内部未正确初始化，或者请求服务器时未识别出具体原因的错误。 |
| 2      | NETWORK_ERROR                         | 网络错误：无网络服务时会回调此错误，表示 SDK 与服务器的连接已断开。    |
| 3      | DATABASE_ERROR                        | 数据库操作失败：打开本地数据库失败。  |
| 4      | EXCEED_SERVICE_LIMIT                  | 超过服务限制：超过服务版本的数量限制，比如创建的用户 ID 数量超过购买服务的限制时提示该错误。            |
| 8      | APP_ACTIVE_NUMBER_REACH_LIMITATION    | 应用程序的日活跃用户数量（DAU）或月活跃用户数量（MAU）达到上限。                        |
| 100    | INVALID_APP_KEY                       | App Key 不合法：你的 App Key 格式不正确。可在[环信即时通讯控制台](https://console.easemob.com/user/login)的 **应用详情** 页面查看 App Key。    |
| 101    | INVALID_USER_NAME                     | 用户 ID 不正确：一般是用户 ID 为空时提示该错误，比如使用邀请好友 API 时 username 参数为空字符。     |
| 102    | INVALID_PASSWORD                      | 用户密码不正确：登录时提供的密码为空或不正确。  |
| 104    | INVALID_TOKEN                         | 登录时提供的 token 为空或不正确。     |
| 105    | USER_NAME_TOO_LONG                    | 用户 ID 过长：用户名长度限制 64 个字节。                                                                                                                                                |
| 108    | TOKEN_EXPIRED                         | 声网 token 已过期：超出声网 token 有效期时间。       |
| 109    | TOKEN_WILL_EXPIRE                     | 声网 token 即将过期：超出声网 token 有效期一半时间时会开始回调此错误码。        |
| 200    | USER_ALREADY_LOGIN                    | 用户已经登录：同一个用户 ID 已经登录。                                                                                                                                                |
| 201    | USER_NOT_LOGIN                        | 用户未登录：例如，如果未登录成功时发送消息，或者使用群组操作的 API，SDK 会提示该错误。                                                                                                      |
| 202    | USER_AUTHENTICATION_FAILED            | 用户鉴权失败：一般是 token 鉴权失败或者 token 已经过期。    |
| 203    | USER_ALREADY_EXIST                    | 用户已经存在：注册用户 ID 时如果该 ID 已经存在会提示该错误。  |
| 204    | USER_NOT_FOUND                        | 用户不存在：例如，登录或者获取用户会话列表时用户 ID 不存在。    |
| 205    | USER_ILLEGAL_ARGUMENT                 | 用户参数不正确：比如创建用户 ID 时不符合格式要求， 或者更新用户属性时用户参数为空等。      |
| 206    | USER_LOGIN_ANOTHER_DEVICE             | 用户在其他设备登录：如果未开启多设备登录，则在其他设备登录会将当前登录的设备踢下线，用户会收到此错误。              |
| 207    | USER_REMOVED                          | 用户已经被注销：如果登录用户被从管理后台删除 ID 则会收到此错误。    |
| 208    | USER_REG_FAILED                       | 用户注册失败：例如，注册用户 ID 时失败，比如未开启开放注册功能等原因。   |
| 209    | PUSH_UPDATECONFIGS_FAILED             | 更新推送配置错误：例如，用户更新推送昵称，设置免推送配置时失败。     |
| 210    | USER_PERMISSION_DENIED                | 用户无权限：例如，如果用户被添加到黑名单后，发送消息时会提示该错误。其他报错情况包括用户修改其他用户发出的消息、修改其他用户设置的群成员属性以及普通群成员试图解散子区（仅子区所在群组的群主和群管理员有权解散子区）。 |
| 213    | USER_BIND_ANOTHER_DEVICE              | 用户已在其他设备登录：在单设备登录场景中，默认情况下，后登录的设备会踢掉当前设备的登录。若设置为先登录的设备优先，则后登录设备登录失败并提示该错误。该错误码已废弃。 |
| 214    | USER_LOGIN_TOO_MANY_DEVICES           | 用户登录设备数超过限制：该错误在多设备自动登录场景中且打开不踢掉其他设备上的登录的开关时超过登录设备数量的限制才会出现。例如，用户最多可同时登录 4 台设备， A（开启了自动登录）、B、C 和 D。最初，用户在这四个设备上均为登录状态，但由于网络连接原因登出了设备 A，然后手动登录了设备 E。这种情况下，设备 A 的网络恢复正常时会自动登录，这时登录失败且提示该错误。 |
| 215    | USER_MUTED                            | 用户在群组聊天室中被禁言：用户被禁言后发送消息时提示该错误。     |
| 216    | USER_KICKED_BY_CHANGE_PASSWORD        | 用户密码更新：当前登录的用户密码被修改后，当前登录会断开并提示该错误。   |
| 217    | USER_KICKED_BY_OTHER_DEVICE           | 用户被踢下线：开启多设备后，如果用户在其他设备上通过调用 API 或者管理后台将当前设备登录的 ID 强制退出登录，SDK 会提示该错误。   |
| 218    | USER_ALREADY_LOGIN_ANOTHER            | 其他用户已登录：SDK 未退出登录前又被使用不同的账户登录。     |
| 219    | USER_MUTED_BY_ADMIN                   | 用户被禁言：用户在当前 app key 被禁言后发送消息时提示该错误。   |
| 220    | USER_DEVICE_CHANGED                   | 用户的登录设备与上次不一致。该错误在单设备自动登录场景中且打开不踢掉其他设备上的登录的开关时才会出现。例如，用户自动登录设备 A，之后手动登录设备 B。用户再次自动登录设备 A 时登录失败且提示该错误。 |
| 221    | USER_NOT_FRIEND                       | 非好友禁止发消息：开通非好友禁止发消息后，非好友间发消息提示此错误。你可以在[环信即时通讯控制台](https://console.easemob.com/user/login)的**即时通讯 > 服务概览**页面的**设置**区域开启好友关系检查功能。  |
| 300    | SERVER_NOT_REACHABLE                  | 请求服务失败：发送或撤回消息时，如果 SDK 与消息服务器未保持连接，会返回该错误；操作群组、好友等请求时，如果因网络连接太差而不成功，也会返回该错误。                                   |
| 301    | SERVER_TIMEOUT                        | 请求服务超时：如果调用 API 在特定时间内服务器未响应则返回该错误，一般是 30 秒或者 60 秒。    |
| 302    | SERVER_BUSY                           | 服务器忙碌：服务器当前忙碌会返回该错误，建议稍后再尝试请求。  |
| 303    | SERVER_UNKNOWN_ERROR                  | 服务请求的通用错误码：当请求服务器未成功时的默认错误，该错误发生情况较多，需要根据日志进一步排查。   |
| 304    | SERVER_GET_DNSLIST_FAILED             | 获取服务器配置信息错误：SDK 获取当前应用的服务器配置时失败。    |
| 305    | SERVER_SERVICE_RESTRICTED             | 当前 app 被禁用：如果 app 因为某种原因被禁用时会返回该错误。   |
| 400    | FILE_NOT_FOUND                        | 文件未找到：当用户获取不到日志文件，或者下载附件失败时提示该错误。  |
| 401    | FILE_INVALID                          | 文件异常：当上传消息附件或者群组共享文件时可能会提示该错误。    |
| 402    | FILE_UPLOAD_FAILED                    | 上传文件错误：上传消息附件失败时提示该错误。    |
| 403    | FILE_DOWNLOAD_FAILED                  | 下载文件错误：下载消息附件失败时提示该错误。   |
| 404    | FILE_DELETE_FAILED                    | 删除文件错误：通过 API 获取日志文件时会将旧的日志文件删除，如果删除失败提示该错误。    |
| 405    | FILE_TOO_LARGE                        | 文件太大：消息附件或群共享文件超过文件大小限制时提示该错误。   |
| 406    | FILE_CONTENT_IMPROPER                 | 文件内容不合规：消息附件或群共享文件内容不合规时提示该错误。   |
| 407    | FILE_IS_EXPIRED                 | 文件已过期：例如，用户下载过期的消息附件或群共享文件时提示该错误。消息附件和群共享文件默认可存储 7 天。要提升存储时间上限，请联系商务。 |
| 500    | MESSAGE_INVALID                       | 消息异常：例如，发送消息时，若消息对象或消息 ID 为空或者消息的发送方 ID 与当前登录 ID 不同则会提示该错误。  |
| 501    | MESSAGE_INCLUDE_ILLEGAL_CONTENT       | 消息含有非法内容：如果消息被过滤系统识别为非法消息时返回该错误。   |
| 502    | MESSAGE_SEND_TRAFFIC_LIMIT            | 消息限流：发送消息过快时提示该错误，建议降低频率或者减少消息内容的大小。  |
| 504    | MESSAGE_RECALL_TIME_LIMIT             | 消息撤回超时错误：如果超过消息撤回允许的时间尝试撤回时提示该错误。  |
| 505    | SERVICE_NOT_ENABLED                   | 服务未开启：尝试使用某些未开通的功能时提示该错误。     |
| 506    | MESSAGE_EXPIRED                       | 消息已过期：发送群组回执时如果已经超过时间限制 (默认 3 天) 会提示该错误。  |
| 507    | MESSAGE_ILLEGAL_WHITELIST             | 用户未在白名单中：如果群组聊天室开启全员禁言，且用户未在白名单中发送消息时提示该错误。     |
| 508    | MESSAGE_EXTERNAL_LOGIC_BLOCKED        | 消息执行发送前回调，被用户自己的逻辑拦截：发送的消息被用户自己的服务器定义的规则拦截掉时提示该错误。      |
| 509    | MESSAGE_CURRENT_LIMITING              | 单个用户 ID 发送消息超出频率限制。默认情况下，SDK 对单个用户 ID 发送群消息未做频率限制。如果你联系了环信商务设置了该限制，一旦在在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，则会提示该错误。 |
| 510    | MESSAGE_SIZE_LIMIT                    | 发送消息时消息体大小超过上限。     |
| 511    | MESSAGE_EDIT_FAILED                   | 消息修改失败。     |
| 600    | GROUP_INVALID_ID                      | 群组 ID 异常：使用群组相关 API，提供的群组 ID 为空时提示该错误。    |
| 601    | GROUP_ALREADY_JOINED                  | 已在该群组中：调用加入群组的 API 时如果已经在该群组中则提示该错误。    |
| 602    | GROUP_NOT_JOINED                      | 未加入该群组：尝试在未加入的群组中发送消息或进行群组操作时提示该错误。  |
| 603    | GROUP_PERMISSION_DENIED               | 无权限的群组操作：没有权限进行群组操作，比如群组成员不能设置群组管理员。  |
| 604    | GROUP_MEMBERS_FULL                    | 群组已满：群组已经达到人数上限。    |
| 605    | GROUP_SHARED_FILE_INVALIDID           | 群组共享文件 ID 非法。           |
| 606    | GROUP_NOT_EXIST                       | 群组不存在：尝试对不存在的群组进行操作时提示该错误。   |
| 607    | GROUP_DISABLED                        | 群组被禁用。        |
| 608    | GROUP_NAME_VIOLATION                  | 群组名称非法。      |
| 609    | GROUP_MEMBER_ATTRIBUTES_REACH_LIMIT   | 群组成员自定义属性个数达到上限。     |
| 610    | GROUP_MEMBER_ATTRIBUTES_UPDATE_FAILED | 设置群成员自定义属性失败。        |
| 700    | CHATROOM_INVALID_ID                   | 聊天室 ID 异常：使用聊天室相关 API，提供的聊天室 ID 为空时提示该错误。 |
| 701    | CHATROOM_ALREADY_JOINED               | 已在该聊天室中：调用加入聊天室的 API 时如果已经在该聊天室中则提示该错误。   |
| 702    | CHATROOM_NOT_JOINED                   | 未加入该聊天室：尝试在未加入的聊天室中发送消息或进行聊天室操作时提示该错误。 |
| 703    | CHATROOM_PERMISSION_DENIED            | 无权限的聊天室操作：没有权限进行聊天室操作，比如聊天室成员不能设置聊天室管理员。 |
| 704    | CHATROOM_MEMBERS_FULL                 | 聊天室已满：聊天室已经达到人数上限。      |
| 705    | CHATROOM_NOT_EXIST                    | 聊天室不存在：尝试对不存在的聊天室进行操作时提示该错误。             |
| 706 | CHATROOM_OWNER_NOT_ALLOW_LEAVE | 聊天室所有者不允许离开聊天室。若初始化时，`Options#IsRoomOwnerLeaveAllowed` 参数设置为 `false`，聊天室所有者调用 `LeaveRoom` 方法离开聊天室时会提示该错误。|
| 900    | USERINFO_USERCOUNT_EXCEED             | 获取用户属性的用户个数超过 100。    |
| 901    | USERINFO_DATALENGTH_EXCEED            | 设置的用户属性太长。单个用户的所有属性数据不能超过 2 KB，单个 app 所有用户属性数据不能超过 10 GB。    |
| 1000   | CONTACT_ADD_FAILED                    | 添加联系人失败。    |
| 1001   | CONTACT_REACH_LIMIT                   | 邀请者联系人数量已经达到上限。   |
| 1002   | CONTACT_REACH_LIMIT_PEER              | 受邀请者联系人达到上限。    |
| 1100   | PRESENCE_PARAM_LENGTH_EXCEED          | 参数长度超出限制：调用 Presence 相关方法时参数长度超出限制。  |
| 1101   | PRESENCE_CANNOT_SUBSCRIBE_YOURSELF    | 不能订阅你自己的状态。    |
| 1110   | TRANSLATE_PARAM_INVALID               | 翻译参数错误。 |
| 1111   | TRANSLATE_SERVICE_NOT_ENABLE          | 翻译服务未启用。使用翻译服务前，应在[环信控制台](https://console.easemob.com/user/login)开启该服务。   |
| 1112   | TRANSLATE_USAGE_LIMIT                 | 翻译用量达到上限。 |
| 1113   | TRANSLATE_MESSAGE_FAIL                | 获取翻译服务失败。     |
| 1200   | THIRD_MODERATION_FAILED               | 第三方内容审核服务的消息审核结果为“拒绝”。   |
| 1299   | THIRD_DEFAULT_FAILED                  | 除第三方内容审核服务的其他服务的消息审核结果为“拒绝”。    |
| 1300   | REACTION_REACH_LIMIT                  | 该消息的 Reaction 数量已达到限制。   |
| 1301   | REACTION_HAS_BEEN_OPERATED            | Reaction 重复添加。    |
| 1302   | REACTION_OPERATION_IS_ILLEGAL         | 没有操作权限：用户对该 Reaction 没有操作权限。例如，没有添加过该 Reaction 的用户进行删除操作，或者单聊消息非发送者和非接受者进行添加 Reaction 操作。  |
| 1400   | THREAD_NOT_EXIST                      | 未找到该子区，该子区不存在。 |
| 1401   | THREAD_ALREADY_EXIST                  | 该消息 ID 下子区已存在，重复添加子区。   |
| 1402   | THREAD_CREATE_MESSAGE_ILLEGAL         | 创建子区的消息无效：创建子区时父消息被撤回了，或者无法使用。    |

