import { defineClientConfig } from '@vuepress/client'
import Container from './components/Container.vue'
import Toc from './components/Toc.vue'
import Link from './components/Link.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('Container', Container)
    app.use(ElementPlus)
    app.component('Toc', Toc)
    app.component('Link', Link)
  },
  setup() {},
  rootComponents: [],
})