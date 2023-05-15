# iOS 常见错误代码

<Toc />

本文介绍环信即时通讯 iOS SDK 中接口调用或者回调中的错误码。可以根据具体错误码判断具体错误原因。

iOS 中错误码的类为 `EMError`。

如：注册时用户返回已存在的错误可以这样检测：`EMError.code == EMErrorUserAlreadyExist`。

iOS 的错误码只有当操作出错的时候才会有返回值，否则返回 nil。

| 错误码<div style="width: 50px;"></div> | 错误信息               | 描述和可能原因                                               |
| :----- | :--------------------------------- | :----------------------------------------------------------- |
| 1      |           EMErrorGeneral            | 默认未区分类型的错误：SDK 内部未正确初始化或提示请求服务器时未识别出的具体原因。 |
| 2      |      EMErrorNetworkUnavailable      | 网络错误：无网络服务时会回调此错误，表示 SDK 与服务器的连接已断开。 |
| 3      |   EMErrorDatabaseOperationFailed    | 数据库操作失败：打开本地数据库失败。                         |
| 4      |      EMErrorExceedServiceLimit      | 超过服务限制：超过服务版本的数量限制，比如创建的用户 ID 数量超过上限。 |
| 5      |      EMErrorServiceArrearages       | 服务欠费，该错误码已废弃。                                   |
| 8      |      EMAppActiveNumbersReachLimitation       | 应用程序的日活跃用户数量（DAU）或月活跃用户数量（MAU）达到上限。                                 |
| 100    |        EMErrorInvalidAppkey         | App Key 不合法：用户的 App Key 格式不正确。                  |
| 101    |       EMErrorInvalidUsername        | 用户 ID 为空或不正确，比如使用邀请好友 API 时 username 参数为空字符。 |
| 102    |       EMErrorInvalidPassword        | 用户密码不正确：登录时提供的密码为空或不正确。               |
| 103    |          EMErrorInvalidURL          | URL 不正确，该错误码已废弃。                                 |
| 104    |          EMErrorInvalidToken        | 用户 token 不正确：登录时提供的 token 为空或不正确。                                |
| 105    |       EMErrorUsernameTooLong        | 用户名过长。                                                 |
| 200    |     EMErrorUserAlreadyLoginSame     | 当前用户已经登录：同一用户 ID 已经登录。                     |
| 201    |         EMErrorUserNotLogin         | 用户未登录：例如，如果未登录成功时调用发送消息或群组操作的 API 会提示该错误。 |
| 202    |   EMErrorUserAuthenticationFailed   | 用户鉴权失败：一般是 token 鉴权失败或者 token 已经过期。     |
| 203    |       EMErrorUserAlreadyExist       | 用户已经存在：注册的用户 ID 已存在。                         |
| 204    |         EMErrorUserNotFound         | 用户不存在：比如登录或者获取用户会话列表时用户 ID 不存在。   |
| 205    |     EMErrorUserIllegalArgument      | 用户参数不正确：比如创建用户 ID 时不符合格式要求，或者更新用户属性时用户参数为空等。 |
| 206    |   EMErrorUserLoginOnAnotherDevice   | 用户在其他设备登录：如果用户未开启多设备登录，当在其他设备登录时，会被强制从当前登录的设备下线，且收到该错误码。 |
| 207    |         EMErrorUserRemoved          | 用户已经被注销：如果登录用户 ID 被管理员从管理后台删除则会收到此错误。 |
| 208    |      EMErrorUserRegisterFailed      | 用户注册失败：注册用户 ID 时失败，比如未开启开放注册功能等原因。 |
| 209    |   EMErrorUpdateApnsConfigsFailed    | 更新推送配置错误：用户更新推送昵称，设置免推送配置时失败。   |
| 210    |     EMErrorUserPermissionDenied     | 用户无权限：例如，如果用户被封禁，发送消息时会提示该错误。   |
| 211    |  EMErrorUserBindDeviceTokenFailed   | 用户更新推送 token 错误，该错误码已废弃。                    |
| 212    | EMErrorUserUnbindDeviceTokenFailed  | 用户更新推送 token 错误，该错误码已废弃。                    |
| 213    |    EMErrorUserBindAnotherDevice     | 用户已经在另外设备登录：如果用户设置为先登录的设备优先，则后登录设备登录失败并提示该错误。该错误码已废弃。|
| 214    |   EMErrorUserLoginTooManyDevices    | 用户登录设备数超过限制：用户同一 ID 登录设备数量超过限制提示该错误。 |
| 215    |          EMErrorUserMuted           | 用户在群组聊天室中被禁言：用户被禁言后发送消息时提示该错误。 |
| 216    |  EMErrorUserKickedByChangePassword  | 用户密码更新：当前登录的用户密码被修改后，当前登录会断开并提示该错误。 |
| 217    |   EMErrorUserKickedByOtherDevice    | 用户被踢下线：未开启多设备登录，如果用户在其他设备上登录；或者开启多设备登录后，用户登录设备数量超过限制，则最新一台设备登录时会踢掉第一台设备，SDK 会提示该错误。 |
| 218    |   EMErrorUserAlreadyLoginAnother    | 其他用户已登录：其他用户已在当前环境下登录 SDK，当前用户不能再登录。 |
| 219    |       EMErrorUserMutedByAdmin       | 当前用户被管理员禁言，请联系管理员解除禁言。                 |
| 221    |           USER_NOT_FRIEND           | 非好友禁止发消息：开通非好友禁止发消息后，非好友间发消息提示此错误。该功能可在控制台开通。 |
| 300    |      EMErrorServerNotReachable      | 请求服务失败：发送或撤回消息时，如果 SDK 与消息服务器未保持连接，会返回该错误；操作群组、好友等请求时，如果因网络连接太差而不成功，也会返回该错误。 |
| 301    |        EMErrorServerTimeout         | 请求服务超时：调用 API 时服务器未在特定时间内响应。          |
| 302    |          EMErrorServerBusy          | 服务器忙碌：服务器当前忙碌，建议稍后重试。                   |
| 303    |      EMErrorServerUnknownError      | 服务请求的通用错误码：当请求服务器未成功时的默认错误，该错误发生情况较多，需要根据日志进一步排查。 |
| 304    |   EMErrorServerGetDNSConfigFailed   | 获取服务器配置信息错误：SDK 获取当前应用的服务器配置时失败。 |
| 305    |    EMErrorServerServingForbidden    | 当前 app 被禁用：app 因为某种原因被禁用。                    |
| 400    |         EMErrorFileNotFound         | 文件未找到：当用户获取不到日志文件或者下载附件失败时提示该错误。 |
| 401    |         EMErrorFileInvalid          | 文件异常：当上传消息附件或者群组共享文件时可能会提示该错误。 |
| 402    |       EMErrorFileUploadFailed       | 上传文件错误：上传消息附件失败。                             |
| 403    |      EMErrorFileDownloadFailed      | 下载文件错误：下载消息附件失败。                             |
| 404    |       EMErrorFileDeleteFailed       | 删除文件错误：通过 API 获取日志文件时会将旧的日志文件删除，如果删除失败提示该错误。 |
| 405    |         EMErrorFileTooLarge         | 文件太大：消息附件或群共享文件超过文件大小限制。             |
| 406    |     EMErrorFileContentImproper      | 文件内容不合规：发送消息上传附件失败时可能提示该错误。       |
| 500    |        EMErrorMessageInvalid        | 消息异常错误：如果构造的消息为空，或者消息 ID 为空，或者消息的发送方 ID 与当前登录 ID 不同则会提示该错误。 |
| 501    | EMErrorMessageIncludeIllegalContent | 消息含有非法内容：消息被过滤系统识别为非法消息。             |
| 502    |     EMErrorMessageTrafficLimit      | 消息限流：消息发送速度过快，建议降低频率或者减少消息内容。   |
| 503    |      EMErrorMessageEncryption       | 消息加密错误：该错误码已废弃。                               |
| 504    |    EMErrorMessageRecallTimeLimit    | 消息撤回超时错误：如果超过消息撤回允许的时间尝试撤回时提示该错误。 |
| 505    |       EMErrorServiceNotEnable       | 服务未开通：要使用的某些功能未开通。                         |
| 506    |        EMErrorMessageExpired        | 消息已过期：发送群组回执时超过了时间限制 (默认 3 天) 。      |
| 507    |   EMErrorMessageIllegalWhiteList    | 用户未在白名单中：群组或聊天室开启全员禁言时，若用户未在白名单中发送消息时提示该错误。 |
| 508    | EMErrorMessageExternalLogicBlocked  | 发送前回调拦截：消息发送前被服务器拦截。                     |
| 509    |    EMErrorMessageCurrentLimiting    | 单个用户 ID 发送消息超出频率限制。默认情况下，SDK 对单个用户 ID 发送群消息未做频率限制。如果你联系了环信商务设置了该限制，一旦在在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，则会提示该错误。 |
| 510    |    EMErrorMessageSizeLimit    | 发送消息时消息体大小超过上限。 |
| 600    |        EMErrorGroupInvalidId        | 群组 ID 异常：群组相关 API 传入的群组 ID 为空。              |
| 601    |      EMErrorGroupAlreadyJoined      | 已在该群组中：调用加入群组的 API 加入的用户已经在该群组中。  |
| 602    |        EMErrorGroupNotJoined        | 未加入该群组：在未加入的群组中发送消息或进行群组操作时提示该错误。 |
| 603    |    EMErrorGroupPermissionDenied     | 无权限的群组操作：没有权限进行群组操作，比如群组成员不能设置群组管理员。 |
| 604    |       EMErrorGroupMembersFull       | 群组已满：群组已经达到人数上限。                             |
| 605    |        EMErrorGroupNotExist         | 群组不存在：对不存在的群组进行操作。                         |
| 606    |   EMErrorGroupSharedFileInvalidId   | 共享文件 ID 为空：共享文件 ID 为空。                         |
| 609    |   EMErrorGroupMemberAttributesReachLimit   | 群组成员自定义属性个数达到上限。                         |
| 610    |   EMErrorGroupMemberAttributesUpdateFailed   | 设置群成员自定义属性失败。                        |
| 611    |   EMErrorGroupMemberAttributesKeyReachLimit   | 设置的群成员自定义属性 key 长度（不能超过 16 字节）超限。                        |
| 612    |   EMErrorGroupMemberAttributesValueReachLimit   | 设置的群成员自定义属性 value 长度（不能超过 512 字节）超限。  |
| 700    |      EMErrorChatroomInvalidId       | 聊天室 ID 异常：聊天室相关 API 传入的聊天室 ID 为空。        |
| 701    |    EMErrorChatroomAlreadyJoined     | 已在该聊天室中：调用加入聊天室的 API 添加的用户已经在该聊天室中。 |
| 702    |      EMErrorChatroomNotJoined       | 未加入该聊天室：用户在未加入的聊天室中发送消息或进行聊天室操作时提示该错误。 |
| 703    |   EMErrorChatroomPermissionDenied   | 无权限的聊天室操作：没有权限进行聊天室操作，比如聊天室成员不能设置聊天室管理员。 |
| 704    |     EMErrorChatroomMembersFull      | 聊天室已满：聊天室已经达到人数上限。                         |
| 705    |       EMErrorChatroomNotExist       | 聊天室不存在：要操作的聊天室不存在。                         |
| 900    |       EMErrorUserCountExceed        | 获取用户属性的用户个数超过 100。                             |
| 901    |   EMErrorUserInfoDataLengthExceed   | 设置的用户属性太长。单个用户的所有属性数据不能超过 2 KB，单个 app 所有用户属性数据不能超过 10 GB。 |
| 903    |    EMErrorTranslateParamInvalid     | 调用翻译方法传入的参数无效，请检查传参。                     |
| 904    |        EMErrorTranslateFail         | 翻译服务接口返回错误。                                       |
| 905    |       EMErrorTranslateNotInit       | 翻译服务未初始化。                                           |
| 1000   |       EMErrorContactAddFailed       | 添加联系人失败。                                             |
| 1001   |      EMErrorContactReachLimit       | 邀请者联系人数量已经达到上限。                               |
| 1002   |    EMErrorContactReachLimitPeer     | 受邀请者联系人达到上限。                                     |
| 1100   |     EMErrorPresenceParamExceed      | 调用 Presence 相关方法时参数长度超出限制。                   |
| 1101   | EMErrorPresenceCannotSubscribeSelf  | 不能订阅你自己的状态。                                       |
| 1110   |     EMErrorTranslateParamError      | 翻译参数错误。                                               |
| 1111   |  EMErrorTranslateServiceNotEnabled  | 翻译服务未启用。                                             |
| 1112   |     EMErrorTranslateUsageLimit      | 翻译用量达到上限。                                           |
| 1113   |     EMErrorTranslateServiceFail     | 获取翻译服务失败。          |
| 1200   |     EMErrorModerationFailed           | 第三方内容审核服务的消息审核结果为“拒绝”。 |
| 1299   |     EMErrorThirdServiceFailed        | 除第三方内容审核服务的其他服务的消息审核结果为“拒绝”。 |
| 1300   |     EMErrorReactionReachLimit      | Reaction 数量已达到限制。           |
| 1301   |   EMErrorReactionHasBeenOperated    | Reaction 重复添加。                                          |
| 1302   |  EMErrorReactionOperationIsIllegal  | 没有操作权限：用户对该 Reaction 没有操作权限。例如没有添加过该 Reaction 的用户进行删除操作，或者单聊消息非发送者和非接受者进行添加 Reaction 操作。 |
| 1400   |  EMErrorThreadNotExist        | 未找到该子区，该子区不存在。                                 |
| 1401   |        EMErrorThreadAlreadyExist         | 该消息 ID 下子区已存在，重复添加子区。                       |
| 1402   |    EMErrorThreadCreateMessageIllegal    | 创建子区的消息无效：创建子区时父消息被撤回了，或者无法使用。 |