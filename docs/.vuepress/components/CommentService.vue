<script setup lang="ts">
import { Content } from '@vuepress/client'
import { usePageData } from '@vuepress/client'
import { ref, onMounted, onUnmounted, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import 'artalk/dist/Artalk.css'
import Artalk from 'artalk'

let artalk = null
const commentRef = ref(null)
const pageData = usePageData()
const route = useRoute()
const frontmatter = pageData.value.frontmatter

onMounted(() => {
  artalk = Artalk.init({
    el: commentRef.value, // 绑定元素的 Selector
    darkMode: false, // 默认 false, 设置为 true 则开启暗色模式
    pageKey: 'https://doc.easemob.com' + pageData.value.path, // 链接地址,
    useBackendConf: true,
    pageTitle: pageData.value.title, // 页面标题 (留空自动获取)
    server: 'https://doc-comment.easemob.com', // 后端地址
    site: '环信文档', // 你的站点名
  })
})

onUnmounted(() => {
  artalk?.destroy()
})
</script>

<template>
  <div class="comment-container">
    <div ref="commentRef"></div>
  </div>
</template>

<style scoped>
.comment-container {
  padding: 0 2.5rem;
}

@media screen and (max-width: 959px) {
  .comment-container {
    padding: 0 1.5rem;
  }
}
</style>
