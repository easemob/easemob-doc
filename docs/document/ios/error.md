# iOS 常见错误代码

<Toc />

本文介绍环信即时通讯 iOS SDK 中接口调用或者回调中的错误码。可以根据具体错误码判断具体错误原因。

iOS 中错误码的类为 `EMError`。

如：注册时用户返回已存在的错误可以这样检测：`EMError.code == EMErrorUserAlreadyExist`。

iOS 的错误码只有当操作出错的时候才会有返回值，否则返回 nil。

| 错误码<div style="width: 50px;"></div> | 错误信息      | 描述和可能原因                 |
| :----- | :------------ | :--------------------------- |
| 0      |   EMErrorNoError  | 操作成功。 |
| 1      |           EMErrorGeneral            | SDK 或请求相关的默认错误，未区分具体错误类型：例如，SDK 内部未正确初始化，或者请求服务器时未识别出具体原因的错误。|
| 2      |      EMErrorNetworkUnavailable      | 网络错误：无网络服务时会回调此错误，表示 SDK 与服务器的连接已断开。 |
| 3      |   EMErrorDatabaseOperationFailed    | 数据库操作失败：打开本地数据库失败。                         |
| 4      |      EMErrorExceedServiceLimit      | 超过服务限制：超过当前服务版本的数量限制，例如，创建的用户 ID 数量超过购买服务的限制时提示该错误。|
| 5      |      EMErrorServiceArrearages       | 服务欠费，该错误码已废弃。                                   |
| 8      |      EMAppActiveNumbersReachLimitation       | 应用程序的日活跃用户数量（DAU）或月活跃用户数量（MAU）达到上限。                                 |
| 100    |        EMErrorInvalidAppkey         | App Key 不合法：用户的 App Key 格式不正确。可在[环信控制台](https://console.easemob.com/user/login)的 **应用详情** 页面查看 App Key。   |
| 101    |       EMErrorInvalidUsername        | 用户 ID 不正确：一般情况下，用户 ID 为空时提示该错误，例如，邀请好友时 username 参数为空字符。 |
| 102    |       EMErrorInvalidPassword        | 用户密码不正确：登录时提供的密码为空或不正确。               |
| 103    |          EMErrorInvalidURL          | URL 不正确，该错误码已废弃。                                 |
| 104    |          EMErrorInvalidToken        | 用户 token 不正确：登录时提供的 token 为空或不正确。                                |
| 105    |       EMErrorUsernameTooLong        | 用户 ID 过长：用户 ID 长度不能超过 64 字节。  |
| 108    |       EMErrorTokenExpire     | 声网 token 已过期：超出声网 token 有效期时间。        |
| 109    |       EMErrorTokeWillExpire      | 声网 token 即将过期：超出声网 token 有效期一半时间时会开始回调此错误码。 |
| 110    |       EMErrorInvalidParam        | 参数无效。  |
| 200    |     EMErrorUserAlreadyLoginSame     | 当前用户已经登录：该用户 ID 已经登录。 |
| 201    |         EMErrorUserNotLogin         | 用户未登录：例如，如果未登录成功时调用发送消息或群组操作的 API 会提示该错误。 |
| 202    |   EMErrorUserAuthenticationFailed   | 用户鉴权失败：一般为 token 无效或已过期。 |
| 203    |       EMErrorUserAlreadyExist       | 用户已经存在：注册用户时，传入的的用户 ID 已经存在会提示该错误。 |
| 204    |         EMErrorUserNotFound         | 用户不存在：例如，登录或获取用户会话列表时，用户 ID 不存在。|
| 205    |     EMErrorUserIllegalArgument      | 用户参数不正确：例如，创建用户或更新用户属性时，用户 ID 为空或无效。 |
| 206    |   EMErrorUserLoginOnAnotherDevice   | 用户在其他设备登录：如果未开启多设备登录，则在其他设备登录会将当前登录设备踢下线，用户会在当前设备收到该错误。 |
| 207    |         EMErrorUserRemoved          | 用户已被注销：当前的登录用户 ID 从[环信控制台](https://console.easemob.com/user/login)删除会收到该错误。|
| 208    |      EMErrorUserRegisterFailed      | 用户注册失败：例如，注册用户之前未开启开放注册功能等原因。 |
| 209    |   EMErrorUpdateApnsConfigsFailed    | 更新推送配置错误：例如，用户更新推送昵称或设置免打扰配置时失败。 |
| 210    |     EMErrorUserPermissionDenied     | 用户无权限：例如，如果用户被封禁，发送消息时会提示该错误。   |
| 211    |  EMErrorUserBindDeviceTokenFailed   | 用户更新推送 token 错误，该错误码已废弃。                    |
| 212    | EMErrorUserUnbindDeviceTokenFailed  | 用户更新推送 token 错误，该错误码已废弃。                    |
| 213    |    EMErrorUserBindAnotherDevice     |用户已在其他设备登录：在单设备登录场景中，默认情况下，后登录的设备会踢掉当前设备的登录。若设置为先登录的设备优先，则后登录设备登录失败并提示该错误。该错误码已废弃。|
| 214    |   EMErrorUserLoginTooManyDevices    | 用户登录设备数超过限制：该错误在多设备自动登录场景中且打开不踢掉其他设备上的登录的开关时超过登录设备数量的限制才会出现。例如，用户最多可同时登录 4 台设备， A（开启了自动登录）、B、C 和 D。最初，用户在这四个设备上均为登录状态，但由于网络连接原因登出了设备 A，然后手动登录了设备 E。这种情况下，设备 A 的网络恢复正常时会自动登录，这时登录失败且提示该错误。 |
| 215    |          EMErrorUserMuted           | 用户在群组聊天室中被禁言：用户被禁言后发送消息时提示该错误。 |
| 216    |  EMErrorUserKickedByChangePassword  | 用户密码更新：当前登录的用户密码被修改后，当前登录会断开并提示该错误。 |
| 217    |   EMErrorUserKickedByOtherDevice    | 用户被踢下线：开启多设备服务后，如果用户在其他设备上通过调用 API 或者管理后台将当前设备登录的 ID 强制退出登录，SDK 会提示该错误。 |
| 218    |   EMErrorUserAlreadyLoginAnother    | 其他用户已登录：用户在同一台设备上退出登录前又使用另一账户登录。 |
| 219    |       EMErrorUserMutedByAdmin       | 用户被禁言：用户被全局禁言后发送消息时提示该错误。  |
| 220    |       EMErrorUserDeviceChanged       | 用户的登录设备与上次不一致。该错误在单设备自动登录场景中且打开不踢掉其他设备上的登录的开关时才会出现。例如，用户自动登录设备 A，之后手动登录设备 B。用户再次自动登录设备 A 时登录失败且提示该错误。  |
| 221    |      EMErrorUserNotOnRoster   | 非好友禁止发消息：开通非好友禁止发消息后，非好友间发消息提示此错误。你可以在[环信控制台](https://console.easemob.com/user/login)的**即时通讯 > 服务概览**页面的**设置**区域开启好友关系检查功能。 |
| 300    |      EMErrorServerNotReachable      | 服务器不可达：例如，发送或撤回消息时，如果 SDK 与消息服务器未保持连接，会返回该错误；操作群组、好友等请求时因网络不稳定导致失败，也会返回该错误 |
| 301    |        EMErrorServerTimeout         | 请求服务超时：如果调用 API 在特定时间内服务器未响应则返回该错误，一般为 30 秒或 60 秒。|
| 302    |          EMErrorServerBusy          | 服务器忙碌：服务器当前忙碌，建议稍后重试。                   |
| 303    |      EMErrorServerUnknownError      | 服务请求的通用错误码：当请求服务器未成功时的默认错误，该错误发生情况较多，需要根据日志进一步排查。 |
| 304    |   EMErrorServerGetDNSConfigFailed   | 获取服务器配置信息错误：SDK 获取当前应用的服务器配置时失败。 |
| 305    |    EMErrorServerServingForbidden    | 当前 app 被禁用：app 因为某种原因被禁用。                    |
| 400    |         EMErrorFileNotFound         | 文件未找到：例如，用户获取不到日志文件，或者下载附件失败时提示该错误。 |
| 401    |         EMErrorFileInvalid          | 文件异常：例如，当上传消息附件或者群组共享文件时可能会提示该错误。 |
| 402    |       EMErrorFileUploadFailed       | 上传文件错误：例如，上传消息附件失败时提示该错误。  |
| 403    |      EMErrorFileDownloadFailed      | 下载文件错误：例如，下载消息附件失败时提示该错误。  |
| 404    |       EMErrorFileDeleteFailed       | 删除日志文件错误：通过 API 获取日志文件时会将旧的日志文件删除，然后生成新的日志文件。如果删除旧日志文件失败会提示该错误。 |
| 405    |         EMErrorFileTooLarge         | 文件太大：例如，消息附件或群共享文件超过文件大小限制时提示该错误。 |
| 406    |     EMErrorFileContentImproper      | 文件内容不合规：例如，消息附件或群共享文件内容不合规时提示该错误。  |
| 500    |        EMErrorMessageInvalid        | 消息异常：例如，发送消息时，若消息对象或消息 ID 为空或者消息的发送方 ID 与当前登录 ID 不同则会提示该错误。 |
| 501    | EMErrorMessageIncludeIllegalContent | 消息含有非法内容：消息被过滤系统识别为非法消息。             |
| 502    |     EMErrorMessageTrafficLimit      | 消息限流：消息发送速度过快，建议降低频率或者减少消息内容。   |
| 503    |      EMErrorMessageEncryption       | 消息加密错误：该错误码已废弃。                               |
| 504    |    EMErrorMessageRecallTimeLimit    | 消息撤回超时错误：消息撤回超过时间限制时会提示该错误。 |
| 505    |       EMErrorServiceNotEnable       | 服务未开启：尝试使用某些未开通的功能时提示该错误。 |
| 506    |        EMErrorMessageExpired        | 消息已过期：发送群组回执时超过了时间限制 (默认 3 天) 。      |
| 507    |   EMErrorMessageIllegalWhiteList    | 用户未在白名单中：群组或聊天室开启全员禁言时，若用户未在白名单中发送消息时提示该错误。 |
| 508    | EMErrorMessageExternalLogicBlocked  | 发送前回调拦截：发送的消息被用户自己的服务器定义的规则拦截掉时提示该错误。  |
| 509    |    EMErrorMessageCurrentLimiting    | 单个用户 ID 发送消息超出频率限制。默认情况下，SDK 对单个用户 ID 发送群消息未做频率限制。如果你联系了环信商务设置了该限制，一旦在在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，则会提示该错误。 |
| 510    |    EMErrorMessageSizeLimit    | 发送消息时消息体大小超过上限。 |
| 511   | EMErrorEditFailed  | 消息修改失败。  |
| 600    |        EMErrorGroupInvalidId        | 群组 ID 异常：使用群组相关 API，提供的群组 ID 为空或无效。 |
| 601    |      EMErrorGroupAlreadyJoined      | 已在该群组中：例如，调用加入群组的 API 加入的用户已经在该群组中。  |
| 602    |        EMErrorGroupNotJoined        | 未加入该群组：在未加入的群组中发送消息或进行群组操作时提示该错误。 |
| 603    |    EMErrorGroupPermissionDenied     | 无权限的群组操作：例如，群组普通成员没有权限设置群组管理员。|
| 604    |       EMErrorGroupMembersFull       | 群组已满：群组成员数量已达到创建群组时设置的最大人数。|
| 605    |   EMErrorGroupSharedFileInvalidId   | 共享文件 ID 为空：共享文件 ID 为空。                         |
| 606    |        EMErrorGroupNotExist         | 群组不存在：对不存在的群组进行操作。                         |
| 607    |        EMErrorGroupDisabled        | 群组被禁用。 |
| 608    |        EMErrorGroupNameViolation        | 群组名称无效。 |
| 609    |   EMErrorGroupMemberAttributesReachLimit   | 群组成员自定义属性个数达到上限。                         |
| 610    |   EMErrorGroupMemberAttributesUpdateFailed   | 设置群成员自定义属性失败。                        |
| 611    |   EMErrorGroupMemberAttributesKeyReachLimit   | 设置的群成员自定义属性 key 长度（不能超过 16 字节）超限。                        |
| 612    |   EMErrorGroupMemberAttributesValueReachLimit   | 设置的群成员自定义属性 value 长度（不能超过 512 字节）超限。  |
| 700    |      EMErrorChatroomInvalidId       | 聊天室 ID 无效：调用聊天室相关 API，传入的聊天室 ID 为空时提示该错误。 |
| 701    |    EMErrorChatroomAlreadyJoined     | 已在该聊天室中：调用加入聊天室的 API 时如果已经在该聊天室中则提示该错误。 |
| 702    |      EMErrorChatroomNotJoined       | 未加入该聊天室：用户在未加入的聊天室中发送消息或进行聊天室操作时提示该错误。 |
| 703    |   EMErrorChatroomPermissionDenied   | 无权限的聊天室操作：例如，聊天室普通成员没有权限设置聊天室管理员。 |
| 704    |     EMErrorChatroomMembersFull      | 聊天室已满：聊天室成员数量已达到创建聊天室时设置的最大人数。|
| 705    |       EMErrorChatroomNotExist       | 聊天室不存在：尝试对不存在的聊天室进行操作时提示该错误。 |
| 900    |       EMErrorUserCountExceed        | 获取用户属性的用户个数超过 100。                             |
| 901    |   EMErrorUserInfoDataLengthExceed   | 设置的用户属性太长。单个用户的所有属性数据不能超过 2 KB，单个 app 所有用户属性数据不能超过 10 GB。 |
| 1000   |       EMErrorContactAddFailed       | 添加联系人失败。                                             |
| 1001   |      EMErrorContactReachLimit       | 邀请者的联系人数量已达到上限。                               |
| 1002   |    EMErrorContactReachLimitPeer     | 受邀请者的联系人数量已达到上限。                                     |
| 1100   |     EMErrorPresenceParamExceed      | 参数长度超出限制：调用 Presence 相关方法时参数长度超出限制。   |
| 1101   | EMErrorPresenceCannotSubscribeSelf  | 不能订阅你自己的状态。                                       |
| 1110   |     EMErrorTranslateParamError      | 翻译参数错误。                                               |
| 1111   |  EMErrorTranslateServiceNotEnabled  | 翻译服务未启用。使用翻译服务前，应在[环信控制台](https://console.easemob.com/user/login)开启该服务。  |
| 1112   |     EMErrorTranslateUsageLimit      | 翻译用量达到上限。                                           |
| 1113   |     EMErrorTranslateServiceFail     | 获取翻译服务失败。          |
| 1200   |     EMErrorModerationFailed           | 第三方内容审核服务的消息审核结果为“拒绝”。 |
| 1299   |     EMErrorThirdServiceFailed        | 除第三方内容审核服务的其他服务的消息审核结果为“拒绝”。 |
| 1300   |     EMErrorReactionReachLimit      | 该消息的 Reaction 数量已达到限制。         |
| 1301   |   EMErrorReactionHasBeenOperated    | 用户已添加该 Reaction，不能重复添加。  |
| 1302   |  EMErrorReactionOperationIsIllegal  | 用户对该 Reaction 没有操作权限。例如，未添加过该 Reaction 的用户进行删除操作，或者既非单聊消息的发送方也不是非接收方的用户对消息添加 Reaction。 |
| 1400   |  EMErrorThreadNotExist        | 未找到该子区，该子区不存在。                                 |
| 1401   |        EMErrorThreadAlreadyExist         | 该消息 ID 下子区已存在，重复添加子区。                       |
| 1402   |    EMErrorThreadCreateMessageIllegal    | 创建子区的消息无效：例如，创建子区时父消息被撤回了或者无法使用。 |
| 1500   |  EMErrorNotSupportPush   | 第三方推送不支持：如果用户配置的第三方推送在当前设备上不支持，会提示该错误。 |
| 1501   |  EMErrorPushBindFailed  | 绑定第三方推送 token 失败：如果将第三方推送 token 上传到服务器失败会返回该错误。 |
| 1502   | EMErrorPushUnBindFailed   | 解绑第三方推送 token 失败：如果解绑第三方推送 token 失败会提示该错误。 |