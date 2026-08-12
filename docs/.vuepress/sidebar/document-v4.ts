import path from "node:path"
import fs from "node:fs"

const getSubDirectories = (dir) => fs.readdirSync(dir).filter(item => fs.statSync(path.join(dir, item)).isDirectory())
/** V4 文档根目录：docs/v4 */
const DOC_PATH = path.resolve(__dirname, '../../v4')
const platformList = getSubDirectories(DOC_PATH)

const documentSidebar = [
  { text: "入门指引", link: "beginner_guide.html" },
  { text: "使用 MCP 集成", link: "easemob_mcp_server.html", except: ['unity', 'windows', 'server-side', 'applet']},
  { text: 'React Demo 体验', link: 'demo_react.html', only: ['web'] },
  { text: 'Vue Demo 体验', link: 'demo_vue.html', only: ['web'] },
  { text: 'Demo 体验', link: 'demo.html', only: ['android', 'ios', 'react-native', 'flutter'] },
  { text: '快速开始', link: 'quickstart.html', except: ['windows', 'react-native', 'flutter', 'unity', 'server-side', 'applet'] },
  { text: '快速开始', link: 'quickstart.html', only: ['windows', 'react-native', 'flutter', 'unity'] },
  { type: "separator", except: ['server-side', 'applet'] } as any,
  { text: '导入 SDK', link: 'integration.html', only: ['android', 'ios', 'web', 'harmonyos', 'unity', 'windows']},
  { text: '添加依赖', link: 'integration.html', only: ['flutter', 'react-native']},
  { text: '初始化', link: 'initialization.html', except: ['server-side', 'applet']},
  {
    text: '登录',
    collapsible: true,
    children: [
      { text: '登录介绍', link: 'login.html' },
      { text: '连接', link: 'connection.html' },
      { text: '多设备登录', link: 'multi_device.html' },
    ],
    except: ['server-side', 'applet']
  },
  {
    text: '用户相关',
    collapsible: true,
    children: [
      { text: '用户关系', link: 'user_relationship.html' },
      { text: '用户属性', link: 'userprofile.html' },
      { text: '用户信息自动管理', link: 'userinfo_provider.html', only: ['android', 'ios', 'harmonyos']},
      { text: '在线状态订阅', link: 'presence.html' },
    ],
    except: ['server-side', 'applet']
  },
  {
    text: '消息管理',
    collapsible: true,
    children: [
      { text: '消息概述', link: 'message_overview.html' },
      { text: '发送消息', link: 'message_send.html' },
      { text: '接收消息', link: 'message_receive.html' },
      { text: '接收流式消息', link: 'message_stream_receive.html', only: ['android', 'web', 'ios', 'harmonyos', 'react-native'] },
      { text: '获取历史消息', link: 'message_retrieve.html' },
      { text: '撤回消息', link: 'message_recall.html' },
      { text: '搜索本地消息', link: 'message_search_local.html', except: ['web']}, 
      { text: '消息回执', link: 'message_receipt.html'},
      { text: '编辑消息', link: 'message_modify.html'},
      { text: '消息表情回复', link: 'reaction.html' },
      { text: '转发消息', link: 'message_forward.html', except: ['web']},
      { text: '导入和插入消息', link: 'message_import_insert.html', except: ['web']},
      { text: '更新消息', link: 'message_update.html', except: ['web']},
      { text: '删除消息', link: 'message_delete.html' },    
      { text: '定向消息', link: 'message_target.html' },    
      { text: '消息扩展', link: 'message_extension.html' },    
      { text: '置顶消息', link: 'message_pin.html'},         
      { text: '只投在线用户', link: 'message_deliver_only_online.html'},
      { text: '消息审核（举报）', link: 'moderation.html', except: ['harmonyos']},
      { text: '获取消息流量统计', link: 'message_traffic_statis.html', only: ['android', 'ios'] },
        ],
    except: ['server-side', 'applet']
      },
  {
    text: '会话管理',
    collapsible: true,
    children: [
      { text: '会话介绍', link: 'conversation_overview.html' },
      { text: '会话列表', link: 'conversation_list.html' },
      { text: '本地会话', link: 'conversation_local.html', only: ['web'] },
      { text: '会话已读回执', link: 'conversation_receipt.html' },
      { text: '会话未读数', link: 'conversation_unread.html', except: ['web'] },
      { text: '置顶会话', link: 'conversation_pin.html' },
      { text: '会话标记', link: 'conversation_mark.html' },
      { text: '删除会话', link: 'conversation_delete.html' },
    ],
    except: ['server-side', 'applet']
  },  
  {
    text: '群组管理',
    collapsible: true,
    children: [
      { text: '群组概述', link: 'group_overview.html' },
      { text: '创建和管理群组', link: 'group_manage.html' },
      { text: '管理群组成员', link: 'group_members.html' },
      { text: '管理群成员名片', link: 'group_namecard.html', only: ['android', 'ios', 'harmonyos'] },
      { text: '管理群组属性', link: 'group_attributes.html' },
      { text: '管理消息话题', link: 'thread.html', except: ['harmonyos'] },
      { text: '管理消息话题中的消息', link: 'thread_message.html', except: ['harmonyos'] }
    ],
    except: ['server-side', 'applet']
  },
  {
    text: '聊天室管理',
    collapsible: true,
    children: [
      { text: '聊天室概述', link: 'room_overview.html' },
      { text: '创建和管理聊天室', link: 'room_manage.html' },
      { text: '管理聊天室成员', link: 'room_members.html' },
      { text: '管理聊天室属性', link: 'room_attributes.html' },
    ],
    except: ['server-side', 'applet']
  },
  {
    text: '离线推送', 
    collapsible: true,
    children: [
      { text: '离线推送概述', link: 'push/push_overview.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter'] },
      { text: '集成 APNs 推送', link: 'push/push_apns.html', only: ['ios'] }, 
      { text: '集成 HarmonyOS 推送', link: 'push/push_harmony.html', only: ['harmonyos'] },
      { 
        text: '集成第三方推送', 
        collapsible: true,
        children: [
          { text: 'FCM 推送', link: 'push/push_fcm.html'}, 
          { text: '华为推送', link: 'push/push_huawei.html'}, 
          { text: '荣耀推送', link: 'push/push_honor.html'}, 
          { text: 'OPPO 推送', link: 'push/push_oppo.html'}, 
          { text: 'vivo 推送', link: 'push/push_vivo.html'}, 
          { text: '小米推送', link: 'push/push_xiaomi.html'}, 
          { text: '魅族推送', link: 'push/push_meizu.html'}, 
          ],
          only: ['android']
        }, 
        { text: '上传推送证书', link: 'push/push_easemob_console.html', only: ['react-native'] },
        { text: '上传推送证书及绑定推送信息', link: 'push/push_easemob_console.html', only: ['flutter'] },
        { text: '获取或更新推送 token', link: 'push/push_get_device_token.html', only: ['react-native'] },
        { text: '发送推送 token 到环信服务器', link: 'push/push_send_token_to_server.html', only: ['react-native'] },
        { text: '解析推送消息', link: 'push/push_parsing.html', only: ['android', 'ios'] },
        { text: '统一获取消息方案', link: 'push/push_parsing_unified.html', only: ['android'] },
        { text: '设置通知的显示内容', 
            collapsible: true,
            children: [
              { text: '概述', link: 'push/push_display_overview.html'},
              { text: '设置推送通知的显示属性', link: 'push/push_display_attribute.html' },
              { text: '使用消息扩展字段', link: 'push/push_display_field.html'},
            ],
             only: ['android', 'ios', 'react-native', 'flutter'] 
        },
        { text: '设置推送通知的显示属性', link: 'push/push_display_attribute.html', only: ['harmonyos'] },
        { text: '设置通知方式和免打扰', link: 'push/push_notification_mode_dnd.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter']},
        { text: '设置推送模板', link: 'push/push_template.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter']},
        { text: '设置推送翻译', link: 'push/push_translation.html', only: ['android', 'ios', 'web', 'react-native', 'flutter']},
        { text: '设置推送扩展功能', link: 'push/push_extension.html', only: ['android', 'ios', 'web', 'react-native', 'flutter']},
        { text: '推送消息分类', link: 'push/push_message_classification.html', only: ['android'] },
        { text: 'FAQ', link: 'push/push_solution.html', only: ['android', 'ios','harmonyos']},
      ],
      except: ['applet','server-side']
  },
  { text: '错误码', link: 'error.html', except: ['server-side', 'applet']},
  { text: 'API 参考', link: 'apireference.html', except: ['server-side', 'applet']},
  { type: "separator", except: ['server-side', 'applet']} as any,
  { text: '更新日志', link: 'releasenote.html', except: ['server-side', 'applet']},
  { text: '特性限制', link: 'limitation.html', except: ['server-side', 'applet']},
  {
    text: '常见问题',
    collapsible: true,
    children: [
      { text: '实现群 @ 消息', link: 'group_@.html', only: ['android', 'ios', 'web'] },
      { text: '实现消息引用', link: 'message_quote.html', only: ['android', 'ios', 'web'] },
      { text: '实现输入指示器', link: 'typing_indication.html', only: ['android', 'ios', 'web', 'react-native', 'flutter', 'unity', 'windows'] },
      { text: '鸿蒙端消息扩展升级', link: 'message_extension_optimize.html', only: ['harmonyos'] },
    ],
  },
  { text: '获取 SDK 日志', link: 'log.html', except: ['flutter', 'server-side', 'applet'] },
  { text: '常见问题', link: 'faq.html', only: ['react-native'] },
  { text: '精简版 SDK', link: 'elite_sdk.html', only: ['android', 'ios']},
  { text: '私有云 SDK IP 地址/域名配置', link: 'private_ip_domain.html', only: ['android', 'ios', 'web', 'harmonyos']},
  { text: '合规指南', link: 'sdk_compliance.html', except: ['applet']},
  { text: '苹果隐私策略', link: 'privacy_policy.html', only: ['ios'] },
  { text: '概述', link: 'overview.html', only: ['applet'] },
  { type: "separator", only: ['applet']} as any,
  {
        text: '集成介绍',
        collapsible: true,
        children: [
          { text: '微信小程序', link: 'wechat.html' },
          { text: 'QQ 小程序', link: 'qq.html' },
          { text: '百度小程序', link: 'baidu.html' },
          { text: '抖音小程序', link: 'bytedance.html' },
          { text: '支付宝小程序', link: 'alipay.html' },
          { text: 'Uniapp 全平台', link: 'uniapp.html' },
        ],
        only: ['applet']
  },
  { text: '初始化', link: 'initialization.html', only: ['applet'] },
  {
        text: '登录',
        collapsible: true,
        children: [
          { text: '登录介绍', link: 'login.html' },
          { text: '连接', link: 'connection.html' },
          { text: '多设备登录', link: 'multi_device.html' },
        ], 
        only: ['applet'] 
  },
  {
        text: '用户相关',
        collapsible: true,
        children: [
          { text: '用户关系', link: 'user_relationship.html' },
          { text: '用户属性', link: 'userprofile.html' },
          { text: '在线状态订阅', link: 'presence.html' },
        ],
        only: ['applet']
  },        
  {
        text: '消息管理',
        collapsible: true,
        children: [
          { text: '消息概述', link: 'message_overview.html' },
          { text: '发送消息', link: 'message_send.html' },
          { text: '接收消息', link: 'message_receive.html' },
          { text: '接收流式消息', link: 'message_stream_receive.html' },
          { text: '获取历史消息', link: 'message_retrieve.html' },
          { text: '撤回消息', link: 'message_recall.html' },
          { text: '消息回执', link: 'message_receipt.html' }, 
          { text: '消息表情回复', link: 'reaction.html' },
          { text: '编辑消息', link: 'message_modify.html' },
          { text: '删除消息', link: 'message_delete.html' },
          { text: '定向消息', link: 'message_target.html' }, 
          { text: '消息扩展', link: 'message_extension.html' },    
          { text: '置顶消息', link: 'message_pin.html' }, 
          { text: '只投在线用户', link: 'message_deliver_only_online.html'},  
          { text: '消息审核（举报）', link: 'moderation.html'},      
        ],
        only: ['applet']
  },
  {
        text: '会话管理',
        collapsible: true,
        children: [
          { text: '会话介绍', link: 'conversation_overview.html' },
          { text: '会话列表', link: 'conversation_list.html' },
          { text: '会话已读回执', link: 'conversation_receipt.html' },
          { text: '会话未读数', link: 'conversation_unread.html' },
          { text: '置顶会话', link: 'conversation_pin.html' },
          { text: '会话标记', link: 'conversation_mark.html'},
          { text: '删除会话', link: 'conversation_delete.html'},
        ],
        only: ['applet']
  },
  {
        text: '群组管理',
        collapsible: true,
        children: [
          { text: '群组概述', link: 'group_overview.html' },
          { text: '创建和管理群组', link: 'group_manage.html' },
          { text: '管理群组成员', link: 'group_members.html' },
          { text: '管理群组属性', link: 'group_attributes.html' },
          {
            text: '消息话题管理',
            collapsible: true,
            children: [
              { text: '管理消息话题', link: 'thread.html' },
              { text: '管理消息话题中的消息', link: 'thread_message.html' }
            ]
          },
        ],
        only: ['applet']
  },
  {
        text: '聊天室管理',
        collapsible: true,
        children: [
          { text: '聊天室概述', link: 'room_overview.html' },
          { text: '创建和管理聊天室', link: 'room_manage.html' },
          { text: '管理聊天室成员', link: 'room_members.html' },
          { text: '管理聊天室属性', link: 'room_attributes.html' },
        ],
        only: ['applet']
  },
  { text: '离线推送', 
        collapsible: true,
        children: [
        { text: '离线推送概述', link: 'push/push_overview.html' }, 
        { text: '设置通知方式和免打扰', link: 'push/push_notification_mode_dnd.html' },
        { text: '设置推送模板', link: 'push/push_template.html' },
        { text: '设置推送翻译', link: 'push/push_translation.html' },
        { text: '设置推送扩展功能', link: 'push/push_extension.html' },
        { text: 'uni-app 离线推送',
          collapsible: true, 
          children: [
            { text: '使用推送插件', link: 'push/uniapp_push.html' },
            { text: '集成 FCM', link: 'push/uniapp_push_fcm.html' },
          ],
        }
        ],
        only: ['applet']
  }, 
  {
    text: '错误排查',
    collapsible: true,
    children: [
      { text: '错误码', link: 'error.html' },
      { text: '日志', link: 'log.html' },
    ],
    only: ['applet']
  },
  { text: 'API 参考', link: 'apidoc.html', only: ['applet']},
  { type: "separator", only: ['applet']} as any,
  { text: '更新日志', link: 'releasenote.html', only: ['applet']},
  { text: '特性限制', link: 'limitation.html', only: ['applet']},
  {
    text: '其他帮助',
    collapsible: true,
    children: [
      { text: 'Uniapp 生成原生 Android/iOS 应用', link: 'uniappnativeapp.html' },
      { text: '小程序模板使用指南', link: 'uniappuikit.html' },
      { text: '如何配置服务器域名', link: 'serverconfig.html' },
      { text: 'Vue3 项目在 H5 平台发布的注意事项', link: 'vue3_project_h5.html' },
    ],
    only: ['applet']
  },
  { text: '精简版 SDK', link: 'elite_sdk.html', only: ['applet']},
  { text: '合规指南', link: 'sdk_compliance.html', only: ['applet']},
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
        text: '消息翻译',
        collapsible: true,
        children: [
        { text: '翻译消息内容', link: 'message_translation_text.html' },
        { text: '获取翻译语言列表', link: 'message_translation_language_list.html' },
        { text: '检测文本的源语言', link: 'message_translation_detect.html' },
        ],
      },
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
          { text: '设置通知首选语言', link: 'push_preferred_language_set.html' },
          { text: '获取通知首选语言', link: 'push_preferred_language_obtain.html' },
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
  { text: 'RTC 用量', link: 'rtc_usage_query.html', only: ['server-side'] },
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
          { text: '会话回调',
                collapsible: true,
                children: [
                  { text: '会话已读回执', link: 'callback_single_conversation_ack.html' }
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
            { text: '历史版本（群组与聊天室操作消息）', link: 'callback_group_room_old.html' }, 
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
  {
    text: 'Server SDK',
    collapsible: true,
    children: [
      { text: 'Java Server SDK 2.0', link: 'java_server_sdk_2.0.html' },
      { text: 'Java Server SDK 1.0', link: 'java_server_sdk.html' },
      { text: 'PHP Server SDK', link: 'php_server_sdk.html' }
    ],
    only: ['server-side']
  },
  {
    text: 'API 参考',
    collapsible: true,
    children: [
      { text: 'Java Server SDK 2.0', link: 'apireference_java_2.0.html' },
      { text: 'Java Server SDK 1.0', link: 'apireference_java_1.0.html' },
      { text: 'PHP Server SDK', link: 'php_server_sdk.html' }
    ],
    only: ['server-side']
  },
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

function buildDocSidebar() {
  const result = {}
  platformList.forEach(platform => {
    const key = `/v4/${platform}/`
    result[key] = documentSidebar.map(sidebar => handleSidebarItem(platform, sidebar)).filter(s => s)
  });
  return result
}


function linkExists(platform: string, link: string): boolean {
  try {
    const filePath = `${DOC_PATH}/${platform}/${link.replace(/.html$/, '.md')}`;
    return fs.existsSync(filePath);
  } catch (e) {
    console.error(`Error checking file existence: ${e}`);
    return false;
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
//       const documentLink = `/document/${platform}/${item.link.replace(/.html$/, '')}`;
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
      return {...sidebar, children: newchildren }
    }
  } else {
    if (linkExists(platform, sidebar.link)) {
      const newLink = `/v4/${platform}/${sidebar.link}`
      return {...sidebar, link:newLink}
    }
  }
}

export const DOC_SIDEBAR = buildDocSidebar()

// console.dir(buildDocSidebar(), {depth: null})

