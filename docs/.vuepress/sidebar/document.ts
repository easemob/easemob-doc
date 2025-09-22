import path from "node:path"
import fs from "node:fs"

const getSubDirectories = (dir) => fs.readdirSync(dir).filter(item => fs.statSync(path.join(dir, item)).isDirectory())
const DOC_PATH = path.resolve(__dirname, '../../document')
const platformList = getSubDirectories(DOC_PATH)

const documentSidebar = [
  { text: 'React Demo 体验', link: 'demo_react.html', only: ['web'] },
  { text: 'Vue Demo 体验', link: 'demo_vue.html', only: ['web'] },
  { text: 'Demo 体验', link: 'demo.html', only: ['android', 'ios', 'react-native', 'flutter'] },
  { text: '快速开始', link: 'quickstart.html', except: ['windows', 'react-native', 'flutter', 'unity', 'server-side', 'applet'] },
  { text: '快速开始', link: 'quickstart.html', only: ['windows', 'react-native', 'flutter', 'unity'] },
  { text: '集成 SDK', link: 'integration.html', except: ['server-side', 'applet']},
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
    text: '消息管理',
    collapsible: true,
    children: [
      { text: '消息概述', link: 'message_overview.html' },
      { text: '发送消息', link: 'message_send.html' },
      { text: '接收消息', link: 'message_receive.html' },
      { text: '获取历史消息', link: 'message_retrieve.html' },
      { text: '撤回消息', link: 'message_recall.html' },
      { text: '搜索消息', link: 'message_search.html', except: ['web']},
      { text: '消息回执', link: 'message_receipt.html'},
      { text: '修改消息', link: 'message_modify.html'},
      { text: '消息表情回复', link: 'reaction.html' },
      { text: '转发消息', link: 'message_forward.html', except: ['web']},
      { text: '导入和插入消息', link: 'message_import_insert.html', except: ['web']},
      { text: '更新消息', link: 'message_update.html', except: ['web']},
      { text: '删除消息', link: 'message_delete.html' },    
      { text: '定向消息', link: 'message_target.html' },    
      { text: '消息扩展', link: 'message_extension.html' },    
      { text: '置顶消息', link: 'message_pin.html'},         
      { text: '翻译消息', link: 'message_translation.html', except: ['harmonyos']},
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
      { text: '管理群组属性', link: 'group_attributes.html' },
      { text: '管理子区', link: 'thread.html', except: ['harmonyos'] },
      { text: '管理子区消息', link: 'thread_message.html', except: ['harmonyos'] }
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
    text: '用户相关',
    collapsible: true,
    children: [
      { text: '用户关系', link: 'user_relationship.html' },
      { text: '用户属性', link: 'userprofile.html' },
      { text: '在线状态订阅', link: 'presence.html' },
    ],
    except: ['server-side', 'applet']
  },
  {
    text: '离线推送', 
    collapsible: true,
    children: [
      { text: '离线推送概述', link: 'push/push_overview.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter'] },
      { 
        text: '集成第三方推送', 
        collapsible: true,
        children: [
          { text: 'FCM 推送', link: 'push/push_fcm.html', only: ['android'] }, 
          { text: '华为推送', link: 'push/push_huawei.html', only: ['android'] }, 
          { text: '荣耀推送', link: 'push/push_honor.html', only: ['android'] }, 
          { text: 'OPPO 推送', link: 'push/push_oppo.html', only: ['android'] }, 
          { text: 'vivo 推送', link: 'push/push_vivo.html', only: ['android'] }, 
          { text: '小米推送', link: 'push/push_xiaomi.html', only: ['android'] }, 
          { text: '魅族推送', link: 'push/push_meizu.html', only: ['android'] }, 
          { text: 'APNs 推送', link: 'push/push_apns.html', only: ['ios'] }, 
          { text: 'HarmonyOS 推送', link: 'push/push_harmony.html', only: ['harmonyos'] }
          ]
        }, 
        { text: '上传推送证书', link: 'push/push_easemob_console.html', only: ['react-native'] },
        { text: '上传推送证书及绑定推送信息', link: 'push/push_easemob_console.html', only: ['flutter'] },
        { text: '获取或更新推送 token', link: 'push/push_get_device_token.html', only: ['react-native'] },
        { text: '发送推送 token 到环信服务器', link: 'push/push_send_token_to_server.html', only: ['react-native'] },
        { text: '解析推送消息', link: 'push/push_parsing.html', only: ['android', 'ios'] },
        { text: '统一获取消息方案', link: 'push/push_parsing_unified.html', only: ['android'] },
        { text: '设置通知的显示内容', link: 'push/push_display.html', only: ['android', 'ios', 'harmonyos', 'react-native', 'flutter'] },
        { text: '设置通知方式和免打扰', link: 'push/push_notification_mode_dnd.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter']},
        { text: '设置推送模板', link: 'push/push_template.html', only: ['web']},
        { text: '设置推送翻译', link: 'push/push_translation.html', only: ['android', 'ios', 'web', 'react-native', 'flutter']},
        { text: '设置推送扩展功能', link: 'push/push_extension.html', only: ['android', 'ios', 'web', 'react-native', 'flutter']},
        { text: '推送消息分类', link: 'push/push_message_classification.html', only: ['android'] },
        { text: '常见问题', link: 'push/push_solution.html', only: ['android', 'ios','harmonyos']},
      ],
      except: ['applet','server-side']
  },
  { text: '错误码', link: 'error.html', except: ['server-side', 'applet']},
  { text: 'API 参考', link: 'apireference.html', except: ['server-side', 'applet']},
  { text: '更新日志', link: 'releasenote.html', except: ['server-side', 'applet']},
  {
    text: '常见方案',
    collapsible: true,
    children: [
      { text: '群 @ 消息', link: 'group_@.html', only: ['android', 'ios', 'web'] },
      { text: '消息引用', link: 'message_quote.html', only: ['android', 'ios', 'web'] },
      { text: '实现输入指示器', link: 'typing_indication.html', only: ['android', 'ios', 'web', 'react-native', 'flutter', 'unity', 'windows'] },
    ],
  },
  { text: '获取 SDK 日志', link: 'log.html', except: ['flutter', 'server-side', 'applet'] },
  { text: '常见问题', link: 'faq.html', only: ['react-native'] },
  { text: '苹果隐私策略', link: 'privacy_policy.html', only: ['ios'] },
  { text: '精简版 SDK', link: 'elite_sdk.html', only: ['android', 'ios']},
  {
    text: '产品介绍',
    children: [
      { text: '环信小程序全平台解决方案', link: 'overview.html' },
      { text: '小程序 SDK 更新日志', link: 'releasenote.html' },
    ],
    only: ['applet']
  },
  {
    text: '用户指南',
    children: [
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
      },
      { text: '初始化', link: 'initialization.html' },
      {
        text: '登录',
        collapsible: true,
        children: [
          { text: '登录介绍', link: 'login.html' },
          { text: '连接', link: 'connection.html' },
          { text: '多设备登录', link: 'multi_device.html' },
        ],  
      },
      {
        text: '消息管理',
        collapsible: true,
        children: [
          { text: '消息概述', link: 'message_overview.html' },
          { text: '发送消息', link: 'message_send.html' },
          { text: '接收消息', link: 'message_receive.html' },
          { text: '获取历史消息', link: 'message_retrieve.html' },
          { text: '撤回消息', link: 'message_recall.html' },
          { text: '消息回执', link: 'message_receipt.html' }, 
          { text: '消息表情回复', link: 'reaction.html' },
          { text: '修改消息', link: 'message_modify.html' },
          { text: '删除消息', link: 'message_delete.html' },
          { text: '定向消息', link: 'message_target.html' }, 
          { text: '消息扩展', link: 'message_extension.html' },    
          { text: '置顶消息', link: 'message_pin.html' }, 
          { text: '翻译消息', link: 'message_translation.html' },
          { text: '只投在线用户', link: 'message_deliver_only_online.html'},  
          { text: '消息审核（举报）', link: 'moderation.html'},      
        ]
      },
      {
        text: '会话管理',
        collapsible: true,
        children: [
          { text: '会话介绍', link: 'conversation_overview.html' },
          { text: '会话列表', link: 'conversation_list.html' },
          { text: '会话未读数', link: 'conversation_unread.html' },
          { text: '置顶会话', link: 'conversation_pin.html' },
          { text: '会话标记', link: 'conversation_mark.html'},
          { text: '删除会话', link: 'conversation_delete.html'},
        ]
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
            text: '子区管理',
            collapsible: true,
            children: [
              { text: '管理子区', link: 'thread.html' },
              { text: '管理子区消息', link: 'thread_message.html' }
            ]
          },
        ]
      },
      {
        text: '聊天室管理',
        collapsible: true,
        children: [
          { text: '聊天室概述', link: 'room_overview.html' },
          { text: '创建和管理聊天室', link: 'room_manage.html' },
          { text: '管理聊天室成员', link: 'room_members.html' },
          { text: '管理聊天室属性', link: 'room_attributes.html' },
        ]
      },
      {
        text: '用户相关',
        collapsible: true,
        children: [
          { text: '用户关系', link: 'user_relationship.html' },
          { text: '用户属性', link: 'userprofile.html' },
          { text: '在线状态订阅', link: 'presence.html' },
        ]
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
        ]
      }, 
    ],
    only: ['applet']
  },
  {
    text: '错误排查',
    children: [
      { text: '错误码', link: 'error.html' },
      { text: '日志', link: 'log.html' },
    ],
    only: ['applet']
  },
  {
    text: '其他帮助',
    children: [
      { text: '小程序 API 文档', link: 'apidoc.html' },
      { text: 'Uniapp 生成原生 Android、iOS 应用', link: 'uniappnativeapp.html' },
      { text: '小程序模板使用指南', link: 'uniappuikit.html' },
      { text: '如何配置服务器域名', link: 'serverconfig.html' },
      { text: 'Vue3 项目在 H5 平台发布的注意事项', link: 'vue3_project_h5.html' },
    ],
    only: ['applet']
  },
  { text: '服务端 API 概述', link: 'overview.html', only: ['server-side'] },
  { text: 'API 频率限制', link: 'limitationapi.html', only: ['server-side'] },
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
      { text: '发送全局广播消息', link: 'message_broadcast.html' },
      { text: '上传和下载文件', link: 'message_download.html' },
      { text: '获取历史消息记录', link: 'message_historical.html' },
      { text: '设置指定消息附件的存储方式', link: 'message_attachment_storage.html' },
      { text: '消息表情回复', link: 'reaction.html' },
      { text: '撤回消息', link: 'message_recall.html' },
      { text: '单向删除会话', link: 'conversation_delete.html' },
      { text: '单向删除漫游消息', link: 'message_delete.html' },
      { text: '修改消息', link: 'message_modify.html' },
      {
        text: '消息翻译',
        collapsible: true,
        children: [
        { text: '翻译消息内容', link: 'message_translation_text.html' },
        { text: '获取翻译语言列表', link: 'message_translation_language_list.html' },
        { text: '检测文本的源语言', link: 'message_translation_detect.html' },
        ],
      },
      { text: '获取离线消息数据', link: 'message_offline.html' },
      { text: '导入消息', link: 'message_import.html' }
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
          {text: '获取 App 中的群组', link: 'group_member_add_delete.html' }, 
          {text: '获取用户加入的群组', link: 'group_member_admin.html' }, 
          {text: '获取群组详情', link: 'group_member_obtain.html' }, 
         ], 
      },
      { 
        text: '管理群组', 
         collapsible: true,
         children: [
          {text: '修改群组详情', link: 'group_create.html' }, 
          {text: '封禁群组', link: 'group_create.html' }, 
          {text: '解禁群组', link: 'group_create.html' }, 
          {text: '解散群组', link: 'group_create.html' }, 
         ], 
      },
      { 
        text: '管理群组公告', 
         collapsible: true,
         children: [
          {text: '获取群组公告', link: 'group_create.html' }, 
          {text: '修改群组公告', link: 'group_create.html' }, 
         ], 
      },
      { text: '管理群组共享文件', 
        collapsible: true,
        children: [
          { text: '获取群组共享文件', link: 'group_create.html' },
          { text: '上传群组共享文件', link: 'group_create.html' },
          { text: '下载群组共享文件', link: 'group_create.html' },
          { text: '删除群组共享文件', link: 'group_create.html' },
        ]  
      },
      { text: '拉人入群', link: 'group_member_allowlist.html' },
      { text: '踢人出群', link: 'group_member_mutelist.html' },
      { text: '管理群成员', 
        collapsible: true,
        children: [
          { text: '获取群成员列表', link: 'group_create.html' },
          { 
            text: '管理群主和管理员', 
            collapsible: true,
            children: [
              { text: '转让群主', link: 'group_create.html' },
              { text: '添加管理员', link: 'group_create.html' },
              { text: '获取管理员列表', link: 'group_create.html' },
              { text: '删除管理员', link: 'group_create.html' },
            ]  
          },
          { 
            text: '管理禁言', 
            collapsible: true,
            children: [
              { text: '禁言指定成员', link: 'group_create.html' },
              { text: '禁言全员', link: 'group_create.html' },
              { text: '解除成员禁言', link: 'group_create.html' },
              { text: '解除全员禁言', link: 'group_create.html' },
              { text: '获取禁言列表', link: 'group_create.html' },
            ]  
          },
          { 
            text: '管理白名单', 
            collapsible: true,
            children: [
              { text: '添加单个用户至白名单', link: 'group_create.html' },
              { text: '批量添加白名单', link: 'group_create.html' },
              { text: '删除白名单', link: 'group_create.html' },
              { text: '获取白名单列表', link: 'group_create.html' },
            ]  
          },
          { 
            text: '管理黑名单', 
            collapsible: true,
            children: [
              { text: '添加单个用户至黑名单', link: 'group_create.html' },
              { text: '批量添加黑名单', link: 'group_create.html' },
              { text: '删除单个黑名单用户', link: 'group_create.html' },
              { text: '批量删除黑名单用户', link: 'group_create.html' },
              { text: '获取黑名单列表', link: 'group_create.html' },
            ]  
          },
          { text: '查看用户是否加入群组', link: 'group_create.html' },
          { 
            text: '管理群成员自定义属性', 
            collapsible: true,
            children: [
              { text: '设置群成员自定义属性', link: 'group_create.html' },
              { text: '批量设置群成员自定义属性', link: 'group_create.html' },
              { text: '获取单个群成员自定义属性', link: 'group_create.html' },
              { text: '根据属性 key 获取群成员自定义属性', link: 'group_create.html' },
            ]  
          },
        ]  
      },
      { 
            text: '管理子区', 
            collapsible: true,
            children: [
              { text: '创建子区', link: 'group_create.html' },
              { text: '修改子区', link: 'group_create.html' },
              { text: '删除子区', link: 'group_create.html' },
              { text: '获取 app 中的子区', link: 'group_create.html' },
              { text: '获取用户加入的所有子区', link: 'group_create.html' },
              { text: '获取用户在群组中加入的子区', link: 'group_create.html' },
              { text: '获取子区成员列表', link: 'group_create.html' },
              { text: '批量加入子区', link: 'group_create.html' },
              { text: '批量踢出子区', link: 'group_create.html' },
            ]  
          },
    ],
    only: ['server-side']
  },
  { 
    text: '聊天室管理',
    collapsible: true,
    children: [
      { text: '管理超级管理员', link: 'chatroom_superadmin.html' },
      { text: '管理聊天室', link: 'chatroom_manage.html' },
      { text: '管理聊天室属性', link: 'chatroom_attribute.html' },
      { 
        text: '管理聊天室成员', 
        collapsible: true,
        children: [
          { text: '获取成员列表', link: 'chatroom_member_obtain.html' },
          { text: '添加/移除成员', link: 'chatroom_member_add_delete.html' },
          { text: '管理聊天室所有者/管理员', link: 'chatroom_member_admin.html' },
          { text: '管理禁言', 
            collapsible: true,
            children: [
              { text: '多个或全体成员禁言',  link: 'chatroom_member_mutelist.html' },
              { text: '标签禁言',  link: 'chatroom_label_mute.html' }
            ]
          },  
          { text: '管理白名单', link: 'chatroom_member_allowlist.html' },
          { text: '管理黑名单', link: 'chatroom_member_blocklist.html' }
        ]  
      }
    ],
    only: ['server-side']
  },
  { 
    text: '用户相关',
    collapsible: true,
    children: [
      { text: '用户体系管理', link: 'account_system.html' },
      { text: '用户属性', link: 'userprofile.html' },
      { text: '用户状态订阅', link: 'presence.html' },
      { 
        text: '用户关系',
        collapsible: true,
        children: [
          { text: '添加好友', link: 'user_relationship_friend_add.html' },
          { text: '校验好友', link: 'user_relationship_friend_check.html' },
          { text: '删除单个好友', link: 'user_relationship_friend_remove.html' },
          { text: '删除所有好友', link: 'user_relationship_friend_remove_all.html' },
          { text: '设置好友备注', link: 'user_relationship_remark_set.html' },
          { text: '分页获取好友列表', link: 'user_relationship_friend_list_paged.html' },
          { text: '一次性获取好友列表', link: 'user_relationship_friend_list_obtain.html' },
          { text: '导入好友列表', link: 'user_relationship_friend_import.html' },
          { text: '添加用户至黑名单', link: 'user_relationship_blocklist_add.html' },
          { text: '从黑名单中移除用户', link: 'user_relationship_blocklist_remove.html' },
          { text: '获取黑名单列表', link: 'user_relationship_blocklist_obtain.html' },
          { text: '校验黑名单', link: 'user_relationship_blocklist_check.html' }
         ]
        },
        { text: '用户全局禁言', link: 'user_global_mute.html' },
        { text: '用户收藏', link: 'user_favorite.html'}
      ],
      only: ['server-side']
  },
  { 
    text: '离线推送',
    collapsible: true,
    children: [
      { text: '离线推送设置', link: 'push.html' },
      { text: '离线推送的消息扩展', link: 'push_extension.html' },
      { text: '查询离线推送结果', link: 'push_result_statistics.html' }
    ],
    only: ['server-side']
  },
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
  }, 
  { text: '错误码', link: 'error.html', only: ['server-side']},
  {
    text: '设置回调',
    collapsible: true,
    children: [
      { text: '回调概述', link: 'callback_overview.html' },
      { text: '发送前回调', link: 'callback_presending.html' },
      { text: '发送后回调', link: 'callback_postsending.html' },
      { text: '发送后回调事件',
        collapsible: true,
        children: [
          { text: '用户登入/登出', link: 'callback_login_logout.html' },
          { text: '发送消息', link: 'callback_message_send.html' },
          { text: '发送单聊消息已读回执', link: 'callback_single_read_ack.html' },
          { text: '发送群聊消息已读回执', link: 'callback_group_read_ack.html' },
          { text: '发送会话已读回执', link: 'callback_single_conversation_ack.html' },
          { text: '修改消息', link: 'callback_message_modify.html' },
          { text: '撤回消息', link: 'callback_message_recall.html' },
          { text: '群组/聊天室操作（新）', 
            collapsible: true,
            children: [
              { text: '创建群组/聊天室', link: 'callback_group_room_create.html' },
              { text: '更新群组/聊天室',
                collapsible: true,
                children: [
                  { text: '更新群组_聊天室信息', link: 'callback_group_room_info.html' },
                  { text: '变更群主/聊天室所有者', link: 'callback_group_room_owner.html' },
                  { text: '设置/更新公告', link: 'callback_group_room_announcement.html' },
                  { text: '封禁/解禁群组', link: 'callback_group_ban.html' },
                  { text: '全员禁言', link: 'callback_group_room_muteall.html' }
                ]
              },
              { text: '删除群组/聊天室', link: 'callback_group_room_delete.html' },
              { text: '屏蔽/解除屏蔽群组', link: 'callback_group_block.html' },
              { text: '上传/删除群共享文件', link: 'callback_group_shared_file.html' },
              { text: '用户加入', link: 'callback_group_room_join.html' },
              { text: '成员离开', link: 'callback_group_room_leave.html' },
              { text: '添加/移除管理员', link: 'callback_group_room_admin.html' },
              { text: '加入/移出禁言列表', link: 'callback_group_room_mute.html' },
              { text: '添加/移出白名单', link: 'callback_group_room_allowlist.html' },
              { text: '加入/移出黑名单', link: 'callback_group_room_blocklist.html' },
              { text: '添加/移除聊天室超级管理员', link: 'callback_room_superadmin.html' }
            ]
          },
          { text: '群组/聊天室操作（旧）', link: 'callback_group_room_old.html' },
          { text: '用户关系操作', link: 'callback_contact.html' },
          { text: '离线推送', link: 'callback_offline_push.html' },
          { text: 'Reaction', link: 'callback_reaction.html' },
          { text: 'Thread', link: 'callback_thread.html' },
          { text: '敏感词监测', link: 'callback_sensitive_word.html' }
        ]
      }
    ],
    only: ['server-side']
  },
  {
    text: 'Server SDK',
    collapsible: true,
    children: [
      { text: 'Java Server SDK 2.0', link: 'java_server_sdk_2.0.html' },
      { text: 'Java Server SDK 1.0', link: 'java_server_sdk.html' },
      // { text: 'PHP Server SDK', link: 'php_server_sdk.html' }
    ],
    only: ['server-side']
  },
  {
    text: 'API Reference',
    collapsible: true,
    children: [
      { text: 'Java Server SDK 2.0', link: 'apireference_java_2.0.html' },
      { text: 'Java Server SDK 1.0', link: 'apireference_java_1.0.html' },
      // { text: 'PHP Server SDK', link: 'php_server_sdk.html' }
    ],
    only: ['server-side']
  },
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
    const key = `/document/${platform}/`
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
      const newLink = `/document/${platform}/${sidebar.link}`
      return {...sidebar, link:newLink}
    }
  }
}

export const DOC_SIDEBAR = buildDocSidebar()

// console.dir(buildDocSidebar(), {depth: null})

