# 错误码

本文介绍环信即时通讯 IM Web SDK 中接口调用失败时可能返回的错误码。业务侧可根据错误对象中的 `code`、`message`，以及 `details` 中的服务端信息判断具体失败原因。

对于大多数 API，调用失败时 SDK 会抛出错误对象。建议在 `try...catch` 中优先根据 `error.code` 和 `error.message` 处理；若错误对象中包含 `details.serverCode` 或 `details.canonicalCode`，可用于排障。

示例代码如下：

```typescript
try {
  const message = client.chatManager.createTextMessage({
    conversationId: 'user_1',
    conversationType: 'singleChat',
    content: 'hello',
  });

  await client.chatManager.sendMessage(message);
} catch (error: any) {
  console.log('错误码:', error.code);
  console.log('错误信息:', error.message);
  console.log('服务端错误码:', error.details?.serverCode);
  console.log('canonicalCode:', error.details?.canonicalCode);
}
```

:::tip
同一个公开错误码可能对应多个错误信息或触发场景。业务处理逻辑建议优先按 `error.code` 判断，`error.message` 和 `details` 可用于展示、日志记录和问题排查。
:::

## 通用、校验与连接

### 通用

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 1 | `CONNECTION_NOT_CREATED` / `CONNECTION_CANCELLED` / `MESSAGE_SENDER_DESTROYED` / `UPLOAD_ABORTED` / `UNKNOWN` | 通用错误。常见原因包括连接对象尚未创建、请求被取消、消息发送器已销毁、上传被取消，或 SDK 无法进一步归类的未知错误。 | 检查调用时机、对象生命周期和当前连接状态；若属于临时异常，可稍后重试。 |
| 2 | `COMBINE_DOWNLOAD_FAILED` / `REST_NETWORK_ERROR` | 网络请求失败，或合并消息下载失败。 | 检查网络、登录态、服务地址和资源地址后重试。 |
| 3 | `STORAGE_OPERATION_FAILED` | 本地存储操作失败，例如当前运行环境不支持对应存储能力、权限受限或空间不足。 | 检查浏览器或小程序运行环境的本地存储权限、容量和可用状态。 |
| 4 | `COMBINE_LEVEL_EXCEEDED` / `COMBINE_ITEM_LIMIT_EXCEEDED` / `SERVICE_LIMIT_EXCEEDED` | 达到服务限制。常见场景包括合并消息层级或条数超限、请求频率超限、服务配额超限、黑名单或属性数量达到上限、DAU/MAU 或在线人数达到上限等。 | 根据 `error.message` 或 `details` 确认具体限制项，减少单次请求规模或调用频率；若为服务配额限制，需联系商务提升配额。 |
| 302 | `SERVER_BUSY` | 服务端繁忙。 | 稍后重试；若持续出现，联系技术支持排查服务端状态。 |
| 303 | `MESSAGE_SEND_FAILED` / `STREAM_SEND_NOT_SUPPORTED` / `REST_HTTP_ERROR` / `REST_BUSINESS_UNKNOWN` | 消息发送失败、当前运行环境不支持流式发送，或 REST 请求返回未归一化的业务错误。 | 检查接口参数、当前连接状态、运行环境能力和服务端返回信息；必要时稍后重试或联系技术支持。 |

### 校验

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 100 | `UPLOAD_INVALID_APPKEY` | 上传时使用的 `appKey` 无效。 | 检查 SDK 初始化时传入的 `appKey` 是否正确。 |
| 107 | `INVALID_CONVERSATION` | 会话参数无效。 | 检查 `conversationId` 和 `conversationType` 是否正确，`conversationType` 应使用 Web SDK 支持的取值。 |
| 110 | `VALIDATION_REQUIRED` / `VALIDATION_INVALID_FORMAT` / `VALIDATION_UNKNOWN` / `COMBINE_INVALID_INPUT` / `UPLOAD_REQUIRED_FIELD_MISSING` | 参数缺失、参数格式非法、合并消息输入不合法，或上传缺少必填字段。 | 对照对应 API 的参数说明补齐必填字段，并检查字段类型、取值范围和格式。 |
| 111 | `OPERATION_UNSUPPORTED` | 当前操作或当前消息类型不支持该能力。 | 改用 Web SDK 支持的能力，或调整调用场景。 |
| 112 | `QUERY_PARAM_REACHES_LIMIT` | 删除历史消息时，单次删除的消息数量超过限制。 | 减少单次删除的消息数量后重试。 |
| 204 | `CONTACT_ADD_USER_NOT_FOUND` / `CONTACT_BLOCKLIST_USER_NOT_FOUND` | 目标用户不存在。 | 检查 `userId` 是否正确，并确认目标用户已注册。 |
| 221 | `USER_NOT_ON_ROSTER` | 当前用户与目标用户不是好友，或目标用户不在当前操作允许的关系范围内。 | 先建立好友关系，或检查控制台/服务端的关系限制配置。 |
| 223 | `CONTACT_SET_REMARK_NOT_FRIEND` | 给非好友设置备注。 | 先确认对方已是好友，再设置好友备注。 |

