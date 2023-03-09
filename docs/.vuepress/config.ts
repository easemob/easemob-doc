import { defineUserConfig, UserConfig } from "vuepress";
import { viteBundler } from '@vuepress/bundler-vite'
// import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'
import { containerPlugin } from './markdown/plugin'
import theme from "./theme.js";
import path from "node:path"


export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  title: "环信 IM 文档",
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  description: "vuepress-theme-hope 的文档演示",
  bundler: viteBundler({
    viteOptions: {
      plugins: [
        // AutoImport({
        //   resolvers: [ElementPlusResolver({})],
        // }),
        // Components({
        //   resolvers: [ElementPlusResolver({ssr: true })],
        // }),
      ],

    },
    vuePluginOptions: {
    },
  }),
  markdown: {
    headers: {
      level: [2, 3]
    },
  },
  extendsMarkdown: (md)=> {
    containerPlugin(md)
  },
  theme,
  plugins: [
    docsearchPlugin({
      appId: '5K8UTB3JVE',
      apiKey: 'df9e938d06f6531ce8dd8de71f907f0d',
      indexName: 'im-beta-easemob',
      placeholder: '搜索文档',
      translations: {
        button: {
          buttonText: '搜索'
        }
      },
      // transformItems(items){
      //   return items.map(items=>({ ...items, content: 'xxxxx'}))
      // }
    }),
  ],
  onPrepared: async (app) => {
    await app.writeTemp(
      'pages.js',
      `export default ${JSON.stringify(app.pages.map(({ data }) => data))}`
    )
  },
  alias: {
    "@theme-hope/components/HomePage": path.resolve(
      __dirname,
      "./components/HomePage.vue"
    ),
    // "@theme-hope/components/CommonWrapper": path.resolve(
    //   __dirname,
    //   "./components/CommonWrapper.vue"
    // ),

    "@theme-hope/modules/sidebar/components/Sidebar": path.resolve(
      __dirname,
      "./components/Sidebar.vue"
    ),

    "@theme-hope/modules/navbar/components/Navbar": path.resolve(
      __dirname,
      "./components/Navbar.vue"
    ),

    "@theme-hope/components/MarkdownContent": path.resolve(
      __dirname,
      "./components/MarkdownContent.vue"
    )
  },
});
