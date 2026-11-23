# Android 单群聊 UIKit 更新日志

## v5.1.0

修复单聊消息被误显示群“已读”计数的问题：SDK 5.0.0 后单聊消息也会携带 `isNeedReadReceipt` 标记，导致文本消息行误展示。

## v5.0.0

本版本在 2026 年 8 月 12 日发布。

本版本全面适配环信 IM Android SDK 5.0.0，跟随 SDK 完成数据同步机制、已读回执体系、群组配置模型等重构，并移除 SDK 已下线能力。SDK 侧接口删除、重命名及替代方式请参见 IM Android SDK 4.x 到 5.x 迁移指南。

#### 重要变更

**接入方式调整**

1. **初始化必须显式开启数据同步与用户属性**，否则会话、联系人、群组列表为空：

   ```kotlin
   options.setEnableUserInfo(true)
   options.setDataSyncType(
       EnumSet.of(
           EMDataSyncType.CONVERSATIONS,
           EMDataSyncType.CONTACTS,
           EMDataSyncType.JOINED_GROUPS
       )
   )
   ChatUIKitClient.init(this, options)
   ```

2. **登录全面切换为 Token 方式**：SDK 5.0.0 移除了密码登录与自动登录，快速开始和 demo 中的密码输入框已替换为 Chat Token 输入框，登录使用 `ChatUIKitClient.login(ChatUIKitProfile(username), chatToken)`。Token 需从应用服务器获取，不要写死在客户端。

3. **登录后无需再手动加载数据**：SDK 数据同步机制会自动落库会话、联系人和群组，原 `loadAllConversations()`、`loadAllGroups()`、`loadAllInfoFromHX()` 等手动加载调用需移除。

**消息已读回执体系重构**

- 已读回执改为批量发送，单聊、群聊统一走 SDK 新的已读回执接口；UIKit 内部所有回执入口（消息展示、点击语音、视频或文件、进入会话补发）统一切换为批量接口。
- 消息是否已读的判断由 `isAcked` 改为 `isPeerRead`。
- 单聊消息统一 `setIsNeedReadReceipt(true)`，替代 SDK 已删除的全局 `requireAck` 选项。
- 进入会话的历史未读处理重写：按未读数分页回溯历史消息，对需要回执的消息按每批 50 条批量补发已读回执，最后清空会话未读数并同步多端；不再发送旧的 Channel ACK。

**消息举报功能整体移除**

SDK 5.0.0 下线客户端消息举报能力，UIKit 同步删除全部相关入口：

- 删除 `IChatLayout.reportMessage()`、`IChatLayout.setOnReportMessageListener()`、`IChatViewRequest.reportMessage()`、`IHandleChatResultView.onReportMessageSuccess/Fail`、`OnReportMessageListener`、`ChatUIKitReportSheetDialog` 等类与接口。
- 移除消息长按菜单中的“举报”项及全部相关布局、图片、字符串资源。
- 消息举报请改由业务服务器实现。

**会话、联系人和群组列表改为纯本地加载**

- 会话列表不再从服务器分页拉取，始终读取本地数据（依赖 SDK 数据同步落库）。
- 群列表移除下拉加载更多、服务端分页拉取，仅读取本地已加入群组。
- 联系人列表由 `fetchContactsFromServer()` 改为读取本地联系人。

#### 新增功能