### 连接

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 108 | `AUTH_TOKEN_EXPIRED` | 用户 Token 已过期。 | 重新获取用户 Token 后调用 `renewToken` 续期；若连接已断开，重新调用 `login` 登录。 |
| 200 | `AUTH_ALREADY_LOGIN` | 当前 SDK 实例已登录，重复调用登录接口。 | 避免重复登录；如需切换账号，先调用 `logout` 登出，再使用新用户登录。 |
| 201 | `AUTH_NOT_LOGIN` | 当前用户未登录，或登录态不可用。 | 先完成登录并确认连接状态正常，再调用相关 API。 |
| 202 | `AUTH_UNAUTHORIZED` / `CONNECTION_PROVISION_REJECTED` | 鉴权失败。可能是 Token 无效、Token 与用户不匹配、签名错误、用户不存在，或连接鉴权被服务端拒绝。 | 检查 `appKey`、`userId`、Token 和用户状态；必要时重新获取 Token 后登录。 |
| 206 | `USER_LOGIN_ANOTHER_DEVICE` | 用户在其他设备登录，当前设备被踢下线。多设备互踢策略与服务端多设备配置有关。 | 根据业务提示用户当前账号已在其他设备登录；如需支持多设备同时在线，需确认多设备策略配置。详见 [多设备文档](multi_device.html)。 |
| 207 | `USER_REMOVED` | 当前登录用户已被删除或注销。 | 提示用户账号不可用，并在服务端或控制台确认账号状态。 |
| 210 | `AUTH_FORBIDDEN` / `CONTACT_ADD_BLOCKED_BY_USER` | 当前用户无权限执行操作，或被对方拉黑/禁止添加。 | 检查当前账号权限、好友关系、黑名单状态以及相关服务开通状态。 |
| 213 | `AUTH_BIND_ANOTHER_DEVICE` | 当前登录态绑定到其他设备，或设备绑定关系不符合当前登录策略。 | 检查多设备登录策略、设备 ID 和设备绑定关系。 |
| 214 | `AUTH_LOGIN_TOO_MANY_DEVICES` | 用户登录设备数超过限制。 | 减少在线设备数，或联系商务提升可同时在线设备数。 |
| 215 | `AUTH_USER_MUTED` | 用户被禁言，无法执行相关发送操作。 | 等待禁言解除，或联系管理员处理。 |
| 216 | `USER_KICKED_BY_CHANGE_PASSWORD` | 用户修改密码后，当前登录态失效并被踢下线。 | 提示用户密码已修改，重新获取 Token 后登录。 |
| 217 | `USER_KICKED_BY_OTHER_DEVICE` | 开启多设备服务后，用户在其他设备上调用 API 或通过控制台将当前设备强制退出。 | 提示用户当前设备已被强制退出；如需继续使用，重新登录。 |
| 218 | `USER_ALREADY_LOGIN_ANOTHER` | 用户已在其他设备登录，当前登录策略不允许继续登录。 | 根据业务策略提示用户退出其他设备，或调整多设备配置。 |
| 219 | `USER_MUTED_BY_ADMIN` | 用户被管理员全局禁言。 | 提示用户已被禁言，等待解禁或联系管理员。 |
| 220 | `USER_DEVICE_CHANGED` | 当前登录设备与预期设备不一致，或设备标识发生变化。 | 检查自动登录、多设备策略和设备标识配置；必要时重新登录。 |
| 300 | `CONNECTION_WEBSOCKET_ERROR` / `CONNECTION_CLOSED_BEFORE_READY` / `CONNECTION_PROVISION_CLOSED` / `MESSAGE_NOT_CONNECTED` | WebSocket 连接失败、连接尚未就绪即关闭，或发送消息时未连接。 | 等待连接成功后重试，并检查网络、连接状态和服务地址配置。 |
| 301 | `CONNECTION_TIMEOUT` / `CONNECTION_PROVISION_TIMEOUT` / `MESSAGE_ACK_TIMEOUT` / `MESSAGE_ACK_MISSING` / `REST_TIMEOUT` / `UPLOAD_TIMEOUT` | 请求、连接鉴权、消息 ACK、REST 请求或上传超时。 | 检查网络环境后重试；若频繁出现，检查服务配置和客户端超时策略。 |
| 304 | `CONNECTION_DNSLIST_FAILED` | 获取服务器地址配置失败。 | 检查网络、`appKey`、DNS 配置和服务可用性。 |
| 305 | `SERVER_SERVING_DISABLED` | 服务被禁用或当前能力不可用。 | 检查是否已开通对应服务；如需使用该能力，请在控制台开通或联系商务。 |

