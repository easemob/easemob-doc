import path from "node:path"
import fs from "node:fs"
import { REST_SIDEBAR } from "./rest"

const getSubDirectories = (dir) => fs.readdirSync(dir).filter(item => fs.statSync(path.join(dir, item)).isDirectory())
/** V5 客户端 SDK 与 REST 文档已从原 docs/document 拆分。 */
const SDK_PATH = path.resolve(__dirname, '../../sdk/v5')
const platformList = getSubDirectories(SDK_PATH)

/** SDK V5 sidebar template. */
const sdkV5Sidebar = [
  { text: "Beginner's Guide", link: "beginner_guide.html" },
  { text: 'iOS SDK Overview', link: 'sdk_overview.html', only: ['ios'] },
  { text: "Integrate with MCP", link: "easemob_mcp_server.html", except: ['unity', 'windows']},
  { text: 'Quickstart', link: 'quickstart.html', except: ['windows', 'react-native', 'flutter', 'unity'] },
  { text: 'Quickstart', link: 'quickstart.html', only: ['windows', 'react-native', 'flutter', 'unity'] },
  { type: "separator" } as any,
  { text: 'Import SDK', link: 'integration.html', only: ['android', 'ios', 'web','harmonyos', 'unity', 'windows']},
  { text: 'Add Dependencies', link: 'integration.html', only: ['flutter', 'react-native']},
  { text: 'Initialization', link: 'initialization.html'},
  {
    text: 'Login',
    collapsible: true,
    children: [
      { text: 'Login', link: 'login.html' },
      { text: 'Connection', link: 'connection.html' },
      { text: 'Multi-Device Login', link: 'multi_device.html' },
    ],
  },
  {
    text: 'User',
    collapsible: true,
    children: [
      { text: 'User Relationship', link: 'user_relationship.html' },
      { text: 'User Attribute', link: 'userprofile.html' },
      { text: 'Auto User Info Mgmt', link: 'userinfo_provider.html', only: ['android', 'ios', 'web', 'harmonyos']},
      { text: 'Presence', link: 'presence.html' },
    ],
  },
  {
    text: 'Message',
    collapsible: true,
    children: [
      { text: 'Overview', link: 'message_overview.html' },
      { text: 'Send Message', link: 'message_send.html' },
      { text: 'Receive Message', link: 'message_receive.html' },
      { text: 'Receive Streaming Message', link: 'message_stream_receive.html', only: ['android', 'web', 'ios', 'harmonyos', 'flutter', 'react-native'] },
      { text: 'Retrieve History', link: 'message_retrieve.html' },
      { text: 'Recall Message', link: 'message_recall.html' },
      { text: 'Search Local Message', link: 'message_search_local.html', except: ['web'] },
      { text: 'Message Receipt', link: 'message_receipt.html'},
      { text: 'Edit Message', link: 'message_modify.html'},
      { text: 'Reaction', link: 'reaction.html' },
      { text: 'Forward Message', link: 'message_forward.html'},
      { text: 'Import & Insert Message', link: 'message_import_insert.html', except: ['web']},
      { text: 'Update Message', link: 'message_update.html', except: ['web']},
      { text: 'Delete Message', link: 'message_delete.html' },
      { text: 'Targeted Message', link: 'message_target.html' },
      { text: 'Message Extension', link: 'message_extension.html' },
      { text: 'Pin Message', link: 'message_pin.html'},
      { text: 'Deliver to Online Users Only', link: 'message_deliver_only_online.html'},
        ],
      },
  {
    text: 'Conversation',
    collapsible: true,
    children: [
      { text: 'Overview', link: 'conversation_overview.html' },
      { text: 'Conversation List', link: 'conversation_list.html' },
      { text: 'Local Conversation', link: 'conversation_local.html', only: ['web'] },
      { text: 'Conversation Read Receipt', link: 'conversation_receipt.html', only: ['flutter', 'harmonyos','react-native','unity','windows'] },
      { text: 'Conversation Unread Count', link: 'conversation_unread.html'},
      { text: 'Pin Conversation', link: 'conversation_pin.html' },
      { text: 'Conversation Mark', link: 'conversation_mark.html' },
      { text: 'Delete Conversation', link: 'conversation_delete.html' },
    ],
  },  
  {
    text: 'Group',
    collapsible: true,
    children: [
      { text: 'Overview', link: 'group_overview.html' },
      { text: 'Create & Manage Group', link: 'group_manage.html' },
      { text: 'Manage Member', link: 'group_members.html' },
      { text: 'Manage Member Name Card', link: 'group_namecard.html', only: ['android', 'ios', 'web', 'harmonyos'] },
      { text: 'Manage Attribute', link: 'group_attributes.html' },
      { text: 'Manage Thread', link: 'thread.html', except: ['harmonyos'] },
      { text: 'Manage Thread Message', link: 'thread_message.html', except: ['harmonyos'] }
    ],
  },
  {
    text: 'Chat Room',
    collapsible: true,
    children: [
      { text: 'Chat Room Overview', link: 'room_overview.html' },
      { text: 'Create & Manage Chat Room', link: 'room_manage.html' },
      { text: 'Manage Member', link: 'room_members.html' },
      { text: 'Manage Attribute', link: 'room_attributes.html' },
    ],
  },
  {
    text: 'Offline Push',
    collapsible: true,
    children: [
      { text: 'Overview', link: 'push/push_overview.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter'] },
      { text: 'Integrate APNs', link: 'push/push_apns.html', only: ['ios'] },
      { text: 'Integrate FCM', link: 'push/push_fcm.html.html', only: ['android'] },
      { text: 'Integrate HarmonyOS Push', link: 'push/push_harmony.html', only: ['harmonyos'] },
        { text: '上传推送证书', link: 'push/push_easemob_console.html', only: ['react-native'] },
        { text: '上传推送证书及绑定推送信息', link: 'push/push_easemob_console.html', only: ['flutter'] },
        { text: '获取或更新推送 token', link: 'push/push_get_device_token.html', only: ['react-native'] },
        { text: '发送推送 token 到环信服务器', link: 'push/push_send_token_to_server.html', only: ['react-native'] },
        { text: 'Parse Push Notifications', link: 'push/push_parsing.html', only: ['android', 'ios'] },
        { text: 'Configure Notification Content',
            collapsible: true,
            children: [
              { text: 'Overview', link: 'push/push_display_overview.html'},
              { text: 'Configure Push Display', link: 'push/push_display_attribute.html' },
              { text: 'Use Message Extensions', link: 'push/push_display_field.html'},
            ],
             only: ['android', 'ios', 'react-native', 'flutter'] 
        },
        { text: '设置推送通知的显示属性', link: 'push/push_display_attribute.html', only: ['harmonyos'] },
        { text: 'Notification Mode & DND', link: 'push/push_notification_mode_dnd.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter']},
        { text: 'Push Template', link: 'push/push_template.html', only: ['android', 'ios', 'web', 'harmonyos', 'react-native', 'flutter']},
        // { text: 'Push Translation', link: 'push/push_translation.html', only: ['android', 'ios', 'web', 'react-native', 'flutter']},
        { text: 'Push Extension', link: 'push/push_extension.html', only: ['android', 'ios', 'web', 'react-native', 'flutter']},
        // { text: 'FAQ', link: 'push/push_solution.html', only: ['android', 'ios','harmonyos']},
      ],
  },
  { text: 'Error Codes', link: 'error.html'},
  { text: 'API Reference', link: 'apireference.html'},
  { type: "separator"} as any,
  { text: 'Release Notes', link: 'releasenote.html'},
  { text: 'Feature Limitations', link: 'limitation.html'},
  {
    text: 'FAQs',
    collapsible: true,
    children: [
      { text: 'Group @ Mentions', link: 'group_@.html', only: ['android', 'ios', 'web'] },
      { text: 'Message Quotes', link: 'message_quote.html', only: ['android', 'ios', 'web'] },
      { text: 'Typing Indicators', link: 'typing_indication.html', only: ['android', 'ios', 'web', 'react-native', 'flutter', 'unity', 'windows'] },
      { text: '鸿蒙端消息扩展升级', link: 'message_extension_optimize.html', only: ['harmonyos'] },
      { text: '其他问题', link: 'faq.html', only: ['harmonyos'] },
    ],
  },
  { text: 'Get SDK Logs', link: 'log.html', except: ['flutter'] },
  { text: 'FAQs', link: 'faq.html', only: ['react-native'] },
  { text: 'Lite SDK', link: 'elite_sdk.html', only: ['android', 'ios']},
  { text: 'Private Cloud SDK IP Address/Domain Configuration', link: 'private_ip_domain.html', only: ['android', 'ios', 'web', 'harmonyos']},
  // { text: 'Compliance Guide', link: 'sdk_compliance.html'},
  { text: 'Apple Privacy Policy', link: 'privacy_policy.html', only: ['ios'] },

]

function buildDocV5Sidebar() {
  const result = {}
  platformList.forEach(platform => {
    const key = `/sdk/v5/${platform}/`
    result[key] = sdkV5Sidebar.map(sidebar => handleSidebarItem(platform, sidebar)).filter(s => s)
  });
  result['/rest/'] = REST_SIDEBAR
  return result
}


function linkExists(platform: string, link: string): boolean {
  try {
    const docRoot = path.join(SDK_PATH, platform)
    const filePath = `${docRoot}/${link.replace(/.html$/, '.md')}`;
    return fs.existsSync(filePath);
  } catch (e) {
    console.error(`Error checking file existence: ${e}`);
    return false;
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
      const text = sidebar.text
      return {...sidebar, text, children: newchildren }
    }
  } else {
    if (linkExists(platform, sidebar.link)) {
      const basePath = `/sdk/v5/${platform}`
      const newLink = `${basePath}/${sidebar.link}`
      const text = platform === 'ios'
        ? getSdkDocumentTitle(platform, sidebar.link) || sidebar.text
        : sidebar.text
      return {...sidebar, text, link:newLink}
    }
  }
}

export const DOC_V5_SIDEBAR = buildDocV5Sidebar()