- **新增 `ChatUIKitDataSyncEvent` 数据同步事件**：描述 SDK 数据同步状态（`dataSyncType`、`STARTED/FINISHED` 和 `errorCode`），可通过 `ChatUIKitFlowBus.withStick<ChatUIKitDataSyncEvent>(eventKey)` 订阅会话、联系人、已加入群组的同步进度；同步成功后 UIKit 自动派发对应类型的刷新事件驱动 UI 更新。
- **新增 `ChatUIKitConfig.compatibilityModeForUserInfo` 配置**（默认 `false`）：开启后发送消息时把当前用户昵称和头像写入消息扩展，用于兼容旧版 UIKit 客户端；5.0 默认不再写入，发送侧改用 SDK 用户属性。
- **新增会话展示名称和头像统一解析**：优先级为 Provider 备注 > Provider 昵称 > SDK 会话名称（`getConversationName()`）> 消息扩展昵称 > ID。会话列表、聊天页标题栏、搜索、名片分享确认弹窗统一走该入口，开发者不提供 Provider 时也能展示 SDK 同步的昵称头像。
- **好友申请未读数改为已读游标机制**：新增 `ChatUIKitNotificationMsgManager.getRequestUnreadCount(maxCount)` 与 `initializeRequestReadCursor()`（升级迁移基线，避免历史申请全部误标为未读）。
- **用户属性自动同步**：实现 SDK 用户属性更新监听，SDK 同步到用户属性后自动更新缓存并刷新联系人和会话界面；登录成功后若传入的昵称和头像与 SDK 本地用户属性不一致，自动同步到服务端。
- **群名片缓存与优先展示**：新增群名片缓存；群聊中发送者昵称解析优先级调整为群名片 > Provider remark > SDK remark > 消息扩展 remark。
- **缓存双通道**：`ChatUIKitCache` 新增 SDK 用户属性缓存通道，与开发者 Provider 数据合并返回（Provider 字段优先，SDK 字段兜底）。

#### 优化

- 会话免打扰判断改为优先读取 SDK 会话的 `pushRemindType`，本地缓存仅作旧数据兜底。
- 会话搜索改为异步接口（`asyncSearchMsgFromDB`）。
- 联系人重复申请处理优化：同一用户重复申请时删除旧消息插入新消息，保证新申请正确计入未读。
- 调整消息已读回执处理逻辑：判断条件由 `isNeedGroupAck` 改为 `isNeedReadReceipt`，回执拉取切换为 `asyncFetchGroupMessageReadReceipts`。
- 群资料 Provider 在 Provider 与缓存均无数据时，回退到 SDK 本地群信息（群名称和群头像）。

#### API 变更

已读回执相关重命名：

- `ChatUIKitMessageListener`：删除 `onMessageRead()`、`onGroupMessageRead()`、`onReadAckForGroupMessageUpdated()`；新增 `onMessageReadReceipts(receipts)`（单聊群聊统一）。
- `ChatUIKitConversationListener`：删除 `onConversationRead()`。
- `OnMessageAckSendCallback` 删除，替换为 `OnMessageReadReceiptSendCallback`（`onSendReadReceiptSuccess/onSendReadReceiptError`）；`IChatMessageListLayout.setOnMessageAckSendCallback()` 相应更名为 `setOnMessageReadReceiptSendCallback()`。
- `IHandleChatResultView` 方法更名：`ackConversationReadSuccess/Fail` → `clearConversationUnreadMessageCountSuccess/Fail`；`ackGroupMessageReadSuccess/Fail` → `sendGroupMessageReadReceiptSuccess/Fail`；`ackMessageReadSuccess/Fail` → `sendMessageReadReceiptSuccess/Fail`。
- `IChatViewRequest`：`sendChannelAck()` → `clearConversationUnreadMessageCount()`；`sendGroupMessageReadAck()` → `sendGroupMessageReadReceipt()`；`sendMessageReadAck()` → `sendMessageReadReceipt()`；`sendTextMessage(content, isNeedGroupAck)` 参数更名为 `isNeedReadReceipt`。
- `IChatLayout.sendTextMessage(content, isNeedGroupAck)` 参数同步更名。
- `ChatUIKitDingMessageHelper`：`IAckUserUpdateListener` → `IReadReceiptUserUpdateListener`；`sendAckMessage()` → `sendReadReceipt()`；`fetchGroupReadAck()` → `fetchGroupMessageReadReceipts()`。

群组相关：

- `IGroupRequest.createGroup(...)` 签名由 `options: ChatGroupOptions` 改为 `avatar: String` 和 `configs: ChatGroupConfigs`（适配 SDK 群组配置新模型）。
- 删除 `IGroupRequest.loadJoinedGroupData(page)`、`IUIKitGroupResultView.loadGroupListSuccess/Fail`、`ChatGroupSuspend.fetchJoinedGroupsFromServer()`。
- 类型别名调整：删除 `ChatGroupStyle`、`ChatGroupOptions`、`ChatGroupReadAck`；新增 `ChatGroupConfigs`、`ChatGroupReadReceipt`、`ChatMessageReadReceipt`。

其他删除：

