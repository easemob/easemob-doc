import { defineClientConfig } from '@vuepress/client'
import Container from './components/Container.vue'
import Toc from './components/Toc.vue'
import Link from './components/Link.vue'
import ImageGallery from './components/ImageGallery.vue'
import ImageItem from './components/ImageItem.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('Container', Container)
    app.use(ElementPlus)
    app.component('Toc', Toc)
    app.component('Link', Link)
    app.component('Link', Link)
    app.component('ImageGallery', ImageGallery)
    app.component('ImageItem', ImageItem)
  },
  setup() {},
  rootComponents: [],
})
