import { defineUserConfig, HeadConfig, UserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { hopeTheme } from 'vuepress-theme-hope'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { containerPlugin } from './markdown/plugin'
import theme from './theme.js'
import path from 'node:path'

// import type { DocSearchProps } from '@docsearch/react'

// type DocSearchClientLocaleOptions = Omit<
//   DocSearchProps,
//   'hitComponent' | 'navigator' | 'transformSearchClient'
// >

// interface DocSearchClientOptions extends DocSearchClientLocaleOptions {
//   locales?: Record<string, DocSearchClientLocaleOptions>
// }

// const defineDocSearchConfig: (options: DocSearchClientOptions) => void

const HOME_PATH = '/'
const HOME_TITLE = 'IM Integration_IM Development Doc_Instant Messaging Integration_EasyIM Documentation_EasyIM'
const HOME_KEYWORDS =
  'IM Integration, Instant Messaging Integration, EasyIM Development Documentation, Instant Messaging Development Documentation, Instant Messaging Access, EasyIM Documentation'
const HOME_DESCRIPTION =
  'The EasyIM documentation guides you through the complete EasyIM integration process. From quick-start guides to advanced feature development, it helps developers easily implement in-app messaging.'
const INNER_PAGE_TITLE_PREFIX = 'EasyIM Development '
const INNER_PAGE_TITLE_SUFFIX = '｜EasyIM Documentation'
const SEO_META_NAMES = new Set(['description', 'keywords'])

const sanitizeTitle = (title: string): string =>
  title
    .replace(/^EasyIM Development\s*/u, '')
    .replace(/\s*[|｜]\s*EasyIM Documentation$/u, '')
    .trim()

const createSeoHead = ({
  title,
  description,
  keywords
}: {
  title: string
  description?: string
  keywords?: string
}): HeadConfig[] => {
  const head: HeadConfig[] = [['title', {}, title]]

  if (description) {
    head.push(['meta', { name: 'description', content: description }])
  }

  if (keywords) {
    head.push(['meta', { name: 'keywords', content: keywords }])
  }

  return head
}

const mergeSeoHead = (
  existingHead: HeadConfig[] = [],
  nextHead: HeadConfig[]
): HeadConfig[] => {
  const preservedHead = existingHead.filter(([tag, attrs]) => {
    if (tag === 'title') return false
    if (tag !== 'meta') return true

    const metaName = attrs.name
    return typeof metaName !== 'string' || !SEO_META_NAMES.has(metaName)
  })

  return [...nextHead, ...preservedHead]
}

export default defineUserConfig({
  base: '/',
  lang: 'en-US',
  title: 'EasyIM Documentation',
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]],
  description: 'EasyIM Documentation',
  shouldPrefetch: false,
  bundler: viteBundler({
    viteOptions: {
      resolve: {
        alias: {
          '@static': path.resolve(__dirname, './public')
        }
      },
      plugins: [
        // AutoImport({
        //   resolvers: [ElementPlusResolver({})],
        // }),
        // Components({
        //   resolvers: [ElementPlusResolver({ssr: true })],
        // }),
      ]
    },
    vuePluginOptions: {}
  }),
  markdown: {
    headers: {
      level: [2, 3]
    },
    code:{
      lineNumbers:false
    }
  },
  extendsMarkdown: (md) => {
    containerPlugin(md)
  },
  extendsPage: (page) => {
    const isHomePage = page.path === HOME_PATH
    const pageBaseTitle = sanitizeTitle(page.title) || page.title.trim()
    const title = isHomePage
      ? HOME_TITLE
      : `${INNER_PAGE_TITLE_PREFIX}${pageBaseTitle}${INNER_PAGE_TITLE_SUFFIX}`
    const description = isHomePage
      ? HOME_DESCRIPTION
      : page.frontmatter.description
    const keywords = isHomePage ? HOME_KEYWORDS : undefined
    const head = mergeSeoHead(
      page.frontmatter.head,
      createSeoHead({ title, description, keywords })
    )

    page.frontmatter.head = head
    page.data.frontmatter.head = head
  },
  templateBuild: path.resolve(__dirname, './templates/index.build.html'),
  theme,
  onPrepared: async (app) => {
    await app.writeTemp(
      'pages.js',
      `export default ${JSON.stringify(app.pages.map(({ data }) => data))}`
    )
  },
  alias: {
    '@theme-hope/components/HomePage': path.resolve(
      __dirname,
      './components/HomePage.vue'
    ),

    '@theme-hope/modules/sidebar/components/Sidebar': path.resolve(
      __dirname,
      './components/Sidebar.vue'
    ),

    '@theme-hope/modules/navbar/components/Navbar': path.resolve(
      __dirname,
      './components/Navbar.vue'
    ),

    '@theme-hope/components/MarkdownContent': path.resolve(
      __dirname,
      './components/MarkdownContent.vue'
    ),

    '@theme-hope/components/BreadCrumb': path.resolve(
      __dirname,
      './components/BreadCrumb.vue'
    ),

    '@theme-hope/components/PageNav': path.resolve(
      __dirname,
      './components/PageNav.vue'
    )
  }
})
