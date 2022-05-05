module.exports = {
  base: '/vuepress/',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'VuePress 中文',
      description: 'Vue 驱动的静态网站生成器',
    },
    '/en/': {
      lang: 'en-US',
      title: 'VuePress English',
      description: 'Vue-powered Static Site Generator'
    }
  },
  themeConfig: {
    logo: '/logo.svg',
    locales: {
      '/': {
        selectText: '选择语言',
        label: '简体中文',
        nav: [
          { text: '指南', link: '/guide/' },
          { text: '外链', link: 'https://google.com' },
        ],
        sidebar: [
          {
            title: '组 1',
            collapsable: false, // 是否允许展开/收起
            children: [
              ['/guide/', '指南']
            ]
          },
          {
            title: '组 2',
            collapsable: false, // 是否允许展开/收起
            children: [
              ['/config.html', '配置']
            ]
          }
        ]
      },
      '/en/': {
        selectText: 'Languages',
        label: 'English',
        nav: [
          { text: 'Guide', link: '/en/guide/' },
          { text: 'External', link: 'https://google.com' },
        ],
        sidebar: [
          {
            title: 'Group 1',
            collapsable: false, // 是否允许展开/收起
            children: [
              ['/en/guide/', 'Guide']
            ]
          },
          {
            title: 'Group 2',
            collapsable: false, // 是否允许展开/收起
            children: [
              ['/en/config.html', 'Config']
            ]
          }
        ]
      }
    },
    sidebarDepth: 1,
    search: true,
    lastUpdated: 'Last Updated',
    // 默认值是 true 。设置为 false 来禁用所有页面的 下一篇 链接
    nextLinks: true,
    // 默认值是 true 。设置为 false 来禁用所有页面的 上一篇 链接
    prevLinks: true
  },
  markdown: {
    lineNumbers: true
  }
}
