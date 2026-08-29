import path from "node:path"
import fs from "node:fs"

const getSubDirectories = (dir) => fs.readdirSync(dir).filter(item => fs.statSync(path.join(dir, item)).isDirectory())
/** V5 客户端 SDK 与 REST 文档已从原 docs/document 拆分。 */
const SDK_PATH = path.resolve(__dirname, '../../sdk/v5')
const REST_PATH = path.resolve(__dirname, '../../rest')
const platformList = getSubDirectories(SDK_PATH)

/** English labels for REST sidebar groups that do not point to a document. */
const REST_GROUP_LABELS: Record<string, string> = {
  'Token 鉴权': 'Token Authentication',
  '消息管理': 'Message Management',
  '发送流式消息': 'Send Streaming Messages',
  '发送全局广播消息': 'Send Global Broadcast Messages',
  '上传和下载文件': 'Upload and Download Files',
  '消息表情回复': 'Message Reactions',
  '撤回消息': 'Recall Messages',
  '单向删除漫游消息': 'Delete Roaming Messages',
  '消息翻译': 'Message Translation',
  '获取离线消息数据': 'Retrieve Offline Message Data',
  '导入消息': 'Import Messages',
  '群组管理': 'Chat Group Management',
  '获取群组': 'Retrieve Chat Groups',
  '管理群组': 'Manage Chat Groups',
  '管理群组公告': 'Manage Chat Group Announcements',
  '管理群组共享文件': 'Manage Chat Group Shared Files',
  '拉人入群': 'Add Chat Group Members',
  '踢人出群': 'Remove Chat Group Members',
  '管理群成员': 'Manage Chat Group Members',
  '管理群主和管理员': 'Manage Chat Group Owners and Admins',
  '管理禁言': 'Manage Mutes',
  '管理白名单': 'Manage Allowlists',
  '管理黑名单': 'Manage Blocklists',
  '管理群成员自定义属性': 'Manage Custom Chat Group Member Attributes',
  '管理消息话题': 'Manage Message Threads',
  '聊天室管理': 'Chat Room Management',
  '管理超级管理员': 'Manage Superadmins',
  '获取聊天室': 'Retrieve Chat Rooms',
  '管理聊天室': 'Manage Chat Rooms',
  '管理聊天室属性': 'Manage Chat Room Attributes',
  '拉人入聊天室': 'Add Chat Room Members',
  '踢人出聊天室': 'Remove Chat Room Members',
  '管理聊天室成员': 'Manage Chat Room Members',
  '管理聊天室所有者和管理员': 'Manage Chat Room Owners and Admins',
  '用户相关': 'User Management',
  '用户体系管理': 'User Account Management',
  '注册用户': 'Register Users',
  '获取用户详情': 'Retrieve User Details',
  '删除用户': 'Delete Users',
  '获取用户在线状态': 'Retrieve User Presence',
  '用户属性': 'User Attributes',
  '用户状态订阅': 'Presence Subscriptions',
  '用户关系': 'User Relationships',
  '用户全局禁言': 'Global User Mutes',
  '用户收藏': 'User Favorites',
  '离线推送': 'Offline Push',
  '设置离线推送': 'Configure Offline Push',
  '使用推送模板': 'Use Push Templates',
  '内容审核': 'Content Moderation',
  '关键词名单': 'Keyword Lists',
  '回调': 'Webhooks',
  '回调事件': 'Webhook Events',
  '消息回调': 'Message Webhooks',
  '会话回调': 'Conversation Webhooks',
  '群组与聊天室回调': 'Chat Group and Chat Room Webhooks',
  '创建与删除': 'Creation and Deletion',
  '信息与状态变更': 'Information and Status Changes',
  '成员与权限变更': 'Member and Permission Changes',
  '内容与资源操作': 'Content and Resource Operations',
  'API 参考': 'API Reference',
  '特性限制': 'Feature Limitations',
  '已废弃内容': 'Deprecated Content',
}

