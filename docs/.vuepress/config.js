const path = require('path');
const moment = require('moment');


module.exports = {
  shouldPrefetch: () => {
    return false
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@static': path.resolve(__dirname, '../../static')
      }
    }
  },
  // 头部 head 标签内添加的标签
  head: [
    // 标题栏 icon 图标
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  // 多语言
  locales: {
    // 中文
    '/': {
      lang: 'zh-CN',
      // 网页标题
      title: '环信 IM 文档',
      // 网页描述
      description: '环信即时通讯云最新集成文档，一天内即可帮APP快速集成聊天功能。 环信客户互动云集成文档，快速多渠道集成，为企业提供智能客服系统。',
    },
    // 英文
    '/en/': {
      lang: 'en-US',
      // 网页标题
      title: 'Easemob IM document',
      // 网页描述
      description: 'Easemob IM document'
    }
  },
  // 主题配置
  themeConfig: {
    repo: 'easemob/easemob-doc',
    docsDir: 'docs',
    editLinks: true,
    // 头部左上角 logo
    logo: '/logo.png',
    // 多语言切换
    switchLang: false,
    // 多语言
    locales: {
      // 中文
      '/': {
        // Github 编辑链接文字
        editLinkText: '帮助我们改善此页面！',
        // 首页地址
        indexUri: 'product/introduction.html',
        // 选择语言处文本
        selectText: '选择语言',
        // 选择语言下拉框中对应的中文文本
        label: '简体中文',
        // 主导航，logo 右侧导航
        main_nav: [
          /*
            text: 显示的文本
            link: 链接地址
            show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
          */
          { text: '产品简介', link: '/product/introduction.html' },
          { text: '集成文档', link: '/document/android/quickstart.html' },
          { text: 'API 参考', link: '/api/all/' },
          { text: '历史版本', link: 'https://docs-im.easemob.com/ccim/intro' },
          { text: '参与环信文档“捉虫”活动，领京东卡', link: 'https://www.imgeek.org/article/825360944' },
        ],
        // 次级导航，导航栏右侧导航
        secondary_nav: [
          /*
            text: 显示的文本
            link: 链接地址
            show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
          */
          { text: '提交工单', link: 'https://console.easemob.com/ticket' }
        ],
        // 额外导航，登录/注册
        extra_nav: [
          /*
            text: 显示的文本
            link: 链接地址
            show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
          */
          { text: '登录', link: 'https://console.easemob.com/user/login' },
          { text: '注册', link: 'https://console.easemob.com/user/register' }
        ],
        // API 参考页面上方标题、描述
        '/api/': {
          h2: 'API 参考',
          description: '查看环信 IM API 的详细信息',
        },
        // 侧边栏
        sidebar: {
          // 以 /product/ 开头的 url 侧边栏
          '/product/': [
            {
              /*
                title: 分组标题
                children: 分组导航列表
                  text: 显示的文本
                  link: 链接地址
                  show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
                  collapsable: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
                  children: 子菜单。请参考「子菜单示例」
              */
              title: '产品简介',
              children: [
                { text: '产品概述', link: 'introduction.html' },
                { text: 'IM 产品使用限制', link: 'limitation.html' },
                { text: '接口频率限制', link: 'limitationapi.html' },
                { text: '产品价格', link: 'pricing.html' },
                { text: '术语表', link: 'glossary.html' }
              ]
            },
            {
              title: '快速开始',
              children: [
                { text: '开通和配置服务 console', link: 'enable_and_configure_IM.html' },
                { text: '使用环信 App Token 鉴权', link: 'easemob_app_token.html' },
                { text: '使用环信 User Token 鉴权', link: 'easemob_user_token.html' },
                { text: '快速开始（不使用 UIKIT）Android', link: '/document/android/quickstart.html' },
                { text: '快速开始（不使用 UIKIT）iOS', link: '/document/ios/quickstart.html' },
                { text: '快速开始（不使用 UIKIT）Web', link: '/document/web/quickstart.html' }
              ]
            },
            {
              title: '私有化集成',
              children: [
                { text: 'SDK 及 Demo 下载', link: 'uc_private.html' },
                { text: '环信通下载', link: 'uc_overview.html' },
              ]
            },
            {
              title: '常见方案',
              children: [
                { text: '迁移到环信', link: 'migrate_to_easemob.html' },
              ]
            },
            {
              title: 'FAQ',
              children: [
                { text: 'FAQ 质量', link: 'faq_quality_issues.html' },
                { text: 'FAQ 集成', link: 'faq_integration_issues.html' },
                { text: '帮助中心', link: 'help.html' },
              ]
            },
            {
              title: '安全',
              children: [
                { text: '安全最佳实践', link: 'security_best_practices.html' },
                { text: 'GDPR 安全合规', link: 'GDPR.html' },
              ]
            },
            /* 
            // 子菜单示例
            {
              title: '基础功能',
              collapsable: false, // 是否允许展开/收起
              children: [
                {
                  text: '消息',
                  collapsable: false, // 是否允许展开/收起
                  children: [
                    { text: '消息概述', link: '' },
                    { text: '实现消息功能', link: '' }
                  ]
                },
                {
                  text: '群组',
                  collapsable: true, // 是否允许展开/收起
                  children: [
                    { text: '群组概述', link: '' },
                    { text: '实现消息群组', link: '' }
                  ]
                }
              ]
            }
             */
          ],
          // 以 /document/ 开头的 url 侧边栏
          '/document/': [
            {
              /*
                title: 分组标题
                children: 分组导航列表
                  text: 显示的文本
                  link: 链接地址
                  show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
                  only: 数组形式，只有在数组中的平台下显示
                  except: 数组形式，除了数组中指定的平台外都显示
                  collapsable: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
                  children: 子菜单。请参考「子菜单示例」
              */
              title: '快速开始',
              children: [
                { text: 'React Demo（WebIM）体验', link: 'demo_react.html', only: ['web'] },
                { text: 'Vue Demo（WebIM）体验', link: 'demo_vue.html', only: ['web'] },
                { text: 'Demo（EaseIM App）体验', link: 'demo.html', except: ['web', 'windows', 'react-native', 'flutter', 'unity', 'server-side'] },
                { text: '快速开始（不使用 EaseIMKIT）', link: 'quickstart.html', except: ['windows', 'react-native', 'flutter', 'unity', 'server-side'] },
                { text: '快速开始 （不使用 UIKit）', link: 'quickstart.html', only: ['windows', 'react-native', 'flutter', 'unity'] },
                { text: 'SDK 集成概述（不使用 EaseIMKIT）', link: 'overview.html', only: ['android', 'web', 'flutter'] },
                { text: 'SDK 集成概述（不使用 UIKit）', link: 'overview.html', only: ['windows', 'react-native', 'unity'] },
                { text: '私有云 SDK 集成配置', link: 'privatecloud.html', except: ['windows', 'react-native', 'flutter', 'unity'] },
                { text: 'SDK 更新日志', link: 'releasenote.html', except: ['server-side']},
                /*{ text: 'API reference', link: 'apireference.html', only: ['android', 'ios', 'web', 'windows', 'react-native', 'flutter', 'unity']},*/
                { text: '开通和配置服务 console', link: 'enable_and_configure_IM.html', only: ['server-side'] },
                { text: '使用环信 App Token 鉴权', link: 'easemob_app_token.html', only: ['server-side'] },
                { text: '使用环信 User Token 鉴权', link: 'easemob_user_token.html', only: ['server-side'] },
                { text: 'IM 产品使用限制', link: 'limitation.html', only: ['server-side'] },
                { text: '接口频率限制', link: 'limitationapi.html', only: ['server-side'] },
              ],
              except: ['applet']
            },
            {
              title: '基础功能',
              children: [
                {
                  text: '消息管理',
                  collapsable: true,
                  children: [
                    { text: '消息概述', link: 'message_overview.html' },
                    { text: '发送和接收消息', link: 'message_send_receive.html' },
                    { text: '管理本地消息数据', link: 'message_manage.html', except: ['web', 'react-native'] },
                    { text: '管理会话和消息', link: 'message_manage.html', only: ['react-native'] },
                    { text: '管理服务端消息', link: 'message_retrieve.html', except: ['react-native'] },
                    { text: '管理消息回执', link: 'message_receipt.html' },
                    { text: '翻译', link: 'message_translation.html' },
                  ]
                },
                { text: '管理用户属性', link: 'userprofile.html' },
                { text: '管理用户关系', link: 'user_relationship.html' },
                {
                  text: '群组管理',
                  collapsable: true,
                  children: [
                    { text: '群组概述', link: 'group_overview.html' },
                    { text: '创建和管理群组', link: 'group_manage.html' },
                    { text: '管理群组成员', link: 'group_members.html' },
                    { text: '管理群组属性', link: 'group_attributes.html' },
                  ]
                },
                {
                  text: '聊天室管理',
                  collapsable: true,
                  children: [
                    { text: '聊天室概述', link: 'room_overview.html' },
                    { text: '创建和管理聊天室', link: 'room_manage.html' },
                    { text: '管理聊天室成员', link: 'room_members.html' },
                    { text: '管理聊天室属性', link: 'room_attributes.html' },
                  ]
                },
              ],
              except: ['applet', 'server-side']
            },
            {
              title: '进阶功能',
              children: [
                { text: '设置推送', link: 'push.html', except: ['windows', 'react-native', 'flutter', 'unity'] },
                { text: '登录多个设备', link: 'multi_device.html' },
                { text: '管理在线状态订阅', link: 'presence.html' },
                { text: '消息表情回复', link: 'reaction.html' },
                {
                  text: '子区管理',
                  collapsable: true,
                  children: [
                    { text: '管理子区', link: 'thread.html' },
                    { text: '管理子区消息', link: 'thread_message.html' }
                  ]
                },
                { text: '消息审核（举报）', link: 'moderation.html', except: ['react-native', 'flutter'] },
                { text: '消息举报', link: 'moderation.html', only: ['react-native', 'flutter'] },
              ],
              except: ['applet', 'server-side']
            },
            {
              title: '其他',
              children: [
                { text: '错误码', link: 'error.html' },
                { text: 'EaseIMKit 使用指南', link: 'easeimkit.html', except: ['web', 'windows', 'react-native', 'flutter', 'unity'] },
                { text: 'EaseCallKit 使用指南', link: 'easecallkit.html', except: ['web', 'windows', 'react-native', 'flutter', 'unity'] },
              ],
              except: ['applet', 'server-side']
            },
            {
              title: '产品介绍',
              children: [
                { text: '环信小程序全平台解决方案', link: 'overview.html' },
                { text: '小程序 SDK 更新日志', link: 'releasenote.html' },
              ],
              only: ['applet']
            },
            {
              title: '集成介绍',
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
              title: '基本功能',
              children: [
                { text: '初始化及登录', link: 'initialization.html' },
                {
                  text: '消息管理',
                  collapsable: true,
                  children: [
                    { text: '消息概述', link: 'message_overview.html' },
                    { text: '发送和接收消息', link: 'message_send_receive.html' },
                    { text: '管理服务端消息', link: 'message_retrieve.html' },
                    { text: '管理消息回执', link: 'message_receipt.html' },
                    { text: '翻译', link: 'message_translation.html' },
                  ]
                },
                { text: '用户属性', link: 'userprofile.html' },
                { text: '好友管理', link: 'user_relationship.html' },
                {
                  text: '群组管理',
                  collapsable: true,
                  children: [
                    { text: '群组概述', link: 'group_overview.html' },
                    { text: '创建和管理群组', link: 'group_manage.html' },
                    { text: '管理群组成员', link: 'group_members.html' },
                    { text: '管理群组属性', link: 'group_attributes.html' },
                  ]
                },
                {
                  text: '聊天室管理',
                  collapsable: true,
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
              title: '其他帮助',
              children: [
                { text: 'Uniapp 生成原生 Android、iOS 应用', link: 'uniappnativeapp.html' },
                { text: '小程序模板使用指南', link: 'uniappuikit.html' },
                { text: '如何配置服务器域名', link: 'serverconfig.html' },
              ],
              only: ['applet']
            },
            {
              title: '服务端 REST API',
              children: [
                { text: '即时通讯 REST API 概览', link: 'overview.html' },
                { text: '用户体系管理', link: 'account_system.html' },
                { text: '推送设置', link: 'push.html' },
                { text: '消息管理', link: 'message.html' },
                { text: '用户属性', link: 'userprofile.html' },
                { text: '用户关系管理', link: 'user_relationship.html' },
                { text: '群组', link: 'group.html' },
                { text: '聊天室', link: 'chatroom.html' },
                { text: '在线状态订阅', link: 'presence.html' },
                { text: '消息表情回复', link: 'reaction.html' },
              ],
              only: ['server-side']
            },
            {
              title: 'Server SDK',
              children: [
                { text: 'Java Server SDK', link: 'java_server_sdk.html' },
                { text: 'PHP Server SDK', link: 'php_server_sdk.html' },
              ],
              only: ['server-side']
            },
            {
              title: '错误码',
              children: [
                { text: '错误码', link: 'error.html' }
              ],
              only: ['server-side']
            },
            {
              title: '设置回调',
              children: [
                { text: '设置回调', link: 'callback.html' },
                { text: '用户状态回调', link: 'user_status_callback.html' },
                { text: '发送后回调-事件回调', link: 'callback_configurations.html' }
              ],
              only: ['server-side']
            }
          ]
        },
        // 平台选择
        platform: [
          {
            /*
              title: 分组标题
              children: 分组平台列表
                key: key
                title: 标题
                icon: 默认图标
                hover_icon: 鼠标滑过及选中状态下图标
                uri: 链接地址
              show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
              only: 数组形式，只有在指定路径下显示
              except: 数组形式，除了数组中指定的路径外都显示
            */
            title: '',
            children: [
              {
                key: 'all',
                title: '全部平台',
                icon: 'icon-platform.svg',
                hover_icon: 'icon-platform-hover.svg',
                uri: ''
              }
            ],
            only: ['api']
          },
          {
            title: '平台',
            children: [
              {
                key: 'android',
                title: 'Android',
                icon: 'icon-Android.svg',
                hover_icon: 'icon-Android-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'ios',
                title: 'iOS',
                icon: 'icon-iOS.svg',
                hover_icon: 'icon-iOS-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'web',
                title: 'Web',
                icon: 'icon-web.svg',
                hover_icon: 'icon-web-hover.png',
                uri: 'quickstart.html'
              },
              {
                key: 'windows',
                title: 'Windows',
                icon: 'icon-windows.svg',
                hover_icon: 'icon-windows-hover.svg',
                uri: 'quickstart.html'
              },
            ]
          },
          {
            title: '框架',
            children: [
              {
                key: 'react-native',
                title: 'React Native',
                icon: 'icon-ReactNative.svg',
                hover_icon: 'icon-ReactNative-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'flutter',
                title: 'Flutter',
                icon: 'icon-flutter.svg',
                hover_icon: 'icon-flutter-hover.png',
                uri: 'quickstart.html'
              },
              {
                key: 'unity',
                title: 'Unity',
                icon: 'icon-unity.svg',
                hover_icon: 'icon-unity-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'applet',
                title: '小程序',
                icon: 'icon-mini-program.svg',
                hover_icon: 'icon-mini-program-hover.svg',
                uri: 'overview.html'
              },
            ]
          },
          {
            title: '',
            children: [
              {
                key: 'server-side',
                title: '服务端',
                icon: 'icon-server-dark.png',
                hover_icon: 'icon-server-light.png',
                uri: 'enable_and_configure_IM.html'
              }
            ],
            only: ['document']
          }
        ],
        lastUpdated: '更新时间：'
      },
      // English
      '/en/': {
        // Github 编辑链接文字
        editLinkText: 'Edit this page',
        // 首页地址
        indexUri: 'product/introduction.html',
        // 选择语言处文本
        selectText: 'Languages',
        // 选择语言下拉框中对应的 English 文本
        label: 'English',
        // 主导航，logo 右侧导航
        main_nav: [
          /*
            text: 显示的文本
            link: 链接地址
            show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
          */
          { text: 'Product introduction', link: '/en/product/introduction.html' },
          { text: 'Integration document', link: '/en/document/android/quickstart.html' },
          { text: 'API reference', link: '/en/api/all/' },
        ],
        // 次级导航，导航栏右侧导航
        secondary_nav: [
          /*
            text: 显示的文本
            link: 链接地址
            show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
          */
          { text: 'Submit ticket', link: '/' }
        ],
        // 额外导航，登录/注册
        extra_nav: [
          /*
            text: 显示的文本
            link: 链接地址
            show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
          */
          { text: 'Log In', link: '/' },
          { text: 'Sign Up', link: '/' }
        ],
        // API 参考页面上方标题、描述
        '/api/': {
          h2: 'API Reference',
          description: 'View the details of Huanxin im API.',
        },
        // 侧边栏
        sidebar: {
          // 以 /product/ 开头的 url 侧边栏
          '/product/': [
            {
              /*
                title: 分组标题
                children: 分组导航列表
                  text: 显示的文本
                  link: 链接地址
                  show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
                  collapsable: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
                  children: 子菜单。请参考「子菜单示例」
              */
              title: 'Product introduction',
              children: [
                { text: 'Product overview', link: 'introduction.html' },
                { text: 'Use restrictions', link: 'limitation.html' },
                { text: 'Interface frequency limit', link: 'limitationapi.html' },
                { text: 'Product price', link: 'pricing.html' },
                { text: 'Glossary', link: 'glossary.html' }
              ]
            },
            /*
            子菜单示例
            {
              title: 'Basic functions',
              collapsable: false, // 是否允许展开/收起
              children: [
                {
                  text: 'News',
                  collapsable: false, // 是否允许展开/收起
                  children: [
                    { text: 'Message overview', link: '' },
                    { text: 'Realize message function', link: '' }
                  ]
                },
                {
                  text: 'Group',
                  collapsable: true, // 是否允许展开/收起
                  children: [
                    { text: 'Group overview', link: '' },
                    { text: 'Implement message groups', link: '' }
                  ]
                }
              ]
            }
            */
          ],
          // 以 /document/ 开头的 url 侧边栏
          '/document/': [
            {
              /*
                title: 分组标题
                children: 分组导航列表
                  text: 显示的文本
                  link: 链接地址
                  show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
                  only: 数组形式，只有在数组中的平台下的显示
                  except: 数组形式，除了数组中指定的平台外都显示
                  collapsable: 子菜单是否允许展开/收起，true: 允许; false: 不允许。请参考「子菜单示例」
                  children: 子菜单。请参考「子菜单示例」
              */
              title: 'Quick start',
              children: [
                { text: 'Quick start', link: 'quickstart.html', only: ['android', 'ios'] },
                { text: 'SDK logs', link: 'releasenotes.html', except: ['ios'] }
              ]
            },
          ]
        },
        // 平台选择
        platform: [
          {

            /*
              title: 分组标题
              children: 分组平台列表
                key: key
                title: 标题
                icon: 默认图标
                hover_icon: 鼠标滑过及选中状态下图标
                uri: 链接地址
              show: 不存在或者值为 true 时，菜单显示；存在并且值为 false 时，菜单不显示
              only: 数组形式，只有在指定路径下显示
              except: 数组形式，除了数组中指定的路径外都显示
            */
            title: '',
            children: [
              {
                key: 'all',
                title: 'All Platforms',
                icon: 'icon-platform.svg',
                hover_icon: 'icon-platform-hover.svg',
                uri: ''
              }
            ],
            only: ['api']
          },
          {
            title: 'Platform',
            children: [
              {
                key: 'android',
                title: 'Android',
                icon: 'icon-Android.svg',
                hover_icon: 'icon-Android-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'ios',
                title: 'iOS',
                icon: 'icon-iOS.svg',
                hover_icon: 'icon-iOS-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'web',
                title: 'Web',
                icon: 'icon-web.svg',
                hover_icon: 'icon-web-hover.png',
                uri: 'quickstart.html'
              },
              {
                key: 'windows',
                title: 'Windows',
                icon: 'icon-windows.svg',
                hover_icon: 'icon-windows-hover.svg',
                uri: 'quickstart.html'
              },
            ]
          },
          {
            title: 'Framework',
            children: [
              {
                key: 'react-native',
                title: 'React Native',
                icon: 'icon-ReactNative.svg',
                hover_icon: 'icon-ReactNative-hover.svg',
              },
              {
                key: 'flutter',
                title: 'Flutter',
                icon: 'icon-flutter.svg',
                hover_icon: 'icon-flutter-hover.png',
              },
              {
                key: 'unity',
                title: 'Unity',
                icon: 'icon-unity.svg',
                hover_icon: 'icon-unity-hover.svg',
              },
              {
                key: 'applet',
                title: 'Applet',
                icon: 'icon-mini-program.svg',
                hover_icon: 'icon-mini-program-hover.svg',
              },
            ]
          },
          {
            title: '',
            children: [
              {
                key: 'server-side',
                title: 'Server-side',
                icon: 'icon-server-dark.png',
                hover_icon: 'icon-server-light.png',
              }
            ]
          }
        ],
        lastUpdated: 'Last Updated: '
      }
    },
    sidebarDepth: 2,
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    prevLinks: true
  },
  markdown: {
    toc: {
      includeLevel: [2, 3]
    },
    extractHeaders: [ 'h2', 'h3', 'h4' ],
  },
  plugins: [
    [
      require('./addons/vuepress-plugin-code-copy'),
      {
        selector: '.extra-class'
      }
    ],
    [
      '@vuepress/search',
      {
        searchMaxSuggestions: 10
      }
    ],
    ['fulltext-search'],
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          moment.locale(lang)
          return moment(timestamp).utc(+8).format('YYYY-MM-DD HH:mm:ss')
        },
        dateOptions:{
          hour12: false
        }
      }
    ],
    ['vuepress-plugin-smooth-scroll'],
    // you can use this plugin multiple times
    [
      'vuepress-plugin-container',
      {
        type: 'details',
        before: info => `<details class="custom-details"><summary>${info}</summary>`,
        after: '</details>',
      },
    ],

    [
      'vuepress-plugin-container',
      {
        type: 'button-group',
        before: info => `<div class="button-group">`,
        after: '</div>',
      },
    ],

    // this is how VuePress Default Theme use this plugin
    [
      'vuepress-plugin-container',
      {
        type: 'tip',
        defaultTitle: {
          '/': '提示',
          '/en/': 'TIP',
        },
      },
    ],
    [
      'vuepress-plugin-container',
      {
        type: 'notice',
        defaultTitle: {
          '/': '注意',
          '/en/': 'NOTICE',
        },
      },
    ],
    [
      'vuepress-plugin-container',
      {
        type: 'warning',
        defaultTitle: {
          '/': '警告',
          '/en/': 'WARNING',
        },
      },
    ],
    [
      'vuepress-plugin-container',
      {
        type: 'danger',
        defaultTitle: {
          '/': '危险',
          '/en/': 'DANGER',
        },
      },
    ],
  ]
}
