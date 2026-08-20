import { navbar } from 'vuepress-theme-hope'

export const zhNavbar = navbar([
  { text: '产品介绍', link: '/product/introduction.html' },
  {
    text: 'SDK',
    children: [
      {
        text: '客户端',
        children: [
          { text: 'Android', icon: '/icon-Android.svg', link: '/sdk/v5/android/beginner_guide.html' },
          { text: 'iOS', icon: '/icon-iOS.svg', link: '/sdk/v5/ios/beginner_guide.html' },
          { text: 'Web', icon: '/icon-web.svg', link: '/sdk/v5/web/beginner_guide.html' }
        ]
      }
    ]
  },
  { text: '服务端', link: '/rest/overview.html' }
])
