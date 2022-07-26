const path = require('path');

module.exports = {
  base: '/vuepress/',
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
    repo: 'maniacflow/vuepress',
    docsDir: 'docs',
    editLinks: true,
    // 头部左上角 logo
    logo: '/logo.png',
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
          { text: '集成文档', link: '/document/Android/quickstart.html' },
          { text: 'API 参考', link: '/api/Android' },
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
                { text: '使用限制', link: 'limitation.html' },
                { text: '接口频率限制', link: 'limitationapi.html' },
                { text: '产品价格', link: 'pricing.html' },
                { text: '术语表', link: 'glossary.html' }
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
                { text: 'Demo（EaseIM App）', link: 'demo.html' },
                { text: '快速开始（不使用 EaseIMKIT）', link: 'quickstart.html', except: ['Android'] },
              ]
            },
            {
              title: '基础功能',
              children: [
                {
                  text: '消息概述',
                  link: 'message_overview.html',
                  children: [
                    { text: '发送和接收消息', link: 'send_and_receive_message.html' },
                    { text: '管理本地消息数据', link: 'manage_message.html' },
                    { text: '从服务器获取消息（消息漫游）', link: 'message_retrieve.html' },
                    { text: '管理消息回执', link: 'message_receipt.html' },
                    { text: '翻译', link: 'message_translation.html' },
                  ]
                },
                { text: '管理用户属性', link: 'userprofile.html' },
                { text: '管理用户关系', link: 'user_relationship.html' },
                {
                  text: '群组概述',
                  link: 'group_overview.html',
                  children: [
                    { text: '创建和管理群组', link: 'create_and_manage_group.html' },
                    { text: '管理群组成员', link: 'manage_group_member.html' },
                    { text: '管理群组属性', link: 'group_attributes.html' },
                  ]
                },
                {
                  text: '聊天室概述',
                  link: 'chatroom_overview.html',
                  collapsable: true,
                  children: [
                    { text: '创建和管理聊天室', link: 'create_and_manage_chatroom.html' },
                    { text: '管理聊天室成员', link: 'manage_chatroom_member.html' },
                    { text: '管理聊天室属性', link: 'chatroom_attributes.html' },
                  ]
                },
              ]
            },
            {
              title: '进阶功能',
              children: [
                { text: '登录多个设备', link: 'multi_device.html' },
                { text: '管理在线状态订阅', link: 'presence.html' },
                { text: '消息表情回复', link: 'reaction.html' },
                {
                  text: '管理子区',
                  link: 'chat_thread.html',
                  children: [
                    { text: '管理子区消息', link: 'message_thread.html' }
                  ]
                },
                { text: '消息审核', link: 'moderation.html' },
              ]
            },
            {
              title: '其他',
              children: [
                { text: '错误码', link: 'error_code.html' }
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
                key: 'All',
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
                key: 'Android',
                title: 'Android',
                icon: 'icon-Android.svg',
                hover_icon: 'icon-Android-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'iOS',
                title: 'iOS',
                icon: 'icon-iOS.svg',
                hover_icon: 'icon-iOS-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'Web',
                title: 'Web',
                icon: 'icon-web.svg',
                hover_icon: 'icon-web-hover.png',
                uri: 'quickstart.html'
              },
              {
                key: 'Windows',
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
                key: 'Mini-program',
                title: '小程序',
                icon: 'icon-mini-program.svg',
                hover_icon: 'icon-mini-program-hover.svg',
              },
              {
                key: 'Flutter',
                title: 'Flutter',
                icon: 'icon-flutter.svg',
                hover_icon: 'icon-flutter-hover.png',
              },
              {
                key: 'React-Native',
                title: 'React Native',
                icon: 'icon-ReactNative.svg',
                hover_icon: 'icon-ReactNative-hover.svg',
              },
            ]
          },
          {
            title: '',
            children: [
              {
                key: 'Server-side',
                title: '服务端',
                icon: 'icon-server-dark.png',
                hover_icon: 'icon-server-light.png',
              }
            ]
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
          { text: 'Integration document', link: '/en/document/Android/quickstart.html' },
          { text: 'API reference', link: '/en/api/Android/' },
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
                { text: 'Quick start', link: 'quickstart.html', only: ['Android', 'iOS'] },
                { text: 'SDK logs', link: 'releasenotes.html', except: ['iOS'] }
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
                key: 'All',
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
                key: 'Android',
                title: 'Android',
                icon: 'icon-Android.svg',
                hover_icon: 'icon-Android-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'iOS',
                title: 'iOS',
                icon: 'icon-iOS.svg',
                hover_icon: 'icon-iOS-hover.svg',
                uri: 'quickstart.html'
              },
              {
                key: 'Web',
                title: 'Web',
                icon: 'icon-web.svg',
                hover_icon: 'icon-web-hover.png',
                uri: 'quickstart.html'
              },
              {
                key: 'Windows',
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
                key: 'Mini-program',
                title: 'Mini program',
                icon: 'icon-mini-program.svg',
                hover_icon: 'icon-mini-program-hover.svg',
              },
              {
                key: 'Flutter',
                title: 'Flutter',
                icon: 'icon-flutter.svg',
                hover_icon: 'icon-flutter-hover.png',
              },
              {
                key: 'React-Native',
                title: 'React Native',
                icon: 'icon-ReactNative.svg',
                hover_icon: 'icon-ReactNative-hover.svg',
              },
            ]
          },
          {
            title: '',
            children: [
              {
                key: 'Server-side',
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
    searchMaxSuggestions: 20,
    sidebarDepth: 2,
    search: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    prevLinks: true
  },
  markdown: {
    extractHeaders: [ 'h2', 'h3', 'h4' ],
  },
  plugins: [
    [
      require('./addons/vuepress-plugin-code-copy'),
      {
        selector: '.extra-class'
      }
    ],
    ['fulltext-search'],
    ['@vuepress/last-updated'],
    ['vuepress-plugin-table-of-contents'],
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
