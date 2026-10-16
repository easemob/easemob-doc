# 错误码

本文介绍环信即时通讯 HarmonyOS SDK 中接口调用或事件返回的错误码。开发者可以根据错误码判断失败原因，并参考对应的解决方法进行处理。

HarmonyOS SDK 的错误码定义在 `ChatError` 类中。例如，登录失败时可通过 `ChatError.INVALID_TOKEN` 或 `ChatError.TOKEN_EXPIRED` 判断 Token 是否无效或已过期。

示例：

```typescript
ChatClient.getInstance().loginWithToken(userId, token)
    .then((): void => {
        // 登录成功。
    })
    .catch((error: ChatError): void => {
        if (error.errorCode === ChatError.INVALID_TOKEN
            || error.errorCode === ChatError.TOKEN_EXPIRED) {
            // 获取新的 Token 后重新登录。
        } else {
            // 根据 error.errorCode 和 error.description 处理其他错误。
        }
    });
```

## 通用、校验与连接

### 通用

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 0 | `EM_NO_ERROR` | 操作成功。 |  |
| 1 | `GENERAL_ERROR` | SDK 或请求相关的默认错误，未区分具体错误类型。例如，SDK 未正确初始化，或者请求服务器失败但未识别出具体原因。 | 结合 SDK 日志和调用的 API 进行分析。 |
| 2 | `NETWORK_ERROR` | 网络错误。设备无网络服务时可能返回该错误，表示 SDK 与服务器的连接已断开。 | 检查设备网络；网络恢复后重新操作。 |
| 3 | `DATABASE_ERROR` | 本地数据库操作失败，例如数据库未打开，或者尝试更新本地不存在的消息。 | 检查数据库打开状态、调用参数和 SDK 日志。 |
| 4 | `EXCEED_SERVICE_LIMIT` | 超过当前服务版本的数量或调用频率限制。例如，创建的用户数量超过服务限制，或者用户属性相关 API 超过频率限制。 | 检查所调用 API 的限制。若由限流导致，请稍后重试。用户属性限制详见 [管理用户属性](userprofile.html)。 |
| 7 | `PARTIAL_SUCCESS` | 请求整体成功，但部分操作失败，例如批量设置多个参数时仅部分设置成功。 | 根据接口返回的数据和 SDK 日志确认失败项，并按需重试。 |
| 8 | `APP_ACTIVE_NUMBER_REACH_LIMITATION` | 应用的日活跃用户数量（DAU）或月活跃用户数量（MAU）达到上限。 | 在 [环信控制台](https://console.easemob.com/user/login) 升级 IM 服务。 |
| 302 | `SERVER_BUSY` | 服务器繁忙。 | 避免在上一次请求返回前重复调用 API，并稍后重试。 |
| 303 | `SERVER_UNKNOWN_ERROR` | 服务请求的通用错误。请求服务器失败但未识别出具体原因时可能返回该错误。 | 结合 SDK 日志和调用的 API 进一步排查。 |

### 校验

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 100 | `INVALID_APP_KEY` | App Key 不合法或格式不正确。 | 在 [环信控制台](https://console.easemob.com/user/login) 的 **应用列表** 页面确认 App Key，并使用正确的 App Key 初始化 SDK。 |
| 101 | `INVALID_USER_NAME` | 用户 ID 不正确，例如用户 ID 为空。 | 检查调用 API 时传入的用户 ID。 |
| 102 | `INVALID_PASSWORD` | 用户密码为空或不正确。该常量为兼容保留；HarmonyOS SDK 5.x 不再支持密码登录。 | HarmonyOS SDK 5.x 应使用用户 ID 和 Token 登录。 |
| 104 | `INVALID_TOKEN` | 用户 Token 为空或不正确。 | 检查调用 API 时传入的 Token。 |
| 105 | `USER_NAME_TOO_LONG` | 用户 ID 过长。用户 ID 不能超过 64 字节。 | 缩短用户 ID 后重试。 |
| 106 | `CHANNEL_SYNC_NOT_OPEN` | 未开通服务端会话列表功能。 | 在 [环信控制台](/product/console/basic_conversation_group_chatroom.html#服务端会话列表) 开通服务端会话列表功能。 |
| 107 | `INVALID_CONVERSATION` | 会话无效。 | 检查会话 ID、会话类型及会话是否存在。 |
| 110 | `INVALID_PARAM` | 参数无效。 | 检查调用 API 时传入的参数是否符合要求。 |
| 111 | `OPERATION_UNSUPPORTED` | 当前操作不受支持。 | 检查当前 SDK 版本、消息或会话类型是否支持该操作。 |
| 112 | `QUERY_PARAM_REACHES_LIMIT` | 查询参数超过限制。 | 根据 API 的参数限制减少查询数量或缩小查询范围。 |

### 连接

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 108 | `TOKEN_EXPIRED` | 用户 Token 已过期。 | 从应用服务器获取新 Token，并重新调用 `ChatClient#loginWithToken` 登录。 |
| 109 | `TOKEN_WILL_EXPIRE` | 用户 Token 即将过期。 | 从应用服务器获取新 Token，并调用 `ChatClient#renewToken` 更新 Token。 |
| 200 | `USER_ALREADY_LOGIN` | 当前用户已登录。 | 检查是否已调用登录方法，避免重复登录。 |
| 201 | `USER_NOT_LOGIN` | 当前用户未登录。例如，登录成功前发送消息或调用群组相关 API 时可能返回该错误。 | 完成 IM 登录后重新操作。 |
| 202 | `USER_AUTHENTICATION_FAILED` | 用户鉴权失败。使用用户 ID 和 Token 登录时，通常表示用户 ID 或 Token 无效或已过期。 | 检查用户 ID；重新生成 Token 后再次登录。 |
| 203 | `USER_ALREADY_EXIST` | 用户 ID 已存在。该常量为兼容保留；HarmonyOS SDK 5.x 不再提供客户端注册 API。 | 通过应用服务器注册账号，并使用其他用户 ID。 |
| 204 | `USER_NOT_FOUND` | 用户不存在。例如，登录或获取服务端会话列表时，用户 ID 不存在。 | 检查调用 API 时传入的用户 ID。 |
| 205 | `USER_ILLEGAL_ARGUMENT` | 用户相关参数不合法，例如用户 ID 为空或无效。 | 检查调用 API 时传入的参数。 |
| 206 | `USER_LOGIN_ANOTHER_DEVICE` | 当前用户在其他设备登录。在单设备登录场景中，其他设备登录后，当前设备可能被踢下线。 | `ConnectionListener#onLogout` 会返回该错误码。收到事件后返回登录页面，并按业务需要重新登录。 |
| 207 | `USER_REMOVED` | 当前登录用户已从服务端删除。 | `ConnectionListener#onLogout` 会返回该错误码。该账号已不可用，应返回登录页面。 |
| 208 | `USER_REG_FAILED` | 用户注册失败。该常量为兼容保留；HarmonyOS SDK 5.x 不再提供客户端注册 API。 | 由应用服务器注册账号。账号注册说明详见 [开放注册功能](/document/server-side/account_register_open.html)。 |
| 209 | `USER_UPDATEINFO_FAILED` | 更新用户信息或推送配置失败。 | 检查调用参数和网络状态，稍后重试。 |
| 210 | `USER_PERMISSION_DENIED` | 用户无操作权限。例如，用户被加入黑名单后发送消息，或者修改其他用户发送的消息。 | 检查当前用户是否具有相应操作权限。 |
| 213 | `USER_BIND_ANOTHER_DEVICE` | 单设备登录场景中采用先登录设备优先策略时，当前账号已在其他设备登录。 | 在其他设备退出该账号，或调整多设备登录策略后重试。 |
| 214 | `USER_LOGIN_TOO_MANY_DEVICES` | 用户登录设备数超过限制。 | 退出不再使用的设备，或提升同时在线设备数上限。 |
| 215 | `USER_MUTED` | 用户在群组或聊天室中被禁言。 | 禁止当前用户在对应群组或聊天室中发送消息，并在 UI 上提示。 |
| 216 | `USER_KICKED_BY_CHANGE_PASSWORD` | 当前用户的密码已修改，导致当前连接退出。 | `ConnectionListener#onLogout` 会返回该错误码。收到事件后返回登录页面，并使用有效凭证重新登录。 |
| 217 | `USER_KICKED_BY_OTHER_DEVICE` | 当前用户在其他设备被强制退出，导致当前设备下线。 | `ConnectionListener#onLogout` 会返回该错误码。收到事件后返回登录页面。 |
| 218 | `USER_ALREADY_LOGIN_ANOTHER` | 当前设备已有其他用户登录。 | 先调用 `ChatClient#logout` 退出当前账号，再登录其他账号。 |
| 219 | `USER_MUTED_BY_ADMIN` | 当前用户被管理员全局禁言。 | 禁止当前用户发送消息，并在 UI 上提示。 |
| 220 | `USER_DEVICE_CHANGED` | 当前登录设备与上次登录设备不一致。 | 根据 `ConnectionListener#onLogout` 返回的错误码处理异常登出，并按业务需要重新登录。 |
| 221 | `USER_NOT_ON_ROSTER` | 已开启好友关系检查，当前用户与消息接收方不是好友。 | 先通过 `ContactManager#addContact` 发起好友申请，对方同意后再发送消息。好友关系检查配置详见 [环信控制台](/product/console/basic_user.html#好友关系检查)。 |
| 300 | `SERVER_NOT_REACHABLE` | 服务器不可达。例如，SDK 与消息服务器未保持连接时发送或撤回消息，或者因网络不稳定导致群组、好友等请求失败。 | 检查设备网络及域名访问情况，切换网络或稍后重试。 |
| 301 | `SERVER_TIMEOUT` | 等待服务器响应超时。 | 检查设备网络，切换网络或稍后重试。 |
| 304 | `SERVER_GET_DNSLIST_FAILED` | 获取服务器配置信息失败。 | 检查网络和 DNS 配置。若关闭了 DNS 配置获取，还需确认已正确配置 IM 和 REST 服务器地址。 |
| 305 | `SERVER_SERVICE_RESTRICTED` | 当前应用或账号的 IM 服务被限制。 | 在环信控制台检查服务状态，或联系环信商务。 |
| 306 | `SERVER_DECRYPTION_FAILED` | 服务端传输数据解密失败。 | 结合 SDK 日志排查；若持续出现，请联系环信技术支持。 |
| 309 | `SERVER_RESPONSE_ILLEGAL` | 服务端返回的数据格式不合法。 | 结合 SDK 日志排查；若持续出现，请联系环信技术支持。 |
| 350 | `CONNECTION_TIMEOUT` | 连接服务器超时。 | 检查设备网络；若网络正常，请稍后重新登录。 |
| 351 | `CONNECTION_DNS_ERROR` | 连接服务器时发生 DNS 错误。 | 检查设备网络和 DNS 配置；若网络正常，请稍后重新登录。 |
| 352 | `CONNECTION_IO_ERROR` | 连接服务器时发生 IO 错误。 | 检查设备网络；若网络正常，请稍后重新登录。 |
| 353 | `CONNECTION_STREAM_CLOSED` | 连接服务器时数据流被关闭。 | 检查设备网络；若网络正常，请稍后重新登录。 |
| 354 | `CONNECTION_PROVISION_TIMEOUT` | 连接服务器时认证超时。 | 检查设备网络；若网络正常，请稍后重新登录。 |

## 消息

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 400 | `FILE_NOT_FOUND` | 文件未找到。例如，获取日志文件或下载消息附件失败时可能返回该错误。 | 若获取日志文件失败，可重新获取；若下载附件失败，检查附件是否仍在有效期内。 |
| 401 | `FILE_INVALID` | 文件无效。例如，上传消息附件或群组共享文件时，文件路径或内容不可用。 | 重新选择有效文件后上传。 |
| 402 | `FILE_UPLOAD_FAILED` | 文件上传失败。 | 检查网络、文件路径和 SDK 日志后重试。 |
| 403 | `FILE_DOWNLOAD_FAILED` | 文件下载失败。 | 检查网络以及文件是否已过期，并结合 SDK 日志排查。 |
| 404 | `FILE_DELETE_FAILED` | 文件删除失败。例如，SDK 生成新日志文件前删除旧日志文件失败。 | 检查应用是否具有对应文件的访问和删除权限。 |
| 405 | `FILE_TOO_LARGE` | 消息附件或群组共享文件超过大小限制。 | 选择符合大小限制的文件，或联系环信商务提升文件大小上限。 |
| 406 | `FILE_CONTENT_IMPROPER` | 消息附件或群组共享文件内容不合规。 | 选择合规文件后重新发送或上传。 |
| 407 | `FILE_IS_EXPIRED` | 消息附件或群组共享文件已过期。文件默认存储 7 天。 | 使用有效文件；如需延长存储时间，请联系环信商务。 |
| 408 | `FILE_DURATION_TOO_LONG` | 语音文件时长超过限制。 | 缩短语音文件时长后重试。 |
| 409 | `FILE_VOICE_TO_TEXT_FAILED` | 语音转文字失败。 | 检查语音文件是否有效，并结合 SDK 日志排查。 |
| 500 | `MESSAGE_INVALID` | 消息无效。例如，消息对象、消息 ID 或消息体无效，或者消息发送方与当前登录用户不一致。 | 检查消息构造过程、消息 ID、发送方和消息体。 |
| 501 | `MESSAGE_INCLUDE_ILLEGAL_CONTENT` | 消息包含非法或敏感内容，被内容过滤系统拦截。 | 修改消息内容后重试，并在环信控制台查看拦截记录。 |
| 502 | `MESSAGE_SEND_TRAFFIC_LIMIT` | 消息发送过快，触发限流。 | 降低消息发送频率后重试。 |
| 504 | `MESSAGE_RECALL_TIME_LIMIT` | 消息撤回已超过时间限制。 | 在 UI 上提示撤回失败，或在 [环信控制台延长消息可撤回时间](/product/console/basic_message.html#消息撤回)。最长可设置为 7 天。 |
| 505 | `SERVICE_NOT_ENABLED` | 当前操作所需的服务未开通。 | 根据调用的 API 确认所需服务，并在环信控制台开通。 |
| 506 | `MESSAGE_EXPIRED` | 消息已过期。例如，发送群消息已读回执时超过有效期（默认 3 天）。 | 在 UI 上提示操作失败；如需延长群消息回执有效期，请联系环信商务。 |
| 507 | `MESSAGE_ILLEGAL_WHITELIST` | 群组或聊天室开启全员禁言，且当前用户不在白名单中。 | 在 UI 上提示无发送权限，或检查全员禁言和白名单设置。 |
| 508 | `MESSAGE_EXTERNAL_LOGIC_BLOCKED` | 消息被应用服务端配置的发送前回调规则拦截。 | 检查发送前回调记录和业务规则。 |
| 509 | `MESSAGE_CURRENT_LIMITING` | 单个用户发送消息的频率超过服务端设置的上限。 | 降低消息发送频率，并检查相关限流配置。 |
| 510 | `MESSAGE_SIZE_LIMIT` | 消息体大小超过上限。 | 减小消息体。默认消息体不能超过 5 KB。 |
| 511 | `MESSAGE_EDIT_FAILED` | 消息修改失败。 | 结合调用参数和 SDK 日志排查。 |
| 512 | `MESSAGE_STREAM_INTERVAL_TIMEOUT` | 流式消息相邻分片的发送间隔超过 30 秒，流式消息已终止。 | 缩短消息分片的发送间隔。 |
| 513 | `MESSAGE_STREAM_TIMEOUT` | 流式消息的发送总时长超过 30 分钟。 | 在规定时长内完成流式消息发送。 |

## 群组

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 600 | `GROUP_INVALID_ID` | 群组 ID 无效，例如群组 ID 为空。 | 检查调用 API 时传入的群组 ID。 |
| 601 | `GROUP_ALREADY_JOINED` | 当前用户已加入该群组。 | 可按加入群组成功处理，无需重复加入。 |
| 602 | `GROUP_NOT_JOINED` | 当前用户未加入该群组。 | 检查群组 ID、群组是否已解散，以及当前用户是否已加入。 |
| 603 | `GROUP_PERMISSION_DENIED` | 当前用户无群组操作权限。例如，普通群成员设置群管理员时会返回该错误。 | 检查当前用户的群组角色和操作权限。 |
| 604 | `GROUP_MEMBERS_FULL` | 群组成员数已达到上限。 | 在 UI 上提示群组已满，或提升群成员数上限。 |
| 605 | `GROUP_SHARED_FILE_INVALIDID` | 群组共享文件 ID 无效。 | 检查下载或删除共享文件时传入的共享文件 ID。 |
| 606 | `GROUP_NOT_EXIST` | 群组不存在。 | 检查群组 ID，确认群组未被解散。 |
| 607 | `GROUP_DISABLED` | 群组已被禁用。 | 在 UI 上提示，并联系群管理员或环信技术支持。 |
| 608 | `GROUP_NAME_VIOLATION` | 群组名称不合规。 | 检查群组名称是否包含敏感或违规内容。 |
| 609 | `GROUP_MEMBER_ATTRIBUTES_REACH_LIMIT` | 单个群成员的自定义属性总长度超过上限。 | 将单个群成员的自定义属性总长度控制在 4 KB 以内。 |
| 610 | `GROUP_MEMBER_ATTRIBUTES_UPDATE_FAILED` | 设置群成员自定义属性失败。 | 检查调用参数、操作权限和 SDK 日志。 |
| 611 | `GROUP_MEMBER_ATTRIBUTES_KEY_REACH_LIMIT` | 群成员自定义属性的 key 超过 16 字节。 | 缩短属性 key 后重试。 |
| 612 | `GROUP_MEMBER_ATTRIBUTES_VALUE_REACH_LIMIT` | 群成员自定义属性的 value 超过 512 字节。 | 缩短属性 value 后重试。 |
| 613 | `GROUP_USER_IN_BLOCKLIST` | 当前用户在群组黑名单中。例如，黑名单中的用户加入群组时可能返回该错误。 | 检查群组黑名单，并按业务需要将用户移出黑名单。 |

## 聊天室

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 700 | `CHATROOM_INVALID_ID` | 聊天室 ID 无效，例如聊天室 ID 为空。 | 检查调用 API 时传入的聊天室 ID。 |
| 701 | `CHATROOM_ALREADY_JOINED` | 当前用户已加入该聊天室。 | 可按加入聊天室成功处理，无需重复加入。 |
| 702 | `CHATROOM_NOT_JOINED` | 当前用户未加入该聊天室。 | 检查聊天室 ID、聊天室是否已解散，以及当前用户是否已加入。 |
| 703 | `CHATROOM_PERMISSION_DENIED` | 当前用户无聊天室操作权限。例如，普通成员设置聊天室管理员时会返回该错误。 | 检查当前用户的聊天室角色和操作权限。 |
| 704 | `CHATROOM_MEMBERS_FULL` | 聊天室成员数已达到上限。 | 在 UI 上提示聊天室已满，或提升聊天室成员数上限。 |
| 705 | `CHATROOM_NOT_EXIST` | 聊天室不存在。 | 检查聊天室 ID，确认聊天室未被解散。 |
| 706 | `CHATROOM_OWNER_NOT_ALLOW_LEAVE` | 初始化时不允许聊天室所有者离开，聊天室所有者调用 `ChatroomManager#leaveChatroom` 时返回该错误。 | 检查 SDK 初始化时 `ChatOptions#allowChatroomOwnerLeave` 的设置。 |
| 707 | `CHATROOM_USER_IN_BLOCKLIST` | 当前用户在聊天室黑名单中。例如，黑名单中的用户加入聊天室时可能返回该错误。 | 检查聊天室黑名单，并按业务需要将用户移出黑名单。 |

## 用户属性

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 900 | `USERINFO_USERCOUNT_EXCEED` | 单次获取用户属性的用户数超过 100。 | 每次最多查询 100 个用户，超过时分批获取。 |
| 901 | `USERINFO_DATALENGTH_EXCEED` | 用户属性数据超过限制。单个用户的所有属性数据不能超过 2 KB，单个应用的全部用户属性数据不能超过 10 GB。 | 减少待设置的用户属性数据。 |

## 好友

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 1000 | `CONTACT_ADD_FAILED` | 添加好友失败。 | 结合调用参数、错误描述和 SDK 日志分析。 |
| 1001 | `CONTACT_REACH_LIMIT` | 发起好友申请的用户，其好友数量已达到上限。 | 在 UI 上提示，或在 [环信控制台提升用户的好友数上限](/product/console/basic_user.html#单个用户好友数上限)。 |
| 1002 | `CONTACT_REACH_LIMIT_PEER` | 接收好友申请的用户，其好友数量已达到上限。 | 在 UI 上提示，或在 [环信控制台提升用户的好友数上限](/product/console/basic_user.html#单个用户好友数上限)。 |

## 翻译

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 1110 | `TRANSLATE_PARAM_INVALID` | 翻译参数无效。 | 结合 SDK 日志检查翻译 API 的参数。 |
| 1111 | `TRANSLATE_SERVICE_NOT_ENABLE` | 翻译服务未启用。 | 在 [环信控制台](https://console.easemob.com/user/login) 开启翻译服务。 |
| 1112 | `TRANSLATE_USAGE_LIMIT` | 翻译用量达到上限。 | 联系环信商务增加翻译用量。 |
| 1113 | `TRANSLATE_MESSAGE_FAIL` | 消息翻译失败。 | 结合 SDK 日志排查翻译失败原因。 |

## 内容审核

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 1200 | `MODERATION_FAILED` | 第三方内容审核服务的消息审核结果为“拒绝”。 | 在 [环信控制台](https://console.easemob.com/user/login) 查看内容审核配置和记录。 |
| 1299 | `THIRD_SERVER_FAILED` | 除第三方内容审核之外的其他审核服务的消息审核结果为“拒绝”。 | 在 [环信控制台](https://console.easemob.com/user/login) 查看内容审核配置和记录。 |

## 消息表情回复（Reaction）

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 1300 | `REACTION_REACH_LIMIT` | 该消息的 Reaction 数量已达到上限。 | 在 UI 上提示，或联系环信商务提升单条消息的 Reaction 数量上限。 |
| 1301 | `REACTION_HAS_BEEN_OPERATED` | 当前用户已添加该 Reaction，不能重复添加。 | 可按添加 Reaction 成功处理。 |
| 1302 | `REACTION_OPERATION_IS_ILLEGAL` | 当前用户无权操作该 Reaction。例如，未添加该 Reaction 的用户尝试删除，或者既非单聊消息发送方也非接收方的用户尝试添加 Reaction。 | 检查当前用户、消息和 Reaction 参数是否正确。 |


## 离线推送

| 错误码 | 错误信息 | 描述和可能原因 | 解决方法 |
| :--- | :--- | :--- | :--- |
| 1500 | `PUSH_NOT_SUPPORT` | 当前设备不支持已配置的第三方推送。 | 查看 [离线推送概述](/document/harmonyos/push/push_overview.html)，检查 HarmonyOS 推送配置；若当前设备不受支持，请联系环信商务。 |
| 1501 | `PUSH_BIND_FAILED` | 将推送 Token 绑定到服务器失败。 | 检查网络和推送配置，确认无误后调用 `PushManager#uploadPushToken` 重新绑定。绑定失败时，`PushListener#onError` 也会返回错误信息。 |
| 1502 | `PUSH_UNBIND_FAILED` | 解除推送 Token 绑定失败。 | 检查网络和推送配置后重试。若需要确保退出登录，可调用 `ChatClient#logout(false)` 暂不解绑推送 Token。 |