/** SDK V5 与 REST 共用的侧栏条目模板。 */
const documentV5Sidebar = [
  { text: "Beginner's Guide", link: "beginner_guide.html" },
  { text: 'iOS SDK Overview', link: 'sdk_overview.html', only: ['ios'] },
  { text: "Migration Guide", link: "migration_guide.html", only: ['android', 'ios', 'web'] },
  { text: "Integrate with MCP", link: "easemob_mcp_server.html", except: ['unity', 'windows', 'server-side']},
  { text: 'Quickstart', link: 'quickstart.html', except: ['windows', 'react-native', 'flutter', 'unity', 'server-side'] },
  { text: 'Quickstart', link: 'quickstart.html', only: ['windows', 'react-native', 'flutter', 'unity'] },
  { type: "separator", except: ['server-side'] } as any,
  { text: 'Import the SDK', link: 'integration.html', only: ['android', 'ios', 'harmonyos', 'unity', 'windows']},
  {
    text: 'Integrate the SDK',
    collapsible: true,
    children: [
      { text: 'Import SDK (Web)', link: 'integration.html' },
      { text: 'Integrate SDK (uni-app)', link: 'uniapp.html' },
    ],
    only: ['web']
  },
  { text: 'Add Dependencies', link: 'integration.html', only: ['flutter', 'react-native']},
  { text: 'Initialization', link: 'initialization.html', except: ['server-side']},
  {
    text: 'Login',
    collapsible: true,
    children: [
      { text: 'Login Overview', link: 'login.html' },
      { text: 'Connection', link: 'connection.html' },
      { text: 'Multi-Device Login', link: 'multi_device.html' },
    ],
    except: ['server-side']
  },
  {
    text: 'User Management',
    collapsible: true,
    children: [
      { text: 'User Relationships', link: 'user_relationship.html' },
      { text: 'User Attributes', link: 'userprofile.html' },
      { text: 'Automatic User Information Management', link: 'userinfo_provider.html', only: ['android', 'ios', 'web', 'harmonyos']},
      { text: 'Presence Subscription', link: 'presence.html' },
    ],
    except: ['server-side']
  },
  {
    text: 'Message Management',
    collapsible: true,
    children: [
      { text: 'Message Overview', link: 'message_overview.html' },
      { text: 'Send Messages', link: 'message_send.html' },
      { text: 'Receive Messages', link: 'message_receive.html' },
      { text: 'Receive Streaming Messages', link: 'message_stream_receive.html', only: ['android', 'web', 'ios', 'harmonyos', 'flutter', 'react-native'] },
      { text: 'Retrieve Historical Messages', link: 'message_retrieve.html' },
      { text: 'Recall Messages', link: 'message_recall.html' },
      { text: 'Search Local Messages', link: 'message_search_local.html', except: ['web'] },
      { text: 'Message Receipts', link: 'message_receipt.html'},
      { text: 'Edit Messages', link: 'message_modify.html'},
      { text: 'Message Reactions', link: 'reaction.html' },
      { text: 'Forward Messages', link: 'message_forward.html'},
      { text: 'Import and Insert Messages', link: 'message_import_insert.html', except: ['web']},
      { text: 'Update Messages', link: 'message_update.html', except: ['web']},
      { text: 'Delete Messages', link: 'message_delete.html' },
      { text: 'Targeted Messages', link: 'message_target.html' },
      { text: 'Message Extensions', link: 'message_extension.html' },
      { text: 'Pin Messages', link: 'message_pin.html'},
      { text: 'Deliver Messages Only to Online Users', link: 'message_deliver_only_online.html'},
      { text: 'Message Moderation (Reporting)', link: 'moderation.html', except: ['harmonyos']},
      { text: 'Message Traffic Statistics', link: 'message_traffic_statis.html', only: ['android', 'ios'] },
        ],
    except: ['server-side']
      },
  {
    text: 'Conversation Management',
    collapsible: true,
    children: [
      { text: 'Conversation Overview', link: 'conversation_overview.html' },
      { text: 'Conversation List', link: 'conversation_list.html' },
      { text: 'Local Conversations', link: 'conversation_local.html', only: ['web'] },
      { text: 'Conversation Read Receipts', link: 'conversation_receipt.html', only: ['flutter', 'harmonyos','react-native','unity','windows'] },
      { text: 'Conversation Unread Counts', link: 'conversation_unread.html'},
      { text: 'Pin Conversations', link: 'conversation_pin.html' },
      { text: 'Conversation Marks', link: 'conversation_mark.html' },
      { text: 'Delete Conversations', link: 'conversation_delete.html' },
    ],
    except: ['server-side']
  },  
  {
    text: 'Group Management',
    collapsible: true,
    children: [
      { text: 'Group Overview', link: 'group_overview.html' },
      { text: 'Create and Manage Groups', link: 'group_manage.html' },
      { text: 'Manage Group Members', link: 'group_members.html' },
      { text: 'Manage Group Member Name Cards', link: 'group_namecard.html', only: ['android', 'ios', 'web', 'harmonyos'] },
      { text: 'Manage Group Attributes', link: 'group_attributes.html' },
      { text: 'Manage Message Threads', link: 'thread.html', except: ['harmonyos'] },
      { text: 'Manage Messages in Threads', link: 'thread_message.html', except: ['harmonyos'] }
    ],
    except: ['server-side']
  },
  {
    text: 'Chat Room Management',
    collapsible: true,
    children: [
      { text: 'Chat Room Overview', link: 'room_overview.html' },
      { text: 'Create and Manage Chat Rooms', link: 'room_manage.html' },
      { text: 'Manage Chat Room Members', link: 'room_members.html' },
      { text: 'Manage Chat Room Attributes', link: 'room_attributes.html' },
    ],
    except: ['server-side']
  },
  {
    text: 'Offline Push',
    collapsible: true,
    children: [
      { text: 'Offline Push Overview', link: 'push/push_overview.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter'] },
      { text: 'Integrate APNs Push', link: 'push/push_apns.html', only: ['ios'] },
      { text: 'Integrate HarmonyOS Push', link: 'push/push_harmony.html', only: ['harmonyos'] },
      { 
        text: 'Integrate Third-Party Push Services',
        collapsible: true,
        children: [
          { text: 'FCM Push', link: 'push/push_fcm.html'},
          { text: 'Huawei Push', link: 'push/push_huawei.html'},
          { text: 'Honor Push', link: 'push/push_honor.html'},
          { text: 'OPPO Push', link: 'push/push_oppo.html'},
          { text: 'vivo Push', link: 'push/push_vivo.html'},
          { text: 'Xiaomi Push', link: 'push/push_xiaomi.html'},
          { text: 'Meizu Push', link: 'push/push_meizu.html'},
          ],
          only: ['android']
        }, 
        { text: '上传推送证书', link: 'push/push_easemob_console.html', only: ['react-native'] },
        { text: '上传推送证书及绑定推送信息', link: 'push/push_easemob_console.html', only: ['flutter'] },
        { text: '获取或更新推送 token', link: 'push/push_get_device_token.html', only: ['react-native'] },
        { text: '发送推送 token 到环信服务器', link: 'push/push_send_token_to_server.html', only: ['react-native'] },
        { text: 'Parse Push Notifications', link: 'push/push_parsing.html', only: ['android', 'ios'] },
        { text: 'Configure Notification Content',
            collapsible: true,
            children: [
              { text: 'Overview', link: 'push/push_display_overview.html'},
              { text: 'Configure Push Notification Display', link: 'push/push_display_attribute.html' },
              { text: 'Use Message Extension Fields', link: 'push/push_display_field.html'},
            ],
             only: ['android', 'ios', 'react-native', 'flutter'] 
        },
        { text: '设置推送通知的显示属性', link: 'push/push_display_attribute.html', only: ['harmonyos'] },
        { text: 'Notification Modes and Do Not Disturb', link: 'push/push_notification_mode_dnd.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter']},
        { text: 'Push Templates', link: 'push/push_template.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter']},
        // { text: 'Push Translation', link: 'push/push_translation.html', only: ['android', 'ios', 'web', 'react-native', 'flutter']},
        { text: 'Push Extensions', link: 'push/push_extension.html', only: ['android', 'ios', 'web', 'react-native', 'flutter']},
        // { text: 'FAQ', link: 'push/push_solution.html', only: ['android', 'ios','harmonyos']},
      ],
      except: ['server-side']
  },
  { text: 'Error Codes', link: 'error.html', except: ['server-side']},
  { text: 'API Reference', link: 'apireference.html', except: ['server-side']},
  { type: "separator", except: ['server-side']} as any,
  { text: 'Release Notes', link: 'releasenote.html', except: ['server-side']},
  { text: 'Feature Limitations', link: 'limitation.html', except: ['server-side']},
  {
    text: 'FAQs',
    collapsible: true,
    children: [
      { text: 'Implement Group @ Mentions', link: 'group_@.html', only: ['android', 'ios', 'web'] },
      { text: 'Implement Message Quotes', link: 'message_quote.html', only: ['android', 'ios', 'web'] },
      { text: 'Implement Typing Indicators', link: 'typing_indication.html', only: ['android', 'ios', 'web', 'react-native', 'flutter', 'unity', 'windows'] },
      { text: 'Configure the Server Domain', link: 'serverconfig.html', only: ['web'] },
      { text: '鸿蒙端消息扩展升级', link: 'message_extension_optimize.html', only: ['harmonyos'] },
      { text: '其他问题', link: 'faq.html', only: ['harmonyos'] },
    ],
  },
  { text: 'Get SDK Logs', link: 'log.html', except: ['flutter', 'server-side'] },
  { text: 'FAQs', link: 'faq.html', only: ['react-native'] },
  { text: 'Lite SDK', link: 'elite_sdk.html', only: ['android', 'ios']},
  { text: 'Private Cloud SDK IP Address/Domain Configuration', link: 'private_ip_domain.html', only: ['android', 'ios', 'web', 'harmonyos']},
  // { text: 'Compliance Guide', link: 'sdk_compliance.html'},
  { text: 'Apple Privacy Policy', link: 'privacy_policy.html', only: ['ios'] },
  { text: '服务端 API 概述', link: 'overview.html', only: ['server-side'] },
  { text: 'API 调用频率限制', link: 'limitationapi.html', only: ['server-side'] },
  { type: "separator", only: ['server-side']} as any,
  { 
    text: 'Token 鉴权',
    collapsible: true,
    children: [
      { text: 'App Token 鉴权', link: 'easemob_app_token.html' },
      { text: 'User Token 鉴权', link: 'easemob_user_token.html' },
    ],
    only: ['server-side']
  },
  { 
    text: '消息管理', 
    collapsible: true,
    children: [
      { text: '发送单聊消息', link: 'message_single.html' },
      { text: '发送群聊消息', link: 'message_group.html' },
      { text: '发送聊天室消息', link: 'message_chatroom.html' },
      {
        text: '发送流式消息',
        collapsible: true,
        children: [
          { text: '发送单聊流式消息', link: 'message_stream_send_single.html' },
          { text: '发送群聊流式消息', link: 'message_stream_send_group.html' },
        ]
      },
      {
        text: '发送全局广播消息',
        collapsible: true,
        children: [
        { text: '向所有用户发送广播消息', link: 'broadcast_to_all_users.html' },
        { text: '向在线用户发送广播消息', link: 'broadcast_to_online_users.html' },
        { text: '发送聊天室广播消息', link: 'broadcast_to_chatrooms.html' },
        ],
      },
      {
        text: '上传和下载文件',
        collapsible: true,
        children: [
        { text: '上传文件', link: 'message_upload_file.html' },
        { text: '下载文件', link: 'message_download_file.html' },
        { text: '下载文件缩略图', link: 'message_download_thumbnail.html' },
        ],
      },
      { text: '获取历史消息记录', link: 'message_historical.html' },
      { text: '设置消息附件存储方式', link: 'message_attachment_storage.html' },
      {
        text: '消息表情回复',
        collapsible: true,
        children: [
        { text: '添加 Reaction', link: 'reaction_add.html' },
        { text: '删除 Reaction', link: 'reaction_delete.html' },
        { text: '获取消息的 Reaction', link: 'reaction_get_by_msg_id.html' },
        { text: '获取 Reaction 详情', link: 'reaction_get_by_msg_id_emoji_id.html' },
        ],
      },
      {
        text: '撤回消息',
        collapsible: true,
        children: [
        { text: '撤回单条消息', link: 'message_recall_single.html' },
        { text: '批量撤回消息', link: 'message_recall_batch.html' },
        ],
      },
      { text: '单向删除会话', link: 'conversation_delete.html' },
      {
        text: '单向删除漫游消息',
        collapsible: true,
        children: [
        { text: '删除单聊漫游消息', link: 'message_delete_roam_single_msgid.html' },
        { text: '删除群聊漫游消息', link: 'message_delete_roam_group_room_msgid.html' },
        { text: '清空用户漫游消息', link: 'message_delete_roam_user.html' },
        { text: '清空单聊一段时间漫游消息', link: 'message_delete_roam_single_time.html' },
        { text: '清空群聊一段时间漫游消息', link: 'message_delete_roam_group_room_time.html' },
        ],
      },
      { text: '编辑消息', link: 'message_modify.html' },
      {
        text: '获取离线消息数据',
        collapsible: true,
        children: [
        { text: '获取用户离线消息数量', link: 'offline_msg_count_get.html' },
        { text: '获取离线消息的投递状态', link: 'offline_msg_status_get.html' },
        ],
      },
      {
        text: '导入消息',
        collapsible: true,
        children: [
        { text: '导入单聊消息', link: 'message_import_single.html' },
        { text: '导入群聊消息', link: 'message_import_group.html' },
        ],
      },
    ],
    only: ['server-side']
  },
  { 
    text: '群组管理',
    collapsible: true,
    children: [
      { text: '创建群组', link: 'group_create.html' },
      { 
        text: '获取群组', 
         collapsible: true,
         children: [
          {text: '获取 App 中的群组', link: 'group_obtain_total.html' }, 
          {text: '获取用户加入的群组', link: 'group_obtain_joined.html' }, 
          {text: '获取群组详情', link: 'group_obtain_detail.html' }, 
         ], 
      },
      { 
        text: '管理群组', 
         collapsible: true,
         children: [
          {text: '修改群组详情', link: 'group_modify.html' }, 
          {text: '封禁群组', link: 'group_ban.html' }, 
          {text: '解禁群组', link: 'group_unban.html' }, 
          {text: '解散群组', link: 'group_delete.html' }, 
         ], 
      },
      { 
        text: '管理群组公告', 
         collapsible: true,
         children: [
          {text: '获取群组公告', link: 'group_announcement_obtain.html' }, 
          {text: '修改群组公告', link: 'group_announcement_modify.html' }, 
         ], 
      },
      { text: '管理群组共享文件', 
        collapsible: true,
        children: [
          { text: '获取群组共享文件', link: 'group_shared_file_obtain.html' },
          { text: '上传群组共享文件', link: 'group_shared_file_upload.html' },
          { text: '下载群组共享文件', link: 'group_shared_file_download.html' },
          { text: '删除群组共享文件', link: 'group_shared_file_delete.html' },
        ]  
      },
      { 
            text: '拉人入群', 
            collapsible: true,
            children: [
              { text: '拉单人入群', link: 'group_member_add_single.html' },
              { text: '批量拉入群', link: 'group_members_add_batch.html' },
            ]  
      },
      { 
            text: '踢人出群', 
            collapsible: true,
            children: [
              { text: '踢单人出群', link: 'group_member_remove_single.html' },
              { text: '批量踢出群', link: 'group_members_remove_batch.html' },
            ]  
      },
      { text: '管理群成员', 
        collapsible: true,
        children: [
          { text: '获取群成员列表', link: 'group_member_list_obtain.html' },
          { 
            text: '管理群主和管理员', 
            collapsible: true,
            children: [
              { text: '转让群主', link: 'group_owner_transfer.html' },
              { text: '添加管理员', link: 'group_admin_add.html' },
              { text: '获取管理员列表', link: 'group_admin_list_get.html' },
              { text: '删除管理员', link: 'group_admin_remove.html' },
            ]  
          },
          { 
            text: '管理禁言', 
            collapsible: true,
            children: [
              { text: '禁言指定成员', link: 'group_member_mute.html' },
              { text: '禁言全员', link: 'group_member_mute_all.html' },
              { text: '解除成员禁言', link: 'group_member_unmute.html' },
              { text: '解除全员禁言', link: 'group_member_unmute_all.html' },
              { text: '获取禁言列表', link: 'group_member_mutelist_obtain.html' },
            ]  
          },
          { 
            text: '管理白名单', 
            collapsible: true,
            children: [
              { text: '添加单个用户至白名单', link: 'group_allowlist_add_single.html' },
              { text: '批量添加白名单', link: 'group_allowlist_add_batch.html' },
              { text: '删除白名单', link: 'group_allowlist_remove.html' },
              { text: '获取白名单列表', link: 'group_allowlist_query.html' },
            ]  
          },
          { 
            text: '管理黑名单', 
            collapsible: true,
            children: [
              { text: '添加单个用户至黑名单', link: 'group_member_blocklist_add_single.html' },
              { text: '批量添加黑名单', link: 'group_member_blocklist_add_batch.html' },
              { text: '删除单个黑名单用户', link: 'group_member_blocklist_remove_single.html' },
              { text: '批量删除黑名单用户', link: 'group_member_blocklist_remove_batch.html' },
              { text: '获取黑名单列表', link: 'group_member_blocklist_obtain.html' },
            ]  
          },
          { text: '查看用户是否加入群组', link: 'group_check_joined.html' },
          { 
            text: '管理群成员自定义属性', 
            collapsible: true,
            children: [
              { text: '设置群成员自定义属性', link: 'group_member_attribute_set.html' },
              { text: '批量设置群成员自定义属性', link: 'group_member_attribute_set_batch.html' },
              { text: '获取单个群成员自定义属性', link: 'group_member_attribute_get.html' },
              { text: '根据属性 key 获取群成员自定义属性', link: 'group_member_attribute_get_by_key.html' },
            ]  
          },
        ]  
      },
      { 
            text: '管理消息话题', 
            collapsible: true,
            children: [
              { text: '创建消息话题', link: 'group_thread_create.html' },
              { text: '修改消息话题', link: 'group_thread_modify.html' },
              { text: '删除消息话题', link: 'group_thread_delete.html' },
              { text: '获取 app 中的消息话题', link: 'group_thread_obtain.html' },
              { text: '获取用户加入的所有消息话题', link: 'group_thread_joined.html' },
              { text: '获取用户在群组中加入的消息话题', link: 'group_threads_in_group.html' },
              { text: '获取消息话题成员列表', link: 'group_thread_member_get.html' },
              { text: '批量加入消息话题', link: 'group_thread_member_add.html' },
              { text: '批量踢出消息话题', link: 'group_thread_member_remove.html' },
            ]  
          },
    ],
    only: ['server-side']
  },
  { 
    text: '聊天室管理',
    collapsible: true,
    children: [
      { 
        text: '管理超级管理员', 
         collapsible: true,
         children: [
          {text: '添加超级管理员', link: 'chatroom_superadmin_add.html' }, 
          {text: '获取超级管理员', link: 'chatroom_superadmin_list_obtain.html' }, 
          {text: '删除超级管理员', link: 'chatroom_superadmin_delete.html' }, 
         ], 
      },
      { text: '创建聊天室', link: 'chatroom_create.html' },
      { 
        text: '获取聊天室', 
         collapsible: true,
         children: [
          {text: '获取所有聊天室', link: 'chatroom_obtain_total.html' }, 
          {text: '获取用户加入的聊天室', link: 'chatroom_obtain_joined.html' }, 
          {text: '获取聊天室详情', link: 'chatroom_obtain_detail.html' }, 
         ], 
      },
      { 
        text: '管理聊天室', 
         collapsible: true,
         children: [
          {text: '修改聊天室信息', link: 'chatroom_modify.html' }, 
          {text: '解散聊天室', link: 'chatroom_delete.html' }, 
         ], 
      },
      { 
        text: '管理聊天室属性', 
         collapsible: true,
         children: [
          {text: '获取聊天室公告', link: 'chatroom_announcement_get.html' }, 
          {text: '修改聊天室公告', link: 'chatroom_announcement_update.html' }, 
          {text: '设置聊天室自定义属性', link: 'chatroom_custom_attribute_set.html' }, 
          {text: '强制设置聊天室自定义属性', link: 'chatroom_custom_attribute_set_force.html' }, 
          {text: '获取聊天室自定义属性', link: 'chatroom_custom_attribute_get.html' }, 
          {text: '删除聊天室自定义属性', link: 'chatroom_custom_attribute_delete.html' }, 
          {text: '强制删除聊天室自定义属性', link: 'chatroom_custom_attribute_delete_force.html' }, 
         ], 
      },
      { 
            text: '拉人入聊天室', 
            collapsible: true,
            children: [
              { text: '拉单人加入', link: 'chatroom_member_add_single.html' },
              { text: '批量拉入', link: 'chatroom_member_add_batch.html' },
            ]  
      },
      { 
            text: '踢人出聊天室', 
            collapsible: true,
            children: [
              { text: '踢单人', link: 'chatroom_member_remove_single.html' },
              { text: '批量踢出', link: 'chatroom_member_remove_batch.html' },
            ]  
      },
      { 
        text: '管理聊天室成员', 
        collapsible: true,
        children: [
          { text: '获取成员列表', link: 'chatroom_member_list_obtain.html' },
          { 
            text: '管理聊天室所有者和管理员', 
            collapsible: true,
            children: [
              { text: '变更聊天室所有者', link: 'chatroom_owner_transfer.html' }, 
              { text: '添加管理员', link: 'chatroom_admin_add.html' },
              { text: '获取管理员列表', link: 'chatroom_admin_list_get.html' },
              { text: '删除管理员', link: 'chatroom_admin_remove.html' },
            ]  
          },
          { text: '管理禁言', 
            collapsible: true,
            children: [
              { text: '禁言成员',  link: 'chatroom_member_mute.html' },
              { text: '禁言全员',  link: 'chatroom_member_mute_all.html' },
              { text: '解除成员禁言',  link: 'chatroom_member_unmute.html' },
              { text: '解除全员禁言',  link: 'chatroom_member_unmute_all.html' },
              { text: '获取禁言列表',  link: 'chatroom_member_mutelist_obtain.html' },
              { text: '按用户标签禁言',  link: 'chatroom_user_tag_mute.html' },
              { text: '添加用户标签',  link: 'chatroom_user_tag_set.html' },
              { text: '获取用户标签',  link: 'chatroom_user_tag_get.html' }
            ]
          },  
          { text: '管理白名单', 
            collapsible: true,
            children: [
              { text: '概述',  link: 'chatroom_allowlist_overview.html' },
              { text: '添加单个白名单成员',  link: 'chatroom_allowlist_add_single.html' },
              { text: '批量添加白名单成员',  link: 'chatroom_allowlist_add_batch.html' },
              { text: '移出白名单',  link: 'chatroom_allowlist_remove.html' },
              { text: '获取白名单列表',  link: 'chatroom_allowlist_obtain.html' }
            ]
          },  
          { text: '管理黑名单', 
            collapsible: true,
            children: [
              { text: '添加单个黑名单成员',  link: 'chatroom_member_blocklist_add_single.html' },
              { text: '批量添加黑名单成员',  link: 'chatroom_member_blocklist_add_batch.html' },
              { text: '移出单个黑名单成员',  link: 'chatroom_member_blocklist_remove_single.html' },
              { text: '批量移出黑名单',  link: 'chatroom_member_blocklist_remove_batch.html' },
              { text: '获取黑名单列表',  link: 'chatroom_member_blocklist_obtain.html' }
            ]
          },  
        ]  
      }
    ],
    only: ['server-side']
  },
  { 
    text: '用户相关',
    collapsible: true,
    children: [
    { text: '用户体系管理', 
        collapsible: true,
        children: [
          { text: '注册用户', 
            collapsible: true,
            children: [
              { text: '开放注册单用户',  link: 'account_register_open.html' },
              { text: '授权注册单用户',  link: 'account_register_authorized_single.html' },
              { text: '批量授权注册用户',  link: 'account_register_authorized_batch.html' }
            ]
          },  
          { text: '修改用户密码',  link: 'account_password_change.html' },
          { text: '获取用户详情', 
            collapsible: true,
            children: [
              { text: '获取单用户详情',  link: 'account_detail_obtain_single.html' },
              { text: '批量获取用户详情',  link: 'account_detail_obtain_batch.html' }
            ]
          }, 
          { text: '删除用户', 
            collapsible: true,
            children: [
              { text: '删除单用户',  link: 'account_delete_single.html' },
              { text: '批量删除用户',  link: 'account_delete_batch.html' }
            ]
          }, 
          { text: '封禁用户',  link: 'account_ban.html' },
          { text: '解禁用户',  link: 'account_unban.html' },
          { text: '强制用户下线',  link: 'account_offline_forced.html' },
          { text: '强制用户从单设备下线',  link: 'account_offline_device_single.html' },
          { text: '获取用户在线状态', 
            collapsible: true,
            children: [
              { text: '获取单个用户在线状态',  link: 'account_presence_obtain_single.html' },
              { text: '批量获取用户在线状态',  link: 'account_presence_obtain_batch.html' }
            ]
          }, 
          { text: '获取用户在线设备列表',  link: 'account_online_device_obtain.html' },
        ]
      }, 
      { 
        text: '用户属性',
        collapsible: true,
        children: [
          { text: '设置用户属性', link: 'user_attribute_set.html' },
          { text: '删除用户属性', link: 'user_attribute_delete.html' },
          { text: '获取单用户的属性', link: 'user_attribute_obtain_single.html' },
          { text: '批量获取用户属性', link: 'user_attribute_obtain_batch.html' },
          { text: '获取总用户属性大小', link: 'user_attribute_capacity_get.html' }
         ]
      },
      { 
        text: '用户状态订阅',
        collapsible: true,
        children: [
          { text: '设置用户在线状态', link: 'presence_set.html' },
          { text: '订阅用户在线状态', link: 'presence_subscribe.html' },
          { text: '取消订阅用户在线状态', link: 'presence_unsubscribe.html' },
          { text: '获取订阅列表', link: 'presence_subscription_list_obtain.html' },
          { text: '获取用户在线状态', link: 'presence_get.html' },
          { text: '获取群组在线成员数量', link: 'presence_group_online_count_obtain.html' }
         ]
      },
      { 
        text: '用户关系',
        collapsible: true,
        children: [
          { text: '添加好友', link: 'user_friend_add.html' },
          { text: '校验好友', link: 'user_friend_check.html' },
          { text: '删除单个好友', link: 'user_friend_remove.html' },
          { text: '删除所有好友', link: 'user_friend_remove_all.html' },
          { text: '设置好友备注', link: 'user_friend_remark_set.html' },
          { text: '分页获取好友列表', link: 'user_friend_list_paged.html' },
          { text: '一次性获取好友列表', link: 'user_friend_list_obtain.html' },
          { text: '导入好友列表', link: 'user_friend_import.html' },
          { text: '添加用户至黑名单', link: 'user_friend_blocklist_add.html' },
          { text: '从黑名单中移除用户', link: 'user_friend_blocklist_remove.html' },
          { text: '获取黑名单列表', link: 'user_friend_blocklist_obtain.html' },
          { text: '校验黑名单', link: 'user_friend_blocklist_check.html' }
         ]
        },
        { 
        text: '用户全局禁言',
        collapsible: true,
        children: [
          { text: '概述', link: 'user_global_mute_overview.html' },
          { text: '设置用户全局禁言', link: 'user_global_mute_set.html' },
          { text: '查询单用户全局禁言', link: 'user_global_mute_query_single.html' },
          { text: '查询所有用户的全局禁言', link: 'user_global_mute_query_all.html' }
         ]
        },
        { 
          text: '用户收藏',
          collapsible: true,
          children: [
            { text: '添加一条收藏', link: 'user_collection_add_single.html' },
            { text: '批量添加收藏', link: 'user_collection_add_batch.html' },
            { text: '修改收藏扩展信息', link: 'user_collection_ext_modify.html' },
            { text: '删除收藏', link: 'user_collection_delete.html' },
            { text: '获取收藏', link: 'user_collection_get.html' },
          ]
        },
      ],
      only: ['server-side']
  },
  { 
    text: '离线推送',
    collapsible: true,
    children: [
      { 
        text: '设置离线推送',
        collapsible: true,
        children: [
          { text: '绑定和解绑推送信息', link: 'push_information_bind_unbind.html' },
          { text: '查询推送绑定信息', link: 'push_information_bind_query.html' },
          { text: '设置单用户的推送昵称', link: 'push_nickname_set_single.html' },
          { text: '批量设置推送昵称', link: 'push_nickname_set_batch.html' },
          { text: '设置通知展示方式', link: 'push_display_mode_set.html' },
          { text: '设置免打扰和通知方式', link: 'push_settings_set.html' },
          { text: '查询免打扰和通知方式设置', link: 'push_settings_query.html' },
          // { text: '设置通知首选语言', link: 'push_preferred_language_set.html' },
          // { text: '获取通知首选语言', link: 'push_preferred_language_obtain.html' },
          { 
          text: '使用推送模板',
          collapsible: true,
          children: [
            { text: '概述', link: 'push_template_overview.html' },
            { text: '创建推送模板', link: 'push_template_create.html' },
            { text: '删除推送模板', link: 'push_template_delete.html' },
            { text: '查询推送模板', link: 'push_template_query.html' },
            { text: '发消息时配置模板', link: 'push_template_send_message.html' },
            { text: '接收方配置模板', link: 'push_template_receiver.html' },
          ]
        },
        { text: '常见错误码', link: 'push_error.html' },
    ]
  }, 
      { text: '离线推送的消息扩展', link: 'push_extension.html' },
      { text: '查询离线推送结果', link: 'push_result_statistics.html' }
    ],
    only: ['server-side']
  },
  /*
  { 
   text: '内容审核',
    collapsible: true,
    children: [
      { text: '主动文本审核', link: 'moderation_text_active.html' },
      { 
        text: '关键词名单',
        collapsible: true,
        children: [
          { text: '创建关键词名单', link: 'keyword_list_create.html' },
          { text: '修改关键词名单', link: 'keyword_list_modify.html' },
          { text: '查询关键词名单', link: 'keyword_list_query.html' },
          { text: '删除关键词名单', link: 'keyword_list_delete.html' },
          { text: '添加关键词', link: 'keyword_add.html' },
          { text: '修改关键词', link: 'keyword_modify.html' },
          { text: '查询关键词', link: 'keyword_query.html' },
          { text: '删除单个关键词', link: 'keyword_delete.html' },
          { text: '批量删除关键词', link: 'keyword_delete_batch.html' }
        ]
      }
    ],
    only: ['server-side']
  },
  */
  { text: '错误码', link: 'error.html', only: ['server-side']},
  {
    text: '回调',
    collapsible: true,
    children: [
      { text: '回调概述', link: 'callback_overview.html' },
      { text: '发送前回调', link: 'callback_presending.html' },
      { text: '发送后回调', link: 'callback_postsending.html' },
      { text: '回调事件',
        collapsible: true,
        children: [
          { text: '用户状态变更回调', link: 'callback_login_logout.html' },
          { text: '好友与黑名单回调', link: 'callback_contact.html' },
          { text: '消息回调',
                collapsible: true,
                children: [
                  { text: '消息发送', link: 'callback_message_send.html' },
                  { text: '单聊消息已读回执', link: 'callback_single_read_ack.html' },
                  { text: '群聊消息已读回执', link: 'callback_group_read_ack.html' },
                  { text: '消息编辑', link: 'callback_message_modify.html' },
                  { text: '消息撤回', link: 'callback_message_recall.html' },
                  { text: '表情回复变更', link: 'callback_reaction.html' },
                ]
         },
          { text: '群组与聊天室回调', 
            collapsible: true,
            children: [
              {
                text: '创建与删除',
                collapsible: true,
                children: [
                  { text: '群组与聊天室创建', link: 'callback_group_room_create.html' },
                  { text: '群组与聊天室删除', link: 'callback_group_room_delete.html' }
               ]
             },
              { text: '信息与状态变更',
                collapsible: true,
                children: [
                  { text: '群组与聊天室信息变更', link: 'callback_group_room_info.html' },
                  { text: '群主与聊天室所有者变更', link: 'callback_group_room_owner.html' },
                  { text: '群主与聊天室公告变更', link: 'callback_group_room_announcement.html' },
                  { text: '群组封禁状态变更', link: 'callback_group_ban.html' },
                  { text: '全员禁言状态变更', link: 'callback_group_room_muteall.html' },
                  { text: '群组屏蔽状态变更', link: 'callback_group_block.html' },
                ]
              },
              {
                text: '成员与权限变更',
                collapsible: true,
                children: [
                  { text: '新成员加入', link: 'callback_group_room_join.html' },
                  { text: '成员退出', link: 'callback_group_room_leave.html' },
                  { text: '管理员变更', link: 'callback_group_room_admin.html' },
                  { text: '禁言列表变更', link: 'callback_group_room_mute.html' },
                  { text: '白名单变更', link: 'callback_group_room_allowlist.html' },
                  { text: '黑名单变更', link: 'callback_group_room_blocklist.html' },
                  { text: '聊天室超级管理员变更', link: 'callback_room_superadmin.html' }
               ]
             },
             {
              text: '内容与资源操作',
              collapsible: true,
              children: [
                { text: '群共享文件变更', link: 'callback_group_shared_file.html' },
                { text: '话题内消息操作', link: 'callback_thread.html' }
              ]
            },
            ]
          },
          { text: '离线推送回调', link: 'callback_offline_push.html' },
          { text: '内容审核回调', link: 'callback_moderation.html' },
          { text: '敏感词监测回调', link: 'callback_sensitive_word.html' }
        ]
      },
      { text: '回调异常处理', link: 'callback_postsending_exception_storage.html' }
    ],
    only: ['server-side']
  },
  { type: "separator", only: ['server-side']} as any,
  { text: 'Java Server SDK 2.0', link: 'java_server_sdk_2.0.html' },
  { text: 'API 参考', link: 'apireference_java_2.0.html' },
  { text: '特性限制', link: 'limitation.html', only: ['server-side']},
  {
    text: '已废弃内容',
    collapsible: true,
    children: [
      { text: '通过用户 ID 和密码获取用户 token', link: 'easemob_user_token_password.html' }
    ],
    only: ['server-side']
  },
]

