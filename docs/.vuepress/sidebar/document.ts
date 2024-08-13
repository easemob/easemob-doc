import path from "node:path"
import fs from "node:fs"

const getSubDirectories = (dir) => fs.readdirSync(dir).filter(item => fs.statSync(path.join(dir, item)).isDirectory())
const DOC_PATH = path.resolve(__dirname, '../../document')
const platformList = getSubDirectories(DOC_PATH)

const documentSidebar = [
  {
    /*
      text: 分组标题
      children: 分组导航列表
        text: 显示的文本
        link: 链接地址
        show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
        only: 数组形式，只有在数组中的平台下显示
        except: 数组形式，除了数组中指定的平台外都显示
        collapsible: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
        children: 子菜单。请参考「子菜单示例」
    */
    text: '快速开始',
    children: [
      { text: 'React Demo（WebIM）体验', link: 'demo_react.html', only: ['web'] },
      { text: 'Vue Demo（WebIM）体验', link: 'demo_vue.html', only: ['web'] },
      { text: 'Demo（EaseIM App）体验', link: 'demo.html', except: ['web', 'windows', 'react-native', 'flutter', 'unity', 'server-side'] },
      { text: '快速开始', link: 'quickstart.html', except: ['windows', 'react-native', 'flutter', 'unity', 'server-side'] },
      { text: '快速开始', link: 'quickstart.html', only: ['windows', 'react-native', 'flutter', 'unity'] },
      { text: '按需导入 SDK（推荐）', link: 'import_sdk_minicore.html', only: ['web'] },
      { text: 'SDK 集成概述', link: 'overview.html', only: ['android', 'ios', 'web', 'harmonyos', 'flutter'] },
      { text: 'SDK 集成概述', link: 'overview.html', only: ['windows', 'react-native', 'unity'] },
      // { text: '私有云 SDK 集成配置', link: 'privatecloud.html', except: ['windows', 'server-side', 'react-native', 'flutter', 'unity'] },
      { text: 'SDK 更新日志', link: 'releasenote.html', except: ['server-side']},
      /*{ text: 'API reference', link: 'apireference.html', only: ['android', 'ios', 'web', 'windows', 'react-native', 'flutter', 'unity']},*/
      { text: '开通和配置服务 console', link: 'enable_and_configure_IM.html', only: ['server-side'] },
      { text: '使用环信 App Token 鉴权', link: 'easemob_app_token.html', only: ['server-side'] },
      { text: '使用环信 User Token 鉴权', link: 'easemob_user_token.html', only: ['server-side'] },
      { text: 'IM 产品使用限制', link: 'limitation.html', only: ['server-side'] },
      { text: '接口频率限制', link: 'limitationapi.html', only: ['server-side'] },
    ],
    except: ['applet', 'electron','linux']
  },
  {
    text: '基础功能',
    children: [
      {
        text: '消息管理',
        collapsible: true,
        children: [
          { text: '消息概述', link: 'message_overview.html' },
          { text: '发送和接收消息', link: 'message_send_receive.html' },
          { text: '获取历史消息', link: 'message_retrieve.html' },
          { text: '撤回消息', link: 'message_recall.html' },
          { text: '搜索消息', link: 'message_search.html', except: ['web', 'harmonyos']},
          { text: '消息回执', link: 'message_receipt.html'},
          { text: '修改消息', link: 'message_modify.html'},
          { text: '转发消息', link: 'message_forward.html', except: ['web']},
          { text: '导入和插入消息', link: 'message_import_insert.html', except: ['web']},
          { text: '更新消息', link: 'message_update.html', except: ['web']},
          { text: '删除消息', link: 'message_delete.html' },    
          { text: '置顶消息', link: 'message_pin.html', except: ['harmonyos']},         
          { text: '翻译消息', link: 'message_translation.html', except: ['harmonyos']},
          { text: '只投在线用户', link: 'message_deliver_only_online.html'},
          { text: '获取消息流量统计', link: 'message_traffic_statis.html', only: ['android', 'ios'] },
        ]
      },
      {
        text: '会话管理',
        collapsible: true,
        children: [
          { text: '会话介绍', link: 'conversation_overview.html' },
          { text: '会话列表', link: 'conversation_list.html' },
          { text: '本地会话', link: 'conversation_local.html', only: ['web'] },
          { text: '会话已读回执', link: 'conversation_receipt.html', only: ['android', 'ios', 'web'] },
          { text: '会话未读数', link: 'conversation_unread.html', except: ['web'] },
          { text: '置顶会话', link: 'conversation_pin.html' },
          { text: '会话标记', link: 'conversation_mark.html' },
          { text: '删除会话', link: 'conversation_delete.html' },
        ]
      },
      { text: '管理用户属性', link: 'userprofile.html' },
      { text: '管理用户关系', link: 'user_relationship.html' },
      {
        text: '群组管理',
        collapsible: true,
        children: [
          { text: '群组概述', link: 'group_overview.html' },
          { text: '创建和管理群组', link: 'group_manage.html' },
          { text: '管理群组成员', link: 'group_members.html' },
          { text: '管理群组属性', link: 'group_attributes.html' },
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
    ],
    except: ['applet', 'server-side', 'electron','linux']
  },
  {
    text: '进阶功能',
    children: [
      { 
        text: '离线推送', 
        collapsible: true,
        children: [
          { text: '离线推送概述', link: 'push/push_overview.html', only: ['android', 'ios', 'web','harmonyos'] },
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
          { text: '解析推送消息', link: 'push/push_parsing.html', only: ['android', 'ios'] },
          { text: '设置通知的显示内容', link: 'push/push_display.html', only: ['android', 'ios'] },
          { text: '设置通知方式和免打扰', link: 'push/push_notification_mode_dnd.html', only: ['android', 'ios', 'web']},
          { text: '设置推送模板', link: 'push/push_template.html', only: ['web']},
          { text: '设置推送翻译', link: 'push/push_translation.html', only: ['android', 'ios', 'web']},
          { text: '设置推送扩展功能', link: 'push/push_extension.html', only: ['android', 'ios', 'web']},
          { text: '推送消息分类', link: 'push/push_channel_restrict_solution.html', only: ['android'] },
          { text: 'FAQ', link: 'push/push_solution.html', only: ['android', 'ios','harmonyos']},
        ]
      },
      { text: '登录多个设备', link: 'multi_device.html' },
      { text: '管理在线状态订阅', link: 'presence.html', except: ['harmonyos'] },
      { text: '消息表情回复', link: 'reaction.html' },
      {
        text: '子区管理',
        collapsible: true,
        children: [
          { text: '管理子区', link: 'thread.html', except: ['harmonyos'] },
          { text: '管理子区消息', link: 'thread_message.html', except: ['harmonyos'] }
        ]
      },
      { text: '消息审核（举报）', link: 'moderation.html', except: ['harmonyos']},
    ],
    except: ['applet','server-side','electron','linux']
  },
  {
    text: '其他',
    children: [
      { text: '错误码', link: 'error.html' },
      //{ text: 'EaseIMKit 使用指南', link: 'easeimkit.html', except: ['web', 'windows', 'react-native', 'flutter', 'unity'] },
      { text: 'EaseCallKit 使用指南', link: 'easecallkit.html', except: ['web', 'windows', 'react-native', 'flutter', 'unity', 'harmonyos'] },
      { text: '苹果隐私策略', link: 'privacy_policy.html', only: ['ios'] },
    ],
    except: ['applet', 'server-side','electron','linux']

  },
  {
    text: '精简版 SDK',
    children: [
      { text: '精简版 SDK 使用说明', link: 'elite_sdk.html' },
    ],
    only: ['android', 'ios']
  },
  {
    text: '产品介绍',
    children: [
      { text: '环信小程序全平台解决方案', link: 'overview.html' },
      { text: '小程序 SDK 更新日志', link: 'releasenote.html' },
    ],
    only: ['applet']
  },
  {
    text: '集成介绍',
    children: [
      { text: '微信小程序', link: 'wechat.html' },
      { text: 'QQ 小程序', link: 'qq.html' },
      { text: '百度小程序', link: 'baidu.html' },
      { text: '抖音小程序', link: 'bytedance.html' },
      { text: '支付宝小程序', link: 'alipay.html' },
      { text: 'Uniapp 全平台', link: 'uniapp.html' },
      { text: '小程序 API 文档', link: 'apidoc.html' },
    ],
    only: ['applet']
  },
  {
    text: '基本功能',
    children: [
      { text: '初始化及登录', link: 'initialization.html' },
      {
        text: '消息管理',
        collapsible: true,
        children: [
          { text: '消息概述', link: 'message_overview.html' },
          { text: '发送和接收消息', link: 'message_send_receive.html' },
          { text: '获取历史消息', link: 'message_retrieve.html' },
          { text: '撤回消息', link: 'message_recall.html' },
          { text: '消息回执', link: 'message_receipt.html' }, 
          { text: '修改消息', link: 'message_modify.html' },
          { text: '删除消息', link: 'message_delete.html' },
          { text: '置顶消息', link: 'message_pin.html' }, 
          { text: '翻译消息', link: 'message_translation.html' },
          { text: '只投在线用户', link: 'message_deliver_only_online.html'},        
        ]
      },
      {
        text: '会话管理',
        collapsible: true,
        children: [
          { text: '会话介绍', link: 'conversation_overview.html' },
          { text: '会话列表', link: 'conversation_list.html' },
          { text: '本地会话', link: 'conversation_local.html' },
          { text: '会话未读数', link: 'conversation_unread.html' },
          { text: '置顶会话', link: 'conversation_pin.html' },
          { text: '会话标记', link: 'conversation_mark.html'},
          { text: '删除会话', link: 'conversation_delete.html'},
        ]
      },
      { text: '管理用户属性', link: 'userprofile.html' },
      { text: '管理用户关系', link: 'user_relationship.html' },
      {
        text: '群组管理',
        collapsible: true,
        children: [
          { text: '群组概述', link: 'group_overview.html' },
          { text: '创建和管理群组', link: 'group_manage.html' },
          { text: '管理群组成员', link: 'group_members.html' },
          { text: '管理群组属性', link: 'group_attributes.html' },
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
    ],
    only: ['applet']
  },
  {
    text: '进阶功能',
    children: [
      { text: '离线推送', 
        collapsible: true,
        children: [
        { text: '离线推送概述', link: 'push/push_overview.html' }, 
        { text: '设置通知方式和免打扰', link: 'push/push_notification_mode_dnd.html' },
        { text: '设置推送模板', link: 'push/push_template.html' },
        { text: '设置推送翻译', link: 'push/push_translation.html' },
        { text: '设置推送扩展功能', link: 'push/push_extension.html' }
        ]
      }, 
      { text: '登录多个设备', link: 'multi_device.html' },
      { text: '管理在线状态订阅', link: 'presence.html' },
      { text: '消息表情回复', link: 'reaction.html' },
      {
        text: '子区管理',
        collapsible: true,
        children: [
          { text: '管理子区', link: 'thread.html' },
          { text: '管理子区消息', link: 'thread_message.html' }
        ]
      },
      { text: '消息审核（举报）', link: 'moderation.html'},
    ],
    only: ['applet']
  },
  {
    text: '其他帮助',
    children: [
      { text: '错误码', link: 'error.html' },
      { text: 'Uniapp 生成原生 Android、iOS 应用', link: 'uniappnativeapp.html' },
      { text: '小程序模板使用指南', link: 'uniappuikit.html' },
      { text: '如何配置服务器域名', link: 'serverconfig.html' },
    ],
    only: ['applet']
  },
  {
    text: 'SDK 集成介绍',
    children: [
      { text: '集成说明', link: 'overview.html' },
      { text: 'SDK 基础功能', link: 'sdk_basic_function.html' },
      { text: 'Demo 下载体验', link: 'demo_download.html' },
      { text: '桌面 SDK API 文档', link: 'sdk_api.html' },
    ],
    only: ['electron']
  },
  {
    text: 'IM 基本功能',
    children: [
      { text: '消息', link: 'message.html' },
      { text: '会话管理', link: 'conversation.html' },
      { text: '用户关系管理', link: 'contact.html' },
      { text: '群组', link: 'group.html' },
      { text: '聊天室', link: 'chatroom.html' },
      { text: '多设备监听', link: 'multi_device.html' },
      { text: '附录', link: 'annex.html' },
    ],
    only: ['electron']
  },
  {
    text: '更新日志',
    children: [
      { text: 'SDK 更新日志', link: 'releasenote.html' },
    ],
    only: ['electron']
  },
  {
    text: 'Linux SDK 集成介绍',
    children: [
      { text: 'Linux SDK 集成说明', link: 'overview.html' },
      { text: '技术参数', link: 'technical_parameter.html' },
      { text: 'Linux SDK 更新日志', link: 'releasenote.html' },
    ],
    only: ['linux']
  },
  {
    text: '服务端 REST API',
    children: [
      { text: '即时通讯 REST API 概览', link: 'overview.html' },
      { text: '用户体系管理', link: 'account_system.html' },
      { 
        text: '消息管理', 
        children: [
          { text: '发送单聊消息', link: 'message_single.html' },
          { text: '发送群聊消息', link: 'message_group.html' },
          { text: '发送聊天室消息', link: 'message_chatroom.html' },
          { text: '上传和下载文件', link: 'message_download.html' },
          { text: '获取历史消息记录', link: 'message_historical.html' },
          { text: '撤回消息和单向删除会话', link: 'message_recall.html' },
          { text: '单向删除漫游消息', link: 'message_delete.html' },
          { text: '修改文本或自定义消息', link: 'message_modify_text_custom.html' },
          { text: '导入消息', link: 'message_import.html' }
        ]
      },
      { text: '用户属性', link: 'userprofile.html' },
      { text: '用户关系管理', link: 'user_relationship.html' },
      { text: '群组', link: 'group.html' },
      { text: '聊天室', link: 'chatroom.html' },
      { text: '在线状态订阅', link: 'presence.html' },
      { text: '消息表情回复', link: 'reaction.html' },
      { text: '离线推送', link: 'push.html' },
    ],
    only: ['server-side']
  },
  {
    text: 'Server SDK',
    children: [
      { text: 'Java Server SDK 2.0', link: 'java_server_sdk_2.0.html' },
      { text: 'Java Server SDK 1.0', link: 'java_server_sdk.html' },
      { text: 'PHP Server SDK', link: 'php_server_sdk.html' },
    ],
    only: ['server-side']
  },
  {
    text: '错误码',
    children: [
      { text: '错误码', link: 'error.html' }
    ],
    only: ['server-side']
  },
  {
    text: '设置回调',
    children: [
      { text: '设置回调', link: 'callback.html' },
      { text: '发送后回调-事件回调', link: 'callback_configurations.html' }
    ],
    only: ['server-side']
  }
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

