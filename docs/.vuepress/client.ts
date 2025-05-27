import { defineClientConfig } from '@vuepress/client'
import Container from './components/Container.vue'
import Toc from './components/Toc.vue'
import Link from './components/Link.vue'
import ImageGallery from './components/ImageGallery.vue'
import ImageItem from './components/ImageItem.vue'
import WjxLayout from './layouts/WjxLayout.vue'
import InstanceSearchLayout from './layouts/InstanceSearchLayout.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'instantsearch.css/themes/algolia-min.css'
import InstantSearch from 'vue-instantsearch/vue3/es/index.js'
import BiliBiliPlayer from './components/BiliBili.vue'
import DemoCard from './components/DemoCard.vue'
import { embedChatbot } from "./embed"

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component('Container', Container)
    app.use(ElementPlus)
    app.component('Toc', Toc)
    app.component('Link', Link)
    app.component('ImageGallery', ImageGallery)
    app.component('ImageItem', ImageItem)
    app.component('BiliBiliPlayer', BiliBiliPlayer)
    app.use(InstantSearch)
    app.component('DemoCard', DemoCard)

    if (typeof window !== "undefined") {
      embedChatbot();
    }
  },
  setup() {},
  layouts: {
    WjxLayout,
    InstanceSearchLayout
  },
  rootComponents: []
})