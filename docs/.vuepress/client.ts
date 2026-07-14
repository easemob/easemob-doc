import { defineClientConfig } from "@vuepress/client";
import Container from "./components/Container.vue";
import Toc from "./components/Toc.vue";
import Link from "./components/Link.vue";
import ImageGallery from "./components/ImageGallery.vue";
import ImageItem from "./components/ImageItem.vue";
import WjxLayout from "./layouts/WjxLayout.vue";
import InstanceSearchLayout from "./layouts/InstanceSearchLayout.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "instantsearch.css/themes/algolia-min.css";
import InstantSearch from "vue-instantsearch/vue3/es/index.js";
import BiliBiliPlayer from "./components/BiliBili.vue";
import ImageHotspot from "./components/ImageHotspot.vue";
import DemoCard from "./components/DemoCard.vue";
import Step from "./components/Step.vue";
import FeedBack from "./components/Feedback.vue";
import { embedChatbot } from "./embed";

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    app.component("Container", Container);
    app.use(ElementPlus);
    app.component("Toc", Toc);
    app.component("ImageHotspot", ImageHotspot);
    app.component("Link", Link);
    app.component("ImageGallery", ImageGallery);
    app.component("ImageItem", ImageItem);
    app.component("BiliBiliPlayer", BiliBiliPlayer);
    app.use(InstantSearch);
    app.component("DemoCard", DemoCard);
    app.component("Step", Step);

    if (typeof window !== "undefined") {
      router.afterEach((to, from) => {
        // 关键点：只有在【路径切换】且【带有 Hash】时才触发
        // 如果只是同页面滚动导致的 Hash 变化，直接 ignore
        const isCrossPageNav = from.path !== to.path;

        if (isCrossPageNav && to.hash) {
          console.log('to.hash', to.hash);
          setTimeout(() => {
            const targetElement = document.querySelector(decodeURIComponent(to.hash));
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: "smooth" });
            }
          }, 350); // 略大于页面动画过度时间
        }
      });
    }
    
    
    if (typeof window !== "undefined") {
      embedChatbot();
    }
  },
  setup() {},
  layouts: {
    WjxLayout,
    InstanceSearchLayout,
  },
  rootComponents: [FeedBack],
});
