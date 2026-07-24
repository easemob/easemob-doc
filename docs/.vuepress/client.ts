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
      embedChatbot();

      // 发布后旧 hash chunk 被删，路由懒加载失败时整页跳到目标路径；同一路径只跳一次，避免死循环
      const chunkReloadKey = "vuepress:chunk-reload";
      const isChunkLoadError = (error: unknown) =>
        /dynamically imported module|importing a module script failed|loading chunk .+ failed/i.test(
          String((error as Error)?.message ?? error)
        );

      router.onError((error, to) => {
        if (!isChunkLoadError(error)) return;
        if (sessionStorage.getItem(chunkReloadKey) === to.fullPath) return;

        sessionStorage.setItem(chunkReloadKey, to.fullPath);
        const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (current === to.fullPath) {
          window.location.reload();
          return;
        }
        window.location.href = to.fullPath;
      });
      router.afterEach((to) => {
        if (sessionStorage.getItem(chunkReloadKey) === to.fullPath) {
          sessionStorage.removeItem(chunkReloadKey);
        }
      });
    }
  },
  setup() {},
  layouts: {
    WjxLayout,
    InstanceSearchLayout,
  },
  rootComponents: [FeedBack],
});
