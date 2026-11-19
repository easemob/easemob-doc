export const SEARCH_SIDEBAR = [
  { text: '服务介绍', link: '/value-added/search/message_search_overview.html' },
  {
    text: '计费说明',
    collapsible: true,
    defaultOpen: false,
    children: [
      { text: '国内计费说明', link: '/value-added/search/message_search_billing_domestic.html' },
      { text: '海外计费说明', link: '/value-added/search/message_search_billing_overseas.html' },
    ],
  },
  {
    text: '集成指南',
    collapsible: true,
    defaultOpen: true,
    children: [
      { text: 'Android', link: '/value-added/search/message_search_android.html' },
      { text: 'iOS', link: '/value-added/search/message_search_ios.html' },
      { text: 'Web/小程序', link: '/value-added/search/message_search_web.html' },
      { text: 'HarmonyOS', link: '/value-added/search/message_search_harmonyos.html' },
      { text: 'Flutter', link: '/value-added/search/message_search_flutter.html' },
      { text: 'React Native', link: '/value-added/search/message_search_rn.html' },
      { text: '服务端', link: '/value-added/search/message_search_rest.html' },
    ],
  },
]
