import path from "node:path"
import fs from "node:fs"

const getSubDirectories = (dir) => fs.readdirSync(dir).filter(item => fs.statSync(path.join(dir, item)).isDirectory() &&  item !== 'privatization')
const DOC_PATH = path.resolve(__dirname, '../../document/v1')
const platformList = getSubDirectories(DOC_PATH)

const privateSidebar = {
  '/document/v1/privatization/': [ 
    {
      text: '产品简介', 
      children: [
        { text: '产品概述', link: 'uc_introduction.html' },
        { text: '产品使用限制', link: 'uc_limitation.html' },
        { text: '术语表', link: 'uc_glossary.html' },
      ]
    } ,
    {
        text: '快速开始', 
        children: [
          /**{ text: '服务部署', link: 'uc_deploy.html' },
          { text: '客户端下载', link: 'uc_private.html' },**/
          { text: 'Console指南', link: 'uc_configure.html' },
          { text: 'App Token 鉴权', link: 'easemob_app_token.html' },
          { text: 'User Token 鉴权', link: 'easemob_user_token.html' },
          { text: '快速开始(不使用 UIKIT) Android', link: '/document/v1/android/overview.html' },
          { text: '快速开始(不使用 UIKIT)iOS', link: '/document/v1/ios/quickstart.html' },
          { text: '快速开始(不使用 UIKIT) Web', link: '/document/v1/web/quickstart.html' },
        ]   
      } ,
  ]
}

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
     /** { text: 'React Demo（WebIM）体验', link: 'demo_react.html', only: ['web'] },
      { text: 'Vue Demo（WebIM）体验', link: 'demo_vue.html', only: ['web'] },
      { text: 'Demo（EaseIM App）体验', link: 'demo.html', except: ['web', 'windows', 'react-native', 'flutter', 'unity', 'server-side'] },*/ 
      { text: '快速开始（不使用 EaseIMKIT）', link: 'quickstart.html', except: ['windows', 'react-native', 'flutter', 'unity', 'server-side'] },
      { text: '快速开始 （不使用 UIKit）', link: 'quickstart.html', only: ['windows', 'react-native', 'flutter', 'unity'] },
      { text: 'SDK 集成概述（不使用 EaseIMKIT）', link: 'overview.html', only: ['android', 'ios', 'web', 'flutter'] },
      { text: 'SDK 集成概述（不使用 UIKit）', link: 'overview.html', only: ['windows', 'react-native', 'unity'] },
      { text: '私有云 SDK 集成配置', link: 'privatecloud.html', except: ['windows', 'server-side', 'react-native', 'flutter', 'unity'] },
      { text: 'SDK 更新日志', link: 'releasenote.html', except: ['server-side']},
      /*{ text: 'API reference', link: 'apireference.html', only: ['android', 'ios', 'web', 'windows', 'react-native', 'flutter', 'unity']},*/
      { text: '开通和配置服务 console', link: 'enable_and_configure_IM.html', only: ['server-side'] },
      { text: '使用环信 App Token 鉴权', link: 'easemob_app_token.html', only: ['server-side'] },
      { text: '使用环信 User Token 鉴权', link: 'easemob_user_token.html', only: ['server-side'] },
      { text: 'IM 产品使用限制', link: 'limitation.html', only: ['server-side'] },
     /** { text: '接口频率限制', link: 'limitationapi.html', only: ['server-side'] },**/ 
    ],
    except: ['applet','linux','electron']
  },
  {
    text: '基础功能',
    children: [
      {text: '消息管理', link: 'message.html' },
        /**
        {text: '消息管理',
        collapsible: true,
        children: [
          { text: '消息概述', link: 'message_overview.html' },
          { text: '发送和接收消息', link: 'message_send_receive.html' },
          { text: '管理本地消息数据', link: 'message_manage.html', except: ['web', 'react-native'] },
          { text: '管理会话和消息', link: 'message_manage.html', only: ['react-native'] },
          { text: '管理服务端消息', link: 'message_retrieve.html', except: ['react-native'] },
          { text: '管理消息回执', link: 'message_receipt.html' },
          { text: '修改消息', link: 'message_modify.html' },
          { text: '翻译', link: 'message_translation.html' },
        ]
      },**/
      /** { text: '管理用户属性', link: 'userprofile.html' },**/
      { text: '好友管理', link: 'user_relationship.html' },
      /**{
        text: '群组管理',
        collapsible: true,
        children: [
          { text: '群组概述', link: 'group_overview.html' },
          { text: '创建和管理群组', link: 'group_manage.html' },
          { text: '管理群组成员', link: 'group_members.html' },
          { text: '管理群组属性', link: 'group_attributes.html' },
        ]
      },**/
      { text: '群组管理', link: 'group.html' },
      { text: '聊天室管理', link: 'chatroom.md' },
      { text: '多设备管理', link: 'multidevices.md' },
      { text: '导入第三方表情包', link: 'sticker.md' , only: ['web'] },
      /**{
        text: '聊天室管理',
        collapsible: true,
        children: [
          { text: '聊天室概述', link: 'room_overview.html' },
          { text: '创建和管理聊天室', link: 'room_manage.html' },
          { text: '管理聊天室成员', link: 'room_members.html' },
          { text: '管理聊天室属性', link: 'room_attributes.html' },
        ]
      },**/
    ],
    except: ['applet', 'server-side', 'electron']
  },
  {
    text: '消息推送',
    children: [
      { text: '第三方推送集成', link: 'thirdpartypush.html' },
      { text: '第三方推送异常情况说明', link: 'exceptions.html' },
      { text: '设置当前登录用户的推送昵称', link: 'nickname.html' },
      { text: '离线推送问题排查', link: 'troubleshooting.html' },
    ],
    only: ['android']
  },
  {
    text: 'APNs消息推送',
    children: [
      { text: 'APNs推送配置', link: 'deploy.html' },
      { text: 'APNs离线推送', link: 'offline.html' },
      { text: 'APNs内容解析', link: 'content.md' },
      /*{ text: '离线推送问题排查', link: '../android/troubleshooting.html' },*/
    ],
    only: ['ios']
  },
  {
    text: '其他',
    children: [
      { text: '错误码', link: 'error.html' },
      { text: '工具类说明', link: 'toolrelated.md' , only: ['web'] },
      { text: 'EaseIMKit 使用指南', link: 'easeimkit.html', except: ['web', 'windows', 'react-native', 'flutter', 'unity'] },
      /**{ text: 'EaseCallKit 使用指南', link: 'easecallkit.html', except: ['web', 'windows', 'react-native', 'flutter', 'unity'] },**/
    ],
    except: ['applet', 'server-side']
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
      { text: '字节跳动小程序', link: 'bytedance.html' },
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
          { text: '管理服务端消息', link: 'message_retrieve.html' },
          { text: '管理消息回执', link: 'message_receipt.html' },
         /** { text: '修改消息', link: 'message_modify.html' },
          { text: '翻译', link: 'message_translation.html' },**/ 
        ]
      },
      { text: '用户属性', link: 'userprofile.html' },
      { text: '好友管理', link: 'user_relationship.html' },
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
      { text: '登录多个设备', link: 'multi_device.md' },
      { text: '设置推送', link: 'push.html', except: ['windows', 'react-native', 'flutter', 'unity'] },
      /**{ text: '管理在线状态订阅', link: 'presence.html' },
      { text: '消息表情回复', link: 'reaction.html' },
      {
        text: '子区管理',
        collapsible: true,
        children: [
          { text: '管理子区', link: 'thread.html' },
          { text: '管理子区消息', link: 'thread_message.html' }
        ]
      },
      { text: '消息审核（举报）', link: 'moderation.html'},**/
    ],
    only: ['applet']
  },
  {
    text: '其他帮助',
    children: [
      { text: 'Uniapp 生成原生 Android、iOS 应用', link: 'uniappnativeapp.html' },
      { text: '小程序模板使用指南', link: 'uniappuikit.html' },
      { text: '如何配置服务器域名', link: 'serverconfig.html' },
    ],
    only: ['applet']
  },
  {
    text: '服务端 REST API',
    children: [
      { text: '即时通讯 REST API 概览', link: 'overview.html' },
      { text: '用户体系管理', link: 'account_system.html' },
      /**{ text: '推送设置', link: 'push.html' },**/
      { 
        text: '消息管理', 
        children: [
          { text: '发送单聊消息', link: 'message_single.html' },
          { text: '发送群聊消息', link: 'message_group.html' },
          { text: '发送聊天室消息', link: 'message_chatroom.html' },
          { text: '上传和下载文件', link: 'message_download.html' },
          { text: '获取历史消息记录', link: 'message_historical.html' },
          /**{ text: '导入消息', link: 'message_import.html' }**/
        ]
      },
      { text: '用户属性', link: 'userprofile.html' },
      { text: '用户关系管理', link: 'user_relationship.html' },
      { text: '群组', link: 'group.html' },
      { text: '聊天室', link: 'chatroom.html' },
      /**{ text: '在线状态订阅', link: 'presence.html' },
      { text: '消息表情回复', link: 'reaction.html' },**/
    ],
    only: ['server-side']
  },/**
  {
    text: 'Server SDK',
    children: [
      { text: 'Java Server SDK', link: 'java_server_sdk.html' },
      { text: 'PHP Server SDK', link: 'php_server_sdk.html' },
    ],
    only: ['server-side']
  }, **/
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
      { text: '用户状态回调', link: 'user_status_callback.html' },
      { text: '发送后回调-事件回调', link: 'callback_configurations.html' }
    ],
    only: ['server-side']
  },
  {
    text: 'Linux开发文档',
    children: [
      { text: '集成说明', link: 'overview.html' },
      { text: '技术参数', link: 'techspec.html' },
      { text: 'SDK更新日志', link: 'releasenote.html' },
    ],
    only: ['linux']
  },
  {
    text: '快速开始',
    children: [
      { text: 'Demo下载体验', link: 'demo.html' },
      { text: '快速开始', link: 'quickstart.html' },
      { text: '集成概述', link: 'overview.html' },
      { text: 'SDK更新日志', link: 'releasenote.html' },
    ],
    only: ['electron']
  },
  {
    text: '基础功能',
    children: [
      { text: '消息管理', link: 'message.html' },
      { text: '会话管理', link: 'chatmanage.html' },
      { text: '好友管理', link: 'user_relationship.html' },
      { text: '群组管理', link: 'group_manage.html' },
      { text: '聊天室管理', link: 'room_manage.html' },
    ],
    only: ['electron']
  },
  {
    text: '进阶功能',
    children: [
      { text: '多设备监听', link: 'multi_device.html' },
      { text: '附录', link: 'appendix.html' },
    ],
    only: ['electron']
  },
]

function buildDocSidebar() {
  const result = {...privateSidebar}
  platformList.forEach(platform => {
    const key = `/document/v1/${platform}/`
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
      const newLink = `/document/v1/${platform}/${sidebar.link}`
      return {...sidebar, link:newLink}
    }
  }
}

const DOC_SIDEBAR = buildDocSidebar()
export default DOC_SIDEBAR

// console.dir(buildDocSidebar(), {depth: null})