- `ChatUIKitContactListener`：删除 `onContactSyncStart()`、`onContactSyncFinishWithError()`（改由数据同步机制承载）。
- `ChatUIKitGroupListener`、`UIKitChatRoomListener`：删除 SDK 已下线的旧签名回调。
- suspends 包：删除 `ChatContactSuspend.fetchContactsFromServer()`、`ChatManagerSuspend.fetchConversationsFromServer()`、`fetchPinedConversationsFromServer()`、`reportChatMessage()`；`ackConversationToRead()` → `clearConversationUnreadMessageCount()`；`ackGroupMessageToRead()` → `sendGroupMessageReadReceipt()`；`ackMessageToRead()` → `sendMessageReadReceipt()`。
- `ChatUIKitConversation.chatConversation()` 改为带会话类型的 `getConversation(conversationId, conversationType)`。

#### 修复

- 修复 SDK 用户属性缓存与群名片缓存合并写入的并发可见性问题（改为同步加锁写入）。
- 修复升级后历史好友申请全部被误标为未读的问题（新增已读游标迁移基线）。
- 修复同一用户重复申请好友时新申请不计未读的问题。
- 修复相同时间戳的消息扩展用户信息不更新的问题。

## v4.23.0

修复 UIKit 发送 HEIF/HEIC 格式图片时，出现的图片旋转信息丢失的问题。

## v4.19.1 

本版本在 2026 年 3 月 2 日发布。

修复合并消息中视频消息不展示缩略图的问题。

## v4.19.0 

本版本在 2026 年 2 月 4 日发布。

#### 优化

升级 Android Gradle 插件版本到 8.6.1。

#### 修复

1. 修复会话列表图像配置和圆形图像切边问题。
2. 修复会话列表代码里对图像的单独配置会被全局设置覆盖的问题。

## v4.18.0 

本版本在 2025 年 10 月 31 日发布。

#### 修复

1. 修复离线时撤回消息,上线后本地没有插入问题。
2. 修复会话列表页面中列表项背景设置未生效问题。

## v4.15.1

本版本在 2025 年 6 月 23 日发布。

修复好友页面对应的内存被回收后重新打开会崩溃问题。

## v4.11.1 

本版本在 2024 年 12 月 3 日发布。

#### 新增特性

- [消息长按菜单样式新增微信风格样式](chatuikit_custom_chat_basic.html#设置长按消息菜单)。
- [发送附件消息菜单新增微信风格样式](chatuikit_custom_chat_inputmenu.html#设置消息扩展菜单)。

#### 优化

权限申请时顶部增加权限申请说明。

#### 修复

修复消息置顶特性在部分场景下未更新的一些问题。

#### 重大变更

为规范 UIKit 各平台的命名，UIKit 内部将工程下所有以 `ease` 开头的类文件、layout 布局文件、资源文件及内部使用的部分字符串修改为以 `chatuikit` 开头，老用户升级时应注意变更相关引用。具体变更规则，请访问 [GitHub](https://github.com/easemob/easemob-uikit-android/blob/main/script/rename_file_and_update_content.py) 或 [Gitee](https://gitee.com/easemob-code/easemob-uikit-android/blob/main/script/rename_file_and_update_content.py) 地址参考提供的脚本内部实现。脚本可以协助用户将应用层代码实现同步更名。

调用方式如下：

python3 rename_file_and_update_content.py target_folder --rename-files --replace-content
- target_folder：目标文件夹路径。
- --rename-files：如果指定此参数，则会执行文件重命名操作。
-  --replace-content：如果指定此参数，则会执行文件内容替换操作。

例如：`python3 rename_file_and_update_content.py ../quickstart/src  --replace-content --rename-files`

注意：如果存在应用层目标名称（比如类名）与原 UIkit 修改规则中重名的情况，脚本扫描时可能会造成误更改用户应用层重名文件的情况，所以用户在调用脚本前应该做好代码 git 管理及备份，出现部分异常情况需要用户根据实际情况手动更改。

## v4.8.2

本版本在 2024 年 7 月 26 日发布。

#### 新增特性

- 新增聊天中正在输入状态功能。
- 新增好友黑名单功能。
- Callkit 增加私有配置设置。

#### 修复

- 修复发送图片/HEIF类型图片缩略图错乱问题。
- 修复单群聊 UIKit 内存泄漏问题。