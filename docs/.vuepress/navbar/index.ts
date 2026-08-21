import { navbar } from 'vuepress-theme-hope'

export const zhNavbar = navbar([
  { text: 'Product Introduction', link: '/product/introduction.html' },
  {
    text: 'SDK',
    children: [
      {
        text: 'Clients',
        children: [
          { text: 'Android', icon: '/icon-Android.svg', link: '/sdk/v5/android/beginner_guide.html' },
          { text: 'iOS', icon: '/icon-iOS.svg', link: '/sdk/v5/ios/beginner_guide.html' },
          { text: 'Web', icon: '/icon-web.svg', link: '/sdk/v5/web/beginner_guide.html' }
        ]
      }
    ]
  },
  { text: 'Server APIs', link: '/rest/overview.html' }
])