## 消息

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 400 | `ATTACHMENT_NOT_FOUND` | 附件不存在，可能是附件地址、文件 ID 或资源已失效。 | 检查附件地址、文件 ID 或资源是否仍存在。 |
| 401 | `ATTACHMENT_INVALID` | 附件无效，可能是附件元数据、文件格式或下载参数不合法。 | 检查附件元数据、文件格式和下载参数。 |
| 402 | `COMBINE_UPLOAD_FAILED` / `UPLOAD_REQUEST_FAILED` | 合并消息上传失败，或普通附件上传请求失败。 | 检查文件、网络、上传权限和上传适配器配置后重试。 |
| 403 | `FILE_DOWNLOAD_FAILED` | 文件下载失败，可能是网络异常、鉴权失败或下载地址无效。 | 检查网络、登录态和下载地址后重试。 |
| 405 | `FILE_TOO_LARGE` / `UPLOAD_SIZE_EXCEEDED` | 文件大小超过限制。 | 压缩文件或更换更小的文件后重试。 |
| 406 | `FILE_CONTENT_IMPROPER` | 文件内容不合规。 | 更换合规文件内容后重试。 |
| 407 | `ATTACHMENT_EXPIRED` / `VOICE_TO_TEXT_FILE_INVALID` | 附件已过期，或语音转文字输入文件无效。 | 重新上传附件，或更换有效的语音文件。 |
| 408 | `VOICE_TO_TEXT_FILE_DURATION_TOO_LONG` | 语音时长超过语音转文字服务限制。 | 缩短语音时长后重试。 |
| 409 | `VOICE_TO_TEXT_FAILED` | 语音转文字失败，可能是服务异常或语音文件质量不满足识别要求。 | 稍后重试，或检查语音文件质量。 |
| 410 | `VOICE_TO_TEXT_FILE_NOT_FOUND` | 语音转文字所需文件不存在。 | 确认语音文件已上传成功且仍可访问。 |
| 411 | `VOICE_TO_TEXT_FILE_TOO_LARGE` | 语音转文字文件过大。 | 压缩或更换更小的语音文件。 |
| 500 | `MESSAGE_ENCODE_FAILED` / `MESSAGE_DECODE_FAILED` / `STREAM_CHUNK_INVALID` / `STREAM_TIMEOUT_BY_SERVER` / `STREAM_STATE_CONFLICT` / `COMBINE_ENCODE_FAILED` / `COMBINE_PARSE_FAILED` | 消息编解码失败、流式消息分片异常、流式状态冲突，或合并消息构建/解析失败。 | 检查消息体结构、扩展字段、附件信息和合并消息内容是否合法。 |
| 501 | `MESSAGE_INCLUDE_ILLEGAL_CONTENT` | 消息包含非法或敏感内容，被内容过滤识别为不合规。 | 修改消息内容后重试。 |
| 502 | `MESSAGE_SEND_TRAFFIC_LIMIT` | 消息发送流量或频率受限。 | 降低发送频率；如限制由服务端策略配置引起，可联系商务或管理员调整。 |
| 504 | `MESSAGE_RECALL_TIME_LIMIT` | 撤回消息时超出限定时间。 | 提示用户已超过可撤回时间；如需调整撤回时长，可在 [环信控制台配置消息撤回时间](/product/console/basic_message.html#消息撤回)。 |
| 505 | `SERVICE_NOT_ENABLED` | 相关服务未开通，例如消息撤回、消息漫游、消息搜索、群聊消息已读回执、Reaction、翻译或语音转文字等能力未开通。 | 根据 `error.message` 确认具体能力，在 [环信控制台](https://console.easemob.com/user/login) 开通对应服务后重试。 |
| 506 | `MESSAGE_EXPIRED` | 消息已过期，例如超过群聊消息已读回执有效期，或服务端不再记录该消息的相关状态。 | 确认消息是否仍在有效期内；如已过期，不再查询或发送该消息相关回执。 |
| 507 | `MESSAGE_ILLEGAL_WHITELIST` | 当前用户不在允许发送消息的白名单中，常见于群组或聊天室开启全员禁言后，非白名单用户继续发送消息。 | 检查群组或聊天室白名单/禁言配置，必要时将用户加入白名单或解除禁言。 |
| 508 | `MESSAGE_EXTERNAL_LOGIC_BLOCKED` | 消息被外部审核或业务逻辑拦截，例如开通反垃圾或第三方内容审核后，消息审核结果为拒绝。 | 根据业务规则修改内容，或联系服务端排查审核/拦截原因。 |
| 509 | `MESSAGE_CURRENT_LIMITING` | 当前用户发送消息过于频繁，被限流。 | 降低发送频率后重试。 |
| 510 | `MESSAGE_SIZE_LIMIT` | 消息体大小超过限制。 | 缩短文本、减少扩展字段或拆分消息。关于消息体大小限制，详见 [消息概述](/product/product_message_overview.html#消息类型)。 |
| 511 | `MESSAGE_EDIT_FAILED` | 消息编辑失败，可能是消息不支持编辑、编辑权限不足、编辑次数超限或服务端拒绝。 | 检查消息类型、消息发送方、编辑次数和服务端返回信息后重试。 |

## 会话

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 811001 | `SESSION_LIST_SOCKET_FAILED` | 会话列表同步链路失败，可能是同步 WebSocket 建立失败或同步过程中连接异常。 | 检查连接状态和网络后重试。 |
| 811002 | `SESSION_LIST_PROTO_DECODE_FAILED` | 会话列表同步协议解码失败。 | 检查同步返回数据；若持续出现，升级 SDK 或联系技术支持。 |
| 811003 | `SESSION_LIST_REQUEST_INVALID` | 会话列表同步请求无效，可能是请求参数或游标异常。 | 检查请求参数和游标；必要时重新发起同步。 |
| 811004 | `SESSION_LIST_FETCH_FAILED` | 会话列表同步拉取失败。 | 稍后重试，并检查服务端会话列表服务状态。 |
| 811005 | `SESSION_LIST_SERVICE_DISABLED` | 会话列表同步服务未开通或不可用。 | 检查服务端会话列表能力是否已开通。 |
| 811006 | `SESSION_LIST_CANCELLED` | 会话列表同步被取消。 | 如仍需同步，重新发起同步或重新登录触发自动同步。 |

## 群组

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 600 | `GROUP_INVALID_ID` | 群组 ID 无效。 | 检查 `groupId` 是否正确。 |
| 601 | `GROUP_ALREADY_JOINED` | 当前用户已在群组中。 | 无需重复加入，也不要重复邀请已在群内的用户。 |
| 602 | `GROUP_NOT_JOINED` | 当前用户未加入群组，或目标用户不在群组中。 | 确认当前用户或目标用户已加入对应群组后再操作。 |
| 603 | `GROUP_PERMISSION_DENIED` | 当前用户无群组相关操作权限，例如普通成员执行仅群主或管理员可执行的操作，或群主直接退出群组。 | 使用群主或管理员账号重试；若群主需要退出群组，需先转让群主。 |
| 604 | `GROUP_MEMBERS_FULL` | 群成员数量已达到上限。 | 清理群成员，或根据套餐能力提升群成员上限。 |
| 605 | `GROUP_SHARED_FILE_INVALID_ID` | 群共享文件 ID 无效，或文件不存在。 | 检查群共享文件 ID 是否正确且文件仍存在。 |
| 606 | `GROUP_NOT_EXIST` | 群组不存在，或传入的 `groupId` 不正确。 | 检查 `groupId` 是否正确，并确认群组仍存在。 |
| 607 | `GROUP_DISABLED` | 群组已被禁用。 | 恢复群组可用状态后再操作。 |
| 608 | `GROUP_NAME_VIOLATION` | 群名称不符合服务端规范或命中内容限制。 | 修改为合规群名称后重试。 |
| 609 | `GROUP_MEMBER_ATTRIBUTES_REACH_LIMIT` | 群成员属性数量达到上限。 | 减少群成员属性条目数量后重试。 |
| 610 | `GROUP_MEMBER_ATTRIBUTES_UPDATE_FAILED` | 群成员属性更新失败，可能是属性内容不合法、权限不足或当前群状态不满足操作条件。 | 检查属性内容、当前用户权限和群状态后重试。 |
| 611 | `GROUP_MEMBER_ATTRIBUTES_KEY_REACH_LIMIT` | 群成员属性 key 长度超过限制。 | 缩短属性 key。 |
| 612 | `GROUP_MEMBER_ATTRIBUTES_VALUE_REACH_LIMIT` | 群成员属性 value 长度超过限制。 | 缩短属性 value。 |
| 613 | `GROUP_USER_IN_BLOCKLIST` | 用户在群黑名单中，无法执行当前群组操作。 | 联系群主或管理员将用户移出黑名单后重试。 |

## 聊天室

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 700 | `CHATROOM_INVALID_ID` | 聊天室 ID 无效。 | 检查 `chatRoomId` 是否正确。 |
| 702 | `CHATROOM_NOT_JOINED` | 当前用户未加入聊天室，或目标用户不在聊天室中。 | 先加入聊天室，或确认目标用户已在聊天室中。 |
| 703 | `CHATROOM_PERMISSION_DENIED` | 当前用户无聊天室相关操作权限，例如普通成员执行仅聊天室所有者或管理员可执行的操作。 | 使用聊天室所有者或管理员账号重试，或检查权限配置。 |
| 704 | `CHATROOM_MEMBERS_FULL` | 聊天室人数已达到上限。 | 等待其他成员退出后重试，或联系管理员/商务提升上限。 |
| 705 | `CHATROOM_NOT_EXIST` | 聊天室不存在，或传入的 `chatRoomId` 不正确。 | 检查 `chatRoomId` 是否正确，并确认聊天室仍存在。 |
| 706 | `CHATROOM_OWNER_NOT_ALLOW_LEAVE` | 聊天室所有者不允许直接退出聊天室。 | 先转让聊天室所有者，或执行符合当前聊天室规则的操作。 |
| 707 | `CHATROOM_USER_IN_BLOCKLIST` | 用户在聊天室黑名单中，无法加入或执行当前聊天室操作。 | 联系聊天室管理员将用户移出黑名单后重试。 |

## 好友

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 204 | `CONTACT_ADD_USER_NOT_FOUND` / `CONTACT_BLOCKLIST_USER_NOT_FOUND` | 目标好友不存在。 | 检查 `userId` 是否正确，并确认目标用户已注册。 |
| 210 | `CONTACT_ADD_BLOCKED_BY_USER` | 添加好友失败，可能是被对方拉黑或服务端禁止添加。 | 检查双方关系状态、黑名单状态和服务端好友策略。 |
| 223 | `CONTACT_SET_REMARK_NOT_FRIEND` | 给非好友设置备注。 | 先添加好友，再设置好友备注。 |
| 1000 | `CONTACT_ADD_ALREADY_FRIEND` | 重复添加好友，对方已是好友。 | 无需重复添加。 |
| 1001 | `CONTACT_REACH_LIMIT` | 当前用户好友数量达到上限。 | 删除不再需要的好友后重试，或联系商务提升限制。 |
| 1002 | `CONTACT_REACH_LIMIT_PEER` | 对方好友数量达到上限。 | 提示对方清理好友列表后再试。 |

好友同步相关错误：

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 1700 | `CONTACT_SYNC_METADATA_FAILED` | 好友同步元数据获取失败。 | 重试同步，检查网络和服务端状态。 |
| 1701 | `CONTACT_SYNC_SOCKET_FAILED` | 好友同步链路失败。 | 检查连接状态后重试。 |
| 1702 | `CONTACT_SYNC_CURSOR_INVALID` | 好友同步游标无效。 | 重新登录或重新发起同步，以重建同步游标。 |
| 1703 | `CONTACT_SYNC_PROTO_DECODE_FAILED` | 好友同步协议解码失败。 | 检查返回数据；若持续出现，升级 SDK 或联系技术支持。 |
| 1704 | `CONTACT_SYNC_CANCELLED` | 好友同步被取消。 | 如仍需同步，重新发起同步或重新登录触发自动同步。 |

## 用户资料

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 900 | `USERINFO_USERCOUNT_EXCEED` | 一次查询的用户资料数量超限。 | 减少单次查询的用户数后重试。 |
| 901 | `USERINFO_DATALENGTH_EXCEED` | 用户资料字段总长度超限。 | 缩短用户资料字段内容后重试。 |
| 1600 | `USER_INFO_SUBSCRIPTION_LIMIT_EXCEEDED` | 用户资料订阅人数达到上限。 | 减少订阅目标数量，或联系商务提升配额。 |
| 1601 | `USER_INFO_SUBSCRIPTION_TARGET_LIMIT_EXCEEDED` | 目标用户被订阅人数达到上限。 | 更换订阅目标，或联系商务提升配额。 |

## 用户状态（Presence）

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 1100 | `PRESENCE_PARAM_LENGTH_EXCEED` | Presence 参数长度或分页参数超出限制。 | 发布自定义在线状态时，控制 `customStatus` 长度；查询订阅列表时，检查 `pageNum` 和 `pageSize` 是否符合要求。详见 [发布自定义在线状态](presence.html#发布自定义在线状态)。 |
| 1101 | `PRESENCE_CANNOT_SUBSCRIBE_YOURSELF` | 不能订阅自己的在线状态。 | 从订阅列表中移除当前用户自己。 |

## 翻译

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 1110 | `TRANSLATE_PARAM_INVALID` | 翻译参数无效，例如目标语言不合法、待翻译文本为空或消息类型不支持翻译。 | 检查目标语言代码和输入内容，仅对支持翻译的消息调用翻译接口。 |
| 1111 | `TRANSLATE_SERVICE_NOT_ENABLED` | 翻译服务未开通。 | 在控制台开通翻译服务后重试。 |
| 1112 | `TRANSLATE_USAGE_LIMIT` | 翻译服务用量达到上限。 | 等待额度恢复，或联系商务提升配额。 |
| 1113 | `TRANSLATE_FAILED` | 翻译服务异常或翻译失败。 | 稍后重试；若持续失败，联系技术支持排查。 |

## 内容审核

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 1200 | `THIRD_MODERATION_FAILED` | 第三方内容审核明确拒绝，消息内容不合规。 | 修改消息内容后重试，或联系审核服务排查。 |
| 1299 | `THIRD_DEFAULT_FAILED` | 第三方内容审核或外部能力返回了未细分的默认失败。 | 根据服务端返回信息进一步排查。 |

## 消息表情回复（Reaction）

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 1300 | `REACTION_REACH_LIMIT` | Reaction 数量达到上限。 | 减少 Reaction 数量后重试。 |
| 1301 | `REACTION_ALREADY_OPERATED` | 当前用户已对该消息做过同类 Reaction 操作。 | 不要重复添加或重复移除同一 Reaction。 |
| 1302 | `REACTION_OPERATION_ILLEGAL` | Reaction 操作不合法，例如未添加过该 Reaction 的用户进行删除操作，或当前用户无权对该消息添加 Reaction。 | 检查当前用户与消息的关系，以及 Reaction 操作是否符合规则。 |

## 离线推送

| 错误码 | 错误信息 | 描述和可能原因 | 解决办法 |
| :--- | :--- | :--- | :--- |
| 1500 | `PUSH_TOKEN_UPLOAD_FAILED` | Push Token 上传失败。 | 检查登录态、`deviceToken`、`notifierName` 和推送配置后重试。 |
| 1501 | `PUSH_SILENT_MODE_OPERATION_FAILED` | 免打扰设置失败。 | 检查免打扰参数、会话 ID、会话类型和服务状态。 |
| 1502 | `PUSH_LANGUAGE_OPERATION_FAILED` | 推送语言设置失败。 | 检查语言参数是否正确。 |