function buildDocV5Sidebar() {
  const result = {}
  platformList.forEach(platform => {
    const key = `/sdk/v5/${platform}/`
    result[key] = documentV5Sidebar.map(sidebar => handleSidebarItem(platform, sidebar)).filter(s => s)
  });
  result['/rest/'] = documentV5Sidebar
    .map(sidebar => handleSidebarItem('server-side', sidebar))
    .filter(s => s)
  return result
}


function linkExists(platform: string, link: string): boolean {
  try {
    const docRoot = platform === 'server-side' ? REST_PATH : path.join(SDK_PATH, platform)
    const filePath = `${docRoot}/${link.replace(/.html$/, '.md')}`;
    return fs.existsSync(filePath);
  } catch (e) {
    console.error(`Error checking file existence: ${e}`);
    return false;
  }
}

function getRestDocumentTitle(link: string): string | undefined {
  try {
    const filePath = path.join(REST_PATH, link.replace(/\.html$/, '.md'))
    const content = fs.readFileSync(filePath, 'utf8')
    return content.match(/^#\s+(.+)$/m)?.[1]?.trim()
  } catch {
    return undefined
  }
}

function getSdkDocumentTitle(platform: string, link: string): string | undefined {
  try {
    const filePath = path.join(SDK_PATH, platform, link.replace(/\.html$/, '.md'))
    const content = fs.readFileSync(filePath, 'utf8')
    const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim()
    if (heading) return heading

    // Some migrated SDK documents define their page title in YAML or JSON
    // frontmatter instead of using a Markdown level-one heading.
    return content
      .match(/^\s*title\s*:\s*["']?([^"'\r\n,}]+)["']?\s*,?\s*$/m)?.[1]
      ?.trim()
  } catch {
    return undefined
  }
}

// function handleSidebarItem(platform: string, sidebar: any): any {
//   const children = Array.isArray(sidebar.children) ? sidebar.children : [];
//   const newchildren = [];
//   for (const item of children) {
//     if (item.children) {
//       const newSubchildren = item.children.map((subItem) => handleSidebarItem(platform, subItem)).filter(Boolean);
//       for (const subItem of newSubchildren) {
//         if (!newchildren.some((i) => i.link === subItem.link)) {
//           newchildren.push(subItem);
//         }
//       }
//     } else if (linkExists(platform, item.link)) {
//       const documentLink = `/sdk/v5/${platform}/${item.link.replace(/.html$/, '')}`;
//       newchildren.push({ ...item, link: documentLink });
//     }
//   }
//   return newchildren.length ? { ...sidebar, children: newchildren } : null;
// }





function handleSidebarItem(platform, sidebar) {
  const hasChildren = sidebar.hasOwnProperty('children') && sidebar.children.length >0
  const hasOnly = sidebar.hasOwnProperty('only') && sidebar.only.length >0
  const hasExcept = sidebar.hasOwnProperty('except') && sidebar.except.length >0

  let needThisPlatform = true
  if (hasOnly) {
    needThisPlatform = sidebar.only.indexOf(platform) > -1
  }
  if (hasExcept) {
    needThisPlatform = sidebar.except.indexOf(platform) == -1
  }

  if (!needThisPlatform) {
    return null
  }
  if(sidebar.type === 'separator') {
    return { ...sidebar, type: 'separator' };
  }
  if (hasChildren) {
    let newchildren = sidebar.children.map(s => handleSidebarItem(platform, s)).filter(s=>s)
    // newchildren = newchildren.reduce((r, cur)=> {
    //   return r.find(i => i.link === cur.link)? r: [...r, cur]
    // }, [])
    if (newchildren.length > 0) {
      const text = platform === 'server-side'
        ? REST_GROUP_LABELS[sidebar.text] || sidebar.text
        : sidebar.text
      return {...sidebar, text, children: newchildren }
    }
  } else {
    if (linkExists(platform, sidebar.link)) {
      const basePath = platform === 'server-side' ? '/rest' : `/sdk/v5/${platform}`
      const newLink = `${basePath}/${sidebar.link}`
      const text = platform === 'server-side'
        ? getRestDocumentTitle(sidebar.link) || REST_GROUP_LABELS[sidebar.text] || sidebar.text
        : platform === 'ios'
          ? getSdkDocumentTitle(platform, sidebar.link) || sidebar.text
          : sidebar.text
      return {...sidebar, text, link:newLink}
    }
  }
}

export const DOC_V5_SIDEBAR = buildDocV5Sidebar()

